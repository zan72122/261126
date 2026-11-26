// 場面の寸法（メートル）。+Y 上、カメラは +Z 側から -Z（お客さん）側を見る。
export const COUNTER = { top: 0.80, x0: -1.25, x1: 1.25, z0: -0.55, z1: 1.00, thick: 0.05 };

// hero.root を置く点（釜の回転頭の上面中心）。HERO-SPEC §2
export const PAN_ORIGIN = [0, 1.00, 0];
export const PAN = {
  innerRadius: 0.30, rimY: 0.10, floorY: -0.06, spinnerRadius: 0.06,
  moveRadius: 0.22, moveY: 0.07,
  outerRadius: 0.335, spin: 18,
};

// カメラ：主役（回転釜＋割り箸のわたあめ）の大きさから距離を決める（camera.js）。
// 画角は「画面の短い辺」で決める：横長は縦の画角、縦長は横の画角。4:3 の横幅を守る作りはやめた。
export const LENS = {
  landShortFov: 38,   // 度：横長（幅 ≥ 高さ）の縦の画角
  portShortFov: 36,   // 度：縦長の横の画角（縦の画角はここから計算、最大 maxVFov）
  maxVFov: 80,
  fit: 0.96,          // 主役の外形が画面の端からはみ出さない限度（NDC）
};
// 場面ごとの構図。pitch：見下ろす角（度）、frac：主役が画面の短い辺に占める割合、
// land / port：主役の中心を置く画面の位置（NDC、x 右・y 上）。縦長は指の届く下寄りに置く。
// w：その構図へ寄る／引くときの減衰の速さ（臨界減衰、1/秒。小さいほどゆっくり）
export const SHOTS = {
  work:     { subject: 'hero',    pitch: 33, frac: 0.68, land: [0.07, -0.14], port: [0, -0.42], w: 2.6 },
  complete: { subject: 'hero',    pitch: 31, frac: 0.62, land: [0.07, -0.20], port: [0, -0.42], w: 1.6 },
  ready:    { subject: 'hero',    pitch: 29, frac: 0.57, land: [0.07, -0.28], port: [0, -0.44], w: 1.4 },
  give:     { subject: 'counter', pitch: 27, frac: 0.88, land: [0.0, -0.04], port: [0, -0.22], w: 1.3 },
};
// 寄った構図でも、お客さんの顔（この点）は画面の上端から face.lim（NDC）より内側に見せる。主役を下へずらせる分だけ
export const FACE = { y: 1.22, lim: 0.80 };
// 瓶を置く画面の位置（NDC x）：寄った構図で左の端に半分ほど見える所。釜からの隙間は jarGap
export const JAR_EDGE = { land: -0.80, port: -0.86, jarGap: 0.075, xMin: -0.82 };

// ざらめの瓶（左に縦一列。手前ほど下に見える）。x は画面比に合わせて world.setJarX で置き直す
export const JARS = [
  { id: 'white',  color: 0xfff8f2, pos: [-0.56, 0, 0.30] },
  { id: 'pink',   color: 0xff8fc0, pos: [-0.60, 0, 0.10] },
  { id: 'blue',   color: 0x8fd3ff, pos: [-0.64, 0, -0.10] },
  { id: 'yellow', color: 0xffe27a, pos: [-0.68, 0, -0.30] },
];
export const PALETTE = JARS.map(j => ({ id: j.id, color: j.color }));

// お客さん（カウンターの向こう）
export const CUSTOMER = {
  pos: [0.06, 0, -0.98],      // 足元
  enterFrom: [1.9, 0, -1.05], // 右から来る
  exitTo: [-1.9, 0, -1.05],   // 左へ去る
  scale: 1.0,
};

// 店先の棚（カウンターの向こう側の縁、お客さんの右に横一列。0 番がお客さん寄り）
export const RACK = {
  pos: [0.40, 0, -0.44],
  slots: 6,
  slotStep: 0.12,    // +x 方向の間隔
  copyScale: 0.55,
};

// 背景の写真板
export const BACKDROP = { dist: 7.0 };
