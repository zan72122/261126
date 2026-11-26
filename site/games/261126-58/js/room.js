// Living-room set: walls, floor, ceiling, window, door, table, pendant lamp, sideboard, sign, switch.
import * as THREE from 'three';
import { pbr, canvasTex, texSet } from './tex.js';
import { PumpkinShape, shellGeometry } from './pumpkin.js';
import { RoundedBoxGeometry } from './rbox.js';

export const ROOM = { x0: -2.4, x1: 2.6, z0: -1.6, z1: 3.0, h: 2.45, tableY: 0.74 };

function box(w, h, d, mat, r = 0.004, seg = 2) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, seg, r), mat);
  m.castShadow = true; m.receiveShadow = true; return m;
}

export function decorPumpkin(seed, R, colA, colB, stripe) {
  const S = new PumpkinShape(seed, R, { hr: 0.7 + (seed % 5) * 0.04 });
  const g = shellGeometry(S, 0, 1, 64, 40, 1);
  const pt = texSet('pumpkin');
  const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughnessMap: pt.ormMap, roughness: 1, normalMap: pt.normalMap, clearcoat: 0.3, clearcoatRoughness: 0.4, sheen: 0.2 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uDetail = { value: pt.map }; sh.uniforms.uA = { value: new THREE.Color(colA) }; sh.uniforms.uB = { value: new THREE.Color(colB) };
    sh.uniforms.uRibs = { value: S.ribs }; sh.uniforms.uStripe = { value: stripe ? 1 : 0 };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec2 puv; varying vec2 vPuv;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvPuv = puv;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec2 vPuv; uniform sampler2D uDetail; uniform vec3 uA, uB; uniform float uRibs, uStripe;')
      .replace('#include <map_fragment>', `
        float lobe = pow(abs(sin(uRibs * vPuv.x * 3.14159265)), 0.5);
        vec3 c = mix(uB, uA, lobe * 0.8 + 0.2) * texture2D(uDetail, vPuv * vec2(3.0, 1.2)).rgb * 2.0;
        c = mix(c, uB * 0.45, uStripe * (1.0 - smoothstep(0.08, 0.3, lobe)) * smoothstep(0.05, 0.25, vPuv.y));
        c = mix(vec3(0.3, 0.33, 0.15), c, smoothstep(0.02, 0.12, vPuv.y));
        diffuseColor.rgb *= c;`);
  };
  m.customProgramCacheKey = () => 'decorpk';
  const mesh = new THREE.Mesh(g, m); mesh.castShadow = true; mesh.receiveShadow = true;
  const grp = new THREE.Group(); grp.add(mesh); mesh.position.y = -S.bottomY();
  // small stem
  const st = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.06, R * 0.09, R * 0.3, 8), new THREE.MeshStandardMaterial({ color: 0x4d4a26, roughness: 0.85 }));
  st.position.y = -S.bottomY() + S.topY() + R * 0.08; st.rotation.z = 0.2; st.castShadow = true;
  grp.add(st);
  return grp;
}

