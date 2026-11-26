// plane.js — a generic twin-turboprop commuter airliner at real scale (15 m long, 2 m fuselage)
// with paintable snow shells (fuselage + wings), an ice shell on the port wing, window lights.
import * as THREE from 'three';
import { tex, setMap, patch, pbr } from './core.js';
import { Field, fbm } from './field.js';

export const L = 15.0, AXIS_Y = 1.65;
export function fusR(x) {
  if (x > 12.6) { const t = Math.min(1, (x - 12.6) / 2.4); return Math.pow(Math.max(0, 1 - Math.pow(t, 2.3)), 0.5); }
  if (x < 4.5) { const t = x / 4.5; const s = t * t * (3 - 2 * t); return 0.16 + 0.84 * Math.pow(s, 0.8); }
  return 1.0;
}
export function fusH(x) {
  if (x < 4.5) return 0.55 * Math.pow(1 - x / 4.5, 1.6);
  if (x > 12.6) return -0.18 * Math.pow((x - 12.6) / 2.4, 1.5);
  return 0;
}
// u in [0,1] along x, v = 1 - theta/2pi ; theta 0 = top, +z starboard
export function fusPoint(u, v, out = new THREE.Vector3()) {
  const x = u * L, th = (1 - v) * Math.PI * 2, r = fusR(x);
  return out.set(x, AXIS_Y + fusH(x) + r * 1.05 * Math.cos(th), r * Math.sin(th));
}
// wing param: s span 0..1, v around airfoil (0 TE bottom, .5 LE, 1 TE top)
export function makeWingFn(o) {
  // o: rootZ, tipZ (signed), rootChord, tipChord, rootLE, tipLE, rootY, dihedral(rad), tRoot, tTip, vertical(false)
  return (s, v, out = new THREE.Vector3()) => {
    const chord = o.rootChord + (o.tipChord - o.rootChord) * s;
    const le = o.rootLE + (o.tipLE - o.rootLE) * s;
    const tk = o.tRoot + (o.tTip - o.tRoot) * s;
    const upper = v >= 0.5;
    const a = upper ? (v - 0.5) * 2 : (0.5 - v) * 2; // 0 at LE -> 1 at TE
    const xc = (1 - Math.cos(a * Math.PI)) / 2;
    let yt = 5 * tk * (0.2969 * Math.sqrt(xc) - 0.126 * xc - 0.3516 * xc * xc + 0.2843 * xc ** 3 - 0.1015 * xc ** 4);
    const camber = 0.02 * Math.sin(xc * Math.PI);
    const y = (upper ? yt : -yt) * chord + camber * chord;
    const span = o.rootZ + (o.tipZ - o.rootZ) * s;
    const x = le - xc * chord;
    if (o.vertical) return out.set(x, o.rootY + Math.abs(span - o.rootZ), y);
    return out.set(x, o.rootY + y + Math.abs(span - o.rootZ) * Math.tan(o.dihedral || 0), span);
  };
}

/** parametric surface with uv, analytic-ish normals, tangU/tangV (m per uv unit) */
export function paramGeo(fn, nu, nv, { flip = false, u0 = 0, u1 = 1, v0 = 0, v1 = 1, uvMap = null } = {}) {
  const pos = [], nor = [], uvs = [], tu = [], tv = [], idx = [];
  const p = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), d = new THREE.Vector3();
  const du = (u1 - u0) / nu * 0.5, dv = (v1 - v0) / nv * 0.5;
  for (let j = 0; j <= nv; j++) {
    const v = v0 + (v1 - v0) * j / nv;
    for (let i = 0; i <= nu; i++) {
      const u = u0 + (u1 - u0) * i / nu;
      fn(u, v, p);
      fn(Math.min(1, u + du), v, a); fn(Math.max(0, u - du), v, b);
      const su = (Math.min(1, u + du) - Math.max(0, u - du)) || 1e-6;
      a.sub(b).divideScalar(su);
      fn(u, Math.min(1, v + dv), c); fn(u, Math.max(0, v - dv), d);
      const sv = (Math.min(1, v + dv) - Math.max(0, v - dv)) || 1e-6;
      c.sub(d).divideScalar(sv);
      const n = new THREE.Vector3().crossVectors(a, c);
      if (flip) n.negate();
      if (n.lengthSq() < 1e-12) n.set(0, 1, 0);
      n.normalize();
      pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z);
      const uv = uvMap ? uvMap(u, v) : [u, v];
      uvs.push(uv[0], uv[1]);
      tu.push(a.x, a.y, a.z); tv.push(c.x, c.y, c.z);
    }
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const A = j * (nu + 1) + i, B = A + 1, Cc = A + nu + 1, D = Cc + 1;
    if (!flip) idx.push(A, B, D, A, D, Cc); else idx.push(A, D, B, A, Cc, D);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setAttribute('tangU', new THREE.Float32BufferAttribute(tu, 3));
  g.setAttribute('tangV', new THREE.Float32BufferAttribute(tv, 3));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

