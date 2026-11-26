// Small geometry toolkit: lofts (smooth organic tubes), clumps, ribbons, merging.
import * as THREE from './three.module.min.js';

const _v = new THREE.Vector3();

// rings: [{y, rx, rz, x=0, z=0, p=2}] along local Y. seam at back (-z).
export function loftGeo(rings, seg = 28, o = {}) {
  const pos = [], uv = [], idx = [];
  const n = rings.length;
  let acc = 0; const vs = [0];
  for (let i = 1; i < n; i++) {
    const a = rings[i - 1], b = rings[i];
    acc += Math.hypot(b.y - a.y, (b.x || 0) - (a.x || 0), (b.z || 0) - (a.z || 0));
    vs.push(acc);
  }
  const L = acc || 1;
  for (let i = 0; i < n; i++) {
    const r = rings[i]; const p = r.p || 2; const ex = 2 / p;
    for (let j = 0; j <= seg; j++) {
      const a = j / seg * Math.PI * 2;
      const s = Math.sin(a), c = -Math.cos(a);
      let px = Math.sign(s) * Math.pow(Math.abs(s), ex) * r.rx;
      let pz = Math.sign(c) * Math.pow(Math.abs(c), ex) * r.rz;
      let k = 1;
      if (o.disp) k += o.disp(vs[i] / L, a, i, j);
      if (r.front && c > 0) pz *= 1 + r.front * c; // push front (belly/chest)
      if (r.back && c < 0) pz *= 1 + r.back * -c;
      pos.push((r.x || 0) + px * k, r.y, (r.z || 0) + pz * k);
      uv.push(j / seg * (o.uScale || 1), vs[i] / L * (o.vScale || 1));
    }
  }
  const W = seg + 1;
  const asc0 = rings[n - 1].y >= rings[0].y;
  const effFlip = (!!o.flip) !== (!asc0);
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < seg; j++) {
    const a = i * W + j, b = a + 1, c = a + W, d = c + 1;
    if (effFlip) idx.push(a, b, c, b, d, c); else idx.push(a, c, b, b, c, d);
  }
  const capAt = (ri, dirSign) => {
    const r = rings[ri];
    const ci = pos.length / 3;
    pos.push(r.x || 0, r.y + (r.capBulge || 0) * dirSign, r.z || 0); uv.push(0.5, vs[ri] / L * (o.vScale || 1));
    for (let j = 0; j < seg; j++) {
      const a = ri * W + j, b = a + 1;
      // orientation: start cap faces -dir
      if ((dirSign > 0) !== !!o.flip) idx.push(ci, b, a); else idx.push(ci, a, b);
    }
  };
  // ring order may be descending (arms go -y). decide cap direction from ring ordering
  const asc = rings[n - 1].y > rings[0].y;
  if (o.capStart) capAt(0, asc ? -1 : 1);
  if (o.capEnd) capAt(n - 1, asc ? 1 : -1);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  fixSeam(g, n, W);
  return g;
}

function fixSeam(g, n, W) {
  const nr = g.attributes.normal;
  for (let i = 0; i < n; i++) {
    const a = i * W, b = i * W + W - 1;
    _v.set(nr.getX(a) + nr.getX(b), nr.getY(a) + nr.getY(b), nr.getZ(a) + nr.getZ(b)).normalize();
    nr.setXYZ(a, _v.x, _v.y, _v.z); nr.setXYZ(b, _v.x, _v.y, _v.z);
  }
}

