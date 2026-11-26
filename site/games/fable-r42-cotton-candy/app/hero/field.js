// わたあめの形の場（three に依らない計算だけ）。
//   形 ＝ 割り箸に沿った線分（カプセルの芯）から、方向ごとに測った半径 r(方向)。
//         表面の点 = 芯の点 a(d) + d·r(d)、 a(d) = (0, capsuleHalf·d.y, 0)。d は正二十面体を分割した方向。
//   色 ＝ 方向ごとの層の積み重ね（内→外、最大 maxLayers）。層 k は半径 lR[k-1]..lR[k] が色 lC[k]。
// 育てる・平らす・かじる・表示用の頂点を書く、をここで行う。

// ---------------------------------------------------------------- 乱数と雑音
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash3(ix, iy, iz, seed) {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(iz, 2147483647) ^ Math.imul(seed, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
// 値雑音（0..1、滑らか）
export function vnoise(x, y, z, seed) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  let fx = x - ix, fy = y - iy, fz = z - iz;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
  const a = hash3(ix, iy, iz, seed), b = hash3(ix + 1, iy, iz, seed), c = hash3(ix, iy + 1, iz, seed), d = hash3(ix + 1, iy + 1, iz, seed);
  const e = hash3(ix, iy, iz + 1, seed), f = hash3(ix + 1, iy, iz + 1, seed), g = hash3(ix, iy + 1, iz + 1, seed), h = hash3(ix + 1, iy + 1, iz + 1, seed);
  const x0 = a + (b - a) * fx, x1 = c + (d - c) * fx, x2 = e + (f - e) * fx, x3 = g + (h - g) * fx;
  const y0 = x0 + (x1 - x0) * fy, y1 = x2 + (x3 - x2) * fy;
  return y0 + (y1 - y0) * fz;
}

// ---------------------------------------------------------------- 方向の集合（正二十面体の各辺を sub 分割）
const LUT_G = 16;                 // 方向 → いちばん近い頂点 の早見表（立方体の各面 G×G）
const baseCache = new Map();

export function getBase(sub) {
  let b = baseCache.get(sub);
  if (!b) { b = buildBase(sub); baseCache.set(sub, b); }
  return b;
}

function buildBase(sub) {
  const t = (1 + Math.sqrt(5)) / 2;
  const V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  const F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const key = new Map(), dirs = [], idx = [];
  const vid = (x, y, z) => {
    const l = Math.hypot(x, y, z) || 1; x /= l; y /= l; z /= l;
    const k = Math.round(x * 2e4) + ',' + Math.round(y * 2e4) + ',' + Math.round(z * 2e4);
    let i = key.get(k);
    if (i === undefined) { i = dirs.length / 3; key.set(k, i); dirs.push(x, y, z); }
    return i;
  };
  for (const f of F) {
    const a = V[f[0]], b = V[f[1]], c = V[f[2]], row = [];
    for (let i = 0; i <= sub; i++) {
      row[i] = [];
      for (let j = 0; j <= sub - i; j++) {
        const u = i / sub, v = j / sub, w = 1 - u - v;
        row[i][j] = vid(a[0] * w + b[0] * u + c[0] * v, a[1] * w + b[1] * u + c[1] * v, a[2] * w + b[2] * u + c[2] * v);
      }
    }
    for (let i = 0; i < sub; i++) for (let j = 0; j < sub - i; j++) {
      idx.push(row[i][j], row[i + 1][j], row[i][j + 1]);
      if (j < sub - i - 1) idx.push(row[i + 1][j], row[i + 1][j + 1], row[i][j + 1]);
    }
  }
  const n = dirs.length / 3;
  // 隣（平らすのに使う）
  const sets = Array.from({ length: n }, () => new Set());
  for (let i = 0; i < idx.length; i += 3) {
    const a = idx[i], b = idx[i + 1], c = idx[i + 2];
    sets[a].add(b); sets[a].add(c); sets[b].add(a); sets[b].add(c); sets[c].add(a); sets[c].add(b);
  }
  const nbrOff = new Int32Array(n + 1), flat = [];
  for (let i = 0; i < n; i++) { nbrOff[i] = flat.length; for (const j of sets[i]) flat.push(j); }
  nbrOff[n] = flat.length;
  const base = {
    sub, n, tris: idx.length / 3, dirs: new Float32Array(dirs),
    index: n > 65535 ? new Uint32Array(idx) : new Uint16Array(idx),
    nbr: new Int32Array(flat), nbrOff, lut: null, maps: new Map(),
  };
  // 早見表：立方体の面のマスの中心方向に、いちばん近い頂点
  const G = LUT_G, lut = new Uint16Array(6 * G * G), D = base.dirs;
  for (let f = 0; f < 6; f++) for (let iv = 0; iv < G; iv++) for (let iu = 0; iu < G; iu++) {
    const u = (iu + 0.5) / G * 2 - 1, v = (iv + 0.5) / G * 2 - 1, s = f & 1 ? -1 : 1;
    let x, y, z;
    if (f < 2) { x = s; y = u; z = v; } else if (f < 4) { y = s; x = u; z = v; } else { z = s; x = u; y = v; }
    let best = 0, bd = -2;
    const l = Math.hypot(x, y, z);
    for (let i = 0; i < n; i++) { const d = (D[i * 3] * x + D[i * 3 + 1] * y + D[i * 3 + 2] * z) / l; if (d > bd) { bd = d; best = i; } }
    lut[(f * G + iv) * G + iu] = best;
  }
  base.lut = lut;
  return base;
}

// 方向 (x,y,z)（正規化していなくてよい）にいちばん近い頂点の番号
export function nearest(base, x, y, z) {
  const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z), G = LUT_G;
  let f, u, v, m;
  if (ax >= ay && ax >= az) { m = ax; f = x > 0 ? 0 : 1; u = y; v = z; }
  else if (ay >= az) { m = ay; f = y > 0 ? 2 : 3; u = x; v = z; }
  else { m = az; f = z > 0 ? 4 : 5; u = x; v = y; }
  if (!(m > 1e-12)) return 0;
  let iu = ((u / m * 0.5 + 0.5) * G) | 0, iv = ((v / m * 0.5 + 0.5) * G) | 0;
  if (iu > G - 1) iu = G - 1; if (iv > G - 1) iv = G - 1;
  return base.lut[(f * G + iv) * G + iu];
}

