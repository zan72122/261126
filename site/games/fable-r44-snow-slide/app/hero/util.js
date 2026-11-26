// Small math helpers (no three.js needed).

export function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
export function lerp(a, b, t) { return a + (b - a) * t; }
export function smoothstep(a, b, x) { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
export function wrapAngle(a) {
  if (!Number.isFinite(a)) return 0;
  a = (a + Math.PI) % (2 * Math.PI);
  if (a < 0) a += 2 * Math.PI;
  return a - Math.PI;
}
export function turnTo(h, target, maxStep) { return h + clamp(wrapAngle(target - h), -maxStep, maxStep); }
// frame-rate independent approach factor: value += (target - value) * damp(dt, tc)
export function damp(dt, tc) { return 1 - Math.exp(-dt / Math.max(tc, 1e-4)); }
export function finite(v, fallback = 0) { return Number.isFinite(v) ? v : fallback; }

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
