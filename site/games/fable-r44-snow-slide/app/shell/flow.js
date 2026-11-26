import * as THREE from 'three';
import { createAnimal } from './animals.js';
import { createFlag, Bursts, createTouchRing } from './props.js';

// The play flow (docs/PLAN.md §1). No order is enforced; nothing can fail; nothing is timed against the child.
//  A start  : plow glows + hops, rider waves on the sled at the top, flag glows.
//  B build  : drag/tap on plow or snow -> plow drives (hero does the snow).
//  C slide  : tap flag/sled, or drag the sled and let go -> hero slides it; rider reacts; returnSled() after.
//  D friend : arrives when the hill is medium, or after 2 slides, or 60 s after the first touch.
//             tap it (or bring the sled to it) -> it rides with the rider -> big joy -> stays as a spectator.
//  E again  : round button -> snow curtain -> new start hill, new rider/friend, new sky; spectators stay.

const RIDERS = ['bear', 'cat', 'penguin', 'rabbit', 'fox'];
const FRIENDS = ['rabbit', 'fox', 'penguin', 'cat', 'bear'];
const ENTRY = new THREE.Vector3(9.8, 0, 3.4);
const WAIT_SPOT = new THREE.Vector3(7.2, 0, 2.6);
const SPOTS = [[7.2, -0.4], [-7.2, 2.6], [-7.2, -0.4], [7.2, -3.4]].map(([x, z]) => new THREE.Vector3(x, 0, z));
const FRIEND_AFTER_S = 60;
const HEART_COLORS = [0xff5c8a, 0xff8fb1, 0xffc93c, 0x7cc8ff, 0xb48cff];
const STAR_COLORS = [0xffd23f, 0xfff07a, 0xffffff, 0x9fe0ff];
const LOOK = new THREE.Vector3(0, 0.3, 0.4);
const VIEW_DIR = new THREE.Vector3(0, 9, 12.5).normalize();

