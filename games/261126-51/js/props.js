// Physical props: paint cans with drips, roller & brush, crate with work clothes, picture sign,
// aluminium stepladder, cotton rag, terracotta pots with tulips, a sparrow.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '../vendor/RoundedBoxGeometry.js';
import { sweep, capped, keys, curve, V3, canvas, canvasTex, tex, rand, contactShadow, noise2, lerp } from './util.js';

const TAU = Math.PI * 2;
export const COLORS = ['#5f93c4', '#e2bd52', '#7fa66f', '#9e3f30', '#ebe5d4'];   // sky blue, butter yellow, sage, barn red, cream

const metalMat = () => new THREE.MeshStandardMaterial({
  color: 0xc9c9c4, metalness: 1, roughness: 1, roughnessMap: tex('metal_detail.jpg', { repeat: [2, 1] }),
  normalMap: tex('metal_normal.jpg', { repeat: [2, 1] }), normalScale: new THREE.Vector2(0.4, 0.4),
});
const woodMat = (tint = 1) => new THREE.MeshStandardMaterial({
  color: new THREE.Color(tint, tint * 0.97, tint * 0.92), map: tex('wood_albedo.jpg', { srgb: true }), normalMap: tex('wood_normal.jpg'),
  roughnessMap: tex('wood_orm.jpg'), aoMap: tex('wood_orm.jpg'), normalScale: new THREE.Vector2(1.2, 1.2),
});
const shadowOn = (g) => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };

// ---------------------------------------------------------------- paint can
export function paintCan(col) {
  const g = new THREE.Group();
  const R = 0.083, H = 0.19;
  const prof = [[0, 0.002], [R - 0.004, 0], [R, 0.004], [R, 0.03], [R - 0.0015, 0.034], [R, 0.038], [R, H - 0.03], [R - 0.0015, H - 0.026], [R, H - 0.022], [R, H - 0.004], [R + 0.004, H], [R - 0.006, H + 0.002], [R - 0.008, H - 0.012], [R - 0.008, H - 0.05]];
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 48), metalMat());
  body.material.side = THREE.DoubleSide;
  g.add(body);
  // drips running down the outside in the paint colour (alpha canvas)
  const c = canvas(256, 128), x = c.getContext('2d');
  x.fillStyle = col;
  x.fillRect(0, 0, 256, 6);
  for (let i = 0; i < 9; i++) {
    const px = rand(0, 256), len = rand(10, 70), w = rand(3, 8);
    x.beginPath(); x.moveTo(px - w, 0); x.lineTo(px - w * 0.6, len); x.arc(px, len, w * 0.65, Math.PI, 0, true); x.lineTo(px + w, 0); x.fill();
  }
  const dt = canvasTex(c);
  const drips = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.0012, R + 0.0012, H * 0.9, 48, 1, true),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: dt, alphaMap: null, transparent: true, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 }));
  drips.material.alphaTest = 0.4;
  drips.position.y = H * 0.55; g.add(drips);
  // paint surface (glossy, slightly domed meniscus)
  const surf = new THREE.Mesh(new THREE.CircleGeometry(R - 0.008, 40), new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.03 }));
  surf.rotation.x = -Math.PI / 2; surf.position.y = H - 0.022; g.add(surf);
  // wire bail handle
  const bail = new THREE.Mesh(new THREE.TorusGeometry(R + 0.004, 0.0022, 6, 32, Math.PI), metalMat());
  bail.position.y = H - 0.035; bail.rotation.y = 0.3; bail.rotation.x = -1.2; g.add(bail);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.008, 10, 6), metalMat()); e.position.set(s * (R + 0.002) * Math.cos(0.3), H - 0.035, -s * (R + 0.002) * Math.sin(0.3)); g.add(e); }
  shadowOn(g);
  const cs = contactShadow(0.26, 0.26, 0.6); g.add(cs);
  g.userData = { col, surf };
  return g;
}

