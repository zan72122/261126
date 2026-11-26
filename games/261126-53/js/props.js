// dig-site props: grid stakes & strings, brush, rock hammer, tool cloth, tray, tarp, mount stand, picture sign, tent, crate, bucket, sieve, flag
import * as THREE from 'three';
import { scene, pbr, tex, rng } from './core.js';
import { sweep, merge, xform, deform, setColor, fbm, rockGeo } from './geo.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const M = {};
export function propMats() {
  if (M.wood) return M;
  M.wood = pbr('wood', { repeat: 1 });
  M.woodSmall = pbr('wood', { repeat: 0.5 });
  M.metal = pbr('metal', { repeat: 1, metal: true, color: 0xb8b8b8 });
  M.darkMetal = pbr('metal', { repeat: 2, metal: true, color: 0x6a6660 });
  M.canvas = pbr('canvas', { repeat: 3, side: THREE.DoubleSide, color: 0xd8ccb4 });
  M.tarp = pbr('tarp', { repeat: 2, side: THREE.DoubleSide });
  M.string = new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(0.92, 0.9, 0.84, THREE.SRGBColorSpace), roughness: 0.9 });
  M.bristle = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 });
  M.rubber = new THREE.MeshStandardMaterial({ color: 0x2a2420, roughness: 0.8 });
  M.flag = pbr('cotton', { repeat: 2, side: THREE.DoubleSide, color: new THREE.Color().setRGB(0.78, 0.25, 0.18, THREE.SRGBColorSpace) });
  return M;
}
function shadowAll(o) { o.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } }); return o; }

// a slightly bevelled plank box
export function plankBox(w, h, d, mat, uvs = 1) {
  const g = new THREE.BoxGeometry(w, h, d, 2, 2, 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const b = 0.004;
    p.setXYZ(i, x - Math.sign(x) * b * (Math.abs(y) > h / 2 - 1e-4 ? 1 : 0) * 0.5, y, z - Math.sign(z) * b * (Math.abs(y) > h / 2 - 1e-4 ? 1 : 0) * 0.5);
  }
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * Math.max(w, d) * uvs, uv.getY(i) * Math.max(h, 0.1) * uvs);
  g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}

