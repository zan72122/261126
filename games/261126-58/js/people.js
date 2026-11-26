// Procedural people: sculpted head (displaced sphere), eyes with lids & lashes, brows,
// painted mouth decal, clumped hair, knit/woven clothes with folds, IK arms and hands.
import * as THREE from 'three';
import { texSet, canvasTex } from './tex.js';

const V3 = THREE.Vector3;
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ------------------------------------------------------------------ head shape
function headDeform(cfg) {
  const bumps = [
    // [dir, sigma, amp]
    [[0.55, -0.36, 0.76], 0.28, cfg.cheek],          // cheeks
    [[-0.55, -0.36, 0.76], 0.28, cfg.cheek],
    [[0.36, 0.1, 0.93], 0.12, -cfg.socket],          // eye sockets
    [[-0.36, 0.1, 0.93], 0.12, -cfg.socket],
    [[0.35, 0.27, 0.9], 0.16, cfg.brow],             // brow ridge
    [[-0.35, 0.27, 0.9], 0.16, cfg.brow],
    [[0, -0.12, 1], 0.075, cfg.nose],                // nose tip
    [[0, 0.02, 1], 0.06, cfg.nose * 0.45 * cfg.bridge], // bridge
    [[0, 0.12, 1], 0.07, cfg.nose * 0.2 * cfg.bridge],
    [[0.1, -0.17, 0.98], 0.05, cfg.nose * 0.35],     // nostril wings
    [[-0.1, -0.17, 0.98], 0.05, cfg.nose * 0.35],
    [[0, -0.34, 0.94], 0.12, cfg.lips],              // muzzle / lips
    [[0, -0.43, 0.9], 0.05, -cfg.lips * 0.35],       // mouth line
    [[0, -0.7, 0.72], 0.16, cfg.chin],               // chin
    [[0, -0.24, 0.97], 0.04, -cfg.lips * 0.25],      // philtrum
  ].map(([d, s, a]) => [new V3(...d).normalize(), s, a]);
  return (dir, out) => {
    const { a, b, c } = cfg;
    let x = dir.x * a, y = dir.y * b, z = dir.z * c;
    if (dir.z < 0) z *= cfg.back;
    const lower = sstep(0.05, -0.95, dir.y);
    x *= 1 - cfg.jaw * Math.pow(lower, 1.4);
    z *= 1 - (dir.z < 0 ? 0.3 : 0.08) * lower;
    // flatten face front slightly, round forehead
    if (dir.z > 0) z *= 1 - 0.06 * Math.pow(Math.abs(dir.x), 2) ;
    // crown higher for kids
    if (dir.y > 0) y *= 1 + cfg.crown * dir.y * dir.y;
    const r = Math.hypot(x, y, z);
    let add = 0;
    for (const [d, s, amp] of bumps) {
      const dd = dir.distanceToSquared(d);
      add += amp * Math.exp(-dd / (2 * s * s));
    }
    out.set(x, y, z).multiplyScalar((r + add) / r);
    return out;
  };
}