// ---------------------------------------------------------------- tools
export function roller() {
  const g = new THREE.Group();
  const nap = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.2, 28, 6),
    new THREE.MeshPhysicalMaterial({ color: 0xf0ebe0, map: tex('knit_detail.jpg', { srgb: true, repeat: [3, 2] }), normalMap: tex('knit_normal.jpg', { repeat: [3, 2] }), normalScale: new THREE.Vector2(2, 2), roughness: 0.95, sheen: 1, sheenRoughness: 0.9, sheenColor: new THREE.Color(0xffffff) }));
  nap.rotation.z = Math.PI / 2; g.add(nap);
  const frame = new THREE.Mesh(sweep(curve([[0.105, 0, 0], [0.12, 0, 0], [0.12, -0.06, 0], [0.04, -0.09, 0], [0.0, -0.14, 0]], 24), () => [0.0035, 0.0035], { radial: 8 }), metalMat());
  g.add(frame);
  const handle = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.013, 0.004], [0.016, 0.03], [0.014, 0.1], [0.016, 0.13], [0.0, 0.135]].map(([x, y]) => new THREE.Vector2(x, y)), 20),
    new THREE.MeshPhysicalMaterial({ color: 0x2f5d74, roughness: 0.35, clearcoat: 0.6 }));
  handle.rotation.z = Math.PI; handle.position.set(0, -0.14, 0); g.add(handle);
  g.userData = { tip: nap, kind: 'roller' };
  return shadowOn(g);
}
export function brush() {
  const g = new THREE.Group();
  const bris = new THREE.Mesh(new RoundedBoxGeometry(0.07, 0.06, 0.016, 2, 0.006),
    new THREE.MeshPhysicalMaterial({ color: 0xd8c7a0, map: tex('hair_detail.jpg', { srgb: true, repeat: [4, 1] }), normalMap: tex('hair_normal.jpg', { repeat: [4, 1] }), roughness: 0.6, sheen: 0.4 }));
  const pa = bris.geometry.attributes.position; for (let i = 0; i < pa.count; i++) { const y = pa.getY(i); if (y > 0.0) pa.setZ(i, pa.getZ(i) * (1 - y * 9)); }
  bris.geometry.computeVertexNormals();
  bris.rotation.z = Math.PI; g.add(bris);
  const tipM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, clearcoat: 1 });
  const tip = new THREE.Mesh(new RoundedBoxGeometry(0.071, 0.024, 0.012, 2, 0.005), tipM); tip.position.y = 0.022; g.add(tip);
  const fer = new THREE.Mesh(new RoundedBoxGeometry(0.076, 0.04, 0.022, 2, 0.008), metalMat()); fer.position.y = -0.045; g.add(fer);
  const handle = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.018, 0.003], [0.02, 0.04], [0.013, 0.1], [0.016, 0.14], [0.0, 0.15]].map(([x, y]) => new THREE.Vector2(x, y)), 20), woodMat(1.4));
  handle.scale.set(1.7, 1, 0.7); handle.rotation.z = Math.PI; handle.position.y = -0.065; g.add(handle);
  // bristles hang down from the handle: flip so +y points along the bristles
  g.rotation.z = 0;
  g.userData = { tip, kind: 'brush' };
  return shadowOn(g);
}
export function rag() {
  const geo = new THREE.PlaneGeometry(0.26, 0.2, 24, 20);
  const pa = geo.attributes.position;
  for (let i = 0; i < pa.count; i++) {
    const x = pa.getX(i), y = pa.getY(i);
    pa.setZ(i, 0.018 * noise2(x * 30, y * 30) + 0.03 * noise2(x * 9 + 3, y * 9) + 0.04 * Math.exp(-(x * x + y * y) * 60));
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xe9e4d8, map: tex('canvas_detail.jpg', { srgb: true, repeat: [3, 3] }), normalMap: tex('canvas_normal.jpg', { repeat: [3, 3] }), roughness: 0.95, sheen: 0.6, side: THREE.DoubleSide }));
  m.castShadow = true;
  return m;
}

