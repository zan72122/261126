// core.js — renderer, photographic post pipeline (DOF + bloom + ACES + grain), sky/env, lights, camera rig, textures
import * as THREE from 'three';

export const C = {
  renderer: null, scene: null, camera: null, time: 0, dt: 0,
  scale: 1, w: 1, h: 1, portrait: true,
  tod: 0,            // 0 = pre-dawn deep blue, 0.5 = blue hour, 1 = sunrise
  focus: 4, aperture: 0.6,
};

// ------------------------------------------------------------ textures (progressive)
const loader = new THREE.TextureLoader();
const base = new Map();      // name -> {t, ready, waiters, promise}
const variants = new Map();
export function tex(name, opt = {}) {
  let b = base.get(name);
  if (!b) {
    const t = new THREE.Texture();
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
    b = { t, ready: false, waiters: [] };
    b.promise = new Promise((res) => {
      loader.load('tex/' + name, (img) => {
        t.image = img.image; t.needsUpdate = true; b.ready = true;
        for (const w of b.waiters) w(); b.waiters.length = 0; res(t);
      }, undefined, () => res(t));
    });
    base.set(name, b);
  }
  const key = name + JSON.stringify(opt);
  let v = variants.get(key);
  if (!v) {
    v = b.t.clone();             // clones share the Source -> one GPU upload
    v.colorSpace = opt.srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    if (opt.clamp) v.wrapS = v.wrapT = THREE.ClampToEdgeWrapping;
    if (opt.repeat) v.repeat.set(opt.repeat[0], opt.repeat[1]);
    v.userData.texName = name;
    variants.set(key, v);
  }
  return v;
}
export function texReady(t) { const b = base.get(t.userData.texName); return !b || b.ready; }
export function allTexturesLoaded() { return Promise.all([...base.values()].map((b) => b.promise)); }
/** assign a texture slot only once it has loaded (avoids black normal maps on first frames) */
export function setMap(mat, slot, t) {
  const go = () => { mat[slot] = t; t.needsUpdate = true; mat.needsUpdate = true; };
  const b = base.get(t.userData.texName);
  if (!b || b.ready) go(); else b.waiters.push(go);
}

// a material with PBR set: name prefix -> _c (srgb), _nrm, _orm
export function pbr(prefix, o = {}) {
  const Cls = o.physical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
  const m = new Cls({ color: o.color ?? 0xffffff, roughness: o.roughness ?? 1, metalness: o.metalness ?? 0 });
  const rep = o.repeat || [1, 1];
  if (o.c !== false) setMap(m, 'map', tex(prefix + '_c.jpg', { srgb: true, repeat: rep }));
  if (o.n !== false) {
    setMap(m, 'normalMap', tex(prefix + '_nrm.jpg', { repeat: rep }));
    m.normalScale.set(o.ns ?? 1, o.ns ?? 1);
  }
  if (o.orm !== false) {
    const t = tex(prefix + '_orm.jpg', { repeat: rep });
    setMap(m, 'roughnessMap', t); setMap(m, 'aoMap', t);
    if (o.metalMap) setMap(m, 'metalnessMap', t);
    m.aoMapIntensity = o.ao ?? 1;
  }
  for (const k of ['sheen', 'sheenRoughness', 'clearcoat', 'clearcoatRoughness', 'envMapIntensity', 'transparent', 'opacity', 'side', 'emissive', 'emissiveIntensity']) {
    if (o[k] !== undefined) {
      if (k === 'emissive') m.emissive.set(o[k]); else m[k] = o[k];
    }
  }
  if (o.sheenColor !== undefined) m.sheenColor.set(o.sheenColor);
  return m;
}

