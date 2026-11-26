// Paint simulation: one canvas atlas holds paint colour+thickness for every paintable surface,
// a second small canvas holds "wetness". A patched MeshPhysicalMaterial reads both and turns the
// grey, rough, grooved boards into glossy wet paint that settles into the grain and dries to satin.
import * as THREE from 'three';
import { canvas, clamp, rand } from './util.js';

export const PPM = 200;          // atlas pixels per metre
const S = 1024, WS = 256, CELL = 8, GN = S / CELL;

export class PaintAtlas {
  constructor() {
    this.c = canvas(S, S);
    this.g = this.c.getContext('2d', { willReadFrequently: false });
    this.tex = new THREE.CanvasTexture(this.c);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.generateMipmaps = false;
    this.tex.minFilter = THREE.LinearFilter;
    this.wc = canvas(WS, WS);
    this.wg = this.wc.getContext('2d', { willReadFrequently: true });
    this.wg.fillStyle = '#000'; this.wg.fillRect(0, 0, WS, WS);
    this.wtex = new THREE.CanvasTexture(this.wc);
    this.wtex.generateMipmaps = false; this.wtex.minFilter = THREE.LinearFilter;
    this.cov = new Float32Array(GN * GN);
    this.surfs = {};
    this.stamps = {};
    this.dirty = false; this.wdirty = false;
    this.dryRate = 0.016; this.dryAcc = 0;
    this.time = { value: 0 };
  }

  /** origin = world point at surface local (0,0) (bottom-left seen from the front); u,v unit axes; w,h metres; px,py atlas position */
  addSurface(name, { origin, u, v, w, h, px, py, valid = null }) {
    const s = { name, origin, u: u.clone().normalize(), v: v.clone().normalize(), w, h, rx: px, ry: py, rw: Math.round(w * PPM), rh: Math.round(h * PPM), valid, materials: [], hint: { value: 0 } };
    s.region = new THREE.Vector4(s.rx / S, s.ry / S, s.rw / S, s.rh / S);
    s.normal = s.u.clone().cross(s.v).normalize();
    // coverage cells belonging to this surface
    s.cells = [];
    for (let gy = Math.floor(s.ry / CELL); gy < Math.ceil((s.ry + s.rh) / CELL); gy++)
      for (let gx = Math.floor(s.rx / CELL); gx < Math.ceil((s.rx + s.rw) / CELL); gx++) {
        const lu = ((gx + 0.5) * CELL - s.rx) / s.rw, lv = 1 - ((gy + 0.5) * CELL - s.ry) / s.rh;
        if (lu < 0 || lu > 1 || lv < 0 || lv > 1) continue;
        if (valid && !valid(lu * w, lv * h)) continue;
        s.cells.push(gy * GN + gx);
      }
    this.surfs[name] = s;
    return s;
  }

  toAtlas(s, p) {
    const d = p.clone().sub(s.origin);
    const lu = d.dot(s.u) / s.w, lv = d.dot(s.v) / s.h;
    return [s.rx + lu * s.rw, s.ry + (1 - lv) * s.rh, lu, lv];
  }
  fromAtlas(s, x, y) {
    const lu = (x - s.rx) / s.rw, lv = 1 - (y - s.ry) / s.rh;
    return s.origin.clone().addScaledVector(s.u, lu * s.w).addScaledVector(s.v, lv * s.h);
  }

