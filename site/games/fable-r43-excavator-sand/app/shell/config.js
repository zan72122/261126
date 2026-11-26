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
  // カメラ（camera.js）：主役中心の構図。距離は主役の大きさ（heroRadius）と短い辺に占める割合（fill）から決める。
  // 以前は作業場全体（砂場の幅 約4.3m）を 4:3 の横幅で収めていて、ショベルは画面の2〜3割しかなかった。
  camera: {
    heroRadius: 0.5,      // 主役（ショベル＋腕）を包む球の半径 m
    fill: 0.61,           // その球が画面の短い辺に占める割合（ショベル本体の見た目で 55〜70% になるよう合わせた値）
    follow: 0.35,         // work でバケットの先を追う割合（0＝ショベルの中心、1＝バケットの先）
    groupFill: 0.9,       // 引きのショットで、物の集まりが画面の縦・横に占める割合（画面に写して合わせる）
    loadFill: 0.92,       // 荷台へ積むショット（ショベル＋荷台＋バケット）。work より近づかない
    yaw: 8,               // 真後ろ（+Z）から右へ回す角度（度）
    landscape: { shortFov: 40, pitch: 38, screenY: -0.06, screenYWide: 0.0, loadPitch: 4 },
    // 縦長：主役を指の届く下寄りに置く（注視点を画面の下 35% あたりへ）。上から見下ろし気味にして砂の面を広く見せる
    portrait: { shortFov: 38, pitch: 46, screenY: -0.32, screenYWide: -0.12, loadPitch: 2 },
    smooth: { work: 0.45, load: 0.7, deliver: 1.1, guest: 1.0, finale: 1.3 }, // ばねの時間（秒）：引く場面はゆっくり
  },
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
