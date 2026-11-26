// Renderer, post (DOF + ACES + grain), sky/env, lighting, material helpers.
import * as THREE from 'three';

export const R = {};

export function initRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping; // ACES applied in our final pass
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  R.renderer = renderer;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  R.dpr = dpr; R.scale = dpr >= 2 ? 0.8 : 1; // internal resolution factor (adaptive)
  R.rt = null;
  R.post = makePost();
  return renderer;
}

function makeRT(w, h) {
  const rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4, colorSpace: THREE.LinearSRGBColorSpace });
  rt.depthTexture = new THREE.DepthTexture(w, h);
  rt.depthTexture.type = THREE.UnsignedIntType;
  return rt;
}

export function resize(camera) {
  const w = window.innerWidth, h = window.innerHeight;
  R.renderer.setPixelRatio(1);
  const pw = Math.round(w * R.dpr * R.scale), ph = Math.round(h * R.dpr * R.scale);
  R.renderer.setSize(pw, ph, false);
  R.renderer.domElement.style.width = w + 'px'; R.renderer.domElement.style.height = h + 'px';
  if (!R.rt || R.rt.width !== pw || R.rt.height !== ph) {
    if (R.rt) R.rt.dispose();
    R.rt = makeRT(pw, ph);
  }
  R.post.uniforms.uRes.value.set(pw, ph);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  R.w = w; R.h = h;
}

function makePost() {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      tColor: { value: null }, tDepth: { value: null }, uRes: { value: new THREE.Vector2(1, 1) },
      uNear: { value: 0.1 }, uFar: { value: 200 }, uFocus: { value: 2 }, uAperture: { value: 0.6 },
      uExposure: { value: 1.0 }, uTime: { value: 0 }, uVignette: { value: 0.28 }, uWarm: { value: new THREE.Vector3(1, 1, 1) },
      uFade: { value: 0 }, uLift: { value: 0.0 },
    },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: /* glsl */`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D tColor; uniform sampler2D tDepth; uniform vec2 uRes;
      uniform float uNear, uFar, uFocus, uAperture, uExposure, uTime, uVignette, uFade, uLift; uniform vec3 uWarm;
      float linDepth(float d){ float z = d*2.-1.; return 2.*uNear*uFar/(uFar+uNear-z*(uFar-uNear)); }
      float coc(float z){ return clamp(abs(1./uFocus - 1./z) * uAperture * 6.0, 0., 1.); }
      vec3 RRTAndODTFit(vec3 v){ vec3 a=v*(v+0.0245786)-0.000090537; vec3 b=v*(0.983729*v+0.4329510)+0.238081; return a/b; }
      vec3 aces(vec3 color){
        const mat3 ACESInputMat = mat3(vec3(0.59719,0.07600,0.02840),vec3(0.35458,0.90834,0.13383),vec3(0.04823,0.01566,0.83777));
        const mat3 ACESOutputMat = mat3(vec3(1.60475,-0.10208,-0.00327),vec3(-0.53108,1.10813,-0.07276),vec3(-0.07367,-0.00605,1.07602));
        color *= uExposure/0.6; color = ACESInputMat*color; color = RRTAndODTFit(color); color = ACESOutputMat*color; return clamp(color,0.,1.);
      }
      vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(c, vec3(1./2.4))-0.055, step(0.0031308, c)); }
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
      void main(){
        float z = linDepth(texture2D(tDepth, vUv).r);
        float c = coc(z);
        vec3 col = texture2D(tColor, vUv).rgb;
        if (c > 0.02) {
          vec3 acc = col; float wsum = 1.;
          float rad = c * 7.0;
          const int N = 12;
          for (int i=0;i<N;i++){
            float a = float(i)*2.39996 + hash(vUv*uRes)*0.6; float r = sqrt((float(i)+0.5)/float(N));
            vec2 o = vec2(cos(a),sin(a))*r*rad/uRes;
            vec3 s = texture2D(tColor, vUv+o).rgb;
            float zs = linDepth(texture2D(tDepth, vUv+o).r);
            float w = (zs < z - 0.3) ? coc(zs) : 1.0; // foreground bleeds only by its own blur
            acc += s*w; wsum += w;
          }
          col = acc/wsum;
        }
        col *= uWarm;
        col = aces(col);
        col = toSRGB(col);
        col = col + uLift*(1.-col);
        vec2 q = vUv-0.5; col *= 1. - uVignette*dot(q,q)*1.6;
        col += (hash(vUv*uRes + fract(uTime)*91.7)-0.5)*0.028;
        col = mix(col, vec3(0.86,0.87,0.88), uFade);
        gl_FragColor = vec4(col,1.);
      }`,
    depthTest: false, depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  const scene = new THREE.Scene(); scene.add(quad);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  return { mat, uniforms: mat.uniforms, scene, cam };
}

