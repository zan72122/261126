// hero（主役）：飴引き機と、伸ばす・折る・ねじるで変わる飴、その中に残っていく色の層。
// API は docs/HERO-SPEC.md のとおり（createHero）。物理エンジンは使わず、動きと変形は数式で整合させる。
// くわしい説明・パラメータ・限界は docs/hero-notes.md。
//
// 飴の持ち方：
//   ・長さ方向は「体積で測った座標 t（0〜1）」。den[i] = その場所の長さの密度（m / t）。
//     伸ばす＝den を足す（細い所・高い所・速く引いた手元ほどよく伸びる）。半径は体積一定から r = r1·√(本数·len0 / den)。
//   ・色の層は op の履歴（かたまり・折り・ねじり）で、candyMaterial.js のシェーダーが逆順にたどる。
//     伸ばす操作は den（形）だけを変え、色の写像は t に乗っているので、前の層も一緒に細くなる。
//   ・中心線は 左チャック L → 右チャック H の3次ベジェ（余った長さは垂れ、台に着いたら横に広がる）。
//   ・折りは2段：輪が2本の帯になってフックへ集まる → 8の字の2本が1本の丸へ溶ける（縞が倍になるのが見える）。
//   ・切ったピースは、その時の op を凍結した uniform を持つ同じシェーダーで断面を描く（テクスチャなし）。
import { createCandyMaterial, createCandyUniforms, snapshotUniforms, packOps, MAX_OPS, OP_LUMP, OP_FOLD, OP_TWIST } from './candyMaterial.js';
import { createMachine } from './machine.js';

