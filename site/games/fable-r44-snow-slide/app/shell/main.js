import * as THREE from 'three';
import { detectTier, pixelRatioFor, FrameMonitor, TIERS } from './tier.js';
import { loadTextures } from './textures.js';
import { createWorld } from './world.js';
import { createFlow } from './flow.js';
import { createInput } from './input.js';
import { createUI } from './ui.js';
import { Sfx } from './audio.js';
import { captureErrors, createOverlay, measure, errors } from './debug.js';

// Boot: only the first scene is built (world, hero, rider, flag). Friends and effects are made later, when needed.
const params = new URLSearchParams(location.search);
const DEBUG = params.has('debug') && params.get('debug') !== '0';
const NO_ADAPT = params.has('noadapt');
captureErrors();

async function boot() {
  const t0 = performance.now();
  let tier = detectTier(params);
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: tier.msaa, powerPreference: 'high-performance', alpha: false, stencil: false });
  renderer.setPixelRatio(pixelRatioFor(tier));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.info.autoReset = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdfeefc);
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.5, 200);

  const tex = await loadTextures(renderer);
  const world = createWorld(scene, tex.shell, tier);

  const createHero = window.HeroModule && window.HeroModule.createHero;
  if (!createHero) throw new Error('hero/hero.bundle.js is missing (run npm run build)');
  const sfx = new Sfx();
  let flow = null;
  const seed0 = params.has('seed') ? (parseInt(params.get('seed'), 10) | 0) : (Date.now() & 0x7fffffff);
  const hero = createHero(THREE, {
    textures: tex.hero, tier: tier.name, shadows: tier.shadows, seed: seed0, round: 0, debug: DEBUG,
    onEvent: (type, data) => { if (flow) flow.onHeroEvent(type, data); },
  });
  scene.add(hero.root);

  const ui = createUI(() => flow && flow.onAgain());
  flow = createFlow({ scene, camera, hero, sfx, world, ui, tier, seed0 });
  const input = createInput(canvas, camera, flow.pickers, (ray) => hero.raycastGround(ray), flow.handlers);

  function resize() {
    renderer.setPixelRatio(pixelRatioFor(tier));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    flow.fitCamera(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 200));
  resize();

  // ---- context loss: keep the game state, stop drawing, rebuild GPU side on restore ----
  let running = true, ctxState = 'ok', raf = 0;
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); running = false; ctxState = 'lost'; cancelAnimationFrame(raf); }, false);
  canvas.addEventListener('webglcontextrestored', () => {
    // three.js re-initialises its GL state and re-uploads textures/buffers lazily from the CPU copies we keep.
    scene.traverse((o) => {
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const m of mats) { m.needsUpdate = true; for (const k of ['map', 'emissiveMap']) if (m[k]) m[k].needsUpdate = true; }
      if (o.isInstancedMesh) { o.instanceMatrix.needsUpdate = true; if (o.instanceColor) o.instanceColor.needsUpdate = true; }
    });
    for (const t of Object.values(tex.hero)) t.needsUpdate = true;
    hero.onContextRestored && hero.onContextRestored();
    world.onContextRestored();
    ctxState = 'restored'; running = true; last = performance.now();
    raf = requestAnimationFrame(frame);
  }, false);

  document.addEventListener('visibilitychange', () => { if (document.hidden) sfx.suspend(); else { sfx.resume(); last = performance.now(); } });

  // ---- loop ----
  const mon = new FrameMonitor();
  const overlay = DEBUG ? createOverlay() : null;
  let last = performance.now(), bootMs = 0, frames = 0, lastOverlay = 0, lastMeasure = 0, m = null;
  let lastCalls = 0, lastTris = 0;

  function dropTier() {
    tier = { ...TIERS.low, isMobile: tier.isMobile };
    world.setTier(tier);
    hero.setTier && hero.setTier('low');
    scene.traverse((o) => { if (o.isMesh) { o.castShadow = o.castShadow && tier.shadows; } const mats = o.material ? [].concat(o.material) : []; mats.forEach((mm) => (mm.needsUpdate = true)); });
    resize();
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const dtMs = Math.max(0, now - last); last = now;
    const dt = Math.min(dtMs / 1000, 0.05);
    if (frames > 0) mon.push(dtMs);
    try {
      flow.update(dt);
      world.update(dt, flow.S.time);
      renderer.info.reset();
      renderer.render(scene, camera);
      lastCalls = renderer.info.render.calls; lastTris = renderer.info.render.triangles;
    } catch (e) {
      console.error(e && e.stack || e);
    }
    frames++;
    if (frames === 1) { bootMs = now; document.body.classList.add('ready'); }
    if (!NO_ADAPT && tier.name !== 'low' && mon.shouldDrop(dt)) dropTier();
    if (overlay && now - lastOverlay > 500) {
      lastOverlay = now;
      if (!m || now - lastMeasure > 2000) { m = measure({ renderer, scene, hero, tier }); lastMeasure = now; }
      overlay.show({ tier: tier.name, dpr: renderer.getPixelRatio(), fps: mon.stats(), bootMs, calls: lastCalls, tris: lastTris, m, scene: sceneName(), ctx: ctxState });
    }
  }
  raf = requestAnimationFrame(frame);

  function sceneName() {
    const S = flow.S;
    if (S.transitioning) return 'E again';
    const f = S.friend;
    if (f) return 'D friend:' + f.phase;
    const sp = hero.getSledPose().state;
    if (sp === 'slide' || sp === 'hop' || sp === 'stopped' || sp === 'return') return 'C slide:' + sp;
    if (S.firstTouchT === null) return 'A start';
    return 'B build';
  }

  // hooks for the smoke test and debugging
  const tmp = new THREE.Vector3(), out = { x: 0, y: 0 };
  window.__game = {
    ready: true, THREE, renderer, scene, camera, hero, flow, ui, errors,
    get bootMs() { return bootMs; }, get frames() { return frames; }, sceneName,
    measure: () => ({ ...measure({ renderer, scene, hero, tier }), calls: lastCalls, tris: lastTris, fps: mon.stats(), tier: tier.name }),
    screenPos(id) {
      if (id === 'plow') { const p = hero.getPlowPose(); tmp.set(p.x, p.y + 0.6, p.z); }
      else if (id === 'sled') { const p = hero.getSledPose(); tmp.set(p.x, p.y + 0.3, p.z); }
      else if (id === 'flag') flow.flag.root.getWorldPosition(tmp).add({ x: 0, y: 0.9, z: 0 });
      else if (id === 'friend') { if (!flow.S.friend) return null; flow.S.friend.animal.root.getWorldPosition(tmp).add({ x: 0, y: 0.4, z: 0 }); }
      else if (Array.isArray(id)) tmp.set(id[0], hero.heightAt(id[0], id[1]), id[1]);
      return { ...input.project(tmp, out) };
    },
  };
  console.log('[snow] boot', (performance.now() - t0).toFixed(0), 'ms tier', tier.name);
}

boot().catch((e) => { console.error('boot failed', e && e.stack || e); document.body.classList.add('ready'); });
