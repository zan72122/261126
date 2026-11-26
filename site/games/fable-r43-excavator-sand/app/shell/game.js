// 遊びの流れ（shell）：掘る → 入れる → 出発 → 渡す（友だちが喜ぶ）→ お城が育つ → 4回でできあがり → もう1回。
// 手順は強制しない。止まったら次に触れる物を光らせる。音は hero のイベントと状態から鳴らす。
import { LAYOUT, BED, DEBUG, params } from './config.js';
import { loadTex, cloneTex } from './assets.js';
import { createWorld } from './world.js';
import { createTruck } from './truck.js';
import { createFriend, FRIENDS } from './friend.js';
import { createCastle } from './castle.js';
import { createFx } from './fx.js';
import { createAudio } from './audio.js';
import { createInput } from './input.js';
import { createUI } from './ui.js';
import { createCameraRig } from './camera.js';

const COMPLETE_AT = 4;     // お城ができあがる配達回数
const IDLE_HINT = 2.5;     // 秒：手が止まったら光らせる
const IDLE_HAND = 5.5;     // 秒：手の絵を出す
const FULL_GLOW = 0.7;     // 荷台がこれ以上ならトラックを光らせる

export function createGame({ THREE, renderer, scene, camera, canvas, container, tier }) {
  // ---- テクスチャ（hero には原本、shell は複製を使う：GPU 上は同じ画像を共有）----
  const tex = {
    sandDry: loadTex('sand_dry_1024'),
    sandWet: loadTex('sand_wet_1024'),
    toyYellow: loadTex('toy_yellow_512'),
  };
  const shellSandDry = cloneTex(tex.sandDry); shellSandDry.repeat.set(0.6, 0.6);
  const shellSandWet = cloneTex(tex.sandWet); shellSandWet.repeat.set(1.5, 0.6);

  const world = createWorld(scene, tier, { sandDry: shellSandDry, sandWet: shellSandWet });
  const audio = createAudio();
  const fx = createFx(scene, tier, shellSandDry);

  // ---- hero ----
  let hero = null;
  let heightAt = () => 0;
  const truck = createTruck(scene, tier, (x, z) => heightAt(x, z));
  const heroEvents = [];
  const H = window.__HERO__;
  if (!H || typeof H.createHero !== 'function') throw new Error('hero.bundle.js が読み込まれていない（npm run build:hero）');
  let round = 0;
  hero = H.createHero(THREE, {
    tier: { name: tier.name, terrainCells: tier.terrainCells.slice(), grainMax: tier.grainMax, shadows: tier.shadows, maxTextureSize: tier.maxTextureSize },
    textures: tex,
    sandbox: { ...LAYOUT.sandbox },
    excavator: { position: new THREE.Vector3(LAYOUT.excavator.x, 0, LAYOUT.excavator.z), yaw: LAYOUT.excavator.yaw },
    bed: { anchor: truck.anchor, inner: { ...BED.inner }, keepOut: { min: BED.keepOut.min.slice(), max: BED.keepOut.max.slice() } },
    seed: 1,
    debug: DEBUG,
    onEvent: (name, data) => heroEvents.push([name, data]),
  });
  hero.root.userData.heroRoot = true;
  scene.add(hero.root);
  heightAt = (x, z) => hero.heightAt(x, z);
  truck.state.y = heightAt(LAYOUT.truck.park.x, LAYOUT.truck.park.z);

  // ---- 友だちとお城 ----
  const friendPos = new THREE.Vector3(LAYOUT.friend.x, 0, LAYOUT.friend.z);
  const castlePos = new THREE.Vector3(LAYOUT.castle.x, 0, LAYOUT.castle.z);
  const lookTarget = new THREE.Vector3(-0.4, 0, 4.2); // 体はカメラの左手前を向く（顔が見える）
  let friend = createFriend(scene, tier, 0, friendPos, lookTarget);
  let castle = createCastle(scene, tier, castlePos, shellSandWet, FRIENDS[0], shellSandDry);
  let oldFriend = null, oldCastle = null, oldCastleT = 0;

  // ---- UI・入力 ----
  const ui = createUI(container, () => replay());
  const input = createInput(canvas, camera, () => {
    const list = [];
    for (const o of hero.pickTargets) list.push({ obj: o, owner: 'hero' });
    list.push({ obj: truck.pick, owner: 'truck' });
    list.push({ obj: friend.pick, owner: 'friend' });
    list.push({ obj: castle.pick, owner: 'friend' }); // お城をトンしても友だちと同じ（渡す）
    return list;
  });
  // ---- カメラ（主役中心の構図。camera.js）----
  const T = LAYOUT.truck, EX = LAYOUT.excavator;
  const parkedBed = new THREE.Vector3();
  truck.anchor.getWorldPosition(parkedBed); parkedBed.y += 0.08;
  const exCenter = new THREE.Vector3(EX.x, 0.22, EX.z);
  const rig = createCameraRig(camera, {
    machineCenter: (out) => out.copy(exCenter),
    bucketTip: (out) => hero.getPoint('bucketTip', out),
    bedPoint: (out) => out.copy(parkedBed),
    machineObject: () => hero.root.getObjectByName('excavator'),
    // 引きのショットで入れる物（決まった位置）。[x, y, z, 物の半径]
    fixedPoints: {
      // 渡す：止まる所のトラック・お城・友だち（荷台が上がって砂が落ちるところが大きく見える）
      deliver: [[T.park.x, 0.25, T.stopZ, 0.4], [castlePos.x, 0.25, castlePos.z, 0.42], [friendPos.x, 0.4, friendPos.z, 0.3]],
      // お客さん：友だちと吹き出し・お城の場所・ショベル・トラックが一度に見える
      guest: [[EX.x, 0.25, EX.z, 0.45], [castlePos.x, 0.2, castlePos.z, 0.42], [friendPos.x, 0.55, friendPos.z, 0.35], [T.park.x, 0.25, T.park.z, 0.4]],
      // 完成：お城（土台の丸ごと）と友だち
      finale: [[castlePos.x, 0.35, castlePos.z, 0.52], [friendPos.x, 0.5, friendPos.z, 0.38]],
    },
  });
  const forcedShot = DEBUG ? params.get('shot') : null;
  const CAM = { guestT: 1.6, finale: false, loadHold: 0 };
  function wantShot(dt) {
    if (forcedShot) return forcedShot;
    const st = hero.getState();
    const touching = input.state.down && input.state.owner === 'hero';
    if (touching) { CAM.guestT = 0; CAM.finale = false; }
    if (truck.state.mode !== 'parked') return 'deliver';
    if (CAM.guestT > 0) { CAM.guestT -= dt; return 'guest'; }
    if (CAM.finale) return 'finale';
    // 荷台へ積む：荷台へあけている／バケットが荷台の近く／満杯で次は荷台へ運ぶ番
    hero.getPoint('bucketTip', v3c);
    const nearBed = Math.hypot(v3c.x - parkedBed.x, v3c.z - parkedBed.z) < 0.5;
    if ((st.phase === 'pour' && st.pourTarget === 'bed') || nearBed) CAM.loadHold = 1.2;
    else if (st.bucketFill >= 0.6 && st.phase !== 'pour') CAM.loadHold = Math.max(CAM.loadHold, 0.4);
    CAM.loadHold -= dt;
    return CAM.loadHold > 0 ? 'load' : 'work';
  }

  // iOS は版によって touchstart／touchend のどちらかでしか音を解放しないので両方で試す
  for (const ev of ['pointerdown', 'pointerup', 'touchend']) window.addEventListener(ev, () => audio.unlock(), { capture: true, passive: true });
  input.state.lastInput = performance.now() / 1000 - IDLE_HINT - 0.1; // 最初の1秒から光らせる（手の絵は数秒後）

  // ---- 状態 ----
  const G = {
    deliveries: 0, total: 0, delivering: false, dumpT: 0, fill0: 0, pieceAdded: false,
    pendingDepart: false, beepT: 0, complete: false, celebrateT: -1, hintLevel: 0, hintTarget: '',
    replaying: 0, time: 0, roundsPlayed: 0,
  };
  const v3 = new THREE.Vector3(), v3b = new THREE.Vector3(), v3c = new THREE.Vector3(), pourDir = new THREE.Vector3();

  function depart() {
    if (!truck.isParked()) return false;
    const st = hero.getState();
    if (st.phase === 'pour' && st.pourTarget === 'bed') { G.pendingDepart = true; return true; }
    G.pendingDepart = false;
    G.fill0 = hero.getBedFill();
    hero.setBedAvailable(false);
    truck.depart();
    truck.setGlow(0);
    audio.play('horn');
    friend.excite();
    G.delivering = true; G.dumpT = -1; G.pieceAdded = false;
    return true;
  }

  function onTruckTap() {
    const st = hero.getState();
    if (!truck.isParked()) { audio.play('horn'); truck.hop(0.5); return; }
    if (st.bucketFill > 0.05 && st.phase !== 'pour' && hero.command('dumpToBed')) { truck.hop(0.4); return; }
    if (hero.getBedFill() > 0.02) { depart(); return; }
    audio.play('horn'); truck.hop(1);
  }

  function replay() {
    if (G.replaying > 0) return;
    audio.play('button');
    ui.showReplay(false);
    G.replaying = 0.0001;
    friend.leave();
    oldFriend = friend;
    oldCastle = castle; oldCastleT = 0;
    round++;
    G.roundsPlayed++;
    hero.reset({ seed: 1 + round * 7919 });
    G.deliveries = 0; G.complete = false; G.celebrateT = -1;
    CAM.finale = false;
    input.poke();
  }

  function updateReplay(dt) {
    if (oldCastle) {
      oldCastleT += dt;
      const k = Math.max(0, 1 - oldCastleT / 0.6);
      oldCastle.group.scale.set(1 + (1 - k) * 0.3, Math.max(0.001, k), 1 + (1 - k) * 0.3);
      if (k <= 0) { oldCastle.dispose(); oldCastle = null; }
    }
    if (G.replaying > 0) {
      G.replaying += dt;
      if (G.replaying > 0.7 && oldFriend) {
        oldFriend.dispose(); oldFriend = null;
        friend = createFriend(scene, tier, round, friendPos, lookTarget);
        castle = createCastle(scene, tier, castlePos, shellSandWet, FRIENDS[round % FRIENDS.length], shellSandDry);
        audio.play('boing');
        G.replaying = 0;
        CAM.guestT = 1.6; // 新しいお客さんを見せてから寄る
      }
    }
  }

  // ---- 配達：荷台を上げてあける → お城が育つ → 喜ぶ → 戻る ----
  function updateDelivery(dt) {
    const ts = truck.state;
    if (ts.mode === 'out' && ts.reversing) {
      G.beepT -= dt;
      if (G.beepT <= 0) { audio.play('beep'); G.beepT = 0.45; }
    }
    if (ts.mode === 'arrived') {
      if (G.dumpT < 0) G.dumpT = 0;
      G.dumpT += dt;
      const t = G.dumpT;
      const up = t < 0.7 ? t / 0.7 : t < 1.9 ? 1 : Math.max(0, 1 - (t - 1.9) / 0.6);
      const e = up * up * (3 - 2 * up);
      ts.dumpAngle = e * 0.9;
      ts.gate = e * 1.3;
      if (t > 0.45 && t < 1.9) {
        const remain = Math.max(0.05, 1.9 - t);
        const removed = hero.drainBed(Math.min(1, dt / remain));
        truck.tailPoint(v3);
        truck.forward(pourDir).multiplyScalar(-0.6);
        const n = removed > 0 ? Math.min(6, 1 + Math.round(removed * 2500)) : (G.fill0 > 0.02 ? 1 : 0);
        if (n) fx.sandPour(v3, pourDir, 0.02, n);
        G.drainRate = removed / Math.max(dt, 1e-3);
      } else G.drainRate = 0;
      if (t > 1.0 && !G.pieceAdded) {
        G.pieceAdded = true;
        const top = castle.addPiece(G.fill0);
        G.deliveries++; G.total++;
        fx.sandPuff(v3b.copy(castlePos).setY(0.12), 18);
        fx.starBurst(top, 12);
        friend.cheer(3);
        friend.headWorld(v3b); v3b.y += 0.15;
        fx.heartBurst(v3b, 5);
        audio.play('thud'); audio.play('boing'); audio.play('squeak');
        setTimeout(() => audio.play('happy'), 250);
        if (G.deliveries >= COMPLETE_AT && !G.complete) { G.complete = true; G.celebrateT = 0; friend.setBubble(0); CAM.finale = true; }
      }
      if (t > 2.6) { ts.dumpAngle = 0; ts.gate = 0; truck.goBack(); }
    }
    if (G.delivering && truck.isParked() && G.pieceAdded) {
      G.delivering = false;
      hero.setBedAvailable(true);
    }
    if (G.celebrateT >= 0) {
      G.celebrateT += dt;
      if (G.celebrateT > 0.9 && G.celebrateT - dt <= 0.9) {
        friend.dance(3.2);
        fx.confettiBurst(v3.copy(castlePos).setY(0.6), 120);
        castle.topWorld(v3b);
        fx.starBurst(v3b, 24, 1.6);
        audio.play('fanfare'); audio.play('sparkle');
      }
      if (G.celebrateT > 1.8) { ui.showReplay(true); G.celebrateT = -1; }
    }
  }

  // ---- ヒント：止まったら次に触れる物が光って揺れる ----
  const screenOf = (p) => {
    v3b.copy(p).project(camera);
    const r = canvas.getBoundingClientRect();
    return [r.left + (v3b.x * 0.5 + 0.5) * r.width, r.top + (-v3b.y * 0.5 + 0.5) * r.height];
  };
  let hopT = 0;
  function updateHints(dt) {
    const idle = input.idleSeconds();
    const st = hero.getState();
    const parked = truck.isParked() && !G.delivering;
    const bedFull = parked && st.bedFill >= FULL_GLOW;
    let target = 'bucket';
    if (ui.replayVisible) target = 'replay';
    else if (parked && (bedFull || (st.bucketFill >= 0.25) || (st.bucketFill < 0.1 && st.bedFill > 0.35))) target = 'truck';
    if (st.phase === 'follow' || st.phase === 'pour' || G.replaying > 0) target = 'none';
    G.hintTarget = target;
    const active = idle > IDLE_HINT;
    // トラック：満杯近くなら常に光る、止まっていたら揺れる
    truck.setGlow(parked && (bedFull || (active && target === 'truck')) ? 1 : 0);
    if (parked && target === 'truck' && active) {
      hopT -= dt;
      if (hopT <= 0) { truck.hop(0.8); hopT = 0.9; }
    }
    // バケット
    const want = active && target === 'bucket' ? 1 : 0;
    G.hintLevel += (want - G.hintLevel) * Math.min(1, dt * 5);
    hero.setHint('bucket', G.hintLevel > 0.02 ? G.hintLevel : 0);
    // 手の絵
    if (idle > IDLE_HAND && (target === 'bucket' || target === 'truck')) {
      const a = screenOf(hero.getPoint('bucketTip', v3));
      let path;
      if (target === 'truck') {
        truck.anchor.getWorldPosition(v3); v3.y += 0.12;
        path = [a, screenOf(v3)];
      } else {
        // バケット（待機位置はショベルの右手前）から、すぐ前の砂へ押し込んで、ショベルの方へ引く
        const s1 = screenOf(v3.set(0.28, heightAt(0.28, 0.66), 0.66));
        const s2 = screenOf(v3.set(0.0, heightAt(0.0, 0.6), 0.6));
        path = [a, s1, s2];
      }
      ui.showHand(path);
    } else ui.hideHand();
  }

  // ---- hero のイベント → 音 ----
  let landT = 0;
  function drainHeroEvents() {
    for (const [name, data] of heroEvents) {
      if (name === 'grab') audio.play('grab');
      else if (name === 'digStart') audio.play('zak');
      else if (name === 'bucketFull') audio.play('pop');
      else if (name === 'pourStart') audio.play('zaa', Math.min(1, (data && data.volume ? data.volume / 0.004 : 0.5)));
      else if (name === 'land' && landT <= 0) { audio.play('land'); landT = 0.08; }
      else if (name === 'pourEnd' && G.pendingDepart && data && data.target === 'bed') { G.pendingDepart = false; setTimeout(depart, 150); }
    }
    heroEvents.length = 0;
  }

  function handleInputEvents() {
    for (const e of input.events) {
      if (e.type === 'up' && e.tap) {
        if (e.owner === 'truck') onTruckTap();
        // 空のバケットがトラックの手前に重なっていても、トンはトラックへ
        else if (e.owner === 'hero' && e.behind === 'truck' && hero.getState().bucketFill < 0.05) onTruckTap();
        else if (e.owner === 'friend') {
          // 友だち・お城をトン：荷台に砂があればトラックが運んでくる（どの順でも「渡す」へ進める）。なければ手を振る
          friend.wave(); audio.play('squeak');
          if (truck.isParked() && !G.delivering && hero.getBedFill() > 0.02) depart();
        }
      }
    }
  }

  let lastHeroMs = 0;
  let heroScreen = 0, measureT = 0;
  return {
    update(dt, time) {
      G.time = time;
      const pointer = input.frame();
      handleInputEvents();
      const h0 = performance.now();
      hero.update(dt, { time, pointer });
      lastHeroMs = lastHeroMs * 0.9 + (performance.now() - h0) * 0.1;
      drainHeroEvents();
      landT -= dt;
      truck.update(dt, time);
      updateDelivery(dt);
      updateReplay(dt);
      hero.getPoint('bucketCenter', v3);
      friend.update(dt, time, truck.state.mode !== 'parked' ? truck.root.position : v3);
      if (oldFriend) oldFriend.update(dt, time, null);
      castle.update(dt, time);
      fx.update(dt, camera);
      ui.update(dt);
      updateHints(dt);
      // カメラは最後に動かす（次のフレームの指の判定は、このカメラで描いた画面に対して行う）
      rig.update(dt, wantShot(dt), input.state.down && input.state.owner === 'hero');
      rig.focus(v3);
      world.followView(camera, v3, rig.visibleHalf());
      const st = hero.getState();
      audio.updateLoops({ armSpeed: st.armSpeed, digRate: st.digRate, pourRate: st.pourRate + (G.drainRate || 0) * 0.5, truckMoving: truck.state.mode === 'out' || truck.state.mode === 'back' });
      input.endFrame();
      if (DEBUG && (measureT -= dt) <= 0) { measureT = 0.5; heroScreen = rig.measure(canvas.clientWidth, canvas.clientHeight); }
    },
    onResize(w, h) { rig.resize(w, h); rig.update(0, wantShot(0), false); world.followView(camera, rig.focus(v3), rig.visibleHalf()); },
    rig,
    onContextLost() { audio.suspend(); },
    onContextRestored() { hero.onContextRestored(); audio.resume(); },
    onHidden() { audio.suspend(); },
    onVisible() { audio.resume(); },
    debugDeliver() { if (truck.isParked()) depart(); },
    debugReplay() { replay(); },
    debugLine() {
      const s = hero.getState();
      return rig.debugLine() + `  hero ${(heroScreen * 100).toFixed(0)}% of short side\n` +
        `hero ${s.phase} bucket ${s.bucketFill.toFixed(2)} bed ${s.bedFill.toFixed(2)} upd ${lastHeroMs.toFixed(2)}ms\n` +
        `truck ${truck.state.mode} deliveries ${G.deliveries} round ${round} hint ${G.hintTarget}`;
    },
    // ---- 煙テスト用の読み取り ----
    probe() {
      const s = hero.getState();
      return {
        heroPhase: s.phase, bucketFill: s.bucketFill, bedFill: s.bedFill,
        truck: truck.state.mode, deliveries: G.deliveries, total: G.total, round,
        replayVisible: ui.replayVisible, complete: G.complete, friend: friend.def.kind, hint: G.hintTarget,
      };
    },
    screen(name) {
      if (name === 'bucket') return screenOf(hero.getPoint('bucketTip', v3));
      if (name === 'bucketCenter') return screenOf(hero.getPoint('bucketCenter', v3));
      if (name === 'bed') { truck.anchor.getWorldPosition(v3); v3.y += 0.1; return screenOf(v3); }
      if (name === 'truckCab') { v3.set(0.3, 0.35, 0); truck.root.localToWorld(v3); return screenOf(v3); }
      if (name === 'friend') { friend.headWorld(v3); return screenOf(v3); }
      if (name === 'replay') { const r = ui.replayButton.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
      const m = /^sand:(-?[\d.]+),(-?[\d.]+)$/.exec(name);
      if (m) { const x = +m[1], z = +m[2]; return screenOf(v3.set(x, heightAt(x, z), z)); }
      return null;
    },
    dispose() {
      hero.dispose(); truck.dispose(); friend.dispose(); castle.dispose(); fx.dispose(); world.dispose();
      for (const t of Object.values(tex)) t.dispose();
      shellSandDry.dispose(); shellSandWet.dispose();
    },
  };
}
