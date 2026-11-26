// 「渡す」相手：顔が単純でかわいい動物。球・カプセルの低ポリをパラメータから作る。
// 1体＝頭(結合)・体(結合)・目・にっこり目・口・ほっぺ・腕2本 ≈ 8 draw call、約 5,000 三角形。
import { mergeParts, mat } from './geo.js';

export const ANIMALS = [
  { id: 'bear', body: 0xb9814f, belly: 0xf0d2a8, ear: 'round', earIn: 0xe8b98c, muzzle: 0xf3dcb8, nose: 0x4a2c1a, flower: 0xff6fa8 },
  { id: 'rabbit', body: 0xf6f1ea, belly: 0xffffff, ear: 'long', earIn: 0xffb6c9, muzzle: 0xffffff, nose: 0xff8fab, flower: 0xffc93c },
  { id: 'cat', body: 0xf4a45c, belly: 0xfff0dc, ear: 'tri', earIn: 0xffc9a3, muzzle: 0xfff3e2, nose: 0xff7f9f, flower: 0x6fc3ff },
  { id: 'penguin', body: 0x34436b, belly: 0xffffff, ear: 'none', earIn: 0x34436b, muzzle: 0xffffff, nose: 0xffa53a, mask: 0xffffff, flower: 0xb58cff },
  { id: 'panda', body: 0xffffff, belly: 0xffffff, ear: 'round', earDark: true, earIn: 0x2b2b2b, muzzle: 0xffffff, nose: 0x2b2b2b, patches: true, arms: 0x2b2b2b, flower: 0xff8a5c },
];

// 寸法（ローカル原点＝足元の床、+Z がこちら向き）
const D = {
  headY: 1.30, headR: 0.22,
  bodyY: 0.86, bodyR: [0.25, 0.30, 0.21],
  shoulder: [0.215, 1.03, 0.03], armR: 0.055, armLen: 0.20,
};

let shared = null;
function sharedGeos(THREE) {
  if (shared) return shared;
  shared = {
    sphere: new THREE.SphereGeometry(1, 18, 12),
    sphereLo: new THREE.SphereGeometry(1, 10, 8),
    arm: new THREE.CapsuleGeometry(D.armR, D.armLen, 4, 10).translate(0, -(D.armLen / 2 + D.armR * 0.3), 0),
    arc: new THREE.TorusGeometry(0.024, 0.0075, 6, 14, Math.PI),
    smile: new THREE.TorusGeometry(0.026, 0.006, 6, 14, Math.PI).rotateZ(Math.PI),
    proxy: new THREE.SphereGeometry(1, 8, 6),
  };
  return shared;
}

