// 計測と ?debug=1 のオーバーレイ。三角形・テクスチャ・GPU メモリの見積もりはシーンを辿って数える。
import * as THREE from '../vendor/three/three.module.js';

export function createStats(renderer, scene, tier) {
  const frames = new Float32Array(240);
  let fi = 0, fn = 0;
  const errors = [];
  let lastScene = null, sceneT = 0, cpuAvg = 0;

  function triCount(geo) {
    const idx = geo.index;
    const n = idx ? idx.count : geo.attributes.position ? geo.attributes.position.count : 0;
    const dr = geo.drawRange;
    const c = Math.min(n, dr.count === Infinity ? n : dr.count);
    return Math.floor(c / 3);
  }
  function isHero(o) {
    for (let p = o; p; p = p.parent) if (p.userData && (p.userData.heroRoot || p.userData.heroPart)) return true;
    return false;
  }
  function texBytes(t) {
    const img = t.image;
    let w = 0, h = 0;
    if (img) { w = img.width || img.videoWidth || 0; h = img.height || img.videoHeight || 0; }
    if (!w && img && img.data) { w = img.width; h = img.height; }
    const bpp = t.isDataTexture && t.type === THREE.FloatType ? 16 : 4;
    const mip = t.generateMipmaps !== false && t.minFilter !== THREE.NearestFilter && t.minFilter !== THREE.LinearFilter ? 4 / 3 : 1;
    return w * h * bpp * mip;
  }
  function measureScene() {
    const tris = { hero: 0, other: 0 };
    const texs = new Map(); // source -> {bytes, hero, name, w, h}
    const geos = new Set();
    let geoBytes = 0, meshes = 0, nan = 0;
    scene.traverseVisible((o) => {
      if (!(o.isMesh || o.isPoints || o.isLine || o.isSprite)) return;
      const mat = o.material;
      if (!mat || (Array.isArray(mat) ? false : mat.visible === false)) return;
      const geo = o.geometry;
      meshes++;
      let t = o.isSprite ? 2 : triCount(geo);
      if (o.isInstancedMesh) t *= o.count;
      if (isHero(o)) tris.hero += t; else tris.other += t;
      if (geo && !geos.has(geo)) {
        geos.add(geo);
        // NaN 検査（頂点の位置と法線。描く物だけ）
        for (const k of ['position', 'normal']) {
          const a = geo.attributes[k];
          if (!a) continue;
          const arr = a.array;
          for (let i = 0; i < arr.length; i++) if (arr[i] !== arr[i] || arr[i] === Infinity || arr[i] === -Infinity) { nan++; break; }
        }
        for (const k in geo.attributes) geoBytes += geo.attributes[k].array.byteLength;
        if (geo.index) geoBytes += geo.index.array.byteLength;
      }
      if (o.isInstancedMesh) {
        geoBytes += o.instanceMatrix.array.byteLength + (o.instanceColor ? o.instanceColor.array.byteLength : 0);
        const arr = o.instanceMatrix.array;
        for (let i = 0, n = o.count * 16; i < n; i++) if (!Number.isFinite(arr[i])) { nan++; break; }
      }
      const mats = Array.isArray(mat) ? mat : [mat];
      for (const m of mats) {
        for (const key of ['map', 'normalMap', 'roughnessMap', 'emissiveMap', 'alphaMap', 'aoMap', 'bumpMap']) {
          const tx = m[key];
          if (tx && tx.isTexture) {
            const src = tx.source || tx;
            const e = texs.get(src);
            const hero = isHero(o);
            if (!e) texs.set(src, { bytes: texBytes(tx), hero, name: tx.name || key, w: tx.image?.width || 0, h: tx.image?.height || 0 });
            else e.hero = e.hero || hero;
          }
        }
        if (m.uniforms) for (const u in m.uniforms) {
          const tx = m.uniforms[u].value;
          if (!tx || !tx.isTexture) continue;
          const e = texs.get(tx.source || tx);
          if (!e) texs.set(tx.source || tx, { bytes: texBytes(tx), hero: isHero(o), name: tx.name || u, w: tx.image?.width || 0, h: tx.image?.height || 0 });
          else e.hero = e.hero || isHero(o);
        }
      }
    });
    let texBytesTotal = 0, heroTexBytes = 0, heroTexCount = 0;
    for (const e of texs.values()) { texBytesTotal += e.bytes; if (e.hero) { heroTexBytes += e.bytes; heroTexCount++; } }
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    const fbBytes = size.x * size.y * (4 + 4 + 4); // color + depth/stencil + 表示用
    const sm = renderer.shadowMap.enabled ? tier.shadowMapSize * tier.shadowMapSize * 4 * 2 : 0;
    const total = texBytesTotal + geoBytes + fbBytes + sm;
    return {
      tris, triTotal: tris.hero + tris.other, meshes, nan,
      textures: [...texs.values()].map((e) => `${e.name}${e.hero ? '*' : ''} ${e.w}x${e.h}`),
      texCount: texs.size, heroTexCount,
      mib: { textures: texBytesTotal / 1048576, heroTextures: heroTexBytes / 1048576, geometry: geoBytes / 1048576, framebuffer: fbBytes / 1048576, shadow: sm / 1048576, total: total / 1048576 },
      canvas: [size.x, size.y],
    };
  }

  window.addEventListener('error', (e) => errors.push(String(e.message || e.error || e)));
  window.addEventListener('unhandledrejection', (e) => errors.push('promise: ' + String(e.reason && (e.reason.message || e.reason))));
  const origErr = console.error.bind(console);
  console.error = (...a) => { errors.push(a.map(String).join(' ').slice(0, 200)); origErr(...a); };

  return {
    errors,
    cpu(ms) { cpuAvg = cpuAvg ? cpuAvg * 0.95 + ms * 0.05 : ms; },
    cpuMs() { return cpuAvg; },
    frame(ms) { frames[fi] = ms; fi = (fi + 1) % frames.length; fn = Math.min(frames.length, fn + 1); },
    fps() {
      if (!fn) return { avg: 0, p95: 0, p95ms: 0 };
      const a = Array.from(frames.slice(0, fn)).sort((x, y) => x - y);
      const mean = a.reduce((s, x) => s + x, 0) / fn;
      const p95ms = a[Math.min(fn - 1, Math.floor(fn * 0.95))];
      return { avg: 1000 / mean, p95: 1000 / p95ms, p95ms };
    },
    scene(force = false) {
      const now = performance.now();
      if (force || !lastScene || now - sceneT > 500) { lastScene = measureScene(); sceneT = now; }
      return lastScene;
    },
  };
}

