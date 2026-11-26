// Cotton candy machine, coloured sugar jars, scoop, sticks; spun-thread and sugar-grain particles.
import * as THREE from './three.module.min.js';
import { pbr, tex } from './tex.js';
import { latheGeo, M4 } from './geo.js';
import { roundedBox, contactShadow } from './world.js';
import { strandMaterial } from './candy.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

export const SUGARS = [
  { key: 'pink', hex: 0xe2607f },
  { key: 'blue', hex: 0x3d78d6 },
  { key: 'yellow', hex: 0xe9b62e },
  { key: 'green', hex: 0x62b056 },
];
SUGARS.forEach(s => { s.col = new THREE.Color(s.hex); s.fluff = new THREE.Color(s.hex); });

export function steelMat(extra = {}) {
  return new THREE.MeshPhysicalMaterial({ ...pbr('steel', 1, { metal: true }), color: 0xd4d7da, metalness: 1, roughness: 1, envMapIntensity: 2.2, ...extra });
}

export class Machine {
  constructor(scene, S, pos) {
    this.pos = pos.clone();
    const grp = this.grp = new THREE.Group(); grp.position.copy(pos); scene.add(grp);
    const steel = this.steel = steelMat({ metalness: 0.8, color: 0xe0e2e4, envMapIntensity: 2.6 });
    const steelIn = steelMat({ side: THREE.DoubleSide, roughness: 0.9, metalness: 0.75, color: 0xe2e4e6, envMapIntensity: 3 });
    // base cabinet
    const base = new THREE.Mesh(roundedBox(0.5, 0.15, 0.46, 0.02), steel); base.position.y = 0.075; grp.add(base);
    // rubber feet & front details: toggle switch + amber lamp + vent slots
    const dark = new THREE.MeshStandardMaterial({ color: 0x1c1a19, roughness: 0.6 });
    for (const x of [-0.21, 0.21]) for (const z of [-0.19, 0.19]) { const f = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.012, 16), dark); f.position.set(x, -0.002, z); grp.add(f); }
    const plate = new THREE.Mesh(roundedBox(0.18, 0.07, 0.01, 0.004), dark); plate.position.set(0.1, 0.08, 0.232); grp.add(plate);
    const sw = new THREE.Mesh(roundedBox(0.022, 0.034, 0.02, 0.005), new THREE.MeshStandardMaterial({ color: 0x8b1a1a, roughness: 0.35 })); sw.position.set(0.06, 0.08, 0.243); sw.rotation.x = -0.25; grp.add(sw);
    this.lampMat = new THREE.MeshStandardMaterial({ color: 0x553311, emissive: 0xff9a2a, emissiveIntensity: 0.2, roughness: 0.2 });
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.009, 16, 10), this.lampMat); lamp.position.set(0.14, 0.08, 0.238); grp.add(lamp);
    for (let i = 0; i < 5; i++) { const s = new THREE.Mesh(roundedBox(0.1, 0.006, 0.004, 0.002), dark); s.position.set(-0.13, 0.05 + i * 0.016, 0.231); grp.add(s); }
    // the bowl (spun aluminium/steel): lathe with rolled rim
    const B = this.bowl = { y0: 0.16, r: 0.27, h: 0.22 };
    const prof = [[0.0, 0.0], [0.08, 0.0], [0.2, 0.004], [0.245, 0.02], [0.26, 0.06], [0.266, 0.14], [0.27, 0.205], [0.273, 0.215], [0.283, 0.222], [0.288, 0.214], [0.284, 0.205]];
    const bg = latheGeo(prof, 72);
    const bowl = new THREE.Mesh(bg, steelIn); bowl.position.y = B.y0; grp.add(bowl);
    // the spinner head
    const headG = new THREE.Group(); headG.position.y = B.y0; grp.add(headG); this.headG = headG;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.06, 20), steel); post.position.y = 0.03; headG.add(post);
    const spin = this.spin = new THREE.Group(); spin.position.y = 0.065; headG.add(spin);
    const cup = new THREE.Mesh(latheGeo([[0.0, -0.012], [0.05, -0.012], [0.058, -0.005], [0.058, 0.028], [0.05, 0.034], [0.044, 0.034], [0.044, 0.01], [0.0, 0.006]], 48), steel);
    spin.add(cup);
    // heating band (glows when sugar melts)
    this.bandMat = new THREE.MeshStandardMaterial({ color: 0x2a2624, roughness: 0.5, metalness: 0.6, emissive: 0xff5a14, emissiveIntensity: 0.0 });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.0585, 0.0585, 0.018, 48, 1, true), this.bandMat); band.position.y = 0.012; spin.add(band);
    for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.004, 8), dark); const a = i / 4 * Math.PI * 2; b.position.set(Math.cos(a) * 0.03, 0.01, Math.sin(a) * 0.03); spin.add(b); }
    // molten sugar inside the head (colour of last sugar)
    this.meltMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, clearcoat: 1, emissive: 0x000000 });
    const melt = this.melt = new THREE.Mesh(new THREE.CircleGeometry(0.043, 32), this.meltMat); melt.rotation.x = -Math.PI / 2; melt.position.y = 0.0075; spin.add(melt); melt.visible = false;
    // contact shadow under machine
    const cs = contactShadow(S, 0.62, 0.58, 0.75); cs.position.set(0, 0.002, 0); grp.add(cs);
    grp.traverse(o => { if (o.isMesh && o !== cs) { o.castShadow = true; o.receiveShadow = true; } });
    // ---------- spun threads flying from head to wall
    this.threadMat = strandMaterial();
    this.threadMat.uniforms.uOpacity.value = 0;
    const NT = 260, PT = 7;
    const tp = new Float32Array(NT * (PT - 1) * 2 * 3), tc = new Float32Array(tp.length), tn = new Float32Array(tp.length), ta = new Float32Array(tp.length / 3);
    let v = 0;
    for (let t = 0; t < NT; t++) {
      const a0 = Math.random() * Math.PI * 2, y = 0.075 + (Math.random() - 0.4) * 0.03;
      const curl = 0.6 + Math.random() * 0.9;
      const pts = [];
      for (let k = 0; k < PT; k++) {
        const f = k / (PT - 1);
        const r = 0.058 + f * (0.2 + Math.random() * 0.01);
        const a = a0 + f * curl;
        pts.push([Math.cos(a) * r, y + f * f * (0.02 + Math.random() * 0.05) + Math.sin(f * 9 + t) * 0.004, Math.sin(a) * r]);
      }
      for (let k = 0; k < PT - 1; k++) for (const kk of [k, k + 1]) {
        tp.set(pts[kk], v * 3);
        const n = V(pts[kk][0], 0.3, pts[kk][2]).normalize(); tn.set([n.x, n.y, n.z], v * 3);
        tc.set([1, 1, 1], v * 3); ta[v] = (0.25 + Math.random() * 0.75) * (1 - (kk / (PT - 1)) * 0.5); v++;
      }
    }
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.BufferAttribute(tp, 3)); tg.setAttribute('color', new THREE.BufferAttribute(tc, 3));
    tg.setAttribute('aN', new THREE.BufferAttribute(tn, 3)); tg.setAttribute('aA', new THREE.BufferAttribute(ta, 1));
    this.threads = new THREE.LineSegments(tg, this.threadMat); this.threads.position.y = B.y0; this.threads.frustumCulled = false; this.threads.renderOrder = 5;
    grp.add(this.threads);
    this.threadCol = new THREE.Color(1, 1, 1);
    // ---------- web of fluff collecting on the bowl wall
    const wg = new THREE.TorusGeometry(0.24, 0.022, 18, 120);
    wg.rotateX(Math.PI / 2);
    const wp = wg.attributes.position;
    for (let i = 0; i < wp.count; i++) { const x = wp.getX(i), z = wp.getZ(i); const a = Math.atan2(z, x); const k = 1 + 0.25 * Math.sin(a * 7) + 0.15 * Math.sin(a * 19 + 1); wp.setY(i, wp.getY(i) * k); }
    wg.computeVertexNormals();
    this.webMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, alphaMap: tex('fibre_c', [8, 1]), transparent: true, opacity: 0, depthWrite: false, roughness: 0.9, sheen: 1, sheenColor: new THREE.Color(1, 0.8, 0.55), sheenRoughness: 0.3, side: THREE.DoubleSide, emissive: 0x000000 });
    this.webMat.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <alphamap_fragment>', `diffuseColor.a *= smoothstep(0.8, 1.0, texture2D(alphaMap, vAlphaMapUv).g) * 1.6;`);
    };
    this.web = new THREE.Mesh(wg, this.webMat); this.web.position.y = B.y0 + 0.11; this.web.renderOrder = 4; grp.add(this.web);
    this.webAmt = 0; this.webCol = new THREE.Color(1, 1, 1); this.webKey = 'pink';
    this.webShares = new Map();
    // ---------- state
    this.sugar = 0; this.sugarCol = new THREE.Color(1, 1, 1); this.sugarKey = null;
    this.spinRate = 0; this.on = false;
    this.heat = 0;
  }

  // worldspace centre of the bowl (where threads fly)
  bowlCenter(out = V()) { return out.set(this.pos.x, this.pos.y + this.bowl.y0 + 0.08, this.pos.z); }

  addSugar(sugar, amount) {
    // new sugar mixes with what is left in the head, but the newest dominates quickly
    const tot = this.sugar + amount;
    this.sugarCol.lerp(sugar.fluff, this.sugar > 0 ? amount / tot * 1.4 > 1 ? 1 : amount / tot * 1.4 : 1);
    this.sugarKey = sugar.key;
    this.sugar = tot;
    this.on = true;
    this.melt.visible = true;
    this.meltMat.color.copy(sugar.col);
  }

  // returns volume collected for a given sweep length (metres of stick travel)
  collect(sweep, held) {
    const k = Math.min(this.webAmt, Math.min(0.05, sweep) * 0.03 + (held ? 0.00002 : 0), 0.00018);
    this.webAmt -= k;
    return k;
  }

  update(dt, t) {
    // the head spins while there is sugar (and coasts down)
    const target = this.sugar > 0.0001 ? 1 : (this.on ? 0.25 : 0);
    this.spinRate += (target - this.spinRate) * Math.min(1, dt * 1.5);
    this.spin.rotation.y += this.spinRate * dt * 40;
    this.threads.rotation.y += this.spinRate * dt * 9;
    this.heat += ((this.sugar > 0.0001 ? 1 : 0) - this.heat) * Math.min(1, dt * 2);
    this.bandMat.emissiveIntensity = this.heat * (0.8 + 0.2 * Math.sin(t * 13));
    this.lampMat.emissiveIntensity = this.on ? 2.2 : 0.2;
    // sugar -> threads -> web on the wall
    let out = 0;
    if (this.sugar > 0) {
      out = Math.min(this.sugar, dt * 0.0016);
      this.sugar -= out;
      const share = out / (this.webAmt + out + 1e-9);
      this.webCol.lerp(this.sugarCol, Math.min(1, share * 3));
      this.webKey = this.sugarKey;
      this.webAmt += out;
      if (this.sugar <= 0.00001) { this.sugar = 0; this.melt.visible = false; }
    }
    this.threadCol.lerp(this.sugarCol, Math.min(1, dt * 3));
    const tc = this.threads.geometry.attributes.color;
    if (Math.abs(tc.array[0] - this.threadCol.r) > 0.002 || Math.abs(tc.array[2] - this.threadCol.b) > 0.002) {
      for (let i = 0; i < tc.count; i++) tc.setXYZ(i, this.threadCol.r, this.threadCol.g, this.threadCol.b);
      tc.needsUpdate = true;
    }
    this.threadMat.uniforms.uOpacity.value += ((out > 0 ? 0.95 : 0) - this.threadMat.uniforms.uOpacity.value) * Math.min(1, dt * 4);
    // web visual
    const w = Math.min(1, this.webAmt / 0.0012);
    this.webMat.opacity = Math.min(0.55, w * 0.8);
    this.webMat.color.copy(this.webCol);
    this.web.scale.set(1, 0.25 + w * 0.6, 1);
    this.web.visible = w > 0.01;
    this.output = out;
  }
}

