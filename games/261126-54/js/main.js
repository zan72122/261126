// けーきやさんの しあげ — main game
import * as THREE from 'three';
import { clamp, lerp, damp, rnd, sstep, easeInOut, easeOut, startTextureLoading, setAniso } from './util.js';
import { buildEnvironment, buildLights } from './env.js';
import { Post } from './post.js';
import { buildShop, makeTurntable, makeKnife, makeBowl, makeJug, makeSieve, makePipingBag, makeBerryBowl, makeBell, makeTowel, WORK, COUNTER_Y, CZ, CASE_X } from './shop.js';
import { Cake, makeStrawberry, HS, R as CAKE_R } from './cake.js';
import { Human } from './human.js';
import { Particles, makeHalo, makeHintHand, makeBubble, makeStream } from './fx.js';
import { audioUnlock, sfx, setLoop, voices } from './audio.js';

const Q = new URLSearchParams(location.search);
const DEBUG = Q.has('debug');

// ================================================================ renderer
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: Q.has('shot') });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.info.autoReset = true;
setAniso(Math.min(8, renderer.capabilities.getMaxAnisotropy()));
const isTouch = navigator.maxTouchPoints > 0;
let PR = Math.min(window.devicePixelRatio || 1, isTouch ? 1.6 : 1.5);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a1c14);
scene.environment = buildEnvironment(renderer);
scene.environmentIntensity = 0.75;
const lights = buildLights(scene);
const shop = buildShop(scene);
const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 30);
const post = new Post(renderer);

// ================================================================ props
const turntable = makeTurntable(); turntable.position.copy(WORK); scene.add(turntable);
const plate = turntable.userData.plate;
const PLATE_TOP = 0.016;

let cake = new Cake();
cake.group.position.y = PLATE_TOP;
plate.add(cake.group);

const knife = makeKnife(); scene.add(knife); knife.visible = false;
const bowl = makeBowl('cream'); scene.add(bowl);
const jug = makeJug(); scene.add(jug);
const sieve = makeSieve(); scene.add(sieve);
const berryBowl = makeBerryBowl(makeStrawberry); scene.add(berryBowl);
const bag = makePipingBag(); scene.add(bag); bag.visible = false;
const bell = makeBell(); scene.add(bell);
const towel = makeTowel(); scene.add(towel); towel.visible = false;
const stream = makeStream(); scene.add(stream);
const flyBerry = makeStrawberry(); scene.add(flyBerry); flyBerry.visible = false;
const sugarFx = new Particles(scene, 1400, 'sugar');
const splatFx = new Particles(scene, 300, 'drop');
const sparkFx = new Particles(scene, 300, 'spark');
const hint = makeHintHand(); scene.add(hint);

const tools = { bowl, jug, sieve, berries: berryBowl, bag, bell };
for (const k in tools) {
  const h = makeHalo(k === 'bell' ? 0.2 : 0.34); scene.add(h); tools[k].userData.halo = h; tools[k].userData.key = k;
  tools[k].traverse(o => { o.userData.tool = k; });
}
knife.traverse(o => { o.userData.noRay = true; });

// ================================================================ characters
const girl = new Human({ kid: true, H: 1.10, skin: '#f2c9ac', hair: '#3b2419', browCol: '#3b2419', hairStyle: 'pigtails', lip: '#d98282', iris: '#5b3a22',
  top: { color: '#d8c7b2', tex: 'knit', rep: 12, long: true }, bottom: { type: 'skirt', color: '#7a3a2c', tex: 'cotton', len: 0.2 }, legs: '#5a4640', shoes: '#6a2a22', chubby: 0.002 });
const papa = new Human({ H: 1.76, skin: '#e9b995', hair: '#2a1b12', hairStyle: 'short', stubble: true, iris: '#3e2a1a', lip: '#b86e62',
  top: { color: '#f3f0ea', tex: 'cotton', rep: 10, long: true }, bottom: { type: 'pants', color: '#3a2c24', tex: 'cotton' }, shoes: '#2a1a12' });
const mama = new Human({ H: 1.62, female: true, skin: '#f0c6a6', hair: '#4a2c1c', hairStyle: 'bob', lip: '#c46a6a', iris: '#4a3020',
  top: { color: '#e3d2bc', tex: 'knit', rep: 10, long: true }, bottom: { type: 'skirt', color: '#6a4636', tex: 'cotton', len: 0.55 }, shoes: '#4a2a1a' });
const CUSTOMERS = [
  { opt: { H: 1.52, female: true, skin: '#ecc2a2', hair: '#c9c2ba', browCol: '#8a8078', hairStyle: 'bun', glasses: true, lip: '#b8706a', iris: '#4a3a2a', top: { color: '#8f7f86', tex: 'knit', rep: 10, long: true }, bottom: { type: 'skirt', color: '#4a3c36', tex: 'cotton', len: 0.5 }, shoes: '#3a2a20' }, pitch: 260 },
  { opt: { kid: true, H: 1.22, skin: '#eebf9c', hair: '#2a1a10', hairStyle: 'kidshort', lip: '#c87a70', iris: '#3a2616', top: { color: '#3f4a5c', tex: 'knit', rep: 12, long: true }, bottom: { type: 'pants', color: '#5a4a3a', tex: 'cotton' }, shoes: '#8a2a22', chubby: 0.001, w: 1.05 }, pitch: 300 },
  { opt: { H: 1.72, skin: '#e2b08c', hair: '#3a2a20', hairStyle: 'balding', moustache: true, lip: '#a86a5a', iris: '#3a2a1a', top: { color: '#6b6a4a', tex: 'knit', rep: 10, long: true }, bottom: { type: 'pants', color: '#3a3430', tex: 'cotton' }, shoes: '#2a1a12', w: 1.08 }, pitch: 130 },
];
const customers = [];

// hat & apron on the hooks
let hat = null, apron = null;

