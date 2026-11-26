// 場面の寸法（メートル）。+Y 上、カメラは +Z 側から -Z（お客さん）側を見る。
export const COUNTER = { top: 0.80, x0: -1.25, x1: 1.25, z0: -0.55, z1: 1.00, thick: 0.05 };

// hero.root を置く点（釜の回転頭の上面中心）。HERO-SPEC §2
export const PAN_ORIGIN = [0, 1.00, 0];
export const PAN = {
  innerRadius: 0.30, rimY: 0.10, floorY: -0.06, spinnerRadius: 0.06,
  moveRadius: 0.22, moveY: 0.07,
  outerRadius: 0.335, spin: 18,
};

// カメラ（固定）。画面比に合わせて画角だけ変える（fitCamera）
export const CAMERA = {
  pos: [0, 1.86, 0.98],
  look: [0, 1.00, -0.42],
  minVFov: 50,          // 度
  // 必ず画面に入れたい横幅（look 点の距離で、左右それぞれ）
  halfWidth: 0.98,
};

// ざらめの瓶（左に縦一列。手前ほど下に見える）
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
