// hero の手続きテクスチャ（Canvas 1枚、1024×512、文字なし）。
// バナナ・にんじん・葉・卵パック・卵・缶・牛乳パックの模様と、丸影・きらめきの形（アルファ）を1枚にまとめる。
import { rectUV } from './geo.js';

const W = 1024, H = 512;

// 置き場所（px）
const PX = {
  banana: [0, 0, 256, 128],
  carrot: [256, 0, 256, 128],
  pulp: [512, 0, 128, 128],
  egg: [640, 0, 64, 64],
  leaf: [704, 0, 64, 64],
  metal: [640, 64, 64, 64],
  white: [704, 64, 64, 64],
  blob: [768, 0, 128, 128],
  star: [896, 0, 128, 128],
  can: [0, 128, 512, 192],
  milkFront: [512, 128, 128, 256],
  milkSide: [640, 128, 128, 256],
  milkTop: [768, 128, 128, 128],
  stem: [896, 128, 64, 64],
  ring: [768, 256, 128, 128],
};

// 再現できる乱数（模様用。遊びの乱数とは別）
function lcg(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

function speckle(g, x, y, w, h, n, colors, rmin, rmax, rnd) {
  for (let i = 0; i < n; i++) {
    g.fillStyle = colors[Math.floor(rnd() * colors.length)];
    const r = rmin + (rmax - rmin) * rnd();
    g.beginPath();
    g.arc(x + rnd() * w, y + rnd() * h, r, 0, Math.PI * 2);
    g.fill();
  }
}

function draw(g) {
  const rnd = lcg(38);
  g.clearRect(0, 0, W, H);

  // ---- バナナ：u（横）＝長さ方向。左＝軸（緑がかる）、右＝先（茶色） ----
  {
    const [x, y, w, h] = PX.banana;
    const gr = g.createLinearGradient(x, 0, x + w, 0);
    gr.addColorStop(0, '#8f9a3a'); gr.addColorStop(0.07, '#c9c545'); gr.addColorStop(0.2, '#f4d53e');
    gr.addColorStop(0.8, '#f7d640'); gr.addColorStop(0.93, '#e3bb3a'); gr.addColorStop(0.975, '#7a5527'); gr.addColorStop(1, '#4b3218');
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    // 稜線（まわり方向に5本の薄い筋）
    for (let i = 0; i < 5; i++) {
      const yy = y + (i + 0.5) * h / 5;
      const lg = g.createLinearGradient(0, yy - 7, 0, yy + 7);
      lg.addColorStop(0, 'rgba(160,120,20,0)'); lg.addColorStop(0.5, 'rgba(160,120,20,0.22)'); lg.addColorStop(1, 'rgba(160,120,20,0)');
      g.fillStyle = lg; g.fillRect(x + w * 0.1, yy - 7, w * 0.82, 14);
    }
    speckle(g, x + w * 0.15, y, w * 0.7, h, 26, ['rgba(110,70,25,0.55)', 'rgba(130,90,30,0.4)'], 0.8, 2.2, rnd);
  }

  // ---- にんじん：u＝長さ方向（左＝頭、右＝先） ----
  {
    const [x, y, w, h] = PX.carrot;
    const gr = g.createLinearGradient(x, 0, x + w, 0);
    gr.addColorStop(0, '#d9701c'); gr.addColorStop(0.08, '#f28a24'); gr.addColorStop(0.7, '#f59230'); gr.addColorStop(1, '#f7a23c');
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    g.lineCap = 'round';
    for (let i = 0; i < 46; i++) {
      const xx = x + 8 + rnd() * (w - 16), yy = y + rnd() * h, len = 8 + rnd() * 26;
      g.strokeStyle = rnd() < 0.5 ? 'rgba(190,90,15,0.5)' : 'rgba(255,190,110,0.45)';
      g.lineWidth = 1.2 + rnd() * 1.4;
      g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + (rnd() - 0.5) * 3, yy + len); g.stroke();
    }
  }

  // ---- 卵パック（紙パルプ） ----
  {
    const [x, y, w, h] = PX.pulp;
    g.fillStyle = '#cdbfa3'; g.fillRect(x, y, w, h);
    speckle(g, x, y, w, h, 420, ['rgba(120,105,80,0.35)', 'rgba(240,232,214,0.5)', 'rgba(160,145,115,0.3)'], 0.5, 1.6, rnd);
  }
  // ---- 卵 ----
  {
    const [x, y, w, h] = PX.egg;
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, '#fffaf0'); gr.addColorStop(1, '#f1dfc4');
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    speckle(g, x, y, w, h, 30, ['rgba(200,170,130,0.25)'], 0.4, 1.0, rnd);
  }
  // ---- 葉 ----
  {
    const [x, y, w, h] = PX.leaf;
    const gr = g.createLinearGradient(x, 0, x + w, 0);
    gr.addColorStop(0, '#3f9a3a'); gr.addColorStop(1, '#7bcf4f');
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    g.strokeStyle = 'rgba(210,255,170,0.5)'; g.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(x, y + 6 + i * 10); g.lineTo(x + w, y + 2 + i * 10); g.stroke(); }
  }
  // ---- 金属（缶のふた） ----
  {
    const [x, y, w, h] = PX.metal;
    g.fillStyle = '#c9ced3'; g.fillRect(x, y, w, h);
    g.lineWidth = 1.5;
    for (let r = 4; r < 46; r += 5) {
      g.strokeStyle = r % 10 === 4 ? 'rgba(255,255,255,0.7)' : 'rgba(120,128,138,0.55)';
      g.beginPath(); g.arc(x + w / 2, y + h / 2, r, 0, Math.PI * 2); g.stroke();
    }
  }
  // ---- 白 ----
  { const [x, y, w, h] = PX.white; g.fillStyle = '#ffffff'; g.fillRect(x, y, w, h); }
  // ---- 茶色（へた） ----
  { const [x, y, w, h] = PX.stem; g.fillStyle = '#6b4a2a'; g.fillRect(x, y, w, h); }

  // ---- 丸影（アルファ） ----
  {
    const [x, y, w, h] = PX.blob;
    const r = g.createRadialGradient(x + w / 2, y + h / 2, 2, x + w / 2, y + h / 2, w / 2 - 2);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.55, 'rgba(255,255,255,0.55)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(x, y, w, h);
  }
  // ---- きらめき（4つの角の星。アルファ） ----
  {
    const [x, y, w, h] = PX.star;
    const cx = x + w / 2, cy = y + h / 2, R = w / 2 - 6, r = R * 0.22;
    const rg = g.createRadialGradient(cx, cy, 1, cx, cy, R);
    rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.5, 'rgba(255,255,255,0.9)'); rg.addColorStop(1, 'rgba(255,255,255,0.0)');
    g.fillStyle = rg;
    g.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 === 0 ? R : r;
      if (i === 0) g.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); else g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    g.closePath(); g.fill();
    const cg = g.createRadialGradient(cx, cy, 0, cx, cy, R * 0.45);
    cg.addColorStop(0, 'rgba(255,255,255,1)'); cg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = cg; g.beginPath(); g.arc(cx, cy, R * 0.45, 0, Math.PI * 2); g.fill();
  }
  // ---- 光の輪（アルファ） ----
  {
    const [x, y, w, h] = PX.ring;
    const cx = x + w / 2, cy = y + h / 2, R = w / 2 - 4;
    const rg = g.createRadialGradient(cx, cy, R * 0.45, cx, cy, R);
    rg.addColorStop(0, 'rgba(255,255,255,0)'); rg.addColorStop(0.72, 'rgba(255,255,255,0.95)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg; g.fillRect(x, y, w, h);
  }

  // ---- 缶のラベル：u＝まわり。赤い地、クリーム色の帯、まるいトマトの絵が2つ ----
  {
    const [x, y, w, h] = PX.can;
    g.fillStyle = '#e2473b'; g.fillRect(x, y, w, h);
    g.fillStyle = '#f6c443'; g.fillRect(x, y, w, 12); g.fillRect(x, y + h - 12, w, 12);
    g.fillStyle = '#fff3d6';
    g.beginPath();
    g.moveTo(x, y + h * 0.30);
    for (let i = 0; i <= 32; i++) g.lineTo(x + (i / 32) * w, y + h * 0.30 + Math.sin((i / 32) * Math.PI * 8) * 7);
    for (let i = 32; i >= 0; i--) g.lineTo(x + (i / 32) * w, y + h * 0.72 + Math.sin((i / 32) * Math.PI * 8) * 7);
    g.closePath(); g.fill();
    for (const cx of [x + w * 0.25, x + w * 0.75]) {
      const cy = y + h * 0.52;
      g.fillStyle = '#e8402f'; g.beginPath(); g.ellipse(cx, cy, 38, 34, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.ellipse(cx - 14, cy - 12, 9, 6, -0.6, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#3f9a3a';
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        g.beginPath(); g.ellipse(cx + Math.cos(a) * 9, cy - 30 + Math.sin(a) * 6, 10, 4, a, 0, Math.PI * 2); g.fill();
      }
    }
    // 小さな水玉
    g.fillStyle = '#f6c443';
    for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(x + (i + 0.5) * w / 8, y + h * 0.16, 6, 0, Math.PI * 2); g.fill(); }
  }

  // ---- 牛乳パック：白い地に水色の波と牛のぶち模様（絵のある面／横の面） ----
  for (const key of ['milkFront', 'milkSide']) {
    const [x, y, w, h] = PX[key];
    g.fillStyle = '#fdfdfb'; g.fillRect(x, y, w, h);
    // 下の水色の波
    g.fillStyle = '#8fd0f2';
    g.beginPath();
    g.moveTo(x, y + h);
    g.lineTo(x, y + h * 0.66);
    for (let i = 0; i <= 16; i++) g.lineTo(x + (i / 16) * w, y + h * 0.66 + Math.sin((i / 16) * Math.PI * 2) * 9);
    g.lineTo(x + w, y + h);
    g.closePath(); g.fill();
    g.fillStyle = '#5fb4e6';
    g.fillRect(x, y + h - 26, w, 26);
    g.fillStyle = '#8fd0f2'; g.fillRect(x, y, w, 16);
    if (key === 'milkFront') {
      // 牛のぶち
      g.fillStyle = '#3f8fd0';
      const blobs = [[0.30, 0.20, 22, 16, 0.3], [0.72, 0.30, 17, 22, -0.4], [0.40, 0.46, 15, 12, 0.8], [0.80, 0.52, 11, 9, 0.2]];
      for (const [bx, by, rx, ry, rot] of blobs) { g.beginPath(); g.ellipse(x + bx * w, y + by * h, rx, ry, rot, 0, Math.PI * 2); g.fill(); }
      // 白いしずく
      g.fillStyle = '#ffffff';
      const dx = x + w * 0.5, dy = y + h * 0.80;
      g.beginPath(); g.moveTo(dx, dy - 26); g.bezierCurveTo(dx + 20, dy - 2, dx + 16, dy + 16, dx, dy + 16); g.bezierCurveTo(dx - 16, dy + 16, dx - 20, dy - 2, dx, dy - 26); g.fill();
    } else {
      g.fillStyle = '#3f8fd0';
      g.beginPath(); g.ellipse(x + w * 0.5, y + h * 0.36, 20, 26, 0.2, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#ffffff';
      for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x + w * (0.25 + 0.25 * i), y + h * 0.82, 6, 0, Math.PI * 2); g.fill(); }
    }
  }
  {
    const [x, y, w, h] = PX.milkTop;
    g.fillStyle = '#fdfdfb'; g.fillRect(x, y, w, h);
    g.fillStyle = '#8fd0f2'; g.fillRect(x, y, w, 22);
  }
}

export function makeAtlas(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  draw(canvas.getContext('2d'));
  const texture = new THREE.CanvasTexture(canvas);
  texture.name = 'hero-atlas';
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 2;
  const rects = {};
  for (const k of Object.keys(PX)) rects[k] = rectUV(PX[k][0], PX[k][1], PX[k][2], PX[k][3], W, H, 2);
  return { texture, rects, restore() { texture.needsUpdate = true; }, dispose() { texture.dispose(); } };
}
