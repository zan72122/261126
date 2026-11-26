// 生成物：app/hero/hero.js から `npm run build:hero` で作る。直接編集しない。
var __WataameHero = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // app/hero/hero.js
  var hero_exports = {};
  __export(hero_exports, {
    P: () => P,
    createHero: () => createHero
  });

  // app/hero/field.js
  function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
      a = a + 1831565813 >>> 0;
      let t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hash3(ix, iy, iz, seed) {
    let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(iz, 2147483647) ^ Math.imul(seed, 1274126177);
    h = Math.imul(h ^ h >>> 13, 1274126177);
    return ((h ^ h >>> 16) >>> 0) / 4294967296;
  }
  function vnoise(x, y, z, seed) {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    let fx = x - ix, fy = y - iy, fz = z - iz;
    fx = fx * fx * (3 - 2 * fx);
    fy = fy * fy * (3 - 2 * fy);
    fz = fz * fz * (3 - 2 * fz);
    const a = hash3(ix, iy, iz, seed), b = hash3(ix + 1, iy, iz, seed), c = hash3(ix, iy + 1, iz, seed), d = hash3(ix + 1, iy + 1, iz, seed);
    const e = hash3(ix, iy, iz + 1, seed), f = hash3(ix + 1, iy, iz + 1, seed), g = hash3(ix, iy + 1, iz + 1, seed), h = hash3(ix + 1, iy + 1, iz + 1, seed);
    const x0 = a + (b - a) * fx, x1 = c + (d - c) * fx, x2 = e + (f - e) * fx, x3 = g + (h - g) * fx;
    const y0 = x0 + (x1 - x0) * fy, y1 = x2 + (x3 - x2) * fy;
    return y0 + (y1 - y0) * fz;
  }
  var LUT_G = 16;
  var baseCache = /* @__PURE__ */ new Map();
  function getBase(sub) {
    let b = baseCache.get(sub);
    if (!b) {
      b = buildBase(sub);
      baseCache.set(sub, b);
    }
    return b;
  }
  function buildBase(sub) {
    const t = (1 + Math.sqrt(5)) / 2;
    const V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
    const F = [
      [0, 11, 5],
      [0, 5, 1],
      [0, 1, 7],
      [0, 7, 10],
      [0, 10, 11],
      [1, 5, 9],
      [5, 11, 4],
      [11, 10, 2],
      [10, 7, 6],
      [7, 1, 8],
      [3, 9, 4],
      [3, 4, 2],
      [3, 2, 6],
      [3, 6, 8],
      [3, 8, 9],
      [4, 9, 5],
      [2, 4, 11],
      [6, 2, 10],
      [8, 6, 7],
      [9, 8, 1]
    ];
    const key = /* @__PURE__ */ new Map(), dirs = [], idx = [];
    const vid = (x, y, z) => {
      const l = Math.hypot(x, y, z) || 1;
      x /= l;
      y /= l;
      z /= l;
      const k = Math.round(x * 2e4) + "," + Math.round(y * 2e4) + "," + Math.round(z * 2e4);
      let i = key.get(k);
      if (i === void 0) {
        i = dirs.length / 3;
        key.set(k, i);
        dirs.push(x, y, z);
      }
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
    const sets = Array.from({ length: n }, () => /* @__PURE__ */ new Set());
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i], b = idx[i + 1], c = idx[i + 2];
      sets[a].add(b);
      sets[a].add(c);
      sets[b].add(a);
      sets[b].add(c);
      sets[c].add(a);
      sets[c].add(b);
    }
    const nbrOff = new Int32Array(n + 1), flat = [];
    for (let i = 0; i < n; i++) {
      nbrOff[i] = flat.length;
      for (const j of sets[i]) flat.push(j);
    }
    nbrOff[n] = flat.length;
    const base = {
      sub,
      n,
      tris: idx.length / 3,
      dirs: new Float32Array(dirs),
      index: n > 65535 ? new Uint32Array(idx) : new Uint16Array(idx),
      nbr: new Int32Array(flat),
      nbrOff,
      lut: null,
      maps: /* @__PURE__ */ new Map()
    };
    const G = LUT_G, lut = new Uint16Array(6 * G * G), D = base.dirs;
    for (let f = 0; f < 6; f++) for (let iv = 0; iv < G; iv++) for (let iu = 0; iu < G; iu++) {
      const u = (iu + 0.5) / G * 2 - 1, v = (iv + 0.5) / G * 2 - 1, s = f & 1 ? -1 : 1;
      let x, y, z;
      if (f < 2) {
        x = s;
        y = u;
        z = v;
      } else if (f < 4) {
        y = s;
        x = u;
        z = v;
      } else {
        z = s;
        x = u;
        y = v;
      }
      let best = 0, bd = -2;
      const l = Math.hypot(x, y, z);
      for (let i = 0; i < n; i++) {
        const d = (D[i * 3] * x + D[i * 3 + 1] * y + D[i * 3 + 2] * z) / l;
        if (d > bd) {
          bd = d;
          best = i;
        }
      }
      lut[(f * G + iv) * G + iu] = best;
    }
    base.lut = lut;
    return base;
  }
  function nearest(base, x, y, z) {
    const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z), G = LUT_G;
    let f, u, v, m;
    if (ax >= ay && ax >= az) {
      m = ax;
      f = x > 0 ? 0 : 1;
      u = y;
      v = z;
    } else if (ay >= az) {
      m = ay;
      f = y > 0 ? 2 : 3;
      u = x;
      v = z;
    } else {
      m = az;
      f = z > 0 ? 4 : 5;
      u = x;
      v = y;
    }
    if (!(m > 1e-12)) return 0;
    let iu = (u / m * 0.5 + 0.5) * G | 0, iv = (v / m * 0.5 + 0.5) * G | 0;
    if (iu > G - 1) iu = G - 1;
    if (iv > G - 1) iv = G - 1;
    return base.lut[(f * G + iv) * G + iu];
  }
  function mapBetween(from, to) {
    let m = from.maps.get(to.sub);
    if (m) return m;
    m = new Int32Array(to.n);
    const A = from.dirs, B = to.dirs;
    for (let i = 0; i < to.n; i++) {
      const x = B[i * 3], y = B[i * 3 + 1], z = B[i * 3 + 2];
      let best = 0, bd = -2;
      for (let j = 0; j < from.n; j++) {
        const d = A[j * 3] * x + A[j * 3 + 1] * y + A[j * 3 + 2] * z;
        if (d > bd) {
          bd = d;
          best = j;
        }
      }
      m[i] = best;
    }
    from.maps.set(to.sub, m);
    return m;
  }
  function createField(base, P2, seed, colorIndex) {
    const n = base.n, L = P2.maxLayers;
    const f = {
      base,
      seed,
      n,
      r: new Float32Array(n).fill(P2.r0),
      fresh: new Float32Array(n),
      // 絡んだばかり 0..1（表示用、すぐ消える）
      nL: new Uint8Array(n).fill(1),
      // 層の数
      lR: new Float32Array(n * L),
      // 各層の外側の半径
      lC: new Uint8Array(n * L),
      // 各層の色
      lump: null,
      tuft: null,
      rMaxDir: null,
      // 方向の関数（解像度を替えたら作り直す）
      tmp: new Float32Array(n),
      used: [],
      // 使った色（内→外、重複なし）
      lastColor: colorIndex,
      volume: 0,
      volume0: 0,
      radius: 0,
      meanR: P2.r0,
      anyFresh: false
    };
    for (let i = 0; i < n; i++) {
      f.lR[i * L] = P2.r0;
      f.lC[i * L] = colorIndex;
    }
    bakeStatic(f, P2);
    return f;
  }
  function bakeStatic(f, P2) {
    const { base, n, seed } = f, D = base.dirs;
    f.lump = new Float32Array(n);
    f.tuft = new Float32Array(n);
    f.rMaxDir = new Float32Array(n);
    const centerFromHandle = P2.stickLength - P2.candyFromTip;
    for (let i = 0; i < n; i++) {
      const x = D[i * 3], y = D[i * 3 + 1], z = D[i * 3 + 2];
      const a = vnoise(x * P2.lumpFreq + 7.1, y * P2.lumpFreq + 3.3, z * P2.lumpFreq + 5.7, seed);
      const b = vnoise(x * P2.lumpFreq * 2.3 + 1.7, y * P2.lumpFreq * 2.3 + 9.2, z * P2.lumpFreq * 2.3 + 4.4, seed + 11);
      f.lump[i] = (a * 2 - 1) * 0.7 + (b * 2 - 1) * 0.3;
      f.tuft[i] = 0.65 + 0.7 * vnoise(x * 5.3 + 2.2, y * 5.3 + 6.1, z * 5.3 + 8.8, seed + 23);
      let m = P2.rMax - P2.tipTrim * P2.capsuleHalf * Math.max(0, y);
      if (y < -0.05) m = Math.min(m, (centerFromHandle - P2.handleFree + P2.capsuleHalf * y) / -y);
      f.rMaxDir[i] = Math.max(P2.r0 * 2, m);
    }
  }
  function resampleField(src, base, P2) {
    if (src.base === base) return src;
    const map = mapBetween(src.base, base), L = P2.maxLayers, n = base.n;
    const f = {
      base,
      seed: src.seed,
      n,
      r: new Float32Array(n),
      fresh: new Float32Array(n),
      nL: new Uint8Array(n),
      lR: new Float32Array(n * L),
      lC: new Uint8Array(n * L),
      lump: null,
      tuft: null,
      rMaxDir: null,
      tmp: new Float32Array(n),
      used: src.used.slice(),
      lastColor: src.lastColor,
      volume: src.volume,
      volume0: 0,
      radius: src.radius,
      meanR: src.meanR,
      anyFresh: src.anyFresh
    };
    for (let i = 0; i < n; i++) {
      const j = map[i];
      f.r[i] = src.r[j];
      f.fresh[i] = src.fresh[j];
      f.nL[i] = src.nL[j];
      for (let k = 0; k < L; k++) {
        f.lR[i * L + k] = src.lR[j * L + k];
        f.lC[i * L + k] = src.lC[j * L + k];
      }
    }
    bakeStatic(f, P2);
    return f;
  }
  function kern(c, cosA) {
    const x = (c - cosA) / (1 - cosA);
    return x > 0 ? x * x : 0;
  }
  function deposit(f, P2, dt, src, srcW, mot, motW, uni, colorIndex, organic) {
    const { base, n, r, tmp, fresh } = f, D = base.dirs, L = P2.maxLayers;
    const cosS = Math.cos(P2.alphaSrc * Math.PI / 180), cosM = Math.cos(P2.alphaMot * Math.PI / 180);
    const k = P2.rate * dt;
    let total = 0;
    for (let i = 0; i < n; i++) {
      const x = D[i * 3], y = D[i * 3 + 1], z = D[i * 3 + 2];
      let w = uni;
      if (srcW > 0) w += srcW * kern(x * src.x + y * src.y + z * src.z, cosS);
      if (motW > 0) w += motW * kern(x * mot.x + y * mot.y + z * mot.z, cosM);
      if (w <= 0) {
        tmp[i] = 0;
        continue;
      }
      const ri = r[i];
      const room = Math.max(1 - ri / f.rMaxDir[i], 0);
      const g = Math.pow(room, P2.roomPow) * (1 + P2.earlyBoost * Math.exp(-ri / P2.earlyR));
      const dr = k * w * g * (1 + organic * f.lump[i]);
      tmp[i] = dr > 0 ? dr : 0;
    }
    for (let i = 0; i < n; i++) {
      const dr = tmp[i];
      if (dr <= 0) continue;
      addLayer(f, i, dr, colorIndex, L, P2);
      total += dr;
      const fr = fresh[i] + dr * P2.freshGain;
      fresh[i] = fr > 1 ? 1 : fr;
    }
    const nb = base.nbr, off = base.nbrOff, lam = Math.min(0.5, P2.fill * dt);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      const a = off[i], b = off[i + 1];
      for (let j = a; j < b; j++) sum += r[nb[j]];
      const d = sum / (b - a) - r[i];
      tmp[i] = d > 0 ? d * lam : 0;
    }
    for (let i = 0; i < n; i++) {
      const dr = tmp[i];
      if (dr > 1e-7) {
        addLayer(f, i, dr, colorIndex, L, P2);
        total += dr;
      }
    }
    if (total > 0) {
      f.anyFresh = true;
      f.lastColor = colorIndex;
      if (f.used.indexOf(colorIndex) < 0) f.used.push(colorIndex);
    }
    return total / n;
  }
  function addLayer(f, i, dr, c, L, P2) {
    const o = i * L, r = f.r, lR = f.lR, lC = f.lC;
    let top = f.nL[i] - 1;
    const nr = Math.min(r[i] + dr, f.rMaxDir[i]);
    if (lC[o + top] !== c) {
      const thick = r[i] - (top > 0 ? lR[o + top - 1] : 0);
      if (r[i] <= P2.r0 * 1.05 || thick < P2.layerMin) {
        lC[o + top] = c;
        if (top > 0 && lC[o + top - 1] === c) {
          top--;
          f.nL[i] = top + 1;
        }
      } else if (dr < P2.layerMinDr) {
      } else {
        if (top === L - 1) {
          for (let k = 0; k < L - 1; k++) {
            lR[o + k] = lR[o + k + 1];
            lC[o + k] = lC[o + k + 1];
          }
          top--;
        }
        top++;
        f.nL[i] = top + 1;
        lC[o + top] = c;
      }
    }
    r[i] = nr;
    lR[o + top] = nr;
  }
  function decayFresh(f, P2, dt) {
    if (!f.anyFresh) return false;
    const k = Math.exp(-dt / P2.freshTau), fr = f.fresh;
    let any = false;
    for (let i = 0; i < f.n; i++) {
      let v = fr[i];
      if (v > 0) {
        v *= k;
        if (v < 4e-3) v = 0;
        else any = true;
        fr[i] = v;
      }
    }
    f.anyFresh = any;
    return true;
  }
  function writeSurface(f, P2, out, bite, pal) {
    const { base, n, r } = f, D = base.dirs, L = P2.maxLayers, h = P2.capsuleHalf;
    const pos = out.pos, c0 = out.c0, c1 = out.c1, fx = out.fx, lR = f.lR, lC = f.lC;
    const rrA = f.rr || (f.rr = new Float32Array(n)), cutA = f.cut || (f.cut = new Float32Array(n));
    const b0 = f.b0 || (f.b0 = new Float32Array(n)), b1 = f.b1 || (f.b1 = new Float32Array(n));
    for (let i = 0; i < n; i++) {
      const dx = D[i * 3], dy = D[i * 3 + 1], dz = D[i * 3 + 2], ay = h * dy;
      let rr = r[i] * (1 + P2.lumpAmp * f.lump[i] * Math.min(1, r[i] / P2.lumpFullR)), cut = 0;
      if (bite) {
        for (let b = 0; b < bite.n; b++) {
          const ox = -bite.x[b], oy = ay - bite.y[b], oz = -bite.z[b];
          const bb = ox * dx + oy * dy + oz * dz, cc = ox * ox + oy * oy + oz * oz - bite.rad[b] * bite.rad[b];
          const disc = bb * bb - cc;
          if (disc <= 0) continue;
          const sq = Math.sqrt(disc), t1 = -bb + sq;
          if (t1 <= 0) continue;
          const t0 = Math.max(-bb - sq, P2.r0);
          if (t0 < rr) {
            cut = Math.max(cut, Math.min(1, (rr - t0) / 6e-3));
            rr = t0;
          }
        }
      }
      rrA[i] = rr;
      cutA[i] = cut;
      b0[i] = rr;
    }
    const nb = base.nbr, off = base.nbrOff;
    let src = b0, dst = b1;
    for (let it = 0; it < P2.cavityIters; it++) {
      for (let i = 0; i < n; i++) {
        let sum = src[i];
        const a = off[i], b = off[i + 1];
        for (let j = a; j < b; j++) sum += src[nb[j]];
        dst[i] = sum / (b - a + 1);
      }
      const t = src;
      src = dst;
      dst = t;
    }
    let rmax2 = 0, rsum = 0, rtop = 0;
    for (let i = 0; i < n; i++) {
      const dx = D[i * 3], dy = D[i * 3 + 1], dz = D[i * 3 + 2], ay = h * dy, rr = rrA[i], cut = cutA[i];
      const px = dx * rr, py = ay + dy * rr, pz = dz * rr;
      pos[i * 3] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;
      if (r[i] > P2.r0 * 2) {
        const d2 = px * px + py * py + pz * pz;
        if (d2 > rmax2) rmax2 = d2;
      }
      rsum += rr;
      if (rr > rtop) rtop = rr;
      const o = i * L, rs = cut > 0 ? rr / (1 + P2.lumpAmp * f.lump[i] * Math.min(1, r[i] / P2.lumpFullR)) : r[i];
      let k = f.nL[i] - 1;
      while (k > 0 && lR[o + k - 1] >= rs) k--;
      const below = k > 0 ? lR[o + k - 1] : 0;
      const ca = lC[o + k] * 3, cb = (k > 0 ? lC[o + k - 1] : lC[o + k]) * 3;
      c0[i * 4] = pal[ca];
      c0[i * 4 + 1] = pal[ca + 1];
      c0[i * 4 + 2] = pal[ca + 2];
      c0[i * 4 + 3] = k > 0 ? Math.max(0, rs - below) : 1;
      c1[i * 4] = pal[cb];
      c1[i * 4 + 1] = pal[cb + 1];
      c1[i * 4 + 2] = pal[cb + 2];
      const grown = Math.min(1, Math.max(0, (rr - P2.r0 * 1.2) / P2.fluffRampR));
      let fl = Math.min(P2.fluffMax, P2.fluffMin + P2.fluffK * rr) * f.tuft[i] * grown;
      if (cut > 0) fl *= 1 - 0.75 * cut;
      c1[i * 4 + 3] = fl;
      const cav = (src[i] - rr) / (P2.cavityRef + P2.cavityK * rr);
      fx[i * 3] = f.fresh[i];
      fx[i * 3 + 1] = cut;
      fx[i * 3 + 2] = cav < -1 ? -1 : cav > 1 ? 1 : cav;
    }
    computeNormals(base, pos, out.nor);
    f.radius = Math.sqrt(rmax2);
    f.meanR = rsum / n;
    return out;
  }
  function computeNormals(base, pos, nor) {
    const idx = base.index, n = base.n;
    nor.fill(0);
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
      const e1x = pos[b] - pos[a], e1y = pos[b + 1] - pos[a + 1], e1z = pos[b + 2] - pos[a + 2];
      const e2x = pos[c] - pos[a], e2y = pos[c + 1] - pos[a + 1], e2z = pos[c + 2] - pos[a + 2];
      const nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
      nor[a] += nx;
      nor[a + 1] += ny;
      nor[a + 2] += nz;
      nor[b] += nx;
      nor[b + 1] += ny;
      nor[b + 2] += nz;
      nor[c] += nx;
      nor[c + 1] += ny;
      nor[c + 2] += nz;
    }
    const D = base.dirs;
    for (let i = 0; i < n; i++) {
      const x = nor[i * 3], y = nor[i * 3 + 1], z = nor[i * 3 + 2], l = Math.sqrt(x * x + y * y + z * z);
      if (l > 1e-12) {
        nor[i * 3] = x / l;
        nor[i * 3 + 1] = y / l;
        nor[i * 3 + 2] = z / l;
      } else {
        nor[i * 3] = D[i * 3];
        nor[i * 3 + 1] = D[i * 3 + 1];
        nor[i * 3 + 2] = D[i * 3 + 2];
      }
    }
  }
  function measureVolume(base, pos) {
    const idx = base.index;
    let v = 0;
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
      v += pos[a] * (pos[b + 1] * pos[c + 2] - pos[b + 2] * pos[c + 1]) - pos[a + 1] * (pos[b] * pos[c + 2] - pos[b + 2] * pos[c]) + pos[a + 2] * (pos[b] * pos[c + 1] - pos[b + 1] * pos[c]);
    }
    return Math.max(0, v / 6);
  }
  function surfaceR(f, P2, x, y, z) {
    const i = nearest(f.base, x, y, z);
    return f.r[i] * (1 + P2.lumpAmp * f.lump[i] * Math.min(1, f.r[i] / P2.lumpFullR));
  }

  // app/hero/textures.js
  function makeFuzzTexture(THREE, size) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d"), rnd = mulberry32(4242);
    g.fillStyle = "#000";
    g.fillRect(0, 0, size, size);
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 90; i++) {
      const x = rnd() * size, y = rnd() * size, rad = size * (0.035 + 0.085 * rnd()), a = 0.25 + 0.5 * rnd();
      for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
        const cx = x + ox * size, cy = y + oy * size;
        if (cx < -rad || cx > size + rad || cy < -rad || cy > size + rad) continue;
        const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
        gr.addColorStop(0, `rgba(0,255,0,${a})`);
        gr.addColorStop(0.55, `rgba(0,255,0,${a * 0.45})`);
        gr.addColorStop(1, "rgba(0,255,0,0)");
        g.fillStyle = gr;
        g.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
      }
    }
    g.lineCap = "round";
    function strands(count, channel, spread, w0, w1, len0, len1) {
      for (let i = 0; i < count; i++) {
        const x = rnd() * size, y = rnd() * size, len = size * (len0 + (len1 - len0) * rnd());
        const ang = (rnd() - 0.5) * spread, bend = (rnd() - 0.5) * len * 0.5;
        const ex = Math.cos(ang) * len, ey = Math.sin(ang) * len;
        const mx = ex * 0.5 - Math.sin(ang) * bend, my = ey * 0.5 + Math.cos(ang) * bend;
        g.strokeStyle = channel === 0 ? `rgba(255,0,0,${0.22 + 0.6 * rnd()})` : `rgba(0,0,255,${0.25 + 0.6 * rnd()})`;
        g.lineWidth = w0 + (w1 - w0) * rnd();
        for (let ox = -1; ox <= 0; ox++) for (let oy = -1; oy <= 1; oy++) {
          const sx = x + ox * size, sy = y + oy * size;
          g.beginPath();
          g.moveTo(sx, sy);
          g.quadraticCurveTo(sx + mx, sy + my, sx + ex, sy + ey);
          g.stroke();
        }
      }
    }
    strands(Math.round(size * 2.6), 0, 1.3, 0.8, 2, 0.07, 0.26);
    strands(Math.round(size * 1.3), 2, 3.1, 0.7, 1.6, 0.05, 0.16);
    const t = new THREE.CanvasTexture(c);
    t.name = "hero-fuzz";
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.NoColorSpace;
    t.anisotropy = 2;
    return t;
  }
  function makeGlowTexture(THREE) {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,0.95)");
    gr.addColorStop(0.4, "rgba(255,255,255,0.5)");
    gr.addColorStop(0.7, "rgba(255,255,255,0.15)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.name = "hero-glow";
    return t;
  }

  // app/hero/materials.js
  var CANDY_VERT = (
    /* glsl */
    `
attribute vec4 aC0;   // rgb：外の層の色（線形）、a：その層の厚み（m）
attribute vec4 aC1;   // rgb：その下の層の色、a：毛羽の長さ（m）
attribute vec3 aFx;   // x：絡んだばかり 0..1、y：かじられた面 0..1、z：くぼみ（谷 +1 〜 山 −1）
#ifndef CORE
attribute float aShell;
#endif
uniform float uTime;
uniform float uInset;      // 芯を表面からどれだけ沈めるか（毛羽の長さに対する比）
uniform float uPuff;       // 絡んだばかりの所の毛羽を伸ばす量
uniform float uSway;       // 毛先のゆらぎ
uniform float uLayerFull;  // 新しい色の層がこの厚みで下の色を覆いきる（m）
varying vec3 vNw;
varying vec3 vPw;
varying vec3 vNl;
varying vec3 vPl;
varying vec3 vC0;
varying vec3 vC1;
varying float vCover;
varying vec4 vK;           // (シェルの高さ h（芯は −1）, 絡んだばかり, かじられた面, 毛羽の長さ)
varying float vCav;

void main() {
#ifdef CORE
  float h = -1.0;
#else
  float h = aShell;
#endif
  float fl = aC1.a;
  float isCore = step(h, -0.5);
  float hs = max(h, 0.0);
  // 表面からの高さ s（m）：芯は内側、シェルは内側から毛先まで
  float s = fl * mix(mix(-uInset * 0.7, 1.0, hs), -uInset, isCore);
  s += fl * aFx.x * uPuff * hs;
  vec3 p = position + normal * s;
  float ph = dot(position, vec3(37.0, 23.0, 31.0));
  p += vec3(sin(uTime * 1.7 + ph), cos(uTime * 1.3 + ph * 1.3), sin(uTime * 1.1 + ph * 0.7)) * (fl * uSway * hs * hs);
  // 色の層：表面から深さ tO までが外の層の色。層が薄いほど、下の色が房ごとに透けて残る（fragment で）
  float tO = aC0.a;
  float wd = 0.0015 + 0.25 * tO;
  vCover = (1.0 - smoothstep(tO - wd, tO + wd, -s)) * clamp(tO / uLayerFull, 0.0, 1.0);
  vC0 = aC0.rgb;
  vC1 = aC1.rgb;
  vK = vec4(h, aFx.x, aFx.y, fl);
  vCav = aFx.z;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vPw = wp.xyz;
  vNw = mat3(modelMatrix) * normal;
  vNl = normal;
  vPl = position;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`
  );
  var CANDY_FRAG = (
    /* glsl */
    `
uniform sampler2D uFiber;   // 綿の繊維の写真（白黒）
uniform sampler2D uFuzz;    // 毛羽の密度（手続き）：R 巻く向きの糸、G 房、B ばらけた糸
uniform vec3 uKeyDir;
uniform vec3 uKeyCol;
uniform vec3 uFillDir;
uniform vec3 uFillCol;
uniform vec3 uSkyCol;
uniform vec3 uGroundCol;
uniform vec3 uShadeTint;
uniform float uWrap;
uniform float uRim;
uniform float uAoCore;
uniform float uCavity;
uniform float uGlow;
uniform float uFiberScale;
uniform float uFuzzScale;
uniform float uTime;
varying vec3 vNw;
varying vec3 vPw;
varying vec3 vNl;
varying vec3 vPl;
varying vec3 vC0;
varying vec3 vC1;
varying float vCover;
varying vec4 vK;
varying float vCav;

vec4 tri(sampler2D t, vec3 q, vec3 w) {
  // 横の投影は u を「棒のまわり」に、v を棒に沿わせる（糸が棒に巻いて見える）
  return texture2D(t, q.zy) * w.x + texture2D(t, q.xz) * w.y + texture2D(t, q.xy) * w.z;
}

void main() {
  float h = vK.x;
  float fresh = vK.y;
  float cut = vK.z;
  float hs = max(h, 0.0);
  vec3 nl = normalize(vNl + vec3(0.0, 1e-5, 0.0));
  vec3 w = abs(nl); w *= w; w *= w;
  w /= max(w.x + w.y + w.z, 1e-5);
  // 糸は根元から毛先へ少し流れ、ゆっくり揺れる
  vec3 q = vPl * uFuzzScale + vec3(0.11, 0.07, -0.09) * hs + vec3(0.013, 0.0, 0.009) * sin(uTime * 0.9 + hs * 3.0);
  vec3 fz = tri(uFuzz, q, w).rgb;
  float alpha = 1.0;
#ifndef CORE
  if (h >= 0.0) {
    float dens = fz.r * 0.62 + fz.g * 0.5 + fz.b * 0.3;
    float thr = mix(0.08, 0.80, hs) - fresh * 0.16;
    alpha = smoothstep(thr - 0.10, thr + 0.22, dens) * mix(0.94, 0.42, hs * hs);
    alpha *= smoothstep(0.0, 0.0012, vK.w);
  }
#endif
  // 色の層：新しい色は、厚みに応じて房ごとに現れる（薄い所は下の色が残る）
  float tuftN = fz.g * 0.9 + fz.b * 0.2;
  float m = smoothstep(tuftN * 0.8 - 0.24, tuftN * 0.8 + 0.24, vCover * 1.3) * clamp(vCover * 8.0, 0.0, 1.0);
  vec3 base = mix(vC1, vC0, m);

  vec3 N = normalize(vNw + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(cameraPosition - vPw + vec3(0.0, 1e-5, 0.0));
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float kd = clamp((dot(N, uKeyDir) + uWrap) / (1.0 + uWrap), 0.0, 1.0);
  kd = kd * kd * (3.0 - 2.0 * kd);
  float fd = clamp(dot(N, uFillDir) * 0.5 + 0.5, 0.0, 1.0);
  float sky = N.y * 0.5 + 0.5;

  // 光が中で散る：明るい側は白っぽく、影の側は色が濃く深くなる
  vec3 deep = mix(base * base, base, 0.35) * uShadeTint;
  vec3 lit = mix(base, vec3(1.0), 0.16);
  // 奥（芯・内側のシェル）は外の毛羽に隠れて暗い。房と房の谷は暗く濃く、山は明るく（形が読める）
  float ao = h < 0.0 ? uAoCore : mix(uAoCore + 0.06, 1.0, hs);
  ao *= 1.0 - uCavity * clamp(vCav, -0.35, 1.0);
  ao = clamp(ao, 0.0, 1.2);
  vec3 alb = mix(deep, lit, clamp((kd * 0.85 + sky * 0.2) * ao, 0.0, 1.0));
  vec3 light = mix(uGroundCol, uSkyCol, sky) + uKeyCol * kd + uFillCol * fd;
  vec3 col = alb * light * mix(0.62, 1.0, ao);
  // 繊維のすじ
#ifdef CORE
  float fib = tri(uFiber, vPl * uFiberScale, w).r;
  col *= mix(0.78, 1.08, smoothstep(0.45, 0.95, fib));
#else
  col *= 0.94 + 0.12 * fz.r;
#endif
  // 縁は薄くて光が抜ける
  float rim = pow(max(1.0 - ndv, 1e-4), 2.2);
  col += mix(base, vec3(1.0), 0.6) * rim * uRim * (0.45 + 0.55 * kd);
  // かじられた面：つぶれて色が濃い
  col = mix(col, deep * light * 1.04, cut * 0.55);
  // 絡んだばかり：白く光る
  col = mix(col, vec3(1.06), fresh * 0.32);
  col += uGlow * vec3(0.30, 0.24, 0.10);
#ifdef COPY
  if (alpha < 0.03) discard;     // コピーは深度を書くので、見えない所は捨てる
#endif
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
  );
  var RIBBON_VERT = (
    /* glsl */
    `
attribute vec3 aTan;    // 糸の向き
attribute vec2 aSide;   // (±1, 幅の半分 m)
attribute vec4 aCol;    // 線形 rgb と不透明度
varying vec4 vCol;
varying float vS;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 t = mat3(modelViewMatrix) * aTan;
  vec2 n = vec2(-t.y, t.x);
  n /= max(length(n), 1e-5);
  mv.xy += n * (aSide.x * aSide.y);
  vCol = aCol;
  vS = aSide.x;
  gl_Position = projectionMatrix * mv;
}`
  );
  var RIBBON_FRAG = (
    /* glsl */
    `
