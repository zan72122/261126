// Camera rig: hero-centred framing. Every shot names the things that matter right now (the ship at sea; the ramp,
// the waiting cars and the deck when loading; the ramp, the family and the cars on their way when delivering) and the
// distance is solved from their projected size, so the subject fills 55–70 % of the short side of the screen wherever
// the screen is (landscape or portrait, any aspect). The subject is placed by a lens shift (view offset): left of the
// wheel in landscape, low (in reach of the fingers) in portrait. Raycasting uses the same camera, so it follows.
// All changes are damped (orientation rate-limited to 20°/s, distance in log space with a max zoom rate): no jumps,
// no shake. While a finger drags something the shot is held.
import * as THREE from './three.js';
import { clamp, damp, wrapAngle } from './util.js';

const DEG = Math.PI / 180;
const MAX_YAW_RATE = 20 * DEG; // rad/s
const MAX_ZOOM_RATE = 0.25; // ln(distance) per second (≈ 28 %/s at most)

// ship silhouette samples in the ship (hero root) frame: hull corners, bow, superstructure, funnel tops
const SHIP_PTS = [
  [4.1, 0.2, -10], [-4.1, 0.2, -10], [4.1, 2.8, -10], [-4.1, 2.8, -10], [4.2, 0.2, 0], [-4.2, 0.2, 0], [4.0, 3.2, 3],
  [-4.0, 3.2, 3], [0, 3.8, 10.6], [0, 0.2, 10], [2.7, 8.0, 6], [-2.7, 8.0, 6], [1.9, 6.2, 8.6], [-1.9, 6.2, 8.6],
];

// shot table. yaw: camera heading (rad) relative to the ship (sea) or the port frame (π = looking from the sea at the
// quay); pitch: down angle (rad); fill: subject size / short side; ax, ay: where the subject centre sits (fraction
// of the free screen area: beside the wheel in landscape, above it in portrait).
const SHOTS = {
  sea: { L: { yaw: 0.55, pitch: 23 * DEG, fill: 0.68, ax: 0.5, ay: 0.56 }, P: { yaw: 0.45, pitch: 26 * DEG, fill: 0.68, ax: 0.46, ay: 0.64 } },
  leave: { L: { yaw: 0.7, pitch: 27 * DEG, fill: 0.62, ax: 0.5, ay: 0.55 }, P: { yaw: 0.55, pitch: 30 * DEG, fill: 0.64, ax: 0.46, ay: 0.62 } },
  approach: { L: { yaw: Math.PI - 0.55, pitch: 32 * DEG, fill: 0.62, ax: 0.5, ay: 0.55 }, P: { yaw: Math.PI - 0.6, pitch: 36 * DEG, fill: 0.64, ax: 0.46, ay: 0.62 } },
  load: { L: { yaw: Math.PI - 0.6, pitch: 40 * DEG, fill: 0.7, ax: 0.5, ay: 0.54 }, P: { yaw: Math.PI + 0.5, pitch: 46 * DEG, fill: 0.7, ax: 0.5, ay: 0.64 } },
  board: { L: { yaw: Math.PI - 0.6, pitch: 40 * DEG, fill: 0.7, ax: 0.5, ay: 0.54 }, P: { yaw: Math.PI + 0.5, pitch: 46 * DEG, fill: 0.7, ax: 0.5, ay: 0.64 } },
  unload: { L: { yaw: Math.PI - 0.3, pitch: 40 * DEG, fill: 0.66, ax: 0.5, ay: 0.54 }, P: { yaw: Math.PI - 0.35, pitch: 46 * DEG, fill: 0.68, ax: 0.5, ay: 0.62 } },
  cheer: { L: { yaw: Math.PI - 0.22, pitch: 34 * DEG, fill: 0.6, ax: 0.5, ay: 0.52 }, P: { yaw: Math.PI - 0.25, pitch: 40 * DEG, fill: 0.64, ax: 0.5, ay: 0.58 } },
};
// the next car to drive aboard is near enough to the ramp to frame them together (m, port frame)
const RAMP_FOOT = [0, 0.6, -16.2], RAMP_TOP = [0, 2.2, -10];

