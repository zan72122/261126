// The toy car: a round open pickup driven by an animal. One template geometry; each car gets its own
// colored copy of the body (so body + trim is one draw call) and shares wheels, shadow and hit box.
// Draw calls per car: body, front axle, rear axle, driver (from the shell), shadow = 5.
import { P, COL } from './params.js';
import { clamp } from './geo.js';

const TAG_PAINT = 1, TAG_DARK = 2;

export function makeCarFactory(THREE, kit, { makeDriver, hintColor, shadowMat, hitMat }) {
  const { Builder, mat } = kit;
  const C = P.car;
  const cars = new Set();

  // ---------------- template: body ----------------
  function buildBody() {
    const B = new Builder();
    // lofted shell: [z, half width, bottom, top]
    const st = [
      [-1.3, 0.46, 0.44, 0.8], [-1.25, 0.66, 0.33, 0.92], [-1.08, 0.75, 0.27, 0.98], [-0.5, 0.77, C.bodyLo, 0.98],
      [-0.43, 0.77, C.bodyLo, 0.75], [0.25, 0.77, C.bodyLo, 0.75], [0.33, 0.77, C.bodyLo, C.bodyHi],
      [0.78, 0.75, 0.26, 0.91], [1.08, 0.72, 0.28, 0.85], [1.25, 0.64, 0.34, 0.77], [1.3, 0.46, 0.44, 0.68],
    ];
    const NA = 16, e = 0.5;
    const ring = (i, j, o) => {
      const [z, a, lo, hi] = st[i]; const f = (j / NA) * Math.PI * 2, c = Math.cos(f), s = Math.sin(f);
      o.x = a * Math.sign(c) * Math.pow(Math.abs(c), e); o.y = (lo + hi) / 2 + ((hi - lo) / 2) * Math.sign(s) * Math.pow(Math.abs(s), e); o.z = z;
      o.color = 0xffffff; o.tag = TAG_PAINT;
    };
    B.grid(st.length, NA + 1, ring, { flip: true });
    // end caps
    const o = { x: 0, y: 0, z: 0 }, pts = [];
    for (const [i, dir] of [[0, -1], [st.length - 1, 1]]) {
      pts.length = 0; for (let j = 0; j < NA; j++) { ring(i, j, o); pts.push([o.x, o.y, o.z]); }
      const c = [0, (st[i][2] + st[i][3]) / 2, st[i][0] + dir * 0.03];
      for (let j = 0; j < NA; j++) { const a = pts[j], b = pts[(j + 1) % NA]; if (dir > 0) B.tri(c, a, b, 0xffffff, TAG_PAINT); else B.tri(c, b, a, 0xffffff, TAG_PAINT); }
    }
    // seat and seat back (the driver sits in the low part)
    B.box(1.16, 0.06, 0.6, 0x4a4f5c, 0, 0.775, -0.1);
    B.add(new THREE.SphereGeometry(0.3, 7, 4), 0xfff1d6, mat(0, 0.98, -0.47, 0, 0, 0, 1.95, 0.75, 0.3));
    // windshield: frame and pale glass
    const wy = 1.09, wz = 0.38, tilt = -0.36;
    B.box(1.2, 0.27, 0.03, COL.glassLight, 0, wy, wz, tilt, 0, 0);
    B.box(1.3, 0.05, 0.06, 0xf4f6f8, 0, wy + 0.135, wz - 0.05, tilt, 0, 0);
    for (const sx of [1, -1]) B.box(0.05, 0.33, 0.06, 0xf4f6f8, sx * 0.625, wy - 0.01, wz, tilt, 0, 0);
    // steering wheel
    B.add(new THREE.TorusGeometry(0.13, 0.028, 3, 8), 0x2a2b30, mat(0, 0.97, 0.2, -0.9, 0, 0));
    // fenders over the wheels
    for (const sx of [1, -1]) for (const sz of [1, -1]) {
      B.add(new THREE.TorusGeometry(C.wheelR + 0.075, 0.085, 4, 6, Math.PI * 1.06), 0xfffaf0, mat(sx * (C.track + 0.02), C.wheelR, sz * C.wheelbase / 2, 0, Math.PI / 2, -0.03 * Math.PI, 1, 1, 1.9));
    }
    // bumpers, lights, a smile
    for (const sz of [1, -1]) B.add(new THREE.CapsuleGeometry(0.07, 1.16, 2, 5), 0xe8edf2, mat(0, 0.37, sz * 1.31, 0, 0, Math.PI / 2));
    for (const sx of [1, -1]) {
      B.add(new THREE.SphereGeometry(0.135, 7, 4), 0xfff6c8, mat(sx * 0.44, 0.66, 1.235, 0, 0, 0, 1, 1, 0.6));
      B.add(new THREE.SphereGeometry(0.05, 4, 2), 0x3a3d45, mat(sx * 0.44, 0.67, 1.31, 0, 0, 0, 1, 1, 0.5));
      B.box(0.2, 0.11, 0.05, 0xe5372f, sx * 0.47, 0.72, -1.29);
      B.box(0.05, 0.1, 0.78, 0xfffaf0, sx * 0.66, 1.02, -0.86); // rails of the cargo bed
    }
    B.box(1.37, 0.1, 0.05, 0xfffaf0, 0, 1.02, -1.25);
    B.add(new THREE.TorusGeometry(0.15, 0.03, 3, 6, Math.PI), 0x3a3d45, mat(0, 0.56, 1.3, 0, 0, Math.PI));
    return B.build({ keepTag: true });
  }

  // ---------------- template: one axle = two wheels that roll together ----------------
  function buildAxle() {
    const B = new Builder(); const R = C.wheelR, hw = C.wheelW / 2;
    for (const sx of [1, -1]) {
      const m = B.mark();
      const prof = [[R * 0.86, -hw], [R, -hw * 0.6], [R, hw * 0.6], [R * 0.86, hw], [R * 0.56, hw]].map(([r, y]) => new THREE.Vector2(r, y));
      B.add(new THREE.LatheGeometry(prof, 12), 0x2b2c31, mat(0, 0, 0, 0, 0, -Math.PI / 2));
      B.add(new THREE.CircleGeometry(R * 0.6, 12), 0xf6f3ea, mat(hw - 0.025, 0, 0, 0, Math.PI / 2, 0));
      // a star on the hub: the turning of the wheel is easy to see
      const sxp = hw - 0.012, c = [sxp + 0.012, 0, 0];
      for (let k = 0; k < 10; k++) {
        const a0 = (k / 10) * Math.PI * 2, a1 = ((k + 1) / 10) * Math.PI * 2, r0 = k % 2 ? 0.075 : 0.19, r1 = k % 2 ? 0.19 : 0.075;
        B.tri(c, [sxp, Math.cos(a0) * r0, Math.sin(a0) * r0], [sxp, Math.cos(a1) * r1, Math.sin(a1) * r1], COL.yellow);
      }
      B.transform(mat(sx * C.track, 0, 0, 0, 0, 0, sx, 1, 1), m);
      if (sx < 0) flipWinding(B, m);
    }
    B.rod(-C.track, 0, 0, C.track, 0, 0, 0.06, 0x2b2c31, 5);
    return B.build();
  }
  function flipWinding(B, m) { for (let k = m.i; k < B.idx.length; k += 3) { const t = B.idx[k + 1]; B.idx[k + 1] = B.idx[k + 2]; B.idx[k + 2] = t; } }

  const bodyTemplate = buildBody();
  const axleGeo = buildAxle();
  const wheelMat = new THREE.MeshLambertMaterial({ vertexColors: true });
  const shadowGeo = new THREE.PlaneGeometry(C.width * 1.5, C.length * 1.3); shadowGeo.rotateX(-Math.PI / 2);
  const hitGeo = new THREE.BoxGeometry(C.width + 0.6, 2.1, C.length + 0.6); hitGeo.translate(0, 1.0, 0);
  const noRaycast = () => {};
  const _c = new THREE.Color();
  const triCount = (bodyTemplate.index.count + axleGeo.index.count * 2) / 3 + 2;

  let seq = 0;
  function createCar(spec = {}) {
    const object = new THREE.Group(); object.name = 'car' + (spec.id ?? seq); seq++;
    // body geometry with this car's paint baked into the vertex colors
    const geo = bodyTemplate.clone(); geo.userData = {};
    const col = geo.attributes.color, tag = bodyTemplate.userData.tag;
    _c.set(spec.color ?? 0xff6b6b); const pr = _c.r, pg = _c.g, pb = _c.b;
    for (let i = 0; i < col.count; i++) {
      if (tag[i] === TAG_PAINT) col.setXYZ(i, pr, pg, pb); else if (tag[i] === TAG_DARK) col.setXYZ(i, pr * 0.55, pg * 0.55, pb * 0.55);
    }
    const paint = new THREE.MeshPhongMaterial({ vertexColors: true, emissive: 0x000000, specular: 0x30343a, shininess: 46 });
    const rig = new THREE.Group(); object.add(rig);
    const body = new THREE.Group(); rig.add(body);
    const shell = new THREE.Mesh(geo, paint); shell.raycast = noRaycast; body.add(shell);
    const axles = [1, -1].map((sz) => { const w = new THREE.Mesh(axleGeo, wheelMat); w.position.set(0, C.wheelR, sz * C.wheelbase / 2); w.raycast = noRaycast; rig.add(w); return w; });
    let driver = null;
    try { driver = makeDriver ? makeDriver(spec.driver || 'bear') : null; } catch (e) { driver = null; }
    if (driver) { driver.position.set(0, C.seatY, C.seatZ); body.add(driver); }
    const cargoAnchor = new THREE.Group(); cargoAnchor.position.set(0, C.cargoY, C.cargoZ); body.add(cargoAnchor);
    const shadow = new THREE.Mesh(shadowGeo, shadowMat); shadow.position.y = 0.02; shadow.renderOrder = 1; shadow.raycast = noRaycast; object.add(shadow);
    const hit = new THREE.Mesh(hitGeo, hitMat); hit.visible = false; object.add(hit);

    // cosmetic motion (springs): a = anim state
    const a = { hopT: -1, hopDur: 0.35, hopH: 0, squash: 0, squashV: 0, pitch: 0, pitchV: 0, bounce: 0, bounceV: 0, dist: 0, speed: 0, drop: 0, phase: Math.random() * 6.28, look: 0, glow: 0 };
    let disposed = false;
    const handle = {
      object, spec, length: C.length, width: C.width, cargoAnchor, body,
      roll(d) { if (!Number.isFinite(d)) return; const r = d / C.wheelR; axles[0].rotation.x += r; axles[1].rotation.x += r; a.dist += d; },
      setGlow(v) { v = clamp(Number.isFinite(v) ? v : 0, 0, 1); if (v === a.glow) return; a.glow = v; paint.emissive.copy(hintColor).multiplyScalar(v * 0.6); },
      dispose() {
        if (disposed) return; disposed = true; cars.delete(handle);
        geo.dispose(); paint.dispose(); if (object.parent) object.parent.remove(object);
      },
      // ---- used by the hero only ----
      _hit: hit, _rig: rig, _shadow: shadow, _driver: driver, _lift: 0, _lean: 0, _nod: 0,
      /** a quick cosmetic hop (does not move the car) */
      _hop(h = 0.25, dur = 0.34) { if (a.hopT >= 0 && a.hopH > h) return; a.hopT = 0; a.hopH = h; a.hopDur = dur; },
      /** landing: squash and bounce */
      _land(v = 1) { a.squashV += 3.6 * v; a.bounceV -= 0.5 * v; },
      /** a bump from the road (the ramp's edge) */
      _bump(v = 1) { a.bounceV += 0.9 * v; a.pitchV += 0.5 * v; },
      /** start height above the ground that melts away (taking over a car in mid hop) */
      _dropFrom(h) { a.drop = clamp(h, 0, 1); },
      _airborne() { return a.hopT >= 0; },
      _calm() { a.hopT = -1; a.squash = a.squashV = a.pitch = a.pitchV = a.bounce = a.bounceV = 0; a.drop = 0; a.dist = 0; handle._lift = 0; handle._lean = 0; handle._nod = 0; apply(0); },
      _tick(dt, time) {
        // speed from the rolled distance → the body leans back when it speeds up, dips when it brakes
        if (dt > 1e-5) {
          const v = clamp(a.dist / dt, -12, 12); const acc = clamp((v - a.speed) / dt, -14, 14); a.speed = v; a.dist = 0;
          const tp = clamp(-acc * 0.011, -0.085, 0.085);
          a.pitchV += (190 * (tp - a.pitch) - 11 * a.pitchV) * dt; a.pitch += a.pitchV * dt;
          a.bounceV += (-260 * a.bounce - 9 * a.bounceV) * dt; a.bounce += a.bounceV * dt;
          a.squashV += (-420 * a.squash - 13 * a.squashV) * dt; a.squash += a.squashV * dt;
          a.drop *= Math.exp(-dt / 0.07);
          if (!Number.isFinite(a.pitch + a.bounce + a.squash)) { a.pitch = a.pitchV = a.bounce = a.bounceV = a.squash = a.squashV = 0; }
        }
        let hy = 0;
        if (a.hopT >= 0) {
          a.hopT += dt / a.hopDur;
          if (a.hopT >= 1) { a.hopT = -1; handle._land(clamp(a.hopH * 3, 0.3, 1)); } else hy = a.hopH * 4 * a.hopT * (1 - a.hopT);
        }
        a.look = Math.sin(time * 0.9 + a.phase) * 0.28 + Math.sin(time * 0.37 + a.phase * 2) * 0.18;
        apply(hy);
      },
    };
    function apply(hy) {
      const y = hy + a.drop + handle._lift;
      rig.position.y = y;
      const sq = clamp(a.squash, -0.25, 0.3);
      rig.scale.set(1 + sq * 0.5, 1 - sq, 1 + sq * 0.5);
      body.position.y = clamp(a.bounce, -0.08, 0.14);
      body.rotation.x = clamp(a.pitch, -0.12, 0.12) + handle._nod;
      body.rotation.z = handle._lean;
      const sh = 1 / (1 + Math.max(y, 0) * 0.55); shadow.scale.set(sh, 1, sh);
      if (driver) { driver.rotation.y = a.look; driver.position.y = C.seatY + clamp(-a.bounce * 0.5, -0.03, 0.06); }
    }
    object.userData.carHandle = handle;
    cars.add(handle);
    return handle;
  }

  function dispose() {
    for (const h of Array.from(cars)) h.dispose();
    bodyTemplate.dispose(); axleGeo.dispose(); wheelMat.dispose(); shadowGeo.dispose(); hitGeo.dispose();
  }
  return { createCar, cars, dispose, triCount };
}
