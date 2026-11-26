// Cotton cloth: verlet particle sim (gravity, wind, wetness = weight), ties (gathered bundles bound by twine),
// and a GPU dye field per cloth (leuco indigo -> oxidised indigo, pink, wetness) that soaks in only where the
// cloth is really under the liquid, creeps along the weave while wet, and fades a little as it dries.
import * as THREE from '../vendor/three.module.min.js';
import { PERTURB } from './shaderlib.js';

const V3 = THREE.Vector3;

// ---------------------------------------------------------------- shapes (uv in 0..1, v downward)
export const SHAPES = {
  tee: {
    w: 0.52, h: 0.46, nx: 35, ny: 31,
    inside(u, v) {
      const x = Math.abs(u - 0.5);
      const top = 0.035 + Math.max(0, x - 0.1) * 0.16;
      if (v < top) return false;
      // neck
      if (x < 0.1 && v < 0.035 + Math.sqrt(Math.max(0, 0.01 - x * x)) * 0.75) return false;
      if (x <= 0.29) return v <= 0.995;
      // sleeves: slanted bottom
      const sleeveBottom = 0.33 - (x - 0.29) * 0.6;
      return x <= 0.5 && v <= sleeveBottom;
    },
    pins: [[0.27, 0.06], [0.73, 0.06]], wear: 'top',
    neck(u, v) { const x = u - 0.5; const d = Math.hypot(x, (v - 0.035) / 0.75); return d < 0.13 && v < 0.16 ? 1 : 0; },
  },
  square: {
    w: 0.36, h: 0.36, nx: 25, ny: 25,
    inside(u, v) { return u >= 0.0 && u <= 1 && v >= 0 && v <= 1; },
    pins: [[0.03, 0.03], [0.97, 0.03]], wear: 'scarf',
  },
  shirt: {
    w: 0.96, h: 0.78, nx: 37, ny: 31,
    inside(u, v) {
      const x = Math.abs(u - 0.5);
      const top = 0.04 + Math.max(0, x - 0.09) * 0.12;
      if (v < top) return false;
      if (x < 0.075 && v < 0.04 + Math.sqrt(Math.max(0, 0.0056 - x * x)) * 0.7) return false;
      if (x <= 0.26) return v <= 0.99;
      const sleeveBottom = 0.33 - (x - 0.26) * 0.35;
      return x <= 0.5 && v <= sleeveBottom;
    },
    pins: [[0.28, 0.07], [0.72, 0.07]], wear: 'top',
  },
};

