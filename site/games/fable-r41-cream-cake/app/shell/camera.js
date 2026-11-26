// Camera rig: frames the subject (the cake while decorating; cake/box + customer when giving and celebrating) by
// its size on screen instead of fitting the whole shop. The distance is solved from the subject's projected size:
//   decorate  -> the cake (sponge + top + cream) fills 62-68% of the screen's short side
//   boxing    -> cake and box, a little wider
//   give/party-> parcel and customer together, the camera pulls back slowly
// Pose = look target T, distance d, pitch e (yaw is always 0: the camera looks toward -Z). Every component is
// eased with a critically damped spring (no overshoot, no shake). A resize snaps to the new framing at once.
import { THREE } from './util.js';
import { L } from './world.js';

const DEG = Math.PI / 180;
export const FOV = 32;
const TAN = Math.tan((FOV * DEG) / 2);

// Critically damped spring toward a moving target (Game Programming Gems 4, "smooth damp").
export class Damped {
  constructor(v = 0) { this.v = v; this.vel = 0; }
  snap(v) { this.v = v; this.vel = 0; }
  to(target, smoothTime, dt) {
    const omega = 2 / Math.max(1e-3, smoothTime);
    const x = omega * dt;
    const k = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    const change = this.v - target;
    const temp = (this.vel + omega * change) * dt;
    this.vel = (this.vel - omega * temp) * k;
    this.v = target + (change + temp) * k;
    return this.v;
  }
}

// Framing per mode. frac = subject size; 'short' = largest side of the subject / screen short side,
// 'fit' = the subject's extent / the screen extent on its tightest axis. ox/oy = where the subject center sits (NDC).
const FRAMES = {
  landscape: {
    idle: { e: 47, frac: 0.62, fit: 'short', ox: 0, oy: -0.13, smooth: 0.9 },
    work: { e: 47, frac: 0.68, fit: 'short', ox: 0, oy: -0.13, smooth: 0.8 },
    boxing: { e: 42, frac: 0.66, fit: 'short', ox: 0, oy: -0.04, smooth: 1.0 },
    give: { e: 32, frac: 0.8, fit: 'fit', ox: 0, oy: -0.04, smooth: 1.3 },
    party: { e: 30, frac: 0.78, fit: 'fit', ox: 0, oy: -0.02, smooth: 1.4 },
  },
  portrait: {
    idle: { e: 49, frac: 0.64, fit: 'short', ox: 0, oy: -0.2, smooth: 0.9 },
    work: { e: 49, frac: 0.7, fit: 'short', ox: 0, oy: -0.2, smooth: 0.8 },
    boxing: { e: 42, frac: 0.7, fit: 'short', ox: 0, oy: -0.12, smooth: 1.0 },
    give: { e: 34, frac: 0.86, fit: 'fit', ox: 0, oy: -0.08, smooth: 1.3 },
    party: { e: 32, frac: 0.86, fit: 'fit', ox: 0, oy: -0.06, smooth: 1.4 },
  },
};

