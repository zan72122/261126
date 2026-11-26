// Parametric realistic-proportion human: sculpted head with moving eyes / lids / brows / mouth,
// lofted torso & limbs with cloth materials, hair cap + strand clumps, 2-bone arm IK.
import * as THREE from './three.module.min.js';
import { loftGeo, clumpGeo, ribbonGeo, mergeGeos, M4, rand } from './geo.js';
import { pbr, tex, canvasTex } from './tex.js';
import { strandMaterial } from './candy.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const tmpV = V(), tmpV2 = V(), tmpQ = new THREE.Quaternion(), tmpM = new THREE.Matrix4();
const DOWN = V(0, -1, 0), XAX = V(1, 0, 0);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ---------------------------------------------------------------- materials
const matCache = new Map();
export function clothMat(kind, color = 0xffffff, rep = 3, extra = {}) {
  const key = kind + color + rep + JSON.stringify(extra);
  if (matCache.has(key)) return matCache.get(key);
  const m = new THREE.MeshPhysicalMaterial({
    color, ...pbr(kind, rep), roughness: 1, metalness: 0,
    sheen: 0.7, sheenRoughness: 0.75, sheenColor: new THREE.Color(color).lerp(new THREE.Color(1, 1, 1), 0.5).multiplyScalar(0.5),
    normalScale: new THREE.Vector2(1.1, 1.1), ...extra,
  });
  matCache.set(key, m);
  return m;
}

function sssPatch(m, sss = [0.16, 0.05, 0.03]) {
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uSSS = { value: new THREE.Vector3(...sss) };
    sh.fragmentShader = 'uniform vec3 uSSS;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      {
        vec3 vd = normalize(vViewPosition);
        float ndv = clamp(dot(normal, vd), 0.0, 1.0);
        // soft light bleeding through thin skin + soft forward scatter at silhouette
        totalEmissiveRadiance += diffuseColor.rgb * uSSS * (0.55 + 0.9 * pow(1.0 - ndv, 2.0));
      }`);
  };
  m.customProgramCacheKey = () => 'sss' + sss.join();
  return m;
}

export function skinMats(tone) {
  const base = {
    color: tone, ...pbr('skin', 5), roughness: 0.62, metalness: 0,
    sheen: 0.35, sheenRoughness: 0.5, sheenColor: new THREE.Color(0.9, 0.55, 0.45),
    normalScale: new THREE.Vector2(0.35, 0.35), clearcoat: 0.05, clearcoatRoughness: 0.5,
  };
  delete base.map; // skin_c is a subtle mottling multiplier
  const head = sssPatch(new THREE.MeshPhysicalMaterial({ ...base, map: tex('skin_c', 5, true), vertexColors: true }));
  const body = sssPatch(new THREE.MeshPhysicalMaterial({ ...base, map: tex('skin_c', 5, true) }));
  return { head, body };
}

function hairMat(color) {
  const m = new THREE.MeshPhysicalMaterial({
    color, map: tex('hair_c', [6, 2], true), normalMap: tex('hair_n', [6, 2]), roughnessMap: tex('hair_orm', [6, 2]),
    roughness: 0.75, metalness: 0, sheen: 0.6, sheenRoughness: 0.4, sheenColor: new THREE.Color(color).lerp(new THREE.Color(1, 0.85, 0.6), 0.25),
    specularIntensity: 0.35, normalScale: new THREE.Vector2(0.8, 0.8), side: THREE.DoubleSide,
  });
  return m;
}

function eyeTexture(irisColor) {
  // latitude map: top rows = pupil/iris centre (sphere pole is rotated to +z)
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#f4efe9'; g.fillRect(0, 0, w, h);
    const ir = new THREE.Color(irisColor);
    const pupilEnd = h * 0.105, irisEnd = h * 0.25;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x += 2) {
        let c;
        if (y < pupilEnd) c = [12, 8, 8];
        else if (y < irisEnd) {
          const t = (y - pupilEnd) / (irisEnd - pupilEnd);
          const fib = 0.75 + 0.25 * Math.sin(x * 0.9 + Math.sin(x * 0.23) * 3) * Math.sin(y * 0.7 + x);
          const k = (0.65 + 0.5 * t) * fib * (t > 0.86 ? 0.45 : 1);
          const warm = t < 0.35 ? 1.25 : 1;
          c = [ir.r * 255 * k * warm, ir.g * 255 * k * warm, ir.b * 255 * k];
        } else {
          const t = (y - irisEnd) / (h - irisEnd);
          const vein = Math.max(0, Math.sin(x * 0.31 + y * 0.05) * Math.sin(y * 0.2 + x * 0.1)) * 18 * t;
          c = [244 - t * 10, 238 - t * 26 - vein, 232 - t * 30 - vein];
        }
        g.fillStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`; g.fillRect(x, y, 2, 1);
      }
    }
  });
}

// ---------------------------------------------------------------- type presets
export function preset(kind) {
  if (kind === 'girl') return { H: 1.10, child: true, female: true, skin: 0xf3cdb6, hair: 0x2b1810, hairStyle: 'pigtails', iris: 0x5a3418, headScale: 1.0 };
  if (kind === 'boy') return { H: 1.18, child: true, female: false, skin: 0xedc4a8, hair: 0x1d1410, hairStyle: 'short', iris: 0x4a2c16, headScale: 1.0 };
  if (kind === 'papa') return { H: 1.76, child: false, female: false, skin: 0xe6b996, hair: 0x1a120d, hairStyle: 'crop', iris: 0x3e2614, headScale: 1.0 };
  if (kind === 'grandma') return { H: 1.50, child: false, female: true, old: true, skin: 0xeec4a6, hair: 0xb9b5ae, hairStyle: 'bun', iris: 0x4a3324, headScale: 1.0 };
  if (kind === 'mama') return { H: 1.60, child: false, female: true, skin: 0xf1c8ae, hair: 0x3a2214, hairStyle: 'bob', iris: 0x4a2c18, headScale: 1.0 };
}

// ---------------------------------------------------------------- head sculpt
function makeHeadShape(P) {
  const child = P.child;
  const a = (child ? 0.074 : P.female ? 0.073 : 0.078), b = (child ? 0.098 : 0.112), c = (child ? 0.088 : 0.096);
  const bumps = [];
  const B = (x, y, z, s, amp) => { const d = V(x, y, z).normalize(); bumps.push({ d, s2: s * s, amp }); };
  // cheeks (chubby for children)
  B(0.52, -0.36, 0.78, 0.26, child ? 0.0075 : 0.0035); B(-0.52, -0.36, 0.78, 0.26, child ? 0.0075 : 0.0035);
  // nose bridge + tip + wings
  B(0, -0.02, 1, 0.09, child ? 0.004 : 0.008);
  B(0, -0.17, 1, 0.075, child ? 0.0085 : 0.015);
  B(0.07, -0.23, 0.99, 0.06, child ? 0.004 : 0.006); B(-0.07, -0.23, 0.99, 0.06, child ? 0.004 : 0.006);
  // eye sockets & brow ridge
  B(0.36, 0.03, 0.93, 0.16, -0.0055); B(-0.36, 0.03, 0.93, 0.16, -0.0055);
  B(0.36, 0.2, 0.92, 0.13, child ? 0.0015 : 0.0035); B(-0.36, 0.2, 0.92, 0.13, child ? 0.0015 : 0.0035);
  // muzzle, lips mound, chin
  B(0, -0.5, 0.87, 0.24, 0.0045);
  B(0, -0.82, 0.58, 0.2, child ? 0.002 : 0.006);
  // temple hollows
  B(0.85, 0.25, 0.4, 0.2, -0.003); B(-0.85, 0.25, 0.4, 0.2, -0.003);
  const jaw = child ? 0.3 : (P.female ? 0.34 : 0.1);
  if (!child && !P.female) { B(0.62, -0.62, 0.45, 0.22, 0.004); B(-0.62, -0.62, 0.45, 0.22, 0.004); }
  function shape(d, out) {
    let x = d.x * a, y = d.y * b, z = d.z * c;
    if (d.y < 0) { const k = d.y * d.y; x *= 1 - jaw * k; z *= 1 - 0.18 * k * (d.z > 0 ? 1 : 0.4); }
    if (d.z < 0) { z *= 1.06 + (child ? 0.04 : 0); }
    if (d.y > 0) { y *= child ? 1.02 : 1; }
    if (d.z > 0.2 && d.y > -0.6) z *= 1 - 0.05 * Math.pow(d.z, 6); // flatter face plane
    let r = 0;
    for (const bp of bumps) { const dd = d.distanceToSquared(bp.d); if (dd < bp.s2 * 9) r += bp.amp * Math.exp(-dd / bp.s2); }
    out.set(x + d.x * r, y + d.y * r, z + d.z * r);
    return out;
  }
  // surface point for a facial (x, y) in metres, front side
  const dir = V();
  function front(x, y, out) {
    const u = x / a, v = y / b;
    dir.set(u, v, Math.sqrt(Math.max(0.02, 1 - u * u - v * v))).normalize();
    for (let it = 0; it < 3; it++) { shape(dir, out); dir.x *= x / (out.x || 1e-6) || 1; dir.y *= y / (out.y || 1e-6) || 1; dir.normalize(); }
    return shape(dir, out);
  }
  return { a, b, c, shape, front };
}

