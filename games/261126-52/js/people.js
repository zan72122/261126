// people.js — procedural, realistically proportioned people: sculpted head with 3D eyes/lids/brows,
// painted+morphing mouth, strand-clump hair, lofted clothing with quilting & wrinkles, 2-bone arm IK.
import * as THREE from 'three';
import { tex, setMap, patch, pbr, clamp, lerp, damp } from './core.js';
import { fbm } from './field.js';

const V3 = THREE.Vector3;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------------------ loft (tube along a path, elliptical rings, rounded caps)
export function loft(path, radius, { seg = 24, capStart = true, capEnd = true, vScale = 1, mod = null, up = new V3(0, 0, 1), uRepeat = 1 } = {}) {
  // path: array of V3 ; radius(t, a) -> [rx, rz] ; mod(t, a, r) -> scalar multiplier
  const n = path.length;
  const T = [], N = [], B = [];
  for (let i = 0; i < n; i++) {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(n - 1, i + 1)];
    T.push(b.clone().sub(a).normalize());
  }
  // initial frame from 'up' hint, then parallel transport
  let nrm = up.clone().sub(T[0].clone().multiplyScalar(up.dot(T[0])));
  if (nrm.lengthSq() < 1e-6) nrm = new V3(1, 0, 0).sub(T[0].clone().multiplyScalar(T[0].x));
  nrm.normalize();
  for (let i = 0; i < n; i++) {
    if (i > 0) {
      const ax = new V3().crossVectors(T[i - 1], T[i]);
      const s = ax.length();
      if (s > 1e-6) { ax.divideScalar(s); const ang = Math.asin(clamp(s, -1, 1)); nrm.applyAxisAngle(ax, ang); }
    }
    N.push(nrm.clone()); B.push(new V3().crossVectors(T[i], nrm).normalize());
  }
  // arc length
  const len = [0];
  for (let i = 1; i < n; i++) len.push(len[i - 1] + path[i].distanceTo(path[i - 1]));
  const total = len[n - 1] || 1;
  const rings = [];
  const capRings = 5;
  const r0 = radius(0, 0), r1 = radius(1, 0);
  if (capStart) for (let k = capRings; k >= 1; k--) {
    const f = k / capRings, ang = f * Math.PI / 2;
    rings.push({ c: path[0].clone().addScaledVector(T[0], -Math.sin(ang) * Math.min(r0[0], r0[1]) * 0.85), i: 0, s: Math.cos(ang), t: 0, v: -Math.sin(ang) * 0.05 });
  }
  for (let i = 0; i < n; i++) rings.push({ c: path[i], i, s: 1, t: len[i] / total, v: len[i] });
  if (capEnd) for (let k = 1; k <= capRings; k++) {
    const f = k / capRings, ang = f * Math.PI / 2;
    rings.push({ c: path[n - 1].clone().addScaledVector(T[n - 1], Math.sin(ang) * Math.min(r1[0], r1[1]) * 0.85), i: n - 1, s: Math.cos(ang), t: 1, v: total + Math.sin(ang) * 0.05 });
  }
  const pos = [], uv = [], idx = [];
  for (const r of rings) {
    for (let j = 0; j <= seg; j++) {
      const a = j / seg * Math.PI * 2;
      const rr = radius(r.t, a);
      let m = r.s; if (mod) m *= mod(r.t, a, r);
      const ca = Math.cos(a), sa = Math.sin(a);
      const p = r.c.clone().addScaledVector(N[r.i], ca * rr[0] * m).addScaledVector(B[r.i], sa * rr[1] * m);
      pos.push(p.x, p.y, p.z); uv.push(j / seg * uRepeat, r.v * vScale);
    }
  }
  const R = rings.length;
  for (let i = 0; i < R - 1; i++) for (let j = 0; j < seg; j++) {
    const a = i * (seg + 1) + j, b = a + 1, c = a + seg + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  // weld seam normals
  const nr = g.attributes.normal;
  for (let i = 0; i < R; i++) {
    const a = i * (seg + 1), b = a + seg;
    const x = (nr.getX(a) + nr.getX(b)) / 2, y = (nr.getY(a) + nr.getY(b)) / 2, z = (nr.getZ(a) + nr.getZ(b)) / 2;
    const l = Math.hypot(x, y, z) || 1;
    nr.setXYZ(a, x / l, y / l, z / l); nr.setXYZ(b, x / l, y / l, z / l);
  }
  return g;
}
const line = (a, b, n) => { const out = []; for (let i = 0; i <= n; i++) out.push(new V3().lerpVectors(a, b, i / n)); return out; };
function curve(pts, n) { return new THREE.CatmullRomCurve3(pts, false, 'centripetal').getPoints(n); }

// quilting: pinched seams every `pitch` along t, bulges between
const quilt = (pitch, amt) => (t, a, r) => {
  const q = (((r.v / pitch) % 1) + 1) % 1;
  return 1 + amt * (Math.pow(Math.abs(Math.sin(Math.PI * q)), 0.5) - 0.75);
};
// soft cloth wrinkles: low-frequency noise on radius
const wrinkle = (amt, seed, fu = 3, fv = 9) => (t, a, r) => 1 + (fbm(a / (Math.PI * 2) * fu + seed, r.v * fv, seed) - 0.5) * amt;
const both = (f, g) => (t, a, r) => f(t, a, r) * g(t, a, r);

// ------------------------------------------------------------ materials
function clothMat(prefix, color, o = {}) {
  const m = pbr(prefix, Object.assign({ color, repeat: o.repeat || [4, 4], physical: true, sheen: o.sheen ?? 0.6, sheenRoughness: 0.6, sheenColor: o.sheenColor ?? 0x999999, roughness: 1, ns: o.ns ?? 1 }, o));
  return m;
}
function skinMat(canvasTex, tone) {
  const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.55, sheen: 0.35, sheenRoughness: 0.5, sheenColor: new THREE.Color(0.9, 0.35, 0.25), clearcoat: 0.06, clearcoatRoughness: 0.5 });
  if (canvasTex) m.map = canvasTex; else m.color.set(tone);
  const n = tex('skin_nrm.jpg', { repeat: [7, 4] });
  setMap(m, 'normalMap', n); m.normalScale.set(0.35, 0.35);
  // cheap subsurface: wrap diffuse and warm the terminator
  patch(m, {
    key: 'skin',
    fragment: {
      lights_fragment_end: `$
        reflectedLight.directDiffuse += reflectedLight.indirectDiffuse * vec3(0.10, 0.03, 0.02);`,
    },
  });
  return m;
}
function hairMat(color) {
  const m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, metalness: 0, sheen: 0.5, sheenColor: new THREE.Color(color).multiplyScalar(2.2), sheenRoughness: 0.35, anisotropy: 0.7, anisotropyRotation: Math.PI / 2 });
  setMap(m, 'map', tex('hair_c.jpg', { srgb: true, repeat: [3, 1] }));
  setMap(m, 'normalMap', tex('hair_nrm.jpg', { repeat: [3, 1] }));
  m.normalScale.set(0.6, 0.6);
  return m;
}

