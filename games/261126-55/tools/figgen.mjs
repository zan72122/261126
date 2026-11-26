// Figure generator: signed-distance sculpt -> surface nets mesh -> skin weights.
// Run: node tools/figgen.mjs  (writes tex/fig_<name>.bin)
// All units are meters. Figures face +Z, Y up. Rest pose is a relaxed A-pose.
import fs from 'node:fs';

// ---------------------------------------------------------------- vector helpers
const V = (x, y, z) => [x, y, z];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const mix = (a, b, t) => a + (b - a) * t;
const smin = (a, b, k) => { if (k <= 0) return Math.min(a, b); const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
const smax = (a, b, k) => -smin(-a, -b, k);

function rotY(a) { const c = Math.cos(a), s = Math.sin(a); return [c, 0, -s, 0, 1, 0, s, 0, c]; }
function rotX(a) { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, s, 0, -s, c]; }
function rotZ(a) { const c = Math.cos(a), s = Math.sin(a); return [c, s, 0, -s, c, 0, 0, 0, 1]; }
function mm(A, B) { const R = new Array(9); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) R[i * 3 + j] = A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]; return R; }
const mv = (M, p) => [M[0] * p[0] + M[1] * p[1] + M[2] * p[2], M[3] * p[0] + M[4] * p[1] + M[5] * p[2], M[6] * p[0] + M[7] * p[1] + M[8] * p[2]];

// ---------------------------------------------------------------- primitives
function sdRoundCone(p, a, b, r1, r2) {
  const ba = sub(b, a), l2 = dot(ba, ba), rr = r1 - r2, a2 = l2 - rr * rr, il2 = 1 / l2;
  const pa = sub(p, a), y = dot(pa, ba), z = y - l2;
  const q = sub(mul(pa, l2), mul(ba, y)); const x2 = dot(q, q);
  const y2 = y * y * l2, z2 = z * z * l2;
  const k = Math.sign(rr) * rr * rr * x2;
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
  if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
  return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}
function sdEll(p, c, r, M) {
  let q = sub(p, c); if (M) q = mv(M, q);
  const k0 = Math.hypot(q[0] / r[0], q[1] / r[1], q[2] / r[2]);
  const k1 = Math.hypot(q[0] / (r[0] * r[0]), q[1] / (r[1] * r[1]), q[2] / (r[2] * r[2]));
  return k1 < 1e-9 ? -Math.min(...r) : k0 * (k0 - 1) / k1;
}
function sdRBox(p, c, b, r, M) {
  let q = sub(p, c); if (M) q = mv(M, q);
  const dx = Math.abs(q[0]) - b[0] + r, dy = Math.abs(q[1]) - b[1] + r, dz = Math.abs(q[2]) - b[2] + r;
  return Math.hypot(Math.max(dx, 0), Math.max(dy, 0), Math.max(dz, 0)) + Math.min(Math.max(dx, dy, dz), 0) - r;
}
// torus around axis (ring at center c, normal n), major R minor r
function sdTorus(p, c, n, R, r) {
  const q = sub(p, c); const h = dot(q, n); const radial = sub(q, mul(n, h));
  return Math.hypot(len(radial) - R, h) - r;
}

// A part = list of ops evaluated in order: {op:'u'|'s'(subtract)|'i', k, f(p)->d, bone, mat}
class Sculpt {
  constructor() { this.ops = []; }
  add(f, bone, mat, k = 0.01, extra = {}) { this.ops.push({ op: 'u', f, bone, mat, k, ...extra }); return this; }
  cut(f, k = 0.004) { this.ops.push({ op: 's', f, k }); return this; }
  eval(p) {
    let d = 1e9;
    for (const o of this.ops) {
      const di = o.f(p);
      if (o.op === 'u') d = smin(d, di, o.k); else d = smax(d, -di, o.k);
    }
    return d;
  }
  // nearest union-primitive info for weights/material
  info(p) {
    const res = [];
    for (const o of this.ops) if (o.op === 'u') res.push([o.f(p), o.bone, o.mat, o.prio || 0]);
    return res;
  }
}