// ---------------------------------------------------------------- crate + folded clothes
export function crate() {
  const g = new THREE.Group();
  const wm = woodMat(1.25);
  const W = 0.5, D = 0.36, H = 0.3;
  for (let i = 0; i < 3; i++) {
    for (const [w, d, x, z, ry] of [[W, 0.016, 0, D / 2, 0], [W, 0.016, 0, -D / 2, 0], [D, 0.016, W / 2, 0, Math.PI / 2], [D, 0.016, -W / 2, 0, Math.PI / 2]]) {
      const b = new THREE.Mesh(new RoundedBoxGeometry(w, 0.085, 0.016, 2, 0.004), wm); b.position.set(x, 0.05 + i * 0.1, z); b.rotation.y = ry; g.add(b);
    }
  }
  for (const [x, z] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { const p = new THREE.Mesh(new RoundedBoxGeometry(0.04, H, 0.04, 2, 0.006), wm); p.position.set(x * (W / 2 - 0.03), H / 2, z * (D / 2 - 0.03)); g.add(p); }
  const top = new THREE.Mesh(new RoundedBoxGeometry(W + 0.02, 0.018, D + 0.02, 2, 0.005), wm); top.position.y = H; g.add(top);
  shadowOn(g);
  const cs = contactShadow(0.8, 0.6, 0.7); g.add(cs);
  g.userData.top = H + 0.01;
  return g;
}
export function foldedOveralls(mat) {
  const g = new THREE.Group();
  const geo = new RoundedBoxGeometry(0.3, 0.055, 0.24, 4, 0.025);
  const pa = geo.attributes.position;
  for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), z = pa.getZ(i); pa.setY(i, pa.getY(i) + 0.006 * noise2(x * 20, z * 20) + (pa.getY(i) > 0 ? 0.01 * Math.sin(x * 25) : 0)); }
  geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo, mat));
  for (const s of [-1, 1]) { // straps lying on top
    const st = new THREE.Mesh(sweep(curve([[s * 0.06, 0.03, -0.11], [s * 0.07, 0.034, 0], [s * 0.04, 0.032, 0.12], [s * 0.1, 0.03, 0.15]], 16), () => [0.014, 0.003], { radial: 6, up: V3(0, 1, 0) }), mat);
    g.add(st);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.004, 12), new THREE.MeshStandardMaterial({ color: 0xb89a62, metalness: 1, roughness: 0.35 }));
    b.position.set(s * 0.06, 0.034, -0.1); g.add(b);
  }
  return shadowOn(g);
}

// ---------------------------------------------------------------- picture sign: grey shed -> brush -> colourful shed (no words)
export function sign() {
  const g = new THREE.Group();
  const wm = woodMat(1.1);
  const post = new THREE.Mesh(new RoundedBoxGeometry(0.07, 1.0, 0.07, 2, 0.01), wm); post.position.y = 0.5; g.add(post);
  const c = canvas(512, 340), x = c.getContext('2d');
  x.fillStyle = '#efe7d4'; x.fillRect(0, 0, 512, 340);
  for (let i = 0; i < 3000; i++) { x.fillStyle = `rgba(120,100,70,${Math.random() * 0.05})`; x.fillRect(Math.random() * 512, Math.random() * 340, 2, 2); }
  const shed = (ox, cols) => {
    x.lineJoin = 'round'; x.lineWidth = 7; x.strokeStyle = '#3d3a35';
    x.fillStyle = cols[0]; x.beginPath(); x.rect(ox, 150, 140, 120); x.fill(); x.stroke();
    x.fillStyle = cols[1]; x.beginPath(); x.moveTo(ox - 18, 155); x.lineTo(ox + 70, 80); x.lineTo(ox + 158, 155); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = cols[2]; x.beginPath(); x.rect(ox + 18, 185, 45, 85); x.fill(); x.stroke();
    x.fillStyle = '#9ec3d8'; x.beginPath(); x.rect(ox + 82, 180, 40, 36); x.fill(); x.stroke();
    if (cols[3]) { x.fillStyle = cols[3]; for (const [a, b] of [[ox + 30, 300], [ox + 70, 302], [ox + 110, 298]]) { x.beginPath(); x.arc(a, b - 10, 10, 0, TAU); x.fill(); } }
  };
  shed(22, ['#a09d96', '#8a8780', '#8f8c86']);
  shed(345, ['#6f9fca', '#b2533f', '#e5c35f', '#e5c35f']);
  // brush between
  x.save(); x.translate(255, 175); x.rotate(-0.5);
  x.fillStyle = '#a77a4a'; x.fillRect(-8, -70, 16, 70); x.fillStyle = '#9aa0a6'; x.fillRect(-14, 0, 28, 16); x.fillStyle = '#6f9fca'; x.beginPath(); x.moveTo(-14, 16); x.lineTo(14, 16); x.lineTo(10, 48); x.lineTo(-10, 48); x.fill();
  x.restore();
  x.strokeStyle = '#6f9fca'; x.lineWidth = 10; x.lineCap = 'round'; x.beginPath(); x.moveTo(205, 260); x.quadraticCurveTo(255, 230, 305, 260); x.stroke();
  // sparkles on the new shed
  x.fillStyle = '#fff7d0'; for (const [a, b] of [[350, 120], [495, 140], [470, 95]]) { x.beginPath(); for (let k = 0; k < 8; k++) { const r = k % 2 ? 4 : 13, an = k / 8 * TAU; x.lineTo(a + Math.cos(an) * r, b + Math.sin(an) * r); } x.fill(); }
  const ct = canvasTex(c);
  const board = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.42, 0.025, 2, 0.006), [wm, wm, wm, wm, new THREE.MeshStandardMaterial({ map: ct, roughness: 0.85, normalMap: tex('canvas_normal.jpg', { repeat: [3, 2] }), normalScale: new THREE.Vector2(0.3, 0.3) }), wm]);
  // RoundedBox has a single group; use a separate face plane instead
  board.material = wm;
  board.position.y = 1.05; g.add(board);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.385), new THREE.MeshStandardMaterial({ map: ct, roughness: 0.85, normalMap: tex('canvas_normal.jpg', { repeat: [3, 2] }), normalScale: new THREE.Vector2(0.3, 0.3) }));
  face.position.set(0, 1.05, 0.0135); g.add(face);
  shadowOn(g);
  const cs = contactShadow(0.3, 0.3, 0.5); g.add(cs);
  return g;
}

