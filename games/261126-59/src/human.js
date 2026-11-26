// Real-proportioned people built from sculpted surfaces (no capsules): lofted torso with cloth,
// live tube limbs that bend smoothly with 2-bone IK, a sculpted head with eyeballs, lids, brows,
// a painted mouth that changes shape, and hair made of strands.
import * as THREE from 'three';
import { tex, canvas, canvasTex, aoBlob } from './tex.js';
import { LiveTube, deformedSphere, gauss, smooth } from './geo.js';

const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const lerp = THREE.MathUtils.lerp;

// ---------------------------------------------------------------- materials
function skinMat(col, sheen = 0.5) {
  const m = new THREE.MeshPhysicalMaterial({
    color: col, roughness: 0.52, metalness: 0, sheen, sheenRoughness: 0.6, sheenColor: new THREE.Color(1.0, 0.75, 0.68),
    normalMap: tex('skin_nrm', { repeat: [6, 6] }), normalScale: new THREE.Vector2(0.18, 0.18), clearcoat: 0.08, clearcoatRoughness: 0.5,
  });
  // cheap subsurface: wrap the diffuse term and tint the terminator warm
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
      reflectedLight.indirectDiffuse += diffuseColor.rgb * vec3(0.10, 0.03, 0.02);
    `);
  };
  m.customProgramCacheKey = () => 'skin';
  return m;
}
function clothMat(name, col, rep = 6, sheen = 0.6) {
  return new THREE.MeshPhysicalMaterial({
    map: tex(name + '_col', { srgb: true, repeat: [rep, rep] }), normalMap: tex(name + '_nrm', { repeat: [rep, rep] }),
    normalScale: new THREE.Vector2(1.2, 1.2), color: col, roughness: 0.88, sheen, sheenRoughness: 0.8, sheenColor: new THREE.Color(0.6, 0.6, 0.6),
  });
}
function hairMat(col) {
  const m = new THREE.MeshPhysicalMaterial({
    color: col, roughness: 0.42, metalness: 0, sheen: 1, sheenRoughness: 0.35, sheenColor: new THREE.Color(col).multiplyScalar(2.2),
    normalMap: tex('hair_nrm', { repeat: [4, 1] }), normalScale: new THREE.Vector2(0.8, 0.8),
  });
  m.sheen = 0.5; m.sheenColor = new THREE.Color(col).multiplyScalar(1.6); m.roughness = 0.5;
  return m;
}

// ---------------------------------------------------------------- iris canvas (equirect around the +z pole)
function eyeTex(irisCol) {
  const W = 256, H = 128, c = canvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#f2eee8'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(200,80,80,${0.05 + Math.random() * 0.08})`; g.lineWidth = 0.6; g.beginPath(); const x = Math.random() * W; g.moveTo(x, H * 0.55); g.lineTo(x + Math.random() * 10 - 5, H * 0.3); g.stroke(); }
  const ir = 22; // rows of iris from the pole (top)
  const gr = g.createLinearGradient(0, 0, 0, ir);
  const c0 = new THREE.Color(irisCol);
  gr.addColorStop(0, '#050403'); gr.addColorStop(0.42, '#060504'); gr.addColorStop(0.47, '#' + c0.clone().multiplyScalar(0.55).getHexString());
  gr.addColorStop(0.8, '#' + c0.getHexString()); gr.addColorStop(0.93, '#' + c0.clone().multiplyScalar(0.5).getHexString()); gr.addColorStop(1, '#2a1e16');
  g.fillStyle = gr; g.fillRect(0, 0, W, ir + 1);
  for (let x = 0; x < W; x += 1.5) { g.strokeStyle = `rgba(${Math.random() < 0.5 ? '255,220,170' : '30,15,8'},${Math.random() * 0.25})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, ir * 0.48); g.lineTo(x + Math.random() * 2, ir * 0.95); g.stroke(); }
  const sg = g.createLinearGradient(0, ir, 0, ir + 10); sg.addColorStop(0, 'rgba(60,40,30,0.5)'); sg.addColorStop(1, 'rgba(60,40,30,0)'); g.fillStyle = sg; g.fillRect(0, ir, W, 10);
  return canvasTex(c);
}

// skin colour map for the head (equirect, face centred at u=0.25): blush, lips, brows' shadow, stubble
function headTex(skin, opts) {
  const W = 512, H = 256, c = canvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#' + new THREE.Color(skin).getHexString(); g.fillRect(0, 0, W, H);
  for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(${Math.random() < 0.5 ? '120,60,50' : '255,230,220'},${Math.random() * 0.03})`; g.beginPath(); g.arc(Math.random() * W, Math.random() * H, 1 + Math.random() * 5, 0, 7); g.fill(); }
  const blob = (x, y, rx, ry, col) => { g.save(); g.translate(x, y); g.scale(1, ry / rx); const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, col); gr.addColorStop(1, col.replace(/[\d.]+\)$/, '0)')); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rx, 0, 7); g.fill(); g.restore(); };
  const fx = W * 0.25; // face centre column; right cheek = smaller u? x grows toward +x side
  if (opts.blush) { blob(fx - 40, H * 0.58, 26, 20, 'rgba(230,110,110,0.32)'); blob(fx + 40, H * 0.58, 26, 20, 'rgba(230,110,110,0.32)'); }
  blob(fx, H * 0.61, 8, 6, 'rgba(220,120,110,0.12)'); // nose tip warmth
  if (opts.stubble) { for (let i = 0; i < 9000; i++) { const a = Math.random() * Math.PI * 2, r = Math.random(); const x = fx + Math.cos(a) * 80 * r, y = H * 0.72 + Math.sin(a) * 34 * r; if (y < H * 0.62) continue; g.fillStyle = 'rgba(60,50,48,0.22)'; g.fillRect(x, y, 1, 1.4); } }
  // eye socket shading
  blob(fx - 24, H * 0.46, 14, 9, 'rgba(120,70,70,0.12)'); blob(fx + 24, H * 0.46, 14, 9, 'rgba(120,70,70,0.12)');
  return canvasTex(c);
}

