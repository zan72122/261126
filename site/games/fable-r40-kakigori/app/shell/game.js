// 遊びの流れと入力。場面：開店 → 氷を積む／機械を回す → シロップ → 飾り → 渡す → 次のお客さん（どの順でも）。
// 文字・数字・失敗・時間制限なし。止まったら次に触れる物が光る・揺れる。
import * as THREE from '../vendor/three.module.min.js';
import { LAYOUT, SYRUPS } from './world.js';
import { makeAnimal, ANIMAL_KINDS, VOICE } from './animals.js';
import { clamp, easeInOut, easeOutBack, hop, damp, disposeDeep } from './util.js';

const TAP_MS = 320, TAP_PX = 14, HINT_IDLE = 3.5, HINT_EVERY = 3.4, MAX_TOPPINGS = 18;

export function createGame({ scene, camera, renderer, world, createHero, tier, textures, audio, debug }) {
  const W = world;
  const canvas = renderer.domElement;

  // ---------- hero ----------
  let heroStage = 0;
  const hero = createHero(THREE, {
    tier, variant: 0,
    textures: { ice: textures.ice || null, syrup: null }, // syrup_colors は hero が使わないので読み込まない
    onEvent: (type, d) => onHeroEvent(type, d),
  });
  scene.add(hero.root); scene.add(hero.fx);
  const dims = hero.dims;
  const toppingsGroup = new THREE.Group(); toppingsGroup.name = 'toppings'; hero.root.add(toppingsGroup);
  const topInst = {};
  for (const k of W.toppingKinds) {
    const m = new THREE.InstancedMesh(W.toppingGeos[k], W.toppingMat, MAX_TOPPINGS); m.count = 0; m.frustumCulled = false;
    toppingsGroup.add(m); topInst[k] = m;
  }

  // ---------- 状態 ----------
  const S = {
    time: 0, state: 'enter', stateT: 0, round: 0, variant: 0, served: 0,
    bowlPos: LAYOUT.bowlEnter.clone(), bowlTarget: LAYOUT.bowlHome.clone(), bowlVel: new THREE.Vector3(), bowlHopT: 9,
    held: null, lastTouch: 0, lastHint: 0, glowT: 9, machineHopT: 9,
    wheelAngle: 0, wheelOmega: 0, clickAcc: 0, snowMade: 0,
    give: null, pouring: 0, giveGlowT: 9,
  };
  hero.root.position.copy(S.bowlPos);

  const input = { time: 0, held: false, bowlVel: { x: 0, z: 0 }, snow: { rate: 1, x: LAYOUT.spout.x, y: LAYOUT.spout.y, z: LAYOUT.spout.z }, pours: [], busy: false };
  const pourPool = [0, 1].map(() => ({ id: '', x: 0, y: 0, z: 0, color: [1, 1, 1], rate: 0, kind: 'syrup' }));

  const toppings = []; // { kind, lx, lz, ry, t }
  const flying = [];   // { kind, mesh, mode:'drag'|'hop'|'back', t, from, to(local), pointer }
  const shelf = [];    // { obj, slot, t, from }
  const flyingSnaps = [];
  const hearts = [];   // { p, v, t }

  // ---------- お客さん ----------
  let kindIdx = 0;
  const nextAnimal = () => { const k = ANIMAL_KINDS[kindIdx % ANIMAL_KINDS.length]; const a = makeAnimal(k, Math.floor(kindIdx / ANIMAL_KINDS.length)); kindIdx++; a.pick.userData.who = a; scene.add(a.group); return a; };
  let front = nextAnimal(); front.group.position.copy(LAYOUT.customerFront);
  let queue = [nextAnimal(), nextAnimal()];
  queue.forEach((a, i) => a.group.position.copy(LAYOUT.queue[i]));
  const leaving = [];

  // ---------- ヒーローのイベント → 音 ----------
  function onHeroEvent(type, d) {
    const sfx = audio.sfx;
    if (type === 'land') sfx.pop(1.2);
    else if (type === 'slide') sfx.slide();
    else if (type === 'spill') sfx.spill();
    else if (type === 'syrupHit') sfx.plop(1);
    else if (type === 'pool') sfx.drip();
    else if (type === 'stage') { if (d.stage > heroStage) sfx.sparkle(); heroStage = d.stage; }
  }

  // ---------- 入力 ----------
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
  const pointers = new Map();

  function setRay(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  }
  function hitPlane(y, out) { plane.constant = -y; return ray.ray.intersectPlane(plane, out); }

  function pickAt(e) {
    setRay(e);
    const targets = [...W.pick, front.pick, ...queue.map((a) => a.pick)];
    const hits = ray.intersectObjects(targets, false);
    if (hits.length) return hits[0].object.userData;
    if (S.state === 'free' && ray.intersectObjects(hero.pickables, true).length) return { kind: 'bowl' };
    // 器の周りは指に優しく：台の上で器の近くなら器
    if (S.state === 'free' && hitPlane(0.05, tmp) && Math.hypot(tmp.x - S.bowlPos.x, tmp.z - S.bowlPos.z) < dims.pickRadius + 0.03) return { kind: 'bowl' };
    return null;
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    audio.init();
    S.lastTouch = S.time;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* 古いブラウザ */ }
    const hit = pickAt(e);
    const p = { id: e.pointerId, kind: hit ? hit.kind : null, index: hit ? hit.index : -1, x0: e.clientX, y0: e.clientY, t0: performance.now(), moved: false, e, data: {} };
    pointers.set(e.pointerId, p);
    if (!hit) return;
    if (p.kind === 'bowl') {
      if (S.held) { p.kind = null; return; }
      S.held = p; hitPlane(dims.rimHeight, tmp);
      p.data.off = new THREE.Vector3(S.bowlPos.x - tmp.x, 0, S.bowlPos.z - tmp.z);
      audio.sfx.pop(0.9);
    } else if (p.kind === 'wheel') {
      p.data.ang = wheelScreenAngle(e); p.data.t = performance.now();
      S.wheelOmega = Math.max(S.wheelOmega, 4); audio.sfx.click(); // 触った瞬間に少し回る
    } else if (p.kind === 'bottle') {
      const b = W.bottles[p.index];
      if (b.pointer || b.state === 'auto') { p.kind = null; return; }
      b.pointer = p; audio.sfx.pop(1.4);
    } else if (p.kind === 'pile') {
      W.piles[p.index].hopT = 0; audio.sfx.pop(1.6);
    } else if (p.kind === 'customer') {
      const who = hit.who || front;
      if (who !== front) { who.poke(); audio.sfx.hello(VOICE[who.kind]); p.kind = null; return; } // 列の子はぴょんと返事だけ
      front.poke(); audio.sfx.hello(VOICE[front.kind]);
    }
  }, { passive: false });

  canvas.addEventListener('pointermove', (e) => {
    const p = pointers.get(e.pointerId); if (!p) return;
    e.preventDefault();
    p.e = e; S.lastTouch = S.time;
    if (!p.moved && Math.hypot(e.clientX - p.x0, e.clientY - p.y0) > TAP_PX) {
      p.moved = true;
      if (p.kind === 'bottle') { const b = W.bottles[p.index]; b.state = 'drag'; }
      if (p.kind === 'pile') startToppingDrag(p);
    }
    if (p.kind === 'wheel') {
      const a = wheelScreenAngle(e), now = performance.now();
      let da = a - p.data.ang; if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2;
      const dt = Math.max(0.008, (now - p.data.t) / 1000);
      const om = clamp(-da / dt, -30, 30);
      S.wheelOmega += (om - S.wheelOmega) * 0.5;
      if (p.moved && Math.abs(S.wheelOmega) < 5) S.wheelOmega += 0.6 * Math.sign(S.wheelOmega || 1); // こすっても回る
      p.data.ang = a; p.data.t = now;
    }
  }, { passive: false });

  function endPointer(e, cancelled) {
    if (!cancelled) audio.init(); // iOS は指を離した時の方が音を許すことがある
    const p = pointers.get(e.pointerId); if (!p) return;
    pointers.delete(e.pointerId);
    const tap = !cancelled && !p.moved && performance.now() - p.t0 < TAP_MS * 2;
    if (p.kind === 'bowl' && S.held === p) {
      S.held = null;
      if (S.state === 'free' && S.bowlPos.distanceTo(tmp.set(LAYOUT.give.x, 0, LAYOUT.give.z)) < LAYOUT.giveRadius) startGive();
      else if (tap) { S.bowlHopT = 0; audio.sfx.boing(1.1); }
    } else if (p.kind === 'wheel') {
      if (tap) { S.wheelOmega = Math.min(30, Math.abs(S.wheelOmega) + 11); audio.sfx.click(); }
    } else if (p.kind === 'bottle') {
      const b = W.bottles[p.index]; b.pointer = null;
      if (tap && b.state === 'home') startAutoPour(b);
      else if (b.state === 'drag') { b.state = 'return'; b.t = 0; b.from = b.group.position.clone(); }
    } else if (p.kind === 'pile') {
      const f = flying.find((q) => q.pointer === p);
      if (f) dropTopping(f);
      else if (tap) hopTopping(W.piles[p.index].kind, W.piles[p.index].group.position);
    } else if (p.kind === 'customer') {
      if (tap && S.state === 'free') startGive();
    }
  }
  canvas.addEventListener('pointerup', (e) => endPointer(e, false));
  canvas.addEventListener('pointercancel', (e) => endPointer(e, true));
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  const wheelCenter = new THREE.Vector3();
  function wheelScreenAngle(e) {
    W.wheel.getWorldPosition(wheelCenter); wheelCenter.project(camera);
    const r = canvas.getBoundingClientRect();
    const cx = (wheelCenter.x * 0.5 + 0.5) * r.width + r.left, cy = (-wheelCenter.y * 0.5 + 0.5) * r.height + r.top;
    return Math.atan2(-(e.clientY - cy), e.clientX - cx);
  }

  // ---------- 器の動ける範囲：作業域（機械の下）＋渡す通路 ----------
  const corA = new THREE.Vector2(LAYOUT.work.x0 + 0.02, LAYOUT.work.z0 + 0.03), corB = new THREE.Vector2(LAYOUT.give.x, LAYOUT.give.z);
  function clampBowl(x, z, out) {
    const rx = clamp(x, LAYOUT.work.x0, LAYOUT.work.x1), rz = clamp(z, LAYOUT.work.z0, LAYOUT.work.z1);
    const dR = Math.hypot(x - rx, z - rz);
    const ab = tmp2.set(corB.x - corA.x, 0, corB.y - corA.y), len2 = ab.x * ab.x + ab.z * ab.z;
    const u = clamp(((x - corA.x) * ab.x + (z - corA.y) * ab.z) / len2, 0, 1);
    let cx = corA.x + ab.x * u, cz = corA.y + ab.z * u;
    const d = Math.hypot(x - cx, z - cz), rad = 0.06;
    if (d > rad) { cx += ((x - cx) / d) * rad; cz += ((z - cz) / d) * rad; } else { cx = x; cz = z; }
    const dC = Math.hypot(x - cx, z - cz);
    if (dR <= dC) out.set(rx, 0, rz); else out.set(cx, 0, cz);
    return out;
  }

  // ---------- シロップ ----------
  const surf = { y: 0, nx: 0, ny: 1, nz: 0, inside: false };
  function surfaceWorldY(wx, wz) {
    const lx = wx - S.bowlPos.x, lz = wz - S.bowlPos.z;
    if (Math.hypot(lx, lz) > dims.rimRadius) return 0;
    hero.sampleSurface(lx, lz, surf); return surf.y + hero.root.position.y;
  }
  function highSpot(out) {
    // 山の高い所の近く（毎回少し違う所）
    let best = -1, bx = 0, bz = 0;
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * dims.rimRadius * 0.6;
      const x = Math.cos(a) * r, z = Math.sin(a) * r; hero.sampleSurface(x, z, surf);
      const sc = surf.y + Math.random() * 0.01; if (sc > best) { best = sc; bx = x; bz = z; }
    }
    return out.set(bx, 0, bz);
  }
  function startAutoPour(b) {
    if (S.state !== 'free') { b.hopT = 0; return; }
    b.state = 'auto'; b.t = 0; b.from = b.group.position.clone(); highSpot(b.target); b.spin = Math.random() * Math.PI * 2;
    audio.sfx.whoosh();
  }
  function updateBottles(dt) {
    let np = 0;
    for (const b of W.bottles) {
      b.hopT += dt;
      const g = b.group;
      let tiltTarget = 0, pos = tmp;
      if (b.state === 'drag' && b.pointer) {
        setRay(b.pointer.e);
        if (hitPlane(0.1, pos)) {
          const sy = surfaceWorldY(pos.x, pos.z);
          pos.y = Math.max(sy + 0.12, 0.2);
          g.position.lerp(pos, damp(22, dt));
        }
        const over = Math.hypot(g.position.x - S.bowlPos.x, g.position.z - S.bowlPos.z) < dims.rimRadius + 0.01 && S.state === 'free';
        tiltTarget = over ? 1 : 0.35;
      } else if (b.state === 'auto') {
        b.t += dt;
        const ang = b.spin + b.t * 2.6, rr = 0.022;
        const tx = S.bowlPos.x + b.target.x + Math.cos(ang) * rr, tz = S.bowlPos.z + b.target.z + Math.sin(ang) * rr;
        const ty = Math.max(surfaceWorldY(tx, tz) + 0.12, 0.2);
        if (b.t < 0.45) { const u = easeInOut(b.t / 0.45); pos.set(b.from.x + (tx - b.from.x) * u, b.from.y + (ty - b.from.y) * u + Math.sin(u * Math.PI) * 0.08, b.from.z + (tz - b.from.z) * u); g.position.copy(pos); tiltTarget = 0.5; }
        else if (b.t < 2.2 && S.state === 'free') { g.position.lerp(pos.set(tx, ty, tz), damp(10, dt)); tiltTarget = 1; }
        else { b.state = 'return'; b.t = 0; b.from = g.position.clone(); }
      } else if (b.state === 'return') {
        b.t += dt; const u = easeInOut(Math.min(1, b.t / 0.4));
        g.position.lerpVectors(b.from, b.home, u); g.position.y += Math.sin(u * Math.PI) * 0.05;
        if (u >= 1) { b.state = 'home'; audio.sfx.click(); }
      } else {
        g.position.copy(b.home); g.position.y += hop(b.hopT / 0.4) * 0.035;
        if (b.pointer && !b.pointer.moved) g.position.y += 0.01;
      }
      b.tilt += (tiltTarget - b.tilt) * damp(9, dt);
      g.rotation.set(0, 0, b.tilt * 2.25);
      b.rate = b.tilt > 0.8 ? (b.tilt - 0.8) / 0.2 : 0;
      b.mat.emissiveIntensity = 0.12 + Math.max(0, 1 - b.hopT / 0.8) * 0.5;
      if (b.rate > 0.02 && np < pourPool.length && !input.busy) {
        const p = pourPool[np++];
        p.id = b.syrup.id; p.x = g.position.x; p.y = g.position.y; p.z = g.position.z; p.color = b.syrup.color; p.rate = b.rate; p.kind = b.syrup.kind;
      }
    }
    input.pours.length = 0;
    for (let i = 0; i < np; i++) input.pours.push(pourPool[i]);
    return np;
  }

  // ---------- 飾り ----------
  const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _qy = new THREE.Quaternion(), _up = new THREE.Vector3(0, 1, 0), _n = new THREE.Vector3(), _sc = new THREE.Vector3();
  function newToppingMesh(kind) { const m = new THREE.Mesh(W.toppingGeos[kind], W.toppingMat); scene.add(m); return m; }
  function startToppingDrag(p) {
    const pile = W.piles[p.index];
    const f = { kind: pile.kind, mesh: newToppingMesh(pile.kind), mode: 'drag', t: 0, pointer: p, from: pile.group.position.clone(), to: new THREE.Vector3() };
    f.mesh.position.copy(pile.group.position); flying.push(f);
  }
  function hopTopping(kind, fromWorld) {
    const f = { kind, mesh: newToppingMesh(kind), mode: 'hop', t: 0, pointer: null, from: fromWorld.clone(), to: highSpot(new THREE.Vector3()) };
    f.to.x += (Math.random() - 0.5) * 0.03; f.to.z += (Math.random() - 0.5) * 0.03;
    f.mesh.position.copy(fromWorld); flying.push(f);
  }
  function dropTopping(f) {
    f.pointer = null;
    const lx = f.mesh.position.x - S.bowlPos.x, lz = f.mesh.position.z - S.bowlPos.z;
    if (Math.hypot(lx, lz) < dims.rimRadius * 0.92 && S.state === 'free') { f.mode = 'fall'; f.t = 0; f.to.set(lx, 0, lz); f.from = f.mesh.position.clone(); }
    else { f.mode = 'back'; f.t = 0; f.from = f.mesh.position.clone(); f.to.copy(W.piles[W.toppingKinds.indexOf(f.kind)].group.position); }
  }
  function attachTopping(kind, lx, lz) {
    if (toppings.length >= MAX_TOPPINGS) toppings.shift();
    toppings.push({ kind, lx, lz, ry: Math.random() * Math.PI * 2, t: 0 });
    audio.sfx.pop(1.3 + Math.random() * 0.3);
  }
  function updateToppings(dt) {
    for (let i = flying.length - 1; i >= 0; i--) {
      const f = flying[i]; f.t += dt; const m = f.mesh;
      if (f.mode === 'drag') {
        setRay(f.pointer.e);
        if (hitPlane(0.08, tmp)) { const sy = surfaceWorldY(tmp.x, tmp.z); tmp.y = Math.max(sy, 0.02) + 0.05; m.position.lerp(tmp, damp(25, dt)); }
      } else if (f.mode === 'hop' || f.mode === 'fall') {
        const dur = f.mode === 'hop' ? 0.55 : 0.22, u = Math.min(1, f.t / dur);
        const tx = S.bowlPos.x + f.to.x, tz = S.bowlPos.z + f.to.z, ty = surfaceWorldY(tx, tz);
        m.position.set(f.from.x + (tx - f.from.x) * u, f.from.y + (ty - f.from.y) * u + (f.mode === 'hop' ? Math.sin(u * Math.PI) * 0.12 : 0), f.from.z + (tz - f.from.z) * u);
        if (u >= 1) {
          if (S.state === 'free') attachTopping(f.kind, f.to.x, f.to.z);
          m.removeFromParent(); flying.splice(i, 1); continue;
        }
      } else if (f.mode === 'back') {
        const u = Math.min(1, f.t / 0.3); m.position.lerpVectors(f.from, f.to, easeInOut(u)); m.scale.setScalar(1 - u * 0.8);
        if (u >= 1) { m.removeFromParent(); flying.splice(i, 1); continue; }
      }
      m.rotation.y += dt * 3;
    }
    // 器の上の飾り：毎フレーム山の面に乗せる
    const counts = {}; for (const k of W.toppingKinds) counts[k] = 0;
    const m4 = _m4, q = _q, up = _up, n = _n, sc = _sc;
    for (const tp of toppings) {
      tp.t += dt;
      hero.sampleSurface(tp.lx, tp.lz, surf);
      n.set(surf.nx * 0.5, 1, surf.nz * 0.5).normalize();
      q.setFromUnitVectors(up, n); q.multiply(_qy.setFromAxisAngle(up, tp.ry));
      const s = tp.t < 0.25 ? 0.6 + easeOutBack(tp.t / 0.25) * 0.4 : 1;
      m4.compose(tmp.set(tp.lx, surf.y - 0.002 + hop(tp.t / 0.3) * 0.01, tp.lz), q, sc.set(s, s, s));
      const inst = topInst[tp.kind]; inst.setMatrixAt(counts[tp.kind]++, m4);
    }
    for (const k of W.toppingKinds) { topInst[k].count = counts[k]; topInst[k].instanceMatrix.needsUpdate = true; }
  }

  // ---------- 渡す ----------
  function startGive() {
    if (S.state !== 'free') return;
    S.state = 'give'; S.stateT = 0; S.held = null;
    S.give = { from: S.bowlPos.clone(), bitten: false, happy: false, snapped: false, entered: false, munch: 0 };
    for (const b of W.bottles) if (b.state === 'drag' || b.state === 'auto') { b.pointer = null; b.state = 'return'; b.t = 0; b.from = b.group.position.clone(); }
    for (const f of flying) if (f.mode === 'drag') dropTopping(f);
    audio.sfx.whoosh();
  }

  function updateGive(dt) {
    const G = S.give, t = S.stateT;
    const gp = tmp.set(LAYOUT.give.x, 0, LAYOUT.give.z);
    if (t < 0.6) S.bowlTarget.lerpVectors(G.from, gp, easeInOut(t / 0.6));
    else S.bowlTarget.copy(gp);
    S.bowlPos.copy(S.bowlTarget);
    // 食べるのは今のお客さんだけ（棚へ移した後に前へ来た次のお客さんを「食べる」にしない）
    if (t > 0.6 && !G.snapped && (front.mode === 'wait' || front.mode === 'wave')) front.setMode('eat');
    if (t > 0.78 && G.munch === 0) { G.munch = 1; audio.sfx.munch(); }
    if (t > 0.85 && !G.bitten) {
      G.bitten = true;
      const dx = front.group.position.x - S.bowlPos.x, dz = front.group.position.z - S.bowlPos.z, d = Math.hypot(dx, dz) || 1;
      hero.bite((dx / d) * 0.03, (dz / d) * 0.03, 0.032);
    }
    if (t > 1.3 && !G.happy) {
      G.happy = true; front.setMode('happy'); audio.sfx.happy(VOICE[front.kind]); audio.sfx.chime(); burstHearts(front);
    }
    if (t > 2.5 && !G.snapped) {
      G.snapped = true;
      const snap = hero.snapshot();
      for (const tp of toppings) { // 飾りも一緒に
        const m = new THREE.Mesh(W.toppingGeos[tp.kind], W.toppingMat);
        hero.sampleSurface(tp.lx, tp.lz, surf); m.position.set(tp.lx, surf.y - 0.002, tp.lz); m.rotation.y = tp.ry; snap.add(m);
      }
      snap.position.copy(S.bowlPos); scene.add(snap);
      toppings.length = 0;
      hero.root.visible = false;
      S.variant++; hero.reset({ variant: S.variant }); heroStage = 0; S.snowMade = 0;
      addToShelf(snap);
      // お客さんが帰り、列が進む
      front.setMode('leave'); front.walkTo(LAYOUT.exit, 1.8); leaving.push({ a: front, t: 0 });
      front = queue.shift(); front.walkTo(LAYOUT.customerFront, 1.3); front.setMode('wait');
      queue.forEach((a, i) => a.walkTo(LAYOUT.queue[i], 1.3));
      const n = nextAnimal(); n.group.position.set(LAYOUT.queue[1].x - 0.5, LAYOUT.queue[1].y, LAYOUT.queue[1].z - 0.2); n.walkTo(LAYOUT.queue[1], 1.6); queue.push(n);
    }
    if (t > 2.9 && !G.entered) {
      G.entered = true; hero.root.visible = true; S.bowlPos.copy(LAYOUT.bowlEnter); S.state = 'enter'; S.stateT = 0; S.served++;
      audio.sfx.whoosh();
    }
  }

  function updateEnter(dt) {
    void dt;
    const u = Math.min(1, S.stateT / 0.9);
    S.bowlPos.lerpVectors(LAYOUT.bowlEnter, LAYOUT.bowlHome, easeOutBack(u));
    if (u >= 1) {
      S.state = 'free'; S.stateT = 0; S.bowlTarget.copy(LAYOUT.bowlHome);
      S.bowlHopT = 0; S.machineHopT = 0.1; S.glowT = 0; S.lastHint = S.time;
      audio.sfx.boing(1); audio.sfx.hello(VOICE[front.kind]);
    }
  }

  function addToShelf(snap) {
    if (shelf.length >= LAYOUT.shelfSlots.length) {
      const old = shelf.shift(); old.obj.userData.dispose && old.obj.userData.dispose(); old.obj.removeFromParent();
      shelf.forEach((s, i) => { s.from = s.obj.position.clone(); s.slot = i; s.t = 0; s.fromScale = s.obj.scale.x; });
    }
    shelf.push({ obj: snap, slot: shelf.length, t: 0, from: snap.position.clone(), fromScale: 1 });
  }
  function updateShelf(dt) {
    for (const s of shelf) {
      if (s.t >= 1) continue;
      s.t = Math.min(1, s.t + dt / 0.9);
      const to = LAYOUT.shelfSlots[s.slot], u = easeInOut(s.t);
      s.obj.position.lerpVectors(s.from, to, u); s.obj.position.y += Math.sin(u * Math.PI) * 0.18;
      s.obj.scale.setScalar(s.fromScale + (LAYOUT.shelfScale - s.fromScale) * u);
    }
  }

  // ---------- ハート ----------
  function burstHearts(a) {
    for (let i = 0; i < 9; i++) {
      const p = a.group.position.clone(); p.y += 0.2; p.z += 0.05;
      hearts.push({ p, v: new THREE.Vector3((Math.random() - 0.5) * 0.35, 0.35 + Math.random() * 0.3, 0.1 + Math.random() * 0.1), t: -i * 0.06 });
    }
  }
  function updateHearts(dt) {
    const m4 = _m4, sc = _sc;
    let n = 0;
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i]; h.t += dt;
      if (h.t > 1.6) { hearts.splice(i, 1); continue; }
      if (h.t < 0) continue;
      h.p.addScaledVector(h.v, dt); h.v.y -= 0.12 * dt; h.v.x *= 0.98;
      const s = Math.min(1, h.t / 0.15) * (h.t > 1.2 ? Math.max(0, 1 - (h.t - 1.2) / 0.4) : 1) * (1 + Math.sin(h.t * 12) * 0.08);
      m4.compose(h.p, camera.quaternion, sc.set(s, s, s));
      if (n < 16) W.hearts.setMatrixAt(n++, m4);
    }
    W.hearts.count = n; W.hearts.instanceMatrix.needsUpdate = true;
  }

  // ---------- ヒント（止まったら次に触れる物が光る・揺れる） ----------
  function updateHints() {
    if (S.state !== 'free') return;
    if (S.time - S.lastTouch < HINT_IDLE || S.time - S.lastHint < HINT_EVERY) return;
    S.lastHint = S.time;
    const st = hero.getStats();
    if (st.volume < 0.3) { S.bowlHopT = 0; S.glowT = 0; S.wheelOmega += 6; audio.sfx.boing(1); }
    else if (st.coverage < 0.1) { W.bottles.forEach((b, i) => { b.hopT = -i * 0.15; }); audio.sfx.pop(1.5); }
    else { S.giveGlowT = 0; front.poke(); front.setMode('wave'); setTimeout(() => front.mode === 'wave' && front.setMode('wait'), 1500); W.piles.forEach((p, i) => { p.hopT = -0.3 - i * 0.12; }); audio.sfx.hello(VOICE[front.kind]); }
  }

  // ---------- 疑似影 ----------
  const blobM = new THREE.Matrix4(), blobQ = new THREE.Quaternion(), blobS = new THREE.Vector3(), blobP = new THREE.Vector3();
  function blob(i, x, z, s) { blobM.compose(blobP.set(x, 0.0012, z), blobQ, blobS.set(s, 1, s)); W.blobs.setMatrixAt(i, blobM); }
  function updateBlobs() {
    let i = 0;
    if (hero.root.visible) blob(i++, S.bowlPos.x, S.bowlPos.z, dims.rimRadius * 2.5 * (1 - (hero.root.position.y) * 6));
    blob(i++, LAYOUT.column.x, LAYOUT.column.z, 0.22);
    blob(i++, LAYOUT.tray.x, LAYOUT.tray.z, 0.21);
    for (const b of W.bottles) { const lift = Math.max(0, b.group.position.y - b.home.y); blob(i++, b.group.position.x, b.group.position.z, Math.max(0.02, 0.075 - lift * 0.25)); }
    W.blobs.count = i; W.blobs.instanceMatrix.needsUpdate = true;
  }

  // ---------- 毎フレーム ----------
  const prevBowl = S.bowlPos.clone();
  function update(dt) {
    S.time += dt; S.stateT += dt;

    // 器
    if (S.state === 'free') {
      if (S.held) {
        setRay(S.held.e);
        if (hitPlane(dims.rimHeight, tmp)) { clampBowl(tmp.x + S.held.data.off.x, tmp.z + S.held.data.off.z, S.bowlTarget); }
      }
      S.bowlPos.lerp(S.bowlTarget, damp(16, dt));
    } else if (S.state === 'give') updateGive(dt);
    else if (S.state === 'enter') updateEnter(dt);
    S.bowlVel.set((S.bowlPos.x - prevBowl.x) / dt, 0, (S.bowlPos.z - prevBowl.z) / dt);
    prevBowl.copy(S.bowlPos);
    S.bowlHopT += dt;
    hero.root.position.set(S.bowlPos.x, hop(S.bowlHopT / 0.45) * 0.03, S.bowlPos.z);

    // 機械
    S.machineHopT += dt;
    W.machine.position.y = hop(S.machineHopT / 0.5) * 0.025;
    S.wheelOmega *= Math.exp(-1.3 * dt);
    S.wheelAngle -= S.wheelOmega * dt;
    W.wheel.rotation.z = S.wheelAngle;
    S.clickAcc += Math.abs(S.wheelOmega) * dt;
    if (S.clickAcc > (Math.PI * 2) / 10) { S.clickAcc = 0; audio.sfx.click(); }
    const snowOn = S.state === 'free';
    // かけている間は氷を弱める（かけた色が降る氷で白く埋もれない）。車輪を回せばいつでも増える
    const wheelBoost = Math.min(2, Math.abs(S.wheelOmega) / 6);
    const rate = snowOn ? (S.pouring > 0 ? 0.3 : 1) + wheelBoost : 0;
    S.snowMade += rate * dt;
    W.iceBlock.scale.y = Math.max(0.35, 1 - S.snowMade / 160);
    W.iceBlock.position.y = LAYOUT.spout.y + 0.12 + W.iceBlock.scale.y * 0.035;

    // hero へ
    input.time = S.time; input.held = !!S.held; input.busy = S.state !== 'free';
    input.bowlVel.x = S.bowlVel.x; input.bowlVel.z = S.bowlVel.z;
    if (rate > 0) { input.snow = input.snow || { x: 0, y: 0, z: 0, rate: 0 }; input.snow.rate = rate; input.snow.x = LAYOUT.spout.x; input.snow.y = LAYOUT.spout.y + W.machine.position.y; input.snow.z = LAYOUT.spout.z; }
    const snowObj = input.snow; if (rate <= 0) input.snow = null;
    const pouring = updateBottles(dt);
    S.pouring = pouring > 0 ? 0.6 : Math.max(0, S.pouring - dt); // 次のフレームの氷の量に使う（離してすぐ戻らないよう少し待つ）
    hero.root.updateMatrixWorld();
    hero.update(dt, input);
    if (!input.snow) input.snow = snowObj;

    updateToppings(dt);
    for (const p of W.piles) { p.hopT += dt; p.group.position.y = 0.008 + hop(p.hopT / 0.4) * 0.03; }

    // お客さん
    const dGive = Math.hypot(S.bowlPos.x - LAYOUT.give.x, S.bowlPos.z - LAYOUT.give.z);
    const eager = S.state === 'free' ? clamp(1 - (dGive - 0.05) / 0.3, 0, 1) : S.state === 'give' && S.stateT < 0.6 ? 1 : 0;
    front.update(dt, { lookX: S.bowlPos.x, eager });
    for (const a of queue) a.update(dt, { lookX: S.bowlPos.x, eager: 0 });
    for (let i = leaving.length - 1; i >= 0; i--) {
      const l = leaving[i]; l.t += dt; l.a.update(dt, { lookX: -2, eager: 0 });
      if (l.t > 1.9) { l.a.dispose(); leaving.splice(i, 1); }
    }

    updateShelf(dt); updateHearts(dt); updateHints(); updateBlobs();

    // 光の輪
    S.glowT += dt;
    const gl = S.glowT < 1.6 ? Math.sin((S.glowT / 1.6) * Math.PI) : 0;
    W.glow.material.opacity = gl * 0.85; W.glow.visible = gl > 0.01;
    W.glow.position.set(S.bowlPos.x, 0.003, S.bowlPos.z); W.glow.scale.setScalar(dims.rimRadius * 3.2 + gl * 0.06);
    // 渡す所の光：ヒントの時に2回ふわっと（器を持って近づくと、その間ずっと光る）
    S.giveGlowT += dt;
    const near = S.state === 'free' && S.held ? clamp(1 - (dGive - LAYOUT.giveRadius) / 0.25, 0, 1) : 0;
    const gg = Math.max(S.giveGlowT < 2.4 ? Math.sin((S.giveGlowT / 1.2) * Math.PI) ** 2 : 0, near * (0.55 + 0.25 * Math.sin(S.time * 6)));
    W.giveGlow.material.opacity = gg; W.giveGlow.visible = gg > 0.01 && S.state === 'free'; W.giveGlow.scale.setScalar(0.36 + gg * 0.05);

    // 音
    const lv = hero.levels;
    audio.setLevels(rate > 0 ? 0.25 + 0.25 * (rate - 1) + lv.land * 0.5 : 0, Math.max(lv.slide, lv.spill * 0.8), Math.max(lv.flow, pouring ? 0.5 : 0));
  }

  // 開店の合図
  S.state = 'enter'; S.stateT = 0.5;

  function screenOf(name) {
    const v = new THREE.Vector3();
    if (name === 'bowl') v.set(S.bowlPos.x, dims.rimHeight, S.bowlPos.z);
    else if (name === 'give') v.set(LAYOUT.give.x, dims.rimHeight, LAYOUT.give.z);
    else if (name === 'wheel') W.wheel.getWorldPosition(v);
    else if (name === 'customer') { front.group.getWorldPosition(v); v.y += 0.1; }
    else if (name.startsWith('bottle')) { const b = W.bottles[+name.slice(6)]; v.copy(b.group.position); v.y -= 0.07; }
    else if (name.startsWith('pile')) v.copy(W.piles[+name.slice(4)].group.position);
    else if (name.startsWith('local:')) { const [x, z] = name.slice(6).split(',').map(Number); v.set(S.bowlPos.x + x, dims.rimHeight, S.bowlPos.z + z); }
    v.project(camera);
    const r = canvas.getBoundingClientRect();
    return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top };
  }

  function dispose() {
    hero.dispose();
    for (const s of shelf) { s.obj.userData.dispose && s.obj.userData.dispose(); s.obj.removeFromParent(); }
    [front, ...queue].forEach((a) => a.dispose());
    for (const k in topInst) topInst[k].dispose();
    disposeDeep(scene);
  }

  return {
    update, hero, screenOf, dispose,
    heroObjs: [hero.root, hero.fx],
    get bottlesHome() { return W.bottles.every((b) => b.state === 'home'); },
    get happy() { return front.mode === 'happy' || (S.give && S.give.happy); },
    get customerWalking() { return front.walking; },
    get label() { const st = hero.getStats(); return `${S.state} served ${S.served} stage ${st.stage} vol ${st.volume.toFixed(2)} cov ${st.coverage.toFixed(2)}`; },
    get state() { return { state: S.state, served: S.served, stats: hero.getStats(), toppings: toppings.length, shelf: shelf.length }; },
  };
}
