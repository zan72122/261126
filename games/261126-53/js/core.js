// core: renderer, filmic post (ACES + light DOF), lens framing, lazy PBR textures, input
import * as THREE from 'three';

export const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export const easeOut = t => { t = clamp(t, 0, 1); return 1 - (1 - t) ** 3; };
export const easeInOut = t => { t = clamp(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; };
export const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));
export function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ------------------------------------------------------------------ renderer
export const canvas = document.getElementById('c');
export const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping; // done in our composite
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 900);
export const MAX_ANISO = Math.min(8, renderer.capabilities.getMaxAnisotropy());

// ------------------------------------------------------------------ post
let rtScene = null, rtBlur = null;
const quadGeo = new THREE.BufferGeometry();
quadGeo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const vsQuad = `in vec3 position; out vec2 vUv; void main(){ vUv = position.xy*.5+.5; gl_Position = vec4(position.xy,0.,1.); }`;
export const post = {
  focus: 3.0, aperture: 0.06, exposure: 0.88, vignette: 0.22,
};
const blurMat = new THREE.RawShaderMaterial({
  glslVersion: THREE.GLSL3,
  uniforms: { tCol: { value: null }, tDep: { value: null }, texel: { value: new THREE.Vector2() }, near: { value: .05 }, far: { value: 900 }, focus: { value: 3 }, aperture: { value: .06 } },
  vertexShader: vsQuad,
  fragmentShader: `precision highp float; in vec2 vUv; out vec4 o;
  uniform sampler2D tCol, tDep; uniform vec2 texel; uniform float near, far, focus, aperture;
  float lin(float d){ float z=d*2.-1.; return 2.*near*far/(far+near-z*(far-near)); }
  float coc(vec2 uv){ float z=lin(texture(tDep,uv).r); return clamp(abs(z-focus)/max(z,.001)*aperture*9.,0.,1.); }
  void main(){
    vec3 acc=vec3(0.); float wsum=0.;
    float c0=coc(vUv);
    const int N=12;
    for(int i=0;i<N;i++){
      float a=float(i)*2.39996; float r=sqrt((float(i)+.5)/float(N));
      vec2 off=vec2(cos(a),sin(a))*r*texel*5.5;
      vec2 uv=vUv+off;
      float ci=coc(uv);
      float w=max(ci, c0*.4)+.02;
      acc+=texture(tCol,uv).rgb*w; wsum+=w;
    }
    o=vec4(acc/wsum, c0);
  }`,
  depthTest: false, depthWrite: false,
});
const compMat = new THREE.RawShaderMaterial({
  glslVersion: THREE.GLSL3,
  uniforms: { tCol: { value: null }, tBlur: { value: null }, tDep: { value: null }, near: { value: .05 }, far: { value: 900 }, focus: { value: 3 }, aperture: { value: .06 }, exposure: { value: 1 }, vig: { value: .22 }, aspect: { value: 1 }, time: { value: 0 }, fade: { value: 0 } },
  vertexShader: vsQuad,
  fragmentShader: `precision highp float; in vec2 vUv; out vec4 o;
  uniform sampler2D tCol, tBlur, tDep; uniform float near, far, focus, aperture, exposure, vig, aspect, time, fade;
  float lin(float d){ float z=d*2.-1.; return 2.*near*far/(far+near-z*(far-near)); }
  vec3 RRTAndODTFit(vec3 v){ vec3 a=v*(v+.0245786)-.000090537; vec3 b=v*(.983729*v+.4329510)+.238081; return a/b; }
  vec3 aces(vec3 c){
    const mat3 I=mat3(vec3(.59719,.07600,.02840),vec3(.35458,.90834,.13383),vec3(.04823,.01566,.83777));
    const mat3 O=mat3(vec3(1.60475,-.10208,-.00327),vec3(-.53108,1.10813,-.07276),vec3(-.07367,-.00605,1.07602));
    c*=exposure/.6; c=I*c; c=RRTAndODTFit(c); c=O*c; return clamp(c,0.,1.);
  }
  vec3 srgb(vec3 c){ return mix(c*12.92, 1.055*pow(c,vec3(1./2.4))-.055, step(.0031308,c)); }
  float hash(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
  void main(){
    vec3 sharp=texture(tCol,vUv).rgb;
    float z=lin(texture(tDep,vUv).r);
    float c=clamp(abs(z-focus)/max(z,.001)*aperture*9.,0.,1.);
    vec4 b=texture(tBlur,vUv);
    vec3 col=mix(sharp,b.rgb,smoothstep(.08,.7,max(c,b.a*.5)));
    col=aces(col);
    vec2 q=vUv-.5; q.x*=mix(1.,aspect,.5);
    col*=1.-vig*smoothstep(.25,.9,length(q));
    col=srgb(col);
    col+= (hash(vUv*vec2(1733.,977.)+time)-.5)/255.*1.5;
    col=mix(col, vec3(.98,.95,.88), fade);
    o=vec4(col,1.);
  }`,
  depthTest: false, depthWrite: false,
});
const quad = new THREE.Mesh(quadGeo, blurMat); quad.frustumCulled = false;

