// Error capture (always) + ?debug=1 overlay: tier, canvas, fps avg/p95, draw calls, triangles, textures, GPU estimate, errors.
import { THREE } from './util.js';

export const errors = [];
window.__errors = errors;
function pushErr(msg) { errors.push(String(msg).slice(0, 200)); if (errors.length > 20) errors.shift(); }
window.addEventListener('error', (e) => pushErr(e.message || e));
window.addEventListener('unhandledrejection', (e) => pushErr('promise: ' + (e.reason && e.reason.message ? e.reason.message : e.reason)));
const origErr = console.error.bind(console);
console.error = (...a) => { pushErr(a.map((x) => (x && x.message) || x).join(' ')); origErr(...a); };

// Estimate GPU memory by walking the scene: geometry buffers, textures (with mips), render targets, framebuffer.
export function estimateGpu(scene, renderer, extraTargets = []) {
  const geos = new Set(), texs = new Set();
  let geoBytes = 0, texBytes = 0, tris = 0;
  scene.traverse((o) => {
    if (!o.isMesh && !o.isPoints && !o.isLine) return;
    const g = o.geometry;
    if (g && !geos.has(g)) {
      geos.add(g);
      for (const k in g.attributes) geoBytes += g.attributes[k].array.byteLength;
      if (g.index) geoBytes += g.index.array.byteLength;
    }
    if (o.isInstancedMesh) { geoBytes += o.instanceMatrix.array.byteLength; if (o.instanceColor) geoBytes += o.instanceColor.array.byteLength; }
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      if (!m) continue;
      for (const k of ['map', 'normalMap', 'roughnessMap', 'bumpMap', 'alphaMap', 'emissiveMap', 'aoMap', 'matcap', 'displacementMap']) {
        const t = m[k];
        if (t && !texs.has(t)) texs.add(t);
      }
      if (m.uniforms) for (const k in m.uniforms) { const v = m.uniforms[k].value; if (v && v.isTexture && !texs.has(v)) texs.add(v); }
    }
  });
  const list = [];
  for (const t of texs) {
    const img = t.image;
    const w = (img && (img.width || img.videoWidth)) || 0, h = (img && (img.height || img.videoHeight)) || 0;
    const mip = t.generateMipmaps && t.minFilter !== THREE.LinearFilter && t.minFilter !== THREE.NearestFilter ? 4 / 3 : 1;
    const b = w * h * 4 * mip;
    texBytes += b;
    list.push({ name: t.name || (img && img.src ? 'img' : 'canvas'), w, h });
  }
  let rtBytes = 0;
  for (const rt of extraTargets) rtBytes += rt.width * rt.height * (4 + (rt.depthBuffer ? 4 : 0));
  const c = renderer.domElement;
  const fbBytes = c.width * c.height * (4 * 2 + 4);
  return { geoBytes, texBytes, rtBytes, fbBytes, total: geoBytes + texBytes + rtBytes + fbBytes, textures: list.length, texList: list, geometries: geos.size };
}

export class DebugOverlay {
  constructor(enabled) {
    this.enabled = enabled;
    this.frames = [];
    this.last = 0;
    this.gpu = null;
    this.peak = { calls: 0, tris: 0 };
    if (!enabled) return;
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:calc(6px + env(safe-area-inset-left));top:calc(6px + env(safe-area-inset-top));z-index:9;background:rgba(0,0,0,.62);color:#e8ffe8;font:11px/1.35 ui-monospace,Menlo,monospace;padding:6px 8px;border-radius:6px;pointer-events:none;white-space:pre;max-width:46vw;';
    document.body.appendChild(d);
    this.el = d;
    const b = document.createElement('button');
    b.textContent = 'lose ctx';
    b.style.cssText = 'position:fixed;right:calc(6px + env(safe-area-inset-right));top:calc(6px + env(safe-area-inset-top));z-index:9;font:11px monospace;';
    b.onclick = () => window.__game && window.__game.simulateContextLoss();
    document.body.appendChild(b);
  }