export function createHero(THREE, opts) {
  const V3 = THREE.Vector3;
  opts = opts || {};
  const tier = opts.tier || 'high';
  const textures = opts.textures || {};
  const palette = (opts.palette && opts.palette.length ? opts.palette : [{ key: 'pink', color: 0xff8fb8 }]);
  const emit = (type, data) => { try { opts.onEvent && opts.onEvent(type, data || {}); } catch (e) { console.error(e); } };

  // ---------- パラメータ（寸法はメートル。HERO-SPEC §5 を元に、本物用に調整） ----------
  const P = {
    L: new V3(-0.40, 0.26, 0),             // 左チャック（飴の左端・ねじる側）
    CT: new V3(-0.56, 0.44, 0.05),         // ねじる持ち手の中心
    wheelR: 0.085, twistKnobR: 0.038,
    A: new V3(0.12, 0.74, -0.20),          // アームの支点
    H0: new V3(-0.02, 0.26, 0),            // 引く持ち手（右チャック）の休みの位置
    hMin: new V3(-0.30, 0.085, 0), hMax: new V3(0.525, 0.56, 0),
    knobOffset: new V3(0.085, 0, 0.035), pullKnobR: 0.05, chuckR: 0.036,
    base: { w: 1.10, d: 0.16, h: 0.03, x: 0, z: -0.24 },
    follow: 0.06,                          // 指への追従の時定数（秒）
    r1: 0.034, len0: 0.38,                 // 1本ぶんの半径係数・休みの長さ
    rCap: 0.085, lenMin: 0.19,             // 太さの上限（＝折った後の長さの下限を決める）
    foldDist: 0.15, foldNeed: 1.4, foldT1: 0.16, foldT2: 0.26, foldRelax: 0.3,
    maxFolds: 8,                           // これより古い折りは平均色に畳む
    kappa: 0.55,                           // ねじりで芯が遅れる割合（断面の渦）
    rollGear: 2.2,                         // 引く向きの変化 → 右チャックの転がり
    lumpAlpha: -0.5, lumpTime: 0.42,       // かたまりが乗る向き（カメラから帯が見える向き）・広がる時間
    rodX0: -0.42, rodX1: 0.42, rodZ: 0.06, rollTime: 0.8,
    cutGap: 0.02, cutMinSep: 0.085,
    oval: 0.07,                            // 断面の楕円の強さ（ねじれが形で見える）
    pieceT: 0.022, pieceRMax: 0.06, pieceRMin: 0.032, pieceK: 1.6, stickL: 0.11, stickR: 0.006, pieceTilt: 0.3,
  };
  const SEG = { high: [160, 32], mobile: [120, 24], low: [80, 16] }[tier] || [120, 24];
  const NS = SEG[0], NR = SEG[1];
  const rodLen = P.rodX1 - P.rodX0;

  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
  const sstep = (a, b, x) => smooth((x - a) / (b - a));
  const backOut = (t) => { t = clamp(t, 0, 1); const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const wrapPi = (a) => a - Math.PI * 2 * Math.floor(a / (Math.PI * 2) + 0.5);

  const root = new THREE.Group();
  root.name = 'hero';
  const owned = { geos: [], mats: [] };

  // ---------- 機械 ----------
  const machine = createMachine(THREE, P, textures);
  root.add(machine.group);

  // ---------- 色 ----------
  const palLinear = new Float32Array(18);
  {
    const c = new THREE.Color();
    for (let i = 0; i < 6; i++) {
      c.setHex((palette[i] || palette[i % palette.length]).color);
      palLinear[i * 3] = c.r; palLinear[i * 3 + 1] = c.g; palLinear[i * 3 + 2] = c.b;
    }
  }
  const U = createCandyUniforms(THREE, palLinear);
  const candyMat = createCandyMaterial(THREE, textures.candy, U);
  owned.mats.push(candyMat);

  // ---------- 飴のメッシュ（固定バッファを毎フレーム書き換えるチューブ） ----------
  const ringCount = NS + 1;
  const vPer = NR + 1;
  const vCount = ringCount * vPer;
  const pos = new Float32Array(vCount * 3), nor = new Float32Array(vCount * 3), uvs = new Float32Array(vCount * 2), cnd = new Float32Array(vCount * 3);
  const ropeGeo = new THREE.BufferGeometry();
  {
    const idx = vCount > 65535 ? new Uint32Array(NS * NR * 6) : new Uint16Array(NS * NR * 6);
    let o = 0;
    for (let i = 0; i < NS; i++) for (let j = 0; j < NR; j++) {
      const a = i * vPer + j, b = a + vPer;
      idx[o++] = a; idx[o++] = a + 1; idx[o++] = b; idx[o++] = b; idx[o++] = a + 1; idx[o++] = b + 1;
    }
    ropeGeo.setIndex(new THREE.BufferAttribute(idx, 1));
    ropeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    ropeGeo.setAttribute('normal', new THREE.BufferAttribute(nor, 3).setUsage(THREE.DynamicDrawUsage));
    ropeGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2).setUsage(THREE.DynamicDrawUsage));
    ropeGeo.setAttribute('aCandy', new THREE.BufferAttribute(cnd, 3).setUsage(THREE.DynamicDrawUsage));
    ropeGeo.boundingSphere = new THREE.Sphere(new V3(0, 0.3, 0), 2);
  }
  owned.geos.push(ropeGeo);
  const rope = new THREE.Mesh(ropeGeo, candyMat);
  rope.name = 'candy';
  rope.frustumCulled = false;
  rope.visible = false;
  root.add(rope);
  const cosT = new Float32Array(vPer), sinT = new Float32Array(vPer);
  for (let j = 0; j <= NR; j++) { const a = (j / NR) * Math.PI * 2; cosT[j] = Math.cos(a); sinT[j] = Math.sin(a); }
  cosT[NR] = cosT[0]; sinT[NR] = sinT[0];

  // リングの割り当て（station）：u = 弧長の位置 0〜1、ax = 軸方向のずれ（半径の何倍）、rs = 半径の倍率、
  // ps = 断面座標の倍率（ふた・切り口では中へ向かって 0）、nr / na = 法線の放射成分・軸成分
  const stU = new Float32Array(ringCount), stAx = new Float32Array(ringCount), stRs = new Float32Array(ringCount);
  const stPs = new Float32Array(ringCount), stNr = new Float32Array(ringCount), stNa = new Float32Array(ringCount);
  const CAP = [[-0.55, 0.02, 0.05, -1], [-0.46, 0.52, 0.55, -0.83], [-0.22, 0.88, 0.9, -0.42]]; // [ax, rs, nr, na]
  function setStation(i, u, ax, rs, ps, nr, na) { stU[i] = u; stAx[i] = ax; stRs[i] = rs; stPs[i] = ps; stNr[i] = nr; stNa[i] = na; }
  function capStart(i, u) { for (let k = 0; k < 3; k++) setStation(i + k, u, CAP[k][0], CAP[k][1], CAP[k][1], CAP[k][2], CAP[k][3]); return i + 3; }
  function capEnd(i, u) { for (let k = 2; k >= 0; k--) setStation(i + (2 - k), u, -CAP[k][0], CAP[k][1], CAP[k][1], CAP[k][2], -CAP[k][3]); return i + 3; }
  function bodyRun(i, u0, u1, n) { for (let k = 0; k < n; k++) setStation(i + k, n > 1 ? u0 + ((u1 - u0) * k) / (n - 1) : (u0 + u1) / 2, 0, 1, 1, 1, 0); return i + n; }
  function stationsPlain() { let i = capStart(0, 0); i = bodyRun(i, 0, 1, ringCount - 6); capEnd(i, 1); }
  const cutSorted = [];
  // 棒を切った後：切り口は平らな面（断面の模様が見える）
  function stationsCut(cuts) {
    cutSorted.length = 0;
    for (let k = 0; k < cuts.length; k++) cutSorted.push(cuts[k]);
    cutSorted.sort((a, b) => a.u - b.u);
    const nc = cutSorted.length;
    const bodyTotal = ringCount - 6 - 4 * nc;
    let lenTotal = 0, prev = 0;
    for (let k = 0; k <= nc; k++) {
      const a = k === 0 ? 0 : cutSorted[k - 1].u + cutSorted[k - 1].g;
      const b = k === nc ? 1 : cutSorted[k].u - cutSorted[k].g;
      lenTotal += Math.max(1e-4, b - a);
    }
    let i = capStart(0, 0), left = bodyTotal;
    for (let k = 0; k <= nc; k++) {
      const a = k === 0 ? 0 : cutSorted[k - 1].u + cutSorted[k - 1].g;
      const b = Math.max(a + 1e-4, k === nc ? 1 : cutSorted[k].u - cutSorted[k].g);
      const remainSeg = nc - k;
      let n = k === nc ? left : Math.max(2, Math.round((bodyTotal * (b - a)) / lenTotal));
      n = Math.max(2, Math.min(n, left - 2 * remainSeg));
      left -= n;
      i = bodyRun(i, a, b, n);
      if (k < nc) {
        const a2 = cutSorted[k].u + cutSorted[k].g;
        setStation(i++, b, 0, 1, 1, 0, 1);
        setStation(i++, b, 0, 0, 0, 0, 1);
        setStation(i++, a2, 0, 0, 0, 0, -1);
        setStation(i++, a2, 0, 1, 1, 0, -1);
      }
      prev = b;
    }
    capEnd(i, 1);
    return prev;
  }
  stationsPlain();

  // ---------- 材料座標 t と長さの密度 ----------
  const NT = 65;
  const den = new Float32Array(NT), denTmp = new Float32Array(NT), denOld = new Float32Array(NT);
  const denStart = new Float32Array(NT), denRod = new Float32Array(NT), cum = new Float32Array(NT);
  let Len = P.len0;
  function integrate(a) { let s = 0; for (let i = 1; i < NT; i++) s += a[i - 1] + a[i]; return (s * 0.5) / (NT - 1); }
  function rebuildCum() {
    cum[0] = 0;
    for (let i = 1; i < NT; i++) cum[i] = cum[i - 1] + ((den[i - 1] + den[i]) * 0.5) / (NT - 1);
    Len = Math.max(cum[NT - 1], 1e-4);
  }
  function sampleArr(a, t) {
    const x = clamp(t, 0, 1) * (NT - 1);
    const i = Math.min(NT - 2, Math.floor(x));
    return a[i] + (a[i + 1] - a[i]) * (x - i);
  }
  function tAtArc(s) {
    if (!(s > 0)) return 0;
    if (s >= Len) return 1;
    let lo = 0, hi = NT - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= s) lo = m; else hi = m; }
    const w = cum[hi] - cum[lo];
    return (lo + (w > 1e-9 ? (s - cum[lo]) / w : 0)) / (NT - 1);
  }
  function scaleDenTo(target) {
    const cur = integrate(den);
    const k = cur > 1e-9 ? target / cur : 1;
    for (let i = 0; i < NT; i++) den[i] = Math.max(den[i] * k, 1e-3);
  }
  // 伸ばす：dL（m）を t ∈ [tA, tB] に配る。細い所ほど（べき p）、端は少なめ、高い側・速く引いた手元ほど多め。
  function stretchBy(dL, tA, tB, sinPhi, speedN) {
    if (!(dL > 0)) return;
    const mean = Len, target = Len + dL;
    const p = 1.15 + 0.45 * speedN;
    const span = Math.max(tB - tA, 1e-3);
    for (let i = 0; i < NT; i++) {
      const t = i / (NT - 1);
      let w = 0;
      if (t >= tA - 1e-4 && t <= tB + 1e-4) {
        const u = clamp((t - tA) / span, 0, 1);
        const ends = 0.3 + 0.7 * Math.pow(Math.sin(Math.PI * u), 0.7);
        const bias = Math.max(0.25, 1 + (0.5 * sinPhi + 0.35 * speedN) * (2 * u - 1));
        w = Math.pow(den[i] / mean, p) * ends * bias;
      }
      denTmp[i] = w;
    }
    const sum = integrate(denTmp);
    if (sum < 1e-9) { for (let i = 0; i < NT; i++) den[i] *= target / mean; rebuildCum(); return; }
    const k = dL / sum, cap = 3.2 * target;
    for (let i = 0; i < NT; i++) den[i] = Math.min(den[i] + denTmp[i] * k, cap);
    // 少しならす（表面張力のかわり）
    denTmp[0] = den[0] * 0.92 + den[1] * 0.08;
    denTmp[NT - 1] = den[NT - 1] * 0.92 + den[NT - 2] * 0.08;
    for (let i = 1; i < NT - 1; i++) denTmp[i] = den[i] * 0.9 + (den[i - 1] + den[i + 1]) * 0.05;
    den.set(denTmp);
    scaleDenTo(target);
    rebuildCum();
    S.profDirty = true;
  }
  // ねじりの配分：細い所ほどねじれやすい（重み den³）。中心 c と幅 s
  function twistProfile() {
    if (!S.profDirty) return;
    let sw = 0, st = 0, st2 = 0;
    for (let i = 0; i < NT; i++) {
      const t = i / (NT - 1), d = den[i] / Len, w = d * d * d;
      sw += w; st += w * t; st2 += w * t * t;
    }
    const c = sw > 1e-9 ? st / sw : 0.5;
    const v = sw > 1e-9 ? Math.max(0, st2 / sw - c * c) : 0.083;
    S.profC = clamp(c, 0.1, 0.9);
    S.profS = clamp(1.25 * Math.sqrt(v), 0.12, 0.6);
    S.profDirty = false;
  }

  // ---------- 状態 ----------
  const S = {
    stage: 'empty', time: 0,
    lumps: [], ops: [], baseN: 0, opsDirty: true, folds: 0, foldsInChain: 0,
    lumpAnims: [], appear: 1,
    H: P.H0.clone(), Hgoal: P.H0.clone(), Hprev: P.H0.clone(), grabOff: new V3(), pullHeld: false,
    foldBaseLen: P.len0, foldArmed: false, stretchStep: 0, prevStretch: 1, stretchRate: 0, speedN: 0,
    dirPrev: 0, rightRoll: 0,
    wheelAngle: 0, wheelVel: 0, wheelLast: 0, wheelHeld: false, twistTotal: 0, twistRate: 0, twistSince: 0, twistClick: 0, twistActed: false,
    profDirty: true, profC: 0.5, profS: 0.35,
    pulse: 0, pulseU: 0.5, wobX: 0, wobY: 0, wobVX: 0, wobVY: 0,
    fold: { phase: 0, q: 0, asym: 0, lenNew: P.len0 }, // phase 1：輪が2本の帯になってフックへ集まる、2：2本が1本に溶ける
    pin: { active: false, blend: 0, t: 0.5, pos: new V3(), goal: new V3(), off: new V3(), moved: 0 },
    rollT: 0, rollK: 0, rollAngle: 0, rollZ: 0, rodZ: P.rodZ, rodBob: 0, candyBob: 0, oval: 0,
    piecesWanted: 3, cutsDone: 0, cuts: [], cutQueue: [], rodFade: 1,
    pieces: [], gift: null, moving: false,
    hints: { pull: 0, twist: 0, rope: 0, candy: 0 },
  };
  const status = {
    stage: 'empty', lumps: 0, layers: 0, folds: 0, twist: 0, stretch: 1, stretchRate: 0, twistRate: 0,
    busy: false, cutsDone: 0, piecesWanted: 3,
    points: { lumpDrop: new V3(), ropeCenter: new V3(), pullHandle: new V3(), twistHandle: new V3() },
  };

  function setStage(s) {
    if (S.stage === s) return;
    const prev = S.stage;
    S.stage = s;
    syncStatus();
    emit('stage', { stage: s, prev });
  }

  // ---------- 色の層の履歴 ----------
  function mergeIntoBase(op) {
    if (op.type !== OP_LUMP) return;
    const b = U.uBase.value, n = S.baseN, j = op.color * 3;
    b.set((b.x * n + palLinear[j]) / (n + 1), (b.y * n + palLinear[j + 1]) / (n + 1), (b.z * n + palLinear[j + 2]) / (n + 1));
    S.baseN = n + 1;
  }
  function trimOps() {
    // 古すぎる折り（その上に maxFolds 回以上折られている）は、もう画素より細かいので平均色に畳む
    let folds = 0;
    for (let i = 0; i < S.ops.length; i++) if (S.ops[i].type === OP_FOLD) folds++;
    while (folds > P.maxFolds || S.ops.length > MAX_OPS - 2) {
      const first = S.ops.shift();
      if (!first) break;
      if (first.type === OP_FOLD) folds--;
      mergeIntoBase(first);
    }
    S.foldsInChain = folds;
    S.opsDirty = true;
  }
  function lastTwistOp() {
    const last = S.ops[S.ops.length - 1];
    if (last && last.type === OP_TWIST) return last;
    twistProfile();
    const op = { type: OP_TWIST, a: 0, b: 0, c: S.profC, s: S.profS, kappa: P.kappa, w: 0 };
    S.ops.push(op);
    trimOps();
    return op;
  }
  // 断面の回転 θ(t) = a + b·G(t)。左（ねじる持ち手）は a += d, b −= d、右（転がり）は b += d
  function applyTwist(dA, dB) {
    if (S.stage !== 'candy' || S.lumps.length === 0) return;
    const w = Math.abs(dA) + Math.abs(dB);
    if (w < 1e-6) return;
    const op = lastTwistOp();
    twistProfile();
    const wOld = Math.min(op.w, 6);
    op.c = (op.c * wOld + S.profC * w) / (wOld + w);
    op.s = (op.s * wOld + S.profS * w) / (wOld + w);
    op.w = wOld + w;
    op.a = clamp(op.a + dA, -80, 80);
    op.b = clamp(op.b + dB, -80, 80);
    S.opsDirty = true;
  }

  // ---------- 中心線（3次ベジェの垂れ） ----------
  const NA = 24;
  function makeHang() { return { P: new Float64Array(8), floor: 0, tab: new Float32Array(NA + 1), len: 1e-3 }; }
  const hangFree = makeHang(), hangA = makeHang(), hangB = makeHang(), hangNew = makeHang();
  const tv = new V3();
  function hangSet(h, ax, ay, bx, by, s, floorY) {
    const d = Math.hypot(bx - ax, by - ay);
    const h1 = Math.min(0.05, 0.3 * d);
    const sFloor = Math.max(0.03, Math.min(ay, by) - floorY);
    const qd = (s * 4) / 3, W = 0.9 * Math.max(0, s - sFloor);
    const lean = Math.min(0.45 * qd, 0.3 * d); // 垂れるとき、端からまん中へ斜めに下りる
    const p = h.P;
    p[0] = ax; p[1] = ay; p[2] = ax + h1 + lean - W; p[3] = ay - qd; p[4] = bx - h1 - lean + W; p[5] = by - qd; p[6] = bx; p[7] = by;
    h.floor = floorY;
  }
  function hangPoint(h, tau, out) {
    const p = h.P, m = 1 - tau;
    const a = m * m * m, b = 3 * m * m * tau, c = 3 * m * tau * tau, d = tau * tau * tau;
    const x = a * p[0] + b * p[2] + c * p[4] + d * p[6];
    let y = a * p[1] + b * p[3] + c * p[5] + d * p[7];
    const dy = y - h.floor + 0.012;
    y = h.floor - 0.012 + 0.5 * (dy + Math.sqrt(dy * dy + 2.5e-3)); // なめらかな床（台の上に乗る）
    out.x = x; out.y = y; out.z = 0;
    return out;
  }
  function hangLen(h) {
    let px = 0, py = 0, total = 0;
    for (let i = 0; i <= NA; i++) {
      hangPoint(h, i / NA, tv);
      if (i > 0) total += Math.hypot(tv.x - px, tv.y - py);
      h.tab[i] = total; px = tv.x; py = tv.y;
    }
    h.len = Math.max(total, 1e-4);
    return total;
  }
  function hangSolve(h, ax, ay, bx, by, len, floorY) {
    floorY = Math.min(floorY, Math.min(ay, by));
    hangSet(h, ax, ay, bx, by, 0, floorY);
    if (hangLen(h) >= len) return;
    let lo = 0, hi = 0.25;
    for (let i = 0; i < 8; i++) { hangSet(h, ax, ay, bx, by, hi, floorY); if (hangLen(h) >= len) break; lo = hi; hi *= 1.8; }
    for (let i = 0; i < 14; i++) {
      const m = (lo + hi) / 2;
      hangSet(h, ax, ay, bx, by, m, floorY);
      if (hangLen(h) >= len) hi = m; else lo = m;
    }
    hangSet(h, ax, ay, bx, by, (lo + hi) / 2, floorY);
    hangLen(h);
  }
  function hangAt(h, u, out) {
    const s = clamp(u, 0, 1) * h.len;
    let lo = 0, hi = NA;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (h.tab[m] <= s) lo = m; else hi = m; }
    const w = h.tab[hi] - h.tab[lo];
    return hangPoint(h, (lo + (w > 1e-9 ? (s - h.tab[lo]) / w : 0)) / NA, out);
  }

  const c1 = new V3(), c2 = new V3();
  const k2 = new V3(), k3 = new V3(); // centerAt の中だけで使う（呼ぶ側の作業用と重ねない）
  let pinUA = 0.5;
  function pinnedAt(u, out) {
    if (u <= pinUA) return hangAt(hangA, pinUA > 1e-4 ? u / pinUA : 0, out);
    return hangAt(hangB, (u - pinUA) / Math.max(1 - pinUA, 1e-4), out);
  }
  // u = 弧長の位置（0 = 左端、1 = 右端）
  function centerAt(u, out) {
    const pb = S.pin.blend;
    if (pb >= 0.999) pinnedAt(u, out);
    else {
      hangAt(hangFree, u, out);
      if (pb > 0.001) { pinnedAt(u, k3); out.lerp(k3, pb); }
    }
    if (S.fold.phase === 1) {
      // 折りの前半：まだ古い1本の飴。前半分は新しい線の内側（−N）、後ろ半分は折り返して外側（+N）へ集まる。
      // まん中（折り目）は右のチャックに引っかかる
      const un = u <= 0.5 ? 2 * u : 2 * (1 - u);
      hangAt(hangNew, un, k2);
      hangAt(hangNew, Math.min(1, un + 0.01), k3); const bx = k3.x, by = k3.y;
      hangAt(hangNew, Math.max(0, un - 0.01), k3);
      let tx = bx - k3.x, ty = by - k3.y;
      const tl = Math.hypot(tx, ty);
      if (tl > 1e-7) { tx /= tl; ty /= tl; } else { tx = 1; ty = 0; }
      const side = clamp((u - 0.5) / 0.025, -1, 1);
      const r = radiusAt(tAtArc(u * Len)) * side;
      k2.x += -ty * r; k2.y += tx * r;
      out.lerp(k2, smooth(S.fold.q));
    }
    const sw = Math.sin(Math.PI * u);
    out.x += S.wobX * sw; out.y += (S.wobY + S.candyBob) * sw;
    if (S.rollK > 0) {
      const k = S.rollK;
      const x = P.rodX0 + rodLen * u;
      out.x += (x - out.x) * k;
      out.y += (rodRadiusAtU(u) + S.rodBob - out.y) * k;
    }
    out.z = S.rollZ;
    return out;
  }

  // ---------- 太さ ----------
  function volAt(t) {
    // その場所の体積（かたまり何本ぶんか）。乗ったばかりのかたまりは着いた所から広がる
    let v = S.lumps.length;
    for (let k = 0; k < S.lumpAnims.length; k++) {
      const a = S.lumpAnims[k];
      v -= 1 - smooth(clamp((a.op.prog * 1.4 - Math.abs(t - a.op.t0)) / 0.3, 0, 1));
    }
    return Math.max(v, 0.05);
  }
  function radiusAt(t) {
    const d = Math.max(sampleArr(den, t), 1e-3);
    return P.r1 * Math.sqrt((volAt(t) * P.len0) / d);
  }
  function rodRadiusAtU(u) { return radiusAt(tAtArc(u * Len)); }
  function lenMinFor(n) { return Math.max(P.lenMin, (P.len0 * n * P.r1 * P.r1) / (P.rCap * P.rCap)); }

  // ---------- メッシュを書く ----------
  const rcx = new Float32Array(ringCount), rcy = new Float32Array(ringCount), rcz = new Float32Array(ringCount);
  const rtx = new Float32Array(ringCount), rty = new Float32Array(ringCount);
  const rrad = new Float32Array(ringCount), rt = new Float32Array(ringCount), rslope = new Float32Array(ringCount);
  const rr1 = new Float32Array(ringCount), rr2 = new Float32Array(ringCount);
  let endRadL = 0.04, endRadR = 0.04;
  function writeRope() {
    const fa = S.fold.phase === 2;
    const mk = fa ? backOut(S.fold.q) : 1;
    const asym = S.fold.asym;
    const vn = S.lumps.length;
    const pulse = S.pulse, appear = backOut(S.appear);
    let lastTx = 1, lastTy = 0;
    for (let i = 0; i < ringCount; i++) {
      const u = stU[i];
      centerAt(u, c1);
      rcx[i] = c1.x; rcy[i] = c1.y; rcz[i] = c1.z;
      const ua = Math.max(0, u - 0.004), ub = Math.min(1, u + 0.004);
      centerAt(ua, c2); const ax = c2.x, ay = c2.y;
      centerAt(ub, c2);
      let tx = c2.x - ax, ty = c2.y - ay;
      const tl = Math.hypot(tx, ty);
      if (tl > 1e-7) { tx /= tl; ty /= tl; lastTx = tx; lastTy = ty; } else { tx = lastTx; ty = lastTy; }
      rtx[i] = tx; rty[i] = ty;
      const t = tAtArc(u * Len);
      rt[i] = t;
      let r = radiusAt(t);
      const pu = (u - S.pulseU) / 0.3;
      r *= (1 + 0.22 * pulse * Math.exp(-pu * pu)) * appear;
      rrad[i] = Math.max(r, 1e-4);
      if (fa) {
        const tq = t - 0.5 * t * t;
        const t1 = 0.5 * t + asym * tq, t2 = 1 - (0.5 * t - asym * tq);
        const k = P.r1 * Math.sqrt(vn * P.len0);
        rr1[i] = k / Math.sqrt(Math.max(sampleArr(denOld, t1), 1e-3));
        rr2[i] = k / Math.sqrt(Math.max(sampleArr(denOld, t2), 1e-3));
      }
    }
    // 太さの勾配（法線を傾ける）
    for (let i = 0; i < ringCount; i++) {
      const a = Math.max(0, i - 1), b = Math.min(ringCount - 1, i + 1);
      const ds = Math.hypot(rcx[b] - rcx[a], rcy[b] - rcy[a]);
      rslope[i] = stNr[i] > 0.99 && ds > 1e-4 ? clamp((rrad[b] * stRs[b] - rrad[a] * stRs[a]) / ds, -1.5, 1.5) : 0;
    }
    const roll = S.rollAngle, cr = Math.cos(roll), sr = Math.sin(roll);
    const fade = S.rodFade;
    // 断面はわずかに楕円（2山）。その向きは最後のねじりと一緒に回るので、色が1色でも、ねじれが形のらせんで見える
    const lastOp = S.ops.length ? S.ops[S.ops.length - 1] : null;
    const tw = lastOp && lastOp.type === OP_TWIST ? lastOp : null;
    const ov = P.oval * S.oval * (1 - S.rollK * 0.6);
    let twG0 = 0, twGi = 1, twIs = 1;
    if (tw) { const sI = 1 / Math.max(tw.s, 0.05); const gf0 = -tw.c * sI, gf1 = (1 - tw.c) * sI; twG0 = gf0 / Math.sqrt(1 + gf0 * gf0); twGi = 1 / Math.max(gf1 / Math.sqrt(1 + gf1 * gf1) - twG0, 1e-3); twIs = sI; }
    const uvRep = 2.0;
    for (let i = 0; i < ringCount; i++) {
      const tx = rtx[i], ty = rty[i];
      // N = Z × T（面内の法線）、B = Z。転がりで断面の枠ごと回る
      const nx = -ty, ny = tx;
      const n1x = nx * cr, n1y = ny * cr, n1z = sr;       // N'
      const b1x = -nx * sr, b1y = -ny * sr, b1z = cr;      // B'
      const rBase = rrad[i], rs = stRs[i] * fade, ps = stPs[i];
      const nr = stNr[i], na = stNa[i], sl = rslope[i];
      const cx = rcx[i] + tx * stAx[i] * rBase, cy = rcy[i] + ty * stAx[i] * rBase, cz = rcz[i];
      const t = rt[i];
      let oc2 = 1, os2 = 0;
      if (tw) { const uu = (t - tw.c) * twIs; const th2 = 2 * (tw.a + tw.b * ((uu / Math.sqrt(1 + uu * uu) - twG0) * twGi)); oc2 = Math.cos(th2); os2 = Math.sin(th2); }
      let o = i * vPer * 3, o2 = i * vPer * 2;
      for (let j = 0; j <= NR; j++) {
        const cj = cosT[j], sj = sinT[j];
        const dx = cj * n1x + sj * b1x, dy = cj * n1y + sj * b1y, dz = cj * n1z + sj * b1z;
        if (fa) {
          // 折りの後半：2本の丸（8の字）→ 1本の丸。頂点は元の帯の表面に付いたまま動くので、
          // 元の1周ぶんの縞が半周に畳まれて、縞が倍になるのが見える
          const f1 = clamp(0.5 + asym * (1 - t), 0.15, 0.85);
          let om, ph, s2;
          if (j <= NR / 4 || j >= NR - NR / 4) { s2 = true; om = 2 * (j <= NR / 4 ? j : j - NR) * (Math.PI * 2 / NR); ph = om * (1 - f1); }
          else { s2 = false; om = 2 * (j * (Math.PI * 2 / NR) - Math.PI); ph = Math.PI + om * f1; }
          const co = Math.cos(om), so = Math.sin(om), cp = Math.cos(ph), sp = Math.sin(ph);
          // 8の字：帯1は −N 側で向きはそのまま、帯2は +N 側で N について鏡映。接点は中心線の上
          const ro = (s2 ? rr2[i] : rr1[i]) * rs;
          const sgn = s2 ? 1 : -1;
          const an = sgn * (1 + co) * ro, ab = (s2 ? so : -so) * ro; // N・B 成分（接点から測る）
          const rN = rBase * rs;
          const fn = cp * rN, fb = sp * rN;
          const pn = an + (fn - an) * mk, pb = ab + (fb - ab) * mk;
          pos[o] = cx + n1x * pn + b1x * pb; pos[o + 1] = cy + n1y * pn + b1y * pb; pos[o + 2] = cz + n1z * pn + b1z * pb;
          const gn = sgn * co + (cp - sgn * co) * mk, gb = (s2 ? so : -so) + (sp - (s2 ? so : -so)) * mk;
          let mx = (n1x * gn + b1x * gb) * nr + tx * (na - sl * nr), my = (n1y * gn + b1y * gb) * nr + ty * (na - sl * nr), mz = (n1z * gn + b1z * gb) * nr;
          const ml = Math.sqrt(mx * mx + my * my + mz * mz);
          if (ml > 1e-6) { mx /= ml; my /= ml; mz /= ml; } else { mx = n1x * cp + b1x * sp; my = n1y * cp + b1y * sp; mz = n1z * cp + b1z * sp; }
          nor[o] = mx; nor[o + 1] = my; nor[o + 2] = mz;
          cnd[o] = t; cnd[o + 1] = cp * ps; cnd[o + 2] = sp * ps;
          uvs[o2] = t * uvRep; uvs[o2 + 1] = (j / NR) * 2;
          o += 3; o2 += 2;
          continue;
        }
        const j2 = (j * 2) % NR;
        const oc = cosT[j2] * oc2 + sinT[j2] * os2, osn = sinT[j2] * oc2 - cosT[j2] * os2; // cos・sin 2(φ − θ)
        const r = rBase * rs * (1 + ov * oc);
        pos[o] = cx + dx * r; pos[o + 1] = cy + dy * r; pos[o + 2] = cz + dz * r;
        // 法線：r(φ) の傾きぶん、周方向へ倒す
        const tg = 2 * ov * osn * nr;
        const ex = -sj * n1x + cj * b1x, ey = -sj * n1y + cj * b1y, ez = -sj * n1z + cj * b1z;
        let mx = dx * nr + ex * tg + tx * (na - sl * nr), my = dy * nr + ey * tg + ty * (na - sl * nr), mz = dz * nr + ez * tg;
        const ml = Math.sqrt(mx * mx + my * my + mz * mz);
        if (ml > 1e-6) { mx /= ml; my /= ml; mz /= ml; } else { mx = dx; my = dy; mz = dz; }
        nor[o] = mx; nor[o + 1] = my; nor[o + 2] = mz;
        cnd[o] = t; cnd[o + 1] = cj * ps; cnd[o + 2] = sj * ps;
        uvs[o2] = t * uvRep; uvs[o2 + 1] = (j / NR) * 2;
        o += 3; o2 += 2;
      }
    }
    endRadL = rrad[3]; endRadR = rrad[ringCount - 4];
    ropeGeo.attributes.position.needsUpdate = true;
    ropeGeo.attributes.normal.needsUpdate = true;
    ropeGeo.attributes.uv.needsUpdate = true;
    ropeGeo.attributes.aCandy.needsUpdate = true;
  }

  // ---------- 飴の下の疑似影（テクスチャなし：頂点の alpha を持つ細い帯） ----------
  const SHN = 24;
  const shPos = new Float32Array((SHN + 1) * 3 * 3), shCol = new Float32Array((SHN + 1) * 3 * 4);
  const shadowGeo = new THREE.BufferGeometry();
  {
    const idx = [];
    for (let i = 0; i < SHN; i++) for (let k = 0; k < 2; k++) { const a = i * 3 + k, b = a + 3; idx.push(a, a + 1, b, b, a + 1, b + 1); }
    shadowGeo.setIndex(idx);
    shadowGeo.setAttribute('position', new THREE.BufferAttribute(shPos, 3).setUsage(THREE.DynamicDrawUsage));
    shadowGeo.setAttribute('color', new THREE.BufferAttribute(shCol, 4).setUsage(THREE.DynamicDrawUsage));
    shadowGeo.boundingSphere = new THREE.Sphere(new V3(0, 0, 0), 2);
  }
  owned.geos.push(shadowGeo);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, vertexColors: true, transparent: true, depthWrite: false, toneMapped: false });
  owned.mats.push(shadowMat);
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.name = 'candy-shadow';
  shadow.frustumCulled = false;
  shadow.renderOrder = 1;
  shadow.visible = false;
  root.add(shadow);
  function writeShadow() {
    const fade = S.rodFade * Math.min(1, S.appear * 2);
    for (let i = 0; i <= SHN; i++) {
      const u = i / SHN;
      centerAt(u, c1);
      const r = rodRadiusAtU(u) * fade;
      const hgt = Math.max(0, c1.y - r);
      const w = r * (1.25 + 3.0 * hgt) + 0.004;
      const a = 0.34 * Math.pow(Math.max(0, 1 - hgt / 0.42), 2) * Math.sin(Math.PI * Math.min(1, u * 6) * 0.5) * Math.sin(Math.PI * Math.min(1, (1 - u) * 6) * 0.5) * (fade > 0.02 ? 1 : 0);
      const x = c1.x + 0.16 * hgt, z = c1.z - 0.28 * hgt;
      const o = i * 9, q = i * 12;
      shPos[o] = x; shPos[o + 1] = 0.004; shPos[o + 2] = z - w;
      shPos[o + 3] = x; shPos[o + 4] = 0.004; shPos[o + 5] = z;
      shPos[o + 6] = x; shPos[o + 7] = 0.004; shPos[o + 8] = z + w;
      shCol[q + 3] = 0; shCol[q + 7] = a; shCol[q + 11] = 0;
    }
    shadowGeo.attributes.position.needsUpdate = true;
    shadowGeo.attributes.color.needsUpdate = true;
  }

  // ---------- 当たり用（飴・棒） ----------
  const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
  owned.mats.push(proxyMat);
  const ropeProxy = new THREE.Group();
  ropeProxy.name = 'candy-proxy';
  const proxySphere = new THREE.SphereGeometry(1, 8, 6);
  owned.geos.push(proxySphere);
  const proxyBalls = [];
  for (let i = 0; i < 5; i++) { const m = new THREE.Mesh(proxySphere, proxyMat); proxyBalls.push(m); ropeProxy.add(m); }
  root.add(ropeProxy);
  const rodProxyGeo = new THREE.BoxGeometry(rodLen + 0.08, 0.13, 0.15);
  owned.geos.push(rodProxyGeo);
  const rodProxy = new THREE.Mesh(rodProxyGeo, proxyMat);
  rodProxy.position.set(0, 0.04, P.rodZ);
  root.add(rodProxy);

  // ---------- 入力の補助 ----------
  const plane = new THREE.Plane();
  const Zax = new V3(0, 0, 1);
  const hit = new V3();
  function rayPlaneZ(ray, z, out) {
    if (!ray) return null;
    plane.set(Zax, -z);
    return ray.intersectPlane(plane, out);
  }

  // ---------- 飴を足す ----------
  function addLump(colorIndex) {
    if (!(S.stage === 'empty' || S.stage === 'candy')) return false;
    const ci = colorIndex | 0;
    if (S.lumps.length >= 6 || !(colorIndex >= 0 && colorIndex < 6) || ci >= palette.length) return false;
    if (S.lumps.length === 0) {
      clearCandy();
      const d = Math.max(P.len0, S.H.distanceTo(P.L));
      den.fill(d); rebuildCum();
      S.foldBaseLen = P.len0;
      U.uBase.value.set(palLinear[ci * 3], palLinear[ci * 3 + 1], palLinear[ci * 3 + 2]);
      S.baseN = 1;
      S.appear = 0;
      S.lumps.push(ci);
      rope.visible = true;
    } else {
      const n = S.lumps.length;
      const frac = 1 / (n + 1);
      const op = {
        type: OP_LUMP, color: ci, frac,
        alpha: P.lumpAlpha + 0.35 * Math.sin(1.7 * n + 0.9 * ci),
        t0: tAtArc(0.5 * Len), prog: 0,
      };
      S.lumps.push(ci);
      S.ops.push(op);
      S.lumpAnims.push({ op });
      trimOps();
    }
    S.pulse = 1; S.pulseU = 0.5;
    S.wobVY -= 0.5;
    S.opsDirty = true;
    if (S.stage === 'empty') setStage('candy');
    syncStatus();
    emit('sound', { name: 'merge', rate: 0.9 + 0.08 * S.lumps.length });
    emit('action', { kind: 'merge', strength: 0.5 });
    return true;
  }

  // ---------- 折る（パン屋の写像） ----------
  // きっかけ：すぐ音と合図を出し、輪が2本の帯になってフックへ集まる（前半）。
  function startFold() {
    const n = S.lumps.length;
    if (n === 0 || S.fold.phase === 1) return;
    finishAnims(false);
    S.pin.active = false; S.pin.blend = 0;
    S.fold.phase = 1; S.fold.q = 0;
    S.fold.lenNew = Math.max(Len / 2, lenMinFor(n));
    S.folds++;
    S.foldArmed = false;
    emit('sound', { name: 'fold', rate: Math.min(1.5, 1 + 0.05 * S.folds) });
    emit('action', { kind: 'fold', strength: 1 });
  }
  // 写像と形を新しい飴へ切り替える（後半の始まり）
  function commitFold() {
    const n = S.lumps.length;
    // 折る位置 = 今の飴の弧長のまん中。体積で測ると tf（細く伸びた側が短い）
    const tf = tAtArc(0.5 * Len);
    const asym = clamp(2 * tf - 1, -0.3, 0.3);
    denOld.set(den);
    for (let i = 0; i < NT; i++) {
      const t = i / (NT - 1), f1 = 0.5 + asym * (1 - t), tq = t - 0.5 * t * t;
      const t1 = 0.5 * t + asym * tq, t2 = 1 - (0.5 * t - asym * tq);
      denTmp[i] = 0.5 * (sampleArr(denOld, t1) * f1 + sampleArr(denOld, t2) * (1 - f1));
    }
    const mean = integrate(denTmp);
    for (let i = 0; i < NT; i++) den[i] = denTmp[i] + (mean - denTmp[i]) * P.foldRelax; // くっついて少しならされる
    scaleDenTo(Math.max(Len / 2, lenMinFor(Math.max(1, n))));
    rebuildCum();
    S.profDirty = true;
    S.ops.push({ type: OP_FOLD, psi: 0, phis: 0, asym });
    trimOps();
    S.fold.phase = 2; S.fold.q = 0; S.fold.asym = asym;
    S.foldBaseLen = Len; S.foldArmed = false; S.stretchStep = 0; S.prevStretch = 1;
    S.pulse = 0.8; S.pulseU = 0.5;
    S.wobX = 0; S.wobY = 0; S.wobVX = 0; S.wobVY = 0;
  }
  // 途中の自動の動き（かたまりが広がる・折りがくっつく・つまんだ形が戻る）をすぐ終わらせる
  function finishAnims(all) {
    if (S.fold.phase === 1) commitFold();
    S.fold.phase = 0; S.fold.q = 0;
    if (all) {
      for (const a of S.lumpAnims) a.op.prog = 1;
      S.lumpAnims.length = 0;
      S.pin.active = false; S.pin.blend = 0;
      S.appear = 1;
    }
    S.opsDirty = true;
  }

  // ---------- 切る・ピース ----------
  function buildPieceGeometry(R, tCut) {
    const SEGS = 40;
    const h = P.pieceT / 2;
    // 輪郭：[ρ, z, ps, nρ, nz]
    const prof = [
      [0, h, 0, 0, 1], [0.55, h, 0.55, 0, 1], [0.88, h * 0.97, 0.88, 0.12, 1], [0.985, h * 0.7, 1, 0.75, 0.66],
      [1, 0, 1, 1, 0],
      [0.985, -h * 0.7, 1, 0.75, -0.66], [0.88, -h * 0.97, 0.88, 0.12, -1], [0.55, -h, 0.55, 0, -1], [0, -h, 0, 0, -1],
    ];
    const SS = 8; // 棒
    const nv = prof.length * (SEGS + 1) + (SS + 1) * 2 + 1;
    const p = new Float32Array(nv * 3), n = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), cd = new Float32Array(nv * 3);
    const idx = [];
    let v = 0;
    for (let i = 0; i < prof.length; i++) {
      const q = prof[i];
      const nl = Math.hypot(q[3], q[4]) || 1;
      for (let j = 0; j <= SEGS; j++) {
        const a = (j / SEGS) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
        p[v * 3] = ca * q[0] * R; p[v * 3 + 1] = sa * q[0] * R; p[v * 3 + 2] = q[1];
        n[v * 3] = (ca * q[3]) / nl; n[v * 3 + 1] = (sa * q[3]) / nl; n[v * 3 + 2] = q[4] / nl;
        cd[v * 3] = tCut; cd[v * 3 + 1] = ca * q[2]; cd[v * 3 + 2] = sa * q[2];
        uv[v * 2] = 0.5 + ca * q[0] * 0.3; uv[v * 2 + 1] = 0.5 + sa * q[0] * 0.3;
        v++;
      }
    }
    for (let i = 0; i < prof.length - 1; i++) for (let j = 0; j < SEGS; j++) {
      const a = i * (SEGS + 1) + j, b = a + SEGS + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
    // 棒（白）：−y 方向。円盤の中から出る
    const yTop = -R + 0.012, yBot = yTop - P.stickL;
    const s0 = v;
    for (let k = 0; k < 2; k++) for (let j = 0; j <= SS; j++) {
      const a = (j / SS) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      p[v * 3] = ca * P.stickR; p[v * 3 + 1] = k ? yBot : yTop; p[v * 3 + 2] = sa * P.stickR;
      n[v * 3] = ca; n[v * 3 + 1] = 0; n[v * 3 + 2] = sa;
      cd[v * 3] = -1; uv[v * 2] = 0.5; uv[v * 2 + 1] = 0.5;
      v++;
    }
    for (let j = 0; j < SS; j++) { const a = s0 + j, b = a + SS + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
    p[v * 3] = 0; p[v * 3 + 1] = yBot - 0.003; p[v * 3 + 2] = 0; n[v * 3 + 1] = -1; cd[v * 3] = -1; uv[v * 2] = 0.5; uv[v * 2 + 1] = 0.5;
    for (let j = 0; j < SS; j++) idx.push(s0 + SS + 1 + j, s0 + SS + 2 + j, v);
    v++;
    const g = new THREE.BufferGeometry();
    g.setIndex(idx);
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(n, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setAttribute('aCandy', new THREE.BufferAttribute(cd, 3));
    return g;
  }
  function slotFor(i, n, R, out) {
    const span = 0.40;
    const x = n <= 1 ? 0 : -span / 2 + (span * i) / (n - 1);
    const rRod = P.r1 * Math.sqrt((Math.max(1, S.lumps.length) * P.len0) / rodLen);
    const z = Math.min(0.14, S.rodZ + rRod + 0.045);
    return out.set(x, (R + P.stickL - 0.012) * Math.cos(P.pieceTilt), z);
  }
  function pickCutU(u) {
    const lo = 0.07, hi = 0.93;
    const free = (x) => { let d = 1; for (const c of S.cuts) d = Math.min(d, Math.abs(c.u - x)); return d; };
    if (typeof u === 'number' && isFinite(u)) {
      u = clamp(u, lo, hi);
      if (free(u) >= P.cutMinSep) return u;
    }
    // 自然な位置：指定に近く、ほかの切り口から離れた所
    let best = 0.5, bestScore = -1;
    for (let i = 0; i <= 40; i++) {
      const x = lo + ((hi - lo) * i) / 40;
      const f = free(x);
      if (f < P.cutMinSep) continue;
      const score = (typeof u === 'number' && isFinite(u)) ? 2 - Math.abs(x - u) : Math.min(f, 0.25) - 0.02 * Math.abs(x - (S.cutsDone + 1) / (S.piecesWanted + 1));
      if (score > bestScore) { bestScore = score; best = x; }
    }
    return bestScore < 0 ? clamp(typeof u === 'number' && isFinite(u) ? u : 0.5, lo, hi) : best;
  }
  function doCut(uIn) {
    if (S.cutsDone >= S.piecesWanted) return false;
    const i = S.cutsDone;
    const u = pickCutU(uIn);
    const tCut = tAtArc(u * Len);
    const rRod = radiusAt(tCut);
    const R = clamp(rRod * P.pieceK, P.pieceRMin, P.pieceRMax);
    if (!S.gift) {
      packOps(S.ops, U);
      const gu = snapshotUniforms(THREE, U); // スナップショット（今の hero の状態とは共有しない）
      S.gift = { uniforms: gu, mat: createCandyMaterial(THREE, textures.candy, gu), geos: [] };
    }
    const geo = buildPieceGeometry(R, tCut);
    S.gift.geos.push(geo);
    const mesh = new THREE.Mesh(geo, S.gift.mat);
    const piece = new THREE.Group();
    piece.name = 'piece' + i;
    piece.userData.kind = 'pop';
    piece.add(mesh);
    const from = new V3(P.rodX0 + rodLen * u, rRod, S.rodZ);
    piece.position.copy(from);
    piece.rotation.set(0, Math.PI / 2, 0);
    piece.scale.setScalar(clamp(rRod / R, 0.3, 1));
    root.add(piece);
    S.pieces.push({ obj: piece, from, to: slotFor(i, S.piecesWanted, R, new V3()), t: 0, s0: clamp(rRod / R, 0.3, 1) });
    S.cuts.push({ u, g: 0, age: 0 });
    S.cutsDone++;
    syncStatus();
    S.pulse = 0.6; S.pulseU = u;
    emit('sound', { name: 'snip', rate: 1 + 0.06 * i });
    emit('cut', { index: i, remaining: S.piecesWanted - S.cutsDone, point: from.clone() });
    emit('action', { kind: 'cut', strength: 1 });
    return true;
  }
  function disposeGift(g) {
    if (!g) return;
    g.geos.forEach((x) => x.dispose());
    g.mat.dispose();
  }

  function clearCandy() {
    S.lumps.length = 0; S.ops.length = 0; S.baseN = 0; S.folds = 0; S.foldsInChain = 0; S.lumpAnims.length = 0;
    S.appear = 1; S.fold.phase = 0; S.fold.q = 0; S.pin.active = false; S.pin.blend = 0;
    den.fill(P.len0); rebuildCum();
    S.foldBaseLen = P.len0; S.foldArmed = false; S.stretchStep = 0; S.prevStretch = 1; S.stretchRate = 0;
    S.twistTotal = 0; S.twistSince = 0; S.twistActed = false; S.profDirty = true;
    S.wobX = S.wobY = S.wobVX = S.wobVY = 0; S.pulse = 0;
    S.rollT = 0; S.rollK = 0; S.rollAngle = 0; S.rollZ = 0; S.rodFade = 1;
    S.cutsDone = 0; S.cuts.length = 0; S.cutQueue.length = 0;
    S.opsDirty = true;
    stationsPlain();
    rope.visible = false;
  }

  // ---------- 毎フレーム ----------
  function update(dt, input) {
    dt = Math.min(Math.max(+dt || 0, 0), 0.05);
    S.time += dt;
    const time = S.time;
    const canWork = S.stage === 'empty' || S.stage === 'candy';
    const hasCandy = S.stage === 'candy' && S.lumps.length > 0;
    const grab = input ? input.grab : null;

    // ---- 引く持ち手 ----
    if (grab === 'pull' && canWork) {
      if (input.justGrabbed) {
        if (rayPlaneZ(input.ray, P.knobOffset.z, hit)) S.grabOff.set(S.H.x - hit.x, S.H.y - hit.y, 0); else S.grabOff.set(-P.knobOffset.x, 0, 0);
        S.pullHeld = true;
        emit('sound', { name: 'grab' });
      }
      if (input.pointerDown && rayPlaneZ(input.ray, P.knobOffset.z, hit)) {
        S.Hgoal.set(hit.x + S.grabOff.x, hit.y + S.grabOff.y, 0).clamp(P.hMin, P.hMax);
      }
      if (input.justReleased) { S.pullHeld = false; S.wobVY += 0.3; emit('sound', { name: 'release' }); } // 離すと、ぷるん
    } else S.pullHeld = false;
    if (!canWork || S.stage === 'empty') { if (!S.pullHeld) S.Hgoal.copy(P.H0); }
    // ばね追従（指数減衰の解析解：dt が大きくても発散しない）
    S.Hprev.copy(S.H);
    S.H.lerp(S.Hgoal, 1 - Math.exp(-dt / P.follow));
    const hvx = S.H.x - S.Hprev.x, hvy = S.H.y - S.Hprev.y;
    const hSpeed = dt > 1e-5 ? Math.hypot(hvx, hvy) / dt : 0;
    S.speedN += (clamp(hSpeed / 1.2, 0, 1) - S.speedN) * (1 - Math.exp(-dt / 0.08));

    // ---- ねじる持ち手（慣性つき） ----
    let dTwist = 0;
    if (grab === 'twist' && canWork && rayPlaneZ(input.ray, P.CT.z + 0.02, hit)) {
      const dx = hit.x - P.CT.x, dy = hit.y - P.CT.y;
      if (dx * dx + dy * dy > 4e-4) {
        const a = Math.atan2(dy, dx);
        if (input.justGrabbed || !S.wheelHeld) { S.wheelLast = a; S.wheelHeld = true; S.twistActed = false; if (input.justGrabbed) emit('sound', { name: 'grab' }); }
        dTwist = clamp(wrapPi(a - S.wheelLast), -1.2, 1.2);
        S.wheelLast = a;
        if (dt > 1e-5) S.wheelVel += (dTwist / dt - S.wheelVel) * 0.5;
      }
      if (input.justReleased) S.wheelHeld = false;
    } else {
      S.wheelHeld = false;
      dTwist = S.wheelVel * dt;
      S.wheelVel *= Math.exp(-dt / 0.22);
      if (Math.abs(S.wheelVel) < 0.08) S.wheelVel = 0;
    }
    S.wheelVel = clamp(S.wheelVel, -30, 30);
    if (dTwist !== 0) {
      S.wheelAngle += dTwist;
      if (hasCandy) {
        applyTwist(dTwist, -dTwist);
        S.twistTotal += dTwist;
        S.twistSince += Math.abs(dTwist);
        S.twistClick += Math.abs(dTwist);
        if (S.twistClick > 0.5) { S.twistClick = 0; emit('sound', { name: 'twist', gain: 0.6 }); }
        if (!S.twistActed && S.twistSince > 2.2) { S.twistActed = true; S.twistSince = 0; emit('action', { kind: 'twist', strength: 0.5 }); }
      }
    }
    if (input && input.justReleased && grab === 'twist') {
      if (S.twistSince > 0.6) emit('action', { kind: 'twist', strength: Math.min(1, S.twistSince / 6) });
      S.twistSince = 0; S.twistActed = false;
    }
    S.twistRate = dt > 1e-5 ? Math.abs(dTwist) / dt : S.twistRate * 0.9;

    // ---- 飴をつまむ（どこでも。つまんだ所から伸びる） ----
    const pin = S.pin;
    if (hasCandy && grab === 'rope') {
      if (input.justGrabbed && S.fold.phase !== 1 && rayPlaneZ(input.ray, 0, hit)) {
        let best = 3, bd = 1e9;
        for (let i = 3; i < ringCount - 3; i++) {
          const d = (rcx[i] - hit.x) * (rcx[i] - hit.x) + (rcy[i] - hit.y) * (rcy[i] - hit.y);
          if (d < bd) { bd = d; best = i; }
        }
        const u = clamp(stU[best], 0.14, 0.86);
        centerAt(u, pin.pos);
        pin.pos.z = 0;
        pin.t = tAtArc(u * Len);
        pin.goal.copy(pin.pos);
        pin.off.set(pin.pos.x - hit.x, pin.pos.y - hit.y, 0);
        if (pin.off.length() > 0.12) pin.off.setLength(0.12);
        finishAnims(false);
        pin.active = true; pin.blend = 1; pin.moved = 0;
        S.pulse = 0.7; S.pulseU = u;
        emit('sound', { name: 'squish' });
      }
      if (pin.active && input.pointerDown && rayPlaneZ(input.ray, 0, hit)) {
        const xMax = Math.max(S.H.x - 0.03, P.L.x + 0.06);
        pin.goal.set(clamp(hit.x + pin.off.x, P.L.x + 0.03, xMax), clamp(hit.y + pin.off.y, 0.05, 0.72), 0);
      }
      if (input.justReleased && pin.active) { pin.active = false; S.wobVY += 0.25; emit('sound', { name: 'release' }); }
    } else if (pin.active) pin.active = false;
    if (pin.active) {
      const px = pin.pos.x, py = pin.pos.y;
      pin.pos.lerp(pin.goal, 1 - Math.exp(-dt / P.follow));
      pin.moved += Math.hypot(pin.pos.x - px, pin.pos.y - py);
    } else if (pin.blend > 0) pin.blend = Math.max(0, pin.blend - dt / 0.28);

    // ---- 伸ばす（飴は粘土のように伸びたまま。短くは戻らない） ----
    if (hasCandy && S.fold.phase !== 1) {
      const dLH = S.H.distanceTo(P.L);
      const sinPhi = dLH > 1e-4 ? (S.H.y - P.L.y) / dLH : 0;
      if (pin.active) {
        const lenA = sampleArr(cum, pin.t);
        const dA = Math.hypot(pin.pos.x - P.L.x, pin.pos.y - P.L.y);
        if (dA > lenA) stretchBy(dA - lenA, 0, pin.t, dA > 1e-4 ? (pin.pos.y - P.L.y) / dA : 0, 0.3);
        const lenB = Len - sampleArr(cum, pin.t);
        const dB = Math.hypot(S.H.x - pin.pos.x, S.H.y - pin.pos.y);
        if (dB > lenB) stretchBy(dB - lenB, pin.t, 1, dB > 1e-4 ? (S.H.y - pin.pos.y) / dB : 0, 0.3);
      } else if (dLH > Len) {
        stretchBy(dLH - Len, 0, 1, sinPhi, S.speedN);
      }
      // 引く向きが変わると、右のチャックが飴の軸まわりに転がる（引いた向きが縞の傾きとして残る）
      if (dLH > 1e-3) {
        const dirNow = Math.atan2(S.H.y - P.L.y, S.H.x - P.L.x);
        const dRoll = clamp(wrapPi(dirNow - S.dirPrev), -0.5, 0.5) * P.rollGear * sstep(0.15, 0.35, dLH);
        S.dirPrev = dirNow;
        if (Math.abs(dRoll) > 1e-6) { S.rightRoll += dRoll; applyTwist(0, dRoll); }
      }
      const stretch = Len / S.foldBaseLen;
      const rate = dt > 1e-5 ? Math.abs(stretch - S.prevStretch) / dt : 0;
      S.stretchRate += (rate - S.stretchRate) * (1 - Math.exp(-dt / 0.05));
      S.prevStretch = stretch;
      while (S.stretchStep < STRETCH_STEPS.length && stretch >= STRETCH_STEPS[S.stretchStep]) {
        if (S.stretchStep === 0) { S.foldArmed = true; emit('action', { kind: 'stretch', strength: Math.min(1, (stretch - 1) / 2) }); }
        emit('sound', { name: 'stretch', rate: 0.9 + 0.22 * S.stretchStep, gain: 0.8 });
        S.stretchStep++;
      }
      // 折る：十分伸ばしてから、持ち手を左のチャックの近くへ戻したとき
      if (S.foldArmed && dLH < P.foldDist) startFold();
    } else {
      S.stretchRate *= Math.exp(-dt / 0.1);
      if (S.H.distanceToSquared(P.L) > 1e-6) S.dirPrev = Math.atan2(S.H.y - P.L.y, S.H.x - P.L.x);
    }

    // ---- 仕上げ：細い棒にして、ころころ ----
    if (S.stage === 'rolling') {
      S.rollT += dt;
      const tau = clamp(S.rollT / P.rollTime, 0, 1);
      const k = smooth(Math.min(1, tau / 0.7));
      S.rollK = k;
      for (let i = 0; i < NT; i++) den[i] = denStart[i] + (denRod[i] - denStart[i]) * k;
      rebuildCum();
      const z = S.rodZ * k + 0.045 * Math.sin(Math.PI * 3 * tau) * (1 - tau) * k;
      const rr = Math.max(0.012, P.r1 * Math.sqrt((S.lumps.length * P.len0) / Math.max(Len, 0.1)));
      S.rollAngle += (z - S.rollZ) / rr; // 転がる角 = 移動距離 / 半径
      S.rollZ = z;
      if (tau >= 1) {
        S.rollK = 1; S.rollZ = S.rodZ;
        setStage('cutting');
        const q = S.cutQueue.splice(0);
        for (let i = 0; i < q.length; i++) doCut(q[i]);
      }
    }
    if ((S.stage === 'rolling' || S.stage === 'cutting') && input && input.tap && input.tap.id === 'rope' && input.tap.point) {
      api.cut((input.tap.point.x - P.rodX0) / rodLen);
    } else if (hasCandy && input && input.tap && input.tap.id === 'rope') {
      S.pulse = 1; S.wobVY -= 0.35; // ぷにっ
    }
    if (S.stage === 'cutting' || S.stage === 'ready') {
      for (let i = 0; i < S.cuts.length; i++) { const c = S.cuts[i]; c.age += dt; c.g = (P.cutGap / rodLen) * smooth(c.age / 0.14); }
      if (S.cutsDone >= S.piecesWanted) S.rodFade = Math.max(0, S.rodFade - dt / 0.3);
      stationsCut(S.cuts);
    }
    // ピースが列へ跳ぶ（切り口をこちらへ向けながら）
    let moving = false;
    for (let i = 0; i < S.pieces.length; i++) {
      const p = S.pieces[i];
      if (p.t < 1) {
        p.t = Math.min(1, p.t + dt / 0.45);
        moving = true;
        const e = smooth(p.t);
        p.obj.position.lerpVectors(p.from, p.to, e);
        p.obj.position.y += Math.sin(Math.PI * p.t) * 0.13;
        p.obj.scale.setScalar(p.s0 + (1 - p.s0) * backOut(p.t));
        p.obj.rotation.set(-P.pieceTilt * e, (Math.PI / 2) * (1 - e), (1 - e) * 1.2);
        if (p.t >= 1) emit('sound', { name: 'pop', rate: 1 + i * 0.12 });
      }
    }
    S.moving = moving;
    if (S.stage === 'cutting' && S.cutsDone >= S.piecesWanted && !moving && S.rodFade <= 0) {
      setStage('ready');
      emit('ready', {});
    }

    // ---- 自動の動きを進める ----
    if (S.fold.phase === 1) {
      S.fold.q += dt / P.foldT1;
      if (S.fold.q >= 1) commitFold();
    } else if (S.fold.phase === 2) {
      S.fold.q += dt / P.foldT2;
      if (S.fold.q >= 1) { S.fold.phase = 0; S.fold.q = 0; }
    }
    if (S.lumpAnims.length) {
      for (let i = S.lumpAnims.length - 1; i >= 0; i--) {
        const a = S.lumpAnims[i];
        a.op.prog = Math.min(1, a.op.prog + dt / P.lumpTime);
        if (a.op.prog >= 1) S.lumpAnims.splice(i, 1);
      }
      S.opsDirty = true;
    }
    if (S.appear < 1) S.appear = Math.min(1, S.appear + dt / 0.3);
    S.oval = S.fold.phase !== 0 ? 0 : Math.min(1, S.oval + dt / 0.5);
    S.pulse *= Math.exp(-dt / 0.13);
    // ぷるん（まん中が持ち手に遅れてついてくる）。細かく刻んで安定させる
    if (hasCandy) {
      S.wobX -= hvx * 0.35; S.wobY -= hvy * 0.35;
      let rem = dt;
      while (rem > 1e-6) {
        const h = Math.min(rem, 1 / 120);
        S.wobVX += (-380 * S.wobX - 11 * S.wobVX) * h; S.wobVY += (-380 * S.wobY - 11 * S.wobVY) * h;
        S.wobX += S.wobVX * h; S.wobY += S.wobVY * h;
        rem -= h;
      }
      S.wobX = clamp(S.wobX, -0.05, 0.05); S.wobY = clamp(S.wobY, -0.05, 0.05);
    } else { S.wobX = S.wobY = S.wobVX = S.wobVY = 0; }

    // ---- ヒント：発光の脈動と「ぴょこっ」（約 1.6Hz、≤ 0.015m） ----
    const beat = Math.abs(Math.sin(time * Math.PI * 1.6));
    const hp = S.hints.pull, ht = S.hints.twist, hc = Math.max(S.hints.candy, S.hints.rope);
    machine.matKnob.emissiveIntensity = hp * (0.2 + 0.4 * beat);
    machine.matWheel.emissiveIntensity = ht * (0.2 + 0.4 * beat);
    // 折れるようになったら「ここへ戻す」の輪が光り、持ち手は左のチャックの方へ揺れる
    const armed = hasCandy && S.foldArmed;
    machine.matHome.emissiveIntensity = armed ? 0.35 + 0.75 * beat * (0.5 + 0.5 * hp) : 0;
    machine.home.scale.setScalar(armed ? 1 + 0.08 * beat : 0.8);
    bob.set(0, hp * 0.015 * beat);
    if (armed && !S.pullHeld) {
      const dx = P.L.x - S.H.x, dy = P.L.y - S.H.y, dl = Math.hypot(dx, dy);
      if (dl > 1e-3) bob.set((dx / dl) * hp * 0.015 * beat, (dy / dl) * hp * 0.015 * beat);
    }
    U.uGlow.value = hc * (0.1 + 0.3 * beat);
    S.rodBob = S.stage === 'cutting' ? S.hints.rope * 0.012 * beat : 0;
    S.candyBob = hasCandy ? hc * 0.012 * beat : 0;

    // ---- 形を作る ----
    const showRope = S.lumps.length > 0 && S.stage !== 'ready' && S.stage !== 'empty' && S.rodFade > 0;
    rope.visible = showRope;
    if (showRope) {
      const floorY = P.r1 * Math.sqrt((S.lumps.length * P.len0) / Math.max(Len, 0.05)) + 0.004;
      if (S.rollK < 1) {
        if (pin.blend < 0.999) hangSolve(hangFree, P.L.x, P.L.y, S.H.x, S.H.y, Len, floorY);
        if (S.fold.phase === 1) hangSolve(hangNew, P.L.x, P.L.y, S.H.x, S.H.y, S.fold.lenNew, floorY * 1.41);
        if (pin.blend > 0.001) {
          const lenA = sampleArr(cum, pin.t);
          pinUA = clamp(lenA / Len, 0.02, 0.98);
          hangSolve(hangA, P.L.x, P.L.y, pin.pos.x, pin.pos.y, lenA, floorY);
          hangSolve(hangB, pin.pos.x, pin.pos.y, S.H.x, S.H.y, Len - lenA, floorY);
        }
      }
      if (S.opsDirty) { packOps(S.ops, U); S.opsDirty = false; }
      writeRope();
      writeShadow();
    }
    shadow.visible = showRope;
    const twistBob = ht * 0.012 * beat;
    machine.pose(S.H, S.wheelAngle + ht * 0.1 * Math.sin(time * Math.PI * 3.2), S.wheelAngle, S.rightRoll, showRope && S.rollK < 0.5 ? endRadL : 0.03, showRope && S.rollK < 0.5 ? endRadR : 0.03, bob, twistBob);

    // ---- 当たりと状態 ----
    const pts = status.points;
    if (showRope) { centerAt(0.5, pts.ropeCenter); if (S.rollK > 0) pts.ropeCenter.y = Math.max(pts.ropeCenter.y, 0.02); }
    else if (S.stage === 'ready' || S.stage === 'cutting') pts.ropeCenter.set(0, 0.03, S.rodZ);
    else pts.ropeCenter.set((P.L.x + S.H.x) / 2, (P.L.y + S.H.y) / 2, 0);
    if (hasCandy) {
      pts.lumpDrop.copy(pts.ropeCenter); pts.lumpDrop.y += rodRadiusAtU(0.5) + 0.02;
      ropeProxy.position.copy(pts.ropeCenter);
      for (let i = 0; i < 5; i++) {
        const u = 0.18 + 0.16 * i;
        centerAt(u, c1);
        const m = proxyBalls[i];
        m.position.set(c1.x - pts.ropeCenter.x, c1.y - pts.ropeCenter.y, 0);
        m.scale.setScalar(Math.max(0.05, rodRadiusAtU(u) * 1.25));
      }
    } else if (S.stage === 'empty') pts.lumpDrop.set((P.L.x + P.H0.x) / 2, P.L.y + 0.03, 0);
    rodProxy.position.set(0, 0.04, S.rodZ);
    machine.pullKnob.getWorldPosition(pts.pullHandle);
    pts.twistHandle.copy(P.CT);

    syncStatus();
  }
  // 状態の写し（毎フレームの終わりと、API で段階が変わった直後）
  function syncStatus() {
    const hasCandy = S.stage === 'candy' && S.lumps.length > 0;
    status.stage = S.stage; status.lumps = S.lumps.length;
    status.layers = S.lumps.length * Math.min(4096, Math.pow(2, S.folds));
    status.folds = S.folds; status.twist = S.twistTotal;
    status.stretch = hasCandy ? Len / S.foldBaseLen : 1;
    status.stretchRate = hasCandy ? S.stretchRate : 0; status.twistRate = hasCandy ? S.twistRate : 0;
    status.busy = S.stage === 'rolling' || S.moving;
    status.cutsDone = S.cutsDone; status.piecesWanted = S.piecesWanted;
  }
  const bob = new THREE.Vector2();
  const STRETCH_STEPS = [P.foldNeed, 2.0, 2.8]; // 「びよーん」の音を出す伸びの段

  // ---------- API ----------
  const hitList = [];
  const hitPull = { id: 'pull', object: machine.pullProxy, radius: 0.09 };
  const hitTwist = { id: 'twist', object: machine.twistProxy, radius: 0.12 };
  const hitRope = { id: 'rope', object: ropeProxy, radius: 0.07 };
  const hitRod = { id: 'rope', object: rodProxy, radius: 0.12 };
  const safe = (fn, fallback) => function () { try { return fn.apply(null, arguments); } catch (e) { console.error(e); return fallback; } };

  const api = {
    root,
    update: safe(update),
    addLump: safe(addLump, false),
    getHitTargets: safe(() => {
      hitList.length = 0;
      if (S.stage === 'empty' || S.stage === 'candy') {
        hitList.push(hitPull, hitTwist);
        if (S.stage === 'candy' && S.lumps.length > 0) hitList.push(hitRope);
      } else if ((S.stage === 'rolling' || S.stage === 'cutting') && S.cutsDone + S.cutQueue.length < S.piecesWanted) hitList.push(hitRod);
      return hitList;
    }, []),
    setHint: safe((id, level) => {
      if (id in S.hints) S.hints[id] = clamp(+level || 0, 0, 1);
    }),
    beginFinish: safe((o) => {
      if (S.stage !== 'candy' || S.lumps.length === 0) return false;
      S.piecesWanted = clamp(Math.round((o && +o.pieces) || 3), 1, 5);
      finishAnims(true);
      packOps(S.ops, U); S.opsDirty = false;
      S.pullHeld = false; S.wheelVel = 0;
      // 棒の太さ：転がして、ほぼ均一に（少しだけ元のむらが残る＝切る場所で太さが違う）
      denStart.set(den);
      const mean = Len;
      for (let i = 0; i < NT; i++) denRod[i] = 0.65 + (0.35 * den[i]) / mean;
      let s = integrate(denRod);
      for (let i = 0; i < NT; i++) denRod[i] *= rodLen / s;
      const rRod = P.r1 * Math.sqrt((S.lumps.length * P.len0) / rodLen);
      S.rodZ = P.rodZ - Math.max(0, rRod - 0.035) * 0.8;
      S.rollT = 0; S.rollK = 0; S.rollZ = 0; S.rollAngle = 0; S.rodFade = 1;
      S.cutsDone = 0; S.cuts.length = 0; S.cutQueue.length = 0;
      setStage('rolling');
      syncStatus();
      emit('sound', { name: 'roll' });
      return true;
    }, false),
    cut: safe((u) => {
      if (S.stage === 'rolling') {
        if (S.cutQueue.length + S.cutsDone >= S.piecesWanted) return false;
        S.cutQueue.push(u);
        return true;
      }
      if (S.stage !== 'cutting') return false;
      return doCut(u);
    }, false),
    takeGift: safe(() => {
      if (S.stage !== 'ready') return null;
      const pieces = S.pieces.map((p) => p.obj);
      const gift = S.gift;
      S.pieces = []; S.gift = null;
      clearCandy();
      S.moving = false;
      setStage('empty');
      syncStatus();
      let disposed = false;
      return { pieces, dispose() { if (disposed) return; disposed = true; disposeGift(gift); } };
    }, null),
    reset: safe(() => {
      for (const p of S.pieces) root.remove(p.obj);
      disposeGift(S.gift);
      S.pieces = []; S.gift = null; S.moving = false;
      clearCandy();
      setStage('empty');
      syncStatus();
    }),
    getStatus() { return status; },
    restoreGPU: safe(() => {
      // GPU にしかないデータは持っていない（色の層は uniform の履歴、断面も同じ式をその場で評価）。
      // 頂点バッファと uniform を次の描画で送り直す印だけ付ける。遊びの状態はそのまま。
      for (const k in ropeGeo.attributes) ropeGeo.attributes[k].needsUpdate = true;
      S.opsDirty = true;
      candyMat.needsUpdate = true;
      if (S.gift) S.gift.mat.needsUpdate = true;
    }),
    getStats: safe(() => {
      let triangles = 0, drawCalls = 0, geoBytes = 0;
      const seen = new Set();
      root.traverseVisible((o) => {
        if (!o.isMesh || !o.material || o.material.visible === false) return;
        const g = o.geometry;
        const n = g.index ? g.index.count : g.attributes.position.count;
        triangles += (n / 3) * (o.isInstancedMesh ? o.count : 1);
        drawCalls++;
        if (seen.has(g)) return;
        seen.add(g);
        for (const k in g.attributes) geoBytes += g.attributes[k].array.byteLength;
        if (g.index) geoBytes += g.index.array.byteLength;
      });
      const texList = [];
      const t = textures.candy;
      if (t) {
        const img = t.image || {};
        const w = img.width || 1024, h = img.height || 1024;
        texList.push({ name: t.name || 'candy_sheen', width: w, height: h, bytes: Math.round(w * h * 4 * 1.3333) });
      }
      const gpuBytes = geoBytes + texList.reduce((a, x) => a + x.bytes, 0);
      return { triangles: Math.round(triangles), drawCalls, textures: texList, gpuBytes };
    }, { triangles: 0, drawCalls: 0, textures: [], gpuBytes: 0 }),
    dispose: safe(() => {
      api.reset();
      owned.geos.forEach((g) => g.dispose());
      owned.mats.forEach((m) => m.dispose());
      machine.dispose();
      root.removeFromParent();
    }),
  };

  den.fill(P.len0); rebuildCum();
  update(0, null);
  return api;
}
