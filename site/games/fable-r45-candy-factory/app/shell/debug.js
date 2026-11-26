// ?debug=1 のオーバーレイ：tier・canvas・fps(平均/p95)・draw call・三角形・テクスチャ数と見積もりGPUメモリ・エラー
// エラーの記録は debug でなくても常に行う（window.__game.errors）。

export const errors = [];
export function captureErrors() {
  const push = (msg) => { errors.push(String(msg).slice(0, 300)); if (errors.length > 50) errors.shift(); };
  window.addEventListener('error', (e) => push(e.message || e.error || 'error'));
  window.addEventListener('unhandledrejection', (e) => push('promise: ' + (e.reason && e.reason.message || e.reason)));
  const ce = console.error.bind(console);
  console.error = (...a) => { push(a.map((x) => (x && x.message) || x).join(' ')); ce(...a); };
  return push;
}

const mip = (t) => (t.generateMipmaps !== false && t.minFilter !== 1006 && t.minFilter !== 1003 ? 4 / 3 : 1);

// 画面全体の GPU メモリ見積もり（バイト）
export function estimateGPU(renderer, scene, hero) {
  const texSeen = new Map();
  const geoSeen = new Set();
  let geoBytes = 0;
  const addTex = (t) => {
    if (!t || !t.isTexture || texSeen.has(t.uuid)) return;
    const img = t.image || (t.source && t.source.data);
    const w = (img && (img.width || img.videoWidth)) || 0, h = (img && (img.height || img.videoHeight)) || 0;
    texSeen.set(t.uuid, { name: t.name || '(no name)', w, h, bytes: Math.round(w * h * 4 * mip(t)) });
  };
  scene.traverse((o) => {
    if (o.geometry && !geoSeen.has(o.geometry.uuid)) {
      geoSeen.add(o.geometry.uuid);
      const g = o.geometry;
      for (const k in g.attributes) geoBytes += g.attributes[k].array.byteLength;
      if (g.index) geoBytes += g.index.array.byteLength;
    }
    if (o.isInstancedMesh) geoBytes += o.instanceMatrix.array.byteLength;
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    for (const m of mats) for (const k in m) { const v = m[k]; if (v && v.isTexture) addTex(v); }
  });
  // hero が報告する render target 等（材質に付いていない物）
  let heroExtra = 0;
  if (hero) {
    const hs = hero.getStats();
    const names = new Set([...texSeen.values()].map((x) => x.name));
    for (const t of hs.textures || []) if (!names.has(t.name)) { heroExtra += t.bytes || 0; texSeen.set('hero:' + t.name, { name: t.name, w: t.width, h: t.height, bytes: t.bytes }); }
  }
  const c = renderer.domElement;
  // 描画バッファ：色 RGBA8 ×2（前後）＋ 深度 24/8
  const fb = c.width * c.height * (4 * 2 + 4);
  const texBytes = [...texSeen.values()].reduce((a, x) => a + x.bytes, 0);
  return { total: texBytes + geoBytes + fb, texBytes, geoBytes, fb, textures: [...texSeen.values()], heroExtra };
}

export function createDebug(renderer, scene, getInfo) {
  const el = document.createElement('div');
  el.id = 'debug';
  el.style.cssText = 'position:fixed;left:6px;top:6px;z-index:9;font:11px/1.35 ui-monospace,Menlo,monospace;color:#fff;background:rgba(40,20,40,.72);padding:6px 8px;border-radius:8px;pointer-events:none;white-space:pre;max-width:60vw';
  document.body.appendChild(el);
  const frames = new Float32Array(240);
  let fi = 0, fn = 0, acc = 0;
  let last = { tri: 0, calls: 0 };
  const api = {
    el,
    frame(dtMs) {
      frames[fi] = dtMs; fi = (fi + 1) % frames.length; fn = Math.min(frames.length, fn + 1);
      last = { tri: renderer.info.render.triangles, calls: renderer.info.render.calls };
      acc += dtMs;
      if (acc > 500) { acc = 0; api.draw(); }
    },
    fps() {
      if (!fn) return { avg: 0, p95: 0 };
      const a = Array.from(frames.subarray(0, fn)).sort((x, y) => x - y);
      const mean = a.reduce((s, x) => s + x, 0) / a.length;
      const p95ms = a[Math.min(a.length - 1, Math.floor(a.length * 0.95))];
      return { avg: 1000 / mean, p95: 1000 / p95ms, p95ms };
    },
    stats() {
      const info = getInfo();
      const gpu = estimateGPU(renderer, scene, info.hero);
      const hs = info.hero ? info.hero.getStats() : { triangles: 0, drawCalls: 0, textures: [] };
      return {
        tier: info.tier, canvas: [renderer.domElement.width, renderer.domElement.height], dpr: renderer.getPixelRatio(),
        fps: api.fps(), drawCalls: last.calls, triangles: last.tri, heroTriangles: hs.triangles, heroDrawCalls: hs.drawCalls,
        textures: renderer.info.memory.textures, geometries: renderer.info.memory.geometries,
        gpuMiB: gpu.total / 1048576, gpu, errors: errors.slice(-3), phase: info.phase, stage: info.stage,
      };
    },
    draw() {
      const s = api.stats();
      el.textContent =
        `tier ${s.tier}  canvas ${s.canvas[0]}×${s.canvas[1]} (dpr ${s.dpr.toFixed(2)})\n` +
        `fps ${s.fps.avg.toFixed(0)} avg / ${s.fps.p95.toFixed(0)} p95\n` +
        `draw ${s.drawCalls}  tris ${s.triangles} (hero ${s.heroTriangles})\n` +
        `tex ${s.textures} (${s.gpu.textures.length} est)  GPU≈${s.gpuMiB.toFixed(1)} MiB\n` +
        `  tex ${(s.gpu.texBytes / 1048576).toFixed(1)} geo ${(s.gpu.geoBytes / 1048576).toFixed(1)} fb ${(s.gpu.fb / 1048576).toFixed(1)}\n` +
        `phase ${s.phase} / hero ${s.stage}\n` +
        (s.errors.length ? 'ERR ' + s.errors.join('\nERR ') : 'errors 0');
    },
  };
  return api;
}
