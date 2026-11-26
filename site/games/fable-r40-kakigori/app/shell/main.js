// 起動：レンダラー・全画面の扱い・カメラ・ティア・ループ・描画解像度の自動降格・コンテキスト喪失・デバッグ。
// start(createHero) は index.html から呼ばれる（http(s) は ES モジュール、file:// はクラシック版）。
import * as THREE from '../vendor/three.module.min.js';
import { detectTier } from './tier.js';
import { loadTextures, makeProcTextures } from './textures.js';
import { buildWorld } from './world.js';
import { createAudio } from './audio.js';
import { createDebug } from './debug.js';
import { createGame } from './game.js';
import { createCameraRig } from './camera.js';

export async function start(createHero) {
  const params = new URLSearchParams(location.search);
  const debug = createDebug(params.get('debug') === '1');
  const t0 = performance.now();
  const T = detectTier();
  const settings = T.settings;

  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  // カメラは主役（器と氷の山）中心。距離・角度・画面のどこに置くかは game が場面ごとに決め、rig がゆっくり追う（shell/camera.js）
  const camera = new THREE.PerspectiveCamera(34, 1, 0.03, 8);
  const rig = createCameraRig(camera);

  // ---- 全画面：canvas は CSS で 100dvh（予備 100vh）。描画の大きさはその実寸から決める ----
  // 内部の描画解像度だけを下げる自動降格：renderScale 1 → 0.85 → 0.75（表示の大きさは変えない）
  let renderScale = 1;
  const safeProbe = document.getElementById('safe');
  function readSafe() {
    if (!safeProbe) return { l: 0, r: 0, t: 0, b: 0 };
    const cs = getComputedStyle(safeProbe);
    return { l: parseFloat(cs.paddingLeft) || 0, r: parseFloat(cs.paddingRight) || 0, t: parseFloat(cs.paddingTop) || 0, b: parseFloat(cs.paddingBottom) || 0 };
  }
  let lastW = 0, lastH = 0, lastPR = 0;
  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width || window.innerWidth)), h = Math.max(1, Math.round(r.height || window.innerHeight));
    let pr = settings.pixelRatio;
    if (w * h * pr * pr > settings.maxPixels) pr = Math.sqrt(settings.maxPixels / (w * h));
    pr *= renderScale;
    if (w !== lastW || h !== lastH || pr !== lastPR) {
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false); // CSS の大きさは触らない（100dvh のまま）
      lastW = w; lastH = h; lastPR = pr;
    }
    rig.setViewport(w, h, readSafe());
  }
  resize();
  // 画面の変化に追従：resize・向きの変化・visualViewport（iOS のツールバーの出入り）・canvas 自体の大きさ
  let resizeQueued = false;
  const queueResize = () => { if (resizeQueued) return; resizeQueued = true; requestAnimationFrame(() => { resizeQueued = false; resize(); }); };
  window.addEventListener('resize', queueResize);
  window.addEventListener('orientationchange', () => { queueResize(); setTimeout(queueResize, 250); });
  if (window.visualViewport) { window.visualViewport.addEventListener('resize', queueResize); window.visualViewport.addEventListener('scroll', queueResize); }
  if (window.ResizeObserver) new ResizeObserver(queueResize).observe(canvas);

  // テクスチャ（最初の場面に要る物だけ）→ 場面
  const { textures, ready } = loadTextures(renderer, (m) => debug.pushErr(m));
  await Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]);
  const proc = makeProcTextures();
  const world = buildWorld(scene, textures, proc);
  const audio = createAudio();
  const game = createGame({ scene, camera, rig, renderer, world, createHero, tier: settings.tier, textures, audio, debug });

  // ---- コンテキスト喪失：止めて、戻ったら GPU 資源を作り直す（ゲームの状態はそのまま） ----
  let lost = false;
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; debug.note('context lost'); }, false);
  canvas.addEventListener('webglcontextrestored', () => {
    lost = false; debug.note('context restored');
    scene.traverse((o) => {
      const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of ms) { for (const k in m) { const t = m[k]; if (t && t.isTexture) t.needsUpdate = true; } m.needsUpdate = true; }
    });
    try { game.onContextRestored(); } catch (err) { debug.pushErr(err.message); }
    resize();
    last = performance.now();
  }, false);

  const debugInfo = () => ({ tier: settings.tier, heroObjs: game.heroObjs, scene: game.label, readyMs: window.__kaki.readyMs, renderScale,
    cam: rig.info, view: rig.view });

  // ---- ループ ----
  let last = performance.now(), firstFrame = 0, hidden = false;
  let lowWin = 0, lowCount = 0, lowFrames = 0;
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; last = performance.now(); if (hidden) audio.suspend(); else audio.resume(); });
  function frame(now) {
    requestAnimationFrame(frame);
    if (hidden || lost) { last = now; return; }
    const raw = (now - last) / 1000; last = now;
    const dt = Math.min(0.05, Math.max(0.0001, raw));
    try {
      game.update(dt);
      renderer.render(scene, camera);
    } catch (err) { debug.pushErr(err && err.message || err); console.error(err); }
    if (!firstFrame) { firstFrame = performance.now(); document.body.classList.add('ready'); window.__kaki.readyMs = firstFrame - t0; }
    debug.frame(raw, renderer, scene, debugInfo); // 中身は 0.5 秒ごとにだけ作る（毎フレームの new を避ける）
    // 重い時は内部の描画解像度だけを 0.85 → 0.75 倍へ（表示の大きさ・構図は変えない）。強制指定の時はしない。
    // 6秒以降、3秒ごとに平均を見て、2回続けて 35fps 未満なら1段下げる
    if (!T.forced && renderScale > 0.75 && now - firstFrame > 6000) {
      lowWin += raw; lowFrames++;
      if (lowWin > 3) { const fps = lowFrames / lowWin; lowCount = fps < 35 ? lowCount + 1 : 0; lowWin = 0; lowFrames = 0;
        if (lowCount >= 2) { lowCount = 0; renderScale = renderScale > 0.85 ? 0.85 : 0.75; resize(); debug.note('renderScale→' + renderScale + ' (fps ' + fps.toFixed(0) + ')'); } }
    }
  }
  window.__kaki = {
    ready: true, readyMs: 0, game, renderer, scene, camera, rig, THREE, resize,
    screenOf: (n) => game.screenOf(n), get state() { return game.state; }, get debug() { return debug.stats; }, errors: debug.errors,
  };
  requestAnimationFrame(frame);
}