export function render(scene, camera, t) {
  const r = R.renderer;
  r.setRenderTarget(R.rt);
  r.render(scene, camera);
  r.setRenderTarget(null);
  const u = R.post.uniforms;
  u.tColor.value = R.rt.texture; u.tDepth.value = R.rt.depthTexture;
  u.uNear.value = camera.near; u.uFar.value = camera.far; u.uTime.value = t;
  r.render(R.post.scene, R.post.cam);
}

// ---------------------------------------------------------------- sky + environment
export function makeSky() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      uSun: { value: new THREE.Vector3(0.6, 0.12, -0.8).normalize() },
      uZen: { value: new THREE.Color(0.42, 0.48, 0.56) }, uHor: { value: new THREE.Color(0.78, 0.78, 0.77) },
      uGlow: { value: new THREE.Color(1.3, 0.95, 0.7) }, uGlowAmt: { value: 0.6 }, uBright: { value: 1.0 },
    },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*p; gl_Position.z = gl_Position.w*0.99999; }',
    fragmentShader: `
      varying vec3 vDir; uniform vec3 uSun, uZen, uHor, uGlow; uniform float uGlowAmt, uBright;
      void main(){
        vec3 d = normalize(vDir);
        float h = clamp(d.y, -0.2, 1.);
        vec3 col = mix(uHor, uZen, pow(max(h,0.), 0.55));
        col = mix(col, uHor*0.92, smoothstep(0.0,-0.2,h));
        float s = max(dot(d, uSun), 0.);
        col += uGlow * (pow(s, 6.)*0.45 + pow(s, 60.)*0.8 + pow(s, 900.)*3.0) * uGlowAmt;
        gl_FragColor = vec4(col*uBright, 1.);
      }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), mat);
  m.frustumCulled = false; m.renderOrder = -10;
  return m;
}

// environment map: sky gradient + soft area lights (work light box, sun glow)
export function makeEnv(renderer, opts) {
  const pm = new THREE.PMREMGenerator(renderer);
  const sc = new THREE.Scene();
  const sky = makeSky(); sky.material.uniforms.uBright.value = opts.bright ?? 1;
  sky.material.uniforms.uGlowAmt.value = opts.glow ?? 0.6;
  if (opts.zen) sky.material.uniforms.uZen.value.copy(opts.zen);
  if (opts.hor) sky.material.uniforms.uHor.value.copy(opts.hor);
  if (opts.sun) sky.material.uniforms.uSun.value.copy(opts.sun);
  sky.scale.setScalar(0.1);
  sc.add(sky);
  // ground bounce
  const g = new THREE.Mesh(new THREE.CircleGeometry(60, 24), new THREE.MeshBasicMaterial({ color: opts.ground || new THREE.Color(0.16, 0.15, 0.14) }));
  g.rotation.x = -Math.PI / 2; g.position.y = -1.5; sc.add(g);
  for (const L of opts.panels || []) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(L.w, L.h), new THREE.MeshBasicMaterial({ color: L.color, side: THREE.DoubleSide }));
    p.position.copy(L.pos); p.lookAt(0, 0.5, 0); sc.add(p);
  }
  // distant dark silhouettes so reflections are not a flat gradient
  const silMat = new THREE.MeshBasicMaterial({ color: opts.sil || new THREE.Color(0.35, 0.37, 0.4) });
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * Math.PI * 2 + 0.3, r = 30;
    const b = new THREE.Mesh(new THREE.BoxGeometry(4 + (i % 3) * 3, 3 + ((i * 7) % 5) * 2.2, 2), silMat);
    b.position.set(Math.cos(a) * r, b.geometry.parameters.height / 2 - 1.5, Math.sin(a) * r); b.lookAt(0, b.position.y, 0); sc.add(b);
  }
  const rt = pm.fromScene(sc, 0.02);
  pm.dispose();
  return rt.texture;
}

// ---------------------------------------------------------------- texture loading
const loader = new THREE.TextureLoader();
export function tex(url, { srgb = false, repeat = 1, aniso = 8 } = {}) {
  const t = loader.load(url);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  if (repeat !== 1) t.repeat.set(repeat, repeat);
  return t;
}

// ---------------------------------------------------------------- material patch: triplanar micro-bump + vertex AO + per-vertex PBR params
// geometry attributes used: color (rgb), mp (vec4: roughness, bump, channel, sheen), ao (float)
export const DETAIL = { tex: null };
export function patchFigureMaterial(mat, { scale = 60, mode = 0, sss = 0 } = {}) {
  mat.vertexColors = true;
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uDetail = { value: DETAIL.tex };
    sh.uniforms.uDScale = { value: scale };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        attribute vec4 mp; attribute float ao;
        varying vec4 vMP; varying float vAO; varying vec3 vDPos; varying vec3 vDNrm;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vMP = mp; vAO = ao; vDPos = position; vDNrm = normal;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform sampler2D uDetail; uniform float uDScale;
        varying vec4 vMP; varying float vAO; varying vec3 vDPos; varying vec3 vDNrm;
        vec3 dBump(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float fd){
          vec3 sx = normalize(dFdx(surf_pos)); vec3 sy = normalize(dFdy(surf_pos));
          vec3 R1 = cross(sy, surf_norm); vec3 R2 = cross(surf_norm, sx);
          float det = dot(sx, R1) * fd;
          vec3 g = sign(det) * (dHdxy.x * R1 + dHdxy.y * R2);
          return normalize(abs(det) * surf_norm - g);
        }
        float dTex(vec2 uv, float ch){ vec4 t = texture2D(uDetail, uv); vec4 m = vec4(equal(vec4(ch), vec4(0.,1.,2.,3.))); return dot(t, m); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float aoV = vAO;
        aoV = mix(1., aoV, ${sss > 0 ? '0.7' : '1.0'});
        diffuseColor.rgb *= mix(${sss > 0 ? 'vec3(0.75,0.5,0.45)' : 'vec3(0.6)'}, vec3(1.), aoV);`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = vMP.x;')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        {
          float ch = vMP.z;
          float h;
          ${mode === 1 ? `
          float ang = atan(vDPos.x, vDPos.z);
          h = dTex(vec2(ang*0.35, vDPos.y*1.2)*vec2(6.0,1.0)*uDScale*0.05, ch);
          ` : `
          vec3 w = pow(abs(normalize(vDNrm)), vec3(4.)); w /= (w.x+w.y+w.z);
          vec3 P = vDPos*uDScale;
          h = dTex(P.yz, ch)*w.x + dTex(P.xz, ch)*w.y + dTex(P.xy, ch)*w.z;`}
          vec2 dH = vec2(dFdx(h), dFdy(h)) * vMP.y;
          normal = dBump(-vViewPosition, normal, dH, faceDirection);
        }`)
      .replace('#include <aomap_fragment>', `#include <aomap_fragment>
        reflectedLight.indirectDiffuse *= aoV; reflectedLight.indirectSpecular *= mix(aoV, 1., 0.3);
        reflectedLight.directDiffuse *= mix(0.6, 1., aoV);`)
      .replace('#include <lights_physical_fragment>', THREE.ShaderChunk.lights_physical_fragment.replace('material.sheenColor = sheenColor;', 'material.sheenColor = sheenColor * vMP.w;'));
  };
  mat.customProgramCacheKey = () => 'fig' + mode + '_' + sss;
  return mat;
}

export function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
export const lerp = (a, b, t) => a + (b - a) * t;
export function damp(a, b, k, dt) { return lerp(a, b, 1 - Math.exp(-k * dt)); }
export function smooth(t) { t = clamp01(t); return t * t * (3 - 2 * t); }