/** onBeforeCompile helper: inject code into standard chunks */
export function patch(mat, spec) {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    Object.assign(sh.uniforms, spec.uniforms || {});
    if (spec.vertexPre) sh.vertexShader = spec.vertexPre + '\n' + sh.vertexShader;
    if (spec.fragmentPre) sh.fragmentShader = spec.fragmentPre + '\n' + sh.fragmentShader;
    for (const [chunk, code] of Object.entries(spec.vertex || {})) {
      sh.vertexShader = sh.vertexShader.replace(`#include <${chunk}>`, code.includes('$') ? code.replace('$', `#include <${chunk}>\n`) : code);
    }
    for (const [chunk, code] of Object.entries(spec.fragment || {})) {
      sh.fragmentShader = sh.fragmentShader.replace(`#include <${chunk}>`, code.includes('$') ? code.replace('$', `#include <${chunk}>\n`) : code);
    }
    mat.userData.shader = sh;
  };
  mat.userData.pkey = (mat.userData.pkey || '') + '|' + (spec.key || mat.uuid);
  const k = mat.userData.pkey;
  mat.customProgramCacheKey = () => k;
  mat.needsUpdate = true;
  return mat;
}

// ------------------------------------------------------------ renderer + post
let rtMain, rtQ, rtQ2, rtB, rtB2, quad, orthoCam, mDown, mBlurQ, mBright, mBlurB, mFinal;
const FSQ_V = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

function mkRT(w, h, opts = {}) {
  return new THREE.WebGLRenderTarget(w, h, Object.assign({ type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false }, opts));
}

