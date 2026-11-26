// 商品8種：寸法・重さ・袋での出方（表）と、パラメータから作る形（種類ごとに1つを共有、1個＝draw call 1回）。
// ローカル原点＝形の中心、長い物は長軸 +X。
import { mergeGeos, centerAndFit, latheGeo, tubeGeo, polyBuilder, mat4, quadRect, smoothstep } from './geo.js';

// spheres：袋の中の積み方と、袋の出っ張りに使う「かたまり」の球 [x, y, z, r]（商品ローカル）。
// poses：袋の中での向きの候補（オイラー角 XYZ）。pole＝立てて口から out(m) 飛び出させる長い物。
// pad：袋の紙をどれだけ余分に押し出すか（丸い物は大きく＝ぽこっ）、box＝角ばった押し方。
// hull：紙が突き抜けないための外形（球・箱・カプセル。箱は半分の大きさ h、カプセルは長軸 X の半分の長さ a と半径 r）。
export const KINDS = {
  apple: {
    size: [0.10, 0.092, 0.10], weight: 0.4, shape: 'round', vol: 0.00092, rough: 0.36, map: 'gro', roll: 1,
    spheres: [[0, 0, 0, 0.048]], poses: [{ r: [0, 0, 0] }], pad: 0.022, wall: -0.014, hull: { t: 'sphere', r: 0.05 },
  },
  orange: {
    size: [0.10, 0.093, 0.10], weight: 0.4, shape: 'round', vol: 0.00093, rough: 0.62, map: 'gro', roll: 1,
    spheres: [[0, 0, 0, 0.048]], poses: [{ r: [0, 0, 0] }], pad: 0.022, wall: -0.014, hull: { t: 'sphere', r: 0.05 },
  },
  banana: {
    size: [0.22, 0.046, 0.10], weight: 0.3, shape: 'long', vol: 0.0011, rough: 0.55, map: 'atlas',
    spheres: [[-0.072, 0, 0.012, 0.03], [0, 0, -0.016, 0.032], [0.072, 0, 0.014, 0.03]],
    poses: [{ r: [0, 0, 0] }, { r: [0, Math.PI, 0] }, { r: [0, 0, 0.5] }], pad: 0.016, wall: -0.006, hull: { t: 'box', h: [0.11, 0.024, 0.05] },
  },
  milk: {
    size: [0.08, 0.20, 0.08], weight: 0.9, shape: 'box', vol: 0.00128, rough: 0.45, map: 'atlas',
    spheres: [[0, -0.057, 0, 0.044], [0, 0, 0, 0.044], [0, 0.056, 0, 0.042]],
    poses: [{ r: [0, 0, 0] }, { r: [0, 0, -Math.PI / 2] }], pad: 0.014, box: true, wall: 0.01, hull: { t: 'box', h: [0.04, 0.10, 0.04] },
  },
  bread: {
    size: [0.40, 0.07, 0.085], weight: 0.3, shape: 'long', vol: 0.00238, rough: 0.9, map: 'gro',
    spheres: [[-0.16, 0, 0, 0.038], [-0.08, 0, 0, 0.041], [0, 0, 0, 0.041], [0.08, 0, 0, 0.041], [0.16, 0, 0, 0.038]],
    poses: [{ r: [0, 0, -(Math.PI / 2 - 0.34)] }, { r: [0, 0, -(Math.PI / 2 - 0.46)] }, { r: [0, 0, -(Math.PI / 2 + 0.34)] }],
    pole: true, out: 0.125, pad: 0.012, wall: -0.06, hull: { t: 'capsule', a: 0.156, r: 0.043 },
  },
  eggs: {
    size: [0.18, 0.062, 0.10], weight: 0.5, shape: 'box', vol: 0.00108, rough: 0.95, map: 'atlas',
    spheres: [[-0.05, 0, -0.016, 0.034], [0.05, 0, -0.016, 0.034], [-0.05, 0, 0.016, 0.034], [0.05, 0, 0.016, 0.034]],
    poses: [{ r: [0, 0, 0] }, { r: [0, 0, 0.75] }, { r: [0, 0, -0.75] }], pad: 0.014, box: true, wall: 0.008, hull: { t: 'box', h: [0.093, 0.032, 0.053] },
  },
  carrot: {
    size: [0.21, 0.056, 0.056], weight: 0.3, shape: 'long', vol: 0.0006, rough: 0.7, map: 'atlas',
    spheres: [[-0.035, 0, 0, 0.027], [0.02, 0, 0, 0.022], [0.065, 0, 0, 0.014]],
    poses: [{ r: [0, 0, -(Math.PI / 2 - 0.5)] }, { r: [0, 0, -(Math.PI / 2 + 0.5)] }, { r: [0.3, 0, -(Math.PI / 2 - 0.3)] }],
    pole: true, out: 0.055, pad: 0.012, wall: -0.06, hull: { t: 'capsule', a: 0.08, r: 0.028 },
  },
  can: {
    size: [0.08, 0.11, 0.08], weight: 0.7, shape: 'box', vol: 0.0007, rough: 0.32, map: 'atlas',
    spheres: [[0, -0.016, 0, 0.041], [0, 0.016, 0, 0.041]],
    poses: [{ r: [0, 0, 0] }, { r: [0, 0, Math.PI / 2] }], pad: 0.016, box: true, wall: 0.004, hull: { t: 'box', h: [0.04, 0.055, 0.04] },
  },
};

