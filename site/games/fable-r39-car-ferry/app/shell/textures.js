import * as THREE from './three.js';

/** Image textures. file:// uses data URIs from assets/textures.classic.js (Chrome refuses file:// images in WebGL). */
const all = new Set();
export function trackTexture(t) { all.add(t); return t; }
export function allTextures() { return all; }

export function loadTexture(name, { repeat = true, srgb = true, anisotropy = 1, onLoad } = {}) {
  const tex = new THREE.Texture();
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { tex.wrapS = tex.wrapT = THREE.RepeatWrapping; }
  tex.anisotropy = anisotropy;
  tex.userData.name = name;
  const img = new Image();
  const embedded = window.__FERRY_TEX && window.__FERRY_TEX[name];
  img.decoding = 'async';
  img.onload = () => { tex.image = img; tex.needsUpdate = true; onLoad && onLoad(tex); };
  img.onerror = () => { console.warn('texture failed', name); };
  img.src = embedded || ('assets/' + name);
  return trackTexture(tex);
}

function canvasTex(w, h, draw, { srgb = true, repeat = false } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return trackTexture(t);
}

/** soft round blob shadow 64² */
export const makeBlobTexture = () => canvasTex(64, 64, (g, w, h) => {
  const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  r.addColorStop(0, 'rgba(0,0,0,0.55)'); r.addColorStop(0.55, 'rgba(0,0,0,0.3)'); r.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = r; g.fillRect(0, 0, w, h);
}, { srgb: false });

/** glowing ring 128² (hint marker on the ground) */
export const makeRingTexture = () => canvasTex(128, 128, (g, w, h) => {
  const r = g.createRadialGradient(w / 2, h / 2, w * 0.18, w / 2, h / 2, w / 2);
  r.addColorStop(0, 'rgba(255,255,255,0)'); r.addColorStop(0.55, 'rgba(255,255,255,0.95)');
  r.addColorStop(0.7, 'rgba(255,255,255,0.55)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, w, h);
});

/** cloud 256×128 */
export const makeCloudTexture = () => canvasTex(256, 128, (g, w, h) => {
  const blobs = [[0.3, 0.62, 0.22], [0.5, 0.48, 0.3], [0.7, 0.6, 0.22], [0.42, 0.66, 0.2], [0.6, 0.7, 0.2], [0.2, 0.72, 0.14], [0.8, 0.72, 0.14]];
  for (const [x, y, r] of blobs) {
    const gr = g.createRadialGradient(x * w, y * h, 0, x * w, y * h, r * w);
    gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.75)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }
});

/** particle atlas 512×64: heart, star, droplet, puff, ring (cells of 64²), white so instance colors tint it */
export const makeParticleAtlas = () => canvasTex(512, 64, (g) => {
  g.fillStyle = '#fff';
  // heart
  g.save(); g.translate(32, 34); g.beginPath();
  g.moveTo(0, 20); g.bezierCurveTo(-30, 0, -22, -24, 0, -10); g.bezierCurveTo(22, -24, 30, 0, 0, 20); g.fill(); g.restore();
  // star
  g.save(); g.translate(96, 34); g.beginPath();
  for (let i = 0; i < 10; i++) { const r = i % 2 ? 11 : 26; const a = -Math.PI / 2 + (i * Math.PI) / 5; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  g.closePath(); g.fill(); g.restore();
  // droplet
  g.save(); g.translate(160, 36); g.beginPath(); g.moveTo(0, -24); g.bezierCurveTo(16, -4, 18, 20, 0, 20); g.bezierCurveTo(-18, 20, -16, -4, 0, -24); g.fill(); g.restore();
  // puff
  const r = g.createRadialGradient(224, 32, 0, 224, 32, 30);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.6, 'rgba(255,255,255,0.6)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(192, 0, 64, 64);
  // ring
  const q = g.createRadialGradient(288, 32, 8, 288, 32, 31);
  q.addColorStop(0, 'rgba(255,255,255,0)'); q.addColorStop(0.6, 'rgba(255,255,255,1)'); q.addColorStop(0.78, 'rgba(255,255,255,0.6)'); q.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = q; g.fillRect(256, 0, 64, 64);
});

/** vertical alpha for the far town billboard: fades the top 12% into the sky */
export const makeFadeAlpha = () => canvasTex(4, 64, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#000'); gr.addColorStop(0.12, '#fff'); gr.addColorStop(1, '#fff');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
}, { srgb: false });

/** foam ring for the wake 64² */
export const makeFoamTexture = () => canvasTex(64, 64, (g, w, h) => {
  const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  r.addColorStop(0, 'rgba(255,255,255,0.0)'); r.addColorStop(0.5, 'rgba(255,255,255,0.55)');
  r.addColorStop(0.75, 'rgba(255,255,255,0.35)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, w, h);
});