// ------------------------------------------------------------ head
function bump(p, c, r, amt) { const d2 = p.distanceToSquared(c); return amt * Math.exp(-d2 / (r * r)); }
function sculpt(p, P) {
  // p: unit dir (z forward). returns radius multiplier and offset in unit space
  const x = p.x, y = p.y, z = p.z;
  let s = 1;
  s += bump(p, new V3(0.48, -0.30, 0.80), 0.30, P.cheek); s += bump(p, new V3(-0.48, -0.30, 0.80), 0.30, P.cheek);
  s += bump(p, new V3(0.34, 0.03, 0.90), 0.16, -0.075); s += bump(p, new V3(-0.34, 0.03, 0.90), 0.16, -0.075);
  s += bump(p, new V3(0.34, 0.22, 0.90), 0.18, P.brow); s += bump(p, new V3(-0.34, 0.22, 0.90), 0.18, P.brow);
  s += bump(p, new V3(0, 0.0, 1), 0.09, 0.035 * P.nose);
  s += bump(p, new V3(0, -0.17, 0.99), 0.10, 0.07 * P.nose);
  s += bump(p, new V3(0, -0.23, 0.98), 0.075, 0.07 * P.nose);
  s += bump(p, new V3(0.09, -0.24, 0.96), 0.06, 0.03 * P.nose); s += bump(p, new V3(-0.09, -0.24, 0.96), 0.06, 0.03 * P.nose);
  s += bump(p, new V3(0, -0.37, 0.94), 0.11, 0.028);
  s += bump(p, new V3(0, -0.47, 0.90), 0.10, 0.024);
  s += bump(p, new V3(0, -0.57, 0.84), 0.07, -0.012);
  s += bump(p, new V3(0, -0.72, 0.68), 0.20, P.chin);
  s += bump(p, new V3(0.86, 0.15, 0.35), 0.25, -0.025); s += bump(p, new V3(-0.86, 0.15, 0.35), 0.25, -0.025);
  return s;
}
function buildHeadGeo(P) {
  const g = new THREE.SphereGeometry(1, 96, 72);
  const pa = g.attributes.position;
  const base = [], jaw = [], smile = [];
  const p = new V3();
  for (let i = 0; i < pa.count; i++) {
    p.set(pa.getX(i), pa.getY(i), pa.getZ(i));
    const dir = p.clone();
    let s = sculpt(dir, P);
    let x = p.x * s, y = p.y * s, z = p.z * s;
    const lower = sstep(0.05, -0.95, p.y);
    x *= 1 - P.jawTaper * lower;
    if (z > 0) z *= 1 - 0.07 * x * x;
    z *= 1 - 0.08 * lower * (z < 0 ? 1 : 0.2);
    if (p.y < -0.8 && p.z < 0.2) y = lerp(y, -0.8, 0.5 * sstep(-0.8, -1, p.y));
    const v = new V3(x * P.hx, y * P.hy, z * P.hz);
    base.push(v);
    // morph: jaw open (rotate lower face down/back)
    const jw = sstep(-0.40, -0.62, p.y) * sstep(-0.3, 0.45, p.z);
    jaw.push(new V3(0, -P.hy * 0.13 * jw, -P.hz * 0.03 * jw));
    // morph: smile (mouth corners up/back, cheeks up)
    let sw = 0;
    const sm = new V3();
    for (const sx of [-1, 1]) {
      const c = new V3(0.27 * sx, -0.43, 0.88);
      const w = Math.exp(-dir.distanceToSquared(c) / 0.03);
      sm.x += sx * w * 0.02 * P.hx; sm.y += w * 0.05 * P.hy; sm.z -= w * 0.02 * P.hz;
      const ch = Math.exp(-dir.distanceToSquared(new V3(0.45 * sx, -0.28, 0.82)) / 0.05);
      sm.y += ch * 0.03 * P.hy; sm.z += ch * 0.025 * P.hz; sm.x += sx * ch * 0.01 * P.hx;
      sw += w;
    }
    smile.push(sm);
  }
  for (let i = 0; i < pa.count; i++) pa.setXYZ(i, base[i].x, base[i].y, base[i].z);
  g.computeVertexNormals();
  g.morphAttributes.position = [
    new THREE.Float32BufferAttribute(jaw.flatMap((v) => [v.x, v.y, v.z]), 3),
    new THREE.Float32BufferAttribute(smile.flatMap((v) => [v.x, v.y, v.z]), 3),
  ];
  g.morphTargetsRelative = true;
  return g;
}
// surface point of the sculpted head along a unit direction (approx)
function headSurf(dir, P) {
  const d = dir.clone().normalize();
  let s = sculpt(d, P);
  let x = d.x * s, y = d.y * s, z = d.z * s;
  const lower = sstep(0.05, -0.95, d.y);
  x *= 1 - P.jawTaper * lower; if (z > 0) z *= 1 - 0.07 * x * x;
  return new V3(x * P.hx, y * P.hy, z * P.hz);
}

