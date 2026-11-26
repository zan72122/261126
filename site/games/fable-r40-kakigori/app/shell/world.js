// 場面（hero 以外）：カウンター・遠景・かき氷機・ボトル・飾りの皿・棚・疑似影・光の輪・ハート。
// 座標：メートル、カウンター天板 y=0、+x 右、+z 手前（子ども側）。docs/HERO-SPEC.md と同じ。
import * as THREE from '../vendor/three.module.min.js';
import { mergeParts } from './util.js';

export const LAYOUT = {
  spout: new THREE.Vector3(0, 0.40, -0.02),
  bowlHome: new THREE.Vector3(0, 0, 0.0),
  bowlEnter: new THREE.Vector3(-0.95, 0, 0.06),
  // 器の作業域（機械の下）。カメラを器へ寄せたので、ボトル・飾りの皿・棚を器の近くへ詰めてある
  work: { x0: -0.12, x1: 0.10, z0: -0.12, z1: 0.11 },
  column: new THREE.Vector3(0.24, 0, -0.28),
  give: new THREE.Vector3(-0.38, 0, -0.215),
  giveRadius: 0.13,
  customerFront: new THREE.Vector3(-0.38, 0.03, -0.50),
  queue: [new THREE.Vector3(-0.70, 0.03, -0.72), new THREE.Vector3(-1.0, 0.03, -0.90)],
  exit: new THREE.Vector3(-1.5, 0.03, -0.48),
  // ボトル（赤・緑・青・黄・練乳）と飾りの皿は「画面の端のトレー」：置き場所は毎フレーム、画面の端の決まった所から
  // 台の上へ写して決める（game.js の layoutTrays）。ここの値は最初の1フレーム用
  bottleStart: new THREE.Vector3(0.255, 0, -0.06), bottleDir: new THREE.Vector3(1, 0, 0), bottleGap: 0.058,
  tray: new THREE.Vector3(-0.33, 0, 0.12),
  shelfX: 0.50, shelfZ: -0.70, shelfScale: 0.5,
  shelfSlots: [
    [0.38, 0.2475, -0.70], [0.50, 0.2475, -0.70], [0.62, 0.2475, -0.70],
    [0.38, 0.0075, -0.70], [0.50, 0.0075, -0.70], [0.62, 0.0075, -0.70],
  ].map((a) => new THREE.Vector3(...a)),
  counter: { x0: -0.9, x1: 0.9, z0: -0.35, z1: 0.35 },
};

export const SYRUPS = [
  { id: 'red', color: [0.93, 0.13, 0.22], hex: 0xe8203a, kind: 'syrup' },
  { id: 'green', color: [0.30, 0.80, 0.25], hex: 0x4dcc40, kind: 'syrup' },
  { id: 'blue', color: [0.15, 0.52, 0.96], hex: 0x2685f5, kind: 'syrup' },
  { id: 'yellow', color: [1.0, 0.84, 0.10], hex: 0xffd61a, kind: 'syrup' },
  { id: 'milk', color: [0.99, 0.97, 0.90], hex: 0xfff8e6, kind: 'milk' },
];

