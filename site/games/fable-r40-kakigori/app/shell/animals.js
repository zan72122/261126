// 「渡す」相手：顔が単純でかわいい動物（球の組み合わせ、頂点色、1匹 ≈ 7 draw call）。
// 待つ・のぞきこむ・食べる・喜ぶ・手を振る・歩く、を数式の動きで。
import * as THREE from '../vendor/three.module.min.js';
import { mergeParts, hop, clamp, damp } from './util.js';

export const ANIMAL_KINDS = ['usagi', 'kuma', 'neko', 'pengin'];
const PALETTES = {
  usagi: [{ fur: 0xffffff, belly: 0xfff0f4, ear: 0xffb6c8 }, { fur: 0xf3e2cf, belly: 0xfff8ee, ear: 0xffb0c0 }],
  kuma: [{ fur: 0xb57a48, belly: 0xf0d1a4, ear: 0x8a5a33 }, { fur: 0xe8c08a, belly: 0xfff0d6, ear: 0xc79a62 }],
  neko: [{ fur: 0xf6a54c, belly: 0xfff1e0, ear: 0xffb6c8 }, { fur: 0xb9bcc6, belly: 0xf6f6fa, ear: 0xffb6c8 }],
  pengin: [{ fur: 0x34405a, belly: 0xffffff, ear: 0xffa630 }, { fur: 0x5a7fa8, belly: 0xffffff, ear: 0xffb347 }],
};
export const VOICE = { usagi: 900, kuma: 360, neko: 700, pengin: 540 };

let sharedMat = null;
function mat() {
  if (!sharedMat) { sharedMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 }); sharedMat.userData.shared = true; }
  return sharedMat;
}
export function disposeAnimalShared() { if (sharedMat) { sharedMat.dispose(); sharedMat = null; } }

const S = (r, w = 16, h = 12) => new THREE.SphereGeometry(r, w, h);

