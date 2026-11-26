// The site: foggy dawn street-side sidewalk repair. Real-world scale (meters).
import * as THREE from 'three';
import { tex, makeSky } from './core.js';
import { SLAB } from './concrete.js';

export function sRGB(hex) { return new THREE.Color().setStyle(hex, THREE.SRGBColorSpace); }

export function buildWorld(scene, T) {
  const W = {};
  // ---------------------------------------------------------------- ground (damp crushed stone & dirt)
  const gc = T.groundC, gn = T.groundN, go = T.groundORM;
  for (const t of [gc, gn, go]) t.repeat.set(24, 24);
  const groundMat = new THREE.MeshStandardMaterial({ map: gc, normalMap: gn, roughnessMap: go, aoMap: go, normalScale: new THREE.Vector2(1.2, 1.2), roughness: 1, envMapIntensity: 0.6 });
  const gg = new THREE.PlaneGeometry(36, 36, 1, 1); gg.rotateX(-Math.PI / 2);
  gg.setAttribute('uv1', gg.attributes.uv);
  const ground = new THREE.Mesh(gg, groundMat); ground.receiveShadow = true; ground.position.set(0, -0.002, 6); scene.add(ground);
  // excavation pit under the slab (crushed stone visible in slab shader) – darker rim around the form
  // ---------------------------------------------------------------- old sidewalk panels (left & right), broom-finished, weathered
  W.oldPanels = [];
  const oldMat = makeOldConcreteMat(T, 0.92, '#7f7b74');
  for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
    const g = new THREE.BoxGeometry(SLAB.W - 0.008, 0.1, SLAB.D, 1, 1, 1);
    g.translate(0, -0.05 + SLAB.top + 0.0, 0);
    const m = new THREE.Mesh(g, oldMat); m.position.set(side * (SLAB.W / 2 + 0.038 + SLAB.W / 2 + i * SLAB.W), 0, 0);
    m.receiveShadow = true; m.castShadow = true; scene.add(m); W.oldPanels.push(m);
  }
  // curb stones along the road side + asphalt road behind
  const curbMat = makeOldConcreteMat(T, 0.9, '#a9a59b');
  for (let i = 1; i <= 6; i++) {
    const c = new THREE.Mesh(new RoundedBox(0.995, 0.22, 0.15, 0.015), curbMat);
    c.position.set(0.6 + i * 1.0, 0.0, -1.02); c.castShadow = c.receiveShadow = true; scene.add(c);
  }
  const asphaltMat = new THREE.MeshStandardMaterial({ map: T.groundC, normalMap: T.groundN, color: sRGB('#5b5a58'), roughness: 0.88, envMapIntensity: 0.5 });
  const ag = new THREE.PlaneGeometry(36, 7); ag.rotateX(-Math.PI / 2);
  const asphalt = new THREE.Mesh(ag, asphaltMat.clone()); asphalt.material.map = T.groundC.clone(); asphalt.material.map.repeat.set(30, 6); asphalt.material.map.needsUpdate = true;
  asphalt.material.color = sRGB('#8a8986'); asphalt.material.normalScale = new THREE.Vector2(0.5, 0.5);
  asphalt.position.set(0, 0.003, -1.1 - 3.5); asphalt.receiveShadow = true; scene.add(asphalt);
  // white lane line (worn), far side
  const line = new THREE.Mesh(new THREE.PlaneGeometry(30, 0.12).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: sRGB('#b9b7b0'), roughness: 0.8, map: T.groundC }));
  line.position.set(0, 0.0, -4.6); line.receiveShadow = true; scene.add(line);

  // ---------------------------------------------------------------- forms (2x4 rough lumber) + stakes + nails
  const woodMat = new THREE.MeshStandardMaterial({ map: T.woodC, normalMap: T.woodN, roughnessMap: T.woodORM, aoMap: T.woodORM, roughness: 1, normalScale: new THREE.Vector2(1.4, 1.4), envMapIntensity: 0.7 });
  W.forms = new THREE.Group(); scene.add(W.forms);
  const bt = 0.038, bh = 0.089;
  const mkBoard = (len, horiz) => {
    const g = new RoundedBox(horiz ? len : bt, bh, horiz ? bt : len, 0.004);
    remapBoardUV(g, horiz ? len : bt, bh, horiz ? bt : len);
    const m = new THREE.Mesh(g, woodMat); m.castShadow = m.receiveShadow = true; return m;
  };
  for (const s of [-1, 1]) {
    const b = mkBoard(SLAB.W + bt * 2, true); b.position.set(0, SLAB.top - bh / 2, s * (SLAB.D / 2 + bt / 2)); W.forms.add(b);
    const e = mkBoard(SLAB.D, false); e.position.set(s * (SLAB.W / 2 + bt / 2), SLAB.top - bh / 2, 0); W.forms.add(e);
  }
  // stakes on front side
  for (let i = 0; i < 4; i++) {
    const g = new RoundedBox(0.036, 0.16, 0.036, 0.004); remapBoardUV(g, 0.036, 0.16, 0.036);
    const st = new THREE.Mesh(g, woodMat); st.position.set(-0.54 + i * 0.36, SLAB.top - 0.1, SLAB.D / 2 + bt + 0.018); st.castShadow = st.receiveShadow = true; W.forms.add(st);
  }
  // ---------------------------------------------------------------- rebar mesh (rusty) on chairs
  const rustMat = new THREE.MeshStandardMaterial({ color: sRGB('#4b3a30'), roughness: 0.9, metalness: 0.35, normalMap: T.metalN, normalScale: new THREE.Vector2(0.6, 0.6) });
  const barG = new THREE.CylinderGeometry(0.0045, 0.0045, 1, 7, 1); barG.rotateZ(Math.PI / 2);
  const nbx = 4, nbz = 9;
  const bars = new THREE.InstancedMesh(barG, rustMat, nbx + nbz); const M4 = new THREE.Matrix4();
  for (let i = 0; i < nbx; i++) { M4.compose(new THREE.Vector3(0, 0.03, -SLAB.D / 2 + 0.1 + i * 0.15), new THREE.Quaternion(), new THREE.Vector3(SLAB.W - 0.1, 1, 1)); bars.setMatrixAt(i, M4); }
  for (let i = 0; i < nbz; i++) { M4.compose(new THREE.Vector3(-SLAB.W / 2 + 0.1 + i * 0.155, 0.038, 0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2), new THREE.Vector3(SLAB.D - 0.1, 1, 1)); bars.setMatrixAt(nbx + i, M4); }
  bars.castShadow = true; bars.receiveShadow = true; scene.add(bars); W.rebar = bars;

  // ---------------------------------------------------------------- background: fence, building under construction, trees, crane (fog swallows detail)
  const fenceMat = new THREE.MeshStandardMaterial({ color: sRGB('#d8d8d2'), roughness: 0.55, metalness: 0.2, normalMap: T.metalN, envMapIntensity: 0.8 });
  for (let i = -8; i <= 8; i++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.4, 0.03), fenceMat);
    p.position.set(i * 1.82, 1.2, -13); p.receiveShadow = true; scene.add(p);
    const rib = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.05), fenceMat); rib.position.set(i * 1.82, 0.4, -12.97); scene.add(rib);
    const rib2 = rib.clone(); rib2.position.y = 2.0; scene.add(rib2);
  }
  const bldMat = new THREE.MeshStandardMaterial({ color: sRGB('#8f938f'), roughness: 0.9, normalMap: T.metalN, normalScale: new THREE.Vector2(0.4, 0.4) });
  const netMat = new THREE.MeshStandardMaterial({ color: sRGB('#7d8a7e'), roughness: 0.95, transparent: true, opacity: 0.85 });
  const bld = new THREE.Group(); scene.add(bld); bld.position.set(-2, 0, -20);
  for (let f = 0; f < 6; f++) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(14, 0.25, 8), bldMat); slab.position.set(0, f * 3.2 + 0.1, 0); bld.add(slab);
    for (let c = -2; c <= 2; c++) { const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.0, 0.5), bldMat); col.position.set(c * 3.3, f * 3.2 + 1.6, 3.5); bld.add(col); }
  }
  const net = new THREE.Mesh(new THREE.PlaneGeometry(15, 18), netMat); net.position.set(0, 9, 4.3); bld.add(net);
  // tower crane silhouette
  const craneMat = new THREE.MeshStandardMaterial({ color: sRGB('#8a8576'), roughness: 0.7 });
  const mast = new THREE.Mesh(new THREE.BoxGeometry(1.4, 32, 1.4), craneMat); mast.position.set(9, 16, -26); scene.add(mast);
  const jib = new THREE.Mesh(new THREE.BoxGeometry(34, 1.0, 1.0), craneMat); jib.position.set(3, 31, -26); scene.add(jib);
  // autumn street trees (maple), soft canopy made of many leaf cards
  W.trees = [];
  const trunkMat = new THREE.MeshStandardMaterial({ color: sRGB('#3d3129'), roughness: 0.95, normalMap: T.woodN });
  const leafMat = makeLeafCardMat();
  for (const [x, z, s] of [[2.6, -1.6, 0.9], [-5.5, -1.8, 1.15], [7, -2, 1.05], [-11, -2.2, 1.1], [1.5, -9, 1.2], [-3, -10, 1.1]]) {
    const t = new THREE.Group(); t.position.set(x, 0, z); scene.add(t);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09 * s, 0.14 * s, 3.2 * s, 10), trunkMat); trunk.position.y = 1.6 * s; trunk.castShadow = true; t.add(trunk);
    for (let b = 0; b < 4; b++) { const br = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 1.6, 6), trunkMat); br.position.set(Math.cos(b * 1.7) * 0.4, 3.0 * s, Math.sin(b * 1.7) * 0.4); br.rotation.set(Math.sin(b) * 0.7, 0, Math.cos(b * 1.7) * 0.7); t.add(br); }
    const n = 900; const cg = new THREE.PlaneGeometry(0.13, 0.13);
    const leaves = new THREE.InstancedMesh(cg, leafMat, n); const q = new THREE.Quaternion(), e = new THREE.Euler(), col = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const u = Math.random() * Math.PI * 2, v = Math.acos(Math.random() * 1.6 - 0.8), r = (1.5 + Math.random() * 0.5) * s;
      const p = new THREE.Vector3(Math.cos(u) * Math.sin(v) * r, 3.6 * s + Math.cos(v) * r * 0.8, Math.sin(u) * Math.sin(v) * r);
      e.set(Math.random() * 6, Math.random() * 6, Math.random() * 6); q.setFromEuler(e);
      M4.compose(p, q, new THREE.Vector3(1, 1, 1).multiplyScalar(0.8 + Math.random() * 0.6)); leaves.setMatrixAt(i, M4);
      col.setHSL(0.03 + Math.random() * 0.08, 0.55 + Math.random() * 0.25, 0.3 + Math.random() * 0.18, THREE.SRGBColorSpace); leaves.setColorAt(i, col);
    }
    leaves.castShadow = true; t.add(leaves); W.trees.push(t);
  }
  // fallen leaves on ground near slab
  {
    const n = 70; const g = new THREE.PlaneGeometry(0.09, 0.09); g.rotateX(-Math.PI / 2);
    const fl = new THREE.InstancedMesh(g, leafMat, n); const q = new THREE.Quaternion(), col = new THREE.Color();
    for (let i = 0; i < n; i++) {
      let x, z; do { x = (Math.random() - 0.5) * 9; z = 0.6 + Math.random() * 3.2; } while (Math.abs(x) < 1.2 && z < 1.4);
      if (Math.random() < 0.4) { z = -0.55 - Math.random() * 0.25 * 0; z = -0.62; x = 1.5 + Math.random() * 4; }
      q.setFromEuler(new THREE.Euler((Math.random() - 0.5) * 0.4, Math.random() * 6, (Math.random() - 0.5) * 0.4));
      M4.compose(new THREE.Vector3(x, 0.004 + (z < 0 ? 0.0 : 0), z), q, new THREE.Vector3(1, 1, 1).multiplyScalar(0.7 + Math.random() * 0.6)); fl.setMatrixAt(i, M4);
      col.setHSL(0.04 + Math.random() * 0.08, 0.35 + Math.random() * 0.25, 0.22 + Math.random() * 0.15, THREE.SRGBColorSpace); fl.setColorAt(i, col);
    }
    fl.receiveShadow = true; scene.add(fl);
  }
  // ---------------------------------------------------------------- traffic cones + work light
  const coneMat = new THREE.MeshPhysicalMaterial({ color: sRGB('#b4482a'), roughness: 0.45, clearcoat: 0.3, normalMap: T.metalN, normalScale: new THREE.Vector2(0.3, 0.3) });
  const stripeMat = new THREE.MeshStandardMaterial({ color: sRGB('#d2d3d0'), roughness: 0.35, metalness: 0.3 });
  for (const [x, z] of [[-2.3, 0.9], [2.6, 0.75], [-3.3, -0.1]]) {
    const c = new THREE.Group(); c.position.set(x, 0, z); scene.add(c);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.14, 0.68, 24, 1, true), coneMat); body.position.y = 0.37; body.castShadow = true; c.add(body);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.105, 0.12, 24, 1, true), stripeMat); st.position.y = 0.33; c.add(st);
    const base = new THREE.Mesh(new RoundedBox(0.36, 0.04, 0.36, 0.01), new THREE.MeshStandardMaterial({ color: sRGB('#2a2826'), roughness: 0.8 })); base.position.y = 0.02; base.castShadow = base.receiveShadow = true; c.add(base);
  }
  W.workLight = buildWorkLight(scene, T);
  return W;
}