// ================================================================ camera shots
const shots = {};
let shot = null, shotBlend = 1;
const cam = { pos: new THREE.Vector3(), tgt: new THREE.Vector3(), from: new THREE.Vector3(), fromT: new THREE.Vector3(), focus: 1 };
function isPortrait() { return innerHeight > innerWidth * 1.1; }
function fitShot(def) {
  const aspect = innerWidth / innerHeight;
  // ~40mm-equivalent: diagonal field of view 56 degrees
  const diag = 56 * Math.PI / 180;
  const vfov = 2 * Math.atan(Math.tan(diag / 2) / Math.sqrt(1 + aspect * aspect));
  const dir = def.dir.clone().normalize();
  const c = new THREE.PerspectiveCamera(vfov * 180 / Math.PI, aspect, 0.05, 30);
  const pts = def.pts();
  const ok = (d) => {
    c.position.copy(def.tgt).addScaledVector(dir, d); c.lookAt(def.tgt); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const m = def.margin ?? 0.9;
    for (const p of pts) { const v = p.clone().project(c); if (Math.abs(v.x) > m || Math.abs(v.y) > m || v.z > 1) return false; }
    return true;
  };
  const tgt = def.tgt.clone();
  let hi = 8;
  for (let it = 0; it < 3; it++) {
    const okAt = (d) => {
      c.position.copy(tgt).addScaledVector(dir, d); c.lookAt(tgt); c.updateMatrixWorld(); c.updateProjectionMatrix();
      const m = def.margin ?? 0.9;
      for (const p of pts) { const v = p.clone().project(c); if (Math.abs(v.x) > m || Math.abs(v.y) > m || v.z > 1) return false; }
      return true;
    };
    let lo = def.minD ?? 0.3; hi = 8;
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (okAt(mid)) hi = mid; else lo = mid; }
    okAt(hi);
    // re-centre the framing on the points' bounds
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const p of pts) { const v = p.clone().project(c); x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 + (def.lift || 0);
    const right = new THREE.Vector3().setFromMatrixColumn(c.matrixWorld, 0), upv = new THREE.Vector3().setFromMatrixColumn(c.matrixWorld, 1);
    const th = Math.tan(vfov / 2) * hi;
    tgt.addScaledVector(right, cx * th * aspect).addScaledVector(upv, cy * th);
  }
  const pos = tgt.clone().addScaledVector(dir, hi);
  return { pos, tgt, fov: vfov * 180 / Math.PI, focus: def.focus ? def.focus(pos) : hi };
}
function setShot(name, instant = false) {
  shot = name;
  const f = fitShot(shots[name]);
  shots[name].fit = f;
  if (instant) { cam.pos.copy(f.pos); cam.tgt.copy(f.tgt); shotBlend = 1; }
  else { cam.from.copy(cam.pos); cam.fromT.copy(cam.tgt); shotBlend = 0; }
  camera.fov = f.fov; camera.updateProjectionMatrix();
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const CUST_AT = V(2.42, 0, 0.3);
function custSpot() { return isPortrait() ? V(2.0, 0, 0.42) : V(2.42, 0, 0.3); }
const GIRL_WORK = V(0.06, 0.2, -0.76), GIRL_SHOP = V(1.6, 0.2, -0.76), GIRL_DRESS = V(-1.22, 0, -1.9);
shots.dress = {
  tgt: V(-1.45, 0.86, -2.0), dir: V(-0.08, 0.12, 1),
  pts: () => [V(-1.22, 1.2, -1.9), V(-1.22, 0.0, -1.9), V(-2.05, 1.42, -2.42), V(-1.5, 0.75, -2.42), V(-1.0, 0.8, -1.9)],
  focus: (p) => p.distanceTo(V(-1.22, 1.0, -1.9)), margin: 0.85,
};
shots.work = {
  tgt: V(WORK.x, COUNTER_Y + 0.17, WORK.z + 0.02), dir: V(0.06, 0.48, 1),
  pts: () => {
    const p = [V(WORK.x - 0.13, COUNTER_Y + 0.12, WORK.z), V(WORK.x + 0.13, COUNTER_Y + 0.12, WORK.z), V(WORK.x, COUNTER_Y + 0.07, WORK.z + 0.12),
      V(GIRL_WORK.x, GIRL_WORK.y + 1.12, GIRL_WORK.z + 0.05)];
    for (const k of ['bowl', 'jug', 'sieve', 'berries', 'bell']) { const t = tools[k]; if (t.visible && t.userData.home) p.push(t.userData.home.clone().add(V(0, 0.05, 0))); }
    return p;
  },
  focus: (p) => p.distanceTo(V(WORK.x, COUNTER_Y + 0.12, WORK.z)), margin: 0.88,
};
shots.thumb = {
  tgt: V(WORK.x, COUNTER_Y + 0.15, WORK.z), dir: V(0.12, 0.42, 1),
  pts: () => [V(WORK.x - 0.12, COUNTER_Y + 0.1, WORK.z), V(WORK.x + 0.12, COUNTER_Y + 0.1, WORK.z), V(WORK.x, COUNTER_Y + 0.06, WORK.z + 0.14), V(GIRL_WORK.x, GIRL_WORK.y + 1.02, GIRL_WORK.z + 0.05)],
  focus: (p) => p.distanceTo(V(WORK.x, COUNTER_Y + 0.12, WORK.z)), margin: 0.92,
};
shots.papa = {
  tgt: V(0.3, 1.2, -0.55), dir: V(0.05, 0.12, 1),
  pts: () => [V(0.55, 1.78, -0.75), V(0.06, 1.25, -0.76), V(0.0, 1.0, -0.42), V(0.62, 1.0, -0.75)],
  focus: (p) => p.distanceTo(V(0.5, 1.55, -0.75)), margin: 0.8,
};
shots.shop = {
  tgt: V(1.72, 1.2, -0.1), dir: V(-0.22, 0.1, 1),
  pts: () => [V(1.05, 0.93, CZ + 0.25), V(2.18, 0.93, CZ + 0.25), V(1.6, 1.32, CZ), V(GIRL_SHOP.x, GIRL_SHOP.y + 1.14, GIRL_SHOP.z), V(custSpot().x, 1.5, custSpot().z), V(custSpot().x + 0.3, 1.98, custSpot().z), V(custSpot().x - 0.05, 1.95, custSpot().z)],
  focus: (p) => p.distanceTo(V(1.6, 1.05, CZ)), margin: 0.9,
};

// ================================================================ tool layout (portrait: a front row, landscape: both sides)
function layoutTools() {
  const P = isPortrait();
  const W = WORK;
  const spots = P ? {
    bowl: V(-0.17, 0, 0.2), jug: V(0.17, 0, 0.2), sieve: V(-0.2, 0, 0.18), berries: V(0.0, 0, 0.26), bag: V(0.2, 0, 0.2), bell: V(0.26, 0, 0.02),
  } : {
    bowl: V(-0.33, 0, 0.06), jug: V(0.32, 0, 0.04), sieve: V(-0.34, 0, 0.0), berries: V(-0.27, 0, 0.24), bag: V(0.3, 0, 0.24), bell: V(0.42, 0, -0.14),
  };
  if (phase === 'deco' || phase === 'shopwork') {
    if (P) { spots.sieve = V(-0.21, 0, 0.17); spots.berries = V(-0.06, 0, 0.27); spots.jug = V(0.1, 0, 0.27); spots.bag = V(0.23, 0, 0.17); }
  }
  for (const k in spots) {
    const t = tools[k];
    const h = V(W.x + spots[k].x, COUNTER_Y, W.z + spots[k].z);
    t.userData.home = h;
    if (!t.userData.busy) t.position.copy(h);
  }
  bag.userData.home.y = COUNTER_Y + 0.045;
}

// ================================================================ game state
let phase = 'loading';
let tool = null;          // current tool in the girl's hand
let idleT = 0;            // time since last touch
let phaseT = 0;
let fade = 1, fadeTarget = 0;
const queue = [];          // timed script steps
function after(t, f) { queue.push({ t: time + t, f }); }
let time = 0;
const state = {
  dressed: { hat: false, apron: false },
  firstScoop: true, creamDone: false,
  gag: 'none', bagGiven: false, bellReady: false,
  shopCakes: [], shopSel: -1, cust: null, custIdx: 0, request: null, bubble: null, bubble2: null,
};

function show(obj, v) { obj.visible = v; if (obj.userData.halo) obj.userData.halo.visible = v; }

// ================================================================ boot
const loaderEl = document.getElementById('ld');
async function boot() {
  layoutTools();
  for (const k in tools) show(tools[k], false);
  await girl.build();
  scene.add(girl.group);
  girl.group.position.copy(GIRL_DRESS); girl.group.rotation.y = -0.1;
  girl.idleExpr = 'smile'; girl.setExpr('smile');
  hat = girl.makeHat(); hat.position.set(-1.95, 1.2, -2.38); hat.rotation.set(0.25, 0, 0.1); scene.add(hat);
  apron = girl.makeApron('#7a4a2e');
  apron.position.set(-1.58, 0.7, -2.36); apron.rotation.set(0.04, 0, 0.03); scene.add(apron);
  hat.traverse(o => o.userData.dress = 'hat'); apron.traverse(o => o.userData.dress = 'apron');
  hat.userData.halo = makeHalo(0.4); scene.add(hat.userData.halo); apron.userData.halo = makeHalo(0.55); scene.add(apron.userData.halo);
  await mama.build(); scene.add(mama.group);
  mama.group.position.set(-0.62, 0, -1.6); mama.group.rotation.y = -0.65; mama.idleExpr = 'smile'; mama.setExpr('smile');
  mama.wearApron(mama.makeApron('#6e4630'));
  onResize();
  phase = 'dress';
  setShot('dress', true);
  fadeTarget = 0;
  loaderEl.classList.add('h'); setTimeout(() => loaderEl.remove(), 900);
  startTextureLoading();
  if (Q.get('jump')) setTimeout(() => jumpTo(Q.get('jump')), 50);
  // build the rest progressively
  await papa.build(); scene.add(papa.group); papa.group.position.set(0.62, 0, -0.95); papa.group.rotation.y = -0.25; papa.idleExpr = 'smile';
  papa.group.visible = false;
  papa.wearApron(papa.makeApron('#5e3a26')); papa.wearHat(papa.makeHat());
  for (const c of CUSTOMERS) { const h = new Human(c.opt); await h.build(); h.pitch = c.pitch; h.group.visible = false; h.idleExpr = 'smile'; scene.add(h.group); customers.push(h); }
}

// ================================================================ phases
function startCream() {
  phase = 'cream'; phaseT = 0;
  girl.group.position.copy(GIRL_WORK); girl.group.rotation.y = 0;
  girl.lean = 0.12;
  mama.group.position.set(-0.98, 0, -1.6); mama.group.rotation.y = 0.5;
  show(bowl, true); tools.bowl.position.copy(tools.bowl.userData.home);
  knife.visible = true; knife.userData.glob.visible = false;
  tool = 'knife';
  setShot('work', true);
  girl.setExpr('happy', 1.5); voices.girlYay();
}
function startDeco() {
  phase = 'deco'; phaseT = 0;
  tool = null; knife.visible = false;
  show(bowl, false);
  layoutTools();
  for (const k of ['jug', 'sieve', 'berries']) { show(tools[k], true); tools[k].position.copy(tools[k].userData.home); }
  setShot('work');
  // papa comes to help with the piping bag ... and squeezes too hard
  papa.group.visible = true; papa.group.position.set(0.58, 0, -0.9); papa.group.rotation.y = -0.45;
  papa.lookAt(V(0, 1.0, -0.42));
  state.gag = 'enter';
  after(1.2, () => { setShot('papa'); papa.setExpr('proud', 2); voices.papaHo(); bag.visible = true; bag.userData.busy = true; });
  after(2.6, () => { state.gag = 'squeeze'; });
  after(3.6, () => {
    state.gag = 'splat'; sfx.pop(); voices.papaOops(); papa.setExpr('oops', 99); papa.splatFace(18);
    const hp = papa.head.getWorldPosition(new THREE.Vector3());
    for (let i = 0; i < 60; i++) splatFx.emit(bag.position.clone(), V((hp.x - bag.position.x) * 4 + (rnd() - .5) * 1.5, 1.5 + rnd() * 1.5, (hp.z - bag.position.z) * 4 + 1.0 + (rnd() - .5)), 0.006 + rnd() * 0.012, 0.8);
    girl.setExpr('wow', 1.0);
  });
  after(4.6, () => { girl.setExpr('laugh', 2); voices.girlGiggle(); });
  after(6.0, () => { state.gag = 'wipe'; papa.lookAt(null); });
}
function finishGag() {
  state.gag = 'done';
  papa.setExpr('laugh', 2.5); voices.papaLaugh(); towel.visible = false;
  sfx.sparkle();
  after(1.2, () => {
    papa.setExpr('smile');
    papa.group.position.set(0.78, 0, -1.3); papa.group.rotation.y = -0.35;
    setShot('work');
    // papa gives the piping bag to the girl's tray
    bag.userData.busy = false; show(bag, true); state.bagGiven = true;
    layoutTools();
    bag.position.copy(bag.userData.home);
  });
}
function finishDeco() {
  sfx.bell(); after(0.3, () => sfx.fanfare());
  girl.setExpr('proud', 3); voices.girlYay(); papa.setExpr('happy', 3); voices.papaLaugh();
  for (let i = 0; i < 50; i++) { const p = turntable.localToWorld(V((rnd() - .5) * 0.25, 0.1 + rnd() * 0.15, (rnd() - .5) * 0.25)); sparkFx.emit(p, V((rnd() - .5) * 0.2, 0.15 + rnd() * 0.2, (rnd() - .5) * 0.2), 0.008 + rnd() * 0.01, 1.2 + rnd()); }
  tool = null;
  after(2.4, () => { fadeTarget = 1; });
  after(3.0, () => startShop());
}
function startShop() {
  phase = 'shop'; phaseT = 0; fadeTarget = 0;
  for (const k in tools) show(tools[k], false);
  bag.visible = false;
  papa.group.position.set(-0.4, 0, -1.25); papa.group.rotation.y = 0.2; papa.setExpr('smile');
  mama.group.position.set(0.75, 0, -1.0); mama.group.rotation.y = -0.2;
  girl.group.position.copy(GIRL_SHOP); girl.lean = 0.05;
  // the girl's cake goes into the showcase, two plain white cakes beside it
  const mine = cake;
  placeInCase(mine, 0);
  for (let i = 1; i < 3; i++) { const c = new Cake(); c.frostSmooth(); placeInCase(c, i); }
  cake = null;
  setShot('shop', true);
  after(0.8, () => nextCustomer(mine));
}
function placeInCase(c, i) {
  scene.attach(c.group);
  c.group.position.copy(shop.slots[i]); c.group.rotation.set(0, rnd() * 6, 0);
  state.shopCakes[i] = c;
  c.mesh.userData.caseIdx = i;
  c.group.traverse(o => { o.userData.caseIdx = i; });
}
function recipeOf(c) { return c.features(); }
function randomRecipe() {
  const r = { choc: rnd() < 0.6, sugar: rnd() < 0.45, berry: rnd() < 0.75, rose: rnd() < 0.5 };
  if (!r.choc && !r.sugar && !r.berry && !r.rose) r.berry = true;
  return r;
}
function nextCustomer(fromCake) {
  const h = customers[state.custIdx % customers.length];
  if (!h) { after(1, () => nextCustomer(fromCake)); return; }
  state.custIdx++;
  state.cust = h;
  state.request = fromCake ? recipeOf(fromCake) : randomRecipe();
  h.group.visible = true; h.group.position.set(3.4, 0, 0.6); h.group.rotation.y = -Math.PI / 2 * 0.9;
  h.walk = { from: V(3.4, 0, 0.6), to: custSpot(), t: 0, dur: 1.8 };
  h.setExpr('smile'); h.lookAt(null);
  sfx.door();
  // thought bubble showing the wished cake (a real render of a cake decorated that way)
  const img = snapshotRecipe(state.request);
  if (state.bubble) { scene.remove(state.bubble); }
  state.bubble = makeBubble(img); state.bubble.scale.setScalar(0.001); scene.add(state.bubble);
  state.bubble.userData.showAt = time + 2.0;
}
// render a cake decorated by recipe into an image (used inside thought bubbles)
const snapScene = new THREE.Scene();
snapScene.environment = scene.environment; snapScene.environmentIntensity = 0.9;
{ const l = new THREE.DirectionalLight(0xfff0dd, 3); l.position.set(-1, 2, 1.5); snapScene.add(l); snapScene.add(new THREE.HemisphereLight(0xfff8f0, 0x8a6a50, 0.6)); }
const snapCam = new THREE.PerspectiveCamera(30, 1.2, 0.05, 5);
function snapshotRecipe(r) {
  const c = new Cake(); c.frostSmooth();
  if (r.choc) { for (let a = 0; a < 6.28; a += 0.35) for (let k = 0; k < 6; k++) c.pour(Math.cos(a) * 0.08, HS, Math.sin(a) * 0.08, 1.4e-7 * (0.6 + rnd())); for (let k = 0; k < 80; k++) c.pour(0, HS, 0, 1.3e-7); for (let s = 0; s < 260; s++) c.simChoc(1 / 60); }
  if (r.sugar) for (let k = 0; k < 90; k++) c.sugar((rnd() - .5) * 0.1, (rnd() - .5) * 0.1, 0.05, 0.05);
  if (r.berry) for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; c.addBerry(Math.cos(a) * 0.05, Math.sin(a) * 0.05); }
  if (r.rose) for (let k = 0; k < 10; k++) { const a = (k + 0.5) / 10 * 6.28; c.addRosette(Math.cos(a) * 0.077, Math.sin(a) * 0.077); }
  c.update(0);
  c.berries.forEach(b => b.scale.setScalar(b.userData.sc));
  snapScene.add(c.group);
  const bgc = new THREE.Color(0xfff8ee); snapScene.background = bgc;
  snapCam.position.set(0, 0.2, 0.33); snapCam.lookAt(0, 0.03, 0);
  const S = 256;
  const rt = new THREE.WebGLRenderTarget(S, Math.round(S / 1.2), { type: THREE.UnsignedByteType, samples: 4, colorSpace: THREE.SRGBColorSpace });
  const oldT = renderer.toneMapping;
  renderer.setRenderTarget(rt);
  renderer.render(snapScene, snapCam);
  const px = new Uint8Array(S * rt.height * 4);
  renderer.readRenderTargetPixels(rt, 0, 0, S, rt.height, px);
  renderer.setRenderTarget(null);
  rt.dispose();
  snapScene.remove(c.group);
  const cv = document.createElement('canvas'); cv.width = S; cv.height = rt.height;
  const id = cv.getContext('2d').createImageData(S, rt.height);
  // flip Y, apply a simple filmic curve (render target is linear)
  for (let y = 0; y < rt.height; y++) for (let x = 0; x < S; x++) {
    const si = ((rt.height - 1 - y) * S + x) * 4, di = (y * S + x) * 4;
    for (let k = 0; k < 3; k++) { let v = px[si + k] / 255; v = v * 1.15; v = v / (1 + v * 0.25); id.data[di + k] = Math.min(255, Math.pow(v, 1 / 2.2) * 255); }
    id.data[di + 3] = 255;
  }
  cv.getContext('2d').putImageData(id, 0, 0);
  renderer.toneMapping = oldT;
  return cv;
}
function selectCaseCake(i) {
  const c = state.shopCakes[i]; if (!c || !state.cust || state.cust.walk) return;
  state.shopSel = i;
  cake = c;
  fadeTarget = 1;
  after(0.35, () => {
    plate.attach(c.group); c.group.position.set(0, PLATE_TOP, 0); c.group.rotation.set(0, 0, 0);
    state.shopCakes[i] = null;
    phase = 'shopwork'; fadeTarget = 0;
    girl.group.position.copy(GIRL_WORK);
    layoutTools();
    for (const k of ['jug', 'sieve', 'berries', 'bag', 'bell']) { show(tools[k], true); tools[k].position.copy(tools[k].userData.home); }
    tool = null;
    setShot('work', true);
    // small copy of the wish next to the cake
    if (state.bubble2) scene.remove(state.bubble2);
    state.bubble2 = makeBubble(state.bubble.material.map.image);
    state.bubble2.material.map = state.bubble.material.map;
    scene.add(state.bubble2);
  });
}
function handOver() {
  sfx.bell();
  tool = null;
  fadeTarget = 1;
  after(0.35, () => {
    for (const k in tools) show(tools[k], false);
    if (state.bubble2) { scene.remove(state.bubble2); state.bubble2 = null; }
    phase = 'shop'; fadeTarget = 0;
    girl.group.position.copy(GIRL_SHOP);
    setShot('shop', true);
    const c = cake; cake = null;
    scene.attach(c.group);
    const cu = state.cust;
    const hands = cu.group.localToWorld(V(0, cu.T.hipY + 0.42 * cu.opt.H / 1.75 + 0.18, 0.28));
    c.fly = { from: V(GIRL_SHOP.x - 0.1, COUNTER_Y + 0.05, CZ), to: hands, t: 0, dur: 1.1 };
    c.group.position.copy(c.fly.from);
    girl.setReach('R', c.group.position, 1);
    state.handing = c;
    after(1.2, () => {
      girl.setReach('R', null);
      cu.setReach('L', c.group.position.clone().add(V(0.06, 0, 0)), 1); cu.setReach('R', c.group.position.clone().add(V(-0.06, 0, 0)), 1);
      const got = recipeOf(c), want = state.request;
      const match = (!want.choc || got.choc) && (!want.sugar || got.sugar) && (!want.berry || got.berry) && (!want.rose || got.rose);
      const pitch = cu.pitch;
      if (match) {
        cu.setExpr('happy', 3); voices.custYay(pitch); sfx.fanfare(); girl.setExpr('proud', 3);
        celebrate(c.group.position, 60);
      } else {
        cu.setExpr('huh', 1.4); voices.custHuh(pitch); girl.setExpr('huh', 1.2);
        after(1.5, () => { cu.setExpr('happy', 2.5); voices.custYay(pitch); sfx.sparkle(); girl.setExpr('happy', 2); celebrate(c.group.position, 25); });
      }
      if (state.bubble) { state.bubble.userData.hideAt = time + 0.6; }
      after(match ? 3.2 : 4.4, () => {
        // walk away holding the cake
        cu.attachCake = c; cu.group.attach(c.group);
        cu.walk = { from: cu.group.position.clone(), to: V(3.2, 0, 0.7), t: 0, dur: 2.0, leave: true };
        cu.setReach('L', null); cu.setReach('R', null);
        // refill the showcase slot with a new white cake
        after(1.0, () => { const nc = new Cake(); nc.frostSmooth(); placeInCase(nc, state.shopSel); celebrate(shop.slots[state.shopSel].clone().add(V(0, 0.08, 0)), 15); sfx.sparkle(); mama.setExpr('smile', 2); });
        after(2.6, () => { scene.remove(c.group); nextCustomer(null); });
      });
    });
  });
}
function celebrate(p, n) {
  for (let i = 0; i < n; i++) sparkFx.emit(p.clone().add(V((rnd() - .5) * 0.2, rnd() * 0.15, (rnd() - .5) * 0.2)), V((rnd() - .5) * 0.25, 0.1 + rnd() * 0.25, (rnd() - .5) * 0.25), 0.006 + rnd() * 0.012, 1 + rnd());
}