// a flattened tapered strand along points. out(pt) -> outward vector for orientation.
export function clumpGeo(points, width, thick, out, o = {}) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  const N = o.segs || 14, M = o.around || 8;
  const pos = [], uv = [], idx = [];
  const P = new THREE.Vector3(), T = new THREE.Vector3(), O = new THREE.Vector3(), S = new THREE.Vector3();
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    curve.getPointAt(t, P); curve.getTangentAt(t, T);
    out(P, O); O.addScaledVector(T, -O.dot(T)).normalize();
    S.crossVectors(T, O).normalize();
    const taper = o.taper ? o.taper(t) : Math.pow(1 - t, 0.7) * 0.85 + 0.15 * (1 - t);
    const w = width * taper, th = thick * Math.max(taper, 0.25);
    for (let j = 0; j <= M; j++) {
      const a = j / M * Math.PI * 2;
      const cx = Math.cos(a), cy = Math.sin(a);
      pos.push(P.x + S.x * cx * w + O.x * cy * th, P.y + S.y * cx * w + O.y * cy * th, P.z + S.z * cx * w + O.z * cy * th);
      uv.push(j / M * (o.uScale || 0.25) + (o.uOff || 0), t * (o.vScale || 1));
    }
  }
  const W = M + 1;
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
    const a = i * W + j, b = a + 1, c = a + W, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// flat ribbon following points, oriented by out(), width w
export function ribbonGeo(points, w, out, o = {}) {
  const curve = new THREE.CatmullRomCurve3(points);
  const N = o.segs || 30;
  const pos = [], uv = [], idx = [];
  const P = new THREE.Vector3(), T = new THREE.Vector3(), O = new THREE.Vector3(), S = new THREE.Vector3();
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    curve.getPointAt(t, P); curve.getTangentAt(t, T);
    out(P, O, t); O.addScaledVector(T, -O.dot(T)).normalize();
    S.crossVectors(T, O).normalize();
    const ww = typeof w === 'function' ? w(t) : w;
    const off = o.offset || 0;
    for (let s = -1; s <= 1; s += 2) {
      pos.push(P.x + S.x * ww * s * 0.5 + O.x * off, P.y + S.y * ww * s * 0.5 + O.y * off, P.z + S.z * ww * s * 0.5 + O.z * off);
      uv.push((s + 1) / 2, t * (o.vScale || 1));
    }
  }
  for (let i = 0; i < N; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function mergeGeos(list) {
  // list of geometries (indexed, position/normal/uv, optional color)
  let nv = 0, ni = 0; const hasColor = list.some(g => g.attributes.color);
  for (const g of list) { nv += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; }
  const P = new Float32Array(nv * 3), N = new Float32Array(nv * 3), U = new Float32Array(nv * 2);
  const C = hasColor ? new Float32Array(nv * 3) : null;
  const I = new Uint32Array(ni);
  let ov = 0, oi = 0;
  for (const g of list) {
    const c = g.attributes.position.count;
    P.set(g.attributes.position.array, ov * 3);
    if (!g.attributes.normal) g.computeVertexNormals();
    N.set(g.attributes.normal.array, ov * 3);
    if (g.attributes.uv) U.set(g.attributes.uv.array, ov * 2);
    if (C) { if (g.attributes.color) C.set(g.attributes.color.array, ov * 3); else C.fill(1, ov * 3, (ov + c) * 3); }
    if (g.index) { const ia = g.index.array; for (let k = 0; k < ia.length; k++) I[oi + k] = ia[k] + ov; oi += ia.length; }
    else { for (let k = 0; k < c; k++) I[oi + k] = ov + k; oi += c; }
    ov += c;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(P, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(N, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(U, 2));
  if (C) g.setAttribute('color', new THREE.BufferAttribute(C, 3));
  g.setIndex(new THREE.BufferAttribute(I, 1));
  return g;
}

export function xform(g, m) { g.applyMatrix4(m); return g; }
export const M4 = (p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1]) => new THREE.Matrix4().compose(
  new THREE.Vector3(...p), new THREE.Quaternion().setFromEuler(new THREE.Euler(...r)), new THREE.Vector3(...(Array.isArray(s) ? s : [s, s, s])));

// lathe helper with uv
export function latheGeo(pts, seg = 48, phiStart = 0, phiLen = Math.PI * 2) {
  const g = new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), seg, phiStart, phiLen);
  return g;
}

export function rand(seed) { // deterministic PRNG
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
}