// to の各方向に、from でいちばん近い方向の番号（解像度を替えるとき）
function mapBetween(from, to) {
  let m = from.maps.get(to.sub);
  if (m) return m;
  m = new Int32Array(to.n);
  const A = from.dirs, B = to.dirs;
  for (let i = 0; i < to.n; i++) {
    const x = B[i * 3], y = B[i * 3 + 1], z = B[i * 3 + 2];
    let best = 0, bd = -2;
    for (let j = 0; j < from.n; j++) { const d = A[j * 3] * x + A[j * 3 + 1] * y + A[j * 3 + 2] * z; if (d > bd) { bd = d; best = j; } }
    m[i] = best;
  }
  from.maps.set(to.sub, m);
  return m;
}

// ---------------------------------------------------------------- 場
export function createField(base, P, seed, colorIndex) {
  const n = base.n, L = P.maxLayers;
  const f = {
    base, seed, n,
    r: new Float32Array(n).fill(P.r0),
    fresh: new Float32Array(n),            // 絡んだばかり 0..1（表示用、すぐ消える）
    nL: new Uint8Array(n).fill(1),         // 層の数
    lR: new Float32Array(n * L),           // 各層の外側の半径
    lC: new Uint8Array(n * L),             // 各層の色
    lump: null, tuft: null, rMaxDir: null, // 方向の関数（解像度を替えたら作り直す）
    tmp: new Float32Array(n),
    used: [],                              // 使った色（内→外、重複なし）
    lastColor: colorIndex,
    volume: 0, volume0: 0, radius: 0, meanR: P.r0, anyFresh: false,
  };
  for (let i = 0; i < n; i++) { f.lR[i * L] = P.r0; f.lC[i * L] = colorIndex; }
  bakeStatic(f, P);
  return f;
}