// ================================================================ input
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const ptr = { down: false, x: 0, y: 0, px: 0, py: 0, id: null, start: 0, moved: 0, last: null, mode: null, lastLocal: null, lastWorld: null, dist: 0 };
function pick(x, y, objs) {
  ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(objs, true);
  for (const h of hits) { if (h.object.userData.noRay || !isVisible(h.object)) continue; return h; }
  return null;
}
function isVisible(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
canvas.addEventListener('pointerdown', (e) => {
  audioUnlock();
  if (ptr.down) return;
  ptr.down = true; ptr.id = e.pointerId; ptr.x = ptr.px = e.clientX; ptr.y = ptr.py = e.clientY; ptr.start = time; ptr.moved = 0;
  ptr.lastLocal = null; ptr.dist = 0; ptr.mode = null;
  idleT = 0;
  onDown(e.clientX, e.clientY);
  try { canvas.setPointerCapture(e.pointerId); } catch (_) { }
});
canvas.addEventListener('pointermove', (e) => {
  if (!ptr.down || e.pointerId !== ptr.id) return;
  ptr.moved += Math.hypot(e.clientX - ptr.x, e.clientY - ptr.y);
  ptr.px = ptr.x; ptr.py = ptr.y; ptr.x = e.clientX; ptr.y = e.clientY;
  idleT = 0;
});
const up = (e) => { if (e.pointerId !== ptr.id) return; ptr.down = false; onUp(); };
canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

function toolObjects() { const a = []; for (const k in tools) if (tools[k].visible) a.push(tools[k]); return a; }
function onDown(x, y) {
  if (fade > 0.5) return;
  if (phase === 'dress') {
    const h = pick(x, y, [hat, apron].filter(o => o.parent === scene));
    if (h) dressUp(h.object.userData.dress);
    else { const g = pick(x, y, [girl.group]); if (g) { girl.setExpr('happy', 1); voices.girlHm(); girl.bounce = 0.02; } }
    return;
  }
  if (phase === 'cream' || phase === 'deco' || phase === 'shopwork') {
    const th = pick(x, y, toolObjects());
    if (th) { pickTool(th.object.userData.tool); if (th.object.userData.tool !== 'bell') ptr.mode = 'cake'; return; }
    if (phase === 'deco' && state.gag === 'wipe') { ptr.mode = 'wipe'; return; }
    ptr.mode = 'cake';
    return;
  }
  if (phase === 'shop') {
    const cs = state.shopCakes.filter(Boolean).map(c => c.group);
    const h = pick(x, y, cs);
    if (h) { let o = h.object; while (o && o.userData.caseIdx === undefined) o = o.parent; if (o) selectCaseCake(o.userData.caseIdx); return; }
    if (state.cust) { const hc = pick(x, y, [state.cust.group]); if (hc) { state.cust.setExpr('smile', 1); voices.custYay(state.cust.pitch); } }
  }
}
function onUp() {
  setLoop('scrape', 0); setLoop('pour', 0); setLoop('sift', 0);
  if (tool === 'jug') jug.userData.pouring = false;
  ptr.mode = null; ptr.lastLocal = null;
}
function pickTool(k) {
  if (k === 'bell') {
    if (phase === 'deco') { if (state.bellReady) finishDeco(); else wiggle(bell); }
    else if (phase === 'shopwork') handOver();
    return;
  }
  if (k === 'bowl') {
    tool = 'knife'; cake.scoop(); sfx.scoop(); knife.userData.glob.visible = true; knife.userData.glob.scale.set(1.6, 0.45, 0.8);
    state.scoopAnim = 0.5; girl.setExpr('smile', 1);
    return;
  }
  if (tool === k) return;
  tool = k; sfx.tick(); girl.setExpr('smile', 0.8);
  for (const kk of ['jug', 'sieve', 'berries', 'bag']) tools[kk].userData.busy = (kk === tool);
}
function wiggle(o) { o.userData.wig = 0.6; }

function dressUp(which) {
  if (state.dressed[which]) return;
  state.dressed[which] = true;
  const obj = which === 'hat' ? hat : apron;
  obj.userData.halo.visible = false;
  sfx.whoosh();
  const from = obj.getWorldPosition(V(0, 0, 0)), fromQ = obj.getWorldQuaternion(new THREE.Quaternion());
  // target transform: attach temporarily to compute
  const parent = which === 'hat' ? girl.head : girl.torso;
  const dummy = new THREE.Object3D(); parent.add(dummy);
  if (which === 'hat') { dummy.position.set(0, 0.004 * girl.s, -0.008 * girl.s); dummy.rotation.set(-0.12, 0, 0.05); }
  dummy.updateWorldMatrix(true, false);
  obj.userData.fly = { from, fromQ, dummy, t: 0, dur: 0.75, which };
}

// ================================================================ per-frame interaction
const tmpV = new THREE.Vector3(), tmpQ = new THREE.Quaternion();
function interact(dt) {
  const working = (phase === 'cream' || phase === 'deco' || phase === 'shopwork') && cake;
  // ---- girl's hand follows the tool
  if (!working) return;
  let hit = null, local = null, mode = null;
  if (ptr.down && ptr.mode === 'cake') {
    const h = pick(ptr.x, ptr.y, [cake.mesh]);
    if (h) {
      hit = h.point.clone();
      local = cake.group.worldToLocal(h.point.clone());
      const r = Math.hypot(local.x, local.z);
      mode = (local.y < HS - 0.008 && r > CAKE_R - 0.01) ? 'side' : 'top';
    } else if (tool && tool !== 'knife') {
      // allow hovering tools a little outside the cake (sieve/jug over the edge)
      const h2 = pick(ptr.x, ptr.y, [plate]);
      if (h2) { hit = h2.point.clone(); local = cake.group.worldToLocal(h2.point.clone()); mode = 'top'; }
    }
  }
  const camF = new THREE.Vector3(); camera.getWorldDirection(camF);
  // ------------------------------------------------ knife (cream phase)
  if (tool === 'knife') {
    let gp, q = new THREE.Quaternion();
    const towardGirl = V(GIRL_WORK.x - WORK.x, 0, GIRL_WORK.z - WORK.z).normalize();
    if (hit && mode === 'top') {
      // blade flat on the cream, handle toward the girl
      const dir = hit.clone().sub(girl.group.position); dir.y = 0; dir.normalize();
      const yaw = Math.atan2(-dir.z, dir.x);
      q.setFromEuler(new THREE.Euler(0, yaw, 0.12));
      const h = cake.surfaceHeightAt(local.x, local.y, local.z);
      gp = hit.clone().addScaledVector(dir, -0.15).add(V(0, 0.028 + h + 0.004, 0));
      // first touch after the first scoop: drop a big lumpy dollop of cream there
      if (state.firstScoop && cake.load > 0.02) { state.firstScoop = false; cake.dollop(1); cake.load = 0.0; const c = cake; c.H.forEach((v, k) => { }); sfx.squish(); girl.setExpr('wow', 1.2); voices.girlWow(); knife.userData.glob.visible = false; }
    } else if (hit && mode === 'side') {
      // blade upright against the side; the turntable turns with the drag
      const n = V(hit.x - WORK.x, 0, hit.z - WORK.z).normalize();
      const tang = V(-n.z, 0, n.x);
      const m = new THREE.Matrix4().makeBasis(V(0, -1, 0), n.clone().negate().cross(V(0, -1, 0)).negate(), n.clone());
      q.setFromRotationMatrix(m);
      q.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.0)));
      gp = hit.clone().add(V(0, 0.16, 0)).addScaledVector(n, 0.035);
      const dx = ptr.x - ptr.px;
      if (Math.abs(dx) > 0) { plate.rotation.y += dx * 0.006; turntable.userData.spin = dx * 0.006 / Math.max(dt, 0.001); }
      ptr.px = ptr.x;
    } else {
      // resting: held just in front of the girl, near the cake
      gp = V(WORK.x + 0.13, COUNTER_Y + 0.2, WORK.z - 0.2);
      q.setFromEuler(new THREE.Euler(0, -Math.PI / 2 + 0.35, -0.18));
    }
    if (state.scoopAnim > 0) { state.scoopAnim -= dt; gp = bowl.position.clone().add(V(0.02, 0.12, 0)); q.setFromEuler(new THREE.Euler(0, -Math.PI / 2 - 0.5, -0.3)); }
    knife.position.lerp(gp, 1 - Math.exp(-dt * 22));
    knife.quaternion.slerp(q, 1 - Math.exp(-dt * 16));
    // glob of cream shrinks as the load is used
    if (!state.firstScoop) { const L = cake.load; knife.userData.glob.visible = L > 0.002; const s = Math.sqrt(L / 0.03); knife.userData.glob.scale.set(1.6 * s + 0.2, 0.45 * s + 0.05, 0.8 * s + 0.1); }
    girl.setReach('R', knife.position, 1);
    girl.handRot.R = knife.quaternion.clone().multiply(HAND_OFF);
    // apply
    if (local && ptr.lastLocal && ptr.lastMode === mode) {
      cake.strokeSeed = cake.strokeSeed ?? rnd() * 100;
      const w = cake.knife(ptr.lastLocal, local, mode);
      const sp = ptr.lastLocal.distanceTo(local) / Math.max(dt, 1e-3);
      setLoop('scrape', clamp(sp * 6, 0, 1) * (w > 0.001 ? 1 : 0.4), clamp(sp * 3, 0, 1));
      if (w > 0.002) { girl.setExpr('focus', 0.5); }
    } else if (local) { cake.strokeSeed = rnd() * 100; }
    ptr.lastLocal = local; ptr.lastMode = mode;
    return;
  }
  girl.handRot.R = null;
  // ------------------------------------------------ chocolate jug
  const toolHomeReach = (o) => { girl.setReach('R', o.position.clone().add(V(-0.04, 0.06, 0)), 0.0); };
  if (tool === 'jug') {
    const pouring = hit && ptr.down;
    let target, tilt = 0;
    if (pouring) {
      const held = time - ptr.start;
      tilt = clamp(held * 3, 0, 1);
      target = hit.clone().add(V(-0.07, 0.13 + (1 - tilt) * 0.03, 0));
      // chocolate leaves the spout once tilted enough
      if (tilt > 0.6) {
        const amt = 1.1e-7 * (0.8 + 0.4 * Math.sin(time * 13)) * (dt * 60);
        cake.pour(local.x, local.y, local.z, amt);
        setLoop('pour', 1, Math.sin(time * 7) * 0.5 + 0.5);
        if (!state.chocWow) { state.chocWow = true; girl.setExpr('wow', 1.4); voices.girlWow(); }
        const sp = jug.localToWorld(jug.userData.spout.clone());
        stream.visible = true; stream.position.copy(sp);
        const len = sp.y - hit.y; stream.scale.set(0.0032 + 0.0008 * Math.sin(time * 20), len, 0.0032);
        stream.rotation.set(0, 0, 0);
        stream.position.x = lerp(sp.x, hit.x, 0.0); stream.position.z = sp.z;
        // the stream lands at the hit point: lean the tube
        const dx = hit.x - sp.x, dz = hit.z - sp.z;
        stream.rotation.z = Math.atan2(dx, len); stream.rotation.x = -Math.atan2(dz, len);
      } else { stream.visible = false; setLoop('pour', 0); }
    } else { stream.visible = false; target = V(WORK.x + 0.12, COUNTER_Y + 0.2, WORK.z + 0.02); }
    jug.position.lerp(target, 1 - Math.exp(-dt * 12));
    jug.userData.body.rotation.z = damp(jug.userData.body.rotation.z, -tilt * 1.35, 10, dt);
    jug.userData.halo.visible = false;
    girl.setReach('R', jug.localToWorld(V(-0.07, 0.06, 0)), 1);
  } else { stream.visible = false; if (!tools.jug.userData.busy) jug.position.lerp(jug.userData.home || jug.position, 1 - Math.exp(-dt * 8)); jug.userData.body.rotation.z = damp(jug.userData.body.rotation.z, 0, 8, dt); }
  // ------------------------------------------------ sieve
  if (tool === 'sieve') {
    let target;
    if (hit && ptr.down) {
      target = hit.clone().add(V(0, 0.12, 0));
      const sp = Math.hypot(ptr.x - ptr.px, ptr.y - ptr.py) / Math.max(dt, 1e-3);
      ptr.px = ptr.x; ptr.py = ptr.y;
      const shake = 0.35 + clamp(sp / 400, 0, 1.5);
      sieve.position.x += Math.sin(time * 40) * 0.003 * shake;
      const n = Math.floor(18 * shake * dt * 60);
      const wp = sieve.position;
      for (let i = 0; i < n; i++) {
        const a = rnd() * 6.283, r = Math.sqrt(rnd()) * 0.055;
        sugarFx.emit(V(wp.x + Math.cos(a) * r, wp.y + 0.02, wp.z + Math.sin(a) * r), V((rnd() - .5) * 0.02, -0.05 - rnd() * 0.06, (rnd() - .5) * 0.02), 0.0012 + Math.pow(rnd(), 3) * 0.003, 2.5);
      }
      setLoop('sift', clamp(shake, 0, 1));
      if (!state.sugarWow && cake.stats.sugar > 0.05) { state.sugarWow = true; girl.setExpr('happy', 1.2); voices.girlYay(); }
    } else { target = V(WORK.x - 0.12, COUNTER_Y + 0.22, WORK.z + 0.0); setLoop('sift', 0); }
    sieve.position.lerp(target, 1 - Math.exp(-dt * 12));
    girl.setReach('R', sieve.localToWorld(V(-0.17, 0.05, 0)), 1);
  } else if (sieve.userData.home) sieve.position.lerp(sieve.userData.home, 1 - Math.exp(-dt * 8));
  // ------------------------------------------------ strawberries
  if (tool === 'berries') {
    if (hit && ptr.down && mode === 'top') {
      const last = state.lastBerry;
      if (!last || last.distanceTo(local) > 0.026 || time - state.lastBerryT > 0.6) {
        if (!last || time - state.lastBerryT > 0.18) {
          const b = cake.addBerry(local.x, local.z);
          if (b) { sfx.plop(); state.lastBerry = local.clone(); state.lastBerryT = time; b.userData.t = 0; if (cake.berries.length === 1) { girl.setExpr('happy', 1); voices.girlYay(); } }
        }
      }
    }
    girl.setReach('R', hit ? hit.clone().add(V(0, 0.05, 0)) : berryBowl.position.clone().add(V(0, 0.08, 0)), 1);
  }
  // ------------------------------------------------ piping bag
  if (tool === 'bag' && state.bagGiven) {
    let target;
    if (hit && ptr.down && mode === 'top') {
      target = hit.clone().add(V(0, 0.045, 0));
      const last = state.lastRose;
      if ((!last || last.distanceTo(local) > 0.02) && time - (state.lastRoseT || 0) > 0.15) {
        const r = cake.addRosette(local.x, local.z);
        if (r) { sfx.pipe(); state.lastRose = local.clone(); state.lastRoseT = time; r.scale.multiplyScalar(0.01); r.userData.grow = 0; }
      }
      bag.userData.bag.scale.x = bag.userData.bag.scale.z = 1 + Math.sin(time * 30) * 0.03;
    } else target = V(WORK.x + 0.13, COUNTER_Y + 0.25, WORK.z + 0.03);
    bag.position.lerp(target, 1 - Math.exp(-dt * 12));
    girl.setReach('R', bag.position.clone().add(V(0, 0.14, 0)), 1);
  } else if (bag.userData.home && !bag.userData.busy && state.gag !== 'squeeze' && state.gag !== 'enter') { bag.position.lerp(bag.userData.home, 1 - Math.exp(-dt * 8)); bag.rotation.set(0, 0.6, Math.PI / 2); }
  if (tool === 'bag') bag.rotation.set(0, 0, 0);
  if (!tool) girl.setReach('R', null);
}
const HAND_OFF = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(0, 1, 0), V(0, 0, 1), V(1, 0, 0)));

