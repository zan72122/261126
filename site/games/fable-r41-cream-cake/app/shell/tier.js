// Device tier and performance caps. iPadOS reports a Mac UA, so touch points decide "mobile".
export function detectTier() {
  const params = new URLSearchParams(location.search);
  const forced = params.get('tier');
  const mobile = forced ? forced === 'mobile' : (navigator.maxTouchPoints || 0) > 1;
  const base = {
    heroTriangles: 50000,      // hero (cream) budget
    shellTriangles: 50000,     // everything else
    maxTextureSize: 1024,      // hero textures; far/background textures are 512
    antialias: false,          // no MSAA (keeps GPU memory estimate simple and small)
    shadowMap: false,          // pseudo shadows only
  };
  if (mobile) {
    return Object.assign(base, {
      name: 'mobile',
      pixelRatio: 1.0,           // fixed on mobile
      maxPixels: 1366 * 1024 * 1.05,
      maxPerFruit: 12,           // per fruit type on the cake
      maxCandles: 7,
      particles: 48,
      adaptive: false,
    });
  }
  return Object.assign(base, {
    name: 'desktop',
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    maxPixels: 3.0e6,
    maxPerFruit: 16,
    maxCandles: 8,
    particles: 96,
    adaptive: true,              // drop to DPR 1 if fps stays low
  });
}

// Canvas pixel ratio honoring the pixel cap.
export function pixelRatioFor(tier, w, h) {
  let pr = tier.pixelRatio;
  const px = w * h * pr * pr;
  if (px > tier.maxPixels) pr = Math.sqrt(tier.maxPixels / (w * h));
  return Math.max(0.5, Math.min(pr, tier.pixelRatio));
}
