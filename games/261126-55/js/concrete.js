// The hero: a slab of fresh concrete simulated on two grids.
//  coarse grid (GX x GZ): thickness h, lumpiness, trowel polish, dryness, bleed water
//  fine grid   (FX x FZ): imprint height offset (prints, rims) + mark (water in prints / leaf stain)
import * as THREE from 'three';
import { clamp01 } from './core.js';

export const SLAB = { W: 1.4, D: 0.7, base: -0.01, top: 0.09 };
const GX = 192, GZ = 96, FX = 1024, FZ = 512;
const IMP_RANGE = 0.026; // meters for ±127 in the imprint texture

export class Slab {
  constructor(detailTex, bedTex) {
    this.h = new Float32Array(GX * GZ);
    this.lump = new Float32Array(GX * GZ);
    this.smooth = new Float32Array(GX * GZ);
    this.dry = new Float32Array(GX * GZ);
    this.wet = new Float32Array(GX * GZ);
    this.noise = new Float32Array(GX * GZ);
    for (let i = 0; i < GX * GZ; i++) this.noise[i] = Math.random();
    this.imp = new Float32Array(FX * FZ);
    this.mark = new Float32Array(FX * FZ);
    this.hTexData = new Uint16Array(GX * GZ);
    this.sTexData = new Uint8Array(GX * GZ * 4);
    this.iTexData = new Uint8Array(FX * FZ * 2);
    this.hTex = new THREE.DataTexture(this.hTexData, GX, GZ, THREE.RedFormat, THREE.HalfFloatType);
    this.sTex = new THREE.DataTexture(this.sTexData, GX, GZ, THREE.RGBAFormat, THREE.UnsignedByteType);
    this.iTex = new THREE.DataTexture(this.iTexData, FX, FZ, THREE.RGFormat, THREE.UnsignedByteType);
    for (const t of [this.hTex, this.sTex, this.iTex]) { t.magFilter = t.minFilter = THREE.LinearFilter; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.needsUpdate = true; }
    this.iTexData.fill(128); for (let i = 1; i < this.iTexData.length; i += 2) this.iTexData[i] = 0;
    this.dirtyH = this.dirtyS = this.dirtyI = true;
    this.mesh = this.buildMesh(detailTex, bedTex);
    this.active = 0; this.presses = [];
    this.stamps = makeStamps();
  }

  // ------------------------------------------------------------ coordinates
  toGrid(x, z) { return [(x / SLAB.W + 0.5) * GX - 0.5, (z / SLAB.D + 0.5) * GZ - 0.5]; }
  toFine(x, z) { return [(x / SLAB.W + 0.5) * FX - 0.5, (z / SLAB.D + 0.5) * FZ - 0.5]; }
  heightAt(x, z) {
    const [gx, gz] = this.toGrid(x, z);
    const i = Math.max(0, Math.min(GX - 1, Math.round(gx))), j = Math.max(0, Math.min(GZ - 1, Math.round(gz)));
    const [fx, fz] = this.toFine(x, z);
    const fi = Math.max(0, Math.min(FX - 1, Math.round(fx))), fj = Math.max(0, Math.min(FZ - 1, Math.round(fz)));
    const h = this.h[j * GX + i];
    return SLAB.base + h + (h > 0.02 ? this.imp[fj * FX + fi] : 0);
  }
  inside(x, z, m = 0) { return Math.abs(x) < SLAB.W / 2 - m && Math.abs(z) < SLAB.D / 2 - m; }