// ================================================================ update loop
let last = performance.now(), fpsAcc = 0, fpsN = 0, lowCount = 0;
function frame(now) {
  requestAnimationFrame(frame);
  let dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (Q.has('fast')) dt = 0.12;
  time += dt; phaseT += dt; idleT += dt;
  // adaptive resolution to keep >= 30fps on phones
  fpsAcc += dt; fpsN++;
  if (fpsAcc > 2 && !Q.has('fast')) { const fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; if (fps < 32 && PR > 0.8) { PR = Math.max(0.8, PR - 0.2); onResize(); } }
  for (let i = queue.length - 1; i >= 0; i--) if (queue[i].t <= time) { const q = queue.splice(i, 1)[0]; q.f(); }
  fade = damp(fade, fadeTarget, 7, dt);
  if (phase === 'loading') { return; }

  // ---- dress-up flights
  for (const obj of [hat, apron]) {
    const f = obj && obj.userData.fly; if (!f) continue;
    f.t += dt / f.dur;
    const t = easeInOut(Math.min(1, f.t));
    const to = f.dummy.getWorldPosition(new THREE.Vector3()), toQ = f.dummy.getWorldQuaternion(new THREE.Quaternion());
    obj.position.lerpVectors(f.from, to, t); obj.position.y += Math.sin(t * Math.PI) * 0.25;
    obj.quaternion.slerpQuaternions(f.fromQ, toQ, t);
    obj.scale.setScalar(1);
    if (f.t >= 1) {
      obj.userData.fly = null; f.dummy.parent.remove(f.dummy);
      if (f.which === 'hat') girl.wearHat(obj); else girl.wearApron(obj);
      sfx.hatOn(); girl.setExpr(f.which === 'hat' ? 'happy' : 'proud', 1.6); voices.girlYay(); girl.bounce = 0.03;
      celebrate(girl.head.getWorldPosition(new THREE.Vector3()), 20);
      mama.setExpr('happy', 1.5);
      if (state.dressed.hat && state.dressed.apron && !state.dressDone) {
        state.dressDone = true;
        after(1.8, () => { voices.mamaHm(); mama.setExpr('happy', 1); });
        after(2.6, () => { fadeTarget = 1; });
        after(3.2, () => { startCream(); fadeTarget = 0; });
      }
    }
  }
  if (girl.bounce) girl.bounce = Math.max(0, girl.bounce - dt * 0.12) * (1 - dt * 6);

  interact(dt);

  // ---- cake simulation & phase goals
  for (const c of state.shopCakes) if (c && c !== cake) c.update(dt);
  if (cake) {
    cake.update(dt);
    for (const r of cake.rosettes) if (r.userData.grow !== undefined && r.userData.grow < 1) { r.userData.grow = Math.min(1, r.userData.grow + dt * 4); r.scale.copy(r.userData.sc).multiplyScalar(easeOut(r.userData.grow)); }
    if ((state.statT = (state.statT || 0) + dt) > 0.5) { state.statT = 0; cake.computeStats(); }
  }
  // turntable inertia
  if (!(ptr.down && ptr.lastMode === 'side')) { const sp = turntable.userData.spin || 0; plate.rotation.y += sp * dt; turntable.userData.spin = sp * Math.exp(-dt * 2.5); }
  if (phase === 'cream' && cake && !state.creamDone) {
    const st = cake.stats;
    if (st.cov > 0.9 && st.smooth > 0.5) {
      state.creamDone = true;
      sfx.sparkle(); after(0.2, () => sfx.fanfare());
      girl.setExpr('proud', 2.5); voices.girlYay(); mama.setExpr('happy', 2);
      celebrate(turntable.localToWorld(V(0, 0.15, 0)), 50);
      tool = null; knife.visible = false; girl.setReach('R', null); setLoop('scrape', 0);
      after(2.2, () => startDeco());
    }
  }
  if (phase === 'deco') {
    // papa's piping bag mishap
    if (state.gag === 'enter' || state.gag === 'squeeze') {
      const hp = papa.group.localToWorld(V(-0.12, 1.12, 0.25));
      bag.position.lerp(hp, 1 - Math.exp(-dt * 6));
      bag.rotation.set(0, 0, state.gag === 'squeeze' ? 0.6 + Math.sin(time * 40) * 0.05 : 0.4);
      papa.setReach('R', bag.position.clone().add(V(0.0, 0.12, 0)), 1);
      papa.setReach('L', bag.position.clone().add(V(0.02, 0.06, 0.03)), 1);
      if (state.gag === 'squeeze') { const s = 1 + Math.min(0.5, (time % 10) * 0) ; bag.userData.bag.scale.set(1.15 + Math.sin(time * 25) * 0.05, 0.9, 1.15); papa.setExpr('focus'); }
    }
    if (state.gag === 'splat') { bag.userData.bag.scale.set(0.8, 0.8, 0.8); papa.setReach('R', null); papa.setReach('L', null); bag.position.lerp(V(0.45, COUNTER_Y + 0.03, -0.6), 1 - Math.exp(-dt * 5)); }
    if (state.gag === 'wipe') {
      papa.lookAt(camera.position);
      if (ptr.down && ptr.mode === 'wipe') {
        const h = pick(ptr.x, ptr.y, [papa.headMesh]);
        if (h && h.uv) {
          towel.visible = true;
          towel.position.copy(h.point).addScaledVector(h.face.normal.clone().transformDirection(papa.headMesh.matrixWorld), 0.012);
          towel.lookAt(camera.position);
          towel.rotation.z += Math.sin(time * 20) * 0.2;
          const mv = Math.hypot(ptr.x - ptr.px, ptr.y - ptr.py); ptr.px = ptr.x; ptr.py = ptr.y;
          const rem = papa.wipeFace(h.uv, 0.04 + mv * 0.01);
          if (mv > 1 && rnd() < 0.3) sfx.wipe();
          girl.setReach('R', towel.position, 1);
          papa.setExpr('laugh', 0.3);
          if (rem < 0.12) finishGag();
        }
      } else { towel.visible = false; girl.setReach('R', null); }
    }
    if (state.gag === 'done' && !state.bellReady) {
      const st = cake.stats;
      const n = (st.choc > 0.03 ? 1 : 0) + (st.sugar > 0.04 ? 1 : 0) + (cake.berries.length >= 3 ? 1 : 0) + (cake.rosettes.length >= 3 ? 1 : 0);
      if (n >= 2 && state.bagGiven) { state.bellReady = true; show(bell, true); bell.position.copy(bell.userData.home); wiggle(bell); sfx.tick(); }
    }
  }

  // ---- customers walking / bubble
  for (const c of customers) {
    if (!c.walk) continue;
    const w = c.walk; w.t += dt / w.dur;
    const t = easeInOut(Math.min(1, w.t));
    c.group.position.lerpVectors(w.from, w.to, t);
    c.group.position.y = Math.abs(Math.sin(w.t * Math.PI * 5)) * 0.012;
    c.group.rotation.y = damp(c.group.rotation.y, w.leave ? Math.PI / 2 : (w.t < 0.85 ? -Math.PI / 2 * 0.8 : -Math.PI * 0.72), 5, dt);
    if (w.t >= 1) {
      c.walk = null;
      if (w.leave) { c.group.visible = false; if (c.attachCake) { c.group.remove(c.attachCake.group); c.attachCake = null; } }
      else { c.lookAt(girl.head.getWorldPosition(new THREE.Vector3())); girl.lookAt(c.head.getWorldPosition(new THREE.Vector3())); after(0.8, () => { girl.lookAt(null); c.lookAt(null); }); }
    }
  }
  if (state.handing) {
    const c = state.handing, f = c.fly;
    if (f) { f.t += dt / f.dur; const t = easeInOut(Math.min(1, f.t)); c.group.position.lerpVectors(f.from, f.to, t); c.group.position.y += Math.sin(t * Math.PI) * 0.12; if (f.t >= 1) { c.fly = null; state.handing = null; } }
  }
  if (state.bubble && state.cust) {
    const b = state.bubble;
    const hp = state.cust.head.getWorldPosition(new THREE.Vector3());
    b.position.copy(hp).add(V(0.02, 0.15, 0));
    const vis = time > (b.userData.showAt || 0) && !(b.userData.hideAt && time > b.userData.hideAt) && phase === 'shop';
    const sc = vis ? 0.36 + Math.sin(time * 2) * 0.008 : 0.001;
    b.scale.setScalar(damp(b.scale.x, sc, 8, dt));
    if (vis && !b.userData.popped) { b.userData.popped = true; sfx.sparkle(); state.cust.setExpr('smile'); }
  }
  if (state.bubble2 && phase === 'shopwork') {
    const f = shots.work.fit;
    state.bubble2.position.set(WORK.x - 0.16, COUNTER_Y + 0.27, WORK.z + 0.02);
    state.bubble2.scale.setScalar(0.17);
  }

  // ---- particles
  sugarFx.update(dt, cake ? cake.group.getWorldPosition(tmpV).y + HS + 0.004 : -1, (x, y, z) => {
    if (!cake) return;
    const l = cake.group.worldToLocal(V(x, y, z));
    if (Math.hypot(l.x, l.z) < CAKE_R + 0.004) cake.sugar(l.x, l.z, 0.0035, 0.06);
  });
  splatFx.update(dt, -1);
  sparkFx.update(dt, -1);

  // ---- characters
  const camPos = camera.position;
  girl.update(dt, camera);
  if (mama.ready) mama.update(dt, camera);
  if (papa.ready && papa.group.visible) papa.update(dt, camera);
  for (const c of customers) if (c.group.visible) c.update(dt, camera);
  // where the girl looks
  if (phase === 'cream' || phase === 'deco' || phase === 'shopwork') {
    if (state.gag === 'wipe' || state.gag === 'splat') girl.lookAt(papa.head.getWorldPosition(new THREE.Vector3()));
    else if (ptr.down && cake) girl.lookAt(cake.group.getWorldPosition(new THREE.Vector3()).add(V(0, 0.06, 0)));
    else if (idleT > 2.5 && idleT % 6 < 1.5) girl.lookAt(null);
    else girl.lookAt(WORK.clone().add(V(0, 0.15, 0)));
  } else if (phase === 'dress') girl.lookAt(idleT % 5 < 2.5 ? null : V(-1.75, 1.2, -2.4));

  // ---- guidance: glow + pointing hand
  updateGuidance(dt);

  // ---- camera
  const f = shots[shot].fit;
  shotBlend = Math.min(1, shotBlend + dt / 1.1);
  const tb = easeInOut(shotBlend);
  cam.pos.lerpVectors(cam.from, f.pos, tb); cam.tgt.lerpVectors(cam.fromT, f.tgt, tb);
  if (shotBlend >= 1) { cam.from.copy(f.pos); cam.fromT.copy(f.tgt); }
  camera.position.copy(cam.pos).add(V(Math.sin(time * 0.37) * 0.004, Math.sin(time * 0.53) * 0.003, 0));
  camera.lookAt(cam.tgt);
  post.focus = f.focus; post.aperture = 0.55;
  post.mat.uniforms.fade.value = fade;
  post.render(scene, camera, time);
  if (DEBUG && Math.floor(time) !== Math.floor(time - dt)) dbg();
}

