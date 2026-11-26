// Characters: load the SDF-sculpted skinned meshes, build materials, a face rig
// (eyeballs, lids, lashes, brows, parametric lips) and a procedural pose/IK system.
import * as THREE from '../vendor/three.module.min.js';
import { addTriplanarBump } from './shaderlib.js';

const V3 = THREE.Vector3, Q = THREE.Quaternion;
const _v = new V3(), _v2 = new V3(), _v3 = new V3(), _q = new Q(), _q2 = new Q();

function srgbToLin(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
const LUT = new Float32Array(256); for (let i = 0; i < 256; i++) LUT[i] = srgbToLin(i / 255);

export async function loadPersonData(url) {
  const buf = await (await fetch(url)).arrayBuffer();
  const hl = new DataView(buf).getUint32(0, true);
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, hl)));
  const base = 4 + hl;
  const view = (b, T) => new T(buf, base + b.o, b.n);
  const meshes = header.meshes.map((m) => {
    const q = view(m.pos, Uint16Array), n = view(m.nrm, Int8Array), c = view(m.col, Uint8Array);
    const nv = m.nv;
    const pos = new Float32Array(nv * 3), nrm = new Float32Array(nv * 3), col = new Float32Array(nv * 3);
    for (let i = 0; i < nv; i++) {
      for (let k = 0; k < 3; k++) pos[i * 3 + k] = m.lo[k] + q[i * 3 + k] * m.sc[k];
      let x = n[i * 2] / 127, y = n[i * 2 + 1] / 127, z = 1 - Math.abs(x) - Math.abs(y);
      if (z < 0) { const ox = x; x = (1 - Math.abs(y)) * Math.sign(ox || 1); y = (1 - Math.abs(ox)) * Math.sign(y || 1); }
      const l = Math.hypot(x, y, z); nrm[i * 3] = x / l; nrm[i * 3 + 1] = y / l; nrm[i * 3 + 2] = z / l;
      col[i * 3] = LUT[c[i * 3]]; col[i * 3 + 1] = LUT[c[i * 3 + 1]]; col[i * 3 + 2] = LUT[c[i * 3 + 2]];
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(Array.from(view(m.si, Uint8Array)), 4));
    g.setAttribute('skinWeight', new THREE.BufferAttribute(new Float32Array(Array.from(view(m.sw, Uint8Array), (x) => x / 255)), 4));
    if (m.uv) {
      const u = view(m.uv, Uint16Array); const uv = new Float32Array(nv * 2);
      for (let i = 0; i < nv * 2; i++) uv[i] = (i & 1) ? 1 - u[i] / 65535 : u[i] / 65535;
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    }
    g.setIndex(new THREE.BufferAttribute(view(m.idx, m.i32 ? Uint32Array : Uint16Array).slice(), 1));
    g.computeBoundingSphere();
    return { name: m.name, mat: m.mat, geo: g, pivot: m.pivot };
  });
  return { header, meshes };
}

