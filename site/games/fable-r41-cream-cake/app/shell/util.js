// Small shared helpers: math, easing, tweens, geometry merge.
export const THREE = window.THREE;

export const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export const easeOut = (t) => { t = clamp(t, 0, 1); return 1 - (1 - t) * (1 - t) * (1 - t); };
export const easeInOut = (t) => { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
// overshoot ease for "ぽよん"
export const easeBack = (t) => { t = clamp(t, 0, 1); const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
// damped spring impulse: 0 at t=0, wobbles, settles to 0
export const wobble = (t, freq = 14, decay = 6) => (t < 0 ? 0 : Math.sin(t * freq) * Math.exp(-t * decay));
// k-per-second exponential approach factor
export const follow = (k, dt) => 1 - Math.exp(-k * dt);

// Very small tween runner: tweens.add(duration, fn(t01), done?)
export class Tweens {
  constructor() { this.list = []; }
  add(dur, fn, done, delay = 0) {
    const tw = { t: -delay, dur: Math.max(1e-3, dur), fn, done, dead: false };
    this.list.push(tw);
    return tw;
  }
  wait(delay, done) { return this.add(0.001, () => {}, done, delay); }
  update(dt) {
    const L = this.list;
    for (let i = 0; i < L.length; i++) {
      const tw = L[i];
      if (tw.dead) continue;
      tw.t += dt;
      if (tw.t < 0) continue;
      const k = Math.min(1, tw.t / tw.dur);
      tw.fn(k);
      if (k >= 1) { tw.dead = true; if (tw.done) tw.done(); }
    }
    if (L.length > 32) this.list = L.filter((t) => !t.dead);
  }
  clear() { this.list.length = 0; }
  get busy() { return this.list.some((t) => !t.dead); }
}

// Merge indexed/non-indexed BufferGeometries that share attribute names (position, normal, uv, color optional).
export function mergeGeos(geos) {
  const names = ['position', 'normal', 'uv', 'color'].filter((n) => geos.every((g) => g.getAttribute(n)));
  let vCount = 0, iCount = 0;
  for (const g of geos) { vCount += g.getAttribute('position').count; iCount += g.index ? g.index.count : g.getAttribute('position').count; }
  const out = new THREE.BufferGeometry();
  const arrays = {};
  for (const n of names) arrays[n] = new Float32Array(vCount * geos[0].getAttribute(n).itemSize);
  const index = vCount > 65535 ? new Uint32Array(iCount) : new Uint16Array(iCount);
  let vo = 0, io = 0;
  for (const g of geos) {
    const pc = g.getAttribute('position').count;
    for (const n of names) {
      const a = g.getAttribute(n);
      for (let i = 0; i < a.count; i++) for (let c = 0; c < a.itemSize; c++) arrays[n][(vo + i) * a.itemSize + c] = a.getComponent(i, c);
    }
    if (g.index) { for (let i = 0; i < g.index.count; i++) index[io++] = g.index.getX(i) + vo; }
    else { for (let i = 0; i < pc; i++) index[io++] = i + vo; }
    vo += pc;
  }
  for (const n of names) out.setAttribute(n, new THREE.BufferAttribute(arrays[n], geos[0].getAttribute(n).itemSize));
  out.setIndex(new THREE.BufferAttribute(index, 1));
  out.computeBoundingSphere();
  out.computeBoundingBox();
  for (const g of geos) g.dispose();
  return out;
}

// Geometry transformed copy helper: g.applyMatrix4 returns g; this builds from TRS quickly.
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(), _p = new THREE.Vector3();
export function place(g, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  _q.setFromEuler(_e.set(rx, ry, rz));
  _m.compose(_p.set(x, y, z), _q, _s.set(sx, sy, sz));
  return g.applyMatrix4(_m);
}

// Paint a uniform vertex color into a geometry (for merged multi-color meshes).
export function tint(g, hex) {
  const c = new THREE.Color(hex);
  const n = g.getAttribute('position').count;
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3));
  return g;
}

// Random helpers (seedable so the same round looks stable)
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
}