  frame(dt) { this.frames.push(dt); if (this.frames.length > 180) this.frames.shift(); }

  stats() {
    const f = this.frames.slice().sort((a, b) => a - b);
    if (!f.length) return { avg: 0, p95: 0 };
    const mean = f.reduce((a, b) => a + b, 0) / f.length;
    return { avg: 1 / mean, p95ms: f[Math.min(f.length - 1, Math.floor(f.length * 0.95))] * 1000 };
  }

  update(now, info) {
    if (info.calls > this.peak.calls) this.peak.calls = info.calls;
    if (info.tris > this.peak.tris) this.peak.tris = info.tris;
    if (!this.enabled || now - this.last < 0.25) return;
    this.last = now;
    const s = this.stats();
    const g = info.gpu;
    const MiB = (b) => (b / 1048576).toFixed(1);
    this.el.textContent =
      `tier ${info.tier}  canvas ${info.cw}x${info.ch} @${info.pr.toFixed(2)} x render ${info.rs.toFixed(2)}\n` +
      (info.css ? `screen ${info.css}\n` : '') +
      (info.cam ? `camera ${info.cam.mode}  cake ${(info.cam.frac * 100).toFixed(0)}% of short side  d ${info.cam.d.toFixed(1)}  pitch ${info.cam.e.toFixed(0)}°\n` : '') +
      `fps avg ${s.avg.toFixed(0)}  p95 ${s.p95ms.toFixed(1)}ms\n` +
      `draw ${info.calls} (peak ${this.peak.calls})  tris ${info.tris} (peak ${this.peak.tris})\n` +
      `hero tris ${info.hero.triangles}  calls ${info.hero.drawCalls}  tex ${info.hero.textures}\n` +
      (g ? `textures ${g.textures} (gl ${info.glTex})  GPU≈${MiB(g.total)}MiB\n  tex ${MiB(g.texBytes)} geo ${MiB(g.geoBytes)} rt ${MiB(g.rtBytes)} fb ${MiB(g.fbBytes)}\n` : '') +
      `scene ${info.scene}  round ${info.round}  ctx ${info.ctx}\n` +
      `errors ${errors.length}${errors.length ? '\n ' + errors.slice(-3).join('\n ') : ''}`;
  }
}

// ---- measurement helpers (debug / smoke only; never run in normal play) ----

// Scan every geometry and instance buffer in the scene for NaN / Infinity. Returns the number of bad floats.
export function nanScan(scene) {
  let bad = 0, checked = 0;
  const seen = new Set();
  const scan = (arr) => { if (!arr || seen.has(arr)) return; seen.add(arr); for (let i = 0; i < arr.length; i++) { const x = arr[i]; if (x !== x || x === Infinity || x === -Infinity) bad++; } checked += arr.length; };
  scene.traverse((o) => {
    if (o.geometry) { for (const k in o.geometry.attributes) { const a = o.geometry.attributes[k].array; if (a instanceof Float32Array) scan(a); } }
    if (o.isInstancedMesh) { scan(o.instanceMatrix.array); if (o.instanceColor) scan(o.instanceColor.array); }
    if (o.isObject3D) { const e = o.matrixWorld.elements; for (let i = 0; i < 16; i++) if (!Number.isFinite(e[i])) bad++; }
  });
  return { bad, checked };
}

