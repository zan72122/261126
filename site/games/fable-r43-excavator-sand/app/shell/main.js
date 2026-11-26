// 起動：レンダラ・カメラ・ティア・ループ・コンテキスト喪失。遊びの流れは game.js。
import * as THREE from '../vendor/three/three.module.js';
import { LAYOUT, DEBUG, pickTier, params } from './config.js';
import { createStats, createOverlay } from './debug.js';
import { createGame } from './game.js';

const t0 = performance.now();
const tier = pickTier();
const container = document.getElementById('app');
const canvas = document.createElement('canvas');
canvas.id = 'view';
container.appendChild(canvas);

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
} catch (e) {
  document.body.classList.add('nogl');
  throw e;
}
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = tier.shadows;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setClearColor(0xcfe9fb, 1);

const scene = new THREE.Scene();
const C = { ...LAYOUT.camera };
if (DEBUG && params.get('cam')) { const a = params.get('cam').split(',').map(Number); C.pos = a.slice(0, 3); C.look = a.slice(3, 6); if (a[6]) C.vfov = a[6]; }
const camera = new THREE.PerspectiveCamera(C.vfov, 4 / 3, 0.1, 80);
camera.position.fromArray(C.pos);
camera.lookAt(new THREE.Vector3().fromArray(C.look));

let pixelRatio = tier.pixelRatio;
// ?debug=1&fast=N：煙テスト用に1フレームで N 回進める
const FAST = DEBUG ? Math.max(1, Math.min(6, parseInt(params.get('fast') || '1', 10) || 1)) : 1;
let game = null;
function resize() {
  const w = Math.max(1, container.clientWidth), h = Math.max(1, container.clientHeight);
  // 画素数の上限（GPU メモリ）
  let pr = pixelRatio;
  if (w * h * pr * pr > tier.maxPixels) pr = Math.sqrt(tier.maxPixels / (w * h));
  renderer.setPixelRatio(pr);
  renderer.setSize(w, h, false);
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  const aspect = w / h;
  camera.aspect = aspect;
  // 4:3 の横の画角は必ず入るように（縦長なら縦の画角を広げる）
  const hHalf = Math.atan(Math.tan(THREE.MathUtils.degToRad(C.vfov / 2)) * C.minHFovAspect);
  const vNeeded = 2 * Math.atan(Math.tan(hHalf) / aspect);
  camera.fov = Math.max(C.vfov, THREE.MathUtils.radToDeg(vNeeded));
  camera.updateProjectionMatrix();
  if (game) game.onResize();
}
resize();
window.addEventListener('resize', resize);

const stats = createStats(renderer, scene, tier);
game = createGame({ THREE, renderer, scene, camera, canvas, container, tier, stats });
game.onResize();

// ---- 性能の自動降格（p95 が 40ms を 4 秒超え続けたら pixelRatio を下げる）----
let slowFor = 0, warm = 0;
const ADAPT = !(DEBUG && params.get('adapt') === '0');
function adapt(dt) {
  if (!ADAPT) return;
  warm += dt;
  if (warm < 3) return;
  const f = stats.fps();
  if (f.p95ms > 40) slowFor += dt; else slowFor = 0;
  if (slowFor > 4) {
    slowFor = 0; warm = 0;
    if (pixelRatio > 1.0) pixelRatio = 1.0;
    else if (pixelRatio > 0.75) pixelRatio = 0.75;
    else if (renderer.shadowMap.enabled) { renderer.shadowMap.enabled = false; scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; }); }
    else return;
    tier.name = tier.name.replace(/\*?$/, '*');
    resize();
  }
}

// ---- ループ ----
let last = performance.now(), running = true, contextLost = false, firstFrame = true;
function loop(now) {
  if (!running) return;
  requestAnimationFrame(loop);
  if (contextLost) return;
  const rawMs = now - last;
  last = now;
  const dt = Math.min(0.05, Math.max(0, rawMs / 1000));
  stats.frame(rawMs);
  const c0 = performance.now();
  for (let i = 0; i < FAST; i++) game.update(dt, now / 1000 + i * dt);
  window.__r43.frames++;
  renderer.render(scene, camera);
  stats.cpu(performance.now() - c0);
  if (firstFrame) {
    firstFrame = false;
    document.body.classList.add('ready');
    window.__r43.firstFrameMs = performance.now(); // ページの読み込み開始から（スクリプトの評価開始は t0）
    window.__r43.scriptStartMs = t0;
  }
  adapt(dt);
  if (overlay) overlay.update(dt, game.debugLine());
}

// ---- WebGL コンテキスト喪失：preventDefault して止め、戻ったら GPU 資源を作り直す（ゲーム状態は保つ）----
canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  contextLost = true;
  game.onContextLost();
}, false);
canvas.addEventListener('webglcontextrestored', () => {
  // three は内部状態を作り直す。テクスチャ・マテリアル・頂点を再送させる
  scene.traverse((o) => {
    if (o.geometry) for (const k in o.geometry.attributes) o.geometry.attributes[k].needsUpdate = true;
    if (o.geometry && o.geometry.index) o.geometry.index.needsUpdate = true;
    if (o.isInstancedMesh) { o.instanceMatrix.needsUpdate = true; if (o.instanceColor) o.instanceColor.needsUpdate = true; }
    const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of mats) {
      m.needsUpdate = true;
      for (const k in m) { const v = m[k]; if (v && v.isTexture && v.image) v.needsUpdate = true; }
    }
  });
  renderer.shadowMap.needsUpdate = true;
  resize();
  game.onContextRestored();
  contextLost = false;
  last = performance.now();
}, false);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) game.onHidden(); else { last = performance.now(); game.onVisible(); }
});

// ---- debug ----
let overlay = null;
const loseExt = () => renderer.getContext().getExtension('WEBGL_lose_context');
window.__r43 = Object.assign(window.__r43 || {}, {
  tier, renderer, scene, camera, game, stats, frames: 0,
  loseContext() { const x = loseExt(); if (x) x.loseContext(); return !!x; },
  restoreContext() { const x = loseExt(); if (x) x.restoreContext(); return !!x; },
});
Object.defineProperty(window.__r43, 'contextLost', { get: () => contextLost });
// restore には同じ拡張オブジェクトが必要なので先に取っておく
const _ext = loseExt();
window.__r43.loseContext = () => { if (_ext) _ext.loseContext(); return !!_ext; };
window.__r43.restoreContext = () => { if (_ext) _ext.restoreContext(); return !!_ext; };

if (DEBUG) {
  overlay = createOverlay(stats, renderer, tier, {
    'lose ctx': () => window.__r43.loseContext(),
    'restore': () => window.__r43.restoreContext(),
    'deliver': () => game.debugDeliver(),
    'replay': () => game.debugReplay(),
  });
}

window.__r43.ready = true;
requestAnimationFrame(loop);
