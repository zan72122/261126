import * as THREE from './three.js';

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export const easeInOut = (t) => { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const easeOutBack = (t) => { t = clamp(t, 0, 1); const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
/** frame-rate independent exponential approach; tau in seconds */
export const damp = (cur, target, tau, dt) => (tau <= 0 ? target : target + (cur - target) * Math.exp(-dt / tau));
export const wrapAngle = (a) => { a = (a + Math.PI) % (Math.PI * 2); if (a < 0) a += Math.PI * 2; return a - Math.PI; };
export const dampAngle = (cur, target, tau, dt) => cur + wrapAngle(target - cur) * (1 - Math.exp(-dt / Math.max(tau, 1e-3)));

export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const pick = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _s = new THREE.Vector3();
const _p = new THREE.Vector3();
/** build a matrix from position / euler rotation / scale */
export function mat(px = 0, py = 0, pz = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  _q.setFromEuler(_e.set(rx, ry, rz));
  return new THREE.Matrix4().compose(_p.set(px, py, pz), _q, _s.set(sx, sy, sz));
}

/**
 * Merge parts into one BufferGeometry with position, normal, color (and uv if all parts have it).
 * parts: [{ geo, color (hex|Color|null = keep the geo's own color attribute), matrix? }]. Source geometries are disposed.
 */
export function mergeColored(parts, { keepUv = false } = {}) {
  let vCount = 0, iCount = 0;
  const prepared = parts.map((p) => {
    let g = p.geo;
    if (!g.index) {
      const n = g.attributes.position.count; const idx = new Array(n); for (let i = 0; i < n; i++) idx[i] = i; g.setIndex(idx);
    }
    vCount += g.attributes.position.count; iCount += g.index.count;
    return { g, color: p.color === null && g.attributes.color ? null : new THREE.Color(p.color ?? 0xffffff), matrix: p.matrix || null };
  });
  const pos = new Float32Array(vCount * 3), nor = new Float32Array(vCount * 3), col = new Float32Array(vCount * 3);
  const uv = keepUv ? new Float32Array(vCount * 2) : null;
  const IndexArr = vCount > 65535 ? Uint32Array : Uint16Array;
  const index = new IndexArr(iCount);
  let vo = 0, io = 0;
  const nm = new THREE.Matrix3(); const v = new THREE.Vector3();
  for (const { g, color, matrix } of prepared) {
    const P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv, C = g.attributes.color;
    if (matrix) nm.getNormalMatrix(matrix);
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i); if (matrix) v.applyMatrix4(matrix);
      pos[(vo + i) * 3] = v.x; pos[(vo + i) * 3 + 1] = v.y; pos[(vo + i) * 3 + 2] = v.z;
      if (N) { v.fromBufferAttribute(N, i); if (matrix) v.applyMatrix3(nm).normalize(); } else v.set(0, 1, 0);
      nor[(vo + i) * 3] = v.x; nor[(vo + i) * 3 + 1] = v.y; nor[(vo + i) * 3 + 2] = v.z;
      if (color) { col[(vo + i) * 3] = color.r; col[(vo + i) * 3 + 1] = color.g; col[(vo + i) * 3 + 2] = color.b; } else { col[(vo + i) * 3] = C.getX(i); col[(vo + i) * 3 + 1] = C.getY(i); col[(vo + i) * 3 + 2] = C.getZ(i); }
      if (uv) { uv[(vo + i) * 2] = U ? U.getX(i) : 0; uv[(vo + i) * 2 + 1] = U ? U.getY(i) : 0; }
    }
    const I = g.index;
    for (let i = 0; i < I.count; i++) index[io + i] = I.getX(i) + vo;
    vo += P.count; io += I.count;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  if (uv) out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.setIndex(new THREE.BufferAttribute(index, 1));
  out.computeBoundingSphere(); out.computeBoundingBox();
  return out;
}

/** flat-shade a geometry (low-poly look) */
export function flat(g) { const n = g.index ? g.toNonIndexed() : g; if (n !== g) g.dispose(); n.computeVertexNormals(); return n; }

/** count triangles of everything visible under obj (InstancedMesh counts × instances) */
export function countTriangles(obj) {
  let t = 0;
  obj.traverseVisible((o) => {
    if (!o.isMesh || !o.geometry) return;
    const g = o.geometry; const n = g.index ? g.index.count : g.attributes.position ? g.attributes.position.count : 0;
    let c = n / 3; if (g.drawRange && g.drawRange.count !== Infinity) c = Math.min(c, g.drawRange.count / 3);
    t += c * (o.isInstancedMesh ? o.count : 1);
  });
  return Math.round(t);
}