function skinCanvas(cfg) {
  return canvasTex(512, 256, (g, w, h) => {
    const base = cfg.skin; // [r,g,b] 0..255
    g.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`; g.fillRect(0, 0, w, h);
    // UV: u = phi (face at u=0.25 for +z), v = 1 - theta/pi (top v=1 -> canvas y=0)
    const P = (dx, dy) => [w * (0.25 + dx), h * dy];
    const blob = (cx, cy, rx, ry, col, a) => {
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
      gr.addColorStop(0, col.replace('A', a)); gr.addColorStop(1, col.replace('A', 0));
      g.save(); g.translate(cx, cy); g.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry)); g.translate(-cx, -cy);
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, Math.max(rx, ry), 0, 7); g.fill(); g.restore();
    };
    // mottling
    for (let i = 0; i < 400; i++) blob(Math.random() * w, Math.random() * h, 6 + Math.random() * 18, 6 + Math.random() * 18, 'rgba(150,70,60,A)', 0.025);
    // cheek blush
    const bl = cfg.blush;
    for (const s of [-1, 1]) { const [x, y] = P(s * 0.085, 0.6); blob(x, y, 34, 26, 'rgba(225,95,90,A)', bl); }
    // nose tip and ears warmer
    { const [x, y] = P(0, 0.54); blob(x, y, 12, 10, 'rgba(215,100,90,A)', bl * 0.7); }
    // under-eye / lids slight darker-warm
    for (const s of [-1, 1]) { const [x, y] = P(s * 0.06, 0.465); blob(x, y, 20, 9, 'rgba(150,80,80,A)', 0.12); }
    // baked soft creases: upper-lid fold, under-nose, under lower lip, jaw shadow
    for (const s of [-1, 1]) { const [x, y] = P(s * 0.06, 0.43); blob(x, y, 24, 8, 'rgba(120,60,55,A)', 0.18); }
    { const [x, y] = P(0, 0.575); blob(x, y, 14, 5, 'rgba(120,55,50,A)', 0.2); }
    { const [x, y] = P(0, 0.67); blob(x, y, 20, 6, 'rgba(130,60,55,A)', 0.16); }
    for (const s of [-1, 1]) { const [x, y] = P(s * 0.03, 0.585); blob(x, y, 10, 16, 'rgba(140,70,60,A)', 0.1); }
    // nostrils
    for (const s of [-1, 1]) { const [x, y] = P(s * 0.016, 0.555); blob(x, y, 4, 2.5, 'rgba(70,30,25,A)', 0.55); }
    // beard shadow
    if (cfg.beard) {
      for (let i = 0; i < 2200; i++) {
        const a = Math.random() * Math.PI - Math.PI / 2 + Math.PI / 2;
        const dx = (Math.random() - 0.5) * 0.25, dy = 0.6 + Math.random() * 0.22;
        if (Math.abs(dx) < 0.03 && dy < 0.64) continue;
        if (dy < 0.62 && Math.abs(dx) > 0.09) continue;
        const [x, y] = P(dx, dy); g.fillStyle = `rgba(40,28,22,${0.08 + Math.random() * 0.1})`; g.fillRect(x, y, 1.2, 1.2);
        void a;
      }
    }
  });
}

// mouth decal painter
function drawMouth(g, w, h, m, cfg) {
  g.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h * 0.5;
  const lw = w * 0.22 * (cfg.mouthW || 1) * (1 + 0.18 * m.smile + 0.1 * m.wide - 0.25 * m.pucker);
  const open = m.open;
  const curve = m.smile * h * 0.16;   // corners up
  const lipCol = cfg.lip || [205, 105, 100];
  const L = (a) => `rgba(${lipCol[0]},${lipCol[1]},${lipCol[2]},${a})`;
  // lips tint
  for (let k = 0; k < 4; k++) {
    g.fillStyle = L(0.12);
    g.beginPath(); g.ellipse(cx, cy - h * 0.06 - curve * 0.2, lw * (1.05 - k * 0.08), h * (0.1 + open * 0.15) * (1 - k * 0.15), 0, Math.PI, 0); g.fill();
    g.beginPath(); g.ellipse(cx, cy + h * 0.04 + open * h * 0.18 - curve * 0.2, lw * (0.95 - k * 0.08), h * (0.13 + open * 0.08) * (1 - k * 0.15), 0, 0, Math.PI); g.fill();
  }
  const top = (x) => { const t = (x - cx) / lw; return cy - curve * (t * t) - open * h * 0.12 * (1 - t * t) * (1 + 0.3 * m.smile); };
  const bot = (x) => { const t = (x - cx) / lw; return cy - curve * (t * t) + open * h * 0.42 * Math.pow(1 - t * t, 0.8) * (1 - 0.2 * m.smile * t * t) + curve * 0.25 * (1 - t * t) * open; };
  if (open > 0.04) {
    g.beginPath();
    for (let i = 0; i <= 30; i++) { const x = cx - lw + 2 * lw * i / 30; i ? g.lineTo(x, top(x)) : g.moveTo(x, top(x)); }
    for (let i = 30; i >= 0; i--) { const x = cx - lw + 2 * lw * i / 30; g.lineTo(x, bot(x)); }
    g.closePath();
    const gr = g.createLinearGradient(0, cy - h * 0.1, 0, cy + h * 0.4);
    gr.addColorStop(0, 'rgb(70,22,22)'); gr.addColorStop(1, 'rgb(40,10,12)');
    g.fillStyle = gr; g.fill();
    g.save(); g.clip();
    // teeth
    if (open > 0.15) { g.fillStyle = 'rgba(245,240,232,0.95)'; g.beginPath(); g.ellipse(cx, top(cx) + 1, lw * 0.72, h * 0.07 * Math.min(1, open * 2), 0, 0, Math.PI); g.fill(); }
    // tongue
    g.fillStyle = 'rgba(210,95,100,0.95)'; g.beginPath(); g.ellipse(cx, bot(cx) - h * 0.02, lw * 0.55, h * 0.12 * open + 2, 0, Math.PI, 0); g.fill();
    g.restore();
  }
  // lip line / opening rim
  g.lineCap = 'round';
  for (const [wd, a] of [[5, 0.12], [3, 0.25], [1.6, 0.55]]) {
    g.strokeStyle = `rgba(95,35,35,${a})`; g.lineWidth = wd;
    g.beginPath(); for (let i = 0; i <= 30; i++) { const x = cx - lw + 2 * lw * i / 30; i ? g.lineTo(x, top(x)) : g.moveTo(x, top(x)); } g.stroke();
    if (open > 0.04) { g.beginPath(); for (let i = 0; i <= 30; i++) { const x = cx - lw + 2 * lw * i / 30; i ? g.lineTo(x, bot(x)) : g.moveTo(x, bot(x)); } g.stroke(); }
  }
  // dimples at corners when smiling
  if (m.smile > 0.3) for (const s of [-1, 1]) {
    g.strokeStyle = `rgba(120,60,50,${0.18 * m.smile})`; g.lineWidth = 2;
    const x = cx + s * lw * 1.08, y = top(cx + s * lw);
    g.beginPath(); g.arc(x - s * 6, y + 2, 7, s > 0 ? -0.9 : Math.PI - 0.6, s > 0 ? 0.6 : Math.PI + 0.9); g.stroke();
  }
  // lower lip highlight
  g.fillStyle = 'rgba(255,230,225,0.12)'; g.beginPath(); g.ellipse(cx, (open > 0.04 ? bot(cx) : cy) + h * 0.08, lw * 0.4, h * 0.03, 0, 0, 7); g.fill();
}

// ------------------------------------------------------------------ tube helper (custom radius profile, flattened)
function tubeAlong(points, radiusFn, radial = 8, flat = 1, upHint) {
  const curve = new THREE.CatmullRomCurve3(points);
  const segs = Math.max(4, points.length * 3);
  const frames = curve.computeFrenetFrames(segs, false);
  const pos = [], nor = [], uv = [], idx = [];
  const P = new V3(), N = new V3(), B = new V3();
  for (let i = 0; i <= segs; i++) {
    const t = i / segs; curve.getPointAt(t, P);
    let n = frames.normals[i], b = frames.binormals[i];
    if (upHint) { const T = frames.tangents[i]; b = new V3().crossVectors(T, upHint).normalize(); if (b.lengthSq() < 0.5) b = frames.binormals[i]; n = new V3().crossVectors(b, T).normalize(); }
    const r = radiusFn(t);
    for (let j = 0; j <= radial; j++) {
      const a = j / radial * Math.PI * 2;
      const cs = Math.cos(a), sn = Math.sin(a);
      N.copy(n).multiplyScalar(cs).addScaledVector(b, sn);
      const off = new V3().copy(n).multiplyScalar(cs * r).addScaledVector(b, sn * r * flat);
      pos.push(P.x + off.x, P.y + off.y, P.z + off.z);
      nor.push(N.x, N.y, N.z); uv.push(t, j / radial);
    }
  }
  for (let i = 0; i < segs; i++) for (let j = 0; j < radial; j++) {
    const a = i * (radial + 1) + j, b2 = a + radial + 1;
    idx.push(a, b2, a + 1, b2, b2 + 1, a + 1);
  }
  return { pos, nor, uv, idx };
}
function mergeParts(parts) {
  const pos = [], nor = [], uv = [], idx = []; let off = 0;
  for (const p of parts) { pos.push(...p.pos); nor.push(...p.nor); uv.push(...p.uv); for (const i of p.idx) idx.push(i + off); off += p.pos.length / 3; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

// body of revolution with elliptical, per-height sections; folds added by fn
function loftBody(rings, seg = 40, folds) {
  // rings: [{y, rx, rz, cz}]
  const pos = [], uv = [], idx = [];
  for (let i = 0; i < rings.length; i++) {
    const r = rings[i];
    for (let j = 0; j <= seg; j++) {
      const a = j / seg * Math.PI * 2;
      let x = Math.sin(a) * r.rx, z = Math.cos(a) * r.rz + (r.cz || 0);
      // squarer back/shoulders
      const sq = r.sq || 0;
      x *= 1 + sq * (Math.abs(Math.cos(a)) * 0.0 + 0.08 * Math.cos(2 * a) ** 2);
      let y = r.y;
      if (folds) { const f = folds(r.y, a, i / (rings.length - 1)); x += Math.sin(a) * f; z += Math.cos(a) * f; }
      pos.push(x, y, z); uv.push(j / seg * 2, r.y * 3);
    }
  }
  for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < seg; j++) {
    const a = i * (seg + 1) + j, b = a + seg + 1;
    idx.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

// sleeve / limb segment along +Y from 0..len, radius r0->r1, with cloth wrinkles
function limbGeometry(len, r0, r1, wrinkle = 0.0, seed = 1, cap = true) {
  const segL = 14, segR = 20;
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= segL; i++) {
    const t = i / segL, y = t * len;
    let r = r0 + (r1 - r0) * t;
    if (cap) r *= Math.sqrt(Math.max(0.02, 1 - Math.pow(Math.abs(t - 0.5) * 2, 8) * 0.4));
    for (let j = 0; j <= segR; j++) {
      const a = j / segR * Math.PI * 2;
      const w = wrinkle * (Math.sin(t * 19 + a * 2 + seed) * 0.5 + Math.sin(t * 31 - a * 3 + seed * 2) * 0.3 + Math.sin(a * 5 + t * 7) * 0.2) * (0.6 + 0.4 * Math.sin(t * Math.PI));
      const rr = r * (1 + w);
      pos.push(Math.sin(a) * rr, y, Math.cos(a) * rr); uv.push(j / segR * 1.5, t * len * 6);
    }
  }
  for (let i = 0; i < segL; i++) for (let j = 0; j < segR; j++) { const a = i * (segR + 1) + j, b = a + segR + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

function handGeometry(s, curl) {
  // palm along +Y (fingers continue +Y), palm faces -Z
  const parts = [];
  const pal = new THREE.SphereGeometry(1, 16, 12); pal.scale(0.036 * s, 0.042 * s, 0.014 * s); pal.translate(0, 0.035 * s, 0);
  const add = (geo) => parts.push(geo);
  add(pal);
  const fingers = [[-0.022, 0.03, 0.009], [-0.007, 0.034, 0.0095], [0.008, 0.032, 0.0092], [0.022, 0.026, 0.0082]];
  for (const [fx, fl, fr] of fingers) {
    let p = new V3(fx * s, 0.07 * s, 0); let dir = new V3(0, 1, 0);
    for (let k = 0; k < 3; k++) {
      const l = fl * s * (k === 0 ? 0.48 : k === 1 ? 0.32 : 0.26);
      const seg = new THREE.CapsuleGeometry(fr * s * (1 - k * 0.1), l, 4, 10);
      const q = new THREE.Quaternion().setFromUnitVectors(new V3(0, 1, 0), dir);
      seg.applyQuaternion(q); const mid = p.clone().addScaledVector(dir, l / 2); seg.translate(mid.x, mid.y, mid.z);
      add(seg);
      p = p.clone().addScaledVector(dir, l);
      dir = dir.clone().applyAxisAngle(new V3(1, 0, 0), -curl * (k === 0 ? 0.9 : 1.1));
    }
  }
  // thumb
  let p = new V3(-0.03 * s, 0.025 * s, -0.008 * s); let dir = new V3(-0.6, 0.7, -0.4).normalize();
  for (let k = 0; k < 2; k++) {
    const l = 0.02 * s;
    const seg = new THREE.CapsuleGeometry(0.0105 * s, l, 4, 10);
    seg.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new V3(0, 1, 0), dir));
    const mid = p.clone().addScaledVector(dir, l / 2); seg.translate(mid.x, mid.y, mid.z); add(seg);
    p = p.clone().addScaledVector(dir, l); dir = dir.clone().applyAxisAngle(new V3(0, 0, 1), -0.5 * curl).applyAxisAngle(new V3(1, 0, 0), -0.4 * curl);
  }
  // merge (non-indexed for simplicity)
  const geos = parts.map((g) => g.index ? g.toNonIndexed() : g);
  const pos = [], nor = [];
  for (const g of geos) { pos.push(...g.attributes.position.array); nor.push(...g.attributes.normal.array); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
  return g;
}

// ------------------------------------------------------------------ materials
function skinMaterial(cfg, map) {
  const st = texSet('skin');
  const nm = st.normalMap.clone(); nm.repeat.set(8, 8); st.all.normalMap.push(nm);
  const m = new THREE.MeshPhysicalMaterial({
    map, color: 0xffffff, roughness: 0.52, normalMap: nm, normalScale: new THREE.Vector2(0.35, 0.35),
    sheen: 0.55, sheenRoughness: 0.45, sheenColor: new THREE.Color(0.75, 0.32, 0.25), clearcoat: 0.06, clearcoatRoughness: 0.5,
    specularIntensity: 0.55,
  });
  // cheap subsurface: wrap diffuse and warm the terminator
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
      reflectedLight.directDiffuse += reflectedLight.directDiffuse * vec3(0.12, -0.02, -0.04);
      reflectedLight.indirectDiffuse *= vec3(1.06, 0.97, 0.95);`);
  };
  m.customProgramCacheKey = () => 'skin';
  return m;
}
function clothMaterial(kind, color, opt = {}) {
  const st = texSet(kind);
  const rep = opt.repeat || [2, 2];
  const cl = (t, k) => { const c = t.clone(); c.repeat.set(rep[0], rep[1]); st.all[k].push(c); return c; };
  const orm = cl(st.ormMap, 'ormMap');
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color), map: cl(st.map, 'map'), normalMap: cl(st.normalMap, 'normalMap'), roughnessMap: orm, aoMap: orm,
    roughness: 1, normalScale: new THREE.Vector2(opt.normal || 1.2, opt.normal || 1.2),
    sheen: opt.sheen !== undefined ? opt.sheen : 0.6, sheenRoughness: 0.6, sheenColor: new THREE.Color(color).lerp(new THREE.Color(1, 1, 1), 0.4),
    side: opt.side || THREE.FrontSide,
  });
  return m;
}