// 方向だけで決まる量：でこぼこ・房・方向ごとの最大半径
function bakeStatic(f, P) {
  const { base, n, seed } = f, D = base.dirs;
  f.lump = new Float32Array(n); f.tuft = new Float32Array(n); f.rMaxDir = new Float32Array(n);
  const centerFromHandle = P.stickLength - P.candyFromTip;
  for (let i = 0; i < n; i++) {
    const x = D[i * 3], y = D[i * 3 + 1], z = D[i * 3 + 2];
    const a = vnoise(x * P.lumpFreq + 7.1, y * P.lumpFreq + 3.3, z * P.lumpFreq + 5.7, seed);
    const b = vnoise(x * P.lumpFreq * 2.3 + 1.7, y * P.lumpFreq * 2.3 + 9.2, z * P.lumpFreq * 2.3 + 4.4, seed + 11);
    f.lump[i] = (a * 2 - 1) * 0.7 + (b * 2 - 1) * 0.3;                       // -1..1
    f.tuft[i] = 0.65 + 0.7 * vnoise(x * 5.3 + 2.2, y * 5.3 + 6.1, z * 5.3 + 8.8, seed + 23);   // 0.65..1.35
    // 持ち手の側は、持つ所（handleFree）を残す
    let m = P.rMax - P.tipTrim * P.capsuleHalf * Math.max(0, y);   // 先の側：芯の長さの分だけ控える（全体が丸く収まる）
    if (y < -0.05) m = Math.min(m, (centerFromHandle - P.handleFree + P.capsuleHalf * y) / -y);
    f.rMaxDir[i] = Math.max(P.r0 * 2, m);
  }
}

// 解像度を替える（形・色の層を保つ）
export function resampleField(src, base, P) {
  if (src.base === base) return src;
  const map = mapBetween(src.base, base), L = P.maxLayers, n = base.n;
  const f = {
    base, seed: src.seed, n,
    r: new Float32Array(n), fresh: new Float32Array(n), nL: new Uint8Array(n),
    lR: new Float32Array(n * L), lC: new Uint8Array(n * L),
    lump: null, tuft: null, rMaxDir: null, tmp: new Float32Array(n),
    used: src.used.slice(), lastColor: src.lastColor,
    volume: src.volume, volume0: 0, radius: src.radius, meanR: src.meanR, anyFresh: src.anyFresh,
  };
  for (let i = 0; i < n; i++) {
    const j = map[i];
    f.r[i] = src.r[j]; f.fresh[i] = src.fresh[j]; f.nL[i] = src.nL[j];
    for (let k = 0; k < L; k++) { f.lR[i * L + k] = src.lR[j * L + k]; f.lC[i * L + k] = src.lC[j * L + k]; }
  }
  bakeStatic(f, P);
  return f;
}

function kern(c, cosA) { const x = (c - cosA) / (1 - cosA); return x > 0 ? x * x : 0; }

