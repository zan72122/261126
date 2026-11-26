// お客さん：顔が単純でかわいい動物（点の目・ほっぺ・小さな笑い口）。球とカプセルだけで作る。
import * as THREE from 'three';
import { LAYOUT } from './config.js';
import { mergeGeometries } from '../vendor/three/addons/utils/BufferGeometryUtils.js';

const V3 = THREE.Vector3;
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

// 共有 geometry（全動物で1つずつ）
let GEO = null;
function geos() {
  if (GEO) return GEO;
  GEO = {
    body: new THREE.SphereGeometry(1, 24, 18), // 寄った構図でも輪郭がなめらかな分割
    mid: new THREE.SphereGeometry(1, 16, 12),
    small: new THREE.SphereGeometry(1, 10, 8),
    capsule: new THREE.CapsuleGeometry(1, 2.4, 5, 14),
    cone: new THREE.ConeGeometry(1, 1, 12),
    arc: new THREE.TorusGeometry(1, 0.26, 6, 14, Math.PI),
    cyl: new THREE.CylinderGeometry(1, 1, 1, 14),
  };
  return GEO;
}
const MATS = new Map();
function mat(hex, rough = 0.7) {
  const k = hex + ':' + rough;
  if (!MATS.has(k)) MATS.set(k, new THREE.MeshStandardMaterial({ color: hex, roughness: rough }));
  return MATS.get(k);
}

export const SPECIES = [
  { kind: 'bunny', body: 0xfff8fb, accent: 0xffc2d8 },
  { kind: 'bear', body: 0xd9a878, accent: 0xf3d2b0 },
  { kind: 'cat', body: 0xffc98f, accent: 0xfff1df },
  { kind: 'chick', body: 0xffe36b, accent: 0xffb347 },
  { kind: 'pig', body: 0xffc4d4, accent: 0xff98b6 },
];

function part(geo, material, sx, sy, sz, x, y, z) {
  const m = new THREE.Mesh(geo, material);
  m.scale.set(sx, sy ?? sx, sz ?? sx);
  m.position.set(x || 0, y || 0, z || 0);
  return m;
}