// continuous sleeve tube through shoulder -> elbow -> wrist, rebuilt each frame
class Sleeve {
  constructor(r0, r1, mat, seed) {
    this.r0 = r0; this.r1 = r1; this.L = 26; this.R = 18; this.seed = seed;
    const n = (this.L + 1) * (this.R + 1);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const uv = new Float32Array(n * 2), idx = [];
    for (let i = 0; i <= this.L; i++) for (let j = 0; j <= this.R; j++) { const k = i * (this.R + 1) + j; uv[k * 2] = j / this.R * 1.5; uv[k * 2 + 1] = i / this.L * 2.5; }
    for (let i = 0; i < this.L; i++) for (let j = 0; j < this.R; j++) { const a = i * (this.R + 1) + j, b = a + this.R + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx);
    this.geo = g; this.mesh = new THREE.Mesh(g, mat); this.mesh.frustumCulled = false;
    this.mesh.castShadow = true; this.mesh.receiveShadow = true;
  }
  update(S, E, W, foreLen) {
    // quadratic-ish path: S->E->Wc (cuff), with a rounded elbow
    const Wc = E.clone().addScaledVector(W.clone().sub(E).normalize(), foreLen);
    const curve = new THREE.CatmullRomCurve3([S.clone().addScaledVector(E.clone().sub(S).normalize(), -this.r0 * 0.9), S, E, Wc], false, 'centripetal');
    const p = this.geo.attributes.position.array;
    const P = new V3(), T = new V3(), N = new V3(), B = new V3(), up = new V3(0, 0, 1);
    const bend = 1 - E.clone().sub(S).normalize().dot(Wc.clone().sub(E).normalize());
    let k = 0;
    for (let i = 0; i <= this.L; i++) {
      const t = 0.08 + 0.92 * i / this.L;
      curve.getPointAt(t, P); curve.getTangentAt(t, T);
      B.crossVectors(T, up); if (B.lengthSq() < 1e-4) B.set(1, 0, 0); B.normalize(); N.crossVectors(B, T).normalize();
      const u = i / this.L;
      let r = this.r0 + (this.r1 - this.r0) * u;
      r *= 1 + 0.12 * Math.exp(-(((u - 0.05) / 0.1) ** 2)); // shoulder puff
      const elbow = Math.exp(-(((u - 0.52) / 0.12) ** 2));
      for (let j = 0; j <= this.R; j++) {
        const a = j / this.R * Math.PI * 2, cs = Math.cos(a), sn = Math.sin(a);
        // folds: accordion on the inner elbow, soft twists elsewhere
        const inner = Math.max(0, -cs);
        const w = 0.07 * Math.sin(u * 60 + a * 2 + this.seed) * elbow * (0.3 + bend * 1.5) * (0.4 + inner)
          + 0.04 * Math.sin(u * 23 - a * 3 + this.seed * 2) + 0.025 * Math.sin(a * 5 + u * 9);
        const rr = r * (1 + w);
        p[k++] = P.x + (N.x * cs + B.x * sn) * rr; p[k++] = P.y + (N.y * cs + B.y * sn) * rr; p[k++] = P.z + (N.z * cs + B.z * sn) * rr;
      }
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.computeVertexNormals();
  }
}

// ------------------------------------------------------------------ Person
export const PRESETS = {
  girl: {
    height: 1.1, a: 0.078, b: 0.086, c: 0.09, back: 1.08, jaw: 0.24, crown: 0.08, cheek: 0.009, socket: 0.004, brow: 0.0008,
    nose: 0.0072, bridge: 0.35, lips: 0.0032, chin: 0.002, eyeR: 0.0132, eyeX: 0.37, eyeY: 0.0, iris: [96, 60, 34],
    skin: [240, 202, 178], blush: 0.3, lip: [214, 110, 108], hair: 0x6b4426, hairStyle: 'bob',
    shoulderW: 0.125, neckY: 0.86, hipY: 0.55, chestR: [0.105, 0.075], waistR: [0.1, 0.072], top: 'knit', topColor: 0xd9c6a2,
    upper: 0.165, fore: 0.15, handS: 0.8, leg: 0x3c4a5c, mouthW: 0.95,
  },
  papa: {
    height: 1.78, a: 0.076, b: 0.112, c: 0.098, back: 1.02, jaw: 0.16, crown: 0.0, cheek: 0.003, socket: 0.006, brow: 0.0035,
    nose: 0.014, bridge: 1.0, lips: 0.003, chin: 0.007, eyeR: 0.0122, eyeX: 0.35, eyeY: 0.07, iris: [70, 52, 36],
    skin: [222, 178, 150], blush: 0.12, lip: [180, 105, 98], hair: 0x231711, hairStyle: 'short', beard: true,
    shoulderW: 0.2, neckY: 1.48, hipY: 0.98, chestR: [0.17, 0.115], waistR: [0.155, 0.11], top: 'plaid', topColor: 0xffffff,
    upper: 0.29, fore: 0.27, handS: 1.0, leg: 0x2c3340, mouthW: 1.05,
  },
  mama: {
    height: 1.63, a: 0.071, b: 0.104, c: 0.093, back: 1.03, jaw: 0.24, crown: 0.0, cheek: 0.0045, socket: 0.005, brow: 0.0015,
    nose: 0.0105, bridge: 0.85, lips: 0.0042, chin: 0.005, eyeR: 0.012, eyeX: 0.355, eyeY: 0.07, iris: [84, 60, 40],
    skin: [238, 200, 176], blush: 0.2, lip: [196, 96, 98], hair: 0x4a2c1a, hairStyle: 'pony',
    shoulderW: 0.175, neckY: 1.36, hipY: 0.92, chestR: [0.145, 0.1], waistR: [0.125, 0.09], top: 'knit', topColor: 0xc58a2c,
    upper: 0.27, fore: 0.24, handS: 0.88, leg: 0x3a3030, mouthW: 1.0,
  },
};

export class Person {
  constructor(kind, opt = {}) {
    const cfg = Object.assign({}, PRESETS[kind], opt);
    this.cfg = cfg; this.kind = kind;
    this.root = new THREE.Group();
    this.hips = new THREE.Group(); this.hips.position.y = cfg.hipY; this.root.add(this.hips);
    this.chest = new THREE.Group(); this.hips.add(this.chest);
    this.neck = new THREE.Group(); this.neck.position.y = cfg.neckY - cfg.hipY; this.chest.add(this.neck);
    this.head = new THREE.Group(); this.head.position.y = 0.012 + cfg.b * 0.95; this.neck.add(this.head);
    this.skinTex = skinCanvas(cfg);
    this.skinMat = skinMaterial(cfg, this.skinTex);
    this.buildHead();
    this.buildBody();
    this.expr = { smile: 0.3, open: 0, wide: 0, pucker: 0, browL: 0, browR: 0, browIn: 0, eyeOpen: 1, squint: 0, tilt: 0 };
    this.exprT = Object.assign({}, this.expr);
    this.look = new V3(0, cfg.height, 2); this.lookT = this.look.clone();
    this.blinkT = 2; this.blink = 0;
    this.talk = 0; this.bob = 0; this.lean = 0; this.leanT = 0;
    this.armT = { R: null, L: null }; this.armCur = { R: null, L: null };
    this.headYaw = 0; this.headPitch = 0;
    this.mouthKey = '';
    this.root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  }