export function createCameraRig(camera) {
  const cur = { t: new THREE.Vector3(), yaw: 0, pitch: 0.6, lnD: Math.log(20), ax: 0.5, ay: 0.5, fov: 50 };
  const des = { t: new THREE.Vector3(), yaw: 0, pitch: 0.6, lnD: Math.log(20), ax: 0.5, ay: 0.5, fov: 50 };
  const view = { w: 1, h: 1, insets: { top: 0, right: 0, bottom: 0, left: 0 }, hud: null };
  const st = { shot: 'load', fill: 0, held: false, ok: true };
  const pts = []; for (let i = 0; i < 96; i++) pts.push(new THREE.Vector3());
  let n = 0;
  const f = new THREE.Vector3(), r = new THREE.Vector3(), u = new THREE.Vector3(), rel = new THREE.Vector3(), tmp = new THREE.Vector3();
  const box = new THREE.Box3();
  const xs = new Float32Array(96), ys = new Float32Array(96), zf = new Float32Array(96);
  let first = true;

  function add(v) { if (n < pts.length) pts[n++].copy(v); }
  function addLocal(m, a) { for (const p of a) add(tmp.set(p[0], p[1], p[2]).applyMatrix4(m)); }

  /** w, h: CSS px of the canvas; insets: safe area; hud: { x, y, r } exclusion circle (CSS px, y down) */
  function setView(w, h, insets, hud) { view.w = w; view.h = h; view.insets = insets || view.insets; view.hud = hud || null; }

  // the free area for the subject: inside the safe area, and beside (landscape) or above (portrait) the wheel
  function freeRect(portrait, out) {
    const { w, h, insets, hud } = view;
    out.l = insets.left; out.r = w - insets.right; out.t = insets.top; out.b = h - insets.bottom;
    if (hud) {
      if (portrait) out.b = Math.min(out.b, hud.y); // the subject may reach down beside the wheel (fits() keeps it off it)
      else out.r = Math.min(out.r, hud.x - hud.r * 0.55);
    }
    return out;
  }
  const rect = { l: 0, r: 0, t: 0, b: 0 };

  // Projection of the subject points for a camera at distance d (orientation: cur), relative to the look-at point's
  // screen position: bbox in CSS px and size as a fraction of the short side.
  const bb = { minX: 0, maxX: 0, minY: 0, maxY: 0, size: 0 };
  function measure(d, scale) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < n; i++) {
      const z = d + zf[i];
      if (z < 1.2) { bb.size = Infinity; return bb; }
      const sx = (xs[i] / z) * scale, sy = -(ys[i] / z) * scale;
      if (sx < minX) minX = sx; if (sx > maxX) maxX = sx; if (sy < minY) minY = sy; if (sy > maxY) maxY = sy;
    }
    bb.minX = minX; bb.maxX = maxX; bb.minY = minY; bb.maxY = maxY;
    bb.size = Math.max(maxX - minX, maxY - minY) / Math.min(view.w, view.h);
    return bb;
  }
  // with the subject's box centred on (cx, cy): is everything on screen (safe area + margin) and off the wheel?
  function fits(d, scale, cx, cy) {
    const m = measure(d, scale); if (m.size === Infinity) return false;
    const ox = cx - (m.minX + m.maxX) / 2, oy = cy - (m.minY + m.maxY) / 2;
    const { w, h, insets, hud } = view; const mg = Math.min(w, h) * 0.025;
    if (m.minX + ox < insets.left + mg || m.maxX + ox > w - insets.right - mg || m.minY + oy < insets.top + mg || m.maxY + oy > h - insets.bottom - mg) return false;
    if (hud) {
      const rr = hud.r * 1.15;
      for (let i = 0; i < n; i++) {
        const z = d + zf[i];
        const sx = (xs[i] / z) * scale + ox, sy = -(ys[i] / z) * scale + oy;
        if ((sx - hud.x) * (sx - hud.x) + (sy - hud.y) * (sy - hud.y) < rr * rr) return false;
      }
    }
    return true;
  }

  /** solve the distance for the subject (on the current orientation, so what is shown is what is measured);
   *  sets des.lnD and the lens anchor (des.ax, des.ay) so that the subject's box is centred on (cx, cy) */
  function solve(spec, tanV, cx, cy) {
    const cyw = Math.cos(cur.yaw), syw = Math.sin(cur.yaw), cp = Math.cos(cur.pitch), sp = Math.sin(cur.pitch);
    f.set(syw * cp, -sp, cyw * cp); r.set(-cyw, 0, syw); u.crossVectors(r, f);
    for (let i = 0; i < n; i++) { rel.subVectors(pts[i], des.t); xs[i] = rel.dot(r); ys[i] = rel.dot(u); zf[i] = rel.dot(f); }
    const scale = view.h / (2 * tanV);
    let lo = Math.log(5), hi = Math.log(90);
    for (let k = 0; k < 22; k++) { const mid = (lo + hi) / 2; if (measure(Math.exp(mid), scale).size > spec.fill) lo = mid; else hi = mid; }
    let ln = hi;
    st.ok = fits(Math.exp(ln), scale, cx, cy);
    if (!st.ok) {
      // too big for the free area (or over the wheel): step back until it fits
      let a = ln, b = Math.log(140);
      if (!fits(Math.exp(b), scale, cx, cy)) ln = b;
      else { for (let k = 0; k < 18; k++) { const mid = (a + b) / 2; if (fits(Math.exp(mid), scale, cx, cy)) b = mid; else a = mid; } ln = b; }
    }
    const m = measure(Math.exp(ln), scale);
    st.fill = m.size;
    des.ax = cx - (m.minX + m.maxX) / 2; des.ay = cy - (m.minY + m.maxY) / 2;
    des.lnD = ln;
  }

  function pickShot(nav, g) {
    const s = nav.state;
    if (s.mode === 'docked') {
      if (g.cheer) return 'cheer';
      if (g.delivering) return 'unload';
      if (g.active.length) return 'board';
      return 'load';
    }
    if (s.mode === 'waitUndock' || s.mode === 'leaving') return 'leave';
    if (s.mode === 'approach') return 'approach';
    return 'sea';
  }
  // a car: its four corners (±1.2 m) at the ground and its roof, so the whole car stays clear of the wheel
  function addCar(c) { add(tmp.set(c.x - 1.2, c.y, c.z - 1.2)); add(tmp.set(c.x + 1.2, c.y, c.z - 1.2)); add(tmp.set(c.x - 1.2, c.y, c.z + 1.2)); add(tmp.set(c.x + 1.2, c.y, c.z + 1.2)); add(tmp.set(c.x, c.y + 1.6, c.z)); }

  function gather(shot, nav, hero, g) {
    n = 0;
    const s = nav.state; const ship = hero.root.matrixWorld;
    const port = s.port;
    if (shot === 'sea' || shot === 'leave' || !port) { addLocal(ship, SHIP_PTS); return; }
    if (shot === 'approach') {
      // the ship; the berth joins in when it is close, so the quay comes into view as the ship backs in
      addLocal(ship, SHIP_PTS);
      if (Math.hypot(port.origin.x - s.x, port.origin.z - s.z) < 22) { add(port.local(0, 0.6, -15.5, tmp)); add(port.local(-4, 0.6, -14, tmp)); add(port.local(4, 0.6, -14, tmp)); }
      return;
    }
    const foot = () => add(port.local(RAMP_FOOT[0], RAMP_FOOT[1], RAMP_FOOT[2], tmp));
    const top = () => add(port.local(RAMP_TOP[0], RAMP_TOP[1], RAMP_TOP[2], tmp));
    if (shot === 'board') {
      // close on the car(s) driving aboard (a 6 m box around each), with the ramp foot and the next car still in the
      // picture, so the next tap is always possible
      for (const c of g.active) for (const [dx, dz] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) add(tmp.set(c.x + dx, c.y + 0.8, c.z + dz));
      foot(); if (g.front) add(g.front);
      return;
    }
    if (shot === 'load') {
      foot(); top(); add(port.local(-2.4, 2.2, -8.6, tmp)); add(port.local(2.4, 2.2, -8.6, tmp)); // the ramp, the stern row, the next car
      if (g.front) addCar(g.front); else for (const c of g.waiting) addCar(c);
      return;
    }
    // unload / cheer: the ramp, the cars on their way, the family (and the house when celebrating)
    foot();
    for (const c of g.active) addCar(c);
    if (g.active.length === 0 && shot === 'unload') for (const c of g.deck) addCar(c);
    for (const c of g.moving) addCar(c);
    for (const a of port.family) { a.object.getWorldPosition(tmp); add(tmp); add(tmp.setY(tmp.y + 2.2)); }
    if (shot === 'cheer') { add(port.local(7.5, 5.5, -30, tmp)); add(port.local(4.8, 0.6, -20.5, tmp)); }
  }

  function update(dt, nav, hero, game) {
    const { w, h } = view; const aspect = w / Math.max(h, 1); const portrait = aspect < 1;
    const s = nav.state;
    const g = game.view();
    st.held = !!g.dragging && s.mode === 'docked';
    // field of view: about 58° across a landscape screen, 50° across a portrait one (vertical fov 40–62°)
    des.fov = portrait ? clamp((2 * Math.atan(Math.tan(25 * DEG) / aspect)) / DEG, 44, 62) : clamp((2 * Math.atan(Math.tan(29 * DEG) / aspect)) / DEG, 38, 50);
    if (!st.held) {
      const shot = pickShot(nav, g); st.shot = shot;
      const spec = SHOTS[shot][portrait ? 'P' : 'L'];
      gather(shot, nav, hero, g);
      box.makeEmpty(); for (let i = 0; i < n; i++) box.expandByPoint(pts[i]);
      box.getCenter(des.t);
      if (shot === 'sea' || shot === 'leave' || !s.port) des.yaw = s.yaw + spec.yaw;
      else des.yaw = s.port.yaw + spec.yaw;
      des.pitch = spec.pitch;
      freeRect(portrait, rect);
      if (first) { cur.yaw = des.yaw; cur.pitch = des.pitch; cur.fov = des.fov; }
      solve(spec, Math.tan((cur.fov * DEG) / 2), rect.l + (rect.r - rect.l) * spec.ax, rect.t + (rect.b - rect.t) * spec.ay);
    }
    if (first) { cur.t.copy(des.t); cur.yaw = des.yaw; cur.pitch = des.pitch; cur.lnD = des.lnD; cur.ax = des.ax; cur.ay = des.ay; cur.fov = des.fov; first = false; }
    // at sea the target follows the ship closely (it moves); in port it glides
    const tauT = st.shot === 'sea' || st.shot === 'leave' ? 0.35 : 0.9;
    cur.t.x = damp(cur.t.x, des.t.x, tauT, dt); cur.t.y = damp(cur.t.y, des.t.y, tauT, dt); cur.t.z = damp(cur.t.z, des.t.z, tauT, dt);
    const dy = wrapAngle(des.yaw - cur.yaw);
    cur.yaw += clamp(dy * (1 - Math.exp(-dt / 1.2)), -MAX_YAW_RATE * dt, MAX_YAW_RATE * dt);
    cur.pitch = damp(cur.pitch, des.pitch, 1.2, dt);
    const dl = des.lnD - cur.lnD;
    cur.lnD += clamp(dl * (1 - Math.exp(-dt / 1.5)), -MAX_ZOOM_RATE * dt, MAX_ZOOM_RATE * dt);
    cur.ax = damp(cur.ax, des.ax, 0.8, dt); cur.ay = damp(cur.ay, des.ay, 0.8, dt);
    cur.fov = damp(cur.fov, des.fov, 0.4, dt);
    apply();
    return cur.t;
  }

  function apply() {
    const { w, h } = view; const d = Math.exp(cur.lnD);
    const ch = Math.cos(cur.pitch) * d;
    camera.position.set(cur.t.x - Math.sin(cur.yaw) * ch, cur.t.y + Math.sin(cur.pitch) * d, cur.t.z - Math.cos(cur.yaw) * ch);
    camera.lookAt(cur.t);
    camera.fov = cur.fov; camera.aspect = w / Math.max(h, 1);
    // lens shift: the look-at point appears at (ax, ay) instead of the screen centre
    camera.setViewOffset(w, h, w / 2 - cur.ax, h / 2 - cur.ay, w, h);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }

  /** jump to the desired framing (after a reset / for screenshots) */
  function snap() { first = true; }

  return {
    update, setView, snap, state: st, target: cur.t,
    debug: () => ({ shot: st.shot, dist: +Math.exp(cur.lnD).toFixed(1), want: +Math.exp(des.lnD).toFixed(1), fill: +st.fill.toFixed(2), fov: +cur.fov.toFixed(1), held: st.held, ok: st.ok }),
  };
}
