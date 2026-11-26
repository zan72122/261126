// SandField: a deformable heightfield of loose sand over a hard floor (+ buried objects).
// Brushing removes sand only where touched (amount ~ time x pressure), leaves bristle grooves,
// pushes a small ridge ahead of the stroke, and the sand slumps to its angle of repose.
// Per-vertex: sand thickness, brushed polish, disturbed, contact AO -> shader changes color/gloss/normal.
import * as THREE from 'three';
import { pbr, tex, clamp } from './core.js';
import { fbm } from './geo.js';
import { addGroundHole } from './env.js';

export class SandField {
  constructor(o) {
    this.x0 = o.x0; this.z0 = o.z0; this.w = o.w; this.d = o.d;
    this.cell = o.cell || 0.0075;
    this.nx = Math.round(this.w / this.cell) + 1; this.nz = Math.round(this.d / this.cell) + 1;
    const N = this.nx * this.nz;
    this.floor = new Float32Array(N);
    this.obst = new Float32Array(N).fill(-9);
    this.sand = new Float32Array(N);
    this.brushed = new Float32Array(N);
    this.disturb = new Float32Array(N);
    this.dep = new Float32Array(N);
    this.pin = new Uint8Array(N);
    this.objects = [];
    const top0 = o.top0 || ((x, z) => 0);
    const floorFn = o.floor || ((x, z) => -0.1);
    for (let j = 0; j < this.nz; j++) for (let i = 0; i < this.nx; i++) {
      const k = j * this.nx + i, x = this.x0 + i * this.cell, z = this.z0 + j * this.cell;
      this.floor[k] = floorFn(x, z);
      this.sand[k] = Math.max(0, top0(x, z) - this.floor[k]);
      if (i < 2 || j < 2 || i > this.nx - 3 || j > this.nz - 3) this.pin[k] = 1;
    }
    this.buildMesh(o);
    addGroundHole(this.x0 + this.cell * 1.5, this.z0 + this.cell * 1.5, this.x0 + this.w - this.cell * 1.5, this.z0 + this.d - this.cell * 1.5);
    this.dirty = { i0: 0, i1: this.nx - 1, j0: 0, j1: this.nz - 1 };
    this.flush(true);
  }
  idx(x, z) {
    const i = Math.round((x - this.x0) / this.cell), j = Math.round((z - this.z0) / this.cell);
    if (i < 0 || j < 0 || i >= this.nx || j >= this.nz) return -1;
    return j * this.nx + i;
  }
  support(k) { return Math.max(this.floor[k], this.obst[k]); }
  top(k) { return this.support(k) + this.sand[k]; }
  // bilinear height of the visible top at world x,z
  heightAt(x, z) {
    const fx = (x - this.x0) / this.cell, fz = (z - this.z0) / this.cell;
    const i = clamp(Math.floor(fx), 0, this.nx - 2), j = clamp(Math.floor(fz), 0, this.nz - 2);
    const tx = clamp(fx - i, 0, 1), tz = clamp(fz - j, 0, 1);
    const k = j * this.nx + i;
    const h00 = this.vis(k), h10 = this.vis(k + 1), h01 = this.vis(k + this.nx), h11 = this.vis(k + this.nx + 1);
    return (h00 * (1 - tx) + h10 * tx) * (1 - tz) + (h01 * (1 - tx) + h11 * tx) * tz;
  }
  sandAt(x, z) { const k = this.idx(x, z); return k < 0 ? 0 : this.sand[k]; }
  topAt(x, z) { const k = this.idx(x, z); return k < 0 ? 0 : this.top(k); }
  vis(k) {
    const s = this.sand[k], f = this.floor[k], ob = this.obst[k];
    if (ob <= f) return f + s;
    const t = clamp(s / 0.004, 0, 1);
    return (f - 0.004) * (1 - t) + (ob + s) * t;
  }
  inside(x, z) { return x > this.x0 && z > this.z0 && x < this.x0 + this.w && z < this.z0 + this.d; }
  markDirty(i0, i1, j0, j1) {
    const D = this.dirty;
    if (!D) { this.dirty = { i0, i1, j0, j1 }; return; }
    D.i0 = Math.min(D.i0, i0); D.i1 = Math.max(D.i1, i1); D.j0 = Math.min(D.j0, j0); D.j1 = Math.max(D.j1, j1);
  }

