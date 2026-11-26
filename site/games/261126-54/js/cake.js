// The cake: one continuous lathe surface (top -> rounded rim -> side) parameterised by
// (theta, s = arc length along the profile). A state texture over that space stores
//   R = cream thickness (0..1 = 0..10 mm)   G = smoothness (number of knife passes)
//   B = chocolate thickness (0..1 = 0..4mm) A = powdered sugar
// The JS side simulates the materials (knife bulldozing, streaks, chocolate yield-flow,
// sugar speckle); the shader displaces the surface and builds colour/roughness/normal from it.
import * as THREE from 'three';
import { clamp, lerp, rnd, tex, sstep } from './util.js';

export const R = 0.09, HS = 0.066, BEV = 0.007;
const S_TOP = R - BEV, S_BEV = S_TOP + Math.PI * BEV / 2, S_ALL = S_BEV + (HS - BEV);
export const NU = 512, NV = 160;
// state texture holds millimetres (half float): R cream, B chocolate; G smoothness, A sugar 0..1
const T_MM = 3.2;
const _f32 = new Float32Array(1), _u32 = new Uint32Array(_f32.buffer);
function toHalf(v) {
  _f32[0] = v; const x = _u32[0];
  const sign = (x >> 16) & 0x8000; let e = ((x >> 23) & 0xff) - 127 + 15; let m = x & 0x7fffff;
  if (e <= 0) return sign; if (e >= 31) return sign | 0x7c00;
  return sign | (e << 10) | (m >> 13);
}

// profile position for arc length s -> [r, y, nr, ny]
export function prof(s) {
  if (s <= S_TOP) return [s, HS, 0, 1];
  if (s <= S_BEV) {
    const a = (s - S_TOP) / BEV; // 0..pi/2
    return [S_TOP + Math.sin(a) * BEV, HS - BEV + Math.cos(a) * BEV, Math.sin(a), Math.cos(a)];
  }
  return [R, HS - BEV - (s - S_BEV), 1, 0];
}
export function sOf(r, y) {
  if (y >= HS - BEV * 0.3 && r <= S_TOP) return r;
  if (y <= HS - BEV && r >= R - BEV * 0.3) return S_BEV + (HS - BEV - y);
  const a = Math.atan2(r - S_TOP, y - (HS - BEV));
  return S_TOP + clamp(a, 0, Math.PI / 2) * BEV;
}

