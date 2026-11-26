// Cotton candy as a real little simulation:
//  - an icosphere whose per-vertex radius grows only where spun sugar is deposited (direction, amount, order)
//  - per-vertex colour layers (inner / outer) so colour changes leave visible bands
//  - per-vertex wetness: shrinks the fluff, turns it into glossy translucent syrup
//  - thousands of individual sugar threads (line strands) that catch the lantern light at the rim
import * as THREE from './three.module.min.js';
import { tex } from './tex.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// shared topology
let TOPO = null;
function topo() {
  if (TOPO) return TOPO;
  const g = new THREE.IcosahedronGeometry(1, 18);
  // merge duplicated vertices of non-indexed icosahedron
  const p = g.attributes.position;
  const map = new Map(); const dirs = []; const remap = new Uint32Array(p.count);
  for (let i = 0; i < p.count; i++) {
    const k = p.getX(i).toFixed(4) + ',' + p.getY(i).toFixed(4) + ',' + p.getZ(i).toFixed(4);
    let id = map.get(k);
    if (id === undefined) { id = dirs.length; map.set(k, id); dirs.push(V(p.getX(i), p.getY(i), p.getZ(i)).normalize()); }
    remap[i] = id;
  }
  const index = []; for (let i = 0; i < p.count; i++) index.push(remap[i]);
  const N = dirs.length;
  const nb = Array.from({ length: N }, () => new Set());
  for (let i = 0; i < index.length; i += 3) {
    const a = index[i], b = index[i + 1], c = index[i + 2];
    nb[a].add(b).add(c); nb[b].add(a).add(c); nb[c].add(a).add(b);
  }
  const uv = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) { const d = dirs[i]; uv[i * 2] = 0.5 + Math.atan2(d.x, d.z) / (Math.PI * 2); uv[i * 2 + 1] = 0.5 + Math.asin(d.y) / Math.PI; }
  TOPO = { dirs, index, nb: nb.map(s => Uint32Array.from(s)), N, uv };
  return TOPO;
}

