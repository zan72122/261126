// Render pipeline: HDR scene -> half-res blur -> composite (depth-of-field, ACES filmic, sRGB, vignette, grain).
import * as THREE from 'three';

const VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

export class Post {
  constructor(renderer, quality) {
    this.r = renderer; this.q = quality;
    this.scene = new THREE.Scene();
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
    const type = THREE.HalfFloatType;
    this.main = new THREE.WebGLRenderTarget(4, 4, { type, samples: quality.msaa, depthBuffer: true });
    this.main.depthTexture = new THREE.DepthTexture(4, 4);
    this.main.depthTexture.type = THREE.UnsignedIntType;
    this.ha = new THREE.WebGLRenderTarget(4, 4, { type, depthBuffer: false });
    this.hb = new THREE.WebGLRenderTarget(4, 4, { type, depthBuffer: false });
    for (const t of [this.ha, this.hb]) { t.texture.minFilter = t.texture.magFilter = THREE.LinearFilter; }
    this.blurMat = new THREE.ShaderMaterial({
      vertexShader: VS, depthTest: false, depthWrite: false,
      uniforms: { tSrc: { value: null }, uDir: { value: new THREE.Vector2() } },
      fragmentShader: `uniform sampler2D tSrc; uniform vec2 uDir; varying vec2 vUv;
        void main(){ vec3 c = texture2D(tSrc, vUv).rgb*0.227;
          c += texture2D(tSrc, vUv+uDir*1.385).rgb*0.316; c += texture2D(tSrc, vUv-uDir*1.385).rgb*0.316;
          c += texture2D(tSrc, vUv+uDir*3.231).rgb*0.070; c += texture2D(tSrc, vUv-uDir*3.231).rgb*0.070;
          gl_FragColor = vec4(c,1.0); }`,
    });
    this.compMat = new THREE.ShaderMaterial({
      vertexShader: VS, depthTest: false, depthWrite: false,
      uniforms: {
        tCol: { value: this.main.texture }, tBlur: { value: this.hb.texture }, tDepth: { value: this.main.depthTexture },
        uNear: { value: 0.05 }, uFar: { value: 30 }, uFocus: { value: 1.4 }, uRange: { value: 0.9 }, uDof: { value: quality.dof ? 1 : 0 },
        uExposure: { value: 1.35 }, uTime: { value: 0 }, uFade: { value: 0 }, uVig: { value: 0.32 }, uWarm: { value: 0 },
      },
      fragmentShader: `
        uniform sampler2D tCol, tBlur, tDepth; uniform float uNear, uFar, uFocus, uRange, uDof, uExposure, uTime, uFade, uVig, uWarm;
        varying vec2 vUv;
        vec3 RRTAndODTFit(vec3 v){ vec3 a = v*(v+0.0245786)-0.000090537; vec3 b = v*(0.983729*v+0.4329510)+0.238081; return a/b; }
        vec3 aces(vec3 color){
          const mat3 ACESInputMat = mat3(vec3(0.59719,0.07600,0.02840), vec3(0.35458,0.90834,0.13383), vec3(0.04823,0.01566,0.83777));
          const mat3 ACESOutputMat = mat3(vec3(1.60475,-0.10208,-0.00327), vec3(-0.53108,1.10813,-0.07276), vec3(-0.07367,-0.00605,1.07602));
          color *= uExposure/0.6; color = ACESInputMat*color; color = RRTAndODTFit(color); color = ACESOutputMat*color; return clamp(color,0.0,1.0); }
        vec3 toSRGB(vec3 c){ return mix(c*12.92, pow(c, vec3(0.41666))*1.055-0.055, step(0.0031308, c)); }
        float linDepth(float d){ float z = d*2.0-1.0; return (2.0*uNear*uFar)/(uFar+uNear - z*(uFar-uNear)); }
        float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
        void main(){
          vec3 c = texture2D(tCol, vUv).rgb;
          if (uDof > 0.5) {
            float z = linDepth(texture2D(tDepth, vUv).r);
            float coc = clamp(abs(z - uFocus)/uRange - 0.15, 0.0, 1.0);
            coc = coc*coc*(3.0-2.0*coc);
            c = mix(c, texture2D(tBlur, vUv).rgb, coc*0.85);
          }
          c = mix(c, c*vec3(1.06,1.0,0.92), uWarm);
          c = aces(c);
          vec2 q = vUv-0.5; c *= 1.0 - uVig*dot(q,q)*2.2;
          c = toSRGB(c);
          c += (hash(vUv*vec2(1931.0,1173.0)+fract(uTime))-0.5)*0.018;
          c = mix(c, vec3(0.0), uFade);
          gl_FragColor = vec4(c,1.0);
        }`,
    });
  }
  setSize(w, h, dpr) {
    const W = Math.round(w * dpr), H = Math.round(h * dpr);
    this.main.setSize(W, H);
    this.ha.setSize(Math.max(2, W >> 1), Math.max(2, H >> 1)); this.hb.setSize(Math.max(2, W >> 1), Math.max(2, H >> 1));
    this.hw = W >> 1; this.hh = H >> 1;
  }
  render(scene, camera, t) {
    const r = this.r;
    r.setRenderTarget(this.main);
    r.render(scene, camera);
    const cu = this.compMat.uniforms;
    if (cu.uDof.value > 0.5) {
      this.quad.material = this.blurMat;
      this.blurMat.uniforms.tSrc.value = this.main.texture; this.blurMat.uniforms.uDir.value.set(1.6 / this.hw, 0);
      r.setRenderTarget(this.ha); r.render(this.scene, this.cam);
      this.blurMat.uniforms.tSrc.value = this.ha.texture; this.blurMat.uniforms.uDir.value.set(0, 1.6 / this.hh);
      r.setRenderTarget(this.hb); r.render(this.scene, this.cam);
    }
    cu.uNear.value = camera.near; cu.uFar.value = camera.far; cu.uTime.value = t;
    this.quad.material = this.compMat;
    r.setRenderTarget(null); r.render(this.scene, this.cam);
  }
}