// glass jar of coloured sugar
export function makeJar(S, sugar) {
  const grp = new THREE.Group();
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.22, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.6, side: THREE.DoubleSide, depthWrite: false });
  const jr = 0.058, jh = 0.15;
  const prof = [[0, 0.001], [jr - 0.01, 0.0], [jr, 0.01], [jr, jh - 0.02], [jr - 0.012, jh - 0.004], [jr - 0.012, jh + 0.008], [jr - 0.009, jh + 0.012]];
  const g = new THREE.Mesh(latheGeo(prof, 40), glass); g.renderOrder = 6; grp.add(g);
  // sugar fill: crystalline surface, colour sugar
  const fm = new THREE.MeshPhysicalMaterial({ color: sugar.col, ...pbr('sugar', 3), roughness: 1, clearcoat: 0.5, clearcoatRoughness: 0.12, normalScale: new THREE.Vector2(1.6, 1.6) });
  const fill = new THREE.Mesh(latheGeo([[0, 0.004], [jr - 0.012, 0.004], [jr - 0.004, 0.012], [jr - 0.004, jh * 0.62], [jr * 0.5, jh * 0.66], [0, jh * 0.67]], 40), fm);
  grp.add(fill);
  const cs = contactShadow(S, 0.16, 0.16, 0.6); cs.position.y = 0.001; grp.add(cs);
  grp.traverse(o => { if (o.isMesh && o !== cs) { o.castShadow = o.material !== glass; o.receiveShadow = true; } });
  grp.userData = { sugar, fillMat: fm, glassMat: glass, h: jh };
  return grp;
}

