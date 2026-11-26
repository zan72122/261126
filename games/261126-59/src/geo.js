// Geometry helpers: evenly subdivided rounded boxes, lathe shells, live tubes.
import * as THREE from 'three';

// Rounded box with *uniform* subdivision (so per-vertex painting has even density).
export function roundBox(w, h, d, r, density = 90) {
  const nx = Math.max(4, Math.round(w * density)), ny = Math.max(4, Math.round(h * density)), nz = Math.max(4, Math.round(d * density));
  const g = new THREE.BoxGeometry(w, h, d, nx, ny, nz);
  const p = g.attributes.position, n = g.attributes.normal;
  const ix = w / 2 - r, iy = h / 2 - r, iz = d / 2 - r;
  const v = new THREE.Vector3(), c = new THREE.Vector3(), nn = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    // push vertices toward a superellipse distribution so corners don't pinch
    c.set(THREE.MathUtils.clamp(v.x, -ix, ix), THREE.MathUtils.clamp(v.y, -iy, iy), THREE.MathUtils.clamp(v.z, -iz, iz));
    nn.subVectors(v, c);
    if (nn.lengthSq() < 1e-12) nn.fromBufferAttribute(n, i); else nn.normalize();
    v.copy(c).addScaledVector(nn, r);
    p.setXYZ(i, v.x, v.y, v.z); n.setXYZ(i, nn.x, nn.y, nn.z);
  }
  g.computeVertexNormals();
  return mergeSeams(g);
}

// Merge duplicate vertices of box faces so normals are smooth across edges
function mergeSeams(g) {
  const p = g.attributes.position, idx = g.index.array;
  const map = new Map(), remap = new Int32Array(p.count);
  const pos = [], uv = [];
  for (let i = 0; i < p.count; i++) {
    const k = Math.round(p.getX(i) * 1e5) + ',' + Math.round(p.getY(i) * 1e5) + ',' + Math.round(p.getZ(i) * 1e5);
    let j = map.get(k);
    if (j === undefined) { j = pos.length / 3; map.set(k, j); pos.push(p.getX(i), p.getY(i), p.getZ(i)); uv.push(g.attributes.uv.getX(i), g.attributes.uv.getY(i)); }
    remap[i] = j;
  }
  const ni = [];
  for (let i = 0; i < idx.length; i += 3) {
    const a = remap[idx[i]], b = remap[idx[i + 1]], c = remap[idx[i + 2]];
    if (a !== b && b !== c && a !== c) ni.push(a, b, c);
  }
  const o = new THREE.BufferGeometry();
  o.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  o.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  o.setIndex(ni);
  o.computeVertexNormals();
  return o;
}

// Lathe from a radius(t) profile, t in [0,1] along height h. Dense along the profile.
export function latheProfile(h, rfn, rings = 40, seg = 40, closeEnds = true) {
  const pts = [];
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    pts.push(new THREE.Vector2(Math.max(closeEnds && (i === 0 || i === rings) ? 0.0001 : 0.0001, rfn(t)), t * h));
  }
  const g = new THREE.LatheGeometry(pts, seg);
  g.computeVertexNormals();
  return g;
}

// capsule-ish rounded cylinder from y=0 to y=h with end rounding
export function pill(h, r0, r1 = r0, rings = 36, seg = 36) {
  return latheProfile(h, (t) => {
    const y = t * h; const r = r0 + (r1 - r0) * t;
    const e0 = Math.min(1, y / Math.max(1e-4, r0)), e1 = Math.min(1, (h - y) / Math.max(1e-4, r1));
    return r * Math.sqrt(Math.max(0, 1 - (1 - e0) * (1 - e0))) * Math.sqrt(Math.max(0, 1 - (1 - e1) * (1 - e1)));
  }, rings, seg);
}

