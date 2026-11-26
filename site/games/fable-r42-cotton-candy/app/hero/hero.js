// hero：割り箸に絡んで、部分ごとに育つ、ふわふわのわたあめ（docs/HERO-SPEC.md の API）。
//   形   ：割り箸に固定した「方向ごとの半径」の場（field.js）。糸が来る側・動かした側だけ半径が増える。
//   見た目：芯（不透明）＋毛羽のシェル（1 draw call のインスタンス）＋表面に巻きつく糸＋釜を舞う糸（materials.js / ribbons.js）。
//   動き ：ばね（厳密解）で指を追い、傾き・回り・揺れる。物理エンジンなし。
// three は import しない（引数の THREE を使う）。編集後は `npm run build:hero`。
import { getBase, createField, resampleField, deposit, decayFresh, writeSurface, measureVolume, surfaceR, nearest, mulberry32 } from './field.js';
import { makeFuzzTexture, makeGlowTexture } from './textures.js';
import { makeSharedUniforms, makeCandyMaterial, makeRibbonMaterial } from './materials.js';
import { createRibbons } from './ribbons.js';

// ================================================================ パラメータ（単位：m・秒・ラジアン。HERO-SPEC §6）
export const P = {
  // ---- 割り箸（2 本がくっついた先細りの角棒）
  stickLength: 0.30, stickW0: 0.0115, stickW1: 0.0068, stickGap: 0.0007, stickSeg: 3,
  candyFromTip: 0.10,       // わたあめの中心：先から棒に沿ってこの距離
  capsuleHalf: 0.055,       // 中心から棒に沿って ± この長さの線分から半径を測る（先から 0.045〜0.155 に綿が付く）
  handleFree: 0.05,         // 持ち手の端から、綿が付かないで残る長さ

  // ---- 形の場
  sub: { low: 10, mid: 16, high: 16 },   // 正二十面体の辺の分割数（方向数 10·sub²+2、三角形 20·sub²）
  subHandle: 8, subCopy: 6,              // 渡したあと／棚のコピーの分割数
  maxLayers: 8, r0: 0.0025,
  rMax: 0.20, tipTrim: 0.6,              // 芯からの最大半径（中心からいちばん遠い所は 毛羽込みでおよそ 0.26）
  layerMin: 0.0004, layerMinDr: 2e-5,    // これより薄い層・少ない量では新しい層を作らない

  // ---- 成長：Δr = rate·dt·w·g(r)、g(r) = (1 − r/rMax)^roomPow·(1 + earlyBoost·exp(−r/earlyR))
  rate: 0.095, roomPow: 0.9,             // m/s
  alphaSrc: 62, alphaMot: 40,            // 核の広がり（度）：糸が来る側／動かした側
  srcW: 0.60, motW: 1.25,                // 重み：糸が来る側／動かした側（速さ speedRef で 1 倍）
  srcStill: 0.5,            // 止めている時は、糸が来る側の重みをこの割合に（ゆっくり丸く）
  uniStill: 0.05, uniMove: 0.03,         // まんべんなく付く分：止めている時／動かしている時
  speedRef: 0.30, speedGainMax: 1.6,
  nearGain: 0.30,           // 回転頭に近いほど速い（中心で +15%、端で −15%）
  earlyBoost: 1.5, earlyR: 0.006,        // 最初のひと巻きだけ速い（触ってすぐ見える）
  fill: 2.2,                // 谷を埋める速さ（1/s）
  organic: 0.35,            // 房ごとの付き方のむら
  tapSeconds: 0.15, tapGain: 0.8,        // タップ：この秒数だけ、この倍率で絡む
  srcY: 0.02,               // 糸が出る高さ（回転頭の縁）
  stageR: [0.035, 0.085, 0.150],

  // ---- 見た目：でこぼこ・毛羽
  lumpAmp: 0.13, lumpFreq: 2.1, lumpFullR: 0.03,
  fluffMin: 0.005, fluffK: 0.13, fluffMax: 0.030, fluffRampR: 0.008,   // 毛羽の長さ = min(max, min + K·r)
  coreInset: 0.55,          // 芯は表面から 毛羽の長さ×これ だけ内側
  freshGain: 260, freshTau: 0.35, freshPuff: 0.6,   // 絡んだばかりの所：白く光り、毛羽が伸びる
  furSway: 0.10,
  layerFull: 0.030,         // 新しい色の層がこの厚みで下の色を覆いきる（薄い所は下の色が房ごとに残る）
  fiberScale: 5.5, fuzzScale: 7.5,       // テクスチャの繰り返し（1/m）
  handleShells: 4, copyShells: 2,        // 渡したあと／棚のコピーのシェル枚数
  // 光（app/shell/world.js の 2 灯＋半球光に合わせた向きと色。world 座標）
  keyDir: [1.2, 3.0, 2.0], keyCol: [0.62, 0.56, 0.47],
  fillDir: [-2.0, 1.5, -1.5], fillCol: [0.07, 0.09, 0.13],
  skyCol: [0.58, 0.56, 0.57], groundCol: [0.40, 0.34, 0.44],
  shadeTint: [0.84, 0.78, 0.92], lightWrap: 0.45, rim: 0.30, aoCore: 0.74,
  cavity: 0.9, cavityIters: 10, cavityRef: 0.005, cavityK: 0.08,   // 房の谷を暗く描く（半径をならしたものとの差）

  // ---- 表面に巻きつく糸（本数はティア別）
  cling: { low: 32, mid: 56, high: 72 }, clingHandle: 30, clingPts: 14,
  clingWidth: 0.0011, clingAlpha: 0.5,

  // ---- 釜を舞う糸（本数は quality.threads）
  threadPts: 12, threadTau: 0.04,        // 1 本の点数、点どうしの時間差
  threadLife: [1.3, 2.0], threadLifeCap: [0.95, 1.35],
  threadWidth: 0.0013, threadAlpha: 0.85,
  nozzles: 4,
  captureRatio: 0.75,       // 持っている間、わたあめに吸い寄せられる糸の割合
  capture: [0.10, 0.50],    // 吸い寄せが始まる／巻き終わる糸の年齢
  wrapOmega: 5.0,           // 巻きつく速さ

  // ---- 割り箸の動き
  restCenter: [0.0, 0.078, 0.03],        // 何もしていない時のわたあめの中心（root 座標）
  handOffset: [0.15, 0.085, 0.235],      // 中心 → 持つ手 の向き（右手前の少し上。画面では右下へ伸びる）
  handFollow: 0.6,          // 手は先の動きのこの割合だけ動く（→ 動かした方へ傾く）
  followW: 20, followZeta: 0.80,         // 中心が指を追うばね
  handW: 10, handZeta: 0.90,             // 手が追うばね（遅れ＝傾き）
  twirlStill: 2.2, twirlMove: 0.8,       // くるくる回る速さ（rad/s）：止めている時は速く（まんべんなく巻いて丸く）、動かすと遅く（動かした側だけ育っていびつに）
  swayW: 9, swayZeta: 0.32, swayGain: 2.4, swayMax: 0.22,   // わたあめが遅れて揺れる
  pulseW: 15, pulseZeta: 0.30,           // 「ぽん」とふくらんで戻る
  bobAmp: 0.013, bobPeriod: 0.7, bobWag: 0.03,   // 光っている時の「ぴょこっ」（上下の振幅・周期・持ち手の横振り）
  popTime: 0.45,
  bottomClear: 0.005,       // わたあめの下がこの高さより下がらないように持ち上げる
  reachK: 0.8,              // 持ち上げの計算に使う半径 = radius × これ

  // ---- かじる
  biteUp: 1.0,              // かじる向きを +Y（割り箸の先＝上）へ寄せる量（カメラから見える所が欠ける）
  biteDepth: 1.25, biteRadius: [0.30, 0.75],   // amount 1 での深さ／球の半径（amount 0 と 1）。どれも平均半径に対する比
};

