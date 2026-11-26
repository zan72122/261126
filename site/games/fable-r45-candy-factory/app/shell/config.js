// ティア判定・配置・色。数値は docs/PLAN.md と docs/HERO-SPEC.md に合わせる。

export const PALETTE = [
  { key: 'pink', color: 0xff8fb8 },
  { key: 'white', color: 0xfff4ea },
  { key: 'aqua', color: 0x8fd6ff },
  { key: 'yellow', color: 0xffe066 },
  { key: 'mint', color: 0x8ff0c0 },
  { key: 'lavender', color: 0xc7a6ff },
];

export const params = new URLSearchParams(location.search);
export const DEBUG = params.get('debug') === '1';

export function detectTier() {
  const forced = params.get('tier');
  const ua = navigator.userAgent || '';
  // iPad は Mac の UA を名乗るので maxTouchPoints で判定する
  const mobile = (navigator.maxTouchPoints || 0) > 1 || /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const tier = ['high', 'mobile', 'low'].includes(forced) ? forced : (mobile ? 'mobile' : 'high');
  return { tier, mobile, forced: !!forced };
}

// ティア別設定（PLAN.md §3）
export const TIERS = {
  high: { dpr: () => Math.min(window.devicePixelRatio || 1, 2), maxPixels: 3.7e6, particles: 120 },
  mobile: { dpr: () => 1.0, maxPixels: 1.6e6, particles: 80 },
  low: { dpr: () => 0.8, maxPixels: 1.1e6, particles: 40 },
};

// 配置（メートル、原点＝作業台の天板中央、+z 手前）
export const LAYOUT = {
  camPos: [0.28, 1.563, 2.334],
  camTarget: [0.28, 0.38, 0.20],
  baseVFov: 34, // 4:3 のときの縦画角
  baseAspect: 4 / 3,
  table: { x0: -0.98, x1: 0.80, z0: -0.56, z1: 0.64, thick: 0.06, legH: 0.86 },
  tray: { x: -0.20, z: 0.44, w: 0.86, d: 0.18 },
  lumpXs: [-0.52, -0.36, -0.20, -0.04, 0.12],
  scissors: [0.56, 0.012, 0.48],
  bag: [0.38, 0, 0.30],
  counter: { x0: 0.80, x1: 1.60, z0: -0.40, z1: 0.50, top: -0.02 },
  customer: [1.06, -0.10, -0.12],
  customerEnter: [1.85, -0.10, -0.12],
  bench: { x: 0.98, z: -1.25, y: 0.02, seats: [0.50, 0.78, 1.34, 1.56] },
  backdropZ: -2.6,
};

export const TIMING = {
  tapMax: 0.35, // 秒
  tapMovePx: 14,
  pickRadiusPx: 80,
  idleHint: 3.0,
};