export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    camera.fov = FOV;
    this.w = 1; this.h = 1; this.aspect = 1; this.portrait = false;
    this.mode = 'idle';
    this.creamH = 0.25;        // tallest cream (cake-local, sampled from the hero), part of the subject
    this.activeHold = 0;       // keeps the "work" framing a moment after the finger lifts (no pumping)
    this.snapNext = true;
    this.T = [new Damped(), new Damped(), new Damped()];
    this.D = new Damped(10); this.E = new Damped(45 * DEG);
    this.pose = { t: new THREE.Vector3(), d: 10, e: 45 * DEG };
    this._pts = [];
    for (let i = 0; i < 64; i++) this._pts.push(new THREE.Vector3());
    this._n = 0;
    this._C = new THREE.Vector3(); this._P = new THREE.Vector3(); this._T = new THREE.Vector3();
    this._b = new THREE.Vector3(); this._u = new THREE.Vector3(); this._rel = new THREE.Vector3();
    this.lastFrac = 0;
  }

  setViewport(w, h) {
    this.w = Math.max(1, w); this.h = Math.max(1, h);
    this.aspect = this.w / this.h;
    this.portrait = this.aspect < 1;
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
    this.snapNext = true;
  }

  get frames() { return this.portrait ? FRAMES.portrait : FRAMES.landscape; }

  // ---------- subject point sets ----------
  _reset() { this._n = 0; }
  _add(x, y, z) { if (this._n < this._pts.length) this._pts[this._n++].set(x, y, z); }
  _ring(cx, y, cz, r, n = 10) { for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; this._add(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r); } }
  // the cake standing on the turntable (sponge bottom .. cream top)
  _cake(cx, y0, cz, creamH) {
    const R = L.radius + 0.06;
    this._ring(cx, y0, cz, R);
    this._ring(cx, y0 + L.spongeH, cz, R);
    // cream peaks are narrow: count 70% of their height so a tall swirl doesn't shrink the whole cake
    this._ring(cx, y0 + L.spongeH + Math.max(0.2, creamH * 0.7), cz, R * 0.6, 6);
  }
  _boxPts(cx, y0, cz) {
    const h = 2.35 + 0.45;
    for (const sx of [-1.5, 1.5]) for (const sz of [-1.5, 1.5]) { this._add(cx + sx, y0, cz + sz); this._add(cx + sx, y0 + h, cz + sz); }
  }
  _custPts(p, top = 2.9) {
    for (const sx of [-0.85, 0.85]) for (const sz of [-0.6, 0.6]) { this._add(p.x + sx, 0, p.z + sz); this._add(p.x + sx, top, p.z + sz); }
  }

  subjectFor(mode) {
    this._reset();
    if (mode === 'idle' || mode === 'work') this._cake(0, L.plateTop, 0, this.creamH);
    else if (mode === 'boxing') { this._cake(0, L.plateTop, 0, this.creamH); this._boxPts(0, L.plateTop, 0); }
    else if (mode === 'give') { this._boxPts(0, L.plateTop, 0); this._custPts(L.custGive); }
    else { this._cake(L.parcelGive.x, 0, L.parcelGive.z, this.creamH); this._custPts(L.custGive, 3.4); }
    return this._n;
  }

  // ---------- solver ----------
  // camera basis for pitch e: b = from target toward camera, u = camera up, right = +X
  _basis(e) { this._b.set(0, Math.sin(e), Math.cos(e)); this._u.set(0, Math.cos(e), -Math.sin(e)); }
  _place(C, d, ox, oy, out) {
    const hh = d * TAN, hw = hh * this.aspect;
    out.copy(C);
    out.x -= ox * hw;
    out.addScaledVector(this._u, -oy * hh);
    return out;
  }
  // projected NDC bbox of the current points for (C, d, e, ox, oy) -> [minx, maxx, miny, maxy] or null if behind
  _bbox(C, d, ox, oy, bb) {
    const T = this._place(C, d, ox, oy, this._T);
    const P = this._P.copy(T).addScaledVector(this._b, d);
    bb[0] = bb[2] = Infinity; bb[1] = bb[3] = -Infinity;
    for (let i = 0; i < this._n; i++) {
      const r = this._rel.copy(this._pts[i]).sub(P);
      const depth = -r.dot(this._b);
      if (depth < 0.5) return null;
      const x = r.x / (depth * TAN * this.aspect), y = r.dot(this._u) / (depth * TAN);
      if (x < bb[0]) bb[0] = x; if (x > bb[1]) bb[1] = x;
      if (y < bb[2]) bb[2] = y; if (y > bb[3]) bb[3] = y;
    }
    return bb;
  }
  _metric(bb, fit) {
    if (!bb) return Infinity;
    const wN = (bb[1] - bb[0]) / 2, hN = (bb[3] - bb[2]) / 2; // fractions of screen width / height
    if (fit === 'fit') return Math.max(wN, hN);
    return Math.max(wN * this.w, hN * this.h) / Math.min(this.w, this.h);
  }

  // Solve the pose that frames the current points. Writes {t, d, e} into out.
  solve(f, out) {
    const e = f.e * DEG;
    this._basis(e);
    const C = this._C.set(0, 0, 0);
    let minY = Infinity, maxY = -Infinity, minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < this._n; i++) {
      const p = this._pts[i];
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
    }
    C.set((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
    let ox = f.ox, oy = f.oy, d = 10;
    const bb = [0, 0, 0, 0];
    for (let pass = 0; pass < 3; pass++) {
      let lo = Math.log(2.5), hi = Math.log(150);
      for (let it = 0; it < 22; it++) {
        const m = (lo + hi) / 2;
        if (this._metric(this._bbox(C, Math.exp(m), ox, oy, bb), f.fit) > f.frac) lo = m; else hi = m;
      }
      d = Math.exp(hi);
      const b2 = this._bbox(C, d, ox, oy, bb);
      if (!b2) break;
      // move the subject's projected center onto the requested anchor
      ox -= (b2[0] + b2[1]) / 2 - f.ox;
      oy -= (b2[2] + b2[3]) / 2 - f.oy;
    }
    out.t.copy(this._place(C, d, ox, oy, this._T));
    out.d = d; out.e = e;
    return out;
  }

  // Pose for a mode without touching the camera (used by the tray layout).
  poseFor(mode, out = { t: new THREE.Vector3(), d: 0, e: 0 }) { this.subjectFor(mode); return this.solve(this.frames[mode], out); }

  // Project a world point with a pose -> pixel {x, y} (top-left origin) or null.
  projectWith(pose, p, out = { x: 0, y: 0, depth: 0 }) {
    this._basis(pose.e);
    const P = this._P.copy(pose.t).addScaledVector(this._b, pose.d);
    const r = this._rel.copy(p).sub(P);
    const depth = -r.dot(this._b);
    if (depth < 0.05) return null;
    out.x = (r.x / (depth * TAN * this.aspect) * 0.5 + 0.5) * this.w;
    out.y = (0.5 - r.dot(this._u) / (depth * TAN) * 0.5) * this.h;
    out.depth = depth;
    return out;
  }

  // Ray (world) from a pixel through a pose.
  rayWith(pose, px, py, ray) {
    this._basis(pose.e);
    const P = this._P.copy(pose.t).addScaledVector(this._b, pose.d);
    const nx = (px / this.w) * 2 - 1, ny = 1 - (py / this.h) * 2;
    ray.origin.copy(P);
    ray.direction.set(nx * TAN * this.aspect, 0, 0).addScaledVector(this._u, ny * TAN).addScaledVector(this._b, -1).normalize();
    return ray;
  }

  // ---------- per frame ----------
  // g: the Game. Chooses the mode from the play state and eases the camera toward its framing.
  update(dt, g) {
    const s = g.scene;
    let mode;
    const p = g.ptr;
    // while a finger pipes / carries the bag or a fruit, the camera holds still: the spot under a resting finger
    // must not drift (a still finger means "swirl here"). It eases to the new framing once the finger lifts.
    const hold = !this.snapNext && p && (p.mode === 'pipe' || p.mode === 'bag' || p.mode === 'carry');
    if (s === 'decorate') {
      const busy = (p && (p.mode === 'pipe' || p.mode === 'bag' || p.mode === 'carry')) || g.auto || g.hero.getState().phase !== 'idle';
      if (busy) this.activeHold = 2.2; else this.activeHold = Math.max(0, this.activeHold - dt);
      mode = this.activeHold > 0 ? 'work' : 'idle';
    } else if (s === 'boxing') mode = 'boxing';
    else if (s === 'give') mode = 'give';
    else if (s === 'leaving' && g.traysIn) mode = 'idle'; // the next sponge is sliding in: come back already
    else mode = 'party'; // party, leaving
    this.mode = mode;
    // tallest cream, sampled a few times a second (subject grows as the cream piles up)
    this._creamT = (this._creamT || 0) - dt;
    if (this._creamT <= 0 && (s === 'decorate' || s === 'boxing')) {
      this._creamT = 0.3;
      let m = 0;
      for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) { const x = i * 0.36, z = j * 0.36; if (x * x + z * z < 1.3) m = Math.max(m, g.hero.heightAt(x, z)); }
      this.creamH = m;
    }
    const f = this.frames[mode];
    this.subjectFor(mode);
    const goal = this.solve(f, this._goal || (this._goal = { t: new THREE.Vector3(), d: 0, e: 0 }));
    if (hold) {
      // brake within ~0.1 s (no sudden stop), then stand still; the spring restarts from rest afterwards
      const k = Math.exp(-16 * dt);
      for (const d of [this.T[0], this.T[1], this.T[2], this.D, this.E]) { d.vel *= k; d.v += d.vel * dt; }
    } else if (this.snapNext) {
      this.snapNext = false;
      this.T[0].snap(goal.t.x); this.T[1].snap(goal.t.y); this.T[2].snap(goal.t.z); this.D.snap(goal.d); this.E.snap(goal.e);
    } else {
      const st = f.smooth;
      this.T[0].to(goal.t.x, st, dt); this.T[1].to(goal.t.y, st, dt); this.T[2].to(goal.t.z, st, dt);
      this.D.to(goal.d, st, dt); this.E.to(goal.e, st * 1.15, dt);
    }
    this.pose.t.set(this.T[0].v, this.T[1].v, this.T[2].v); this.pose.d = this.D.v; this.pose.e = this.E.v;
    this.apply(this.pose);
  }

  apply(pose) {
    const cam = this.camera;
    this._basis(pose.e);
    cam.position.copy(pose.t).addScaledVector(this._b, pose.d);
    cam.up.set(0, 1, 0);
    cam.lookAt(pose.t);
    cam.updateMatrixWorld();
  }

  // Debug: how much of the short side the cake occupies with the actual camera (top+cream only, and whole cake).
  measure() {
    this._reset(); this._cake(0, L.plateTop, 0, this.creamH);
    const v = this._rel, S = Math.min(this.w, this.h);
    let a = [Infinity, -Infinity, Infinity, -Infinity];
    for (let i = 0; i < this._n; i++) {
      v.copy(this._pts[i]).project(this.camera);
      a[0] = Math.min(a[0], v.x); a[1] = Math.max(a[1], v.x); a[2] = Math.min(a[2], v.y); a[3] = Math.max(a[3], v.y);
    }
    const wpx = (a[1] - a[0]) / 2 * this.w, hpx = (a[3] - a[2]) / 2 * this.h;
    return { frac: Math.max(wpx, hpx) / S, wFrac: wpx / S, hFrac: hpx / S, d: this.pose.d, e: this.pose.e / DEG, mode: this.mode };
  }
}
