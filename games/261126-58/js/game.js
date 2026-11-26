// Game flow: 0 hat -> 1 scoop -> 2 punch shapes (+ papa's crack, tape fix) -> 3 candle & lights off -> 4 garden path.
import * as THREE from 'three';
import { E, applyShot, onPointer, ptr, pick, toScreen } from './engine.js';
import { buildStage } from './stage.js';
import { Pumpkin, PulpMass, seedGeometry, seedMaterial } from './pumpkin.js';
import { Candle } from './candle.js';
import { ROOM } from './room.js';
import { Person } from './people.js';
import { makeSpoon, makeBowl, SeedPile, makeCutter, makePlug, makeMallet, makeTapeRoll, tapeMaterial, makeDish, makeHat } from './props.js';
import { SHAPE } from './shapes.js';
import { unlockAudio, sfx, voice, setMusic, setAmbience } from './audio.js';
import { buildGarden } from './garden.js';

const V3 = THREE.Vector3;
const TY = ROOM.tableY;

export function buildGame() {
  const q = new URLSearchParams(location.search);
  const S = buildStage();
  const G = { scene: -1, t: 0 };
  // ------------------------------------------------------------ timers / tweens
  const timers = [], tweens = [];
  const after = (s, fn) => timers.push({ t: s, fn });
  const tween = (dur, fn, done) => { const tw = { t: 0, dur, fn, done }; tweens.push(tw); fn(0); return tw; };
  const ease = (k) => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;

  // ------------------------------------------------------------ hero pumpkin
  const seed = 1 + Math.floor(Math.random() * 1000);
  const pk = new Pumpkin({ seed, R: 0.145 + Math.random() * 0.015 });
  pk.group.position.set(0.05, TY + 0.002, 0.06);
  E.scene.add(pk.group);
  const bottomY = pk.shape.bottomY();
  const pulp = new PulpMass(pk);
  pk.body.add(pulp.group);
  const lidHome = { pos: pk.lidPivot.position.clone(), rot: pk.lidPivot.rotation.clone() };

  // ------------------------------------------------------------ people
  const girl = new Person('girl');
  girl.root.position.set(-0.4, 0.2, -0.3); girl.root.rotation.y = 0.42;
  const papa = new Person('papa'); papa.root.position.set(0.7, -0.44, -0.62); papa.root.rotation.y = -0.55;
  const mama = new Person('mama'); mama.root.position.set(0.12, -0.4, -0.78); mama.root.rotation.y = -0.05;
  for (const p of [girl, papa, mama]) E.scene.add(p.root);
  girl.defaultExpr = 'smile'; papa.defaultExpr = 'smile'; mama.defaultExpr = 'smile';
  girl.setExpr('smile'); papa.setExpr('smile'); mama.setExpr('smile');
  const stool = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.2, 0.28), new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: 0.8 }));
  stool.position.set(-0.4, 0.1, -0.3); stool.castShadow = stool.receiveShadow = true; E.scene.add(stool);
  const chairM = new THREE.MeshStandardMaterial({ color: 0x6b4a32, roughness: 0.6 });
  const chairs = [[0.7, -0.62, -0.55], [0.12, -0.78, -0.05]].map(([x, z, ry]) => {
    const c = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.42), chairM); seat.position.y = 0.45; c.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.5, 0.03), chairM); back.position.set(0, 0.72, -0.2); c.add(back);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.45, 0.035), chairM); l.position.set(sx * 0.19, 0.225, sz * 0.18); c.add(l); }
    c.traverse((o) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
    c.position.set(x, 0, z - 0.06); c.rotation.y = ry; E.scene.add(c); return c;
  });
  const people = [girl, papa, mama];
  const headPos = (p) => { const v = new V3(); p.head.getWorldPosition(v); return v; };

  // ------------------------------------------------------------ props
  const bowl = makeBowl(); bowl.position.set(0.46, TY, -0.06); E.scene.add(bowl);
  const pile = new SeedPile(); pile.group.position.set(0.46, TY, -0.06); E.scene.add(pile.group);
  const spoon = makeSpoon(); E.scene.add(spoon);
  const spoonRest = () => { spoon.position.set(0.24, TY + 0.006, 0.24); spoon.rotation.set(0, -0.9, 0); };
  spoonRest();
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.012, 0.14), new THREE.MeshStandardMaterial({ color: 0x7a5a3c, roughness: 0.7 }));
  tray.position.set(0.42, TY + 0.006, 0.3); tray.castShadow = tray.receiveShadow = true; tray.visible = false; E.scene.add(tray);
  const cutterDefs = [[SHAPE.STAR, 0.021], [SHAPE.CIRCLE, 0.014], [SHAPE.HEART, 0.02], [SHAPE.SMILE, 0.034]];
  const homeQ = (i) => new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0.3 * (i - 1.5)));
  const cutters = cutterDefs.map(([t, s], i) => {
    const c = makeCutter(t, s, i);
    c.userData.home = new V3(0.29 + i * 0.085, TY + 0.012, 0.3);
    c.userData.resting = true;
    c.position.copy(c.userData.home); c.quaternion.copy(homeQ(i)); c.visible = false;
    E.scene.add(c); return c;
  });
  const bigCutter = makeCutter(SHAPE.BIG, 0.052, 4); bigCutter.visible = false; E.scene.add(bigCutter);
  const mallet = makeMallet(); E.scene.add(mallet);
  const malletRest = () => { mallet.position.set(0.1, TY + 0.012, 0.38); mallet.rotation.set(0, 0.4, Math.PI / 2); };
  malletRest(); mallet.visible = false;
  const tapeRoll = makeTapeRoll(); tapeRoll.position.set(-0.16, TY + 0.012, 0.36); tapeRoll.visible = false; E.scene.add(tapeRoll);
  const dish = makeDish(); dish.position.set(-0.36, TY, 0.2); E.scene.add(dish);
  const candle = new Candle({ shadow: true, intensity: 4.5, shadowSize: E.mobile ? 512 : 768 });
  candle.group.position.set(-0.36, TY + 0.005, 0.2); E.scene.add(candle.group);
  // warm bounce from the lantern (light escaping the holes onto nearby faces)
  const bounce = new THREE.PointLight(0xffa24a, 0, 3.5, 2); bounce.position.set(0, 0.42, 0.1); pk.group.add(bounce);
  const hats = [0, 1, 2].map((k) => {
    const h = makeHat(k, girl.cfg);
    h.position.set(-0.66 + k * 0.25, TY + (k === 2 ? 0.0 : 0.035), 0.12 + (k === 1 ? 0.06 : 0));
    h.rotation.set(k === 1 ? -0.2 : 0, 0.3 * k, 0);
    E.scene.add(h); return h;
  });
  // particles (seeds / crumbs)
  const parts = [];
  const crumbGeo = new THREE.IcosahedronGeometry(0.004, 0);
  const crumbMat = new THREE.MeshStandardMaterial({ color: 0xf0a040, roughness: 0.5 });
  const seedGeo = seedGeometry(), seedMat = seedMaterial();
  const burst = (pos, n, kind, dir) => {
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(kind === 'seed' ? seedGeo : crumbGeo, kind === 'seed' ? seedMat : crumbMat);
      m.position.copy(pos); m.scale.setScalar(0.5 + Math.random() * 0.9);
      m.castShadow = true; E.scene.add(m);
      const v = new V3((Math.random() - 0.5) * 0.8, 0.5 + Math.random() * 0.8, (Math.random() - 0.5) * 0.8);
      if (dir) v.addScaledVector(dir, 0.8);
      parts.push({ m, v, life: 2.5 + Math.random(), spin: new V3(Math.random() * 9, Math.random() * 9, Math.random() * 9) });
    }
  };
  const plugs = [];

  // ------------------------------------------------------------ hints
  const handEl = document.getElementById('hand'), ringEl = document.getElementById('ring');
  let hintTargets = [];
  let idle = 0;
  const glowMats = new Map();
  const setGlow = (obj, k) => {
    if (!obj) return;
    if (obj.common && obj.common.uHint) { obj.common.uHint.value = k; return; }
    obj.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        if (!m.emissive) continue;
        if (!glowMats.has(m)) glowMats.set(m, m.emissive.clone());
        m.emissive.copy(glowMats.get(m)).add(new THREE.Color(1.0, 0.72, 0.35).multiplyScalar(k * 0.07 / (E.post.exposure * E.post.exposure)));
      }
    });
  };
  const hints = (list) => { for (const h of hintTargets) setGlow(h.obj, 0); hintTargets = list; idle = 0; };
  const hintPos = (h) => (typeof h.pos === 'function' ? h.pos() : h.pos);

  // ------------------------------------------------------------ shots
  const shots = {
    0: { look: new V3(-0.3, 1.0, -0.02), dir: new V3(0.12, 0.16, 1), w: 1.05, h: 0.78, pw: 0.78, ph: 1.2 },
    1: { look: new V3(-0.1, 0.97, -0.1), dir: new V3(-0.04, 0.55, 1), w: 0.95, h: 0.6, pw: 0.62, ph: 1.08 },
    2: { look: new V3(0.04, 1.02, -0.2), dir: new V3(0.05, 0.2, 1), w: 1.45, h: 0.85, pw: 0.88, ph: 1.4 },
    3: { look: new V3(-0.15, 1.22, -0.75), dir: new V3(0.5, 0.1, 1), w: 2.7, h: 1.55, pw: 1.55, ph: 2.6 },
  };
  const shot = (k, speed) => { E.camSpeed = speed || 1.4; applyShot(shots[k]); };

  // ------------------------------------------------------------ helpers
  const toBody = (w) => pk.body.worldToLocal(w.clone());
  const toWorld = (b) => pk.body.localToWorld(b.clone());
  const bodyQ = () => pk.body.getWorldQuaternion(new THREE.Quaternion());
  const outerMeshes = () => pk.meshes.filter((m) => m.userData.part.lid === 1 && m.material.customProgramCacheKey() === 'pkskin' && m.visible);
  const hitPumpkin = () => { const hits = pick(outerMeshes()); return hits.length ? hits[0] : null; };
  const scl = () => Math.max(1, Math.min(E.w, E.h) / 500);
  const near = (obj, px = 70) => {
    const p = new V3(); obj.getWorldPosition(p); const s = toScreen(p);
    return Math.hypot(s.x - ptr.x, s.y - ptr.y) < px * scl();
  };
  const contains = (root, o) => { let f = false; root.traverse((x) => { if (x === o) f = true; }); return f; };
  const flyTo = (obj, toPos, toQuat, dur, done, arc = 0.15) => {
    const p0 = obj.position.clone(), q0 = obj.quaternion.clone();
    tween(dur, (k) => {
      const e = ease(k);
      obj.position.lerpVectors(p0, toPos, e); obj.position.y += Math.sin(Math.PI * k) * arc;
      if (toQuat) obj.quaternion.slerpQuaternions(q0, toQuat, e);
    }, done);
  };
  const stampQuat = (st) => {
    const X = new V3().crossVectors(st.up, st.n);
    return bodyQ().multiply(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, st.up, st.n)));
  };

  // ============================================================ SCENE 0: choose a hat
  let hatChosen = -1;
  function scene0() {
    G.scene = 0;
    applyShot(shots[0], true);
    hints(hats.map((h) => ({ obj: h, pos: () => h.getWorldPosition(new V3()) })));
  }
  function chooseHat(i) {
    if (hatChosen >= 0) return;
    hatChosen = i; hints([]);
    const h = hats[i];
    sfx.whoosh(); girl.setExpr('wow', 0.6);
    girl.reach('L', h.getWorldPosition(new V3()));
    const head = girl.head;
    head.updateMatrixWorld(true);
    const off = h.userData.offset.clone();
    const target = head.localToWorld(off.clone());
    const hq = head.getWorldQuaternion(new THREE.Quaternion());
    flyTo(h, target, hq, 0.8, () => {
      head.attach(h); h.position.copy(off); h.quaternion.identity();
      sfx.sparkle(); girl.talk = voice('girl', 'giggle'); girl.setExpr('grin', 1.6);
      mama.setExpr('grin', 1.5); papa.setExpr('grin', 1.5); voice('mama', 'yay');
      girl.reach('L', null);
      for (let k = 0; k < 3; k++) if (k !== i) { const o = hats[k]; flyTo(o, new V3(-1.6, 0.6, -1.2 + k * 0.2), null, 0.9, () => { o.visible = false; }, 0.3); }
      after(1.8, scene1);
    }, 0.3);
  }

  // ============================================================ SCENE 1: open the lid, scoop
  let lidOpen = false, scooping = false, spoonHeld = false, load = 0, scoopsDone = 0, lastScr = 0;
  const scoopTip = new V3();
  function scene1() {
    G.scene = 1; shot(1);
    girl.lookAt(toWorld(new V3(0, 0.1, 0)));
    hints([{ obj: pk.stem, pos: () => pk.stem.getWorldPosition(new V3()) }]);
  }
  function openLid() {
    if (lidOpen) return;
    lidOpen = true; hints([]);
    sfx.lid(); girl.setExpr('wow', 0.8); girl.talk = voice('girl', 'ooh');
    const p0 = pk.lidPivot.position.clone();
    const to = new V3(-0.24, bottomY - pk.lidCenter.y + 0.0, 0.2);
    tween(1.3, (k) => {
      const e = ease(k);
      pk.lidPivot.position.lerpVectors(p0, to, e); pk.lidPivot.position.y += Math.sin(Math.PI * Math.min(1, k * 1.2)) * 0.12;
      pk.lidPivot.rotation.set(0, e * 0.6, e * 0.12);
      girl.reach('L', pk.stem.getWorldPosition(new V3()));
    }, () => {
      girl.reach('L', null); girl.setExpr('grin', 1.2); girl.talk = voice('girl', 'yay');
      hints([{ obj: pk, pos: openingCenter }, { obj: spoon, pos: () => spoon.getWorldPosition(new V3()) }]);
    });
  }
  const openingCenter = () => toWorld(new V3(0, pk.lidCenter.y - 0.01, 0));
  const openingScreen = () => {
    const c = toScreen(openingCenter());
    let r = 30;
    for (const u of [0, 0.25, 0.5, 0.75]) { const rim = new V3(); pk.shape.P(u, pk.lidV, rim); const s = toScreen(toWorld(rim)); r = Math.max(r, Math.hypot(s.x - c.x, s.y - c.y)); }
    return { x: c.x, y: c.y, r };
  };
  function scoopDir() {
    const o = openingScreen();
    const dx = (ptr.x - o.x) / o.r, dy = (ptr.y - o.y) / o.r;
    const right = new V3().setFromMatrixColumn(E.camera.matrixWorld, 0); right.y = 0; right.normalize();
    const fwd = new V3().crossVectors(right, new V3(0, 1, 0)).normalize(); // toward the camera
    const h = right.multiplyScalar(dx).addScaledVector(fwd, dy);
    const rr = Math.min(1.25, h.length());
    if (h.lengthSq() < 1e-6) h.set(0, 0, 1); h.normalize();
    const phi = 0.35 + rr * 1.1;
    const dw = h.multiplyScalar(Math.sin(phi)).add(new V3(0, -Math.cos(phi), 0)).normalize();
    return dw.applyQuaternion(bodyQ().invert());
  }
  function holdSpoon() {
    if (spoonHeld) return; spoonHeld = true; sfx.tap();
    hints([{ obj: pk, pos: openingCenter }]);
  }
  function poseSpoon() {
    const top = openingCenter().add(new V3(-0.03, 0.07, -0.04));
    spoon.position.copy(scoopTip);
    const dir = top.clone().sub(scoopTip).normalize();
    spoon.quaternion.setFromUnitVectors(new V3(0, 0.15, 1).normalize(), dir);
    spoon.position.addScaledVector(dir, 0.045);
    girl.reach('L', spoon.localToWorld(new V3(0, 0.024, 0.15)));
  }
  function updateSpoon(dt) {
    if (!spoonHeld || !scooping) return;
    const d = scoopDir();
    const u = ((Math.atan2(d.z, d.x) / (Math.PI * 2)) + 1) % 1, v = Math.acos(THREE.MathUtils.clamp(d.y, -1, 1)) / Math.PI;
    const wp = new V3(); pk.shape.P(u, Math.max(v, pk.lidV + 0.04), wp);
    const wall = wp.length() * pk.inner;
    scoopTip.lerp(toWorld(d.clone().multiplyScalar(wall * 0.86)), 1 - Math.exp(-dt * 14));
    const mv = Math.hypot(ptr.x - G.lx, ptr.y - G.ly); G.lx = ptr.x; G.ly = ptr.y;
    const str = Math.min(0.5, 0.03 + mv * 0.005);
    if (mv > 0.5 || Math.random() < 0.15) {
      pk.scrape(u, v, 0.1, str * 1.1);
      const removed = pulp.scoop(d, 0.72, str * 1.0);
      load += removed;
      if (E.t - lastScr > 0.09 && mv > 1) { lastScr = E.t; sfx.scrape(); }
      if (removed > 0.0005 && Math.random() < 0.2) sfx.squish();
    }
    poseSpoon();
    girl.lookAt(scoopTip);
  }
  function endScoop() {
    scooping = false;
    if (load > 0.003) {
      scoopsDone++;
      const amount = load; load = 0;
      const clump = new THREE.Mesh(new THREE.IcosahedronGeometry(0.012 + Math.min(0.016, amount * 0.25), 2), pulp.mesh.material);
      clump.castShadow = true; clump.scale.set(1, 0.7, 1.2);
      clump.position.copy(spoon.localToWorld(new V3(0, 0.008, -0.03))); E.scene.add(clump);
      const bowlTop = pile.group.position.clone().add(new V3((Math.random() - 0.5) * 0.04, 0.12, 0.02));
      const s0 = spoon.position.clone(), q0 = spoon.quaternion.clone();
      const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.5, -1.3, 0));
      sfx.whoosh();
      tween(0.7, (k) => {
        const e = ease(k);
        spoon.position.lerpVectors(s0, bowlTop, e); spoon.position.y += Math.sin(Math.PI * k) * 0.12;
        spoon.quaternion.slerpQuaternions(q0, qEnd, e);
        clump.position.copy(spoon.localToWorld(new V3(0, 0.01, -0.03)));
        girl.reach('L', spoon.localToWorld(new V3(0, 0.024, 0.15)));
        girl.lookAt(spoon.position);
      }, () => {
        const c0 = clump.position.clone();
        tween(0.3, (k) => { clump.position.lerpVectors(c0, pile.group.position.clone().add(new V3(0, 0.03, 0)), k); clump.scale.multiplyScalar(0.97); }, () => {
          E.scene.remove(clump);
          pile.add(amount * 1.4, 4 + Math.floor(amount * 500));
          sfx.plop();
          burst(pile.group.position.clone().add(new V3(0, 0.05, 0)), 3, 'seed');
          if (scoopsDone % 2 === 1) { girl.talk = voice('girl', 'giggle'); girl.setExpr('grin', 1); } else girl.setExpr('smile');
          checkScoopDone();
        });
      });
    } else girl.setExpr('focus', 0.6);
  }
  function checkScoopDone() {
    const clean = pk.cleanFraction(), rem = pulp.remaining();
    if (clean > 0.62 && rem < 0.2 && G.scene === 1 && !G.s1done) {
      G.s1done = true; hints([]);
      tween(0.8, () => { for (let i = 0; i < pulp.n; i++) pulp.amt[i] *= 0.9; pulp.refresh(); });
      after(0.9, () => { pk.scrape(0.5, 0.6, 2, 0.5); });
      after(0.6, () => {
        sfx.chime(); girl.setExpr('proud', 2); girl.talk = voice('girl', 'yay'); mama.setExpr('grin', 2); papa.setExpr('grin', 2); voice('papa', 'laugh');
        spoonHeld = false; flyTo(spoon, new V3(0.62, TY + 0.006, 0.14), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -1.4, 0)), 0.7); girl.reach('L', null);
      });
      after(2.6, scene2);
    }
  }

  // ============================================================ SCENE 2: punch shapes with cutters
  let sel = 0, stampCur = null, pressT = 0, papaDone = false, tapes = 0, crackOpen = 0, gagBusy = false, girlHoles = 0, hammering = false;
  const tapeStrips = [];
  const readyPos = () => new V3(-0.12, TY + 0.17, 0.24);
  const readyQ = () => new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.3, 0.6, 0));
  function scene2() {
    G.scene = 2; shot(2);
    tray.visible = true; for (const c of cutters) c.visible = true; mallet.visible = true;
    selectCutter(0, true);
    girl.lookAt(pk.group.position.clone().add(new V3(0, 0.15, 0.1)));
    updateCarveHints();
  }
  function selectCutter(i, quiet) {
    sel = i; stampCur = null;
    cutters.forEach((c, k) => {
      if (k !== i && !c.userData.resting) { c.userData.resting = true; flyTo(c, c.userData.home, homeQ(k), 0.4); }
    });
    const c = cutters[i]; c.userData.resting = false;
    flyTo(c, readyPos(), readyQ(), 0.45);
    if (!quiet) { sfx.tap(); girl.setExpr('smile'); girl.lookAt(c.userData.home); }
  }
  function placeCutterOn(st) {
    const c = cutters[sel];
    c.position.copy(toWorld(st.p.clone().addScaledVector(st.n, 0.002 - st.depth * 0.018)));
    c.quaternion.copy(stampQuat(st));
  }
  function malletHit(st) {
    if (hammering) return; hammering = true;
    const nW = st.n.clone().applyQuaternion(bodyQ());
    const cap = () => toWorld(st.p.clone().addScaledVector(st.n, 0.036 - st.depth * 0.018));
    const raised = cap().addScaledVector(nW, 0.09).add(new V3(-0.03, 0.08, 0));
    mallet.visible = true;
    // orient: handle along +y local; head axis local x. Point the head face at the cap.
    const orientTo = (headPos) => {
      const toCap = cap().sub(headPos).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(new V3(1, 0, 0), toCap);
      mallet.quaternion.copy(q);
      mallet.position.copy(headPos).sub(new V3(0, 0.205, 0).applyQuaternion(q));
      girl.reach('L', mallet.localToWorld(new V3(0, 0.05, 0)));
    };
    const strike = cap().addScaledVector(nW, 0.045);
    tween(0.14, (k) => orientTo(raised.clone().lerp(strike, k * k)), () => {
      sfx.tap();
      st.depth = Math.min(1, st.depth + 0.34); if (st.depth > 0.99) st.depth = 1;
      pk.syncStamps(); placeCutterOn(st);
      burst(cap(), 2, 'crumb', nW);
      if (st.depth >= 1) punched(st);
      tween(0.16, (k) => orientTo(strike.clone().lerp(raised, k)), () => { hammering = false; });
    });
  }
  function punched(st, who) {
    sfx.pop();
    const plug = makePlug(st.type, st.size, 0.02);
    plug.quaternion.copy(stampQuat(st));
    plug.position.copy(toWorld(st.p));
    E.scene.add(plug);
    const nW = st.n.clone().applyQuaternion(bodyQ());
    plugs.push({ m: plug, v: nW.clone().multiplyScalar(0.6).add(new V3((Math.random() - 0.5) * 0.2, 0.9, 0.2)), w: new V3(Math.random() * 6, Math.random() * 6, Math.random() * 6), rest: false });
    burst(toWorld(st.p), 6, 'crumb', nW);
    stampCur = null;
    if (who !== 'papa') {
      girlHoles++;
      const r = girlHoles % 3;
      girl.setExpr(r === 1 ? 'wow' : 'grin', 1.2); girl.talk = voice('girl', r === 1 ? 'wow' : 'yay');
      papa.setExpr('grin', 1); mama.setExpr('smile');
      after(0.5, () => { if (!stampCur && G.scene === 2) flyTo(cutters[sel], readyPos(), readyQ(), 0.35); });
      if (girlHoles === 2 && !papaDone && G.scene === 2) after(1.0, papaGag);
      if (G.scene === 2) updateCarveHints();
    }
  }
  function tapPumpkinCarve(hit) {
    if (gagBusy || hammering) return;
    const pb = toBody(hit.point);
    const [u, v] = pk.objectToUV(pb);
    if (v < pk.lidV + 0.07 || v > 0.86) { girl.setExpr('huh', 0.8); return; }
    const f = pk.frameAt(u, v);
    const type = cutterDefs[sel][0], size = cutterDefs[sel][1];
    let st = null;
    for (const s of pk.stamps) if (s.depth < 1 && s.type === type && s.p.distanceTo(f.p) < size * 1.2) st = s;
    if (!st) {
      for (const s of pk.stamps) if (s.depth >= 1 && s.p.distanceTo(f.p) < s.size * 0.7) return;
      st = pk.addStamp(f.p, f.n, f.up, type, size, (Math.random() - 0.5) * 0.25);
    }
    stampCur = st;
    placeCutterOn(st);
    cutters[sel].visible = true;
    girl.lookAt(hit.point);
    malletHit(st);
    pressT = 0;
  }
  function updateCarveHints() {
    if (G.scene !== 2) return;
    if (pk.cracked && tapes < 3) { hints([{ obj: tapeRoll, pos: () => tapeRoll.getWorldPosition(new V3()) }, { obj: pk, pos: () => toWorld(crackPoint(0.35 + tapes * 0.15)) }].reverse()); return; }
    if (papaDone && tapes >= 3 && girlHoles >= 4) { hints([{ obj: candle.group, pos: () => candle.group.getWorldPosition(new V3()).add(new V3(0, 0.06, 0)) }]); return; }
    const spots = [[0.2, 0.42], [0.3, 0.42], [0.25, 0.62], [0.15, 0.55], [0.35, 0.55], [0.25, 0.5]];
    const free = spots.find(([u, v]) => !pk.stamps.some((s) => s.p.distanceTo(pk.frameAt(u, v).p) < 0.035));
    const [fu, fv] = free || [0.25, 0.5];
    hints([{ obj: pk, pos: () => toWorld(pk.frameAt(fu, fv).p) }, { obj: cutters[(sel + 1) % 4], pos: () => cutters[(sel + 1) % 4].getWorldPosition(new V3()) }]);
  }
  const crackN = new V3(1, 0, 0);
  const crackPoint = (v) => { const p = new V3(); pk.shape.P(0.25, v, p); return p.add(new V3(0, 0, 0.004)); };
  function papaGag() {
    if (papaDone) return; papaDone = true; gagBusy = true;
    hints([]);
    papa.setExpr('proud'); papa.talk = voice('papa', 'hm'); papa.leanT = 0.3;
    papa.lookAt(pk.group.position.clone().add(new V3(0, 0.15, 0)));
    girl.setExpr('huh'); girl.lookAt(headPos(papa));
    const f = pk.frameAt(0.75, 0.48);
    const st = pk.addStamp(f.p, f.n, f.up, SHAPE.BIG, 0.052, 0);
    bigCutter.visible = true;
    bigCutter.quaternion.copy(stampQuat(st));
    const capW = () => toWorld(st.p.clone().addScaledVector(st.n, 0.04 - st.depth * 0.018));
    bigCutter.position.copy(toWorld(f.p.clone().addScaledVector(f.n, 0.002)));
    let hit = 0;
    const slam = () => {
      papa.reach('R', capW().add(new V3(0, 0.1, -0.06)));
      after(0.35, () => {
        papa.reach('R', capW().add(new V3(0, 0.01, -0.03)));
        sfx.bonk(); hit++;
        st.depth = Math.min(0.95, st.depth + 0.33); pk.syncStamps();
        bigCutter.position.copy(toWorld(st.p.clone().addScaledVector(st.n, 0.002 - st.depth * 0.018)));
        pk.group.position.y = TY - 0.003; after(0.08, () => { pk.group.position.y = TY + 0.002; });
        girl.setExpr(hit < 3 ? 'huh' : 'wow');
        if (hit < 3) after(0.45, slam); else after(0.25, crack);
      });
    };
    after(0.7, slam);
    function crack() {
      sfx.crack();
      st.depth = 1; pk.syncStamps();
      punched(st, 'papa');
      bigCutter.visible = false; papa.reach('R', null); papa.leanT = 0;
      pk.setCrack(true, crackN);
      crackOpen = 0.001;
      papa.setExpr('oops', 3.5); papa.talk = voice('papa', 'oops');
      girl.setExpr('wow', 1.4); girl.talk = voice('girl', 'wow');
      mama.setExpr('wow', 1.2); after(0.4, () => { mama.talk = voice('mama', 'huh'); });
      burst(pk.group.position.clone().add(new V3(0, 0.2, 0)), 10, 'crumb');
      after(1.6, () => {
        gagBusy = false; tapeRoll.visible = true;
        girl.setExpr('focus'); girl.lookAt(pk.group.position);
        mama.setExpr('smile'); updateCarveHints();
      });
    }
  }
  function applyTape(hit) {
    const pb = toBody(hit.point);
    const [, v0] = pk.objectToUV(pb);
    const v = THREE.MathUtils.clamp(v0, pk.lidV + 0.08, 0.82);
    const side = pb.z >= 0 ? 0.25 : 0.75;
    const f = pk.frameAt(side, v);
    const across = crackN.clone().addScaledVector(f.n, -crackN.dot(f.n)).normalize();
    const along = new V3().crossVectors(f.n, across).normalize();
    const L = 0.075, Wd = 0.024, NL = 14;
    const geo = new THREE.PlaneGeometry(1, 1, NL, 2);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) * L, y = p.getY(i) * Wd;
      const guess = f.p.clone().addScaledVector(across, x).addScaledVector(along, y);
      const [uu, vv] = pk.objectToUV(guess);
      const fr = pk.frameAt(uu, vv);
      const s = fr.p.addScaledVector(fr.n, 0.0018 + Math.abs(x) * 0.002);
      p.setXYZ(i, s.x, s.y, s.z);
    }
    geo.computeVertexNormals();
    const strip = new THREE.Mesh(geo, tapeMaterial());
    strip.castShadow = true; strip.receiveShadow = true; strip.layers.enable(2);
    pk.body.add(strip); tapeStrips.push(strip);
    sfx.tape(); tapes++;
    girl.reach('L', hit.point); after(0.6, () => girl.reach('L', null));
    girl.setExpr('focus', 0.6);
    if (tapes >= 3) {
      after(0.5, () => {
        sfx.chime(); girl.setExpr('proud', 2.2); girl.talk = voice('girl', 'yay');
        papa.setExpr('grin', 2); papa.talk = voice('papa', 'laugh'); mama.setExpr('grin', 2);
        updateCarveHints();
      });
    } else updateCarveHints();
  }

  // ============================================================ SCENE 3: candle, lights off, play
  let candleIn = false, handing = false, lightsOff = false, doorReady = false;
  const candleHint = () => [{ obj: candle.group, pos: () => candle.group.getWorldPosition(new V3()).add(new V3(0, 0.06, 0)) }];
  function scene3() {
    G.scene = 3; hints([]);
    tray.visible = false; tapeRoll.visible = false;
    cutters.forEach((c, k) => { if (k !== sel) c.visible = false; else { c.userData.resting = false; flyTo(c, readyPos(), readyQ(), 0.4); } });
    shot(2);
    mama.setExpr('smile'); mama.leanT = 0.15;
    mama.reach('R', new V3(-0.02, TY + 0.22, -0.42));
    mama.lookAt(candle.group.position);
    mama.talk = voice('mama', 'hm');
    spoon.visible = true; mallet.visible = true; malletRest(); spoonRest();
    hints(candleHint());
  }
  function handTo(obj, isCandle) {
    if (handing) return; handing = true; hints([]);
    sfx.whoosh();
    const handP = () => mama.arms.R.hand.localToWorld(new V3(0, 0.07, -0.03));
    const p0 = obj.position.clone(), q0 = obj.quaternion.clone();
    mama.lookAt(obj.position);
    tween(0.7, (k) => { const e = ease(k); obj.position.lerpVectors(p0, handP(), e); obj.position.y += Math.sin(Math.PI * k) * 0.1; }, () => {
      if (!isCandle) {
        mama.setExpr('huh', 1.4); mama.talk = voice('mama', 'huh'); girl.setExpr('huh', 1);
        after(1.3, () => {
          mama.setExpr('grin', 1.2); mama.talk = voice('mama', 'laugh'); girl.setExpr('grin', 1); girl.talk = voice('girl', 'giggle');
          const h = obj.position.clone();
          tween(0.6, (k) => { obj.position.lerpVectors(h, p0, ease(k)); obj.position.y += Math.sin(Math.PI * k) * 0.08; obj.quaternion.copy(q0); }, () => {
            handing = false; hints(candleHint());
          });
        });
        return;
      }
      mama.setExpr('grin', 1.5); voice('mama', 'yay');
      after(0.5, () => { sfx.strike(); candle.setLit(true); sfx.flame(); girl.setExpr('wow', 1); girl.talk = voice('girl', 'ooh'); });
      after(1.4, () => {
        const target = toWorld(new V3(0, bottomY * pk.inner + 0.012, 0));
        const c0 = candle.group.position.clone();
        tween(1.0, (k) => { const e = ease(k); candle.group.position.lerpVectors(c0, target, e); candle.group.position.y += Math.sin(Math.PI * k) * 0.2; mama.reach('R', candle.group.position.clone().add(new V3(0, 0.03, -0.03))); }, () => {
          pk.body.attach(candle.group); candleIn = true; mama.reach('R', null); mama.leanT = 0;
          const lp = pk.lidPivot.position.clone(), lr = pk.lidPivot.rotation.clone();
          sfx.lid();
          tween(1.0, (k) => { const e = ease(k); pk.lidPivot.position.lerpVectors(lp, lidHome.pos, e); pk.lidPivot.position.y += Math.sin(Math.PI * k) * 0.1; pk.lidPivot.rotation.set(lr.x * (1 - e), lr.y * (1 - e), lr.z * (1 - e)); }, () => {
            dish.visible = false;
            shot(3);
            hints([{ obj: S.room.sw, pos: () => S.room.sw.getWorldPosition(new V3()) }]);
          });
        });
      });
    });
  }
  function toggleLights() {
    sfx.click();
    lightsOff = !lightsOff;
    S.room.rocker.rotation.x = lightsOff ? 0.25 : 0;
    S.darkTarget = lightsOff ? 1 : 0;
    E.post.exposureT = lightsOff ? 2.4 : 1.0;
    setMusic(lightsOff ? 0.06 : 0.12); setAmbience(lightsOff ? 0.35 : 0);
    if (lightsOff && !G.parentsMoved) {
      G.parentsMoved = true;
      const pp0 = papa.root.position.clone(), mp0 = mama.root.position.clone();
      const pr0 = papa.root.rotation.y, mr0 = mama.root.rotation.y;
      after(1.2, () => tween(1.6, (k) => {
        const e = ease(k);
        papa.root.position.lerpVectors(pp0, new V3(1.3, 0, -0.75), e); papa.root.rotation.y = pr0 + (-0.9 - pr0) * e;
        mama.root.position.lerpVectors(mp0, new V3(-1.15, 0, -0.85), e); mama.root.rotation.y = mr0 + (0.75 - mr0) * e;
        papa.bob = mama.bob = Math.abs(Math.sin(k * Math.PI * 4)) * 0.01;
      }));
    }
    if (lightsOff) {
      girl.setExpr('wow', 1.5); girl.talk = voice('girl', 'wow'); papa.setExpr('wow', 1.2); mama.setExpr('wow', 1.2);
      after(1.0, () => { mama.talk = voice('mama', 'ooh'); });
      after(1.6, () => { girl.setExpr('grin', 2); girl.talk = voice('girl', 'giggle'); });
      if (!G.firstDark) { G.firstDark = true; hints([{ obj: pk, pos: () => pk.group.position.clone().add(new V3(0, 0.15, 0)) }]); }
      after(7, () => { if (lightsOff && !doorReady) { doorReady = true; hints([{ obj: S.room.door, pos: () => S.room.door.localToWorld(new V3(0, 1.2, 0)) }]); } });
    } else girl.setExpr('smile');
  }

  // ============================================================ SCENE 4: garden path
  let garden = null;
  function toGarden() {
    if (G.scene === 4) return;
    G.scene = 4; hints([]);
    sfx.whoosh();
    const veil = document.getElementById('veil');
    veil.classList.remove('off');
    after(1.0, () => {
      S.room.group.visible = false; S.hide = true;
      for (const l of Object.values(S.lights)) { if (Array.isArray(l)) l.forEach((c) => { c.group.visible = false; c.light.intensity = 0; }); else l.visible = false; }
      for (const o of [bowl, pile.group, spoon, tray, mallet, tapeRoll, dish, stool, ...chairs, bigCutter, ...cutters, ...plugs.map((p) => p.m)]) o.visible = false;
      garden = buildGarden({ E, pk, candle, girl, papa, mama, sfx, voice, hints, after, tween, burst });
      setAmbience(0.5); setMusic(0.1);
      const done = () => after(0.3, () => veil.classList.add('off'));
      try { E.renderer.compileAsync(E.scene, E.camera).then(done, done); } catch (_) { done(); }
    });
  }

  // ------------------------------------------------------------ input
  let downInfo = null;
  onPointer((type) => {
    unlockAudio();
    if (!G.musicOn) { G.musicOn = true; setMusic(0.12); }
    idle = 0; handEl.classList.remove('on'); ringEl.classList.remove('on');
    if (G.scene === 4) { if (garden) garden.pointer(type, ptr); return; }
    if (type === 'down') {
      downInfo = { x: ptr.x, y: ptr.y, px: ptr.x, t: E.t, moved: 0, rotate: false };
      if (G.scene === 0) {
        let best = -1, bd = 1e9;
        hats.forEach((h, i) => { const s = toScreen(h.getWorldPosition(new V3())); const d = Math.hypot(s.x - ptr.x, s.y - ptr.y); if (d < bd) { bd = d; best = i; } });
        const hit = pick(hats);
        if (hit.length) best = hats.findIndex((h) => contains(h, hit[0].object));
        if (best >= 0 && (hit.length || bd < 90 * scl())) chooseHat(best);
        else girl.setExpr('smile');
      } else if (G.scene === 1) {
        if (!lidOpen) { if (hitPumpkin() || near(pk.stem, 90)) openLid(); return; }
        if (G.s1done) return;
        if (!spoonHeld && (pick([spoon]).length || near(spoon, 60))) { holdSpoon(); return; }
        const o = openingScreen();
        if (Math.hypot(ptr.x - o.x, ptr.y - o.y) < o.r * 2.4) {
          if (!spoonHeld) holdSpoon();
          scooping = true; G.lx = ptr.x; G.ly = ptr.y; load = 0;
          const d = scoopDir(); scoopTip.copy(toWorld(d.multiplyScalar(0.06)));
          girl.setExpr('focus');
        }
      } else if (G.scene === 2) {
        if (gagBusy) return;
        for (let i = 0; i < cutters.length; i++) if (pick([cutters[i]]).length || (cutters[i].userData.resting && near(cutters[i], 36))) { selectCutter(i); return; }
        if (tapeRoll.visible && tapes < 3 && (pick([tapeRoll]).length || near(tapeRoll, 50))) { girl.setExpr('smile'); sfx.tap(); return; }
        if (papaDone && tapes >= 3 && girlHoles >= 3 && (pick([candle.group]).length || near(candle.group, 55))) { scene3(); return; }
        const h = hitPumpkin();
        if (h) { if (pk.cracked && tapes < 3) applyTape(h); else tapPumpkinCarve(h); }
      } else if (G.scene === 3) {
        if (!candleIn) {
          if (handing) return;
          if (pick([candle.group]).length || near(candle.group, 50)) { handTo(candle.group, true); return; }
          if (pick([spoon]).length || near(spoon, 50)) { handTo(spoon, false); return; }
          if (pick([mallet]).length || near(mallet, 50)) { handTo(mallet, false); return; }
          return;
        }
        if (pick([S.room.sw]).length || near(S.room.sw, 55)) { toggleLights(); return; }
        if (doorReady && pick([S.room.door]).length) { toGarden(); return; }
        downInfo.rotate = true;
        downInfo.hit = hitPumpkin();
      }
    } else if (type === 'move') {
      if (!downInfo) return;
      const dx = ptr.x - downInfo.px; downInfo.px = ptr.x;
      downInfo.moved += Math.abs(dx);
      if (G.scene === 3 && downInfo.rotate && downInfo.moved > 10) { pk.body.rotation.y += dx * 0.012; G.userSpun = E.t; }
    } else if (type === 'up') {
      if (G.scene === 1 && scooping) endScoop();
      if (G.scene === 3 && downInfo && downInfo.rotate && downInfo.moved < 10) {
        if (downInfo.hit && lightsOff) tapPumpkinCarve(downInfo.hit);
        else if (doorReady && near(S.room.door, 140)) toGarden();
      }
      downInfo = null;
    }
  });

  // ------------------------------------------------------------ debug hooks for automated playtests
  G.target = () => { const h = hintTargets[0]; if (!h) return null; const s = toScreen(hintPos(h)); return { x: s.x, y: s.y, scene: G.scene }; };
  G.open = () => openingScreen();
  G.state = () => ({ lid: lidOpen, held: spoonHeld, scene: G.scene, clean: pk.cleanFraction(), rem: pulp.remaining(), holes: girlHoles, tapes, lightsOff, dpr: E.dpr });
  G.jump = (n) => {
    if (n >= 1) { hatChosen = 0; const h = hats[0]; girl.head.add(h); h.position.copy(h.userData.offset); h.rotation.set(0, 0, 0); hats[1].visible = hats[2].visible = false; }
    if (n >= 2) { lidOpen = true; pk.lidPivot.position.set(-0.24, bottomY - pk.lidCenter.y, 0.2); pk.lidPivot.rotation.set(0, 0.6, 0.12); pulp.amt.fill(0); pulp.refresh(); pk.scrape(0.5, 0.6, 2, 1); pile.add(0.08, 120); G.s1done = true; spoon.position.set(0.62, TY + 0.006, 0.14); }
    if (n >= 3) {
      papaDone = true; tapes = 3;
      const add = (u, v, t, s) => { const f = pk.frameAt(u, v); const st = pk.addStamp(f.p, f.n, f.up, t, s, 0); st.depth = 1; };
      add(0.2, 0.42, SHAPE.STAR, 0.021); add(0.3, 0.42, SHAPE.STAR, 0.021); add(0.25, 0.62, SHAPE.SMILE, 0.034); add(0.25, 0.5, SHAPE.CIRCLE, 0.014); add(0.75, 0.48, SHAPE.BIG, 0.052); add(0.05, 0.45, SHAPE.HEART, 0.02); add(0.45, 0.47, SHAPE.HEART, 0.02); add(0.62, 0.4, SHAPE.STAR, 0.021); add(0.88, 0.42, SHAPE.CIRCLE, 0.014);
      pk.syncStamps(); girlHoles = 6; pk.setCrack(true, crackN);
      for (const v of [0.4, 0.55, 0.7]) applyTape({ point: toWorld(crackPoint(v)) });
    }
    const f = [scene0, scene1, scene2, scene3][n]; if (f) f();
    if (n >= 3) applyShot(shots[2], true); else if (n >= 1) applyShot(shots[n], true);
    if (q.get('lit') && n >= 3) {
      handing = true;
      candle.setLit(true); candle.lit = 1;
      pk.body.attach(candle.group); candle.group.position.set(0, bottomY * pk.inner + 0.012, 0); candle.group.rotation.set(0, 0, 0); candleIn = true;
      pk.lidPivot.position.copy(lidHome.pos); pk.lidPivot.rotation.set(0, 0, 0); dish.visible = false; mama.reach('R', null);
      handing = false; applyShot(shots[3], true);
      if (q.get('dark')) { toggleLights(); S.dark = 1; E.post.exposure = 2.4; papa.root.position.set(1.3, 0, -0.75); papa.root.rotation.y = -0.9; mama.root.position.set(-1.15, 0, -0.85); mama.root.rotation.y = 0.75; }
      if (q.get('ry')) pk.body.rotation.y = +q.get('ry');
      if (q.get('nosh')) candle.light.castShadow = false;
      if (q.get('l0')) candle.light.shadow.camera.layers.enableAll();
      if (q.get('nopk')) for (const m of pk.meshes) m.castShadow = false;
    }
    if (q.get('garden') && n >= 3) { toGarden(); }
  };

  // ------------------------------------------------------------ update
  E.post.exposureT = 1.0;
  G.update = (dt, t) => {
    G.t = t;
    for (let i = timers.length - 1; i >= 0; i--) { timers[i].t -= dt; if (timers[i].t <= 0) { const f = timers[i].fn; timers.splice(i, 1); f(); } }
    for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt; const k = Math.min(1, tw.t / tw.dur); tw.fn(k); if (k >= 1) { tweens.splice(i, 1); if (tw.done) tw.done(); } }
    if (!S.hide) S.update(dt, t);
    candle.update(t, dt, E.camera);
    pk.common.uGlow.value = candle.lit * (candleIn ? 1 : 0) * (0.85 + 0.15 * candle.light.intensity / Math.max(0.01, candle.baseI));
    if (garden) garden.update(dt, t);
    E.post.exposure += (E.post.exposureT - E.post.exposure) * Math.min(1, dt * 1.5);
    bounce.intensity = candle.lit * (candleIn ? 1 : 0) * 0.5 * (0.9 + 0.1 * Math.sin(t * 9));
    E.post.bloom = lightsOff ? 0.12 : 0.22;
    E.post.grade = lightsOff && G.scene === 3 ? [1.0, 0.97, 1.03] : [1, 0.985, 0.975];
    // crack opening
    if (pk.cracked) {
      const target = tapes >= 3 ? 0 : 0.16 * (1 - tapes / 3);
      crackOpen += (target - crackOpen) * Math.min(1, dt * 4);
      for (let h = 0; h < 2; h++) {
        const s = h === 0 ? 1 : -1, ang = -s * crackOpen;
        const piv = new V3(s * 0.03, bottomY, 0);
        const half = pk.halves[h];
        half.rotation.z = ang;
        half.position.copy(piv).sub(piv.clone().applyAxisAngle(new V3(0, 0, 1), ang));
      }
      pk.U.uGap.value = 0.0012 + crackOpen * 0.01;
      for (const st of tapeStrips) st.visible = crackOpen < 0.03;
    }
    updateSpoon(dt);
    if (G.scene === 2 && ptr.down && stampCur && stampCur.depth < 1 && downInfo && E.t - downInfo.t > 0.35) {
      pressT += dt; if (pressT > 0.32) { pressT = 0; malletHit(stampCur); }
    }
    if (G.scene === 3 && lightsOff && (!G.userSpun || E.t - G.userSpun > 4) && !ptr.down) pk.body.rotation.y += Math.sin(t * 0.25) * dt * 0.35;
    for (const p of plugs) {
      if (p.rest) continue;
      p.v.y -= 9.8 * dt; p.m.position.addScaledVector(p.v, dt);
      p.m.rotation.x += p.w.x * dt; p.m.rotation.y += p.w.y * dt;
      const onTable = Math.abs(p.m.position.x) < 0.85 && Math.abs(p.m.position.z) < 0.47;
      const floorY = onTable ? TY + 0.012 : 0.012;
      if (p.m.position.y < floorY) {
        p.m.position.y = floorY; p.v.y *= -0.3; p.v.x *= 0.5; p.v.z *= 0.5; p.w.multiplyScalar(0.4);
        if (Math.abs(p.v.y) < 0.25) { p.rest = true; p.m.rotation.set(Math.random() < 0.5 ? -Math.PI / 2 : Math.PI / 2, 0, Math.random() * 6); }
      }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.life -= dt;
      p.v.y -= 9.8 * dt; p.m.position.addScaledVector(p.v, dt);
      p.m.rotation.x += p.spin.x * dt; p.m.rotation.y += p.spin.y * dt;
      const floorY = (Math.abs(p.m.position.x) < 0.85 && Math.abs(p.m.position.z) < 0.47) ? TY + 0.002 : 0.002;
      if (p.m.position.y < floorY) { p.m.position.y = floorY; p.v.set(0, 0, 0); p.spin.set(0, 0, 0); }
      if (p.life < 0) { E.scene.remove(p.m); parts.splice(i, 1); }
    }
    if (G.scene >= 0 && G.scene < 4) {
      const pc = pk.group.position.clone().add(new V3(0, 0.15, 0));
      if (!papa.armT.R && !gagBusy && !papa.exprHold) papa.lookAt(Math.sin(t * 0.3) > 0.2 ? headPos(girl) : pc);
      if (!handing && !mama.armT.R) mama.lookAt(Math.sin(t * 0.27 + 2) > 0.3 ? headPos(girl) : pc);
      if (G.scene === 3 && lightsOff) girl.lookAt(Math.sin(t * 0.2) > 0 ? new V3(-0.4, 1.4, -1.6) : pc);
      if (G.scene === 0 && hatChosen < 0) girl.lookAt(Math.sin(t * 0.5) > 0 ? new V3(-0.3, TY, 0.3) : E.camera.position);
      if (G.scene === 2 && !hammering && !gagBusy && !stampCur && Math.sin(t * 0.4) > 0.7) girl.lookAt(E.camera.position);
    }
    for (const p of people) p.update(dt, t);
    idle += dt;
    const pulse = 0.5 + 0.5 * Math.sin(t * 4);
    for (const h of hintTargets) setGlow(h.obj, pulse);
    if (hintTargets.length && idle > 3.5 && !ptr.down) {
      const s = toScreen(hintPos(hintTargets[0]));
      if (s.z < 1) {
        handEl.style.left = s.x + 'px'; handEl.style.top = s.y + 'px';
        ringEl.style.left = s.x + 'px'; ringEl.style.top = s.y + 'px';
        handEl.classList.add('on'); ringEl.classList.add('on');
      }
    } else { handEl.classList.remove('on'); ringEl.classList.remove('on'); }
    if (G.scene < 4) E.focusPoint = G.scene === 0 ? headPos(girl).lerp(pk.group.position, 0.3) : pk.group.position.clone().add(new V3(0, 0.12, 0));
  };

  E.post.aperture = 2.2;
  const start = +(q.get('scene') || 0);
  if (start) G.jump(start); else scene0();
  return G;
}