varying vec4 vCol;
varying float vS;
void main() {
  float e = max(1.0 - vS * vS, 0.0);
  gl_FragColor = vec4(vCol.rgb, vCol.a * e);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
  );
  function makeSharedUniforms(THREE, P2, fiberTex, fuzzTex) {
    const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);
    return {
      uTime: { value: 0 },
      uFiber: { value: fiberTex },
      uFuzz: { value: fuzzTex },
      uKeyDir: { value: v3(P2.keyDir).normalize() },
      uKeyCol: { value: v3(P2.keyCol) },
      uFillDir: { value: v3(P2.fillDir).normalize() },
      uFillCol: { value: v3(P2.fillCol) },
      uSkyCol: { value: v3(P2.skyCol) },
      uGroundCol: { value: v3(P2.groundCol) },
      uShadeTint: { value: v3(P2.shadeTint) },
      uWrap: { value: P2.lightWrap },
      uRim: { value: P2.rim },
      uAoCore: { value: P2.aoCore },
      uCavity: { value: P2.cavity },
      uFiberScale: { value: P2.fiberScale },
      uFuzzScale: { value: P2.fuzzScale },
      uInset: { value: P2.coreInset },
      uPuff: { value: P2.freshPuff },
      uSway: { value: P2.furSway },
      uLayerFull: { value: P2.layerFull }
    };
  }
  function makeCandyMaterial(THREE, shared, kind) {
    const m = new THREE.ShaderMaterial({
      name: "candy-" + kind.toLowerCase(),
      defines: { [kind]: 1 },
      uniforms: { ...shared, uGlow: { value: 0 } },
      vertexShader: CANDY_VERT,
      fragmentShader: CANDY_FRAG
    });
    if (kind === "SHELL") {
      m.transparent = true;
      m.depthWrite = false;
    }
    if (kind === "COPY") {
      m.transparent = true;
      m.depthWrite = true;
    }
    return m;
  }
  function makeRibbonMaterial(THREE) {
    return new THREE.ShaderMaterial({
      name: "candy-thread",
      vertexShader: RIBBON_VERT,
      fragmentShader: RIBBON_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
  }

  // app/hero/ribbons.js
  function createRibbons(THREE, material, strands, pts) {
    const nv = strands * pts * 2;
    const pos = new Float32Array(nv * 3), tan = new Float32Array(nv * 3), side = new Float32Array(nv * 2), col = new Float32Array(nv * 4);
    const idx = nv > 65535 ? new Uint32Array(strands * (pts - 1) * 6) : new Uint16Array(strands * (pts - 1) * 6);
    let k = 0;
    for (let s = 0; s < strands; s++) for (let j = 0; j < pts - 1; j++) {
      const a = (s * pts + j) * 2;
      idx[k++] = a;
      idx[k++] = a + 1;
      idx[k++] = a + 2;
      idx[k++] = a + 1;
      idx[k++] = a + 3;
      idx[k++] = a + 2;
    }
    for (let i = 0; i < nv; i++) side[i * 2] = i & 1 ? 1 : -1;
    const geo = new THREE.BufferGeometry();
    const aPos = new THREE.BufferAttribute(pos, 3), aTan = new THREE.BufferAttribute(tan, 3), aSide = new THREE.BufferAttribute(side, 2), aCol = new THREE.BufferAttribute(col, 4);
    for (const a of [aPos, aTan, aSide, aCol]) a.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", aPos);
    geo.setAttribute("aTan", aTan);
    geo.setAttribute("aSide", aSide);
    geo.setAttribute("aCol", aCol);
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1);
    const mesh = new THREE.Mesh(geo, material);
    mesh.frustumCulled = false;
    return {
      mesh,
      geo,
      strands,
      pts,
      // 糸 s の j 番目の点
      put(s, j, x, y, z, r, g, b, a, halfWidth) {
        const v = (s * pts + j) * 2;
        let o = v * 3;
        pos[o] = x;
        pos[o + 1] = y;
        pos[o + 2] = z;
        pos[o + 3] = x;
        pos[o + 4] = y;
        pos[o + 5] = z;
        o = v * 4;
        col[o] = r;
        col[o + 1] = g;
        col[o + 2] = b;
        col[o + 3] = a;
        col[o + 4] = r;
        col[o + 5] = g;
        col[o + 6] = b;
        col[o + 7] = a;
        side[v * 2 + 1] = halfWidth;
        side[v * 2 + 3] = halfWidth;
      },
      // 糸 s を見えなくする
      hide(s) {
        const v0 = s * pts * 2;
        for (let i = 0; i < pts * 2; i++) col[(v0 + i) * 4 + 3] = 0;
      },
      // 糸 s の向き（前後の点の差）を入れる
      finish(s) {
        const v0 = s * pts * 2;
        for (let j = 0; j < pts; j++) {
          const a = (v0 + (j > 0 ? j - 1 : 0) * 2) * 3, b = (v0 + (j < pts - 1 ? j + 1 : pts - 1) * 2) * 3, o = (v0 + j * 2) * 3;
          const tx = pos[b] - pos[a], ty = pos[b + 1] - pos[a + 1], tz = pos[b + 2] - pos[a + 2];
          tan[o] = tx;
          tan[o + 1] = ty;
          tan[o + 2] = tz;
          tan[o + 3] = tx;
          tan[o + 4] = ty;
          tan[o + 5] = tz;
        }
      },
      setCount(n) {
        geo.setDrawRange(0, Math.max(0, Math.min(strands, n)) * (pts - 1) * 6);
      },
      commit() {
        aPos.needsUpdate = true;
        aTan.needsUpdate = true;
        aSide.needsUpdate = true;
        aCol.needsUpdate = true;
      },
      dispose() {
        geo.dispose();
        mesh.removeFromParent();
      }
    };
  }

  // app/hero/hero.js
  var P = {
    // ---- 割り箸（2 本がくっついた先細りの角棒）
    stickLength: 0.3,
    stickW0: 0.0115,
    stickW1: 68e-4,
    stickGap: 7e-4,
    stickSeg: 3,
    candyFromTip: 0.1,
    // わたあめの中心：先から棒に沿ってこの距離
    capsuleHalf: 0.055,
    // 中心から棒に沿って ± この長さの線分から半径を測る（先から 0.045〜0.155 に綿が付く）
    handleFree: 0.05,
    // 持ち手の端から、綿が付かないで残る長さ
    // ---- 形の場
    sub: { low: 10, mid: 16, high: 16 },
    // 正二十面体の辺の分割数（方向数 10·sub²+2、三角形 20·sub²）
    subHandle: 8,
    subCopy: 6,
    // 渡したあと／棚のコピーの分割数
    maxLayers: 8,
    r0: 25e-4,
    rMax: 0.2,
    tipTrim: 0.6,
    // 芯からの最大半径（中心からいちばん遠い所は 毛羽込みでおよそ 0.26）
    layerMin: 4e-4,
    layerMinDr: 2e-5,
    // これより薄い層・少ない量では新しい層を作らない
    // ---- 成長：Δr = rate·dt·w·g(r)、g(r) = (1 − r/rMax)^roomPow·(1 + earlyBoost·exp(−r/earlyR))
    rate: 0.095,
    roomPow: 0.9,
    // m/s
    alphaSrc: 62,
    alphaMot: 40,
    // 核の広がり（度）：糸が来る側／動かした側
    srcW: 0.6,
    motW: 1.25,
    // 重み：糸が来る側／動かした側（速さ speedRef で 1 倍）
    srcStill: 0.5,
    // 止めている時は、糸が来る側の重みをこの割合に（ゆっくり丸く）
    uniStill: 0.05,
    uniMove: 0.03,
    // まんべんなく付く分：止めている時／動かしている時
    speedRef: 0.3,
    speedGainMax: 1.6,
    nearGain: 0.3,
    // 回転頭に近いほど速い（中心で +15%、端で −15%）
    earlyBoost: 1.5,
    earlyR: 6e-3,
    // 最初のひと巻きだけ速い（触ってすぐ見える）
    fill: 2.2,
    // 谷を埋める速さ（1/s）
    organic: 0.35,
    // 房ごとの付き方のむら
    tapSeconds: 0.15,
    tapGain: 0.8,
    // タップ：この秒数だけ、この倍率で絡む
    srcY: 0.02,
    // 糸が出る高さ（回転頭の縁）
    stageR: [0.035, 0.085, 0.15],
    // ---- 見た目：でこぼこ・毛羽
    lumpAmp: 0.13,
    lumpFreq: 2.1,
    lumpFullR: 0.03,
    fluffMin: 5e-3,
    fluffK: 0.13,
    fluffMax: 0.03,
    fluffRampR: 8e-3,
    // 毛羽の長さ = min(max, min + K·r)
    coreInset: 0.55,
    // 芯は表面から 毛羽の長さ×これ だけ内側
    freshGain: 260,
    freshTau: 0.35,
    freshPuff: 0.6,
    // 絡んだばかりの所：白く光り、毛羽が伸びる
    furSway: 0.1,
    layerFull: 0.03,
    // 新しい色の層がこの厚みで下の色を覆いきる（薄い所は下の色が房ごとに残る）
    fiberScale: 5.5,
    fuzzScale: 7.5,
    // テクスチャの繰り返し（1/m）
    handleShells: 4,
    copyShells: 2,
    // 渡したあと／棚のコピーのシェル枚数
    // 光（app/shell/world.js の 2 灯＋半球光に合わせた向きと色。world 座標）
    keyDir: [1.2, 3, 2],
    keyCol: [0.62, 0.56, 0.47],
    fillDir: [-2, 1.5, -1.5],
    fillCol: [0.07, 0.09, 0.13],
    skyCol: [0.58, 0.56, 0.57],
    groundCol: [0.4, 0.34, 0.44],
    shadeTint: [0.84, 0.78, 0.92],
    lightWrap: 0.45,
    rim: 0.3,
    aoCore: 0.74,
    cavity: 0.9,
    cavityIters: 10,
    cavityRef: 5e-3,
    cavityK: 0.08,
    // 房の谷を暗く描く（半径をならしたものとの差）
    // ---- 表面に巻きつく糸（本数はティア別）
    cling: { low: 32, mid: 56, high: 72 },
    clingHandle: 30,
    clingPts: 14,
    clingWidth: 11e-4,
    clingAlpha: 0.5,
    // ---- 釜を舞う糸（本数は quality.threads）
    threadPts: 12,
    threadTau: 0.04,
    // 1 本の点数、点どうしの時間差
    threadLife: [1.3, 2],
    threadLifeCap: [0.95, 1.35],
    threadWidth: 13e-4,
    threadAlpha: 0.85,
    nozzles: 4,
    captureRatio: 0.75,
    // 持っている間、わたあめに吸い寄せられる糸の割合
    capture: [0.1, 0.5],
    // 吸い寄せが始まる／巻き終わる糸の年齢
    wrapOmega: 5,
    // 巻きつく速さ
    // ---- 割り箸の動き
    restCenter: [0, 0.078, 0.03],
    // 何もしていない時のわたあめの中心（root 座標）
    handOffset: [0.15, 0.085, 0.235],
    // 中心 → 持つ手 の向き（右手前の少し上。画面では右下へ伸びる）
    handFollow: 0.6,
    // 手は先の動きのこの割合だけ動く（→ 動かした方へ傾く）
    followW: 20,
    followZeta: 0.8,
    // 中心が指を追うばね
    handW: 10,
    handZeta: 0.9,
    // 手が追うばね（遅れ＝傾き）
    twirlStill: 2.2,
    twirlMove: 0.8,
    // くるくる回る速さ（rad/s）：止めている時は速く（まんべんなく巻いて丸く）、動かすと遅く（動かした側だけ育っていびつに）
    swayW: 9,
    swayZeta: 0.32,
    swayGain: 2.4,
    swayMax: 0.22,
    // わたあめが遅れて揺れる
    pulseW: 15,
    pulseZeta: 0.3,
    // 「ぽん」とふくらんで戻る
    bobAmp: 0.013,
    bobPeriod: 0.7,
    bobWag: 0.03,
    // 光っている時の「ぴょこっ」（上下の振幅・周期・持ち手の横振り）
    popTime: 0.45,
    bottomClear: 5e-3,
    // わたあめの下がこの高さより下がらないように持ち上げる
    reachK: 0.8,
    // 持ち上げの計算に使う半径 = radius × これ
    // ---- かじる
    biteUp: 1,
    // かじる向きを +Y（割り箸の先＝上）へ寄せる量（カメラから見える所が欠ける）
    biteDepth: 1.25,
    biteRadius: [0.3, 0.75]
    // amount 1 での深さ／球の半径（amount 0 と 1）。どれも平均半径に対する比
  };
  var TAU = Math.PI * 2;
  var clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  var sat = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
  var smooth = (x) => {
    x = sat(x);
    return x * x * (3 - 2 * x);
  };
  var easeOutBack = (x) => {
    const c1 = 1.70158, c3 = c1 + 1, y = x - 1;
    return 1 + c3 * y * y * y + c1 * y * y;
  };
  function spring(s, target, w, zeta, dt) {
    const d0 = s.x - target, wd = w * Math.sqrt(Math.max(1e-4, 1 - zeta * zeta));
    const b = (s.v + zeta * w * d0) / wd, ex = Math.exp(-zeta * w * dt), c = Math.cos(wd * dt), sn = Math.sin(wd * dt);
    s.x = target + ex * (d0 * c + b * sn);
    s.v = ex * ((b * wd - zeta * w * d0) * c - (d0 * wd + zeta * w * b) * sn);
  }
  function createHero(THREE, opts) {
    const pan = opts.pan, palette = opts.palette, texs = opts.textures || {};
    const emit = (t, d) => {
      try {
        opts.onEvent && opts.onEvent(t, d);
      } catch (e) {
      }
    };
    const V3 = THREE.Vector3;
    let quality = { level: "mid", furShells: 6, threads: 48, triBudget: 5e4, ...opts.quality || {} };
    const root = new THREE.Group();
    root.name = "hero";
    const own = [];
    const keep = (o) => (own.push(o), o);
    const palLin = new Float32Array(palette.length * 3), tc = new THREE.Color();
    palette.forEach((p, i) => {
      tc.setHex(p.color);
      palLin[i * 3] = tc.r;
      palLin[i * 3 + 1] = tc.g;
      palLin[i * 3 + 2] = tc.b;
    });
    const fuzzTex = keep(makeFuzzTexture(THREE, 512));
    const glowTex = keep(makeGlowTexture(THREE));
    const shared = makeSharedUniforms(THREE, P, texs.cottonFiber || fuzzTex, fuzzTex);
    const ribbonMat = keep(makeRibbonMaterial(THREE));
    const copyMat = keep(makeCandyMaterial(THREE, shared, "COPY"));
    const stickGeo = keep(makeStickGeometry(THREE));
    const stickMatLive = keep(new THREE.MeshStandardMaterial({ map: texs.wood || null, color: 16179906, roughness: 0.7, emissive: 16767370, emissiveIntensity: 0 }));
    const stickMatPlain = keep(new THREE.MeshStandardMaterial({ map: texs.wood || null, color: 16179906, roughness: 0.7 }));
    const bound = new THREE.Sphere(new V3(), P.rMax * 1.2 + P.capsuleHalf + P.fluffMax * 2);
    const centerY = P.stickLength - P.candyFromTip;
    let liveBase = getBase(P.sub[quality.level] || P.sub.mid);
    const handleBase = getBase(P.subHandle), copyBase = getBase(P.subCopy);
    const arcRnd = mulberry32(977), ARC_MAX = Math.max(P.cling.low, P.cling.mid, P.cling.high);
    const arcs = [];
    for (let k = 0; k < ARC_MAX; k++) {
      const y = (arcRnd() * 2 - 1) * 0.82, a = arcRnd() * TAU, s = Math.sqrt(1 - y * y);
      arcs.push({
        x: Math.cos(a) * s,
        y,
        z: Math.sin(a) * s,
        sweep: 0.5 + arcRnd() * 1,
        drift: (arcRnd() - 0.5) * 0.4,
        wave: (arcRnd() - 0.5) * 0.12,
        phase: arcRnd() * TAU,
        lift: 0.25 + arcRnd() * 0.75,
        flare: arcRnd() < 0.45 ? 0.5 + arcRnd() * 0.9 : 0.15,
        show: 0.01 + arcRnd() * 0.035,
        width: P.clingWidth * (0.7 + arcRnd() * 0.7),
        alpha: 0.6 + arcRnd() * 0.4
      });
    }
    const arcDir = new Float32Array(ARC_MAX * P.clingPts * 3);
    for (let k = 0; k < ARC_MAX; k++) {
      const A = arcs[k], pts = P.clingPts;
      for (let j = 0; j < pts; j++) {
        const u = j / (pts - 1), th = -A.sweep * u, c = Math.cos(th), s = Math.sin(th);
        const x = A.x * c + A.z * s, z = -A.x * s + A.z * c, y = A.y + A.drift * u + A.wave * Math.sin(u * TAU + A.phase);
        const l = Math.hypot(x, y, z) || 1, o = (k * pts + j) * 3;
        arcDir[o] = x / l;
        arcDir[o + 1] = y / l;
        arcDir[o + 2] = z / l;
      }
    }
    const arcIdxCache = /* @__PURE__ */ new Map();
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
    function makeBody(base, nShells, nCling, mats) {
      const n = base.n;
      const A = { pos: new Float32Array(n * 3), nor: new Float32Array(n * 3), c0: new Float32Array(n * 4), c1: new Float32Array(n * 4), fx: new Float32Array(n * 3) };
      const at = {
        position: new THREE.BufferAttribute(A.pos, 3),
        normal: new THREE.BufferAttribute(A.nor, 3),
        aC0: new THREE.BufferAttribute(A.c0, 4),
        aC1: new THREE.BufferAttribute(A.c1, 4),
        aFx: new THREE.BufferAttribute(A.fx, 3)
      };
      const index = new THREE.BufferAttribute(base.index, 1);
      const geo = new THREE.BufferGeometry(), sgeo = new THREE.InstancedBufferGeometry();
      for (const k in at) {
        at[k].setUsage(THREE.DynamicDrawUsage);
        geo.setAttribute(k, at[k]);
        sgeo.setAttribute(k, at[k]);
      }
      geo.setIndex(index);
      sgeo.setIndex(index);
      const hs = new Float32Array(nShells);
      for (let i = 0; i < nShells; i++) hs[i] = (i + 1) / nShells;
      sgeo.setAttribute("aShell", new THREE.InstancedBufferAttribute(hs, 1));
      sgeo.instanceCount = nShells;
      geo.boundingSphere = bound;
      sgeo.boundingSphere = bound;
      const group = new THREE.Group();
      group.name = "candy";
      group.position.set(0, centerY, 0);
      const core = new THREE.Mesh(geo, mats.core);
      core.name = "candy-core";
      core.renderOrder = 2;
      const shells = new THREE.Mesh(sgeo, mats.shell);
      shells.name = "candy-fur";
      shells.renderOrder = 3;
      const cling = createRibbons(THREE, ribbonMat, Math.max(1, nCling), P.clingPts);
      cling.mesh.name = "candy-cling";
      cling.mesh.renderOrder = 4;
      cling.mesh.frustumCulled = true;
      cling.geo.boundingSphere = bound;
      group.add(core, shells, cling.mesh);
      return { base, A, at, geo, sgeo, group, core, shells, cling, nShells, nCling, arcIx: arcIndices(base) };
    }
    function disposeBody(b) {
      b.group.removeFromParent();
      b.geo.dispose();
      b.sgeo.dispose();
      b.cling.dispose();
    }
    function refresh(s) {
      const b = s.body, f = s.field, A = b.A;
      writeSurface(f, P, A, s.bite, palLin);
      for (const k in b.at) b.at[k].needsUpdate = true;
      const pts = P.clingPts, ix = b.arcIx, cl = b.cling, rr = f.rr;
      for (let k = 0; k < b.nCling; k++) {
        const a = arcs[k];
        for (let j = 0; j < pts; j++) arcR[j] = rr[ix[k * pts + j]];
        for (let j = 0; j < pts; j++) {
          const o = k * pts + j, i = ix[o], u = j / (pts - 1), fl = A.c1[i * 4 + 3];
          const r = (arcR[j > 0 ? j - 1 : 0] + arcR[j] * 2 + arcR[j < pts - 1 ? j + 1 : j]) * 0.25 + fl * (a.lift + a.flare * u * u) + 8e-4;
          const dx = arcDir[o * 3], dy = arcDir[o * 3 + 1], dz = arcDir[o * 3 + 2];
          const al = P.clingAlpha * a.alpha * sat((f.r[i] - a.show) / 8e-3) * Math.sin(Math.PI * (0.06 + 0.88 * u)) * (1 - A.fx[i * 3 + 1]) * (0.8 + 0.5 * A.fx[i * 3]);
          cl.put(k, j, dx * r, P.capsuleHalf * dy + dy * r, dz * r, A.c0[i * 4] * 0.5 + 0.5, A.c0[i * 4 + 1] * 0.5 + 0.5, A.c0[i * 4 + 2] * 0.5 + 0.5, al, a.width);
        }
        cl.finish(k);
      }
      cl.setCount(b.nCling);
      cl.commit();
      f.volume = measureVolume(b.base, A.pos);
    }
    let seedCounter = Math.random() * 1e6 | 0;
    function makeStick() {
      const obj = new THREE.Group();
      obj.name = "stick";
      const stickMesh = new THREE.Mesh(stickGeo, stickMatLive);
      stickMesh.name = "stick-wood";
      stickMesh.renderOrder = 2;
      obj.add(stickMesh);
      const mats = { core: makeCandyMaterial(THREE, shared, "CORE"), shell: makeCandyMaterial(THREE, shared, "SHELL") };
      const field = createField(liveBase, P, seedCounter++, colorIndex);
      const nCling = P.cling[quality.level] || P.cling.mid;
      const body = makeBody(liveBase, shellsFor(liveBase, nCling), nCling, mats);
      obj.add(body.group);
      const s = {
        obj,
        stickMesh,
        mats,
        field,
        body,
        bite: null,
        biteAmt: 0,
        biteDir: new V3(0, 0, -1),
        pulse: { x: 0, v: 0 },
        swayX: { x: 0, v: 0 },
        swayZ: { x: 0, v: 0 }
      };
      refresh(s);
      field.volume0 = field.volume;
      return s;
    }
    function rebuildBody(s, base, nShells, nCling) {
      s.field = resampleField(s.field, base, P);
      const old = s.body;
      s.body = makeBody(base, nShells, nCling, s.mats);
      s.body.group.quaternion.copy(old.group.quaternion);
      s.body.group.scale.copy(old.group.scale);
      disposeBody(old);
      s.obj.add(s.body.group);
      refresh(s);
    }
    function disposeStick(s) {
      disposeBody(s.body);
      s.mats.core.dispose();
      s.mats.shell.dispose();
      s.obj.removeFromParent();
    }
    const axis = new V3();
    function settle(s, dt, lagX2, lagZ2, size) {
      spring(s.pulse, 0, P.pulseW, P.pulseZeta, dt);
      spring(s.swayX, lagX2, P.swayW, P.swayZeta, dt);
      spring(s.swayZ, lagZ2, P.swayW, P.swayZeta, dt);
      const g = s.body.group, ox = s.swayX.x, oz = s.swayZ.x, len = Math.hypot(ox, oz);
      if (len > 1e-6) {
        axis.set(oz / len, 0, -ox / len);
        g.quaternion.setFromAxisAngle(axis, Math.min(P.swayMax, len * P.swayGain * size));
      } else g.quaternion.identity();
      g.scale.setScalar(clamp(1 + s.pulse.x, 0.75, 1.35));
    }
    let colorIndex = 0, pendingLayer = false;
    let cur = null;
    let popT = 1, popEmitted = true;
    let highlight = 0, hl = 0, time = 0, twirl = 0, tapLeft = 0, grab = 0;
    const goal = new V3(...P.restCenter);
    const C = new V3(...P.restCenter), Cprev = C.clone();
    const sx = { x: C.x, v: 0 }, sy = { x: C.y, v: 0 }, sz = { x: C.z, v: 0 };
    const hx = { x: C.x + P.handOffset[0], v: 0 }, hy = { x: C.y + P.handOffset[1], v: 0 }, hz = { x: C.z + P.handOffset[2], v: 0 };
    const lagX = { x: C.x, v: 0 }, lagZ = { x: C.z, v: 0 };
    const dir = new V3(), tip = new V3(), vel = new V3();
    const q = new THREE.Quaternion(), qi = new THREE.Quaternion(), qTw = new THREE.Quaternion();
    const UP = new V3(0, 1, 0);
    const v = new V3(), v2 = new V3();
    const srcL = new V3(0, -1, 0), motL = new V3(1, 0, 0), depW = new V3(0, -1, 0), depL = new V3(0, -1, 0);
    const state = { stage: 0, mass: 0, radius: 0, colorIndex: 0, tip: new V3(), center: new V3(), hasStick: false };
    const evWrap = { amount: 0, point: new V3() }, evStage = { stage: 0 }, evLayer = { colorIndex: 0 }, evPop = {};
    let wrapAcc = 0, wrapT = 0, lastStage = 0, speedS = 0;
    const hit = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.06, 0.06, 0.34, 8)), keep(new THREE.MeshBasicMaterial({ visible: false })));
    hit.name = "stick-hit";
    hit.visible = false;
    root.add(hit);
    const hitObjects = [hit];
    const glowMat = keep(new THREE.SpriteMaterial({
      map: glowTex,
      color: 16773288,
      opacity: 0,
      transparent: false,
      depthWrite: false,
      depthTest: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor
    }));
    const glow = new THREE.Sprite(glowMat);
    glow.name = "hero-glow";
    glow.renderOrder = 1;
    glow.visible = false;
    root.add(glow);
    const rnd = mulberry32(20261126);
    let fly = null, TH = [];
    const curCol = [palLin[0], palLin[1], palLin[2]];
    function seedThread(t, k, spinAngle, initial) {
      t.cap = !!cur && rnd() < P.captureRatio;
      const L = t.cap ? P.threadLifeCap : P.threadLife;
      t.life = L[0] + (L[1] - L[0]) * rnd();
      t.born = initial ? time - rnd() * t.life : time;
      t.phi0 = spinAngle + k % P.nozzles * (TAU / P.nozzles) + (rnd() - 0.5) * 0.6;
      t.rw = pan.innerRadius - 0.012 - rnd() * 0.05;
      t.kr = 1.4 + rnd() * 1.4;
      t.swirl = 2.6 + rnd() * 2.2;
      t.rise = 0.015 + rnd() * 0.085;
      t.wob = rnd() * TAU;
      t.psi0 = (rnd() - 0.5) * 1.5;
      t.ey = (rnd() - 0.5) * 0.9;
      t.dy = (rnd() - 0.5) * 0.9;
      t.lift = 0.25 + rnd() * 0.9;
      t.wOm = P.wrapOmega * (0.7 + 0.6 * rnd());
    }
    function buildThreads() {
      if (fly) fly.dispose();
      const n = Math.max(4, quality.threads | 0);
      fly = createRibbons(THREE, ribbonMat, n, P.threadPts);
      fly.mesh.name = "threads";
      fly.mesh.renderOrder = 4;
      root.add(fly.mesh);
      TH = [];
      for (let k = 0; k < n; k++) {
        const t = {};
        seedThread(t, k, rnd() * TAU, true);
        TH.push(t);
      }
      fly.setCount(n);
    }
    function updateThreads(dt, input) {
      const n = TH.length, pts = P.threadPts, rs = pan.spinnerRadius;
      const ck = 1 - Math.exp(-dt * 9);
      for (let i = 0; i < 3; i++) curCol[i] += (palLin[colorIndex * 3 + i] - curCol[i]) * ck;
      const cr = curCol[0] * 0.6 + 0.4, cg = curCol[1] * 0.6 + 0.4, cb = curCol[2] * 0.6 + 0.4;
      const s = cur, f = s ? s.field : null;
      let m = null, sc = 1;
      if (s) {
        m = s.obj.matrix.elements;
        sc = s.body.group.scale.x;
      }
      const c0 = P.capture[0], c1 = P.capture[1];
      for (let k = 0; k < n; k++) {
        const t = TH[k];
        let a = time - t.born;
        if (a > t.life || a < 0) {
          seedThread(t, k, input.spinAngle || 0, false);
          a = 0;
        }
        const fade = sat(a / 0.08) * sat((t.life - a) / (t.life * 0.3));
        const wrapOn = t.cap && s && grab > 2e-3;
        for (let j = 0; j < pts; j++) {
          const aj = Math.max(0, a - j * P.threadTau);
          const e = 1 - Math.exp(-aj * t.kr);
          const rho = rs + (t.rw - rs) * e;
          const phi = t.phi0 + t.swirl * (1 - Math.exp(-aj * 2)) + 0.5 * aj;
          let x = Math.cos(phi) * rho, z = -Math.sin(phi) * rho;
          let y = 6e-3 + t.rise * (1 - Math.exp(-aj * 1.6)) + 7e-3 * Math.sin(aj * 5 + t.wob) * e;
          let al = P.threadAlpha;
          if (wrapOn) {
            const w = smooth((aj - c0) / (c1 - c0)) * grab;
            if (w > 0) {
              const wa = Math.max(0, aj - c1), psi = t.psi0 - t.wOm * wa, cs = Math.cos(psi), sn = Math.sin(psi);
              let ex = depL.x * cs + depL.z * sn, ez = -depL.x * sn + depL.z * cs, ey = depL.y + t.ey + t.dy * wa;
              const l = Math.hypot(ex, ey, ez) || 1;
              ex /= l;
              ey /= l;
              ez /= l;
              const rsurf = surfaceR(f, P, ex, ey, ez);
              const rr = (rsurf + Math.min(P.fluffMax, P.fluffMin + P.fluffK * rsurf) * t.lift + 3e-3) * sc;
              const lx = ex * rr, ly = centerY + P.capsuleHalf * ey + ey * rr, lz = ez * rr;
              const wx = m[0] * lx + m[4] * ly + m[8] * lz + m[12], wy = m[1] * lx + m[5] * ly + m[9] * lz + m[13], wz = m[2] * lx + m[6] * ly + m[10] * lz + m[14];
              x += (wx - x) * w;
              y += (wy - y) * w;
              z += (wz - z) * w;
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
    function poseStick(dt, input, holding) {
      if (holding) {
        goal.x = input.target.x;
        goal.z = input.target.z;
      }
      const R = state.radius * P.reachK + (state.radius > 0.01 ? 0.01 : 0);
      let y = Math.max(P.restCenter[1], P.bottomClear + R);
      const dh = pan.innerRadius - Math.hypot(goal.x, goal.z);
      if (dh < R) y = Math.max(y, pan.rimY + Math.sqrt(Math.max(0, R * R - dh * dh)) - 0.01);
      y += hl * P.bobAmp * Math.abs(Math.sin(Math.PI * time / P.bobPeriod));
      goal.y = y;
      spring(sx, goal.x, P.followW, P.followZeta, dt);
      spring(sy, goal.y, P.followW, P.followZeta, dt);
      spring(sz, goal.z, P.followW, P.followZeta, dt);
      C.set(sx.x, sy.x, sz.x);
      const f = P.handFollow, r0 = P.restCenter, ho = P.handOffset;
      const wag = hl * P.bobWag * Math.sin(TAU * time / P.bobPeriod);
      spring(hx, r0[0] + (goal.x - r0[0]) * f + ho[0] + wag, P.handW, P.handZeta, dt);
      spring(hy, goal.y + ho[1], P.handW, P.handZeta, dt);
      spring(hz, r0[2] + (goal.z - r0[2]) * f + ho[2], P.handW, P.handZeta, dt);
      dir.set(C.x - hx.x, C.y - hy.x, C.z - hz.x);
      if (dir.lengthSq() < 1e-8) dir.set(-0.58, -0.48, -0.65);
      dir.normalize();
      vel.copy(C).sub(Cprev).divideScalar(dt);
      Cprev.copy(C);
      const sp = Math.min(vel.length(), 3);
      speedS += (sp - speedS) * (1 - Math.exp(-dt * 14));
      if (holding || tapLeft > 0) twirl = (twirl + (P.twirlMove + (P.twirlStill - P.twirlMove) / (1 + speedS / P.speedRef * 2)) * dt) % TAU;
      q.setFromUnitVectors(UP, dir);
      qTw.setFromAxisAngle(UP, twirl);
      q.multiply(qTw);
      qi.copy(q).invert();
      tip.copy(C).addScaledVector(dir, P.candyFromTip);
      spring(lagX, C.x, P.swayW, P.swayZeta, dt);
      spring(lagZ, C.z, P.swayW, P.swayZeta, dt);
      if (cur) {
        const o = cur.obj;
        const k = Math.min(1, popT), pop = k < 1 ? Math.max(1e-3, easeOutBack(k)) : 1;
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
    function update(dt, input) {
      if (!(dt > 0)) return;
      dt = Math.min(dt, 0.1);
      time += dt;
      shared.uTime.value = time;
      if (popT < 1) {
        popT += dt / P.popTime;
        if (popT >= 1 && !popEmitted) {
          popEmitted = true;
          emit("pop", evPop);
        }
      }
      hl += (highlight - hl) * (1 - Math.exp(-dt * 8));
      if (input.taps && input.taps.length && cur) {
        const p = input.taps[input.taps.length - 1];
        goal.x = p.x;
        goal.z = p.z;
        tapLeft = P.tapSeconds;
        sy.v += 0.55;
        cur.pulse.v += 1.2;
      }
      const holding = !!(input.holding && input.target && cur);
      poseStick(dt, input, holding);
      grab += ((holding || tapLeft > 0 ? 1 : 0) - grab) * (1 - Math.exp(-dt * (holding || tapLeft > 0 ? 14 : 5)));
      let dirty = false;
      if (cur) {
        const f = cur.field;
        v.set(-C.x, P.srcY - C.y, -C.z);
        if (v.lengthSq() < 1e-8) v.set(0, -1, 0);
        v.normalize();
        const mAmt = Math.min(P.speedGainMax, speedS / P.speedRef);
        if (speedS > 0.03) v2.copy(vel).normalize();
        else v2.set(0, 0, 0);
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
            dirty = true;
            wrapAcc += mean;
            if (pendingLayer) {
              pendingLayer = false;
              evLayer.colorIndex = colorIndex;
              emit("layer", evLayer);
              cur.pulse.v += 0.8;
            }
          }
          depW.copy(v).multiplyScalar(srcW).addScaledVector(v2, motW);
          if (depW.lengthSq() < 1e-8) depW.copy(v);
          depW.normalize();
        }
        if (tapLeft > 0) tapLeft -= dt;
        depL.copy(depW).applyQuaternion(qi);
        if (decayFresh(f, P, dt)) dirty = true;
        if (dirty) {
          refresh(cur);
          measure();
        }
      }
      wrapT += dt;
      if (wrapT > 1 / 12 && wrapAcc > 0) {
        evWrap.amount = Math.min(1, wrapAcc / 12e-4);
        evWrap.point.copy(C).addScaledVector(depW, state.radius * 0.7);
        emit("wrap", evWrap);
        wrapAcc = 0;
        wrapT = 0;
      }
      if (state.stage > lastStage) {
        evStage.stage = state.stage;
        emit("stage", evStage);
        if (cur) cur.pulse.v += 1.6 + 0.5 * state.stage;
      }
      lastStage = state.stage;
      updateThreads(dt, input);
      const pulse = 0.6 + 0.4 * Math.sin(time * 6);
      glow.visible = !!cur && hl > 0.01;
      glow.position.copy(C);
      glow.scale.setScalar(0.28 + state.radius * 2.3);
      glowMat.opacity = hl * (0.55 + 0.35 * pulse) / (1 + state.radius * 5);
      stickMatLive.emissiveIntensity = hl * (0.35 + 0.45 * pulse);
      if (cur) {
        const g = hl * 0.5 * pulse;
        cur.mats.core.uniforms.uGlow.value = g;
        cur.mats.shell.uniforms.uGlow.value = g;
      }
      state.colorIndex = colorIndex;
      state.tip.copy(tip);
      state.center.copy(C);
      state.hasStick = !!cur;
    }
    function measure() {
      const f = cur.field;
      const mass = Math.max(0, f.volume - f.volume0);
      state.mass = mass;
      state.radius = f.radius > 0 ? f.radius + Math.min(P.fluffMax, P.fluffMin + P.fluffK * f.radius) * 0.7 : 0;
      const req = Math.cbrt(mass * 3 / (4 * Math.PI));
      let st = 0;
      for (let i = 0; i < 3; i++) if (req >= P.stageR[i]) st = i + 1;
      if (st > state.stage) state.stage = st;
    }
    function setBiteOn(s, amount, dirLocal) {
      const a = sat(amount || 0);
      if (dirLocal) s.biteDir.copy(dirLocal);
      if (Math.abs(a - s.biteAmt) < 4e-3) return;
      s.biteAmt = a;
      if (a < 4e-3) s.bite = null;
      else {
        const f = s.field, b = s.bite || (s.bite = { n: 3, x: new Float32Array(3), y: new Float32Array(3), z: new Float32Array(3), rad: new Float32Array(3) });
        v.copy(s.biteDir);
        if (v.lengthSq() < 1e-8) v.set(0, 0, -1);
        v.normalize();
        v.y += P.biteUp;
        v.normalize();
        const Rs = surfaceR(f, P, v.x, v.y, v.z), Rm = Math.max(f.meanR, 0.01);
        const rad = Rm * (P.biteRadius[0] + P.biteRadius[1] * a), off = Rs + rad - a * Rm * P.biteDepth;
        const cx = v.x * off, cy = P.capsuleHalf * v.y + v.y * off, cz = v.z * off;
        v2.set(v.z, 0, -v.x);
        if (v2.lengthSq() < 1e-8) v2.set(1, 0, 0);
        v2.normalize();
        b.x[0] = cx;
        b.y[0] = cy;
        b.z[0] = cz;
        b.rad[0] = rad;
        for (let k = 1; k < 3; k++) {
          const sg = k === 1 ? 1 : -1, d = rad * 0.7;
          b.x[k] = cx + v2.x * d * sg + v.x * rad * 0.22;
          b.y[k] = cy + v.y * rad * 0.22;
          b.z[k] = cz + v2.z * d * sg + v.z * rad * 0.22;
          b.rad[k] = rad * 0.55;
        }
      }
      refresh(s);
    }
    function makeCopy(s) {
      const f = resampleField(s.field, copyBase, P), n = copyBase.n, K = P.copyShells, T = copyBase.index.length;
      const A = { pos: new Float32Array(n * 3), nor: new Float32Array(n * 3), c0: new Float32Array(n * 4), c1: new Float32Array(n * 4), fx: new Float32Array(n * 3) };
      f.fresh.fill(0);
      writeSurface(f, P, A, s.bite, palLin);
      const rep = (src, size) => {
        const o2 = new Float32Array(src.length * (K + 1));
        for (let k = 0; k <= K; k++) o2.set(src, k * n * size);
        return o2;
      };
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(rep(A.pos, 3), 3));
      g.setAttribute("normal", new THREE.BufferAttribute(rep(A.nor, 3), 3));
      g.setAttribute("aC0", new THREE.BufferAttribute(rep(A.c0, 4), 4));
      g.setAttribute("aC1", new THREE.BufferAttribute(rep(A.c1, 4), 4));
      g.setAttribute("aFx", new THREE.BufferAttribute(rep(A.fx, 3), 3));
      const sh = new Float32Array(n * (K + 1)), idx = new Uint16Array(T * (K + 1));
      for (let k = 0; k <= K; k++) {
        sh.fill(k === 0 ? -1 : k / K, k * n, (k + 1) * n);
        for (let i = 0; i < T; i++) idx[k * T + i] = copyBase.index[i] + k * n;
      }
      g.setAttribute("aShell", new THREE.BufferAttribute(sh, 1));
      g.setIndex(new THREE.BufferAttribute(idx, 1));
      g.boundingSphere = bound;
      const o = new THREE.Group();
      o.name = "candy-copy";
      const candy = new THREE.Mesh(g, copyMat);
      candy.position.set(0, centerY, 0);
      o.add(new THREE.Mesh(stickGeo, stickMatPlain), candy);
      return { object: o, dispose() {
        g.dispose();
        o.removeFromParent();
      } };
    }
    function release() {
      if (!cur || state.stage < 1) return null;
      const s = cur;
      cur = null;
      s.field.fresh.fill(0);
      s.field.anyFresh = false;
      rebuildBody(s, handleBase, Math.min(P.handleShells, quality.furShells | 0), P.clingHandle);
      s.stickMesh.material = stickMatPlain;
      s.mats.core.uniforms.uGlow.value = 0;
      s.mats.shell.uniforms.uGlow.value = 0;
      s.obj.scale.setScalar(1);
      const used = s.field.used.length ? s.field.used : [colorIndex];
      let alive = true;
      const handle = {
        object: s.obj,
        candyCenter: new V3(0, centerY, 0),
        radius: state.radius,
        colors: used.map((i) => palette[i].color),
        outerColor: palette[s.field.lastColor].color,
        update(dt) {
          if (alive && dt > 0) settle(s, Math.min(dt, 0.1), 0, 0, 1);
        },
        setBite(amount, dirLocal) {
          if (alive) setBiteOn(s, amount, dirLocal);
        },
        makeDisplayCopy() {
          return makeCopy(s);
        },
        dispose() {
          if (alive) {
            alive = false;
            disposeStick(s);
          }
        }
      };
      state.stage = 0;
      lastStage = 0;
      state.mass = 0;
      state.radius = 0;
      state.hasStick = false;
      wrapAcc = 0;
      tapLeft = 0;
      return handle;
    }
    function newStick() {
      if (cur) disposeStick(cur);
      cur = makeStick();
      root.add(cur.obj);
      popT = 0;
      popEmitted = false;
      goal.set(...P.restCenter);
      sx.x = goal.x;
      sy.x = goal.y;
      sz.x = goal.z;
      sx.v = sy.v = sz.v = 0;
      hx.x = goal.x + P.handOffset[0];
      hy.x = goal.y + P.handOffset[1];
      hz.x = goal.z + P.handOffset[2];
      hx.v = hy.v = hz.v = 0;
      lagX.x = goal.x;
      lagZ.x = goal.z;
      lagX.v = lagZ.v = 0;
      C.copy(goal);
      Cprev.copy(goal);
      speedS = 0;
      tapLeft = 0;
      state.stage = 0;
      lastStage = 0;
      state.mass = 0;
      state.radius = 0;
      state.hasStick = true;
      pendingLayer = false;
      cur.obj.scale.setScalar(1e-3);
    }
    buildThreads();
    newStick();
    popT = 1;
    popEmitted = true;
    poseStick(1 / 60, { holding: false, target: null }, false);
    return {
      root,
      hitObjects,
      update,
      release,
      newStick,
      setColor(i) {
        i |= 0;
        if (!(i >= 0 && i < palette.length)) return;
        if (i !== colorIndex) pendingLayer = true;
        colorIndex = i;
        state.colorIndex = i;
      },
      setHighlight(x) {
        highlight = sat(+x || 0);
      },
      getState() {
        return state;
      },
      setQuality(qu) {
        quality = { ...quality, ...qu || {} };
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
        fuzzTex.needsUpdate = true;
        glowTex.needsUpdate = true;
        for (const o of own) if (o.isMaterial) o.needsUpdate = true;
        if (cur) {
          cur.mats.core.needsUpdate = true;
          cur.mats.shell.needsUpdate = true;
        }
      },
      dispose() {
        if (cur) {
          disposeStick(cur);
          cur = null;
        }
        if (fly) {
          fly.dispose();
          fly = null;
        }
        for (const o of own) o.dispose && o.dispose();
        root.removeFromParent();
      }
    };
    function emptyPositions(base) {
      const n = base.n, D = base.dirs, pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = D[i * 3] * P.r0;
        pos[i * 3 + 1] = P.capsuleHalf * D[i * 3 + 1] + D[i * 3 + 1] * P.r0;
        pos[i * 3 + 2] = D[i * 3 + 2] * P.r0;
      }
      return pos;
    }
  }
  function makeStickGeometry(THREE) {
    const parts = [];
    for (const sgn of [-1, 1]) {
      const g = new THREE.BoxGeometry(1, 1, 1, 1, P.stickSeg, 1);
      const pos2 = g.attributes.position, uv2 = g.attributes.uv;
      for (let i = 0; i < pos2.count; i++) {
        const t = pos2.getY(i) + 0.5;
        const w = P.stickW0 + (P.stickW1 - P.stickW0) * t;
        const half = w / 2 - P.stickGap, depth = w * 0.56;
        const cx = sgn * (w / 4 + P.stickGap / 2);
        const x = cx + pos2.getX(i) * half, z = pos2.getZ(i) * depth;
        pos2.setXYZ(i, x, t * P.stickLength, z);
        uv2.setXY(i, 0.3 + sgn * 0.11 + pos2.getX(i) * 0.05 + pos2.getZ(i) * 0.03, t * 1.1);
      }
      g.computeVertexNormals();
      parts.push(g);
    }
    let nv = 0, ni = 0;
    for (const g of parts) {
      nv += g.attributes.position.count;
      ni += g.index.count;
    }
    const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), idx = new Uint16Array(ni);
    let vo = 0, io = 0;
    for (const g of parts) {
      pos.set(g.attributes.position.array, vo * 3);
      nor.set(g.attributes.normal.array, vo * 3);
      uv.set(g.attributes.uv.array, vo * 2);
      for (let i = 0; i < g.index.count; i++) idx[io + i] = g.index.array[i] + vo;
      vo += g.attributes.position.count;
      io += g.index.count;
      g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    out.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    out.setIndex(new THREE.BufferAttribute(idx, 1));
    out.computeBoundingSphere();
    return out;
  }
  return __toCommonJS(hero_exports);
})();
