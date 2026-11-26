// カメラ：主役（飴引き機と飴）の大きさから距離を決め、場面に合わせて減衰付きで寄ったり引いたりする。
//   solve()   主役の箱を画面の短い辺の fill 倍・safe-area 内の anchor の位置に収める、目標のカメラを解く
//   rig       目標へ臨界減衰（行き過ぎない）でつなぐ。急なズーム・揺れはしない
//   director  遊びの場面（えらぶ・のばす…・仕上げ・わたす・お客さん）から構図を選ぶ。指で持っている間は目標を固定
//   dock()    画面の向きと大きさに合わせて、トレー・はさみ・袋の置き場所を「寄った構図の端」に決め直す
import * as THREE from 'three';
import { CAMERA, LAYOUT } from './config.js';

const V3 = THREE.Vector3;
const D2R = Math.PI / 180;

// ---------- 目標のカメラを解く ----------
const _c = new V3(), _r = new V3(), _u = new V3(), _d = new V3(), _p = new V3();
const LX = new Float32Array(16), LY = new Float32Array(16), LZ = new Float32Array(16);

export function viewDir(yaw, pitch, out) { // 注視点 → カメラ の向き
  return out.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
}

export function orientOf(vp) { return vp.w >= vp.h ? CAMERA.orient.landscape : CAMERA.orient.portrait; }

// 縦の画角：短い辺の画角が shortFov になるように（縦長では横が短い辺）
export function vfovFor(vp, shortFov) {
  if (vp.w >= vp.h) return shortFov;
  const v = 2 * Math.atan(Math.tan((shortFov * D2R) / 2) * (vp.h / vp.w)) / D2R;
  return Math.min(CAMERA.maxVFov, v);
}

// box: [x0,y0,z0,x1,y1,z1]、shot: {fill, yaw, pitch, anchor?}、vp: {w,h,safe:{l,t,r,b}}
// base（省略可）：寄り具合を決める基本の箱。box はそれを広げた箱で、画面に収まること（各辺の FIT 倍以内）だけを求める。
//   → 伸ばした飴は「全部見える」まで引くだけで、短い辺の fill 倍まで縮めはしない（引きすぎない）
const FIT = 0.88;
export function solve(box, shot, vp, out, base) {
  base = base || box;
  const orient = orientOf(vp);
  const yaw = (shot.yaw || 0) * D2R, pitch = (shot.pitch || 0) * D2R;
  viewDir(yaw, pitch, _d);
  _r.set(Math.cos(yaw), 0, -Math.sin(yaw));
  _u.crossVectors(_d, _r);
  const vfov = vfovFor(vp, orient.shortFov);
  const tanV = Math.tan((vfov * D2R) / 2), tanH = tanV * (vp.w / vp.h);
  const s = vp.safe;
  const sx0 = s.l, sy0 = s.t, sw = Math.max(1, vp.w - s.l - s.r), sh = Math.max(1, vp.h - s.t - s.b);
  const S = Math.min(sw, sh);
  const an = shot.anchor || (shot.ax != null ? [shot.ax, orient.anchor[1]] : orient.anchor);
  const anx = ((sx0 + an[0] * sw) / vp.w) * 2 - 1, any = 1 - ((sy0 + an[1] * sh) / vp.h) * 2;
  _c.set((box[0] + box[3]) / 2, (box[1] + box[4]) / 2, (box[2] + box[5]) / 2);
  for (let i = 0; i < 16; i++) {
    const b = i < 8 ? box : base;
    _p.set(i & 1 ? b[3] : b[0], i & 2 ? b[4] : b[1], i & 4 ? b[5] : b[2]).sub(_c);
    LX[i] = _p.dot(_r); LY[i] = _p.dot(_u); LZ[i] = _p.dot(_d);
  }
  let ox = 0, oy = 0, frac = 0;
  // 距離 d で、box の中心を anchor に合わせた時の「大きすぎ度」（1 で丁度）。frac は基本の箱の短い辺に対する割合
  const measure = (d) => {
    let need = 0;
    for (let it = 0; it < 4; it++) {
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
      for (let i = 0; i < 16; i++) {
        const z = d - LZ[i];
        if (z < CAMERA.near * 2) return Infinity;
        const nx = (LX[i] - ox) / (z * tanH), ny = (LY[i] - oy) / (z * tanV);
        if (i < 8) { if (nx < x0) x0 = nx; if (nx > x1) x1 = nx; if (ny < y0) y0 = ny; if (ny > y1) y1 = ny; }
        else { if (nx < bx0) bx0 = nx; if (nx > bx1) bx1 = nx; if (ny < by0) by0 = ny; if (ny > by1) by1 = ny; }
      }
      ox += ((x0 + x1) / 2 - anx) * d * tanH;
      oy += ((y0 + y1) / 2 - any) * d * tanV;
      frac = Math.max(((bx1 - bx0) / 2) * vp.w, ((by1 - by0) / 2) * vp.h) / S;
      // 収まり：anchor からはみ出す側も見る（片寄せの構図でも画面の外に出ない）
      const fitX = Math.max(x1 - x0, 2 * Math.max(x1 - anx, anx - x0)) / 2 * vp.w / (sw * FIT);
      const fitY = Math.max(y1 - y0, 2 * Math.max(y1 - any, any - y0)) / 2 * vp.h / (sh * FIT);
      need = Math.max(frac / (shot.fill * (orient.fillScale || 1)), base === box ? 0 : Math.max(fitX, fitY));
    }
    return need;
  };
  let lo = 0.2, hi = 14;
  for (let i = 0; i < 26; i++) {
    const mid = (lo + hi) / 2;
    if (measure(mid) > 1) lo = mid; else hi = mid;
  }
  const d = hi;
  measure(d);
  out.target.copy(_c).addScaledVector(_r, ox).addScaledVector(_u, oy);
  out.dist = d; out.yaw = yaw; out.pitch = pitch; out.vfov = vfov; out.frac = frac;
  return out;
}

