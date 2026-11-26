// 遊びの流れ：つくる → わたす → 喜ぶ → 並ぶ → 次。手順は守らせない。止まったら次に触れる物が光る・揺れる。
import { PAN, RACK } from './layout.js';
import { KINDS } from './customer.js';

export function createGame(THREE, { scene, world, hero, customers, audio, input }) {
  const sfx = audio.sfx;
  const heroInput = { t: 0, holding: false, target: null, taps: [], spin: PAN.spin, spinAngle: 0 };
  const g = {
    t: 0, kind: 0, current: null, leaving: [], flights: [], eaters: [], rack: [],
    newStickIn: -1, firstTouch: false, lastHintJar: 0, hintJarT: 0, gives: 0, lastGiveTry: -9,
    stats: { gives: 0, colors: 0, taps: 0, happy: 0, served: 0 },
  };
  const cam = { giveHold: 0 };                    // 渡した直後は、指で持っても少しの間は引いた構図のまま
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), q1 = new THREE.Quaternion(), qUp = new THREE.Quaternion();
  const BITE_DIR = new THREE.Vector3(0, 0, -1);   // 顔の向き（わたあめの奥側）。食べ終わったら、かじった側をこちらへ回して見せる
  const SHOW_BITE = Math.PI * 0.85;                // 喜ぶ時・棚に並ぶ時に、割り箸の軸まわりに回す角度

  function spawnCustomer() {
    const c = customers.create(g.kind++, sfx);
    scene.add(c.root);
    g.current = c;
    input.setTargets({ jars: world.jarHits, customer: c.hit, hero: hero.hitObjects });
  }
  spawnCustomer();

  // ---- hero のイベント → 音・お客さん
  function onHeroEvent(type, data) {
    if (type === 'wrap') sfx.fuwa(data.amount, hero.getState().stage);
    else if (type === 'stage') { sfx.stage(data.stage); if (g.current) g.current.surprise(); }
    else if (type === 'layer') sfx.sparkle();
    else if (type === 'pop') sfx.boing();
  }

  // ---- 入力の受け口
  const handlers = {
    onFirstTouch() { audio.unlock(); g.firstTouch = true; },
    onRelease() { audio.unlock(); },
    onJar(i) {
      world.pour(i); hero.setColor(i); sfx.pour(i); g.stats.colors++;
    },
    onCustomer() { tryGive(); },
    onGrab() { sfx.grab(); },
    onTap(p) { heroInput.taps.push(p); g.stats.taps++; },
    onGiveGesture() { tryGive(); },
  };

  function tryGive() {
    const s = hero.getState();
    const c = g.current;
    if (!s.hasStick) return;
    if (!c || !c.ready) return;               // お客さんが来る途中：少し待つ（持ったままでよい）
    if (s.stage < 1) {                         // 空っぽ：首をかしげてにこっ（失敗表現なし）
      if (g.t - g.lastGiveTry > 1.2) { c.puzzle(); g.lastGiveTry = g.t; }
      return;
    }
    const handle = hero.release();
    if (!handle) return;
    input.dropStick();
    scene.attach(handle.object);
    const big = Math.max(0, Math.min(3, s.stage)) - 1;  // 0..2
    c.receive(handle, big);
    c.setSmearColor(handle.outerColor);
    g.flights.push({ handle, c, t: 0, p0: handle.object.position.clone(), q0: handle.object.quaternion.clone(), big });
    g.current = null;                           // 次のお客さんの準備は、去り始めたとき
    sfx.whoosh();
    g.newStickIn = 0.6;
    g.stats.gives++;
    cam.giveHold = 2.4;
  }

  // ---- 棚
  function addToRack(handle) {
    const copy = handle.makeDisplayCopy();
    world.root.add(copy.object);
    copy.object.scale.setScalar(0.0001);
    g.rack.unshift({ ...copy, pop: 0 });
    while (g.rack.length > world.slotPos.length) {
      const old = g.rack.pop(); old.object.removeFromParent(); old.dispose();
    }
    g.rack.forEach((r, i) => { r.slot = i; });
    g.rack[0].object.position.copy(world.slotPos[0]);
    sfx.sparkle();
  }

  // ---- 毎フレーム
  // カメラの構図：作業中は寄る（work）、大きく育った（complete）・手を止めてお客さんが待つ（ready）は少し引く、
  // 渡す→食べる→喜ぶ→次のお客さんが来るまで（give）はゆっくり引く
  function cameraShot() {
    const ist = input.state, s = hero.getState();
    const giving = g.flights.length > 0 || g.eaters.some(e => e.phase === 'eat' || e.phase === 'happy') ||
      (g.eaters.length > 0 && !(g.current && g.current.ready));
    if (giving && (!ist.holding || cam.giveHold > 0)) return 'give';
    if (ist.holding) return s.stage >= 3 ? 'complete' : 'work';
    const idle = (performance.now() - ist.lastActivity) / 1000;
    if (s.hasStick && s.stage >= 1 && idle > 1.6) return 'ready';
    if (s.hasStick && s.stage >= 3) return 'complete';
    return 'work';
  }

  function update(dt) {
    g.t += dt;
    cam.giveHold = Math.max(0, cam.giveHold - dt);
    const ist = input.state;
    heroInput.t = g.t;
    heroInput.holding = ist.holding;
    heroInput.target = ist.holding ? ist.target : null;
    heroInput.spinAngle = (heroInput.spinAngle + PAN.spin * dt) % (Math.PI * 2);

    // ヒント
    const idle = (performance.now() - ist.lastActivity) / 1000;
    const s = hero.getState();
    let hl = 0;
    if (!ist.holding && s.hasStick) {
      if (!g.firstTouch) hl = 1;
      else if (s.stage < 1) hl = idle > 1.5 ? 1 : 0;
      else hl = idle > 2.5 ? 0.35 : 0;
    }
    hero.setHighlight(hl);
    // 指を止めたままお客さんの上にいても渡せる（お客さんが来るのを待っていた時など）
    if (ist.holding && ist.far && s.hasStick && s.stage >= 1 && g.current && g.current.ready) tryGive();
    if (g.current) {
      g.current.setExpect(s.hasStick && s.stage >= 1 ? 1 : 0);
      g.current.setHint(!ist.holding && s.stage >= 1 && idle > 2 ? 1 : 0);
    }
    if (!ist.holding && g.firstTouch && ((s.stage >= 1 && idle > 2.5) || idle > 6)) {
      g.hintJarT -= dt;
      if (g.hintJarT <= 0) {
        g.hintJarT = 3.2;
        const unused = world.jars.filter(j => !j.used && j.index !== world.selected);
        const pick = unused.length ? unused[0] : world.jars[(world.selected + 1 + (g.lastHintJar++ % 3)) % world.jars.length];
        world.wiggleJar(pick.index);
      }
    } else g.hintJarT = 0.8;

    // hero
    hero.update(dt, heroInput);
    heroInput.taps.length = 0;

    // 新しい割り箸
    if (g.newStickIn >= 0) {
      g.newStickIn -= dt;
      if (g.newStickIn < 0) hero.newStick();
    }

    // 渡す途中の飛行
    for (let i = g.flights.length - 1; i >= 0; i--) {
      const f = g.flights[i];
      f.t += dt;
      const k = Math.min(1, f.t / 0.8), e = k * k * (3 - 2 * k);
      f.c.gripWorld(v2);
      v1.lerpVectors(f.p0, v2, e); v1.y += Math.sin(Math.PI * k) * 0.28;
      f.handle.object.position.copy(v1);
      f.c.root.getWorldQuaternion(qUp);
      q1.copy(f.q0).slerp(qUp, Math.min(1, e * 1.25));
      f.handle.object.quaternion.copy(q1);
      if (k >= 1) {
        f.c.grip.attach(f.handle.object);
        f.handle.object.position.set(0, 0, 0); f.handle.object.quaternion.identity();
        g.flights.splice(i, 1);
        const eater = { handle: f.handle, c: f.c, t: 0, phase: 'eat', big: f.big };
        g.eaters.push(eater);
        f.c.startEat(() => { eater.phase = 'happy'; eater.t = 0; g.stats.happy++; });
      }
    }
    // 食べる → 喜ぶ → 去る（棚に並ぶ）→ 次のお客さん
    for (let i = g.eaters.length - 1; i >= 0; i--) {
      const e = g.eaters[i];
      e.t += dt;
      e.handle.update(dt);
      if (e.phase !== 'eat') {
        // 食べ終わったら、かじった跡（中の色の層）が見えるように、くるっと回して見せる
        const ry = e.handle.object.rotation.y;
        e.handle.object.rotation.y = ry + (SHOW_BITE - ry) * Math.min(1, dt * 5);
      }
      if (e.phase === 'eat') e.handle.setBite(Math.min(0.35, e.t / 1.6 * 0.35), BITE_DIR);
      else if (e.phase === 'happy' && e.t > 0.42 * (2 + e.big) + 0.5) {
        e.phase = 'leave';
        addToRack(e.handle);
        e.c.leave(() => { e.phase = 'gone'; });
        if (!g.current) spawnCustomer();
      } else if (e.phase === 'gone') {
        e.handle.object.removeFromParent(); e.handle.dispose(); e.c.dispose(); g.stats.served++;
        g.eaters.splice(i, 1);
      }
    }
    for (const f of g.flights) f.handle.update(dt);

    // お客さんたち
    if (g.current) g.current.update(dt, g.t);
    for (const e of g.eaters) if (e.c !== g.current) e.c.update(dt, g.t);
    for (const f of g.flights) if (f.c !== g.current) f.c.update(dt, g.t);

    // 棚：ぽんと出る、ずれる
    for (const r of g.rack) {
      r.pop = Math.min(1, r.pop + dt * 2.2);
      const k = r.pop;
      const over = k < 1 ? 1 + Math.sin(k * Math.PI) * 0.35 : 1;
      r.object.scale.setScalar(Math.max(0.0001, RACK.copyScale * Math.min(1, k * 1.4) * over));
      r.object.position.lerp(world.slotPos[r.slot], Math.min(1, dt * 6));
      r.object.rotation.y = SHOW_BITE + Math.sin(g.t * 0.8 + r.slot) * 0.15;   // かじった側をこちらへ
    }

    world.update(dt, g.t, heroInput.spinAngle);
  }

  return {
    handlers, onHeroEvent, update, cameraShot,
    get state() {
      const s = hero.getState();
      return {
        t: g.t, stage: s.stage, mass: s.mass, radius: s.radius, hasStick: s.hasStick, colorIndex: s.colorIndex,
        customer: g.current ? g.current.kind.id + ':' + g.current.mode : null,
        eaters: g.eaters.map(e => e.phase), flights: g.flights.length, rack: g.rack.length, ...g.stats,
      };
    },
    customerKinds: KINDS.map(k => k.id),
    dispose() {
      for (const r of g.rack) { r.object.removeFromParent(); r.dispose(); }
      for (const e of g.eaters) { e.handle.dispose(); e.c.dispose(); }
      for (const f of g.flights) { f.handle.dispose(); f.c.dispose(); }
      if (g.current) g.current.dispose();
    },
  };
}