// groceries.jpg の水色（右下）を「色を付ける下地」に使う：頂点色 = 欲しい色(リニア) ÷ 水色(リニア)
const BLUE_LIN = [0.40, 0.68, 0.875];
const TINT_RECT = [0.72, 0.22, 0.78, 0.28];
function tint(THREE, hex) {
  const c = new THREE.Color(hex);
  return [c.r / BLUE_LIN[0], c.g / BLUE_LIN[1], c.b / BLUE_LIN[2]];
}

export function createItemKit(THREE, { detail, atlas }) {
  const R = atlas.rects;
  const seg = (n, min = 5) => Math.max(min, Math.round(n * detail));
  const cache = {};
  const made = [];

  const builders = {
    apple() {
      const Rr = 0.05, n = seg(14, 8);
      const rect = quadRect(0, 1);
      const profile = [];
      for (let j = 0; j <= n; j++) {
        const a = (j / n) * Math.PI;
        const dimT = 0.30 * Math.exp(-Math.pow((Math.PI - a) / 0.42, 2));
        const dimB = 0.14 * Math.exp(-Math.pow(a / 0.36, 2));
        const rho = Rr * (1 - dimT - dimB);
        profile.push({ r: Math.max(0.0006, rho * Math.sin(a) * (1 + 0.10 * -Math.cos(a) * Math.sin(a))), y: -rho * Math.cos(a) * 1.08, t: j / n, rect });
      }
      const body = latheGeo(THREE, profile, seg(20, 10), { mirrorU: true });
      const stem = new THREE.CylinderGeometry(0.0032, 0.0045, 0.032, 5);
      const leaf = new THREE.SphereGeometry(1, 6, 4);
      return mergeGeos(THREE, [
        { geo: body },
        { geo: stem, matrix: mat4(THREE, 0.003, 0.046, 0, 0, 0, -0.22), rect: TINT_RECT, color: tint(THREE, 0x6b4a2a) },
        { geo: leaf, matrix: mat4(THREE, 0.021, 0.056, 0.002, 0.25, 0.3, 0.4, 0.021, 0.0028, 0.011), rect: TINT_RECT, color: tint(THREE, 0x58b63f) },
      ]);
    },
    orange() {
      const Rr = 0.05, n = seg(13, 8);
      const rect = quadRect(1, 1);
      const profile = [];
      for (let j = 0; j <= n; j++) {
        const a = (j / n) * Math.PI;
        profile.push({ r: Math.max(0.0006, Rr * Math.sin(a)), y: -Rr * Math.cos(a) * 0.93, t: j / n, rect });
      }
      const body = latheGeo(THREE, profile, seg(20, 10), { mirrorU: true });
      const calyx = new THREE.CylinderGeometry(0.0075, 0.005, 0.004, 6);
      return mergeGeos(THREE, [
        { geo: body },
        { geo: calyx, matrix: mat4(THREE, 0, 0.0465, 0), rect: TINT_RECT, color: tint(THREE, 0x4a8f34) },
      ]);
    },
    banana() {
      const rho = 0.17, beta = 0.62, Rb = 0.0195;
      const cz = Math.cos(beta);
      const one = () => tubeGeo(THREE, {
        n: seg(14, 7), m: seg(8, 5), rect: R.banana, squashUp: 0.92,
        center: (t) => { const th = (2 * t - 1) * beta; return [rho * Math.sin(th), 0, -rho * (Math.cos(th) - cz)]; },
        radius: (t) => Rb * (0.24 + 0.76 * smoothstep(0, 0.2, t)) * (0.2 + 0.8 * smoothstep(0, 0.13, 1 - t)) * (t < 0.002 || t > 0.998 ? 0.05 : 1),
      });
      // 軸（t=0 の端）を中心に、3本を扇に開く
      const sx = rho * Math.sin(-beta);
      const parts = [];
      const fan = [[-0.26, -0.002], [0, 0.004], [0.26, -0.002]];
      for (const [ang, dy] of fan) {
        const m = new THREE.Matrix4().makeTranslation(sx, dy, 0)
          .multiply(new THREE.Matrix4().makeRotationY(ang))
          .multiply(new THREE.Matrix4().makeTranslation(-sx, 0, 0));
        parts.push({ geo: one(), matrix: m });
      }
      parts.push({ geo: new THREE.CylinderGeometry(0.008, 0.0065, 0.022, 6), matrix: mat4(THREE, sx - 0.004, 0.002, 0, 0, 0, Math.PI / 2), rect: R.stem, color: [0.9, 1.0, 0.7] });
      return centerAndFit(mergeGeos(THREE, parts), [0.22, 0, 0]);
    },
    milk() {
      const w = 0.04, y0 = -0.10, h0 = 0.045, h1 = 0.085;
      const pb = polyBuilder(THREE, [0, -0.02, 0]);
      const sub = (r, a, b) => [r[0], r[1] + (r[3] - r[1]) * a, r[2], r[1] + (r[3] - r[1]) * b];
      const fBody = sub(R.milkFront, 0, 0.72), fTop = sub(R.milkFront, 0.72, 1), sBody = sub(R.milkSide, 0, 0.72);
      pb.quad([-w, y0, w], [w, y0, w], [w, h0, w], [-w, h0, w], fBody);
      pb.quad([w, y0, -w], [-w, y0, -w], [-w, h0, -w], [w, h0, -w], fBody);
      pb.quad([w, y0, w], [w, y0, -w], [w, h0, -w], [w, h0, w], sBody);
      pb.quad([-w, y0, -w], [-w, y0, w], [-w, h0, w], [-w, h0, -w], sBody);
      pb.quad([-w, y0, -w], [w, y0, -w], [w, y0, w], [-w, y0, w], R.white);
      pb.quad([-w, h0, w], [w, h0, w], [w, h1, 0], [-w, h1, 0], fTop);
      pb.quad([w, h0, -w], [-w, h0, -w], [-w, h1, 0], [w, h1, 0], fTop);
      pb.tri3([w, h0, w], [w, h0, -w], [w, h1, 0], R.white);
      pb.tri3([-w, h0, -w], [-w, h0, w], [-w, h1, 0], R.white);
      const fin = new THREE.BoxGeometry(0.08, 0.017, 0.006);
      return mergeGeos(THREE, [
        { geo: pb.build() },
        { geo: fin, matrix: mat4(THREE, 0, 0.0915, 0), rect: R.milkTop },
      ]);
    },
    bread() {
      const Lb = 0.40, Rm = 0.0425, n = seg(22, 10);
      const rect = quadRect(0, 0);
      const profile = [];
      for (let j = 0; j <= n; j++) {
        const t = j / n;
        const e = Math.sqrt(Math.max(1e-4, 1 - Math.pow(Math.abs(2 * t - 1), 2.6)));
        const score = 1 + 0.04 * Math.sin(t * Math.PI * 2 * 5.5);
        profile.push({ r: Math.max(0.0006, Rm * e * score), y: (t - 0.5) * Lb, t, rect });
      }
      const g = latheGeo(THREE, profile, seg(14, 8), { swapUV: true, mirrorU: true });
      return centerAndFit(mergeGeos(THREE, [{ geo: g, matrix: mat4(THREE, 0, 0, 0, 0, 0, -Math.PI / 2) }]), [0.40, 0.07, 0.085]);
    },
    eggs() {
      const parts = [
        { geo: new THREE.BoxGeometry(0.18, 0.036, 0.10), matrix: mat4(THREE, 0, -0.013, 0), rect: R.pulp },
        { geo: new THREE.BoxGeometry(0.186, 0.006, 0.106), matrix: mat4(THREE, 0, 0.005, 0), rect: R.pulp, color: [1.08, 1.08, 1.08] },
      ];
      let k = 0;
      for (const z of [-0.025, 0.025]) {
        for (const x of [-0.058, 0, 0.058]) {
          const brown = k === 1 || k === 5;
          parts.push({
            geo: new THREE.SphereGeometry(1, seg(10, 6), seg(7, 5)), matrix: mat4(THREE, x, 0.003, z, 0, k * 1.3, 0, 0.0225, 0.028, 0.0225),
            rect: R.egg, color: brown ? [0.95, 0.74, 0.55] : [1, 1, 1],
          });
          k++;
        }
      }
      return centerAndFit(mergeGeos(THREE, parts), null);
    },
    carrot() {
      const Lr = 0.15, n = seg(11, 6);
      const profile = [{ r: 0.0006, y: -Lr / 2, t: 0, rect: R.carrot }, { r: 0.014, y: -Lr / 2 + 0.0012, t: 0.01, rect: R.carrot }];
      for (let j = 0; j <= n; j++) {
        const t = j / n;
        const r = 0.0275 * (0.6 + 0.4 * smoothstep(-0.02, 0.09, t)) * Math.pow(Math.max(1e-4, 1 - t), 0.62) * (1 + 0.03 * Math.sin(t * 38));
        profile.push({ r: Math.max(0.0006, r), y: -Lr / 2 + 0.004 + t * (Lr - 0.004), t: 0.03 + 0.97 * t, rect: R.carrot });
      }
      const root = latheGeo(THREE, profile, seg(14, 8), { swapUV: true });
      const parts = [{ geo: root, matrix: mat4(THREE, 0, 0, 0, 0, 0, -Math.PI / 2) }];
      const leaves = [[0.0, 0.0, 0.036], [0.5, 0.28, 0.03], [-0.5, 0.25, 0.03], [0.15, -0.35, 0.027], [-0.2, 0.55, 0.026]];
      for (const [yaw, pitch, len] of leaves) {
        const m = new THREE.Matrix4().makeTranslation(-Lr / 2 + 0.004, 0, 0)
          .multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, Math.PI + yaw, pitch, 'YZX')))
          .multiply(new THREE.Matrix4().makeTranslation(len * 0.9, 0, 0))
          .multiply(new THREE.Matrix4().makeScale(len, 0.0045, 0.011));
        parts.push({ geo: new THREE.SphereGeometry(1, 6, 4), matrix: m, rect: R.leaf, swapUV: true });
      }
      return centerAndFit(mergeGeos(THREE, parts), null);
    },
    can() {
      const M = { rect: R.metal, planar: true }, Lb = { rect: R.can };
      const profile = [
        { r: 0.0006, y: -0.052, ...M }, { r: 0.034, y: -0.052, ...M }, { r: 0.0372, y: -0.055, ...M }, { r: 0.040, y: -0.052, ...M },
        { r: 0.040, y: -0.0462, ...M }, { r: 0.0388, y: -0.0445, t: 0, ...Lb }, { r: 0.0388, y: 0.0445, t: 1, ...Lb },
        { r: 0.040, y: 0.0462, ...M }, { r: 0.040, y: 0.052, ...M }, { r: 0.0372, y: 0.055, ...M }, { r: 0.034, y: 0.0505, ...M }, { r: 0.0006, y: 0.0505, ...M },
      ];
      return mergeGeos(THREE, [{ geo: latheGeo(THREE, profile, seg(24, 12)) }]);
    },
  };

  function geometry(kind) {
    if (!cache[kind]) { cache[kind] = builders[kind](); made.push(cache[kind]); }
    return cache[kind];
  }

  function dispose() { for (const g of made) g.dispose(); made.length = 0; for (const k of Object.keys(cache)) delete cache[k]; }

  return { geometry, dispose };
}
