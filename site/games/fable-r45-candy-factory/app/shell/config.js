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
// トレー・はさみ・袋の置き場所は、画面の向きと大きさに合わせて camera.js が決め直す（ここは初期値）。
export const LAYOUT = {
  table: { x0: -0.98, x1: 0.80, z0: -0.56, z1: 0.64, thick: 0.06, legH: 0.86 },
  tray: { x: -0.20, z: 0.30, w: 0.86, d: 0.18 },
  lumpXs: [-0.52, -0.36, -0.20, -0.04, 0.12],
  scissors: [0.30, 0.012, 0.32],
  bag: [0.50, 0, 0.16],
  counter: { x0: 0.80, x1: 1.60, z0: -0.40, z1: 0.50, top: -0.02 },
  customer: [1.06, -0.10, -0.12],
  customerEnter: [1.85, -0.10, -0.12],
  bench: { x: 0.98, z: -1.25, y: 0.02, seats: [0.50, 0.78, 1.34, 1.56] },
  backdropZ: -2.6,
};

// カメラ（docs/fullscreen.md）。主役の箱を画面の「短い辺」の fill 倍に収める距離を毎フレーム解き、減衰付きで追う。
//   shortFov: 短い辺の画角（横長なら縦、縦長なら横）。anchor: 主役の中心を置く所（safe-area の内側の割合、0,0＝左上）
//   fillScale: 縦長では少しだけゆるめる（ねじる車が左の端に掛かりすぎないように）
//   yaw/pitch: 見る向き（度）。pitch 27° は hero の「帯がカメラから見える向き」（lumpAlpha）に合わせた元の角度。
export const CAMERA = {
  near: 0.05, far: 20,
  maxVFov: 68,
  orient: {
    landscape: { shortFov: 34, anchor: [0.46, 0.38], tray: [0.40, 0.81], scissors: [0.86, 0.79] },
    portrait: { shortFov: 32, anchor: [0.53, 0.58], tray: [0.44, 0.82], scissors: [0.78, 0.71], fillScale: 0.93 },
  },
  // 場面ごとの構図。box: 主役の箱 [x0,y0,z0, x1,y1,z1]（hero の点で広がる）、fill: 短い辺に対する割合、
  // smooth: 追う時定数（秒、大きいほどゆっくり）。
  shots: {
    work: { box: [-0.46, 0.15, -0.06, 0.13, 0.47, 0.08], fill: 0.68, yaw: 3, pitch: 27, smooth: 0.65 },
    finish: { box: [-0.47, 0.0, -0.04, 0.47, 0.36, 0.16], fill: 0.72, yaw: 3, pitch: 30, smooth: 0.9 },
    give: { box: [0.30, -0.06, -0.30, 1.32, 0.62, 0.30], fill: 0.80, yaw: 0, pitch: 22, smooth: 1.2, ax: 0.5 },
    thanks: { box: [0.30, -0.06, -1.30, 1.70, 0.80, 0.10], fill: 0.86, yaw: -6, pitch: 18, smooth: 1.4, ax: 0.5 },
    intro: { box: [-0.70, -0.06, -0.30, 1.32, 0.66, 0.40], fill: 0.90, yaw: 0, pitch: 26, smooth: 1.3, ax: 0.5 },
  },
  introHold: 1.1,   // 起動直後、お客さんも見える引きの構図で待つ秒数（触ればすぐ寄る）
  thanksHold: 2.6,  // 渡した後、お客さんが喜ぶのを見せる秒数
};

export const TIMING = {
  tapMax: 0.35, // 秒
  tapMovePx: 14,
  pickRadiusPx: 80,
  idleHint: 3.0,
};
