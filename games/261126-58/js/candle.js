// Pillar candle with a shader flame, glow halo and a flickering point light (optionally shadowed).
import * as THREE from 'three';

const FLAME_VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FLAME_FS = `
uniform float uT, uLit, uSway; varying vec2 vUv;
void main(){
  vec2 p = vUv * 2.0 - 1.0;          // x in [-1,1], y in [-1,1] (base at -1)
  float y = p.y * 0.5 + 0.5;          // 0 base .. 1 tip
  float sway = uSway * y * y;
  float x = p.x - sway;
  float w = 0.55 * pow(max(1.0 - y, 0.0), 0.75) * smoothstep(0.0, 0.28, y) + 0.001;
  float d = abs(x) / w;
  float body = smoothstep(1.0, 0.25, d) * smoothstep(1.0, 0.82, y) * smoothstep(0.0, 0.08, y);
  float core = smoothstep(0.6, 0.0, d) * smoothstep(0.62, 0.18, y) * smoothstep(0.05, 0.2, y);
  float blue = smoothstep(0.7, 0.0, d) * smoothstep(0.22, 0.04, y) * smoothstep(0.0, 0.05, y);
  vec3 col = vec3(1.0, 0.42, 0.08) * body * 3.0 + vec3(1.0, 0.86, 0.55) * core * 7.0 + vec3(0.2, 0.35, 1.0) * blue * 1.2;
  float a = clamp(body + core + blue * 0.5, 0.0, 1.0) * uLit;
  gl_FragColor = vec4(col * a, a);
}`;
const HALO_FS = `
uniform float uLit, uI; varying vec2 vUv;
void main(){ float r = length(vUv * 2.0 - 1.0); float g = exp(-r * r * 9.0) * 0.8 + exp(-r * 3.5) * 0.12; g *= smoothstep(1.0, 0.7, r);
  gl_FragColor = vec4(vec3(1.0, 0.55, 0.2) * g * uLit * uI, 1.0); }`;

export class Candle {
  constructor(opt = {}) {
    const r = opt.radius || 0.026, h = opt.height || 0.075;
    this.h = h;
    this.group = new THREE.Group();
    const wax = new THREE.MeshPhysicalMaterial({ color: 0xf3e7cf, roughness: 0.55, sheen: 0.5, sheenColor: new THREE.Color(0xfff0d8), clearcoat: 0.15 });
    this.waxU = { uLitW: { value: 0 } };
    wax.onBeforeCompile = (sh) => {
      sh.uniforms.uLitW = this.waxU.uLitW;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vYw;').replace('#include <begin_vertex>', `#include <begin_vertex>\nvYw = position.y / ${h.toFixed(4)} + 0.5;`);
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vYw; uniform float uLitW;')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += vec3(1.0,0.5,0.18) * uLitW * pow(smoothstep(0.35, 1.0, vYw), 2.0) * 0.9;');
    };
    // pillar with a slightly melted, dished top
    const prof = [];
    prof.push(new THREE.Vector2(0.0001, -h / 2));
    prof.push(new THREE.Vector2(r, -h / 2));
    for (let i = 0; i <= 8; i++) prof.push(new THREE.Vector2(r * (1 - 0.01 * i / 8), -h / 2 + h * i / 8));
    prof.push(new THREE.Vector2(r * 0.97, h / 2 + 0.002));
    prof.push(new THREE.Vector2(r * 0.85, h / 2 - 0.003));
    prof.push(new THREE.Vector2(r * 0.4, h / 2 - 0.006));
    prof.push(new THREE.Vector2(0.0001, h / 2 - 0.0065));
    const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), wax);
    body.castShadow = false; body.receiveShadow = true;
    body.position.y = h / 2;
    this.group.add(body);
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.0009, 0.0011, 0.012, 6), new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.9 }));
    wick.position.y = h - 0.0005; wick.rotation.z = 0.15;
    this.group.add(wick);
    this.flameU = { uT: { value: 0 }, uLit: { value: 0 }, uSway: { value: 0 } };
    this.flame = new THREE.Mesh(new THREE.PlaneGeometry(0.016, 0.042), new THREE.ShaderMaterial({
      vertexShader: FLAME_VS, fragmentShader: FLAME_FS, uniforms: this.flameU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.flame.position.y = h + 0.018;
    this.flame.renderOrder = 10;
    this.group.add(this.flame);
    this.haloU = { uLit: this.flameU.uLit, uI: { value: opt.halo !== undefined ? opt.halo : 1 } };
    this.halo = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), new THREE.ShaderMaterial({
      vertexShader: FLAME_VS, fragmentShader: HALO_FS, uniforms: this.haloU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.halo.position.y = h + 0.016; this.halo.renderOrder = 11;
    this.group.add(this.halo);
    this.light = new THREE.PointLight(0xff9440, 0, 6, 2);
    this.light.position.y = h + 0.02;
    this.baseI = opt.intensity || 1.6;
    if (opt.shadow) {
      this.light.castShadow = true;
      this.light.shadow.mapSize.set(opt.shadowSize || 512, opt.shadowSize || 512);
      this.light.shadow.camera.near = 0.01; this.light.shadow.camera.far = 7;
      this.light.shadow.bias = -0.004; this.light.shadow.radius = 3;
      this.light.shadow.camera.layers.set(2); // only the lantern shell casts candle shadows
    }
    this.group.add(this.light);
    this.lit = 0; this.target = 0; this.seed = Math.random() * 100;
  }
  setLit(on) { this.target = on ? 1 : 0; }
  update(t, dt, camera) {
    this.lit += (this.target - this.lit) * Math.min(1, dt * 3);
    const s = this.seed;
    const n = Math.sin(t * 9.1 + s) * 0.5 + Math.sin(t * 15.3 + s * 2) * 0.3 + Math.sin(t * 23.7 + s * 3) * 0.2;
    const gust = Math.max(0, Math.sin(t * 0.7 + s)) ** 6;
    const f = 0.88 + 0.1 * n - 0.15 * gust;
    this.light.intensity = this.baseI * this.lit * f;
    this.flameU.uLit.value = this.lit; this.flameU.uT.value = t;
    this.flameU.uSway.value = 0.12 * Math.sin(t * 5.3 + s) + 0.18 * gust * Math.sin(t * 13);
    this.flame.scale.set(1, 0.9 + 0.12 * n, 1);
    this.light.position.x = 0.002 * Math.sin(t * 7.7 + s) + this.flameU.uSway.value * 0.01;
    this.light.position.z = 0.002 * Math.cos(t * 6.3 + s);
    this.waxU.uLitW.value = this.lit * f;
    if (camera) {
      // cylindrical billboard
      const wp = new THREE.Vector3(); this.flame.getWorldPosition(wp);
      const cp = camera.position;
      const ang = Math.atan2(cp.x - wp.x, cp.z - wp.z);
      const pr = new THREE.Quaternion(); this.group.getWorldQuaternion(pr);
      const yaw = new THREE.Euler().setFromQuaternion(pr, 'YXZ').y;
      this.flame.rotation.y = ang - yaw; this.halo.rotation.y = ang - yaw;
      // halo faces camera fully
      this.halo.lookAt(cp);
    }
  }
}