// ---------------------------------------------------------------- surface nets
function surfaceNets(S, bmin, bmax, h) {
  const nx = Math.ceil((bmax[0] - bmin[0]) / h) + 1, ny = Math.ceil((bmax[1] - bmin[1]) / h) + 1, nz = Math.ceil((bmax[2] - bmin[2]) / h) + 1;
  const F = new Float32Array(nx * ny * nz);
  const I = (x, y, z) => x + nx * (y + ny * z);
  for (let z = 0; z < nz; z++) for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++)
    F[I(x, y, z)] = S.eval([bmin[0] + x * h, bmin[1] + y * h, bmin[2] + z * h]);
  const vid = new Int32Array((nx - 1) * (ny - 1) * (nz - 1)).fill(-1);
  const C = (x, y, z) => x + (nx - 1) * (y + (ny - 1) * z);
  const pos = [];
  const corners = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  for (let z = 0; z < nz - 1; z++) for (let y = 0; y < ny - 1; y++) for (let x = 0; x < nx - 1; x++) {
    let mask = 0; const v = [];
    for (let c = 0; c < 8; c++) { const cc = corners[c]; const f = F[I(x + cc[0], y + cc[1], z + cc[2])]; v.push(f); if (f < 0) mask |= 1 << c; }
    if (mask === 0 || mask === 255) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, b] of edges) {
      if ((v[a] < 0) === (v[b] < 0)) continue;
      const t = v[a] / (v[a] - v[b]); const A = corners[a], B = corners[b];
      sx += A[0] + (B[0] - A[0]) * t; sy += A[1] + (B[1] - A[1]) * t; sz += A[2] + (B[2] - A[2]) * t; n++;
    }
    vid[C(x, y, z)] = pos.length / 3;
    pos.push(bmin[0] + (x + sx / n) * h, bmin[1] + (y + sy / n) * h, bmin[2] + (z + sz / n) * h);
  }
  const idx = [];
  for (let z = 1; z < nz - 1; z++) for (let y = 1; y < ny - 1; y++) for (let x = 1; x < nx - 1; x++) {
    const f0 = F[I(x, y, z)] < 0;
    // edge along +x : cells (x, y-1..y, z-1..z)
    if (x < nx - 1 && (F[I(x + 1, y, z)] < 0) !== f0) {
      const a = vid[C(x, y - 1, z - 1)], b = vid[C(x, y, z - 1)], c = vid[C(x, y, z)], d = vid[C(x, y - 1, z)];
      if (f0) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c);
    }
    if (y < ny - 1 && (F[I(x, y + 1, z)] < 0) !== f0) {
      const a = vid[C(x - 1, y, z - 1)], b = vid[C(x - 1, y, z)], c = vid[C(x, y, z)], d = vid[C(x, y, z - 1)];
      if (f0) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c);
    }
    if (z < nz - 1 && (F[I(x, y, z + 1)] < 0) !== f0) {
      const a = vid[C(x - 1, y - 1, z)], b = vid[C(x, y - 1, z)], c = vid[C(x, y, z)], d = vid[C(x - 1, y, z)];
      if (f0) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c);
    }
  }
  // project vertices onto the surface (1 newton step) and compute normals
  const N = new Float32Array(pos.length);
  const e = h * 0.5;
  for (let i = 0; i < pos.length; i += 3) {
    let p = [pos[i], pos[i + 1], pos[i + 2]];
    for (let it = 0; it < 2; it++) {
      const d = S.eval(p);
      const g = [S.eval([p[0] + e, p[1], p[2]]) - S.eval([p[0] - e, p[1], p[2]]), S.eval([p[0], p[1] + e, p[2]]) - S.eval([p[0], p[1] - e, p[2]]), S.eval([p[0], p[1], p[2] + e]) - S.eval([p[0], p[1], p[2] - e])];
      const gl = len(g) || 1; const nn = mul(g, 1 / gl);
      p = sub(p, mul(nn, clamp(d, -h * 0.5, h * 0.5)));
      if (it === 1) { N[i] = nn[0]; N[i + 1] = nn[1]; N[i + 2] = nn[2]; }
    }
    pos[i] = p[0]; pos[i + 1] = p[1]; pos[i + 2] = p[2];
  }
  return { pos: new Float32Array(pos), nrm: N, idx: pos.length / 3 > 65535 ? new Uint32Array(idx) : new Uint16Array(idx) };
}

function sdfAO(S, mesh, scale) {
  const n = mesh.pos.length / 3, ao = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const p = [mesh.pos[i * 3], mesh.pos[i * 3 + 1], mesh.pos[i * 3 + 2]], nn = [mesh.nrm[i * 3], mesh.nrm[i * 3 + 1], mesh.nrm[i * 3 + 2]];
    let occ = 0, w = 1;
    for (let k = 1; k <= 5; k++) { const h = scale * k; const d = S.eval(add(p, mul(nn, h))); occ += w * Math.max(0, h - d); w *= 0.6; }
    ao[i] = Math.round(clamp(1 - occ / (scale * 1.6), 0, 1) * 255);
  }
  return ao;
}
// weights + material per vertex
function skinInfo(S, mesh, softness = 0.012) {
  const n = mesh.pos.length / 3;
  const si = new Uint8Array(n * 4), sw = new Uint8Array(n * 4), mat = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const p = [mesh.pos[i * 3], mesh.pos[i * 3 + 1], mesh.pos[i * 3 + 2]];
    const info = S.info(p);
    let best = 1e9, bm = 0, bprio = -1;
    const wb = new Map();
    let dmin = 1e9; for (const [d] of info) dmin = Math.min(dmin, d);
    for (const [d, bone, m, prio] of info) {
      // material: closest primitive, priorities break near-ties (decals/stripes)
      const dd = d - prio * 0.0015;
      if (dd < best) { best = dd; bm = m; }
      if (bone >= 0) { const w = Math.exp(-(d - dmin) / softness); wb.set(bone, (wb.get(bone) || 0) + w); }
    }
    mat[i] = bm;
    const arr = [...wb.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    const tot = arr.reduce((s, a) => s + a[1], 0) || 1;
    let acc = 0;
    arr.forEach(([b, w], k) => { si[i * 4 + k] = b; const q = k === arr.length - 1 ? Math.max(0, 255 - acc) : Math.floor(w / tot * 255); sw[i * 4 + k] = q; acc += q; });
  }
  return { si, sw, mat };
}

// ---------------------------------------------------------------- humans
// bones: 0 hips 1 spine 2 chest 3 neck 4 head 5 shL 6 uaL 7 faL 8 handL 9 shR 10 uaR 11 faR 12 handR 13 thL 14 shinL 15 footL 16 thR 17 shinR 18 footR
const BONES = ['hips', 'spine', 'chest', 'neck', 'head', 'shL', 'uaL', 'faL', 'handL', 'shR', 'uaR', 'faR', 'handR', 'thL', 'shinL', 'footL', 'thR', 'shinR', 'footR'];
const PARENT = [-1, 0, 1, 2, 3, 2, 5, 6, 7, 2, 9, 10, 11, 0, 13, 14, 0, 16, 17];
// materials
const M = { SKIN: 0, TOP: 1, PANTS: 2, BOOTS: 3, HAIR: 4, STRIPE: 5, SOLE: 6, LIP: 7, TOP2: 8, BROW: 9 };