function nightBackdrop() {
  return canvasTex(1024, 512, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0a1222'); sky.addColorStop(0.55, '#1a2a48'); sky.addColorStop(0.75, '#2a3650'); sky.addColorStop(1, '#141a20');
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    // moon glow
    const mx = w * 0.7, my = h * 0.22;
    let gr = g.createRadialGradient(mx, my, 0, mx, my, 160);
    gr.addColorStop(0, 'rgba(220,225,255,0.55)'); gr.addColorStop(1, 'rgba(120,140,200,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#f4f1e4'; g.beginPath(); g.arc(mx, my, 22, 0, 7); g.fill();
    g.fillStyle = 'rgba(200,195,180,0.5)'; g.beginPath(); g.arc(mx - 6, my + 4, 6, 0, 7); g.fill(); g.beginPath(); g.arc(mx + 7, my - 6, 4, 0, 7); g.fill();
    // stars
    for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.6 + 0.2})`; g.fillRect(Math.random() * w, Math.random() * h * 0.5, 1.3, 1.3); }
    // tree line
    g.fillStyle = '#070a0e';
    for (let x = -20; x < w + 40; x += 6) {
      const th = h * 0.62 + Math.sin(x * 0.013) * 30 + Math.sin(x * 0.05) * 12 + Math.random() * 10;
      g.beginPath(); g.ellipse(x, th, 18 + Math.random() * 20, 40 + Math.random() * 50, 0, 0, 7); g.fill();
    }
    g.fillRect(0, h * 0.7, w, h * 0.3);
    // a neighbour house with warm windows
    g.fillStyle = '#0d1016'; g.fillRect(w * 0.12, h * 0.5, 220, 140);
    g.beginPath(); g.moveTo(w * 0.12 - 20, h * 0.5); g.lineTo(w * 0.12 + 110, h * 0.36); g.lineTo(w * 0.12 + 240, h * 0.5); g.fill();
    for (const [x, y] of [[w * 0.12 + 30, h * 0.56], [w * 0.12 + 140, h * 0.56]]) {
      gr = g.createRadialGradient(x + 20, y + 18, 0, x + 20, y + 18, 60);
      gr.addColorStop(0, 'rgba(255,180,90,0.35)'); gr.addColorStop(1, 'rgba(255,160,60,0)');
      g.fillStyle = gr; g.fillRect(x - 40, y - 40, 120, 120);
      g.fillStyle = '#e09a4c'; g.fillRect(x, y, 40, 36);
      g.fillStyle = '#0d1016'; g.fillRect(x + 19, y, 2, 36); g.fillRect(x, y + 17, 40, 2);
    }
    // garden lanterns glowing far away
    for (const [x, y] of [[w * 0.45, h * 0.8], [w * 0.52, h * 0.83], [w * 0.6, h * 0.86]]) {
      gr = g.createRadialGradient(x, y, 0, x, y, 30); gr.addColorStop(0, 'rgba(255,170,60,0.9)'); gr.addColorStop(1, 'rgba(255,120,30,0)');
      g.fillStyle = gr; g.fillRect(x - 30, y - 30, 60, 60);
    }
  });
}

function chalkSign() {
  return canvasTex(768, 512, (g, w, h) => {
    g.fillStyle = '#1d2621'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`; const r = Math.random() * 40; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, r, 0, 7); g.fill(); }
    const chalk = (col, wdt, fn) => {
      for (let pass = 0; pass < 3; pass++) {
        g.strokeStyle = col; g.globalAlpha = 0.45 + pass * 0.15; g.lineWidth = wdt * (1 - pass * 0.2); g.lineCap = 'round'; g.lineJoin = 'round';
        g.save(); g.translate((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2); g.beginPath(); fn(g); g.stroke(); g.restore();
      }
      g.globalAlpha = 1;
    };
    const pk = (cx, cy, s, face, glow) => {
      if (glow) { const gr = g.createRadialGradient(cx, cy, 0, cx, cy, s * 1.6); gr.addColorStop(0, 'rgba(255,200,90,0.45)'); gr.addColorStop(1, 'rgba(255,200,90,0)'); g.fillStyle = gr; g.fillRect(cx - s * 2, cy - s * 2, s * 4, s * 4); }
      chalk('#f0a25a', 5, (c) => { for (const k of [-0.55, 0, 0.55]) c.ellipse(cx + k * s * 0.7, cy, s * 0.55, s * 0.75, 0, 0, 7); });
      chalk('#9cc27a', 5, (c) => { c.moveTo(cx, cy - s * 0.72); c.lineTo(cx + 4, cy - s * 1.05); });
      if (face) {
        g.fillStyle = glow ? '#ffe28a' : '#f0a25a';
        for (const k of [-1, 1]) { g.beginPath(); g.moveTo(cx + k * s * 0.32, cy - s * 0.32); g.lineTo(cx + k * s * 0.32 - s * 0.13, cy - s * 0.1); g.lineTo(cx + k * s * 0.32 + s * 0.13, cy - s * 0.1); g.fill(); }
        g.beginPath(); g.ellipse(cx, cy + s * 0.12, s * 0.42, s * 0.28, 0, 0, Math.PI); g.fill();
      }
    };
    const arrow = (x, y) => chalk('#f3efe2', 4, (c) => { c.moveTo(x - 18, y); c.lineTo(x + 18, y); c.moveTo(x + 8, y - 9); c.lineTo(x + 18, y); c.lineTo(x + 8, y + 9); });
    pk(105, 150, 70, false, false); arrow(205, 150);
    // spoon
    chalk('#e9e6dc', 6, (c) => { c.ellipse(300, 120, 22, 32, 0.5, 0, 7); c.moveTo(312, 146); c.lineTo(352, 222); });
    // seeds
    for (let i = 0; i < 7; i++) chalk('#f6ebc4', 3, (c) => c.ellipse(275 + i * 13, 238 + (i % 2) * 6, 6, 3, 0.4, 0, 7));
    arrow(395, 150);
    // star stamp
    chalk('#f6e27a', 6, (c) => { for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 22 : 52; const x = 490 + Math.cos(a) * r, y = 150 + Math.sin(a) * r; i ? c.lineTo(x, y) : c.moveTo(x, y); } });
    arrow(585, 150);
    // candle
    chalk('#f3efe2', 6, (c) => { c.rect(650, 140, 40, 60); });
    const gr = g.createRadialGradient(670, 118, 0, 670, 118, 40); gr.addColorStop(0, 'rgba(255,210,100,0.8)'); gr.addColorStop(1, 'rgba(255,170,60,0)');
    g.fillStyle = gr; g.fillRect(620, 70, 100, 100);
    chalk('#ffd36a', 5, (c) => { c.moveTo(670, 100); c.quadraticCurveTo(684, 122, 670, 136); c.quadraticCurveTo(656, 122, 670, 100); });
    // big glowing lantern + moon light dots
    pk(384, 380, 95, true, true);
    for (const [x, y, r] of [[150, 400, 18], [600, 390, 14], [640, 330, 9], [120, 320, 10]]) chalk('#ffe28a', 4, (c) => c.arc(x, y, r, 0, 7));
    chalk('#ffe28a', 4, (c) => { for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 8 : 20; const x = 210 + Math.cos(a) * r, y = 320 + Math.sin(a) * r; i ? c.lineTo(x, y) : c.moveTo(x, y); } });
    arrow(384, 255);
    g.save(); g.translate(384, 255); g.rotate(Math.PI / 2); g.translate(-384, -255); g.restore();
  });
}

