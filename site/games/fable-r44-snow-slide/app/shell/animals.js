import * as THREE from 'three';
import { mergeGeometries } from '../vendor/three/BufferGeometryUtils.js';
import { blobTexture } from './textures.js';

// Round plush animals with simple faces (two dot eyes, pink cheeks). Not realistic, never scary.
// Each animal = 4 meshes (body, head, armL, armR) with vertex colors -> 4 draw calls.
// Local frame: origin at the feet, +Y up, +Z = facing direction. Standing height ≈ 0.8 m (SCALE 1.2).
const SCALE = 1.2;

export const SPECIES = ['bear', 'rabbit', 'cat', 'penguin', 'fox'];

const DEF = {
  bear: { body: 0xb07a52, light: 0xf0d6b8, inner: 0xe6b894, scarf: 0xff6f91 },
  rabbit: { body: 0xf6f2ee, light: 0xffffff, inner: 0xffb3c4, scarf: 0x58a6ff },
  cat: { body: 0xf2a65a, light: 0xfff1dc, inner: 0xffc2b0, scarf: 0x6fcf6f },
  penguin: { body: 0x3a4670, light: 0xffffff, inner: 0xffa53a, scarf: 0xffcf3a },
  fox: { body: 0xec7a3c, light: 0xfff4ea, inner: 0x5a3a2a, scarf: 0xb07cff },
};
const EYE = 0x2b2433, CHEEK = 0xff9fb2, NOSE = 0x3a2a2a;

function piece(geo, color, m) {
  geo.deleteAttribute('uv');
  if (m) geo.applyMatrix4(m);
  const c = new THREE.Color(color), n = geo.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(a, 3));
  return geo.index ? geo : geo;
}
const M = (x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) =>
  new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));
const sph = (r, w = 12, h = 9) => new THREE.SphereGeometry(r, w, h);