let sharedGeo = null;
function cakeGeometry() {
  if (sharedGeo) return sharedGeo;
  // profile samples: denser around the rim
  const ss = [];
  const nTop = 46, nBev = 14, nSide = 40;
  for (let i = 0; i <= nTop; i++) ss.push(S_TOP * Math.pow(i / nTop, 0.8));
  for (let i = 1; i <= nBev; i++) ss.push(S_TOP + (S_BEV - S_TOP) * i / nBev);
  for (let i = 1; i <= nSide; i++) ss.push(S_BEV + (S_ALL - S_BEV) * i / nSide);
  const NT = 256;
  const pos = [], nor = [], uv = [], tan = [];
  for (let j = 0; j < ss.length; j++) {
    const [r, y, nr, ny] = prof(ss[j]);
    for (let i = 0; i <= NT; i++) {
      const th = i / NT * Math.PI * 2;
      const c = Math.cos(th), s = Math.sin(th);
      pos.push(r * c, y, r * s);
      nor.push(nr * c, ny, nr * s);
      uv.push(i / NT, ss[j] / S_ALL);
      tan.push(-s, 0, c);
    }
  }
  const idx = [];
  const W = NT + 1;
  for (let j = 0; j < ss.length - 1; j++) for (let i = 0; i < NT; i++) {
    const a = j * W + i, b = a + 1, c = a + W, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('ctan', new THREE.Float32BufferAttribute(tan, 3));
  g.setIndex(idx);
  g.computeBoundingSphere();
  g.boundingSphere.radius += 0.02;
  sharedGeo = g;
  return g;
}

// ------------------------------------------------------------------ material
function cakeMaterial(stateTex) {
  const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.6, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.4, sheenRoughness: 0.5, sheenColor: new THREE.Color(0xfff4e6) });
  const U = {
    tState: { value: stateTex },
    tTopC: { value: tex('spongetop_c.jpg', { srgb: true }) }, tTopN: { value: tex('spongetop_n.jpg') }, tTopR: { value: tex('spongetop_r.jpg') },
    tSideC: { value: tex('spongeside_c.jpg', { srgb: true }) }, tSideN: { value: tex('spongeside_n.jpg') },
    tNoise: { value: tex('creamnoise.png') },
    texel: { value: new THREE.Vector2(1 / NU, 1 / NV) },
    sAll: { value: S_ALL }, sTop: { value: S_TOP }, cakeR: { value: R },
    creamCol: { value: new THREE.Color(0xfbf6ec) }, chocCol: { value: new THREE.Color(0x2e1308) },
    glow: { value: 0 },
  };
  m.userData.U = U;
  // a flat normal map + clearcoat normal so the TBN helpers are compiled in
  m.normalMap = flatNormal(); m.clearcoatNormalMap = m.normalMap;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        uniform sampler2D tState; uniform float sAll; attribute vec3 ctan;
        varying vec3 vLocal; varying vec2 vCuv; varying vec3 vT; varying vec3 vB; varying float vS;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec4 stv = texture2D(tState, uv);
        float hmm = stv.r + stv.b;
        transformed += normal * hmm * 0.001;
        vLocal = position; vCuv = uv; vS = uv.y * sAll;
        vT = normalize(normalMatrix * ctan);
        vB = normalize(normalMatrix * cross(normal, ctan));`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform sampler2D tState, tTopC, tTopN, tTopR, tSideC, tSideN, tNoise; uniform vec2 texel; uniform float sAll, sTop, cakeR, glow;
        uniform vec3 creamCol, chocCol;
        varying vec3 vLocal; varying vec2 vCuv; varying vec3 vT; varying vec3 vB; varying float vS;
        float cakeSide; vec4 cst; float creamA, chocA, sugarA, smoothA; vec3 spN;`)
      .replace('#include <map_fragment>', `
        cst = texture2D(tState, vCuv);
        cakeSide = smoothstep(sTop - 0.002, sTop + 0.006, vS);
        vec2 topUv = vLocal.xz * 5.0;
        vec2 sideUv = vec2(atan(vLocal.z, vLocal.x) * cakeR * 5.0, vLocal.y * 5.0);
        vec3 sp = mix(texture2D(tTopC, topUv).rgb, texture2D(tSideC, sideUv).rgb, cakeSide);
        spN = mix(texture2D(tTopN, topUv).xyz, texture2D(tSideN, sideUv).xyz, cakeSide) * 2. - 1.;
        vec2 nuv = vec2(vCuv.x * 6.2832 * max(cakeR*0.6, vS) * 9.0, vS * 9.0);
        vec3 nz = texture2D(tNoise, nuv).rgb;
        float thick = cst.r;
        creamA = smoothstep(0.12, 1.9, thick);
        chocA = smoothstep(0.02, 0.25, cst.b);
        sugarA = clamp(cst.a * (0.55 + 0.9 * nz.b * nz.r), 0., 1.);
        smoothA = cst.g;
        // thin cream is translucent: the brown sponge shows through as beige
        vec3 cream = creamCol * (0.93 + 0.07 * nz.r);
        vec3 thinMix = mix(sp * vec3(1.25, 1.12, 0.95), cream, 0.55);
        vec3 col = mix(sp, mix(thinMix, cream, smoothstep(0.9, 3.0, thick)), creamA);
        vec3 choc = chocCol * (0.85 + 0.3 * smoothstep(0.0, 1.5, cst.b));
        col = mix(col, choc, chocA);
        col = mix(col, vec3(0.97, 0.96, 0.95), sugarA * 0.92);
        diffuseColor.rgb *= col;
        diffuseColor.rgb += glow * vec3(0.12, 0.09, 0.05);
      `)
      .replace('#include <roughnessmap_fragment>', `
        float spR = mix(texture2D(tTopR, vLocal.xz * 5.0).g, 0.75, cakeSide);
        float roughnessFactor = mix(spR, 0.48 - 0.16 * smoothA, creamA);
        roughnessFactor = mix(roughnessFactor, 0.16, chocA);
        roughnessFactor = mix(roughnessFactor, 0.92, sugarA);
      `)
      .replace('#include <normal_fragment_maps>', `
        {
          // height field (meters) from the state texture -> perturbed normal
          float du = texel.x, dv = texel.y;
          vec4 a = texture2D(tState, vCuv + vec2(du, 0.)), b = texture2D(tState, vCuv - vec2(du, 0.));
          vec4 c = texture2D(tState, vCuv + vec2(0., dv)), d = texture2D(tState, vCuv - vec2(0., dv));
          float hA = a.r + a.b + a.a * 0.25;
          float hB = b.r + b.b + b.a * 0.25;
          float hC = c.r + c.b + c.a * 0.25;
          float hD = d.r + d.b + d.a * 0.25;
          float rr = max(0.004, mix(vS, cakeR, cakeSide));
          float dT = (hA - hB) * 0.001 / (2. * du * 6.2832 * rr);
          float dS = (hC - hD) * 0.001 / (2. * dv * sAll);
          // micro: cream bubbles/lumps (fade as it is smoothed), sponge pores where bare
          float lumpy = creamA * (1. - smoothA) * (1. - chocA);
          vec2 nuv2 = vec2(vCuv.x * 6.2832 * max(cakeR*0.6, vS) * 9.0, vS * 9.0);
          float e = 0.002;
          float n0 = texture2D(tNoise, nuv2).r, n1 = texture2D(tNoise, nuv2 + vec2(e, 0.)).r, n2 = texture2D(tNoise, nuv2 + vec2(0., e)).r;
          dT += (n1 - n0) * lumpy * 0.9; dS += (n2 - n0) * lumpy * 0.9;
          float bub = texture2D(tNoise, nuv2 * 3.0).b;
          vec3 nG = normalize(vNormal);
          vec3 T = normalize(vT), B = normalize(vB);
          // profile direction: s increases away from the centre/down the side
          normal = normalize(nG - T * dT - B * dS);
          // bare sponge detail
          vec3 sn = spN * vec3(1.0, 1.0, 1.0);
          normal = normalize(mix(normal, normalize(T * sn.x + B * sn.y + normal * sn.z), (1. - creamA) * (1. - chocA) * 0.9));
          // sugar grains
          normal = normalize(normal + (vec3(n1, n2, bub) - 0.5) * sugarA * 0.35);
        }
      `)
      .replace('#include <clearcoat_normal_fragment_maps>', `clearcoatNormal = normal;`)
      .replace('#include <lights_physical_fragment>', `#include <lights_physical_fragment>
        material.clearcoat = chocA * (1. - sugarA);
        material.clearcoatRoughness = 0.05;
        material.sheenColor *= creamA * (1. - chocA);
      `)