export function buildRoom(scene) {
  const R = ROOM;
  const grp = new THREE.Group(); scene.add(grp);
  const W = R.x1 - R.x0, D = R.z1 - R.z0;
  // floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), pbr('floor', { repeat: [W / 1.6, D / 1.6], roughness: 1, normal: 1.0 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set((R.x0 + R.x1) / 2, 0, (R.z0 + R.z1) / 2); floor.receiveShadow = true;
  grp.add(floor);
  // rug under the table
  const rugM = pbr('linen', { repeat: [5, 4], color: 0x8c5a3c, roughness: 1, normal: 2 });
  const rug = box(2.6, 0.012, 2.0, rugM, 0.005); rug.position.set(0, 0.006, -0.1); rug.castShadow = false; grp.add(rug);
  // walls
  const wallM = pbr('plaster', { repeat: [3, 1.5], roughness: 1, normal: 0.8 });
  const mkWall = (w, h, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallM); m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; grp.add(m); return m; };
  // back wall with a window opening (built from 4 pieces) — window x in [0.55,1.55], y in [0.85,2.05]
  const wx0 = 0.5, wx1 = 1.6, wy0 = 0.85, wy1 = 2.1;
  const dx0 = -1.75, dx1 = -0.85, dy1 = 2.05; // door opening
  mkWall(dx0 - R.x0, R.h, (R.x0 + dx0) / 2, R.h / 2, R.z0, 0);
  mkWall(dx1 - dx0, R.h - dy1, (dx0 + dx1) / 2, (dy1 + R.h) / 2, R.z0, 0);
  mkWall(wx0 - dx1, R.h, (dx1 + wx0) / 2, R.h / 2, R.z0, 0);
  mkWall(wx1 - wx0, wy0, (wx0 + wx1) / 2, wy0 / 2, R.z0, 0);
  mkWall(wx1 - wx0, R.h - wy1, (wx0 + wx1) / 2, (wy1 + R.h) / 2, R.z0, 0);
  mkWall(R.x1 - wx1, R.h, (wx1 + R.x1) / 2, R.h / 2, R.z0, 0);
  mkWall(D, R.h, R.x0, R.h / 2, (R.z0 + R.z1) / 2, Math.PI / 2);
  mkWall(D, R.h, R.x1, R.h / 2, (R.z0 + R.z1) / 2, -Math.PI / 2);
  mkWall(W, R.h, (R.x0 + R.x1) / 2, R.h / 2, R.z1, Math.PI);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), pbr('ceiling', { repeat: [3, 3], roughness: 1, normal: 0.6 }));
  ceil.rotation.x = Math.PI / 2; ceil.position.set((R.x0 + R.x1) / 2, R.h, (R.z0 + R.z1) / 2); ceil.receiveShadow = true; grp.add(ceil);
  // baseboards + crown
  const trimM = pbr('oak', { repeat: [4, 0.2], color: 0xf2ece0, roughness: 1, normal: 0.3 });
  trimM.map = null; trimM.color.set(0xe9e2d4);
  const trims = [[W, R.x0 + W / 2, R.z0 + 0.01, 0], [D, R.x0 + 0.01, R.z0 + D / 2, Math.PI / 2], [D, R.x1 - 0.01, R.z0 + D / 2, Math.PI / 2]];
  for (const [len, x, z, ry] of trims) {
    const b = box(len, 0.11, 0.018, trimM, 0.004); b.position.set(x, 0.055, z); b.rotation.y = ry; b.castShadow = false; grp.add(b);
    const c = box(len, 0.06, 0.03, trimM, 0.008); c.position.set(x, R.h - 0.03, z); c.rotation.y = ry; c.castShadow = false; grp.add(c);
  }
  // window frame, glass, sill, backdrop
  const frameM = pbr('oak', { repeat: [1, 0.3], color: 0xf4efe6, roughness: 1, normal: 0.4 }); frameM.map = null; frameM.color.set(0xefe9df);
  const fw = 0.06;
  for (const [w, h, x, y] of [[wx1 - wx0 + fw * 2, fw, (wx0 + wx1) / 2, wy1 + fw / 2], [wx1 - wx0 + fw * 2, fw, (wx0 + wx1) / 2, wy0 - fw / 2], [fw, wy1 - wy0, wx0 - fw / 2, (wy0 + wy1) / 2], [fw, wy1 - wy0, wx1 + fw / 2, (wy0 + wy1) / 2], [0.035, wy1 - wy0, (wx0 + wx1) / 2, (wy0 + wy1) / 2], [wx1 - wx0, 0.035, (wx0 + wx1) / 2, wy0 + (wy1 - wy0) * 0.62]]) {
    const b = box(w, h, 0.12, frameM, 0.006); b.position.set(x, y, R.z0); grp.add(b);
  }
  const sill = box(wx1 - wx0 + 0.24, 0.035, 0.2, frameM, 0.01); sill.position.set((wx0 + wx1) / 2, wy0 - 0.075, R.z0 + 0.06); grp.add(sill);
  const glassM = new THREE.MeshPhysicalMaterial({ color: 0x0c1220, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.18, envMapIntensity: 1.4, depthWrite: false });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(wx1 - wx0, wy1 - wy0), glassM); glass.position.set((wx0 + wx1) / 2, (wy0 + wy1) / 2, R.z0 - 0.01); grp.add(glass);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.5), new THREE.MeshBasicMaterial({ map: nightBackdrop(), toneMapped: false }));
  back.material.color.setScalar(0.55);
  back.position.set(1.1, 1.3, R.z0 - 2.2); grp.add(back);
  // curtains (folded linen)
  const curM = pbr('linen', { repeat: [3, 6], color: 0x9b4f2a, roughness: 1, normal: 1.5, physical: true, sheen: 0.6, sheenRoughness: 0.7, sheenColor: 0xffc29a, side: THREE.DoubleSide });
  for (const side of [-1, 1]) {
    const g = new THREE.PlaneGeometry(0.42, 2.25, 48, 24); const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); const t = (y + 1.125) / 2.25; p.setZ(i, Math.sin(x * 52 + side) * 0.028 * (0.6 + 0.4 * t) + Math.sin(x * 23) * 0.012); p.setX(i, x * (0.75 + 0.25 * t)); }
    g.computeVertexNormals();
    const c = new THREE.Mesh(g, curM); c.castShadow = true; c.receiveShadow = true;
    c.position.set(side < 0 ? wx0 - 0.2 : wx1 + 0.2, 1.22, R.z0 + 0.12); grp.add(c);
  }
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, wx1 - wx0 + 0.9, 12), new THREE.MeshStandardMaterial({ color: 0x2a2018, metalness: 0.6, roughness: 0.4 }));
  rod.rotation.z = Math.PI / 2; rod.position.set((wx0 + wx1) / 2, 2.36, R.z0 + 0.12); grp.add(rod);
  // door to the garden (wood + glass panes)
  const doorM = pbr('oak', { repeat: [1, 2], color: 0xb08a62, roughness: 1, normal: 0.8 });
  const door = new THREE.Group(); door.position.set((dx0 + dx1) / 2, 0, R.z0);
  const dw = dx1 - dx0;
  for (const [w, h, x, y] of [[dw, 0.12, 0, 0.06], [dw, 0.1, 0, dy1 - 0.05], [0.1, dy1, -dw / 2 + 0.05, dy1 / 2], [0.1, dy1, dw / 2 - 0.05, dy1 / 2], [dw, 0.08, 0, 0.95], [0.04, dy1 - 1.0, 0, 1.5]]) {
    const b = box(w, h, 0.05, doorM, 0.008); b.position.set(x, y, 0); door.add(b);
  }
  const lowPanel = box(dw - 0.2, 0.78, 0.03, doorM, 0.01); lowPanel.position.set(0, 0.52, 0); door.add(lowPanel);
  const dglass = new THREE.Mesh(new THREE.PlaneGeometry(dw - 0.2, dy1 - 1.05), glassM); dglass.position.set(0, 1.5, 0); door.add(dglass);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), new THREE.MeshStandardMaterial({ color: 0xb08d57, metalness: 1, roughness: 0.3 }));
  knob.position.set(dw / 2 - 0.1, 1.0, 0.05); door.add(knob);
  grp.add(door);
  const dback = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), new THREE.MeshBasicMaterial({ map: nightBackdrop(), toneMapped: false })); dback.material.color.setScalar(0.5);
  dback.position.set((dx0 + dx1) / 2, 1.3, R.z0 - 1.5); grp.add(dback);
  for (const [w, h, x, y] of [[0.08, dy1, dx0 - 0.04, dy1 / 2], [0.08, dy1, dx1 + 0.04, dy1 / 2], [dw + 0.16, 0.08, (dx0 + dx1) / 2, dy1 + 0.04]]) {
    const b = box(w, h, 0.03, frameM, 0.006); b.position.set(x, y, R.z0 + 0.015); grp.add(b);
  }
  // chalk sign (rules picture) on the wall
  const sign = new THREE.Group();
  const board = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.48), new THREE.MeshStandardMaterial({ map: chalkSign(), roughness: 0.92 }));
  board.position.z = 0.012; sign.add(board);
  const sfM = pbr('oak', { repeat: [1, 0.2], roughness: 1 });
  for (const [w, h, x, y] of [[0.8, 0.04, 0, 0.26], [0.8, 0.04, 0, -0.26], [0.04, 0.56, -0.38, 0], [0.04, 0.56, 0.38, 0]]) { const b = box(w, h, 0.03, sfM, 0.006); b.position.set(x, y, 0.012); sign.add(b); }
  sign.position.set(-0.25, 1.55, R.z0 + 0.005); grp.add(sign);
  // light switch
  const sw = new THREE.Group();
  const plateM = new THREE.MeshPhysicalMaterial({ color: 0xf1ede4, roughness: 0.35, clearcoat: 0.4 });
  const plate = box(0.085, 0.125, 0.01, plateM, 0.004); sw.add(plate);
  const rocker = box(0.032, 0.06, 0.012, plateM, 0.004); rocker.position.z = 0.008; sw.add(rocker);
  sw.position.set(wx0 - 0.28, 1.08, R.z0 + 0.008); grp.add(sw);
  // dining table
  const tableM = pbr('oak', { repeat: [1, 0.6], roughness: 1, normal: 0.9, physical: true, clearcoat: 0.25, clearcoatRoughness: 0.35 });
  const table = new THREE.Group();
  const top = box(1.7, 0.042, 0.95, tableM, 0.012, 3); top.position.y = R.tableY - 0.021; table.add(top);
  const legM = pbr('oak', { repeat: [0.2, 1], roughness: 1 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const l = box(0.06, R.tableY - 0.04, 0.06, legM, 0.01); l.position.set(sx * 0.76, (R.tableY - 0.04) / 2, sz * 0.4); table.add(l); }
  for (const [w, d, x, z] of [[1.46, 0.025, 0, 0.4], [1.46, 0.025, 0, -0.4], [0.025, 0.74, 0.76, 0], [0.025, 0.74, -0.76, 0]]) { const a = box(w, 0.08, d, legM, 0.005); a.position.set(x, R.tableY - 0.08, z); table.add(a); }
  grp.add(table);
  // kraft paper under the pumpkin (slightly crumpled)
  const kg = new THREE.PlaneGeometry(0.75, 0.55, 40, 30); const kp = kg.attributes.position;
  for (let i = 0; i < kp.count; i++) { const x = kp.getX(i), y = kp.getY(i); const e = Math.min(0.375 - Math.abs(x), 0.275 - Math.abs(y)); kp.setZ(i, 0.0015 * Math.sin(x * 40 + y * 13) * Math.cos(y * 31) + 0.006 * Math.max(0, 1 - e / 0.03) * Math.sin(x * 9 + y * 7) ** 2); }
  kg.computeVertexNormals();
  const kraft = new THREE.Mesh(kg, pbr('kraft', { repeat: [1, 0.75], roughness: 1, normal: 1.2 })); kraft.rotation.x = -Math.PI / 2; kraft.rotation.z = 0.06;
  kraft.position.set(0.05, R.tableY + 0.0015, 0.08); kraft.receiveShadow = true; grp.add(kraft);
  // pendant lamp (fabric drum shade)
  const lamp = new THREE.Group(); lamp.position.set(0.02, 1.78, 0.02);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, R.h - 1.78, 6), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })); cord.position.y = (R.h - 1.78) / 2; lamp.add(cord);
  const shadeM = pbr('linen', { repeat: [6, 2], color: 0xe9dcc0, roughness: 1, normal: 1, side: THREE.DoubleSide, physical: true, sheen: 0.3 });
  shadeM.emissive = new THREE.Color(0xffb468); shadeM.emissiveIntensity = 0.9; shadeM.emissiveMap = shadeM.map;
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.23, 0.24, 48, 1, true), shadeM); lamp.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 3, 2) })); bulb.position.y = -0.02; lamp.add(bulb);
  grp.add(lamp);
  // sideboard with decorative gourds on the right wall
  const sbM = pbr('oak', { repeat: [1.2, 0.6], color: 0x9b7653, roughness: 1, normal: 0.9, physical: true, clearcoat: 0.2 });
  const sb = new THREE.Group(); sb.position.set(R.x1 - 0.25, 0, -0.9); sb.rotation.y = -Math.PI / 2;
  const body = box(1.4, 0.78, 0.45, sbM, 0.01, 3); body.position.y = 0.4; sb.add(body);
  for (const x of [-0.46, 0, 0.46]) { const dr = box(0.43, 0.5, 0.02, sbM, 0.006); dr.position.set(x, 0.38, 0.23); sb.add(dr); const k = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), knob.material); k.position.set(x, 0.55, 0.25); sb.add(k); }
  const decor = [[11, 0.07, 0xece3c8, 0xc9b98c, false, -0.45, 0.05], [12, 0.055, 0x7f8f4a, 0x3e5225, true, -0.28, -0.05], [13, 0.09, 0xd9661a, 0x9a3d0b, false, 0.3, 0.02], [14, 0.05, 0xe2a43a, 0xa86a1c, true, 0.47, -0.08]];
  for (const [seed, r, a, b, st, x, z] of decor) { const d = decorPumpkin(seed, r, a, b, st); d.position.set(x, 0.8, z); d.rotation.y = seed; sb.add(d); }
  grp.add(sb);
  // tea lights on the sideboard (only lit in the dark)
  const teaPos = [new THREE.Vector3(-0.1, 0.8, 0.08), new THREE.Vector3(0.1, 0.8, 0.12)];
  // autumn leaf garland across the window
  const leaves = leafGarland(wx0 - 0.15, wx1 + 0.15, 2.28, R.z0 + 0.16);
  grp.add(leaves);
  return { group: grp, lamp, shade, shadeM, bulb, sw, rocker, door, sign, sideboard: sb, teaPos, wx0, wx1, wy0, wy1, dx0, dx1 };
}

