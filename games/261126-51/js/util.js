// Shared helpers: smooth swept geometry (organic tubes), noise, canvas textures, loading.
import * as THREE from 'three';

export const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
export const rand = (a = 0, b = 1) => a + Math.random() * (b - a);

// deterministic value noise (1D/2D) for cloth folds etc.
function hash(n) { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); }
export function noise2(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi + yi * 57), b = hash(xi + 1 + yi * 57), c = hash(xi + (yi + 1) * 57), d = hash(xi + 1 + (yi + 1) * 57);
  return lerp(lerp(a, b, u), lerp(c, d, u), v) * 2 - 1;
}

/** Catmull-Rom resample of control points to n points */
export function curve(points, n) {
  const c = new THREE.CatmullRomCurve3(points.map(p => p.isVector3 ? p : V3(...p)), false, 'centripetal');
  return c.getPoints(n - 1);
}

/**
 * Sweep an elliptical cross-section along a path.
 * prof(t) -> [a, b] half-widths along frame N and B.  opts.fold(t, th) -> radial scale offset.
 * Produces smooth normals (seam averaged) and uv (u around, v along * vScale).
 */
export function sweep(path, prof, opts = {}) {
  const R = opts.radial || 16, n = path.length;
  const up = opts.up || V3(0, 0, 1);
  const T = [], N = [], B = [];
  for (let i = 0; i < n; i++) {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(n - 1, i + 1)];
    T.push(b.clone().sub(a).normalize());
  }
  let nrm = up.clone().sub(T[0].clone().multiplyScalar(up.dot(T[0])));
  if (nrm.lengthSq() < 1e-6) nrm = V3(1, 0, 0).sub(T[0].clone().multiplyScalar(T[0].x));
  nrm.normalize();
  for (let i = 0; i < n; i++) {
    if (i > 0) { // parallel transport
      const q = new THREE.Quaternion().setFromUnitVectors(T[i - 1], T[i]);
      nrm = nrm.clone().applyQuaternion(q);
      nrm.sub(T[i].clone().multiplyScalar(nrm.dot(T[i]))).normalize();
    }
    N.push(nrm.clone());
    B.push(T[i].clone().cross(nrm).normalize());
  }
  let len = [0];
  for (let i = 1; i < n; i++) len.push(len[i - 1] + path[i].distanceTo(path[i - 1]));
  const L = len[n - 1] || 1;
  const pos = [], uv = [], idx = [];
  const vS = opts.vScale || 1, uS = opts.uScale || 1;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const [a, b] = prof(t);
    for (let j = 0; j <= R; j++) {
      const th = j / R * Math.PI * 2 + (opts.phase || 0);
      const f = opts.fold ? 1 + opts.fold(t, th) : 1;
      let cc = Math.cos(th), ss = Math.sin(th);
      if (opts.pow) { const e = 2 / opts.pow; cc = Math.sign(cc) * Math.pow(Math.abs(cc), e); ss = Math.sign(ss) * Math.pow(Math.abs(ss), e); }
      const ca = cc * a * f, sb = ss * b * f;
      const p = path[i];
      pos.push(p.x + N[i].x * ca + B[i].x * sb, p.y + N[i].y * ca + B[i].y * sb, p.z + N[i].z * ca + B[i].z * sb);
      uv.push(j / R * uS, len[i] / L * vS);
    }
  }
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < R; j++) {
    const a = i * (R + 1) + j, b = a + R + 1;
    idx.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  // weld seam + collapsed ends normals
  const nr = g.attributes.normal;
  for (let i = 0; i < n; i++) {
    const a = i * (R + 1), b = a + R;
    const x = nr.getX(a) + nr.getX(b), y = nr.getY(a) + nr.getY(b), z = nr.getZ(a) + nr.getZ(b);
    const l = Math.hypot(x, y, z) || 1;
    nr.setXYZ(a, x / l, y / l, z / l); nr.setXYZ(b, x / l, y / l, z / l);
  }
  for (const [i, s] of [[0, -1], [n - 1, 1]]) {
    const [a, b] = prof(i / (n - 1));
    if (Math.max(a, b) < 1e-3) for (let j = 0; j <= R; j++) nr.setXYZ(i * (R + 1) + j, T[i].x * s, T[i].y * s, T[i].z * s);
  }
  return g;
}

/** rounded-end profile helper: base(t)->[a,b], ends rounded over e0 (start) and e1 (end) fraction */
export function capped(base, e0 = 0.08, e1 = 0.08) {
  return t => {
    const [a, b] = base(t);
    let k = 1;
    if (e0 > 0 && t < e0) k = Math.sqrt(Math.max(0, 1 - Math.pow(1 - t / e0, 2)));
    if (e1 > 0 && t > 1 - e1) k = Math.min(k, Math.sqrt(Math.max(0, 1 - Math.pow(1 - (1 - t) / e1, 2))));
    return [a * k, b * k];
  };
}

/** piecewise-linear key interpolation for profiles: keys [[t, a, b], ...] */
export function keys(k) {
  return t => {
    for (let i = 0; i < k.length - 1; i++) {
      if (t <= k[i + 1][0]) {
        const u = smooth(0, 1, (t - k[i][0]) / (k[i + 1][0] - k[i][0] || 1));
        return [lerp(k[i][1], k[i + 1][1], u), lerp(k[i][2], k[i + 1][2], u)];
      }
    }
    const l = k[k.length - 1]; return [l[1], l[2]];
  };
}

export function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

export function canvasTex(c, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// ----- texture registry: start with a cheap stand-in, swap the photo-like map when it arrives
const loader = new THREE.TextureLoader();
const cache = {};
export function tex(name, { srgb = false, repeat = [1, 1] } = {}) {
  const key = name + repeat.join(',');
  if (cache[key]) return cache[key];
  const t = new THREE.Texture();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  // neutral 1px stand-in so materials compile with the map before the image loads
  const c = canvas(2, 2), g = c.getContext('2d');
  g.fillStyle = name.includes('normal') ? '#8080ff' : (name.includes('orm') ? '#ffd080' : '#9a9a96');
  g.fillRect(0, 0, 2, 2);
  t.image = c; t.needsUpdate = true;
  cache[key] = t;
  pending.push([name, t]);
  return t;
}
const pending = [];
export function loadAll(onProgress) {
  const byName = {};
  for (const [n, t] of pending) (byName[n] = byName[n] || []).push(t);
  const names = Object.keys(byName);
  let done = 0;
  return Promise.all(names.map(n => new Promise(res => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => { for (const t of byName[n]) { t.dispose(); t.image = img; t.needsUpdate = true; } done++; onProgress && onProgress(done / names.length); res(); };
    img.onerror = () => { done++; res(); };
    img.src = 'tex/' + n;
  })));
}

/** soft radial blob texture (contact shadows, glows, particles) */
let blobT = null;
export function blobTex() {
  if (blobT) return blobT;
  const c = canvas(128, 128), g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  blobT = new THREE.CanvasTexture(c);
  return blobT;
}

/** contact-shadow decal: dark soft ellipse lying on the ground */
export function contactShadow(w, d, strength = 0.6) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({
    map: blobTex(), color: 0x000000, transparent: true, opacity: strength, depthWrite: false, toneMapped: false,
  }));
  m.material.blending = THREE.NormalBlending;
  m.material.alphaMap = blobTex();
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = 1;
  m.position.y = 0.004;
  return m;
}
