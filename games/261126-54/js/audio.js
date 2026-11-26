// All sounds are synthesised (no files): knife scrape, cream squish, pour, sugar sift,
// berry plop, bell, door chime, cheer chimes, and wordless child/adult voices (formant vowels).
let ctx = null, master = null, noiseBuf = null;
export function audioUnlock() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.8;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -12; comp.ratio.value = 4;
    master.connect(comp); comp.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
}
const now = () => ctx.currentTime;
function noise(dur, f, q, type = 'bandpass', gain = 0.3, t0 = 0) {
  if (!ctx) return null;
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
  const g = ctx.createGain(); g.gain.value = 0;
  s.connect(fl); fl.connect(g); g.connect(master);
  const t = now() + t0;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
  s.start(t, Math.random()); s.stop(t + dur + 0.05);
  return { s, fl, g };
}
function tone(f, dur, type = 'sine', gain = 0.2, t0 = 0, f2 = null) {
  if (!ctx) return;
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = f;
  const g = ctx.createGain();
  o.connect(g); g.connect(master);
  const t = now() + t0;
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
  o.start(t); o.stop(t + dur + 0.05);
}

// continuous loops with controllable level (scrape / pour / sift)
const loops = {};
function loop(name, setup) {
  if (!ctx) return null;
  if (loops[name]) return loops[name];
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  const fl = ctx.createBiquadFilter();
  const g = ctx.createGain(); g.gain.value = 0;
  s.connect(fl); fl.connect(g); g.connect(master);
  setup(fl);
  s.start();
  loops[name] = { s, fl, g, lvl: 0 };
  return loops[name];
}
export function setLoop(name, level, pitch = 1) {
  if (!ctx) return;
  const cfg = {
    scrape: (fl) => { fl.type = 'bandpass'; fl.frequency.value = 2400; fl.Q.value = 1.2; },
    pour: (fl) => { fl.type = 'lowpass'; fl.frequency.value = 380; fl.Q.value = 6; },
    sift: (fl) => { fl.type = 'highpass'; fl.frequency.value = 5000; fl.Q.value = 0.7; },
  }[name];
  const l = loop(name, cfg);
  const t = now();
  l.g.gain.cancelScheduledValues(t);
  l.g.gain.setTargetAtTime(level * (name === 'pour' ? 0.5 : name === 'sift' ? 0.12 : 0.18), t, 0.04);
  if (name === 'scrape') l.fl.frequency.setTargetAtTime(1800 + pitch * 1400, t, 0.05);
  if (name === 'pour') l.fl.frequency.setTargetAtTime(260 + Math.sin(t * 9) * 80 + pitch * 100, t, 0.03);
}

export const sfx = {
  squish() { noise(0.18, 600, 2, 'lowpass', 0.35); tone(140, 0.12, 'sine', 0.12, 0, 90); },
  scoop() { noise(0.25, 900, 1.5, 'lowpass', 0.3); tone(220, 0.15, 'sine', 0.08, 0.05, 140); },
  plop() { tone(520, 0.09, 'sine', 0.25, 0, 260); noise(0.06, 1800, 3, 'bandpass', 0.1); },
  pipe() { noise(0.3, 700, 3, 'lowpass', 0.3); tone(300, 0.25, 'triangle', 0.05, 0, 200); },
  pop() { noise(0.12, 1200, 0.8, 'bandpass', 0.6); tone(180, 0.18, 'sine', 0.3, 0, 60); noise(0.5, 500, 1, 'lowpass', 0.25, 0.05); },
  wipe() { noise(0.16, 3000, 0.9, 'bandpass', 0.12); },
  bell() { [1, 2.76, 5.4].forEach((m, i) => tone(1320 * m, 1.4 - i * 0.3, 'sine', 0.12 / (i + 1))); },
  door() { [0, 0.12, 0.24].forEach((d, i) => { tone(1568 * [1, 1.26, 1.5][i], 1.0, 'sine', 0.08, d); tone(1568 * [1, 1.26, 1.5][i] * 2.7, 0.4, 'sine', 0.02, d); }); },
  sparkle() { for (let i = 0; i < 6; i++) tone(1200 + i * 220 + Math.random() * 100, 0.35, 'sine', 0.05, i * 0.06); },
  fanfare() { [523, 659, 784, 1047].forEach((f, i) => { tone(f, 0.5, 'triangle', 0.1, i * 0.12); tone(f * 2, 0.3, 'sine', 0.03, i * 0.12); }); },
  whoosh() { const n = noise(0.45, 400, 0.8, 'bandpass', 0.2); if (n) n.fl.frequency.exponentialRampToValueAtTime(2400, now() + 0.4); },
  tick() { tone(1800, 0.04, 'sine', 0.06); },
  hatOn() { tone(660, 0.12, 'sine', 0.12); tone(990, 0.18, 'sine', 0.1, 0.08); noise(0.1, 2000, 1, 'bandpass', 0.06); },
};