// ------------------------------------------------------------ shared GLSL
const NOISE_GLSL = `
  float h21x(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float vnx(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(h21x(i),h21x(i+vec2(1,0)),f.x), mix(h21x(i+vec2(0,1)),h21x(i+vec2(1,1)),f.x), f.y); }`;

/** snow layer whose thickness comes from a Field; vertices displaced along the base normal */
export function snowShellMaterial(field, maxDepth, repeat, extra = {}) {
  const m = pbr('snow', { repeat, roughness: 1, ns: 0.9 });
  m.color.setRGB(0.96, 0.97, 1.0);
  const U = { depthMap: { value: field.tex }, maxDepth: { value: maxDepth }, texel: { value: new THREE.Vector2(1 / field.w, 1 / field.h) }, cut: { value: 0.045 }, slide: { value: 0 } };
  m.userData.u = U;
  patch(m, {
    key: 'snowshell' + repeat.join('x'),
    uniforms: U,
    vertexPre: `attribute vec3 tangU; attribute vec3 tangV; uniform sampler2D depthMap; uniform float maxDepth; uniform vec2 texel; uniform float slide; varying vec2 vUv0; varying float vD;`,
    vertex: {
      beginnormal_vertex: `
        float d0 = texture2D(depthMap, uv).r;
        float gu = (texture2D(depthMap, uv+vec2(texel.x,0.)).r - texture2D(depthMap, uv-vec2(texel.x,0.)).r) * maxDepth / (2.0*texel.x*max(length(tangU),1e-3));
        float gv = (texture2D(depthMap, uv+vec2(0.,texel.y)).r - texture2D(depthMap, uv-vec2(0.,texel.y)).r) * maxDepth / (2.0*texel.y*max(length(tangV),1e-3));
        vec3 objectNormal = normal - tangU / max(length(tangU), 1e-4) * gu - tangV / max(length(tangV), 1e-4) * gv;
        objectNormal = dot(objectNormal, objectNormal) > 1e-8 ? normalize(objectNormal) : normal;
        vD = d0; vUv0 = uv;`,
      begin_vertex: `vec3 transformed = position + normal * (d0 * maxDepth + 0.004) + vec3(0.0, -slide, 0.0);`,
    },
    fragmentPre: `uniform sampler2D depthMap; uniform float cut; varying vec2 vUv0; varying float vD; ${NOISE_GLSL}`,
    fragment: {
      clipping_planes_fragment: `$
        float dd = texture2D(depthMap, vUv0).r;
        float crumb = vnx(vUv0 * vec2(${(repeat[0] * 9).toFixed(1)}, ${(repeat[1] * 9).toFixed(1)})) - 0.5;
        if (dd + crumb * 0.05 < cut) discard;`,
      aomap_fragment: `$
        float edgeAO = mix(0.55, 1.0, smoothstep(cut, cut + 0.18, dd));
        reflectedLight.indirectDiffuse *= edgeAO; reflectedLight.directDiffuse *= mix(0.8, 1.0, edgeAO);`,
    },
  });
  return m;
}

/** cap snow on small parts: thickens up-facing surfaces; uniform capSnow 0..1 */
export const capU = { capSnow: { value: 1 } };
export function addSnowCap(mat, thick = 0.08) {
  patch(mat, {
    key: 'cap',
    uniforms: capU,
    vertexPre: `uniform float capSnow; varying float vCap; varying vec3 vWPos; ${NOISE_GLSL}`,
    vertex: {
      begin_vertex: `$
        vec3 wn = normalize(mat3(modelMatrix) * objectNormal);
        float capW = smoothstep(0.25, 0.75, wn.y) * capSnow;
        vec3 cwp = (modelMatrix * vec4(position, 1.0)).xyz;
        float lump = 0.55 + 0.9 * vnx(cwp.xz * 2.3 + cwp.y) * vnx(cwp.xz * 0.9 - 3.0);
        transformed += objectNormal * capW * ${thick.toFixed(3)} * lump;
        vCap = capW; vWPos = (modelMatrix * vec4(position,1.0)).xyz;`,
    },
    fragmentPre: `varying float vCap; varying vec3 vWPos; ${NOISE_GLSL}`,
    fragment: {
      roughnessmap_fragment: `$
        float cn = vnx(vWPos.xz * 9.0 + vWPos.y * 3.0) * 0.6 + vnx(vWPos.xz * 31.0) * 0.4;
        float capk = smoothstep(0.35, 0.6, vCap + (cn - 0.5) * 0.5);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.90, 0.93, 0.97) * (0.9 + 0.1 * cn), capk);
        roughnessFactor = mix(roughnessFactor, 0.85, capk);`,
    },
  });
}

