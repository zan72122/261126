// All sounds are synthesized (WebAudio) – no files.
export const A = { ctx: null, master: null, on: false };

export function initAudio() {
  if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
  const ctx = new C(); A.ctx = ctx;
  A.master = ctx.createGain(); A.master.gain.value = 0.8;
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
  A.master.connect(comp); comp.connect(ctx.destination);
  // shared noise buffer
  const len = ctx.sampleRate * 2; const b = ctx.createBuffer(1, len, ctx.sampleRate); const d = b.getChannelData(0);
  let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = last * 0.97 + w * 0.03; d[i] = w * 0.6 + last * 4; }
  A.noise = b;
  // loops: pour gloop, drum rumble, trowel scrape, ambient birds/traffic
  A.loops = {};
  A.loops.pour = loopNoise(400, 2.5, 'lowpass');
  A.loops.drum = loopNoise(90, 1.2, 'lowpass');
  A.loops.scrape = loopNoise(2600, 1.4, 'bandpass');
  A.loops.amb = loopNoise(300, 0.7, 'lowpass'); A.loops.amb.g.gain.value = 0.05;
  A.on = true;
  birds();
}

function loopNoise(freq, q, type) {
  const ctx = A.ctx; const src = ctx.createBufferSource(); src.buffer = A.noise; src.loop = true;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); g.gain.value = 0;
  src.connect(f); f.connect(g); g.connect(A.master); src.start();
  return { src, f, g };
}
export function setLoop(name, vol, freq) {
  if (!A.on) return; const L = A.loops[name]; if (!L) return;
  L.g.gain.setTargetAtTime(vol, A.ctx.currentTime, 0.06);
  if (freq) L.f.frequency.setTargetAtTime(freq, A.ctx.currentTime, 0.08);
}

function env(g, t, a, peak, dcy) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dcy); }

export function tone(freq, dur = 0.25, type = 'sine', vol = 0.2, when = 0, glide = 0) {
  if (!A.on) return; const ctx = A.ctx, t = ctx.currentTime + when;
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t); if (glide) o.frequency.exponentialRampToValueAtTime(freq * glide, t + dur);
  const g = ctx.createGain(); env(g, t, 0.008, vol, dur); o.connect(g); g.connect(A.master); o.start(t); o.stop(t + dur + 0.05);
}
export function noiseHit(freq, dur, vol, type = 'lowpass', when = 0, q = 1, sweep = 0) {
  if (!A.on) return; const ctx = A.ctx, t = ctx.currentTime + when;
  const s = ctx.createBufferSource(); s.buffer = A.noise; s.playbackRate.value = 0.8 + Math.random() * 0.4;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q; if (sweep) f.frequency.exponentialRampToValueAtTime(freq * sweep, t + dur);
  const g = ctx.createGain(); env(g, t, 0.005, vol, dur);
  s.connect(f); f.connect(g); g.connect(A.master); s.start(t, Math.random()); s.stop(t + dur + 0.05);
}
// pieces
export const sfx = {
  tap() { tone(880, 0.08, 'sine', 0.08); },
  pick() { tone(660, 0.1, 'triangle', 0.12); tone(990, 0.12, 'triangle', 0.1, 0.06); },
  clunk() { noiseHit(300, 0.15, 0.5, 'lowpass'); tone(110, 0.15, 'square', 0.06); },
  squish(depth = 1) { noiseHit(500 + Math.random() * 300, 0.22, 0.35 * depth, 'lowpass', 0, 3, 0.4); tone(160, 0.18, 'sine', 0.08 * depth, 0, 0.6); },
  plop() { noiseHit(700, 0.12, 0.25, 'bandpass', 0, 4, 0.5); },
  helmet() { tone(1250, 0.06, 'square', 0.05); noiseHit(2500, 0.05, 0.2, 'highpass'); tone(520, 0.2, 'triangle', 0.08, 0.04); },
  boots() { noiseHit(900, 0.08, 0.3, 'bandpass', 0, 6); noiseHit(1100, 0.08, 0.3, 'bandpass', 0.12, 6); },
  chime() { [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.5, 'sine', 0.12, i * 0.09)); },
  done() { [523, 659, 784, 1047, 1319].forEach((f, i) => { tone(f, 0.6, 'triangle', 0.1, i * 0.11); tone(f * 2, 0.4, 'sine', 0.04, i * 0.11); }); },
  sparkle() { for (let i = 0; i < 6; i++) tone(1800 + Math.random() * 1600, 0.15, 'sine', 0.04, i * 0.05); },
  bark() { noiseHit(800, 0.12, 0.5, 'bandpass', 0, 2); tone(420, 0.12, 'sawtooth', 0.12, 0, 0.6); },
  ruff() { this.bark(); setTimeout(() => this.bark(), 220); },
  whoosh() { noiseHit(800, 0.5, 0.25, 'bandpass', 0, 1, 3); },
  // voice-like formant blips (no words)
  voice(kind = 'wa', pitch = 1) {
    if (!A.on) return; const ctx = A.ctx, t = ctx.currentTime;
    const shapes = { wa: [[1, 0.0], [1.35, 0.35]], are: [[1.0, 0], [0.95, 0.12], [1.45, 0.4]], oh: [[1.2, 0], [0.8, 0.45]], hehe: [[1.3, 0], [1.2, 0.08], [1.35, 0.16], [1.2, 0.24]], yay: [[1.1, 0], [1.6, 0.25], [1.4, 0.5]], ah: [[1.15, 0], [1.0, 0.3]], umm: [[0.9, 0], [0.85, 0.35]] };
    const sh = shapes[kind] || shapes.wa; const dur = sh[sh.length - 1][1] + 0.18;
    const base = 300 * pitch;
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    sh.forEach(([m, tt]) => o.frequency.linearRampToValueAtTime(base * m, t + tt + 0.02));
    o.frequency.setValueAtTime(base * sh[0][0], t);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.16, t + 0.03); g.gain.setValueAtTime(0.16, t + dur - 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    if (kind === 'hehe') { for (let i = 0; i < 4; i++) { g.gain.setValueAtTime(0.16, t + i * 0.08); g.gain.linearRampToValueAtTime(0.02, t + i * 0.08 + 0.06); } }
    const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.Q.value = 6; const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.Q.value = 8;
    const vow = { wa: [800, 1250], are: [750, 1500], oh: [500, 900], hehe: [550, 1900], yay: [750, 1700], ah: [800, 1250], umm: [350, 900] }[kind] || [800, 1200];
    f1.frequency.value = vow[0] * (pitch > 1.2 ? 1.15 : 1); f2.frequency.value = vow[1] * (pitch > 1.2 ? 1.15 : 1);
    o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g); g.connect(A.master); o.start(t); o.stop(t + dur + 0.05);
  },
};
function birds() {
  const chirp = () => {
    if (!A.on) return;
    if (A.birdsOn !== false) { const f = 2600 + Math.random() * 1800; const n = 2 + (Math.random() * 3 | 0); for (let i = 0; i < n; i++) tone(f * (1 + Math.random() * 0.1), 0.07, 'sine', 0.025, i * 0.1, 1.3); }
    setTimeout(chirp, 2500 + Math.random() * 6000);
  };
  setTimeout(chirp, 1500);
}
