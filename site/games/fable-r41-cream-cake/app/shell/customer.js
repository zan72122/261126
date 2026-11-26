// The customer: a simple, round, cute animal (bear / rabbit / cat / chick). Built from spheres; animated by formulas.
import { THREE, mergeGeos, place, lerp, clamp, follow, wobble, easeBack } from './util.js';

export const ANIMALS = [
  { kind: 'bear', main: 0xc98d5e, accent: 0xf3dcc2, ears: 'round' },
  { kind: 'rabbit', main: 0xfbf6f3, accent: 0xffc7d4, ears: 'long' },
  { kind: 'cat', main: 0xf6b166, accent: 0xfff2df, ears: 'pointy' },
  { kind: 'chick', main: 0xffe066, accent: 0xff9f43, ears: 'tuft' },
];

const S = (r, w = 16, h = 12) => new THREE.SphereGeometry(r, w, h);

function buildAnimal(def) {
  const mMain = new THREE.MeshLambertMaterial({ color: def.main, emissive: 0x000000 });
  const mAcc = new THREE.MeshLambertMaterial({ color: def.accent });
  const mDark = new THREE.MeshLambertMaterial({ color: 0x3b2a2a });
  const mCheek = new THREE.MeshLambertMaterial({ color: 0xff9db5 });
  const root = new THREE.Group();     // placed on the counter
  const bodyG = new THREE.Group();    // squash/stretch + hop
  root.add(bodyG);
  // body + belly
  bodyG.add(new THREE.Mesh(place(S(0.62, 24, 16), 0, 0.62, 0, 0, 0, 0, 1, 0.95, 0.9), mMain));
  bodyG.add(new THREE.Mesh(place(S(0.4, 18, 12), 0, 0.56, 0.4, 0, 0, 0, 1, 1.05, 0.45), mAcc));
  // head
  const head = new THREE.Group();
  head.position.set(0, 1.42, 0.02);
  bodyG.add(head);
  const headMain = [place(S(0.66, 20, 14), 0, 0, 0, 0, 0, 0, 1.08, 0.95, 0.95)];
  const headAcc = [];
  if (def.ears === 'round') {
    for (const s of [-1, 1]) { headMain.push(place(S(0.22, 12, 8), s * 0.5, 0.48, -0.05)); headAcc.push(place(S(0.13, 10, 8), s * 0.5, 0.48, 0.07, 0, 0, 0, 1, 1, 0.5)); }
  } else if (def.ears === 'long') {
    for (const s of [-1, 1]) { headMain.push(place(new THREE.CapsuleGeometry(0.15, 0.6, 4, 10), s * 0.25, 0.85, -0.05, 0, 0, s * -0.18, 1, 1, 0.7)); headAcc.push(place(new THREE.CapsuleGeometry(0.08, 0.45, 4, 8), s * 0.25, 0.85, 0.05, 0, 0, s * -0.18, 1, 1, 0.4)); }
  } else if (def.ears === 'pointy') {
    for (const s of [-1, 1]) { headMain.push(place(new THREE.ConeGeometry(0.22, 0.38, 10), s * 0.42, 0.55, 0, 0, 0, s * -0.4)); headAcc.push(place(new THREE.ConeGeometry(0.12, 0.22, 8), s * 0.42, 0.53, 0.1, 0, 0, s * -0.4, 1, 1, 0.5)); }
  } else {
    headMain.push(place(new THREE.ConeGeometry(0.08, 0.3, 8), 0, 0.68, 0, 0, 0, 0.3), place(new THREE.ConeGeometry(0.07, 0.25, 8), 0.08, 0.66, 0, 0, 0, -0.4));
  }
  if (def.kind === 'chick') headAcc.push(place(new THREE.ConeGeometry(0.11, 0.2, 10), 0, -0.12, 0.66, Math.PI / 2, 0, 0, 1, 1, 1));
  else headAcc.push(place(S(0.28, 14, 10), 0, -0.2, 0.5, 0, 0, 0, 1.2, 0.8, 0.7));
  head.add(new THREE.Mesh(mergeGeos(headMain), mMain));
  head.add(new THREE.Mesh(mergeGeos(headAcc), mAcc));
  const dark = [];
  for (const s of [-1, 1]) dark.push(place(S(0.075, 10, 8), s * 0.24, 0.06, 0.6));
  const eyes = new THREE.Mesh(mergeGeos(dark), mDark);
  head.add(eyes);
  const happyG = [];
  for (const s of [-1, 1]) happyG.push(place(new THREE.TorusGeometry(0.075, 0.022, 6, 12, Math.PI), s * 0.24, 0.03, 0.62));
  const happy = new THREE.Mesh(mergeGeos(happyG), mDark);
  happy.visible = false;
  head.add(happy);
  const noseMouth = [];
  if (def.kind !== 'chick') noseMouth.push(place(S(0.065, 10, 8), 0, -0.1, 0.72, 0, 0, 0, 1.3, 0.9, 0.8));
  noseMouth.push(place(new THREE.TorusGeometry(0.08, 0.02, 6, 12, Math.PI), 0, -0.25, 0.66, 0, 0, Math.PI));
  const mouth = new THREE.Mesh(mergeGeos(noseMouth), mDark);
  head.add(mouth);
  const mouthO = new THREE.Mesh(place(S(0.07, 10, 8), 0, -0.3, 0.66, 0, 0, 0, 1, 1, 0.5), mDark);
  mouthO.visible = false;
  head.add(mouthO);
  const cheeks = [];
  const cheekL = new THREE.Mesh(place(S(0.12, 10, 8), 0, 0, 0, 0, 0, 0, 1, 0.7, 0.4), mCheek);
  const cheekR = cheekL.clone();
  cheekL.position.set(-0.4, -0.16, 0.48); cheekR.position.set(0.4, -0.16, 0.48);
  head.add(cheekL, cheekR); cheeks.push(cheekL, cheekR);
  // arms (pivot at shoulders)
  const arms = [-1, 1].map((s) => {
    const pivot = new THREE.Group();
    pivot.position.set(s * 0.52, 0.9, 0.1);
    const arm = new THREE.Mesh(place(new THREE.CapsuleGeometry(0.15, 0.36, 4, 10), 0, -0.25, 0), mMain);
    pivot.add(arm);
    bodyG.add(pivot);
    return pivot;
  });
  const proxy = new THREE.Mesh(new THREE.SphereGeometry(1.25, 8, 6).translate(0, 1.2, 0), new THREE.MeshBasicMaterial({ visible: false }));
  proxy.userData = { kind: 'customer' };
  root.add(proxy);
  return { root, bodyG, head, eyes, happy, mouth, mouthO, cheeks, arms, proxy, mats: [mMain, mAcc, mDark, mCheek], mMain };
}

