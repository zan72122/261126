// 細い糸の束（1 draw call）。糸 1 本は pts 個の点の折れ線で、画面に向いた細い帯として描く。
export function createRibbons(THREE, material, strands, pts) {
  const nv = strands * pts * 2;
  const pos = new Float32Array(nv * 3), tan = new Float32Array(nv * 3), side = new Float32Array(nv * 2), col = new Float32Array(nv * 4);
  const idx = nv > 65535 ? new Uint32Array(strands * (pts - 1) * 6) : new Uint16Array(strands * (pts - 1) * 6);
  let k = 0;
  for (let s = 0; s < strands; s++) for (let j = 0; j < pts - 1; j++) {
    const a = (s * pts + j) * 2;
    idx[k++] = a; idx[k++] = a + 1; idx[k++] = a + 2; idx[k++] = a + 1; idx[k++] = a + 3; idx[k++] = a + 2;
  }
  for (let i = 0; i < nv; i++) side[i * 2] = i & 1 ? 1 : -1;
  const geo = new THREE.BufferGeometry();
  const aPos = new THREE.BufferAttribute(pos, 3), aTan = new THREE.BufferAttribute(tan, 3), aSide = new THREE.BufferAttribute(side, 2), aCol = new THREE.BufferAttribute(col, 4);
  for (const a of [aPos, aTan, aSide, aCol]) a.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', aPos); geo.setAttribute('aTan', aTan); geo.setAttribute('aSide', aSide); geo.setAttribute('aCol', aCol);
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1.0);
  const mesh = new THREE.Mesh(geo, material);
  mesh.frustumCulled = false;
  return {
    mesh, geo, strands, pts,
    // 糸 s の j 番目の点
    put(s, j, x, y, z, r, g, b, a, halfWidth) {
      const v = (s * pts + j) * 2;
      let o = v * 3;
      pos[o] = x; pos[o + 1] = y; pos[o + 2] = z; pos[o + 3] = x; pos[o + 4] = y; pos[o + 5] = z;
      o = v * 4;
      col[o] = r; col[o + 1] = g; col[o + 2] = b; col[o + 3] = a; col[o + 4] = r; col[o + 5] = g; col[o + 6] = b; col[o + 7] = a;
      side[v * 2 + 1] = halfWidth; side[v * 2 + 3] = halfWidth;
    },
    // 糸 s を見えなくする
    hide(s) {
      const v0 = s * pts * 2;
      for (let i = 0; i < pts * 2; i++) col[(v0 + i) * 4 + 3] = 0;
    },
    // 糸 s の向き（前後の点の差）を入れる
    finish(s) {
      const v0 = s * pts * 2;
      for (let j = 0; j < pts; j++) {
        const a = (v0 + (j > 0 ? j - 1 : 0) * 2) * 3, b = (v0 + (j < pts - 1 ? j + 1 : pts - 1) * 2) * 3, o = (v0 + j * 2) * 3;
        const tx = pos[b] - pos[a], ty = pos[b + 1] - pos[a + 1], tz = pos[b + 2] - pos[a + 2];
        tan[o] = tx; tan[o + 1] = ty; tan[o + 2] = tz; tan[o + 3] = tx; tan[o + 4] = ty; tan[o + 5] = tz;
      }
    },
    setCount(n) { geo.setDrawRange(0, Math.max(0, Math.min(strands, n)) * (pts - 1) * 6); },
    commit() { aPos.needsUpdate = true; aTan.needsUpdate = true; aSide.needsUpdate = true; aCol.needsUpdate = true; },
    dispose() { geo.dispose(); mesh.removeFromParent(); },
  };
}