export function makeScoop() {
  const grp = new THREE.Group();
  const st = steelMat();
  const bowl = new THREE.Mesh(latheGeo([[0, -0.016], [0.012, -0.0155], [0.022, -0.01], [0.027, 0.0], [0.0275, 0.002]], 32), steelMat({ side: THREE.DoubleSide }));
  grp.add(bowl);
  const h = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0045, 0.16, 10), new THREE.MeshPhysicalMaterial({ ...pbr('wooddark', [0.2, 1]), roughness: 1 }));
  h.rotation.z = Math.PI / 2 - 0.35; h.position.set(0.1, 0.03, 0); grp.add(h);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.03, 8), st); neck.rotation.z = Math.PI / 2 - 0.5; neck.position.set(0.03, 0.006, 0); grp.add(neck);
  // heap of crystals in the scoop (instanced little faceted grains)
  const grainG = new THREE.OctahedronGeometry(0.0018, 0); grainG.scale(1, 0.8, 1.2);
  const grainM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, sheen: 0.4, envMapIntensity: 1.5 });
  const NG = 420;
  const heap = new THREE.InstancedMesh(grainG, grainM, NG);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < NG; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 0.024;
    const y = -0.008 + (0.014 - r * 0.55) * Math.random() + 0.006;
    e.set(Math.random() * 6, Math.random() * 6, Math.random() * 6); q.setFromEuler(e);
    m.compose(V(Math.cos(a) * r, y, Math.sin(a) * r), q, V(1, 1, 1).multiplyScalar(0.7 + Math.random() * 0.6));
    heap.setMatrixAt(i, m);
  }
  heap.visible = false; grp.add(heap);
  grp.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  grp.userData = { heap, grainM };
  return grp;
}

