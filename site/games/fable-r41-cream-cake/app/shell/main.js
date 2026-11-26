// Bootstrap: renderer + tier, first scene only, hero, loop, resize, WebGL context loss/restore, ?debug=1.
import { THREE } from './util.js';
import { errors, DebugOverlay, estimateGpu, nanScan, measureFill, estimateGpuMs } from './debug.js';
import { detectTier, pixelRatioFor } from './tier.js';
import { Assets } from './assets.js';
import { Sfx } from './audio.js';
import { buildWorld, fitCamera, CREAM_COLORS, L } from './world.js';
import { Items } from './items.js';
import { Customer } from './customer.js';
import { Fx } from './fx.js';
import { Game } from './game.js';
import { patchShaderChunks } from './safeshader.js';

const params = new URLSearchParams(location.search);
const DEBUG = params.get('debug') === '1';
const t0 = performance.now();
const boot = (window.__boot = { scriptStart: t0 });
const mark = (k) => { boot[k] = performance.now() - t0; };

function fail(msg) {
  console.error(msg);
  document.body.style.background = '#f6e4d6';
}

function start() {
  if (!window.THREE) return fail('three missing');
  const tier = detectTier();
  patchShaderChunks();
  const canvas = document.createElement('canvas');
  canvas.id = 'game';
  document.body.appendChild(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: tier.antialias, powerPreference: 'high-performance', preserveDrawingBuffer: false, alpha: false, stencil: false });
  } catch (e) { return fail('WebGL unavailable: ' + e.message); }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = false;
  renderer.info.autoReset = true;

  mark('renderer');
  const assets = new Assets(renderer);
  assets.build();
  const W = buildWorld(assets, tier);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
  mark('world');

  // hero (Fable's part). Events are forwarded to the game once it exists.
  let game = null;
  const creamTex = assets.photo('cream_1024', { repeat: 1 });
  creamTex.name = 'cream_1024';
  let hero;
  try {
    hero = window.CakeHero.createHero(THREE, {
      radius: L.radius,
      maxHeight: 1.4,
      colors: CREAM_COLORS.map((c) => ({ key: c.key, hex: c.hex })),
      textures: { cream: creamTex },
      onTexturesReady: (fn) => assets.onReady(fn),
      tier: { name: tier.name, heroTriangles: tier.heroTriangles, maxTextureSize: tier.maxTextureSize },
      renderer,
      debug: DEBUG,
      onEvent: (type, detail) => { if (game) { try { game.onHeroEvent(type, detail || {}); } catch (e) { console.error(e); } } },
    });
  } catch (e) { return fail('createHero failed: ' + (e && e.stack || e)); }
  W.cakeTop.add(hero.root);
  mark('hero');

  const items = new Items(W, assets, tier, hero);
  const customer = new Customer(W);
  const fx = new Fx(W.scene, assets, camera, tier.particles);
  const sfx = new Sfx();
  game = new Game({ renderer, camera, W, assets, sfx, tier, hero, items, customer, fx });
  mark('game');

  // ---- sizing ----
  let pr = 1;
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    pr = pixelRatioFor(tier, w, h);
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, true);
    fitCamera(camera, w / Math.max(1, h));
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 200));
  resize();

  // ---- context loss: keep game state, rebuild GPU resources on restore (three re-uploads from CPU copies) ----
  let ctxLost = false, ctxState = 'ok';
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    ctxLost = true; ctxState = 'lost';
    sfx.squeezeStop();
    try { hero.onContextLost(); } catch (err) { console.error(err); }
  }, false);
  canvas.addEventListener('webglcontextrestored', () => {
    ctxLost = false; ctxState = 'restored';
    for (const t of assets.all) if (t.image) t.needsUpdate = true;
    W.frames.forEach((f) => { if (f.tex) f.tex.needsUpdate = true; });
    try { hero.onContextRestored(); } catch (err) { console.error(err); }
    resize();
  }, false);

  document.addEventListener('visibilitychange', () => { if (document.hidden) sfx.suspend(); });

  // ---- loop ----
  const dbg = new DebugOverlay(DEBUG);
  let last = performance.now(), gpu = null, gpuT = 0, lowT = 0, firstFrame = 0;
  const cpu = { update: 0, render: 0 };
  const info = { tier: tier.name, cw: 0, ch: 0, pr: 1, calls: 0, tris: 0, glTex: 0, gpu: null, hero: {}, scene: '', round: 0, ctx: 'ok' };
  function frame(now) {
    requestAnimationFrame(frame);
    const rawDt = (now - last) / 1000;
    last = now;
    // up to 0.1 s per frame, in steps of at most 0.05 s (the hero's dt contract): at 20 fps play still runs at
    // real speed; a long stall (tab switch) does not jump ahead.
    const dt = Math.min(0.1, Math.max(0, rawDt));
    if (ctxLost) return;
    const c0 = performance.now();
    const steps = dt > 0.05 ? 2 : 1;
    try { for (let i = 0; i < steps; i++) game.update(dt / steps); } catch (e) { console.error(e); }
    const c1 = performance.now();
    renderer.render(W.scene, camera);
    const c2 = performance.now();
    cpu.update += (c1 - c0 - cpu.update) * 0.05; cpu.render += (c2 - c1 - cpu.render) * 0.05;
    if (!firstFrame) {
      // after the first picture is on screen: compile the shaders of things that appear later (toppings on the
      // cake, particles, carried fruit, photo frames...) so they don't stall the frame where they first show up
      setTimeout(() => {
        try {
          if (renderer.extensions.has('KHR_parallel_shader_compile')) renderer.compileAsync(W.scene, camera).catch(() => {});
          else renderer.compile(W.scene, camera);
        } catch (e) { /* warm-up is optional */ }
      }, 50);
    }
    if (!firstFrame) { mark('firstFrame'); boot.firstRenderMs = c2 - c1; firstFrame = performance.now() - t0; window.__firstFrameMs = firstFrame; window.__interactiveMs = performance.now(); }
    dbg.frame(rawDt);
    // adaptive pixel ratio on desktop: if fps stays under 40 for 3 s, drop to 1.0
    if (tier.adaptive && pr > 1) { lowT = rawDt > 1 / 40 ? lowT + rawDt : Math.max(0, lowT - rawDt); if (lowT > 3) { tier.pixelRatio = 1; resize(); lowT = 0; } }
    const r = renderer.info.render;
    info.calls = r.calls; info.tris = r.triangles; info.glTex = renderer.info.memory.textures;
    info.cw = canvas.width; info.ch = canvas.height; info.pr = pr;
    info.scene = game.scene; info.round = game.round; info.ctx = ctxState;
    if (DEBUG) {
      info.hero = hero.getStats();
      gpuT -= dt;
      if (gpuT <= 0) { gpu = estimateGpu(W.scene, renderer); gpuT = 1.0; }
      info.gpu = gpu;
      dbg.update(now / 1000, info);
    } else if (info.calls > dbg.peak.calls || info.tris > dbg.peak.tris) dbg.update(now / 1000, info);
  }
  requestAnimationFrame(frame);

  // ---- test / debug hooks (used by tools/smoke.cjs) ----
  const v = new THREE.Vector3();
  function screenOf(world) {
    v.copy(world).project(camera);
    const r = canvas.getBoundingClientRect();
    return { x: r.left + (v.x * 0.5 + 0.5) * r.width, y: r.top + (-v.y * 0.5 + 0.5) * r.height };
  }
  window.__game = {
    ready: true,
    get scene() { return game.scene; },
    get round() { return game.round; },
    get heroState() { const s = hero.getState(); return { phase: s.phase, flow: s.flow, strokes: s.strokes, coverage: s.coverage }; },
    get placed() { return items.placedCount; },
    screen(name) {
      if (name === 'cake') return screenOf(W.cakeTop.getWorldPosition(new THREE.Vector3()));
      if (name.startsWith('cake:')) { const [dx, dz] = name.slice(5).split(',').map(Number); return screenOf(W.cakeTop.localToWorld(new THREE.Vector3(dx, hero.heightAt(dx, dz), dz))); }
      if (name.startsWith('bowl')) return screenOf(W.bowls[+name.slice(4)].group.position.clone().setY(0.4));
      if (name.startsWith('tray')) { const [x, z] = L.dishes[+name.slice(4)]; return screenOf(new THREE.Vector3(x, 0.2, z)); }
      if (name === 'box') return screenOf(W.box.group.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.5, 0)));
      if (name === 'customer') return screenOf(customer.pos.clone().setY(1.3));
      if (name === 'bag') return screenOf(W.bag.group.position.clone().addScaledVector(L.bagRestDir, 0.9 * L.bagScale));
      if (name === 'empty') return screenOf(new THREE.Vector3(-1.6, 0, 2.4));
      return null;
    },
    stats() { return { calls: info.calls, tris: info.tris, peak: dbg.peak, hero: hero.getStats(), gpu: estimateGpu(W.scene, renderer), canvas: [canvas.width, canvas.height], tier: tier.name, firstFrameMs: firstFrame, errors: errors.slice() }; },
    simulateContextLoss(ms = 600) {
      const ext = renderer.getContext().getExtension('WEBGL_lose_context');
      if (!ext) return false;
      ext.loseContext();
      setTimeout(() => ext.restoreContext(), ms);
      return true;
    },
    get ctx() { return ctxState; },
    get programs() { return renderer.info.programs ? renderer.info.programs.length : 0; },
    get cpu() { return { update: cpu.update, render: cpu.render }; },
    nan() { return nanScan(W.scene); },
    // Deterministic worst case for measurements: drive the hero directly at 60 Hz (no frames in between) with long
    // swirls that drift to another spot, 16 strokes in all four colors, then fill every topping up to its cap.
    stress(seconds = 4) {
      const hi = { down: false, started: false, ended: false, ray: new THREE.Ray(), colorIndex: 0, time: game.time };
      const S = [[0, 0], [0.7, 0], [-0.7, 0], [0, 0.7], [0, -0.7], [0.5, 0.5], [-0.5, -0.5], [-0.5, 0.5], [0.5, -0.5], [0.85, 0.3], [-0.85, -0.3], [0.2, -0.9], [0, 0], [0.3, 0.3], [-0.3, -0.3], [0.6, -0.2]];
      const p = new THREE.Vector3();
      const aim = (x, z) => { W.cakeTop.localToWorld(p.set(x, hero.heightAt(x, z), z)); hi.ray.origin.copy(camera.position); hi.ray.direction.copy(p).sub(camera.position).normalize(); };
      const step = () => { hi.time += 1 / 60; hero.update(1 / 60, hi); hi.started = false; hi.ended = false; };
      let peak = 0;
      S.forEach(([x, z], k) => {
        const [nx, nz] = S[(k + 3) % S.length];
        hi.colorIndex = k % 4;
        const n = Math.round(seconds * 60);
        for (let i = 0; i < n; i++) {
          const f = i < n * 0.6 ? 0 : (i - n * 0.6) / (n * 0.4);
          aim(x + (nx - x) * f * 0.5, z + (nz - z) * f * 0.5);
          hi.down = true; hi.started = i === 0;
          step();
          peak = Math.max(peak, hero.getStats().triangles);
        }
        hi.down = false; hi.ended = true; step();
        for (let i = 0; i < 30; i++) step();
      });
      const front = new THREE.Vector3(0, 0, 1);
      items.types.forEach((tt, i) => { let guard = 40; while (items.canAdd(i) && guard--) { const sp = items.autoSpot(i, front); if (!sp || !items.land(i, sp.x, sp.z)) break; } });
      return { strokes: hero.getState().strokes, heroPeak: peak, hero: hero.getStats(), placed: items.placedCount };
    },
    fill() { const f = measureFill(renderer, W.scene, camera); return { fill: f, est: estimateGpuMs(f, info.tris) }; },
    // worst-case triangle budget of the shell (every instanced mesh at capacity), hero excluded
    budget() {
      let shellNow = 0, shellMax = 0, meshes = 0;
      W.scene.traverse((o) => {
        if (!o.isMesh || !o.visible) return;
        let h = o; while (h) { if (h === hero.root) return; h = h.parent; }
        if (o.material && o.material.visible === false) return;
        const g = o.geometry, tri = (g.index ? g.index.count : g.attributes.position.count) / 3;
        meshes++;
        if (o.isInstancedMesh) { shellNow += tri * o.count; shellMax += tri * o.instanceMatrix.count; }
        else { shellNow += tri; shellMax += tri; }
      });
      return { shellNow, shellMax, meshes, heroBudget: tier.heroTriangles };
    },
  };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