// ---------------------------------------------------------------- aluminium stepladder
export function ladder() {
  const g = new THREE.Group();
  const al = new THREE.MeshStandardMaterial({ color: 0xbfc2c4, metalness: 0.9, roughness: 0.45, roughnessMap: tex('metal_detail.jpg', { repeat: [1, 6] }), normalMap: tex('metal_normal.jpg', { repeat: [1, 6] }), normalScale: new THREE.Vector2(0.3, 0.3) });
  const H = 1.5, spread = 0.38, W = 0.46;
  const legs = (zs, steps) => {
    for (const sx of [-1, 1]) {
      const a = new THREE.Mesh(new RoundedBoxGeometry(0.03, Math.hypot(H, spread) + 0.04, 0.06, 2, 0.004), al);
      a.position.set(sx * W / 2, H / 2, zs * spread / 2); a.rotation.x = zs * Math.atan2(spread / 2, H) * -1 * -1; a.rotation.x = -zs * Math.atan2(spread / 2, H); g.add(a);
    }
    if (steps) for (let i = 1; i <= 4; i++) {
      const y = i * H / 5, z = zs * spread / 2 * (1 - y / H);
      const s = new THREE.Mesh(new RoundedBoxGeometry(W, 0.022, 0.09, 2, 0.004), al); s.position.set(0, y, z); g.add(s);
    }
  };
  legs(1, true); legs(-1, false);
  const top = new THREE.Mesh(new RoundedBoxGeometry(W + 0.04, 0.04, 0.16, 2, 0.008), new THREE.MeshStandardMaterial({ color: 0x3a3c3e, roughness: 0.6 })); top.position.y = H + 0.02; g.add(top);
  shadowOn(g);
  const cs = contactShadow(0.8, 0.7, 0.45); g.add(cs);
  return g;
}

