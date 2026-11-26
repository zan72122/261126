// game flow: dress-up -> dig (brush / hammer) -> assemble skeleton (papa trips) -> play with diorama dinos -> dig again
import * as THREE from 'three';
import { scene, camera, input, rayFrom, setShot, view, clamp, lerp, damp, smooth, easeOut, easeInOut, rng, post, camShake, pbr, tex } from './core.js';
import { setShadowFocus, SUN_DIR } from './env.js';
import { Human } from './human.js';
import { Fossil, MiniDino, boneMat, buildSkeleton, ITEM_KEYS, SPECIES_LIST } from './dino.js';
import { SandField } from './sand.js';
import { rockGeo, fbm, sweep, deform } from './geo.js';
import * as PR from './props.js';
import { spawnGrains, spawnDust, setGround, updateFx } from './fx.js';
import { sfx, say, brushLevel, audioUnlock } from './audio.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const PIT_POS = [V(0, 0, 0), V(-3.4, 0, 0.2), V(-6.8, 0, -0.1)];
const STAND_POS = [V(5.0, 0, -0.95), V(8.7, 0, -0.95)];
const FLOOR = -0.1;
const tmpV = V(), tmpV2 = V();

// footprint shape: 3 toes + heel pad, local x forward (toes toward +x)
export function footShape(lx, lz) {
  let v = Math.max(0, 1 - Math.hypot(lx / 0.38, lz / 0.42));
  for (const a of [-0.55, 0, 0.55]) {
    const ca = Math.cos(a), sa = Math.sin(a);
    const u = lx * ca + lz * sa, w = -lx * sa + lz * ca;
    if (u > 0 && u < 1.05) v = Math.max(v, (1 - Math.abs(w) / (0.16 * (1 - u * 0.5))) * Math.min(1, (1.05 - u) * 6));
  }
  return v > 0 ? Math.min(1, v * 1.6) : (Math.hypot(lx / 0.55, lz / 0.6) < 1 && lx > -0.5 && lx < 1.2 ? -0.3 : -1);
}

// ------------------------------------------------------------------ glints (soft sun sparkles marking touchable things)
const glintTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,250,235,1)'); gr.addColorStop(0.2, 'rgba(255,240,200,0.5)'); gr.addColorStop(1, 'rgba(255,230,180,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(255,248,230,0.7)'; g.lineWidth = 1.5;
  g.beginPath(); g.moveTo(32, 4); g.lineTo(32, 60); g.moveTo(4, 32); g.lineTo(60, 32); g.stroke();
  const t = new THREE.CanvasTexture(c); return t;
})();
class Glint {
  constructor() {
    this.s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glintTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
    this.s.scale.setScalar(0.08); this.s.renderOrder = 5; scene.add(this.s); this.on = false; this.a = 0; this.ph = Math.random() * 6;
  }
  set(p, on, size = 0.08) { if (p) this.s.position.copy(p); this.on = on; this.size = size; }
  update(dt, t) {
    this.a = damp(this.a, this.on ? 1 : 0, 5, dt);
    const pulse = 0.55 + 0.45 * Math.sin(t * 3.2 + this.ph);
    this.s.material.opacity = this.a * pulse * 0.85;
    this.s.scale.setScalar((this.size || 0.08) * (0.7 + 0.4 * pulse));
    this.s.material.rotation = t * 0.4 + this.ph;
    this.s.visible = this.a > 0.01;
  }
}