export function buildWorld(scene, tex, proc) {
  const W = { pick: [], disposables: [] };
  const own = (x) => { W.disposables.push(x); return x; };

  // ---- 光 ----
  const hemi = new THREE.HemisphereLight(0xfff4e8, 0xc9b8a0, 1.35);
  const sun = new THREE.DirectionalLight(0xffffff, 1.7); sun.position.set(0.5, 1.2, 0.7);
  scene.add(hemi, sun);
  scene.background = new THREE.Color(0xf3e6d2);

  // ---- 遠景：店内の写真の板（512²、光の影響なし） ----
  const shopMat = own(new THREE.MeshBasicMaterial({ map: tex.shop, color: 0xf2f2f2 }));
  shopMat.map = tex.shop.clone(); own(shopMat.map); shopMat.map.wrapS = shopMat.map.wrapT = THREE.ClampToEdgeWrapping; shopMat.map.needsUpdate = true;
  const shop = new THREE.Mesh(own(new THREE.PlaneGeometry(3.6, 3.6)), shopMat);
  shop.position.set(0.05, 0.55, -1.7); scene.add(shop);
  // 床（客側）：低ポリの板に木目
  const woodFloor = tex.wood.clone(); own(woodFloor); woodFloor.repeat.set(3, 2); woodFloor.needsUpdate = true;
  const floor = new THREE.Mesh(own(new THREE.PlaneGeometry(3.6, 1.6)), own(new THREE.MeshLambertMaterial({ map: woodFloor, color: 0xb89a7a })));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, -0.42, -1.0); scene.add(floor);

  // ---- カウンター（天板＋前板） ----
  const woodTop = tex.wood.clone(); own(woodTop); woodTop.repeat.set(2.2, 1); woodTop.needsUpdate = true;
  const counterMat = own(new THREE.MeshStandardMaterial({ map: woodTop, roughness: 0.75 }));
  const top = new THREE.Mesh(own(new THREE.BoxGeometry(1.9, 0.04, 0.74)), counterMat);
  top.position.set(0, -0.02, 0); scene.add(top);
  // 手前（子ども側）の天板の続き：引いた構図や縦長でも画面の下に台の切れ目・余白が出ないように
  const woodNear = tex.wood.clone(); own(woodNear); woodNear.repeat.set(3.2, 1.3); woodNear.needsUpdate = true;
  const near = new THREE.Mesh(own(new THREE.PlaneGeometry(2.8, 1.4)), own(new THREE.MeshLambertMaterial({ map: woodNear, color: 0xf2e6d6 })));
  near.rotation.x = -Math.PI / 2; near.position.set(0, -0.0005, 0.98); scene.add(near);
  const front = new THREE.Mesh(own(new THREE.BoxGeometry(1.9, 0.5, 0.03)), own(new THREE.MeshLambertMaterial({ color: 0x9a6a44 })));
  front.position.set(0, -0.29, -0.355); scene.add(front);

  // のれん（上の飾り、Canvas の模様）
  const noren = new THREE.Mesh(own(new THREE.PlaneGeometry(2.4, 0.22, 1, 1)), own(new THREE.MeshLambertMaterial({ map: proc.noren, side: THREE.DoubleSide })));
  proc.noren.repeat.set(4, 1);
  noren.position.set(0, 0.86, -0.95); scene.add(noren);

  // ---- かき氷機 ----
  const enamel = tex.enamel.clone(); own(enamel); enamel.repeat.set(1, 1); enamel.needsUpdate = true;
  const enamelMat = own(new THREE.MeshStandardMaterial({ map: enamel, color: 0xffffff, roughness: 0.38, vertexColors: true }));
  const chromeMat = own(new THREE.MeshStandardMaterial({ color: 0xd8dde3, roughness: 0.3, metalness: 0.35, vertexColors: true }));
  const machine = new THREE.Group(); machine.name = 'machine'; scene.add(machine);
  const S = LAYOUT.spout;
  const C = LAYOUT.column, adx = S.x - C.x, adz = S.z - C.z, alen = Math.hypot(adx, adz);
  const bodyGeo = mergeParts([
    { geo: new THREE.CylinderGeometry(0.07, 0.08, 0.035, 28), color: 0xffffff, pos: [C.x, 0.0175, C.z] },
    { geo: new THREE.CylinderGeometry(0.026, 0.032, 0.52, 18), color: 0xffffff, pos: [C.x, 0.29, C.z] },
    { geo: new THREE.SphereGeometry(0.036, 16, 10), color: 0xffffff, pos: [C.x, 0.55, C.z] },
    { geo: new THREE.BoxGeometry(0.05, 0.04, alen), color: 0xffffff, pos: [C.x + adx / 2, 0.545, C.z + adz / 2], rot: [0, Math.atan2(adx, adz), 0] },
    { geo: new THREE.CylinderGeometry(0.09, 0.08, 0.075, 32), color: 0xffffff, pos: [S.x, S.y + 0.075, S.z] },
    { geo: new THREE.CylinderGeometry(0.095, 0.095, 0.012, 32), color: 0xffffff, pos: [S.x, S.y + 0.116, S.z] },
  ]);
  machine.add(new THREE.Mesh(own(bodyGeo), enamelMat));
  const chromeGeo = mergeParts([
    { geo: new THREE.CylinderGeometry(0.06, 0.016, 0.04, 24, 1, true), color: 0xffffff, pos: [S.x, S.y + 0.02, S.z] },
    { geo: new THREE.CylinderGeometry(0.008, 0.008, 0.12, 10), color: 0xffffff, pos: [S.x, S.y + 0.215, S.z] },
    { geo: new THREE.CylinderGeometry(0.05, 0.05, 0.01, 24), color: 0xffffff, pos: [S.x, S.y + 0.21, S.z] },
    { geo: new THREE.SphereGeometry(0.016, 12, 8), color: 0xe8384f, pos: [S.x, S.y + 0.285, S.z] },
    { geo: new THREE.BoxGeometry(0.07, 0.018, 0.02), color: 0xffffff, pos: [S.x - 0.115, S.y + 0.075, S.z - 0.03] },
  ]);
  machine.add(new THREE.Mesh(own(chromeGeo), chromeMat));
  // 氷の塊（上に見える）
  const iceBlockMat = own(new THREE.MeshStandardMaterial({ map: tex.ice, color: 0xdff3ff, roughness: 0.25, emissive: 0x9fd0ee, emissiveIntensity: 0.25 }));
  const iceBlock = new THREE.Mesh(own(new THREE.BoxGeometry(0.1, 0.07, 0.1)), iceBlockMat);
  iceBlock.position.set(S.x, S.y + 0.155, S.z); machine.add(iceBlock);
  // 車輪（手前を向く、回せる）
  const wheel = new THREE.Group(); wheel.name = 'wheel';
  wheel.position.set(S.x - 0.155, S.y + 0.075, S.z - 0.03);
  const spokes = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    spokes.push({ geo: new THREE.CylinderGeometry(0.006, 0.006, 0.07, 6), color: 0xffffff, pos: [Math.cos(a) * 0.035, Math.sin(a) * 0.035, 0], rot: [0, 0, a - Math.PI / 2] });
  }
  const wheelGeo = mergeParts([
    { geo: new THREE.TorusGeometry(0.072, 0.009, 8, 40), color: 0xffffff },
    { geo: new THREE.CylinderGeometry(0.016, 0.016, 0.03, 16), color: 0xffffff, rot: [Math.PI / 2, 0, 0] },
    ...spokes,
  ]);
  wheel.add(new THREE.Mesh(own(wheelGeo), enamelMat));
  const knob = new THREE.Mesh(own(mergeParts([
    { geo: new THREE.CylinderGeometry(0.006, 0.006, 0.03, 8), color: 0xd8dde3, rot: [Math.PI / 2, 0, 0], pos: [0, 0, 0.015] },
    { geo: new THREE.SphereGeometry(0.016, 14, 10), color: 0xe8384f, pos: [0, 0, 0.035], scale: [1, 1, 1.25] },
  ])), chromeMat);
  knob.position.set(-0.072, 0, 0); wheel.add(knob);
  machine.add(wheel);
  const wheelPick = new THREE.Mesh(own(new THREE.SphereGeometry(0.11, 8, 6)), own(new THREE.MeshBasicMaterial({ visible: false })));
  wheelPick.userData.kind = 'wheel'; wheel.add(wheelPick); W.pick.push(wheelPick);
  const machinePick = new THREE.Mesh(own(new THREE.BoxGeometry(0.2, 0.16, 0.2)), wheelPick.material);
  machinePick.position.set(S.x, S.y + 0.12, S.z); machinePick.userData.kind = 'wheel'; machine.add(machinePick); W.pick.push(machinePick);
  W.machine = machine; W.wheel = wheel; W.iceBlock = iceBlock; W.enamelMat = enamelMat;

  // ---- ボトル（口が原点、体は下へ。注ぐ時は口を中心に回す） ----
  const bottleProfile = [[0, -0.14], [0.021, -0.14], [0.026, -0.132], [0.026, -0.06], [0.022, -0.042], [0.009, -0.03], [0.009, -0.014], [0.005, -0.004], [0.003, 0]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const bottleGeo = own(new THREE.LatheGeometry(bottleProfile, 20));
  const nozzleGeo = own(new THREE.CylinderGeometry(0.0095, 0.0095, 0.012, 14)); nozzleGeo.translate(0, -0.02, 0);
  const capMat = own(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
  const tubeGeo = own(new THREE.CylinderGeometry(0.03, 0.02, 0.12, 18)); tubeGeo.translate(0, -0.075, 0); tubeGeo.scale(1.15, 1, 0.65);
  W.bottles = SYRUPS.map((s, i) => {
    const g = new THREE.Group(); g.name = 'bottle-' + s.id;
    const mat = own(new THREE.MeshStandardMaterial({ color: s.hex, roughness: 0.18, emissive: s.hex, emissiveIntensity: 0.12 }));
    if (s.kind === 'milk') {
      g.add(new THREE.Mesh(tubeGeo, mat));
      const capG = own(new THREE.CylinderGeometry(0.012, 0.014, 0.016, 14)); capG.translate(0, -0.012, 0);
      g.add(new THREE.Mesh(capG, own(new THREE.MeshStandardMaterial({ color: 0x3a7be0, roughness: 0.4 }))));
    } else {
      g.add(new THREE.Mesh(bottleGeo, mat));
      g.add(new THREE.Mesh(nozzleGeo, capMat));
    }
    const pick = new THREE.Mesh(own(new THREE.CylinderGeometry(0.04, 0.04, 0.19, 8)), wheelPick.material);
    pick.position.y = -0.08; pick.userData.kind = 'bottle'; pick.userData.index = i; g.add(pick); W.pick.push(pick);
    const home = LAYOUT.bottleStart.clone().addScaledVector(LAYOUT.bottleDir, LAYOUT.bottleGap * i); home.y = 0.155;
    g.position.copy(home); scene.add(g);
    return { syrup: s, group: g, mat, home, state: 'home', t: 0, tilt: 0, rate: 0, target: new THREE.Vector3(), pointer: null, hopT: 9 };
  });
  // ボトル台：1本ずつの丸い木の台（1つの InstancedMesh）。ボトルは画面の端のトレーに並ぶので、台も毎フレームそこへ動かす
  const coasterMat = own(new THREE.MeshStandardMaterial({ map: woodTop, color: 0xd9b38c, roughness: 0.7 }));
  const coasters = new THREE.InstancedMesh(own(new THREE.CylinderGeometry(0.036, 0.039, 0.015, 24)), coasterMat, SYRUPS.length);
  coasters.frustumCulled = false; coasters.count = SYRUPS.length; scene.add(coasters);
  W.coasters = coasters;

  // ---- 飾り：形を共有、器の上では InstancedMesh ----
  const topMat = own(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35 })); topMat.userData.shared = true;
  const toppingGeos = {
    cherry: mergeParts([
      { geo: new THREE.SphereGeometry(0.012, 14, 10), color: 0xd8102c, pos: [0, 0.011, 0] },
      { geo: new THREE.CylinderGeometry(0.0013, 0.0013, 0.028, 5), color: 0x5c7a24, pos: [0.004, 0.032, 0], rot: [0, 0, -0.35] },
    ]),
    shiratama: mergeParts([
      { geo: new THREE.SphereGeometry(0.0115, 14, 10), color: 0xfffdf8, pos: [0, 0.009, 0], scale: [1, 0.78, 1] },
    ]),
    mikan: mergeParts([
      { geo: new THREE.SphereGeometry(0.0125, 14, 10), color: 0xffa21f, pos: [0, 0.008, 0], scale: [1, 0.72, 1] },
      { geo: new THREE.CylinderGeometry(0.003, 0.003, 0.003, 6), color: 0x6a9a2a, pos: [0, 0.0172, 0] },
    ]),
  };
  for (const k in toppingGeos) { toppingGeos[k].userData.shared = true; own(toppingGeos[k]); }
  W.toppingGeos = toppingGeos; W.toppingMat = topMat;
  W.toppingKinds = ['cherry', 'shiratama', 'mikan'];
  // 皿
  const dishProfile = [[0, 0], [0.07, 0], [0.085, 0.012], [0.088, 0.016], [0.08, 0.012], [0, 0.006]].map(([x, y]) => new THREE.Vector2(x, y));
  const dish = new THREE.Mesh(own(new THREE.LatheGeometry(dishProfile, 32)), own(new THREE.MeshStandardMaterial({ color: 0xfff3e0, roughness: 0.4 })));
  dish.position.copy(LAYOUT.tray); scene.add(dish); W.dish = dish;
  W.piles = W.toppingKinds.map((kind, i) => {
    const a = -Math.PI / 2 + (i / 3) * Math.PI * 2 + 0.4;
    const off = new THREE.Vector3(Math.cos(a) * 0.042, 0.008, Math.sin(a) * 0.042); // 皿の中心からのずれ
    const g = new THREE.Group(); g.position.copy(LAYOUT.tray).add(off); scene.add(g);
    for (let j = 0; j < 3; j++) {
      const m = new THREE.Mesh(toppingGeos[kind], topMat);
      const b = (j / 3) * Math.PI * 2; m.position.set(Math.cos(b) * 0.012, j === 2 ? 0.006 : 0, Math.sin(b) * 0.012); m.rotation.y = b;
      g.add(m);
    }
    const pick = new THREE.Mesh(own(new THREE.SphereGeometry(0.04, 8, 6)), wheelPick.material);
    pick.userData.kind = 'pile'; pick.userData.index = i; g.add(pick); W.pick.push(pick);
    return { kind, group: g, off, hopT: 9 };
  });

  // ---- 店先の棚（遠景、木目） ----
  const shelfMat = own(new THREE.MeshStandardMaterial({ map: woodTop, color: 0xf0d8b8, roughness: 0.8, vertexColors: true }));
  const SX = LAYOUT.shelfX, SZ = LAYOUT.shelfZ, SW = 0.385;
  const shelfGeo = mergeParts([
    { geo: new THREE.BoxGeometry(SW, 0.015, 0.15), color: 0xffffff, pos: [SX, 0.0, SZ] },
    { geo: new THREE.BoxGeometry(SW, 0.015, 0.15), color: 0xffffff, pos: [SX, 0.24, SZ] },
    { geo: new THREE.BoxGeometry(SW, 0.015, 0.15), color: 0xffffff, pos: [SX, 0.48, SZ] },
    { geo: new THREE.BoxGeometry(0.015, 0.9, 0.15), color: 0xffffff, pos: [SX - SW / 2, 0.0, SZ] },
    { geo: new THREE.BoxGeometry(0.015, 0.9, 0.15), color: 0xffffff, pos: [SX + SW / 2, 0.0, SZ] },
    { geo: new THREE.BoxGeometry(SW, 0.9, 0.01), color: 0xd8c0a0, pos: [SX, 0.0, SZ - 0.075] },
  ]);
  const shelf = new THREE.Mesh(own(shelfGeo), shelfMat); scene.add(shelf);

  // ---- 疑似影（1つの InstancedMesh） ----
  const blobMat = own(new THREE.MeshBasicMaterial({ map: proc.blob, transparent: true, depthWrite: false }));
  const blobGeo = own(new THREE.PlaneGeometry(1, 1)); blobGeo.rotateX(-Math.PI / 2);
  const blobs = new THREE.InstancedMesh(blobGeo, blobMat, 24); blobs.count = 0; blobs.frustumCulled = false; blobs.renderOrder = 1; scene.add(blobs);
  W.blobs = blobs;

  // ---- 光の輪（ヒント用、加算） ----
  const glowMat = own(new THREE.MeshBasicMaterial({ map: proc.glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  const glowGeo = own(new THREE.PlaneGeometry(1, 1)); glowGeo.rotateX(-Math.PI / 2);
  W.glow = new THREE.Mesh(glowGeo, glowMat); W.glow.renderOrder = 2; W.glow.position.y = 0.003; scene.add(W.glow);
  // 渡す所の光（ヒント：お客さんの前へ持っていけばいい、が見える）。形・テクスチャは共有
  W.giveGlow = new THREE.Mesh(glowGeo, own(glowMat.clone())); W.giveGlow.renderOrder = 2; W.giveGlow.visible = false;
  W.giveGlow.position.set(LAYOUT.give.x, 0.003, LAYOUT.give.z); scene.add(W.giveGlow);

  // ---- ハート（1つの InstancedMesh、カメラを向く） ----
  const heartMat = own(new THREE.MeshBasicMaterial({ map: proc.heart, transparent: true, depthWrite: false }));
  const hearts = new THREE.InstancedMesh(own(new THREE.PlaneGeometry(0.05, 0.05)), heartMat, 16);
  hearts.count = 0; hearts.frustumCulled = false; hearts.renderOrder = 3; scene.add(hearts);
  W.hearts = hearts;

  return W;
}
