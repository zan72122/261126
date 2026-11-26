// Synthesised sounds (no files): water, drips, twine, wind, cicadas, chimes, little voices.
export class Audio {
  constructor() { this.ctx = null; this.ok = false; }
  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = 0.8; this.master.connect(c.destination);
    // noise buffer
    const b = c.createBuffer(1, c.sampleRate * 2, c.sampleRate); const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.noise = b;
    // wind bed
    const src = c.createBufferSource(); src.buffer = b; src.loop = true;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500; f.Q.value = 0.4;
    const g = c.createGain(); g.gain.value = 0.0;
    src.connect(f); f.connect(g); g.connect(this.master); src.start();
    this.windF = f; this.windG = g;
    // late-summer insects, very soft
    const src2 = c.createBufferSource(); src2.buffer = b; src2.loop = true; src2.playbackRate.value = 0.7;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = 6;
    const g2 = c.createGain(); g2.gain.value = 0.0; const lfo = c.createOscillator(); lfo.frequency.value = 7; const lg = c.createGain(); lg.gain.value = 0.006;
    lfo.connect(lg); lg.connect(g2.gain); lfo.start();
    src2.connect(bp); bp.connect(g2); g2.connect(this.master); src2.start();
    this.bugG = g2;
    this.ok = true;
  }
  t() { return this.ctx.currentTime; }
  env(g, t, a, peak, dec) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); }
  noiseBurst({ type = 'bandpass', f = 1000, f2 = null, q = 1, peak = 0.3, a = 0.005, dec = 0.25, delay = 0, rate = 1 }) {
    if (!this.ok) return; const c = this.ctx, t = this.t() + delay;
    const s = c.createBufferSource(); s.buffer = this.noise; s.playbackRate.value = rate;
    const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + a + dec); fl.Q.value = q;
    const g = c.createGain(); this.env(g, t, a, peak, dec);
    s.connect(fl); fl.connect(g); g.connect(this.master); s.start(t, Math.random()); s.stop(t + a + dec + 0.05);
  }
  tone({ f = 440, f2 = null, type = 'sine', peak = 0.2, a = 0.005, dec = 0.3, delay = 0 }) {
    if (!this.ok) return; const c = this.ctx, t = this.t() + delay;
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + a + dec);
    const g = c.createGain(); this.env(g, t, a, peak, dec); o.connect(g); g.connect(this.master); o.start(t); o.stop(t + a + dec + 0.05);
  }
  // ---- specific sounds
  tap() { this.tone({ f: 900, f2: 1300, peak: 0.08, dec: 0.08 }); }
  twine() { this.noiseBurst({ f: 2500, f2: 5000, q: 3, peak: 0.12, dec: 0.18 }); this.noiseBurst({ f: 3000, f2: 6000, q: 3, peak: 0.08, dec: 0.15, delay: 0.12 }); }
  knot() { this.tone({ f: 320, f2: 220, type: 'triangle', peak: 0.12, dec: 0.08 }); }
  dip(strength = 1) { this.noiseBurst({ type: 'lowpass', f: 900, f2: 250, peak: 0.25 * strength, dec: 0.4 }); this.tone({ f: 180, f2: 90, peak: 0.12 * strength, dec: 0.2 }); }
  bubble() { this.tone({ f: 500 + Math.random() * 500, f2: 1200 + Math.random() * 600, peak: 0.05, dec: 0.06 }); }
  drip() { const f = 1200 + Math.random() * 900; this.tone({ f, f2: f * 1.8, peak: 0.05, dec: 0.05 }); }
  splash() { this.noiseBurst({ type: 'lowpass', f: 3000, f2: 300, peak: 0.45, dec: 0.9 }); this.noiseBurst({ f: 1500, q: 0.7, peak: 0.25, dec: 0.5, delay: 0.05 }); this.tone({ f: 120, f2: 50, peak: 0.25, dec: 0.3 }); }
  clank() { this.tone({ f: 620, type: 'square', peak: 0.05, dec: 0.25 }); this.tone({ f: 930, peak: 0.06, dec: 0.4 }); this.noiseBurst({ f: 4000, q: 2, peak: 0.1, dec: 0.15 }); }
  pour(on) { if (!this.ok) return; if (on && !this.pourSrc) { const c = this.ctx; const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true; const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 0.8; const g = c.createGain(); g.gain.value = 0.12; s.connect(f); f.connect(g); g.connect(this.master); s.start(); this.pourSrc = [s, g]; } else if (!on && this.pourSrc) { const [s, g] = this.pourSrc; g.gain.setTargetAtTime(0, this.t(), 0.05); s.stop(this.t() + 0.3); this.pourSrc = null; } }
  pop() { this.tone({ f: 500, f2: 1100, peak: 0.12, dec: 0.08 }); this.noiseBurst({ f: 2000, q: 1, peak: 0.08, dec: 0.08 }); }
  flutter() { for (let i = 0; i < 4; i++) this.noiseBurst({ f: 1500, q: 1.5, peak: 0.07, dec: 0.06, delay: i * 0.07 }); }
  clip() { this.tone({ f: 1800, type: 'triangle', peak: 0.06, dec: 0.05 }); this.noiseBurst({ f: 3500, q: 4, peak: 0.08, dec: 0.04, delay: 0.02 }); }
  whoosh() { this.noiseBurst({ f: 400, f2: 1800, q: 0.8, peak: 0.12, a: 0.15, dec: 0.35 }); }
  chime(n = 4, base = 660) { const sc = [0, 4, 7, 12, 16, 19]; for (let i = 0; i < n; i++) this.tone({ f: base * Math.pow(2, sc[i] / 12), peak: 0.07, dec: 0.6, delay: i * 0.09 }); }
  wow() { this.chime(5, 784); }
  oops() { this.tone({ f: 600, f2: 300, type: 'triangle', peak: 0.12, dec: 0.45 }); this.tone({ f: 450, f2: 220, type: 'triangle', peak: 0.1, dec: 0.5, delay: 0.25 }); }
  huh() { this.tone({ f: 380, f2: 560, type: 'triangle', peak: 0.1, a: 0.05, dec: 0.25 }); }
  giggle(pitch = 1) { for (let i = 0; i < 5; i++) { const f = (520 + (i % 2) * 120) * pitch; this.tone({ f, f2: f * 0.8, type: 'triangle', peak: 0.06, a: 0.01, dec: 0.07, delay: i * 0.09 }); } }
  laughLow() { for (let i = 0; i < 4; i++) this.tone({ f: 220, f2: 170, type: 'triangle', peak: 0.09, dec: 0.1, delay: i * 0.12 }); }
  clap() { for (let i = 0; i < 3; i++) this.noiseBurst({ f: 1800, q: 0.6, peak: 0.18, dec: 0.06, delay: i * 0.2 }); }
  fanfare() { [0, 4, 7, 12].forEach((s, i) => this.tone({ f: 523 * Math.pow(2, s / 12), type: 'triangle', peak: 0.09, dec: 0.5, delay: i * 0.12 })); this.tone({ f: 1046, peak: 0.08, dec: 1.2, delay: 0.5 }); }
  setWind(v) { if (!this.ok) return; this.windG.gain.setTargetAtTime(0.025 + v * 0.06, this.t(), 0.3); this.windF.frequency.setTargetAtTime(300 + v * 700, this.t(), 0.3); this.bugG.gain.setTargetAtTime(0.012, this.t(), 1); }
}
