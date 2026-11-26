// field.js — CPU paint grids uploaded as DataTextures (snow depth, ice, wetness...)
// grid row 0 = v 0, so uv maps directly: x = u*w, y = v*h
import * as THREE from 'three';

export class Field {
  constructor(w, h, channels = 1, { wrapU = false, wrapV = false } = {}) {
    this.w = w; this.h = h; this.n = channels;
    this.c = [];
    for (let i = 0; i < channels; i++) this.c.push(new Float32Array(w * h));
    this.data = new Uint8Array(w * h * 4);
    this.tex = new THREE.DataTexture(this.data, w, h, THREE.RGBAFormat, THREE.UnsignedByteType);
    this.tex.magFilter = THREE.LinearFilter; this.tex.minFilter = THREE.LinearFilter;
    this.tex.wrapS = wrapU ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
    this.tex.wrapT = wrapV ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
    this.wrapU = wrapU; this.wrapV = wrapV;
    this.dirty = true;
  }
  fill(ch, fn) {
    const a = this.c[ch], w = this.w, h = this.h;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) a[y * w + x] = fn((x + 0.5) / w, (y + 0.5) / h, x, y);
    this.dirty = true;
  }
  get(ch, u, v) {
    const w = this.w, h = this.h;
    let x = u * w - 0.5, y = v * h - 0.5;
    const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
    const a = this.c[ch];
    const s = (xx, yy) => {
      if (this.wrapU) xx = ((xx % w) + w) % w; else xx = Math.min(w - 1, Math.max(0, xx));
      if (this.wrapV) yy = ((yy % h) + h) % h; else yy = Math.min(h - 1, Math.max(0, yy));
      return a[yy * w + xx];
    };
    return (s(x0, y0) * (1 - fx) + s(x0 + 1, y0) * fx) * (1 - fy) + (s(x0, y0 + 1) * (1 - fx) + s(x0 + 1, y0 + 1) * fx) * fy;
  }
  /** visit texels inside an ellipse (radii in uv units) with falloff weight 0..1 */
  brush(u, v, ru, rv, fn) {
    const w = this.w, h = this.h;
    const cx = u * w - 0.5, cy = v * h - 0.5, rx = Math.max(0.75, ru * w), ry = Math.max(0.75, rv * h);
    const x0 = Math.floor(cx - rx), x1 = Math.ceil(cx + rx), y0 = Math.floor(cy - ry), y1 = Math.ceil(cy + ry);
    for (let y = y0; y <= y1; y++) {
      let yy = y;
      if (this.wrapV) yy = ((y % h) + h) % h; else if (y < 0 || y >= h) continue;
      const dy = (y - cy) / ry;
      for (let x = x0; x <= x1; x++) {
        let xx = x;
        if (this.wrapU) xx = ((x % w) + w) % w; else if (x < 0 || x >= w) continue;
        const dx = (x - cx) / rx;
        const d2 = dx * dx + dy * dy;
        if (d2 >= 1) continue;
        const k = 1 - d2; // soft
        fn(yy * w + xx, k * k, xx, yy);
      }
    }
    this.dirty = true;
  }
  upload() {
    if (!this.dirty) return;
    const d = this.data, n = this.n, N = this.w * this.h;
    for (let ch = 0; ch < 4; ch++) {
      const a = ch < n ? this.c[ch] : null;
      if (!a) { if (ch === 3) for (let i = 0; i < N; i++) d[i * 4 + 3] = 255; continue; }
      for (let i = 0; i < N; i++) { const v = a[i]; d[i * 4 + ch] = v <= 0 ? 0 : v >= 1 ? 255 : (v * 255 + 0.5) | 0; }
    }
    this.tex.needsUpdate = true;
    this.dirty = false;
  }
  /** mean of channel over uv rect, optional predicate weight */
  stat(ch, u0, u1, v0, v1, fn) {
    const a = this.c[ch], w = this.w, h = this.h;
    let s = 0, n = 0;
    const x0 = Math.max(0, Math.floor(u0 * w)), x1 = Math.min(w - 1, Math.floor(u1 * w));
    const y0 = Math.max(0, Math.floor(v0 * h)), y1 = Math.min(h - 1, Math.floor(v1 * h));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { s += fn ? fn(a[y * w + x], x, y) : a[y * w + x]; n++; }
    return n ? s / n : 0;
  }
}

// small deterministic value noise for initial fields
function h21(x, y, s) { const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); }
export function vnoise(x, y, seed = 0) {
  const xi = Math.floor(x), yi = Math.floor(y); let fx = x - xi, fy = y - yi;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  const a = h21(xi, yi, seed), b = h21(xi + 1, yi, seed), c = h21(xi, yi + 1, seed), d = h21(xi + 1, yi + 1, seed);
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
}
export function fbm(x, y, seed = 0, oct = 4) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, y * f, seed + i * 13); f *= 2.03; a *= 0.5; }
  return s / (1 - Math.pow(0.5, oct));
}
