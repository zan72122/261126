// 遊びの流れ：えらぶ → のばす・おる・ねじる（hero）→ できた → きる → つつむ → わたす → もう1回
// どの順でも先へ進める。失敗なし。止まったら次に触る物を光らせる。
import * as THREE from 'three';
import { LAYOUT, TIMING, PALETTE } from './config.js';
import { createBag } from './props.js';

const V3 = THREE.Vector3;
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

export function createFlow(ctx) {
  const { scene, hero, tray, scissors, customers, fx, audio, tex } = ctx;
  const F = {
    phase: 'make', round: 0, actions: 0, stretched: false, folded: false, twisted: false,
    gift: null, bag: null, bagState: 'none', bagT: 0, bagFrom: new V3(), bagTo: new V3(), bagHome: new V3().fromArray(LAYOUT.bag),
    pieceAnims: [], pendingLumps: 0, lastSnipAt: -1, time: 0, lastActionAt: 0, hintLevels: {}, roundStartAt: 0, gifts: 0,
  };
  const bags = []; // 袋は使い回し（最初に必要になったときに作る）
  const plane = new THREE.Plane(new V3(0, 1, 0), -0.12);
  const tmp = new V3(), tmp2 = new V3();
  const status = () => hero.getStatus();

  // ---------- hero からの通知 ----------
  function onHeroEvent(type, d) {
    if (type === 'sound') audio.play(d.name, d);
    else if (type === 'action') {
      F.actions++; F.lastActionAt = F.time;
      if (d.kind === 'stretch') { F.stretched = true; customers.react('wow'); }
      else if (d.kind === 'fold') {
        F.folded = true; customers.react('clap');
        fx.burst(status().points.ropeCenter, 'sparkle', 10);
        fx.burst(status().points.pullHandle, 'sparkle', 8, 0.6); // 戻した持ち手のところでも（hero-notes §7-4）
      }
      else if (d.kind === 'twist') { F.twisted = true; customers.react('tilt'); }
      else if (d.kind === 'merge') customers.react('wow');
    } else if (type === 'cut') {
      F.lastSnipAt = F.time;
      scissors.snipAt(d.point);
      fx.burst(d.point, 'sparkle', 8);
      customers.react('wow');
    } else if (type === 'ready') {
      wrap();
    }
  }

  // ---------- 1 えらぶ ----------
  function heroLumpCount() { return status().lumps + F.pendingLumps; }
  function canAddLump() { const s = status().stage; return (s === 'empty' || s === 'candy') && heroLumpCount() < 6; }
  function sendLump(L, instant = false) {
    if (L.state !== 'tray' && !instant) return;
    if (!canAddLump()) { tray.bounce(L); audio.play('hop', { rate: 1.3 }); return; } // 今は入れられない：その場でぴょん（「だめ」にしない）
    const drop = status().points.lumpDrop.clone();
    audio.play('hop', { rate: 0.9 + Math.random() * 0.2 });
    if (instant) {
      hero.addLump(L.colorIndex);
      tray.hop(L, drop, 0.22, () => fx.burst(drop, 'sparkle', 5));
      return;
    }
    F.pendingLumps++;
    L.pending = true;
    tray.hop(L, drop, 0.36, (l) => {
      if (!l.pending) return; // もう入れてある
      l.pending = false;
      F.pendingLumps--;
      if (hero.addLump(l.colorIndex)) fx.burst(status().points.lumpDrop, 'sparkle', 6);
      else { l.state = 'tray'; l.holder.visible = true; } // 入れられなかったらトレーへ戻る（失敗にしない）
    });
  }
  // 飛んでいる途中の塊はすぐ入れる（見た目の跳びはそのまま続く）
  function flushFlying() {
    for (const L of tray.lumps) if (L.pending) { L.pending = false; F.pendingLumps--; hero.addLump(L.colorIndex); }
  }
  // 飴を選ばずに機械やはさみを触った → 2本ひとりでに跳んでくる
  function ensureCandy() {
    if (status().lumps > 0) return;
    // 飛んでいる途中の塊はすぐ入れる
    flushFlying();
    if (status().lumps > 0) return;
    const av = tray.available();
    for (let i = 0; i < 2; i++) {
      const L = av[i] || tray.spawnExtra(Math.floor(Math.random() * PALETTE.length));
      if (!av[i]) L.state = 'tray';
      sendLump(L, true);
    }
  }

  // ---------- 5 できた → 6 きる ----------
  function finish() {
    if (F.phase !== 'make') return;
    const st = status().stage;
    if (st !== 'empty' && st !== 'candy') return;
    ensureCandy();
    flushFlying();
    if (!hero.beginFinish({ pieces: 3 })) return;
    F.phase = 'finish';
    scissors.hover(status().points.ropeCenter);
  }

  // ---------- 7 つつむ ----------
  function getBag() {
    let b = bags.find((x) => !x.group.visible && !x.group.parent?.isGroup);
    if (!b) { b = createBag(scene, tex); bags.push(b); }
    if (b.group.parent !== scene) scene.attach(b.group);
    return b;
  }
  function wrap() {
    const gift = hero.takeGift();
    if (!gift) return;
    F.gift = gift;
    F.phase = 'wrap';
    const bag = getBag();
    F.bag = bag;
    bag.show(F.bagHome, F.round);
    F.bagState = 'filling';
    audio.play('bag');
    scissors.rest();
    // ピースが1本ずつ袋へ跳ぶ
    const slots = [new V3(-0.028, 0.14, 0.0), new V3(0.03, 0.165, -0.012), new V3(0.002, 0.12, 0.022)];
    F.pieceAnims = gift.pieces.map((p, i) => {
      scene.attach(p);
      return { p, from: p.position.clone(), fromQ: p.quaternion.clone(), slot: slots[i % 3].clone().add(new V3(0, Math.floor(i / 3) * 0.02, 0)), t: 0, delay: 0.15 + i * 0.16, done: false, rotZ: (i - 1) * 0.25 };
    });
  }
  function updateWrap(dt) {
    if (F.bagState !== 'filling' && F.bagState !== 'drag') return;
    let all = true;
    for (const a of F.pieceAnims) {
      if (a.done) continue;
      all = false;
      if (a.delay > 0) { a.delay -= dt; continue; }
      a.t = Math.min(1, a.t + dt / 0.32);
      // ワールド上で袋の中の位置へ
      tmp.copy(a.slot);
      F.bag.content.localToWorld(tmp);
      const e = ease(a.t);
      a.p.position.lerpVectors(a.from, tmp, e);
      a.p.position.y += Math.sin(Math.PI * a.t) * 0.15;
      a.p.scale.setScalar(1 - 0.15 * e);
      if (a.t >= 1) {
        a.done = true;
        F.bag.content.attach(a.p);
        a.p.position.copy(a.slot);
        a.p.rotation.set(0, 0, a.rotZ);
        audio.play('pop', { rate: 1.1 + 0.1 * F.pieceAnims.indexOf(a) });
      }
    }
    if (all && !F.bag.tied) {
      F.bag.tie();
      audio.play('ribbon');
      tmp.copy(F.bag.group.position); tmp.y += 0.24;
      fx.burst(tmp, 'sparkle', 10);
      if (F.bagState === 'filling') F.bagState = 'ready';
      F.phase = 'give';
    }
  }
  function finishWrapNow() {
    for (const a of F.pieceAnims) if (!a.done) { a.delay = 0; a.t = 1; a.done = true; F.bag.content.attach(a.p); a.p.position.copy(a.slot); a.p.rotation.set(0, 0, a.rotZ); a.p.scale.setScalar(0.85); }
    if (!F.bag.tied) { F.bag.tie(); audio.play('ribbon'); }
    F.phase = 'give';
  }

  // ---------- 8 わたす ----------
  const bagGrab = new V3();
  function bagDown(point, ray) {
    if (!F.bag || (F.bagState !== 'ready' && F.bagState !== 'filling')) return;
    if (F.bagState === 'filling') finishWrapNow();
    F.bagState = 'drag';
    if (ray.intersectPlane(plane, tmp)) bagGrab.copy(F.bag.group.position).sub(tmp); else bagGrab.set(0, 0, 0);
    bagGrab.y = 0;
    audio.play('grab');
  }
  function bagDrag(ray) {
    if (F.bagState !== 'drag') return;
    if (ray.intersectPlane(plane, tmp)) {
      tmp.add(bagGrab);
      tmp.x = Math.min(1.5, Math.max(-0.9, tmp.x)); tmp.z = Math.min(0.5, Math.max(-0.5, tmp.z));
      F.bag.group.position.set(tmp.x, 0.06, tmp.z);
    }
  }
  function bagUp(ray, isTap) {
    if (F.bagState !== 'drag') return;
    const near = nearCustomer(F.bag.group.position);
    if (isTap || near) giveBag();
    else { F.bagState = 'return'; F.bagT = 0; F.bagFrom.copy(F.bag.group.position); F.bagTo.copy(F.bagHome); audio.play('boing'); }
  }
  function nearCustomer(p) {
    const c = customers.current;
    if (!c || c.state !== 'wait') return false;
    return p.x > LAYOUT.counter.x0 - 0.12 || p.distanceTo(c.pos) < 0.42;
  }
  function giveBag() {
    const c = customers.current;
    if (!F.bag || F.phase === 'make') return;
    if (F.bagState === 'filling') finishWrapNow();
    if (!c || c.state !== 'wait') { // まだお客さんが来ていない → 袋は元へ（失敗なし）
      F.bagState = 'return'; F.bagT = 0; F.bagFrom.copy(F.bag.group.position); F.bagTo.copy(F.bagHome);
      return;
    }
    F.bagState = 'fly'; F.bagT = 0; F.bagFrom.copy(F.bag.group.position);
    audio.play('whoosh', { rate: 1.4 });
  }
  function updateBag(dt) {
    const b = F.bag;
    if (!b) return;
    if (F.bagState === 'return') {
      F.bagT = Math.min(1, F.bagT + dt / 0.4);
      b.group.position.lerpVectors(F.bagFrom, F.bagTo, ease(F.bagT));
      b.group.position.y += Math.sin(Math.PI * F.bagT) * 0.08;
      if (F.bagT >= 1) F.bagState = 'ready';
    } else if (F.bagState === 'fly') {
      F.bagT = Math.min(1, F.bagT + dt / 0.45);
      customers.holdWorld(F.bagTo);
      b.group.position.lerpVectors(F.bagFrom, F.bagTo, ease(F.bagT));
      b.group.position.y += Math.sin(Math.PI * F.bagT) * 0.18 - 0.06 * ease(F.bagT);
      if (F.bagT >= 1) {
        if (customers.receive(b, F.gift)) {
          F.gifts++;
          F.gift = null; F.bag = null; F.bagState = 'none';
          nextRound();
        } else { F.bagState = 'return'; F.bagT = 0; F.bagFrom.copy(b.group.position); F.bagTo.copy(F.bagHome); }
      }
    }
  }

  // ---------- 9 もう1回 ----------
  function nextRound() {
    F.round++;
    F.actions = 0; F.stretched = F.folded = F.twisted = false;
    F.phase = 'make';
    F.roundStartAt = F.time;
    tray.slideOutRemaining();
    setTimeout(() => { tray.fill(false); audio.play('whoosh'); }, 280);
    scissors.rest();
  }

  // ---------- 当たり（input に渡す） ----------
  const shellTargets = {
    lumps: tray.lumps.map((L, i) => ({ kind: 'shell', id: 'lump' + i, object: L.proxy, radius: 0.08, onDown: () => sendLump(L) })),
    scissors: { kind: 'shell', id: 'scissors', object: scissors.proxy, radius: 0.1, onDown: () => { if (F.phase === 'make') finish(); else if (F.phase === 'finish') hero.cut(); } },
  };
  const bagTarget = { kind: 'shell', id: 'bag', object: null, radius: 0.13, onDown: bagDown, onDrag: bagDrag, onUp: bagUp };
  const animalTargets = new Map();
  function targets() {
    const out = [];
    tray.lumps.forEach((L, i) => {
      if (L.state === 'tray') { const t = shellTargets.lumps[i] || (shellTargets.lumps[i] = { kind: 'shell', id: 'lump' + i, object: L.proxy, radius: 0.08, onDown: () => sendLump(L) }); out.push(t); }
    });
    if (F.phase === 'make' || F.phase === 'finish') out.push(shellTargets.scissors);
    if (F.bag && (F.bagState === 'ready' || F.bagState === 'filling')) { bagTarget.object = F.bag.proxy; out.push(bagTarget); }
    for (const { c, object } of customers.targets()) {
      let t = animalTargets.get(c);
      if (!t) {
        t = { kind: 'shell', id: 'animal', object, radius: 0.16, onDown: () => { if (c === customers.current && F.bag && (F.bagState === 'ready' || F.bagState === 'filling')) giveBag(); else customers.tapAnimal(c); } };
        animalTargets.set(c, t);
      }
      out.push(t);
    }
    for (const h of hero.getHitTargets()) out.push({ kind: 'hero', id: h.id, object: h.object, radius: h.radius });
    return out;
  }
  function beforeHeroGrab(id) {
    if ((id === 'pull' || id === 'twist') && status().lumps === 0 && F.pendingLumps === 0) ensureCandy();
  }

  // ---------- ヒント（止まったら次に触る物が光る・揺れる） ----------
  const H = { lumps: 0, pull: 0, twist: 0, rope: 0, scissors: 0, bag: 0 };
  function updateHints(dt, idle) {
    const want = { lumps: 0, pull: 0, twist: 0, rope: 0, scissors: 0, bag: 0 };
    const strong = idle > TIMING.idleHint || F.time < 1.8;
    const lv = strong ? 1 : 0.35;
    const st = status();
    if (F.time < 1.8) { want.lumps = 1; want.pull = 1; }
    if (F.phase === 'make') {
      const n = heroLumpCount();
      if (n < 2 && tray.available().length) want.lumps = Math.max(want.lumps, lv);
      else if (!F.stretched) want.pull = Math.max(want.pull, lv);
      else if (!F.folded) want.pull = Math.max(want.pull, lv);
      else if (F.actions >= 3) {
        // はさみ と ねじる持ち手 を交互に
        const alt = Math.floor(F.time / 3) % 2;
        if (!F.twisted && alt) want.twist = lv; else want.scissors = lv;
      } else want.twist = lv;
      if (F.actions >= 1) want.scissors = Math.max(want.scissors, 0.2);
    } else if (F.phase === 'finish') {
      want.rope = lv; want.scissors = Math.max(0.3, lv * 0.6);
    } else if (F.phase === 'wrap' || F.phase === 'give') {
      want.bag = lv;
      // 袋を待つ間も次の飴を作り始めてよい（弱い光だけ）
    }
    const k = 1 - Math.exp(-dt / 0.25);
    for (const key in H) H[key] += (want[key] - H[key]) * k;
    tray.setHint(H.lumps);
    hero.setHint('pull', H.pull);
    hero.setHint('twist', H.twist);
    hero.setHint('rope', H.rope);
    scissors.setHint(H.scissors);
    if (F.bag) F.bag.setHint(H.bag);
  }

  function update(dt, t, idle) {
    F.time = t;
    updateWrap(dt);
    updateBag(dt);
    updateHints(dt, idle);
    const st = status();
    // 仕上げの間、はさみは棒の上についていく（「できた」の瞬間の飴の位置に残らない）。ちょきんの直後だけはその場に
    if (F.phase === 'finish' && (st.stage === 'rolling' || st.stage === 'cutting') && F.time - F.lastSnipAt > 0.45) scissors.hover(st.points.ropeCenter);
    audio.setStretch(st.stretch, st.stage === 'candy' ? st.stretchRate : 0);
    // お客さんが見る所
    const focus = F.bag && F.bagState !== 'none' ? F.bag.group.position : st.points.ropeCenter;
    return focus;
  }

  tray.fill(true);
  return {
    F, bags, update, targets, beforeHeroGrab, onHeroEvent,
    get bagReady() { return !!F.bag && (F.bagState === 'ready' || F.bagState === 'drag' || F.bagState === 'filling'); },
    finish, giveBag,
    prewarm() { if (!bags.length) bags.push(createBag(scene, tex)); },
  };
}
