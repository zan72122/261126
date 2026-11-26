// The shop: counter, back wall, turntable + cake, color bowls, piping bag, tray dishes, cake box, photo frames.
// World units: 1.0 = 10 cm. Counter top is y = 0. Camera looks from +Z toward -Z.
import { THREE, mergeGeos, place, tint } from './util.js';

export const CREAM_COLORS = [
  { key: 'white', hex: 0xfffaf2 },
  { key: 'pink', hex: 0xffb3c8 },
  { key: 'choco', hex: 0x8a5236 },
  { key: 'yellow', hex: 0xffe27a },
];

// Sponge flavors per round: frosting tint (top) and sponge tint (side)
export const FLAVORS = [
  { frost: 0xffffff, sponge: 0xffffff },
  { frost: 0xffd9e4, sponge: 0xffeef0 },
  { frost: 0xe6c3ad, sponge: 0xa8775c },
  { frost: 0xfff1bd, sponge: 0xfff6e0 },
];

export const L = {
  plateTop: 0.42,
  spongeH: 0.8,
  radius: 1.2,
  get cakeTopY() { return this.plateTop + this.spongeH; },
  bowls: [[-3.0, -1.55], [-3.35, -0.45], [-3.3, 0.65], [-2.85, 1.7]],
  // the piping bag rests lying on the counter in front-right of the cake (tip toward the cake)
  bagHome: new THREE.Vector3(0.75, 0.36, 2.65),
  bagRestDir: new THREE.Vector3(1, 0.06, 0.36).normalize(),
  bagScale: 0.85,
  dishes: [[2.85, 2.05], [3.5, 1.1], [3.72, 0.05], [3.55, -0.98], [2.95, -1.9]], // strawberry, kiwi, blueberry, mandarin, candle
  boxHome: new THREE.Vector3(-2.35, 0, -2.95),
  boxHomeScale: 0.4,
  custWindow: new THREE.Vector3(3.15, 0, -3.7),
  custGive: new THREE.Vector3(2.75, 0, -3.55),   // beside the boxed cake, so the face stays visible
  parcelGive: new THREE.Vector3(1.05, 0, -2.55),  // the cake ends up next to the customer, not in front of the face
  frames: [[-3.7, 1.35], [-1.85, 1.45], [0.0, 1.35], [1.85, 1.45]],
  wallZ: -5.2,
};

function lambert(hex, extra = {}) { return new THREE.MeshLambertMaterial(Object.assign({ color: hex }, extra)); }
function standard(hex, extra = {}) { return new THREE.MeshStandardMaterial(Object.assign({ color: hex, roughness: 0.6, metalness: 0 }, extra)); }

