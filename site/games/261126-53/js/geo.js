// geometry helpers: swept tubes with elliptical / sculpted cross-sections, merging, displacement
import * as THREE from 'three';

const _v = new THREE.Vector3(), _n = new THREE.Vector3(), _b = new THREE.Vector3();

// pts: array of Vector3 (already dense or will be resampled with Catmull-Rom)
// o.radius(t) -> number | [rx, ry]   (rx along frame normal N, ry along binormal B)
// o.shape(t, a) -> multiplier on radius at angle a (sculpting)
// o.segs, o.radial, o.caps (true|'start'|'end'|false), o.up (initial normal hint)
// o.arc: [a0, a1] open sweep (no caps) e.g. vest; o.vScale/uScale for uvs
export function sweep(pts, o = {}) {
  const segs = o.segs || 24, radial = o.radial || 12;
  const curve = pts.length > 2 ? new THREE.CatmullRomCurve3(pts, false, 'centripetal') : new THREE.LineCurve3(pts[0], pts[1]);
  const P = [], T = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    P.push(curve.getPoint(t)); T.push(curve.getTangent(t).normalize());
  }
  // parallel transport frames
  const N = [], B = [];
  let n0 = (o.up ? o.up.clone() : new THREE.Vector3(0, 0, 1));
  if (Math.abs(n0.dot(T[0])) > 0.95) n0 = new THREE.Vector3(1, 0, 0);
  n0.sub(T[0].clone().multiplyScalar(n0.dot(T[0]))).normalize();
  N.push(n0); B.push(new THREE.Vector3().crossVectors(T[0], n0).normalize());
  for (let i = 1; i <= segs; i++) {
    const n = N[i - 1].clone();
    const axis = new THREE.Vector3().crossVectors(T[i - 1], T[i]);
    const s = axis.length();
    if (s > 1e-6) { axis.normalize(); n.applyAxisAngle(axis, Math.asin(Math.min(1, s)) * (T[i - 1].dot(T[i]) < 0 ? -1 : 1)); }
    n.sub(T[i].clone().multiplyScalar(n.dot(T[i]))).normalize();
    N.push(n); B.push(new THREE.Vector3().crossVectors(T[i], n).normalize());
  }
  if (o.twist) for (let i = 0; i <= segs; i++) { const a = o.twist(i / segs); N[i].applyAxisAngle(T[i], a); B[i].applyAxisAngle(T[i], a); }

  const a0 = o.arc ? o.arc[0] : 0, a1 = o.arc ? o.arc[1] : Math.PI * 2;
  const closed = !o.arc;
  const caps = o.arc ? false : (o.caps === undefined ? true : o.caps);
  const capRings = o.capRings ?? 5;
  const rings = []; // {p, t, n, b, scale, push, tt}
  const rad = t => { const r = o.radius ? o.radius(t) : 0.05; return Array.isArray(r) ? r : [r, r]; };
  const capLen = o.capLen ?? 1;
  if (caps === true || caps === 'start') {
    const r = rad(0);
    for (let k = capRings; k >= 1; k--) {
      const ang = k / capRings * Math.PI / 2;
      rings.push({ i: 0, t: 0, s: Math.cos(ang), push: -Math.sin(ang) * Math.min(r[0], r[1]) * capLen });
    }
  }
  for (let i = 0; i <= segs; i++) rings.push({ i, t: i / segs, s: 1, push: 0 });
  if (caps === true || caps === 'end') {
    const r = rad(1);
    for (let k = 1; k <= capRings; k++) {
      const ang = k / capRings * Math.PI / 2;
      rings.push({ i: segs, t: 1, s: Math.cos(ang), push: Math.sin(ang) * Math.min(r[0], r[1]) * capLen });
    }
  }
  const cols = radial + 1;
  const pos = new Float32Array(rings.length * cols * 3), uv = new Float32Array(rings.length * cols * 2);
  const tArr = new Float32Array(rings.length * cols);
  let len = 0; const cum = [0];
  for (let i = 1; i <= segs; i++) { len += P[i].distanceTo(P[i - 1]); cum.push(len); }
  for (let r = 0; r < rings.length; r++) {
    const R = rings[r], i = R.i; const [rx, ry] = rad(R.t);
    for (let j = 0; j < cols; j++) {
      const a = a0 + (a1 - a0) * j / radial;
      const m = o.shape ? o.shape(R.t, a) : 1;
      const ca = Math.cos(a), sa = Math.sin(a);
      _v.copy(P[i]).addScaledVector(N[i], ca * rx * m * R.s).addScaledVector(B[i], sa * ry * m * R.s).addScaledVector(T[i], R.push);
      const k = (r * cols + j);
      pos[k * 3] = _v.x; pos[k * 3 + 1] = _v.y; pos[k * 3 + 2] = _v.z;
      uv[k * 2] = (j / radial) * (o.uScale || 1);
      uv[k * 2 + 1] = (cum[i] + R.push) * (o.vScale || 1);
      tArr[k] = R.t;
    }
  }
  const idx = [];
  for (let r = 0; r < rings.length - 1; r++) for (let j = 0; j < radial; j++) {
    const a = r * cols + j, b = a + 1, c = a + cols, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('aT', new THREE.BufferAttribute(tArr, 1));
  g.setIndex(idx);
  if (o.flip) g.index.array.reverse();
  g.computeVertexNormals();
  if (closed) fixSeam(g, rings.length, cols);
  return g;
}
function fixSeam(g, nr, cols) {
  const n = g.attributes.normal;
  for (let r = 0; r < nr; r++) {
    const a = r * cols, b = r * cols + cols - 1;
    _n.set(n.getX(a) + n.getX(b), n.getY(a) + n.getY(b), n.getZ(a) + n.getZ(b)).normalize();
    n.setXYZ(a, _n.x, _n.y, _n.z); n.setXYZ(b, _n.x, _n.y, _n.z);
  }
}

