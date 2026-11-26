// 場面の配置（メートル、+Y 上、原点＝カウンター天板の上面、+X＝右、−Z＝奥のお客さん側）。
// hero には opts.layout としてこのまま渡す。docs/HERO-SPEC.md 2章と同じ値に保つこと。
function deepFreeze(o) {
  for (const k of Object.keys(o)) if (o[k] && typeof o[k] === 'object') deepFreeze(o[k]);
  return Object.freeze(o);
}

export const LAYOUT = deepFreeze({
  counter: { x0: -1.25, x1: 1.30, zFront: 0.48, zBack: -0.42, thickness: 0.05 },
  floorY: -0.9,
  basket: { center: [-0.62, 0, 0.08], size: [0.46, 0.12, 0.34] },
  scanner: { center: [-0.20, 0, 0.04], size: [0.24, 0.20] },
  belt: { x0: -0.02, x1: 0.62, z: 0.04, width: 0.30, topY: 0.03 },
  // 袋置き場は浅め：袋の上半分が天板より上に出て、入れるたびのふくらみ・出っ張りが置いたままでも見える（hero-notes 6章1）
  bagWell: { center: [0.88, -0.20, 0.04], size: [0.44, 0.36] },
  bag: { base: [0.88, -0.20, 0.04], size: [0.30, 0.34, 0.22] },
  dragPlaneY: 0.14,
  bagLiftY: 0.46,       // 袋を持ち上げた時の持ち手の高さ（袋の底がカウンターより上に来る）
  giveZ: -0.02,          // 袋をこれより奥で離したら「渡す」
  giveDragPx: 50,        // または、上（お客さんの方）へ 50px 以上動かして離したら「渡す」
  customer: { stand: [0.18, -0.9, -1.0], paws: [0.18, 0.23, -0.75] },
  gifts: { x0: -0.98, x1: -0.32, z: -0.33 },   // 寄った構図でも端の花が切れないよう、少し内側
});

// カメラは app/shell/camera.js（主役中心の構図を、遊びの状態に合わせてゆっくり切り替える）。