// 糸が絡む：Δr_i = rate·dt·w_i·g(r_i)。
//   w_i = srcW·K(d_i·src; alphaSrc) + motW·K(d_i·mot; alphaMot) + uni   （src：糸が来る側、mot：動かした側、どちらもローカルの単位ベクトル）
//   g(r) = (1 − r/rMaxDir)^roomPow · (1 + earlyBoost·exp(−r/earlyR))
// そのあと谷だけを埋める（糸は張って絡むので、くぼみに橋がかかる。山は削らない＝育った所は残る）。
// 戻り値：この回に増えた半径の平均（m）。
export function deposit(f, P, dt, src, srcW, mot, motW, uni, colorIndex, organic) {
  const { base, n, r, tmp, fresh } = f, D = base.dirs, L = P.maxLayers;
  const cosS = Math.cos(P.alphaSrc * Math.PI / 180), cosM = Math.cos(P.alphaMot * Math.PI / 180);
  const k = P.rate * dt;
  let total = 0;
  for (let i = 0; i < n; i++) {
    const x = D[i * 3], y = D[i * 3 + 1], z = D[i * 3 + 2];
    let w = uni;
    if (srcW > 0) w += srcW * kern(x * src.x + y * src.y + z * src.z, cosS);
    if (motW > 0) w += motW * kern(x * mot.x + y * mot.y + z * mot.z, cosM);
    if (w <= 0) { tmp[i] = 0; continue; }
    const ri = r[i];
    const room = Math.max(1 - ri / f.rMaxDir[i], 0);
    const g = Math.pow(room, P.roomPow) * (1 + P.earlyBoost * Math.exp(-ri / P.earlyR));
    // 房ごとに少しむらを付ける（毎回同じ球にならない）
    const dr = k * w * g * (1 + organic * f.lump[i]);
    tmp[i] = dr > 0 ? dr : 0;
  }
  // 色の層に積む
  for (let i = 0; i < n; i++) {
    const dr = tmp[i];
    if (dr <= 0) continue;
    addLayer(f, i, dr, colorIndex, L, P);
    total += dr;
    const fr = fresh[i] + dr * P.freshGain;
    fresh[i] = fr > 1 ? 1 : fr;
  }
  // 谷を埋める（片側だけの平滑化）
  const nb = base.nbr, off = base.nbrOff, lam = Math.min(0.5, P.fill * dt);
  for (let i = 0; i < n; i++) {
    let sum = 0; const a = off[i], b = off[i + 1];
    for (let j = a; j < b; j++) sum += r[nb[j]];
    const d = sum / (b - a) - r[i];
    tmp[i] = d > 0 ? d * lam : 0;
  }
  for (let i = 0; i < n; i++) {
    const dr = tmp[i];
    if (dr > 1e-7) { addLayer(f, i, dr, colorIndex, L, P); total += dr; }
  }
  if (total > 0) {
    f.anyFresh = true; f.lastColor = colorIndex;
    if (f.used.indexOf(colorIndex) < 0) f.used.push(colorIndex);
  }
  return total / n;
}

function addLayer(f, i, dr, c, L, P) {
  const o = i * L, r = f.r, lR = f.lR, lC = f.lC;
  let top = f.nL[i] - 1;
  const nr = Math.min(r[i] + dr, f.rMaxDir[i]);
  if (lC[o + top] !== c) {
    const thick = r[i] - (top > 0 ? lR[o + top - 1] : 0);
    if (r[i] <= P.r0 * 1.05 || thick < P.layerMin) {
      // いちばん上がごく薄い：塗り替える（下と同じ色になったら 1 つにまとめる）
      lC[o + top] = c;
      if (top > 0 && lC[o + top - 1] === c) { top--; f.nL[i] = top + 1; }
    } else if (dr < P.layerMinDr) {
      // 裾のごくわずかな量では層を作らない（前の色に混ぜる）
    } else {
      if (top === L - 1) {   // 満杯：いちばん内側の 2 層を 1 つに
        for (let k = 0; k < L - 1; k++) { lR[o + k] = lR[o + k + 1]; lC[o + k] = lC[o + k + 1]; }
        top--;
      }
      top++; f.nL[i] = top + 1; lC[o + top] = c;
    }
  }
  r[i] = nr; lR[o + top] = nr;
}

// 絡んだばかりの印を減らす。まだ残っていれば true
export function decayFresh(f, P, dt) {
  if (!f.anyFresh) return false;
  const k = Math.exp(-dt / P.freshTau), fr = f.fresh;
  let any = false;
  for (let i = 0; i < f.n; i++) { let v = fr[i]; if (v > 0) { v *= k; if (v < 0.004) v = 0; else any = true; fr[i] = v; } }
  f.anyFresh = any;
  return true;
}

