// Props: spoon, bowl, seed pile, cutters (+plugs), mallet, tape roll, candle dish, hats.
import * as THREE from 'three';
import { pbr, texSet } from './tex.js';
import { outline, SHAPE } from './shapes.js';
import { seedGeometry, seedMaterial } from './pumpkin.js';

const V3 = THREE.Vector3;

export function steel(rough = 0.28) {
  const ht = texSet('hair');
  return new THREE.MeshPhysicalMaterial({ color: 0xd7d9dc, metalness: 1, roughness: rough, roughnessMap: ht.ormMap, anisotropy: 0.4, clearcoat: 0 });
}

export function makeSpoon() {
  const g = new THREE.Group();
  const m = steel(0.22);
  // bowl: squashed half sphere, open side up (+y), long axis along -z (tip)
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), m);
  bowl.scale.set(0.021, 0.011, 0.032); bowl.material.side = THREE.DoubleSide; bowl.rotation.x = Math.PI;
  bowl.position.z = -0.03;
  const pts = [new V3(0, 0.004, 0.0), new V3(0, 0.012, 0.05), new V3(0, 0.02, 0.1), new V3(0, 0.026, 0.16)];
  const handle = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.0045, 8), m);
  handle.scale.set(1.6, 0.45, 1);
  g.add(bowl, handle);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  g.userData.tip = new V3(0, 0, -0.05);
  g.userData.grip = new V3(0, 0.024, 0.15);
  return g;
}

export function makeBowl() {
  const prof = [];
  const R = 0.11, H = 0.065;
  for (let i = 0; i <= 16; i++) { const t = i / 16; prof.push(new THREE.Vector2(0.045 + (R - 0.045) * Math.sin(t * Math.PI / 2), H * (1 - Math.cos(t * Math.PI / 2)) )); }
  prof.push(new THREE.Vector2(R + 0.003, H + 0.002));
  for (let i = 16; i >= 0; i--) { const t = i / 16; prof.push(new THREE.Vector2(0.04 + (R - 0.05) * Math.sin(t * Math.PI / 2), 0.006 + (H - 0.004) * (1 - Math.cos(t * Math.PI / 2)))); }
  prof.push(new THREE.Vector2(0.0001, 0.006));
  const geo = new THREE.LatheGeometry(prof, 56);
  const pl = texSet('plaster');
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xe6ddd0, roughness: 0.25, clearcoat: 0.9, clearcoatRoughness: 0.08, normalMap: pl.normalMap, normalScale: new THREE.Vector2(0.15, 0.15) });
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.04, 0.008, 40), new THREE.MeshStandardMaterial({ color: 0xa89a86, roughness: 0.9 }));
  foot.position.y = 0.004;
  const b = new THREE.Mesh(geo, mat); b.castShadow = true; b.receiveShadow = true;
  const g = new THREE.Group(); g.add(b, foot);
  return g;
}

// heap of scooped pulp + seeds that grows in the bowl
export class SeedPile {
  constructor() {
    this.group = new THREE.Group();
    const pu = texSet('pulp');
    const geo = new THREE.IcosahedronGeometry(1, 4);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const n = 1 + 0.18 * Math.sin(x * 9 + z * 5) * Math.cos(y * 7) + 0.1 * Math.sin(x * 23 + y * 17); p.setXYZ(i, x * n, Math.max(-0.2, y) * n, z * n); }
    geo.computeVertexNormals();
    this.mound = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ map: pu.map, normalMap: pu.normalMap, roughnessMap: pu.ormMap, roughness: 0.9, clearcoat: 0.8, clearcoatRoughness: 0.2, normalScale: new THREE.Vector2(1.4, 1.4) }));
    this.mound.receiveShadow = true; this.mound.castShadow = true;
    this.mound.scale.setScalar(0.0001);
    this.group.add(this.mound);
    this.max = 260;
    this.seeds = new THREE.InstancedMesh(seedGeometry(), seedMaterial(), this.max);
    this.seeds.count = 0; this.seeds.castShadow = true; this.seeds.receiveShadow = true;
    this.group.add(this.seeds);
    this.amount = 0;
  }
  add(amount, nSeeds) {
    this.amount += amount;
    const r = Math.min(0.085, 0.02 + Math.sqrt(this.amount) * 0.11);
    this.mound.scale.set(r, r * 0.55, r);
    this.mound.position.y = 0.012 + r * 0.12;
    const M = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new V3(1, 1, 1);
    for (let k = 0; k < nSeeds && this.seeds.count < this.max; k++) {
      const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * r * 0.95;
      const h = Math.sqrt(Math.max(0, 1 - (rr / r) ** 2)) * r * 0.55 + this.mound.position.y + 0.002;
      q.setFromEuler(new THREE.Euler((Math.random() - 0.5) * 0.8, Math.random() * 6.28, (Math.random() - 0.5) * 0.8));
      M.compose(new V3(Math.cos(a) * rr, h, Math.sin(a) * rr), q, s);
      this.seeds.setMatrixAt(this.seeds.count++, M);
    }
    this.seeds.instanceMatrix.needsUpdate = true;
  }
}

