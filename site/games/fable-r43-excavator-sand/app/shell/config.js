// 配置・ティア・URL パラメータ。数値は docs/HERO-SPEC.md 1章と一致させる。
export const params = new URLSearchParams(location.search);
export const DEBUG = params.get('debug') === '1';

export const LAYOUT = {
  sandbox: { minX: -1.4, maxX: 1.4, minZ: -1.0, maxZ: 1.0, baseY: 0 },
  // 手前の板（z=maxZ 側）の x∈[gapMinX, gapMaxX] がトラックの出入口
  frame: { thick: 0.1, top: 0.16, bottom: -0.3, gapMinX: 0.28, gapMaxX: 0.92 },
  excavator: { x: -0.45, z: 0.25, yaw: 0 },
  truck: {
    // 前（運転台）が -Z、荷台が手前（+Z）。配達はまっすぐ +Z へバックして出入口を通り、お城の前で止まる。
    park: { x: 0.6, z: -0.4, heading: Math.PI / 2 },
    stopZ: 0.9,
    speed: 0.95,
  },
  castle: { x: 0.6, z: 1.76 },
  friend: { x: 1.3, z: 1.66 },
  camera: { pos: [0.25, 2.65, 3.62], look: [0.25, 0.0, 0.62], vfov: 44, minHFovAspect: 4 / 3 },
};

export const BED = {
  inner: { width: 0.42, length: 0.52, wallHeight: 0.13 },
  keepOut: { min: [-0.27, -0.25, -0.66], max: [0.27, 0.32, 0.3] },
};

const isMobile =
  (navigator.maxTouchPoints || 0) > 1 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');

const TIERS = {
  high: { name: 'high', pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5), maxPixels: 3.5e6, shadows: true, shadowMapSize: 512, terrainCells: [96, 72], grainMax: 400, maxTextureSize: 1024 },
  mobile: { name: 'mobile', pixelRatio: 1.0, maxPixels: 3.5e6, shadows: true, shadowMapSize: 512, terrainCells: [96, 72], grainMax: 300, maxTextureSize: 1024 },
  low: { name: 'low', pixelRatio: 1.0, maxPixels: 2.0e6, shadows: false, shadowMapSize: 0, terrainCells: [64, 48], grainMax: 150, maxTextureSize: 1024 },
};

export function pickTier() {
  const forced = params.get('tier');
  const name = forced && TIERS[forced] ? forced : isMobile ? 'mobile' : 'high';
  return { ...TIERS[name], isMobile };
}
