// テクスチャ：http(s) では app/assets の JPEG、file:// では base64 版（assets/tex-data.js）を使う。
// （Chrome は file:// の画像を WebGL に渡せないため）
import * as THREE from '../vendor/three.module.min.js';

export const TEX_FILES = {
  ice: 'shaved_ice-1024.jpg',
  enamel: 'machine_enamel-512.jpg',
  wood: 'wood_counter-512.jpg',
  shop: 'kakigori_shop-512.jpg',
};

function urlFor(name) {
  const file = TEX_FILES[name];
  const data = window.KAKI_TEX && window.KAKI_TEX[file];
  if (location.protocol === 'file:' && data) return data;
  return 'assets/' + file;
}

// すべて読み込み終わるか、timeout で先へ進む（届かない物は後から現れる）
export function loadTextures(renderer, onError) {
  const loader = new THREE.TextureLoader();
  const maxAniso = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const out = {};
  const promises = Object.keys(TEX_FILES).map((name) => new Promise((resolve) => {
    const t = loader.load(urlFor(name), () => resolve(t), undefined, (e) => { onError && onError('texture ' + name); resolve(t); });
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = name === 'shop' ? 1 : maxAniso;
    t.name = name;
    out[name] = t;
  }));
  return { textures: out, ready: Promise.all(promises) };
}

// 手続きの Canvas テクスチャ（小さく）
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function makeProcTextures() {
  const blob = canvasTex(64, 64, (g, w) => {
    const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    r.addColorStop(0, 'rgba(60,40,20,0.55)'); r.addColorStop(0.55, 'rgba(60,40,20,0.25)'); r.addColorStop(1, 'rgba(60,40,20,0)');
    g.fillStyle = r; g.fillRect(0, 0, w, w);
  });
  const glow = canvasTex(64, 64, (g, w) => {
    const r = g.createRadialGradient(w / 2, w / 2, w * 0.18, w / 2, w / 2, w / 2);
    r.addColorStop(0, 'rgba(255,255,255,0)'); r.addColorStop(0.55, 'rgba(255,250,200,0.9)'); r.addColorStop(1, 'rgba(255,240,160,0)');
    g.fillStyle = r; g.fillRect(0, 0, w, w);
  });
  const heart = canvasTex(64, 64, (g, w) => {
    g.fillStyle = '#ff5c8a'; g.beginPath();
    g.moveTo(32, 54); g.bezierCurveTo(4, 36, 6, 10, 22, 10); g.bezierCurveTo(28, 10, 32, 16, 32, 20);
    g.bezierCurveTo(32, 16, 36, 10, 42, 10); g.bezierCurveTo(58, 10, 60, 36, 32, 54); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.ellipse(22, 22, 5, 3.5, -0.6, 0, Math.PI * 2); g.fill();
  });
  const noren = canvasTex(256, 64, (g, w, h) => {
    g.fillStyle = '#2f6fb3'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 3;
    for (let y = 10; y < h + 10; y += 14) { g.beginPath(); for (let x = 0; x <= w; x += 4) g.lineTo(x, y + Math.sin(x / 10) * 4); g.stroke(); }
    g.fillStyle = 'rgba(0,0,0,0.25)'; for (let x = 0; x < w; x += 64) g.fillRect(x, 0, 2, h);
  });
  for (const t of [blob, glow, heart]) t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  noren.wrapS = THREE.RepeatWrapping;
  return { blob, glow, heart, noren };
}