// ------------------------------------------------------------ face canvas (skin colour, blush, lips/mouth)
class FaceCanvas {
  constructor(P) {
    this.P = P;
    this.cv = document.createElement('canvas'); this.cv.width = 1024; this.cv.height = 512;
    this.ctx = this.cv.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.cv); this.tex.colorSpace = THREE.SRGBColorSpace; this.tex.anisotropy = 4;
    this.base = document.createElement('canvas'); this.base.width = 1024; this.base.height = 512;
    this.paintBase();
    this.state = { open: 0, smile: 0, round: 0, wide: 1, tilt: 0 };
    this.last = null;
    this.draw(this.state);
  }
  px(mx, my) { // metres in face plane (x right of viewer = girl's left) -> canvas px at mouth region
    const P = this.P;
    return [256 + (mx / P.hx) * 163, 512 * Math.acos(clamp(my / P.hy, -1, 1)) / Math.PI];
  }
  dirPx(d) { const phi = Math.atan2(d.z, -d.x); let u = phi / (Math.PI * 2); if (u < 0) u += 1; return [u * 1024, Math.acos(clamp(d.y, -1, 1)) / Math.PI * 512]; }
  paintBase() {
    const c = this.base.getContext('2d'), P = this.P;
    c.fillStyle = P.skin; c.fillRect(0, 0, 1024, 512);
    // mottled variation
    const id = c.getImageData(0, 0, 1024, 512); const d = id.data;
    for (let y = 0; y < 512; y++) for (let x = 0; x < 1024; x++) {
      const n = fbm(x / 60, y / 60, 3, 3) - 0.5, n2 = fbm(x / 9, y / 9, 5, 2) - 0.5;
      const i = (y * 1024 + x) * 4;
      d[i] += n * 10 + n2 * 4; d[i + 1] += n * 6 + n2 * 4; d[i + 2] += n * 6 + n2 * 3;
    }
    c.putImageData(id, 0, 0);
    const blob = (d, r, col) => {
      const [x, y] = this.dirPx(d);
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
    };
    for (const sx of [-1, 1]) {
      blob(new V3(0.5 * sx, -0.28, 0.82), 55, P.blush);
      blob(new V3(0.34 * sx, -0.02, 0.92), 26, 'rgba(150,90,80,0.10)'); // soft socket tone
    }
    blob(new V3(0, -0.2, 0.98), 20, 'rgba(220,120,110,0.10)'); // nose tip warmth
    if (P.stubble) {
      // stubble shadow around jaw / upper lip
      const id2 = c.getImageData(0, 0, 1024, 512); const e = id2.data;
      for (let y = 0; y < 512; y++) for (let x = 0; x < 1024; x++) {
        const phi = x / 1024 * Math.PI * 2, th = y / 512 * Math.PI;
        const dx = -Math.cos(phi) * Math.sin(th), dz = Math.sin(phi) * Math.sin(th), dy = Math.cos(th);
        let w = sstep(-0.32, -0.6, dy) * sstep(-0.2, 0.3, dz);
        if (dy < -0.3 && dy > -0.42 && Math.abs(dx) < 0.25 && dz > 0.8) w = Math.max(w, 0.8);
        if (Math.abs(dx) < 0.15 && dy < -0.38 && dy > -0.62 && dz > 0.8) w *= 0.5; // lips area lighter
        const r = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
        const k = w * (0.25 + 0.2 * Math.abs(r)) * P.stubble;
        const i = (y * 1024 + x) * 4;
        e[i] *= 1 - k * 0.55; e[i + 1] *= 1 - k * 0.6; e[i + 2] *= 1 - k * 0.6;
      }
      c.putImageData(id2, 0, 0);
    }
  }
  draw(s) {
    const c = this.ctx, P = this.P;
    c.drawImage(this.base, 0, 0);
    const [cx, cy] = this.dirPx(new V3(0, -0.46, 0.89));
    const sc = 163 / P.hx * 0.001; // px per mm
    const hw = (P.mouthW * s.wide * (1 - 0.35 * s.round) + 0.004 * Math.max(0, s.smile)) * 1000 * sc;
    const open = s.open * P.mouthW * 1000 * sc * 0.9 * (1 + 0.4 * s.round);
    const curve = s.smile * 0.006 * 1000 * sc;
    const lipT = 0.0032 * 1000 * sc, lipB = 0.0045 * 1000 * sc;
    c.save();
    c.translate(cx, cy); c.rotate(s.tilt * 0.15);
    // corners
    const cyc = -curve;               // corner y (up = negative)
    const topY = -open * 0.35, botY = open * 0.65;
    // inner mouth
    if (open > 0.6) {
      c.beginPath();
      c.moveTo(-hw * 0.92, cyc);
      c.bezierCurveTo(-hw * 0.5, topY - curve * 0.2, hw * 0.5, topY - curve * 0.2, hw * 0.92, cyc);
      c.bezierCurveTo(hw * 0.6, botY + curve * 0.4, -hw * 0.6, botY + curve * 0.4, -hw * 0.92, cyc);
      c.closePath();
      const g = c.createLinearGradient(0, topY, 0, botY);
      g.addColorStop(0, '#3a1212'); g.addColorStop(1, '#5c1d1d');
      c.fillStyle = g; c.fill();
      c.save(); c.clip();
      // teeth (upper)
      c.fillStyle = '#efe9df';
      c.beginPath(); c.ellipse(0, topY - open * 0.05, hw * 0.62, open * 0.28, 0, 0, Math.PI * 2); c.fill();
      // tongue
      c.fillStyle = '#c45a5a';
      c.beginPath(); c.ellipse(0, botY, hw * 0.55, open * 0.4, 0, 0, Math.PI * 2); c.fill();
      c.restore();
    }
    // lips
    c.fillStyle = P.lip;
    c.shadowColor = P.lip; c.shadowBlur = 3;
    c.beginPath(); // upper lip
    c.moveTo(-hw, cyc);
    c.bezierCurveTo(-hw * 0.6, topY - lipT * 0.9, -hw * 0.2, topY - lipT * 1.25, 0, topY - lipT * 0.85);
    c.bezierCurveTo(hw * 0.2, topY - lipT * 1.25, hw * 0.6, topY - lipT * 0.9, hw, cyc);
    c.bezierCurveTo(hw * 0.5, topY - curve * 0.3, -hw * 0.5, topY - curve * 0.3, -hw, cyc);
    c.fill();
    c.beginPath(); // lower lip
    c.moveTo(-hw, cyc);
    c.bezierCurveTo(-hw * 0.5, botY + curve * 0.4, hw * 0.5, botY + curve * 0.4, hw, cyc);
    c.bezierCurveTo(hw * 0.6, botY + lipB * 1.2 + curve * 0.2, -hw * 0.6, botY + lipB * 1.2 + curve * 0.2, -hw, cyc);
    c.fill();
    c.shadowBlur = 0;
    if (open <= 0.6) { // lip line
      c.strokeStyle = 'rgba(90,30,30,0.85)'; c.lineWidth = 1.4;
      c.beginPath(); c.moveTo(-hw, cyc); c.bezierCurveTo(-hw * 0.5, -curve * 0.3, hw * 0.5, -curve * 0.3, hw, cyc); c.stroke();
    }
    // lower-lip highlight
    c.fillStyle = 'rgba(255,230,225,0.22)';
    c.beginPath(); c.ellipse(0, botY + lipB * 0.55, hw * 0.3, lipB * 0.25, 0, 0, Math.PI * 2); c.fill();
    // corner dimples on smile
    if (s.smile > 0.3) {
      c.strokeStyle = 'rgba(140,80,70,0.35)'; c.lineWidth = 1.2;
      for (const sx of [-1, 1]) { c.beginPath(); c.arc(sx * (hw + 4), cyc - 2, 5, sx > 0 ? -0.9 : Math.PI - 0.6, sx > 0 ? 0.6 : Math.PI + 0.9); c.stroke(); }
    }
    c.restore();
    this.tex.needsUpdate = true;
  }
  update(s) {
    const l = this.last;
    if (l && Math.abs(l.open - s.open) < 0.01 && Math.abs(l.smile - s.smile) < 0.01 && Math.abs(l.round - s.round) < 0.01 && Math.abs(l.wide - s.wide) < 0.01 && Math.abs(l.tilt - s.tilt) < 0.01) return;
    this.last = Object.assign({}, s);
    this.draw(s);
  }
}

// ------------------------------------------------------------ expressions
const EXPR = {
  neutral: { smile: 0.15, open: 0, round: 0, wide: 1, brow: 0, browIn: 0, lid: 0, squint: 0, tilt: 0 },
  smile: { smile: 0.8, open: 0.05, round: 0, wide: 1.05, brow: 0.1, browIn: 0, lid: 0, squint: 0.35, tilt: 0 },
  laugh: { smile: 1.0, open: 0.75, round: 0, wide: 1.1, brow: 0.35, browIn: 0, lid: 0, squint: 0.6, tilt: 0 },
  wow: { smile: 0.2, open: 0.6, round: 0.9, wide: 0.85, brow: 1.0, browIn: 0, lid: 0.45, squint: 0, tilt: 0 },
  huh: { smile: -0.1, open: 0.12, round: 0.5, wide: 0.8, brow: 0.6, browIn: 0.0, lid: 0.15, squint: 0, tilt: 1 },
  focus: { smile: 0.0, open: 0.0, round: 0, wide: 0.85, brow: -0.35, browIn: -0.2, lid: -0.1, squint: 0.25, tilt: 0 },
  effort: { smile: 0.25, open: 0.0, round: 0, wide: 0.9, brow: -0.2, browIn: 0.1, lid: -0.1, squint: 0.3, tilt: 0.3 },
  cold: { smile: -0.35, open: 0.18, round: 0, wide: 1.1, brow: 0.4, browIn: 0.9, lid: 0.0, squint: 0.1, tilt: 0 },
  frozen: { smile: -0.2, open: 0.3, round: 0.2, wide: 1.15, brow: 0.9, browIn: 0.7, lid: 0.3, squint: 0, tilt: 0 },
  oops: { smile: 0.35, open: 0.25, round: 0.2, wide: 1.1, brow: 0.7, browIn: 0.6, lid: 0.1, squint: 0.1, tilt: 0.5 },
  proud: { smile: 0.9, open: 0.0, round: 0, wide: 1.1, brow: 0.2, browIn: 0, lid: -0.05, squint: 0.45, tilt: 0 },
};