  /** patched PBR material for a surface; base = { map, normalMap, orm, normalScale } */
  material(s, base) {
    const m = new THREE.MeshPhysicalMaterial({
      map: base.map, normalMap: base.normalMap, roughnessMap: base.orm, aoMap: base.orm, aoMapIntensity: 1.0,
      roughness: 1, metalness: 0, normalScale: new THREE.Vector2(base.ns || 1, base.ns || 1),
      clearcoat: 1, clearcoatRoughness: 0.05, color: base.color || 0xc4c4c4,
    });
    const U = {
      paintMap: { value: this.tex }, wetMap: { value: this.wtex }, pRegion: { value: s.region },
      pOrigin: { value: s.origin }, pU: { value: s.u }, pV: { value: s.v }, pSize: { value: new THREE.Vector2(s.w, s.h) },
      pHint: s.hint, pTime: this.time,
    };
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vPW;')
        .replace('#include <project_vertex>', '#include <project_vertex>\nvPW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
varying vec3 vPW;
uniform sampler2D paintMap, wetMap; uniform vec4 pRegion; uniform vec3 pOrigin, pU, pV; uniform vec2 pSize;
uniform float pHint, pTime;
float gPV, gWet, gH; vec2 gPUV;`)
        .replace('#include <map_fragment>', `#include <map_fragment>
{
  vec3 d = vPW - pOrigin;
  vec2 l = clamp(vec2(dot(d, pU) / pSize.x, dot(d, pV) / pSize.y), 0.0, 1.0);
  gPUV = vec2(pRegion.x + l.x * pRegion.z, 1.0 - (pRegion.y + (1.0 - l.y) * pRegion.w));
  vec4 pm = texture2D(paintMap, gPUV);
  gH = texture2D(roughnessMap, vRoughnessMapUv).b;
  // paint reaches the raised grain first; the grooves fill only with more passes
  float need = mix(0.12, 0.72, 1.0 - gH);
  gPV = smoothstep(need - 0.14, need + 0.06, pm.a);
  gWet = smoothstep(0.06, 0.6, texture2D(wetMap, gPUV).r);
  vec4 orm = texture2D(roughnessMap, vRoughnessMapUv);
  vec3 pc = pm.rgb * mix(0.62, 1.0, smoothstep(0.0, 0.6, gH));      // paint pooled in grain reads darker
  pc *= mix(0.55, 1.0, orm.r);                                       // cracks / gaps stay shadowed
  pc *= 0.9 + 0.2 * smoothstep(0.2, 0.9, dot(texture2D(map, vMapUv).rgb, vec3(0.33)) * 2.2); // old grain ghosts through thin paint
  pc *= mix(1.0, 0.86, gWet);                                        // wet paint is deeper in tone
  float grime = (1.0 - smoothstep(0.1, 0.55, vPW.y)) * 0.35 + smoothstep(1.85, 2.15, vPW.y) * 0.18 * step(vPW.y, 2.2);
  diffuseColor.rgb *= 1.0 - grime * (0.8 + 0.4 * orm.g);
  diffuseColor.rgb = mix(diffuseColor.rgb, pc * (1.0 - grime * 0.25), gPV);
}`)
        .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, mix(0.46 - 0.1 * gH, 0.07, gWet), gPV);`)
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
{
  normal = normalize(mix(normal, nonPerturbedNormal, gPV * 0.22));
  float e = 1.2 / 1024.0;
  float dx = texture2D(paintMap, gPUV + vec2(e, 0.0)).a - texture2D(paintMap, gPUV - vec2(e, 0.0)).a;
  float dy = texture2D(paintMap, gPUV + vec2(0.0, e)).a - texture2D(paintMap, gPUV - vec2(0.0, e)).a;
  normal = normalize(normal - (tbn[0] * dx + tbn[1] * dy) * 0.9 * gPV);
}`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
  float sh = 0.5 + 0.5 * sin(pTime * 3.0 - (vPW.x + vPW.y * 0.7 + vPW.z) * 4.0);
  totalEmissiveRadiance += pHint * (1.0 - gPV) * pow(sh, 6.0) * vec3(0.07, 0.065, 0.045);
}`)
        .replace('#include <lights_physical_fragment>', `#include <lights_physical_fragment>
material.clearcoat = gWet * gPV;
material.clearcoatRoughness = 0.04;`);
    };
    m.customProgramCacheKey = () => 'paint';
    s.materials.push(m);
    return m;
  }

  // ----- stamps (white alpha shapes; tinted copies are cached per colour)
  baseStamp(tool) {
    if (this.stamps[tool]) return this.stamps[tool];
    let w, h; const c = (W, H) => { const k = canvas(W, H); return [k, k.getContext('2d')]; };
    let cv, g;
    if (tool === 'roller') {
      w = Math.round(0.22 * PPM); h = Math.round(0.06 * PPM);
      [cv, g] = c(w, h);
      const id = g.createImageData(w, h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const ex = Math.min(x, w - 1 - x) / 4, ey = Math.min(y, h - 1 - y) / 3;
        const edge = clamp(Math.min(ex, ey), 0, 1);
        const a = edge * (0.55 + 0.45 * Math.random()) * (0.85 + 0.15 * Math.sin(x * 0.9));
        const i = (y * w + x) * 4; id.data[i] = id.data[i + 1] = id.data[i + 2] = 255; id.data[i + 3] = a * 255;
      }
      g.putImageData(id, 0, 0);
    } else if (tool === 'brush' || tool === 'rag') {
      w = Math.round((tool === 'rag' ? 0.12 : 0.1) * PPM); h = Math.round(0.035 * PPM);
      [cv, g] = c(w, h);
      const id = g.createImageData(w, h);
      const col = []; for (let x = 0; x < w; x++) col.push(Math.random() < 0.15 ? 0.25 : 0.6 + 0.4 * Math.random());
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const ex = Math.min(x, w - 1 - x) / 3, ey = Math.min(y, h - 1 - y) / 2.5;
        const a = clamp(Math.min(ex, ey), 0, 1) * col[x];
        const i = (y * w + x) * 4; id.data[i] = id.data[i + 1] = id.data[i + 2] = 255; id.data[i + 3] = a * 255;
      }
      g.putImageData(id, 0, 0);
    } else {
      const sz = Math.round((tool === 'hand' ? 0.16 : 0.13) * PPM);
      [cv, g] = c(sz, sz); w = h = sz;
      g.fillStyle = '#fff';
      g.translate(sz / 2, sz / 2); const k = sz / 100;
      g.scale(k, k);
      if (tool === 'hand') {
        g.beginPath(); g.ellipse(0, 14, 26, 30, 0, 0, Math.PI * 2); g.fill();
        const f = [[-24, -12, -0.55, 22], [-11, -30, -0.15, 30], [3, -34, 0.02, 32], [16, -30, 0.18, 29], [27, -16, 0.42, 22]];
        for (const [x, y, r, l] of f) { g.save(); g.translate(x, y + 8); g.rotate(r); g.beginPath(); g.ellipse(0, -l / 2 + 6, 6.8, l / 2 + 2, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
        g.save(); g.translate(-30, 18); g.rotate(-1.1); g.beginPath(); g.ellipse(0, -10, 7.5, 16, 0, 0, Math.PI * 2); g.fill(); g.restore();
      } else if (tool === 'flower') {
        for (let i = 0; i < 5; i++) { g.save(); g.rotate(i * Math.PI * 2 / 5); g.beginPath(); g.ellipse(0, -24, 14, 22, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
        g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(0, 0, 9, 0, Math.PI * 2); g.fill();
        g.globalCompositeOperation = 'source-over'; g.globalAlpha = 0.9; g.beginPath(); g.arc(0, 0, 6, 0, Math.PI * 2); g.fill();
      } else if (tool === 'leaf') {
        g.beginPath(); g.moveTo(0, 44); g.bezierCurveTo(40, 10, 30, -30, 0, -46); g.bezierCurveTo(-30, -30, -40, 10, 0, 44); g.fill();
        g.globalCompositeOperation = 'destination-out'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 40); g.lineTo(0, -38); g.stroke();
      } else if (tool === 'dots') {
        for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, r = i % 2 ? 30 : 16; g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, 7 + (i % 3) * 2, 0, Math.PI * 2); g.fill(); }
        g.beginPath(); g.arc(0, 0, 8, 0, Math.PI * 2); g.fill();
      }
      g.setTransform(1, 0, 0, 1, 0, 0);
      // mottle like a real print: paint does not transfer evenly
      g.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < sz * 3; i++) { g.globalAlpha = Math.random() * 0.35; g.fillRect(Math.random() * sz, Math.random() * sz, 1 + Math.random() * 3, 1 + Math.random() * 3); }
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    }
    return (this.stamps[tool] = { c: cv, w, h, tinted: {} });
  }
  tinted(tool, col) {
    const b = this.baseStamp(tool);
    if (b.tinted[col]) return b.tinted[col];
    const k = canvas(b.w, b.h), g = k.getContext('2d');
    g.drawImage(b.c, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, b.w, b.h);
    return (b.tinted[col] = k);
  }

  stampAt(s, x, y, rot, tool, col, alpha) {
    const b = this.baseStamp(tool), img = this.tinted(tool, col);
    const g = this.g;
    g.save();
    g.beginPath(); g.rect(s.rx, s.ry, s.rw, s.rh); g.clip();
    g.translate(x, y); g.rotate(rot); g.globalAlpha = alpha;
    g.drawImage(img, -b.w / 2, -b.h / 2);
    g.restore();
    // wetness
    const k = WS / S, wg = this.wg;
    wg.save(); wg.beginPath(); wg.rect(s.rx * k, s.ry * k, s.rw * k, s.rh * k); wg.clip();
    wg.translate(x * k, y * k); wg.rotate(rot); wg.globalAlpha = Math.min(1, alpha * 2.5);
    wg.drawImage(b.c, -b.w * k / 2, -b.h * k / 2, b.w * k, b.h * k);
    wg.restore();
    // coverage estimate
    const r = Math.max(b.w, b.h) * 0.42;
    const add = alpha * 0.55;
    for (let gy = Math.floor((y - r) / CELL); gy <= Math.floor((y + r) / CELL); gy++)
      for (let gx = Math.floor((x - r) / CELL); gx <= Math.floor((x + r) / CELL); gx++) {
        if (gx < 0 || gy < 0 || gx >= GN || gy >= GN) continue;
        const cx = (gx + 0.5) * CELL - x, cy = (gy + 0.5) * CELL - y;
        // rotate into stamp frame
        const lx = cx * Math.cos(-rot) - cy * Math.sin(-rot), ly = cx * Math.sin(-rot) + cy * Math.cos(-rot);
        if (Math.abs(lx) > b.w / 2 || Math.abs(ly) > b.h / 2 + CELL * 0.5) continue;
        const i = gy * GN + gx;
        this.cov[i] = 1 - (1 - this.cov[i]) * (1 - add);
      }
    this.dirty = this.wdirty = true;
  }

  /** paint along a world-space segment on surface s. returns atlas distance painted */
  stroke(s, p0, p1, tool, col, load) {
    const [x0, y0] = this.toAtlas(s, p0), [x1, y1] = this.toAtlas(s, p1);
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
    const b = this.baseStamp(tool);
    const step = Math.max(1.2, b.h * 0.28);
    const n = Math.max(1, Math.ceil(L / step));
    const rot = L > 0.01 ? Math.atan2(-dx, dy) : (s.lastRot || 0);
    s.lastRot = rot;
    const base = tool === 'roller' ? 0.3 : 0.34;
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      this.stampAt(s, x0 + dx * t, y0 + dy * t, rot + rand(-0.03, 0.03), tool, col, base * load * rand(0.8, 1.1));
    }
    return L / PPM;
  }

  /** single print (hand / flower / leaf / dots) */
  print(s, p, tool, col) {
    const [x, y] = this.toAtlas(s, p);
    this.stampAt(s, x, y, rand(-0.25, 0.25), tool, col, 0.95);
    this.stampAt(s, x + rand(-1, 1), y + rand(-1, 1), rand(-0.02, 0.02), tool, col, 0.5);
  }

  coverage(s) {
    let t = 0; for (const i of s.cells) t += Math.min(1, this.cov[i] / 0.85);
    return s.cells.length ? t / s.cells.length : 1;
  }
  /** world point of the least painted spot on surface s (for the pointing-hand hint) */
  emptiest(s) {
    let best = -1, bv = 9;
    for (let k = 0; k < s.cells.length; k += 3) {
      const i = s.cells[k];
      // neighbourhood average
      let v = 0, n = 0;
      for (let oy = -3; oy <= 3; oy++) for (let ox = -3; ox <= 3; ox++) { const j = i + oy * GN + ox; if (j >= 0 && j < this.cov.length) { v += this.cov[j]; n++; } }
      v /= n;
      if (v < bv) { bv = v; best = i; }
    }
    if (best < 0) return null;
    return this.fromAtlas(s, (best % GN + 0.5) * CELL, (Math.floor(best / GN) + 0.5) * CELL);
  }

  update(dt) {
    this.time.value += dt;
    this.dryAcc += dt;
    const dec = Math.floor(this.dryRate * 255 * this.dryAcc);
    if (this.dryAcc > 0.25 && dec >= 1) {
      const id = this.wg.getImageData(0, 0, WS, WS), d = id.data;
      for (let i = 0; i < d.length; i += 4) { const v = d[i] - dec; d[i] = d[i + 1] = d[i + 2] = v > 0 ? v : 0; }
      this.wg.putImageData(id, 0, 0);
      this.dryAcc = 0; this.wdirty = true;
    }
    if (this.dirty) { this.tex.needsUpdate = true; this.dirty = false; }
    if (this.wdirty) { this.wtex.needsUpdate = true; this.wdirty = false; }
  }
}