// Fill estimate: how many screen pixels end up shaded by each material class (opaque, after depth test —
// what a tile-based GPU with hidden-surface removal such as the iPad's actually shades), plus the number of
// transparent fragments drawn on top (blended layers). Renders two cheap passes into an offscreen target.
export function measureFill(renderer, scene, camera) {
  const c = renderer.domElement, w = c.width, h = c.height;
  const rt = new THREE.WebGLRenderTarget(w, h, { depthBuffer: true });
  const cls = (m) => (m.isMeshStandardMaterial ? 0 : m.isMeshLambertMaterial ? 1 : m.isMeshBasicMaterial ? 2 : 3);
  const ids = [new THREE.Color(1, 0, 0), new THREE.Color(0, 1, 0), new THREE.Color(0, 0, 1), new THREE.Color(1, 1, 0)];
  const flat = ids.map((col) => new THREE.MeshBasicMaterial({ color: col }));
  const depthOnly = new THREE.MeshBasicMaterial({ colorWrite: false });
  const layer = new THREE.MeshBasicMaterial({ color: new THREE.Color(4 / 255, 0, 0), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const saved = [];
  const isTr = (m) => m.transparent || m.blending !== THREE.NormalBlending;
  scene.traverse((o) => { if ((o.isMesh || o.isPoints || o.isLine) && o.material) saved.push([o, o.material, o.visible]); });
  const bg = scene.background, cc = renderer.getClearColor(new THREE.Color()), ca = renderer.getClearAlpha(), prevRT = renderer.getRenderTarget();
  scene.background = null;
  renderer.setClearColor(0x000000, 0);
  const px = new Uint8Array(w * h * 4);
  const pass = (pick) => {
    for (const [o, m] of saved) {
      const arr = Array.isArray(m) ? m : [m];
      const mapped = arr.map((mm) => (mm && mm.visible !== false ? pick(mm) : null));
      if (mapped.every((x) => !x)) { o.material = depthOnly; o.visible = false; continue; }
      o.material = Array.isArray(m) ? mapped.map((x) => x || depthOnly) : mapped[0];
    }
    renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene, camera);
    renderer.readRenderTargetPixels(rt, 0, 0, w, h, px);
    for (const [o, m, v] of saved) { o.material = m; o.visible = v; }
  };
  const out = { w, h, opaque: [0, 0, 0, 0], transparentFragments: 0, background: 0 };
  try {
    pass((m) => (isTr(m) ? null : flat[cls(m)]));
    for (let i = 0; i < w * h; i++) {
      const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2];
      if (r > 128 && g > 128) out.opaque[3]++; else if (r > 128) out.opaque[0]++; else if (g > 128) out.opaque[1]++; else if (b > 128) out.opaque[2]++; else out.background++;
    }
    pass((m) => (isTr(m) ? layer : depthOnly));
    let s = 0; for (let i = 0; i < w * h; i++) s += px[i * 4];
    out.transparentFragments = Math.round(s / 4);
  } finally {
    for (const [o, m, v] of saved) { o.material = m; o.visible = v; }
    scene.background = bg; renderer.setClearColor(cc, ca); renderer.setRenderTarget(prevRT);
    rt.dispose(); flat.forEach((m) => m.dispose()); depthOnly.dispose(); layer.dispose();
  }
  return out;
}

// Rough GPU frame-time estimate for the reference device (iPad Pro 12.9" 2020, A12Z, 8-core GPU) from the fill
// measurement. Per-fragment ALU costs are estimates for three.js r187 shaders with this scene's lights
// (1 directional + hemisphere + ambient, no shadows, no env map). Assumes ~30% of the GPU's ~1.1 TFLOPS is usable.
export const FRAG_COST = { standard: 260, lambert: 90, basic: 16, other: 120, transparent: 30 };
export function estimateGpuMs(fill, triangles) {
  const flops = fill.opaque[0] * FRAG_COST.standard + fill.opaque[1] * FRAG_COST.lambert + fill.opaque[2] * FRAG_COST.basic +
    fill.opaque[3] * FRAG_COST.other + fill.transparentFragments * FRAG_COST.transparent;
  const fragMs = flops / (1.1e12 * 0.3) * 1000;
  const vertMs = (triangles * 0.7 * 120) / (1.1e12 * 0.3) * 1000; // ~0.7 unique vertices per triangle, ~120 flops each
  const fixedMs = 0.6;                                            // clears, tile store, driver overhead (guess)
  return { fragMs, vertMs, fixedMs, total: fragMs + vertMs + fixedMs };
}
