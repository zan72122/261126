// WebAudio sound effects, all synthesized (no files, no network). Unlocks on the first touch (iOS).
export class Sfx {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.squeeze = null;
    this.muted = new URLSearchParams(location.search).get('mute') === '1';
  }

  unlock() {
    if (this.muted) return;
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -14; comp.ratio.value = 4;
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.7;
        this.master.connect(comp); comp.connect(this.ctx.destination);
        // short noise buffer reused by noisy sounds
        const n = this.ctx.sampleRate * 1.0;
        this.noise = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
        const d = this.noise.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      }
      if (this.ctx.state !== 'running') this.ctx.resume();
    } catch (e) { console.warn('audio unlock failed', e); }
  }

  suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend(); }
  get ok() { return !!(this.ctx && this.ctx.state === 'running'); }

  // --- primitives ---
  tone(freq, dur, { type = 'sine', vol = 0.25, f2 = null, delay = 0, attack = 0.005 } = {}) {
    if (!this.ok) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.02);
    o.onended = () => { o.disconnect(); g.disconnect(); };
  }

  hiss(dur, { freq = 800, q = 1, vol = 0.2, f2 = null, delay = 0, type = 'bandpass' } = {}) {
    if (!this.ok) return;
    const t = this.ctx.currentTime + delay;
    const s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (f2) f.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.master);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
    s.onended = () => { s.disconnect(); f.disconnect(); g.disconnect(); };
  }

  // --- continuous squeeze ("にゅー"): started/stopped by hero events, driven by hero flow ---
  squeezeStart() {
    if (!this.ok || this.squeeze) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = 170;
    const lfo = c.createOscillator(); lfo.frequency.value = 7; const lg = c.createGain(); lg.gain.value = 9;
    lfo.connect(lg); lg.connect(o.frequency);
    const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 520; f.Q.value = 2.5;
    const ng = c.createGain(); ng.gain.value = 0.35;
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t);
    o.connect(g); s.connect(f); f.connect(ng); ng.connect(g); g.connect(this.master);
    o.start(); lfo.start(); s.start();
    this.squeeze = { o, lfo, s, f, g, lg, ng };
  }
  squeezeFlow(flow) {
    const q = this.squeeze; if (!q) return;
    const t = this.ctx.currentTime;
    q.o.frequency.setTargetAtTime(150 + 260 * flow, t, 0.05);
    q.f.frequency.setTargetAtTime(420 + 700 * flow, t, 0.05);
    q.g.gain.setTargetAtTime(0.02 + 0.16 * flow, t, 0.04);
  }
  squeezeStop() {
    const q = this.squeeze; if (!q) return;
    this.squeeze = null;
    const t = this.ctx.currentTime;
    q.g.gain.cancelScheduledValues(t);
    q.g.gain.setTargetAtTime(0.0001, t, 0.03);
    [q.o, q.lfo, q.s].forEach((n) => n.stop(t + 0.2));
    q.o.onended = () => Object.values(q).forEach((n) => n.disconnect());
  }

  // --- one-shots (named by sound, Japanese onomatopoeia in comments) ---
  pop() { this.tone(520, 0.12, { f2: 1250, vol: 0.3 }); this.tone(1900, 0.05, { vol: 0.08, delay: 0.01 }); }   // ぽん
  squish() { this.hiss(0.18, { freq: 300, f2: 160, q: 3, vol: 0.25, type: 'lowpass' }); this.tone(130, 0.16, { f2: 90, vol: 0.18 }); } // むにゅ
  dip() { this.tone(880, 0.07, { f2: 600, vol: 0.18 }); this.hiss(0.1, { freq: 1500, q: 4, vol: 0.12, delay: 0.05 }); this.tone(1100, 0.08, { f2: 1500, vol: 0.12, delay: 0.1 }); } // ちゃぷ
  pick() { this.tone(500, 0.1, { f2: 950, vol: 0.22 }); }   // ぴょこ
  land() { this.tone(320, 0.12, { f2: 150, vol: 0.25 }); this.hiss(0.08, { freq: 600, q: 1, vol: 0.1 }); } // ぽふ
  back() { this.tone(700, 0.15, { f2: 400, vol: 0.15 }); this.tone(400, 0.12, { f2: 600, vol: 0.12, delay: 0.12 }); } // ぽよん（戻る）
  bell() { this.tone(1760, 0.6, { vol: 0.14 }); this.tone(2637, 0.45, { vol: 0.07, delay: 0.005 }); } // ちりん
  tick() { this.tone(2200, 0.025, { type: 'square', vol: 0.03 }); } // カチ
  thump() { this.hiss(0.12, { freq: 400, q: 0.8, vol: 0.22, type: 'lowpass' }); this.tone(120, 0.15, { f2: 70, vol: 0.3 }); } // ぱたん
  wiggle() { this.tone(300, 0.08, { f2: 360, vol: 0.12 }); this.tone(360, 0.08, { f2: 300, vol: 0.12, delay: 0.08 }); } // ぷるっ
  sparkle(n = 4) { for (let i = 0; i < n; i++) this.tone(1800 + Math.random() * 1600, 0.18, { vol: 0.06, delay: i * 0.05 }); }
  chime() { [1047, 1319, 1568, 2093].forEach((f, i) => this.tone(f, 0.4, { vol: 0.14, delay: i * 0.09 })); } // ちりりん
  voice() { this.tone(620, 0.16, { f2: 980, vol: 0.18, type: 'triangle' }); this.tone(900, 0.2, { f2: 760, vol: 0.15, type: 'triangle', delay: 0.15 }); } // きゃっ
  blow() { this.hiss(0.7, { freq: 900, f2: 2400, q: 0.7, vol: 0.22 }); } // ふーっ
  poof() { this.hiss(0.25, { freq: 2000, f2: 500, q: 0.8, vol: 0.12 }); }
  cheer() { [784, 988, 1175, 1568, 1976].forEach((f, i) => this.tone(f, 0.3, { vol: 0.12, delay: i * 0.07, type: 'triangle' })); this.sparkle(6); }
  boing() { this.tone(220, 0.18, { f2: 440, vol: 0.22 }); this.tone(440, 0.22, { f2: 330, vol: 0.18, delay: 0.16 }); } // ぽよん（新しいスポンジ）
  hop() { this.tone(400, 0.12, { f2: 800, vol: 0.15, type: 'triangle' }); }
}