const PLASTIC = [0x5f8f8a, 0xc59a3a, 0xc0675a, 0x7d8f5a, 0x8a6a9a];

export function makeCutter(type, size, colorIdx) {
  const pts = outline(type, size);
  const g = new THREE.Group();
  // stainless blade: a thin wall along the outline
  const outer = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const inPts = outline(type, Math.max(0.004, size - 0.0012)).map(([x, y]) => new THREE.Vector2(x, y));
  // use offset outline as the hole (approx thickness 1.2mm)
  outer.holes.push(new THREE.Path(inPts.reverse()));
  const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(outer, { depth: 0.026, bevelEnabled: false, curveSegments: 4 }), steel(0.3));
  blade.castShadow = true; blade.receiveShadow = true;
  g.add(blade);
  // plastic push-cap on top (rounded)
  const capShape = new THREE.Shape(outline(type, size + 0.004).map(([x, y]) => new THREE.Vector2(x, y)));
  const cap = new THREE.Mesh(new THREE.ExtrudeGeometry(capShape, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.003, bevelSegments: 3, curveSegments: 4 }),
    new THREE.MeshPhysicalMaterial({ color: PLASTIC[colorIdx % PLASTIC.length], roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.3, sheen: 0.2 }));
  cap.position.z = 0.026; cap.castShadow = true; cap.receiveShadow = true;
  g.add(cap);
  // local: z = pressing axis (blade edge at z=0, cap at +z)
  g.userData = { type, size };
  return g;
}

export function makePlug(type, size, depth) {
  const pts = outline(type, size * 0.98);
  const sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const geo = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: 0.0015, bevelSize: 0.0012, bevelSegments: 2, curveSegments: 4 });
  geo.translate(0, 0, -depth);
  const pt = texSet('pumpkin'), fl = texSet('flesh');
  const skin = new THREE.MeshPhysicalMaterial({ color: 0xd8641a, map: pt.map, roughnessMap: pt.ormMap, roughness: 1, normalMap: pt.normalMap, clearcoat: 0.3, clearcoatRoughness: 0.4 });
  skin.color.multiplyScalar(1.6);
  const flesh = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: fl.map, normalMap: fl.normalMap, roughness: 0.55, clearcoat: 0.4 });
  const m = new THREE.Mesh(geo, [skin, flesh]);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function makeMallet() {
  const g = new THREE.Group();
  const wood = pbr('oak', { repeat: [0.3, 0.3], color: 0xd8b48a, roughness: 1, normal: 0.6 });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.2, 16), wood); handle.position.y = 0.1;
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.085, 24), wood); head.rotation.z = Math.PI / 2; head.position.y = 0.205;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.002, 6, 24), new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.6 }));
  ring.rotation.y = Math.PI / 2; ring.position.set(0.03, 0.205, 0);
  const ring2 = ring.clone(); ring2.position.x = -0.03;
  g.add(handle, head, ring, ring2);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  g.userData.grip = new V3(0, 0.05, 0); g.userData.face = new V3(0, 0.205, 0);
  return g;
}

