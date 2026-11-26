// Camera rig (docs/fullscreen.md): frames one subject so that it fills SHARE of the short side of the screen.
// A shot says what to look at: focus point, subject diameter D (m), view yaw/pitch, points to keep in frame
// by panning (not by zooming out), and how slowly to get there. The rig eases every value with a critically
// damped spring (no overshoot, no jolt) and limits how fast it may zoom. Portrait puts the subject low
// (where the thumb is) with a lens shift; landscape a little below centre. The raycast for touches uses the
// same camera matrices, so it follows every move of the rig.
import * as THREE from 'three';

export const SHARE = 0.62;            // subject diameter / short side of the screen (task: 0.55..0.70)
const DEG = Math.PI / 180;
const PITCH_MAX = 62 * DEG;
const CAM_X_MAX = 9.0;                 // the pine trees stand at |x| >= 10.5 beside the field: stay in front of them
const ZOOM_SPEED = 0.55;               // max change of log(distance) per second (about x1.7 per second)
const YAW_SPEED = 1.1;                 // rad/s

export function createCamRig(camera, { heightAt }) {
  const view = { w: 1, h: 1, aspect: 1, portrait: false, vfov: 40, tanV: 0.36, tanH: 0.36, tanShort: 0.36, anchorY: 0 };
  // current state (+ velocities for the springs) and target
  const cur = { fx: 0, fy: 0.5, fz: 0, ld: Math.log(10), yaw: 0, pitch: 36 * DEG, v: { fx: 0, fy: 0, fz: 0, ld: 0, yaw: 0, pitch: 0 } };
  const tgt = { fx: 0, fy: 0.5, fz: 0, ld: Math.log(10), yaw: 0, pitch: 36 * DEG, D: 3.8 };
  let shot = { name: 'none', tPos: 0.5, tZoom: 0.9, tRot: 0.9 };
  let snapNext = true;

  function resize(w, h) {
    view.w = Math.max(1, w); view.h = Math.max(1, h);
    const a = view.w / view.h;
    view.aspect = a; view.portrait = a < 1;
    let vfov;
    if (view.portrait) { vfov = clamp(2 * Math.atan(Math.tan(21 * DEG) / a), 40 * DEG, 58 * DEG); view.anchorY = -0.30; }
    else { vfov = a > 1.6 ? 2 * Math.atan(Math.tan(35 * DEG) / a) : 40 * DEG; view.anchorY = -0.06; }
    view.vfov = vfov / DEG;
    view.tanV = Math.tan(vfov / 2); view.tanH = view.tanV * a; view.tanShort = Math.min(view.tanV, view.tanH);
    camera.fov = view.vfov; camera.aspect = a; camera.near = 0.3; camera.far = 200;
    // lens shift: the look-at point appears at ndc y = anchorY (no black bands: the whole canvas is still drawn)
    camera.setViewOffset(view.w, view.h, 0, (view.anchorY / 2) * view.h, view.w, view.h);
    camera.updateProjectionMatrix();
    if (shot.name !== 'none') set(shot);
    place();
  }

  const distFor = (D) => D / (SHARE * 2 * view.tanShort);

  // camera basis for (yaw, pitch); dir points from the focus to the camera
  const B = { dir: new THREE.Vector3(), f: new THREE.Vector3(), r: new THREE.Vector3(), u: new THREE.Vector3() };
  function basis(yaw, pitch) {
    const cp = Math.cos(pitch);
    B.dir.set(Math.sin(yaw) * cp, Math.sin(pitch), Math.cos(yaw) * cp);
    B.f.copy(B.dir).negate();
    B.r.set(Math.cos(yaw), 0, -Math.sin(yaw));
    B.u.crossVectors(B.r, B.f);
    return B;
  }
  const _c = new THREE.Vector3(), _v = new THREE.Vector3();
  function ndcOf(p, fx, fy, fz, d, out) {
    _c.set(fx, fy, fz).addScaledVector(B.dir, d);
    _v.set(p.x, p.y, p.z).sub(_c);
    const z = Math.max(0.3, _v.dot(B.f));
    out.x = _v.dot(B.r) / (z * view.tanH);
    out.y = _v.dot(B.u) / (z * view.tanV) + view.anchorY;
    out.z = z;
    return out;
  }

  // lowest pitch from which the focus is seen over the snow between it and the camera
  function clearPitch(fx, fy, fz, yaw, d, base) {
    const sx = Math.sin(yaw), sz = Math.cos(yaw);
    let need = base;
    for (let k = 1; k <= 10; k++) {
      const s = 0.5 + (k / 10) * d * Math.cos(base) * 0.9;
      const h = heightAt(fx + sx * s, fz + sz * s);
      if (h > fy - 0.2) need = Math.max(need, Math.atan2(h + 0.35 - fy, s));
    }
    return Math.min(need, PITCH_MAX);
  }

  // shot: { name, focus{x,y,z}, D, yaw, pitch, include:[{x,y,z}], panMax, centerY, fit:{pts,dMin,dMax}, tPos, tZoom, tRot }
  // centerY: where on the screen (ndc y) the focus should be, for group shots; default: the subject anchor
  const _n = new THREE.Vector3();
  // group shots: the nearest distance (between the D limits) at which every point is inside +-FIT of the screen
  const FIT = 0.78;
  function fitD(s, yaw, pitch) {
    const pts = s.fit.pts;
    basis(yaw, pitch);
    const sp = Math.max(0.2, Math.sin(pitch)), gx = -Math.sin(yaw), gz = -Math.cos(yaw);
    const d0 = distFor(s.fit.dMin), d1 = distFor(s.fit.dMax);
    let d = d0;
    for (; d < d1; d *= 1.03) {
      const k = (((s.centerY ?? view.anchorY) - view.anchorY) * d * view.tanV) / sp;
      const fx = s.focus.x - gx * k, fz = s.focus.z - gz * k;
      let ok = true;
      for (const p of pts) {
        ndcOf(p, fx, s.focus.y, fz, d, _n);
        if (Math.abs(_n.x) > FIT || Math.abs(_n.y) > FIT) { ok = false; break; }
      }
      if (ok) break;
    }
    return Math.min(d, d1) * SHARE * 2 * view.tanShort;
  }

  function set(s) {
    shot = s;
    if (s.fit) s.D = fitD(s, s.yaw || 0, s.pitch + (view.portrait ? 5 * DEG : 0));
    const d = distFor(s.D);
    let yaw = s.yaw || 0;
    const basePitch = s.pitch + (view.portrait ? 5 * DEG : 0);   // portrait: look down a little more (less sky)
    // keep the camera out of the side trees: turn back toward the front if it would stand among them
    const cpb = Math.cos(basePitch);
    const room = CAM_X_MAX - Math.sign(Math.sin(yaw) || 1) * s.focus.x;
    if (Math.abs(Math.sin(yaw)) * d * cpb > room) yaw = Math.sign(yaw) * Math.asin(clamp(room / (d * cpb), 0, 1));
    const pitch = clearPitch(s.focus.x, s.focus.y, s.focus.z, yaw, d, basePitch);
    basis(yaw, pitch);
    // pan (never zoom) so that side things come into view at the edge, keeping the subject near its place
    let fx = s.focus.x, fy = s.focus.y, fz = s.focus.z;
    // a group shot is centred on the screen instead of sitting low: move the look-at point toward the camera
    if (s.centerY != null) {
      const k = ((s.centerY - view.anchorY) * d * view.tanV) / Math.max(0.2, Math.sin(pitch));
      fx -= -Math.sin(yaw) * k; fz -= -Math.cos(yaw) * k;
    }
    const inc = s.include || [];
    if (inc.length && s.panMax > 0) {
      const gx = -Math.sin(yaw), gz = -Math.cos(yaw), sp = Math.max(0.2, Math.sin(pitch));
      const maxR = s.panMax * d * view.tanH, maxG = (s.panMax * d * view.tanV) / sp;
      let pr = 0, pg = 0;
      for (let it = 0; it < 3; it++) {
        let ex = 0, ey = 0;
        for (const p of inc) {
          ndcOf(p, fx, fy, fz, d, _n);
          if (_n.x > 0.8) ex = Math.max(ex, (_n.x - 0.8) * _n.z * view.tanH); else if (_n.x < -0.8) ex = Math.min(ex, (_n.x + 0.8) * _n.z * view.tanH);
          if (_n.y > 0.78) ey = Math.max(ey, (_n.y - 0.78) * _n.z * view.tanV / sp); else if (_n.y < -0.85) ey = Math.min(ey, (_n.y + 0.85) * _n.z * view.tanV / sp);
        }
        const nr = clamp(pr + ex, -maxR, maxR), ng = clamp(pg + ey, -maxG, maxG);
        const dr = nr - pr, dg = ng - pg;
        pr = nr; pg = ng;
        fx += B.r.x * dr + gx * dg; fz += B.r.z * dr + gz * dg;
        if (Math.abs(dr) + Math.abs(dg) < 1e-3) break;
      }
    }
    tgt.fx = fx; tgt.fy = fy; tgt.fz = fz; tgt.ld = Math.log(d); tgt.yaw = yaw; tgt.pitch = pitch; tgt.D = s.D;
    if (snapNext) snap();
  }

  function snap() {
    snapNext = false;
    cur.fx = tgt.fx; cur.fy = tgt.fy; cur.fz = tgt.fz; cur.ld = tgt.ld; cur.yaw = tgt.yaw; cur.pitch = tgt.pitch;
    for (const k in cur.v) cur.v[k] = 0;
    place();
  }

  function update(dt) {
    if (!(dt > 0)) { place(); return; }
    damp(cur, 'fx', tgt.fx, shot.tPos, dt);
    damp(cur, 'fy', tgt.fy, shot.tPos * 1.4, dt);
    damp(cur, 'fz', tgt.fz, shot.tPos, dt);
    damp(cur, 'ld', tgt.ld, shot.tZoom, dt, ZOOM_SPEED);
    cur.yaw = tgt.yaw + wrap(cur.yaw - tgt.yaw);
    damp(cur, 'yaw', tgt.yaw, shot.tRot, dt, YAW_SPEED);
    damp(cur, 'pitch', tgt.pitch, shot.tRot, dt, YAW_SPEED * 0.6);
    place();
  }

  function place() {
    const d = Math.exp(cur.ld);
    basis(cur.yaw, cur.pitch);
    camera.position.set(cur.fx, cur.fy, cur.fz).addScaledVector(B.dir, d);
    camera.lookAt(cur.fx, cur.fy, cur.fz);
    camera.updateMatrixWorld();
  }

  return {
    view, resize, set, snap, update,
    requestSnap() { snapNext = true; },
    get focus() { return { x: cur.fx, y: cur.fy, z: cur.fz }; },
    distFor,
    info() {
      const d = Math.exp(cur.ld);
      return { shot: shot.name, d, share: tgt.D / (2 * d * view.tanShort), shortM: 2 * d * view.tanShort, fov: view.vfov, portrait: view.portrait,
        yaw: cur.yaw / DEG, pitch: cur.pitch / DEG };
    },
  };
}

// critically damped spring toward target (Game Programming Gems 4, 1.10); maxSpeed limits the rate of change
function damp(s, k, target, T, dt, maxSpeed = Infinity) {
  T = Math.max(1e-3, T);
  const omega = 2 / T, x = omega * dt;
  const e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const lim = maxSpeed * T;
  const change = clamp(s[k] - target, -lim, lim);
  const to = s[k] - change;
  const temp = (s.v[k] + omega * change) * dt;
  s.v[k] = (s.v[k] - omega * temp) * e;
  let out = to + (change + temp) * e;
  if ((target - s[k] > 0) === (out > target)) { out = target; s.v[k] = 0; }
  if (!Number.isFinite(out)) { out = target; s.v[k] = 0; }
  s[k] = out;
}
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function wrap(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