function human(P) {
  // P: proportions & outfit
  const s = new Sculpt();
  const J = {};
  const H = P.height;
  J.hips = V(0, P.hipY, 0);
  J.spine = V(0, P.waistY, -0.005 * H);
  J.chest = V(0, P.chestY, 0);
  J.neck = V(0, P.neckY, -0.01 * H);
  J.head = V(0, P.neckY + P.neckLen, -0.006 * H);
  const armAng = 0.42; // A-pose
  for (const side of [1, -1]) {
    const L = side > 0 ? 'L' : 'R';
    const sh = V(side * P.shoulderX * 0.45, P.shoulderY - 0.01 * H, -0.01 * H);
    const ua = V(side * P.shoulderX, P.shoulderY, -0.012 * H);
    const fa = add(ua, V(side * Math.sin(armAng) * P.upperArm, -Math.cos(armAng) * P.upperArm, 0.0));
    const ha = add(fa, V(side * Math.sin(armAng) * P.foreArm, -Math.cos(armAng) * P.foreArm, 0.012 * H));
    J['sh' + L] = sh; J['ua' + L] = ua; J['fa' + L] = fa; J['hand' + L] = ha;
    const th = V(side * P.hipX, P.hipY - 0.02 * H, 0);
    const kn = V(side * P.hipX * 0.92, P.kneeY, 0.008 * H);
    const an = V(side * P.hipX * 0.86, P.ankleY, -0.004 * H);
    J['th' + L] = th; J['shin' + L] = kn; J['foot' + L] = an;
  }
  const B = Object.fromEntries(BONES.map((b, i) => [b, i]));
  const T = P.top, tk = P.topThick; // clothing thickness

  // --- torso (jacket)
  const chestR = [P.chestW, P.chestD];
  s.add(p => sdEll(p, add(J.chest, V(0, 0.0, 0.004 * H)), [P.chestW, P.chestH, P.chestD]), B.chest, M.TOP, 0.0);
  s.add(p => sdEll(p, add(J.spine, V(0, 0, 0.006 * H)), [P.waistW, P.waistH, P.waistD]), B.spine, M.TOP, 0.06 * H);
  s.add(p => sdEll(p, add(J.hips, V(0, -0.005 * H, 0)), [P.hipW, P.hipH, P.hipD]), B.hips, P.longTop ? M.TOP : M.PANTS, 0.05 * H);
  if (P.belly) s.add(p => sdEll(p, add(J.spine, V(0, 0.01 * H, 0.03 * H)), [P.waistW * 0.85, P.waistH * 0.8, P.waistD * 0.7]), B.spine, M.TOP, 0.05 * H);
  // shoulders / trapezius
  for (const side of [1, -1]) {
    const L = side > 0 ? 'L' : 'R';
    s.add(p => sdRoundCone(p, add(J.neck, V(0, -0.02 * H, 0)), J['ua' + L], 0.03 * H * P.trap, 0.032 * H * P.armT), B['sh' + L], M.TOP, 0.03 * H);
  }
  // collar ridge (cloth thickness)
  s.add(p => sdTorus(p, add(J.neck, V(0, -0.002 * H, 0.004 * H)), [0, 0.97, 0.24], P.neckR * 1.25, 0.011 * H), B.chest, M.TOP, 0.006 * H, { prio: 1 });
  // jacket hem ridge
  if (false && P.hem) s.add(p => sdTorus(p, add(J.hips, V(0, P.hem * H, 0.003 * H)), [0, 1, 0], P.hipW * 1.02, 0.007 * H), B.hips, M.TOP, 0.012 * H, { prio: 1 });
  // zipper / placket ridge
  s.add(p => sdRoundCone(p, add(J.spine, V(0, -0.03 * H, P.waistD + 0.003 * H)), add(J.chest, V(0, 0.05 * H, P.chestD - 0.004 * H)), 0.0022 * H, 0.0022 * H), B.chest, M.TOP2, 0.004 * H, { prio: 2 });
  // chest pockets
  for (const side of [1, -1]) {
    s.add(p => sdRBox(p, add(J.chest, V(side * P.chestW * 0.5, -0.012 * H, P.chestD * 0.9)), [0.022 * H, 0.02 * H, 0.0035 * H], 0.003 * H, rotY(side * 0.35)), B.chest, M.TOP2, 0.006 * H, { prio: 1 });
  }
  // neck
  s.add(p => sdRoundCone(p, add(J.neck, V(0, -0.03 * H, 0)), add(J.head, V(0, 0.02 * H, 0.004 * H)), P.neckR, P.neckR * 0.92), B.neck, M.SKIN, 0.012 * H);

  // --- arms (sleeves) with fold rings near elbow
  for (const side of [1, -1]) {
    const L = side > 0 ? 'L' : 'R';
    const ua = J['ua' + L], fa = J['fa' + L], ha = J['hand' + L];
    const rU = 0.034 * H * P.armT, rE = 0.026 * H * P.armT, rW = 0.022 * H * P.armT;
    s.add(p => {
      let d = sdRoundCone(p, ua, fa, rU, rE);
      // folds: rings near elbow
      const ax = sub(fa, ua); const t = dot(sub(p, ua), ax) / dot(ax, ax);
      if (t > 0.55 && t < 1.05) d -= Math.sin(t * 46) * 0.0016 * H * Math.sin((t - 0.55) / 0.5 * Math.PI);
      return d;
    }, B['ua' + L], M.TOP, 0.02 * H);
    s.add(p => {
      let d = sdRoundCone(p, fa, add(ha, mul(sub(fa, ha), 0.06)), rE * 1.02, rW * 1.15);
      const ax = sub(ha, fa); const t = dot(sub(p, fa), ax) / dot(ax, ax);
      if (t > -0.05 && t < 0.4) d -= Math.sin(t * 40 + 1) * 0.0014 * H * Math.sin((t + 0.05) / 0.45 * Math.PI);
      return d;
    }, B['fa' + L], M.TOP, 0.012 * H);
    // cuff
    const cuff = add(ha, mul(sub(fa, ha), 0.08));
    s.add(p => sdTorus(p, cuff, mul(sub(ha, fa), 1 / len(sub(ha, fa))), rW * 1.1, 0.0055 * H), B['fa' + L], M.TOP, 0.006 * H, { prio: 1 });
    // reflective stripe on sleeves
    if (P.stripes) {
      const st = add(fa, mul(sub(ha, fa), 0.45)); const nn = mul(sub(ha, fa), 1 / len(sub(ha, fa)));
      s.add(p => sdTorus(p, st, nn, rE * 0.97, 0.0045 * H), B['fa' + L], M.STRIPE, 0.003 * H, { prio: 3 });
    }
    // wrist (skin bridge into the separate hand mesh)
    s.add(p => sdRoundCone(p, add(ha, mul(sub(fa, ha), 0.12)), add(ha, mul(sub(ha, fa), 0.12)), rW * 0.8, rW * 0.85), B['hand' + L], M.SKIN, 0.004 * H);
  }
  // --- legs (pants) + boots
  for (const side of [1, -1]) {
    const L = side > 0 ? 'L' : 'R';
    const th = J['th' + L], kn = J['shin' + L], an = J['foot' + L];
    const rT = 0.05 * H * P.legT, rK = 0.034 * H * P.legT, rA = 0.028 * H * P.legT;
    s.add(p => sdRoundCone(p, add(th, V(0, 0.03 * H, 0)), kn, rT, rK), B['th' + L], M.PANTS, 0.04 * H);
    s.add(p => {
      let d = sdRoundCone(p, kn, an, rK * 1.02, rA * 1.05);
      const ax = sub(an, kn); const t = dot(sub(p, kn), ax) / dot(ax, ax);
      if (t > -0.15 && t < 0.25) d -= Math.sin(t * 38) * 0.0018 * H * Math.cos(t / 0.25 * Math.PI * 0.5);
      return d;
    }, B['shin' + L], M.PANTS, 0.014 * H);
    // boots
    const bootTop = add(an, mul(sub(kn, an), P.bootH));
    const toe = add(an, V(side * 0.004 * H, -P.ankleY + 0.022 * H, P.footL * 0.72));
    const heel = add(an, V(0, -P.ankleY + 0.025 * H, -P.footL * 0.2));
    s.add(p => sdRoundCone(p, bootTop, add(an, V(0, -0.01 * H, 0)), rK * 1.12, rA * 1.25), B['shin' + L], M.BOOTS, 0.006 * H, { prio: 2 });
    s.add(p => sdTorus(p, bootTop, [0, 1, 0], rK * 1.12, 0.006 * H), B['shin' + L], M.BOOTS, 0.004 * H, { prio: 2 });
    s.add(p => sdRoundCone(p, heel, toe, 0.026 * H * P.footW, 0.028 * H * P.footW), B['foot' + L], M.BOOTS, 0.03 * H, { prio: 2 });
    s.add(p => sdRBox(p, add(an, V(side * 0.002 * H, -P.ankleY + 0.006 * H, P.footL * 0.26)), [0.031 * H * P.footW, 0.0065 * H, P.footL * 0.55], 0.006 * H), B['foot' + L], M.SOLE, 0.003 * H, { prio: 3 });
  }
  return { s, J };
}