  // ------------------------------------------------------------------ objects (bones, rocks) as obstacles
  // samples: array of world Vector3 (vertices); stores max height per cell
  addObject(id, samples, pad = 1) {
    const cells = new Map();
    for (const p of samples) {
      const ci = Math.round((p.x - this.x0) / this.cell), cj = Math.round((p.z - this.z0) / this.cell);
      for (let dj = -pad; dj <= pad; dj++) for (let di = -pad; di <= pad; di++) {
        const i = ci + di, j = cj + dj;
        if (i < 0 || j < 0 || i >= this.nx || j >= this.nz) continue;
        const k = j * this.nx + i;
        const h = p.y - (di * di + dj * dj) * 0.0012;
        if (!cells.has(k) || cells.get(k) < h) cells.set(k, h);
      }
    }
    const obj = { id, cells };
    this.objects.push(obj);
    this.rebuildObst(obj, true);
    return obj;
  }
  removeObject(id) {
    const o = this.objects.find(o => o.id === id);
    if (!o) return;
    this.objects = this.objects.filter(x => x !== o);
    this.rebuildObst(o, false);
  }
  rebuildObst(obj, adding) {
    let i0 = 1e9, i1 = -1, j0 = 1e9, j1 = -1;
    for (const [k, h] of obj.cells) {
      const i = k % this.nx, j = (k / this.nx) | 0;
      i0 = Math.min(i0, i); i1 = Math.max(i1, i); j0 = Math.min(j0, j); j1 = Math.max(j1, j);
      if (adding) {
        // sand that was above stays at the same absolute top
        const topBefore = this.top(k);
        if (h > this.obst[k]) this.obst[k] = h;
        this.sand[k] = Math.max(0, topBefore - this.support(k));
      } else {
        const topBefore = this.top(k);
        let m = -9;
        for (const o of this.objects) { const v = o.cells.get(k); if (v !== undefined && v > m) m = v; }
        this.obst[k] = m;
        // keep loose sand that was on it, it will slump into the hole
        this.sand[k] = Math.max(0, Math.min(this.sand[k], topBefore - this.support(k)));
        this.disturb[k] = 1;
      }
    }
    if (i1 >= 0) { this.markDirty(i0 - 2, i1 + 2, j0 - 2, j1 + 2); this.relaxRegion(i0 - 3, i1 + 3, j0 - 3, j1 + 3, 6); }
  }
  // fraction of samples whose top is not covered by sand (> thresh)
  exposure(samples, thresh = 0.004) {
    let n = 0, vis = 0;
    for (const p of samples) {
      const k = this.idx(p.x, p.z); if (k < 0) continue;
      n++; if (this.top(k) < p.y + thresh) vis++;
    }
    return n ? vis / n : 0;
  }

