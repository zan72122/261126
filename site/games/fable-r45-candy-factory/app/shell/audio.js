// WebAudio の合成効果音（ファイルなし）。最初のタッチで鳴らせるようにする（iOS）。
export function createAudio() {
  let ctx = null, master = null, noiseBuf = null;
  let stretchOsc = null, stretchGain = null, stretchLfo = null;
  let lastTwistClick = 0;

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(comp).connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      // びよーん（続く音）：三角波＋ゆれ
      stretchOsc = ctx.createOscillator(); stretchOsc.type = 'triangle'; stretchOsc.frequency.value = 220;
      stretchLfo = ctx.createOscillator(); stretchLfo.frequency.value = 7;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 9;
      stretchLfo.connect(lfoGain).connect(stretchOsc.frequency);
      stretchGain = ctx.createGain(); stretchGain.gain.value = 0;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
      stretchOsc.connect(lp).connect(stretchGain).connect(master);
      stretchOsc.start(); stretchLfo.start();
      document.addEventListener('visibilitychange', () => {
        if (!ctx) return;
        if (document.hidden) ctx.suspend().catch(() => {}); else ctx.resume().catch(() => {});
      });
      return true;
    } catch (e) { ctx = null; return false; }
  }

  function env(g, t0, a, peak, dur) {
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  }
  function tone(type, f0, f1, dur, peak = 0.3, t0 = ctx.currentTime, a = 0.01) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
    env(g, t0, a, peak, dur);
    o.connect(g).connect(master);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function noise(dur, freq, q, peak = 0.3, t0 = ctx.currentTime, type = 'bandpass') {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    env(g, t0, 0.004, peak, dur);
    s.connect(f).connect(g).connect(master);
    s.start(t0); s.stop(t0 + dur + 0.02);
  }

  const SOUNDS = {
    pop: (r) => tone('sine', 520 * r, 900 * r, 0.12, 0.3),
    hop: (r) => tone('sine', 380 * r, 760 * r, 0.14, 0.22),
    grab: (r) => tone('sine', 300 * r, 420 * r, 0.07, 0.18),
    release: (r) => tone('sine', 420 * r, 280 * r, 0.08, 0.14),
    merge: (r) => { tone('sine', 180 * r, 420 * r, 0.22, 0.35, ctx.currentTime, 0.02); tone('triangle', 660 * r, 520 * r, 0.12, 0.08, ctx.currentTime + 0.08); },
    squish: (r) => tone('sine', 240 * r, 160 * r, 0.18, 0.3),
    stretch: (r) => tone('triangle', 300 * r, 700 * r, 0.35, 0.15, ctx.currentTime, 0.05),
    fold: (r) => { tone('sine', 150 * r, 60 * r, 0.2, 0.5); const t = ctx.currentTime; [1047, 1319, 1568].forEach((f, i) => tone('sine', f * r, f * r, 0.25, 0.08, t + 0.06 + i * 0.05)); },
    twist: (r) => noise(0.03, 2400 * r, 6, 0.25),
    roll: (r) => { const t = ctx.currentTime; for (let i = 0; i < 6; i++) tone('sine', (i % 2 ? 330 : 260) * r, (i % 2 ? 300 : 240) * r, 0.08, 0.16, t + i * 0.11); },
    snip: (r) => { const t = ctx.currentTime; noise(0.05, 4200 * r, 3, 0.35, t, 'highpass'); tone('square', 2600 * r, 1800 * r, 0.04, 0.05, t); noise(0.04, 5200 * r, 4, 0.25, t + 0.07, 'highpass'); },
    ribbon: (r) => tone('sine', 500 * r, 1300 * r, 0.28, 0.22, ctx.currentTime, 0.02),
    bag: (r) => tone('triangle', 700 * r, 500 * r, 0.12, 0.15),
    boing: (r) => { const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime; o.type = 'sine'; o.frequency.setValueAtTime(200 * r, t); o.frequency.linearRampToValueAtTime(420 * r, t + 0.08); o.frequency.linearRampToValueAtTime(260 * r, t + 0.25); env(g, t, 0.01, 0.3, 0.3); o.connect(g).connect(master); o.start(t); o.stop(t + 0.32); },
    whoosh: (r) => noise(0.35, 900 * r, 0.8, 0.12, ctx.currentTime, 'bandpass'),
    happy: (r) => { const t = ctx.currentTime; [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f * r, f * r, 0.35, 0.16, t + i * 0.09)); },
    giggle: (r) => { const t = ctx.currentTime; for (let i = 0; i < 3; i++) tone('sine', 820 * r, 1050 * r, 0.09, 0.15, t + i * 0.1); },
    sparkle: (r) => { const t = ctx.currentTime; [1568, 2093].forEach((f, i) => tone('sine', f * r, f * r, 0.18, 0.06, t + i * 0.06)); },
  };

  return {
    unlock: ensure,
    play(name, { gain = 1, rate = 1 } = {}) {
      if (!ctx || ctx.state !== 'running') return;
      const fn = SOUNDS[name] || SOUNDS.pop;
      try {
        if (name === 'twist') { const now = ctx.currentTime; if (now - lastTwistClick < 0.05) return; lastTwistClick = now; }
        fn(Math.min(2, Math.max(0.5, rate)));
      } catch (e) { /* 音は失敗しても遊びは止めない */ }
    },
    // 続く音：伸び（stretch）に合わせた高さ、伸ばす速さで大きさ
    setStretch(stretch, rate) {
      if (!ctx || ctx.state !== 'running') return;
      const t = ctx.currentTime;
      const f = 200 + Math.min(4, Math.max(0, stretch - 1)) * 140;
      const g = Math.min(0.16, rate * 0.12);
      stretchOsc.frequency.setTargetAtTime(f, t, 0.05);
      stretchGain.gain.setTargetAtTime(g, t, 0.06);
    },
    get running() { return !!ctx && ctx.state === 'running'; },
  };
}
