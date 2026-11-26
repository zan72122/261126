// The play flow: load cars at a port → sail → dock anywhere → deliver to the family → again. Input routing & hints.
import * as THREE from './three.js';
import { clamp, damp, lerp, smooth, easeOutBack } from './util.js';
import { SPECIES, makeDriver } from './animals.js';
import { makeGift, randomGift } from './gifts.js';
import { QUAY } from './world.js';

const CAR_COLORS = [0xff6b6b, 0x4dabf7, 0xffd43b, 0x69db7c, 0xf783ac, 0xff922b, 0x9775fa, 0x63e6be];
const IDLE_HINT = 4; // seconds without touching before the next thing glows
const TAP_PX = 14, TAP_MS = 600;

export function createGame(ctx) {
  const { scene, camera, canvas, hero, world, nav, wheel, fx, audio, debug } = ctx;
  const carsGroup = new THREE.Group(); carsGroup.name = 'shell-cars'; scene.add(carsGroup);
  const giftsGroup = new THREE.Group(); giftsGroup.name = 'gifts'; scene.add(giftsGroup);
  const cars = []; // shell-owned + hero-owned car records
  const byHandle = new Map();
  const stats = { boarded: 0, unloaded: 0, delivered: 0, departures: 0, arrivals: 0, docked: 0, events: {} };
  let time = 0, lastInputT = -100, touchedOnce = false, hintLevel = 0;
  let arrivedWithCars = false, dockTimer = 0, undockWait = -1, dockWait = -1, cheerAt = -100;
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  // ---------------- cars ----------------
  let carSeq = 0;
  function newCar(port) {
    const spec = { id: carSeq++, color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)], driver: SPECIES[Math.floor(Math.random() * SPECIES.length)] };
    const h = hero.createCar(spec);
    const gift = makeGift(randomGift());
    h.cargoAnchor.add(gift);
    const rec = { h, spec, gift, port, state: 'waiting', path: null, s: 0, speed: 0, hop: 0, glow: 0, yaw: 0, quayY: QUAY.y };
    cars.push(rec); byHandle.set(h, rec);
    carsGroup.add(h.object);
    return rec;
  }
  function footLocal() { return { x: 0, z: -15.9 }; }
  function faceFoot(rec, x, z) { const f = footLocal(); return Math.atan2(f.x - x, f.z - z); }
  function placeLocal(rec, x, z, yawLocal) {
    const port = rec.port; port.local(x, QUAY.y, z, v1);
    rec.h.object.position.copy(v1); rec.yaw = port.yaw + yawLocal; rec.h.object.rotation.set(0, rec.yaw, 0);
  }
  function spawnWaiting(port, instant) {
    // fill the free waiting spots (a spot is free when no waiting car is near it)
    const waiting = port.waiting;
    let delay = 0;
    for (const sp of port.waitSpots) {
      if (waiting.length >= 3) break;
      port.local(sp.x, 0, sp.z, v2);
      if (waiting.some((r) => r.h.object.position.distanceTo(v3.set(v2.x, r.h.object.position.y, v2.z)) < 2.6)) continue;
      const rec = newCar(port); waiting.push(rec);
      if (instant) { placeLocal(rec, sp.x, sp.z, faceFoot(rec, sp.x, sp.z)); }
      else {
        placeLocal(rec, port.spawnFrom.x, port.spawnFrom.z, Math.PI / 2);
        const f = footLocal();
        const pts = [[port.spawnFrom.x, port.spawnFrom.z], [port.spawnFrom.x + 6, port.spawnFrom.z + 1], [sp.x - 2, sp.z - 1.5], [sp.x, sp.z], [sp.x + (f.x - sp.x) * 0.08, sp.z + (f.z - sp.z) * 0.08]];
        setPathLocal(rec, pts); rec.state = 'arriving'; rec.delay = delay; delay += 1.3;
        rec.h.object.visible = false;
      }
    }
  }
  function setPathLocal(rec, pts) {
    const port = rec.port;
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, z]) => port.local(x, QUAY.y, z)), false, 'centripetal');
    rec.path = { curve, len: Math.max(curve.getLength(), 0.01) }; rec.s = 0;
  }
  function followPath(rec, dt, vmax) {
    const remain = rec.path.len - rec.s;
    const want = Math.min(vmax, Math.sqrt(Math.max(remain, 0) * 2 * 3.5) + 0.25);
    rec.speed += clamp(want - rec.speed, -7 * dt, 3.5 * dt);
    const ds = Math.min(Math.max(rec.speed, 0) * dt, remain);
    rec.s += ds; rec.h.roll(ds);
    const u = rec.s / rec.path.len;
    rec.path.curve.getPointAt(clamp(u, 0, 1), v1); rec.path.curve.getTangentAt(clamp(u, 0, 1), v2);
    rec.h.object.position.copy(v1);
    if (v2.lengthSq() > 1e-6) rec.yaw = Math.atan2(v2.x, v2.z);
    rec.h.object.rotation.set(0, rec.yaw, 0);
    return rec.s >= rec.path.len - 1e-3;
  }

  // ---------------- ports ----------------
  world.setEvents({
    onPortBuilt(port) { spawnWaiting(port, true); },
    onReact(kind, obj, pos) {
      if (kind === 'ring') { audio.play('splash', 0.7); audio.play('sparkle', 0.6); fx.burst('drop', pos, 10, { color: 0xbfefff, up: 4, speed: 2, gravity: -9, size: 0.45, life: 0.9 }); fx.burst('star', pos, 5, { color: 0xffe066, up: 2.5, gravity: -1, size: 0.5 }); }
      if (kind === 'whale') { audio.play('spout', 1); audio.play('splash', 0.5); }
      if (kind === 'gulls') { audio.play('gull', 1); fx.burst('puff', pos, 6, { color: 0xffffff, up: 1, gravity: 0, size: 1.0, life: 0.8 }); }
      if (kind === 'lighthouse') { audio.play('bell', 1); fx.burst('star', pos, 12, { color: [0xfff3a0, 0xffd43b], up: 3, gravity: -1.5, size: 0.9, life: 1.6 }); }
    },
    onSpout(pos) { if (Math.random() < 0.7) fx.spawn({ type: 'drop', pos, vel: v3.set((Math.random() - 0.5) * 2.2, 7 + Math.random() * 3, (Math.random() - 0.5) * 2.2), gravity: -10, size: 0.55, life: 1.3, color: 0xd6f5ff }); },
  });
  spawnWaiting(world.ports[0], true);

  function currentPort() { const s = nav.state; return s.mode === 'docked' ? s.port : null; }
  function dockedHere(port) { return currentPort() === port && hero.isDocked(); }

  // ---------------- hero events ----------------
  function onHeroEvent(type, d) {
    stats.events[type] = (stats.events[type] || 0) + 1;
    switch (type) {
      case 'lineThrow': audio.play('rope', 0.8); break;
      case 'lineTaut': audio.play('taut', 0.8); break;
      case 'rampTouch': audio.play('rampTouch', 1); break;
      case 'docked': stats.docked++; dockWait = -1; onDocked(); break;
      case 'undocked': undockWait = -1; if (nav.state.mode === 'waitUndock') nav.startLeaving(); break;
      case 'carBoardStart': audio.play('engine', 0.9); stats.boarded++; break;
      case 'carOnRamp': audio.play('clunk', 0.9); break;
      case 'carParked': audio.play('pop', 0.6); if (d.car) { d.car.object.getWorldPosition(v1); v1.y += 1.5; fx.burst('star', v1, 6, { color: 0xffe066, up: 2, gravity: -2, size: 0.45 }); } break;
      case 'shipSink': audio.play('splash', clamp((d.amount || 0.06) * 14, 0.4, 1.2)); shipSplash(); break;
      case 'carPoke': audio.play('honk', 0.9); break;
      case 'carUnloadStart': audio.play('engine', 0.9); break;
      case 'carUnloaded': onCarUnloaded(d); break;
      case 'loadChanged': if ((d.count | 0) === 0 && arrivedWithCars && nav.state.mode === 'docked') arrivedWithCars = false; break;
      case 'sound': audio.play(d.id, d.volume ?? 1); break;
      default: break;
    }
  }
  function shipSplash() {
    const r = hero.root;
    for (const sx of [-1, 1]) {
      v1.set(sx * 4.3, 0.2, -2).applyMatrix4(r.matrixWorld);
      fx.burst('drop', v1, 5, { color: 0xd6f5ff, up: 3, speed: 1.5, gravity: -9, size: 0.4, life: 0.7 });
    }
  }
  function onDocked() {
    const port = nav.state.port; if (!port) return;
    arrivedWithCars = hero.getState().count > 0 && stats.arrivals > 0;
    dockTimer = 0;
    if (arrivedWithCars) for (const a of port.family) { a.wave(3); a.jump(2); }
  }

  // ---------------- delivery ----------------
  function onCarUnloaded({ car, position, yaw }) {
    carsGroup.attach(car.object); // ownership back to the shell (synchronously, as the spec says)
    let rec = byHandle.get(car);
    if (!rec) { rec = { h: car, spec: car.spec, gift: null, state: 'x', s: 0, speed: 0, hop: 0, glow: 0, yaw: 0 }; cars.push(rec); byHandle.set(car, rec); }
    const port = nav.state.port || world.ports[0];
    rec.port = port; stats.unloaded++;
    car.object.position.copy(position); car.object.position.y = QUAY.y; rec.yaw = yaw; car.object.rotation.set(0, yaw, 0);
    car.setGlow(0);
    port.deliverCount = (port.deliverCount || 0) + 1;
    const spot = port.deliverSpots[(port.deliverCount - 1) % port.deliverSpots.length];
    rec.spot = spot;
    const f = footLocal();
    setPathLocal(rec, [[f.x, f.z], [f.x, f.z - 2.4], [spot.x * 0.5, spot.z + 3.0], [spot.x, spot.z + 2.6], [spot.x, spot.z]]);
    rec.speed = 1.5; rec.state = 'toFamily';
    for (const a of port.family) a.wave(2);
  }
  function startGiving(rec) {
    rec.state = 'giving'; rec.t = 0;
    const port = rec.port;
    audio.play('honk', 0.7);
    if (rec.gift) {
      giftsGroup.attach(rec.gift);
      const child = port.family[2] || port.family[0];
      rec.giftFlight = { from: rec.gift.position.clone(), to: child ? child.object.getWorldPosition(new THREE.Vector3()).add(v3.set(0, 1.0, 0)) : rec.gift.position.clone(), t: 0, dur: 0.75 };
    }
  }
  function updateGiving(rec, dt) {
    rec.t += dt; const port = rec.port; const g = rec.gift;
    if (g && rec.giftFlight) {
      const fl = rec.giftFlight; fl.t += dt / fl.dur;
      const k = clamp(fl.t, 0, 1);
      g.position.lerpVectors(fl.from, fl.to, smooth(k)); g.position.y += Math.sin(k * Math.PI) * 2.6;
      g.rotation.y += dt * 6;
      if (fl.t >= 1 && !rec.received) {
        rec.received = true; stats.delivered++;
        for (const a of port.family) { a.jump(3); a.wave(3.5); }
        audio.play('joy', 1); audio.play('sparkle', 0.7);
        fx.burst('heart', fl.to, 10, { color: [0xff6b9a, 0xff8fb1, 0xff4d6d], up: 3.2, gravity: -0.8, speed: 1.5, size: 0.85, life: 1.8 });
        rec.decoFlight = { t: -1.2 };
        // the last present of this trip: the whole family celebrates (the "you did it" moment)
        const more = hero.getCars().length > 0 || cars.some((r) => r !== rec && r.port === port && (r.state === 'toFamily' || (r.state === 'giving' && !r.received)));
        if (!more && currentPort() === port) celebrate(port);
      }
    }
    if (rec.received && g && rec.decoFlight) {
      const df = rec.decoFlight; df.t += dt / 0.8;
      if (df.t >= 0 && !df.to) {
        const idx = (port.decoIdx = ((port.decoIdx ?? -1) + 1)) % port.decoAnchors.length;
        df.to = port.house.localToWorld(port.decoAnchors[idx].clone()); df.from = g.position.clone(); df.idx = idx;
        // replace an old decoration on the same anchor
        const old = port.decorations.find((d) => d.idx === idx);
        if (old) { old.removing = 0; }
      }
      if (df.to) {
        const k = clamp(df.t, 0, 1);
        g.position.lerpVectors(df.from, df.to, smooth(k)); g.position.y += Math.sin(k * Math.PI) * 1.8;
        g.rotation.y = lerp(g.rotation.y, 0, k);
        const sc = 1 + 0.6 * easeOutBack(k); g.scale.setScalar(sc);
        if (df.t >= 1) {
          port.decorations.push({ obj: g, idx: df.idx, base: df.to.clone(), removing: -1, phase: Math.random() * 6 });
          audio.play('pop', 0.8); fx.burst('star', df.to, 8, { color: [0xffe066, 0xffffff], up: 2, gravity: -1.5, size: 0.5 });
          rec.gift = null; rec.decoFlight = null;
        }
      }
    }
    if (rec.t > 1.6 && rec.state === 'giving') goPark(rec);
  }
  function celebrate(port) {
    stats.celebrations = (stats.celebrations || 0) + 1; cheerAt = time;
    setTimeout(() => {
      for (const a of port.family) { a.jump(5); a.wave(5); }
      audio.play('fanfare', 1);
      const mid = port.family[1] || port.family[0];
      if (mid) {
        mid.object.getWorldPosition(v1); v1.y += 2.6; // above the family, so it stays inside the port view
        fx.burst('heart', v1, 16, { color: [0xff6b9a, 0xff8fb1, 0xff4d6d], up: 3, gravity: -1.5, speed: 4, spread: 1, size: 1.1, life: 2.4 });
        fx.burst('star', v1, 18, { color: [0xffe066, 0xffffff, 0x9fe0ff, 0xb197fc], up: 4, gravity: -4, speed: 5, spread: 1, size: 0.75, life: 2.0, spin: 3 });
      }
    }, 700);
  }
  function goPark(rec) {
    const port = rec.port;
    let spot = port.parkSpots.find((p) => !p.car);
    if (!spot) {
      // the oldest parked car drives home into town
      spot = port.parkSpots.reduce((a, b) => (a.car.parkedAt < b.car.parkedAt ? a : b));
      const old = spot.car; spot.car = null; old.state = 'leaving';
      setPathLocal(old, [[spot.x, spot.z], [spot.x, spot.z - 3.0], [spot.x - 3, port.leaveTo.z], [port.leaveTo.x, port.leaveTo.z]]);
    }
    spot.car = rec; rec.parkSpot = spot;
    const sp = rec.spot;
    // around the family's left side, behind the waiting cars, into a row facing the town
    setPathLocal(rec, [[sp.x, sp.z], [sp.x - 1.8, sp.z - 1.2], [1.6, -24.4], [spot.x + 2.2, -25.4], [spot.x + 0.3, -27.2], [spot.x, spot.z]]);
    rec.state = rec.gift ? 'toParkKeepGift' : 'toPark';
  }

  function updateDecorations(dt) {
    for (const p of world.ports) {
      for (let i = p.decorations.length - 1; i >= 0; i--) {
        const d = p.decorations[i];
        if (d.removing >= 0) {
          d.removing += dt / 0.4; d.obj.scale.setScalar(Math.max(0.001, 1.6 * (1 - d.removing)));
          if (d.removing >= 1) { giftsGroup.remove(d.obj); p.decorations.splice(i, 1); }
          continue;
        }
        if (d.obj.userData.giftType === 'balloon') d.obj.position.y = d.base.y + Math.sin(time * 1.5 + d.phase) * 0.12;
        else if (d.obj.userData.giftType === 'star') d.obj.rotation.y += dt * 0.8;
      }
    }
  }

  // ---------------- leaving / arriving ----------------
  function depart() {
    if (nav.state.mode !== 'docked' || !hero.isDocked()) return false;
    nav.state.mode = 'waitUndock'; undockWait = 0;
    stats.departures++;
    if (drag && drag.kind === 'car') endCarDrag();
    hero.undock();
    audio.play('horn', 1); funnelPuffs();
    arrivedWithCars = false;
    return true;
  }
  nav.setHandlers({
    onBump() { audio.play('boing', 0.9); },
    onArrive(port) { stats.arrivals++; dockWait = 0; hero.root.position.set(nav.state.x, 0, nav.state.z); hero.root.rotation.y = nav.state.yaw; hero.root.updateMatrixWorld(true); hero.dock(port.berth); },
  });

  // ---------------- input ----------------
  let drag = null; // { kind: 'wheel'|'hero'|'car'|'none', id, x0, y0, t0, moved }
  function setRay(x, y) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
  }
  function quayPoint(port, out) {
    const t = (QUAY.y - raycaster.ray.origin.y) / (raycaster.ray.direction.y || -1e-6);
    if (t <= 0) return null;
    return out.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, t);
  }
  function pickShell() {
    let best = null;
    const objs = []; const recs = [];
    for (const rec of cars) if (rec.state === 'waiting' || rec.state === 'parked' || rec.state === 'toPark' || rec.state === 'toFamily' || rec.state === 'giving') { objs.push(rec.h.object); recs.push(rec); }
    const hits = raycaster.intersectObjects(objs, true);
    if (hits.length) {
      let o = hits[0].object; while (o && !recs.some((r) => r.h.object === o)) o = o.parent;
      const rec = recs.find((r) => r.h.object === o);
      if (rec) best = { kind: 'car', rec, distance: hits[0].distance, point: hits[0].point };
    }
    if (!best) {
      // a near miss still counts: the closest waiting / parked car within 1.7 m of the finger's ray
      let bd2 = 1.7 * 1.7;
      for (const rec of recs) {
        v3.copy(rec.h.object.position); v3.y += 0.7;
        const d2 = raycaster.ray.distanceSqToPoint(v3);
        if (d2 < bd2) { bd2 = d2; best = { kind: 'car', rec, distance: raycaster.ray.origin.distanceTo(v3), point: v3.clone() }; }
      }
    }
    for (const p of world.ports) {
      if (!p.built || p.group.position.distanceTo(camera.position) > 140) continue;
      const fo = p.family.map((a) => a.object); if (p.house) fo.push(p.house);
      const h = raycaster.intersectObjects(fo, true);
      if (h.length && (!best || h[0].distance < best.distance)) best = { kind: 'family', port: p, distance: h[0].distance };
    }
    const w = world.hitTest(raycaster.ray);
    if (w && (!best || w.distance < best.distance)) best = { kind: 'friend', obj: w.obj, distance: w.distance };
    return best;
  }
  function frontWaiting(port) {
    if (!port) return null;
    let best = null, bd = Infinity; const f = port.local(0, QUAY.y, -15.9, v3);
    for (const r of port.waiting) if (r.state === 'waiting') { const d = r.h.object.position.distanceTo(f); if (d < bd) { bd = d; best = r; } }
    return best;
  }

  function onDown(e) {
    if (drag) return; // one finger only
    audio.unlock();
    touchedOnce = true; lastInputT = time;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const h = canvas.clientHeight;
    const r = canvas.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), moved: 0, kind: 'none' };
    if (wheel.hit(x, y, h)) {
      drag.kind = 'wheel'; drag.tickAcc = 0; wheel.grab(x, y, h); audio.play('tick', 1); return;
    }
    setRay(e.clientX, e.clientY);
    const hh = hero.hitTest(raycaster);
    const sh = pickShell();
    if (hh && (!sh || hh.distance <= sh.distance)) {
      if (hero.pointerDown(raycaster, hh)) { drag.kind = 'hero'; if (hh.kind === 'car') audio.play('honk', 0.5); return; }
    }
    if (sh) {
      if (sh.kind === 'car') {
        const rec = sh.rec; rec.hop = 1; audio.play('honk', 0.8);
        if (rec.state === 'waiting') { drag.kind = 'car'; drag.rec = rec; rec.state = 'drag'; rec.lastP = rec.h.object.position.clone(); }
        return;
      }
      if (sh.kind === 'family') {
        for (const a of sh.port.family) { a.wave(2); a.jump(1); }
        audio.play('pop', 0.7);
        if (dockedHere(sh.port)) hero.unloadNext();
        return;
      }
      if (sh.kind === 'friend') { world.poke(sh.obj, time); return; }
    }
    // the sea: a little splash where the finger is
    const t = -raycaster.ray.origin.y / (raycaster.ray.direction.y || -1e-6);
    if (t > 0) { v1.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, t); fx.burst('drop', v1, 5, { color: 0xd6f5ff, up: 2.5, speed: 1.2, gravity: -8, size: 0.35, life: 0.6 }); fx.spawn({ type: 'ring', pos: v1.clone().setY(0.1), size: 1.2, grow: 2.5, life: 0.8, flat: true, color: 0xffffff, alpha: 0.8 }); audio.play('splash', 0.25); }
  }
  function onMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    lastInputT = time;
    drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0));
    const r = canvas.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
    if (drag.kind === 'wheel') {
      const d = wheel.drag(x, y, canvas.clientHeight);
      drag.tickAcc += Math.abs(d); if (drag.tickAcc > Math.PI / 6) { drag.tickAcc = 0; audio.play('tick', 0.8); }
      onWheelTurn(d);
      return;
    }
    setRay(e.clientX, e.clientY);
    if (drag.kind === 'hero') { hero.pointerMove(raycaster); return; }
    if (drag.kind === 'car') moveCarDrag(drag.rec);
  }
  function onUp(e) {
    audio.unlock(); // iOS: also resume audio on the end of a touch
    if (!drag || e.pointerId !== drag.id) return;
    const tap = drag.moved < TAP_PX && performance.now() - drag.t0 < TAP_MS;
    const d = drag;
    setRay(e.clientX, e.clientY);
    if (d.kind === 'wheel') { wheel.release(); onWheelRelease(tap, d); }
    else if (d.kind === 'hero') hero.pointerUp(raycaster, { tap });
    else if (d.kind === 'car') {
      const rec = d.rec;
      if (rec.state === 'drag') {
        if (tap) { if (!(dockedHere(rec.port) && boardShellCar(rec, null))) { rec.state = 'waiting'; } }
        else rec.state = 'waiting';
      }
    }
    drag = null;
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  }
  function onCancel(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.kind === 'wheel') wheel.release();
    if (drag.kind === 'hero') hero.pointerCancel();
    if (drag.kind === 'car' && drag.rec.state === 'drag') drag.rec.state = 'waiting';
    drag = null;
  }
  function endCarDrag() { if (drag && drag.rec && drag.rec.state === 'drag') drag.rec.state = 'waiting'; drag = null; }

  function boardShellCar(rec, point) {
    if (!hero.boardCar(rec.h, { point })) return false;
    rec.state = 'hero'; rec.h.setGlow(0); rec.hop = 0;
    const w = rec.port.waiting; const i = w.indexOf(rec); if (i >= 0) w.splice(i, 1);
    return true;
  }
  const footW = new THREE.Vector3(), footDir = new THREE.Vector3();
  function moveCarDrag(rec) {
    const port = rec.port;
    // over the ship or the ramp → it drives aboard by itself
    if (dockedHere(port)) {
      const hh = hero.hitTest(raycaster);
      if (hh) { if (boardShellCar(rec, hh.point)) { drag.kind = 'none'; return; } }
    }
    const p = quayPoint(port, v1); if (!p) return;
    port.group.worldToLocal(v2.copy(p));
    v2.x = clamp(v2.x, -QUAY.halfW + 1.6, QUAY.halfW - 1.6); v2.z = clamp(v2.z, -45, QUAY.edgeZ - 1.3);
    port.local(v2.x, QUAY.y, v2.z, v2);
    if (dockedHere(port) && hero.getRampFoot(footW, footDir) && v2.distanceTo(footW) < 2.4) { if (boardShellCar(rec, null)) { drag.kind = 'none'; return; } }
    rec.dragTarget = (rec.dragTarget || new THREE.Vector3()).copy(v2);
  }

  // wheel → departure / steering
  function onWheelTurn(d) {
    const s = nav.state;
    if (s.mode === 'sail' || s.mode === 'leaving') { nav.steer(d); return; }
    if (s.mode === 'docked') {
      drag.turned = (drag.turned || 0) + Math.abs(d);
      if (hero.getState().count > 0) { if (drag.turned > 0.35) depart(); }
      else {
        // empty deck: first the waiting car hops and honks ("take me!"); keep turning and the ship sails anyway
        if (drag.turned > 0.8 && !drag.calledCar) { drag.calledCar = true; callForCar(); }
        if (drag.turned > 4.2 && hero.isDocked() && !hero.getState().busy) depart();
      }
    }
  }
  function onWheelRelease(tap) {
    const s = nav.state;
    if (!tap) return;
    if (s.mode === 'docked') { if (hero.getState().count > 0) depart(); else callForCar(); }
    else if (s.mode === 'sail' || s.mode === 'leaving') { nav.push(0.22); audio.play('horn', 0.5); funnelPuffs(); }
  }
  // the horn: white puffs from the two funnels (ship frame (±2.68, 8.0, 5.7), docs/hero-notes.md §7-5)
  function funnelPuffs() {
    hero.root.updateMatrixWorld(true);
    for (const sx of [-2.68, 2.68]) for (let k = 0; k < 3; k++) {
      v1.set(sx, 8.1, 5.7).applyMatrix4(hero.root.matrixWorld);
      fx.spawn({ type: 'puff', pos: v1, vel: v2.set((Math.random() - 0.5) * 0.6, 2.2 + k * 0.9, (Math.random() - 0.5) * 0.6), size: 1.1 + k * 0.3, grow: 1.6, life: 1.6, color: 0xffffff, alpha: 0.85, drag: 0.6 });
    }
  }
  function callForCar() {
    audio.play('horn', 0.7); funnelPuffs();
    const fw = frontWaiting(currentPort());
    if (fw) { fw.hop = 1; fw.glow = 1; setTimeout(() => audio.play('honk', 0.8), 450); }
  }

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);
  canvas.addEventListener('lostpointercapture', onCancel);
  const prevent = (e) => e.preventDefault();
  canvas.addEventListener('contextmenu', prevent);
  document.addEventListener('gesturestart', prevent);
  canvas.addEventListener('touchstart', prevent, { passive: false });
  canvas.addEventListener('touchmove', prevent, { passive: false });

  // ---------------- per-frame ----------------
  const refill = new Map(); // port -> timer
  function update(dt, t) {
    time = t;
    const s = nav.state;
    // timeouts guard against a stuck hero (should never trigger)
    if (undockWait >= 0) { undockWait += dt; if (undockWait > 3.5) { debug && debug.warn('hero did not send undocked in time'); undockWait = -1; if (s.mode === 'waitUndock') nav.startLeaving(); } }
    if (dockWait >= 0) { dockWait += dt; if (dockWait > 4) { debug && debug.warn('hero did not send docked in time'); dockWait = -1; } }
    if (s.mode === 'docked') dockTimer += dt;

    // ports: beacons dim for the port we are at / just left
    for (const p of world.ports) p.active = !(p === s.port && (s.mode === 'docked' || s.mode === 'waitUndock')) && !(p === s.lastPort && !s.leftFar);

    // refill waiting cars: when the ship is away, or when everything here has been loaded
    for (const p of world.ports) {
      if (!p.built) continue;
      const away = Math.hypot(p.origin.x - s.x, p.origin.z - s.z) > 35;
      const emptyHere = s.port === p && s.mode === 'docked' && dockTimer > 6 && p.waiting.length === 0 && hero.getState().count < hero.capacity;
      if ((away || emptyHere) && p.waiting.length < 3) {
        const tt = (refill.get(p) || 0) + dt; refill.set(p, tt);
        if (tt > (away ? 5 : 1)) { refill.set(p, 0); spawnWaiting(p, false); }
      } else refill.set(p, 0);
    }

    // shell cars
    for (let i = cars.length - 1; i >= 0; i--) {
      const rec = cars[i]; const o = rec.h.object;
      switch (rec.state) {
        case 'arriving':
          if (rec.delay > 0) { rec.delay -= dt; break; }
          o.visible = true;
          if (followPath(rec, dt, 5)) { rec.state = 'waiting'; rec.hop = 1; audio.play('honk', 0.5); }
          break;
        case 'drag': {
          if (rec.dragTarget) {
            const before = v3.copy(o.position);
            o.position.x = damp(o.position.x, rec.dragTarget.x, 0.07, dt); o.position.z = damp(o.position.z, rec.dragTarget.z, 0.07, dt);
            const dx = o.position.x - before.x, dz = o.position.z - before.z, dist = Math.hypot(dx, dz);
            if (dist > 0.01) { const want = Math.atan2(dx, dz); rec.yaw += Math.atan2(Math.sin(want - rec.yaw), Math.cos(want - rec.yaw)) * Math.min(1, dt * 10); o.rotation.set(0, rec.yaw, 0); rec.h.roll(dist); }
          }
          o.position.y = QUAY.y + 0.12 + Math.sin(t * 14) * 0.02;
          break;
        }
        case 'toFamily':
          if (followPath(rec, dt, 5)) startGiving(rec);
          break;
        case 'giving': updateGiving(rec, dt); break;
        case 'toPark': case 'toParkKeepGift':
          if (rec.gift && rec.decoFlight) updateGiving(rec, dt); // the gift may still be flying to the house
          if (followPath(rec, dt, 4)) { rec.state = 'parked'; rec.parkedAt = t; }
          break;
        case 'leaving':
          if (followPath(rec, dt, 4)) {
            const k = (rec.shrink = (rec.shrink || 1) - dt * 2.5);
            o.scale.setScalar(Math.max(0.001, k));
            if (k <= 0) { cars.splice(i, 1); byHandle.delete(rec.h); if (rec.gift) rec.gift.removeFromParent(); rec.h.dispose(); }
          }
          break;
        default: break;
      }
      // hop (shell-owned cars only)
      if (rec.state !== 'hero' && rec.state !== 'drag') {
        rec.hop = Math.max(0, rec.hop - dt / 0.45);
        o.position.y = QUAY.y + Math.sin((1 - rec.hop) * Math.PI) * 0.35 * (rec.hop > 0 ? 1 : 0) + (rec.hintHop || 0);
      }
    }
    updateDecorations(dt);
    updateHints(dt);
  }

  // ---------------- hints ----------------
  function updateHints(dt) {
    const idle = time - lastInputT;
    const want = (!touchedOnce || idle > IDLE_HINT) ? 1 : 0;
    hintLevel = damp(hintLevel, want, want ? 0.5 : 0.08, dt);
    const s = nav.state; const port = currentPort(); const hs = hero.getState();
    let ramp = 0, deckCars = 0, wheelH = 0, front = null, callFamily = false;
    if (port && hero.isDocked()) {
      if (arrivedWithCars && hs.count > 0) { deckCars = 1; callFamily = true; if (idle > 12) wheelH = 0.6; }
      else {
        if (hs.count < hero.capacity) { front = frontWaiting(port); if (front) ramp = 1; }
        if (hs.count > 0) wheelH = 1;
      }
    } else if (s.mode === 'sail') wheelH = 1;
    const L = hintLevel;
    hero.setHint({ ramp: ramp * L, deckCars: deckCars * L });
    wheel.setHint(Math.max(wheelH * L, 0));
    const pulse = 0.35 + 0.25 * Math.sin((2 * Math.PI * time) / 1.2);
    for (const rec of cars) {
      if (rec.state !== 'waiting') { if (rec.glow) { rec.glow = 0; rec.h.setGlow(0); } rec.hintHop = 0; continue; }
      const g = rec === front ? L : damp(rec.glow || 0, 0, 0.3, dt);
      rec.glow = g; rec.h.setGlow(g * pulse / 0.6);
      const ph = (time % 2) / 0.35;
      rec.hintHop = rec === front && ph < 1 ? Math.sin(ph * Math.PI) * 0.32 * L : 0; // a clear little hop: "me first!"
      if (rec === front && L > 0.05) fx.ring(v1.copy(rec.h.object.position).setY(QUAY.y + 0.06), 4.8 + Math.sin(time * 5) * 0.3, L * (0.75 + 0.25 * Math.sin(time * 5)));
    }
    if (callFamily && L > 0.5 && port) {
      port._callT = (port._callT || 0) + dt;
      if (port._callT > 3) { port._callT = 0; for (const a of port.family) a.wave(1.6); }
    }
  }

  // ---------------- reset ----------------
  function reset() {
    hero.reset();
    undockWait = dockWait = -1; // the hero sends no events on reset
    if (drag) { if (drag.kind === 'wheel') wheel.release(); drag = null; }
    for (const rec of cars) { if (rec.gift) rec.gift.removeFromParent(); if (rec.state !== 'hero') rec.h.dispose(); }
    cars.length = 0; byHandle.clear();
    for (const p of world.ports) {
      p.waiting.length = 0; p.parkSpots.forEach((sp) => (sp.car = null));
      p.decorations.forEach((d) => giftsGroup.remove(d.obj)); p.decorations.length = 0; p.deliverCount = 0; p.decoIdx = -1;
    }
    giftsGroup.clear();
    nav.placeAtBerth(world.ports[0]);
    hero.root.position.set(nav.state.x, 0, nav.state.z); hero.root.rotation.y = nav.state.yaw; hero.root.updateMatrixWorld(true);
    hero.dock(world.ports[0].berth, { instant: true });
    for (const p of world.ports) if (p.built) spawnWaiting(p, true);
    arrivedWithCars = false; touchedOnce = false; cheerAt = -100;
  }

  // ---------------- what the camera should look at ----------------
  // deck: hero cars at rest; active: hero cars that are moving (boarding / unloading / dragged); front: the next waiting
  // car (the one that glows); waiting: the other waiting cars; moving: cars driving to the family or giving presents.
  const camView = { dragging: false, delivering: false, cheer: false, deck: [], active: [], waiting: [], moving: [], front: null };
  const camPool = []; let camPi = 0; const lastPos = new WeakMap(); let lastViewT = -1;
  const camVec = (o) => { if (camPi >= camPool.length) camPool.push(new THREE.Vector3()); return o.getWorldPosition(camPool[camPi++]); };
  function view() {
    const v = camView; camPi = 0;
    v.deck.length = 0; v.active.length = 0; v.waiting.length = 0; v.moving.length = 0; v.front = null;
    v.dragging = !!drag && (drag.kind === 'car' || drag.kind === 'hero');
    const port = currentPort();
    v.cheer = !!port && time - cheerAt < 6;
    v.delivering = !!port && arrivedWithCars && hero.getState().count > 0;
    const dt = Math.max(time - lastViewT, 1e-3); lastViewT = time;
    if (!port) return v;
    for (const h of hero.getCars()) {
      const p = camVec(h.object); let lp = lastPos.get(h);
      const moving = lp && lp.distanceTo(p) / dt > 0.35;
      if (!lp) { lp = new THREE.Vector3(); lastPos.set(h, lp); }
      if (moving) { lp.t = time; } lp.copy(p);
      (moving || time - (lp.t ?? -9) < 0.6 ? v.active : v.deck).push(p);
    }
    const fw = frontWaiting(port);
    for (const rec of cars) {
      if (rec.port !== port) continue;
      if (rec.state === 'waiting' || rec.state === 'drag') { const p = camVec(rec.h.object); if (rec === fw) v.front = p; else v.waiting.push(p); }
      else if (rec.state === 'toFamily' || rec.state === 'giving') { v.moving.push(camVec(rec.h.object)); v.delivering = true; }
    }
    return v;
  }

  return {
    update, onHeroEvent, reset, depart, stats, cars, view,
    get hintLevel() { return hintLevel; },
    debugInfo() { const s = nav.state; return { mode: s.mode, port: s.port ? s.port.index : -1, speed: +nav.speed.toFixed(2), hero: hero.getState(), cars: cars.length, waiting: world.ports.map((p) => p.waiting.length), deco: world.ports.map((p) => p.decorations.length), stats }; },
    // helpers for the smoke test / debug keys
    tapWaitingCar(portIndex) { const p = world.ports[portIndex]; const r = frontWaiting(p); return r ? boardShellCar(r, null) : false; },
  };
}