// ------------------------------------------------------------ the plane
export function buildPlane() {
  const root = new THREE.Group(); root.name = 'plane';
  const body = new THREE.Group(); root.add(body);   // body pivot for small motions
  body.position.set(-7.5, 0, 0);                     // fuselage x 0..15 -> world -7.5..7.5

  // fuselage material: painted aluminium, clearcoat, window id map for lights, snow dust & wetness
  const fm = pbr('fus', { physical: true, clearcoat: 0.55, clearcoatRoughness: 0.18, roughness: 1 });
  const winLit = new Uint8Array(32 * 4);
  const winTex = new THREE.DataTexture(winLit, 32, 1); winTex.needsUpdate = true;
  const fusSnow = new Field(512, 256, 1, { wrapV: true });
  const fusId = tex('fus_id.png', { clamp: false });
  fusId.magFilter = THREE.NearestFilter; fusId.minFilter = THREE.NearestFilter; fusId.generateMipmaps = false;
  const snowC = tex('snow_c.jpg', { srgb: true, repeat: [1, 1] });
  const FU = { winLit: { value: winTex }, fusId: { value: fusId }, depthMap: { value: fusSnow.tex }, snowTex: { value: snowC }, litColor: { value: new THREE.Color(1.0, 0.72, 0.42).multiplyScalar(5.5) }, cabin: { value: 0 } };
  patch(fm, {
    key: 'fus',
    uniforms: FU,
    vertexPre: `varying vec2 vUv0;`,
    vertex: { uv_vertex: `$ vUv0 = uv;` },
    fragmentPre: `uniform sampler2D winLit, fusId, depthMap, snowTex; uniform vec3 litColor; uniform float cabin; varying vec2 vUv0;`,
    fragment: {
      map_fragment: `$
        float sd = texture2D(depthMap, vUv0).r;
        vec3 sc = texture2D(snowTex, vUv0 * vec2(12.0, 5.0)).rgb;
        float dust = smoothstep(0.004, 0.05, sd + (sc.r - 0.9) * 0.25);
        diffuseColor.rgb = mix(diffuseColor.rgb, sc * vec3(0.95,0.97,1.0), dust);`,
      roughnessmap_fragment: `$ roughnessFactor = mix(roughnessFactor, 0.8, dust);`,
      emissivemap_fragment: `$
        vec3 idv = texture2D(fusId, vUv0).rgb;
        float wid = floor(idv.r * 40.0 + 0.5);
        float lit = texture2D(winLit, vec2((wid + 0.5) / 32.0, 0.5)).r * step(0.5, wid);
        // glow from a warm cabin: brighter toward the ceiling, soft falloff to the frame
        float glass = idv.g;
        totalEmissiveRadiance += litColor * lit * glass * (1.0 - dust) * (0.65 + 0.35 * fract(vUv0.y * 5.0 + 0.3));`,
    },
  });
  const fgeo = paramGeo(fusPoint, 240, 96, { u0: 0, u1: 1 });
  const fus = new THREE.Mesh(fgeo, fm);
  fus.castShadow = true; fus.receiveShadow = true; fus.name = 'fuselage';
  body.add(fus);
  // tail cap
  const tailCap = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 10), fm);
  tailCap.position.set(0.0, AXIS_Y + fusH(0), 0); tailCap.scale.set(0.6, 1.05, 1);
  body.add(tailCap);

  // wings
  const wingMat = pbr('wing', { physical: true, clearcoat: 0.4, clearcoatRoughness: 0.2, roughness: 1 });
  const iceField = new Field(256, 256, 3);   // 0 thickness, 1 clarity, 2 wetness  (port wing)
  const wingSnowP = new Field(256, 256, 1), wingSnowS = new Field(256, 256, 1);
  const wingO = { rootZ: -0.75, tipZ: -8.4, rootChord: 2.15, tipChord: 1.05, rootLE: 8.75, tipLE: 8.35, rootY: AXIS_Y - 0.66, dihedral: 0.075, tRoot: 0.16, tTip: 0.12 };
  const wingP = makeWingFn(wingO);
  const wingS = makeWingFn(Object.assign({}, wingO, { rootZ: 0.75, tipZ: 8.4 }));
  const WU = { wetMap: { value: iceField.tex }, snowMap: { value: wingSnowP.tex }, snowTex: { value: snowC } };
  const wingMatP = wingMat;
  patch(wingMatP, {
    key: 'wingP', uniforms: WU,
    vertexPre: `varying vec2 vUv0;`, vertex: { uv_vertex: `$ vUv0 = uv;` },
    fragmentPre: `uniform sampler2D wetMap, snowMap, snowTex; varying vec2 vUv0;`,
    fragment: {
      map_fragment: `$
        float wet = texture2D(wetMap, vUv0).b;
        float sd2 = texture2D(snowMap, vUv0).r;
        vec3 sc2 = texture2D(snowTex, vUv0 * vec2(6.0, 3.0)).rgb;
        float dust2 = smoothstep(0.004, 0.05, sd2 + (sc2.r - 0.9) * 0.25);
        vec3 beadM = texture2D(snowTex, vUv0 * vec2(40.0, 14.0)).rgb;
        float bead = smoothstep(0.93, 0.99, beadM.r) * wet;
        diffuseColor.rgb *= mix(1.0, 0.6, wet);
        diffuseColor.rgb = mix(diffuseColor.rgb, sc2, dust2);`,
      roughnessmap_fragment: `$ roughnessFactor = mix(roughnessFactor, 0.05, wet); roughnessFactor = mix(roughnessFactor, 0.8, dust2);`,
      normal_fragment_maps: `$ normal = normalize(normal + (beadM - 0.9) * 2.5 * wet * vec3(1.0, 1.0, 0.0));`,
    },
  });
  const wingMatS = wingMat.clone();
  const WUS = { snowMap: { value: wingSnowS.tex }, snowTex: { value: snowC } };
  setMap(wingMatS, 'map', tex('wing_c.jpg', { srgb: true })); setMap(wingMatS, 'normalMap', tex('wing_nrm.jpg'));
  const worm = tex('wing_orm.jpg'); setMap(wingMatS, 'roughnessMap', worm); setMap(wingMatS, 'aoMap', worm);
  patch(wingMatS, {
    key: 'wingS', uniforms: WUS,
    vertexPre: `varying vec2 vUv0;`, vertex: { uv_vertex: `$ vUv0 = uv;` },
    fragmentPre: `uniform sampler2D snowMap, snowTex; varying vec2 vUv0;`,
    fragment: {
      map_fragment: `$
        float sd2 = texture2D(snowMap, vUv0).r;
        vec3 sc2 = texture2D(snowTex, vUv0 * vec2(6.0, 3.0)).rgb;
        diffuseColor.rgb = mix(diffuseColor.rgb, sc2, smoothstep(0.004, 0.05, sd2 + (sc2.r - 0.9) * 0.25));`,
    },
  });
  const wgP = paramGeo(wingP, 64, 64);
  const wgS = paramGeo(wingS, 64, 64, { flip: true });
  const wP = new THREE.Mesh(wgP, wingMatP), wS = new THREE.Mesh(wgS, wingMatS);
  for (const w of [wP, wS]) { w.castShadow = w.receiveShadow = true; body.add(w); }
  wP.name = 'wingP';
  // wing tip caps
  for (const [fn, z] of [[wingP, -8.4], [wingS, 8.4]]) {
    const tip = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8), wingMat);
    const le = fn(1, 0.5), te = fn(1, 1);
    tip.position.set((le.x + te.x) / 2, le.y, z); tip.scale.set((le.x - te.x) / 2, 0.06, 0.06);
    body.add(tip);
  }

  // tail
  const finFn = makeWingFn({ rootZ: 0, tipZ: 2.4, rootChord: 3.1, tipChord: 1.25, rootLE: 4.0, tipLE: 2.0, rootY: AXIS_Y + 0.45 - AXIS_Y + 0.0, tRoot: 0.13, tTip: 0.11, vertical: true });
  const finGeo = paramGeo((s, v, o) => { finFn(s, v, o); o.y += AXIS_Y + 0.15; return o; }, 32, 48);
  const finMat = pbr('paint', { color: 0xe9ecef, repeat: [3, 3], physical: true, clearcoat: 0.5, roughness: 1 });
  addSnowCap(finMat, 0.07);
  const fin = new THREE.Mesh(finGeo, finMat); fin.castShadow = true; body.add(fin);
  // a slate stripe on the fin: second thin mesh slightly offset (decal-like band)
  for (const side of [-1, 1]) {
    const hsFn = makeWingFn({ rootZ: side * 0.15, tipZ: side * 3.1, rootChord: 1.55, tipChord: 0.8, rootLE: 1.95, tipLE: 1.25, rootY: AXIS_Y + 0.42, dihedral: 0.02, tRoot: 0.11, tTip: 0.1 });
    const hs = new THREE.Mesh(paramGeo(hsFn, 24, 32, { flip: side > 0 }), finMat);
    hs.castShadow = true; body.add(hs);
  }

  // engines: nacelles + spinners + 4-blade props
  const nacMat = pbr('paint', { color: 0xe6e9ec, repeat: [2, 2], physical: true, clearcoat: 0.5, roughness: 1 });
  addSnowCap(nacMat, 0.1);
  const darkMat = pbr('metal', { color: 0x2a2c30, repeat: [1, 1], metalness: 1, roughness: 1, metalMap: true });
  const propMat = pbr('paint', { color: 0x1e2024, repeat: [1, 1], roughness: 1 });
  const props = [];
  const nacProfile = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24; // 0 front -> 1 back
    let r;
    if (t < 0.12) r = 0.34 + 0.09 * Math.sin(t / 0.12 * Math.PI / 2);
    else if (t < 0.6) r = 0.43;
    else r = 0.43 * Math.pow(1 - (t - 0.6) / 0.4, 0.7) + 0.02;
    nacProfile.push(new THREE.Vector2(Math.max(0.02, r), -t * 4.0));
  }
  const nacGeo = new THREE.LatheGeometry(nacProfile, 40);
  nacGeo.rotateZ(Math.PI / 2); // lathe axis y -> x  (front at +x)
  for (const zs of [-2.75, 2.75]) {
    const fn = zs < 0 ? wingP : wingS;
    const s = (Math.abs(zs) - 0.75) / (8.4 - 0.75);
    const top = fn(s, 0.6);
    const g = new THREE.Group(); g.position.set(10.15, top.y + 0.16, zs); body.add(g);
    const nac = new THREE.Mesh(nacGeo, nacMat); nac.scale.set(1, 1, 1.0); nac.castShadow = true; nac.receiveShadow = true;
    g.add(nac);
    // intake lip (dark) under the spinner
    const intake = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.04, 8, 20), darkMat);
    intake.rotation.y = Math.PI / 2; intake.position.set(-0.35, -0.24, 0); g.add(intake);
    // exhaust stub
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.35, 14, 1, true), darkMat);
    ex.rotation.z = Math.PI / 2.4; ex.position.set(-1.1, 0.25, zs < 0 ? -0.33 : 0.33); g.add(ex);
    const hub = new THREE.Group(); hub.position.set(0.18, 0, 0); g.add(hub);
    const spProfile = [];
    for (let i = 0; i <= 16; i++) { const t = i / 16; spProfile.push(new THREE.Vector2(0.3 * Math.sqrt(1 - t * t) + 0.001, t * 0.55)); }
    const spinner = new THREE.Mesh(new THREE.LatheGeometry(spProfile.reverse(), 28).rotateZ(-Math.PI / 2), pbr('metal', { color: 0xd9dcdf, metalness: 1, roughness: 1, metalMap: true }));
    hub.add(spinner);
    for (let b = 0; b < 4; b++) {
      const blade = makeBlade(propMat);
      blade.rotation.x = b * Math.PI / 2 + 0.4;
      hub.add(blade);
    }
    props.push(hub);
  }

  // landing gear
  const tireMat = pbr('rubber', { color: 0x1b1b1c, repeat: [6, 1], roughness: 1 });
  const strutMat = pbr('metal', { color: 0x9aa0a6, metalness: 1, roughness: 1, metalMap: true });
  const wheels = [];
  const mkWheel = (r, w) => {
    const g = new THREE.Group();
    const prof = [];
    for (let i = 0; i <= 20; i++) {
      const a = -Math.PI / 2 + Math.PI * i / 20;
      prof.push(new THREE.Vector2(r * 0.62 + Math.cos(a) * r * 0.38, Math.sin(a) * w * 0.5));
    }
    const tg = new THREE.LatheGeometry(prof, 40); tg.rotateX(Math.PI / 2);
    const tire = new THREE.Mesh(tg, tireMat); tire.castShadow = true; g.add(tire);
    const hubm = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.6, r * 0.6, w * 0.8, 24).rotateX(Math.PI / 2), strutMat);
    g.add(hubm);
    return g;
  };
  // nose gear
  {
    const g = new THREE.Group(); g.position.set(13.0, 0, 0); body.add(g);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.0, 12), strutMat); st.position.y = 0.72; g.add(st);
    for (const z of [-0.13, 0.13]) { const w = mkWheel(0.25, 0.17); w.position.set(0, 0.25, z); g.add(w); wheels.push(w); }
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.5), nacMat); door.position.set(0, 1.0, 0.0); g.add(door);
  }
  for (const zs of [-2.75, 2.75]) {
    const g = new THREE.Group(); g.position.set(7.3, 0, zs); body.add(g);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 1.1, 12), strutMat); st.position.y = 0.92; g.add(st);
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 8), strutMat); br.position.set(0.35, 0.95, 0); br.rotation.z = 0.7; g.add(br);
    for (const z of [-0.2, 0.2]) { const w = mkWheel(0.36, 0.24); w.position.set(0, 0.36, z); g.add(w); wheels.push(w); }
  }

  // small details: antennas, beacon, nav lights, pitot, wipers
  const beaconMat = new THREE.MeshStandardMaterial({ color: 0x400000, emissive: 0xff2010, emissiveIntensity: 0 });
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), beaconMat);
  beacon.position.set(8.4, AXIS_Y + 1.05, 0); body.add(beacon);
  const navR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshStandardMaterial({ color: 0x300000, emissive: 0xff1a10, emissiveIntensity: 0 }));
  const navG = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshStandardMaterial({ color: 0x002000, emissive: 0x20ff60, emissiveIntensity: 0 }));
  const tP = wingP(1, 0.5), tS = wingS(1, 0.5);
  navR.position.set(tP.x - 0.3, tP.y, -8.5); navG.position.set(tS.x - 0.3, tS.y, 8.5);
  body.add(navR, navG);
  for (const [x, yy, h] of [[6.0, 1.0, 0.28], [9.5, 1.0, 0.22], [10.5, -1.0, 0.2]]) {
    const ant = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 0.015), strutMat);
    ant.position.set(x, AXIS_Y + yy * 1.05 + Math.sign(yy) * h / 2, 0); ant.rotation.z = 0.25; body.add(ant);
  }
  for (const z of [-0.62, 0.62]) {
    const pit = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 6), strutMat);
    pit.rotation.z = Math.PI / 2; pit.position.set(13.7, AXIS_Y - 0.1, z); body.add(pit);
  }

  // snow shells (scene 1): fuselage + both wings, plus port-wing ice (scene 2)
  const fusShellMat = snowShellMaterial(fusSnow, 0.75, [10, 4.2]);
  const fusShell = new THREE.Mesh(paramGeo(fusPoint, 200, 120), fusShellMat);
  fusShell.castShadow = true; fusShell.receiveShadow = true; fusShell.name = 'fusShell';
  body.add(fusShell);
  const wsMatP = snowShellMaterial(wingSnowP, 0.45, [5, 2]);
  const wsMatS = snowShellMaterial(wingSnowS, 0.45, [5, 2]);
  const wsP = new THREE.Mesh(paramGeo(wingP, 72, 56, { v0: 0.42, v1: 1 }), wsMatP);
  const wsS = new THREE.Mesh(paramGeo(wingS, 72, 56, { v0: 0.42, v1: 1, flip: true }), wsMatS);
  for (const w of [wsP, wsS]) { w.castShadow = true; w.receiveShadow = true; body.add(w); }

  // initial snow: thick on top, lumpy, drifting down the sides; nothing on the belly
  fusSnow.fill(0, (u, v) => {
    const th = (1 - v) * Math.PI * 2, up = Math.cos(th);
    const x = u * L;
    let d = 0.12 + 0.88 * smoothstep(-0.5, 0.95, up);
    d *= 0.75 + 0.5 * fbm(u * 18, v * 9, 3);
    d += (fbm(u * 6, v * 3, 7) - 0.5) * 0.35 * smoothstep(-0.3, 0.6, up);
    if (up < -0.55) d *= Math.max(0, (up + 0.8) / 0.25);
    if (x > 14.75) d *= Math.max(0, (15.05 - x) / 0.3);
    if (x < 0.6) d *= x / 0.6;
    return Math.max(0, Math.min(1, d));
  });
  const wingSnowFill = (f) => f.fill(0, (u, v) => {
    if (v < 0.46) return 0;
    let d = 0.55 + 0.45 * fbm(u * 10, v * 6, 11);
    d *= smoothstep(0.46, 0.55, v);
    if (u > 0.97) d *= (1 - u) / 0.03;
    return Math.min(1, d);
  });
  wingSnowFill(wingSnowP); wingSnowFill(wingSnowS);

  // ice shell on the port wing (under the snow; revealed in scene 2)
  iceField.fill(0, (u, v) => {
    if (v < 0.47) return 0;
    const n = fbm(u * 14, v * 8, 21);
    return Math.min(1, (0.55 + 0.6 * n) * smoothstep(0.47, 0.53, v) * (u > 0.985 ? 0 : 1));
  });
  iceField.fill(1, () => 0);
  iceField.fill(2, () => 0);
  const iceMat = iceMaterial(iceField);
  const iceMesh = new THREE.Mesh(paramGeo(wingP, 96, 64, { v0: 0.44, v1: 1 }), iceMat);
  iceMesh.renderOrder = 2; iceMesh.name = 'ice';
  iceMesh.visible = false;
  body.add(iceMesh);
  // icicles along the trailing edge + leading edge of the port wing
  const icicles = [];
  const icicleMat = new THREE.MeshPhysicalMaterial({ color: 0xb8d0e2, roughness: 0.05, transparent: true, opacity: 0.38, clearcoat: 1, envMapIntensity: 2.2, specularIntensity: 1 });
  setMap(icicleMat, 'normalMap', tex('ice_nrm.jpg'));
  for (let i = 0; i < 46; i++) {
    const s = 0.33 + Math.random() * 0.6;
    const te = Math.random() < 0.6;
    const p = wingP(s, te ? 0.995 : 0.5 + (Math.random() - 0.5) * 0.02);
    const h = 0.05 + Math.random() * 0.22;
    const g = new THREE.ConeGeometry(0.012 + Math.random() * 0.014, h, 7, 3);
    g.translate(0, -h / 2, 0);
    const pa = g.attributes.position;
    for (let k = 0; k < pa.count; k++) { pa.setX(k, pa.getX(k) + (Math.random() - .5) * 0.004); pa.setZ(k, pa.getZ(k) + (Math.random() - .5) * 0.004); }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, icicleMat);
    m.position.copy(p); m.position.y -= 0.01;
    m.userData = { s, v: te ? 0.995 : 0.5, h, melt: 0 };
    m.visible = false;
    body.add(m); icicles.push(m);
  }

  // cabin seats silhouettes behind windows? (kept implicit in emissive gradient)
  const plane = {
    root, body, fus, fusShell, wsP, wsS, wP, wS, iceMesh, icicles, props, wheels, beacon, navR, navG,
    fusSnow, wingSnowP, wingSnowS, iceField, winLit, winTex, wingP, wingS, wingO, fm, FU,
    shellMats: [fusShellMat, wsMatP, wsMatS],
    propSpeed: 0, propAngle: 0,
    setWindow(id, v) { winLit[id * 4] = Math.max(0, Math.min(255, v * 255)); winTex.needsUpdate = true; },
    windows: [], // {id, local:Vector3}
    update(dt) {
      plane.propAngle += plane.propSpeed * dt;
      for (const p of props) p.rotation.x = plane.propAngle;
      for (const f of [fusSnow, wingSnowP, wingSnowS, iceField]) f.upload();
    },
  };
  // window centres (local to body) for picking / hints : port side ids are odd 1,3,..17 ; starboard even
  let id = 1;
  for (let i = 0; i < 9; i++) {
    const x = 5.2 + 0.72 * i;
    plane.windows.push({ id: id, x, side: -1 }); id++;
    plane.windows.push({ id: id, x, side: 1 }); id++;
  }
  plane.windows.push({ id: id, x: 11.75, side: 1 });
  for (const w of plane.windows) {
    const th = w.side < 0 ? 3 * Math.PI / 2 + 0.15 : Math.PI / 2 - 0.15;
    w.local = fusPoint(w.x / L, 1 - th / (Math.PI * 2));
    w.lit = 0;
  }
  return plane;
}