export function createFlow({ scene, camera, hero, sfx, world, ui, tier, seed0 }) {
  const S = {
    time: 0, round: 0, seed: seed0,
    firstTouchT: null, lastInputT: 0, everPlowed: false,
    slides: 0, hillGrewSinceSlide: false,
    mode: null, plowTarget: null, plowDragging: false, sledHold: null, gotoUntil: 0, pendingHit: null, pokeUntil: 0,
    hint: null, hintUntil: 0, nextHintAt: 0, hintIdx: 0,
    riderOverride: null, friend: null, friendDone: false, spectators: [], transitioning: false,
  };
  const timers = [];
  const after = (s, fn) => timers.push({ at: S.time + s, fn });

  // ---------- rider ----------
  let rider = null;
  function setRider(kind) {
    if (rider) rider.dispose();
    rider = createAnimal(kind, { shadows: tier.shadows });
    hero.seats[0].add(rider.root);
  }
  setRider(RIDERS[0]);
  const riderPose = (pose, secs) => { S.riderOverride = { pose, until: S.time + secs }; };

  // ---------- flag ----------
  const flag = createFlag(tier.shadows);
  scene.add(flag.root);
  const flagPos = new THREE.Vector3();
  function flagTarget(out) {
    const p = hero.getPeak();
    const x = p.x - 0.7, z = p.z - 0.45;
    return out.set(x, hero.heightAt(x, z) - 0.05, z);
  }
  flag.update(0, flagTarget(flagPos), true);
  flag.setStage(hero.getStats().hillStage);

  const bursts = new Bursts(scene, camera);
  const ring = createTouchRing(scene);   // a soft ring on the snow where the finger lands (instant feedback)

  // ---------- camera (one fixed view; tiny pan toward the sled while sliding) ----------
  let baseDist = 24;
  const camOff = new THREE.Vector3(), camOffTarget = new THREE.Vector3();
  function fitCamera(w, h) {
    camera.aspect = w / h; camera.fov = 42; camera.near = 0.5; camera.far = 200; camera.updateProjectionMatrix();
    const pts = [[-7.7, 0, -6.4], [7.7, 0, -6.4], [-7.0, 0, 6.6], [7.0, 0, 6.6], [-5, 2.6, -5.5], [5, 2.6, -5.5], [7.6, 0.8, 2.6], [-7.6, 0.8, 2.6]].map((a) => new THREE.Vector3(...a));
    const v = new THREE.Vector3();
    let d = 10;
    for (; d < 80; d += 0.25) {
      camera.position.copy(LOOK).addScaledVector(VIEW_DIR, d); camera.lookAt(LOOK); camera.updateMatrixWorld();
      if (pts.every((p) => { v.copy(p).project(camera); return Math.abs(v.x) < 0.97 && Math.abs(v.y) < 0.95; })) break;
    }
    baseDist = d;
    placeCamera();
  }
  function placeCamera() {
    camera.position.copy(LOOK).add(camOff).addScaledVector(VIEW_DIR, baseDist);
    camera.lookAt(LOOK.x + camOff.x, LOOK.y + camOff.y, LOOK.z + camOff.z);
  }

  // ---------- friend / spectators ----------
  const groundY = (x, z) => hero.heightAt(x, z);
  function walk(ent, target, speed, dt) {
    const p = ent.animal.root.position;
    const dx = target.x - p.x, dz = target.z - p.z, d = Math.hypot(dx, dz);
    if (d < 0.05) { p.y = groundY(p.x, p.z); return true; }
    const s = Math.min(d, speed * dt);
    p.x += (dx / d) * s; p.z += (dz / d) * s; p.y = groundY(p.x, p.z);
    ent.animal.root.rotation.y = turn(ent.animal.root.rotation.y, Math.atan2(dx, dz), dt * 8);
    ent.animal.setPose('walk');
    return d - s < 0.05;
  }
  const faceField = (ent) => { const p = ent.animal.root.position; ent.animal.root.rotation.y = Math.atan2(-p.x * 0.8, 6 - p.z); };

  function pickFriendKind(riderKind) {
    const used = new Set(S.spectators.map((s) => s.animal.kind));
    return FRIENDS.find((k) => k !== riderKind && !used.has(k)) || FRIENDS.find((k) => k !== riderKind);
  }
  function freeSpot() {
    const taken = new Set(S.spectators.map((s) => s.spot));
    return SPOTS.find((s) => !taken.has(s)) || SPOTS[0];
  }

  function spawnFriend() {
    const kind = pickFriendKind(rider.kind);
    const animal = createAnimal(kind, { shadows: tier.shadows });
    animal.root.position.copy(ENTRY);
    scene.add(animal.root);
    S.friend = { animal, phase: 'arriving', spot: freeSpot(), poseUntil: 0, started: false };
    sfx.play('friend');
  }

  // a friend who came to watch hops on as soon as the child asks for a slide (no fixed order of steps)
  const friendWaiting = () => !!S.friend && (S.friend.phase === 'arriving' || S.friend.phase === 'waiting');
  function inviteFriend() {
    const f = S.friend;
    if (!f || !(f.phase === 'arriving' || f.phase === 'waiting')) return;
    f.phase = 'joining';
    f.animal.setGlow(0);
    sfx.play('hop');
  }

  function friendJoy() {
    const f = S.friend;
    f.phase = 'joy';
    scene.attach(f.animal.root);
    const p = f.animal.root.position;
    const side = p.x > 0 ? -0.9 : 0.9;
    p.x = clamp(p.x + side, -5.4, 5.4); p.y = groundY(p.x, p.z);
    f.animal.root.rotation.set(0, Math.atan2(-p.x * 0.3, 8), 0);
    f.animal.setPose('spin');
    sfx.play('fanfare');
    const head = () => f.animal.root.position.clone().add(new THREE.Vector3(0, 0.8, 0));
    bursts.emit('heart', head(), 10, HEART_COLORS);
    after(0.8, () => bursts.emit('heart', head(), 8, HEART_COLORS));
    after(1.4, () => { f.animal.setPose('jump'); bursts.emit('star', head(), 10, STAR_COLORS); sfx.play('clap'); });
    after(2.2, () => bursts.emit('heart', head(), 8, HEART_COLORS));
    after(3.6, () => {
      f.phase = 'toSpot';
      if (hero.getSledPose().state === 'stopped') hero.returnSled();
      ui.showAgain(true);
      S.friendDone = true;
    });
  }

  function updateFriend(dt) {
    const f = S.friend;
    if (!f) return;
    const a = f.animal;
    switch (f.phase) {
      case 'arriving':
        if (walk(f, WAIT_SPOT, 1.8, dt)) { f.phase = 'waiting'; faceField(f); }
        break;
      case 'waiting':
        a.setPose('hop');
        break;
      case 'joining': {
        const sp = hero.getSledPose();
        if (sp.state === 'slide' || sp.state === 'hop' || sp.state === 'held' || sp.state === 'return') { a.setPose('cheer'); break; }
        const back = hero.seats[1].getWorldPosition(new THREE.Vector3());
        if (walk(f, back, 3.0, dt) || a.root.position.distanceTo(back) < 0.5) {
          hero.seats[1].add(a.root);
          a.root.position.set(0, 0, 0); a.root.rotation.set(0, 0, 0);
          a.setPose('cheer');
          f.phase = 'riding'; f.started = false;
          clearTimersFor('return');
        }
        break;
      }
      case 'riding':
        if (!f.started) f.started = hero.slideFromTop();
        a.setPose(hero.getSledPose().speed > 2.2 || hero.getSledPose().state === 'hop' ? 'cheer' : 'hold');
        break;
      case 'joy':
        break;
      case 'toSpot':
        if (walk(f, f.spot, 2.0, dt)) {
          f.phase = 'spectating'; faceField(f); a.setPose('idle');
          a.useBlobShadow();
          S.spectators.push({ animal: a, spot: f.spot, poseUntil: 0 });
          S.friend = null;
        }
        break;
      default: break;
    }
  }

  function cheerSpectators(pose, secs) {
    for (const s of S.spectators) { s.animal.setPose(pose); s.poseUntil = S.time + secs; }
  }

  // ---------- hero events -> sound + reactions ----------
  function onHeroEvent(type, d) {
    switch (type) {
      case 'plowStart': S.everPlowed = true; break;
      case 'pileUp': sfx.play('poff', d); break;
      case 'spill': sfx.play('spill'); break;
      case 'hillGrow':
        sfx.play('grow', d); flag.pop(); flag.setStage(d.stage);
        bursts.emit('star', flag.root.position.clone().add(new THREE.Vector3(0, 1.4, 0)), 8, STAR_COLORS);
        riderPose('clap', 1.6); S.hillGrewSinceSlide = true;
        break;
      case 'sledPick': sfx.play('pick'); break;
      case 'sledDrop': sfx.play('drop'); break;
      case 'slideStart': sfx.play('whee'); break;
      case 'sledBump': sfx.play('bump', d); break;
      case 'sledLand': sfx.play('land', d); break;
      case 'slideEnd':
        S.slides++; S.hillGrewSinceSlide = false;
        sfx.play('end'); riderPose('wave', 2.2); cheerSpectators('jump', 1.6);
        if (S.friend && S.friend.phase === 'riding') friendJoy();
        else timers.push({ at: S.time + 2.0, tag: 'return', fn: () => { if (hero.getSledPose().state === 'stopped' && !(S.friend && S.friend.phase === 'joining')) hero.returnSled(); } });
        break;
      default: break;
    }
  }
  function clearTimersFor(tag) { for (let i = timers.length - 1; i >= 0; i--) if (timers[i].tag === tag) timers.splice(i, 1); }

  // ---------- input ----------
  function touched() {
    sfx.unlock();
    if (S.firstTouchT === null) { S.firstTouchT = S.time; sfx.play('start'); }
    S.lastInputT = S.time;
    setHint(null);
  }
  const pickers = () => {
    const list = [];
    const f = S.friend;
    if (f && (f.phase === 'arriving' || f.phase === 'waiting')) list.push({ id: 'friend', object: f.animal.pick });
    for (const t of hero.pickTargets) if (t.id === 'sled') list.push(t);
    list.push({ id: 'flag', object: flag.pick });
    for (const s of S.spectators) list.push({ id: 'spectator', object: s.animal.pick, ref: s });
    for (const t of hero.pickTargets) if (t.id === 'plow') list.push(t);
    return list;
  };
  const handlers = {
    down(hit, gp) {
      if (S.transitioning) return;
      touched();
      // something always moves at once (5-year-old check: touch -> instant change)
      if (hit.id === 'plow' || hit.id === 'ground') {
        S.mode = 'drive'; S.plowDragging = true;
        if (hit.id === 'plow') {
          // touching the truck itself: it hops and rumbles; it only drives once the finger moves away
          S.plowTarget = null; S.pokeUntil = S.time + 0.45; sfx.play('start');
        } else {
          S.plowTarget = gp ? { x: gp.x, z: gp.z } : null;
          if (gp) ring.show(gp.x, hero.heightAt(gp.x, gp.z), gp.z);
        }
      } else if (hit.id === 'sled') {
        S.mode = 'pendingSled';
        riderPose('cheer', 0.8); sfx.play('tap');
      } else {
        S.mode = 'pendingTap'; S.pendingHit = hit;
        if (hit.id === 'spectator') { hit.ref.animal.setPose('jump'); hit.ref.poseUntil = S.time + 1.0; sfx.play('hop'); }
        else if (hit.id === 'flag') { flag.pop(); sfx.play('tap'); }
        else if (hit.id === 'friend') inviteFriend();      // the friend starts hopping over right away
      }
    },
    move(gp, isDrag, hit) {
      if (!gp || S.transitioning) return;
      if (S.mode === 'drive') { if (isDrag || !hit || hit.id !== 'plow') S.plowTarget = { x: gp.x, z: gp.z }; }
      else if (S.mode === 'pendingSled' && isDrag) { S.mode = 'sled'; S.sledHold = { x: gp.x, z: gp.z }; }
      else if (S.mode === 'sled') S.sledHold = { x: gp.x, z: gp.z };
      else if (S.mode === 'pendingTap' && isDrag) { S.mode = 'drive'; S.plowDragging = true; S.plowTarget = { x: gp.x, z: gp.z }; }
    },
    up({ tap, hit, ground }) {
      S.lastInputT = S.time;
      const m = S.mode;
      S.mode = null;
      if (m === 'drive') {
        if (tap && ground && hit.id !== 'plow') { S.mode = 'goto'; S.plowTarget = { x: ground.x, z: ground.z }; S.plowDragging = false; S.gotoUntil = S.time + 12; }
        else { S.plowTarget = null; S.plowDragging = false; }
      } else if (m === 'pendingSled') {
        if (friendWaiting()) inviteFriend(); else hero.slideFromTop();
      } else if (m === 'sled') {
        const f = S.friend, hold = S.sledHold;
        S.sledHold = null;
        if (f && (f.phase === 'waiting' || f.phase === 'arriving') && hold && Math.hypot(hold.x - f.animal.root.position.x, hold.z - f.animal.root.position.z) < 2.0) {
          hero.releaseSled(false); inviteFriend();
        } else hero.releaseSled(true);
      } else if (m === 'pendingTap') {
        const h = S.pendingHit;
        if (h.id === 'flag') { if (friendWaiting()) inviteFriend(); else hero.slideFromTop(); }
      }
    },
  };

  // ---------- hints: when the child stops, light up one next thing ----------
  function setHint(h) {
    S.hint = h; S.hintUntil = h ? S.time + 2.6 : 0;
  }
  function chooseHint() {
    const c = [];
    const f = S.friend;
    if (f && f.phase === 'waiting') c.push('friend');
    if (!S.everPlowed) c.push('plow');
    const sp = hero.getSledPose();
    if (sp.state === 'ready' && (S.slides === 0 || S.hillGrewSinceSlide)) c.push('flag');
    if (ui.againVisible) c.push('again');
    if (!c.length) c.push('plow', 'flag');
    return c[S.hintIdx++ % c.length];
  }
  function updateHints() {
    const idle = S.time - S.lastInputT;
    if (S.firstTouchT === null) {
      hero.setHint('plow', 1); hero.setHint('sled', 0); flag.setGlow(1);
      return;
    }
    if (idle > 3 && S.time >= S.nextHintAt && !S.transitioning) {
      setHint(chooseHint()); S.nextHintAt = S.time + 4;
      sfx.play('hint');
      if (S.hint === 'again') ui.nudgeAgain();
    }
    const on = (id) => (S.hint === id && S.time < S.hintUntil ? 1 : 0);
    hero.setHint('plow', Math.max(on('plow'), S.time < S.pokeUntil ? 1 : 0));
    hero.setHint('sled', on('flag'));
    flag.setGlow(on('flag'));
    if (S.friend) S.friend.animal.setGlow(on('friend'));
  }

  // ---------- rounds ----------
  function onAgain() {
    if (S.transitioning) return;
    touched();
    S.transitioning = true;
    sfx.play('again'); ui.showAgain(false); ui.curtain(true);
    after(0.8, () => {
      newRound();
      after(0.2, () => { ui.curtain(false); S.transitioning = false; });
    });
  }
  function newRound() {
    S.round++;
    S.seed = (S.seed * 1103515245 + 12345 + S.round) | 0;
    timers.length = 0;
    // a friend still walking becomes a spectator right away
    const f = S.friend;
    if (f) {
      if (f.animal.root.parent !== scene) scene.attach(f.animal.root);
      f.animal.root.position.copy(f.spot); faceField(f); f.animal.setPose('idle');
      f.animal.useBlobShadow();
      S.spectators.push({ animal: f.animal, spot: f.spot, poseUntil: 0 });
      S.friend = null;
    }
    while (S.spectators.length >= SPOTS.length) S.spectators.shift().animal.dispose();
    hero.reset({ seed: S.seed, round: S.round });
    world.setPalette(S.round);
    setRider(RIDERS[S.round % RIDERS.length]);
    Object.assign(S, { firstTouchT: null, slides: 0, hillGrewSinceSlide: false, mode: null, plowTarget: null, plowDragging: false, sledHold: null, friendDone: false, hint: null, riderOverride: null });
    camOff.set(0, 0, 0); placeCamera();
    flag.setStage(hero.getStats().hillStage);
    flag.update(0, flagTarget(flagPos), true);
  }

  // ---------- per frame ----------
  const input = { t: 0, plowTarget: null, plowDragging: false, sledHold: null };
  function update(dt) {
    S.time += dt;
    const due = [];
    for (let i = timers.length - 1; i >= 0; i--) if (S.time >= timers[i].at) due.push(timers.splice(i, 1)[0]);
    due.reverse().forEach((t) => t.fn());

    input.t = S.time; input.plowTarget = S.plowTarget; input.plowDragging = S.plowDragging; input.sledHold = S.sledHold;
    hero.update(dt, input);
    // tap-to-go ends when the hero says the plow has arrived (driving goes false), with a safety timeout
    if (S.mode === 'goto' && S.plowTarget && (!hero.getPlowPose().driving || S.time > S.gotoUntil)) { S.plowTarget = null; S.mode = null; }

    // friend arrives: any one of the conditions
    if (!S.friend && !S.friendDone && S.firstTouchT !== null) {
      const st = hero.getStats();
      if (st.hillStage >= 2 || S.slides >= 2 || S.time - S.firstTouchT >= FRIEND_AFTER_S) spawnFriend();
    }
    updateFriend(dt);
    updateHints();

    // rider pose
    const sp = hero.getSledPose();
    let pose = 'idle';
    if (S.riderOverride && S.time < S.riderOverride.until) pose = S.riderOverride.pose;
    else if (sp.state === 'held' || sp.state === 'hop') pose = 'cheer';
    else if (sp.state === 'slide') pose = sp.speed > 2.2 ? 'cheer' : 'hold';
    else if (sp.state === 'return') pose = 'hold';
    else if (S.firstTouchT === null) pose = 'wave';
    rider.setPose(pose);
    rider.update(dt);
    if (S.friend) S.friend.animal.update(dt);
    for (const s of S.spectators) { if (s.poseUntil && S.time > s.poseUntil) { s.animal.setPose('idle'); s.poseUntil = 0; } s.animal.update(dt); }

    flag.update(dt, flagTarget(flagPos), false);
    bursts.update(dt);
    ring.update(dt);
    sfx.continuous(hero.getPlowPose(), sp);

    // camera: small, slow pan toward the sled only while it slides
    if (sp.state === 'slide' || sp.state === 'hop') camOffTarget.set(clamp((sp.x - LOOK.x) * 0.12, -0.9, 0.9), 0, clamp((sp.z - LOOK.z) * 0.08, -0.7, 0.7));
    else camOffTarget.set(0, 0, 0);
    camOff.lerp(camOffTarget, 1 - Math.exp(-dt / 1.2));
    placeCamera();
  }

  return {
    S, handlers, pickers, update, fitCamera, onHeroEvent, onAgain, flag,
    get rider() { return rider; },
    dispose() { flag.dispose(); bursts.dispose(); ring.dispose(); rider.dispose(); S.spectators.forEach((s) => s.animal.dispose()); if (S.friend) S.friend.animal.dispose(); },
  };
}

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function turn(h, target, step) { let d = target - h; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return h + clamp(d, -step, step); }
