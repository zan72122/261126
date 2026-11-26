// all sounds synthesized with WebAudio (no files): brush swish, taps, cracks, chimes, wordless voices, desert wind
let ctx = null, master = null, noiseBuf = null, brushNode = null, brushGain = null, windGain = null;
export function audioUnlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0.9;
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
  master.connect(comp); comp.connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  // continuous brush noise (gain driven by brushing speed)
  brushNode = ctx.createBufferSource(); brushNode.buffer = noiseBuf; brushNode.loop = true;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3800; bp.Q.value = 0.7;
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1400;
  brushGain = ctx.createGain(); brushGain.gain.value = 0;
  brushNode.connect(bp); bp.connect(hp); hp.connect(brushGain); brushGain.connect(master); brushNode.start();
  // desert wind
  const w = ctx.createBufferSource(); w.buffer = noiseBuf; w.loop = true; w.playbackRate.value = 0.5;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = 0.4;
  windGain = ctx.createGain(); windGain.gain.value = 0.05;
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.09; const lg = ctx.createGain(); lg.gain.value = 0.03; lfo.connect(lg); lg.connect(windGain.gain); lfo.start();
  const lfo2 = ctx.createOscillator(); lfo2.frequency.value = 0.13; const lg2 = ctx.createGain(); lg2.gain.value = 160; lfo2.connect(lg2); lg2.connect(lp.frequency); lfo2.start();
  w.connect(lp); lp.connect(windGain); windGain.connect(master); w.start();
}
const now = () => ctx.currentTime;
export function brushLevel(v) { if (!ctx) return; brushGain.gain.setTargetAtTime(Math.min(0.5, v) * 0.55, now(), 0.04); }

