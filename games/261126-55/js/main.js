// ぬれたコンクリートに あしあと — game flow.
import * as THREE from 'three';
import { initRenderer, resize, render, makeSky, makeEnv, tex, DETAIL, R, damp, lerp, clamp01, smooth } from './core.js';
import { loadFigureData, Figure, LOOKS } from './figure.js';
import { Slab, SLAB } from './concrete.js';
import { buildWorld, sRGB } from './world.js';
import { buildTruck, paintedMetal } from './truck.js';
import { Human, Dog } from './actors.js';
import { buildHelmet, buildKidBoot, buildTrowel, buildLeaf, buildDinoStamp, buildTray, buildSign, PourFX, buildSun } from './props.js';
import { initAudio, setLoop, sfx, A } from './audio.js';

const Q = new URLSearchParams(location.search);
const DEV = Q.has('dev');
const canvas = document.getElementById('c');
const renderer = initRenderer(canvas);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 150);
resize(camera);
window.addEventListener('resize', () => resize(camera));

// ---------------------------------------------------------------- sky, fog, light (dawn → morning)
const sky = makeSky(); scene.add(sky);
const FOG = { dawn: sRGB('#bfc3c6'), morning: sRGB('#d9dde2') };
scene.fog = new THREE.FogExp2(FOG.dawn.clone(), 0.052);
const sun = new THREE.DirectionalLight(0xffd1a8, 1.3);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 7; sun.shadow.blurSamples = 16; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
Object.assign(sun.shadow.camera, { left: -3.2, right: 3.2, top: 3.2, bottom: -3.2, near: 0.5, far: 30 });
scene.add(sun); scene.add(sun.target);
const hemi = new THREE.HemisphereLight(0xc9d3e0, 0x4a443c, 0.35); scene.add(hemi);
const work = new THREE.SpotLight(0xfff0dc, 26, 9, 0.75, 0.85, 1.6);
work.castShadow = true; work.shadow.mapSize.set(1024, 1024); work.shadow.radius = 5; work.shadow.blurSamples = 12; work.shadow.bias = -0.0006;
scene.add(work); scene.add(work.target);
const faceFill = new THREE.PointLight(0xffe6d0, 0.0, 2.5, 2); scene.add(faceFill);

const TOD = { t: 0 };
function setTimeOfDay(t) {
  TOD.t = t;
  const u = sky.material.uniforms;
  const sunDir = new THREE.Vector3(lerp(-0.75, -0.45, t), lerp(0.1, 0.62, t), lerp(-0.66, -0.45, t)).normalize();
  u.uSun.value.copy(sunDir);
  u.uZen.value.copy(sRGB('#7b8694')).lerp(sRGB('#7fa3c9'), t);
  u.uHor.value.copy(sRGB('#c7c9c9')).lerp(sRGB('#dfe4e8'), t);
  u.uGlow.value.set(lerp(1.4, 1.2, t), lerp(0.95, 1.1, t), lerp(0.7, 1.0, t));
  u.uGlowAmt.value = lerp(0.75, 0.45, t);
  scene.fog.color.copy(FOG.dawn).lerp(FOG.morning, t);
  scene.fog.density = lerp(0.055, 0.018, t);
  sun.position.copy(sunDir).multiplyScalar(14); sun.target.position.set(0, 0, 0);
  sun.color.setRGB(1, lerp(0.8, 0.95, t), lerp(0.62, 0.86, t));
  sun.intensity = lerp(1.1, 2.6, t);
  sun.shadow.radius = lerp(9, 4, t);
  hemi.intensity = lerp(0.4, 0.55, t);
  work.intensity = lerp(26, 0, smooth(t * 1.4));
  R.post.uniforms.uExposure.value = lerp(1.08, 0.92, t);
  if (t > 0.5 && ENV.morning && scene.environment !== ENV.morning) scene.environment = ENV.morning;
  if (t <= 0.5 && ENV.dawn && scene.environment !== ENV.dawn) scene.environment = ENV.dawn;
}
const ENV = {};
ENV.dawn = makeEnv(renderer, { glow: 0.8, zen: sRGB('#7b8694'), hor: sRGB('#c7c9c9'), sun: new THREE.Vector3(-0.75, 0.1, -0.66).normalize(),
  panels: [{ w: 2.5, h: 2.0, pos: new THREE.Vector3(5, 3.5, 4), color: new THREE.Color(5, 4.7, 4.3) }], bright: 1.05 });
scene.environment = ENV.dawn;
setTimeOfDay(0);

// ---------------------------------------------------------------- textures (light ones first)
const T = {};
T.groundC = tex('tex/ground_c.jpg', { srgb: true }); T.groundN = tex('tex/ground_n.jpg'); T.groundORM = tex('tex/ground_orm.jpg');
T.woodC = tex('tex/wood_c.jpg', { srgb: true }); T.woodN = tex('tex/wood_n.jpg'); T.woodORM = tex('tex/wood_orm.jpg');
T.metalN = tex('tex/metal_n.jpg'); T.metalD = tex('tex/metal_d.png'); T.concreteD = tex('tex/concrete_d.png'); DETAIL.tex = tex('tex/detail_h.png');
const bedTex = T.groundC;

const W = buildWorld(scene, T);
W.workLight.group.position.set(1.55, 0, 1.0);
work.position.copy(W.workLight.head.getWorldPosition(new THREE.Vector3())).add(new THREE.Vector3(-0.05, 0, -0.05));
work.target.position.set(-0.1, 0.2, -0.3);
const slab = new Slab(T.concreteD, bedTex); scene.add(slab.mesh);
const truck = buildTruck(scene, T);
const pourFX = new PourFX(scene, T);
const sign = buildSign(T); sign.position.set(-1.35, 0, 0.75); sign.rotation.y = 0.45; scene.add(sign);
const sunSprite = buildSun(); sunSprite.scale.setScalar(2.2); sunSprite.position.set(-9, 3.2, -14); sunSprite.visible = false; scene.add(sunSprite);

// ---------------------------------------------------------------- characters (girl first; others stream in)
const actors = {};
let girl = null, papa = null, mama = null, dog = null;
const ready = (async () => {
  const gm = await loadFigureData('tex/fig_girl.bin');
  const gf = new Figure(gm, LOOKS.girl); scene.add(gf.root);
  girl = actors.girl = new Human(gf, { speed: 0.95 });
  girl.pos.set(0.45, 0, -0.62); girl.yaw = girl.yawT = 0.15;
  girl.f.setExpr('happy');
})();
const later = (async () => {
  await ready;
  const pm = await loadFigureData('tex/fig_papa.bin');
  const pf = new Figure(pm, LOOKS.papa); scene.add(pf.root);
  papa = actors.papa = new Human(pf, { speed: 1.0 });
  papa.pos.set(1.45, 0, -0.8); papa.yaw = papa.yawT = -0.5;
  papa.helmet = buildHelmet(T, '#d9d6cc', 1.22); attachHelmet(papa, papa.helmet, 1.18);
  papa.f.setExpr('happy');
  const [mm, dm] = await Promise.all([loadFigureData('tex/fig_mama.bin'), loadFigureData('tex/fig_dog.bin')]);
  const mf = new Figure(mm, LOOKS.mama); mama = actors.mama = new Human(mf, { speed: 0.9 }); mama.pos.set(-6, 0, 1.2); mf.root.visible = false; scene.add(mf.root);
  const df = new Figure(dm, LOOKS.dog); dog = actors.dog = new Dog(df); dog.pos.set(-6.5, 0, 1.4); df.root.visible = false; scene.add(df.root);
})();

function attachHelmet(h, helm, k) {
  const head = h.f.B.head; head.add(helm);
  helm.position.set(0, 0.14 * k, -0.014 * k); helm.rotation.set(-0.26, 0, 0);
  helm.traverse(m => { if (m.isMesh) m.castShadow = true; });
}