export function buildAnimal(spec) {
  const G = geos();
  const root = new THREE.Group();
  root.name = 'animal_' + spec.kind;
  const bodyM = mat(spec.body), accM = mat(spec.accent), black = mat(0x3a2a33, 0.4), white = mat(0xffffff, 0.3), cheekM = mat(0xff9ab8, 0.8), pinkIn = mat(0xffb6cf);
  const bob = new THREE.Group(); // 呼吸・ジャンプ用
  root.add(bob);
  // 体
  bob.add(part(G.body, bodyM, 0.15, 0.15, 0.13, 0, 0.13, 0));
  bob.add(part(G.mid, accM, 0.1, 0.11, 0.05, 0, 0.12, 0.095));
  bob.add(part(G.mid, bodyM, 0.05, 0.03, 0.06, -0.07, 0.01, 0.04));
  bob.add(part(G.mid, bodyM, 0.05, 0.03, 0.06, 0.07, 0.01, 0.04));
  // 頭
  const head = new THREE.Group();
  head.position.set(0, 0.36, 0.01);
  bob.add(head);
  head.add(part(G.body, bodyM, 0.15, 0.135, 0.13));
  // 目（点）と、うれしい目（^^）
  const eyes = new THREE.Group();
  const eL = part(G.small, black, 0.019, 0.022, 0.012, -0.055, 0.015, 0.118);
  const eR = part(G.small, black, 0.019, 0.022, 0.012, 0.055, 0.015, 0.118);
  eL.add(part(G.small, white, 0.3, 0.3, 0.3, 0.35, 0.4, 0.6));
  eR.add(part(G.small, white, 0.3, 0.3, 0.3, 0.35, 0.4, 0.6));
  eyes.add(eL, eR);
  const happy = new THREE.Group();
  const hL = part(G.arc, black, 0.02, 0.02, 0.02, -0.055, 0.008, 0.122);
  const hR = part(G.arc, black, 0.02, 0.02, 0.02, 0.055, 0.008, 0.122);
  happy.add(hL, hR);
  happy.visible = false;
  head.add(eyes, happy);
  // ほっぺ・口
  head.add(part(G.small, cheekM, 0.024, 0.016, 0.01, -0.088, -0.028, 0.105));
  head.add(part(G.small, cheekM, 0.024, 0.016, 0.01, 0.088, -0.028, 0.105));
  const mouth = part(G.arc, black, 0.014, 0.012, 0.014, 0, -0.03, 0.128);
  mouth.rotation.z = Math.PI;
  // 種ごと
  const ears = [];
  if (spec.kind === 'bunny') {
    for (const s of [-1, 1]) {
      const e = new THREE.Group(); e.position.set(s * 0.055, 0.1, -0.01); e.rotation.z = -s * 0.18;
      e.add(part(G.capsule, bodyM, 0.03, 0.05, 0.022, 0, 0.09, 0));
      e.add(part(G.capsule, pinkIn, 0.017, 0.04, 0.01, 0, 0.09, 0.016));
      head.add(e); ears.push(e);
    }
    head.add(mouth);
  } else if (spec.kind === 'bear') {
    for (const s of [-1, 1]) {
      const e = new THREE.Group(); e.position.set(s * 0.1, 0.1, 0);
      e.add(part(G.mid, bodyM, 0.045, 0.045, 0.03));
      e.add(part(G.mid, accM, 0.026, 0.026, 0.01, 0, 0, 0.022));
      head.add(e); ears.push(e);
    }
    head.add(part(G.mid, accM, 0.05, 0.036, 0.03, 0, -0.03, 0.105));
    head.add(part(G.small, black, 0.016, 0.011, 0.01, 0, -0.012, 0.135));
    mouth.position.set(0, -0.045, 0.133); head.add(mouth);
  } else if (spec.kind === 'cat') {
    for (const s of [-1, 1]) {
      const e = new THREE.Group(); e.position.set(s * 0.085, 0.11, 0); e.rotation.z = -s * 0.35;
      e.add(part(G.cone, bodyM, 0.045, 0.09, 0.03));
      e.add(part(G.cone, pinkIn, 0.025, 0.055, 0.01, 0, -0.008, 0.02));
      head.add(e); ears.push(e);
    }
    head.add(part(G.small, pinkIn, 0.012, 0.009, 0.008, 0, -0.012, 0.13));
    mouth.position.set(0, -0.032, 0.128); head.add(mouth);
  } else if (spec.kind === 'chick') {
    for (const s of [-1, 0, 1]) { const e = part(G.mid, bodyM, 0.022, 0.04, 0.02, s * 0.022, 0.135, 0); e.rotation.z = -s * 0.5; head.add(e); ears.push(e); }
    const beak = part(G.cone, accM, 0.022, 0.035, 0.016, 0, -0.02, 0.135); beak.rotation.x = Math.PI / 2; head.add(beak);
  } else if (spec.kind === 'pig') {
    for (const s of [-1, 1]) {
      const e = new THREE.Group(); e.position.set(s * 0.09, 0.105, 0.02); e.rotation.set(0.5, 0, -s * 0.5);
      e.add(part(G.cone, accM, 0.04, 0.06, 0.02));
      head.add(e); ears.push(e);
    }
    const snout = part(G.cyl, accM, 0.04, 0.02, 0.03, 0, -0.025, 0.125); snout.rotation.x = Math.PI / 2; head.add(snout);
    head.add(part(G.small, mat(0xd96a8c), 0.008, 0.012, 0.006, -0.014, -0.025, 0.137));
    head.add(part(G.small, mat(0xd96a8c), 0.008, 0.012, 0.006, 0.014, -0.025, 0.137));
  }
  // 手（ぽってり）：肩を支点に回す
  const arms = [];
  for (const s of [-1, 1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(s * 0.12, 0.2, 0.02);
    const paw = part(G.mid, bodyM, 0.045, 0.045, 0.04, s * 0.03, -0.06, 0.03);
    shoulder.add(paw);
    bob.add(shoulder);
    arms.push({ shoulder, paw, side: s });
  }
  // 持ち物を付ける所（両手の間）
  const hold = new THREE.Group();
  hold.position.set(0, 0.16, 0.12);
  bob.add(hold);
  // 動かない部品を頂点カラーで1つに結合（draw call を減らす）：体・頭・目・うれしい目・手 ≒ 6 回
  bake(head, new Set([eyes, happy]));
  bake(bob, new Set([head, hold, ...arms.map((a) => a.shoulder)]));
  bake(eyes, new Set());
  bake(happy, new Set());
  for (const a of arms) { bake(a.shoulder, new Set()); a.paw = a.shoulder.children[0]; }
  return { root, bob, head, eyes, happy, arms, ears, hold, spec };
}

let BAKED_MAT = null;
function bake(group, exclude) {
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const geos = [], victims = [];
  const m = new THREE.Matrix4();
  (function walk(o) {
    for (const c of o.children) {
      if (exclude.has(c)) continue;
      if (c.isMesh) {
        const g = new THREE.BufferGeometry();
        const src = c.geometry;
        g.setAttribute('position', src.attributes.position.clone());
        g.setAttribute('normal', src.attributes.normal.clone());
        g.setIndex(src.index.clone());
        m.multiplyMatrices(inv, c.matrixWorld);
        g.applyMatrix4(m);
        const col = c.material.color;
        const n = g.attributes.position.count, arr = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) { arr[i * 3] = col.r; arr[i * 3 + 1] = col.g; arr[i * 3 + 2] = col.b; }
        g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
        geos.push(g);
        victims.push(c);
      }
      if (!c.isMesh || c.children.length) walk(c);
    }
  })(group);
  if (!geos.length) return;
  const merged = mergeGeometries(geos, false);
  geos.forEach((g) => g.dispose());
  for (const v of victims) v.removeFromParent();
  // 空になった入れ子グループを片付ける
  (function prune(o) { for (const c of [...o.children]) { if (exclude.has(c)) continue; prune(c); if (!c.isMesh && c.children.length === 0 && c.type === 'Group') c.removeFromParent(); } })(group);
  if (!BAKED_MAT) BAKED_MAT = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.62 });
  const mesh = new THREE.Mesh(merged, BAKED_MAT);
  mesh.name = 'baked';
  group.add(mesh);
}

