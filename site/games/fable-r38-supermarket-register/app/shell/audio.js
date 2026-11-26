// WebAudio の効果音（全部その場で合成。音声ファイルは使わない）。
// iOS は最初のタッチで鳴らす許可が要るので、pointerdown / pointerup で unlock() を呼ぶ。
export function createAudio() {
  let ctx = null;
  let master = null;
  let noise = null;
  let motor = null;
  let muted = false;

  function unlock() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.55;
        master.connect(ctx.destination);
        const len = Math.floor(ctx.sampleRate * 0.5);
        noise = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = noise.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        // 無音を1回鳴らして iOS のロックを外す
        const b = ctx.createBufferSource();
        b.buffer = ctx.createBuffer(1, 1, 22050);
        b.connect(master); b.start(0);
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { /* 音が出なくても遊べる */ }
  }

  const ok = () => ctx && master && ctx.state === 'running' && !muted;

  // 1音：osc → gain(エンベロープ) → master
  function tone({ type = 'sine', f0, f1 = f0, dur = 0.1, vol = 0.3, attack = 0.005, delay = 0, curve = 'exp' }) {
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(f0, 1), t);
    if (f1 !== f0) {
      if (curve === 'exp') o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
      else o.frequency.linearRampToValueAtTime(f1, t + dur);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function burst({ freq = 800, q = 1, dur = 0.15, vol = 0.3, delay = 0, type = 'bandpass', f1 }) {
    const t = ctx.currentTime + delay;
    const s = ctx.createBufferSource();
    s.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t, Math.random() * 0.3); s.stop(t + dur + 0.02);
  }

  const sfx = {
    beep() { tone({ type: 'square', f0: 1760, dur: 0.11, vol: 0.13, attack: 0.002 }); },
    beepHigh() { tone({ type: 'square', f0: 2350, dur: 0.08, vol: 0.1, attack: 0.002 }); },
    pop(p = 1) { tone({ f0: 420 * p, f1: 900 * p, dur: 0.08, vol: 0.25 }); },
    grab() { tone({ f0: 520, f1: 1150, dur: 0.09, vol: 0.28 }); },
    thump(w = 0.5) {
      tone({ f0: 210 - 90 * w, f1: 55, dur: 0.22, vol: 0.5 });
      burst({ freq: 380, q: 0.8, dur: 0.12, vol: 0.18, type: 'lowpass' });
    },
    boing() { tone({ f0: 300, f1: 640, dur: 0.12, vol: 0.25 }); tone({ f0: 640, f1: 360, dur: 0.16, vol: 0.2, delay: 0.1 }); },
    rustle() { for (let i = 0; i < 3; i++) burst({ freq: 2600 + i * 500, q: 1.2, dur: 0.07, vol: 0.12, delay: i * 0.05 }); },
    whoosh() { burst({ freq: 500, f1: 2400, q: 1.5, dur: 0.35, vol: 0.22 }); },
    chime() {
      const notes = [1046.5, 1318.5, 1568, 2093];
      notes.forEach((f, i) => tone({ type: 'triangle', f0: f, dur: 0.55, vol: 0.2, delay: i * 0.09 }));
    },
    giggle() { for (let i = 0; i < 3; i++) tone({ type: 'triangle', f0: 700 + i * 120, f1: 1100 + i * 150, dur: 0.08, vol: 0.18, delay: i * 0.09 }); },
    step() { tone({ f0: 180, f1: 120, dur: 0.06, vol: 0.06 }); },
  };

  function play(name, arg) {
    if (!ok() || !sfx[name]) return;
    try { sfx[name](arg); } catch (e) { /* 無視 */ }
  }

  // ベルトのモーター音（小さく）
  function setMotor(on) {
    if (!ok()) return;
    try {
      const t = ctx.currentTime;
      if (on && !motor) {
        const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 62;
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 220;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.035, t + 0.12);
        o.connect(f); f.connect(g); g.connect(master); o.start(t);
        motor = { o, g };
      } else if (!on && motor) {
        const m = motor; motor = null;
        m.g.gain.cancelScheduledValues(t);
        m.g.gain.setValueAtTime(Math.max(m.g.gain.value, 0.0001), t);
        m.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
        m.o.stop(t + 0.2);
      }
    } catch (e) { /* 無視 */ }
  }

  function suspend() { if (motor) setMotor(false); if (ctx && ctx.state === 'running') ctx.suspend(); }
  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); }

  return {
    unlock, play, setMotor, suspend, resume,
    get state() { return ctx ? ctx.state : 'none'; },
    set muted(v) { muted = v; },
  };
}