export function initRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false });
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFShadowMap;
  r.toneMapping = THREE.NoToneMapping;
  r.outputColorSpace = THREE.LinearSRGBColorSpace;
  r.autoClear = true;
  C.renderer = r;
  C.scene = new THREE.Scene();
  C.camera = new THREE.PerspectiveCamera(40, 1, 0.08, 1500);

  orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
  quad = new THREE.Mesh(g);
  quad.frustumCulled = false;

  const depthFns = `
    uniform sampler2D tDepth; uniform float near, far, focus, aperture;
    float linDepth(vec2 uv){ float d = texture2D(tDepth, uv).r; return (near*far)/(far - d*(far-near)); }
    float coc(vec2 uv){ float z = linDepth(uv); return clamp(abs(z - focus) / max(z, 0.1) * aperture * 4.0, 0.0, 1.0); }`;

  mDown = new THREE.ShaderMaterial({
    uniforms: { tColor: { value: null }, tDepth: { value: null }, texel: { value: new THREE.Vector2() }, near: { value: 0.1 }, far: { value: 1000 }, focus: { value: 4 }, aperture: { value: 0.5 } },
    vertexShader: FSQ_V,
    fragmentShader: `varying vec2 vUv; uniform sampler2D tColor; uniform vec2 texel; ${depthFns}
      void main(){
        vec4 acc = vec4(0.0);
        for(int i=0;i<4;i++){
          vec2 o = vec2(i==0||i==2 ? -1.0 : 1.0, i<2 ? -1.0 : 1.0) * texel;
          vec2 uv = vUv + o;
          vec3 c = texture2D(tColor, uv).rgb; c = (c.r == c.r && c.g == c.g && c.b == c.b) ? min(c, vec3(40.0)) : vec3(0.0);
          float k = coc(uv);
          acc += vec4(c * k, k);
        }
        gl_FragColor = acc * 0.25;
      }`, depthTest: false, depthWrite: false,
  });
  mBlurQ = new THREE.ShaderMaterial({
    uniforms: { tIn: { value: null }, dir: { value: new THREE.Vector2() } },
    vertexShader: FSQ_V,
    fragmentShader: `varying vec2 vUv; uniform sampler2D tIn; uniform vec2 dir;
      void main(){
        vec4 s = texture2D(tIn, vUv) * 0.2270270270;
        s += (texture2D(tIn, vUv + dir*1.3846153846) + texture2D(tIn, vUv - dir*1.3846153846)) * 0.3162162162;
        s += (texture2D(tIn, vUv + dir*3.2307692308) + texture2D(tIn, vUv - dir*3.2307692308)) * 0.0702702703;
        gl_FragColor = s;
      }`, depthTest: false, depthWrite: false,
  });
  mBright = new THREE.ShaderMaterial({
    uniforms: { tColor: { value: null }, texel: { value: new THREE.Vector2() }, thr: { value: 2.2 } },
    vertexShader: FSQ_V,
    fragmentShader: `varying vec2 vUv; uniform sampler2D tColor; uniform vec2 texel; uniform float thr;
      void main(){
        vec3 c = vec3(0.0);
        c += texture2D(tColor, vUv + vec2(-1.5,-1.5)*texel).rgb; c += texture2D(tColor, vUv + vec2(1.5,-1.5)*texel).rgb;
        c += texture2D(tColor, vUv + vec2(-1.5,1.5)*texel).rgb;  c += texture2D(tColor, vUv + vec2(1.5,1.5)*texel).rgb;
        c = min(c * 0.25, vec3(60.0)); if (!(c.r == c.r && c.g == c.g && c.b == c.b)) c = vec3(0.0);
        float l = dot(c, vec3(0.2126,0.7152,0.0722));
        gl_FragColor = vec4(c * max(l - thr, 0.0) / max(l, 1e-4), 1.0);
      }`, depthTest: false, depthWrite: false,
  });
  mBlurB = mBlurQ.clone();
  mFinal = new THREE.ShaderMaterial({
    uniforms: {
      tColor: { value: null }, tDepth: { value: null }, tDof: { value: null }, tBloom: { value: null },
      near: { value: 0.1 }, far: { value: 1000 }, focus: { value: 4 }, aperture: { value: 0.5 },
      exposure: { value: 1 }, time: { value: 0 }, res: { value: new THREE.Vector2() }, bloomK: { value: 0.12 },
      fade: { value: 0 }, fadeColor: { value: new THREE.Color(0x0b1220) }, wb: { value: new THREE.Vector3(1, 1, 1) },
    },
    vertexShader: FSQ_V,
    fragmentShader: `varying vec2 vUv; uniform sampler2D tColor, tDof, tBloom; uniform float exposure, time, bloomK, fade; uniform vec2 res; uniform vec3 fadeColor, wb; ${depthFns}
      vec3 RRTAndODTFit(vec3 v){ vec3 a = v*(v+0.0245786)-0.000090537; vec3 b = v*(0.983729*v+0.4329510)+0.238081; return a/b; }
      vec3 aces(vec3 c){
        const mat3 I = mat3(vec3(0.59719,0.07600,0.02840), vec3(0.35458,0.90834,0.13383), vec3(0.04823,0.01566,0.83777));
        const mat3 O = mat3(vec3(1.60475,-0.10208,-0.00327), vec3(-0.53108,1.10813,-0.07276), vec3(-0.07367,-0.00605,1.07602));
        c = I * (c / 0.6); c = RRTAndODTFit(c); c = O * c; return clamp(c, 0.0, 1.0);
      }
      vec3 srgb(vec3 c){ return mix(pow(c, vec3(1.0/2.4))*1.055-0.055, c*12.92, vec3(lessThanEqual(c, vec3(0.0031308)))); }
      float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
      void main(){
        vec3 c = texture2D(tColor, vUv).rgb;
        float k = coc(vUv);
        vec4 d = texture2D(tDof, vUv);
        vec3 blurred = d.a > 0.002 ? d.rgb / d.a : c;
        c = mix(c, blurred, smoothstep(0.08, 0.55, k) * smoothstep(0.0, 0.2, d.a));
        c += texture2D(tBloom, vUv).rgb * bloomK;
        c *= exposure * wb;
        c = aces(c);
        vec2 q = vUv - 0.5; q.x *= res.x / res.y;
        c *= 1.0 - smoothstep(0.45, 1.25, length(q)) * 0.45;
        c = srgb(c);
        float g = hash(vUv * res + fract(time) * 91.7) - 0.5;
        c += g * 0.028;
        c = mix(c, fadeColor, fade);
        gl_FragColor = vec4(c, 1.0);
      }`, depthTest: false, depthWrite: false,
  });
  resize();
  return r;
}

