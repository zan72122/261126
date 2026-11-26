// Realistic-proportion characters built from smooth swept surfaces (not capsules):
// sculpted head with planar-safe face canvas (mouth/blush/paint), 3D eyeballs with iris + lids + lashes,
// hair as many tapered ribbon clumps with anisotropic sheen, clothes with folds + woven normal maps.
import * as THREE from 'three';
import { sweep, capped, keys, curve, V3, canvas, canvasTex, tex, clamp, lerp, damp, noise2, smooth, rand } from './util.js';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- materials
export function clothMat(kind, color, o = {}) {
  const rep = o.repeat || 6;
  return new THREE.MeshPhysicalMaterial({
    color, map: o.map || tex(kind + '_detail.jpg', { srgb: true, repeat: [rep, rep] }),
    normalMap: tex(kind + '_normal.jpg', { repeat: [rep, rep] }), normalScale: new THREE.Vector2(o.ns || 0.8, o.ns || 0.8),
    roughness: o.rough || 0.88, sheen: o.sheen ?? 0.6, sheenRoughness: 0.7, sheenColor: new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.4),
    side: o.side || THREE.FrontSide,
  });
}
export function skinMat(color, map) {
  return new THREE.MeshPhysicalMaterial({
    color: map ? 0xffffff : color, map: map || null,
    normalMap: tex('skin_normal.jpg', { repeat: [5, 5] }), normalScale: new THREE.Vector2(0.25, 0.25),
    roughness: 0.52, sheen: 0.35, sheenRoughness: 0.45, sheenColor: new THREE.Color(0xff8a70),
    specularIntensity: 0.55, clearcoat: 0.08, clearcoatRoughness: 0.4,
    emissive: new THREE.Color(0.06, 0.018, 0.01),
  });
}
function hairMat(color) {
  return new THREE.MeshPhysicalMaterial({
    color, map: tex('hair_detail.jpg', { srgb: true, repeat: [3, 1] }), normalMap: tex('hair_normal.jpg', { repeat: [3, 1] }),
    normalScale: new THREE.Vector2(0.7, 0.7),
    roughness: 0.38, anisotropy: 0.8, anisotropyRotation: Math.PI / 2, sheen: 0.4, sheenColor: new THREE.Color(color).multiplyScalar(2.5), sheenRoughness: 0.35,
    specularIntensity: 0.8, side: THREE.DoubleSide,
  });
}

// ---------------------------------------------------------------- head sculpt
function makeDeform(P) {
  const g = (p, c, w, a) => { const dx = (p.x - c[0]) / w[0], dy = (p.y - c[1]) / w[1], dz = (p.z - c[2]) / (w[2] || 0.5); return a * Math.exp(-(dx * dx + dy * dy + dz * dz)); };
  return (p0) => {
    const p = p0.clone();
    let s = clamp(-p.y, 0, 1);
    p.x *= P.sx * (1 - P.jaw * Math.pow(s, 1.6));
    p.z *= P.sz * (1 - 0.10 * Math.pow(s, 2)) * (p.z < 0 ? P.back : 1);
    p.y *= P.sy * (1 - P.lowerShrink * s);
    if (p0.y < -0.75) p.y = lerp(p.y, -0.75 * P.sy - (Math.abs(p0.y) - 0.75) * 0.55 * P.sy, P.chinFlat);
    const nrm = p0.clone();
    let d = 0;
    d += g(p0, [0.48, -0.32, 0.78], [0.22, 0.22, 0.4], P.cheek) + g(p0, [-0.48, -0.32, 0.78], [0.22, 0.22, 0.4], P.cheek);
    if (!P.noSocket) for (const sx of [-1, 1]) {
      const e = dirOf(sx * P.eyeLon, P.eyeLat);
      const dx = (p0.x - e.x) / P.eyeAx, dy = (p0.y - e.y) / P.eyeAy;
      const r2 = dx * dx + dy * dy;
      if (p0.z > 0.3) d -= P.socketD * Math.exp(-r2 * r2 * 1.2) + P.socket * Math.exp(-r2 * 0.4);
    }
    d += g(p0, [0, 0.2, 0.95], [0.5, 0.08, 0.4], P.brow);
    d += g(p0, [0, -0.17 - P.noseL * 0.5, 1], [0.08, P.noseL, 0.3], P.nose) + g(p0, [0, -0.29, 1], [0.075, 0.06, 0.25], P.nose * 0.6);
    d += g(p0, [0.07, -0.33, 0.95], [0.05, 0.04, 0.25], P.nose * 0.25) + g(p0, [-0.07, -0.33, 0.95], [0.05, 0.04, 0.25], P.nose * 0.25);
    d += g(p0, [0, -0.47, 0.95], [0.16, 0.05, 0.3], P.lip) + g(p0, [0, -0.56, 0.93], [0.13, 0.04, 0.3], P.lip * 0.8);
    d += g(p0, [0, -0.78, 0.7], [0.25, 0.12, 0.3], P.chin);
    p.addScaledVector(nrm, d);
    return p;
  };
}
const dirOf = (lon, lat) => V3(Math.sin(lon) * Math.cos(lat), Math.sin(lat), Math.cos(lon) * Math.cos(lat));

function headGeometry(deform) {
  const g = new THREE.SphereGeometry(1, 96, 64, -Math.PI / 2);
  const pa = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i); const d = deform(v); pa.setXYZ(i, d.x, d.y, d.z); }
  g.computeVertexNormals();
  return g;
}

// ---------------------------------------------------------------- face canvas (latlong layout: u=0.5 front, v top)
const FW = 1024, FH = 512;
const fx = lon => (0.5 + lon / TAU) * FW, fy = lat => (0.5 - lat / Math.PI) * FH;

