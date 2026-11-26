// テクスチャ：写真風 JPEG（ビルドで dataURL として埋め込み）と手続き Canvas。
import * as THREE from 'three';
import workshopURL from '../assets/workshop_512.jpg';
import steelURL from '../assets/steel_512.jpg';
import cellophaneURL from '../assets/cellophane_512.jpg';
import stripesURL from '../assets/stripes_512.jpg';
import candyURL from '../assets/candy_sheen_1024.jpg';

const loader = new THREE.TextureLoader();

function photo(url, name, { repeat = false, anisotropy = 4 } = {}) {
  const t = loader.load(url);
  t.name = name;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function canvasTex(size, draw, name, { repeat = false, srgb = true } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.name = name;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function createTextures() {
  const tex = {
    // 遠景・周辺は 512²、hero の飴だけ 1024²（PLAN.md §4）
    workshop: photo(workshopURL, 'workshop_512', { anisotropy: 1 }),
    steel: photo(steelURL, 'steel_512', { repeat: true }),
    cellophane: photo(cellophaneURL, 'cellophane_512', { repeat: true }),
    stripes: photo(stripesURL, 'stripes_512'),
    candy: photo(candyURL, 'candy_sheen_1024', { repeat: true }),
    wood: canvasTex(256, drawWood, 'wood_canvas_256', { repeat: true }),
    shadow: canvasTex(128, drawShadow, 'shadow_canvas_128', { srgb: false }),
    sparkle: canvasTex(64, drawSparkle, 'sparkle_canvas_64'),
    heart: canvasTex(64, drawHeart, 'heart_canvas_64'),
  };
  return tex;
}

function drawWood(g, s) {
  g.fillStyle = '#e8b980';
  g.fillRect(0, 0, s, s);
  // ゆるい木目（タイル可能：横方向に周期）
  for (let i = 0; i < 26; i++) {
    const y = (i / 26) * s + Math.sin(i * 7.1) * 3;
    g.strokeStyle = i % 3 ? 'rgba(170,110,60,0.18)' : 'rgba(150,90,45,0.28)';
    g.lineWidth = 1 + (i % 4);
    g.beginPath();
    for (let x = 0; x <= s; x += 8) {
      const yy = y + Math.sin((x / s) * Math.PI * 2 * 2 + i) * 2.5;
      x === 0 ? g.moveTo(x, yy) : g.lineTo(x, yy);
    }
    g.stroke();
  }
}

function drawShadow(g, s) {
  const r = s / 2;
  const grd = g.createRadialGradient(r, r, 0, r, r, r);
  grd.addColorStop(0, 'rgba(0,0,0,0.55)');
  grd.addColorStop(0.5, 'rgba(0,0,0,0.25)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
}

function drawSparkle(g, s) {
  const r = s / 2;
  const grd = g.createRadialGradient(r, r, 0, r, r, r);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,250,220,0.8)');
  grd.addColorStop(1, 'rgba(255,240,200,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  g.fillStyle = 'rgba(255,255,255,0.95)';
  g.beginPath();
  g.moveTo(r, 2); g.lineTo(r + 4, r - 4); g.lineTo(s - 2, r); g.lineTo(r + 4, r + 4);
  g.lineTo(r, s - 2); g.lineTo(r - 4, r + 4); g.lineTo(2, r); g.lineTo(r - 4, r - 4);
  g.closePath();
  g.fill();
}

function drawHeart(g, s) {
  g.fillStyle = '#ff6fa8';
  g.strokeStyle = '#ffffff';
  g.lineWidth = 4;
  g.beginPath();
  const k = s / 64;
  g.moveTo(32 * k, 54 * k);
  g.bezierCurveTo(8 * k, 38 * k, 4 * k, 22 * k, 16 * k, 13 * k);
  g.bezierCurveTo(25 * k, 7 * k, 32 * k, 14 * k, 32 * k, 20 * k);
  g.bezierCurveTo(32 * k, 14 * k, 39 * k, 7 * k, 48 * k, 13 * k);
  g.bezierCurveTo(60 * k, 22 * k, 56 * k, 38 * k, 32 * k, 54 * k);
  g.closePath();
  g.fill();
  g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.6)';
  g.beginPath();
  g.ellipse(21 * k, 21 * k, 5 * k, 3 * k, -0.6, 0, Math.PI * 2);
  g.fill();
}