// ---------------------------------------------------------------- terracotta pot with tulips
export function pot(flowerCol) {
  const g = new THREE.Group();
  const clay = new THREE.MeshStandardMaterial({ color: 0xb8653f, map: tex('clay_detail.jpg', { srgb: true }), normalMap: tex('clay_normal.jpg'), roughness: 0.9 });
  const prof = [[0, 0], [0.072, 0], [0.076, 0.004], [0.098, 0.14], [0.112, 0.142], [0.114, 0.17], [0.104, 0.172], [0.098, 0.15], [0.09, 0.15]];
  const p = new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 40), clay); p.material.side = THREE.DoubleSide; g.add(p);
  const soil = new THREE.Mesh(new THREE.CircleGeometry(0.096, 30), new THREE.MeshStandardMaterial({ color: 0x2a1d14, roughness: 1, normalMap: tex('concrete_normal.jpg', { repeat: [0.5, 0.5] }) }));
  soil.rotation.x = -Math.PI / 2; soil.position.y = 0.155; g.add(soil);
  const leafM = new THREE.MeshPhysicalMaterial({ color: 0x4f7a3a, roughness: 0.45, sheen: 0.3, side: THREE.DoubleSide, clearcoat: 0.3 });
  const petM = new THREE.MeshPhysicalMaterial({ color: flowerCol, roughness: 0.5, sheen: 0.8, sheenColor: new THREE.Color(flowerCol), side: THREE.DoubleSide });
  const flowers = [];
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * TAU + rand(-0.3, 0.3), r = rand(0.02, 0.06), h = rand(0.2, 0.3);
    const fg = new THREE.Group(); fg.position.set(Math.cos(a) * r, 0.155, Math.sin(a) * r); g.add(fg);
    const lean = V3(Math.cos(a) * 0.04, 0, Math.sin(a) * 0.04);
    const stem = sweep(curve([V3(0, 0, 0), V3(0, h * 0.5, 0).add(lean.clone().multiplyScalar(0.5)), V3(0, h, 0).add(lean)], 12), () => [0.004, 0.004], { radial: 6 });
    fg.add(new THREE.Mesh(stem, leafM));
    // tulip cup: 6 curved petals
    const head = new THREE.Group(); head.position.copy(V3(0, h, 0).add(lean)); fg.add(head);
    for (let k = 0; k < 6; k++) {
      const ang = k / 6 * TAU + (k % 2) * 0.3, rr = k % 2 ? 0.0 : 0.004;
      const pts = [V3(0, 0, 0), V3(0.016, 0.016, 0), V3(0.02, 0.035, 0), V3(0.012, 0.05, 0)].map(v => v.applyAxisAngle(V3(0, 1, 0), ang).add(V3(0, rr, 0)));
      const pg = sweep(curve(pts, 10), capped(t => [0.014 * Math.sin(Math.PI * (0.15 + t * 0.8)), 0.0015], 0.05, 0.2), { radial: 8, up: V3(Math.sin(ang), 0, Math.cos(ang)) });
      head.add(new THREE.Mesh(pg, petM));
    }
    flowers.push(fg);
    // two broad leaves
    for (const s of [-1, 1]) {
      const la = a + s * 1.2;
      const pts = [V3(0, 0, 0), V3(Math.cos(la) * 0.03, 0.08, Math.sin(la) * 0.03), V3(Math.cos(la) * 0.07, 0.13, Math.sin(la) * 0.07)];
      const lg = sweep(curve(pts, 10), capped(t => [0.018 * Math.sin(Math.PI * (0.1 + t * 0.85)), 0.002], 0.05, 0.3), { radial: 8, up: V3(-Math.sin(la), 0, Math.cos(la)) });
      fg.add(new THREE.Mesh(lg, leafM));
    }
  }
  shadowOn(g);
  const cs = contactShadow(0.36, 0.36, 0.65); g.add(cs);
  g.userData.flowers = flowers;
  return g;
}

