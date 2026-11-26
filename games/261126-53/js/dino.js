// dinosaur skeletons (fossil bones) + dig layouts + small living diorama dinosaurs
import * as THREE from 'three';
import { pbr, tex, rng, clamp, lerp, smooth } from './core.js';
import { sweep, merge, xform, deform, setColor, fbm } from './geo.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

export const boneMat = pbr('bone', { repeat: 1, vertexColors: true });
boneMat.onBeforeCompile = sh => {
  sh.uniforms.glow = { value: 0 };
  boneMat.userData.sh = sh;
};
function white(g, fn) { return setColor(g, fn || ((v, c) => c.setRGB(1, 1, 1))); }

// ------------------------------------------------------------------ bone geometries (built along +x)
function longBone(len, r, o = {}) {
  const bow = o.bow ?? 0.03;
  const pts = [];
  for (let i = 0; i <= 6; i++) { const t = i / 6; pts.push(V(t * len, Math.sin(t * Math.PI) * bow * len, 0)); }
  const e0 = o.e0 ?? 1, e1 = o.e1 ?? 1;
  const g = sweep(pts, {
    segs: 26, radial: 14, capLen: 0.9, vScale: 3.5, uScale: 0.6,
    radius: t => { const k = 0.55 + 0.6 * e0 * Math.exp(-((t / 0.11) ** 2)) + 0.55 * e1 * Math.exp(-(((1 - t) / 0.11) ** 2)); return [r * k, r * k * (o.flat ?? 0.85)]; },
    shape: (t, a) => 1 + 0.2 * Math.cos(2 * a) * (Math.exp(-((t / 0.08) ** 2)) + Math.exp(-(((1 - t) / 0.08) ** 2))) + 0.05 * Math.sin(3 * a + t * 9),
  });
  return white(g, (v, c) => { const t = v.x / len; const end = Math.min(t, 1 - t); c.setScalar(0.9 + 0.1 * sstep(0, 0.2, end)); });
}
function vertebra(o = {}) {
  // unit size ~1 (scaled by mesh)
  const parts = [];
  const cen = sweep([V(-0.42, 0, 0), V(0.42, 0, 0)], {
    segs: 10, radial: 14, capLen: 0.45,
    radius: t => 0.36 + 0.12 * (Math.abs(t - 0.5) * 2) ** 2,
  });
  parts.push(white(cen));
  const sp = o.spine ?? 1;
  if (sp > 0) {
    const spine = sweep([V(0, 0.25, 0), V(-0.08, 0.75 * sp, 0), V(-0.2, 1.25 * sp, 0)], {
      segs: 8, radial: 10, radius: t => [0.2 * (1 - t * 0.35), 0.075 * (1 - t * 0.3)],
      up: V(1, 0, 0),
    });
    parts.push(white(spine, (v, c) => c.setScalar(0.92)));
  }
  const tr = o.trans ?? 1;
  if (tr > 0) for (const s of [-1, 1]) {
    parts.push(white(sweep([V(0, 0.22, 0.2 * s), V(0, 0.3, 0.55 * s * tr), V(-0.05, 0.28, 0.8 * s * tr)], { segs: 6, radial: 8, radius: t => 0.09 * (1 - t * 0.4) })));
  }
  if (o.chevron) parts.push(white(sweep([V(0, -0.25, 0), V(-0.1, -0.6, 0), V(-0.25, -0.85, 0)], { segs: 6, radial: 8, radius: t => [0.08 * (1 - t * 0.5), 0.05] })));
  // zygapophyses: small knobs front/back
  for (const s of [-1, 1]) for (const f of [-1, 1]) {
    const k = new THREE.SphereGeometry(0.07, 8, 6); xform(k, { p: V(0.32 * f, 0.38, 0.12 * s) }); parts.push(white(k));
  }
  return merge(parts);
}
function rib(len, side) {
  const pts = [V(0, 0, 0.02 * side), V(0, -0.1, 0.22 * side), V(0, -0.35, 0.36 * side), V(0, -0.62, 0.33 * side), V(0, -0.85, 0.2 * side), V(0, -0.95, 0.12 * side)]
    .map(p => p.multiplyScalar(len / 1.1));
  const g = sweep(pts, { segs: 24, radial: 9, radius: t => [0.016 * (1 - t * 0.6) * (1 + Math.exp(-((t / 0.06) ** 2))), 0.009 * (1 - t * 0.5)], up: V(1, 0, 0) });
  // rib head knob
  const h = new THREE.SphereGeometry(0.02, 10, 8); xform(h, { p: V(0, 0.004, 0.02 * side) });
  return merge([white(g), white(h)]);
}
function flatBone(len, wid, thick, curve = 0.1) {
  const pts = []; for (let i = 0; i <= 6; i++) { const t = i / 6; pts.push(V(t * len, Math.sin(t * Math.PI) * curve * len, 0)); }
  return white(sweep(pts, {
    segs: 18, radial: 14, capLen: 0.6, up: V(0, 1, 0),
    radius: t => [wid * (0.35 + 0.65 * Math.sin(Math.PI * (0.15 + t * 0.8))) * (t < 0.2 ? 0.6 + t * 2 : 1), thick * (1 - t * 0.4)],
  }));
}
function footBones(len, toes = 3, spread = 0.5) {
  const parts = [];
  for (let i = 0; i < toes; i++) {
    const a = (i - (toes - 1) / 2) * spread / Math.max(1, toes - 1) * 2;
    const meta = longBone(len * 0.55, len * 0.08, { bow: 0.02, flat: 0.8 });
    xform(meta, { r: new THREE.Euler(0, -a, 0) });
    parts.push(meta);
    const tx = Math.cos(a) * len * 0.57, tz = Math.sin(a) * len * 0.57;
    const ph = longBone(len * 0.28, len * 0.065, { bow: -0.05, flat: 0.8 });
    xform(ph, { p: V(tx, -0.004, tz), r: new THREE.Euler(0, -a, -0.25) });
    parts.push(ph);
    const nail = longBone(len * 0.16, len * 0.06, { bow: -0.1, e1: 0.2 });
    xform(nail, { p: V(tx + Math.cos(a) * len * 0.27, -0.02 * len * 2, tz + Math.sin(a) * len * 0.27), r: new THREE.Euler(0, -a, -0.6) });
    parts.push(nail);
  }
  return merge(parts);
}
// friendly rounded skull with a smiling jaw line
function skull(kind, L) {
  const g = new THREE.SphereGeometry(1, 48, 32);
  const cols = [];
  const pos = g.attributes.position;
  const col = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const nx = x, ny = y, nz = z;
    let shade = 1;
    const f = sstep(-0.2, 1.0, x);
    if (kind === 'duck') {
      y *= 1 - 0.45 * f; z *= 1 + 0.15 * f - (x > 0.85 ? 0 : 0);
      if (y > 0) y *= 1 + 0.55 * Math.exp(-(((x + 0.45) / 0.35) ** 2 + (z / 0.6) ** 2)); // round crest
    } else {
      y *= 1 - 0.3 * f; z *= 1 - 0.28 * f;
      if (y > 0) y *= 1 + 0.3 * sstep(0.4, -0.6, x);
    }
    // eye sockets: big round, soft
    for (const s of [-1, 1]) {
      const d = Math.hypot(nx + 0.25, ny - 0.28, nz - 0.78 * s);
      if (d < 0.42) { const k = (1 - (d / 0.42) ** 2); x *= 1 - 0.05 * k; y *= 1 - 0.05 * k; z *= 1 - 0.32 * k * k; shade *= 1 - 0.42 * k; }
      const dn = Math.hypot(nx - 0.62, ny - 0.5, nz - 0.32 * s);
      if (dn < 0.25) { const k = 1 - (dn / 0.25) ** 2; z *= 1 - 0.15 * k; y *= 1 - 0.12 * k; shade *= 1 - 0.35 * k; }
    }
    // smiling mouth line on both sides: low at the front, curling up at the back
    const yl = -0.32 + 0.34 * sstep(0.15, -0.55, nx) + (kind === 'duck' ? 0.08 * sstep(0.5, 1, nx) : 0);
    if (nx > -0.62 && Math.abs(nz) > 0.15) {
      const dd = Math.abs(ny - yl);
      if (dd < 0.07) { const k = 1 - (dd / 0.07) ** 2; const s = Math.sign(nz); z -= s * 0.07 * k; y -= 0.02 * k; shade *= 1 - 0.45 * k; }
    }
    shade *= 0.9 + 0.1 * (1 + fbm(nx * 3, ny * 3, nz * 3, 2));
    const hl = kind === 'duck' ? [0.17, 0.085, 0.08] : [0.15, 0.085, 0.075];
    pos.setXYZ(i, x * hl[0] * L, y * hl[1] * L, z * hl[2] * L);
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = shade;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  const parts = [g];
  // small rounded peg teeth along the front of the smile
  if (kind !== 'duck') for (const s of [-1, 1]) for (let k = 0; k < 4; k++) {
    const nx = 0.85 - k * 0.17;
    const yl = -0.32 + 0.34 * sstep(0.15, -0.55, nx);
    const tooth = white(sweep([V(0, 0.01, 0), V(0, -0.016, 0)], { segs: 2, radial: 8, radius: () => 0.0065, capLen: 1 }));
    const zz = Math.sqrt(Math.max(0, 1 - nx * nx - yl * yl)) * 0.075 * (1 - 0.28 * sstep(-0.2, 1, nx)) * 0.88;
    xform(tooth, { p: V(nx * 0.15 * L, (yl * 0.085 * (1 - 0.3 * sstep(-0.2, 1, nx)) - 0.004) * L, zz * s * L) });
    parts.push(tooth);
  }
  return merge(parts);
}
function plate(w, h, t) { // ilium-like plate
  const g = new THREE.SphereGeometry(1, 28, 18);
  deform(g, v => { v.x *= w; v.y *= h * (v.y > 0 ? 1 : 0.6); v.z *= t; v.y += Math.sin(v.x / w * 2) * h * 0.1; });
  return white(g);
}

