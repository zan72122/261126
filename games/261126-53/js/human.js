// Realistic-proportioned CG people with a face rig (eyes, lids, brows, mouth), hair clumps and cloth.
import * as THREE from 'three';
import { pbr, tex, clamp, lerp, damp, smooth } from './core.js';
import { sweep, merge, xform, deform, setColor, fbm } from './geo.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const bump = (n, c, r, h) => { const d = n.distanceTo(c) / r; return d < 1 ? h * (1 - d * d) ** 2 : 0; };

// ------------------------------------------------------------------ materials
function skinMat(rgb, vc = true) {
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color().setRGB(...rgb, THREE.SRGBColorSpace), roughness: 0.5,
    normalMap: tex('skin', 'n', 6), normalScale: new THREE.Vector2(0.22, 0.22),
    roughnessMap: tex('skin', 'orm', 6),
    vertexColors: vc,
  });
  // cheap subsurface: wrap lighting + warm the terminator
  m.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
      reflectedLight.indirectDiffuse *= vec3(1.04, .99, .97);`);
  };
  return m;
}
function clothMat(name, tint, o = {}) {
  const m = pbr(name, { repeat: o.repeat || 4, color: tint, side: o.side || THREE.FrontSide, physical: { sheen: o.sheen ?? 0.6, sheenRoughness: 0.8, sheenColor: new THREE.Color(tint || 0xffffff).multiplyScalar(0.6) } });
  if (o.roughness) m.roughness = o.roughness;
  return m;
}
const MAT = {};
function mats() {
  if (MAT.ok) return MAT;
  MAT.ok = true;
  MAT.hair = new THREE.MeshPhysicalMaterial({
    map: tex('hair', 'c', 1), normalMap: tex('hair', 'n', 1), roughness: 0.55, color: 0xffffff,
    anisotropy: 0.7, anisotropyRotation: Math.PI / 2, sheen: 0.3, sheenColor: new THREE.Color(0.5, 0.35, 0.2), side: THREE.DoubleSide,
  });
  MAT.hairPapa = MAT.hair.clone(); MAT.hairPapa.color = new THREE.Color(0.55, 0.5, 0.48);
  MAT.brow = new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(0.3, 0.2, 0.13, THREE.SRGBColorSpace), roughness: 0.85 });
  MAT.lash = new THREE.MeshStandardMaterial({ color: 0x120a06, roughness: 0.6 });
  MAT.mouthIn = new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(0.36, 0.11, 0.1, THREE.SRGBColorSpace), roughness: 0.6 });
  MAT.tongue = new THREE.MeshPhysicalMaterial({ color: new THREE.Color().setRGB(0.85, 0.42, 0.42, THREE.SRGBColorSpace), roughness: 0.35, clearcoat: 0.5 });
  MAT.teeth = new THREE.MeshPhysicalMaterial({ color: new THREE.Color().setRGB(0.96, 0.94, 0.88, THREE.SRGBColorSpace), roughness: 0.25, clearcoat: 0.6 });
  MAT.leather = clothMat('canvas', new THREE.Color().setRGB(0.48, 0.3, 0.18, THREE.SRGBColorSpace), { repeat: 3, sheen: 0.2, side: THREE.FrontSide });
  MAT.leather.roughness = 0.62;
  MAT.sole = new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(0.18, 0.14, 0.11, THREE.SRGBColorSpace), roughness: 0.85, normalMap: tex('rock', 'n', 2) });
  MAT.khaki = clothMat('canvas', new THREE.Color(1, 1, 1), { repeat: 5, side: THREE.DoubleSide });
  MAT.khakiDark = clothMat('canvas', new THREE.Color(0.82, 0.78, 0.7), { repeat: 5 });
  MAT.tee = clothMat('cotton', new THREE.Color().setRGB(0.66, 0.78, 0.88, THREE.SRGBColorSpace), { repeat: 6 });
  MAT.denim = clothMat('denim', new THREE.Color(1, 1, 1), { repeat: 5 });
  MAT.sock = clothMat('cotton', new THREE.Color(1, 1, 1), { repeat: 8 });
  MAT.tie = clothMat('cotton', new THREE.Color().setRGB(0.75, 0.32, 0.3, THREE.SRGBColorSpace), { repeat: 8 });
  MAT.papaShirt = clothMat('cotton', new THREE.Color().setRGB(0.55, 0.66, 0.74, THREE.SRGBColorSpace), { repeat: 5 });
  MAT.papaPants = clothMat('canvas', new THREE.Color(0.7, 0.66, 0.56), { repeat: 5 });
  return MAT;
}

// ------------------------------------------------------------------ eye texture
function eyeTexture(irisHex) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const g = c.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 512, 0);
  bg.addColorStop(0, '#d8c8c0'); bg.addColorStop(0.35, '#f3efe9'); bg.addColorStop(0.5, '#f6f2ed'); bg.addColorStop(0.65, '#f3efe9'); bg.addColorStop(1, '#d8c8c0');
  g.fillStyle = bg; g.fillRect(0, 0, 512, 256);
  g.globalAlpha = 0.25;
  for (let i = 0; i < 26; i++) { g.strokeStyle = '#c0605a'; g.lineWidth = 0.6; g.beginPath(); let x = Math.random() < 0.5 ? 120 + Math.random() * 40 : 352 - Math.random() * 40, y = 128 + (Math.random() - 0.5) * 120; g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (x < 256 ? -1 : 1) * (8 + Math.random() * 10); y += (Math.random() - 0.5) * 14; g.lineTo(x, y); } g.stroke(); }
  g.globalAlpha = 1;
  const cx = 256, cy = 128, R = 54;
  const gr = g.createRadialGradient(cx, cy, 2, cx, cy, R);
  gr.addColorStop(0, '#050302'); gr.addColorStop(0.34, '#070403'); gr.addColorStop(0.4, irisHex); gr.addColorStop(0.75, irisHex); gr.addColorStop(0.92, '#2a170b'); gr.addColorStop(1, 'rgba(40,24,12,0.0)');
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
  for (let i = 0; i < 140; i++) {
    const a = Math.random() * Math.PI * 2, r0 = R * 0.38, r1 = R * (0.75 + Math.random() * 0.2);
    g.strokeStyle = Math.random() < 0.5 ? 'rgba(255,214,150,0.18)' : 'rgba(30,15,5,0.2)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a + 0.05) * r1, cy + Math.sin(a + 0.05) * r1); g.stroke();
  }
  g.strokeStyle = 'rgba(20,10,5,0.75)'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, R * 0.93, 0, 7); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

// ------------------------------------------------------------------ the Human
export class Human {
  constructor(kind) {
    const M = mats();
    this.kind = kind;
    const girl = kind === 'girl';
    const P = girl ? {
      H: 1.1, hr: 0.102, neck: 0.05, neckR: 0.031, torso: 0.33, shW: 0.1, chW: 0.098, chD: 0.072, waW: 0.094, hipW: 0.1,
      upA: 0.165, foA: 0.148, hand: 0.105, armR: 0.025, thigh: 0.25, shin: 0.235, legR: 0.042, foot: 0.165, ankle: 0.05,
      skin: [0.84, 0.64, 0.52], iris: '#6a4322', eyeR: 0.118, headScale: [0.80, 1.0, 0.91],
    } : {
      H: 1.78, hr: 0.118, neck: 0.085, neckR: 0.058, torso: 0.53, shW: 0.178, chW: 0.165, chD: 0.115, waW: 0.152, hipW: 0.16,
      upA: 0.3, foA: 0.27, hand: 0.19, armR: 0.044, thigh: 0.45, shin: 0.43, legR: 0.068, foot: 0.27, ankle: 0.08,
      skin: [0.84, 0.62, 0.48], iris: '#4a3018', eyeR: 0.092, headScale: [0.76, 1.0, 0.9],
    };
    this.P = P;
    this.skinVC = skinMat(P.skin, true);
    this.skin = skinMat(P.skin, false);
    this.root = new THREE.Group();
    const hipH = P.ankle + P.shin + P.thigh;
    this.hipH = hipH;
    const J = this.J = {};
    const joint = (name, parent, x, y, z) => { const g = new THREE.Bone(); g.position.set(x, y, z); g.name = name; parent.add(g); J[name] = g; return g; };
    joint('pelvis', this.root, 0, hipH, 0);
    joint('spine', J.pelvis, 0, P.torso * 0.36, 0);
    joint('chest', J.spine, 0, P.torso * 0.3, 0);
    joint('neck', J.chest, 0, P.torso * 0.34, -0.005);
    joint('head', J.neck, 0, P.neck + P.hr * 0.78, 0.008);
    for (const s of [1, -1]) {
      const sd = s > 0 ? 'L' : 'R';
      joint('sh' + sd, J.chest, P.shW * s, P.torso * 0.2, -0.006);
      joint('el' + sd, J['sh' + sd], 0, -P.upA, 0);
      joint('wr' + sd, J['el' + sd], 0, -P.foA, 0);
      joint('hip' + sd, J.pelvis, P.hipW * 0.52 * s, -0.02, 0);
      joint('kn' + sd, J['hip' + sd], 0, -P.thigh, 0);
      joint('an' + sd, J['kn' + sd], 0, -P.shin, 0);
    }
    this.meshes = [];
    this.buildBody(M);
    this.buildHead(M);
    this.expr = { smile: 0.3, open: 0, round: 0, browUp: 0, browIn: 0, lid: 1, squint: 0, tilt: 0 };
    this.exprT = { ...this.expr };
    this.look = V(0, 1, 3); this.lookW = 1;
    this.blinkT = 2; this.blink = 0;
    this.time = Math.random() * 10;
    this.armIK = { L: null, R: null };
    this.grip = { L: 0, R: 0 };
    this.root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  }
  add(parent, geo, mat, name) { const m = new THREE.Mesh(geo, mat); if (name) m.name = name; parent.add(m); this.meshes.push(m); return m; }

  // ---------------------------------------------------------------- body (skinned: one continuous surface per garment)
  // loft around the vertical axis from sections [{y, w, d, zo, n}]
  loft(secs, o = {}) {
    const radial = o.radial || 36, rings = o.rings || 28;
    const ys = secs.map(s => s.y);
    const interp = (key, t) => {
      const f = t * (secs.length - 1), i = Math.min(secs.length - 2, Math.floor(f)), u = f - i;
      const p0 = secs[Math.max(0, i - 1)][key], p1 = secs[i][key], p2 = secs[i + 1][key], p3 = secs[Math.min(secs.length - 1, i + 2)][key];
      return 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
    };
    const a0 = o.arc ? o.arc[0] : 0, a1 = o.arc ? o.arc[1] : Math.PI * 2;
    const pos = [], uv = [], idx = [];
    const cols = radial + 1;
    const capB = o.capBottom ? 4 : 0, capT = o.capTop ? 4 : 0;
    const ringList = [];
    for (let k = capB; k >= 1; k--) ringList.push({ t: 0, s: Math.cos(k / capB * Math.PI / 2), dy: -Math.sin(k / capB * Math.PI / 2) * 0.6 });
    for (let r = 0; r <= rings; r++) ringList.push({ t: r / rings, s: 1, dy: 0 });
    for (let k = 1; k <= capT; k++) ringList.push({ t: 1, s: Math.cos(k / capT * Math.PI / 2), dy: Math.sin(k / capT * Math.PI / 2) * 0.6 });
    for (const R of ringList) {
      const t = R.t;
      const y = interp('y', t), w = interp('w', t), d = interp('d', t), zo = interp('zo', t), n = interp('n', t), xo = secs[0].xo !== undefined ? interp('xo', t) : 0;
      for (let j = 0; j < cols; j++) {
        const a = a0 + (a1 - a0) * j / radial;
        const ca = Math.sin(a), sa = Math.cos(a); // a=0 -> front (+z)
        const se = 1 / Math.pow(Math.abs(ca) ** n + Math.abs(sa) ** n, 1 / n);
        let m = se * (o.shape ? o.shape(t, a) : 1);
        // flatter back, rounder front
        const zz = sa * d * m * (sa < 0 ? 0.92 : 1);
        pos.push(xo + ca * w * m * R.s, y + R.dy * Math.min(w, d), zo + zz * R.s);
        uv.push(j / radial * (o.uS || 3), y * (o.vS || 6));
      }
    }
    for (let r = 0; r < ringList.length - 1; r++) for (let j = 0; j < radial; j++) {
      const a = r * cols + j, b = a + 1, c = a + cols, e = c + 1;
      idx.push(a, b, c, b, e, c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    if (!o.arc) { // seam
      const nn = g.attributes.normal;
      for (let r = 0; r < ringList.length; r++) { const a = r * cols, b = a + radial; const x = nn.getX(a) + nn.getX(b), y = nn.getY(a) + nn.getY(b), z = nn.getZ(a) + nn.getZ(b); const l = Math.hypot(x, y, z) || 1; nn.setXYZ(a, x / l, y / l, z / l); nn.setXYZ(b, x / l, y / l, z / l); }
    }
    return g;
  }
  // geometry given in the local space of joint `j` -> root space
  toRoot(g, j) { this.root.updateMatrixWorld(true); const m = new THREE.Matrix4().copy(this.root.matrixWorld).invert().multiply(this.J[j].matrixWorld); g.applyMatrix4(m); return g; }
  // skin weights from distance to candidate bone segments
  // pieces: [[geometry(root space), [candidate segment keys]], ...]; weights from radius-normalised distance
  weights(g, cands) {
    const p = g.attributes.position;
    const segs = cands.map(c => this.SEG[c]);
    const si = new Uint16Array(p.count * 4), sw = new Float32Array(p.count * 4);
    const v = V(), ab = V(), av = V();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const ws = segs.map(s => {
        ab.subVectors(s.b, s.a); av.subVectors(v, s.a);
        const t = clamp(av.dot(ab) / ab.lengthSq(), 0, 1);
        const d = av.sub(ab.multiplyScalar(t)).length() + 1e-4;
        return { bi: s.bi, w: 1 / Math.pow(d / s.r, 6) };
      }).sort((a, b) => b.w - a.w).slice(0, 4);
      const sum = ws.reduce((a, b) => a + b.w, 0);
      ws.forEach((x, k) => { si[i * 4 + k] = x.bi; sw[i * 4 + k] = x.w / sum; });
    }
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
    g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
    return g;
  }
  skinned(pieces, mat, name) {
    const geos = pieces.map(([g, c]) => this.weights(g, c));
    const g = geos.length > 1 ? merge(geos) : geos[0];
    const m = new THREE.SkinnedMesh(g, mat);
    m.name = name || '';
    this.root.add(m);
    m.bind(this.skeleton, new THREE.Matrix4());
    m.frustumCulled = false;
    this.meshes.push(m);
    return m;
  }
  buildBody(M) {
    const P = this.P, J = this.J, girl = this.kind === 'girl';
    // skeleton & segments in rest pose (root space)
    this.root.updateMatrixWorld(true);
    const names = Object.keys(J);
    this.skeleton = new THREE.Skeleton(names.map(n => J[n]));
    const wp = n => new THREE.Vector3().setFromMatrixPosition(J[n].matrixWorld);
    const S = this.SEG = {};
    const seg = (key, a, b, r) => { S[key] = { a: wp(a), b: typeof b === 'string' ? wp(b) : b, bi: names.indexOf(a), r }; };
    const tr = P.chW;
    seg('pelvis', 'pelvis', 'spine', tr * 1.15); seg('spine', 'spine', 'chest', tr); seg('chest', 'chest', 'neck', tr); seg('neck', 'neck', 'head', P.neckR * 1.3);
    for (const sd of ['L', 'R']) {
      seg('sh' + sd, 'sh' + sd, 'el' + sd, P.armR); seg('el' + sd, 'el' + sd, 'wr' + sd, P.armR); seg('wr' + sd, 'wr' + sd, wp('wr' + sd).add(V(0, -P.hand, 0)), P.armR);
      seg('hip' + sd, 'hip' + sd, 'kn' + sd, P.legR); seg('kn' + sd, 'kn' + sd, 'an' + sd, P.legR); seg('an' + sd, 'an' + sd, wp('an' + sd).add(V(0, -P.ankle, P.foot * 0.5)), P.legR);
    }
    const h = this.hipH;
    // torso sections (root space, y absolute)
    const k = P.H / 1.1;
    const T = girl ? [
      { y: h - 0.075, w: 0.07, d: 0.055, zo: 0.0, n: 2.2 },
      { y: h - 0.03, w: 0.096, d: 0.066, zo: 0.002, n: 2.4 },
      { y: h + 0.03, w: 0.1, d: 0.07, zo: 0.004, n: 2.4 },
      { y: h + 0.1, w: 0.092, d: 0.068, zo: 0.009, n: 2.3 },
      { y: h + 0.17, w: 0.094, d: 0.068, zo: 0.008, n: 2.3 },
      { y: h + 0.235, w: 0.1, d: 0.069, zo: 0.004, n: 2.4 },
      { y: h + 0.285, w: 0.118, d: 0.064, zo: 0.0, n: 2.8 },
      { y: h + 0.315, w: 0.106, d: 0.056, zo: -0.004, n: 2.6 },
      { y: h + 0.337, w: 0.062, d: 0.046, zo: -0.004, n: 2.2 },
      { y: h + 0.35, w: 0.036, d: 0.034, zo: 0.0, n: 2 },
    ] : [
      { y: h - 0.1, w: 0.12, d: 0.09, zo: 0.0, n: 2.2 },
      { y: h - 0.04, w: 0.168, d: 0.108, zo: 0.004, n: 2.4 },
      { y: h + 0.06, w: 0.172, d: 0.112, zo: 0.006, n: 2.4 },
      { y: h + 0.17, w: 0.158, d: 0.118, zo: 0.016, n: 2.3 },
      { y: h + 0.28, w: 0.166, d: 0.124, zo: 0.016, n: 2.4 },
      { y: h + 0.38, w: 0.18, d: 0.124, zo: 0.008, n: 2.6 },
      { y: h + 0.455, w: 0.212, d: 0.112, zo: 0.0, n: 3.0 },
      { y: h + 0.5, w: 0.19, d: 0.095, zo: -0.006, n: 2.6 },
      { y: h + 0.535, w: 0.1, d: 0.075, zo: -0.006, n: 2.2 },
      { y: h + 0.56, w: 0.062, d: 0.058, zo: 0.0, n: 2 },
    ];
    const split = girl ? 3 : 3; // shirt from section 2.. ; pants up to section 3
    const torsoCands = ['pelvis', 'spine', 'chest', 'neck', 'shL', 'shR'];
    const wrinkle = (t, a) => 1 + 0.012 * Math.sin(a * 11 + t * 7) * (1 - t) + 0.008 * Math.sin(a * 5 - t * 13);
    const shirtG = this.loft(T.slice(1), { radial: 40, rings: 30, shape: wrinkle, vS: 4 });
    const pantsTop = this.loft(T.slice(1, 4).map((s, i) => i === 2 ? { ...s, y: T[2].y + (T[3].y - T[2].y) * 0.45 } : s).map((s, i) => ({ ...s, w: s.w * (i ? 1.03 : 0.96), d: s.d * (i ? 1.05 : 0.98) })), { radial: 40, rings: 10, vS: 4 });
    // arms: one tube shoulder->wrist through the elbow (no seam)
    const armGeo = (sd) => {
      const s = sd === 'L' ? 1 : -1;
      const L = P.upA + P.foA;
      const g = sweep([V(0, 0.012, 0), V(0, -P.upA * 0.5, 0.003), V(0, -P.upA, 0), V(0, -P.upA - P.foA * 0.45, 0.002), V(0, -L, 0)], {
        segs: 30, radial: 18, up: V(0, 0, 1), capLen: 0.8,
        radius: t => {
          const u = t * L;
          let r;
          if (u < P.upA) { const q = u / P.upA; r = P.armR * (1.15 - 0.28 * q + 0.07 * Math.exp(-(((q - 0.45) / 0.22) ** 2))); }
          else { const q = (u - P.upA) / P.foA; r = P.armR * (0.86 + 0.1 * Math.exp(-(((q - 0.22) / 0.2) ** 2)) - 0.3 * q); }
          return [r * 1.02, r * 0.95];
        },
      });
      return this.toRoot(g, 'sh' + sd);
    };
    const legGeo = (sd, rMul = 1, from = 0, to = 1) => {
      const L = P.thigh + P.shin;
      const s = sd === 'L' ? 1 : -1;
      const g = sweep([V(-s * 0.006, 0.05, 0), V(-s * 0.004, -P.thigh * 0.5, 0.008), V(0, -P.thigh, 0.004), V(0, -P.thigh - P.shin * 0.3, -0.006), V(0, -L - 0.01, 0.002)], {
        segs: 34, radial: 20, up: V(0, 0, 1), caps: to < 1 ? 'start' : true, capLen: 0.7,
        radius: t => {
          const u = t * (L + 0.06) - 0.05;
          let r;
          if (u < P.thigh) { const q = Math.max(0, u / P.thigh); r = P.legR * (1.22 - 0.42 * q); }
          else { const q = (u - P.thigh) / P.shin; r = P.legR * (0.82 + 0.12 * Math.exp(-(((q - 0.28) / 0.18) ** 2)) - 0.36 * q); }
          return [r * rMul, r * rMul * 1.03];
        },
        shape: (t, a) => 1 + 0.06 * Math.max(0, -Math.cos(a)) * Math.exp(-(((t - 0.62) / 0.1) ** 2)),
      });
      if (to < 1) { // cut tube for shorts: keep rings up to `to`
        const p = g.attributes.position; const tt = g.attributes.aT;
        const keep = []; for (let i = 0; i < p.count; i++) keep.push(tt.getX(i) <= to + 1e-4);
        const ix = g.index.array, ni = [];
        for (let i = 0; i < ix.length; i += 3) if (keep[ix[i]] && keep[ix[i + 1]] && keep[ix[i + 2]]) ni.push(ix[i], ix[i + 1], ix[i + 2]);
        g.setIndex(ni);
      }
      return this.toRoot(g, 'hip' + sd);
    };
    const sk = this.skin;
    // skin: arms, (girl) legs, neck
    const neck = this.toRoot(sweep([V(0, -0.035, -0.004), V(0, P.neck * 0.5, 0.0), V(0, P.neck + P.hr * 0.25, 0.012)], { segs: 8, radial: 18, radius: t => [P.neckR * (1.08 - 0.12 * t), P.neckR * (1.0 - 0.06 * t)] }), 'neck');
    const armC = sd => ['chest', 'sh' + sd, 'el' + sd, 'wr' + sd];
    const legC = sd => ['pelvis', 'hip' + sd, 'kn' + sd, 'an' + sd];
    const skinParts = [[armGeo('L'), armC('L')], [armGeo('R'), armC('R')], [neck, ['chest', 'neck']]];
    if (girl) skinParts.push([legGeo('L'), legC('L')], [legGeo('R'), legC('R')]);
    this.skinned(skinParts, sk, 'skin');
    // shirt + sleeves
    const sleeve = (sd) => {
      const sl = sweep([V(0, 0.0, -0.004), V(0, -P.upA * 0.25, 0), V(0, -P.upA * (girl ? 0.5 : 0.7), 0.002)], {
        segs: 10, radial: 22, up: V(0, 0, 1), caps: 'start', capLen: 0.9,
        radius: t => P.armR * (1.28 - 0.06 * t), shape: (t, a) => 1 + 0.035 * Math.sin(a * 5 + t * 4) * t,
      });
      return this.toRoot(sl, 'sh' + sd);
    };
    const tc = ['pelvis', 'spine', 'chest', 'neck'];
    this.shirt = this.skinned([[shirtG, tc], [sleeve('L'), ['chest', 'shL', 'elL']], [sleeve('R'), ['chest', 'shR', 'elR']]], girl ? M.tee : M.papaShirt, 'shirt');
    // collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(P.neckR * 1.12, P.neckR * 0.16, 8, 28), girl ? M.tee : M.papaShirt);
    collar.rotation.x = Math.PI / 2 + 0.15; collar.position.set(0, P.torso * 0.34 - 0.012 * k, 0.002);
    J.chest.add(collar); this.meshes.push(collar);
    if (!girl) for (const sd of ['L', 'R']) {
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(P.armR * 1.34, P.armR * 0.3, 8, 20), M.papaShirt);
      cuff.rotation.x = Math.PI / 2; cuff.position.set(0, -P.upA * 0.7, 0.002); J['sh' + sd].add(cuff); this.meshes.push(cuff);
    }
    // pants / shorts
    const pantsParts = [[pantsTop, ['pelvis', 'spine', 'hipL', 'hipR']]];
    if (girl) { pantsParts.push([legGeo('L', 1.3, 0, 0.27), legC('L')], [legGeo('R', 1.3, 0, 0.27), legC('R')]); }
    else { pantsParts.push([legGeo('L', 1.12), legC('L')], [legGeo('R', 1.12), legC('R')]); }
    this.pants = this.skinned(pantsParts, girl ? M.denim : M.papaPants, 'pants');
    // belt
    const belt = new THREE.Mesh(this.loft([{ y: h + 0.07 * k, w: T[2].w * 1.06 + 0.002, d: T[2].d * 1.08, zo: 0.006, n: 2.4 }, { y: h + 0.095 * k, w: T[2].w * 1.06 + 0.002, d: T[2].d * 1.08, zo: 0.007, n: 2.4 }], { rings: 1, radial: 40 }), M.leather);
    belt.geometry.translate(0, -h, 0); J.pelvis.add(belt); this.meshes.push(belt);
    // vest: offset loft with an open front
    const VS = T.slice(2, 9).map(s => ({ ...s, w: s.w * 1.08 + 0.008, d: s.d * 1.12 + 0.009 }));
    VS[VS.length - 1] = { ...VS[VS.length - 1], w: T[8].w * 1.2, d: T[8].d * 1.25 };
    const vestG = this.loft(VS, { radial: 44, rings: 26, arc: [0.42, Math.PI * 2 - 0.42], shape: (t, a) => 1 + 0.02 * Math.sin(a * 7 + t * 4) + 0.01 * Math.sin(t * 30 + a * 2), vS: 5 });
    // cut arm holes: drop triangles near the shoulder joints
    {
      const p = vestG.attributes.position, ix = vestG.index.array, ni = [];
      const shY = h + P.torso * (girl ? 0.92 : 0.9);
      const hole = i => { const x = Math.abs(p.getX(i)), y = p.getY(i), z = p.getZ(i); return ((x - P.shW * 1.0) ** 2) / (P.armR * 1.7) ** 2 + ((y - shY + P.armR * 0.9) ** 2) / (P.armR * 2.6) ** 2 + (z * z) / (P.chD * 0.9) ** 2 < 1; };
      for (let i = 0; i < ix.length; i += 3) if (!(hole(ix[i]) && hole(ix[i + 1]) && hole(ix[i + 2]))) ni.push(ix[i], ix[i + 1], ix[i + 2]);
      vestG.setIndex(ni);
    }
    this.vestMesh = this.skinned([[vestG, tc]], M.khaki, 'vest');
    this.vest = new THREE.Group(); J.spine.add(this.vest);
    // pockets
    for (const s of [-1, 1]) for (const row of [0, 1]) {
      const pw = P.chW * 0.44, ph = P.torso * (row ? 0.15 : 0.13);
      const py = (row ? 0.42 : 0.12) * P.torso, pz = P.chD * 1.1 + 0.006;
      const ang = s * 0.42;
      const pocket = new THREE.BoxGeometry(pw, ph, 0.01, 3, 2, 1);
      deform(pocket, v => { v.z += Math.cos(v.x / pw * 3) * 0.002; });
      const pm = this.add(this.vest, pocket, M.khaki);
      pm.position.set(s * P.chW * 0.5, py, pz); pm.rotation.y = ang;
      const flap = new THREE.BoxGeometry(pw * 1.06, ph * 0.32, 0.012, 3, 1, 1);
      deform(flap, v => { v.z += Math.cos(v.x / pw * 3) * 0.002 + 0.002; });
      const fm = this.add(this.vest, flap, M.khakiDark);
      fm.position.set(s * P.chW * 0.5, py + ph * 0.38, pz + 0.004); fm.rotation.y = ang;
    }
    this.vest.position.y = -P.torso * 0.36 + 0.0;
    this.vest.position.y = (h + 0) - (h + P.torso * 0.36); // spine joint is at h+torso*.36; pockets placed relative to hip line
    this.vest.position.y += P.torso * 0.0;
    this.setVest(false);
    // hands & boots (rigid)
    for (const sd of ['L', 'R']) {
      const s = sd === 'L' ? 1 : -1;
      const hg = new THREE.Group(); hg.scale.x = s; J['wr' + sd].add(hg);
      this.buildHand(hg, sd);
      this.buildBoot(J['an' + sd]);
    }
    if (girl) for (const sd of ['L', 'R']) {
      const sock = sweep([V(0, -P.shin * 0.72, 0), V(0, -P.shin - 0.01, 0.002)], { segs: 4, radial: 18, caps: false, radius: t => P.legR * (0.6 - 0.1 * t) });
      this.add(J['kn' + sd], sock, M.sock);
    }
  }
  setVest(on) { this.vestMesh.visible = on; this.vest.visible = on; }
  buildHand(hg, sd) {
    // left hand: palm faces -x, fingers along -y, thumb toward +z
    const P = this.P, sk = this.skin;
    const k = P.hand / 0.105;
    const palmL = 0.052 * k, palmW = 0.042 * k, palmT = 0.017 * k;
    const palm = sweep([V(0, 0.004 * k, 0), V(0.001 * k, -palmL * 0.5, 0), V(0, -palmL, 0)], {
      segs: 8, radial: 16, up: V(1, 0, 0), capLen: 0.5,
      radius: t => [palmT * (1.0 - 0.15 * t), palmW * 0.5 * (0.82 + 0.18 * Math.sin(Math.PI * Math.min(1, t * 1.3)))],
      shape: (t, a) => 1 / Math.pow(Math.abs(Math.cos(a)) ** 3 + Math.abs(Math.sin(a)) ** 3, 1 / 3),
    });
    this.add(hg, palm, sk);
    const fingers = [];
    const fl = [0.29, 0.33, 0.31, 0.25];
    for (let i = 0; i < 4; i++) {
      const base = new THREE.Group();
      base.position.set(0.001 * k, -palmL + 0.004 * k, (0.0145 - i * 0.0097) * k);
      base.rotation.x = (i - 1.5) * 0.06;
      hg.add(base);
      const L1 = fl[i] * P.hand * 0.55, L2 = fl[i] * P.hand * 0.48, r = 0.0052 * k * (i === 3 ? 0.86 : 1);
      this.add(base, sweep([V(0, 0.003, 0), V(0, -L1, 0)], { segs: 3, radial: 10, radius: () => [r * 0.9, r], up: V(1, 0, 0), capLen: 0.9 }), sk);
      const mid = new THREE.Group(); mid.position.y = -L1; base.add(mid);
      this.add(mid, sweep([V(0, 0.002, 0), V(0, -L2, 0)], { segs: 3, radial: 10, radius: t => [r * 0.85 * (1 - 0.12 * t), r * 0.95 * (1 - 0.12 * t)], up: V(1, 0, 0), capLen: 0.9 }), sk);
      fingers.push({ base, mid });
    }
    const th = new THREE.Group(); th.position.set(-0.004 * k, -0.012 * k, 0.017 * k); th.rotation.set(-0.35, 0, 0.35); hg.add(th);
    this.add(th, sweep([V(0, 0.004 * k, 0), V(0, -0.022 * k, 0.003 * k), V(0, -0.04 * k, 0.004 * k)], { segs: 6, radial: 10, radius: t => 0.0068 * k * (1 - 0.18 * t), up: V(1, 0, 0) }), sk);
    fingers.thumb = th;
    this['fingers' + sd] = fingers;
    const grip = new THREE.Group(); grip.position.set(-0.012 * k, -palmL - 0.012 * k, 0); hg.add(grip);
    this['grip' + sd] = grip;
    this.setGrip(sd, 0.25);
  }
  buildBoot(an) {
    const P = this.P, M = MAT;
    const f = P.foot;
    const boot = sweep([V(0, -P.ankle * 0.25, -f * 0.2), V(0, -P.ankle * 0.45, f * 0.25), V(0, -P.ankle * 0.55, f * 0.72)], {
      segs: 14, radial: 18, up: V(0, 1, 0), capLen: 0.9,
      radius: t => [P.legR * (0.72 - 0.06 * t), P.legR * (0.78 - 0.15 * t) * 0.62],
      shape: (t, a) => 1 + 0.12 * Math.max(0, Math.cos(a)) * (1 - t),
    });
    const bm = this.add(an, boot, M.leather);
    const shaft = sweep([V(0, -P.ankle * 0.45, -0.004), V(0, P.ankle * 0.9, 0)], { segs: 4, radial: 18, caps: 'start', radius: t => P.legR * (0.7 - 0.05 * t) });
    this.add(an, shaft, M.leather);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(P.legR * 0.66, 0.0045 * P.H / 1.1, 6, 20), M.leather);
    cuff.rotation.x = Math.PI / 2; cuff.position.y = P.ankle * 0.9; an.add(cuff); this.meshes.push(cuff);
    const sole = new THREE.BoxGeometry(P.legR * 1.35, P.ankle * 0.28, f * 1.04, 4, 1, 8);
    deform(sole, v => { const t = (v.z / (f * 1.04)) + 0.5; v.x *= 0.82 + 0.25 * Math.sin(t * Math.PI * 0.9 + 0.2); if (t > 0.92) v.y += (t - 0.92) * 0.05; });
    const sm = this.add(an, sole, M.sole);
    sm.position.set(0, -P.ankle + P.ankle * 0.14, f * 0.27);
    // laces
    for (let i = 0; i < 3; i++) {
      const lc = this.add(an, new THREE.TorusGeometry(P.legR * 0.22, 0.0016, 4, 10, Math.PI), MAT.sole);
      lc.position.set(0, -P.ankle * 0.08 + i * 0.012, f * 0.08 + i * 0.006 - 0.003); lc.rotation.set(-0.7, 0, 0);
    }
  }

  // ---------------------------------------------------------------- head & face
  buildHead(M) {
    const P = this.P, J = this.J, girl = this.kind === 'girl';
    const hr = P.hr, [sx, sy, sz] = P.headScale;
    const H = new THREE.Group(); J.head.add(H); this.headG = H;
    const g = new THREE.SphereGeometry(1, 112, 84);
    const pos = g.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const n = V(), c = V();
    // landmarks in unit-ish space
    const er = P.eyeR; // eye radius / hr
    const eyeY = girl ? -0.07 : 0.0, eyeX = girl ? 0.3 : 0.29;
    const surfZ0 = (x, y) => sz * Math.sqrt(Math.max(0, 1 - (x / sx) ** 2 - y * y));
    const EZ = surfZ0(eyeX, eyeY) - er * (girl ? 0.42 : 0.5);
    this.eyeC = [V(eyeX, eyeY, EZ), V(-eyeX, eyeY, EZ)];
    const shape = (v) => {
      n.copy(v).normalize();
      let x = n.x * sx, y = n.y * sy, z = n.z * sz;
      // lower face taper & jaw
      const low = sstep(-0.05, -1, n.y);
      x *= 1 - (girl ? 0.22 : 0.18) * low ** 1.3;
      if (n.z > 0) z *= 1 - (girl ? 0.05 : 0.0) * low; else z *= 1 - 0.35 * low;
      if (!girl && n.y < -0.3 && n.z > -0.2) { x *= 1 + 0.06 * sstep(-0.3, -0.8, n.y); } // squarer jaw
      // back of skull fuller (kids) / forehead
      if (n.z < 0 && n.y > -0.2) z *= 1 + (girl ? 0.06 : 0.02);
      if (n.y > 0.2 && n.z > 0.2) z *= 1 + (girl ? 0.03 : 0.01);
      // features (additive along normal-ish direction z)
      let dz = 0, dx = 0, dy = 0;
      for (const s of [-1, 1]) {
        dz += bump(n, c.set(0.42 * s, -0.36, 0.78), 0.34, girl ? 0.075 : 0.03); // cheeks
        dx += s * bump(n, c.set(0.6 * s, -0.25, 0.6), 0.4, girl ? 0.03 : 0.01);
        dz += bump(n, c.set(0.085 * s, -0.355, 0.92), 0.06, 0.022); // nostril wings
      }
      dz += bump(n, c.set(0, -0.12, 0.98), 0.12, girl ? 0.018 : 0.04); // bridge
      dz += bump(n, c.set(0, -0.3, 0.95), girl ? 0.11 : 0.15, girl ? 0.05 : 0.1); // nose tip
      dz += bump(n, c.set(0, -0.2, 0.97), girl ? 0.07 : 0.1, girl ? 0.015 : 0.03); // nose ridge
      dz += bump(n, c.set(0, 0.12, 0.98), 0.25, girl ? 0.0 : 0.025); // brow ridge
      dz += bump(n, c.set(0, -0.58, 0.82), 0.2, girl ? 0.035 : 0.025); // lips mound
      dz -= bump(n, c.set(0, -0.44, 0.92), 0.05, 0.008); // philtrum
      dz += bump(n, c.set(0, -0.9, 0.42), 0.3, girl ? 0.03 : 0.06); // chin
      dy -= bump(n, c.set(0, -0.98, 0.1), 0.4, 0.02);
      v.set(x + dx, y + dy, z + dz);
      return v;
    };
    for (let i = 0; i < pos.count; i++) { c.fromBufferAttribute(pos, i); shape(c); pos.setXYZ(i, c.x, c.y, c.z); }
    // eye sockets: skin hugs eyeballs, opening pushed behind the eyeball
    const tmp = V();
    for (let i = 0; i < pos.count; i++) {
      tmp.fromBufferAttribute(pos, i);
      if (tmp.z < 0) continue;
      for (const E of this.eyeC) {
        const ddx = tmp.x - E.x, ddy = tmp.y - E.y;
        const rho = Math.sqrt((ddx / 1.0) ** 2 + (ddy / 0.78) ** 2) / er;
        if (rho > 1.9) continue;
        if (rho < 1.0) { tmp.z = Math.min(tmp.z, E.z - er * 0.25); continue; }
        const d = tmp.distanceTo(E), want = er * 1.035;
        if (d > want) {
          const w = sstep(1.9, 1.05, rho);
          const nd = lerp(d, want, w);
          tmp.sub(E).multiplyScalar(nd / d).add(E);
        }
      }
      // mouth: small recess where the lips sit
      const mdx = tmp.x / 0.2, mdy = (tmp.y + 0.6) / 0.06;
      if (mdx * mdx + mdy * mdy < 1) tmp.z -= 0.012 * (1 - mdx * mdx - mdy * mdy);
      pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
    }
    // vertex colours: blush, lips area, darker nostrils & creases
    for (let i = 0; i < pos.count; i++) {
      tmp.fromBufferAttribute(pos, i);
      n.copy(tmp).normalize();
      let r = 1, gg = 1, b = 1;
      for (const s of [-1, 1]) {
        const ch = Math.exp(-(((n.x - 0.45 * s) / 0.2) ** 2 + ((n.y + 0.33) / 0.16) ** 2)) * (n.z > 0 ? 1 : 0);
        const k = girl ? 0.1 : 0.05;
        r -= 0.02 * ch; gg -= k * ch; b -= k * 0.9 * ch;
        const ns = Math.exp(-(((n.x - 0.07 * s) / 0.04) ** 2 + ((n.y + 0.38) / 0.03) ** 2)) * (n.z > 0.5 ? 1 : 0);
        r -= 0.2 * ns; gg -= 0.24 * ns; b -= 0.24 * ns;
      }
      const nose = Math.exp(-(((n.x) / 0.1) ** 2 + ((n.y + 0.3) / 0.08) ** 2)) * (n.z > 0 ? 1 : 0);
      gg -= 0.05 * nose; b -= 0.05 * nose;
      for (const E of this.eyeC) { const de = Math.hypot((tmp.x - E.x) / 1.6, (tmp.y - E.y) / 1.1) / er; if (tmp.z > 0) { const ring = Math.exp(-(((de - 1.25) / 0.35) ** 2)) * 0.12; r -= ring; gg -= ring * 1.1; b -= ring * 1.05; } }
      const sn = Math.exp(-(((n.x) / 0.1) ** 2 + ((n.y + 0.42) / 0.04) ** 2)) * (n.z > 0.5 ? 0.14 : 0); r -= sn; gg -= sn; b -= sn;
      const ul = Math.exp(-(((n.x) / 0.16) ** 2 + ((n.y + 0.7) / 0.04) ** 2)) * (n.z > 0.4 ? 0.1 : 0); r -= ul; gg -= ul; b -= ul;
      const nsd = Math.exp(-(((Math.abs(n.x) - 0.12) / 0.05) ** 2 + ((n.y + 0.25) / 0.12) ** 2)) * (n.z > 0.5 ? 0.06 : 0); r -= nsd; gg -= nsd; b -= nsd;
      const under = sstep(-0.75, -1, n.y) * 0.18;
      r -= under; gg -= under; b -= under;
      if (!girl) { const st = sstep(-0.35, -0.75, n.y) * (n.z > -0.3 ? 1 : 0) * (Math.abs(n.y + 0.55) > 0.07 || Math.abs(n.x) > 0.25 ? 1 : 0); r -= 0.1 * st; gg -= 0.1 * st; b -= 0.06 * st; } // stubble shadow
      col[i * 3] = r; col[i * 3 + 1] = gg; col[i * 3 + 2] = b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    g.scale(hr, hr, hr);
    this.headMesh = this.add(H, g, this.skinVC, 'head');
    // raycast helper on the head
    const rc = new THREE.Raycaster();
    const probe = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
    probe.updateMatrixWorld(true);
    const surf = (x, y, back = false) => {
      rc.set(V(x * hr, y * hr, back ? -1 : 1), V(0, 0, back ? 1 : -1));
      const hit = rc.intersectObject(probe, false)[0];
      return hit ? hit.point.clone() : V(x * hr, y * hr, 0.8 * hr);
    };
    this.surf = surf;
    // --- eyes
    const eyeTex = eyeTexture(P.iris);
    const eyeMat = new THREE.MeshPhysicalMaterial({ map: eyeTex, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.02, ior: 1.4 });
    this.eyes = [];
    this.eyeC.forEach((E, k) => {
      const s = k === 0 ? 1 : -1;
      const rig = new THREE.Group(); rig.position.copy(E).multiplyScalar(hr); rig.rotation.z = s * (girl ? 0.06 : 0.03); H.add(rig);
      const R = er * hr;
      const eg = new THREE.SphereGeometry(R, 32, 24); eg.rotateY(-Math.PI / 2);
      const ball = new THREE.Mesh(eg, eyeMat); rig.add(ball); this.meshes.push(ball);
      // lids: thin skin shells + margin + lashes
      const mkLid = (upper) => {
        const lg = new THREE.Group(); rig.add(lg);
        const th0 = upper ? 0.15 : Math.PI / 2, th1 = upper ? Math.PI / 2 - 0.15 : Math.PI / 2 - 0.15;
        const shell = new THREE.SphereGeometry(R * 1.075, 32, 10, Math.PI / 2 - 1.5, 3.0, th0, th1);
        if (!shell.attributes.color) setColor(shell, (v, cc) => cc.setRGB(0.97, upper ? 0.9 : 0.93, upper ? 0.88 : 0.92));
        this.add(lg, shell, this.skinVC);
        const margin = new THREE.TorusGeometry(R * 1.075, R * 0.075, 6, 32, 3.0);
        margin.rotateX(Math.PI / 2); // arc now runs from +x through +z to -x (front)
        setColor(margin, (v, cc) => cc.setRGB(0.95, 0.82, 0.8));
        const mm = new THREE.Mesh(margin, this.skinVC);
        mm.rotation.y = -0.07; lg.add(mm); this.meshes.push(mm);
        if (upper) {
          const lash = new THREE.TorusGeometry(R * 1.12, R * (girl ? 0.06 : 0.05), 5, 32, 3.0);
          lash.rotateX(Math.PI / 2);
          const lm = new THREE.Mesh(lash, MAT.lash); lm.rotation.y = mm.rotation.y; lm.position.y = R * 0.03; lg.add(lm); this.meshes.push(lm);
          // outer-corner flick
          const fl = sweep([V(0, 0, 0), V(R * 0.25, R * 0.15, -R * 0.1), V(R * 0.4, R * 0.3, -R * 0.25)], { segs: 4, radial: 5, radius: t => R * 0.05 * (1 - t) });
          const fm = new THREE.Mesh(fl, MAT.lash); fm.position.set(s * R * 1.0, R * 0.05, R * 0.3); fm.scale.x = s; lg.add(fm); this.meshes.push(fm);
        }
        return lg;
      };
      const upL = mkLid(true), loL = mkLid(false);
      this.eyes.push({ rig, ball, upL, loL, s });
    });
    // --- brows
    this.brows = [];
    for (const s of [1, -1]) {
      const bg = new THREE.Group(); H.add(bg);
      const pts = [];
      for (let i = 0; i <= 4; i++) {
        const t = i / 4;
        const x = s * (eyeX + (t - 0.45) * (girl ? 0.34 : 0.38));
        const y = eyeY + (girl ? 0.26 : 0.22) + Math.sin(t * Math.PI) * 0.045 - t * 0.02;
        const p = surf(x, y); p.z += 0.0025; pts.push(p);
      }
      const center = pts[2].clone();
      const bgeo = sweep(pts.map(p => p.clone().sub(center)), { segs: 14, radial: 6, radius: t => [hr * (girl ? 0.018 : 0.026) * (1 - 0.6 * t) + 0.0006, hr * 0.006], up: V(0, 0, 1) });
      const bm = this.add(bg, bgeo, girl ? MAT.brow : MAT.brow);
      bg.position.copy(center);
      bg.userData.base = center.clone();
      this.brows.push({ g: bg, s });
    }
    // --- mouth (dynamic)
    this.mouthC = surf(0, -0.6); this.mouthC.z -= 0.003;
    this.mouthG = new THREE.Group(); this.mouthG.position.copy(this.mouthC); H.add(this.mouthG);
    this.mouthW = hr * (girl ? 0.16 : 0.2);
    this.lipMat = skinMat(girl ? [0.86, 0.5, 0.48] : [0.74, 0.5, 0.44], false);
    this.lipMat.roughness = 0.38;
    this.mouthParts = {};
    this.mouthKey = '';
    // --- ears
    for (const s of [1, -1]) {
      const ep = surf(s * 0.78, -0.12); ep.x = s * (sx * hr * 0.92);
      const eg = sweep([V(0, -0.35, 0.05), V(0, 0.15, 0.2), V(0, 0.45, 0), V(0, 0.3, -0.25), V(0, -0.1, -0.2), V(0, -0.45, -0.05)].map(p => p.multiplyScalar(hr * 0.33)), { segs: 16, radial: 8, radius: t => [hr * 0.025, hr * 0.06 * (1 - 0.4 * Math.abs(t - 0.5))], up: V(1, 0, 0) });
      const em = this.add(H, eg, this.skin); em.position.copy(ep); em.position.z = -hr * 0.05; em.rotation.y = s * 0.25;
      const lobe = new THREE.SphereGeometry(hr * 0.1, 12, 8); deform(lobe, v => { v.x *= 0.35; });
      const lm = this.add(H, lobe, this.skin); lm.position.copy(em.position); lm.position.y -= hr * 0.02;
    }
    this.buildHair(M);
    // hat (hidden until dressed)
    this.hat = this.buildHat();
    this.hat.visible = false;
    H.add(this.hat);
  }
  buildHair(M) {
    const P = this.P, hr = P.hr, girl = this.kind === 'girl', H = this.headG;
    const mat = girl ? M.hair : M.hairPapa;
    // cap from the head surface
    const cap = this.headMesh.geometry.clone();
    cap.deleteAttribute('color');
    const pos = cap.attributes.position, uv = cap.attributes.uv;
    const keep = [];
    for (let i = 0; i < pos.count; i++) {
      const v = V(pos.getX(i), pos.getY(i), pos.getZ(i));
      const n = v.clone().normalize();
      const front = n.z;
      const line = girl ? 0.3 - 0.05 * Math.abs(n.x) : 0.62 - 0.2 * Math.abs(n.x);
      let inHair = (n.y > line) || (front < 0.15 && n.y > -0.25) || (front < -0.2 && n.y > -0.62);
      if (Math.abs(n.x) > 0.6 && n.y < 0.1 && front > -0.2) inHair = n.y > 0.08 && !girl ? false : inHair;
      keep.push(inHair);
      const k = girl ? 1.075 : 1.035;
      v.multiplyScalar(k);
      v.add(n.multiplyScalar(hr * (girl ? 0.006 : 0.004) * (1 + fbm(n.x * 5, n.y * 5, n.z * 5, 2))));
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    const idx = cap.index.array, ni = [];
    for (let i = 0; i < idx.length; i += 3) if (keep[idx[i]] && keep[idx[i + 1]] && keep[idx[i + 2]]) ni.push(idx[i], idx[i + 1], idx[i + 2]);
    cap.setIndex(ni);
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 6, uv.getY(i) * 1.5);
    cap.computeVertexNormals();
    this.add(H, cap, mat, 'hairCap');
    if (!girl) return;
    // bangs: one continuous sheet following the forehead, cut into soft clumps at the tips
    const strands = [];
    {
      const cols = 40, rows = 14, pos = [], uv = [], idx = [];
      const RB = (i => () => { i = (i * 16807) % 2147483647; return i / 2147483647; })(11);
      const clumpLen = []; for (let c = 0; c < 9; c++) clumpLen.push(0.2 + (RB() - 0.5) * 0.06);
      for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) {
        const u = c / cols, x = (u - 0.5) * 1.02;
        const ci = u * 8.999, k = Math.floor(ci), f = ci - k;
        const tipY = clumpLen[k] + Math.abs(x) * 0.12 + Math.pow(Math.abs(f - 0.5) * 2, 2) * 0.07; // pointed clumps
        const v = r / rows;
        const y = lerp(0.62, tipY, v);
        const p = this.surf(x * (0.82 + 0.06 * v), y);
        const nrm = p.clone().normalize();
        p.addScaledVector(nrm, hr * (0.05 - 0.025 * v) + hr * 0.008 * Math.sin(u * 60) * v);
        pos.push(p.x, p.y, p.z); uv.push(u * 9, v * 1.5);
      }
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const a = r * (cols + 1) + c, b2 = a + 1, cc = a + cols + 1, d = cc + 1; idx.push(a, cc, b2, b2, cc, d); }
      const bg = new THREE.BufferGeometry();
      bg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); bg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); bg.setIndex(idx); bg.computeVertexNormals();
      strands.push(bg);
    }
    // side locks
    for (const s of [1, -1]) for (let i = 0; i < 4; i++) {
      const a = V(s * hr * 0.62, hr * 0.62, hr * (0.25 - i * 0.12));
      const b = V(s * hr * 0.86, hr * 0.1, hr * (0.28 - i * 0.12));
      const c2 = V(s * hr * 0.88, -hr * 0.35, hr * (0.15 - i * 0.1));
      const d = V(s * hr * 0.8, -hr * 0.6, hr * (0.08 - i * 0.08));
      strands.push(sweep([a, b, c2, d], { segs: 10, radial: 6, radius: q => [hr * 0.1 * (1 - 0.5 * q), hr * 0.016], up: V(s, 0, 0), vScale: 8, uScale: 0.3 }));
    }
    this.add(H, merge(strands), mat, 'bangs');
    // pigtails (sway with spring)
    this.tails = [];
    for (const s of [1, -1]) {
      const root = new THREE.Group(); root.position.set(s * hr * 0.72, -hr * 0.28, -hr * 0.45); H.add(root);
      const tie = new THREE.Mesh(new THREE.TorusGeometry(hr * 0.09, hr * 0.035, 8, 16), MAT.tie);
      tie.rotation.set(0.6, s * 0.5, 0); root.add(tie); this.meshes.push(tie);
      const sw = new THREE.Group(); root.add(sw);
      const parts = [];
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * Math.PI * 2;
        const ox = Math.cos(a) * hr * 0.05, oz = Math.sin(a) * hr * 0.05;
        parts.push(sweep([V(ox * 0.5, 0, oz * 0.5), V(s * hr * 0.12 + ox * 1.6, -hr * 0.35, oz * 1.6 - hr * 0.05), V(s * hr * 0.1 + ox * 1.4, -hr * 0.85, oz * 1.2 - hr * 0.08), V(s * hr * 0.02 + ox * 0.6, -hr * 1.25, oz * 0.4 + hr * 0.02)],
          { segs: 12, radial: 6, radius: q => [hr * 0.07 * Math.sin(Math.PI * (0.15 + q * 0.85)) + hr * 0.01, hr * 0.03 * (1 - q * 0.6)], up: V(Math.cos(a), 0, Math.sin(a)), vScale: 8, uScale: 0.3 }));
      }
      this.add(sw, merge(parts), mat);
      this.tails.push({ sw, s, vx: 0, vz: 0, ax: 0, az: 0 });
    }
  }
  buildHat() {
    const P = this.P, hr = P.hr, M = MAT;
    const g = new THREE.Group();
    const R = hr * 1.06;
    const crownPts = [];
    for (let i = 0; i <= 16; i++) { const t = i / 16; const a = t * Math.PI / 2; crownPts.push(new THREE.Vector2(Math.max(0.001, R * (1.0 - 0.1 * t) * Math.cos(Math.max(0, a - 0.55) * 1.3)), hr * 0.5 * Math.sin(a) ** 0.6)); }
    const crown = new THREE.LatheGeometry(crownPts, 40);
    deform(crown, v => { v.x *= 0.86; v.z *= 1.0; v.y -= hr * 0.06 * Math.exp(-(v.x * v.x) / (hr * hr * 0.04)) * sstep(hr * 0.3, hr * 0.5, v.y); });
    const uvc = crown.attributes.uv; for (let i = 0; i < uvc.count; i++) uvc.setXY(i, uvc.getX(i) * 5, uvc.getY(i) * 1.2);
    const cm = new THREE.Mesh(crown, M.khaki); g.add(cm);
    // brim with a gentle droop
    const brimPts = [];
    for (let i = 0; i <= 8; i++) { const t = i / 8; brimPts.push(new THREE.Vector2(R * 0.98 + t * hr * 0.3, -t * t * hr * 0.09)); }
    const brimOut = new THREE.LatheGeometry(brimPts, 48);
    deform(brimOut, v => { const a = Math.atan2(v.z, v.x); v.y += Math.sin(a) * hr * 0.03 * (Math.hypot(v.x, v.z) / R - 1); v.x *= 0.88; });
    const uvb = brimOut.attributes.uv; for (let i = 0; i < uvb.count; i++) uvb.setXY(i, uvb.getX(i) * 5, uvb.getY(i) * 0.6);
    const bm = new THREE.Mesh(brimOut, M.khaki); g.add(bm);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(R * 0.98 + hr * 0.3, hr * 0.018, 6, 48), M.khakiDark);
    rim.rotation.x = Math.PI / 2; rim.position.y = -hr * 0.09; rim.scale.set(0.88, 1, 1); g.add(rim);
    const band = sweep([V(0, hr * 0.02, 0), V(0, hr * 0.14, 0)], { segs: 2, radial: 40, caps: false, radius: () => [R * 1.03 * 0.86, R * 1.03 * 1.0] });
    const bandM = new THREE.Mesh(band, M.leather); g.add(bandM);
    g.position.set(0, hr * 0.46, -hr * 0.1);
    g.rotation.x = -0.32;
    g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    return g;
  }

  // ---------------------------------------------------------------- mouth geometry from expression
  rebuildMouth() {
    const e = this.expr, hr = this.P.hr;
    const key = [e.smile, e.open, e.round].map(v => Math.round(v * 40)).join(',');
    if (key === this.mouthKey) return;
    this.mouthKey = key;
    for (const k in this.mouthParts) { const m = this.mouthParts[k]; this.mouthG.remove(m); m.geometry.dispose(); }
    this.mouthParts = {};
    const w = this.mouthW * (1 - 0.38 * e.round + 0.12 * Math.max(0, e.smile) * (1 - e.round));
    const Rc = hr * 0.55;
    const N = 14;
    const sm = e.smile, op = e.open * hr * 0.2, rd = e.round;
    const yc = u => sm * 0.32 * w * Math.pow(Math.abs(u), 1.8) - (sm < 0 ? 0 : 0);
    const upEdge = [], loEdge = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N * 2 - 1;
      const x = u * w;
      const z = -(x * x) / (2 * Rc) + rd * 0.006 * (1 - u * u);
      const env = Math.pow(1 - u * u, 0.6 + 0.4 * (1 - rd));
      const top = yc(u) + op * 0.32 * env;
      const bot = yc(u) - op * (0.68 + 0.2 * Math.max(0, sm)) * env;
      upEdge.push(V(x, top, z)); loEdge.push(V(x, bot, z));
    }
    // inner mouth (dark), recessed
    if (e.open > 0.03) {
      const shape = new THREE.Shape();
      shape.moveTo(upEdge[0].x, upEdge[0].y);
      for (const p of upEdge) shape.lineTo(p.x, p.y);
      for (let i = loEdge.length - 1; i >= 0; i--) shape.lineTo(loEdge[i].x, loEdge[i].y);
      const ig = new THREE.ShapeGeometry(shape, 1);
      deform(ig, v => { v.z = -(v.x * v.x) / (2 * Rc) - 0.0025; }, false);
      const im = new THREE.Mesh(ig, MAT.mouthIn); this.mouthG.add(im); this.mouthParts.inner = im;
      // teeth (upper)
      const tw = w * 0.62, tt = upEdge.slice(3, N - 2).map(p => V(p.x * 0.85, p.y - hr * 0.004, p.z - 0.0012));
      const tg = sweep(tt, { segs: 10, radial: 6, radius: () => [hr * 0.012, hr * 0.012 + op * 0.12], up: V(0, 0, 1), caps: true });
      const tm = new THREE.Mesh(tg, MAT.teeth); this.mouthG.add(tm); this.mouthParts.teeth = tm;
      if (e.open > 0.35) {
        const tongue = new THREE.SphereGeometry(1, 16, 10); deform(tongue, v => { v.x *= w * 0.55; v.y *= op * 0.25; v.z *= hr * 0.04; }, false);
        tongue.computeVertexNormals();
        const tgm = new THREE.Mesh(tongue, MAT.tongue); tgm.position.set(0, loEdge[7].y + op * 0.18, -0.004); this.mouthG.add(tgm); this.mouthParts.tongue = tgm;
      }
    }
    // lips as soft tubes along the edges
    const lipR = (up) => q => { const k = Math.sin(Math.PI * q); const bow = up ? 1 - 0.25 * Math.exp(-(((q - 0.5) / 0.06) ** 2)) : 1; return [hr * (up ? 0.022 : 0.03) * (0.3 + 0.7 * k) * (1 + rd * 0.4) * bow, hr * (up ? 0.024 : 0.03) * (0.3 + 0.7 * k)]; };
    const ul = sweep(upEdge.map(p => V(p.x, p.y + hr * 0.012, p.z + 0.0015)), { segs: 20, radial: 8, radius: lipR(true), up: V(0, 0, 1) });
    const ll = sweep(loEdge.map(p => V(p.x, p.y - hr * 0.016, p.z + 0.0012)), { segs: 20, radial: 8, radius: lipR(false), up: V(0, 0, 1) });
    for (const [k, gg] of [['ul', ul], ['ll', ll]]) {
      const m = new THREE.Mesh(gg, this.lipMat); m.castShadow = false; this.mouthG.add(m); this.mouthParts[k] = m;
    }
    // corner dimples (darker creases) when smiling
    for (const s of [-1, 1]) {
      const p = upEdge[s < 0 ? 0 : N];
      const cg = new THREE.SphereGeometry(hr * 0.012, 8, 6);
      const cm = new THREE.Mesh(cg, MAT.mouthIn); cm.position.set(p.x + s * hr * 0.004, p.y, p.z - 0.001); cm.scale.set(1, 0.6, 0.4);
      this.mouthG.add(cm); this.mouthParts['c' + s] = cm;
    }
  }

  // ---------------------------------------------------------------- expressions
  setExpr(o) { Object.assign(this.exprT, o); }
  face(name) {
    const F = {
      neutral: { smile: 0.25, open: 0, round: 0, browUp: 0, browIn: 0, lid: 1, squint: 0 },
      happy: { smile: 0.9, open: 0.25, round: 0, browUp: 0.3, browIn: 0, lid: 1, squint: 0.45 },
      laugh: { smile: 1, open: 0.7, round: 0, browUp: 0.5, browIn: 0, lid: 0.9, squint: 0.8 },
      wow: { smile: 0.2, open: 0.75, round: 0.75, browUp: 1, browIn: 0, lid: 1.15, squint: 0 },
      puzzled: { smile: -0.2, open: 0.12, round: 0.4, browUp: 0.6, browIn: 0.8, lid: 1, squint: 0 },
      focus: { smile: 0.1, open: 0, round: 0.25, browUp: -0.35, browIn: 0.3, lid: 0.85, squint: 0.2 },
      oops: { smile: 0.5, open: 0.35, round: 0, browUp: 0.7, browIn: 0.9, lid: 1.05, squint: 0.1 },
      proud: { smile: 0.85, open: 0, round: 0, browUp: 0.15, browIn: 0, lid: 0.9, squint: 0.35 },
    };
    this.setExpr(F[name] || F.neutral);
    this.faceName = name;
  }
  lookAt(p, w = 1) { this.look.copy(p); this.lookW = w; }

  // ---------------------------------------------------------------- arm IK (world target, world pole)
  solveArm(sd, target, pole, wristBend = 0) {
    const J = this.J, P = this.P;
    const sh = J['sh' + sd], el = J['el' + sd], wr = J['wr' + sd];
    sh.parent.updateMatrixWorld(true);
    const S = new THREE.Vector3().setFromMatrixPosition(sh.matrixWorld);
    const a = P.upA, b = P.foA;
    const toT = target.clone().sub(S);
    let d = toT.length();
    const dir = toT.clone().normalize();
    d = clamp(d, Math.abs(a - b) + 0.01, a + b - 0.002);
    const cosA = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1);
    const pl = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
    const E = S.clone().addScaledVector(dir, cosA * a).addScaledVector(pl, Math.sqrt(1 - cosA * cosA) * a);
    const T = S.clone().addScaledVector(dir, d);
    const u1 = E.clone().sub(S).normalize(), u2 = T.clone().sub(E).normalize();
    let nrm = new THREE.Vector3().crossVectors(u1, u2);
    if (nrm.lengthSq() < 1e-8) nrm.set(1, 0, 0).cross(u1);
    nrm.normalize();
    const worldQ = (yDown, xAxis) => {
      const Y = yDown.clone().negate();
      const X = xAxis.clone().sub(Y.clone().multiplyScalar(xAxis.dot(Y))).normalize();
      const Z = new THREE.Vector3().crossVectors(X, Y);
      return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z));
    };
    // flexion should bend the forearm toward local +Z: choose X sign accordingly
    let X = nrm.clone();
    { const q = worldQ(u1, X); const Zw = V(0, 0, 1).applyQuaternion(q); if (Zw.dot(u2) < 0) X.negate(); }
    const q1 = worldQ(u1, X), q2 = worldQ(u2, X);
    const pq = new THREE.Quaternion(); sh.parent.getWorldQuaternion(pq);
    sh.quaternion.copy(pq.clone().invert().multiply(q1));
    el.quaternion.copy(q1.clone().invert().multiply(q2));
    wr.quaternion.setFromEuler(new THREE.Euler(wristBend, 0, 0));
  }
  setGrip(sd, k) {
    const f = this['fingers' + sd]; if (!f) return;
    for (let i = 0; i < 4; i++) { f[i].base.rotation.z = -k * (1.3 + i * 0.05) - 0.12; f[i].mid.rotation.z = -k * 1.4 - 0.18; }
    f.thumb.rotation.set(-0.35 - k * 0.3, k * 0.2, 0.35 + k * 0.7);
  }

  // ---------------------------------------------------------------- per-frame
  update(dt) {
    this.time += dt;
    const e = this.expr, T = this.exprT;
    for (const k in T) e[k] = damp(e[k], T[k], 12, dt);
    // blink
    this.blinkT -= dt;
    if (this.blinkT < 0) { this.blink = 1; this.blinkT = 2 + Math.random() * 3.5; }
    this.blink = Math.max(0, this.blink - dt * 7);
    const bl = Math.sin(Math.min(1, this.blink) * Math.PI);
    // eyes look
    this.headG.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(this.headG.matrixWorld).invert();
    const lp = this.look.clone().applyMatrix4(inv);
    for (const E of this.eyes) {
      const d = lp.clone().sub(E.rig.position);
      const yaw = clamp(Math.atan2(d.x, d.z), -0.6, 0.6), pitch = clamp(Math.atan2(d.y, Math.hypot(d.x, d.z)), -0.45, 0.4);
      E.ball.rotation.set(-pitch, yaw, -E.rig.rotation.z);
      const open = e.lid * (1 - bl);
      const pitchFollow = pitch * 0.35;
      E.upL.rotation.x = lerp(0.38, -0.5, clamp(open - e.squint * 0.25, 0, 1.2)) - pitchFollow;
      E.loL.rotation.x = lerp(0.04, 0.72, clamp(1 - e.squint * 0.75, 0, 1)) * (0.4 + 0.6 * Math.min(1, open + 0.3)) - pitchFollow * 0.5;
    }
    for (const B of this.brows) {
      const b = B.g.userData.base;
      B.g.position.set(b.x, b.y + this.P.hr * (0.07 * e.browUp - 0.02 * e.squint), b.z + 0.001);
      B.g.rotation.z = B.s * (-0.22 * e.browIn + 0.05 * e.browUp);
    }
    this.rebuildMouth();
    // pigtail spring from head motion
    if (this.tails) {
      const hp = new THREE.Vector3().setFromMatrixPosition(this.headG.matrixWorld);
      if (!this.prevHead) this.prevHead = hp.clone();
      const vel = hp.clone().sub(this.prevHead).divideScalar(Math.max(dt, 1e-3));
      this.prevHead.copy(hp);
      for (const t of this.tails) {
        const fx = -vel.z * 0.6, fz = vel.x * 0.6;
        t.vx += (fx - t.ax * 30) * dt - t.vx * 4 * dt; t.vz += (fz - t.az * 30) * dt - t.vz * 4 * dt;
        t.ax = clamp(t.ax + t.vx * dt * 10, -0.6, 0.6); t.az = clamp(t.az + t.vz * dt * 10, -0.6, 0.6);
        t.sw.rotation.set(t.ax + 0.05 * Math.sin(this.time * 1.7 + t.s), 0, t.az);
      }
    }
  }
}