// ---------------------------------------------------------------- the human
export class Human {
  constructor(kind, opts = {}) {
    const P = this.P = { ...preset(kind), ...opts };
    this.kind = kind;
    const R = rand(kind.length * 977 + (opts.seed || 1));
    this.R = R;
    const H = P.H;
    this.root = new THREE.Group(); this.root.name = kind;
    this.body = new THREE.Group(); this.root.add(this.body);
    const skin = this.skin = skinMats(P.skin);
    this.hairM = hairMat(P.hair);
    // proportions
    const child = P.child;
    const headH = child ? 0.196 : (P.female ? 0.222 : 0.235);
    const crotch = H * (child ? 0.45 : 0.47);
    const neckTop = H - headH * (child ? 0.96 : 0.92);
    const shoulderY = neckTop - (child ? 0.05 : 0.08);
    const pr = this.pr = {
      headH, crotch, neckTop, shoulderY,
      hipY: crotch + H * 0.05, waistY: crotch + H * (child ? 0.15 : 0.15), chestY: shoulderY - H * (child ? 0.08 : 0.1),
      shW: H * (child ? 0.115 : (P.female ? 0.112 : 0.13)), hipW: H * (child ? 0.085 : (P.female ? 0.11 : 0.1)),
      waistW: H * (child ? 0.085 : (P.female ? 0.077 : 0.09)), chestW: H * (child ? 0.09 : (P.female ? 0.095 : 0.11)),
      depth: H * (child ? 0.07 : 0.07),
      upper: H * (child ? 0.17 : 0.18), fore: H * (child ? 0.15 : 0.155), hand: H * (child ? 0.075 : 0.1),
      armR: H * (child ? 0.026 : 0.027), neckR: H * (child ? 0.032 : (P.female ? 0.029 : 0.034)),
    };
    this.buildTorso();
    this.buildLegs();
    this.arms = [this.buildArm(1), this.buildArm(-1)]; // [left(+x), right(-x)]
    this.buildHead();
    this.buildHair();
    // expression state
    this.ex = { smile: 0.2, open: 0, o: 0, brow: 0, browIn: 0, squint: 0, wide: 0, blink: 0, tilt: 0, nod: 0, turn: 0 };
    this.exT = { ...this.ex };
    this.look = null; // world target for eyes/head
    this.blinkT = 1 + R() * 3;
    this.t = R() * 10;
    this.breath = 1;
    this.root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    this.updateMouth(true);
  }

  // ------------------------------------------------ torso / clothes
  buildTorso() {
    const { P, pr } = this; const H = P.H;
    const d = pr.depth;
    const fem = P.female && !P.child;
    const rings = [
      { y: pr.crotch - 0.01, rx: pr.hipW * 0.55, rz: d * 0.6, capBulge: 0.02 },
      { y: pr.crotch + 0.03, rx: pr.hipW * 0.93, rz: d * 0.92, p: 2.3 },
      { y: pr.hipY, rx: pr.hipW, rz: d * 1.0, p: 2.4, back: 0.08 },
      { y: pr.waistY, rx: pr.waistW, rz: d * (P.child ? 1.02 : 0.9), p: 2.3, front: P.child ? 0.12 : (this.kind === 'papa' ? 0.12 : 0) },
      { y: lerp(pr.waistY, pr.chestY, 0.55), rx: lerp(pr.waistW, pr.chestW, 0.6), rz: d * 0.98, p: 2.4, front: fem ? 0.12 : 0.03 },
      { y: pr.chestY, rx: pr.chestW, rz: d * 1.02, p: 2.5, front: fem ? 0.16 : 0.05 },
      { y: pr.shoulderY - 0.045 * H / 1.1, rx: pr.shW * 0.95, rz: d * 0.9, p: 2.3 },
      { y: pr.shoulderY - 0.018 * H / 1.1, rx: pr.shW * 0.9, rz: d * 0.8, p: 2.2 },
      { y: pr.shoulderY + 0.002, rx: pr.shW * 0.72, rz: d * 0.66, p: 2.1 },
      { y: pr.shoulderY + 0.016, rx: pr.neckR * 2.3, rz: pr.neckR * 1.7 },
      { y: pr.shoulderY + 0.03, rx: pr.neckR * 1.3, rz: pr.neckR * 1.2 },
    ];
    this.torsoRings = rings;
    const top = this.P.top || { kind: 'tshirt', color: 0xffffff };
    const folds = (v, a) => 0.012 * Math.sin(a * 7 + v * 9) * smooth(0.05, 0.4, v) * (1 - smooth(0.6, 0.9, v)) + 0.008 * Math.sin(a * 3 + v * 20);
    const g = loftGeo(rings, 40, { capStart: true, disp: folds, uScale: 2, vScale: 1.5 });
    this.torso = new THREE.Mesh(g, clothMat(top.kind, top.color, top.rep || 2));
    this.body.add(this.torso);
    // neck
    const ng = loftGeo([
      { y: pr.shoulderY - 0.01, rx: pr.neckR * 1.25, rz: pr.neckR * 1.15 },
      { y: pr.neckTop - 0.02, rx: pr.neckR, rz: pr.neckR * 1.05 },
      { y: pr.neckTop + 0.03, rx: pr.neckR * 0.95, rz: pr.neckR * 1.05, z: 0.004 },
    ], 24);
    this.neck = new THREE.Mesh(ng, this.skin.body);
    this.body.add(this.neck);
    // collar rim of the T-shirt
    if (top.kind === 'tshirt' || top.kind === 'cloth3') {
      const cg = new THREE.TorusGeometry(pr.neckR * 1.32, 0.006, 8, 32);
      const cm = new THREE.Mesh(cg, clothMat(top.kind, top.color, 1));
      cm.rotation.x = Math.PI / 2 - 0.12; cm.position.set(0, pr.shoulderY + 0.03, 0.004); cm.scale.set(1, 1.0, 1);
      this.body.add(cm);
    }
  }