// ------------------------------------------------------------------ species
const SPECIES = {
  long: {
    spine: [V(-1.6, 0.32, 0), V(-1.2, 0.5, 0), V(-0.75, 0.82, 0), V(-0.38, 1.0, 0), V(0, 1.06, 0), V(0.36, 1.02, 0), V(0.52, 1.1, 0), V(0.72, 1.4, 0), V(0.88, 1.72, 0), V(0.98, 1.9, 0)],
    tT: [0, 0.39], bT: [0.39, 0.6], nT: [0.6, 1],
    counts: { tail: 18, back: 9, neck: 9 }, sizes: { tail: [0.018, 0.075], back: 0.08, neck: [0.068, 0.046] },
    hip: V(-0.38, 0.86, 0.15), shoulder: V(0.34, 0.86, 0.15),
    hind: [0.42, 0.38, 0.14], fore: [0.38, 0.34, 0.12], skull: 'long', skullL: 1.0, ribs: 8, ribLen: 0.55,
  },
  duck: {
    spine: [V(-1.7, 0.6, 0), V(-1.2, 0.8, 0), V(-0.7, 1.0, 0), V(-0.3, 1.1, 0), V(0.1, 1.05, 0), V(0.42, 0.95, 0), V(0.6, 1.05, 0), V(0.74, 1.24, 0), V(0.86, 1.36, 0)],
    tT: [0, 0.44], bT: [0.44, 0.74], nT: [0.74, 1],
    counts: { tail: 20, back: 10, neck: 6 }, sizes: { tail: [0.02, 0.075], back: 0.078, neck: [0.06, 0.05] },
    hip: V(-0.3, 0.95, 0.15), shoulder: V(0.38, 0.8, 0.14),
    hind: [0.5, 0.45, 0.18], fore: [0.33, 0.32, 0.1], skull: 'duck', skullL: 1.05, ribs: 9, ribLen: 0.5,
  },
};
export const SPECIES_LIST = ['long', 'duck'];
export const ITEM_KEYS = ['skull', 'neck', 'back', 'ribs', 'hips', 'tail', 'arms', 'legs'];