// falling grains (pour) - simple ballistic particles drawn as instanced crystals
export class Grains {
  constructor(scene, n = 500) {
    const g = new THREE.OctahedronGeometry(0.0019, 0); g.scale(1, 0.8, 1.2);
    this.mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, clearcoat: 1, envMapIntensity: 1.6, sheen: 0.4 });
    this.mesh = new THREE.InstancedMesh(g, this.mat, n); this.mesh.frustumCulled = false;
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3);
    scene.add(this.mesh);
    this.n = n; this.p = []; this.i = 0;
    for (let k = 0; k < n; k++) this.p.push({ life: 0, pos: V(), vel: V(), rot: V(), floorY: 0 });
    this.m = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.e = new THREE.Euler(); this.s = V();
    this.mesh.count = n;
  }
  emit(pos, vel, col, floorY, spread = 0.01) {
    const p = this.p[this.i]; this.i = (this.i + 1) % this.n;
    p.life = 1.6; p.pos.copy(pos).add(V((Math.random() - 0.5) * spread, 0, (Math.random() - 0.5) * spread));
    p.vel.copy(vel).add(V((Math.random() - 0.5) * 0.1, Math.random() * 0.05, (Math.random() - 0.5) * 0.1));
    p.rot.set(Math.random() * 6, Math.random() * 6, Math.random() * 6); p.floorY = floorY;
    p.scale = 0.6 + Math.random() * 0.8;
    this.mesh.setColorAt(this.p.indexOf(p), col);
    this.mesh.instanceColor.needsUpdate = true;
  }
  update(dt, onLand) {
    const { m, q, e, s } = this;
    for (let k = 0; k < this.n; k++) {
      const p = this.p[k];
      if (p.life <= 0) { m.makeScale(0, 0, 0); this.mesh.setMatrixAt(k, m); continue; }
      p.life -= dt;
      p.vel.y -= 9.8 * dt; p.pos.addScaledVector(p.vel, dt);
      p.rot.x += dt * 9; p.rot.y += dt * 7;
      if (p.pos.y < p.floorY) { p.life = 0; onLand && onLand(p); }
      e.set(p.rot.x, p.rot.y, p.rot.z); q.setFromEuler(e); s.setScalar(p.scale);
      m.compose(p.pos, q, s); this.mesh.setMatrixAt(k, m);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}

export function makeStick() {
  const g = new THREE.CylinderGeometry(0.0028, 0.0034, 0.34, 10);
  g.translate(0, 0.17, 0); // origin at the tip that goes into the bowl
  const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ ...pbr('wood', [0.05, 1]), color: 0xf3dcb8, roughness: 1 }));
  m.castShadow = true;
  return m;
}

