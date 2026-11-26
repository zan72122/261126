// 起動：renderer・カメラ・場面・hero・流れ・ループ・コンテキスト喪失の処理
import * as THREE from '../vendor/three.module.js';
import { CAMERA, PAN, PAN_ORIGIN, PALETTE } from './layout.js';
import { TIERS, pickTier, refineTierWithGL, pixelRatioFor } from './tier.js';
import { loadTextures } from './textures.js';
import { createWorld } from './world.js';
import { createCustomerFactory } from './customer.js';
import { createAudio } from './audio.js';
import { createInput } from './input.js';
import { createGame } from './game.js';
import { createDebug, estimateGpu, countTriangles } from './debug.js';

const params = new URLSearchParams(location.search);
const DEBUG = params.get('debug') === '1';
const AUTO_LOW = params.get('autolow') !== '0';   // ?autolow=0：遅くても low に落とさない（計測用）
const errors = [];
const G = (window.__game = { ready: false, errors, THREE_REVISION: THREE.REVISION });

function report(msg) {
  errors.push(String(msg));
  if (G.debug) G.debug.error(msg);
}
window.addEventListener('error', e => report(e.message || e.error));
window.addEventListener('unhandledrejection', e => report('promise: ' + (e.reason && e.reason.message || e.reason)));