  // ------------------------------------------------------------ pouring & flow
  pour(x, z, vol) {
    const r = 0.07, [gx, gz] = this.toGrid(x, z), cr = r / SLAB.W * GX * 1.6;
    const ws = []; let tot = 0;
    for (let j = Math.floor(gz - cr); j <= gz + cr; j++) for (let i = Math.floor(gx - cr); i <= gx + cr; i++) {
      if (i < 0 || j < 0 || i >= GX || j >= GZ) continue;
      const d2 = ((i - gx) ** 2 + (j - gz) ** 2) / (cr * cr * 0.4);
      const w = Math.exp(-d2) * (0.6 + 0.8 * this.noise[j * GX + i]); if (w < 0.02) continue; ws.push([j * GX + i, w]); tot += w;
    }
    const cellA = (SLAB.W / GX) * (SLAB.D / GZ);
    for (const [k, w] of ws) {
      this.h[k] += vol * w / tot / cellA;
      this.lump[k] = Math.min(1, this.lump[k] + 0.25 * w); this.smooth[k] *= 0.7; this.wet[k] = Math.max(this.wet[k], 0.6);
      // fresh material buries old imprints
      this.clearImpCell(k, 0.25 * w);
    }
    this.active = 2.5; this.dirtyH = this.dirtyS = true;
  }
  clearImpCell(k, a) {
    const i = k % GX, j = (k / GX) | 0; const s = FX / GX;
    for (let y = Math.floor(j * s); y < (j + 1) * s; y++) for (let x = Math.floor(i * s); x < (i + 1) * s; x++) { const f = y * FX + x; this.imp[f] *= 1 - a; this.mark[f] *= 1 - a; }
    this.dirtyI = true;
  }
  flow(dt) {
    if (this.active <= 0) return;
    this.active -= dt;
    const h = this.h, yieldS = 0.0045, k = 0.22;
    for (let it = 0; it < 3; it++) {
      for (let pass = 0; pass < 2; pass++) {
        for (let j = 0; j < GZ - (pass ? 1 : 0); j++) for (let i = 0; i < GX - (pass ? 0 : 1); i++) {
          const a = j * GX + i, b = pass ? a + GX : a + 1;
          const d = h[a] - h[b];
          const ad = Math.abs(d); if (ad <= yieldS) continue;
          let m = (ad - yieldS) * k * 0.5;
          if (d > 0) { m = Math.min(m, h[a]); h[a] -= m; h[b] += m; this.lump[b] = Math.max(this.lump[b], this.lump[a] * 0.9); }
          else { m = Math.min(m, h[b]); h[b] -= m; h[a] += m; this.lump[a] = Math.max(this.lump[a], this.lump[b] * 0.9); }
        }
      }
    }
    this.dirtyH = this.dirtyS = true;
  }