export function makeStickCup(S) {
  const grp = new THREE.Group();
  const bamboo = new THREE.MeshPhysicalMaterial({ ...pbr('wood', [0.6, 0.3]), color: 0xd9c08a, roughness: 1, clearcoat: 0.4, clearcoatRoughness: 0.3 });
  const cup = new THREE.Mesh(latheGeo([[0, 0], [0.04, 0], [0.042, 0.004], [0.042, 0.12], [0.044, 0.125], [0.038, 0.126], [0.038, 0.01], [0, 0.01]], 32), bamboo);
  grp.add(cup);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.0425, 0.003, 8, 32), bamboo); ring.rotation.x = Math.PI / 2; ring.position.y = 0.06; grp.add(ring);
  const sticks = [];
  for (let i = 0; i < 9; i++) {
    const s = makeStick(); const a = i / 9 * Math.PI * 2;
    s.position.set(Math.cos(a) * 0.02, 0.01, Math.sin(a) * 0.02);
    s.rotation.set(Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12);
    s.scale.y = 0.75; grp.add(s); sticks.push(s);
  }
  const cs = contactShadow(S, 0.13, 0.13, 0.6); cs.position.y = 0.001; grp.add(cs);
  grp.traverse(o => { if (o.isMesh && o !== cs) { o.castShadow = true; o.receiveShadow = true; } });
  grp.userData.sticks = sticks;
  return grp;
}

// wooden display block with holes for finished cotton candy
export function makeRack(S, wood) {
  const grp = new THREE.Group();
  const blk = new THREE.Mesh(roundedBox(0.62, 0.07, 0.16, 0.012), wood); blk.position.y = 0.035; grp.add(blk);
  const holeM = new THREE.MeshStandardMaterial({ color: 0x120b06, roughness: 1 });
  const slots = [];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) {
    const x = -0.24 + i * 0.12 + (j ? 0.06 : 0), z = j ? -0.035 : 0.035;
    const h = new THREE.Mesh(new THREE.CircleGeometry(0.006, 12), holeM); h.rotation.x = -Math.PI / 2; h.position.set(x, 0.0705, z); grp.add(h);
    slots.push(V(x, 0.07, z));
  }
  const cs = contactShadow(S, 0.72, 0.26, 0.7); cs.position.y = 0.001; grp.add(cs);
  grp.traverse(o => { if (o.isMesh && o !== cs) { o.castShadow = true; o.receiveShadow = true; } });
  grp.userData.slots = slots;
  return grp;
}