export function buildWorld(assets, tier) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf6e4d6);
  const W = { scene, hit: {}, mats: {} };

  // --- lights (no shadow maps) ---
  const hemi = new THREE.HemisphereLight(0xfff6ee, 0xd9b9a0, 0.9);
  const sun = new THREE.DirectionalLight(0xfff4e6, 2.0);
  sun.position.set(-4, 9, 6);
  const amb = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(hemi, sun, amb);

  // --- back wall: blurred kitchen photo on a plane (unlit) ---
  const wallTex = assets.photo('kitchen_512');
  wallTex.wrapS = wallTex.wrapT = THREE.ClampToEdgeWrapping;
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(19, 10), new THREE.MeshBasicMaterial({ map: wallTex, color: 0xf2e6dc }));
  wall.position.set(0, 3.2, L.wallZ);
  scene.add(wall);

  // --- counter: marble slab ---
  const marble = assets.photo('marble_512', { repeat: 2, aniso: true });
  const counterGeo = new THREE.BoxGeometry(16, 0.6, 9);
  const counter = new THREE.Mesh(counterGeo, lambert(0xffffff, { map: marble }));
  counter.position.set(0, -0.3, -0.7);
  scene.add(counter);
  W.counter = counter;

  // --- blob shadows (one shared material) ---
  const shadowMat = new THREE.MeshBasicMaterial({ map: assets.tex.shadow, transparent: true, depthWrite: false, color: 0x5a3a2a });
  const shadowGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  W.shadow = (parent, x, z, sx, sz = sx, y = 0.006) => {
    const m = new THREE.Mesh(shadowGeo, shadowMat);
    m.position.set(x, y, z); m.scale.set(sx, 1, sz); m.renderOrder = -1;
    parent.add(m); return m;
  };

  // --- glow halo (additive disc) used by hints ---
  const haloGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  W.halo = (parent, x, y, z, size) => {
    const m = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({ map: assets.tex.halo, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
    m.position.set(x, y, z); m.scale.setScalar(size); m.renderOrder = 2; m.visible = false;
    parent.add(m); return m;
  };

  // --- turntable ---
  const ceramic = standard(0xf7f3ee, { roughness: 0.35 });
  const tt = new THREE.Group();
  scene.add(tt);
  const pedestal = new THREE.LatheGeometry([
    new THREE.Vector2(0.0, 0.0), new THREE.Vector2(0.75, 0.0), new THREE.Vector2(0.72, 0.06), new THREE.Vector2(0.3, 0.14),
    new THREE.Vector2(0.22, 0.3), new THREE.Vector2(0.0, 0.34),
  ], 32);
  const plate = new THREE.CylinderGeometry(1.55, 1.5, 0.08, 56, 1).translate(0, 0.38, 0);
  tt.add(new THREE.Mesh(mergeGeos([pedestal, plate]), ceramic));
  W.shadow(scene, 0, 0, 2.2);
  W.shadow(scene, 0, 0, 3.6, 3.6, 0.004);
  const rotor = new THREE.Group(); // rotates with the child's drag
  rotor.position.y = L.plateTop;
  tt.add(rotor);
  W.turntable = tt; W.rotor = rotor;
  W.hit.turntable = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 1.4, 16).translate(0, 0.6, 0), new THREE.MeshBasicMaterial({ visible: false }));
  tt.add(W.hit.turntable);

  // --- cake (sponge + frosting top); cakeTop is where hero.root and the toppings live ---
  const cake = new THREE.Group();
  rotor.add(cake);
  const sideTex = assets.spongeSide();
  const frostTex = assets.photo('cream_512');
  const spongeMat = lambert(0xffffff, { map: sideTex });
  const frostMat = standard(0xffffff, { map: frostTex, roughness: 0.75 });
  const spongeGeo = new THREE.CylinderGeometry(L.radius, L.radius, L.spongeH, 64, 1).translate(0, L.spongeH / 2, 0);
  spongeGeo.groups.length = 2; // side + top; the bottom cap sits on the turntable and is never seen
  const sponge = new THREE.Mesh(spongeGeo, [spongeMat, frostMat]);
  cake.add(sponge);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(L.radius - 0.01, 0.055, 6, 64).rotateX(Math.PI / 2).translate(0, L.spongeH, 0), frostMat);
  cake.add(rim);
  const cakeTop = new THREE.Group();
  cakeTop.position.y = L.spongeH;
  cake.add(cakeTop);
  W.cake = cake; W.cakeTop = cakeTop; W.mats.sponge = spongeMat; W.mats.frost = frostMat;
  // the cake's "touch me" glow: a gold ring hugging the rim (white additive light was invisible on white frosting)
  W.cakeHalo = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({ map: assets.tex.ring, transparent: true, depthWrite: false, opacity: 0 }));
  W.cakeHalo.position.set(0, 0.03, 0); W.cakeHalo.scale.setScalar(3.3); W.cakeHalo.renderOrder = 2;
  cakeTop.add(W.cakeHalo);
  W.setFlavor = (f) => { spongeMat.color.setHex(f.sponge); frostMat.color.setHex(f.frost); };

  // --- color bowls (bowl tinted by its cream color, cream dome + swirl inside) ---
  const creamTex = frostTex;
  W.bowls = [];
  const bowlProfile = [
    new THREE.Vector2(0.0, 0.0), new THREE.Vector2(0.3, 0.0), new THREE.Vector2(0.34, 0.03), new THREE.Vector2(0.5, 0.16),
    new THREE.Vector2(0.6, 0.38), new THREE.Vector2(0.62, 0.44), new THREE.Vector2(0.56, 0.44), new THREE.Vector2(0.5, 0.34),
  ];
  CREAM_COLORS.forEach((c, i) => {
    const g = new THREE.Group();
    const [x, z] = L.bowls[i];
    g.position.set(x, 0, z);
    const col = new THREE.Color(c.hex);
    const bowlCol = col.clone().lerp(new THREE.Color(0xffffff), c.key === 'white' ? 0 : 0.35);
    if (c.key === 'white') bowlCol.setHex(0xbfe3f2); // white cream sits in a pale blue bowl so it reads
    const bowl = new THREE.Mesh(new THREE.LatheGeometry(bowlProfile, 28), standard(bowlCol.getHex(), { roughness: 0.4, side: THREE.DoubleSide }));
    const creamMat = standard(c.hex, { map: creamTex, roughness: 0.7 });
    const dome = new THREE.SphereGeometry(0.52, 20, 8, 0, Math.PI * 2, 0, Math.PI / 2.6).translate(0, 0.08, 0);
    dome.scale(1, 0.55, 1);
    const swirl = kissGeometry(0.22, 0.42, 8, 24, 10).translate(0, 0.28, 0);
    const cream = new THREE.Mesh(mergeGeos([dome, swirl]), creamMat);
    const lift = new THREE.Group();
    lift.add(bowl, cream);
    g.add(lift);
    W.shadow(g, 0, 0, 1.5);
    const halo = W.halo(g, 0, 0.01, 0, 2.2);
    const proxy = new THREE.Mesh(new THREE.SphereGeometry(0.85, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
    proxy.position.y = 0.3; proxy.userData = { kind: 'bowl', index: i };
    g.add(proxy);
    scene.add(g);
    W.bowls.push({ group: g, lift, halo, proxy, mats: [creamMat], color: c });
  });

  // --- piping bag (origin = nozzle tip). Visual only; hero tells where the tip goes. ---
  const bag = new THREE.Group();
  const bagBody = new THREE.Group();
  const bodyGeo = new THREE.LatheGeometry([
    new THREE.Vector2(0.11, 0.2), new THREE.Vector2(0.2, 0.42), new THREE.Vector2(0.32, 0.8), new THREE.Vector2(0.41, 1.2),
    new THREE.Vector2(0.43, 1.45), new THREE.Vector2(0.36, 1.7), new THREE.Vector2(0.2, 1.86), new THREE.Vector2(0.09, 1.95),
    new THREE.Vector2(0.07, 2.15), new THREE.Vector2(0.0, 2.2),
  ], 24);
  const bagMat = standard(0xffffff, { roughness: 0.45, emissive: 0x000000 });
  bagBody.add(new THREE.Mesh(bodyGeo, bagMat));
  bag.add(bagBody);
  const starShape = new THREE.Shape();
  for (let i = 0; i < 16; i++) { const r = i % 2 ? 0.075 : 0.11, a = i * Math.PI / 8; i ? starShape.lineTo(r * Math.cos(a), r * Math.sin(a)) : starShape.moveTo(r, 0); }
  const nozzleGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.22, bevelEnabled: false }).rotateX(-Math.PI / 2);
  const nozzleMat = standard(0xd9dde3, { roughness: 0.3, metalness: 0.35 });
  bag.add(new THREE.Mesh(nozzleGeo, nozzleMat));
  bag.position.copy(L.bagHome);
  bag.scale.setScalar(L.bagScale);
  const restQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), L.bagRestDir);
  const workQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.15, 0, -0.38));
  bag.quaternion.copy(restQ);
  scene.add(bag);
  const bagProxy = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 2.5, 8).translate(0, 1.1, 0), new THREE.MeshBasicMaterial({ visible: false }));
  bagProxy.userData = { kind: 'bag' };
  bag.add(bagProxy);
  const mid = L.bagHome.clone().addScaledVector(L.bagRestDir, 0.9 * L.bagScale);
  W.bag = { group: bag, body: bagBody, mat: bagMat, proxy: bagProxy, restQ, workQ, halo: W.halo(scene, mid.x, 0.01, mid.z, 2.6) };
  W.bagShadow = W.shadow(scene, mid.x, mid.z, 2.0, 1.0);
  W.bagShadow.rotation.y = -Math.atan2(L.bagRestDir.z, L.bagRestDir.x);

  // --- tray dishes (merged into one mesh) ---
  const dishGeos = L.dishes.map(([x, z], i) => {
    const g = new THREE.LatheGeometry([
      new THREE.Vector2(0, 0), new THREE.Vector2(0.5, 0), new THREE.Vector2(0.58, 0.04), new THREE.Vector2(0.66, 0.1), new THREE.Vector2(0.62, 0.1), new THREE.Vector2(0.48, 0.05), new THREE.Vector2(0, 0.05),
    ], 24);
    return place(g, x, 0, z);
  });
  scene.add(new THREE.Mesh(mergeGeos(dishGeos), standard(0xfffdfa, { roughness: 0.3 })));
  L.dishes.forEach(([x, z]) => W.shadow(scene, x, z, 1.5));
  W.dishHalos = L.dishes.map(([x, z]) => W.halo(scene, x, 0.012, z, 2.0));

  // --- cake box (pink, open window in front, ribbon). Origin at bottom center. ---
  W.box = buildBox(assets);
  W.box.group.position.copy(L.boxHome);
  W.box.group.scale.setScalar(L.boxHomeScale);
  scene.add(W.box.group);
  W.box.halo = W.halo(scene, L.boxHome.x, 0.01, L.boxHome.z, 2.4);
  W.box.shadow = W.shadow(scene, L.boxHome.x, L.boxHome.z, 1.8);

  // --- photo frames on the wall (filled after each delivery) ---
  W.frames = L.frames.map(([x, y], i) => {
    const g = new THREE.Group();
    g.position.set(x, y, L.wallZ + 0.06);
    g.rotation.z = (i % 2 ? 1 : -1) * 0.05;
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.25, 0.08), lambert([0xf6b8c8, 0xbfe3f2, 0xffe27a, 0xc9e8b0][i]));
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    pic.position.z = 0.045;
    g.add(frame, pic);
    g.visible = false;
    scene.add(g);
    return { group: g, pic, tex: null };
  });

  return W;
}