// ---------------------------------------------------------------- props
const helmet = buildHelmet(T, '#c99a2e', 1.0);
const bucketMat = paintedMetal(T, '#9a9c9b', { rough: 0.38, grime: 1.3, splat: 1.4, metal: 0.9, clear: 0 }); bucketMat.side = THREE.DoubleSide;
const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.3, 40, 6, true), bucketMat);
for (const yy of [-0.09, 0.0, 0.09]) { const rb = new THREE.Mesh(new THREE.TorusGeometry(0.137 + yy * 0.1, 0.004, 6, 40), bucketMat); rb.rotation.x = Math.PI / 2; rb.position.y = yy; bucket.add(rb); }
{ const lip = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.006, 8, 40), bucketMat); lip.rotation.x = Math.PI / 2; lip.position.y = 0.15; bucket.add(lip); const hnd = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.003, 6, 32, Math.PI), bucketMat); hnd.rotation.set(0.5, 0, 0); hnd.position.y = 0.15; hnd.castShadow = true; bucket.add(hnd); }
const bucketBottom = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), bucket.material); bucketBottom.rotation.x = -Math.PI / 2; bucketBottom.position.y = 0.15; bucket.add(bucketBottom);
bucket.position.set(0.95, 0.15, -0.66); bucket.castShadow = bucket.receiveShadow = true; scene.add(bucket);
helmet.position.set(0.95, 0.315, -0.66); helmet.rotation.y = -0.4; scene.add(helmet);
const bootPair = new THREE.Group(); const b1 = buildKidBoot(T), b2 = buildKidBoot(T); b1.position.x = -0.05; b2.position.set(0.06, 0, 0.02); b2.rotation.y = 0.15; bootPair.add(b1, b2);
bootPair.position.set(0.05, 0, -0.62); bootPair.rotation.y = -0.2; scene.add(bootPair);

const tools = {};
const tray = buildTray(T); tray.position.set(0, 0, 0.62); scene.add(tray); tray.visible = false;
tools.trowel = buildTrowel(T); tools.boot = buildKidBoot(T); tools.leaf = buildLeaf(); tools.dino = buildDinoStamp(T);
const traySlots = { trowel: -0.45, boot: -0.15, leaf: 0.15, dino: 0.45 };
for (const [k, g] of Object.entries(tools)) { g.userData.home = new THREE.Vector3(traySlots[k], 0.05, 0.62); g.position.copy(g.userData.home); scene.add(g); g.visible = false; }
tools.boot.rotation.x = 0;
const handTool = tools.trowel; // scene 1 uses trowel only

// ---------------------------------------------------------------- camera shots
const SHOTS = {
  dress: { c: new THREE.Vector3(0.55, 0.58, -0.62), w: 1.35, h: 1.3, dir: new THREE.Vector3(-0.08, -0.25, -1) },
  pour: { c: new THREE.Vector3(-0.3, 0.6, -0.55), w: 3.0, h: 1.9, dir: new THREE.Vector3(-0.28, -0.42, -1) },
  work: { c: new THREE.Vector3(0.0, 0.3, -0.2), w: 1.7, h: 1.05, dir: new THREE.Vector3(0.05, -0.4, -1) },
  papa: { c: new THREE.Vector3(0.1, 0.65, -0.1), w: 2.8, h: 1.9, dir: new THREE.Vector3(0.05, -0.3, -1) },
  dry: { c: new THREE.Vector3(-0.2, 0.55, -0.4), w: 3.6, h: 2.0, dir: new THREE.Vector3(0.1, -0.28, -1) },
  walk: { c: new THREE.Vector3(0.0, 0.7, -0.1), w: 3.3, h: 2.0, dir: new THREE.Vector3(0.12, -0.3, -1) },
};
const cam = { pos: new THREE.Vector3(0, 1.4, 3), tgt: new THREE.Vector3(0, 0.3, 0), shot: 'dress', k: 2.0 };
function shotPose(name) {
  const S = SHOTS[name]; const aspect = R.w / R.h;
  const portrait = aspect < 1;
  const vfov = portrait ? 50 : 36;
  camera.fov = lerp(camera.fov, vfov, 1);
  const tv = Math.tan(THREE.MathUtils.degToRad(vfov / 2)), th = tv * aspect;
  const d = portrait ? Math.max(S.w * 0.6 / 2 / th, S.h * 1.1 / 2 / tv) : Math.max(S.w / 2 / th, S.h / 2 / tv) * 1.04;
  const dir = S.dir.clone().normalize();
  return { pos: S.c.clone().addScaledVector(dir, -d), tgt: S.c.clone(), d };
}
function setShot(name, k = 1.6, snap = false) { cam.shot = name; cam.k = k; if (snap || DEV) { const p = shotPose(name); cam.pos.copy(p.pos); cam.tgt.copy(p.tgt); } }
function updateCamera(dt, t) {
  const p = shotPose(cam.shot);
  cam.pos.lerp(p.pos, 1 - Math.exp(-cam.k * dt));
  cam.tgt.lerp(p.tgt, 1 - Math.exp(-cam.k * dt));
  // hand-held breathing (very subtle)
  camera.position.copy(cam.pos).add(new THREE.Vector3(Math.sin(t * 0.43) * 0.006, Math.sin(t * 0.61) * 0.005, 0));
  camera.lookAt(cam.tgt);
  camera.updateProjectionMatrix();
  R.post.uniforms.uFocus.value = camera.position.distanceTo(cam.tgt);
  R.post.uniforms.uAperture.value = R.w / R.h < 1 ? 0.5 : 0.55;
}

// ---------------------------------------------------------------- hint hand (DOM overlay)
const hintEl = document.getElementById('hint');
const HINT = { target: null, idle: 0, mode: 'tap' };
function hintAt(obj, mode = 'tap') { HINT.target = obj; HINT.mode = mode; }
function updateHint(dt) {
  HINT.idle += dt;
  const show = HINT.target && HINT.idle > 4.0 && !input.down;
  hintEl.style.opacity = show ? 1 : 0;
  if (!HINT.target) return;
  const p = (HINT.target.isVector3 ? HINT.target.clone() : HINT.target.getWorldPosition(new THREE.Vector3()));
  if (HINT.offset) p.add(HINT.offset);
  p.project(camera);
  const x = (p.x * 0.5 + 0.5) * R.w, y = (-p.y * 0.5 + 0.5) * R.h;
  const sw = HINT.mode === 'swipe' ? Math.sin(performance.now() / 260) * 45 : 0;
  hintEl.style.transform = `translate(${x - 18 + sw}px, ${y - 4}px)`;
  hintEl.className = HINT.mode;
}
const glowList = new Set();
function glow(obj, on) { obj.traverse(m => { if (m.isMesh && m.material && m.material.emissive) { if (on) { m.userData.em = m.userData.em || m.material.emissive.clone(); glowList.add(m); } else { glowList.delete(m); if (m.userData.em) m.material.emissive.copy(m.userData.em); } } }); }
function updateGlow(t) { const k = 0.18 + 0.14 * Math.sin(t * 4); for (const m of glowList) m.material.emissive.setRGB(k * 1.0, k * 0.85, k * 0.6); }

