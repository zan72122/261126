// 主役中心のカメラ。
// ・距離は「主役（器と氷の山）の見かけの大きさ」から決める：主役の点を画面へ写し、短い辺に対する割合が frac になる距離を解く。
// ・場面ごとの「構図」（主役の点・見下ろす角度・割合・画面のどこに置くか）をゲームが毎フレーム渡し、
//   ここでは臨界減衰のばね（SmoothDamp）でゆっくり追う。急なズーム・揺れ・行き過ぎは無い。
// ・縦長／横長で画角の取り方と主役の置き場所を変える（4:3 の横幅を守る作りはやめた）。
// ・カメラを動かした直後に updateMatrixWorld するので、同じフレームのレイキャストは見えている絵と一致する。
import * as THREE from '../vendor/three.module.min.js';

const D2R = Math.PI / 180;

// Unity の SmoothDamp と同じ考え方（臨界減衰。どんな dt でも安定、行き過ぎ無し）
function smoothDamp(cur, goal, st, key, smoothTime, dt) {
  const omega = 2 / Math.max(1e-4, smoothTime), x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = cur - goal, temp = (st[key] + omega * change) * dt;
  st[key] = (st[key] - omega * temp) * exp;
  let out = goal + (change + temp) * exp;
  if ((goal - cur > 0) === (out > goal)) { out = goal; st[key] = 0; }
  return out;
}