// ---------------------------------------------------------------- dye GPU field
const DYE_SIM_FRAG = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tState, tResist, tSub, tNoise;
uniform vec2 uTexel; uniform float uDt, uDry, uDiff, uOx, uSubmergedAny;
uniform vec4 uStamp[8]; uniform vec4 uStampC[8]; uniform int uNStamp;
uniform vec2 uDrift;
void main(){
  vec4 s = texture2D(tState, vUv);
  float res = texture2D(tResist, vUv).r;
  vec2 sub = texture2D(tSub, vUv).rg;
  float nz = texture2D(tNoise, vUv * 3.0).r;
  // --- wicking along the weave (anisotropic, blocked by bindings & folds)
  vec4 sum = vec4(0.0); float wsum = 0.0;
  vec2 o[4]; o[0] = vec2(uTexel.x, 0.0); o[1] = vec2(-uTexel.x, 0.0); o[2] = vec2(0.0, uTexel.y); o[3] = vec2(0.0, -uTexel.y);
  float cond0 = s.a * (1.0 - res) * (0.45 + 0.9 * nz);
  for (int i = 0; i < 4; i++) {
    vec4 n = texture2D(tState, vUv + o[i] - uDrift * uDt);
    float rn = texture2D(tResist, vUv + o[i]).r;
    float c = clamp(min(cond0, n.a * (1.0 - rn)) * (i < 2 ? 1.2 : 0.85), 0.0, 1.0);
    sum.rgb += (n.rgb - s.rgb) * c; wsum += c;
  }
  s.rgb += sum.rgb * uDiff;
  // gravity drift of loose dye while very wet (hanging)
  // --- uptake where submerged: indigo arrives as yellow-green leuco form, pink is direct
  float uptake = (1.0 - res) * (1.0 - res);
  float capI = 1.35 - (s.r + s.g * 0.75);
  s.r += sub.r * uptake * uDt * 0.42 * max(capI, 0.0) * (0.75 + 0.5 * nz);
  s.b += sub.g * uptake * uDt * 0.34 * max(1.05 - s.b, 0.0) * (0.8 + 0.4 * nz);
  float wetIn = max(sub.r, sub.g);
  s.a = max(s.a, wetIn);
  // --- splash stamps (papa's accident etc.)
  for (int i = 0; i < 8; i++) {
    if (i >= uNStamp) break;
    vec2 d = (vUv - uStamp[i].xy) / uStamp[i].zw;
    float r = length(d);
    float edge = r + (nz - 0.5) * 0.6;
    float a = smoothstep(1.0, 0.55, edge);
    s.r = max(s.r, min(s.r + a * uStampC[i].r, 1.5)); s.b = max(s.b, min(s.b + a * uStampC[i].b, 1.1)); s.a = max(s.a, a * uStampC[i].a);
  }
  // --- oxidation in air (green -> blue), slower while submerged
  float ox = s.r * uOx * uDt * (1.0 - 0.9 * wetIn);
  s.r -= ox; s.g += ox;
  // --- drying in the wind
  s.a = max(0.0, s.a - uDry * uDt * (1.0 - wetIn));
  gl_FragColor = clamp(s, 0.0, 2.0);
}`;

const SUB_VERT = /* glsl */`
varying vec3 vW;
void main(){ vW = position; gl_Position = vec4(uv * 2.0 - 1.0, 0.0, 1.0); }`;
const SUB_FRAG = /* glsl */`
precision highp float;
varying vec3 vW;
uniform vec4 uTub[2]; // x, z, radius, level
uniform float uTubOn[2];
void main(){
  float a = 0.0, b = 0.0;
  {
    vec2 d = vW.xz - uTub[0].xy; float inside = step(length(d), uTub[0].z) * step(vW.y, uTub[0].w) * uTubOn[0];
    a = inside;
  }
  {
    vec2 d = vW.xz - uTub[1].xy; float inside = step(length(d), uTub[1].z) * step(vW.y, uTub[1].w) * uTubOn[1];
    b = inside;
  }
  gl_FragColor = vec4(a, b, 0.0, 1.0);
}`;

let FSQ = null;
function fsq() {
  if (FSQ) return FSQ;
  const scene = new THREE.Scene(); const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); mesh.frustumCulled = false; scene.add(mesh);
  FSQ = { scene, cam, mesh };
  return FSQ;
}

function noiseTex() {
  const n = 128, d = new Uint8Array(n * n * 4);
  // smooth-ish value noise with streaks along the weave
  const r = []; for (let i = 0; i < 32 * 32; i++) r.push(Math.random());
  const at = (x, y) => r[((y & 31) * 32) + (x & 31)];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const fx = x / 4, fy = y / 4, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const v = (at(ix, iy) * (1 - sx) + at(ix + 1, iy) * sx) * (1 - sy) + (at(ix, iy + 1) * (1 - sx) + at(ix + 1, iy + 1) * sx) * sy;
    const g = Math.random() * 0.25 + v * 0.75;
    d.set([g * 255, g * 255, g * 255, 255], (y * n + x) * 4);
  }
  const t = new THREE.DataTexture(d, n, n); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.needsUpdate = true;
  return t;
}
let NOISE = null;

export class DyeField {
  constructor(renderer, size = 256) {
    this.r = renderer; this.size = size;
    const opt = { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping };
    this.a = new THREE.WebGLRenderTarget(size, size, opt);
    this.b = new THREE.WebGLRenderTarget(size, size, opt);
    this.sub = new THREE.WebGLRenderTarget(128, 128, { type: THREE.UnsignedByteType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
    NOISE = NOISE || noiseTex();
    // resist map (CPU canvas)
    this.resCanvas = document.createElement('canvas'); this.resCanvas.width = this.resCanvas.height = 128;
    this.resist = new THREE.CanvasTexture(this.resCanvas); this.resist.flipY = false; this.resist.minFilter = THREE.LinearFilter; this.resist.generateMipmaps = false;
    this.clearResist();
    this.simMat = new THREE.ShaderMaterial({
      uniforms: {
        tState: { value: null }, tResist: { value: this.resist }, tSub: { value: this.sub.texture }, tNoise: { value: NOISE },
        uTexel: { value: new THREE.Vector2(1 / size, 1 / size) }, uDt: { value: 0 }, uDry: { value: 0.01 }, uDiff: { value: 0.12 }, uOx: { value: 0.55 },
        uSubmergedAny: { value: 0 }, uStamp: { value: Array.from({ length: 8 }, () => new THREE.Vector4()) },
        uStampC: { value: Array.from({ length: 8 }, () => new THREE.Vector4()) }, uNStamp: { value: 0 }, uDrift: { value: new THREE.Vector2() },
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: DYE_SIM_FRAG, depthTest: false, depthWrite: false,
    });
    this.subMat = new THREE.ShaderMaterial({
      uniforms: { uTub: { value: [new THREE.Vector4(), new THREE.Vector4()] }, uTubOn: { value: [0, 0] } },
      vertexShader: SUB_VERT, fragmentShader: SUB_FRAG, side: THREE.DoubleSide, depthTest: false, depthWrite: false,
    });
    this.subScene = new THREE.Scene(); this.subCam = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    this.stamps = [];
    this.reset();
  }

  reset() {
    const prev = this.r.getRenderTarget();
    this.r.setClearColor(0x000000, 0);
    for (const t of [this.a, this.b]) { this.r.setRenderTarget(t); this.r.clear(true, false, false); }
    this.r.setRenderTarget(prev);
    this.clearResist();
  }

  clearResist() {
    const g = this.resCanvas.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 128, 128); this.resist.needsUpdate = true;
  }

  get texture() { return this.a.texture; }

  step(dt, clothGeo, tubs, opts = {}) {
    const r = this.r, prev = r.getRenderTarget();
    // 1) where is the cloth under the liquid?
    let anySub = 0;
    if (clothGeo && tubs) {
      const u = this.subMat.uniforms;
      tubs.forEach((tb, i) => { u.uTub.value[i].set(tb.x, tb.z, tb.innerR, tb.liquidY); u.uTubOn.value[i] = tb.on ? 1 : 0; });
      if (!this.subMesh) { this.subMesh = new THREE.Mesh(clothGeo, this.subMat); this.subMesh.frustumCulled = false; this.subScene.add(this.subMesh); }
      r.setRenderTarget(this.sub); r.setClearColor(0x000000, 1); r.clear(true, false, false);
      r.render(this.subScene, this.subCam);
    }
    // 2) diffuse / uptake / oxidise / dry
    const F = fsq(); F.mesh.material = this.simMat;
    const u = this.simMat.uniforms;
    u.uDt.value = dt; u.uDry.value = opts.dry ?? 0.01; u.uDiff.value = opts.diff ?? 0.14; u.uDrift.value.set(0, 0);
    const n = Math.min(8, this.stamps.length); u.uNStamp.value = n;
    for (let i = 0; i < n; i++) { u.uStamp.value[i].copy(this.stamps[i][0]); u.uStampC.value[i].copy(this.stamps[i][1]); }
    this.stamps.splice(0, n);
    u.tState.value = this.a.texture;
    r.setRenderTarget(this.b); r.render(F.scene, F.cam);
    [this.a, this.b] = [this.b, this.a];
    r.setRenderTarget(prev);
  }

  stamp(u, v, ru, rv, leuco, pink, wet = 1) {
    this.stamps.push([new THREE.Vector4(u, v, ru, rv), new THREE.Vector4(leuco, 0, pink, wet)]);
  }

  // resist from ties: bound rings stay white, folds inside the bundle give radial streaks
  paintResist(ties, shape) {
    const g = this.resCanvas.getContext('2d'); const N = 128;
    const img = g.createImageData(N, N); const d = img.data;
    const W = shape.w, H = shape.h;
    const res = new Float32Array(N * N);
    for (const t of ties) {
      const seed = t.seed;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const du = (x / N - t.u) * W, dv = (y / N - t.v) * H;
        const dist = Math.hypot(du, dv);
        if (dist > t.R * 1.35) continue;
        const a = Math.atan2(dv, du);
        // fold streaks radiating from the pinch point
        const k = 9 + (seed % 5);
        const streak = 0.5 + 0.5 * Math.sin(a * k + Math.sin(a * 3 + seed) * 2.2 + dist * 40);
        const streak2 = 0.5 + 0.5 * Math.sin(a * (k * 2 + 3) + seed * 1.7 + dist * 25);
        let r = 0;
        if (dist < t.R) {
          const inner = dist / t.R;
          r = (0.22 + 0.5 * Math.pow(streak * streak2, 1.4)) * (0.35 + 0.65 * Math.min(1, inner * 2.2));
          // exposed tip of the pinch takes dye
          if (dist < t.R * 0.12) r *= 0.3;
        } else {
          r = 0.35 * Math.pow(streak, 3) * (1 - (dist - t.R) / (t.R * 0.35));
        }
        for (let k2 = 0; k2 < t.wraps; k2++) {
          const rk = t.R * (0.3 + 0.2 * k2);
          const wob = 0.006 + 0.0025 * Math.sin(a * 5 + seed + k2);
          const ring = Math.exp(-Math.pow((dist - rk) / wob, 2));
          r = Math.max(r, ring * (0.94 + 0.06 * streak2));
        }
        const i = y * N + x; res[i] = Math.max(res[i], r);
      }
    }
    for (let i = 0; i < N * N; i++) { const v = Math.min(255, res[i] * 255); d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = v; d[i * 4 + 3] = 255; }
    g.putImageData(img, 0, 0);
    this.resist.needsUpdate = true;
  }
}

// ---------------------------------------------------------------- dyed cotton material
export function makeDyeMaterial(T, dyeTex, alphaTex, opts = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.9, sheen: 0.3, sheenRoughness: 0.7, sheenColor: new THREE.Color(0.55, 0.55, 0.55),
    side: THREE.DoubleSide, alphaTest: alphaTex ? 0.5 : 0, alphaMap: alphaTex || null,
    normalMap: T.clothN, normalScale: new THREE.Vector2(0.6, 0.6),
  });
  const U = {
    tDye: { value: dyeTex }, tWeave: { value: T.clothH }, uWeaveRep: { value: opts.rep || new THREE.Vector2(30, 30) },
    uSunDir: { value: opts.sunDir || new THREE.Vector3(0, 1, 0) }, uSunCol: { value: new THREE.Color(1.0, 0.86, 0.7).multiplyScalar(3.0) },
    tDetail: { value: opts.detail || null }, uHasDetail: { value: opts.detail ? 1 : 0 }, uGlow: { value: 0 }, uBase: { value: new THREE.Color().setRGB(0.86, 0.855, 0.83) }, uPlain: { value: 0 }, uPlainCol: { value: new THREE.Color(1, 1, 1) },
  };
  m.userData.dye = U;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vDyeUv;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvDyeUv = uv;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec2 vDyeUv; uniform sampler2D tDye; uniform sampler2D tWeave; uniform vec2 uWeaveRep;
        uniform sampler2D tDetail; uniform float uHasDetail; uniform vec3 uSunDir; uniform vec3 uSunCol; uniform float uGlow; uniform vec3 uBase; uniform float uPlain; uniform vec3 uPlainCol;
        float gWet; vec3 gDyeCol;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        {
          vec4 s = texture2D(tDye, vDyeUv);
          float h = texture2D(tWeave, vDyeUv * uWeaveRep).r;
          float wet = clamp(s.a, 0.0, 1.0); gWet = wet;
          float dk = (0.72 + 0.42 * wet) * (0.78 + 0.44 * (1.0 - h));
          vec3 A = s.r * vec3(0.75, 0.22, 1.9) + s.g * vec3(2.9, 1.75, 0.55) + s.b * vec3(0.16, 1.55, 0.62);
          vec3 dt3 = uHasDetail > 0.5 ? texture2D(tDetail, vDyeUv).rgb : vec3(0.0);
          vec3 base = mix(uBase, uPlainCol, uPlain) * (0.94 + 0.08 * h) * (1.0 - 0.06 * dt3.r - 0.22 * dt3.g);
          vec3 col = base * exp(-A * dk * (1.0 - 0.18 * dt3.r));
          col *= 1.0 - 0.22 * wet;
          gDyeCol = col;
          diffuseColor.rgb *= col;
        }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = mix(0.9, 0.42, gWet);`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
        {
          // thin cotton lets the sun through (stronger when dry & light coloured)
          float back = max(dot(-normal, normalize((viewMatrix * vec4(uSunDir, 0.0)).xyz)), 0.0);
          reflectedLight.directDiffuse += gDyeCol * uSunCol * back * 0.16 * (1.0 - 0.4 * gWet);
          reflectedLight.indirectSpecular *= 1.0 + gWet * 0.8;
        }`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        totalEmissiveRadiance += vec3(1.0, 0.95, 0.8) * uGlow * 0.35;`);
  };
  m.customProgramCacheKey = () => 'dye' + (alphaTex ? 'a' : '');
  return m;
}

