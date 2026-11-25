// Small geometry kit: build many parts into ONE BufferGeometry (position, normal, color, uv) so a whole
// assembly is a single draw call. No three import: THREE is passed in.

export function makeGeoKit(THREE) {
  const _c = new THREE.Color();
  const _v = new THREE.Vector3();
  const _n = new THREE.Vector3();
  const _nm = new THREE.Matrix3();
  const _m = new THREE.Matrix4();
  const _q = new THREE.Quaternion();
  const _e = new THREE.Euler();
  const _s = new THREE.Vector3();
  const _p = new THREE.Vector3();

  /** matrix from position / euler / scale */
  function mat(px = 0, py = 0, pz = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
    _q.setFromEuler(_e.set(rx, ry, rz));
    return new THREE.Matrix4().compose(_p.set(px, py, pz), _q, _s.set(sx, sy, sz));
  }

  class Builder {
    constructor() { this.pos = []; this.nor = []; this.col = []; this.uv = []; this.idx = []; this.tag = []; this.hasUv = true; }
    get count() { return this.pos.length / 3; }
    get tris() { return this.idx.length / 3; }

    _push(x, y, z, nx, ny, nz, r, g, b, u, v, tag) {
      this.pos.push(x, y, z); this.nor.push(nx, ny, nz); this.col.push(r, g, b); this.uv.push(u, v); this.tag.push(tag);
      return this.pos.length / 3 - 1;
    }

    /** append a THREE geometry (disposed afterwards). color: hex. uv: box-projected later unless the part keeps its own. */
    add(geo, color = 0xffffff, matrix = null, tag = 0) {
      const P = geo.attributes.position, N = geo.attributes.normal;
      const base = this.count; _c.set(color);
      if (matrix) _nm.getNormalMatrix(matrix);
      for (let i = 0; i < P.count; i++) {
        _v.fromBufferAttribute(P, i); if (matrix) _v.applyMatrix4(matrix);
        if (N) { _n.fromBufferAttribute(N, i); if (matrix) _n.applyMatrix3(_nm); if (_n.lengthSq() < 1e-12) _n.set(0, 1, 0); _n.normalize(); } else _n.set(0, 1, 0);
        this._push(_v.x, _v.y, _v.z, _n.x, _n.y, _n.z, _c.r, _c.g, _c.b, NaN, NaN, tag);
      }
      if (geo.index) { const I = geo.index; for (let i = 0; i < I.count; i++) this.idx.push(base + I.getX(i)); }
      else for (let i = 0; i < P.count; i++) this.idx.push(base + i);
      // a mirrored matrix flips the winding
      if (matrix && matrix.determinant() < 0) { for (let i = this.idx.length - (geo.index ? geo.index.count : P.count); i < this.idx.length; i += 3) { const t = this.idx[i + 1]; this.idx[i + 1] = this.idx[i + 2]; this.idx[i + 2] = t; } }
      geo.dispose();
      return this;
    }

    box(w, h, d, color, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, tag = 0) {
      return this.add(new THREE.BoxGeometry(w, h, d), color, mat(x, y, z, rx, ry, rz), tag);
    }
    /** cylinder between two points */
    rod(ax, ay, az, bx, by, bz, r, color, seg = 6, tag = 0, r2 = r) {
      const dx = bx - ax, dy = by - ay, dz = bz - az; const len = Math.hypot(dx, dy, dz) || 1e-6;
      _q.setFromUnitVectors(_v.set(0, 1, 0), _n.set(dx / len, dy / len, dz / len));
      const m = new THREE.Matrix4().compose(_p.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2), _q, _s.set(1, 1, 1));
      return this.add(new THREE.CylinderGeometry(r2, r, len, seg, 1, false), color, m, tag);
    }
    /** flat quad a,b,c,d (counter-clockwise seen from the front). p = [x,y,z] */
    quad(a, b, c, d, color, tag = 0) {
      _c.set(color);
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
      const i0 = this.count;
      for (const p of [a, b, c, d]) this._push(p[0], p[1], p[2], nx, ny, nz, _c.r, _c.g, _c.b, NaN, NaN, tag);
      this.idx.push(i0, i0 + 1, i0 + 2, i0, i0 + 2, i0 + 3);
      return this;
    }
    tri(a, b, c, color, tag = 0) {
      _c.set(color);
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
      const i0 = this.count;
      for (const p of [a, b, c]) this._push(p[0], p[1], p[2], nx, ny, nz, _c.r, _c.g, _c.b, NaN, NaN, tag);
      this.idx.push(i0, i0 + 1, i0 + 2);
      return this;
    }

    /**
     * Lofted grid with smooth normals. fn(i, j, o) fills o = {x, y, z, color, u, v, tag} for i in 0..nu-1, j in 0..nv-1.
     * Rows/columns may repeat a position (color seams, collapsed points): normals of coincident points are welded.
     * flip: reverse the winding. Default winding: (i,j) (i+1,j) (i+1,j+1) (i,j+1) is counter-clockwise from outside.
     */
    grid(nu, nv, fn, { flip = false, closeU = false } = {}) {
      const base = this.count; const o = { x: 0, y: 0, z: 0, color: 0xffffff, u: NaN, v: NaN, tag: 0 };
      for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
        o.color = 0xffffff; o.u = NaN; o.v = NaN; o.tag = 0;
        fn(i, j, o); _c.set(o.color);
        this._push(o.x, o.y, o.z, 0, 0, 0, _c.r, _c.g, _c.b, o.u, o.v, o.tag);
      }
      const P = this.pos, N = this.nor; const iu = closeU ? nu : nu - 1;
      const first = this.idx.length;
      for (let i = 0; i < iu; i++) for (let j = 0; j < nv - 1; j++) {
        const a = base + i * nv + j, b = base + ((i + 1) % nu) * nv + j, c = b + 1, d = a + 1;
        if (flip) this.idx.push(a, c, b, a, d, c); else this.idx.push(a, b, c, a, c, d);
      }
      // area-weighted normals
      for (let k = first; k < this.idx.length; k += 3) {
        const a = this.idx[k] * 3, b = this.idx[k + 1] * 3, c = this.idx[k + 2] * 3;
        const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2], vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        for (const q of [a, b, c]) { N[q] += nx; N[q + 1] += ny; N[q + 2] += nz; }
      }
      // weld normals of coincident points, then normalize
      const map = new Map();
      for (let q = base; q < this.count; q++) {
        const key = Math.round(P[q * 3] * 2000) + ',' + Math.round(P[q * 3 + 1] * 2000) + ',' + Math.round(P[q * 3 + 2] * 2000);
        let e = map.get(key); if (!e) { e = [0, 0, 0, []]; map.set(key, e); }
        e[0] += N[q * 3]; e[1] += N[q * 3 + 1]; e[2] += N[q * 3 + 2]; e[3].push(q);
      }
      for (const e of map.values()) {
        const l = Math.hypot(e[0], e[1], e[2]);
        const nx = l > 1e-9 ? e[0] / l : 0, ny = l > 1e-9 ? e[1] / l : 1, nz = l > 1e-9 ? e[2] / l : 0;
        for (const q of e[3]) { N[q * 3] = nx; N[q * 3 + 1] = ny; N[q * 3 + 2] = nz; }
      }
      return this;
    }

    /** remember the current end; pass the mark to mirrorX / transform */
    mark() { return { v: this.count, i: this.idx.length }; }

    /** mirror everything added since the mark across x=0 (appends a flipped copy) */
    mirrorX(m = { v: 0, i: 0 }) {
      const n = this.count, end = this.idx.length, off = n - m.v;
      for (let q = m.v; q < n; q++) {
        this._push(-this.pos[q * 3], this.pos[q * 3 + 1], this.pos[q * 3 + 2], -this.nor[q * 3], this.nor[q * 3 + 1], this.nor[q * 3 + 2],
          this.col[q * 3], this.col[q * 3 + 1], this.col[q * 3 + 2], this.uv[q * 2], this.uv[q * 2 + 1], this.tag[q]);
      }
      for (let k = m.i; k < end; k += 3) this.idx.push(this.idx[k] + off, this.idx[k + 2] + off, this.idx[k + 1] + off);
      return this;
    }

    /** transform all vertices added since the mark */
    transform(matrix, m = { v: 0, i: 0 }) {
      _nm.getNormalMatrix(matrix);
      for (let q = m.v; q < this.count; q++) {
        _v.set(this.pos[q * 3], this.pos[q * 3 + 1], this.pos[q * 3 + 2]).applyMatrix4(matrix);
        this.pos[q * 3] = _v.x; this.pos[q * 3 + 1] = _v.y; this.pos[q * 3 + 2] = _v.z;
        _n.set(this.nor[q * 3], this.nor[q * 3 + 1], this.nor[q * 3 + 2]).applyMatrix3(_nm).normalize();
        this.nor[q * 3] = _n.x; this.nor[q * 3 + 1] = _n.y; this.nor[q * 3 + 2] = _n.z;
      }
      return this;
    }

    /**
     * → BufferGeometry. uvScale: metres per texture repeat for the box projection of parts without own uv
     * (0 = no uv attribute). keepTag: also returns the per-vertex tags (geometry.userData.tag).
     */
    build({ uvScale = 0, keepTag = false } = {}) {
      const n = this.count;
      const g = new THREE.BufferGeometry();
      // sanitize: never hand NaN to the GPU
      const pos = new Float32Array(this.pos), nor = new Float32Array(this.nor), col = new Float32Array(this.col);
      for (let i = 0; i < pos.length; i++) if (!Number.isFinite(pos[i])) pos[i] = 0;
      for (let q = 0; q < n; q++) {
        const l = Math.hypot(nor[q * 3], nor[q * 3 + 1], nor[q * 3 + 2]);
        if (!(l > 1e-6)) { nor[q * 3] = 0; nor[q * 3 + 1] = 1; nor[q * 3 + 2] = 0; }
      }
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      if (uvScale > 0) {
        const uv = new Float32Array(n * 2); const k = 1 / uvScale;
        for (let q = 0; q < n; q++) {
          let u = this.uv[q * 2], v = this.uv[q * 2 + 1];
          if (!Number.isFinite(u) || !Number.isFinite(v)) {
            const ax = Math.abs(nor[q * 3]), ay = Math.abs(nor[q * 3 + 1]), az = Math.abs(nor[q * 3 + 2]);
            if (ay >= ax && ay >= az) { u = pos[q * 3] * k; v = pos[q * 3 + 2] * k; }
            else if (ax >= az) { u = pos[q * 3 + 2] * k; v = pos[q * 3 + 1] * k; }
            else { u = pos[q * 3] * k; v = pos[q * 3 + 1] * k; }
          }
          uv[q * 2] = u; uv[q * 2 + 1] = v;
        }
        g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      }
      g.setIndex(new THREE.BufferAttribute(n > 65535 ? new Uint32Array(this.idx) : new Uint16Array(this.idx), 1));
      if (keepTag) g.userData.tag = new Uint8Array(this.tag);
      g.computeBoundingBox(); g.computeBoundingSphere();
      return g;
    }
  }

  // ---------- outlines (closed loops in the xz plane, counter-clockwise seen from above = outward normals) ----------
  /** rounded rectangle outline → [[x, z], ...] going counter-clockwise seen from +y (x right, z up on paper → clockwise in three's xz; see extrude) */
  function roundRect(x0, x1, z0, z1, r, seg = 5) {
    const pts = [];
    const corner = (cx, cz, a0) => { for (let k = 0; k <= seg; k++) { const a = a0 + (k / seg) * Math.PI / 2; pts.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]); } };
    corner(x1 - r, z1 - r, 0); corner(x0 + r, z1 - r, Math.PI / 2); corner(x0 + r, z0 + r, Math.PI); corner(x1 - r, z0 + r, Math.PI * 1.5);
    return pts;
  }
  /** signed area > 0 for the orientation produced by roundRect */
  function outlineInfo(pts) {
    const n = pts.length; const seg = []; let total = 0;
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[(i + 1) % n]; const dx = b[0] - a[0], dz = b[1] - a[1]; const len = Math.hypot(dx, dz) || 1e-9;
      // outward normal for the roundRect orientation (x→z turning): (dz, -dx)
      seg.push({ a, b, len, nx: dz / len, nz: -dx / len, s0: total }); total += len;
    }
    return { seg, total };
  }
  /** offset an outline outward by d (simple per-vertex normal offset; fine for convex rounded shapes) */
  function offsetOutline(pts, d) {
    const { seg } = outlineInfo(pts); const n = pts.length; const out = [];
    for (let i = 0; i < n; i++) {
      const s0 = seg[(i - 1 + n) % n], s1 = seg[i];
      let nx = s0.nx + s1.nx, nz = s0.nz + s1.nz; const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
      const cos = Math.max(0.5, nx * s1.nx + nz * s1.nz);
      out.push([pts[i][0] + nx * d / cos, pts[i][1] + nz * d / cos]);
    }
    return out;
  }
  /** walls of an extruded outline between y0 and y1; smooth where the outline bends gently. color: hex or (segIndex, s) => hex */
  function walls(B, pts, y0, y1, color, { smoothCos = 0.8, tag = 0 } = {}) {
    const { seg } = outlineInfo(pts); const n = seg.length; const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const s = seg[i], sp = seg[(i - 1 + n) % n], sn = seg[(i + 1) % n];
      let ax = s.nx, az = s.nz, bx = s.nx, bz = s.nz;
      if (s.nx * sp.nx + s.nz * sp.nz > smoothCos) { ax += sp.nx; az += sp.nz; const l = Math.hypot(ax, az); ax /= l; az /= l; }
      if (s.nx * sn.nx + s.nz * sn.nz > smoothCos) { bx += sn.nx; bz += sn.nz; const l = Math.hypot(bx, bz); bx /= l; bz /= l; }
      c.set(typeof color === 'function' ? color(i, s) : color);
      const i0 = B.count;
      B._push(s.a[0], y0, s.a[1], ax, 0, az, c.r, c.g, c.b, NaN, NaN, tag);
      B._push(s.b[0], y0, s.b[1], bx, 0, bz, c.r, c.g, c.b, NaN, NaN, tag);
      B._push(s.b[0], y1, s.b[1], bx, 0, bz, c.r, c.g, c.b, NaN, NaN, tag);
      B._push(s.a[0], y1, s.a[1], ax, 0, az, c.r, c.g, c.b, NaN, NaN, tag);
      B.idx.push(i0, i0 + 2, i0 + 1, i0, i0 + 3, i0 + 2);
    }
  }
  /** flat cap of an outline at height y (fan from the centroid). up: +1 top, -1 bottom */
  function cap(B, pts, y, color, up = 1, tag = 0) {
    const c = new THREE.Color(color); let cx = 0, cz = 0; for (const p of pts) { cx += p[0]; cz += p[1]; } cx /= pts.length; cz /= pts.length;
    const i0 = B.count; B._push(cx, y, cz, 0, up, 0, c.r, c.g, c.b, NaN, NaN, tag);
    for (const p of pts) B._push(p[0], y, p[1], 0, up, 0, c.r, c.g, c.b, NaN, NaN, tag);
    const n = pts.length;
    for (let i = 0; i < n; i++) { const a = i0 + 1 + i, b = i0 + 1 + ((i + 1) % n); if (up > 0) B.idx.push(i0, b, a); else B.idx.push(i0, a, b); }
  }
  /** a slab: walls + top + bottom */
  function slab(B, pts, y0, y1, color, topColor = color) { walls(B, pts, y0, y1, color); cap(B, pts, y1, topColor, 1); cap(B, pts, y0, color, -1); }

  /**
   * Panes (windows) laid along an outline: quads pushed `off` outward, between heights y0..y1, each `pane` long
   * with `gap` between them, on the stretch s0..s1 of the perimeter (metres).
   */
  function panes(B, pts, y0, y1, color, { off = 0.03, pane = 0.8, gap = 0.14, s0 = 0, s1 = Infinity, tag = 0 } = {}) {
    const { seg, total } = outlineInfo(pts); const end = Math.min(s1, total);
    const span = end - s0; if (span <= pane * 0.5) return;
    const count = Math.max(1, Math.floor((span + gap) / (pane + gap)));
    const w = (span - gap * (count - 1)) / count;
    const pointAt = (s, out) => {
      s = ((s % total) + total) % total;
      for (const g of seg) if (s <= g.s0 + g.len + 1e-6) { const t = (s - g.s0) / g.len; out[0] = g.a[0] + (g.b[0] - g.a[0]) * t + g.nx * off; out[1] = g.a[1] + (g.b[1] - g.a[1]) * t + g.nz * off; return g; }
      const g = seg[seg.length - 1]; out[0] = g.b[0] + g.nx * off; out[1] = g.b[1] + g.nz * off; return g;
    };
    const a = [0, 0], b = [0, 0];
    for (let k = 0; k < count; k++) {
      const p0 = s0 + k * (w + gap), p1 = p0 + w;
      // split the pane at outline vertices so it follows curved walls
      const cuts = [p0];
      for (const g of seg) { const sv = g.s0; if (sv > p0 + 1e-4 && sv < p1 - 1e-4) cuts.push(sv); const sv2 = g.s0 + total; if (sv2 > p0 + 1e-4 && sv2 < p1 - 1e-4) cuts.push(sv2); }
      cuts.push(p1); cuts.sort((x, y) => x - y);
      for (let q = 0; q < cuts.length - 1; q++) {
        pointAt(cuts[q] + 1e-5, a); pointAt(cuts[q + 1] - 1e-5, b);
        B.quad([a[0], y0, a[1]], [a[0], y1, a[1]], [b[0], y1, b[1]], [b[0], y0, b[1]], color, tag);
      }
    }
  }

  /** posts and rails along an outline (closed or a stretch s0..s1) */
  function railing(B, pts, y, { h = 0.85, post = 0.95, r = 0.03, color = 0xffffff, s0 = 0, s1 = Infinity, rails = 2 } = {}) {
    const { seg, total } = outlineInfo(pts); const end = Math.min(s1, total); const span = end - s0;
    const count = Math.max(1, Math.round(span / post)); const step = span / count;
    const at = (s) => { s = ((s % total) + total) % total; for (const g of seg) if (s <= g.s0 + g.len + 1e-6) { const t = (s - g.s0) / g.len; return [g.a[0] + (g.b[0] - g.a[0]) * t, g.a[1] + (g.b[1] - g.a[1]) * t]; } return seg[0].a; };
    let prev = null;
    const closed = span >= total - 1e-3;
    for (let k = 0; k <= count; k++) {
      if (closed && k === count) { const p = at(s0); for (let q = 1; q <= rails; q++) B.rod(prev[0], y + h * q / rails, prev[1], p[0], y + h * q / rails, p[1], r * 0.8, color, 4); break; }
      const p = at(s0 + k * step);
      B.rod(p[0], y, p[1], p[0], y + h, p[1], r, color, 4);
      if (prev) for (let q = 1; q <= rails; q++) B.rod(prev[0], y + h * q / rails, prev[1], p[0], y + h * q / rails, p[1], r * 0.8, color, 4);
      prev = p;
    }
  }

  return { Builder, mat, roundRect, outlineInfo, offsetOutline, walls, cap, slab, panes, railing };
}

// ---------- scalar helpers shared by the hero modules ----------
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export const easeInOut = (t) => { t = clamp(t, 0, 1); return t < 0.5 ? 2 * t * t : 1 - (2 - 2 * t) * (2 - 2 * t) / 2; };
export const easeOut = (t) => { t = clamp(t, 0, 1); return 1 - (1 - t) * (1 - t); };
export const wrapAngle = (a) => { a = (a + Math.PI) % (Math.PI * 2); if (a < 0) a += Math.PI * 2; return a - Math.PI; };
export const softClamp = (v, lim) => lim * Math.tanh(v / lim);
export const finite = (v, fallback = 0) => (Number.isFinite(v) ? v : fallback);