export function createCameraRig(camera) {
  const view = { w: 1, h: 1, aspect: 1, portrait: false, safe: { l: 0, r: 0, t: 0, b: 0 }, tanShort: 0.3, tanX: 0.3, tanY: 0.3 };
  // 今の値（ばねで動く）
  const cur = { fx: 0, fy: 0.1, fz: 0, dist: 1, pitch: 45 * D2R, yaw: 0, ax: 0, ay: 0 };
  const vel = { fx: 0, fy: 0, fz: 0, dist: 0, pitch: 0, yaw: 0, ax: 0, ay: 0 };
  const goal = { ...cur };
  let snapNext = true;
  const info = { shot: '', frac: 0, goalFrac: 0, dist: 0, pitch: 0 };

  const _r = new THREE.Vector3(), _u = new THREE.Vector3(), _f = new THREE.Vector3(), _p = new THREE.Vector3();

  // 画面の大きさ。短い辺に対する画角を決め、長い辺の画角は 58° を超えないようにする（スマホの縦でゆがまない）
  function setViewport(w, h, safe) {
    view.w = Math.max(1, w); view.h = Math.max(1, h); view.aspect = view.w / view.h; view.portrait = view.aspect < 1;
    if (safe) view.safe = safe;
    const long = Math.max(view.aspect, 1 / view.aspect);
    let tShort = Math.tan(17 * D2R);
    const tLongMax = Math.tan(29 * D2R);
    if (tShort * long > tLongMax) tShort = tLongMax / long;
    view.tanShort = tShort;
    view.tanY = view.portrait ? tShort / view.aspect : tShort;
    view.tanX = view.tanY * view.aspect;
    camera.fov = 2 * Math.atan(view.tanY) / D2R; camera.aspect = view.aspect;
    camera.updateProjectionMatrix();
  }

  function axes(pitch, yaw) {
    // 前方向：yaw だけ回り、pitch だけ下を向く
    const cp = Math.cos(pitch), sp = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
    _f.set(-sy * cp, -sp, -cy * cp);
    _r.set(cy, 0, -sy);
    _u.crossVectors(_r, _f);
  }

  // 主役の点（世界座標）を、焦点から距離 d・角度 pitch/yaw のカメラで見た時の、短い辺に対する大きさ（0..1）と中心のずれ
  const span = { frac: 0, cx: 0, cy: 0 };
  function measure(pts, n, fx, fy, fz, d, pitch, yaw) {
    axes(pitch, yaw);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let i = 0; i < n; i++) {
      const p = pts[i];
      const rx = p.x - fx, ry = p.y - fy, rz = p.z - fz;
      const z = Math.max(0.02, d + rx * _f.x + ry * _f.y + rz * _f.z);
      const tx = (rx * _r.x + ry * _r.y + rz * _r.z) / z, ty = (rx * _u.x + ry * _u.y + rz * _u.z) / z;
      if (tx < x0) x0 = tx; if (tx > x1) x1 = tx; if (ty < y0) y0 = ty; if (ty > y1) y1 = ty;
    }
    span.frac = Math.max(x1 - x0, y1 - y0) / (2 * view.tanShort);
    span.cx = (x0 + x1) / 2; span.cy = (y0 + y1) / 2; // 接平面での中心（焦点からのずれ）
    return span;
  }

  // shot = {
  //   name, pts:[Vector3], n（使う点の数）, subN（先頭の何点が主役か。残りは「入れたい物」）, focus:Vector3,
  //   pitch(deg), yaw(deg), frac（全部の点が短い辺に占める割合）, minFrac（主役がこれより小さくならない）, shiftX / shiftY（その時に主役を真ん中からずらしてよい割合）,
  //   ax, ay（真ん中を置く NDC）, time / followTime（ばねの時間、秒）
  // }
  function solveDist(pts, n, f, frac, pitch, yaw, d) {
    for (let i = 0; i < 6; i++) { const s = measure(pts, n, f.x, f.y, f.z, d, pitch, yaw); d = Math.min(4, Math.max(0.25, d * (s.frac / frac))); }
    return d;
  }
  function update(dt, shot) {
    const pitch = shot.pitch * D2R, yaw = (shot.yaw || 0) * D2R;
    const f = shot.focus, subN = shot.subN || shot.n;
    // 全部の点が短い辺の frac を占める距離。主役が minFrac より小さくなるなら、主役の方で決める（入れたい物は端で切れてよい）
    let d = solveDist(shot.pts, shot.n, f, shot.frac, pitch, yaw, goal.dist > 0.05 ? goal.dist : 1);
    let clampD = false;
    if (shot.minFrac && subN < shot.n) {
      const dSub = solveDist(shot.pts, subN, f, shot.minFrac, pitch, yaw, d);
      if (dSub < d) { d = dSub; clampD = true; }
    }
    const s = measure(shot.pts, shot.n, f.x, f.y, f.z, d, pitch, yaw);
    let cx = s.cx, cy = s.cy; // measure は同じ物を返すので、値を先に取り出しておく
    if (clampD) {
      // 真ん中は全体の中心へ寄せるが、主役は画面の真ん中寄りに残す（端のトレーと重ならない）
      const ss = measure(shot.pts, subN, f.x, f.y, f.z, d, pitch, yaw), half = shot.minFrac * view.tanShort;
      const mx = Math.max(0, view.tanX - half) * (shot.shiftX == null ? 0.45 : shot.shiftX);
      const my = Math.max(0, view.tanY - half) * (shot.shiftY == null ? 0.45 : shot.shiftY);
      cx = ss.cx + Math.max(-mx, Math.min(mx, cx - ss.cx));
      cy = ss.cy + Math.max(-my, Math.min(my, cy - ss.cy));
    }
    // 焦点を見かけの中心へ寄せる（点の並びが焦点に対して偏っていても、真ん中に来る）
    axes(pitch, yaw);
    goal.fx = f.x + (_r.x * cx + _u.x * cy) * d;
    goal.fy = f.y + (_r.y * cx + _u.y * cy) * d;
    goal.fz = f.z + (_r.z * cx + _u.z * cy) * d;
    goal.dist = d; goal.pitch = pitch; goal.yaw = yaw; goal.ax = shot.ax || 0; goal.ay = shot.ay || 0;
    info.shot = shot.name; info.goalFrac = shot.frac;

    const T = shot.time || 0.6, Tf = shot.followTime || T * 0.6;
    if (snapNext) { Object.assign(cur, goal); for (const k in vel) vel[k] = 0; snapNext = false; }
    else {
      cur.fx = smoothDamp(cur.fx, goal.fx, vel, 'fx', Tf, dt);
      cur.fy = smoothDamp(cur.fy, goal.fy, vel, 'fy', Tf, dt);
      cur.fz = smoothDamp(cur.fz, goal.fz, vel, 'fz', Tf, dt);
      cur.dist = smoothDamp(cur.dist, goal.dist, vel, 'dist', T, dt);
      cur.pitch = smoothDamp(cur.pitch, goal.pitch, vel, 'pitch', T * 1.1, dt);
      cur.yaw = smoothDamp(cur.yaw, goal.yaw, vel, 'yaw', T * 1.1, dt);
      cur.ax = smoothDamp(cur.ax, goal.ax, vel, 'ax', T, dt);
      cur.ay = smoothDamp(cur.ay, goal.ay, vel, 'ay', T, dt);
    }
    apply();
    info.frac = measure(shot.pts, subN, cur.fx, cur.fy, cur.fz, cur.dist, cur.pitch, cur.yaw).frac; // 主役が短い辺の何割か
    info.dist = cur.dist; info.pitch = cur.pitch / D2R;
  }

  function apply() {
    axes(cur.pitch, cur.yaw);
    camera.position.set(cur.fx - _f.x * cur.dist, cur.fy - _f.y * cur.dist, cur.fz - _f.z * cur.dist);
    camera.up.set(0, 1, 0);
    camera.lookAt(_p.set(cur.fx, cur.fy, cur.fz));
    // 主役の中心を NDC (ax, ay) に置く：レンズを平行にずらす（縦の線が傾かない）
    const ox = -cur.ax * 0.5 * view.w, oy = cur.ay * 0.5 * view.h;
    if (Math.abs(ox) > 0.01 || Math.abs(oy) > 0.01) camera.setViewOffset(view.w, view.h, ox, oy, view.w, view.h);
    else camera.clearViewOffset();
    camera.updateMatrixWorld(true);
  }

  // 画面の点（CSS px）→ 高さ y の水平面の上の点（今のカメラ）。当たらなければ null
  const _ray = new THREE.Raycaster(), _ndc = new THREE.Vector2(), _pl = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function screenToPlane(sx, sy, y, out) {
    _ndc.set((sx / view.w) * 2 - 1, -(sy / view.h) * 2 + 1);
    _ray.setFromCamera(_ndc, camera);
    _pl.constant = -y;
    return _ray.ray.intersectPlane(_pl, out);
  }

  return {
    view, info, update, setViewport, screenToPlane,
    snap() { snapNext = true; },
  };
}