// ---------------------------------------------------------------- input
const input = { down: false, x: 0, y: 0, start: 0, id: null, hit: null };
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function pick(x, y) { ndc.set(x / R.w * 2 - 1, -(y / R.h) * 2 + 1); ray.setFromCamera(ndc, camera); return ray; }
function slabPoint(x, y, margin = 0.06) {
  const r = pick(x, y); const pl = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.08); const p = new THREE.Vector3();
  if (!r.ray.intersectPlane(pl, p)) return null;
  if (Math.abs(p.x) > SLAB.W / 2 + margin || Math.abs(p.z) > SLAB.D / 2 + margin) return null;
  p.x = THREE.MathUtils.clamp(p.x, -SLAB.W / 2 + 0.02, SLAB.W / 2 - 0.02); p.z = THREE.MathUtils.clamp(p.z, -SLAB.D / 2 + 0.02, SLAB.D / 2 - 0.02);
  return p;
}
function hitObj(x, y, obj, radius) {
  const r = pick(x, y); const c = obj.isVector3 ? obj : obj.getWorldPosition(new THREE.Vector3());
  return r.ray.distanceSqToPoint(c) < radius * radius;
}
canvas.addEventListener('pointerdown', (e) => {
  initAudio(); if (input.down) return;
  input.down = true; input.id = e.pointerId; input.x = e.clientX; input.y = e.clientY; input.px = input.x; input.py = input.y; input.start = performance.now();
  HINT.idle = 0; G.onDown && G.onDown(input.x, input.y);
  canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => { if (!input.down || e.pointerId !== input.id) return; input.x = e.clientX; input.y = e.clientY; HINT.idle = 0; });
const up = (e) => { if (!input.down || e.pointerId !== input.id) return; input.down = false; G.onUp && G.onUp(input.x, input.y); };
canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
document.addEventListener('gesturestart', e => e.preventDefault());
document.getElementById('again').addEventListener('click', () => location.reload());

// ---------------------------------------------------------------- game state machine
const G = { state: 'load', t: 0, st: 0 };
function go(state) { G.state = state; G.st = 0; G.onDown = null; G.onUp = null; STATES[state].enter && STATES[state].enter(); }

const work_ = { tool: 'trowel', press: null, toolObj: null, side: 'back', last: null, pourT: 0, flow: 0, leverDown: false, prints: 0, kinds: new Set(), lastEff: 0 };

function girlWorkSpot(p) {
  // girl kneels on the side of the slab closest to the touch; shuffles along x
  const side = 'back';
  const z = side === 'back' ? -SLAB.D / 2 - 0.15 : SLAB.D / 2 + 0.15;
  const x = THREE.MathUtils.clamp(p.x + (side === 'back' ? 0.12 : -0.12), -SLAB.W / 2 + 0.05, SLAB.W / 2 - 0.05);
  return { side, pos: new THREE.Vector3(x, 0, z), yaw: side === 'back' ? 0 : Math.PI };
}
function moveGirlTo(spot, cb) {
  const g = girl; const d = g.pos.distanceTo(spot.pos);
  if (spot.side !== work_.side && work_.side) {
    // walk around the right end of the slab (never across the wet concrete)
    const ex = SLAB.W / 2 + 0.3; const z0 = g.pos.z, z1 = spot.pos.z;
    g.kneelT = 0; g.leanT = 0;
    g.goTo(new THREE.Vector3(ex, 0, z0), () => g.goTo(new THREE.Vector3(ex, 0, z1), () => g.goTo(spot.pos, () => { g.yawT = spot.yaw; g.kneelT = 1; cb && cb(); })));
    work_.side = spot.side; work_.walking = true;
    return;
  }
  work_.side = spot.side;
  if (d > 0.45) { g.kneelT = 0; g.goTo(spot.pos, () => { g.yawT = spot.yaw; g.kneelT = 1; cb && cb(); }); work_.walking = true; }
  else { work_.walking = false; g.yawT = spot.yaw; g.kneelT = 1; g.shuffle = spot.pos.clone(); cb && cb(); }
}

function toolPose(obj, p, kind, depth, t) {
  obj.visible = true;
  const y = slab.heightAt(p.x, p.z);
  obj.position.set(p.x, y + 0.002 - depth, p.z);
  if (kind === 'trowel') { obj.rotation.set(0, (work_.side === 'back' ? 0 : Math.PI) + Math.sin(t * 3) * 0.05, 0); obj.position.y = y + 0.004; }
  else if (kind === 'boot') { obj.rotation.set(0, work_.side === 'back' ? 0 : Math.PI, 0); }
  else if (kind === 'leaf') { obj.rotation.set(0, 0.6, 0); obj.position.y = y + 0.006 - depth * 0.6; }
  else if (kind === 'dino') { obj.rotation.set(0, work_.side === 'back' ? Math.PI : 0, 0); obj.position.y = y + 0.008 - depth; }
}

const STATES = {
  // ------------------------------------------------ opening: helmet & boots
  dress: {
    enter() {
      setShot('dress', 1.2);
      girl.f.setExpr('happy'); girl.look = camera.position;
      HINT.offset = null; hintAt(helmet); glow(helmet, true); glow(bootPair, true);
      G.dressed = { helmet: false, boots: false };
      girl.f.meshes[0].material.userData.bootsOn = false; setBoots(false);
      G.onDown = (x, y) => {
        if (!G.dressed.helmet && hitObj(x, y, helmet, 0.22)) { G.dressed.helmet = true; flyHelmet(); glow(helmet, false); hintAt(bootPair); return; }
        if (!G.dressed.boots && hitObj(x, y, new THREE.Vector3(0.05, 0.08, -0.62), 0.24)) { G.dressed.boots = true; flyBoots(); glow(bootPair, false); hintAt(helmet); return; }
        // anywhere else: she giggles
        girl.f.setExpr('joy'); sfx.voice('hehe', 1.5); setTimeout(() => girl.f.setExpr('happy'), 700);
      };
    },
    update(dt) {
      girl.look = camera.position;
      if (G.dressed.helmet && G.dressed.boots && !G.dressDone) {
        G.dressDone = true; hintAt(null);
        setTimeout(() => { girl.doGesture('cheer', 1.5); girl.f.setExpr('joy'); sfx.voice('yay', 1.5); sfx.chime(); }, 900);
        setTimeout(() => go('pour'), 2700);
      }
    },
  },
  // ------------------------------------------------ scene 1: pour & trowel
  pour: {
    enter() {
      setShot('pour', 1.1);
      glow(truck.knob, true); hintAt(truck.knob); HINT.offset = null;
      girl.f.setExpr('happy');
      G.onDown = (x, y) => {
        if (hitObj(x, y, truck.knob, 0.2)) { leverStart(); return; }
        const p = slabPoint(x, y); if (p) trowelStart(p);
      };
      G.onUp = () => { leverStop(); trowelStop(); };
    },
    update(dt, t) {
      const st = slab.stats(); G.stats = st;
      if (work_.leverDown) {
        const tip = truck.leverTip();
        girl.reach('R', tip, 1); girl.look = slab.mesh.position;
      }
      // hint: lever until enough concrete, then trowel on rough spots
      if (st.fill < 0.92 && !work_.leverDown) { hintAt(truck.knob, 'tap'); }
      else if (st.fill >= 0.92) {
        glow(truck.knob, false);
        const rough = roughestSpot(); HINT.offset = null; hintAt(rough, 'swipe');
        if (G.state === 'pour' && G.st > 1 && work_.cam !== 'work') { work_.cam = 'work'; setShot('work', 1.0); }
      }
      if (st.fill > 1.04 && work_.leverDown) leverStop(true);
      if (st.fill > 0.92 && st.level > 0.88 && st.polish > 0.72 && !G.pourDone) {
        G.pourDone = true; trowelStop(); hintAt(null);
        girl.f.setExpr('joy'); girl.doGesture('cheer', 1.8); sfx.done(); sfx.voice('yay', 1.5); sfx.sparkle();
        papa && (papa.doGesture('clap', 1.6), papa.f.setExpr('joy'));
        setTimeout(() => go('stamp'), 3000);
      }
    },
  },
  // ------------------------------------------------ scene 2: prints, papa walks through, fix
  stamp: {
    enter() {
      setShot('work', 1.0); tray.visible = true;
      for (const k in tools) { tools[k].visible = true; tools[k].position.copy(tools[k].userData.home); tools[k].rotation.set(0, 0, 0); }
      work_.tool = 'hand'; work_.prints = 0; G.papaDone = false; G.papaStarted = false; G.fixed = false;
      HINT.offset = null; hintAt(new THREE.Vector3(0.1, 0.09, -0.05), 'tap');
      G.onDown = (x, y) => {
        // tool tray first
        for (const k of Object.keys(tools)) {
          if (hitObj(x, y, tools[k].userData.home.clone().add(new THREE.Vector3(0, 0.03, 0)), 0.11)) { selectTool(work_.tool === k ? 'hand' : k); return; }
        }
        if (G.sunReady && hitObj(x, y, sunSprite, 1.6)) { go('dry'); return; }
        if (papa && G.papaGag && hitObj(x, y, papa.f.B.chest, 0.4)) { papa.f.setExpr('oops'); sfx.voice('oh', 0.6); return; }
        const p = slabPoint(x, y); if (!p) return;
        if (work_.tool === 'trowel') trowelStart(p); else stampStart(p);
      };
      G.onUp = () => { trowelStop(); stampStop(); };
    },
    update(dt, t) {
      // papa gag after 3 prints or 14 s
      if (!G.papaStarted && papa && (work_.prints >= 3 || G.st > 14) && !input.down) startPapaGag();
      if (G.papaDone && !G.fixed) {
        const e = slab.impEnergy(-SLAB.W / 2, SLAB.W / 2) - (G.baseEnergy || 0);
        if (work_.tool !== 'trowel') { hintAt(tools.trowel.userData.home.clone().add(new THREE.Vector3(0, 0.03, 0)), 'tap'); }
        else { const s = deepestPapaPrint(); hintAt(s || new THREE.Vector3(0, 0.08, 0), 'swipe'); }
        if (e < G.papaEnergy * 0.18) {
          G.fixed = true; sfx.chime(); girl.f.setExpr('joy'); sfx.voice('yay', 1.4);
          papa.f.setExpr('happy'); papa.doGesture('thumb', 1.8); papa.look = girl.f.B.head.getWorldPosition(new THREE.Vector3());
          G.fixedAt = G.st;
        }
      }
      if (G.fixed && !G.sunReady) {
        if (work_.tool === 'trowel') hintAt(tools.dino.userData.home.clone().add(new THREE.Vector3(0, 0.03, 0)), 'tap'); else hintAt(new THREE.Vector3(0.2, 0.09, -0.1), 'tap');
        if (work_.kinds.size >= 3 && work_.printsAfterFix >= 2 || G.st - G.fixedAt > 40) {
          G.sunReady = true; sunSprite.visible = true; sunSprite.material.opacity = 0; hintAt(sunSprite, 'tap'); sfx.sparkle();
          setShot('papa', 0.8);
        }
      }
      if (G.sunReady) { sunSprite.material.opacity = Math.min(1, sunSprite.material.opacity + dt * 0.5); sunSprite.scale.setScalar(2.2 + Math.sin(t * 3) * 0.15); if (G.st - (G.sunAt ??= G.st) > 22) go('dry'); }
    },
  },
  // ------------------------------------------------ time passes: dries white, forms come off
  dry: {
    enter() {
      HINT.target = null; G.onDown = null; G.onUp = null; tray.visible = false; for (const k in tools) tools[k].visible = false;
      setShot('dry', 0.6); sfx.whoosh(); A.birdsOn = true;
      girl.kneelT = 0; girl.goTo(new THREE.Vector3(0.62, 0, -0.78), () => { girl.yawT = -0.3; });
      girl.f.setExpr('wow');
      if (papa) { papa.goTo(new THREE.Vector3(1.6, 0, -0.75), () => papa.yawT = -0.6); papa.f.setExpr('happy'); }
      ENV.morning = ENV.morning || makeEnv(renderer, { glow: 0.5, zen: sRGB('#7fa3c9'), hor: sRGB('#dfe4e8'), sun: new THREE.Vector3(-0.45, 0.62, -0.45).normalize(), bright: 1.25, ground: new THREE.Color(0.25, 0.23, 0.2) });
    },
    update(dt, t) {
      const k = clamp01(G.st / 9);
      setTimeOfDay(smooth(k));
      sunSprite.material.opacity = 1 - k; sunSprite.position.y = 3.2 + k * 6;
      slab.dryStep(dt, 0.14);
      girl.look = slab.mesh.position.clone().add(new THREE.Vector3(0, 0.1, 0));
      if (G.st > 10 && !G.formsOff) { G.formsOff = true; removeForms(); }
      if (G.st > 13) go('walk');
    },
  },
  // ------------------------------------------------ scene 3: the finished sidewalk, free play
  walk: {
    enter() {
      setShot('walk', 0.7); slab.dryStep(1, 5);
      HINT.offset = null;
      if (mama) { mama.f.root.visible = true; mama.pos.set(-4.2, 0, 0.05); mama.goTo(new THREE.Vector3(-1.15, 0, -0.12), () => { mama.yawT = 1.2; mama.doGesture('wave', 1.6); }); mama.f.setExpr('happy'); }
      if (dog) { dog.f.root.visible = true; dog.pos.set(-4.8, 0, 0.12); dog.goTo(new THREE.Vector3(-0.85, 0, 0.12), () => { dog.sitT = 1; dog.yawT = 1.5; }); }
      if (papa) papa.goTo(new THREE.Vector3(1.2, 0, -0.08), () => { papa.yawT = -0.9; });
      girl.goTo(new THREE.Vector3(0.45, 0, -0.62), () => { girl.yawT = 0.1; girl.f.setExpr('joy'); });
      document.getElementById('again').classList.add('show');
      G.onDown = (x, y) => playTap(x, y);
    },
    update(dt, t) {
      // hint: the prints glow-tap; rotate between kinds
      const prints = work_.printList.filter(p => !p.big);
      if (prints.length) { const p = prints[Math.floor(G.st / 6) % prints.length]; hintAt(new THREE.Vector3(p.x, 0.1, p.z), 'tap'); }
      for (const a of [girl, papa, mama]) if (a && !a.path && !a.busy) a.look = camera.position;
    },
  },
};

// ---------------------------------------------------------------- opening helpers
function setBoots(on) {
  const g = girl.f.meshes[0].geometry; const mat = girl.f.meta.parts[0].A.mat; const col = g.attributes.color, mp = g.attributes.mp;
  if (!g.userData.orig) g.userData.orig = { c: col.array.slice(), m: mp.array.slice() };
  const sock = sRGB('#e8e4dc'), O = g.userData.orig;
  for (let i = 0; i < mat.length; i++) {
    if (mat[i] !== 3 && mat[i] !== 6) continue;
    if (on) { col.setXYZ(i, O.c[i * 3], O.c[i * 3 + 1], O.c[i * 3 + 2]); mp.setXYZW(i, O.m[i * 4], O.m[i * 4 + 1], O.m[i * 4 + 2], O.m[i * 4 + 3]); }
    else { col.setXYZ(i, sock.r, sock.g, sock.b); mp.setXYZW(i, 0.95, 0.9, 2, 1); }
  }
  col.needsUpdate = true; mp.needsUpdate = true;
}
const flights = [];
function fly(obj, toFn, dur, onEnd, arc = 0.35) {
  const from = obj.getWorldPosition(new THREE.Vector3()); const q0 = obj.quaternion.clone();
  flights.push({ obj, from, toFn, dur, t: 0, onEnd, arc, q0 });
}
function updateFlights(dt) {
  for (let i = flights.length - 1; i >= 0; i--) {
    const F = flights[i]; F.t += dt; const k = smooth(F.t / F.dur);
    const to = F.toFn(); const p = F.from.clone().lerp(to, k); p.y += Math.sin(k * Math.PI) * F.arc;
    F.obj.position.copy(p); F.obj.rotation.y += dt * 6 * (1 - k);
    if (F.t >= F.dur) { flights.splice(i, 1); F.onEnd && F.onEnd(); }
  }
}
function flyHelmet() {
  sfx.pick(); girl.f.setExpr('wow');
  const headTop = () => girl.f.B.head.localToWorld(new THREE.Vector3(0, 0.128, -0.006));
  fly(helmet, headTop, 0.9, () => { attachHelmet(girl, helmet, 1.0); sfx.helmet(); girl.f.setExpr('joy'); sfx.voice('wa', 1.5); }, 0.4);
}
function flyBoots() {
  sfx.pick(); girl.f.setExpr('wow');
  fly(bootPair, () => girl.pos.clone().add(new THREE.Vector3(0, 0.0, 0.02)), 0.7, () => { bootPair.visible = false; setBoots(true); sfx.boots(); girl.f.setExpr('joy'); girl.tiptoe = 1; setTimeout(() => girl.tiptoe = 0, 250); sfx.voice('hehe', 1.5); }, 0.25);
}

// ---------------------------------------------------------------- lever / pour
function leverStart() {
  if (G.stats && G.stats.fill > 1.03) { girl.f.setExpr('puzzled'); sfx.voice('are', 1.4); setTimeout(() => girl.f.setExpr('happy'), 900); return; }
  work_.leverDown = true; sfx.clunk(); HINT.idle = 0;
  girl.kneelT = 0; girl.leanT = 0;
  girl.goTo(new THREE.Vector3(-0.22, 0, -0.56), () => { girl.face(truck.leverTip()); });
  girl.f.setExpr('wow'); setTimeout(() => work_.leverDown && girl.f.setExpr('joy'), 900);
  if (!work_.firstPour) { work_.firstPour = true; sfx.voice('wa', 1.5); }
  work_.side = null;
}
function leverStop(full) {
  if (!work_.leverDown) return;
  work_.leverDown = false; girl.reach('R', null); sfx.clunk();
  if (full) { girl.f.setExpr('happy'); sfx.chime(); }
}
function roughestSpot() {
  // find a lumpy / unlevel / unpolished area for the hint
  let best = null, bs = -1;
  for (let j = 0; j < 6; j++) for (let i = 0; i < 12; i++) {
    const x = (i + 0.5) / 12 * SLAB.W - SLAB.W / 2, z = (j + 0.5) / 6 * SLAB.D - SLAB.D / 2;
    const [gx, gz] = slab.toGrid(x, z); const k = Math.round(gz) * 192 + Math.round(gx);
    const s = slab.lump[k] * 2 + (1 - slab.smooth[k]) + Math.abs(slab.h[k] - 0.1) * 20;
    if (s > bs) { bs = s; best = new THREE.Vector3(x, 0.09, z); }
  }
  return best;
}

// ---------------------------------------------------------------- trowel & stamps
function trowelStart(p) {
  work_.press = { kind: 'trowel', p: p.clone(), last: p.clone(), on: false };
  const spot = girlWorkSpot(p); moveGirlTo(spot, () => { if (work_.press) work_.press.on = true; });
  girl.f.setExpr('focus');
}
function trowelStop() {
  if (!work_.press || work_.press.kind !== 'trowel') return;
  work_.press = null; girl.reach('R', null); setLoop('scrape', 0); pole.visible = false;
  if (G.state === 'pour' || G.state === 'stamp') { girl.f.setExpr('happy'); }
}
function selectTool(k) {
  sfx.pick();
  if (work_.tool !== 'hand' && tools[work_.tool]) { const o = tools[work_.tool]; fly(o, () => o.userData.home, 0.35, null, 0.12); o.rotation.set(0, 0, 0); glow(o, false); }
  work_.tool = k;
  if (k !== 'hand') { const o = tools[k]; glow(o, true); setTimeout(() => glow(o, false), 700); o.position.y += 0.05; girl.f.setExpr('happy'); sfx.voice(k === 'dino' ? 'oh' : 'wa', 1.55); }
}
// long wooden handle used when the tool is beyond the girl's reach (real finishers use handled floats / stamps)
const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 1, 10), new THREE.MeshStandardMaterial({ map: T.woodC, normalMap: T.woodN, roughness: 0.6, color: sRGB('#cfae86') }));
pole.castShadow = true; pole.visible = false; scene.add(pole);
function reachTool(toolTop) {
  // returns where the hand goes; shows a pole from hand to tool if too far
  const sh = girl.f.B.uaR.getWorldPosition(new THREE.Vector3());
  const d = toolTop.clone().sub(sh); const L = d.length(); const R0 = 0.36;
  if (L <= R0) { pole.visible = false; return toolTop; }
  const hand = sh.clone().addScaledVector(d.normalize(), R0);
  const ext = toolTop.clone().add(new THREE.Vector3(0, 0.02, 0));
  const mid = hand.clone().add(ext).multiplyScalar(0.5); const len = hand.distanceTo(ext) + 0.05;
  pole.visible = true; pole.position.copy(mid); pole.scale.set(1, len, 1);
  pole.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ext.clone().sub(hand).normalize());
  return hand;
}
function clampHandReach(p) {
  const c = new THREE.Vector3(girl.pos.x - 0.06, 0, girl.pos.z + 0.22); const d = p.clone().setY(0).sub(c); const L = d.length();
  if (L > 0.3) { const q = c.addScaledVector(d.normalize(), 0.3); p.x = q.x; p.z = Math.max(-SLAB.D / 2 + 0.05, q.z); }
  return p;
}
const STAMP = { hand: { kind: 'hand', depth: 0.012 }, boot: { kind: 'boot', depth: 0.016 }, leaf: { kind: 'leaf', depth: 0.005 }, dino: { kind: 'dino', depth: 0.02 } };
function stampStart(p) {
  const S = STAMP[work_.tool]; if (!S) return;
  const spot = girlWorkSpot(p);
  work_.press = { kind: 'stamp', tool: work_.tool, p: p.clone(), P: null, on: false, t: 0 };
  moveGirlTo(spot, () => {
    const pr = work_.press; if (!pr || pr.kind !== 'stamp') return;
    if (pr.tool === 'hand') clampHandReach(pr.p);
    const rot = (work_.side === 'back' ? 0 : Math.PI) + (Math.random() - 0.5) * 0.35;
    pr.P = slab.pressStart(S.kind, pr.p.x, pr.p.z, rot, S.depth * (0.85 + Math.random() * 0.3)); pr.on = true; pr.rot = rot;
    sfx.squish(0.8);
  });
  girl.f.setExpr('focus');
}
function stampStop() {
  const pr = work_.press; if (!pr || pr.kind !== 'stamp') return;
  work_.press = null; girl.reach('R', null); pole.visible = false;
  if (pr.P && pr.P.depth > 0.002) {
    work_.prints++; work_.kinds.add(pr.tool); if (G.fixed) work_.printsAfterFix = (work_.printsAfterFix || 0) + 1;
    work_.printList.push({ x: pr.p.x, z: pr.p.z, kind: pr.tool, rot: pr.rot });
    sfx.plop(); girl.f.setExpr('joy'); sfx.voice(['wa', 'hehe', 'yay'][work_.prints % 3], 1.5);
    setTimeout(() => girl.f.setExpr('happy'), 900);
  }
  if (pr.tool && tools[pr.tool]) { const o = tools[pr.tool]; fly(o, () => o.userData.home.clone().add(new THREE.Vector3(0, 0.05, 0)), 0.3, null, 0.08); o.rotation.set(0, 0, 0); }
}
work_.printList = [];

