// particles: sand grains (lit, varied size), dust puffs, rock chips, soft sparkles
import * as THREE from 'three';
import { scene, rng } from './core.js';
import { SUN_DIR } from './env.js';

const R = rng(9);
const MAXG = 2600;
const gPos = new Float32Array(MAXG * 3), gCol = new Float32Array(MAXG * 3), gSize = new Float32Array(MAXG);
const gVel = new Float32Array(MAXG * 3), gLife = new Float32Array(MAXG), gKind = new Uint8Array(MAXG);
let gHead = 0;
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(gPos, 3).setUsage(THREE.DynamicDrawUsage));
geo.setAttribute('color', new THREE.BufferAttribute(gCol, 3).setUsage(THREE.DynamicDrawUsage));
geo.setAttribute('size', new THREE.BufferAttribute(gSize, 1).setUsage(THREE.DynamicDrawUsage));
const grainMat = new THREE.ShaderMaterial({
  uniforms: { sun: { value: SUN_DIR }, scale: { value: 800 } },
  vertexShader: `attribute float size; attribute vec3 color; varying vec3 vC; varying float vS;
    uniform float scale;
    void main(){ vC = color; vec4 mv = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*mv;
      gl_PointSize = max(1.0, size*scale/ -mv.z); vS = size; }`,
  fragmentShader: `varying vec3 vC; varying float vS;
    void main(){ vec2 d = gl_PointCoord-.5; float r = length(d); if(r>.5) discard;
      // tiny lit sphere: bright sun side, darker away
      vec3 n = normalize(vec3(d.x*2., -d.y*2., sqrt(max(0.,1.-4.*r*r))));
      float l = clamp(dot(n, normalize(vec3(.35,.7,.6))), 0., 1.);
      vec3 c = vC*(.45 + 1.25*l);
      gl_FragColor = vec4(c, smoothstep(.5,.35,r)); }`,
  transparent: true, depthWrite: false,
});
const points = new THREE.Points(geo, grainMat);
points.frustumCulled = false;

// dust puffs (soft billboards)
const MAXD = 90;
const dPos = new Float32Array(MAXD * 3), dA = new Float32Array(MAXD), dS = new Float32Array(MAXD);
const dVel = new Float32Array(MAXD * 3), dLife = new Float32Array(MAXD), dMax = new Float32Array(MAXD);
let dHead = 0;
const dGeo = new THREE.BufferGeometry();
dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3).setUsage(THREE.DynamicDrawUsage));
dGeo.setAttribute('alpha', new THREE.BufferAttribute(dA, 1).setUsage(THREE.DynamicDrawUsage));
dGeo.setAttribute('size', new THREE.BufferAttribute(dS, 1).setUsage(THREE.DynamicDrawUsage));
const dustMat = new THREE.ShaderMaterial({
  uniforms: { scale: { value: 800 }, col: { value: new THREE.Color(0.95, 0.8, 0.6) } },
  vertexShader: `attribute float size; attribute float alpha; varying float vA;
    uniform float scale; void main(){ vA = alpha; vec4 mv = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*mv; gl_PointSize = size*scale/ -mv.z; }`,
  fragmentShader: `varying float vA; uniform vec3 col;
    float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
    void main(){ vec2 d = gl_PointCoord-.5; float r = length(d);
      float a = smoothstep(.5,.0,r); a*=a; a *= .75 + .25*sin(d.x*13.+d.y*7.);
      gl_FragColor = vec4(col*1.6, a*vA); }`,
  transparent: true, depthWrite: false,
});
const dust = new THREE.Points(dGeo, dustMat);
dust.frustumCulled = false;

export function initFx() { scene.add(points, dust); }
export function setFxScale(px) { grainMat.uniforms.scale.value = px; dustMat.uniforms.scale.value = px; }