export function makePose() { return { target: new V3(), dist: 1, yaw: 0, pitch: 0, vfov: 34, frac: 0 }; }

export function applyPose(cam, pose, aspect) {
  viewDir(pose.yaw, pose.pitch, _d);
  cam.position.copy(pose.target).addScaledVector(_d, pose.dist);
  cam.up.set(0, 1, 0);
  cam.lookAt(pose.target);
  cam.fov = pose.vfov;
  cam.aspect = aspect;
  cam.near = CAMERA.near; cam.far = CAMERA.far;
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld(true);
}

// ---------- 臨界減衰（SmoothDamp）：行き過ぎず、速さも連続 ----------
function smoothDamp(cur, goal, vel, key, smooth, dt) {
  const omega = 2 / Math.max(1e-4, smooth);
  const x = omega * dt;
  const ex = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = cur - goal;
  const temp = (vel[key] + omega * change) * dt;
  vel[key] = (vel[key] - omega * temp) * ex;
  return goal + (change + temp) * ex;
}

export function createRig(camera) {
  const pose = makePose();
  const vel = { tx: 0, ty: 0, tz: 0, dist: 0, yaw: 0, pitch: 0, vfov: 0 };
  let ready = false;
  return {
    pose,
    snap(goal) {
      pose.target.copy(goal.target); pose.dist = goal.dist; pose.yaw = goal.yaw; pose.pitch = goal.pitch; pose.vfov = goal.vfov; pose.frac = goal.frac;
      for (const k in vel) vel[k] = 0;
      ready = true;
    },
    update(dt, goal, smooth) {
      if (!ready) { this.snap(goal); return; }
      const t = pose.target, g = goal.target;
      t.x = smoothDamp(t.x, g.x, vel, 'tx', smooth, dt);
      t.y = smoothDamp(t.y, g.y, vel, 'ty', smooth, dt);
      t.z = smoothDamp(t.z, g.z, vel, 'tz', smooth, dt);
      // 距離は対数で（寄る・引くの速さが見た目に一定）
      pose.dist = Math.exp(smoothDamp(Math.log(pose.dist), Math.log(goal.dist), vel, 'dist', smooth, dt));
      pose.yaw = smoothDamp(pose.yaw, goal.yaw, vel, 'yaw', smooth, dt);
      pose.pitch = smoothDamp(pose.pitch, goal.pitch, vel, 'pitch', smooth, dt);
      pose.vfov = smoothDamp(pose.vfov, goal.vfov, vel, 'vfov', smooth * 0.5, dt);
      pose.frac = goal.frac;
    },
    // 動いているか（debug 用）
    get speed() { return Math.abs(vel.dist) + Math.hypot(vel.tx, vel.ty, vel.tz); },
  };
}