function noiseBurst(t, dur, f, q, gain, type = 'bandpass') {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.playbackRate.value = 0.8 + Math.random() * 0.4;
  const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
  const g = ctx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  s.connect(fl); fl.connect(g); g.connect(master); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
}
function tone(t, f, dur, gain, type = 'sine', f2) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
}
export const sfx = {
  tap() { if (!ctx) return; const t = now(); tone(t, 2400 + Math.random() * 300, 0.07, 0.25, 'triangle'); noiseBurst(t, 0.05, 3000, 2, 0.25); tone(t, 180, 0.08, 0.2, 'sine', 90); },
  crack() { if (!ctx) return; const t = now(); noiseBurst(t, 0.18, 1800, 1.2, 0.6); noiseBurst(t + 0.02, 0.12, 5200, 3, 0.3); tone(t, 140, 0.15, 0.3, 'sine', 60); },
  breakRock() { if (!ctx) return; const t = now(); noiseBurst(t, 0.5, 900, 0.8, 0.8); noiseBurst(t + 0.03, 0.35, 2600, 1, 0.5); for (let i = 0; i < 6; i++) noiseBurst(t + 0.08 + i * 0.05 + Math.random() * 0.03, 0.06, 2000 + Math.random() * 2000, 4, 0.25); tone(t, 100, 0.3, 0.4, 'sine', 45); },
  thud() { if (!ctx) return; const t = now(); tone(t, 120, 0.12, 0.35, 'sine', 70); noiseBurst(t, 0.12, 500, 1, 0.3, 'lowpass'); },
  sandPour() { if (!ctx) return; const t = now(); for (let i = 0; i < 8; i++) noiseBurst(t + i * 0.04, 0.15, 3000 + Math.random() * 2000, 1, 0.08); },
  reveal() { if (!ctx) return; const t = now(); marimba(t, 784); marimba(t + 0.11, 1046); },
  pick() { if (!ctx) return; const t = now(); marimba(t, 659); marimba(t + 0.08, 880); marimba(t + 0.16, 1175); },
  clack() { if (!ctx) return; const t = now(); tone(t, 900, 0.05, 0.3, 'square'); tone(t, 1400, 0.04, 0.15, 'triangle'); noiseBurst(t, 0.04, 2400, 3, 0.2); },
  place(i = 0) { if (!ctx) return; const t = now(); sfx.clack(); const sc = [523, 587, 659, 784, 880, 1046, 1175, 1318]; marimba(t + 0.06, sc[i % sc.length]); },
  tumble() { if (!ctx) return; const t = now(); for (let i = 0; i < 14; i++) { const k = t + i * 0.07 + Math.random() * 0.05; tone(k, 700 + Math.random() * 900, 0.05, 0.2, 'square'); noiseBurst(k, 0.05, 2000, 2, 0.15); } tone(t + 0.1, 90, 0.4, 0.5, 'sine', 50); },
  fanfare() { if (!ctx) return; const t = now(); [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => marimba(t + i * 0.12 + (i > 3 ? 0.1 : 0), f, 0.35)); },
  step() { if (!ctx) return; const t = now(); noiseBurst(t, 0.07, 700, 1, 0.12, 'lowpass'); },
  pop() { if (!ctx) return; const t = now(); tone(t, 600, 0.12, 0.25, 'sine', 1200); },
  swoosh() { if (!ctx) return; const t = now(); const s = ctx.createBufferSource(); s.buffer = noiseBuf; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.5; f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(3000, t + 0.3); const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.15); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + 0.5); },
  chirp() { if (!ctx) return; const t = now(); const f = 1100 + Math.random() * 500; tone(t, f, 0.09, 0.18, 'sine', f * 1.5); tone(t + 0.11, f * 1.2, 0.12, 0.15, 'sine', f * 0.9); },
  coo() { if (!ctx) return; const t = now(); tone(t, 520, 0.3, 0.16, 'sine', 380); tone(t, 1040, 0.3, 0.04, 'sine', 760); },
};
function marimba(t, f, g = 0.3) {
  tone(t, f, 0.6, g, 'sine'); tone(t, f * 4, 0.12, g * 0.25, 'sine'); tone(t, f * 2.01, 0.25, g * 0.1, 'sine');
}
// wordless child / adult voice: formant-filtered glottal pulses
const VOW = { a: [850, 1600, 2900], e: [550, 2300, 3100], i: [350, 2700, 3400], o: [550, 1000, 2700], u: [400, 1100, 2600], h: [1200, 2000, 3000] };
function voice(t, seq, pitch, gain = 0.25) {
  // seq: [[vowel, dur, pitchMul]]
  const src = ctx.createOscillator(); src.type = 'sawtooth';
  const g = ctx.createGain(); g.gain.value = 0;
  const fs = [0, 1, 2].map(i => { const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = i === 0 ? 6 : 9; return f; });
  const mix = ctx.createGain(); mix.gain.value = 1;
  const vib = ctx.createOscillator(); vib.frequency.value = 5.5; const vg = ctx.createGain(); vg.gain.value = pitch * 0.02; vib.connect(vg); vg.connect(src.frequency); vib.start(t);
  src.connect(g); fs.forEach((f, i) => { g.connect(f); const fg = ctx.createGain(); fg.gain.value = [1, 0.6, 0.25][i]; f.connect(fg); fg.connect(mix); });
  mix.connect(master);
  let tt = t;
  for (const [v, dur, pm] of seq) {
    const F = VOW[v] || VOW.a;
    fs.forEach((f, i) => f.frequency.setTargetAtTime(F[i] * (pitch > 200 ? 1.15 : 1), tt, 0.02));
    src.frequency.setTargetAtTime(pitch * pm, tt, 0.03);
    const amp = v === 'h' ? gain * 0.15 : gain;
    g.gain.setTargetAtTime(amp, tt, 0.02);
    tt += dur;
    if (v === '-') g.gain.setTargetAtTime(0, tt - dur, 0.01);
  }
  g.gain.setTargetAtTime(0, tt, 0.04);
  src.start(t); src.stop(tt + 0.3); vib.stop(tt + 0.3);
}
export const say = {
  wow(p = 330) { if (!ctx) return; voice(now(), [['u', 0.06, 1], ['a', 0.28, 1.25], ['a', 0.18, 1.05]], p, 0.22); },
  yay(p = 340) { if (!ctx) return; voice(now(), [['i', 0.05, 1.1], ['a', 0.2, 1.35], ['i', 0.18, 1.5]], p, 0.24); },
  giggle(p = 360) { if (!ctx) return; const t = now(); for (let i = 0; i < 4; i++) voice(t + i * 0.13, [['h', 0.03, 1], ['i', 0.07, 1.3 - i * 0.05]], p, 0.16); },
  are(p = 320) { if (!ctx) return; voice(now(), [['a', 0.16, 1.0], ['e', 0.1, 1.05], ['e', 0.22, 1.35]], p, 0.2); }, // "あれ？"
  hmm(p = 300) { if (!ctx) return; voice(now(), [['u', 0.35, 1.0], ['u', 0.2, 0.92]], p, 0.12); },
  hup(p = 340) { if (!ctx) return; voice(now(), [['u', 0.05, 1.1], ['o', 0.12, 1.25]], p, 0.18); },
  papaOops() { if (!ctx) return; voice(now(), [['o', 0.1, 1.2], ['o', 0.1, 0.9], ['o', 0.12, 1.3], ['o', 0.1, 1.0], ['a', 0.25, 1.4]], 130, 0.25); },
  papaLaugh() { if (!ctx) return; const t = now(); for (let i = 0; i < 4; i++) voice(t + i * 0.16, [['h', 0.04, 1], ['a', 0.09, 1.1 - i * 0.04]], 125, 0.2); },
  papaYay() { if (!ctx) return; voice(now(), [['o', 0.08, 1], ['o', 0.3, 1.4]], 120, 0.25); },
};