function buildWorkLight(scene, T) {
  const g = new THREE.Group(); g.position.set(1.75, 0, 1.15); scene.add(g);
  const steel = new THREE.MeshStandardMaterial({ color: sRGB('#3b3c3e'), roughness: 0.5, metalness: 0.8, normalMap: T.metalN });
  const yellow = new THREE.MeshPhysicalMaterial({ color: sRGB('#b88a2a'), roughness: 0.45, clearcoat: 0.4, normalMap: T.metalN, normalScale: new THREE.Vector2(0.4, 0.4) });
  for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.05, 8), steel); leg.position.set(Math.cos(a) * 0.22, 0.48, Math.sin(a) * 0.22); leg.lookAt(0, 1.4, 0); leg.rotateX(Math.PI / 2); leg.castShadow = true; g.add(leg); }
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.9, 8), steel); pole.position.y = 1.25; g.add(pole);
  const head = new THREE.Group(); head.position.y = 1.72; g.add(head);
  const box = new THREE.Mesh(new RoundedBox(0.34, 0.26, 0.08, 0.015), yellow); box.castShadow = true; head.add(box);
  const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.29, 0.21), new THREE.MeshStandardMaterial({ color: 0x111111, emissive: new THREE.Color(1, 0.96, 0.88), emissiveIntensity: 6 }));
  lens.position.z = 0.041; head.add(lens);
  head.lookAt(new THREE.Vector3(-1.75, -1.3, -1.35).add(head.getWorldPosition(new THREE.Vector3())));
  return { group: g, head, lens };
}