// ---------------------------------------------------------------- materials
function candyCoreMaterial(rimColor) {
  const m = new THREE.MeshPhysicalMaterial({
    vertexColors: true, map: tex('fibre_c', 3, true), normalMap: tex('fibre_n', 3), normalScale: new THREE.Vector2(0.45, 0.45),
    roughness: 0.9, metalness: 0, sheen: 0.35, sheenRoughness: 0.4, sheenColor: new THREE.Color(0.4, 0.3, 0.22),
    clearcoat: 1, clearcoatRoughness: 0.08, transparent: true, depthWrite: true, side: THREE.FrontSide,
  });
  m.userData.uRim = { value: rimColor };
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uRim = m.userData.uRim;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aWet; varying float vWet;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWet = aWet;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uRim; varying float vWet;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        // wet sugar becomes deeper, more saturated syrup
        diffuseColor.rgb = mix(diffuseColor.rgb, pow(diffuseColor.rgb, vec3(2.2)) * 1.35, smoothstep(0.0, 0.6, vWet));`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.06, smoothstep(0.0, 0.5, vWet));`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        {
          vec3 vd = normalize(vViewPosition);
          float ndv = clamp(abs(dot(normal, vd)), 0.0, 1.0);
          float rim = pow(1.0 - ndv, 2.2);
          // fluffy: edges dissolve into threads; wet: clearer, glassy
          diffuseColor.a *= mix(0.12 + 0.88 * smoothstep(0.03, 0.55, ndv), 0.28 + 0.4 * ndv, smoothstep(0.0, 0.6, vWet));
          // lantern light scattering through the thin threads at the rim (golden edge)
          totalEmissiveRadiance += uRim * rim * (1.0 - 0.6 * vWet) + diffuseColor.rgb * 0.03;
        }`)
      .replace('#include <lights_physical_fragment>', THREE.ShaderChunk.lights_physical_fragment.replace('material.clearcoat = clearcoat;', 'material.clearcoat = clearcoat * smoothstep(0.0, 0.5, vWet);'));
  };
  m.customProgramCacheKey = () => 'candyCore';
  return m;
}

function candyShellMaterial(offset, rep, rimColor) {
  const m = new THREE.MeshPhysicalMaterial({
    vertexColors: true, alphaMap: tex('fibre_c', rep), transparent: true, depthWrite: false,
    roughness: 0.95, sheen: 0.2, sheenRoughness: 0.4, sheenColor: new THREE.Color(0.4, 0.3, 0.2), opacity: 0.8,
  });
  m.userData.uRim = { value: rimColor };
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uRim = m.userData.uRim;
    sh.uniforms.uOff = { value: offset };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aWet; varying float vWet; uniform float uOff;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWet = aWet; transformed += normalize(objectNormal) * uOff * (1.0 - aWet);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uRim; varying float vWet;')
      .replace('#include <alphamap_fragment>', `#include <alphamap_fragment>
        diffuseColor.a = smoothstep(0.86, 1.0, texture2D(alphaMap, vAlphaMapUv).g) * opacity * (1.0 - vWet);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        { vec3 vd = normalize(vViewPosition); float ndv = clamp(abs(dot(normal, vd)), 0.0, 1.0);
          totalEmissiveRadiance += uRim * pow(1.0 - ndv, 2.2) * 0.6 + diffuseColor.rgb * 0.05; }`);
  };
  m.customProgramCacheKey = () => 'candyShell' + offset;
  return m;
}

export function strandMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, vertexColors: true,
    uniforms: {
      uRim: { value: new THREE.Color(0.75, 0.42, 0.14) },
      uAmb: { value: new THREE.Color(0.25, 0.22, 0.24) },
      uKey: { value: new THREE.Color(0.6, 0.48, 0.36) },
      uKeyDir: { value: V(0.2, 0.9, 0.3).normalize() },
      uOpacity: { value: 1 },
    },
    vertexShader: `attribute vec3 aN; attribute float aA; varying vec3 vC; varying float vA; varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * aN); vV = normalize(-mv.xyz);
        vC = color; vA = aA; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uRim; uniform vec3 uAmb; uniform vec3 uKey; uniform vec3 uKeyDir; uniform float uOpacity;
      varying vec3 vC; varying float vA; varying vec3 vN; varying vec3 vV;
      void main(){
        float ndv = abs(dot(vN, vV)); float rim = pow(1.0 - ndv, 2.0);
        float dif = 0.55 + 0.45 * dot(vN, uKeyDir);
        vec3 c = vC * (uAmb + uKey * dif) * 1.1 + uRim * rim * 0.8;
        gl_FragColor = vec4(c, vA * uOpacity * (0.4 + 0.6 * rim));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}

