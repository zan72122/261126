// WebAudio の効果音（すべて合成、音のファイルなし）。最初のタッチで鳴り始める（iOS の制限）。
// 続く音：しゃりしゃり（氷）、さらさら（崩れ）、とろとろ（シロップ）。短い音：ぽん・ぴょこ・カリカリ・もぐもぐ・喜びの声・ちりん。

export function createAudio() {
  let ctx = null, master = null, noise = null, crackle = null;
  const loops = {};
  let enabled = false;

  function makeNoise(seconds, fn) {
    const len = Math.floor(ctx.sampleRate * seconds), b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    fn(d, ctx.sampleRate); return b;
  }

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4;
    master = ctx.createGain(); master.gain.value = 0.7; master.connect(comp); comp.connect(ctx.destination);
    noise = makeNoise(1.5, (d) => { for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; });
    // しゃりしゃり：細かい粒のはじける音
    crackle = makeNoise(2, (d, sr) => {
      for (let i = 0; i < d.length; i++) d[i] = 0;
      const n = 2 * 900;
      for (let k = 0; k < n; k++) {
        const at = Math.floor(Math.random() * (d.length - 400)), amp = 0.2 + Math.random() * 0.8, dec = 30 + Math.random() * 120;
        for (let j = 0; j < 300; j++) d[at + j] += (Math.random() * 2 - 1) * amp * Math.exp(-j / dec);
      }
      void sr;
    });
    loops.shari = loop(crackle, 'bandpass', 5200, 0.9);
    loops.slide = loop(noise, 'lowpass', 2400, 0.7);
    loops.flow = loop(noise, 'lowpass', 520, 2.5, true);
    enabled = true;
  }

  function loop(buf, type, freq, q, lfo) {
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = 0;
    src.connect(f); f.connect(g); g.connect(master); src.start();
    if (lfo) {
      const o = ctx.createOscillator(); o.frequency.value = 3.2; const og = ctx.createGain(); og.gain.value = 260;
      o.connect(og); og.connect(f.frequency); o.start();
    }
    return { g, f };
  }

  // 続く音の音量（0..1）を毎フレーム
  function setLevels(shari, slide, flow) {
    if (!enabled) return;
    const t = ctx.currentTime;
    loops.shari.g.gain.setTargetAtTime(Math.min(1, shari) * 0.32, t, 0.06);
    loops.slide.g.gain.setTargetAtTime(Math.min(1, slide) * 0.16, t, 0.08);
    loops.flow.g.gain.setTargetAtTime(Math.min(1, flow) * 0.3, t, 0.1);
  }

  function tone(freq, dur, { type = 'sine', vol = 0.3, slide = 0, at = 0, attack = 0.005 } = {}) {
    if (!enabled) return;
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  function burst(dur, freq, { q = 1, vol = 0.3, at = 0, type = 'bandpass' } = {}) {
    if (!enabled) return;
    const t = ctx.currentTime + at;
    const s = ctx.createBufferSource(); s.buffer = noise;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }

  const sfx = {
    pop: (p = 1) => tone(520 * p, 0.12, { type: 'triangle', vol: 0.25, slide: 1.8 }),
    boing: (p = 1) => { tone(300 * p, 0.25, { type: 'sine', vol: 0.22, slide: 2.2 }); },
    click: () => burst(0.03, 3200, { q: 2, vol: 0.18 }),
    plop: (p = 1) => tone(420 * p, 0.16, { type: 'sine', vol: 0.28, slide: 0.45 }),
    drip: () => tone(900 + Math.random() * 300, 0.09, { type: 'sine', vol: 0.15, slide: 0.6 }),
    spill: () => burst(0.35, 3000, { q: 0.6, vol: 0.12 }),
    slide: () => burst(0.4, 1800, { q: 0.5, vol: 0.1, type: 'lowpass' }),
    whoosh: () => burst(0.4, 900, { q: 0.7, vol: 0.12 }),
    munch: () => { burst(0.09, 1400, { q: 1.5, vol: 0.4 }); burst(0.09, 1100, { q: 1.5, vol: 0.35, at: 0.16 }); },
    chime: () => { [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.5, { vol: 0.16, at: i * 0.09 })); },
    // 動物のうれしい声（言葉なし：上がって下がる「ぴゅい♪」）
    happy: (base = 600) => {
      tone(base, 0.22, { type: 'triangle', vol: 0.26, slide: 1.6 });
      tone(base * 1.5, 0.3, { type: 'triangle', vol: 0.22, slide: 1.3, at: 0.2 });
      tone(base * 2, 0.25, { type: 'sine', vol: 0.1, at: 0.42, slide: 0.8 });
    },
    hello: (base = 600) => tone(base * 1.2, 0.18, { type: 'triangle', vol: 0.16, slide: 1.4 }),
    sparkle: () => { for (let i = 0; i < 4; i++) tone(1800 + Math.random() * 1600, 0.12, { vol: 0.06, at: i * 0.05 }); },
  };

  return { init, setLevels, sfx, get enabled() { return enabled; }, suspend: () => ctx && ctx.suspend(), resume: () => ctx && ctx.resume() };
}
