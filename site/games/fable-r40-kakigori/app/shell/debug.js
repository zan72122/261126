// ?debug=1 の小さなオーバーレイ：tier・画面と canvas・描画解像度の倍率・カメラ（場面・主役が短い辺の何%か）・fps(平均/p95)・draw call・三角形・テクスチャ数・GPU 見積・エラー・最初に触れるまでの時間。
import { triCount } from './util.js';

export function createDebug(enabled) {
  const errors = [];
  const pushErr = (m) => { errors.push(String(m).slice(0, 160)); if (errors.length > 20) errors.shift(); };
  window.addEventListener('error', (e) => pushErr(e.message || e));
  window.addEventListener('unhandledrejection', (e) => pushErr('promise: ' + (e.reason && e.reason.message || e.reason)));
  const notes = [];
  const note = (m) => { notes.push(String(m)); if (notes.length > 5) notes.shift(); };
  const ft = new Float32Array(180); let fi = 0, fn = 0, acc = 0;
  let el = null, last = {};
  if (enabled) {
    el = document.createElement('div');
    el.style.cssText = 'position:fixed;left:max(6px,env(safe-area-inset-left));top:max(6px,env(safe-area-inset-top));z-index:10;font:11px/1.35 ui-monospace,Menlo,monospace;color:#fff;background:rgba(0,0,0,.55);padding:5px 7px;border-radius:6px;pointer-events:none;white-space:pre;max-width:60vw;overflow:hidden';
    document.body.appendChild(el);
  }

  // GPU メモリ見積：テクスチャ（同じ画像は1回、ミップマップ ×4/3）＋頂点バッファ＋フレームバッファ
  function estimate(renderer, scene) {
    const sources = new Map(); const geos = new Set();
    scene.traverse((o) => {
      if (o.geometry) geos.add(o.geometry);
      const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of ms) for (const k in m) {
        const t = m[k];
        if (t && t.isTexture && t.source) {
          const img = t.image || {}; const w = img.width || 0, h = img.height || 0;
          const bpp = t.isDataTexture && t.type !== 1009 ? 16 : 4;
          const mip = t.generateMipmaps !== false && t.minFilter !== 1006 && t.minFilter !== 1003 ? 4 / 3 : 1;
          sources.set(t.source.uuid + ':' + t.wrapS + t.wrapT, w * h * bpp * mip);
        }
      }
    });
    let texB = 0; for (const v of sources.values()) texB += v;
    let geoB = 0;
    for (const g of geos) {
      for (const k in g.attributes) geoB += g.attributes[k].array.byteLength;
      if (g.index) geoB += g.index.array.byteLength;
    }
    scene.traverse((o) => { if (o.isInstancedMesh) geoB += o.instanceMatrix.array.byteLength; });
    const c = renderer.domElement;
    const fbB = c.width * c.height * (4 * 2 + 4); // 色×2（表示と描画）＋深度
    return { textures: sources.size, texMiB: texB / 1048576, geoMiB: geoB / 1048576, fbMiB: fbB / 1048576, totalMiB: (texB + geoB + fbB) / 1048576 };
  }

  function frame(dt, renderer, scene, infoFn) {
    if (!enabled) return; // ?debug=1 の無い時は数えない
    ft[fi] = dt; fi = (fi + 1) % ft.length; fn = Math.min(ft.length, fn + 1);
    acc += dt;
    if (acc < 0.5) return;
    acc = 0;
    const info = infoFn();
    const arr = Array.from(ft.slice(0, fn)).sort((a, b) => a - b);
    const avg = arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
    const p95 = arr[Math.floor(arr.length * 0.95)] || 0;
    const ri = renderer.info.render, est = estimate(renderer, scene);
    const heroTris = info.heroObjs ? info.heroObjs.reduce((n, o) => n + triCount(o), 0) : 0;
    last = {
      tier: info.tier, canvas: renderer.domElement.width + '×' + renderer.domElement.height, pr: renderer.getPixelRatio(),
      fps: avg > 0 ? 1 / avg : 0, p95ms: p95 * 1000, calls: ri.calls, tris: ri.triangles, heroTris,
      textures: est.textures, glTextures: renderer.info.memory.textures, geometries: renderer.info.memory.geometries,
      gpuMiB: est.totalMiB, texMiB: est.texMiB, geoMiB: est.geoMiB, fbMiB: est.fbMiB, errors: errors.length,
      scene: info.scene || '', readyMs: info.readyMs || 0, touch: navigator.maxTouchPoints || 0,
      renderScale: info.renderScale || 1, view: info.view ? info.view.w + '×' + info.view.h : '',
      shot: info.cam ? info.cam.shot : '', heroFrac: info.cam ? info.cam.frac : 0, camDist: info.cam ? info.cam.dist : 0, camPitch: info.cam ? info.cam.pitch : 0,
    };
    if (el) {
      el.textContent =
        `tier ${last.tier} (touch ${last.touch})  view ${last.view}  canvas ${last.canvas} @${last.pr.toFixed(2)} (scale ${last.renderScale})\n` +
        `cam ${last.shot}  hero ${(last.heroFrac * 100).toFixed(0)}% of short side  dist ${last.camDist.toFixed(2)}m  pitch ${last.camPitch.toFixed(0)}°\n` +
        `ready ${Math.round(last.readyMs)}ms\n` +
        `fps ${last.fps.toFixed(1)}  p95 ${last.p95ms.toFixed(1)}ms\n` +
        `calls ${last.calls}  tris ${last.tris} (hero ${heroTris})\n` +
        `tex ${last.textures} (gl ${last.glTextures})  geo ${last.geometries}\n` +
        `GPU≈${last.gpuMiB.toFixed(1)}MiB (tex ${last.texMiB.toFixed(1)} geo ${last.geoMiB.toFixed(1)} fb ${last.fbMiB.toFixed(1)})\n` +
        `${last.scene}\n` +
        (errors.length ? 'ERR ' + errors.slice(-3).join('\n    ') : 'errors 0') + (notes.length ? '\n' + notes.slice(-2).join('\n') : '');
    }
  }

  return { frame, pushErr, note, notes, errors, get stats() { return last; } };
}
