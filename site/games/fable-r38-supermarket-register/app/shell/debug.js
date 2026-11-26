// ?debug=1 の小さなオーバーレイ：tier・キャンバス・fps(平均/p95)・draw call・三角形・テクスチャ・GPU見積もり・エラー。
import { triCount } from './geo.js';

const MiB = 1024 * 1024;

// GPU メモリの見積もり（シーンをたどって、使われている形とテクスチャを数える）
export function estimateGpu(renderer, scene, tier) {
  const geos = new Set();
  const texs = new Set();
  scene.traverse((o) => {
    if (o.geometry) geos.add(o.geometry);
    if (o.isInstancedMesh) { geos.add({ attributes: { m: o.instanceMatrix, c: o.instanceColor } }); }
    const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of ms) for (const k in m) { const v = m[k]; if (v && v.isTexture) texs.add(v); }
  });
  let geoBytes = 0;
  for (const g of geos) {
    for (const k in g.attributes) { const a = g.attributes[k]; if (a && a.array) geoBytes += a.array.byteLength; }
    if (g.index) geoBytes += g.index.array.byteLength;
  }
  let texBytes = 0;
  const texList = [];
  for (const t of texs) {
    const img = t.image;
    const w = img ? (img.width || img.videoWidth || 0) : 0;
    const h = img ? (img.height || img.videoHeight || 0) : 0;
    const mip = t.generateMipmaps !== false && t.minFilter !== 1006 && t.minFilter !== 1003 ? 4 / 3 : 1;
    texBytes += w * h * 4 * mip;
    texList.push(`${t.name || '?'} ${w}x${h}`);
  }
  const c = renderer.domElement;
  const px = c.width * c.height;
  const samples = tier.msaaSamples || 0;
  // 色4B＋深度ステンシル4B、MSAA ならその samples 倍＋解決用、表示用のもう1枚
  const fbBytes = samples > 0 ? px * 8 * samples + px * 4 + px * 4 : px * 8 + px * 4;
  return { geoBytes, texBytes, fbBytes, total: geoBytes + texBytes + fbBytes, texCount: texs.size, texList };
}

// 形の健康診断：見えている物の位置・法線に NaN／無限大が無いか、長さ0の法線が無いか（シェーダーの normalize(0) は NaN → 黒い画面）。
// InstancedMesh は行列も見る。デバッグ表示と煙テストのときだけ呼ぶ（約2万頂点で 1ms 未満）。
export function scanGeometry(scene) {
  let nan = 0, zeroN = 0, meshes = 0;
  const seen = new Set();
  scene.traverseVisible((o) => {
    if (!o.isMesh && !o.isSprite) return;
    meshes++;
    if (o.isInstancedMesh) {
      const m = o.instanceMatrix.array;
      for (let i = 0, n = o.count * 16; i < n; i++) if (!Number.isFinite(m[i])) { nan++; break; }
    }
    const g = o.geometry;
    if (!g || seen.has(g)) return;
    seen.add(g);
    const p = g.attributes.position, nr = g.attributes.normal;
    if (p) { const a = p.array; for (let i = 0; i < a.length; i++) if (!Number.isFinite(a[i])) { nan++; break; } }
    if (nr && !o.isSprite) {
      const a = nr.array;
      for (let i = 0; i < a.length; i += 3) {
        const l = a[i] * a[i] + a[i + 1] * a[i + 1] + a[i + 2] * a[i + 2];
        if (!Number.isFinite(l)) { nan++; break; }
        if (l < 1e-12) zeroN++;
      }
    }
  });
  return { nan, zeroNormals: zeroN, meshes };
}

