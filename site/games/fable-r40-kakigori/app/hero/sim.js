// 器の上の「1つの高さマップ」。積もる・崩れる・流れる・たまる・染みる・一口は、すべてこの格子の上で起きる。
// three には依存しない（型付き配列だけ）。状態は CPU にあるので、WebGL コンテキストが消えても残る。
//
//   面の高さ  H = flo（器の底・解析式） + t（氷の厚み） + s（表面のシロップの膜）
//   染み      stW（染みた量）, stC0..2（色 × 量、√リニア空間で持つ＝混ざると自然な中間色）, stM（練乳の白い膜）
//   膜の色    sC0..2（色 × 膜の厚み）, sM（膜のうち練乳の分）
//   act       崩れの「勢い」0..1。止まっている斜面は静止角まで耐え、動き出すと動的な安息角まで崩れ続ける（雪崩が見える）
//
// 座標は器（body）ローカルの xz、単位はメートル。

export const SIM_DEFAULTS = {
  floorPow: 2.2,          // 器の内側の形 floor(r) = yIn + (rimY−yIn)(r/R)^p
  wall: 0.004,            // 縁の内側の余白（R − wall が氷の乗る半径）
  angleStatic: 56,        // 静止角（度）：ここまでは積み上がる
  angleDynamic: 46,       // 動的安息角（度）：崩れ出したらここまで流れる
  actDecay: 0.16,         // act が消える時定数（秒）
  relaxRate: 0.36,        // 1反復で超過分のどれだけ動かすか
  lipIce: 0.002,          // 氷がこぼれ始める縁の上の高さ
  lipSyrup: 0.004,        // シロップがあふれる縁の上の高さ
  snowDepth: 0.8,         // 降ってきた氷が直接当たる所：この厚み分が当たると色が半分に（降り続ける頂上はゆっくり白くなる）
  soakDepth: 0.07,        // シロップが染み込んでいる深さ：正味でこの厚み積もると色が半分に、削れると少し薄い中が出る
  sMin: 6e-5,             // これより薄いシロップの膜は流れない（染みるだけ）
  sMinMilk: 9e-4,         // 練乳は厚く残る
  sRef: 8e-4,             // 染み 1.0 に当たるシロップの厚み
  sFilm: 5e-4,            // 膜がこの厚みで色 1.0 分に見える
  wMax: 1.6,              // 氷が吸える染みの上限
  absK: 5.0,              // 吸収（膜の厚みに比例、1/秒）
  absC: 4e-4,             // 吸収（一定、m/秒）
  mobility: 0.15,         // 流れの速さ（m/秒 ÷ 傾き）
  milkMobility: 0.12,     // 練乳は遅い（倍率）
  thickBoost: 1 / 0.0012, // 厚い膜ほど速い
  mRef: 6e-4,             // 練乳の白 1.0 に当たる厚み
  poolDepth: 9e-4,        // これより厚く、出口が無い所は「たまり」
  melt: 0.7,              // 染みたシロップ 1 に対して氷が沈む量（かけた所がへこみ、流れ道が深くなって筋になる）
  clump: 0.28,            // 氷のかたまり具合：場所ごとに安息角が ±この割合で違う（山肌がでこぼこになる。器ごとに変わる）
};

