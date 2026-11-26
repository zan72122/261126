import * as THREE from 'three';

// Textures come from window.SNOW_TEX (base64, made by tools/build.mjs) so WebGL can use them from file://.
const SRC = () => window.SNOW_TEX || {};

function decode(name) {
  const url = SRC()[name];
  if (!url) return Promise.reject(new Error('texture missing: ' + name));
  const img = new Image();
  img.src = url;
  return (img.decode ? img.decode() : new Promise((r, j) => { img.onload = r; img.onerror = j; })).then(() => img);
}

function photoTexture(img, renderer, repeat = 1) {
  const t = new THREE.Texture(img);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  t.needsUpdate = true;
  return t;
}

// Backdrop: fade the top of the park photo to transparent so it blends into the sky gradient.
function parkTexture(img) {
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  g.globalCompositeOperation = 'destination-out';
  const grad = g.createLinearGradient(0, 0, 0, c.height * 0.45);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(0.55, 'rgba(0,0,0,0.85)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad; g.fillRect(0, 0, c.width, c.height * 0.45);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.MirroredRepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

export function flakeTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.45, 'rgba(255,255,255,0.85)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function blobTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(60,80,120,0.45)'); r.addColorStop(0.6, 'rgba(60,80,120,0.2)'); r.addColorStop(1, 'rgba(60,80,120,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export async function loadTextures(renderer) {
  const names = ['snow_fresh_1024', 'snow_packed_1024', 'plow_paint_1024', 'sled_plastic_1024', 'snow_fresh_512', 'snowy_park_512'];
  const imgs = await Promise.all(names.map(decode));
  const m = Object.fromEntries(names.map((n, i) => [n, imgs[i]]));
  return {
    hero: {
      snowFresh: photoTexture(m.snow_fresh_1024, renderer),
      snowPacked: photoTexture(m.snow_packed_1024, renderer),
      plowPaint: photoTexture(m.plow_paint_1024, renderer),
      sledPlastic: photoTexture(m.sled_plastic_1024, renderer),
    },
    shell: {
      ground: photoTexture(m.snow_fresh_512, renderer, 1),
      park: parkTexture(m.snowy_park_512),
    },
  };
}