  buildHead() {
    const cfg = this.cfg;
    const deform = headDeform(cfg);
    const geo = new THREE.SphereGeometry(1, 96, 72);
    const p = geo.attributes.position; const d = new V3(), o = new V3();
    for (let i = 0; i < p.count; i++) { d.set(p.getX(i), p.getY(i), p.getZ(i)).normalize(); deform(d, o); p.setXYZ(i, o.x, o.y, o.z); }
    geo.computeVertexNormals();
    // fix the uv seam normals: average duplicates
    const head = new THREE.Mesh(geo, this.skinMat);
    this.head.add(head);
    this.headMesh = head;
    this.deform = deform;
    // neck
    const nk = new THREE.Mesh(limbGeometry(cfg.b * 0.9, cfg.a * 0.52, cfg.a * 0.48, 0, 1, false), this.skinMat);
    nk.position.y = -cfg.b * 0.95 - 0.02; this.head.add(nk);
    // ears
    const earG = new THREE.SphereGeometry(1, 16, 12);
    { const ep = earG.attributes.position; for (let i = 0; i < ep.count; i++) { const x = ep.getX(i), y = ep.getY(i), z = ep.getZ(i); ep.setXYZ(i, x * 0.006 - (z > 0 ? 0.0 : 0) - Math.max(0, x) * 0.004 * (1 - y * y), y * cfg.b * 0.27, z * cfg.b * 0.17); } earG.computeVertexNormals(); }
    for (const s of [-1, 1]) {
      const e = new THREE.Mesh(earG, this.skinMat);
      const pt = deform(new V3(s, -0.05, -0.05).normalize(), new V3());
      e.position.copy(pt).multiplyScalar(0.98); e.rotation.y = s * 0.35; e.scale.x = s;
      this.head.add(e);
    }
    // eyes
    this.eyes = [];
    const R = cfg.eyeR;
    const irisTex = canvasTex(256, 128, (g, w, h) => {
      const sc = g.createLinearGradient(0, 0, 0, h);
      sc.addColorStop(0, '#f4f1ec'); sc.addColorStop(0.6, '#ece6e0'); sc.addColorStop(1, '#d9c9c4');
      g.fillStyle = sc; g.fillRect(0, 0, w, h);
      // iris occupies top rows (front pole)
      const ir = cfg.iris;
      const irisH = h * 0.235;
      g.fillStyle = `rgb(${ir[0] * 0.55},${ir[1] * 0.55},${ir[2] * 0.55})`; g.fillRect(0, 0, w, irisH * 1.08);
      for (let x = 0; x < w; x += 1) {
        const l = 0.7 + Math.random() * 0.6;
        const gr = g.createLinearGradient(0, 0, 0, irisH);
        gr.addColorStop(0, `rgb(${ir[0] * 0.45 * l},${ir[1] * 0.45 * l},${ir[2] * 0.4 * l})`);
        gr.addColorStop(0.45, `rgb(${ir[0] * 1.15 * l},${ir[1] * 1.1 * l},${ir[2] * 0.9 * l})`);
        gr.addColorStop(0.9, `rgb(${ir[0] * 0.8 * l},${ir[1] * 0.75 * l},${ir[2] * 0.7 * l})`);
        gr.addColorStop(1, 'rgb(30,22,18)');
        g.fillStyle = gr; g.fillRect(x, 0, 1, irisH);
      }
      g.fillStyle = '#0b0807'; g.fillRect(0, 0, w, irisH * 0.38);
      // sclera veins (very faint)
      g.strokeStyle = 'rgba(200,90,90,0.12)';
      for (let i = 0; i < 30; i++) { g.beginPath(); const x = Math.random() * w; g.moveTo(x, h); g.lineTo(x + (Math.random() - 0.5) * 20, h * 0.45); g.stroke(); }
    });
    const eyeMat = new THREE.MeshPhysicalMaterial({ map: irisTex, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.03, ior: 1.38, specularIntensity: 0.6 });
    const eyeGeo = new THREE.SphereGeometry(R, 32, 24); eyeGeo.rotateX(Math.PI / 2);
    // lids
    const lidGeoU = new THREE.SphereGeometry(R * 1.08, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.55); lidGeoU.rotateX(Math.PI / 2 * 0); // cap over +y
    const lidGeoL = new THREE.SphereGeometry(R * 1.06, 28, 10, 0, Math.PI * 2, Math.PI * 0.62, Math.PI * 0.38);
    const lashCurve = []; for (let i = 0; i <= 12; i++) { const a = -1.2 + 2.4 * i / 12; lashCurve.push(new V3(Math.sin(a) * R * 1.1, 0, Math.cos(a) * R * 1.1)); }
    const lashGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lashCurve), 16, R * 0.08, 5);
    const lashMat = new THREE.MeshStandardMaterial({ color: 0x1a110c, roughness: 0.6 });
    for (const s of [-1, 1]) {
      const dir = new V3(s * cfg.eyeX, cfg.eyeY, 0.93).normalize();
      // surface position without socket dip ~ ellipsoid
      const sp = new V3(dir.x * cfg.a, dir.y * cfg.b, dir.z * cfg.c);
      const ctr = sp.clone().multiplyScalar(1 - R * 0.6 / sp.length());
      const eg = new THREE.Group(); eg.position.copy(ctr); this.head.add(eg);
      const ball = new THREE.Group(); eg.add(ball);
      const em = new THREE.Mesh(eyeGeo, eyeMat); ball.add(em);
      // lids rotate about local X; the cap opens toward +z
      const up = new THREE.Group(); eg.add(up);
      const ul = new THREE.Mesh(lidGeoU, this.skinMat); ul.rotation.x = 0; up.add(ul);
      const lash = new THREE.Mesh(lashGeo, lashMat); up.add(lash);
      lash.position.y = 0; // set per frame at the lid edge
      const lo = new THREE.Group(); eg.add(lo);
      const ll = new THREE.Mesh(lidGeoL, this.skinMat); lo.add(ll);
      eg.rotation.y = s * 0.12; // eyes look slightly outward in rest
      this.eyes.push({ g: eg, ball, up, lo, lash, ul, s });
    }
    // brows
    this.brows = [];
    const browMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cfg.hair).multiplyScalar(1.1), roughness: 0.85 });
    for (const s of [-1, 1]) {
      const pts = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        const dir = new V3(s * (0.16 + t * 0.4), cfg.eyeY + 0.25 + Math.sin(t * Math.PI) * 0.05 - t * 0.03, 0.95).normalize();
        const pnt = deform(dir, new V3()); pnt.multiplyScalar(1 + 0.012 / pnt.length() * 0.2);
        pts.push(pnt);
      }
      const ctr = pts[4].clone();
      for (const pp of pts) pp.sub(ctr);
      const tb = tubeAlong(pts, (t) => (this.kind === 'papa' ? 0.0032 : 0.0022) * (1 - 0.55 * t) * (0.6 + 0.4 * Math.sin(Math.min(1, t * 3) * Math.PI / 2)), 6, 0.45, new V3(0, 0, 1));
      const b = new THREE.Mesh(mergeParts([tb]), browMat);
      const bg = new THREE.Group(); bg.position.copy(ctr); bg.add(b); this.head.add(bg);
      this.brows.push({ g: bg, s, base: ctr.clone() });
    }
    // mouth decal
    const mc = document.createElement('canvas'); mc.width = 256; mc.height = 128;
    this.mouthCanvas = mc; this.mouthCtx = mc.getContext('2d');
    this.mouthTex = new THREE.CanvasTexture(mc); this.mouthTex.colorSpace = THREE.SRGBColorSpace;
    const md = new V3(0, -0.43, 0.9).normalize();
    const mctr = deform(md, new V3());
    const MW = cfg.a * 0.95, MH = MW / 2;
    const pg = new THREE.PlaneGeometry(MW, MH, 24, 12);
    const pp = pg.attributes.position;
    for (let i = 0; i < pp.count; i++) {
      // project the plane point onto the head surface along +z
      const x = pp.getX(i) + mctr.x, y = pp.getY(i) + mctr.y;
      const q = new V3();
      const inside = (z) => { const pt = new V3(x, y, z); const r = pt.length(); deform(pt.normalize(), q); return r < q.length(); };
      let lo = 0, hi = cfg.c * 1.8;
      for (let k = 0; k < 28; k++) { const z = (lo + hi) / 2; if (inside(z)) lo = z; else hi = z; }
      q.set(x, y, lo);
      pp.setXYZ(i, q.x, q.y, q.z + 0.0006);
    }
    pg.computeVertexNormals();
    const mMat = new THREE.MeshPhysicalMaterial({ map: this.mouthTex, transparent: true, roughness: 0.42, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, clearcoat: 0.25, clearcoatRoughness: 0.35 });
    this.mouthMesh = new THREE.Mesh(pg, mMat);
    this.mouthMesh.renderOrder = 2;
    this.head.add(this.mouthMesh);
    this.buildHair();
  }

  buildHair() {
    const cfg = this.cfg;
    const deform = this.deform;
    const parts = [];
    const rnd = (() => { let s = 1234 + cfg.hair % 97; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
    const surf = (dir, off) => { const q = deform(dir.clone().normalize(), new V3()); return q.addScaledVector(dir.clone().normalize(), off); };
    // scalp cap: hair-covered region pushed out a little
    const capGeo = new THREE.SphereGeometry(1, 64, 48);
    const cp = capGeo.attributes.position; const keep = [];
    const style = cfg.hairStyle;
    const hairline = (d) => {
      if (style === 'short') return d.y > 0.35 - 0.25 * Math.max(0, -d.z) - (d.z < 0 ? 0.45 : 0) && !(d.z > 0.75 && d.y < 0.52);
      return d.y > (d.z > 0.72 ? 0.36 : -0.2) - (d.z < -0.2 ? 0.5 : 0);
    };
    const tmp = new V3();
    for (let i = 0; i < cp.count; i++) {
      tmp.set(cp.getX(i), cp.getY(i), cp.getZ(i)).normalize();
      keep.push(hairline(tmp));
      const q = surf(tmp, style === 'short' ? 0.004 : 0.006);
      cp.setXYZ(i, q.x, q.y, q.z);
    }
    const ci = capGeo.index.array, ni = [];
    for (let i = 0; i < ci.length; i += 3) if (keep[ci[i]] && keep[ci[i + 1]] && keep[ci[i + 2]]) ni.push(ci[i], ci[i + 1], ci[i + 2]);
    capGeo.setIndex(ni); capGeo.computeVertexNormals();
    // strand clumps
    const B = cfg.b, A = cfg.a;
    const clump = (root, len, r, off0, off1, forward = 0, curlIn = 0, endY = null) => {
      const pts = [];
      let d = root.clone().normalize();
      const steps = 12;
      for (let k = 0; k <= steps; k++) {
        const t = k / steps;
        const off = off0 + (off1 - off0) * t;
        let p = surf(d, off);
        if (endY !== null && p.y < endY) {
          // hang below the head
          const last = pts[pts.length - 1] || p;
          p = last.clone().add(new V3(0, -len / steps, 0));
          p.x += -p.x * curlIn * 0.15; p.z += -p.z * curlIn * 0.15;
        }
        pts.push(p);
        // move direction down along the surface
        const down = new V3(0, -1, forward).normalize();
        const tang = down.addScaledVector(d, -down.dot(d)).normalize();
        d = d.clone().addScaledVector(tang, len / steps / (A * 1.1)).normalize();
      }
      parts.push(tubeAlong(pts, (t) => r * (1 - 0.7 * Math.pow(t, 1.8)) * (0.85 + 0.15 * Math.sin(t * 9)), 7, 0.45));
    };
    if (style === 'bob' || style === 'pony') {
      // crown to sides/back
      const n = style === 'bob' ? 260 : 220;
      for (let i = 0; i < n; i++) {
        const az = rnd() * Math.PI * 2;
        const el = 0.55 + rnd() * 0.35;
        const root = new V3(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el));
        if (root.z > 0.35 && style === 'bob') continue; // the front is the fringe
        if (style === 'pony' && root.z > 0.55) continue;
        const endY = style === 'bob' ? -B * (0.55 + rnd() * 0.12) : -B * 0.35;
        clump(root, B * (style === 'bob' ? 1.9 : 1.6), 0.011 + rnd() * 0.005, 0.004, 0.012 + rnd() * 0.006, -0.15, style === 'bob' ? 1 : 0.3, endY);
      }
      // fringe over the forehead
      if (style === 'bob') {
        for (let i = 0; i < 60; i++) {
          const x = -0.7 + 1.4 * (i / 59) + (rnd() - 0.5) * 0.05;
          const root = new V3(x * 0.6, 0.85, 0.4 + rnd() * 0.1);
          clump(root, B * (0.6 - Math.abs(x) * 0.1) + rnd() * 0.01, 0.009 + rnd() * 0.003, 0.004, 0.009, 0.9, 0, null);
        }
      } else {
        // side-swept front for mama
        for (let i = 0; i < 40; i++) {
          const x = -0.6 + 1.2 * (i / 39);
          const root = new V3(x * 0.7, 0.55, 0.8);
          clump(root, B * 1.1, 0.009, 0.004, 0.009, -2.5, 0, null);
        }
        // ponytail
        const base = surf(new V3(0, 0.1, -1), 0.01);
        for (let i = 0; i < 40; i++) {
          const pts = [];
          const ox = (rnd() - 0.5) * 0.03, oz = (rnd() - 0.5) * 0.02;
          for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push(new V3(base.x + ox * (1 - t * 0.5), base.y - t * 0.2 - t * t * 0.05, base.z - 0.02 - Math.sin(t * 2) * 0.04 + oz)); }
          parts.push(tubeAlong(pts, (t) => 0.007 * (1 - 0.8 * t), 6, 0.6));
        }
        const tie = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.005, 8, 20), new THREE.MeshStandardMaterial({ color: 0x5a1f14, roughness: 0.7 }));
        tie.position.copy(base).add(new V3(0, 0, -0.02)); tie.rotation.x = Math.PI / 2; this.head.add(tie);
      }
    } else {
      // short men's cut
      for (let i = 0; i < 260; i++) {
        const az = rnd() * Math.PI * 2, el = 0.1 + rnd() * 1.3;
        const root = new V3(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el));
        if (!hairline(root)) continue;
        clump(root, B * 0.35, 0.0065, 0.005, 0.008, root.z > 0.3 ? -0.6 : 0.1, 0, null);
      }
    }
    const geo = mergeParts(parts);
    const ht = texSet('hair');
    const cl = (t, k, rx, ry) => { const c = t.clone(); c.repeat.set(rx, ry); ht.all[k].push(c); return c; };
    const hairMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(cfg.hair), map: cl(ht.map, 'map', 1, 1), normalMap: cl(ht.normalMap, 'normalMap', 1, 1), roughnessMap: cl(ht.ormMap, 'ormMap', 1, 1),
      roughness: 1, sheen: 0.2, sheenRoughness: 0.4,
      sheenColor: new THREE.Color(cfg.hair).lerp(new THREE.Color(0x9a6a40), 0.4), side: THREE.DoubleSide, specularIntensity: 0.5,
    });
    const capMat = hairMat.clone(); capMat.anisotropy = 0; capMat.sheen = 0.1; capMat.side = THREE.FrontSide;
    capMat.map = cl(ht.map, 'map', 3, 6); capMat.normalMap = cl(ht.normalMap, 'normalMap', 3, 6); capMat.roughnessMap = cl(ht.ormMap, 'ormMap', 3, 6);
    capMat.color = new THREE.Color(cfg.hair).multiplyScalar(0.8);
    this.hairCap = new THREE.Mesh(capGeo, capMat);
    this.hair = new THREE.Mesh(geo, hairMat);
    this.head.add(this.hairCap, this.hair);
  }

  buildBody() {
    const cfg = this.cfg;
    const H = cfg.neckY - cfg.hipY;
    const ch = cfg.chestR, wa = cfg.waistR;
    const armR = ch[0] * 0.33, neckR = cfg.a * 0.5;
    const SW = cfg.shoulderW;
    // control rings: [y/H, rx, rz, cz]
    const C = [
      [-0.04, wa[0] * 1.08, wa[1] * 1.06, 0.0],
      [0.25, wa[0], wa[1], 0.004],
      [0.55, ch[0] * 0.98, ch[1], 0.0],
      [0.74, SW + armR * 0.35, ch[1] * 0.98, -0.004],
      [0.86, SW + armR * 0.55, ch[1] * 0.9, -0.008],
      [0.92, SW * 0.92 + armR * 0.3, ch[1] * 0.78, -0.01],
      [0.955, SW * 0.55, ch[1] * 0.62, -0.01],
      [0.985, neckR * 1.5, neckR * 1.4, -0.006],
      [1.0, neckR * 1.15, neckR * 1.12, -0.004],
    ];
    const rings = [];
    const NR = 30;
    for (let i = 0; i <= NR; i++) {
      const u = i / NR * (C.length - 1); const k = Math.min(C.length - 2, Math.floor(u)); const f = u - k;
      const g = (j) => { const p0 = C[Math.max(0, k - 1)][j], p1 = C[k][j], p2 = C[k + 1][j], p3 = C[Math.min(C.length - 1, k + 2)][j];
        const f2 = f * f, f3 = f2 * f; return 0.5 * ((2 * p1) + (-p0 + p2) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f2 + (-p0 + 3 * p1 - 3 * p2 + p3) * f3); };
      rings.push({ y: g(0) * H, rx: g(1), rz: g(2), cz: g(3), sq: cfg.top === 'knit' ? 0.4 : 0.8 });
    }
    // fabric folds: horizontal ripples near the waist, soft verticals at the front
    const folds = (y, a, t) => 0.0022 * Math.sin(y * 95 + Math.sin(a * 3) * 2) * sstep(0.0, 0.3, t) * (1 - sstep(0.3, 0.55, t)) + 0.0012 * Math.sin(a * 9 + y * 20) * (1 - sstep(0.65, 0.85, t));
    const torsoGeo = loftBody(rings, 56, folds);
    const isKnit = cfg.top === 'knit';
    this.topMat = isKnit ? clothMaterial('knit', cfg.topColor, { repeat: [3, 3], normal: 1.4, sheen: 0.8 }) : clothMaterial('plaid', cfg.topColor, { repeat: [3, 3], normal: 1.0, sheen: 0.4 });
    const torso = new THREE.Mesh(torsoGeo, this.topMat); this.chest.add(torso);
    // collar rib / shirt collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(cfg.a * 0.58, cfg.a * (isKnit ? 0.13 : 0.1), 10, 32), this.topMat);
    collar.rotation.x = Math.PI / 2 - 0.12; collar.position.set(0, H + 0.005, 0.005); collar.scale.set(1, 1.1, 1); this.chest.add(collar);
    if (!isKnit) {
      // button placket
      const pl = new THREE.Mesh(new THREE.BoxGeometry(0.022, H * 0.85, 0.004), this.topMat); pl.position.set(0, H * 0.45, ch[1] * 0.99); this.chest.add(pl);
      const btnM = new THREE.MeshPhysicalMaterial({ color: 0x2b2420, roughness: 0.3, clearcoat: 1 });
      for (let i = 0; i < 4; i++) { const bt = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.003, 12), btnM); bt.rotation.x = Math.PI / 2; bt.position.set(0, H * (0.2 + i * 0.2), ch[1] * 1.03 + 0.002); this.chest.add(bt); }
    }
    const hem = new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 8, 40), this.topMat);
    hem.scale.set(wa[0] * 1.08, wa[1] * 1.06, wa[0] * 0.9); hem.rotation.x = Math.PI / 2; hem.position.y = -0.04 * H; this.chest.add(hem);
    // hips / legs (trousers)
    const legMat = clothMaterial('linen', cfg.leg, { repeat: [2, 4], normal: 1.6, sheen: 0.3 });
    const pelvis = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), legMat); pelvis.scale.set(wa[0] * 0.98, wa[0] * 0.8, wa[1] * 0.95); pelvis.position.y = -0.06 * H; this.hips.add(pelvis);
    this.legs = [];
    for (const s of [-1, 1]) {
      const lg = new THREE.Mesh(limbGeometry(cfg.hipY * 0.94, wa[0] * 0.5, wa[0] * 0.36, 0.05, s, false), legMat);
      lg.rotation.x = Math.PI; lg.position.set(s * wa[0] * 0.5, 0, 0); this.hips.add(lg); this.legs.push(lg);
      const shoe = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), new THREE.MeshPhysicalMaterial({ color: 0x3a2a22, roughness: 0.45, clearcoat: 0.3 }));
      shoe.scale.set(wa[0] * 0.42, wa[0] * 0.28, cfg.height * 0.085); shoe.position.set(s * wa[0] * 0.5, -cfg.hipY + wa[0] * 0.25, cfg.height * 0.03); this.hips.add(shoe);
    }
    // arms
    this.arms = {};
    const handCurl = 0.9;
    for (const [side, s] of [['R', -1], ['L', 1]]) {
      const sh = new V3(s * (cfg.shoulderW - armR * 0.15), H * 0.86, -0.008);
      const sleeve = new Sleeve(armR, ch[0] * 0.24, this.topMat, s);
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(ch[0] * 0.235, ch[0] * 0.05, 8, 20), this.topMat);
      const hand = new THREE.Group();
      const hm = new THREE.Mesh(handGeometry(cfg.handS, handCurl), this.skinMat); hand.add(hm);
      const wrist = new THREE.Mesh(limbGeometry(0.035 * cfg.handS, ch[0] * 0.15, ch[0] * 0.17, 0, 1, false), this.skinMat); wrist.position.y = -0.025 * cfg.handS; hand.add(wrist);
      hm.scale.x = s; // mirror for the left hand
      this.chest.add(sleeve.mesh, hand); cuff.visible = false;
      const held = new THREE.Group(); held.position.set(0, 0.05 * cfg.handS, -0.012 * cfg.handS); hand.add(held);
      this.arms[side] = { s, sh, sleeve, cuff, hand, held, cur: null };
    }
  }

  // set an IK target in world space for 'R' or 'L' (null = rest)
  reach(side, worldPos) { this.armT[side] = worldPos ? worldPos.clone() : null; }

  setExpr(name, hold) {
    const P = {
      neutral: { smile: 0.25, open: 0, wide: 0, pucker: 0, browL: 0, browR: 0, browIn: 0, eyeOpen: 1, squint: 0, tilt: 0 },
      smile: { smile: 0.8, open: 0.05, wide: 0.2, pucker: 0, browL: 0.15, browR: 0.15, browIn: 0, eyeOpen: 0.92, squint: 0.35, tilt: 0.05 },
      grin: { smile: 1, open: 0.55, wide: 0.5, pucker: 0, browL: 0.45, browR: 0.45, browIn: 0, eyeOpen: 0.85, squint: 0.55, tilt: 0.08 },
      wow: { smile: 0.1, open: 0.75, wide: 0, pucker: 0.6, browL: 1, browR: 1, browIn: 0.2, eyeOpen: 1.25, squint: 0, tilt: 0 },
      huh: { smile: -0.2, open: 0.12, wide: 0, pucker: 0.4, browL: 0.9, browR: -0.3, browIn: 0, eyeOpen: 1.05, squint: 0, tilt: 0.22 },
      oops: { smile: 0.55, open: 0.35, wide: 0.6, pucker: 0, browL: 0.6, browR: 0.6, browIn: 0.9, eyeOpen: 0.95, squint: 0.2, tilt: -0.12 },
      focus: { smile: 0.15, open: 0.06, wide: 0, pucker: 0.2, browL: -0.2, browR: -0.2, browIn: 0.3, eyeOpen: 0.88, squint: 0.15, tilt: 0.04 },
      proud: { smile: 1, open: 0.2, wide: 0.4, pucker: 0, browL: 0.3, browR: 0.3, browIn: 0, eyeOpen: 0.6, squint: 0.8, tilt: -0.06 },
    }[name] || {};
    Object.assign(this.exprT, P);
    this.exprName = name;
    this.exprHold = hold || 0;
  }
  lookAt(worldPos) { this.lookT.copy(worldPos); }

  update(dt, t) {
    const cfg = this.cfg;
    const k = 1 - Math.exp(-dt * 7);
    for (const key in this.exprT) this.expr[key] += (this.exprT[key] - this.expr[key]) * k;
    if (this.exprHold > 0) { this.exprHold -= dt; if (this.exprHold <= 0) this.setExpr(this.defaultExpr || 'neutral'); }
    const e = this.expr;
    // breathing / idle sway
    const br = Math.sin(t * 1.7 + cfg.height) * 0.5 + 0.5;
    this.chest.scale.set(1 + br * 0.008, 1 + br * 0.004, 1 + br * 0.012);
    this.lean += (this.leanT - this.lean) * (1 - Math.exp(-dt * 3));
    this.hips.rotation.x = this.lean * 0.5;
    this.chest.rotation.x = this.lean * 0.5 + Math.sin(t * 0.6) * 0.008;
    this.chest.rotation.z = Math.sin(t * 0.45 + 1) * 0.012;
    this.hips.position.y = cfg.hipY + this.bob;
    // head look
    this.look.lerp(this.lookT, 1 - Math.exp(-dt * 5));
    const hw = new V3(); this.neck.getWorldPosition(hw);
    const inv = new THREE.Matrix4().copy(this.neck.parent.matrixWorld).invert();
    const lp = this.look.clone().applyMatrix4(inv); const np = this.neck.position.clone();
    const dir = lp.sub(np);
    const yaw = Math.atan2(dir.x, dir.z), pitch = Math.atan2(-dir.y, Math.hypot(dir.x, dir.z));
    this.headYaw += (THREE.MathUtils.clamp(yaw, -1.1, 1.1) - this.headYaw) * (1 - Math.exp(-dt * 4));
    this.headPitch += (THREE.MathUtils.clamp(pitch + 0.05, -0.5, 0.6) - this.headPitch) * (1 - Math.exp(-dt * 4));
    this.neck.rotation.set(this.headPitch * 0.4, this.headYaw * 0.4, 0);
    this.head.rotation.set(this.headPitch * 0.6 + Math.sin(t * 0.8) * 0.01, this.headYaw * 0.6, e.tilt + Math.sin(t * 0.5) * 0.015, 'YXZ');
    // eyes: gaze at target
    this.blinkT -= dt;
    if (this.blinkT < 0) { this.blink = 1; this.blinkT = 2 + Math.random() * 3.5; }
    this.blink = Math.max(0, this.blink - dt * 7);
    const bl = Math.sin(Math.min(1, this.blink) * Math.PI);
    const openAmt = THREE.MathUtils.clamp(e.eyeOpen - e.squint * 0.22 - bl * 1.2, 0, 1.3);
    for (const ey of this.eyes) {
      const wp = new V3(); ey.g.getWorldPosition(wp);
      const m = new THREE.Matrix4().copy(ey.g.matrixWorld).invert();
      const tl = this.look.clone().applyMatrix4(m).normalize();
      ey.ball.rotation.set(THREE.MathUtils.clamp(-Math.asin(tl.y), -0.4, 0.4), THREE.MathUtils.clamp(Math.atan2(tl.x, tl.z), -0.6, 0.6), 0, 'YXZ');
      // upper lid: rotate about x. open ~ -0.55 rad (lid edge above iris), closed ~ +0.9
      const lidAng = THREE.MathUtils.lerp(0.28, -0.82, Math.min(openAmt, 1)) - Math.max(0, openAmt - 1) * 0.6 + ey.ball.rotation.x * 0.5;
      ey.up.rotation.x = lidAng;
      ey.lo.rotation.x = -0.1 - e.squint * 0.35 + bl * 0.1;
      // lashes follow the lid edge (cap spans 0..0.55pi from +y)
      const edge = Math.PI * 0.55;
      ey.lash.position.set(0, Math.cos(edge) * this.cfg.eyeR * 1.02, 0);
      ey.lash.rotation.x = 0; ey.lash.scale.set(Math.sin(edge), 1, Math.sin(edge));
    }
    // brows
    for (const b of this.brows) {
      const lift = (b.s < 0 ? e.browR : e.browL);
      b.g.position.copy(b.base); b.g.position.y += lift * 0.006 * (cfg.b / 0.1);
      b.g.rotation.z = -b.s * (e.browIn * 0.25 - lift * 0.05);
      b.g.position.x += -b.s * e.browIn * 0.0015;
    }
    // mouth (redraw only when changed noticeably)
    const talk = this.talk > 0 ? (0.25 + 0.25 * Math.sin(t * 22) + 0.15 * Math.sin(t * 13)) * Math.min(1, this.talk) : 0;
    if (this.talk > 0) this.talk -= dt;
    const m = { smile: e.smile, open: Math.max(0, e.open + talk), wide: e.wide, pucker: e.pucker };
    const key = [m.smile, m.open, m.wide, m.pucker].map((v) => Math.round(v * 30)).join(',');
    if (key !== this.mouthKey) { this.mouthKey = key; drawMouth(this.mouthCtx, 256, 128, m, cfg); this.mouthTex.needsUpdate = true; }
    // arms IK
    this.chest.updateMatrixWorld(true);
    const chestInv = new THREE.Matrix4().copy(this.chest.matrixWorld).invert();
    for (const side of ['R', 'L']) {
      const a = this.arms[side];
      let tgt;
      if (this.armT[side]) tgt = this.armT[side].clone().applyMatrix4(chestInv);
      else tgt = a.sh.clone().add(new V3(a.s * 0.03, -(cfg.upper + cfg.fore) * 0.9, 0.06));
      if (!a.cur) a.cur = tgt.clone();
      a.cur.lerp(tgt, 1 - Math.exp(-dt * (this.armT[side] ? 9 : 4)));
      this.solveArm(a, a.cur);
    }
  }

  solveArm(a, T) {
    const cfg = this.cfg, l1 = cfg.upper, l2 = cfg.fore + cfg.handS * 0.05;
    const S = a.sh;
    const d0 = T.clone().sub(S); let d = d0.length();
    const dir = d0.clone().normalize();
    d = Math.min(d, l1 + l2 - 0.002); d = Math.max(d, Math.abs(l1 - l2) + 0.01);
    const aa = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, l1 * l1 - aa * aa));
    const pole = new V3(a.s * 0.6, -1, -0.5).normalize();
    pole.addScaledVector(dir, -pole.dot(dir)).normalize();
    const E = S.clone().addScaledVector(dir, aa).addScaledVector(pole, h);
    const W = S.clone().addScaledVector(dir, d);
    a.sleeve.update(S, E, W, cfg.fore * 0.93);
    const fd = W.clone().sub(E).normalize();
    a.cuff.position.copy(E).addScaledVector(fd, cfg.fore * 0.93);
    a.cuff.quaternion.setFromUnitVectors(new V3(0, 0, 1), fd);
    // hand continues the forearm, palm facing down/in
    a.hand.position.copy(E).addScaledVector(fd, cfg.fore * 0.98);
    const q = new THREE.Quaternion().setFromUnitVectors(new V3(0, 1, 0), fd);
    const twist = new THREE.Quaternion().setFromAxisAngle(new V3(0, 1, 0), a.s * 0.9);
    a.hand.quaternion.copy(q).multiply(twist);
  }
}
