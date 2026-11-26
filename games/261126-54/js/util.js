import * as THREE from 'three';

export const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
export const lerp = (a, b, t) => a + (b - a) * t;
export const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const easeOut = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
export const easeInOut = t => { t = clamp(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));

let seed = (Date.now() & 0xffffff) | 1;
export function rnd() { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return ((seed >>> 0) % 1000000) / 1000000; }
export function srand(s) { let x = s | 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 1000000) / 1000000; }; }
export const rr = (a, b) => a + (b - a) * rnd();

// --- texture loading (lazy: materials start with neutral values, maps swap in when loaded)
const loader = new THREE.TextureLoader();
const cache = {};
let maxAniso = 4;
export function setAniso(a) { maxAniso = a; }
export function tex(name, { srgb = false, repeat = [1, 1], onload } = {}) {
  const key = name + (srgb ? ':s' : '') + ':' + repeat.join(',');
  if (cache[key]) { if (onload) cache[key].userData.cbs ? cache[key].userData.cbs.push(onload) : onload(cache[key]); return cache[key]; }
  const t = new THREE.Texture();
  t.userData.cbs = onload ? [onload] : [];
  cache[key] = t;
  loader.load(new URL('../tex/' + name, import.meta.url).href, (img) => {
    t.image = img.image; t.needsUpdate = true;
    const cbs = t.userData.cbs; t.userData.cbs = null; t.userData.loaded = true;
    cbs.forEach(f => f(t));
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = maxAniso;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const pending = [];
let started = false;
// PBR material whose maps are attached when their images arrive (keeps first paint fast)
export function pbr(name, opts = {}) {
  const { repeat = [1, 1], color = 0xffffff, physical = false, noColorMap = false, normalScale = 1, aoIntensity = 1, ...rest } = opts;
  const M = physical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
  const m = new M({ color, roughness: rest.roughness ?? 0.6, metalness: rest.metalness ?? 0, ...rest });
  const job = () => {
    if (!noColorMap) tex(name + '_c.jpg', { srgb: true, repeat, onload: (t) => { m.map = t; m.needsUpdate = true; } });
    tex(name + '_n.jpg', { repeat, onload: (t) => { m.normalMap = t; m.normalScale.set(normalScale, normalScale); m.needsUpdate = true; } });
    tex(name + '_r.jpg', { repeat, onload: (t) => { m.roughnessMap = t; m.aoMap = t; m.aoMapIntensity = aoIntensity; if (rest.metalness) m.metalnessMap = t; m.needsUpdate = true; } });
  };
  if (started) job(); else pending.push(job);
  return m;
}
export function startTextureLoading() { started = true; pending.splice(0).forEach(f => f()); }

// soft radial gradient (contact shadow / AO decal)
let blobTex = null;
export function blobTexture() {
  if (blobTex) return blobTex;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.35, 'rgba(0,0,0,0.75)');
  gr.addColorStop(0.7, 'rgba(0,0,0,0.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  blobTex = new THREE.CanvasTexture(c);
  return blobTex;
}
export function contactShadow(w, d, opacity = 0.55) {
  const m = new THREE.MeshBasicMaterial({ map: blobTexture(), transparent: true, opacity, depthWrite: false, color: 0x000000, toneMapped: false });
  m.blending = THREE.MultiplyBlending; m.premultipliedAlpha = true;
  // multiply blending needs white where no shadow: use custom shader-free trick via alpha
  m.blending = THREE.NormalBlending;
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m);
  p.rotation.x = -Math.PI / 2; p.renderOrder = 1;
  p.userData.noRay = true;
  return p;
}

// geometry helpers
export function lathe(points, seg = 48) {
  const g = new THREE.LatheGeometry(points.map(p => new THREE.Vector2(p[0], p[1])), seg);
  return g;
}
// Rounded box via SDF-like vertex pushing of a subdivided box
export function roundedBox(w, h, d, r, seg = 4) {
  const g = new THREE.BoxGeometry(w, h, d, seg * 2, seg * 2, seg * 2);
  const p = g.attributes.position, v = new THREE.Vector3(), c = new THREE.Vector3();
  const hw = w / 2 - r, hh = h / 2 - r, hd = d / 2 - r;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    c.set(clamp(v.x, -hw, hw), clamp(v.y, -hh, hh), clamp(v.z, -hd, hd));
    const n = v.clone().sub(c);
    if (n.lengthSq() > 1e-12) { n.normalize().multiplyScalar(r); v.copy(c).add(n); }
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  // box UVs in meters for tiling
  const uv = g.attributes.uv, nn = g.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const ax = Math.abs(nn.getX(i)), ay = Math.abs(nn.getY(i)), az = Math.abs(nn.getZ(i));
    if (ay >= ax && ay >= az) uv.setXY(i, x, z); else if (ax >= az) uv.setXY(i, z, y); else uv.setXY(i, x, y);
  }
  g.setAttribute('uv1', g.attributes.uv.clone());
  return g;
}
export function addUV1(g) { if (!g.attributes.uv1 && g.attributes.uv) g.setAttribute('uv1', g.attributes.uv.clone()); return g; }