  // ------------------------------------------------------------------ brushing
  // returns removed volume (m^3) for particles/sound
  brush(px, pz, dx, dz, dt, power = 1) {
    let L = Math.hypot(dx, dz);
    if (L < 1e-6) { dx = 0; dz = 1; L = 1; }
    const ux = dx / L, uz = dz / L; // stroke dir
    const vx = -uz, vz = ux;        // lateral
    const half = 0.042, along = 0.026, R = Math.max(half, along) + 0.01;
    const c = this.cell;
    const ci = Math.round((px - this.x0) / c), cj = Math.round((pz - this.z0) / c);
    const r = Math.ceil(R / c);
    let removed = 0;
    const rate = 0.45 * power; // m/s at full contact
    const pushD = 0.045;
    for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i++) {
      if (i < 1 || j < 1 || i >= this.nx - 1 || j >= this.nz - 1) continue;
      const k = j * this.nx + i;
      if (this.pin[k]) continue;
      const wx = this.x0 + i * c - px, wz = this.z0 + j * c - pz;
      const a = wx * ux + wz * uz, l = wx * vx + wz * vz;
      const e = (a / along) ** 2 + (l / half) ** 2;
      if (e > 1) continue;
      const w = (1 - e) ** 1.5;
      // bristle clumps -> fine parallel grooves along the stroke
      const groove = 1 + 0.55 * Math.sin((l + (px * vx + pz * vz)) * 2 * Math.PI / 0.018);
      const want = rate * dt * w * groove * (0.6 + 0.4 * Math.min(1, L * 8));
      const take = Math.min(this.sand[k], want);
      if (take > 0) {
        this.sand[k] -= take; removed += take;
        // part of the sand is pushed ahead of the bristles, the rest flies off
        const tx = this.x0 + i * c + ux * pushD + vx * l * 0.3, tz = this.z0 + j * c + uz * pushD + vz * l * 0.3;
        const kk = this.idx(tx, tz);
        if (kk >= 0 && !this.pin[kk]) this.dep[kk] += take * 0.25;
      }
      this.brushed[k] = Math.min(1, this.brushed[k] + w * dt * 4);
      this.disturb[k] = Math.min(1, this.disturb[k] + w * dt * 3);
    }
    // apply deposits (blurred a bit)
    const r2 = r + Math.ceil(pushD / c) + 2;
    for (let j = cj - r2; j <= cj + r2; j++) for (let i = ci - r2; i <= ci + r2; i++) {
      if (i < 1 || j < 1 || i >= this.nx - 1 || j >= this.nz - 1) continue;
      const k = j * this.nx + i;
      const v = this.dep[k]; if (!v) continue;
      this.dep[k] = 0;
      this.sand[k] += v * 0.4; this.sand[k - 1] += v * 0.15; this.sand[k + 1] += v * 0.15; this.sand[k - this.nx] += v * 0.15; this.sand[k + this.nx] += v * 0.15;
      this.disturb[k] = 1;
      this.brushed[k] *= 0.9;
    }
    this.markDirty(ci - r2 - 2, ci + r2 + 2, cj - r2 - 2, cj + r2 + 2);
    this.relaxRegion(ci - r2 - 3, ci + r2 + 3, cj - r2 - 3, cj + r2 + 3, 2);
    return removed * c * c;
  }
  // hammer on plain sand: a small dent with a rim
  dent(px, pz, depth = 0.012, rad = 0.03) {
    const c = this.cell, ci = Math.round((px - this.x0) / c), cj = Math.round((pz - this.z0) / c), r = Math.ceil(rad * 1.8 / c);
    for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i++) {
      if (i < 1 || j < 1 || i >= this.nx - 1 || j >= this.nz - 1) continue;
      const k = j * this.nx + i; if (this.pin[k]) continue;
      const d = Math.hypot(this.x0 + i * c - px, this.z0 + j * c - pz) / rad;
      const dh = d < 1 ? -depth * (1 - d * d) : (d < 1.8 ? depth * 0.5 * Math.sin((d - 1) / 0.8 * Math.PI) : 0);
      this.sand[k] = Math.max(0, this.sand[k] + dh);
      this.disturb[k] = Math.max(this.disturb[k], d < 1.6 ? 0.8 : 0);
    }
    this.markDirty(ci - r - 2, ci + r + 2, cj - r - 2, cj + r + 2);
    this.relaxRegion(ci - r - 3, ci + r + 3, cj - r - 3, cj + r + 3, 2);
  }
  // footprint stamping: shape(lx, lz) -> depth factor (0..1), positive = pressed; rim raised
  stamp(px, pz, yaw, shape, depth, size) {
    const c = this.cell, ci = Math.round((px - this.x0) / c), cj = Math.round((pz - this.z0) / c), r = Math.ceil(size * 1.4 / c);
    const cs = Math.cos(yaw), sn = Math.sin(yaw);
    let displaced = 0;
    const edge = [];
    for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i++) {
      if (i < 1 || j < 1 || i >= this.nx - 1 || j >= this.nz - 1) continue;
      const k = j * this.nx + i; if (this.pin[k]) continue;
      const wx = this.x0 + i * c - px, wz = this.z0 + j * c - pz;
      const lx = (wx * cs - wz * sn) / size, lz = (wx * sn + wz * cs) / size;
      const s = shape(lx, lz);
      if (s > 0) {
        const take = Math.min(this.sand[k], depth * s);
        this.sand[k] -= take; displaced += take;
        this.brushed[k] = Math.max(this.brushed[k], 0.65 * s); // compacted, smoother
        this.disturb[k] = Math.max(this.disturb[k], 0.5);
      } else if (s > -0.6) edge.push(k);
    }
    if (edge.length) { const per = displaced * 0.85 / edge.length; for (const k of edge) { this.sand[k] += per; this.disturb[k] = 1; } }
    this.markDirty(ci - r - 2, ci + r + 2, cj - r - 2, cj + r + 2);
    this.relaxRegion(ci - r - 2, ci + r + 2, cj - r - 2, cj + r + 2, 1, 0.009);
  }
  // add a heap of sand (e.g. papa's spill / rock debris)
  pour(px, pz, amount, rad) {
    const c = this.cell, ci = Math.round((px - this.x0) / c), cj = Math.round((pz - this.z0) / c), r = Math.ceil(rad / c);
    for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i++) {
      if (i < 1 || j < 1 || i >= this.nx - 1 || j >= this.nz - 1) continue;
      const k = j * this.nx + i; if (this.pin[k]) continue;
      const d = Math.hypot(this.x0 + i * c - px, this.z0 + j * c - pz) / rad;
      if (d < 1) { this.sand[k] += amount * (1 - d * d); this.disturb[k] = 1; this.brushed[k] *= 0.5; }
    }
    this.markDirty(ci - r - 2, ci + r + 2, cj - r - 2, cj + r + 2);
    this.relaxRegion(ci - r - 3, ci + r + 3, cj - r - 3, cj + r + 3, 4);
  }
  // angle of repose relaxation (only loose sand moves)
  relaxRegion(i0, i1, j0, j1, iters = 2, maxStep) {
    const nx = this.nx, nz = this.nz;
    i0 = Math.max(1, i0); j0 = Math.max(1, j0); i1 = Math.min(nx - 2, i1); j1 = Math.min(nz - 2, j1);
    const ms = maxStep || this.cell * 0.68;
    for (let it = 0; it < iters; it++) {
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const k = j * nx + i;
        if (this.sand[k] <= 0 || this.pin[k]) continue;
        const h = this.top(k);
        const nb = [k - 1, k + 1, k - nx, k + nx];
        for (const q of nb) {
          if (this.pin[q]) continue;
          const dh = h - this.top(q);
          if (dh > ms) {
            const mv = Math.min(this.sand[k], (dh - ms) * 0.25);
            if (mv <= 0) continue;
            this.sand[k] -= mv; this.sand[q] += mv; this.disturb[q] = Math.max(this.disturb[q], 0.6);
          }
        }
      }
    }
  }

  // ------------------------------------------------------------------ mesh
  buildMesh(o) {
    const nx = this.nx, nz = this.nz, N = nx * nz;
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(N * 3); this.nor = new Float32Array(N * 3);
    this.att = new Float32Array(N * 4); // sand thickness, brushed, disturbed, ao
    const uv = new Float32Array(N * 2);
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      this.pos[k * 3] = this.x0 + i * this.cell; this.pos[k * 3 + 2] = this.z0 + j * this.cell;
      this.nor[k * 3 + 1] = 1; this.att[k * 4 + 3] = 1;
      uv[k * 2] = this.pos[k * 3] / 0.85; uv[k * 2 + 1] = this.pos[k * 3 + 2] / 0.85;
    }
    const idx = new Uint32Array((nx - 1) * (nz - 1) * 6);
    let q = 0;
    for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1;
      idx[q++] = a; idx[q++] = c; idx[q++] = b; idx[q++] = b; idx[q++] = c; idx[q++] = d;
    }
    this.posAttr = new THREE.BufferAttribute(this.pos, 3); this.posAttr.setUsage(THREE.DynamicDrawUsage);
    this.norAttr = new THREE.BufferAttribute(this.nor, 3); this.norAttr.setUsage(THREE.DynamicDrawUsage);
    this.attAttr = new THREE.BufferAttribute(this.att, 4); this.attAttr.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position', this.posAttr); g.setAttribute('normal', this.norAttr);
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setAttribute('aSand', this.attAttr);
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.boundingBox = new THREE.Box3(new THREE.Vector3(this.x0, -0.5, this.z0), new THREE.Vector3(this.x0 + this.w, 0.3, this.z0 + this.d));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(this.x0 + this.w / 2, 0, this.z0 + this.d / 2), Math.hypot(this.w, this.d) / 2 + 0.3);
    this.mat = sandMaterial(o.floorTex || 'hardpan');
    this.mesh = new THREE.Mesh(g, this.mat);
    this.mesh.receiveShadow = true; this.mesh.castShadow = true;
    this.mesh.frustumCulled = false;
  }
  flush(all = false) {
    const D = this.dirty; if (!D) return;
    this.dirty = null;
    const nx = this.nx, nz = this.nz, c = this.cell;
    const i0 = Math.max(0, D.i0), i1 = Math.min(nx - 1, D.i1), j0 = Math.max(0, D.j0), j1 = Math.min(nz - 1, D.j1);
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const k = j * nx + i;
      this.pos[k * 3 + 1] = this.vis(k);
    }
    // normals + AO + attributes over a one-cell-larger region
    const a0 = Math.max(1, i0 - 1), a1 = Math.min(nx - 2, i1 + 1), b0 = Math.max(1, j0 - 1), b1 = Math.min(nz - 2, j1 + 1);
    for (let j = b0; j <= b1; j++) for (let i = a0; i <= a1; i++) {
      const k = j * nx + i;
      const hl = this.pos[(k - 1) * 3 + 1], hr = this.pos[(k + 1) * 3 + 1], hd = this.pos[(k - nx) * 3 + 1], hu = this.pos[(k + nx) * 3 + 1];
      let ny = 2 * c, nX = hl - hr, nZ = hd - hu;
      const L = Math.hypot(nX, ny, nZ);
      this.nor[k * 3] = nX / L; this.nor[k * 3 + 1] = ny / L; this.nor[k * 3 + 2] = nZ / L;
      // cavity AO: neighbourhood higher than me (incl. bones/rocks rising out of the sand)
      const h = this.pos[k * 3 + 1];
      let occ = 0;
      for (const s of [2, 5]) {
        const kk = [k - s, k + s, k - s * nx, k + s * nx];
        for (const q of kk) {
          if (q < 0 || q >= nx * nz) continue;
          const hq = Math.max(this.pos[q * 3 + 1], this.obst[q]);
          occ += clamp((hq - h) / (s * c * 2.2), 0, 1);
        }
      }
      const ob = this.obst[k] > -1 ? clamp((this.obst[k] - h) / 0.03, 0, 1) : 0;
      this.att[k * 4] = this.sand[k];
      this.att[k * 4 + 1] = this.brushed[k];
      this.att[k * 4 + 2] = this.disturb[k];
      this.att[k * 4 + 3] = clamp(1 - occ * 0.11 - ob * 0.25, 0.35, 1);
    }
    for (let j = 0; j < nz; j += all ? nz : 1) { } // noop
    const r0 = Math.max(0, j0 - 1), r1 = Math.min(nz - 1, j1 + 1);
    const start = r0 * nx, count = (r1 - r0 + 1) * nx;
    for (const [attr, sz] of [[this.posAttr, 3], [this.norAttr, 3], [this.attAttr, 4]]) {
      attr.clearUpdateRanges(); attr.addUpdateRange(start * sz, count * sz); attr.needsUpdate = true;
    }
  }
}