// ------------------------------------------------------------------ sizing / adaptive resolution
export const view = { w: 1, h: 1, aspect: 1, dpr: 1, scale: 1 };
let pixelBudget = 1.9e6;
export function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  const dprMax = Math.min(window.devicePixelRatio || 1, 2.5);
  let dpr = Math.min(dprMax, Math.sqrt(pixelBudget / (w * h)));
  dpr = Math.max(dpr, 0.6);
  view.w = w; view.h = h; view.aspect = w / h; view.dpr = dpr;
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  const W = Math.round(w * dpr), H = Math.round(h * dpr);
  if (rtScene) { rtScene.dispose(); rtBlur.dispose(); }
  const dt = new THREE.DepthTexture(W, H); dt.type = THREE.UnsignedIntType;
  rtScene = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4, depthTexture: dt, colorSpace: THREE.LinearSRGBColorSpace });
  rtBlur = new THREE.WebGLRenderTarget(Math.ceil(W / 2), Math.ceil(H / 2), { type: THREE.HalfFloatType });
  blurMat.uniforms.texel.value.set(1 / rtBlur.width, 1 / rtBlur.height);
  camera.aspect = view.aspect; camera.updateProjectionMatrix();
  applyLens();
}
// adaptive quality: lower pixel budget if frame time is bad
let ftAcc = 0, ftN = 0, lastAdj = 0;
export function perfSample(dt, now) {
  ftAcc += dt; ftN++;
  if (now - lastAdj > 2.5 && ftN > 40) {
    const avg = ftAcc / ftN; ftAcc = 0; ftN = 0; lastAdj = now;
    if (avg > 1 / 32 && pixelBudget > 0.55e6) { pixelBudget *= 0.75; resize(); }
    else if (avg < 1 / 55 && pixelBudget < 1.9e6) { pixelBudget = Math.min(1.9e6, pixelBudget * 1.15); resize(); }
  }
}

export function render(time) {
  // shadow & scene into HDR target
  renderer.setRenderTarget(rtScene);
  renderer.render(scene, camera);
  const u = blurMat.uniforms;
  u.tCol.value = rtScene.texture; u.tDep.value = rtScene.depthTexture;
  u.near.value = camera.near; u.far.value = camera.far; u.focus.value = post.focus; u.aperture.value = post.aperture;
  quad.material = blurMat;
  renderer.setRenderTarget(rtBlur);
  renderer.render(quad, postCam);
  const c = compMat.uniforms;
  c.tCol.value = rtScene.texture; c.tBlur.value = rtBlur.texture; c.tDep.value = rtScene.depthTexture;
  c.near.value = camera.near; c.far.value = camera.far; c.focus.value = post.focus; c.aperture.value = post.aperture;
  c.exposure.value = post.exposure; c.vig.value = post.vignette; c.aspect.value = view.aspect; c.time.value = time % 10;
  c.fade.value = post.fade || 0;
  quad.material = compMat;
  renderer.setRenderTarget(null);
  renderer.render(quad, postCam);
}

