// The pumpkin: ribbed shell with real wall thickness (outer skin + inner flesh shell),
// analytic punched holes (shader SDF, shared by the candle's shadow), lid cut, crack halves,
// scrape-painted interior, pulp mass with seeds, stem.
import * as THREE from 'three';
import { GLSL_SHAPES } from './shapes.js';
import { texSet } from './tex.js';

export const MAXS = 36;

function rngf(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

export class PumpkinShape {
  constructor(seed, R = 0.15, opt = {}) {
    const r = rngf(seed);
    this.R = R;
    this.ribs = opt.ribs || (9 + Math.floor(r() * 3));
    this.H = R * (opt.hr || (0.74 + r() * 0.1));
    this.ph = [r() * 6.28, r() * 6.28, r() * 6.28];
    this.amp = [0.04 + r() * 0.03, 0.02 + r() * 0.02];
    this.depth = opt.depth || (0.08 + r() * 0.03);
    this.tilt = (r() - 0.5) * 0.04;
    this.lean = r() * 6.28;
  }
  // u in [0,1) around, v in [0,1] top->bottom
  P(u, v, out) {
    const th = u * Math.PI * 2, ph = Math.max(0.0015, Math.min(Math.PI - 0.0015, v * Math.PI));
    const s = Math.abs(Math.sin(this.ribs * th / 2));
    const lobe = Math.pow(s, 0.5);
    const amp = 1 + this.amp[0] * Math.sin(th * 2 + this.ph[0]) + this.amp[1] * Math.sin(th * 5 + this.ph[1]);
    const sp = Math.sin(ph), cp = Math.cos(ph);
    const groove = this.depth * (1 - lobe) * (0.55 + 0.45 * sp);
    const rad = this.R * amp * (1 - groove) * Math.pow(sp, 0.92);
    let y = this.H * Math.sign(cp) * Math.pow(Math.abs(cp), 0.8);
    y -= this.H * 0.22 * Math.exp(-(((ph) / 0.42) ** 2)) * (1 - 0.3 * (1 - lobe));
    y += this.H * 0.16 * Math.exp(-(((Math.PI - ph) / 0.5) ** 2));
    const x = rad * Math.cos(th), z = rad * Math.sin(th);
    out.set(x + y * this.tilt * Math.cos(this.lean), y, z + y * this.tilt * Math.sin(this.lean));
    return out;
  }
  bottomY() { const v = new THREE.Vector3(); let m = 1; for (let i = 0; i < 64; i++) for (let j = 40; j <= 64; j++) { this.P(i / 64, j / 64, v); m = Math.min(m, v.y); } return m; }
  topY() { const v = new THREE.Vector3(); this.P(0, 0, v); return v.y; }
}

export function shellGeometry(shape, v0, v1, nu, nv, scale = 1) {
  const pos = [], nor = [], uv = [], idx = [];
  const p = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), d = new THREE.Vector3();
  const e = 1e-3;
  for (let j = 0; j <= nv; j++) {
    const v = v0 + (v1 - v0) * j / nv;
    for (let i = 0; i <= nu; i++) {
      const u = i / nu;
      shape.P(u, v, p);
      shape.P(u + e, v, a); shape.P(u - e, v, b); a.sub(b);
      shape.P(u, Math.min(1, v + e), c); shape.P(u, Math.max(0, v - e), d); c.sub(d);
      const n = new THREE.Vector3().crossVectors(a, c).normalize();
      if (v < 0.004) n.set(0, 1, 0); else if (v > 0.996) n.set(0, -1, 0);
      pos.push(p.x * scale, p.y * scale, p.z * scale); nor.push(n.x, n.y, n.z); uv.push(u, v);
    }
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const A = j * (nu + 1) + i, B = A + 1, C = A + nu + 1, D = C + 1;
    idx.push(A, B, C, B, D, C);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('puv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

// ---------------------------------------------------------------- shader pieces
const CUT_PARS = /* glsl */`
#define MAXS ${MAXS}
uniform vec3 uSP[MAXS]; uniform vec3 uSN[MAXS]; uniform vec3 uSU[MAXS]; uniform vec4 uSD[MAXS];
uniform int uNS;
uniform float uScale;      // 1 outer, s inner
uniform vec4 uLid;         // x: base v, y: zig amp, z: zig count, w: part (0 none, 1 body, -1 lid)
uniform vec4 uCrack;       // xyz plane normal, w: side (+1/-1, 0 none)
uniform float uGap;        // crack gap width (m)
varying vec3 vObj; varying vec2 vPuv;
${GLSL_SHAPES}
float pk_zig(float x){ return abs(fract(x) - 0.5) * 2.0; }
float pk_crackD(vec3 p){
  float j = sin(p.y * 160.0 + p.x * 40.0) * 0.0035 + sin(p.y * 61.0 + 1.3) * 0.006 + sin(p.y * 330.0 + p.z * 90.0) * 0.0012;
  return dot(p, uCrack.xyz) + j;
}
// returns min SDF over punched stamps (+ depth of nearest, grad in object space)
float pk_field(vec3 p, out float dep, out vec3 g){
  float best = 1.0; dep = 0.0; g = vec3(0.0);
  for (int i = 0; i < MAXS; i++) {
    if (i >= uNS) break;
    vec3 d = p - uSP[i];
    vec4 sd = uSD[i];
    float rr = sd.y * 2.2 + 0.01;
    if (dot(d, d) > rr * rr) continue;
    vec3 N = uSN[i]; vec3 U = uSU[i]; vec3 X = cross(U, N);
    vec2 q = vec2(dot(d, X), dot(d, U));
    float cs = cos(sd.w), sn = sin(sd.w); q = mat2(cs, -sn, sn, cs) * q;
    float s = pk_shape(q, sd.x, sd.y);
    if (s < best) {
      best = s; dep = sd.z;
      float e = 0.0006;
      vec2 gq = vec2(pk_shape(q + vec2(e, 0.0), sd.x, sd.y) - s, pk_shape(q + vec2(0.0, e), sd.x, sd.y) - s) / e;
      gq = mat2(cs, sn, -sn, cs) * gq;
      g = gq.x * X + gq.y * U;
    }
  }
  return best;
}
// common discard logic; returns edge info: x = distance to nearest through-cut edge (m), y = groove amount, z = partial depth, w = crack dist
vec4 pk_cut(out vec3 gradO){
  vec3 p = vObj / uScale;
  vec4 info = vec4(1.0, 0.0, 0.0, 1.0);
  gradO = vec3(0.0);
  if (uLid.w != 0.0) {
    float vc = uLid.x + uLid.y * pk_zig(vPuv.x * uLid.z);
    float dv = (vPuv.y - vc) * uLid.w;
    if (dv < 0.0) discard;
    info.x = min(info.x, dv * 0.45);
  }
  if (uCrack.w != 0.0) {
    float cd = pk_crackD(p) * uCrack.w;
    if (cd < uGap * 0.5) discard;
    info.w = cd;
    info.x = min(info.x, cd - uGap * 0.5);
  }
  float dep; vec3 g;
  float s = pk_field(p, dep, g);
  if (dep >= 1.0) {
    if (s < 0.0) discard;
    if (s < info.x) { info.x = s; gradO = g; }
  } else if (dep > 0.0) {
    float w = 0.0007 + 0.0009 * dep;
    info.y = (1.0 - smoothstep(w * 0.4, w, abs(s))) * dep;
    info.z = s < 0.0 ? dep : 0.0;
    gradO = g;
  }
  return info;
}
`;

const VERT_PARS = `attribute vec2 puv; varying vec3 vObj; varying vec2 vPuv;`;
const VERT_MAIN = `vObj = position; vPuv = puv;`;

function cutUniforms() {
  const arr = (n) => Array.from({ length: n }, () => new THREE.Vector3());
  return {
    uSP: { value: arr(MAXS) }, uSN: { value: arr(MAXS) }, uSU: { value: arr(MAXS) },
    uSD: { value: Array.from({ length: MAXS }, () => new THREE.Vector4()) },
    uNS: { value: 0 }, uLid: { value: new THREE.Vector4(0.2, 0.012, 7, 0) },
    uCrack: { value: new THREE.Vector4(1, 0, 0, 0) }, uGap: { value: 0 },
  };
}

function injectCommon(shader, U, scale) {
  Object.assign(shader.uniforms, U);  // U includes the per-part uLid / uCrack objects
  shader.uniforms.uScale = { value: scale };
  shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\n' + VERT_PARS)
    .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + VERT_MAIN);
  shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\n' + CUT_PARS);
}

// ---------------------------------------------------------------- Pumpkin
export class Pumpkin {
  constructor(opt = {}) {
    this.seed = opt.seed || 1;
    this.shape = new PumpkinShape(this.seed, opt.R || 0.15, opt);
    this.inner = opt.inner || 0.86;
    this.U = cutUniforms();
    this.stamps = [];
    this.group = new THREE.Group();
    this.body = new THREE.Group(); this.group.add(this.body);
    this.halves = [new THREE.Group(), new THREE.Group()];
    this.body.add(this.halves[0], this.halves[1]);
    const bottom = this.shape.bottomY();
    this.body.position.y = -bottom;
    this.lidV = opt.lidV || 0.2;
    this.U.uLid.value.set(this.lidV, 0.016, Math.round(this.shape.ribs * 1.0), 0);
    this.common = {
      uGlow: { value: 0 }, uGlowCol: { value: new THREE.Color(1.0, 0.55, 0.16) }, uHint: { value: 0 },
      uScrape: { value: null }, uBaseA: { value: new THREE.Color(opt.colA || 0xe8741c) }, uBaseB: { value: new THREE.Color(opt.colB || 0xb5470c) },
      uStemCol: { value: new THREE.Color(opt.stemCol || 0x6e7a2a) }, uRibs: { value: this.shape.ribs }, uTime: { value: 0 },
    };
    this.makeScrape();
    this.buildMaterials(opt);
    this.buildMeshes(opt);
    this.buildStem(opt);
    this.light = null;
  }

  makeScrape() {
    const c = document.createElement('canvas'); c.width = 256; c.height = 128;
    const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 256, 128);
    // the lid band is already clean
    const grd = g.createLinearGradient(0, 0, 0, 128 * (this.lidV + 0.08));
    grd.addColorStop(0, '#fff'); grd.addColorStop(0.75, '#fff'); grd.addColorStop(1, '#000');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 128 * (this.lidV + 0.08));
    this.scrapeCanvas = c; this.scrapeCtx = g;
    this.scrapeTex = new THREE.CanvasTexture(c); this.scrapeTex.wrapS = THREE.RepeatWrapping;
    this.common.uScrape.value = this.scrapeTex;
    this.scrapeGrid = new Float32Array(32 * 16);
    for (let j = 0; j < 16; j++) for (let i = 0; i < 32; i++) this.scrapeGrid[j * 32 + i] = j / 16 < this.lidV + 0.05 ? 1 : 0;
  }
  // paint clean flesh at (u,v) with radius (in uv units) and strength
  scrape(u, v, rad, str) {
    const g = this.scrapeCtx, W = 256, H = 128;
    for (const du of [-1, 0, 1]) {
      const x = (u + du) * W, y = v * H, r = rad * W;
      if (x + r < 0 || x - r > W) continue;
      const grd = g.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, `rgba(255,255,255,${str})`); grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd; g.beginPath(); g.ellipse(x, y, r, r * 1.6, 0, 0, Math.PI * 2); g.fill();
    }
    this.scrapeTex.needsUpdate = true;
    for (let j = 0; j < 16; j++) for (let i = 0; i < 32; i++) {
      let du = Math.abs((i + 0.5) / 32 - u); du = Math.min(du, 1 - du);
      const dv = ((j + 0.5) / 16 - v) / 1.6;
      const d = Math.hypot(du, dv);
      if (d < rad) this.scrapeGrid[j * 32 + i] = Math.min(1, this.scrapeGrid[j * 32 + i] + str * (1 - d / rad) * 1.4);
    }
  }
  cleanFraction() {
    let s = 0, n = 0;
    for (let j = 0; j < 16; j++) { const v = (j + 0.5) / 16; if (v < this.lidV || v > 0.92) continue; for (let i = 0; i < 32; i++) { s += this.scrapeGrid[j * 32 + i]; n++; } }
    return s / n;
  }

  partUniforms(part) {
    const U = Object.assign({}, this.U);
    U.uLid = { value: this.U.uLid.value.clone() }; U.uLid.value.w = part.lid;
    U.uCrack = { value: new THREE.Vector4(1, 0, 0, 0) };
    U.uGap = this.U.uGap;
    part.U = U;
    return U;
  }
  buildMaterials(opt) { this.matOpt = opt; }
  makeMats(part) {
    const U = this.partUniforms(part), C = this.common;
    const pt = texSet('pumpkin'), fl = texSet('flesh'), pu = texSet('pulp');
    // ---- outer skin
    const skin = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 1, roughnessMap: pt.ormMap, normalMap: pt.normalMap, normalScale: new THREE.Vector2(0.7, 0.7),
      aoMap: null, clearcoat: 0.2, clearcoatRoughness: 0.4, sheen: 0.25, sheenRoughness: 0.6, sheenColor: new THREE.Color(0xffc080),
      side: THREE.DoubleSide,
    });
    skin.onBeforeCompile = (sh) => {
      injectCommon(sh, U, 1);
      Object.assign(sh.uniforms, C, { uDetail: { value: pt.map }, uFleshMap: { value: fl.map } });
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          uniform sampler2D uDetail; uniform sampler2D uFleshMap; uniform sampler2D uScrape; uniform vec3 uBaseA, uBaseB, uStemCol, uGlowCol; uniform float uGlow, uRibs, uHint, uTime;
          uniform mat3 normalMatrix;`)
        .replace('void main() {', 'void main() {\n vec3 pkG; vec4 pkI = pk_cut(pkG);')
        .replace('#include <map_fragment>', `
          float th = vPuv.x * 6.2831853;
          float lobe = pow(abs(sin(uRibs * th * 0.5)), 0.5);
          vec2 duv = vec2(vPuv.x * 3.0, vPuv.y * 1.2);
          vec3 det = mix(vec3(1.0), texture2D(uDetail, duv).rgb * 2.0, 0.55);
          vec3 base = mix(uBaseB, uBaseA, smoothstep(0.1, 0.9, lobe) * 0.8 + 0.2);
          base = mix(uStemCol, base, smoothstep(0.03, 0.22, vPuv.y) * 0.85 + 0.15 * smoothstep(0.0, 0.08, vPuv.y));
          base = mix(base, uBaseB * 0.8, smoothstep(0.85, 1.0, vPuv.y) * 0.6);
          vec3 albedo = base * det;
          vec3 fleshC = texture2D(uFleshMap, vPuv * vec2(4.0, 2.0)).rgb * vec3(1.0, 0.92, 0.75);
          float bev = 1.0 - smoothstep(0.0, 0.0028, pkI.x);
          bool backF = !gl_FrontFacing;
          float cutC = max(bev, pkI.y * 0.9);
          albedo = mix(albedo, fleshC, backF ? 1.0 : cutC);
          albedo = mix(albedo, albedo * 0.55, pkI.z * 0.35);
          diffuseColor.rgb *= albedo;
        `)
        .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
          roughnessFactor = mix(roughnessFactor, 0.75, max(bev, pkI.y));`)
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
          if (dot(pkG, pkG) > 0.0) {
            vec3 gv = normalize(normalMatrix * pkG);
            float bt = bev * 0.9 + pkI.y * 0.8;
            normal = normalize(normal + gv * bt * 1.6 * (pkI.x < 0.5 ? 1.0 : -1.0));
          }`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          float edgeGlow = exp(-max(pkI.x, 0.0) / 0.004) ;
          float thin = texture2D(uScrape, vPuv).r;
          float trans = (backF ? 1.0 : (edgeGlow * 1.1 + thin * 0.012 * (0.5 + 0.5 * lobe) + pkI.y * 0.4));
          totalEmissiveRadiance += uGlowCol * uGlow * trans * (backF ? 1.2 : 1.0);
          totalEmissiveRadiance += vec3(1.0, 0.85, 0.5) * uHint * 0.035 * (1.0 - min(uGlow, 1.0) * 0.8);`);
    };
    skin.customProgramCacheKey = () => 'pkskin';
    // ---- inner flesh shell
    const inner = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 1, roughnessMap: pu.ormMap, normalMap: fl.normalMap, normalScale: new THREE.Vector2(0.8, 0.8),
      clearcoat: 0.5, clearcoatRoughness: 0.35, side: THREE.DoubleSide,
    });
    inner.onBeforeCompile = (sh) => {
      injectCommon(sh, U, this.inner);
      Object.assign(sh.uniforms, C, { uPulp: { value: pu.map }, uFleshMap: { value: fl.map } });
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          uniform sampler2D uPulp; uniform sampler2D uFleshMap; uniform sampler2D uScrape; uniform vec3 uGlowCol; uniform float uGlow;`)
        .replace('void main() {', 'void main() {\n vec3 pkG; vec4 pkI = pk_cut(pkG);')
        .replace('#include <map_fragment>', `
          float sc = smoothstep(0.15, 0.85, texture2D(uScrape, vPuv).r);
          vec3 pulpC = texture2D(uPulp, vPuv * vec2(5.0, 2.5)).rgb;
          vec3 fleshC = texture2D(uFleshMap, vPuv * vec2(4.0, 2.0)).rgb;
          bool outerF = gl_FrontFacing;  // front faces of the inner shell look into the wall cut
          vec3 albedo = outerF ? fleshC * vec3(1.0, 0.95, 0.8) : mix(pulpC, fleshC * vec3(1.0, 0.9, 0.7), sc);
          diffuseColor.rgb *= albedo;`)
        .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
          roughnessFactor = outerF ? 0.7 : mix(0.28, 0.5, sc);`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          totalEmissiveRadiance += uGlowCol * uGlow * (outerF ? 1.2 : 0.14) * albedo;`);
    };
    inner.customProgramCacheKey = () => 'pkinner';
    // ---- shadow materials (candle cube shadow + lamp shadow)
    const dist = new THREE.MeshDistanceMaterial({ side: THREE.DoubleSide });
    dist.onBeforeCompile = (sh) => {
      injectCommon(sh, U, 1);
      sh.fragmentShader = sh.fragmentShader.replace(/void main\s*\(\)\s*\{/, 'void main() {\n vec3 pkG; vec4 pkI = pk_cut(pkG);');
    };
    dist.customProgramCacheKey = () => 'pkdist';
    this.pkDistKey = true;
    const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide });
    depth.onBeforeCompile = (sh) => {
      injectCommon(sh, U, 1);
      sh.fragmentShader = sh.fragmentShader.replace(/void main\s*\(\)\s*\{/, 'void main() {\n vec3 pkG; vec4 pkI = pk_cut(pkG);');
    };
    depth.customProgramCacheKey = () => 'pkdepth';
    return { skin, inner, dist, depth };
  }

  buildMeshes() {
    const S = this.shape;
    const gOut = shellGeometry(S, this.lidV - 0.03, 1, 144, 72, 1);
    const gIn = shellGeometry(S, this.lidV - 0.03, 0.97, 112, 56, this.inner);
    const gLidO = shellGeometry(S, 0, this.lidV + 0.03, 144, 14, 1);
    const gLidI = shellGeometry(S, 0, this.lidV + 0.03, 112, 12, this.inner);
    const mk = (geo, which, cast, part) => {
      const M = this.makeMats(part);
      const m = new THREE.Mesh(geo, M[which]);
      m.castShadow = cast; m.receiveShadow = true;
      if (cast) { m.customDistanceMaterial = M.dist; m.customDepthMaterial = M.depth; m.layers.enable(2); }
      m.userData.part = part;
      return m;
    };
    this.meshes = [];
    for (let h = 0; h < 2; h++) {
      const half = h === 0 ? 1 : -1;
      const o = mk(gOut, 'skin', true, { lid: 1, half });
      const i = mk(gIn, 'inner', false, { lid: 1, half });
      this.halves[h].add(o, i);
      this.meshes.push(o, i);
    }
    this.lid = new THREE.Group();
    this.lidPivot = new THREE.Group();
    const top = new THREE.Vector3(); S.P(0, this.lidV, top);
    this.lidCenter = new THREE.Vector3(0, top.y, 0);
    this.lid.position.copy(this.lidCenter);
    this.lidPivot.add(this.lid);
    this.body.add(this.lidPivot);
    const lo = mk(gLidO, 'skin', true, { lid: -1, half: 0 });
    const li = mk(gLidI, 'inner', false, { lid: -1, half: 0 });
    lo.position.copy(this.lidCenter).negate(); li.position.copy(this.lidCenter).negate();
    this.lid.add(lo, li);
    this.lidMeshes = [lo, li];
    this.meshes.push(lo, li);
    this.setCrack(false);
  }

  setCrack(on, normal) {
    this.cracked = on;
    for (const m of this.meshes) {
      const part = m.userData.part;
      if (part.lid === -1) continue;
      if (normal) part.U.uCrack.value.set(normal.x, normal.y, normal.z, 0);
      part.U.uCrack.value.w = on ? part.half : 0;
      m.visible = on || part.half === 1;
    }
  }
  setLidMode(closedSolid) {
    // when the lid is not cut yet the body and lid are drawn as one closed shell
    for (const m of this.meshes) m.userData.part.U.uLid.value.w = closedSolid ? 0 : m.userData.part.lid;
    for (const m of this.lidMeshes) m.visible = !closedSolid;
  }

  buildStem() {
    const S = this.shape;
    const r = rngf(this.seed + 7);
    const pts = [];
    const top = new THREE.Vector3(); S.P(0, 0, top);
    const h = 0.045 + r() * 0.02;
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      pts.push(new THREE.Vector3(Math.sin(t * 2.2) * 0.012 * (r() * 0.5 + 0.7), top.y - 0.012 + t * h, Math.sin(t * 1.7) * 0.008));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 16, 1, 10, false);
    // taper + fibrous ridges
    const p = geo.attributes.position, uvA = geo.attributes.uv;
    const ctr = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      const u = uvA.getX(i), v = uvA.getY(i);
      curve.getPointAt(u, ctr);
      const rad = (0.011 + 0.008 * Math.pow(1 - u, 3) + 0.006 * Math.exp(-u * 18)) * (1 + 0.12 * Math.cos(v * Math.PI * 2 * 6));
      const dx = p.getX(i) - ctr.x, dy = p.getY(i) - ctr.y, dz = p.getZ(i) - ctr.z;
      const l = Math.hypot(dx, dy, dz) || 1;
      p.setXYZ(i, ctr.x + dx / l * rad, ctr.y + dy / l * rad, ctr.z + dz / l * rad);
    }
    geo.computeVertexNormals();
    const ks = texSet('kraft');
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x8a8a55), map: ks.map, roughnessMap: ks.ormMap, roughness: 1, normalMap: ks.normalMap, normalScale: new THREE.Vector2(2, 2) });
    mat.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
        diffuseColor.rgb = mix(vec3(0.28,0.30,0.12), vec3(0.55,0.50,0.32), smoothstep(0.2, 1.0, vMapUv.x)) * (0.75 + 0.5 * texture2D(map, vMapUv * vec2(0.5, 3.0)).r);`);
    };
    const stem = new THREE.Mesh(geo, mat);
    stem.castShadow = true; stem.receiveShadow = true; stem.layers.enable(2);
    stem.position.copy(this.lidCenter).negate();
    this.lid.add(stem);
    this.stem = stem;
  }

  // surface frame at (u,v): point, outward normal, 'up' tangent
  frameAt(u, v) {
    const p = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3();
    this.shape.P(u, v, p);
    this.shape.P(u + 0.002, v, a); this.shape.P(u - 0.002, v, b); const tu = a.clone().sub(b);
    this.shape.P(u, v + 0.002, a); this.shape.P(u, v - 0.002, b); const tv = a.clone().sub(b);
    const n = new THREE.Vector3().crossVectors(tu, tv).normalize();
    if (n.dot(p) < 0) n.negate();
    const up = new THREE.Vector3(0, 1, 0); up.addScaledVector(n, -up.dot(n));
    if (up.lengthSq() < 1e-6) up.set(0, 0, 1); up.normalize();
    return { p, n, up };
  }
  // world/object helpers
  surfacePoint(u, v, out) { return this.shape.P(u, v, out); }
  objectToUV(pObj) {
    const u = ((Math.atan2(pObj.z, pObj.x) / (Math.PI * 2)) + 1) % 1;
    // invert v by search
    const tmp = new THREE.Vector3(); let best = 0, bd = 1e9;
    for (let i = 0; i <= 64; i++) { const v = i / 64; this.shape.P(u, v, tmp); const d = Math.abs(tmp.y - pObj.y); if (d < bd) { bd = d; best = v; } }
    return [u, best];
  }

  // add / deepen a stamp. p, n, up are in shell object space (body local, unscaled)
  addStamp(p, n, up, type, size, rot = 0) {
    if (this.stamps.length >= MAXS) this.stamps.shift();
    const s = { p: p.clone(), n: n.clone().normalize(), up: up.clone(), type, size, rot, depth: 0 };
    this.stamps.push(s); this.syncStamps();
    return s;
  }
  syncStamps() {
    const U = this.U; U.uNS.value = this.stamps.length;
    this.stamps.forEach((s, i) => {
      U.uSP.value[i].copy(s.p); U.uSN.value[i].copy(s.n); U.uSU.value[i].copy(s.up);
      U.uSD.value[i].set(s.type, s.size, s.depth, s.rot);
    });
  }
  throughCount() { return this.stamps.filter((s) => s.depth >= 1).length; }

  update(t) { this.common.uTime.value = t; }
}

