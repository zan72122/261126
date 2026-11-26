// hero が自分で作る手続きテクスチャ（2枚まで：毛羽の密度、光の輪）。
import { mulberry32 } from './field.js';

// 毛羽の密度（繰り返しできる）。R＝棒に巻く向き（横）の細い糸、G＝房のかたまり、B＝ばらけた糸
export function makeFuzzTexture(THREE, size) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), rnd = mulberry32(4242);
  g.fillStyle = '#000'; g.fillRect(0, 0, size, size);
  g.globalCompositeOperation = 'lighter';
  // G：房（ぼかした円）
  for (let i = 0; i < 90; i++) {
    const x = rnd() * size, y = rnd() * size, rad = size * (0.035 + 0.085 * rnd()), a = 0.25 + 0.5 * rnd();
    for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
      const cx = x + ox * size, cy = y + oy * size;
      if (cx < -rad || cx > size + rad || cy < -rad || cy > size + rad) continue;
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
      gr.addColorStop(0, `rgba(0,255,0,${a})`); gr.addColorStop(0.55, `rgba(0,255,0,${a * 0.45})`); gr.addColorStop(1, 'rgba(0,255,0,0)');
      g.fillStyle = gr; g.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
    }
  }
  // R・B：糸（+x 向きに伸びる曲線。左右・上下にはみ出す分は反対側にも描く）
  g.lineCap = 'round';
  function strands(count, channel, spread, w0, w1, len0, len1) {
    for (let i = 0; i < count; i++) {
      const x = rnd() * size, y = rnd() * size, len = size * (len0 + (len1 - len0) * rnd());
      const ang = (rnd() - 0.5) * spread, bend = (rnd() - 0.5) * len * 0.5;
      const ex = Math.cos(ang) * len, ey = Math.sin(ang) * len;
      const mx = ex * 0.5 - Math.sin(ang) * bend, my = ey * 0.5 + Math.cos(ang) * bend;
      g.strokeStyle = channel === 0 ? `rgba(255,0,0,${0.22 + 0.6 * rnd()})` : `rgba(0,0,255,${0.25 + 0.6 * rnd()})`;
      g.lineWidth = w0 + (w1 - w0) * rnd();
      for (let ox = -1; ox <= 0; ox++) for (let oy = -1; oy <= 1; oy++) {
        const sx = x + ox * size, sy = y + oy * size;
        g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(sx + mx, sy + my, sx + ex, sy + ey); g.stroke();
      }
    }
  }
  strands(Math.round(size * 2.6), 0, 1.3, 0.8, 2.0, 0.07, 0.26);
  strands(Math.round(size * 1.3), 2, 3.1, 0.7, 1.6, 0.05, 0.16);
  const t = new THREE.CanvasTexture(c);
  t.name = 'hero-fuzz';
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.NoColorSpace;
  t.anisotropy = 2;
  return t;
}

// 光の輪（「次はここ」の目印）
export function makeGlowTexture(THREE) {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.5)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.15)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.name = 'hero-glow';
  return t;
}
