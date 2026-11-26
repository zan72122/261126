// fx.js — lit point-sprite particles with varied size/motion: falling snow, brushed powder, snow clumps,
// steam, water spray/drops, breath, sparkles.
import * as THREE from 'three';
import { C, L } from './core.js';

function spriteTex(kind) {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  if (kind === 'soft') {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  } else if (kind === 'puff') {
    for (let i = 0; i < 14; i++) {
      const x = 32 + (Math.random() - .5) * 26, y = 32 + (Math.random() - .5) * 26, r = 8 + Math.random() * 14;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    }
    const id = g.getImageData(0, 0, 64, 64);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const d = Math.hypot(x - 32, y - 32) / 32; id.data[(y * 64 + x) * 4 + 3] *= Math.max(0, 1 - d * d); }
    g.putImageData(id, 0, 0);
  } else if (kind === 'clump') {
    g.fillStyle = 'rgba(255,255,255,1)';
    for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(32 + (Math.random() - .5) * 22, 32 + (Math.random() - .5) * 22, 7 + Math.random() * 9, 0, Math.PI * 2); g.fill(); }
    const id = g.getImageData(0, 0, 64, 64);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
      const i = (y * 64 + x) * 4; const shade = 0.75 + 0.25 * (1 - y / 64) + (Math.random() - .5) * 0.1;
      id.data[i] *= shade; id.data[i + 1] *= shade; id.data[i + 2] *= Math.min(1, shade + 0.05);
    }
    g.putImageData(id, 0, 0);
  } else if (kind === 'flake') {
    g.translate(32, 32);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, 30);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.beginPath();
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, r = 20 + Math.random() * 12; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const VS = `
  attribute float size; attribute float alpha; attribute vec3 tint; attribute float rot;
  uniform float pscale; varying float vA; varying vec3 vTint; varying float vRot; varying float vFog;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(size * pscale / -mv.z, 0.0, 256.0);
    vA = alpha * smoothstep(0.0, 1.5, gl_PointSize) ; vTint = tint; vRot = rot;
    vFog = 1.0 - exp(-0.006 * 0.006 * mv.z * mv.z);
  }`;
const FS = `
  uniform sampler2D map; uniform vec3 lightCol; uniform vec3 ambCol; uniform float lit; uniform vec3 fogCol;
  varying float vA; varying vec3 vTint; varying float vRot; varying float vFog;
  void main(){
    vec2 p = gl_PointCoord - 0.5;
    float c = cos(vRot), s = sin(vRot);
    p = vec2(c*p.x - s*p.y, s*p.x + c*p.y) + 0.5;
    vec4 t = texture2D(map, p);
    vec3 light = mix(vec3(1.0), ambCol + lightCol * (0.55 + 0.45 * (1.0 - p.y)), lit);
    vec3 col = t.rgb * vTint * light;
    col = mix(col, fogCol, vFog * 0.8);
    gl_FragColor = vec4(col * t.a * vA, t.a * vA);
  }`;