function head(P) {
  // head local space: origin at head bone; face +Z
  const s = new Sculpt();
  const k = P.hs; // head scale
  const c = (x, y, z) => V(x * k, y * k, z * k);
  const HB = 4;
  s.add(p => sdEll(p, c(0, 0.11, -0.008), [0.082 * k * P.headW, 0.09 * k, 0.092 * k]), HB, M.SKIN, 0);
  s.add(p => sdEll(p, c(0, 0.072 - P.jaw * 0.02, 0.018), [0.066 * k * P.jawW, 0.062 * k * (1 + P.jaw * 0.25), 0.07 * k]), HB, M.SKIN, 0.03 * k);
  for (const sd of [1, -1]) {
    s.add(p => sdEll(p, c(sd * 0.036, 0.068, 0.05), [0.03 * k, 0.026 * k, 0.026 * k]), HB, M.SKIN, 0.02 * k); // cheeks
    // ears
    s.add(p => {
      const q = sub(p, c(sd * 0.081 * P.headW, 0.096, -0.006));
      const e = sdEll(q, [0, 0, 0], [0.011 * k, 0.026 * k, 0.018 * k], rotY(sd * 0.35));
      const inner = sdEll(q, [sd * 0.006 * k, 0, 0.002 * k], [0.008 * k, 0.018 * k, 0.012 * k], rotY(sd * 0.35));
      return smax(e, -inner, 0.003 * k);
    }, HB, M.SKIN, 0.008 * k);
  }
  s.add(p => sdEll(p, c(0, 0.036 - P.jaw * 0.012, 0.046), [0.026 * k * P.jawW, 0.022 * k, 0.024 * k]), HB, M.SKIN, 0.025 * k); // chin
  // nose
  s.add(p => sdRoundCone(p, c(0, 0.096, 0.07), c(0, 0.072, 0.084 + P.nose * 0.006), 0.006 * k, 0.0095 * k * (1 + P.nose * 0.3)), HB, M.SKIN, 0.012 * k);
  for (const sd of [1, -1]) s.add(p => sdEll(p, c(sd * 0.009, 0.071, 0.078), [0.0065 * k, 0.005 * k, 0.006 * k]), HB, M.SKIN, 0.006 * k);
  // brow ridge (soft)
  s.add(p => sdEll(p, c(0, 0.118, 0.06), [0.06 * k, 0.014 * k, 0.025 * k]), HB, M.SKIN, 0.02 * k);
  // philtrum / chin dimple softness (mouth itself is a live mesh in the browser)
  s.add(p => sdEll(p, c(0, 0.058, 0.07), [0.018 * k, 0.012 * k, 0.012 * k]), HB, M.SKIN, 0.012 * k);
  // eye sockets
  const er = P.eyeR;
  for (const sd of [1, -1]) {
    const ec = add(c(sd * P.eyeX, P.eyeY, 0), V(0, 0, P.eyeZ));
    s.cut(p => sdEll(p, ec, [er * 1.04, er * 0.98, er * 1.04]), 0.003 * k);
  }
  // neck stub (hidden in body neck)
  s.add(p => sdRoundCone(p, c(0, 0.0, -0.012), c(0, 0.05, -0.008), P.neckR * 0.9, P.neckR * 0.92), HB, M.SKIN, 0.02 * k);
  return s;
}