export function makeAnimal(kind, colorIdx = 0) {
  const pal = PALETTES[kind][colorIdx % PALETTES[kind].length];
  const BLACK = 0x2a2230, CHEEK = 0xff9fb4, WHITE = 0xffffff;
  const group = new THREE.Group(); group.name = 'animal-' + kind;
  const lean = new THREE.Group(); group.add(lean);           // 前のめり用
  const bodyParts = [
    { geo: S(0.1, 18, 14), color: pal.fur, pos: [0, -0.06, 0], scale: [1, 1.12, 0.9] },
    { geo: S(0.07, 18, 14), color: pal.belly, pos: [0, -0.07, 0.058], scale: [0.95, 1.05, 0.5] },
  ];
  if (kind === 'usagi') bodyParts.push({ geo: S(0.03, 10, 8), color: WHITE, pos: [0, -0.12, -0.09] });
  if (kind === 'kuma') bodyParts.push({ geo: S(0.022, 10, 8), color: pal.fur, pos: [0, -0.13, -0.09] });
  const bodyMesh = new THREE.Mesh(mergeParts(bodyParts), mat()); lean.add(bodyMesh);

  const head = new THREE.Group(); head.position.set(0, 0.1, 0.01); lean.add(head);
  const hp = [];
  const headR = kind === 'pengin' ? 0.078 : 0.082;
  hp.push({ geo: S(headR, 22, 16), color: pal.fur, scale: kind === 'usagi' ? [1, 0.95, 0.95] : [1.08, 0.96, 0.96] });
  if (kind === 'usagi') {
    for (const sx of [-1, 1]) {
      hp.push({ geo: S(0.026, 12, 10), color: pal.fur, pos: [sx * 0.032, 0.11, -0.005], scale: [1, 2.6, 0.7], rot: [0, 0, -sx * 0.18] });
      hp.push({ geo: S(0.015, 10, 8), color: pal.ear, pos: [sx * 0.034, 0.112, 0.012], scale: [1, 2.6, 0.4], rot: [0, 0, -sx * 0.18] });
    }
    hp.push({ geo: S(0.022, 12, 10), color: WHITE, pos: [0, -0.025, 0.066], scale: [1.4, 0.9, 0.8] });
  } else if (kind === 'kuma') {
    for (const sx of [-1, 1]) {
      hp.push({ geo: S(0.03, 12, 10), color: pal.fur, pos: [sx * 0.062, 0.058, -0.01], scale: [1, 1, 0.6] });
      hp.push({ geo: S(0.017, 10, 8), color: pal.ear, pos: [sx * 0.062, 0.058, 0.004], scale: [1, 1, 0.4] });
    }
    hp.push({ geo: S(0.036, 14, 10), color: pal.belly, pos: [0, -0.026, 0.06], scale: [1.25, 0.85, 0.75] });
  } else if (kind === 'neko') {
    for (const sx of [-1, 1]) {
      hp.push({ geo: new THREE.ConeGeometry(0.03, 0.05, 4), color: pal.fur, pos: [sx * 0.05, 0.075, 0], rot: [0, Math.PI / 4, -sx * 0.35] });
      hp.push({ geo: new THREE.ConeGeometry(0.017, 0.03, 4), color: pal.ear, pos: [sx * 0.05, 0.072, 0.012], rot: [0, Math.PI / 4, -sx * 0.35] });
    }
    hp.push({ geo: S(0.026, 12, 10), color: pal.belly, pos: [0, -0.028, 0.066], scale: [1.5, 0.85, 0.75] });
  } else if (kind === 'pengin') {
    hp.push({ geo: S(0.066, 18, 14), color: pal.belly, pos: [0, -0.004, 0.026], scale: [1.02, 0.86, 0.82] });
    hp.push({ geo: new THREE.ConeGeometry(0.014, 0.026, 10), color: pal.ear, pos: [0, -0.02, 0.088], rot: [Math.PI / 2, 0, 0], scale: [1.3, 1, 0.7] });
  }
  // 鼻とほっぺ
  if (kind !== 'pengin') hp.push({ geo: S(0.009, 10, 8), color: kind === 'kuma' ? BLACK : 0xff8fa8, pos: [0, -0.012, kind === 'kuma' ? 0.088 : 0.082], scale: [1.3, 1, 1] });
  for (const sx of [-1, 1]) hp.push({ geo: S(0.014, 10, 8), color: CHEEK, pos: [sx * 0.05, -0.022, 0.06], scale: [1.2, 0.8, 0.4], rot: [0, sx * 0.6, 0] });
  head.add(new THREE.Mesh(mergeParts(hp), mat()));

  // 目（ふつう：黒い点＋光）・目（喜び：^ ^）
  const eyeZ = kind === 'pengin' ? 0.086 : 0.078, eyeY = 0.014, eyeX = 0.03;
  const eyes = new THREE.Mesh(mergeParts([
    { geo: S(0.011, 12, 10), color: BLACK, pos: [-eyeX, eyeY, eyeZ], scale: [1, 1.15, 0.6] },
    { geo: S(0.011, 12, 10), color: BLACK, pos: [eyeX, eyeY, eyeZ], scale: [1, 1.15, 0.6] },
    { geo: S(0.0035, 6, 5), color: WHITE, pos: [-eyeX + 0.004, eyeY + 0.005, eyeZ + 0.007] },
    { geo: S(0.0035, 6, 5), color: WHITE, pos: [eyeX + 0.004, eyeY + 0.005, eyeZ + 0.007] },
  ]), mat());
  head.add(eyes);
  const happyEyes = new THREE.Mesh(mergeParts([
    { geo: new THREE.TorusGeometry(0.011, 0.0032, 5, 12, Math.PI), color: BLACK, pos: [-eyeX, eyeY - 0.004, eyeZ + 0.002] },
    { geo: new THREE.TorusGeometry(0.011, 0.0032, 5, 12, Math.PI), color: BLACK, pos: [eyeX, eyeY - 0.004, eyeZ + 0.002] },
  ]), mat());
  happyEyes.visible = false; head.add(happyEyes);
  // 口（にっこり）と開いた口
  const mouthZ = kind === 'kuma' ? 0.093 : kind === 'pengin' ? 0.084 : 0.083, mouthY = kind === 'pengin' ? -0.042 : -0.034;
  const mouth = new THREE.Mesh(mergeParts([
    { geo: new THREE.TorusGeometry(0.009, 0.0022, 5, 10, Math.PI), color: BLACK, pos: [0, mouthY + 0.006, mouthZ], rot: [0, 0, Math.PI] },
  ]), mat());
  head.add(mouth);
  const mouthOpen = new THREE.Mesh(mergeParts([
    { geo: S(0.012, 12, 8), color: 0x9c2b3c, pos: [0, mouthY, mouthZ - 0.002], scale: [1.1, 0.9, 0.5] },
    { geo: S(0.007, 8, 6), color: 0xff7f95, pos: [0, mouthY - 0.004, mouthZ + 0.002], scale: [1.2, 0.6, 0.5] },
  ]), mat());
  mouthOpen.visible = false; head.add(mouthOpen);

  // 腕（肩を支点に回す）
  const armGeo = () => mergeParts([{ geo: new THREE.CapsuleGeometry(0.022, 0.05, 4, 10), color: kind === 'pengin' ? pal.fur : pal.fur, pos: [0, -0.04, 0] }]);
  const arms = [-1, 1].map((sx) => {
    const a = new THREE.Group(); a.position.set(sx * 0.085, -0.01, 0.03);
    a.add(new THREE.Mesh(armGeo(), mat())); lean.add(a); return a;
  });

  // 当たり判定（大きめ）
  const pick = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
  pick.position.y = 0.04; pick.userData.kind = 'customer'; group.add(pick);

  // ---- 動き ----
  const st = {
    mode: 'wait', modeT: 0, blinkT: 1 + Math.random() * 2, hopT: 9, yaw: 0, leanAmt: 0, eat: 0, happy: 0,
    walkFrom: new THREE.Vector3(), walkTo: new THREE.Vector3(), walkDur: 1, walkT: 1, eager: 0, wave: 0, phase: Math.random() * 6,
  };
  function setMode(m) { st.mode = m; st.modeT = 0; }
  function walkTo(p, dur) { st.walkFrom.copy(group.position); st.walkTo.copy(p); st.walkDur = dur; st.walkT = 0; }
  function poke() { st.hopT = 0; }

  // ctx: { dt, time, lookX (世界 x), eager 0..1 }
  function update(dt, ctx) {
    st.modeT += dt; st.phase += dt;
    // 歩く
    if (st.walkT < st.walkDur) {
      st.walkT = Math.min(st.walkDur, st.walkT + dt);
      const u = st.walkT / st.walkDur, e = u * u * (3 - 2 * u);
      group.position.lerpVectors(st.walkFrom, st.walkTo, e);
      group.position.y = st.walkFrom.y + (st.walkTo.y - st.walkFrom.y) * e + Math.abs(Math.sin(u * Math.PI * 5)) * 0.02;
    }
    // まばたき
    st.blinkT -= dt;
    let eyeS = 1;
    if (st.blinkT < 0) { eyeS = 0.12; if (st.blinkT < -0.12) st.blinkT = 2 + Math.random() * 3; }
    eyes.scale.set(1, eyeS, 1);
    // 目で器を追う
    const targetYaw = clamp((ctx.lookX - group.position.x) * 1.6, -0.5, 0.5);
    st.yaw += (targetYaw - st.yaw) * damp(4, dt);
    // 前のめり（器が近い・食べる）
    st.eager += ((ctx.eager || 0) - st.eager) * damp(5, dt);
    const isEat = st.mode === 'eat', isHappy = st.mode === 'happy';
    st.eat += ((isEat ? 1 : 0) - st.eat) * damp(8, dt);
    st.happy += ((isHappy ? 1 : 0) - st.happy) * damp(6, dt);
    const leanX = st.eager * 0.22 + st.eat * 0.45;
    lean.rotation.x = leanX;
    head.rotation.set(-0.14 + st.eat * 0.5 + Math.sin(st.phase * 1.3) * 0.03, st.yaw * (1 - st.eat), Math.sin(st.phase * 0.9) * 0.05);
    // 呼吸・ぴょん
    st.hopT += dt;
    let y = Math.sin(st.phase * 2.2) * 0.003;
    if (st.hopT < 0.45) y += hop(st.hopT / 0.45) * 0.05;
    if (isHappy) y += Math.abs(Math.sin(st.modeT * 7)) * 0.045 * Math.max(0, 1 - st.modeT / 2.2);
    lean.position.y = y;
    // 表情
    const smile = isHappy || isEat;
    happyEyes.visible = isHappy; eyes.visible = !isHappy;
    mouthOpen.visible = smile && (isHappy || Math.sin(st.modeT * 18) > 0); mouth.visible = !mouthOpen.visible;
    // 腕
    const reach = Math.max(st.eager, st.eat);
    const wave = st.mode === 'wave' || st.mode === 'leave' ? 1 : 0;
    st.wave += (wave - st.wave) * damp(6, dt);
    arms[0].rotation.set(-0.9 - reach * 0.6 - st.happy * 1.2 + Math.sin(st.modeT * 14) * st.happy * 0.3, 0, -0.2 - st.happy * 0.5);
    arms[1].rotation.set(-0.9 - reach * 0.6 - st.happy * 1.2 - st.wave * 1.6 + Math.sin(st.modeT * 14) * st.happy * 0.3, 0, 0.2 + st.happy * 0.5 + st.wave * (0.6 + Math.sin(st.modeT * 9) * 0.5));
  }

  function dispose() {
    group.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material && !o.material.userData.shared) o.material.dispose(); });
    group.removeFromParent();
  }

  return { kind, group, head, pick, update, setMode, walkTo, poke, dispose, get mode() { return st.mode; }, get walking() { return st.walkT < st.walkDur; } };
}
