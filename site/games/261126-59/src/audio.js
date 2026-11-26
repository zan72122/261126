// All sound is synthesized with WebAudio (no files): rain, rubbing, squeaks, drips, robot beeps,
// and wordless voices (formant "oh!", "wow!", "huh?") for the girl and dad.
let ctx = null, master = null, rainGain = null, rubGain = null, rubFilt = null, noiseBuf = null;

export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0); let b = 0;
  for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; b = 0.97 * b + 0.03 * w; d[i] = w * 0.5 + b * 2.0; }
  // rain bed
  const rn = ctx.createBufferSource(); rn.buffer = noiseBuf; rn.loop = true;
  const rf = ctx.createBiquadFilter(); rf.type = 'bandpass'; rf.frequency.value = 1400; rf.Q.value = 0.4;
  rainGain = ctx.createGain(); rainGain.gain.value = 0.0; rn.connect(rf); rf.connect(rainGain); rainGain.connect(master); rn.start();
  rainGain.gain.setTargetAtTime(0.10, ctx.currentTime, 1.5);
  // rub bed (gain follows finger speed)
  const rb = ctx.createBufferSource(); rb.buffer = noiseBuf; rb.loop = true;
  rubFilt = ctx.createBiquadFilter(); rubFilt.type = 'bandpass'; rubFilt.frequency.value = 2500; rubFilt.Q.value = 1.2;
  rubGain = ctx.createGain(); rubGain.gain.value = 0; rb.connect(rubFilt); rubFilt.connect(rubGain); rubGain.connect(master); rb.start();
  rainTick();
}
function rainTick() {
  if (!ctx) return;
  if (rainGain && rainGain.gain.value > 0.03 && Math.random() < 0.7) tone(2000 + Math.random() * 2500, 0.03, 'sine', 0.012 * Math.random(), -1500);
  setTimeout(rainTick, 40 + Math.random() * 120);
}
export function setRain(v) { if (rainGain) rainGain.gain.setTargetAtTime(0.1 * v, ctx.currentTime, 1.2); }
export function rub(speed, kind) {
  if (!ctx) return;
  const v = Math.min(1, speed);
  const f = kind === 'brush' ? 4200 : kind === 'cloth' ? 1500 : 900;
  rubFilt.frequency.setTargetAtTime(f + v * 800, ctx.currentTime, 0.05);
  rubGain.gain.setTargetAtTime(v * (kind === 'brush' ? 0.22 : 0.14), ctx.currentTime, 0.04);
}
function tone(freq, dur, type = 'sine', vol = 0.2, slide = 0, delay = 0) {
  if (!ctx) return; vol = Math.max(vol, 0.0005);
  const t0 = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.05);
}
function noise(dur, f, q, vol, delay = 0, slide = 0) {
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; const bf = ctx.createBiquadFilter(); bf.type = 'bandpass'; bf.frequency.setValueAtTime(f, t0); bf.Q.value = q;
  if (slide) bf.frequency.exponentialRampToValueAtTime(Math.max(60, f + slide), t0 + dur);
  vol = Math.max(vol, 0.0005); const g = ctx.createGain(); g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(bf); bf.connect(g); g.connect(master); s.start(t0, Math.random()); s.stop(t0 + dur + 0.05);
}
export const sfx = {
  tap: () => tone(880, 0.08, 'sine', 0.1),
  swish: () => noise(0.35, 1800, 0.8, 0.25, 0, 2500),
  creak: () => { if (!ctx) return; const t0 = ctx.currentTime; const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(70, t0); for (let i = 0; i < 12; i++) o.frequency.setValueAtTime(60 + Math.random() * 50, t0 + i * 0.07); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 3; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.3, t0 + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9); o.connect(f); f.connect(g); g.connect(master); o.start(); o.stop(t0 + 1); },
  thump: () => { tone(90, 0.25, 'sine', 0.35, -40); noise(0.15, 300, 1, 0.2); },
  squeak: (rust = 1) => { const f = 1400 + Math.random() * 600; tone(f, 0.12 + rust * 0.18, 'square', 0.03 * rust + 0.005, f * 0.3); tone(f * 1.5, 0.1 + rust * 0.1, 'sine', 0.04 * rust, -f * 0.2, 0.05); },
  servo: () => { tone(420, 0.16, 'sawtooth', 0.03, 180); },
  drip: () => tone(1100 + Math.random() * 500, 0.12, 'sine', 0.12, -600),
  plink: () => tone(1700 + Math.random() * 600, 0.18, 'sine', 0.1, -300),
  splash: () => noise(0.2, 2500, 0.7, 0.12),
  sparkle: () => { for (let i = 0; i < 3; i++) tone(2400 + i * 600 + Math.random() * 200, 0.25, 'sine', 0.05, 0, i * 0.06); },
  powder: () => noise(0.06, 5000, 1.5, 0.05),
  beep: (mood = 'happy') => {
    const seq = mood === 'happy' ? [660, 880, 990, 1320] : mood === 'sad' ? [600, 500, 420] : mood === 'q' ? [500, 760] : [700, 900, 700];
    seq.forEach((f, i) => tone(f, 0.12, 'square', 0.04, 0, i * 0.11));
  },
  bootup: () => { [220, 330, 440, 660, 880].forEach((f, i) => tone(f, 0.18, 'triangle', 0.08, 0, i * 0.12)); noise(0.5, 3000, 0.5, 0.05); },
  whee: () => { tone(500, 0.9, 'sine', 0.08, 700); tone(520, 0.9, 'triangle', 0.04, 760, 0.02); },
  glug: () => { for (let i = 0; i < 6; i++) tone(300 + Math.random() * 120, 0.08, 'sine', 0.12, -120, i * 0.13); },
  chime: () => { [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.6, 'sine', 0.09, 0, i * 0.1)); },
  fanfare: () => { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => { tone(f, 0.3, 'triangle', 0.09, 0, i * 0.14); tone(f * 2, 0.2, 'sine', 0.03, 0, i * 0.14); }); },
  birds: () => { for (let i = 0; i < 4; i++) tone(3000 + Math.random() * 1500, 0.09, 'sine', 0.04, 900, i * 0.13 + Math.random() * 0.05); },
  zip: () => noise(0.25, 3000, 2, 0.15, 0, 3000),
  wipe: () => noise(0.18, 1200, 1, 0.12, 0, 600),
};

