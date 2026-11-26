// The little white-and-brown patisserie: real-size room, counters, window, props.
import * as THREE from 'three';
import { pbr, tex, roundedBox, contactShadow, lathe, rnd } from './util.js';
import { kelvin } from './env.js';

export const COUNTER_Y = 0.9;
export const CZ = -0.3;                                           // counter centre line
export const WORK = new THREE.Vector3(0, COUNTER_Y, -0.42);     // turntable spot (near the girl's side)
export const CASE_X = [1.22, 1.6, 1.98];                         // showcase slots

const M = {};
function mats() {
  if (M.walnut) return M;
  M.walnut = pbr('walnut', { repeat: [1.2, 1.2], roughness: 0.5 });
  M.walnutV = pbr('walnut', { repeat: [1.2, 1.2], roughness: 0.5 }); // vertical boards
  M.marble = pbr('marble', { repeat: [0.8, 0.8], roughness: 0.2 });
  M.floor = pbr('oakfloor', { repeat: [0.55, 0.55], roughness: 0.55 });
  M.plaster = pbr('plaster', { repeat: [0.7, 0.7], roughness: 0.9, color: 0xfbf7f0 });
  M.tile = pbr('tile', { repeat: [3.3, 3.3], roughness: 0.2 });
  M.steel = pbr('steel', { repeat: [2, 2], metalness: 1, roughness: 0.3, color: 0xdfe2e6 });
  M.steelDark = pbr('steel', { repeat: [2, 2], metalness: 1, roughness: 0.35, color: 0x9da1a6 });
  M.brass = pbr('steel', { repeat: [2, 2], metalness: 1, roughness: 0.32, color: 0xc89d5c, noColorMap: true });
  M.linen = pbr('linen', { repeat: [6, 6], roughness: 0.9, color: 0xefe7da });
  M.ceramic = new THREE.MeshPhysicalMaterial({ color: 0xf4efe6, roughness: 0.18, clearcoat: 0.8, clearcoatRoughness: 0.1 });
  M.ceramicBrown = new THREE.MeshPhysicalMaterial({ color: 0x6b4026, roughness: 0.25, clearcoat: 0.7, clearcoatRoughness: 0.15 });
  M.glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.03, metalness: 0, transparent: true, opacity: 0.1, clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1, depthWrite: false, side: THREE.DoubleSide });
  M.frame = pbr('walnut', { repeat: [0.3, 2], roughness: 0.45, color: 0xd8c8b8 });
  M.whitePaint = pbr('plaster', { repeat: [2, 2], roughness: 0.6, color: 0xf2ede4 });
  return M;
}