// ------------------------------------------------------------ person
export function buildPerson(kind) {
  const girl = kind === 'girl';
  const P = girl ? {
    hx: 0.071, hy: 0.090, hz: 0.083, cheek: 0.07, brow: 0.01, nose: 0.75, chin: 0.02, jawTaper: 0.25,
    eyeR: 0.0128, eyeX: 0.031, mouthW: 0.0185, skin: '#efc6ab', blush: 'rgba(232,118,108,0.30)', lip: '#d4847c', stubble: 0,
    hair: 0x2b1a12, brows: 0x3a2518,
  } : {
    hx: 0.077, hy: 0.112, hz: 0.098, cheek: 0.035, brow: 0.03, nose: 1.15, chin: 0.05, jawTaper: 0.12,
    eyeR: 0.0122, eyeX: 0.033, mouthW: 0.024, skin: '#dcae8e', blush: 'rgba(200,110,95,0.18)', lip: '#b8766a', stubble: 1,
    hair: 0x1d1612, brows: 0x241a14,
  };
  const S = girl ? {
    H: 1.10, hipY: 0.56, torsoLen: 0.31, shW: 0.122, hipW: 0.056, upArm: 0.165, foreArm: 0.15, thigh: 0.235, shin: 0.235,
    chest: [0.105, 0.078], waist: [0.098, 0.078], neckY: 0.325, headUp: 0.098,
  } : {
    H: 1.78, hipY: 0.95, torsoLen: 0.55, shW: 0.205, hipW: 0.1, upArm: 0.30, foreArm: 0.27, thigh: 0.44, shin: 0.45,
    chest: [0.175, 0.12], waist: [0.16, 0.115], neckY: 0.57, headUp: 0.125,
  };
  const person = { kind, P, S, joints: {}, mats: {}, meshes: [], frostable: [] };
  const root = new THREE.Group(); person.root = root;
  const hips = new THREE.Group(); hips.position.y = S.hipY; root.add(hips);
  const spine = new THREE.Group(); hips.add(spine);
  const chest = new THREE.Group(); chest.position.y = S.torsoLen * 0.45; spine.add(chest);
  const neck = new THREE.Group(); neck.position.set(0, S.neckY - S.torsoLen * 0.45, 0.005); chest.add(neck);
  const head = new THREE.Group(); head.position.set(0, S.headUp, girl ? 0.012 : 0.018); neck.add(head);
  Object.assign(person.joints, { hips, spine, chest, neck, head });
  const add = (parent, geo, mat, { shadow = true, frost = true } = {}) => {
    const m = new THREE.Mesh(geo, mat); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); person.meshes.push(m);
    if (frost) person.frostable.push(m);
    return m;
  };

  // ---- materials
  const jacketCol = girl ? 0xa8402c : 0x1e2a40;
  const M = person.mats;
  M.jacket = clothMat('nylon', jacketCol, { repeat: [5, 5], sheen: 0.5, sheenColor: girl ? 0xd08070 : 0x5070a0, ns: 0.8 });
  M.jacket.clearcoat = 0.12; M.jacket.clearcoatRoughness = 0.5;
  M.reflect = new THREE.MeshStandardMaterial({ color: 0xc8ccd0, metalness: 0.85, roughness: 0.32 });
  setMap(M.reflect, 'normalMap', tex('nylon_nrm.jpg', { repeat: [20, 2] }));
  M.pants = clothMat(girl ? 'nylon' : 'twill', girl ? 0x2e3440 : 0x40444a, { repeat: [5, 5], sheen: 0.3 });
  M.boots = pbr('rubber', { color: girl ? 0x4a2e22 : 0x1c1c1e, repeat: [2, 2], physical: true, clearcoat: 0.2, roughness: 1 });
  M.mitten = clothMat('knit', girl ? 0xcfc6b6 : 0x2c2f33, { repeat: [3, 3], sheen: 0.8 });
  M.fur = new THREE.MeshPhysicalMaterial({ color: girl ? 0xf3ece2 : 0x8a7a68, roughness: 1, sheen: 1, sheenColor: 0xffffff, sheenRoughness: 0.9 });
  setMap(M.fur, 'map', tex('fur_c.jpg', { srgb: true, repeat: [3, 3] }));
  setMap(M.fur, 'normalMap', tex('fur_nrm.jpg', { repeat: [3, 3] })); M.fur.normalScale.set(1.4, 1.4);
  M.sweater = clothMat('knit', 0xc8a36a, { repeat: [7, 7], sheen: 0.7 });
  M.hair = hairMat(P.hair);
  M.beanie = clothMat('knit', 0x3d4a3f, { repeat: [8, 4], sheen: 0.7 });
  M.zip = new THREE.MeshStandardMaterial({ color: 0x18191b, metalness: 0.6, roughness: 0.4 });

  // ---- torso (jacket + sweater variants)
  const torsoPath = line(new V3(0, -0.09 * S.H, 0), new V3(0, S.neckY + 0.005, 0), 26);
  const tRad = (puff) => (t, a) => {
    // ellipse sections: hem, waist, chest, shoulders, collar
    const keys = [[0, S.waist[0] * 1.03, S.waist[1] * 1.0], [0.22, S.waist[0], S.waist[1]], [0.55, S.chest[0], S.chest[1]], [0.8, S.chest[0] * 1.06, S.chest[1] * 0.98], [0.92, S.chest[0] * 0.78, S.chest[1] * 0.8], [1, S.chest[0] * 0.42, S.chest[1] * 0.5]];
    let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
    const k0 = keys[i], k1 = keys[i + 1], f = sstep(k0[0], k1[0], t);
    let rx = lerp(k0[1], k1[1], f) + puff, rz = lerp(k0[2], k1[2], f) + puff;
    // flatter back, rounder front belly for a child
    if (Math.sin(a) < 0) rz *= girl ? 0.93 : 0.9;
    return [rx, rz];
  };
  const jacketTorso = loft(torsoPath, tRad(girl ? 0.02 : 0.025), { seg: 40, up: new V3(1, 0, 0), vScale: 4, uRepeat: 3, mod: both(quilt(girl ? 0.065 : 0.1, 0.06), wrinkle(0.05, 1)) });
  const jT = add(spine, jacketTorso, M.jacket);
  const sweaterTorso = loft(torsoPath, tRad(0.004), { seg: 36, up: new V3(1, 0, 0), vScale: 4, uRepeat: 3, mod: wrinkle(0.06, 2, 4, 7) });
  const sT = add(spine, sweaterTorso, M.sweater);
  // reflective bands + zipper + collar with fur hood trim
  for (const by of girl ? [0.12, 0.22] : [0.2, 0.36]) {
    const band = loft(line(new V3(0, by, 0), new V3(0, by + (girl ? 0.022 : 0.035), 0), 2), (t) => { const r = tRad(girl ? 0.023 : 0.028)(by / (S.neckY + 0.09 * S.H) + 0.2, 0); return [r[0], r[1]]; }, { seg: 40, capStart: false, capEnd: false, up: new V3(1, 0, 0) });
    person.jacketParts = person.jacketParts || [];
    person.jacketParts.push(add(spine, band, M.reflect));
  }
  const zip = add(spine, new THREE.BoxGeometry(0.008, S.neckY + 0.06 * S.H, 0.006), M.zip);
  zip.position.set(0, (S.neckY - 0.09 * S.H) / 2, S.waist[1] + (girl ? 0.024 : 0.03)); zip.scale.set(1, 0.92, 1);
  const collar = add(spine, loft(line(new V3(0, S.neckY - 0.02, 0), new V3(0, S.neckY + (girl ? 0.05 : 0.07), 0), 4), () => [girl ? 0.055 : 0.075, girl ? 0.05 : 0.07], { seg: 28, capStart: false, capEnd: false, up: new V3(1, 0, 0), mod: wrinkle(0.08, 3) }), M.jacket);
  collar.material = M.jacket;
  const furTrim = add(spine, new THREE.TorusGeometry(girl ? 0.07 : 0.095, girl ? 0.022 : 0.026, 10, 28), M.fur);
  furTrim.rotation.x = Math.PI / 2 + 0.5; furTrim.position.set(0, S.neckY + 0.0, -0.035);
  person.jacketParts.push(jT, zip, collar, furTrim);
  person.sweaterParts = [sT];
  // neck (skin)
  const skin = skinMat(null, P.skin);
  M.skinPlain = skin;
  const neckM = add(neck, new THREE.CylinderGeometry(girl ? 0.03 : 0.045, girl ? 0.034 : 0.05, 0.1, 16), skin);
  neckM.position.y = 0.04;

  // ---- head
  const face = new FaceCanvas(P);
  person.face = face;
  M.skin = skinMat(face.tex, P.skin);
  const headGeo = buildHeadGeo(P);
  const headMesh = add(head, headGeo, M.skin);
  headMesh.morphTargetInfluences = [0, 0];
  person.headMesh = headMesh;
  // ears (dad only visible below beanie / girl hidden by hair+muffs)
  for (const sx of [-1, 1]) {
    const ear = add(head, new THREE.SphereGeometry(1, 16, 12), skin);
    ear.scale.set(0.008, 0.026 * (girl ? 0.85 : 1), 0.018); ear.position.set(sx * P.hx * 0.98, -0.006, -0.008); ear.rotation.y = sx * 0.4;
  }
  // eyes
  const eyeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.2 });
  setMap(eyeMat, 'map', tex('iris_c.jpg', { srgb: true, clamp: true }));
  const eyeGeo = new THREE.SphereGeometry(P.eyeR, 32, 24);
  {
    const pa = eyeGeo.attributes.position, uv = eyeGeo.attributes.uv;
    const k = 0.97 / (girl ? 0.6 : 0.52);
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i) / P.eyeR, y = pa.getY(i) / P.eyeR, z = pa.getZ(i) / P.eyeR;
      if (z > 0) uv.setXY(i, 0.5 + x * 0.5 * k, 0.5 + y * 0.5 * k); else uv.setXY(i, 0.02, 0.02);
    }
  }
  person.eyes = []; person.lids = [];
  const lidMat = skinMat(null, P.skin);
  const lashMat = new THREE.MeshStandardMaterial({ color: 0x120a08, roughness: 0.8 });
  const browMat = hairMat(P.brows);
  for (const sx of [-1, 1]) {
    const dir = new V3(0.34 * sx, 0.03, 0.90).normalize();
    const surf = headSurf(dir, P);
    const ec = new THREE.Group();
    ec.position.copy(surf).addScaledVector(new V3(0, 0, 1), -P.eyeR * 0.62);
    ec.position.x = sx * P.eyeX;
    head.add(ec);
    const eye = add(ec, eyeGeo, eyeMat, { shadow: false, frost: false });
    person.eyes.push(eye);
    const lidR = P.eyeR * 1.1;
    const up = new THREE.Group(); ec.add(up);
    add(up, new THREE.SphereGeometry(lidR, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), lidMat, { shadow: false });
    const lash = add(up, new THREE.TorusGeometry(lidR, girl ? 0.0011 : 0.0008, 5, 24, Math.PI * 0.9), lashMat, { shadow: false, frost: false });
    lash.rotation.x = Math.PI / 2; lash.rotation.z = Math.PI * 0.05; lash.position.y = 0.0004;
    if (girl) { // little upward flick of lashes
      const fl = add(up, new THREE.TorusGeometry(lidR * 1.04, 0.0009, 4, 12, Math.PI * 0.35), lashMat, { shadow: false, frost: false });
      fl.rotation.x = Math.PI / 2 - 0.25; fl.rotation.z = sx > 0 ? -0.1 : Math.PI * 0.75;
    }
    const lo = new THREE.Group(); ec.add(lo);
    add(lo, new THREE.SphereGeometry(lidR * 0.99, 28, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), lidMat, { shadow: false });
    person.lids.push({ up, lo, sx });
    // brow: curved tube
    const bc = surf.clone().addScaledVector(new V3(0, 1, 0), P.eyeR * 1.5).addScaledVector(new V3(0, 0, 1), 0.004);
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8 - 0.5;
      pts.push(new V3(bc.x + t * (girl ? 0.032 : 0.04) * sx * -1 + sx * 0.004, bc.y + (0.25 - t * t) * 0.012 - (sx * t > 0 ? 0 : 0.002) + (t * sx < 0 ? 0.002 : 0), bc.z - Math.abs(t * sx + 0.5 * 0) * 0.01 - (t * t) * 0.02));
    }
    const browG = new THREE.Group(); head.add(browG);
    const bt = add(browG, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, girl ? 0.0026 : 0.0042, 6, false), browMat, { shadow: false });
    bt.scale.set(1, 1, 0.6);
    person.lids[person.lids.length - 1].brow = browG;
    person.lids[person.lids.length - 1].browBase = browG.position.clone();
  }

  // ---- hair (girl: shoulder-length bob with bangs; dad: short sides under a beanie)
  const hairGroup = new THREE.Group(); head.add(hairGroup);
  {
    // scalp cap: inflated head with faces only in the hair region
    const cap = new THREE.SphereGeometry(1, 64, 40);
    const pa = cap.attributes.position;
    const keep = [];
    for (let i = 0; i < pa.count; i++) {
      const d = new V3(pa.getX(i), pa.getY(i), pa.getZ(i));
      const sp = headSurf(d, P);
      const front = d.z;
      // hairline: forehead at y>0.38 in front, temples, behind ears
      const line = front > 0.3 ? 0.42 - (1 - Math.abs(d.x)) * 0.05 : (front > -0.2 ? 0.12 : -0.55);
      const inHair = d.y > line - (girl ? 0 : 0.15) + (front > 0.3 ? 0 : 0) || (front < -0.1 && d.y > -0.7);
      keep.push(inHair);
      const off = girl ? 1.06 + 0.03 * Math.max(0, d.y) : 1.025;
      pa.setXYZ(i, sp.x * off, sp.y * off + (girl ? 0.004 : 0), sp.z * off - (girl ? 0.003 : 0));
    }
    const idx = cap.index.array, ni = [];
    for (let i = 0; i < idx.length; i += 3) if (keep[idx[i]] && keep[idx[i + 1]] && keep[idx[i + 2]]) ni.push(idx[i], idx[i + 1], idx[i + 2]);
    cap.setIndex(ni); cap.computeVertexNormals();
    add(hairGroup, cap, M.hair, { shadow: true });
  }
  if (girl) {
    const rng = mulberry(7);
    // a clump follows the scalp along a meridian, then falls straight with a soft flare (bob cut)
    const scalp = (th, ph, off) => {
      const d = new V3(Math.sin(th) * Math.sin(ph), Math.cos(th), Math.sin(th) * Math.cos(ph));
      return headSurf(d, P).multiplyScalar(off);
    };
    const clump = (ph, th0, th1, fall, w, off = 1.07) => {
      const pts = [];
      const n = 12;
      for (let i = 0; i <= n; i++) { const t = i / n; pts.push(scalp(th0 + (th1 - th0) * t, ph + (rng() - 0.5) * 0.02, off + t * 0.015)); }
      const last = pts[pts.length - 1].clone();
      const out = new V3(Math.sin(ph), 0, Math.cos(ph));
      for (let i = 1; i <= 6; i++) { const t = i / 6; pts.push(last.clone().add(new V3(0, -fall * t, 0)).addScaledVector(out, 0.012 * t * t + (rng() - 0.5) * 0.002)); }
      const g = loft(curve(pts, 26), (t) => [w * 0.42 * (1 - t * 0.5), w * (1 - Math.pow(t, 3) * 0.7)], { seg: 8, vScale: 6, up: out, capStart: false });
      add(hairGroup, g, M.hair, { shadow: true });
    };
    // back and sides: meridians all around except the face
    for (let i = 0; i < 34; i++) {
      const ph = Math.PI * 0.30 + (i / 33) * Math.PI * 1.40 + (rng() - 0.5) * 0.04;
      const side = Math.abs(Math.sin(ph));
      const th1 = Math.PI * (0.62 + 0.08 * side);
      clump(ph, 0.12 + rng() * 0.1, th1, 0.07 + rng() * 0.03 + (1 - side) * 0.03, 0.017 + rng() * 0.004);
    }
    // bangs: crown -> forehead, ending just above the brows
    for (let i = 0; i < 12; i++) {
      const ph = (i / 11 - 0.5) * 1.3 + (rng() - 0.5) * 0.05;
      clump(ph, 0.15 + rng() * 0.08, 1.02 - Math.abs(ph) * 0.12 + rng() * 0.04, 0.0, 0.016 + rng() * 0.003, 1.08);
    }
  }  } else {
    // beanie with folded cuff
    const bn = loft(curve([new V3(0, 0.01, -0.008), new V3(0, 0.07, -0.004), new V3(0, 0.12, 0)], 10), (t) => {
      const r = Math.cos(t * Math.PI * 0.48);
      return [P.hx * 1.13 * (0.25 + 0.75 * r), P.hz * 1.08 * (0.25 + 0.75 * r)];
    }, { seg: 32, capStart: false, capEnd: true, vScale: 8, up: new V3(1, 0, 0), mod: wrinkle(0.05, 9) });
    add(head, bn, M.beanie);
    const cuff = add(head, new THREE.TorusGeometry(P.hx * 1.12, 0.014, 10, 32), M.beanie);
    cuff.rotation.x = Math.PI / 2; cuff.scale.set(1, P.hz / P.hx, 1.2); cuff.position.y = 0.022;
    person.hat = cuff;
  }

  // ---- earmuffs (girl): band + two fluffy muffs
  if (girl) {
    const muffs = new THREE.Group(); head.add(muffs);
    const bandMat = new THREE.MeshPhysicalMaterial({ color: 0xe8e0d4, roughness: 0.45, clearcoat: 0.3 });
    const band = add(muffs, new THREE.TorusGeometry(P.hx * 1.32, 0.0045, 8, 40, Math.PI), bandMat);
    band.scale.set(1, (P.hy * 1.22) / (P.hx * 1.32), 1); band.position.set(0, 0.002, -0.012); band.rotation.y = 0.15;
    for (const sx of [-1, 1]) {
      const m = add(muffs, new THREE.SphereGeometry(0.036, 24, 16), M.fur);
      m.scale.set(0.62, 1, 0.95); m.position.set(sx * (P.hx * 1.18), -0.012, -0.008);
    }
    person.muffs = muffs;
  }

  // ---- arms (IK chains)
  person.arms = [];
  for (const sx of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(sx * S.shW, S.neckY - S.torsoLen * 0.45 - (girl ? 0.05 : 0.08), 0); chest.add(sh);
    const elbow = new THREE.Group(); elbow.position.y = -S.upArm; sh.add(elbow);
    const wrist = new THREE.Group(); wrist.position.y = -S.foreArm; elbow.add(wrist);
    const r1 = girl ? 0.042 : 0.058, r2 = girl ? 0.038 : 0.052;
    const up = add(sh, loft(line(new V3(0, 0.01, 0), new V3(0, -S.upArm, 0), 10), (t) => [r1 * (1 - 0.12 * t), r1 * (1 - 0.12 * t)], { seg: 20, vScale: 5, uRepeat: 2, mod: both(quilt(girl ? 0.045 : 0.07, 0.07), wrinkle(0.06, sx + 5)) }), M.jacket);
    const lo = add(elbow, loft(line(new V3(0, 0.02, 0), new V3(0, -S.foreArm + 0.01, 0), 10), (t) => [r2 * (1 - 0.15 * t), r2 * (1 - 0.15 * t)], { seg: 20, vScale: 5, uRepeat: 2, mod: both(quilt(girl ? 0.04 : 0.065, 0.06), wrinkle(0.07, sx + 8)) }), M.jacket);
    const cuffBand = add(elbow, loft(line(new V3(0, -S.foreArm * 0.62, 0), new V3(0, -S.foreArm * 0.62 - 0.02, 0), 1), () => [r2 * 0.97, r2 * 0.97], { seg: 20, capStart: false, capEnd: false }), M.reflect);
    const supA = add(sh, loft(line(new V3(0, 0.01, 0), new V3(0, -S.upArm, 0), 8), (t) => [r1 * 0.62, r1 * 0.62], { seg: 16, vScale: 5, mod: wrinkle(0.1, sx + 11) }), M.sweater);
    const supB = add(elbow, loft(line(new V3(0, 0.02, 0), new V3(0, -S.foreArm + 0.01, 0), 8), (t) => [r2 * 0.65, r2 * 0.65], { seg: 16, vScale: 5, mod: wrinkle(0.1, sx + 12) }), M.sweater);
    person.jacketParts.push(up, lo, cuffBand); person.sweaterParts.push(supA, supB);
    // mitten: palm + thumb
    const hand = new THREE.Group(); wrist.add(hand);
    const palm = add(hand, new THREE.SphereGeometry(1, 20, 14), M.mitten); palm.scale.set(girl ? 0.026 : 0.04, girl ? 0.05 : 0.075, girl ? 0.018 : 0.028); palm.position.y = girl ? -0.04 : -0.06;
    const th = add(hand, new THREE.SphereGeometry(1, 12, 10), M.mitten); th.scale.set(girl ? 0.011 : 0.016, girl ? 0.025 : 0.035, girl ? 0.011 : 0.016);
    th.position.set(0, girl ? -0.028 : -0.045, girl ? 0.02 : 0.03); th.rotation.x = -0.6;
    const cuffK = add(hand, new THREE.CylinderGeometry(girl ? 0.03 : 0.045, girl ? 0.028 : 0.042, 0.03, 16), M.mitten); cuffK.position.y = -0.005;
    person.arms.push({ sx, sh, elbow, wrist, hand, target: null, pole: null, w: 0, rest: new THREE.Quaternion() });
  }

  // ---- legs
  person.legs = [];
  for (const sx of [-1, 1]) {
    const hip = new THREE.Group(); hip.position.set(sx * S.hipW, -0.02, 0); hips.add(hip);
    const knee = new THREE.Group(); knee.position.y = -S.thigh; hip.add(knee);
    const ankle = new THREE.Group(); ankle.position.y = -S.shin; knee.add(ankle);
    const rt = girl ? 0.05 : 0.08, rs = girl ? 0.042 : 0.065;
    add(hip, loft(line(new V3(0, 0.04, 0), new V3(0, -S.thigh, 0), 10), (t) => [rt * (1 - 0.15 * t), rt * (1 - 0.18 * t)], { seg: 22, vScale: 5, mod: wrinkle(0.08, sx + 21) }), M.pants);
    add(knee, loft(line(new V3(0, 0.03, 0), new V3(0, -S.shin * 0.7, 0), 8), (t) => [rs * (1 + 0.1 * t), rs * (1 + 0.08 * t)], { seg: 22, vScale: 5, mod: wrinkle(0.1, sx + 25, 3, 14) }), M.pants);
    // boot: shaft + foot
    const bh = girl ? 0.13 : 0.2;
    add(ankle, loft(line(new V3(0, bh * 0.7, 0), new V3(0, -0.02, 0.0), 6), () => [rs * 1.02, rs * 1.02], { seg: 22, vScale: 2 }), M.boots);
    const foot = add(ankle, loft(curve([new V3(0, -0.02, -0.03), new V3(0, -0.035, girl ? 0.05 : 0.08), new V3(0, -0.04, girl ? 0.1 : 0.16)], 10), (t, a) => [(girl ? 0.042 : 0.058) * (1 - 0.15 * t), (girl ? 0.034 : 0.046) * (1 - 0.3 * t)], { seg: 20, up: new V3(1, 0, 0) }), M.boots);
    const cuffF = add(ankle, new THREE.TorusGeometry(rs * 1.02, girl ? 0.014 : 0.012, 8, 20), girl ? M.fur : M.boots);
    cuffF.rotation.x = Math.PI / 2; cuffF.position.y = bh * 0.72;
    person.legs.push({ sx, hip, knee, ankle });
  }
  // foot level: ankle y = hipY - 0.02 - thigh - shin ; put soles on the ground
  const ankleY = S.hipY - 0.02 - S.thigh - S.shin;
  hips.position.y = S.hipY - ankleY + 0.04 + 0.0;

  // contact shadow blob (AO under the feet)
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), blobMaterial());
  blob.scale.set(girl ? 0.5 : 0.8, 1, girl ? 0.42 : 0.6); blob.position.y = 0.006; blob.renderOrder = 1;
  root.add(blob); person.blob = blob;

  setOutfit(person, girl ? 'sweater' : 'jacket');
  if (!girl) setOutfit(person, 'jacket');
  // animation state
  person.st = {
    expr: Object.assign({}, EXPR.neutral), exprTarget: EXPR.neutral, exprHold: 0, exprBack: 'neutral',
    blinkT: 2, blink: 0, look: new V3(0, 1, 5), lookW: 1, headTurn: new THREE.Euler(), breath: Math.random() * 6,
    shiver: 0, bounce: 0, cheer: 0, lean: 0, eyeLook: new V3(),
  };
  person.say = (name, hold = 1.5, back = 'neutral') => {
    person.st.exprTarget = EXPR[name] || EXPR.neutral; person.st.exprHold = hold; person.st.exprBack = back;
  };
  person.setBase = (name) => { person.st.exprBack = name; if (person.st.exprHold <= 0) person.st.exprTarget = EXPR[name]; };
  person.lookAt = (v, w = 1) => { person.st.look.copy(v); person.st.lookW = w; };
  person.update = (dt, t) => updatePerson(person, dt, t);
  person.mouthWorld = (out = new V3()) => person.headMesh.localToWorld(out.copy(headSurf(new V3(0, -0.46, 0.89), P)).add(new V3(0, 0, 0.01)));
  return person;
}