// A tube whose spine is updated every frame (limbs, hair strands, oil-can spouts).
// rfn(t) gives radius along the tube; ellip scales the radial cross-section (x,y).
export class LiveTube {
  constructor(rings, seg, rfn, ellip = [1, 1], caps = true) {
    this.rings = rings; this.seg = seg; this.rfn = rfn; this.ellip = ellip;
    const vcount = (rings + 1) * (seg + 1);
    const pos = new Float32Array(vcount * 3), nrm = new Float32Array(vcount * 3), uv = new Float32Array(vcount * 2);
    const idx = [];
    for (let i = 0; i <= rings; i++) for (let j = 0; j <= seg; j++) {
      uv[(i * (seg + 1) + j) * 2] = j / seg; uv[(i * (seg + 1) + j) * 2 + 1] = i / rings;
      if (i < rings && j < seg) {
        const a = i * (seg + 1) + j, b = a + seg + 1;
        idx.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    this.geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    this.geo.setIndex(idx);
    this._p = new THREE.Vector3(); this._t = new THREE.Vector3(); this._n = new THREE.Vector3(); this._b = new THREE.Vector3();
    this.up = new THREE.Vector3(0, 0, 1);
  }
  // pts: array of Vector3 control points (local space of the mesh). twistUp: preferred normal direction
  update(pts, twistUp) {
    if (!this.curve || this.curve.points.length !== pts.length) this.curve = new THREE.CatmullRomCurve3(pts.map((p) => p.clone()), false, 'centripetal');
    const curve = this.curve;
    for (let i = 0; i < pts.length; i++) curve.points[i].copy(pts[i]);
    const { rings, seg, rfn, ellip } = this;
    const pos = this.geo.attributes.position.array, nrm = this.geo.attributes.normal.array;
    const T = this._t, N = this._n, B = this._b, P = this._p;
    const up = twistUp || this.up;
    let prevN = null;
    for (let i = 0; i <= rings; i++) {
      const t = i / rings;
      curve.getPointAt(t, P); curve.getTangentAt(t, T);
      if (!prevN) { N.copy(up).addScaledVector(T, -up.dot(T)); if (N.lengthSq() < 1e-6) N.set(1, 0, 0).addScaledVector(T, -T.x); N.normalize(); }
      else { N.copy(prevN).addScaledVector(T, -prevN.dot(T)).normalize(); }
      prevN = prevN || new THREE.Vector3(); prevN.copy(N);
      B.crossVectors(T, N);
      const r = rfn(t);
      for (let j = 0; j <= seg; j++) {
        const a = (j / seg) * Math.PI * 2, ca = Math.cos(a) * ellip[0], sa = Math.sin(a) * ellip[1];
        const k = (i * (seg + 1) + j) * 3;
        const nx = N.x * ca + B.x * sa, ny = N.y * ca + B.y * sa, nz = N.z * ca + B.z * sa;
        pos[k] = P.x + nx * r; pos[k + 1] = P.y + ny * r; pos[k + 2] = P.z + nz * r;
        const l = Math.hypot(nx / ellip[0] * ellip[1], ny, nz) || 1;
        nrm[k] = N.x * Math.cos(a) * ellip[1] + B.x * Math.sin(a) * ellip[0];
        nrm[k + 1] = N.y * Math.cos(a) * ellip[1] + B.y * Math.sin(a) * ellip[0];
        nrm[k + 2] = N.z * Math.cos(a) * ellip[1] + B.z * Math.sin(a) * ellip[0];
        const ln = Math.hypot(nrm[k], nrm[k + 1], nrm[k + 2]) || 1; nrm[k] /= ln; nrm[k + 1] /= ln; nrm[k + 2] /= ln;
      }
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.normal.needsUpdate = true;
    this.geo.computeBoundingSphere();
  }
}

// Deform a sphere with a function (used for heads, hands, shoes)
export function deformedSphere(r, wSeg, hSeg, fn) {
  const g = new THREE.SphereGeometry(r, wSeg, hSeg);
  const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); fn(v); p.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals();
  return g;
}

export const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const gauss = (x, s) => Math.exp(-(x * x) / (2 * s * s));