export function makeTapeRoll() {
  const g = new THREE.Group();
  const kr = texSet('kraft');
  const tape = new THREE.MeshPhysicalMaterial({ color: 0xeadfc4, roughness: 0.7, normalMap: kr.normalMap, normalScale: new THREE.Vector2(0.4, 0.4), sheen: 0.3 });
  const prof = [new THREE.Vector2(0.024, -0.012), new THREE.Vector2(0.045, -0.012), new THREE.Vector2(0.045, 0.012), new THREE.Vector2(0.024, 0.012), new THREE.Vector2(0.024, -0.012)];
  const roll = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), tape);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.025, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0x9a7a52, roughness: 0.9, side: THREE.DoubleSide }));
  g.add(roll, core);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  g.userData.mat = tape;
  return g;
}
export function tapeMaterial() {
  const kr = texSet('kraft');
  return new THREE.MeshPhysicalMaterial({ color: 0xf0e6cc, roughness: 0.72, normalMap: kr.normalMap, normalScale: new THREE.Vector2(0.5, 0.5), sheen: 0.4, transparent: true, opacity: 0.94, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3 });
}

export function makeDish() {
  const prof = [new THREE.Vector2(0.0001, 0), new THREE.Vector2(0.05, 0), new THREE.Vector2(0.058, 0.008), new THREE.Vector2(0.06, 0.012), new THREE.Vector2(0.054, 0.011), new THREE.Vector2(0.046, 0.004), new THREE.Vector2(0.0001, 0.004)];
  const d = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), new THREE.MeshPhysicalMaterial({ color: 0x8c4a2e, roughness: 0.3, clearcoat: 0.8 }));
  d.castShadow = true; d.receiveShadow = true;
  return d;
}

