// モバイル判定と性能ティア。iPad は Mac の UA を名乗るので maxTouchPoints > 1 で判定する。
export function detectTier() {
  const params = new URLSearchParams(location.search);
  const forced = params.get('tier');
  const touch = (navigator.maxTouchPoints || 0) > 1;
  const mobile = touch || /iPhone|iPad|Android/i.test(navigator.userAgent);
  const tier = forced === 'high' || forced === 'mobile' || forced === 'low' ? forced : mobile ? 'mobile' : 'high';
  return { tier, mobile, forced: !!forced, settings: settingsFor(tier, mobile) };
}

export function settingsFor(tier, mobile) {
  const dpr = window.devicePixelRatio || 1;
  if (tier === 'low') return { tier, pixelRatio: mobile ? 0.75 : Math.min(dpr, 1), maxPixels: 2.0e6, particleScale: 0.5 };
  if (tier === 'mobile') return { tier, pixelRatio: 1.0, maxPixels: 3.2e6, particleScale: 1 };
  return { tier, pixelRatio: Math.min(dpr, 2), maxPixels: 4.2e6, particleScale: 1 };
}