// ---------------------------------------------------------------- sparrow
export function bird() {
  const g = new THREE.Group();
  const c = canvas(256, 128), x = c.getContext('2d');
  x.fillStyle = '#8a6a48'; x.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 400; i++) { x.fillStyle = Math.random() < 0.5 ? 'rgba(60,40,25,0.5)' : 'rgba(200,170,130,0.45)'; const px = Math.random() * 256, py = Math.random() * 128; x.fillRect(px, py, 2, 6 + Math.random() * 8); }
  x.fillStyle = 'rgba(235,225,205,0.95)'; x.fillRect(0, 70, 256, 58); // pale belly band (v low)
  const ft = canvasTex(c);
  const feather = new THREE.MeshPhysicalMaterial({ map: ft, roughness: 0.75, sheen: 0.6, sheenRoughness: 0.6, sheenColor: new THREE.Color(0xd8c0a0) });
  const body = new THREE.Mesh(sweep(curve([[0, 0, -0.06], [0, 0.005, -0.02], [0, 0.012, 0.02], [0, 0.03, 0.045]], 16), capped(keys([[0, 0.012, 0.012], [0.35, 0.03, 0.032], [0.75, 0.026, 0.026], [1, 0.02, 0.02]]), 0.25, 0.2), { radial: 16, up: V3(0, -1, 0) }), feather);
  g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.021, 20, 14), new THREE.MeshPhysicalMaterial({ color: 0x6d5a4a, roughness: 0.7, sheen: 0.5 }));
  head.position.set(0, 0.045, 0.05); g.add(head);
  const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.0185, 16, 10), new THREE.MeshStandardMaterial({ color: 0xe8e2d6, roughness: 0.8 })); cheek.position.set(0, 0.04, 0.056); cheek.scale.set(1.06, 0.7, 0.8); g.add(cheek);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.006, 0.016, 10), new THREE.MeshStandardMaterial({ color: 0x2a2420, roughness: 0.4 })); beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.043, 0.075); g.add(beak);
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.0038, 10, 8), new THREE.MeshPhysicalMaterial({ color: 0x050505, roughness: 0.05, clearcoat: 1 })); e.position.set(s * 0.0155, 0.05, 0.062); g.add(e);
    const w = new THREE.Group(); w.position.set(s * 0.025, 0.02, 0.01); g.add(w);
    const wing = new THREE.Mesh(sweep(curve([[0, 0, 0.02], [s * 0.004, 0.0, -0.02], [s * 0.002, -0.006, -0.06]], 10), capped(t => [0.02 * (1 - t * 0.6), 0.004], 0.1, 0.3), { radial: 10, up: V3(s, 0, 0) }), feather);
    w.add(wing); g.userData['wing' + s] = w;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.0016, 0.0016, 0.025, 5), new THREE.MeshStandardMaterial({ color: 0x8a6e5a, roughness: 0.6 })); leg.position.set(s * 0.008, -0.025, 0.0); g.add(leg);
  }
  const tail = new THREE.Mesh(sweep(curve([[0, 0.005, -0.05], [0, -0.002, -0.08], [0, -0.008, -0.11]], 8), capped(t => [0.008 + t * 0.012, 0.002], 0.1, 0.1), { radial: 8, up: V3(1, 0, 0) }), feather);
  g.add(tail);
  g.position.y = 0.035;
  const root = new THREE.Group(); root.add(g);
  shadowOn(root);
  root.userData.body = g;
  return root;
}

// ---------------------------------------------------------------- thought bubble with a can picture
export function bubble(col) {
  const c = canvas(256, 256), x = c.getContext('2d');
  const draw = (col) => {
    x.clearRect(0, 0, 256, 256);
    x.fillStyle = 'rgba(255,255,255,0.95)'; x.strokeStyle = 'rgba(120,120,120,0.5)'; x.lineWidth = 4;
    x.beginPath(); for (let k = 0; k < 10; k++) { const a = k / 10 * TAU; x.arc(128 + Math.cos(a) * 70, 110 + Math.sin(a) * 62, 34, a - 1.2, a + 1.2); } x.closePath(); x.fill(); x.stroke();
    x.beginPath(); x.arc(70, 210, 14, 0, TAU); x.fill(); x.stroke(); x.beginPath(); x.arc(48, 238, 8, 0, TAU); x.fill(); x.stroke();
    // can
    x.fillStyle = '#b9bcbf'; x.fillRect(93, 70, 70, 80); x.beginPath(); x.ellipse(128, 150, 35, 10, 0, 0, Math.PI); x.fill();
    x.fillStyle = col; x.beginPath(); x.ellipse(128, 70, 35, 11, 0, 0, TAU); x.fill();
    x.fillRect(93, 70, 70, 16); for (const dx of [100, 122, 150]) { x.fillRect(dx, 80, 8, 18 + (dx % 3) * 6); x.beginPath(); x.arc(dx + 4, 98 + (dx % 3) * 6, 4, 0, TAU); x.fill(); }
    x.strokeStyle = '#6d7073'; x.lineWidth = 3; x.beginPath(); x.ellipse(128, 70, 35, 11, 0, 0, TAU); x.stroke();
    t.needsUpdate = true;
  };
  const t = canvasTex(c);
  draw(col);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  s.scale.set(0.42, 0.42, 1); s.renderOrder = 10;
  s.userData.draw = draw;
  return s;
}