export function makeBrush() {
  propMats();
  const g = new THREE.Group();
  // handle along +y (tip end = bristles at y=0 going -y)
  const handle = sweep([V(0, 0.03, 0), V(0, 0.12, 0), V(0, 0.2, 0)], { segs: 10, radial: 12, radius: t => [0.0095 * (1 - 0.25 * t) + 0.002 * Math.sin(t * 3), 0.007 * (1 - 0.2 * t)], up: V(1, 0, 0), vScale: 3 });
  g.add(new THREE.Mesh(handle, M.wood));
  const fer = sweep([V(0, 0.002, 0), V(0, 0.034, 0)], { segs: 3, radial: 16, radius: t => [0.027 - t * 0.016, 0.0065 + t * 0.0015], up: V(1, 0, 0) });
  g.add(new THREE.Mesh(fer, M.metal));
  const R = rng(4);
  const strands = [];
  for (let i = 0; i < 70; i++) {
    const x = (R() - 0.5) * 0.05, z = (R() - 0.5) * 0.01;
    const L = 0.038 + R() * 0.008;
    const sp = 1.15;
    const st = sweep([V(x * 0.95, 0.006, z), V(x * sp + (R() - 0.5) * 0.003, -L, z * 1.4 + (R() - 0.5) * 0.003)], { segs: 2, radial: 3, radius: () => 0.0011, caps: false });
    const shade = R() < 0.15 ? 0.25 : 0.85 + R() * 0.15;
    setColor(st, (v, c) => c.setRGB(0.86 * shade, 0.74 * shade, 0.55 * shade));
    strands.push(st);
  }
  const bristles = new THREE.Mesh(merge(strands), M.bristle);
  const bg = new THREE.Group(); bg.add(bristles); g.add(bg);
  g.userData.bristles = bg;
  g.userData.tipLen = 0.04;
  return shadowAll(g);
}
export function makeHammer() {
  propMats();
  const g = new THREE.Group();
  const handle = sweep([V(0, 0.0, 0), V(0, 0.15, 0), V(0, 0.3, 0)], { segs: 10, radial: 12, radius: t => [0.012 + 0.003 * t, 0.009 + 0.002 * t], up: V(1, 0, 0), vScale: 2 });
  g.add(new THREE.Mesh(handle, M.wood));
  const grip = sweep([V(0, 0.19, 0), V(0, 0.31, 0)], { segs: 4, radial: 12, radius: () => [0.0155, 0.0125], up: V(1, 0, 0) });
  g.add(new THREE.Mesh(grip, M.rubber));
  // steel head: square face on one side, pick on the other (head along x at y=0)
  const head = sweep([V(-0.075, 0, 0), V(-0.02, 0, 0), V(0.03, 0, 0), V(0.085, -0.006, 0)], {
    segs: 14, radial: 12, up: V(0, 1, 0), capLen: 0.25,
    radius: t => { const face = t < 0.35 ? 1 : 1 - (t - 0.35) / 0.65 * 0.85; return [0.0135 * face, 0.0135 * face * (t > 0.4 ? 0.65 : 1)]; },
    shape: (t, a) => 1 / Math.pow(Math.abs(Math.cos(a)) ** 4 + Math.abs(Math.sin(a)) ** 4, 0.25),
  });
  g.add(new THREE.Mesh(head, M.metal));
  g.userData.faceOffset = V(-0.075, 0, 0);
  return shadowAll(g);
}
export function makeToolCloth() {
  propMats();
  const g = new THREE.PlaneGeometry(0.6, 0.42, 24, 18); g.rotateX(-Math.PI / 2);
  deform(g, v => { v.y = 0.004 + Math.max(0, fbm(v.x * 9, 0, v.z * 9, 3)) * 0.012 + (Math.abs(v.x) > 0.27 ? 0.006 : 0); });
  return shadowAll(new THREE.Mesh(g, M.canvas));
}
export function makeStakesAndStrings(x0, x1, z0, z1) {
  propMats();
  const g = new THREE.Group();
  const corners = [[x0, z0], [x1, z0], [x1, z1], [x0, z1], [(x0 + x1) / 2, z0], [(x0 + x1) / 2, z1]];
  for (const [x, z] of corners) {
    const s = plankBox(0.028, 0.34, 0.028, M.woodSmall, 3);
    s.position.set(x, 0.12, z); s.rotation.set((Math.random() - 0.5) * 0.06, Math.random() * 0.5, (Math.random() - 0.5) * 0.06);
    g.add(s);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.04, 4), M.woodSmall); tip.position.set(x, 0.3, z); tip.rotation.y = 0.78; g.add(tip);
  }
  const H = 0.07;
  const line = (a, b) => {
    const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(V(a[0] + (b[0] - a[0]) * t, H - Math.sin(t * Math.PI) * 0.012, a[1] + (b[1] - a[1]) * t)); }
    g.add(new THREE.Mesh(sweep(pts, { segs: 24, radial: 4, radius: () => 0.0015, caps: false }), M.string));
  };
  line(corners[0], corners[1]); line(corners[1], corners[2]); line(corners[2], corners[3]); line(corners[3], corners[0]); line(corners[4], corners[5]);
  return shadowAll(g);
}
export function makeTray(w = 0.62, d = 0.44) {
  propMats();
  const g = new THREE.Group();
  const base = plankBox(w, 0.018, d, M.wood); base.position.y = 0.012; g.add(base);
  for (const s of [-1, 1]) {
    const a = plankBox(w, 0.07, 0.018, M.wood); a.position.set(0, 0.045, s * (d / 2 - 0.009)); g.add(a);
    const b = plankBox(0.018, 0.07, d - 0.036, M.wood); b.position.set(s * (w / 2 - 0.009), 0.045, 0); g.add(b);
  }
  return shadowAll(g);
}
export function makeTarp(w, d) {
  propMats();
  const g = new THREE.PlaneGeometry(w, d, 40, 30); g.rotateX(-Math.PI / 2);
  deform(g, v => { v.y = 0.006 + Math.max(0, fbm(v.x * 3 + 2, 1, v.z * 3, 3)) * 0.03 + Math.max(0, Math.abs(v.x) - w * 0.46) * 0.3; });
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w, uv.getY(i) * d);
  return shadowAll(new THREE.Mesh(g, M.tarp));
}
export function makeCrate() {
  propMats();
  const g = new THREE.Group();
  const w = 0.5, h = 0.3, d = 0.34;
  const b = plankBox(w, 0.015, d, M.wood); b.position.y = 0.0075; g.add(b);
  for (let i = 0; i < 3; i++) for (const s of [-1, 1]) {
    const p = plankBox(w, 0.085, 0.014, M.wood); p.position.set(0, 0.05 + i * 0.095, s * (d / 2 - 0.007)); g.add(p);
    const q = plankBox(0.014, 0.085, d - 0.028, M.wood); q.position.set(s * (w / 2 - 0.007), 0.05 + i * 0.095, 0); g.add(q);
  }
  return shadowAll(g);
}
export function makeBucket() {
  propMats();
  const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(new THREE.Vector2(0.11 + t * 0.035, t * 0.25)); }
  const g = new THREE.LatheGeometry(pts, 32);
  const m = new THREE.Mesh(g, pbr('metal', { repeat: 2, metal: true, color: 0xa8a8a0, side: THREE.DoubleSide }));
  const grp = new THREE.Group(); grp.add(m);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.003, 6, 24, Math.PI), M.metal); handle.position.y = 0.25; handle.rotation.z = 0.5; grp.add(handle);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.146, 0.005, 6, 32), M.metal); rim.rotation.x = Math.PI / 2; rim.position.y = 0.25; grp.add(rim);
  // sand inside
  const sand = new THREE.Mesh(new THREE.CircleGeometry(0.14, 24), pbr('sand', { repeat: 0.3 })); sand.rotation.x = -Math.PI / 2; sand.position.y = 0.2; grp.add(sand);
  return shadowAll(grp);
}
export function makeTent() {
  propMats();
  const g = new THREE.Group();
  const w = 3.2, h = 2.1, d = 2.6;
  const geo = new THREE.BufferGeometry();
  const seg = 16;
  const pos = [], uv = [], idx = [];
  for (const side of [-1, 1]) {
    const base = pos.length / 3;
    for (let j = 0; j <= seg; j++) for (let i = 0; i <= seg; i++) {
      const u = i / seg, v = j / seg;
      const sag = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.06;
      pos.push((u - 0.5) * w, h * (1 - v) - sag, side * (v * d / 2 - sag * 0.5));
      uv.push(u * w, v * d);
    }
    for (let j = 0; j < seg; j++) for (let i = 0; i < seg; i++) {
      const a = base + j * (seg + 1) + i, b = a + 1, c = a + seg + 1, e = c + 1;
      if (side > 0) idx.push(a, c, b, b, c, e); else idx.push(a, b, c, b, e, c);
    }
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo, M.canvas));
  for (const s of [-1, 1]) {
    const tri = new THREE.BufferGeometry();
    tri.setAttribute('position', new THREE.Float32BufferAttribute([s * w / 2, h, 0, s * w / 2, 0, -d / 2, s * w / 2, 0, d / 2], 3));
    tri.setAttribute('uv', new THREE.Float32BufferAttribute([0.5, 1, 0, 0, 1, 0], 2)); tri.computeVertexNormals();
    g.add(new THREE.Mesh(tri, M.canvas));
    const pole = plankBox(0.05, h + 0.1, 0.05, M.woodSmall, 2); pole.position.set(s * w / 2 * 0.98, (h + 0.1) / 2, 0); g.add(pole);
  }
  const ridge = new THREE.Mesh(sweep([V(-w / 2 - 0.1, h + 0.02, 0), V(w / 2 + 0.1, h + 0.02, 0)], { segs: 2, radial: 6, radius: () => 0.025 }), M.woodSmall); g.add(ridge);
  return shadowAll(g);
}
export function makeSieve() {
  propMats();
  const g = new THREE.Group();
  const w = 0.5;
  for (const s of [-1, 1]) {
    const a = plankBox(w, 0.06, 0.02, M.wood); a.position.set(0, 0.03, s * (w / 2 - 0.01)); g.add(a);
    const b = plankBox(0.02, 0.06, w, M.wood); b.position.set(s * (w / 2 - 0.01), 0.03, 0); g.add(b);
  }
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'); x.clearRect(0, 0, 128, 128); x.strokeStyle = '#9a9a98'; x.lineWidth = 2;
  for (let i = 0; i < 128; i += 8) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 128); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(128, i); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 6);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.03, w - 0.03), new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.4, metalness: 0.8, roughness: 0.4, side: THREE.DoubleSide }));
  mesh.rotation.x = -Math.PI / 2; mesh.position.y = 0.01; g.add(mesh);
  return shadowAll(g);
}
export function makeFlag() {
  propMats();
  const g = new THREE.Group();
  const pole = new THREE.Mesh(sweep([V(0, -0.05, 0), V(0, 0.9, 0)], { segs: 2, radial: 8, radius: () => 0.009 }), M.woodSmall); g.add(pole);
  const cloth = new THREE.PlaneGeometry(0.26, 0.17, 12, 6); cloth.translate(0.13, 0.78, 0);
  const fm = new THREE.Mesh(cloth, M.flag); g.add(fm);
  g.userData.cloth = fm; g.userData.base = cloth.attributes.position.array.slice();
  return shadowAll(g);
}
export function waveFlag(f, t) {
  const p = f.userData.cloth.geometry.attributes.position, b = f.userData.base;
  for (let i = 0; i < p.count; i++) {
    const x = b[i * 3];
    p.setZ(i, Math.sin(x * 22 - t * 6) * 0.025 * x / 0.26 + Math.sin(x * 9 - t * 3.3) * 0.015 * x / 0.26);
    p.setY(i, b[i * 3 + 1] - x * x * 0.4);
  }
  p.needsUpdate = true; f.userData.cloth.geometry.computeVertexNormals();
}
// mount stand: wooden platform + dark steel armature following the skeleton's spine
export function makeStand(skel) {
  propMats();
  const g = new THREE.Group();
  const top = plankBox(3.3, 0.12, 1.15, M.wood, 0.9); top.position.y = 0.06; g.add(top);
  const S = skel.S;
  const curve = new THREE.CatmullRomCurve3(S.spine, false, 'centripetal');
  const pts = []; for (let i = 0; i <= 30; i++) { const p = curve.getPointAt(0.1 + i / 30 * 0.88); pts.push(V(p.x, p.y - 0.09, 0)); }
  g.add(new THREE.Mesh(sweep(pts, { segs: 60, radial: 8, radius: () => 0.008 }), M.darkMetal));
  const posts = [S.hip.x, S.shoulder.x, -1.1, 0.75];
  for (const x of posts) {
    const p = curve.getPointAt(Math.min(1, Math.max(0, findT(curve, x))));
    g.add(new THREE.Mesh(sweep([V(x, 0.12, 0), V(x, p.y - 0.09, 0)], { segs: 2, radial: 8, radius: () => 0.01 }), M.darkMetal));
    const foot = plankBox(0.1, 0.012, 0.1, M.darkMetal); foot.position.set(x, 0.126, 0); g.add(foot);
  }
  g.userData.top = 0.12;
  return shadowAll(g);
}
function findT(curve, x) { let best = 0, bd = 1e9; for (let i = 0; i <= 100; i++) { const p = curve.getPointAt(i / 100); const d = Math.abs(p.x - x); if (d < bd) { bd = d; best = i / 100; } } return best; }