  // ------------------------------------------------------------ trowel
  // x,z center; dx,dz motion this frame; returns amount of effect for sound
  trowel(x, z, dx, dz, mode = 'float') {
    const dl = Math.hypot(dx, dz); if (dl < 1e-5) return 0;
    const r = 0.075, [gx, gz] = this.toGrid(x, z), cr = r / SLAB.W * GX;
    const cells = []; let mean = 0, wsum = 0;
    for (let j = Math.floor(gz - cr); j <= gz + cr; j++) for (let i = Math.floor(gx - cr * 1.4); i <= gx + cr * 1.4; i++) {
      if (i < 0 || j < 0 || i >= GX || j >= GZ) continue;
      const d2 = ((i - gx) / 1.4) ** 2 + (j - gz) ** 2; if (d2 > cr * cr) continue;
      const w = 1 - Math.sqrt(d2) / cr; const k = j * GX + i;
      cells.push([k, w]); mean += this.h[k] * w; wsum += w;
    }
    if (!wsum) return 0;
    mean /= wsum;
    const target = SLAB.top - SLAB.base;
    const pass = Math.min(1, dl / (r * 1.6)); // fraction of a full pass this frame
    let effect = 0, carry = 0;
    for (const [k, w] of cells) {
      const h0 = this.h[k];
      let nh = h0 + (mean - h0) * Math.min(1, 1.6 * pass) * w;
      // screed: material above the form top is carried forward
      if (nh > target + 0.004) { const ex = (nh - target - 0.004) * 0.6 * w; nh -= ex; carry += ex; }
      this.h[k] = nh;
      const l0 = this.lump[k];
      this.lump[k] = Math.max(0, l0 - 1.1 * pass * w);
      const gate = 1 - Math.min(1, this.lump[k] * 2.2);
      const s0 = this.smooth[k];
      this.smooth[k] = Math.min(1, s0 + 0.55 * pass * w * gate * (0.5 + 0.5 * (1 - this.dry[k])));
      this.wet[k] = Math.min(1, Math.max(this.wet[k], this.smooth[k] * 0.9));
      effect += (l0 - this.lump[k]) + (this.smooth[k] - s0) + Math.abs(nh - h0) * 30;
    }
    if (carry > 0) {
      const ax = x + dx / dl * r * 1.4, az = z + dz / dl * r * 1.4;
      const [cx, cz] = this.toGrid(Math.max(-SLAB.W / 2 + 0.02, Math.min(SLAB.W / 2 - 0.02, ax)), Math.max(-SLAB.D / 2 + 0.02, Math.min(SLAB.D / 2 - 0.02, az)));
      const ci = Math.round(cx), cj = Math.round(cz);
      const lst = [];
      for (let j = cj - 3; j <= cj + 3; j++) for (let i = ci - 3; i <= ci + 3; i++) if (i >= 0 && j >= 0 && i < GX && j < GZ) lst.push(j * GX + i);
      for (const k of lst) this.h[k] += carry / lst.length;
    }
    // erase imprints under the blade
    const [fx, fz] = this.toFine(x, z), fr = r / SLAB.W * FX;
    for (let j = Math.floor(fz - fr); j <= fz + fr; j++) for (let i = Math.floor(fx - fr * 1.4); i <= fx + fr * 1.4; i++) {
      if (i < 0 || j < 0 || i >= FX || j >= FZ) continue;
      const d2 = ((i - fx) / 1.4) ** 2 + (j - fz) ** 2; if (d2 > fr * fr) continue;
      const w = (1 - Math.sqrt(d2) / fr) * Math.min(1, 2.2 * pass);
      const f = j * FX + i; const a = Math.min(1, w * 1.5);
      effect += Math.abs(this.imp[f]) * a * 0.5;
      this.imp[f] *= 1 - a; this.mark[f] *= 1 - a;
    }
    this.active = Math.max(this.active, 0.8);
    this.dirtyH = this.dirtyS = this.dirtyI = true;
    return effect;
  }