export function createSim(o) {
  const P = Object.assign({}, SIM_DEFAULTS, o);
  const N = P.N | 0, R = P.rimRadius, RIM_Y = P.rimHeight, Y_IN = P.yIn;
  const L = R, CELL = (2 * L) / (N - 1), CELL_A = CELL * CELL, NN = N * N;
  const RIN = R - P.wall;
  const MAX_H = P.maxHeight;
  const TAN_S = Math.tan((P.angleStatic * Math.PI) / 180), TAN_D = Math.tan((P.angleDynamic * Math.PI) / 180);
  const onSpill = P.onSpill || (() => {}), onDrip = P.onDrip || (() => {});

  const floorAt = (r) => { const q = Math.min(1, Math.max(0, r / R)); return Y_IN + (RIM_Y - Y_IN) * Math.pow(q, P.floorPow); };

  const t = new Float32Array(NN), s = new Float32Array(NN), flo = new Float32Array(NN), act = new Float32Array(NN);
  const inside = new Uint8Array(NN);
  const stW = new Float32Array(NN), stM = new Float32Array(NN), stC0 = new Float32Array(NN), stC1 = new Float32Array(NN), stC2 = new Float32Array(NN);
  const sM = new Float32Array(NN), sC0 = new Float32Array(NN), sC1 = new Float32Array(NN), sC2 = new Float32Array(NN);
  const rep = new Float32Array(NN).fill(1);
  const dS = new Float32Array(NN), dM = new Float32Array(NN), d0 = new Float32Array(NN), d1 = new Float32Array(NN), d2 = new Float32Array(NN);

  let nIn = 0;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i, x = -L + i * CELL, z = -L + j * CELL, r = Math.hypot(x, z);
    flo[k] = floorAt(r);
    if (r <= RIN && i > 0 && j > 0 && i < N - 1 && j < N - 1) { inside[k] = 1; nIn++; }
  }
  const cells = new Int32Array(nIn);
  for (let k = 0, c = 0; k < NN; k++) if (inside[k]) cells[c++] = k;

  // 8近傍
  const OFF = new Int32Array([1, -1, N, -N, N + 1, N - 1, -N + 1, -N - 1]);
  const DX = new Float32Array([1, -1, 0, 0, Math.SQRT1_2, -Math.SQRT1_2, Math.SQRT1_2, -Math.SQRT1_2]);
  const DZ = new Float32Array([0, 0, 1, -1, Math.SQRT1_2, Math.SQRT1_2, -Math.SQRT1_2, -Math.SQRT1_2]);
  const DIST = new Float32Array([CELL, CELL, CELL, CELL, CELL * Math.SQRT2, CELL * Math.SQRT2, CELL * Math.SQRT2, CELL * Math.SQRT2]);
  const e = new Float32Array(8);

  // 器の容量：縁までの体積 ＋ 縁の上に積める円錐の半分強（volume=1 が「山盛り」）
  let bowlVol = 0;
  for (let c = 0; c < nIn; c++) bowlVol += Math.max(0, RIM_Y - flo[cells[c]]) * CELL_A;
  const coneVol = (Math.PI / 3) * RIN * RIN * (RIN * TAN_D);
  const capacity = bowlVol + 0.55 * coneVol;

  // 最近動いた所（さらさら転がる粒を出す場所として hero が読む）
  const recent = new Int32Array(64), recentTo = new Int32Array(64);
  let recentN = 0, sweep = 0;

  const out = { moved: 0, spilled: 0, flux: 0, active: 0, pooled: 0, dripped: 0, poolK: -1 };

  // ---------- 積もる ----------
  // (x,z) を中心にガウス核で厚みを足す。新しい氷は下の色を少しずつ隠す。戻り値：実際に積もった体積。
  function deposit(x, z, vol, sigma) {
    const ci = (x + L) / CELL, cj = (z + L) / CELL, sg = Math.max(0.6, sigma / CELL), rad = Math.ceil(2.2 * sg);
    const i0 = Math.max(1, Math.floor(ci - rad)), i1 = Math.min(N - 2, Math.ceil(ci + rad));
    const j0 = Math.max(1, Math.floor(cj - rad)), j1 = Math.min(N - 2, Math.ceil(cj + rad));
    const s2 = 1 / (2 * sg * sg);
    let sw = 0;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const k = j * N + i; if (inside[k]) sw += Math.exp(-((i - ci) * (i - ci) + (j - cj) * (j - cj)) * s2);
    }
    if (!(sw > 1e-6)) return 0;
    const f = vol / (CELL_A * sw);
    let done = 0;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const k = j * N + i; if (!inside[k]) continue;
      let add = f * Math.exp(-((i - ci) * (i - ci) + (j - cj) * (j - cj)) * s2);
      const room = MAX_H - flo[k] - t[k]; if (add > room) add = room > 0 ? room : 0;
      if (add <= 0) continue;
      t[k] += add; done += add;
      if (stW[k] > 1e-4 || stM[k] > 1e-4) {
        const fade = 1 / (1 + add / P.snowDepth);
        stW[k] *= fade; stC0[k] *= fade; stC1[k] *= fade; stC2[k] *= fade; stM[k] *= fade;
      }
    }
    return done * CELL_A;
  }

  // ---------- 崩れる ----------
  // 隣との高さの差が「今の限界の傾き × 距離」を超えた分を、低い方へ分けて動かす。
  // shx,shz：器を急に動かした時の見かけの力（傾きの単位）。その向きの限界が下がる＝揺すると崩れる。
  function relax(iters, shx, shz) {
    let moved = 0, spilled = 0;
    recentN = 0;
    const rimIce = RIM_Y + P.lipIce, rate = P.relaxRate;
    const shaking = shx !== 0 || shz !== 0;
    for (let it = 0; it < iters; it++) {
      const fwd = (sweep++ & 1) === 0;
      for (let c = 0; c < nIn; c++) {
        const k = cells[fwd ? c : nIn - 1 - c];
        const tk = t[k]; if (tk <= 1e-6) continue;
        const hk = flo[k] + tk;
        const tanK = (TAN_S + (TAN_D - TAN_S) * act[k]) * rep[k];
        let sum = 0, mx = 0;
        for (let n = 0; n < 8; n++) {
          const kn = k + OFF[n];
          const hn = inside[kn] ? flo[kn] + t[kn] : rimIce;
          let th = tanK;
          if (shaking) { const push = shx * DX[n] + shz * DZ[n]; if (push > 0) { th -= push; if (th < 0.12) th = 0.12; } }
          const ex = hk - hn - th * DIST[n];
          if (ex > 0) { e[n] = ex; sum += ex; if (ex > mx) mx = ex; } else e[n] = 0;
        }
        if (sum <= 0) continue;
        let mv = rate * mx; if (mv > tk) mv = tk;
        if (mv < 1e-7) continue;
        t[k] = tk - mv; moved += mv;
        act[k] = 1;
        const inv = mv / sum;
        for (let n = 0; n < 8; n++) {
          if (e[n] <= 0) continue;
          const q = e[n] * inv, kn = k + OFF[n];
          if (inside[kn]) {
            t[kn] += q;
            if (act[kn] < 0.85) act[kn] = 0.85;
          } else { spilled += q; onSpill(k, kn, q * CELL_A); }
        }
        if (mv > 2.5e-5 && recentN < 64) { let b = 0; for (let n = 1; n < 8; n++) if (e[n] > e[b]) b = n; recent[recentN] = k; recentTo[recentN++] = b; }
      }
    }
    out.moved = moved * CELL_A; out.spilled = spilled * CELL_A;
    return out;
  }

  // 染みと氷の厚みの関係（毎フレーム、崩れの後に呼ぶ）。
  // 染みはその場所に残る。上に正味で氷が増えた分だけ薄まり（転がって通り過ぎるだけの氷では薄まらない）、
  // 削れて減った所は、染みの浅い中の氷が出て少し薄くなる。
  const tPrev = new Float32Array(NN);
  function settle() {
    const D = P.soakDepth;
    for (let c = 0; c < nIn; c++) {
      const k = cells[c], d = t[k] - tPrev[k];
      if (d === 0) continue;
      tPrev[k] = t[k];
      if (stW[k] < 1e-4 && stM[k] < 1e-4) continue;
      const f = d > 0 ? D / (D + d) : Math.exp(d / D);
      stW[k] *= f; stC0[k] *= f; stC1[k] *= f; stC2[k] *= f; stM[k] *= f;
    }
  }

  function decayAct(dt, agit) {
    const f = Math.exp(-dt / P.actDecay);
    for (let c = 0; c < nIn; c++) { const k = cells[c]; let a = act[k] * f; if (a < agit) a = agit; act[k] = a < 1e-3 ? 0 : a; }
  }

  // ---------- シロップをかける ----------
  // c0..c2 は √リニアの色（0..1）。milk=1 なら練乳。
  function pour(x, z, vol, c0, c1, c2, milk, sigma) {
    const ci = (x + L) / CELL, cj = (z + L) / CELL, sg = Math.max(0.7, sigma / CELL), rad = Math.ceil(2.2 * sg);
    const i0 = Math.max(1, Math.floor(ci - rad)), i1 = Math.min(N - 2, Math.ceil(ci + rad));
    const j0 = Math.max(1, Math.floor(cj - rad)), j1 = Math.min(N - 2, Math.ceil(cj + rad));
    const s2 = 1 / (2 * sg * sg);
    let sw = 0;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const k = j * N + i; if (inside[k]) sw += Math.exp(-((i - ci) * (i - ci) + (j - cj) * (j - cj)) * s2);
    }
    if (!(sw > 1e-6)) return 0;
    const f = vol / (CELL_A * sw), dye = 1 - milk;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const k = j * N + i; if (!inside[k]) continue;
      const add = f * Math.exp(-((i - ci) * (i - ci) + (j - cj) * (j - cj)) * s2);
      s[k] += add; sM[k] += add * milk;
      sC0[k] += add * dye * c0; sC1[k] += add * dye * c1; sC2[k] += add * dye * c2;
    }
    return vol;
  }

  // ---------- 流れる・染みる・たまる ----------
  // 膜は H=flo+t+s の低い方へ（急な方ほど多く）流れ、氷に吸われて染みになる。出口の無い窪みでは s が残って水面が上がる＝たまる。
  function flow(dt) {
    const rimS = RIM_Y + P.lipSyrup;
    let flux = 0, active = 0, pooled = 0, dripped = 0, poolK = -1, poolS = 0;
    const mobBase = (P.mobility * dt) / CELL;
    for (let c = 0; c < nIn; c++) {
      const k = cells[c];
      let sk = s[k];
      if (sk <= 2e-6) { if (sk > 0 && t[k] > 2e-4) { absorb(k, sk, sk); } continue; }
      active++;
      const tk = t[k];
      let mf = sM[k] / sk; if (mf > 1) mf = 1; else if (mf < 0) mf = 0;
      if (tk > 2e-4) {
        // 氷に染みる（染みるほど吸わなくなる → 後から来たシロップは先へ流れる）
        const loadNow = stW[k] + stM[k] * 0.8;
        let room = 1 - loadNow / P.wMax; if (room < 0.02) room = loadNow > P.wMax * 1.25 ? 0 : 0.02;
        let ab = (P.absK * sk + P.absC) * room * dt * (1 - 0.93 * mf); // 練乳はほとんど染みずに上に残る
        if (ab > sk) ab = sk;
        absorb(k, ab, sk);
        sk = s[k];
      }
      const smin = P.sMin + (P.sMinMilk - P.sMin) * mf;
      if (sk <= smin) continue;
      const hk = flo[k] + tk + sk;
      let sum = 0, dmax = 0, dh = 0;
      for (let n = 0; n < 8; n++) {
        const kn = k + OFF[n];
        const hn = inside[kn] ? flo[kn] + t[kn] + s[kn] : rimS;
        const d = (hk - hn) / DIST[n];
        if (d > 0) { const w = d * d; e[n] = w; sum += w; if (d > dmax) { dmax = d; dh = hk - hn; } } else e[n] = 0;
      }
      if (sum <= 0) { if (sk > P.poolDepth) { pooled++; if (sk > poolS) { poolS = sk; poolK = k; } } continue; }
      let phi = mobBase * dmax * (1 + sk * P.thickBoost) * (1 + (P.milkMobility - 1) * mf);
      if (phi > 0.45) phi = 0.45;
      let q = (sk - smin) * phi; const lim = 0.5 * dh; if (q > lim) q = lim;
      if (q <= 0) continue;
      if (dmax < 0.05 && sk > P.poolDepth) { pooled++; if (sk > poolS) { poolS = sk; poolK = k; } }
      const fr = q / sk, inv = q / sum;
      const m = sM[k] * fr / q, a0 = sC0[k] * fr / q, a1 = sC1[k] * fr / q, a2 = sC2[k] * fr / q; // 1 あたりの中身
      dS[k] -= q; dM[k] -= q * m; d0[k] -= q * a0; d1[k] -= q * a1; d2[k] -= q * a2;
      for (let n = 0; n < 8; n++) {
        if (e[n] <= 0) continue;
        const p = e[n] * inv, kn = k + OFF[n];
        if (inside[kn]) { dS[kn] += p; dM[kn] += p * m; d0[kn] += p * a0; d1[kn] += p * a1; d2[kn] += p * a2; }
        else { dripped += p; onDrip(k, kn, p * CELL_A, a0, a1, a2, m); }
      }
      flux += q;
    }
    for (let c = 0; c < nIn; c++) {
      const k = cells[c];
      if (dS[k] === 0) continue;
      let v = s[k] + dS[k]; if (!(v > 0)) v = 0;
      s[k] = v;
      if (v === 0) { sM[k] = sC0[k] = sC1[k] = sC2[k] = 0; }
      else {
        let a = sM[k] + dM[k]; sM[k] = a > 0 ? (a < v ? a : v) : 0;
        a = sC0[k] + d0[k]; sC0[k] = a > 0 ? a : 0; a = sC1[k] + d1[k]; sC1[k] = a > 0 ? a : 0; a = sC2[k] + d2[k]; sC2[k] = a > 0 ? a : 0;
      }
      dS[k] = dM[k] = d0[k] = d1[k] = d2[k] = 0;
    }
    out.flux = flux * CELL_A; out.active = active; out.pooled = pooled; out.dripped = dripped * CELL_A; out.poolK = poolK;
    return out;
  }

  function absorb(k, ab, sk) {
    if (!(ab > 0) || !(sk > 0)) return;
    const f = ab >= sk ? 1 : ab / sk;
    const mAb = sM[k] * f, dyeAb = ab - mAb;
    if (dyeAb > 0) {
      const w = dyeAb / P.sRef;
      const tk = t[k] - dyeAb * P.melt, tn = tk > 0 ? tk : 0; tPrev[k] += tn - t[k]; t[k] = tn; // 沈んだ分は「削れ」に数えない
      stW[k] += w; stC0[k] += (sC0[k] * f) / P.sRef; stC1[k] += (sC1[k] * f) / P.sRef; stC2[k] += (sC2[k] * f) / P.sRef;
      if (stM[k] > 0) stM[k] *= Math.max(0, 1 - 0.5 * w); // 上から色がかかれば、練乳の白は少し引っ込む
    }
    if (mAb > 0) { let m = stM[k] + mAb / P.mRef; if (m > 1.2) m = 1.2; stM[k] = m; }
    if (f >= 1) { s[k] = 0; sM[k] = sC0[k] = sC1[k] = sC2[k] = 0; }
    else { const g = 1 - f; s[k] = sk - ab; sM[k] *= g; sC0[k] *= g; sC1[k] *= g; sC2[k] *= g; }
  }

  // ---------- 面の高さ ----------
  function heightAt(x, z) {
    let fi = (x + L) / CELL, fj = (z + L) / CELL;
    if (!(fi > 0)) fi = 0; else if (fi > N - 1.001) fi = N - 1.001;
    if (!(fj > 0)) fj = 0; else if (fj > N - 1.001) fj = N - 1.001;
    const i = fi | 0, j = fj | 0, a = fi - i, b = fj - j, k = j * N + i;
    const h00 = flo[k] + t[k] + s[k], h10 = flo[k + 1] + t[k + 1] + s[k + 1], h01 = flo[k + N] + t[k + N] + s[k + N], h11 = flo[k + N + 1] + t[k + N + 1] + s[k + N + 1];
    return (h00 * (1 - a) + h10 * a) * (1 - b) + (h01 * (1 - a) + h11 * a) * b;
  }
  function cellAt(x, z) {
    let i = Math.round((x + L) / CELL), j = Math.round((z + L) / CELL);
    if (!(i > 1)) i = 1; else if (i > N - 2) i = N - 2;
    if (!(j > 1)) j = 1; else if (j > N - 2) j = N - 2;
    return j * N + i;
  }

  // ---------- 一口 ----------
  // 球でくり抜く。切り口は中の（色の薄い）氷が見える。周りは勢いが付いて、次のフレームから崩れて整う。
  function bite(x, z, rad) {
    rad = Math.max(CELL * 1.5, Math.min(R, +rad || 0.03));
    const top = heightAt(x, z), cy = top + rad * 0.3, r2 = rad * rad, wide = (rad * 1.6) * (rad * 1.6);
    let removed = 0;
    for (let c = 0; c < nIn; c++) {
      const k = cells[c], cx = -L + (k % N) * CELL, cz = -L + ((k / N) | 0) * CELL;
      const dd = (cx - x) * (cx - x) + (cz - z) * (cz - z);
      if (dd > wide) continue;
      act[k] = 1;
      if (dd >= r2) continue;
      const cutTo = cy - Math.sqrt(r2 - dd);
      let cut = flo[k] + t[k] - cutTo; if (cut > t[k]) cut = t[k];
      if (cut <= 0) continue;
      t[k] -= cut; removed += cut; tPrev[k] = t[k];
      const f = Math.exp(-cut / 0.014);
      stW[k] *= f; stC0[k] *= f; stC1[k] *= f; stC2[k] *= f; stM[k] *= f;
      const g = Math.exp(-cut / 0.004); s[k] *= g; sM[k] *= g; sC0[k] *= g; sC1[k] *= g; sC2[k] *= g;
    }
    return removed * CELL_A;
  }

  // かたまり具合の模様（なめらかな乱数）。器ごとに作り直すので、同じ動かし方でも山肌が少し違う。
  let seed = (P.seed | 0) || 12345;
  const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 8) / 16777216; };
  const tmpN = new Float32Array(NN);
  function reclump() {
    for (let k = 0; k < NN; k++) tmpN[k] = rnd() * 2 - 1;
    for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
      const k = j * N + i;
      const sm = (tmpN[k - 1] + tmpN[k + 1] + tmpN[k - N] + tmpN[k + N]) * 0.25;
      rep[k] = 1 + P.clump * Math.max(-1, Math.min(1, tmpN[k] * 0.55 + sm * 1.1));
    }
  }

  function reset() {
    for (const a of [t, tPrev, s, act, stW, stM, stC0, stC1, stC2, sM, sC0, sC1, sC2, dS, dM, d0, d1, d2]) a.fill(0);
    recentN = 0;
    reclump();
  }
  reclump();

  // volume 0..1、peak（台から m）、coverage（氷の面のうち染まった割合）
  function stats(o) {
    let vol = 0, peak = Y_IN, ice = 0, stained = 0, wet = 0;
    for (let c = 0; c < nIn; c++) {
      const k = cells[c], tk = t[k];
      vol += tk;
      const col = stW[k] + stM[k] + s[k] / P.sFilm;
      if (tk > 0.001) { ice++; const h = flo[k] + tk; if (h > peak) peak = h; if (col > 0.18) stained++; }
      if (col > 0.18) wet++;
    }
    o.volume = Math.min(1, (vol * CELL_A) / capacity);
    o.rawVolume = vol * CELL_A;
    o.peak = peak;
    o.coverage = ice > 0 ? stained / ice : 0;
    o.wetCells = wet;
    return o;
  }

  return {
    P, N, NN, L, CELL, CELL_A, RIN, R, RIM_Y, Y_IN, capacity, floorAt,
    t, s, flo, act, inside, cells, stW, stM, stC0, stC1, stC2, sM, sC0, sC1, sC2,
    OFF, DX, DZ, recent, recentTo, get recentN() { return recentN; },
    deposit, relax, settle, decayAct, pour, flow, heightAt, cellAt, bite, reset, stats,
  };
}
