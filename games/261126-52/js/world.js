// world.js — snowy apron (paintable ground snow), distant airport, props & tools
import * as THREE from 'three';
import { C, tex, setMap, pbr, patch } from './core.js';
import { Field, fbm } from './field.js';
import { paramGeo, snowShellMaterial, addSnowCap } from './plane.js';
import { loft, blobMaterial } from './people.js';

export const GROUND = { x0: -6, z0: -16, size: 24, maxDepth: 0.5, base: 0.24 };
const V3 = THREE.Vector3;

export function buildWorld() {
  const W = {};
  const s = C.scene;
  // ---- concrete apron under the snow (seen where snow is pushed away)
  const conc = pbr('ground', { repeat: [8, 8], roughness: 1 });
  conc.color.setRGB(0.55, 0.56, 0.6);
  patch(conc, { key: 'wetconc', fragment: { roughnessmap_fragment: `$ roughnessFactor *= 0.45; diffuseColor.rgb *= 0.7;` } });
  const base = new THREE.Mesh(new THREE.PlaneGeometry(GROUND.size, GROUND.size).rotateX(-Math.PI / 2), conc);
  base.position.set(GROUND.x0 + GROUND.size / 2, 0, GROUND.z0 + GROUND.size / 2);
  base.receiveShadow = true; s.add(base);
  // ---- paintable snow layer over the patch
  const gf = new Field(384, 384, 1);
  gf.fill(0, (u, v) => {
    const x = GROUND.x0 + u * GROUND.size, z = GROUND.z0 + v * GROUND.size;
    let d = GROUND.base + (fbm(u * 9, v * 9, 31) - 0.5) * 0.08 + (fbm(u * 3, v * 3, 33) - 0.5) * 0.08;
    // wind drifts against the plane's belly & wheels
    const dw = Math.exp(-((z + 0.2) ** 2) / 2.5) * (x > -7.5 && x < 7.5 ? 1 : 0) * 0.12;
    d += dw;
    // fade to base at the edge (matches the outer plain)
    const e = Math.min(u, v, 1 - u, 1 - v);
    return d * Math.min(1, e * 20) + GROUND.base * (1 - Math.min(1, e * 20));
  });
  const gfn = (u, v, o) => o.set(GROUND.x0 + u * GROUND.size, 0, GROUND.z0 + v * GROUND.size);
  const gm = snowShellMaterial(gf, GROUND.maxDepth, [9, 9]);
  gm.userData.u.cut.value = 0.03;
  const gmesh = new THREE.Mesh(paramGeo(gfn, 192, 192, { flip: true }), gm);
  gmesh.receiveShadow = true; gmesh.castShadow = false; gmesh.name = 'groundSnow';
  s.add(gmesh);
  W.groundField = gf; W.groundMesh = gmesh;
  W.groundY = (x, z) => {
    const u = (x - GROUND.x0) / GROUND.size, v = (z - GROUND.z0) / GROUND.size;
    if (u < 0 || v < 0 || u > 1 || v > 1) return GROUND.base * GROUND.maxDepth;
    return gf.get(0, u, v) * GROUND.maxDepth;
  };
  W.groundUV = (x, z) => [(x - GROUND.x0) / GROUND.size, (z - GROUND.z0) / GROUND.size];
  // ---- outer snow plain (with a hole for the patch)
  const sh = new THREE.Shape();
  sh.moveTo(-600, -600); sh.lineTo(600, -600); sh.lineTo(600, 600); sh.lineTo(-600, 600); sh.lineTo(-600, -600);
  const hole = new THREE.Path();
  hole.moveTo(GROUND.x0, GROUND.z0); hole.lineTo(GROUND.x0, GROUND.z0 + GROUND.size); hole.lineTo(GROUND.x0 + GROUND.size, GROUND.z0 + GROUND.size); hole.lineTo(GROUND.x0 + GROUND.size, GROUND.z0); hole.lineTo(GROUND.x0, GROUND.z0);
  sh.holes.push(hole);
  const og = new THREE.ShapeGeometry(sh, 4);
  og.rotateX(Math.PI / 2);
  // uv in metres / 3
  const pa = og.attributes.position, uv = og.attributes.uv;
  for (let i = 0; i < pa.count; i++) uv.setXY(i, pa.getX(i) / 3, pa.getZ(i) / 3);
  const om = pbr('snow', { repeat: [1, 1], roughness: 1 });
  om.color.setRGB(0.96, 0.97, 1.0);
  om.side = THREE.DoubleSide;
  const outer = new THREE.Mesh(og, om);
  outer.position.y = GROUND.base * GROUND.maxDepth; outer.receiveShadow = true;
  s.add(outer);
  // a ploughed taxiway lane (darker, packed) leading away east for the departure
  const laneMat = pbr('ground', { repeat: [3, 40], roughness: 1 });
  laneMat.color.setRGB(0.42, 0.44, 0.5);
  patch(laneMat, { key: 'lane', fragment: { roughnessmap_fragment: `$ roughnessFactor *= 0.5;` } });
  const lane = new THREE.Mesh(new THREE.PlaneGeometry(14, 400).rotateX(-Math.PI / 2), laneMat);
  lane.position.set(40, 0.125, -60); lane.rotation.y = 0.0; lane.receiveShadow = true;
  // (runway is far ahead; lane only visible in the departure shot)
  s.add(lane);
  W.lane = lane;

  // ---- distant tree line, airport buildings, light masts, taxiway lights
  const treeTex = tex('trees.png', { srgb: true });
  treeTex.wrapS = THREE.RepeatWrapping; treeTex.repeat.set(5, 1);
  const treeMat = new THREE.MeshStandardMaterial({ map: treeTex, transparent: true, alphaTest: 0.35, roughness: 1, fog: true, color: 0x8a95a8 });
  setMap(treeMat, 'map', treeTex);
  const trees = new THREE.Mesh(new THREE.CylinderGeometry(330, 330, 34, 96, 1, true), treeMat);
  trees.position.y = 16.5; trees.material.side = THREE.BackSide;
  s.add(trees);
  const trees2 = new THREE.Mesh(new THREE.CylinderGeometry(250, 250, 26, 96, 1, true), treeMat.clone());
  trees2.material.map = treeTex.clone(); trees2.material.map.repeat.set(4, 1); trees2.material.map.offset.x = 0.37;
  setMap(trees2.material, 'map', trees2.material.map);
  trees2.position.y = 12.5; trees2.material.side = THREE.BackSide; trees2.rotation.y = 1.3;
  s.add(trees2);
  // terminal + hangar (simple masses, far, lit windows)
  const bldMat = pbr('paint', { color: 0x6d7580, repeat: [20, 4], roughness: 1 });
  addSnowCap(bldMat, 0.4);
  const winMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffc98a, emissiveIntensity: 3 });
  const mk = (w, h, d, x, z, ry = 0) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bldMat); b.position.set(x, h / 2, z); b.rotation.y = ry; s.add(b);
    const stripe = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, h * 0.18), winMat);
    stripe.position.set(0, h * 0.1, d / 2 + 0.05); b.add(stripe);
    return b;
  };
  mk(90, 12, 22, -60, 110, 0.1);
  mk(40, 18, 30, 70, 120, -0.15);
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.2, 30, 16), bldMat); tower.position.set(10, 15, 150); s.add(tower);
  const cab = new THREE.Mesh(new THREE.CylinderGeometry(5, 4, 5, 12), new THREE.MeshStandardMaterial({ color: 0x0a0f18, emissive: 0x7aa2d6, emissiveIntensity: 0.8, roughness: 0.2 }));
  cab.position.set(10, 32, 150); s.add(cab);
  // light masts (glowing lamp heads -> bloom)
  const lampMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.9, 0.75).multiplyScalar(30) });
  const poleMat = pbr('metal', { color: 0x666b70, metalness: 1, roughness: 1, metalMap: true });
  W.lamps = [];
  for (const [x, z] of [[-30, -32], [26, -40], [-38, 28], [36, 30], [-70, -80], [80, -60]]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, 24, 8), poleMat); pole.position.set(x, 12, z); s.add(pole);
    for (let k = 0; k < 4; k++) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.25), lampMat);
      l.position.set(x + (k - 1.5) * 1.0, 24.2, z); l.lookAt(0, 0, 0); s.add(l); W.lamps.push(l);
    }
  }
  // blue taxiway edge lights + white/green runway lights far ahead
  const blue = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.25, 0.45, 1).multiplyScalar(18) });
  const green = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3, 1, 0.5).multiplyScalar(14) });
  const white = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.95, 0.85).multiplyScalar(16) });
  const lg = new THREE.SphereGeometry(0.09, 6, 4);
  const inst = (mat, pts) => {
    const m = new THREE.InstancedMesh(lg, mat, pts.length);
    const o = new THREE.Object3D();
    pts.forEach((p, i) => { o.position.set(p[0], 0.35, p[1]); o.updateMatrix(); m.setMatrixAt(i, o.matrix); });
    s.add(m); return m;
  };
  const bl = [], gr = [], wh = [];
  for (let i = 0; i < 40; i++) { bl.push([33, -10 - i * 9]); bl.push([47, -10 - i * 9]); }
  for (let i = 0; i < 26; i++) { bl.push([-8 + i * 2.2 * 2, 18]); }
  for (let i = 0; i < 120; i++) { wh.push([-200 + i * 6, -260]); wh.push([-200 + i * 6, -300]); }
  for (let i = 0; i < 30; i++) gr.push([40, -12 - i * 12]);
  inst(blue, bl); inst(green, gr); inst(white, wh);

  // ---- props
  const metal = pbr('metal', { color: 0xc5cacf, metalness: 1, roughness: 1, metalMap: true });
  const yellow = pbr('paint', { color: 0xb88a2a, repeat: [2, 2], roughness: 1 });
  addSnowCap(yellow, 0.05); addSnowCap(metal, 0.04);
  W.mats = { metal, yellow };
  // maintenance step stand (2 steps + rails) — the girl stands on it in scene 1
  {
    const g = new THREE.Group();
    const tread = (y, z) => { const t = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.035, 0.26), yellow); t.position.set(0, y, z); t.castShadow = t.receiveShadow = true; g.add(t); };
    tread(0.22, 0.12); tread(0.44, -0.08);
    for (const x of [-0.3, 0.3]) {
      for (const [z0, z1] of [[0.28, -0.22]]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 8), metal); leg.position.set(x, 0.24, z0); g.add(leg);
        const leg2 = leg.clone(); leg2.position.z = z1; g.add(leg2);
      }
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.75, 8), metal); rail.position.set(x, 0.82, -0.2); g.add(rail);
      const rt = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8), metal); rt.rotation.x = Math.PI / 2; rt.position.set(x, 1.19, -0.04); g.add(rt);
    }
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.8).rotateX(-Math.PI / 2), blobMaterial()); blob.position.y = 0.13; g.add(blob);
    W.step = g; s.add(g);
  }
  // snow brush: telescopic pole + head with bristles
  {
    const g = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.0, 10), metal); pole.position.y = 0.5; g.add(pole);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.22, 10), pbr('rubber', { color: 0x202224, repeat: [1, 1], roughness: 1 })); grip.position.y = 0.11; g.add(grip);
    const head = new THREE.Group(); head.position.y = 1.0; g.add(head);
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.07), pbr('paint', { color: 0x2b4a7a, repeat: [1, 1], roughness: 1 }));
    block.position.y = 0.0; head.add(block);
    const bg = new THREE.CylinderGeometry(0.004, 0.003, 0.09, 4);
    const bm = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.7 });
    const n = 140, inst2 = new THREE.InstancedMesh(bg, bm, n);
    const o = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
      o.position.set((Math.random() - .5) * 0.34, 0.07, (Math.random() - .5) * 0.055);
      o.rotation.set((Math.random() - .5) * 0.25, 0, (Math.random() - .5) * 0.25); o.updateMatrix(); inst2.setMatrixAt(i, o.matrix);
    }
    head.add(inst2);
    W.brush = { g, head, pole };
    g.visible = false; s.add(g);
  }
  // hot / cold spray cart with two tanks, lances and hoses
  {
    const cart = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.6), metal); frame.position.y = 0.28; cart.add(frame);
    const tire = pbr('rubber', { color: 0x1a1a1a, repeat: [3, 1], roughness: 1 });
    for (const [x, z] of [[-0.42, -0.3], [0.42, -0.3], [-0.42, 0.3], [0.42, 0.3]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 18).rotateX(Math.PI / 2), tire); w.position.set(x, 0.12, z); cart.add(w); }
    const tanks = [];
    for (const [x, col, hot] of [[-0.24, 0xa03a2c, true], [0.24, 0x2f5f8f, false]]) {
      const tm = pbr('paint', { color: col, repeat: [2, 2], physical: true, clearcoat: 0.6, roughness: 1 });
      addSnowCap(tm, 0.03);
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.62, 28), tm); tank.position.set(x, 0.62, 0); tank.castShadow = true; cart.add(tank);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), tm); dome.position.set(x, 0.93, 0); cart.add(dome);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 14), metal); cap.position.set(x, 1.13, 0); cart.add(cap);
      const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 20).rotateX(Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0xf0f0f0, roughness: 0.1, clearcoat: 1 }));
      gauge.position.set(x, 0.8, 0.205); cart.add(gauge);
      // pictogram plate: flame (hot) or snowflake (cold), no text
      const pc = document.createElement('canvas'); pc.width = pc.height = 128; const g = pc.getContext('2d');
      g.fillStyle = '#f2efe8'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill();
      if (hot) {
        g.fillStyle = '#c4462c'; g.beginPath(); g.moveTo(64, 18); g.bezierCurveTo(100, 55, 98, 108, 64, 110); g.bezierCurveTo(30, 108, 28, 70, 52, 50); g.bezierCurveTo(52, 70, 60, 74, 64, 70); g.bezierCurveTo(62, 50, 70, 35, 64, 18); g.fill();
      } else {
        g.strokeStyle = '#2f6aa8'; g.lineWidth = 9; g.lineCap = 'round';
        for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; g.beginPath(); g.moveTo(64 - Math.cos(a) * 42, 64 - Math.sin(a) * 42); g.lineTo(64 + Math.cos(a) * 42, 64 + Math.sin(a) * 42); g.stroke(); }
      }
      const pt = new THREE.CanvasTexture(pc); pt.colorSpace = THREE.SRGBColorSpace;
      const plate = new THREE.Mesh(new THREE.CircleGeometry(0.09, 24), new THREE.MeshStandardMaterial({ map: pt, roughness: 0.5 }));
      plate.position.set(x, 0.58, 0.203); cart.add(plate);
      tanks.push({ mesh: tank, hot, x, top: new V3(x, 1.16, 0) });
    }
    cart.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const blob = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.0).rotateX(-Math.PI / 2), blobMaterial()); blob.position.y = 0.13; cart.add(blob);
    W.cart = { g: cart, tanks };
    s.add(cart);
    // lance (held by the girl): wand + trigger grip + nozzle
    const lance = new THREE.Group();
    const wand = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.7, 8), metal); wand.position.y = 0.35; lance.add(wand);
    const gripM = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.15, 10), pbr('rubber', { color: 0x222222, repeat: [1, 1], roughness: 1 })); gripM.position.y = 0.06; lance.add(gripM);
    const noz = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.06, 10), new THREE.MeshStandardMaterial({ color: 0xb08d3a, metalness: 1, roughness: 0.3 })); noz.position.y = 0.72; lance.add(noz);
    lance.visible = false; s.add(lance);
    W.lance = { g: lance, tip: new V3(0, 0.75, 0) };
    // hose: rebuilt every frame from a sagging curve
    const hoseMat = pbr('rubber', { color: 0x2a2a2c, repeat: [20, 1], roughness: 1, n: false });
    W.hose = new THREE.Mesh(new THREE.BufferGeometry(), hoseMat); W.hose.castShadow = true; s.add(W.hose); W.hose.visible = false;
  }
  // battery work light on a tripod: LED panel + spot light
  {
    const g = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const a = i / 3 * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.7, 6), metal);
      leg.position.set(Math.cos(a) * 0.25, 0.8, Math.sin(a) * 0.25); leg.rotation.set(Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3); g.add(leg);
    }
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.24, 0.08), pbr('paint', { color: 0x2b2d30, repeat: [1, 1], roughness: 1 })); head.position.y = 1.7; g.add(head);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.85, 0.65).multiplyScalar(14) })); face.position.set(0, 1.7, 0.041); g.add(face);
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    W.worklight = { g, head: face };
    s.add(g);
  }
  // picture sign (rule board): hot spray melts the ice (○), cold spray freezes (×). Pictograms only.
  {
    const cv = document.createElement('canvas'); cv.width = 512; cv.height = 640; const g = cv.getContext('2d');
    g.fillStyle = '#e9e4d8'; g.fillRect(0, 0, 512, 640);
    g.strokeStyle = '#3a3f46'; g.lineWidth = 10; g.strokeRect(8, 8, 496, 624);
    const can = (x, y, col, hot) => {
      g.fillStyle = col; g.fillRect(x - 30, y - 50, 60, 100); g.beginPath(); g.arc(x, y - 50, 30, Math.PI, 0); g.fill();
      g.fillStyle = '#555'; g.fillRect(x + 25, y - 60, 40, 10);
      if (hot) { g.strokeStyle = 'rgba(120,120,120,0.8)'; g.lineWidth = 5; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(x - 15 + i * 15, y - 90); g.bezierCurveTo(x - 25 + i * 15, y - 110, x - 5 + i * 15, y - 120, x - 15 + i * 15, y - 140); g.stroke(); } }
      // spray lines
      g.strokeStyle = hot ? '#6ab0e0' : '#9fd0ff'; g.lineWidth = 4;
      for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(x + 70, y - 55); g.lineTo(x + 130, y - 55 + i * 22); g.stroke(); }
    };
    const wing = (x, y, iced) => {
      g.fillStyle = '#cfd5dc'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 150, y - 20); g.lineTo(x + 160, y + 10); g.lineTo(x, y + 30); g.fill();
      if (iced) { g.fillStyle = '#ffffff'; g.fillRect(x + 10, y - 12, 130, 12); }
      else { g.fillStyle = '#5aa0d8'; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(x + 30 + i * 30, y + 40 + (i % 2) * 8, 6, 0, 7); g.fill(); } }
    };
    // row 1 : red can -> wing clear -> ○
    can(80, 200, '#a03a2c', true); wing(230, 150, false);
    g.strokeStyle = '#2f8a4a'; g.lineWidth = 14; g.beginPath(); g.arc(440, 250, 38, 0, 7); g.stroke();
    // row 2 : blue can -> frozen snowman-ish face -> ×
    can(80, 470, '#2f5f8f', false);
    g.fillStyle = '#dfe9f4'; g.beginPath(); g.arc(300, 460, 55, 0, 7); g.fill();
    g.fillStyle = '#334'; g.beginPath(); g.arc(282, 450, 6, 0, 7); g.arc(318, 450, 6, 0, 7); g.fill();
    g.strokeStyle = '#334'; g.lineWidth = 4; g.beginPath(); for (let i = 0; i < 6; i++) g.lineTo(280 + i * 8, 485 + (i % 2) * 6); g.stroke();
    g.fillStyle = '#ffffff'; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(250 + i * 25, 405); g.lineTo(256 + i * 25, 405); g.lineTo(253 + i * 25, 425 + (i % 2) * 8); g.fill(); }
    g.strokeStyle = '#b03a2e'; g.lineWidth = 14; g.beginPath(); g.moveTo(410, 430); g.lineTo(470, 490); g.moveTo(470, 430); g.lineTo(410, 490); g.stroke();
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    const sign = new THREE.Group();
    const boardMat = new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 });
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.7, 0.025), [metal, metal, metal, metal, boardMat, metal]);
    board.position.y = 0.95; board.castShadow = true; sign.add(board);
    for (const x of [-0.25, 0.25]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.95, 8), metal); leg.position.set(x, 0.47, -0.02); sign.add(leg); }
    const snowTop = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.04, 0.05), pbr('snow', { repeat: [1, 1], roughness: 1 })); snowTop.position.y = 1.32; sign.add(snowTop);
    W.sign = sign; s.add(sign);
  }
  // marshalling wands (glowing)
  {
    W.wands = [];
    for (let i = 0; i < 2; i++) {
      const g = new THREE.Group();
      const h = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.12, 10), pbr('rubber', { color: 0x1d1d1f, repeat: [1, 1], roughness: 1 }));
      h.position.y = 0.06; g.add(h);
      const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.36, 12), new THREE.MeshStandardMaterial({ color: 0x401000, emissive: 0xff5a14, emissiveIntensity: 6, roughness: 0.3 }));
      glow.position.y = 0.3; g.add(glow);
      g.visible = false; s.add(g); W.wands.push(g);
    }
    W.wandLight = new THREE.PointLight(0xff6a20, 0, 4, 2); s.add(W.wandLight);
  }
  // chocks + cones (props of a real apron)
  {
    const coneMat = pbr('paint', { color: 0xb5532a, repeat: [1, 1], roughness: 1 });
    addSnowCap(coneMat, 0.03);
    W.cones = [];
    for (const [x, z] of [[9.2, -2.2], [9.4, 2.2], [-8.7, -0.8]]) {
      const c = new THREE.Group();
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.7, 20, 1, true), coneMat); cone.position.y = 0.37; c.add(cone);
      const bandM = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.11, 0.1, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0xd0d4d8, metalness: 0.8, roughness: 0.3 })); bandM.position.y = 0.45; c.add(bandM);
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.4), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })); b.position.y = 0.14; c.add(b);
      c.position.set(x, 0, z); c.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      s.add(c); W.cones.push(c);
    }
  }
  return W;
}