function updateWork(dt, t) {
  const pr = work_.press;
  if (!girl) return;
  // girl lateral shuffle while kneeling
  if (girl.shuffle && !girl.path) { girl.pos.x = damp(girl.pos.x, girl.shuffle.x, 4, dt); girl.pos.z = damp(girl.pos.z, girl.shuffle.z, 4, dt); }
  if (!pr) { if (!work_.leverDown && (G.state === 'pour' || G.state === 'stamp') && !G.papaGagLook) { girl.leanT = 0.1; girl.look = (Math.floor(t / 3.5) % 2) ? camera.position : slab.mesh.position.clone().add(new THREE.Vector3(0.1, 0.1, 0.1)); } return; }
  const p = slabPoint(input.x, input.y, 0.25) || pr.p;
  if (pr.kind === 'trowel') {
    const o = tools.trowel; o.visible = true;
    if (!pr.on) { toolPose(o, p, 'trowel', 0, t); pr.last.copy(p); return; }
    // re-home girl if finger wandered far
    const spot = girlWorkSpot(p); if (spot.side !== work_.side || Math.abs(spot.pos.x - girl.pos.x) > 0.3) { girl.shuffle = new THREE.Vector3(spot.pos.x, 0, girl.pos.z); if (spot.side !== work_.side) { pr.on = false; moveGirlTo(spot, () => { if (work_.press) work_.press.on = true; }); } }
    const dx = p.x - pr.last.x, dz = p.z - pr.last.z;
    const eff = slab.trowel(p.x, p.z, dx, dz);
    pr.last.copy(p);
    toolPose(o, p, 'trowel', 0, t);
    o.userData.film.material.opacity = 0.7;
    const sp = Math.hypot(dx, dz) / Math.max(dt, 1e-3);
    setLoop('scrape', Math.min(0.35, sp * 0.4) * (eff > 0 ? 1 : 0.4), 1800 + 3000 * (G.stats ? G.stats.polish : 0));
    girl.reach('R', reachTool(o.position.clone().add(new THREE.Vector3(0, 0.06, 0))), 1);
    girl.leanT = 0.75; girl.look = o.position;
    work_.effAcc = (work_.effAcc || 0) + eff;
    if (work_.effAcc > 25) { work_.effAcc = 0; girl.f.setExpr(Math.random() < 0.5 ? 'happy' : 'focus'); }
  } else if (pr.kind === 'stamp') {
    const o = tools[pr.tool];
    if (pr.on && pr.P) {
      const dd = slab.pressUpdate(pr.P, dt, 1);
      // dragging while pressed smears: start a new press along the path
      const mv = Math.hypot(p.x - pr.P.x, p.z - pr.P.z);
      if (pr.tool === 'hand') clampHandReach(p);
      if (mv > 0.035) { const d = pr.P.depth; pr.P = slab.pressStart(pr.P.kind, p.x, p.z, pr.rot, pr.P.maxDepth); pr.P.t = 0.5; pr.p.copy(p); }
      if (dd > 0.0004) sfx.squish(0.25);
    }
    const at = pr.P ? new THREE.Vector3(pr.P.x, 0, pr.P.z) : p;
    if (o) { toolPose(o, at, pr.tool, pr.P ? pr.P.depth : -0.02, t); o.rotation.y = pr.rot ?? o.rotation.y; girl.reach('R', reachTool(o.position.clone().add(new THREE.Vector3(0, pr.tool === 'leaf' ? 0.015 : 0.09, 0))), 1); }
    else { pole.visible = false; const y = slab.heightAt(at.x, at.z); girl.reach('R', new THREE.Vector3(at.x, y + 0.03 - (pr.P ? pr.P.depth : 0), at.z - (work_.side === 'back' ? 0.04 : -0.04)), 1); }
    girl.leanT = 0.75; girl.look = at.clone().setY(0.1);
  }
}

