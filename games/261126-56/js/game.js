// Game flow: put on apron & gloves -> tie the white cloths -> dip in indigo / pink (papa knocks a tub over,
// the girl rights it and refills it) -> hang on the line, untie, watch the pattern appear and dry in the wind
// -> hand each cloth to its owner -> free play.
import * as THREE from '../vendor/three.module.min.js';
import { Cloth, makeDyeMaterial } from './cloth.js';
import { Drops, Liquid, makePuddle, Sparkle } from './fx.js';
import { Audio } from './audio.js';
import { buildApron, buildStool, buildSign, buildBasket, buildJar, clothespin } from './props.js';
import { SUN_DIR } from './world.js';

const V3 = THREE.Vector3;
const PATIO = 0.015;
const clamp = THREE.MathUtils.clamp;
const ease = (t) => t * t * (3 - 2 * t);

export class Game {
  constructor(ctx) {
    Object.assign(this, ctx);
    this.audio = new Audio();
    this.t = 0; this.idle = 0; this.state = 'intro'; this.stateT = 0;
    this.ray = new THREE.Raycaster();
    this.ptr = new THREE.Vector2(); this.ptrDown = false;
    this.handEl = document.getElementById('hand');
    this.againEl = document.getElementById('again');
    this.fsEl = document.getElementById('fs');
    this.windT = 0; this.wind = new V3(); this.windAmt = 0.3; this.gust = 0;
    this.camCur = { pos: new V3(-0.8, 1.0, 2.0), tgt: new V3(-1.0, 0.6, -0.4) }; this.camInit = false;
    this.focusX = null;
    this.tasks = []; this.anims = [];
    this.setupScene();
    this.bindInput();
    if (this.Q.get('skip')) this.debugSkip(this.Q.get('skip'));
  }

  // ---------------------------------------------------------------- setup
  setupScene() {
    const { scene, world, T, girl } = this;
    girl.group.position.set(-1.0, PATIO, -0.36);
    girl.setFeel('happy', 2);
    // apron on the girl (hidden until she puts it on)
    this.apronWorn = buildApron(girl, T);
    this.apronWorn.parts.forEach((p) => (p.visible = false));
    // props
    this.stool = buildStool(world, T, girl); this.stool.group.position.set(-1.42, PATIO, -0.32); this.stool.group.rotation.y = 0.12; scene.add(this.stool.group);
    this.sign = buildSign(world); this.sign.position.set(-1.72, PATIO, -0.98); this.sign.rotation.y = 0.32; scene.add(this.sign);
    this.basket = buildBasket(world); this.basket.group.position.set(1.46, PATIO, 0.42); scene.add(this.basket.group);
    this.jar = buildJar(); this.jar.group.position.set(0.62, PATIO, 0.4); scene.add(this.jar.group);
    this.jarHome = this.jar.group.position.clone();
    this.puddle = makePuddle(); this.puddle.position.set(1.42, PATIO + 0.002, -0.12); this.puddle.scale.setScalar(0.001); this.puddle.visible = false; scene.add(this.puddle);
    // liquids
    this.liquids = world.tubs.map((tb) => new Liquid(tb, tb.kind));
    for (const tb of world.tubs) { tb.on = true; tb.home = tb.group.position.clone(); tb.homeRot = tb.group.rotation.clone(); }
    this.drops = new Drops(scene, 600);
    this.sparkle = new Sparkle(scene);
    // cloths on the table
    const opts = { sunDir: SUN_DIR, twineMat: world.twineMat };
    this.tee = new Cloth('tee', this.R.r, T, opts); this.tee.owner = 'girl'; this.tee.name = 'tee';
    this.hanky = new Cloth('square', this.R.r, T, opts); this.hanky.owner = 'mama'; this.hanky.name = 'hanky';
    this.cloths = [this.tee, this.hanky];
    const top = world.tableTop;
    this.tee.layFlat(new V3(-0.77, 0, 0.03), 0, top);
    this.hanky.layFlat(new V3(-0.3, 0, 0.04), 0.12, top);
    for (const c of this.cloths) { c.state = 'table'; c.dirty = 0; scene.add(c.mesh); scene.add(c.rings); c.lastTub = null; c.drip = 0; }
    this.papaShirt = null;
    this.mishap = { stage: 0, t: 0 };
    this.worn = {};
    this.env = this.makeEnv();
    this.dyeMats = [];
    this.pins = [];
    this.ringFly = [];
  }

  addParents(papa, mama) {
    this.papa = papa; this.mama = mama;
    papa.group.position.set(3.2, PATIO, 0.8); papa.group.visible = false;
    mama.group.position.set(-3.0, PATIO, 1.0); mama.group.rotation.y = 1.2;
    papa.undershirtMat = this.makeTop([0.6, 0.63, 0.66]);
    this.scene.add(papa.group); this.scene.add(mama.group);
    mama.setFeel('happy');
    // papa's white shirt: its own dye field (the worn shirt shows it)
    this.papaShirt = new Cloth('shirt', this.R.r, this.T, { sunDir: SUN_DIR, twineMat: this.world.twineMat }); this.papaShirt.owner = 'papa'; this.papaShirt.name = 'shirt';
    this.papaShirt.state = 'worn';
    this.papaWear = this.wearMaterial(this.papaShirt, true);
    papa.meshes.top.material = this.papaWear;
  }

  makeTop(rgb) {
    const m = this.girl.topMat.clone(); m.color.setRGB(...rgb, THREE.SRGBColorSpace); m.onBeforeCompile = this.girl.topMat.onBeforeCompile; m.customProgramCacheKey = this.girl.topMat.customProgramCacheKey; return m;
  }

  wearMaterial(cloth, onBody) {
    const m = makeDyeMaterial(this.T, cloth.dye.texture, null, { rep: new THREE.Vector2(32, 32), sunDir: SUN_DIR });
    m.vertexColors = true; m.side = THREE.FrontSide;
    m.normalMap = this.T.clothN.clone(); m.normalMap.repeat.set(32, 32); m.normalMap.needsUpdate = true;
    m.userData.cloth = cloth;
    this.dyeMats.push(m);
    return m;
  }

