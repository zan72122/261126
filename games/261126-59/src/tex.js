// Texture loading + PBR material helpers.
import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const cache = {};
let maxAniso = 4;
const pending = [];
export function setAniso(a) { maxAniso = Math.min(8, a); }

// Returns a texture immediately; image arrives later. `srgb` for colour maps.
export function tex(name, { srgb = false, repeat = [1, 1] } = {}) {
  const key = name + (srgb ? ':s' : '') + repeat.join(',');
  if (cache[key]) return cache[key];
  const t = new THREE.Texture();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = maxAniso;
  const p = new Promise((res) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => { t.image = img; t.needsUpdate = true; res(); };
    img.onerror = () => res();
    img.src = 'assets/' + name + '.jpg';
  });
  // a 1x1 neutral placeholder keeps shaders valid until the image arrives


  pending.push(p);
  cache[key] = t;
  return t;
}
function placeholder(name) {
  const c = document.createElement('canvas'); c.width = c.height = 2;
  const g = c.getContext('2d');
  g.fillStyle = /nrm/.test(name) ? '#8080ff' : /arm/.test(name) ? '#ffb000' : /msk/.test(name) ? '#808080' : '#7a6a5a';
  g.fillRect(0, 0, 2, 2);
  return c;
}
export function allLoaded() { return Promise.all(pending); }

// Standard PBR material from a texture set: name_col / name_nrm / name_arm
export function pbr(name, opts = {}) {
  const rep = opts.repeat || [1, 1];
  const m = new (opts.physical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial)({
    map: tex(name + '_col', { srgb: true, repeat: rep }),
    normalMap: tex(name + '_nrm', { repeat: rep }),
    normalScale: new THREE.Vector2(opts.ns ?? 1, opts.ns ?? 1),
    roughness: opts.roughness ?? 1,
    metalness: 0,
    color: opts.color ?? 0xffffff,
  });
  if (opts.arm) {
    const a = tex(name + '_arm', { repeat: rep });
    m.roughnessMap = a; m.aoMap = a; m.aoMapIntensity = opts.ao ?? 1;
  }
  if (opts.sheen) { m.sheen = opts.sheen; m.sheenRoughness = 0.8; m.sheenColor = new THREE.Color(opts.sheenColor ?? 0xffffff); }
  if (opts.envI !== undefined) m.envMapIntensity = opts.envI;
  return m;
}

// Canvas helpers
export function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
export function canvasTex(c, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = maxAniso;
  return t;
}

// soft radial gradient (contact shadow / glow)
export function radialTex(inner = 'rgba(0,0,0,0.75)', outer = 'rgba(0,0,0,0)', size = 128) {
  const c = canvas(size, size), g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0, inner); gr.addColorStop(0.45, inner.replace(/[\d.]+\)$/, (m) => (parseFloat(m) * 0.55) + ')'));
  gr.addColorStop(1, outer);
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  return canvasTex(c);
}

// contact-shadow (AO) blob decal on the floor
export function aoBlob(w, d, strength = 0.7) {
  const m = new THREE.MeshBasicMaterial({ map: radialTex(`rgba(0,0,0,${strength})`), transparent: true, depthWrite: false, toneMapped: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m);
  mesh.rotation.x = -Math.PI / 2; mesh.position.y = 0.002; mesh.renderOrder = 1;
  return mesh;
}
