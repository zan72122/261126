// Sound (WebAudio synthesis, no files), sparkles, steam wisps, fireworks.
import * as THREE from './three.module.min.js';
import { canvasTex } from './tex.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

// ---------------------------------------------------------------- audio
export class Sound {
  constructor() { this.ctx = null; }
  unlock() {
    if (this.ctx) { if (this.ctx.state !== 'running') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = 0.8; this.master.connect(c.destination);
    // reverb-ish feedback delay for an outdoor festival feel
    this.wet = c.createGain(); this.wet.gain.value = 0.25;
    const d = c.createDelay(); d.delayTime.value = 0.19; const fb = c.createGain(); fb.gain.value = 0.32; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    this.wet.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(this.master);
    this.noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const nd = this.noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    // machine hum (continuous, gain controlled)
    this.hum = c.createGain(); this.hum.gain.value = 0; this.hum.connect(this.master);
    const o1 = c.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 96;
    const f1 = c.createBiquadFilter(); f1.type = 'lowpass'; f1.frequency.value = 380;
    o1.connect(f1); f1.connect(this.hum); o1.start();
    const ns = c.createBufferSource(); ns.buffer = this.noiseBuf; ns.loop = true;
    const nf = c.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 2600; nf.Q.value = 0.7;
    const ng = c.createGain(); ng.gain.value = 0.35; ns.connect(nf); nf.connect(ng); ng.connect(this.hum); ns.start();
    // ambience: distant crowd murmur
    const amb = c.createBufferSource(); amb.buffer = this.noiseBuf; amb.loop = true;
    const af = c.createBiquadFilter(); af.type = 'bandpass'; af.frequency.value = 500; af.Q.value = 0.4;
    const ag = c.createGain(); ag.gain.value = 0.018; amb.connect(af); af.connect(ag); ag.connect(this.master); amb.start();
    this.ambG = ag;
    this.startMusic();
  }
  get t() { return this.ctx ? this.ctx.currentTime : 0; }
  env(g, t, a, peak, dcy) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dcy); }
  tone(freq, dur = 0.3, type = 'sine', vol = 0.2, when = 0, glide = 0, wet = true) {
    if (!this.ctx) return; const c = this.ctx, t = c.currentTime + when;
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(freq * glide, t + dur);
    const g = c.createGain(); this.env(g, t, 0.008, vol, dur); o.connect(g); g.connect(this.master); if (wet) g.connect(this.wet);
    o.start(t); o.stop(t + dur + 0.05);
  }
  noise(dur = 0.2, freq = 2000, q = 1, vol = 0.2, when = 0, type = 'bandpass', sweep = 0) {
    if (!this.ctx) return; const c = this.ctx, t = c.currentTime + when;
    const s = c.createBufferSource(); s.buffer = this.noiseBuf;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (sweep) f.frequency.exponentialRampToValueAtTime(freq * sweep, t + dur);
    const g = c.createGain(); this.env(g, t, 0.01, vol, dur);
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }
  setHum(v) { if (this.hum) this.hum.gain.setTargetAtTime(v * 0.05, this.ctx.currentTime, 0.15); }
  pour() { for (let i = 0; i < 14; i++) this.noise(0.05, 5000 + Math.random() * 3000, 2, 0.06, i * 0.03 + Math.random() * 0.02, 'bandpass'); }
  swish(v = 1) { this.noise(0.18, 1800, 0.8, 0.05 * v, 0, 'bandpass', 2.2); }
  tap() { this.tone(880, 0.08, 'sine', 0.08); }
  cloth() { this.noise(0.35, 900, 0.6, 0.12, 0, 'bandpass', 2.5); }
  chime() { [1047, 1319, 1568, 2093].forEach((f, i) => this.tone(f, 0.6, 'sine', 0.12, i * 0.09)); }
  sparkle() { for (let i = 0; i < 6; i++) this.tone(1800 + Math.random() * 1600, 0.25, 'sine', 0.05, i * 0.05); }
  huh() { this.tone(330, 0.18, 'triangle', 0.15, 0, 1.0); this.tone(392, 0.32, 'triangle', 0.15, 0.2, 1.35); }
  yay() { this.tone(523, 0.12, 'triangle', 0.15); this.tone(659, 0.12, 'triangle', 0.15, 0.1); this.tone(784, 0.3, 'triangle', 0.17, 0.2); this.sparkle(); }
  oops() { this.tone(500, 0.18, 'triangle', 0.16, 0, 0.7); this.tone(380, 0.35, 'triangle', 0.16, 0.2, 0.7); }
  whoosh() { this.noise(0.5, 400, 0.6, 0.25, 0, 'bandpass', 4); }
  splat() { this.noise(0.25, 700, 1.2, 0.25, 0, 'lowpass', 0.4); this.tone(140, 0.2, 'sine', 0.2, 0, 0.6); }
  drip() { this.tone(1200, 0.12, 'sine', 0.1, 0, 0.5); this.noise(0.4, 3000, 1, 0.05, 0.05, 'highpass'); }
  sizzle() { this.noise(0.6, 4200, 0.6, 0.07, 0, 'highpass'); }
  pop() { this.tone(600, 0.06, 'sine', 0.1, 0, 2); this.noise(0.05, 3000, 1, 0.05); }
  taiko(when = 0, v = 1) { this.tone(70, 0.5, 'sine', 0.5 * v, when, 0.55, false); this.noise(0.1, 300, 1, 0.2 * v, when, 'lowpass'); }
  boom(dist = 1) {
    this.tone(55, 1.0, 'sine', 0.45 / dist, 0, 0.5, true); this.noise(1.4, 260, 0.7, 0.4 / dist, 0, 'lowpass', 0.3);
    for (let i = 0; i < 18; i++) this.noise(0.04, 5000 + Math.random() * 4000, 2, 0.05 / dist, 0.25 + Math.random() * 1.0, 'bandpass');
  }
  launch() { this.noise(0.9, 900, 3, 0.07, 0, 'bandpass', 3.5); }
  // gentle festival loop: taiko + a fue-like pentatonic melody, quiet
  startMusic() {
    const c = this.ctx; const bpm = 92, beat = 60 / bpm;
    const scale = [587, 659, 784, 880, 988, 1175];
    let next = c.currentTime + 0.5, step = 0;
    const tick = () => {
      if (!this.ctx) return;
      while (next < c.currentTime + 0.6) {
        const w = next - c.currentTime;
        if (step % 4 === 0) this.taiko(w, 0.45);
        if (step % 8 === 6) this.taiko(w, 0.25);
        if (step % 16 === 3 || step % 16 === 11) this.noise(0.05, 2500, 3, 0.04, w); // kane
        if (this.musicOn !== false && step % 2 === 0 && Math.random() < 0.7) {
          const f = scale[(Math.floor(step / 2) * 3 + (step >> 4)) % scale.length];
          const o = c.createOscillator(); o.type = 'sine'; const g = c.createGain();
          const t = c.currentTime + w;
          o.frequency.setValueAtTime(f * 0.995, t); o.frequency.linearRampToValueAtTime(f, t + 0.06);
          const vib = c.createOscillator(); vib.frequency.value = 5.5; const vg = c.createGain(); vg.gain.value = 6; vib.connect(vg); vg.connect(o.frequency); vib.start(t); vib.stop(t + beat * 1.9);
          g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.022, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + beat * 1.8);
          o.connect(g); g.connect(this.master); g.connect(this.wet); o.start(t); o.stop(t + beat * 1.9);
        }
        next += beat / 2; step++;
      }
      setTimeout(tick, 200);
    };
    tick();
  }
}

