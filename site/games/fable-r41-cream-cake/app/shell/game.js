// Play flow (shell): decorate -> boxing -> give -> party -> leaving -> (new sponge) decorate.
// Input: one finger (pointer events). No text, no failure, no timers that end play.
import { THREE, clamp, lerp, smooth, follow, wobble, easeOut, easeInOut, easeBack, Tweens } from './util.js';
import { L, CREAM_COLORS, FLAVORS } from './world.js';

const HINT_IDLE = 3.5;

export class Game {
  constructor(ctx) {
    Object.assign(this, ctx); // renderer, camera, W, assets, sfx, tier, hero, items, customer, fx
    this.tw = new Tweens();
    this.scene = 'decorate';
    this.traysIn = true; // tools on screen (decorating); false from boxing until the next sponge comes
    this.round = 0;
    this.time = 0;
    this.colorIndex = 0;
    this.did = { cream: false, fruit: false, color: false, candle: false };
    this.angle = 0; this.angVel = 0; this.tickAcc = 0;
    this.idle = 0; this.hintCycle = 0; this.hint = null;
    this.ptr = null;
    this.ray = new THREE.Ray();
    this.raycaster = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();
    this.heroIn = { down: false, started: false, ended: false, ray: new THREE.Ray(), colorIndex: 0, time: 0 };
    this.flights = [];
    this.bagPos = L.bagHome.clone();
    this.bagTarget = L.bagHome.clone();
    this.bagOverride = null; // {pos} during the bowl dip
    this.bagSquash = 0;
    this.bagScale = this.W.bag.homeScale;
    this._home = L.bagHome.clone(); this._dh = new THREE.Vector3(); this._bagTrail = [];
    this.parcel = null;
    this.photoSlot = 0;
    this.photoTargets = [];
    this._v = new THREE.Vector3(); this._v2 = new THREE.Vector3(); this._plane = new THREE.Plane();
    this.customer.setAnimal(0, L.custWindow);
    this.W.setFlavor(FLAVORS[0]);
    this.setColor(0, true);
    this._bindInput();
    this.startHint(['bag', 'cake'], 3.2);
  }

  // ---------- helpers ----------
  // "did something": only used to decide whether the idle hint may point at the box. The box itself always works
  // (no required order: a plain cake can be given away too).
  get boxActive() { return this.hero.getState().strokes > 0 || this.items.placedCount > 0; }

  _setRay(cx, cy) {
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    this.ray.copy(this.raycaster.ray);
  }

  _planeHit(y, out) {
    this._plane.set(new THREE.Vector3(0, 1, 0), -y);
    return this.ray.intersectPlane(this._plane, out);
  }

  _pickables() {
    const W = this.W;
    return [W.bag.proxy, ...W.bowls.map((b) => b.proxy), ...this.items.proxies, W.box.proxy, this.customer.a.proxy];
  }

  setColor(i, silent = false) {
    this.colorIndex = i;
    const c = new THREE.Color(CREAM_COLORS[i].hex);
    this.W.bag.mat.color.copy(new THREE.Color(0xffffff).lerp(c, 0.75));
    this.W.bowls.forEach((b, k) => { b.selected = k === i; });
    if (!silent) this.did.color = this.did.color || i !== 0;
  }