// mouth decal canvas
class Mouth {
  constructor(lipCol) { this.c = canvas(256, 128); this.g = this.c.getContext('2d'); this.t = canvasTex(this.c); this.lip = lipCol; this.k = ''; }
  draw(smile, open, wide, oShape) {
    const k = [smile, open, wide, oShape].map((v) => Math.round(v * 20)).join(',');
    if (k === this.k) return; this.k = k;
    const g = this.g; g.clearRect(0, 0, 256, 128);
    const cx = 128, cy = 64;
    const w = (62 + wide * 20 + smile * 10) * (1 - oShape * 0.45);
    const cornerY = cy - smile * 16;
    const op = open * 34 + oShape * 14;
    g.save(); g.filter = 'blur(1.2px)';
    // inner mouth
    if (op > 1.5) {
      g.fillStyle = '#4a1414';
      g.beginPath(); g.moveTo(cx - w, cornerY);
      g.bezierCurveTo(cx - w * 0.5, cy - 4 - op * 0.25, cx + w * 0.5, cy - 4 - op * 0.25, cx + w, cornerY);
      g.bezierCurveTo(cx + w * 0.6, cy + op * 1.1 + smile * 4, cx - w * 0.6, cy + op * 1.1 + smile * 4, cx - w, cornerY); g.fill();
      g.save(); g.clip();
      g.fillStyle = '#f4efe8'; g.fillRect(cx - w, cy - 10 - op * 0.3, w * 2, 6 + op * 0.12); // teeth
      g.fillStyle = '#c8585a'; g.beginPath(); g.ellipse(cx, cy + op * 0.95, w * 0.55, op * 0.4, 0, 0, 7); g.fill(); // tongue
      g.restore();
    }
    // lips
    g.strokeStyle = this.lip; g.lineCap = 'round';
    g.lineWidth = 9;
    g.beginPath(); g.moveTo(cx - w, cornerY); g.bezierCurveTo(cx - w * 0.5, cy - 5 - op * 0.25, cx + w * 0.5, cy - 5 - op * 0.25, cx + w, cornerY); g.stroke();
    g.lineWidth = 12;
    g.beginPath(); g.moveTo(cx - w * 0.92, cornerY + 2); g.bezierCurveTo(cx - w * 0.55, cy + op * 1.1 + smile * 4 + 3, cx + w * 0.55, cy + op * 1.1 + smile * 4 + 3, cx + w * 0.92, cornerY + 2); g.stroke();
    // lip line (dark) when closed
    if (op <= 1.5) { g.strokeStyle = 'rgba(90,30,30,0.85)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(cx - w, cornerY); g.bezierCurveTo(cx - w * 0.5, cy + smile * 5, cx + w * 0.5, cy + smile * 5, cx + w, cornerY); g.stroke(); }
    // dimples at the corners when smiling
    if (smile > 0.4) { g.strokeStyle = 'rgba(150,70,60,0.35)'; g.lineWidth = 2; for (const s of [-1, 1]) { g.beginPath(); g.arc(cx + s * (w + 4), cornerY + 2, 5, s > 0 ? -1.2 : Math.PI - 0.6, s > 0 ? 0.6 : Math.PI + 1.2); g.stroke(); } }
    g.restore();
    this.t.needsUpdate = true;
  }
}

// expressions: smile, open, wide, oShape, browUp, browIn, lid (1 open), squint
const EXPR = {
  neutral: [0.25, 0, 0, 0, 0, 0, 1, 0],
  happy: [1, 0.25, 0.4, 0, 0.35, -0.2, 0.85, 0.5],
  laugh: [1, 0.8, 0.7, 0, 0.6, -0.2, 0.55, 0.9],
  surprised: [0, 0.4, 0, 1, 1, 0, 1.15, 0],
  wow: [0.6, 0.6, 0.3, 0.4, 0.9, -0.1, 1.1, 0.1],
  puzzled: [-0.1, 0.05, -0.2, 0.3, 0.4, 0.8, 0.95, 0.1],
  determined: [0.1, 0, 0.1, 0, -0.5, 0.9, 0.85, 0.3],
  oops: [-0.3, 0.3, 0.6, 0, 0.7, 0.9, 1.05, 0],
  proud: [0.8, 0.1, 0.3, 0, 0.2, -0.3, 0.8, 0.6],
  focus: [0.15, 0.05, 0, 0.1, 0.1, 0.4, 0.88, 0.2],
};

export class Human {
  constructor(cfg) {
    this.cfg = cfg;
    const k = this.k = cfg.scale; // overall size (child = 1, dad ~1.5)
    this.root = new THREE.Group();
    this.skin = skinMat(cfg.skin);
    this.hairM = hairMat(cfg.hair);
    this.e = EXPR.neutral.slice(); this.eT = EXPR.neutral.slice(); this.exprName = 'neutral';
    this.blinkT = 1.5; this.blink = 0;
    this.lookT = V3(0, 1, 2); this.look = V3(0, 1, 2);
    this.reach = [null, null]; this.reachW = [0, 0]; this.handPos = [V3(), V3()];
    this.lean = V3(); this.headTurn = new THREE.Euler();
    this.poseMode = cfg.pose || 'kneel';
    this.build();
  }
  build() {
    const k = this.k, cfg = this.cfg;
    // pelvis -> torso
    this.pelvis = new THREE.Group(); this.root.add(this.pelvis);
    this.torso = new THREE.Group(); this.pelvis.add(this.torso);
    this.torsoGeo = this.loftTorso();
    this.shirt = new THREE.Mesh(this.torsoGeo, cfg.shirtMat); this.shirt.castShadow = true; this.shirt.receiveShadow = true; this.torso.add(this.shirt);
    // coverall extras (collar, pocket, buttons) are toggled by dress()
    this.extras = new THREE.Group(); this.torso.add(this.extras);
    // neck
    this.neckTube = new LiveTube(8, 20, (t) => (0.037 - 0.004 * t) * k);
    this.neck = new THREE.Mesh(this.neckTube.geo, this.skin); this.neck.castShadow = true; this.torso.add(this.neck);
    this.neckTube.update([V3(0, 0.27 * k, -0.005 * k), V3(0, 0.31 * k, 0), V3(0, 0.35 * k, 0.004 * k), V3(0, 0.375 * k, 0.006 * k)]);
    // head
    this.headPivot = new THREE.Group(); this.headPivot.position.set(0, 0.345 * k, 0.008 * k); this.torso.add(this.headPivot);
    this.buildHead();
    // arms
    this.arms = [];
    for (const s of [-1, 1]) {
      const r0 = 0.033 * k, sl = cfg.longSleeve;
      const arm = new LiveTube(28, 18, (t) => {
        const x = t; // shoulder -> wrist
        return k * (0.036 - 0.012 * x + 0.004 * gauss(x - 0.25, 0.12) + 0.003 * gauss(x - 0.72, 0.1) - 0.003 * gauss(x - 0.5, 0.05)) * (t > 0.985 ? 0.85 : 1);
      });
      const mesh = new THREE.Mesh(arm.geo, this.skin); mesh.castShadow = true; mesh.frustumCulled = false; this.torso.add(mesh);
      const slv = new LiveTube(28, 18, (t) => {
        const end = this.sleeveEnd; const tt = t * end;
        let r = k * (0.043 - 0.011 * tt + 0.004 * gauss(tt - 0.5, 0.06) * Math.sin(tt * 60));
        if (t > 0.94) r *= 1.0 + (t - 0.94) * 0.8; // cuff flare
        return r;
      });
      const sm = new THREE.Mesh(slv.geo, cfg.sleeveMat || cfg.shirtMat); sm.castShadow = true; sm.frustumCulled = false; this.torso.add(sm);
      const hand = this.buildHand(s);
      this.torso.add(hand.g);
      this.arms.push({ s, tube: arm, mesh, slv, sm, hand, elbow: V3(), wrist: V3(), shoulder: V3(s * 0.112 * k, 0.272 * k, -0.005 * k) });
    }
    this.sleeveEnd = cfg.longSleeve ? 1 : 0.42;
    // legs
    this.legs = [];
    for (const s of [-1, 1]) {
      const tube = new LiveTube(26, 18, (t) => k * (0.058 - 0.026 * t + 0.004 * gauss(t - 0.5, 0.05) + 0.002 * Math.sin(t * 50) * gauss(t - 0.55, 0.12)));
      const m = new THREE.Mesh(tube.geo, cfg.pantsMat); m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; this.pelvis.add(m);
      const shoe = new THREE.Mesh(deformedSphere(1, 32, 20, (v) => {
        const toe = smooth(-0.2, 1, v.z);
        v.set(v.x * 0.036 * (0.9 + 0.2 * toe), Math.max(v.y, -0.7) * 0.03, v.z * 0.075);
        if (v.y < -0.02) v.y = -0.0238; // flat sole
      }), new THREE.MeshPhysicalMaterial({ color: cfg.shoeCol || 0x8a8070, roughness: 0.7, sheen: 0.3, normalMap: tex('canvas_nrm', { repeat: [3, 3] }) }));
      shoe.scale.setScalar(k); shoe.castShadow = true; this.pelvis.add(shoe);
      const sole = new THREE.Mesh(deformedSphere(1, 24, 10, (v) => v.set(v.x * 0.038, v.y * 0.006, v.z * 0.078)), new THREE.MeshStandardMaterial({ color: 0x8a8278, roughness: 0.85 }));
      sole.scale.setScalar(k); shoe.add(sole); sole.position.y = -0.021; sole.scale.setScalar(1);
      this.legs.push({ s, tube, m, shoe });
    }
    this.aoB = aoBlob(0.5 * k, 0.55 * k, 0.75); this.root.add(this.aoB);
  }
  loftTorso() {
    const k = this.k;
    // keyframes: y, half width, half depth (front), half depth (back)
    const kf = this.cfg.adult
      ? [[-0.07, 0.02, 0.02, 0.02], [-0.05, 0.1, 0.07, 0.075], [0.0, 0.122, 0.078, 0.088], [0.1, 0.112, 0.08, 0.072], [0.18, 0.118, 0.085, 0.07], [0.25, 0.132, 0.08, 0.07], [0.29, 0.13, 0.06, 0.06], [0.315, 0.09, 0.045, 0.045], [0.33, 0.035, 0.03, 0.03], [0.335, 0.001, 0.001, 0.001]]
      : [[-0.07, 0.02, 0.02, 0.02], [-0.05, 0.095, 0.07, 0.075], [0.0, 0.112, 0.08, 0.085], [0.1, 0.104, 0.09, 0.07], [0.18, 0.108, 0.086, 0.068], [0.25, 0.122, 0.074, 0.066], [0.29, 0.12, 0.058, 0.058], [0.315, 0.085, 0.044, 0.044], [0.33, 0.035, 0.03, 0.03], [0.335, 0.001, 0.001, 0.001]];
    const rings = 44, seg = 48;
    const pos = [], uv = [], idx = [];
    const sample = (y) => {
      let i = 0; while (i < kf.length - 2 && kf[i + 1][0] < y) i++;
      const a = kf[i], b = kf[i + 1], t = smooth(0, 1, (y - a[0]) / (b[0] - a[0]));
      return [lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];
    };
    for (let i = 0; i <= rings; i++) {
      const t = i / rings, y = lerp(kf[0][0], kf[kf.length - 1][0], t);
      const [hw, hf, hb] = sample(y);
      for (let j = 0; j <= seg; j++) {
        const a = (j / seg) * Math.PI * 2;
        const c = Math.cos(a), s = Math.sin(a);
        const pw = 2.4; // superellipse
        const ex = Math.sign(s) * Math.pow(Math.abs(s), 2 / pw), ez = Math.sign(c) * Math.pow(Math.abs(c), 2 / pw);
        const hd = ez > 0 ? hf : hb;
        // cloth folds: soft wrinkles around the waist and under the arms
        const wr = 0.0025 * Math.sin(a * 9 + y * 40) * gauss(y - 0.12, 0.05) + 0.002 * Math.sin(y * 90 + a * 2) * gauss(Math.abs(ex) - 0.9, 0.15);
        pos.push((ex * (hw + wr)) * k, y * k, (ez * (hd + wr)) * k);
        uv.push(j / seg * 3, y * 3);
        if (i < rings && j < seg) { const p = i * (seg + 1) + j, q = p + seg + 1; idx.push(p, p + 1, q, q, p + 1, q + 1); }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    return g;
  }
  buildHead() {
    const k = this.k, cfg = this.cfg, ad = cfg.adult;
    const H = this.head = new THREE.Group(); this.headPivot.add(H);
    const sx = (ad ? 0.078 : 0.074) * k, sy = (ad ? 0.112 : 0.094) * k, sz = (ad ? 0.096 : 0.089) * k;
    // face landmarks (unit sphere coords): eyes y=-0.06, nose tip y=-0.36, mouth y=-0.6 (child: big cranium, small lower face)
    const EY = ad ? 0.02 : -0.06, NY = ad ? -0.34 : -0.36, MY = ad ? -0.6 : -0.6;
    const fn = (v) => {
      const x = v.x, y = v.y, z = v.z;
      const front = smooth(0.55, 0.95, z);
      // jaw narrows toward a small rounded chin
      const jaw = smooth(-0.15, -0.95, y);
      let X = x * (1 - jaw * (ad ? 0.22 : 0.2)), Y = y + (ad ? 0 : Math.min(0, y - MY) * 0.22), Z = z * (1 - jaw * (ad ? 0.05 : 0.1));
      // flatter face plane
      Z -= front * 0.03 * gauss(y - EY, 0.5);
      // round cheeks (children) / cheekbones (adults)
      const ck = (gauss(x - 0.48, 0.2) + gauss(x + 0.48, 0.2)) * gauss(y - (ad ? -0.2 : -0.4), 0.2) * smooth(0.3, 0.85, z);
      X *= 1 + ck * (ad ? 0.01 : 0.05); Z += ck * (ad ? 0.03 : 0.08);
      // eye sockets + brow ridge
      Z -= (gauss(x - 0.36, 0.13) + gauss(x + 0.36, 0.13)) * gauss(y - EY, 0.1) * front * (ad ? 0.07 : 0.03);
      Z += (gauss(x - 0.34, 0.2) + gauss(x + 0.34, 0.2)) * gauss(y - EY - 0.2, 0.07) * front * (ad ? 0.05 : 0.015);
      // nose: soft bridge + small tip + wings
      Z += gauss(x, 0.07) * gauss(y - (EY + NY) / 2, 0.12) * front * (ad ? 0.12 : 0.035);
      Z += gauss(x, ad ? 0.09 : 0.07) * gauss(y - NY, ad ? 0.09 : 0.06) * front * (ad ? 0.2 : 0.1);
      Z += (gauss(x - 0.1, 0.05) + gauss(x + 0.1, 0.05)) * gauss(y - NY + 0.04, 0.05) * front * 0.04;
      // philtrum + lips
      Z += gauss(x, 0.12) * gauss(y - MY - 0.05, 0.05) * front * 0.02;
      Z += gauss(x, 0.17) * gauss(y - MY + 0.06, 0.045) * front * 0.04;
      Z -= gauss(x, 0.2) * gauss(y - MY + 0.15, 0.04) * front * 0.02;
      // chin
      Z += gauss(x, 0.22) * gauss(y + 0.86, 0.1) * smooth(0.4, 1, z) * (ad ? 0.07 : 0.03);
      // cranium: rounder and fuller at the back/top for a child
      Z -= gauss(y + 0.6, 0.3) * smooth(0, -0.8, z) * 0.18;
      Z += smooth(-0.2, -0.9, z) * smooth(-0.2, 0.6, y) * (ad ? 0.03 : 0.08);
      Y += smooth(0.2, 1, y) * (ad ? 0.0 : 0.03);
      v.set(X * sx, Y * sy, Z * sz);
    };
    this.EY = EY; this.MY = MY;
    this.headFn = fn;
    const hg = deformedSphere(1, 96, 72, fn);
    hg.rotateY(0); // face is +z
    const hm = this.skin.clone(); hm.map = headTex(cfg.skin, { blush: !ad, stubble: ad }); hm.color.set(0xffffff);
    hm.onBeforeCompile = this.skin.onBeforeCompile; hm.customProgramCacheKey = this.skin.customProgramCacheKey;
    // sphere UV: face (+z) is at u = 0.25 -> rotate geometry so +z maps there (three's sphere: phi = u*2pi, z = sin(phi))
    const skull = this.skull = new THREE.Mesh(hg, hm); skull.castShadow = true; skull.receiveShadow = true; H.add(skull);
    H.position.y = sy * 0.95;
    const surf = (x, y) => { // face surface z at (x,y) in head space
      const p = hg.attributes.position; let best = -1, bz = 0;
      for (let i = 0; i < p.count; i++) { const dz = p.getZ(i); if (dz < 0) continue; const d = Math.hypot(p.getX(i) - x, p.getY(i) - y); if (best < 0 || d < best) { best = d; bz = dz; } }
      return bz;
    };
    // ears
    for (const s of [-1, 1]) {
      const eg = deformedSphere(1, 24, 18, (v) => { const rim = smooth(0.2, 1, Math.abs(v.x)); v.set(v.x * 0.009 * k, v.y * 0.026 * k * (ad ? 1.15 : 1), v.z * 0.018 * k - (v.x * s < 0 ? 0.004 * k : 0) + rim * 0); });
      const ear = new THREE.Mesh(eg, this.skin); ear.position.set(s * sx * 0.97, -0.01 * k, -0.005 * k); ear.rotation.y = s * 0.25; ear.castShadow = true; H.add(ear);
    }
    // eyes
    const eR = (ad ? 0.0118 : 0.0124) * k, ex = (ad ? 0.031 : 0.027) * k, ey = EY * sy;
    const ez = surf(ex, ey) - eR * 0.3;
    const eyeM = new THREE.MeshPhysicalMaterial({ map: eyeTex(cfg.iris || 0x5a3a22), roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.03 });
    const lidM = this.skin;
    this.eyes = [];
    for (const s of [-1, 1]) {
      const eg = new THREE.Group(); eg.position.set(s * ex, ey, ez); H.add(eg);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(eR, 40, 28).rotateX(Math.PI / 2), eyeM); eg.add(ball);
      // lids: shells hinged on the eye centre
      const up = new THREE.Mesh(new THREE.SphereGeometry(eR * 1.045, 36, 18, 0, Math.PI, 0, Math.PI / 2), lidM);
      const upG = new THREE.Group(); upG.add(up); eg.add(upG);
      const lash = new THREE.Mesh(new THREE.TorusGeometry(eR * 1.1, (ad ? 0.0007 : 0.0011) * k, 6, 32, Math.PI), new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.6 }));
      lash.rotation.x = Math.PI / 2; upG.add(lash);
      const lo = new THREE.Mesh(new THREE.SphereGeometry(eR * 1.035, 36, 12, 0, Math.PI, Math.PI / 2, Math.PI / 2), lidM);
      const loG = new THREE.Group(); loG.add(lo); eg.add(loG);
      this.eyes.push({ s, eg, ball, upG, loG });
      // brow
      const bt = new LiveTube(14, 8, (t) => k * (ad ? 0.0042 : 0.0032) * (1 - 0.6 * t) * (0.6 + 0.4 * Math.sin(Math.min(1, t * 3) * Math.PI / 2)), [1, 0.5]);
      const bx0 = s * (ex - 0.016 * k), bx1 = s * (ex + 0.017 * k);
      const by = ey + eR * 1.55;
      const pts = [];
      for (let i = 0; i < 4; i++) { const t = i / 3, x = lerp(bx0, bx1, t), y = by + Math.sin(t * Math.PI) * 0.004 * k - t * 0.002 * k; pts.push(V3(x, y, surf(x, y) + 0.0018 * k)); }
      const browG = new THREE.Group(); H.add(browG);
      bt.update(pts, V3(0, 0, 1));
      const brow = new THREE.Mesh(bt.geo, new THREE.MeshPhysicalMaterial({ color: cfg.brow || cfg.hair, roughness: 0.7, sheen: 1, sheenColor: new THREE.Color(cfg.hair).multiplyScalar(1.5) }));
      browG.add(brow); this.eyes[this.eyes.length - 1].brow = browG; browG.userData.c = V3((bx0 + bx1) / 2, by, 0);
    }
    // mouth decal patch (same sculpt, pushed out a hair)
    const mPhi = 0.62, mThL = 0.56, mTh0 = Math.acos(this.MY) - mThL / 2;
    const mg = new THREE.SphereGeometry(1, 40, 24, Math.PI / 2 - mPhi / 2, mPhi, mTh0, mThL);
    { const p = mg.attributes.position, v = V3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); fn(v); const n = v.clone().normalize(); v.addScaledVector(n, 0.0007 * k); p.setXYZ(i, v.x, v.y, v.z); } mg.computeVertexNormals(); }
    // flip u so canvas left = character's right (+x is screen-left when facing camera)
    this.mouth = new Mouth(cfg.lip || 'rgba(196,104,100,0.95)');
    const mm = new THREE.MeshPhysicalMaterial({ map: this.mouth.t, transparent: true, depthWrite: false, roughness: 0.35, clearcoat: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
    const mouthMesh = new THREE.Mesh(mg, mm); mouthMesh.renderOrder = 2; H.add(mouthMesh);
    this.mouthMesh = mouthMesh;
    this.buildHair(sx, sy, sz);
  }
  buildHair(sx, sy, sz) {
    const k = this.k, cfg = this.cfg, fn = this.headFn, H = this.head;
    const HM = this.hairM;
    // cap: inflated skull, trimmed at the hairline
    const capFn = (v) => { const u = v.clone(); fn(v); const n = v.clone().normalize(); v.addScaledVector(n, (cfg.adult ? 0.006 : 0.009) * k * (0.6 + 0.4 * smooth(-0.5, 0.8, u.y))); };
    const cg = new THREE.SphereGeometry(1, 80, 60);
    const p = cg.attributes.position, keep = new Uint8Array(p.count), v = V3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const front = v.z > 0.25 && v.y < (cfg.adult ? 0.62 : 0.5) - 0.25 * Math.abs(v.x);
      const side = Math.abs(v.x) > 0.7 && v.y < (cfg.adult ? 0.15 : -0.05) && v.z > -0.35;
      const low = v.y < (cfg.adult ? -0.35 : -0.55);
      keep[i] = front || side || low ? 0 : 1;
      capFn(v); p.setXYZ(i, v.x, v.y, v.z);
    }
    const idx = cg.index.array, ni = [];
    for (let i = 0; i < idx.length; i += 3) if (keep[idx[i]] && keep[idx[i + 1]] && keep[idx[i + 2]]) ni.push(idx[i], idx[i + 1], idx[i + 2]);
    cg.setIndex(ni); cg.computeVertexNormals();
    const cap = new THREE.Mesh(cg, HM); cap.castShadow = true; cap.receiveShadow = true; H.add(cap);
    // strands: ribbons from the crown following the scalp
    const strands = [];
    const scalp = (dir, out) => { const d = dir.clone().normalize(); fn(d); return d.addScaledVector(d.clone().normalize(), out); };
    const crown = V3(0, 0.75, -0.1).normalize();
    const add = (pts, r0, flat = 0.4) => {
      const lt = new LiveTube(Math.max(10, pts.length * 4), 7, (t) => r0 * (1 - 0.8 * t * t) * (0.7 + 0.3 * Math.sin(Math.min(1, t * 6) * Math.PI / 2)), [1, flat]);
      lt.update(pts);
      const m = new THREE.Mesh(lt.geo, HM); m.castShadow = true; H.add(m); strands.push(m);
    };
    if (!cfg.adult) {
      // bangs: fall forward over the forehead to just above the brows
      for (let i = 0; i < 30; i++) {
        const a = lerp(-0.85, 0.85, i / 29) + (Math.random() - 0.5) * 0.06;
        const pts = [];
        for (let j = 0; j <= 4; j++) {
          const t = j / 4;
          const dir = V3(Math.sin(a) * lerp(0.15, 0.95, t), lerp(0.9, 0.44 + 0.1 * Math.abs(a), t), lerp(-0.05, 1.0, t) * Math.cos(a * 0.9));
          pts.push(scalp(dir, (0.004 + 0.006 * Math.sin(t * Math.PI)) * k));
        }
        add(pts, (0.012 + Math.random() * 0.004) * k, 0.3);
      }
      // side locks over the ears down to the jaw
      for (const s of [-1, 1]) for (let i = 0; i < 9; i++) {
        const z0 = lerp(0.35, -0.5, i / 8), pts = [];
        for (let j = 0; j <= 5; j++) { const t = j / 5; pts.push(scalp(V3(s * 0.75, lerp(0.75, -0.55, t), z0 + t * 0.1), (0.008 + 0.006 * t) * k).add(V3(s * 0.006 * k * t, 0, 0))); }
        add(pts, 0.014 * k, 0.32);
      }
      // two low pigtails with hair ties
      for (const s of [-1, 1]) {
        const tie = scalp(V3(s * 0.8, -0.45, -0.45), 0.012 * k);
        const tm = new THREE.Mesh(new THREE.TorusGeometry(0.011 * k, 0.0045 * k, 10, 24), new THREE.MeshPhysicalMaterial({ color: 0xc0504a, roughness: 0.6, sheen: 0.5 }));
        tm.position.copy(tie); tm.rotation.set(0.9, s * 0.6, 0); H.add(tm);
        for (let i = 0; i < 9; i++) {
          const a = (i / 9) * Math.PI * 2, pts = [];
          for (let j = 0; j <= 6; j++) {
            const t = j / 6;
            pts.push(tie.clone().add(V3(s * (0.012 + 0.03 * Math.sin(t * 2.2)) * k + Math.cos(a) * 0.008 * k * (1 + t), -t * 0.13 * k, Math.sin(a) * 0.009 * k * (1 + t) - 0.01 * k * t + Math.sin(t * 6 + a) * 0.006 * k)));
          }
          add(pts, 0.011 * k, 0.55);
        }
      }
      // back strands flowing to the ties
      for (let i = 0; i < 16; i++) {
        const a = lerp(-1.1, 1.1, i / 15), pts = [];
        for (let j = 0; j <= 4; j++) { const t = j / 4; pts.push(scalp(V3(Math.sin(a) * lerp(0.4, 0.85, t), lerp(0.8, -0.45, t), -lerp(0.6, 0.6, t) - 0.2), 0.008 * k)); }
        add(pts, 0.016 * k, 0.3);
      }
    } else {
      // short tousled strands on top
      for (let i = 0; i < 30; i++) {
        const a = Math.random() * Math.PI * 2, r = 0.2 + Math.random() * 0.6, pts = [];
        const base = V3(Math.cos(a) * r, 0.9, Math.sin(a) * r * 0.8 + 0.1);
        for (let j = 0; j <= 3; j++) { const t = j / 3; pts.push(scalp(base.clone().add(V3(0.05 * t, -0.25 * t, 0.35 * t)), (0.006 + 0.004 * Math.sin(t * 3)) * k)); }
        add(pts, 0.008 * k, 0.4);
      }
    }
  }
  buildHand(s) {
    const k = this.k, g = new THREE.Group();
    const gloveM = new THREE.MeshPhysicalMaterial({ map: tex('canvas_col', { srgb: true, repeat: [2, 2] }), normalMap: tex('canvas_nrm', { repeat: [2, 2] }), color: 0xf0e6d2, roughness: 0.92, sheen: 0.8, sheenColor: new THREE.Color(0.9, 0.9, 0.85), sheenRoughness: 0.8 });
    // hand pointing along -y (from the wrist), palm facing +z
    const palm = new THREE.Mesh(deformedSphere(1, 28, 20, (v) => { v.set(v.x * 0.028, v.y * 0.036 - 0.032, v.z * (0.014 + 0.004 * (1 - Math.abs(v.x)))); }), this.skin);
    palm.scale.setScalar(k); palm.castShadow = true; g.add(palm);
    const fingers = new THREE.Group(); g.add(fingers);
    const fl = [0.028, 0.032, 0.03, 0.025];
    for (let i = 0; i < 4; i++) {
      const lt = new LiveTube(10, 10, (t) => 0.0068 * (1 - 0.18 * t) * Math.sqrt(Math.max(0.05, 1 - Math.pow(Math.max(0, t - 0.8) / 0.2, 2))));
      const x = (i - 1.5) * 0.0135, L = fl[i];
      lt.update([V3(x, -0.06, 0), V3(x * 1.05, -0.06 - L * 0.5, 0.004), V3(x * 1.08, -0.06 - L * 0.9, 0.012), V3(x * 1.08, -0.06 - L, 0.018)]);
      const f = new THREE.Mesh(lt.geo, this.skin); f.castShadow = true; fingers.add(f);
    }
    const tt = new LiveTube(10, 10, (t) => 0.0078 * (1 - 0.2 * t) * Math.sqrt(Math.max(0.05, 1 - Math.pow(Math.max(0, t - 0.8) / 0.2, 2))));
    tt.update([V3(-s * 0.018, -0.02, 0.006), V3(-s * 0.03, -0.038, 0.014), V3(-s * 0.034, -0.052, 0.022), V3(-s * 0.033, -0.06, 0.026)]);
    const th = new THREE.Mesh(tt.geo, this.skin); th.castShadow = true; fingers.add(th);
    fingers.scale.setScalar(k);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.026, 0.035, 28, 4, true), gloveM); cuff.position.y = -0.002; cuff.scale.setScalar(k); cuff.visible = false; g.add(cuff);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.003, 8, 32), new THREE.MeshPhysicalMaterial({ color: 0x9a3a32, roughness: 0.8, sheen: 0.5 })); band.rotation.x = Math.PI / 2; band.position.y = 0.014; band.scale.setScalar(k); band.visible = false; g.add(band);
    return { g, palm, fingers, cuff, band, gloveM };
  }
  // put on coveralls / gloves
  dress(part) {
    const cfg = this.cfg;
    if (part === 'coverall') {
      this.shirt.material = cfg.coverMat; this.sleeveEnd = 1;
      for (const a of this.arms) a.sm.material = cfg.coverMat;
      for (const l of this.legs) l.m.material = cfg.coverMat;
      this.buildCoverallExtras();
    }
    if (part === 'gloves') {
      for (const a of this.arms) {
        a.hand.palm.material = a.hand.gloveM; a.hand.fingers.children.forEach((f) => (f.material = a.hand.gloveM));
        a.hand.cuff.visible = true; a.hand.band.visible = true;
        a.hand.palm.scale.setScalar(this.k * 1.12); a.hand.fingers.scale.setScalar(this.k * 1.1);
      }
    }
  }
  buildCoverallExtras() {
    const k = this.k, m = this.cfg.coverMat, ex = this.extras;
    ex.clear();
    // rolled collar around the neck
    const col = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 12, 40), m); col.scale.set(k, k * 1.0, k * 0.85); col.rotation.x = Math.PI / 2 - 0.25; col.position.set(0, 0.325 * k, 0.006 * k); col.castShadow = true; ex.add(col);
    // chest pocket + flap, buttons and zip placket
    const pk = new THREE.Mesh(deformedSphere(1, 20, 12, (v) => v.set(v.x * 0.034, v.y * 0.038, v.z * 0.006)), m);
    pk.position.set(-0.05 * k, 0.215 * k, 0.078 * k); pk.scale.setScalar(k); pk.rotation.x = -0.1; ex.add(pk);
    const fl = new THREE.Mesh(deformedSphere(1, 20, 8, (v) => v.set(v.x * 0.036, v.y * 0.01, v.z * 0.004)), m);
    fl.position.set(-0.05 * k, 0.248 * k, 0.08 * k); fl.scale.setScalar(k); fl.rotation.x = -0.15; ex.add(fl);
    const btnM = new THREE.MeshPhysicalMaterial({ color: 0x7a6a52, metalness: 1, roughness: 0.35 });
    for (const y of [0.04, 0.11, 0.18, 0.25]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.003, 20), btnM);
      b.rotation.x = Math.PI / 2; b.position.set(0, y * k, (y > 0.2 ? 0.08 : 0.092) * k); b.scale.setScalar(k); ex.add(b);
    }
    // belt band at the waist
    const belt = new THREE.Mesh(new THREE.TorusGeometry(1, 0.016, 8, 64), m); belt.scale.set(0.106 * k, 0.106 * k * 0.8, k); belt.rotation.x = Math.PI / 2; belt.position.y = 0.1 * k; belt.scale.set(0.105 * k, 0.088 * k, 0.9 * k);
    ex.add(belt);
  }
  setExpr(n) { if (EXPR[n]) { this.eT = EXPR[n].slice(); this.exprName = n; } }
  setLook(p) { this.lookT.copy(p); }
  // ------------------------------------------------------------- per-frame
  update(dt, t) {
    const k = this.k;
    // expression smoothing
    for (let i = 0; i < 8; i++) this.e[i] = lerp(this.e[i], this.eT[i], 1 - Math.exp(-dt * 9));
    const [smile, open, wide, oS, browUp, browIn, lid, squint] = this.e;
    this.mouth.draw(smile, open + Math.max(0, Math.sin(t * 13)) * 0.06 * (this.talk || 0), wide, oS);
    // blink
    this.blinkT -= dt;
    if (this.blinkT < 0) { this.blink = Math.min(1, this.blink + dt * 14); if (this.blinkT < -0.14) { this.blinkT = 1.8 + Math.random() * 3; } }
    else this.blink = Math.max(0, this.blink - dt * 10);
    // pose base
    const kneel = this.poseMode === 'kneel';
    const pelvisY = (kneel ? 0.335 : 0.565) * k;
    this.pelvis.position.set(0, pelvisY + Math.sin(t * 1.7) * 0.002 * k, 0);
    // torso lean toward what the hands do
    this.torso.updateMatrixWorld(true);
    const leanT = this.leanT || V3();
    this.lean.lerp(leanT, 1 - Math.exp(-dt * 4));
    this.torso.rotation.set(this.lean.x + Math.sin(t * 1.3) * 0.01, this.lean.y, this.lean.z);
    this.torso.updateMatrixWorld(true);
    // head look
    this.look.lerp(this.lookT, 1 - Math.exp(-dt * 5));
    const inv = new THREE.Matrix4().copy(this.headPivot.matrixWorld).invert();
    const lp = this.look.clone().applyMatrix4(inv);
    const yaw = THREE.MathUtils.clamp(Math.atan2(lp.x, lp.z), -1.0, 1.0) * 0.7;
    const pitch = THREE.MathUtils.clamp(-Math.atan2(lp.y - 0.06 * k, Math.hypot(lp.x, lp.z)), -0.6, 0.7) * 0.65;
    this.headTurn.x = lerp(this.headTurn.x, pitch, 1 - Math.exp(-dt * 6)); this.headTurn.y = lerp(this.headTurn.y, yaw, 1 - Math.exp(-dt * 6));
    this.headPivot.rotation.set(this.headTurn.x, this.headTurn.y, (this.tilt || 0) + Math.sin(t * 0.9) * 0.02);
    this.headPivot.updateMatrixWorld(true);
    // eyes aim at the look point, lids follow expression and blink
    for (const e of this.eyes) {
      const li = new THREE.Matrix4().copy(e.eg.matrixWorld).invert();
      const q = this.look.clone().applyMatrix4(li);
      const ey = THREE.MathUtils.clamp(Math.atan2(q.x, q.z), -0.45, 0.45), ep = THREE.MathUtils.clamp(-Math.atan2(q.y, Math.hypot(q.x, q.z)), -0.35, 0.35);
      e.ball.rotation.set(ep, ey, 0);
      const op = lid * (1 - this.blink);
      e.upG.rotation.x = lerp(0.55, -0.78 - 0.3 * Math.max(0, op - 1), Math.min(1, op)) + ep * 0.3;
      e.loG.rotation.x = lerp(-0.1, 0.62, Math.min(1, op)) - squint * 0.3 + ep * 0.2;
      const c = e.brow.userData.c;
      e.brow.position.set(0, (browUp * 0.006 - browIn * 0.002) * k, 0);
      e.brow.rotation.z = e.s * browIn * 0.18 - e.s * browUp * 0.05;
      e.brow.position.x = -e.s * browIn * 0.002 * k;
    }
    // arms
    const tmp = V3(), sW = V3(), invT = new THREE.Matrix4().copy(this.torso.matrixWorld).invert();
    for (let i = 0; i < 2; i++) {
      const a = this.arms[i], s = a.s;
      const S = a.shoulder.clone();
      const Lu = 0.165 * k, Lf = 0.145 * k;
      // rest: hands on the thighs (kneel) / along the sides (stand)
      const rest = kneel ? V3(s * 0.075 * k, -0.02 * k, 0.12 * k) : V3(s * 0.15 * k, -0.06 * k, 0.03 * k);
      let target = rest.clone();
      const w = this.reachW[i] = lerp(this.reachW[i], this.reach[i] ? 1 : 0, 1 - Math.exp(-dt * 8));
      if (this.reach[i]) { tmp.copy(this.reach[i]).applyMatrix4(invT); this.handPos[i].copy(tmp); }
      if (w > 0.001) target.lerp(this.handPos[i], w);
      // wrist target: hand length back from the touch point
      const dir = target.clone().sub(S); let d = dir.length(); dir.normalize();
      const reachMax = (Lu + Lf) * 0.995 + 0.07 * k;
      const W = S.clone().addScaledVector(dir, Math.min(d, reachMax) - 0.07 * k * w);
      const dw = Math.min(W.distanceTo(S), (Lu + Lf) * 0.995);
      // elbow by law of cosines, pole points down/out/back
      const ax = W.clone().sub(S).normalize();
      const pole = V3(s * 0.6, -1, -0.5).normalize();
      pole.addScaledVector(ax, -pole.dot(ax)).normalize();
      const ca = (Lu * Lu + dw * dw - Lf * Lf) / (2 * Lu * dw);
      const ang = Math.acos(THREE.MathUtils.clamp(ca, -1, 1));
      const E = S.clone().addScaledVector(ax, Math.cos(ang) * Lu).addScaledVector(pole, Math.sin(ang) * Lu);
      const Wr = S.clone().addScaledVector(ax, dw);
      a.elbow.copy(E); a.wrist.copy(Wr);
      const S0 = S.clone().add(V3(-s * 0.05 * k, -0.005 * k, 0));
      const pts = [S0, S, S.clone().lerp(E, 0.5), E, E.clone().lerp(Wr, 0.5), Wr];
      a.tube.update(pts, V3(0, 0, 1));
      const se = this.sleeveEnd;
      if (se >= 0.99) a.slv.update(pts, V3(0, 0, 1));
      else { const ce = new THREE.CatmullRomCurve3(pts, false, 'centripetal'); const sp = []; for (let j = 0; j <= 4; j++) sp.push(ce.getPointAt((j / 4) * se)); a.slv.update(sp, V3(0, 0, 1)); }
      // hand orientation: along forearm, palm toward the target surface / thigh
      const fwd = Wr.clone().sub(E).normalize();
      const h = a.hand.g; h.position.copy(Wr);
      const yAx = fwd.clone().negate();
      const palmDir = (this.palmN && this.palmN[i] && w > 0.3) ? this.palmN[i].clone().transformDirection(invT).negate() : V3(-s * 0.3, -0.5, 0.2).normalize();
      const zAx = palmDir.addScaledVector(yAx, -palmDir.dot(yAx)).normalize();
      const xAx = V3().crossVectors(yAx, zAx);
      h.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xAx, yAx, zAx));
      a.hand.fingers.rotation.x = (this.grip ? this.grip[i] : 0) * 0.6;
    }
    // legs
    for (const l of this.legs) {
      const s = l.s, hx = s * 0.062 * k;
      let pts;
      if (kneel) {
        const knee = V3(s * 0.07 * k, -pelvisY + 0.045 * k, 0.07 * k), ank = V3(s * 0.068 * k, -pelvisY + 0.04 * k, -0.2 * k);
        pts = [V3(hx, 0.02 * k, -0.01 * k), V3(hx, -0.03 * k, 0.01 * k), V3(s * 0.068 * k, -pelvisY * 0.5, 0.05 * k), knee, knee.clone().add(V3(0, -0.005 * k, -0.06 * k)), ank];
        l.shoe.position.set(s * 0.068 * k, -pelvisY + 0.04 * k, -0.27 * k); l.shoe.rotation.set(-1.45, 0, 0);
      } else {
        const knee = V3(s * 0.068 * k, -pelvisY * 0.5, 0.012 * k), ank = V3(s * 0.07 * k, -pelvisY + 0.075 * k, 0);
        pts = [V3(hx, 0.02 * k, -0.01 * k), V3(hx, -0.03 * k, 0), V3(s * 0.066 * k, -pelvisY * 0.3, 0.008 * k), knee, V3(s * 0.069 * k, -pelvisY * 0.75, 0.002 * k), ank];
        l.shoe.position.set(s * 0.07 * k, -pelvisY + 0.03 * k, 0.03 * k); l.shoe.rotation.set(0, s * 0.12, 0);
      }
      if (l.lastPose !== this.poseMode) { l.tube.update(pts, V3(0, 0, 1)); l.lastPose = this.poseMode; }
    }
  }
}