// ---------------------------------------------------------------- particles (sprites)
const glowTex = () => canvasTex(64, 64, (g, w, h) => {
  const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
});
const starTex = () => canvasTex(64, 64, (g, w, h) => {
  g.translate(w / 2, h / 2);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.15, 'rgba(255,250,230,0.8)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
  g.fillStyle = gr;
  g.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, r = i % 2 ? 6 : 31; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.fill();
});
const smokeTex = () => canvasTex(64, 64, (g, w, h) => {
  for (let i = 0; i < 9; i++) {
    const x = w / 2 + (Math.random() - 0.5) * 22, y = h / 2 + (Math.random() - 0.5) * 22, r = 10 + Math.random() * 14;
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,0.22)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }
});

export class Particles {
  // generic additive/normal sprite particles
  constructor(scene, n, map, blending = THREE.AdditiveBlending, sizeAtten = true) {
    const g = new THREE.BufferGeometry();
    this.n = n;
    this.pos = new Float32Array(n * 3); this.col = new Float32Array(n * 3); this.size = new Float32Array(n); this.alpha = new Float32Array(n);
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: map }, scale: { value: 600 } },
      vertexShader: `attribute float size; attribute float alpha; varying vec3 vC; varying float vA;
        uniform float scale;
        void main(){ vC = color; vA = alpha; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = size * scale / -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform sampler2D map; varying vec3 vC; varying float vA;
        void main(){ vec4 t = texture2D(map, gl_PointCoord); gl_FragColor = vec4(vC * t.rgb, t.a * vA);
        #include <colorspace_fragment>
        }`,
      transparent: true, depthWrite: false, blending, vertexColors: true,
    });
    this.pts = new THREE.Points(g, this.mat); this.pts.frustumCulled = false; this.pts.renderOrder = 10;
    scene.add(this.pts);
    this.p = Array.from({ length: n }, () => ({ life: 0, max: 1, pos: V(), vel: V(), col: new THREE.Color(), size: 0.02, grow: 0, drag: 0, grav: 0, fade: 1 }));
    this.i = 0;
  }
  emit(o) {
    const p = this.p[this.i]; this.i = (this.i + 1) % this.n;
    p.life = p.max = o.life || 1; p.pos.copy(o.pos); p.trail = 0; p.tt = 0; p.vel.copy(o.vel || V());
    p.col.copy(o.col || new THREE.Color(1, 1, 1)); p.size = o.size || 0.02; p.grow = o.grow || 0; p.drag = o.drag || 0; p.grav = o.grav || 0; p.a0 = o.alpha ?? 1;
    p.flicker = o.flicker || 0;
    return p;
  }
  update(dt) {
    for (let k = 0; k < this.n; k++) {
      const p = this.p[k];
      if (p.life <= 0) { this.alpha[k] = 0; continue; }
      p.life -= dt;
      p.vel.y -= p.grav * dt; p.vel.multiplyScalar(1 - p.drag * dt); p.pos.addScaledVector(p.vel, dt);
      p.size += p.grow * dt;
      const f = Math.max(0, p.life / p.max);
      this.pos[k * 3] = p.pos.x; this.pos[k * 3 + 1] = p.pos.y; this.pos[k * 3 + 2] = p.pos.z;
      this.col[k * 3] = p.col.r; this.col[k * 3 + 1] = p.col.g; this.col[k * 3 + 2] = p.col.b;
      this.size[k] = p.size;
      this.alpha[k] = p.a0 * Math.min(1, f * 2.5) * Math.min(1, (1 - f) * 12 + 0.0001) * (p.flicker ? (0.6 + 0.4 * Math.sin(p.life * 40 + k)) : 1);
    }
    const g = this.pts.geometry;
    g.attributes.position.needsUpdate = g.attributes.color.needsUpdate = g.attributes.size.needsUpdate = g.attributes.alpha.needsUpdate = true;
  }
}