// ---------------------------------------------------------------- papa gag
function startPapaGag() {
  G.papaStarted = true; G.papaGag = true; HINT.target = null;
  setShot('papa', 0.9);
  G.baseEnergy = slab.impEnergy(-SLAB.W / 2, SLAB.W / 2);
  const plank = new THREE.Mesh(new (Object.getPrototypeOf(tray.children[0].geometry).constructor === THREE.BufferGeometry ? THREE.BoxGeometry : THREE.BoxGeometry)(2.2, 0.04, 0.2), tray.children[0].material);
  plank.castShadow = true; papa.f.B.handR.add(plank); plank.position.set(0.1, -0.05, 0); plank.rotation.set(0, 0.3, 0.1); papa.plank = plank;
  papa.carry = true; papa.strideK = 0.27; papa.pos.set(2.6, 0, 0.12); papa.yaw = papa.yawT = -Math.PI / 2;
  papa.look = new THREE.Vector3(4, 1.6, 1.5); papa.f.setExpr('happy');
  sfx.voice('umm', 0.6);
  const steps = []; papa.onStep = (side) => {
    const fp = papa.footWorld(side ? 'L' : 'R');
    if (slab.inside(fp.x, fp.z, 0.04)) {
      const P = slab.pressStart('bigboot', fp.x, fp.z + (side ? 0.02 : -0.02), -Math.PI / 2, 0.019);
      P.live = 0.6; steps.push(P); sfx.squish(1.0);
      if (steps.length === 1) { girl.f.setExpr('wow'); sfx.voice('oh', 1.5); girl.look = papa.f.B.head.getWorldPosition(new THREE.Vector3()); }
    }
  };
  G.papaSteps = steps;
  papa.goTo(new THREE.Vector3(0.05, 0, 0.12), () => {
    // stops mid-slab: feels squish, looks down, oops
    papa.f.setExpr('wow'); papa.look = new THREE.Vector3(0, 0, 0.12); sfx.voice('oh', 0.55);
    setTimeout(() => { papa.f.setExpr('oops'); papa.carry = false; papa.plank.visible = false; papa.doGesture('scratch', 2.0); girl.f.setExpr('puzzled'); sfx.voice('are', 1.45); }, 900);
    setTimeout(() => { papa.tiptoe = 1; papa.speedT = 0.55; papa.strideK = 0.2; papa.goTo(new THREE.Vector3(-1.5, 0, 0.3), () => { papa.tiptoe = 0; papa.speedT = null; papa.onStep = null; papa.strideK = null; G.papaDone = true; G.papaEnergy = slab.impEnergy(-SLAB.W / 2, SLAB.W / 2) - G.baseEnergy; papa.yawT = 0.6; papa.f.setExpr('oops'); setShot('work', 0.9); girl.f.setExpr('focus'); }); }, 2600);
  }, 1.0);
}
function deepestPapaPrint() {
  let best = null, bd = 0;
  for (const P of G.papaSteps || []) { const [fx, fz] = slab.toFine(P.x, P.z); const v = -slab.imp[Math.round(fz) * 1024 + Math.round(fx)]; if (v > bd) { bd = v; best = new THREE.Vector3(P.x, 0.09, P.z); } }
  return bd > 0.003 ? best : null;
}

