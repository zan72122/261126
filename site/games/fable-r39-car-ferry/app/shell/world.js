// The low-poly world around the hero: sky, sea, three ports with families, islands and sea friends.
import * as THREE from './three.js';
import { mergeColored, mat, flat, clamp, lerp, rng, damp } from './util.js';
import { createSea } from './sea.js';
import { Animal } from './animals.js';
import { loadTexture, makeCloudTexture, makeFadeAlpha, makeRingTexture } from './textures.js';

export const BAY_R = 95;
export const QUAY = { y: 0.6, edgeZ: -13.4, halfW: 34, backZ: -62 };
export const WORLD_R = 150;

const PORT_DEFS = [
  { species: 'bear', angle: Math.PI, house: 0xffd27a, roof: 0xe2574c, flip: false },
  { species: 'rabbit', angle: (300 * Math.PI) / 180, house: 0xb6e3ff, roof: 0x5b7bd6, flip: true },
  { species: 'cat', angle: (60 * Math.PI) / 180, house: 0xffc2d6, roof: 0x7c5bb8, flip: false },
];

function planarUV(geo, scale) {
  const p = geo.attributes.position, n = geo.attributes.normal; const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i));
    let u, v;
    if (ay > 0.5) { u = p.getX(i); v = p.getZ(i); } else if (ax > 0.5) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); }
    uv[i * 2] = u / scale; uv[i * 2 + 1] = v / scale;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}

