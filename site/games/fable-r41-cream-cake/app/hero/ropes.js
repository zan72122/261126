// The cream as data and as one merged mesh.
// A stroke is a list of rings (centre, radius, frame, squash …) cut into chunks. Vertices are a pure
// function of ring data (star cross-section swept along the rings), so any ring can be re-evaluated in
// place: when the tip moves, when cream above squashes it, or when an old chunk is simplified.
import { P } from './params.js';

// ring record layout
export const X = 0, Y = 1, Z = 2, R = 3, SX = 4, SY = 5, S = 6, Q = 7, Q0 = 8, SID = 9,
  TX = 10, TY = 11, TZ = 12, BX = 13, BY = 14, BZ = 15, LIFT = 16, RV = 17, SLOPE = 18, TW = 19, YB = 20, FIX = 21, STRIDE = 22;
export const RCAP = 88;                 // rings an open chunk can hold
const LEVEL_M = [24, 24, 16, 8];        // vertices around a ring per simplification level (level 1 also drops every other ring)
const VCAP = 60000;                     // < 65536 → 16-bit indices

// star cross-section sampled at M points (+1 seam vertex): unit direction, radius factor, in-plane normal, valley shade
function table(M) {
  const { N, k, p } = P.star, n = M + 1;
  const t = { c: new Float32Array(n), s: new Float32Array(n), r: new Float32Array(n), nc: new Float32Array(n), ns: new Float32Array(n), ao: new Float32Array(n), u: new Float32Array(n) };
  for (let i = 0; i < n; i++) {
    const th = ((i % M) / M) * Math.PI * 2;
    const c = Math.cos(th), s = Math.sin(th);
    let rad, drad;
    if (M >= 2 * N) {
      const w = (1 - Math.cos(N * th)) / 2;
      rad = 1 - (1 - k) * Math.pow(w, p);
      drad = w > 1e-9 ? -(1 - k) * p * Math.pow(w, p - 1) * (N * Math.sin(N * th)) / 2 : 0;
    } else { rad = 1 - (1 - k) * 0.5; drad = 0; } // too few points for ridges: a round tube of the mean radius
    let nx = drad * s + rad * c, ny = -drad * c + rad * s;
    const l = Math.hypot(nx, ny) || 1;
    t.c[i] = c; t.s[i] = s; t.r[i] = rad; t.nc[i] = nx / l; t.ns[i] = ny / l;
    t.ao[i] = 1 - P.aoValley * (1 - (rad - k) / (1 - k));
    t.u[i] = (i / M) * P.uRepeat;
  }
  return t;
}

