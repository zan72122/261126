// Procedural animation controllers for the humans and the dog.
import * as THREE from 'three';
import { damp, lerp, clamp01, smooth } from './core.js';

const UP = new THREE.Vector3(0, 1, 0);
const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();

export class Human {
  constructor(fig, opts = {}) {
    this.f = fig; this.root = fig.root;
    this.pos = new THREE.Vector3(); this.yaw = 0; this.yawT = 0;
    this.kneel = 0; this.kneelT = 0; // 0 stand, 1 high kneel
    this.lean = 0; this.leanT = 0;
    this.walk = 0; this.phase = 0; this.speed = opts.speed || 0.9;
    this.path = null;
    this.hand = { R: { t: null, w: 0, wT: 0, pos: new THREE.Vector3() }, L: { t: null, w: 0, wT: 0, pos: new THREE.Vector3() } };
    this.gesture = null; this.gT = 0;
    this.look = new THREE.Vector3(0, 1, 3); this.lookW = 1;
    this.H = fig.meta.height;
    const J = fig.meta.joints, B = fig.meta.bones;
    const j = (n) => new THREE.Vector3(...J[B.indexOf(n)]);
    this.thighL = j('thL').distanceTo(j('shinL')); this.shinL = j('shinL').distanceTo(j('footL'));
    this.hipY = j('hips').y; this.ankleY = j('footL').y;
    this.carry = null; this.t = Math.random() * 10;
    this.onStep = null; this.stepSide = 0;
    this.tiptoe = 0;
  }
  // world helpers
  toWorldDir(x, y, z) { return tmp.set(x, y, z).applyAxisAngle(UP, this.yaw).clone(); }
  local(x, y, z) { return new THREE.Vector3(x, y, z).applyAxisAngle(UP, this.yaw).add(this.pos); }
  goTo(p, onArrive, speed) { this.path = { to: p.clone(), cb: onArrive }; if (speed) this.speedT = speed; }
  face(p) { this.yawT = Math.atan2(p.x - this.pos.x, p.z - this.pos.z); }
  reach(side, target, w = 1) { const h = this.hand[side]; h.t = target; h.wT = target ? w : 0; }
  doGesture(name, dur = 1.6) { this.gesture = name; this.gT = 0; this.gDur = dur; }

  update(dt) {
    this.t += dt;
    const f = this.f;
    // locomotion
    let moving = false;
    if (this.path) {
      const d = tmp.copy(this.path.to).sub(this.pos); d.y = 0; const L = d.length();
      if (L < 0.03) { const cb = this.path.cb; this.path = null; cb && cb(); }
      else {
        moving = true; this.yawT = Math.atan2(d.x, d.z);
        const sp = Math.min(this.speedT || this.speed, L * 3 + 0.2);
        this.pos.addScaledVector(d.normalize(), sp * dt * clamp01(this.walk * 1.5));
      }
    }
    this.walk = damp(this.walk, moving ? 1 : 0, 6, dt);
    if (moving) {
      const stride = this.H * (this.strideK || 0.42);
      const prev = this.phase;
      this.phase += dt * (this.speedT || this.speed) / stride * Math.PI;
      if (Math.floor(prev / Math.PI) !== Math.floor(this.phase / Math.PI)) { this.stepSide ^= 1; this.onStep && this.onStep(this.stepSide); }
    }
    let dy = this.yawT - this.yaw; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
    this.yaw += dy * (1 - Math.exp(-8 * dt));
    this.kneel = damp(this.kneel, this.walk > 0.3 ? 0 : this.kneelT, 5, dt);
    this.lean = damp(this.lean, this.leanT, 5, dt);
    for (const s of ['R', 'L']) { const h = this.hand[s]; h.w = damp(h.w, h.wT, 7, dt); if (h.t) h.pos.lerp(h.t, 1 - Math.exp(-14 * dt)); }
    if (this.gesture) { this.gT += dt; if (this.gT > this.gDur) this.gesture = null; }
    this.pose();
    f.update(dt);
  }