function basis(xDir, upHint) {
  const x = xDir.clone().normalize();
  const z = new THREE.Vector3().crossVectors(x, upHint).normalize();
  if (z.lengthSq() < 1e-6) z.set(0, 0, 1);
  const y = new THREE.Vector3().crossVectors(z, x).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

const geoCache = {};
function cachedVert(kind) {
  if (!geoCache[kind]) geoCache[kind] = vertebra(kind === 'tail' ? { spine: 0.7, trans: 0.6, chevron: true } : kind === 'neck' ? { spine: 0.45, trans: 1.1 } : kind === 'tailEnd' ? { spine: 0, trans: 0 } : { spine: 1.1, trans: 1 });
  return geoCache[kind];
}

// returns { bones:[{geo, pos, quat, scale, item}], species }
export function buildSkeleton(spKey, scale = 1) {
  const S = SPECIES[spKey];
  const curve = new THREE.CatmullRomCurve3(S.spine, false, 'centripetal');
  const bones = [];
  const add = (item, geo, pos, quat, sc = 1) => bones.push({ item, geo, pos: pos.clone(), quat: quat.clone(), scale: typeof sc === 'number' ? V(sc, sc, sc) : sc });
  const clen = curve.getLength();
  const chain = (item, t0, t1, n, s0, s1, kind) => {
    const spacing = clen * (t1 - t0) / n;
    for (let i = 0; i < n; i++) {
      const t = lerp(t0, t1, (i + 0.5) / n);
      const p = curve.getPointAt(t), d = curve.getTangentAt(t);
      const s = Array.isArray(s0) ? lerp(s0[0], s0[1], (i + 0.5) / n) : s0;
      const k = kind === 'tail' && i < 4 ? 'tailEnd' : kind;
      const sx = Math.max(s, spacing * 0.9 / 0.84);
      add(item, cachedVert(k), p, basis(d, V(0, 1, 0)), V(sx, s, s));
    }
  };
  chain('tail', S.tT[0], S.tT[1], S.counts.tail, S.sizes.tail, 0, 'tail');
  chain('back', S.bT[0], S.bT[1], S.counts.back, S.sizes.back, 0, 'back');
  chain('neck', S.nT[0], S.nT[1], S.counts.neck, S.sizes.neck, 0, 'neck');
  // skull at neck tip
  const tipT = 1, tip = curve.getPointAt(tipT), tdir = curve.getTangentAt(tipT);
  const headDir = spKey === 'duck' ? V(0.85, -0.5, 0) : V(0.9, -0.42, 0);
  const sk = skull(S.skull, S.skullL);
  add('skull', sk, tip.clone().add(V(0.12, -0.02, 0)), basis(headDir, V(0, 1, 0)), 1);
  // ribs
  for (let i = 0; i < S.ribs; i++) {
    const t = lerp(S.bT[0] + 0.03, S.bT[1] - 0.02, i / (S.ribs - 1));
    const p = curve.getPointAt(t);
    const ln = S.ribLen * (0.7 + 0.3 * Math.sin(Math.PI * (0.25 + 0.75 * i / (S.ribs - 1))));
    for (const s of [-1, 1]) {
      add('ribs', rib(ln, s), p.clone().add(V(0, 0.02, 0)), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.25 + (i / S.ribs) * 0.15)), 1);
    }
  }
  // hips
  const hp = S.hip;
  for (const s of [-1, 1]) {
    add('hips', plate(0.2, 0.11, 0.022), V(hp.x, hp.y + 0.08, hp.z * s * 0.75), new THREE.Quaternion().setFromEuler(new THREE.Euler(0.12 * s, 0, 0)), 1);
    const pub = longBone(0.3, 0.025, { bow: 0.05, e1: 0.4 });
    add('hips', pub, V(hp.x + 0.02, hp.y - 0.02, hp.z * s * 0.6), basis(V(0.6, -0.8, 0), V(0, 0, 1)), 1);
    const isc = longBone(0.3, 0.022, { bow: -0.05, e1: 0.4 });
    add('hips', isc, V(hp.x - 0.04, hp.y - 0.02, hp.z * s * 0.6), basis(V(-0.6, -0.8, 0), V(0, 0, 1)), 1);
  }
  // legs (straight columns, slightly flexed)
  const leg = (item, top, L, fore) => {
    for (const s of [-1, 1]) {
      const a = V(top.x, top.y, top.z * s);
      const knee = a.clone().add(V(fore ? 0.04 : 0.05, -L[0], 0));
      const ank = knee.clone().add(V(fore ? -0.03 : -0.06, -L[1], 0));
      ank.y = Math.max(ank.y, 0.1);
      const up = V(0, 0, 1);
      const b1 = longBone(a.distanceTo(knee), fore ? 0.034 : 0.044, { bow: 0.04 });
      add(item, b1, a, basis(knee.clone().sub(a), up), 1);
      const b2 = longBone(knee.distanceTo(ank), fore ? 0.03 : 0.036, { bow: 0.02 });
      add(item, b2, knee, basis(ank.clone().sub(knee), up), 1);
      const ft = footBones(L[2], fore ? 4 : 3, fore ? 0.35 : 0.55);
      add(item, ft, V(ank.x, 0.035, ank.z * 1.05), basis(V(1, -0.22, 0), V(0, 1, 0)), 1);
      // fill between ankle and foot
      const tars = longBone(Math.max(0.02, ank.y - 0.03), 0.032, { bow: 0 });
      add(item, tars, ank, basis(V(0.15, -1, 0), up), 1);
      if (fore) { // shoulder blade
        add(item, flatBone(0.34, 0.07, 0.014, 0.12), V(top.x + 0.02, top.y + 0.02, top.z * s * 1.05), basis(V(-0.45, 0.9, 0), V(0, 0, 1)).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.15 * s, 0, 0))), 1);
      }
    }
  };
  leg('legs', S.hip, S.hind, false);
  leg('arms', S.shoulder, S.fore, true);
  if (scale !== 1) for (const b of bones) { b.pos.multiplyScalar(scale); b.scale.multiplyScalar(scale); }
  return { bones, species: spKey, S };
}