let lastW = 0, lastH = 0;
export function resize() {
  const r = C.renderer;
  const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // pixel budget keeps iPhone at 30fps+: ~2.1 MP at scale 1
  const budget = 2.1e6 * C.scale;
  let pr = dpr;
  if (w * h * pr * pr > budget) pr = Math.sqrt(budget / (w * h));
  r.setPixelRatio(pr);
  r.setSize(w, h, false);
  C.w = w; C.h = h; C.portrait = h > w;
  const W = Math.floor(w * pr), H = Math.floor(h * pr);
  if (W === lastW && H === lastH && rtMain) { fitCamera(); return; }
  lastW = W; lastH = H;
  for (const t of [rtMain, rtQ, rtQ2, rtB, rtB2]) t && t.dispose();
  const dt = new THREE.DepthTexture(W, H);
  dt.type = THREE.UnsignedIntType;
  rtMain = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4, depthBuffer: true, depthTexture: dt, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  const qw = Math.max(1, W >> 2), qh = Math.max(1, H >> 2);
  rtQ = mkRT(qw, qh); rtQ2 = mkRT(qw, qh);
  const bw = Math.max(1, W >> 3), bh = Math.max(1, H >> 3);
  rtB = mkRT(bw, bh); rtB2 = mkRT(bw, bh);
  mFinal.uniforms.res.value.set(W, H);
  fitCamera();
}

function pass(mat, target) {
  quad.material = mat;
  C.renderer.setRenderTarget(target);
  C.renderer.render(quad, orthoCam);
}

export function render() {
  const r = C.renderer, cam = C.camera;
  r.setRenderTarget(rtMain);
  r.render(C.scene, cam);
  const nf = (m) => { m.uniforms.near.value = cam.near; m.uniforms.far.value = cam.far; m.uniforms.focus.value = C.focus; m.uniforms.aperture.value = C.aperture; };
  // DOF downsample (coc weighted)
  mDown.uniforms.tColor.value = rtMain.texture; mDown.uniforms.tDepth.value = rtMain.depthTexture;
  mDown.uniforms.texel.value.set(1 / rtMain.width, 1 / rtMain.height); nf(mDown);
  pass(mDown, rtQ);
  mBlurQ.uniforms.tIn.value = rtQ.texture; mBlurQ.uniforms.dir.value.set(1 / rtQ.width, 0); pass(mBlurQ, rtQ2);
  mBlurQ.uniforms.tIn.value = rtQ2.texture; mBlurQ.uniforms.dir.value.set(0, 1 / rtQ.height); pass(mBlurQ, rtQ);
  // bloom
  mBright.uniforms.tColor.value = rtMain.texture; mBright.uniforms.texel.value.set(1 / rtMain.width, 1 / rtMain.height);
  pass(mBright, rtB);
  for (let i = 0; i < 2; i++) {
    mBlurB.uniforms.tIn.value = rtB.texture; mBlurB.uniforms.dir.value.set((1 + i) / rtB.width, 0); pass(mBlurB, rtB2);
    mBlurB.uniforms.tIn.value = rtB2.texture; mBlurB.uniforms.dir.value.set(0, (1 + i) / rtB.height); pass(mBlurB, rtB);
  }
  const u = mFinal.uniforms;
  u.tColor.value = rtMain.texture; u.tDepth.value = rtMain.depthTexture; u.tDof.value = rtQ.texture; u.tBloom.value = rtB.texture;
  nf(mFinal); u.time.value = C.time; u.exposure.value = C.exposure ?? 1;
  pass(mFinal, null);
}
export const post = { get final() { return mFinal; } };

