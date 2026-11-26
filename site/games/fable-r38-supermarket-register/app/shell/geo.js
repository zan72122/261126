// 小さな形の道具：いくつかの形を、行列と頂点色をつけて1つの BufferGeometry にまとめる（draw call を減らす）。
export function mergeParts(THREE, parts, { uv = false } = {}) {
  let count = 0;
  const prepared = parts.map((p) => {
    let g = p.geo.index ? p.geo.toNonIndexed() : p.geo.clone();
    if (p.matrix) g.applyMatrix4(p.matrix);
    count += g.attributes.position.count;
    return { g, color: p.color };
  });
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const uvs = uv ? new Float32Array(count * 2) : null;
  const c = new THREE.Color();
  let o = 0;
  for (const { g, color } of prepared) {
    const n = g.attributes.position.count;
    pos.set(g.attributes.position.array, o * 3);
    if (g.attributes.normal) nor.set(g.attributes.normal.array, o * 3);
    c.set(color === undefined ? 0xffffff : color);
    for (let i = 0; i < n; i++) { col[(o + i) * 3] = c.r; col[(o + i) * 3 + 1] = c.g; col[(o + i) * 3 + 2] = c.b; }
    if (uvs && g.attributes.uv) uvs.set(g.attributes.uv.array, o * 2);
    o += n;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  if (uvs) out.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  out.computeBoundingSphere();
  return out;
}

// 位置・回転(オイラー)・拡大から行列を作る
export function mat(THREE, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  const m = new THREE.Matrix4();
  m.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));
  return m;
}

// 三角形数（InstancedMesh は数を掛ける）
export function triCount(obj, onlyVisible = true) {
  let tris = 0;
  obj.traverse((o) => {
    if (onlyVisible) { let p = o; while (p) { if (!p.visible) return; p = p.parent; } }
    if (!o.isMesh || !o.geometry) return;
    const g = o.geometry;
    const n = g.index ? g.index.count : (g.attributes.position ? g.attributes.position.count : 0);
    let t = n / 3;
    if (g.drawRange && g.drawRange.count !== Infinity) t = Math.min(t, g.drawRange.count / 3);
    if (o.isInstancedMesh) t *= o.count;
    tris += t;
  });
  return Math.round(tris);
}
