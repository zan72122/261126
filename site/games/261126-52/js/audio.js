// audio.js — all sounds synthesised with WebAudio (no files): wind, brush, plops, spray hiss, sizzle,
// chimes, turboprop, music box.
let ctx = null, master = null, noiseBuf = null;
const loops = {};
export const A = { ready: false };

export function unlockAudio() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0.8;
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
  master.connect(comp); comp.connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  let b = 0;
  for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; b = (b + 0.02 * w) / 1.02; d[i] = w * 0.6 + b * 3; }
  A.ready = true;
  // ambient wind
  loops.wind = noiseLoop({ type: 'lowpass', f: 380, q: 0.4, gain: 0.07 });
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
  const lg = ctx.createGain(); lg.gain.value = 180; lfo.connect(lg); lg.connect(loops.wind.filter.frequency); lfo.start();
  loops.brush = noiseLoop({ type: 'bandpass', f: 2600, q: 0.7, gain: 0 });
  loops.spray = noiseLoop({ type: 'highpass', f: 2400, q: 0.3, gain: 0 });
  loops.engine = engineLoop();
  startMusic();
}
function noiseLoop({ type, f, q, gain }) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
  const filter = ctx.createBiquadFilter(); filter.type = type; filter.frequency.value = f; filter.Q.value = q;
  const g = ctx.createGain(); g.gain.value = gain;
  src.connect(filter); filter.connect(g); g.connect(master); src.start();
  return { src, filter, g };
}
function engineLoop() {
  const o1 = ctx.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 40;
  const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = 80;
  const nz = ctx.createBufferSource(); nz.buffer = noiseBuf; nz.loop = true;
  const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 900; nf.Q.value = 0.6;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
  const g = ctx.createGain(); g.gain.value = 0;
  o1.connect(lp); o2.connect(lp); nz.connect(nf); nf.connect(lp); lp.connect(g); g.connect(master);
  o1.start(); o2.start(); nz.start();
  return { o1, o2, nf, lp, g };
}
const now = () => ctx.currentTime;
export function setLoop(name, v, f) {
  if (!ctx || !loops[name]) return;
  const L = loops[name];
  L.g.gain.setTargetAtTime(v, now(), 0.05);
  if (f && L.filter) L.filter.frequency.setTargetAtTime(f, now(), 0.05);
}
export function setEngine(k) {
  if (!ctx) return;
  const E = loops.engine;
  E.g.gain.setTargetAtTime(k * 0.22, now(), 0.3);
  E.o1.frequency.setTargetAtTime(38 + k * 70, now(), 0.4);
  E.o2.frequency.setTargetAtTime(76 + k * 140, now(), 0.4);
  E.lp.frequency.setTargetAtTime(300 + k * 1500, now(), 0.4);
  E.nf.frequency.setTargetAtTime(600 + k * 1400, now(), 0.4);
}
function env(g, t, a, peak, dec) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); }
export function tone(freq, { type = 'sine', dur = 0.4, vol = 0.2, at = 0, slide = 0, a = 0.005 } = {}) {
  if (!ctx) return;
  const t = now() + at;
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
  const g = ctx.createGain(); env(g, t, a, vol, dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + a + dur + 0.05);
}
export function bell(freq, vol = 0.12, at = 0) {
  if (!ctx) return;
  const t = now() + at;
  const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
  car.frequency.value = freq; mod.frequency.value = freq * 3.5; mg.gain.setValueAtTime(freq * 2, t); mg.gain.exponentialRampToValueAtTime(1, t + 1.2);
  mod.connect(mg); mg.connect(car.frequency); car.connect(g); g.connect(master);
  env(g, t, 0.004, vol, 1.4);
  car.start(t); mod.start(t); car.stop(t + 1.6); mod.stop(t + 1.6);
}
export function noiseHit({ f = 800, q = 1, type = 'bandpass', dur = 0.25, vol = 0.3, at = 0, fEnd = 0 } = {}) {
  if (!ctx) return;
  const t = now() + at;
  const s = ctx.createBufferSource(); s.buffer = noiseBuf;
  const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
  if (fEnd) fl.frequency.exponentialRampToValueAtTime(fEnd, t + dur);
  const g = ctx.createGain(); env(g, t, 0.006, vol, dur);
  s.connect(fl); fl.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + dur + 0.1);
}
export const sfx = {
  plop() { noiseHit({ f: 300, q: 0.8, type: 'lowpass', dur: 0.18, vol: 0.35 }); tone(110, { dur: 0.12, vol: 0.15, slide: 0.6 }); },
  powder() { noiseHit({ f: 3500, q: 0.5, dur: 0.3, vol: 0.12, fEnd: 1200 }); },
  slide() { noiseHit({ f: 900, q: 0.4, type: 'lowpass', dur: 1.6, vol: 0.45, fEnd: 200 }); tone(70, { dur: 1.2, vol: 0.2, slide: 0.5 }); },
  crack() { for (let i = 0; i < 3; i++) tone(2400 + Math.random() * 1800, { dur: 0.05, vol: 0.05, at: i * 0.04, type: 'triangle' }); },
  sizzle() { noiseHit({ f: 5000, q: 2, dur: 0.05 + Math.random() * 0.06, vol: 0.05 + Math.random() * 0.05 }); },
  drip() { tone(900 + Math.random() * 500, { dur: 0.08, vol: 0.05, slide: 1.8 }); },
  ping(i = 0) { const s = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760]; bell(s[i % s.length], 0.1); },
  pick() { tone(660, { dur: 0.08, vol: 0.12, type: 'triangle' }); tone(990, { dur: 0.1, vol: 0.1, type: 'triangle', at: 0.06 }); },
  huh() { tone(330, { dur: 0.25, vol: 0.12, type: 'triangle', slide: 1.5 }); },
  brrr() { for (let i = 0; i < 10; i++) tone(180 + (i % 2) * 30, { dur: 0.05, vol: 0.08, at: i * 0.055, type: 'square' }); },
  freeze() { noiseHit({ f: 6000, q: 0.6, type: 'highpass', dur: 0.6, vol: 0.25 }); for (let i = 0; i < 5; i++) tone(1800 + i * 300, { dur: 0.25, vol: 0.05, at: i * 0.05, type: 'triangle' }); },
  sneeze() { noiseHit({ f: 1400, q: 1.5, dur: 0.12, vol: 0.2, at: 0.0 }); noiseHit({ f: 2400, q: 0.8, dur: 0.35, vol: 0.35, at: 0.35, fEnd: 700 }); },
  whoosh() { noiseHit({ f: 700, q: 1.2, dur: 0.35, vol: 0.12, fEnd: 2200 }); },
  pop() { tone(500, { dur: 0.1, vol: 0.15, slide: 2.2, type: 'triangle' }); },
  thud() { tone(90, { dur: 0.2, vol: 0.25, slide: 0.5 }); noiseHit({ f: 250, type: 'lowpass', dur: 0.15, vol: 0.2 }); },
  wear() { noiseHit({ f: 1800, q: 0.6, dur: 0.35, vol: 0.15, fEnd: 600 }); tone(523, { dur: 0.15, vol: 0.1, at: 0.25, type: 'triangle' }); tone(784, { dur: 0.25, vol: 0.1, at: 0.37, type: 'triangle' }); },
  fanfare() { [523, 659, 784, 1047].forEach((f, i) => bell(f, 0.13, i * 0.13)); bell(1319, 0.1, 0.62); bell(1047, 0.1, 0.62); },
};

// gentle music box: pentatonic arpeggios over four chords
let musicOn = false;
function startMusic() {
  if (musicOn) return; musicOn = true;
  const chords = [[261.6, 329.6, 392.0, 523.3], [220.0, 261.6, 329.6, 440.0], [174.6, 220.0, 261.6, 349.2], [196.0, 246.9, 293.7, 392.0]];
  let step = 0;
  const tick = () => {
    if (!ctx) return;
    const ch = chords[Math.floor(step / 8) % 4];
    const n = ch[[0, 2, 1, 3, 2, 1, 3, 2][step % 8]] * 2;
    if (A.music !== false) bell(n, 0.028 + (step % 8 === 0 ? 0.012 : 0));
    step++;
    setTimeout(tick, 420);
  };
  setTimeout(tick, 800);
}
