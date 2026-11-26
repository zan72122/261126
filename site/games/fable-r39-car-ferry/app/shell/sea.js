// One low-poly sea mesh: a grid that follows the camera, dense in the middle, sparse outside.
// Vertex waves + scrolling photo texture in a small custom shader (no transmission/refraction).
import * as THREE from './three.js';

export const WAVE_AMP = 0.12;

export function createSea(tex, segments) {
  const N = segments; const half = N / 2;
  const f = (u) => Math.sign(u) * (72 * Math.abs(u) + 1150 * Math.pow(Math.abs(u), 5));
  const pos = new Float32Array((N + 1) * (N + 1) * 3);
  let k = 0;
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
    pos[k++] = f((i - half) / half); pos[k++] = 0; pos[k++] = f((j - half) / half);
  }
  const idx = [];
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2000);

  const uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
    uTime: { value: 0 }, uCenter: { value: new THREE.Vector3() }, uMap: { value: tex },
    uHasMap: { value: 0 }, uAmp: { value: WAVE_AMP }, uLite: { value: 0 },
    uDeep: { value: new THREE.Color(0x1d8fb8) }, uShallow: { value: new THREE.Color(0x46c4d8) },
    uSky: { value: new THREE.Color(0xcfeafc) }, uSun: { value: new THREE.Vector3(0.45, 0.8, 0.35).normalize() },
  }]);
  uniforms.uMap.value = tex;
  const mat = new THREE.ShaderMaterial({
    uniforms, fog: true,
    vertexShader: /* glsl */`
      uniform float uTime; uniform vec3 uCenter; uniform float uAmp;
      varying vec3 vWorld; varying vec3 vNormal; varying float vAtt;
      #include <fog_pars_vertex>
      void main() {
        vec3 p = position + vec3(uCenter.x, 0.0, uCenter.z);
        float dist = length(position.xz);
        float att = 1.0 - smoothstep(60.0, 150.0, dist);
        float a1 = dot(p.xz, vec2(0.13, 0.05)) + uTime * 1.1;
        float a2 = dot(p.xz, vec2(-0.07, 0.15)) + uTime * 0.9;
        float a3 = dot(p.xz, vec2(0.21, -0.17)) + uTime * 1.7;
        float h = (sin(a1) * 0.5 + sin(a2) * 0.35 + sin(a3) * 0.15) * uAmp * att;
        float dx = (cos(a1) * 0.5 * 0.13 + cos(a2) * 0.35 * -0.07 + cos(a3) * 0.15 * 0.21) * uAmp * att;
        float dz = (cos(a1) * 0.5 * 0.05 + cos(a2) * 0.35 * 0.15 + cos(a3) * 0.15 * -0.17) * uAmp * att;
        p.y = h;
        vNormal = vec3(-dx, 1.0, -dz); // never zero length
        vWorld = p; vAtt = att;
        vec4 mvPosition = viewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */`
      uniform float uTime; uniform sampler2D uMap; uniform float uHasMap; uniform float uLite;
      uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uSky; uniform vec3 uSun;
      varying vec3 vWorld; varying vec3 vNormal; varying float vAtt;
      #include <fog_pars_fragment>
      void main() {
        vec3 n = normalize(vNormal);
        vec3 toCam = cameraPosition - vWorld;
        vec3 v = toCam / max(length(toCam), 1e-3);
        vec2 uv1 = vWorld.xz / 24.0 + vec2(uTime * 0.012, uTime * 0.007);
        vec2 uv2 = vWorld.xz / 37.0 - vec2(uTime * 0.008, -uTime * 0.011);
        vec3 tex = mix(uShallow, uDeep, 0.5);
        if (uHasMap > 0.5) {
          if (uLite > 0.5) tex = texture2D(uMap, uv1).rgb;
          else tex = (texture2D(uMap, uv1).rgb + texture2D(uMap, uv2).rgb) * 0.5;
        }
        vec3 base = mix(tex, tex * vec3(0.85, 0.95, 1.05), 0.3);
        float ndl = max(dot(n, uSun), 0.0);
        vec3 col = base * (0.82 + 0.25 * ndl);
        vec3 hv = uSun + v; hv = hv / max(length(hv), 1e-3);
        float spec = pow(max(dot(n, hv), 1e-4), 80.0) * 0.55;
        float fres = pow(max(1.0 - max(dot(n, v), 0.0), 1e-4), 4.0);
        col = mix(col, uSky, clamp(fres * 0.6, 0.0, 0.6)) + vec3(spec);
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false; mesh.renderOrder = -1; mesh.name = 'sea';
  return {
    mesh,
    setLite(on) { uniforms.uLite.value = on ? 1 : 0; },
    setMap(t) { uniforms.uMap.value = t; uniforms.uHasMap.value = t && t.image ? 1 : 0; },
    update(t, center) {
      uniforms.uTime.value = t;
      uniforms.uCenter.value.set(Math.round(center.x / 2.5) * 2.5, 0, Math.round(center.z / 2.5) * 2.5);
    },
    /** same height function as the shader (for floating objects) */
    heightAt(x, z, t) {
      const a1 = x * 0.13 + z * 0.05 + t * 1.1, a2 = -x * 0.07 + z * 0.15 + t * 0.9, a3 = x * 0.21 - z * 0.17 + t * 1.7;
      return (Math.sin(a1) * 0.5 + Math.sin(a2) * 0.35 + Math.sin(a3) * 0.15) * WAVE_AMP;
    },
  };
}
