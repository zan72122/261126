// 起動・ループ・サイズ・WebGL コンテキスト喪失。起動時に作るのは最初の場面だけ。
import * as THREE from 'three';
import { DEBUG, PALETTE, TIERS, LAYOUT, detectTier } from './config.js';
import { createRenderer, createCamera, fitCamera, createLights, createRoom } from './scene.js';
import { createTextures } from './textures.js';
import { createTray, createScissors } from './props.js';
import { createCustomers } from './animals.js';
import { createFx } from './fx.js';
import { createAudio } from './audio.js';
import { createInput } from './input.js';
import { createFlow } from './flow.js';
import { captureErrors, errors, createDebug, estimateGPU } from './debug.js';
import { createHero } from '../hero/hero.js';

const t0 = performance.now();
captureErrors();
const G = (window.__game = { errors, t0, ready: false });

function start() {
  const canvas = document.getElementById('c');
  const det = detectTier();
  let tier = det.tier;
  G.tier = tier;

  const renderer = createRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = createCamera();
  createLights(scene);
  const tex = createTextures();
  const room = createRoom(scene, tex);
  const fx = createFx(scene, camera, tex, TIERS[tier].particles);
  const audio = createAudio();

  // hero（主役）
  let flow = null;
  const hero = createHero(THREE, {
    renderer, tier, debug: DEBUG, palette: PALETTE,
    textures: { candy: tex.candy, steel: tex.steel, stripes: tex.stripes },
    onEvent: (type, data) => { if (flow) flow.onHeroEvent(type, data); },
  });
  scene.add(hero.root);

  const tray = createTray(scene, tex);
  const scissors = createScissors(scene, tex);
  const customers = createCustomers(scene, fx, audio, tex);
  flow = createFlow({ scene, hero, tray, scissors, customers, fx, audio, tex });

  const input = createInput(canvas, camera, flow.targets, {
    onAnyDown: () => audio.unlock(),
    beforeHeroGrab: (id) => flow.beforeHeroGrab(id),
    // 持ち手をタップしただけ（引かない・回さない）でも、そこがきらっとして「触った」ことが見える
    onHeroTap: (id) => {
      const pts = hero.getStatus().points;
      if (id === 'pull') fx.burst(pts.pullHandle, 'sparkle', 6, 0.5);
      else if (id === 'twist') fx.burst(pts.twistHandle, 'sparkle', 6, 0.5);
    },
    onEmpty: (ray) => {
      // 何もない所を触っても、そこが小さくきらっとする
      const p = new THREE.Vector3();
      if (ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), p) && Math.abs(p.x) < 1.6 && Math.abs(p.z) < 0.8) { fx.burst(p.setY(0.02), 'sparkle', 4, 0.4); audio.play('sparkle'); }
    },
  });

  // ---------- サイズ（ティア別 DPR・画素上限） ----------
  function resize() {
    const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
    const T = TIERS[tier];
    let dpr = T.dpr();
    if (w * h * dpr * dpr > T.maxPixels) dpr = Math.sqrt(T.maxPixels / (w * h));
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, true);
    fitCamera(camera, w / h);
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 200));
  resize();

  // ---------- コンテキスト喪失 ----------
  let lost = false;
  const veil = document.getElementById('veil');
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault(); // 復帰を許す
    lost = true;
    G.contextLost = (G.contextLost || 0) + 1;
    if (veil) veil.classList.add('on');
  }, false);
  canvas.addEventListener('webglcontextrestored', () => {
    // three は自分で GL 状態を作り直し、geometry/texture は次の描画で再転送される。
    // ゲームの状態（JS 側）はそのまま。hero の GPU だけのデータを作り直す。
    for (const k in tex) tex[k].needsUpdate = true;
    try { hero.restoreGPU(); } catch (err) { console.error(err); }
    resize();
    lost = false;
    G.contextRestored = (G.contextRestored || 0) + 1;
    if (veil) veil.classList.remove('on');
  }, false);

  // ---------- 性能の自動調整（mobile で重いときだけ1回 low へ） ----------
  let slowTime = 0, fpsAcc = 0, fpsN = 0, degraded = false;
  function autoTier(dt) {
    if (det.forced || tier !== 'mobile' || degraded) return;
    fpsAcc += dt; fpsN++;
    if (fpsAcc >= 1) {
      const fps = fpsN / fpsAcc;
      slowTime = fps < 40 ? slowTime + fpsAcc : 0;
      fpsAcc = 0; fpsN = 0;
      if (slowTime >= 5) { degraded = true; tier = 'low'; G.tier = tier; resize(); }
    }
  }

  // ---------- シェーダーの下ごしらえ ----------
  // 最初の描画（＝触れる）の後に、まだ画面に出ていない物（飴・袋・粒子）のシェーダーを作っておく。
  // しないと、初めて飴をタップした瞬間に飴のシェーダー（MeshPhysical＋色の層）の作成でコマが止まる。
  // KHR_parallel_shader_compile があれば compileAsync で描画を止めずに作る。
  function warmUp() {
    if (lost) return;
    try {
      flow.prewarm(); // 袋（見えないまま）を作る。起動時ではなく、最初の描画の後
      for (const k in tex) renderer.initTexture(tex[k]); // まだ使っていないテクスチャ（袋のセロハン）も先に GPU へ
      const t = performance.now();
      const done = () => { G.warmUpMs = performance.now() - t; };
      if (renderer.compileAsync) renderer.compileAsync(scene, camera).then(done, (e) => console.warn(e));
      else { renderer.compile(scene, camera); done(); }
    } catch (err) { console.warn(err); }
  }

  // ---------- ループ ----------
  const dbg = DEBUG ? createDebug(renderer, scene, () => ({ tier, hero, phase: flow.F.phase, stage: hero.getStatus().stage })) : null;
  let last = performance.now(), time = 0, first = true;
  function frame(now) {
    requestAnimationFrame(frame);
    const rawMs = now - last;
    last = now;
    if (lost) return;
    const dt = Math.min(0.05, Math.max(0, rawMs / 1000));
    time += dt;
    try {
      input.beginFrame(time);
      const focus = flow.update(dt, time, input.idleTime);
      hero.update(dt, input.hero);
      input.endFrame();
      tray.update(dt, time);
      scissors.update(dt, time);
      for (const b of flow.bags) b.update(dt, time);
      customers.update(dt, time, focus, flow.bagReady);
      fx.update(dt);
      renderer.render(scene, camera);
    } catch (err) {
      console.error(err);
    }
    autoTier(dt);
    if (dbg) dbg.frame(rawMs);
    if (first) {
      first = false;
      G.firstFrameMs = performance.now() - t0;
      G.ready = true;
      const boot = document.getElementById('boot');
      if (boot) boot.classList.add('off');
      setTimeout(warmUp, 30);
    }
  }
  requestAnimationFrame(frame);

  // ---------- 煙テストと debug 用の口 ----------
  Object.assign(G, { THREE, renderer, scene, camera, hero, flow, tray, scissors, customers, input, audio });
  if (DEBUG) {
    G.debug = {
      stats: () => dbg.stats(),
      gpu: () => estimateGPU(renderer, scene, hero),
      // 物の画面上の位置（CSS px）
      screenPos(name) {
        const v = new THREE.Vector3();
        const st = hero.getStatus();
        if (name.startsWith('lump')) { const av = tray.available(); const L = av[+name.slice(4) || 0]; if (!L) return null; L.holder.getWorldPosition(v); }
        else if (name === 'pull') v.copy(st.points.pullHandle);
        else if (name === 'twist') v.copy(st.points.twistHandle);
        else if (name === 'scissors') scissors.group.getWorldPosition(v);
        else if (name.startsWith('rope')) {
          // 棒の範囲は hero の当たり（rope）の箱から取る（hero の寸法を数値で持たない）
          v.copy(st.points.ropeCenter);
          const u = parseFloat(name.split(':')[1]);
          const rt = hero.getHitTargets().find((h) => h.id === 'rope');
          if (!isNaN(u) && rt) { const box = new THREE.Box3().setFromObject(rt.object); const pad = Math.min(0.04, (box.max.x - box.min.x) * 0.05); v.x = box.min.x + pad + (box.max.x - box.min.x - 2 * pad) * u; }
        }
        else if (name === 'bag') { if (!flow.F.bag) return null; flow.F.bag.group.getWorldPosition(v); v.y += 0.12; }
        else if (name === 'customer') { const c = customers.current; if (!c) return null; c.a.root.getWorldPosition(v); v.y += 0.25; }
        else if (name === 'world') { const [x, y, z] = arguments[1]; v.set(x, y, z); }
        else return null;
        v.project(camera);
        const r = canvas.getBoundingClientRect();
        return { x: r.left + (v.x * 0.5 + 0.5) * r.width, y: r.top + (-v.y * 0.5 + 0.5) * r.height };
      },
      loseContext() {
        const ext = renderer.getContext().getExtension('WEBGL_lose_context');
        if (!ext) return false;
        ext.loseContext();
        setTimeout(() => ext.restoreContext(), 400);
        return true;
      },
    };
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