export function setOutfit(p, which) {
  const j = which === 'jacket';
  for (const m of p.jacketParts) m.visible = j;
  for (const m of p.sweaterParts) m.visible = !j;
  p.outfit = which;
}

function blobMaterial() {
  if (blobMaterial.m) return blobMaterial.m;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,0.75)'); gr.addColorStop(0.45, 'rgba(0,0,0,0.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  blobMaterial.m = new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, color: 0x000000, opacity: 0.85, polygonOffset: true, polygonOffsetFactor: -2 });
  return blobMaterial.m;
}
export { blobMaterial };

function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ------------------------------------------------------------ per-frame animation
const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _m = new THREE.Matrix4(), _v = new V3(), _v2 = new V3(), _v3 = new V3();
const DOWN = new V3(0, -1, 0);
function updatePerson(p, dt, t) {
  const st = p.st, J = p.joints, girl = p.kind === 'girl';
  // expression blend
  if (st.exprHold > 0) { st.exprHold -= dt; if (st.exprHold <= 0) st.exprTarget = EXPR[st.exprBack] || EXPR.neutral; }
  const e = st.expr, tg = st.exprTarget;
  for (const k in e) e[k] = damp(e[k], tg[k], 9, dt);
  // mouth
  const chatter = st.shiver > 0.3 ? (Math.sin(t * 38) > 0 ? 0.08 : 0) : 0;
  p.face.update({ open: Math.max(0, e.open + chatter), smile: e.smile, round: e.round, wide: e.wide, tilt: e.tilt * 0.4 });
  p.headMesh.morphTargetInfluences[0] = clamp(e.open + chatter, 0, 1);
  p.headMesh.morphTargetInfluences[1] = clamp(e.smile, 0, 1);
  // blink
  st.blinkT -= dt;
  if (st.blinkT < 0) { st.blink = 1; st.blinkT = 2 + Math.random() * 3.5; }
  st.blink = Math.max(0, st.blink - dt * 7);
  const bl = st.blink > 0 ? Math.sin(st.blink * Math.PI) : 0;
  for (const L of p.lids) {
    const open = -0.62 - e.lid * 0.35 + e.squint * 0.25;
    L.up.rotation.x = lerp(open, 0.22, bl);
    L.lo.rotation.x = lerp(0.72 - e.squint * 0.4, 0.5, bl);
    L.brow.position.y = L.browBase.y + e.brow * 0.006 + e.browIn * 0.0;
    L.brow.rotation.z = -L.sx * e.browIn * 0.22 + (e.tilt * (L.sx > 0 ? 0.12 : -0.04));
    L.brow.position.y += (L.sx > 0 ? 1 : -0.3) * e.tilt * 0.003;
  }
  // body: breathing + shiver + bounce
  st.breath += dt;
  const br = Math.sin(st.breath * (girl ? 1.9 : 1.4));
  J.chest.scale.set(1 + br * 0.008, 1 + br * 0.006, 1 + br * 0.012);
  const shv = st.shiver * (Math.sin(t * 47) * 0.6 + Math.sin(t * 31) * 0.4);
  J.spine.rotation.z = shv * 0.02;
  J.spine.rotation.x = st.lean;
  st.bounce = Math.max(0, st.bounce - dt);
  const hop = st.bounce > 0 ? Math.abs(Math.sin((1 - st.bounce) * Math.PI * 3)) * 0.06 * st.bounce : 0;
  J.hips.position.y = (J.hips.userData.baseY ??= J.hips.position.y) + hop + br * 0.002;
  // head look (yaw/pitch, clamped) toward st.look
  J.head.parent.updateWorldMatrix(true, false);
  const hw = _v.setFromMatrixPosition(J.head.matrixWorld);
  const loc = J.head.parent.worldToLocal(_v2.copy(st.look));
  const hpos = J.head.position;
  const dx = loc.x - hpos.x, dy = loc.y - hpos.y - 0.03, dz = loc.z - hpos.z;
  let yaw = Math.atan2(dx, dz), pitch = -Math.atan2(dy, Math.hypot(dx, dz));
  yaw = clamp(yaw, -1.1, 1.1) * st.lookW; pitch = clamp(pitch, -0.6, 0.5) * st.lookW;
  J.head.rotation.y = damp(J.head.rotation.y, yaw * 0.8, 6, dt);
  J.neck.rotation.y = damp(J.neck.rotation.y, yaw * 0.25, 6, dt);
  J.head.rotation.x = damp(J.head.rotation.x, pitch * 0.85, 6, dt);
  J.head.rotation.z = damp(J.head.rotation.z, e.tilt * 0.22 + shv * 0.04, 6, dt);
  // eyes look
  for (const ey of p.eyes) {
    ey.parent.updateWorldMatrix(true, false);
    const l = ey.parent.worldToLocal(_v3.copy(st.look));
    const ay = clamp(Math.atan2(l.x, l.z), -0.45, 0.45), ap = clamp(-Math.atan2(l.y, Math.hypot(l.x, l.z)), -0.3, 0.3);
    ey.rotation.y = damp(ey.rotation.y, ay, 14, dt); ey.rotation.x = damp(ey.rotation.x, ap, 14, dt);
  }
  // arms: IK toward targets, otherwise relaxed / cheering pose
  for (const a of p.arms) {
    if (a.target && a.w > 0.001) solveArm(p, a, a.target, a.pole);
    else {
      const ch = st.cheer;
      const restZ = a.sx * (0.12 + 0.03 * br) + a.sx * ch * 2.6;
      a.sh.rotation.set(-0.05 - ch * 0.3, 0, restZ);
      a.elbow.rotation.set(-0.35 - ch * 0.3 + (st.shiver > 0.3 ? Math.sin(t * 40) * 0.05 : 0), 0, 0);
      a.wrist.rotation.set(0, 0, 0);
    }
  }
  st.cheer = Math.max(0, st.cheer - dt * 0.8);
}

