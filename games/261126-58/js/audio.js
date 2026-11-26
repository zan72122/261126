// Synthesised sounds and voices (WebAudio, no files).
let ctx = null, master = null, musicGain = null, ambGain = null, noiseBuf = null;

export function unlockAudio() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3;
  master.disconnect(); master.connect(comp); comp.connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  musicGain = ctx.createGain(); musicGain.gain.value = 0.0; musicGain.connect(master);
  ambGain = ctx.createGain(); ambGain.gain.value = 0.0; ambGain.connect(master);
  startMusic(); startCrickets();
}
const now = () => ctx.currentTime;

function env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
function noise(t, dur, f, q, peak, type = 'bandpass', dest = master, a = 0.005) {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.playbackRate.value = 0.8 + Math.random() * 0.4;
  const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
  const g = ctx.createGain(); env(g, t, a, peak, dur);
  s.connect(fl); fl.connect(g); g.connect(dest); s.start(t, Math.random() * 0.5); s.stop(t + dur + a + 0.05);
  return fl;
}
function tone(t, f, dur, peak, type = 'sine', dest = master, a = 0.004, f2) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  const g = ctx.createGain(); env(g, t, a, peak, dur);
  o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + a + 0.05);
  return o;
}

export const sfx = {
  scrape() { if (!ctx) return; const t = now(); const f = noise(t, 0.12, 700 + Math.random() * 500, 1.2, 0.12); f.frequency.exponentialRampToValueAtTime(300, t + 0.12); },
  squish() { if (!ctx) return; const t = now(); noise(t, 0.18, 400, 2, 0.25, 'lowpass'); tone(t, 180, 0.12, 0.08, 'sine', master, 0.01, 90); },
  plop() { if (!ctx) return; const t = now(); tone(t, 320, 0.09, 0.3, 'sine', master, 0.003, 120); noise(t + 0.02, 0.15, 900, 1.5, 0.12, 'lowpass'); },
  lid() { if (!ctx) return; const t = now(); noise(t, 0.25, 600, 3, 0.18); tone(t + 0.12, 520, 0.08, 0.15, 'sine', master, 0.002, 260); },
  tap() { if (!ctx) return; const t = now(); tone(t, 210 + Math.random() * 30, 0.08, 0.35, 'triangle', master, 0.001, 120); noise(t, 0.04, 2500, 1, 0.12, 'highpass'); },
  pop() { if (!ctx) return; const t = now(); tone(t, 700, 0.07, 0.35, 'sine', master, 0.001, 240); noise(t, 0.06, 1500, 2, 0.15); },
  bonk() { if (!ctx) return; const t = now(); tone(t, 120, 0.2, 0.5, 'triangle', master, 0.001, 60); noise(t, 0.08, 800, 1, 0.3, 'lowpass'); },
  crack() { if (!ctx) return; const t = now(); for (let i = 0; i < 6; i++) noise(t + i * 0.018, 0.05, 1800 + i * 300, 2, 0.35 - i * 0.04); tone(t + 0.05, 90, 0.35, 0.4, 'sine', master, 0.002, 50); },
  tape() { if (!ctx) return; const t = now(); const f = noise(t, 0.35, 3000, 0.8, 0.12, 'bandpass', master, 0.02); f.frequency.linearRampToValueAtTime(5000, t + 0.3); },
  click() { if (!ctx) return; const t = now(); noise(t, 0.02, 3000, 3, 0.4); tone(t, 1600, 0.02, 0.15, 'square', master, 0.001); },
  strike() { if (!ctx) return; const t = now(); noise(t, 0.12, 2500, 1, 0.3); noise(t + 0.08, 0.6, 600, 0.6, 0.12, 'lowpass', master, 0.05); },
  whoosh() { if (!ctx) return; const t = now(); const f = noise(t, 0.4, 400, 0.7, 0.12, 'bandpass', master, 0.1); f.frequency.exponentialRampToValueAtTime(1500, t + 0.35); },
  sparkle() { if (!ctx) return; const t = now(); [1568, 2093, 2637, 3136].forEach((f, i) => tone(t + i * 0.06, f, 0.5, 0.06, 'sine', master, 0.003)); },
  chime() { if (!ctx) return; const t = now(); [784, 988, 1175, 1568].forEach((f, i) => { tone(t + i * 0.09, f, 0.9, 0.12, 'sine', master, 0.004); tone(t + i * 0.09, f * 2, 0.5, 0.03, 'sine', master, 0.004); }); },
  flame() { if (!ctx) return; const t = now(); noise(t, 0.5, 300, 0.7, 0.18, 'lowpass', master, 0.05); },
  step() { if (!ctx) return; const t = now(); noise(t, 0.08, 500, 1, 0.1, 'lowpass'); },
};