// ---------------------------------------------------------------- Candy
export class Candy {
  constructor(opts = {}) {
    const T = topo();
    this.T = T;
    const N = T.N;
    this.r = new Float32Array(N).fill(0.004);
    this.wet = new Float32Array(N);
    this.cIn = new Float32Array(N * 3).fill(1);
    this.cOut = new Float32Array(N * 3).fill(1);
    this.tOut = new Float32Array(N);
    this.lump = new Float32Array(N);
    const seed = opts.seed || Math.random() * 1000;
    // billowy puffs: a few soft random blobs + fine noise
    const blobs = [];
    let rs = Math.floor(seed * 9301) % 233280 || 7;
    const rnd = () => { rs = (rs * 9301 + 49297) % 233280; return rs / 233280; };
    for (let k = 0; k < 16; k++) blobs.push({ d: V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), s: 0.12 + rnd() * 0.25, a: 0.5 + rnd() });
    for (let i = 0; i < N; i++) {
      const d = T.dirs[i]; let v = -0.45;
      for (const b of blobs) v += b.a * Math.exp(-d.distanceToSquared(b.d) / b.s);
      this.lump[i] = v * 0.8 + Math.sin(d.x * 17 + d.z * 13 + seed) * 0.12;
    }
    this.mass = 0; this.shares = new Map();
    this.group = new THREE.Group();
    this.rim = opts.rim || new THREE.Color(1.0, 0.55, 0.2).multiplyScalar(0.42);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(N * 3).fill(1), 3));
    g.setAttribute('aWet', new THREE.BufferAttribute(this.wet, 1));
    g.setAttribute('uv', new THREE.BufferAttribute(T.uv, 2));
    g.setIndex(T.index);
    this.geo = g;
    this.core = new THREE.Mesh(g, opts.coreMat || (Candy.coreMat ||= candyCoreMaterial(this.rim)));
    this.core.renderOrder = 2;
    this.core.castShadow = true; this.core.receiveShadow = true;
    this.shells = [];
    if (opts.shells !== false) {
      Candy.shellMats ||= [candyShellMaterial(0.007, 2, this.rim), candyShellMaterial(0.015, 3, this.rim)];
      // shells share the shape but carry the colour of the outermost layer
      const g2 = new THREE.BufferGeometry();
      for (const k of ['position', 'normal', 'aWet', 'uv']) g2.setAttribute(k, g.attributes[k]);
      g2.setAttribute('color', new THREE.BufferAttribute(new Float32Array(N * 3).fill(1), 3));
      g2.setIndex(g.index);
      this.geo2 = g2;
      for (const sm of Candy.shellMats) { const s = new THREE.Mesh(g2, sm); s.renderOrder = 3; this.shells.push(s); this.group.add(s); }
    }
    this.group.add(this.core);
    // strands
    const cap = this.cap = opts.strands ?? 2600;
    this.PTS = 6;
    const nv = cap * (this.PTS - 1) * 2;
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
    sg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
    sg.setAttribute('aN', new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
    sg.setAttribute('aA', new THREE.BufferAttribute(new Float32Array(nv), 1));
    sg.setDrawRange(0, 0);
    this.sgeo = sg;
    this.strands = new THREE.LineSegments(sg, Candy.strandMat ||= strandMaterial());
    this.strands.renderOrder = 4; this.strands.frustumCulled = false;
    if (cap > 0) this.group.add(this.strands);
    this.sDir = new Float32Array(cap * this.PTS * 3); // directions of each strand point
    this.sR = new Float32Array(cap);       // absolute radius
    this.sAnchor = new Uint32Array(cap);
    this.sCount = 0; this.sHead = 0;
    this.elong = opts.elong ?? 1.22;
    this.dirty = true; this.sdirty = true;
    this.visibleMass = 0;
    this.core.visible = false;
    this.shells.forEach(s => s.visible = false);
  }

  get radius() { // effective mean radius in metres
    let s = 0; for (let i = 0; i < this.T.N; i++) s += this.r[i]; return s / this.T.N;
  }
  maxRadius() { let m = 0; for (let i = 0; i < this.T.N; i++) m = Math.max(m, this.r[i]); return m; }

  // dir: unit vector in candy-local space. vol: m^3 of fluff. col: THREE.Color (linear)
  deposit(dir, vol, col, spread = 0.75, key = 'x') {
    // big amounts are applied in small steps so growth stays proportional to the surface
    const Rm = Math.max(0.012, this.radius);
    const step = Math.max(2e-6, 4.19 * Rm * Rm * Rm * 0.12);
    if (vol > step * 1.01) { let left = vol; while (left > 1e-9) { const v = Math.min(step, left); this._deposit(dir, v, col, spread, key); left -= v; } return; }
    this._deposit(dir, vol, col, spread, key);
  }
  _deposit(dir, vol, col, spread, key) {
    const T = this.T, N = T.N;
    // while the cloud is still small the threads wrap all the way round the stick
    const R0 = this.radius;
    spread = spread + (2.4 - spread) * (1 - smooth(0.015, 0.07, R0));
    const cs = Math.cos(spread);
    let sumK = 0;
    const K = this._K || (this._K = new Float32Array(N));
    // threads wrap around the stick axis (local y): the kernel works on the angle around the axis,
    // with a broad falloff toward the poles -> egg / cloud shape, asymmetric where you swept
    const hl = Math.hypot(dir.x, dir.z) || 1;
    const hx = dir.x / hl, hz = dir.z / hl, vy = dir.y;
    for (let i = 0; i < N; i++) {
      const d = T.dirs[i];
      const dl = Math.hypot(d.x, d.z) || 1e-6;
      const dt = (d.x * hx + d.z * hz) / dl * Math.min(1, hl * 1.2) + d.y * vy;
      let k = dt > cs ? (dt - cs) / (1 - cs) : 0;
      const pole = Math.abs(d.y);
      k = k * k * (1 + 0.3 * this.lump[i]) * (1 - 0.55 * pole * pole * pole) * (0.35 + 0.65 * Math.min(1, dl * 1.6));
      K[i] = k; sumK += k;
    }
    if (sumK <= 0) return;
    const R = Math.max(0.006, this.radius);
    const area = 4 * Math.PI * R * R / N;
    for (let i = 0; i < N; i++) {
      if (K[i] <= 0) continue;
      const dr = vol * K[i] / (sumK * area);
      this.r[i] += dr;
      // colour layering
      const o = i * 3;
      const same = Math.abs(this.cOut[o] - col.r) + Math.abs(this.cOut[o + 1] - col.g) + Math.abs(this.cOut[o + 2] - col.b) < 0.04;
      if (same || this.tOut[i] === 0 && this.mass === 0) { this.tOut[i] += dr; this.cOut[o] = col.r; this.cOut[o + 1] = col.g; this.cOut[o + 2] = col.b; }
      else {
        const vis = smooth(0, 0.01, this.tOut[i]);
        this.cIn[o] += (this.cOut[o] - this.cIn[o]) * vis; this.cIn[o + 1] += (this.cOut[o + 1] - this.cIn[o + 1]) * vis; this.cIn[o + 2] += (this.cOut[o + 2] - this.cIn[o + 2]) * vis;
        this.cOut[o] = col.r; this.cOut[o + 1] = col.g; this.cOut[o + 2] = col.b; this.tOut[i] = dr;
      }
      // dry fluff covers wet syrup
      if (this.wet[i] > 0) this.wet[i] = Math.max(0, this.wet[i] - dr * 90);
    }
    if (this.mass === 0) { for (let i = 0; i < N; i++) { const o = i * 3; this.cIn[o] = col.r; this.cIn[o + 1] = col.g; this.cIn[o + 2] = col.b; } }
    this.mass += vol;
    this.shares.set(key, (this.shares.get(key) || 0) + vol);
    this.relax(1);
    // no spikes: a strand-cloud cannot stick out much further than its body
    const lim = this.radius * 1.55 + 0.012;
    for (let i = 0; i < N; i++) if (this.r[i] > lim) this.r[i] = lim;
    // new threads on the surface where it landed
    const nS = Math.max(1, Math.round(vol / 0.0000026));
    for (let s = 0; s < nS; s++) this.addStrand(dir, spread, col);
    this.dirty = true; this.sdirty = true;
    this.core.visible = true; this.shells.forEach(s => s.visible = true);
  }

  relax(it) {
    const T = this.T, N = T.N, r = this.r;
    const tmp = this._tmp || (this._tmp = new Float32Array(N));
    for (let k = 0; k < it; k++) {
      for (let i = 0; i < N; i++) { const nb = T.nb[i]; let s = 0; for (let j = 0; j < nb.length; j++) s += r[nb[j]]; tmp[i] = r[i] * 0.55 + s / nb.length * 0.45; }
      r.set(tmp);
    }
  }

  addStrand(dir, spread, col) {
    if (this.cap === 0) return;
    const T = this.T;
    // pick a random vertex in the deposit cap
    let i = 0, tries = 0;
    const cs = Math.cos(spread);
    do { i = (Math.random() * T.N) | 0; tries++; } while (tries < 40 && (T.dirs[i].dot(dir) < cs));
    const d0 = T.dirs[i];
    // arc around the stick axis (y) with a random tilt
    const axis = V(0, 1, 0).applyAxisAngle(d0, (Math.random() - 0.5) * 1.6).cross(d0).normalize().cross(d0).normalize();
    const len = 0.12 + Math.random() * 0.32;
    const s = this.sHead; this.sHead = (this.sHead + 1) % this.cap; this.sCount = Math.min(this.cap, this.sCount + 1);
    const q = new THREE.Quaternion();
    const wob = V();
    for (let k = 0; k < this.PTS; k++) {
      const a = (k / (this.PTS - 1) - 0.5) * len;
      q.setFromAxisAngle(axis, a);
      wob.copy(d0).applyQuaternion(q);
      wob.x += (Math.random() - 0.5) * 0.03; wob.y += (Math.random() - 0.5) * 0.03; wob.z += (Math.random() - 0.5) * 0.03;
      wob.normalize();
      this.sDir.set([wob.x, wob.y, wob.z], (s * this.PTS + k) * 3);
    }
    this.sR[s] = this.r[i] * (1.0 + Math.random() * 0.05) + 0.0015 + Math.random() * 0.003;
    this.sAnchor[s] = i;
    // colour lighter than the sugar (thin threads scatter light)
    const C = this.sgeo.attributes.color.array;
    const l = 0.02 + Math.random() * 0.14;
    for (let k = 0; k < (this.PTS - 1) * 2; k++) {
      const o = (s * (this.PTS - 1) * 2 + k) * 3;
      C[o] = col.r + (1 - col.r) * l; C[o + 1] = col.g + (1 - col.g) * l; C[o + 2] = col.b + (1 - col.b) * l;
    }
    this.sgeo.attributes.color.needsUpdate = true;
  }

  // water / humidity: shrink & melt where touched (dir local), amount 0..1 per call
  wetAt(dir, amount, spread = 0.6) {
    const T = this.T; const cs = Math.cos(spread);
    for (let i = 0; i < T.N; i++) {
      const dt = T.dirs[i].dot(dir);
      if (dt <= cs) continue;
      const k = (dt - cs) / (1 - cs);
      const w = Math.min(1 - this.wet[i], amount * k);
      if (w <= 0) continue;
      this.wet[i] += w;
      this.r[i] = Math.max(0.006, this.r[i] * (1 - 0.85 * w));
      this.tOut[i] *= (1 - 0.6 * w);
    }
    // strands near wet area melt in
    for (let s = 0; s < this.sCount; s++) {
      const a = this.sAnchor[s];
      if (this.wet[a] > 0.05) this.sR[s] = Math.min(this.sR[s], this.r[a] * 0.98);
    }
    this.dirty = true; this.sdirty = true;
  }

  // squash toward a direction (blown against a face)
  squash(dir, amount, spread = 1.2) {
    const T = this.T; const cs = Math.cos(spread);
    for (let i = 0; i < T.N; i++) {
      const dt = T.dirs[i].dot(dir);
      if (dt <= cs) continue;
      const k = (dt - cs) / (1 - cs);
      this.r[i] = Math.max(0.01, this.r[i] * (1 - amount * k));
    }
    this.dirty = true; this.sdirty = true;
  }

  // copy state from another candy (used for display copies)
  copyFrom(o) {
    this.r.set(o.r); this.wet.set(o.wet); this.cIn.set(o.cIn); this.cOut.set(o.cOut); this.tOut.set(o.tOut); this.lump.set(o.lump);
    this.mass = o.mass; this.shares = new Map(o.shares);
    const n = Math.min(this.cap, o.sCount);
    for (let k = 0; k < n; k++) {
      const s = (o.sHead - 1 - k + o.cap * 2) % o.cap;
      this.sDir.set(o.sDir.subarray(s * o.PTS * 3, (s + 1) * o.PTS * 3), k * this.PTS * 3);
      this.sR[k] = o.sR[s]; this.sAnchor[k] = o.sAnchor[s];
      const nn = (this.PTS - 1) * 2 * 3;
      this.sgeo.attributes.color.array.set(o.sgeo.attributes.color.array.subarray(s * nn, s * nn + nn), k * nn);
    }
    this.sCount = n; this.sHead = n % this.cap;
    this.sgeo.attributes.color.needsUpdate = true;
    this.dirty = this.sdirty = true;
    this.core.visible = o.mass > 0; this.shells.forEach(s => s.visible = o.mass > 0);
  }

  update() {
    if (!this.dirty && !this.sdirty) return;
    const T = this.T, N = T.N;
    const P = this.geo.attributes.position.array, C = this.geo.attributes.color.array;
    const C2 = this.geo2 ? this.geo2.attributes.color.array : null;
    const mean = this.radius;
    const lift = mean * 0.25;
    if (this.dirty) {
      for (let i = 0; i < N; i++) {
        const d = T.dirs[i];
        const rr = this.r[i] * (1 + 0.07 * this.lump[i] * smooth(0.01, 0.05, this.r[i]));
        P[i * 3] = d.x * rr; P[i * 3 + 1] = d.y * rr * this.elong + lift; P[i * 3 + 2] = d.z * rr;
        const o = i * 3;
        const vis = smooth(0, 0.03, this.tOut[i]);
        // core shows the deeper layers through the translucent outer fluff; shells show the newest layer
        for (let c = 0; c < 3; c++) {
          const v = this.cIn[o + c] + (this.cOut[o + c] - this.cIn[o + c]) * vis * 0.55; C[o + c] = v;
          if (C2) C2[o + c] = this.cOut[o + c];
        }
      }
      // soft gradient between colour bands (threads of both colours interleave at the border)
      const B = this._cb || (this._cb = new Float32Array(N * 3));
      for (const arr of [C, C2]) {
        if (!arr) continue;
        for (let pass = 0; pass < 2; pass++) {
          for (let i = 0; i < N; i++) {
            const nb = T.nb[i]; let r = 0, g = 0, b = 0;
            for (let j = 0; j < nb.length; j++) { const o = nb[j] * 3; r += arr[o]; g += arr[o + 1]; b += arr[o + 2]; }
            const o = i * 3, n = nb.length;
            B[o] = arr[o] * 0.4 + r / n * 0.6; B[o + 1] = arr[o + 1] * 0.4 + g / n * 0.6; B[o + 2] = arr[o + 2] * 0.4 + b / n * 0.6;
          }
          arr.set(B);
        }
      }
      this.geo.attributes.position.needsUpdate = true;
      this.geo.attributes.color.needsUpdate = true;
      if (this.geo2) { this.geo2.attributes.color.needsUpdate = true; this.geo2.boundingSphere = null; }
      this.geo.attributes.aWet.needsUpdate = true;
      this.geo.computeVertexNormals();
      this.geo.computeBoundingSphere();
      this.dirty = false;
    }
    if (this.sdirty && this.cap > 0) {
      const SP = this.sgeo.attributes.position.array, SN = this.sgeo.attributes.aN.array, SA = this.sgeo.attributes.aA.array;
      const PTS = this.PTS;
      let v = 0;
      for (let s = 0; s < this.sCount; s++) {
        const rr = this.sR[s];
        const w = this.wet[this.sAnchor[s]];
        const alpha = (0.28 + 0.34 * ((s * 7919) % 13) / 13) * (1 - w);
        for (let k = 0; k < PTS - 1; k++) {
          for (const kk of [k, k + 1]) {
            const o = (s * PTS + kk) * 3;
            const dx = this.sDir[o], dy = this.sDir[o + 1], dz = this.sDir[o + 2];
            SP[v * 3] = dx * rr; SP[v * 3 + 1] = dy * rr * this.elong + lift; SP[v * 3 + 2] = dz * rr;
            SN[v * 3] = dx; SN[v * 3 + 1] = dy; SN[v * 3 + 2] = dz;
            SA[v] = alpha; v++;
          }
        }
      }
      this.sgeo.setDrawRange(0, v);
      this.sgeo.attributes.position.needsUpdate = true;
      this.sgeo.attributes.aN.needsUpdate = true;
      this.sgeo.attributes.aA.needsUpdate = true;
      this.sdirty = false;
    }
  }

  // dominant colour keys with share > frac
  colorKeys(frac = 0.14) {
    const out = []; let tot = 0;
    for (const v of this.shares.values()) tot += v;
    for (const [k, v] of this.shares) if (v / tot >= frac) out.push(k);
    return out.sort();
  }
}