// ---- hats (sized to a head with radii a,b,c)
export function makeHat(kind, cfg) {
  const g = new THREE.Group();
  const a = cfg.a, b = cfg.b, c = cfg.c;
  const knit = (col, rep = [4, 3]) => {
    const st = texSet('knit');
    const cl = (t, k) => { const x = t.clone(); x.repeat.set(rep[0], rep[1]); st.all[k].push(x); return x; };
    const orm = cl(st.ormMap, 'ormMap');
    return new THREE.MeshPhysicalMaterial({ color: col, map: cl(st.map, 'map'), normalMap: cl(st.normalMap, 'normalMap'), roughnessMap: orm, aoMap: orm, roughness: 1, normalScale: new THREE.Vector2(1.6, 1.6), sheen: 0.8, sheenRoughness: 0.6, sheenColor: new THREE.Color(col).lerp(new THREE.Color(1, 1, 1), 0.3) });
  };
  if (kind === 0) {
    // knitted pumpkin beanie with stem and leaf
    const m = knit(0xc8621e);
    const dome = new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const p = dome.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const ang = Math.atan2(z, x); const rib = 1 + 0.035 * Math.abs(Math.sin(ang * 4)); p.setXYZ(i, x * a * 1.16 * rib, y * b * 1.0 + 0.0, z * c * 1.14 * rib); }
    dome.computeVertexNormals();
    const d = new THREE.Mesh(dome, m); g.add(d);
    const brim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.11, 12, 48), knit(0xb45518, [12, 1]));
    brim.scale.set(a * 1.1, c * 1.1, a * 1.2); brim.rotation.x = Math.PI / 2; brim.position.y = -b * 0.17; g.add(brim);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.011, 0.03, 12), knit(0x5a4426, [1, 1])); stem.position.y = b * 1.02; stem.rotation.z = 0.25; g.add(stem);
    const leafS = new THREE.Shape(); leafS.moveTo(0, 0); leafS.quadraticCurveTo(0.03, 0.02, 0.055, 0); leafS.quadraticCurveTo(0.03, -0.02, 0, 0);
    const leaf = new THREE.Mesh(new THREE.ExtrudeGeometry(leafS, { depth: 0.004, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 2 }), knit(0x5f7a34, [30, 30]));
    leaf.position.set(0.005, b * 0.98, 0); leaf.rotation.set(-0.3, 0.6, 0.3); g.add(leaf);
    g.userData.offset = new V3(0, b * 0.44, -0.008);
  } else if (kind === 1) {
    // cat-ear headband
    const vel = new THREE.MeshPhysicalMaterial({ color: 0x1e1a1c, roughness: 0.8, sheen: 1, sheenRoughness: 0.4, sheenColor: new THREE.Color(0x6a6070) });
    const band = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 10, 48, Math.PI), vel);
    band.scale.set(a * 1.08, b * 1.05, 0.12); band.position.set(0, 0.0, 0.01); g.add(band);
    const inner = new THREE.MeshPhysicalMaterial({ color: 0xc98a86, roughness: 0.7, sheen: 0.8, sheenColor: new THREE.Color(0xffd0c8) });
    for (const s of [-1, 1]) {
      const ear = new THREE.Group();
      const shp = new THREE.Shape(); shp.moveTo(-0.028, 0); shp.quadraticCurveTo(-0.02, 0.03, 0.0, 0.045); shp.quadraticCurveTo(0.02, 0.03, 0.028, 0); shp.lineTo(-0.028, 0);
      const e1 = new THREE.Mesh(new THREE.ExtrudeGeometry(shp, { depth: 0.008, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 3 }), vel);
      const shp2 = new THREE.Shape(); shp2.moveTo(-0.017, 0.004); shp2.quadraticCurveTo(-0.012, 0.024, 0, 0.034); shp2.quadraticCurveTo(0.012, 0.024, 0.017, 0.004); shp2.lineTo(-0.017, 0.004);
      const e2 = new THREE.Mesh(new THREE.ShapeGeometry(shp2), inner); e2.position.z = 0.0115;
      ear.add(e1, e2);
      ear.position.set(s * a * 0.62, b * 0.78, 0.0); ear.rotation.set(-0.15, 0, -s * 0.45);
      g.add(ear);
    }
    g.userData.offset = new V3(0, 0, 0);
  } else {
    // felt witch hat with a ribbon
    const st = texSet('linen');
    const felt = new THREE.MeshPhysicalMaterial({ color: 0x2c2234, normalMap: st.normalMap, roughnessMap: st.ormMap, roughness: 1, normalScale: new THREE.Vector2(0.6, 0.6), sheen: 1, sheenRoughness: 0.5, sheenColor: new THREE.Color(0x6a5a80), side: THREE.DoubleSide });
    const pts = [];
    for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push(new V3(Math.sin(t * 1.5) * 0.03 * t * t, t * 0.2, -Math.sin(t * 2.2) * 0.02 * t)); }
    const cone = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 1, 32, false), felt);
    const cp = cone.geometry.attributes.position, uv = cone.geometry.attributes.uv;
    const curve = new THREE.CatmullRomCurve3(pts); const ctr = new V3();
    for (let i = 0; i < cp.count; i++) { const u = uv.getX(i); curve.getPointAt(u, ctr); const r = (1 - u) * a * 1.12 + 0.002; const dx = cp.getX(i) - ctr.x, dy = cp.getY(i) - ctr.y, dz = cp.getZ(i) - ctr.z; const l = Math.hypot(dx, dy, dz) || 1; cp.setXYZ(i, ctr.x + dx / l * r, ctr.y + dy / l * r * 0.2, ctr.z + dz / l * r * (c / a)); }
    cone.geometry.computeVertexNormals();
    g.add(cone);
    const brimG = new THREE.RingGeometry(a * 1.0, a * 2.2, 48, 2); brimG.rotateX(-Math.PI / 2);
    const bp = brimG.attributes.position; for (let i = 0; i < bp.count; i++) { const x = bp.getX(i), z = bp.getZ(i); const r = Math.hypot(x, z); bp.setY(i, Math.sin(Math.atan2(z, x) * 2) * 0.006 * (r / (a * 2.2)) - (r - a) * 0.08); bp.setZ(i, z * (c / a)); }
    brimG.computeVertexNormals();
    const brim = new THREE.Mesh(brimG, felt); g.add(brim);
    const rib = new THREE.Mesh(new THREE.CylinderGeometry(a * 1.06, a * 1.12, 0.022, 40, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xc8752a, roughness: 0.5, sheen: 0.8, sheenColor: new THREE.Color(0xffc080), side: THREE.DoubleSide }));
    rib.scale.z = c / a; rib.position.y = 0.012; g.add(rib);
    g.userData.offset = new V3(0, b * 0.55, -0.004);
  }
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}
export { SHAPE };