// hair (rigid to head) as its own sculpt
function grooveWrap(f, center, axis, freq, amp) {
  return p => {
    const q = sub(p, center); const h = dot(q, axis); const r = sub(q, mul(axis, h));
    const ang = Math.atan2(r[0] * axis[1] - r[1] * axis[0] + r[2] * 0.0001, r[2] + 1e-6 * (r[0] + 1));
    const a2 = Math.atan2(r[0], r[2]);
    const g = Math.sin(a2 * freq + Math.sin(a2 * freq * 0.37 + h * 30) * 1.2) * 0.6 + Math.sin(a2 * freq * 2.3 + 1.7) * 0.4;
    return f(p) - g * amp;
  };
}
function hairSculpt(P) {
  const s = new Sculpt();
  const _add = s.add.bind(s);
  const crown = V(0, 0.2 * P.hs, -0.02 * P.hs);
  s.add = (f, ...rest) => _add(grooveWrap(f, crown, [0, 1, 0], 46, 0.0011 * P.hs), ...rest); const k = P.hs; const c = (x, y, z) => V(x * k, y * k, z * k);
  const HB = 4;
  // cap shell (outside cranium), cut at face
  s.add(p => {
    const outer = sdEll(p, c(0, 0.118, -0.012), [0.089 * k * P.headW, 0.097 * k, 0.1 * k]);
    // face cut: plane-ish ellipsoid in front, hairline
    const face = sdEll(p, c(0, 0.06, 0.08), [0.07 * k, 0.085 * k, 0.07 * k]);
    // side burn cut below ears
    const low = (P.hairLen === 'short') ? (p[1] - 0.075 * k) : (p[1] - 0.02 * k);
    return smax(smax(outer, -face, 0.012 * k), -low, 0.01 * k);
  }, HB, M.HAIR, 0);
  if (P.bangs) {
    // bangs: several thick strands from crown sweeping down to brow
    for (let i = -3; i <= 3; i++) {
      const x = i * 0.0145, sw = i * 0.004;
      s.add(p => sdRoundCone(p, c(x * 0.7, 0.19, 0.035), c(x + sw, 0.128 - Math.abs(i) * 0.002, 0.086 - Math.abs(i) * 0.006), 0.012 * k, 0.0055 * k), HB, M.HAIR, 0.012 * k);
    }
  }
  if (P.pigtails) {
    for (const sd of [1, -1]) {
      // hair tie position behind ears; tails hang down
      const a = c(sd * 0.078, 0.075, -0.05), b = c(sd * 0.095, -0.03, -0.055), b2 = c(sd * 0.088, -0.075, -0.035);
      s.add(p => sdRoundCone(p, a, b, 0.024 * k, 0.019 * k), HB, M.HAIR, 0.02 * k);
      s.add(p => sdRoundCone(p, b, b2, 0.019 * k, 0.006 * k), HB, M.HAIR, 0.02 * k);
      s.add(p => sdTorus(p, c(sd * 0.081, 0.068, -0.051), [sd * 0.25, 0.95, 0.1], 0.016 * k, 0.0055 * k), HB, M.TOP2, 0.002 * k, { prio: 4 });
    }
  }
  if (P.bun) {
    s.add(p => sdEll(p, c(0, 0.15, -0.1), [0.042 * k, 0.038 * k, 0.036 * k]), HB, M.HAIR, 0.025 * k);
  }
  return s;
}

// hand (open, rigid on hand bone). local: wrist at origin, fingers toward -Y (hanging), palm facing +X (inward for left hand)
function handSculpt(P, side) {
  const s = new Sculpt(); const k = P.handS; const c = (x, y, z) => V(x * k * side, y * k, z * k);
  const HB = side > 0 ? 8 : 12;
  s.add(p => sdRBox(p, c(0, -0.045, 0.002), [0.011 * k, 0.04 * k, 0.034 * k], 0.01 * k), HB, M.SKIN, 0);
  s.add(p => sdRoundCone(p, c(0, 0.012, 0), c(0, -0.012, 0.0), 0.02 * k, 0.022 * k), HB, M.SKIN, 0.012 * k);
  const fingers = [[0.024, 0.042, 1.0], [0.008, 0.047, 1.08], [-0.008, 0.044, 1.0], [-0.023, 0.034, 0.82]];
  fingers.forEach(([z, l, f]) => {
    const base = c(0.0, -0.08, z);
    const mid = c(0.002, -0.08 - l * 0.55, z * 1.05);
    const tip = c(0.004, -0.08 - l, z * 1.08);
    const r = 0.0085 * f;
    s.add(p => sdRoundCone(p, base, mid, r * k, r * 0.92 * k), HB, M.SKIN, 0.006 * k);
    s.add(p => sdRoundCone(p, mid, tip, r * 0.9 * k, r * 0.78 * k), HB, M.SKIN, 0.004 * k);
  });
  // thumb
  s.add(p => sdRoundCone(p, c(0.006, -0.025, 0.03), c(0.014, -0.05, 0.052), 0.011 * k, 0.0095 * k), HB, M.SKIN, 0.01 * k);
  s.add(p => sdRoundCone(p, c(0.014, -0.05, 0.052), c(0.02, -0.07, 0.062), 0.0095 * k, 0.008 * k), HB, M.SKIN, 0.004 * k);
  return s;
}

