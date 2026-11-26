import * as THREE from 'three';
import { mergeGeometries } from '../vendor/three/BufferGeometryUtils.js';
import { flakeTexture } from './textures.js';

// Low-poly surroundings (seen only from far away): sky, park backdrop, outer ground,
// soft snow banks around the 16 m field, pine trees, lights, falling snow.

export const PALETTES = [
  { name: 'noon', zenith: 0x5ea8f5, horizon: 0xe4f2ff, sun: 0xfff6e8, sunI: 2.7, hemiSky: 0xeaf4ff, hemiGround: 0xb9c6da, hemiI: 0.95, fog: 0xdfeefc, tint: 0xffffff },
  { name: 'morning', zenith: 0x8cc4ff, horizon: 0xfff1e0, sun: 0xffefd8, sunI: 2.5, hemiSky: 0xf2f4ff, hemiGround: 0xc0c6dc, hemiI: 0.95, fog: 0xf2efef, tint: 0xfff6ee },
  { name: 'evening', zenith: 0x6f7fd0, horizon: 0xffc9b0, sun: 0xffc49a, sunI: 2.3, hemiSky: 0xe8dcff, hemiGround: 0xc8b4c8, hemiI: 0.9, fog: 0xf0d8d6, tint: 0xffe6dc },
];

function colorize(geo, color) {
  const c = new THREE.Color(color);
  const n = geo.attributes.position.count;
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(a, 3));
  return geo;
}
const strip = (g) => { g.deleteAttribute('uv'); return g; };

