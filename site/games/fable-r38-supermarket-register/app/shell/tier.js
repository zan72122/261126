// モバイル判定と性能ティア。iPad は Mac の UA を名乗るので maxTouchPoints で見る。
export function detectTier(params) {
  const mobile = (navigator.maxTouchPoints || 0) > 1;
  const forced = params.get('tier');
  const name = forced === 'desktop' || forced === 'mobile' || forced === 'low'
    ? forced : (mobile ? 'mobile' : 'desktop');
  return makeTier(name, mobile);
}

export function makeTier(name, mobile) {
  const dpr = window.devicePixelRatio || 1;
  const t = { name, mobile };
  if (name === 'desktop') {
    t.pixelRatio = Math.min(dpr, 2); t.antialias = true; t.msaaSamples = 4; t.detail = 1.0; t.anisotropy = 4;
  } else if (name === 'mobile') {
    t.pixelRatio = 1.0; t.antialias = false; t.msaaSamples = 0; t.detail = 1.0; t.anisotropy = 2;
  } else { // low：手動（?tier=low）だけ
    t.pixelRatio = mobile ? 1.0 : Math.min(dpr, 1); t.antialias = false; t.msaaSamples = 0; t.detail = 0.6; t.anisotropy = 1;
  }
  // 何があっても超えない上限
  t.maxTriangles = 100000;
  t.maxGpuMiB = 128;
  // 画面の枠（色＋深度、MSAA ならその倍数、表示用）に使ってよい GPU メモリ。デスクトップの大きな窓・DPR 2・MSAA 4x では
  // これを超えないよう画素比を下げる（mobile は DPR 1.0 固定のまま。iPad 12.9" で約 16 MiB）
  t.maxFramebufferMiB = 80;
  t.bytesPerPixel = t.msaaSamples > 0 ? 8 * t.msaaSamples + 8 : 12;
  return t;
}
