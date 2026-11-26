// Loads sculpted figures (tex/fig_*.bin), builds skinned rigs, realistic eyes, live mouth & brows, expressions and poses.
import * as THREE from 'three';
import { patchFigureMaterial, lerp, clamp01, damp } from './core.js';

const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _m = new THREE.Matrix4();

function sRGB(hex) { return new THREE.Color().setStyle(hex, THREE.SRGBColorSpace); }

export async function loadFigureData(url) {
  const buf = await (await fetch(url)).arrayBuffer();
  const dv = new DataView(buf);
  const jl = dv.getUint32(0, true);
  const meta = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, jl)));
  const base = 4 + jl + ((4 - ((4 + jl) % 4)) % 4);
  for (const p of meta.parts) {
    const A = {};
    const get = (k, T) => { const [o, n] = p.arrays[k]; return new T(buf, base + o, n); };
    A.pos = get('pos', Uint16Array); A.nrm = get('nrm', Int8Array); A.idx = p.i32 ? get('idx', Uint32Array) : get('idx', Uint16Array);
    A.mat = get('mat', Uint8Array); A.ao = get('ao', Uint8Array);
    if (p.skinned) { A.si = get('si', Uint8Array); A.sw = get('sw', Uint8Array); }
    p.A = A;
  }
  return meta;
}

// palette entry: [hex, roughness, bump, channel, sheen, metal]
function buildGeometry(part, palette, opts = {}) {
  const A = part.A, n = part.nv;
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n * 3; i++) pos[i] = part.bmin[i % 3] + A.pos[i] / 65535 * part.bsize[i % 3];
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(A.nrm).map(v => v / 127), 3));
  g.setIndex(new THREE.BufferAttribute(A.idx, 1));
  const col = new Float32Array(n * 3), mp = new Float32Array(n * 4), ao = new Float32Array(n);
  const cache = palette.map(e => e ? sRGB(e[0]) : new THREE.Color(1, 0, 1));
  for (let i = 0; i < n; i++) {
    const m = A.mat[i]; const e = palette[m] || palette[0]; let c = cache[m] || cache[0];
    let r = c.r, gg = c.g, b = c.b;
    if (opts.tint) { const t = opts.tint(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], m); if (t) { r *= t[0]; gg *= t[1]; b *= t[2]; } }
    col[i * 3] = r; col[i * 3 + 1] = gg; col[i * 3 + 2] = b;
    mp[i * 4] = e[1]; mp[i * 4 + 1] = e[2]; mp[i * 4 + 2] = e[3]; mp[i * 4 + 3] = e[4];
    ao[i] = A.ao[i] / 255;
  }
  if (opts.smoothSeams !== false) {
    // diffuse colors/params a little along edges so voxel-sized material seams read as soft fabric edges
    const I = A.idx, acc = new Float32Array(n * 7), cnt = new Float32Array(n);
    for (let it = 0; it < 2; it++) {
      acc.fill(0); cnt.fill(0);
      for (let t = 0; t < I.length; t += 3) for (let e = 0; e < 3; e++) {
        const a = I[t + e], b = I[t + (e + 1) % 3];
        for (const [x, y] of [[a, b], [b, a]]) { for (let c = 0; c < 3; c++) acc[x * 7 + c] += col[y * 3 + c]; for (let c = 0; c < 4; c++) acc[x * 7 + 3 + c] += mp[y * 4 + c]; cnt[x]++; }
      }
      for (let i = 0; i < n; i++) if (cnt[i]) {
        for (let c = 0; c < 3; c++) col[i * 3 + c] = col[i * 3 + c] * 0.5 + acc[i * 7 + c] / cnt[i] * 0.5;
        for (let c = 0; c < 4; c++) if (c !== 2) mp[i * 4 + c] = mp[i * 4 + c] * 0.5 + acc[i * 7 + 3 + c] / cnt[i] * 0.5;
      }
    }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('mp', new THREE.BufferAttribute(mp, 4));
  g.setAttribute('ao', new THREE.BufferAttribute(ao, 1));
  if (A.si) {
    g.setAttribute('skinIndex', new THREE.BufferAttribute(new Uint16Array(A.si), 4));
    g.setAttribute('skinWeight', new THREE.BufferAttribute(new Float32Array(A.sw).map(v => v / 255), 4));
  }
  g.computeBoundingSphere();
  return g;
}

