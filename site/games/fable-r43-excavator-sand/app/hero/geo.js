// 形を作る小道具：側面形の押し出し・上面形の押し出し・結合・頂点色。
// リンクの局所座標 (p, q) は three の (−Z, +Y)、横は +X。rotation.x = 角度 で p 軸がその向きになる。
export function createGeo(THREE) {
  const col = new THREE.Color();

  function shapeOf(pts) {
    const s = new THREE.Shape();
    for (let i = 0; i < pts.length; i++) (i ? s.lineTo(pts[i][0], pts[i][1]) : s.moveTo(pts[i][0], pts[i][1]));
    s.closePath();
    return s;
  }
  function extrude(pts, depth, bevel) {
    const b = Math.max(0, Math.min(bevel || 0, depth / 2 - 1e-4));
    const g = new THREE.ExtrudeGeometry(shapeOf(pts), {
      depth: depth - 2 * b, steps: 1, curveSegments: 2,
      bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelOffset: -b, bevelSegments: 1,
    });
    g.translate(0, 0, -(depth - 2 * b) / 2);
    return g;
  }
  // 側面形 (p, q) を横幅 width で押し出す（中心の横位置 cx）
  function plate(pts, width, bevel = 0, cx = 0) {
    const g = extrude(pts, width, bevel);
    g.rotateY(Math.PI / 2);
    if (cx) g.translate(cx, 0, 0);
    return g;
  }
  // 上面形 (x, 前) を y0 から高さ h で押し出す
  function slab(pts, y0, h, bevel = 0) {
    const g = extrude(pts, h, bevel);
    g.rotateX(-Math.PI / 2);
    g.translate(0, y0 + h / 2, 0);
    return g;
  }
  // 角丸の四角（角ごとの半径 [左下, 右下, 右上, 左上]）
  function roundRect(x0, y0, x1, y1, r, seg = 3) {
    const rr = typeof r === 'number' ? [r, r, r, r] : r;
    const pts = [];
    const corner = (cx, cy, rad, a0) => {
      if (rad <= 1e-5) { pts.push([cx, cy]); return; }
      for (let i = 0; i <= seg; i++) { const a = a0 + (i / seg) * (Math.PI / 2); pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]); }
    };
    corner(x0 + rr[0], y0 + rr[0], rr[0], Math.PI);
    corner(x1 - rr[1], y0 + rr[1], rr[1], -Math.PI / 2);
    corner(x1 - rr[2], y1 - rr[2], rr[2], 0);
    corner(x0 + rr[3], y1 - rr[3], rr[3], Math.PI / 2);
    return pts;
  }
  function arc(cx, cy, r, a0, a1, seg, out = []) {
    for (let i = 0; i <= seg; i++) { const a = a0 + ((a1 - a0) * i) / seg; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return out;
  }
  function box(w, h, d, x = 0, y = 0, z = 0) {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(x, y, z);
    return g;
  }
  // 横（X 軸）向きのピン。リンク座標 (p, q) に置く
  function pin(r, len, p, q, cx = 0, seg = 10) {
    const g = new THREE.CylinderGeometry(r, r, len, seg);
    g.rotateZ(Math.PI / 2);
    g.translate(cx, q, -p);
    return g;
  }
  function cylY(r0, r1, h, seg, x = 0, y = 0, z = 0) {
    const g = new THREE.CylinderGeometry(r1, r0, h, seg);
    g.translate(x, y + h / 2, z);
    return g;
  }
  function paint(g, hex) {
    col.set(hex);
    const n = g.attributes.position.count;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = col.r; a[i * 3 + 1] = col.g; a[i * 3 + 2] = col.b; }
    g.setAttribute('color', new THREE.BufferAttribute(a, 3));
    return g;
  }
  // 結合（非インデックス化して連結）。元の形は dispose する
  function merge(list, withColor = false) {
    const parts = [];
    let total = 0;
    for (const g0 of list) {
      const g = g0.index ? g0.toNonIndexed() : g0;
      if (g !== g0) g0.dispose();
      if (!g.attributes.normal) g.computeVertexNormals();
      parts.push(g);
      total += g.attributes.position.count;
    }
    const pos = new Float32Array(total * 3), nor = new Float32Array(total * 3), uv = new Float32Array(total * 2);
    const colr = withColor ? new Float32Array(total * 3).fill(1) : null;
    let o = 0;
    for (const g of parts) {
      const n = g.attributes.position.count;
      pos.set(g.attributes.position.array.subarray(0, n * 3), o * 3);
      nor.set(g.attributes.normal.array.subarray(0, n * 3), o * 3);
      if (g.attributes.uv) uv.set(g.attributes.uv.array.subarray(0, n * 2), o * 2);
      if (colr && g.attributes.color) colr.set(g.attributes.color.array.subarray(0, n * 3), o * 3);
      o += n;
      g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    if (colr) out.setAttribute('color', new THREE.BufferAttribute(colr, 3));
    out.computeBoundingSphere();
    return out;
  }
  return { plate, slab, roundRect, arc, box, pin, cylY, paint, merge, extrude };
}