  // ---------------------------------------------------------------- environment queries for the cloth sim
  makeEnv() {
    const W = this.world; const tbl = W.table.position; const self = this;
    const innerR = (tb, y) => tb.R0 + (tb.R1 - tb.R0) * clamp((y - tb.baseY) / tb.H, 0, 1) - 0.004;
    return {
      wind: this.wind, windAmt: 0,
      floorAt(x, z, y) {
        let f = (x > -1.95 && x < 2.0 && z > -2.2 && z < 0.7) ? PATIO + 0.002 : 0.002;
        if (x > tbl.x - 0.46 && x < tbl.x + 0.46 && z > tbl.z - 0.28 && z < tbl.z + 0.28 && y > W.tableTop - 0.06) f = Math.max(f, W.tableTop + 0.002);
        if (x > 0.03 && x < 1.25 && z > -0.25 && z < 0.25 && y > 0.2) f = Math.max(f, 0.262);
        for (const tb of W.tubs) {
          if (!tb.on) continue;
          const d = Math.hypot(x - tb.x, z - tb.z); const rim = tb.baseY + tb.H + 0.018;
          if (d < tb.R1 + 0.02) {
            if (y > rim - 0.015 && d > innerR(tb, rim) - 0.01) f = Math.max(f, rim + 0.004);
            else if (d < innerR(tb, y)) f = Math.max(f, tb.baseY + 0.016);
          }
        }
        const b = self.basket.group.position; const db = Math.hypot(x - b.x, z - b.z);
        if (db < self.basket.R + 0.03) { if (db < self.basket.R - 0.005) f = Math.max(f, b.y + 0.016); else if (y > b.y + self.basket.H - 0.02) f = Math.max(f, b.y + self.basket.H + 0.012); }
        return f;
      },
      wallClamp(P, i) {
        const x = P[i], y = P[i + 1], z = P[i + 2];
        for (const tb of W.tubs) {
          if (!tb.on) continue;
          const rim = tb.baseY + tb.H + 0.01; if (y > rim) continue;
          const dx = x - tb.x, dz = z - tb.z, d = Math.hypot(dx, dz);
          if (this.insideTub === tb && d > 1e-5) { const ir = innerR(tb, y) - 0.008; if (d > ir) { const s = ir / d; P[i] = tb.x + dx * s; P[i + 2] = tb.z + dz * s; } continue; }
          if (d > tb.R1 + 0.02 || d < 1e-5) continue;
          const ir = innerR(tb, y);
          if (d < (ir + tb.R1) / 2 + 0.004) { if (d > ir - 0.006) { const s = (ir - 0.006) / d; P[i] = tb.x + dx * s; P[i + 2] = tb.z + dz * s; } }
          else { const s = (tb.R1 + 0.02) / d; P[i] = tb.x + dx * s; P[i + 2] = tb.z + dz * s; }
        }
        const b = self.basket.group.position; const dx = x - b.x, dz = z - b.z, d = Math.hypot(dx, dz);
        if (y < b.y + self.basket.H && d > self.basket.R - 0.015 && d < self.basket.R + 0.025 && d > 1e-5) {
          if (d < self.basket.R + 0.005) { const s = (self.basket.R - 0.015) / d; P[i] = b.x + dx * s; P[i + 2] = b.z + dz * s; }
          else { const s = (self.basket.R + 0.025) / d; P[i] = b.x + dx * s; P[i + 2] = b.z + dz * s; }
        }
      },
      liquidAt(x, y, z) {
        for (const tb of W.tubs) { if (!tb.on || tb.level < 0.01) continue; if (y < tb.baseY + tb.level && Math.hypot(x - tb.x, z - tb.z) < innerR(tb, y)) return 1; }
        return 0;
      },
      liquidSurfaceAt(x, z) {
        for (const tb of W.tubs) { if (!tb.on || tb.level < 0.01) continue; if (Math.hypot(x - tb.x, z - tb.z) < innerR(tb, tb.baseY + tb.level)) return tb.baseY + tb.level; }
        return null;
      },
      tubList() { return W.tubs.map((tb) => ({ x: tb.x, z: tb.z, innerR: innerR(tb, tb.baseY + tb.level), liquidY: tb.baseY + tb.level, on: tb.on && tb.level > 0.01 })); },
    };
  }

  // ---------------------------------------------------------------- camera
  onResize(w, h) { this.W = w; this.H = h; this.portrait = h > w; }

  framing() {
    const s = this.state; const P = this.portrait;
    let c, w, h, dir;
    if (s === 'intro') { c = new V3(-1.12, 0.62, -0.42); w = 1.05; h = 1.25; dir = new V3(0.14, 0.3, 1); }
    else if (s === 'tie') { c = new V3(-0.56, 0.72, -0.08); w = 1.18; h = 0.86; dir = new V3(0.02, 0.55, 1); }
    else if (s === 'dye') { c = new V3(0.36, 0.74, -0.1); w = 2.95; h = 1.3; dir = new V3(0.0, 0.34, 1); if (this.papa && this.papa.group.visible) { c.y = 0.95; h = 1.95; c.x = 0.5; dir.set(0, 0.22, 1); } }
    else if (s === 'line') { c = new V3(0.05, 1.12, -1.65); w = 2.75; h = 1.65; dir = new V3(0.0, 0.06, 1); }
    else { c = new V3(0.2, 0.98, -1.35); w = 3.35; h = 2.2; dir = new V3(0.0, 0.1, 1); }
    if (P) {
      // narrow screens follow the action instead of showing everything tiny
      const maxW = s === 'tie' ? 1.05 : (s === 'intro' ? 0.95 : 1.35);
      if (w > maxW) {
        const fx = this.focusX ?? c.x;
        c.x = clamp(fx, c.x - (w - maxW) / 2, c.x + (w - maxW) / 2);
        w = maxW;
      }
      h *= 1.1;
    }
    return { c, w, h, dir: dir.normalize() };
  }