// ------------------------------------------------------------ camera rig (auto shots, aspect-aware framing)
const rig = {
  from: null, to: null, t: 1, dur: 1,
  cur: { pos: new THREE.Vector3(0, 1.6, 6), tgt: new THREE.Vector3(0, 1.2, 0), fit: [2, 1.5] },
  shot: null, sway: 1,
};
export function focalToVFov(mm) {
  // 36mm film width maps to the long side of the screen
  const aspect = C.w / C.h;
  const longHalf = 18 / mm;
  if (aspect >= 1) return 2 * Math.atan(longHalf / aspect) * 180 / Math.PI;
  return 2 * Math.atan(longHalf) * 180 / Math.PI;
}
/** shot = { target:[x,y,z], dir:[x,y,z] (target->camera), fit:[halfW, halfH], mm, height(optional absolute cam y) } */
function shotCamera(s) {
  const cam = C.camera;
  const vfov = focalToVFov(s.mm || 40) * Math.PI / 180;
  const aspect = C.w / C.h;
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
  const fitW = (s.fitP && C.portrait) ? s.fitP[0] : s.fit[0];
  const fitH = (s.fitP && C.portrait) ? s.fitP[1] : s.fit[1];
  const dist = Math.max(fitW / Math.tan(hfov / 2), fitH / Math.tan(vfov / 2), s.minDist || 1);
  const d = new THREE.Vector3(...s.dir).normalize();
  const tgt = new THREE.Vector3(...((C.portrait && s.targetP) ? s.targetP : s.target));
  const pos = tgt.clone().addScaledVector(d, dist);
  if (s.maxY !== undefined) pos.y = Math.min(pos.y, s.maxY);
  if (s.minY !== undefined) pos.y = Math.max(pos.y, s.minY);
  return { pos, tgt, vfov: vfov * 180 / Math.PI };
}
export function setShot(s, dur = 0) {
  rig.shot = s;
  const c = shotCamera(s);
  if (dur <= 0 || !rig.to) {
    rig.from = rig.to = c; rig.t = 1; rig.dur = 1;
  } else {
    rig.from = { pos: C.camera.position.clone(), tgt: rig.curTgt ? rig.curTgt.clone() : c.tgt.clone(), vfov: C.camera.fov };
    rig.to = c; rig.t = 0; rig.dur = dur;
  }
  if (s.focusDist !== undefined) C.focusTarget = s.focusDist;
}
export function fitCamera() {
  if (!C.camera) return;
  C.camera.aspect = C.w / C.h;
  if (rig.shot) {
    const c = shotCamera(rig.shot);
    if (rig.t >= 1) rig.from = c;
    rig.to = c;
  }
  C.camera.updateProjectionMatrix();
}
const _tmp = new THREE.Vector3();
export function updateCamera(dt) {
  if (!rig.to) return;
  rig.t = Math.min(1, rig.t + dt / rig.dur);
  const e = rig.t < 1 ? (1 - Math.cos(rig.t * Math.PI)) / 2 : 1;
  const cam = C.camera;
  cam.position.lerpVectors(rig.from.pos, rig.to.pos, e);
  rig.curTgt = rig.curTgt || new THREE.Vector3();
  rig.curTgt.lerpVectors(rig.from.tgt, rig.to.tgt, e);
  cam.fov = rig.from.vfov + (rig.to.vfov - rig.from.vfov) * e;
  // subtle hand-held breathing
  const t = C.time;
  _tmp.set(Math.sin(t * 0.37) * 0.012 + Math.sin(t * 0.91) * 0.004, Math.sin(t * 0.53) * 0.008, Math.cos(t * 0.29) * 0.01).multiplyScalar(rig.sway);
  cam.position.add(_tmp);
  cam.lookAt(rig.curTgt);
  if (C.shake > 0) {
    cam.rotation.z += (Math.random() - .5) * C.shake * 0.01; cam.rotation.x += (Math.random() - .5) * C.shake * 0.006;
    C.shake = Math.max(0, C.shake - dt * 2);
  }
  cam.updateProjectionMatrix();
  // auto focus distance toward focus target
  const fd = C.focusTarget ?? cam.position.distanceTo(rig.curTgt);
  C.focus += (fd - C.focus) * Math.min(1, dt * 3);
}
export function camTarget() { return rig.curTgt; }