// ---------------------------------------------------------------- dog (generic short-haired medium dog)
const DOGB = ['root', 'spine', 'chest', 'neck', 'head', 'flU', 'flL', 'frU', 'frL', 'blU', 'blL', 'brU', 'brL', 'tail1', 'tail2', 'jaw', 'earL', 'earR'];
const DOGP = [-1, 0, 1, 2, 3, 2, 5, 2, 7, 0, 9, 0, 11, 0, 13, 4, 4, 4];
function dog() {
  const s = new Sculpt();
  const J = {
    root: V(0, 0.42, -0.16), spine: V(0, 0.44, 0.0), chest: V(0, 0.44, 0.14), neck: V(0, 0.5, 0.22), head: V(0, 0.6, 0.27),
    flU: V(0.07, 0.4, 0.18), flL: V(0.07, 0.2, 0.17), frU: V(-0.07, 0.4, 0.18), frL: V(-0.07, 0.2, 0.17),
    blU: V(0.07, 0.42, -0.2), blL: V(0.075, 0.22, -0.24), brU: V(-0.07, 0.42, -0.2), brL: V(-0.075, 0.22, -0.24),
    tail1: V(0, 0.47, -0.27), tail2: V(0, 0.58, -0.3), jaw: V(0, 0.59, 0.33), earL: V(0.045, 0.68, 0.27), earR: V(-0.045, 0.68, 0.27),
  };
  const B = Object.fromEntries(DOGB.map((b, i) => [b, i]));
  const FUR = 0, CREAM = 1, NOSE = 2, EYEW = 3, DARK = 4;
  s.add(p => sdEll(p, V(0, 0.44, 0.0), [0.105, 0.11, 0.2]), B.spine, FUR, 0);
  s.add(p => sdEll(p, V(0, 0.43, 0.13), [0.11, 0.13, 0.11]), B.chest, FUR, 0.06);
  s.add(p => sdEll(p, V(0, 0.44, -0.17), [0.1, 0.105, 0.1]), B.root, FUR, 0.06);
  s.add(p => sdEll(p, V(0, 0.37, 0.12), [0.075, 0.08, 0.1]), B.chest, CREAM, 0.05, { prio: 1 }); // chest bib
  s.add(p => sdRoundCone(p, V(0, 0.46, 0.17), V(0, 0.58, 0.27), 0.075, 0.062), B.neck, FUR, 0.05);
  // head
  s.add(p => sdEll(p, V(0, 0.63, 0.28), [0.07, 0.068, 0.075]), B.head, FUR, 0.02);
  s.add(p => sdRoundCone(p, V(0, 0.615, 0.31), V(0, 0.6, 0.39), 0.045, 0.03), B.head, CREAM, 0.03, { prio: 1 });
  s.add(p => sdEll(p, V(0, 0.605, 0.415), [0.017, 0.013, 0.012]), B.head, NOSE, 0.006, { prio: 3 });
  s.add(p => sdRoundCone(p, V(0, 0.575, 0.31), V(0, 0.58, 0.37), 0.032, 0.022), B.jaw, CREAM, 0.012, { prio: 1 });
  for (const sd of [1, -1]) {
    const eb = sd > 0 ? B.earL : B.earR;
    // ears: flattened triangles (cones) slightly tilted
    s.add(p => {
      const d = sdRoundCone(p, V(sd * 0.042, 0.68, 0.265), V(sd * 0.06, 0.745, 0.255), 0.03, 0.006);
      const flat = Math.abs(p[2] - 0.262 - (p[1] - 0.68) * -0.1) - 0.012;
      return smax(d, flat, 0.006);
    }, eb, FUR, 0.012);
    // cheeks cream
    s.add(p => sdEll(p, V(sd * 0.04, 0.6, 0.33), [0.03, 0.025, 0.03]), B.head, CREAM, 0.02, { prio: 1 });
    // eyebrow spots
    s.add(p => sdEll(p, V(sd * 0.03, 0.66, 0.335), [0.012, 0.007, 0.008]), B.head, CREAM, 0.005, { prio: 2 });
  }
  // eye sockets
  for (const sd of [1, -1]) s.cut(p => sdEll(p, V(sd * 0.032, 0.638, 0.338), [0.014, 0.012, 0.013]), 0.004);
  // legs
  const legs = [['flU', 'flL', 1, 1], ['frU', 'frL', -1, 1], ['blU', 'blL', 1, -1], ['brU', 'brL', -1, -1]];
  for (const [u, l, sd, fr] of legs) {
    const top = J[u], mid = J[l], paw = add(mid, V(0, -0.18, fr > 0 ? 0.0 : 0.04));
    s.add(p => sdRoundCone(p, add(top, V(0, 0.03, 0)), mid, fr > 0 ? 0.04 : 0.05, 0.028), B[u], FUR, 0.04);
    s.add(p => sdRoundCone(p, mid, paw, 0.026, 0.022), B[l], fr > 0 ? CREAM : FUR, 0.01);
    s.add(p => sdEll(p, add(paw, V(0, -0.005, 0.02)), [0.03, 0.02, 0.04]), B[l], CREAM, 0.012, { prio: 1 });
  }
  // curled tail
  s.add(p => sdRoundCone(p, V(0, 0.47, -0.26), V(0, 0.58, -0.3), 0.032, 0.03), B.tail1, FUR, 0.03);
  s.add(p => sdTorus(p, V(0.01, 0.62, -0.23), [1, 0, 0], 0.06, 0.028), B.tail2, FUR, 0.02);
  return { s, J, mats: { FUR, CREAM, NOSE, EYEW, DARK } };
}

