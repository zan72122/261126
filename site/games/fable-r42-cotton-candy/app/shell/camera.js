// カメラの構図：主役（回転釜＋割り箸のわたあめ）の大きさから距離を決め、場面ごとの構図を減衰付きでつなぐ。
//   ・画角は画面の短い辺で決める（横長は縦の画角、縦長は横の画角）
//   ・主役の外形の点を画面に投げ、短い辺に占める割合が frac になる距離を二分法で求める
//   ・主役の中心は「レンズのずらし」（setViewOffset）で画面の決めた位置へ置く（傾けないので歪まない）
//   ・焦点・距離・見下ろす角・ずらしを、臨界減衰のばねで別々に追う（行き過ぎない・揺れない）
import { PAN, PAN_ORIGIN, CUSTOMER, RACK, COUNTER, LENS, SHOTS, FACE } from './layout.js';

const DEG = Math.PI / 180;

// 臨界減衰のばね（厳密解）：s = { x, v } を target へ。行き過ぎない
function damp(s, target, w, dt) {
  const x0 = s.x - target, e = Math.exp(-w * dt), k = (s.v + w * x0) * dt;
  s.x = target + (x0 + k) * e;
  s.v = (s.v - w * k) * e;
}

export function createCameraRig(THREE, camera) {
  const V3 = THREE.Vector3;
  const O = new V3(...PAN_ORIGIN);
  // ---- 主役の外形の点（釜の縁の上と下の輪）。わたあめは毎フレーム足す
  const panPts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    panPts.push(new V3(O.x + c * PAN.outerRadius, O.y + PAN.rimY + 0.004, O.z + s * PAN.outerRadius));
    panPts.push(new V3(O.x + c * (PAN.outerRadius - 0.01), O.y + PAN.floorY - 0.02, O.z + s * (PAN.outerRadius - 0.01)));
  }
  // ---- 渡す場面：釜＋お客さん（立ち位置）＋棚の手前側
  const counterPts = panPts.map(p => p.clone());
  {
    const cx = CUSTOMER.pos[0], cz = CUSTOMER.pos[2];
    for (const dx of [-0.24, 0.24]) for (const y of [0.95, 1.48]) counterPts.push(new V3(cx + dx, y, cz));
    for (const x of [RACK.pos[0] - 0.06, RACK.pos[0] + RACK.slotStep * 3]) counterPts.push(new V3(x, COUNTER.top + 0.2, RACK.pos[2]));
  }

  const st = {
    shot: 'work', aspect: 1, portrait: false, tanX: 0.36, tanY: 0.36,
    fx: { x: O.x, v: 0 }, fy: { x: O.y, v: 0 }, fz: { x: O.z, v: 0 },
    dist: { x: 1.5, v: 0 }, pitch: { x: SHOTS.work.pitch * DEG, v: 0 },
    sx: { x: 0, v: 0 }, sy: { x: 0, v: 0 },
    snap: true, heroFrac: 0, w: 1, h: 1,
  };
  const fwd = new V3(), up = new V3(), right = new V3(1, 0, 0), tmp = new V3(), focus = new V3();
  const pts = [];
  const face = new V3(CUSTOMER.pos[0], FACE.y, CUSTOMER.pos[2]);
  const candyC = new V3(), candyPts = Array.from({ length: 6 }, () => new V3());
  let candyR = 0;

  function basis(pitch) {
    fwd.set(0, -Math.sin(pitch), -Math.cos(pitch));
    up.set(0, Math.cos(pitch), -Math.sin(pitch));
  }

  // 主役の点を集める（わたあめは釜の中心の真上に置いて数える：かき混ぜる手の動きで構図が揺れないように）
  function gather(subject) {
    pts.length = 0;
    const base = subject === 'counter' ? counterPts : panPts;
    for (const p of base) pts.push(p);
    if (subject === 'hero' && candyR > 0.005) {
      // 球を、カメラの右・上・手前の6点で近似
      const axes = [right, up, fwd];
      for (let i = 0; i < 6; i++) pts.push(candyPts[i].copy(candyC).addScaledVector(axes[i >> 1], (i & 1 ? -1 : 1) * candyR));
    }
    return pts;
  }

  // 点の組を画面に投げた時の範囲（焦点 f、距離 d、今の basis）
  const box = { x0: 0, x1: 0, y0: 0, y1: 0 };
  function project(list, f, d) {
    box.x0 = box.y0 = Infinity; box.x1 = box.y1 = -Infinity;
    for (const p of list) {
      tmp.subVectors(p, f);
      const depth = d + tmp.dot(fwd);
      if (depth < 0.05) { box.x0 = box.y0 = -1e3; box.x1 = box.y1 = 1e3; return box; }
      const x = tmp.x / (depth * st.tanX), y = tmp.dot(up) / (depth * st.tanY);
      if (x < box.x0) box.x0 = x; if (x > box.x1) box.x1 = x;
      if (y < box.y0) box.y0 = y; if (y > box.y1) box.y1 = y;
    }
    return box;
  }

  // 構図を解く：shot と画面比 → { focus, dist, pitch, sx, sy }（sx, sy はレンズのずらし、NDC）
  const target = { f: new V3(), d: 1.5, pitch: 0.6, sx: 0, sy: 0 };
  function solve(shotName) {
    const S = SHOTS[shotName] || SHOTS.work;
    const pitch = S.pitch * DEG;
    basis(pitch);
    const list = gather(S.subject);
    // 焦点：点の箱の中心
    let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
    for (const p of list) {
      x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z);
    }
    focus.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    const at = st.portrait ? S.port : S.land;
    // 短い辺は frac、長い辺は画面に収める（置く位置のずれの分も見込む）
    const shortHalf = Math.min(S.frac, LENS.fit - Math.abs(st.portrait ? at[0] : at[1]));
    const longHalf = LENS.fit - Math.abs(st.portrait ? at[1] : at[0]);
    const ok = d => {
      const b = project(list, focus, d);
      const ex = (b.x1 - b.x0) / 2, ey = (b.y1 - b.y0) / 2;
      const es = st.portrait ? ex : ey, el = st.portrait ? ey : ex;
      return es <= shortHalf && el <= longHalf;
    };
    let lo = 0.3, hi = 12;
    for (let i = 0; i < 26; i++) { const m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; }
    const b = project(list, focus, hi);
    target.f.copy(focus); target.d = hi; target.pitch = pitch;
    target.sx = at[0] - (b.x0 + b.x1) / 2;
    target.sy = at[1] - (b.y0 + b.y1) / 2;
    // お客さんの顔が上にはみ出すなら、主役の下が画面の端に着くまで、構図を下へずらす
    if (S.subject === 'hero') {
      tmp.subVectors(face, focus);
      const depth = hi + tmp.dot(fwd);
      if (depth > 0.05) {
        const yf = tmp.dot(up) / (depth * st.tanY) + target.sy;
        const room = (b.y0 + target.sy) + LENS.fit;
        if (yf > FACE.lim && room > 0) target.sy -= Math.min(yf - FACE.lim, room);
      }
    }
    return S;
  }

  function apply() {
    basis(st.pitch.x);
    focus.set(st.fx.x, st.fy.x, st.fz.x);
    camera.position.copy(focus).addScaledVector(fwd, -st.dist.x);
    camera.up.set(0, 1, 0);
    camera.lookAt(focus);
    // レンズのずらし：中身を NDC で (sx, sy) 動かす
    camera.setViewOffset(st.w, st.h, -st.sx.x * st.w / 2, st.sy.x * st.h / 2, st.w, st.h);
    camera.updateMatrixWorld(true);
  }

  // 今のカメラで、主役（釜＋わたあめ）が短い辺に占める割合を測る（?debug=1 の表示用）
  function measure() {
    basis(st.pitch.x);
    focus.set(st.fx.x, st.fy.x, st.fz.x);
    const b = project(gather('hero'), focus, st.dist.x);
    st.heroFrac = st.portrait ? (b.x1 - b.x0) / 2 : (b.y1 - b.y0) / 2;
    st.candyFrac = candyR > 0.005 ? (2 * candyR / (st.dist.x * 2 * (st.portrait ? st.tanX : st.tanY))) : 0;
  }

  return {
    state: st,
    // 画面の大きさが変わった：画角を決め直し、次のフレームは構図へ飛ぶ（向きが変わった時にゆっくり動かない）
    resize(w, h) {
      st.w = w; st.h = h; st.aspect = w / h; st.portrait = w < h;
      let vfov;
      if (st.portrait) {
        const tx = Math.tan(LENS.portShortFov * DEG / 2);
        vfov = Math.min(LENS.maxVFov * DEG, 2 * Math.atan(tx / st.aspect));
      } else vfov = LENS.landShortFov * DEG;
      st.tanY = Math.tan(vfov / 2); st.tanX = st.tanY * st.aspect;
      camera.fov = vfov / DEG; camera.aspect = st.aspect;
      st.snap = true;
    },
    // hero の今の状態（root 座標の中心と、毛羽込みの半径）
    setCandy(center, radius) {
      candyR = radius || 0;
      candyC.set(O.x, O.y + (candyR > 0.005 ? center.y : 0), O.z);
    },
    update(dt, shotName) {
      const S = solve(shotName);
      st.shot = shotName;
      if (st.snap) {
        for (const [s, v] of [[st.fx, target.f.x], [st.fy, target.f.y], [st.fz, target.f.z], [st.dist, target.d], [st.pitch, target.pitch], [st.sx, target.sx], [st.sy, target.sy]]) { s.x = v; s.v = 0; }
        st.snap = false;
      } else {
        // 寄る時はその構図の速さ、引く時はさらにゆっくり
        const w = target.d > st.dist.x + 0.01 ? Math.min(S.w, 1.5) : S.w;
        damp(st.fx, target.f.x, w, dt); damp(st.fy, target.f.y, w, dt); damp(st.fz, target.f.z, w, dt);
        damp(st.dist, target.d, w, dt); damp(st.pitch, target.pitch, w, dt);
        damp(st.sx, target.sx, w, dt); damp(st.sy, target.sy, w, dt);
      }
      apply();
      measure();
    },
    // ある構図での瓶の置き場所を求める：その構図のカメラで、高さ y・奥行き z の点が NDC x = ndcX に見える x
    solveX(shotName, ndcX, y, z) {
      solve(shotName);
      basis(target.pitch);
      const at = (x) => { tmp.set(x, y, z).sub(target.f); const depth = target.d + tmp.dot(fwd); return tmp.x / (depth * st.tanX) + target.sx; };
      const a = at(0), b = at(-1);           // x について一次
      return (ndcX - a) / (b - a) * -1;
    },
  };
}
