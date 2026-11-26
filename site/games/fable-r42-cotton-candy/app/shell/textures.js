// テクスチャ：app/assets の JPEG はビルドで data URI として埋め込まれる（file:// でも WebGL に貼れる）。
import cottonUrl from '../assets/cotton_fiber_1024.jpg';
import woodUrl from '../assets/wood_512.jpg';
import steelUrl from '../assets/steel_512.jpg';
import awningUrl from '../assets/awning_512.jpg';
import festivalUrl from '../assets/festival_512.jpg';

const URLS = { cottonFiber: cottonUrl, wood: woodUrl, steel: steelUrl, awning: awningUrl, festival: festivalUrl };

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image load failed'));
    img.src = url;
  });
}

export async function loadTextures(THREE, renderer) {
  const names = Object.keys(URLS);
  const imgs = await Promise.all(names.map(n => loadImage(URLS[n])));
  const aniso = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const out = {};
  names.forEach((n, i) => {
    const t = new THREE.Texture(imgs[i]);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = n === 'festival' ? 1 : aniso;
    t.name = n;
    t.needsUpdate = true;
    out[n] = t;
  });
  out.festival.wrapS = out.festival.wrapT = THREE.ClampToEdgeWrapping;
  // 手続きテクスチャ
  out.blob = blobTexture(THREE);
  out.spinner = spinnerTexture(THREE);
  out.glow = glowTexture(THREE);
  return out;
}

function canvas(n) { const c = document.createElement('canvas'); c.width = c.height = n; return c; }

// 疑似影のぼかし円（白→透明。色は material で黒にする）
function blobTexture(THREE) {
  const c = canvas(128), g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  gr.addColorStop(0, 'rgba(255,255,255,0.85)');
  gr.addColorStop(0.55, 'rgba(255,255,255,0.35)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.name = 'blob';
  return t;
}

// 回転頭の放射縞（回っているのが見える）
function spinnerTexture(THREE) {
  const c = canvas(256), g = c.getContext('2d');
  g.fillStyle = '#c9ccd2'; g.fillRect(0, 0, 256, 256);
  g.translate(128, 128);
  for (let i = 0; i < 12; i++) {
    g.rotate(Math.PI / 6);
    g.fillStyle = i % 2 ? '#f2f3f6' : '#9da2ab';
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 130, 0, Math.PI / 12); g.closePath(); g.fill();
  }
  g.fillStyle = '#ff9a5a';
  g.beginPath(); g.arc(0, 0, 22, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.name = 'spinner';
  return t;
}

// 提灯・ハイライトの柔らかい光
function glowTexture(THREE) {
  const c = canvas(64), g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); t.name = 'glow';
  return t;
}