// ---------------------------------------------------------------- packing
function packParts(parts, meta) {
  for (const pt of parts) pt.ao = sdfAO(pt.S, pt.mesh, pt.aoScale || 0.012);
  // binary: [u32 jsonLen][json][pad to 4][arrays...]
  const chunks = []; let off = 0;
  const desc = [];
  for (const pt of parts) {
    const d = { name: pt.name, bone: pt.bone ?? -1, skinned: !!pt.skin, nv: pt.mesh.pos.length / 3, ni: pt.mesh.idx.length, i32: pt.mesh.idx instanceof Uint32Array };
    const qp = quantP(pt.mesh.pos); d.bmin = qp.bmin; d.bsize = qp.bsize;
    const arrs = [['pos', qp.q], ['nrm', quantN(pt.mesh.nrm)], ['idx', pt.mesh.idx], ['mat', pt.info.mat], ['ao', pt.ao]];
    if (pt.skin) arrs.push(['si', pt.info.si], ['sw', pt.info.sw]);
    d.arrays = {};
    for (const [k, a] of arrs) {
      const bytes = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
      const pad = (4 - (off % 4)) % 4; if (pad) { chunks.push(new Uint8Array(pad)); off += pad; }
      d.arrays[k] = [off, a.length]; chunks.push(bytes); off += bytes.length;
    }
    desc.push(d);
  }
  const json = Buffer.from(JSON.stringify({ ...meta, parts: desc }));
  const head = Buffer.alloc(4); head.writeUInt32LE(json.length);
  const jp = (4 - ((4 + json.length) % 4)) % 4;
  return Buffer.concat([head, json, Buffer.alloc(jp), ...chunks.map(c => Buffer.from(c.buffer, c.byteOffset, c.byteLength))]);
}
function quantP(p) {
  const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  for (let i = 0; i < p.length; i++) { mn[i % 3] = Math.min(mn[i % 3], p[i]); mx[i % 3] = Math.max(mx[i % 3], p[i]); }
  const sz = mx.map((v, i) => v - mn[i] || 1e-6);
  const q = new Uint16Array(p.length);
  for (let i = 0; i < p.length; i++) q[i] = Math.round((p[i] - mn[i % 3]) / sz[i % 3] * 65535);
  return { q, bmin: mn, bsize: sz };
}
function quantN(n) { const q = new Int8Array(n.length); for (let i = 0; i < n.length; i++) q[i] = Math.round(clamp(n[i], -1, 1) * 127); return q; }

function bboxOf(S, guess) { return guess; }

function buildHuman(name, P, out) {
  const t0 = Date.now();
  const { s, J } = human(P);
  const H = P.height;
  const body = surfaceNets(s, [-0.5 * H, -0.01, -0.25 * H], [0.5 * H, P.neckY + 0.06 * H, 0.25 * H], P.voxel);
  const binfo = skinInfo(s, body, 0.01 * H);
  // head in local space; place eyeballs so they sit 2mm proud of the (uncut) face surface
  const k = P.hs;
  { const h0 = head(P); h0.ops = h0.ops.filter(o => o.op === 'u'); let z = 0.2 * k; for (let it = 0; it < 80; it++) { const d = h0.eval([P.eyeX * k, P.eyeY * k, z]); z -= d; if (Math.abs(d) < 1e-6) break; } P.eyeZ = z - P.eyeR + 0.0024 * k; }
  const hs = head(P);
  const hm = surfaceNets(hs, [-0.12 * k, -0.04 * k, -0.12 * k], [0.12 * k, 0.22 * k, 0.12 * k], P.headVoxel);
  const hinfo = skinInfo(hs, hm);
  const parts = [
    { name: 'body', skin: true, mesh: body, info: binfo, S: s, aoScale: 0.012 * H },
    { name: 'head', bone: 4, mesh: hm, info: hinfo, S: hs, aoScale: 0.008 * k },
  ];
  if (P.hair) {
    const hr = hairSculpt(P);
    const hrm = surfaceNets(hr, [-0.13 * k, -0.1 * k, -0.16 * k], [0.13 * k, 0.24 * k, 0.13 * k], P.headVoxel * 1.25);
    parts.push({ name: 'hair', bone: 4, mesh: hrm, info: skinInfo(hr, hrm), S: hr, aoScale: 0.008 * k });
  }
  for (const side of [1, -1]) {
    const hsd = handSculpt(P, side); const kk = P.handS;
    const m = surfaceNets(hsd, [-0.05 * kk, -0.14 * kk, -0.05 * kk], [0.05 * kk, 0.04 * kk, 0.09 * kk], P.handVoxel);
    parts.push({ name: side > 0 ? 'handL' : 'handR', bone: side > 0 ? 8 : 12, mesh: m, info: skinInfo(hsd, m), S: hsd, aoScale: 0.006 * kk });
  }
  const prof = (y, x0, x1, n) => { const out = []; for (let i = 0; i < n; i++) { const x = mix(x0, x1, i / (n - 1)); let z = 0.2 * k; for (let it = 0; it < 60; it++) { const d = hs.eval([x, y, z]); z -= d; if (Math.abs(d) < 1e-5) break; } out.push(+z.toFixed(5)); } return out; };
  const meta = {
    mouthY: 0.052 * k, mouthProf: prof(0.052 * k, -0.04 * k, 0.04 * k, 17), mouthProf2: prof(0.04 * k, -0.04 * k, 0.04 * k, 17),
    browY: 0.123 * k, browProf: prof(0.123 * k, -0.06 * k, 0.06 * k, 17),
    kind: 'human', bones: BONES, parent: PARENT, joints: BONES.map(b => J[b]),
    eye: { r: P.eyeR, x: P.eyeX * P.hs, y: P.eyeY * P.hs, z: P.eyeZ }, hs: P.hs, height: H,
  };
  const buf = packParts(parts, meta);
  fs.writeFileSync(out, buf);
  console.log(name, parts.map(p => p.name + ':' + p.mesh.pos.length / 3).join(' '), (buf.length / 1024).toFixed(0) + 'KB', (Date.now() - t0) + 'ms');
}