// ------------------------------------------------------------------ lens / framing
// A shot = what must be visible (center + half extents in camera plane), looking direction yaw,
// and camera eye height. Focal length ~40mm full-frame equivalent (diagonal 58deg).
export const lens = { diagDeg: 58 };
const shotCur = { target: new THREE.Vector3(0, .4, 0), yaw: 0, halfW: 1.4, halfH: 0.9, eye: 1.45, minDist: 1.5 };
const shotFrom = { ...shotCur, target: shotCur.target.clone() };
const shotTo = { ...shotCur, target: shotCur.target.clone() };
let shotT = 1, shotDur = 1;
export function setShot(s, dur = 0) {
  Object.assign(shotFrom, { ...shotCur, target: shotCur.target.clone() });
  Object.assign(shotTo, { ...shotCur, ...s, target: (s.target || shotCur.target).clone() });
  shotDur = dur; shotT = dur > 0 ? 0 : 1;
  if (dur <= 0) { Object.assign(shotCur, { ...shotTo, target: shotTo.target.clone() }); applyLens(); }
}
export function shotBusy() { return shotT < 1; }
const shake = { amp: 0, t: 0 };
export function camShake(a) { shake.amp = Math.max(shake.amp, a); }
export function updateShot(dt) {
  if (shotT < 1) {
    shotT = Math.min(1, shotT + dt / shotDur);
    const k = easeInOut(shotT);
    for (const key of ['yaw', 'halfW', 'halfH', 'eye', 'minDist']) shotCur[key] = lerp(shotFrom[key], shotTo[key], k);
    shotCur.target.lerpVectors(shotFrom.target, shotTo.target, k);
  }
  shake.t += dt; shake.amp = damp(shake.amp, 0, 6, dt);
  applyLens();
}
function applyLens() {
  const a = view.aspect;
  const diag = THREE.MathUtils.degToRad(lens.diagDeg);
  const td = Math.tan(diag / 2);
  const tv = td / Math.sqrt(1 + a * a), th = tv * a;
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(tv));
  camera.updateProjectionMatrix();
  const s = shotCur;
  let dist = Math.max(s.halfH / tv, s.halfW / th, s.minDist);
  let pitch = 0;
  for (let i = 0; i < 3; i++) {
    pitch = Math.asin(clamp((s.eye - s.target.y) / dist, -0.6, 0.85));
  }
  const cp = Math.cos(pitch);
  camera.position.set(
    s.target.x + Math.sin(s.yaw) * cp * dist,
    s.target.y + Math.sin(pitch) * dist,
    s.target.z + Math.cos(s.yaw) * cp * dist);
  if (shake.amp > 1e-4) {
    camera.position.x += Math.sin(shake.t * 53) * shake.amp;
    camera.position.y += Math.sin(shake.t * 71 + 1) * shake.amp;
  }
  camera.lookAt(s.target);
  post.focus = dist;
}
export function camDist() { return camera.position.distanceTo(shotCur.target); }

