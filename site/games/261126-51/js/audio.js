// All sound is synthesised (no files): brush/roller swish, can clunk, splash, chimes,
// a sparrow, little voices (formant-filtered), and a soft plucked garden tune.
let ctx = null, master = null, musicG = null, noiseBuf = null;
export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
  musicG = ctx.createGain(); musicG.gain.value = 0.16; musicG.connect(master);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  initSwish();
  startMusic();
}
const now = () => ctx.currentTime;

function env(g, t, a, d, peak) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
function noise(t, dur, freq, q, peak, type = 'bandpass') {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); env(g, t, 0.005, dur, peak);
  s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + dur + 0.1);
  return f;
}
function tone(t, f, dur, peak, type = 'sine', dest = master) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
  const g = ctx.createGain(); env(g, t, 0.01, dur, peak); o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
  return o;
}

// ---- continuous swish while painting (gain follows stroke speed)
let sw = null;
function initSwish() {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.8;
  const f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = 4000;
  const g = ctx.createGain(); g.gain.value = 0;
  s.connect(f); f.connect(f2); f2.connect(g); g.connect(master); s.start();
  sw = { f, g, f2 };
}
export function swish(speed, tool) {
  if (!ctx || !sw) return;
  const t = now();
  const v = Math.min(1, speed * (tool === 'roller' ? 0.9 : 1.4));
  sw.g.gain.setTargetAtTime(v * (tool === 'roller' ? 0.28 : 0.2), t, 0.03);
  sw.f.frequency.setTargetAtTime(tool === 'roller' ? 700 + v * 500 : 2200 + v * 1800, t, 0.05);
  sw.f.Q.value = tool === 'roller' ? 0.6 : 1.2;
}

export function sfx(name, arg) {
  if (!ctx) return;
  const t = now();
  switch (name) {
    case 'clunk': tone(t, 190, 0.18, 0.35, 'triangle'); tone(t, 420, 0.08, 0.12, 'sine'); noise(t, 0.05, 3000, 2, 0.15); break;
    case 'pick': tone(t, 660, 0.12, 0.12); tone(t + 0.06, 990, 0.15, 0.1); break;
    case 'dab': noise(t, 0.08, 900, 1, 0.25, 'lowpass'); break;
    case 'stamp': noise(t, 0.06, 500, 1, 0.4, 'lowpass'); tone(t, 140, 0.1, 0.25, 'sine'); break;
    case 'splash': {
      noise(t, 0.6, 600, 0.7, 0.5, 'lowpass');
      for (let i = 0; i < 8; i++) { const o = tone(t + 0.05 + i * 0.05, 300 + Math.random() * 500, 0.08, 0.08); o.frequency.exponentialRampToValueAtTime(1200, t + 0.12 + i * 0.05); }
      break;
    }
    case 'wipe': noise(t, 0.12, 2600, 0.9, 0.18); break;
    case 'chime': [784, 988, 1175, 1568].forEach((f, i) => { tone(t + i * 0.09, f, 0.7, 0.13); tone(t + i * 0.09, f * 2, 0.4, 0.03); }); break;
    case 'big': [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => { tone(t + i * 0.08, f, 1.0, 0.12, 'triangle'); }); break;
    case 'pop': { const o = tone(t, 500, 0.1, 0.2); o.frequency.exponentialRampToValueAtTime(1200, t + 0.08); break; }
    case 'sparkle': for (let i = 0; i < 5; i++) tone(t + i * 0.05, 1800 + Math.random() * 1600, 0.25, 0.04); break;
    case 'whoosh': { const f = noise(t, 0.4, 400, 1, 0.2); f.frequency.exponentialRampToValueAtTime(2400, t + 0.35); break; }
    case 'wobble': for (let i = 0; i < 4; i++) tone(t + i * 0.12, 160 + (i % 2) * 40, 0.1, 0.15, 'triangle'); break;
    case 'soil': noise(t, 0.15, 400, 0.8, 0.25, 'lowpass'); break;
    case 'bird': {
      const n = 3 + (Math.random() * 3 | 0);
      for (let i = 0; i < n; i++) {
        const st = t + i * 0.13, o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.setValueAtTime(3200 + Math.random() * 800, st); o.frequency.exponentialRampToValueAtTime(5200 + Math.random() * 900, st + 0.05); o.frequency.exponentialRampToValueAtTime(3000, st + 0.09);
        env(g, st, 0.005, 0.09, 0.07); o.connect(g); g.connect(master); o.start(st); o.stop(st + 0.12);
      }
      break;
    }
    case 'flap': for (let i = 0; i < 6; i++) noise(t + i * 0.06, 0.04, 900, 1, 0.12); break;
  }
}