// wordless voices: a vowel = glottal pulse train through 2 formant filters
const VOW = { a: [850, 1600], o: [500, 900], u: [350, 800], e: [550, 2000], i: [320, 2600] };
export function voice(seq, { pitch = 300, rate = 1, gain = 0.22 } = {}) {
  if (!ctx) return;
  let t = 0;
  for (const s of seq) {
    // s: [vowel, dur, pitchMul, glideTo]
    const [v, d0, pm = 1, pg = null, breath = 0] = s;
    const d = d0 / rate;
    if (v === '_') { t += d; continue; }
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    const f0 = pitch * pm;
    const tt = now() + t;
    o.frequency.setValueAtTime(f0, tt);
    if (pg) o.frequency.exponentialRampToValueAtTime(pitch * pg, tt + d);
    const vib = ctx.createOscillator(); vib.frequency.value = 5.5; const vg = ctx.createGain(); vg.gain.value = f0 * 0.02; vib.connect(vg); vg.connect(o.frequency);
    const g = ctx.createGain(); g.gain.value = 0;
    const out = ctx.createGain(); out.gain.value = 1;
    const [F1, F2] = VOW[v];
    const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = F1 * (pitch > 250 ? 1.15 : 1); f1.Q.value = 6;
    const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = F2 * (pitch > 250 ? 1.15 : 1); f2.Q.value = 8;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3500;
    o.connect(g); g.connect(f1); g.connect(f2); f1.connect(out); f2.connect(out); out.connect(lp); lp.connect(master);
    g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(gain, tt + 0.03); g.gain.setValueAtTime(gain, tt + d * 0.7); g.gain.exponentialRampToValueAtTime(0.0005, tt + d);
    o.start(tt); o.stop(tt + d + 0.05); vib.start(tt); vib.stop(tt + d + 0.05);
    if (breath) noise(d, 1500, 1, 'bandpass', 0.05 * breath, t);
    t += d * 0.92;
  }
}
export const voices = {
  girlWow: () => voice([['o', 0.18, 1.0], ['a', 0.45, 1.25, 1.5]], { pitch: 330 }),
  girlYay: () => voice([['i', 0.12, 1.1], ['e', 0.35, 1.4, 1.2]], { pitch: 340 }),
  girlHmm: () => voice([['u', 0.4, 1.0, 1.1]], { pitch: 300, gain: 0.12 }),
  girlGiggle: () => voice([['i', 0.1, 1.3], ['_', 0.05], ['i', 0.1, 1.35], ['_', 0.05], ['i', 0.12, 1.4], ['_', 0.05], ['i', 0.15, 1.3, 1.1]], { pitch: 340, gain: 0.16 }),
  girlHm: () => voice([['u', 0.15, 1.0], ['u', 0.2, 1.2]], { pitch: 320, gain: 0.12 }),
  papaOops: () => voice([['u', 0.16, 1.0], ['a', 0.5, 1.3, 0.9]], { pitch: 120 }),
  papaLaugh: () => voice([['a', 0.13, 1.1], ['_', 0.06], ['a', 0.13, 1.05], ['_', 0.06], ['a', 0.18, 1.0, 0.9]], { pitch: 115, gain: 0.2 }),
  papaHo: () => voice([['o', 0.3, 1.0, 1.2]], { pitch: 120 }),
  mamaHm: () => voice([['u', 0.2, 1.0], ['a', 0.3, 1.2, 1.1]], { pitch: 220 }),
  custYay: (p = 200) => voice([['a', 0.2, 1.0], ['a', 0.35, 1.3, 1.1]], { pitch: p }),
  custHuh: (p = 200) => voice([['e', 0.35, 1.0, 1.4]], { pitch: p }),
};