// ------------------------------------------------------------------ lazy textures (placeholder -> real image, no shader recompiles)
const texCache = new Map();
const loadQueue = [];
function placeholder(rgb) {
  const c = document.createElement('canvas'); c.width = c.height = 4;
  const g = c.getContext('2d'); g.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`; g.fillRect(0, 0, 4, 4);
  return c;
}
const AVG = {
  sand: [205, 162, 108], hardpan: [163, 114, 74], rock: [174, 120, 78], bone: [214, 190, 156], wood: [150, 110, 74],
  canvas: [163, 139, 99], cotton: [228, 224, 216], denim: [62, 82, 113], tarp: [58, 89, 110], skin: [248, 248, 248],
  hair: [78, 52, 33], dino: [200, 200, 200], metal: [140, 140, 140],
};
export function tex(name, kind, repeat = 1) {
  const key = name + '_' + kind + '_' + repeat;
  if (texCache.has(key)) return texCache.get(key);
  const ph = kind === 'c' ? AVG[name] || [180, 180, 180] : kind === 'n' ? [128, 128, 255] : [255, 220, 0];
  const t = new THREE.Texture(placeholder(ph));
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = MAX_ANISO;
  t.colorSpace = kind === 'c' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.needsUpdate = true;
  t.userData.src = `tex/${name}_${kind}.jpg`;
  texCache.set(key, t);
  loadQueue.push(t);
  return t;
}
export function startTextureLoading(onProgress) {
  // decode sequentially in priority order (first requested first)
  const byUrl = new Map();
  for (const t of loadQueue) { if (!byUrl.has(t.userData.src)) byUrl.set(t.userData.src, []); byUrl.get(t.userData.src).push(t); }
  const urls = [...byUrl.keys()];
  let i = 0, done = 0;
  const next = () => {
    if (i >= urls.length) return;
    const url = urls[i++];
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const apply = () => { for (const t of byUrl.get(url)) { t.dispose(); t.image = img; t.needsUpdate = true; } done++; onProgress && onProgress(done / urls.length); next(); };
      (img.decode ? img.decode().catch(() => { }) : Promise.resolve()).then(apply);
    };
    img.onerror = () => { done++; next(); };
    img.src = url;
  };
  next(); next();
}

// PBR material from a texture set
export function pbr(name, o = {}) {
  const rep = o.repeat || 1;
  const P = o.physical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
  const m = new P({
    map: tex(name, 'c', rep), normalMap: tex(name, 'n', rep), roughnessMap: tex(name, 'orm', rep), aoMap: tex(name, 'orm', rep),
    metalnessMap: o.metal ? tex(name, 'orm', rep) : null,
    roughness: o.roughness ?? 1, metalness: o.metal ? 1 : 0, color: o.color ? new THREE.Color(o.color) : new THREE.Color(1, 1, 1),
    aoMapIntensity: o.ao ?? 1,
    side: o.side || THREE.FrontSide,
  });
  m.normalScale.set(o.ns ?? 1, o.ns ?? 1); // maps are OpenGL convention
  if (o.physical) Object.assign(m, o.physical);
  if (o.vertexColors) m.vertexColors = true;
  return m;
}

// ------------------------------------------------------------------ input
export const input = { handlers: null, down: false, x: 0, y: 0, ndc: new THREE.Vector2(), lastTouch: performance.now() / 1000, id: null };
const ray = new THREE.Raycaster();
export function rayFrom(ndc) { ray.setFromCamera(ndc, camera); return ray; }
function setP(e) {
  input.x = e.clientX; input.y = e.clientY;
  input.ndc.set(e.clientX / view.w * 2 - 1, -(e.clientY / view.h) * 2 + 1);
}
canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  if (input.down && input.id !== e.pointerId) return; // single finger only
  input.down = true; input.id = e.pointerId; setP(e);
  input.lastTouch = performance.now() / 1000;
  try { canvas.setPointerCapture(e.pointerId); } catch (_) { }
  input.handlers && input.handlers.down && input.handlers.down(input);
}, { passive: false });
canvas.addEventListener('pointermove', e => {
  if (!input.down || e.pointerId !== input.id) return;
  e.preventDefault(); setP(e); input.lastTouch = performance.now() / 1000;
  input.handlers && input.handlers.move && input.handlers.move(input);
}, { passive: false });
const up = e => {
  if (!input.down || e.pointerId !== input.id) return;
  setP(e); input.down = false; input.id = null; input.lastTouch = performance.now() / 1000;
  input.handlers && input.handlers.up && input.handlers.up(input);
};
canvas.addEventListener('pointerup', up);
canvas.addEventListener('pointercancel', up);
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