const TAU = Math.PI * 2;
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const sat = x => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = x => { x = sat(x); return x * x * (3 - 2 * x); };
const easeOutBack = x => { const c1 = 1.70158, c3 = c1 + 1, y = x - 1; return 1 + c3 * y * y * y + c1 * y * y; };

// 減衰ばねの厳密解（dt が大きくても壊れない）。s = { x, v } を target へ
function spring(s, target, w, zeta, dt) {
  const d0 = s.x - target, wd = w * Math.sqrt(Math.max(1e-4, 1 - zeta * zeta));
  const b = (s.v + zeta * w * d0) / wd, ex = Math.exp(-zeta * w * dt), c = Math.cos(wd * dt), sn = Math.sin(wd * dt);
  s.x = target + ex * (d0 * c + b * sn);
  s.v = ex * ((b * wd - zeta * w * d0) * c - (d0 * wd + zeta * w * b) * sn);
}

export function createHero(THREE, opts) {
  const pan = opts.pan, palette = opts.palette, texs = opts.textures || {};
  const emit = (t, d) => { try { opts.onEvent && opts.onEvent(t, d); } catch (e) { /* shell 側の例外で止めない */ } };
  const V3 = THREE.Vector3;
  let quality = { level: 'mid', furShells: 6, threads: 48, triBudget: 50000, ...(opts.quality || {}) };

  const root = new THREE.Group(); root.name = 'hero';
  const own = [];                         // hero.dispose で捨てる物
  const keep = o => (own.push(o), o);

  // ---- 色（線形）
  const palLin = new Float32Array(palette.length * 3), tc = new THREE.Color();
  palette.forEach((p, i) => { tc.setHex(p.color); palLin[i * 3] = tc.r; palLin[i * 3 + 1] = tc.g; palLin[i * 3 + 2] = tc.b; });

  // ---- 共有の資源
  const fuzzTex = keep(makeFuzzTexture(THREE, 512));
  const glowTex = keep(makeGlowTexture(THREE));
  const shared = makeSharedUniforms(THREE, P, texs.cottonFiber || fuzzTex, fuzzTex);
  const ribbonMat = keep(makeRibbonMaterial(THREE));
  const copyMat = keep(makeCandyMaterial(THREE, shared, 'COPY'));
  const stickGeo = keep(makeStickGeometry(THREE));
  const stickMatLive = keep(new THREE.MeshStandardMaterial({ map: texs.wood || null, color: 0xf6e2c2, roughness: 0.7, emissive: 0xffd98a, emissiveIntensity: 0 }));
  const stickMatPlain = keep(new THREE.MeshStandardMaterial({ map: texs.wood || null, color: 0xf6e2c2, roughness: 0.7 }));
  const bound = new THREE.Sphere(new V3(), P.rMax * 1.2 + P.capsuleHalf + P.fluffMax * 2);
  const centerY = P.stickLength - P.candyFromTip;     // 割り箸のローカルで、わたあめの中心の高さ

  // ---- 解像度（先に作っておく：遊んでいる途中で止まらないように）
  let liveBase = getBase(P.sub[quality.level] || P.sub.mid);
  const handleBase = getBase(P.subHandle), copyBase = getBase(P.subCopy);

  // ---- 表面に巻きつく糸の定義（方向の空間で決める。形が育つと一緒に動く）
  const arcRnd = mulberry32(977), ARC_MAX = Math.max(P.cling.low, P.cling.mid, P.cling.high);
  const arcs = [];
  for (let k = 0; k < ARC_MAX; k++) {
    const y = (arcRnd() * 2 - 1) * 0.82, a = arcRnd() * TAU, s = Math.sqrt(1 - y * y);
    arcs.push({
      x: Math.cos(a) * s, y, z: Math.sin(a) * s,
      sweep: 0.5 + arcRnd() * 1.0, drift: (arcRnd() - 0.5) * 0.4, wave: (arcRnd() - 0.5) * 0.12, phase: arcRnd() * TAU,
      lift: 0.25 + arcRnd() * 0.75, flare: arcRnd() < 0.45 ? 0.5 + arcRnd() * 0.9 : 0.15,
      show: 0.010 + arcRnd() * 0.035, width: P.clingWidth * (0.7 + arcRnd() * 0.7), alpha: 0.6 + arcRnd() * 0.4,
    });
  }
  // 糸の各点の方向（解像度に依らない）と、その方向にいちばん近い頂点（解像度ごと）
  const arcDir = new Float32Array(ARC_MAX * P.clingPts * 3);
  for (let k = 0; k < ARC_MAX; k++) {
    const A = arcs[k], pts = P.clingPts;
    for (let j = 0; j < pts; j++) {
      const u = j / (pts - 1), th = -A.sweep * u, c = Math.cos(th), s = Math.sin(th);
      const x = A.x * c + A.z * s, z = -A.x * s + A.z * c, y = A.y + A.drift * u + A.wave * Math.sin(u * TAU + A.phase);
      const l = Math.hypot(x, y, z) || 1, o = (k * pts + j) * 3;
      arcDir[o] = x / l; arcDir[o + 1] = y / l; arcDir[o + 2] = z / l;
    }
  }
  const arcIdxCache = new Map();
  function arcIndices(base) {
    let ix = arcIdxCache.get(base.sub);
    if (ix) return ix;
    ix = new Uint16Array(ARC_MAX * P.clingPts);
    for (let i = 0; i < ix.length; i++) ix[i] = nearest(base, arcDir[i * 3], arcDir[i * 3 + 1], arcDir[i * 3 + 2]);
    arcIdxCache.set(base.sub, ix);
    return ix;
  }
  const arcR = new Float32Array(P.clingPts);

  function shellsFor(base, nCling) {
    const overhead = stickGeo.index.count / 3 + nCling * (P.clingPts - 1) * 2 + (quality.threads | 0) * (P.threadPts - 1) * 2 + 2;
    const byBudget = Math.floor((quality.triBudget - overhead) / base.tris) - 1;
    return Math.max(1, Math.min(quality.furShells | 0, byBudget));
  }

  // ---- わたあめの体（芯＋シェル＋巻きつく糸）。場 field の解像度 base に合わせて作る
  function makeBody(base, nShells, nCling, mats) {
    const n = base.n;
    const A = { pos: new Float32Array(n * 3), nor: new Float32Array(n * 3), c0: new Float32Array(n * 4), c1: new Float32Array(n * 4), fx: new Float32Array(n * 3) };
    const at = {
      position: new THREE.BufferAttribute(A.pos, 3), normal: new THREE.BufferAttribute(A.nor, 3),
      aC0: new THREE.BufferAttribute(A.c0, 4), aC1: new THREE.BufferAttribute(A.c1, 4), aFx: new THREE.BufferAttribute(A.fx, 3),
    };
    const index = new THREE.BufferAttribute(base.index, 1);
    const geo = new THREE.BufferGeometry(), sgeo = new THREE.InstancedBufferGeometry();
    for (const k in at) { at[k].setUsage(THREE.DynamicDrawUsage); geo.setAttribute(k, at[k]); sgeo.setAttribute(k, at[k]); }
    geo.setIndex(index); sgeo.setIndex(index);
    const hs = new Float32Array(nShells);
    for (let i = 0; i < nShells; i++) hs[i] = (i + 1) / nShells;
    sgeo.setAttribute('aShell', new THREE.InstancedBufferAttribute(hs, 1));
    sgeo.instanceCount = nShells;
    geo.boundingSphere = bound; sgeo.boundingSphere = bound;
    const group = new THREE.Group(); group.name = 'candy';
    group.position.set(0, centerY, 0);
    const core = new THREE.Mesh(geo, mats.core); core.name = 'candy-core'; core.renderOrder = 2;
    const shells = new THREE.Mesh(sgeo, mats.shell); shells.name = 'candy-fur'; shells.renderOrder = 3;
    const cling = createRibbons(THREE, ribbonMat, Math.max(1, nCling), P.clingPts);
    cling.mesh.name = 'candy-cling'; cling.mesh.renderOrder = 4; cling.mesh.frustumCulled = true; cling.geo.boundingSphere = bound;
    group.add(core, shells, cling.mesh);
    return { base, A, at, geo, sgeo, group, core, shells, cling, nShells, nCling, arcIx: arcIndices(base) };
  }
  function disposeBody(b) { b.group.removeFromParent(); b.geo.dispose(); b.sgeo.dispose(); b.cling.dispose(); }

  // 場 → 頂点・巻きつく糸・体積
  function refresh(s) {
    const b = s.body, f = s.field, A = b.A;
    writeSurface(f, P, A, s.bite, palLin);
    for (const k in b.at) b.at[k].needsUpdate = true;
    // 巻きつく糸：表面の少し上を、棒のまわりに沿って（方向は式どおり、半径は近い頂点から。糸に沿ってならす）
    const pts = P.clingPts, ix = b.arcIx, cl = b.cling, rr = f.rr;
    for (let k = 0; k < b.nCling; k++) {
      const a = arcs[k];
      for (let j = 0; j < pts; j++) arcR[j] = rr[ix[k * pts + j]];
      for (let j = 0; j < pts; j++) {
        const o = k * pts + j, i = ix[o], u = j / (pts - 1), fl = A.c1[i * 4 + 3];
        const r = (arcR[j > 0 ? j - 1 : 0] + arcR[j] * 2 + arcR[j < pts - 1 ? j + 1 : j]) * 0.25 + fl * (a.lift + a.flare * u * u) + 0.0008;
        const dx = arcDir[o * 3], dy = arcDir[o * 3 + 1], dz = arcDir[o * 3 + 2];
        const al = P.clingAlpha * a.alpha * sat((f.r[i] - a.show) / 0.008) * Math.sin(Math.PI * (0.06 + 0.88 * u)) * (1 - A.fx[i * 3 + 1]) * (0.8 + 0.5 * A.fx[i * 3]);
        cl.put(k, j, dx * r, P.capsuleHalf * dy + dy * r, dz * r, A.c0[i * 4] * 0.5 + 0.5, A.c0[i * 4 + 1] * 0.5 + 0.5, A.c0[i * 4 + 2] * 0.5 + 0.5, al, a.width);
      }
      cl.finish(k);
    }
    cl.setCount(b.nCling); cl.commit();
    f.volume = measureVolume(b.base, A.pos);
  }

  // ---- 1 本の割り箸（＋わたあめ）
  let seedCounter = (Math.random() * 1e6) | 0;      // 毎回ちがう房のむら
  function makeStick() {
    const obj = new THREE.Group(); obj.name = 'stick';
    const stickMesh = new THREE.Mesh(stickGeo, stickMatLive); stickMesh.name = 'stick-wood'; stickMesh.renderOrder = 2;
    obj.add(stickMesh);
    const mats = { core: makeCandyMaterial(THREE, shared, 'CORE'), shell: makeCandyMaterial(THREE, shared, 'SHELL') };
    const field = createField(liveBase, P, seedCounter++, colorIndex);
    const nCling = P.cling[quality.level] || P.cling.mid;
    const body = makeBody(liveBase, shellsFor(liveBase, nCling), nCling, mats);
    obj.add(body.group);
    const s = {
      obj, stickMesh, mats, field, body, bite: null, biteAmt: 0, biteDir: new V3(0, 0, -1),
      pulse: { x: 0, v: 0 }, swayX: { x: 0, v: 0 }, swayZ: { x: 0, v: 0 },
    };
    refresh(s);
    field.volume0 = field.volume;
    return s;
  }
  function rebuildBody(s, base, nShells, nCling) {
    s.field = resampleField(s.field, base, P);
    const old = s.body;
    s.body = makeBody(base, nShells, nCling, s.mats);
    s.body.group.quaternion.copy(old.group.quaternion); s.body.group.scale.copy(old.group.scale);
    disposeBody(old);
    s.obj.add(s.body.group);
    refresh(s);
  }
  function disposeStick(s) { disposeBody(s.body); s.mats.core.dispose(); s.mats.shell.dispose(); s.obj.removeFromParent(); }

  // わたあめの揺れ・ふくらみ（今の割り箸でも、渡したあとでも同じ式）
  const axis = new V3();
  function settle(s, dt, lagX, lagZ, size) {
    spring(s.pulse, 0, P.pulseW, P.pulseZeta, dt);
    spring(s.swayX, lagX, P.swayW, P.swayZeta, dt);
    spring(s.swayZ, lagZ, P.swayW, P.swayZeta, dt);
    const g = s.body.group, ox = s.swayX.x, oz = s.swayZ.x, len = Math.hypot(ox, oz);
    if (len > 1e-6) {
      axis.set(oz / len, 0, -ox / len);           // Y × o：+Y を o の方へ倒す軸
      g.quaternion.setFromAxisAngle(axis, Math.min(P.swayMax, len * P.swayGain * size));
    } else g.quaternion.identity();
    g.scale.setScalar(clamp(1 + s.pulse.x, 0.75, 1.35));
  }

  // ================================================================ 状態
  let colorIndex = 0, pendingLayer = false;
  let cur = null;
  let popT = 1, popEmitted = true;
  let highlight = 0, hl = 0, time = 0, twirl = 0, tapLeft = 0, grab = 0;
  const goal = new V3(...P.restCenter);                       // 中心に来てほしい点（xz は指、y は持ち上げ込み）
  const C = new V3(...P.restCenter), Cprev = C.clone();       // わたあめの中心（root 座標）
  const sx = { x: C.x, v: 0 }, sy = { x: C.y, v: 0 }, sz = { x: C.z, v: 0 };
  const hx = { x: C.x + P.handOffset[0], v: 0 }, hy = { x: C.y + P.handOffset[1], v: 0 }, hz = { x: C.z + P.handOffset[2], v: 0 };
  const lagX = { x: C.x, v: 0 }, lagZ = { x: C.z, v: 0 };     // 遅れてついてくる点（揺れのもと）
  const dir = new V3(), tip = new V3(), vel = new V3();
  const q = new THREE.Quaternion(), qi = new THREE.Quaternion(), qTw = new THREE.Quaternion();
  const UP = new V3(0, 1, 0);
  const v = new V3(), v2 = new V3();
  const srcL = new V3(0, -1, 0), motL = new V3(1, 0, 0), depW = new V3(0, -1, 0), depL = new V3(0, -1, 0);
  const state = { stage: 0, mass: 0, radius: 0, colorIndex: 0, tip: new V3(), center: new V3(), hasStick: false };
  const evWrap = { amount: 0, point: new V3() }, evStage = { stage: 0 }, evLayer = { colorIndex: 0 }, evPop = {};
  let wrapAcc = 0, wrapT = 0, lastStage = 0, speedS = 0;

  // 当たり判定（見えない太い円柱。割り箸についていく）
  const hit = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.06, 0.06, 0.34, 8)), keep(new THREE.MeshBasicMaterial({ visible: false })));
  hit.name = 'stick-hit'; hit.visible = false; root.add(hit);
  const hitObjects = [hit];

  // 光の輪（「次はここ」）
  // 釜の面で切れて四角く見えないように深度テストなし。不透明の列で「釜のあと・割り箸とわたあめの前」に描く
  // （renderOrder 1 と 2）ので、わたあめの後ろで光って見え、色を白っぽくしない。
  const glowMat = keep(new THREE.SpriteMaterial({
    map: glowTex, color: 0xfff0a8, opacity: 0, transparent: false, depthWrite: false, depthTest: false,
    blending: THREE.CustomBlending, blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
  }));
  const glow = new THREE.Sprite(glowMat); glow.name = 'hero-glow'; glow.renderOrder = 1; glow.visible = false; root.add(glow);

  // ================================================================ 釜を舞う糸
  const rnd = mulberry32(20261126);
  let fly = null, TH = [];
  const curCol = [palLin[0], palLin[1], palLin[2]];
  function seedThread(t, k, spinAngle, initial) {
    t.cap = !!cur && rnd() < P.captureRatio;
    const L = t.cap ? P.threadLifeCap : P.threadLife;
    t.life = L[0] + (L[1] - L[0]) * rnd();
    t.born = initial ? time - rnd() * t.life : time;
    t.phi0 = spinAngle + (k % P.nozzles) * (TAU / P.nozzles) + (rnd() - 0.5) * 0.6;
    t.rw = pan.innerRadius - 0.012 - rnd() * 0.05;      // 落ち着く半径（ボウルの壁の手前）
    t.kr = 1.4 + rnd() * 1.4;
    t.swirl = 2.6 + rnd() * 2.2;
    t.rise = 0.015 + rnd() * 0.085;
    t.wob = rnd() * TAU;
    t.psi0 = (rnd() - 0.5) * 1.5; t.ey = (rnd() - 0.5) * 0.9; t.dy = (rnd() - 0.5) * 0.9;
    t.lift = 0.25 + rnd() * 0.9; t.wOm = P.wrapOmega * (0.7 + 0.6 * rnd());
  }
  function buildThreads() {
    if (fly) fly.dispose();
    const n = Math.max(4, quality.threads | 0);
    fly = createRibbons(THREE, ribbonMat, n, P.threadPts);
    fly.mesh.name = 'threads'; fly.mesh.renderOrder = 4;
    root.add(fly.mesh);
    TH = [];
    for (let k = 0; k < n; k++) { const t = {}; seedThread(t, k, rnd() * TAU, true); TH.push(t); }
    fly.setCount(n);
  }

  function updateThreads(dt, input) {
    const n = TH.length, pts = P.threadPts, rs = pan.spinnerRadius;
    // 色：今のざらめの色へすぐ変わる
    const ck = 1 - Math.exp(-dt * 9);
    for (let i = 0; i < 3; i++) curCol[i] += (palLin[colorIndex * 3 + i] - curCol[i]) * ck;
    const cr = curCol[0] * 0.6 + 0.4, cg = curCol[1] * 0.6 + 0.4, cb = curCol[2] * 0.6 + 0.4;
    // 巻きつく先（今の割り箸のローカル → root）
    const s = cur, f = s ? s.field : null;
    let m = null, sc = 1;
    if (s) { m = s.obj.matrix.elements; sc = s.body.group.scale.x; }
    const c0 = P.capture[0], c1 = P.capture[1];
    for (let k = 0; k < n; k++) {
      const t = TH[k];
      let a = time - t.born;
      if (a > t.life || a < 0) { seedThread(t, k, input.spinAngle || 0, false); a = 0; }
      const fade = sat(a / 0.08) * sat((t.life - a) / (t.life * 0.3));
      const wrapOn = t.cap && s && grab > 0.002;
      for (let j = 0; j < pts; j++) {
        const aj = Math.max(0, a - j * P.threadTau);
        // 自由に舞う道：回転頭の縁から、らせんに広がりながら上がる（上から見て反時計回り）
        const e = 1 - Math.exp(-aj * t.kr);
        const rho = rs + (t.rw - rs) * e;
        const phi = t.phi0 + t.swirl * (1 - Math.exp(-aj * 2.0)) + 0.5 * aj;
        let x = Math.cos(phi) * rho, z = -Math.sin(phi) * rho;
        let y = 0.006 + t.rise * (1 - Math.exp(-aj * 1.6)) + 0.007 * Math.sin(aj * 5 + t.wob) * e;
        let al = P.threadAlpha;
        if (wrapOn) {
          const w = smooth((aj - c0) / (c1 - c0)) * grab;
          if (w > 0) {
            // 絡む道：糸が当たる側から入り、棒の軸のまわりに巻く
            const wa = Math.max(0, aj - c1), psi = t.psi0 - t.wOm * wa, cs = Math.cos(psi), sn = Math.sin(psi);
            let ex = depL.x * cs + depL.z * sn, ez = -depL.x * sn + depL.z * cs, ey = depL.y + t.ey + t.dy * wa;
            const l = Math.hypot(ex, ey, ez) || 1; ex /= l; ey /= l; ez /= l;
            const rsurf = surfaceR(f, P, ex, ey, ez);
            const rr = (rsurf + Math.min(P.fluffMax, P.fluffMin + P.fluffK * rsurf) * t.lift + 0.003) * sc;
            const lx = ex * rr, ly = centerY + P.capsuleHalf * ey + ey * rr, lz = ez * rr;
            const wx = m[0] * lx + m[4] * ly + m[8] * lz + m[12], wy = m[1] * lx + m[5] * ly + m[9] * lz + m[13], wz = m[2] * lx + m[6] * ly + m[10] * lz + m[14];
            x += (wx - x) * w; y += (wy - y) * w; z += (wz - z) * w;
            al = P.threadAlpha * (1 + 0.15 * w);
          }
        }
        const u = j / (pts - 1);
        fly.put(k, j, x, y, z, cr, cg, cb, al * fade * Math.sin(Math.PI * (0.04 + 0.92 * u)), P.threadWidth);
      }
      fly.finish(k);
    }
    fly.commit();
  }

  // ================================================================ 割り箸の姿勢
  function poseStick(dt, input, holding) {
    // 行き先：xz は指（タップ）の点、y は大きさに合わせて持ち上げる
    if (holding) { goal.x = input.target.x; goal.z = input.target.z; }
    const R = state.radius * P.reachK + (state.radius > 0.01 ? 0.01 : 0);
    let y = Math.max(P.restCenter[1], P.bottomClear + R);
    const dh = pan.innerRadius - Math.hypot(goal.x, goal.z);
    if (dh < R) y = Math.max(y, pan.rimY + Math.sqrt(Math.max(0, R * R - dh * dh)) - 0.01);   // 縁をまたぐ
    y += hl * P.bobAmp * Math.abs(Math.sin(Math.PI * time / P.bobPeriod));                      // ぴょこっ
    goal.y = y;
    spring(sx, goal.x, P.followW, P.followZeta, dt);
    spring(sy, goal.y, P.followW, P.followZeta, dt);
    spring(sz, goal.z, P.followW, P.followZeta, dt);
    C.set(sx.x, sy.x, sz.x);
    // 手：先の動きの一部だけ動く → 動かした方へ傾く。遅れて追う
    const f = P.handFollow, r0 = P.restCenter, ho = P.handOffset;
    const wag = hl * P.bobWag * Math.sin(TAU * time / P.bobPeriod);                              // 光っている時は持ち手も小さく振る
    spring(hx, r0[0] + (goal.x - r0[0]) * f + ho[0] + wag, P.handW, P.handZeta, dt);
    spring(hy, goal.y + ho[1], P.handW, P.handZeta, dt);
    spring(hz, r0[2] + (goal.z - r0[2]) * f + ho[2], P.handW, P.handZeta, dt);
    dir.set(C.x - hx.x, C.y - hy.x, C.z - hz.x);
    if (dir.lengthSq() < 1e-8) dir.set(-0.58, -0.48, -0.65);
    dir.normalize();
    // 速さ（育ち方と回り方に使う）
    vel.copy(C).sub(Cprev).divideScalar(dt); Cprev.copy(C);
    const sp = Math.min(vel.length(), 3);
    speedS += (sp - speedS) * (1 - Math.exp(-dt * 14));
    // くるくる：持っている間はゆっくり、動かすと速く
    if (holding || tapLeft > 0) twirl = (twirl + (P.twirlMove + (P.twirlStill - P.twirlMove) / (1 + speedS / P.speedRef * 2)) * dt) % TAU;
    q.setFromUnitVectors(UP, dir);
    qTw.setFromAxisAngle(UP, twirl);
    q.multiply(qTw);
    qi.copy(q).invert();
    tip.copy(C).addScaledVector(dir, P.candyFromTip);
    // 遅れてついてくる点 → わたあめの揺れ
    spring(lagX, C.x, P.swayW, P.swayZeta, dt);
    spring(lagZ, C.z, P.swayW, P.swayZeta, dt);
    if (cur) {
      const o = cur.obj;
      const k = Math.min(1, popT), pop = k < 1 ? Math.max(0.001, easeOutBack(k)) : 1;
      o.quaternion.copy(q);
      o.position.copy(C).addScaledVector(dir, -centerY * pop);
      o.scale.setScalar(pop);
      o.updateMatrix();
      v.set(lagX.x - C.x, 0, lagZ.x - C.z).applyQuaternion(qi);
      settle(cur, dt, v.x, v.z, sat(state.radius / 0.09));
    }
    hit.position.copy(C).addScaledVector(dir, P.candyFromTip - P.stickLength * 0.5);
    hit.quaternion.copy(q);
  }

  // ================================================================ 毎フレーム
  function update(dt, input) {
    if (!(dt > 0)) return;
    dt = Math.min(dt, 0.1);
    time += dt;
    shared.uTime.value = time;
    if (popT < 1) { popT += dt / P.popTime; if (popT >= 1 && !popEmitted) { popEmitted = true; emit('pop', evPop); } }
    hl += (highlight - hl) * (1 - Math.exp(-dt * 8));

    // タップ：その点へ「ぴょん」と寄って、少し絡む
    if (input.taps && input.taps.length && cur) {
      const p = input.taps[input.taps.length - 1];
      goal.x = p.x; goal.z = p.z;
      tapLeft = P.tapSeconds;
      sy.v += 0.55;                              // 小さく跳ねる
      cur.pulse.v += 1.2;
    }
    const holding = !!(input.holding && input.target && cur);
    poseStick(dt, input, holding);
    grab += ((holding || tapLeft > 0 ? 1 : 0) - grab) * (1 - Math.exp(-dt * (holding || tapLeft > 0 ? 14 : 5)));

    let dirty = false;
    if (cur) {
      const f = cur.field;
      // 糸が来る側：わたあめの中心から回転頭の縁の高さへ（＝釜の中心軸に近づけた側）
      v.set(-C.x, P.srcY - C.y, -C.z);
      if (v.lengthSq() < 1e-8) v.set(0, -1, 0);
      v.normalize();
      const mAmt = Math.min(P.speedGainMax, speedS / P.speedRef);
      if (speedS > 0.03) v2.copy(vel).normalize(); else v2.set(0, 0, 0);
      if (holding || tapLeft > 0) {
        const tapping = !holding;
        const eff = tapping ? Math.min(dt, tapLeft) * P.tapGain : dt;
        const near = 1 + P.nearGain * (0.5 - Math.min(1, Math.hypot(C.x, C.z) / pan.moveRadius));
        srcL.copy(v).applyQuaternion(qi);
        const motW = speedS > 0.03 ? P.motW * mAmt : 0;
        if (motW > 0) motL.copy(v2).applyQuaternion(qi);
        const moving = smooth((mAmt - 0.15) / 0.5);
        const uni = P.uniStill + (P.uniMove - P.uniStill) * moving;
        const srcW = P.srcW * (P.srcStill + (1 - P.srcStill) * moving);
        const mean = deposit(f, P, eff * near, srcL, srcW, motL, motW, uni, colorIndex, P.organic);
        if (mean > 0) {
          dirty = true; wrapAcc += mean;
          if (pendingLayer) { pendingLayer = false; evLayer.colorIndex = colorIndex; emit('layer', evLayer); cur.pulse.v += 0.8; }
        }
        // 糸が巻きつく入口：育っている側（糸が来る側と動かした側の重み付き）
        depW.copy(v).multiplyScalar(srcW).addScaledVector(v2, motW);
        if (depW.lengthSq() < 1e-8) depW.copy(v);
        depW.normalize();
      }
      if (tapLeft > 0) tapLeft -= dt;
      depL.copy(depW).applyQuaternion(qi);
      if (decayFresh(f, P, dt)) dirty = true;
      if (dirty) { refresh(cur); measure(); }
    }

    // イベント
    wrapT += dt;
    if (wrapT > 1 / 12 && wrapAcc > 0) {
      evWrap.amount = Math.min(1, wrapAcc / 0.0012);
      evWrap.point.copy(C).addScaledVector(depW, state.radius * 0.7);
      emit('wrap', evWrap);
      wrapAcc = 0; wrapT = 0;
    }
    if (state.stage > lastStage) {
      evStage.stage = state.stage; emit('stage', evStage);
      if (cur) cur.pulse.v += 1.6 + 0.5 * state.stage;      // 「ぽん」
    }
    lastStage = state.stage;

    updateThreads(dt, input);

    // 光る・ぴょこっ
    const pulse = 0.6 + 0.4 * Math.sin(time * 6);
    glow.visible = !!cur && hl > 0.01;
    glow.position.copy(C);
    glow.scale.setScalar(0.28 + state.radius * 2.3);
    glowMat.opacity = hl * (0.55 + 0.35 * pulse) / (1 + state.radius * 5);   // 大きいわたあめでは控えめに
    stickMatLive.emissiveIntensity = hl * (0.35 + 0.45 * pulse);
    if (cur) { const g = hl * 0.5 * pulse; cur.mats.core.uniforms.uGlow.value = g; cur.mats.shell.uniforms.uGlow.value = g; }

    state.colorIndex = colorIndex; state.tip.copy(tip); state.center.copy(C); state.hasStick = !!cur;
  }

  function measure() {
    const f = cur.field;
    const mass = Math.max(0, f.volume - f.volume0);
    state.mass = mass;
    state.radius = f.radius > 0 ? f.radius + Math.min(P.fluffMax, P.fluffMin + P.fluffK * f.radius) * 0.7 : 0;
    const req = Math.cbrt(mass * 3 / (4 * Math.PI));
    let st = 0;
    for (let i = 0; i < 3; i++) if (req >= P.stageR[i]) st = i + 1;
    if (st > state.stage) state.stage = st;                  // 下がらない
  }

  // ================================================================ かじる
  function setBiteOn(s, amount, dirLocal) {
    const a = sat(amount || 0);
    if (dirLocal) s.biteDir.copy(dirLocal);
    if (Math.abs(a - s.biteAmt) < 0.004) return;
    s.biteAmt = a;
    if (a < 0.004) s.bite = null;
    else {
      const f = s.field, b = s.bite || (s.bite = { n: 3, x: new Float32Array(3), y: new Float32Array(3), z: new Float32Array(3), rad: new Float32Array(3) });
      // かじる向き：顔の方向を、割り箸の先（上）へ少し寄せる
      v.copy(s.biteDir); if (v.lengthSq() < 1e-8) v.set(0, 0, -1);
      v.normalize(); v.y += P.biteUp; v.normalize();
      const Rs = surfaceR(f, P, v.x, v.y, v.z), Rm = Math.max(f.meanR, 0.01);
      const rad = Rm * (P.biteRadius[0] + P.biteRadius[1] * a), off = Rs + rad - a * Rm * P.biteDepth;
      const cx = v.x * off, cy = P.capsuleHalf * v.y + v.y * off, cz = v.z * off;
      v2.set(v.z, 0, -v.x); if (v2.lengthSq() < 1e-8) v2.set(1, 0, 0);
      v2.normalize();                                      // 横（歯形を 3 つ並べる）
      b.x[0] = cx; b.y[0] = cy; b.z[0] = cz; b.rad[0] = rad;
      for (let k = 1; k < 3; k++) {
        const sg = k === 1 ? 1 : -1, d = rad * 0.7;
        b.x[k] = cx + v2.x * d * sg + v.x * rad * 0.22; b.y[k] = cy + v.y * rad * 0.22; b.z[k] = cz + v2.z * d * sg + v.z * rad * 0.22;
        b.rad[k] = rad * 0.55;
      }
    }
    refresh(s);
  }

  // 棚に並べる静止コピー：芯＋シェル copyShells 枚を 1 つの形に焼く（draw call 2：割り箸、わたあめ）
  function makeCopy(s) {
    const f = resampleField(s.field, copyBase, P), n = copyBase.n, K = P.copyShells, T = copyBase.index.length;
    const A = { pos: new Float32Array(n * 3), nor: new Float32Array(n * 3), c0: new Float32Array(n * 4), c1: new Float32Array(n * 4), fx: new Float32Array(n * 3) };
    f.fresh.fill(0);
    writeSurface(f, P, A, s.bite, palLin);
    const rep = (src, size) => { const o = new Float32Array(src.length * (K + 1)); for (let k = 0; k <= K; k++) o.set(src, k * n * size); return o; };
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(rep(A.pos, 3), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(rep(A.nor, 3), 3));
    g.setAttribute('aC0', new THREE.BufferAttribute(rep(A.c0, 4), 4));
    g.setAttribute('aC1', new THREE.BufferAttribute(rep(A.c1, 4), 4));
    g.setAttribute('aFx', new THREE.BufferAttribute(rep(A.fx, 3), 3));
    const sh = new Float32Array(n * (K + 1)), idx = new Uint16Array(T * (K + 1));
    for (let k = 0; k <= K; k++) {
      sh.fill(k === 0 ? -1 : k / K, k * n, (k + 1) * n);
      for (let i = 0; i < T; i++) idx[k * T + i] = copyBase.index[i] + k * n;
    }
    g.setAttribute('aShell', new THREE.BufferAttribute(sh, 1));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.boundingSphere = bound;
    const o = new THREE.Group(); o.name = 'candy-copy';
    const candy = new THREE.Mesh(g, copyMat); candy.position.set(0, centerY, 0);
    o.add(new THREE.Mesh(stickGeo, stickMatPlain), candy);
    return { object: o, dispose() { g.dispose(); o.removeFromParent(); } };
  }

  // ================================================================ 手放す・新しい割り箸
  function release() {
    if (!cur || state.stage < 1) return null;
    const s = cur; cur = null;
    // 見た目はそのまま、軽くする（HERO-SPEC §5：三角形 ≤ 7,500、draw call ≤ 4）
    s.field.fresh.fill(0); s.field.anyFresh = false;
    rebuildBody(s, handleBase, Math.min(P.handleShells, quality.furShells | 0), P.clingHandle);
    s.stickMesh.material = stickMatPlain;
    s.mats.core.uniforms.uGlow.value = 0; s.mats.shell.uniforms.uGlow.value = 0;
    s.obj.scale.setScalar(1);
    const used = s.field.used.length ? s.field.used : [colorIndex];
    let alive = true;
    const handle = {
      object: s.obj,
      candyCenter: new V3(0, centerY, 0),
      radius: state.radius,
      colors: used.map(i => palette[i].color),
      outerColor: palette[s.field.lastColor].color,
      update(dt) { if (alive && dt > 0) settle(s, Math.min(dt, 0.1), 0, 0, 1); },
      setBite(amount, dirLocal) { if (alive) setBiteOn(s, amount, dirLocal); },
      makeDisplayCopy() { return makeCopy(s); },
      dispose() { if (alive) { alive = false; disposeStick(s); } },
    };
    state.stage = 0; lastStage = 0; state.mass = 0; state.radius = 0; state.hasStick = false;
    wrapAcc = 0; tapLeft = 0;
    return handle;
  }

  function newStick() {
    if (cur) disposeStick(cur);
    cur = makeStick();
    root.add(cur.obj);
    popT = 0; popEmitted = false;
    goal.set(...P.restCenter);
    sx.x = goal.x; sy.x = goal.y; sz.x = goal.z; sx.v = sy.v = sz.v = 0;
    hx.x = goal.x + P.handOffset[0]; hy.x = goal.y + P.handOffset[1]; hz.x = goal.z + P.handOffset[2]; hx.v = hy.v = hz.v = 0;
    lagX.x = goal.x; lagZ.x = goal.z; lagX.v = lagZ.v = 0;
    C.copy(goal); Cprev.copy(goal); speedS = 0; tapLeft = 0;
    state.stage = 0; lastStage = 0; state.mass = 0; state.radius = 0; state.hasStick = true;
    pendingLayer = false;
    cur.obj.scale.setScalar(0.001);
  }

  buildThreads();
  newStick();
  popT = 1; popEmitted = true;   // 最初の 1 本は最初から出ている
  poseStick(1 / 60, { holding: false, target: null }, false);

  return {
    root, hitObjects, update, release, newStick,
    setColor(i) {
      i |= 0;
      if (!(i >= 0 && i < palette.length)) return;
      if (i !== colorIndex) pendingLayer = true;
      colorIndex = i; state.colorIndex = i;
    },
    setHighlight(x) { highlight = sat(+x || 0); },
    getState() { return state; },
    setQuality(qu) {
      quality = { ...quality, ...(qu || {}) };
      liveBase = getBase(P.sub[quality.level] || P.sub.mid);
      if (cur) {
        const nCling = P.cling[quality.level] || P.cling.mid;
        rebuildBody(cur, liveBase, shellsFor(liveBase, nCling), nCling);
        cur.field.volume0 = measureVolume(liveBase, emptyPositions(liveBase));
        measure();
      }
      buildThreads();
    },
    onContextRestored() {
      // RenderTarget は持たない。Canvas テクスチャと材質を貼り直させる（形は CPU 側にあるのでそのまま）
      fuzzTex.needsUpdate = true; glowTex.needsUpdate = true;
      for (const o of own) if (o.isMaterial) o.needsUpdate = true;
      if (cur) { cur.mats.core.needsUpdate = true; cur.mats.shell.needsUpdate = true; }
    },
    dispose() {
      if (cur) { disposeStick(cur); cur = null; }
      if (fly) { fly.dispose(); fly = null; }
      for (const o of own) o.dispose && o.dispose();
      root.removeFromParent();
    },
  };

  // 何も付いていない時の表面（体積の基準に使う）
  function emptyPositions(base) {
    const n = base.n, D = base.dirs, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = D[i * 3] * P.r0; pos[i * 3 + 1] = P.capsuleHalf * D[i * 3 + 1] + D[i * 3 + 1] * P.r0; pos[i * 3 + 2] = D[i * 3 + 2] * P.r0;
    }
    return pos;
  }
}

