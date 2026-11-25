// Simple, round, friendly animals (merged vertex-colored geometry, one material for all).
import * as THREE from './three.js';
import { mergeColored, mat, clamp } from './util.js';

export const SPECIES = ['bear', 'rabbit', 'cat', 'dog', 'panda', 'pig'];

const PAL = {
  bear: { fur: 0xb07a4a, muzzle: 0xf3dcb5, ear: 0xe3a978, nose: 0x3a2618 },
  rabbit: { fur: 0xfaf6f0, muzzle: 0xffffff, ear: 0xffb6c8, nose: 0xff7d9a },
  cat: { fur: 0xf6a24a, muzzle: 0xfff3e0, ear: 0xffc8a8, nose: 0xff8a8a },
  dog: { fur: 0xecd3a6, muzzle: 0xffffff, ear: 0x8d5b36, nose: 0x3a2618 },
  panda: { fur: 0xffffff, muzzle: 0xffffff, ear: 0x2b2b2b, nose: 0x2b2b2b },
  pig: { fur: 0xffb7c5, muzzle: 0xff9db2, ear: 0xff9db2, nose: 0xe0708a },
};
const EYE = 0x262626, CHEEK = 0xff8fa3, WHITE = 0xffffff;

let material = null;
export function animalMaterial() {
  if (!material) material = new THREE.MeshLambertMaterial({ vertexColors: true });
  return material;
}

/** head parts centered at (0, hy, 0), radius r, facing +Z */
function headParts(species, r, hy) {
  const p = PAL[species]; const parts = [];
  const S = (rad, w, h) => new THREE.SphereGeometry(rad, w, h);
  parts.push({ geo: S(r, 11, 8), color: p.fur, matrix: mat(0, hy, 0, 0, 0, 0, 1.08, 0.96, 1) });
  // muzzle
  const mz = species === 'pig' ? 0.34 : 0.42;
  parts.push({ geo: S(r * mz, 7, 5), color: p.muzzle, matrix: mat(0, hy - r * 0.28, r * 0.78, 0, 0, 0, 1.25, 0.85, 0.7) });
  // nose
  if (species === 'pig') {
    parts.push({ geo: S(r * 0.07, 5, 4), color: 0x9a3a55, matrix: mat(-r * 0.12, hy - r * 0.26, r * 1.02) });
    parts.push({ geo: S(r * 0.07, 5, 4), color: 0x9a3a55, matrix: mat(r * 0.12, hy - r * 0.26, r * 1.02) });
  } else {
    parts.push({ geo: S(r * 0.12, 5, 3), color: p.nose, matrix: mat(0, hy - r * 0.16, r * 1.04, 0, 0, 0, 1.3, 0.9, 0.8) });
  }
  // eyes (+ panda patches) with a tiny highlight
  for (const sx of [-1, 1]) {
    if (species === 'panda') parts.push({ geo: S(r * 0.22, 7, 5), color: 0x2b2b2b, matrix: mat(sx * r * 0.36, hy + r * 0.08, r * 0.8, 0, 0, sx * 0.5, 1, 1.3, 0.5) });
    parts.push({ geo: S(r * 0.11, 6, 4), color: EYE, matrix: mat(sx * r * 0.36, hy + r * 0.1, r * 0.9, 0, 0, 0, 1, 1.2, 0.7) });
    parts.push({ geo: S(r * 0.04, 4, 3), color: WHITE, matrix: mat(sx * r * 0.36 + r * 0.035, hy + r * 0.16, r * 0.98) });
    // cheeks
    parts.push({ geo: S(r * 0.14, 5, 3), color: CHEEK, matrix: mat(sx * r * 0.62, hy - r * 0.22, r * 0.72, 0, sx * 0.6, 0, 1, 0.7, 0.35) });
  }
  // smile
  const smile = new THREE.TorusGeometry(r * 0.13, r * 0.025, 3, 8, Math.PI);
  parts.push({ geo: smile, color: EYE, matrix: mat(0, hy - r * 0.38, r * 1.0, 0, 0, Math.PI) });
  // ears
  for (const sx of [-1, 1]) {
    if (species === 'bear' || species === 'panda') {
      parts.push({ geo: S(r * 0.3, 7, 5), color: species === 'panda' ? p.ear : p.fur, matrix: mat(sx * r * 0.7, hy + r * 0.72, 0, 0, 0, 0, 1, 1, 0.6) });
      if (species === 'bear') parts.push({ geo: S(r * 0.17, 6, 4), color: p.ear, matrix: mat(sx * r * 0.7, hy + r * 0.72, r * 0.12, 0, 0, 0, 1, 1, 0.5) });
    } else if (species === 'rabbit') {
      parts.push({ geo: S(r * 0.24, 7, 6), color: p.fur, matrix: mat(sx * r * 0.36, hy + r * 1.45, -r * 0.05, 0, 0, -sx * 0.16, 0.85, 3.0, 0.55) });
      parts.push({ geo: S(r * 0.15, 6, 5), color: p.ear, matrix: mat(sx * r * 0.36, hy + r * 1.42, r * 0.06, 0, 0, -sx * 0.16, 0.7, 2.7, 0.3) });
    } else if (species === 'cat') {
      const c = new THREE.ConeGeometry(r * 0.32, r * 0.55, 4);
      parts.push({ geo: c, color: p.fur, matrix: mat(sx * r * 0.56, hy + r * 0.86, 0, 0, Math.PI / 4, -sx * 0.35) });
      const c2 = new THREE.ConeGeometry(r * 0.18, r * 0.34, 4);
      parts.push({ geo: c2, color: p.ear, matrix: mat(sx * r * 0.54, hy + r * 0.84, r * 0.1, 0, Math.PI / 4, -sx * 0.35) });
    } else if (species === 'dog') {
      parts.push({ geo: S(r * 0.3, 7, 5), color: p.ear, matrix: mat(sx * r * 0.95, hy + r * 0.05, 0, 0, 0, sx * 0.3, 0.55, 1.35, 0.8) });
    } else if (species === 'pig') {
      const c = new THREE.ConeGeometry(r * 0.26, r * 0.38, 4);
      parts.push({ geo: c, color: p.ear, matrix: mat(sx * r * 0.55, hy + r * 0.85, r * 0.1, 0.5, Math.PI / 4, -sx * 0.4) });
    }
  }
  return parts;
}