const fmtMs = (v) => (v ? Math.round(v) + 'ms' : '-');

export function createOverlay(stats, renderer, tier, actions) {
  const el = document.createElement('div');
  el.style.cssText = 'position:absolute;left:calc(6px + env(safe-area-inset-left, 0px));top:calc(6px + env(safe-area-inset-top, 0px));z-index:10;font:11px/1.35 ui-monospace,Menlo,monospace;color:#fff;background:rgba(0,0,0,.55);padding:6px 8px;border-radius:6px;white-space:pre;pointer-events:none;max-width:46vw;overflow:hidden';
  document.body.appendChild(el);
  const btns = document.createElement('div');
  btns.style.cssText = 'margin-top:4px;display:flex;gap:4px;flex-wrap:wrap';
  const txt = document.createElement('div');
  el.append(txt, btns);
  for (const [label, fn] of Object.entries(actions)) {
    const b = document.createElement('button');
    b.textContent = label;
    b.style.cssText = 'font:11px ui-monospace,monospace;padding:2px 6px;pointer-events:auto';
    b.addEventListener('pointerdown', (e) => e.stopPropagation());
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    btns.appendChild(b);
  }
  let t = 0;
  return {
    update(dt, extra) {
      t += dt;
      if (t < 0.25) return;
      t = 0;
      const f = stats.fps();
      const s = stats.scene();
      const info = renderer.info;
      txt.textContent =
        `tier ${tier.name}  pr ${renderer.getPixelRatio().toFixed(2)}  canvas ${s.canvas[0]}x${s.canvas[1]}\n` +
        `fps avg ${f.avg.toFixed(1)}  p95 ${f.p95.toFixed(1)} (${f.p95ms.toFixed(1)}ms)  cpu ${stats.cpuMs().toFixed(1)}ms/frame\n` +
        `draw ${info.render.calls} (影込み)  tris drawn ${info.render.triangles}\n` +
        `scene tris hero ${s.tris.hero}  other ${s.tris.other}  total ${s.triTotal}\n` +
        `tex ${s.texCount} (hero ${s.heroTexCount})  gl.tex ${info.memory.textures}  geo ${info.memory.geometries}\n` +
        `GPU est ${s.mib.total.toFixed(1)}MiB (tex ${s.mib.textures.toFixed(1)} geo ${s.mib.geometry.toFixed(1)} fb ${s.mib.framebuffer.toFixed(1)} sh ${s.mib.shadow.toFixed(1)})\n` +
        `boot first frame ${fmtMs(window.__r43 && window.__r43.firstFrameMs)}  textures ${fmtMs(window.__r43 && window.__r43.texturesReadyMs)}  NaN ${s.nan}\n` +
        (extra ? extra + '\n' : '') +
        `errors ${stats.errors.length}${stats.errors.length ? ': ' + stats.errors[stats.errors.length - 1].slice(0, 80) : ''}`;
    },
  };
}