// formant voice: vowels for a child / man / woman
const VOW = { a: [850, 1610, 2900], i: [330, 2700, 3400], u: [380, 1200, 2700], e: [560, 2200, 3000], o: [520, 950, 2700], h: [700, 1300, 2600] };
function vowel(t, v, dur, f0a, f0b, gain, who) {
  const scale = who === 'girl' ? 1.25 : who === 'mama' ? 1.12 : 1.0;
  const o = ctx.createOscillator(); o.type = 'sawtooth';
  o.frequency.setValueAtTime(f0a, t); o.frequency.linearRampToValueAtTime(f0b, t + dur);
  const vib = ctx.createOscillator(); vib.frequency.value = 5.5; const vg = ctx.createGain(); vg.gain.value = f0a * 0.02; vib.connect(vg); vg.connect(o.frequency);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.03); g.gain.setValueAtTime(gain, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const sum = ctx.createGain(); sum.gain.value = 1;
  VOW[v].forEach((F, i) => { const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = F * scale; bp.Q.value = 8 + i * 3; const fg = ctx.createGain(); fg.gain.value = [1, 0.6, 0.25][i]; o.connect(bp); bp.connect(fg); fg.connect(sum); });
  sum.connect(g); g.connect(master);
  o.start(t); vib.start(t); o.stop(t + dur + 0.05); vib.stop(t + dur + 0.05);
}
const PITCH = { girl: 330, mama: 230, papa: 120 };
export function voice(who, kind) {
  if (!ctx) return 0;
  const t = now() + 0.02, p = PITCH[who] * (0.95 + Math.random() * 0.1), G = who === 'papa' ? 0.5 : 0.38;
  const seq = {
    wow: [['u', 0.12, 1.0, 1.3], ['a', 0.45, 1.4, 1.05]],
    yay: [['i', 0.12, 1.2, 1.4], ['e', 0.35, 1.5, 1.3]],
    giggle: [['e', 0.08, 1.3, 1.2], ['h', 0.04, 1.0, 1.0], ['e', 0.08, 1.25, 1.15], ['h', 0.04, 1, 1], ['e', 0.1, 1.2, 1.0]],
    huh: [['a', 0.14, 1.0, 1.0], ['e', 0.26, 1.0, 1.45]],
    oops: [['o', 0.12, 1.1, 1.1], ['o', 0.3, 1.25, 0.85]],
    hm: [['u', 0.3, 1.0, 1.15]],
    ooh: [['o', 0.5, 0.95, 1.25]],
    laugh: [['a', 0.1, 1.2, 1.1], ['h', 0.05, 1, 1], ['a', 0.1, 1.15, 1.05], ['h', 0.05, 1, 1], ['a', 0.12, 1.1, 0.95]],
  }[kind] || [['a', 0.3, 1, 1]];
  let tt = t, total = 0;
  for (const [v, d, a, b] of seq) { if (v === 'h') noise(tt, d, 1800, 0.8, 0.06); else vowel(tt, v, d, p * a, p * b, G, who); tt += d + 0.02; total += d + 0.02; }
  return total;
}

// gentle music-box loop (pentatonic, slow)
function startMusic() {
  const notes = [0, 4, 7, 9, 12, 9, 7, 4, 2, 7, 11, 14, 12, 7, 4, 2];
  const base = 523.25 / 2;
  let i = 0;
  const step = () => {
    if (!ctx) return;
    const t = now() + 0.05;
    const n = notes[i % notes.length]; i++;
    const f = base * Math.pow(2, n / 12) * 2;
    tone(t, f, 1.4, 0.05, 'sine', musicGain, 0.003); tone(t, f * 2, 0.6, 0.015, 'sine', musicGain, 0.003); tone(t, f * 3.01, 0.3, 0.006, 'sine', musicGain, 0.003);
    if (i % 4 === 1) tone(t, base * Math.pow(2, [0, -3, -5, -7][(i >> 2) % 4] / 12), 2.6, 0.035, 'triangle', musicGain, 0.02);
    setTimeout(step, 520);
  };
  step();
}
function startCrickets() {
  const chirp = () => {
    if (!ctx) return;
    const t = now() + 0.02;
    const f = 4200 + Math.random() * 600;
    for (let k = 0; k < 3; k++) tone(t + k * 0.05, f, 0.025, 0.03, 'sine', ambGain, 0.002);
    setTimeout(chirp, 350 + Math.random() * 900);
  };
  chirp();
}
export function setMusic(v) { if (musicGain) musicGain.gain.setTargetAtTime(v, now(), 0.8); }
export function setAmbience(v) { if (ambGain) ambGain.gain.setTargetAtTime(v, now(), 1.2); }