export function createRopes(THREE, { maxTris, colors, material, maxR, maxY }) {
  const maxR2 = maxR * maxR;
  const TAB = { 24: table(24), 16: table(16), 8: table(8) };
  const ICAP = maxTris * 3 + RCAP * 24 * 6 * 2;
  const pos = new Float32Array(VCAP * 3), nrm = new Float32Array(VCAP * 3), uv = new Float32Array(VCAP * 2), col = new Float32Array(VCAP * 3);
  const idx = new Uint16Array(ICAP);
  const geo = new THREE.BufferGeometry();
  const attrs = [new THREE.BufferAttribute(pos, 3), new THREE.BufferAttribute(nrm, 3), new THREE.BufferAttribute(uv, 2), new THREE.BufferAttribute(col, 3)];
  const aIdx = new THREE.BufferAttribute(idx, 1);
  for (const a of attrs) a.setUsage(THREE.DynamicDrawUsage);
  aIdx.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', attrs[0]); geo.setAttribute('normal', attrs[1]); geo.setAttribute('uv', attrs[2]); geo.setAttribute('color', attrs[3]);
  geo.setIndex(aIdx);
  geo.setDrawRange(0, 0);
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.7, 0), 4);
  geo.boundingBox = new THREE.Box3(new THREE.Vector3(-2, -0.2, -2), new THREE.Vector3(2, 2, 2));
  const mesh = new THREE.Mesh(geo, material);
  mesh.frustumCulled = false;
  mesh.name = 'hero-cream';

  const chunks = [];
  const spare = [];
  let vPtr = 0, iCount = 0, cursor = 0;

  // ---------- partial uploads ----------
  // cur = touched this frame, sent = handed to three but not yet uploaded (render may be skipped)
  const cur = [], sent = [];
  let curI0 = Infinity, curI1 = 0, sentI0 = Infinity, sentI1 = 0;
  let upV = true, upI = true, fullV = false, fullI = false;
  attrs[0].onUpload(() => { upV = true; });
  aIdx.onUpload(() => { upI = true; });
  const pool = attrs.map(() => { const a = []; for (let k = 0; k < 8; k++) a.push({ start: 0, count: 0 }); return a; });
  const poolI = { start: 0, count: 0 };

  function addRange(list, s, e) {
    for (let k = 0; k < list.length; k += 2) {
      if (s <= list[k + 1] + 64 && e >= list[k] - 64) { if (s < list[k]) list[k] = s; if (e > list[k + 1]) list[k + 1] = e; return; }
    }
    if (list.length >= 12) {
      let a = s, b = e;
      for (let k = 0; k < list.length; k += 2) { if (list[k] < a) a = list[k]; if (list[k + 1] > b) b = list[k + 1]; }
      list.length = 0; list.push(a, b);
      return;
    }
    list.push(s, e);
  }
  function markV(s, e) { addRange(cur, s, e); }
  function markI(s, e) { if (s < curI0) curI0 = s; if (e > curI1) curI1 = e; }

  function flush() {
    if (upV) { sent.length = 0; upV = false; fullV = false; }
    if (cur.length) { for (let k = 0; k < cur.length; k += 2) addRange(sent, cur[k], cur[k + 1]); cur.length = 0; }
    if (sent.length || fullV) {
      for (let a = 0; a < attrs.length; a++) {
        const at = attrs[a], n = at.itemSize, ur = at.updateRanges;
        ur.length = 0;
        if (!fullV) for (let k = 0, j = 0; k < sent.length; k += 2, j++) { const o = pool[a][j]; o.start = sent[k] * n; o.count = (sent[k + 1] - sent[k]) * n; ur.push(o); }
        at.needsUpdate = true;
      }
    }
    if (upI) { sentI0 = Infinity; sentI1 = 0; upI = false; fullI = false; }
    if (curI1 > curI0) { if (curI0 < sentI0) sentI0 = curI0; if (curI1 > sentI1) sentI1 = curI1; curI0 = Infinity; curI1 = 0; }
    if (sentI1 > sentI0 || fullI) {
      const ur = aIdx.updateRanges;
      ur.length = 0;
      if (!fullI) { poolI.start = sentI0; poolI.count = sentI1 - sentI0; ur.push(poolI); }
      aIdx.needsUpdate = true;
    }
    geo.setDrawRange(0, iCount);
    mesh.visible = iCount > 0;
  }

  // ---------- chunks ----------
  function icount(c) { return (c.n > 1 ? c.n - 1 : 0) * c.M * 6; }

  function writeIdx(c, g0, g1) {
    const M = c.M, vpr = M + 1;
    let o = c.i0 + g0 * M * 6;
    for (let g = g0; g < g1; g++) {
      const a0 = c.v0 + g * vpr;
      for (let k = 0; k < M; k++) {
        const a = a0 + k, b = a + vpr;
        idx[o++] = a; idx[o++] = a + 1; idx[o++] = b;
        idx[o++] = a + 1; idx[o++] = b + 1; idx[o++] = b;
      }
    }
  }

  function compact() {
    let p = 0;
    for (const c of chunks) {
      const used = c.n * (c.M + 1), keep = c.open ? c.vres : used;
      if (c.v0 !== p && used > 0) {
        pos.copyWithin(p * 3, c.v0 * 3, (c.v0 + used) * 3);
        nrm.copyWithin(p * 3, c.v0 * 3, (c.v0 + used) * 3);
        col.copyWithin(p * 3, c.v0 * 3, (c.v0 + used) * 3);
        uv.copyWithin(p * 2, c.v0 * 2, (c.v0 + used) * 2);
      }
      c.v0 = p; c.vres = keep; p += keep;
      const g = c.n > 1 ? c.n - 1 : 0;
      writeIdx(c, 0, g);
      c.gaps = g;
    }
    vPtr = p;
    if (p > 0) markV(0, p);
    if (iCount > 0) markI(0, iCount);
  }

  function newChunk(ci, sid, cont) {
    const need = RCAP * (LEVEL_M[0] + 1);
    if (vPtr + need > VCAP) compact();
    const d = spare.pop() || new Float32Array(RCAP * STRIDE);
    d.fill(0);
    const c = {
      d, n: 0, M: LEVEL_M[0], level: 0, v0: vPtr, vres: need, i0: iCount, gaps: 0, ci, sid,
      open: true, busy: true, elig: 0, dead: false, rev: 0, cont: !!cont,
      x0: Infinity, x1: -Infinity, z0: Infinity, z1: -Infinity, y0: Infinity, y1: -Infinity,
    };
    vPtr += need;
    chunks.push(c);
    return c;
  }

  // number of rings drawn for the open (last) chunk
  function setCount(c, n) {
    const g = n > 1 ? n - 1 : 0;
    if (g > c.gaps) { writeIdx(c, c.gaps, g); markI(c.i0 + c.gaps * c.M * 6, c.i0 + g * c.M * 6); c.gaps = g; }
    c.n = n;
    iCount = c.i0 + g * c.M * 6;
  }

  function grow(c, x, y, z, r) {
    if (x - r < c.x0) c.x0 = x - r; if (x + r > c.x1) c.x1 = x + r;
    if (z - r < c.z0) c.z0 = z - r; if (z + r > c.z1) c.z1 = z + r;
    if (y - r < c.y0) c.y0 = y - r; if (y + r > c.y1) c.y1 = y + r;
  }

  function box(c) {
    c.x0 = c.z0 = c.y0 = Infinity; c.x1 = c.z1 = c.y1 = -Infinity;
    const d = c.d;
    for (let i = 0; i < c.n; i++) { const o = i * STRIDE; grow(c, d[o + X], d[o + Y], d[o + Z], d[o + R] * 1.25); }
  }

  function close(c) {
    if (!c.open) return;
    c.open = false;
    const d = c.d.slice(0, c.n * STRIDE);
    if (spare.length < 2) spare.push(c.d);
    c.d = d;
    const used = c.n * (c.M + 1);
    if (c.v0 + c.vres === vPtr) vPtr = c.v0 + used;
    c.vres = used;
    c.gaps = c.n > 1 ? c.n - 1 : 0;
    box(c);
  }

  // ---------- rings → frames ----------
  // Tangent by central difference of the visible centres, B carried along from the ring before (no twist jumps).
  function frames(c, i0, i1, n) {
    const d = c.d;
    for (let i = i0; i <= i1; i++) {
      if ((i === 0 && c.cont) || c.d[i * STRIDE + FIX] > 0) continue; // copy of the previous chunk's last ring / frame set by hand
      const o = i * STRIDE, a = (i > 0 ? i - 1 : i) * STRIDE, b = (i < n - 1 ? i + 1 : i) * STRIDE;
      let tx = d[b + X] - d[a + X], ty = d[b + Y] + d[b + LIFT] - d[a + Y] - d[a + LIFT], tz = d[b + Z] - d[a + Z];
      let l = Math.sqrt(tx * tx + ty * ty + tz * tz);
      if (l > 1e-6) {
        tx /= l; ty /= l; tz /= l;
        let sl = (d[b + R] * d[b + RV] - d[a + R] * d[a + RV]) / l;
        d[o + SLOPE] = sl > 4 ? 4 : sl < -4 ? -4 : sl;
      } else {
        if (i > 0) { tx = d[a + TX]; ty = d[a + TY]; tz = d[a + TZ]; } else { tx = 0; ty = 1; tz = 0; }
        if (!(tx * tx + ty * ty + tz * tz > 0.5)) { tx = 0; ty = 1; tz = 0; }
        d[o + SLOPE] = 0;
      }
      const s = i > 0 ? a : o;
      let bx = d[s + BX], by = d[s + BY], bz = d[s + BZ];
      const dot = bx * tx + by * ty + bz * tz;
      bx -= tx * dot; by -= ty * dot; bz -= tz * dot;
      l = Math.sqrt(bx * bx + by * by + bz * bz);
      if (!(l > 1e-4)) {
        if (Math.abs(ty) < 0.9) { bx = -tz; by = 0; bz = tx; } else { bx = 1 - tx * tx; by = -tx * ty; bz = -tx * tz; }
        l = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
      }
      d[o + TX] = tx; d[o + TY] = ty; d[o + TZ] = tz;
      d[o + BX] = bx / l; d[o + BY] = by / l; d[o + BZ] = bz / l;
    }
  }

  // ---------- rings → vertices ----------
  // p(θ) = C + r·s(θ)·(B' cos θ + U' sin θ), then the sag/squash scales it in the cake's axes
  // (wider by sx, lower by sy, pressed toward its bottom yb by q). Normals follow analytically.
  const bulge = P.squash.bulge, under = P.aoUnder, vRep = P.vRepeat;
  function writeRings(c, i0, i1, qv) {
    if (c.dead || i1 < i0) return;
    const d = c.d, M = c.M, tb = TAB[M], vpr = M + 1;
    const tc = tb.c, ts = tb.s, tr = tb.r, tnc = tb.nc, tns = tb.ns, tao = tb.ao, tu = tb.u;
    const rgb = colors[c.ci] || colors[0], cr = rgb[0], cg = rgb[1], cb = rgb[2];
    for (let i = i0; i <= i1; i++) {
      const o = i * STRIDE;
      let r = d[o + R] * d[o + RV], q = qv === undefined ? d[o + Q] : qv;
      let cx = d[o + X], cy = d[o + Y], cz = d[o + Z], yb = d[o + YB], lift = d[o + LIFT];
      if (!(r >= 0 && r < 10) || !(cx * cx + cy * cy + cz * cz < 1e4) || !(yb > -100 && yb < 100) || !(lift > -100 && lift < 100)) { r = 0; cx = 0; cy = 0; cz = 0; yb = 0; lift = 0; }
      if (r < 0.003) r = 0.003;
      if (!(q >= 0)) q = 0; else if (q > 0.9) q = 0.9;
      cy = yb + (cy - yb) * (1 - q) + lift;
      let sx = d[o + SX], sy = d[o + SY];
      if (!(sx > 0.2)) sx = 1; if (!(sy > 0.2)) sy = 1;
      sx *= 1 + bulge * q; sy *= 1 - q;
      const isx = 1 / sx, isy = 1 / sy;
      let tx = d[o + TX], ty = d[o + TY], tz = d[o + TZ], bx = d[o + BX], by = d[o + BY], bz = d[o + BZ];
      if (!(tx * tx + ty * ty + tz * tz > 0.25) || !(bx * bx + by * by + bz * bz > 0.25)) { tx = 0; ty = 1; tz = 0; bx = 1; by = 0; bz = 0; }
      const ux = ty * bz - tz * by, uy = tz * bx - tx * bz, uz = tx * by - ty * bx;
      const ct = Math.cos(d[o + TW]), st = Math.sin(d[o + TW]);
      const ax = bx * ct + ux * st, ay = by * ct + uy * st, az = bz * ct + uz * st;
      const ex = ux * ct - bx * st, ey = uy * ct - by * st, ez = uz * ct - bz * st;
      const sl = d[o + SLOPE], v = d[o + S] * vRep;
      const v0 = c.v0 + i * vpr;
      let p = v0 * 3, t2 = v0 * 2;
      for (let k = 0; k <= M; k++) {
        const cs = tc[k], sn = ts[k], rad = r * tr[k];
        let px = cx + (ax * cs + ex * sn) * rad * sx, py = cy + (ay * cs + ey * sn) * rad * sy, pz = cz + (az * cs + ez * sn) * rad * sx;
        const pr = px * px + pz * pz;
        if (pr > maxR2) { const f = maxR / Math.sqrt(pr); px *= f; pz *= f; }  // an invisible collar at the rim
        if (py > maxY) py = maxY;
        pos[p] = px; pos[p + 1] = py; pos[p + 2] = pz;
        const nc = tnc[k], ns = tns[k];
        let nx = (ax * nc + ex * ns - tx * sl) * isx, ny = (ay * nc + ey * ns - ty * sl) * isy, nz = (az * nc + ez * ns - tz * sl) * isx;
        let l = nx * nx + ny * ny + nz * nz;
        if (l > 1e-12) { l = 1 / Math.sqrt(l); nx *= l; ny *= l; nz *= l; } else { nx = 0; ny = 1; nz = 0; }
        nrm[p] = nx; nrm[p + 1] = ny; nrm[p + 2] = nz;
        const ao = tao[k] * (ny < 0 ? 1 + under * ny : 1);
        col[p] = cr * ao; col[p + 1] = cg * ao; col[p + 2] = cb * ao;
        uv[t2] = tu[k]; uv[t2 + 1] = v;
        p += 3; t2 += 2;
      }
    }
    markV(c.v0 + i0 * vpr, c.v0 + (i1 + 1) * vpr);
  }

  // ---------- squash of what lies underneath ----------
  // New cream whose underside is at `bottom` presses on rings within `rad` (horizontal) whose top is right
  // below it: q = min(max, max(q, q_before_this_stroke + step·w)), w = (1 − d²/rad²)².
  const sq = P.squash;
  function squash(x, z, bottom, rad, sid, gain) {
    const r2 = rad * rad;
    let hit = 0;
    for (let n = 0; n < chunks.length; n++) {
      const c = chunks[n];
      if (c.elig <= 0 || x < c.x0 - rad || x > c.x1 + rad || z < c.z0 - rad || z > c.z1 + rad || bottom < c.y0 - sq.up - 0.1 || bottom > c.y1 + sq.up + 0.1) continue;
      const d = c.d, m = c.elig < c.n ? c.elig : c.n;
      for (let i = 0; i < m; i++) {
        const o = i * STRIDE, dx = d[o + X] - x, dz = d[o + Z] - z, d2 = dx * dx + dz * dz;
        if (d2 >= r2) continue;
        const yb = d[o + YB], ty2 = d[o + TY] * d[o + TY];
        if (ty2 > 0.4) {
          // a standing ring (blob, horn): cream that comes down through it presses it flat, down to its own underside
          const y = d[o + Y];
          if (y - yb < 0.03 || bottom > yb + (y - yb) * (1 - d[o + Q]) + sq.up) continue;
          let q = 1 - (bottom + 0.02 - yb) / (y - yb);
          const w = (1 - d2 / (r2 * 0.36)) * 3 * gain;   // only right under the new cream (0.6 of the squash radius)
          if (w <= 0) continue;
          if (w < 1) q *= w;
          if (q > sq.crush) q = sq.crush;
          if (q > d[o + Q] + 0.004) { jiggle(c, i, d[o + Q]); d[o + Q] = q; hit++; }
          continue;
        }
        const top = yb + (d[o + Y] + d[o + R] * d[o + SY] * (1 - ty2) - yb) * (1 - d[o + Q]);
        if (bottom > top + sq.up || bottom < top - sq.down) continue;
        if (d[o + SID] !== sid) { d[o + SID] = sid; d[o + Q0] = d[o + Q]; }
        let w = 1 - d2 / r2; w *= w * gain;
        let q = d[o + Q0] + sq.step * w;
        if (q > sq.max) q = sq.max;
        if (q > d[o + Q] + 0.004) { jiggle(c, i, d[o + Q]); d[o + Q] = q; hit++; }
      }
    }
    return hit;
  }

  // The squash does not snap: each pressed ring goes to its new q like a damped spring (a little too far, then back).
  const jig = [];
  function jiggle(c, i, qFrom) {
    for (let k = 0; k < jig.length; k++) {
      const e = jig[k];
      if (e.c === c && e.i === i) { e.q0 = e.qv; e.t = 0; return; }
    }
    if (jig.length < 140) jig.push({ c, i, q0: qFrom, qv: qFrom, t: 0, rev: c.rev });
    else writeRings(c, i, i);
  }
  function animate(dt) {
    for (let k = jig.length - 1; k >= 0; k--) {
      const e = jig[k], c = e.c;
      e.t += dt;
      const ok = !c.dead && c.rev === e.rev && e.i < c.n;
      if (!ok || e.t > sq.tJig) {
        if (ok) writeRings(c, e.i, e.i);
        jig[k] = jig[jig.length - 1]; jig.pop();
        continue;
      }
      const q = c.d[e.i * STRIDE + Q];
      e.qv = e.q0 + (q - e.q0) * (1 - Math.exp(-e.t / sq.tau) * Math.cos(sq.omega * e.t));
      writeRings(c, e.i, e.i, e.qv);
    }
  }

  // ---------- budget ----------
  // 1. cream that cannot be seen is taken out (whole chunks, or the hidden middle of a chunk);
  // 2. only if that is not enough, the oldest visible chunks are simplified step by step, and at the very end dropped.

  // chunk k changed its ring count / detail / died: close the gap in the index buffer
  function resize(k, old) {
    const c = chunks[k], nu = c.dead ? 0 : icount(c), delta = old - nu;
    if (delta !== 0) {
      idx.copyWithin(c.i0 + nu, c.i0 + old, iCount);
      iCount -= delta;
      for (let j = k + 1; j < chunks.length; j++) { const e = chunks[j]; e.i0 -= delta; if (e.open) e.gaps = e.n > 1 ? e.n - 1 : 0; }
    }
    if (!c.dead) { c.gaps = c.n > 1 ? c.n - 1 : 0; writeIdx(c, 0, c.gaps); }
    markI(c.i0, Math.max(iCount, c.i0 + 1));
    if (c.dead) chunks.splice(k, 1);
  }

  function relevel(k, level) {
    const c = chunks[k], old = icount(c);
    if (level >= 4) { c.dead = true; c.elig = 0; }
    else {
      if (level === 1 && c.n > 3) {
        const d = c.d, n = c.n;
        let m = 0;
        for (let i = 0; i < n; i++) {
          if (i === 0 || i === n - 1 || (i & 1) === 0 || d[i * STRIDE + R] < 0.01) { if (m !== i) d.copyWithin(m * STRIDE, i * STRIDE, (i + 1) * STRIDE); m++; }
        }
        c.n = m; if (c.elig > m) c.elig = m;
      }
      c.M = LEVEL_M[level]; c.level = level; c.rev++;
      writeRings(c, 0, c.n - 1);
    }
    resize(k, old);
  }

  // Take hidden cream out of chunk k. hid(c, i) says whether ring i is out of sight.
  // A hidden run a…b (≥ 5 rings) is replaced by a, pin, pin, b: the tube closes to a point right behind a and
  // opens again right before b; in between nothing is drawn.
  const flags = new Uint8Array(RCAP + 8);
  function sweep(k, hid) {
    const c = chunks[k], n = c.n, d = c.d;
    let all = true, any = false;
    for (let i = 0; i < n; i++) { const f = hid(c, i) ? 1 : 0; flags[i] = f; if (f) any = true; else all = false; }
    if (!any) return false;
    const old = icount(c);
    if (all) { c.dead = true; c.elig = 0; resize(k, old); return true; }
    let m = 0, changed = false, i = 0;
    const put = (t, pin) => { if (m !== t) d.copyWithin(m * STRIDE, t * STRIDE, (t + 1) * STRIDE); if (pin) { d[m * STRIDE + R] = 0.004; d[m * STRIDE + RV] = 1; } m++; };
    while (i < n) {
      if (!flags[i]) { put(i, false); i++; continue; }
      let j = i;
      while (j + 1 < n && flags[j + 1]) j++;
      if (j - i + 1 >= 5) { put(i, false); put(i + 1, true); put(j - 1, true); put(j, false); changed = true; }
      else for (let t = i; t <= j; t++) put(t, false);
      i = j + 1;
    }
    if (!changed) return false;
    c.n = m; if (c.elig > m) c.elig = m; c.rev++;
    writeRings(c, 0, m - 1);
    resize(k, old);
    return true;
  }

  function reduceOnce() {
    let best = -1, bestS = Infinity;
    const n = chunks.length;
    for (let k = 0; k < n; k++) {
      const c = chunks[k];
      if (c.open || c.busy || c.level >= 4) continue;
      const s = c.level + (k / n) * 1.5;       // old before new: the oldest cream is two steps down before the newest loses one
      if (s < bestS) { bestS = s; best = k; }
    }
    if (best < 0) return false;
    relevel(best, chunks[best].level + 1);
    return true;
  }

  // Keep `want` triangles free. Returns false only if nothing can be simplified any more.
  function makeRoom(want) {
    let guard = 0;
    while (maxTris - iCount / 3 < want && guard++ < 400) if (!reduceOnce()) return maxTris - iCount / 3 >= want;
    return true;
  }

  // Called every frame: look at one or two old chunks for hidden cream, and simplify a little ahead of need.
  function maintain(hid) {
    const tris = iCount / 3;
    if (tris > maxTris * P.sweepFrom && chunks.length) {
      const m = tris > maxTris * 0.8 ? 2 : 1;
      for (let k = 0; k < m && chunks.length; k++) {
        cursor = (cursor + 1) % chunks.length;
        const c = chunks[cursor];
        if (!c.open && !c.busy) sweep(cursor, hid);
      }
    }
    let steps = 0;
    while (maxTris - iCount / 3 < P.reserve && steps++ < 6) if (!reduceOnce()) break;
  }

  function clear() {
    for (const c of chunks) { c.dead = true; if (c.open && spare.length < 2) spare.push(c.d); }
    chunks.length = 0; vPtr = 0; iCount = 0; cursor = 0; jig.length = 0;
    cur.length = 0; curI0 = Infinity; curI1 = 0;
    flush();
  }

  return {
    mesh, geo, chunks, newChunk, setCount, grow, box, close, frames, writeRings, squash, animate, makeRoom, maintain, flush, clear, relevel,
    get triangles() { return iCount / 3; },
    get bytes() { return pos.byteLength + nrm.byteLength + uv.byteLength + col.byteLength + idx.byteLength; },
    fullUpload() { fullV = true; fullI = true; upV = false; upI = false; },
    dispose() { geo.dispose(); },
  };
}
