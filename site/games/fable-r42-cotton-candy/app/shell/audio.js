// WebAudio で合成する効果音（ファイルなし）。最初のタッチで unlock() する。
export function createAudio() {
  let ctx = null, master = null, humGain = null, noiseBuf = null;
  const last = {};
  let unlocked = false;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    master = ctx.createGain(); master.gain.value = 0.55;
    master.connect(comp); comp.connect(ctx.destination);
    // ノイズ 1 秒
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }

  // 指が下りた時・離れた時に何度呼んでもよい（動いていれば何もしない）
  function unlock() {
    const c = ensure(); if (!c) return;
    if (c.state !== 'running') {
      const p = c.resume(); if (p && p.catch) p.catch(() => {});
      // iOS：ユーザー操作の中で無音を1つ鳴らして起こす
      const b = c.createBuffer(1, 1, 22050); const s = c.createBufferSource();
      s.buffer = b; s.connect(master); s.start(0);
    }
    if (!unlocked) { unlocked = true; startHum(); }
  }

  function startHum() {
    // 釜の低いうなり（とても小さく）
    humGain = ctx.createGain(); humGain.gain.value = 0.0;
    const n = ctx.createBufferSource(); n.buffer = noiseBuf; n.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260;
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 92;
    const og = ctx.createGain(); og.gain.value = 0.25;
    n.connect(lp); lp.connect(humGain); o.connect(og); og.connect(humGain);
    humGain.connect(master);
    n.start(); o.start();
    humGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.5);
  }

  function ok(name, minGap) {
    if (!ctx || !unlocked || ctx.state !== 'running') return false;
    const t = ctx.currentTime;
    if (last[name] !== undefined && t - last[name] < minGap) return false;
    last[name] = t; return true;
  }

  function env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  function noise(t, dur, type, freq, q, peak, a = 0.01) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); env(g, t, a, peak, dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t, Math.random() * 0.5); s.stop(t + a + dur + 0.05);
    return f;
  }

  function tone(t, freq, dur, type = 'sine', peak = 0.2, glideTo = 0, a = 0.008) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    const g = ctx.createGain(); env(g, t, a, peak, dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + a + dur + 0.05);
  }

  const S = {
    // 糸が絡む「ふわっ」
    fuwa(amount = 0.5, stage = 0) {
      if (!ok('fuwa', 0.09)) return;
      const t = ctx.currentTime;
      const f = noise(t, 0.22 + amount * 0.15, 'bandpass', 1400 + stage * 350 + Math.random() * 500, 1.2, 0.05 + amount * 0.12, 0.04);
      f.frequency.exponentialRampToValueAtTime(3200 + stage * 400, t + 0.25);
    },
    grab() { if (!ok('grab', 0.08)) return; const t = ctx.currentTime; tone(t, 520, 0.08, 'sine', 0.12, 760); },
    tap() { if (!ok('tap', 0.06)) return; const t = ctx.currentTime; tone(t, 880, 0.07, 'triangle', 0.1, 1180); },
    stage(stage = 1) {
      if (!ok('stage', 0.2)) return; const t = ctx.currentTime;
      const base = [0, 520, 620, 740][stage] || 740;
      tone(t, base, 0.16, 'sine', 0.22, base * 1.9);
      tone(t + 0.07, base * 1.5, 0.12, 'triangle', 0.08);
    },
    pour(colorIndex = 0) {
      if (!ok('pour', 0.15)) return; const t = ctx.currentTime;
      for (let i = 0; i < 9; i++) noise(t + i * 0.035 + Math.random() * 0.02, 0.03, 'highpass', 4000 + Math.random() * 3000, 0.7, 0.08);
      const notes = [784, 988, 1175, 1319];
      tone(t + 0.25, notes[colorIndex % 4], 0.35, 'sine', 0.13);
      tone(t + 0.25, notes[colorIndex % 4] * 2, 0.25, 'sine', 0.04);
    },
    sparkle() {
      if (!ok('sparkle', 0.25)) return; const t = ctx.currentTime;
      [1568, 2093, 2637].forEach((f, i) => tone(t + i * 0.05, f, 0.12, 'sine', 0.05));
    },
    whoosh() {
      if (!ok('whoosh', 0.3)) return; const t = ctx.currentTime;
      const f = noise(t, 0.45, 'bandpass', 500, 1.5, 0.18, 0.08);
      f.frequency.exponentialRampToValueAtTime(2600, t + 0.45);
    },
    munch() {
      if (!ok('munch', 0.12)) return; const t = ctx.currentTime;
      noise(t, 0.07, 'lowpass', 900, 0.8, 0.22, 0.005);
      tone(t, 180, 0.06, 'sine', 0.1, 120);
    },
    yay(big = 0) {
      if (!ok('yay', 0.6)) return; const t = ctx.currentTime;
      const seq = big >= 3 ? [523, 659, 784, 1047, 1319, 1568] : big >= 2 ? [523, 659, 784, 1047, 1319] : [523, 659, 784, 1047];
      seq.forEach((f, i) => { tone(t + i * 0.09, f, 0.22, 'triangle', 0.13); tone(t + i * 0.09, f * 2, 0.12, 'sine', 0.03); });
    },
    boing() {
      if (!ok('boing', 0.2)) return; const t = ctx.currentTime;
      tone(t, 300, 0.25, 'sine', 0.16, 620);
    },
    hop() { if (!ok('hop', 0.15)) return; const t = ctx.currentTime; tone(t, 420, 0.1, 'sine', 0.08, 700); },
    hmm() { if (!ok('hmm', 0.8)) return; const t = ctx.currentTime; tone(t, 440, 0.18, 'sine', 0.08, 380); tone(t + 0.2, 380, 0.2, 'sine', 0.08, 480); },
  };

  return {
    unlock, sfx: S,
    get running() { return !!ctx && ctx.state === 'running'; },
    suspend() { if (ctx && ctx.state === 'running') ctx.suspend(); },
    resume() { if (ctx && unlocked && ctx.state === 'suspended') ctx.resume(); },
  };
}
