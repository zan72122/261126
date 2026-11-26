// HDR render target -> light depth-of-field -> ACES filmic + sRGB, vignette, fine grain.
import * as THREE from 'three';

export class Post {
  constructor(renderer) {
    this.r = renderer;
    this.enabled = true;
    const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1);
    this.rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: isMobile ? 2 : 4, depthBuffer: true });
    this.rt.depthTexture = new THREE.DepthTexture(4, 4, THREE.UnsignedIntType);
    this.focus = 1.0; this.aperture = 0.8;
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        tCol: { value: this.rt.texture }, tDep: { value: this.rt.depthTexture },
        near: { value: 0.05 }, far: { value: 30 }, focus: { value: 1 }, aperture: { value: 1 },
        res: { value: new THREE.Vector2(1, 1) }, time: { value: 0 }, fade: { value: 0 },
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
      fragmentShader: `
        uniform sampler2D tCol; uniform sampler2D tDep; uniform float near, far, focus, aperture, time, fade; uniform vec2 res;
        varying vec2 vUv;
        float lin(float d){ float z=d*2.-1.; return 2.*near*far/(far+near-z*(far-near)); }
        float coc(float z){ return clamp(aperture*abs(1./focus-1./z)*focus*3.2, 0., 1.); }
        void main(){
          float z = lin(texture2D(tDep, vUv).r);
          float c = coc(z);
          vec3 col = texture2D(tCol, vUv).rgb;
          vec3 acc = col; float wsum = 1.;
          float rad = c * 7.0;
          if (rad > 0.4) {
            const float GA = 2.39996;
            for (int i=1;i<16;i++){
              float fi=float(i); float r = sqrt(fi/16.)*rad; float a = fi*GA;
              vec2 o = vec2(cos(a),sin(a))*r/res;
              float zs = lin(texture2D(tDep, vUv+o).r);
              float cs = coc(zs)*7.0;
              float w = smoothstep(r-1.0, r+0.5, max(cs, (zs>z? rad: cs)));
              acc += texture2D(tCol, vUv+o).rgb*w; wsum += w;
            }
          }
          col = acc/wsum;
          // vignette (lens falloff)
          vec2 q = vUv-0.5; q.x *= res.x/res.y;
          col *= mix(1.0, smoothstep(1.15, 0.25, length(q)), 0.35);
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          // film grain after the transfer curve
          float n = fract(sin(dot(vUv*res + time*61.0, vec2(12.9898,78.233)))*43758.5453);
          gl_FragColor.rgb += (n-0.5)*0.018;
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.08,0.055,0.04), fade);
        }`,
      depthTest: false, depthWrite: false,
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mat);
    this.qs = new THREE.Scene(); this.qs.add(this.quad);
    this.qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }
  setSize(w, h, pr) {
    this.rt.setSize(Math.floor(w * pr), Math.floor(h * pr));
    this.mat.uniforms.res.value.set(w * pr, h * pr);
  }
  render(scene, cam, t) {
    const u = this.mat.uniforms;
    u.near.value = cam.near; u.far.value = cam.far; u.focus.value = this.focus; u.aperture.value = this.aperture; u.time.value = t % 100;
    this.r.setRenderTarget(this.rt);
    this.r.render(scene, cam);
    this.r.setRenderTarget(null);
    this.r.render(this.qs, this.qc);
  }
}
