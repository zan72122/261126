// 起動：レンダラー・カメラ（固定）・ティア・ループ・コンテキスト喪失・デバッグ。
// start(createHero) は index.html から呼ばれる（http(s) は ES モジュール、file:// はクラシック版）。
import * as THREE from '../vendor/three.module.min.js';
import { detectTier, settingsFor } from './tier.js';
import { loadTextures, makeProcTextures } from './textures.js';
import { buildWorld } from './world.js';
import { createAudio } from './audio.js';
import { createDebug } from './debug.js';
import { createGame } from './game.js';

export async function start(createHero) {
  const params = new URLSearchParams(location.search);
  const debug = createDebug(params.get('debug') === '1');
  const t0 = performance.now();
  const T = detectTier();
  let settings = T.settings;

  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  const FOV = 35; // 器（主役）を大きく見せる（画面の高さの約3割）
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 6);
  const CAM_POS = new THREE.Vector3(0.0, 0.86, 0.98), CAM_LOOK = new THREE.Vector3(0.0, 0.18, -0.12);
  camera.position.copy(CAM_POS); camera.lookAt(CAM_LOOK);

  const _edge = new THREE.Vector3();
  function resize() {
    const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
    let pr = settings.pixelRatio;
    if (w * h * pr * pr > settings.maxPixels) pr = Math.sqrt(settings.maxPixels / (w * h));
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    const aspect = w / h;
    // 横の視野を 4:3 の時より狭くしない（縦長でも全部が入る）
    const vBase = FOV, hMin = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(vBase / 2)) * (4 / 3));
    let v = THREE.MathUtils.degToRad(vBase);
    if (aspect < 4 / 3) v = 2 * Math.atan(Math.tan(hMin / 2) / aspect);
    camera.fov = Math.min(80, THREE.MathUtils.radToDeg(v)); camera.aspect = aspect; camera.updateProjectionMatrix();
    // 縦長では上下が余るので、カウンターの手前の縁が画面の下の近くに来るよう絵を下へずらす（指の届く下側に器を）
    camera.clearViewOffset(); camera.updateMatrixWorld();
    if (aspect < 4 / 3) {
      const ny = _edge.set(0, 0, 0.37).project(camera).y, shift = (ny + 0.96) * 0.5 * h;
      if (shift > 1) camera.setViewOffset(w, h, 0, -shift, w, h);
    }
  }
  resize();
  window.addEventListener('resize', resize);

  // テクスチャ（最初の場面に要る物だけ）→ 場面
  const { textures, ready } = loadTextures(renderer, (m) => debug.pushErr(m));
  await Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]);
  const proc = makeProcTextures();
  const world = buildWorld(scene, textures, proc);
  const audio = createAudio();
  const game = createGame({ scene, camera, renderer, world, createHero, tier: settings.tier, textures, audio, debug });

  // ---- コンテキスト喪失：止めて、戻ったら GPU 資源を作り直す（ゲームの状態はそのまま） ----
  let lost = false;
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; debug.note('context lost'); }, false);
  canvas.addEventListener('webglcontextrestored', () => {
    lost = false; debug.note('context restored');
    scene.traverse((o) => {
      const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of ms) { for (const k in m) { const t = m[k]; if (t && t.isTexture) t.needsUpdate = true; } m.needsUpdate = true; }
    });
    try { game.hero.onContextRestored(); } catch (err) { debug.pushErr(err.message); }
    resize();
    last = performance.now();
  }, false);

  const debugInfo = () => ({ tier: settings.tier, heroObjs: game.heroObjs, scene: game.label, readyMs: window.__kaki.readyMs });

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
    // 自動で low へ（強制指定がない時。6秒以降、3秒ごとに平均を見る）
    if (!T.forced && settings.tier !== 'low' && now - firstFrame > 6000) {
      lowWin += raw; lowFrames++;
      if (lowWin > 3) { const fps = lowFrames / lowWin; lowCount = fps < 35 ? lowCount + 1 : 0; lowWin = 0; lowFrames = 0;
        if (lowCount >= 2) { settings = settingsFor('low', T.mobile); resize(); debug.note('tier→low (fps ' + fps.toFixed(0) + ')'); } }
    }
  }
  window.__kaki = {
    ready: true, readyMs: 0, game, renderer, scene, camera, THREE,
    screenOf: (n) => game.screenOf(n), get state() { return game.state; }, get debug() { return debug.stats; }, errors: debug.errors,
  };
  requestAnimationFrame(frame);
}
