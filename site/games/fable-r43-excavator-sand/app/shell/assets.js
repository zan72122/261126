// テクスチャ：window.__TEX__（data URI）から読む。file:// でも WebGL に渡せる。
// 手続きテクスチャ（Canvas）もここで作る。
import * as THREE from '../vendor/three/three.module.js';

const loader = new THREE.TextureLoader();
const clonesOf = new WeakMap();
let pending = 0;
function loaded() {
  if (--pending === 0) { window.__r43 = window.__r43 || {}; window.__r43.texturesReadyMs = performance.now(); }
}

export function loadTex(name, { repeat = true, srgb = true, aniso = 4 } = {}) {
  const src = (window.__TEX__ || {})[name];
  let tex;
  if (src) {
    pending++;
    tex = loader.load(src, (t) => { for (const c of clonesOf.get(t) || []) c.needsUpdate = true; loaded(); }, undefined, loaded);
  } else {
    // 予備：無ければ単色
    tex = canvasTexture(4, 4, (g) => { g.fillStyle = '#d9b77e'; g.fillRect(0, 0, 4, 4); });
    console.warn('texture missing:', name);
  }
  tex.name = name;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = aniso;
  return tex;
}

export function canvasTexture(w, h, draw, { srgb = true, repeat = false } = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(c);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function grassTexture() {
  const t = canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = '#7fb85a'; g.fillRect(0, 0, w, h);
    let s = 7;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 2600; i++) {
      const x = rnd() * w, y = rnd() * h, l = 2 + rnd() * 5;
      const k = rnd();
      g.strokeStyle = k < 0.33 ? '#6aa548' : k < 0.66 ? '#8cc463' : '#9fd070';
      g.lineWidth = 1 + rnd();
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 2, y - l); g.stroke();
    }
  }, { repeat: true });
  t.name = 'grass(canvas)';
  return t;
}

// 吹き出し：お城の絵（文字なし）
export function bubbleTexture() {
  const t = canvasTexture(256, 256, (g) => {
    g.fillStyle = '#ffffff';
    g.beginPath(); g.ellipse(128, 112, 112, 96, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(70, 222, 16, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(46, 246, 8, 0, Math.PI * 2); g.fill();
    // 砂のお城
    g.fillStyle = '#d9a95e';
    g.fillRect(58, 112, 140, 60);
    g.fillRect(88, 72, 80, 44);
    for (let i = 0; i < 4; i++) g.fillRect(88 + i * 22, 60, 14, 14);
    g.fillRect(52, 92, 30, 24); g.fillRect(174, 92, 30, 24);
    g.fillStyle = '#8a5a2b';
    g.beginPath(); g.arc(128, 172, 16, Math.PI, 0); g.lineTo(144, 172); g.fill();
    g.strokeStyle = '#7a4a24'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(128, 72); g.lineTo(128, 30); g.stroke();
    g.fillStyle = '#ff6fa8';
    g.beginPath(); g.moveTo(130, 30); g.lineTo(166, 40); g.lineTo(130, 52); g.fill();
  });
  t.name = 'bubble(canvas)';
  return t;
}

export function heartShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(-0.15, -0.35, -0.6, -0.1, -0.5, 0.2);
  s.bezierCurveTo(-0.42, 0.48, -0.08, 0.5, 0, 0.22);
  s.bezierCurveTo(0.08, 0.5, 0.42, 0.48, 0.5, 0.2);
  s.bezierCurveTo(0.6, -0.1, 0.15, -0.35, 0, -0.5);
  return s;
}

// 同じ画像を別の repeat で使う複製（GPU 上の画像は共有）。読み込み前に複製しても警告が出ないようにする。
export function cloneTex(t) {
  const c = t.clone();
  if (!t.image || !t.image.width) {
    c.version = 0;
    if (!clonesOf.has(t)) clonesOf.set(t, []);
    clonesOf.get(t).push(c);
  }
  return c;
}

// 丸い疑似影（影なしティア用）。1枚を共有する
let blobTex = null;
export function blobShadow(THREE_, w, d, opacity = 0.35) {
  if (!blobTex) {
    blobTex = canvasTexture(64, 64, (g) => {
      const gr = g.createRadialGradient(32, 32, 4, 32, 32, 31);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    }, { srgb: false });
    blobTex.name = 'blob(canvas)';
  }
  const geo = new THREE.PlaneGeometry(w, d);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity, depthWrite: false, color: 0x000000 });
  mat.color.setRGB(1, 1, 1);
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = 1;
  m.position.y = 0.006;
  m.userData.dispose = () => { geo.dispose(); mat.dispose(); };
  return m;
}
