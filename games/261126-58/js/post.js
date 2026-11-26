// Render pipeline: HDR scene -> (bloom) -> depth-of-field + ACES filmic + sRGB + vignette/grain.
import * as THREE from 'three';

const VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const BRIGHT = `
uniform sampler2D tColor; uniform float threshold; varying vec2 vUv;
void main(){
  vec3 c = texture2D(tColor, vUv).rgb;
  float l = max(c.r, max(c.g, c.b));
  float k = smoothstep(threshold, threshold * 2.5, l);
  gl_FragColor = vec4(c * k, 1.0);
}`;

const BLUR = `
uniform sampler2D tSrc; uniform vec2 dir; varying vec2 vUv;
void main(){
  vec3 s = texture2D(tSrc, vUv).rgb * 0.2270270270;
  s += texture2D(tSrc, vUv + dir * 1.3846153846).rgb * 0.3162162162;
  s += texture2D(tSrc, vUv - dir * 1.3846153846).rgb * 0.3162162162;
  s += texture2D(tSrc, vUv + dir * 3.2307692308).rgb * 0.0702702703;
  s += texture2D(tSrc, vUv - dir * 3.2307692308).rgb * 0.0702702703;
  gl_FragColor = vec4(s, 1.0);
}`;

const FINAL = `
uniform sampler2D tColor; uniform sampler2D tDepth; uniform sampler2D tBloom;
uniform vec2 res; uniform float cNear, cFar, focus, aperture, maxCoc, exposure, bloomStr, time, vig;
uniform vec3 grade; varying vec2 vUv;
float linZ(float d){ return cNear * cFar / (cFar - d * (cFar - cNear)); }
float coc(float z){ return clamp(aperture * abs(z - focus) / max(z, 0.01), 0.0, maxCoc); }
vec3 RRTAndODTFit(vec3 v){ vec3 a = v * (v + 0.0245786) - 0.000090537; vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081; return a / b; }
vec3 aces(vec3 color){
  const mat3 IN = mat3(vec3(0.59719,0.07600,0.02840), vec3(0.35458,0.90834,0.13383), vec3(0.04823,0.01566,0.83777));
  const mat3 OUT = mat3(vec3(1.60475,-0.10208,-0.00327), vec3(-0.53108,1.10813,-0.07276), vec3(-0.07367,-0.00605,1.07602));
  color *= exposure / 0.6;
  color = IN * color; color = RRTAndODTFit(color); color = OUT * color;
  return clamp(color, 0.0, 1.0);
}
vec3 toSRGB(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + time) * 43758.5453); }
void main(){
  float zc = linZ(texture2D(tDepth, vUv).r);
  float rc = coc(zc);
  vec3 acc = texture2D(tColor, vUv).rgb; float wsum = 1.0;
  if (rc > 0.4) {
    const float GA = 2.39996323;
    for (int i = 1; i < 14; i++) {
      float fi = float(i);
      float r = sqrt(fi / 13.0) * rc;
      vec2 o = vec2(cos(fi * GA), sin(fi * GA)) * r / res;
      vec2 uv2 = vUv + o;
      float zt = linZ(texture2D(tDepth, uv2).r);
      float rt = coc(zt);
      // background samples may not bleed onto sharp foreground
      float w = (zt < zc) ? smoothstep(r - 0.5, r + 0.5, rt) : 1.0;
      acc += texture2D(tColor, uv2).rgb * w; wsum += w;
    }
  }
  vec3 col = acc / wsum;
  col += texture2D(tBloom, vUv).rgb * bloomStr;
  vec2 q = vUv - 0.5; q.x *= res.x / res.y;
  col *= mix(1.0, smoothstep(1.05, 0.25, length(q)), vig);
  col *= grade;
  col = aces(col);
  col = toSRGB(col);
  col += (hash(vUv * res) - 0.5) / 255.0 * 1.5;
  gl_FragColor = vec4(col, 1.0);
}`;

export class Pipeline {
  constructor(renderer) {
    this.r = renderer;
    const dt = new THREE.DepthTexture(4, 4);
    dt.type = THREE.UnsignedIntType;
    this.rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4, depthTexture: dt, depthBuffer: true });
    const ro = { type: THREE.HalfFloatType, depthBuffer: false };
    this.b1 = new THREE.WebGLRenderTarget(4, 4, ro);
    this.b2 = new THREE.WebGLRenderTarget(4, 4, ro);
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.quad.frustumCulled = false;
    this.mBright = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: BRIGHT, uniforms: { tColor: { value: null }, threshold: { value: 1.2 } }, depthTest: false, depthWrite: false });
    this.mBlur = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: BLUR, uniforms: { tSrc: { value: null }, dir: { value: new THREE.Vector2() } }, depthTest: false, depthWrite: false });
    this.mFinal = new THREE.ShaderMaterial({
      vertexShader: VS, fragmentShader: FINAL, depthTest: false, depthWrite: false,
      uniforms: {
        tColor: { value: this.rt.texture }, tDepth: { value: dt }, tBloom: { value: this.b1.texture },
        res: { value: new THREE.Vector2(4, 4) }, cNear: { value: 0.05 }, cFar: { value: 60 },
        focus: { value: 1.3 }, aperture: { value: 6 }, maxCoc: { value: 7 }, exposure: { value: 1 },
        bloomStr: { value: 0.35 }, time: { value: 0 }, vig: { value: 0.35 }, grade: { value: new THREE.Vector3(1, 1, 1) },
      },
    });
    this.scene = new THREE.Scene();
    this.scene.add(this.quad);
  }
  setSize(w, h, dpr) {
    const W = Math.max(4, Math.floor(w * dpr)), H = Math.max(4, Math.floor(h * dpr));
    this.rt.setSize(W, H);
    this.b1.setSize(Math.max(4, W >> 2), Math.max(4, H >> 2));
    this.b2.setSize(Math.max(4, W >> 2), Math.max(4, H >> 2));
    this.mFinal.uniforms.res.value.set(W, H);
    this.W = W; this.H = H; this.dpr = dpr;
  }
  render(scene, camera, p) {
    const r = this.r, u = this.mFinal.uniforms;
    r.setRenderTarget(this.rt);
    r.render(scene, camera);
    // bloom
    this.quad.material = this.mBright; this.mBright.uniforms.tColor.value = this.rt.texture;
    r.setRenderTarget(this.b1); r.render(this.scene, this.cam);
    const bw = this.b1.width, bh = this.b1.height;
    this.quad.material = this.mBlur;
    for (let i = 0; i < 2; i++) {
      this.mBlur.uniforms.tSrc.value = this.b1.texture; this.mBlur.uniforms.dir.value.set((1 + i) / bw, 0);
      r.setRenderTarget(this.b2); r.render(this.scene, this.cam);
      this.mBlur.uniforms.tSrc.value = this.b2.texture; this.mBlur.uniforms.dir.value.set(0, (1 + i) / bh);
      r.setRenderTarget(this.b1); r.render(this.scene, this.cam);
    }
    // final
    u.cNear.value = camera.near; u.cFar.value = camera.far;
    u.focus.value = p.focus; u.aperture.value = p.aperture * this.H / 1000; u.maxCoc.value = 7 * this.dpr;
    u.exposure.value = p.exposure; u.bloomStr.value = p.bloom; u.time.value = (u.time.value + 0.37) % 10;
    this.mBright.uniforms.threshold.value = p.threshold || 1.2;
    u.grade.value.set(p.grade[0], p.grade[1], p.grade[2]);
    this.quad.material = this.mFinal;
    r.setRenderTarget(null); r.render(this.scene, this.cam);
  }
}