// merge indexed geometries sharing attribute sets (position, normal, uv [, color])
export function merge(geos, keepT = false) {
  const names = ['position', 'normal', 'uv'];
  if (geos.every(g => g.attributes.color)) names.push('color');
  if (keepT && geos.every(g => g.attributes.aT)) names.push('aT');
  if (geos.every(g => g.attributes.skinIndex)) names.push('skinIndex', 'skinWeight');
  let vcount = 0, icount = 0;
  for (const g of geos) { vcount += g.attributes.position.count; icount += g.index ? g.index.count : g.attributes.position.count; }
  const out = new THREE.BufferGeometry();
  const arrs = {};
  for (const nm of names) { const isz = geos[0].attributes[nm].itemSize; arrs[nm] = nm === 'skinIndex' ? new Uint16Array(vcount * isz) : new Float32Array(vcount * isz); }
  const ind = new (vcount > 65535 ? Uint32Array : Uint16Array)(icount);
  let vo = 0, io = 0;
  for (const g of geos) {
    for (const nm of names) { const a = g.attributes[nm]; arrs[nm].set(a.array, vo * a.itemSize); }
    if (g.index) { const ia = g.index.array; for (let i = 0; i < ia.length; i++) ind[io + i] = ia[i] + vo; io += ia.length; }
    else { const c = g.attributes.position.count; for (let i = 0; i < c; i++) ind[io + i] = vo + i; io += c; }
    vo += g.attributes.position.count;
  }
  for (const nm of names) out.setAttribute(nm, nm === 'skinIndex' ? new THREE.Uint16BufferAttribute(arrs[nm], 4) : new THREE.BufferAttribute(arrs[nm], geos[0].attributes[nm].itemSize));
  out.setIndex(new THREE.BufferAttribute(ind, 1));
  return out;
}

export function xform(g, { p, r, s } = {}) {
  const m = new THREE.Matrix4();
  m.compose(p || new THREE.Vector3(), r instanceof THREE.Quaternion ? r : new THREE.Quaternion().setFromEuler(r || new THREE.Euler()), s instanceof THREE.Vector3 ? s : new THREE.Vector3(s || 1, s || 1, s || 1));
  g.applyMatrix4(m);
  return g;
}

// displace along normal / arbitrary: fn(pos Vector3, normal Vector3, i) -> writes into pos
export function deform(g, fn, recompute = true) {
  const p = g.attributes.position, n = g.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    _v.fromBufferAttribute(p, i);
    if (n) _n.fromBufferAttribute(n, i); else _n.set(0, 1, 0);
    fn(_v, _n, i);
    p.setXYZ(i, _v.x, _v.y, _v.z);
  }
  p.needsUpdate = true;
  if (recompute) g.computeVertexNormals();
  return g;
}

export function setColor(g, fn) {
  const p = g.attributes.position;
  const c = new Float32Array(p.count * 3);
  const col = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    _v.fromBufferAttribute(p, i);
    fn(_v, col, i);
    c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  return g;
}

// cheap 3D value noise for sculpting
function hash3(x, y, z) { let h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); }
export function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  let r = 0;
  for (let dz = 0; dz < 2; dz++) for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
    const k = hash3(xi + dx, yi + dy, zi + dz);
    r += k * (dx ? u : 1 - u) * (dy ? v : 1 - v) * (dz ? w : 1 - w);
  }
  return r * 2 - 1;
}
export function fbm(x, y, z, oct = 4) {
  let a = 0.5, f = 1, s = 0;
  for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, y * f, z * f); a *= 0.5; f *= 2.03; }
  return s;
}

// rock: displaced icosphere
export function rockGeo(size, seed = 1, detail = 4, flat = 0.6) {
  const g = weld(new THREE.IcosahedronGeometry(1, detail));
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    _v.fromBufferAttribute(pos, i);
    const n = _v.clone().normalize();
    let d = 1 + fbm(n.x * 1.6 + seed, n.y * 1.6, n.z * 1.6 + seed * 2, 5) * 0.45;
    d += Math.max(0, fbm(n.x * 4 + seed, n.y * 4, n.z * 4, 3)) * 0.12;
    _v.copy(n).multiplyScalar(d);
    _v.y *= flat;
    if (_v.y < -0.1 * flat) _v.y = -0.1 * flat + (_v.y + 0.1 * flat) * 0.3;
    _v.multiplyScalar(size);
    pos.setXYZ(i, _v.x, _v.y, _v.z);
  }
  // planar-ish uv
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) { uv.setXY(i, pos.getX(i) / size * 0.5 + pos.getZ(i) * 0.2 / size, pos.getY(i) / size * 0.5 + pos.getZ(i) * 0.3 / size); }
  g.computeVertexNormals();
  return g;
}

// weld non-indexed geometry by position (for smooth normals)
export function weld(g, eps = 1e-5) {
  const p = g.attributes.position; const map = new Map(); const verts = []; const idx = [];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const key = Math.round(x / eps) + '_' + Math.round(y / eps) + '_' + Math.round(z / eps);
    let k = map.get(key);
    if (k === undefined) { k = verts.length / 3; verts.push(x, y, z); map.set(key, k); }
    idx.push(k);
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  out.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(verts.length / 3 * 2), 2));
  out.setIndex(idx);
  out.computeVertexNormals();
  return out;
}
