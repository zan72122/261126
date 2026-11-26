// 動かない部品の結合：同じ親の直下で、同じマテリアル・同じ影の設定のメッシュを1つにまとめる（draw call を減らす）。
// 形は親の座標に焼き込む（非インデックス化して連結）。InstancedMesh・子を持つメッシュ・userData.noMerge は対象外。
import * as THREE from '../vendor/three/three.module.js';

export function mergeStatic(parent, { disposeOriginals = false } = {}) {
  const groups = new Map();
  for (const o of parent.children) {
    if (!o.isMesh || o.isInstancedMesh || o.children.length || o.userData.noMerge || Array.isArray(o.material) || !o.visible) continue;
    const key = `${o.material.uuid}|${o.castShadow}|${o.receiveShadow}|${o.renderOrder}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(o);
  }
  const created = [];
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const parts = [];
    let hasUv = true;
    for (const m of list) {
      m.updateMatrix();
      const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
      g.applyMatrix4(m.matrix);
      if (!g.attributes.normal) g.computeVertexNormals();
      if (!g.attributes.uv) hasUv = false;
      parts.push(g);
    }
    const names = hasUv ? ['position', 'normal', 'uv'] : ['position', 'normal'];
    const merged = new THREE.BufferGeometry();
    for (const n of names) {
      const size = parts[0].attributes[n].itemSize;
      let len = 0;
      for (const g of parts) len += g.attributes[n].count * size;
      const arr = new Float32Array(len);
      let off = 0;
      for (const g of parts) { const a = g.attributes[n]; arr.set(a.array.subarray(0, a.count * size), off); off += a.count * size; }
      merged.setAttribute(n, new THREE.BufferAttribute(arr, size));
    }
    merged.computeBoundingSphere();
    for (const g of parts) g.dispose();
    const first = list[0];
    const mesh = new THREE.Mesh(merged, first.material);
    mesh.castShadow = first.castShadow; mesh.receiveShadow = first.receiveShadow; mesh.renderOrder = first.renderOrder;
    mesh.name = (first.name || 'merged') + '+' + (list.length - 1);
    for (const m of list) { parent.remove(m); if (disposeOriginals) m.geometry.dispose(); }
    parent.add(mesh);
    created.push(merged);
  }
  return created;
}
