// Textures: photo textures from data URIs (window.CAKE_TEX, works from file://) + small procedural canvases.
import { THREE } from './util.js';

export class Assets {
  constructor(renderer) {
    this.renderer = renderer;
    this.tex = {};
    this.pending = 0;
    this.readyCbs = [];
    this.all = [];
    this.aniso = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  }

  _track(t) { this.all.push(t); return t; }

  // Photo texture: returns a texture immediately (blank until the image decodes).
  photo(key, { repeat = 1, aniso = false, onLoad } = {}) {
    if (this.tex[key]) return this.tex[key];
    const t = new THREE.Texture();
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    if (aniso) t.anisotropy = this.aniso;
    const src = (window.CAKE_TEX || {})[key];
    if (src) {
      this.pending++;
      const img = new Image();
      img.onload = () => {
        t.image = img; t.needsUpdate = true;
        if (onLoad) onLoad(t, img);
        if (--this.pending === 0) this._ready();
      };
      img.onerror = () => { console.error('texture failed', key); if (--this.pending === 0) this._ready(); };
      img.src = src;
    }
    this.tex[key] = t;
    return this._track(t);
  }

  onReady(fn) { if (this.pending === 0) fn(); else this.readyCbs.push(fn); }
  _ready() { const c = this.readyCbs; this.readyCbs = []; c.forEach((f) => f()); }

  canvas(key, w, h, draw, { srgb = true, repeat = false } = {}) {
    if (this.tex[key]) return this.tex[key];
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
    this.tex[key] = t;
    return this._track(t);
  }

  // Common procedural textures
  radial(key, inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)', size = 64) {
    return this.canvas(key, size, size, (g, w) => {
      const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      gr.addColorStop(0, inner); gr.addColorStop(1, outer);
      g.fillStyle = gr; g.fillRect(0, 0, w, w);
    }, { srgb: false });
  }

  build() {
    // soft blob shadow (alpha)
    this.radial('shadow', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0)');
    // glow halo (additive)
    this.canvas('halo', 64, 64, (g, w) => {
      const gr = g.createRadialGradient(w / 2, w / 2, w * 0.18, w / 2, w / 2, w / 2);
      gr.addColorStop(0, 'rgba(255,240,190,0)');
      gr.addColorStop(0.35, 'rgba(255,236,170,0.95)');
      gr.addColorStop(1, 'rgba(255,220,140,0)');
      g.fillStyle = gr; g.fillRect(0, 0, w, w);
    }, { srgb: false });
    // gold ring around the cake top (normal blending: an additive white glow disappears on white frosting)
    this.canvas('ring', 128, 128, (g, w) => {
      const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      gr.addColorStop(0, 'rgba(255,190,80,0)');
      gr.addColorStop(0.62, 'rgba(255,190,80,0)');
      gr.addColorStop(0.8, 'rgba(255,176,60,1)');
      gr.addColorStop(0.9, 'rgba(255,214,120,0.7)');
      gr.addColorStop(1, 'rgba(255,220,140,0)');
      g.fillStyle = gr; g.fillRect(0, 0, w, w);
    });
    // particles
    this.canvas('heart', 64, 64, (g) => {
      g.fillStyle = '#fff'; g.beginPath();
      g.moveTo(32, 56); g.bezierCurveTo(4, 36, 6, 10, 22, 10); g.bezierCurveTo(28, 10, 32, 16, 32, 20);
      g.bezierCurveTo(32, 16, 36, 10, 42, 10); g.bezierCurveTo(58, 10, 60, 36, 32, 56); g.fill();
    });
    this.canvas('star', 64, 64, (g) => {
      g.fillStyle = '#fff'; g.beginPath();
      for (let i = 0; i < 10; i++) { const r = i % 2 ? 11 : 30, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(32 + r * Math.cos(a), 32 + r * Math.sin(a)); }
      g.closePath(); g.fill();
    });
    this.radial('puff', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0)');
    // cake box: pink card with white dots
    this.canvas('boxdots', 256, 256, (g, w) => {
      g.fillStyle = '#ffc7d6'; g.fillRect(0, 0, w, w);
      g.fillStyle = '#fff6f8';
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.beginPath(); g.arc(16 + x * 32 + (y % 2) * 16, 16 + y * 32, 6, 0, Math.PI * 2); g.fill(); }
    }, { repeat: true });
    // candle stripes
    this.canvas('candle', 64, 128, (g, w, h) => {
      g.fillStyle = '#fff7fb'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#ff8fb1';
      for (let i = -4; i < 12; i++) { g.beginPath(); g.moveTo(0, i * 16); g.lineTo(w, i * 16 + 32); g.lineTo(w, i * 16 + 40); g.lineTo(0, i * 16 + 8); g.fill(); }
    }, { repeat: true });
  }

  // Sponge side: the sponge photo with a cream band drawn across (made once the photo arrives).
  spongeSide() {
    // fixed 512² canvas from the start (WebGL2 texture storage is immutable; resizing later would break the upload)
    const cv = document.createElement('canvas');
    cv.width = cv.height = 512;
    const g0 = cv.getContext('2d'); g0.fillStyle = '#f3d79a'; g0.fillRect(0, 0, 512, 512);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping; t.repeat.set(3, 1);
    const src = (window.CAKE_TEX || {}).sponge_512;
    if (src) {
      this.pending++;
      const img = new Image();
      img.onload = () => {
        const c = t.image;
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0, 512, 512);
        // cream filling band with soft wavy edges
        g.fillStyle = '#fffaf2';
        g.beginPath(); g.moveTo(0, 230);
        for (let x = 0; x <= 512; x += 16) g.lineTo(x, 228 + Math.sin(x * 0.05) * 5);
        for (let x = 512; x >= 0; x -= 16) g.lineTo(x, 292 + Math.sin(x * 0.07 + 1) * 5);
        g.closePath(); g.fill();
        // strawberry dots peeking out of the filling
        g.fillStyle = '#ff6f86';
        for (let x = 20; x < 512; x += 64) { g.beginPath(); g.ellipse(x, 260, 14, 10, 0, 0, Math.PI * 2); g.fill(); }
        // thin top frosting edge
        g.fillStyle = '#fffaf2'; g.fillRect(0, 0, 512, 22);
        t.needsUpdate = true;
        if (--this.pending === 0) this._ready();
      };
      img.src = src;
    }
    this.tex.spongeSide = t;
    return this._track(t);
  }

  dispose() { this.all.forEach((t) => t.dispose()); this.all.length = 0; }
}