// ================================================================ 割り箸の形
// 2 本がくっついた先細りの角棒。原点＝持ち手の端、+Y＝先。木目は長さ方向
function makeStickGeometry(THREE) {
  const parts = [];
  for (const sgn of [-1, 1]) {
    const g = new THREE.BoxGeometry(1, 1, 1, 1, P.stickSeg, 1);
    const pos = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const t = pos.getY(i) + 0.5;
      const w = P.stickW0 + (P.stickW1 - P.stickW0) * t;           // 2 本合わせた幅
      const half = w / 2 - P.stickGap, depth = w * 0.56;
      const cx = sgn * (w / 4 + P.stickGap / 2);
      const x = cx + pos.getX(i) * half, z = pos.getZ(i) * depth;
      pos.setXYZ(i, x, t * P.stickLength, z);
      uv.setXY(i, 0.3 + sgn * 0.11 + pos.getX(i) * 0.05 + pos.getZ(i) * 0.03, t * 1.1);
    }
    g.computeVertexNormals();
    parts.push(g);
  }
  // 1 つにまとめる（1 draw call）
  let nv = 0, ni = 0;
  for (const g of parts) { nv += g.attributes.position.count; ni += g.index.count; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), idx = new Uint16Array(ni);
  let vo = 0, io = 0;
  for (const g of parts) {
    pos.set(g.attributes.position.array, vo * 3); nor.set(g.attributes.normal.array, vo * 3); uv.set(g.attributes.uv.array, vo * 2);
    for (let i = 0; i < g.index.count; i++) idx[io + i] = g.index.array[i] + vo;
    vo += g.attributes.position.count; io += g.index.count;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  out.computeBoundingSphere();
  return out;
}