  // ------------------------------------------------------------ stamping
  pressStart(kind, x, z, rot, maxDepth) {
    const st = this.stamps[kind];
    const P = { kind, x, z, rot, maxDepth, t: 0, depth: 0 };
    // rasterize the stamp at this rotation into the fine grid footprint
    const sz = st.size, scale = FX / SLAB.W; // texels per meter
    const half = Math.ceil(Math.max(sz[0], sz[1]) * 0.62 * scale) + 6;
    const [fx, fz] = this.toFine(x, z);
    const x0 = Math.round(fx) - half, z0 = Math.round(fz) - half, n = half * 2;
    const mask = new Float32Array(n * n), ring = new Float32Array(n * n), snap = new Float32Array(n * n), snapM = new Float32Array(n * n);
    const c = Math.cos(rot), s = Math.sin(rot);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const X = x0 + i, Z = z0 + j;
      const lx = (X - fx) / scale, lz = (Z - fz) / scale;
      const u = (c * lx + s * lz) / sz[0] + 0.5, v = (-s * lx + c * lz) / sz[1] + 0.5;
      mask[j * n + i] = st.sample(st.depth, u, v);
      ring[j * n + i] = st.sample(st.ring, u, v);
      if (X >= 0 && Z >= 0 && X < FX && Z < FZ) { snap[j * n + i] = this.imp[Z * FX + X]; snapM[j * n + i] = this.mark[Z * FX + X]; }
    }
    Object.assign(P, { x0, z0, n, mask, ring, snap, snapM });
    this.presses.push(P);
    return P;
  }
  pressUpdate(P, dt, rate = 1) {
    P.t += dt * rate;
    const target = P.maxDepth * (1 - Math.exp(-P.t / 0.3));
    if (target <= P.depth + 1e-5) return 0;
    const dd = target - P.depth; P.depth = target;
    const { x0, z0, n, mask, ring, snap, snapM } = P;
    const rim = 0.32 * (this.stamps[P.kind].rim ?? 1);
    for (let j = 0; j < n; j++) {
      const Z = z0 + j; if (Z < 0 || Z >= FZ) continue;
      for (let i = 0; i < n; i++) {
        const X = x0 + i; if (X < 0 || X >= FX) continue;
        const m = mask[j * n + i], rg = ring[j * n + i]; if (m < 0.003 && rg < 0.003) continue;
        const f = Z * FX + X;
        const v = snap[j * n + i] - P.depth * m + P.depth * rim * rg;
        // never shallower than an existing deeper print under the stamp
        this.imp[f] = m > 0.02 ? Math.min(this.imp[f], v) : Math.max(this.imp[f], v);
        this.mark[f] = Math.max(snapM[j * n + i], Math.min(1, m * 1.2) * (this.stamps[P.kind].markV ?? 0.7));
      }
    }
    // pressing also takes out a little lump/smooth (the surface is disturbed) and keeps it wet
    const [gx, gz] = this.toGrid(P.x, P.z);
    for (let j = Math.round(gz) - 3; j <= gz + 3; j++) for (let i = Math.round(gx) - 3; i <= gx + 3; i++) if (i >= 0 && j >= 0 && i < GX && j < GZ) this.wet[j * GX + i] = Math.max(this.wet[j * GX + i], 0.7);
    this.dirtyI = this.dirtyS = true;
    return dd;
  }

  // ------------------------------------------------------------ drying
  dryStep(dt, rate) {
    for (let j = 0; j < GZ; j++) for (let i = 0; i < GX; i++) {
      const k = j * GX + i;
      const edge = Math.min(i, GX - 1 - i, j, GZ - 1 - j) / 12;
      const v = rate * dt * (0.55 + this.noise[k] * 0.5 + Math.max(0, 1 - edge) * 0.7);
      this.dry[k] = Math.min(1, this.dry[k] + v);
      this.wet[k] = Math.max(0, this.wet[k] - v * 1.4);
    }
    this.dirtyS = true;
  }

  // ------------------------------------------------------------ metrics
  stats() {
    const target = SLAB.top - SLAB.base; let fill = 0, level = 0, polish = 0, n = 0;
    for (let j = 2; j < GZ - 2; j++) for (let i = 2; i < GX - 2; i++) {
      const k = j * GX + i; n++;
      fill += Math.min(1, this.h[k] / (target * 0.92));
      if (this.h[k] > target * 0.85 && this.lump[k] < 0.35) level++;
      if (this.smooth[k] > 0.7) polish++;
    }
    return { fill: fill / n, level: level / n, polish: polish / n };
  }
  impEnergy(x0, x1) {
    let e = 0; const a = Math.round((x0 / SLAB.W + 0.5) * FX), b = Math.round((x1 / SLAB.W + 0.5) * FX);
    for (let j = 0; j < FZ; j += 2) for (let i = Math.max(0, a); i < Math.min(FX, b); i += 2) e += Math.max(0, -this.imp[j * FX + i]);
    return e;
  }

  // ------------------------------------------------------------ upload
  upload() {
    if (this.dirtyH) {
      for (let i = 0; i < GX * GZ; i++) this.hTexData[i] = THREE.DataUtils.toHalfFloat(this.h[i]);
      this.hTex.needsUpdate = true; this.dirtyH = false;
    }
    if (this.dirtyS) {
      const S = this.sTexData;
      for (let i = 0; i < GX * GZ; i++) { S[i * 4] = this.lump[i] * 255; S[i * 4 + 1] = this.smooth[i] * 255; S[i * 4 + 2] = this.dry[i] * 255; S[i * 4 + 3] = this.wet[i] * 255; }
      this.sTex.needsUpdate = true; this.dirtyS = false;
    }
    if (this.dirtyI) {
      const I = this.iTexData, sc = 127 / IMP_RANGE;
      for (let i = 0; i < FX * FZ; i++) { let v = 128 + this.imp[i] * sc; I[i * 2] = v < 0 ? 0 : v > 255 ? 255 : v; I[i * 2 + 1] = this.mark[i] * 255; }
      this.iTex.needsUpdate = true; this.dirtyI = false;
    }
  }

  // ------------------------------------------------------------ mesh & material
  buildMesh(detailTex, bedTex) {
    const SX = 288, SZ = 144;
    const g = new THREE.PlaneGeometry(SLAB.W, SLAB.D, SX, SZ);
    g.rotateX(-Math.PI / 2); // plane in XZ, uv.y increases toward -z -> fix below
    const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.2, envMapIntensity: 1.0 });
    const U = this.U = {
      tH: { value: this.hTex }, tS: { value: this.sTex }, tI: { value: this.iTex }, tD: { value: detailTex }, tBed: { value: bedTex },
      uSize: { value: new THREE.Vector2(SLAB.W, SLAB.D) }, uBase: { value: SLAB.base }, uImp: { value: IMP_RANGE },
      uTexel: { value: new THREE.Vector2(1 / FX, 1 / FZ) }, uCTexel: { value: new THREE.Vector2(1 / GX, 1 / GZ) },
      uDryTint: { value: 0 },
    };
    const common = /* glsl */`
      uniform sampler2D tH, tS, tI, tD, tBed; uniform vec2 uSize, uTexel, uCTexel; uniform float uBase, uImp, uDryTint;
      float presence(float h){ return smoothstep(0.003, 0.02, h); }
      float lumpField(vec2 p){
        float a = texture2D(tD, p*2.6 + vec2(0.13,0.71)).b;
        float b = texture2D(tD, p*6.1 + vec2(0.57,0.21)).b;
        return (a - 0.5)*0.016 + (b - 0.5)*0.007;
      }
      float slabH(vec2 uv, float lod){
        float h = texture2D(tH, uv).r;
        vec4 s = texture2D(tS, uv);
        float pr = presence(h);
        vec2 p = uv*uSize;
        float imp = (texture2D(tI, uv).r*255.0 - 128.0)/127.0*uImp;
        float L = s.r*lumpField(p);
        float agg = 0.0;
        if (lod > 0.5) {
          vec4 d = texture2D(tD, p/0.21);
          agg = ((d.r)*0.0028 + (d.g-0.5)*0.0011) * (1.0 - s.g) * (0.35 + 0.65*s.r) + (d.a)*-0.0012*s.b;
        }
        return uBase + h + pr*(imp + L + agg);
      }`;
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\n' + common + '\nvarying vec2 vSUv;')
        .replace('#include <begin_vertex>', `vec3 transformed = vec3(position);
          vSUv = uv;
          transformed.y = slabH(uv, 0.0);`);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\n' + common + `
          varying vec2 vSUv;
          float gS, gLump, gDry, gWet, gPr, gMark, gImp;
          vec3 gN;`)
        .replace('#include <color_fragment>', `#include <color_fragment>
          {
            vec2 uv = vSUv;
            float h = texture2D(tH, uv).r; vec4 s = texture2D(tS, uv); vec2 im = texture2D(tI, uv).rg;
            gLump = s.r; gS = s.g; gDry = s.b; gWet = s.a; gPr = presence(h); gMark = im.g; gImp = (im.r*255.-128.)/127.*uImp;
            // normal from height field (finite differences)
            vec2 e = vec2(uTexel.x*1.2, uTexel.y*1.2);
            float h0 = slabH(uv, 1.0);
            float hx = slabH(uv + vec2(e.x, 0.), 1.0), hz = slabH(uv + vec2(0., e.y), 1.0);
            vec3 nW = normalize(vec3(-(hx-h0)/(e.x*uSize.x), 1.0, -(hz-h0)/(e.y*uSize.y)));
            gN = nW;
            vec2 p = uv*uSize;
            vec4 d = texture2D(tD, p/0.21);
            vec4 d2 = texture2D(tD, p/0.9 + 0.31);
            // fresh wet paste (dark), aggregate peeking through while lumpy
            vec3 paste = vec3(0.118,0.117,0.111) * (0.86 + 0.28*d2.b);
            vec3 agg = mix(vec3(0.15,0.135,0.115), vec3(0.27,0.25,0.22), d.g);
            float aggVis = smoothstep(0.15, 0.6, d.r) * (1.0 - gS) * (0.35 + 0.65*gLump);
            vec3 wetC = mix(paste, agg, aggVis*0.85);
            wetC *= 1.0 - 0.18*gMark; // water pooled in prints
            // dry: pale, powdery, mottled; prints a touch darker; rims chalky
            float dr = smoothstep(0.05, 0.95, gDry + (d2.b-0.5)*0.25);
            vec3 dryC = vec3(0.47,0.46,0.43) * (0.86 + 0.22*d2.b + 0.08*d.g) * mix(1.0, 0.82, d.r*(1.0-gS)*0.5);
            dryC *= 1.0 - 0.1*gMark + clamp(gImp*25.0, -0.08, 0.1);
            dryC = mix(dryC, dryC*vec3(1.03,1.0,0.95), uDryTint);
            vec3 c = mix(wetC, dryC, dr);
            // empty bed: damp crushed stone
            vec3 bed = texture2D(tBed, p*1.6).rgb * 0.55;
            diffuseColor.rgb = mix(bed, c, gPr);
            gDry = dr;
          }`)
        .replace('#include <roughnessmap_fragment>', `float roughnessFactor = mix(mix(mix(0.62, 0.32, gWet), 0.035, gS*gS), 0.93, gDry);
          roughnessFactor = mix(0.85, roughnessFactor, gPr);`)
        .replace('#include <normal_fragment_begin>', `#include <normal_fragment_begin>
          normal = normalize((viewMatrix * vec4(gN, 0.0)).xyz);
          nonPerturbedNormal = normal;`)
        .replace('#include <lights_physical_fragment>', `#include <lights_physical_fragment>
          material.clearcoat = gPr * (1.0 - gDry) * mix(0.25, 1.0, max(gS, gWet*0.6));
          material.clearcoatRoughness = mix(0.4, 0.02, gS);`);
      // nonPerturbedNormal may not be declared in this three version path
      if (!sh.fragmentShader.includes('vec3 nonPerturbedNormal')) sh.fragmentShader = sh.fragmentShader.replace('nonPerturbedNormal = normal;', '');
    };
    mat.customProgramCacheKey = () => 'slab1';
    const mesh = new THREE.Mesh(g, mat);
    mesh.receiveShadow = true; mesh.castShadow = false;
    mesh.frustumCulled = false;
    return mesh;
  }
}

// ---------------------------------------------------------------- stamp shapes (rasterized via 2D canvas once)
function makeStamps() {
  const S = {};
  const R = 160;
  function raster(w, h, draw, blurPx = 1.2, ringPx = 5) {
    const W = Math.round(R * w / Math.max(w, h)), H = Math.round(R * h / Math.max(w, h));
    const cv = document.createElement('canvas'); cv.width = W + 24; cv.height = H + 24;
    const c = cv.getContext('2d'); c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height);
    c.translate(12, 12); c.scale(W, H); draw(c);
    const img = c.getImageData(0, 0, cv.width, cv.height).data;
    const n = cv.width * cv.height, a = new Float32Array(n);
    for (let i = 0; i < n; i++) a[i] = img[i * 4] / 255;
    const dep = boxBlur(a, cv.width, cv.height, blurPx);
    const wide = boxBlur(boxBlur(a, cv.width, cv.height, ringPx), cv.width, cv.height, ringPx * 0.6);
    const ring = new Float32Array(n); let mx = 0;
    for (let i = 0; i < n; i++) { const occ = boxBlur.coverage ? 0 : 0; ring[i] = Math.max(0, wide[i] - a[i] * 1.0) * (1 - Math.min(1, dep[i] * 3)); mx = Math.max(mx, ring[i]); }
    for (let i = 0; i < n; i++) ring[i] /= mx || 1;
    const pad = 12 / W, padH = 12 / H;
    return {
      depth: dep, ring, W: cv.width, H: cv.height,
      sample(arr, u, v) {
        // u,v in shape space [0,1] -> canvas space incl. padding
        const x = (u * W + 12), y = (v * H + 12);
        if (x < 0 || y < 0 || x >= cv.width - 1 || y >= cv.height - 1) return 0;
        const xi = x | 0, yi = y | 0, fx = x - xi, fy = y - yi, k = yi * cv.width + xi;
        return (arr[k] * (1 - fx) + arr[k + 1] * fx) * (1 - fy) + (arr[k + cv.width] * (1 - fx) + arr[k + cv.width + 1] * fx) * fy;
      },
    };
  }
  const gray = (c, v) => { const q = Math.round(v * 255); c.fillStyle = `rgb(${q},${q},${q})`; c.strokeStyle = c.fillStyle; };
  // child's hand: palm + 5 fingers (fingers toward -v = away from the girl, i.e. toward +z when she reaches)
  S.hand = { size: [0.085, 0.115], ...raster(0.085, 0.115, (c) => {
    gray(c, 0.85);
    c.beginPath(); c.ellipse(0.5, 0.66, 0.36, 0.25, 0, 0, Math.PI * 2); c.fill();
    gray(c, 1);
    const fingers = [[0.17, 0.42, 0.2, -0.55], [0.34, 0.2, 0.37, -0.12], [0.5, 0.15, 0.52, 0.0], [0.65, 0.2, 0.66, 0.1], [0.8, 0.32, 0.79, 0.25]];
    c.lineCap = 'round';
    fingers.forEach(([x, y, , a], i) => { c.lineWidth = i === 0 ? 0.15 : 0.12; c.beginPath(); const bx = x + (0.5 - x) * 0.15, by = 0.55; c.moveTo(bx, by); c.lineTo(x + Math.sin(a) * 0.02, y); c.stroke(); });
    gray(c, 0.7); c.beginPath(); c.ellipse(0.5, 0.88, 0.2, 0.1, 0, 0, Math.PI * 2); c.fill();
  }, 1.3, 6), markV: 0.6 };
  // child's rain boot: outline + chevron lugs
  S.boot = { size: [0.07, 0.17], ...raster(0.07, 0.17, (c) => {
    gray(c, 0.6);
    c.beginPath(); c.ellipse(0.5, 0.28, 0.46, 0.27, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(0.5, 0.8, 0.4, 0.19, 0, 0, Math.PI * 2); c.fill();
    c.fillRect(0.14, 0.3, 0.72, 0.42);
    gray(c, 1);
    for (let y = 0.07; y < 0.62; y += 0.075) { c.lineWidth = 0.045; c.beginPath(); c.moveTo(0.12, y + 0.04); c.lineTo(0.5, y); c.lineTo(0.88, y + 0.04); c.stroke(); }
    for (let y = 0.68; y < 0.95; y += 0.075) { c.lineWidth = 0.045; c.beginPath(); c.moveTo(0.18, y); c.lineTo(0.82, y); c.stroke(); }
  }, 1.0, 5), markV: 0.5 };
  // adult work boot (papa)
  S.bigboot = { size: [0.11, 0.29], ...raster(0.11, 0.29, (c) => {
    gray(c, 0.65);
    c.beginPath(); c.ellipse(0.5, 0.27, 0.47, 0.26, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(0.5, 0.82, 0.42, 0.17, 0, 0, Math.PI * 2); c.fill();
    c.fillRect(0.12, 0.3, 0.76, 0.42);
    gray(c, 1);
    for (let y = 0.06; y < 0.62; y += 0.06) for (let x = 0.2; x < 0.85; x += 0.2) { c.fillRect(x - 0.07, y, 0.14, 0.032); }
    for (let y = 0.7; y < 0.96; y += 0.06) { c.fillRect(0.15, y, 0.7, 0.03); }
  }, 1.0, 6), markV: 0.5, rim: 1.2 };
  // maple leaf with veins (veins = deeper grooves)
  S.leaf = { size: [0.12, 0.12], ...raster(0.12, 0.12, (c) => {
    gray(c, 0.45);
    c.beginPath();
    const pts = 5, cx = 0.5, cy = 0.52;
    for (let i = 0; i <= 60; i++) {
      const a = -Math.PI / 2 + i / 60 * Math.PI * 2;
      const lobe = Math.abs(Math.cos((a + Math.PI / 2) * pts / 2));
      const r = 0.2 + 0.26 * Math.pow(lobe, 3) + 0.03 * Math.cos(a * 18);
      const rr = a > Math.PI * 0.35 && a < Math.PI * 0.65 ? r * 0.35 : r;
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
      if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.closePath(); c.fill();
    gray(c, 1); c.lineCap = 'round';
    for (let i = 0; i < pts; i++) { const a = -Math.PI / 2 + (i - 2) * 0.62; c.lineWidth = 0.022; c.beginPath(); c.moveTo(cx, cy + 0.05); c.lineTo(cx + Math.cos(a) * 0.44, cy + Math.sin(a) * 0.44); c.stroke();
      for (let t = 0.12; t < 0.4; t += 0.08) { const bx = cx + Math.cos(a) * t, by = cy + 0.05 + Math.sin(a) * t; c.lineWidth = 0.01; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + Math.cos(a + 0.7) * 0.07, by + Math.sin(a + 0.7) * 0.07); c.moveTo(bx, by); c.lineTo(bx + Math.cos(a - 0.7) * 0.07, by + Math.sin(a - 0.7) * 0.07); c.stroke(); } }
    c.lineWidth = 0.025; c.beginPath(); c.moveTo(cx, cy + 0.05); c.lineTo(cx, 0.98); c.stroke();
  }, 0.8, 4), markV: 0.9, rim: 0.4 };
  // three-toed dinosaur footprint (toes toward -v)
  S.dino = { size: [0.15, 0.19], ...raster(0.15, 0.19, (c) => {
    gray(c, 0.8);
    c.beginPath(); c.ellipse(0.5, 0.74, 0.22, 0.2, 0, 0, Math.PI * 2); c.fill();
    c.lineCap = 'round';
    const toes = [[0.12, 0.2, 0.15], [0.5, 0.04, 0.17], [0.88, 0.2, 0.15]];
    toes.forEach(([x, y, w]) => { gray(c, 0.85); c.lineWidth = w; c.beginPath(); c.moveTo(0.5 + (x - 0.5) * 0.25, 0.66); c.lineTo(x, y + 0.06); c.stroke(); gray(c, 1); c.beginPath(); c.ellipse(x, y + 0.02, w * 0.28, w * 0.45, (x - 0.5) * 0.9, 0, Math.PI * 2); c.fill(); });
    gray(c, 0.95); c.beginPath(); c.ellipse(0.5, 0.82, 0.13, 0.1, 0, 0, Math.PI * 2); c.fill();
  }, 1.4, 6), markV: 0.6 };
  S.paw = { size: [0.06, 0.06], ...raster(0.06, 0.06, (c) => {
    gray(c, 1); c.beginPath(); c.ellipse(0.5, 0.65, 0.24, 0.2, 0, 0, Math.PI * 2); c.fill();
    for (const [x, y] of [[0.2, 0.32], [0.4, 0.17], [0.6, 0.17], [0.8, 0.32]]) { c.beginPath(); c.ellipse(x, y, 0.1, 0.12, 0, 0, Math.PI * 2); c.fill(); }
  }, 1.2, 4), markV: 0.5 };
  return S;
}

function boxBlur(a, w, h, r) {
  if (r <= 0) return a.slice();
  const out = new Float32Array(a.length), tmp = new Float32Array(a.length), R = Math.max(1, Math.round(r));
  for (let y = 0; y < h; y++) { let s = 0; for (let x = -R; x <= R; x++) s += a[y * w + Math.min(w - 1, Math.max(0, x))]; for (let x = 0; x < w; x++) { tmp[y * w + x] = s / (2 * R + 1); s += a[y * w + Math.min(w - 1, x + R + 1)] - a[y * w + Math.max(0, x - R)]; } }
  for (let x = 0; x < w; x++) { let s = 0; for (let y = -R; y <= R; y++) s += tmp[Math.min(h - 1, Math.max(0, y)) * w + x]; for (let y = 0; y < h; y++) { out[y * w + x] = s / (2 * R + 1); s += tmp[Math.min(h - 1, y + R + 1) * w + x] - tmp[Math.max(0, y - R) * w + x]; } }
  return out;
}