/** analytic 2-bone IK in the shoulder's parent space */
function solveArm(p, a, target, pole) {
  const S = p.S;
  const l1 = S.upArm, l2 = S.foreArm + (p.kind === 'girl' ? 0.04 : 0.06);
  const parent = a.sh.parent;
  parent.updateWorldMatrix(true, false);
  const sp = a.sh.position.clone();
  const tl = parent.worldToLocal(target.clone());
  const pl = parent.worldToLocal((pole || target.clone().add(new V3(0, -1, -0.5))).clone());
  let d = tl.clone().sub(sp); let dist = d.length();
  const maxL = (l1 + l2) * 0.995; if (dist > maxL) { d.multiplyScalar(maxL / dist); dist = maxL; }
  const dirT = d.clone().normalize();
  const cosA = clamp((l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist), -1, 1);
  const angA = Math.acos(cosA);
  const pv = pl.clone().sub(sp); pv.sub(dirT.clone().multiplyScalar(pv.dot(dirT))).normalize();
  if (pv.lengthSq() < 1e-6) pv.set(0, -1, 0);
  const elbowDir = dirT.clone().multiplyScalar(Math.cos(angA)).add(pv.clone().multiplyScalar(Math.sin(angA)));
  const E = sp.clone().add(elbowDir.clone().multiplyScalar(l1));
  // upper arm: local -Y -> elbowDir, keep twist so local +Z faces the pole side
  const q1 = new THREE.Quaternion().setFromUnitVectors(DOWN, elbowDir);
  a.sh.quaternion.copy(q1);
  // forearm in upper-arm space
  const fw = tl.clone().sub(E).normalize();
  const inv = q1.clone().invert();
  const fwl = fw.applyQuaternion(inv);
  a.elbow.quaternion.setFromUnitVectors(DOWN, fwl);
  a.wrist.rotation.set(0, 0, 0);
}

