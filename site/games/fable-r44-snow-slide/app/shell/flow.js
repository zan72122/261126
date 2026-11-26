import * as THREE from 'three';
import { createAnimal } from './animals.js';
import { createFlag, Bursts, createTouchRing } from './props.js';
import { createCamRig } from './camrig.js';

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

  // ---------- camera: subject-centred shots (docs/fullscreen.md) ----------
  // work   : plow + the snow in front of its blade, about 6 m of the short side; the sled/friend are panned in at the edge
  // start  : plow and sled with the waving rider (the cast), until the first touch
  // slide  : beside the sled, along its run (three-quarter side view)
  // guest  : the friend and the sled (a friend arrives / walks over to ride): slow pull back
  // finale : the hill and the cheering friend after the ride together: the only wide view, short
  // look   : after 6 s without touches, the plow and the sled together (where to go next)
  // carry  : the sled held under the finger
  const rig = createCamRig(camera, { heightAt: (x, z) => hero.heightAt(x, z) });
  const cam = { slide: false, hopIsSlide: false, prevSled: 'ready', stoppedAt: 0, finaleUntil: 0, anchor: new THREE.Vector3(), anchored: false, sideSign: 1, name: 'start' };
  const PITCH_WORK = 38 * Math.PI / 180, PITCH_SLIDE = 24 * Math.PI / 180, PITCH_WIDE = 40 * Math.PI / 180;
  const _f = new THREE.Vector3(), _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3();
  const incl = [];
  function fitCamera(w, h) { rig.resize(w, h); }

  // a group shot: looks at the middle of the points; the rig finds the nearest distance that keeps them all on screen
  const fitPts = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  function group(pts, dMin, dMax, out) {
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9, y = 0;
    for (const p of pts) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z); y += p.y; }
    out.set((x0 + x1) / 2, y / pts.length + 0.3, (z0 + z1) / 2);
    const list = [];
    pts.forEach((p, i) => { list.push(fitPts[i * 2].set(p.x, p.y, p.z), fitPts[i * 2 + 1].set(p.x, p.y + 1.1, p.z)); });
    return { pts: list, dMin, dMax };
  }
  const fingerDown = () => S.mode === 'drive' || S.mode === 'sled' || S.mode === 'pendingSled' || S.mode === 'pendingTap';

  function directCamera(dt, sp) {
    // which moment is it?
    const st = sp.state;
    if (st === 'hop' && cam.prevSled !== 'hop') cam.hopIsSlide = cam.prevSled !== 'return';
    if (st === 'stopped' && cam.prevSled !== 'stopped') cam.stoppedAt = S.time;
    if ((st === 'slide' || (st === 'hop' && cam.hopIsSlide)) && !cam.slide) {
      cam.slide = true;
      // pick the side to watch from once per slide: the one more in front (the park is behind the field)
      cam.sideSign = Math.cos(sp.heading + Math.PI / 2) >= Math.cos(sp.heading - Math.PI / 2) ? 1 : -1;
    }
    if (st === 'ready' || st === 'held' || st === 'return' || (st === 'stopped' && S.time - cam.stoppedAt > 1.4)) cam.slide = false;
    cam.prevSled = st;

    const plow = hero.getPlowPose(), f = S.friend;
    const idle = S.time - S.lastInputT;
    let shot;
    if (S.time < cam.finaleUntil) {
      // finale: the ride together is done; a short look at the whole hill with the cheering friend
      const pk = hero.getPeak();
      const pts = [_a.set(pk.x, pk.y * 0.5, pk.z), f ? f.animal.root.getWorldPosition(_b) : _b.set(sp.x, sp.y, sp.z)];
      shot = { name: 'finale', focus: _f, fit: group(pts, 8.0, 10.0, _f), centerY: 0, yaw: 0, pitch: PITCH_WIDE, tPos: 1.5, tZoom: 1.6, tRot: 1.4 };
    } else if (S.firstTouchT === null && !f) {
      const pts = [_a.set(plow.x, plow.y, plow.z), _b.set(sp.x, sp.y, sp.z)];
      shot = { name: 'start', focus: _f, fit: group(pts, 3.8, 7.0, _f), centerY: 0, yaw: 0, pitch: PITCH_WORK, tPos: 1.2, tZoom: 1.2, tRot: 1.2 };
    } else if (cam.slide) {
      // beside the run, a little ahead of the sled; slow to swing round, quick to follow
      const lead = Math.min(sp.speed, 5) * 0.3;
      _f.set(sp.x + Math.sin(sp.heading) * lead, sp.y + 0.35, sp.z + Math.cos(sp.heading) * lead);
      const side = wrapA(sp.heading + cam.sideSign * Math.PI / 2);
      const yaw = clamp(side, -1.05, 1.05);
      const two = !!(f && f.phase === 'riding');
      shot = { name: 'slide', focus: _f, D: two ? 3.4 : 3.0, yaw, pitch: PITCH_SLIDE, tPos: 0.28, tZoom: 1.0, tRot: 1.1 };
    } else if (f && (f.phase === 'joining' || ((f.phase === 'arriving' || f.phase === 'waiting') && idle > 2.5 && !plow.driving && !fingerDown()))) {
      // a friend comes to ride (the hand-over): slowly pull back to show the friend and the sled
      const pts = [f.animal.root.getWorldPosition(_a), _b.set(sp.x, sp.y, sp.z)];
      shot = { name: 'guest', focus: _f, fit: group(pts, 3.8, 7.5, _f), centerY: 0, yaw: 0, pitch: PITCH_WORK, tPos: 1.4, tZoom: 1.6, tRot: 1.4 };
    } else if (st === 'ready' && idle > 6 && !plow.driving && !fingerDown() && !S.transitioning) {
      // resting: after a while without touches, show the plow and the sled together again (where to go next)
      const pts = [_a.set(plow.x, plow.y, plow.z), _b.set(sp.x, sp.y, sp.z)];
      shot = { name: 'look', focus: _f, fit: group(pts, 3.8, 6.5, _f), centerY: 0, yaw: 0, pitch: PITCH_WORK, tPos: 1.6, tZoom: 1.8, tRot: 1.6 };
    } else if (st === 'held') {
      _f.set(sp.x, sp.y + 0.3, sp.z);
      shot = { name: 'carry', focus: _f, D: 3.2, yaw: 0, pitch: PITCH_WORK, tPos: 0.6, tZoom: 1.0, tRot: 1.0 };
    } else {
      // work: the plow and the snow in front of its blade
      _f.set(plow.x + Math.sin(plow.heading) * 0.7, plow.y + 0.35, plow.z + Math.cos(plow.heading) * 0.7);
      incl.length = 0;
      if (st === 'ready' || st === 'stopped') incl.push(_b.set(sp.x, sp.y + 0.4, sp.z));
      if (f && (f.phase === 'arriving' || f.phase === 'waiting')) incl.push(f.animal.root.getWorldPosition(_c).setY(_c.y + 0.5));
      // while driving the subject stays near the middle; when the plow rests, the sled/friend may pull the view further
      const busy = plow.driving || fingerDown() || idle < 1.5;
      shot = { name: 'work', focus: _f, D: 3.8, yaw: 0, pitch: PITCH_WORK, include: incl, panMax: busy ? 0.3 : 0.5, tPos: busy ? 0.55 : 1.2, tZoom: 1.0, tRot: 1.0 };
    }

    // dead zone while a finger is down: the view holds still so the finger keeps pointing where it means,
    // and only moves on when the subject walks out of the middle (then the finger point moves with it)
    if (fingerDown() && (shot.name === 'work' || shot.name === 'carry')) {
      if (!cam.anchored) { cam.anchor.copy(rig.focus); cam.anchored = true; }
      const R = 0.22 * shot.D;
      const dx = shot.focus.x - cam.anchor.x, dz = shot.focus.z - cam.anchor.z, dd = Math.hypot(dx, dz);
      if (dd > R) { cam.anchor.x += dx * (1 - R / dd); cam.anchor.z += dz * (1 - R / dd); }
      cam.anchor.y = shot.focus.y;
      shot.focus = cam.anchor; shot.include = null;
    } else cam.anchored = false;

    cam.name = shot.name;
    rig.set(shot);
    rig.update(dt);
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
    cam.finaleUntil = S.time + 5.2;
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
    cam.slide = false; cam.finaleUntil = 0; cam.prevSled = 'ready'; cam.anchored = false;
    rig.requestSnap(); directCamera(0, hero.getSledPose());
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

    directCamera(dt, sp);
  }

  return {
    S, handlers, pickers, update, fitCamera, onHeroEvent, onAgain, flag, rig,
    get camName() { return cam.name; },
    get rider() { return rider; },
    dispose() { flag.dispose(); bursts.dispose(); ring.dispose(); rider.dispose(); S.spectators.forEach((s) => s.animal.dispose()); if (S.friend) S.friend.animal.dispose(); },
  };
}

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function wrapA(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
function turn(h, target, step) { let d = target - h; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return h + clamp(d, -step, step); }