async function boot() {
  const t0 = performance.now();
  let tier = pickTier(params);
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: tier.antialias, alpha: false, powerPreference: 'high-performance',
    preserveDrawingBuffer: false, stencil: false,
  });
  tier = refineTierWithGL(tier, renderer.getContext(), params);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x2a2140, 1);
  renderer.info.autoReset = true;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x3a2d4a, 6, 14);
  const camera = new THREE.PerspectiveCamera(CAMERA.minVFov, 1, 0.05, 30);
  camera.position.set(...CAMERA.pos);
  const look = new THREE.Vector3(...CAMERA.look);
  camera.lookAt(look);

  const steps = { script: Math.round(t0) };          // 起動の内訳（ms）：?debug=1 と __game.bootSteps
  let tm = t0;
  const lap = k => { const n = performance.now(); steps[k] = Math.round(n - tm); tm = n; };
  lap('renderer');
  const tex = await loadTextures(THREE, renderer);
  lap('textures');
  const world = createWorld(THREE, tex, tier);
  lap('world');
  scene.add(world.root);

  const audio = createAudio();
  let game = null;
  const { createHero } = window.__WataameHero || {};
  if (typeof createHero !== 'function') throw new Error('hero/hero.build.js が読み込まれていない');
  const hero = createHero(THREE, {
    renderer,
    pan: { innerRadius: PAN.innerRadius, rimY: PAN.rimY, floorY: PAN.floorY, spinnerRadius: PAN.spinnerRadius, moveRadius: PAN.moveRadius, moveY: PAN.moveY },
    palette: PALETTE.map(p => ({ ...p })),
    textures: { cottonFiber: tex.cottonFiber, wood: tex.wood },
    quality: { ...tier.hero },
    onEvent: (type, data) => { if (game) game.onHeroEvent(type, data); },
  });
  hero.root.position.set(...PAN_ORIGIN);
  scene.add(hero.root);

  const customers = createCustomerFactory(THREE, tex);
  let input = null;
  const proxyHandlers = {};
  input = createInput(THREE, canvas, camera, new Proxy(proxyHandlers, { get: (_, k) => game && game.handlers[k] }));
  lap('hero');
  game = createGame(THREE, { scene, world, hero, customers, audio, input });
  lap('game');

  // ---- 画面サイズとカメラの画角
  function resize() {
    const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
    renderer.setPixelRatio(pixelRatioFor(tier, w, h));
    renderer.setSize(w, h, true);
    camera.aspect = w / h;
    const d = camera.position.distanceTo(look);
    const halfH = Math.atan(CAMERA.halfWidth / d);
    const needV = 2 * Math.atan(Math.tan(halfH) / camera.aspect) * 180 / Math.PI;
    camera.fov = Math.min(95, Math.max(CAMERA.minVFov, needV));
    camera.updateProjectionMatrix();
    world.fitBackdrop(camera);
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 200));
  resize();

  // ---- デバッグ
  const dbg = DEBUG ? createDebug(THREE, { renderer, scene, tierRef: () => tier, heroRoot: () => hero.root, getState: () => game.state, boot: () => G.readyAt }) : null;
  G.debug = dbg;
  if (dbg) for (const e of errors) dbg.error(e);

  // ---- コンテキスト喪失：止めて待ち、復帰したら GPU 資源を作り直す（ゲームの状態はそのまま）
  let contextLost = false;
  canvas.addEventListener('webglcontextlost', e => {
    e.preventDefault(); contextLost = true; audio.suspend();
    G.contextLost = (G.contextLost || 0) + 1;
  }, false);
  canvas.addEventListener('webglcontextrestored', () => {
    // three の WebGLRenderer は自前で GL 状態を作り直す。こちらは貼り直しを確実にする
    scene.traverse(o => {
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const m of mats) {
        for (const k in m) { const v = m[k]; if (v && v.isTexture) v.needsUpdate = true; }
        m.needsUpdate = true;
      }
      if (o.isInstancedMesh) o.instanceMatrix.needsUpdate = true;
    });
    for (const k in tex) tex[k].needsUpdate = true;
    if (hero.onContextRestored) hero.onContextRestored();
    resize();
    contextLost = false; audio.resume();
    G.contextRestored = (G.contextRestored || 0) + 1;
  }, false);
  // iOS：touchend でも音を起こす（pointerdown だけでは AudioContext が動き出さないことがある）
  document.addEventListener('touchend', () => audio.unlock(), { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) audio.suspend(); else audio.resume(); });

  // ---- ループ
  let last = performance.now();
  let slowT = 0, slowAcc = 0, slowN = 0, downgraded = false;
  function frame(now) {
    requestAnimationFrame(frame);
    let dt = (now - last) / 1000; last = now;
    if (!(dt > 0)) dt = 1 / 60;
    dt = Math.min(dt, 0.1);
    if (contextLost) return;
    try {
      game.update(dt);
      renderer.render(scene, camera);
    } catch (err) {
      report(err && err.stack ? err.stack.split('\n')[0] : err);
    }
    if (dbg) dbg.frame(dt, renderer.info.render);
    // 遅い端末は1回だけ low に落とす（最初の3秒は見ない）
    slowT += dt;
    if (!downgraded && slowT > 3) {
      slowAcc += dt; slowN++;
      if (slowAcc > 5) {
        const fps = slowN / slowAcc;
        if (AUTO_LOW && fps < 40 && tier.name !== 'low') {
          tier = { ...TIERS.low, antialias: tier.antialias };
          hero.setQuality({ ...tier.hero });
          resize();
          downgraded = true;
        }
        slowAcc = 0; slowN = 0;
      }
    }
  }
  requestAnimationFrame(frame);

  // 最初の1枚を描いてから見せる（シェーダーのコンパイルもここ）
  lap('resize+debug');
  game.update(1 / 60);
  renderer.render(scene, camera);
  lap('firstFrame');
  canvas.style.opacity = '1';
  document.body.classList.add('ready');

  Object.assign(G, {
    ready: true, bootMs: Math.round(performance.now() - t0), readyAt: Math.round(performance.now()), bootSteps: steps, tier: () => tier.name,
    // 計測・煙テスト用：ゲームの時間を sec 秒だけ進める（1/30 秒刻み、描画は最後の1回）。指の状態はそのまま使う
    advance(sec) {
      const n = Math.max(1, Math.round(sec * 30));
      for (let i = 0; i < n; i++) game.update(1 / 30);
      renderer.render(scene, camera);
      return game.state;
    },
    state: () => game.state,
    stats: () => ({ ...renderer.info.render, gpu: estimateGpu(THREE, renderer, scene, tier), hero: countTriangles(hero.root), world: countTriangles(scene) }),
    loseContext() { const ext = renderer.getContext().getExtension('WEBGL_lose_context'); G._lc = ext; ext && ext.loseContext(); },
    restoreContext() { G._lc && G._lc.restoreContext(); },
    camera, scene, renderer, hero,
    // 煙テスト用：主な物の画面上の位置（CSS px）
    targets() {
      const P = (x, y, z) => { const v = new THREE.Vector3(x, y, z).project(camera); return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight }; };
      const wp = o => { const v = new THREE.Vector3(); o.getWorldPosition(v); return v; };
      const jars = world.jars.map(j => { const v = wp(j.group); return P(v.x, v.y + 0.09, v.z); });
      const cu = scene.getObjectByName ? scene.children.find(o => o.name && o.name.startsWith('customer-')) : null;
      const c = cu ? wp(cu) : new THREE.Vector3(0, 0, -1);
      return { jars, customer: P(c.x, 1.15, c.z), pan: P(PAN_ORIGIN[0], PAN_ORIGIN[1] + PAN.moveY, PAN_ORIGIN[2]), panR: P(PAN_ORIGIN[0] + PAN.moveRadius, PAN_ORIGIN[1] + PAN.moveY, PAN_ORIGIN[2]) };
    },
  });
}

boot().catch(err => { report('boot: ' + (err && err.message || err)); console.error(err); });
