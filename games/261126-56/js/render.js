// Renderer + post: HDR scene -> (depth-of-field, soft glow, vignette) -> ACES filmic -> sRGB.
import * as THREE from '../vendor/three.module.min.js';

export class Renderer {
  constructor(canvas) {
    const r = this.r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false });
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NoToneMapping;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    this.maxDpr = Math.min(window.devicePixelRatio || 1, 2);
    this.dpr = this.maxDpr;
    this.rt = null;
    this.focus = 2.0; this.aperture = 1.0; this.exposure = 1.0;
    const isMobile = /iPhone|iPad|Android|Mobile/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent));
    this.isMobile = isMobile;
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
      uniforms: {
        tColor: { value: null }, tDepth: { value: null }, uRes: { value: new THREE.Vector2() },
        uNear: { value: 0.05 }, uFar: { value: 200 }, uFocus: { value: 2 }, uAperture: { value: 1 }, uExposure: { value: 1 },
        uTime: { value: 0 }, uFade: { value: 0 },
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: /* glsl */`
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D tColor; uniform sampler2D tDepth; uniform vec2 uRes;
        uniform float uNear, uFar, uFocus, uAperture, uExposure, uTime, uFade;
        float linDepth(float d){ float z = d * 2.0 - 1.0; return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear)); }
        float coc(float z){ return clamp(abs(1.0/uFocus - 1.0/z) * uAperture * uRes.y * 0.0075, 0.0, uRes.y * 0.0055); }
        vec3 RRTAndODTFit(vec3 v){ vec3 a = v * (v + 0.0245786) - 0.000090537; vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081; return a / b; }
        vec3 aces(vec3 color){
          const mat3 ACESInputMat = mat3(vec3(0.59719,0.07600,0.02840), vec3(0.35458,0.90834,0.13383), vec3(0.04823,0.01566,0.83777));
          const mat3 ACESOutputMat = mat3(vec3(1.60475,-0.10208,-0.00327), vec3(-0.53108,1.10813,-0.07276), vec3(-0.07367,-0.00605,1.07602));
          color *= uExposure / 0.6; color = ACESInputMat * color; color = RRTAndODTFit(color); color = ACESOutputMat * color; return clamp(color, 0.0, 1.0);
        }
        vec3 toSRGB(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
        const vec2 P[12] = vec2[12](vec2(-0.326,-0.406),vec2(-0.840,-0.074),vec2(-0.696,0.457),vec2(-0.203,0.621),vec2(0.962,-0.195),vec2(0.473,-0.480),
          vec2(0.519,0.767),vec2(0.185,-0.893),vec2(0.507,0.064),vec2(0.896,0.412),vec2(-0.322,-0.933),vec2(-0.792,-0.598));
        void main(){
          vec2 px = 1.0 / uRes;
          float z = linDepth(texture2D(tDepth, vUv).r);
          float c = coc(z);
          vec3 col = texture2D(tColor, vUv).rgb;
          vec3 sum = col; float wsum = 1.0;
          if (c > 0.6) {
            for (int i = 0; i < 12; i++) {
              vec2 o = P[i] * c * px;
              float zs = linDepth(texture2D(tDepth, vUv + o).r);
              float cs = coc(zs);
              float w = clamp(cs / c, 0.0, 1.0); // avoid sharp foreground bleeding into blurred bg
              w = mix(w, 1.0, step(zs, z));
              sum += texture2D(tColor, vUv + o).rgb * w; wsum += w;
            }
            col = sum / wsum;
          }
          // gentle halation on very bright areas (wet sheen, sky)
          vec3 hb = vec3(0.0);
          for (int i = 0; i < 6; i++) { vec2 o = P[i*2] * 9.0 * px; hb += max(texture2D(tColor, vUv + o).rgb - 3.2, 0.0); }
          col += hb * 0.03;
          vec3 m = aces(col);
          // vignette
          vec2 q = vUv - 0.5; float v = 1.0 - dot(q, q) * 0.55;
          m *= v;
          m = toSRGB(m);
          // fine grain
          float n = fract(sin(dot(vUv * uRes + uTime * 61.0, vec2(12.9898, 78.233))) * 43758.5453);
          m += (n - 0.5) * 0.012;
          m = mix(m, vec3(0.96, 0.95, 0.93), uFade);
          gl_FragColor = vec4(m, 1.0);
        }`,
      depthTest: false, depthWrite: false,
    }));
    this.qscene = new THREE.Scene(); this.qscene.add(this.quad);
    this.qcam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.frameTimes = []; this.lastAdapt = 0;
  }

  resize(w, h) {
    this.w = w; this.h = h;
    this.r.setPixelRatio(this.dpr);
    this.r.setSize(w, h, false);
    const pw = Math.floor(w * this.dpr), ph = Math.floor(h * this.dpr);
    if (this.rt) { this.rt.dispose(); this.rt.depthTexture.dispose(); }
    const dt = new THREE.DepthTexture(pw, ph); dt.type = THREE.UnsignedIntType;
    this.rt = new THREE.WebGLRenderTarget(pw, ph, { type: THREE.HalfFloatType, samples: this.isMobile ? 2 : 4, depthTexture: dt, depthBuffer: true });
    this.rt.texture.minFilter = this.rt.texture.magFilter = THREE.LinearFilter;
    const u = this.quad.material.uniforms; u.tColor.value = this.rt.texture; u.tDepth.value = dt; u.uRes.value.set(pw, ph);
  }

  render(scene, cam, t, dt) {
    const u = this.quad.material.uniforms;
    u.uNear.value = cam.near; u.uFar.value = cam.far; u.uFocus.value = this.focus; u.uAperture.value = this.aperture; u.uExposure.value = this.exposure; u.uTime.value = t % 100;
    this.r.setRenderTarget(this.rt);
    this.r.render(scene, cam);
    this.r.setRenderTarget(null);
    this.r.render(this.qscene, this.qcam);
    // adaptive resolution: keep >= 30 fps
    this.frameTimes.push(dt); if (this.frameTimes.length > 40) this.frameTimes.shift();
    if (t - this.lastAdapt > 2.5 && this.frameTimes.length >= 40) {
      const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.lastAdapt = t;
      if (avg > 1 / 31 && this.dpr > 0.9) { this.dpr = Math.max(0.9, this.dpr * 0.82); this.resize(this.w, this.h); this.frameTimes.length = 0; }
      else if (avg < 1 / 55 && this.dpr < this.maxDpr) { this.dpr = Math.min(this.maxDpr, this.dpr * 1.12); this.resize(this.w, this.h); this.frameTimes.length = 0; }
    }
  }
}
