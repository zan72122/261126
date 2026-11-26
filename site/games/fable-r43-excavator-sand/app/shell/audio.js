// 効果音：WebAudio で合成（音声ファイルなし）。最初のタッチで AudioContext を開く（iOS 対策）。
// 連続音（油圧・ざくざく・ざーっ）は毎フレームの状態から音量を決め、一発ものはイベントで鳴らす。
export function createAudio() {
  let ctx = null, master = null, noise = null;
  const loops = {};
  let muted = false;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.8;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp); comp.connect(ctx.destination);
    // ノイズ（2秒）
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // 連続音
    loops.hum = makeOsc('sawtooth', 70, 'lowpass', 420);
    loops.scrape = makeNoise('bandpass', 950, 0.9);
    loops.pour = makeNoise('lowpass', 2600, 0.7);
    loops.engine = makeOsc('square', 48, 'lowpass', 260);
    // 無音を1回鳴らして iOS を起こす
    const b = ctx.createBufferSource(); b.buffer = ctx.createBuffer(1, 1, 22050); b.connect(master); b.start();
  }
  function makeOsc(type, freq, ftype, fc) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
    const f = ctx.createBiquadFilter(); f.type = ftype; f.frequency.value = fc;
    const g = ctx.createGain(); g.gain.value = 0;
    o.connect(f); f.connect(g); g.connect(master); o.start();
    return { src: o, filter: f, gain: g };
  }
  function makeNoise(ftype, fc, q) {
    const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = ftype; f.frequency.value = fc; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = 0;
    s.connect(f); f.connect(g); g.connect(master); s.start();
    return { src: s, filter: f, gain: g };
  }
  function setLoop(name, vol, freq) {
    const l = loops[name];
    if (!l) return;
    const t = ctx.currentTime;
    l.gain.gain.setTargetAtTime(muted ? 0 : vol, t, 0.05);
    if (freq != null) (l.src.frequency || l.filter.frequency).setTargetAtTime(freq, t, 0.05);
  }
  function tone(type, f0, f1, dur, vol = 0.2, delay = 0) {
    if (!ctx || muted) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function burst(fc, dur, vol = 0.3, type = 'bandpass', delay = 0) {
    if (!ctx || muted) return;
    const t = ctx.currentTime + delay;
    const s = ctx.createBufferSource(); s.buffer = noise;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = fc; f.Q.value = 1.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }

  const sfx = {
    zak() { burst(1300, 0.14, 0.35); burst(500, 0.1, 0.2, 'lowpass'); },
    pop() { tone('sine', 520, 980, 0.16, 0.2); },
    grab() { tone('triangle', 180, 260, 0.08, 0.12); },
    zaa(vol) { burst(2200, Math.min(1.4, 0.4 + vol * 1.2), 0.25, 'lowpass'); },
    land() { burst(700, 0.08, 0.12, 'lowpass'); },
    horn() { tone('square', 440, 430, 0.16, 0.08); tone('square', 554, 540, 0.3, 0.08, 0.2); },
    beep() { tone('sine', 1150, 1150, 0.12, 0.07); },
    boing() { tone('sine', 260, 720, 0.22, 0.25); },
    happy() { [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, f, 0.18, 0.16, i * 0.09)); },
    squeak() { tone('sine', 900, 1500, 0.12, 0.12); tone('sine', 1100, 1700, 0.1, 0.1, 0.13); },
    sparkle() { for (let i = 0; i < 8; i++) { const f = 1200 + Math.random() * 1600; tone('sine', f, f * 1.02, 0.25, 0.07, i * 0.07); } },
    fanfare() { [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone('triangle', f, f, 0.22, 0.17, i * 0.13)); },
    button() { tone('sine', 660, 990, 0.12, 0.2); },
    thud() { tone('sine', 120, 60, 0.18, 0.25); },
  };

  return {
    unlock: init,
    get ready() { return !!ctx; },
    setMuted(m) { muted = m; },
    play(name, arg) { if (ctx && sfx[name]) sfx[name](arg); },
    // 毎フレーム：hero の状態とトラックから連続音
    updateLoops(s) {
      if (!ctx) return;
      setLoop('hum', Math.min(0.07, s.armSpeed * 0.05), 60 + Math.min(3, s.armSpeed) * 55);
      setLoop('scrape', Math.min(0.35, s.digRate * 120));
      setLoop('pour', Math.min(0.3, s.pourRate * 70));
      setLoop('engine', s.truckMoving ? 0.05 : 0, s.truckMoving ? 60 : 45);
    },
    suspend() { if (ctx && ctx.state === 'running') ctx.suspend(); },
    resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); },
  };
}