// ---- little voices: a sawtooth glottal source through vowel formants with a pitch contour
const VOW = { a: [850, 1600, 3200], i: [350, 2700, 3600], u: [380, 1100, 2600], e: [550, 2300, 3200], o: [550, 950, 2700] };
export function voice(who, kind) {
  if (!ctx) return;
  const t = now();
  const kid = who === 'girl';
  const base = kid ? 330 : 125, sc = kid ? 1.25 : 0.9;
  const P = {
    yay: { v: ['a', 'a'], c: [1, 1.5, 1.25], d: 0.45 },
    wow: { v: ['u', 'a'], c: [1, 1.35, 1.05], d: 0.5 },
    giggle: { v: ['i', 'i', 'i'], c: [1.3, 1.1, 1.35, 1.1, 1.3], d: 0.45, chop: 5 },
    huh: { v: ['a', 'e'], c: [0.95, 1.3], d: 0.35 },
    oops: { v: ['o', 'a', 'a'], c: [1.2, 0.9, 1.4, 0.7], d: 0.8 },
    laugh: { v: ['a', 'a', 'a'], c: [1.2, 1.0, 1.15, 0.95, 1.1], d: 0.6, chop: 4 },
    hmm: { v: ['u'], c: [1, 1.05, 0.95], d: 0.35 },
  }[kind] || { v: ['a'], c: [1, 1.2], d: 0.3 };
  const src = ctx.createOscillator(); src.type = 'sawtooth';
  const vib = ctx.createOscillator(); vib.frequency.value = 6; const vg = ctx.createGain(); vg.gain.value = base * 0.02; vib.connect(vg); vg.connect(src.frequency);
  P.c.forEach((k, i) => src.frequency.linearRampToValueAtTime(base * k, t + P.d * i / (P.c.length - 1 || 1)));
  const out = ctx.createGain(); out.gain.value = 0;
  const amp = ctx.createGain(); amp.gain.value = 1;
  const fs = [0, 1, 2].map(j => { const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 6 + j * 2; src.connect(f); f.connect(amp); return f; });
  P.v.forEach((v, i) => fs.forEach((f, j) => f.frequency.linearRampToValueAtTime(VOW[v][j] * sc, t + P.d * (i + 0.5) / P.v.length)));
  amp.connect(out); out.connect(master);
  out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(kid ? 0.32 : 0.36, t + 0.04);
  if (P.chop) for (let i = 0; i < P.chop; i++) { const a = t + P.d * i / P.chop; out.gain.setValueAtTime(0.34, a); out.gain.linearRampToValueAtTime(0.03, a + P.d / P.chop * 0.85); }
  out.gain.setValueAtTime(0.3, t + P.d - 0.06); out.gain.linearRampToValueAtTime(0, t + P.d);
  src.start(t); vib.start(t); src.stop(t + P.d + 0.05); vib.stop(t + P.d + 0.05);
}

// ---- gentle plucked tune (Karplus-Strong rendered once into buffers)
const notes = {};
function pluck(f) {
  if (notes[f]) return notes[f];
  const sr = ctx.sampleRate, len = Math.floor(sr * 1.6), b = ctx.createBuffer(1, len, sr), d = b.getChannelData(0);
  const N = Math.floor(sr / f), ring = new Float32Array(N); for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1;
  let p = 0;
  for (let i = 0; i < len; i++) { const nx = (p + 1) % N; const v = (ring[p] + ring[nx]) * 0.4985; d[i] = ring[p]; ring[p] = v; p = nx; }
  return (notes[f] = b);
}
function playNote(f, t, g = 1) { const s = ctx.createBufferSource(); s.buffer = pluck(f); const gg = ctx.createGain(); gg.gain.value = g; s.connect(gg); gg.connect(musicG); s.start(t); }
function startMusic() {
  const sc = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3];
  const prog = [[0, 2, 4], [3, 5, 7], [4, 6, 1], [3, 5, 0]];
  let bar = 0, next = now() + 0.3;
  const tick = () => {
    if (!ctx) return;
    while (next < now() + 1.0) {
      const ch = prog[bar % 4], beat = 0.42;
      for (let i = 0; i < 8; i++) {
        const t = next + i * beat;
        if (i % 2 === 0) playNote(sc[ch[0]] / 2, t, 0.8);
        if (Math.random() < 0.75) playNote(sc[ch[(i + bar) % 3]] * (i % 4 === 3 ? 2 : 1), t + (i % 2 ? 0.02 : 0), 0.55);
      }
      next += 8 * 0.42; bar++;
    }
    setTimeout(tick, 400);
  };
  tick();
}
export function musicLevel(v) { if (musicG) musicG.gain.setTargetAtTime(v, now(), 0.5); }