const girl = {
  height: 1.10, hipY: 0.56, waistY: 0.66, chestY: 0.76, neckY: 0.86, neckLen: 0.035, shoulderY: 0.835, shoulderX: 0.115,
  hipX: 0.055, kneeY: 0.31, ankleY: 0.065, upperArm: 0.165, foreArm: 0.145, footL: 0.15, footW: 0.95,
  chestW: 0.11, chestH: 0.11, chestD: 0.078, waistW: 0.1, waistH: 0.1, waistD: 0.075, hipW: 0.105, hipH: 0.08, hipD: 0.08,
  trap: 0.9, armT: 0.95, legT: 1.0, neckR: 0.03, bootH: 0.45, hem: -0.01, stripes: true, longTop: false,
  hs: 1.0, headW: 1.0, jaw: 0, jawW: 0.98, nose: 0, eyeR: 0.0134, eyeX: 0.032, eyeY: 0.094, eyeZ: 0.0665,
  hair: true, bangs: true, pigtails: true, hairLen: 'long', handS: 0.72,
  voxel: 0.0068, headVoxel: 0.0029, handVoxel: 0.0021,
};
const papa = {
  height: 1.78, hipY: 0.93, waistY: 1.08, chestY: 1.3, neckY: 1.5, neckLen: 0.05, shoulderY: 1.45, shoulderX: 0.2,
  hipX: 0.09, kneeY: 0.5, ankleY: 0.085, upperArm: 0.3, foreArm: 0.27, footL: 0.27, footW: 0.85,
  chestW: 0.185, chestH: 0.17, chestD: 0.12, waistW: 0.165, waistH: 0.15, waistD: 0.12, hipW: 0.17, hipH: 0.12, hipD: 0.12,
  trap: 1.0, armT: 0.86, legT: 0.88, neckR: 0.06, bootH: 0.35, hem: -0.06, stripes: true, longTop: true, belly: true,
  hs: 1.18, headW: 0.98, jaw: 1, jawW: 1.1, nose: 1, eyeR: 0.0122, eyeX: 0.0275, eyeY: 0.094, eyeZ: 0.066 * 1.18 + 0.001,
  hair: true, bangs: false, pigtails: false, hairLen: 'short', handS: 1.12,
  voxel: 0.011, headVoxel: 0.0034, handVoxel: 0.003,
};
const mama = {
  ...papa, height: 1.62, hipY: 0.86, waistY: 1.0, chestY: 1.19, neckY: 1.36, neckLen: 0.05, shoulderY: 1.325, shoulderX: 0.165,
  hipX: 0.085, kneeY: 0.46, ankleY: 0.075, upperArm: 0.27, foreArm: 0.24, footL: 0.235, footW: 0.78,
  chestW: 0.15, chestH: 0.15, chestD: 0.105, waistW: 0.125, waistH: 0.13, waistD: 0.1, hipW: 0.16, hipH: 0.12, hipD: 0.12,
  trap: 0.85, armT: 0.78, legT: 0.84, neckR: 0.048, bootH: 0.12, hem: -0.13, stripes: false, longTop: true, belly: false,
  hs: 1.12, headW: 0.96, jaw: 0.3, jawW: 0.95, nose: 0.3, eyeZ: 0.066 * 1.12 + 0.001, eyeX: 0.029,
  bangs: true, bun: true, hairLen: 'long', handS: 1.0,
};
mama.eyeY = 0.094;

function buildDog(out) {
  const t0 = Date.now();
  const { s, J } = dog();
  const m = surfaceNets(s, [-0.2, 0.0, -0.42], [0.2, 0.8, 0.5], 0.0062);
  const info = skinInfo(s, m, 0.012);
  const meta = { kind: 'dog', bones: DOGB, parent: DOGP, joints: DOGB.map(b => J[b]), eye: { r: 0.0115, x: 0.032, y: 0.638, z: 0.338 } };
  const buf = packParts([{ name: 'body', skin: true, mesh: m, info, S: s, aoScale: 0.015 }], meta);
  fs.writeFileSync(out, buf);
  console.log('dog', m.pos.length / 3, (buf.length / 1024).toFixed(0) + 'KB', (Date.now() - t0) + 'ms');
}

const which = process.argv[2] || 'all';
if (which === 'probe') {
  const P = { girl, papa, mama }[process.argv[3] || 'girl'];
  const hs = head(P); const k = P.hs;
  hs.ops = hs.ops.filter(o => o.op === 'u');
  const surfZ = (x, y) => { let z = 0.2 * k; for (let it = 0; it < 80; it++) { const d = hs.eval([x, y, z]); z -= d; if (Math.abs(d) < 1e-6) break; } return z; };
  console.log('eye center surfaceZ', surfZ(P.eyeX * k, P.eyeY * k).toFixed(4), 'eyeZ', P.eyeZ, 'front', (P.eyeZ + P.eyeR).toFixed(4));
  for (let y = 0.03; y <= 0.15; y += 0.01) console.log(y.toFixed(2), [0, 0.016, 0.032, 0.048, 0.064].map(x => surfZ(x * k, y * k).toFixed(4)).join(' '));
}
const OUT = new URL('../tex/', import.meta.url).pathname;
if (which === 'all' || which === 'girl') buildHuman('girl', girl, OUT + 'fig_girl.bin');
if (which === 'all' || which === 'papa') buildHuman('papa', papa, OUT + 'fig_papa.bin');
if (which === 'all' || which === 'mama') buildHuman('mama', mama, OUT + 'fig_mama.bin');
if (which === 'all' || which === 'dog') buildDog(OUT + 'fig_dog.bin');
