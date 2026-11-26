// hero：商品がスキャナー → ベルト → 袋へ運ばれる一続きの動きと、袋の形の変化。
// API は docs/HERO-SPEC.md 3章のとおり（createHero）。時間は update(dt) だけで進める。物理エンジンは使わない。
//
// 連動の要点：
//   ・ベルトの送り量 s を1つだけ持ち、帯のテクスチャ・印・ローラーと、ベルト上の商品の x = x_乗った位置 + (s − s_乗った時) に同じ s を使う。
//   ・乗る前（スキャナーの上）で、前の商品との間隔 GAP が空くまで待つ。待つ順番は「ピッ」の順。
//   ・ベルト端 → 袋は2次ベジェ。出だしの速さをベルトの速さに合わせる。袋の中の置き場所は bag.js が「落として一番低い所」を選ぶ。
import { KINDS, createItemKit } from './items.js';
import { makeAtlas } from './atlas.js';
import { createMachine } from './machine.js';
import { createBagKit } from './bag.js';
import { createFx } from './fx.js';
import { clamp, smoothstep, lerp } from './geo.js';

const BELT_V = 0.7;        // ベルトの速さ (m/s)。仕様の 0.6 から少し速く（ピッ→袋 1.6秒以内のため）
const BELT_RAMP = 0.15;    // 0 → BELT_V になるまでの秒
const GAP = 0.03;          // ベルト上の商品の間隔 (m)
const SCAN_DWELL = 0.07;   // ピッのあと、ベルトへ跳ぶまでの最小の間
const BOARD_T = 0.16;      // スキャナーからベルトへ跳ぶ秒
const FALL_T = 0.42;       // ベルト端から袋に収まるまでの秒
const HOLD_SCALE = 1.16;
const HINT_HZ = 1.3;

const EXT_STAGE = {
  appear: 'basket', basket: 'basket', held: 'held', toScanner: 'toScanner', wait: 'toScanner',
  belt: 'belt', falling: 'falling', bag: 'bag', returning: 'returning', removing: 'removed',
};

