// ?debug=1 の小さなオーバーレイ：tier・canvas・fps(平均/p95)・draw call・三角形・テクスチャと見積りGPUメモリ・エラー
export function estimateGpu(THREE, renderer, scene, tier) {
  const texs = new Set(), geos = new Set();
  const addTex = v => { if (v && v.isTexture) texs.add(v); };
  scene.traverse(o => {
    if (o.geometry) geos.add(o.geometry);
    const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of mats) {
      for (const k in m) addTex(m[k]);
      if (m.uniforms) for (const k in m.uniforms) addTex(m.uniforms[k] && m.uniforms[k].value);
    }
  });
  let texBytes = 0;
  for (const t of texs) {
    const img = t.image; if (!img) continue;
    const w = img.width || 0, h = img.height || 0;
    const mip = t.generateMipmaps !== false && t.minFilter !== THREE.NearestFilter && t.minFilter !== THREE.LinearFilter ? 4 / 3 : 1;
    texBytes += w * h * 4 * mip;
  }
  // clone() した Texture は同じ画像を共有するので、画像ごとに数える
  const imgs = new Map();
  for (const t of texs) if (t.image) imgs.set(t.image, t);
  let texBytesUnique = 0;
  for (const [img, t] of imgs) {
    const w = img.width || 0, h = img.height || 0;
    const mip = t.generateMipmaps !== false ? 4 / 3 : 1;
    texBytesUnique += w * h * 4 * mip;
  }
  let geoBytes = 0;
  for (const gm of geos) {
    for (const k in gm.attributes) geoBytes += gm.attributes[k].array.byteLength;
    if (gm.index) geoBytes += gm.index.array.byteLength;
  }
  scene.traverse(o => { if (o.isInstancedMesh) geoBytes += o.instanceMatrix.array.byteLength + (o.instanceColor ? o.instanceColor.array.byteLength : 0); });
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const px = size.x * size.y;
  const samples = tier.antialias ? 4 : 1;
  // 色(4B)+深度ステンシル(4B) × サンプル数、MSAA なら解決用1面、表示用2面
  const fbBytes = px * 8 * samples + (samples > 1 ? px * 4 : 0) + px * 4 * 2;
  return {
    textures: imgs.size, texMiB: texBytesUnique / 1048576, geoMiB: geoBytes / 1048576, fbMiB: fbBytes / 1048576,
    totalMiB: (texBytesUnique + geoBytes + fbBytes) / 1048576, texObjects: texs.size,
  };
}

export function countTriangles(root) {
  let tris = 0, calls = 0;
  root.traverseVisible(o => {
    if (!(o.isMesh || o.isLine || o.isPoints || o.isSprite)) return;
    if (o.isSprite) { tris += 2; calls++; return; }
    const gm = o.geometry; if (!gm) return;
    let n = gm.index ? gm.index.count : (gm.attributes.position ? gm.attributes.position.count : 0);
    n = Math.min(n, gm.drawRange.count === Infinity ? n : gm.drawRange.count);
    const inst = o.isInstancedMesh ? o.count : (gm.isInstancedBufferGeometry ? (gm.instanceCount === Infinity ? 1 : gm.instanceCount) : 1);
    const groups = Array.isArray(o.material) ? Math.max(1, gm.groups.length) : 1;
    if (o.isMesh) tris += (n / 3) * inst;
    calls += groups;
  });
  return { tris: Math.round(tris), calls };
}

export function createDebug(THREE, { renderer, scene, tierRef, heroRoot, getState, boot }) {
  const el = document.createElement('div');
  el.id = 'debug';
  el.style.cssText = 'position:fixed;left:6px;top:6px;z-index:10;background:rgba(0,0,0,.62);color:#e8ffe8;font:11px/1.35 ui-monospace,Menlo,monospace;padding:6px 8px;border-radius:6px;pointer-events:none;white-space:pre;max-width:46vw';
  document.body.appendChild(el);
  const dts = [];
  const errors = [];
  let acc = 0;
  const api = {
    errors,
    error(msg) { errors.push(String(msg).slice(0, 160)); if (errors.length > 4) errors.shift(); },
    frame(dt, info) {
      dts.push(dt); if (dts.length > 180) dts.shift();
      acc += dt; if (acc < 0.5) return; acc = 0;
      const sorted = dts.slice().sort((a, b) => a - b);
      const avg = dts.reduce((a, b) => a + b, 0) / dts.length;
      const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
      const g = estimateGpu(THREE, renderer, scene, tierRef());
      const h = countTriangles(heroRoot());
      const cv = renderer.domElement;
      const s = getState();
      el.textContent =
        `tier ${tierRef().name}  canvas ${cv.width}x${cv.height} (pr ${renderer.getPixelRatio().toFixed(2)})  ready ${boot ? boot() : '-'}ms\n` +
        `fps ${(1 / avg).toFixed(0)} avg / ${(1 / p95).toFixed(0)} p95\n` +
        `draw ${info.calls}  tris ${info.triangles}  (hero≈${h.tris} / ${h.calls} calls)\n` +
        `tex ${g.textures} img (${g.texObjects} obj) ${g.texMiB.toFixed(1)}MiB  geo ${g.geoMiB.toFixed(1)}MiB  fb ${g.fbMiB.toFixed(1)}MiB\n` +
        `GPU est ${g.totalMiB.toFixed(1)} MiB / 128\n` +
        `stage ${s.stage} r ${(s.radius || 0).toFixed(3)} gives ${s.gives} rack ${s.rack} ${s.customer || '-'}\n` +
        (errors.length ? 'ERR ' + errors.join('\nERR ') : 'errors 0');
    },
  };
  return api;
}