  // garment over torso (happi jacket). returns group, hidden by default
  buildHappi(mat, collarMat, beltMat) {
    const { pr, P } = this; const H = P.H; const d = pr.depth;
    const grp = new THREE.Group();
    const inflate = 0.014;
    const hem = pr.hipY - (P.child ? 0.05 : 0.08);
    const rings = [
      { y: hem, rx: pr.hipW + inflate * 2.4, rz: d + inflate * 2.2, p: 2.3 },
      { y: pr.hipY, rx: pr.hipW + inflate * 1.8, rz: d + inflate * 1.8, p: 2.4 },
      { y: pr.waistY, rx: Math.max(pr.waistW, pr.hipW * 0.94) + inflate * 1.4, rz: d * 1.02 + inflate * 1.6, p: 2.4, front: P.child ? 0.1 : 0.08 },
      { y: pr.chestY, rx: pr.chestW + inflate, rz: d * 1.02 + inflate, p: 2.5 },
      { y: pr.shoulderY - 0.035 * H / 1.1, rx: pr.shW + inflate * 0.9, rz: d * 0.88 + inflate, p: 2.6 },
      { y: pr.shoulderY + 0.01, rx: pr.shW * 0.8 + inflate * 0.6, rz: d * 0.72 + inflate * 0.8, p: 2.4 },
      { y: pr.shoulderY + 0.03, rx: pr.neckR * 2.25, rz: pr.neckR * 1.75 },
    ];
    const folds = (v, a) => 0.02 * Math.sin(a * 9 + v * 4) * (1 - v) * 0.7 + 0.012 * Math.sin(a * 5 - v * 13) + 0.01 * Math.sin(a * 17) * (1 - v);
    const g = loftGeo(rings, 48, { disp: folds, uScale: 2.2, vScale: 1.3 });
    const body = new THREE.Mesh(g, mat); grp.add(body);
    // collar band (eri): V from back of neck over shoulders down the front
    const out = (p, o) => o.set(p.x, 0, p.z).normalize();
    for (const s of [1, -1]) {
      const pts = [
        V(0, pr.shoulderY + 0.035, -pr.neckR * 1.9),
        V(s * pr.neckR * 1.9, pr.shoulderY + 0.03, -pr.neckR * 0.6),
        V(s * pr.neckR * 1.7, pr.shoulderY + 0.012, pr.neckR * 1.3),
        V(s * pr.neckR * 0.95, pr.chestY + 0.01, d * 1.02 + inflate * 1.9),
        V(s * pr.neckR * 0.35, pr.waistY, d * (1.12) + inflate * 2.2 + (P.child ? 0.006 : 0)),
        V(s * pr.neckR * 0.25, hem + 0.004, d + inflate * 2.5),
      ];
      const rg = ribbonGeo(pts, H * 0.03, out, { segs: 34, offset: 0.004, vScale: 6 });
      const m = new THREE.Mesh(rg, collarMat); grp.add(m);
    }
    // sash
    const sg = loftGeo([
      { y: pr.waistY - H * 0.022, rx: Math.max(pr.waistW, pr.hipW * 0.94) + inflate * 1.9, rz: d * 1.02 + inflate * 2.1, p: 2.4, front: P.child ? 0.1 : 0.08 },
      { y: pr.waistY + H * 0.022, rx: Math.max(pr.waistW, pr.hipW * 0.94) + inflate * 1.9, rz: d * 1.02 + inflate * 2.1, p: 2.4, front: P.child ? 0.1 : 0.08 },
    ], 40, { uScale: 6 });
    const sash = new THREE.Mesh(sg, beltMat); grp.add(sash);
    // knot of the sash at the front-side
    const kg = new THREE.SphereGeometry(H * 0.022, 16, 10);
    const knot = new THREE.Mesh(kg, beltMat); knot.scale.set(1.3, 0.8, 0.7);
    knot.position.set(pr.waistW * 0.6, pr.waistY, d * 1.15 + inflate * 2.3); grp.add(knot);
    for (const s of [-1, 1]) {
      const tail = new THREE.Mesh(ribbonGeo([V(0, 0, 0), V(s * 0.012, -0.04, 0.008), V(s * 0.02, -0.08, 0.004)].map(p => p.add(knot.position)), H * 0.022, (p, o) => o.set(0, 0, 1)), beltMat);
      grp.add(tail);
    }
    // sleeves attach to arms
    const sleeves = [];
    for (const arm of this.arms) {
      const L = pr.upper;
      const sr = [
        { y: 0.03, rx: pr.armR * 1.9, rz: pr.armR * 2.0 },
        { y: -L * 0.3, rx: pr.armR * 2.1, rz: pr.armR * 2.25 },
        { y: -L * 0.75, rx: pr.armR * 2.3, rz: pr.armR * 2.6 },
        { y: -L * 0.98, rx: pr.armR * 2.45, rz: pr.armR * 2.8, z: 0.006 },
      ];
      const sfold = (v, a) => 0.06 * Math.sin(a * 6 + v * 5) * v + 0.03 * Math.sin(a * 11);
      const sg2 = loftGeo(sr, 32, { disp: sfold, uScale: 1, vScale: 0.6 });
      const sm = new THREE.Mesh(sg2, mat); arm.shoulder.add(sm); sleeves.push(sm);
      sm.castShadow = sm.receiveShadow = true;
    }
    grp.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
    this.body.add(grp);
    this.happi = { grp, sleeves };
    return this.happi;
  }

  buildLegs() {
    const { P, pr } = this; const H = P.H;
    const bottom = P.bottom || { kind: 'pants', color: 0xffffff, shorts: true };
    const legX = pr.hipW * 0.5;
    const thighR = H * (P.child ? 0.05 : 0.055), kneeY = pr.crotch * 0.52, ankleY = H * 0.045;
    this.legs = [];
    const mk = (s) => {
      const hip = new THREE.Group(); hip.position.set(s * legX, pr.crotch, 0); this.body.add(hip);
      this.legs.push(hip);
      const rel = (r) => ({ ...r, x: (r.x || 0) - s * legX, y: r.y - pr.crotch });
      const rings = [
        { y: pr.crotch + 0.04, rx: thighR * 1.05, rz: thighR * 1.1, x: s * legX * 0.9 },
        { y: pr.crotch - 0.04, rx: thighR, rz: thighR * 1.05, x: s * legX },
        { y: lerp(pr.crotch, kneeY, 0.5), rx: thighR * 0.86, rz: thighR * 0.9, x: s * legX * 1.0 },
        { y: kneeY + 0.02, rx: thighR * 0.66, rz: thighR * 0.7, x: s * legX * 0.95 },
        { y: kneeY - 0.06, rx: thighR * 0.66, rz: thighR * 0.72, x: s * legX * 0.93, z: -0.006 },
        { y: lerp(kneeY, ankleY, 0.5), rx: thighR * 0.55, rz: thighR * 0.6, x: s * legX * 0.9 },
        { y: ankleY + 0.02, rx: thighR * 0.4, rz: thighR * 0.42, x: s * legX * 0.9 },
      ].map(rel);
      const skinLeg = new THREE.Mesh(loftGeo(rings, 20), this.skin.body); hip.add(skinLeg);
      // shoe
      const sh = new THREE.Mesh(loftGeo([
        { y: 0.001, rx: H * 0.03, rz: H * 0.075, z: H * 0.025, p: 2.6 },
        { y: H * 0.03, rx: H * 0.032, rz: H * 0.072, z: H * 0.022, p: 2.6 },
        { y: H * 0.05, rx: H * 0.026, rz: H * 0.04, z: 0.0, p: 2.2 },
      ], 24, { capStart: true, capEnd: true }), clothMat('pants', bottom.shoe || 0x3a2e28, 1));
      sh.position.set(s * legX * 0.9 - s * legX, -pr.crotch, 0); hip.add(sh);
      if (bottom.skirt) return;
      const cut = bottom.shorts ? 4 : 7;
      const pr2 = rings.slice(0, cut).map(r => ({ ...r, rx: r.rx * 1.18 + 0.004, rz: r.rz * 1.18 + 0.004 }));
      const fold = (v, a) => 0.03 * Math.sin(a * 5 + v * 30) * v;
      const pm = new THREE.Mesh(loftGeo(pr2, 24, { disp: fold }), clothMat(bottom.kind, bottom.color, 2));
      hip.add(pm);
    };
    mk(1); mk(-1);
    if (bottom.skirt) {
      const rings = [
        { y: pr.waistY + 0.01, rx: pr.waistW * 1.05, rz: pr.depth * 1.0 },
        { y: pr.hipY, rx: pr.hipW * 1.12, rz: pr.depth * 1.15 },
        { y: pr.crotch * 0.8, rx: pr.hipW * 1.35, rz: pr.depth * 1.45 },
        { y: bottom.len || pr.crotch * 0.4, rx: pr.hipW * 1.55, rz: pr.depth * 1.7 },
      ];
      const fold = (v, a) => 0.07 * Math.sin(a * 10) * v * v + 0.02 * Math.sin(a * 23) * v;
      const g = loftGeo(rings, 48, { disp: fold, vScale: 1.5, uScale: 3 });
      const m = new THREE.Mesh(g, clothMat(bottom.kind, bottom.color, 2, { side: THREE.DoubleSide }));
      this.body.add(m);
    }
  }