// ---------------------------------------------------------------- materials
export function makePeopleMaterials(T) {
  const M = {};
  M.skin = addTriplanarBump(new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: 0.52, sheen: 0.35, sheenRoughness: 0.55, sheenColor: new THREE.Color(1.0, 0.55, 0.45),
    specularIntensity: 0.55,
  }), { map: T.detSkin, scale: 90, amp: 0.55, key: 'skin' });
  // fake subsurface: lift the terminator a little with a warm wrap term
  const prev = M.skin.onBeforeCompile;
  M.skin.onBeforeCompile = (sh, r) => {
    prev(sh, r);
    sh.fragmentShader = sh.fragmentShader.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
      reflectedLight.indirectDiffuse += diffuseColor.rgb * vec3(0.10, 0.035, 0.02);`);
  };
  M.hair = addTriplanarBump(new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: 0.42, sheen: 0.6, sheenRoughness: 0.35, sheenColor: new THREE.Color(0.55, 0.42, 0.32),
    specularIntensity: 0.7,
  }), { map: T.detHair, scale: 120, amp: 1.6, stretch: new V3(1, 0.12, 1), key: 'hair' });
  M.scrunchie = addTriplanarBump(new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.8, sheen: 1, sheenColor: new THREE.Color(1, 0.6, 0.65) }), { map: T.detWeave, scale: 300, amp: 0.8, key: 'scr' });
  M.rubber = addTriplanarBump(new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.25, specularIntensity: 0.8,
  }), { map: T.detRubber, scale: 120, amp: 0.4, key: 'rub' });
  const cloth = (key, map, scale, amp, rough, sheen) => addTriplanarBump(new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: rough, sheen, sheenRoughness: 0.7, sheenColor: new THREE.Color(0.9, 0.9, 0.9),
  }), { map, scale, amp, key });
  M.denim = cloth('denim', T.detTwill, 160, 0.9, 0.92, 0.3);
  M.chino = cloth('chino', T.detTwill, 200, 0.6, 0.88, 0.3);
  M.linen = cloth('linen', T.detCanvas, 150, 0.8, 0.9, 0.4);
  M.canvas = cloth('canvas', T.detCanvas, 120, 1.0, 0.9, 0.3);
  M.shoe = cloth('shoe', T.detCanvas, 160, 0.7, 0.75, 0.2);
  return M;
}

// Tops get their own material so the dyed texture can be shown when the family wears their cloth.
export function makeTopMaterial(T, baseColorSRGB, key) {
  const m = addTriplanarBump(new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: 0.86, sheen: 0.45, sheenRoughness: 0.7, sheenColor: new THREE.Color(0.92, 0.92, 0.92),
  }), { map: T.detWeave, scale: 180, amp: 0.8, key: 'top' + key });
  m.userData.base = new THREE.Color().setRGB(...baseColorSRGB, THREE.SRGBColorSpace);
  m.color.copy(m.userData.base);
  return m;
}

// ---------------------------------------------------------------- face pieces
function eyeTexture(irisColor) {
  const W = 256, H = 128, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  // sclera
  const sg = g.createLinearGradient(0, 0, 0, H);
  sg.addColorStop(0, '#f4f1ec'); sg.addColorStop(0.5, '#ebe4dc'); sg.addColorStop(1, '#d9c3bb');
  g.fillStyle = sg; g.fillRect(0, 0, W, H);
  // veins (very faint)
  g.strokeStyle = 'rgba(200,90,90,0.12)'; g.lineWidth = 1;
  for (let i = 0; i < 30; i++) { g.beginPath(); const x = Math.random() * W; g.moveTo(x, H); g.quadraticCurveTo(x + (Math.random() - .5) * 30, H * 0.7, x + (Math.random() - .5) * 20, H * (0.45 + Math.random() * 0.15)); g.stroke(); }
  // iris: rows near v=0 are the front pole after rotation. iris spans 0..irisV
  const irisV = 0.215 * H, pupV = 0.082 * H;
  const ig = g.createLinearGradient(0, 0, 0, irisV);
  ig.addColorStop(0, irisColor[0]); ig.addColorStop(0.55, irisColor[1]); ig.addColorStop(0.92, irisColor[2]); ig.addColorStop(1, 'rgba(30,20,15,1)');
  g.fillStyle = ig; g.fillRect(0, 0, W, irisV);
  for (let i = 0; i < 160; i++) { // radial fibres
    const x = Math.random() * W; g.strokeStyle = `rgba(${Math.random() < .5 ? '255,220,170' : '20,10,5'},${0.1 + Math.random() * 0.15})`;
    g.beginPath(); g.moveTo(x, pupV); g.lineTo(x + (Math.random() - .5) * 4, irisV * (0.7 + Math.random() * 0.3)); g.stroke();
  }
  // limbal ring softness
  const lg = g.createLinearGradient(0, irisV - 6, 0, irisV + 5);
  lg.addColorStop(0, 'rgba(25,15,10,0)'); lg.addColorStop(0.5, 'rgba(25,15,10,0.85)'); lg.addColorStop(1, 'rgba(235,228,220,0)');
  g.fillStyle = lg; g.fillRect(0, irisV - 6, W, 11);
  g.fillStyle = '#070505'; g.fillRect(0, 0, W, pupV);
  const pg = g.createLinearGradient(0, pupV - 2, 0, pupV + 3); pg.addColorStop(0, '#070505'); pg.addColorStop(1, 'rgba(7,5,5,0)');
  g.fillStyle = pg; g.fillRect(0, pupV - 2, W, 5);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function makeEye(r, tex) {
  const geo = new THREE.SphereGeometry(r, 40, 24); geo.rotateX(Math.PI / 2);
  const mat = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.03, specularIntensity: 1 });
  const m = new THREE.Mesh(geo, mat);
  // cornea bulge: small transparent glossy cap gives the moving catchlight
  const cg = new THREE.SphereGeometry(r * 0.62, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5); cg.rotateX(Math.PI / 2);
  const cm = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, transmission: 0, transparent: true, opacity: 0.12, specularIntensity: 1, clearcoat: 1, depthWrite: false });
  const c = new THREE.Mesh(cg, cm); c.position.z = r * 0.82; c.scale.z = 0.45; m.add(c);
  return m;
}

function lidGeometry(r, theta) {
  const g = new THREE.SphereGeometry(r, 36, 14, 0, Math.PI * 2, 0, theta);
  return g;
}

// ---------------------------------------------------------------- Person
export class Person {
  constructor(data, mats, opts) {
    this.kind = data.header.kind;
    this.H = data.header.H;
    this.data = data;
    this.group = new THREE.Group();
    this.root = new THREE.Group(); // animated offset (bob, lean)
    this.group.add(this.root);
    const hb = data.header.bones;
    this.bones = hb.map((b) => { const bone = new THREE.Bone(); bone.name = b.name; return bone; });
    this.bindPos = hb.map((b) => new V3().fromArray(b.pos));
    hb.forEach((b, i) => {
      if (b.parent >= 0) { this.bones[b.parent].add(this.bones[i]); this.bones[i].position.copy(this.bindPos[i]).sub(this.bindPos[b.parent]); }
      else { this.root.add(this.bones[i]); this.bones[i].position.copy(this.bindPos[i]); }
    });
    this.B = {}; hb.forEach((b, i) => (this.B[b.name] = this.bones[i]));
    this.J = {}; for (const k in data.header.joints) this.J[k] = new V3().fromArray(data.header.joints[k]);
    this.group.updateMatrixWorld(true);
    this.skeleton = new THREE.Skeleton(this.bones);
    this.meshes = {};
    this.topMat = opts.topMat; this.scarfMat = opts.scarfMat;
    for (const m of data.meshes) {
      if (m.pivot && m.name.startsWith('pig') || m.name.startsWith('tie')) continue;
      let mat = mats[m.mat];
      if (m.name === 'top') mat = opts.topMat;
      if (m.name === 'scarf') mat = opts.scarfMat;
      const sm = new THREE.SkinnedMesh(m.geo, mat);
      sm.castShadow = true; sm.receiveShadow = true;
      sm.frustumCulled = false;
      this.root.add(sm);
      sm.bind(this.skeleton, new THREE.Matrix4());
      this.meshes[m.name] = sm;
    }
    if (this.meshes.scarf) this.meshes.scarf.visible = false;
    if (this.meshes.gloveL) { this.meshes.gloveL.visible = this.meshes.gloveR.visible = false; }
    if (this.meshes.apron) this.meshes.apron.visible = false;
    // pigtails: rigid meshes on swinging pivots under the head bone
    this.pigs = [];
    const headPos = this.bindPos[5];
    for (const m of data.meshes) {
      if (!m.name.startsWith('pig')) continue;
      const pv = new V3().fromArray(m.pivot);
      const piv = new THREE.Group(); piv.position.copy(pv).sub(headPos);
      this.B.head.add(piv);
      const geo = m.geo.clone(); geo.translate(-pv.x, -pv.y, -pv.z);
      geo.deleteAttribute('skinIndex'); geo.deleteAttribute('skinWeight');
      const mesh = new THREE.Mesh(geo, mats.hair); mesh.castShadow = true; mesh.receiveShadow = true;
      piv.add(mesh);
      const tie = data.meshes.find((x) => x.name === 'tie' + m.name[3]);
      if (tie) {
        const tg = tie.geo.clone(); tg.translate(-pv.x, -pv.y, -pv.z); tg.deleteAttribute('skinIndex'); tg.deleteAttribute('skinWeight');
        const tm = new THREE.Mesh(tg, mats.scrunchie); tm.castShadow = true; piv.add(tm);
      }
      this.pigs.push({ piv, ang: new V3(), vel: new V3(), side: m.name === 'pigL' ? 1 : -1 });
    }
    this.buildFace(data.header.face, opts);
    // pose state
    this.t = Math.random() * 10;
    this.expr = { smile: 0.3, open: 0, round: 0, browUp: 0, browTilt: 0, browAsym: 0, blink: 0, squint: 0, look: new THREE.Vector2(0, 0) };
    this.exprT = { ...this.expr, look: new THREE.Vector2() };
    this.lookAt = null;      // world point to look at
    this.handTarget = { L: null, R: null };
    this.armW = { L: 0, R: 0 };
    this.pose = { lean: 0, crouch: 0, clap: 0, wave: 0, jump: 0, walk: 0, walkPhase: 0, headTilt: 0, shrug: 0, armsUp: 0, laugh: 0, holdFront: 0 };
    this.poseT = { ...this.pose };
    this.blinkTimer = 2 + Math.random() * 3;
    this.feel = null; this.feelTime = 0;
    this.wind = 0;
  }

  buildFace(F, opts) {
    const head = this.B.head, hp = this.bindPos[5];
    const local = (arr) => new V3().fromArray(arr).sub(hp);
    const eyeTex = eyeTexture(opts.iris || ['#5a3a22', '#3e2616', '#24160d']);
    this.eyes = [];
    const skinCol = new THREE.Color().setRGB(...(opts.skin || [0.93, 0.74, 0.63]), THREE.SRGBColorSpace);
    const lidMat = addTriplanarBump(new THREE.MeshPhysicalMaterial({ color: skinCol.clone().multiplyScalar(0.93), roughness: 0.5, sheen: 0.3, sheenColor: new THREE.Color(1, 0.6, 0.5) }), { map: opts.T.detSkin, scale: 90, amp: 0.4, key: 'lid' });
    const lashMat = new THREE.MeshStandardMaterial({ color: 0x120c0a, roughness: 0.6 });
    const r = F.eyeR;
    for (let i = 0; i < 2; i++) {
      const g = new THREE.Group(); g.position.copy(local(F.eyes[i])); head.add(g);
      const ball = makeEye(r, eyeTex); g.add(ball);
      // upper lid cap around +y; rotate about x to open/close
      const up = new THREE.Group(); g.add(up);
      const ul = new THREE.Mesh(lidGeometry(r * 1.07, Math.PI * 0.56), lidMat); up.add(ul);
      const lash = new THREE.Mesh(new THREE.TorusGeometry(r * 1.07 * Math.sin(Math.PI * 0.56), r * (this.kind === 'papa' ? 0.055 : 0.075), 5, 28, Math.PI * 1.05), lashMat);
      lash.rotation.x = Math.PI / 2; lash.rotation.z = -Math.PI * 0.025 + Math.PI * 0.0; lash.position.y = r * 1.07 * Math.cos(Math.PI * 0.56);
      lash.rotation.z = Math.PI * -0.025; // arc centred toward +z
      lash.geometry.rotateZ(-Math.PI * 0.025);
      up.add(lash);
      lash.rotation.set(Math.PI / 2, 0, 0); lash.geometry.rotateZ(Math.PI * 0.0);
      // orient arc to front: torus arc starts at +x going counter-clockwise; after rotX(90) it lies in xz plane.
      lash.rotation.z = 0; lash.quaternion.setFromEuler(new THREE.Euler(Math.PI / 2, 0, -Math.PI * 0.0));
      lash.rotateZ(-Math.PI * 0.0);
      lash.rotation.y = 0;
      lash.geometry = new THREE.TorusGeometry(r * 1.075 * Math.sin(Math.PI * 0.56), r * (this.kind === 'papa' ? 0.05 : 0.07), 5, 28, Math.PI * 1.0);
      lash.rotation.set(-Math.PI / 2, 0, Math.PI); // arc now spans the front half (+z)
      const lo = new THREE.Group(); g.add(lo);
      const ll = new THREE.Mesh(lidGeometry(r * 1.055, Math.PI * 0.36), lidMat); ll.rotation.x = Math.PI; lo.add(ll);
      this.eyes.push({ g, ball, up, lo, side: i === 0 ? 1 : -1 });
    }
    // brows: flat tapered ribbons following the brow points
    this.brows = F.brows.map((pts, i) => {
      const P = pts.map((p) => local(p[0])), N = pts.map((p) => new V3().fromArray(p[1]));
      const n = P.length, seg = 6;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(n * seg * 3); const idx = [];
      for (let a = 0; a < n - 1; a++) for (let b = 0; b < seg; b++) {
        const i0 = a * seg + b, i1 = a * seg + (b + 1) % seg, i2 = (a + 1) * seg + b, i3 = (a + 1) * seg + (b + 1) % seg;
        idx.push(i0, i2, i1, i1, i2, i3);
      }
      geo.setIndex(idx); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = addTriplanarBump(new THREE.MeshStandardMaterial({ color: opts.browColor || 0x2a1a12, roughness: 0.8 }), { map: opts.T.detHair, scale: 400, amp: 2, key: 'brow' });
      const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = false; head.add(mesh);
      return { P, N, mesh, geo, side: i === 0 ? 1 : -1, thick: this.kind === 'papa' ? 1.3 : 1 };
    });
    // mouth
    const mp = local(F.mouth[0]), mn = new V3().fromArray(F.mouth[1]);
    const mx = new V3(1, 0, 0); mx.sub(_v.copy(mn).multiplyScalar(mx.dot(mn))).normalize();
    const my = new V3().crossVectors(mn, mx);
    this.mouth = { p: mp, n: mn, x: mx, y: my, R: Math.max(F.mouth[2], 0.02), w: F.mouthW };
    const lipCol = new THREE.Color().setRGB(...(opts.lip || [0.86, 0.5, 0.5]), THREE.SRGBColorSpace);
    this.mouth.lipMat = new THREE.MeshPhysicalMaterial({ color: lipCol, roughness: 0.38, sheen: 0.4, sheenColor: new THREE.Color(1, 0.6, 0.6), polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
    this.mouth.inMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 });
    this.mouth.lips = new THREE.Mesh(new THREE.BufferGeometry(), this.mouth.lipMat);
    this.mouth.inner = new THREE.Mesh(new THREE.BufferGeometry(), this.mouth.inMat);
    head.add(this.mouth.lips); head.add(this.mouth.inner);
    this.mouthKey = '';
  }

  updateBrows() {
    const e = this.expr;
    for (const b of this.brows) {
      const n = b.P.length, seg = 6, pos = b.geo.attributes.position.array;
      for (let a = 0; a < n; a++) {
        const t = a / (n - 1); // 0 = inner? points go from ex - .. to ex + .. ; for side 1 inner is low x
        const inner = b.side > 0 ? 1 - t : t; // 1 at inner end
        const up = (e.browUp * 0.0045 + e.browTilt * 0.004 * inner - e.browTilt * 0.001 + (b.side > 0 ? e.browAsym : -e.browAsym) * 0.004 - e.squint * 0.0015) * (this.H / 1.1) ** 0.4;
        const P = _v.copy(b.P[a]); P.y += up + (b.side > 0 ? 0 : 0);
        const N = b.N[a];
        const w = (0.0016 + 0.0018 * Math.sin(Math.PI * Math.min(1, 0.15 + inner * 0.95))) * b.thick * (this.H / 1.1) ** 0.4;
        const h = 0.0011 * b.thick;
        // ring: ellipse in plane spanned by up (y) and normal
        for (let s = 0; s < seg; s++) {
          const ang = (s / seg) * Math.PI * 2;
          const off = _v2.set(0, Math.cos(ang) * w, 0).addScaledVector(N, (Math.sin(ang) * 0.5 + 0.7) * h * 1.4);
          const k = (a * seg + s) * 3; pos[k] = P.x + off.x; pos[k + 1] = P.y + off.y; pos[k + 2] = P.z + off.z;
        }
      }
      b.geo.attributes.position.needsUpdate = true; b.geo.computeVertexNormals();
    }
  }

  updateMouth() {
    const e = this.expr, m = this.mouth;
    const key = [e.smile, e.open, e.round].map((x) => x.toFixed(3)).join();
    if (key === this.mouthKey) return; this.mouthKey = key;
    const S = (this.H / 1.1) ** 0.35;
    const w = m.w * (1 + 0.18 * e.smile - 0.35 * e.round) * (1 + 0.1 * e.open);
    const gap = (0.0012 + 0.011 * e.open + 0.006 * e.round) * S;
    const N = 17;
    const up = [], dn = [], upO = [], dnO = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1) * 2 - 1; // -1..1
      const x = t * w;
      const corner = t * t;
      const sm = e.smile * 0.0042 * S * (corner * 1.1 - 0.15);
      const env = Math.pow(Math.max(0, 1 - t * t), 0.5 + 0.4 * e.round);
      const yu = sm + gap * 0.42 * env + (e.open > 0.05 ? 0.0006 * S : 0);
      const yd = sm - gap * 0.58 * env * (1 - 0.25 * e.smile * (1 - e.round));
      const thU = (0.0021 + 0.0013 * (1 - Math.abs(t))) * S * (1 - 0.6 * corner);
      const bow = -0.0007 * S * Math.exp(-((t / 0.17) ** 2)) * (1 - e.open * 0.6);
      const thD = (0.0032 + 0.0012 * (1 - Math.abs(t))) * S * (1 - 0.75 * corner);
      up.push([x, yu]); upO.push([x * 1.02, yu + thU + bow]);
      dn.push([x, yd]); dnO.push([x * 1.02, yd - thD]);
    }
    const toW = (x, y, bulge) => {
      const z = -(x * x) / (2 * m.R) - (y * y) / (2 * 0.045) + bulge;
      return new V3().copy(m.p).addScaledVector(m.x, x).addScaledVector(m.y, y).addScaledVector(m.n, z);
    };
    // lips
    const lp = [], li = [];
    const band = (inner, outer, bul) => {
      const b0 = lp.length / 3;
      for (let i = 0; i < N; i++) {
        const t = Math.abs(i / (N - 1) * 2 - 1);
        const mid = (1 - t * t);
        const a = toW(inner[i][0], inner[i][1], 0.0004 * S + 0.0004 * mid);
        const c = toW((inner[i][0] + outer[i][0]) / 2, (inner[i][1] + outer[i][1]) / 2, (0.0008 + bul * mid) * S);
        const o = toW(outer[i][0], outer[i][1], 0.0002 * S);
        lp.push(a.x, a.y, a.z, c.x, c.y, c.z, o.x, o.y, o.z);
      }
      for (let i = 0; i < N - 1; i++) for (let k = 0; k < 2; k++) {
        const a = b0 + i * 3 + k, b = a + 1, c = a + 3, d = a + 4;
        li.push(a, c, b, b, c, d);
      }
    };
    band(up, upO, 0.0012); band(dn, dnO, 0.0016);
    const g = m.lips.geometry; g.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3)); g.setIndex(li); g.computeVertexNormals();
    // mouth interior (dark), teeth, tongue
    const ip = [], ic = [], ii = [];
    const dark = [0.16, 0.04, 0.04], teeth = [0.92, 0.9, 0.86], tongue = [0.75, 0.32, 0.33];
    for (let i = 0; i < N; i++) {
      const x = up[i][0];
      const yu = up[i][1], yd = dn[i][1];
      const h = yu - yd;
      const rows = [[yu, teeth], [yu - Math.min(h * 0.32, 0.0026 * S), teeth], [yu - Math.min(h * 0.36, 0.003 * S), dark], [yd + h * 0.3, dark], [yd, tongue]];
      for (const [y, c] of rows) {
        const p = toW(x * 0.98, y, -0.0012 * S);
        ip.push(p.x, p.y, p.z); ic.push(...c);
      }
    }
    for (let i = 0; i < N - 1; i++) for (let k = 0; k < 4; k++) {
      const a = i * 5 + k, b = a + 1, c = a + 5, d = a + 6; ii.push(a, b, c, b, d, c);
    }
    const gi = m.inner.geometry; gi.setAttribute('position', new THREE.Float32BufferAttribute(ip, 3));
    gi.setAttribute('color', new THREE.Float32BufferAttribute(ic.map((x) => srgbToLin(x)), 3)); gi.setIndex(ii); gi.computeVertexNormals();
  }

  // ---------------------------------------------------------------- expressions
  setFeel(name, dur = 0) {
    this.feel = name; this.feelTime = dur;
    const E = this.exprT;
    const set = (o) => { Object.assign(E, { smile: 0.3, open: 0, round: 0, browUp: 0, browTilt: 0, browAsym: 0, squint: 0 }, o); };
    switch (name) {
      case 'happy': set({ smile: 0.9, open: 0.25, browUp: 0.3, squint: 0.3 }); break;
      case 'laugh': set({ smile: 1.0, open: 0.75, browUp: 0.5, squint: 0.6 }); break;
      case 'wow': set({ smile: 0.2, open: 0.55, round: 0.8, browUp: 1.0 }); break;
      case 'oops': set({ smile: -0.3, open: 0.45, round: 0.6, browUp: 0.8, browTilt: 0.8 }); break;
      case 'sheepish': set({ smile: 0.6, open: 0.15, browTilt: 0.9, browUp: 0.2, squint: 0.2 }); break;
      case 'huh': set({ smile: -0.15, open: 0.1, round: 0.3, browAsym: 0.9, browUp: 0.3 }); break;
      case 'focus': set({ smile: 0.15, open: 0.0, browUp: -0.3, browTilt: -0.2, squint: 0.15 }); break;
      case 'proud': set({ smile: 0.85, open: 0.1, browUp: 0.2, squint: 0.35 }); break;
      default: set({});
    }
  }

  // ---------------------------------------------------------------- animation
  update(dt, ctx) {
    this.t += dt;
    if (this.feelTime > 0) { this.feelTime -= dt; if (this.feelTime <= 0) this.setFeel('neutral'); }
    // expression smoothing
    const k = 1 - Math.exp(-dt * 10);
    for (const n of ['smile', 'open', 'round', 'browUp', 'browTilt', 'browAsym', 'squint']) this.expr[n] += (this.exprT[n] - this.expr[n]) * k;
    // talking/laughing jaw flutter
    let open = this.expr.open;
    if (this.pose.laugh > 0.1) open = Math.min(1, open + 0.25 * this.pose.laugh * (0.5 + 0.5 * Math.sin(this.t * 22)));
    const saveOpen = this.expr.open; this.expr.open = open;
    this.updateMouth(); this.expr.open = saveOpen;
    this.updateBrows();
    // blink
    this.blinkTimer -= dt;
    if (this.blinkTimer < 0) { this.blinkTimer = 2.2 + Math.random() * 3.5; this.blinkT = 0.16; }
    let blink = 0; if (this.blinkT > 0) { this.blinkT -= dt; blink = Math.sin(Math.PI * (1 - this.blinkT / 0.16)); }
    // pose smoothing
    const kp = 1 - Math.exp(-dt * 6);
    for (const n in this.poseT) if (n !== 'walkPhase') this.pose[n] += (this.poseT[n] - this.pose[n]) * kp;
    this.applyPose(dt, ctx, blink);
  }

  applyPose(dt, ctx, blink) {
    const B = this.B, P = this.pose, t = this.t;
    for (const b of this.bones) b.quaternion.identity();
    this.root.position.set(0, 0, 0);
    // breathing & idle sway
    const br = Math.sin(t * 1.7) * 0.012;
    B.chest.rotation.x = -br * 0.6;
    B.spine.rotation.z = Math.sin(t * 0.6) * 0.012;
    // walking
    if (P.walk > 0.01) {
      this.pose.walkPhase += dt * 8.5 * P.walk;
      const ph = this.pose.walkPhase, a = 0.45 * P.walk;
      B.thighL.rotation.x = -Math.sin(ph) * a; B.thighR.rotation.x = Math.sin(ph) * a;
      B.shinL.rotation.x = Math.max(0, Math.sin(ph + 1.3)) * a * 1.3; B.shinR.rotation.x = Math.max(0, Math.sin(ph + 1.3 + Math.PI)) * a * 1.3;
      this.root.position.y += Math.abs(Math.cos(ph)) * 0.02 * P.walk * this.H;
      B.hips.rotation.y = Math.sin(ph) * 0.08 * P.walk;
    }
    // crouch (knees bend, hips down)
    if (P.crouch > 0.01) {
      const c = P.crouch;
      B.thighL.rotation.x += -0.9 * c; B.thighR.rotation.x += -0.9 * c;
      B.shinL.rotation.x += 1.5 * c; B.shinR.rotation.x += 1.5 * c;
      B.footL.rotation.x += -0.6 * c; B.footR.rotation.x += -0.6 * c;
      B.spine.rotation.x += 0.35 * c;
      this.root.position.y -= 0.17 * c * this.H;
      this.root.position.z -= 0.0 * c;
    }
    // jump
    if (P.jump > 0.01) {
      const j = Math.max(0, Math.sin(t * 7)) * P.jump;
      this.root.position.y += j * 0.12 * this.H / 1.1;
      B.shinL.rotation.x += (1 - j) * 0.4 * P.jump; B.shinR.rotation.x += (1 - j) * 0.4 * P.jump;
      B.thighL.rotation.x -= (1 - j) * 0.25 * P.jump; B.thighR.rotation.x -= (1 - j) * 0.25 * P.jump;
    }
    B.spine.rotation.x += P.lean * 0.35;
    B.chest.rotation.x += P.lean * 0.2;
    // laugh shake
    if (P.laugh > 0.01) { B.chest.rotation.x += Math.sin(t * 20) * 0.03 * P.laugh - 0.08 * P.laugh; B.head.rotation.x -= 0.15 * P.laugh; }
    // shrug
    B.clavL.rotation.z = 0.15 * P.shrug; B.clavR.rotation.z = -0.15 * P.shrug;
    // default relaxed arms: from A-pose bring arms closer to body
    const relax = 0.3;
    B.uarmL.rotation.z = -relax; B.uarmR.rotation.z = relax;
    B.farmL.rotation.x = -0.18; B.farmR.rotation.x = -0.18;
    B.uarmL.rotation.x = Math.sin(t * 1.1) * 0.02; B.uarmR.rotation.x = -Math.sin(t * 1.1) * 0.02;
    if (P.walk > 0.01) { B.uarmL.rotation.x += Math.sin(this.pose.walkPhase) * 0.35 * P.walk; B.uarmR.rotation.x -= Math.sin(this.pose.walkPhase) * 0.35 * P.walk; }
    // clap: both hands meet in front of chest
    if (P.clap > 0.01) {
      const c = P.clap, beat = Math.abs(Math.sin(t * 9));
      B.uarmL.rotation.set(-1.0 * c, 0, -relax * (1 - c) + 0.25 * c); B.uarmR.rotation.set(-1.0 * c, 0, relax * (1 - c) - 0.25 * c);
      B.farmL.rotation.set(-0.5 * c, 0, (0.95 + 0.25 * beat) * c * -1 + 0.0); B.farmR.rotation.set(-0.5 * c, 0, (0.95 + 0.25 * beat) * c);
      B.farmL.rotation.y = -0.9 * c; B.farmR.rotation.y = 0.9 * c;
    }
    if (P.armsUp > 0.01) {
      const c = P.armsUp, w = Math.sin(t * 6) * 0.15;
      B.uarmL.rotation.set(0, 0, -relax + (2.5 + w) * c); B.uarmR.rotation.set(0, 0, relax - (2.5 - w) * c);
      B.farmL.rotation.set(0, 0, -0.3 * c); B.farmR.rotation.set(0, 0, 0.3 * c);
    }
    if (P.wave > 0.01) {
      const c = P.wave;
      B.uarmR.rotation.set(0, 0, relax - 2.6 * c); B.farmR.rotation.set(0, 0, (0.5 + Math.sin(t * 9) * 0.45) * c);
    }
    if (P.holdFront > 0.01) {
      const c = P.holdFront;
      B.uarmL.rotation.set(-0.9 * c, 0, -relax * (1 - c) + 0.1 * c); B.uarmR.rotation.set(-0.9 * c, 0, relax * (1 - c) - 0.1 * c);
      B.farmL.rotation.set(-0.9 * c, -0.3 * c, 0); B.farmR.rotation.set(-0.9 * c, 0.3 * c, 0);
    }
    // head: tilt and look-at
    B.head.rotation.z += P.headTilt * 0.25;
    this.group.updateMatrixWorld(true);
    if (this.lookAt) {
      // rotate neck+head toward target (yaw/pitch in character space)
      const hw = B.head.getWorldPosition(_v);
      const inv = _q.copy(this.group.quaternion).invert();
      const d = _v2.copy(this.lookAt).sub(hw).applyQuaternion(inv);
      const yaw = THREE.MathUtils.clamp(Math.atan2(d.x, d.z), -1.1, 1.1);
      const pitch = THREE.MathUtils.clamp(Math.atan2(-d.y, Math.hypot(d.x, d.z)), -0.6, 0.7);
      this.look = this.look || { y: 0, p: 0 };
      this.look.y += (yaw - this.look.y) * 0.12; this.look.p += (pitch - this.look.p) * 0.12;
      B.neck.rotation.y += this.look.y * 0.4; B.neck.rotation.x += this.look.p * 0.4;
      B.head.rotation.y += this.look.y * 0.5; B.head.rotation.x += this.look.p * 0.5;
      this.eyeLook = { x: this.look.y * 0.15, y: this.look.p * 0.15 };
    }
    // arm IK toward hand targets
    this.group.updateMatrixWorld(true);
    for (const s of ['L', 'R']) {
      const w = this.armW[s];
      if (w > 0.001 && this.handTarget[s]) this.solveArm(s, this.handTarget[s], w);
    }
    // pigtails swing (spring, driven by head motion & wind)
    for (const pg of this.pigs) {
      const target = _v.set(0.05 * Math.sin(t * 1.3 + pg.side) * this.wind + 0.06 * this.wind, 0, -0.12 * this.wind * pg.side * 0.4);
      const acc = _v2.copy(target).sub(pg.ang).multiplyScalar(40).addScaledVector(pg.vel, -4);
      pg.vel.addScaledVector(acc, dt); pg.ang.addScaledVector(pg.vel, dt);
      pg.piv.rotation.set(pg.ang.x + (this.root.position.y > 0.01 ? -0.2 : 0), 0, pg.ang.z * pg.side + (P.jump * Math.sin(t * 7) * 0.2) * pg.side);
    }
    // eyes: lids & gaze
    const look = this.eyeLook || { x: 0, y: 0 };
    const sq = this.expr.squint, bu = this.expr.browUp;
    const lidOpen = Math.max(0, 1 - Math.max(blink, 0) * 1.0);
    for (const e of this.eyes) {
      e.ball.rotation.set(look.y + this.expr.look.y, look.x + this.expr.look.x, 0);
      // upper lid: open position tilts back
      const openA = -0.62 - 0.22 * bu + 0.28 * sq;
      const closedA = 0.32;
      e.up.rotation.x = closedA + (openA - closedA) * lidOpen;
      e.lo.rotation.x = 0.28 - 0.22 * sq - 0.05 * (1 - lidOpen);
    }
    this.group.updateMatrixWorld(true);
  }

  solveArm(s, target, w) {
    const B = this.B;
    const ua = B['uarm' + s], fa = B['farm' + s], hd = B['hand' + s];
    const S = ua.getWorldPosition(new V3());
    const E0 = fa.getWorldPosition(new V3());
    const W0 = hd.getWorldPosition(new V3());
    const a = this.J['sh' + s].distanceTo(this.J['el' + s]), b = this.J['el' + s].distanceTo(this.J['wr' + s]);
    // clamp target reach
    const T = _v3.copy(target);
    const d = T.clone().sub(S); let L = d.length();
    const maxL = (a + b) * 0.985; if (L > maxL) { d.multiplyScalar(maxL / L); L = maxL; }
    T.copy(S).add(d);
    // elbow: pole points down/back & outward
    const side = s === 'L' ? 1 : -1;
    const pole = new V3(side * 0.6, -0.8, -0.5).applyQuaternion(this.group.quaternion);
    const dn = d.clone().normalize();
    const cosA = THREE.MathUtils.clamp((a * a + L * L - b * b) / (2 * a * L), -1, 1);
    const pp = pole.clone().sub(dn.clone().multiplyScalar(pole.dot(dn))).normalize();
    const E = S.clone().addScaledVector(dn, a * cosA).addScaledVector(pp, a * Math.sqrt(1 - cosA * cosA));
    // current world dirs (after FK pose), blend toward IK
    const curU = E0.clone().sub(S).normalize(); const newU = E.clone().sub(S).normalize();
    const qU = new Q().setFromUnitVectors(curU, newU.lerp(curU, 1 - w).normalize());
    // apply world-space delta to upper arm
    const pw = ua.parent.getWorldQuaternion(new Q());
    const uw = ua.getWorldQuaternion(new Q());
    const nuw = qU.multiply(uw);
    ua.quaternion.copy(pw.clone().invert().multiply(nuw));
    ua.updateMatrixWorld(true);
    const E1 = fa.getWorldPosition(new V3()), W1 = hd.getWorldPosition(new V3());
    const curF = W1.clone().sub(E1).normalize(); const newF = T.clone().sub(E1).normalize();
    const qF = new Q().setFromUnitVectors(curF, newF.lerp(curF, 1 - w).normalize());
    const fw = fa.getWorldQuaternion(new Q());
    const nfw = qF.multiply(fw);
    fa.quaternion.copy(ua.getWorldQuaternion(new Q()).invert().multiply(nfw));
    fa.updateMatrixWorld(true);
    // hand: slightly bend toward palm-down reach
    hd.rotation.x = -0.25 * w;
  }

  handWorld(s, out = new V3()) {
    const hd = this.B['hand' + s];
    hd.getWorldPosition(out);
    const dir = new V3().copy(this.J['tip' + s]).sub(this.J['wr' + s]).multiplyScalar(0.55).applyQuaternion(hd.getWorldQuaternion(_q2));
    return out.add(dir);
  }
}