// ---------------------------------------------------------------- forms off & final play
function removeForms() {
  sfx.whoosh();
  W.forms.children.forEach((b, i) => { b.userData.fly = { t: -i * 0.15, v: new THREE.Vector3((Math.random() - 0.5) * 0.4, 1.2 + Math.random() * 0.4, (b.position.z > 0 ? 1 : -1) * 0.6) }; });
  W.formsFlying = true;
  // back-fill strip: old panels already sit flush; fill gap at form positions with soil darkening (nothing to do visually)
}
function updateForms(dt) {
  if (!W.formsFlying) return;
  for (const b of W.forms.children) {
    const F = b.userData.fly; F.t += dt; if (F.t < 0) continue;
    F.v.y -= 3.5 * dt; b.position.addScaledVector(F.v, dt); b.rotation.x += dt * 1.5;
    if (b.position.y < -1) b.visible = false;
  }
}
function playTap(x, y) {
  // tap a print → the matching friend comes to it
  const p = slabPoint(x, y, 0.1);
  if (p) {
    let near = null, nd = 0.12;
    for (const q of work_.printList) { const d = Math.hypot(q.x - p.x, q.z - p.z); if (d < nd) { nd = d; near = q; } }
    if (near) { matchPrint(near); return; }
    girl.f.setExpr('happy'); sfx.voice('hehe', 1.5);
    if (dog) { dog.sitT = 0; dog.goTo(new THREE.Vector3(p.x, 0, p.z + 0.1), () => { dog.sitT = 1; dog.bark = 1; sfx.ruff(); }); }
    return;
  }
  for (const [name, a] of [['girl', girl], ['papa', papa], ['mama', mama]]) {
    if (a && hitObj(x, y, a.f.B.chest, 0.35)) { a.doGesture(name === 'girl' ? 'cheer' : 'wave', 1.4); a.f.setExpr('joy'); sfx.voice(name === 'girl' ? 'yay' : 'wa', name === 'girl' ? 1.5 : name === 'papa' ? 0.6 : 1.1); setTimeout(() => a.f.setExpr('happy'), 1200); return; }
  }
  if (dog && hitObj(x, y, dog.f.B.head, 0.35)) { dog.bark = 1; sfx.ruff(); dog.wag = 2; return; }
  // elsewhere on the walk: dog trots there
  const r = pick(x, y); const g = new THREE.Vector3(); r.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.09), g);
  if (dog && g && Math.abs(g.z) < 1.2 && Math.abs(g.x) < 4) { dog.sitT = 0; dog.goTo(g, () => { dog.sitT = 1; }); }
}
function matchPrint(q) {
  const tgt = new THREE.Vector3(q.x, 0, q.z);
  if (q.kind === 'hand') {
    girl.busy = true; girl.goTo(new THREE.Vector3(q.x + 0.05, 0, q.z - 0.3), () => {
      girl.yawT = 0; girl.kneelT = 1; girl.leanT = 0.6; girl.reach('R', new THREE.Vector3(q.x, 0.1, q.z), 1); girl.look = tgt;
      setTimeout(() => { sfx.chime(); girl.f.setExpr('joy'); sfx.voice('yay', 1.5); }, 700);
      setTimeout(() => { girl.reach('R', null); girl.kneelT = 0; girl.leanT = 0; girl.busy = false; }, 2200);
    });
  } else if (q.kind === 'boot') {
    girl.busy = true; girl.goTo(new THREE.Vector3(q.x, 0, q.z + 0.02), () => { girl.yawT = q.rot ?? 0; girl.f.setExpr('joy'); sfx.boots(); sfx.chime(); girl.doGesture('cheer', 1.2); setTimeout(() => girl.busy = false, 1200); });
  } else if (q.kind === 'dino') {
    if (dog) { dog.sitT = 0; dog.goTo(new THREE.Vector3(q.x, 0, q.z + 0.28), () => { dog.yawT = Math.PI; dog.sniffT = 1; setTimeout(() => { dog.sniffT = 0; dog.bark = 1; sfx.ruff(); }, 1300); setTimeout(() => { dog.sitT = 1; }, 1800); }); }
    girl.f.setExpr('wow'); sfx.voice('oh', 1.5);
  } else if (q.kind === 'leaf') {
    const lf = buildLeaf(); lf.position.set(q.x + 0.4, 2.6, q.z - 0.3); scene.add(lf);
    falling.push({ o: lf, to: new THREE.Vector3(q.x, 0.093, q.z), t: 0, rot: 0.6 });
    girl.f.setExpr('wow'); setTimeout(() => girl.f.setExpr('joy'), 2600);
  }
}
const falling = [];
function updateFalling(dt) {
  for (const F of falling) {
    if (F.done) continue; F.t += dt; const k = clamp01(F.t / 3.2);
    const p = F.o.position; p.y = lerp(2.6, F.to.y, smooth(k)); p.x = lerp(F.to.x + 0.4, F.to.x, k) + Math.sin(F.t * 3.1) * 0.18 * (1 - k); p.z = F.to.z + Math.cos(F.t * 2.3) * 0.1 * (1 - k);
    F.o.rotation.set(Math.sin(F.t * 4) * 0.6 * (1 - k), F.rot + F.t * 0.6 * (1 - k), Math.cos(F.t * 3) * 0.5 * (1 - k));
    if (k >= 1) { F.done = true; sfx.chime(); }
  }
}

