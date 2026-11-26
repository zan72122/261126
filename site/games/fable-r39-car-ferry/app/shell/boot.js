// Boot: tier, renderer, scene, hero, world, loop, context loss, debug.
import * as THREE from './three.js';
import { createWorld } from './world.js';
import { createNav } from './nav.js';
import { createWheel } from './wheel.js';
import { createFx } from './fx.js';
import { createAudio } from './audio.js';
import { createCameraRig } from './camera.js';
import { createGame } from './game.js';
import { createDebug } from './debug.js';
import { makeDriver } from './animals.js';
import { loadTexture, allTextures } from './textures.js';

export const TIERS = {
  high: { maxDpr: 1.5, maxPixels: 4.2e6, particles: 300 },
  mobile: { maxDpr: 1.0, minDpr: 1.0, maxPixels: Infinity, particles: 160 }, // touch devices (iPad): DPR fixed at 1.0
  low: { maxDpr: 0.8, maxPixels: 1.2e6, particles: 80 },
};

export function detectTier(params) {
  const forced = params.get('tier');
  if (forced && TIERS[forced]) return forced;
  // iPad reports a Mac user agent: touch points decide
  return navigator.maxTouchPoints > 1 ? 'mobile' : 'high';
}

export function boot(createHero) {
  const params = new URLSearchParams(location.search);
  const debugOn = params.get('debug') === '1';
  const smoke = params.get('smoke') === '1';
  let tier = detectTier(params);
  const touch = navigator.maxTouchPoints > 1;
  const canvas = document.getElementById('game');
  const t0 = performance.now();

  if (typeof createHero !== 'function') { console.error('hero module missing (file:// needs app/hero/hero.classic.js: npm run build:hero)'); return; }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.info.autoReset = false;
  renderer.setClearColor(0xcfe9fb, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.5, 1800);
  const anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

  // ---- hero (textures arrive later and are handed over with setTextures) ----
  const heroTex = { hull: null, deck: null };
  let game = null;
  const pending = [];
  const hero = createHero(THREE, {
    tier, textures: heroTex, makeDriver, hintColor: 0xffe27a,
    onEvent: (type, data) => { if (game) game.onHeroEvent(type, data); else pending.push([type, data]); },
  });
  scene.add(hero.root);
  const onHeroTex = () => { if (heroTex.hull && heroTex.hull.image && heroTex.deck && heroTex.deck.image) hero.setTextures({ hull: heroTex.hull, deck: heroTex.deck }); };
  heroTex.hull = loadTexture('hull_paint_1024.jpg', { anisotropy, onLoad: onHeroTex });
  heroTex.deck = loadTexture('deck_steel_1024.jpg', { anisotropy, onLoad: onHeroTex });

  // ---- world & play ----
  const world = createWorld({ tier, scene, anisotropy });
  const nav = createNav(world);
  const wheel = createWheel();
  const fx = createFx(scene, TIERS[tier].particles);
  const audio = createAudio();
  const rig = createCameraRig(camera);
  const debug = createDebug({ enabled: debugOn, renderer, scene, hud: wheel.scene, heroRoot: hero.root, tier });
  hero.root.position.set(nav.state.x, 0, nav.state.z); hero.root.rotation.y = nav.state.yaw; hero.root.updateMatrixWorld(true);
  game = createGame({ scene, camera, canvas, hero, world, nav, wheel, fx, audio, debug });
  hero.dock(world.ports[0].berth, { instant: true });
  for (const [t, d] of pending) game.onHeroEvent(t, d);

  // ---- size: the canvas fills the screen (CSS 100dvh); follow every change of the visible area ----
  // renderScale: the automatic step-down of the internal resolution when frames are slow (1 → 0.85 → 0.75).
  // The canvas stays full screen (CSS size), only the drawing buffer gets smaller; the DPR rule is unchanged.
  const fixedScale = params.get('scale');
  let renderScale = fixedScale && +fixedScale > 0 ? Math.min(1, Math.max(0.5, +fixedScale)) : 1;
  const safeProbe = document.createElement('div');
  safeProbe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;' +
    'padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
  document.body.appendChild(safeProbe);
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  let sizeKey = '';
  function resize(force) {
    const w = Math.max(1, Math.round(canvas.clientWidth || window.innerWidth)), h = Math.max(1, Math.round(canvas.clientHeight || window.innerHeight));
    const cs = getComputedStyle(safeProbe);
    insets.top = parseFloat(cs.paddingTop) || 0; insets.right = parseFloat(cs.paddingRight) || 0;
    insets.bottom = parseFloat(cs.paddingBottom) || 0; insets.left = parseFloat(cs.paddingLeft) || 0;
    const T = TIERS[tier];
    let dpr = Math.min(window.devicePixelRatio || 1, T.maxDpr);
    if (w * h * dpr * dpr > T.maxPixels) dpr = Math.sqrt(T.maxPixels / (w * h));
    if (touch) dpr = 1.0; // mobile rule: devicePixelRatio fixed at 1.0 (also after an automatic drop to 'low')
    const key = `${w}x${h}@${dpr}*${renderScale}|${insets.top},${insets.right},${insets.bottom},${insets.left}`;
    if (key === sizeKey && force !== true) return;
    sizeKey = key;
    renderer.setPixelRatio(dpr * renderScale); renderer.setSize(w, h, false);
    const hud = wheel.layout(w, h, insets);
    rig.setView(w, h, insets, hud);
    debug.setScale(renderScale);
  }
  resize();
  const later = () => { resize(); setTimeout(resize, 120); setTimeout(resize, 400); }; // iOS reports the new size late
  window.addEventListener('resize', later);
  window.addEventListener('orientationchange', later);
  if (window.visualViewport) { window.visualViewport.addEventListener('resize', later); window.visualViewport.addEventListener('scroll', later); }
  if (window.ResizeObserver) new ResizeObserver(() => resize()).observe(canvas);
  document.addEventListener('fullscreenchange', later);
  document.addEventListener('webkitfullscreenchange', later);

  // ---- context loss: keep the game state, rebuild GPU resources ----
  let lost = false;
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; debug.warn('webgl context lost'); }, false);
  canvas.addEventListener('webglcontextrestored', () => {
    const touch = (root) => root.traverse((o) => {
      if (o.material) for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        m.needsUpdate = true;
        for (const k of Object.keys(m)) { const v = m[k]; if (v && v.isTexture && v.image) v.needsUpdate = true; }
        if (m.uniforms) for (const u of Object.values(m.uniforms)) if (u.value && u.value.isTexture && u.value.image) u.value.needsUpdate = true;
      }
      if (o.isInstancedMesh) { o.instanceMatrix.needsUpdate = true; if (o.instanceColor) o.instanceColor.needsUpdate = true; }
    });
    for (const t of allTextures()) if (t.image) t.needsUpdate = true;
    touch(scene); touch(wheel.scene);
    if (hero.onContextRestored) try { hero.onContextRestored(); } catch (err) { console.error(err); }
    lost = false; resize(true); debug.warn('webgl context restored');
  }, false);

  // ---- automatic step-down on slow devices ----
  // 1) 'low' tier on touch devices: one sea texture layer, no clouds (fill cost); 2) then the internal resolution
  // 0.85×, 3) then 0.75× — the picture stays full screen (never smaller), it only gets a little softer.
  // Not when the tier was chosen by hand (?tier=) or the scale was fixed (?scale=1).
  let slowT = 0, stepAt = 0;
  function autoTier(dtMs) {
    const now = performance.now();
    if (params.get('tier') || fixedScale || now - t0 < 6000 || now - stepAt < 4000) return;
    if (debug.info.fpsAvg > 0 && debug.info.fpsAvg < 40) slowT += dtMs; else slowT = 0;
    if (slowT < 4000) return;
    slowT = 0; stepAt = now;
    if (tier === 'mobile') { tier = 'low'; debug.setTier('low (auto)'); world.setLite(true); resize(true); }
    else if (renderScale > 0.85) { renderScale = 0.85; resize(true); }
    else if (renderScale > 0.75) { renderScale = 0.75; resize(true); }
  }

  // ---- loop ----
  let last = performance.now(), time = 0, firstFrame = true, renderedFrames = 0;
  const heroInput = { time: 0, speed: 0, turnRate: 0, accel: 0, docked: true };
  function frame(now) {
    requestAnimationFrame(frame);
    const dtMs = Math.min(now - last, 250); last = now;
    if (lost) return;
    const dt = Math.min(dtMs / 1000, 0.05); time += dt;
    try {
      if (!world.fullyBuilt && !firstFrame) world.buildStep();
      nav.update(dt);
      const s = nav.state;
      hero.root.position.set(s.x, 0, s.z); hero.root.rotation.y = s.yaw;
      hero.root.updateMatrixWorld(true);
      heroInput.time = time; heroInput.speed = s.speed; heroInput.turnRate = s.turnRate; heroInput.accel = s.accel; heroInput.docked = s.mode === 'docked';
      hero.update(dt, heroInput);
      game.update(dt, time);
      rig.update(dt, nav, hero, game);
      world.update(dt, time, { shipPos: hero.root.position, shipYaw: s.yaw, shipRoot: hero.root, camTarget: rig.target, cameraPos: camera.position, docked: s.mode === 'docked' });
      wheel.update(dt, time);
      wake(dt);
      fx.update(dt, camera);
      renderer.info.reset();
      renderer.autoClear = true; renderer.render(scene, camera);
      renderer.autoClear = false; renderer.clearDepth(); renderer.render(wheel.scene, wheel.camera);
      debug.setRenderInfo(renderer.info.render.calls, renderer.info.render.triangles);
      renderedFrames++;
    } catch (err) { console.error(err); }
    debug.frame(dtMs, time);
    autoTier(dtMs);
    if (firstFrame) { firstFrame = false; window.__ferryFirstFrameMs = performance.now() - t0; debug.setStartup(performance.now()); } // performance.now() = ms since navigation start
  }
  // wake foam behind the ship
  let wakeT = 0; const wv = new THREE.Vector3();
  function wake(dt) {
    const s = nav.state; wakeT -= dt;
    if (Math.abs(s.speed) > 0.6 && wakeT <= 0) {
      wakeT = 0.18;
      for (const sx of [-1.6, 1.6]) {
        wv.set(sx, 0.15, -10.5).applyMatrix4(hero.root.matrixWorld);
        fx.spawn({ type: 'puff', pos: wv.clone(), size: 2.2, grow: 2.2, life: 3.2, flat: true, color: 0xffffff, alpha: 0.55, fadeIn: 0.2 });
      }
    }
  }
  requestAnimationFrame(frame);

  // ---- debug / smoke hooks ----
  if (debugOn || smoke) {
    debug.setExtra(() => {
      const d = game.debugInfo(); const c = rig.debug();
      return `mode ${d.mode} port ${d.port} v ${d.speed}  load ${d.hero.count}  delivered ${d.stats.delivered}\n` +
        `cam ${c.shot}${c.held ? ' (held)' : ''}  d ${c.dist}→${c.want} m  fill ${c.fill}${c.ok ? '' : '!'}  fov ${c.fov}`;
    });
    window.__ferry = {
      THREE, renderer, scene, camera, hero, world, nav, game, debug, wheel, rig,
      frames: () => renderedFrames,
      info: () => ({ ...debug.info, firstFrameMs: window.__ferryFirstFrameMs, game: game.debugInfo(), errors: debug.errors.slice() }),
      sailTo(i) {
        const p = world.ports[i]; const d = 60;
        const x = p.origin.x + p.fwd.x * d, z = p.origin.z + p.fwd.z * d;
        nav.teleport(x, z, Math.atan2(-p.fwd.x, -p.fwd.z)); nav.state.throttle = 0.6; nav.state.speed = 3;
      },
      loseContext() { const ext = renderer.getContext().getExtension('WEBGL_lose_context'); if (ext) { ext.loseContext(); setTimeout(() => ext.restoreContext(), 600); return true; } return false; },
    };
    window.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') game.reset();
      if (['1', '2', '3'].includes(e.key)) {
        const i = +e.key - 1;
        if (nav.state.mode === 'docked') { game.depart(); setTimeout(() => window.__ferry.sailTo(i), 2500); } else window.__ferry.sailTo(i);
      }
    });
  }
}