export function createCustomer(THREE, def) {
  const S = sharedGeos(THREE);
  const own = []; // この動物だけの geometry
  const mats = [];
  const M = (o) => { const m = new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.75, metalness: 0 }, o)); mats.push(m); return m; };

  const root = new THREE.Group();
  root.name = 'customer-' + def.id;
  const bodyPivot = new THREE.Group(); // 跳ねる・揺れる
  root.add(bodyPivot);

  // 体（体＋おなか）
  const bodyParts = [
    { geo: S.sphere, matrix: mat(THREE, 0, D.bodyY, 0, 0, 0, 0, ...D.bodyR), color: def.body },
    { geo: S.sphereLo, matrix: mat(THREE, 0, D.bodyY - 0.03, 0.10, 0, 0, 0, 0.17, 0.22, 0.12), color: def.belly },
    // 下半身（カウンターの陰に入るまで伸ばして、浮いて見えないように）
    { geo: S.sphereLo, matrix: mat(THREE, 0, 0.45, 0, 0, 0, 0, 0.23, 0.42, 0.19), color: def.body },
  ];
  const bodyGeo = mergeParts(THREE, bodyParts); own.push(bodyGeo);
  bodyPivot.add(new THREE.Mesh(bodyGeo, M({ vertexColors: true })));

  // 頭（頭・耳・鼻まわり・模様をまとめる）
  const head = new THREE.Group();
  head.position.set(0, D.headY, 0);
  bodyPivot.add(head);
  const hr = D.headR;
  const hp = [{ geo: S.sphere, matrix: mat(THREE, 0, 0, 0, 0, 0, 0, hr, hr * 0.94, hr * 0.92), color: def.body }];
  if (def.ear === 'round') {
    for (const sx of [-1, 1]) {
      hp.push({ geo: S.sphereLo, matrix: mat(THREE, sx * 0.15, 0.16, -0.02, 0, 0, 0, 0.075, 0.075, 0.05), color: def.earDark ? 0x2b2b2b : def.body });
      hp.push({ geo: S.sphereLo, matrix: mat(THREE, sx * 0.15, 0.16, 0.02, 0, 0, 0, 0.045, 0.045, 0.02), color: def.earIn });
    }
  } else if (def.ear === 'long') {
    for (const sx of [-1, 1]) {
      hp.push({ geo: S.sphere, matrix: mat(THREE, sx * 0.08, 0.30, -0.02, 0, 0, -sx * 0.12, 0.05, 0.17, 0.035), color: def.body });
      hp.push({ geo: S.sphereLo, matrix: mat(THREE, sx * 0.08, 0.30, 0.008, 0, 0, -sx * 0.12, 0.028, 0.13, 0.012), color: def.earIn });
    }
  } else if (def.ear === 'tri') {
    const cone = new THREE.ConeGeometry(0.075, 0.13, 4);
    const coneIn = new THREE.ConeGeometry(0.045, 0.08, 4);
    for (const sx of [-1, 1]) {
      hp.push({ geo: cone, matrix: mat(THREE, sx * 0.13, 0.19, -0.01, 0, Math.PI / 4, -sx * 0.35, 1, 1, 0.55), color: def.body });
      hp.push({ geo: coneIn, matrix: mat(THREE, sx * 0.128, 0.18, 0.02, 0, Math.PI / 4, -sx * 0.35, 1, 1, 0.3), color: def.earIn });
    }
  }
  if (def.mask) hp.push({ geo: S.sphere, matrix: mat(THREE, 0, -0.03, 0.07, 0, 0, 0, 0.17, 0.15, 0.16), color: def.mask });
  if (def.patches) {
    for (const sx of [-1, 1]) hp.push({ geo: S.sphereLo, matrix: mat(THREE, sx * 0.075, 0.03, 0.17, 0, 0, sx * 0.5, 0.045, 0.06, 0.03), color: 0x2b2b2b });
  }
  // 鼻まわり
  if (def.id === 'penguin') {
    const beak = new THREE.ConeGeometry(0.03, 0.06, 8);
    hp.push({ geo: beak, matrix: mat(THREE, 0, -0.05, 0.225, Math.PI / 2, 0, 0, 1, 1, 0.7), color: def.nose });
  } else {
    hp.push({ geo: S.sphereLo, matrix: mat(THREE, 0, -0.065, 0.17, 0, 0, 0, 0.085, 0.06, 0.05), color: def.muzzle });
    hp.push({ geo: S.sphereLo, matrix: mat(THREE, 0, -0.04, 0.215, 0, 0, 0, 0.024, 0.018, 0.014), color: def.nose });
  }
  const headGeo = mergeParts(THREE, hp); own.push(headGeo);
  head.add(new THREE.Mesh(headGeo, M({ vertexColors: true })));

  // 目（ふだん）・にっこり目
  const eyeGeo = mergeParts(THREE, [-1, 1].map((sx) => ({ geo: S.sphereLo, matrix: mat(THREE, sx * 0.075, 0.035, 0.19, 0, 0, 0, 0.022, 0.026, 0.014), color: 0x1d1d1d })));
  own.push(eyeGeo);
  const eyeMat = M({ vertexColors: true, roughness: 0.3 });
  const eyes = new THREE.Mesh(eyeGeo, eyeMat);
  head.add(eyes);
  const happyGeo = mergeParts(THREE, [-1, 1].map((sx) => ({ geo: S.arc, matrix: mat(THREE, sx * 0.075, 0.03, 0.198), color: 0x1d1d1d })));
  own.push(happyGeo);
  const happyEyes = new THREE.Mesh(happyGeo, eyeMat);
  happyEyes.visible = false;
  head.add(happyEyes);
  // 口
  const mouth = new THREE.Mesh(S.smile, M({ color: 0x3a2020 }));
  mouth.position.set(0, def.id === 'penguin' ? -0.11 : -0.088, 0.205);
  head.add(mouth);
  // ほっぺ
  const cheekGeo = mergeParts(THREE, [-1, 1].map((sx) => ({ geo: S.sphereLo, matrix: mat(THREE, sx * 0.13, -0.05, 0.165, 0, sx * 0.6, 0, 0.034, 0.022, 0.012) })));
  own.push(cheekGeo);
  const cheekMat = M({ color: 0xffb3c1, roughness: 0.9 });
  head.add(new THREE.Mesh(cheekGeo, cheekMat));

  // 腕（肩で回る）。先に手（paw）の目印
  const armMat = M({ color: def.arms !== undefined ? def.arms : def.body });
  const arms = [-1, 1].map((sx) => {
    const pivot = new THREE.Group();
    pivot.position.set(sx * D.shoulder[0], D.shoulder[1], D.shoulder[2]);
    pivot.add(new THREE.Mesh(S.arm, armMat));
    const paw = new THREE.Object3D();
    paw.position.set(0, -(D.armLen + D.armR * 1.2), 0);
    pivot.add(paw);
    bodyPivot.add(pivot);
    return { pivot, paw, sx, rx: 0, rz: sx * 0.25 };
  });

  // 当たり判定（見えない球）
  const proxy = new THREE.Mesh(S.proxy, new THREE.MeshBasicMaterial({ visible: false }));
  mats.push(proxy.material);
  proxy.scale.set(0.34, 0.5, 0.3);
  proxy.position.set(0, 1.12, 0);
  proxy.userData.shellTarget = 'customer';
  bodyPivot.add(proxy);

  // ---- ふるまい ----
  const st = {
    mode: 'idle', // 'enter' | 'idle' | 'leave' | 'gone'
    t: 0, walkT: 0, walkFrom: 0, walkTo: 0, walkDur: 1.3,
    hop: 0, hopAmp: 0, nod: 0, happy: 0, giggle: 0,
    reach: 0, reachTarget: 0, hold: 0, holdTarget: 0, wave: 0, waveTarget: 0,
    blink: 2 + Math.random() * 2, blinkT: 0,
    onArrive: null, onGone: null,
  };

  function placeAt(x) { root.position.x = x; }

  function enter(fromX, toX, dur, onArrive) {
    st.mode = 'enter'; st.walkT = 0; st.walkFrom = fromX; st.walkTo = toX; st.walkDur = dur; st.onArrive = onArrive;
    placeAt(fromX); root.visible = true;
  }
  function leave(toX, dur, onGone) {
    st.mode = 'leave'; st.walkT = 0; st.walkFrom = root.position.x; st.walkTo = toX; st.walkDur = dur; st.onGone = onGone;
  }
  function hop(amp = 0.04) { st.hop = 0; st.hopAmp = Math.max(st.hopAmp * 0.5, amp); }
  function nod() { st.nod = 1; }
  function giggle() { st.giggle = 0.7; hop(0.05); }
  function happy(seconds = 1.6) { st.happy = seconds; hop(0.09); }
  function setReach(on) { st.reachTarget = on ? 1 : 0; }
  function setHold(on) { st.holdTarget = on ? 1 : 0; }
  function setWave(on) { st.waveTarget = on ? 1 : 0; }

  const tmp = new THREE.Vector3();
  // 袋を持つ位置（両手の真ん中。右手を振っている間は左手へ寄せる）
  function handAnchor(out) {
    root.updateWorldMatrix(true, true);
    arms[0].paw.getWorldPosition(out);
    arms[1].paw.getWorldPosition(tmp);
    tmp.lerp(out, Math.min(1, st.wave));
    return out.add(tmp).multiplyScalar(0.5);
  }
  function headWorld(out) { return head.getWorldPosition(out); }

  const approach = (v, target, rate, dt) => v + (target - v) * (1 - Math.exp(-rate * dt));

  function update(dt) {
    if (st.mode === 'gone') return;
    st.t += dt;
    let walking = 0;
    if (st.mode === 'enter' || st.mode === 'leave') {
      st.walkT += dt;
      const u = Math.min(1, st.walkT / st.walkDur);
      const e = st.mode === 'enter' ? 1 - Math.pow(1 - u, 2) : u * u;
      placeAt(st.walkFrom + (st.walkTo - st.walkFrom) * e);
      walking = u < 1 ? 1 : 0;
      const dir = Math.sign(st.walkTo - st.walkFrom);
      root.rotation.y = approach(root.rotation.y, walking ? dir * 0.55 : 0, 8, dt);
      if (u >= 1) {
        if (st.mode === 'enter') { st.mode = 'idle'; const f = st.onArrive; st.onArrive = null; if (f) f(); }
        else { st.mode = 'gone'; root.visible = false; const f = st.onGone; st.onGone = null; if (f) f(); return; }
      }
    } else {
      root.rotation.y = approach(root.rotation.y, 0, 6, dt);
    }

    // 跳ねる・歩く上下
    st.hop += dt;
    const hopY = st.hopAmp * Math.max(0, Math.sin(Math.min(st.hop / 0.32, 1) * Math.PI)) + (st.happy > 0.8 ? 0.06 * Math.abs(Math.sin(st.t * 7)) : 0);
    if (st.hop > 0.32) st.hopAmp = 0;
    const walkY = walking ? 0.035 * Math.abs(Math.sin(st.t * 10)) : 0;
    bodyPivot.position.y = hopY + walkY;
    bodyPivot.rotation.z = walking ? 0.06 * Math.sin(st.t * 10) : 0.02 * Math.sin(st.t * 1.6);
    const breathe = 1 + 0.012 * Math.sin(st.t * 2.4);
    bodyPivot.scale.set(1, breathe, 1);

    // うなずき
    st.nod = Math.max(0, st.nod - dt * 3);
    head.rotation.x = 0.18 * Math.sin(st.nod * Math.PI) - 0.05 * st.reach;
    head.rotation.z = 0.05 * Math.sin(st.t * 1.1) + (st.happy > 0 ? 0.12 * Math.sin(st.t * 5) : 0);

    // 顔：にっこり（受け取った時・触られた時）
    st.happy = Math.max(0, st.happy - dt);
    st.giggle = Math.max(0, st.giggle - dt);
    const smiling = st.happy > 0 || st.giggle > 0;
    st.blink -= dt;
    if (st.blink < 0) { st.blinkT = 0.12; st.blink = 2.5 + Math.random() * 2.5; }
    st.blinkT = Math.max(0, st.blinkT - dt);
    eyes.visible = !smiling;
    happyEyes.visible = smiling;
    eyes.scale.y = st.blinkT > 0 ? 0.15 : 1;
    const ms = smiling ? 1.6 : 1;
    mouth.scale.setScalar(approach(mouth.scale.x, ms, 12, dt));
    cheekMat.color.setHex(smiling ? 0xff7d9a : 0xffb3c1);

    // 腕：ちょうだい（前へ）・持つ（前上へ）・手を振る
    st.reach = approach(st.reach, st.reachTarget, 6, dt);
    st.hold = approach(st.hold, st.holdTarget, 7, dt);
    st.wave = approach(st.wave, st.waveTarget, 6, dt);
    for (const a of arms) {
      let rx = 0, rz = a.sx * 0.25;
      // 歩くとき腕をふる
      rx += walking ? 0.35 * Math.sin(st.t * 10 + (a.sx > 0 ? Math.PI : 0)) : 0;
      // ちょうだい
      rx += st.reach * (-1.25 + 0.08 * Math.sin(st.t * 6));
      rz += st.reach * (-a.sx * 0.15);
      // 持つ（袋の持ち手を胸の前で持つ）
      rx = rx * (1 - st.hold) + st.hold * -2.0;
      rz = rz * (1 - st.hold) + st.hold * (-a.sx * 0.45);
      // 手を振る（右手だけ。持っている間は左手で持つ）
      if (a.sx > 0 && st.wave > 0.01) {
        rx = rx * (1 - st.wave) + st.wave * -0.3;
        rz = rz * (1 - st.wave) + st.wave * (2.5 + 0.35 * Math.sin(st.t * 12));
      }
      a.pivot.rotation.set(rx, 0, rz);
    }
  }

  function dispose() {
    for (const g of own) g.dispose();
    for (const m of mats) m.dispose();
  }

  return {
    def, root, proxy, update, dispose, enter, leave, hop, nod, giggle, happy, setReach, setHold, setWave, handAnchor, headWorld,
    get mode() { return st.mode; },
  };
}
