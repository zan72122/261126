// 起動：レンダラー・カメラ・場面・hero・流れ・入力・音・デバッグ・コンテキスト喪失。
import * as THREE from './three.js';   // 使う物だけの窓口（ビルドを軽くする）
import { createHero } from '../hero/hero.js';
import { LAYOUT } from './layout.js';
import { createCameraRig } from './camera.js';
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

  const camera = new THREE.PerspectiveCamera(40, 4 / 3, 0.05, 30);
  const rig = createCameraRig(THREE, camera);

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

  // ---- 全画面：キャンバスは CSS で画面いっぱい（100dvh）。描画の画素数だけを決める ----
  // 内部の描画解像度の倍率（自動降格）：重い時は表示の大きさはそのまま、描く画素だけを 1.0 → 0.85 → 0.75 倍に下げる。
  // ?rs=0.85 などで固定もできる（自動降格は止まる）。
  const forcedScale = params.has('rs') ? Math.min(1, Math.max(0.5, Number(params.get('rs')) || 1)) : 0;
  const SCALES = [1, 0.85, 0.75];
  const perf = { level: 0, scale: forcedScale || 1, acc: 0, n: 0, good: 0, ups: 0, settle: 2.0, changes: 0 };
  let viewW = 0, viewH = 0, basePr = tier.pixelRatio;
  function measure() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width || window.innerWidth));
    const h = Math.max(1, Math.round(r.height || window.innerHeight));
    return [w, h];
  }
  function applyPixels(w, h) {
    let pr = tier.pixelRatio;
    if (tier.name === 'desktop') {
      const maxPx = (tier.maxFramebufferMiB * 1048576) / tier.bytesPerPixel;
      pr = Math.min(pr, Math.max(0.5, Math.sqrt(maxPx / (w * h))));
    }
    basePr = pr;
    const want = pr * perf.scale;
    if (renderer.getPixelRatio() !== want) renderer.setPixelRatio(want);
    renderer.setSize(w, h, false);   // CSS の大きさは触らない（いつも画面いっぱい）
  }
  function resize(force) {
    const [w, h] = measure();
    if (!force && w === viewW && h === viewH) return;
    viewW = w; viewH = h;
    applyPixels(w, h);
    rig.resize(w, h);
    perf.settle = 1.0;               // 大きさが変わった直後は fps を数えない
  }
  const onViewChange = () => {
    resize();
    // iOS は回転直後の大きさが古いことがあるので、少しあとにもう一度見る
    setTimeout(resize, 120); setTimeout(resize, 400);
  };
  window.addEventListener('resize', onViewChange);
  window.addEventListener('orientationchange', onViewChange);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', onViewChange);
  resize(true);

  // 自動降格：2秒ごとに平均のフレーム時間を見る。48fps を下回ったら一段下げ、57fps 以上が8秒続いたら一段戻す（戻すのは2回まで）
  function adaptScale(rawDt) {
    if (forcedScale || document.hidden) return;
    if (perf.settle > 0) { perf.settle -= rawDt; return; }
    if (rawDt > 0.25) return;        // タブの切り替えなどの止まりは数えない
    perf.acc += rawDt; perf.n++;
    if (perf.acc < 2) return;
    const fps = perf.n / perf.acc;
    perf.acc = 0; perf.n = 0;
    let next = perf.level;
    if (fps < 48 && perf.level < SCALES.length - 1) { next = perf.level + 1; perf.good = 0; }
    else if (fps >= 57 && perf.level > 0 && perf.ups < 2) { perf.good += 2; if (perf.good >= 8) { next = perf.level - 1; perf.good = 0; perf.ups++; } }
    else perf.good = 0;
    if (next !== perf.level) {
      perf.level = next; perf.scale = SCALES[next]; perf.changes++;
      applyPixels(viewW, viewH);
      perf.settle = 1.0;
    }
  }

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
    resize(true);
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
  const debug = createDebug({ enabled: debugOn, renderer, scene, tier, hero, flow, errors, timing, ctxInfo, rig, perf, onLoseContext: () => loseContext() });

  // 画面が隠れたら音を止める
  document.addEventListener('visibilitychange', () => { if (document.hidden) audio.suspend(); else audio.resume(); });

  // 画像を待つ（同梱の data URI なのですぐ。最大2.5秒）
  await assets.ready(2500);
  flow.start();
  rig.update(0, flow.phase, hero.getState());

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
      resize();                          // 取りこぼした大きさの変化を拾う（同じなら何もしない）
      adaptScale(rawDt);
      const c0 = performance.now();
      // 先にカメラを動かす → 同じフレームの指の判定（レイキャスト）は、いま描くカメラで行われる
      rig.update(dt, flow.phase, hero.getState());
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
    camera: () => Object.assign({}, rig.info, { renderScale: perf.scale, level: perf.level, w: viewW, h: viewH, drawW: canvas.width, drawH: canvas.height }),
    setShot: (name) => rig.setShot(name, true),
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