  // s = +1 (character's left, +x) / -1 (right, -x)
  buildArm(s) {
    const { P, pr } = this; const H = P.H;
    const shoulder = new THREE.Group();
    shoulder.position.set(s * (pr.shW - pr.armR * 1.25), pr.shoulderY - 0.03 * H / 1.1, -0.004);
    this.body.add(shoulder);
    const r = pr.armR, L1 = pr.upper, L2 = pr.fore;
    const top = this.P.top || {};
    const sleeveLen = top.longSleeve ? 1.05 : 0.45;
    const upRings = [
      { y: -0.004, rx: r * 0.9, rz: r * 1.0 }, { y: -0.012, rx: r * 1.15, rz: r * 1.2 },
      { y: -L1 * 0.3, rx: r * 1.1, rz: r * 1.12 }, { y: -L1 * 0.75, rx: r * 0.92, rz: r * 0.95 },
      { y: -L1, rx: r * 0.8, rz: r * 0.82 },
    ];
    const upper = new THREE.Mesh(loftGeo(upRings, 20), this.skin.body); shoulder.add(upper);
    // sleeve (T-shirt or long)
    const slv = [{ y: 0.018, rx: r * 1.05, rz: r * 1.15, x: -s * r * 0.3 }, { y: -0.004, rx: r * 1.4, rz: r * 1.45 }, ...upRings.slice(2).filter(q => q.y >= -L1 * sleeveLen - 0.01).map(q => ({ ...q, rx: q.rx * 1.3 + 0.003, rz: q.rz * 1.3 + 0.003 }))];
    if (!top.longSleeve) slv.push({ y: -L1 * sleeveLen, rx: r * 1.42, rz: r * 1.48 });
    const sleeve = new THREE.Mesh(loftGeo(slv, 24, { disp: (v, a) => 0.05 * Math.sin(a * 4 + v * 6) * v, flip: false }), clothMat(top.kind || 'tshirt', top.color || 0xffffff, 1, { side: THREE.DoubleSide }));
    shoulder.add(sleeve);
    const elbow = new THREE.Group(); elbow.position.set(0, -L1, 0); shoulder.add(elbow);
    const ej = new THREE.Mesh(new THREE.SphereGeometry(r * 0.8, 14, 10), top.longSleeve ? sleeve.material : this.skin.body); elbow.add(ej);
    const foreRings = [
      { y: 0.0, rx: r * 0.8, rz: r * 0.82 }, { y: -L2 * 0.25, rx: r * 0.88, rz: r * 0.8 },
      { y: -L2 * 0.8, rx: r * 0.62, rz: r * 0.5 }, { y: -L2, rx: r * 0.55, rz: r * 0.42 },
    ];
    const fore = new THREE.Mesh(loftGeo(foreRings, 20), this.skin.body); elbow.add(fore);
    if (top.longSleeve) {
      const fs = new THREE.Mesh(loftGeo(foreRings.slice(0, 3).map(q => ({ ...q, rx: q.rx * 1.4 + 0.004, rz: q.rz * 1.45 + 0.004 })), 20,
        { disp: (v, a) => 0.06 * Math.sin(a * 5 + v * 9) }), sleeve.material);
      elbow.add(fs);
    }
    const wrist = new THREE.Group(); wrist.position.set(0, -L2, 0); elbow.add(wrist);
    const handOpen = new THREE.Mesh(this.handGeo(s, 0.25), this.skin.body);
    const handGrip = new THREE.Mesh(this.handGeo(s, 1.0), this.skin.body);
    handGrip.visible = false;
    wrist.add(handOpen, handGrip);
    // rest pose
    shoulder.rotation.set(0.05, 0, s * 0.09);
    elbow.rotation.set(-0.25, 0, 0);
    const arm = { s, shoulder, elbow, wrist, handOpen, handGrip, L1, L2, ik: 0, ikTarget: V(), pole: V(), rest: [shoulder.quaternion.clone(), elbow.quaternion.clone()], grip: 0 };
    return arm;
  }

  handGeo(s, curl) {
    const { pr } = this; const L = pr.hand; const w = pr.armR * 1.45;
    const parts = [];
    // palm
    parts.push(loftGeo([
      { y: 0, rx: pr.armR * 0.55, rz: pr.armR * 0.42 },
      { y: -L * 0.2, rx: w * 0.9, rz: pr.armR * 0.42 },
      { y: -L * 0.5, rx: w, rz: pr.armR * 0.4, p: 2.6 },
    ], 16, { capEnd: true }));
    // fingers
    const fl = [0.48, 0.54, 0.5, 0.4];
    for (let f = 0; f < 4; f++) {
      const x = (f - 1.5) / 1.5 * w * 0.72 * -s;
      const len = L * fl[f];
      const fr = w * 0.2 * (f === 3 ? 0.85 : 1);
      const segs = [];
      let p = V(x, -L * 0.48, 0), dir = V(0, -1, 0);
      const pts = [p.clone()];
      for (let k = 0; k < 3; k++) {
        dir.applyAxisAngle(V(1, 0, 0), (0.25 + curl * 0.75) * (k === 0 ? 0.6 : 1.0));
        p = p.clone().addScaledVector(dir, len / 3); pts.push(p);
      }
      const g = clumpGeo(pts, fr, fr * 0.9, (pt, o) => o.set(0, 0, 1), { segs: 8, around: 8, taper: t => 1 - t * 0.25 });
      segs.push(g);
      parts.push(...segs);
      const tip = new THREE.SphereGeometry(fr * 0.78, 8, 6); tip.translate(p.x, p.y, p.z); parts.push(tip);
    }
    // thumb
    const tp = [V(-s * w * 0.65, -L * 0.12, pr.armR * 0.2), V(-s * w * 1.05, -L * 0.3, pr.armR * 0.6), V(-s * w * (1.0 - curl * 0.3), -L * 0.46, pr.armR * (0.9 + curl * 0.6))];
    parts.push(clumpGeo(tp, w * 0.24, w * 0.22, (pt, o) => o.set(-s, 0, 0.3), { segs: 8, around: 8, taper: t => 1 - t * 0.3 }));
    const g = mergeGeos(parts.map(p => { if (p.index === null) return p; return p; }));
    g.computeVertexNormals();
    return g;
  }

