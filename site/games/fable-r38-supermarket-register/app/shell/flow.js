// 遊びの流れ：お客さんが来る → 商品をピッ → 袋がふくらむ → 渡す → 喜ぶ → 次のお客さん（終わりなし）。
// 時間は update(dt) だけで進める（コンテキスト喪失中は止まり、状態はそのまま）。
import { ANIMALS, createCustomer } from './customer.js';

const IDLE_HINT_S = 2.5;
const ENTER_X = -2.7;
const EXIT_X = 2.9;
const GIFT_KEY = 'r38.gifts.v1';

export function createFlow({ THREE, scene, camera, hero, env, audio, layout, rng }) {
  const stand = layout.customer.stand;
  const customers = new Map();
  let animalIndex = Math.floor(rng() * ANIMALS.length);
  let current = null;
  let phase = 'serve'; // 'serve' | 'giving' | 'happy' | 'swap'
  let lastOrderKey = '';
  let customersServed = 0;
  const carries = [];
  const timers = [];
  let time = 0;
  let firstHint = true;
  let lastTouchEnd = 0;
  let route = null; // 今の指が触っている物 { hero: target } | { shell: 'customer' } | null
  let pendingGive = false; // お客さんの入れ替え中に「渡す」をした → 次のお客さんが着いたら渡す（待たせても、無かったことにしない）

  // hero に毎フレーム渡す入力（使い回す）
  const heroInput = {
    time: 0,
    pointer: { phase: null, target: null, ray: new THREE.Ray(), point: new THREE.Vector3(), bagPoint: new THREE.Vector3(), tap: false },
    hint: { items: false, scanner: false, bag: false },
  };
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const planeItem = new THREE.Plane(new THREE.Vector3(0, 1, 0), -layout.dragPlaneY);
  const planeBag = new THREE.Plane(new THREE.Vector3(0, 1, 0), -layout.bagLiftY);
  const tmpV = new THREE.Vector3();
  const tmpV2 = new THREE.Vector3();

  const after = (s, fn) => timers.push({ t: time + s, fn });

  // ---- お客さん ----
  function getCustomer(def) {
    let c = customers.get(def.id);
    if (!c) {
      c = createCustomer(THREE, def);
      c.root.position.set(stand[0], stand[1], stand[2]);
      scene.add(c.root);
      customers.set(def.id, c);
    }
    c.root.visible = true;
    return c;
  }

  function nextOrder() {
    const kinds = hero.kinds.slice();
    for (let tries = 0; tries < 12; tries++) {
      const n = 3 + Math.floor(rng() * 3); // 3〜5個
      const pool = kinds.slice();
      const pick = [];
      while (pick.length < n && pool.length) pick.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
      const key = pick.slice().sort().join(',');
      if (key !== lastOrderKey) { lastOrderKey = key; return pick; }
    }
    return kinds.slice(0, 3);
  }

  function start() {
    const def = ANIMALS[animalIndex];
    current = getCustomer(def);
    current.root.position.x = stand[0];
    current.setWave(true);
    after(1.6, () => { if (current && current.def === def) current.setWave(false); });
    hero.setOrder(nextOrder());
    phase = 'serve';
  }

  // ---- 渡す ----
  function canGiveNow() {
    return phase === 'serve' && current && current.mode === 'idle' && hero.getState().bag > 0;
  }

  function give() {
    if (!canGiveNow()) return false;
    const carried = hero.detachBag();
    if (!carried) return false;
    scene.add(carried.object);
    const cust = current;
    cust.setReach(false);
    cust.setHold(true);
    audio.play('whoosh');
    const carry = {
      carried, cust, t: 0, T: 0.5, attached: false,
      from: carried.object.position.clone(), prev: carried.object.position.clone(), vel: new THREE.Vector3(),
    };
    carries.push(carry);
    phase = 'giving';
    carry.onArrive = () => {
      phase = 'happy';
      customersServed++;
      cust.happy(1.7);
      audio.play('chime');
      env.spawnHearts(cust.headWorld(tmpV).add(tmpV2.set(0, 0.2, 0.1)), 5);
      after(0.45, () => {
        const color = cust.def.flower;
        env.sendGift(cust.handAnchor(tmpV), color);
        audio.play('pop', 1.4);
        saveGifts([...env.giftColors, color]);
      });
      after(1.5, () => swapCustomer(cust, carry));
    };
    return true;
  }

  function swapCustomer(leavingCust, carry) {
    phase = 'swap';
    leavingCust.setWave(true);
    leavingCust.leave(EXIT_X, 1.6, () => {
      leavingCust.setWave(false);
      leavingCust.setHold(false);
      const i = carries.indexOf(carry);
      if (i >= 0) carries.splice(i, 1);
      scene.remove(carry.carried.object);
      carry.carried.dispose();
    });
    animalIndex = (animalIndex + 1) % ANIMALS.length;
    const def = ANIMALS[animalIndex];
    const next = getCustomer(def);
    current = next;
    next.setReach(false); next.setHold(false); next.setWave(false);
    next.enter(ENTER_X, stand[0], 1.5, () => {
      phase = 'serve';
      next.hop(0.05);
      if (pendingGive) { pendingGive = false; if (hero.getState().held === null) give(); }
    });
    // 待たせない：歩いている途中で商品をかごに出す。新しいお客さんの商品は、最初と同じくすぐ光って揺れる
    after(0.9, () => { hero.setOrder(nextOrder()); firstHint = true; });
  }

  // ---- 花の保存（端末に残す。失敗しても遊べる） ----
  function loadGifts() {
    try {
      const a = JSON.parse(localStorage.getItem(GIFT_KEY) || '[]');
      if (Array.isArray(a)) env.setGifts(a.filter((x) => typeof x === 'number').slice(-12));
    } catch (_) { /* 無視 */ }
  }
  function saveGifts(colors) {
    try { localStorage.setItem(GIFT_KEY, JSON.stringify(colors.slice(-12))); } catch (_) { /* 無視 */ }
  }

  // ---- 入力 ----
  function setRay(ev) {
    ndc.set((ev.x / ev.w) * 2 - 1, -(ev.y / ev.h) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const p = heroInput.pointer;
    p.ray.copy(raycaster.ray);
    if (raycaster.ray.intersectPlane(planeItem, tmpV)) p.point.copy(tmpV);
    if (raycaster.ray.intersectPlane(planeBag, tmpV)) p.bagPoint.copy(tmpV);
  }

  function pick(ev) {
    const targets = hero.getPickTargets().slice();
    if (current && current.root.visible) targets.push(current.proxy);
    const hits = raycaster.intersectObjects(targets, false);
    for (const h of hits) {
      const u = h.object.userData;
      if (u.heroTarget) return { hero: u.heroTarget };
      if (u.shellTarget) return { shell: u.shellTarget };
    }
    // 外れても、近くの hero の物（画面で 60px 以内）を選ぶ。指は太いので。
    let best = null, bestD = 60;
    for (const o of hero.getPickTargets()) {
      o.getWorldPosition(tmpV).project(camera);
      const sx = (tmpV.x + 1) / 2 * ev.w, sy = (1 - tmpV.y) / 2 * ev.h;
      const d = Math.hypot(sx - ev.x, sy - ev.y);
      if (d < bestD && tmpV.z < 1) { bestD = d; best = o; }
    }
    return best ? { hero: best.userData.heroTarget } : null;
  }

  function handlePointer(ev) {
    const p = heroInput.pointer;
    p.phase = null; p.tap = false;
    if (!ev) return;
    setRay(ev);
    if (ev.phase === 'down') {
      audio.unlock();
      firstHint = false;
      route = pick(ev);
      if (!route) return;
      if (route.hero && route.hero.kind === 'bag') pendingGive = false;
      if (route.shell === 'customer') {
        current.giggle();
        audio.play('giggle');
        route = null;
        return;
      }
      p.phase = 'down';
      p.target = route.hero;
      route.downY = ev.y;
      route.downX = ev.x;
      return;
    }
    if (ev.phase === 'up' || ev.phase === 'cancel') {
      audio.unlock();
      lastTouchEnd = time;
    }
    if (!route || !route.hero) { if (ev.phase !== 'move') route = null; return; }
    const target = route.hero;
    if (ev.phase === 'up' && target.kind === 'bag') {
      // 渡す：タップ、奥で離す、上（お客さんの方）へ動かす、またはどの向きでも大きく動かして離す。どれでもよい。
      // 持ち上げて元の場所の近くで離した時だけ、袋置き場に戻る（5歳児は「どこへ運ぶか」を考えなくてよい）
      const moved = Math.hypot(ev.x - route.downX, ev.y - route.downY);
      const wantGive = ev.tap || p.bagPoint.z < layout.giveZ || (route.downY - ev.y) > layout.giveDragPx || moved > layout.giveDragPx * 1.8;
      if (wantGive && canGiveNow()) {
        route = null;
        give();
        return; // hero には up を送らない（detachBag 済み）
      }
      // お客さんの入れ替え中：袋はいったん置き場へ戻り、次のお客さんが着いたら自動で渡す
      if (wantGive && phase !== 'serve' && hero.getState().bag > 0) pendingGive = true;
    }
    p.phase = ev.phase;
    p.target = target;
    p.tap = ev.tap;
    if (ev.phase !== 'move') route = null;
  }

  // ---- 合図（光る・ぴょこっと揺れる） ----
  function updateHints(st, fingerDown) {
    const h = heroInput.hint;
    const idle = fingerDown ? 0 : time - lastTouchEnd;
    const ready = phase === 'serve' && current && current.mode === 'idle';
    const waitingForBag = ready && st.bag > 0 && st.basket === 0 && st.transit === 0 && st.held === null;
    const nudge = firstHint || idle > IDLE_HINT_S;
    h.items = !fingerDown && st.basket > 0 && st.held === null && nudge;
    h.scanner = h.items;
    h.bag = !fingerDown && st.held === null && st.bag > 0 && (waitingForBag || (nudge && st.basket === 0));
    if (current) current.setReach(waitingForBag && !fingerDown);
  }

  // ---- 毎フレーム ----
  function update(dt, ev, fingerDown) {
    time += dt;
    heroInput.time = time;
    for (let i = timers.length - 1; i >= 0; i--) {
      if (timers[i].t <= time) { const f = timers[i].fn; timers.splice(i, 1); f(); }
    }
    handlePointer(ev);
    updateHints(hero.getState(), fingerDown);
    hero.update(dt, heroInput);

    for (const c of customers.values()) c.update(dt);

    // 持ち帰る袋：お客さんの手へ飛んで、そのあと手に付いていく
    for (let i = 0; i < carries.length; i++) {
      const k = carries[i];
      k.cust.handAnchor(tmpV);
      const obj = k.carried.object;
      if (!k.attached) {
        k.t += dt;
        const u = Math.min(1, k.t / k.T);
        const e = u * u * (3 - 2 * u);
        obj.position.lerpVectors(k.from, tmpV, e);
        obj.position.y += Math.sin(Math.PI * u) * 0.16;
        if (u >= 1) { k.attached = true; if (k.onArrive) k.onArrive(); }
      } else {
        obj.position.copy(tmpV);
      }
      if (dt > 0) k.vel.subVectors(obj.position, k.prev).divideScalar(dt);
      k.prev.copy(obj.position);
      k.carried.update(dt, { velocity: k.vel });
    }
    env.update(dt);
  }

  function onHeroEvent(type, data) {
    switch (type) {
      case 'appear': audio.play('pop', 1.1 + 0.1 * ((data && data.id) % 3)); break;
      case 'grab': audio.play('grab'); break;
      case 'scan': audio.play('beep'); if (current) current.hop(0.035); break;
      case 'scannerTap': audio.play('beepHigh'); break;
      case 'beltStart': audio.setMotor(true); break;
      case 'beltStop': audio.setMotor(false); break;
      case 'drop':
        audio.play('thump', data && data.weight !== undefined ? data.weight : 0.5);
        // 入るたびに少しずつ高い「ぽん」：袋がいっぱいになっていく感じ（hero-notes 6章4）
        audio.play('pop', 0.85 + 0.1 * Math.min(8, (data && data.count) || 1));
        if (current) current.nod();
        break;
      case 'return': audio.play('boing'); break;
      case 'bagLift': case 'bagPoke': audio.play('rustle'); break;
      case 'bagDown': audio.play('thump', 0.8); break;
      default: break;
    }
  }

  function cancelPointer() {
    if (route && route.hero) {
      heroInput.pointer.phase = 'cancel';
      heroInput.pointer.target = route.hero;
      heroInput.pointer.tap = false;
      route = null;
      hero.update(0, heroInput);
      heroInput.pointer.phase = null;
    }
  }

  loadGifts();

  return {
    start, update, onHeroEvent, cancelPointer,
    get phase() { return phase; },
    get customer() { return current; },
    get served() { return customersServed; },
    get carriedObjects() { return carries.map((k) => k.carried.object); },
    get hint() { return heroInput.hint; },
  };
}