function smoothstep(a, b, x) { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

function makeBlade(mat) {
  // twisted, tapered blade along +y from the hub
  const fn = (s, v, out) => {
    const r = 0.16 + s * 0.84;
    const chord = 0.17 * (1 - s * 0.45) * (s < 0.1 ? 0.6 + s * 4 : 1);
    const twist = 0.9 - s * 0.65;
    const a = v * Math.PI * 2;
    const cx = Math.cos(a) * chord * 0.5, cy = Math.sin(a) * chord * 0.07;
    return out.set(cx * Math.sin(twist) + cy * Math.cos(twist), r, cx * Math.cos(twist) - cy * Math.sin(twist));
  };
  const g = paramGeo(fn, 10, 12);
  const m = new THREE.Mesh(g, mat);
  m.castShadow = true;
  return m;
}

export function iceMaterial(field) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, transparent: true, envMapIntensity: 1.5 });
  const mask = tex('ice_mask.jpg', { repeat: [1, 1] });
  setMap(m, 'normalMap', tex('ice_nrm.jpg', { repeat: [9, 3] }));
  m.normalScale.set(1.4, 1.4);
  m.blending = THREE.CustomBlending; m.blendSrc = THREE.OneFactor; m.blendDst = THREE.OneMinusSrcAlphaFactor;
  m.depthWrite = false;
  const U = { iceMap: { value: field.tex }, iceMask: { value: mask }, maxIce: { value: 0.035 }, texel: { value: new THREE.Vector2(1 / field.w, 1 / field.h) }, frostBoost: { value: 0 } };
  m.userData.u = U;
  patch(m, {
    key: 'ice', uniforms: U,
    vertexPre: `attribute vec3 tangU; attribute vec3 tangV; uniform sampler2D iceMap; uniform float maxIce; uniform vec2 texel; varying vec2 vUv0;`,
    vertex: {
      beginnormal_vertex: `
        float i0 = texture2D(iceMap, uv).r;
        float gu = (texture2D(iceMap, uv+vec2(texel.x,0.)).r - texture2D(iceMap, uv-vec2(texel.x,0.)).r) * maxIce / (2.0*texel.x*max(length(tangU),1e-3));
        float gv = (texture2D(iceMap, uv+vec2(0.,texel.y)).r - texture2D(iceMap, uv-vec2(0.,texel.y)).r) * maxIce / (2.0*texel.y*max(length(tangV),1e-3));
        vec3 objectNormal = normal - tangU / max(length(tangU), 1e-4) * gu * 3.0 - tangV / max(length(tangV), 1e-4) * gv * 3.0;
        objectNormal = dot(objectNormal, objectNormal) > 1e-8 ? normalize(objectNormal) : normal;
        vUv0 = uv;`,
      begin_vertex: `vec3 transformed = position + normal * (i0 * maxIce + 0.002);`,
    },
    fragmentPre: `uniform sampler2D iceMap, iceMask; uniform float frostBoost; varying vec2 vUv0;`,
    fragment: {
      clipping_planes_fragment: `$
        vec4 iv = texture2D(iceMap, vUv0);
        if (iv.r < 0.025) discard;
        vec3 im = texture2D(iceMask, vUv0 * vec2(7.0, 2.6)).rgb;
        vec3 im2 = texture2D(iceMask, vUv0 * vec2(17.0, 6.0) + 0.37).rgb;
        float clarity = clamp(iv.g - frostBoost, 0.0, 1.0);
        float frost = (1.0 - clarity) * clamp(0.45 + 0.75 * im.r, 0.0, 1.0);`,
      map_fragment: `
        vec3 clearCol = vec3(0.5, 0.63, 0.74);
        vec3 frostCol = mix(vec3(0.70, 0.78, 0.88), vec3(0.93, 0.96, 1.0), im.r);
        diffuseColor.rgb = mix(clearCol, frostCol, frost);
        float bub = im2.g * (0.4 + 0.6 * clarity);
        diffuseColor.rgb += bub * 0.3 + im.r * frost * 0.12;
        // frost is translucent rime: thicker = whiter, thin = see-through to the panels below
        float thickA = mix(0.35, 0.82, smoothstep(0.1, 0.9, iv.r));
        diffuseColor.a = mix(0.08 + bub * 0.4 + im.b * 0.25, thickA * (0.75 + 0.25 * im.r), frost) * smoothstep(0.025, 0.12, iv.r);`,
      roughnessmap_fragment: `$ roughnessFactor = mix(0.03 + im.b * 0.2, 0.45 + 0.35 * im.r, frost);`,
      opaque_fragment: `
        float aA = diffuseColor.a;
        gl_FragColor = vec4(totalDiffuse * aA + totalSpecular * mix(1.0, 0.7, frost) * smoothstep(0.025, 0.08, iv.r) + totalEmissiveRadiance * aA, aA);`,
    },
  });
  return m;
}