// ---------------------------------------------------------------- pulp mass inside (scene 1)
export class PulpMass {
  constructor(pumpkin) {
    this.pk = pumpkin;
    const geo = new THREE.IcosahedronGeometry(1, 5);
    const p = geo.attributes.position;
    this.n = p.count;
    this.dirs = new Float32Array(p.count * 3);
    this.base = new Float32Array(p.count);
    this.amt = new Float32Array(p.count).fill(1);
    const S = pumpkin.shape, tmp = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      this.dirs.set([x, y, z], i * 3);
      // radius to inner wall in this direction (approx)
      const u = ((Math.atan2(z, x) / (Math.PI * 2)) + 1) % 1;
      const v = Math.acos(Math.max(-1, Math.min(1, y))) / Math.PI;
      S.P(u, Math.max(v, pumpkin.lidV + 0.05), tmp);
      const wall = tmp.length() * pumpkin.inner;
      const lump = 0.82 + 0.1 * Math.sin(x * 13 + y * 7) * Math.cos(z * 11) + 0.06 * Math.sin(x * 31 + z * 23);
      this.base[i] = wall * lump * (y > 0.3 ? 0.75 : 1);
    }
    geo.setAttribute('amt', new THREE.Float32BufferAttribute(this.amt, 1));
    this.geo = geo;
    const pu = texSet('pulp');
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: pu.map, normalMap: pu.normalMap, roughnessMap: pu.ormMap, roughness: 0.9, clearcoat: 0.8, clearcoatRoughness: 0.25, normalScale: new THREE.Vector2(1.5, 1.5) });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.castShadow = false; this.mesh.receiveShadow = true;
    // seeds on the mass
    const sg = seedGeometry();
    this.seedMat = seedMaterial();
    this.nSeeds = 140;
    this.seeds = new THREE.InstancedMesh(sg, this.seedMat, this.nSeeds);
    this.seeds.receiveShadow = true;
    this.seedV = new Int32Array(this.nSeeds); this.seedQ = [];
    for (let k = 0; k < this.nSeeds; k++) {
      this.seedV[k] = Math.floor(Math.random() * p.count);
      this.seedQ.push(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6)));
    }
    this.group = new THREE.Group(); this.group.add(this.mesh, this.seeds);
    this.refresh();
  }
  refresh() {
    const p = this.geo.attributes.position;
    for (let i = 0; i < this.n; i++) {
      const r = this.base[i] * (0.05 + 0.95 * Math.pow(this.amt[i], 0.7));
      p.setXYZ(i, this.dirs[i * 3] * r, this.dirs[i * 3 + 1] * r, this.dirs[i * 3 + 2] * r);
    }
    p.needsUpdate = true; this.geo.computeVertexNormals();
    const M = new THREE.Matrix4(), v = new THREE.Vector3(), s = new THREE.Vector3();
    let total = 0;
    for (let k = 0; k < this.nSeeds; k++) {
      const i = this.seedV[k], a = this.amt[i];
      const r = this.base[i] * (0.05 + 0.95 * Math.pow(a, 0.7)) * 0.985;
      v.set(this.dirs[i * 3] * r, this.dirs[i * 3 + 1] * r, this.dirs[i * 3 + 2] * r);
      const sc = a > 0.45 ? 1 : 0.0001;
      s.set(sc, sc, sc);
      M.compose(v, this.seedQ[k], s);
      this.seeds.setMatrixAt(k, M);
      total += a;
    }
    this.seeds.instanceMatrix.needsUpdate = true;
    this.mesh.visible = this.remaining() > 0.03;
    this.seeds.visible = this.mesh.visible;
  }
  remaining() { let s = 0; for (let i = 0; i < this.n; i++) s += this.amt[i]; return s / this.n; }
  // scoop around direction d (normalised), returns amount removed
  scoop(d, rad, str) {
    let removed = 0;
    for (let i = 0; i < this.n; i++) {
      const dot = this.dirs[i * 3] * d.x + this.dirs[i * 3 + 1] * d.y + this.dirs[i * 3 + 2] * d.z;
      if (dot < rad) continue;
      const w = (dot - rad) / (1 - rad);
      const before = this.amt[i];
      this.amt[i] = Math.max(0, before - str * (0.4 + w));
      removed += before - this.amt[i];
    }
    this.refresh();
    return removed / this.n;
  }
}

export function seedGeometry() {
  const g = new THREE.SphereGeometry(1, 14, 8);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const taper = 1 - 0.45 * Math.max(0, x) ** 1.5;
    p.setXYZ(i, x * 0.0085, y * 0.0018 * taper * (1 + 0.25 * (1 - z * z)), z * 0.0052 * taper);
  }
  g.computeVertexNormals();
  return g;
}
export function seedMaterial() {
  return new THREE.MeshPhysicalMaterial({ color: 0xeadcb0, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.3, sheen: 0.4, sheenColor: new THREE.Color(0xfff2d0) });
}