// picture sign: the complete skeleton drawn in chalky bone-white on a dark board (the rule, without words)
export function makeSign(skel) {
  propMats();
  const c = document.createElement('canvas'); c.width = 1024; c.height = 640;
  const x = c.getContext('2d');
  const gr = x.createLinearGradient(0, 0, 0, 640); gr.addColorStop(0, '#3d4a44'); gr.addColorStop(1, '#2f3a35');
  x.fillStyle = gr; x.fillRect(0, 0, 1024, 640);
  for (let i = 0; i < 2500; i++) { x.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`; x.fillRect(Math.random() * 1024, Math.random() * 640, 2, 2); }
  // projected skeleton (side view)
  const tx = p => 512 + p.x * 230, ty = p => 600 - p.y * 230;
  x.strokeStyle = 'rgba(244,236,214,0.92)'; x.fillStyle = 'rgba(244,236,214,0.9)'; x.lineCap = 'round'; x.lineJoin = 'round';
  for (const b of skel.bones) {
    const g = b.geo; if (!g.boundingBox) g.computeBoundingBox();
    const bb = g.boundingBox;
    const len = (bb.max.x - bb.min.x) * b.scale.x;
    const a = b.pos.clone(), e = V(len, 0, 0).applyQuaternion(b.quat).add(b.pos);
    if (b.pos.z < -0.05 && b.item !== 'ribs') continue;
    if (b.item === 'skull') {
      x.save(); x.translate(tx(b.pos), ty(b.pos)); const d = V(1, 0, 0).applyQuaternion(b.quat); x.rotate(-Math.atan2(d.y, d.x));
      x.beginPath(); x.ellipse(0, 0, 40, 20, 0, 0, 7); x.fill();
      x.fillStyle = '#34413b'; x.beginPath(); x.arc(-10, -5, 7, 0, 7); x.fill();
      x.strokeStyle = '#34413b'; x.lineWidth = 3; x.beginPath(); x.moveTo(36, 6); x.quadraticCurveTo(10, 12, -18, 2); x.stroke();
      x.restore(); x.fillStyle = 'rgba(244,236,214,0.9)'; x.strokeStyle = 'rgba(244,236,214,0.92)';
      continue;
    }
    if (b.item === 'ribs') {
      if (b.pos.z < 0 && b.geo) { /* draw rib once per pair */ }
      const L = (bb.max.y - bb.min.y);
      x.lineWidth = 4; x.beginPath(); x.moveTo(tx(a), ty(a)); x.quadraticCurveTo(tx(a) + 16, ty(a) + L * 120, tx(a) + 4, ty(a) + L * 230 * 0.9); x.stroke();
      continue;
    }
    const w = Math.max(5, Math.min(18, (bb.max.y - bb.min.y) * b.scale.y * 230 * 0.55));
    x.lineWidth = w; x.beginPath(); x.moveTo(tx(a), ty(a)); x.lineTo(tx(e), ty(e)); x.stroke();
  }
  // ground line
  x.strokeStyle = 'rgba(240,220,170,0.5)'; x.lineWidth = 4; x.beginPath(); x.moveTo(60, 604); x.lineTo(964, 604); x.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const g = new THREE.Group();
  const boardMat = new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, normalMap: tex('wood', 'n', 1), normalScale: new THREE.Vector2(0.3, 0.3) });
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.62, 0.03), [M.wood, M.wood, M.wood, M.wood, boardMat, M.wood]);
  board.position.y = 1.0; g.add(board);
  const frame = (w, h, px, py) => { const f = plankBox(w, h, 0.045, M.wood); f.position.set(px, py, 0); g.add(f); };
  frame(1.06, 0.04, 0, 1.31); frame(1.06, 0.04, 0, 0.69); frame(0.04, 0.66, -0.51, 1.0); frame(0.04, 0.66, 0.51, 1.0);
  for (const s of [-1, 1]) { const p = plankBox(0.05, 1.3, 0.05, M.wood, 2); p.position.set(s * 0.42, 0.6, -0.04); g.add(p); }
  g.userData.tex = t; g.userData.canvas = c;
  return shadowAll(g);
}
