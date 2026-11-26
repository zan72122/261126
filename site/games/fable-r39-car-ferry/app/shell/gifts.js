// Little presents carried on the cars' rear deck; delivered ones decorate the family's house.
import * as THREE from './three.js';
import { mergeColored, mat } from './util.js';
import { animalMaterial } from './animals.js';

export const GIFTS = ['balloon', 'present', 'flower', 'star', 'cake'];
const COLORS = [0xff5c7a, 0x4dabf7, 0xffd43b, 0x69db7c, 0xb197fc, 0xff922b];
const cache = new Map();

function starShape(r1, r2) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) { const r = i % 2 ? r2 : r1; const a = Math.PI / 2 + (i * Math.PI) / 5; if (i) s.lineTo(Math.cos(a) * r, Math.sin(a) * r); else s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  s.closePath(); return s;
}

function build(type, color) {
  const P = [];
  if (type === 'balloon') {
    P.push({ geo: new THREE.SphereGeometry(0.34, 12, 9), color, matrix: mat(0, 1.15, 0, 0, 0, 0, 1, 1.15, 1) });
    P.push({ geo: new THREE.ConeGeometry(0.07, 0.1, 6), color, matrix: mat(0, 0.75, 0, Math.PI, 0, 0) });
    P.push({ geo: new THREE.CylinderGeometry(0.012, 0.012, 0.7, 4), color: 0xffffff, matrix: mat(0, 0.36, 0) });
    P.push({ geo: new THREE.SphereGeometry(0.06, 6, 4), color: 0xffffff, matrix: mat(0.1, 1.32, 0.26) });
  } else if (type === 'present') {
    P.push({ geo: new THREE.BoxGeometry(0.6, 0.5, 0.6), color, matrix: mat(0, 0.25, 0) });
    P.push({ geo: new THREE.BoxGeometry(0.62, 0.52, 0.12), color: 0xffffff, matrix: mat(0, 0.25, 0) });
    P.push({ geo: new THREE.BoxGeometry(0.12, 0.52, 0.62), color: 0xffffff, matrix: mat(0, 0.25, 0) });
    P.push({ geo: new THREE.TorusGeometry(0.1, 0.035, 5, 10), color: 0xffffff, matrix: mat(-0.09, 0.56, 0, 0, 0, 0.5) });
    P.push({ geo: new THREE.TorusGeometry(0.1, 0.035, 5, 10), color: 0xffffff, matrix: mat(0.09, 0.56, 0, 0, 0, -0.5) });
  } else if (type === 'flower') {
    P.push({ geo: new THREE.CylinderGeometry(0.24, 0.18, 0.34, 10), color: 0xd9774a, matrix: mat(0, 0.17, 0) });
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2, x = Math.cos(a) * 0.1, z = Math.sin(a) * 0.1, h = 0.55 + i * 0.08;
      P.push({ geo: new THREE.CylinderGeometry(0.015, 0.015, h, 4), color: 0x3fa45a, matrix: mat(x, 0.34 + h / 2, z) });
      P.push({ geo: new THREE.SphereGeometry(0.11, 8, 6), color: i === 0 ? color : COLORS[(COLORS.indexOf(color) + i) % COLORS.length], matrix: mat(x, 0.34 + h, z, 0, 0, 0, 1, 0.7, 1) });
      P.push({ geo: new THREE.SphereGeometry(0.045, 5, 4), color: 0xffe066, matrix: mat(x, 0.36 + h + 0.05, z) });
    }
  } else if (type === 'star') {
    const g = new THREE.ExtrudeGeometry(starShape(0.34, 0.15), { depth: 0.1, bevelEnabled: false });
    g.translate(0, 0, -0.05);
    P.push({ geo: g, color: 0xffd43b, matrix: mat(0, 0.75, 0) });
    P.push({ geo: new THREE.CylinderGeometry(0.02, 0.02, 0.45, 4), color: 0xffffff, matrix: mat(0, 0.22, 0) });
  } else { // cake
    P.push({ geo: new THREE.CylinderGeometry(0.32, 0.32, 0.22, 14), color: 0xfff1e0, matrix: mat(0, 0.11, 0) });
    P.push({ geo: new THREE.CylinderGeometry(0.33, 0.33, 0.06, 14), color, matrix: mat(0, 0.24, 0) });
    P.push({ geo: new THREE.CylinderGeometry(0.22, 0.22, 0.18, 12), color: 0xfff1e0, matrix: mat(0, 0.36, 0) });
    P.push({ geo: new THREE.SphereGeometry(0.06, 6, 5), color: 0xe03131, matrix: mat(0, 0.5, 0) });
  }
  return mergeColored(P);
}

export function makeGift(type, color) {
  color = color ?? COLORS[Math.floor(Math.random() * COLORS.length)];
  const key = type + ':' + color;
  if (!cache.has(key)) cache.set(key, build(type, color));
  const m = new THREE.Mesh(cache.get(key), animalMaterial());
  m.userData.giftType = type;
  return m;
}
export const randomGift = () => GIFTS[Math.floor(Math.random() * GIFTS.length)];
