// Props: stool, folded apron, rubber gloves, picture sign, wicker basket, indigo stock jar,
// wooden clothespins, and the apron worn by the girl (a skinned cloth sheet).
import * as THREE from '../vendor/three.module.min.js';
import { tex, contactShadow } from './world.js';

const V3 = THREE.Vector3;

export function canvasCloth(T, opts = {}) {
  const N = 512, cv = document.createElement('canvas'); cv.width = cv.height = N; const g = cv.getContext('2d');
  g.fillStyle = opts.base || '#cdbb98'; g.fillRect(0, 0, N, N);
  // slub variation
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? '255,250,235' : '120,100,70'},${Math.random() * 0.06})`; g.fillRect(Math.random() * N, Math.random() * N, 1 + Math.random() * 30, 1); }
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? '255,250,235' : '120,100,70'},${Math.random() * 0.05})`; g.fillRect(Math.random() * N, Math.random() * N, 1, 1 + Math.random() * 30); }
  if (opts.stitch) {
    g.strokeStyle = 'rgba(90,70,50,0.55)'; g.lineWidth = 2; g.setLineDash([7, 6]);
    g.strokeRect(12, 12, N - 24, N - 24);
    if (opts.pocket) { g.strokeRect(N * 0.3, N * 0.55, N * 0.4, N * 0.2); g.beginPath(); g.moveTo(N * 0.5, N * 0.55); g.lineTo(N * 0.5, N * 0.75); g.stroke(); }
    g.setLineDash([]);
  }
  if (opts.stains) {
    for (let i = 0; i < 7; i++) {
      const x = N * (0.2 + Math.random() * 0.6), y = N * (0.5 + Math.random() * 0.45), r = 4 + Math.random() * 14;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(50,70,120,0.35)'); gr.addColorStop(1, 'rgba(50,70,120,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

// ---------------------------------------------------------------- apron worn by the girl
export function buildApron(person, T) {
  const b = person.data.header.body; const J = person.J;
  const [ytop, ybib, ybot] = b.apronY; const zf = b.apronZ - 0.004; const Rc = 0.15, cz = zf - Rc;
  const H = person.H / 1.1;
  const hw = (y) => { const bibW = 0.068 * H, skW = 0.118 * H + 0.015 * Math.max(0, Math.min(1, (ybib - y) / 0.2)); const t = THREE.MathUtils.smoothstep(y, ybib - 0.03, ybib + 0.01); return skW * (1 - t) + bibW * t; };
  const NU = 22, NV = 40; const pos = [], uv = [], si = [], sw = [], idx = [];
  const waist = b.waist;
  for (let j = 0; j <= NV; j++) {
    const v = j / NV; const y = ytop + (ybot - ytop) * v;
    const half = hw(y);
    for (let i = 0; i <= NU; i++) {
      const u = i / NU * 2 - 1;
      const phi = u * half / Rc;
      const skirt = Math.max(0, Math.min(1, (ybib - 0.02 - y) / 0.25));
      const bulge = 0.012 * Math.exp(-(((y - (ybib - 0.07)) / 0.06) ** 2)) + skirt * (0.004 * Math.sin(u * 7 + 1.3) + 0.003 * Math.sin(u * 13));
      const r = Rc + bulge;
      pos.push(Math.sin(phi) * r, y, cz + Math.cos(phi) * r);
      uv.push(i / NU, 1 - v);
      const wc = THREE.MathUtils.smoothstep(y, waist - 0.02, waist + 0.06);
      si.push(3, 1, 0, 0); sw.push(wc, 1 - wc, 0, 0);
    }
  }
  for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) {
    const a = j * (NU + 1) + i, c = a + NU + 1;
    idx.push(a, c, a + 1, a + 1, c, c + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
  g.setIndex(idx); g.computeVertexNormals();
  const map = canvasCloth(T, { base: '#c9b591', stitch: true, pocket: true, stains: true });
  const mat = new THREE.MeshPhysicalMaterial({ map, roughness: 0.92, sheen: 0.5, sheenColor: new THREE.Color(0.9, 0.85, 0.75), side: THREE.DoubleSide, bumpMap: T.detCanvas, bumpScale: 1.2 });
  const bm = T.detCanvas.clone(); bm.repeat.set(14, 22); bm.needsUpdate = true; mat.bumpMap = bm;
  const group = new THREE.Group();
  const sm = new THREE.SkinnedMesh(g, mat); sm.castShadow = true; sm.receiveShadow = true; sm.frustumCulled = false;
  person.root.add(sm); sm.bind(person.skeleton, new THREE.Matrix4());
  // straps: neck loop and waist ties (tubes), skinned rigidly to chest / hips
  const strapMat = new THREE.MeshPhysicalMaterial({ map, roughness: 0.9, sheen: 0.4, sheenColor: new THREE.Color(0.9, 0.85, 0.75) });
  const nk = J.neckJ; const bibW = hw(ytop) - 0.006;
  const mkTube = (pts, bone, closed = false, r = 0.0055) => {
    const curve = new THREE.CatmullRomCurve3(pts, closed);
    const tg = new THREE.TubeGeometry(curve, 40, r, 6, closed);
    tg.scale(1, 1, 1);
    const n = tg.attributes.position.count;
    tg.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Array(n * 4).fill(0).map((_, i) => (i % 4 === 0 ? bone : 0)), 4));
    tg.setAttribute('skinWeight', new THREE.Float32BufferAttribute(new Array(n * 4).fill(0).map((_, i) => (i % 4 === 0 ? 1 : 0)), 4));
    const m = new THREE.SkinnedMesh(tg, strapMat); m.castShadow = true; m.frustumCulled = false;
    person.root.add(m); m.bind(person.skeleton, new THREE.Matrix4());
    return m;
  };
  const yTopZ = (x) => cz + Math.cos(x / Rc) * Rc;
  const s1 = mkTube([new V3(bibW, ytop - 0.004, yTopZ(bibW) - 0.002), new V3(0.05 * H, nk.y + 0.0, 0.045 * H), new V3(0.04 * H, nk.y + 0.03 * H, 0.0), new V3(0.0, nk.y + 0.035 * H, -0.035 * H), new V3(-0.04 * H, nk.y + 0.03 * H, 0.0), new V3(-0.05 * H, nk.y + 0.0, 0.045 * H), new V3(-bibW, ytop - 0.004, yTopZ(bibW) - 0.002)], 3);
  // waist tie around the body following the torso section
  const tb = b.torso; const ty = b.apronTieY;
  const lerpT = (y, c) => { for (let i = 0; i < tb.length - 1; i++) if (y >= tb[i][0] && y <= tb[i + 1][0]) { const t = (y - tb[i][0]) / (tb[i + 1][0] - tb[i][0]); return tb[i][c] + (tb[i + 1][c] - tb[i][c]) * t; } return tb[0][c]; };
  const a = lerpT(ty, 1) + 0.014, bb = lerpT(ty, 2) + 0.014, zc = lerpT(ty, 3);
  const ring = []; for (let i = 0; i < 24; i++) { const ang = i / 24 * Math.PI * 2; ring.push(new V3(Math.sin(ang) * a, ty, zc + Math.cos(ang) * bb)); }
  mkTube(ring, 1, true, 0.005);
  // bow at the back
  const bz = zc - bb - 0.004;
  mkTube([new V3(0, ty, bz), new V3(0.03, ty + 0.018, bz - 0.01), new V3(0.05, ty, bz - 0.006), new V3(0.03, ty - 0.012, bz - 0.008), new V3(0, ty, bz)], 1, false, 0.006);
  mkTube([new V3(0, ty, bz), new V3(-0.03, ty + 0.018, bz - 0.01), new V3(-0.05, ty, bz - 0.006), new V3(-0.03, ty - 0.012, bz - 0.008), new V3(0, ty, bz)], 1, false, 0.006);
  mkTube([new V3(0, ty, bz), new V3(0.012, ty - 0.05, bz - 0.012), new V3(0.02, ty - 0.1, bz - 0.006)], 1, false, 0.0055);
  mkTube([new V3(0, ty, bz), new V3(-0.01, ty - 0.055, bz - 0.01), new V3(-0.022, ty - 0.11, bz - 0.004)], 1, false, 0.0055);
  const parts = person.root.children.filter((c) => c.isSkinnedMesh && (c.material === mat || c.material === strapMat));
  return { parts, map, mat };
}

// ---------------------------------------------------------------- stool with folded apron & gloves
export function buildStool(world, T, girl) {
  const g = new THREE.Group();
  const W = 0.5, D = 0.3, Hh = 0.34;
  const top = new THREE.Mesh(new THREE.BoxGeometry(W, 0.03, D), world.mats.wood); top.position.y = Hh; top.castShadow = top.receiveShadow = true; g.add(top);
  for (const [x, z] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.035, Hh, 0.035), world.mats.wood); l.position.set(x * (W / 2 - 0.04), Hh / 2, z * (D / 2 - 0.04)); l.castShadow = true; g.add(l);
    const c = contactShadow(0.12, 0.12, 0.8); c.position.set(x * (W / 2 - 0.04), 0.017, z * (D / 2 - 0.04)); g.add(c);
  }
  const cs = contactShadow(0.7, 0.5, 0.35); cs.position.y = 0.017; g.add(cs);
  // folded apron: soft slab with drooping strap
  const amap = canvasCloth(T, { base: '#c9b591', stitch: true });
  const ag = new THREE.BoxGeometry(0.22, 0.04, 0.17, 12, 2, 10);
  const p = ag.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const r = Math.hypot(x / 0.11, z / 0.085); p.setY(i, y * (1 - 0.35 * Math.pow(Math.min(1, r), 4)) + 0.002 * Math.sin(x * 70) * (y > 0 ? 1 : 0)); p.setX(i, x * (1 - 0.04 * Math.abs(y) / 0.02)); }
  ag.computeVertexNormals();
  const amat = new THREE.MeshPhysicalMaterial({ map: amap, roughness: 0.92, sheen: 0.5, sheenColor: new THREE.Color(0.9, 0.85, 0.75) });
  const apron = new THREE.Mesh(ag, amat); apron.position.set(-0.11, Hh + 0.035, 0.0); apron.rotation.y = 0.15; apron.castShadow = true; apron.receiveShadow = true; g.add(apron);
  const strap = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new V3(-0.2, Hh + 0.03, 0.05), new V3(-0.25, Hh + 0.01, 0.09), new V3(-0.255, Hh - 0.08, 0.1), new V3(-0.25, Hh - 0.14, 0.08)]), 20, 0.005, 6), amat);
  strap.castShadow = true; g.add(strap);
  // gloves (reuse the girl's glove sculpt as a static pair)
  const gloves = new THREE.Group();
  const gm = girl.meshes.gloveL.material;
  for (const [s, dx, rot] of [['L', 0, 0.2], ['R', 0.045, -0.15]]) {
    const geo = girl.meshes['glove' + s].geometry.clone();
    geo.deleteAttribute('skinIndex'); geo.deleteAttribute('skinWeight');
    geo.computeBoundingBox(); const c = geo.boundingBox.getCenter(new V3()); geo.translate(-c.x, -c.y, -c.z);
    const m = new THREE.Mesh(geo, gm); m.castShadow = true;
    const holder = new THREE.Group(); holder.add(m);
    // lay flat: fingers pointing toward camera
    m.rotation.set(Math.PI / 2 * 0.95, 0, (s === 'L' ? -1 : 1) * 0.45);
    holder.position.set(0.12 + dx, Hh + 0.03, -0.01 + dx * 0.3); holder.rotation.y = rot;
    gloves.add(holder);
  }
  g.add(gloves);
  return { group: g, apron, strap, gloves, top: Hh };
}