  pose() {
    const f = this.f, H = this.H, k = this.kneel, w = this.walk;
    f.resetPose();
    this.root.position.copy(this.pos);
    this.root.rotation.y = this.yaw;
    const ph = this.phase;
    const B = f.B;
    // hips height: standing (with walk bob) -> high kneel
    const bob = w * Math.abs(Math.cos(ph)) * 0.02 * H;
    const kneelHip = this.shinL * 0.15 + this.thighL * 0.97 + 0.03;
    B.hips.position.y = lerp(this.hipY - 0.005 * H + bob - w * 0.01 * H, kneelHip + 0.02, k) + this.tiptoe * 0.04;
    B.hips.position.z = lerp(0, -0.02 * H, k);
    // breathing & sway
    const br = Math.sin(this.t * 1.7) * 0.012;
    B.spine.rotation.x = br + this.lean * 0.55 + w * 0.05;
    B.chest.rotation.x = br * 0.5 + this.lean * 0.35;
    B.spine.rotation.y = -Math.sin(ph) * 0.08 * w;
    B.chest.rotation.y = Math.sin(ph) * 0.06 * w;
    B.hips.rotation.y = Math.sin(ph) * 0.07 * w;
    B.hips.rotation.z = Math.sin(this.t * 0.8) * 0.01 * (1 - w);
    this.root.updateMatrixWorld(true);
    // legs
    for (const [s, sg] of [['L', 1], ['R', -1]]) {
      const swing = Math.sin(ph + (sg > 0 ? 0 : Math.PI)) * w;
      const lift = Math.max(0, Math.cos(ph + (sg > 0 ? 0 : Math.PI))) * w;
      // standing/walking leg directions (local)
      const thighS = new THREE.Vector3(0, -1, swing * 0.42);
      const shinS = new THREE.Vector3(0, -1, swing * 0.2 - lift * 0.7);
      // high kneel: thigh vertical-ish, shin flat behind on the ground
      const thighK = new THREE.Vector3(sg * 0.08, -1, 0.08);
      const shinK = new THREE.Vector3(0, -0.12, -1);
      const td = thighS.lerp(thighK, k).normalize(), sd = shinS.lerp(shinK, k).normalize();
      f.aim('th' + s, 'shin' + s, this.toWorldDir(td.x, td.y, td.z));
      f.aim('shin' + s, 'foot' + s, this.toWorldDir(sd.x, sd.y, sd.z));
      // foot stays roughly level (boots: rest direction is fine), point back when kneeling
      const fd = new THREE.Vector3(0, lerp(-1, -0.15, k) , lerp(0.15 + swing * 0.1 + this.tiptoe * -0.3, -1, k)).normalize();
      // foot bone has no child: rotate it manually (pitch)
      B['foot' + s].rotation.x = lerp(-swing * 0.25 * w + this.tiptoe * 0.6, 1.2, k);
    }
    // arms: default hang with swing, gestures, IK overrides
    const g = this.gesture, gt = this.gT;
    for (const [s, sg] of [['L', 1], ['R', -1]]) {
      const swing = Math.sin(ph + (sg > 0 ? Math.PI : 0)) * w;
      let ua = new THREE.Vector3(sg * 0.07, -1, swing * 0.35 + 0.03);
      let fa = new THREE.Vector3(sg * 0.02, -1, swing * 0.3 + 0.22);
      if (g === 'cheer') { const a = smooth(gt / 0.3) * smooth((this.gDur - gt) / 0.3); const wv = Math.sin(gt * 14) * 0.15; ua.lerp(new THREE.Vector3(sg * 0.55, 1, 0.1), a); fa.lerp(new THREE.Vector3(sg * (0.3 + wv), 1, 0.05), a); }
      if (g === 'clap') { const a = smooth(gt / 0.25) * smooth((this.gDur - gt) / 0.25); const c = Math.abs(Math.sin(gt * 9)); ua.lerp(new THREE.Vector3(sg * 0.35, -0.4, 0.9), a); fa.lerp(new THREE.Vector3(-sg * (0.5 + c * 0.5), 0.2, 0.7), a); }
      if (g === 'scratch' && s === 'R') { const a = smooth(gt / 0.3) * smooth((this.gDur - gt) / 0.3); ua.lerp(new THREE.Vector3(-0.8, 0.5, 0.3), a); fa.lerp(new THREE.Vector3(0.35, 1, -0.2 + Math.sin(gt * 18) * 0.15), a); }
      if (g === 'thumb' && s === 'R') { const a = smooth(gt / 0.3) * smooth((this.gDur - gt) / 0.3); ua.lerp(new THREE.Vector3(-0.3, -0.3, 1), a); fa.lerp(new THREE.Vector3(0, 0.6, 1), a); }
      if (g === 'wave' && s === 'R') { const a = smooth(gt / 0.3) * smooth((this.gDur - gt) / 0.3); ua.lerp(new THREE.Vector3(-0.7, 0.4, 0.3), a); fa.lerp(new THREE.Vector3(-0.2 + Math.sin(gt * 10) * 0.4, 1, 0.1), a); }
      if (g === 'oops') { const a = smooth(gt / 0.2) * smooth((this.gDur - gt) / 0.3); ua.lerp(new THREE.Vector3(sg * 0.7, -0.6, 0.2), a); fa.lerp(new THREE.Vector3(sg * 0.9, 0.3, 0.3), a); }
      if (this.carry && s === 'R') { ua.set(-0.3, 0.2, 0.6); fa.set(0.2, 1, -0.1); }
      if (this.carry && s === 'L') { ua.set(0.25, -0.8, 0.5); fa.set(-0.2, 0.3, 1); }
      ua.normalize(); fa.normalize();
      f.aim('ua' + s, 'fa' + s, this.toWorldDir(ua.x, ua.y, ua.z));
      f.aim('fa' + s, 'hand' + s, this.toWorldDir(fa.x, fa.y, fa.z));
      const h = this.hand[s];
      if (h.w > 0.01 && h.t) {
        f.ik('ua' + s, 'fa' + s, 'hand' + s, h.pos, this.toWorldDir(sg * 0.8, -0.6, -0.4), h.w);
        // palm down toward surface
        B['hand' + s].rotation.x = lerp(0, -0.6, h.w);
      }
    }
    // head look
    if (this.look) {
      B.head.updateWorldMatrix(true, false);
      const hp = B.head.getWorldPosition(tmp2);
      const d = tmp.copy(this.look).sub(hp);
      const yawL = Math.atan2(d.x, d.z) - this.yaw; let yl = yawL; while (yl > Math.PI) yl -= Math.PI * 2; while (yl < -Math.PI) yl += Math.PI * 2;
      const pitch = Math.atan2(-d.y, Math.hypot(d.x, d.z));
      const accum = this.lean * 0.9;
      B.neck.rotation.y = THREE.MathUtils.clamp(yl, -1.1, 1.1) * 0.45 * this.lookW;
      B.head.rotation.y = THREE.MathUtils.clamp(yl, -1.1, 1.1) * 0.45 * this.lookW;
      const pc = THREE.MathUtils.clamp(pitch - accum, -0.6, this.maxDown ?? 0.55);
      B.neck.rotation.x = pc * 0.4 * this.lookW;
      B.head.rotation.x = pc * 0.5 * this.lookW;
      B.head.rotation.z = (this.f.exprName === 'puzzled' ? 0.22 : 0) + Math.sin(this.t * 0.9) * 0.02;
      f.lookTarget = this.look;
    }
    this.root.updateMatrixWorld(true);
  }
  handWorld(s) { return this.f.B['hand' + s].getWorldPosition(new THREE.Vector3()); }
  footWorld(s) { return this.f.B['foot' + s].getWorldPosition(new THREE.Vector3()); }
}