// ------------------------------------------------------------------ Fossil = meshes with dig pose & mount pose
// group per item; each bone mesh has userData.mount (pos,quat,scale in skeleton space) and userData.dig (in item space)
export class Fossil {
  constructor(spKey, seed) {
    this.spKey = spKey;
    this.sk = buildSkeleton(spKey);
    this.R = rng(seed);
    this.items = {};
    for (const key of ITEM_KEYS) this.items[key] = { key, group: new THREE.Group(), meshes: [], state: 'buried', center: V(0, 0, 0), samples: [] };
    for (const b of this.sk.bones) {
      const m = new THREE.Mesh(b.geo, boneMat);
      m.castShadow = true; m.receiveShadow = true;
      m.userData.mount = { pos: b.pos, quat: b.quat, scale: b.scale };
      m.userData.item = b.item;
      this.items[b.item].meshes.push(m);
      this.items[b.item].group.add(m);
    }
    for (const key of ITEM_KEYS) this.layoutItem(this.items[key]);
  }
  // lay bones flat in a compact cluster (as found in a bone bed)
  layoutItem(it) {
    const R = this.R;
    const chainy = ['neck', 'back', 'tail'].includes(it.key);
    const ents = it.meshes.map(m => {
      const g = m.geometry; if (!g.boundingBox) g.computeBoundingBox();
      const s = m.userData.mount.scale;
      const bb = g.boundingBox; const ext = bb.getSize(V()).multiply(s);
      // choose rotation that puts the thinnest axis up
      let q = new THREE.Quaternion();
      if (ext.z < ext.y) q.setFromEuler(new THREE.Euler(Math.PI / 2 * (R() < 0.5 ? 1 : -1), 0, 0));
      if (ext.x < Math.min(ext.y, ext.z)) q.setFromEuler(new THREE.Euler(0, 0, Math.PI / 2));
      return { m, ext, q, len: Math.max(ext.x, ext.y, ext.z) };
    });
    let x = 0, z = 0;
    if (chainy) {
      // articulated-ish curved chain
      // curled 'death pose': the chain lies along an arc so long necks/tails stay compact
      const total = ents.reduce((a, e) => a + e.ext.x * 0.95, 0);
      const A = Math.min(3.4, Math.max(0.4, total / 0.24)) * (R() < 0.5 ? 1 : -1);
      const Rr = total / Math.abs(A);
      let s = 0;
      for (const e of ents) {
        const mid = s + e.ext.x * 0.475;
        const th = (mid / total - 0.5) * A;
        e.p = V(Math.sin(th) * Rr, 0, (1 - Math.cos(th)) * Rr * Math.sign(A));
        e.yaw = -th + (R() - 0.5) * 0.12;
        s += e.ext.x * 0.95;
      }
    } else {
      // parallel-ish logs, longest first
      ents.sort((a, b) => b.len - a.len);
      let row = 0, rowZ = 0;
      const maxL = Math.min(0.62, ents[0].len + 0.02);
      let cx = -maxL / 2, rowW = 0;
      for (const e of ents) {
        const L = e.len * 0.95, Wd = Math.min(e.ext.x, e.ext.y, e.ext.z) < 0.05 && it.key === 'ribs' ? 0.05 : 0.06 + Math.min(e.ext.y, e.ext.z, e.ext.x) * 0.4 + (it.key === 'skull' ? 0.1 : 0);
        if (cx + L > maxL / 2 + 0.02 && cx > -maxL / 2) { cx = -maxL / 2; rowZ += rowW + 0.015; rowW = 0; }
        e.p = V(cx + L / 2, 0, rowZ + Wd / 2);
        e.yaw = (R() - 0.5) * 0.35;
        cx += L + 0.02; rowW = Math.max(rowW, Wd);
      }
      const zc = (rowZ + rowW) / 2; for (const e of ents) e.p.z -= zc;
    }
    if (chainy) { const c = ents.reduce((a, e) => a.add(e.p), V(0, 0, 0)).divideScalar(ents.length); for (const e of ents) e.p.sub(c); }
    // final local transforms; bottom rests at y=0
    let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
    for (const e of ents) {
      const yawQ = new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), e.yaw);
      // for orientation along x we need geometry's long axis = x (true for sweeps)
      const q = yawQ.multiply(e.q);
      const m = e.m;
      m.position.copy(e.p); m.quaternion.copy(q); m.scale.copy(m.userData.mount.scale);
      m.updateMatrix();
      const bb = m.geometry.boundingBox.clone().applyMatrix4(m.matrix);
      m.position.y -= bb.min.y;
      m.userData.dig = { pos: m.position.clone(), quat: m.quaternion.clone(), scale: m.scale.clone() };
      minX = Math.min(minX, bb.min.x); maxX = Math.max(maxX, bb.max.x); minZ = Math.min(minZ, bb.min.z); maxZ = Math.max(maxZ, bb.max.z);
    }
    it.extent = { x: (maxX - minX) / 2 + 0.03, z: (maxZ - minZ) / 2 + 0.03 };
  }
  // world samples of top-facing vertices for exposure tests
  computeSamples(it) {
    it.group.updateMatrixWorld(true);
    const out = [];
    const v = new THREE.Vector3(), n = new THREE.Vector3();
    for (const m of it.meshes) {
      const p = m.geometry.attributes.position, nr = m.geometry.attributes.normal;
      const nm = new THREE.Matrix3().getNormalMatrix(m.matrixWorld);
      const step = Math.max(1, Math.floor(p.count / 60));
      for (let i = 0; i < p.count; i += step) {
        n.fromBufferAttribute(nr, i).applyMatrix3(nm).normalize();
        if (n.y < 0.45) continue;
        v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld);
        out.push(v.clone());
      }
    }
    it.samples = out;
    // obstacle samples: all vertices
    const obs = [];
    for (const m of it.meshes) {
      const p = m.geometry.attributes.position;
      const step = 1;
      for (let i = 0; i < p.count; i += step) obs.push(v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld).clone());
    }
    return obs;
  }
}