/** jacket on a hanger + earmuffs on a hook: a small clothes rack beside the plane (title) */
export function buildRack(girl) {
  const s = C.scene;
  const g = new THREE.Group();
  const metal = pbr('metal', { color: 0xbfc4c9, metalness: 1, roughness: 1, metalMap: true });
  for (const x of [-0.45, 0.45]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.45, 8), metal); p.position.set(x, 0.85, 0); g.add(p);
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8), metal); f.rotation.x = Math.PI / 2; f.position.set(x, 0.14, 0); g.add(f);
  }
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.92, 8), metal); bar.rotation.z = Math.PI / 2; bar.position.y = 1.56; g.add(bar);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  // hanging jacket: clone the girl's jacket torso + sleeves
  const jk = new THREE.Group();
  const parts = girl.jacketParts;
  const torso = parts.find((m) => m.parent === girl.joints.spine && m.material === girl.mats.jacket);
  const t = new THREE.Mesh(torso.geometry, girl.mats.jacket); t.castShadow = true; jk.add(t);
  for (const sx of [-1, 1]) {
    const arm = new THREE.Mesh(girl.arms[sx < 0 ? 0 : 1].sh.children.find((c) => c.isMesh && c.material === girl.mats.jacket).geometry, girl.mats.jacket);
    arm.position.set(sx * girl.S.shW, girl.S.torsoLen * 0.55, 0); arm.rotation.z = sx * 0.12; jk.add(arm);
    const fa = new THREE.Mesh(girl.arms[sx < 0 ? 0 : 1].elbow.children.find((c) => c.isMesh && c.material === girl.mats.jacket).geometry, girl.mats.jacket);
    fa.position.set(sx * girl.S.shW + sx * 0.02, girl.S.torsoLen * 0.55 - girl.S.upArm, 0); jk.add(fa);
  }
  for (const b of parts.filter((m) => m.material === girl.mats.reflect && m.parent === girl.joints.spine)) { const c = new THREE.Mesh(b.geometry, b.material); jk.add(c); }
  const hanger = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.006, 6, 20, Math.PI), metal); hanger.position.y = girl.S.neckY - 0.01; jk.add(hanger);
  jk.position.set(-0.15, 1.56 - girl.S.neckY - 0.03, 0);
  g.add(jk);
  // earmuffs hanging on a hook at the right
  const muffs = girl.muffs.clone(true);
  muffs.position.set(0.3, 1.42, 0.03); muffs.rotation.z = 0.2; muffs.scale.setScalar(1.0);
  g.add(muffs);
  s.add(g);
  return { g, jacket: jk, muffs };
}