export function createHero(THREE, opts) {
  const L = opts.layout;
  const emit = opts.onEvent || (() => {});
  const rnd = opts.random || Math.random;
  const detail = clamp((opts.tier && opts.tier.detail) || 1, 0.4, 1.5);

  const root = new THREE.Group();
  root.name = 'hero';

  const SC = new THREE.Vector3().fromArray(L.scanner.center);
  const BK = new THREE.Vector3().fromArray(L.basket.center);
  const BAG_BASE = new THREE.Vector3().fromArray(L.bag.base);
  const B = L.belt;
  const sw = L.scanner.size[0], sd = L.scanner.size[1];
  const BASKET_FLOOR = 0.013;
  const BASKET_RIM = L.basket.size[1];

  // ---------- 資源 ----------
  const atlas = makeAtlas(THREE);
  const texGro = opts.texture('assets/groceries.jpg');
  const texBag = opts.texture('assets/paper_bag.jpg', { wrap: 'repeat' });
  const kit = createItemKit(THREE, { detail, atlas });
  const machine = createMachine(THREE, { layout: L, texture: opts.texture, atlas, detail });
  const bagKit = createBagKit(THREE, { size: L.bag.size, detail, texPaper: texBag });
  const fx = createFx(THREE, { atlas, layout: L });
  root.add(machine.group, fx.group);

  // 光り方は「自分の色のまま明るくなる」（emissiveMap＝同じ画像）。黄色を足すと りんごが みかんに見えてしまうため
  const matGro = new THREE.MeshStandardMaterial({ map: texGro, vertexColors: true, roughness: 0.6, metalness: 0, emissive: 0xffffff, emissiveMap: texGro, emissiveIntensity: 0 });
  const matAtlas = new THREE.MeshStandardMaterial({ map: atlas.texture, vertexColors: true, roughness: 0.6, metalness: 0, emissive: 0xffffff, emissiveMap: atlas.texture, emissiveIntensity: 0 });
  const proxyGeo = new THREE.BoxGeometry(1, 1, 1);
  const proxyMat = new THREE.MeshBasicMaterial({ visible: false });

  const GRIP_H = bagKit.GRIP_H;
  const BAG_H = bagKit.H;
  const restGrip = new THREE.Vector3(BAG_BASE.x, BAG_BASE.y + GRIP_H, BAG_BASE.z);

  // ---------- 作業用（毎フレーム new しない） ----------
  const tA = new THREE.Vector3(), tC = new THREE.Vector3();
  const acc = new THREE.Vector3();
  const bez = (out, a, b, c, u) => {
    const v = 1 - u;
    return out.set(v * v * a.x + 2 * u * v * b.x + u * u * c.x, v * v * a.y + 2 * u * v * b.y + u * u * c.y, v * v * a.z + 2 * u * v * b.z + u * u * c.z);
  };
  const ease = (u) => u * u * (3 - 2 * u);

  // ---------- ベルト ----------
  let beltS = 0, beltV = 0, beltOn = false;

  // ---------- 袋 ----------
  let bag = bagKit.makeBag();
  bag.pivot.position.copy(restGrip);
  root.add(bag.pivot);
  const bagCtl = {            // 今の袋の持ち運び
    target: new THREE.Vector3(), from: new THREE.Vector3(), t: 0,
    prev: restGrip.clone(), vel: new THREE.Vector3(), prevVel: new THREE.Vector3(),
  };

  // ---------- 商品 ----------
  const items = [];           // かご・運搬中の商品（袋に収まった物は bag.items へ）
  const byId = new Map();
  const queue = [];           // ピッのあと、ベルトの空きを待つ順番
  let nextId = 1;

  function setStage(it, s) {
    it.stage = s;
    const ext = EXT_STAGE[s];
    if (ext !== it.ext) { it.ext = ext; emit('stage', { id: it.id, kind: it.kind, stage: ext }); }
  }

  function makeItem(kind, slot, yaw, delay) {
    const K = KINDS[kind];
    const obj = new THREE.Group();
    obj.name = 'item-' + kind;
    const mat = (K.map === 'gro' ? matGro : matAtlas).clone();
    mat.roughness = K.rough;
    const mesh = new THREE.Mesh(kit.geometry(kind), mat);
    const proxy = new THREE.Mesh(proxyGeo, proxyMat);
    proxy.scale.set(K.size[0] + 0.05, K.size[1] + 0.06, K.size[2] + 0.05);
    const it = {
      id: nextId++, kind, K, obj, mesh, mat, proxy, stage: 'appear', ext: null,
      slot: slot.clone(), yaw, t: -delay, T: 0.25,
      p0: new THREE.Vector3(), p1: new THREE.Vector3(), p2: new THREE.Vector3(),
      target: new THREE.Vector3(), prev: new THREE.Vector3(), vel: new THREE.Vector3(),
      scale: 1, sq: 0, sqV: 0, glow: 0, flashT: 1, phase: rnd() * 6.28,
      s0: 0, xb: 0, zb: 0, landed: false, wob: 0, roll: 0,
      bagRef: null, place: null, fa: 0.7, r0x: 0, r0y: 0, r0z: 0, spin: 0,
      qi: 0,
    };
    proxy.userData.heroTarget = { kind: 'item', id: it.id };
    obj.add(mesh, proxy);
    obj.position.copy(slot);
    obj.rotation.set(0, yaw, 0);
    obj.visible = delay <= 0;
    root.add(obj);
    items.push(it); byId.set(it.id, it);
    setStage(it, 'appear');
    return it;
  }

  function forget(it) {
    const i = items.indexOf(it);
    if (i >= 0) items.splice(i, 1);
    const q = queue.indexOf(it);
    if (q >= 0) queue.splice(q, 1);
    byId.delete(it.id);
  }
  function destroyItem(it) {
    forget(it);
    if (it.obj.parent) it.obj.parent.remove(it.obj);
    it.mat.dispose();
  }

  // かごの中の並べ方：幅の広い物から、手前・中・奥の3列に詰める（背の高い物は奥）
  const rowUsed = [0, 0, 0];
  const rowItems = [[], [], []];
  function layoutBasket(kinds) {
    const cap = L.basket.size[0] - 0.035;
    const pitch = Math.min(0.105, (L.basket.size[2] - 0.11) / 2);
    const rowZ = [pitch, 0, -pitch];
    for (let r = 0; r < 3; r++) { rowUsed[r] = 0; rowItems[r].length = 0; }
    const order = kinds.map((k, i) => i).sort((a, b) => KINDS[kinds[b]].size[0] - KINDS[kinds[a]].size[0]);
    for (const i of order) {
      const K = KINDS[kinds[i]];
      const pref = K.size[1] > 0.1 ? [2, 1, 0] : [0, 1, 2];
      let row = -1;
      for (const r of pref) { if (rowUsed[r] + K.size[0] + (rowItems[r].length ? 0.014 : 0) <= cap) { row = r; break; } }
      if (row < 0) { row = 0; for (let r = 1; r < 3; r++) if (rowUsed[r] < rowUsed[row]) row = r; }
      rowUsed[row] += K.size[0] + (rowItems[row].length ? 0.014 : 0);
      rowItems[row].push(i);
    }
    const out = new Array(kinds.length);
    for (let r = 0; r < 3; r++) {
      const n = rowItems[r].length;
      if (!n) continue;
      const spare = Math.max(0, cap - rowUsed[r]);
      const gap = 0.014 + Math.min(0.05, spare / (n + 1));
      let total = (n - 1) * gap;
      for (const i of rowItems[r]) total += KINDS[kinds[i]].size[0];
      let x = -total / 2;
      // 列の中の順番は毎回少し変える
      if (n > 1 && rnd() < 0.5) rowItems[r].reverse();
      for (const i of rowItems[r]) {
        const K = KINDS[kinds[i]];
        const yaw = K.shape === 'round' ? rnd() * 6.28 : (K.size[0] > 0.15 ? (rnd() - 0.5) * 0.14 : (rnd() - 0.5) * 0.7);
        out[i] = {
          pos: new THREE.Vector3(BK.x + x + K.size[0] / 2, BK.y + BASKET_FLOOR + K.size[1] / 2, BK.z + rowZ[r] + (rnd() - 0.5) * 0.012),
          yaw,
        };
        x += K.size[0] + gap;
      }
    }
    return out;
  }

  function inBasket(p) {
    const hw = L.basket.size[0] / 2 + 0.035, hd = L.basket.size[2] / 2 + 0.035;
    return Math.abs(p.x - BK.x) < hw && Math.abs(p.z - BK.z) < hd;
  }

  const holdY = (K) => Math.max(L.dragPlaneY, BASKET_RIM + 0.012 + K.size[1] * 0.5 * HOLD_SCALE);
  const scanY = (K) => machine.glassY + K.size[1] / 2 + 0.03;

  function startArc(it, stage, to, lift, T) {
    it.p0.copy(it.obj.position);
    it.p2.copy(to);
    it.p1.copy(it.p0).lerp(it.p2, 0.5);
    it.p1.y = Math.max(it.p0.y, it.p2.y) + lift;
    it.t = 0; it.T = T;
    setStage(it, stage);
  }
  function toScanner(it) {
    tA.set(SC.x, scanY(it.K), SC.z);
    const d = tA.distanceTo(it.obj.position);
    startArc(it, 'toScanner', tA, 0.03 + 0.14 * Math.min(1, d / 0.5), clamp(0.09 + d * 0.36, 0.09, 0.3));
  }
  function toBasket(it) {
    const d = it.slot.distanceTo(it.obj.position);
    startArc(it, 'returning', it.slot, 0.05 + 0.08 * Math.min(1, d / 0.4), clamp(0.12 + d * 0.3, 0.12, 0.32));
  }

  function scanned(it) {
    machine.flash(1);
    it.flashT = 0;
    it.sqV += 2.2;
    fx.burst(SC.x, machine.glassY + 0.05, SC.z, 7, rnd, { speed: 0.5, up: 0.75, size: 0.055, colors: [0xff7a66, 0xffd34d, 0xffffff] });
    it.t = 0;
    it.qi = queue.length;
    queue.push(it);
    setStage(it, 'wait');
    emit('scan', { id: it.id, kind: it.kind });
  }

  // ベルトの入り口が空いているか：前の商品のうしろが、自分の長さ＋GAP より先へ行っていること
  function entryFree(it) {
    const need = B.x0 + 0.012 + it.K.size[0] + GAP;
    for (let i = 0; i < items.length; i++) {
      const o = items[i];
      if (o.stage !== 'belt') continue;
      if (o.xb + (beltS - o.s0) - o.K.size[0] / 2 < need) return false;
    }
    return true;
  }

  function board(it) {
    queue.shift();
    it.xb = B.x0 + 0.012 + it.K.size[0] / 2;
    it.s0 = beltS;
    it.zb = it.K.size[0] > 0.15 ? 0 : (rnd() - 0.5) * 0.05;
    it.p0.copy(it.obj.position);
    it.t = 0; it.landed = false;
    setStage(it, 'belt');
  }

  function startFall(it) {
    it.bagRef = bag;
    it.place = bag.reserve(it.K, rnd);
    it.p0.copy(it.obj.position);
    it.r0x = it.obj.rotation.x; it.r0y = it.obj.rotation.y; it.r0z = it.obj.rotation.z;
    it.spin = it.K.roll ? -Math.PI * 2 : 0;
    it.t = 0; it.T = FALL_T;
    setStage(it, 'falling');
  }

  function landInBag(it) {
    const b = bag;
    forget(it);
    b.contents.add(it.obj);
    it.obj.position.set(it.place.x, it.place.y, it.place.z);
    it.obj.rotation.set(it.place.rx, it.place.ry, it.place.rz);
    it.obj.scale.setScalar(1);
    it.mat.emissiveIntensity = 0;
    b.items.push(it);
    b.land(it.place, it.obj);
    setStage(it, 'bag');
    b.body.updateWorldMatrix(true, false);
    tC.set(it.place.x * 0.5, BAG_H + 0.02, it.place.z * 0.5).applyMatrix4(b.body.matrixWorld);
    fx.burst(tC.x, tC.y, tC.z, 6, rnd, { speed: 0.42, up: 0.95, size: 0.045, colors: [0xffe9a8, 0xffffff, 0xffc36b], life: 0.5 });
    emit('drop', { id: it.id, kind: it.kind, count: b.count, weight: it.K.weight });
  }

  function updateItem(it, dt, time, hint) {
    const o = it.obj, K = it.K;
    let glow = 0;
    let rx = 0, ry = it.yaw, rz = 0;
    let keepRot = false;
    switch (it.stage) {
      case 'appear': {
        it.t += dt;
        if (it.t < 0) break;
        o.visible = true;
        const u = Math.min(1, it.t / 0.26);
        o.position.copy(it.slot);
        o.position.y += 0.30 * (1 - u * u);           // すとんと落ちる
        rz = (1 - u) * (K.size[0] > 0.15 ? 0.12 : 0.5) * Math.sin(it.phase);
        if (u >= 1) {
          it.sqV -= 3.2;                              // ぽこっ（つぶれて戻る）
          setStage(it, 'basket');
          emit('appear', { id: it.id, kind: it.kind });
        }
        break;
      }
      case 'basket': {
        o.position.copy(it.slot);
        if (hint.items) {
          // 合図：ぴょこぴょこ跳ねて、黄色く脈打つ（商品ごとに少しずらす）
          const w = Math.sin(time * Math.PI * 2 * HINT_HZ + it.phase);
          o.position.y += 0.03 * Math.abs(w);
          rz = 0.12 * Math.sin(time * Math.PI * 2 * HINT_HZ * 2 + it.phase);
          glow = 0.42 + 0.36 * w;
        }
        it.scale += (1 - it.scale) * Math.min(1, dt * 12);
        break;
      }
      case 'held': {
        tA.copy(it.target);
        tA.x = clamp(tA.x, -1.15, 1.2);
        tA.z = clamp(tA.z, -0.42, 0.44);
        const px = o.position.x;
        o.position.lerp(tA, 1 - Math.exp(-dt * 24));
        it.scale += (HOLD_SCALE - it.scale) * Math.min(1, dt * 16);
        if (dt > 0) {
          it.vel.subVectors(o.position, it.prev).divideScalar(dt);
          it.vel.clampLength(0, 4);
        }
        rz = clamp(-it.vel.x * 0.16, -0.4, 0.4);       // 動かす向きへ少し傾く
        rx = clamp(it.vel.z * 0.16, -0.4, 0.4);
        o.rotation.x += (rx - o.rotation.x) * Math.min(1, dt * 14);
        o.rotation.z += (rz - o.rotation.z) * Math.min(1, dt * 14);
        o.rotation.y = ry;
        keepRot = true;
        // スキャナーの上にかざしたら、その瞬間にピッ（離すのを待たない）
        const zx0 = SC.x - sw / 2 - 0.03, zx1 = SC.x + sw / 2 + 0.03;
        const inZ = o.position.z > SC.z - sd / 2 - 0.13 && o.position.z < SC.z + sd / 2 + 0.11;
        const inX = (o.position.x > zx0 && o.position.x < zx1) || (px < zx0 && o.position.x > zx1) || (px > zx1 && o.position.x < zx0);
        if (inZ && inX) toScanner(it);
        break;
      }
      case 'toScanner': case 'returning': {
        it.t += dt;
        const u = Math.min(1, it.t / it.T);
        bez(o.position, it.p0, it.p1, it.p2, ease(u));
        it.scale += (1.06 - it.scale) * Math.min(1, dt * 12);
        if (it.stage === 'toScanner') rz = -0.25 * Math.sin(Math.PI * u);
        if (u >= 1) {
          if (it.stage === 'toScanner') scanned(it);
          else { it.sqV -= 2.6; setStage(it, 'basket'); emit('return', { id: it.id, kind: it.kind }); }
        }
        break;
      }
      case 'wait': {
        it.t += dt;
        // 待つ順番ぶん、うしろ上へずれて浮く
        const qi = queue.indexOf(it);
        it.qi += (Math.max(0, qi) - it.qi) * Math.min(1, dt * 10);
        tA.set(SC.x - 0.03 * it.qi, scanY(K) + 0.055 * it.qi + 0.006 * Math.sin(time * 9 + it.phase), SC.z - 0.07 * it.qi);
        o.position.lerp(tA, 1 - Math.exp(-dt * 18));
        it.scale += (1.06 - it.scale) * Math.min(1, dt * 12);
        if (qi === 0 && it.t >= SCAN_DWELL && entryFree(it)) board(it);
        break;
      }
      case 'belt': {
        it.t += dt;
        const xv = it.xb + (beltS - it.s0);            // ベルトと同じ送り量 s で動く
        const yb = B.topY + K.size[1] / 2;
        const u = Math.min(1, it.t / BOARD_T);
        if (u < 1) {
          const e = ease(u);
          o.position.set(lerp(it.p0.x, xv, e), lerp(it.p0.y, yb, e) + 0.04 * Math.sin(Math.PI * u), lerp(it.p0.z, B.z + it.zb, e));
          rz = -0.3 * Math.sin(Math.PI * u);
        } else {
          if (!it.landed) { it.landed = true; it.sqV -= 2.4; it.wob = 1; }
          o.position.set(xv, yb, B.z + it.zb);
          it.wob *= Math.exp(-dt * 5);
          const w = it.wob * Math.sin(it.t * 26);
          if (K.roll) { it.roll -= it.wob * dt * 9; rz = it.roll; } else { rz = 0.10 * w; rx = 0.05 * it.wob * Math.cos(it.t * 21); }
          if (xv >= B.x1 - 0.004) startFall(it);
        }
        it.scale += (1 - it.scale) * Math.min(1, dt * 12);
        break;
      }
      case 'falling': {
        if (it.bagRef !== bag) {                        // 袋が渡された → 新しい袋へ（今の場所から落ち直す）
          it.bagRef = bag;
          it.place = bag.reserve(K, rnd);
          it.p0.copy(o.position);
          it.r0x = o.rotation.x; it.r0y = o.rotation.y; it.r0z = o.rotation.z; it.spin = 0;
          it.t = 0; it.T = 0.34;
        }
        const b = bag;
        b.body.updateWorldMatrix(true, false);
        it.p2.set(it.place.x, it.place.y, it.place.z).applyMatrix4(b.body.matrixWorld);
        tA.set(it.place.x * 0.35, BAG_H + 0.13, it.place.z * 0.5).applyMatrix4(b.body.matrixWorld);   // 口の上
        it.p1.copy(tA).lerp(it.p0, 0.2);
        it.p1.y = Math.max(it.p0.y, tA.y) + 0.045;
        it.t += dt;
        const u = Math.min(1, it.t / it.T);
        // 出だしの横の速さをベルトに合わせる：dx/dt(0) = 2(P1−P0)·a/T = v
        const dx = Math.max(0.05, it.p1.x - it.p0.x);
        const a = clamp(BELT_V * it.T / (2 * dx), 0.3, 1);
        bez(o.position, it.p0, it.p1, it.p2, a * u + (1 - a) * u * u);
        const e = ease(u);
        o.rotation.set(lerp(it.r0x, it.place.rx, e), lerp(it.r0y, it.place.ry, e), lerp(it.r0z, it.place.rz, e) + it.spin * e);   // 丸い物は1回転して転がり込む
        keepRot = true;
        it.scale += (1 - it.scale) * Math.min(1, dt * 12);
        if (u >= 1) { landInBag(it); return; }
        break;
      }
      case 'removing': {
        it.t += dt;
        it.scale = Math.max(0, 1 - it.t / 0.18);
        ry = it.yaw + it.t * 9;
        if (it.t >= 0.18) { destroyItem(it); return; }
        break;
      }
      default: break;
    }
    // つぶれ・のびのバネ
    const h = Math.min(dt, 0.03);
    it.sqV += (-340 * it.sq - 15 * it.sqV) * h;
    it.sq = clamp(it.sq + it.sqV * h, -0.35, 0.35);
    const s = Math.max(0.001, it.scale);
    o.scale.set(s * (1 - it.sq * 0.5), s * (1 + it.sq), s * (1 - it.sq * 0.5));
    if (!keepRot) o.rotation.set(rx, ry, rz);
    // 光：合図（黄色い脈動）とピッの赤い光
    it.flashT += dt;
    const fl = Math.exp(-it.flashT / 0.12);
    it.mat.emissiveIntensity = Math.max(0, glow) + 0.8 * fl;
    if (dt > 0) it.prev.copy(o.position);
    // 丸影
    if (o.visible && it.stage !== 'removing') fx.addShadow(o.position.x, o.position.y, o.position.z, K.size[0] * 0.52 * s, K.size[2] * 0.52 * s, K.size[1] * 0.5 * s);
  }

  // ---------- 入力 ----------
  function rayAtY(ray, y, fallback, out) {
    const dy = ray.direction.y;
    if (Math.abs(dy) < 1e-4) return out.copy(fallback);
    const t = (y - ray.origin.y) / dy;
    if (!(t > 0) || t > 50) return out.copy(fallback);
    return out.copy(ray.direction).multiplyScalar(t).add(ray.origin);
  }

  function onPointer(p) {
    const tg = p.target;
    if (!p.phase || !tg) return;
    if (tg.kind === 'item') {
      const it = byId.get(tg.id);
      if (!it) return;
      if (p.phase === 'down') {
        if (it.stage === 'basket' || it.stage === 'appear' || it.stage === 'returning') {
          it.obj.visible = true;
          rayAtY(p.ray, holdY(it.K), p.point, it.target);
          it.prev.copy(it.obj.position);
          it.vel.set(0, 0, 0);
          it.sqV += 3.0;                               // ぽっ（のびて戻る）
          setStage(it, 'held');
          emit('grab', { id: it.id, kind: it.kind });
        }
      } else if (it.stage === 'held') {
        if (p.phase === 'move') rayAtY(p.ray, holdY(it.K), p.point, it.target);
        else if (p.phase === 'up') { if (!p.tap && inBasket(p.point)) toBasket(it); else toScanner(it); }
        else if (p.phase === 'cancel') toBasket(it);
      }
    } else if (tg.kind === 'scanner') {
      if (p.phase === 'down') {
        machine.flash(0.85);
        fx.burst(SC.x, machine.glassY + 0.04, SC.z, 5, rnd, { speed: 0.4, up: 0.6, size: 0.045, colors: [0xff7a66, 0xffffff] });
        emit('scannerTap', {});
      }
    } else if (tg.kind === 'bag') {
      if (p.phase === 'down') {
        if (bag.count > 0 && bag.mode !== 'held') {
          bag.mode = 'held'; bag.liftTarget = 1;
          bagCtl.target.copy(p.bagPoint);
          emit('bagLift', { count: bag.count });
        } else if (bag.count === 0) {
          bag.kick(0.42, -0.5);                         // かさっ
          bag.handleTiltV += 5;
          emit('bagPoke', {});
        }
      } else if (bag.mode === 'held') {
        if (p.phase === 'move') bagCtl.target.copy(p.bagPoint);
        else { bag.mode = 'returning'; bagCtl.from.copy(bag.pivot.position); bagCtl.t = 0; }
      }
    }
  }

  // ---------- 袋の持ち運び ----------
  function updateBag(dt, time, hint) {
    const b = bag;
    const P = b.pivot.position;
    let swingOn = false;
    if (b.mode === 'held') {
      swingOn = true;
      tA.copy(bagCtl.target);
      tA.x = clamp(tA.x, -0.9, 1.2);
      tA.z = clamp(tA.z, -0.6, 0.36);
      const k = 1 - Math.exp(-dt * 15 / (1 + 0.22 * Math.min(8, b.count)));   // 中身が多いほど遅れる＝重そう
      P.y += (tA.y - P.y) * k;
      // 底が天板より上に出るまでは、横へは動かさない（台を突き抜けない）
      const clear = smoothstep(GRIP_H - 0.07, GRIP_H + 0.012, P.y);
      P.x += (tA.x - P.x) * k * clear;
      P.z += (tA.z - P.z) * k * clear;
    } else if (b.mode === 'returning') {
      swingOn = true;
      bagCtl.t += dt;
      const u = Math.min(1, bagCtl.t / 0.36);
      const eh = ease(Math.min(1, u / 0.55));
      const ev = Math.max(0, (u - 0.3) / 0.7);
      P.x = lerp(bagCtl.from.x, restGrip.x, eh);
      P.z = lerp(bagCtl.from.z, restGrip.z, eh);
      P.y = lerp(bagCtl.from.y, restGrip.y, ev * ev);
      if (u >= 1) {
        b.mode = 'rest'; b.liftTarget = 0;
        b.kick(0.34, 1.1);                              // どすん、少し弾む
        b.jostleV += 1.2;
        emit('bagDown', { count: b.count });
      }
    } else {
      P.copy(restGrip);
      if (hint.bag && b.count > 0) P.y += 0.016 * Math.abs(Math.sin(time * Math.PI * 2 * HINT_HZ));
    }
    if (dt > 0) {
      bagCtl.vel.subVectors(P, bagCtl.prev).divideScalar(dt);
      acc.subVectors(bagCtl.vel, bagCtl.prevVel).divideScalar(dt).clampLength(0, b.mode === 'returning' ? 8 : 22);
      bagCtl.prev.copy(P); bagCtl.prevVel.copy(bagCtl.vel);
    } else acc.set(0, 0, 0);
    // 商品が飛んで来る間は、口を大きく開けて待つ
    let incoming = 0;
    for (let i = 0; i < items.length; i++) if (items[i].stage === 'falling') incoming++;
    b.gapeTarget = incoming > 0 && b.mode !== 'carried' ? 1 : 0;
    b.update(dt, time, hint.bag && b.count > 0 ? 1 : 0, acc.x, acc.z, swingOn);
  }

  // ---------- API ----------
  const picks = [];
  const state = { basket: 0, transit: 0, bag: 0, held: null, busy: false, canGive: false };
  const noHint = { items: false, scanner: false, bag: false };

  function setOrder(kinds) {
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      if (it.stage === 'appear' || it.stage === 'basket' || it.stage === 'held' || it.stage === 'returning') {
        it.t = 0;
        setStage(it, 'removing');
        if (!it.obj.visible) destroyItem(it);
      }
    }
    const valid = (kinds || []).filter((k) => KINDS[k]).slice(0, 5);
    const slots = layoutBasket(valid);
    let delay = 0;
    return valid.map((k, i) => {
      const id = makeItem(k, slots[i].pos, slots[i].yaw, delay).id;
      delay += 0.10 + 0.05 * rnd();
      return id;
    });
  }

  function update(dt, input) {
    dt = dt > 0 ? Math.min(dt, 0.1) : 0;
    const time = input.time || 0;
    const hint = input.hint || noHint;
    onPointer(input.pointer || noHint);

    // ベルト：ピッが済んだ物・乗っている物がある間だけ動く。送り量 s を積む
    let carry = queue.length;
    for (let i = 0; i < items.length; i++) if (items[i].stage === 'belt') carry++;
    const vt = carry > 0 ? BELT_V : 0;
    const dv = (BELT_V / BELT_RAMP) * dt;
    beltV = vt > beltV ? Math.min(vt, beltV + dv) : Math.max(vt, beltV - dv);
    beltS += beltV * dt;
    if (!beltOn && vt > 0) { beltOn = true; emit('beltStart', {}); }
    else if (beltOn && vt === 0 && beltV === 0) { beltOn = false; emit('beltStop', {}); }
    machine.setBelt(beltS);

    fx.beginShadows();
    let near = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      updateItem(it, dt, time, hint);
      if (it.stage === 'held') {
        const d = Math.hypot(it.obj.position.x - SC.x, it.obj.position.z - SC.z);
        near = Math.max(near, 1 - smoothstep(0.12, 0.5, d));   // 近づくほどスキャナーが明るくなる（ここだよ）
      }
    }
    fx.endShadows();
    updateBag(dt, time, hint);
    machine.updateScanner(dt, time, !!hint.scanner, near);
    fx.updateSparks(dt);
  }

  function getPickTargets() {
    picks.length = 0;
    for (let i = 0; i < items.length; i++) {
      const s = items[i].stage;
      if (s === 'basket' || s === 'appear' || s === 'returning') picks.push(items[i].proxy);
    }
    if (bag.appear > 0.5) picks.push(bag.proxy);
    picks.push(machine.scanProxy);
    return picks;
  }

  function getState() {
    let basket = 0, transit = 0, held = null, busy = false;
    for (let i = 0; i < items.length; i++) {
      switch (items[i].stage) {
        case 'appear': case 'returning': basket++; busy = true; break;
        case 'basket': basket++; break;
        case 'held': basket++; held = 'item'; break;
        case 'toScanner': case 'wait': case 'belt': case 'falling': transit++; busy = true; break;
        default: break;
      }
    }
    if (bag.mode === 'held') held = 'bag';
    if (bag.mode === 'returning') busy = true;
    state.basket = basket; state.transit = transit; state.bag = bag.count;
    state.held = held; state.busy = busy || beltV > 0; state.canGive = bag.count > 0;
    return state;
  }

  function getAnchor(name, out) {
    if (name === 'scanner') return out.set(SC.x, machine.glassY, SC.z);
    if (name === 'beltEnd') return out.set(B.x1, B.topY, B.z);
    if (name === 'bagGrip') return out.copy(bag.pivot.position);
    return out.set(0, 0, 0);
  }

  function disposeBag(b) {
    for (const it of b.items) { it.mat.dispose(); byId.delete(it.id); }
    b.items.length = 0;
    b.disposeOwn();
    if (b.pivot.parent) b.pivot.parent.remove(b.pivot);
  }

  function freshBag(pop) {
    bag = bagKit.makeBag();
    bag.pivot.position.copy(restGrip);
    if (pop) { bag.appear = 0; bag.body.scale.setScalar(0.001); }
    root.add(bag.pivot);
    bagCtl.prev.copy(restGrip); bagCtl.vel.set(0, 0, 0); bagCtl.prevVel.set(0, 0, 0);
  }

  function detachBag() {
    if (bag.count === 0) return null;
    const old = bag;
    root.remove(old.pivot);
    old.mode = 'carried'; old.liftTarget = 1; old.gapeTarget = 0;
    for (const it of old.items) byId.delete(it.id);
    freshBag(true);                                    // すぐに新しい空の袋（ぽん）
    const prevVel = new THREE.Vector3();
    const a = new THREE.Vector3();
    let t = 0, gone = false;
    return {
      object: old.pivot,
      update(dt, motion) {
        if (gone || !(dt > 0)) return;
        t += dt;
        const v = motion && motion.velocity;
        if (v) { a.subVectors(v, prevVel).divideScalar(dt).clampLength(0, 30); prevVel.copy(v); } else a.set(0, 0, 0);
        old.update(dt, t, 0, a.x, a.z, true);
      },
      dispose() { if (gone) return; gone = true; disposeBag(old); },
    };
  }

  function reset() {
    for (let i = items.length - 1; i >= 0; i--) destroyItem(items[i]);
    queue.length = 0;
    disposeBag(bag);
    freshBag(false);
    beltV = 0; beltOn = false;
    fx.clear();
  }

  function restoreGPU() {
    atlas.restore();   // 手続きテクスチャを上げ直す（形と画像テクスチャは three が自動で上げ直す）
  }

  function dispose() {
    for (let i = items.length - 1; i >= 0; i--) destroyItem(items[i]);
    queue.length = 0;
    disposeBag(bag);
    bagKit.dispose(); kit.dispose(); machine.dispose(); fx.dispose(); atlas.dispose();
    matGro.dispose(); matAtlas.dispose(); proxyGeo.dispose(); proxyMat.dispose();
  }

  return {
    root, kinds: Object.keys(KINDS), setOrder, update, getPickTargets, getState, getAnchor, detachBag, reset, restoreGPU, dispose,
  };
}