// ------------------------------------------------------------------ rock material with hammer cracks
function rockCrackMat() {
  const m = pbr('rock', { repeat: 1, color: new THREE.Color(0.86, 0.84, 0.82), ns: 1.6 });
  const hits = []; for (let i = 0; i < 8; i++) hits.push(new THREE.Vector4(0, 0, 0, 0));
  m.userData.hits = hits;
  m.onBeforeCompile = sh => {
    sh.uniforms.hits = { value: hits };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vObj; varying vec3 vObjN;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvObj = position; vObjN = normal;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vObj; varying vec3 vObjN; uniform vec4 hits[8]; float crackAmt;
      vec3 h3(vec3 p){ p = vec3(dot(p,vec3(127.1,311.7,74.7)), dot(p,vec3(269.5,183.3,246.1)), dot(p,vec3(113.5,271.9,124.6))); return fract(sin(p)*43758.5453); }
      float cell(vec3 p){ vec3 i=floor(p), f=fract(p); float d1=8., d2=8.;
        for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)for(int z=-1;z<=1;z++){ vec3 g=vec3(float(x),float(y),float(z)); vec3 r=g+h3(i+g)-f; float d=dot(r,r); if(d<d1){d2=d1;d1=d;} else if(d<d2) d2=d; }
        return sqrt(d2)-sqrt(d1); }`)
      .replace('#include <map_fragment>', `
        // triplanar sandstone (object space) to avoid stretched uvs
        vec3 bw = abs(normalize(vObjN)); bw = pow(bw, vec3(4.)); bw /= dot(bw, vec3(1.));
        vec3 tp = vObj * vec3(.55, .9, .55);
        vec4 tc = texture2D(map, tp.zy)*bw.x + texture2D(map, tp.xz)*bw.y + texture2D(map, tp.xy)*bw.z;
        diffuseColor *= tc;
        float reach = 0.;
        for (int i=0;i<8;i++){ if (hits[i].w > 0.) { float d = distance(vObj, hits[i].xyz); reach = max(reach, smoothstep(hits[i].w, hits[i].w*.2, d)); } }
        float e = cell(vObj*5.5 + vec3(3.1));
        float e2 = cell(vObj*13. + vec3(7.3));
        crackAmt = reach * (1. - smoothstep(0.0, 0.07, e)) + reach*reach*(1. - smoothstep(0.0, 0.05, e2))*.6;
        crackAmt = clamp(crackAmt, 0., 1.);
        diffuseColor.rgb *= 1. - crackAmt*.8;
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb*vec3(1.12,1.05,1.0), reach*.25*(1.-crackAmt));`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 1., crackAmt);');
  };
  return m;
}

// ------------------------------------------------------------------ the game
export class Game {
  constructor() {
    this.t = 0;
    this.R = rng((Date.now() & 0xffff) + 1);
    PR.propMats();
    this.girl = new Human('girl'); scene.add(this.girl.root);
    this.papa = new Human('papa'); scene.add(this.papa.root);
    this.papa.hat.visible = true; this.papa.setVest(false);
    this.papa.root.position.set(20, 0, 20); this.papa.root.visible = false;
    this.glints = []; for (let i = 0; i < 12; i++) this.glints.push(new Glint());
    this.round = 0;
    this.speciesOrder = this.R() < 0.5 ? ['long', 'duck'] : ['duck', 'long'];
    // camp scenery
    const tent = PR.makeTent(); tent.position.set(-6.5, 0, -17); tent.rotation.y = 0.9; scene.add(tent);
    const crate = PR.makeCrate(); crate.position.set(1.6, 0, -1.55); crate.rotation.y = 0.3; scene.add(crate);
    const crate2 = PR.makeCrate(); crate2.position.set(1.62, 0.3, -1.52); crate2.rotation.y = 0.15; scene.add(crate2);
    const bucket = PR.makeBucket(); bucket.position.set(-1.45, 0, -1.25); scene.add(bucket);
    const sieve = PR.makeSieve(); sieve.position.set(-1.05, 0.12, -1.55); sieve.rotation.set(-0.5, 0.4, 0); scene.add(sieve);
    // camp table with hat & vest (dress-up)
    this.buildDressTable();
    // tools
    this.brush = PR.makeBrush(); this.hammer = PR.makeHammer();
    scene.add(this.brush, this.hammer);
    this.tool = 'brush';
    // exhibit area: big sand patch for footprints + diorama + sign
    this.exField = new SandField({ x0: 2.9, z0: -0.35, w: 7.6, d: 1.75, cell: 0.013, floor: () => -0.06, top0: (x, z) => 0.0 + fbm(x * 3, 0, z * 3, 2) * 0.004, floorTex: 'hardpan' });
    scene.add(this.exField.mesh);
    this.stands = [];
    this.diorama = this.buildDiorama(); this.diorama.position.set(3.45, 0, -1.15); scene.add(this.diorama);
    this.flag = PR.makeFlag(); scene.add(this.flag); this.flag.visible = false;
    this.minis = [];
    this.footprints = [];
    this.state = null;
    this.hintT = 0;
    this.overlay = document.getElementById('ov');
    this.octx = this.overlay.getContext('2d');
    this.newPit(0);
    this.enterDress();
    setGround((x, z) => this.groundAt(x, z));
  }
  groundAt(x, z) {
    if (this.pit && this.pit.field.inside(x, z)) return this.pit.field.heightAt(x, z);
    if (this.exField.inside(x, z)) return this.exField.heightAt(x, z);
    for (const p of this.oldPits || []) if (p.field.inside(x, z)) return p.field.heightAt(x, z);
    return 0;
  }

  // ---------------------------------------------------------------- dress table
  buildDressTable() {
    const g = new THREE.Group();
    const top = PR.plankBox(0.7, 0.03, 0.45, PR.M.wood); top.position.y = 0.6; g.add(top);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const l = PR.plankBox(0.035, 0.6, 0.035, PR.M.wood, 2); l.position.set(sx * 0.31, 0.3, sz * 0.19); l.rotation.z = sx * 0.04; g.add(l); }
    g.position.set(0.95, 0, -1.35); g.rotation.y = -0.25;
    scene.add(g);
    this.table = g;
    // hat resting on table (the girl's own hat object will fly from here)
    const vestFold = new THREE.Group();
    const vf = new THREE.BoxGeometry(0.3, 0.035, 0.24, 6, 1, 6);
    deform(vf, v => { v.y += Math.sin(v.x * 20) * 0.004 + Math.cos(v.z * 25) * 0.003 + (Math.abs(v.x) < 0.14 && Math.abs(v.z) < 0.11 && v.y > 0 ? 0.008 : 0); });
    const vm = new THREE.Mesh(vf, this.girl.vestMesh.material); vm.castShadow = vm.receiveShadow = true; vestFold.add(vm);
    for (const s of [-1, 1]) { const p = PR.plankBox(0.1, 0.006, 0.07, this.girl.vestMesh.material); p.position.set(s * 0.07, 0.02, 0.05); vestFold.add(p); }
    vestFold.position.set(-0.14, 0.632, 0.02); g.add(vestFold);
    this.vestFold = vestFold;
    this.hatSpot = V(0.17, 0.66, 0.0);
  }
  buildDiorama() {
    const g = new THREE.Group();
    const box = PR.makeTray(1.0, 0.62); box.scale.set(1, 1.6, 1); g.add(box);
    const sand = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.58, 30, 20), pbr('sand', { repeat: 0.6 }));
    deform(sand.geometry, v => { v.z += Math.max(0, fbm(v.x * 6, v.y * 6, 1, 3)) * 0.04; });
    sand.rotation.x = -Math.PI / 2; sand.position.y = 0.06; sand.receiveShadow = true; g.add(sand);
    const rm = pbr('rock', { repeat: 0.5 });
    for (let i = 0; i < 5; i++) { const r = new THREE.Mesh(rockGeo(0.03 + Math.random() * 0.04, i + 20, 3, 0.8), rm); r.position.set((Math.random() - 0.5) * 0.8, 0.07, (Math.random() - 0.5) * 0.45); r.castShadow = true; g.add(r); }
    // tiny ferns
    const leaf = new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(0.32, 0.42, 0.22, THREE.SRGBColorSpace), roughness: 0.8, side: THREE.DoubleSide });
    for (let k = 0; k < 4; k++) {
      const f = new THREE.Group();
      for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28; const fr = sweep([V(0, 0, 0), V(Math.cos(a) * 0.04, 0.06, Math.sin(a) * 0.04), V(Math.cos(a) * 0.09, 0.07, Math.sin(a) * 0.09)], { segs: 6, radial: 3, radius: t => [0.012 * Math.sin(Math.PI * t), 0.002] }); f.add(new THREE.Mesh(fr, leaf)); }
      f.position.set(-0.38 + k * 0.25, 0.06, (k % 2 ? 0.18 : -0.2)); g.add(f);
    }
    g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    return g;
  }

  // ---------------------------------------------------------------- pit generation
  newPit(idx) {
    if (this.pit) { (this.oldPits = this.oldPits || []).push(this.pit); }
    const c = PIT_POS[idx % PIT_POS.length].clone();
    const R = this.R;
    const species = this.speciesOrder[this.round % 2];
    const fossil = new Fossil(species, (R() * 1e6) | 0);
    // place footprints first (they go into the floor)
    const fps = [];
    const pitIn = (x, z) => Math.abs(x - c.x) < 1.0 && z > c.z - 0.45 && z < c.z + 0.35;
    // item placement by rejection (OBB overlap)
    const placed = [];
    const keys = [...ITEM_KEYS].sort(() => R() - 0.5);
    for (const key of keys) {
      const it = fossil.items[key];
      let best = null;
      for (let tries = 0; tries < 500; tries++) {
        const yaw = (R() < 0.5 ? 0 : Math.PI) + (R() - 0.5) * 0.9;
        const ex = it.extent.x, ez = it.extent.z;
        const cs = Math.abs(Math.cos(yaw)), sn = Math.abs(Math.sin(yaw));
        const hx = ex * cs + ez * sn, hz = ex * sn + ez * cs;
        const x = c.x + (R() * 2 - 1) * Math.max(0.01, 0.95 - hx), z = c.z - 0.05 + (R() * 2 - 1) * Math.max(0.01, 0.36 - hz);
        let ov = 0;
        for (const p of placed) { const ox = Math.max(0, Math.min(x + hx, p.x + p.hx) - Math.max(x - hx, p.x - p.hx)); const oz = Math.max(0, Math.min(z + hz, p.z + p.hz) - Math.max(z - hz, p.z - p.hz)); ov += ox * oz; }
        if (!best || ov < best.ov) best = { x, z, yaw, hx, hz, ov };
        if (ov < 0.002) break;
      }
      placed.push(best);
      it.group.updateMatrixWorld(true);
      const ih = new THREE.Box3(); it.meshes.forEach(m => { m.geometry.computeBoundingBox(); ih.union(m.geometry.boundingBox.clone().applyMatrix4(m.matrix)); });
      it.group.position.set(best.x, -0.022 - R() * 0.02 - ih.max.y, best.z);
      it.group.rotation.y = best.yaw;
      it.home = it.group.position.clone();
      scene.add(it.group);
    }
    for (let k = 0; k < 2; k++) {
      for (let tries = 0; tries < 200; tries++) {
        const x = c.x + (R() * 2 - 1) * 0.8, z = c.z - 0.05 + (R() * 2 - 1) * 0.25;
        if (placed.some(p => Math.abs(x - p.x) < p.hx + 0.1 && Math.abs(z - p.z) < p.hz + 0.1)) continue;
        if (fps.some(f => Math.hypot(f.x - x, f.z - z) < 0.3)) continue;
        fps.push({ x, z, yaw: R() * 6.28, size: 0.13 + R() * 0.03, seen: false });
        break;
      }
    }
    const floorFn = (x, z) => {
      if (!pitIn(x, z)) {
        const dx = Math.max(0, Math.abs(x - c.x) - 1.0), dz = Math.max(0, z - (c.z + 0.35), (c.z - 0.45) - z);
        return -0.02 - 0.0 * (dx + dz);
      }
      let f = FLOOR + fbm(x * 4, 1, z * 4, 3) * 0.006;
      for (const fp of fps) {
        const wx = x - fp.x, wz = z - fp.z, cs = Math.cos(fp.yaw), sn = Math.sin(fp.yaw);
        const lx = (wx * cs - wz * sn) / fp.size, lz = (wx * sn + wz * cs) / fp.size;
        const s = footShape(lx, lz); if (s > 0) f -= 0.028 * s;
      }
      return f;
    };
    const top0 = (x, z) => 0.0015 + fbm(x * 2.2, 5, z * 2.2, 3) * 0.004 + Math.sin(z * 50 + fbm(x, 0, z, 2) * 4) * 0.0006;
    const field = new SandField({ x0: c.x - 1.18, z0: c.z - 0.62, w: 2.36, d: 1.14, cell: 0.0078, floor: floorFn, top0, floorTex: 'hardpan' });
    scene.add(field.mesh);
    // bones as obstacles
    for (const key of ITEM_KEYS) {
      const it = fossil.items[key];
      const obs = fossil.computeSamples(it);
      field.addObject(key, obs, 1);
      it.state = 'buried';
      it.revealed = 0;
    }
    // rocks covering some items
    const rocks = [];
    const rockKeys = keys.filter(k => k !== 'ribs').slice(0, 3);
    for (const key of rockKeys) {
      const it = fossil.items[key];
      const pl = placed[keys.indexOf(key)];
      const mat = rockCrackMat();
      const geo = rockGeo(1, (R() * 100) | 0, 4, 0.75);
      const m = new THREE.Mesh(geo, mat);
      const sx = Math.min(0.28, it.extent.x * 0.8), sz = Math.min(0.2, it.extent.z * 0.95 + 0.03);
      m.scale.set(sx, 0.19, sz);
      m.position.set(pl.x + (R() - 0.5) * 0.05, -0.1, pl.z);
      m.rotation.y = pl.yaw;
      m.castShadow = m.receiveShadow = true;
      scene.add(m);
      m.updateMatrixWorld(true);
      const samp = [];
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i += 2) samp.push(V().fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld));
      field.addObject('rock_' + key, samp, 1);
      const rock = { mesh: m, key, hits: 0, need: 3 + ((R() * 2) | 0), broken: false, wob: 0 };
      rocks.push(rock); it.rock = rock;
    }
    field.flush(true);
    const stakes = PR.makeStakesAndStrings(c.x - 1.02, c.x + 1.02, c.z - 0.47, c.z + 0.37); scene.add(stakes);
    const cloth = PR.makeToolCloth(); cloth.position.set(c.x + 0.62, 0, c.z + 0.68); cloth.rotation.y = 0.12; scene.add(cloth);
    const tarp = PR.makeTarp(1.0, 0.75); tarp.position.set(c.x - 0.72, 0, c.z + 0.85); tarp.rotation.y = -0.1; scene.add(tarp);
    this.pit = { c, field, fossil, rocks, fps, stakes, cloth, tarp, found: 0, species };
  }

  // ---------------------------------------------------------------- helpers
  setGirlPose(p) { this.girlPose = p; }
  rayHeightfield(field, ray) {
    // march the ray against the heightfield
    const o = ray.ray.origin, d = ray.ray.direction;
    if (d.y > -0.01) return null;
    let t = (0.12 - o.y) / d.y; if (t < 0) t = 0;
    let prev = null;
    for (let i = 0; i < 80; i++) {
      tmpV.copy(o).addScaledVector(d, t);
      if (!field.inside(tmpV.x, tmpV.z)) { if (prev) return null; t += 0.03; if (tmpV.y < -0.3) return null; continue; }
      const h = field.heightAt(tmpV.x, tmpV.z);
      if (tmpV.y <= h) {
        // refine
        let a = t - 0.01, b = t;
        for (let k = 0; k < 6; k++) { const m = (a + b) / 2; tmpV2.copy(o).addScaledVector(d, m); if (tmpV2.y <= field.heightAt(tmpV2.x, tmpV2.z)) b = m; else a = m; }
        return o.clone().addScaledVector(d, b);
      }
      prev = t; t += 0.01;
    }
    return null;
  }
  hitObjects(ray, objs) {
    const hits = ray.intersectObjects(objs, true);
    return hits[0] || null;
  }
  fade(cb, dur = 0.5) { this.fadeAnim = { t: 0, dur, cb, done: false }; }

  // ---------------------------------------------------------------- SCENE 0: dress up
  enterDress() {
    this.state = 'dress';
    const g = this.girl;
    g.root.position.set(0.35, 0, -1.3); g.root.rotation.y = 0.15;
    g.hat.visible = false; g.setVest(false);
    g.face('neutral');
    this.dress = { hat: false, vest: false, flying: null, done: 0 };
    // the hat object lives on the table until tapped
    this.tableHat = g.hat.clone(); this.tableHat.visible = true;
    this.table.add(this.tableHat); this.tableHat.position.copy(this.hatSpot); this.tableHat.rotation.set(0, 0.3, 0); this.tableHat.scale.setScalar(1);
    this.reframe = () => { const portrait = view.aspect < 0.9;
    setShot(portrait ? { target: V(0.62, 0.66, -1.3), yaw: 0.1, halfW: 0.5, halfH: 0.9, eye: 1.25, minDist: 1.4 } : { target: V(0.62, 0.72, -1.3), yaw: 0.05, halfW: 0.78, halfH: 0.68, eye: 1.2, minDist: 1.6 }, 0); }; this.reframe();
    setShadowFocus(V(0.5, 0, -1.2), 3);
    this.handlers = {
      down: (inp) => {
        const ray = rayFrom(inp.ndc);
        const hit = this.hitObjects(ray, [this.tableHat, this.vestFold, g.headMesh]);
        if (!hit) { this.girlReact('look', ray); return; }
        let o = hit.object; let isHat = false, isVest = false;
        while (o) { if (o === this.tableHat) isHat = true; if (o === this.vestFold) isVest = true; o = o.parent; }
        if (isHat && !this.dress.hat) this.flyDress('hat');
        else if (isVest && !this.dress.vest) this.flyDress('vest');
        else { g.face('happy'); say.giggle(); this.later(0.8, () => g.face('neutral')); }
      },
    };
  }
  flyDress(what) {
    if (this.dress.flying) return;
    const g = this.girl;
    sfx.swoosh();
    const from = new THREE.Vector3();
    const obj = what === 'hat' ? this.tableHat : this.vestFold;
    obj.getWorldPosition(from);
    const q0 = new THREE.Quaternion(); obj.getWorldQuaternion(q0);
    scene.attach(obj);
    this.dress.flying = { what, obj, from, t: 0, q0 };
    g.face('wow'); say.wow();
  }
  updateDress(dt) {
    const g = this.girl, D = this.dress;
    this.poseStand(dt);
    g.lookAt(D.flying ? D.flying.obj.position : (this.lookTarget || camera.position), 1);
    if (D.flying) {
      const F = D.flying; F.t += dt / 0.9;
      const k = easeInOut(F.t);
      let to;
      if (F.what === 'hat') { to = V(); g.hat.getWorldPosition(to); }
      else { to = V(); g.J.chest.getWorldPosition(to); }
      F.obj.position.lerpVectors(F.from, to, k); F.obj.position.y += Math.sin(k * Math.PI) * 0.35;
      F.obj.rotation.y += dt * 6 * (1 - k);
      if (F.what === 'vest') F.obj.scale.setScalar(1 - 0.5 * k);
      // girl raises hands to catch
      const hp = F.obj.position;
      g.armIK.L = { t: hp.clone().add(V(0.12, -0.05, 0)), w: k };
      g.armIK.R = { t: hp.clone().add(V(-0.12, -0.05, 0)), w: k };
      if (F.t >= 1) {
        F.obj.visible = false;
        if (F.what === 'hat') { g.hat.visible = true; D.hat = true; } else { g.setVest(true); D.vest = true; }
        sfx.pop(); spawnDust(hp, 3, { size: 0.08, alpha: 0.15 });
        g.face('happy'); say.yay();
        this.spin = 1;
        D.flying = null; g.armIK.L = g.armIK.R = null;
        if (D.hat && D.vest) {
          this.later(1.2, () => { g.face('laugh'); say.giggle(); this.jump = 1; });
          this.later(2.6, () => this.fade(() => this.enterDig()));
        }
      }
    }
    if (this.spin > 0) { this.spin = Math.max(0, this.spin - dt * 1.4); g.root.rotation.y = 0.15 + (1 - easeInOut(1 - this.spin)) * Math.PI * 2 * (this.dress.hat && this.dress.vest ? 1 : 0.12) * 0; }
  }
  hintDress() {
    if (this.dress.flying) return null;
    const p = V();
    if (!this.dress.hat) { this.tableHat.getWorldPosition(p); return { p, kind: 'tap', glint: true }; }
    if (!this.dress.vest) { this.vestFold.getWorldPosition(p); return { p, kind: 'tap', glint: true }; }
    return null;
  }

  // ---------------------------------------------------------------- SCENE 1: dig
  enterDig() {
    this.state = 'dig';
    this.girl.armIK.L = this.girl.armIK.R = null; this.reachTo = null; this.handPress = null; this.lookOverride = null;
    const P = this.pit, g = this.girl;
    g.root.position.set(P.c.x, 0, P.c.z - 0.72); g.root.rotation.y = 0;
    g.face('focus');
    this.dig = { tip: V(P.c.x, 0, P.c.z), brushing: false, last: null, speed: 0, hamAnim: -1, hamQ: [], workX: P.c.x, skid: 0, lift: null, celebrate: false, holdT: 0 };
    this.tool = 'brush';
    this.placeToolOnCloth();
    setShadowFocus(V(P.c.x, 0, P.c.z), 2.6);
    this.camDig(0);
    this.reframe = () => this.camDig(0);
    this.handlers = {
      down: inp => this.digDown(inp),
      move: inp => this.digMove(inp),
      up: inp => { this.dig.brushing = false; brushLevel(0); },
    };
  }
  camDig(dur) {
    const P = this.pit;
    const portrait = view.aspect < 0.9;
    const hw = portrait ? 0.62 : 1.08;
    const panMax = Math.max(0, 1.05 - hw);
    const tx = P.c.x + clamp(this.dig ? this.dig.workX - P.c.x : 0, -panMax, panMax);
    setShot(portrait ? { target: V(tx, 0.14, P.c.z - 0.1), yaw: 0, halfW: hw, halfH: 0.8, eye: 1.75, minDist: 1.5 } : { target: V(tx, 0.24, P.c.z - 0.12), yaw: 0, halfW: hw, halfH: 0.56, eye: 1.02, minDist: 1.5 }, dur);
  }
  placeToolOnCloth() {
    const P = this.pit;
    const other = this.tool === 'brush' ? this.hammer : this.brush;
    other.userData.onCloth = true;
    const cp = P.cloth.position;
    other.position.set(cp.x + 0.02, 0.02, cp.z);
    other.quaternion.setFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI / 2 + 0.25));
    if (other === this.hammer) other.quaternion.setFromEuler(new THREE.Euler(0, 0.3, Math.PI / 2)), other.position.set(cp.x - 0.12, 0.015, cp.z + 0.02);
    else other.position.set(cp.x + 0.0, 0.018, cp.z);
    const held = this.tool === 'brush' ? this.brush : this.hammer;
    held.userData.onCloth = false;
  }
  digDown(inp) {
    const P = this.pit, D = this.dig;
    if (D.celebrate) return;
    const ray = rayFrom(inp.ndc);
    // tool on cloth?
    const other = this.tool === 'brush' ? this.hammer : this.brush;
    const toolHit = this.hitObjects(ray, [other, P.cloth]);
    if (toolHit) { this.swapTool(); return; }
    // pickable bones?
    const meshes = [];
    for (const k of ITEM_KEYS) { const it = P.fossil.items[k]; if (it.state === 'buried') meshes.push(...it.meshes); }
    const rockMeshes = P.rocks.filter(r => !r.broken).map(r => r.mesh);
    const objHit = this.hitObjects(ray, [...meshes, ...rockMeshes]);
    const sandHit = this.rayHeightfield(P.field, ray);
    const sandDist = sandHit ? sandHit.distanceTo(ray.ray.origin) : 1e9;
    if (objHit && objHit.distance < sandDist + 0.01) {
      const rock = P.rocks.find(r => r.mesh === objHit.object);
      if (rock) {
        if (this.tool === 'hammer') { this.queueHammer(objHit.point, rock); return; }
        D.skid = 1; sfx.tap(); this.girl.face('puzzled'); say.hmm(); D.tip.copy(objHit.point); this.later(0.9, () => this.girl.face('focus'));
        this.hammerHint = 3;
        return;
      }
      const item = ITEM_KEYS.map(k => P.fossil.items[k]).find(it => it.meshes.includes(objHit.object));
      if (item && item.revealed >= 0.5 && !(item.rock && !item.rock.broken)) { this.liftItem(item); return; }
      if (this.tool === 'hammer') { this.queueHammer(objHit.point, null); return; }
    }
    if (!sandHit) return;
    // footprint touch: girl presses her hand in it
    for (const fp of P.fps) {
      if (fp.seen && Math.hypot(sandHit.x - fp.x, sandHit.z - fp.z) < fp.size * 0.6 && this.tool === 'brush' && P.field.sandAt(fp.x, fp.z) < 0.004) {
        this.handPress = { p: V(fp.x, P.field.heightAt(fp.x, fp.z), fp.z), t: 0 }; say.giggle(); this.girl.face('laugh'); sfx.pop();
        this.later(1.2, () => this.girl.face('focus'));
        return;
      }
    }
    if (this.tool === 'hammer') { this.queueHammer(sandHit, null); return; }
    D.brushing = true; D.last = sandHit.clone(); D.tip.copy(sandHit); D.holdT = 0;
  }
  digMove(inp) {
    const P = this.pit, D = this.dig;
    if (!D.brushing) return;
    const ray = rayFrom(inp.ndc);
    const h = this.rayHeightfield(P.field, ray);
    if (h) D.tip.copy(h);
  }
  swapTool() {
    this.tool = this.tool === 'brush' ? 'hammer' : 'brush';
    sfx.clack(); this.girl.face('happy'); say.hup(); this.faceCamT = 0.9;
    this.placeToolOnCloth();
    this.later(0.6, () => this.girl.face('focus'));
  }
  queueHammer(p, rock) { if (this.dig.hamQ.length < 3) this.dig.hamQ.push({ p: p.clone(), rock }); }
  hammerImpact(h) {
    const P = this.pit;
    sfx.tap(); camShake(0.004);
    if (h.rock) {
      const r = h.rock;
      r.hits++; r.wob = 1;
      const local = r.mesh.worldToLocal(h.p.clone());
      const hits = r.mesh.material.userData.hits;
      const slot = Math.min(7, r.hits - 1);
      hits[slot].set(local.x, local.y, local.z, 0.5 + r.hits * 0.35);
      for (let i = 0; i < r.hits - 1; i++) hits[i].w = Math.min(2.2, hits[i].w + 0.35);
      spawnGrains(h.p, V(0, 1, 0), 26, { speed: 0.9, color: [0.7, 0.5, 0.34], size: 0.003, spread: 0.02 });
      spawnDust(h.p, 2, { size: 0.07, alpha: 0.18 });
      if (r.hits >= r.need) this.breakRock(r); else { sfx.crack(); this.girl.face(r.hits === 1 ? 'focus' : 'wow'); }
    } else {
      if (P.field.inside(h.p.x, h.p.z)) P.field.dent(h.p.x, h.p.z);
      spawnGrains(h.p, V(0, 1, 0), 30, { speed: 0.7 });
      spawnDust(h.p, 2, { size: 0.06 });
    }
  }
  breakRock(r) {
    const P = this.pit;
    r.broken = true; sfx.breakRock(); camShake(0.01);
    r.mesh.visible = false;
    P.field.removeObject('rock_' + r.key);
    // fragments tumble to the side
    const R = this.R;
    r.frags = [];
    for (let i = 0; i < 6; i++) {
      const fg = new THREE.Mesh(rockGeo(1, i * 13 + 5, 3, 0.8), r.mesh.material);
      const s = r.mesh.scale.x * (0.25 + R() * 0.2);
      fg.scale.set(s, s * 0.8, s);
      const a = i / 6 * Math.PI * 2 + R();
      fg.position.copy(r.mesh.position).add(V(Math.cos(a) * 0.06, 0.08, Math.sin(a) * 0.05));
      fg.castShadow = fg.receiveShadow = true;
      scene.add(fg);
      r.frags.push({ m: fg, v: V(Math.cos(a) * (0.5 + R() * 0.5), 1.0 + R() * 0.6, Math.sin(a) * (0.35 + R() * 0.4)), w: V(R() * 8, R() * 8, R() * 8), rest: false });
    }
    spawnGrains(r.mesh.position.clone().add(V(0, 0.05, 0)), V(0, 1, 0), 140, { speed: 1.3, spread: 0.12, color: [0.68, 0.48, 0.32], size: 0.004 });
    spawnDust(r.mesh.position.clone().add(V(0, 0.04, 0)), 8, { size: 0.12, alpha: 0.25 });
    this.girl.face('wow'); say.wow(); this.faceCamT = 1.8;
    this.later(1.0, () => { this.girl.face('happy'); });
    this.later(2.0, () => this.girl.face('focus'));
  }
  liftItem(item) {
    const P = this.pit;
    item.state = 'lifting';
    P.field.removeObject(item.key);
    sfx.pick(); say.yay(); this.girl.face('laugh'); this.faceCamT = 1.4;
    this.later(1.4, () => this.girl.face('focus'));
    const from = item.group.position.clone();
    const n = P.found++;
    const tp = P.tarp.position;
    const to = V(tp.x - 0.3 + (n % 3) * 0.28 + (this.R() - 0.5) * 0.06, 0.012 + Math.floor(n / 3) * 0.03, tp.z - 0.18 + (n % 2) * 0.3);
    item.lift = { from, to, t: 0, yaw0: item.group.rotation.y, yaw1: (this.R() - 0.5) * 1.2 };
    spawnGrains(from.clone().add(V(0, 0.12, 0)), V(0, 1, 0), 80, { speed: 0.8, spread: 0.25 });
    spawnDust(from.clone().add(V(0, 0.1, 0)), 5, { size: 0.12 });
  }
  updateDig(dt) {
    const P = this.pit, D = this.dig, g = this.girl, f = P.field;
    // brushing simulation
    let removed = 0;
    if (D.brushing && this.tool === 'brush') {
      D.holdT += dt;
      const dx = D.tip.x - D.last.x, dz = D.tip.z - D.last.z;
      const sp = Math.hypot(dx, dz) / Math.max(dt, 1e-3);
      D.speed = damp(D.speed, sp, 10, dt);
      // the bristles also work when held still (little scrubbing motion)
      const jig = Math.sin(this.t * 28) * 0.006;
      const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.01));
      for (let s = 1; s <= steps; s++) {
        const x = D.last.x + dx * s / steps + (sp < 0.05 ? jig : 0), z = D.last.z + dz * s / steps;
        removed += f.brush(x, z, dx || 0.001, dz || 0.0001, dt / steps, sp < 0.05 ? 0.6 : 1);
      }
      D.last.copy(D.tip);
      if (removed > 0) {
        const dir = V(dx, 0, dz).normalize();
        const n = Math.min(40, Math.ceil(removed * 4e6));
        spawnGrains(D.tip.clone().add(V(0, 0.005, 0)), dir.lengthSq() ? dir : V(0, 0, 1), n, { speed: 0.35 + Math.min(1, D.speed) * 0.6, up: 0.8 });
        if (Math.random() < removed * 2e5) spawnDust(D.tip, 1, { size: 0.05, alpha: 0.12, dx: dir.x * 0.05, dz: dir.z * 0.05 });
      }
      brushLevel(Math.min(1, D.speed * 1.4 + 0.1) * (removed > 0 ? 1 : 0.35));
    } else { D.speed = damp(D.speed, 0, 8, dt); }
    f.flush();
    // exposure checks (amortized)
    this.expoTick = (this.expoTick || 0) + 1;
    const keys = ITEM_KEYS;
    const it = P.fossil.items[keys[this.expoTick % keys.length]];
    if (it.state === 'buried') {
      const before = it.revealed;
      it.revealed = f.exposure(it.samples);
      if (before < 0.5 && it.revealed >= 0.5 && !(it.rock && !it.rock.broken)) { sfx.reveal(); this.faceCamT = 1.6; g.face('wow'); say.wow(); this.later(1.0, () => g.face('happy')); this.later(2.2, () => g.face('focus')); }
    }
    for (const fp of P.fps) {
      if (!fp.seen && f.sandAt(fp.x, fp.z) < 0.003 && f.sandAt(fp.x + Math.cos(fp.yaw) * fp.size * 0.6, fp.z - Math.sin(fp.yaw) * fp.size * 0.6) < 0.004) {
        fp.seen = true; sfx.reveal(); g.face('wow'); say.wow(); this.faceCamT = 1.5; this.later(1.2, () => g.face('focus'));
      }
    }
    // rocks wobble
    for (const r of P.rocks) {
      if (!r.broken) { r.wob = Math.max(0, r.wob - dt * 4); r.mesh.rotation.z = Math.sin(this.t * 60) * 0.02 * r.wob; }
      if (r.frags) for (const fr of r.frags) {
        if (fr.rest) continue;
        fr.v.y -= 9.8 * dt; fr.m.position.addScaledVector(fr.v, dt);
        fr.m.rotation.x += fr.w.x * dt; fr.m.rotation.y += fr.w.y * dt;
        const gy = this.groundAt(fr.m.position.x, fr.m.position.z) + fr.m.scale.y * 0.4;
        if (fr.m.position.y < gy) { fr.m.position.y = gy; if (fr.v.y < -0.6) { fr.v.y *= -0.3; fr.v.x *= 0.5; fr.v.z *= 0.5; fr.w.multiplyScalar(0.5); sfx.thud(); } else fr.rest = true; }
      }
    }
    // lifted items fly to the tarp
    for (const k of keys) {
      const item = P.fossil.items[k];
      if (item.state !== 'lifting') continue;
      const L = item.lift; L.t += dt / 1.3;
      const kk = easeInOut(L.t);
      item.group.position.lerpVectors(L.from, L.to, kk);
      item.group.position.y += Math.sin(kk * Math.PI) * 0.45;
      item.group.rotation.y = lerp(L.yaw0, L.yaw1, kk);
      item.group.rotation.z = Math.sin(kk * Math.PI) * 0.3;
      if (L.t >= 1) { item.state = 'collected'; item.group.rotation.z = 0; sfx.clack(); spawnDust(L.to, 2, { size: 0.07 }); }
    }
    // girl kneeling, follows the work point
    this.poseKneel(dt);
    const work = D.hamAnim >= 0 && D.hamCur ? D.hamCur.p : D.tip;
    D.workX = damp(D.workX, clamp(work.x, P.c.x - 0.95, P.c.x + 0.95), 3, dt);
    g.root.position.x = D.workX + 0.12;
    if (this.faceCamT > 0) this.faceCamT -= dt;
    g.lookAt(this.lookOverride || (this.faceCamT > 0 ? camera.position : work), 1);
    // tools
    this.updateTools(dt, work);
    // camera pan (portrait)
    this.camDig(0.0);
    // goal
    if (!D.celebrate && keys.every(k => P.fossil.items[k].state === 'collected')) {
      D.celebrate = true; brushLevel(0);
      this.later(0.6, () => { g.face('laugh'); say.yay(); sfx.fanfare(); this.jump = 1; });
      this.later(3.0, () => this.fade(() => this.enterAssemble(), 0.7));
    }
  }
  updateTools(dt, work) {
    const g = this.girl, D = this.dig;
    const held = this.tool === 'brush' ? this.brush : this.hammer;
    const shoulder = V(); g.J.shR.getWorldPosition(shoulder);
    // hammer animation
    if (D.hamAnim < 0 && D.hamQ.length) { D.hamCur = D.hamQ.shift(); D.hamAnim = 0; }
    let tip = work.clone();
    let lift = 0;
    if (D.hamAnim >= 0) {
      D.hamAnim += dt / 0.42;
      const a = D.hamAnim;
      lift = a < 0.6 ? Math.sin(a / 0.6 * Math.PI / 2) * 0.14 : (a < 0.78 ? (1 - (a - 0.6) / 0.18) * 0.14 : 0);
      if (a >= 0.78 && !D.hamHit) { D.hamHit = true; this.hammerImpact(D.hamCur); }
      if (a >= 1) { D.hamAnim = -1; D.hamHit = false; }
    } else if (this.tool === 'hammer') lift = 0.06 + Math.sin(this.t * 2) * 0.01;
    if (this.tool === 'brush' && !D.brushing) lift = 0.03 + Math.sin(this.t * 1.5) * 0.005;
    if (D.skid > 0) { D.skid -= dt * 2; lift += Math.abs(Math.sin(D.skid * 20)) * 0.02; }
    tip.y += lift;
    // tool orientation: from hand toward tip, tool length
    const len = this.tool === 'brush' ? 0.2 : 0.27;
    const dir = tip.clone().sub(shoulder); dir.y = Math.min(dir.y, -0.15); dir.normalize();
    // keep the handle tilted up (natural grip)
    const handleDir = dir.clone().multiplyScalar(-1); handleDir.y = Math.max(handleDir.y, 0.55); handleDir.normalize();
    const hand = tip.clone().addScaledVector(handleDir, len);
    if (this.tool === 'brush') {
      held.position.copy(tip).addScaledVector(handleDir, 0.0);
      held.quaternion.setFromUnitVectors(V(0, 1, 0), handleDir);
      // bristles bend against the stroke
      const b = held.userData.bristles;
      const mv = D.brushing ? Math.min(1, D.speed * 2) : 0;
      b.rotation.x = damp(b.rotation.x, mv * 0.35, 12, dt);
    } else {
      // hammer: head at the tip, handle up toward the hand
      const hd = handleDir.clone();
      held.position.copy(tip).addScaledVector(hd, -0.0);
      const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), hd);
      held.quaternion.copy(q);
      held.position.copy(tip).sub(V(-0.075, 0, 0).applyQuaternion(q)).addScaledVector(hd, 0.0);
      held.position.copy(tip).add(V(0.075, 0.013, 0).applyQuaternion(q));
    }
    g.armIK.R = { t: hand, w: 1, pole: V(-0.6, -0.4, -0.5) };
    g.setGrip('R', 0.95);
    // off hand on the ground / knee
    const lh = V(); g.J.hipL.getWorldPosition(lh); lh.add(V(0.12, -0.2, 0.16));
    if (this.handPress) { this.handPress.t += dt; const k = Math.sin(clamp(this.handPress.t / 1.2, 0, 1) * Math.PI); lh.lerp(this.handPress.p.clone().add(V(0, 0.02, 0)), k); if (this.handPress.t > 1.2) this.handPress = null; }
    g.armIK.L = { t: lh, w: 1, pole: V(0.6, -0.3, -0.6) };
    // the other tool wiggles when it is needed
    const other = this.tool === 'brush' ? this.hammer : this.brush;
    if (this.hammerHint > 0 && this.tool === 'brush') { this.hammerHint -= dt; other.rotation.z = Math.PI / 2 + Math.sin(this.t * 18) * 0.06 * Math.min(1, this.hammerHint); }
  }
  hintDig() {
    const P = this.pit;
    // 1) a revealed free bone -> tap it
    for (const k of ITEM_KEYS) { const it = P.fossil.items[k]; if (it.state === 'buried' && it.revealed >= 0.5 && !(it.rock && !it.rock.broken)) { const p = V(); it.meshes[(it.meshes.length / 2) | 0].getWorldPosition(p); return { p, kind: 'tap', glint: true }; } }
    // 2) rock that is exposed: hammer
    const rk = P.rocks.find(r => !r.broken);
    if (rk && this.tool === 'brush' && this.hammerHint > 0) { const p = this.hammer.position.clone(); return { p, kind: 'tap', glint: true }; }
    if (rk && this.tool === 'hammer') return { p: rk.mesh.position.clone().add(V(0, 0.08, 0)), kind: 'tap', glint: false };
    // 3) a buried item: brush there
    for (const k of ITEM_KEYS) { const it = P.fossil.items[k]; if (it.state === 'buried' && !(it.rock && !it.rock.broken)) { if (this.tool === 'hammer') return { p: this.brush.position.clone(), kind: 'tap', glint: true }; return { p: it.group.position.clone().setY(0), kind: 'drag', glint: false }; } }
    if (rk && this.tool === 'brush') return { p: this.hammer.position.clone(), kind: 'tap', glint: true };
    return null;
  }

  // ---------------------------------------------------------------- SCENE 2: assemble
  enterAssemble() {
    this.state = 'assemble';
    this.girl.armIK.L = this.girl.armIK.R = null; this.reachTo = null; this.handPress = null; this.lookOverride = null;
    const g = this.girl, P = this.pit;
    const si = this.round % STAND_POS.length;
    const sp = STAND_POS[si].clone();
    // previous skeleton on this stand (3rd round) is retired
    if (this.stands[si]) { scene.remove(this.stands[si].grp); }
    const skel = P.fossil.sk;
    const stand = PR.makeStand(skel); stand.position.copy(sp); scene.add(stand);
    const sign = PR.makeSign(skel); sign.position.set(sp.x + 2.0, 0, sp.z - 0.35); sign.rotation.y = -0.35; scene.add(sign);
    const tarp = PR.makeTarp(1.5, 1.0); tarp.position.set(sp.x - 1.0, 0, sp.z + 1.3); tarp.rotation.y = 0.12; scene.add(tarp);
    const skG = new THREE.Group(); skG.position.set(sp.x, 0.12, sp.z); scene.add(skG);
    const S = { sp, stand, sign, tarp, skG, placed: 0, papaDone: false, items: [], grp: new THREE.Group(), fly: [], tumble: [], complete: false, decoys: [] };
    S.grp.add(stand, sign, tarp, skG);
    scene.add(S.grp);
    this.stands[si] = S;
    this.asm = S;
    // the found items lie on the tarp (pile)
    const R = this.R;
    ITEM_KEYS.forEach((k, i) => {
      const it = P.fossil.items[k];
      it.state = 'pile';
      tarp.updateMatrixWorld(true);
      const lp = V((i % 4 - 1.5) * 0.34 + (R() - 0.5) * 0.06, 0.01 + Math.floor(i / 4) * 0.02, (Math.floor(i / 4) - 0.5) * 0.42 + (R() - 0.5) * 0.05);
      it.group.position.copy(lp.applyMatrix4(tarp.matrixWorld));
      it.group.rotation.set(0, (R() - 0.5) * 0.8 + (R() < 0.5 ? 0 : Math.PI), 0);
      // restore dig layout
      for (const m of it.meshes) { it.group.add(m); m.position.copy(m.userData.dig.pos); m.quaternion.copy(m.userData.dig.quat); m.scale.copy(m.userData.dig.scale); }
      S.items.push(it);
    });
    // decoys: a gnarled stick and a bone-coloured stone
    const stick = new THREE.Mesh(sweep([V(-0.2, 0.02, 0), V(-0.05, 0.03, 0.03), V(0.08, 0.02, -0.02), V(0.22, 0.025, 0.04)], { segs: 14, radial: 8, radius: t => 0.016 * (1 - t * 0.4) + 0.003 * Math.sin(t * 20) }), PR.M.wood);
    const stone = new THREE.Mesh(rockGeo(0.07, 77, 3, 0.7), boneMat);
    stone.geometry.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(stone.geometry.attributes.position.count * 3).fill(0.85), 3));
    [stick, stone].forEach((d, i) => { d.castShadow = d.receiveShadow = true; const lp = V(i ? 0.55 : -0.62, 0.02, i ? -0.3 : 0.35); d.position.copy(lp.applyMatrix4(tarp.matrixWorld)); d.rotation.y = R() * 3; scene.add(d); S.decoys.push({ m: d, state: 'pile' }); S.grp.add(d); });
    // girl stands left of the stand
    g.root.position.set(sp.x - 2.0, 0, sp.z + 0.55); g.root.rotation.y = 0.75;
    g.face('happy');
    this.papa.root.visible = false;
    setShadowFocus(V(sp.x - 0.3, 0, sp.z + 0.3), 3.4);
    this.camAssemble(0);
    this.reframe = () => this.camAssemble(0, S.complete);
    this.handlers = {
      down: inp => this.asmDown(inp),
    };
  }
  camAssemble(dur, wide = false) {
    const sp = this.asm.sp;
    const portrait = view.aspect < 0.9;
    if (portrait) setShot({ target: V(sp.x - 0.75, wide ? 0.9 : 0.75, sp.z + 0.6), yaw: -0.8, halfW: 1.0, halfH: 1.25, eye: 1.5, minDist: 2.6 }, dur);
    else setShot({ target: V(sp.x - 0.4, wide ? 0.95 : 0.72, sp.z + 0.75), yaw: -0.06, halfW: wide ? 2.2 : 1.95, halfH: wide ? 1.1 : 0.92, eye: 1.45, minDist: 2.6 }, dur);
  }
  asmDown(inp) {
    const S = this.asm;
    if (S.complete || this.papaAct) return;
    const ray = rayFrom(inp.ndc);
    const cand = [];
    for (const it of S.items) if (it.state === 'pile' || it.state === 'fallen') cand.push(...it.meshes);
    for (const d of S.decoys) if (d.state === 'pile') cand.push(d.m);
    const hit = this.hitObjects(ray, cand);
    if (!hit) { this.girl.face('happy'); return; }
    const dec = S.decoys.find(d => d.m === hit.object);
    if (dec) { this.decoyAct(dec); return; }
    const it = S.items.find(i => i.meshes.includes(hit.object));
    if (it) this.mountItem(it);
  }
  mountItem(it) {
    const S = this.asm, g = this.girl;
    it.state = 'flying';
    sfx.swoosh(); g.face('happy');
    S.skG.updateMatrixWorld(true);
    const list = [];
    it.meshes.forEach((m, i) => {
      S.skG.attach(m);
      list.push({ m, p0: m.position.clone(), q0: m.quaternion.clone(), s0: m.scale.clone(), delay: i * 0.035, t: 0 });
    });
    S.fly.push({ it, list });
    this.reachTo = V(); this.reachTo.copy(it.meshes[0].getWorldPosition(V()));
  }
  decoyAct(dec) {
    const g = this.girl, S = this.asm;
    dec.state = 'held'; sfx.swoosh();
    const hand = V(); g.J.wrR.getWorldPosition(hand);
    dec.anim = { from: dec.m.position.clone(), t: 0, phase: 0 };
    g.face('neutral');
  }
  updateAssemble(dt) {
    const S = this.asm, g = this.girl;
    this.poseStand(dt);
    // flying bones: per-bone stagger into the mount pose
    for (const F of S.fly) {
      let done = true;
      for (const b of F.list) {
        b.t += dt;
        const k = easeInOut(clamp((b.t - b.delay) / 1.1, 0, 1));
        const mp = b.m.userData.mount;
        b.m.position.lerpVectors(b.p0, mp.pos, k); b.m.position.y += Math.sin(k * Math.PI) * 0.4;
        b.m.quaternion.slerpQuaternions(b.q0, mp.quat, k);
        b.m.scale.lerpVectors(b.s0, mp.scale, k);
        if (k < 1) done = false;
      }
      if (done && !F.done) {
        F.done = true; F.it.state = 'mounted'; S.placed++;
        sfx.place(S.placed); spawnDust(F.list[0].m.getWorldPosition(V()), 2, { size: 0.08, alpha: 0.12 });
        g.face('laugh'); say.yay(); this.later(1.0, () => g.face('happy'));
        if (this.papa.root.visible && !this.papaAct) { this.papa.face('happy'); this.papaClap = 1.2; }
        if (S.placed === 4 && !S.papaDone) this.later(0.8, () => this.startPapaTrip());
        if (S.items.every(i => i.state === 'mounted')) this.completeSkeleton();
      }
    }
    S.fly = S.fly.filter(F => !F.done);
    // decoy: hand it to the girl -> "あれ？" -> giggle -> toss aside
    for (const d of S.decoys) {
      if (!d.anim) continue;
      const A = d.anim; A.t += dt;
      const hand = V(); g.J.wrR.getWorldPosition(hand);
      if (A.phase === 0) {
        const k = easeInOut(A.t / 0.8);
        d.m.position.lerpVectors(A.from, hand.clone().add(V(0, -0.06, 0.05)), k); d.m.position.y += Math.sin(k * Math.PI) * 0.25;
        this.reachTo = d.m.position.clone();
        if (A.t > 0.8) { A.phase = 1; A.t = 0; g.face('puzzled'); say.are(); this.girlTilt = 1; }
      } else if (A.phase === 1) {
        d.m.position.copy(hand).add(V(0, -0.06, 0.05));
        this.reachTo = V(g.root.position.x + 0.2, 1.0, g.root.position.z + 0.35);
        if (A.t > 1.3) { A.phase = 2; A.t = 0; g.face('laugh'); say.giggle(); this.girlTilt = 0; A.from = d.m.position.clone(); A.to = V(g.root.position.x - 0.7 - Math.random() * 0.4, 0.03, g.root.position.z - 0.5 + Math.random() * 0.4); }
      } else if (A.phase === 2) {
        const k = clamp(A.t / 0.9, 0, 1);
        d.m.position.lerpVectors(A.from, A.to, k); d.m.position.y += Math.sin(k * Math.PI) * 0.5; d.m.rotation.x += dt * 6;
        if (k >= 1) { d.anim = null; d.state = 'tossed'; sfx.thud(); spawnDust(A.to, 3, { size: 0.08 }); this.later(0.6, () => g.face('happy')); }
      }
    }
    // tumbling bones after papa's trip
    for (const T of S.tumble) {
      if (T.rest) continue;
      T.v.y -= 9.8 * dt;
      T.m.position.addScaledVector(T.v, dt);
      T.m.rotation.x += T.w.x * dt; T.m.rotation.z += T.w.z * dt;
      const gy = this.groundAt(T.m.position.x, T.m.position.z) + 0.03;
      if (T.m.position.y < gy) {
        T.m.position.y = gy;
        if (T.v.y < -1) { T.v.y *= -0.25; T.v.x *= 0.4; T.v.z *= 0.4; T.w.multiplyScalar(0.4); if (Math.random() < 0.3) sfx.clack(); }
        else { T.rest = true; T.m.quaternion.slerp(T.flatQ, 1); T.m.position.y = this.groundAt(T.m.position.x, T.m.position.z) + T.h; }
      }
    }
    // girl arms reach toward the bone she is placing
    if (this.reachTo) {
      g.armIK.R = { t: this.reachTo.clone(), w: 0.8, pole: V(-0.5, -0.5, -0.3) };
      g.lookAt(this.reachTo, 1);
      this.reachT = (this.reachT || 0) + dt;
      if (this.reachT > 1.6 && !S.decoys.some(d => d.anim)) { this.reachTo = null; this.reachT = 0; g.armIK.R = null; }
    } else {
      const look = this.papaAct ? this.papa.headG.getWorldPosition(V()) : camera.position.clone().lerp(S.sp.clone().add(V(0, 1, 0)), 0.3);
      g.lookAt(look, 1);
    }
    this.updatePapa(dt);
  }
  hintAssemble() {
    const S = this.asm;
    if (S.complete || this.papaAct || S.fly.length) return null;
    const it = S.items.find(i => i.state === 'pile' || i.state === 'fallen');
    if (!it) return null;
    const p = it.meshes[(it.meshes.length / 2) | 0].getWorldPosition(V());
    return { p, kind: 'tap', glint: true };
  }
  completeSkeleton() {
    const S = this.asm, g = this.girl;
    S.complete = true;
    this.later(0.5, () => { sfx.fanfare(); g.face('laugh'); say.yay(); this.jump = 1; this.papa.face('laugh'); say.papaYay(); this.papaClap = 3; });
    this.later(0.9, () => this.camAssemble(2.5, true));
    this.later(4.2, () => this.fade(() => this.enterPlay(), 0.7));
  }

  // ---------------------------------------------------------------- papa
  startPapaTrip() {
    const S = this.asm, pa = this.papa;
    S.papaDone = true;
    pa.root.visible = true;
    const sp = S.sp;
    // walks in from the right carrying a crate, trips on the tarp corner
    this.papaCrate = this.papaCrate || PR.makeCrate();
    scene.add(this.papaCrate);
    this.papaAct = { phase: 'walk', t: 0, from: V(sp.x + 3.4, 0, sp.z + 1.55), to: V(sp.x - 0.4, 0, sp.z + 1.45) };
    pa.root.position.copy(this.papaAct.from); pa.root.rotation.y = -Math.PI / 2 - 0.15;
    pa.face('happy'); this.girl.face('happy');
  }
  updatePapa(dt) {
    const pa = this.papa, A = this.papaAct, S = this.asm;
    if (!pa.root.visible) return;
    if (!A && this.papaWalkBack) {
      const W = this.papaWalkBack; W.t += dt / 1.8;
      const k = clamp(W.t, 0, 1);
      pa.root.position.lerpVectors(W.from, W.to, easeInOut(k));
      pa.root.rotation.y = damp(pa.root.rotation.y, k < 1 ? Math.PI / 2 : -0.85, 5, dt);
      pa.armIK.L = pa.armIK.R = null;
      this.poseHuman(pa, dt, k < 1 ? 'walk' : 'stand', this.t * 5.2);
      if (k >= 1) this.papaWalkBack = null;
      return;
    }
    if (!A) {
      // idle: stand near the stand, clap when bones land
      this.poseHuman(pa, dt, 'stand');
      if (this.papaClap > 0) {
        this.papaClap -= dt;
        const c = V(); pa.J.chest.getWorldPosition(c);
        const fwd = V(Math.sin(pa.root.rotation.y), 0, Math.cos(pa.root.rotation.y));
        const ph = Math.abs(Math.sin(this.t * 9));
        const side = V(Math.cos(pa.root.rotation.y), 0, -Math.sin(pa.root.rotation.y));
        pa.armIK.L = { t: c.clone().addScaledVector(fwd, 0.3).addScaledVector(side, 0.04 + ph * 0.08).add(V(0, 0.05, 0)), w: 1, pole: V(0.5, -0.6, -0.2) };
        pa.armIK.R = { t: c.clone().addScaledVector(fwd, 0.3).addScaledVector(side, -0.04 - ph * 0.08).add(V(0, 0.05, 0)), w: 1, pole: V(-0.5, -0.6, -0.2) };
        if (ph < 0.12 && !this.clapped) { this.clapped = true; sfx.tap(); } if (ph > 0.5) this.clapped = false;
      } else { pa.armIK.L = pa.armIK.R = null; }
      pa.lookAt(this.girl.headG.getWorldPosition(V()), 1);
      return;
    }
    A.t += dt;
    const crate = this.papaCrate;
    if (A.phase === 'walk') {
      const k = clamp(A.t / 3.0, 0, 1);
      pa.root.position.lerpVectors(A.from, A.to, k);
      this.poseHuman(pa, dt, 'walk', A.t * 5.2);
      const c = V(); pa.J.chest.getWorldPosition(c);
      const fwd = V(Math.sin(pa.root.rotation.y), 0, Math.cos(pa.root.rotation.y));
      crate.position.copy(c).addScaledVector(fwd, 0.32).add(V(0, -0.25, 0)); crate.rotation.y = pa.root.rotation.y;
      const side = V(Math.cos(pa.root.rotation.y), 0, -Math.sin(pa.root.rotation.y));
      pa.armIK.L = { t: crate.position.clone().addScaledVector(side, 0.24).add(V(0, 0.12, 0)), w: 1, pole: V(0, -1, 0) };
      pa.armIK.R = { t: crate.position.clone().addScaledVector(side, -0.24).add(V(0, 0.12, 0)), w: 1, pole: V(0, -1, 0) };
      pa.lookAt(this.girl.headG.getWorldPosition(V()), 1);
      if (Math.sin(A.t * 5.2) * Math.sin((A.t - dt) * 5.2) < 0) sfx.step();
      this.girl.lookAt(pa.headG.getWorldPosition(V()), 1);
      if (k >= 1) { A.phase = 'trip'; A.t = 0; say.papaOops(); pa.face('wow'); this.girl.face('wow'); }
    } else if (A.phase === 'trip') {
      // stumble forward, crate flies, bones fall off the mount
      const k = clamp(A.t / 0.9, 0, 1);
      this.poseHuman(pa, dt, 'trip', k);
      pa.root.position.x -= dt * 0.6 * (1 - k);
      if (!A.knock && k > 0.35) {
        A.knock = true; sfx.tumble(); camShake(0.02);
        crate.userData.v = V(-1.2, 1.5, -0.4);
        // mounted items fall to the ground around the stand
        for (const it of S.items) {
          if (it.state !== 'mounted') continue;
          it.state = 'fallen';
          for (const m of it.meshes) {
            scene.attach(m);
            const R = this.R;
            const flatQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2 * (R() < 0.5 ? 1 : 0), R() * 6.28, 0));
            S.tumble.push({ m, v: V((R() - 0.5) * 1.4, 0.8 + R() * 1.2, 0.4 + R() * 1.4), w: V((R() - 0.5) * 9, 0, (R() - 0.5) * 9), rest: false, flatQ, h: 0.02 });
          }
        }
        // the tarp pile scatters too
        for (const it of S.items) if (it.state === 'pile') { it.group.position.x += (this.R() - 0.5) * 0.3; it.group.rotation.y += (this.R() - 0.5) * 1.2; }
        spawnDust(pa.root.position.clone(), 10, { size: 0.2, alpha: 0.28 });
        spawnGrains(pa.root.position.clone().add(V(0, 0.05, 0)), V(-1, 0, 0), 200, { speed: 1.4, spread: 0.4 });
      }
      if (k >= 1) { A.phase = 'sit'; A.t = 0; sfx.thud(); camShake(0.012); }
    } else if (A.phase === 'sit') {
      this.poseHuman(pa, dt, 'sit');
      pa.lookAt(this.girl.headG.getWorldPosition(V()), 1);
      if (A.t > 0.3 && !A.oops) { A.oops = true; pa.face('oops'); this.girl.face('wow'); }
      if (A.t > 1.4 && !A.laugh) { A.laugh = true; pa.face('laugh'); say.papaLaugh(); this.girl.face('laugh'); say.giggle(); }
      if (A.t > 3.0) { A.phase = 'up'; A.t = 0; pa.face('oops'); }
    } else if (A.phase === 'up') {
      this.poseHuman(pa, dt, 'stand');
      if (A.t > 0.8) {
        this.papaAct = null; pa.face('happy');
        this.papaWalkBack = { from: pa.root.position.clone(), to: V(S.sp.x + 1.85, 0, S.sp.z + 0.85), t: 0 };
        // regroup fallen bones into their items so they can be tapped again
        for (const it of S.items) if (it.state === 'fallen') {
          const c = V(); it.meshes.forEach(m => c.add(m.position)); c.divideScalar(it.meshes.length); c.y = 0;
          it.group.position.copy(c); it.group.rotation.set(0, 0, 0); scene.add(it.group); it.group.updateMatrixWorld(true);
          for (const m of it.meshes) it.group.attach(m);
        }
        S.tumble = [];
        this.girl.face('proud');
      }
    }
    // crate physics
    if (crate.userData.v) {
      const v = crate.userData.v; v.y -= 9.8 * dt; crate.position.addScaledVector(v, dt); crate.rotation.z += dt * 3;
      if (crate.position.y < 0) { crate.position.y = 0; crate.rotation.z = Math.round(crate.rotation.z / (Math.PI / 2)) * Math.PI / 2; crate.userData.v = null; sfx.thud(); spawnDust(crate.position, 4, { size: 0.15 }); }
    }
  }

  // ---------------------------------------------------------------- SCENE 3: play with the diorama dinosaurs
  enterPlay() {
    this.state = 'play';
    this.girl.armIK.L = this.girl.armIK.R = null; this.reachTo = null; this.handPress = null; this.lookOverride = null;
    const S = this.asm, g = this.girl;
    const sp = S.sp;
    g.root.position.set(sp.x - 0.45, 0, sp.z + 1.85); g.root.rotation.y = -0.35;
    g.face('happy');
    this.papa.root.position.set(sp.x + 1.85, 0, sp.z + 0.85); this.papa.root.rotation.y = -0.8;
    if (this.papaCrate) { this.papaCrate.position.set(sp.x + 2.0, 0, sp.z + 0.4); this.papaCrate.rotation.set(0, 0.4, 0); }
    // diorama next to the stand; dinos come alive
    this.diorama.position.set(sp.x - 1.25, 0, sp.z + 0.95); this.diorama.rotation.y = 0.2;
    if (!this.minis.length) {
      const R = this.R;
      const kinds = ['long', 'duck', 'long'];
      const tints = [new THREE.Color().setRGB(0.36, 0.45, 0.26, THREE.SRGBColorSpace), new THREE.Color().setRGB(0.55, 0.45, 0.3, THREE.SRGBColorSpace), new THREE.Color().setRGB(0.42, 0.5, 0.42, THREE.SRGBColorSpace)];
      kinds.forEach((k, i) => { const d = new MiniDino(k, R, tints[i]); d.root.scale.setScalar(1.45); d.L *= 1.45; scene.add(d.root); this.minis.push(d); });
    }
    this.minis.forEach((d, i) => {
      const p = this.diorama.position.clone().add(V(-0.28 + i * 0.28, 0.07, (i % 2 ? 0.08 : -0.08)));
      d.root.position.copy(p); d.yaw = 0.3 + i * 0.3; d.mode = 'toy'; d.wake = 1.2 + i * 0.7; d.target = null; d.stepAcc = 0;
    });
    this.flag.position.set(sp.x + 2.3, 0, sp.z + 2.0);
    this.flag.visible = true;
    setShadowFocus(V(sp.x - 0.2, 0, sp.z + 0.9), 3.6);
    const portrait = view.aspect < 0.9;
    this.reframe = () => { const portrait = view.aspect < 0.9; setShot(portrait ? { target: V(sp.x - 0.75, 0.55, sp.z + 1.0), yaw: -0.65, halfW: 0.95, halfH: 1.2, eye: 1.4, minDist: 2.3 } : { target: V(sp.x - 0.2, 0.62, sp.z + 1.05), yaw: 0.0, halfW: 1.75, halfH: 0.9, eye: 1.3, minDist: 2.3 }, 0); }; this.reframe();
    this.handlers = {
      down: inp => this.playDown(inp),
      move: inp => this.playMove(inp),
      up: () => { this.leading = false; },
    };
  }
  playDown(inp) {
    const ray = rayFrom(inp.ndc);
    const fh = this.hitObjects(ray, [this.flag]);
    if (fh) { sfx.pick(); this.girl.face('laugh'); say.yay(); this.flag.visible = false; this.fade(() => this.nextRound(), 0.8); return; }
    const dh = this.hitObjects(ray, this.minis.map(d => d.mesh));
    if (dh) {
      const d = this.minis.find(m => m.mesh === dh.object);
      d.happy = 1.6; d.target = null; sfx.chirp(); this.girl.face('laugh'); say.giggle(); this.later(1.2, () => this.girl.face('happy'));
      return;
    }
    const h = this.rayHeightfield(this.exField, ray);
    if (h) { this.leading = true; this.leadP = h; this.minis.forEach((d, i) => { if (d.mode !== 'toy') d.target = h.clone().add(V(Math.cos(i * 2.1) * 0.12, 0, Math.sin(i * 2.1) * 0.12)); }); this.girl.face('happy'); }
  }
  playMove(inp) {
    if (!this.leading) return;
    const h = this.rayHeightfield(this.exField, rayFrom(inp.ndc));
    if (h) { this.leadP = h; this.minis.forEach((d, i) => { if (d.mode !== 'toy') d.target = h.clone().add(V(Math.cos(i * 2.1) * 0.12, 0, Math.sin(i * 2.1) * 0.12)); }); }
  }
  updatePlay(dt) {
    const g = this.girl;
    this.poseKneel(dt, 0.15);
    g.armIK.R = this.leading && this.leadP ? { t: this.leadP.clone().add(V(0, 0.35, 0)).lerp(g.J.chest.getWorldPosition(V()), 0.45), w: 1, pole: V(-0.5, -0.5, -0.3) } : null;
    g.armIK.L = null;
    const focusD = this.minis.find(d => d.happy > 0) || this.minis[0];
    g.lookAt(this.leadP && this.leading ? this.leadP : focusD.root.position.clone().add(V(0, 0.1, 0)), 1);
    this.poseHuman(this.papa, dt, 'stand');
    this.papa.armIK.L = this.papa.armIK.R = null;
    this.papa.lookAt(focusD.root.position, 1);
    for (const d of this.minis) this.updateMini(d, dt);
    PR.waveFlag(this.flag, this.t);
    this.exField.flush();
  }
  updateMini(d, dt) {
    const R = this.R;
    if (d.mode === 'toy') {
      d.wake -= dt;
      d.root.rotation.y = d.yaw;
      if (d.wake < 0) {
        d.mode = 'hop'; d.hopT = 0; d.hopFrom = d.root.position.clone();
        d.hopTo = d.root.position.clone().add(V(0.2 + R() * 0.3, 0, 0.5 + R() * 0.2)); d.hopTo.z = Math.min(d.hopTo.z, this.exField.z0 + this.exField.d - 0.15);
        sfx.chirp();
      }
      return;
    }
    if (d.mode === 'hop') {
      d.hopT += dt / 0.7; const k = clamp(d.hopT, 0, 1);
      d.root.position.lerpVectors(d.hopFrom, d.hopTo, k); d.root.position.y += Math.sin(k * Math.PI) * 0.15;
      if (k >= 1) { d.mode = 'walk'; d.root.position.y = this.groundAt(d.root.position.x, d.root.position.z); this.stampDino(d, 0); this.stampDino(d, 1); }
      return;
    }
    // wander or follow
    if (!d.target || d.root.position.distanceTo(d.target) < 0.06) {
      d.idleT = (d.idleT || 0) + dt;
      if (d.idleT > 2 + R() * 3 && !this.leading) {
        d.idleT = 0;
        const sp = this.asm.sp;
        const ang = R() * 6.28;
        d.target = V(clamp(d.root.position.x + Math.cos(ang) * 0.6, this.exField.x0 + 0.2, this.exField.x0 + this.exField.w - 0.2), 0, clamp(d.root.position.z + Math.sin(ang) * 0.4, this.exField.z0 + 0.15, this.exField.z0 + this.exField.d - 0.15));
        if (R() < 0.3) d.target = V(sp.x + (R() - 0.5) * 1.5, 0, sp.z + 0.75); // go look at the big skeleton
      }
      if (d.target && d.root.position.distanceTo(d.target) < 0.06) d.target = null;
    }
    let speed = 0;
    if (d.target && !(d.happy > 0)) {
      const to = d.target.clone().sub(d.root.position); to.y = 0;
      const want = Math.atan2(to.x, to.z) - Math.PI / 2;
      let dy = want - d.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      d.yaw += clamp(dy, -2.5 * dt, 2.5 * dt);
      speed = Math.min(0.16, to.length() * 0.8) * (Math.abs(dy) < 1.2 ? 1 : 0.3);
    }
    d.speed = damp(d.speed || 0, speed, 5, dt);
    const fwd = V(Math.cos(d.yaw), 0, -Math.sin(d.yaw));
    d.root.position.addScaledVector(fwd, d.speed * dt);
    d.root.position.x = clamp(d.root.position.x, this.exField.x0 + 0.1, this.exField.x0 + this.exField.w - 0.1);
    d.root.position.z = clamp(d.root.position.z, this.exField.z0 + 0.1, this.exField.z0 + this.exField.d - 0.1);
    d.root.position.y = damp(d.root.position.y, this.groundAt(d.root.position.x, d.root.position.z), 10, dt);
    d.root.rotation.y = d.yaw;
    // legs: gait phase
    d.walkPhase += d.speed * dt * 38;
    for (let i = 0; i < 4; i++) {
      const L = d.legs[i];
      const ph = d.walkPhase + L.ph * Math.PI * 2;
      L.piv.rotation.z = Math.sin(ph) * 0.45 * Math.min(1, d.speed * 10);
      const planted = Math.cos(ph) < 0;
      if (planted && !d.prevPlant[i] && d.speed > 0.01) this.stampDino(d, i);
      d.prevPlant[i] = planted;
    }
    d.body.position.y = Math.abs(Math.sin(d.walkPhase)) * 0.006;
    // happy bob: look up at the camera, wag tail
    if (d.happy > 0) { d.happy -= dt; d.body.rotation.z = Math.sin(this.t * 12) * 0.06; d.body.rotation.x = Math.sin(this.t * 7) * 0.05; }
    else { d.body.rotation.z = damp(d.body.rotation.z, Math.sin(this.t * 1.3 + d.walkPhase) * 0.02, 4, dt); d.body.rotation.x = damp(d.body.rotation.x, 0, 4, dt); }
    if (Math.random() < dt * 0.06) sfx.coo();
  }
  stampDino(d, i) {
    const L = d.legs[i];
    const p = V(); L.piv.getWorldPosition(p);
    if (!this.exField.inside(p.x, p.z)) return;
    const size = d.L * 0.14;
    this.exField.stamp(p.x, p.z, -d.yaw, footShape, 0.008, size);
    if (Math.random() < 0.5) spawnGrains(p, V(0, 1, 0), 6, { speed: 0.25, size: 0.0015 });
  }
  hintPlay() {
    if (this.minis.every(d => d.mode === 'walk')) {
      if (!this.playTapped) { const d = this.minis[0]; return { p: d.root.position.clone().add(V(0, 0.08, 0)), kind: 'tap', glint: false }; }
      return { p: this.flag.position.clone().add(V(0.1, 0.78, 0)), kind: 'tap', glint: true };
    }
    return null;
  }
  nextRound() {
    this.round++;
    const P = this.pit;
    // retire collected item groups (they live on the stand now)
    this.minis.forEach(d => { d.mode = 'toy'; });
    this.newPit(this.round);
    this.enterDig();
  }

  // ---------------------------------------------------------------- poses
  poseStand(dt) { this.poseHuman(this.girl, dt, 'stand'); }
  poseKneel(dt, leanExtra = 0) { this.poseHuman(this.girl, dt, 'kneel', leanExtra); }
  poseHuman(h, dt, pose, arg = 0) {
    const J = h.J, P = h.P, t = this.t;
    const set = (j, x, y, z, k = 14) => { const r = J[j].rotation; r.x = damp(r.x, x, k, dt); r.y = damp(r.y, y, k, dt); r.z = damp(r.z, z, k, dt); };
    const breathe = Math.sin(t * 1.9 + (h === this.papa ? 1 : 0)) * 0.015;
    let py = h.hipH;
    if (pose === 'stand') {
      set('pelvis', 0, Math.sin(t * 0.5) * 0.04, Math.sin(t * 0.7) * 0.015);
      set('spine', 0.02 + breathe, 0, 0); set('chest', breathe, 0, 0);
      set('neck', 0, 0, 0); set('head', 0, 0, (this.girlTilt && h === this.girl ? 0.28 : 0));
      for (const s of ['L', 'R']) { const sg = s === 'L' ? 1 : -1; set('hip' + s, 0, 0, 0.02 * sg); set('kn' + s, 0.02, 0, 0); set('an' + s, 0, 0, 0); }
      if (!h.armIK.L) { set('shL', 0.05, 0, 0.09); set('elL', 0.15, 0, 0); set('wrL', 0, 0, 0); }
      if (!h.armIK.R) { set('shR', 0.05, 0, -0.09); set('elR', 0.15, 0, 0); set('wrR', 0, 0, 0); }
    } else if (pose === 'kneel') {
      // kneeling, sitting back on the heels and leaning in to work
      const lean = 0.16 + arg + (h === this.girl && this.dig && this.dig.brushing ? 0.08 : 0) + (this.dig && this.dig.hamAnim >= 0 ? 0.06 : 0);
      const hipA = -1.05;
      py = P.legR * 0.85 + P.thigh * Math.cos(-hipA - 0.08) + 0.012;
      set('pelvis', 0.08 + lean * 0.3, 0, 0); set('spine', lean * 0.55 + breathe, 0, 0); set('chest', lean * 0.35, 0, 0); set('neck', -0.42, 0, 0);
      for (const s of ['L', 'R']) { const sg = s === 'L' ? 1 : -1; set('hip' + s, hipA - (0.08 + lean * 0.3), 0.05 * sg, 0.1 * sg); set('kn' + s, 2.45, 0, 0); set('an' + s, 0.95, 0, 0); }
    } else if (pose === 'walk') {
      const ph = arg;
      set('pelvis', 0, Math.sin(ph) * 0.08, 0, 20); set('spine', 0.1, 0, 0); set('chest', 0, -Math.sin(ph) * 0.06, 0);
      set('neck', 0, 0, 0); set('head', 0, 0, 0);
      for (const s of ['L', 'R']) { const sg = s === 'L' ? 1 : -1; const p = ph + (s === 'L' ? 0 : Math.PI); set('hip' + s, -Math.sin(p) * 0.42, 0, 0.02 * sg, 30); set('kn' + s, Math.max(0, Math.cos(p)) * 0.8 + 0.05, 0, 0, 30); set('an' + s, -0.1 + Math.max(0, -Math.sin(p)) * 0.2, 0, 0, 30); }
      py = h.hipH - 0.02 - Math.abs(Math.cos(ph)) * 0.02;
    } else if (pose === 'trip') {
      const k = arg;
      set('pelvis', 0.4 * k, 0, 0.1 * k, 10); set('spine', 0.5 * k, 0, 0, 10); set('chest', 0.2 * k, 0, 0, 10); set('head', -0.4 * k, 0, 0, 10);
      set('hipL', -1.2 * k, 0, 0.1, 10); set('knL', 0.6 * k, 0, 0, 10); set('hipR', 0.4 * k, 0, -0.1, 10); set('knR', 1.0 * k, 0, 0, 10);
      h.armIK.L = h.armIK.R = null;
      set('shL', -2.2 * k, 0, 0.8 * k, 8); set('elL', 0.4, 0, 0, 8); set('shR', -2.0 * k, 0, -0.9 * k, 8); set('elR', 0.4, 0, 0, 8);
      py = h.hipH * (1 - 0.55 * k);
    } else if (pose === 'sit') {
      py = P.legR * 1.1;
      set('pelvis', -0.2, 0, 0, 8); set('spine', -0.05 + breathe, 0, 0, 8); set('chest', 0.05, 0, 0, 8); set('head', 0.1, 0, 0.1, 8);
      for (const s of ['L', 'R']) { const sg = s === 'L' ? 1 : -1; set('hip' + s, -1.35, 0.1 * sg, 0.18 * sg, 8); set('kn' + s, 0.55, 0, 0, 8); set('an' + s, -0.2, 0, 0, 8); }
      set('shL', 0.7, 0, 0.35, 8); set('elL', 0.2, 0, 0, 8); set('shR', 0.7, 0, -0.35, 8); set('elR', 0.2, 0, 0, 8);
    }
    // jump (girl)
    if (h === this.girl && this.jump > 0) {
      this.jump = Math.max(0, this.jump - dt * 1.5);
      const k = 1 - this.jump;
      const hop = Math.max(0, Math.sin(k * Math.PI * 2)) * 0.14;
      if (pose === 'stand') { py += hop; if (!h.armIK.L) set('shL', -0.3, 0, 2.4 * Math.sin(k * Math.PI), 20); if (!h.armIK.R) set('shR', -0.3, 0, -2.4 * Math.sin(k * Math.PI), 20); }
      else py += hop * 0.4;
    }
    J.pelvis.position.y = damp(J.pelvis.position.y, py, pose === 'walk' ? 30 : 9, dt);
    // IK arms (blend weight)
    h.root.updateMatrixWorld(true);
    for (const sd of ['L', 'R']) {
      const ik = h.armIK[sd];
      if (!ik) continue;
      const pole = ik.pole ? ik.pole.clone().applyQuaternion(h.root.quaternion) : V(sd === 'L' ? 0.5 : -0.5, -0.6, -0.4).applyQuaternion(h.root.quaternion);
      const sh = J['sh' + sd], el = J['el' + sd];
      const q1 = sh.quaternion.clone(), q2 = el.quaternion.clone();
      h.solveArm(sd, ik.t, pole, 0.2);
      const w = ik.w ?? 1;
      if (w < 1) { sh.quaternion.slerpQuaternions(q1, sh.quaternion.clone(), w); el.quaternion.slerpQuaternions(q2, el.quaternion.clone(), w); }
      J['sh' + sd].rotation.setFromQuaternion(J['sh' + sd].quaternion);
      J['el' + sd].rotation.setFromQuaternion(J['el' + sd].quaternion);
    }
    // head turn toward look target
    const hp = V(); J.head.getWorldPosition(hp);
    const d = h.look.clone().sub(hp);
    const inv = new THREE.Quaternion(); J.neck.getWorldQuaternion(inv); inv.invert();
    d.applyQuaternion(inv);
    const yaw = clamp(Math.atan2(d.x, d.z), -0.8, 0.8) * 0.6, pitch = clamp(-Math.atan2(d.y, Math.hypot(d.x, d.z)), -0.5, 0.45) * 0.45;
    J.head.rotation.y = damp(J.head.rotation.y, yaw, 6, dt);
    J.head.rotation.x = damp(J.head.rotation.x, J.head.rotation.x * 0 + pitch, 6, dt);
    h.update(dt);
  }

  // ---------------------------------------------------------------- misc
  later(s, fn) { (this.timers = this.timers || []).push({ t: s, fn }); }
  girlReact() { this.girl.face('happy'); say.giggle(); this.later(0.8, () => this.girl.face('neutral')); }
  update(dt) {
    this.t += dt;
    if (this.timers) { for (const T of this.timers) { T.t -= dt; if (T.t <= 0 && !T.done) { T.done = true; T.fn(); } } this.timers = this.timers.filter(T => !T.done); }
    if (this.fadeAnim) {
      const F = this.fadeAnim; F.t += dt / F.dur;
      if (F.t >= 1 && !F.done) { F.done = true; F.cb(); }
      post.fade = F.t < 1 ? smooth(F.t) * 0.9 : Math.max(0, 0.9 * (1 - (F.t - 1) * 1.5));
      if (F.t > 1.7) { this.fadeAnim = null; post.fade = 0; }
    }
    if (this.state === 'dress') this.updateDress(dt);
    else if (this.state === 'dig') this.updateDig(dt);
    else if (this.state === 'assemble') this.updateAssemble(dt);
    else if (this.state === 'play') this.updatePlay(dt);
    if (this.state !== 'assemble' && this.state !== 'play') this.papa.root.visible = this.state === 'never';
    updateFx(dt);
    // hints & glints
    const hint = this.state === 'dress' ? this.hintDress() : this.state === 'dig' ? this.hintDig() : this.state === 'assemble' ? this.hintAssemble() : this.hintPlay();
    this.glints.forEach((gl, i) => gl.set(null, false));
    if (hint && hint.glint) this.glints[0].set(hint.p.clone().add(V(0, 0.04, 0)), true, 0.1);
    // all revealed free bones glint softly
    if (this.state === 'dig') {
      let gi = 1;
      for (const k of ITEM_KEYS) { const it = this.pit.fossil.items[k]; if (gi < this.glints.length && it.state === 'buried' && it.revealed >= 0.5 && !(it.rock && !it.rock.broken)) { const p = V(); it.meshes[0].getWorldPosition(p); this.glints[gi++].set(p.add(V(0, 0.03, 0)), true, 0.07); } }
    }
    if (this.state === 'assemble') {
      let gi = 1;
      for (const it of this.asm.items) if (gi < this.glints.length && (it.state === 'pile' || it.state === 'fallen')) { const p = V(); it.meshes[(it.meshes.length / 2) | 0].getWorldPosition(p); this.glints[gi++].set(p.add(V(0, 0.04, 0)), true, 0.06); }
    }
    for (const gl of this.glints) gl.update(dt, this.t);
    this.drawHand(hint, dt);
  }
  drawHand(hint, dt) {
    const c = this.overlay, x = this.octx;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (c.width !== Math.round(view.w * dpr)) { c.width = Math.round(view.w * dpr); c.height = Math.round(view.h * dpr); c.style.width = view.w + 'px'; c.style.height = view.h + 'px'; }
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height);
    const idle = performance.now() / 1000 - input.lastTouch;
    this.handA = damp(this.handA || 0, hint && idle > 4.5 && !input.down && !this.fadeAnim ? 1 : 0, 4, dt);
    if (this.handA < 0.02 || !hint) return;
    const p = hint.p.clone().project(camera);
    if (p.z > 1) return;
    let sx = (p.x * 0.5 + 0.5) * view.w, sy = (-p.y * 0.5 + 0.5) * view.h;
    const t = this.t;
    let press = 0;
    if (hint.kind === 'tap') { const k = (t * 1.2) % 1; press = k < 0.2 ? Math.sin(k / 0.2 * Math.PI) : 0; }
    else { const k = (t * 0.6) % 1; sx += Math.sin(k * Math.PI * 2) * 40; sy += Math.cos(k * Math.PI * 4) * 6; press = 0.6; }
    const s = Math.min(view.w, view.h) / 9;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.globalAlpha = this.handA * 0.92;
    // ripple at the fingertip
    if (press > 0.1) { x.strokeStyle = `rgba(255,255,255,${0.6 * press})`; x.lineWidth = 3; x.beginPath(); x.arc(sx, sy, s * 0.25 * (1.5 - press * 0.5), 0, 7); x.stroke(); }
    x.translate(sx + s * 0.05, sy + s * 0.08 - press * s * 0.08);
    x.rotate(-0.35);
    x.scale(s / 100, s / 100);
    x.shadowColor = 'rgba(0,0,0,0.35)'; x.shadowBlur = 12; x.shadowOffsetY = 6;
    x.fillStyle = '#fbfbf8'; x.strokeStyle = 'rgba(120,110,100,0.55)'; x.lineWidth = 3;
    const hand = new Path2D('M0 0 C-6 0 -10 5 -10 12 L-10 62 C-20 54 -34 52 -38 60 C-42 68 -28 78 -18 92 C-6 110 6 124 30 124 L52 124 C70 124 82 110 82 92 L82 58 C82 50 76 46 70 46 C66 46 62 48 60 52 C60 44 54 40 48 40 C43 40 39 43 37 47 C36 40 31 36 25 36 C19 36 14 40 12 44 L12 12 C12 5 7 0 0 0 Z');
    x.fill(hand); x.shadowColor = 'transparent'; x.stroke(hand);
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1;
  }
}