export class Particles {
  constructor(max, { tex = 'soft', lit = 1, additive = false, depthTest = true } = {}) {
    this.max = max; this.n = 0;
    this.pos = new Float32Array(max * 3); this.vel = new Float32Array(max * 3);
    this.size = new Float32Array(max); this.alpha = new Float32Array(max); this.tint = new Float32Array(max * 3);
    this.rot = new Float32Array(max); this.life = new Float32Array(max); this.age = new Float32Array(max);
    this.grow = new Float32Array(max); this.a0 = new Float32Array(max); this.drag = new Float32Array(max); this.grav = new Float32Array(max);
    this.spin = new Float32Array(max); this.kind = new Uint8Array(max);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('tint', new THREE.BufferAttribute(this.tint, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('rot', new THREE.BufferAttribute(this.rot, 1).setUsage(THREE.DynamicDrawUsage));
    this.geo = g;
    this.mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: spriteTex(tex) }, pscale: { value: 800 }, lightCol: { value: new THREE.Color(1, 1, 1) }, ambCol: { value: new THREE.Color(0.3, 0.35, 0.5) }, lit: { value: lit }, fogCol: { value: new THREE.Color() } },
      vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, depthTest,
      blending: additive ? THREE.AdditiveBlending : THREE.CustomBlending,
      blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    });
    this.points = new THREE.Points(g, this.mat);
    this.points.frustumCulled = false;
    this.onDeath = null;
    this.onLand = null;
    this.floor = () => 0;
    C.scene.add(this.points);
  }
  emit(o) {
    if (this.n >= this.max) this.kill(0);
    const i = this.n++;
    const p = o.p, v = o.v || [0, 0, 0];
    this.pos.set([p.x ?? p[0], p.y ?? p[1], p.z ?? p[2]], i * 3);
    this.vel.set([v.x ?? v[0], v.y ?? v[1], v.z ?? v[2]], i * 3);
    this.size[i] = o.size ?? 0.05; this.grow[i] = o.grow ?? 0; this.life[i] = o.life ?? 1; this.age[i] = 0;
    this.a0[i] = o.alpha ?? 1; this.alpha[i] = 0; this.drag[i] = o.drag ?? 0.5; this.grav[i] = o.grav ?? 0;
    const c = o.tint || [1, 1, 1]; this.tint.set(c, i * 3);
    this.rot[i] = Math.random() * 6.28; this.spin[i] = o.spin ?? (Math.random() - 0.5) * 2; this.kind[i] = o.kind ?? 0;
    return i;
  }
  kill(i) {
    const j = --this.n;
    if (i !== j) {
      this.pos.copyWithin(i * 3, j * 3, j * 3 + 3); this.vel.copyWithin(i * 3, j * 3, j * 3 + 3); this.tint.copyWithin(i * 3, j * 3, j * 3 + 3);
      for (const a of [this.size, this.alpha, this.rot, this.life, this.age, this.grow, this.a0, this.drag, this.grav, this.spin, this.kind]) a[i] = a[j];
    }
  }
  update(dt) {
    const P = this.pos, V = this.vel;
    for (let i = this.n - 1; i >= 0; i--) {
      this.age[i] += dt;
      const t = this.age[i] / this.life[i];
      if (t >= 1) { if (this.onDeath) this.onDeath(i); this.kill(i); continue; }
      const k = Math.exp(-this.drag[i] * dt);
      V[i * 3] *= k; V[i * 3 + 1] = V[i * 3 + 1] * k - this.grav[i] * dt; V[i * 3 + 2] *= k;
      P[i * 3] += V[i * 3] * dt; P[i * 3 + 1] += V[i * 3 + 1] * dt; P[i * 3 + 2] += V[i * 3 + 2] * dt;
      if (this.onLand && V[i * 3 + 1] < 0) {
        const f = this.floor(P[i * 3], P[i * 3 + 2], P[i * 3 + 1]);
        if (P[i * 3 + 1] < f) { if (this.onLand(i, P[i * 3], P[i * 3 + 1], P[i * 3 + 2]) !== false) { this.kill(i); continue; } P[i * 3 + 1] = f; V[i * 3 + 1] *= -0.2; V[i * 3] *= 0.5; V[i * 3 + 2] *= 0.5; }
      }
      this.size[i] += this.grow[i] * dt;
      this.rot[i] += this.spin[i] * dt;
      const fi = Math.min(1, t * 8), fo = 1 - Math.max(0, (t - 0.6) / 0.4);
      this.alpha[i] = this.a0[i] * fi * fo;
    }
    const g = this.geo;
    g.setDrawRange(0, this.n);
    for (const k of ['position', 'size', 'alpha', 'tint', 'rot']) g.attributes[k].needsUpdate = true;
    const u = this.mat.uniforms;
    u.pscale.value = C.renderer.domElement.height * C.camera.projectionMatrix.elements[5] * 0.5;
    u.lightCol.value.copy(L.key.color).multiplyScalar(L.key.intensity * 0.45);
    u.ambCol.value.copy(L.hemi.color).multiplyScalar(0.6 + L.hemi.intensity);
    u.fogCol.value.copy(C.scene.fog.color);
  }
}