function baseFace(P) {
  const c = canvas(FW, FH), g = c.getContext('2d');
  g.fillStyle = P.skin; g.fillRect(0, 0, FW, FH);
  // subtle mottling
  for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(${150 + rand(0, 60) | 0},${80 + rand(0, 40) | 0},${70 + rand(0, 30) | 0},0.035)`; g.beginPath(); g.arc(rand(0, FW), rand(0, FH), rand(2, 12), 0, TAU); g.fill(); }
  const rg = (x, y, r, col, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col.replace('A', a)); gr.addColorStop(1, col.replace('A', 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); };
  // cheeks blush, warm nose tip, eye-area slightly darker
  rg(fx(0.52), fy(-0.3), 55, 'rgba(235,110,100,A)', P.blush);
  rg(fx(-0.52), fy(-0.3), 55, 'rgba(235,110,100,A)', P.blush);
  rg(fx(0), fy(-0.27), 22, 'rgba(220,120,105,A)', 0.28);
  rg(fx(0.34), fy(0.06), 30, 'rgba(120,70,70,A)', 0.12); rg(fx(-0.34), fy(0.06), 30, 'rgba(120,70,70,A)', 0.12);
  rg(fx(0), fy(-0.78), 60, 'rgba(200,120,100,A)', 0.08);
  if (P.stubble) {
    for (let i = 0; i < 9000; i++) {
      const lon = rand(-1.25, 1.25), lat = rand(-1.05, -0.33);
      const w = smooth(0.0, 0.2, Math.abs(lon) - 0.0) * 0.6 + 0.4;
      if (Math.abs(lon) > 0.95 && lat > -0.5) continue;
      if (Math.abs(lon) < 0.16 && lat > -0.42 && lat < -0.36) continue;
      g.fillStyle = `rgba(40,28,22,${0.22 * w})`; g.fillRect(fx(lon), fy(lat), 1.3, 1.3);
    }
  }
  return c;
}

function drawMouth(g, E, P) {
  const cx = fx(0), cy = fy(P.mouthLat);
  const w = P.mouthW * (1 + 0.25 * E.smile + 0.1 * E.open) * (E.pucker ? 1 - 0.45 * E.pucker : 1);
  const open = E.open * P.mouthH;
  const curve = E.smile * 7 * P.mouthW / 40;
  const lip = P.lipCol;
  g.save();
  g.translate(cx + (E.skew || 0) * 8, cy);
  if (open < 1.2) {
    // closed lips: soft upper lip shape + parting line that curls up at corners
    g.fillStyle = lip; g.globalAlpha = 0.55;
    g.beginPath(); g.moveTo(-w, 0); g.quadraticCurveTo(-w * 0.4, -6, 0, -4.5); g.quadraticCurveTo(w * 0.4, -6, w, 0);
    g.quadraticCurveTo(0, 2 - curve * 0.3, -w, 0); g.fill();
    g.globalAlpha = 0.4; g.beginPath(); g.moveTo(-w * 0.8, 1); g.quadraticCurveTo(0, 9 - curve * 0.3, w * 0.8, 1); g.quadraticCurveTo(0, 3, -w * 0.8, 1); g.fill();
    g.globalAlpha = 0.9; g.strokeStyle = P.lipLine; g.lineWidth = 2.4; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-w, -curve); g.quadraticCurveTo(0, curve * 0.9 + 1, w, -curve); g.stroke();
  } else {
    const top = -open * 0.25 - curve * 0.1, bot = open;
    g.beginPath();
    g.moveTo(-w, -curve * 0.8);
    g.bezierCurveTo(-w * 0.5, top - 3, w * 0.5, top - 3, w, -curve * 0.8);
    g.bezierCurveTo(w * 0.7, bot, -w * 0.7, bot, -w, -curve * 0.8);
    g.closePath();
    g.fillStyle = '#4a1414'; g.fill();
    g.save(); g.clip();
    g.fillStyle = '#efe6dc'; g.fillRect(-w, top - 4, 2 * w, Math.min(6 + open * 0.12, 9));      // upper teeth
    g.fillStyle = '#c0545a'; g.beginPath(); g.ellipse(0, bot + 2, w * 0.6, open * 0.45, 0, 0, TAU); g.fill(); // tongue
    g.restore();
    g.strokeStyle = lip; g.lineWidth = 4.2; g.globalAlpha = 0.85; g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- eye
function irisTex(color) {
  const c = canvas(256, 256), g = c.getContext('2d');
  g.fillStyle = '#f2ece6'; g.fillRect(0, 0, 256, 256);
  const gr = g.createLinearGradient(0, 60, 0, 256); gr.addColorStop(0, 'rgba(230,170,170,0)'); gr.addColorStop(1, 'rgba(200,120,120,0.6)');
  g.fillStyle = gr; g.fillRect(0, 60, 256, 196);
  const IR = 40, PR = 17;
  for (let x = 0; x < 256; x++) { // radial fibers
    const k = 0.75 + 0.5 * Math.random();
    const cc = new THREE.Color(color).multiplyScalar(k);
    g.fillStyle = '#' + cc.getHexString(); g.fillRect(x, 0, 1, IR);
  }
  const lr = g.createLinearGradient(0, IR - 9, 0, IR + 2); lr.addColorStop(0, 'rgba(15,8,5,0)'); lr.addColorStop(0.7, 'rgba(15,8,5,0.85)'); lr.addColorStop(1, 'rgba(15,8,5,0)');
  g.fillStyle = lr; g.fillRect(0, IR - 9, 256, 11);
  const cr = g.createLinearGradient(0, PR, 0, PR + 10); cr.addColorStop(0, 'rgba(220,170,90,0.45)'); cr.addColorStop(1, 'rgba(220,170,90,0)');
  g.fillStyle = cr; g.fillRect(0, PR, 256, 10);
  g.fillStyle = '#050304'; g.fillRect(0, 0, 256, PR);
  return canvasTex(c);
}

// ---------------------------------------------------------------- hand
export function handGeo(L) { // L = palm length; built pointing -y, palm facing +z (front)
  const parts = [];
  const pw = L * 0.48, pt = L * 0.2;
  parts.push(sweep(curve([[0, 0.01 * L, 0], [0, -L * 0.5, 0.02 * L], [0, -L, 0]], 8), capped(keys([[0, pw * 0.8, pt], [0.5, pw, pt * 1.05], [1, pw * 0.95, pt * 0.85]]), 0.2, 0.25), { radial: 14 }));
  const fl = [0.78, 0.9, 0.85, 0.66];
  for (let i = 0; i < 4; i++) {
    const x = (i - 1.5) * pw * 0.5, l = L * fl[i] * 0.85;
    const pts = [[x, -L * 0.86, 0], [x * 1.02, -L * 0.86 - l * 0.45, l * 0.18], [x * 1.0, -L * 0.86 - l * 0.8, l * 0.5], [x * 0.98, -L * 0.86 - l * 0.92, l * 0.78]];
    parts.push(sweep(curve(pts, 8), capped(t => [pw * 0.25 * (1 - 0.2 * t), pw * 0.23 * (1 - 0.2 * t)], 0.15, 0.3), { radial: 8 }));
  }
  const tp = [[-pw * 0.8, -L * 0.25, pt * 0.4], [-pw * 1.2, -L * 0.55, pt * 1.4], [-pw * 1.1, -L * 0.8, pt * 2.6]];
  parts.push(sweep(curve(tp, 8), capped(() => [pw * 0.25, pw * 0.22], 0.15, 0.3), { radial: 8 }));
  return parts;
}

// ---------------------------------------------------------------- Person
const PRESET = {
  neutral: { smile: 0.25, open: 0, brow: 0, browIn: 0, squint: 0, lidUp: 0, pucker: 0, skew: 0, tilt: 0 },
  happy: { smile: 1, open: 0.35, brow: 0.3, browIn: 0, squint: 0.35, lidUp: 0, pucker: 0, skew: 0, tilt: 0 },
  laugh: { smile: 1, open: 1, brow: 0.5, browIn: 0, squint: 0.85, lidUp: 0, pucker: 0, skew: 0, tilt: 0 },
  surprised: { smile: 0, open: 0.9, brow: 1, browIn: 0, squint: 0, lidUp: 0.25, pucker: 0.5, skew: 0, tilt: 0 },
  puzzled: { smile: -0.2, open: 0.15, brow: 0.6, browIn: 0.6, squint: 0.1, lidUp: 0, pucker: 0.45, skew: 0.8, tilt: 0.22 },
  focus: { smile: 0.15, open: 0.12, brow: -0.2, browIn: 0.4, squint: 0.25, lidUp: 0, pucker: 0.2, skew: 0.6, tilt: 0.08 },
  shocked: { smile: -0.4, open: 0.8, brow: 1, browIn: 0.3, squint: 0, lidUp: 0.3, pucker: 0.3, skew: 0, tilt: 0 },
  oops: { smile: -0.3, open: 0.35, brow: 0.7, browIn: 0.8, squint: 0.2, lidUp: 0, pucker: 0.1, skew: -0.5, tilt: -0.1 },
  proud: { smile: 0.9, open: 0.0, brow: 0.2, browIn: 0, squint: 0.45, lidUp: 0, pucker: 0, skew: 0, tilt: 0.12 },
};

export class Person {
  constructor(kind) {
    this.kind = kind;
    const kid = kind === 'girl';
    const P = this.P = kid ? {
      H: 1.1, hipY: 0.53, hipX: 0.055, thigh: 0.235, shin: 0.225, headR: 0.09, eyeR: 0.0125, eyeLon: 0.37, eyeLat: -0.02,
      sx: 0.88, sy: 1.03, sz: 0.97, back: 1.06, jaw: 0.34, chinFlat: 0.4, cheek: 0.09, noseL: 0.07, socket: 0.03, socketD: 0.26, eyeAx: 0.15, eyeAy: 0.12, lowerShrink: 0.14, brow: 0.0, nose: 0.06, lip: 0.025, chin: 0.02,
      skin: '#ebb594', blush: 0.45, lipCol: '#cf7f7c', lipLine: '#8a3f3c', mouthLat: -0.5, mouthW: 30, mouthH: 30, iris: 0x6a3a1a,
      hair: 0x24150c, shoulderX: 0.112, shoulderY: 0.305, neckY: 0.345, upper: 0.17, fore: 0.145, palm: 0.06,
    } : {
      H: 1.78, hipY: 0.93, hipX: 0.095, thigh: 0.43, shin: 0.42, headR: 0.106, eyeR: 0.0122, eyeLon: 0.33, eyeLat: 0.07,
      sx: 0.8, sy: 1.12, sz: 0.98, back: 1.0, jaw: 0.14, noseL: 0.1, chinFlat: 0.6, cheek: 0.025, socket: 0.05, socketD: 0.24, eyeAx: 0.14, eyeAy: 0.1, lowerShrink: 0.02, brow: 0.035, nose: 0.11, lip: 0.02, chin: 0.05,
      skin: '#d39c7a', blush: 0.18, lipCol: '#b9706a', lipLine: '#6e3530', mouthLat: -0.5, mouthW: 34, mouthH: 26, iris: 0x3a2412, stubble: true,
      hair: 0x1a120c, shoulderX: 0.188, shoulderY: 0.45, neckY: 0.505, upper: 0.30, fore: 0.27, palm: 0.1,
    };
    this.root = new THREE.Group();
    this.E = { ...PRESET.neutral }; this.Et = { ...PRESET.neutral };
    this.expr = 'neutral'; this.exprT = 0;
    this.blink = 0; this.blinkT = rand(1, 3);
    this.look = null; this.time = rand(0, 10);
    this.paintAmt = 0;
    this.mats = {};
    this.build();
    this.pose = { lean: 0, bob: 0, jump: 0, crouch: 0, armL: 'rest', armR: 'rest', tL: null, tR: null, sit: 0, turn: 0 };
    this.qtmp = new THREE.Quaternion();
  }

  build() {
    const P = this.P, kid = this.kind === 'girl', s = kid ? 1 : 1.7;
    const skinCol = new THREE.Color(P.skin);
    this.mats.skin = skinMat(skinCol);
    // ---- clothes
    if (kid) {
      this.mats.shirt = clothMat('knit', 0xd9a441, { repeat: 8 });
      this.mats.legs = clothMat('knit', 0x2c3446, { repeat: 8 });
      this.mats.over = clothMat('canvas', 0xece6d8, { repeat: 7, ns: 1.0, map: this.splatterMap(0xece6d8, 3) });
    } else {
      this.mats.shirt = clothMat('knit', 0x6f8796, { repeat: 6 });
      this.mats.over = clothMat('canvas', 0xe9e3d6, { repeat: 6, ns: 1.0, map: this.splatterMap(0xe9e3d6, 16) });
      this.mats.legs = this.mats.over;
    }
    this.mats.shoe = new THREE.MeshPhysicalMaterial({ color: kid ? 0x3f5f80 : 0x6b5a48, map: tex('canvas_detail.jpg', { srgb: true, repeat: [4, 4] }), normalMap: tex('canvas_normal.jpg', { repeat: [4, 4] }), roughness: 0.8, sheen: 0.3 });
    this.mats.sole = new THREE.MeshStandardMaterial({ color: kid ? 0xf2efe8 : 0x2b2622, roughness: 0.7 });
    this.mats.hair = hairMat(P.hair);

    const pelvis = this.pelvis = new THREE.Group(); pelvis.position.y = P.hipY; this.root.add(pelvis);
    const torsoJ = this.torsoJ = new THREE.Group(); pelvis.add(torsoJ);
    const fold = (amp, fr) => (t, th) => amp * (noise2(th * fr, t * 9) * 0.6 + noise2(th * fr * 2.1 + 5, t * 17) * 0.4);
    const mesh = (geo, mat, parent) => { const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
    const vpath = (y0, y1, n = 24, z = 0) => { const a = []; for (let i = 0; i < n; i++) a.push(V3(0, lerp(y0, y1, i / (n - 1)), z)); return a; };
    const keyY = (k, y0, y1) => keys(k.map(([y, a, b]) => [(y - y0) / (y1 - y0), a, b]));

    // ---- torso
    const TK = kid ? [[-0.09, 0.03, 0.03], [-0.075, 0.075, 0.062], [-0.04, 0.1, 0.073], [0.02, 0.108, 0.076], [0.11, 0.1, 0.076], [0.18, 0.104, 0.08], [0.25, 0.11, 0.072], [0.29, 0.122, 0.066], [0.315, 0.118, 0.06], [0.335, 0.095, 0.052], [0.355, 0.06, 0.042], [0.375, 0.035, 0.032]]
      : [[-0.14, 0.05, 0.04], [-0.12, 0.13, 0.1], [-0.06, 0.168, 0.112], [0.02, 0.175, 0.115], [0.16, 0.168, 0.122], [0.3, 0.182, 0.12], [0.4, 0.2, 0.105], [0.45, 0.198, 0.095], [0.485, 0.15, 0.08], [0.51, 0.1, 0.066], [0.53, 0.065, 0.058]];
    let y0 = TK[0][0]; const y1 = TK[TK.length - 1][0];
    if (kid) { // leggings seat under the shirt hem
      const LK = [[-0.1, 0.03, 0.03], [-0.085, 0.085, 0.064], [-0.05, 0.104, 0.074], [0.0, 0.106, 0.075], [0.06, 0.1, 0.073]];
      mesh(sweep(vpath(-0.1, 0.06, 12), keyY(LK, -0.1, 0.06), { radial: 28, pow: 2.3, up: V3(1, 0, 0) }), this.mats.legs, torsoJ);
      TK.splice(0, 3, [-0.035, 0.118, 0.083], [-0.01, 0.112, 0.08]);
    }
    const tor = mesh(sweep(vpath(TK[0][0], y1, 30), keyY(TK, TK[0][0], y1), { radial: 32, pow: 2.5, fold: fold(0.025, 2), uScale: 3, vScale: 2, up: V3(1, 0, 0) }), this.mats.shirt, torsoJ);
    if (kid) { tor.material = this.mats.shirt; this.mats.shirt.side = THREE.DoubleSide; y0 = TK[0][0]; }
    // overalls / bib + pants top
    const OK = kid ? [[-0.105, 0.04, 0.035], [-0.09, 0.098, 0.07], [-0.06, 0.112, 0.08], [-0.03, 0.117, 0.084], [0.02, 0.118, 0.084], [0.12, 0.11, 0.084], [0.17, 0.112, 0.087]]
      : [[-0.19, 0.06, 0.05], [-0.16, 0.16, 0.11], [-0.1, 0.182, 0.12], [0.02, 0.186, 0.123], [0.16, 0.18, 0.13], [0.22, 0.183, 0.13]];
    this.overParts = [];
    const oy0 = OK[0][0], oy1 = OK[OK.length - 1][0];
    this.overParts.push(mesh(sweep(vpath(oy0, oy1, 20), keyY(OK, oy0, oy1), { radial: 28, pow: 2.6, fold: fold(0.04, 3), uScale: 3, up: V3(1, 0, 0) }), this.mats.over, torsoJ));
    // bib panel on the chest
    {
      const by0 = oy1 - 0.01, by1 = kid ? 0.29 : 0.43, bw = kid ? 0.07 : 0.12;
      const zf = (y) => { const k = keyY(TK, y0, y1)((y - y0) / (y1 - y0)); return k[1]; };
      const shape = new THREE.Shape(); shape.moveTo(-bw * 1.1, 0); shape.lineTo(bw * 1.1, 0); shape.lineTo(bw, by1 - by0); shape.lineTo(-bw, by1 - by0); shape.closePath();
      const bg = new THREE.ExtrudeGeometry(shape, { depth: 0.006 * s, bevelEnabled: true, bevelSize: 0.004 * s, bevelThickness: 0.003 * s, bevelSegments: 2, curveSegments: 4 });
      const pa = bg.attributes.position;
      for (let i = 0; i < pa.count; i++) { const y = pa.getY(i) + by0; const x = pa.getX(i); const depth = zf(y); pa.setY(i, y); pa.setZ(i, pa.getZ(i) + depth * 1.04 * Math.cos(Math.asin(clamp(x / (depth * 1.7), -1, 1))) + 0.004 * s); }
      bg.computeVertexNormals();
      this.overParts.push(mesh(bg, this.mats.over, torsoJ));
      // pocket + straps
      for (const sx of [-1, 1]) {
        const top = V3(sx * bw * 0.85, by1 - 0.005, zf(by1) * 0.7);
        const pts = [top, V3(sx * (P.shoulderX * 0.65), P.shoulderY + 0.035 * s, 0.01 * s), V3(sx * (P.shoulderX * 0.6), P.shoulderY + 0.02 * s, -0.06 * s), V3(sx * 0.03 * s, oy1 - 0.02, -zf(oy1) * 1.02)];
        this.overParts.push(mesh(sweep(curve(pts, 16), () => [0.014 * s, 0.003 * s], { radial: 6, up: V3(1, 0, 0) }), this.mats.over, torsoJ));
        const btn = mesh(new THREE.CylinderGeometry(0.008 * s, 0.008 * s, 0.004 * s, 16), new THREE.MeshStandardMaterial({ color: 0xb89a62, metalness: 1, roughness: 0.35 }), torsoJ);
        btn.rotation.x = Math.PI / 2; btn.position.copy(top).add(V3(0, -0.012 * s, 0.006 * s)); this.overParts.push(btn);
      }
    }
    // ---- neck & head
    const neckJ = this.neckJ = new THREE.Group(); neckJ.position.y = P.neckY; torsoJ.add(neckJ);
    const nr = kid ? 0.035 : 0.064;
    mesh(sweep(vpath(-0.02, kid ? 0.085 : 0.12, 10), () => [nr, nr * 0.95], { radial: 16 }), this.mats.skin, neckJ);
    const headJ = this.headJ = new THREE.Group(); headJ.position.y = kid ? 0.065 : 0.075; neckJ.add(headJ);
    const head = this.head = new THREE.Group(); head.position.set(0, kid ? 0.045 : 0.07, kid ? 0.008 : 0.012); head.scale.setScalar(P.headR); headJ.add(head);
    this.deform = makeDeform(P);
    this.faceBase = baseFace(P);
    this.faceC = canvas(FW, FH); this.faceG = this.faceC.getContext('2d');
    this.faceTex = canvasTex(this.faceC);
    this.mats.face = skinMat(skinCol, this.faceTex);
    this.headMesh = mesh(headGeometry(this.deform), this.mats.face, head);
    
    this.faceDirty = true;
    // ears
    for (const sx of [-1, 1]) {
      const eg = new THREE.SphereGeometry(1, 20, 14); eg.scale(0.07, 0.2, 0.13);
      const ear = mesh(eg, this.mats.skin, head);
      const p = this.deform(dirOf(sx * Math.PI / 2 * 1.02, -0.08)); ear.position.copy(p).multiplyScalar(0.98); ear.rotation.y = sx * 0.35; ear.rotation.z = -sx * 0.1;
      const inner = mesh(new THREE.SphereGeometry(1, 12, 10).scale(0.035, 0.12, 0.07), new THREE.MeshStandardMaterial({ color: new THREE.Color(P.skin).multiplyScalar(0.7), roughness: 0.6 }), ear);
      inner.position.x = sx * 0.04; inner.scale.setScalar(1);
    }
    // eyes
    this.eyes = [];
    const eyeMat = new THREE.MeshPhysicalMaterial({ map: irisTex(P.iris), roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1 });
    const lidMat = this.mats.skin;
    const lashMat = new THREE.MeshStandardMaterial({ color: 0x120a06, roughness: 0.6 });
    const er = P.eyeR / P.headR;
    for (const sx of [-1, 1]) {
      const dir = dirOf(sx * P.eyeLon, P.eyeLat);
      P.noSocket = true; const surf = this.deform(dir); P.noSocket = false;
      const c = surf.clone().addScaledVector(dir, -er * (kid ? 0.62 : 0.92));
      const eg = new THREE.Group(); eg.position.copy(c); head.add(eg);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(er, 32, 24).rotateX(Math.PI / 2), eyeMat); eg.add(ball);
      const mkLid = (upper) => {
        const lg = new THREE.Group(); eg.add(lg);
        const geo = new THREE.SphereGeometry(er * (kid ? 1.1 : 1.05), 28, 10, 0, TAU, upper ? 0 : Math.PI / 2, Math.PI / 2);
        const lid = new THREE.Mesh(geo, lidMat); lid.castShadow = false; lg.add(lid);
        const lash = new THREE.Mesh(new THREE.TorusGeometry(er * 1.1, er * (upper ? 0.085 : 0.04), 5, 20, Math.PI), lashMat);
        lash.rotation.x = Math.PI / 2; if (!upper) lash.position.y = -0.0; lg.add(lash);
        if (upper && this.kind === 'girl') { lash.scale.set(1.02, 1.02, 1.6); }
        return lg;
      };
      const up = mkLid(true), lo = mkLid(false);
      // eyes sit in a slightly sunken socket; orient lid groups to face direction
      eg.lookAt(eg.position.clone().add(dir));
      eg.rotateY(Math.PI); eg.rotateY(Math.PI); // keep lookAt (+z forward)
      this.eyes.push({ g: eg, ball, up, lo, sx });
    }
    // brows
    this.brows = [];
    const browMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(P.hair).multiplyScalar(1.4), roughness: 0.8, map: tex('hair_detail.jpg', { srgb: true, repeat: [1, 3] }) });
    for (const sx of [-1, 1]) {
      const pts = [];
      for (let i = 0; i < 7; i++) {
        const t = i / 6, lon = sx * (P.eyeLon - 0.17 + t * 0.36), lat = P.eyeLat + 0.17 + Math.sin(t * Math.PI) * 0.045 - t * 0.02;
        pts.push(this.deform(dirOf(lon, lat)).multiplyScalar(1.012));
      }
      const thick = this.kind === 'girl' ? 0.018 : 0.028;
      const bg = new THREE.Group(); head.add(bg);
      mesh(sweep(pts, capped(t => [thick * (1.1 - 0.6 * t), thick * 0.35], 0.15, 0.3), { radial: 8 }), browMat, bg);
      this.brows.push({ g: bg, sx });
    }
    // ---- hair
    this.hair = new THREE.Group(); head.add(this.hair);
    this.buildHair(kid);
    // ---- skinned limbs: one continuous surface per limb, weighted across the elbow / knee
    this.skinned = [];
    const limb = (parent, boneA, boneB, L1, y0, y1, prof, mat, opts = {}) => {
      // geometry is authored in boneA space (path along -y); vertices past -L1 follow boneB
      const g = sweep(vpath(y0, y1, opts.n || 22), prof, { radial: opts.radial || 18, fold: opts.fold, uScale: opts.uScale || 2, vScale: opts.vScale || 3 });
      const pa = g.attributes.position, n = pa.count;
      const si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
      const bw = opts.blend || 0.04;
      for (let i = 0; i < n; i++) { const w = smooth(-L1 + bw, -L1 - bw, pa.getY(i)); si[i * 4] = 0; si[i * 4 + 1] = 1; sw[i * 4] = 1 - w; sw[i * 4 + 1] = w; }
      g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
      g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
      // place the geometry in the parent's space at the bone's rest position
      g.translate(boneA.position.x, boneA.position.y, boneA.position.z);
      const m = new THREE.SkinnedMesh(g, mat);
      m.castShadow = m.receiveShadow = true; m.frustumCulled = false;
      parent.add(m);
      this.skinned.push({ m, bones: [boneA, boneB] });
      return m;
    };
    // ---- arms
    this.arms = [];
    const sleeveMat = clothMat('knit', this.mats.shirt.color.getHex(), { repeat: 3, side: THREE.DoubleSide });
    this.mats.sleeve = sleeveMat;
    for (const sx of [-1, 1]) {
      const sh = new THREE.Bone(); sh.position.set(sx * P.shoulderX, P.shoulderY, 0); torsoJ.add(sh);
      const el = new THREE.Bone(); el.position.y = -P.upper; sh.add(el);
      const r0 = kid ? 0.03 : 0.052, r1 = kid ? 0.022 : 0.04, r2 = kid ? 0.017 : 0.03;
      const L = P.upper + P.fore;
      const eT = P.upper / (L + r2), fT = (L) / (L + r2);
      limb(torsoJ, sh, el, P.upper, 0.012, -L - r2 * 0.4, capped(t => {
        const a = t < eT ? lerp(r0, r1 * 1.08, smooth(0, eT, t)) : lerp(r1 * 1.08, r2 * 1.05, smooth(eT, fT, t));
        const bulge = Math.exp(-Math.pow((t - eT * 0.45) / 0.15, 2)) * r0 * 0.1 + Math.exp(-Math.pow((t - (eT + 0.12)) / 0.1, 2)) * r1 * 0.12;
        return [a + bulge, (a + bulge) * (t > eT ? 0.86 : 0.95)];
      }, 0.12, 0.06), this.mats.skin, { n: 26 });
      // sleeve (t-shirt), slightly flared, open end; stays above the elbow so it can be rigid
      const sl = kid ? 0.085 : 0.15;
      const slm = new THREE.Mesh(sweep(vpath(0.03, -sl, 10), capped(t => [lerp(r0 * 1.3, r0 * 1.22, t), lerp(r0 * 1.22, r0 * 1.14, t)], 0.3, 0), { radial: 18, fold: fold(0.05, 3) }), sleeveMat);
      slm.castShadow = true; sh.add(slm);
      const wr = new THREE.Group(); wr.position.y = -P.fore; el.add(wr);
      for (const g of handGeo(P.palm)) mesh(g, this.mats.skin, wr);
      wr.rotation.y = -sx * 0.4;
      this.arms.push({ sh, el, wr, sx, L1: P.upper, L2: P.fore + P.palm * 0.5 });
    }
    // ---- legs
    this.legs = [];
    for (const sx of [-1, 1]) {
      const th = new THREE.Bone(); th.position.set(sx * P.hipX, -0.02, 0); pelvis.add(th);
      const kn = new THREE.Bone(); kn.position.y = -P.thigh; th.add(kn);
      const L = P.thigh + P.shin;
      const kT = P.thigh / L;
      if (kid) {
        const t0 = 0.058, t1 = 0.038, s1 = 0.026;
        limb(pelvis, th, kn, P.thigh, 0.03, -L + 0.01, capped(t => { const a = t < kT ? lerp(t0, t1, smooth(0, kT, t)) : lerp(t1, s1, smooth(kT, 1, t)) + Math.exp(-Math.pow((t - kT - 0.15) / 0.1, 2)) * 0.004; return [a, a]; }, 0.08, 0.03), this.mats.legs, { fold: fold(0.025, 3) });
        // wide overall trouser legs, cuffed above the shoe
        const ov = limb(pelvis, th, kn, P.thigh, 0.05, -L + 0.045, t => { const a = t < kT ? lerp(t0 * 1.38, t1 * 1.6, smooth(0, kT, t)) : lerp(t1 * 1.6, t1 * 1.4, smooth(kT, 1, t)); return [a, a * 0.96]; }, new THREE.MeshPhysicalMaterial().copy(this.mats.over), { fold: fold(0.07, 3), radial: 22, blend: 0.06 });
        ov.material.side = THREE.DoubleSide; this.overParts.push(ov);
      } else {
        // painter's trousers: straight, roomy legs
        const ov = limb(pelvis, th, kn, P.thigh, 0.06, -L + 0.07, t => { const a = t < kT ? lerp(0.098, 0.074, smooth(0, kT, t)) : lerp(0.074, 0.068, smooth(kT, 1, t)); return [a, a * 0.95]; }, this.mats.over, { fold: fold(0.06, 3), radial: 22, blend: 0.07 });
        ov.material.side = THREE.DoubleSide;
      }
      const an = new THREE.Group(); an.position.y = -P.shin; kn.add(an);
      if (!kid) { const ank = new THREE.Mesh(sweep(vpath(0.1, -0.02, 6), () => [0.04, 0.04], { radial: 12 }), this.mats.shirt); ank.material = new THREE.MeshStandardMaterial({ color: 0x3a3a3c, roughness: 0.9 }); an.add(ank); }
      const fl = kid ? 0.165 : 0.28, fw = kid ? 0.034 : 0.05, fh = kid ? 0.03 : 0.045;
      const shoe = sweep(curve([[0, -0.015 * (kid ? 1 : 1.6), -fl * 0.22], [0, -0.022 * (kid ? 1 : 1.6), fl * 0.3], [0, -0.03 * (kid ? 1 : 1.6), fl * 0.75]], 16),
        capped(keys([[0, fw * 0.8, fh], [0.25, fw, fh * 1.05], [0.6, fw * 1.05, fh * 0.75], [1, fw * 0.85, fh * 0.5]]), 0.25, 0.3), { radial: 18, up: V3(1, 0, 0) });
      mesh(shoe, this.mats.shoe, an);
      const sole = new THREE.Mesh(new THREE.BoxGeometry(fw * 2.05, 0.012 * (kid ? 1 : 1.5), fl * 0.98), this.mats.sole);
      sole.position.set(0, -0.045 * (kid ? 1 : 1.6) + 0.006, fl * 0.25); sole.castShadow = true; an.add(sole);
      this.legs.push({ th, kn, an, sx });
    }
    // bind all skinned limbs in the rest pose
    this.root.updateMatrixWorld(true);
    for (const { m, bones } of this.skinned) m.bind(new THREE.Skeleton(bones), m.matrixWorld);
    
    this.setOveralls(!kid);
  }

  splatterMap(base, n) {
    const c = canvas(512, 512), g = c.getContext('2d');
    const img = tex('canvas_detail.jpg', { srgb: true });
    this._splat = { c, g, n, done: false };
    const draw = () => {
      g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 512);
      if (img.image && img.image.width > 4) g.drawImage(img.image, 0, 0, 512, 512);
      const cols = ['#5d86a8', '#a7c08a', '#e3c25a', '#b5563f', '#7aa3c4'];
      for (let i = 0; i < n; i++) {
        g.fillStyle = cols[i % cols.length]; g.globalAlpha = 0.85;
        const x = rand(0, 512), y = rand(0, 512), r = rand(1.5, 5);
        g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
        for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x + rand(-12, 12), y + rand(-12, 12), r * rand(0.2, 0.5), 0, TAU); g.fill(); }
      }
      g.globalAlpha = 1;
      t.needsUpdate = true;
    };
    const t = canvasTex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3);
    draw();
    (this._splats = this._splats || []).push(draw);
    return t;
  }

  buildHair(kid) {
    const H = this.hair, mat = this.mats.hair, D = this.deform;
    const P = this.P;
    // scalp cap: follows the sculpt, hairline lower at sides/back
    const NU = 64, NV = 22, pos = [], uv = [], idx = [];
    const tmax = (lon) => {
      const c = Math.cos(lon);
      return kid ? Math.PI / 2 - (0.42 * Math.max(c, 0) - 0.45 * Math.max(-c, 0) - 0.05 * (1 - Math.abs(c)))
        : Math.PI / 2 - (0.62 * Math.max(c, 0) - 0.2 * Math.max(-c, 0) + 0.08 * (1 - Math.abs(c)));
    };
    for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) {
      const lon = -Math.PI + i / NU * TAU, th = j / NV * tmax(lon);
      const d = V3(Math.sin(lon) * Math.sin(th), Math.cos(th), Math.cos(lon) * Math.sin(th));
      const p = D(d).multiplyScalar(kid ? 1.045 : 1.03);
      pos.push(p.x, p.y, p.z); uv.push(i / NU * 6, j / NV);
    }
    for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) { const a = j * (NU + 1) + i, b = a + NU + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); cg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); cg.setIndex(idx); cg.computeVertexNormals();
    const cap = new THREE.Mesh(cg, mat); cap.castShadow = true; H.add(cap);
    // clumps
    const clump = (lon0, th0, lon1, th1, len, w, lift, flare = 0) => {
      const pts = [];
      for (let i = 0; i < 9; i++) {
        const t = i / 8;
        const lon = lerp(lon0, lon1, t), th = lerp(th0, th1, Math.pow(t, 0.9));
        const d = V3(Math.sin(lon) * Math.sin(th), Math.cos(th), Math.cos(lon) * Math.sin(th));
        const p = D(d).multiplyScalar(lift + t * flare);
        pts.push(p);
      }
      const g = sweep(curve(pts, 16), capped(t => [w * (1 - 0.75 * Math.pow(t, 1.5)), w * 0.28 * (1 - 0.6 * t)], 0.05, 0.25), { radial: 8, vScale: 1, uScale: 1 });
      const m = new THREE.Mesh(g, mat); m.castShadow = true; H.add(m);
    };
    if (kid) {
      // bangs
      for (let i = 0; i < 13; i++) {
        const l = -0.75 + i / 12 * 1.5 + rand(-0.03, 0.03);
        clump(l * 0.4, 0.3, l, Math.PI / 2 - 0.46 + Math.abs(l) * 0.25 + rand(-0.03, 0.03), 1, rand(0.13, 0.17), 1.06, 0.03);
      }
      // bob, sides and back
      for (let i = 0; i < 30; i++) {
        const l = 0.75 + i / 29 * (TAU - 1.5) + rand(-0.04, 0.04);
        const back = Math.max(0, -Math.cos(l));
        clump(l * 0.95, 0.32, l + rand(-0.05, 0.05), Math.PI / 2 + 0.55 + back * 0.15 + rand(-0.05, 0.05), 1, rand(0.17, 0.22), 1.06, 0.06 + back * 0.02);
      }
      // two small pigtails
      for (const sx of [-1, 1]) {
        const base = D(dirOf(sx * 2.25, -0.25)).multiplyScalar(1.08);
        const pts = [base, base.clone().add(V3(sx * 0.18, -0.25, -0.1)), base.clone().add(V3(sx * 0.3, -0.6, -0.05)), base.clone().add(V3(sx * 0.32, -0.95, 0.05))];
        for (let k = 0; k < 5; k++) {
          const o = V3(rand(-0.05, 0.05), 0, rand(-0.05, 0.05));
          const g = sweep(curve(pts.map((p, i) => p.clone().addScaledVector(o, i)), 14), capped(t => [0.11 * (1 - 0.8 * t), 0.07 * (1 - 0.7 * t)], 0.1, 0.3), { radial: 8 });
          const m = new THREE.Mesh(g, mat); m.castShadow = true; H.add(m);
        }
        const tie = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.035, 8, 16), new THREE.MeshPhysicalMaterial({ color: 0x3f7f86, roughness: 0.5, sheen: 0.5 }));
        tie.position.copy(base).add(V3(sx * 0.07, -0.1, -0.04)); tie.rotation.set(0.9, sx * 0.6, 0); H.add(tie);
      }
    } else {
      for (let i = 0; i < 42; i++) {
        const l = -Math.PI + i / 41 * TAU + rand(-0.03, 0.03);
        const c = Math.cos(l);
        clump(l * 0.9, 0.35, l, tmax(l) - 0.02, 1, rand(0.16, 0.2), 1.035, 0.0);
      }
    }
    // painter cap (hidden for girl until dressed)
    const capMat = this.mats.capMat = clothMat('canvas', 0xf0ebe0, { repeat: 4, map: this.splatterMap(0xf0ebe0, kid ? 2 : 10) });
    const capG = this.capG = new THREE.Group(); H.add(capG);
    const cnt = [];
    const NU2 = 48, NV2 = 12, pos2 = [], uv2 = [], idx2 = [];
    const capEdge = (lon) => Math.PI / 2 - 0.42 + 0.3 * (1 - Math.cos(lon)) * 0.5;
    for (let j = 0; j <= NV2; j++) for (let i = 0; i <= NU2; i++) {
      const lon = -Math.PI + i / NU2 * TAU, th = j / NV2 * capEdge(lon);
      const d = V3(Math.sin(lon) * Math.sin(th), Math.cos(th), Math.cos(lon) * Math.sin(th));
      const p = D(d).multiplyScalar((kid ? 1.17 : 1.1) + 0.025 * Math.sin(Math.min(1, j / NV2 * 1.3) * Math.PI));
      p.addScaledVector(d, 0.02 * noise2(lon * 3, th * 4));
      pos2.push(p.x, p.y, p.z); uv2.push(p.x * 1.5 + 0.5, p.z * 1.5 + p.y * 0.5);
    }
    for (let j = 0; j < NV2; j++) for (let i = 0; i < NU2; i++) { const a = j * (NU2 + 1) + i, b = a + NU2 + 1; idx2.push(a, b, a + 1, a + 1, b, b + 1); }
    const g2 = new THREE.BufferGeometry(); g2.setAttribute('position', new THREE.Float32BufferAttribute(pos2, 3)); g2.setAttribute('uv', new THREE.Float32BufferAttribute(uv2, 2)); g2.setIndex(idx2); g2.computeVertexNormals();
    const dome = new THREE.Mesh(g2, capMat); dome.castShadow = true; capG.add(dome);
    // brim: curved plate
    const brim = new THREE.Shape(); brim.absellipse(0, 0, 0.66, 0.5, 0, Math.PI, false);
    const bgeo = new THREE.ExtrudeGeometry(brim, { depth: 0.03, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.012, bevelSegments: 2, curveSegments: 24 });
    bgeo.rotateX(Math.PI / 2);
    const pa = bgeo.attributes.position;
    for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), z = pa.getZ(i); pa.setY(i, pa.getY(i) - x * x * 0.55 - z * 0.06); }
    bgeo.computeVertexNormals();
    const bm = new THREE.Mesh(bgeo, capMat); bm.castShadow = true;
    const fr = D(dirOf(0, Math.PI / 2 - (Math.PI / 2 - 0.42))).multiplyScalar(kid ? 1.17 : 1.1);
    bm.position.set(0, fr.y - 0.03, fr.z - 0.12); bm.rotation.x = 0.28; bm.scale.set(kid ? 0.95 : 0.9, 1, kid ? 0.85 : 0.9); capG.add(bm);
        capG.visible = !kid;
  }

  setOveralls(on) { for (const m of this.overParts) m.visible = on; }
  setCap(on) { this.capG.visible = on; }

  express(name, hold = 0) { this.expr = name; this.Et = { ...PRESET[name] }; this.exprT = hold; }

  // ---------------- face rendering (only when changed)
  drawFace() {
    const g = this.faceG;
    g.drawImage(this.faceBase, 0, 0);
    drawMouth(g, this.E, this.P);
    if (this.paintC) g.drawImage(this.paintC, 0, 0);
    this.faceTex.needsUpdate = true;
  }

  // ---------------- papa's paint layer (also drives hair/cap tint)
  initPaintLayer(color) {
    this.paintC = canvas(FW, FH); this.paintG = this.paintC.getContext('2d');
    this.paintCol = color;
    this.wipeTotal = 0;
  }
  pourPaint(t) { // 0..1 progressive coverage from the crown downward with drips
    const g = this.paintG; g.fillStyle = this.paintCol;
    const lat = lerp(1.4, -1.05, t);
    for (let i = 0; i < 40; i++) {
      const lon = rand(-1.6, 1.6), la = lat + rand(-0.1, 0.35);
      g.globalAlpha = 0.9; g.beginPath(); g.ellipse(fx(lon), fy(la), rand(10, 30), rand(8, 22), 0, 0, TAU); g.fill();
    }
    if (t > 0.3) for (let i = 0; i < 6; i++) { // drips
      const lon = rand(-1.3, 1.3), y0 = fy(lat + 0.3), len = rand(20, 70);
      g.fillRect(fx(lon) - 3, y0, 6, len); g.beginPath(); g.arc(fx(lon), y0 + len, 5, 0, TAU); g.fill();
    }
    g.globalAlpha = 1;
    this.faceDirty = true;
  }
  wipeAt(uv, r = 36) {
    const g = this.paintG; g.save(); g.globalCompositeOperation = 'destination-out';
    const x = uv.x * FW, y = (1 - uv.y) * FH;
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(0,0,0,0.9)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.restore();
    this.faceDirty = true;
  }
  paintLeft() { // fraction of the visible face still painted
    const d = this.paintG.getImageData(fx(-1.1), fy(0.9), fx(1.1) - fx(-1.1), fy(-0.95) - fy(0.9)).data;
    let a = 0, n = 0; for (let i = 3; i < d.length; i += 32) { a += d[i]; n++; }
    return a / (n * 255);
  }

  // ---------------- 2-bone IK for an arm
  aim(arm, target, pole) {
    const par = arm.sh.parent; par.updateWorldMatrix(true, false);
    const inv = par.matrixWorld.clone().invert();
    const D = target.clone().applyMatrix4(inv).sub(arm.sh.position);
    const L1 = arm.L1, L2 = arm.L2;
    const d = clamp(D.length(), Math.abs(L1 - L2) + 0.01, (L1 + L2) * 0.995);
    const dir = D.normalize();
    const a1 = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const a2 = Math.acos(clamp((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), -1, 1));
    const pp = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
    const up = dir.clone().multiplyScalar(Math.cos(a1)).addScaledVector(pp, Math.sin(a1)).normalize();
    const Y = up.clone().negate();
    const Z = dir.clone().sub(up.clone().multiplyScalar(dir.dot(up))).normalize();
    const X = Y.clone().cross(Z).normalize();
    const m = new THREE.Matrix4().makeBasis(X, Y, Z);
    return { q: new THREE.Quaternion().setFromRotationMatrix(m), e: -(Math.PI - a2) };
  }

  update(dt, cam) {
    this.time += dt;
    const t = this.time, P = this.P, po = this.pose, kid = this.kind === 'girl';
    // expression blending
    if (this.exprT > 0) { this.exprT -= dt; if (this.exprT <= 0) this.express(this.base || 'neutral'); }
    let changed = this.faceDirty; this.faceDirty = false;
    for (const k in this.Et) { const nv = damp(this.E[k], this.Et[k], 10, dt); if (Math.abs(nv - this.E[k]) > 0.004) changed = true; this.E[k] = nv; }
    // talking wobble
    if (this.talk > 0) { this.talk -= dt; this.E.open = 0.25 + 0.35 * Math.abs(Math.sin(t * 16)); changed = true; }
    if (changed) this.drawFace();
    // blink
    this.blinkT -= dt;
    if (this.blinkT < 0) { this.blink = 1; this.blinkT = rand(2, 5); }
    this.blink = Math.max(0, this.blink - dt * 7);
    const bl = Math.sin(this.blink * Math.PI);
    const E = this.E;
    for (const e of this.eyes) {
      const close = clamp(Math.max(bl, E.squint * 0.75), 0, 1);
      e.up.rotation.x = lerp(-0.95 - E.lidUp * 0.35, 1.5, close);
      e.lo.rotation.x = lerp(0.95, 0.25, Math.max(E.squint * 0.9, bl * 0.4));
      // gaze
      if (this.look) {
        const w = this.look.clone(); e.g.updateWorldMatrix(true, false);
        const l = w.applyMatrix4(e.g.matrixWorld.clone().invert()).normalize();
        e.ball.rotation.set(clamp(-Math.asin(l.y), -0.45, 0.45), clamp(Math.atan2(l.x, l.z), -0.6, 0.6), 0);
      }
    }
    for (const b of this.brows) {
      const lift = E.brow * 0.06 + (b.sx > 0 ? E.browIn * 0.035 * (E.skew > 0.3 ? 1 : 0.2) : 0);
      b.g.position.y = lift; b.g.rotation.z = -b.sx * E.browIn * 0.12 + b.sx * E.brow * 0.05;
    }
    // ----- body
    const breath = Math.sin(t * 2.2) * 0.006;
    const jump = Math.max(0, Math.sin(po.jump * Math.PI)) * (kid ? 0.12 : 0.05);
    this.pelvis.position.y = P.hipY - po.crouch * P.hipY * 0.45 - (po.sit || 0) * (P.hipY - P.H * 0.12) + jump + po.bob * Math.sin(t * 9) * 0.01 + Math.abs(Math.cos(po.walkPh || 0)) * 0.012 * (po.walk || 0);
    this.torsoJ.rotation.x = po.lean + breath * 2;
    this.torsoJ.rotation.y = damp(this.torsoJ.rotation.y, po.turn || 0, 4, dt);
    this.torsoJ.scale.set(1 + breath, 1, 1 + breath);
    for (const L of this.legs) {
      const c = po.crouch;
      const wk = po.walk || 0, ph = (po.walkPh || 0) + (L.sx > 0 ? Math.PI : 0);
      L.th.rotation.x = -c * 1.3 - po.sit * 1.5 + Math.sin(ph) * 0.45 * wk - (po.climb || 0) * (L.sx > 0 ? 0.9 : 0.1);
      L.kn.rotation.x = c * 2.0 + po.sit * 1.5 + Math.max(0, -Math.cos(ph)) * 0.7 * wk + (po.climb || 0) * (L.sx > 0 ? 1.2 : 0.15);
      L.an.rotation.x = -c * 0.7;
      L.th.rotation.z = L.sx * 0.03; L.an.rotation.y = L.sx * 0.15;
    }
    // head look (neck + head share)
    if (this.look) {
      this.headJ.parent.updateWorldMatrix(true, false);
      const l = this.look.clone().applyMatrix4(this.neckJ.matrixWorld.clone().invert());
      const yaw = clamp(Math.atan2(l.x, l.z), -1.0, 1.0), pitch = clamp(-Math.atan2(l.y - 0.1, Math.hypot(l.x, l.z)), -0.5, 0.5);
      this.neckJ.rotation.y = damp(this.neckJ.rotation.y, yaw * 0.4, 6, dt);
      this.headJ.rotation.y = damp(this.headJ.rotation.y, yaw * 0.6, 6, dt);
      this.headJ.rotation.x = damp(this.headJ.rotation.x, pitch, 6, dt);
    }
    this.headJ.rotation.z = damp(this.headJ.rotation.z, E.tilt, 6, dt);
    // arms
    for (const a of this.arms) {
      const mode = a.sx < 0 ? po.armR : po.armL;   // sx<0 = character's right
      const tgt = a.sx < 0 ? po.tR : po.tL;
      let q = new THREE.Quaternion(), e = -0.25, wr = 0;
      const sw = Math.sin(t * 1.3 + a.sx) * 0.03;
      if (mode === 'ik' && tgt) {
        const r = this.aim(a, tgt, V3(a.sx * 0.4, -0.6, -0.6)); q = r.q; e = r.e; wr = -0.2;
      } else if (mode === 'cheer') {
        q.setFromEuler(new THREE.Euler(-0.3 + Math.sin(t * 10) * 0.1, 0, a.sx * 2.6)); e = -0.35;
      } else if (mode === 'cheek') {
        const r = this.aim(a, this.headMesh.localToWorld(V3(a.sx * 0.75, -0.45, 0.65)), V3(a.sx * 0.6, -1, 0)); q = r.q; e = r.e; wr = 0.3;
      } else if (mode === 'clap') {
        const k = Math.abs(Math.sin(t * 9));
        const r = this.aim(a, this.torsoJ.localToWorld(V3(a.sx * (0.02 + k * 0.08) * (kid ? 1 : 1.6), P.shoulderY * 0.75, (kid ? 0.2 : 0.35))), V3(a.sx, -1, 0)); q = r.q; e = r.e; wr = 0.5;
      } else if (mode === 'hold') {
        const r = this.aim(a, this.torsoJ.localToWorld(V3(a.sx * 0.06 * (kid ? 1 : 1.6), P.shoulderY * 0.45, kid ? 0.2 : 0.32)), V3(a.sx, -1, -0.3)); q = r.q; e = r.e;
      } else if (mode === 'wave') {
        q.setFromEuler(new THREE.Euler(-0.2, 0, a.sx * (2.2 + Math.sin(t * 8) * 0.25))); e = -0.6;
      } else if (mode === 'head') { // hand on head (papa: oops)
        const r = this.aim(a, this.headMesh.localToWorld(V3(a.sx * 0.5, 0.9, 0.1)), V3(a.sx, 0.2, -1)); q = r.q; e = r.e;
      } else {
        q.setFromEuler(new THREE.Euler(sw + 0.05, 0, a.sx * 0.1)); e = -0.18;
      }
      a.sh.quaternion.slerp(q, 1 - Math.exp(-12 * dt));
      a.el.rotation.x = damp(a.el.rotation.x, e, 12, dt);
      a.wr.rotation.x = damp(a.wr.rotation.x, wr, 8, dt);
    }
  }

  handWorld(right = true) { const a = this.arms[right ? 0 : 1]; return a.wr.localToWorld(V3(0, -this.P.palm * 0.6, 0.01)); }
}
