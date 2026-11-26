// hero のパラメータ（すべてここから形と連動を計算する）。単位：メートル・秒・ラジアン。
// 腕の平面の座標は (u, v)：u＝旋回軸から前へ、v＝旋回体の原点（足回りの上）から上へ。
// 各リンクの局所座標は (p, q)：p＝リンクの向き、q＝その左法線（前向きのリンクなら上側）。
const DEG = Math.PI / 180;

export const P = {
  // ---- 足回り ----
  trackL: 0.62, trackW: 0.12, trackH: 0.13, gauge: 0.40, wheelR: 0.056, rollers: 4,
  swingY: 0.16,                    // 旋回体の原点の高さ（足回りの上）
  // ---- 旋回体 ----
  deck: { halfW: 0.23, front: 0.20, back: 0.30, h: 0.10 },
  cab: { x0: -0.222, x1: -0.03, u0: -0.03, u1: 0.19, h: 0.27 },
  armX: 0.07,                      // 腕の平面の横ずれ（運転席の右）
  // ---- 腕 ----
  boomPivot: { u: 0.14, v: 0.12 }, // ブームの根元（＝足回り原点から高さ 0.28）
  L1: 0.62, boomBend: 25 * DEG, boomBendAt: 0.55, boomW: 0.066,
  L2: 0.46, armW: 0.05,
  Lb: 0.20, bucketW: 0.26, bucketWall: 0.008, teeth: 4,
  boomMin: -20 * DEG, boomMax: 84 * DEG,
  elbowMin: 34 * DEG, elbowMax: 172 * DEG,   // ブームとアームの内角
  betaMin: -178 * DEG, betaMax: 32 * DEG,    // バケット角（アームに対する刃先の向き）
  // ---- 油圧シリンダー（取付点）----
  boomCyl: { a: { u: 0.228, v: 0.018 }, c: { p: 0.33, q: 0.028 }, side: 0.068, r: 0.02, rodR: 0.011 },
  armCyl: { a: { p: 0.265, q: 0.118 }, c: { p: -0.105, q: 0.04 }, r: 0.022, rodR: 0.012 },
  bucketCyl: { a: { p: 0.055, q: 0.072 }, r: 0.019, rodR: 0.0105 },
  // ---- バケットリンク（4節）----
  link: { n: { p: 0.46 - 0.095, q: 0.012 }, q: { x: -0.012, y: 0.07 }, l1: 0.105, l2: 0.11, sideH: 0.031, sideT: 0.041 },
  // ---- バケットの側面形（ピン原点、x＝ピン→刃先、y＝底の側）：3次ベジェ ----
  bucketCurve: [[0.0, 0.016], [-0.036, 0.152], [0.1, 0.152], [0.2, 0.0]],
  // ---- バケットの姿勢 ----
  psiDig: -105 * DEG,              // 掘る：刃先が下・少し手前
  psiCarry: -190 * DEG,            // 運ぶ：口が上
  psiRest: -168 * DEG,             // 空で待つ
  psiDump: -42 * DEG,              // あける：口が下
  holdFull: -128 * DEG, holdNone: -70 * DEG, // この角度の間で持てる量が 1→0
  // ---- 届く範囲と動き ----
  reachMin: 0.50, reachMax: 1.27, wristVMax: 0.80,
  home: { x: 0.53, z: 0.27, hover: 0.13 },   // 待機の位置（足回り中心から。前が −z）
  omega: 14, omegaPsi: 16,
  maxSwingSpeed: 3.0, maxLinSpeed: 2.6, maxPsiSpeed: 7.0,
  // ---- 砂 ----
  digDepth: 0.085, fullSkim: 0.015, minH: -0.22, maxH: 0.42,
  bucketCap: 0.0045, bedFullBuckets: 3.5,
  repose: Math.tan(34 * DEG),
  healLevel: -0.10, healTau: 60, wetTau: 70,
  pourTime: 0.6,                   // 満杯のバケットをあける時間の目安
  grainR: 0.011, gravity: 7.0,
  bedCells: [20, 24],
};

export { DEG };