const cache = new Map();
function geoFor(species, kind) {
  const key = species + ':' + kind;
  if (cache.has(key)) return cache.get(key);
  const p = PAL[species] || PAL.bear; let out;
  if (kind === 'driver') {
    // shoulders + head, origin at the neck base
    const parts = [{ geo: new THREE.SphereGeometry(0.3, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), color: p.fur, matrix: mat(0, -0.05, 0, 0, 0, 0, 1.1, 0.9, 0.85) }];
    parts.push(...headParts(species, 0.3, 0.42));
    out = { body: mergeColored(parts) };
  } else {
    // family member: body + head + feet, origin at the feet; arms separately (they wave)
    const r = 0.36;
    const parts = [
      { geo: new THREE.SphereGeometry(0.36, 12, 8), color: p.fur, matrix: mat(0, 0.48, 0, 0, 0, 0, 1, 1.15, 0.9) },
      { geo: new THREE.SphereGeometry(0.24, 8, 6), color: p.muzzle, matrix: mat(0, 0.46, 0.2, 0, 0, 0, 1, 1.15, 0.6) },
      { geo: new THREE.SphereGeometry(0.13, 7, 5), color: species === 'panda' ? 0x2b2b2b : p.fur, matrix: mat(-0.16, 0.08, 0.06, 0, 0, 0, 1.1, 0.7, 1.3) },
      { geo: new THREE.SphereGeometry(0.13, 7, 5), color: species === 'panda' ? 0x2b2b2b : p.fur, matrix: mat(0.16, 0.08, 0.06, 0, 0, 0, 1.1, 0.7, 1.3) },
    ];
    parts.push(...headParts(species, r, 1.12));
    const arm = mergeColored([{ geo: new THREE.SphereGeometry(0.1, 7, 5), color: species === 'panda' ? 0x2b2b2b : p.fur, matrix: mat(0, -0.17, 0, 0, 0, 0, 1, 2.0, 1) }]);
    out = { body: mergeColored(parts), arm };
  }
  cache.set(key, out);
  return out;
}

/** driver for a car (opts.makeDriver) */
export function makeDriver(species) {
  const g = geoFor(SPECIES.includes(species) ? species : 'bear', 'driver');
  const m = new THREE.Mesh(g.body, animalMaterial());
  m.name = 'driver:' + species;
  return m;
}

/** family member with waving arms. size ~ 1 (adult) / 0.72 (child) */
export class Animal {
  constructor(species, size = 1, seed = 0) {
    const g = geoFor(species, 'family');
    this.species = species;
    this.object = new THREE.Group();
    this.inner = new THREE.Group(); this.object.add(this.inner);
    this.inner.scale.setScalar(size);
    this.body = new THREE.Mesh(g.body, animalMaterial()); this.inner.add(this.body);
    this.arms = [-1, 1].map((sx) => {
      const pivot = new THREE.Group(); pivot.position.set(sx * 0.34, 0.68, 0.02);
      const a = new THREE.Mesh(g.arm, animalMaterial()); pivot.add(a); this.inner.add(pivot);
      pivot.userData.sx = sx; return pivot;
    });
    this.phase = seed * 1.7;
    this.waveT = 0; this.jumpT = 0; this.jumps = 0; this.lookAt = null; this.size = size;
  }
  wave(sec = 2.5) { this.waveT = Math.max(this.waveT, sec); }
  jump(n = 2) { if (this.jumpT <= 0) { this.jumps = n; this.jumpT = 0.0001; } else this.jumps = Math.max(this.jumps, n); }
  update(t, dt) {
    const idle = Math.sin(t * 2.2 + this.phase);
    let y = 0, squash = 1 + idle * 0.02;
    if (this.jumpT > 0) {
      this.jumpT += dt; const per = 0.45; const k = this.jumpT / per;
      if (k >= 1) { this.jumps--; this.jumpT = this.jumps > 0 ? 0.0001 : 0; }
      else { y = Math.sin(k * Math.PI) * 0.45; squash = 1 + Math.sin(k * Math.PI) * 0.08; }
    }
    this.inner.position.y = y * this.size;
    this.inner.scale.set(this.size / Math.sqrt(squash), this.size * squash, this.size / Math.sqrt(squash));
    const w = clamp(this.waveT, 0, 1);
    if (this.waveT > 0) this.waveT -= dt;
    for (const a of this.arms) {
      const sx = a.userData.sx;
      const rest = sx * 0.35 + idle * 0.05 * sx;
      const up = sx * (2.5 + Math.sin(t * 10 + (sx > 0 ? 0 : 1.2)) * 0.45);
      a.rotation.z = rest + (up - rest) * w;
    }
  }
}