function buildParts(kind) {
  const d = DEF[kind];
  const body = [], head = [], arm = [];
  // body (pear shape) + belly + feet
  body.push(piece(sph(0.2, 14, 10), d.body, M(0, 0.21, 0, 1, 1.05, 0.92)));
  body.push(piece(sph(0.14, 12, 8), d.light, M(0, 0.2, 0.08, 1, 1.05, 0.7)));
  for (const s of [-1, 1]) body.push(piece(sph(0.075, 10, 7), kind === 'penguin' ? 0xffa53a : d.body, M(s * 0.095, 0.045, 0.06, 1, 0.65, 1.3)));
  body.push(piece(new THREE.TorusGeometry(0.135, 0.04, 6, 16), d.scarf, M(0, 0.375, 0, 1, 1, 1, Math.PI / 2)));
  body.push(piece(new THREE.BoxGeometry(0.07, 0.13, 0.03), d.scarf, M(0.07, 0.31, 0.13, 1, 1, 1, 0.1, 0, 0.2)));
  // tails
  if (kind === 'bear' || kind === 'rabbit') body.push(piece(sph(0.055, 8, 6), d.light, M(0, 0.13, -0.19)));
  if (kind === 'cat') body.push(piece(new THREE.CapsuleGeometry(0.035, 0.22, 3, 6), d.body, M(0.05, 0.2, -0.2, 1, 1, 1, -0.6, 0, -0.3)));
  if (kind === 'fox') {
    body.push(piece(new THREE.CapsuleGeometry(0.07, 0.16, 3, 8), d.body, M(0.06, 0.16, -0.22, 1, 1, 1, -0.9, 0, -0.35)));
    body.push(piece(sph(0.065, 8, 6), d.light, M(0.1, 0.25, -0.32)));
  }

  // head (pivot at neck y=0.4): coordinates relative to the pivot
  const hy = 0.17;
  head.push(piece(sph(0.19, 16, 12), d.body, M(0, hy, 0, 1.06, 0.96, 1)));
  if (kind !== 'penguin') head.push(piece(sph(0.085, 12, 8), d.light, M(0, hy - 0.055, 0.15, 1.2, 0.85, 0.8)));
  else head.push(piece(sph(0.15, 12, 9), d.light, M(0, hy - 0.01, 0.07, 1.05, 0.95, 0.85)));
  // eyes + highlight
  for (const s of [-1, 1]) {
    head.push(piece(sph(0.027, 8, 6), EYE, M(s * 0.072, hy + 0.025, 0.172, 1, 1.15, 0.7)));
    head.push(piece(sph(0.009, 5, 4), 0xffffff, M(s * 0.072 + 0.008, hy + 0.038, 0.19)));
    head.push(piece(sph(0.032, 8, 6), CHEEK, M(s * 0.115, hy - 0.04, 0.145, 1, 0.65, 0.5)));
  }
  if (kind === 'penguin') head.push(piece(new THREE.ConeGeometry(0.035, 0.07, 8), 0xffa53a, M(0, hy - 0.035, 0.2, 1, 1, 1, Math.PI / 2)));
  else head.push(piece(sph(0.026, 8, 6), kind === 'rabbit' || kind === 'cat' ? 0xff8fa8 : NOSE, M(0, hy - 0.03, 0.215, 1.2, 0.85, 0.8)));
  // ears
  for (const s of [-1, 1]) {
    if (kind === 'bear') {
      head.push(piece(sph(0.065, 10, 7), d.body, M(s * 0.135, hy + 0.15, -0.01, 1, 1, 0.6)));
      head.push(piece(sph(0.038, 8, 6), d.inner, M(s * 0.135, hy + 0.15, 0.02, 1, 1, 0.4)));
    } else if (kind === 'rabbit') {
      head.push(piece(new THREE.CapsuleGeometry(0.048, 0.2, 3, 8), d.body, M(s * 0.075, hy + 0.3, -0.02, 1, 1, 0.6, 0, 0, -s * 0.18)));
      head.push(piece(new THREE.CapsuleGeometry(0.026, 0.16, 3, 6), d.inner, M(s * 0.077, hy + 0.3, 0.008, 1, 1, 0.4, 0, 0, -s * 0.18)));
    } else if (kind === 'cat' || kind === 'fox') {
      const big = kind === 'fox' ? 1.3 : 1;
      head.push(piece(new THREE.ConeGeometry(0.065 * big, 0.12 * big, 4), d.body, M(s * 0.11, hy + 0.17, 0, 1, 1, 0.6, 0, Math.PI / 4, -s * 0.25)));
      head.push(piece(new THREE.ConeGeometry(0.035 * big, 0.07 * big, 4), d.inner, M(s * 0.11, hy + 0.16 + (kind === 'fox' ? 0.04 : 0), 0.02, 1, 1, 0.4, 0, Math.PI / 4, -s * 0.25)));
    }
  }
  // arm (pivot at shoulder): hangs down
  arm.push(piece(new THREE.CapsuleGeometry(0.045, 0.1, 3, 8), d.body, M(0, -0.08, 0)));
  arm.push(piece(sph(0.05, 8, 6), kind === 'penguin' ? d.body : d.light, M(0, -0.15, 0.005)));
  return { body: mergeGeometries(body), head: mergeGeometries(head), arm: mergeGeometries(arm) };
}

// Soft round shadow on the ground (shared texture / geometry / material): used for spectators instead of
// real shadow casting, which costs 4 more draw calls per animal in the shadow pass.
let blob = null;
function blobParts() {
  if (!blob) {
    const geo = new THREE.PlaneGeometry(0.95, 0.95).rotateX(-Math.PI / 2);
    const map = blobTexture();
    const mat = new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
    blob = { geo, mat, map };
  }
  return blob;
}

const cache = new Map();
function partsFor(kind) {
  if (!cache.has(kind)) cache.set(kind, buildParts(kind));
  return cache.get(kind);
}