export const FX = {};
export function initFx() {
  FX.snow = new Particles(1400, { tex: 'flake', lit: 1 });
  FX.powder = new Particles(900, { tex: 'puff', lit: 1 });
  FX.clump = new Particles(500, { tex: 'clump', lit: 1 });
  FX.steam = new Particles(700, { tex: 'puff', lit: 1 });
  FX.drops = new Particles(1200, { tex: 'soft', lit: 0.4 });
  FX.spark = new Particles(300, { tex: 'flake', lit: 0, additive: true });
  FX.snowRate = 1;
}
const rnd = (a, b) => a + Math.random() * (b - a);
let snowAcc = 0;
export function updateFx(dt) {
  // ambient snowfall around the camera: varied flake sizes, slow tumbling drift
  const cam = C.camera.position;
  snowAcc += dt * 260 * FX.snowRate;
  while (snowAcc > 1) {
    snowAcc--;
    const r = rnd(0.6, 14), a = rnd(0, Math.PI * 2);
    const big = Math.random() < 0.08;
    FX.snow.emit({ p: [cam.x + Math.cos(a) * r, cam.y + rnd(2, 6), cam.z + Math.sin(a) * r], v: [rnd(-0.2, 0.3), -rnd(0.5, 1.1), rnd(-0.2, 0.2)],
      size: big ? rnd(0.02, 0.03) : rnd(0.006, 0.016), life: rnd(5, 9), alpha: rnd(0.5, 0.95), drag: 0.0, grav: 0, tint: [0.95, 0.97, 1], spin: rnd(-2, 2) });
  }
  // gentle sway
  const P = FX.snow.pos, V = FX.snow.vel, t = C.time;
  for (let i = 0; i < FX.snow.n; i++) { V[i * 3] += Math.sin(t * 1.3 + i) * 0.004; V[i * 3 + 2] += Math.cos(t * 1.1 + i * 0.7) * 0.004; }
  for (const k of ['snow', 'powder', 'clump', 'steam', 'drops', 'spark']) FX[k].update(dt);
}
export function puff(p, n = 8, s = 1, tint = [1, 1, 1]) {
  for (let i = 0; i < n; i++) FX.powder.emit({ p: [p.x + rnd(-.05, .05) * s, p.y + rnd(-.05, .05) * s, p.z + rnd(-.05, .05) * s], v: [rnd(-.5, .5) * s, rnd(-.1, .6) * s, rnd(-.5, .5) * s], size: rnd(0.04, 0.12) * s, grow: rnd(0.1, 0.4) * s, life: rnd(0.6, 1.6), alpha: rnd(0.25, 0.6), drag: 2.5, grav: 0.3, tint });
}
export function steam(p, n = 3, warm = 1) {
  for (let i = 0; i < n; i++) FX.steam.emit({ p: [p.x + rnd(-.04, .04), p.y + rnd(0, .04), p.z + rnd(-.04, .04)], v: [rnd(-.12, .12), rnd(0.3, 0.7), rnd(-.12, .12)], size: rnd(0.03, 0.08), grow: rnd(0.08, 0.22), life: rnd(1.0, 2.0), alpha: rnd(0.1, 0.24), drag: 1.2, grav: -0.15, tint: [1, 0.97 + 0.03 * (1 - warm), 0.94 + 0.06 * (1 - warm)] });
}
export function breath(p, dir) {
  for (let i = 0; i < 4; i++) FX.steam.emit({ p: [p.x, p.y, p.z], v: [dir.x * rnd(0.25, 0.45) + rnd(-.05, .05), dir.y * 0.3 + rnd(0.0, 0.08), dir.z * rnd(0.25, 0.45) + rnd(-.05, .05)], size: rnd(0.02, 0.04), grow: rnd(0.1, 0.18), life: rnd(0.9, 1.4), alpha: rnd(0.16, 0.28), drag: 1.6, grav: -0.05 });
}
export function sparkle(p, n = 12, s = 1) {
  for (let i = 0; i < n; i++) FX.spark.emit({ p: [p.x + rnd(-.2, .2) * s, p.y + rnd(-.1, .3) * s, p.z + rnd(-.2, .2) * s], v: [rnd(-.6, .6) * s, rnd(0.2, 1.2) * s, rnd(-.6, .6) * s], size: rnd(0.02, 0.06) * s, life: rnd(0.6, 1.4), alpha: 1, drag: 1.5, grav: 0.4, tint: [1.0, 0.85, 0.55], spin: rnd(-6, 6) });
}