  updateCamera(dt) {
    const cam = this.cam; const P = this.portrait;
    // 40 mm (landscape) / 35 mm (portrait) full-frame equivalents
    const vfov = P ? 2 * Math.atan(18 / 35) : 2 * Math.atan(12 / 40);
    cam.fov = THREE.MathUtils.radToDeg(vfov); cam.updateProjectionMatrix();
    const f = this.framing();
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * cam.aspect);
    const d = Math.max((f.h / 2) / Math.tan(vfov / 2), (f.w / 2) / Math.tan(hfov / 2)) * 1.04;
    const pos = f.c.clone().addScaledVector(f.dir, d);
    if (!this.camInit) { this.camCur.pos.copy(pos); this.camCur.tgt.copy(f.c); this.camInit = true; }
    const k = 1 - Math.exp(-dt * 1.6);
    this.camCur.pos.lerp(pos, k); this.camCur.tgt.lerp(f.c, k);
    // a breath of handheld drift
    const sway = new V3(Math.sin(this.t * 0.31) * 0.006, Math.sin(this.t * 0.23) * 0.004, 0);
    cam.position.copy(this.camCur.pos).add(sway); cam.lookAt(this.camCur.tgt);
    this.R.focus = cam.position.distanceTo(this.camCur.tgt);
    this.R.aperture = 0.9;
    // keep the sun's shadow map tight around what we're looking at (crisper, softer-edged shadows)
    const sun = this.world.sun; const half = clamp(f.w * 0.62, 0.9, 2.6);
    const sc = sun.shadow.camera;
    if (Math.abs(sc.right - half) > 0.05) { sc.left = -half; sc.right = half; sc.top = half; sc.bottom = -half; sc.updateProjectionMatrix(); }
    const snap = (half * 2) / 2048;
    const tg = this.camCur.tgt.clone(); tg.x = Math.round(tg.x / snap) * snap; tg.z = Math.round(tg.z / snap) * snap;
    sun.target.position.copy(tg); sun.position.copy(tg).addScaledVector(SUN_DIR, 10);
    if (this.Q.get('cam')) { const v = this.Q.get('cam').split(',').map(Number); cam.position.set(v[0], v[1], v[2]); cam.lookAt(v[3], v[4], v[5]); if (v[6]) { cam.fov = v[6]; cam.updateProjectionMatrix(); } this.R.focus = cam.position.distanceTo(new V3(v[3], v[4], v[5])); }

  }

  // ---------------------------------------------------------------- input
  bindInput() {
    const el = this.R.r.domElement;
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.audio.unlock(); this.onDown(e); });
    el.addEventListener('touchend', () => this.audio.unlock(), { passive: true });
    el.addEventListener('pointermove', (e) => { e.preventDefault(); this.onMove(e); });
    const up = (e) => { this.onUp(e); };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('pointerleave', up);
    this.againEl.addEventListener('click', () => { this.audio.unlock(); this.restart(); });
    const doc = document.documentElement;
    if (doc.requestFullscreen || doc.webkitRequestFullscreen) {
      this.fsEl.classList.add('on');
      this.fsEl.addEventListener('click', () => { (doc.requestFullscreen || doc.webkitRequestFullscreen).call(doc)?.catch?.(() => {}); });
      document.addEventListener('fullscreenchange', () => this.fsEl.classList.toggle('on', !document.fullscreenElement));
    }
  }

  setPtr(e) { const r = this.R.r.domElement.getBoundingClientRect(); this.sx = e.clientX - r.left; this.sy = e.clientY - r.top; this.ptr.set(this.sx / r.width * 2 - 1, -(this.sy / r.height) * 2 + 1); this.ray.setFromCamera(this.ptr, this.cam); }

  screenOf(p) { const v = p.clone().project(this.cam); return { x: (v.x * 0.5 + 0.5) * this.W, y: (-v.y * 0.5 + 0.5) * this.H, z: v.z }; }
  screenDist(p) { const s = this.screenOf(p); return Math.hypot(s.x - this.sx, s.y - this.sy); }

  hitCloth(list) {
    const meshes = list.map((c) => c.mesh);
    const hits = this.ray.intersectObjects(meshes, false);
    if (hits.length) { const c = list.find((x) => x.mesh === hits[0].object); return { cloth: c, point: hits[0].point }; }
    // forgiving: nearest cloth vertex on screen
    let best = null, bd = 48;
    for (const c of list) for (let k = 0; k < c.n; k += 3) { const d = this.screenDist(c.vertex(k)); if (d < bd) { bd = d; best = { cloth: c, point: c.vertex(k) }; } }
    return best;
  }

  onDown(e) {
    this.setPtr(e); this.ptrDown = true; this.idle = 0; this.downT = this.t;
    const st = this.state;
    if (st === 'intro') {
      if (!this.hasApron && (this.ray.intersectObject(this.stool.apron).length || this.screenDist(this.stool.apron.getWorldPosition(new V3())) < 70)) return this.putOnApron();
      if (!this.hasGloves && (this.ray.intersectObject(this.stool.gloves, true).length || this.screenDist(this.stool.gloves.getWorldPosition(new V3())) < 70)) return this.putOnGloves();
      return this.tapPeople();
    }
    if (st === 'tie') {
      const h = this.hitCloth(this.cloths.filter((c) => c.state === 'table'));
      if (h) { this.holdTie = { cloth: h.cloth, k: h.cloth.nearestVertex(h.point), t: 0, n: 0 }; this.doTie(); return; }
      return this.tapPeople();
    }
    if (st === 'dye') {
      // fix the knocked-over tub / refill
      if (this.mishap.stage === 3 && this.screenDist(this.world.tubs[0].group.position.clone().add(new V3(0, 0.1, 0))) < 110) return this.rightTub();
      if (this.mishap.stage === 4 && (this.ray.intersectObject(this.jar.group, true).length || this.screenDist(this.jar.group.position.clone().add(new V3(0, 0.15, 0))) < 90)) { this.pouring = true; return; }
      const h = this.hitCloth(this.cloths.filter((c) => c.state !== 'line'));
      if (h) return this.grab(h.cloth, h.point);
      for (const tb of this.world.tubs) if (tb.on && this.screenDist(new V3(tb.x, tb.baseY + tb.level, tb.z)) < 70) { this.liquids[this.world.tubs.indexOf(tb)].disturb(tb.x, tb.z, 2.5, 3); this.audio.dip(0.4); return; }
      return this.tapPeople();
    }
    if (st === 'line') {
      // untie the nearest knot
      let best = null, bd = 70;
      for (const c of this.lineCloths()) for (const t of c.ties) if (!t.releasing) { const d = this.screenDist(t.tipPos || c.vertex(t.c)); if (d < bd) { bd = d; best = { c, t }; } }
      if (best) return this.untie(best.c, best.t);
      const h = this.hitCloth(this.lineCloths());
      if (h) { this.flap(h.cloth); return; }
      return this.tapPeople();
    }
    if (st === 'finale') {
      const h = this.hitCloth(this.lineCloths());
      if (h && !this.celebrated) return this.grab(h.cloth, h.point);
      if (h) { this.flap(h.cloth); return; }
      if (this.tapPeople()) return;
      this.gust = 1.2; this.audio.whoosh();
    }
  }

  onMove(e) { if (!this.ptrDown) return; this.setPtr(e); this.idle = 0; }

  onUp() {
    if (!this.ptrDown) return; this.ptrDown = false;
    this.holdTie = null;
    if (this.pouring) { this.pouring = false; }
    if (this.held) this.release();
  }

  tapPeople() {
    const ppl = [this.girl, this.papa, this.mama].filter((p) => p && p.group.visible);
    for (const p of ppl) {
      const hit = this.ray.intersectObjects(Object.values(p.meshes).filter((m) => m.visible), false);
      if (hit.length) { this.react(p); return true; }
    }
    return false;
  }

  react(p) {
    const r = Math.floor(Math.random() * 4);
    if (r === 0) { p.setFeel('laugh', 1.6); p.poseT.laugh = 1; this.later(1.4, () => (p.poseT.laugh = 0)); p === this.papa ? this.audio.laughLow() : this.audio.giggle(p === this.girl ? 1.25 : 1); }
    else if (r === 1) { p.setFeel('happy', 1.6); p.poseT.jump = 1; this.later(1.0, () => (p.poseT.jump = 0)); this.audio.giggle(p === this.girl ? 1.3 : 1.05); }
    else if (r === 2) { p.setFeel('proud', 1.6); p.poseT.wave = 1; this.later(1.5, () => (p.poseT.wave = 0)); this.audio.chime(3, 880); }
    else { p.setFeel('wow', 1.2); p.poseT.armsUp = 1; this.later(1.0, () => (p.poseT.armsUp = 0)); this.audio.wow(); }
  }

  later(s, fn) { this.tasks.push({ t: this.t + s, fn }); }

  // ---------------------------------------------------------------- intro: apron & gloves
  putOnApron() {
    this.hasApron = true; this.audio.whoosh();
    const a = this.stool.apron; const start = a.getWorldPosition(new V3());
    this.fly(a, start, this.girl.group.position.clone().add(new V3(0, 0.7, 0.1)), 0.6, () => {
      a.visible = false; this.stool.strap.visible = false;
      this.apronWorn.parts.forEach((p) => (p.visible = true));
      this.girl.setFeel('proud', 2); this.girl.poseT.jump = 1; this.later(0.6, () => (this.girl.poseT.jump = 0));
      this.audio.chime(3, 700);
      this.checkIntro();
    });
  }

  putOnGloves() {
    this.hasGloves = true; this.audio.whoosh();
    const g = this.stool.gloves; const start = g.getWorldPosition(new V3());
    this.fly(g, start, this.girl.group.position.clone().add(new V3(0, 0.55, 0.1)), 0.55, () => {
      g.visible = false;
      const G = this.girl.meshes; G.gloveL.visible = G.gloveR.visible = true; G.handL.visible = G.handR.visible = false;
      this.girl.setFeel('happy', 2); this.girl.poseT.clap = 1; this.later(1.0, () => (this.girl.poseT.clap = 0));
      this.audio.clip(); this.later(0.2, () => this.audio.clip());
      this.checkIntro();
    });
  }

  fly(obj, from, to, dur, done) {
    const parent = obj.parent; const wp = from.clone();
    this.scene.attach(obj);
    const t0 = this.t;
    this.anims = this.anims || [];
    this.anims.push((t) => {
      const k = clamp((t - t0) / dur, 0, 1), e = ease(k);
      obj.position.lerpVectors(wp, to, e); obj.position.y += Math.sin(Math.PI * e) * 0.25;
      obj.scale.setScalar(1 - 0.5 * e);
      if (k >= 1) { done(); return true; }
    });
  }

  checkIntro() {
    if (this.hasApron && this.hasGloves) {
      this.later(1.2, () => {
        this.setState('tie');
        this.walkTo(this.girl, new V3(-0.56, PATIO, -0.36));
        if (this.mama) { this.mama.setFeel('happy', 2); this.mama.poseT.clap = 1; this.later(1.2, () => (this.mama.poseT.clap = 0)); }
      });
    }
  }

  setState(s) { this.state = s; this.stateT = 0; this.idle = 0; }

  walkTo(p, target, speed = 0.7) { p.walkTarget = target.clone(); p.walkSpeed = speed; }

  // ---------------------------------------------------------------- tying
  doTie() {
    const h = this.holdTie; if (!h) return;
    const c = h.cloth;
    const r = c.addTie(h.k);
    if (r.added) {
      this.audio.twine(); this.later(0.25, () => this.audio.knot());
      r.tie.preferUp = true;
      c.settle = 1.5;
      this.girl.setFeel('focus', 1.2);
      this.tieAnim = { cloth: c, tie: r.tie, t: 0 };
      this.lastTieT = this.t;
      c.dye.paintResist(c.ties, c.shape);
      if (r.isNew) this.later(0.9, () => this.girl.setFeel('happy', 1.5));
    } else { this.audio.tap(); }
    h.n++;
  }

  // ---------------------------------------------------------------- dyeing: grab, dip, release
  grab(cloth, point) {
    let k = cloth.nearestVertex(point);
    // holding near a bundle means holding the bundle
    for (const t of cloth.ties) if (t.open < 1 && t.members.some(([i]) => i === k)) k = t.c;
    cloth.pins = [];
    for (const t of cloth.ties) t.preferUp = false;
    const target = cloth.vertex(k);
    this.held = { cloth, k, target, plane: new THREE.Plane(new V3(0, 0, 1), -target.z), grabT: this.t };
    cloth.pins.push({ k, target, stiff: 0.55 });
    cloth.state = 'held';
    this.audio.tap();
    this.girl.setFeel('focus', 1);
    if (this.state === 'finale') {
      this.held.plane = new THREE.Plane(new V3(0, 0, 1), 1.3);
      for (const p of cloth.pinObjs || []) this.scene.remove(p);
      cloth.pinObjs = [];
      this.audio.clip();
    }
  }

  updateHeld(dt) {
    const H = this.held; if (!H) return;
    const p = new V3();
    if (this.ray.ray.intersectPlane(H.plane, p)) {
      if (this.state === 'dye') {
        p.x = clamp(p.x, -1.1, 1.8); p.y = clamp(p.y, 0.05, 1.25);
        const fl = this.env.floorAt(p.x, p.z, p.y);
        p.y = Math.max(p.y, fl + 0.02);
      } else { p.y = clamp(p.y, 0.25, 1.9); p.x = clamp(p.x, -2, 2); }
      H.target.lerp(p, 0.5);
    }
    this.focusX = H.target.x;
    // girl follows with her hand
    if (this.state === 'dye') {
      const gx = clamp(H.target.x + (H.target.x > this.girl.group.position.x ? -0.17 : 0.17), -0.95, 1.6);
      this.walkTo(this.girl, new V3(gx, PATIO, -0.36), 1.0);
    }
  }

  release() {
    const H = this.held; this.held = null;
    const c = H.cloth; c.pins = [];
    if (this.state === 'finale') {
      // handed to someone?
      const ppl = [['girl', this.girl], ['papa', this.papa], ['mama', this.mama]];
      let best = null, bd = 140;
      for (const [name, p] of ppl) { const d = this.screenDist(p.B.chest.getWorldPosition(new V3())); if (d < bd) { bd = d; best = name; } }
      if (best) return this.handTo(c, best);
      this.hangOnLine(c, c.slot);
      return;
    }
    const b = this.basket.group.position;
    const inBasket = Math.hypot(H.target.x - b.x, H.target.z - b.z) < 0.4 && H.target.y < 0.9;
    const sBasket = this.screenDist(b.clone().add(new V3(0, 0.2, 0))) < Math.max(120, Math.min(this.W, this.H) * 0.22) || (c.dyed && H.target.x > 1.25);
    if (inBasket || sBasket) {
      c.state = 'basket';
      if (!inBasket) { for (let k = 0; k < c.n; k++) { const i = k * 3; c.pos[i] += b.x - H.target.x; c.pos[i + 2] += b.z - H.target.z; c.pos[i + 1] += Math.max(0, b.y + 0.5 - H.target.y); } c.prev.set(c.pos); }
      this.audio.flutter(); this.girl.setFeel('proud', 1.5);
      this.later(0.5, () => this.checkDyeDone());
    } else c.state = 'free';
  }

  checkDyeDone() {
    if (this.state !== 'dye') return;
    if (this.cloths.every((c) => c.state === 'basket') && this.mishap.stage >= 5) this.toLine();
  }

  // ---------------------------------------------------------------- papa's accident
  startMishap() {
    if (!this.papa || this.mishap.stage) return;
    this.mishap.stage = 1; this.mishap.t = 0;
    const P = this.papa; P.group.visible = true; P.group.position.set(2.8, PATIO, -0.5); P.group.rotation.y = -1.4;
    this.walkTo(P, new V3(1.48, PATIO, -0.4), 0.9);
    P.setFeel('happy');
  }

  updateMishap(dt) {
    const M = this.mishap; if (!M.stage || !this.papa) return;
    M.t += dt; const P = this.papa; const tub = this.world.tubs[0];
    if (M.stage === 1) {
      P.lookAt = new V3(tub.x, 0.5, tub.z);
      if (!P.walkTarget && M.t > 1.0) { M.stage = 2; M.t = 0; P.setFeel('wow'); P.poseT.lean = 0.6; this.audio.huh(); }
    } else if (M.stage === 2) {
      // leans in for a closer look ... and bumps the bench
      if (M.t > 1.1 && !M.tipped) {
        M.tipped = true; M.tipT = 0; this.audio.clank(); P.setFeel('oops'); P.poseT.lean = -0.2; P.poseT.armsUp = 0.6;
        P.group.position.x += 0.06;
        this.later(0.35, () => this.splash());
      }
      if (M.tipped) {
        M.tipT += dt;
        const k = ease(clamp(M.tipT / 0.5, 0, 1));
        tub.group.position.set(tub.home.x + 0.46 * k, tub.home.y + Math.sin(k * Math.PI) * 0.05, tub.home.z - 0.06 * k);
        tub.group.rotation.set(0.08 * k, 0, -1.52 * k);
        if (k > 0.75) tub.group.position.y = tub.home.y + (0.235 - tub.home.y) * ((k - 0.75) / 0.25);
        tub.on = false; tub.level = Math.max(0, tub.level - dt * 0.6);
        if (M.tipT > 1.2) { M.stage = 3; M.t = 0; tub.level = 0; P.poseT.armsUp = 0; P.setFeel('sheepish'); P.poseT.laugh = 0.6; this.audio.laughLow(); this.later(1.6, () => (P.poseT.laugh = 0)); this.girl.setFeel('wow', 1.5); }
      }
    } else if (M.stage >= 5 && M.pourK > 0.001) {
      // put the jar back
      M.pourK = Math.max(0, M.pourK - dt * 1.5);
      this.jar.group.position.lerpVectors(this.jarHome, new V3(tub.x - 0.12, 0.72, tub.z + 0.02), ease(M.pourK)); this.jar.group.rotation.z = -1.9 * ease(M.pourK);
    } else if (M.stage === 3 || M.stage === 4) {
      P.lookAt = this.girl.B.head.getWorldPosition(new V3());
      if (M.stage === 4) {
        const jar = this.jar.group; const target = new V3(tub.x - 0.12, 0.72, tub.z + 0.02);
        const want = this.pouring ? 1 : 0; M.pourK = (M.pourK || 0) + (want - (M.pourK || 0)) * Math.min(1, dt * 5);
        jar.position.lerpVectors(this.jarHome, target, ease(M.pourK)); jar.rotation.z = -1.9 * ease(M.pourK);
        this.focusX = tub.x;
        this.walkTo(this.girl, new V3(tub.x - 0.2, PATIO, -0.36), 1);
        this.girl.handTarget.L = jar.localToWorld(new V3(0.09, 0.15, 0)); this.girl.armW.L += (M.pourK - this.girl.armW.L) * 0.2;
        if (this.pouring && M.pourK > 0.85) {
          tub.level = Math.min(0.17, tub.level + dt * 0.075);
          this.audio.pour(true);
          const mouth = jar.localToWorld(new V3(0, 0.34, 0));
          for (let i = 0; i < 3; i++) this.drops.spawn(mouth.clone().add(new V3((Math.random() - 0.5) * 0.01, 0, (Math.random() - 0.5) * 0.01)), new V3(0.35 + Math.random() * 0.1, -0.2, 0), 0.004 + Math.random() * 0.004, new THREE.Color(0.03, 0.06, 0.1), { stretch: 3, onLand: (d, w) => { if (w === 'liquid') this.liquids[0].disturb(d.pos.x, d.pos.z, 0.8, 2); } });
          this.liquids[0].disturb(tub.x, tub.z, 0.4, 2);
          this.idle = 0;
        } else this.audio.pour(false);
        if (tub.level >= 0.15 && !this.pouring) {
          M.stage = 5; this.audio.pour(false); this.audio.fanfare();
          this.girl.setFeel('proud', 2.5); this.girl.armW.L = 0;
          P.setFeel('laugh', 2); P.poseT.clap = 1;
          this.later(1.6, () => { P.poseT.clap = 0; P.setFeel('happy'); this.walkTo(P, new V3(3.0, PATIO, -0.2), 0.9); });
          this.later(4.5, () => { P.group.visible = false; P.meshes.top.material = P.undershirtMat; this.checkDyeDone(); });
          if (this.mama) { this.mama.setFeel('happy', 2); this.mama.poseT.clap = 1; this.later(1.5, () => (this.mama.poseT.clap = 0)); }
        }
      }
    }
  }

  splash() {
    const tub = this.world.tubs[0]; const P = this.papa;
    this.audio.splash();
    const origin = new V3(tub.home.x + 0.3, 0.42, tub.home.z - 0.05);
    const col = new THREE.Color(0.05, 0.11, 0.12);
    for (let i = 0; i < 160; i++) {
      const v = new V3(0.8 + Math.random() * 1.8, 0.6 + Math.random() * 2.0, (Math.random() - 0.5) * 1.6);
      this.drops.spawn(origin.clone().add(new V3((Math.random() - 0.5) * 0.15, 0, (Math.random() - 0.5) * 0.1)), v, 0.003 + Math.random() * Math.random() * 0.012, col, { life: 2 });
    }
    // splotches on papa's shirt (they will turn from green to blue in the air)
    const D = this.papaShirt.dye;
    for (let i = 0; i < 8; i++) {
      const u = 0.25 + Math.random() * 0.5, v = 0.3 + Math.random() * 0.6, r = 0.03 + Math.random() * 0.09;
      D.stamp(u, v, r, r * (0.7 + Math.random() * 0.8), 0.9 + Math.random() * 0.6, 0, 1);
    }
    this.puddle.visible = true; this.puddleGrow = 0;
    this.papaShirt.wet = 1;
  }

  rightTub() {
    const tub = this.world.tubs[0];
    this.audio.clank(); this.girl.setFeel('focus', 1);
    this.walkTo(this.girl, new V3(tub.home.x - 0.15, PATIO, -0.36), 1);
    const p0 = tub.group.position.clone(), r0 = tub.group.rotation.clone(); const t0 = this.t;
    this.mishap.stage = 3.5;
    this.anims = this.anims || [];
    this.anims.push((t) => {
      const k = ease(clamp((t - t0) / 0.8, 0, 1));
      tub.group.position.lerpVectors(p0, tub.home, k); tub.group.position.y += Math.sin(k * Math.PI) * 0.12;
      tub.group.rotation.set(r0.x * (1 - k), 0, r0.z * (1 - k));
      if (k >= 1) { tub.on = true; tub.level = 0.0; this.mishap.stage = 4; this.girl.setFeel('proud', 1.5); this.audio.clank(); return true; }
    });
  }

  // ---------------------------------------------------------------- the clothesline
  lineCloths() { return [this.tee, this.hanky, this.papaShirt].filter((c) => c && (c.state === 'line' || c.state === 'held')); }

  toLine() {
    this.setState('line');
    this.audio.whoosh();
    const slots = { tee: -0.62, hanky: 0.2, shirt: 1.02 };
    const order = [this.tee, this.hanky, this.papaShirt];
    order.forEach((c, i) => this.later(0.6 + i * 0.5, () => {
      if (c === this.papaShirt) { this.scene.add(c.mesh); this.scene.add(c.rings); c.wet = Math.max(c.wet, 0.6); }
      this.hangOnLine(c, slots[c.name]);
      c.slot = slots[c.name];
    }));
    this.walkTo(this.girl, new V3(-0.2, PATIO, -1.32), 0.8);
    if (this.mama) this.walkTo(this.mama, new V3(-1.15, PATIO, -2.5), 0.8);
    if (this.papa) { this.later(1.5, () => { this.papa.group.visible = true; this.papa.group.position.set(2.8, PATIO, -2.6); this.walkTo(this.papa, new V3(1.45, PATIO, -2.55), 0.9); }); }
    this.dryT = 0;
  }

  hangOnLine(c, x) {
    const W = this.world; const z = W.line.z + 0.12;
    const w = c.shape.w * (c.kind === 'shirt' ? 0.5 : 0.56);
    const p0 = new V3(x - w / 2, W.lineY(x - w / 2) - 0.004, z), p1 = new V3(x + w / 2, W.lineY(x + w / 2) - 0.004, z);
    c.hangAt([p0, p1]);
    c.pins = [{ k: c.pinIndex(c.shape.pins[0]), target: p0, stiff: 1 }, { k: c.pinIndex(c.shape.pins[1]), target: p1, stiff: 1 }];
    c.state = 'line';
    for (const t of c.ties) { t.preferUp = false; }
    c.pinObjs = [p0, p1].map((p) => { const pin = clothespin(W); pin.position.copy(p).add(new V3(0, 0.03, 0.004)); this.scene.add(pin); return pin; });
    this.audio.clip();
  }

  untie(c, t) {
    t.releasing = true; this.audio.pop();
    this.girl.setFeel('focus', 0.8);
    const tip = (t.tipPos || c.vertex(t.c)).clone();
    this.walkTo(this.girl, new V3(clamp(tip.x - 0.15, -1.4, 1.4), PATIO, -1.32), 1.2);
    this.reach = { s: tip.x > this.girl.group.position.x ? 'L' : 'R', p: tip, t: 1.0 };
    const n = t.wraps;
    for (let k = n - 1; k >= 0; k--) {
      this.later((n - 1 - k) * 0.16, () => {
        const ring = t.rings[k]; if (!ring) return;
        t.wraps = k;
        this.ringFly.push({ m: ring, v: new V3((Math.random() - 0.5) * 1.4, 1.2 + Math.random(), 0.8 + Math.random() * 0.6), spin: new V3(Math.random() * 9, Math.random() * 9, 0), life: 1.4 });
        this.audio.flutter();
      });
    }
    this.later(n * 0.16 + 0.05, () => {
      const t0 = this.t;
      this.anims.push((tt) => { t.open = clamp((tt - t0) / 0.7, 0, 1); if (t.open >= 1) { c.ties.splice(c.ties.indexOf(t), 1); return true; } });
      c.settle = 1;
      this.later(0.6, () => { this.girl.setFeel('wow', 1.4); this.audio.wow(); this.later(1.3, () => { this.girl.setFeel('laugh', 1.5); this.girl.poseT.jump = 1; this.later(0.8, () => (this.girl.poseT.jump = 0)); }); });
      this.gust = 1.0;
    });
  }

  flap(c) {
    this.gust = 1.4; this.audio.whoosh();
    for (let k = 0; k < c.n; k += 2) { c.prev[k * 3 + 2] -= 0.012 * Math.random(); c.prev[k * 3 + 1] -= 0.008 * Math.random(); }
    this.girl.setFeel('happy', 1);
  }

  // ---------------------------------------------------------------- finale: give each cloth to its owner
  handTo(c, who) {
    const p = this[who];
    const right = c.owner === who;
    c.state = 'worn'; this.scene.remove(c.mesh); this.scene.remove(c.rings);
    const slot = c.kind === 'square' ? 'scarf' : 'top';
    const m = this.wearMaterial(c, true);
    if (slot === 'scarf') { p.meshes.scarf.material = m; p.meshes.scarf.visible = true; }
    else p.meshes.top.material = m;
    this.audio.whoosh();
    if (right) { p.setFeel('laugh', 2); p.poseT.jump = 1; this.later(0.9, () => (p.poseT.jump = 0)); this.audio.wow(); }
    else {
      p.setFeel('huh', 1.3); p.poseT.headTilt = 1; this.audio.huh();
      this.later(1.3, () => { p.poseT.headTilt = 0; p.setFeel('laugh', 2); p.poseT.laugh = 1; this.later(1.2, () => (p.poseT.laugh = 0)); p === this.papa ? this.audio.laughLow() : this.audio.giggle(); });
    }
    if (this.lineCloths().length === 0) this.later(2.2, () => this.celebrate());
  }

  celebrate() {
    this.celebrated = true; this.audio.fanfare();
    for (const p of [this.girl, this.papa, this.mama]) { if (!p) continue; p.setFeel('laugh', 3); p.poseT.armsUp = 1; this.later(1.6 + Math.random() * 0.4, () => { p.poseT.armsUp = 0; p.poseT.wave = 1; this.later(1.5, () => (p.poseT.wave = 0)); }); }
    this.againEl.classList.add('on');
  }

  restart() { location.reload(); }

  // ---------------------------------------------------------------- hints
  hint() {
    const st = this.state;
    if (st === 'intro') {
      if (!this.hasApron) return { p: this.stool.apron.getWorldPosition(new V3()).add(new V3(0, 0.03, 0)), glow: [this.stool.apron.material] };
      if (!this.hasGloves) return { p: this.stool.gloves.getWorldPosition(new V3()).add(new V3(0, 0.03, 0)), glow: [this.girl.meshes.gloveL.material] };
      return null;
    }
    if (st === 'tie') {
      const c = this.cloths.find((x) => x.ties.length === 0) || null;
      if (c) return { p: c.centroid(), cloth: c, size: 0.35 };
      return null;
    }
    if (st === 'dye') {
      const M = this.mishap;
      if (M.stage === 3) return { p: this.world.tubs[0].group.position.clone().add(new V3(0, 0.05, 0)), size: 0.45 };
      if (M.stage === 4) return { p: this.jar.group.position.clone().add(new V3(0, 0.18, 0)), size: 0.3, hold: true };
      if (this.held) {
        if (this.held.cloth.dyed) return { p: this.basket.group.position.clone().add(new V3(0, 0.25, 0)), glow: [this.basket.mat], size: 0.45, drop: true };
        const tb = this.world.tubs.find((t) => t.on && t.level > 0.05);
        return tb ? { p: new V3(tb.x, tb.baseY + tb.level, tb.z), size: 0.4 } : null;
      }
      const c = this.cloths.find((x) => !x.dyed && x.state !== 'basket') || this.cloths.find((x) => x.state !== 'basket');
      if (c) {
        const tb = this.world.tubs.find((t) => t.on && t.level > 0.05) || this.world.tubs[1];
        return { p: c.centroid(), cloth: c, size: 0.3, drag: c.dyed ? this.basket.group.position.clone().add(new V3(0, 0.3, 0)) : new V3(tb.x, tb.baseY + tb.level + 0.05, tb.z) };
      }
      return null;
    }
    if (st === 'line') {
      for (const c of this.lineCloths()) for (const t of c.ties) if (!t.releasing) return { p: t.tipPos || c.vertex(t.c), size: 0.2, rings: true };
      return null;
    }
    if (st === 'finale' && !this.celebrated) {
      const c = this.lineCloths()[0];
      if (c && this[c.owner]) return { p: c.centroid(), cloth: c, size: 0.35, drag: this[c.owner].B.chest.getWorldPosition(new V3()) };
    }
    return null;
  }

  updateHints(dt) {
    const h = this.held ? null : this.hint();
    const hh = this.held ? this.hint() : h;
    this.sparkle.update(dt, hh ? hh.p : null, hh ? (hh.size || 0.25) : 0.25);
    const pulse = 0.5 + 0.5 * Math.sin(this.t * 4);
    for (const c of [...this.cloths, this.papaShirt].filter(Boolean)) c.mat.userData.dye.uGlow.value = (hh && hh.cloth === c) ? 0.25 + 0.35 * pulse : 0;
    for (const m of [this.stool.apron.material, this.girl.meshes.gloveL.material, this.basket.mat]) { m.emissive = m.emissive || new THREE.Color(); m.emissive.setRGB(0, 0, 0); }
    if (hh && hh.glow) for (const m of hh.glow) m.emissive.setRGB(0.25 * pulse, 0.22 * pulse, 0.15 * pulse);
    this.world.twineMat.emissive = this.world.twineMat.emissive || new THREE.Color();
    this.world.twineMat.emissive.setRGB(0, 0, 0);
    if (hh && hh.rings) this.world.twineMat.emissive.setRGB(0.35 * pulse, 0.3 * pulse, 0.2 * pulse);
    // the white pointing hand after a few quiet seconds
    const show = h && this.idle > 5 && !this.ptrDown;
    if (show) {
      const s = this.screenOf(h.p);
      let x = s.x, y = s.y;
      const cyc = (this.idle % 2.2) / 2.2;
      if (h.drag) { const e = this.screenOf(h.drag); const k = ease(clamp((cyc - 0.15) / 0.6, 0, 1)); x = s.x + (e.x - s.x) * k; y = s.y + (e.y - s.y) * k; }
      else y += -Math.abs(Math.sin(cyc * Math.PI * 2)) * 14;
      this.handEl.style.transform = `translate(${x - 22}px, ${y - 6}px)`;
      this.handEl.classList.add('on');
    } else this.handEl.classList.remove('on');
  }

  // ---------------------------------------------------------------- per-frame
  update(dt, t) {
    this.t = t; this.stateT += dt; this.idle += dt;
    // tasks & animations
    for (let i = this.tasks.length - 1; i >= 0; i--) if (this.t >= this.tasks[i].t) { const f = this.tasks[i].fn; this.tasks.splice(i, 1); f(); }
    if (this.anims) this.anims = this.anims.filter((a) => !a(this.t));
    // wind: late-summer gusts, stronger out by the line
    this.windT += dt;
    this.gust = Math.max(0, this.gust - dt * 0.8);
    const base = this.state === 'line' || this.state === 'finale' ? 1.0 : 0.35;
    const g = base * (0.55 + 0.45 * Math.sin(this.windT * 0.43) * Math.sin(this.windT * 0.17 + 1)) + this.gust * 1.2 + 0.25 * Math.max(0, Math.sin(this.windT * 1.7)) * base;
    this.windAmt = g;
    this.wind.set(0.8 * g, 0.25 * g, 2.6 * g);
    this.env.windAmt = g;
    this.world.update(t, g);
    this.audio.setWind(Math.min(1, g * 0.8));
    // input-driven state
    if (this.holdTie) { this.holdTie.t += dt; if (this.holdTie.t > 0.5) { this.holdTie.t = 0; this.doTie(); } }
    this.updateHeld(dt);
    this.updateMishap(dt);
    this.updateStateGoals(dt);
    // people
    this.updatePeople(dt);
    // cloths
    const tubs = this.env.tubList();
    for (const c of [...this.cloths, this.papaShirt].filter(Boolean)) this.updateCloth(c, dt, tubs);
    for (const m of this.dyeMats) m.userData.dye.tDye.value = m.userData.cloth.dye.texture;
    // fx
    for (const L of this.liquids) L.update(dt);
    this.drops.update(dt, this.env);
    for (let i = this.ringFly.length - 1; i >= 0; i--) {
      const r = this.ringFly[i]; r.life -= dt; r.v.y -= 9.8 * dt; r.m.position.addScaledVector(r.v, dt); r.m.rotation.x += r.spin.x * dt; r.m.rotation.y += r.spin.y * dt;
      if (r.m.position.y < PATIO + 0.005) { r.m.position.y = PATIO + 0.005; r.v.set(0, 0, 0); r.spin.set(0, 0, 0); }
      if (r.life < 0) { r.m.visible = false; this.ringFly.splice(i, 1); }
    }
    if (this.puddle.visible) { this.puddleGrow = Math.min(1, this.puddleGrow + dt * 1.5); const s = 0.75 * ease(this.puddleGrow); this.puddle.scale.set(s, 1, s * 0.8); }
    this.updateHints(dt);
    this.updateCamera(dt);
  }

  updateStateGoals(dt) {
    const st = this.state;
    if (st === 'tie') {
      this.focusX = this.cloths.find((c) => c.ties.length === 0)?.centroid().x ?? -0.56;
      if (this.cloths.every((c) => c.ties.length > 0) && this.t - (this.lastTieT || 0) > 3.0 && !this.ptrDown) {
        this.setState('dye');
        for (const c of this.cloths) for (const t of c.ties) t.preferUp = true;
        this.girl.setFeel('happy', 2);
      }
    }
    if (st === 'dye') {
      if (!this.held) {
        // show both the next cloth and where it should go
        const h = this.hint();
        const want = h ? (h.drag ? (h.p.x + h.drag.x) / 2 : h.p.x) : this.girl.group.position.x;
        this.focusX = THREE.MathUtils.lerp(this.focusX ?? want, want, 0.03);
      }
      if (this.papa && !this.mishap.stage) {
        const dipped = this.cloths.some((c) => c.indigoDone);
        this.dipT = dipped ? (this.dipT || 0) + dt : 0;
        if (this.dipT > 5 || this.stateT > 70 || this.cloths.every((c) => c.state === 'basket')) this.startMishap();
      }
      if (this.mishap.stage >= 5) this.checkDyeDone();
    }
    if (st === 'line') {
      this.focusX = this.hint()?.p.x ?? 0;
      const all = this.lineCloths();
      const tied = all.some((c) => c.ties.length);
      if (!tied) {
        this.dryT += dt;
        const wetMax = Math.max(...all.map((c) => c.wet));
        if (all.length === 3 && wetMax < 0.12 && this.papa) {
          this.setState('finale');
          this.audio.chime(5, 600);
          for (const p of [this.girl, this.papa, this.mama]) p && p.setFeel('happy', 2);
          this.walkTo(this.girl, new V3(0.6, PATIO, -1.2), 0.8);
          this.walkTo(this.mama, new V3(-1.2, PATIO, -1.3), 0.8);
          this.walkTo(this.papa, new V3(1.62, PATIO, -1.3), 0.8);
        }
      }
    }
    if (st === 'finale') this.focusX = this.hint()?.p.x ?? 0;
  }

  updateCloth(c, dt, tubs) {
    if (c.state === 'worn') { c.dye.step(dt, null, null, { dry: 0.02 }); c.wet = Math.max(0, c.wet - dt * 0.02); return; }
    const env = this.env;
    // wetness: anything under the liquid soaks
    let under = 0, lowest = null, lowY = 9;
    for (let k = 0; k < c.n; k += 2) {
      const x = c.pos[k * 3], y = c.pos[k * 3 + 1], z = c.pos[k * 3 + 2];
      if (env.liquidAt(x, y, z)) { under++; if (Math.random() < 0.02) { const li = this.liquids.find((L) => L.tub.on && Math.hypot(x - L.tub.x, z - L.tub.z) < 0.25); if (li) li.disturb(x, z, 0.35, 1); } }
      if (y < lowY) { lowY = y; lowest = k; }
    }
    if (under > 0) {
      c.wet = 1; c.inLiquid = true;
      const tb = tubs.find((tb) => tb.on && Math.hypot(c.pos[lowest * 3] - tb.x, c.pos[lowest * 3 + 2] - tb.z) < tb.innerR + 0.02);
      const idx = tb ? tubs.indexOf(tb) : (c.lastTub ?? 0);
      c.lastTub = idx; c.drip = 1; c.dipTime = (c.dipTime || 0) + dt;
      if (Math.random() < 0.08) this.audio.bubble();
      if (!c.wasIn) { this.audio.dip(0.7); c.wasIn = true; this.girl.setFeel('focus', 1); }
      if (c.dipTime > 0.6) c.dyed = true;
      if (idx === 0 && c.dipTime > 0.8) c.indigoDipping = true;
    } else {
      if (c.wasIn) {
        c.wasIn = false; this.audio.dip(0.35); c.dipTime = 0;
        if (c.indigoDipping) { c.indigoDone = true; c.indigoDipping = false; this.later(1.2, () => { this.girl.setFeel('wow', 1.6); this.audio.chime(3, 520); }); }
      }
      const dryRate = c.state === 'line' && !c.ties.length ? 1 / 24 : (c.state === 'line' ? 1 / 200 : 1 / 260);
      c.wet = Math.max(0, c.wet - dt * dryRate * (0.6 + this.windAmt));
      c.drip = Math.max(0, c.drip - dt * 0.18);
      // drips from the lowest point while wet
      if (c.drip > 0.05 && lowest !== null && Math.random() < c.drip * 0.5) {
        const p = c.vertex(lowest);
        const col = c.lastTub === 0 ? new THREE.Color(0.05, 0.1, 0.1) : new THREE.Color(0.4, 0.05, 0.15);
        this.drops.spawn(p, new V3(0, -0.05, 0), 0.0025 + Math.random() * 0.003, col, { onLand: (d, w) => { if (w === 'liquid') { const L = this.liquids.find((L) => Math.hypot(d.pos.x - L.tub.x, d.pos.z - L.tub.z) < 0.25); L && L.disturb(d.pos.x, d.pos.z, 0.6, 1); } if (Math.random() < 0.3) this.audio.drip(); } });
      }
    }
    // physical response: wet cotton hangs heavy, dry cotton flies
    c.gravityScale = 1 + 0.25 * c.wet;
    c.damping = 0.985 - 0.015 * c.wet;
    if (c.settle > 0) c.settle -= dt;
    const onTable = c.state === 'table';
    const envCloth = { ...env, wind: onTable ? new V3() : (c.state === 'line' ? this.wind : this.wind.clone().multiplyScalar(0.25)), windAmt: c.state === 'line' ? this.windAmt : 0.1 };
    // a cloth lowered from above a bath goes into it (instead of catching on the rim)
    envCloth.insideTub = null;
    if (c.state === 'held' && this.held && this.held.cloth === c) {
      const ht = this.held.target;
      for (const tb of this.world.tubs) if (tb.on && Math.hypot(ht.x - tb.x, ht.z - tb.z) < tb.R0 && ht.y < tb.baseY + tb.H + 0.35) envCloth.insideTub = tb;
      c.damping = Math.min(c.damping, 0.965);
    }
    c.simulate(dt, envCloth);
    // dye field (only where the cloth is really under the liquid)
    const dry = c.state === 'line' ? (c.ties.length ? 0.004 : 0.04 * (0.6 + this.windAmt)) : 0.004;
    c.dye.step(dt, c.geo, tubs, { dry, diff: 0.14 });
  }

  updatePeople(dt) {
    const ppl = [this.girl, this.papa, this.mama].filter(Boolean);
    const camPos = this.cam.position;
    for (const p of ppl) {
      // walking
      if (p.walkTarget) {
        const d = p.walkTarget.clone().sub(p.group.position); d.y = 0;
        const L = d.length();
        if (L < 0.02) { p.walkTarget = null; p.poseT.walk = 0; }
        else {
          const sp = Math.min(L, p.walkSpeed * dt * (p.H / 1.4));
          p.group.position.addScaledVector(d.normalize(), sp);
          p.poseT.walk = Math.min(1, L * 6);
          const yaw = Math.atan2(d.x, d.z);
          p.group.rotation.y += (wrap(yaw - p.group.rotation.y)) * Math.min(1, dt * 6);
        }
      } else {
        // face the camera-ish when idle
        const want = Math.atan2(camPos.x - p.group.position.x, camPos.z - p.group.position.z) * 0.6;
        p.group.rotation.y += wrap(want - p.group.rotation.y) * Math.min(1, dt * 2.5);
      }
      p.wind = this.windAmt;
    }
    // girl looks where things happen
    const G = this.girl;
    let look = this.cam.position.clone();
    if (this.held) look = this.held.target.clone();
    else if (this.state === 'tie' && this.tieAnim) look = this.tieAnim.cloth.vertex(this.tieAnim.tie.c);
    else if (this.mishap.stage >= 2 && this.mishap.stage < 3.5 && this.papa) look = this.papa.B.head.getWorldPosition(new V3());
    if (this.state === 'line' && this.reach) look = this.reach.p.clone();
    G.lookAt = look;
    // arms
    G.armW.L *= 0.9; G.armW.R *= 0.9;
    let reachP = null;
    if (this.held && this.state !== 'finale') reachP = this.held.target;
    if (this.tieAnim) {
      const a = this.tieAnim; a.t += dt;
      const tp = a.cloth.vertex(a.tie.c);
      reachP = tp.clone().add(new V3(Math.cos(a.t * 14) * 0.03, 0.02 + Math.sin(a.t * 7) * 0.01, Math.sin(a.t * 14) * 0.03));
      if (a.t > 0.9) this.tieAnim = null;
    }
    if (this.reach) { reachP = this.reach.p; this.reach.t -= dt; if (this.reach.t < 0) this.reach = null; }
    if (reachP && !(this.mishap.stage === 4 && this.pouring)) {
      const s = reachP.x > G.group.position.x ? 'L' : 'R';
      G.handTarget[s] = reachP.clone(); G.armW[s] = Math.min(1, G.armW[s] + 0.25);
      const far = reachP.clone().sub(G.B.chest.getWorldPosition(new V3())); far.y = 0;
      G.poseT.lean = clamp((far.length() - 0.25) * 1.6, 0, 0.7);
      G.poseT.crouch = clamp((0.62 - reachP.y) * 0.9, 0, 0.3);
    } else { G.poseT.lean = 0; G.poseT.crouch = 0; }
    if (this.papa) { if (!this.papa.lookAt || this.mishap.stage === 0 || this.mishap.stage >= 5) this.papa.lookAt = this.state === 'finale' ? camPos.clone() : G.B.head.getWorldPosition(new V3()); }
    if (this.mama) this.mama.lookAt = this.state === 'intro' || this.state === 'tie' ? G.B.head.getWorldPosition(new V3()) : (this.state === 'finale' ? camPos.clone() : G.B.head.getWorldPosition(new V3()));
    for (const p of ppl) if (p.group.visible) p.update(dt, {});
  }

  // debug: soak part of a cloth (v range) in a bath for some seconds without moving it
  virtualDip(c, idx, v0, v1, secs) {
    const r = this.R.r, D = c.dye; const prev = r.getRenderTarget();
    r.setRenderTarget(D.sub); r.setClearColor(0x000000, 1); r.clear(true, false, false);
    if (idx >= 0) {
      r.setScissorTest(true); r.setScissor(0, Math.floor(v0 * 128), 128, Math.ceil((v1 - v0) * 128));
      r.setClearColor(idx === 0 ? 0xff0000 : 0x00ff00, 1); r.clear(true, false, false); r.setScissorTest(false);
    }
    r.setRenderTarget(prev);
    for (let i = 0; i < secs * 20; i++) D.step(1 / 20, null, null, { dry: 0.0 });
    c.wet = 1; c.dyed = true;
  }

  // ---------------------------------------------------------------- debug shortcuts (?skip=...)
  debugSkip(s) {
    const go = () => {
      if (!this.papa) return setTimeout(go, 200);
      this.hasApron = this.hasGloves = true; this.stool.apron.visible = false; this.stool.gloves.visible = false; this.stool.strap.visible = false;
      this.apronWorn.parts.forEach((p) => (p.visible = true));
      const G = this.girl.meshes; G.gloveL.visible = G.gloveR.visible = true; G.handL.visible = G.handR.visible = false;
      this.girl.group.position.set(-0.56, PATIO, -0.36);
      if (s === 'tie') { this.setState('tie'); return; }
      // auto ties
      this.tee.addTie(this.tee.pinIndex([0.5, 0.45])); this.tee.addTie(this.tee.pinIndex([0.5, 0.45])); this.tee.addTie(this.tee.pinIndex([0.5, 0.45]));
      this.tee.addTie(this.tee.pinIndex([0.35, 0.8]));
      this.hanky.addTie(this.hanky.pinIndex([0.5, 0.5])); this.hanky.addTie(this.hanky.pinIndex([0.5, 0.5]));
      for (const c of this.cloths) { c.dye.paintResist(c.ties, c.shape); for (const t of c.ties) t.preferUp = true; }
      this.setState('dye');
      if (s === 'dye') return;
      // auto dye: stamp dye straight into the fields
      this.virtualDip(this.tee, 0, 0.0, 1.0, 5); this.virtualDip(this.tee, 1, 0.0, 0.3, 2.5); this.virtualDip(this.tee, -1, 0, 1, 6);
      this.virtualDip(this.hanky, 1, 0.0, 1.0, 4); this.virtualDip(this.hanky, 0, 0.55, 1.0, 3); this.virtualDip(this.hanky, -1, 0, 1, 6);
      if (s === 'mishap') { this.startMishap(); return; }
      this.mishap.stage = 5; this.papa.meshes.top.material = this.papa.undershirtMat;
      for (let i = 0; i < 6; i++) this.papaShirt.dye.stamp(0.3 + Math.random() * 0.4, 0.3 + Math.random() * 0.5, 0.08, 0.06, 1.3, 0, 1);
      for (const c of this.cloths) c.state = 'basket';
      this.toLine();
      if (s === 'line') return;
      this.later(3, () => { for (const c of this.lineCloths()) for (const t of [...c.ties]) this.untie(c, t); });
      this.later(6, () => { for (const c of this.lineCloths()) c.wet = 0.05; });
      if (s === 'dry') return;
      if (s === 'finale' || s === 'worn') this.later(9, () => {
        if (s === 'worn') { this.handTo(this.tee, 'girl'); this.handTo(this.hanky, 'mama'); this.handTo(this.papaShirt, 'papa'); }
      });
    };
    go();
  }
}

function wrap(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