export function createWorld(scene, tex, tier) {
  const disposables = [];
  const keep = (x) => (disposables.push(x), x);
  const group = new THREE.Group(); group.name = 'shell.world';
  scene.add(group);

  // --- sky dome (vertex-color gradient) ---
  const skyGeo = keep(new THREE.SphereGeometry(90, 24, 12));
  const skyCol = new Float32Array(skyGeo.attributes.position.count * 3);
  skyGeo.setAttribute('color', new THREE.BufferAttribute(skyCol, 3));
  const skyMat = keep(new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
  const sky = new THREE.Mesh(skyGeo, skyMat); sky.renderOrder = -10; group.add(sky);

  // --- park backdrop: a half cylinder behind the field with the photo ---
  const parkGeo = keep(new THREE.CylinderGeometry(24, 24, 16, 28, 1, true, Math.PI * 0.6, Math.PI * 0.8));
  const uvs = parkGeo.attributes.uv;
  for (let i = 0; i < uvs.count; i++) uvs.setX(i, uvs.getX(i) * 3);
  const parkMat = keep(new THREE.MeshBasicMaterial({ map: tex.park, transparent: true, side: THREE.BackSide, fog: false, depthWrite: false }));
  const park = new THREE.Mesh(parkGeo, parkMat); park.position.set(0, 6, 0); park.renderOrder = -9; group.add(park);

  // --- outer ground: big square with a 16 m hole for the hero terrain ---
  const shape = new THREE.Shape();
  shape.moveTo(-70, -70); shape.lineTo(70, -70); shape.lineTo(70, 70); shape.lineTo(-70, 70); shape.lineTo(-70, -70);
  const hole = new THREE.Path();
  const HH = 5.92;
  hole.moveTo(-HH, -HH); hole.lineTo(-HH, HH); hole.lineTo(HH, HH); hole.lineTo(HH, -HH); hole.lineTo(-HH, -HH);
  shape.holes.push(hole);
  const gGeo = keep(new THREE.ShapeGeometry(shape).rotateX(-Math.PI / 2));
  const gp = gGeo.attributes.position, gu = gGeo.attributes.uv;
  for (let i = 0; i < gp.count; i++) gu.setXY(i, gp.getX(i) / 4, gp.getZ(i) / 4);
  tex.ground.wrapS = tex.ground.wrapT = THREE.RepeatWrapping;
  const groundMat = keep(new THREE.MeshLambertMaterial({ map: tex.ground, color: 0xf4f8ff }));
  const ground = new THREE.Mesh(gGeo, groundMat); ground.receiveShadow = tier.shadows; group.add(ground);

  // --- soft snow banks along the field edge (field is 12 m: x,z in [-6, 6]) (one merged mesh) ---
  const bankParts = [];
  const makeBank = (len) => {
    const g = new THREE.CapsuleGeometry(0.38, len, 6, 16).rotateZ(Math.PI / 2);   // round when seen up close
    g.scale(1, 0.75, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const bump = 0.06 * Math.sin(x * 1.7) + 0.04 * Math.sin(x * 3.1 + 1);
      p.setY(i, y + (y > 0 ? bump : 0)); p.setZ(i, z + 0.03 * Math.sin(x * 2.3));
    }
    g.computeVertexNormals();
    return g;
  };
  for (const [x, z, ry] of [[0, -6.22, 0], [0, 6.22, 0], [-6.22, 0, Math.PI / 2], [6.22, 0, Math.PI / 2]]) {
    const g = makeBank(12.2); g.rotateY(ry); g.translate(x, 0.02, z);
    const p = g.attributes.position, u = g.attributes.uv;
    for (let i = 0; i < p.count; i++) u.setXY(i, (p.getX(i) + p.getZ(i)) / 1.5, p.getY(i) / 1.2 + (ry ? p.getX(i) : p.getZ(i)) / 1.2);
    bankParts.push(g);
  }
  const bankGeo = keep(mergeGeometries(bankParts)); bankParts.forEach((g) => g.dispose());
  const bankMat = keep(new THREE.MeshLambertMaterial({ map: tex.ground, color: 0xffffff }));
  const banks = new THREE.Mesh(bankGeo, bankMat); banks.receiveShadow = tier.shadows; group.add(banks);

  // --- pine trees (instanced, vertex colors) ---
  const treeParts = [];
  treeParts.push(colorize(strip(new THREE.CylinderGeometry(0.18, 0.24, 1.0, 6).translate(0, 0.5, 0)), 0x6b4a33));
  const tiers = [[1.6, 1.9, 1.0], [1.25, 1.6, 2.0], [0.85, 1.3, 2.9]];
  for (const [r, h, y] of tiers) {
    treeParts.push(colorize(strip(new THREE.ConeGeometry(r, h, 9).translate(0, y + h / 2, 0)), 0x2f6b4f));
    treeParts.push(colorize(strip(new THREE.ConeGeometry(r * 0.72, h * 0.45, 9).translate(0, y + h * 0.78, 0)), 0xf4f8ff));
  }
  const treeGeo = keep(mergeGeometries(treeParts)); treeParts.forEach((g) => g.dispose());
  const treeMat = keep(new THREE.MeshLambertMaterial({ vertexColors: true }));
  const spots = [];
  const rnd = mulberry32(7);
  for (let k = 0; k < 16; k++) { const a = -1.35 + (k / 15) * 2.7; const r = 12 + rnd() * 7; spots.push([Math.sin(a) * r, -Math.cos(a) * r * 0.85 - 1.5]); }
  for (let k = 0; k < 4; k++) spots.push([-10.5 - rnd() * 3, -1 + k * 3]);
  for (let k = 0; k < 4; k++) spots.push([10.5 + rnd() * 3, -1 + k * 3]);
  const trees = new THREE.InstancedMesh(treeGeo, treeMat, spots.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  spots.forEach(([x, z], i) => {
    const sc = 0.8 + rnd() * 0.7;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * 6.28); s.set(sc, sc * (0.9 + rnd() * 0.3), sc); p.set(x, 0, z);
    trees.setMatrixAt(i, m4.compose(p, q, s));
  });
  trees.castShadow = false; group.add(trees);

  // --- round snowy bushes (instanced) ---
  const bushGeo = keep(new THREE.IcosahedronGeometry(0.7, 3).scale(1, 0.62, 1));   // round enough for the close camera
  const bushMat = keep(new THREE.MeshLambertMaterial({ map: tex.ground, color: 0xffffff }));
  const bushSpots = [[-8.6, -5], [-8.8, 5.6], [8.7, -5.2], [9.0, 5.8], [-4, -8.4], [3.6, -8.6], [0.4, -9.2]];
  const bushes = new THREE.InstancedMesh(bushGeo, bushMat, bushSpots.length);
  bushSpots.forEach(([x, z], i) => { const sc = 0.8 + rnd() * 0.8; q.identity(); s.set(sc, sc, sc); p.set(x, 0.1, z); bushes.setMatrixAt(i, m4.compose(p, q, s)); });
  group.add(bushes);

  // --- lights ---
  const hemi = new THREE.HemisphereLight(0xeaf4ff, 0xc9d3e0, 1.25);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff6e8, 2.4);
  sun.position.set(-9, 10, 5); sun.target.position.set(0, 0, 0);
  sun.castShadow = tier.shadows;
  sun.shadow.mapSize.set(tier.shadowSize, tier.shadowSize);
  const sc = sun.shadow.camera; sc.left = -8.5; sc.right = 8.5; sc.top = 8.5; sc.bottom = -8.5; sc.near = 2; sc.far = 40;
  sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 1.6;   // softer edges (same 5 taps): the close camera magnifies the 512 shadow map
  scene.add(sun, sun.target);

  scene.fog = new THREE.Fog(0xdfeefc, 34, 95);

  // --- falling snow (Points) ---
  const flakeTex = keep(flakeTexture());
  let snow = null;
  function buildSnow(count) {
    if (snow) { group.remove(snow); snow.geometry.dispose(); }
    const g = new THREE.BufferGeometry();
    const a = new Float32Array(count * 3), ph = new Float32Array(count);
    for (let i = 0; i < count; i++) { a[i * 3] = (Math.random() - 0.5) * 24; a[i * 3 + 1] = Math.random() * 12; a[i * 3 + 2] = (Math.random() - 0.5) * 20; ph[i] = Math.random() * 6.28; }
    g.setAttribute('position', new THREE.BufferAttribute(a, 3).setUsage(THREE.DynamicDrawUsage));
    g.userData.phase = ph;
    snow = new THREE.Points(g, snowMat); snow.frustumCulled = false; group.add(snow);
  }
  const snowMat = keep(new THREE.PointsMaterial({ map: flakeTex, size: 0.16, transparent: true, depthWrite: false, color: 0xffffff, opacity: 0.95 }));
  buildSnow(tier.flakes);

  let palette = PALETTES[0];
  function setPalette(i) {
    palette = PALETTES[i % PALETTES.length];
    const zen = new THREE.Color(palette.zenith), hor = new THREE.Color(palette.horizon), c = new THREE.Color();
    const pa = skyGeo.attributes.position;
    for (let k = 0; k < pa.count; k++) {
      const t = Math.max(0, Math.min(1, pa.getY(k) / 60));
      c.copy(hor).lerp(zen, Math.pow(t, 0.7));
      skyCol[k * 3] = c.r; skyCol[k * 3 + 1] = c.g; skyCol[k * 3 + 2] = c.b;
    }
    skyGeo.attributes.color.needsUpdate = true;
    sun.color.set(palette.sun); sun.intensity = palette.sunI;
    hemi.color.set(palette.hemiSky); hemi.groundColor.set(palette.hemiGround); hemi.intensity = palette.hemiI;
    scene.fog.color.set(palette.fog);
    parkMat.color.set(palette.tint);
  }
  setPalette(0);

  function update(dt, t) {
    if (!snow) return;
    const a = snow.geometry.attributes.position.array, ph = snow.geometry.userData.phase;
    for (let i = 0, n = ph.length; i < n; i++) {
      let y = a[i * 3 + 1] - dt * 0.9;
      if (y < 0) y += 12;
      a[i * 3 + 1] = y;
      a[i * 3] += Math.sin(t * 0.7 + ph[i]) * dt * 0.25;
    }
    snow.geometry.attributes.position.needsUpdate = true;
  }

  function setTier(tr) {
    sun.castShadow = tr.shadows;
    ground.receiveShadow = banks.receiveShadow = tr.shadows;
    buildSnow(tr.flakes);
  }

  return {
    group, sun, hemi, update, setPalette, setTier,
    onContextRestored() { skyGeo.attributes.color.needsUpdate = true; },
    dispose() { disposables.forEach((d) => d.dispose && d.dispose()); trees.dispose(); bushes.dispose(); if (snow) snow.geometry.dispose(); scene.remove(group, hemi, sun, sun.target); },
  };
}

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
