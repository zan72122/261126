// Synthesized sound effects (WebAudio, no files). Started on the first touch.
export function createAudio() {
  let ctx = null, master = null, noise = null, ambient = null;
  const last = {}; // id -> time, to avoid machine-gun repeats

  function unlock() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        ctx = new AC();
        const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
        master = ctx.createGain(); master.gain.value = 0.75; master.connect(comp); comp.connect(ctx.destination);
        noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        startAmbient();
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { /* audio is optional */ }
  }

  function env(g, t, a, peak, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + Math.max(a, 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur, a + 0.02));
  }
  function osc(type, f0, f1, t, dur, peak, { a = 0.01, filter = 0, q = 1, dest = master } = {}) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
    const g = ctx.createGain(); env(g, t, a, peak, dur);
    let node = o;
    if (filter) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filter; f.Q.value = q; o.connect(f); node = f; }
    node.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
    return o;
  }
  function nz(t, dur, peak, type, f0, f1, { a = 0.005, q = 1 } = {}) {
    const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q; f.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(Math.max(f1, 20), t + dur);
    const g = ctx.createGain(); env(g, t, a, peak, dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }
  function startAmbient() {
    const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380;
    const g = ctx.createGain(); g.gain.value = 0.035;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.13; const lg = ctx.createGain(); lg.gain.value = 0.02;
    lfo.connect(lg); lg.connect(g.gain); lfo.start();
    s.connect(f); f.connect(g); g.connect(master); s.start();
    ambient = { g };
  }

  const sounds = {
    honk(t, v) { osc('square', 520, 520, t, 0.11, 0.12 * v, { filter: 1800 }); osc('square', 440, 440, t + 0.15, 0.16, 0.12 * v, { filter: 1800 }); },
    engine(t, v) {
      osc('sawtooth', 60, 150, t, 0.55, 0.16 * v, { a: 0.06, filter: 700, q: 3 });
      osc('sawtooth', 150, 90, t + 0.5, 0.5, 0.12 * v, { a: 0.02, filter: 600, q: 3 });
    },
    clunk(t, v) { osc('sine', 110, 45, t, 0.3, 0.5 * v, { a: 0.004 }); nz(t, 0.12, 0.25 * v, 'lowpass', 500, 200); },
    rampTouch(t, v) {
      osc('sine', 90, 40, t, 0.4, 0.6 * v, { a: 0.003 }); nz(t, 0.25, 0.25 * v, 'bandpass', 1800, 900, { q: 3 });
      osc('triangle', 820, 800, t, 0.35, 0.05 * v); osc('triangle', 1290, 1270, t, 0.3, 0.04 * v);
    },
    splash(t, v) { nz(t, 0.45, 0.32 * v, 'bandpass', 1400, 280, { a: 0.02, q: 1.2 }); osc('sine', 300, 900, t + 0.05, 0.08, 0.06 * v); },
    horn(t, v) {
      osc('sawtooth', 147, 145, t, 1.1, 0.13 * v, { a: 0.12, filter: 800, q: 2 });
      osc('sawtooth', 220, 218, t, 1.1, 0.1 * v, { a: 0.12, filter: 800, q: 2 });
    },
    rope(t, v) { nz(t, 0.3, 0.18 * v, 'highpass', 900, 3000, { a: 0.03 }); },
    taut(t, v) { osc('sawtooth', 320, 200, t, 0.22, 0.08 * v, { filter: 900, q: 6 }); },
    pop(t, v) { osc('sine', 500, 1300, t, 0.12, 0.25 * v, { a: 0.004 }); },
    joy(t, v) {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => { osc('triangle', f, f, t + i * 0.1, 0.35, 0.16 * v); });
      osc('sine', 2093, 2093, t + 0.42, 0.4, 0.05 * v);
    },
    fanfare(t, v) { // all the cars of this trip have been given: a little "ta-da!"
      [[523.25, 0], [659.25, 0.14], [783.99, 0.28], [1046.5, 0.46]].forEach(([f, d]) => { osc('triangle', f, f, t + d, d > 0.4 ? 0.7 : 0.18, 0.15 * v); osc('square', f / 2, f / 2, t + d, 0.15, 0.03 * v, { filter: 1200 }); });
      for (let i = 0; i < 6; i++) { const f = 1800 + i * 260; osc('sine', f, f, t + 0.55 + i * 0.07, 0.2, 0.05 * v); }
    },
    sparkle(t, v) { for (let i = 0; i < 4; i++) { const f = 1500 + Math.random() * 1500; osc('sine', f, f, t + i * 0.06, 0.18, 0.06 * v); } },
    gull(t, v) { for (let i = 0; i < 2; i++) osc('sawtooth', 1500, 900, t + i * 0.22, 0.18, 0.05 * v, { filter: 2500, q: 4 }); },
    spout(t, v) { nz(t, 0.8, 0.3 * v, 'bandpass', 500, 2500, { a: 0.1, q: 0.8 }); osc('sine', 80, 60, t, 0.9, 0.15 * v, { a: 0.2 }); },
    boing(t, v) { osc('sine', 240, 110, t, 0.35, 0.3 * v, { a: 0.005 }); },
    tick(t, v) { osc('triangle', 1800, 1600, t, 0.04, 0.05 * v); },
    whoosh(t, v) { nz(t, 0.4, 0.15 * v, 'bandpass', 400, 1600, { a: 0.1 }); },
    creak(t, v) { osc('sawtooth', 180, 150, t, 0.3, 0.05 * v, { filter: 700, q: 8 }); },
    bell(t, v) { osc('sine', 1318, 1318, t, 1.0, 0.12 * v, { a: 0.003 }); osc('sine', 1975, 1975, t, 0.7, 0.05 * v, { a: 0.003 }); },
  };
  sounds.slosh = sounds.splash;

  function play(id, volume = 1, minGap = 0.06) {
    if (!ctx || ctx.state !== 'running') return;
    const fn = sounds[id]; if (!fn) return;
    const t = ctx.currentTime;
    if (last[id] !== undefined && t - last[id] < minGap) return;
    last[id] = t;
    try { fn(t + 0.005, Math.max(0, Math.min(1.5, volume))); } catch (e) { /* ignore */ }
  }
  // a hidden tab (home button, app switch) stops the sea sound; it comes back with the page
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    try { if (document.hidden) ctx.suspend(); else ctx.resume(); } catch (e) { /* ignore */ }
  });
  return { unlock, play, get running() { return !!ctx && ctx.state === 'running'; } };
}