// ---------- 構図を選ぶ ----------
export function createDirector({ camera, hero, flow, scissors, input }) {
  const rig = createRig(camera);
  const goal = makePose();
  const box = new Float32Array(6);
  let base = null;
  const D = { shotAt: 0, prevSmooth: 0, shot: 'intro', introDone: false, lastGifts: 0, thanksUntil: -1, held: false, lastDown: false, vp: null };

  function pick(time) {
    const F = flow.F;
    const down = input.pointerDown;
    if (down && !D.lastDown) { D.introDone = true; if (time < D.thanksUntil) D.thanksUntil = time; } // 触ったら待たずに寄る
    D.lastDown = down;
    if (time > CAMERA.introHold) D.introDone = true;
    if (F.gifts !== D.lastGifts) { D.lastGifts = F.gifts; D.thanksUntil = time + CAMERA.thanksHold; }
    const stage = hero.getStatus().stage;
    if (!D.introDone) return 'intro';
    if (F.phase === 'wrap' || F.phase === 'give') return 'give';
    if (time < D.thanksUntil) return 'thanks';
    if (F.phase === 'finish' || stage === 'rolling' || stage === 'ready' || stage === 'cutting') return 'finish';
    return 'work';
  }

  const grow = (x, y, z, rx, ry, rz) => {
    box[0] = Math.min(box[0], x - rx); box[1] = Math.min(box[1], y - ry); box[2] = Math.min(box[2], z - rz);
    box[3] = Math.max(box[3], x + rx); box[4] = Math.max(box[4], y + ry); box[5] = Math.max(box[5], z + rz);
  };
  function buildBox(name) {
    const sh = CAMERA.shots[name];
    box.set(sh.box);
    base = sh.box;
    const st = hero.getStatus();
    if (name === 'work' && st.stage === 'candy') {
      // 引く持ち手が動いた分だけ箱を広げる（伸ばした飴が全部見える）。縮んでも基本の箱より小さくしない
      const h = st.points.pullHandle;
      grow(h.x, h.y, h.z, 0.09, 0.08, 0.04);
    } else if (name === 'finish') {
      const p = scissors.group.position;
      if (scissors.mode === 'hover') grow(p.x, p.y, p.z, 0.08, 0.06, 0.03);
    } else if (name === 'give' && flow.F.bag && flow.F.bagState !== 'drag' && flow.F.bag.group.parent && flow.F.bag.group.parent.type === 'Scene') {
      const p = flow.F.bag.group.position;
      grow(p.x, p.y + 0.18, p.z, 0.15, 0.22, 0.12);
    }
    return sh;
  }

  return {
    rig, goal, D,
    // 画面の大きさが変わった：その場で合わせる（アニメーションしない）
    resize(vp, time) {
      const same = D.vp && D.vp.w === vp.w && D.vp.h === vp.h && ['l', 't', 'r', 'b'].every((k) => D.vp.safe[k] === vp.safe[k]);
      D.vp = vp;
      if (same) return; // 大きさが同じ（文脈の復帰・解像度の降格）なら構図は動かさない
      const name = pick(time);
      const sh = buildBox(name);
      solve(box, sh, vp, goal, base);
      rig.snap(goal);
      applyPose(camera, rig.pose, vp.w / vp.h);
    },
    // いまの画面で、主役の箱（いまの場面の箱）が短い辺の何割か（debug 用：実際のカメラで投影して測る）
    measure() {
      const vp = D.vp;
      if (!vp) return null;
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (let i = 0; i < 8; i++) {
        _p.set(i & 1 ? box[3] : box[0], i & 2 ? box[4] : box[1], i & 4 ? box[5] : box[2]).project(camera);
        x0 = Math.min(x0, _p.x); x1 = Math.max(x1, _p.x); y0 = Math.min(y0, _p.y); y1 = Math.max(y1, _p.y);
      }
      const w = Math.round(((x1 - x0) / 2) * vp.w), h = Math.round(((y1 - y0) / 2) * vp.h);
      return { w, h, short: Math.max(w, h) / Math.min(vp.w - vp.safe.l - vp.safe.r, vp.h - vp.safe.t - vp.safe.b) };
    },
    update(dt, time) {
      const vp = D.vp;
      if (!vp) return;
      const name = pick(time);
      // 指で主役や袋を持っている間は目標を動かさない（指の下の物と、カメラの動きが追いかけっこにならない）
      const t = input.target;
      const held = input.pointerDown && !!t && (t.kind === 'hero' || t.id === 'bag');
      // つかんだ瞬間：目標を「今のカメラ」にして、ゆっくり止まる（指の下の世界が流れない）
      if (held && !D.held) { goal.target.copy(rig.pose.target); goal.dist = rig.pose.dist; goal.yaw = rig.pose.yaw; goal.pitch = rig.pose.pitch; }
      D.held = held;
      if (!D.held) {
        if (name !== D.shot) { D.prevSmooth = CAMERA.shots[D.shot].smooth; D.shotAt = time; }
        D.shot = name;
        { const sh = buildBox(name); solve(box, sh, vp, goal, base); }
      }
      // 場面が変わってしばらくは、前後のうち遅い方の時定数で（引きから寄る時も急にならない）
      let sm = CAMERA.shots[D.shot].smooth;
      if (time - D.shotAt < 1.5) sm = Math.max(sm, D.prevSmooth);
      rig.update(dt, goal, D.held ? 0.35 : sm);
      applyPose(camera, rig.pose, vp.w / vp.h);
    },
  };
}