function updateGuidance(dt) {
  const pulse = 0.5 + 0.5 * Math.sin(time * 3.2);
  let target = null, drag = false;
  const halos = [];
  if (phase === 'dress') {
    for (const o of [hat, apron]) if (o.parent === scene && !o.userData.fly) halos.push(o);
    const nxt = !state.dressed.hat ? hat : !state.dressed.apron ? apron : null;
    if (nxt && nxt.parent === scene) target = nxt.getWorldPosition(new THREE.Vector3());
  } else if (phase === 'cream') {
    if (state.firstScoop && cake.load < 0.02) { halos.push(bowl); target = bowl.position.clone().add(V(0, 0.08, 0)); }
    else if (state.firstScoop) { target = turntable.localToWorld(V(0, 0.09, 0)); }
    else {
      // bare side & empty knife -> bowl; otherwise point at the least finished spot
      const sp = cake.worstSpot();
      const w = cake.group.localToWorld(sp);
      if (cake.load < 0.003 && cake.stats.cov < 0.8 && w.y < COUNTER_Y + 0.14) { halos.push(bowl); target = bowl.position.clone().add(V(0, 0.08, 0)); }
      else { target = w; drag = true; }
    }
  } else if (phase === 'deco') {
    if (state.gag === 'wipe') { target = papa.head.getWorldPosition(new THREE.Vector3()).add(V(0, -0.02, 0.1)); drag = true; }
    else if (state.gag === 'done') {
      if (state.bellReady) { halos.push(bell); target = bell.position.clone().add(V(0, 0.06, 0)); }
      else {
        const left = ['jug', 'berries', 'sieve', 'bag'].filter(k => tools[k].visible && !(k === 'jug' && cake.stats.choc > 0.03) && !(k === 'berries' && cake.berries.length >= 3) && !(k === 'sieve' && cake.stats.sugar > 0.04) && !(k === 'bag' && cake.rosettes.length >= 3));
        for (const k of left) halos.push(tools[k]);
        if (tool && tool !== 'knife') { target = cake.group.localToWorld(V(0.03, HS + 0.01, 0.05)); drag = tool === 'sieve'; }
        else if (left[0]) target = tools[left[0]].position.clone().add(V(0, 0.07, 0));
      }
    }
  } else if (phase === 'shop') {
    if (state.cust && !state.cust.walk && !state.handing) {
      for (const c of state.shopCakes) if (c) halos.push(c.group);
      const c0 = state.shopCakes.find(Boolean); if (c0) target = c0.group.position.clone().add(V(0, 0.1, 0));
    }
  } else if (phase === 'shopwork') {
    for (const k of ['jug', 'sieve', 'berries', 'bag']) if (!tool) halos.push(tools[k]);
    halos.push(bell);
    target = tool ? cake.group.localToWorld(V(0.02, HS + 0.01, 0.04)) : bell.position.clone().add(V(0, 0.06, 0));
  }
  // halos
  const all = [hat, apron, ...Object.values(tools), ...state.shopCakes.filter(Boolean).map(c => c.group)];
  for (const o of all) {
    if (!o) continue;
    let h = o.userData.halo;
    if (!h && o.isGroup && o.children.length && state.shopCakes.some(c => c && c.group === o)) { h = o.userData.halo = makeHalo(0.42); scene.add(h); }
    if (!h) continue;
    const on = halos.includes(o) && o.visible;
    h.visible = true;
    h.material.opacity = damp(h.material.opacity, on ? 0.25 + 0.3 * pulse : 0, 6, dt);
    o.getWorldPosition(h.position); h.position.y += 0.06;
    if (o === hat || o === apron) h.position.y += 0;
    // gentle wobble of touchable things
    if (on && o !== apron && o !== hat && !o.userData.fly) o.rotation.z = Math.sin(time * 5) * 0.03 * pulse;
    else if (o.rotation && !o.userData.fly && o.isGroup && o !== apron && o !== hat) o.rotation.z = damp(o.rotation.z, 0, 8, dt);
    if (o.userData.wig > 0) { o.userData.wig -= dt; o.rotation.z = Math.sin(time * 30) * 0.08 * o.userData.wig; }
  }
  // hand appears after a few idle seconds
  const show = target && idleT > (phase === 'dress' ? 3 : 4.5) && !ptr.down && fade < 0.2;
  hint.material.opacity = damp(hint.material.opacity, show ? 0.95 : 0, 6, dt);
  if (target) {
    const k = (time * 1.1) % 1;
    const off = drag ? V(Math.sin(time * 2.2) * 0.05, 0, 0) : V(0, 0, 0);
    hint.position.copy(target).add(off);
    const d = camera.position.distanceTo(target);
    const s = d * 0.11 * (1 - (drag ? 0 : Math.max(0, Math.sin(k * Math.PI * 2)) * 0.12));
    hint.scale.set(s, s, 1);
    hint.center.set(0.42, 0.9 + (drag ? 0 : Math.max(0, Math.sin(k * Math.PI * 2)) * 0.12));
  }
}

