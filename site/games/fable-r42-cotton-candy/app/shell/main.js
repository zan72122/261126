// 起動：renderer・カメラ・場面・hero・流れ・ループ・コンテキスト喪失の処理
import * as THREE from '../vendor/three.module.js';
import { LENS, PAN, PAN_ORIGIN, PALETTE, JARS, COUNTER, JAR_EDGE } from './layout.js';
import { TIERS, pickTier, refineTierWithGL, pixelRatioFor } from './tier.js';
import { loadTextures } from './textures.js';
import { createWorld } from './world.js';
import { createCustomerFactory } from './customer.js';
import { createAudio } from './audio.js';
import { createInput } from './input.js';
import { createGame } from './game.js';
import { createCameraRig } from './camera.js';
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
  const camera = new THREE.PerspectiveCamera(LENS.landShortFov, 1, 0.05, 30);
  const rig = createCameraRig(THREE, camera);

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

  // ---- 画面サイズ：canvas の見えている大きさ（CSS は 100dvh、予備に 100vh）に合わせる。黒い帯は作らない
  // 重い時は表示の大きさはそのままで、内部の描画解像度だけを下げる（RENDER_SCALES の順、最後は low ティア）
  const RENDER_SCALES = [1, 0.85, 0.75];
  let scaleIdx = 0;
  let lastW = 0, lastH = 0, lastPr = 0;
  function viewSize() {
    const r = canvas.getBoundingClientRect();
    let w = r.width, h = r.height;
    if (!(w > 1 && h > 1)) { w = window.innerWidth; h = window.innerHeight; }
    return [Math.max(1, Math.round(w)), Math.max(1, Math.round(h))];
  }
  // 瓶：寄った構図で左の端に半分ほど見える x に置く（釜との隙間は守る）。画面比が変わった時だけ
  function placeJars() {
    const ndc = rig.state.portrait ? JAR_EDGE.port : JAR_EDGE.land;
    rig.setCandy(new THREE.Vector3(), 0);
    const xs = JARS.map(j => {
      const z = j.pos[2];
      let x = rig.solveX('work', ndc, COUNTER.top + 0.09, z);
      const clear = PAN.outerRadius + JAR_EDGE.jarGap + 0.07;          // 釜の外側＋隙間＋瓶の半径
      const xMax = -Math.sqrt(Math.max(0, clear * clear - z * z));
      if (!(x === x)) x = j.pos[0];
      return Math.max(JAR_EDGE.xMin, Math.min(xMax, x));
    });
    world.setJarX(xs);
  }
  function resize(force) {
    const [w, h] = viewSize();
    const pr = pixelRatioFor(tier, w, h) * RENDER_SCALES[scaleIdx];
    if (!force && w === lastW && h === lastH && pr === lastPr) return;
    lastW = w; lastH = h; lastPr = pr;
    renderer.setPixelRatio(Math.max(0.5, pr));
    renderer.setSize(w, h, false);                    // 表示の大きさは CSS（100%）に任せる
    rig.resize(w, h);
    placeJars();
    rig.setCandy(hero.getState().center, hero.getState().radius);
    rig.update(0, game ? game.cameraShot() : 'work');
    world.fitBackdrop(camera);
  }
  let resizeQueued = false;
  const queueResize = () => { if (resizeQueued) return; resizeQueued = true; requestAnimationFrame(() => { resizeQueued = false; resize(); }); };
  window.addEventListener('resize', queueResize);
  window.addEventListener('orientationchange', () => { queueResize(); setTimeout(queueResize, 250); setTimeout(queueResize, 700); });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', queueResize);
  if (window.ResizeObserver) new ResizeObserver(queueResize).observe(canvas);
  document.addEventListener('fullscreenchange', queueResize);
  document.addEventListener('webkitfullscreenchange', queueResize);
  resize(true);

  // ---- 全画面ボタン（Fullscreen API がある時だけ。全画面になったら隠す）。safe-area の内側に置く（index.html の CSS）
  const fsBtn = document.getElementById('fs');
  if (fsBtn) {
    const de = document.documentElement;
    const req = de.requestFullscreen || de.webkitRequestFullscreen;
    const isFs = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
    const standalone = (window.matchMedia && matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches) || navigator.standalone;
    const sync = () => { fsBtn.hidden = !req || standalone || isFs(); };
    fsBtn.addEventListener('pointerdown', e => e.stopPropagation());
    fsBtn.addEventListener('click', e => {
      e.preventDefault(); audio.unlock();
      try { const p = req.call(de, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch (_) { /* ignore */ }
    });
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    sync();
  }

  // ---- デバッグ
  const dbg = DEBUG ? createDebug(THREE, { renderer, scene, tierRef: () => tier, heroRoot: () => hero.root, getState: () => game.state, boot: () => G.readyAt, cam: () => rig.state, scale: () => RENDER_SCALES[scaleIdx] }) : null;
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
    resize(true);
    contextLost = false; audio.resume();
    G.contextRestored = (G.contextRestored || 0) + 1;
  }, false);
  // iOS：touchend でも音を起こす（pointerdown だけでは AudioContext が動き出さないことがある）
  document.addEventListener('touchend', () => audio.unlock(), { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) audio.suspend(); else audio.resume(); });

  // ---- ループ
  // 1歩：カメラ → 指の位置の当て直し（カメラが動いても、止めた指の下の点を正しく拾う）→ 遊び
  function step(dt) {
    const hs = hero.getState();
    rig.setCandy(hs.center, hs.radius);
    rig.update(dt, game.cameraShot());
    input.refresh();
    game.update(dt);
  }
  let last = performance.now();
  let slowT = 0, slowAcc = 0, slowN = 0, downgraded = false;
  function frame(now) {
    requestAnimationFrame(frame);
    let dt = (now - last) / 1000; last = now;
    if (!(dt > 0)) dt = 1 / 60;
    dt = Math.min(dt, 0.1);
    if (contextLost) return;
    try {
      step(dt);
      world.fitBackdrop(camera);
      renderer.render(scene, camera);
    } catch (err) {
      report(err && err.stack ? err.stack.split('\n')[0] : err);
    }
    if (dbg) dbg.frame(dt, renderer.info.render);
    // 遅い端末：表示の大きさはそのままで、内部の描画解像度を 0.85 → 0.75 倍に下げる。それでも遅ければ1回だけ low ティアへ。
    // 最初の3秒（と、下げた直後の2秒）は見ない。5秒の平均 fps < 40 で1段下げる
    slowT += dt;
    if (!downgraded && slowT > 3) {
      slowAcc += dt; slowN++;
      if (slowAcc > 5) {
        const fps = slowN / slowAcc;
        if (AUTO_LOW && fps < 40) {
          if (scaleIdx < RENDER_SCALES.length - 1) { scaleIdx++; resize(true); slowT = 1; }
          else if (tier.name !== 'low') {
            tier = { ...TIERS.low, antialias: tier.antialias };
            hero.setQuality({ ...tier.hero });
            resize(true);
            downgraded = true;
          } else downgraded = true;
        }
        slowAcc = 0; slowN = 0;
      }
    }
  }
  requestAnimationFrame(frame);

  // 最初の1枚を描いてから見せる（シェーダーのコンパイルもここ）
  lap('resize+debug');
  rig.update(0, game.cameraShot());
  world.fitBackdrop(camera);
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
      for (let i = 0; i < n; i++) step(1 / 30);
      world.fitBackdrop(camera);
      renderer.render(scene, camera);
      return game.state;
    },
    state: () => game.state,
    cam: () => ({ shot: rig.state.shot, heroFrac: rig.state.heroFrac, candyFrac: rig.state.candyFrac, dist: rig.state.dist.x, scale: RENDER_SCALES[scaleIdx], canvas: [canvas.width, canvas.height] }),
    setRenderScale(i) { scaleIdx = Math.max(0, Math.min(RENDER_SCALES.length - 1, i)); resize(true); return RENDER_SCALES[scaleIdx]; },
    stats: () => ({ ...renderer.info.render, gpu: estimateGpu(THREE, renderer, scene, tier), hero: countTriangles(hero.root), world: countTriangles(scene) }),
    loseContext() { const ext = renderer.getContext().getExtension('WEBGL_lose_context'); G._lc = ext; ext && ext.loseContext(); },
    restoreContext() { G._lc && G._lc.restoreContext(); },
    camera, scene, renderer, hero,
    // 煙テスト用：主な物の画面上の位置（CSS px）
    targets() {
      const r = canvas.getBoundingClientRect();
      const P = (x, y, z) => { const v = new THREE.Vector3(x, y, z).project(camera); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; };
      const wp = o => { const v = new THREE.Vector3(); o.getWorldPosition(v); return v; };
      const jars = world.jars.map(j => { const v = wp(j.group); return P(v.x, v.y + 0.09, v.z); });
      const cu = scene.getObjectByName ? scene.children.find(o => o.name && o.name.startsWith('customer-')) : null;
      const c = cu ? wp(cu) : new THREE.Vector3(0, 0, -1);
      return { jars, customer: P(c.x, 1.15, c.z), pan: P(PAN_ORIGIN[0], PAN_ORIGIN[1] + PAN.moveY, PAN_ORIGIN[2]), panR: P(PAN_ORIGIN[0] + PAN.moveRadius, PAN_ORIGIN[1] + PAN.moveY, PAN_ORIGIN[2]) };
    },
  });
}

boot().catch(err => { report('boot: ' + (err && err.message || err)); console.error(err); });