export function createAnimal(kind, { shadows = true } = {}) {
  const g = partsFor(kind);
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0xffd86b, emissiveIntensity: 0 });
  const root = new THREE.Group(); root.name = 'animal.' + kind;
  const inner = new THREE.Group(); inner.scale.setScalar(SCALE); root.add(inner);
  const body = new THREE.Mesh(g.body, mat);
  const headPivot = new THREE.Group(); headPivot.position.set(0, 0.4, 0);
  const head = new THREE.Mesh(g.head, mat); headPivot.add(head);
  const armL = new THREE.Group(), armR = new THREE.Group();
  armL.position.set(0.17, 0.33, 0.01); armR.position.set(-0.17, 0.33, 0.01);
  armL.add(new THREE.Mesh(g.arm, mat)); armR.add(new THREE.Mesh(g.arm, mat));
  inner.add(body, headPivot, armL, armR);
  root.traverse((o) => { if (o.isMesh) { o.castShadow = shadows; } });

  // invisible, generous hit box for taps
  const pick = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.2), new THREE.MeshBasicMaterial({ visible: false }));
  pick.position.y = 0.55; root.add(pick);

  const st = { pose: 'idle', t: Math.random() * 10, glow: 0, poseT: 0, spin: 0 };
  const lerp = (a, b, k) => a + (b - a) * k;

  return {
    kind, root, pick,
    get pose() { return st.pose; },
    setPose(p) { if (st.pose !== p) { st.pose = p; st.poseT = 0; } },
    setGlow(v) { st.glow = v; },
    useBlobShadow() {
      if (root.userData.blob) return;
      root.traverse((o) => { if (o.isMesh) o.castShadow = false; });
      const b = blobParts();
      const m = new THREE.Mesh(b.geo, b.mat); m.position.y = 0.02; m.renderOrder = 1;
      root.add(m); root.userData.blob = m;
    },
    update(dt) {
      st.t += dt; st.poseT += dt;
      const t = st.t, k = Math.min(1, dt * 12);
      let y = 0, roll = 0, lz = 0.15, rz = -0.15, lx = 0, rx = 0, hz = Math.sin(t * 0.8) * 0.06, hx = 0, spinV = 0;
      switch (st.pose) {
        case 'wave': rz = -2.5 + Math.sin(t * 9) * 0.45; hz = 0.15; y = Math.abs(Math.sin(t * 3)) * 0.02; break;
        case 'cheer': lz = 2.6; rz = -2.6; lz += Math.sin(t * 10) * 0.15; rz -= Math.sin(t * 10) * 0.15; y = Math.abs(Math.sin(t * 6)) * 0.03; hx = -0.15; break;
        case 'clap': lz = 0.5; rz = -0.5; lx = rx = -1.3; { const c = Math.sin(t * 16) * 0.35; lz += c; rz -= c; } y = Math.abs(Math.sin(t * 8)) * 0.02; break;
        case 'hold': lz = 0.6; rz = -0.6; lx = rx = -0.9; hx = 0.08; break;
        case 'jump': { const u = (t * 1.8) % 1; y = Math.sin(u * Math.PI) * 0.28; lz = 2.4; rz = -2.4; hx = -0.2; break; }
        case 'spin': { const u = (t * 1.6) % 1; y = Math.sin(u * Math.PI) * 0.32; lz = 2.2; rz = -2.2; spinV = 9; break; }
        case 'walk': y = Math.abs(Math.sin(t * 9)) * 0.06; roll = Math.sin(t * 9) * 0.14; lx = Math.sin(t * 9) * 0.6; rx = -lx; break;
        case 'hop': { const u = (t * 2.2) % 1; y = u < 0.3 ? Math.sin((u / 0.3) * Math.PI) * 0.16 : 0; rz = u < 0.5 ? -2.4 + Math.sin(t * 12) * 0.4 : -0.3; break; }
        default: y = Math.sin(t * 2) * 0.008; if ((t % 6) < 1.2) { rz = -2.3 + Math.sin(t * 9) * 0.4; } break; // idle: breathe + a little wave now and then
      }
      inner.position.y = lerp(inner.position.y, y * SCALE, k);
      inner.rotation.z = lerp(inner.rotation.z, roll, k);
      if (spinV) st.spin += spinV * dt; else st.spin = lerp(st.spin, Math.round(st.spin / (Math.PI * 2)) * Math.PI * 2, k * 0.5);
      inner.rotation.y = st.spin;
      armL.rotation.z = lerp(armL.rotation.z, lz, k); armR.rotation.z = lerp(armR.rotation.z, rz, k);
      armL.rotation.x = lerp(armL.rotation.x, lx, k); armR.rotation.x = lerp(armR.rotation.x, rx, k);
      headPivot.rotation.z = lerp(headPivot.rotation.z, hz, k); headPivot.rotation.x = lerp(headPivot.rotation.x, hx, k);
      mat.emissiveIntensity = st.glow > 0 ? st.glow * (0.25 + 0.2 * Math.sin(t * 6)) : 0;
    },
    dispose() {
      if (root.parent) root.parent.remove(root);
      mat.dispose(); pick.geometry.dispose(); pick.material.dispose();
      // geometries are cached per species and shared; kept for reuse
    },
  };
}