// ---------------------------------------------------------------- planar reflection for the wet / polished slab
const REFL = { rt: null, cam: new THREE.PerspectiveCamera(), plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -SLAB.top) };
function renderReflection() {
  const sc = 0.42, w = Math.max(64, Math.round(R.rt.width * sc)), h = Math.max(64, Math.round(R.rt.height * sc));
  if (!REFL.rt || REFL.rt.width !== w || REFL.rt.height !== h) { REFL.rt && REFL.rt.dispose(); REFL.rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType }); }
  const c = REFL.cam; const y = SLAB.top;
  c.fov = camera.fov; c.aspect = camera.aspect; c.near = camera.near; c.far = camera.far;
  c.position.copy(camera.position); c.position.y = 2 * y - c.position.y;
  const tg = cam.tgt.clone(); tg.y = 2 * y - tg.y;
  c.up.set(0, -1, 0); c.lookAt(tg); c.up.set(0, 1, 0);
  // Reflector-style: virtual camera with flipped up; slab samples it projectively
  const fwd = new THREE.Vector3(); camera.getWorldDirection(fwd); fwd.y *= -1;
  c.lookAt(c.position.clone().add(fwd)); 
  const upv = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion); upv.y *= -1; c.up.copy(upv); c.lookAt(c.position.clone().add(fwd));
  c.updateMatrixWorld(); c.updateProjectionMatrix();
  slab.U.uTexMat.value.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(c.projectionMatrix).multiply(c.matrixWorldInverse);
  slab.mesh.visible = false; pourFX.mesh.visible = pourFX.mesh.visible;
  const r = renderer; const oldClip = r.clippingPlanes;
  REFL.plane.set(new THREE.Vector3(0, 1, 0), -y + 0.002); r.clippingPlanes = [REFL.plane];
  const sm = r.shadowMap.autoUpdate; r.shadowMap.autoUpdate = false;
  r.setRenderTarget(REFL.rt); r.render(scene, c); r.setRenderTarget(null);
  r.shadowMap.autoUpdate = sm; r.clippingPlanes = oldClip || [];
  slab.mesh.visible = true;
  slab.U.tRefl.value = REFL.rt.texture; slab.U.uRes.value.set(R.rt.width, R.rt.height); slab.U.uReflOn.value = 1;
}

