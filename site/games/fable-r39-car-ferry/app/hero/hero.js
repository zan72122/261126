// HERO of くるまのフェリー: the ferry, its folding stern ramp, the mooring lines and the cars, and how they move together.
// API: docs/HERO-SPEC.md. No physics engine: springs, paths and formulas only. THREE is passed in (no three import here).
//
//   car on the quay ──path──▶ ramp (wheels follow the ramp's real angle) ──▶ aisle ──▶ parking place
//        weight on the ship  ──▶  sink / trim / heel springs  ──▶  hinge height  ──▶  ramp angle (every frame)
//   dock: lines fly to the bollards and pull tight, the ramp unfolds onto the quay.  undock: the reverse.
import { P } from './params.js';
import { makeGeoKit, clamp, lerp, smooth, easeInOut, wrapAngle, softClamp } from './geo.js';
import { buildShip } from './ship.js';
import { buildRamp } from './ramp.js';
import { makeLines } from './lines.js';
import { makeCarFactory } from './car.js';
import { Path } from './path.js';

export function createHero(THREE, opts = {}) {
  const tier = opts.tier === 'low' || opts.tier === 'mobile' ? opts.tier : 'high';
  const hintColor = new THREE.Color(opts.hintColor ?? 0xffe27a);
  let warned = 0;
  const warn = (e) => { if (warned++ < 3 && typeof console !== 'undefined') console.warn('[hero]', e && e.stack ? e.stack : e); };
  const emit = (type, data) => { try { if (opts.onEvent) opts.onEvent(type, data || {}); } catch (e) { warn(e); } };
  const kit = makeGeoKit(THREE);
  const C = P.car;

  const owned = []; // everything to dispose
  const own = (x) => { owned.push(x); return x; };

  // =====================================================================================================
  // scene graph:  root (the shell moves it)  →  hull (sink / trim / heel)  →  ship meshes, ramp
  //                                           →  mooring lines, cars (posed every frame from the hull)
  // =====================================================================================================
  const root = new THREE.Group(); root.name = 'hero';
  const hull = new THREE.Group(); hull.name = 'hull'; root.add(hull);

  const tex = { hull: (opts.textures && opts.textures.hull) || null, deck: (opts.textures && opts.textures.deck) || null };
  const hasImage = (t) => !!(t && t.image);
  const PAINT_GAIN = 1.12; // the paint photo is a light grey: lift it so white paint reads as white
  const paintMat = own(new THREE.MeshLambertMaterial({ color: 0xffffff, vertexColors: true, map: hasImage(tex.hull) ? tex.hull : null }));
  if (hasImage(tex.hull)) paintMat.color.setScalar(PAINT_GAIN);
  const DECK_PLAIN = 0x2f9a5e;
  const deckMat = own(new THREE.MeshLambertMaterial({ color: hasImage(tex.deck) ? 0xffffff : DECK_PLAIN, vertexColors: true, map: hasImage(tex.deck) ? tex.deck : null }));

  const shipGeo = buildShip(THREE, kit, tier); own(shipGeo.paint); own(shipGeo.deck);
  const paintMesh = new THREE.Mesh(shipGeo.paint, paintMat); paintMesh.name = 'ship'; hull.add(paintMesh);
  const deckMesh = new THREE.Mesh(shipGeo.deck, deckMat); deckMesh.name = 'deck'; hull.add(deckMesh);
  paintMesh.raycast = deckMesh.raycast = () => {};
  // a place for the shell's gulls that moves with the hull (see docs/hero-notes.md)
  const perch = new THREE.Object3D(); perch.name = 'gullPerch'; perch.position.set(0, P.roofY, (P.houseZ0 + P.houseZ1) / 2); hull.add(perch);

  const ramp = buildRamp(THREE, kit, { textures: { hull: hasImage(tex.hull) ? tex.hull : null, deck: hasImage(tex.deck) ? tex.deck : null }, hintColor, own });
  hull.add(ramp.pivot); hull.add(ramp.cables);
  ramp.pose(P.rampClosed, P.rampFold);

  const lines = makeLines(THREE, { own, emit });
  root.add(lines.mesh);

  // ---- small procedural textures (2): blob shadow, glowing frame ----
  function canvasTexture(size, draw) {
    const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
    const t = new THREE.CanvasTexture(c); return own(t);
  }
  const shadowTex = canvasTexture(64, (g, s) => {
    const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    r.addColorStop(0, 'rgba(0,0,0,0.5)'); r.addColorStop(0.55, 'rgba(0,0,0,0.28)'); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(0, 0, s, s);
  });
  const frameTex = canvasTexture(128, (g, s) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, s, s);
    const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
    g.fillStyle = 'rgba(255,255,255,0.16)'; rr(10, 10, s - 20, s - 20, 22); g.fill();
    for (const [w, a] of [[16, 0.12], [9, 0.3], [4, 0.9]]) { g.strokeStyle = `rgba(255,255,255,${a})`; g.lineWidth = w; rr(12, 12, s - 24, s - 24, 20); g.stroke(); }
  });
  frameTex.colorSpace = THREE.SRGBColorSpace;
  const shadowMat = own(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  const hitMat = own(new THREE.MeshBasicMaterial({ visible: false }));
  const slotGlowMat = own(new THREE.MeshBasicMaterial({ map: frameTex, color: hintColor, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  const slotGlowGeo = own(new THREE.PlaneGeometry(2.25, 3.1)); slotGlowGeo.rotateX(-Math.PI / 2);
  const slotGlow = new THREE.Mesh(slotGlowGeo, slotGlowMat); slotGlow.visible = false; slotGlow.renderOrder = 2; slotGlow.raycast = () => {}; hull.add(slotGlow);

  // a glowing arrow that runs up the ramp while the ramp hint is on ("drive up here")
  const arrowGeo = (() => { const B = new kit.Builder(); for (const sx of [1, -1]) { const a = [0, 0, 0.55], b = [0, 0, 0.1], c = [sx * 1.25, 0, -0.75], d = [sx * 1.25, 0, -0.3]; if (sx > 0) B.quad(a, d, c, b, 0xffffff); else B.quad(a, b, c, d, 0xffffff); } return own(B.build()); })();
  const arrowMat = own(new THREE.MeshBasicMaterial({ color: hintColor, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  const rampArrow = new THREE.Mesh(arrowGeo, arrowMat); rampArrow.visible = false; rampArrow.renderOrder = 2; rampArrow.raycast = () => {}; ramp.pivot.add(rampArrow);

  // ---- touch proxies (never drawn) ----
  const deckHitGeo = own(new THREE.BoxGeometry(P.deckHalfW * 2, 0.3, P.deckFrontZ - P.sternZ)); deckHitGeo.translate(0, P.deckY - 0.15, (P.deckFrontZ + P.sternZ) / 2);
  const deckHit = new THREE.Mesh(deckHitGeo, hitMat); deckHit.visible = false; hull.add(deckHit);
  const shipHit = (() => {
    const B = new kit.Builder(); const h = P.sheerY - P.keelY, hd = P.deckY - 0.05 - P.keelY;
    B.box(P.beam, hd, 15.5, 0, 0, P.keelY + hd / 2, P.sternZ + 7.75); // top at deck level, so the deck / the cars win over it
    B.box(5.6, h + 0.5, 2.6, 0, 0, P.keelY + h / 2 + 0.25, 6.8); B.box(3.0, h + 0.9, 1.9, 0, 0, P.keelY + h / 2 + 0.45, 9.0);
    B.box(P.cabinHalfW * 2, P.cabinTop - P.deckY, 3.2, 0, 0, (P.cabinTop + P.deckY) / 2, P.cabinZ0 + 1.6);
    B.box(4.0, P.cabinTop - P.deckY, 1.4, 0, 0, (P.cabinTop + P.deckY) / 2, 8.7);
    B.box(P.houseHalfW * 2, P.roofY - P.cabinTop, P.houseZ1 - P.houseZ0, 0, 0, (P.roofY + P.cabinTop) / 2, (P.houseZ0 + P.houseZ1) / 2);
    for (const sx of [1, -1]) B.box(1.0, P.funnelTop - P.cabinTop, 1.0, 0, sx * P.funnelX, (P.funnelTop + P.cabinTop) / 2, P.funnelZ - 0.15);
    const m = new THREE.Mesh(own(B.build()), hitMat); m.visible = false; hull.add(m); return m;
  })();

  // ---- cars ----
  const factory = makeCarFactory(THREE, kit, { makeDriver: opts.makeDriver, hintColor, shadowMat, hitMat });

  function setTextures(t) {
    if (!t) return;
    if (hasImage(t.hull)) { tex.hull = t.hull; paintMat.map = t.hull; paintMat.color.setScalar(PAINT_GAIN); paintMat.needsUpdate = true; }
    if (hasImage(t.deck)) { tex.deck = t.deck; deckMat.map = t.deck; deckMat.color.set(0xffffff); deckMat.needsUpdate = true; }
    ramp.setTextures({ hull: hasImage(t.hull) ? t.hull : null, deck: hasImage(t.deck) ? t.deck : null });
  }

  // =====================================================================================================
  // state
  // =====================================================================================================
  let time = 0;
  let phase = 'away'; // away | docking | docked | undocking
  let docked = false;
  let quayY = 0.6, quayEdgeZ = -13.4;
  const footZ = P.sternZ - P.rampLen - P.footBeyond;
  const bollard = [new THREE.Vector3(6.5, 1.22, -14.2), new THREE.Vector3(-6.5, 1.22, -14.2)];
  // ramp
  let rampMain = P.rampClosed, rampFoldA = P.rampFold, rampDown = false, rampAngleOut = P.rampClosed;
  let dockT = 0, dockFromA = P.rampClosed, dockFromF = P.rampFold, touched = false, bounceT = -1;
  let undockT = 0, raiseT = -1, raiseFromA = 0, raiseFromF = 0, undockedSent = true, rampKick = 0, rampIntent = 0;
  // ship motion: s = sink (m, + down), p = trim (hull.rotation.x), r = heel (hull.rotation.z)
  const mot = { s: 0, sv: 0, p: 0, pv: 0, r: 0, rv: 0 };
  let lastPoke = -10;
  // cars held by the hero
  const recs = [];
  const slots = P.slots.map(([x, z], index) => ({ x, z, index, rec: null }));
  let seq = 0, lastOutT = -10;
  const hint = { ramp: 0, deckCars: 0 };
  let press = null; // { kind: 'car'|'ramp'|'ship', rec }
  let glowSlot = null, glowAmt = 0;

  // temps (no allocation per frame)
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();
  const A0 = new THREE.Vector3(), A1 = new THREE.Vector3();
  const Hh = new THREE.Vector3(), Tt = new THREE.Vector3(); // hinge and tip of the ramp in the root frame
  const deckO = new THREE.Vector3(), deckN = new THREE.Vector3(0, 1, 0);
  const hullQ = new THREE.Quaternion(), qYaw = new THREE.Quaternion(), eul = new THREE.Euler();
  const hullInv = new THREE.Matrix4(), m4 = new THREE.Matrix4();
  const YAX = new THREE.Vector3(0, 1, 0);
  const f2 = [0, 0], r2 = [0, 0], t2 = [0, 0];
  const ray = new THREE.Ray(), plane = new THREE.Plane();
  const hitList = [], hitOut = [];

  // =====================================================================================================
  // frames and the driving surface (quay → ramp → deck)
  // =====================================================================================================
  function refreshFrames() {
    hull.updateMatrix(); hullInv.copy(hull.matrix).invert(); hullQ.copy(hull.quaternion);
    Hh.set(0, P.deckY, P.sternZ).applyMatrix4(hull.matrix);
    deckO.set(0, P.deckY, 0).applyMatrix4(hull.matrix);
    deckN.set(0, 1, 0).applyQuaternion(hullQ);
    ramp.pivot.updateMatrix();
    Tt.set(0, 0, -P.rampLen).applyMatrix4(ramp.pivot.matrix).applyMatrix4(hull.matrix);
  }
  const deckAt = (x, z) => deckO.y - (deckN.x * (x - deckO.x) + deckN.z * (z - deckO.z)) / Math.max(deckN.y, 0.5);
  /** height of the driving surface at (x, z) in the root frame */
  function surf(x, z) {
    if (z >= Hh.z) return deckAt(x, z);
    if (!rampDown || z <= Tt.z) return quayY;
    const k = (z - Tt.z) / Math.max(Hh.z - Tt.z, 1e-3);
    return quayY + (deckAt(x, Hh.z) - quayY) * k; // level at the quay, heeled with the ship at the hinge (the ramp twists)
  }
  /**
   * Ramp angle that puts the tip on the quay: sin(a)·cos(heel)·cos(trim) + cos(a)·sin(trim) = −(yh − quayY)/L.
   * Without heel this is the spec's  a = −asin((yh − quayY)/L) − trim.
   */
  function downAngle() {
    const yh = Hh.y, p = hull.rotation.x, r = hull.rotation.z;
    const Cc = -clamp((yh - quayY) / P.rampLen, -0.9, 0.9);
    const A = Math.cos(r) * Math.cos(p), Bq = Math.sin(p), R = Math.max(Math.hypot(A, Bq), 1e-3);
    return Math.asin(clamp(Cc / R, -1, 1)) - Math.atan2(Bq, A);
  }
  /** twist (per metre of ramp, per metre across) that makes the tip level although the hinge heels */
  function twistNow() {
    m4.multiplyMatrices(hull.matrix, ramp.pivot.matrix); const e = m4.elements; const hw = P.rampW / 2, L = P.rampLen;
    const yL = e[1] * hw - e[9] * L + e[13], yR = -e[1] * hw - e[9] * L + e[13];
    return (yR - yL) / Math.max(e[5], 0.3) / (2 * hw) / L;
  }

  // =====================================================================================================
  // ship motion
  // =====================================================================================================
  /** a push at (x, z) on the deck: J = added sink speed (m/s) */
  function kick(J, x = 0, z = P.pitchRefZ) {
    mot.sv = clamp(mot.sv + J, -0.9, 0.9);
    mot.pv = clamp(mot.pv + J * P.kickPitch * (z - P.pitchRefZ), -0.2, 0.2);
    mot.rv = clamp(mot.rv - J * P.kickRoll * x, -0.25, 0.25);
  }
  function stepShip(dt, input) {
    // loads: weight w, position (x, z) of every car the ship carries
    let sw = 0, sx = 0, sz = 0;
    const rl = Math.max(Hh.z - Tt.z, 1e-3);
    for (let i = 0; i < recs.length; i++) {
      const r = recs[i]; let w, x, z;
      if (r.frame === 'deck') { w = r.air ? 0 : 1; x = r.dx; z = r.dz; }
      else { // on a path: each axle carries half; on the ramp the share that rests on the hinge grows toward the ship
        const kf = rampDown ? clamp((r.zf - Tt.z) / rl, 0, 1) : (r.zf >= Hh.z ? 1 : 0), kr = rampDown ? clamp((r.zr - Tt.z) / rl, 0, 1) : (r.zr >= Hh.z ? 1 : 0);
        w = (kf + kr) / 2; x = r.px; z = Math.max(r.pz, P.sternZ);
      }
      sw += w; sx += w * x; sz += w * (z - P.pitchRefZ);
    }
    const speed = Number.isFinite(input.speed) ? input.speed : 0, turn = Number.isFinite(input.turnRate) ? input.turnRate : 0, acc = Number.isFinite(input.accel) ? clamp(input.accel, -4, 4) : 0;
    const tS = P.sinkPerCar * sw;
    const tP = clamp(P.pitchK * sz - P.accelPitch * acc, -P.maxPitch, P.maxPitch);
    const tR = clamp(-P.rollK * sx + P.turnRoll * speed * turn, -P.maxRoll, P.maxRoll);
    const w0 = P.omega, d = 2 * P.zeta * w0;
    mot.sv += (w0 * w0 * (tS - mot.s) - d * mot.sv) * dt; mot.s += mot.sv * dt;
    mot.pv += (w0 * w0 * (tP - mot.p) - d * mot.pv) * dt; mot.p += mot.pv * dt;
    mot.rv += (w0 * w0 * (tR - mot.r) - d * mot.rv) * dt; mot.r += mot.rv * dt;
    if (!Number.isFinite(mot.s + mot.sv + mot.p + mot.pv + mot.r + mot.rv)) { mot.s = mot.sv = mot.p = mot.pv = mot.r = mot.rv = 0; }
    mot.s = clamp(mot.s, -0.3, P.maxSink);
    const k = clamp(Math.abs(speed) / 5, 0, 1); // livelier at sea
    hull.position.y = -mot.s + P.waveHeave * (1 + 0.5 * k) * Math.sin(1.1 * time);
    hull.rotation.x = softClamp(mot.p + P.wavePitch * (1 + 1.2 * k) * Math.sin(0.8 * time + 1), P.maxPitch);
    hull.rotation.z = softClamp(mot.r + P.waveRoll * (1 + 0.6 * k) * Math.sin(0.7 * time + 2), P.maxRoll);
  }

  // =====================================================================================================
  // dock / undock and the ramp
  // =====================================================================================================
  function dock(b, { instant = false } = {}) {
    b = b || {};
    quayY = Number.isFinite(b.quayY) ? b.quayY : 0.6; quayEdgeZ = Number.isFinite(b.quayEdgeZ) ? b.quayEdgeZ : -13.4;
    root.updateMatrixWorld(true);
    for (let k = 0; k < 2; k++) {
      const w = b.bollards && (b.bollards[k] || b.bollards[0]);
      if (w) { bollard[k].copy(w); root.worldToLocal(bollard[k]); } else bollard[k].set(k ? -6.5 : 6.5, quayY + 0.62, quayEdgeZ - 0.8);
    }
    lines.setBollards(bollard[0], bollard[1], quayY, quayEdgeZ);
    phase = 'docking'; docked = false; dockT = 0; touched = false; bounceT = -1; raiseT = -1; undockedSent = true;
    dockFromA = rampMain; dockFromF = rampFoldA; rampDown = false;
    lines.throwLines(instant);
    if (instant) {
      refreshFrames(); rampMain = downAngle(); rampFoldA = 0; ramp.pose(rampMain, 0); rampDown = true; touched = true;
      refreshFrames(); ramp.setTwist(twistNow()); ramp.updateCables();
      phase = 'docked'; docked = true; emit('docked', {});
    } else emit('lineThrow', {});
  }

  function undock() {
    if (phase !== 'docked' && phase !== 'docking') return;
    phase = 'undocking'; docked = false; undockT = 0; raiseT = -1; undockedSent = false; bounceT = -1;
    dropPress();
    let changed = false;
    for (let i = 0; i < recs.length; i++) {
      const r = recs[i];
      if (r.state === 'outWait') { r.state = 'parked'; changed = true; }
      else if (r.state === 'hop' && r.hop.then === 'out') { startHop(r, r.slot.x, r.slot.z, 0, 0.35, 0.28, 'parked'); }
      else if (r.state === 'out') {
        if (r.committed) r.rush = true; // already on the ramp: finish quickly
        else { pathToDeck(r); startHop(r, r.slot.x, r.slot.z, r.dyaw > 0 ? Math.PI * 2 : -Math.PI * 2, 0.6, 0.4, 'parked'); }
      } else if (r.state === 'stage' || r.state === 'board') r.rush = true; // cars on the way are brought aboard, quickly
    }
    lines.release();
    if (changed) emit('loadChanged', { count: count() });
  }
  /** something still needs the ramp */
  function rampBusy() {
    for (let i = 0; i < recs.length; i++) {
      const r = recs[i];
      if (r.state === 'stage' || r.state === 'out') return true;
      if (r.state === 'board' && r.s < r.clearS) return true;
    }
    return false;
  }

  function stepRamp(dt) {
    const down = downAngle();
    if (phase === 'docking') {
      dockT += dt; const k = (dockT - P.rampDockDelay) / P.rampLowerTime;
      if (!touched) {
        rampMain = lerp(dockFromA, down, easeInOut(k)); rampFoldA = dockFromF * (1 - smooth(k / 0.62));
        if (k >= 1) { touched = true; rampDown = true; rampMain = down; rampFoldA = 0; bounceT = 0; emit('rampTouch', {}); kick(0.06, 0, P.sternZ); }
      } else { rampMain = down; rampFoldA = 0; }
      if (touched && lines.allTaut()) { phase = 'docked'; docked = true; emit('docked', {}); }
    } else if (phase === 'docked') { rampMain = down; rampFoldA = 0; rampDown = true; }
    else if (phase === 'undocking') {
      undockT += dt;
      if (raiseT < 0) {
        if (rampDown) { rampMain = down; rampFoldA = 0; }
        if (!rampBusy() || undockT > 1.45) { raiseT = 0; raiseFromA = rampMain; raiseFromF = rampFoldA; rampDown = false; forceClear(); }
      } else {
        raiseT += dt; const k = raiseT / P.rampRaiseTime;
        rampMain = lerp(raiseFromA, P.rampClosed, easeInOut(k)); rampFoldA = lerp(raiseFromF, P.rampFold, smooth((k - 0.12) / 0.88));
        if (!undockedSent && raiseT >= 0.25) { undockedSent = true; emit('undocked', {}); }
        if (k >= 1) { rampMain = P.rampClosed; rampFoldA = P.rampFold; if (undockedSent) phase = 'away'; }
      }
    } else { rampMain = P.rampClosed; rampFoldA = P.rampFold; rampDown = false; }

    // small extra lift of the tip: bounce on touching the quay, hint taps, a wobble when poked
    let off = 0;
    if (bounceT >= 0) { bounceT += dt; if (bounceT < P.rampBounceTime) off += P.rampBounce * Math.sin((Math.PI * bounceT) / P.rampBounceTime); else if (bounceT < P.rampBounceTime * 1.8) off += P.rampBounce * 0.3 * Math.sin((Math.PI * (bounceT - P.rampBounceTime)) / (P.rampBounceTime * 0.8)); else bounceT = -1; }
    if (rampKick > 0) { rampKick = Math.max(0, rampKick - dt * 2.4); off += 0.045 * Math.abs(Math.sin(rampKick * 13)) * rampKick; }
    if (phase === 'docked' && hint.ramp > 0.01 && !rampOccupied()) { const ph = time % P.hintPeriod; const tap = ph < 0.2 ? Math.sin((Math.PI * ph) / 0.2) : ph > 0.32 && ph < 0.52 ? Math.sin((Math.PI * (ph - 0.32)) / 0.2) : 0; off += P.rampTap * hint.ramp * tap; }
    rampAngleOut = rampMain + off;
    ramp.pose(rampAngleOut, rampFoldA);
    refreshFrames();
    ramp.setTwist(rampDown ? twistNow() : 0);
    ramp.updateCables();
  }
  function rampOccupied() { for (let i = 0; i < recs.length; i++) { const r = recs[i]; if (r.frame === 'path' && r.zf > Tt.z - 0.5 && r.zr < Hh.z + 0.5) return true; } return false; }
  /** safety net: the ramp goes up now — nothing may be left between quay and deck */
  function forceClear() {
    for (let i = recs.length - 1; i >= 0; i--) {
      const r = recs[i];
      if (r.state === 'out') { handOver(r, i); continue; }
      if (r.state === 'stage' || (r.state === 'board' && r.s < r.clearS)) { r.dx = 0; r.dz = P.sternZ + 1.8; r.dyaw = 0; r.lift = 0; r.frame = 'deck'; startHop(r, r.slot.x, r.slot.z, 0, 0.5, 0.3, 'parked'); }
    }
  }

  // =====================================================================================================
  // cars: records, poses
  // =====================================================================================================
  const recOf = (car) => { for (let i = 0; i < recs.length; i++) if (recs[i].h === car) return recs[i]; return null; };
  const count = () => { let n = 0; for (let i = 0; i < recs.length; i++) { const s = recs[i].state; if (s === 'parked' || s === 'drag' || (s === 'hop' && recs[i].hop.then === 'parked' && recs[i].counted)) n++; } return n; };
  const outActive = () => { for (let i = 0; i < recs.length; i++) { const r = recs[i]; if (r.state === 'outWait' || r.state === 'out' || (r.state === 'hop' && r.hop.then === 'out')) return true; } return false; };
  const inActive = () => { for (let i = 0; i < recs.length; i++) { const r = recs[i]; if (r.state === 'board' || (r.state === 'hop' && r.hop.then === 'parked' && !r.counted)) return true; } return false; };
  const yawOf = (o) => { v1.set(0, 0, 1).applyQuaternion(o.quaternion); return Math.atan2(v1.x, v1.z); };

  /** pose from deck coordinates (dx, dz, dyaw, lift): the car stands on the heeled, sunk deck */
  function poseDeck(r) {
    const o = r.h.object;
    o.position.set(r.dx, P.deckY, r.dz).applyMatrix4(hull.matrix);
    qYaw.setFromAxisAngle(YAX, r.dyaw); o.quaternion.copy(hullQ).multiply(qYaw);
    r.h._lift = r.lift;
    r.px = o.position.x; r.pz = o.position.z; r.zf = r.zr = r.pz;
  }
  /** pose on the path: front and rear axle each stand on the surface → height, pitch and roll of the car */
  function posePath(r, dt) {
    const p = r.path, wb2 = C.wheelbase / 2, o = r.h.object;
    p.at(r.s + wb2, f2); p.at(r.s - wb2, r2);
    const cx = (f2[0] + r2[0]) / 2, cz = (f2[1] + r2[1]) / 2;
    const yf = surf(f2[0], f2[1]), yr = surf(r2[0], r2[1]);
    const hd = Math.max(Math.hypot(f2[0] - r2[0], f2[1] - r2[1]), 0.3);
    let yaw = Math.atan2(f2[0] - r2[0], f2[1] - r2[1]);
    if (r.yawFix !== 0) { yaw += r.yawFix; r.yawFix *= Math.exp(-dt / 0.11); if (Math.abs(r.yawFix) < 1e-3) r.yawFix = 0; }
    const pitchUp = Math.atan2(yf - yr, hd);
    const lx = Math.cos(yaw), lz = -Math.sin(yaw);
    const roll = Math.atan2(surf(cx + lx * C.track, cz + lz * C.track) - surf(cx - lx * C.track, cz - lz * C.track), 2 * C.track);
    o.position.set(cx, (yf + yr) / 2, cz);
    eul.set(-pitchUp, yaw, roll, 'YXZ'); o.quaternion.setFromEuler(eul);
    r.h._lift = 0; r.px = cx; r.pz = cz; r.zf = f2[1]; r.zr = r2[1]; r.yaw = yaw;
  }
  /** switch a car from its path pose to deck coordinates */
  function pathToDeck(r) {
    v1.copy(r.h.object.position).applyMatrix4(hullInv);
    r.dx = clamp(v1.x, -P.deckHalfW + 0.8, P.deckHalfW - 0.8); r.dz = clamp(v1.z, P.sternZ + 1.3, P.deckFrontZ - 1.3); r.dyaw = r.yaw; r.lift = 0; r.frame = 'deck';
  }
  function slotRoot(slot, out) { v1.set(slot.x, P.deckY, slot.z).applyMatrix4(hull.matrix); out[0] = v1.x; out[1] = v1.z; return out; }

  // ---- paths on the quay ----
  const quayClamp = (x, z, out) => { out[0] = x; out[1] = Math.min(z, quayEdgeZ - 0.95); };
  /** smooth curve from a pose to a pose (leaves along the car's heading when that makes sense) */
  function approach(p, x0, z0, yaw0, x1, z1, yaw1) {
    const dx = x1 - x0, dz = z1 - z0, d = Math.hypot(dx, dz);
    if (d < 0.4) { p.lineTo(x1, z1); return; }
    let hx = Math.sin(yaw0), hz = Math.cos(yaw0); const tx = dx / d, tz = dz / d;
    if (hx * tx + hz * tz < 0.25) { hx = hx * 0.3 + tx; hz = hz * 0.3 + tz; const l = Math.hypot(hx, hz) || 1; hx /= l; hz /= l; }
    const ex = Math.sin(yaw1), ez = Math.cos(yaw1);
    const lateral = Math.abs(dx * ez - dz * ex), behind = dx * ex + dz * ez; // how far to the side / how far before the goal
    const k1 = clamp(d * 0.4, 0.5, 3.5), k2 = clamp(0.3 * d + 0.25 * lateral + (behind < 1 ? 1.4 : 0), 0.8, 3.4);
    p.curveTo(x0 + hx * k1, z0 + hz * k1, x1 - ex * k2, z1 - ez * k2, x1, z1, 0.22, quayClamp);
  }
  function newRec(h) {
    return {
      h, state: 'stage', frame: 'path', slot: null, seq: ++seq,
      path: new Path(), s: 0, speed: 0, footS: 0, hingeS: 0, clearS: 0, yawFix: 0, yaw: 0,
      px: 0, pz: 0, zf: 0, zr: 0, dx: 0, dz: 0, dyaw: 0, lift: 0, air: false,
      hop: { t: 0, dur: 0.4, h: 0.5, x0: 0, z0: 0, y0: 0, l0: 0, x1: 0, z1: 0, y1: 0, then: 'parked' },
      stageK: -1, sideHop: false, committed: false, counted: false, rush: false, onRamp: false, frontOn: false, rearOn: false,
      tx: 0, tz: 0, wantsOut: false, vx: 0, vz: 0, idleT: 0, queueOut: false, outSeq: 0,
    };
  }

  // =====================================================================================================
  // boarding
  // =====================================================================================================
  function chooseSlot(point) {
    if (point) {
      v1.copy(point); root.worldToLocal(v1); v1.applyMatrix4(hullInv);
      if (v1.z > P.sternZ - 0.2 && v1.z < P.deckFrontZ + 0.6 && Math.abs(v1.x) < P.deckHalfW + 0.5) return nearestSlot(v1.x, v1.z, null, false);
    }
    for (let i = 0; i < slots.length; i++) if (!slots[i].rec) return slots[i]; // hero's choice: from the stern, left and right in turn
    return null;
  }
  /** nearest slot that is free (or is `mine`); withParked: slots holding a parked car count too (swap) */
  function nearestSlot(x, z, mine, withParked) {
    let best = null, bd = Infinity;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (s.rec && s.rec !== mine && !(withParked && s.rec.state === 'parked')) continue;
      const d = (s.x - x) * (s.x - x) + (s.z - z) * (s.z - z); if (d < bd) { bd = d; best = s; }
    }
    return best;
  }

  function boardCar(car, { point = null } = {}) {
    try {
      if (phase !== 'docked' || !car || !car.object || recOf(car)) return false;
      const slot = chooseSlot(point); if (!slot) return false;
      root.updateMatrixWorld(true);
      root.attach(car.object);
      const o = car.object, r = newRec(car);
      r.slot = slot; slot.rec = r;
      r.yaw = yawOf(o); r.px = o.position.x; r.pz = Math.min(o.position.z, quayEdgeZ - 0.95); r.zf = r.zr = r.pz;
      if (car._dropFrom) car._dropFrom(o.position.y - quayY);
      r.path.reset(r.px, r.pz);
      recs.push(r);
      car.setGlow(0); if (car._hop) car._hop(0.16, 0.26);
      emit('carBoardStart', { car });
      if (!outActive()) planBoard(r);
      return true;
    } catch (e) { warn(e); return false; }
  }

  /** the committed way aboard: quay → foot of the ramp → ramp → aisle → place */
  function planBoard(r) {
    const p = r.path, x0 = r.px, z0 = r.pz, yaw0 = r.yaw;
    p.reset(x0, z0);
    approach(p, x0, z0, yaw0, 0, footZ, 0);
    r.footS = p.len;
    slotRoot(r.slot, t2); const sx = t2[0], sz = t2[1];
    // drive straight into the place when nothing stands behind it; otherwise up the aisle and a side hop
    let laneFree = true;
    for (let i = 0; i < slots.length; i++) { const s = slots[i]; if (s !== r.slot && s.x * r.slot.x > 0 && s.z < r.slot.z && s.rec) laneFree = false; }
    if (laneFree) {
      const zc = Math.max(Hh.z + 0.15, sz - 3.5), k = (sz - zc) * 0.34;
      p.lineTo(0, zc); p.curveTo(0, zc + k, sx, sz - k, sx, sz, 0.2);
      r.sideHop = false;
    } else { p.lineTo(0, sz); r.sideHop = true; }
    r.hingeS = r.footS + (Hh.z - footZ); r.clearS = r.hingeS + C.wheelbase / 2 + 0.4;
    r.s = 0; r.state = 'board'; r.frame = 'path'; r.committed = true; r.onRamp = r.frontOn = r.rearOn = false; r.stageK = -1;
    p.at(C.wheelbase / 2, f2); p.at(-C.wheelbase / 2, r2);
    r.yawFix = wrapAngle(yaw0 - Math.atan2(f2[0] - r2[0], f2[1] - r2[1]));
  }
  /** waiting place beside the ramp while cars drive off (k-th in the queue) */
  function planStage(r, k) {
    const st = P.stage; const x1 = k < st.length ? st[k][0] : st[st.length - 1][0] - 2.8 * (k - st.length + 1), z1 = k < st.length ? st[k][1] : st[st.length - 1][1];
    const p = r.path; p.reset(r.px, r.pz);
    approach(p, r.px, r.pz, r.yaw, x1, z1, Math.atan2(-x1, footZ + 1.2 - z1));
    r.s = 0; r.stageK = k;
    p.at(C.wheelbase / 2, f2); p.at(-C.wheelbase / 2, r2);
    r.yawFix = wrapAngle(r.yaw - Math.atan2(f2[0] - r2[0], f2[1] - r2[1]));
  }

  /** move along the path toward sStop with speed limits; returns the distance moved */
  function drive(r, dt, vmax, sStop, vEnd) {
    const rem = Math.max(0, sStop - r.s);
    const acc = r.rush ? 60 : P.carAccel, brk = r.rush ? 60 : P.carBrake * 1.6;
    let want = Math.min(vmax, Math.sqrt(vEnd * vEnd + 2 * (r.rush ? 50 : P.carBrake) * rem));
    if (rem < 1e-3) want = Math.min(want, vEnd);
    r.speed += clamp(want - r.speed, -brk * dt, acc * dt);
    if (r.speed < 0) r.speed = 0;
    const ds = Math.min(r.speed * dt, rem);
    r.s += ds; r.h.roll(ds);
    return ds;
  }
  function rushSpeed(r, target) { const left = Math.max(0.1, P.rushTime - undockT); return clamp((target - r.s) / left, P.carSpeed * 1.6, 45); }

  function stepStage(r, dt, k) {
    if (!outActive() && (phase === 'docked' || phase === 'undocking') && rampDown) { planBoard(r); stepBoard(r, dt); return; }
    if (r.stageK !== k) planStage(r, k);
    drive(r, dt, P.carSpeed, r.path.len, 0);
    posePath(r, dt);
    r.idleT += dt; if (r.speed < 0.05 && r.idleT > 1.1) { r.idleT = 0; r.h._hop(0.12, 0.24); } // waiting, eager
  }

  function stepBoard(r, dt) {
    const p = r.path;
    // follow the car in front (the one that started boarding before this one)
    let sStop = p.len, lead = null;
    for (let i = 0; i < recs.length; i++) { const o = recs[i]; if (o !== r && o.seq < r.seq && (o.state === 'board' || (o.state === 'hop' && o.hop.then === 'parked' && !o.counted && o.sideHop && o.hop.t < 0.5)) && (!lead || o.seq > lead.seq)) lead = o; }
    if (lead) { const lq = (lead.state === 'board' ? lead.s : lead.path.len) - lead.footS; sStop = Math.min(sStop, r.footS + lq - (r.rush ? P.gap - 0.35 : P.gap)); }
    const onRampNow = r.s + C.wheelbase / 2 > r.footS + (Tt.z - footZ) - 0.3 && r.s - C.wheelbase / 2 < r.hingeS;
    let vmax = onRampNow ? P.rampSpeed : P.carSpeed;
    if (r.rush) vmax = Math.max(14, r.s < r.clearS ? rushSpeed(r, r.clearS) : 0); // the ship is leaving: hurry aboard (and keep going, others follow)
    drive(r, dt, vmax, Math.max(sStop, r.s), 0);
    posePath(r, dt);
    if (!r.onRamp && r.zf >= Tt.z && r.s > r.footS - 0.5) { r.onRamp = true; r.h._bump(0.7); emit('carOnRamp', { car: r.h }); }
    if (!r.frontOn && r.zf >= Hh.z && r.onRamp) { r.frontOn = true; r.h._bump(1); kick(P.landKick * 0.55, r.px, P.sternZ); emit('sound', { id: 'clunk', volume: 0.7 }); }
    if (!r.rearOn && r.zr >= Hh.z && r.frontOn) { r.rearOn = true; r.h._bump(0.7); kick(P.landKick * 0.45, r.px, P.sternZ); emit('shipSink', { amount: P.sinkPerCar }); }
    if (r.s >= p.len - 1e-3) { // at the place (or beside it in the aisle): a hop settles the car exactly on its place
      pathToDeck(r);
      if (r.sideHop) startHop(r, r.slot.x, r.slot.z, 0, P.hopInH, P.hopInTime, 'parked');
      else startHop(r, r.slot.x, r.slot.z, 0, 0.16, 0.24, 'parked');
    }
  }

  // =====================================================================================================
  // hops on the deck (into a place, out into the aisle, after a drag, swapping)
  // =====================================================================================================
  function startHop(r, x1, z1, yaw1, h, dur, then) {
    const hp = r.hop;
    hp.t = 0; hp.dur = dur; hp.h = h; hp.x0 = r.dx; hp.z0 = r.dz; hp.y0 = r.dyaw; hp.l0 = r.lift; hp.x1 = x1; hp.z1 = z1; hp.y1 = yaw1; hp.then = then;
    r.state = 'hop'; r.frame = 'deck'; r.air = true; r.speed = 0; r.rush = false;
    if (h > 0.3) emit('sound', { id: 'whoosh', volume: 0.5 });
  }
  function stepHop(r, dt) {
    const hp = r.hop; hp.t = Math.min(1, hp.t + dt / Math.max(hp.dur, 0.05));
    const u = hp.t, e = smooth(u);
    r.dx = lerp(hp.x0, hp.x1, e); r.dz = lerp(hp.z0, hp.z1, e); r.dyaw = lerp(hp.y0, hp.y1, e);
    r.lift = hp.l0 * (1 - e) + hp.h * 4 * u * (1 - u);
    r.h._lean = Math.sin(u * Math.PI) * clamp((hp.x1 - hp.x0) * -0.06, -0.14, 0.14);
    if (u >= 1) land(r);
    poseDeck(r);
  }
  function land(r) {
    const hp = r.hop, hard = clamp(hp.h / 0.5, 0.35, 1.15);
    r.dx = hp.x1; r.dz = hp.z1; r.lift = 0; r.air = false; r.h._lean = 0;
    r.h._land(hard); kick(P.hopKick * hard, r.dx, r.dz);
    if (hp.then === 'out') {
      r.dyaw = hp.y1; r.state = 'out'; r.frame = 'path'; r.committed = false; r.onRamp = false; r.rearOn = false;
      poseDeck(r); const o = r.h.object;
      r.path.reset(o.position.x, o.position.z); r.path.lineTo(0, footZ);
      r.s = 0; r.speed = 0; r.hingeS = o.position.z - Hh.z; r.yawFix = 0; r.yaw = Math.PI;
      emit('sound', { id: 'clunk', volume: 0.6 });
      return;
    }
    r.dyaw = 0; r.state = 'parked'; r.counted = true; r.idleT = 0;
    emit('sound', { id: 'clunk', volume: 0.45 + 0.4 * hard });
    emit('shipSink', { amount: P.sinkPerCar * hard });
    emit('carParked', { car: r.h, slot: r.slot.index, count: count() });
    emit('loadChanged', { count: count() });
    if (r.queueOut) { r.queueOut = false; if (phase === 'docked') unloadCar(r.h); }
  }

  // =====================================================================================================
  // unloading
  // =====================================================================================================
  function unloadCar(car) {
    if (phase !== 'docked') return false;
    const r = recOf(car); if (!r || r.state !== 'parked') return false;
    r.state = 'outWait'; r.outSeq = ++seq; r.idleT = 0; r.counted = false;
    r.h._hop(0.14, 0.24);
    emit('carUnloadStart', { car });
    emit('loadChanged', { count: count() });
    return true;
  }
  function unloadNext() {
    if (phase !== 'docked') return false;
    let best = null;
    for (let i = 0; i < recs.length; i++) { const r = recs[i]; if (r.state === 'parked' && (!best || r.slot.z < best.slot.z - 0.1 || (Math.abs(r.slot.z - best.slot.z) < 0.1 && r.slot.x > best.slot.x))) best = r; }
    return best ? unloadCar(best.h) : false;
  }
  /** may a car hop into the aisle at zLand now? (nobody boarding, spacing to the cars already leaving) */
  function canStartOut(r, zLand) {
    if (phase !== 'docked' || inActive() || time - lastOutT < P.unloadInterval) return false;
    for (let i = 0; i < recs.length; i++) {
      const o = recs[i]; if (o === r) continue;
      const leaving = o.state === 'out' || (o.state === 'hop' && o.hop.then === 'out');
      if (!leaving) continue;
      const oz = o.state === 'out' ? o.pz : o.hop.z1;
      if (oz > zLand ? oz - zLand < P.gap + 1.3 : zLand - oz < P.gap) return false;
    }
    for (let i = 0; i < recs.length; i++) { const o = recs[i]; if (o !== r && o.state === 'outWait' && o.outSeq < r.outSeq && Math.abs(o.slot.z - zLand) < 0.1) return false; } // same row: first asked, first out
    return true;
  }
  function startOut(r, zLand) {
    lastOutT = time;
    // turn toward the aisle while hopping, land facing the stern
    const side = r.dx >= 0 ? 1 : -1;
    startHop(r, 0, zLand, r.dyaw + (side > 0 ? -Math.PI : Math.PI) - wrapAngle(r.dyaw), P.hopOutH, P.hopOutTime, 'out');
  }
  function stepOut(r, dt) {
    // keep a gap to the car in front (nearer to the quay)
    let sStop = r.path.len;
    for (let i = 0; i < recs.length; i++) { const o = recs[i]; if (o !== r && o.state === 'out' && o.pz < r.pz) sStop = Math.min(sStop, r.s + (r.pz - o.pz - P.gap)); }
    const onRampNow = r.s + C.wheelbase / 2 > r.hingeS - 0.3;
    let vmax = onRampNow ? P.rampSpeed : P.carSpeed;
    if (r.rush) vmax = clamp((r.path.len - r.s) / Math.max(0.1, 0.4 - undockT), P.carSpeed * 1.6, 45);
    drive(r, dt, vmax, Math.max(sStop, r.s), sStop >= r.path.len ? P.exitSpeed : 0);
    posePath(r, dt);
    if (!r.onRamp && r.zf <= Hh.z) { // front wheels on the ramp: no way back, the place is free again
      r.onRamp = true; r.committed = true; r.h._bump(0.8); emit('carOnRamp', { car: r.h });
      if (r.slot && r.slot.rec === r) r.slot.rec = null;
    }
    if (!r.rearOn && r.zr <= Hh.z) { r.rearOn = true; r.h._bump(0.5); kick(-0.2, 0, P.sternZ); }
    if (r.s >= r.path.len - 1e-3) handOver(r, recs.indexOf(r));
  }
  /** the car has reached the quay: give it back to the shell */
  function handOver(r, i) {
    const h = r.h, o = h.object;
    if (i >= 0) recs.splice(i, 1);
    if (r.slot && r.slot.rec === r) r.slot.rec = null;
    if (press && press.rec === r) press = null;
    h._calm(); h.setGlow(0);
    o.position.set(0, quayY, footZ); o.rotation.set(0, Math.PI, 0);
    root.updateMatrixWorld(true);
    const position = new THREE.Vector3(0, quayY, footZ).applyMatrix4(root.matrixWorld);
    emit('carUnloaded', { car: h, position, yaw: root.rotation.y + Math.PI });
  }

  // =====================================================================================================
  // per-frame car update
  // =====================================================================================================
  function stepCars(dt) {
    // boarding cars that wait beside the ramp: queue index by arrival
    let stageIdx = 0;
    glowSlot = null;
    const pulse = 0.35 + 0.25 * Math.sin((2 * Math.PI * time) / P.hintPeriod);
    // oldest first, so followers see where their leader went this frame
    for (let n = 0; n < recs.length; n++) {
      const r = recs[n]; if (!r) continue;
      const st = r.state;
      if (st === 'stage') { stepStage(r, dt, stageIdx++); if (r.state === 'board') glowSlot = r.slot; }
      else if (st === 'board') { stepBoard(r, dt); if (r.state !== 'parked') glowSlot = r.slot; }
      else if (st === 'hop') stepHop(r, dt);
      else if (st === 'out') { const len = recs.length; stepOut(r, dt); if (recs.length < len) n--; }
      else if (st === 'outWait') {
        r.idleT += dt; if (r.idleT > 0.7) { r.idleT = 0; r.h._hop(0.1, 0.22); }
        r.lift = 0; poseDeck(r);
        if (canStartOut(r, r.slot.z)) startOut(r, r.slot.z);
      } else if (st === 'drag') stepDrag(r, dt);
      else { // parked: hint glow and hop
        const hv = hint.deckCars;
        r.h.setGlow(hv > 0.01 ? (hv * pulse) / 0.6 : 0);
        const ph = ((time + r.slot.index * 0.23) % P.hopPeriod) / P.hopTime;
        r.lift = hv > 0.01 && ph < 1 ? Math.sin(ph * Math.PI) * P.hopH * hv : 0;
        poseDeck(r);
      }
      if (st !== 'parked' && st !== 'drag' && r.state !== 'parked') r.h.setGlow(0);
    }
    // the place a car is heading for / the place under a dragged car lights up
    if (press && press.kind === 'car' && press.rec.state === 'drag') glowSlot = press.rec.wantsOut ? null : nearestSlot(press.rec.dx, press.rec.dz, press.rec, true);
    glowAmt += ((glowSlot ? 1 : 0) - glowAmt) * Math.min(1, dt * 10);
    if (glowSlot) slotGlow.position.set(glowSlot.x, P.deckY + 0.03, glowSlot.z);
    slotGlow.visible = glowAmt > 0.02; slotGlowMat.opacity = glowAmt * (0.6 + 0.3 * Math.sin(time * 7));
    // ramp glow: hint, or "let go here to drive off"
    const want = press && press.kind === 'car' && press.rec.state === 'drag' && press.rec.wantsOut ? 1 : 0;
    rampIntent += (want - rampIntent) * Math.min(1, dt * 12);
    ramp.setGlow(clamp(hint.ramp * pulse + rampIntent * 0.7, 0, 1));
    const arrowOn = phase === 'docked' && hint.ramp > 0.02 && !rampOccupied();
    rampArrow.visible = arrowOn;
    if (arrowOn) { const u = (time * 1.15) % 1; rampArrow.position.set(0, 0.07, -(P.rampLen - 0.7) + u * (P.rampLen - 1.3)); arrowMat.opacity = hint.ramp * Math.sin(Math.PI * u) * 0.85; }
  }

  // =====================================================================================================
  // touch: hit test, drag on the deck, taps
  // =====================================================================================================
  function hitTest(raycaster) {
    try {
      root.updateMatrixWorld(true);
      let best = null;
      hitList.length = 0; for (let i = 0; i < recs.length; i++) hitList.push(recs[i].h._hit);
      hitOut.length = 0; raycaster.intersectObjects(hitList, false, hitOut);
      if (hitOut.length) { const h = hitOut[0]; best = { kind: 'car', car: h.object.parent.userData.carHandle, point: h.point, distance: h.distance }; }
      hitOut.length = 0; raycaster.intersectObjects(ramp.hits, false, hitOut);
      if (hitOut.length && (!best || hitOut[0].distance < best.distance)) best = { kind: 'ramp', car: null, point: hitOut[0].point, distance: hitOut[0].distance };
      hitOut.length = 0; raycaster.intersectObject(deckHit, false, hitOut);
      if (hitOut.length && (!best || hitOut[0].distance < best.distance)) best = { kind: 'deck', car: null, point: hitOut[0].point, distance: hitOut[0].distance };
      hitOut.length = 0; raycaster.intersectObject(shipHit, false, hitOut);
      if (hitOut.length && (!best || hitOut[0].distance < best.distance - 0.35)) best = { kind: 'ship', car: null, point: hitOut[0].point, distance: hitOut[0].distance };
      hitOut.length = 0;
      return best;
    } catch (e) { warn(e); return null; }
  }
  /** where the finger's ray meets the deck plane raised by `lift` → deck coordinates in out (x, z) */
  function deckPoint(raycaster, lift, out) {
    root.updateMatrixWorld(true);
    ray.copy(raycaster.ray).applyMatrix4(m4.copy(hull.matrixWorld).invert());
    plane.set(v2.set(0, 1, 0), -(P.deckY + lift));
    return ray.intersectPlane(plane, out);
  }
  function pointerDown(raycaster, hit) {
    try {
      if (!hit) return false;
      if (hit.kind === 'car') {
        const r = recOf(hit.car); if (!r) return false;
        press = { kind: 'car', rec: r };
        r.h._hop(r.state === 'parked' ? 0.12 : 0.18, 0.24); // answers the touch at once
        return true;
      }
      if (hit.kind === 'ramp') { press = { kind: 'ramp', rec: null }; rampKick = Math.max(rampKick, 0.5); return true; }
      // the ship itself: a push where the finger is — it dips, rocks and settles
      press = { kind: 'ship', rec: null };
      if (time - lastPoke > 0.22 && hit.point) {
        lastPoke = time;
        v1.copy(hit.point); root.worldToLocal(v1); v1.applyMatrix4(hullInv);
        kick(P.pokeKick, clamp(v1.x, -4, 4), clamp(v1.z, -10, 10));
        emit('shipSink', { amount: 0.03 });
      }
      return true;
    } catch (e) { warn(e); return false; }
  }
  function pointerMove(raycaster) {
    try {
      if (!press || press.kind !== 'car') return;
      const r = press.rec; if (r.state !== 'parked' && r.state !== 'drag') return;
      const p = deckPoint(raycaster, P.dragLift, v3); if (!p) return;
      if (r.state === 'parked') { r.state = 'drag'; r.tx = r.dx; r.tz = r.dz; r.vx = r.vz = 0; r.h.setGlow(0.5); emit('sound', { id: 'pop', volume: 0.5 }); }
      r.wantsOut = phase === 'docked' && p.z < P.sternZ - 0.5 && Math.abs(p.x) < P.rampW / 2 + 1.5;
      r.tx = clamp(p.x, -P.deckHalfW + 0.95, P.deckHalfW - 0.95); r.tz = clamp(p.z, P.sternZ + 1.45, P.deckFrontZ - 1.4);
    } catch (e) { warn(e); }
  }
  function stepDrag(r, dt) {
    const k = 1 - Math.exp(-dt / 0.055);
    const nx = r.dx + (r.tx - r.dx) * k, nz = r.dz + (r.tz - r.dz) * k;
    if (dt > 1e-5) { r.vx += ((nx - r.dx) / dt - r.vx) * Math.min(1, dt * 12); r.vz += ((nz - r.dz) / dt - r.vz) * Math.min(1, dt * 12); }
    r.dx = nx; r.dz = nz;
    // rise higher over other cars
    let over = 0;
    for (let i = 0; i < recs.length; i++) {
      const o = recs[i]; if (o === r) continue;
      const ox = o.frame === 'deck' ? o.dx : o.px, oz = o.frame === 'deck' ? o.dz : o.pz; // (root ≈ deck coordinates for cars driving on the deck)
      const d = Math.hypot((ox - r.dx) / 1.9, (oz - r.dz) / 2.9); over = Math.max(over, 1 - smooth((d - 0.75) / 0.35));
    }
    const want = P.dragLift + P.dragOver * over;
    r.lift += (want - r.lift) * Math.min(1, dt * 14);
    r.h._lean = clamp(-r.vx * 0.035, -0.2, 0.2); r.h._nod = clamp(r.vz * 0.02, -0.12, 0.12);
    r.dyaw = clamp(r.vx * 0.04, -0.3, 0.3);
    r.h.roll(dt * 1.5);
    poseDeck(r);
  }
  function releaseDrag(r) {
    r.h._nod = 0; r.h.setGlow(0);
    if (r.wantsOut && phase === 'docked') { // let go over the ramp: drive off
      r.wantsOut = false;
      const zLand = clamp(r.dz, P.sternZ + 1.6, r.slot.z);
      r.counted = false; r.outSeq = ++seq;
      if (canStartOut(r, zLand)) { emit('carUnloadStart', { car: r.h }); emit('loadChanged', { count: count() - 1 }); startOut(r, zLand); }
      else { r.queueOut = true; r.counted = true; startHop(r, r.slot.x, r.slot.z, 0, 0.3, 0.26, 'parked'); }
      return;
    }
    r.wantsOut = false;
    const target = nearestSlot(r.dx, r.dz, r, true) || r.slot;
    if (target !== r.slot) {
      const other = target.rec, old = r.slot;
      if (other) { other.slot = old; old.rec = other; startHop(other, old.x, old.z, 0, 1.75, 0.5, 'parked'); } // swap: the other car jumps over
      else old.rec = null;
      r.slot = target; target.rec = r;
    }
    r.counted = true;
    startHop(r, r.slot.x, r.slot.z, 0, 0.28, P.settleTime, 'parked');
  }
  function dropPress() {
    const p = press; press = null;
    if (p && p.kind === 'car' && p.rec.state === 'drag') { p.rec.wantsOut = false; p.rec.h._nod = 0; p.rec.h.setGlow(0); p.rec.counted = true; startHop(p.rec, p.rec.slot.x, p.rec.slot.z, 0, 0.25, 0.25, 'parked'); }
  }
  function pointerUp(raycaster, { tap = false } = {}) {
    try {
      const p = press; press = null; if (!p) return;
      if (p.kind === 'ramp') {
        if (tap && !(phase === 'docked' && unloadNext())) { rampKick = 1; emit('sound', { id: 'clunk', volume: 0.6 }); }
        return;
      }
      if (p.kind !== 'car') return;
      const r = p.rec; if (recs.indexOf(r) < 0) return;
      if (r.state === 'drag') { releaseDrag(r); return; }
      if (tap && r.state === 'parked') {
        if (phase === 'docked') unloadCar(r.h);
        else { r.h._hop(0.32, 0.4); kick(0.07, r.dx, r.dz); emit('carPoke', { car: r.h }); }
      }
    } catch (e) { warn(e); }
  }
  function pointerCancel() { try { dropPress(); } catch (e) { warn(e); } }

  // =====================================================================================================
  // update
  // =====================================================================================================
  const noInput = {};
  function update(dt, input) {
    try {
      dt = Number.isFinite(dt) ? clamp(dt, 0, 0.05) : 0; input = input || noInput;
      time = Number.isFinite(input.time) ? input.time : time + dt;
      stepShip(dt, input);
      refreshFrames();
      stepRamp(dt);
      stepCars(dt);
      A0.set(P.cleats[0][0], P.cleats[0][1], P.cleats[0][2]).applyMatrix4(hull.matrix);
      A1.set(P.cleats[1][0], P.cleats[1][1], P.cleats[1][2]).applyMatrix4(hull.matrix);
      lines.update(dt, time, A0, A1);
      for (const h of factory.cars) h._tick(dt, time);
    } catch (e) { warn(e); }
  }

  // =====================================================================================================
  // misc API
  // =====================================================================================================
  function getRampFoot(outPos, outDir) {
    if (!docked) return false;
    root.updateMatrixWorld(true);
    if (outPos) outPos.set(0, quayY, footZ).applyMatrix4(root.matrixWorld);
    if (outDir) outDir.set(-Math.sin(root.rotation.y), 0, -Math.cos(root.rotation.y));
    return true;
  }
  function getState() {
    let busy = false; for (let i = 0; i < recs.length; i++) if (recs[i].state !== 'parked') busy = true;
    return { docked, count: count(), sink: mot.s, pitch: hull.rotation.x, roll: hull.rotation.z, rampAngle: rampAngleOut, busy, phase };
  }
  function reset() {
    for (let i = recs.length - 1; i >= 0; i--) recs[i].h.dispose();
    recs.length = 0; for (const s of slots) s.rec = null; press = null; glowSlot = null; glowAmt = 0; rampIntent = 0;
    phase = 'away'; docked = false; rampDown = false; rampMain = rampAngleOut = P.rampClosed; rampFoldA = P.rampFold; raiseT = -1; bounceT = -1; rampKick = 0; undockedSent = true;
    mot.s = mot.sv = mot.p = mot.pv = mot.r = mot.rv = 0; hint.ramp = hint.deckCars = 0;
    lines.off(); ramp.pose(rampMain, rampFoldA); ramp.setTwist(0); ramp.setGlow(0); slotGlow.visible = false; rampArrow.visible = false;
    hull.position.y = 0; hull.rotation.set(0, 0, 0); refreshFrames(); ramp.updateCables();
  }
  function dispose() {
    reset(); factory.dispose();
    for (const x of owned) if (x && x.dispose) x.dispose();
    owned.length = 0;
    if (root.parent) root.parent.remove(root);
  }
  function onContextRestored() { shadowTex.needsUpdate = true; frameTex.needsUpdate = true; ramp.cables.instanceMatrix.needsUpdate = true; }

  refreshFrames(); ramp.updateCables();

  return {
    root, capacity: slots.length, update, setTextures,
    createCar: (spec) => factory.createCar(spec),
    dock, undock, isDocked: () => docked,
    boardCar, unloadNext, unloadCar,
    getCars: () => recs.map((r) => r.h),
    getRampFoot, hitTest, pointerDown, pointerMove, pointerUp, pointerCancel,
    setHint(h) { if (!h) return; if (Number.isFinite(h.ramp)) hint.ramp = clamp(h.ramp, 0, 1); if (Number.isFinite(h.deckCars)) hint.deckCars = clamp(h.deckCars, 0, 1); },
    getState, reset, dispose, onContextRestored,
    params: P,
  };
}