// ---------------------------------------------------------------- 表示用の頂点を書く
// out: { pos, nor, c0, c1, fx }（Float32Array）。pos はわたあめの中心が原点（ローカル：+Y が割り箸の先の向き）。
//   c0 = (外の層の色 rgb, その層の厚み m)、c1 = (その下の層の色 rgb, 毛羽の長さ m)、fx = (絡んだばかり, かじられた面, くぼみ −1..1)
// bite: null か { n, x[], y[], z[], rad[] }（中心が原点の球で削る）。pal: Float32Array（色ごとに線形 rgb）。
export function writeSurface(f, P, out, bite, pal) {
  const { base, n, r } = f, D = base.dirs, L = P.maxLayers, h = P.capsuleHalf;
  const pos = out.pos, c0 = out.c0, c1 = out.c1, fx = out.fx, lR = f.lR, lC = f.lC;
  const rrA = f.rr || (f.rr = new Float32Array(n)), cutA = f.cut || (f.cut = new Float32Array(n));
  const b0 = f.b0 || (f.b0 = new Float32Array(n)), b1 = f.b1 || (f.b1 = new Float32Array(n));
  // 1) 表示する半径（でこぼこ込み、かじった所は切る）
  for (let i = 0; i < n; i++) {
    const dx = D[i * 3], dy = D[i * 3 + 1], dz = D[i * 3 + 2], ay = h * dy;
    let rr = r[i] * (1 + P.lumpAmp * f.lump[i] * Math.min(1, r[i] / P.lumpFullR)), cut = 0;
    if (bite) {
      for (let b = 0; b < bite.n; b++) {
        // 光線 a + t·d と球 |p − B| = ρ：入る所 t で切る
        const ox = -bite.x[b], oy = ay - bite.y[b], oz = -bite.z[b];
        const bb = ox * dx + oy * dy + oz * dz, cc = ox * ox + oy * oy + oz * oz - bite.rad[b] * bite.rad[b];
        const disc = bb * bb - cc;
        if (disc <= 0) continue;
        const sq = Math.sqrt(disc), t1 = -bb + sq;
        if (t1 <= 0) continue;
        const t0 = Math.max(-bb - sq, P.r0);
        if (t0 < rr) { cut = Math.max(cut, Math.min(1, (rr - t0) / 0.006)); rr = t0; }
      }
    }
    rrA[i] = rr; cutA[i] = cut; b0[i] = rr;
  }
  // 2) くぼみ：半径を近傍でならしたものとの差（谷は暗く、山は明るく描く）
  const nb = base.nbr, off = base.nbrOff;
  let src = b0, dst = b1;
  for (let it = 0; it < P.cavityIters; it++) {
    for (let i = 0; i < n; i++) {
      let sum = src[i]; const a = off[i], b = off[i + 1];
      for (let j = a; j < b; j++) sum += src[nb[j]];
      dst[i] = sum / (b - a + 1);
    }
    const t = src; src = dst; dst = t;
  }
  // 3) 頂点・色
  let rmax2 = 0, rsum = 0, rtop = 0;
  for (let i = 0; i < n; i++) {
    const dx = D[i * 3], dy = D[i * 3 + 1], dz = D[i * 3 + 2], ay = h * dy, rr = rrA[i], cut = cutA[i];
    const px = dx * rr, py = ay + dy * rr, pz = dz * rr;
    pos[i * 3] = px; pos[i * 3 + 1] = py; pos[i * 3 + 2] = pz;
    if (r[i] > P.r0 * 2) { const d2 = px * px + py * py + pz * pz; if (d2 > rmax2) rmax2 = d2; }
    rsum += rr; if (rr > rtop) rtop = rr;
    // 色：切り口の半径（層の座標）がどの層か
    const o = i * L, rs = cut > 0 ? rr / (1 + P.lumpAmp * f.lump[i] * Math.min(1, r[i] / P.lumpFullR)) : r[i];
    let k = f.nL[i] - 1;
    while (k > 0 && lR[o + k - 1] >= rs) k--;
    const below = k > 0 ? lR[o + k - 1] : 0;
    const ca = lC[o + k] * 3, cb = (k > 0 ? lC[o + k - 1] : lC[o + k]) * 3;
    c0[i * 4] = pal[ca]; c0[i * 4 + 1] = pal[ca + 1]; c0[i * 4 + 2] = pal[ca + 2];
    c0[i * 4 + 3] = k > 0 ? Math.max(0, rs - below) : 1;
    c1[i * 4] = pal[cb]; c1[i * 4 + 1] = pal[cb + 1]; c1[i * 4 + 2] = pal[cb + 2];
    // 毛羽の長さ：大きいほど長く、房ごとにむら。何も付いていない所は 0。かじった面は短い
    const grown = Math.min(1, Math.max(0, (rr - P.r0 * 1.2) / P.fluffRampR));
    let fl = Math.min(P.fluffMax, P.fluffMin + P.fluffK * rr) * f.tuft[i] * grown;
    if (cut > 0) fl *= 1 - 0.75 * cut;
    c1[i * 4 + 3] = fl;
    const cav = (src[i] - rr) / (P.cavityRef + P.cavityK * rr);
    fx[i * 3] = f.fresh[i]; fx[i * 3 + 1] = cut; fx[i * 3 + 2] = cav < -1 ? -1 : cav > 1 ? 1 : cav;
  }
  computeNormals(base, pos, out.nor);
  f.radius = Math.sqrt(rmax2);     // 綿が付いている所だけで測る（空なら 0）
  f.meanR = rsum / n;
  return out;
}