export function createWorld({ tier, scene, anisotropy }) {
  const R = rng(7);
  const disposables = [];
  const lambert = (o) => { const m = new THREE.MeshLambertMaterial(o); disposables.push(m); return m; };
  const vcol = lambert({ vertexColors: true });
  const vcolFlat = lambert({ vertexColors: true, flatShading: true });
  const group = new THREE.Group(); group.name = 'world'; scene.add(group);

  // ---------- lights ----------
  const hemi = new THREE.HemisphereLight(0xdff1ff, 0x8fb7a0, 1.6); group.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff4e0, 1.9); sun.position.set(60, 120, 50); group.add(sun);

  // ---------- sky ----------
  const skyGeo = new THREE.SphereGeometry(900, 20, 12);
  {
    const p = skyGeo.attributes.position; const c = new Float32Array(p.count * 3);
    const top = new THREE.Color(0x5fb0ee), hor = new THREE.Color(0xcfe9fb), col = new THREE.Color();
    for (let i = 0; i < p.count; i++) { const h = clamp(p.getY(i) / 900, 0, 1); col.copy(hor).lerp(top, Math.pow(h, 0.6)); c.set([col.r, col.g, col.b], i * 3); }
    skyGeo.setAttribute('color', new THREE.BufferAttribute(c, 3));
  }
  const skyMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false });
  disposables.push(skyMat);
  const sky = new THREE.Mesh(skyGeo, skyMat); sky.renderOrder = -2; sky.frustumCulled = false; group.add(sky);
  scene.fog = new THREE.Fog(0xcfe9fb, 170, 820);

  // clouds
  const cloudTex = makeCloudTexture();
  const cloudMat = new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false });
  disposables.push(cloudMat);
  const nClouds = tier === 'high' ? 6 : tier === 'mobile' ? 4 : 2;
  const cloudGeo = new THREE.PlaneGeometry(1, 0.5);
  const clouds = [];
  for (let i = 0; i < nClouds; i++) {
    const m = new THREE.Mesh(cloudGeo, cloudMat);
    const a = (i / nClouds) * Math.PI * 2 + R() * 0.5; const d = 520 + R() * 160;
    m.position.set(Math.sin(a) * d, 110 + R() * 90, Math.cos(a) * d); m.scale.setScalar(160 + R() * 120);
    m.renderOrder = -1; group.add(m); clouds.push(m);
  }

  // far hills ring
  {
    const N = 56; const pos = [], col = [], idx = []; const g1 = new THREE.Color(0x7fb08a), g2 = new THREE.Color(0xa8c8d8);
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2; const r = 680;
      const h = 30 + 28 * Math.sin(i * 0.9) * Math.sin(i * 0.37 + 1) + 16 * Math.sin(i * 2.3);
      pos.push(Math.sin(a) * r, -5, Math.cos(a) * r, Math.sin(a) * r, Math.max(h, 12), Math.cos(a) * r);
      col.push(g1.r, g1.g, g1.b, g2.r, g2.g, g2.b);
      if (i < N) { const b = i * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, fog: true }); disposables.push(m);
    const hills = new THREE.Mesh(g, m); hills.renderOrder = -1; group.add(hills);
  }

  // ---------- sea ----------
  const seaSeg = tier === 'high' ? 72 : tier === 'mobile' ? 56 : 40;
  const sea = createSea(null, seaSeg);
  group.add(sea.mesh);
  loadTexture('sea_water_512.jpg', { anisotropy, onLoad: (t) => sea.setMap(t) });

  // ---------- shared textured materials ----------
  const concreteTex = loadTexture('pier_concrete_512.jpg', { anisotropy });
  const concrete = lambert({ map: concreteTex, color: 0xf2efe8 });
  const harborTex = loadTexture('harbor_view_512.jpg', { repeat: false });
  const fade = makeFadeAlpha();
  const billboardMat = new THREE.MeshBasicMaterial({ map: harborTex, alphaMap: fade, transparent: true, depthWrite: false, fog: true, color: 0xf4f8ff });
  disposables.push(billboardMat);
  const glowTex = makeRingTexture();
  const glowMat = new THREE.SpriteMaterial({ map: glowTex, color: 0xfff0a0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
  disposables.push(glowMat);

  // ---------- ports ----------
  const quayGeo = planarUV(new THREE.BoxGeometry(QUAY.halfW * 2, 4, -QUAY.backZ + QUAY.edgeZ), 8);
  quayGeo.translate(0, QUAY.y - 2, (QUAY.edgeZ + QUAY.backZ) / 2);
  const bbGeo = new THREE.PlaneGeometry(150, 150 / 1.99); bbGeo.translate(0, 150 / 1.99 / 2 - 2, 0);
  const bbGeoFlip = bbGeo.clone(); { const uv = bbGeoFlip.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i)); }

  function houseGeo(wall, roof, w = 6, h = 3.6, d = 5, door = true) {
    const parts = [
      { geo: new THREE.BoxGeometry(w, h, d), color: wall, matrix: mat(0, h / 2, 0) },
      { geo: new THREE.BoxGeometry(w + 0.6, 0.3, d + 0.6), color: 0xf6efe4, matrix: mat(0, 0.15, 0) },
    ];
    // gable roof: a 3-sided prism
    const roofG = new THREE.CylinderGeometry(1, 1, d + 0.8, 3, 1); roofG.rotateX(Math.PI / 2); roofG.rotateZ(Math.PI / 2);
    parts.push({ geo: roofG, color: roof, matrix: mat(0, h + w * 0.18, 0, 0, 0, 0, w * 0.62, w * 0.42, 1) });
    if (door) parts.push({ geo: new THREE.BoxGeometry(1.1, 1.9, 0.12), color: 0x8a5a3a, matrix: mat(0, 0.95, d / 2 + 0.05) });
    for (const sx of [-1, 1]) {
      parts.push({ geo: new THREE.BoxGeometry(1.1, 1.0, 0.12), color: 0x9fd6ff, matrix: mat(sx * w * 0.3, h * 0.6, d / 2 + 0.05) });
      parts.push({ geo: new THREE.BoxGeometry(1.3, 0.14, 0.2), color: 0xffffff, matrix: mat(sx * w * 0.3, h * 0.6 - 0.56, d / 2 + 0.08) });
    }
    parts.push({ geo: new THREE.BoxGeometry(0.6, 1.4, 0.6), color: 0xc9a089, matrix: mat(w * 0.25, h + w * 0.3, -d * 0.2) });
    return mergeColored(parts);
  }
  function treeParts(x, z, s = 1) {
    return [
      { geo: new THREE.CylinderGeometry(0.16 * s, 0.22 * s, 1.4 * s, 6), color: 0x8a6142, matrix: mat(x, QUAY.y + 0.7 * s, z) },
      { geo: new THREE.IcosahedronGeometry(1.1 * s, 0), color: 0x5fb85a, matrix: mat(x, QUAY.y + 2.0 * s, z) },
      { geo: new THREE.IcosahedronGeometry(0.8 * s, 0), color: 0x75c96a, matrix: mat(x + 0.5 * s, QUAY.y + 2.6 * s, z + 0.2) },
    ];
  }

  const ports = PORT_DEFS.map((def, i) => {
    const o = new THREE.Vector3(Math.sin(def.angle) * BAY_R, 0, Math.cos(def.angle) * BAY_R);
    const fwd = o.clone().multiplyScalar(-1 / BAY_R);
    const yaw = Math.atan2(fwd.x, fwd.z);
    const g = new THREE.Group(); g.position.copy(o); g.rotation.y = yaw; g.name = 'port' + i; group.add(g);
    g.updateMatrixWorld(true);
    const local = (x, y, z, out = new THREE.Vector3()) => g.localToWorld(out.set(x, y, z));
    const bollards = [6.5, -6.5].map((x) => local(x, QUAY.y + 0.62, QUAY.edgeZ - 0.8)); // [0] on the ship's +X side
    return {
      index: i, def, group: g, origin: o, yaw, fwd, built: false, family: [], house: null, beacons: [],
      berth: { quayY: QUAY.y, quayEdgeZ: QUAY.edgeZ, bollards },
      local,
      decoAnchors: [[-2.2, 4.6, 2.75], [2.2, 4.6, 2.75], [0, 6.9, 1.6], [-3.9, 0.6, 3.4], [3.9, 0.6, 3.4], [-1.9, 0.6, 3.9], [1.9, 0.6, 3.9], [0, 3.1, 2.8]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      waitSpots: [[-7.2, -18.2], [-5.6, -21.4], [-2.2, -22.8]].map(([x, z]) => ({ x, z })),
      deliverSpots: [[4.8, -21.0], [7.9, -21.2], [10.9, -20.8]].map(([x, z]) => ({ x, z })),
      parkSpots: [[-3.0, -29.0], [-6.2, -29.0], [-9.4, -29.0], [-12.6, -29.0]].map(([x, z]) => ({ x, z, car: null })),
      spawnFrom: { x: -31, z: -24 }, leaveTo: { x: -33, z: -32 },
      waiting: [], decorations: [], active: true, glow: 1,
    };
  });

  function buildPort(port) {
    if (port.built) return;
    const { def, group: g, index: i } = port;
    const quay = new THREE.Mesh(quayGeo, concrete); g.add(quay);
    const bb = new THREE.Mesh(def.flip ? bbGeoFlip : bbGeo, billboardMat); bb.position.set(0, 0, -92); bb.renderOrder = 0; g.add(bb);
    // furniture: bollards, fenders, trees, small houses (merged)
    const parts = [];
    for (const x of [-6.5, 6.5]) {
      parts.push({ geo: new THREE.CylinderGeometry(0.26, 0.32, 0.6, 10), color: 0x3d4652, matrix: mat(x, QUAY.y + 0.3, QUAY.edgeZ - 0.8) });
      parts.push({ geo: new THREE.SphereGeometry(0.34, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), color: 0x3d4652, matrix: mat(x, QUAY.y + 0.6, QUAY.edgeZ - 0.8, 0, 0, 0, 1, 0.5, 1) });
    }
    for (let x = -28; x <= 28; x += 7) if (Math.abs(x) > 3) parts.push({ geo: new THREE.CylinderGeometry(0.35, 0.35, 1.6, 8), color: 0x2f2f33, matrix: mat(x, -0.1, QUAY.edgeZ + 0.3) });
    parts.push({ geo: new THREE.BoxGeometry(QUAY.halfW * 2, 0.12, 0.35), color: 0xffd34d, matrix: mat(0, QUAY.y + 0.06, QUAY.edgeZ - 0.25) });
    parts.push(...treeParts(-21, -27.5, 1.2), ...treeParts(1.5, -34, 1), ...treeParts(31, -31, 1.1), ...treeParts(-29, -40, 1.3));
    g.add(new THREE.Mesh(mergeColored(parts), vcol));
    const hx = [[-14, -36, 0xfff1c9, 0x4aa36c], [24, -40, 0xd9f2c8, 0xe0794c], [-26, -46, 0xe7dcff, 0xd65a6d]];
    g.add(new THREE.Mesh(mergeColored(hx.map(([x, z, c, r]) => ({ geo: houseGeo(c, r, 5.5, 3.4, 5, false), color: null, matrix: mat(x, QUAY.y, z) }))), vcol));
    // the family's house
    const house = new THREE.Mesh(houseGeo(def.house, def.roof), vcol); house.position.set(7.5, QUAY.y, -30.5); g.add(house);
    port.house = house;
    // family
    const fam = [new Animal(def.species, 1.25, i * 3), new Animal(def.species, 1.1, i * 3 + 1), new Animal(def.species, 0.78, i * 3 + 2)];
    const famPos = [[5.2, -25.2], [7.8, -25.6], [10.3, -24.6]];
    fam.forEach((a, k) => { a.object.position.set(famPos[k][0], QUAY.y, famPos[k][1]); a.object.rotation.y = -0.1 + k * 0.05; g.add(a.object); });
    port.family = fam;
    // beacon buoys at the entrance
    port.beacons = [-9, 9].map((x) => {
      const b = new THREE.Group(); b.position.set(x, 0, 26); g.add(b);
      b.add(new THREE.Mesh(beaconGeo, vcol));
      const lampMat = new THREE.MeshBasicMaterial({ color: 0xffe27a }); disposables.push(lampMat);
      const lamp = new THREE.Mesh(lampGeo, lampMat); lamp.position.y = 2.4; b.add(lamp);
      const glow = new THREE.Sprite(glowMat); glow.scale.setScalar(5); glow.position.y = 2.4; b.add(glow);
      return { group: b, lamp, glow, lampMat, world: g.localToWorld(new THREE.Vector3(x, 0, 26)) };
    });
    port.built = true;
    events && events.onPortBuilt && events.onPortBuilt(port);
  }
  const beaconGeo = mergeColored([
    { geo: new THREE.CylinderGeometry(0.9, 1.1, 1.2, 12), color: 0xffffff, matrix: mat(0, 0.2, 0) },
    { geo: new THREE.CylinderGeometry(0.92, 0.92, 0.45, 12), color: 0xff5a4e, matrix: mat(0, 0.45, 0) },
    { geo: new THREE.CylinderGeometry(0.12, 0.12, 1.6, 6), color: 0x555555, matrix: mat(0, 1.5, 0) },
  ]);
  const lampGeo = new THREE.SphereGeometry(0.42, 12, 8);

  // ---------- islands, rock, lighthouse, sea friends (built after the first frame) ----------
  const obstacles = []; // {x, z, r}
  const rockPos = new THREE.Vector3(30, 0, -48);
  const rings = [[-38, -60], [-62, -1], [40, -30], [-6, 49]].map(([x, z], k) => ({ kind: 'ring', x, z, spin: 0, spinV: 0, jump: 0, k, pickR: 2.4, cool: 0 }));
  const gullFlock = { kind: 'gulls', state: 'rock', t: 0, x: rockPos.x, z: rockPos.z, pickR: 6 };
  const whale = { kind: 'whale', x: 6, z: 66, baseX: 6, baseZ: 66, y: -3, up: 0, t: 0, spoutCool: 0, yaw: 1.4, pickR: 5, swim: 0 };
  const gulls = [];
  let perchObj; // the hero's gullPerch, looked up once
  let lighthouse = null, ringsMesh = null, gullBody = null, gullWL = null, gullWR = null, whaleMesh = null;
  let islandsBuilt = false, friendsBuilt = false;
  // obstacles are known before the meshes exist
  obstacles.push({ x: 0, z: 0, r: 16 }, { x: -58.9, z: -34, r: 9 }, { x: rockPos.x, z: rockPos.z, r: 5.5 });
  function buildIslands() {
  function island(x, z, r, palms, lighthouse) {
    const parts = [
      { geo: new THREE.CylinderGeometry(r * 0.92, r, 2.4, 14), color: 0xf1dfa6, matrix: mat(x, -0.6, z) },
      { geo: new THREE.SphereGeometry(r * 0.78, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), color: 0x78c46a, matrix: mat(x, 0.5, z, 0, 0, 0, 1, 0.32, 1) },
    ];
    for (let k = 0; k < palms; k++) {
      const a = k * 2.4 + 0.5; const px = x + Math.sin(a) * r * 0.4, pz = z + Math.cos(a) * r * 0.4;
      parts.push({ geo: new THREE.CylinderGeometry(0.22, 0.32, 5, 6), color: 0xa57a4f, matrix: mat(px, 3.0, pz, 0.12, 0, 0.1) });
      for (let l = 0; l < 5; l++) {
        const la = (l / 5) * Math.PI * 2;
        parts.push({ geo: new THREE.ConeGeometry(0.5, 3.2, 4), color: 0x3fa45a, matrix: mat(px + Math.sin(la) * 1.2, 5.4, pz + Math.cos(la) * 1.2, Math.cos(la) * 1.25, 0, -Math.sin(la) * 1.25, 1, 1, 0.3) });
      }
    }
    const m = new THREE.Mesh(flat(mergeColored(parts)), vcolFlat); group.add(m);
    let lh = null;
    if (lighthouse) {
      const lg = new THREE.Group(); lg.position.set(x + 2, 0.8, z - 1); group.add(lg);
      const tower = new THREE.Mesh(mergeColored([
        { geo: new THREE.CylinderGeometry(1.1, 1.5, 3, 12), color: 0xffffff, matrix: mat(0, 1.5, 0) },
        { geo: new THREE.CylinderGeometry(0.95, 1.1, 3, 12), color: 0xe8453c, matrix: mat(0, 4.5, 0) },
        { geo: new THREE.CylinderGeometry(0.8, 0.95, 2.4, 12), color: 0xffffff, matrix: mat(0, 7.2, 0) },
        { geo: new THREE.CylinderGeometry(1.2, 1.2, 0.3, 12), color: 0x444444, matrix: mat(0, 8.5, 0) },
        { geo: new THREE.ConeGeometry(1.1, 1.2, 12), color: 0xe8453c, matrix: mat(0, 10.3, 0) },
      ]), vcol);
      lg.add(tower);
      const lampMat = new THREE.MeshLambertMaterial({ color: 0xfff7d0, emissive: 0x000000 }); disposables.push(lampMat);
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.1, 12), lampMat); lamp.position.y = 9.2; lg.add(lamp);
      const glow = new THREE.Sprite(glowMat); glow.scale.setScalar(0.01); glow.position.y = 9.2; lg.add(glow);
      lh = { kind: 'lighthouse', group: lg, lamp, lampMat, glow, lit: 0, target: 0, x: x + 2, z: z - 1, pickR: 4 };
    }
    return lh;
  }
  lighthouse = island(0, 0, 15, 2, true);
  island(-58.9, -34, 8, 2, false);
  // gull rock
  {
    const m = new THREE.Mesh(flat(mergeColored([
      { geo: new THREE.DodecahedronGeometry(3.4, 0), color: 0x9aa0a8, matrix: mat(0, 0.4, 0, 0.3, 0.2, 0, 1, 0.7, 1) },
      { geo: new THREE.DodecahedronGeometry(2.2, 0), color: 0xb5bac0, matrix: mat(2.4, 0, 1.2, 0.5, 0.7, 0, 1, 0.6, 1) },
    ])), vcolFlat);
    m.position.copy(rockPos); group.add(m);
  }

    islandsBuilt = true;
  }
  function buildFriends() {
  // rings (instanced torus, red/white)
  const ringGeo = new THREE.TorusGeometry(1.05, 0.34, 8, 20);
  {
    const p = ringGeo.attributes.position; const c = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) { const a = Math.atan2(p.getY(i), p.getX(i)); const red = Math.floor(((a + Math.PI) / (Math.PI * 2)) * 8) % 2 === 0; c.set(red ? [0.95, 0.22, 0.2] : [1, 1, 1], i * 3); }
    ringGeo.setAttribute('color', new THREE.BufferAttribute(c, 3)); ringGeo.rotateX(-Math.PI / 2);
  }
  ringsMesh = new THREE.InstancedMesh(ringGeo, vcol, rings.length); group.add(ringsMesh);

  // gulls (3 instanced meshes: body, left wing, right wing)
  const gullBodyGeo = mergeColored([
    { geo: new THREE.SphereGeometry(0.32, 8, 6), color: 0xffffff, matrix: mat(0, 0, 0, 0, 0, 0, 0.8, 0.75, 1.5) },
    { geo: new THREE.SphereGeometry(0.22, 8, 6), color: 0xffffff, matrix: mat(0, 0.18, 0.42) },
    { geo: new THREE.ConeGeometry(0.07, 0.25, 5), color: 0xffb02e, matrix: mat(0, 0.15, 0.7, Math.PI / 2, 0, 0) },
    { geo: new THREE.SphereGeometry(0.035, 4, 3), color: 0x222222, matrix: mat(0.13, 0.24, 0.55) },
    { geo: new THREE.SphereGeometry(0.035, 4, 3), color: 0x222222, matrix: mat(-0.13, 0.24, 0.55) },
  ]);
  const wingGeo = mergeColored([{ geo: new THREE.BoxGeometry(0.9, 0.05, 0.42), color: 0xdfe6ee, matrix: mat(0.45, 0, 0) }]);
  const nG = tier === 'low' ? 3 : 5;
  gullBody = new THREE.InstancedMesh(gullBodyGeo, vcol, nG);
  gullWL = new THREE.InstancedMesh(wingGeo, vcol, nG);
  gullWR = new THREE.InstancedMesh(wingGeo, vcol, nG);
  [gullBody, gullWL, gullWR].forEach((m) => { m.frustumCulled = false; group.add(m); });
  for (let k = 0; k < nG; k++) {
    const home = new THREE.Vector3(rockPos.x + Math.cos(k * 1.3) * 2.2, 2.4 + (k % 2) * 0.3, rockPos.z + Math.sin(k * 1.3) * 2.2);
    gulls.push({ home, pos: home.clone(), vel: new THREE.Vector3(), yaw: k, flap: 0, perchIdx: k });
  }

  // whale
  const whaleGeo = mergeColored([
    { geo: new THREE.SphereGeometry(2.2, 14, 10), color: 0x4f7fd0, matrix: mat(0, 0, 0, 0, 0, 0, 1, 0.72, 1.7) },
    { geo: new THREE.SphereGeometry(1.9, 12, 8), color: 0xdbe8f7, matrix: mat(0, -0.45, 0.4, 0, 0, 0, 0.92, 0.5, 1.5) },
    { geo: new THREE.SphereGeometry(0.16, 6, 4), color: 0x1d1d1d, matrix: mat(1.55, 0.25, 2.1) },
    { geo: new THREE.SphereGeometry(0.16, 6, 4), color: 0x1d1d1d, matrix: mat(-1.55, 0.25, 2.1) },
    { geo: new THREE.SphereGeometry(0.22, 6, 4), color: 0xff9fb0, matrix: mat(1.6, -0.15, 2.3, 0, 0, 0, 1, 0.6, 0.6) },
    { geo: new THREE.SphereGeometry(0.22, 6, 4), color: 0xff9fb0, matrix: mat(-1.6, -0.15, 2.3, 0, 0, 0, 1, 0.6, 0.6) },
    { geo: new THREE.ConeGeometry(1.2, 2.0, 4), color: 0x4f7fd0, matrix: mat(0, 0.3, -3.9, -Math.PI / 2, 0, 0, 1.4, 1, 0.25) },
    { geo: new THREE.SphereGeometry(0.8, 8, 5), color: 0x4f7fd0, matrix: mat(1.9, -0.6, 0.6, 0, 0, -0.6, 1, 0.25, 0.6) },
    { geo: new THREE.SphereGeometry(0.8, 8, 5), color: 0x4f7fd0, matrix: mat(-1.9, -0.6, 0.6, 0, 0, 0.6, 1, 0.25, 0.6) },
  ]);
  whaleMesh = new THREE.Mesh(whaleGeo, vcol); group.add(whaleMesh); whaleMesh.visible = false;
    friendsBuilt = true;
  }

  // ---------- update ----------
  const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler(), tmpS = new THREE.Vector3(1, 1, 1), tmpV = new THREE.Vector3();
  let events = null; // set by game: { onReact(kind, obj, pos) }

  function react(obj, pos) { events && events.onReact(obj.kind, obj, pos); }

  function poke(obj, t) {
    if (obj.kind === 'ring') { obj.spinV = 9; obj.jump = 1; react(obj, tmpV.set(obj.x, 0.5, obj.z)); }
    if (obj.kind === 'whale') { if (whale.spoutCool <= 0) { whale.up = 1; whale.spoutT = 0.6; whale.spoutCool = 2.5; react(whale, tmpV.set(whale.x, 2, whale.z)); } }
    if (obj.kind === 'gulls') { if (gullFlock.state === 'rock') gullFlock.state = 'fly'; gullFlock.t = 0; react(gullFlock, tmpV.set(gullFlock.x, 3, gullFlock.z)); }
    if (obj.kind === 'lighthouse') { lighthouse.target = 1; lighthouse.flash = 1; react(lighthouse, tmpV.set(lighthouse.x, 9, lighthouse.z)); }
  }

  function update(dt, t, ctx) {
    // ctx: { shipPos, shipYaw, shipRoot, camTarget, docked }
    sea.update(t, ctx.camTarget);
    const sp = ctx.shipPos;
    // beacons: pulse; the port the ship is at is dim
    for (const p of ports) {
      p.glow = damp(p.glow, p.active ? 1 : 0.15, 0.6, dt);
      for (const b of p.beacons) {
        const k = p.glow * (0.65 + 0.35 * Math.sin(t * 3 + p.index));
        b.glow.material.opacity = 1; b.glow.scale.setScalar(2 + 5 * k);
        b.lampMat.color.setRGB(1, 0.75 + 0.2 * k, 0.35 + 0.3 * k);
        b.group.position.y = sea.heightAt(b.group.position.x, b.group.position.z, t) * 0.8;
        b.group.rotation.z = Math.sin(t * 1.3 + p.index) * 0.06;
      }
      for (const a of p.family) a.update(t, dt);
    }
    if (!friendsBuilt) { for (const c of clouds) c.lookAt(ctx.cameraPos); return; }
    // rings
    for (const r of rings) {
      const d = Math.hypot(sp.x - r.x, sp.z - r.z);
      r.cool -= dt;
      if (d < 14 && r.cool <= 0) { poke(r, t); r.cool = 6; }
      r.spin += r.spinV * dt; r.spinV = damp(r.spinV, 0.6, 2.5, dt); r.jump = damp(r.jump, 0, 0.5, dt);
      const y = sea.heightAt(r.x, r.z, t) + Math.sin(r.jump * Math.PI) * 1.2 * (r.jump > 0.02 ? 1 : 0);
      tmpQ.setFromEuler(tmpE.set(Math.sin(t + r.k) * 0.12, r.spin, Math.cos(t * 0.8 + r.k) * 0.12));
      tmpM.compose(tmpV.set(r.x, y + 0.05, r.z), tmpQ, tmpS.set(1, 1, 1)); ringsMesh.setMatrixAt(r.k, tmpM);
    }
    ringsMesh.instanceMatrix.needsUpdate = true;
    // lighthouse
    if (lighthouse && islandsBuilt) {
      const d = Math.hypot(sp.x - lighthouse.x, sp.z - lighthouse.z);
      if (d < 34 && lighthouse.target === 0) poke(lighthouse, t);
      lighthouse.lit = damp(lighthouse.lit, lighthouse.target, 0.5, dt);
      lighthouse.flash = damp(lighthouse.flash || 0, 0, 0.4, dt);
      const k = lighthouse.lit * (0.8 + 0.2 * Math.sin(t * 2.5)) + lighthouse.flash;
      lighthouse.lampMat.emissive.setRGB(k, k * 0.85, k * 0.4);
      lighthouse.glow.scale.setScalar(0.01 + k * 9);
    }
    // whale: idles under water; surfaces & spouts when the ship comes near or when tapped
    whale.spoutCool -= dt; whale.t += dt;
    const dW = Math.hypot(sp.x - whale.x, sp.z - whale.z);
    if (dW < 22 && whale.spoutCool <= 0) poke(whale, t);
    whale.up = damp(whale.up, dW < 40 ? 1 : 0, whale.up < 0.5 ? 0.8 : 2.5, dt);
    if (whale.spoutT > 0) { whale.spoutT -= dt; events && events.onSpout(tmpV.set(whale.x, 1.6 + whale.y, whale.z)); }
    whale.swim += dt * (0.25 + whale.up * 0.2);
    whale.x = whale.baseX + Math.sin(whale.swim * 0.4) * 10; whale.z = whale.baseZ + Math.cos(whale.swim * 0.3) * 4;
    whale.yaw = Math.atan2(Math.cos(whale.swim * 0.4) * 4, -Math.sin(whale.swim * 0.3) * 1.2);
    whale.y = lerp(-3.2, -0.6, whale.up) + Math.sin(t * 1.2) * 0.15;
    whaleMesh.position.set(whale.x, whale.y, whale.z); whaleMesh.rotation.set(Math.sin(t * 0.9) * 0.05, whale.yaw, 0);
    whaleMesh.visible = whale.up > 0.02;
    // gulls
    const dG = Math.hypot(sp.x - gullFlock.x, sp.z - gullFlock.z);
    if (gullFlock.state === 'rock' && dG < 18) poke(gullFlock, t);
    gullFlock.t += dt;
    if (gullFlock.state === 'fly' && gullFlock.t > 6) gullFlock.state = 'perch';
    if (gullFlock.state === 'perch' && ctx.docked && gullFlock.t > 10) { gullFlock.state = 'home'; gullFlock.t = 0; }
    if (gullFlock.state === 'home' && gullFlock.t > 8) gullFlock.state = 'rock';
    gulls.forEach((gl, k) => {
      let target;
      if (gullFlock.state === 'rock' || gullFlock.state === 'home') target = gl.home;
      else if (gullFlock.state === 'fly') {
        const a = t * 0.9 + k * 1.25; target = tmpV.set(sp.x + Math.cos(a) * 7, 9 + Math.sin(a * 1.7) * 1.5, sp.z + Math.sin(a) * 7);
      } else {
        // perch on the ship's cabin roof. The hero's 'gullPerch' (roof centre, child of the hull) follows sink / trim / heel.
        if (perchObj === undefined) perchObj = ctx.shipRoot.getObjectByName('gullPerch') || null;
        if (perchObj) { if (k === 0) perchObj.updateWorldMatrix(true, false); target = tmpV.set(((k % 3) - 1) * 1.3, 0.03, -0.9 + Math.floor(k / 3) * 1.6); perchObj.localToWorld(target); }
        else { target = tmpV.set(((k % 3) - 1) * 1.3, 6.25, 6.2 + Math.floor(k / 3) * 1.6); ctx.shipRoot.localToWorld(target); }
      }
      const atRest = (gullFlock.state === 'rock' || gullFlock.state === 'perch') && gl.pos.distanceTo(target) < 0.6;
      const f = atRest ? 0.05 : 0.6;
      const nx = damp(gl.pos.x, target.x, f, dt), ny = damp(gl.pos.y, target.y, f, dt), nz = damp(gl.pos.z, target.z, f, dt);
      const vx = nx - gl.pos.x, vz = nz - gl.pos.z;
      if (Math.abs(vx) + Math.abs(vz) > 0.002) gl.yaw = Math.atan2(vx, vz);
      else if (gullFlock.state === 'perch') gl.yaw = ctx.shipYaw + Math.PI + (k - 2) * 0.2;
      gl.pos.set(nx, ny, nz);
      const flying = !atRest;
      gl.flap += dt * (flying ? 14 : 0);
      const wing = flying ? Math.sin(gl.flap) * 0.7 : 0.15;
      tmpQ.setFromEuler(tmpE.set(0, gl.yaw, 0));
      tmpM.compose(gl.pos, tmpQ, tmpS.set(1, 1, 1)); gullBody.setMatrixAt(k, tmpM);
      tmpQ.setFromEuler(tmpE.set(0, gl.yaw, -wing, 'YXZ'));
      tmpM.compose(tmpV.set(gl.pos.x, gl.pos.y + 0.1, gl.pos.z), tmpQ, tmpS.set(-1, 1, 1)); gullWL.setMatrixAt(k, tmpM);
      tmpQ.setFromEuler(tmpE.set(0, gl.yaw, wing, 'YXZ'));
      tmpM.compose(tmpV.set(gl.pos.x, gl.pos.y + 0.1, gl.pos.z), tmpQ, tmpS.set(1, 1, 1)); gullWR.setMatrixAt(k, tmpM);
    });
    gullBody.instanceMatrix.needsUpdate = gullWL.instanceMatrix.needsUpdate = gullWR.instanceMatrix.needsUpdate = true;
    if (gullFlock.state === 'fly' || gullFlock.state === 'perch') { gullFlock.x = sp.x; gullFlock.z = sp.z; } else { gullFlock.x = rockPos.x; gullFlock.z = rockPos.z; }
    // clouds drift and face the camera
    for (const c of clouds) { c.lookAt(ctx.cameraPos); }
  }

  /** tap on a sea friend (closest along the ray within its radius) */
  const pickables = () => (friendsBuilt ? [...rings, whale, gullFlock, lighthouse] : []);
  function hitTest(ray) {
    let best = null, bestD = Infinity;
    for (const o of pickables()) {
      const y = o.kind === 'lighthouse' ? 6 : o.kind === 'gulls' ? 3 : 0.6;
      const c = tmpV.set(o.x, y, o.z);
      const d2 = ray.distanceSqToPoint(c); const r = o.pickR * (o.kind === 'lighthouse' ? 1.6 : 1.2);
      if (d2 < r * r) { const d = ray.origin.distanceTo(c); if (d < bestD) { bestD = d; best = o; } }
    }
    return best ? { obj: best, distance: bestD } : null;
  }

  // build the first port now, everything else one piece per frame after the first frame
  buildPort(ports[0]);
  const queue = [buildIslands, () => buildPort(ports[1]), () => buildPort(ports[2]), buildFriends];
  function buildStep() { const f = queue.shift(); if (f) f(); return queue.length === 0; }

  return {
    group, ports, sea, obstacles, rings, whale, gullFlock, get lighthouse() { return lighthouse; },
    update, hitTest, poke, buildStep, buildPort, get fullyBuilt() { return queue.length === 0; },
    setEvents(e) { events = e; },
    setLite(on) { sea.setLite(on); for (const c of clouds) c.visible = !on; },
    dispose() {
      group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      disposables.forEach((m) => m.dispose());
    },
  };
}