// ---------- 置き場所：寄った構図の端に、トレー・はさみ・袋 ----------
const _ray = new THREE.Ray(), _cam = new THREE.PerspectiveCamera(), _ndc = new THREE.Vector2(), _rc = new THREE.Raycaster();
function rayAt(vp, fx, fy) { // safe-area 内の割合 → ワールドの光線
  const s = vp.safe;
  const x = s.l + fx * (vp.w - s.l - s.r), y = s.t + fy * (vp.h - s.t - s.b);
  _ndc.set((x / vp.w) * 2 - 1, 1 - (y / vp.h) * 2);
  _rc.setFromCamera(_ndc, _cam);
  return _rc.ray;
}
function hitY(ray, y, out) {
  const t = (y - ray.origin.y) / ray.direction.y;
  return out.copy(ray.origin).addScaledVector(ray.direction, Math.max(0, t));
}

export function computeDock(vp) {
  const orient = orientOf(vp);
  const pose = solve(CAMERA.shots.work.box, CAMERA.shots.work, vp, makePose());
  applyPose(_cam, pose, vp.w / vp.h);
  const T = LAYOUT.table;
  const lumpY = 0.066;
  // トレー：中心の点と、左右の端（safe-area の 4% 内側）で、使える幅を測る
  const c = hitY(rayAt(vp, orient.tray[0], orient.tray[1]), lumpY, new V3());
  c.z = Math.min(T.z1 - 0.12, Math.max(0.16, c.z));
  const yScr = orient.tray[1];
  const left = hitY(rayAt(vp, 0.04, yScr), lumpY, new V3());
  const sc = hitY(rayAt(vp, orient.scissors[0], orient.scissors[1]), 0.012, new V3());
  sc.z = Math.min(T.z1 - 0.1, Math.max(0.16, sc.z));
  // トレーの右端は、はさみの手前まで（重ならない）
  const right = Math.min(sc.x - 0.15, hitY(rayAt(vp, 0.96, yScr), lumpY, new V3()).x);
  const span = Math.max(0.3, right - Math.max(left.x, T.x0 + 0.05));
  const spacing = Math.min(0.14, span / 5); // 塊は主役（飴）より目立たない大きさまで
  const scale = Math.min(1, spacing / 0.16);
  const cx = Math.min(right - spacing * 2.6, Math.max(left.x + spacing * 2.6, c.x));
  return {
    pose,
    tray: { x: cx, z: c.z, spacing, scale },
    scissors: [Math.min(T.x1 - 0.06, sc.x), 0.012, sc.z],
    // 袋：仕上げの棒の右、はさみの奥（お客さんに近い方）
    bag: [Math.min(0.62, Math.max(0.46, sc.x + 0.12)), 0, 0.12],
  };
}