// ---------------------------------------------------------------- loop
let last = performance.now(), fpsAcc = 0, fpsN = 0, frames = 0;
const SUB = +(Q.get('sub') || 1);
function loop() {
  const now = performance.now(); let dt0 = Math.min(0.05, (now - last) / 1000); last = now;
  if (DEV && window.__fixedDt) dt0 = window.__fixedDt;
  if (Q.has('sub')) dt0 = 1 / 30;
  frames++;
  for (let sub = 0; sub < SUB; sub++) step(dt0, sub === SUB - 1);
  const t = G.t;
  updateCamera(dt0, t); updateHint(dt0); updateGlow(t);
  camera.updateMatrixWorld();
  if (G.state !== 'dress' && G.state !== 'load' && G.state !== 'walk' && TOD.t < 0.9) renderReflection(); else slab.U.uReflOn.value = 0;
  render(scene, camera, t);
  afterFrame(dt0);
}
function step(dt, lastSub) {
  G.t += dt; G.st += dt;
  const t = G.t;
  if (G.state !== 'load') STATES[G.state].update && STATES[G.state].update(dt, t);
  updateWork(dt, t);
  // lever + pour
  if (girl) {
    const leverTarget = work_.leverDown ? -0.55 : 0.25;
    truck.lever.rotation.z = damp(truck.lever.rotation.z, leverTarget, 10, dt);
    const flowOn = work_.leverDown && girl.pos.distanceTo(new THREE.Vector3(-0.22, 0, -0.56)) < 0.2;
    work_.flow = damp(work_.flow, flowOn ? 1 : 0, flowOn ? 2.5 : 4, dt);
    truck.drum.rotation.x += dt * (0.35 + work_.flow * 1.6);
    work_.pourT += dt * work_.flow;
    work_.stow = damp(work_.stow ?? 0, (G.state === 'pour' && (G.stats ? G.stats.fill < 0.95 : true)) || work_.flow > 0.05 ? 0 : 1, 1.5, dt);
    truck.chutePivot.rotation.y = lerp(0.2 + (Math.sin(work_.pourT * 0.55) * 0.5 + 0.5) * 0.55, -1.25, work_.stow);
    truck.chuteFilmMat.opacity = Math.min(1, truck.chuteFilmMat.opacity + work_.flow * dt * 2);
    const lip = truck.chuteEnd(), dir = truck.chuteDir();
    pourFX.update(dt, t, lip, dir, Math.max(0.0, slab.heightAt(lip.x, lip.z)), work_.flow);
    if (work_.flow > 0.05 && pourFX.impact) { const ip = pourFX.impact; if (slab.inside(ip.x, ip.z)) slab.pour(ip.x, ip.z, 0.0115 * work_.flow * dt); }
    setLoop('pour', work_.flow * 0.5, 300 + 200 * Math.sin(t * 7)); setLoop('drum', 0.12 + work_.flow * 0.25);
  }
  for (const P of G.papaSteps || []) if (P.live > 0) { P.live -= dt; slab.pressUpdate(P, dt, 1.6); }
  slab.flow(dt);
  if (lastSub) slab.upload();
  for (const a of Object.values(actors)) a && a.update(dt);
  updateFlights(dt); updateForms(dt); updateFalling(dt);
  if (girl) { const hp = girl.f.B.head.getWorldPosition(new THREE.Vector3()); faceFill.position.copy(hp).add(new THREE.Vector3(0.3, 0.25, 0.6)); faceFill.intensity = 0.6 * (1 - TOD.t); }
}
function afterFrame(dt) {
  // adaptive resolution (keep ≥30fps on phones)
  fpsAcc += dt; fpsN++;
  if (fpsAcc > 2) { const fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; if (!DEV) { if (fps < 32 && R.scale > 0.55) { R.scale -= 0.1; resize(camera); } else if (fps > 55 && R.scale < (R.dpr >= 2 ? 0.8 : 1)) { R.scale += 0.05; resize(camera); } } }
  if (DEV && frames === +(Q.get('frames') || 30)) window.DONE = true;
  requestAnimationFrame(loop);
}
if (DEV) window.__fixedDt = 1 / 30;

await ready;
document.getElementById('load').classList.add('gone');
if (DEV && Q.get('state')) await devJump(Q.get('state'));
else go('dress');
requestAnimationFrame(loop);
window.G = G; window.slab = slab; window.go = go; window.work_ = work_;
window.__T = { helmet, bootPair, truck, tools, sunSprite, camera, girl: () => girl, papa: () => papa,
  proj(v) { const p = (v.isVector3 ? v.clone() : v.getWorldPosition(new THREE.Vector3())).project(camera); return [(p.x * 0.5 + 0.5) * R.w, (-p.y * 0.5 + 0.5) * R.h]; },
  projXYZ(x, y, z) { return this.proj(new THREE.Vector3(x, y, z)); }, errors: [] };
window.addEventListener('error', e => window.__T.errors.push(String(e.message)));

// ---------------------------------------------------------------- dev: jump to a state with plausible content (for screenshots)
async function devJump(s) {
  await later;
  const fillSlab = (lumpy) => { for (let i = 0; i < slab.h.length; i++) { slab.h[i] = 0.1 + (lumpy ? (slab.noise[i] - 0.5) * 0.02 : 0); slab.lump[i] = lumpy ? 1 : 0; slab.smooth[i] = lumpy ? 0 : 1; slab.wet[i] = 0.8; } slab.dirtyH = slab.dirtyS = true; };
  helmet.position.set(0, 0, 0); attachHelmet(girl, helmet, 1); bootPair.visible = false; setBoots(true);
  G.dressed = { helmet: true, boots: true }; G.dressDone = true;
  if (s === 'dress') { helmet.parent.remove(helmet); scene.add(helmet); helmet.position.set(0.95, 0.315, -0.66); bootPair.visible = true; setBoots(false); G.dressDone = false; go('dress'); return; }
  if (s === 'pour') { go('pour'); return; }
  if (s === 'pouring') {
    go('pour'); girl.pos.set(-0.22, 0, -0.56); work_.leverDown = true; girl.face(truck.leverTip());
    for (let i = 0; i < 40; i++) { const x = -0.5 + (i % 8) * 0.08, z = -0.2 + Math.floor(i / 8) * 0.08; slab.pour(x, z, 0.0015); }
    for (let i = 0; i < 30; i++) slab.flow(0.05); return;
  }
  if (s === 'rough') { fillSlab(true); go('pour'); work_.cam = 'work'; setShot('work'); girl.pos.set(0.1, 0, -0.5); girl.kneelT = 1; work_.side = 'back'; return; }
  if (s === 'half') {
    fillSlab(true); go('pour'); work_.cam = 'work'; setShot('work'); girl.pos.set(0.1, 0, -0.5); girl.kneelT = 1; work_.side = 'back';
    for (let pass = 0; pass < 4; pass++) for (let z = -0.3; z <= 0.3; z += 0.05) for (let x = -0.65; x < 0.0; x += 0.02) slab.trowel(x, z, 0.02, 0);
    return;
  }
  if (s === 'stamp' || s === 'prints' || s === 'papa' || s === 'dry' || s === 'walk') {
    fillSlab(false); G.pourDone = true; go('stamp');
    const add = (k, x, z, r, d) => { const P = slab.pressStart(k, x, z, r, d); slab.pressUpdate(P, 3); work_.printList.push({ x, z, kind: k === 'hand' ? 'hand' : k, rot: r }); work_.kinds.add(k); };
    if (s !== 'stamp') { add('hand', -0.35, -0.08, 0.1, 0.012); add('hand', -0.22, -0.12, -0.1, 0.012); add('dino', 0.15, 0.05, 0.2, 0.02); add('dino', 0.35, -0.1, 0.1, 0.02); add('leaf', -0.5, 0.15, 0.6, 0.005); add('boot', 0.5, 0.15, 0, 0.016); add('boot', 0.58, 0.02, 0.1, 0.016); }
    girl.pos.set(0.1, 0, -0.5); girl.kneelT = 1; work_.side = 'back'; work_.prints = 7;
    if (s === 'papa') { G.st = 20; }
    if (s === 'dry' || s === 'walk') { G.papaStarted = true; G.papaDone = true; G.fixed = true; go(s === 'dry' ? 'dry' : 'walk'); if (s === 'walk') { setTimeOfDay(1); slab.dryStep(1, 10); W.forms.visible = false; } }
  }
}