function figMaterial(o = {}) {
  const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 1, metalness: 0, sheen: o.sheen ? 1 : 0, sheenRoughness: 0.75, sheenColor: new THREE.Color(0.35, 0.35, 0.38), envMapIntensity: 1 });
  if (o.clearcoat) { m.clearcoat = o.clearcoat; m.clearcoatRoughness = 0.35; }
  return patchFigureMaterial(m, o);
}

// ---------------------------------------------------------------- eyes
function eyeMaterial(irisHex) {
  const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.4 });
  const iris = sRGB(irisHex);
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uIris = { value: iris };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vEP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvEP = normalize(position);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vEP; uniform vec3 uIris;
      float eh(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1)))*7151.7); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
      {
        float th = acos(clamp(vEP.z, -1., 1.));
        float ang = atan(vEP.y, vEP.x);
        float irisR = 0.62, pupR = 0.24;
        vec3 sclera = mix(vec3(0.86,0.84,0.82), vec3(0.78,0.62,0.6), smoothstep(0.9, 1.6, th));
        float fib = 0.75 + 0.25*sin(ang*38. + sin(ang*7.)*2.) * (0.6+0.4*sin(th*40.));
        vec3 ir = uIris * fib * mix(1.25, 0.7, smoothstep(pupR, irisR, th));
        ir = mix(ir, uIris*0.35, smoothstep(irisR-0.08, irisR, th)); // limbal ring
        vec3 c = mix(ir, sclera, smoothstep(irisR-0.01, irisR+0.02, th));
        c = mix(vec3(0.015), c, smoothstep(pupR-0.02, pupR+0.01, th));
        diffuseColor.rgb = c;
      }`);
  };
  m.customProgramCacheKey = () => 'eye' + irisHex;
  return m;
}

function lidGeometry(r, upper, edgeCol, skinCol) {
  const th = upper ? 2.05 : 1.25;
  const g = upper ? new THREE.SphereGeometry(r, 28, 10, 0, Math.PI * 2, 0, th) : new THREE.SphereGeometry(r, 28, 6, 0, Math.PI * 2, Math.PI - th, th);
  const n = g.attributes.position.count, col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const y = g.attributes.position.getY(i) / r; const pol = Math.acos(THREE.MathUtils.clamp(y, -1, 1));
    const edge = upper ? th - pol : pol - (Math.PI - th);
    const t = THREE.MathUtils.smoothstep(edge, 0.0, upper ? 0.16 : 0.1);
    const c = new THREE.Color().copy(edgeCol).lerp(skinCol, t);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

// ---------------------------------------------------------------- live mouth + brows
class Mouth {
  constructor(meta, skinHex, lipHex, k) {
    this.k = k; this.prof = meta.mouthProf; this.prof2 = meta.mouthProf2; this.y0 = meta.mouthY; this.N = 15;
    this.rows = 9;
    const n = this.N * this.rows;
    this.g = new THREE.BufferGeometry();
    this.pos = new Float32Array(n * 3); this.col = new Float32Array(n * 3);
    this.g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.g.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    const idx = [];
    for (let r = 0; r < this.rows - 1; r++) for (let i = 0; i < this.N - 1; i++) {
      const a = r * this.N + i, b = a + 1, c = a + this.N, d = c + 1; idx.push(a, b, d, a, d, c);
    }
    this.g.setIndex(idx);
    this.skin = sRGB(skinHex); this.lip = sRGB(lipHex);
    this.mesh = new THREE.Mesh(this.g, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.42, clearcoat: 0.3, clearcoatRoughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    this.mesh.renderOrder = 2;
    this.update({ smile: 0, open: 0, oh: 0, tilt: 0, teeth: 0 });
  }
  zAt(x, y) {
    const k = this.k, t = (x / (0.04 * k) + 1) * 0.5 * (this.prof.length - 1);
    const i = Math.max(0, Math.min(this.prof.length - 2, Math.floor(t))), f = t - i;
    const z1 = lerp(this.prof[i], this.prof[i + 1], f), z2 = lerp(this.prof2[i], this.prof2[i + 1], f);
    const fy = (this.y0 - y) / (0.012 * k);
    return lerp(z1, z2, fy);
  }
  update(e) {
    const k = this.k, N = this.N, P = this.pos, C = this.col;
    const w = 0.0175 * k * (1 - 0.32 * e.oh) * (1 + 0.1 * e.smile);
    const dark = new THREE.Color(0.09, 0.025, 0.025), tongue = new THREE.Color(0.55, 0.2, 0.2), teeth = new THREE.Color(0.85, 0.83, 0.78);
    const lipIn = this.lip.clone().multiplyScalar(0.55);
    const c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1) * 2 - 1, s = Math.sqrt(Math.max(0, 1 - t * t));
      const x = t * w;
      const lift = e.smile * 0.0055 * k * t * t - e.smile * 0.0012 * k + e.tilt * 0.0035 * k * t + (e.frown || 0) * -0.004 * k * t * t;
      const wave = e.tilt * 0.0012 * k * Math.sin(t * 5);
      const ou = e.open * 0.0035 * k * s * (1 + e.oh * 0.6), ol = e.open * 0.012 * k * Math.pow(s, 0.8) * (1 + e.oh * 0.25);
      const yU = this.y0 + lift + ou + wave, yL = this.y0 + lift - ol + wave;
      const lipU = 0.0042 * k * (1 - 0.55 * t * t) * (1 - 0.25 * e.smile) + 0.0005 * k * Math.cos(t * Math.PI * 2.2) * (1 - t * t);
      const lipL = 0.0055 * k * (1 - 0.6 * t * t) * (1 - 0.3 * e.smile);
      const rows = [
        [yL - lipL - 0.0022 * k, this.skin, 0.0003],
        [yL - lipL, this.lip, 0.0012],
        [yL - 0.0004 * k, lipIn, 0.0015],
        [lerp(yL, yU, 0.18), tongue.clone().lerp(dark, 1 - Math.min(1, e.open * 1.5)), 0.0006],
        [lerp(yL, yU, 0.5), dark, 0.0004],
        [lerp(yL, yU, 0.8), teeth.clone().lerp(dark, 1 - e.teeth * Math.min(1, e.open * 3)), 0.0007],
        [yU + 0.0003 * k, lipIn, 0.0015],
        [yU + lipU, this.lip, 0.0013],
        [yU + lipU + 0.0024 * k, this.skin, 0.0003],
      ];
      rows.forEach(([y, col, dz], r) => {
        const j = (r * N + i) * 3;
        const edge = Math.abs(t) > 0.96 && r > 0 && r < 8;
        P[j] = x * (edge ? 1.04 : 1); P[j + 1] = y; P[j + 2] = this.zAt(x, y) + dz + 0.0006;
        c.copy(col); if (edge) c.lerp(this.skin, 0.5);
        C[j] = c.r; C[j + 1] = c.g; C[j + 2] = c.b;
      });
    }
    this.g.attributes.position.needsUpdate = true; this.g.attributes.color.needsUpdate = true;
    this.g.computeVertexNormals(); this.g.computeBoundingSphere();
  }
}

class Brow {
  constructor(meta, side, hex, k, thick = 1) {
    this.side = side; this.k = k; this.prof = meta.browProf; this.y0 = meta.browY; this.thick = thick;
    this.N = 9;
    this.g = new THREE.BufferGeometry(); this.pos = new Float32Array(this.N * 3 * 3);
    this.g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    const col = new Float32Array(this.N * 3 * 3); const c0 = sRGB(hex);
    for (let i = 0; i < this.N * 3; i++) { const r = Math.floor(i / this.N); const f = r === 1 ? 1 : 0.9; col[i * 3] = c0.r * f; col[i * 3 + 1] = c0.g * f; col[i * 3 + 2] = c0.b * f; }
    this.g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const idx = []; for (let r = 0; r < 2; r++) for (let i = 0; i < this.N - 1; i++) { const a = r * this.N + i, b = a + 1, c = a + this.N, d = c + 1; idx.push(a, b, d, a, d, c); }
    if (side < 0) for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
    this.g.setIndex(idx);
    this.mesh = new THREE.Mesh(this.g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    this.update(0, 0);
  }
  zAt(x) { const k = this.k, t = (x / (0.06 * k) + 1) * 0.5 * (this.prof.length - 1); const i = Math.max(0, Math.min(this.prof.length - 2, Math.floor(t))); return lerp(this.prof[i], this.prof[i + 1], t - i); }
  update(raise, inner) {
    const k = this.k, s = this.side, P = this.pos;
    for (let i = 0; i < this.N; i++) {
      const t = i / (this.N - 1); // 0 inner -> 1 outer
      const x = s * (0.011 + t * 0.03) * k;
      const arch = Math.sin(t * Math.PI * 0.85) * 0.0045 * k;
      const y = this.y0 + arch + raise * 0.007 * k + inner * (1 - t) * 0.006 * k - 0.004 * k * t * t;
      const th = (0.0042 - t * 0.0024) * k * this.thick;
      for (let r = 0; r < 3; r++) {
        const yy = y + (r - 1) * th * 0.5;
        const j = (r * this.N + i) * 3;
        P[j] = x; P[j + 1] = yy; P[j + 2] = this.zAt(x) + 0.0011 + (r === 1 ? 0.0006 : 0);
      }
    }
    this.g.attributes.position.needsUpdate = true; this.g.computeVertexNormals(); this.g.computeBoundingSphere();
  }
}

// ---------------------------------------------------------------- Figure
export const EXPR = {
  neutral: { smile: 0.15, open: 0, oh: 0, tilt: 0, teeth: 0, browUp: 0, browIn: 0, lid: 1 },
  happy: { smile: 0.85, open: 0.25, oh: 0, tilt: 0, teeth: 0.8, browUp: 0.3, browIn: 0, lid: 0.92 },
  joy: { smile: 1, open: 0.75, oh: 0, tilt: 0, teeth: 1, browUp: 0.6, browIn: 0, lid: 0.85 },
  wow: { smile: 0.2, open: 0.7, oh: 1, tilt: 0, teeth: 0, browUp: 1, browIn: 0, lid: 1.15 },
  focus: { smile: 0.05, open: 0, oh: 0, tilt: 0.15, teeth: 0, browUp: -0.2, browIn: 0.35, lid: 0.85 },
  puzzled: { smile: 0, open: 0.12, oh: 0.3, tilt: 0.9, teeth: 0, browUp: 0.2, browIn: 0.6, lid: 1.0, asym: 1 },
  oops: { smile: 0.55, open: 0.3, oh: 0, tilt: 0.2, teeth: 1, browUp: 0.4, browIn: 0.9, lid: 0.95, frown: 0 },
  sad: { smile: 0, open: 0.05, oh: 0, tilt: 0, teeth: 0, browUp: 0.1, browIn: 1, lid: 0.85, frown: 0.6 },
};

export class Figure {
  constructor(meta, look) {
    this.meta = meta; this.look = look;
    this.root = new THREE.Group();
    this.bones = []; this.rest = [];
    const J = meta.joints;
    meta.bones.forEach((name, i) => {
      const b = new THREE.Bone(); b.name = name;
      const p = meta.parent[i];
      const jp = J[i], pp = p >= 0 ? J[p] : [0, 0, 0];
      b.position.set(jp[0] - pp[0], jp[1] - pp[1], jp[2] - pp[2]);
      this.rest.push(b.position.clone());
      this.bones.push(b);
      if (p >= 0) this.bones[p].add(b);
    });
    this.B = Object.fromEntries(meta.bones.map((n, i) => [n, this.bones[i]]));
    this.skeleton = new THREE.Skeleton(this.bones);
    this.meshes = [];
    const k = meta.hs || 1;
    for (const part of meta.parts) {
      const isHair = part.name === 'hair';
      const g = buildGeometry(part, look.palette, { tint: part.name === 'head' ? look.headTint : (part.name.startsWith('hand') ? look.handTint : null) });
      const mat = figMaterial({ scale: isHair ? 40 : look.detailScale || 110, mode: isHair ? 1 : 0, sss: (part.name === 'head' || part.name.startsWith('hand')) ? 1 : 0, sheen: part.name === 'body', clearcoat: isHair ? 0.0 : 0 });
      if (isHair) { mat.sheen = 1; mat.sheenColor = sRGB(look.hairSheen || '#6b5040'); mat.sheenRoughness = 0.35; }
      let mesh;
      if (part.skinned) {
        mesh = new THREE.SkinnedMesh(g, mat);
        mesh.add(this.bones[0]);
        mesh.bind(this.skeleton);
        mesh.frustumCulled = false;
        this.root.add(mesh);
      } else {
        mesh = new THREE.Mesh(g, mat);
        const b = this.bones[part.bone];
        if (part.name.startsWith('hand')) {
          const side = part.name === 'handL' ? 1 : -1;
          // align hand (-Y fingers) with forearm rest direction
          const fa = J[meta.bones.indexOf(part.name === 'handL' ? 'faL' : 'faR')], ha = J[part.bone];
          const d = new THREE.Vector3(ha[0] - fa[0], ha[1] - fa[1], ha[2] - fa[2]).normalize();
          mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d);
          this['hand' + (side > 0 ? 'L' : 'R') + 'Mesh'] = mesh;
        }
        b.add(mesh);
      }
      mesh.castShadow = true; mesh.receiveShadow = true;
      this.meshes.push(mesh);
      if (part.name === 'head') this.headMesh = mesh;
    }
    this.root.updateMatrixWorld(true);
    this.restWorld = this.bones.map(b => b.getWorldPosition(new THREE.Vector3()));
    // eyes
    if (meta.kind === 'human') this.buildFace(k);
    this.expr = { ...EXPR.neutral }; this.exprTarget = { ...EXPR.neutral };
    this.blinkT = 2 + Math.random() * 2; this.blink = 0;
    this.lookTarget = null; this.t = 0;
  }

  buildFace(k) {
    const head = this.B.head, e = this.meta.eye, look = this.look;
    this.eyes = [];
    const skin = sRGB(look.palette[0][0]);
    const lidSkin = skin.clone().multiplyScalar(0.92);
    const lash = sRGB(look.lash || '#1a1210');
    const eyeMat = eyeMaterial(look.iris || '#5a3a22');
    const lidMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.5, sheen: 0.4, sheenColor: new THREE.Color(0.5, 0.25, 0.2) });
    for (const sd of [1, -1]) {
      const g = new THREE.Group(); g.position.set(sd * e.x, e.y, e.z); head.add(g);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(e.r, 28, 20).rotateX(Math.PI / 2), eyeMat);
      g.add(ball);
      const up = new THREE.Mesh(lidGeometry(e.r * 1.09, true, lash, lidSkin), lidMat);
      const lo = new THREE.Mesh(lidGeometry(e.r * 1.07, false, lidSkin.clone().multiplyScalar(0.7), lidSkin), lidMat);
      g.add(up); g.add(lo);
      // lash fringe: thin dark wedge along upper lid edge
      const lashG = new THREE.TorusGeometry(e.r * 1.1, e.r * 0.07, 4, 18, Math.PI * 0.8);
      const lashM = new THREE.Mesh(lashG, new THREE.MeshStandardMaterial({ color: lash, roughness: 0.6 }));
      lashM.rotation.set(0, 0, Math.PI * 0.1); lashM.scale.set(1, 1, 1);
      const lashPivot = new THREE.Group(); lashPivot.add(lashM); up.add(lashPivot);
      lashM.rotation.x = 0; lashPivot.rotation.x = Math.PI / 2 - 2.05 + Math.PI / 2; // align with edge ring
      lashPivot.visible = false;
      for (const m of [ball, up, lo]) { m.castShadow = false; m.receiveShadow = true; }
      this.eyes.push({ g, ball, up, lo, sd });
    }
    this.mouth = new Mouth(this.meta, look.palette[0][0], look.lip || '#b86a62', k);
    head.add(this.mouth.mesh);
    this.brows = [new Brow(this.meta, 1, look.brow || '#3a2a20', k, look.browThick || 1), new Brow(this.meta, -1, look.brow || '#3a2a20', k, look.browThick || 1)];
    for (const b of this.brows) head.add(b.mesh);
  }

  setExpr(name, hold = 0) { this.exprTarget = { ...EXPR.neutral, ...(EXPR[name] || EXPR.neutral) }; this.exprName = name; if (hold) this.exprHold = hold; }

  updateFace(dt) {
    if (!this.eyes) return;
    const E = this.expr, T = this.exprTarget;
    for (const key of Object.keys(T)) E[key] = damp(E[key] ?? 0, T[key], 10, dt);
    this.blinkT -= dt;
    if (this.blinkT < 0) { this.blink = 1; this.blinkT = 2.5 + Math.random() * 3.5; }
    this.blink = Math.max(0, this.blink - dt * 7);
    const bl = this.blink > 0 ? Math.sin(this.blink * Math.PI) : 0;
    const open = clamp01(E.lid * (1 - bl));
    for (const ey of this.eyes) {
      // upper lid: closed at 0 rad, open toward -1.15
      const o = open * (ey.sd > 0 || !E.asym ? 1 : 0.85);
      ey.up.rotation.x = -lerp(0.0, 1.32, Math.min(o, 1)) - (o > 1 ? (o - 1) * 0.8 : 0);
      ey.lo.rotation.x = lerp(-0.42, -0.2, Math.min(1, o)) + E.smile * 0.12;
    }
    // look target
    if (this.lookTarget) {
      this.B.head.updateWorldMatrix(true, false);
      for (const ey of this.eyes) {
        ey.g.updateWorldMatrix(true, false);
        _m.copy(ey.g.matrixWorld).invert();
        _v.copy(this.lookTarget).applyMatrix4(_m).normalize();
        _v.x = THREE.MathUtils.clamp(_v.x, -0.45, 0.45); _v.y = THREE.MathUtils.clamp(_v.y, -0.35, 0.3); _v.z = Math.max(_v.z, 0.6);
        _v.normalize();
        _q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), _v);
        ey.ball.quaternion.slerp(_q, 1 - Math.exp(-14 * dt));
      }
    }
    this.mouth.update(E);
    this.brows[0].update(E.browUp + (E.asym ? 0.5 : 0), E.browIn);
    this.brows[1].update(E.browUp - (E.asym ? 0.3 : 0), E.browIn);
  }

  // rotate bone so that its rest child direction points along worldDir (with optional pole for twist)
  aim(boneName, childName, worldDir, poleWorld, w = 1) {
    const b = this.B[boneName], c = this.B[childName];
    const restDir = _v.copy(c.position).normalize();
    b.parent.getWorldQuaternion(_q2);
    const want = _v2.copy(worldDir).normalize().applyQuaternion(_q2.clone().invert()); // in parent space
    const q = new THREE.Quaternion().setFromUnitVectors(restDir, want);
    if (poleWorld) {
      // twist so that bone-local +Z (front) aligns toward pole projected
      const pole = poleWorld.clone().applyQuaternion(_q2.clone().invert());
      const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
      const axis = want.clone().normalize();
      const pa = pole.sub(axis.clone().multiplyScalar(pole.dot(axis))).normalize();
      const fa = fwd.sub(axis.clone().multiplyScalar(fwd.dot(axis))).normalize();
      let ang = Math.acos(THREE.MathUtils.clamp(fa.dot(pa), -1, 1));
      if (new THREE.Vector3().crossVectors(fa, pa).dot(axis) < 0) ang = -ang;
      q.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, ang));
    }
    if (w >= 1) b.quaternion.copy(q); else b.quaternion.slerp(q, w);
    b.updateMatrixWorld(true);
  }

  // 2-bone IK: upper bone, lower bone, end bone toward target (world). bendHint = world direction elbow/knee should point
  ik(up, lo, end, target, bendHint, w = 1) {
    const A = this.B[up].getWorldPosition(new THREE.Vector3());
    const s = this.root.getWorldScale(new THREE.Vector3()).x;
    const l1 = this.B[lo].position.length() * s, l2 = this.B[end].position.length() * s;
    const D = target.clone().sub(A); let d = D.length();
    d = THREE.MathUtils.clamp(d, Math.abs(l1 - l2) + 1e-3, l1 + l2 - 1e-4);
    const dir = D.normalize();
    const a = Math.acos(THREE.MathUtils.clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    const bend = bendHint.clone().sub(dir.clone().multiplyScalar(bendHint.dot(dir))).normalize();
    const upperDir = dir.clone().multiplyScalar(Math.cos(a)).add(bend.clone().multiplyScalar(Math.sin(a)));
    const elbow = A.clone().add(upperDir.clone().multiplyScalar(l1));
    this.aim(up, lo, upperDir, null, w);
    const lowerDir = A.clone().add(dir.multiplyScalar(d)).sub(elbow).normalize();
    this.aim(lo, end, lowerDir, null, w);
    return elbow;
  }

  resetPose() { this.bones.forEach((b, i) => { b.quaternion.identity(); b.position.copy(this.rest[i]); }); }

  update(dt) { this.t += dt; this.updateFace(dt); }
}

// palettes ------------------------------------------------------------------
// [hex, roughness, bump, channel(0 twill 1 pores 2 knit 3 streak), sheen]
export const LOOKS = {
  girl: {
    palette: [
      ['#e9bea6', 0.5, 0.07, 1, 0],     // skin
      ['#33415b', 0.82, 0.45, 0, 1],    // jacket (navy canvas)
      ['#9b8663', 0.86, 0.4, 0, 1],     // pants (khaki)
      ['#9a3a2c', 0.32, 0.3, 1, 0],     // rain boots
      ['#3d2b20', 0.4, 0.25, 3, 0],      // hair
      ['#c4c6c8', 0.35, 0.6, 2, 0.4],   // reflective stripe
      ['#2a2624', 0.8, 1.0, 2, 0],      // sole
      ['#c2706a', 0.4, 0.2, 1, 0],      // lip
      ['#273248', 0.8, 0.4, 0, 1],      // pockets / hair tie
    ],
    iris: '#4a2e1c', lip: '#c9776d', brow: '#3b2a1f', lash: '#140d0a', hairSheen: '#8a6a55',
    headTint: (x, y, z, m) => {
      if (m !== 0) return null;
      // cheek blush, slightly warmer nose tip and ears
      const ch = Math.exp(-(((Math.abs(x) - 0.036) / 0.02) ** 2 + ((y - 0.068) / 0.018) ** 2)) * (z > 0.04 ? 1 : 0);
      const nose = Math.exp(-((x / 0.012) ** 2 + ((y - 0.075) / 0.012) ** 2)) * (z > 0.07 ? 1 : 0);
      const b = ch * 0.22 + nose * 0.1;
      return [1 + b * 0.15, 1 - b * 0.35, 1 - b * 0.3];
    },
  },
  papa: {
    palette: [
      ['#d6a588', 0.5, 0.1, 1, 0],
      ['#6e5f4a', 0.85, 0.5, 0, 1],
      ['#2e3442', 0.85, 0.45, 0, 1],
      ['#2b2928', 0.45, 0.4, 1, 0],
      ['#2a221d', 0.45, 0.25, 3, 0],
      ['#c0c2c4', 0.35, 0.6, 2, 0.4],
      ['#1f1d1c', 0.85, 1.0, 2, 0],
      ['#b87468', 0.45, 0.2, 1, 0],
      ['#5b4e3c', 0.85, 1.2, 2, 1],
    ],
    iris: '#3a2618', lip: '#b07065', brow: '#231a15', lash: '#120c09', browThick: 1.35, hairSheen: '#5a4a40',
    headTint: (x, y, z, m) => {
      if (m !== 0) return null;
      const s = Math.exp(-(((y - 0.05) / 0.035) ** 2)) * (z > -0.01 ? 1 : 0) * (Math.abs(y - 0.06) < 0.06 ? 1 : 0);
      const stub = Math.max(0, s - Math.exp(-((x / 0.022) ** 2 + ((y - 0.085) / 0.03) ** 2)) * 1.2);
      const t = Math.min(1, stub) * 0.16;
      return [1 - t, 1 - t * 0.9, 1 - t * 0.7];
    },
  },
  mama: {
    palette: [
      ['#e7b89c', 0.48, 0.06, 1, 0],
      ['#b7a084', 0.9, 0.6, 2, 1],      // knit coat
      ['#38445c', 0.85, 1.2, 0, 1],     // jeans
      ['#d6d0c6', 0.6, 0.8, 2, 0],      // sneakers
      ['#4a3122', 0.4, 0.25, 3, 0],
      ['#c0c2c4', 0.35, 0.6, 2, 0.4],
      ['#cfc9bf', 0.8, 1.0, 2, 0],
      ['#c06e68', 0.4, 0.2, 1, 0],
      ['#9a8468', 0.85, 1.2, 2, 1],
    ],
    iris: '#4a301f', lip: '#c4615e', brow: '#3a281d', lash: '#120c09', hairSheen: '#8a6550',
    headTint: (x, y, z, m) => {
      if (m !== 0) return null;
      const ch = Math.exp(-(((Math.abs(x) - 0.04) / 0.022) ** 2 + ((y - 0.07) / 0.02) ** 2)) * (z > 0.04 ? 1 : 0);
      const b = ch * 0.14; return [1 + b * 0.1, 1 - b * 0.3, 1 - b * 0.25];
    },
  },
};
LOOKS.dog = {
  palette: [
    ['#a8662f', 0.62, 0.9, 3, 0.6],   // fur (warm tan)
    ['#eadcc4', 0.7, 0.9, 3, 0.6],    // cream
    ['#151313', 0.35, 0.2, 1, 0],     // nose
    ['#ffffff', 0.3, 0, 1, 0],
    ['#2a1d15', 0.6, 0.5, 3, 0],
  ],
  detailScale: 70,
};