// Star "kiss" (soft-serve-like) geometry: r(θ,v) star cross-section, tapering & twisting with height.
export function kissGeometry(radius, height, points = 8, seg = 24, rings = 10) {
  const pos = [], idx = [];
  for (let j = 0; j <= rings; j++) {
    const v = j / rings;
    const taper = Math.pow(1 - v, 0.85);
    const twist = v * 1.6;
    for (let i = 0; i <= seg; i++) {
      const th = (i / seg) * Math.PI * 2;
      const star = 1 - 0.28 * Math.pow((1 - Math.cos(points * (th + twist))) / 2, 1.4);
      const r = radius * taper * star;
      pos.push(Math.cos(th) * r, v * height, Math.sin(th) * r);
    }
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) {
    const a = j * (seg + 1) + i, b = a + seg + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const uv = []; for (let j = 0; j <= rings; j++) for (let i = 0; i <= seg; i++) uv.push(i / seg, j / rings);
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function buildBox(assets) {
  const W = 3.0, H = 2.35, D = 3.0, T = 0.05;
  const winW = 2.3, winH = 1.4, winY = 0.3;
  const parts = [];
  const add = (w, h, d, x, y, z) => parts.push(new THREE.BoxGeometry(w, h, d).translate(x, y, z));
  add(W, T, D, 0, H, 0);                       // lid
  add(T, H, D, -W / 2, H / 2, 0);              // left
  add(T, H, D, W / 2, H / 2, 0);               // right
  add(W, H, T, 0, H / 2, -D / 2);              // back
  // front with a window
  add(W, winY, T, 0, winY / 2, D / 2);
  add(W, H - winY - winH, T, 0, winY + winH + (H - winY - winH) / 2, D / 2);
  add((W - winW) / 2, winH, T, -(W + winW) / 4, winY + winH / 2, D / 2);
  add((W - winW) / 2, winH, T, (W + winW) / 4, winY + winH / 2, D / 2);
  const tex = assets.tex.boxdots;
  tex.repeat.set(2, 2);
  const boxMat = new THREE.MeshLambertMaterial({ color: 0xffffff, map: tex, emissive: 0x000000 });
  const body = new THREE.Mesh(mergeGeos(parts), boxMat);
  // ribbon: two bands over the lid + bow
  const rib = [];
  rib.push(new THREE.BoxGeometry(0.32, 0.06, D + 0.04).translate(0, H + 0.03, 0));
  rib.push(new THREE.BoxGeometry(W + 0.04, 0.06, 0.32).translate(0, H + 0.03, 0));
  rib.push(new THREE.BoxGeometry(0.32, H, 0.03).translate(0, H / 2, D / 2 + 0.03));
  rib.push(new THREE.BoxGeometry(0.32, H, 0.03).translate(0, H / 2, -D / 2 - 0.03));
  const ribbonMat = new THREE.MeshLambertMaterial({ color: 0xff5d8f });
  const ribbon = new THREE.Mesh(mergeGeos(rib), ribbonMat);
  const bowGeo = mergeGeos([
    place(new THREE.TorusGeometry(0.32, 0.1, 8, 20), -0.32, 0, 0, 0, 0, 0.35, 1, 0.75, 1),
    place(new THREE.TorusGeometry(0.32, 0.1, 8, 20), 0.32, 0, 0, 0, 0, -0.35, 1, 0.75, 1),
    new THREE.SphereGeometry(0.15, 12, 8),
  ]);
  const bow = new THREE.Mesh(bowGeo, ribbonMat);
  bow.position.set(0, H + 0.22, 0);
  const group = new THREE.Group();
  group.add(body, ribbon, bow);
  const proxy = new THREE.Mesh(new THREE.BoxGeometry(W * 1.3, H * 1.3, D * 1.3).translate(0, H / 2, 0), new THREE.MeshBasicMaterial({ visible: false }));
  proxy.userData = { kind: 'box' };
  group.add(proxy);
  return { group, body, ribbon, bow, proxy, mats: [boxMat], size: { W, H, D } };
}

// Fit a fixed-direction camera so the listed points stay on screen for any aspect ratio.
export function fitCamera(camera, aspect) {
  const target = new THREE.Vector3(0, 0.9, -0.55);
  const dir = new THREE.Vector3(0, 0.63, 0.78).normalize();
  const pts = [];
  L.bowls.forEach(([x, z]) => { pts.push(new THREE.Vector3(x - 0.7, 0, z), new THREE.Vector3(x, 0.8, z)); });
  L.dishes.forEach(([x, z]) => { pts.push(new THREE.Vector3(x + 0.7, 0, z), new THREE.Vector3(x, 0, z + 0.7)); });
  pts.push(new THREE.Vector3(0, 0, 1.9), L.bagHome.clone().addScaledVector(L.bagRestDir, 2.2 * L.bagScale).add(new THREE.Vector3(0.3, -0.3, 0.3)));
  pts.push(new THREE.Vector3(L.custWindow.x, 2.6, L.custWindow.z), new THREE.Vector3(L.boxHome.x - 0.8, 1.3, L.boxHome.z));
  camera.fov = 32; camera.aspect = aspect;
  let lo = 5, hi = 60;
  const v = new THREE.Vector3();
  for (let it = 0; it < 24; it++) {
    const d = (lo + hi) / 2;
    camera.position.copy(target).addScaledVector(dir, d);
    camera.lookAt(target);
    camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    let ok = true;
    for (const p of pts) { v.copy(p).project(camera); if (Math.abs(v.x) > 0.95 || Math.abs(v.y) > 0.93) { ok = false; break; } }
    if (ok) hi = d; else lo = d;
  }
  camera.position.copy(target).addScaledVector(dir, hi);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
}