  // ---------- input ----------
  _bindInput() {
    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', (e) => this.onDown(e));
    el.addEventListener('pointermove', (e) => this.onMove(e));
    el.addEventListener('pointerup', (e) => this.onUp(e, false));
    el.addEventListener('pointercancel', (e) => this.onUp(e, true));
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    for (const ev of ['gesturestart', 'gesturechange', 'dblclick']) document.addEventListener(ev, (e) => e.preventDefault(), { passive: false });
    document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  onDown(e) {
    if (this.ptr) return; // one finger only
    e.preventDefault();
    if (this.auto) this.cancelAuto();
    this.sfx.unlock();
    try { this.renderer.domElement.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    this._setRay(e.clientX, e.clientY);
    this.ptr = { id: e.pointerId, mode: 'none', x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: this.time, moved: 0 };
    this.idle = 0; this.stopHint();
    const p = this.ptr;

    if (this.scene === 'decorate') {
      this.angVel = 0;
      const hits = this.raycaster.intersectObjects(this._pickables(), false);
      const heroHit = this.hero.hitTest(this.ray);
      const heroDist = heroHit ? this.hero.root.localToWorld(this._v.copy(heroHit.point)).distanceTo(this.camera.position) : Infinity;
      // the bag on its way back to the tray can be caught again: in front of a bowl, or just near it (it moves)
      // ("moving" = not yet settled in its dock; bagAtHome()'s 0.3 is large next to the small tray-size bag)
      const tr = this._bagTrail, moved = tr.length > 1 && Math.hypot(tr[0][0] - tr[tr.length - 1][0], tr[0][1] - tr[tr.length - 1][1]) > 0.01;
      const bagMoving = moved || this.bagPos.distanceTo(L.bagHome) > 0.04 || this.W.bag.group.quaternion.angleTo(this.W.bag.restQ) > 0.15;
      let bagHit = bagMoving && hits.find((h) => h.object.userData.kind === 'bag');
      if (!bagHit && bagMoving && !heroHit && this._nearBag(e.clientX, e.clientY)) bagHit = { object: this.W.bag.proxy, distance: 0 };
      const first = bagHit || hits[0];
      if (first && first.distance < heroDist && !(heroHit && first.object.userData.kind === 'bag')) {
        const u = first.object.userData;
        if (u.kind === 'bag') { p.mode = 'bag'; this.sfx.pick(); }
        else if (u.kind === 'bowl') this.pickColor(u.index);
        else if (u.kind === 'tray') this.startCarry(u.index);
        else if (u.kind === 'box') { p.mode = 'box'; this.bounce(this.W.box.group, 0.15); this.sfx.hop(); }
        else if (u.kind === 'customer') this.pokeCustomer();
        return;
      }
      if (heroHit) { this.startPipe(); return; }
      p.mode = 'rotate';
      return;
    }
    if (this.scene === 'give') { p.mode = 'give'; return; }
    if (this.scene === 'party') {
      const hit = this.raycaster.intersectObject(this.customer.a.proxy, false)[0];
      if (hit) this.pokeCustomer(); else this.sparkleAtRay();
      return;
    }
    this.sparkleAtRay();
  }

  onMove(e) {
    const p = this.ptr;
    if (!p || e.pointerId !== p.id) return;
    const dx = e.clientX - p.x;
    p.moved += Math.hypot(e.clientX - p.x, e.clientY - p.y);
    p.x = e.clientX; p.y = e.clientY;
    this._setRay(p.x, p.y);
    if (p.mode === 'pipe') return; // hero reads the ray each frame
    if (p.mode === 'bag') {
      if (this.hero.hitTest(this.ray)) this.startPipe();
      return;
    }
    if (p.mode === 'rotate') {
      const w = this.renderer.domElement.clientWidth || 1000;
      const d = clamp((dx / w) * 4.2, -0.12, 0.12);
      this.rotate(d);
      p.vel = d;
      return;
    }
  }

  onUp(e, cancel) {
    const p = this.ptr;
    if (!p || e.pointerId !== p.id) return;
    this.ptr = null;
    this.idle = 0;
    const tap = p.moved < 14 && this.time - p.t < 0.4;
    if (p.mode === 'pipe') { this.heroIn.down = false; this.heroIn.ended = true; }
    else if (p.mode === 'bag' && tap && !cancel && this.scene === 'decorate') this.autoDollop();
    else if (p.mode === 'rotate' && tap && !cancel) this.tapCounter();
    else if (p.mode === 'carry') this.endCarry(p.type, tap && !cancel, cancel);
    else if (p.mode === 'rotate') { this.angVel = clamp((p.vel || 0) * 60, -2.2, 2.2); }
    else if (p.mode === 'box') this.startBoxing();
    else if (p.mode === 'give') this.deliver();
  }

  bagAtHome() { return this.bagPos.distanceTo(L.bagHome) < 0.3; }

  // Is (cx, cy) on or near where the bag was drawn in the last few frames? (it flies back to its tray after a
  // stroke; a child taps where they saw it a moment ago)
  _nearBag(cx, cy) {
    const r = this.renderer.domElement.getBoundingClientRect(), lim = Math.min(r.width, r.height) * 0.12;
    return this._bagTrail.some(([x, y]) => Math.hypot(cx - r.left - x * r.width, cy - r.top - y * r.height) < lim);
  }
  _trackBag() {
    const v = this.W.bag.group.localToWorld(this._v.set(0, 0.9, 0)).project(this.camera);
    if (this._bagTrail.length >= 6) this._bagTrail.shift();
    this._bagTrail.push([v.x * 0.5 + 0.5, 0.5 - v.y * 0.5]);
  }

  // The trays (and the bag's resting place, the customer's window) moved: resize / rotation. Snap, don't fly.
  onLayout() {
    if (!this.ptr && this.hero.getState().phase === 'idle' && !this.bagOverride) { this.bagPos.copy(L.bagHome); this.bagScale = this.W.bag.homeScale; }
    this._home.copy(L.bagHome);
    if (this.scene === 'decorate') { this.customer.pos.copy(L.custWindow); this.customer.target.copy(L.custWindow); }
  }

  // A tap on the bare counter still answers right away: a little sparkle where the finger was, and the
  // turntable gives a small nudge (it shows it can turn).
  tapCounter() {
    const p = this._planeHit(0, this._v2);
    if (p) this.fx.emit('star', p.setY(0.15), { n: 3, size: 0.18, colors: [0xffe27a, 0xffffff], life: 0.5, speed: 0.7 });
    this.sfx.sparkle(1);
    if (this.scene === 'decorate' && Math.abs(this.angVel) < 0.2) this.angVel = 0.6 * (Math.random() < 0.5 ? -1 : 1);
  }

  // A tap on the piping bag (without dragging it to the cake): the bag hops over and squeezes one small dollop
  // on a free spot facing the child, so tapping the glowing bag always makes cream appear.
  autoDollop() {
    const f = this.frontLocal();
    let best = null, bestS = -1e9;
    for (let k = 0; k < 14; k++) {
      const a = Math.random() * Math.PI * 2, r = 0.25 + Math.random() * 0.65;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const sc = (x * f.x + z * f.z) * 0.5 - this.hero.heightAt(x, z) * 2 + Math.random() * 0.2;
      if (sc > bestS) { bestS = sc; best = [x, z]; }
    }
    this.auto = { t: 0, dur: 0.42, x: best[0], z: best[1], y: this.hero.heightAt(best[0], best[1]), first: true };
  }

  cancelAuto() {
    if (!this.auto) return;
    this.auto = null;
    this.heroIn.down = false;
    this.hero.endStroke();
  }

  // ---------- actions ----------
  startPipe() {
    const p = this.ptr;
    p.mode = 'pipe';
    this.angVel = 0;
    this.heroIn.down = true; this.heroIn.started = true; this.heroIn.ended = false;
  }

  rotate(d) {
    const maxStep = 2.2 / 60;
    d = clamp(d, -maxStep * 2, maxStep * 2);
    this.angle += d;
    this.W.rotor.rotation.y = this.angle;
    this.tickAcc += Math.abs(d);
    if (this.tickAcc > 0.35) { this.tickAcc = 0; this.sfx.tick(); }
  }

  pickColor(i) {
    this.setColor(i);
    const b = this.W.bowls[i];
    this.bounce(b.lift, 0.2);
    this.sfx.dip();
    // bag hops to the bowl, dips, and comes back
    if (this.hero.getState().phase === 'idle') {
      // (the bowl sits in its tray dock: positions in the dock's frame, so the dip matches its on-screen size)
      const top = b.group.localToWorld(new THREE.Vector3(0, 0.95, 0));
      const lift = 0.35 * b.group.scale.y;
      this.bagOverride = { pos: top.clone() };
      this.tw.add(0.42, (k) => { if (this.bagOverride) this.bagOverride.pos.y = top.y + Math.sin(k * Math.PI) * lift; }, () => { this.bagOverride = null; });
    }
    this.fx.emit('star', b.group.localToWorld(new THREE.Vector3(0, 0.8, 0)), { n: 5, size: 0.22, colors: [CREAM_COLORS[i].hex, 0xffffff], life: 0.6, speed: 1.2 });
  }

  pokeCustomer() {
    const c = this.customer;
    c.hop(0.5); this.sfx.voice();
    this.fx.emit('heart', this._v.set(c.pos.x, 2.4, c.pos.z + 0.4), { n: 2, size: 0.35, colors: [0xff6f91, 0xff9bb3], up: 1.6, gravity: -0.4, speed: 0.6, life: 1.2 });
  }

  sparkleAtRay() {
    const p = this._planeHit(0.3, this._v2);
    if (p) { this.fx.emit('star', p, { n: 4, size: 0.2, colors: [0xffe27a, 0xffffff, 0xffb3c8], life: 0.6 }); this.sfx.sparkle(2); }
  }

  // ----- toppings -----
  startCarry(i) {
    const it = this.items;
    if (!it.canAdd(i)) { this.wiggleDish(i); return; }
    const t = it.types[i];
    this.ptr.mode = 'carry'; this.ptr.type = i;
    t.carry.visible = true;
    t.carry.position.copy(it.dishWorld(i, this._v));
    t.carry.rotation.set(0, 0, 0);
    t.carry.scale.setScalar(1.2);
    this.sfx.pick();
  }

  endCarry(i, tap, cancel) {
    const t = this.items.types[i];
    if (!t) return;
    const from = t.carry.position.clone();
    t.carry.visible = false;
    if (cancel) { this.fly(i, from, null, 'back'); return; }
    if (tap) {
      const spot = this.items.autoSpot(i, this.frontLocal());
      this.fly(i, from, spot, 'land', 0.5);
      return;
    }
    const hit = this.hero.hitTest(this.ray);
    if (hit) this.fly(i, from, { x: hit.point.x, z: hit.point.z }, 'land', 0.16);
    else this.fly(i, from, null, 'back');
  }

  frontLocal() {
    const q = this.W.cakeTop.getWorldQuaternion(new THREE.Quaternion()).invert();
    return new THREE.Vector3(0, 0, 1).applyQuaternion(q);
  }

  fly(i, from, spot, kind, dur = 0.38) {
    const t = this.items.types[i];
    const m = new THREE.Mesh(t.geo, t.mat);
    m.position.copy(from); m.scale.setScalar(1.15);
    this.W.scene.add(m);
    const f = { i, m, from: from.clone(), spot, kind, t: 0, dur };
    this.flights.push(f);
  }

  _updateFlights(dt) {
    for (const f of this.flights) {
      f.t += dt;
      const k = clamp(f.t / f.dur, 0, 1);
      let to;
      if (f.kind === 'land') {
        const h = this.hero.heightAt(f.spot.x, f.spot.z);
        to = this.W.cakeTop.localToWorld(this._v.set(f.spot.x, h, f.spot.z));
      } else to = this.items.dishWorld(f.i, this._v);
      const e = f.kind === 'land' && f.dur < 0.2 ? k * k : easeInOut(k);
      f.m.position.lerpVectors(f.from, to, e);
      f.m.position.y += Math.sin(k * Math.PI) * (f.dur > 0.3 ? 1.1 : 0.1);
      f.m.rotation.y += dt * 6;
      if (k >= 1) {
        f.done = true;
        this.W.scene.remove(f.m);
        if (f.kind === 'land') {
          const rec = this.items.land(f.i, f.spot.x, f.spot.z);
          const isCandle = this.items.types[f.i].key === 'candle';
          if (rec) {
            if (isCandle) { this.sfx.bell(); this.did.candle = true; } else { this.sfx.land(); this.did.fruit = true; }
            this.fx.emit('star', to, { n: 3, size: 0.16, colors: [0xffffff, 0xffe27a], life: 0.5, speed: 0.8 });
            if (Math.random() < 0.4) this.customer.hop(0.25);
          }
        } else this.sfx.back();
      }
    }
    if (this.flights.length && this.flights.some((f) => f.done)) this.flights = this.flights.filter((f) => !f.done);
  }

  // ---------- hero events ----------
  onHeroEvent(type, d) {
    if (type === 'stroke-start') { this.sfx.squeezeStart(); this.did.cream = true; this.W.cakeHalo.visible = false; }
    else if (type === 'stroke-end') { this.sfx.squeezeStop(); if (Math.random() < 0.3) this.customer.hop(0.25); }
    else if (type === 'tip') this.sfx.pop();
    else if (type === 'layer') this.sfx.squish();
    else if (type === 'stage') {
      const p = this.W.cakeTop.localToWorld(new THREE.Vector3(d && d.point ? d.point.x : 0, 0.6, 0));
      this.fx.emit('star', p, { n: 6 + 2 * d.level, size: 0.24, colors: [0xffe27a, 0xffffff, 0xffb3c8], life: 0.9 });
      this.sfx.sparkle(3);
      if (d.level >= 2) this.pokeCustomer();
    }
  }

  // ---------- completion: box -> give -> party -> leaving -> next ----------
  startBoxing() {
    if (this.scene !== 'decorate') return;
    this.stopHint();
    this.scene = 'boxing';
    this.traysIn = false;
    this.auto = null;
    this.hero.endStroke();
    this.sfx.squeezeStop();
    this.heroIn.down = false;
    this.angVel = 0;
    this.stopHint();
    // finish any flying toppings instantly
    for (const f of this.flights) f.t = f.dur;
    this._updateFlights(0);
    const box = this.W.box;
    box.halo.visible = false; box.shadow.visible = false;
    this.W.scene.attach(box.group); // leave the tray dock, keep where it is on screen
    const from = box.group.position.clone();
    const over = new THREE.Vector3(0, L.plateTop + 3.2, 0);
    const s0 = box.group.scale.x;
    box.bow.scale.setScalar(0.001);
    this.sfx.hop();
    this.tw.add(0.5, (k) => {
      const e = easeInOut(k);
      box.group.position.lerpVectors(from, over, e);
      box.group.position.y += Math.sin(k * Math.PI) * 1.0;
      box.group.scale.setScalar(lerp(s0, 1, e));
      box.group.rotation.y = 0;
    }, () => {
      this.tw.add(0.28, (k) => { box.group.position.y = lerp(over.y, L.plateTop, k * k); }, () => {
        this.sfx.thump();
        this.fx.emit('puff', this._v.set(0, 0.5, 1.6), { n: 6, size: 0.6, colors: [0xffffff], speed: 1.4, up: 0.3, gravity: 0, life: 0.6, spread: 1.2 });
        this.tw.add(0.3, (k) => box.bow.scale.setScalar(Math.max(0.001, easeBack(k))), () => this.sfx.pop());
        // the boxed cake becomes a parcel that can be handed over
        const parcel = new THREE.Group();
        this.W.scene.add(parcel);
        parcel.position.set(0, 0, 0);
        parcel.attach(this.W.cake);
        parcel.attach(box.group);
        this.parcel = parcel;
        this.customer.moveTo(L.custGive);
        this.customer.arms = 0;
        this.tw.add(0.6, (k) => { this.customer.arms = easeOut(k); }, () => {
          this.scene = 'give';
          this.giveT = 0;
        }, 0.3);
      });
    });
  }

  deliver() {
    if (this.scene !== 'give') return;
    this.scene = 'party';
    const parcel = this.parcel;
    const from = parcel.position.clone();
    // parcel origin is the turntable origin (cake bottom at +plateTop): lower it so the box sits on the counter
    const to = new THREE.Vector3(L.parcelGive.x, -L.plateTop, L.parcelGive.z);
    this.sfx.chime();
    this.tw.add(0.6, (k) => {
      const e = easeInOut(k);
      parcel.position.lerpVectors(from, to, e);
      parcel.position.y += Math.sin(k * Math.PI) * 0.6;
    }, () => this.party());
  }

  party() {
    const box = this.W.box, c = this.customer;
    c.hop(0.3);
    this.sfx.poof();
    const boxStart = box.group.position.clone();
    this.tw.add(0.6, (k) => {
      box.group.position.y = boxStart.y + easeOut(k) * 2.4;
      box.group.scale.setScalar(Math.max(0.001, 1 - k * k));
    }, () => { box.group.visible = false; });
    this.fx.emit('puff', this._v.copy(this.parcel.position).add(new THREE.Vector3(0, 2.4, 0)), { n: 8, size: 0.7, colors: [0xffffff, 0xffe4ec], speed: 1.6, up: 0.4, gravity: 0, life: 0.7, spread: 1.0 });
    const n = this.items.candleCount;
    const blowAt = 0.8;
    let t = blowAt;
    if (n > 0) {
      this.tw.add(0.3, (k) => { c.blow = k; c.lean = k; }, () => {
        this.sfx.blow();
        const mouth = new THREE.Vector3(c.pos.x, 1.7, c.pos.z + 0.6);
        const dir = this.W.cakeTop.getWorldPosition(new THREE.Vector3()).sub(mouth).normalize().multiplyScalar(2.2);
        this.fx.emit('puff', mouth, { n: 10, size: 0.28, colors: [0xffffff, 0xe8f6ff], dir, gravity: 0, life: 0.8, spread: 0.2 });
      }, blowAt);
      for (let k = 0; k < n; k++) {
        this.tw.wait(blowAt + 0.4 + k * 0.12, () => {
          const cnd = this.items.blowOut(k);
          if (cnd) this.fx.emit('puff', this.W.cakeTop.localToWorld(new THREE.Vector3(cnd.x, cnd.y + 0.65, cnd.z)), { n: 2, size: 0.18, colors: [0xdddddd], up: 0.9, gravity: 0.2, speed: 0.2, life: 0.9, spread: 0.05 });
          this.sfx.tone(900 - k * 40, 0.08, { vol: 0.06 });
        });
      }
      t = blowAt + 0.4 + n * 0.12 + 0.35;
      this.tw.add(0.2, (k) => { c.blow = 1 - k; c.lean = 1 - k; }, null, t - 0.2);
    }
    this.tw.wait(t, () => {
      c.delight(2.6); c.hop(0.6); c.arms = 0;
      this.tw.add(0.3, (k) => { c.armsUp = k; });
      this.tw.wait(0.5, () => c.hop(0.5));
      this.sfx.cheer(); this.sfx.voice();
      const top = this.W.cakeTop.getWorldPosition(new THREE.Vector3());
      this.fx.emit('heart', this._v.set(c.pos.x, 2.6, c.pos.z + 0.4), { n: 6, size: 0.4, colors: [0xff6f91, 0xff9bb3, 0xffc2d4], up: 2.0, gravity: -0.6, speed: 1.0, life: 1.6 });
      this.fx.emit('star', top.add(new THREE.Vector3(0, 1.2, 0)), { n: 18, size: 0.22, colors: [0xffe27a, 0xffb3c8, 0xbfe3f2, 0xc9e8b0, 0xffffff], up: 3.0, gravity: -3.0, speed: 2.0, life: 1.6 });
      this.tw.wait(0.35, () => this.takePhoto());
      this.tw.wait(2.4, () => this.leave());
    });
  }

  leave() {
    this.scene = 'leaving';
    const c = this.customer;
    c.armsUp = 0;
    this.tw.add(0.3, (k) => { c.arms = k; });
    const exit = new THREE.Vector3(9, 0, L.custGive.z);
    c.moveTo(exit);
    this.sfx.hop();
    const parcel = this.parcel;
    const off = parcel.position.clone().sub(c.pos);
    this.tw.add(1.3, () => { parcel.position.set(c.pos.x + off.x, c.a.root.position.y + off.y, c.pos.z + off.z); }, () => this.nextSponge());
  }

  nextSponge() {
    this.round++;
    this.traysIn = true; // trays slide back and the camera returns while the new sponge slides in
    const W = this.W;
    // bring the cake object back onto the turntable as a fresh sponge
    this.hero.reset();
    this.items.clear();
    W.rotor.attach(W.cake);
    this.angle = 0; W.rotor.rotation.y = 0;
    W.cake.position.set(-8, 0, 0); W.cake.rotation.set(0, 0, 0); W.cake.scale.setScalar(1);
    W.setFlavor(FLAVORS[this.round % FLAVORS.length]);
    W.scene.remove(this.parcel); this.parcel = null;
    // the box goes back home, folded small
    const box = W.box;
    box.dock.add(box.group);
    box.group.visible = true; box.group.position.set(0, 0, 0); box.group.rotation.set(0, 0, 0);
    box.group.scale.setScalar(0.001); box.bow.scale.setScalar(1);
    box.shadow.visible = true;
    this.tw.add(0.5, (k) => box.group.scale.setScalar(Math.max(0.001, L.boxHomeScale * easeBack(k))), null, 0.4);
    // a new customer pops up at the window
    this.customer.setAnimal(this.round, L.custWindow);
    this.sfx.boing();
    this.tw.add(0.7, (k) => { W.cake.position.x = lerp(-8, 0, easeBack(k)); }, () => {
      this.scene = 'decorate';
      this.did = { cream: false, fruit: this.did.fruit, color: this.did.color, candle: false };
      this.W.cakeHalo.visible = true;
      this.startHint(['bag', 'cake'], 3.0);
      this.idle = 0;
    });
  }

  // Photo of the customer with the cake, hung on the wall. Rendered into a 256² corner of the canvas itself (scissored)
  // and read back before this frame's normal render paints over it: rendering into a WebGLRenderTarget would have
  // made three compile a second, linear-output variant of every visible shader in the middle of the party (a visible
  // hitch on iPad). The pixels are kept on the CPU side, so the photo survives a context loss.
  takePhoto() {
    const r = this.renderer;
    const vp = r.getViewport(new THREE.Vector4()), sc = r.getScissor(new THREE.Vector4()), scOn = r.getScissorTest();
    try {
      const pr = r.getPixelRatio();
      const size = Math.min(256, r.domElement.width, r.domElement.height);
      const cam = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
      const c = this.customer.pos;
      const look = new THREE.Vector3((c.x + this.parcel.position.x) / 2, 1.3, (c.z + this.parcel.position.z) / 2);
      cam.position.copy(look).add(new THREE.Vector3(0, 1.4, 5.2));
      cam.lookAt(look);
      cam.updateMatrixWorld();
      r.setViewport(0, 0, size / pr, size / pr);
      r.setScissor(0, 0, size / pr, size / pr);
      r.setScissorTest(true);
      r.render(this.W.scene, cam);
      const gl = r.getContext();
      const px = new Uint8Array(size * size * 4);
      gl.readPixels(0, 0, size, size, gl.RGBA, gl.UNSIGNED_BYTE, px);
      const tex = new THREE.DataTexture(px, size, size);
      tex.colorSpace = THREE.SRGBColorSpace; // read from the canvas: already sRGB-encoded
      tex.needsUpdate = true; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter;
      tex.name = 'photo';
      const fr = this.W.frames[this.photoSlot % this.W.frames.length];
      this.photoSlot++;
      if (fr.tex) fr.tex.dispose();
      fr.tex = tex;
      fr.pic.material.map = tex; fr.pic.material.needsUpdate = true;
      fr.group.visible = true;
      this.tw.add(0.5, (k) => fr.group.scale.setScalar(Math.max(0.001, easeBack(k))));
      this.sfx.bell();
    } catch (err) { console.error('photo failed', err); }
    finally { r.setScissorTest(scOn); r.setScissor(sc); r.setViewport(vp); }
  }

  // ---------- hints ("光る・ぴょこっと揺れる") ----------
  hintTargets() {
    if (this._hintT && this._hintT.customer.group === this.customer.a.bodyG) return this._hintT;
    const W = this.W;
    return this._hintT = {
      bag: { group: W.bag.body, halo: W.bag.halo, mats: [W.bag.mat] },
      cake: { group: null, halo: W.cakeHalo, mats: [] },
      fruit: { group: null, halo: null, dish: [0, 1, 2, 3] },
      candle: { group: null, halo: null, dish: [4] },
      bowls: { group: null, halo: null, bowls: [1, 2, 3] },
      box: { group: W.box.group, halo: W.box.halo, mats: W.box.mats },
      customer: { group: this.customer.a.bodyG, halo: this.customer.halo, mats: [this.customer.a.mMain] },
    };
  }

  startHint(keys, dur = 1.8) {
    this.stopHint();
    this.hint = { keys, t: 0, dur };
  }
  stopHint() {
    if (!this.hint) return;
    const T = this.hintTargets();
    for (const k of this.hint.keys) {
      const h = T[k];
      if (h.halo) h.halo.visible = false;
      (h.mats || []).forEach((m) => m.emissive && m.emissive.setHex(0));
      if (h.group && h.group !== this.customer.a.bodyG) h.group.scale.setScalar(h.group === this.W.box.group ? L.boxHomeScale : 1);
    }
    this.W.dishHalos.forEach((m) => { m.visible = false; });
    this.W.bowls.forEach((b) => { b.halo.visible = false; });
    this.hint = null;
  }

  nextHintKeys() {
    const order = [];
    if (!this.did.cream) order.push(['bag', 'cake']);
    if (!this.did.fruit) order.push(['fruit']);
    if (!this.did.color) order.push(['bowls']);
    if (!this.did.candle) order.push(['candle']);
    if (this.boxActive) order.push(['box']);
    if (!order.length) order.push(['bag', 'cake']);
    return order[this.hintCycle++ % order.length];
  }

  _updateHint(dt) {
    if (this.scene === 'decorate' && !this.ptr && this.hero.getState().phase === 'idle') {
      this.idle += dt;
      if (!this.hint && this.idle > HINT_IDLE) { this.startHint(this.nextHintKeys(), 1.8); this.idle = 0; }
    }
    if (this.scene === 'give') {
      // customer and box keep inviting the hand-over
      this.giveT = (this.giveT || 0) + dt;
      const p = 0.5 + 0.5 * Math.sin(this.giveT * 5);
      this.customer.halo.visible = true; this.customer.halo.material.opacity = 0.2 + 0.35 * p;
      if (this.parcel) { const s = 1 + 0.03 * Math.max(0, Math.sin(this.giveT * 6)); this.parcel.scale.set(s, 1 / s, s); }
    } else if (this.customer.halo.visible && !(this.hint && this.hint.keys.includes('customer'))) this.customer.halo.visible = false;
    if (this.scene !== 'give' && this.parcel) this.parcel.scale.set(1, 1, 1);

    const h = this.hint;
    if (!h) return;
    h.t += dt;
    const T = this.hintTargets();
    const pulse = 0.5 - 0.5 * Math.cos(h.t * Math.PI * 2 / 0.9);
    const bump = Math.abs(wobble(h.t % 0.9, 16, 5));
    for (const k of h.keys) {
      const tg = T[k];
      if (tg.halo) { tg.halo.visible = true; tg.halo.material.opacity = 0.15 + 0.4 * pulse; }
      (tg.mats || []).forEach((m) => m.emissive && m.emissive.setRGB(0.25 * pulse, 0.2 * pulse, 0.08 * pulse));
      if (tg.group === this.W.bag.body) this.bagHop = bump;
      else if (tg.group) {
        const base = tg.group === this.W.box.group ? L.boxHomeScale : 1;
        tg.group.scale.set(base * (1 - bump * 0.12), base * (1 + bump * 0.25), base * (1 - bump * 0.12));
      }
      if (tg.dish) tg.dish.forEach((i) => { const m = this.W.dishHalos[i]; m.visible = true; m.material.opacity = 0.15 + 0.4 * pulse; this.dishBump(i, bump); });
      if (tg.bowls) tg.bowls.forEach((i) => { const b = this.W.bowls[i]; b.halo.visible = true; b.halo.material.opacity = 0.15 + 0.4 * pulse; b.lift.position.y = bump * 0.25; });
    }
    if (h.t > h.dur) { this.stopHint(); this.idle = 0; this.bagHop = 0; }
  }

  dishBump(i, bump) {
    this.items.trayBump = this.items.trayBump || [0, 0, 0, 0, 0];
    this.items.trayBump[i] = bump;
  }

  // ---------- small animations ----------
  bounce(obj, amt = 0.2) { const s = obj.scale.x; this.tw.add(0.45, (k) => { const w = wobble(k * 0.45, 20, 7) * amt; obj.scale.set(s * (1 - w * 0.5), s * (1 + w), s * (1 - w * 0.5)); }, () => obj.scale.setScalar(s)); }
  wiggle(obj) { this.tw.add(0.5, (k) => { obj.rotation.z = wobble(k * 0.5, 30, 7) * 0.12; }, () => { obj.rotation.z = 0; }); }
  wiggleDish(i) { this.sfx.wiggle(); this.tw.add(0.4, (k) => this.dishBump(i, Math.abs(wobble(k * 0.4, 30, 8)) * 0.6), () => this.dishBump(i, 0)); }

  // ---------- per frame ----------
  update(dt) {
    this.time += dt;
    this.tw.update(dt);
    const p = this.ptr;
    // the camera eases between framings: re-cast the held finger every frame so what is under it stays right
    if (p) this._setRay(p.x, p.y);

    // carry follows the finger, a bit above the cake height
    if (p && p.mode === 'carry') {
      const t = this.items.types[p.type];
      const hit = this._planeHit(L.cakeTopY + 0.55, this._v2);
      if (hit) t.carry.position.lerp(hit, follow(30, dt));
      t.carry.rotation.y += dt * 2;
    }
    // give: parcel follows the finger along the counter
    if (p && p.mode === 'give' && this.parcel) {
      const hit = this._planeHit(0, this._v2);
      if (hit) { this._v.set(clamp(hit.x, -3, 3), 0, clamp(hit.z, -3, 1.5)); this.parcel.position.lerp(this._v, follow(12, dt)); }
    }
    // turntable inertia (never auto-spins)
    if (!p && Math.abs(this.angVel) > 1e-3 && this.scene === 'decorate') {
      this.rotate(this.angVel * dt);
      this.angVel *= Math.exp(-6 * dt);
    }

    // hero
    const hi = this.heroIn;
    const au = this.auto;
    if (au) {
      // auto dollop: aim the hero's ray from the camera at the chosen spot (cake-local -> world)
      const target = this.W.cakeTop.localToWorld(this._v.set(au.x, au.y, au.z));
      hi.ray.origin.copy(this.camera.position);
      hi.ray.direction.copy(target).sub(this.camera.position).normalize();
      if (au.first) { hi.started = true; hi.down = true; au.first = false; }
      au.t += dt;
      if (au.t >= au.dur) { hi.down = false; hi.ended = true; this.auto = null; }
    } else hi.ray.copy(this.ray);
    hi.colorIndex = this.colorIndex;
    hi.time = this.time;
    this.hero.update(dt, hi);
    hi.started = false; hi.ended = false;
    const hs = this.hero.getState();
    this.sfx.squeezeFlow(hs.flow);
    if (hs.phase === 'idle' && this.sfx.squeeze) this.sfx.squeezeStop(); // safety if a stroke-end event never came

    // piping bag
    const W = this.W;
    if (hs.phase === 'flow' || hs.phase === 'tail') {
      this.bagTarget.copy(hs.nozzle);
      W.cakeTop.localToWorld(this.bagTarget);
      this.bagPos.lerp(this.bagTarget, follow(hs.phase === 'flow' ? 30 : 14, dt));
    } else if (p && p.mode === 'bag') {
      const hit = this._planeHit(L.cakeTopY + 0.5, this._v2);
      if (hit) this.bagPos.lerp(hit, follow(25, dt));
    } else if (this.bagOverride) {
      this.bagPos.lerp(this.bagOverride.pos, follow(22, dt));
    } else {
      // resting: the home is a tray dock that moves with the camera, carry the bag along with it
      this.bagPos.add(this._dh.copy(L.bagHome).sub(this._home));
      this._v.copy(L.bagHome); this._v.y += (this.hint && this.hint.keys.includes('bag') ? this.bagHop || 0 : 0) * 0.7 * (W.bag.homeScale / L.bagScale);
      this.bagPos.lerp(this._v, follow(this.hint ? 20 : 10, dt));
    }
    this._home.copy(L.bagHome);
    W.bag.group.position.copy(this.bagPos);
    const working = hs.phase !== 'idle' || (p && p.mode === 'bag') || this.bagOverride || this.bagPos.distanceTo(L.bagHome) > 0.8;
    // tray size at home, full size while working over the cake
    const away = smooth(this.bagPos.distanceTo(L.bagHome) / 1.6);
    const sGoal = hs.phase !== 'idle' || (p && p.mode === 'bag') ? L.bagScale : lerp(W.bag.homeScale, L.bagScale, away);
    this.bagScale = lerp(this.bagScale, sGoal, follow(10, dt));
    W.bag.group.scale.setScalar(this.bagScale);
    this._trackBag();
    W.bag.group.quaternion.slerp(working ? W.bag.workQ : W.bag.restQ, follow(working ? 16 : 11, dt));
    const squeeze = hs.flow;
    this.bagSquash = lerp(this.bagSquash, squeeze, follow(18, dt));
    const sq = this.bagSquash * (0.9 + 0.1 * Math.sin(this.time * 18));
    if (!(this.hint && this.hint.keys.includes('bag'))) W.bag.body.scale.set(1 - 0.14 * sq, 1 + 0.04 * sq, 1 - 0.14 * sq);
    W.bagShadow.visible = this.bagPos.distanceTo(L.bagHome) < 0.4;

    // selected bowl sits a little higher
    W.bowls.forEach((b) => { if (!(this.hint && this.hint.keys.includes('bowls'))) b.lift.position.y = lerp(b.lift.position.y, b.selected ? 0.12 : 0, follow(10, dt)); });

    // tray bump (hint / wiggle) - move the dish halo and display slightly
    if (this.items.trayBump) {
      this.items.trayBump.forEach((b, i) => { const g = this.items.trayGroups[i]; g.scale.set(1 - b * 0.12, 1 + b * 0.3, 1 - b * 0.12); });
    }

    this._updateFlights(dt);
    this.items.update(dt, this.time);
    this.customer.update(dt, this.time);
    this.fx.update(dt);
    this._updateHint(dt);

    // start-of-round cake glow pulses until the first cream
    if (W.cakeHalo.visible && !(this.hint && this.hint.keys.includes('cake'))) W.cakeHalo.material.opacity = 0.3 + 0.15 * Math.sin(this.time * 3);
    if (this.scene !== 'decorate') W.cakeHalo.visible = false;
  }
}
