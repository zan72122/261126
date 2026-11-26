// ?debug=1 overlay: tier, canvas, fps (avg / p95), draw calls, triangles, textures, estimated GPU memory, errors.
import { countTriangles } from './util.js';

export function createDebug({ enabled, renderer, scene, hud, heroRoot, tier }) {
  const errors = [];
  const frames = new Float32Array(240); let fi = 0, fn = 0;
  let el = null, acc = 0, cache = { tex: 0, texMiB: 0, geoMiB: 0 }, cacheT = 1e9;
  const info = { startupMs: 0, tier, calls: 0, tris: 0, heroTris: 0, fpsAvg: 0, fpsP95: 0, texCount: 0, gpuMiB: 0, texMiB: 0, geoMiB: 0, fbMiB: 0, canvas: '', scale: 1 };

  function pushErr(msg) { errors.push(String(msg).slice(0, 160)); if (errors.length > 6) errors.shift(); }
  window.addEventListener('error', (e) => pushErr(e.message || e));
  window.addEventListener('unhandledrejection', (e) => pushErr('promise: ' + (e.reason && e.reason.message || e.reason)));
  const origErr = console.error.bind(console);
  console.error = (...a) => { pushErr(a.map(String).join(' ')); origErr(...a); };

  if (enabled) {
    el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:calc(6px + env(safe-area-inset-top));left:calc(6px + env(safe-area-inset-left));z-index:10;font:11px/1.35 ui-monospace,Menlo,monospace;color:#fff;background:rgba(0,0,0,.55);padding:6px 8px;border-radius:6px;pointer-events:none;white-space:pre;max-width:46vw;overflow:hidden';
    document.body.appendChild(el);
  }

  function estimateMemory() {
    const texSeen = new Set(), geoSeen = new Set(); let texB = 0, geoB = 0;
    const addTex = (t) => {
      if (!t || texSeen.has(t.uuid)) return; texSeen.add(t.uuid);
      const img = t.image; const w = (img && (img.width || img.videoWidth)) || 0, h = (img && (img.height || img.videoHeight)) || 0;
      texB += w * h * 4 * (t.generateMipmaps !== false ? 4 / 3 : 1);
    };
    const visit = (o) => {
      if (o.material) for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        for (const k of ['map', 'alphaMap', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'bumpMap', 'lightMap', 'specularMap']) addTex(m[k]);
        if (m.uniforms) for (const u of Object.values(m.uniforms)) if (u && u.value && u.value.isTexture) addTex(u.value);
      }
      const g = o.geometry;
      if (g && !geoSeen.has(g.uuid)) {
        geoSeen.add(g.uuid);
        for (const a of Object.values(g.attributes)) geoB += a.array ? a.array.byteLength : 0;
        if (g.index) geoB += g.index.array.byteLength;
      }
      if (o.isInstancedMesh) { geoB += o.instanceMatrix.array.byteLength; if (o.instanceColor) geoB += o.instanceColor.array.byteLength; }
    };
    scene.traverse(visit); hud.traverse(visit);
    return { tex: texSeen.size, texMiB: texB / 1048576, geoMiB: geoB / 1048576 };
  }

  function frame(dtMs, t) {
    frames[fi] = dtMs; fi = (fi + 1) % frames.length; fn = Math.min(fn + 1, frames.length);
    acc += dtMs; cacheT += dtMs;
    if (acc < 400) return;
    acc = 0;
    const arr = Array.from(frames.slice(0, fn)).sort((a, b) => a - b);
    const avg = arr.reduce((a, b) => a + b, 0) / Math.max(arr.length, 1);
    const p95 = arr[Math.min(arr.length - 1, Math.floor(arr.length * 0.95))] || avg;
    info.fpsAvg = avg > 0 ? 1000 / avg : 0; info.fpsP95 = p95 > 0 ? 1000 / p95 : 0;
    const c = renderer.domElement;
    info.canvas = `${c.width}×${c.height} @${(renderer.getPixelRatio() / info.scale).toFixed(2)}${info.scale < 1 ? ' ×' + info.scale : ''}`;
    info.fbMiB = (c.width * c.height * 12) / 1048576; // color + depth/stencil + displayed buffer, no MSAA
    if (cacheT > 2000) { cache = estimateMemory(); cacheT = 0; info.heroTris = countTriangles(heroRoot); }
    info.texCount = renderer.info.memory.textures; info.texMiB = cache.texMiB; info.geoMiB = cache.geoMiB;
    info.gpuMiB = info.fbMiB + cache.texMiB + cache.geoMiB;
    if (el) {
      el.textContent = `tier ${info.tier}   canvas ${info.canvas}   start ${(info.startupMs / 1000).toFixed(2)}s\n` +
        `fps ${info.fpsAvg.toFixed(0)} avg / ${info.fpsP95.toFixed(0)} p95\n` +
        `draw ${info.calls}   tris ${info.tris} (hero ${info.heroTris})\n` +
        `tex ${info.texCount} (${cache.tex} in scene)  GPU≈${info.gpuMiB.toFixed(1)} MiB\n` +
        `  tex ${info.texMiB.toFixed(1)} geo ${info.geoMiB.toFixed(1)} fb ${info.fbMiB.toFixed(1)}\n` +
        (extra ? extra() + '\n' : '') +
        (errors.length ? 'errors:\n' + errors.join('\n') : 'errors: none');
    }
  }
  let extra = null;
  return {
    info, errors, frame,
    setRenderInfo(calls, tris) { info.calls = calls; info.tris = tris; },
    setExtra(f) { extra = f; },
    warn(msg) { pushErr('warn: ' + msg); console.warn(msg); },
    setTier(t) { info.tier = t; },
    setScale(k) { info.scale = k; }, // internal resolution step-down (1, 0.85, 0.75)
    setStartup(ms) { info.startupMs = ms; }, // navigation start → first frame (cars, ramp and wheel can be touched)
  };
}