// ------------------------------------------------------------ sky dome + environment
export const SUN_DIR = new THREE.Vector3(0.55, 0.0, 0.83).normalize(); // east-ish, horizontal azimuth
let skyMat, skyMesh, envScene, envSky, pmrem, envRT, lastEnvTod = -1;
const SKY_FS = `
  varying vec3 vDir; uniform float tod, time; uniform vec3 sunDir; uniform float stars;
  float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ float s=0.0, a=0.5; for(int i=0;i<5;i++){ s+=a*vn(p); p*=2.03; a*=0.5; } return s; }
  void main(){
    vec3 d = normalize(vDir);
    float el = d.y;
    vec3 sd = normalize(vec3(sunDir.x, 0.0, sunDir.z));
    float az = dot(normalize(vec3(d.x,0.0,d.z)+1e-5), sd) * 0.5 + 0.5;   // 1 toward sunrise
    float sunEl = mix(-0.16, 0.035, tod);
    vec3 sunV = normalize(vec3(sd.x, sunEl, sd.z));
    float sdot = max(dot(d, sunV), 0.0);
    // zenith / horizon colours through the dawn
    vec3 zen = mix(vec3(0.010,0.020,0.060), vec3(0.050,0.110,0.270), smoothstep(0.0,0.6,tod));
    zen = mix(zen, vec3(0.13,0.24,0.48), smoothstep(0.6,1.0,tod));
    vec3 hor = mix(vec3(0.060,0.090,0.180), vec3(0.230,0.300,0.480), smoothstep(0.0,0.6,tod));
    hor = mix(hor, vec3(0.62,0.55,0.62), smoothstep(0.6,1.0,tod));
    vec3 glow = mix(vec3(0.20,0.12,0.16), vec3(1.0,0.45,0.18), smoothstep(0.3,1.0,tod)) * mix(0.35, 3.0, tod);
    float hgt = pow(1.0 - max(el, 0.0), 4.0);
    vec3 col = mix(zen, hor, hgt);
    col += glow * pow(az, 3.0) * pow(1.0 - max(el,0.0), 7.0);
    // sun disc + halo at sunrise
    float sunUp = smoothstep(0.75, 1.0, tod);
    col += vec3(1.0,0.55,0.25) * pow(sdot, 12.0) * 1.6 * smoothstep(0.4,1.0,tod);
    col += vec3(1.0,0.75,0.45) * smoothstep(0.9993, 0.9997, sdot) * 60.0 * sunUp;
    // stratus clouds lit from below by the dawn
    if (el > 0.0) {
      vec2 cp = d.xz / (el + 0.08) * 1.3 + vec2(time*0.004, 0.0);
      float c = fbm(cp * vec2(0.55, 1.6));
      c = smoothstep(0.48, 0.82, c) * smoothstep(0.0, 0.12, el) * (1.0 - smoothstep(0.45, 0.9, el));
      vec3 lit = mix(vec3(0.05,0.06,0.10), vec3(0.95,0.45,0.35), smoothstep(0.35,1.0,tod)) * (0.4 + 1.6*pow(az,2.0)) * mix(0.6, 1.8, tod);
      vec3 dark = mix(vec3(0.012,0.018,0.04), vec3(0.18,0.20,0.32), tod);
      col = mix(col, mix(dark, lit, fbm(cp*2.0+3.0)), c * 0.85);
      // stars before dawn
      vec2 sp = floor(d.xz / (el+0.3) * 220.0);
      float st = step(0.9965, h21(sp)) * stars * smoothstep(0.15, 0.5, el) * (1.0 - c);
      col += vec3(0.8,0.85,1.0) * st * (0.6 + 0.4*sin(time*3.0 + h21(sp+1.0)*30.0));
    } else {
      // below horizon: snow plain far away (mostly hidden by ground)
      col = mix(hor * 0.8, zen * 0.6, clamp(-el*4.0,0.0,1.0));
    }
    gl_FragColor = vec4(col, 1.0);
  }`;