// ------------------------------------------------------------------ small living dinosaurs (diorama-size)
const dinoSkin = pbr('dino', { repeat: 1.6, vertexColors: true, ns: 0.7 });
const eyeMatCache = {};
function eyeMat(col) {
  if (eyeMatCache[col]) return eyeMatCache[col];
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#2a1a0c'; g.fillRect(0, 0, 128, 128);
  const gr = g.createRadialGradient(64, 64, 6, 64, 64, 60);
  gr.addColorStop(0, '#050302'); gr.addColorStop(0.3, '#0b0603'); gr.addColorStop(0.36, col); gr.addColorStop(0.85, '#3b2410'); gr.addColorStop(1, '#1a0e06');
  g.fillStyle = gr; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill();
  for (let i = 0; i < 60; i++) { const a = Math.random() * 6.28; g.strokeStyle = `rgba(255,220,150,${Math.random() * 0.15})`; g.beginPath(); g.moveTo(64 + Math.cos(a) * 22, 64 + Math.sin(a) * 22); g.lineTo(64 + Math.cos(a) * 55, 64 + Math.sin(a) * 55); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.03 });
  eyeMatCache[col] = m; return m;
}
export class MiniDino {
  constructor(kind, R, tint) {
    this.kind = kind; this.R = R;
    this.root = new THREE.Group();
    this.body = new THREE.Group(); this.root.add(this.body);
    const long = kind === 'long';
    const L = long ? 0.42 : 0.36;
    // spine of the body (x forward)
    const sp = long
      ? [V(-0.62, 0.12, 0), V(-0.4, 0.26, 0), V(-0.15, 0.38, 0), V(0.05, 0.42, 0), V(0.2, 0.42, 0), V(0.32, 0.56, 0), V(0.4, 0.78, 0), V(0.47, 0.9, 0)]
      : [V(-0.62, 0.3, 0), V(-0.38, 0.4, 0), V(-0.12, 0.46, 0), V(0.08, 0.44, 0), V(0.2, 0.4, 0), V(0.3, 0.5, 0), V(0.38, 0.56, 0)];
    const pts = sp.map(p => p.clone().multiplyScalar(L));
    const rad = long
      ? t => { const body = Math.exp(-(((t - 0.42) / 0.17) ** 2)) * 0.12; const neck = 0.03 + 0.012 * (1 - t); const tail = t < 0.35 ? 0.006 + t * 0.13 : 0; return Math.max(body, neck, tail) * L / 0.42; }
      : t => { const body = Math.exp(-(((t - 0.47) / 0.18) ** 2)) * 0.105; const neck = 0.036; const tail = t < 0.38 ? 0.008 + t * 0.12 : 0; return Math.max(body, neck, tail) * L / 0.36; };
    const g = sweep(pts, { segs: 48, radial: 18, radius: t => { const r = rad(t); return [r, r * 1.08]; }, up: V(0, 1, 0), capLen: 0.8 });
    // head: separate rounded shape at the end
    const tipP = pts[pts.length - 1], tipD = pts[pts.length - 1].clone().sub(pts[pts.length - 2]).normalize();
    const hs = long ? 0.036 : 0.042;
    const head = new THREE.SphereGeometry(1, 28, 20);
    deform(head, v => { const f = sstep(-0.3, 1, v.x); v.y *= 1 - 0.32 * f; v.z *= 1 - 0.25 * f; if (kind !== 'long') { v.z *= 1 + 0.25 * sstep(0.4, 1, v.x); v.y *= 1 - 0.2 * sstep(0.4, 1, v.x); } v.x *= 1.6; v.multiplyScalar(hs); });
    const headQ = basis(V(1, long ? -0.35 : -0.2, 0), V(0, 1, 0));
    xform(head, { r: headQ, p: tipP.clone().addScaledVector(tipD, hs * 0.6).add(V(hs * 0.5, -hs * 0.2, 0)) });
    const bodyGeo = merge([g, (() => { head.setAttribute('aT', new THREE.Float32BufferAttribute(new Float32Array(head.attributes.position.count).fill(1), 1)); return head; })()], true);
    const base = tint || new THREE.Color().setHSL(0.22 + R() * 0.08, 0.32, 0.36);
    const belly = new THREE.Color(0.85, 0.78, 0.6);
    setColor(bodyGeo, (v, c) => {
      const up = clamp((v.y - (0.4 * L)) / (0.1 * L), -1, 1);
      const k = sstep(0.4, -0.6, up);
      c.copy(base).lerp(belly, k * 0.65);
      // soft back stripes
      const s = Math.sin(v.x / L * 26) * 0.5 + 0.5;
      c.multiplyScalar(1 - 0.18 * s * sstep(0, 0.8, up));
    });
    this.mesh = new THREE.Mesh(bodyGeo, dinoSkin);
    this.mesh.castShadow = true; this.mesh.receiveShadow = true;
    this.body.add(this.mesh);
    this.headPos = tipP.clone().addScaledVector(tipD, hs * 0.6).add(V(hs * 0.5, -hs * 0.2, 0));
    // eyes + friendly smile
    const eye = eyeMat(long ? '#6b4a22' : '#5a3d1a');
    for (const s of [-1, 1]) {
      const eg = new THREE.SphereGeometry(hs * 0.26, 16, 12); eg.rotateY(-Math.PI / 2);
      const e = new THREE.Mesh(eg, eye); e.scale.setScalar(1.3);
      const lp = V(0.0 * hs, 0.36 * hs, 0.6 * hs * s).applyQuaternion(headQ).add(this.headPos);
      e.position.copy(lp); e.lookAt(lp.clone().add(V(0.35, 0.05, s * 1).normalize()));
      this.body.add(e);
      // eyelid ridge
      const lid = new THREE.Mesh(new THREE.SphereGeometry(hs * 0.3, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.42), dinoSkin);
      setColor(lid.geometry, (v, c) => c.copy(base || new THREE.Color(0.35, 0.4, 0.25)).multiplyScalar(0.9));
      lid.position.copy(lp); lid.rotation.set(-0.3 * s, 0, 0.25);
      this.body.add(lid);
    }
    const smile = sweep([V(0.5, -0.32, 0.5), V(0.85, -0.38, 0.32), V(1.05, -0.33, 0)].map(p => p.multiplyScalar(hs).applyQuaternion(headQ).add(this.headPos)), { segs: 8, radial: 5, radius: () => hs * 0.04 });
    const smile2 = smile.clone(); smile2.scale(1, 1, -1); smile2.index.array.reverse();
    const smMat = new THREE.MeshStandardMaterial({ color: 0x2b1a10, roughness: 0.7 });
    this.body.add(new THREE.Mesh(smile, smMat), new THREE.Mesh(smile2, smMat));
    // legs
    this.legs = [];
    const legMat = dinoSkin;
    const legDefs = long
      ? [[-0.12, 0.075, 1, 0.5], [-0.12, -0.075, 1, 0], [0.2, 0.07, 0.95, 0], [0.2, -0.07, 0.95, 0.5]]
      : [[-0.1, 0.07, 1.25, 0.5], [-0.1, -0.07, 1.25, 0], [0.2, 0.06, 0.6, 0], [0.2, -0.06, 0.6, 0.5]];
    for (const [lx, lz, lh, ph] of legDefs) {
      const hipY = (long ? 0.36 : 0.36) * L;
      const piv = new THREE.Group(); piv.position.set(lx * L, hipY, lz * L);
      const lr = (long ? 0.034 : (lh > 1 ? 0.04 : 0.024)) * L / 0.42;
      const lg = sweep([V(0, 0.05 * L, 0), V(0.01 * L, -hipY * 0.45, 0), V(-0.004, -hipY + 0.012, 0)], { segs: 10, radial: 12, radius: t => lr * (1.35 - 0.55 * Math.min(1, t * 1.6) + 0.1 * Math.exp(-(((t - 0.55) / 0.12) ** 2))) });
      setColor(lg, (v, c) => c.copy(base).multiplyScalar(0.92));
      const foot = new THREE.SphereGeometry(lr * 1.15, 14, 8);
      deform(foot, v => { v.x *= long ? 1.15 : 1.7; v.y *= 0.5; if (v.y < 0) v.y *= 0.3; });
      foot.translate(0.008, -hipY + 0.008, 0);
      setColor(foot, (v, c) => c.copy(base).multiplyScalar(0.8));
      const legGeo = merge([lg, foot]);
      const lm = new THREE.Mesh(legGeo, legMat); lm.castShadow = true;
      piv.add(lm);
      this.body.add(piv);
      this.legs.push({ piv, ph, lz, lx, planted: true, foot: V() });
    }
    this.L = L;
    this.walkPhase = R() * 6;
    this.speed = 0; this.yaw = R() * 6.28; this.target = null; this.idleT = 0;
    this.happy = 0; this.look = 0;
    this.prevPlant = [true, true, true, true];
    this.root.scale.setScalar(1);
  }
}