function makeLeafCardMat() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const c = cv.getContext('2d');
  c.fillStyle = '#fff'; c.beginPath();
  for (let i = 0; i <= 40; i++) { const a = -Math.PI / 2 + i / 40 * Math.PI * 2; const lobe = Math.abs(Math.cos((a + Math.PI / 2) * 2.5)); const r = 12 + 18 * Math.pow(lobe, 3); c.lineTo(32 + Math.cos(a) * r, 34 + Math.sin(a) * r); }
  c.fill();
  c.strokeStyle = 'rgba(80,40,20,0.5)'; c.lineWidth = 1.2; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.62; c.beginPath(); c.moveTo(32, 36); c.lineTo(32 + Math.cos(a) * 26, 34 + Math.sin(a) * 26); c.stroke(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.7, envMapIntensity: 0.6 });
}

function makeOldConcreteMat(T, rough = 0.92, hex = '#b3afa5') {
  const m = new THREE.MeshStandardMaterial({ color: sRGB(hex), roughness: rough, envMapIntensity: 0.8 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.tD = { value: T.concreteD };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWP = (modelMatrix*vec4(transformed,1.)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vWP; uniform sampler2D tD;
      vec3 dBump2(vec3 sp, vec3 sn, vec2 dH, float fd){ vec3 sx=normalize(dFdx(sp)), sy=normalize(dFdy(sp)); vec3 R1=cross(sy,sn), R2=cross(sn,sx); float det=dot(sx,R1)*fd; return normalize(abs(det)*sn - sign(det)*(dH.x*R1+dH.y*R2)); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec2 pp = vWP.xz + vWP.y*vec2(0.7,0.3);
        vec4 dd = texture2D(tD, pp/0.3); vec4 d2 = texture2D(tD, pp/1.7);
        float broom = sin(pp.y*420. + d2.b*6.)*0.5+0.5;
        diffuseColor.rgb *= (0.8 + 0.3*d2.b) * (0.92 + 0.1*dd.g) * (1. - 0.12*dd.r) * (1. - 0.25*smoothstep(0.55,0.9,d2.r));
        float hgt = dd.r*0.6 + dd.g*0.3 + broom*0.25 + dd.a*-0.6;`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        normal = dBump2(-vViewPosition, normal, vec2(dFdx(hgt), dFdy(hgt))*0.9, faceDirection);`);
  };
  m.customProgramCacheKey = () => 'oldconc' + hex;
  return m;
}

function remapBoardUV(g, sx, sy, sz) {
  // world-scaled UVs so the 1024x256 plank texture (~1.0m x 0.25m) keeps real grain size
  const p = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv;
  const off = Math.random() * 3;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i));
    const long = sx > sz ? x : z;
    let u, v;
    if (ay > 0.5) { u = long; v = (sx > sz ? z : x) * 4; }
    else if ((sx > sz && ax > 0.5) || (sz >= sx && ax < 0.5)) { u = (sx > sz ? z : x) * 1; v = y * 4; }
    else { u = long; v = y * 4 + 0.3; }
    if (sy > Math.max(sx, sz)) { u = y; v = (ax > 0.5 ? z : x) * 4; }
    uv.setXY(i, u * 0.95 + off, v + 0.5);
  }
  g.setAttribute('uv1', uv.clone());
}