export function createDebug({ enabled, renderer, scene, tier, hero, flow, errors, timing, ctxInfo, rig, perf, onLoseContext }) {
  const frames = new Float32Array(240);
  let fi = 0, fn = 0;
  let acc = 0;
  let el = null;
  let health = { nan: 0, zeroNormals: 0, meshes: 0 };
  const stats = { fpsAvg: 0, fpsP95: 0, calls: 0, tris: 0, heroTris: 0, restTris: 0, textures: 0, gpuMiB: 0, texMiB: 0, geoMiB: 0, fbMiB: 0, texList: [] };

  if (enabled) {
    el = document.createElement('div');
    el.id = 'debug';
    el.style.cssText = 'position:fixed;top:calc(6px + env(safe-area-inset-top));right:calc(6px + env(safe-area-inset-right));z-index:10;background:rgba(0,0,0,.66);color:#bff;font:11px/1.35 ui-monospace,Menlo,monospace;padding:6px 8px;border-radius:6px;white-space:pre;pointer-events:auto;max-width:46vw;overflow:hidden';
    document.body.appendChild(el);
    const btn = document.createElement('button');
    btn.textContent = 'lose ctx';
    btn.style.cssText = 'position:fixed;top:calc(6px + env(safe-area-inset-top));left:calc(6px + env(safe-area-inset-left));z-index:10;font:11px monospace;opacity:.7';
    btn.addEventListener('click', () => onLoseContext && onLoseContext());
    document.body.appendChild(btn);
  }

  // CPU の時間（ms）：遊びの更新（hero を含む）と、描画命令を出す時間（GPU の仕事は含まない）。指数移動平均
  let cpuUpd = 0, cpuDraw = 0;
  function frame(dt, info, updMs = 0, drawMs = 0) {
    cpuUpd += (updMs - cpuUpd) * 0.05; cpuDraw += (drawMs - cpuDraw) * 0.05;
    frames[fi] = dt; fi = (fi + 1) % frames.length; fn = Math.min(fn + 1, frames.length);
    stats.calls = info.render.calls;
    stats.tris = info.render.triangles;
    acc += dt;
    if (!enabled || acc < 0.5) return;   // 重い集計はデバッグ表示のときだけ（煙テストは refresh() を呼ぶ）
    acc = 0;
    refresh();
  }

  function refresh() {
    const info = renderer.info;
    const arr = Array.from(frames.slice(0, fn)).sort((a, b) => a - b);
    const mean = arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
    const p95 = arr[Math.floor(arr.length * 0.95)] || mean;
    stats.fpsAvg = mean > 0 ? 1 / mean : 0;
    stats.fpsP95 = p95 > 0 ? 1 / p95 : 0;
    stats.cpuUpdMs = cpuUpd; stats.cpuDrawMs = cpuDraw;
    let heroTris = triCount(hero.root);
    for (const o of flow.carriedObjects) heroTris += triCount(o);
    stats.heroTris = heroTris;
    stats.restTris = Math.max(0, stats.tris - heroTris);
    const g = estimateGpu(renderer, scene, tier);
    stats.textures = info.memory.textures;
    stats.texCount = g.texCount;
    stats.gpuMiB = g.total / MiB; stats.texMiB = g.texBytes / MiB; stats.geoMiB = g.geoBytes / MiB; stats.fbMiB = g.fbBytes / MiB;
    stats.texList = g.texList;
    health = scanGeometry(scene);
    stats.nan = health.nan; stats.zeroNormals = health.zeroNormals;
    stats.programs = (info.programs || []).length;
    if (el) {
      const c = renderer.domElement;
      el.textContent =
        `build ${window.__R38_BUILD || 'src'}\n` +
        `tier ${tier.name}  dpr ${renderer.getPixelRatio().toFixed(2)}\n` +
        `canvas ${c.width}x${c.height}  css ${c.clientWidth}x${c.clientHeight}\n` +
        (perf ? `render scale ${perf.scale.toFixed(2)}  (auto ${perf.changes} changes)\n` : '') +
        (rig ? `cam ${rig.info.shot}  d ${rig.info.dist.toFixed(2)}m  fovV ${rig.info.fovV.toFixed(0)}  hero ${(rig.info.heroFill * 100).toFixed(0)}%\n` : '') +
        `fps avg ${stats.fpsAvg.toFixed(0)}  p95 ${stats.fpsP95.toFixed(0)}\n` +
        `cpu upd ${cpuUpd.toFixed(2)}ms  draw ${cpuDraw.toFixed(2)}ms\n` +
        `draw ${stats.calls}  tris ${stats.tris}\n` +
        `  hero ${heroTris}  rest ${stats.restTris}\n` +
        `tex ${g.texCount} (gl ${info.memory.textures})  geo ${info.memory.geometries}\n` +
        `GPU≈${stats.gpuMiB.toFixed(1)}MiB (tex ${stats.texMiB.toFixed(1)} geo ${stats.geoMiB.toFixed(1)} fb ${stats.fbMiB.toFixed(1)})\n` +
        `programs ${stats.programs}  NaN ${health.nan}  zeroN ${health.zeroNormals}\n` +
        (timing ? `ready ${timing.readyMs.toFixed(0)}ms  touch@${timing.firstTouchMs.toFixed(0)}ms\n` : '') +
        (ctxInfo ? `ctx lost ${ctxInfo.lost} restored ${ctxInfo.restored}\n` : '') +
        `phase ${flow.phase}  served ${flow.served}\n` +
        (errors.length ? 'ERR ' + errors.slice(-3).join('\nERR ') : 'errors 0');
      el.style.color = errors.length || health.nan ? '#fbb' : '#bff';
    }
  }

  return { frame, refresh, stats, scanGeometry: () => scanGeometry(scene) };
}
