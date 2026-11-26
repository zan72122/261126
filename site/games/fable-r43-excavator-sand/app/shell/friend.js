// 「渡す」相手：顔が単純でかわいい動物（うさぎ・くま・ひよこ）。球の組み合わせだけで作る。
// 立ち位置で砂場の方を見て待ち、砂が届くと跳ねて喜ぶ。
import * as THREE from '../vendor/three/three.module.js';
import { bubbleTexture, blobShadow } from './assets.js';
import { mergeStatic } from './merge.js';

export const FRIENDS = [
  { kind: 'rabbit', body: 0xfdf7f2, accent: 0xffb7cf, flag: 0xff5c9e, castleTowers: 2 },
  { kind: 'bear', body: 0xb07a4a, accent: 0xe8c9a0, flag: 0x3d8bff, castleTowers: 3 },
  { kind: 'chick', body: 0xffd84a, accent: 0xff9a2e, flag: 0xff8a1e, castleTowers: 4 },
];

let sharedSphere = null;
function sphere() {
  if (!sharedSphere) sharedSphere = new THREE.SphereGeometry(1, 20, 14);
  return sharedSphere;
}

export function createFriend(scene, tier, index, pos, lookAt) {
  const def = FRIENDS[index % FRIENDS.length];
  const disposables = [];
  const keep = (x) => { disposables.push(x); return x; };
  const root = new THREE.Group();
  root.name = 'friend';
  root.position.copy(pos);
  const facing = Math.atan2(lookAt.x - pos.x, lookAt.z - pos.z);
  root.rotation.y = facing;
  const bodyG = new THREE.Group(); // 跳ね・つぶれ
  root.add(bodyG);

  const mat = (c, e = 0) => keep(new THREE.MeshLambertMaterial({ color: c, emissive: e }));
  const mBody = mat(def.body), mAccent = mat(def.accent), mEye = mat(0x222026), mWhite = mat(0xffffff, 0x666666), mCheek = mat(0xff9fb8);
  const ball = (m, sx, sy, sz, x, y, z, parent = bodyG) => {
    const s = new THREE.Mesh(sphere(), m);
    s.scale.set(sx, sy, sz); s.position.set(x, y, z);
    s.castShadow = tier.shadows;
    parent.add(s);
    return s;
  };

  // 体と頭（ひよこは一体型）
  const headY = def.kind === 'chick' ? 0.3 : 0.5;
  const head = new THREE.Group();
  head.position.y = headY;
  bodyG.add(head);
  if (def.kind === 'chick') {
    ball(mBody, 0.27, 0.27, 0.25, 0, 0.27, 0);
  } else {
    ball(mBody, 0.19, 0.22, 0.17, 0, 0.22, 0);
    ball(def.kind === 'bear' ? mAccent : mWhite, 0.12, 0.13, 0.06, 0, 0.21, 0.13); // おなか
    ball(mBody, 0.19, 0.17, 0.17, 0, 0, 0, head);
  }
  const HF = def.kind === 'chick' ? 0.235 : 0.155; // 顔の前面
  // 目（黒い点＋白いハイライト）
  for (const sx of [-1, 1]) {
    ball(mEye, 0.026, 0.032, 0.02, sx * 0.065, 0.02, HF, head);
    ball(mWhite, 0.009, 0.009, 0.006, sx * 0.065 + 0.008, 0.032, HF + 0.016, head);
    ball(mCheek, 0.03, 0.018, 0.012, sx * 0.105, -0.035, HF - 0.02, head);
  }
  // 口・鼻
  if (def.kind === 'chick') {
    const beak = new THREE.Mesh(keep(new THREE.ConeGeometry(0.035, 0.07, 10)), mAccent);
    beak.rotation.x = Math.PI / 2; beak.position.set(0, -0.025, HF + 0.025);
    head.add(beak);
    ball(mBody, 0.025, 0.05, 0.025, 0.0, 0.265, 0.0, head).rotation.z = 0.3; // とさか
    ball(mBody, 0.02, 0.04, 0.02, 0.03, 0.255, 0.0, head).rotation.z = -0.5;
  } else {
    if (def.kind === 'bear') ball(mAccent, 0.07, 0.05, 0.04, 0, -0.035, HF - 0.01, head);
    ball(def.kind === 'bear' ? mEye : mCheek, 0.018, 0.013, 0.012, 0, -0.02, HF + (def.kind === 'bear' ? 0.03 : 0.0), head);
    const smile = new THREE.Mesh(keep(new THREE.TorusGeometry(0.022, 0.005, 6, 12, Math.PI)), mEye);
    smile.rotation.z = Math.PI; smile.position.set(0, -0.045, HF + (def.kind === 'bear' ? 0.028 : 0.004));
    head.add(smile);
  }
  // 耳
  const ears = [];
  for (const sx of [-1, 1]) {
    const e = new THREE.Group();
    if (def.kind === 'rabbit') {
      e.position.set(sx * 0.07, 0.13, -0.01);
      ball(mBody, 0.045, 0.14, 0.03, 0, 0.12, 0, e);
      ball(mAccent, 0.025, 0.1, 0.012, 0, 0.12, 0.022, e);
      e.rotation.z = -sx * 0.12;
    } else if (def.kind === 'bear') {
      e.position.set(sx * 0.13, 0.12, -0.02);
      ball(mBody, 0.06, 0.06, 0.035, 0, 0, 0, e);
      ball(mAccent, 0.035, 0.035, 0.012, 0, 0, 0.03, e);
    } else {
      e.position.set(sx * 0.25, 0.27 - headY + 0.0, 0.0); // ひよこは羽
      ball(mBody, 0.05, 0.11, 0.08, 0, 0, 0, e);
    }
    head.add(e);
    ears.push(e);
  }
  // 腕（手招き・ばんざい）
  const arms = [];
  for (const sx of [-1, 1]) {
    const a = new THREE.Group();
    a.position.set(sx * (def.kind === 'chick' ? 0.24 : 0.16), def.kind === 'chick' ? 0.3 : 0.3, 0.02);
    if (def.kind !== 'chick') ball(mBody, 0.045, 0.1, 0.045, 0, -0.07, 0, a);
    bodyG.add(a);
    arms.push(a);
  }
  // 足
  for (const sx of [-1, 1]) ball(def.kind === 'chick' ? mAccent : mBody, 0.06, 0.035, 0.08, sx * 0.08, 0.02, 0.04);

  // 顔の小さな部品は影を落とさない。動かない部品を材質ごとに結合（頭・体それぞれ）して draw call を減らす
  for (const o of head.children) if (o.isMesh && o.material !== mBody && o.material !== mAccent) o.castShadow = false;
  for (const g of [...mergeStatic(head), ...mergeStatic(bodyG)]) keep(g);

  // 吹き出し（お城の絵）
  const bubbleTex = keep(bubbleTexture());
  const bubbleMat = keep(new THREE.SpriteMaterial({ map: bubbleTex, depthTest: true }));
  const bubble = new THREE.Sprite(bubbleMat);
  bubble.scale.set(0.42, 0.42, 1);
  bubble.position.set(pos.x - 0.3, 1.0, pos.z - 0.15); // 吹き出しは世界座標で頭の左上に
  scene.add(bubble);

  // 当たり判定
  const pick = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.3, 0.3, 0.9, 8)), keep(new THREE.MeshBasicMaterial({ visible: false })));
  pick.position.y = 0.45;
  pick.userData.owner = 'friend';
  root.add(pick);

  let blob = null;
  if (!tier.shadows) { blob = blobShadow(THREE, 0.55, 0.55, 0.35); root.add(blob); }

  scene.add(root);

  const st = {
    t: 0, hop: 0, hopsLeft: 0, hopT: 0, joy: 0, dance: 0, wave: 0, excite: 0,
    bubble: 1, enter: 0, leaving: 0, gone: false, look: 0,
  };
  root.scale.setScalar(0.001);

  function update(dt, time, watchPoint) {
    st.t += dt;
    // 入場（ぽんと出る）・退場
    if (st.leaving > 0) {
      st.leaving += dt;
      const k = Math.max(0, 1 - st.leaving / 0.6);
      root.scale.setScalar(Math.max(0.001, k));
      if (k <= 0) st.gone = true;
    } else {
      st.enter = Math.min(1, st.enter + dt / 0.6);
      const e = st.enter, over = Math.sin(e * Math.PI) * 0.18;
      root.scale.setScalar(Math.max(0.001, e + over * (1 - e) * 2));
    }
    // 跳ね
    let y = 0, squash = 1;
    if (st.hopsLeft > 0 || st.hopT > 0) {
      st.hopT += dt / 0.42;
      if (st.hopT >= 1) { st.hopT = 0; st.hopsLeft--; if (st.hopsLeft <= 0) st.hopT = 0; }
      const p = st.hopT;
      y = Math.sin(p * Math.PI) * 0.22 * (st.dance > 0 ? 1.2 : 1);
      squash = 1 + Math.sin(p * Math.PI * 2) * 0.08;
    }
    const breathe = 1 + Math.sin(time * 2.2) * 0.02;
    bodyG.position.y = y;
    bodyG.scale.set(1 / Math.sqrt(squash), squash * breathe, 1 / Math.sqrt(squash));
    // 踊り（くるっと回る）
    if (st.dance > 0) {
      st.dance = Math.max(0, st.dance - dt);
      bodyG.rotation.y += dt * 7.5;
      if (st.dance === 0) bodyG.rotation.y = 0;
    } else {
      // 見る方向（トラック／砂場）
      if (watchPoint) {
        const wp = root.worldToLocal(watchPoint.clone());
        const a = THREE.MathUtils.clamp(Math.atan2(wp.x, wp.z), -0.9, 0.9);
        st.look += (a - st.look) * Math.min(1, dt * 4);
      }
      bodyG.rotation.y = st.look * 0.5;
      head.rotation.y = st.look * 0.5;
    }
    // 腕：喜び→ばんざい、待ち→ときどき手招き
    st.joy = Math.max(0, st.joy - dt);
    const beckon = st.joy <= 0 && st.dance <= 0 && (st.t % 4.5) > 3.6 ? Math.sin((st.t % 4.5 - 3.6) * Math.PI / 0.9 * 3) : 0;
    const up = st.joy > 0 || st.dance > 0 ? 1 : 0;
    arms.forEach((a, i) => {
      const sx = i === 0 ? -1 : 1;
      const target = up ? sx * (2.4 + Math.sin(time * 14) * 0.25) : i === 1 ? 0.4 + Math.abs(beckon) * 1.6 : sx * 0.15;
      a.rotation.z += (target - a.rotation.z) * Math.min(1, dt * 12);
    });
    // 耳ぱたぱた
    ears.forEach((e, i) => {
      const sx = i === 0 ? -1 : 1;
      const base = def.kind === 'rabbit' ? -sx * 0.12 : 0;
      const flap = (st.joy > 0 || st.dance > 0 ? Math.sin(time * 18 + i) * 0.35 : Math.sin(time * 1.7 + i) * 0.04);
      e.rotation.z = base + flap * (def.kind === 'chick' ? -sx * 1.5 : 1);
    });
    // 吹き出し
    const want = st.joy > 0 || st.dance > 0 || st.leaving > 0 ? 0 : st.bubble;
    const cur = bubble.scale.x / 0.42;
    const nb = cur + (want - cur) * Math.min(1, dt * 6);
    bubble.scale.set(0.42 * nb, 0.42 * nb, 1);
    bubble.visible = nb > 0.02;
    bubble.position.y = (1.0 + Math.sin(time * 2) * 0.02) * root.scale.y;
  }

  return {
    root, pick, def,
    get gone() { return st.gone; },
    cheer(n = 3) { st.hopsLeft = n; st.hopT = 0.001; st.joy = n * 0.42 + 0.3; },
    dance(sec = 3) { st.dance = sec; st.hopsLeft = Math.ceil(sec / 0.42); st.hopT = 0.001; st.joy = sec; },
    wave() { st.joy = 0.9; st.hopsLeft = 1; st.hopT = 0.001; },
    excite() { if (st.hopsLeft <= 0) { st.hopsLeft = 1; st.hopT = 0.001; } },
    setBubble(v) { st.bubble = v; },
    leave() { st.leaving = 0.0001; },
    headWorld(out) { return head.getWorldPosition(out); },
    update,
    dispose() { for (const d of disposables) d.dispose(); if (blob) blob.userData.dispose(); scene.remove(root); scene.remove(bubble); },
  };
}
