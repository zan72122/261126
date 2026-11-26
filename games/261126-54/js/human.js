// Realistic-proportion humans sculpted from signed distance fields.
// Each body part is one smooth surface (smooth unions), shaded with PBR skin/cloth/hair.
import * as THREE from 'three';
import { smin, smax, sdSphere, sdEll, sdRC, sdRBox, meshSDF } from './sdf.js';
import { pbr, tex, clamp, lerp, damp, rnd, sstep } from './util.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const nextFrame = () => new Promise(r => setTimeout(r, 0));

// ------------------------------------------------------------------ shared materials
const matCache = {};
function clothMat(key, color, texName, rep, opts = {}) {
  const k = key + color + texName;
  if (matCache[k]) return matCache[k];
  const m = pbr(texName, { color, repeat: [rep, rep], roughness: 0.9, sheen: opts.sheen ?? 0.6, sheenRoughness: 0.6, sheenColor: new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.4), physical: true, normalScale: opts.ns ?? 1.0 });
  m.userData.cloth = true;
  matCache[k] = m;
  return m;
}
function skinMat(color, map) {
  const m = new THREE.MeshPhysicalMaterial({ color: map ? 0xffffff : color, map: map || null, roughness: 0.52, sheen: 0.35, sheenRoughness: 0.5, sheenColor: new THREE.Color(0xffb6a0), specularIntensity: 0.55 });
  tex('skin_n.jpg', { repeat: [14, 14], onload: (t) => { m.normalMap = t; m.normalScale.set(0.25, 0.25); m.needsUpdate = true; } });
  // cheap subsurface: warm wrap light so shadows on skin stay soft and reddish instead of grey
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
      { vec3 sss = diffuseColor.rgb * vec3(1.0,0.45,0.3) * 0.16; reflectedLight.indirectDiffuse += sss * (0.6 + 0.4*dot(normal, vec3(0.,0.,1.)));} `);
  };
  return m;
}
function hairMat(color) {
  const m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, sheen: 1.0, sheenRoughness: 0.35, sheenColor: new THREE.Color(color).multiplyScalar(2.2), specularIntensity: 0.7 });
  tex('hair_n.jpg', { repeat: [3, 3], onload: (t) => { m.normalMap = t; m.normalScale.set(0.9, 0.9); m.needsUpdate = true; } });
  tex('hair_c.jpg', { srgb: true, repeat: [3, 3], onload: (t) => { m.map = t; m.needsUpdate = true; } });
  return m;
}

// ------------------------------------------------------------------ eye textures
function eyeTexture(irisCol) {
  const W = 256, H = 128;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  // rows = polar angle from the front pole (0 at top). Iris occupies ~0.40 rad
  const sc = g.createLinearGradient(0, 0, 0, H);
  sc.addColorStop(0, '#f6f1ea'); sc.addColorStop(0.6, '#efe6dc'); sc.addColorStop(1, '#d8b8b0');
  g.fillStyle = sc; g.fillRect(0, 0, W, H);
  const pupil = 0.13, iris = 0.30, lim = 0.34; // fraction of H (H spans pi)
  const ir = new THREE.Color(irisCol);
  const grd = g.createLinearGradient(0, 0, 0, H * lim);
  grd.addColorStop(0, '#000');
  grd.addColorStop(pupil / lim * 0.98, '#050302');
  grd.addColorStop(pupil / lim * 1.02, '#' + ir.clone().multiplyScalar(0.55).getHexString());
  grd.addColorStop(0.62, '#' + ir.getHexString());
  grd.addColorStop(iris / lim, '#' + ir.clone().multiplyScalar(0.7).getHexString());
  grd.addColorStop(1, '#1a0f08');
  g.fillStyle = grd; g.fillRect(0, 0, W, H * lim);
  // iris fibres
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * W;
    g.strokeStyle = `rgba(${Math.random() < .5 ? '255,220,170' : '30,15,5'},${0.08 + Math.random() * 0.12})`;
    g.lineWidth = 1 + Math.random();
    g.beginPath(); g.moveTo(x, H * pupil * 1.05); g.lineTo(x + (Math.random() - .5) * 4, H * iris * (0.85 + Math.random() * 0.15)); g.stroke();
  }
  // soft limbal blend into sclera
  const lb = g.createLinearGradient(0, H * iris, 0, H * (lim + 0.05));
  lb.addColorStop(0, 'rgba(20,12,6,0.9)'); lb.addColorStop(1, 'rgba(20,12,6,0)');
  g.fillStyle = lb; g.fillRect(0, H * iris, W, H * (lim + 0.05 - iris));
  // a few vessels near the edges
  g.strokeStyle = 'rgba(190,80,80,0.25)'; g.lineWidth = 0.8;
  for (let i = 0; i < 14; i++) { const x = Math.random() * W; g.beginPath(); g.moveTo(x, H); g.quadraticCurveTo(x + 10, H * 0.75, x + (Math.random() - .5) * 20, H * 0.55); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ------------------------------------------------------------------ body templates (meters)
const KID = {
  H: 1.10, headH: 0.205, headC: 0.995, neckB: 0.855, shY: 0.83, shX: 0.108,
  chest: [0.76, 0.098, 0.085, 0.072], belly: [0.645, 0.096, 0.085, 0.078], pelvis: [0.545, 0.098, 0.07, 0.074],
  hipX: 0.056, hipY: 0.515, knee: 0.29, ankle: 0.055, foot: 0.165,
  ua: 0.165, fa: 0.135, hand: 0.105, uaR: [0.031, 0.025], faR: [0.024, 0.019], thR: [0.052, 0.036], caR: [0.034, 0.024],
  kid: true,
};
const ADULT = {
  H: 1.75, headH: 0.235, headC: 1.632, neckB: 1.46, shY: 1.435, shX: 0.19,
  chest: [1.30, 0.158, 0.135, 0.105], belly: [1.13, 0.142, 0.12, 0.1], pelvis: [0.985, 0.155, 0.1, 0.105],
  hipX: 0.092, hipY: 0.94, knee: 0.505, ankle: 0.08, foot: 0.26,
  ua: 0.295, fa: 0.255, hand: 0.185, uaR: [0.047, 0.037], faR: [0.038, 0.027], thR: [0.085, 0.056], caR: [0.056, 0.034],
};

function scaleT(T, s, w = 1) {
  const o = {};
  for (const k in T) {
    const v = T[k];
    if (typeof v === 'number') o[k] = (k === 'shX' || k === 'hipX') ? v * s * w : v * s;
    else if (Array.isArray(v)) o[k] = v.map((x, i) => (k === 'chest' || k === 'belly' || k === 'pelvis') && i > 0 ? x * s * (i === 1 ? w : 1) : x * s);
    else o[k] = v;
  }
  return o;
}

// ------------------------------------------------------------------ head SDF
function headPrims(kid, female, s, chubby = 0) {
  // in head-local meters, origin at head centre, +z forward. Values tuned for a 0.22 m head then scaled by s
  const L = [];
  const P = (arr) => L.push(arr.map((v, i) => i < 2 ? v : v * s));
  if (kid) {
    P([1, 0, 0, 0.012, -0.012, 0.079, 0.088, 0.09]);               // cranium (big, round)
    P([1, 0.05, 0, -0.035, 0.022, 0.058, 0.062, 0.066]);            // face mass
    P([0, 0.035, 0.036, -0.038, 0.043, 0.032 + chubby]);            // cheeks (chubby)
    P([0, 0.035, -0.036, -0.038, 0.043, 0.032 + chubby]);
    P([1, 0.03, 0, -0.072, 0.040, 0.025, 0.02, 0.024]);             // chin
    P([1, 0.02, 0, 0.018, 0.064, 0.05, 0.016, 0.018]);              // brow
    P([2, 0.008, 0, -0.008, 0.083, 0, -0.03, 0.09, 0.0055, 0.0085]); // nose bridge -> tip
    P([0, 0.006, 0.0085, -0.031, 0.083, 0.0065]);                   // nose wings
    P([0, 0.006, -0.0085, -0.031, 0.083, 0.0065]);
    P([1, 0.005, 0, -0.047, 0.077, 0.015, 0.0045, 0.0065]);          // upper lip
    P([1, 0.005, 0, -0.0555, 0.075, 0.013, 0.0055, 0.0065]);        // lower lip
    P([1, 0.012, 0.079, -0.01, -0.006, 0.011, 0.025, 0.018]);       // ears
    P([1, 0.012, -0.079, -0.01, -0.006, 0.011, 0.025, 0.018]);
    P([2, 0.04, 0, -0.05, -0.02, 0, -0.17, -0.028, 0.034, 0.04]);   // neck
  } else {
    const f = female ? 0.94 : 1;
    P([1, 0, 0, 0.02, -0.012, 0.074 * f, 0.084, 0.094]);
    P([1, 0.045, 0, -0.028, 0.02, 0.064 * f, 0.07, 0.07]);
    P([0, 0.035, 0.04 * f, -0.032, 0.044, 0.026 + chubby]);
    P([0, 0.035, -0.04 * f, -0.032, 0.044, 0.026 + chubby]);
    P([1, 0.035, 0, -0.085, 0.045, female ? 0.026 : 0.034, 0.024, 0.026]);  // jaw/chin
    P([1, 0.03, 0.045 * f, -0.06, 0.018, 0.018, 0.03, 0.03]);       // jaw corners
    P([1, 0.03, -0.045 * f, -0.06, 0.018, 0.018, 0.03, 0.03]);
    P([1, 0.02, 0, 0.022, 0.07, 0.056 * f, 0.016, 0.02]);           // brow
    P([2, 0.008, 0, 0.004, 0.084, 0, -0.033, 0.1, 0.007, 0.0105]);
    P([0, 0.007, 0.011, -0.035, 0.091, 0.008]);
    P([0, 0.007, -0.011, -0.035, 0.091, 0.008]);
    P([1, 0.005, 0, -0.054, 0.086, 0.019, 0.0048, 0.007]);
    P([1, 0.005, 0, -0.064, 0.084, 0.016, 0.0058, 0.007]);
    P([1, 0.012, 0.077 * f, -0.006, -0.008, 0.012, 0.03, 0.02]);
    P([1, 0.012, -0.077 * f, -0.006, -0.008, 0.012, 0.03, 0.02]);
    P([2, 0.04, 0, -0.06, -0.02, 0, -0.2, -0.03, female ? 0.042 : 0.05, female ? 0.048 : 0.058]);
  }
  return L;
}
function evalHead(L, x, y, z) {
  let d = 1e9;
  for (let i = 0; i < L.length; i++) {
    const p = L[i]; let e;
    switch (p[0]) {
      case 0: e = sdSphere(x, y, z, p[2], p[3], p[4], p[5]); break;
      case 1: e = sdEll(x, y, z, p[2], p[3], p[4], p[5], p[6], p[7]); break;
      case 2: e = sdRC(x, y, z, p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]); break;
    }
    d = i === 0 ? e : smin(d, e, p[1] * 1);
  }
  return d;
}
function surfZ(f, x, y, z0 = 0.2) { // march from front to find surface z
  let z = z0;
  for (let i = 0; i < 200; i++) { const d = f(x, y, z); if (d < 0.0004) break; z -= Math.max(d, 0.0005); }
  return z;
}

// ------------------------------------------------------------------ face painting
class FacePaint {
  constructor(o) {
    this.o = o; // { skin, lip, brow, s, eyeY, eyeX, mouthY, kid, stubble }
    this.size = 512;
    this.c = document.createElement('canvas'); this.c.width = this.c.height = this.size;
    this.g = this.c.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.c); this.tex.colorSpace = THREE.SRGBColorSpace;
    this.base = document.createElement('canvas'); this.base.width = this.base.height = this.size;
    this.paintBase();
    this.state = null;
  }
  // head-local meters -> canvas px (planar front projection)
  px(x) { return (0.5 + x / (0.24 * this.o.s)) * this.size; }
  py(y) { return (0.5 - y / (0.28 * this.o.s)) * this.size; }
  len(m) { return m / (0.24 * this.o.s) * this.size; }
  paintBase() {
    const g = this.base.getContext('2d'), S = this.size, o = this.o;
    const sk = new THREE.Color(o.skin);
    g.fillStyle = '#' + sk.getHexString(); g.fillRect(0, 0, S, S);
    // mottling
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * S, y = Math.random() * S, r = 2 + Math.random() * 10;
      g.fillStyle = Math.random() < .5 ? 'rgba(180,90,70,0.035)' : 'rgba(255,240,225,0.04)';
      g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
    // cheeks blush
    for (const sx of [-1, 1]) {
      const cx = this.px(sx * 0.037 * o.s), cy = this.py(o.mouthY + 0.018 * o.s);
      const r = this.len(0.03 * o.s);
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
      gr.addColorStop(0, `rgba(235,110,100,${o.kid ? 0.36 : 0.16})`); gr.addColorStop(1, 'rgba(235,110,100,0)');
      g.fillStyle = gr; g.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    // nose tip warmth
    { const cx = this.px(0), cy = this.py(o.mouthY + 0.022 * o.s), r = this.len(0.012 * o.s);
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r); gr.addColorStop(0, 'rgba(220,120,100,0.18)'); gr.addColorStop(1, 'rgba(220,120,100,0)');
      g.fillStyle = gr; g.fillRect(cx - r, cy - r, r * 2, r * 2); }
    // eye area slight shadow/darker
    for (const sx of [-1, 1]) {
      const cx = this.px(sx * o.eyeX), cy = this.py(o.eyeY), r = this.len(0.02 * o.s);
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
      gr.addColorStop(0.4, 'rgba(120,60,50,0.18)'); gr.addColorStop(1, 'rgba(120,60,50,0)');
      g.fillStyle = gr; g.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    if (o.stubble) {
      for (let i = 0; i < 2600; i++) {
        const a = Math.random() * Math.PI, rr = Math.random();
        const x = Math.cos(a) * 0.05 * o.s * (0.6 + rr * 0.5), y = o.mouthY - Math.sin(a) * 0.035 * o.s * (0.4 + rr) + 0.004 * o.s;
        g.fillStyle = 'rgba(40,30,25,0.10)'; g.fillRect(this.px(x), this.py(y), 1.3, 1.3);
      }
    }
  }
  draw(st) {
    const g = this.g, o = this.o, s = o.s;
    g.drawImage(this.base, 0, 0);
    // eyebrows
    const browC = o.brow;
    for (const sx of [-1, 1]) {
      const up = (sx < 0 ? st.browL : st.browR) * 0.006 * s;
      const ang = st.browTilt * sx; // + = inner raised (worried/surprised), - = angry
      const bx = sx * o.eyeX, by = o.eyeY + 0.021 * s + up;
      const w = 0.017 * s;
      g.strokeStyle = browC; g.lineCap = 'round';
      for (let k = 0; k < 3; k++) {
        g.globalAlpha = 0.35 + k * 0.2;
        g.lineWidth = this.len((o.kid ? 0.0042 : 0.005) * s) * (1 - k * 0.25);
        g.beginPath();
        const x0 = bx - sx * w, x1 = bx + sx * w;
        const yIn = by + ang * 0.004 * s, yOut = by - ang * 0.002 * s - 0.001 * s;
        g.moveTo(this.px(x0), this.py(yIn));
        g.quadraticCurveTo(this.px(bx), this.py(by + 0.0035 * s), this.px(x1), this.py(yOut - 0.002 * s));
        g.stroke();
      }
      g.globalAlpha = 1;
    }
    // mouth
    const my = o.mouthY, mw = (o.kid ? 0.0155 : 0.019) * s * (1 + st.wide * 0.35);
    const sm = st.smile, op = st.open;
    const cxp = this.px(0), cyp = this.py(my);
    const W = this.len(mw), corner = -sm * this.len(0.006 * s);
    // lips colour (upper+lower)
    g.fillStyle = o.lip;
    g.globalAlpha = o.kid ? 0.42 : 0.38;
    g.beginPath();
    g.ellipse(cxp, cyp - this.len(0.0045 * s), W * 1.0, this.len(0.0045 * s), 0, 0, Math.PI * 2); g.fill();
    g.beginPath();
    g.ellipse(cxp, cyp + this.len(0.006 * s), W * 0.88, this.len(0.0058 * s) + op * this.len(0.004 * s), 0, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 1;
    if (op > 0.04) {
      const oh = this.len(0.022 * s) * op * (st.round ? 1.15 : 1);
      const ow = W * (st.round ? 0.6 : 1.05);
      g.save();
      g.beginPath();
      // upper edge follows smile curve, lower edge rounder
      g.moveTo(cxp - ow, cyp + corner * 0.5);
      g.quadraticCurveTo(cxp, cyp - oh * 0.35 - corner * 0.2, cxp + ow, cyp + corner * 0.5);
      g.quadraticCurveTo(cxp, cyp + oh * 1.25 + (sm > 0 ? oh * 0.3 : 0), cxp - ow, cyp + corner * 0.5);
      g.closePath();
      g.fillStyle = '#3b1414'; g.fill();
      g.clip();
      // teeth
      g.fillStyle = '#f3ece4';
      g.fillRect(cxp - ow, cyp - oh * 0.5, ow * 2, oh * 0.42);
      // tongue
      g.fillStyle = '#c45a5c';
      g.beginPath(); g.ellipse(cxp, cyp + oh * 1.0, ow * 0.6, oh * 0.45, 0, 0, Math.PI * 2); g.fill();
      g.restore();
      // lip edge
      g.strokeStyle = 'rgba(120,40,40,0.5)'; g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(cxp - ow, cyp + corner * 0.5);
      g.quadraticCurveTo(cxp, cyp - oh * 0.35 - corner * 0.2, cxp + ow, cyp + corner * 0.5);
      g.stroke();
    } else {
      // closed mouth line with smile curvature
      g.strokeStyle = 'rgba(90,30,30,0.85)'; g.lineWidth = this.len(0.0016 * s); g.lineCap = 'round';
      g.beginPath();
      g.moveTo(cxp - W * 0.95, cyp + corner);
      g.quadraticCurveTo(cxp, cyp - corner * 0.8 + (st.pout ? -2 : 0), cxp + W * 0.95, cyp + corner + st.skew * 6);
      g.stroke();
    }
    // smile dimples / cheek push
    if (sm > 0.3) {
      g.strokeStyle = `rgba(150,70,60,${0.2 * sm})`; g.lineWidth = 1.5;
      for (const sx of [-1, 1]) {
        g.beginPath(); g.arc(cxp + sx * (W * 1.15), cyp - W * 0.25, W * 0.35, sx > 0 ? -0.6 : Math.PI - 0.9, sx > 0 ? 0.9 : Math.PI + 0.6); g.stroke();
      }
    }
    // extra blush when excited
    if (st.blush > 0.01) {
      for (const sx of [-1, 1]) {
        const cx = this.px(sx * 0.036 * s), cy = this.py(o.mouthY + 0.02 * s), r = this.len(0.026 * s);
        const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
        gr.addColorStop(0, `rgba(240,100,100,${0.3 * st.blush})`); gr.addColorStop(1, 'rgba(240,100,100,0)');
        g.fillStyle = gr; g.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    }
    // whipped cream splats (papa's mishap) with soft shading so they read as 3D blobs
    if (this.cream && this.cream.length) {
      const bg = this.bump.getContext('2d');
      bg.fillStyle = '#000'; bg.fillRect(0, 0, this.size, this.size);
      for (const b of this.cream) {
        if (b.hp <= 0) continue;
        const cx = this.px(b.x), cy = this.py(b.y), r = this.len(b.r) * (0.6 + 0.4 * b.hp);
        g.globalAlpha = Math.min(1, b.hp * 1.5);
        const gr = g.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
        gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.7, '#f6f0e4'); gr.addColorStop(1, 'rgba(225,212,195,0.0)');
        g.fillStyle = gr; g.beginPath(); g.ellipse(cx, cy, r, r * b.sq, b.rot, 0, 7); g.fill();
        const bgr = bg.createRadialGradient(cx, cy, 0, cx, cy, r);
        bgr.addColorStop(0, `rgba(255,255,255,${b.hp})`); bgr.addColorStop(1, 'rgba(255,255,255,0)');
        bg.fillStyle = bgr; bg.beginPath(); bg.ellipse(cx, cy, r, r * b.sq, b.rot, 0, 7); bg.fill();
      }
      g.globalAlpha = 1;
      this.bumpTex.needsUpdate = true;
    }
    this.tex.needsUpdate = true;
  }
}

// expression presets
export const EXPR = {
  neutral: { smile: 0.15, open: 0, wide: 0, browL: 0, browR: 0, browTilt: 0, lid: 0, lower: 0, blush: 0, round: 0, skew: 0 },
  smile: { smile: 0.8, open: 0, wide: 0.15, browL: 0.3, browR: 0.3, browTilt: 0.1, lid: 0.0, lower: 0.18, blush: 0.2, round: 0, skew: 0 },
  happy: { smile: 1, open: 0.65, wide: 0.3, browL: 0.7, browR: 0.7, browTilt: 0.2, lid: 0, lower: 0.22, blush: 0.5, round: 0, skew: 0 },
  laugh: { smile: 1, open: 0.9, wide: 0.35, browL: 0.8, browR: 0.8, browTilt: 0.5, lid: 0.85, lower: 0.6, blush: 0.7, round: 0, skew: 0 },
  wow: { smile: 0.2, open: 0.8, wide: -0.2, browL: 1, browR: 1, browTilt: 0.4, lid: -0.15, lower: 0, blush: 0.3, round: 1, skew: 0 },
  focus: { smile: 0.1, open: 0, wide: -0.1, browL: -0.3, browR: -0.3, browTilt: -0.3, lid: 0.08, lower: 0.15, blush: 0, round: 0, skew: 0.4, pout: 1 },
  huh: { smile: -0.1, open: 0.15, wide: -0.2, browL: 1, browR: -0.4, browTilt: 0.3, lid: 0.05, lower: 0, blush: 0, round: 1, skew: 0.6 },
  oops: { smile: -0.3, open: 0.55, wide: 0.1, browL: 0.9, browR: 0.9, browTilt: 0.9, lid: -0.2, lower: 0, blush: 0.2, round: 1, skew: 0 },
  proud: { smile: 0.9, open: 0.25, wide: 0.25, browL: 0.4, browR: 0.4, browTilt: -0.1, lid: 0.12, lower: 0.3, blush: 0.4, round: 0, skew: 0 },
};

// ------------------------------------------------------------------ hand SDF (right hand, wrist at origin, fingers -Y, palm faces -X, thumb +Z)
function handSDF(s, curl) {
  const L = [];
  // palm
  L.push([1, 0, 0, -0.045 * s, 0, 0.016 * s, 0.045 * s, 0.043 * s]);
  L.push([2, 0.02 * s, 0, 0.005 * s, 0, 0, -0.03 * s, 0, 0.022 * s, 0.026 * s]); // wrist blend
  const fingers = [[0.027, 0.034], [0.009, 0.038], [-0.009, 0.036], [-0.026, 0.028]];
  for (let i = 0; i < 4; i++) {
    const [fz, len] = fingers[i];
    let px = 0, py = -0.085 * s + Math.abs(fz) * 0.15 * s, pz = fz * s;
    let ang = 0.15 + curl * 0.2;
    const r0 = (i === 3 ? 0.0075 : 0.0088) * s;
    for (let j = 0; j < 3; j++) {
      const seg = len * s * [0.48, 0.3, 0.24][j];
      ang += curl * (j === 0 ? 0.6 : 0.75);
      const nx = px - Math.sin(ang) * seg, ny = py - Math.cos(ang) * seg;
      L.push([2, 0.006 * s, px, py, pz, nx, ny, pz, r0 * (1 - j * 0.1), r0 * (0.9 - j * 0.1)]);
      px = nx; py = ny;
    }
  }
  // thumb
  {
    let a = [0.002 * s, -0.025 * s, 0.03 * s];
    const dirs = [[-0.4, -0.5, 0.55], [-0.6 - curl * 0.3, -0.6, 0.25], [-0.7 - curl * 0.4, -0.55, 0.0]];
    const lens = [0.03, 0.025, 0.022];
    for (let j = 0; j < 3; j++) {
      const d = dirs[j], l = Math.hypot(...d);
      const b = [a[0] + d[0] / l * lens[j] * s, a[1] + d[1] / l * lens[j] * s, a[2] + d[2] / l * lens[j] * s];
      L.push([2, 0.008 * s, a[0], a[1], a[2], b[0], b[1], b[2], (0.012 - j * 0.0015) * s, (0.0105 - j * 0.0015) * s]);
      a = b;
    }
  }
  return L;
}
function evalL(L, x, y, z) {
  let d = 1e9;
  for (let i = 0; i < L.length; i++) {
    const p = L[i]; let e;
    switch (p[0]) {
      case 0: e = sdSphere(x, y, z, p[2], p[3], p[4], p[5]); break;
      case 1: e = sdEll(x, y, z, p[2], p[3], p[4], p[5], p[6], p[7]); break;
      case 2: e = sdRC(x, y, z, p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]); break;
      case 3: e = sdRBox(x, y, z, p[2], p[3], p[4], p[5], p[6], p[7], p[8]); break;
    }
    d = i === 0 ? e : smin(d, e, p[1]);
  }
  return d;
}
function mirrorGeo(g) {
  const p = g.attributes.position, n = g.attributes.normal;
  for (let i = 0; i < p.count; i++) { p.setX(i, -p.getX(i)); n.setX(i, -n.getX(i)); }
  const ix = g.index.array;
  for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
  return g;
}

// fold displacement for cloth (soft wrinkles)
function folds(x, y, z, amp, fy = 60, fa = 9) {
  const a = Math.atan2(x, z);
  return amp * (Math.sin(a * fa + y * 17 + Math.sin(y * 31) * 1.5) * 0.6 + Math.sin(y * fy + a * 3) * 0.4);
}

// ------------------------------------------------------------------ Human
export class Human {
  constructor(opt) {
    this.opt = opt;
    this.group = new THREE.Group();
    this.expr = { ...EXPR.neutral };
    this.exprTarget = { ...EXPR.neutral };
    this.exprHold = 0;
    this.blinkT = 2 + rnd() * 3; this.blink = 0;
    this.lookTarget = null; this.look = new THREE.Vector3(0, 0, 1);
    this.t = rnd() * 10;
    this.reach = { L: null, R: null };
    this.reachW = { L: 0, R: 0 };
    this.handRot = { L: null, R: null };
    this.bob = 0;
    this.ready = false;
  }
  async build() {
    const o = this.opt;
    const T = o.kid ? scaleT(KID, o.H / KID.H, o.w || 1) : scaleT(ADULT, o.H / ADULT.H, o.w || 1);
    this.T = T;
    const s = T.headH / 0.22;
    this.s = s;
    const res = o.kid ? 0.0042 : 0.0055;
    const g = this.group;
    // hierarchy
    this.hips = new THREE.Group(); this.hips.position.y = T.hipY; g.add(this.hips);
    this.torso = new THREE.Group(); this.hips.add(this.torso);
    this.neck = new THREE.Group(); this.neck.position.set(0, T.neckB - T.hipY, 0); this.torso.add(this.neck);
    this.head = new THREE.Group(); this.head.position.set(0, T.headC - T.neckB, 0.0); this.neck.add(this.head);

    // ---------------- head
    const HL = headPrims(!!o.kid, !!o.female, s, o.chubby || 0);
    const fHead0 = (x, y, z) => evalHead(HL, x, y, z);
    const eyeY = (o.kid ? -0.006 : 0.004) * s, eyeX = (o.kid ? 0.0285 : 0.031) * s;
    const er = o.kid ? 0.0122 : 0.0112 * s;
    const ez = surfZ(fHead0, eyeX, eyeY + 0.004 * s) - er * 0.5;
    const mouthY = (o.kid ? -0.052 : -0.06) * s;
    const fHead = (x, y, z) => {
      let d = fHead0(x, y, z);
      const ax = Math.abs(x);
      // eye sockets
      const sock = sdEll(ax, y, z, eyeX, eyeY + 0.001, ez + er * 0.15, er * 1.25, er * 1.05, er * 1.0);
      d = smax(d, -sock, 0.006 * s);
      // nasolabial / under-eye softness
      return d;
    };
    const faceUV = (x, y) => [0.5 + x / (0.24 * s), 0.5 + y / (0.28 * s)];
    const face = new FacePaint({ skin: o.skin, lip: o.lip || '#c86a6a', brow: o.browCol || o.hair, s, eyeX, eyeY, mouthY, kid: !!o.kid, stubble: !!o.stubble });
    this.face = face;
    face.draw(this.expr);
    const hb = 0.13 * s;
    const headGeo = meshSDF(fHead, [-hb, -0.22 * s, -hb], [hb, hb, hb + 0.01], res * 0.8, { uv: (x, y) => faceUV(x, y) });
    this.skinMatFace = skinMat(o.skin, face.tex);
    this.skinMat = skinMat(o.skin);
    const headMesh = new THREE.Mesh(headGeo, this.skinMatFace);
    headMesh.castShadow = true; headMesh.receiveShadow = true;
    this.head.add(headMesh); this.headMesh = headMesh;
    await nextFrame();

    // ---------------- eyes + lids
    const eyeMat = new THREE.MeshPhysicalMaterial({ map: eyeTexture(o.iris || '#5a3a22'), roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1 });
    const eyeGeo = new THREE.SphereGeometry(er, 32, 20); eyeGeo.rotateX(Math.PI / 2);
    const lidMatT = this.lidMaterial(o.skin, o.lash || '#1b120c');
    this.eyes = []; this.lids = [];
    for (const sx of [-1, 1]) {
      const e = new THREE.Mesh(eyeGeo, eyeMat);
      e.position.set(sx * eyeX, eyeY, ez);
      this.head.add(e); this.eyes.push(e);
      // upper lid: spherical cap pivoting around eye centre
      const lidG = new THREE.SphereGeometry(er * 1.12, 28, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const up = new THREE.Mesh(lidG, lidMatT);
      const piv = new THREE.Group(); piv.position.copy(e.position); piv.add(up);
      up.rotation.x = 0; // cap opens toward +y; rotate pivot to close
      const low = new THREE.Mesh(new THREE.SphereGeometry(er * 1.1, 28, 10, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5), this.skinMat);
      const pivL = new THREE.Group(); pivL.position.copy(e.position); pivL.add(low);
      this.head.add(piv); this.head.add(pivL);
      this.lids.push({ up: piv, low: pivL });
    }
    this.eyeR = er; this.eyeZ = ez;

    // ---------------- hair (+ hat later)
    await this.buildHair(fHead0, s, res);
    await nextFrame();

    // ---------------- torso / clothes
    const ch = T.chest, be = T.belly, pe = T.pelvis;
    const hy = T.hipY;
    const top = o.top;
    const ffTorso = (x, y, z) => {
      // in hips-local (y relative to hipY)
      const Y = y + hy;
      let d = sdEll(x, Y, z, 0, ch[0], 0.004, ch[1], ch[2], ch[3]);
      d = smin(d, sdEll(x, Y, z, 0, be[0], 0.006, be[1], be[2], be[3]), 0.06 * s);
      d = smin(d, sdRC(x, Y, z, -T.shX, T.shY - 0.012 * s, -0.005, T.shX, T.shY - 0.012 * s, -0.005, T.uaR[0] * 1.05, T.uaR[0] * 1.05), 0.07 * s);
      d = smin(d, sdRC(x, Y, z, 0, T.neckB - 0.03 * s, -0.01, 0, T.neckB + 0.012 * s, -0.012, (o.kid ? 0.036 : 0.06) * s, (o.kid ? 0.03 : 0.05) * s), 0.04 * s);
      if (o.female && !o.kid) {
        d = smin(d, sdSphere(Math.abs(x), Y, z, 0.05 * s, ch[0] - 0.03 * s, ch[3] * 0.55, 0.05 * s), 0.05 * s);
      }
      // hem
      const hem = (top.long ? pe[0] - 0.02 * s : be[0] - be[2] * 0.85);
      d = smax(d, hem - Y, 0.01 * s);
      d += folds(x, Y, z, 0.0018 * s, 40, 7);
      return d;
    };
    const torsoGeo = meshSDF(ffTorso, [-T.shX - 0.07 * s, (o.top.long ? pe[0] - 0.05 * s : be[0] - 0.12 * s) - hy, -0.16 * s], [T.shX + 0.07 * s, T.neckB + 0.03 * s - hy, 0.16 * s], res, {
      uv: (x, y, z) => [(Math.atan2(x, z) / (Math.PI * 2) + 0.5) * 0.8 * s, y],
    });
    const topMat = clothMat('top', top.color, top.tex || 'knit', top.rep || 9);
    const torsoMesh = new THREE.Mesh(torsoGeo, topMat);
    torsoMesh.castShadow = torsoMesh.receiveShadow = true;
    this.torso.add(torsoMesh);
    this.ffTorso = ffTorso;
    await nextFrame();

    // ---------------- lower body (pants / skirt) + legs + shoes
    const bot = o.bottom;
    const lx = T.hipX;
    const legPts = (sx) => ({ hip: [sx * lx, T.hipY, 0], knee: [sx * lx * 0.95, T.knee, 0.008], ank: [sx * lx * 0.9, T.ankle, -0.005] });
    const ffLegs = (x, y, z, sk) => {
      let d = 1e9;
      for (const sx of [-1, 1]) {
        const P = legPts(sx);
        d = Math.min(d, smin(sdRC(x, y, z, ...P.hip, ...P.knee, T.thR[0], T.thR[1] * 1.02), sdRC(x, y, z, ...P.knee, ...P.ank, T.caR[0], T.caR[1]), 0.03 * s));
        if (sk) d = smin(d, sdEll(x, y, z, sx * lx * 0.95, T.knee + (T.hipY - T.knee) * 0.3, 0.03 * s, T.thR[1], 0.06, T.thR[1]), 0.02);
      }
      return d;
    };
    const pel = (x, y, z) => sdEll(x, y, z, 0, pe[0], -0.005, pe[1], pe[2], pe[3]);
    let lowerGeo, legsGeo = null;
    if (bot.type === 'skirt') {
      const top0 = be[0] - 0.02 * s, len = bot.len * s;
      const ffSkirt = (x, Y, z) => {
        const t = clamp((top0 - Y) / len, 0, 1);
        const r = lerp(be[1] * 0.98, pe[1] * 1.35 + 0.02 * s, Math.pow(t, 0.8));
        const a = Math.atan2(x, z);
        const rr = r * (1 + t * 0.07 * Math.sin(a * 7 + 0.5) + t * 0.03 * Math.sin(a * 13));
        const rz = rr * (pe[3] / pe[1]) * 1.15;
        const q = Math.sqrt((x * x) / (rr * rr) + (z * z) / (rz * rz));
        let d = (q - 1) * Math.min(rr, rz);
        d = smax(d, Y - top0, 0.004);
        d = smax(d, top0 - len - Y, 0.004);
        d = smin(d, pel(x, Y, z), 0.03 * s);
        return d;
      };
      lowerGeo = meshSDF((x, y, z) => ffSkirt(x, y + hy, z), [-0.2 * s, be[0] - 0.02 * s - len - 0.02 - hy, -0.18 * s], [0.2 * s, be[0] + 0.01 - hy, 0.18 * s], res, { uv: (x, y, z) => [(Math.atan2(x, z) / (Math.PI * 2) + 0.5) * 0.8 * s, y] });
      legsGeo = meshSDF((x, y, z) => ffLegs(x, y + hy, z, false), [-0.15 * s, T.ankle - 0.04 - hy, -0.1 * s], [0.15 * s, top0 - len + 0.08 - hy, 0.1 * s], res, { uv: (x, y, z) => [(Math.atan2(x, z) / (Math.PI * 2) + 0.5) * 0.25, y] });
    } else {
      const ffPants = (x, Y, z) => {
        let d = smin(pel(x, Y, z), ffLegs(x, Y, z) - 0.006, 0.06 * s);
        d = smin(d, sdEll(x, Y, z, 0, be[0] - 0.02 * s, 0.004, be[1] * 0.98, be[2] * 0.6, be[3] * 1.0), 0.03 * s);
        d = smax(d, Y - (be[0] + be[2] * 0.0), 0.004);
        d = smax(d, T.ankle + 0.02 * s - Y, 0.004);
        d += folds(x, Y, z, 0.0012 * s, 70, 5);
        return d;
      };
      lowerGeo = meshSDF((x, y, z) => ffPants(x, y + hy, z), [-0.24 * s, T.ankle - hy, -0.15 * s], [0.24 * s, be[0] + 0.02 - hy, 0.16 * s], res * 1.15, { uv: (x, y, z) => [(Math.atan2(x, z) / (Math.PI * 2) + 0.5) * 0.5 * s, y] });
    }
    const lowerMesh = new THREE.Mesh(lowerGeo, clothMat('bot', bot.color, bot.tex || 'cotton', bot.rep || 8));
    lowerMesh.castShadow = lowerMesh.receiveShadow = true; this.hips.add(lowerMesh);
    if (legsGeo) { const lm = new THREE.Mesh(legsGeo, clothMat('legs', o.legs || '#3a2c26', 'knit', 14, { sheen: 0.8 })); lm.castShadow = lm.receiveShadow = true; this.hips.add(lm); }
    // shoes
    const ffShoe = (x, y, z) => {
      let d = 1e9;
      for (const sx of [-1, 1]) {
        const cx = sx * lx * 0.9;
        d = Math.min(d, smin(sdEll(x, y, z, cx, T.ankle * 0.55, T.foot * 0.22, T.foot * 0.21, T.ankle * 0.62, T.foot * 0.48), sdRC(x, y, z, cx, T.ankle * 0.4, -T.foot * 0.12, cx, T.ankle * 1.0, -0.005, T.caR[1] * 1.25, T.caR[1] * 1.15), 0.02));
        d = smax(d, -y + 0.001, 0.002);
      }
      return d;
    };
    const shoeGeo = meshSDF(ffShoe, [-0.2 * s, 0, -0.1 * s], [0.2 * s, T.ankle * 1.4, T.foot * 0.8], res * 0.9);
    const shoeMat = new THREE.MeshPhysicalMaterial({ color: o.shoes || '#3b2418', roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.4 });
    const shoes = new THREE.Mesh(shoeGeo, shoeMat); shoes.castShadow = true; g.add(shoes);
    await nextFrame();

    // ---------------- arms
    this.arms = {};
    const uaGeo = meshSDF((x, y, z) => {
      let d = sdRC(x, y, z, 0, 0, 0, 0, -T.ua, 0, T.uaR[0], T.uaR[1]);
      d = smin(d, sdSphere(x, y, z, 0, -0.005, 0, T.uaR[0] * 1.12), 0.02 * s);
      d += folds(x, y, z, 0.0012 * s, 90, 4) * sstep(-T.ua * 0.6, -T.ua, y);
      return d;
    }, [-0.06 * s, -T.ua - 0.04 * s, -0.06 * s], [0.06 * s, 0.05 * s, 0.06 * s], res * 0.85, { uv: (x, y, z) => [(Math.atan2(x, z) / (Math.PI * 2) + 0.5) * 0.25 * s, y] });
    const faGeo = meshSDF((x, y, z) => {
      let d = sdRC(x, y, z, 0, 0, 0, 0, -T.fa, 0, T.faR[0] * 1.04, T.faR[1] * 1.12);
      d = smin(d, sdSphere(x, y, z, 0, 0, 0, T.uaR[1] * 1.02), 0.015 * s);
      d = smin(d, sdRC(x, y, z, 0, -T.fa + 0.012 * s, 0, 0, -T.fa - 0.004 * s, 0, T.faR[1] * 1.32, T.faR[1] * 1.3), 0.008 * s); // cuff
      d += folds(x, y, z, 0.0012 * s, 80, 4) * sstep(-0.02, -T.fa * 0.5, y);
      return d;
    }, [-0.05 * s, -T.fa - 0.03 * s, -0.05 * s], [0.05 * s, 0.04 * s, 0.05 * s], res * 0.85, { uv: (x, y, z) => [(Math.atan2(x, z) / (Math.PI * 2) + 0.5) * 0.2 * s, y] });
    const hs = T.hand / 0.185 * 1.0 * (o.kid ? 1.1 : 1);
    const handL = handSDF(hs, 0.55);
    const handGeoR = meshSDF((x, y, z) => evalL(handL, x, y, z), [-0.04 * hs, -0.2 * hs, -0.04 * hs], [0.04 * hs, 0.03 * hs, 0.08 * hs], 0.0028 * hs);
    const handGeoL = mirrorGeo(handGeoR.clone());
    await nextFrame();
    for (const side of ['L', 'R']) {
      const sx = side === 'L' ? 1 : -1; // character's left is +x
      const sh = new THREE.Group(); sh.position.set(sx * T.shX, T.shY - T.hipY - 0.01 * s, -0.005);
      this.torso.add(sh);
      const ua = new THREE.Mesh(uaGeo, topMat); ua.castShadow = ua.receiveShadow = true; sh.add(ua);
      const el = new THREE.Group(); el.position.y = -T.ua; sh.add(el);
      const fa = new THREE.Mesh(faGeo, topMat); fa.castShadow = fa.receiveShadow = true; el.add(fa);
      const wr = new THREE.Group(); wr.position.y = -T.fa; el.add(wr);
      const hand = new THREE.Mesh(side === 'R' ? handGeoR : handGeoL, this.skinMat); hand.castShadow = true;
      hand.rotation.y = side === 'R' ? 0 : 0;
      wr.add(hand);
      // rest pose
      this.arms[side] = { sh, el, wr, hand, sx, restZ: sx * 0.16 };
    }
    // contact shadow under feet
    this.ready = true;
    this.group.traverse(m => { if (m.isMesh) m.userData.human = this; });
    return this;
  }

  splatFace(n = 16) {
    const f = this.face, s = this.s;
    if (!f.bump) {
      f.bump = document.createElement('canvas'); f.bump.width = f.bump.height = f.size;
      f.bumpTex = new THREE.CanvasTexture(f.bump);
      this.skinMatFace.bumpMap = f.bumpTex; this.skinMatFace.bumpScale = 6; this.skinMatFace.needsUpdate = true;
    }
    f.cream = [];
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 0.055 * s;
      f.cream.push({ x: Math.cos(a) * r * 1.1, y: -0.02 * s + Math.sin(a) * r * 1.2, r: (0.014 + rnd() * 0.02) * s, hp: 1, sq: 0.6 + rnd() * 0.5, rot: rnd() * 3 });
    }
    f.cream.push({ x: 0, y: -0.03 * s, r: 0.04 * s, hp: 1, sq: 0.7, rot: 0 }, { x: 0.03 * s, y: 0.01 * s, r: 0.03 * s, hp: 1, sq: 0.8, rot: 1 });
    f.draw(this.expr);
  }
  // uv from a raycast hit on the head mesh -> wipe; returns remaining fraction
  wipeFace(uv, amt) {
    const f = this.face; if (!f.cream) return 0;
    const x = (uv.x - 0.5) * 0.24 * this.s, y = (uv.y - 0.5) * 0.28 * this.s;
    let tot = 0;
    for (const b of f.cream) {
      const d = Math.hypot(b.x - x, b.y - y);
      if (d < b.r + 0.022 * this.s) b.hp = Math.max(0, b.hp - amt * (1 - d / (b.r + 0.03 * this.s)));
      tot += b.hp;
    }
    f.draw(this.expr);
    return tot / f.cream.length;
  }

  lidMaterial(skin, lash) {
    const c = document.createElement('canvas'); c.width = 64; c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = skin; g.fillRect(0, 0, 64, 64);
    // crease shading near top, lash line at the rim (v=0 at the cap's edge -> bottom of texture)
    const gr = g.createLinearGradient(0, 0, 0, 64);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.7, 'rgba(120,60,50,0.15)'); gr.addColorStop(0.86, 'rgba(60,30,25,0.5)'); gr.addColorStop(0.9, lash); gr.addColorStop(1, lash);
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.55 });
  }

  async buildHair(fHead0, s, res) {
    const o = this.opt, st = o.hairStyle;
    const crownAx = new THREE.Vector3(0, 1, -0.35).normalize();
    const groove = (x, y, z, n, amp) => {
      // angle around crown axis -> strands radiate from the crown
      const d = x * crownAx.x + y * crownAx.y + z * crownAx.z;
      const px = x - crownAx.x * d, py = y - crownAx.y * d, pz = z - crownAx.z * d;
      const a = Math.atan2(px, pz - py * 0.3);
      const w = Math.sin(a * n + Math.sin(a * 3.0 + d * 40) * 1.2);
      const c = Math.sin(a * n * 0.37 + 2.1) * 0.5 + 0.5;
      return amp * (Math.abs(w) * 1.6 - 0.8) * (0.6 + 0.4 * c);
    };
    const fp = (x, y, z) => fHead0(x, y, z);
    let f;
    const S = s;
    if (st === 'pigtails' || st === 'bob' || st === 'kidshort' || st === 'short' || st === 'bun' || st === 'balding') {
      const thick = { pigtails: 0.013, bob: 0.015, kidshort: 0.011, short: 0.009, bun: 0.011, balding: 0.005 }[st] * S;
      const hl = { pigtails: 0.026, bob: 0.03, kidshort: 0.04, short: 0.052, bun: 0.055, balding: 0.06 }[st] * S;
      const napeY = { pigtails: -0.075, bob: -0.09, kidshort: -0.06, short: -0.065, bun: -0.06, balding: -0.06 }[st] * S;
      const fringe = [];
      if (st === 'pigtails' || st === 'bob' || st === 'kidshort') {
        const n = 0;
        for (let i = 0; i < n; i++) {
          const u = (i / (n - 1) - 0.5) * 2; // -1..1
          const x0 = u * 0.05 * S;
          const yEnd = hl - 0.006 * S + Math.abs(u) * 0.016 * S + (rnd() - 0.5) * 0.004 * S;
          const zEnd = surfZ(fp, x0 * 1.05, yEnd) + 0.0035 * S;
          const yTop = 0.085 * S, zTop = surfZ(fp, x0 * 0.7, yTop) + 0.004 * S;
          fringe.push([x0 * 0.7, yTop, zTop, x0 * 1.05 + u * 0.004 * S, yEnd, zEnd - 0.001 * S, 0.009 * S, 0.0048 * S]);
        }
      }
      f = (x, y, z) => {
        let d = fp(x, y, z) - thick;
        // face region: frontal half below the hairline (bangs edge wavy)
        const yh = hl + (st === 'pigtails' || st === 'bob' ? Math.abs(x) * 0.25 + Math.abs(Math.sin(x * 160 / S)) * 0.005 * S : x * x * 8 / S);
        const face = Math.max(-0.012 * S - z, y - yh);
        d = smax(d, -face, 0.005 * S);
        // above / around the ears for short styles
        if (st === 'short' || st === 'kidshort' || st === 'balding' || st === 'bun') {
          const ear = Math.max(Math.max(0.058 * S - Math.abs(x), y + 0.004 * S), -0.03 * S - z);
          d = smax(d, -ear, 0.006 * S);
        }
        // fringe: separate clumps of hair falling over the forehead (strand separation at the edge)
        for (const q of fringe) d = smin(d, sdRC(x, y, z, q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7]), 0.004 * S);
        // nape
        d = smax(d, napeY - y, 0.006 * S);
        if (st === 'bob') {
          const r = Math.hypot(x, (z + 0.008 * S) * 0.97);
          const bobR = 0.087 * S + Math.max(0, -y) * 0.12 + Math.max(0, y - 0.02 * S) * -0.4;
          let bob = r - bobR;
          bob = smax(bob, Math.max(y - 0.07 * S, -0.095 * S - y), 0.012 * S);
          bob = smax(bob, -face, 0.006 * S);
          d = smin(d, bob, 0.02 * S);
          d = smax(d, -(fp(x, y, z) + 0.0015 * S), 0.003 * S);
        }
        if (st === 'balding') d = smax(d, -sdSphere(x, y, z, 0, 0.115 * S, 0.03 * S, 0.07 * S), 0.012 * S);
        if (st === 'bun') d = smin(d, sdSphere(x, y, z, 0, 0.07 * S, -0.075 * S, 0.034 * S) + groove(x, y - 0.07 * S, z + 0.075 * S, 22, 0.002 * S), 0.012 * S);
        d += groove(x, y, z, st === 'short' || st === 'balding' ? 34 : 22, (st === 'short' || st === 'balding' ? 0.001 : 0.0015) * S);
        return d;
      };
    }
    const hb = 0.135 * S;
    const ext = st === 'bob' ? 0.14 * S : 0.1 * S;
    const geo = meshSDF(f, [-hb, -ext, -hb - 0.03 * S], [hb, hb, hb], res * 0.85, {
      uv: (x, y, z) => [(Math.atan2(x, z) / (Math.PI * 2) + 0.5) * 2.0, y * 4 + Math.hypot(x, z) * 2],
    });
    this.hairMat = hairMat(o.hair);
    const hm = new THREE.Mesh(geo, this.hairMat); hm.castShadow = true; hm.receiveShadow = true;
    this.head.add(hm); this.hairMesh = hm;
    // pigtails: bundles of strands
    if (st === 'pigtails') {
      for (const sx of [-1, 1]) {
        const base = [sx * 0.072 * S, -0.045 * S, -0.05 * S];
        const strands = [];
        for (let i = 0; i < 9; i++) {
          const a = i / 9 * Math.PI * 2;
          const ox = Math.cos(a) * 0.009 * S, oz = Math.sin(a) * 0.009 * S;
          const L = (0.1 + 0.02 * Math.sin(i * 2.1)) * S;
          strands.push([base[0] + ox * 0.6, base[1], base[2] + oz * 0.6, base[0] + sx * 0.03 * S + ox * 1.9, base[1] - L, base[2] - 0.01 * S + oz * 1.9, 0.0105 * S, 0.0035 * S]);
        }
        const ff = (x, y, z) => {
          let d = 1e9;
          for (const q of strands) d = smin(d, sdRC(x, y, z, ...q), 0.0035 * S);
          d = smin(d, sdSphere(x, y, z, base[0], base[1] + 0.004 * S, base[2], 0.013 * S), 0.004 * S);
          return d;
        };
        const g2 = meshSDF(ff, [base[0] - 0.05 * S, base[1] - 0.15 * S, base[2] - 0.06 * S], [base[0] + 0.07 * S, base[1] + 0.03 * S, base[2] + 0.05 * S], 0.0028 * S, {
          uv: (x, y, z) => [Math.atan2(x - base[0], z - base[2]) * 0.5, y * 5],
        });
        const pm = new THREE.Mesh(g2, this.hairMat); pm.castShadow = true; this.head.add(pm);
        // hair tie (deep red knit)
        const tie = new THREE.Mesh(new THREE.TorusGeometry(0.011 * S, 0.0045 * S, 10, 20), clothMat('tie', '#8a2424', 'knit', 4));
        tie.position.set(base[0] + sx * 0.002, base[1] - 0.008 * S, base[2]); tie.rotation.x = Math.PI / 2 + 0.2; tie.rotation.y = sx * 0.3;
        this.head.add(tie);
      }
    }
    if (o.moustache) {
      const ff = (x, y, z) => sdEll(Math.abs(x), y, z, 0.013 * S, -0.045 * S, 0.092 * S, 0.016 * S, 0.0055 * S, 0.008 * S) + groove(x, y, z, 120, 0.0006 * S);
      const g3 = meshSDF(ff, [-0.04 * S, -0.06 * S, 0.07 * S], [0.04 * S, -0.03 * S, 0.11 * S], 0.0018 * S);
      const mm = new THREE.Mesh(g3, this.hairMat); this.head.add(mm);
    }
    if (o.glasses) {
      const gm = new THREE.MeshStandardMaterial({ color: 0x4a3426, roughness: 0.35, metalness: 0.2 });
      const lensM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, transparent: true, opacity: 0.12, metalness: 0, clearcoat: 1 });
      for (const sx of [-1, 1]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.019 * S, 0.0018 * S, 8, 32), gm);
        ring.position.set(sx * this.opt._eyeX || sx * 0.031 * S, 0.004 * S, 0.092 * S); ring.scale.y = 0.8;
        this.head.add(ring);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.019 * S, 24), lensM); lens.position.copy(ring.position); lens.scale.y = 0.8; this.head.add(lens);
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.0013 * S, 0.0013 * S, 0.09 * S, 6), gm);
        arm.rotation.x = Math.PI / 2; arm.position.set(sx * 0.072 * S, 0.006 * S, 0.048 * S); this.head.add(arm);
      }
      const br = new THREE.Mesh(new THREE.CylinderGeometry(0.0015 * S, 0.0015 * S, 0.022 * S, 6), gm); br.rotation.z = Math.PI / 2; br.position.set(0, 0.008 * S, 0.095 * S); this.head.add(br);
    }
  }

  // chef hat (toque) on/off
  makeHat() {
    const S = this.s;
    const f = (x, y, z) => {
      const r = Math.hypot(x, z * 1.05);
      const a = Math.atan2(x, z);
      // band
      let band = Math.max(r - 0.087 * S, Math.abs(y - 0.055 * S) - 0.025 * S);
      band = smax(band, -(r - 0.078 * S), 0.002);
      // puffy pleated top
      const pleat = Math.abs(Math.sin(a * 9)) * 0.006 * S;
      const top = sdEll(x, y, z, 0, 0.125 * S, 0, 0.112 * S - pleat, 0.07 * S, 0.108 * S - pleat);
      const col = Math.max(r - (0.09 * S - pleat * 0.5), Math.abs(y - 0.1 * S) - 0.03 * S);
      let d = smin(band, smin(top, col, 0.02 * S), 0.008 * S);
      d = smax(d, -(Math.max(Math.max(r - 0.08 * S, 0.035 * S - y), y - 0.1 * S)), 0.004);
      return d;
    };
    const g = meshSDF(f, [-0.13 * S, 0.02 * S, -0.13 * S], [0.13 * S, 0.21 * S, 0.13 * S], 0.004 * S, { uv: (x, y, z) => [(Math.atan2(x, z) / (Math.PI * 2) + 0.5) * 0.6 * S, y] });
    g.scale(1, 0.82, 1);
    const m = new THREE.Mesh(g, clothMat('hat', '#f7f4ee', 'cotton', 7, { sheen: 0.4 }));
    m.castShadow = true; m.receiveShadow = true;
    return m;
  }
  wearHat(hat) {
    hat.position.set(0, 0.004 * this.s, -0.008 * this.s); hat.rotation.set(-0.12, 0, 0.05);
    this.head.add(hat);
    this.hairMesh.scale.set(1, 0.97, 1);
  }
  makeApron(color = '#6b4228') {
    const T = this.T, s = this.s, hy = T.hipY, o = this.opt;
    const be = T.belly, pe = T.pelvis;
    const bottomY = o.kid ? T.knee + 0.04 * s : T.knee + 0.04;
    const f = (x, y, z) => {
      const Y = y + hy;
      let body = this.ffTorso(x, y, z) - 0.006 * s;
      // skirt part
      const t = clamp((be[0] - Y) / (be[0] - bottomY), 0, 1);
      const r = lerp(be[1], pe[1] * 1.45 + 0.02 * s, Math.pow(t, 0.7));
      const a = Math.atan2(x, z);
      const rr = r * (1 + 0.04 * t * Math.sin(a * 6 + 1));
      const sk = (Math.sqrt(x * x / (rr * rr) + z * z / (rr * rr * 1.05)) - 1) * rr;
      let skirt = smax(sk, Math.max(Y - be[0] - 0.02 * s, bottomY - Y), 0.004);
      let d = smin(body, skirt, 0.03 * s);
      // keep only front panel
      d = smax(d, -(z - 0.01 * s) + Math.abs(x) * 0.15, 0.003);
      // bib top + neck
      d = smax(d, Y - (T.chest[0] + T.chest[2] * 0.55), 0.004);
      // bib narrower than the skirt
      const bibW = 0.075 * s * (o.kid ? 1 : 1.1);
      d = smax(d, (Y > be[0] - 0.01 * s) ? Math.abs(x) - bibW : -1, 0.01 * s);
      return d;
    };
    const g = meshSDF(f, [-0.25 * s, bottomY - hy - 0.02, -0.02], [0.25 * s, T.chest[0] + 0.06 * s - hy, 0.22 * s], 0.0045 * s, { uv: (x, y, z) => [x, y] });
    const m = new THREE.Mesh(g, clothMat('apron', color, 'linen', 9, { sheen: 0.5, ns: 1.2 }));
    m.castShadow = m.receiveShadow = true;
    // neck strap
    const strapC = new THREE.CatmullRomCurve3([
      V(-0.07 * s, T.chest[0] + T.chest[2] * 0.5 - hy, T.chest[3] * 0.9), V(-0.05 * s, T.neckB - hy, 0.02 * s), V(0, T.neckB + 0.01 * s - hy, -0.035 * s), V(0.05 * s, T.neckB - hy, 0.02 * s), V(0.07 * s, T.chest[0] + T.chest[2] * 0.5 - hy, T.chest[3] * 0.9)]);
    const strap = new THREE.Mesh(new THREE.TubeGeometry(strapC, 30, 0.005 * s, 6), m.material);
    strap.scale.set(1, 1, 1);
    m.add(strap);
    return m;
  }
  wearApron(ap) { ap.position.set(0, 0, 0); ap.rotation.set(0, 0, 0); this.torso.add(ap); }

  setExpr(name, hold = 0) {
    this.exprTarget = { ...EXPR.neutral, ...EXPR[name] };
    this.exprName = name;
    this.exprHold = hold;
  }
  lookAt(v) { this.lookTarget = v; }

  // Two-bone IK: put wrist at world target. weight blends with rest pose.
  setReach(side, target, w = 1) { this.reach[side] = target; this.reachWT = this.reachWT || {}; this.reachWT[side] = w; }

  update(dt, cam) {
    if (!this.ready) return;
    this.t += dt;
    // expression tween
    if (this.exprHold > 0) { this.exprHold -= dt; if (this.exprHold <= 0) this.setExpr(this.idleExpr || 'neutral'); }
    let ch = 0;
    for (const k in this.exprTarget) {
      const a = this.expr[k] ?? 0, b = this.exprTarget[k];
      const n = damp(a, b, 12, dt);
      if (Math.abs(n - a) > 0.002) ch++;
      this.expr[k] = n;
    }
    this.expr.pout = this.exprTarget.pout; this.expr.round = this.exprTarget.round;
    if (ch) this.face.draw(this.expr);
    // blink
    this.blinkT -= dt;
    if (this.blinkT < 0) { this.blink = 1; this.blinkT = 2.2 + rnd() * 3.5; }
    this.blink = Math.max(0, this.blink - dt * 7);
    const bl = Math.sin(clamp(this.blink, 0, 1) * Math.PI);
    const lid = clamp(this.expr.lid + bl * (1 - this.expr.lid), -0.3, 1);
    for (const l of this.lids) {
      l.up.rotation.x = lerp(-0.86, 0.62, clamp(lid, 0, 1)) + (this.expr.lid < 0 ? this.expr.lid * 0.5 : 0);
      l.low.rotation.x = lerp(0.32, 0.05, clamp(this.expr.lower, 0, 1));
    }
    // look
    const tgt = this.lookTarget || (cam ? cam.position : null);
    if (tgt) {
      const hp = this.head.getWorldPosition(_v1);
      const dir = _v2.copy(tgt).sub(hp);
      // head turn (in parent space)
      const inv = _q1.copy(this.group.getWorldQuaternion(_q2)).invert();
      dir.applyQuaternion(inv).normalize();
      const yaw = clamp(Math.atan2(dir.x, dir.z), -0.8, 0.8);
      const pitch = clamp(Math.asin(clamp(dir.y, -1, 1)), -0.32, 0.4);
      this.neck.rotation.y = damp(this.neck.rotation.y, yaw * 0.6, 5, dt);
      this.neck.rotation.x = damp(this.neck.rotation.x, -pitch * 0.45, 5, dt);
      this.head.rotation.y = damp(this.head.rotation.y, yaw * 0.3, 6, dt);
      this.head.rotation.x = damp(this.head.rotation.x, -pitch * 0.35 + Math.sin(this.t * 1.3) * 0.015, 6, dt);
      // eyes
      for (const e of this.eyes) {
        const ep = e.getWorldPosition(_v3);
        const d2 = _v4.copy(tgt).sub(ep);
        const hq = _q3.copy(this.head.getWorldQuaternion(_q4)).invert();
        d2.applyQuaternion(hq).normalize();
        const ey = clamp(Math.atan2(d2.x, d2.z), -0.45, 0.45), ex = clamp(Math.asin(d2.y), -0.22, 0.35);
        e.rotation.y = damp(e.rotation.y, ey, 18, dt);
        e.rotation.x = damp(e.rotation.x, -ex, 18, dt);
      }
    }
    // breathing / idle
    this.torso.rotation.x = Math.sin(this.t * 1.7) * 0.008 + (this.lean || 0);
    this.torso.position.y = Math.sin(this.t * 3.4) * 0.0015 * this.s + (this.bounce || 0);
    // arms
    for (const side of ['L', 'R']) {
      const a = this.arms[side];
      const tg = this.reach[side];
      const wT = tg ? (this.reachWT[side] ?? 1) : 0;
      this.reachW[side] = damp(this.reachW[side], wT, 6, dt);
      const w = this.reachW[side];
      // rest pose
      const restSh = new THREE.Euler(0.05 + Math.sin(this.t * 1.7 + (side === 'L' ? 0 : 1)) * 0.02 + (a.restX || 0), 0, a.restZ + (a.waveZ || 0));
      _qa.setFromEuler(restSh); _qb.setFromEuler(new THREE.Euler(-0.18 + (a.restEl || 0), 0, 0));
      if (w > 0.001 && (tg || this._lastT?.[side])) {
        if (tg) { this._lastT = this._lastT || {}; this._lastT[side] = (this._lastT[side] || new THREE.Vector3()).copy(tg); }
        this.solveIK(a, this._lastT[side], _qc, _qd);
        a.sh.quaternion.copy(_qa).slerp(_qc, w);
        a.el.quaternion.copy(_qb).slerp(_qd, w);
      } else { a.sh.quaternion.copy(_qa); a.el.quaternion.copy(_qb); }
      if (this.handRot[side]) {
        // world-space wrist orientation request
        const pq = a.el.getWorldQuaternion(_q4).invert();
        _q1.copy(pq).multiply(this.handRot[side]);
        a.wr.quaternion.slerp(_q1, Math.min(1, w * 1.2));
      } else a.wr.quaternion.slerp(_q0, 0.2);
    }
  }
  solveIK(a, target, outSh, outEl) {
    const T = this.T;
    const L1 = T.ua, L2 = T.fa + T.hand * 0.45;
    // to torso-space
    this.torso.updateWorldMatrix(true, false);
    const inv = _m1.copy(this.torso.matrixWorld).invert();
    const t = _v1.copy(target).applyMatrix4(inv);
    const S = a.sh.position;
    const d = _v2.copy(t).sub(S);
    let len = d.length();
    len = clamp(len, Math.abs(L1 - L2) + 0.01, L1 + L2 - 0.002);
    d.normalize();
    const ca = (L1 * L1 + len * len - L2 * L2) / (2 * L1 * len);
    const ang = Math.acos(clamp(ca, -1, 1));
    // pole: elbow down/out/back
    const pole = _v3.set(a.sx * 0.5, -1, -0.35).normalize();
    const perp = _v4.copy(pole).addScaledVector(d, -pole.dot(d)).normalize();
    const elDir = _v5.copy(d).multiplyScalar(Math.cos(ang)).addScaledVector(perp, Math.sin(ang)).normalize();
    // upper arm: local -Y -> elDir
    _qc0.setFromUnitVectors(_down, elDir);
    outSh.copy(_qc0);
    // forearm direction
    const E = _v6.copy(S).addScaledVector(elDir, L1);
    const tDir = _v7.copy(S).addScaledVector(d, len).sub(E).normalize();
    // in upper-arm local space
    const invU = _q2.copy(outSh).invert();
    tDir.applyQuaternion(invU);
    outEl.setFromUnitVectors(_down, tDir);
  }
}
const _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3(), _v4 = new THREE.Vector3(), _v5 = new THREE.Vector3(), _v6 = new THREE.Vector3(), _v7 = new THREE.Vector3();
const _q0 = new THREE.Quaternion(), _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _q3 = new THREE.Quaternion(), _q4 = new THREE.Quaternion();
const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion(), _qc = new THREE.Quaternion(), _qd = new THREE.Quaternion(), _qc0 = new THREE.Quaternion();
const _m1 = new THREE.Matrix4();
const _down = new THREE.Vector3(0, -1, 0);
