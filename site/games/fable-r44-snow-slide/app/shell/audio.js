// WebAudio sound effects, all synthesized (no files). Unlocked on the first touch.
// Continuous: engine (plow speed/load), scrape (blade load), whoosh (sled speed).
// One-shots: named in PLAY below; called from flow.js on hero events.

const PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.5];

export class Sfx {
  constructor() { this.ctx = null; this.ok = false; this.muted = false; }

  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      const ctx = (this.ctx = new AC());
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      this.master = ctx.createGain(); this.master.gain.value = 0.7;
      this.master.connect(comp); comp.connect(ctx.destination);
      // noise buffer (shared)
      const nb = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
      const d = nb.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      this.noise = nb;
      this._loops();
      this.ok = true;
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { console.warn('audio off', e); }
  }

  suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend(); }
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }

  _loops() {
    const c = this.ctx;
    // engine: soft square + lowpass, wobble LFO ("bububu")
    const eo = c.createOscillator(); eo.type = 'square'; eo.frequency.value = 60;
    const ef = c.createBiquadFilter(); ef.type = 'lowpass'; ef.frequency.value = 420; ef.Q.value = 2;
    const eg = c.createGain(); eg.gain.value = 0;
    const lfo = c.createOscillator(); lfo.frequency.value = 14;
    const lg = c.createGain(); lg.gain.value = 0.35;
    const wob = c.createGain(); wob.gain.value = 0.65;
    lfo.connect(lg); lg.connect(wob.gain);
    eo.connect(ef); ef.connect(wob); wob.connect(eg); eg.connect(this.master);
    eo.start(); lfo.start();
    this.engine = { o: eo, f: ef, g: eg, lfo };
    // scrape: bandpassed noise
    this.scrape = this._noiseLoop('bandpass', 900, 0.8);
    // whoosh: bandpassed noise
    this.whoosh = this._noiseLoop('bandpass', 700, 1.2);
  }

  _noiseLoop(type, freq, q) {
    const c = this.ctx;
    const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = c.createGain(); g.gain.value = 0;
    s.connect(f); f.connect(g); g.connect(this.master); s.start();
    return { s, f, g };
  }

  // called every frame with hero state
  continuous(plow, sled) {
    if (!this.ok) return;
    const t = this.ctx.currentTime, k = 0.08;
    const moving = plow.speed > 0.05;
    // pushing against a heap: driving but (almost) stopped with snow on the blade -> the engine strains
    const push = plow.driving && plow.speed < 0.4 ? Math.min(1, plow.load * 1.5) : 0;
    this.engine.o.frequency.setTargetAtTime(52 + plow.speed * 14 + plow.load * 10 + push * 22, t, k);
    this.engine.lfo.frequency.setTargetAtTime(10 + plow.speed * 4 + push * 8, t, k);
    this.engine.g.gain.setTargetAtTime(moving || plow.driving ? 0.06 + plow.speed * 0.025 + push * 0.035 : 0, t, 0.15);
    this.scrape.g.gain.setTargetAtTime(moving ? Math.min(0.12, plow.load * plow.speed * 0.08) : 0, t, k);
    const sliding = sled.state === 'slide' && !sled.airborne;
    this.whoosh.f.frequency.setTargetAtTime(500 + sled.speed * 180, t, k);
    this.whoosh.g.gain.setTargetAtTime(sliding ? Math.min(0.16, sled.speed * 0.035) : 0, t, 0.1);
  }

  _tone(freq, dur, { type = 'sine', vol = 0.2, at = 0, slideTo = 0, attack = 0.01 } = {}) {
    const c = this.ctx, t = c.currentTime + at;
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur * 0.8);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.05);
  }

  _bell(freq, dur, vol, at = 0) {
    this._tone(freq, dur, { vol, at });
    this._tone(freq * 2.01, dur * 0.6, { vol: vol * 0.35, at });
  }

  _burst(dur, { freq = 400, type = 'lowpass', vol = 0.3, at = 0, sweepTo = 0 } = {}) {
    const c = this.ctx, t = c.currentTime + at;
    const s = c.createBufferSource(); s.buffer = this.noise;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.master);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }

  play(name, p = {}) {
    if (!this.ok || this.muted) return;
    try {
      switch (name) {
        case 'tap': this._tone(660, 0.12, { vol: 0.12, slideTo: 990 }); break;
        case 'pick': this._tone(520, 0.14, { vol: 0.15, slideTo: 880, type: 'triangle' }); break;
        case 'drop': this._tone(700, 0.14, { vol: 0.12, slideTo: 420, type: 'triangle' }); break;
        case 'poff': { const a = Math.min(1, (p.amount || 0.5) / 1.5); this._burst(0.25 + a * 0.25, { freq: 380 + a * 200, vol: 0.25 + a * 0.25 }); break; }
        case 'spill': this._burst(0.35, { freq: 2600, type: 'bandpass', vol: 0.08, sweepTo: 1200 }); break;
        case 'grow': { const s = Math.min(3, p.stage || 1); [0, 2, 4].forEach((n, i) => this._bell(PENTA[n + s - 1] , 1.1, 0.12, i * 0.09)); break; }
        case 'whee': this._tone(520, 0.55, { vol: 0.14, slideTo: 1180, type: 'triangle', attack: 0.05 }); break;
        case 'bump': this._tone(300 + (p.strength || 0.5) * 200, 0.22, { vol: 0.16, slideTo: 720, type: 'sine' }); break;
        case 'land': this._burst(0.18, { freq: 260, vol: 0.18 + (p.strength || 0) * 0.2 }); break;
        case 'end': this._bell(PENTA[2], 0.9, 0.14); this._bell(PENTA[4], 0.9, 0.12, 0.12); break;
        case 'clap': for (let i = 0; i < 4; i++) this._burst(0.06, { freq: 1800, type: 'bandpass', vol: 0.12, at: i * 0.16 }); break;
        case 'hint': this._tone(1046, 0.18, { vol: 0.05 }); this._tone(1318, 0.22, { vol: 0.04, at: 0.08 }); break;
        case 'friend': [0, 2, 4, 2].forEach((n, i) => this._bell(PENTA[n], 0.5, 0.1, i * 0.14)); break;
        case 'hop': this._tone(440, 0.16, { vol: 0.1, slideTo: 760, type: 'triangle' }); break;
        case 'fanfare': [0, 2, 4, 5, 4, 7].forEach((n, i) => this._bell(PENTA[n], i === 5 ? 1.4 : 0.45, 0.13, i * 0.16)); break;
        case 'again': this._burst(1.2, { freq: 600, type: 'bandpass', vol: 0.18, sweepTo: 3000 }); this._bell(PENTA[4], 1.2, 0.08, 0.6); break;
        case 'start': this._tone(110, 0.35, { vol: 0.12, type: 'square', slideTo: 70 }); break;
        default: break;
      }
    } catch (e) { /* never let audio break the game */ }
  }
}