  // ------------------------------------------------ head & face
  buildHead() {
    const { P, pr } = this;
    const hs = this.hs = makeHeadShape(P);
    const neckPivot = this.neckPivot = new THREE.Group();
    neckPivot.position.set(0, pr.neckTop, 0.004); this.body.add(neckPivot);
    const head = this.head = new THREE.Group();
    head.position.set(0, hs.b * (P.child ? 0.74 : 0.66), hs.c * (P.child ? 0.12 : 0.22)); neckPivot.add(head);
    // sculpted skin
    const g = new THREE.SphereGeometry(1, 72, 56);
    const pos = g.attributes.position; const d = V(), o = V();
    const col = new Float32Array(pos.count * 3);
    const blushC = new THREE.Color(1.0, 0.72, 0.68), lipC = new THREE.Color(0.98, 0.66, 0.62);
    for (let i = 0; i < pos.count; i++) {
      d.set(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
      hs.shape(d, o); pos.setXYZ(i, o.x, o.y, o.z);
      // colour: blush, lips area warm, nostrils dark, eyelid rim
      let r = 1, gg = 1, b = 1;
      const bl = Math.exp(-((Math.abs(d.x) - 0.5) ** 2 + (d.y + 0.33) ** 2) / 0.03) * (d.z > 0.4 ? 1 : 0) * (P.child ? 0.75 : 0.35);
      r = lerp(r, blushC.r, bl); gg = lerp(gg, blushC.g, bl); b = lerp(b, blushC.b, bl);
      const ns = Math.exp(-((Math.abs(d.x) - 0.065) ** 2 + (d.y + 0.245) ** 2) / 0.0012) * (d.z > 0.8 ? 1 : 0);
      r *= 1 - ns * 0.6; gg *= 1 - ns * 0.7; b *= 1 - ns * 0.7;
      const ey = Math.exp(-((Math.abs(d.x) - 0.36) ** 2 * 0.7 + (d.y - 0.03) ** 2) / 0.012) * (d.z > 0.6 ? 1 : 0);
      r *= 1 - ey * 0.06; gg *= 1 - ey * 0.12; b *= 1 - ey * 0.1;
      if (P.kind === 'papa') { const st = smooth(-0.2, -0.55, d.y) * (d.z > -0.2 ? 1 : 0) * (1 - Math.exp(-((d.y + 0.52) ** 2 + d.x * d.x) / 0.02)); r *= 1 - st * 0.12; gg *= 1 - st * 0.12; b *= 1 - st * 0.08; }
      col[i * 3] = r; col[i * 3 + 1] = gg; col[i * 3 + 2] = b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    this.headMesh = new THREE.Mesh(g, this.skin.head); head.add(this.headMesh);
    // ears
    for (const s of [1, -1]) {
      const eg = new THREE.SphereGeometry(1, 20, 14);
      const ep = eg.attributes.position;
      for (let i = 0; i < ep.count; i++) {
        let x = ep.getX(i), y = ep.getY(i), z = ep.getZ(i);
        const rim = Math.sqrt(y * y + z * z);
        x = x * 0.25 - (x > 0 ? 0.18 * (1 - rim) : 0); // cupped
        ep.setXYZ(i, x, y, z);
      }
      eg.computeVertexNormals();
      const em = new THREE.Mesh(eg, this.skin.body);
      const sc = P.child ? 0.021 : 0.026;
      em.scale.set(sc * s, sc * 1.35, sc * 0.95);
      em.position.set(s * hs.a * 0.97, -hs.b * 0.06, -hs.c * 0.06);
      em.rotation.set(0, s * 0.35, s * -0.08);
      head.add(em);
    }
    // eyes
    const eyeR = P.child ? 0.0128 : 0.0118;
    const eyeX = P.child ? 0.029 : 0.032, eyeY = P.child ? -0.004 : 0.004;
    const eyeMat = new THREE.MeshPhysicalMaterial({ map: eyeTexture(P.iris), roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.3 });
    const lidMat = this.skin.body;
    const lashMat = new THREE.MeshStandardMaterial({ color: 0x140c0a, roughness: 0.6 });
    this.eyes = [];
    for (const s of [1, -1]) {
      const surf = hs.front(s * eyeX, eyeY, V());
      const grp = new THREE.Group();
      grp.position.set(s * eyeX, eyeY, surf.z - eyeR * 0.5);
      head.add(grp);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(eyeR, 32, 24), eyeMat);
      ball.rotation.x = Math.PI / 2; // pole -> +z
      const look = new THREE.Group(); look.add(ball); grp.add(look);
      // highlight (kawaii catchlight)
      const cl = new THREE.Mesh(new THREE.CircleGeometry(eyeR * 0.16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, toneMapped: false }));
      cl.position.set(-eyeR * 0.28, eyeR * 0.32, eyeR * 0.96); look.add(cl);
      // lids
      const lidR = eyeR * 1.1;
      const up = new THREE.Mesh(new THREE.SphereGeometry(lidR, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), lidMat);
      const lo = new THREE.Mesh(new THREE.SphereGeometry(lidR * 0.995, 28, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), lidMat);
      const upG = new THREE.Group(); upG.add(up); grp.add(upG);
      const loG = new THREE.Group(); loG.add(lo); grp.add(loG);
      // lashes: arc along upper lid edge (front half)
      const lp = [];
      for (let k = 0; k <= 10; k++) { const a = Math.PI * (k / 10); lp.push(V(Math.cos(a) * lidR * 1.01, 0.0005 + (P.female ? 0.0006 : 0) * Math.sin(a * 0.5 + (s > 0 ? 0 : Math.PI * 0.5)), Math.sin(a) * lidR * 1.01)); }
      const lash = new THREE.Mesh(clumpGeo(lp, P.female ? 0.0011 : 0.0007, P.female ? 0.0011 : 0.0007, (p, o) => o.copy(p).normalize(), { taper: t => 0.5 + Math.sin(t * Math.PI) * 0.6, segs: 16, around: 5 }), lashMat);
      upG.add(lash);
      // outer corner flick for girls
      if (P.female) {
        const fp = [V(-s * lidR * 0.92, 0, lidR * 0.3), V(-s * lidR * 1.15, lidR * 0.12, lidR * 0.22)];
        // (simple tiny strand)
        const fl = new THREE.Mesh(clumpGeo([fp[0], fp[0].clone().lerp(fp[1], 0.5), fp[1]], 0.0009, 0.0006, (p, o) => o.set(0, 0, 1), { segs: 4, around: 4 }), lashMat);
        upG.add(fl);
      }
      this.eyes.push({ grp, look, upG, loG, s, R: eyeR });
    }
    // brows
    this.brows = [];
    const browMat = new THREE.MeshPhysicalMaterial({ color: this.P.hair, roughness: 0.7, sheen: 0.4, sheenColor: new THREE.Color(this.P.hair).multiplyScalar(2) });
    for (const s of [1, -1]) {
      const pts = [];
      for (let k = 0; k <= 6; k++) {
        const x = s * (eyeX - eyeR * 1.0 + k / 6 * eyeR * 2.5);
        const y = eyeY + eyeR * 1.75 + Math.sin(k / 6 * Math.PI) * eyeR * 0.28 - (k / 6) * eyeR * 0.15;
        pts.push(hs.front(x, y, V()).addScaledVector(V(0, 0, 1), 0.0012));
      }
      const g2 = clumpGeo(pts, P.child ? 0.0022 : 0.0028, 0.0011, (p, o) => o.set(0, 0.2, 1), { taper: t => 0.75 + 0.4 * Math.sin(Math.min(1, t * 1.6) * Math.PI * 0.5) - t * 0.5, segs: 10, around: 6 });
      const pivot = new THREE.Group();
      const cx = s * (eyeX + eyeR * 0.25), cy = eyeY + eyeR * 1.8;
      pivot.position.set(cx, cy, 0);
      g2.translate(-cx, -cy, 0);
      const bm = new THREE.Mesh(g2, browMat); pivot.add(bm); head.add(pivot);
      this.brows.push({ pivot, s, y0: cy });
    }
    // mouth: dynamic interior + lips
    this.mouth = this.buildMouth();
    // nose shading helper is in vertex colours; cheeks in sculpt.
    this.eyeR = eyeR;
  }