function box(w, h, d, mat, r = 0.006) {
  const m = new THREE.Mesh(roundedBox(w, h, d, r, 2), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
function add(parent, o, x, y, z) { o.position.set(x, y, z); parent.add(o); return o; }

// -------------------------------------------------------------- picture sign (the rule, told without words)
function signTexture() {
  const W = 1024, H = 512;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  // dark green-black chalkboard with smudges
  g.fillStyle = '#2b2a26'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.025})`; const r = 20 + Math.random() * 90; g.beginPath(); g.ellipse(Math.random() * W, Math.random() * H, r, r * 0.4, Math.random() * 3, 0, 7); g.fill(); }
  const chalk = (col, lw) => { g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'; };
  const cake = (cx, cy, top, side, extra) => {
    // side
    g.fillStyle = side; g.beginPath(); g.moveTo(cx - 70, cy - 20); g.lineTo(cx - 70, cy + 40); g.ellipse(cx, cy + 40, 70, 18, 0, Math.PI, 0, true); g.lineTo(cx + 70, cy - 20); g.closePath(); g.fill();
    g.fillStyle = top; g.beginPath(); g.ellipse(cx, cy - 20, 70, 18, 0, 0, Math.PI * 2); g.fill();
    chalk('rgba(255,255,255,0.7)', 3); g.beginPath(); g.ellipse(cx, cy - 20, 70, 18, 0, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(cx - 70, cy - 20); g.lineTo(cx - 70, cy + 40); g.ellipse(cx, cy + 40, 70, 18, 0, Math.PI, 0, true); g.lineTo(cx + 70, cy - 20); g.stroke();
    if (extra) extra(cx, cy);
  };
  const arrow = (x) => { chalk('rgba(240,230,210,0.85)', 6); g.beginPath(); g.moveTo(x - 22, 250); g.lineTo(x + 22, 250); g.moveTo(x + 8, 236); g.lineTo(x + 22, 250); g.lineTo(x + 8, 264); g.stroke(); };
  cake(130, 250, '#c98a4c', '#9a5e2c');
  arrow(255);
  cake(380, 250, '#f4efe6', '#e9e2d6', (cx, cy) => { chalk('rgba(150,140,130,0.6)', 2); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(cx - 60, cy + i * 12); g.lineTo(cx + 60, cy + i * 12); g.stroke(); } });
  arrow(505);
  cake(630, 250, '#f4efe6', '#e9e2d6', (cx, cy) => {
    g.fillStyle = '#4a2414'; g.beginPath(); g.ellipse(cx, cy - 20, 70, 18, 0, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 9; i++) { const x = cx - 64 + i * 16; g.beginPath(); g.moveTo(x - 6, cy - 12); g.lineTo(x - 6, cy - 4 + (i % 3) * 10); g.arc(x, cy - 4 + (i % 3) * 10, 6, Math.PI, 0, true); g.lineTo(x + 6, cy - 12); g.fill(); }
    for (let i = 0; i < 5; i++) { const x = cx - 44 + i * 22; g.fillStyle = '#c8262a'; g.beginPath(); g.moveTo(x - 9, cy - 34); g.quadraticCurveTo(x, cy - 10, x + 9, cy - 34); g.quadraticCurveTo(x, cy - 44, x - 9, cy - 34); g.fill(); g.fillStyle = '#5c7a34'; g.fillRect(x - 5, cy - 42, 10, 4); }
  });
  arrow(755);
  // happy face with heart
  const fx = 880, fy = 240;
  g.fillStyle = '#e9c9a8'; g.beginPath(); g.arc(fx, fy, 62, 0, 7); g.fill();
  chalk('rgba(60,40,30,0.9)', 6);
  g.beginPath(); g.arc(fx - 22, fy - 10, 9, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  g.beginPath(); g.arc(fx + 22, fy - 10, 9, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  g.fillStyle = '#8a2a2a'; g.beginPath(); g.arc(fx, fy + 18, 24, 0, Math.PI); g.fill();
  g.fillStyle = 'rgba(230,110,110,0.6)'; g.beginPath(); g.arc(fx - 38, fy + 12, 11, 0, 7); g.arc(fx + 38, fy + 12, 11, 0, 7); g.fill();
  g.fillStyle = '#d8434a'; g.beginPath(); const hx = fx + 70, hy = fy - 70; g.moveTo(hx, hy + 18); g.bezierCurveTo(hx - 30, hy - 4, hx - 12, hy - 24, hx, hy - 8); g.bezierCurveTo(hx + 12, hy - 24, hx + 30, hy - 4, hx, hy + 18); g.fill();
  // chalk dust frame
  chalk('rgba(255,255,255,0.25)', 2); g.strokeRect(18, 18, W - 36, H - 36);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

// -------------------------------------------------------------- props
export function makeTurntable() {
  const m = mats();
  const g = new THREE.Group();
  const base = new THREE.Mesh(lathe([[0, 0], [0.075, 0], [0.08, 0.004], [0.072, 0.012], [0.03, 0.02], [0.022, 0.06], [0.024, 0.07], [0, 0.07]], 48), m.steelDark);
  base.castShadow = base.receiveShadow = true; g.add(base);
  const plate = new THREE.Group(); plate.position.y = 0.07; g.add(plate);
  const p = new THREE.Mesh(lathe([[0, 0], [0.13, 0], [0.142, 0.004], [0.142, 0.012], [0.13, 0.014], [0, 0.014]], 64), m.steel);
  p.castShadow = p.receiveShadow = true; plate.add(p);
  // paper cake board
  const board = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.002, 64), new THREE.MeshStandardMaterial({ color: 0xe9dfcf, roughness: 0.8 }));
  board.position.y = 0.015; board.receiveShadow = true; plate.add(board);
  g.userData.plate = plate; g.userData.top = 0.086;
  const cs = contactShadow(0.26, 0.26, 0.5); cs.position.y = 0.001; g.add(cs);
  return g;
}

export function makeKnife() {
  const m = mats();
  const g = new THREE.Group();
  // offset palette knife: blade along +x from the grip origin, lying flat (xz)
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, -0.012); bladeShape.lineTo(0.17, -0.013); bladeShape.quadraticCurveTo(0.192, -0.013, 0.192, 0); bladeShape.quadraticCurveTo(0.192, 0.013, 0.17, 0.013); bladeShape.lineTo(0, 0.012);
  const bg = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.0012, bevelEnabled: true, bevelThickness: 0.0003, bevelSize: 0.0006, bevelSegments: 1, curveSegments: 12 });
  bg.rotateX(Math.PI / 2);
  const blade = new THREE.Mesh(bg, m.steel); blade.castShadow = true;
  blade.position.set(0.05, -0.025, 0);
  g.add(blade);
  // offset neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.005, 0.05, 10), m.steel);
  neck.position.set(0.035, -0.012, 0); neck.rotation.z = Math.PI / 2 + 0.55; g.add(neck);
  // walnut handle
  const h = new THREE.Mesh(lathe([[0, 0], [0.011, 0.004], [0.013, 0.03], [0.012, 0.09], [0.008, 0.1], [0, 0.1]], 20), m.walnut);
  h.rotation.z = Math.PI / 2; h.position.set(0.012, 0, 0); h.castShadow = true;
  g.add(h);
  // cream glob carried on the blade
  const glob = new THREE.Mesh(new THREE.SphereGeometry(0.02, 20, 12), new THREE.MeshPhysicalMaterial({ color: 0xfbf6ec, roughness: 0.5, sheen: 0.5, sheenColor: new THREE.Color(0xffffff) }));
  glob.scale.set(1.6, 0.45, 0.8); glob.position.set(0.18, -0.02, 0); glob.castShadow = true;
  g.add(glob);
  g.userData.glob = glob; g.userData.blade = blade;
  // the grip point in this group is the origin (handle end at -0.09)
  h.position.x = -0.085;
  return g;
}

export function makeBowl(fill = 'cream') {
  const m = mats();
  const g = new THREE.Group();
  const pts = [];
  for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI / 2; pts.push([0.01 + Math.sin(a) * 0.11, 0.004 + (1 - Math.cos(a)) * 0.075]); }
  pts.push([0.123, 0.08], [0.118, 0.082]);
  for (let i = 16; i >= 0; i--) { const a = i / 16 * Math.PI / 2; pts.push([Math.max(0.001, Math.sin(a) * 0.105), 0.008 + (1 - Math.cos(a)) * 0.072]); }
  const bowl = new THREE.Mesh(lathe(pts, 48), m.steel); bowl.castShadow = bowl.receiveShadow = true; g.add(bowl);
  if (fill === 'cream') {
    const geo = new THREE.SphereGeometry(0.098, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const a = Math.atan2(z, x);
      const peak = Math.max(0, Math.sin(a * 3 + x * 60) * Math.sin(z * 70 + 1) ) * 0.012 + Math.sin(a * 7 + y * 90) * 0.003;
      p.setXYZ(i, x, y * 0.42 + peak * (y / 0.1), z);
    }
    geo.computeVertexNormals();
    const cream = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xfbf6ec, roughness: 0.55, sheen: 0.6, sheenColor: new THREE.Color(0xffffff) }));
    cream.position.y = 0.05; cream.castShadow = true; cream.receiveShadow = true;
    tex('creamnoise.png', { onload: (t) => { const c = t.clone(); c.repeat.set(3, 3); c.needsUpdate = true; cream.material.bumpMap = c; cream.material.bumpScale = 1.2; cream.material.needsUpdate = true; } });
    g.add(cream); g.userData.fill = cream;
  }
  const cs = contactShadow(0.3, 0.3, 0.45); cs.position.y = 0.001; g.add(cs);
  return g;
}

export function makeJug() {
  // small enamel pitcher of warm chocolate sauce
  const m = mats();
  const g = new THREE.Group();
  const body = new THREE.Group(); g.add(body);
  const pts = [[0, 0], [0.04, 0], [0.046, 0.01], [0.048, 0.05], [0.042, 0.085], [0.038, 0.1], [0.041, 0.106], [0.037, 0.106], [0.034, 0.1], [0.038, 0.085], [0.043, 0.05], [0.041, 0.012], [0, 0.008]];
  const jg = lathe(pts, 40);
  // spout: pull the rim out on +x
  const p = jg.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const a = Math.atan2(z, x); const k = Math.max(0, Math.cos(a)) ** 6 * Math.max(0, (y - 0.075) / 0.03); p.setXYZ(i, x + k * 0.022, y + k * 0.006, z * (1 - k * 0.3)); }
  jg.computeVertexNormals();
  const jug = new THREE.Mesh(jg, M.ceramic); jug.castShadow = jug.receiveShadow = true; body.add(jug);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.0065, 10, 24, Math.PI * 1.15), M.ceramic);
  handle.position.set(-0.046, 0.058, 0); handle.rotation.z = Math.PI / 2 + 0.1; handle.castShadow = true; body.add(handle);
  const choc = new THREE.Mesh(new THREE.CircleGeometry(0.037, 32), new THREE.MeshPhysicalMaterial({ color: 0x2e1308, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04 }));
  choc.rotation.x = -Math.PI / 2; choc.position.y = 0.088; body.add(choc);
  g.userData.body = body; g.userData.spout = new THREE.Vector3(0.068, 0.11, 0);
  const cs = contactShadow(0.14, 0.14, 0.45); cs.position.y = 0.001; g.add(cs);
  return g;
}

export function makeSieve() {
  const m = mats();
  const g = new THREE.Group();
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.0028, 8, 48), m.steel); rim.rotation.x = Math.PI / 2; rim.position.y = 0.045; g.add(rim);
  // mesh dome (fine wire: tiny grid via alpha texture)
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  x.clearRect(0, 0, 128, 128); x.strokeStyle = '#ccc'; x.lineWidth = 1.4;
  for (let i = 0; i < 128; i += 4) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 128); x.moveTo(0, i); x.lineTo(128, i); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 3);
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 40, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI * 0.4), new THREE.MeshStandardMaterial({ color: 0xd0d4d8, metalness: 1, roughness: 0.35, alphaMap: t, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
  mesh.position.y = 0.045; g.add(mesh);
  // powdered sugar heap inside
  const sg = new THREE.Mesh(new THREE.SphereGeometry(0.045, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xfbfaf7, roughness: 0.95 }));
  sg.scale.y = 0.35; sg.position.y = 0.012; g.add(sg); g.userData.sugar = sg;
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.006, 0.12, 10), m.walnut);
  handle.rotation.z = Math.PI / 2; handle.position.set(-0.12, 0.047, 0); handle.castShadow = true; g.add(handle);
  const cs = contactShadow(0.15, 0.15, 0.35); cs.position.y = 0.001; g.add(cs);
  return g;
}

export function makePipingBag() {
  const g = new THREE.Group();
  // translucent bag full of cream, metal star tip (pointing down = -y)
  const pts = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([0.006 + Math.sin(t * Math.PI * 0.55) * 0.042 * (1 - t * 0.2), t * 0.17]); }
  pts.push([0.02, 0.175]);
  const bag = new THREE.Mesh(lathe(pts, 32), new THREE.MeshPhysicalMaterial({ color: 0xf7f2e8, roughness: 0.3, transmission: 0, transparent: true, opacity: 0.92, clearcoat: 0.6, sheen: 0.3, sheenColor: new THREE.Color(0xffffff) }));
  bag.castShadow = true; g.add(bag);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.003, 0.022, 8), mats().steel);
  tip.position.y = -0.006; g.add(tip);
  g.userData.bag = bag;
  return g;
}

export function makeBerryBowl(makeStrawberry) {
  const g = new THREE.Group();
  const pts = [[0, 0], [0.04, 0], [0.05, 0.004], [0.075, 0.035], [0.078, 0.038], [0.074, 0.039], [0.071, 0.036], [0.047, 0.008], [0, 0.006]];
  const b = new THREE.Mesh(lathe(pts, 48), M.ceramicBrown || mats().ceramicBrown); b.castShadow = b.receiveShadow = true; g.add(b);
  for (let i = 0; i < 9; i++) {
    const s = makeStrawberry();
    const a = i / 9 * Math.PI * 2 + rnd(), r = i === 0 ? 0 : 0.03 + rnd() * 0.012;
    s.position.set(Math.cos(a) * r, 0.012 + (i === 0 ? 0.012 : 0), Math.sin(a) * r);
    s.rotation.set(1.2 + rnd() * 0.6, rnd() * 6, rnd() * 0.5);
    g.add(s);
  }
  const cs = contactShadow(0.18, 0.18, 0.4); cs.position.y = 0.001; g.add(cs);
  return g;
}

export function makeBell() {
  const m = mats();
  const g = new THREE.Group();
  const base = new THREE.Mesh(lathe([[0, 0], [0.04, 0], [0.042, 0.004], [0.04, 0.012], [0, 0.012]], 32), m.walnut); base.castShadow = true; g.add(base);
  const dome = new THREE.Mesh(lathe([[0, 0.05], [0.012, 0.048], [0.028, 0.035], [0.034, 0.018], [0.036, 0.013], [0, 0.013]], 32), m.brass); dome.castShadow = true; g.add(dome);
  const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.004, 0.012, 10), m.brass); btn.position.y = 0.055; g.add(btn);
  g.userData.dome = dome;
  const cs = contactShadow(0.1, 0.1, 0.4); cs.position.y = 0.001; g.add(cs);
  return g;
}

export function makeTowel() {
  const geo = new THREE.PlaneGeometry(0.1, 0.1, 10, 10);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, Math.sin(x * 70) * 0.006 + Math.sin(y * 50 + x * 20) * 0.005 - (x * x + y * y) * 1.5); }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, pbr('linen', { repeat: [1, 1], color: 0xffffff, side: THREE.DoubleSide, roughness: 0.95 }));
  m.castShadow = true;
  return m;
}

// -------------------------------------------------------------- room
export function buildShop(scene) {
  const m = mats();
  const root = new THREE.Group(); scene.add(root);
  const W = 6, D = 5, H = 2.8;
  // floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), m.floor);
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; root.add(floor);
  // back wall: tiles to 1.35m, plaster above
  const tileWall = new THREE.Mesh(new THREE.PlaneGeometry(W, 1.35), m.tile);
  tileWall.position.set(0, 0.675, -D / 2); tileWall.receiveShadow = true; root.add(tileWall);
  const plaster = new THREE.Mesh(new THREE.PlaneGeometry(W, H - 1.35), m.plaster);
  plaster.position.set(0, 1.35 + (H - 1.35) / 2, -D / 2); plaster.receiveShadow = true; root.add(plaster);
  // tile cap (walnut ledge)
  add(root, box(W, 0.03, 0.04, m.walnut, 0.008), 0, 1.36, -D / 2 + 0.02);
  // left wall with window
  const lw = new THREE.Group(); root.add(lw);
  const winZ0 = -1.5, winZ1 = 1.1, winY0 = 0.85, winY1 = 2.25;
  const wallPiece = (z0, z1, y0, y1) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(z1 - z0, y1 - y0), m.plaster);
    p.rotation.y = Math.PI / 2; p.position.set(-W / 2, (y0 + y1) / 2, (z0 + z1) / 2); p.receiveShadow = true; p.castShadow = true; lw.add(p);
  };
  wallPiece(-D / 2, winZ0, 0, H); wallPiece(winZ1, D / 2, 0, H); wallPiece(winZ0, winZ1, 0, winY0); wallPiece(winZ0, winZ1, winY1, H);
  // window frame & mullions (cast the sun's window pattern into the room)
  const fr = m.whitePaint;
  const fw = 0.05;
  add(lw, box(0.12, fw, winZ1 - winZ0 + fw, fr, 0.004), -W / 2, winY0, (winZ0 + winZ1) / 2);
  add(lw, box(0.12, fw, winZ1 - winZ0 + fw, fr, 0.004), -W / 2, winY1, (winZ0 + winZ1) / 2);
  for (let i = 0; i <= 4; i++) add(lw, box(0.1, winY1 - winY0, i % 4 === 0 ? fw : 0.035, fr, 0.004), -W / 2, (winY0 + winY1) / 2, winZ0 + (winZ1 - winZ0) * i / 4);
  add(lw, box(0.08, 0.03, winZ1 - winZ0, fr, 0.004), -W / 2, winY0 + (winY1 - winY0) * 0.62, (winZ0 + winZ1) / 2);
  // sill
  add(lw, box(0.22, 0.03, winZ1 - winZ0 + 0.1, m.walnut, 0.006), -W / 2 + 0.08, winY0 - 0.02, (winZ0 + winZ1) / 2);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(winZ1 - winZ0, winY1 - winY0), m.glass);
  glass.rotation.y = Math.PI / 2; glass.position.set(-W / 2 + 0.01, (winY0 + winY1) / 2, (winZ0 + winZ1) / 2); glass.userData.noRay = true; lw.add(glass);
  // outside: sky + soft autumn street (blurred painting)
  const outC = document.createElement('canvas'); outC.width = 512; outC.height = 256;
  { const g = outC.getContext('2d');
    const sk = g.createLinearGradient(0, 0, 0, 256); sk.addColorStop(0, '#9fbcd8'); sk.addColorStop(0.55, '#e8dccb'); sk.addColorStop(1, '#d8c0a0'); g.fillStyle = sk; g.fillRect(0, 0, 512, 256);
    g.filter = 'blur(10px)';
    for (let i = 0; i < 26; i++) { const x = Math.random() * 512, y = 90 + Math.random() * 80, r = 20 + Math.random() * 40; g.fillStyle = ['#c98a3a', '#b5652a', '#d9a64a', '#8a6a3a', '#a0502a'][i % 5]; g.globalAlpha = 0.75; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    g.globalAlpha = 1; g.fillStyle = '#b8a48c'; g.fillRect(0, 200, 512, 56);
    g.fillStyle = '#e9e0d4'; g.fillRect(40, 120, 120, 90); g.fillStyle = '#c4b4a0'; g.fillRect(330, 110, 140, 100);
  }
  const outT = new THREE.CanvasTexture(outC); outT.colorSpace = THREE.SRGBColorSpace;
  const outside = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 2.4), new THREE.MeshBasicMaterial({ map: outT, color: new THREE.Color(1.6, 1.55, 1.5) }));
  outside.rotation.y = Math.PI / 2; outside.position.set(-W / 2 - 1.2, 1.5, -0.2); outside.userData.noRay = true; root.add(outside);
  // right wall
  const rw = new THREE.Mesh(new THREE.PlaneGeometry(D, H), m.plaster); rw.rotation.y = -Math.PI / 2; rw.position.set(W / 2, H / 2, 0); rw.receiveShadow = true; root.add(rw);
  // front wall (behind camera mostly) + glass door
  const fwall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), m.plaster); fwall.rotation.y = Math.PI; fwall.position.set(0, H / 2, D / 2); root.add(fwall);
  // ceiling with beams
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), m.plaster); ceil.rotation.x = Math.PI / 2; ceil.position.y = H; root.add(ceil);
  for (let i = 0; i < 4; i++) add(root, box(W, 0.14, 0.12, m.walnut, 0.01), 0, H - 0.07, -1.9 + i * 1.3);
  // baseboard
  add(root, box(W, 0.1, 0.02, m.walnut, 0.004), 0, 0.05, -D / 2 + 0.01);

  // ---- work counter + showcase counter (one long walnut counter, marble top)
  const cW = 3.4, cD = 0.72, cx0 = 0.65;
  const cab = box(cW, COUNTER_Y - 0.04, cD, m.walnutV, 0.01); cab.position.set(cx0, (COUNTER_Y - 0.04) / 2, CZ); root.add(cab);
  // front panelling grooves
  for (let i = 0; i < 12; i++) add(root, box(0.012, COUNTER_Y - 0.16, 0.012, m.walnut, 0.004), cx0 - cW / 2 + 0.14 + i * (cW - 0.28) / 11, (COUNTER_Y - 0.04) / 2, CZ + cD / 2 + 0.002);
  add(root, box(cW - 0.04, 0.08, 0.02, m.walnut, 0.006), cx0, 0.05, CZ + cD / 2 - 0.02);
  const top = box(cW + 0.06, 0.04, cD + 0.06, m.marble, 0.008); top.position.set(cx0, COUNTER_Y - 0.02, CZ); root.add(top);
  // showcase glass case on the right end
  const caseG = new THREE.Group(); caseG.position.set((CASE_X[0] + CASE_X[2]) / 2, COUNTER_Y, CZ); root.add(caseG);
  const cw = 1.12, ch = 0.4, cd = 0.5;
  const glassM = m.glass;
  const panel = (w, h, x, y, z, ry) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassM); p.position.set(x, y, z); p.rotation.y = ry; p.userData.noRay = true; p.renderOrder = 2; caseG.add(p); };
  panel(cw, ch, 0, ch / 2, cd / 2, 0); panel(cd, ch, -cw / 2, ch / 2, 0, Math.PI / 2); panel(cd, ch, cw / 2, ch / 2, 0, Math.PI / 2);
  const topG = new THREE.Mesh(new THREE.PlaneGeometry(cw, cd), glassM); topG.rotation.x = -Math.PI / 2; topG.position.y = ch; topG.userData.noRay = true; topG.renderOrder = 2; caseG.add(topG);
  for (const [x, z] of [[-cw / 2, cd / 2], [cw / 2, cd / 2], [-cw / 2, -cd / 2], [cw / 2, -cd / 2]]) add(caseG, box(0.016, ch, 0.016, m.brass, 0.004), x, ch / 2, z);
  for (const z of [cd / 2, -cd / 2]) add(caseG, box(cw, 0.016, 0.016, m.brass, 0.004), 0, ch, z);
  for (const x of [cw / 2, -cw / 2]) add(caseG, box(0.016, 0.016, cd, m.brass, 0.004), x, ch, 0);
  // white doily boards in case
  const slots = [];
  for (const x of CASE_X) {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.012, 48), m.ceramic);
    d.position.set(x, COUNTER_Y + 0.006, CZ); d.castShadow = d.receiveShadow = true; root.add(d);
    slots.push(new THREE.Vector3(x, COUNTER_Y + 0.012, CZ));
  }
  // ---- back shelves with jars / stands
  const shelfY = [1.55, 1.9];
  for (const y of shelfY) add(root, box(1.9, 0.035, 0.28, m.walnut, 0.006), -0.2, y, -D / 2 + 0.14);
  for (let i = 0; i < 4; i++) add(root, box(0.03, 0.12, 0.2, m.brass, 0.004), -1.05 + i * 0.57, 1.5, -D / 2 + 0.1);
  // glass jars with almonds / sugar cubes, cake stands
  const jarM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.25, clearcoat: 1, depthWrite: false });
  const fillCols = [0xd8b080, 0xf6f2ea, 0x8a4a2a, 0xe0c090, 0x6a3a22];
  for (let i = 0; i < 6; i++) {
    const x = -1.0 + i * 0.3 + rnd() * 0.05, y = shelfY[i % 2] + 0.018;
    const h = 0.12 + rnd() * 0.08, r = 0.04 + rnd() * 0.02;
    const jar = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), jarM); jar.position.set(x, y + h / 2, -D / 2 + 0.15); jar.userData.noRay = true; root.add(jar);
    const f = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.92, r * 0.92, h * 0.6, 20), pbr('cotton', { color: fillCols[i % 5], repeat: [1, 1], roughness: 0.9 }));
    f.position.set(x, y + h * 0.3, -D / 2 + 0.15); root.add(f);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.05, r * 1.05, 0.015, 24), m.walnut); lid.position.set(x, y + h + 0.007, -D / 2 + 0.15); lid.castShadow = true; root.add(lid);
  }
  for (const [x, y] of [[0.45, shelfY[0]], [-0.75, shelfY[1]]]) {
    const st = new THREE.Mesh(lathe([[0, 0], [0.05, 0], [0.055, 0.005], [0.02, 0.02], [0.015, 0.1], [0.13, 0.105], [0.135, 0.112], [0, 0.112]], 40), m.ceramic);
    st.position.set(x, y + 0.018, -D / 2 + 0.15); st.castShadow = true; root.add(st);
  }
  // ---- picture sign above the work counter
  const sign = new THREE.Group(); sign.position.set(-0.15, 2.28, -D / 2 + 0.03); root.add(sign);
  add(sign, box(1.04, 0.54, 0.03, m.walnut, 0.01), 0, 0, 0);
  const sgn = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.48), new THREE.MeshStandardMaterial({ map: signTexture(), roughness: 0.85 }));
  sgn.position.z = 0.017; sign.add(sgn);
  // ---- hooks with hat and apron (dress-up corner) on the back wall, left
  const board = box(0.78, 0.62, 0.02, m.walnut, 0.01); board.position.set(-1.77, 1.08, -D / 2 + 0.01); root.add(board);
  const hookBar = box(0.7, 0.06, 0.03, m.walnut, 0.008); hookBar.position.set(-1.77, 1.32, -D / 2 + 0.03); root.add(hookBar);
  const hooks = [];
  for (const x of [-1.95, -1.55]) { const hk = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.004, 8, 16, Math.PI), m.brass); hk.position.set(x, 1.3, -D / 2 + 0.07); hk.rotation.set(0, Math.PI / 2, Math.PI); root.add(hk); hooks.push(new THREE.Vector3(x, 1.28, -D / 2 + 0.07)); }
  // ---- pendant lamps (brass + warm glass globe)
  const lamps = [];
  for (const x of [-0.6, 0.9]) {
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.55, 6), new THREE.MeshStandardMaterial({ color: 0x2a1c14, roughness: 0.6 })); cord.position.set(x, H - 0.275, 0.05); root.add(cord);
    const shade = new THREE.Mesh(lathe([[0.02, 0], [0.03, -0.02], [0.13, -0.15], [0.135, -0.16], [0.128, -0.16], [0.025, -0.025], [0.015, 0]], 40), m.brass);
    shade.position.set(x, H - 0.55, 0.05); shade.castShadow = false; root.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), new THREE.MeshBasicMaterial({ color: kelvin(2700).multiplyScalar(6) }));
    bulb.position.set(x, H - 0.69, 0.05); root.add(bulb);
    lamps.push(bulb);
  }
  // ---- small wooden step stool behind the counter (for the girl)
  const stool = box(0.4, 0.2, 0.3, m.walnut, 0.012); stool.position.set(0.06, 0.1, -0.8); root.add(stool);
  const stool2 = box(0.36, 0.2, 0.28, m.walnut, 0.012); stool2.position.set(1.6, 0.1, -0.8); root.add(stool2);
  // ---- shop door frame & a plant by the window, a small round table for customers
  const potM = new THREE.MeshPhysicalMaterial({ color: 0xb06a44, roughness: 0.75 });
  const pot = new THREE.Mesh(lathe([[0, 0], [0.12, 0], [0.15, 0.3], [0.16, 0.31], [0, 0.31]], 32), potM); pot.position.set(-2.55, 0, 1.6); pot.castShadow = true; pot.receiveShadow = true; root.add(pot);
  const leafM = new THREE.MeshStandardMaterial({ color: 0x3d5a2a, roughness: 0.55, side: THREE.DoubleSide });
  for (let i = 0; i < 18; i++) {
    const lf = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 6), leafM); lf.scale.set(0.35, 0.08, 1);
    const a = rnd() * 6.28, h = 0.4 + rnd() * 0.8;
    lf.position.set(-2.55 + Math.cos(a) * 0.15, h, 1.6 + Math.sin(a) * 0.15); lf.rotation.set(rnd() - 0.5, a, 0.6 + rnd() * 0.5); lf.castShadow = true; root.add(lf);
  }
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 1.0, 8), new THREE.MeshStandardMaterial({ color: 0x5a4030, roughness: 0.8 })); stem.position.set(-2.55, 0.75, 1.6); root.add(stem);
  // contact shadows (ambient occlusion where things meet the floor / wall)
  const cs1 = contactShadow(cW + 0.4, cD + 0.5, 0.55); cs1.position.set(cx0, 0.002, CZ); root.add(cs1);
  const cs2 = contactShadow(0.7, 0.6, 0.5); cs2.position.set(-2.55, 0.002, 1.6); root.add(cs2);
  // wall/floor seam darkening
  const seam = new THREE.Mesh(new THREE.PlaneGeometry(W, 0.4), new THREE.MeshBasicMaterial({ map: seamTexture(), transparent: true, depthWrite: false, color: 0x000000 }));
  seam.rotation.x = -Math.PI / 2; seam.position.set(0, 0.003, -D / 2 + 0.2); seam.userData.noRay = true; root.add(seam);

  return { root, slots, hooks, lamps, sign };
}
function seamTexture() {
  const c = document.createElement('canvas'); c.width = 4; c.height = 64; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, 'rgba(0,0,0,0.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 4, 64);
  return new THREE.CanvasTexture(c);
}