// ---------------------------------------------------------------- cloth
function alphaTexture(shape) {
  const N = 256, cv = document.createElement('canvas'); cv.width = cv.height = N;
  const g = cv.getContext('2d'); const img = g.createImageData(N, N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let s = 0; // 2x2 supersample
    for (let k = 0; k < 4; k++) s += shape.inside((x + 0.25 + (k & 1) * 0.5) / N, (y + 0.25 + (k >> 1) * 0.5) / N) ? 1 : 0;
    const i = (y * N + x) * 4; img.data[i] = img.data[i + 1] = img.data[i + 2] = s * 63.75; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv); t.flipY = false;
  return t;
}

function detailTexture(shape) {
  // hems, stitching and collar rib, from the silhouette (R: hem band, G: stitch line, B: rib)
  const N = 256, cv = document.createElement('canvas'); cv.width = cv.height = N;
  const g = cv.getContext('2d'); const img = g.createImageData(N, N);
  const W = shape.w, H = shape.h;
  const dirs = []; for (let a = 0; a < 12; a++) dirs.push([Math.cos(a / 12 * Math.PI * 2), Math.sin(a / 12 * Math.PI * 2)]);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const u = (x + 0.5) / N, v = (y + 0.5) / N; const i = (y * N + x) * 4;
    if (!shape.inside(u, v)) { img.data[i + 3] = 255; continue; }
    // distance to the edge in metres (coarse ray march)
    let dmin = 0.03;
    for (const [dx, dy] of dirs) for (let r = 0.002; r < dmin; r += 0.002) { if (!shape.inside(u + dx * r / W, v + dy * r / H)) { dmin = r; break; } }
    const hem = dmin < 0.016 ? 1 : 0;
    const stitch = Math.abs(dmin - 0.012) < 0.0012 && (Math.floor((u * W + v * H) / 0.003) % 2 === 0) ? 1 : 0;
    const neck = shape.neck ? shape.neck(u, v) : 0;
    const rib = neck ? 0.5 + 0.5 * Math.sin(u * W / 0.0016) : 0;
    img.data[i] = hem * 255; img.data[i + 1] = stitch * 255; img.data[i + 2] = neck * 255; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv); t.flipY = false;
  return t;
}