export class FX {
  constructor(scene, renderer) {
    this.glow = new Particles(scene, 2600, glowTex());
    this.star = new Particles(scene, 200, starTex());
    this.smoke = new Particles(scene, 120, smokeTex(), THREE.NormalBlending);
    this.scene = scene;
    this.rockets = [];
  }
  sparkle(pos, n = 14, col = new THREE.Color(1, 0.9, 0.6), r = 0.12) {
    for (let i = 0; i < n; i++) {
      const d = V(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).normalize();
      this.star.emit({ pos: pos.clone().addScaledVector(d, r * 0.3 * Math.random()), vel: d.multiplyScalar(0.15 + Math.random() * 0.25), col, size: 0.012 + Math.random() * 0.02, life: 0.6 + Math.random() * 0.7, drag: 2.5, flicker: 1 });
    }
  }
  steam(pos) {
    this.smoke.emit({ pos: pos.clone().add(V((Math.random() - 0.5) * 0.03, 0, (Math.random() - 0.5) * 0.03)), vel: V((Math.random() - 0.5) * 0.02, 0.06 + Math.random() * 0.05, (Math.random() - 0.5) * 0.02), col: new THREE.Color(1, 0.95, 0.9), size: 0.03 + Math.random() * 0.03, grow: 0.06, life: 1.6 + Math.random(), alpha: 0.35, drag: 0.3 });
  }
  droplets(pos, dir, n = 12) {
    for (let i = 0; i < n; i++) {
      const v = dir.clone().multiplyScalar(0.6 + Math.random() * 0.6).add(V((Math.random() - 0.5) * 0.4, Math.random() * 0.3, (Math.random() - 0.5) * 0.4));
      this.glow.emit({ pos: pos.clone(), vel: v, col: new THREE.Color(0.75, 0.85, 1.0).multiplyScalar(0.8), size: 0.006 + Math.random() * 0.008, life: 0.5 + Math.random() * 0.4, grav: 6 });
    }
  }
  puff(pos, col, n = 10) {
    for (let i = 0; i < n; i++) {
      const d = V(Math.random() - 0.5, Math.random() - 0.2, Math.random() - 0.5).normalize();
      this.smoke.emit({ pos: pos.clone(), vel: d.multiplyScalar(0.2 + Math.random() * 0.3), col: col.clone().lerp(new THREE.Color(1, 1, 1), 0.3), size: 0.03 + Math.random() * 0.04, grow: 0.08, life: 0.8 + Math.random() * 0.6, alpha: 0.8, drag: 3, grav: -0.05 });
    }
  }
  // fireworks
  launch(from, to, col, light, sound) {
    this.rockets.push({ pos: from.clone(), to: to.clone(), vel: to.clone().sub(from).multiplyScalar(1 / 1.3), t: 1.3, col, light, sound, trail: 0 });
    sound && sound.launch();
  }
  burst(pos, col, light, sound) {
    const n = 150, col2 = col.clone().lerp(new THREE.Color(1, 1, 1), 0.4);
    const kind = Math.random();
    for (let i = 0; i < n; i++) {
      const d = V(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      const sp = kind < 0.5 ? 4.2 : 3.0 + Math.random() * 1.8;
      const sp_ = this.glow.emit({ pos: pos.clone(), vel: d.multiplyScalar(sp), col: (i % 5 ? col : col2).clone().multiplyScalar(2.2), size: 0.28 + Math.random() * 0.18, life: 1.5 + Math.random() * 0.9, drag: 1.2, grav: 0.9, flicker: kind > 0.5 ? 1 : 0 });
      sp_.trail = 0.05 + Math.random() * 0.05;
    }
    for (let i = 0; i < 20; i++) this.star.emit({ pos: pos.clone(), vel: V(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(5), col: new THREE.Color(1, 0.95, 0.8).multiplyScalar(2), size: 0.45, life: 1.0, drag: 2, grav: 0.5, flicker: 1 });
    if (light) { light.color.copy(col).lerp(new THREE.Color(1, 1, 1), 0.3); light.intensity = 900; light.position.copy(pos); }
    sound && setTimeout(() => sound.boom(1.4), 250);
  }
  update(dt) {
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.t -= dt; r.pos.addScaledVector(r.vel, dt);
      r.trail -= dt;
      if (r.trail <= 0) { r.trail = 0.02; this.glow.emit({ pos: r.pos.clone(), vel: V((Math.random() - 0.5) * 0.2, -0.3, 0), col: new THREE.Color(1, 0.7, 0.4).multiplyScalar(1.5), size: 0.16, life: 0.5 }); }
      if (r.t <= 0) { this.burst(r.pos, r.col, r.light, r.sound); this.rockets.splice(i, 1); }
    }
    // falling sparks leave short glowing trails (like a long exposure in the eye)
    for (const p of this.glow.p) {
      if (!p.trail || p.life <= 0) continue;
      p.tt = (p.tt || 0) - dt;
      if (p.tt <= 0) { p.tt = p.trail; const q = this.glow.emit({ pos: p.pos.clone(), vel: p.vel.clone().multiplyScalar(0.05), col: p.col.clone().multiplyScalar(0.45), size: p.size * 0.55, life: 0.45, drag: 2 }); q.trail = 0; }
    }
    this.glow.update(dt); this.star.update(dt); this.smoke.update(dt);
  }
}