;
  };
  m.customProgramCacheKey = () => 'cake1';
  return m;
}
let _flat = null;
function flatNormal() {
  if (_flat) return _flat;
  const d = new Uint8Array([128, 128, 255, 255]);
  _flat = new THREE.DataTexture(d, 1, 1); _flat.needsUpdate = true; return _flat;
}

// ------------------------------------------------------------------ strawberry & rosette geometry
let berryGeo = null, calyxGeo = null, rosetteGeo = null;
export function strawberryGeo() {
  if (berryGeo) return berryGeo;
  const pts = [];
  const N = 28;
  for (let i = 0; i <= N; i++) {
    const t = i / N; // 0 tip -> 1 top
    const y = t * 0.034;
    const ctl = [[0, 0.0008], [0.08, 0.0042], [0.25, 0.0082], [0.48, 0.0114], [0.68, 0.0127], [0.84, 0.0119], [0.94, 0.0088], [1, 0.0006]];
    let r = 0;
    for (let c = 0; c < ctl.length - 1; c++) if (t >= ctl[c][0] && t <= ctl[c + 1][0]) { const u = (t - ctl[c][0]) / (ctl[c + 1][0] - ctl[c][0]); const uu = u * u * (3 - 2 * u); r = ctl[c][1] + (ctl[c + 1][1] - ctl[c][1]) * (c === 0 ? u : uu); }
    pts.push(new THREE.Vector2(Math.max(0.0004, r), y));
  }
  pts[N].x = 0.0001;
  const g = new THREE.LatheGeometry(pts, 32);
  // irregular, slightly lumpy shape
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = Math.atan2(z, x);
    const k = 1 + 0.06 * Math.sin(a * 3 + y * 200) + 0.04 * Math.sin(a * 5 - y * 300);
    p.setXYZ(i, x * k, y, z * k * 0.95);
  }
  g.computeVertexNormals();
  g.translate(0, -0.003, 0);
  berryGeo = g;
  // calyx: small star of leaves
  const cg = [];
  const leaves = 7;
  const pos = [], idx = [];
  for (let l = 0; l < leaves; l++) {
    const a = l / leaves * Math.PI * 2 + 0.2;
    const base = pos.length / 3;
    const segs = 6;
    for (let s = 0; s <= segs; s++) {
      const t = s / segs;
      const r = 0.0015 + t * 0.0085;
      const w = Math.sin(t * Math.PI) * 0.0026 + 0.0004;
      const y = 0.0312 + Math.sin(t * Math.PI * 0.9) * 0.0015 - t * t * 0.005;
      const cx = Math.cos(a) * r, cz = Math.sin(a) * r;
      const px = -Math.sin(a) * w, pz = Math.cos(a) * w;
      pos.push(cx + px, y, cz + pz, cx - px, y, cz - pz);
      if (s > 0) { const q = base + (s - 1) * 2; idx.push(q, q + 2, q + 1, q + 1, q + 2, q + 3); }
    }
  }
  calyxGeo = new THREE.BufferGeometry();
  calyxGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  calyxGeo.setIndex(idx); calyxGeo.computeVertexNormals();
  return berryGeo;
}
export function rosetteGeometry() {
  if (rosetteGeo) return rosetteGeo;
  // star-tip piped swirl: a spiral path with an 8-point star cross-section
  const turns = 1.7, steps = 120, ring = 40, pts = 8;
  const pos = [], nor = [], idx = [], uv = [];
  const P = (t) => {
    const a = t * turns * Math.PI * 2;
    const rad = 0.0072 * (t < 0.55 ? 1 : Math.max(0, 1 - (t - 0.55) / 0.45));
    const y = 0.0045 + Math.max(0, t - 0.4) * 0.022 + t * 0.004;
    return new THREE.Vector3(Math.cos(a) * rad, y, Math.sin(a) * rad);
  };
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const c = P(t), n = P(Math.min(1, t + 0.01)), pr = P(Math.max(0, t - 0.01));
    const T = n.clone().sub(pr).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const Nn = new THREE.Vector3().crossVectors(T, up).normalize();
    const B = new THREE.Vector3().crossVectors(Nn, T).normalize();
    const sz = 0.0056 * (t > 0.6 ? Math.max(0.02, 1 - (t - 0.6) / 0.4) : 1) * Math.min(1, Math.sqrt(t / 0.04));
    for (let k = 0; k <= ring; k++) {
      const a = k / ring * Math.PI * 2;
      const star = 1 - 0.28 * Math.pow(Math.abs(Math.cos(a * pts / 2)), 0.6);
      const rr = sz * star;
      const off = Nn.clone().multiplyScalar(Math.cos(a) * rr).addScaledVector(B, Math.sin(a) * rr * 0.9);
      const v = c.clone().add(off);
      pos.push(v.x, Math.max(0, v.y), v.z);
      nor.push(0, 1, 0);
      uv.push(k / ring, t);
    }
  }
  const W = ring + 1;
  for (let i = 0; i < steps; i++) for (let k = 0; k < ring; k++) {
    const a = i * W + k, b = a + 1, c = a + W, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  rosetteGeo = g;
  return g;
}
let berryMat = null, calyxMat = null, rosetteMat = null;
export function berryMaterials() {
  if (!berryMat) {
    berryMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: tex('berry_c.jpg', { srgb: true }), normalMap: tex('berry_n.jpg'), roughnessMap: tex('berry_r.jpg'), roughness: 1, clearcoat: 0.6, clearcoatRoughness: 0.15, sheen: 0.3, sheenColor: new THREE.Color(0xff6060) });
    berryMat.normalScale.set(0.8, 0.8);
    berryMat.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
        reflectedLight.indirectDiffuse += diffuseColor.rgb * vec3(0.5,0.05,0.04) * 0.25;`);
    };
    calyxMat = new THREE.MeshStandardMaterial({ color: 0x3a5220, roughness: 0.55, side: THREE.DoubleSide });
    rosetteMat = new THREE.MeshPhysicalMaterial({ color: 0xfbf6ec, roughness: 0.5, sheen: 0.5, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.4 });
    tex('creamnoise.png', { onload: (t) => { const c = t.clone(); c.repeat.set(2, 2); c.needsUpdate = true; rosetteMat.bumpMap = c; rosetteMat.bumpScale = 0.6; rosetteMat.needsUpdate = true; } });
  }
  return { berryMat, calyxMat, rosetteMat };
}
export function makeStrawberry() {
  const { berryMat, calyxMat } = berryMaterials();
  const g = new THREE.Group();
  const b = new THREE.Mesh(strawberryGeo(), berryMat); b.castShadow = true; b.receiveShadow = true;
  const c = new THREE.Mesh(calyxGeo, calyxMat); c.castShadow = true;
  g.add(b, c);
  return g;
}

// ------------------------------------------------------------------ Cake
export class Cake {
  constructor() {
    this.group = new THREE.Group();
    this.data = new Uint16Array(NU * NV * 4);
    this.H = new Float32Array(NU * NV);   // cream thickness
    this.SM = new Float32Array(NU * NV);  // smoothness
    this.K = new Float32Array(NU * NV);   // chocolate
    this.SG = new Float32Array(NU * NV);  // sugar
    this.yieldK = new Float32Array(NU * NV);
    this.tex = new THREE.DataTexture(this.data, NU, NV, THREE.RGBAFormat, THREE.HalfFloatType);
    this.tex.wrapS = THREE.RepeatWrapping; this.tex.wrapT = THREE.ClampToEdgeWrapping;
    this.tex.magFilter = THREE.LinearFilter; this.tex.minFilter = THREE.LinearFilter;
    this.tex.needsUpdate = true;
    this.mat = cakeMaterial(this.tex);
    this.mesh = new THREE.Mesh(cakeGeometry(), this.mat);
    this.mesh.castShadow = true; this.mesh.receiveShadow = true;
    this.mesh.userData.cake = this;
    this.group.add(this.mesh);
    // bottom disc (sponge base, hidden mostly)
    this.deco = new THREE.Group(); this.group.add(this.deco);
    this.berries = []; this.rosettes = [];
    // per-texel geometry
    this.PX = new Float32Array(NU * NV); this.PY = new Float32Array(NU * NV); this.PZ = new Float32Array(NU * NV);
    this.A = new Float32Array(NU * NV); this.Sj = new Float32Array(NV);
    for (let j = 0; j < NV; j++) {
      const s = (j + 0.5) / NV * S_ALL; this.Sj[j] = s;
      const [r, y] = prof(s);
      for (let i = 0; i < NU; i++) {
        const th = (i + 0.5) / NU * Math.PI * 2, k = j * NU + i;
        this.PX[k] = r * Math.cos(th); this.PY[k] = y; this.PZ[k] = r * Math.sin(th);
        this.A[k] = Math.max(1e-7, (2 * Math.PI * Math.max(r, 0.0005) / NU) * (S_ALL / NV));
      }
    }
    for (let k = 0; k < NU * NV; k++) this.yieldK[k] = 0.05 + 0.12 * rnd();
    // smooth 1D noise table for knife streaks
    this.stN = new Float32Array(4096);
    { let v = 0; for (let i = 0; i < 4096; i++) { v = v * 0.55 + (rnd() * 2 - 1) * 0.45; this.stN[i] = v; } let mx = 0; for (const x of this.stN) mx = Math.max(mx, Math.abs(x)); for (let i = 0; i < 4096; i++) this.stN[i] /= mx; }
    // per-column drip tendency (fingers)
    this.colY = new Float32Array(NU);
    for (let i = 0; i < NU; i++) this.colY[i] = 0.08 + 0.7 * Math.pow(rnd(), 3);
    for (let p = 0; p < 2; p++) for (let i = 0; i < NU; i++) this.colY[i] = (this.colY[i] * 2 + this.colY[(i + 1) % NU] + this.colY[(i + NU - 1) % NU]) / 4;
    this.dirty = true; this.chocActive = 0;
    this.load = 0;
    this.stats = { cov: 0, smooth: 0, choc: 0, sugar: 0 };
  }
  idx(i, j) { return j * NU + ((i % NU) + NU) % NU; }
  // local point (cake space) -> [i, j]
  uvOf(x, y, z) {
    const r = Math.hypot(x, z);
    const s = sOf(r, y);
    let th = Math.atan2(z, x); if (th < 0) th += Math.PI * 2;
    return [th / (Math.PI * 2) * NU - 0.5, s / S_ALL * NV - 0.5, s, th];
  }
  // initial lumpy dollop of whipped cream on the top
  dollop(amount = 1) {
    const cx = (rnd() - 0.5) * 0.02, cz = (rnd() - 0.5) * 0.02;
    const blobs = [];
    for (let b = 0; b < 10; b++) blobs.push([cx + (rnd() - .5) * 0.07, cz + (rnd() - .5) * 0.07, 0.01 + rnd() * 0.014, 3 + rnd() * 6]);
    for (let b = 0; b < 70; b++) { const a = rnd() * 6.283, rr = Math.sqrt(rnd()) * 0.05; blobs.push([cx + Math.cos(a) * rr, cz + Math.sin(a) * rr, 0.003 + rnd() * 0.006, (rnd() - 0.3) * 4]); }
    for (let j = 0; j < NV; j++) {
      const s = this.Sj[j]; if (s > S_TOP) break;
      for (let i = 0; i < NU; i++) {
        const k = j * NU + i, x = this.PX[k], z = this.PZ[k];
        const d2 = (x - cx) ** 2 + (z - cz) ** 2;
        let h = 20 * Math.exp(-d2 / (0.036 * 0.036)) * amount;
        for (const [bx, bz, br, bh] of blobs) h += bh * Math.exp(-((x - bx) ** 2 + (z - bz) ** 2) / (br * br)) * amount * Math.min(1, h / 3 + 0.3);
        this.H[k] = Math.min(40, h);
      }
    }
    this.dirty = true;
  }
  // fully finished white cake (used for shop stock)
  frostSmooth() {
    for (let k = 0; k < NU * NV; k++) { this.H[k] = 3.1 + 0.1 * rnd(); this.SM[k] = 1; }
    // a few horizontal spatula streaks on the side
    for (let j = 0; j < NV; j++) { const a = 0.12 * this.stN[(j * 37) & 4095]; for (let i = 0; i < NU; i++) this.H[j * NU + i] += a * (this.Sj[j] > S_BEV ? 1 : 0.3) + 0.06 * this.stN[(i * 13 + j * 7) & 4095]; }
    this.dirty = true;
  }

  // ---------------------------------------------------------------- knife
  // stroke from local p0 to p1. mode 'top' or 'side'. returns amount of change (for sound/feedback)
  knife(p0, p1, mode) {
    const dx = p1.x - p0.x, dy = p1.y - p0.y, dz = p1.z - p0.z;
    const L = Math.hypot(dx, dy, dz);
    const n = Math.max(1, Math.ceil(L / 0.003));
    let work = 0;
    for (let q = 1; q <= n; q++) {
      const t = q / n;
      work += this.knifeStamp(p0.x + dx * t, p0.y + dy * t, p0.z + dz * t, dx / (L || 1), dy / (L || 1), dz / (L || 1), mode);
    }
    this.dirty = true;
    return work;
  }
  knifeStamp(cx, cy, cz, mx, my, mz, mode) {
    // footprint: long axis across the motion (like a squeegee)
    const side = mode === 'side';
    const halfLong = side ? 0.045 : 0.032, halfShort = side ? 0.007 : 0.008;
    // across direction: on top = cross(up, m); on side = vertical
    let ax, ay, az;
    if (side) { ax = 0; ay = 1; az = 0; } else { ax = -mz; ay = 0; az = mx; const l = Math.hypot(ax, az) || 1; ax /= l; az /= l; }
    const [ic, jc, sc] = this.uvOf(cx, cy, cz);
    const T = T_MM;
    const jr = Math.ceil((side ? 0.05 : 0.035) / S_ALL * NV);
    let work = 0;
    const j0 = Math.max(0, Math.floor(jc) - jr), j1 = Math.min(NV - 1, Math.ceil(jc) + jr);
    const seed = this.strokeSeed;
    for (let j = j0; j <= j1; j++) {
      const s = this.Sj[j];
      if (!side && s > S_BEV + 0.003) continue;
      if (side && s < S_TOP - 0.004) continue;
      const r = prof(s)[0];
      const span = r < 0.04 ? NU / 2 : Math.ceil((0.05 / (2 * Math.PI * r)) * NU);
      for (let di = -span; di <= span; di++) {
        const k = this.idx(Math.round(ic) + di, j);
        const px = this.PX[k] - cx, py = this.PY[k] - cy, pz = this.PZ[k] - cz;
        const along = px * mx + py * my + pz * mz;
        const across = px * ax + py * ay + pz * az;
        if (Math.abs(along) > halfShort || Math.abs(across) > halfLong) continue;
        // also must be near the surface (avoid the other side of the cake)
        const dn = side ? Math.abs(Math.hypot(this.PX[k], this.PZ[k]) - Math.hypot(cx, cz)) : Math.abs(py);
        if (dn > 0.03) continue;
        const w = sstep(halfShort, halfShort * 0.4, Math.abs(along)) * sstep(halfLong, halfLong * 0.8, Math.abs(across));
        if (w <= 0) continue;
        const A = this.A[k];
        let h = this.H[k];
        const sm = this.SM[k];
        const lev = 0.35 + 0.4 * sm; // later passes level more precisely
        if (h > T) {
          const room = clamp((0.035 - this.load) / 0.035, 0, 1);
          const take = (h - T) * lev * w * (0.25 + 0.75 * room);
          h -= take; this.load += take * A; work += take;
        } else if (this.load > 0) {
          const want = (T - h) * 0.55 * w;
          const give = Math.min(want, this.load / A);
          h += give; this.load -= give * A; work += give;
        }
        // knife marks: fine ridges running with the stroke (seeded per stroke)
        if (h > 0.6) {
          const ridge = this.stN[((across * 1400 + seed * 97) | 0) & 4095] * 0.7 + this.stN[((across * 3100 + seed * 53) | 0) & 4095] * 0.3;
          const amp = (0.32 * (1 - sm) + 0.07) * w;
          h = h + ridge * amp * 0.35;
          // a little lip of cream at the blade's ends
          const edge = sstep(halfLong * 0.75, halfLong * 0.95, Math.abs(across));
          h += edge * 0.5 * w * Math.min(1, this.load * 30);
        }
        this.H[k] = clamp(h, 0, 40);
        this.SM[k] = Math.min(1, sm + 0.09 * w);
      }
    }
    // knife leaving the top over the rim: drop the load onto the upper side
    if (!side && sc > S_TOP - 0.004 && this.load > 0) {
      const drop = this.load * 0.25; this.load -= drop;
      this.addSideBlob(ic, drop);
    }
    return work;
  }
  addSideBlob(ic, vol) {
    const jTop = Math.floor(S_BEV / S_ALL * NV);
    const jr = Math.ceil(0.03 / S_ALL * NV), ir = Math.ceil(0.03 / (2 * Math.PI * R) * NU);
    let wsum = 0;
    const ws = [];
    for (let j = jTop - 2; j < jTop + jr; j++) for (let di = -ir; di <= ir; di++) {
      const w = Math.exp(-(((j - jTop) / (jr * 0.6)) ** 2) - ((di / ir) ** 2) * 2);
      ws.push([this.idx(Math.round(ic) + di, Math.max(0, j)), w]); wsum += w;
    }
    for (const [k, w] of ws) this.H[k] = Math.min(Math.max(this.H[k], 7), this.H[k] + vol * w / wsum / this.A[k]);
  }
  // load knife from the bowl
  scoop(v = 0.03) { this.load = Math.min(0.035, this.load + v); }

  // ---------------------------------------------------------------- chocolate
  // vol in m^3 of chocolate landing around (x,y,z)
  pour(x, y, z, vol) {
    const [ic, jc] = this.uvOf(x, y, z);
    const rad = 0.006;
    const jr = Math.ceil(rad * 2.2 / S_ALL * NV);
    const ks = [], ws = []; let wsum = 0;
    for (let j = Math.max(0, Math.floor(jc) - jr); j <= Math.min(NV - 1, Math.ceil(jc) + jr); j++) {
      const r = prof(this.Sj[j])[0];
      const span = r < 0.02 ? NU / 2 : Math.ceil(rad * 2.2 / (2 * Math.PI * r) * NU);
      for (let di = -span; di <= span; di++) {
        const k = this.idx(Math.round(ic) + di, j);
        const d2 = (this.PX[k] - x) ** 2 + (this.PY[k] - y) ** 2 + (this.PZ[k] - z) ** 2;
        const w = Math.exp(-d2 / (rad * rad)) * this.A[k];
        if (w < 1e-12) continue;
        ks.push(k); ws.push(w); wsum += w;
      }
    }
    for (let q = 0; q < ks.length; q++) { const k = ks[q]; this.K[k] = Math.min(8, this.K[k] + vol * ws[q] / wsum / this.A[k] * 1000); }
    this.chocActive = 4; this.dirty = true;
  }
  simChoc(dt) {
    if (this.chocActive <= 0) return;
    this.chocActive -= dt;
    const K = this.K, A = this.A, NUm = NU;
    const out = this._out || (this._out = new Float32Array(NU * NV));
    out.fill(0);
    const jTop = Math.floor(S_TOP / S_ALL * NV), jSide = Math.floor(S_BEV / S_ALL * NV);
    let moved = 0;
    for (let j = 0; j < NV; j++) {
      const isTop = j < jTop, isSide = j >= jSide;
      const r = prof(this.Sj[j])[0];
      for (let i = 0; i < NUm; i++) {
        const k = j * NUm + i;
        const kk = K[k]; if (kk <= 0.08) continue;
        const yl = isTop ? 0.45 : (this.colY[i] + this.yieldK[k]) * (this.H[k] > 1.2 ? 1 : 1.6);
        const ex = kk - yl; if (ex <= 0) continue;
        const vol = ex * A[k];
        if (isTop) {
          // viscous spreading (mostly outward towards the rim + isotropic)
          const f = 0.3 * vol;
          const kn = this.idx(i, j + 1), ks = j > 0 ? this.idx(i, j - 1) : k;
          const ke = this.idx(i + 1, j), kw = this.idx(i - 1, j);
          const wTh = Math.min(1, (S_ALL / NV) / (2 * Math.PI * Math.max(r, 0.003) / NU)) * 0.5;
          const tot = 1.7 + 0.5 + wTh * 2;
          out[k] -= f;
          out[kn] += f * 1.7 / tot; out[ks] += f * 0.5 / tot; out[ke] += f * wTh / tot; out[kw] += f * wTh / tot;
          moved += f;
        } else {
          // gravity: flows down the side; small lateral spread
          const f = (isSide ? 0.5 : 0.35) * vol;
          if (j + 1 < NV && !(j > NV - 4 && kk > 2.5)) {
            out[k] -= f;
            out[this.idx(i, j + 1)] += f * 0.92;
            out[this.idx(i + 1, j)] += f * 0.04; out[this.idx(i - 1, j)] += f * 0.04;
            moved += f;
          }
        }
      }
    }
    for (let k = 0; k < NU * NV; k++) if (out[k] !== 0) K[k] = Math.max(0, Math.min(8, K[k] + out[k] / A[k]));
    if (moved > 1e-9) { this.dirty = true; if (this.chocActive < 0.5) this.chocActive = 0.5; }
  }

  // ---------------------------------------------------------------- sugar
  sugar(x, z, rad, amt) {
    // grains land on the top/rim inside the sieve's footprint; sides get very little
    const n = 40;
    for (let q = 0; q < n; q++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * rad;
      const px = x + Math.cos(a) * rr, pz = z + Math.sin(a) * rr;
      const r = Math.hypot(px, pz);
      if (r > R + 0.003) continue;
      let th = Math.atan2(pz, px); if (th < 0) th += Math.PI * 2;
      const s = r < S_TOP ? r : S_TOP + (r - S_TOP) / BEV * (S_BEV - S_TOP);
      const i = Math.floor(th / (Math.PI * 2) * NU), j = Math.floor(s / S_ALL * NV);
      const k = this.idx(i, j);
      this.SG[k] = Math.min(1, this.SG[k] + amt * (0.5 + rnd()));
      if (rnd() < 0.3) { const k2 = this.idx(i + (rnd() < .5 ? 1 : -1), j); this.SG[k2] = Math.min(1, this.SG[k2] + amt * 0.4); }
      // a little dusting rolls onto the side near the rim
      if (r > R - 0.004 && rnd() < 0.5) { const j2 = Math.min(NV - 1, j + 1 + Math.floor(rnd() * 6)); const k3 = this.idx(i, j2); this.SG[k3] = Math.min(1, this.SG[k3] + amt * 0.3); }
    }
    this.dirty = true;
  }

  // ---------------------------------------------------------------- decorations
  surfaceHeightAt(x, y, z) {
    const [ic, jc] = this.uvOf(x, y, z);
    const k = this.idx(Math.round(ic), clamp(Math.round(jc), 0, NV - 1));
    return (this.H[k] + this.K[k]) * 0.001;
  }
  addBerry(x, z) {
    const r = Math.hypot(x, z);
    if (r > R - 0.012) { const f = (R - 0.012) / r; x *= f; z *= f; }
    if (this.berries.length >= 30) return null;
    const b = makeStrawberry();
    const h = this.surfaceHeightAt(x, HS, z);
    b.position.set(x, HS + h - 0.001, z);
    b.rotation.set((rnd() - .5) * 0.25, rnd() * Math.PI * 2, (rnd() - .5) * 0.25);
    const sc = 0.85 + rnd() * 0.3; b.scale.setScalar(sc);
    b.userData.sc = sc; b.userData.t = 0;
    this.deco.add(b); this.berries.push(b);
    return b;
  }
  addRosette(x, z) {
    if (this.rosettes.length >= 40) return null;
    const r = Math.hypot(x, z);
    if (r > R - 0.008) { const f = (R - 0.008) / r; x *= f; z *= f; }
    const { rosetteMat } = berryMaterials();
    const m = new THREE.Mesh(rosetteGeometry(), rosetteMat);
    m.castShadow = true; m.receiveShadow = true;
    const h = this.surfaceHeightAt(x, HS, z);
    m.position.set(x, HS + h - 0.0015, z);
    m.rotation.y = rnd() * Math.PI * 2;
    const sc = 1.25 + rnd() * 0.4; m.scale.set(sc, sc * (0.85 + rnd() * 0.4), sc);
    m.userData.sc = m.scale.clone(); m.userData.t = 0;
    this.deco.add(m); this.rosettes.push(m);
    return m;
  }

  // ---------------------------------------------------------------- stats / upload
  computeStats() {
    let cov = 0, area = 0, sm = 0, smA = 0, ch = 0, sg = 0;
    for (let k = 0; k < NU * NV; k++) {
      const a = this.A[k]; area += a;
      if (this.H[k] > 1.6) { cov += a; sm += this.SM[k] * a; smA += a; }
      if (this.K[k] > 0.15) ch += a;
      if (this.SG[k] > 0.15) sg += a;
    }
    this.stats.cov = cov / area; this.stats.smooth = smA ? sm / smA : 0; this.stats.choc = ch / area; this.stats.sugar = sg / area;
    return this.stats;
  }
  // texel index of the least-covered region (for the pointing hand)
  worstSpot() {
    let best = 1e9, bk = 0;
    for (let q = 0; q < 300; q++) {
      const k = Math.floor(rnd() * NU * NV);
      const v = this.H[k] / T_MM + this.SM[k] * 0.3;
      if (v < best) { best = v; bk = k; }
    }
    return new THREE.Vector3(this.PX[bk], this.PY[bk], this.PZ[bk]);
  }
  update(dt) {
    this.simChoc(dt); this.simChoc(dt);
    for (const b of this.berries) {
      b.userData.t += dt;
      const t = b.userData.t, sc = b.userData.sc;
      const sq = t < 0.4 ? 1 + Math.sin(t / 0.4 * Math.PI) * 0.15 : 1;
      b.scale.set(sc * sq, sc / sq, sc * sq);
    }
    if (!this.dirty) return;
    this.dirty = false;
    const d = this.data;
    for (let k = 0, o = 0; k < NU * NV; k++, o += 4) {
      d[o] = toHalf(this.H[k]); d[o + 1] = toHalf(this.SM[k]); d[o + 2] = toHalf(this.K[k]); d[o + 3] = toHalf(this.SG[k]);
    }
    this.tex.needsUpdate = true;
  }
  features() {
    const st = this.computeStats();
    return { choc: st.choc > 0.04, sugar: st.sugar > 0.06, berry: this.berries.length >= 2, rose: this.rosettes.length >= 3 };
  }
}