export class Cloth {
  constructor(kind, renderer, T, opts = {}) {
    const S = this.shape = SHAPES[kind]; this.kind = kind;
    const nx = S.nx, ny = S.ny; this.nx = nx; this.ny = ny;
    // particles where the shape (dilated by a cell) exists
    const keep = new Int32Array(nx * ny).fill(-1);
    const rest = []; const uv = [];
    const du = 1 / (nx - 1), dv = 1 / (ny - 1);
    const near = (u, v) => { for (const a of [-0.6, 0, 0.6]) for (const b of [-0.6, 0, 0.6]) if (S.inside(u + a * du, v + b * dv)) return true; return false; };
    let n = 0;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const u = i * du, v = j * dv;
      if (!near(u, v)) continue;
      keep[j * nx + i] = n++; rest.push([(u - 0.5) * S.w, v * S.h]); uv.push(u, v);
    }
    this.n = n; this.keep = keep;
    this.rest = rest; // 2D rest coords (x across, y down) in metres
    this.pos = new Float32Array(n * 3); this.prev = new Float32Array(n * 3);
    this.invMass = new Float32Array(n).fill(1);
    // constraints
    const C = []; const L = [];
    const idx = (i, j) => (i >= 0 && j >= 0 && i < nx && j < ny ? keep[j * nx + i] : -1);
    const addC = (a, b, stiff) => { if (a < 0 || b < 0) return; C.push(a, b); L.push(Math.hypot(rest[a][0] - rest[b][0], rest[a][1] - rest[b][1]), stiff); };
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const a = idx(i, j); if (a < 0) continue;
      addC(a, idx(i + 1, j), 1); addC(a, idx(i, j + 1), 1);
      addC(a, idx(i + 1, j + 1), 0.6); addC(idx(i + 1, j), idx(i, j + 1), 0.6);
      addC(a, idx(i + 2, j), 0.25); addC(a, idx(i, j + 2), 0.25);
    }
    this.cA = new Int32Array(C); this.cL = new Float32Array(L.filter((_, k) => k % 2 === 0)); this.cS = new Float32Array(L.filter((_, k) => k % 2 === 1));
    // triangles
    const tri = [];
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = idx(i, j), b = idx(i + 1, j), c = idx(i, j + 1), d = idx(i + 1, j + 1);
      if (a >= 0 && b >= 0 && c >= 0 && d >= 0) { tri.push(a, c, b, b, c, d); }
      else if (a >= 0 && b >= 0 && c >= 0) tri.push(a, c, b);
      else if (b >= 0 && c >= 0 && d >= 0) tri.push(b, c, d);
      else if (a >= 0 && c >= 0 && d >= 0) tri.push(a, c, d);
      else if (a >= 0 && b >= 0 && d >= 0) tri.push(a, d, b);
    }
    this.tri = new Uint32Array(tri);
    const geo = this.geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geo.setIndex(new THREE.BufferAttribute(this.tri, 1));
    this.uv = new Float32Array(uv);
    this.dye = new DyeField(renderer, 256);
    this.alpha = alphaTexture(S);
    this.detail = detailTexture(S);
    const rep = new THREE.Vector2(S.w / 0.014, S.h / 0.014);
    T.clothN.repeat.set(1, 1);
    this.mat = makeDyeMaterial(T, this.dye.texture, this.alpha, { rep, sunDir: opts.sunDir, detail: this.detail });
    this.normalMap = T.clothN;
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.castShadow = true; this.mesh.receiveShadow = true; this.mesh.frustumCulled = false;
    this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaMap: this.alpha, alphaTest: 0.5 });
    // per-cloth normal-map repeat via a cloned texture
    const nmap = T.clothN.clone(); nmap.repeat.copy(rep); nmap.needsUpdate = true; this.mat.normalMap = nmap;
    this.pins = []; this.ties = []; this.colliders = [];
    this.wet = 0; this.wind = new V3(); this.time = 0; this.damping = 0.985;
    this.gravityScale = 1;
    this.rings = new THREE.Group();
    this.twineMat = opts.twineMat;
  }

  // lay the cloth flat on a surface: origin = centre of cloth, rotY = heading of the cloth's "down" (v) axis
  layFlat(origin, rotY, y) {
    const c = Math.cos(rotY), s = Math.sin(rotY);
    const cy = this.shape.h / 2;
    for (let k = 0; k < this.n; k++) {
      const x = this.rest[k][0], z = this.rest[k][1] - cy;
      // slightly compressed with soft lumps, so the cotton settles into natural folds
      const n1 = Math.sin(x * 23 + z * 7 + this.n) * Math.sin(z * 19 - x * 5);
      const xc = x * 0.95 + 0.006 * Math.sin(z * 31), zc = z * 0.96 + 0.006 * Math.sin(x * 27);
      const wx = origin.x + xc * c + zc * s, wz = origin.z - xc * s + zc * c;
      this.pos[k * 3] = wx; this.pos[k * 3 + 1] = y + 0.002 + Math.max(0, n1) * 0.016; this.pos[k * 3 + 2] = wz;
    }
    this.prev.set(this.pos);
    this.layRot = rotY; this.layOrigin = origin.clone();
  }

  hangAt(points) {
    // place the cloth hanging straight below its pin points
    const [p0, p1] = points; const S = this.shape;
    const a = this.pinIndex(S.pins[0]), b = this.pinIndex(S.pins[1]);
    const ra = this.rest[a], rb = this.rest[b];
    for (let k = 0; k < this.n; k++) {
      const t = (this.rest[k][0] - ra[0]) / (rb[0] - ra[0]);
      const base = new V3().lerpVectors(p0, p1, t);
      this.pos[k * 3] = base.x; this.pos[k * 3 + 1] = base.y - (this.rest[k][1] - ra[1]); this.pos[k * 3 + 2] = base.z + 0.002 * Math.sin(k);
    }
    this.prev.set(this.pos);
  }

  pinIndex(uv) {
    let best = 0, bd = 1e9;
    for (let k = 0; k < this.n; k++) { const d = Math.hypot(this.uv[k * 2] - uv[0], this.uv[k * 2 + 1] - uv[1]); if (d < bd) { bd = d; best = k; } }
    return best;
  }

  nearestVertex(p) {
    let best = -1, bd = 1e9;
    for (let k = 0; k < this.n; k++) { const dx = this.pos[k * 3] - p.x, dy = this.pos[k * 3 + 1] - p.y, dz = this.pos[k * 3 + 2] - p.z; const d = dx * dx + dy * dy + dz * dz; if (d < bd) { bd = d; best = k; } }
    return best;
  }

  vertex(k, out = new V3()) { return out.set(this.pos[k * 3], this.pos[k * 3 + 1], this.pos[k * 3 + 2]); }

  centroid(out = new V3()) {
    out.set(0, 0, 0); for (let k = 0; k < this.n; k++) { out.x += this.pos[k * 3]; out.y += this.pos[k * 3 + 1]; out.z += this.pos[k * 3 + 2]; }
    return out.multiplyScalar(1 / this.n);
  }

  // ---------------------------------------------------------------- ties
  addTie(k) {
    const R = this.kind === 'shirt' ? 0.1 : 0.07;
    const c = this.rest[k];
    // an existing tie close by gets another wrap
    for (const t of this.ties) {
      const d = Math.hypot(this.rest[t.c][0] - c[0], this.rest[t.c][1] - c[1]);
      if (d < t.R * 0.6) { if (t.wraps < 4) { t.wraps++; t.wrapAnim = 0; this.dirtyResist = true; return { tie: t, added: true }; } return { tie: t, added: false }; }
    }
    const members = [];
    for (let i = 0; i < this.n; i++) {
      const d = Math.hypot(this.rest[i][0] - c[0], this.rest[i][1] - c[1]);
      if (d < R && i !== k) members.push([i, d, Math.atan2(this.rest[i][1] - c[1], this.rest[i][0] - c[0])]);
    }
    const t = { c: k, R, wraps: 1, members, u: this.uv[k * 2], v: this.uv[k * 2 + 1], seed: Math.floor(Math.random() * 1000), axis: new V3(0, 1, 0), wrapAnim: 0, open: 0, rings: [] };
    this.ties.push(t);
    this.dirtyResist = true;
    return { tie: t, added: true, isNew: true };
  }

  untie(t) { t.releasing = true; }

  ensureRings() {
    if (!this.twineMat) return;
    for (const t of this.ties) {
      while (t.rings.length < t.wraps) {
        const g = new THREE.TorusGeometry(1, 0.11, 6, 22);
        const m = new THREE.Mesh(g, this.twineMat); m.castShadow = true; m.scale.setScalar(0.001);
        this.rings.add(m); t.rings.push(m);
      }
    }
  }

  // ---------------------------------------------------------------- simulation
  simulate(dt, env) {
    this.time += dt;
    const sub = 2, h = dt / sub, P = this.pos, Pp = this.prev, n = this.n;
    const wet = this.wet;
    const g = -9.8 * this.gravityScale;
    const windK = 0.9 * (1 - 0.8 * wet);
    for (let s = 0; s < sub; s++) {
      // integrate
      const damp = this.damping - wet * 0.01;
      for (let k = 0; k < n; k++) {
        if (this.invMass[k] === 0) continue;
        const i = k * 3;
        let ax = 0, ay = g, az = 0;
        // buoyancy & drag in liquid
        const inLiquid = env && env.liquidAt ? env.liquidAt(P[i], P[i + 1], P[i + 2]) : 0;
        let dmp = damp;
        if (inLiquid) { ay *= 0.08; dmp = 0.9; }
        // wind with per-vertex flutter
        if (env && env.wind && !inLiquid) {
          const fl = Math.sin(this.time * 7.3 + this.uv[k * 2] * 9 + this.uv[k * 2 + 1] * 5) * 0.5 + Math.sin(this.time * 13.1 + this.uv[k * 2 + 1] * 13) * 0.3;
          ax += env.wind.x * windK * (1 + fl * 0.6); az += env.wind.z * windK * (1 + fl * 0.6); ay += env.wind.y * windK + fl * windK * 0.8 * env.windAmt;
        }
        const x = P[i], y = P[i + 1], z = P[i + 2];
        P[i] = x + (x - Pp[i]) * dmp + ax * h * h;
        P[i + 1] = y + (y - Pp[i + 1]) * dmp + ay * h * h;
        P[i + 2] = z + (z - Pp[i + 2]) * dmp + az * h * h;
        Pp[i] = x; Pp[i + 1] = y; Pp[i + 2] = z;
      }
      // constraints
      const iters = 9;
      for (let it = 0; it < iters; it++) {
        const A = this.cA, Lr = this.cL, St = this.cS;
        for (let c = 0, m = Lr.length; c < m; c++) {
          const a = A[c * 2] * 3, b = A[c * 2 + 1] * 3;
          const dx = P[b] - P[a], dy = P[b + 1] - P[a + 1], dz = P[b + 2] - P[a + 2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-9;
          const wa = this.invMass[a / 3], wb = this.invMass[b / 3], ws = wa + wb; if (ws === 0) continue;
          let diff = (d - Lr[c]) / d;
          // cotton barely stretches but buckles freely under compression (keeps soft folds)
          if (diff < 0) diff *= St[c] === 1 ? 0.12 : 0.05;
          diff *= St[c];
          const fa = diff * wa / ws, fb = diff * wb / ws;
          P[a] += dx * fa; P[a + 1] += dy * fa; P[a + 2] += dz * fa;
          P[b] -= dx * fb; P[b + 1] -= dy * fb; P[b + 2] -= dz * fb;
        }
        if (it % 3 === 2) this.applyTies(0.35);
        this.applyPins();
      }
      this.applyTies(0.6);
      this.longRange();
      this.collide(env);
      this.applyPins();
    }
    this.updateMesh();
  }

  // long-range attachments: nothing may drift further from a held/pinned point than the cloth allows
  longRange() {
    const P = this.pos; this.lra = this.lra || {};
    for (const p of this.pins) {
      let R = this.lra[p.k];
      if (!R) { R = this.lra[p.k] = new Float32Array(this.n); const a = this.rest[p.k]; for (let i = 0; i < this.n; i++) R[i] = Math.hypot(this.rest[i][0] - a[0], this.rest[i][1] - a[1]) * 1.03 + 0.004; }
      const kx = p.target.x, ky = p.target.y, kz = p.target.z;
      for (let i = 0; i < this.n; i++) {
        const j = i * 3; const dx = P[j] - kx, dy = P[j + 1] - ky, dz = P[j + 2] - kz;
        const d2 = dx * dx + dy * dy + dz * dz, m = R[i];
        if (d2 > m * m) { const s = m / Math.sqrt(d2); P[j] = kx + dx * s; P[j + 1] = ky + dy * s; P[j + 2] = kz + dz * s; }
      }
    }
  }

  applyPins() {
    const P = this.pos;
    for (const p of this.pins) {
      const i = p.k * 3, s = p.stiff ?? 1;
      P[i] += (p.target.x - P[i]) * s; P[i + 1] += (p.target.y - P[i + 1]) * s; P[i + 2] += (p.target.z - P[i + 2]) * s;
      // neighbours follow a little so a pinched point looks like fingers holding a fold
    }
  }

  applyTies(k) {
    const P = this.pos;
    const ax = new V3(), cen = new V3(), tmp = new V3();
    for (const t of this.ties) {
      const open = t.open; if (open >= 1) continue;
      const strength = k * (1 - open);
      // axis: from base ring centroid to the pinch tip
      cen.set(0, 0, 0); let cnt = 0;
      for (const [i, d] of t.members) if (d > t.R * 0.7) { cen.x += P[i * 3]; cen.y += P[i * 3 + 1]; cen.z += P[i * 3 + 2]; cnt++; }
      if (cnt) cen.multiplyScalar(1 / cnt);
      const tip = tmp.set(P[t.c * 3], P[t.c * 3 + 1], P[t.c * 3 + 2]);
      ax.copy(tip).sub(cen); let L = ax.length();
      if (L < 1e-4 || t.flatUp) { ax.set(0, 1, 0); } else ax.multiplyScalar(1 / L);
      if (t.preferUp) { ax.lerp(new V3(0, 1, 0), 0.3).normalize(); }
      t.axis.copy(ax);
      const colH = t.R * 0.85;
      // lift the tip to the column height above the base
      if (cnt) {
        const want = cen.clone().addScaledVector(ax, colH);
        P[t.c * 3] += (want.x - P[t.c * 3]) * strength; P[t.c * 3 + 1] += (want.y - P[t.c * 3 + 1]) * strength; P[t.c * 3 + 2] += (want.z - P[t.c * 3 + 2]) * strength;
      }
      const tipNow = new V3(P[t.c * 3], P[t.c * 3 + 1], P[t.c * 3 + 2]);
      const colR = 0.016 + 0.004 * t.wraps * 0;
      for (const [i, d, ang] of t.members) {
        const along = (d / t.R) * colH; // distance down from the tip
        const q = new V3(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]);
        const target = tipNow.clone().addScaledVector(ax, -along);
        // radial offset clamped to the column radius (keep current direction around the axis)
        const off = q.clone().sub(target); off.addScaledVector(ax, -off.dot(ax));
        const ol = off.length(); const rr = colR * (0.6 + 0.6 * Math.abs(Math.sin(ang * 3 + t.seed)));
        if (ol > rr) off.multiplyScalar(rr / ol);
        if (ol < 1e-5) off.set(Math.cos(ang), 0, Math.sin(ang)).multiplyScalar(rr * 0.5);
        target.add(off);
        const w = strength * (d < t.R * 0.85 ? 1 : 0.35);
        P[i * 3] += (target.x - q.x) * w; P[i * 3 + 1] += (target.y - q.y) * w; P[i * 3 + 2] += (target.z - q.z) * w;
      }
      t.tipPos = tipNow;
    }
  }

  collide(env) {
    if (!env || !env.floorAt) return;
    const P = this.pos, Pp = this.prev;
    for (let k = 0; k < this.n; k++) {
      const i = k * 3;
      const f = env.floorAt(P[i], P[i + 2], P[i + 1]);
      if (P[i + 1] < f) {
        P[i + 1] = f;
        // friction
        Pp[i] = P[i] - (P[i] - Pp[i]) * 0.3; Pp[i + 2] = P[i + 2] - (P[i + 2] - Pp[i + 2]) * 0.3;
      }
      if (env.wallClamp) env.wallClamp(P, i);
    }
  }

  updateMesh() {
    this.geo.attributes.position.needsUpdate = true;
    this.geo.computeVertexNormals();
    this.geo.computeBoundingSphere();
    // twine rings around each tie
    this.ensureRings();
    for (const t of this.ties) {
      t.wrapAnim = Math.min(1, t.wrapAnim + 0.06);
      const tip = t.tipPos || this.vertex(t.c);
      for (let k = 0; k < t.rings.length; k++) {
        const ring = t.rings[k];
        if (t.releasing && k >= t.wraps) continue;
        const rk = t.R * (0.3 + 0.2 * k);
        const along = (rk / t.R) * t.R * 0.85;
        ring.position.copy(tip).addScaledVector(t.axis, -along);
        ring.quaternion.setFromUnitVectors(new V3(0, 0, 1), t.axis);
        const grow = k === t.wraps - 1 ? t.wrapAnim : 1;
        const s = 0.019 * (0.6 + 0.4 * grow);
        ring.scale.set(s, s, 0.026 * grow + 0.004);
        ring.visible = k < t.wraps;
      }
    }
  }

  setWetFromField() { /* wet scalar is managed by the game (cheap) */ }
}