// 頂点の法線（面の法線を面積で重み付けして足す）
export function computeNormals(base, pos, nor) {
  const idx = base.index, n = base.n;
  nor.fill(0);
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
    const e1x = pos[b] - pos[a], e1y = pos[b + 1] - pos[a + 1], e1z = pos[b + 2] - pos[a + 2];
    const e2x = pos[c] - pos[a], e2y = pos[c + 1] - pos[a + 1], e2z = pos[c + 2] - pos[a + 2];
    const nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
    nor[a] += nx; nor[a + 1] += ny; nor[a + 2] += nz;
    nor[b] += nx; nor[b + 1] += ny; nor[b + 2] += nz;
    nor[c] += nx; nor[c + 1] += ny; nor[c + 2] += nz;
  }
  const D = base.dirs;
  for (let i = 0; i < n; i++) {
    const x = nor[i * 3], y = nor[i * 3 + 1], z = nor[i * 3 + 2], l = Math.sqrt(x * x + y * y + z * z);
    if (l > 1e-12) { nor[i * 3] = x / l; nor[i * 3 + 1] = y / l; nor[i * 3 + 2] = z / l; }
    else { nor[i * 3] = D[i * 3]; nor[i * 3 + 1] = D[i * 3 + 1]; nor[i * 3 + 2] = D[i * 3 + 2]; }   // つぶれた所は方向そのまま
  }
}

// 体積（m³）：表面の三角形と原点で作る四面体の和
export function measureVolume(base, pos) {
  const idx = base.index;
  let v = 0;
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
    v += pos[a] * (pos[b + 1] * pos[c + 2] - pos[b + 2] * pos[c + 1])
      - pos[a + 1] * (pos[b] * pos[c + 2] - pos[b + 2] * pos[c])
      + pos[a + 2] * (pos[b] * pos[c + 1] - pos[b + 1] * pos[c]);
  }
  return Math.max(0, v / 6);
}

// 方向 (x,y,z) の表面までの距離（芯の点から）。でこぼこ込み
export function surfaceR(f, P, x, y, z) {
  const i = nearest(f.base, x, y, z);
  return f.r[i] * (1 + P.lumpAmp * f.lump[i] * Math.min(1, f.r[i] / P.lumpFullR));
}