// ---------------------------------------------------------------- picture sign (rules, no words)
export function buildSign(world) {
  const N = 512, cv = document.createElement('canvas'); cv.width = N; cv.height = N * 0.7; const g = cv.getContext('2d');
  // chalkboard
  g.fillStyle = '#2f3b33'; g.fillRect(0, 0, N, N * 0.7);
  for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`; g.fillRect(Math.random() * N, Math.random() * N, 2, 2); }
  const chalk = (c, w = 5) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; };
  const shirt = (x, y, s, fill) => {
    g.beginPath(); g.moveTo(x - 0.5 * s, y - 0.4 * s); g.lineTo(x - 0.2 * s, y - 0.5 * s); g.quadraticCurveTo(x, y - 0.35 * s, x + 0.2 * s, y - 0.5 * s); g.lineTo(x + 0.5 * s, y - 0.4 * s);
    g.lineTo(x + 0.45 * s, y - 0.15 * s); g.lineTo(x + 0.3 * s, y - 0.2 * s); g.lineTo(x + 0.3 * s, y + 0.5 * s); g.lineTo(x - 0.3 * s, y + 0.5 * s); g.lineTo(x - 0.3 * s, y - 0.2 * s); g.lineTo(x - 0.45 * s, y - 0.15 * s); g.closePath();
    if (fill) { g.save(); g.clip(); fill(); g.restore(); }
    g.stroke();
  };
  const H = N * 0.7;
  chalk('rgba(245,245,240,0.92)');
  // 1 white shirt
  shirt(70, H * 0.38, 90);
  // arrow
  const arrow = (x) => { chalk('rgba(240,230,170,0.85)', 4); g.beginPath(); g.moveTo(x, H * 0.38); g.lineTo(x + 34, H * 0.38); g.moveTo(x + 24, H * 0.31); g.lineTo(x + 36, H * 0.38); g.lineTo(x + 24, H * 0.45); g.stroke(); };
  arrow(122);
  // 2 shirt with string knots
  chalk('rgba(245,245,240,0.92)'); shirt(210, H * 0.38, 80);
  chalk('rgba(230,200,150,0.95)', 5); for (const [x, y] of [[200, H * 0.33], [222, H * 0.46]]) { g.beginPath(); g.ellipse(x, y, 10, 4, 0, 0, Math.PI * 2); g.stroke(); }
  arrow(258);
  // 3 tub
  chalk('rgba(200,210,220,0.9)', 5); g.beginPath(); g.moveTo(305, H * 0.3); g.lineTo(315, H * 0.52); g.lineTo(365, H * 0.52); g.lineTo(375, H * 0.3); g.stroke();
  g.fillStyle = 'rgba(80,120,200,0.8)'; g.beginPath(); g.ellipse(340, H * 0.31, 34, 7, 0, 0, Math.PI * 2); g.fill();
  arrow(388);
  // 4 patterned shirt
  chalk('rgba(245,245,240,0.92)');
  shirt(462, H * 0.38, 90, () => {
    g.fillStyle = 'rgba(70,110,200,0.85)'; g.fillRect(400, 0, 130, H);
    g.strokeStyle = 'rgba(245,245,245,0.9)'; g.lineWidth = 5;
    for (const r of [8, 18, 28]) { g.beginPath(); g.arc(452, H * 0.36, r, 0, Math.PI * 2); g.stroke(); }
    g.fillStyle = 'rgba(220,120,160,0.8)'; g.beginPath(); g.arc(478, H * 0.52, 14, 0, Math.PI * 2); g.fill();
  });
  // bottom row: apron + gloves first, then smile
  chalk('rgba(230,200,150,0.9)', 4);
  g.beginPath(); g.moveTo(170, H * 0.68); g.lineTo(195, H * 0.68); g.lineTo(200, H * 0.92); g.lineTo(165, H * 0.92); g.closePath(); g.stroke();
  chalk('rgba(240,150,180,0.9)', 5); g.beginPath(); g.moveTo(240, H * 0.92); g.lineTo(240, H * 0.74); g.moveTo(246, H * 0.74); g.lineTo(246, H * 0.9); g.moveTo(252, H * 0.75); g.lineTo(252, H * 0.9); g.stroke();
  chalk('rgba(250,230,120,0.9)', 4); g.beginPath(); g.arc(330, H * 0.8, 22, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(330, H * 0.8, 13, 0.3, Math.PI - 0.3); g.stroke();
  g.fillStyle = 'rgba(250,230,120,0.9)'; g.beginPath(); g.arc(322, H * 0.76, 2.5, 0, 7); g.arc(338, H * 0.76, 2.5, 0, 7); g.fill();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const grp = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.42, 0.02), [world.mats.wood, world.mats.wood, world.mats.wood, world.mats.wood, new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }), world.mats.wood]);
  board.position.y = 0.78; board.rotation.x = -0.18; board.castShadow = true; grp.add(board);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.46, 0.015), world.mats.wood); frame.position.set(0, 0.78, -0.012); frame.rotation.x = -0.18; grp.add(frame);
  for (const [x, rz, rx] of [[-0.25, 0.04, -0.18], [0.25, -0.04, -0.18]]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.0, 0.03), world.mats.wood); l.position.set(x, 0.5, 0.02); l.rotation.set(rx, 0, rz); l.castShadow = true; grp.add(l); }
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.95, 0.03), world.mats.wood); back.position.set(0, 0.47, -0.2); back.rotation.x = 0.35; back.castShadow = true; grp.add(back);
  const cs = contactShadow(0.8, 0.5, 0.4); cs.position.y = 0.017; grp.add(cs);
  return grp;
}

// ---------------------------------------------------------------- wicker basket
export function buildBasket(world) {
  const N = 256, cv = document.createElement('canvas'); cv.width = cv.height = N; const g = cv.getContext('2d');
  g.fillStyle = '#7a5a36'; g.fillRect(0, 0, N, N);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 16; x++) {
    const off = (y % 2) * 8; const X = x * 16 + off, Y = y * 32;
    const gr = g.createLinearGradient(X, Y, X, Y + 30); gr.addColorStop(0, '#9c7848'); gr.addColorStop(0.5, '#d2ad74'); gr.addColorStop(1, '#8a6638');
    g.fillStyle = gr; g.beginPath(); g.ellipse(X + 8, Y + 16, 7, 15, 0, 0, Math.PI * 2); g.fill();
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 1.5);
  const bump = new THREE.CanvasTexture(cv); bump.wrapS = bump.wrapT = THREE.RepeatWrapping; bump.repeat.copy(t.repeat);
  const mat = new THREE.MeshStandardMaterial({ map: t, bumpMap: bump, bumpScale: 3, roughness: 0.85, side: THREE.DoubleSide });
  const pts = []; for (let i = 0; i <= 10; i++) { const y = i / 10 * 0.24; pts.push(new THREE.Vector2(0.17 + 0.05 * (y / 0.24), y)); }
  const grp = new THREE.Group();
  const wall = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), mat); wall.castShadow = wall.receiveShadow = true; grp.add(wall);
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.17, 32).rotateX(-Math.PI / 2), mat); bottom.position.y = 0.01; grp.add(bottom);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.222, 0.012, 8, 48).rotateX(Math.PI / 2), mat); rim.position.y = 0.24; rim.castShadow = true; grp.add(rim);
  const cs = contactShadow(0.6, 0.6, 0.75); cs.position.y = 0.002; grp.add(cs);
  return { group: grp, mat, R: 0.2, H: 0.24 };
}

// ---------------------------------------------------------------- indigo stock jar
export function buildJar() {
  const grp = new THREE.Group();
  const pts = [new THREE.Vector2(0.0, 0), new THREE.Vector2(0.09, 0), new THREE.Vector2(0.1, 0.02), new THREE.Vector2(0.1, 0.24), new THREE.Vector2(0.07, 0.29), new THREE.Vector2(0.05, 0.3), new THREE.Vector2(0.05, 0.33), new THREE.Vector2(0.055, 0.335)];
  const glass = new THREE.Mesh(new THREE.LatheGeometry(pts, 48), new THREE.MeshPhysicalMaterial({ color: 0xcfe0da, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.14, clearcoat: 1, specularIntensity: 1, side: THREE.DoubleSide, depthWrite: false }));
  glass.renderOrder = 3; grp.add(glass);
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.094, 0.088, 0.2, 40), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0.03, 0.05, 0.11), roughness: 0.1, clearcoat: 0.6 }));
  liquid.position.y = 0.115; liquid.castShadow = true; grp.add(liquid);
  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.043, 0.04, 20), new THREE.MeshStandardMaterial({ color: 0xa47e52, roughness: 0.95 }));
  cork.position.y = 0.335; grp.add(cork);
  const cs = contactShadow(0.3, 0.3, 0.75); cs.position.y = 0.002; grp.add(cs);
  return { group: grp, liquid, cork };
}

// ---------------------------------------------------------------- clothespin
let PIN_GEO = null;
export function clothespin(world) {
  if (!PIN_GEO) {
    const s = new THREE.Shape(); s.moveTo(-0.004, 0); s.lineTo(0.004, 0); s.lineTo(0.005, 0.05); s.quadraticCurveTo(0.004, 0.072, 0.0, 0.074); s.quadraticCurveTo(-0.004, 0.072, -0.005, 0.05); s.closePath();
    PIN_GEO = new THREE.ExtrudeGeometry(s, { depth: 0.009, bevelEnabled: true, bevelSize: 0.001, bevelThickness: 0.001, bevelSegments: 2 });
    PIN_GEO.translate(0, -0.05, -0.0045);
  }
  const m = new THREE.MeshStandardMaterial({ color: 0xe6c99a, roughness: 0.7 });
  const g = new THREE.Group();
  for (const dz of [-0.005, 0.005]) { const half = new THREE.Mesh(PIN_GEO, m); half.position.z = dz; half.castShadow = true; g.add(half); }
  const spring = new THREE.Mesh(new THREE.TorusGeometry(0.006, 0.0012, 6, 12), new THREE.MeshStandardMaterial({ color: 0xb8b8b8, metalness: 1, roughness: 0.3 }));
  spring.rotation.y = Math.PI / 2; spring.position.y = -0.005; g.add(spring);
  return g;
}