const SAND_COLS = [[0.82, 0.62, 0.40], [0.74, 0.52, 0.32], [0.9, 0.78, 0.6], [0.6, 0.42, 0.28], [0.95, 0.9, 0.82], [0.55, 0.32, 0.2]];
export function spawnGrains(p, dir, n, o = {}) {
  for (let i = 0; i < n; i++) {
    const k = gHead; gHead = (gHead + 1) % MAXG;
    const sp = (o.speed || 0.6) * (0.4 + R() * 0.9);
    gPos[k * 3] = p.x + (R() - 0.5) * (o.spread || 0.04); gPos[k * 3 + 1] = p.y + R() * 0.01; gPos[k * 3 + 2] = p.z + (R() - 0.5) * (o.spread || 0.04);
    gVel[k * 3] = dir.x * sp + (R() - 0.5) * 0.35 * sp; gVel[k * 3 + 1] = (o.up ?? 0.9) * sp * (0.5 + R()); gVel[k * 3 + 2] = dir.z * sp + (R() - 0.5) * 0.35 * sp;
    const c = o.color || SAND_COLS[(R() * SAND_COLS.length) | 0];
    const v = 0.85 + R() * 0.3;
    gCol[k * 3] = c[0] * v; gCol[k * 3 + 1] = c[1] * v; gCol[k * 3 + 2] = c[2] * v;
    gSize[k] = (o.size || 0.0022) * (0.4 + R() ** 2 * 2.2);
    gLife[k] = 1.2 + R() * 0.8; gKind[k] = o.kind || 0;
  }
}
export function spawnDust(p, n, o = {}) {
  for (let i = 0; i < n; i++) {
    const k = dHead; dHead = (dHead + 1) % MAXD;
    dPos[k * 3] = p.x + (R() - 0.5) * 0.05; dPos[k * 3 + 1] = p.y + 0.01; dPos[k * 3 + 2] = p.z + (R() - 0.5) * 0.05;
    dVel[k * 3] = (R() - 0.5) * 0.12 + (o.dx || 0); dVel[k * 3 + 1] = 0.05 + R() * 0.1; dVel[k * 3 + 2] = (R() - 0.5) * 0.12 + (o.dz || 0);
    dS[k] = (o.size || 0.06) * (0.6 + R() * 0.8);
    dMax[k] = dLife[k] = 1.2 + R() * 1.2;
    dA[k] = o.alpha || 0.22;
  }
}
// ground height callback for grains to settle on
let groundFn = () => 0;
export function setGround(fn) { groundFn = fn; }
export function updateFx(dt) {
  for (let k = 0; k < MAXG; k++) {
    if (gLife[k] <= 0) { if (gSize[k] > 0) { gSize[k] = 0; } continue; }
    gLife[k] -= dt;
    let vy = gVel[k * 3 + 1] - 9.8 * dt;
    let x = gPos[k * 3] + gVel[k * 3] * dt, y = gPos[k * 3 + 1] + vy * dt, z = gPos[k * 3 + 2] + gVel[k * 3 + 2] * dt;
    const gy = groundFn(x, z);
    if (y < gy) { y = gy; vy = 0; gVel[k * 3] *= 0.3; gVel[k * 3 + 2] *= 0.3; if (gLife[k] > 0.4) gLife[k] = 0.4; }
    gVel[k * 3 + 1] = vy * (1 - dt * 0.5);
    gPos[k * 3] = x; gPos[k * 3 + 1] = y; gPos[k * 3 + 2] = z;
    if (gLife[k] <= 0) gSize[k] = 0;
  }
  geo.attributes.position.needsUpdate = true; geo.attributes.size.needsUpdate = true; geo.attributes.color.needsUpdate = true;
  for (let k = 0; k < MAXD; k++) {
    if (dLife[k] <= 0) { dA[k] = 0; continue; }
    dLife[k] -= dt;
    const t = 1 - dLife[k] / dMax[k];
    dPos[k * 3] += dVel[k * 3] * dt + 0.03 * dt; dPos[k * 3 + 1] += dVel[k * 3 + 1] * dt; dPos[k * 3 + 2] += dVel[k * 3 + 2] * dt;
    dVel[k * 3 + 1] *= 1 - dt * 0.8;
    dS[k] += dt * 0.08;
    dA[k] = Math.sin(Math.min(1, t * 3) * Math.PI / 2) * (1 - t) * 0.3;
  }
  dGeo.attributes.position.needsUpdate = true; dGeo.attributes.alpha.needsUpdate = true; dGeo.attributes.size.needsUpdate = true;
}