export function leafGeometry() {
  // maple-ish leaf outline, slightly cupped
  const sh = new THREE.Shape();
  const pts = [];
  for (let i = 0; i <= 60; i++) {
    const a = i / 60 * Math.PI * 2;
    const lobes = 0.55 + 0.45 * Math.pow(Math.abs(Math.cos(a * 2.5)), 0.6);
    const r = (0.5 + 0.5 * lobes) * (1 - 0.35 * Math.max(0, -Math.sin(a)));
    pts.push(new THREE.Vector2(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5 + 0.1));
  }
  sh.setFromPoints(pts);
  const g = new THREE.ShapeGeometry(sh, 6);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, (x * x + y * y) * 0.25 + Math.abs(x) * 0.08); }
  g.computeVertexNormals();
  return g;
}
export function leafMaterial() {
  const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.6, side: THREE.DoubleSide, sheen: 0.3, vertexColors: false });
  const veins = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(90,50,20,0.55)'; g.lineWidth = 1.5;
    for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.62; g.beginPath(); g.moveTo(64, 80); g.lineTo(64 + Math.cos(a) * 60, 80 + Math.sin(a) * 60); g.stroke(); }
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(80,40,10,${Math.random() * 0.12})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
  });
  m.map = veins;
  return m;
}
function leafGarland(x0, x1, y, z) {
  const grp = new THREE.Group();
  const n = 28; const geo = leafGeometry(); const mat = leafMaterial();
  const inst = new THREE.InstancedMesh(geo, mat, n); inst.castShadow = true; inst.receiveShadow = true;
  const cols = [0xb8401a, 0xd6791f, 0x9a2f17, 0xc79a2a, 0x8a3a12];
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), pos = new THREE.Vector3();
  const curvePts = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = x0 + (x1 - x0) * t, yy = y - Math.sin(t * Math.PI) * 0.16;
    curvePts.push(new THREE.Vector3(x, yy + 0.02, z));
    pos.set(x + (Math.random() - 0.5) * 0.02, yy - 0.03, z + 0.01);
    e.set(-0.2 + Math.random() * 0.4, (Math.random() - 0.5) * 0.6, Math.PI + (Math.random() - 0.5) * 0.9); q.setFromEuler(e);
    const sc = 0.085 + Math.random() * 0.03; s.set(sc, sc, sc);
    M.compose(pos, q, s); inst.setMatrixAt(i, M); inst.setColorAt(i, new THREE.Color(cols[i % cols.length]));
  }
  grp.add(inst);
  const string = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePts), 40, 0.0015, 5), new THREE.MeshStandardMaterial({ color: 0xc8b58a, roughness: 0.9 }));
  grp.add(string);
  return grp;
}
