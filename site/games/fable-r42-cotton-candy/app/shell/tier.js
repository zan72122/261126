// モバイル判定とティア別の上限（PLAN.md §3）
export const TIERS = {
  low: {
    name: 'low', antialias: false, maxPixelRatio: 1.0, maxPixels: 1.6e6,
    hero: { level: 'low', furShells: 3, threads: 24, triBudget: 20000 },
    lanterns: 6, sugarGrains: 40, rackSlots: 4,
  },
  mobile: {
    name: 'mobile', antialias: true, maxPixelRatio: 1.0, maxPixels: 2.2e6,
    hero: { level: 'mid', furShells: 6, threads: 48, triBudget: 50000 },
    lanterns: 10, sugarGrains: 80, rackSlots: 6,
  },
  desktop: {
    name: 'desktop', antialias: true, maxPixelRatio: 2.0, maxPixels: 1.8e6,
    hero: { level: 'high', furShells: 8, threads: 64, triBudget: 50000 },
    lanterns: 10, sugarGrains: 80, rackSlots: 6,
  },
};

export function isMobile() {
  // iPad は Mac の UA を名乗るので maxTouchPoints で見る
  return (navigator.maxTouchPoints || 0) > 1 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function pickTier(params) {
  const forced = params.get('tier');
  if (forced && TIERS[forced]) return TIERS[forced];
  return isMobile() ? TIERS.mobile : TIERS.desktop;
}

// ソフトウェア描画（SwiftShader 等）なら low に落とす
export function refineTierWithGL(tier, gl, params) {
  if (params.get('tier')) return tier;
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    if (/SwiftShader|llvmpipe|Software/i.test(r)) return TIERS.low;
  } catch (e) { /* ignore */ }
  return tier;
}

// 描画の画素比：モバイルは 1.0 固定。描画画素数の上限も守る
export function pixelRatioFor(tier, w, h) {
  const dpr = window.devicePixelRatio || 1;
  let pr = Math.min(dpr, tier.maxPixelRatio);
  const maxByPixels = Math.sqrt(tier.maxPixels / Math.max(1, w * h));
  pr = Math.min(pr, maxByPixels);
  if (tier.name !== 'desktop') pr = Math.min(pr, 1.0);
  return Math.max(0.5, pr);
}
