// NaN guards for three's built-in shaders (a NaN anywhere in a fragment can turn whole screens black on some GPUs).
// - normalize() inputs that can be zero (interpolated normals, screen-space derivatives in bump mapping, view dir)
//   go through safeNormalize, which returns a fixed unit vector for a zero-length input.
// - pow() bases that could go negative (sRGB transfer of slightly negative colors) are clamped to >= 0.
// Patched once, before any material compiles. Every replacement is checked so a three upgrade cannot skip one silently.
import { THREE } from './util.js';

export function patchShaderChunks() {
  const C = THREE.ShaderChunk;
  const misses = [];
  const rep = (chunk, from, to) => {
    const s = C[chunk];
    if (typeof s !== 'string' || s.indexOf(from) < 0) { misses.push(chunk + ': ' + from); return; }
    C[chunk] = s.split(from).join(to);
  };
  if (C.common.indexOf('safeNormalize') < 0) {
    C.common += '\nvec3 safeNormalize( vec3 v ) { float l2 = dot( v, v ); return l2 > 1e-24 ? v * inversesqrt( l2 ) : vec3( 0.0, 0.0, 1.0 ); }\n';
  }
  rep('normal_fragment_begin', 'normalize( vNormal )', 'safeNormalize( vNormal )');
  rep('normal_fragment_begin', 'normalize( cross( fdx, fdy ) )', 'safeNormalize( cross( fdx, fdy ) )');
  rep('bumpmap_pars_fragment', 'normalize( dFdx( surf_pos.xyz ) )', 'safeNormalize( dFdx( surf_pos.xyz ) )');
  rep('bumpmap_pars_fragment', 'normalize( dFdy( surf_pos.xyz ) )', 'safeNormalize( dFdy( surf_pos.xyz ) )');
  rep('bumpmap_pars_fragment', 'normalize( abs( fDet ) * surf_norm - vGrad )', 'safeNormalize( abs( fDet ) * surf_norm - vGrad )');
  rep('lights_fragment_begin', 'normalize( vViewPosition )', 'safeNormalize( vViewPosition )');
  rep('colorspace_pars_fragment', 'pow( value.rgb, vec3( 0.41666 ) )', 'pow( max( value.rgb, vec3( 0.0 ) ), vec3( 0.41666 ) )');
  rep('colorspace_pars_fragment', 'pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) )', 'pow( max( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 0.0 ) ), vec3( 2.4 ) )');
  if (misses.length) console.warn('patchShaderChunks: not found', misses);
  return misses.length === 0;
}