function makeSkyMat(isEnv) {
  return new THREE.ShaderMaterial({
    uniforms: { tod: { value: 0 }, time: { value: 0 }, sunDir: { value: SUN_DIR }, stars: { value: isEnv ? 0 : 1 } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = position; vec4 p = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*p; gl_Position.z = gl_Position.w*0.9999; }`,
    fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: false, fog: false,
  });
}
export function initSky() {
  skyMat = makeSkyMat(false);
  skyMesh = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), skyMat);
  skyMesh.frustumCulled = false; skyMesh.renderOrder = -10;
  C.scene.add(skyMesh);
  envScene = new THREE.Scene();
  envSky = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 16), makeSkyMat(true));
  envScene.add(envSky);
  // snow plain in the env reflects the sky (bright lower hemisphere = snow bounce)
  const gm = new THREE.MeshBasicMaterial({ color: 0x7d8aa6 });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(95, 32).rotateX(-Math.PI / 2), gm);
  ground.position.y = -2; envScene.add(ground); envScene.userData.ground = gm;
  // floodlight blobs for highlights in reflections
  const lm = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.86, 0.66).multiplyScalar(40) });
  for (const p of [[-30, 18, -40], [40, 16, -30], [-10, 20, 50]]) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 6), lm); s.position.set(...p); envScene.add(s);
  }
  envScene.userData.lights = lm;
  pmrem = new THREE.PMREMGenerator(C.renderer);
  updateEnv(true);
}
export function updateEnv(force) {
  if (!force && Math.abs(C.tod - lastEnvTod) < 0.04) return;
  lastEnvTod = C.tod;
  envSky.material.uniforms.tod.value = C.tod;
  const t = C.tod;
  envScene.userData.ground.color.setRGB(0.10 + 0.55 * t, 0.13 + 0.45 * t, 0.22 + 0.42 * t);
  envScene.userData.lights.color.setRGB(1, 0.86, 0.66).multiplyScalar(40 * (1 - t * 0.8));
  const old = envRT;
  envRT = pmrem.fromScene(envScene, 0.02);
  C.scene.environment = envRT.texture;
  if (old) old.dispose();
}
export function updateSky() {
  skyMat.uniforms.tod.value = C.tod;
  skyMat.uniforms.time.value = C.time;
  skyMat.uniforms.stars.value = 1 - C.tod;
}

// ------------------------------------------------------------ lights
export const L = {};
export function initLights() {
  const s = C.scene;
  // apron floodlight on a mast (key, casts soft shadows)
  L.key = new THREE.DirectionalLight(0xffe2c2, 2.6);
  L.key.position.set(-14, 22, -16);
  L.key.castShadow = true;
  L.key.shadow.mapSize.set(2048, 2048);
  L.key.shadow.radius = 3.5;
  L.key.shadow.bias = -0.0004;
  L.key.shadow.normalBias = 0.025;
  const sc = L.key.shadow.camera; sc.left = -12; sc.right = 12; sc.top = 12; sc.bottom = -12; sc.near = 1; sc.far = 80;
  s.add(L.key); s.add(L.key.target);
  // sky + snow bounce
  L.hemi = new THREE.HemisphereLight(0x5670a8, 0x8a96b4, 0.15);
  s.add(L.hemi);
  // warm work lamp near the action (lights faces); position moved per scene
  L.work = new THREE.SpotLight(0xffc890, 14, 14, 0.75, 0.8, 1.6);
  L.work.position.set(3, 2.6, -4);
  s.add(L.work); s.add(L.work.target);
  // soft front fill from camera side (snow bounce on faces)
  L.fill = new THREE.PointLight(0xc9d6ff, 1.6, 10, 1.5);
  s.add(L.fill);
  s.fog = new THREE.FogExp2(0x1a2844, 0.0035);
}
export function setTodLighting(t) {
  C.tod = t;
  const key = L.key;
  // pre-dawn: neutral-warm LED floodlight; sunrise: low orange sun from the east
  const flood = new THREE.Color(1.0, 0.88, 0.74);
  const sun = new THREE.Color(1.0, 0.62, 0.36);
  const k = THREE.MathUtils.smoothstep(t, 0.7, 1.0);
  key.color.copy(flood).lerp(sun, k);
  key.intensity = THREE.MathUtils.lerp(1.5, 3.2, k);
  L.hemi.color.setRGB(0.25 + 0.35 * t, 0.33 + 0.30 * t, 0.62 + 0.15 * t);
  L.hemi.groundColor.setRGB(0.42 + 0.4 * t, 0.46 + 0.3 * t, 0.58 + 0.2 * t);
  L.hemi.intensity = 0.1 + 0.3 * t;
  C.scene.fog.color.setRGB(0.05 + 0.32 * t, 0.075 + 0.22 * t, 0.15 + 0.22 * t);
  C.scene.environmentIntensity = 0.55 + 0.6 * t;
}
export function aimKey(center, fromDir, size = 12) {
  const k = L.key;
  k.target.position.copy(center);
  k.position.copy(center).addScaledVector(fromDir.clone().normalize(), 35);
  const sc = k.shadow.camera; sc.left = -size; sc.right = size; sc.top = size; sc.bottom = -size; sc.updateProjectionMatrix();
}

// ------------------------------------------------------------ misc helpers
export const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export function damp(cur, target, k, dt) { return cur + (target - cur) * (1 - Math.exp(-k * dt)); }