// ---------------------------------------------------------------- dog
export class Dog {
  constructor(fig) {
    this.f = fig; this.root = fig.root;
    this.pos = new THREE.Vector3(); this.yaw = 0; this.yawT = 0;
    this.walk = 0; this.phase = 0; this.path = null; this.speed = 1.1;
    this.sit = 0; this.sitT = 0; this.sniff = 0; this.sniffT = 0; this.wag = 0.5; this.t = 0;
    this.bark = 0;
    this.buildEyes();
  }
  buildEyes() {
    const B = this.f.B, e = this.f.meta.eye;
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x1a0f08, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02 });
    const hj = this.f.meta.joints[this.f.meta.bones.indexOf('head')];
    for (const sd of [1, -1]) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(e.r, 20, 14), mat);
      m.position.set(sd * e.x - hj[0], e.y - hj[1], e.z - hj[2]);
      B.head.add(m);
    }
    // nose shine handled by material on mesh (NOSE region) – add small glossy cap
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.017, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0x111010, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 }));
    nose.scale.set(1, 0.75, 0.75); nose.position.set(0, 0.605 - hj[1], 0.418 - hj[2]); B.head.add(nose);
  }
  goTo(p, cb, sp) { this.path = { to: p.clone(), cb }; this.speedT = sp || this.speed; }
  update(dt) {
    this.t += dt;
    let moving = false;
    if (this.path) {
      const d = tmp.copy(this.path.to).sub(this.pos); d.y = 0; const L = d.length();
      if (L < 0.04) { const cb = this.path.cb; this.path = null; cb && cb(); }
      else { moving = true; this.yawT = Math.atan2(d.x, d.z); this.pos.addScaledVector(d.normalize(), Math.min(this.speedT, L * 3 + 0.2) * dt * clamp01(this.walk * 1.5)); }
    }
    this.walk = damp(this.walk, moving ? 1 : 0, 6, dt);
    if (moving) this.phase += dt * this.speedT / 0.32 * Math.PI;
    let dy = this.yawT - this.yaw; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
    this.yaw += dy * (1 - Math.exp(-7 * dt));
    this.sit = damp(this.sit, moving ? 0 : this.sitT, 5, dt);
    this.sniff = damp(this.sniff, this.sniffT, 6, dt);
    this.bark = Math.max(0, this.bark - dt * 3);
    const f = this.f, B = f.B;
    f.resetPose();
    this.root.position.copy(this.pos); this.root.rotation.y = this.yaw;
    const ph = this.phase, w = this.walk;
    B.root.position.y += Math.abs(Math.sin(ph)) * 0.012 * w - this.sit * 0.12;
    B.root.rotation.x = this.sit * -0.42 + this.sniff * 0.12;
    B.spine.rotation.x = this.sit * -0.1 + this.sniff * 0.1;
    B.neck.rotation.x = this.sit * 0.35 + this.sniff * 0.7 - this.bark * 0.2;
    B.head.rotation.x = this.sniff * 0.3 + Math.sin(this.t * 14) * 0.02 * this.sniff - this.bark * 0.15;
    B.head.rotation.z = Math.sin(this.t * 0.7) * 0.08 * (1 - this.sniff);
    B.jaw.rotation.x = this.bark * 0.35 + (1 - this.sniff) * (0.06 + Math.sin(this.t * 9) * 0.03);
    const legs = [['flU', 'flL', 0], ['frU', 'frL', Math.PI], ['blU', 'blL', Math.PI], ['brU', 'brL', 0]];
    for (const [u, l, o] of legs) {
      const s = Math.sin(ph + o) * w;
      B[u].rotation.x = -s * 0.5 + (u[0] === 'b' ? this.sit * -0.9 : this.sit * 0.45);
      B[l].rotation.x = Math.max(0, Math.cos(ph + o)) * w * (u[0] === 'f' ? -0.7 : 0.6) + (u[0] === 'b' ? this.sit * 1.5 : this.sit * -0.1);
    }
    this.wag = damp(this.wag, 1, 2, dt);
    B.tail1.rotation.y = Math.sin(this.t * 16) * 0.5 * this.wag;
    B.earL.rotation.z = Math.sin(this.t * 3) * 0.05; B.earR.rotation.z = -Math.sin(this.t * 3.3) * 0.05;
    this.root.updateMatrixWorld(true);
  }
}
