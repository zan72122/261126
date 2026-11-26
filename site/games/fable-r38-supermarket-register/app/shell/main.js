// 起動：レンダラー・カメラ・場面・hero・流れ・入力・音・デバッグ・コンテキスト喪失。
import * as THREE from './three.js';   // 使う物だけの窓口（ビルドを軽くする）
import { createHero } from '../hero/hero.js';
import { LAYOUT, CAMERA } from './layout.js';
import { detectTier } from './tier.js';
import { createAssets } from './assets.js';
import { createAudio } from './audio.js';
import { createInput } from './input.js';
import { buildEnvironment } from './scene.js';
import { createFlow } from './flow.js';
import { createDebug, estimateGpu } from './debug.js';

const errors = [];
function pushError(msg) {
  errors.push(String(msg).slice(0, 160));
  if (errors.length > 20) errors.shift();
}
window.addEventListener('error', (e) => pushError(e.message || e.error || 'error'));
window.addEventListener('unhandledrejection', (e) => pushError('promise: ' + (e.reason && e.reason.message || e.reason)));

// 乱数（毎回違うお客さん・商品。?seed= で固定できる）
function makeRng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

async function boot() {
  const t0 = performance.now();
  const params = new URLSearchParams(location.search);
  const debugOn = params.get('debug') === '1';
  const tier = detectTier(params);
  const seed = params.has('seed') ? Number(params.get('seed')) : (Date.now() ^ (Math.random() * 1e9));
  const rng = makeRng(seed);

  const canvas = document.getElementById('game');
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: tier.antialias, alpha: false, stencil: false, depth: true,
    powerPreference: 'high-performance', preserveDrawingBuffer: false,
  });
  renderer.setPixelRatio(tier.pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = false;
  renderer.info.autoReset = true;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf3ead9);

  const camera = new THREE.PerspectiveCamera(CAMERA.minFovV, 4 / 3, 0.05, 30);
  camera.position.fromArray(CAMERA.position);
  const camTarget = new THREE.Vector3().fromArray(CAMERA.target);
  camera.lookAt(camTarget);

  const assets = createAssets(THREE, { anisotropy: tier.anisotropy, onError: pushError });
  const env = buildEnvironment(THREE, { layout: LAYOUT, assets, tier });
  scene.add(env.group);

  const audio = createAudio();
  let flow = null;
  const hero = createHero(THREE, {
    layout: LAYOUT,
    tier: { name: tier.name, detail: tier.detail },
    texture: (path, o) => assets.texture(path, o),
    onEvent: (type, data) => { if (flow) flow.onHeroEvent(type, data); },
    random: rng,
  });
  scene.add(hero.root);

  flow = createFlow({ THREE, scene, camera, hero, env, audio, layout: LAYOUT, rng });
  const input = createInput(canvas);
  // iOS は「タッチの処理の中」でしか音を許可しないので、DOM のイベントで直接 unlock する
  for (const type of ['pointerdown', 'pointerup', 'touchend']) canvas.addEventListener(type, () => audio.unlock(), { passive: true });

  // 縦横比に合わせて視野角だけ変える（カメラは動かさない）
  function resize() {
    const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
    let pr = tier.pixelRatio;
    if (tier.name === 'desktop') {
      const maxPx = (tier.maxFramebufferMiB * 1048576) / tier.bytesPerPixel;
      pr = Math.min(pr, Math.max(0.5, Math.sqrt(maxPx / (w * h))));
    }
    if (renderer.getPixelRatio() !== pr) renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const aspect = w / h;
    camera.aspect = aspect;
    const needV = 2 * Math.atan(CAMERA.needHalfWidth / CAMERA.fitDist / aspect) * 180 / Math.PI;
    camera.fov = Math.min(80, Math.max(CAMERA.minFovV, needV));
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- コンテキスト喪失：止めて、戻ったら GPU 資源を作り直す。遊びの状態はそのまま ----
  let contextLost = false;
  let lostCount = 0, restoredCount = 0;
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    contextLost = true; lostCount++;
    input.cancelAll();
    flow.cancelPointer();
    audio.setMotor(false);
  }, false);
  canvas.addEventListener('webglcontextrestored', () => {
    // three は自分の listener で GL の状態を作り直す。形と画像は次の描画で上げ直される。
    assets.restoreGPU();
    hero.restoreGPU();
    resize();
    contextLost = false; restoredCount++;
  }, false);

  let loseExt = null;
  function loseContext(restoreAfterMs = 600) {
    if (!loseExt) loseExt = renderer.getContext().getExtension('WEBGL_lose_context');
    if (!loseExt) return false;
    loseExt.loseContext();
    setTimeout(() => loseExt.restoreContext(), restoreAfterMs);
    return true;
  }

  const timing = { readyMs: 0, firstTouchMs: 0 };
  const ctxInfo = { get lost() { return lostCount; }, get restored() { return restoredCount; } };
  const debug = createDebug({ enabled: debugOn, renderer, scene, tier, hero, flow, errors, timing, ctxInfo, onLoseContext: () => loseContext() });

  // 画面が隠れたら音を止める
  document.addEventListener('visibilitychange', () => { if (document.hidden) audio.suspend(); else audio.resume(); });

  // 画像を待つ（同梱の data URI なのですぐ。最大2.5秒）
  await assets.ready(2500);
  flow.start();

  // 最初の1枚を描いてから幕を消す。
  // シェーダーは今まとめて作る：まだ見えていない物（ハート・飛ぶ花・落ちてくる前の商品・にっこり目など）も一度だけ
  // 見えることにして compile する。こうしないと「渡す → 喜ぶ」の一番大事な瞬間に初めてのシェーダー作りでカクッとする。
  const hidden = [];
  scene.traverse((o) => { if (!o.visible) { hidden.push(o); o.visible = true; } });
  renderer.compile(scene, camera);
  for (const o of hidden) o.visible = false;
  renderer.render(scene, camera);
  const cover = document.getElementById('cover');
  if (cover) { cover.style.opacity = '0'; setTimeout(() => cover.remove(), 400); }
  const readyMs = performance.now() - t0;          // boot() の始まりから
  const firstTouchMs = performance.now();          // ページを開いてから（performance の時間の原点）。この時点で触れる

  timing.readyMs = readyMs; timing.firstTouchMs = firstTouchMs;

  let last = performance.now();
  renderer.setAnimationLoop(() => {
    const now = performance.now();
    const rawDt = Math.max(0, (now - last) / 1000);
    last = now;
    if (contextLost) return;
    const dt = Math.min(rawDt, 0.05);   // 遊びの時間は 0.05 秒で切る（fps の計測は生の値で）
    try {
      const c0 = performance.now();
      flow.update(dt, input.next(), input.down);
      const c1 = performance.now();
      renderer.render(scene, camera);
      debug.frame(rawDt, renderer.info, c1 - c0, performance.now() - c1);
    } catch (err) {
      pushError(err && err.stack ? err.stack.split('\n')[0] : err);
      if (errors.length > 15) renderer.setAnimationLoop(null);
    }
  });

  // 煙テストとデバッグ用の窓口
  const v = new THREE.Vector3();
  window.__r38 = {
    ready: true, readyMs, firstTouchMs, tier, errors, seed,
    get lost() { return contextLost; },
    get lostCount() { return lostCount; },
    get restoredCount() { return restoredCount; },
    state: () => Object.assign({ phase: flow.phase, served: flow.served, customer: flow.customer && flow.customer.def.id, gifts: env.giftColors.length }, hero.getState()),
    stats: () => { debug.refresh(); return Object.assign({}, debug.stats, { gpu: estimateGpu(renderer, scene, tier) }); },
    // hero の当たり判定の物の画面座標（CSS px）
    targets: () => hero.getPickTargets().map((o) => {
      o.getWorldPosition(v).project(camera);
      return { target: o.userData.heroTarget, x: (v.x + 1) / 2 * canvas.clientWidth, y: (1 - v.y) / 2 * canvas.clientHeight };
    }),
    customerScreen: () => {
      const c = flow.customer; if (!c) return null;
      c.headWorld(v).project(camera);
      return { x: (v.x + 1) / 2 * canvas.clientWidth, y: (1 - v.y) / 2 * canvas.clientHeight };
    },
    project: (x, y, z) => { v.set(x, y, z).project(camera); return { x: (v.x + 1) / 2 * canvas.clientWidth, y: (1 - v.y) / 2 * canvas.clientHeight }; },
    loseContext,
    // 煙テスト・計測用：形の NaN と長さ0の法線、GL の資源数
    health: () => Object.assign(debug.scanGeometry(), { programs: (renderer.info.programs || []).length, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures }),
  };
}

boot().catch((e) => { pushError(e && e.stack ? e.stack : e); console.error(e); });
