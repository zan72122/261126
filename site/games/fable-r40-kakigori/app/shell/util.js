// 小さな道具：色付き部品の結合、イージング、数値の安全化。
import * as THREE from '../vendor/three.module.min.js';

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(), _p = new THREE.Vector3();

// part = { geo, color(hex), pos:[x,y,z], rot:[x,y,z], scale:[x,y,z]|number }
// 色を頂点色に焼いて1つの BufferGeometry にまとめる（draw call を減らす）。入力 geo は dispose する。
export function mergeParts(parts) {
  const P = [], N = [], C = [];
  const col = new THREE.Color();
  for (const part of parts) {
    let g = part.geo.index ? part.geo.toNonIndexed() : part.geo;
    const sc = part.scale == null ? [1, 1, 1] : typeof part.scale === 'number' ? [part.scale, part.scale, part.scale] : part.scale;
    _e.set(...(part.rot || [0, 0, 0])); _q.setFromEuler(_e);
    _m.compose(_p.set(...(part.pos || [0, 0, 0])), _q, _s.set(...sc));
    g.applyMatrix4(_m);
    col.set(part.color);
    const pa = g.attributes.position.array, na = g.attributes.normal.array;
    for (let i = 0; i < pa.length; i++) { P.push(pa[i]); N.push(na[i]); }
    for (let i = 0; i < pa.length / 3; i++) C.push(col.r, col.g, col.b);
    if (g !== part.geo) g.dispose();
    part.geo.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
  out.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
  out.computeBoundingSphere();
  return out;
}

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeInOut = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
export const easeOutBack = (t) => { t = clamp(t, 0, 1); const c = 1.70158; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; };
// ぴょこっ：0..1 の時間で 0→1→0 と少し弾む
export const hop = (t) => (t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t) * (1 - 0.3 * t));
export const damp = (k, dt) => 1 - Math.exp(-k * dt);

// 三角形数（InstancedMesh は count 倍）
export function triCount(obj) {
  let n = 0;
  obj.traverseVisible((o) => {
    if (!o.isMesh || !o.geometry) return;
    const g = o.geometry, c = g.index ? g.index.count : g.attributes.position ? g.attributes.position.count : 0;
    let t = c / 3;
    if (g.drawRange && g.drawRange.count !== Infinity) t = Math.min(t, g.drawRange.count / 3);
    n += t * (o.isInstancedMesh ? o.count : 1);
  });
  return Math.round(n);
}

// 全体を dispose（共有物は userData.shared で除外）
export function disposeDeep(obj) {
  obj.traverse((o) => {
    if (o.userData && o.userData.shared) return;
    if (o.geometry && !o.geometry.userData.shared) o.geometry.dispose();
    const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    for (const m of ms) if (!m.userData.shared) m.dispose();
  });
}