// wordless voice: a formant vowel glide. who: 'girl' | 'dad'
const VOW = { a: [850, 1600], o: [500, 900], u: [350, 900], e: [550, 2000], i: [320, 2700] };
export function voice(who, kind) {
  if (!ctx) return;
  const base = who === 'girl' ? 330 : 135;
  const shapes = {
    wow: [['o', 1.0, 1.25, 0.45]], yay: [['a', 1.1, 1.5, 0.35], ['e', 1.5, 1.2, 0.25]], huh: [['a', 0.9, 1.4, 0.3]],
    oops: [['o', 1.3, 0.9, 0.2], ['o', 1.1, 0.8, 0.3]], hmm: [['u', 1.0, 1.0, 0.4]], giggle: [['i', 1.3, 1.4, 0.08], ['i', 1.4, 1.3, 0.08], ['i', 1.3, 1.2, 0.08]],
    here: [['e', 1.0, 1.1, 0.2], ['o', 1.1, 0.9, 0.25]], uh: [['a', 1.0, 0.85, 0.3]],
  }[kind] || [['a', 1, 1, 0.3]];
  let t0 = ctx.currentTime;
  for (const [v, p0, p1, dur] of shapes) {
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(base * p0, t0); o.frequency.linearRampToValueAtTime(base * p1, t0 + dur);
    const vib = ctx.createOscillator(), vg = ctx.createGain(); vib.frequency.value = 5.5; vg.gain.value = base * 0.02; vib.connect(vg); vg.connect(o.frequency);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(who === 'girl' ? 0.12 : 0.16, t0 + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    const sum = ctx.createGain(); sum.gain.value = 1;
    for (const [i, f] of VOW[v].entries()) { const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * (who === 'girl' ? 1.15 : 0.9); bp.Q.value = 6; const bg = ctx.createGain(); bg.gain.value = i ? 0.6 : 1.2; o.connect(bp); bp.connect(bg); bg.connect(sum); }
    sum.connect(g); g.connect(master);
    o.start(t0); vib.start(t0); o.stop(t0 + dur + 0.05); vib.stop(t0 + dur + 0.05);
    t0 += dur * 0.85;
  }
}
