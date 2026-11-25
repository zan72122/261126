// Flat paths (in the xz plane) as polylines with arc length. Cars follow them like rails:
// both axles sit on the path, so the body turns smoothly even where the polyline bends.
export class Path {
  constructor(cap = 320) { this.x = new Float32Array(cap); this.z = new Float32Array(cap); this.s = new Float32Array(cap); this.n = 0; this.len = 0; this.cap = cap; }
  reset(x, z) { this.n = 0; this.len = 0; this._push(x, z); return this; }
  _push(x, z) {
    if (!Number.isFinite(x) || !Number.isFinite(z)) return;
    if (this.n > 0) {
      const d = Math.hypot(x - this.x[this.n - 1], z - this.z[this.n - 1]);
      if (d < 1e-4) return;
      if (this.n >= this.cap) { this.x[this.n - 1] = x; this.z[this.n - 1] = z; this.len = this.s[this.n - 2] + Math.hypot(x - this.x[this.n - 2], z - this.z[this.n - 2]); this.s[this.n - 1] = this.len; return; }
      this.len += d;
    }
    this.x[this.n] = x; this.z[this.n] = z; this.s[this.n] = this.len; this.n++;
  }
  get endX() { return this.x[this.n - 1]; }
  get endZ() { return this.z[this.n - 1]; }
  /** straight line from the current end */
  lineTo(x, z, step = 0.5) {
    const x0 = this.endX, z0 = this.endZ; const d = Math.hypot(x - x0, z - z0); const n = Math.max(1, Math.ceil(d / step));
    for (let i = 1; i <= n; i++) this._push(x0 + ((x - x0) * i) / n, z0 + ((z - z0) * i) / n);
    return this;
  }
  /** cubic Bézier from the current end; clampFn(x, z, out) may push a point back into the allowed area */
  curveTo(c1x, c1z, c2x, c2z, x, z, step = 0.22, clampFn = null) {
    const x0 = this.endX, z0 = this.endZ;
    const rough = Math.hypot(c1x - x0, c1z - z0) + Math.hypot(c2x - c1x, c2z - c1z) + Math.hypot(x - c2x, z - c2z);
    const n = Math.max(4, Math.min(120, Math.ceil(rough / step)));
    for (let i = 1; i <= n; i++) {
      const t = i / n, u = 1 - t;
      let px = u * u * u * x0 + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x;
      let pz = u * u * u * z0 + 3 * u * u * t * c1z + 3 * u * t * t * c2z + t * t * t * z;
      if (clampFn) { clampFn(px, pz, _o); px = _o[0]; pz = _o[1]; }
      this._push(px, pz);
    }
    return this;
  }
  /** point at arc length s → out[0], out[1]; beyond the ends the path continues straight */
  at(s, out) {
    const n = this.n;
    if (n === 0) { out[0] = 0; out[1] = 0; return out; }
    if (n === 1) { out[0] = this.x[0]; out[1] = this.z[0]; return out; }
    let i;
    if (s <= 0) i = 0; else if (s >= this.len) i = n - 2;
    else { let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (this.s[m] <= s) lo = m; else hi = m; } i = lo; }
    const d = this.s[i + 1] - this.s[i]; const t = d > 1e-6 ? (s - this.s[i]) / d : 0;
    out[0] = this.x[i] + (this.x[i + 1] - this.x[i]) * t; out[1] = this.z[i] + (this.z[i + 1] - this.z[i]) * t;
    return out;
  }
}
const _o = [0, 0];