// ------------------------------------------------------------ frost overlay (dad freezes)
export function addFrost(person, field) {
  const U = { frostMap: { value: field.tex }, frostInv: { value: new THREE.Matrix4() }, frostMask: { value: tex('ice_mask.jpg') }, frostAll: { value: 0 } };
  person.frostU = U;
  const done = new Set();
  for (const m of person.frostable) {
    const mat = m.material;
    if (done.has(mat)) continue; done.add(mat);
    patch(mat, {
      key: 'frost',
      uniforms: U,
      vertexPre: `uniform mat4 frostInv; uniform sampler2D frostMap; varying vec3 vFrostP;`,
      vertex: {
        project_vertex: `
          vec4 fwp = modelMatrix * vec4(transformed, 1.0);
          vFrostP = (frostInv * fwp).xyz;
          float fA = texture2D(frostMap, vec2(atan(vFrostP.x, vFrostP.z) / 6.2831853 + 0.5, vFrostP.y / 1.9)).r;
          transformed += objectNormal * fA * 0.006;
          $`,
      },
      fragmentPre: `uniform sampler2D frostMap, frostMask; varying vec3 vFrostP;`,
      fragment: {
        roughnessmap_fragment: `$
          vec2 fuv = vec2(atan(vFrostP.x, vFrostP.z) / 6.2831853 + 0.5, vFrostP.y / 1.9);
          float fr = texture2D(frostMap, fuv).r;
          vec3 fm = texture2D(frostMask, fuv * vec2(9.0, 7.0)).rgb;
          float fk = smoothstep(0.05, 0.6, fr * (0.6 + 0.6 * fm.r));
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.86, 0.92, 0.98) * (0.85 + 0.15 * fm.r), fk);
          roughnessFactor = mix(roughnessFactor, 0.35 + 0.4 * fm.r, fk);`,
      },
    });
  }
}
