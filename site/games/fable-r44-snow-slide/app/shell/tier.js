// Device tier and performance caps (docs/PLAN.md §3).
// iPad reports a Mac UA, so mobile = maxTouchPoints > 1 (or a phone/tablet UA).

export const TIERS = {
  desktop: { name: 'desktop', dprMax: 2, msaa: true, shadows: true, shadowSize: 512, flakes: 360, renderScale: 1 },
  mobile: { name: 'mobile', dprMax: 1, msaa: false, shadows: true, shadowSize: 512, flakes: 240, renderScale: 1 },
  low: { name: 'low', dprMax: 1, msaa: false, shadows: false, shadowSize: 512, flakes: 100, renderScale: 0.8 },
};

export function detectTier(params) {
  const forced = params.get('tier');
  const isMobile = (navigator.maxTouchPoints || 0) > 1 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const base = TIERS[forced] || (isMobile ? TIERS.mobile : TIERS.desktop);
  return { ...base, isMobile };
}

export function pixelRatioFor(tier) {
  // mobile: fixed 1.0 (PLAN). desktop: up to 2.
  const dpr = tier.isMobile ? 1 : Math.min(window.devicePixelRatio || 1, tier.dprMax);
  return dpr * tier.renderScale;
}

// Watches frame times; drops to 'low' once if the average stays under 40 fps for 4 s (after warm-up).
export class FrameMonitor {
  constructor() {
    this.times = new Float32Array(240); this.n = 0; this.i = 0;
    this.windowT = 0; this.windowFrames = 0; this.warm = 3; this.slowWindows = 0;
  }
  push(dtMs) {
    this.times[this.i] = dtMs; this.i = (this.i + 1) % this.times.length; this.n = Math.min(this.n + 1, this.times.length);
  }
  stats() {
    if (!this.n) return { avg: 0, p95: 0 };
    const a = Array.from(this.times.subarray(0, this.n)).sort((x, y) => x - y);
    const mean = a.reduce((s, v) => s + v, 0) / a.length;
    return { avg: 1000 / mean, p95: 1000 / a[Math.min(a.length - 1, Math.floor(a.length * 0.95))] };
  }
  // returns true when the tier should drop
  shouldDrop(dt) {
    if (this.warm > 0) { this.warm -= dt; return false; }
    this.windowT += dt; this.windowFrames++;
    if (this.windowT >= 4) {
      const fps = this.windowFrames / this.windowT;
      this.windowT = 0; this.windowFrames = 0;
      return fps < 40;
    }
    return false;
  }
}