function dbg() {
  if (!cake) return;
  console.log(phase, 'calls/tris', post.stat, JSON.stringify(cake.stats), tool);
}

// ================================================================ resize
function onResize() {
  const w = innerWidth, h = innerHeight;
  renderer.setPixelRatio(PR);
  renderer.setSize(w, h, false);
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  post.setSize(w, h, PR);
  camera.aspect = w / h;
  layoutTools();
  if (shot) { const f = fitShot(shots[shot]); shots[shot].fit = f; camera.fov = f.fov; if (shotBlend >= 1) { cam.pos.copy(f.pos); cam.tgt.copy(f.tgt); cam.from.copy(f.pos); cam.fromT.copy(f.tgt); } }
  camera.updateProjectionMatrix();
}
addEventListener('resize', onResize);
addEventListener('orientationchange', () => setTimeout(onResize, 200));

// test hooks for screenshots
function screenOf(v) { const p = v.clone().project(camera); return { x: (p.x + 1) / 2 * innerWidth, y: (1 - p.y) / 2 * innerHeight }; }
window.__screen = (n) => {
  const W = (o) => o.getWorldPosition(new THREE.Vector3());
  switch (n) {
    case 'hat': return screenOf(W(hat).add(V(0, 0.07, 0))); case 'apron': return screenOf(W(apron).add(V(0, 0.1, 0)));
    case 'cakeTop': return screenOf(plate.localToWorld(V(0, PLATE_TOP + HS, 0)));
    case 'cakeFront': return screenOf(turntable.localToWorld(V(0, 0.07 + PLATE_TOP + HS * 0.5, CAKE_R + 0.004)));
    case 'papaFace': return screenOf(papa.head.localToWorld(V(0, -0.02, 0.1)));
    case 'case0': case 'case1': case 'case2': { const c = state.shopCakes[+n[4]]; return c ? screenOf(W(c.group).add(V(0, 0.04, 0))) : null; }
    default: return tools[n] ? screenOf(W(tools[n]).add(V(0, 0.03, 0))) : null;
  }
};
window.__tris = () => { const a = []; scene.traverse(o => { if (o.isMesh && o.visible) { const g = o.geometry; const n = (g.index ? g.index.count : g.attributes.position.count) / 3; a.push([n | 0, (o.parent && o.parent.type) + ':' + (o.material.type) + ':' + (o.userData.human ? 'human' : '')]); } }); a.sort((x, y) => y[0] - x[0]); return a.slice(0, 25); };
window.__game = { get phase() { return phase; }, get fps() { return 0; }, startCream, startDeco, startShop, finishGag, finishDeco, girl, papa, get cake() { return cake; }, state, tools, pickTool, setShot, handOver, selectCaseCake, dressUp, nextCustomer, setTool: (t) => { tool = t; }, interactSim: null };