export class Customer {
  constructor(W) {
    this.W = W;
    this.a = null;
    this.idx = -1;
    this.pos = new THREE.Vector3();
    this.target = new THREE.Vector3();
    this.hopT = 9; this.hopH = 0;
    this.waveT = 2;
    this.arms = 0;      // 0 down, 1 reach forward
    this.armsUp = 0;    // cheering
    this.blow = 0;
    this.happyT = 0;
    this.lean = 0;
    this.appear = 1;
    this.shadow = W.shadow(W.scene, 0, 0, 2.0);
    this.halo = W.halo(W.scene, 0, 0.01, 0, 2.6);
  }

  setAnimal(i, at) {
    if (this.a) { this.W.scene.remove(this.a.root); this.a.root.traverse((o) => { if (o.isMesh) o.geometry.dispose(); }); this.a.mats.forEach((m) => m.dispose()); }
    this.idx = i;
    this.a = buildAnimal(ANIMALS[i % ANIMALS.length]);
    this.W.scene.add(this.a.root);
    this.pos.copy(at); this.target.copy(at);
    this.arms = 0; this.armsUp = 0; this.blow = 0; this.happyT = 0; this.lean = 0;
    this.appear = 0; this.carry = null;
  }

  hop(h = 0.45) { this.hopT = 0; this.hopH = h; }
  moveTo(v) { this.target.copy(v); }
  delight(dur = 2.2) { this.happyT = dur; }

  update(dt, t) {
    const a = this.a; if (!a) return;
    this.appear = Math.min(1, this.appear + dt * 2.2);
    const moving = this.pos.distanceTo(this.target) > 0.02;
    this.pos.lerp(this.target, follow(4.5, dt));
    if (moving && this.hopT > 0.45) this.hop(0.3);
    this.hopT += dt;
    const hp = clamp(this.hopT / 0.42, 0, 1);
    const y = Math.sin(hp * Math.PI) * this.hopH;
    a.root.position.set(this.pos.x, y, this.pos.z);
    const s = easeBack(this.appear);
    a.root.scale.setScalar(Math.max(1e-3, s));
    // squash on landing, breathing when idle
    const land = wobble(this.hopT - 0.42, 18, 8) * 0.12;
    const breathe = Math.sin(t * 2.2) * 0.02;
    a.bodyG.scale.set(1 + land, 1 - land + breathe, 1 + land);
    // face toward the cake (slightly) and lean when blowing
    a.root.rotation.y = lerp(a.root.rotation.y, Math.atan2(-this.pos.x, 3.0) * 0.5, follow(3, dt));
    a.head.rotation.x = lerp(a.head.rotation.x, 0.25 * this.blow + 0.12 * this.lean + Math.sin(t * 1.3) * 0.04, follow(8, dt));
    a.head.rotation.z = Math.sin(t * 0.9) * 0.06;
    // arms: wave every few seconds when idle; reach when expecting the box; up when cheering
    this.waveT -= dt;
    if (this.waveT < -1.6) this.waveT = 3 + Math.random() * 2.5;
    const waving = this.waveT < 0 && this.arms < 0.1 && this.armsUp < 0.1;
    const [L, R] = a.arms;
    const up = this.armsUp * (0.9 + 0.25 * Math.sin(t * 12));
    L.rotation.set(-1.2 * this.arms, 0, -0.35 - 2.2 * up);
    R.rotation.set(-1.2 * this.arms, 0, 0.35 + 2.2 * up + (waving ? 2.1 + Math.sin(t * 14) * 0.45 : 0));
    // face: blowing cheeks / happy eyes
    const happy = this.happyT > 0;
    this.happyT -= dt;
    a.eyes.visible = !happy; a.happy.visible = happy;
    a.mouth.visible = this.blow < 0.5; a.mouthO.visible = this.blow >= 0.5;
    const ch = 1 + this.blow * 0.6;
    a.cheeks.forEach((c) => c.scale.setScalar(ch));
    this.shadow.position.set(this.pos.x, 0.006, this.pos.z);
    this.shadow.scale.set(2.0 * s, 1, 1.6 * s);
    this.halo.position.set(this.pos.x, 0.012, this.pos.z + 0.3);
  }

  dispose() { if (this.a) { this.a.root.traverse((o) => { if (o.isMesh) o.geometry.dispose(); }); this.a.mats.forEach((m) => m.dispose()); } }
}
