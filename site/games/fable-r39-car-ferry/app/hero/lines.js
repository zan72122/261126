// Mooring lines: two ropes from the stern bitts to the quay bollards, with an eye (loop) at the end.
// One dynamic geometry for both; an update only rewrites the position / normal arrays (no allocation).
// Curve: p(t) = lerp(A, B, t) − up · 4·sag·t(1−t)  (+ a throw arc), clamped to the quay / the water.
import { P, COL } from './params.js';
import { clamp, easeInOut, easeOut, smooth } from './geo.js';

export function makeLines(THREE, { own, emit }) {
  const NP = P.lineSeg + 1, RS = P.lineSides, LN = 10, LS = 4; // rope points, ring sides, loop segments, loop sides
  const perRope = NP * RS + LN * LS;
  const pos = new Float32Array(perRope * 2 * 3), nor = new Float32Array(perRope * 2 * 3);
  const idx = [];
  for (let k = 0; k < 2; k++) {
    const base = k * perRope;
    for (let i = 0; i < NP - 1; i++) for (let j = 0; j < RS; j++) {
      const a = base + i * RS + j, b = base + i * RS + ((j + 1) % RS), c = a + RS, d = b + RS;
      idx.push(a, c, b, b, c, d);
    }
    const lb = base + NP * RS;
    for (let i = 0; i < LN; i++) for (let j = 0; j < LS; j++) {
      const a = lb + i * LS + j, b = lb + i * LS + ((j + 1) % LS), c = lb + ((i + 1) % LN) * LS + j, d = lb + ((i + 1) % LN) * LS + ((j + 1) % LS);
      idx.push(a, b, c, b, d, c);
    }
  }
  const geo = own(new THREE.BufferGeometry());
  const pa = new THREE.BufferAttribute(pos, 3), na = new THREE.BufferAttribute(nor, 3);
  pa.setUsage(THREE.DynamicDrawUsage); na.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', pa); geo.setAttribute('normal', na); geo.setIndex(idx);
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -12), 30);
  const material = own(new THREE.MeshLambertMaterial({ color: COL.rope }));
  const mesh = new THREE.Mesh(geo, material); mesh.name = 'mooringLines'; mesh.frustumCulled = false; mesh.visible = false;
  mesh.raycast = () => {};

  // state per rope. mode: off | wait | throw | tighten | taut | release
  const ropes = [0, 1].map((k) => ({ k, mode: 'off', t: 0, delay: 0, sag: 0, twang: 0, ex: 0, ey: 0, ez: 0, bx: 0, by: 0, bz: 0, splash: false }));
  const pts = new Float32Array(NP * 3);
  const LOOP_R = 0.36, EYE_DROP = 0.24;
  let quayY = 0.6, quayEdgeZ = -13.4, tautSent = true;

  function setBollards(b0, b1, qy, qz) { // root-frame positions of the bollard heads
    ropes[0].bx = b0.x; ropes[0].by = b0.y; ropes[0].bz = b0.z; ropes[1].bx = b1.x; ropes[1].by = b1.y; ropes[1].bz = b1.z;
    quayY = qy; quayEdgeZ = qz;
  }
  function throwLines(instant) {
    tautSent = false;
    for (const r of ropes) {
      if (instant) { r.mode = 'taut'; r.t = 0; r.sag = P.sagTaut; r.twang = 0; }
      else { r.mode = 'wait'; r.delay = r.k * P.lineStagger; r.t = 0; r.sag = 0.2; r.twang = 0; }
    }
    if (instant) tautSent = true;
    mesh.visible = true;
  }
  function release() { for (const r of ropes) if (r.mode !== 'off') { r.mode = 'release'; r.t = 0; r.splash = false; } }
  function off() { for (const r of ropes) r.mode = 'off'; mesh.visible = false; tautSent = true; }
  const allTaut = () => ropes[0].mode === 'taut' && ropes[1].mode === 'taut';
  const allOff = () => ropes[0].mode === 'off' && ropes[1].mode === 'off';
  /** true while the eyes are on the bollards */
  const holding = () => ropes.some((r) => r.mode === 'taut' || r.mode === 'tighten');

  /** A0, A1: bitts in the root frame (they move with the hull) */
  function update(dt, time, A0, A1) {
    if (!mesh.visible) return;
    let any = false;
    for (const r of ropes) {
      const A = r.k === 0 ? A0 : A1; const base = r.k * perRope;
      if (r.mode === 'off') { collapse(base, A); continue; }
      any = true;
      const restY = r.by - EYE_DROP; // the eye lies around the bollard, under its head
      let ex = r.bx, ey = restY, ez = r.bz, arc = 0;
      if (r.mode === 'wait') { r.delay -= dt; ex = A.x; ey = A.y; ez = A.z; if (r.delay <= 0) { r.mode = 'throw'; r.t = 0; } }
      else if (r.mode === 'throw') {
        r.t = Math.min(1, r.t + dt / P.lineThrow); const e = easeOut(r.t);
        ex = A.x + (r.bx - A.x) * e; ez = A.z + (r.bz - A.z) * e; ey = A.y + (r.by + 0.45 - A.y) * e + 1.5 * Math.sin(Math.PI * r.t) * (1 - 0.35 * r.t);
        r.sag = 0.15 + 0.55 * r.t; arc = 0.5 * Math.sin(Math.PI * r.t);
        if (r.t >= 1) { r.mode = 'tighten'; r.t = 0; }
      } else if (r.mode === 'tighten') {
        r.t = Math.min(1, r.t + dt / P.lineTighten); const e = smooth(r.t);
        ey = r.by + 0.45 + (restY - (r.by + 0.45)) * Math.min(1, r.t * 2.5);
        r.sag = 0.7 + (P.sagTaut - 0.7) * e * e;
        if (r.t >= 1) { r.mode = 'taut'; r.twang = 1; }
      } else if (r.mode === 'taut') {
        r.sag = P.sagTaut; r.twang = Math.max(0, r.twang - dt * 2.2);
      } else if (r.mode === 'release') {
        r.t = Math.min(1, r.t + dt / P.lineRelease);
        const lift = Math.min(1, r.t / 0.18), back = easeInOut((r.t - 0.14) / 0.86);
        ex = r.bx + (A.x - r.bx) * back; ez = r.bz + (A.z - r.bz) * back;
        ey = restY + (0.75 * Math.sin(Math.min(1, lift) * Math.PI * 0.5)) * (1 - back) + (A.y - restY) * back;
        r.sag = P.sagTaut + (P.sagLoose - P.sagTaut) * Math.sin(Math.PI * clamp(r.t * 1.15, 0, 1)) * (1 - 0.5 * back);
        if (!r.splash && r.t > 0.4) { r.splash = true; if (r.k === 0) emit('sound', { id: 'splash', volume: 0.35 }); }
        if (r.t >= 1) { r.mode = 'off'; collapse(base, A); continue; }
      }
      r.ex = ex; r.ey = ey; r.ez = ez;
      // rope end: on the eye's rim, toward the ship
      let dx = A.x - ex, dz = A.z - ez; const dl = Math.hypot(dx, dz); if (dl > 1e-3) { dx /= dl; dz /= dl; } else { dx = 0; dz = 1; }
      const reach = Math.min(LOOP_R, dl * 0.5);
      const bx = ex + dx * reach, by = ey, bz = ez + dz * reach;
      const tw = r.twang > 0 ? Math.sin(time * 58) * 0.05 * r.twang * r.twang : 0;
      for (let i = 0; i < NP; i++) {
        const t = i / (NP - 1), bow = 4 * t * (1 - t);
        let x = A.x + (bx - A.x) * t, y = A.y + (by - A.y) * t - r.sag * bow + arc * bow, z = A.z + (bz - A.z) * t;
        x += -dz * tw * bow; z += dx * tw * bow;
        const floor = (z < quayEdgeZ + 0.06 ? quayY : -0.14) + P.lineR;
        if (y < floor && i > 0 && i < NP - 1) y = floor;
        pts[i * 3] = x; pts[i * 3 + 1] = y; pts[i * 3 + 2] = z;
      }
      writeTube(base);
      writeLoop(base + NP * RS, ex, ey, ez, r.mode === 'throw' ? 1 - r.t : 0, time);
    }
    pa.needsUpdate = true; na.needsUpdate = true;
    if (!any) mesh.visible = false;
    if (!tautSent && allTaut()) { tautSent = true; emit('lineTaut', {}); }
  }

  function collapse(base, A) {
    for (let i = 0; i < perRope; i++) { const o = (base + i) * 3; pos[o] = A.x; pos[o + 1] = A.y; pos[o + 2] = A.z; nor[o] = 0; nor[o + 1] = 1; nor[o + 2] = 0; }
  }
  function writeTube(base) {
    for (let i = 0; i < NP; i++) {
      const i0 = Math.max(0, i - 1), i1 = Math.min(NP - 1, i + 1);
      let tx = pts[i1 * 3] - pts[i0 * 3], ty = pts[i1 * 3 + 1] - pts[i0 * 3 + 1], tz = pts[i1 * 3 + 2] - pts[i0 * 3 + 2];
      let l = Math.hypot(tx, ty, tz); if (l < 1e-5) { tx = 0; ty = 0; tz = -1; l = 1; } tx /= l; ty /= l; tz /= l;
      // n1 = t × up (horizontal), n2 = n1 × t
      let n1x = -tz, n1y = 0, n1z = tx; let nl = Math.hypot(n1x, n1z); if (nl < 1e-4) { n1x = 1; n1z = 0; nl = 1; } n1x /= nl; n1z /= nl;
      const n2x = n1y * tz - n1z * ty, n2y = n1z * tx - n1x * tz, n2z = n1x * ty - n1y * tx;
      for (let j = 0; j < RS; j++) {
        const a = (j / RS) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
        const nx = n1x * c + n2x * s, ny = n1y * c + n2y * s, nz = n1z * c + n2z * s; const o = (base + i * RS + j) * 3;
        pos[o] = pts[i * 3] + nx * P.lineR; pos[o + 1] = pts[i * 3 + 1] + ny * P.lineR; pos[o + 2] = pts[i * 3 + 2] + nz * P.lineR;
        nor[o] = nx; nor[o + 1] = ny; nor[o + 2] = nz;
      }
    }
  }
  function writeLoop(base, cx, cy, cz, spin, time) {
    // a small torus lying flat; it tumbles a little while flying
    const tilt = spin * 1.2, ct = Math.cos(tilt), st = Math.sin(tilt), yaw = spin * 9;
    for (let i = 0; i < LN; i++) {
      const a = (i / LN) * Math.PI * 2 + yaw, ca = Math.cos(a), sa = Math.sin(a);
      for (let j = 0; j < LS; j++) {
        const b = (j / LS) * Math.PI * 2, cb = Math.cos(b), sb = Math.sin(b);
        const rr = LOOP_R + cb * P.lineR * 1.05;
        let x = ca * rr, y = sb * P.lineR * 1.05, z = sa * rr, nx = ca * cb, ny = sb, nz = sa * cb;
        // tilt about x
        const y2 = y * ct - z * st, z2 = y * st + z * ct, ny2 = ny * ct - nz * st, nz2 = ny * st + nz * ct;
        const o = (base + i * LS + j) * 3;
        pos[o] = cx + x; pos[o + 1] = cy + y2; pos[o + 2] = cz + z2; nor[o] = nx; nor[o + 1] = ny2; nor[o + 2] = nz2;
      }
    }
  }

  return { mesh, setBollards, throwLines, release, off, update, allTaut, allOff, holding, tris: idx.length / 3 };
}
