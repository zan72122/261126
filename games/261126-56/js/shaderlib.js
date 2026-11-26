// Shared shader helpers: triplanar micro-bump (skin pores, weave, strands) for meshes without UVs.
import * as THREE from '../vendor/three.module.min.js';

export const PERTURB = /* glsl */`
vec3 perturbN2( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
  vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
  vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
  vec3 vN = surf_norm;
  vec3 R1 = cross( vSigmaY, vN );
  vec3 R2 = cross( vN, vSigmaX );
  float fDet = dot( vSigmaX, R1 ) * faceDirection;
  vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
  return normalize( abs( fDet ) * surf_norm - vGrad );
}
`;

/**
 * Adds a triplanar height-map bump (object/bind-space) to a standard/physical material.
 * opts: { map: Texture (grayscale height, repeat), scale: tiles per meter, amp, stretch: vec3 }
 */
export function addTriplanarBump(mat, opts) {
  const uniforms = {
    tDet: { value: opts.map },
    uDetScale: { value: opts.scale || 60 },
    uDetAmp: { value: opts.amp || 1.0 },
    uDetStretch: { value: opts.stretch || new THREE.Vector3(1, 1, 1) },
  };
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjP; varying vec3 vObjN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjP = position; vObjN = normal;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjP; varying vec3 vObjN;\nuniform sampler2D tDet; uniform float uDetScale; uniform float uDetAmp; uniform vec3 uDetStretch;\n' + PERTURB)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      {
        vec3 bw = pow(abs(normalize(vObjN)), vec3(4.0)); bw /= (bw.x + bw.y + bw.z);
        vec3 p = vObjP * uDetScale * uDetStretch;
        float h = texture2D(tDet, p.zy).r * bw.x + texture2D(tDet, p.xz).r * bw.y + texture2D(tDet, p.xy).r * bw.z;
        vec2 dh = vec2(dFdx(h), dFdy(h)) * uDetAmp;
        normal = perturbN2(-vViewPosition, normal, dh, faceDirection);
      }`);
  };
  mat.customProgramCacheKey = () => 'tri' + (opts.key || '');
  mat.userData.detUniforms = uniforms;
  return mat;
}