  buildMouth() {
    const { P } = this; const hs = this.hs;
    const NX = 18, NY = 6;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((NX + 1) * (NY + 1) * 3), 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array((NX + 1) * (NY + 1) * 3), 3));
    const idx = [];
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    g.setIndex(idx);
    const inner = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 }));
    this.head.add(inner);
    const lipM = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(P.skin).lerp(new THREE.Color(P.child ? 0xe58a86 : (P.female ? 0xc8605e : 0xb9786a)), P.female || P.child ? 0.55 : 0.4), roughness: 0.38, clearcoat: 0.3, sheen: 0.3, sheenColor: new THREE.Color(1, 0.6, 0.6) });
    const mkLip = () => {
      const N = 16, M = 6;
      const lg = new THREE.BufferGeometry();
      lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array((N + 1) * (M + 1) * 3), 3));
      const li = [];
      for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) { const a = i * (M + 1) + j, b = a + 1, c = a + M + 1, d = c + 1; li.push(a, b, c, b, d, c); }
      lg.setIndex(li);
      const m = new THREE.Mesh(lg, lipM); this.head.add(m);
      return { m, N, M };
    };
    const w0 = P.child ? 0.0145 : (P.female ? 0.02 : 0.022);
    const my = -hs.b * (P.child ? 0.47 : 0.52);
    return { inner, NX, NY, up: mkLip(), lo: mkLip(), w0, my, last: '' };
  }

  updateMouth(force) {
    const ex = this.ex, M = this.mouth, hs = this.hs;
    const key = [ex.smile, ex.open, ex.o].map(v => v.toFixed(3)).join();
    if (!force && key === M.last) return; M.last = key;
    const w = M.w0 * (1 + 0.28 * Math.max(0, ex.smile) - 0.38 * ex.o);
    const lift = ex.smile * w * 0.38;
    const openH = (ex.open * 1.05 + ex.o * 0.7) * w;
    const yu = (t) => M.my + lift * t * t + openH * 0.18 * (1 - t * t) - (1 - ex.o) * 0.0006 * Math.cos(t * Math.PI * 1.5);
    const yl = (t) => M.my + lift * t * t * (1 - ex.open * 0.3) - openH * Math.pow(Math.max(0, 1 - t * t), 0.65 + ex.o * 0.2) - 0.0004;
    const P = M.inner.geometry.attributes.position, C = M.inner.geometry.attributes.color;
    const p = V();
    const dark = [0.12, 0.03, 0.03], teeth = [0.92, 0.9, 0.86], tongue = [0.75, 0.3, 0.3];
    for (let j = 0; j <= M.NY; j++) for (let i = 0; i <= M.NX; i++) {
      const t = i / M.NX * 2 - 1, v = j / M.NY;
      const x = t * w;
      const y = lerp(yu(t), yl(t), v);
      hs.front(x, y, p);
      const k = j * (M.NX + 1) + i;
      const depth = Math.sin(v * Math.PI) * (1 - t * t) * openH * 0.25;
      P.setXYZ(k, p.x * 0.995, p.y, p.z + 0.0007 - depth);
      let c = dark;
      const op = smooth(0.05, 0.35, ex.open);
      if (v < 0.28 && Math.abs(t) < 0.75 && op > 0) c = mix3(dark, teeth, op * smooth(0.28, 0.12, v) * smooth(0.8, 0.5, Math.abs(t)));
      else if (v > 0.65) c = mix3(dark, tongue, op * smooth(0.65, 0.95, v) * (1 - Math.abs(t)));
      C.setXYZ(k, c[0], c[1], c[2]);
    }
    P.needsUpdate = true; C.needsUpdate = true;
    M.inner.geometry.computeVertexNormals();
    M.inner.geometry.computeBoundingSphere();
    // lips: tubes along curve, thicker in the middle
    const lipT = this.P.child ? 0.0021 : 0.0026;
    const doLip = (L, fy, upper) => {
      const pa = L.m.geometry.attributes.position;
      for (let i = 0; i <= L.N; i++) {
        const t = i / L.N * 2.04 - 1.02;
        const x = t * w;
        const y = fy(Math.max(-1, Math.min(1, t)));
        hs.front(x, y, p);
        const thick = lipT * (0.35 + 0.75 * Math.pow(Math.max(0, 1 - t * t), 0.6)) * (upper ? 0.9 : 1.15) * (1 - Math.max(0, ex.smile) * 0.25);
        for (let j = 0; j <= L.M; j++) {
          const a = j / L.M * Math.PI * 2;
          const k = i * (L.M + 1) + j;
          const cy = Math.cos(a) * thick * 0.85 + (upper ? thick * 0.5 : -thick * 0.55);
          const cz = Math.sin(a) * thick * 0.55;
          pa.setXYZ(k, p.x, p.y + cy, p.z + cz + 0.0002);
        }
      }
      pa.needsUpdate = true; L.m.geometry.computeVertexNormals(); L.m.geometry.computeBoundingSphere();
    };
    doLip(M.up, yu, true); doLip(M.lo, yl, false);
  }

  // ------------------------------------------------ hair
  buildHair() {
    const { P } = this; const hs = this.hs; const style = P.hairStyle;
    const thick = P.child ? 0.010 : 0.009;
    const g = new THREE.SphereGeometry(1, 64, 44);
    const pos = g.attributes.position; const d = V(), o = V();
    const hairline = (dd) => {
      // 1 => hair, 0 => skin
      if (style === 'bun' || style === 'short' || style === 'crop') {
        const front = smooth(style === 'crop' ? 0.5 : 0.42, style === 'crop' ? 0.6 : 0.52, dd.y + 0.25 * Math.max(0, -dd.z) + 0.12 * Math.abs(dd.x));
        const nape = smooth(-0.62, -0.45, dd.y);
        const ear = 1 - Math.exp(-((Math.abs(dd.x) - 0.95) ** 2 + (dd.y + 0.12) ** 2 + (dd.z + 0.05) ** 2) / 0.04);
        return Math.min(dd.z > 0.1 ? front : nape, ear);
      }
      const front = smooth(0.36, 0.48, dd.y + 0.28 * Math.max(0, -dd.z + 0.2) + 0.15 * dd.x * dd.x);
      const back = smooth(-0.72, -0.55, dd.y);
      const ear = 1 - Math.exp(-((Math.abs(dd.x) - 0.95) ** 2 + (dd.y + 0.12) ** 2 + (dd.z + 0.02) ** 2) / 0.035);
      return Math.min(dd.z > 0.2 ? front : back, ear);
    };
    for (let i = 0; i < pos.count; i++) {
      d.set(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
      hs.shape(d, o);
      const m = hairline(d);
      const vol = (style === 'short' ? 0.75 : style === 'crop' ? 0.6 : 1) * thick * (0.65 + 0.35 * smooth(-0.2, 0.7, d.y));
      const k = m > 0.01 ? (vol * m) : -0.004;
      o.addScaledVector(d, k);
      pos.setXYZ(i, o.x, o.y, o.z);
    }
    g.computeVertexNormals();
    const cap = new THREE.Mesh(g, this.hairM); this.head.add(cap);
    // strand clumps
    const R = this.R; const geos = [];
    const center = V(0, 0, 0);
    const out = (p, oo) => oo.copy(p).sub(center).normalize();
    const surf = (x, y, z, extra = 0) => { const dd = V(x, y, z).normalize(); const pp = hs.shape(dd, V()); return pp.addScaledVector(dd, thick * 0.6 + extra); };
    if (style === 'pigtails' || style === 'bob') {
      // bangs: from crown-front sweeping down over the forehead
      const n = 11;
      for (let i = 0; i < n; i++) {
        const u = (i / (n - 1) - 0.5) * 1.5; // -0.75..0.75
        const p0 = surf(u * 0.4, 0.9, 0.35, 0.002);
        const p1 = surf(u * 0.75, 0.66, 0.72, 0.004);
        const p2 = surf(u * 0.9, 0.43, 0.9, 0.004);
        const tipY = 0.24 + R() * 0.06 + Math.abs(u) * 0.05;
        const p3 = surf(u * 0.95 + (R() - 0.5) * 0.08, tipY, 0.97, 0.0045);
        geos.push(clumpGeo([p0, p1, p2, p3], 0.0105 + R() * 0.004, 0.0035, out, { uOff: R(), vScale: 1 }));
      }
      // side locks in front of ears
      for (const s of [1, -1]) for (let k = 0; k < 3; k++) {
        const z = 0.25 + k * 0.12;
        const p0 = surf(s * 0.75, 0.55, z); const p1 = surf(s * 0.98, 0.0, z * 0.8, 0.004); const p2 = surf(s * 0.95, -0.45 - (style === 'bob' ? 0.4 : 0), z * 0.7, 0.008);
        if (style === 'bob') p2.y -= 0.02;
        geos.push(clumpGeo([p0, p1, p2], 0.011, 0.004, out, { uOff: R() }));
      }
    }
    if (style === 'pigtails') {
      this.ties = [];
      for (const s of [1, -1]) {
        const base = surf(s * 0.8, 0.12, -0.45, 0.004);
        const tieM = new THREE.MeshPhysicalMaterial({ color: 0xb0222a, roughness: 0.35, clearcoat: 0.6 });
        const tie = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 16, 12), tieM);
        tie.position.copy(base).add(V(s * 0.006, 0, -0.004)); this.head.add(tie);
        const tie2 = tie.clone(); tie2.position.add(V(0, 0.012, -0.004)); this.head.add(tie2);
        // gather lines toward the tie
        for (let k = 0; k < 7; k++) {
          const a = k / 6;
          const from = surf(s * (0.2 + a * 0.4), 0.85 - a * 0.5, -0.1 - a * 0.5);
          geos.push(clumpGeo([from, from.clone().lerp(base, 0.5).add(V(s * 0.002, 0, -0.003)), base], 0.012, 0.003, out, { taper: t => 1 - t * 0.6, uOff: R() }));
        }
        // the tail itself: curved bunch falling outward and down
        for (let k = 0; k < 9; k++) {
          const sp = (R() - 0.5) * 0.018, sp2 = (R() - 0.5) * 0.02;
          const len = 0.11 + R() * 0.04;
          const pts = [
            base.clone().add(V(s * 0.006, 0.002, -0.006)),
            base.clone().add(V(s * (0.03 + sp * 0.5), -0.018, -0.022 + sp2 * 0.4)),
            base.clone().add(V(s * (0.045 + sp), -len * 0.55, -0.02 + sp2)),
            base.clone().add(V(s * (0.035 + sp * 1.5), -len, 0.0 + sp2 * 1.5)),
            base.clone().add(V(s * (0.048 + sp * 1.5), -len - 0.018, 0.012 + sp2)),
          ];
          const thick2 = 0.009 + R() * 0.004;
          geos.push(clumpGeo(pts, thick2, thick2 * 0.75, (p, oo) => oo.set(s, 0, -0.3).normalize(), { taper: t => (1 - t * 0.85) * (0.75 + 0.35 * Math.sin(Math.min(1, t * 4) * 1.57)), uOff: R(), segs: 16 }));
        }
      }
    }
    if (style === 'short') {
      for (let i = 0; i < 26; i++) {
        const a = R() * Math.PI * 2, el = 0.35 + R() * 0.55;
        const x = Math.cos(a) * Math.sqrt(1 - el * el), z = Math.sin(a) * Math.sqrt(1 - el * el);
        if (z > 0.55 && el < 0.55) continue;
        const p0 = surf(x * 0.5, el + 0.1, z * 0.5, -0.002);
        const p1 = surf(x, el, z, 0.004);
        const p2 = surf(x * 1.05, el - 0.18, z * 1.05 + (z > 0.4 ? 0.05 : 0), 0.0035);
        geos.push(clumpGeo([p0, p1, p2], 0.012, 0.004, out, { uOff: R() }));
      }
      // fringe
      for (let i = 0; i < 7; i++) {
        const u = (i / 6 - 0.5) * 1.2;
        geos.push(clumpGeo([surf(u * 0.4, 0.85, 0.4), surf(u * 0.8, 0.62, 0.78, 0.004), surf(u * 0.9 + 0.05, 0.5, 0.88, 0.003)], 0.012, 0.0035, out, { uOff: R() }));
      }
    }
    if (style === 'crop') {
      for (let i = 0; i < 30; i++) {
        const a = R() * Math.PI * 2, el = 0.45 + R() * 0.45;
        const x = Math.cos(a) * Math.sqrt(1 - el * el), z = Math.sin(a) * Math.sqrt(1 - el * el);
        if (z > 0.6 && el < 0.6) continue;
        const p0 = surf(x, el, z, 0.0);
        const p1 = surf(x * 0.9, el + 0.08, z * 0.9 - 0.12, 0.003);
        const p2 = surf(x * 0.85, el + 0.02, z * 0.85 - 0.3, 0.002);
        geos.push(clumpGeo([p0, p1, p2], 0.011, 0.0035, out, { uOff: R() }));
      }
      // front quiff rising from the hairline and swept back
      for (let i = 0; i < 7; i++) {
        const u = (i / 6 - 0.5) * 1.0;
        geos.push(clumpGeo([surf(u * 0.7, 0.56, 0.8, 0.001), surf(u * 0.65, 0.75, 0.62, 0.007), surf(u * 0.5, 0.9, 0.3, 0.004)], 0.013, 0.004, out, { uOff: R() }));
      }
    }
    if (style === 'bun') {
      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.036, 28, 20), this.hairM);
      bun.position.copy(surf(0, 0.55, -0.85, 0.018)); bun.scale.set(1, 0.85, 0.85); this.head.add(bun);
      for (let i = 0; i < 16; i++) {
        const a = i / 16 * Math.PI * 2;
        const p0 = surf(Math.cos(a) * 0.6, 0.35 + Math.sin(a) * 0.2, 0.5 - Math.abs(Math.sin(a)) * 0.6);
        geos.push(clumpGeo([p0, p0.clone().lerp(bun.position, 0.5).addScaledVector(out(p0, V()), 0.006), bun.position.clone()], 0.012, 0.004, out, { taper: t => 1 - t * 0.5, uOff: R() }));
      }
    }
    if (geos.length) {
      const hm = new THREE.Mesh(mergeGeos(geos), this.hairM);
      this.head.add(hm);
    }
    // fine flyaway hairs: thin lit strands that soften the silhouette and catch the rim light
    {
      const NS = style === 'short' ? 520 : 700, PT = 4;
      const pos = new Float32Array(NS * (PT - 1) * 2 * 3), nor = new Float32Array(pos.length), col = new Float32Array(pos.length), al = new Float32Array(pos.length / 3);
      const hc = new THREE.Color(P.hair);
      let v = 0, made = 0, guard = 0;
      while (made < NS && guard++ < NS * 20) {
        const dd = V(R() * 2 - 1, R() * 2 - 1, R() * 2 - 1); if (dd.lengthSq() > 1) continue; dd.normalize();
        if (hairline(dd) < 0.9) continue;
        const base = hs.shape(dd, V()).addScaledVector(dd, thick * (style === 'short' ? 0.7 : 0.95));
        // strands flow down & back from the crown, slightly outward
        const flow = V(dd.x * 0.3, -1, dd.z * 0.3 - 0.25).normalize();
        flow.addScaledVector(dd, -flow.dot(dd)).normalize();
        const L = (style === 'short' ? 0.012 : 0.025) * (0.5 + R());
        const pts = [base];
        for (let k = 1; k < PT; k++) { const q = pts[k - 1].clone().addScaledVector(flow, L / (PT - 1)).addScaledVector(dd, 0.0012 * k * R()); pts.push(q); }
        for (let k = 0; k < PT - 1; k++) for (const kk of [k, k + 1]) {
          pos.set([pts[kk].x, pts[kk].y, pts[kk].z], v * 3); nor.set([dd.x, dd.y, dd.z], v * 3);
          const l = 0.9 + R() * 0.5; col.set([hc.r * l, hc.g * l, hc.b * l], v * 3); al[v] = 0.55 * (1 - kk / PT * 0.6); v++;
        }
        made++;
      }
      const g2 = new THREE.BufferGeometry();
      g2.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0, v * 3), 3));
      g2.setAttribute('aN', new THREE.BufferAttribute(nor.subarray(0, v * 3), 3));
      g2.setAttribute('color', new THREE.BufferAttribute(col.subarray(0, v * 3), 3));
      g2.setAttribute('aA', new THREE.BufferAttribute(al.subarray(0, v), 1));
      Human.hairStrandMat ||= (() => { const m = strandMaterial(); m.uniforms.uRim.value.setRGB(0.55, 0.36, 0.2); m.uniforms.uAmb.value.setRGB(0.5, 0.45, 0.45); m.uniforms.uKey.value.setRGB(0.9, 0.75, 0.6); return m; })();
      const ls = new THREE.LineSegments(g2, Human.hairStrandMat); ls.renderOrder = 2;
      this.head.add(ls);
    }
  }

  // ------------------------------------------------ hachimaki (twisted headband)
  buildHachimaki() {
    const hs = this.hs; const P = this.P;
    const pts = [];
    const N = 64;
    for (let i = 0; i <= N; i++) {
      const a = i / N * Math.PI * 2;
      const dx = Math.sin(a), dz = Math.cos(a);
      const dy = 0.3 + 0.3 * (1 - dz) * 0.5; // lower in front (forehead), higher behind
      const d = V(dx, dy, dz).normalize();
      const p = hs.shape(d, V()).addScaledVector(d, 0.016 + 0.008 * Math.max(0, dz));
      pts.push(p);
    }
    const g = clumpGeo(pts.slice(0, N), 0.0085, 0.0085, (p, o) => o.copy(p).normalize(), { segs: 120, around: 10, taper: () => 1, uScale: 1, vScale: 1 });
    // twisted red/white vertex colours
    const col = new Float32Array(g.attributes.position.count * 3);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      const u = uv.getX(i) * 4, v = uv.getY(i);
      const t = (u + v * 34) % 1;
      const red = t < 0.5;
      const k = 0.85 + 0.15 * Math.sin(t * Math.PI * 2);
      col[i * 3] = (red ? 0.62 : 0.93) * k; col[i * 3 + 1] = (red ? 0.08 : 0.9) * k; col[i * 3 + 2] = (red ? 0.1 : 0.85) * k;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.MeshPhysicalMaterial({ vertexColors: true, normalMap: tex('tshirt_n', 6), roughness: 0.85, sheen: 0.8, sheenColor: new THREE.Color(1, 0.9, 0.85), sheenRoughness: 0.6 });
    const grp = new THREE.Group();
    const band = new THREE.Mesh(g, mat); grp.add(band);
    // knot at the side + tails
    const kd = V(0.95, 0.42, -0.25).normalize();
    const kp = hs.shape(kd, V()).addScaledVector(kd, 0.026);
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.014, 16, 12), mat);
    const kg = knot.geometry; const kc = new Float32Array(kg.attributes.position.count * 3);
    for (let i = 0; i < kg.attributes.position.count; i++) { const r = (kg.attributes.position.getY(i) + kg.attributes.position.getX(i) * 0.6) > 0; kc[i * 3] = r ? 0.62 : 0.93; kc[i * 3 + 1] = r ? 0.08 : 0.9; kc[i * 3 + 2] = r ? 0.1 : 0.85; }
    kg.setAttribute('color', new THREE.BufferAttribute(kc, 3));
    knot.position.copy(kp); knot.scale.set(0.8, 1, 1.2); grp.add(knot);
    for (const t of [0, 1]) {
      const tp = [kp.clone(), kp.clone().add(V(0.018, -0.02 - t * 0.008, -0.012 - t * 0.012)), kp.clone().add(V(0.028 + t * 0.006, -0.045 - t * 0.012, -0.02 - t * 0.02))];
      const tg = ribbonGeo(tp, 0.016, (p, o) => o.set(1, 0, -0.3).normalize(), { segs: 10 });
      const tc = new Float32Array(tg.attributes.position.count * 3);
      for (let i = 0; i < tc.length / 3; i++) { const r = t ? i % 4 < 2 : i % 4 >= 2; tc[i * 3] = r ? 0.62 : 0.93; tc[i * 3 + 1] = r ? 0.08 : 0.9; tc[i * 3 + 2] = r ? 0.1 : 0.85; }
      tg.setAttribute('color', new THREE.BufferAttribute(tc, 3));
      const tm = new THREE.Mesh(tg, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.85, sheen: 0.6, side: THREE.DoubleSide, sheenColor: new THREE.Color(1, 0.9, 0.85) }));
      grp.add(tm);
    }
    grp.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    this.head.add(grp);
    this.hachimaki = grp;
    return grp;
  }

  // ------------------------------------------------ expressions
  setExpr(name, hold) {
    const E = {
      neutral: { smile: 0.25, open: 0, o: 0, brow: 0, browIn: 0, squint: 0.1, wide: 0 },
      smile: { smile: 0.75, open: 0.08, o: 0, brow: 0.15, browIn: 0, squint: 0.35, wide: 0 },
      happy: { smile: 0.95, open: 0.45, o: 0, brow: 0.35, browIn: 0, squint: 0.55, wide: 0 },
      laugh: { smile: 1.0, open: 0.85, o: 0, brow: 0.5, browIn: 0.1, squint: 0.85, wide: 0 },
      wow: { smile: 0.35, open: 0.55, o: 0.55, brow: 0.9, browIn: 0.15, squint: 0, wide: 0.8 },
      huh: { smile: -0.15, open: 0.2, o: 0.6, brow: 0.6, browIn: 0.55, squint: 0, wide: 0.45 },
      sorry: { smile: -0.35, open: 0.12, o: 0, brow: 0.35, browIn: 0.9, squint: 0.15, wide: 0 },
      focus: { smile: 0.25, open: 0.12, o: 0.2, brow: -0.35, browIn: -0.2, squint: 0.25, wide: 0 },
      proud: { smile: 0.7, open: 0, o: 0, brow: 0.25, browIn: -0.1, squint: 0.45, wide: 0 },
      squeeze: { smile: -0.3, open: 0.5, o: 0, brow: -0.4, browIn: 0.6, squint: 1.0, wide: 0 },
    }[name] || {};
    Object.assign(this.exT, E);
    this.exName = name;
    if (hold) { this.exHold = hold; this.exBack = 'smile'; }
  }

  lookAt(v) { this.look = v ? (v.isVector3 ? v : V(...v)) : null; }

  // ------------------------------------------------ IK
  reach(arm, target, pole, w = 1) { arm.ikTarget.copy(target); arm.pole.copy(pole); arm.ikW = w; }

  solveIK(arm) {
    const w = arm.ik;
    const sh = arm.shoulder, el = arm.elbow;
    const rest0 = arm.rest[0].clone().multiply(tmpQ.setFromAxisAngle(XAX, (arm.swing || 0) + (arm.raise || 0)));
    if (w <= 0.001) { sh.quaternion.slerp(rest0, 0.25); el.quaternion.slerp(arm.rest[1], 0.25); return; }
    sh.parent.updateWorldMatrix(true, false);
    const S = sh.getWorldPosition(V());
    const T = arm.ikTarget.clone();
    const L1 = arm.L1, L2 = arm.L2 + this.pr.hand * 0.4;
    let d = T.distanceTo(S);
    const maxD = (L1 + L2) * 0.995;
    if (d > maxD) { T.sub(S).setLength(maxD).add(S); d = maxD; }
    const dir = T.clone().sub(S).normalize();
    const ca = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1);
    const ang = Math.acos(ca);
    const pole = arm.pole.clone().sub(S);
    const n = V().crossVectors(dir, pole).normalize();
    if (n.lengthSq() < 1e-6) n.set(1, 0, 0);
    const edir = dir.clone().applyAxisAngle(n, ang);
    const E = S.clone().addScaledVector(edir, L1);
    // to shoulder-parent space
    const pq = sh.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
    const upLocal = edir.clone().applyQuaternion(pq).normalize();
    const q1 = new THREE.Quaternion().setFromUnitVectors(DOWN, upLocal);
    sh.quaternion.copy(rest0).slerp(q1, w);
    sh.updateWorldMatrix(false, false);
    const sq = sh.getWorldQuaternion(new THREE.Quaternion()).invert();
    const fdir = T.clone().sub(E).normalize().applyQuaternion(sq).normalize();
    const q2 = new THREE.Quaternion().setFromUnitVectors(DOWN, fdir);
    el.quaternion.copy(arm.rest[1]).slerp(q2, w);
  }

  // ------------------------------------------------ per-frame
  update(dt, time) {
    this.t += dt;
    const ex = this.ex, T = this.exT;
    if (this.exHold !== undefined) { this.exHold -= dt; if (this.exHold <= 0) { this.exHold = undefined; this.setExpr(this.exBack || 'smile'); } }
    const k = 1 - Math.exp(-dt * 9);
    for (const key in T) ex[key] = lerp(ex[key], T[key], k);
    // blink
    this.blinkT -= dt;
    if (this.blinkT < 0) { this.blinkT = 2.2 + this.R() * 3.5; this.blinkPhase = 0; }
    let blink = 0;
    if (this.blinkPhase !== undefined) { this.blinkPhase += dt / 0.16; blink = Math.sin(Math.min(1, this.blinkPhase) * Math.PI); if (this.blinkPhase >= 1) this.blinkPhase = undefined; }
    // lids
    const sq = ex.squint, wide = ex.wide;
    for (const e of this.eyes) {
      const upOpen = -0.8 - wide * 0.2 + sq * 0.42;
      const upClosed = 0.18;
      e.upG.rotation.x = lerp(upOpen, upClosed, Math.max(blink, ex.blink));
      e.loG.rotation.x = 0.62 - sq * 0.45 - wide * 0.05;
    }
    // look target
    const head = this.head;
    let yaw = 0, pitch = 0;
    if (this.look) {
      head.updateWorldMatrix(true, false);
      const lp = head.worldToLocal(this.look.clone());
      // rotate the eyes
      for (const e of this.eyes) {
        const v = lp.clone().sub(e.grp.position).normalize();
        e.look.rotation.set(clamp(-Math.asin(v.y), -0.4, 0.4), clamp(Math.atan2(v.x, v.z), -0.6, 0.6), 0);
      }
      const np = this.neckPivot.parent.worldToLocal(this.look.clone()).sub(this.neckPivot.position);
      yaw = clamp(Math.atan2(np.x, np.z), -0.8, 0.8) * 0.7;
      pitch = clamp(-Math.atan2(np.y - 0.1, Math.hypot(np.x, np.z)), -0.5, 0.4) * 0.6;
    } else for (const e of this.eyes) e.look.rotation.set(0, 0, 0);
    this.neckPivot.rotation.x = lerp(this.neckPivot.rotation.x, pitch + ex.nod, k * 0.6);
    this.neckPivot.rotation.y = lerp(this.neckPivot.rotation.y, yaw + ex.turn, k * 0.6);
    this.neckPivot.rotation.z = lerp(this.neckPivot.rotation.z, ex.tilt + Math.sin(this.t * 0.7) * 0.02, k * 0.6);
    // brows
    for (const b of this.brows) {
      b.pivot.position.y = b.y0 + ex.brow * 0.0045 + ex.browIn * 0.0012;
      b.pivot.rotation.z = b.s * (-ex.browIn * 0.32);
    }
    this.updateMouth();
    // walking: legs swing, body bobs
    this.walkAmt = lerp(this.walkAmt || 0, this.walking ? 1 : 0, 1 - Math.exp(-dt * 8));
    if (this.walking) this.walkPh = (this.walkPh || 0) + dt * 9;
    const sw = Math.sin(this.walkPh || 0) * 0.45 * this.walkAmt;
    if (this.legs) { this.legs[0].rotation.x = sw; this.legs[1].rotation.x = -sw; }
    this.body.position.y = Math.abs(Math.cos(this.walkPh || 0)) * 0.018 * this.walkAmt + (this.hop || 0);
    this.arms[0].swing = -sw * 0.6; this.arms[1].swing = sw * 0.6;
    // breathing
    const br = Math.sin(this.t * 2.1) * 0.006;
    this.torso.scale.set(1 + br, 1, 1 + br * 1.4);
    // arms
    for (const a of this.arms) {
      a.ik = lerp(a.ik, a.ikW || 0, 1 - Math.exp(-dt * 7));
      this.solveIK(a);
      a.handGrip.visible = a.grip > 0.5; a.handOpen.visible = !a.handGrip.visible;
    }
  }

  // world position of the right/left hand palm centre
  handPos(arm, out = V()) { return arm.wrist.localToWorld(out.set(0, -this.pr.hand * 0.45, this.pr.armR * 0.3)); }
}

function mix3(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