onResize();
boot();
requestAnimationFrame(frame);

// developer jump for screenshot checks: ?jump=cream|creamdone|deco|shop
async function jumpTo(j) {
  const waitFor = (f) => new Promise(r => { const i = setInterval(() => { if (f()) { clearInterval(i); r(); } }, 100); });
  if (j === 'dressed' || j === 'cream' || j === 'creamdone' || j === 'deco' || j === 'decodone' || j === 'shop' || j === 'shopwork') {
    girl.wearHat(hat); girl.wearApron(apron); state.dressed.hat = state.dressed.apron = true; state.dressDone = true;
    if (j === 'dressed') return;
    startCream(); fadeTarget = 0; fade = 0;
    if (j === 'cream') return;
    state.firstScoop = false; cake.dollop(1);
    const V3 = THREE.Vector3;
    for (let n = 0; n < 14; n++) { cake.strokeSeed = rnd() * 100; const a = n / 14 * 6.28; for (let t = 0; t < 12; t++) { const r0 = t * 0.008; cake.knife(new V3(Math.cos(a) * r0, HS, Math.sin(a) * r0), new V3(Math.cos(a) * (r0 + 0.008), HS, Math.sin(a) * (r0 + 0.008)), 'top'); } }
    for (let n = 0; n < 2; n++) { cake.strokeSeed = rnd() * 100; for (let a = 0; a < 6.28; a += 0.05) { cake.knife(new V3(Math.cos(a) * CAKE_R, HS * 0.5, Math.sin(a) * CAKE_R), new V3(Math.cos(a + 0.05) * CAKE_R, HS * 0.5, Math.sin(a + 0.05) * CAKE_R), 'side'); if (cake.load < 0.01) cake.scoop(); } }
    for (let n = 0; n < 10; n++) { cake.strokeSeed = rnd() * 100; const a = n / 10 * 6.28 + 0.3; for (let t = 0; t < 12; t++) { const r0 = t * 0.008; cake.knife(new V3(Math.cos(a) * r0, HS, Math.sin(a) * r0), new V3(Math.cos(a) * (r0 + 0.008), HS, Math.sin(a) * (r0 + 0.008)), 'top'); } }
    if (j === 'creamdone') return;
    if (j === 'shop' || j === 'shopwork') {
      state.creamDone = true;
      for (let a = 0; a < 6.28; a += 0.5) for (let k = 0; k < 10; k++) cake.pour(Math.cos(a) * 0.082, HS, Math.sin(a) * 0.082, 1.2e-7 * (0.5 + rnd()));
      for (let k = 0; k < 60; k++) cake.pour(0.0, HS, 0.0, 1.2e-7);
      for (let s2 = 0; s2 < 300; s2++) cake.simChoc(1 / 60);
      for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28; cake.addBerry(Math.cos(a) * 0.05, Math.sin(a) * 0.05); }
      for (let k = 0; k < 9; k++) { const a = (k + 0.5) / 9 * 6.28; cake.addRosette(Math.cos(a) * 0.077, Math.sin(a) * 0.077); }
      cake.update(0);
      startShop();
      if (j === 'shop') return;
      await waitFor(() => state.cust && !state.cust.walk);
      selectCaseCake(1);
      return;
    }
    await waitFor(() => papa.ready);
    await waitFor(() => phase === 'deco');
    if (j === 'deco') return;
    await waitFor(() => state.gag === 'wipe');
    finishGag();
    for (let k = 0; k < 200; k++) { cake.pour((rnd() - .5) * 0.03, HS, (rnd() - .5) * 0.03, 1.1e-7); if (k % 4 === 0) cake.simChoc(1 / 60); }
    for (let a = 0; a < 6.28; a += 0.2) if (rnd() < 0.5) for (let k = 0; k < 6; k++) cake.pour(Math.cos(a) * 0.084, HS, Math.sin(a) * 0.084, 1.2e-7 * rnd());
    for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28; cake.addBerry(Math.cos(a) * 0.05, Math.sin(a) * 0.05); }
    for (let k = 0; k < 40; k++) cake.sugar((rnd() - .5) * 0.08, (rnd() - .5) * 0.08, 0.03, 0.05);
    if (j === 'decodone') return;
    await waitFor(() => state.bagGiven);
    for (let k = 0; k < 9; k++) { const a = (k + 0.5) / 9 * 6.28; cake.addRosette(Math.cos(a) * 0.077, Math.sin(a) * 0.077); }
    finishDeco();
    await waitFor(() => phase === 'shop');
    if (j === 'shop') return;
    await waitFor(() => state.cust && !state.cust.walk);
    selectCaseCake(1);
  }
}