// ------------------------------------------------------------------ sand shader
function sandMaterial(floorName) {
  const m = pbr('sand', { repeat: 1 });
  const hard = { c: tex(floorName, 'c', 1), n: tex(floorName, 'n', 1), orm: tex(floorName, 'orm', 1) };
  m.onBeforeCompile = sh => {
    sh.uniforms.hardC = { value: hard.c }; sh.uniforms.hardN = { value: hard.n }; sh.uniforms.hardO = { value: hard.orm };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 aSand; varying vec4 vSand; varying vec3 vWP;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvSand = aSand; vWP = (modelMatrix*vec4(transformed,1.)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec4 vSand; varying vec3 vWP; uniform sampler2D hardC, hardN, hardO; float sandT; float polish;')
      .replace('#include <map_fragment>', `
        sandT = smoothstep(0.0005, 0.010, vSand.x);
        polish = vSand.y * (1. - smoothstep(.0, .03, vSand.x) * .3);
        vec4 sA = texture2D(map, vMapUv);
        vec4 sB = texture2D(map, vWP.xz*0.37 + vec2(.31,.17));
        vec4 mac = texture2D(map, vWP.xz*0.013);
        vec3 sc = mix(sA.rgb, sB.rgb, .35) * mix(.84, 1.12, smoothstep(.55,.85, mac.r));
        // fresh, disturbed sand from below: a bit deeper/redder ochre
        sc *= mix(vec3(1.), vec3(.93,.86,.78), vSand.z*.8);
        // brushed: finer, more compact, slightly darker
        sc *= mix(1., .9, polish);
        vec3 hc = texture2D(hardC, vMapUv*1.3).rgb;
        hc *= mix(1., .92, vSand.y);
        diffuseColor.rgb *= mix(hc, sc, sandT);
      `)
      .replace('#include <roughnessmap_fragment>', `
        float roughnessFactor = roughness;
        float rS = texture2D(roughnessMap, vRoughnessMapUv).g;
        float rH = texture2D(hardO, vMapUv*1.3).g;
        roughnessFactor *= mix(rH - vSand.y*.18, rS - polish*.22, sandT);
      `)
      .replace('#include <normal_fragment_maps>', `
        vec3 nS = texture2D(normalMap, vNormalMapUv).xyz*2.-1.;
        vec3 nH = texture2D(hardN, vMapUv*1.3).xyz*2.-1.;
        vec3 mapN = normalize(mix(nH, nS * vec3(mix(1., .45, polish), mix(1., .45, polish), 1.), sandT));
        mapN.xy *= normalScale;
        normal = normalize( tbn * mapN );
      `)
      .replace('#include <aomap_fragment>', `
        float ambientOcclusion = vSand.w * mix(texture2D(hardO, vMapUv*1.3).r, texture2D(aoMap, vAoMapUv).r, sandT);
        reflectedLight.indirectDiffuse *= ambientOcclusion;
        reflectedLight.indirectSpecular *= ambientOcclusion;
        reflectedLight.directDiffuse *= mix(1., vSand.w, .55);
      `);
  };
  return m;
}