// ---------------- お客さんたちの管理 ----------------
export function createCustomers(scene, fx, audio, tex) {
  const list = []; // { a, state, t, pos, from, to, seat, gift, piece }
  const shadowMat = new THREE.MeshBasicMaterial({ map: tex.shadow, transparent: true, opacity: 0.35, depthWrite: false, color: 0x6a4050 });
  const shadowGeo = new THREE.PlaneGeometry(0.34, 0.24);
  let nextSpecies = 0;
  let current = null;
  const lookAt = new V3();
  const spot = new V3().fromArray(LAYOUT.customer);
  const enter = new V3().fromArray(LAYOUT.customerEnter);
  const B = LAYOUT.bench;

  function spawn() {
    const spec = SPECIES[nextSpecies % SPECIES.length];
    nextSpecies++;
    const a = buildAnimal(spec);
    const sh = new THREE.Mesh(shadowGeo, shadowMat);
    sh.rotation.x = -Math.PI / 2;
    sh.renderOrder = -1;
    scene.add(a.root, sh);
    const c = { a, sh, state: 'enter', t: 0, pos: enter.clone(), from: enter.clone(), to: spot.clone(), seat: -1, gift: null, piece: null, react: null, reactT: 0, blink: 2 + Math.random() * 2, wave: 0, reach: 0, hops: 3, dur: 1.0, seed: Math.random() * 10 };
    c.a.root.position.copy(c.pos);
    list.push(c);
    current = c;
    return c;
  }

  function seatPos(i) { return new V3(B.seats[i], B.y + 0.025, B.z + 0.02); }

  function hopTo(c, to, dur, hops, next) {
    c.from.copy(c.pos); c.to.copy(to); c.t = 0; c.dur = dur; c.hops = hops; c.state = 'hop'; c.next = next;
  }

  // 袋を受け取る
  function receive(bag, gift) {
    const c = current;
    if (!c || c.state !== 'wait') return false;
    c.state = 'receive'; c.t = 0; c.gift = gift; c.bag = bag;
    c.a.hold.attach(bag.group);
    bag.group.position.set(0, -0.06, 0.02);
    bag.group.rotation.set(0, 0, 0);
    current = null;
    audio.play('happy');
    return true;
  }

  function react(kind) {
    const c = current;
    if (!c || c.state !== 'wait') return;
    c.react = kind; c.reactT = 0;
  }

  function tapAnimal(c) {
    // 触ると「きゃっ」とぴょん（どのお客さんでも）
    c.react = 'giggle'; c.reactT = 0;
    audio.play('giggle', { rate: 0.9 + Math.random() * 0.3 });
  }

  function update(dt, t, focus, bagReady) {
    if (focus) lookAt.copy(focus);
    for (let i = list.length - 1; i >= 0; i--) {
      const c = list[i];
      const A = c.a;
      c.t += dt;
      let jump = 0, armL = 0.1, armR = 0.1, headTilt = 0, headUp = 0, happy = false;
      const breathe = 1 + Math.sin(t * 2.2 + c.seed) * 0.015;
      if (c.state === 'enter') { hopTo(c, spot, 1.0, 3, 'wait'); c.wave = 1.2; }
      if (c.state === 'hop') {
        const k = Math.min(1, c.t / c.dur);
        c.pos.lerpVectors(c.from, c.to, ease(k));
        jump = Math.abs(Math.sin(k * Math.PI * c.hops)) * 0.07;
        if (k >= 1) { c.state = c.next; c.t = 0; if (c.state === 'gone') { scene.remove(A.root, c.sh); A.root.traverse((o) => { if (o.name === 'baked') o.geometry.dispose(); }); list.splice(i, 1); if (c.gift) c.gift.dispose(); continue; } }
      }
      if (c.state === 'wait') {
        // 手をふる → 待つ（袋ができたら手を出す）
        if (c.wave > 0) { c.wave -= dt; armR = 2.4 + Math.sin(t * 12) * 0.4; }
        if (bagReady && c === current) { armL = armR = 1.1 + Math.sin(t * 6) * 0.25; jump = Math.abs(Math.sin(t * 5)) * 0.015; }
        // 反応
        if (c.react) {
          c.reactT += dt;
          const r = c.reactT;
          if (c.react === 'wow') { jump = Math.sin(Math.min(1, r / 0.35) * Math.PI) * 0.05; A.eyes.scale.setScalar(1 + 0.35 * Math.sin(Math.min(1, r / 0.6) * Math.PI)); }
          else if (c.react === 'clap') { const s = Math.abs(Math.sin(r * 14)); armL = armR = 1.2; A.arms[0].shoulder.rotation.y = 0.5 * s; A.arms[1].shoulder.rotation.y = -0.5 * s; happy = r < 0.8; }
          else if (c.react === 'tilt') { headTilt = Math.sin(Math.min(1, r / 0.8) * Math.PI) * 0.35; }
          else if (c.react === 'giggle') { jump = Math.abs(Math.sin(r * 9)) * 0.03 * (1 - r); happy = true; }
          if (r > 0.9) { c.react = null; A.eyes.scale.setScalar(1); A.arms[0].shoulder.rotation.y = 0; A.arms[1].shoulder.rotation.y = 0; }
        }
      }
      if (c.state === 'receive') {
        // 袋を窓の光にかざして見上げる → ^^ → ハート → ぴょんぴょん
        const r = c.t;
        const lift = ease(Math.min(1, r / 0.5));
        armL = armR = 1.2 + 1.5 * lift;
        // 頭の上・少し窓（左奥）の方へ持ち上げて見上げる
        A.hold.position.set(-0.07 * lift, 0.16 + 0.5 * lift, 0.12 - 0.08 * lift);
        headUp = -0.5 * lift; headTilt = 0.15 * lift;
        happy = r > 0.35;
        if (r > 0.9) jump = Math.abs(Math.sin((r - 0.9) * Math.PI * 2.2)) * 0.08 * (r < 1.8 ? 1 : 0);
        if (!c.heartsDone && r > 0.45) { c.heartsDone = true; const p = new V3(); A.hold.getWorldPosition(p); fx.burst(p, 'heart', 6); fx.burst(p, 'sparkle', 14); }
        if (!c.sound2 && r > 0.95) { c.sound2 = true; audio.play('giggle'); }
        if (r > 2.1) {
          // ベンチへ（いっぱいなら一番古い子が帰る）
          const seated = list.filter((o) => o.seat >= 0 && o.state !== 'gone' && o.state !== 'leave');
          let seat = [0, 1, 2, 3].find((s) => !seated.some((o) => o.seat === s));
          if (seat === undefined) {
            const oldest = seated[0];
            seat = oldest.seat; oldest.seat = -1;
            hopTo(oldest, new V3(-1.9, B.y + 0.03, B.z), 2.2, 7, 'gone');
          }
          c.seat = seat;
          // 袋はしまって、自分の模様のキャンディを1本手に持つ
          const pieces = c.gift ? c.gift.pieces : [];
          if (pieces.length) {
            c.piece = pieces[0];
            A.hold.attach(c.piece);
            c.piece.position.set(0.0, 0.07, 0.0);
            c.piece.rotation.set(0, 0, 0.2);
            c.piece.scale.setScalar(1.35);
          }
          if (c.bag) { c.bag.content.clear(); c.bag.group.removeFromParent(); c.bag.hide(); c.bag = null; }
          A.hold.position.set(0, 0.16, 0.12);
          hopTo(c, seatPos(seat), 1.5, 5, 'sit');
          spawnLater = 0.5;
        }
      }
      if (c.state === 'hop' && c.piece) { armL = armR = 1.3; }
      if (c.state === 'sit') {
        // キャンディを口へ（なめる）・ときどきにっこり
        const lick = Math.max(0, Math.sin(t * 1.3 + c.seed * 3));
        armL = armR = 1.3 + lick * 0.5;
        A.hold.position.set(0, 0.16 + lick * 0.1, 0.12 + lick * 0.01);
        happy = lick > 0.6;
        if (c.react) { c.reactT += dt; jump = Math.abs(Math.sin(c.reactT * 9)) * 0.03 * Math.max(0, 1 - c.reactT); if (c.reactT > 1) c.react = null; }
      }
      // まばたき
      c.blink -= dt;
      let eyeY = 1;
      if (c.blink < 0) { eyeY = 0.15; if (c.blink < -0.12) c.blink = 2.5 + Math.random() * 3; }
      A.eyes.visible = !happy; A.happy.visible = happy;
      if (!c.react || c.react !== 'wow') A.eyes.scale.set(1, eyeY, 1);
      // 姿勢
      A.root.position.copy(c.pos);
      A.bob.position.y = jump;
      A.bob.scale.set(1, breathe, 1);
      A.arms[0].shoulder.rotation.z = -armL; A.arms[1].shoulder.rotation.z = armR;
      // 頭は見る所へ少し向く（急に回さない）
      const dx = lookAt.x - c.pos.x, dz = lookAt.z - c.pos.z;
      const yaw = c.state === 'wait' ? Math.max(-0.6, Math.min(0.6, Math.atan2(dx, dz) * 0.5)) : 0;
      A.head.rotation.y += (yaw - A.head.rotation.y) * (1 - Math.exp(-dt / 0.3));
      A.head.rotation.z += (headTilt - A.head.rotation.z) * (1 - Math.exp(-dt / 0.1));
      A.head.rotation.x += (headUp - A.head.rotation.x) * (1 - Math.exp(-dt / 0.15));
      A.root.rotation.y = c.state === 'sit' ? 0 : c.state === 'hop' ? Math.atan2(c.to.x - c.from.x, c.to.z - c.from.z) * 0.25 : 0;
      c.sh.position.set(c.pos.x, c.pos.y + 0.004, c.pos.z + 0.02);
    }
    if (spawnLater > 0) { spawnLater -= dt; if (spawnLater <= 0) spawn(); }
  }
  let spawnLater = 0;

  spawn();
  // 最初のお客さんは最初から立っている（最初の1秒で見える）
  current.pos.copy(spot); current.state = 'wait'; current.wave = 1.5;

  return {
    list,
    get current() { return current; },
    receive, react, update, tapAnimal,
    // 当たり判定用
    targets() { return list.filter((c) => c.state !== 'gone').map((c) => ({ c, object: c.a.root })); },
    holdWorld(out) { return current ? current.a.hold.getWorldPosition(out) : out.set(LAYOUT.customer[0], 0.2, 0); },
  };
}