// small rounded box (bevelled edges catch light → no razor-sharp CG edges)
export class RoundedBox extends THREE.BufferGeometry {
  constructor(w, h, d, r, seg = 2) {
    super();
    const g = new THREE.BoxGeometry(w, h, d, seg * 2 + 1, seg * 2 + 1, seg * 2 + 1);
    const p = g.attributes.position, nn = g.attributes.normal; const v = new THREE.Vector3(), inner = new THREE.Vector3(w / 2 - r, h / 2 - r, d / 2 - r);
    // squeeze the segment grid so most of the face is flat and the bevel band is narrow
    const th = (2 * seg - 1) / (2 * seg + 1);
    const sq = (a, half) => { const t = a / half; const s = Math.sign(t), m = Math.abs(t); const k = (half - r) / half; return s * (m <= th + 1e-6 ? m / th * k : k + (m - th) / (1 - th) * (1 - k)) * half; };
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      v.set(sq(v.x, w / 2), sq(v.y, h / 2), sq(v.z, d / 2));
      const c = new THREE.Vector3(THREE.MathUtils.clamp(v.x, -inner.x, inner.x), THREE.MathUtils.clamp(v.y, -inner.y, inner.y), THREE.MathUtils.clamp(v.z, -inner.z, inner.z));
      const dlt = v.clone().sub(c);
      if (dlt.lengthSq() > 1e-12) { dlt.setLength(r); v.copy(c).add(dlt); dlt.normalize(); nn.setXYZ(i, dlt.x, dlt.y, dlt.z); }
      p.setXYZ(i, v.x, v.y, v.z);
    }
    this.copy(g);
  }
}
