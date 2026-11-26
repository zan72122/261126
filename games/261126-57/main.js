// おまつりの わたあめやさん — director: renderer, camera shots, input, scenes & story.
import * as THREE from './three.module.min.js';
import { startLoading, setAniso, canvasTex, tex, pbr } from './tex.js';
import { Human, clothMat } from './human.js';
import { buildEnvironment, buildLights, buildStall, contactShadow, roundedBox, woodBox } from './world.js';
import { Candy } from './candy.js';
import { Machine, SUGARS, makeJar, makeScoop, Grains, makeStick, makeStickCup, makeRack } from './machine.js';
import { Sound, FX } from './fx.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const Q = new URLSearchParams(location.search);

// ---------------------------------------------------------------- renderer
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
setAniso(renderer.capabilities.getMaxAnisotropy());
let DPR = Math.min(window.devicePixelRatio || 1, Q.get('dpr') ? +Q.get('dpr') : 2);
renderer.setPixelRatio(DPR);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a1022);
scene.fog = new THREE.Fog(0x1a1626, 9, 26);
scene.environment = buildEnvironment(renderer);
scene.environmentIntensity = 0.75;
const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 60);
const L = buildLights(scene);
const S = buildStall(scene);
const sound = new Sound();
const fx = new FX(scene, renderer);

// ---------------------------------------------------------------- layout
const COUNTER = 0.8;
const machine = new Machine(scene, S, V(-0.21, COUNTER, -0.38));
const jars = [];
const jarPos = [[0.13, -0.24], [0.27, -0.24], [0.2, -0.4], [0.34, -0.4]];
SUGARS.forEach((s, i) => {
  const j = makeJar(S, s); j.position.set(jarPos[i][0], COUNTER, jarPos[i][1]); scene.add(j); jars.push(j);
  j.rotation.y = i * 1.3;
});
const scoop = makeScoop(); scene.add(scoop);
const scoopHome = () => { const j = jars[state.lastJar ?? 0]; return j.position.clone().add(V(0.0, 0.135, 0)); };
const grains = new Grains(scene, 420);
const cup = makeStickCup(S); cup.position.set(0.43, COUNTER, -0.56); scene.add(cup);
const rack = makeRack(S, S.wood); rack.position.set(0.78, COUNTER, -0.28); rack.rotation.y = -0.25; scene.add(rack);
// saucer under the hachimaki and the rolled hachimaki
// crate is part of the stall; girl stands on it
const GIRL_HOME = V(0.02, 0.3, -0.76);

// rule signboard: painted wooden board with pictures (no letters)
function signBoard() {
  const t = canvasTex(1024, 512, (g, w, h) => {
    // aged painted board
    g.fillStyle = '#e8dcc4'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(120,90,60,${Math.random() * 0.06})`; g.fillRect(0, Math.random() * h, w, 1 + Math.random() * 3); }
    const ink = (c, lw = 10) => { g.strokeStyle = c; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'; };
    // 1: scoop of pink sugar
    g.save(); g.translate(130, 270);
    g.fillStyle = '#e8829f'; g.beginPath(); g.ellipse(0, -10, 70, 36, 0, Math.PI, 0); g.fill();
    for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(-60 + Math.random() * 120, -40 + Math.random() * 30, 4, 4); }
    ink('#6a6e74', 12); g.beginPath(); g.ellipse(0, -10, 74, 40, 0, 0, Math.PI); g.stroke();
    ink('#7a5232', 14); g.beginPath(); g.moveTo(70, -10); g.lineTo(150, -70); g.stroke();
    g.restore();
    // arrow
    const arrow = (x) => { ink('#b03a2e', 12); g.beginPath(); g.moveTo(x, 260); g.lineTo(x + 70, 260); g.moveTo(x + 45, 235); g.lineTo(x + 72, 260); g.lineTo(x + 45, 285); g.stroke(); };
    arrow(240);
    // 2: machine with spinning threads
    g.save(); g.translate(450, 300);
    ink('#6a6e74', 12); g.beginPath(); g.moveTo(-100, -60); g.quadraticCurveTo(-100, 40, 0, 40); g.quadraticCurveTo(100, 40, 100, -60); g.stroke();
    g.fillStyle = '#8a8f96'; g.fillRect(-90, 50, 180, 50);
    ink('rgba(232,130,159,0.8)', 4); for (let i = 0; i < 14; i++) { g.beginPath(); g.arc(0, -10, 30 + i * 4, -2.6 + i * 0.1, -0.5 + i * 0.07); g.stroke(); }
    g.restore();
    arrow(580);
    // 3: big cotton candy on a stick next to a smiling face
    g.save(); g.translate(800, 220);
    ink('#c9a36a', 12); g.beginPath(); g.moveTo(0, 60); g.lineTo(0, 230); g.stroke();
    for (let i = 0; i < 90; i++) { const a = Math.random() * Math.PI * 2, r = Math.random() * 95; g.fillStyle = `rgba(${230 + Math.random() * 20 | 0},${140 + Math.random() * 50 | 0},${170 + Math.random() * 40 | 0},0.35)`; g.beginPath(); g.arc(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.75, 22 + Math.random() * 18, 0, 7); g.fill(); }
    g.restore();
    g.save(); g.translate(930, 330);
    g.fillStyle = '#f2c9a8'; g.beginPath(); g.arc(0, 0, 55, 0, 7); g.fill();
    ink('#3a2418', 8); g.beginPath(); g.arc(-20, -8, 7, Math.PI, 0); g.stroke(); g.beginPath(); g.arc(20, -8, 7, Math.PI, 0); g.stroke();
    g.beginPath(); g.arc(0, 12, 22, 0.2, Math.PI - 0.2); g.stroke();
    g.fillStyle = '#2b1810'; g.beginPath(); g.arc(0, -25, 56, Math.PI * 1.05, Math.PI * 1.95); g.fill();
    g.restore();
    // painted border
    ink('#7a3a22', 16); g.strokeRect(14, 14, w - 28, h - 28);
  });
  const grp = new THREE.Group();
  const board = woodBox(0.62, 0.32, 0.02, new THREE.MeshPhysicalMaterial({ ...pbr('wood', 0.6), roughness: 1 }), 0.006, 1.4);
  grp.add(board);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.29), new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, normalMap: tex('wood_n', 0.6), normalScale: new THREE.Vector2(0.6, 0.6) }));
  face.position.z = 0.0105; grp.add(face);
  const cord = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.003, 6, 24, Math.PI), new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.9 }));
  cord.position.y = 0.16; grp.add(cord);
  grp.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return grp;
}
const sign = signBoard(); sign.position.set(-1.0, 1.9, 0.2); sign.rotation.set(0, 0.15, 0.03); scene.add(sign);

// ---------------------------------------------------------------- people
const girl = new Human('girl', { top: { kind: 'tshirt', color: 0xffffff }, bottom: { kind: 'pants', color: 0xffffff, shorts: true } });
girl.root.position.copy(GIRL_HOME); scene.add(girl.root);
const happiMat = clothMat('happi', 0xffffff, 1.35);
const collarMat = new THREE.MeshPhysicalMaterial({ color: 0xa3262b, ...pbr('tshirt', [1, 8]), roughness: 1, sheen: 0.6, sheenColor: new THREE.Color(0.8, 0.3, 0.3) });
const sashMat = clothMat('tshirt', 0x1c2442, 4);
const gHappi = girl.buildHappi(happiMat, collarMat, sashMat); gHappi.grp.visible = false; gHappi.sleeves.forEach(s => s.visible = false);
const gHachi = girl.buildHachimaki(); gHachi.visible = false;

const papa = new Human('papa', { top: { kind: 'happi', color: 0xffffff, rep: 2.6 }, bottom: { kind: 'pants', color: 0x6a6460, shoe: 0x2a2420 } });
const pHappiCollar = new THREE.MeshPhysicalMaterial({ color: 0xa3262b, roughness: 1, sheen: 0.5 });
papa.buildHappi(clothMat('happi', 0xffffff, 2.6), pHappiCollar, clothMat('tshirt', 0x1c2442, 4));
papa.buildHachimaki();
const PAPA_HOME = V(-0.92, 0, -0.95);
papa.root.position.copy(PAPA_HOME); papa.root.rotation.y = 0.35; scene.add(papa.root);
// uchiwa (round paper fan) for papa, and a wet towel
function makeUchiwa() {
  const g = new THREE.Group();
  const t = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#f1ebe0'; c.fillRect(0, 0, w, h);
    // goldfish-free simple pattern: indigo waves at the bottom, red circle sun
    c.fillStyle = '#c03a30'; c.beginPath(); c.arc(w * 0.62, h * 0.38, 46, 0, 7); c.fill();
    c.strokeStyle = '#25407a'; c.lineWidth = 9;
    for (let i = 0; i < 4; i++) { c.beginPath(); for (let x = 0; x <= w; x += 8) c.lineTo(x, h * 0.7 + i * 16 + Math.sin(x * 0.05 + i) * 8); c.stroke(); }
    c.strokeStyle = 'rgba(120,90,60,0.35)'; c.lineWidth = 2; for (let i = 0; i < 26; i++) { c.beginPath(); c.moveTo(w / 2, h); c.lineTo(i / 25 * w, 0); c.stroke(); }
  });
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.12, 40), new THREE.MeshStandardMaterial({ map: t, side: THREE.DoubleSide, roughness: 0.9 }));
  face.scale.set(1, 0.92, 1); face.position.y = 0.17; g.add(face);
  const h = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.007, 0.13, 10), new THREE.MeshStandardMaterial({ ...pbr('wood', [0.1, 1]), color: 0xd9b88a, roughness: 1 }));
  h.position.y = 0.04; g.add(h);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
const uchiwa = makeUchiwa(); uchiwa.visible = false; scene.add(uchiwa);
const towel = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.025, 0.06, 6, 2, 3), new THREE.MeshPhysicalMaterial({ ...pbr('tshirt', 1.5), color: 0xf4f1ea, roughness: 0.6, clearcoat: 0.6, clearcoatRoughness: 0.2 }));
towel.visible = false; scene.add(towel);

// customers
const customers = [
  { kind: 'boy', opts: { top: { kind: 'cloth3', color: 0xffffff }, bottom: { kind: 'pants', color: 0x8a8070, shorts: true, shoe: 0x2a4a7a } }, want: ['pink'], big: false },
  { kind: 'grandma', opts: { top: { kind: 'cloth2', color: 0xd8d0c4, longSleeve: true }, bottom: { kind: 'pants', color: 0x6a5a5a, skirt: true, len: 0.3 } }, want: ['blue', 'pink'], big: true },
  { kind: 'mama', opts: { top: { kind: 'tshirt', color: 0xc9d6c0 }, bottom: { kind: 'pants', color: 0x8090a8, skirt: true, len: 0.35 } }, want: ['green', 'yellow'], big: true },
];
const CUST_SPOT = V(-0.75, 0, 0.42);
customers.forEach((c, i) => {
  c.h = new Human(c.kind, { ...c.opts, seed: i + 3 });
  c.h.root.visible = false; scene.add(c.h.root);
});

// ---------------------------------------------------------------- the working stick + candy
function newStick() {
  const o = new THREE.Group();
  const stick = makeStick(); o.add(stick);
  const candy = new Candy({ seed: Math.random() * 1000 });
  candy.group.position.y = 0.012;
  o.add(candy.group);
  scene.add(o);
  return { o, stick, candy, tip: V(), handle: V(), spin: 0 };
}
let work = null; // current stick

// display candies in rack
const displays = [];
function plantInRack(w) {
  const slots = rack.userData.slots;
  const idx = displays.length % slots.length;
  if (displays[idx]) { scene.remove(displays[idx].o); }
  const p = slots[idx].clone().applyMatrix4(rack.matrixWorld);
  const target = { o: w.o, from: w.o.position.clone(), fromQ: w.o.quaternion.clone(), to: p, t: 0 };
  displays[idx] = w;
  anims.push({ dur: 0.9, f: (k) => {
    const e = ease(k);
    w.o.position.lerpVectors(target.from, target.to.clone().add(V(0, 0.27 + Math.sin(k * Math.PI) * 0.15, 0)), e);
    w.o.quaternion.slerpQuaternions(target.fromQ, new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, 0)), e);
  }, done: () => { sound.pop(); fx.sparkle(w.o.position.clone().add(V(0, 0.08, 0)), 10); } });
}

// ---------------------------------------------------------------- thought bubble
function makeBubble() {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, emissive: 0xfff4e8, emissiveIntensity: 0.55, transparent: true, opacity: 0.92 });
  const parts = [[0, 0, 0, 0.13], [0.1, 0.03, -0.02, 0.09], [-0.1, 0.02, -0.02, 0.095], [0.05, 0.09, -0.03, 0.09], [-0.06, 0.09, -0.03, 0.085], [0.0, -0.07, -0.02, 0.09]];
  for (const [x, y, z, r] of parts) { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), m); s.position.set(x, y, z - 0.06); s.scale.z = 0.35; g.add(s); }
  for (const [x, y, r] of [[-0.12, -0.17, 0.025], [-0.17, -0.25, 0.016]]) { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 10), m); s.position.set(x, y, -0.06); g.add(s); }
  g.userData.mat = m;
  return g;
}
const bubble = makeBubble(); bubble.visible = false; scene.add(bubble);
let bubbleCandy = null;
function setBubbleOrder(c) {
  if (bubbleCandy) { bubble.remove(bubbleCandy.o); }
  const o = new THREE.Group();
  const cd = new Candy({ seed: 7, strands: 500 });
  const cols = c.want.map(k => SUGARS.find(s => s.key === k));
  // build the ordered candy by real deposition, layer by layer
  const total = c.big ? 0.0105 : 0.0034;
  const dirs = [V(1, 0, 0), V(0, 0, 1), V(-1, 0, 0), V(0, 0, -1), V(0, 1, 0), V(0, -1, 0)];
  cols.forEach((s, li) => { for (let k = 0; k < 24; k++) cd.deposit(dirs[k % 6].clone().add(V(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.6)).normalize(), total / cols.length / 24, s.fluff, 1.1, s.key); });
  cd.update();
  const st = makeStick(); st.scale.set(1, 0.55, 1); st.position.y = -0.17; o.add(st);
  o.add(cd.group); cd.group.position.y = 0.0;
  o.scale.setScalar(c.big ? 0.62 : 0.62);
  o.position.set(0, -0.01, 0);
  bubble.add(o);
  bubbleCandy = { o, cd };
}

// ---------------------------------------------------------------- happi on the hook, hachimaki on the counter
const hookHappi = (() => {
  const g = new THREE.Group();
  const shape = new THREE.Mesh(roundedBox(0.36, 0.34, 0.03, 0.012), happiMat);
  shape.geometry.attributes.uv.array.forEach((v, i, a) => { a[i] = v * 2.4; });
  g.add(shape);
  const sl = new THREE.Mesh(roundedBox(0.58, 0.16, 0.028, 0.012), happiMat); sl.position.y = 0.09; g.add(sl);
  const col = new THREE.Mesh(roundedBox(0.04, 0.3, 0.034, 0.008), collarMat); col.position.set(-0.03, -0.01, 0.002); col.rotation.z = 0.2; g.add(col);
  const col2 = col.clone(); col2.position.x = 0.03; col2.rotation.z = -0.2; g.add(col2);
  g.position.copy(S.hookPos).add(V(-0.02, -0.2, 0.02)); g.rotation.set(0.05, -Math.PI / 2 + 0.25, 0.05);
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(g);
  return g;
})();
const rolledHachi = (() => {
  const g = new THREE.Group();
  const m = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, roughness: 0.85, sheen: 0.8, sheenColor: new THREE.Color(1, 0.9, 0.85), vertexColors: true, normalMap: tex('tshirt_n', 3) });
  const tg = new THREE.TorusGeometry(0.045, 0.012, 14, 48);
  const col = new Float32Array(tg.attributes.position.count * 3);
  const uv = tg.attributes.uv;
  for (let i = 0; i < uv.count; i++) { const t = (uv.getX(i) * 12 + uv.getY(i)) % 1; const r = t < 0.5; col[i * 3] = r ? 0.62 : 0.93; col[i * 3 + 1] = r ? 0.08 : 0.9; col[i * 3 + 2] = r ? 0.1 : 0.85; }
  tg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const t1 = new THREE.Mesh(tg, m); t1.rotation.x = Math.PI / 2; t1.position.y = 0.012; g.add(t1);
  const t2 = new THREE.Mesh(tg, m); t2.rotation.x = Math.PI / 2; t2.position.y = 0.035; t2.scale.setScalar(0.85); g.add(t2);
  const cs = contactShadow(S, 0.16, 0.16, 0.5); cs.position.y = 0.001; g.add(cs);
  g.position.set(0.5, COUNTER, -0.5);
  g.traverse(o => { if (o.isMesh && o !== cs) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(g);
  return g;
})();

// ---------------------------------------------------------------- camera shots
const LENS = 38; // mm (35mm equivalent) on the long side
const shots = {
  dress: { t: V(0.66, 1.3, -0.42), w: 0.68, h: 0.5, dir: V(0.12, 0.12, 1) },
  make: { t: V(-0.03, 1.08, -0.45), w: 0.52, h: 0.4, dir: V(0.06, 0.45, 1) },
  lift: { t: V(-0.08, 1.33, -0.68), w: 0.32, h: 0.28, dir: V(0.1, 0.1, 1) },
  serve: { t: V(-0.33, 1.2, -0.12), w: 0.64, h: 0.46, dir: V(0.25, 0.1, 1) },
  blunder: { t: V(-0.42, 1.42, -0.55), w: 0.42, h: 0.4, dir: V(0.25, 0.08, 1) },
  fire: { t: V(-0.05, 2.3, -1.2), w: 0.85, h: 1.9, dir: V(0.0, -0.42, 1) },
};
const cam = { pos: V(0.6, 1.5, 2.6), look: V(0, 1.2, 0), tPos: V(), tLook: V(), shot: null, sp: 1.6 };
function frameShot(sh) {
  const aspect = camera.aspect;
  const longFov = 2 * Math.atan(18 / LENS);
  let vfov, hfov;
  if (aspect < 1) { vfov = longFov; hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect); }
  else { hfov = longFov; vfov = 2 * Math.atan(Math.tan(hfov / 2) / aspect); }
  camera.fov = THREE.MathUtils.radToDeg(vfov); camera.updateProjectionMatrix();
  const d = Math.max(sh.h / Math.tan(vfov / 2), sh.w / Math.tan(hfov / 2));
  const dir = sh.dir.clone().normalize();
  return { pos: sh.t.clone().addScaledVector(dir, d), look: sh.t.clone() };
}
function setShot(name, speed = 1.6) {
  cam.shot = name; cam.sp = speed;
}
function updateCamera(dt, t) {
  const f = frameShot(shots[cam.shot]);
  const k = 1 - Math.exp(-dt * cam.sp);
  cam.pos.lerp(f.pos, k); cam.look.lerp(f.look, k);
  // handheld micro-drift (documentary feel), tiny
  camera.position.copy(cam.pos).add(V(Math.sin(t * 0.31) * 0.004, Math.sin(t * 0.43) * 0.003, 0));
  camera.lookAt(cam.look);
}

// ---------------------------------------------------------------- interaction
const raycaster = new THREE.Raycaster();
const ptr = { down: false, x: 0, y: 0, ndc: new THREE.Vector2(), id: null, lastDown: 0, target: null, moved: 0 };
const targets = []; // {name, objs:[meshes for raycast], enabled:()=>bool, tap:fn, glow:[materials], pos:()=>V}
function addTarget(o) { targets.push(o); return o; }
const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
function proxy(parent, r, pos = V(), scale = V(1, 1, 1)) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), proxyMat); m.position.copy(pos); m.scale.copy(scale); parent.add(m); return m;
}
function setNdc(e) {
  const r = canvas.getBoundingClientRect();
  ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top;
  ptr.ndc.set(ptr.x / r.width * 2 - 1, -(ptr.y / r.height) * 2 + 1);
}
function pick() {
  raycaster.setFromCamera(ptr.ndc, camera);
  let best = null, bd = Infinity;
  for (const t of targets) {
    if (!t.enabled()) continue;
    const hits = raycaster.intersectObjects(t.objs, true);
    if (hits.length && hits[0].distance < bd) { bd = hits[0].distance; best = t; }
  }
  // generous fallback: nearest enabled target in screen space within 9% of the screen
  if (!best) {
    let bs = 0.09;
    for (const t of targets) {
      if (!t.enabled() || !t.pos) continue;
      const p = t.pos().project(camera);
      const dd = Math.hypot((p.x - ptr.ndc.x) * camera.aspect, p.y - ptr.ndc.y) / 2;
      if (dd < bs) { bs = dd; best = t; }
    }
  }
  return best;
}
canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  sound.unlock();
  setNdc(e); ptr.down = true; ptr.id = e.pointerId; ptr.moved = 0; ptr.lastDown = simT; idle = 0;
  try { canvas.setPointerCapture(e.pointerId); } catch (_) { }
  const t = pick();
  ptr.target = t;
  if (t) { t.tap && t.tap(); return; }
  // drag on the stick when it is in the bowl (anywhere on screen works for small hands)
  if (state.stickIn && state.windOK) { ptr.target = WIND; }
  else if (state.scene === 3) launchAt(ptr.ndc);
});
canvas.addEventListener('pointermove', (e) => {
  if (!ptr.down || e.pointerId !== ptr.id) return;
  const ox = ptr.x, oy = ptr.y; setNdc(e); ptr.moved += Math.hypot(ptr.x - ox, ptr.y - oy); idle = 0;
  if (ptr.target && ptr.target.drag) ptr.target.drag();
});
const up = (e) => { if (e.pointerId !== ptr.id) return; ptr.down = false; if (ptr.target && ptr.target.release) ptr.target.release(); ptr.target = null; };
canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
document.addEventListener('gesturestart', e => e.preventDefault());

// winding drag: map pointer to a horizontal plane inside the bowl
const WIND = { drag() { }, release() { } };
const bowlPlane = new THREE.Plane(V(0, 1, 0), -(COUNTER + machine.bowl.y0 + 0.075));
function pointerOnBowl() {
  raycaster.setFromCamera(ptr.ndc, camera);
  const p = V();
  if (!raycaster.ray.intersectPlane(bowlPlane, p)) return null;
  const c = machine.bowlCenter(V()); c.y = p.y;
  const d = p.clone().sub(c); const len = d.length();
  const maxR = 0.205;
  if (len > maxR) d.multiplyScalar(maxR / len);
  return c.add(d);
}

// ---------------------------------------------------------------- game state
const state = {
  scene: 0, dressed: { happi: false, hachi: false }, busy: false, stickIn: false, windOK: false,
  lastJar: 0, customer: -1, blunderDone: false, served: 0, goalR: 0.105, made: 0,
};
const anims = []; // {dur, f(k), done, t}
const seq = [];   // timeline steps
function after(sec, fn) { anims.push({ dur: sec, f: () => { }, done: fn }); }
let idle = 0;

// ---- dress up
const happiT = addTarget({ name: 'happi', objs: [proxy(hookHappi, 0.24)], enabled: () => state.scene === 0 && !state.dressed.happi && !state.busy, glow: [happiMat], pos: () => hookHappi.getWorldPosition(V()),
  tap() {
    state.busy = true; sound.cloth(); state.dressed.happi = true;
    const from = hookHappi.position.clone(), fq = hookHappi.quaternion.clone();
    const to = girl.root.position.clone().add(V(0, 0.85, 0.05));
    girl.setExpr('wow', 0.8); girl.lookAt(hookHappi.position);
    anims.push({ dur: 0.75, f: k => { const e = ease(k); hookHappi.position.lerpVectors(from, to, e).add(V(0, Math.sin(k * Math.PI) * 0.2, 0)); hookHappi.rotation.y += 0.05; hookHappi.scale.setScalar(1 - e * 0.5); },
      done: () => {
        hookHappi.visible = false; gHappi.grp.visible = true; gHappi.sleeves.forEach(s => s.visible = true);
        popScale(gHappi.grp, 0.4); gHappi.sleeves.forEach(s => popScale(s, 0.4));
        fx.sparkle(girl.root.position.clone().add(V(0, 0.85, 0.1)), 18); sound.yay(); girl.setExpr('happy', 1.6); girl.hop = 0;
        hopOnce(girl); state.busy = false; checkDressed();
      } });
  } });
const hachiT = addTarget({ name: 'hachi', objs: [proxy(rolledHachi, 0.1)], enabled: () => state.scene === 0 && !state.dressed.hachi && !state.busy, glow: [rolledHachi.children[0].material], pos: () => rolledHachi.getWorldPosition(V()).add(V(0, 0.03, 0)),
  tap() {
    state.busy = true; sound.cloth(); state.dressed.hachi = true;
    const from = rolledHachi.position.clone();
    girl.lookAt(rolledHachi.position);
    anims.push({ dur: 0.7, f: k => { const e = ease(k); const to = girl.head.getWorldPosition(V()).add(V(0, 0.08, 0)); rolledHachi.position.lerpVectors(from, to, e).add(V(0, Math.sin(k * Math.PI) * 0.15, 0)); rolledHachi.rotation.z += 0.2; },
      done: () => {
        rolledHachi.visible = false; gHachi.visible = true; popScale(gHachi, 0.35);
        fx.sparkle(girl.head.getWorldPosition(V()).add(V(0, 0.1, 0)), 16); sound.yay(); girl.setExpr('laugh', 1.4); hopOnce(girl);
        state.busy = false; checkDressed();
      } });
  } });
function popScale(o, d) { const s0 = o.scale.clone(); anims.push({ dur: d, f: k => { const s = k < 0.6 ? lerp(0.2, 1.12, k / 0.6) : lerp(1.12, 1, (k - 0.6) / 0.4); o.scale.copy(s0).multiplyScalar(s); } }); }
function hopOnce(h, height = 0.035, dur = 0.45) { anims.push({ dur, f: k => { h.hop = Math.sin(k * Math.PI) * height; }, done: () => h.hop = 0 }); }

let lanternsOn = 0;
function setLanterns(v) {
  lanternsOn = v;
  S.lanterns.forEach((l, i) => { const on = clamp(v * S.lanterns.length - i, 0, 1); l.userData.mat.emissiveIntensity = lerp(0.12, 1.6, on); });
  L.lan.forEach(l => l.intensity = lerp(0.4, 3.2, v));
}
setLanterns(0);
function checkDressed() {
  if (!(state.dressed.happi && state.dressed.hachi)) return;
  state.busy = true;
  // lanterns light up one by one with a taiko beat: the stall opens
  S.lanterns.forEach((l, i) => after(0.5 + i * 0.28, () => { sound.taiko(0, 0.8); setLanterns((i + 1) / S.lanterns.length); fx.sparkle(l.getWorldPosition(V()), 6, new THREE.Color(1, 0.7, 0.4), 0.2); }));
  after(0.5 + S.lanterns.length * 0.28 + 0.4, () => { girl.setExpr('laugh', 1.5); sound.chime(); papa.setExpr('happy', 1.5); hopOnce(girl, 0.05, 0.5); });
  after(0.5 + S.lanterns.length * 0.28 + 1.6, () => { startScene1(); });
}

// ---- sugar jars
jars.forEach((j, i) => {
  addTarget({ name: 'jar' + i, objs: [proxy(j, 0.085, V(0, 0.08, 0), V(1, 1.2, 1))], enabled: () => state.scene >= 1 && state.makeOK && !state.scooping, glow: [j.userData.fillMat],
    pos: () => j.position.clone().add(V(0, 0.1, 0)), tap: () => scoopSugar(i) });
});
scoop.position.copy(scoopHome()); scoop.rotation.set(0, 0, -0.9);
function scoopSugar(i) {
  const j = jars[i]; const s = j.userData.sugar;
  state.makeHold = 3;
  state.scooping = true; state.lastJar = i;
  sound.tap();
  const heap = scoop.userData.heap;
  const p0 = scoop.position.clone();
  const inJar = j.position.clone().add(V(0, 0.11, 0));
  const above = j.position.clone().add(V(0, 0.24, 0));
  const head = machine.pos.clone().add(V(0.0, machine.bowl.y0 + 0.17, 0.0));
  const L = girl.arms[0];
  girl.setExpr('focus'); girl.lookAt(j.position);
  const r0 = scoop.rotation.clone();
  const steps = [
    { d: 0.35, f: k => { scoop.position.lerpVectors(p0, above, ease(k)); } },
    { d: 0.3, f: k => { scoop.position.lerpVectors(above, inJar, ease(k)); scoop.rotation.z = lerp(r0.z, -0.4, k); }, end: () => { heap.visible = true; scoop.userData.grainM.color.copy(s.col); sound.pour(); j.userData.fillMat.emissiveIntensity = 0; } },
    { d: 0.3, f: k => { scoop.position.lerpVectors(inJar, above, ease(k)); scoop.rotation.z = lerp(-0.4, -0.15, k); } },
    { d: 0.55, f: k => { const e = ease(k); scoop.position.lerpVectors(above, head, e).add(V(0, Math.sin(k * Math.PI) * 0.08, 0)); girl.lookAt(machine.headG.getWorldPosition(V())); } },
    { d: 0.6, f: k => { scoop.rotation.x = lerp(0, -1.9, ease(k)); if (k > 0.3) for (let n = 0; n < 7; n++) grains.emit(scoop.localToWorld(V(-0.018, 0.0, (Math.random() - 0.5) * 0.02)), V(0, -0.2, 0), s.col, COUNTER + machine.bowl.y0 + 0.07, 0.02); if (k > 0.5) heap.visible = false; }, end: () => { sound.pour(); } },
    { d: 0.2, f: () => { } , end: () => { machine.addSugar(s, 0.0034); sound.sizzle(); state.scooping = false; girl.setExpr('happy', 0.8); afterPour(); } },
    { d: 0.6, f: k => { scoop.rotation.x = lerp(-1.9, 0, ease(k)); scoop.position.lerpVectors(head, scoopHome(), ease(k)); scoop.rotation.z = lerp(-0.15, -0.9, k); } },
  ];
  runSteps(steps, () => { L.ikW = 0; });
  // the girl's left hand holds the scoop handle throughout
  state.scoopHand = true;
  anims.push({ dur: 3.0, f: () => { }, done: () => { state.scoopHand = false; } });
}
function runSteps(steps, done) {
  let i = 0;
  const next = () => {
    if (i >= steps.length) { done && done(); return; }
    const s = steps[i++];
    anims.push({ dur: s.d, f: s.f, done: () => { s.end && s.end(); next(); } });
  };
  next();
}
function afterPour() {
  if (!work) { /* hint will move to the stick cup */ }
}

// ---- stick cup
addTarget({ name: 'stick', objs: [proxy(cup, 0.1, V(0, 0.12, 0), V(1, 1.6, 1))], enabled: () => state.scene >= 1 && state.makeOK && !work && !state.busy, glow: cup.userData.sticks.map(s => s.material),
  pos: () => cup.position.clone().add(V(0, 0.22, 0)),
  tap() {
    sound.tap();
    work = newStick();
    const from = cup.position.clone().add(V(0, 0.12, 0));
    const to = pointerOnBowlDefault();
    work.tip.copy(from);
    state.busy = true;
    anims.push({ dur: 0.6, f: k => { work.tip.lerpVectors(from, to, ease(k)).add(V(0, Math.sin(k * Math.PI) * 0.15, 0)); },
      done: () => { state.busy = false; state.stickIn = true; state.windOK = true; girl.setExpr('focus'); } });
  } });
function pointerOnBowlDefault() { return machine.bowlCenter(V()).add(V(0.12, -0.005, 0.08)); }

// ---- customers (scene 2)
const custT = addTarget({ name: 'customer', objs: [], enabled: () => state.scene === 2 && state.customer >= 0 && work && work.candy.radius > 0.045 && !state.busy && state.custReady && cam.shot === 'serve',
  glow: [], pos: () => customers[state.customer].h.head.getWorldPosition(V()).add(V(0, -0.15, 0)), tap: () => serve() });
customers.forEach(c => { custT.objs.push(proxy(c.h.root, 0.22, V(0, c.h.P.H * 0.72, 0), V(1, 1.7, 1))); });

// ---- papa's face fluff (after the blunder) can be picked off
let faceFluff = null;
addTarget({ name: 'papaFace', objs: [proxy(papa.head, 0.12)], enabled: () => !!faceFluff && faceFluff.left > 0, glow: [], pos: () => papa.head.getWorldPosition(V()).add(V(0, -0.02, 0.1)),
  tap() {
    const f = faceFluff; f.left--;
    raycaster.setFromCamera(ptr.ndc, camera);
    // remove the fluff where it was touched (shrink that side of the stuck fluff)
    const hit = raycaster.intersectObject(f.c.core, false)[0];
    const d = hit ? f.c.group.worldToLocal(hit.point.clone()).normalize() : V(Math.random() - 0.5, Math.random() - 0.5, 1).normalize();
    f.c.squash(d, 0.75, 0.9); f.c.squash(d.clone().negate(), 0.2, 0.6);
    fx.puff(f.c.group.getWorldPosition(V()), SUGARS[0].fluff, 8); sound.pop();
    if (f.left <= 0) { anims.push({ dur: 0.4, f: k => f.c.group.scale.setScalar(1 - k), done: () => { papa.head.remove(f.c.group); faceFluff = null; papa.setExpr('laugh', 1.6); sound.yay(); } }); }
    else papa.setExpr('squeeze', 0.5);
  } });

// ---- rack (scene 3: plant finished candy)
addTarget({ name: 'rack', objs: [proxy(rack, 0.2, V(0, 0.1, 0), V(1.8, 1, 0.8))], enabled: () => state.scene === 3 && work && work.candy.radius > 0.05 && !state.busy, glow: [S.wood], pos: () => rack.position.clone().add(V(0, 0.12, 0)),
  tap() {
    finishToRack();
  } });

// ---------------------------------------------------------------- scenes
function startScene1() {
  state.scene = 1; state.busy = false; state.makeOK = true;
  setShot('make', 1.2);
  girl.setExpr('smile');
}

function finishFirstCandy() {
  // girl lifts the cloud next to her face: before (spoon of grains) -> after (cloud bigger than her face)
  state.busy = true; state.windOK = false; state.stickIn = false;
  setShot('lift', 1.4);
  const from = work.tip.clone();
  const to = girl.head.getWorldPosition(V()).add(V(-0.22, 0.0, 0.1));
  anims.push({ dur: 1.0, f: k => { work.tip.lerpVectors(from, to, ease(k)); }, done: () => {
    girl.setExpr('laugh', 2.5); sound.yay(); fx.sparkle(work.tip.clone().add(V(0, 0.12, 0)), 24, new THREE.Color(1, 0.85, 0.6), 0.2); hopOnce(girl, 0.04, 0.5);
    papa.setExpr('happy', 2); papa.lookAt(work.tip);
  } });
  after(3.4, () => { const w = work; work = null; plantInRack(w); state.made++; });
  after(4.5, () => { state.busy = false; startScene2(); });
}

function startScene2() {
  state.scene = 2; state.customer = -1; state.makeOK = true;
  setShot('serve', 1.0);
  nextCustomer();
}
function nextCustomer() {
  state.customer++;
  if (state.customer >= customers.length) { startScene3(); return; }
  const c = customers[state.customer];
  const h = c.h; h.root.visible = true;
  const start = V(-2.6, 0, 1.3);
  h.root.position.copy(start); h.walking = true;
  state.custReady = false;
  h.root.rotation.y = Math.atan2(CUST_SPOT.x - start.x, CUST_SPOT.z - start.z);
  anims.push({ dur: 2.0, f: k => { h.root.position.lerpVectors(start, CUST_SPOT, k); }, done: () => {
    h.walking = false;
    // stand turned between the girl and the street (so we see the face)
    const face = Math.atan2(girl.root.position.x - CUST_SPOT.x, girl.root.position.z - CUST_SPOT.z);
    const yaw0 = h.root.rotation.y; anims.push({ dur: 0.5, f: k => { h.root.rotation.y = lerp(yaw0, 0.95, ease(k)); } });
    h.lookAt(girl.head.getWorldPosition(V())); h.setExpr('smile');
    // thought bubble with the wanted cotton candy
    setBubbleOrder(c);
    bubble.visible = true; bubble.scale.setScalar(1); popScale(bubble, 0.5); sound.pop();
    state.custReady = true; state.showCust = 2.5;
    girl.lookAt(h.head.getWorldPosition(V())); girl.setExpr('smile');
  } });
}
function serve() {
  const c = customers[state.customer];
  if (state.customer === 0 && !state.blunderDone) { papaBlunder(); return; }
  state.busy = true; state.windOK = false; state.stickIn = false;
  const h = c.h;
  const w = work;
  const from = w.tip.clone();
  const handP = () => h.handPos(h.arms[1]);
  h.reach(h.arms[1], girl.root.position.clone().add(V(-0.3, 0.9, 0.5)), h.root.position.clone().add(V(0.4, 0.3, -0.5)), 1);
  anims.push({ dur: 1.0, f: k => { w.tip.lerpVectors(from, handP().add(V(0, 0.05, 0)), ease(k)); }, done: () => {
    // customer holds it now
    w.holder = h;
    judge(c, w);
  } });
}
function judge(c, w) {
  const keys = w.candy.colorKeys(0.18);
  const R = w.candy.radius;
  const sizeOK = c.big ? R > 0.09 : R < 0.105;
  const colOK = c.want.every(k => keys.includes(k)) && keys.every(k => c.want.includes(k));
  const h = c.h;
  bubble.visible = false;
  if (sizeOK && colOK) {
    h.setExpr('laugh', 2.2); sound.yay(); hopOnce(h, 0.06, 0.5); after(0.5, () => hopOnce(h, 0.05, 0.45));
    fx.sparkle(w.o.position.clone().add(V(0, 0.1, 0)), 24); girl.setExpr('laugh', 2); papa.setExpr('happy', 2);
  } else {
    // "huh?" then happy anyway
    h.setExpr('huh', 1.3); h.ex.tilt = 0.25; h.exT.tilt = 0.25; sound.huh();
    girl.setExpr('wow', 1.2);
    after(1.4, () => { h.exT.tilt = 0; h.setExpr('laugh', 1.8); sound.yay(); hopOnce(h, 0.05, 0.5); fx.sparkle(w.o.position.clone().add(V(0, 0.1, 0)), 16); girl.setExpr('happy', 1.5); });
  }
  after(3.2, () => {
    // walk away with it
    h.walking = true; h.lookAt(null); h.arms[1].ikW = 0.6;
    const p0 = h.root.position.clone(), p1 = V(-2.8, 0, 1.6);
    h.root.rotation.y = Math.atan2(p1.x - p0.x, p1.z - p0.z);
    anims.push({ dur: 2.0, f: k => { h.root.position.lerpVectors(p0, p1, k); h.reach(h.arms[1], h.root.localToWorld(V(-0.12, h.P.H * 0.55, 0.25)), h.root.localToWorld(V(-0.3, h.P.H * 0.4, -0.3)), 0.8); }, done: () => {
      h.root.visible = false; h.walking = false; scene.remove(w.o); work = null; state.busy = false; state.served++;
      nextCustomer();
    } });
  });
}

// papa: "leave it to me!" -> fans himself -> fluff blows onto his face -> wipes with a wet towel -> candy shrinks
function papaBlunder() {
  state.blunderDone = true; state.busy = true; state.windOK = false; state.stickIn = false;
  const w = work;
  setShot('blunder', 1.3);
  const P = papa;
  P.setExpr('proud'); P.walking = true;
  const p0 = P.root.position.clone(), p1 = V(-0.62, 0, -0.85);
  anims.push({ dur: 0.8, f: k => { P.root.position.lerpVectors(p0, p1, k); P.root.rotation.y = lerp(0.35, 0.5, k); }, done: () => { P.walking = false; } });
  // takes the stick
  after(0.9, () => { girl.setExpr('wow', 1.0); sound.tap(); w.holder = P; P.lookAt(w.o.position); });
  // fans himself with the uchiwa: it is a hot night
  after(1.6, () => { uchiwa.visible = true; P.setExpr('smile'); P.lookAt(camera.position); });
  let fan = 0;
  anims.push({ dur: 3.2, f: (k) => {
    if (k < 0.5) return;
    fan += 0.016 * 22;
    const hp = P.handPos(P.arms[0]);
    uchiwa.position.copy(hp); uchiwa.rotation.set(0.2 + Math.sin(fan) * 0.6, 0.6, -0.3);
    P.reach(P.arms[0], P.head.getWorldPosition(V()).add(V(0.22, -0.08 + Math.sin(fan) * 0.05, 0.12)), P.root.localToWorld(V(0.4, 1.0, -0.4)), 1);
    if (Math.random() < 0.08) sound.swish(0.6);
  } });
  // gust: the fluffy candy blows onto his face
  after(3.0, () => {
    sound.whoosh(); w.blowT = 0;
    const dir = w.candy.group.worldToLocal(P.head.getWorldPosition(V())).normalize();
    anims.push({ dur: 0.5, f: k => { w.candy.squash(dir, 0.05, 1.3); }, done: () => {
      sound.splat(); P.setExpr('squeeze'); girl.setExpr('wow', 1.4);
      fx.puff(P.head.getWorldPosition(V()).add(V(0, 0, 0.1)), SUGARS[0].fluff, 14);
      // stuck fluff on papa's face: a small piece of the same pink candy
      const c = new Candy({ seed: 3, strands: 400 });
      for (let i = 0; i < 18; i++) c.deposit(V(Math.random() - 0.5, Math.random() - 0.5, 1).normalize(), 0.000012, SUGARS[0].fluff, 1.2, 'pink');
      c.group.scale.set(0.9, 0.6, 0.35); c.group.position.set(0.018, -0.045, papa.hs.c * 1.0); c.update();
      papa.head.add(c.group);
      faceFluff = { c, left: 3 };
      // if nobody helps, papa rubs it off himself after a while (laughing)
      after(9, () => { if (faceFluff && faceFluff.c === c) { const f = faceFluff; f.left = 0; anims.push({ dur: 0.5, f: k => f.c.group.scale.multiplyScalar(0.9), done: () => { papa.head.remove(f.c.group); if (faceFluff === f) faceFluff = null; papa.setExpr('laugh', 1.4); } }); } });
      uchiwa.visible = false; P.arms[0].ikW = 0;
    } });
  });
  // wipes with a damp towel... onto the candy! (water melts the threads)
  after(4.4, () => {
    towel.visible = true; sound.drip();
    const cdir = w.candy.group.worldToLocal(P.handPos(P.arms[0])).normalize();
    let tt = 0;
    anims.push({ dur: 1.6, f: k => {
      tt += 0.016;
      const cp = w.o.localToWorld(V(0, 0.07, 0));
      const tp = cp.clone().add(V(0.05 + Math.sin(tt * 14) * 0.03, Math.cos(tt * 11) * 0.02, 0.06));
      towel.position.copy(tp); towel.rotation.set(0.3, 0.4, Math.sin(tt * 14) * 0.3);
      P.reach(P.arms[0], tp, P.root.localToWorld(V(0.4, 0.9, -0.3)), 1);
      const d = w.candy.group.worldToLocal(tp.clone()).normalize();
      w.candy.wetAt(d, 0.06, 0.62);
      if (Math.random() < 0.3) fx.droplets(tp, V(0, -0.5, 0.3), 2);
      if (Math.random() < 0.1) sound.drip();
    }, done: () => { towel.visible = false; P.arms[0].ikW = 0; sound.oops(); P.setExpr('sorry', 2.5); P.exT.tilt = -0.15; girl.setExpr('huh', 1.2); } });
  });
  // gives it back; the girl will fix it (wind more fresh fluff on top)
  after(6.6, () => {
    P.exT.tilt = 0;
    w.holder = null; const from = w.tip.clone(); const to = pointerOnBowlDefault();
    anims.push({ dur: 0.8, f: k => w.tip.lerpVectors(from, to, ease(k)), done: () => {
      state.stickIn = true; state.windOK = true; state.busy = false; girl.setExpr('focus'); setShot('make', 1.2);
      state.needRewind = w.candy.radius + 0.025;
    } });
    P.walking = true; const q0 = P.root.position.clone();
    anims.push({ dur: 0.9, f: k => P.root.position.lerpVectors(q0, PAPA_HOME, k), done: () => { P.walking = false; P.root.rotation.y = 0.35; P.lookAt(girl.head.getWorldPosition(V())); } });
  });
}

function startScene3() {
  state.scene = 3; state.busy = false; state.makeOK = true;
  setShot('fire', 0.8);
  sound.chime();
  girl.setExpr('wow', 2); girl.lookAt(V(0, 7, -8));
  papa.lookAt(V(0, 7, -8)); papa.setExpr('happy', 3);
  after(1.0, () => fireworks(2));
  state.autoFire = 2.5;
}
function fireworks(n = 1) {
  for (let i = 0; i < n; i++) setTimeout(() => {
    const x = (Math.random() - 0.5) * 10, y = 9.5 + Math.random() * 4, z = -12 - Math.random() * 3;
    const col = new THREE.Color().setHSL(Math.random(), 0.75, 0.6);
    fx.launch(V(x * 0.6, 2.5, z), V(x, y, z), col, L.flash, sound);
  }, i * 450);
}
function launchAt(ndc) {
  raycaster.setFromCamera(ndc, camera);
  const p = V(); raycaster.ray.intersectPlane(new THREE.Plane(V(0, 0, 1), 13), p);
  if (p.y < 8) p.y = 8 + Math.random() * 2;
  p.z = -13;
  fx.launch(V(p.x * 0.6, 2.5, -13), p, new THREE.Color().setHSL(Math.random(), 0.75, 0.6), L.flash, sound);
  girl.setExpr('happy', 1.2);
}
function finishToRack() {
  state.busy = true; state.windOK = false; state.stickIn = false;
  const w = work; work = null;
  plantInRack(w); state.made++;
  girl.setExpr('laugh', 1.5); sound.yay(); hopOnce(girl);
  after(1.0, () => { state.busy = false; fireworks(1); });
}

// ---------------------------------------------------------------- hint system (glow + white hand)
const hand = document.getElementById('hand');
function currentHint() {
  if (state.busy) return null;
  if (state.scene === 0) return !state.dressed.happi ? happiT : (!state.dressed.hachi ? hachiT : null);
  if (state.scene >= 1) {
    if (state.scene === 2 && work && state.custReady && custReady()) return custT;
    if (state.scene === 3 && work && work.candy.radius > 0.065 && !state.scooping) return targets.find(t => t.name === 'rack');
    if (machine.sugar <= 0.0002 && machine.webAmt < 0.0002 && !state.scooping) return targets.find(t => t.name === 'jar' + suggestJar());
    if (!work && !state.scooping) return targets.find(t => t.name === 'stick');
    if (work && state.stickIn) return WIND_HINT;
  }
  return null;
}
function custReady() {
  if (!work) return false;
  const c = customers[state.customer]; if (!c) return false;
  if (state.needRewind && work.candy.radius < state.needRewind) return false;
  const R = work.candy.radius;
  return c.big ? R > 0.095 : R > 0.065;
}
function suggestJar() {
  if (state.scene === 2 && state.customer >= 0) {
    const c = customers[state.customer];
    const have = work ? work.candy.colorKeys(0.18) : [];
    const need = c.want.find(k => !have.includes(k)) || c.want[0];
    return SUGARS.findIndex(s => s.key === need);
  }
  return state.lastJar;
}
const WIND_HINT = { name: 'wind', pos: () => machine.bowlCenter(V()).add(V(0.05, 0, 0.05)), circle: true, glow: [] };
let glowT = 0;
function updateHints(dt, t) {
  const h = currentHint();
  glowT += dt;
  const pulse = 0.5 + 0.5 * Math.sin(t * 4);
  for (const tg of targets) {
    const on = h === tg && tg.enabled();
    for (const m of (tg.glow || [])) {
      if (!m.emissive) continue;
      if (m.userData.e0 === undefined) { m.userData.e0 = m.emissiveIntensity; m.userData.ec = m.emissive.clone(); }
      if (on) { m.emissive.setRGB(1, 0.82, 0.55); m.emissiveIntensity = 0.08 + 0.22 * pulse; }
      else if (m.userData.e0 !== undefined && m !== S.wood) { m.emissive.copy(m.userData.ec); m.emissiveIntensity = m.userData.e0; }
      else if (m === S.wood) { m.emissive.setRGB(0, 0, 0); }
    }
  }
  // gentle wobble of the hinted object
  if (h && h.name && h.name.startsWith('jar')) { const j = jars[+h.name.slice(3)]; j.rotation.z = Math.sin(t * 6) * 0.03; }
  jars.forEach(j => { if (!h || h.name !== 'jar' + jars.indexOf(j)) j.rotation.z *= 0.9; });
  if (h === happiT) hookHappi.rotation.z = 0.05 + Math.sin(t * 3) * 0.04;
  if (h === custT) { const c = customers[state.customer]; c && (c.h.exT.smile = 0.7 + 0.3 * pulse); }
  // white hand after a few idle seconds
  idle += dt;
  if (h && idle > (state.scene === 0 ? 2.5 : 4.0) && h.pos) {
    const p = h.pos().project(camera);
    const r = canvas.getBoundingClientRect();
    let x = (p.x * 0.5 + 0.5) * r.width, y = (-p.y * 0.5 + 0.5) * r.height;
    let s = 1;
    if (h.circle) { const a = t * 3.2; x += Math.cos(a) * 46; y += Math.sin(a) * 22; }
    else { s = 1 - 0.12 * Math.max(0, Math.sin(t * 5)); }
    hand.style.opacity = Math.min(1, (idle - 2.5) * 2).toFixed(2);
    hand.style.transform = `translate(${x - 18}px, ${y - 6}px) scale(${s})`;
  } else hand.style.opacity = 0;
}

// ---------------------------------------------------------------- per-frame logic
const clock = new THREE.Clock();
let fpsAcc = 0, fpsN = 0, fpsT = 0;
let lastWindP = null, swishAcc = 0;
const tmpQ = new THREE.Quaternion();
let simT = 0;
function frame() {
  const dt = Math.min(clock.getDelta(), 1 / 20);
  step(dt);
  renderer.render(scene, camera);
  // adaptive resolution to keep >= 30 fps on phones
  fpsAcc += dt; fpsN++;
  if (fpsAcc > 2 && !Q.get('dpr')) {
    const avg = fpsAcc / fpsN; fpsAcc = 0; fpsN = 0;
    if (avg > 1 / 34 && DPR > 1) { DPR = Math.max(1, DPR - 0.25); renderer.setPixelRatio(DPR); resize(); }
    else if (avg < 1 / 55 && DPR < Math.min(2, window.devicePixelRatio || 1)) { DPR = Math.min(2, DPR + 0.25); renderer.setPixelRatio(DPR); resize(); }
  }
  requestAnimationFrame(frame);
}
function step(dt) {
  simT += dt;
  const t = simT;
  // animations
  for (let i = anims.length - 1; i >= 0; i--) {
    const a = anims[i]; a.t = (a.t || 0) + dt;
    const k = Math.min(1, a.t / a.dur);
    a.f(k);
    if (k >= 1) { anims.splice(i, 1); a.done && a.done(); }
  }
  machine.update(dt, t);
  sound.setHum(machine.spinRate);
  // steam/smoke wisps from the hot head
  if (machine.heat > 0.3 && Math.random() < dt * 6) fx.steam(machine.headG.getWorldPosition(V()).add(V(0, 0.09, 0)));
  grains.update(dt, (p) => { if (Math.random() < 0.05) fx.steam(p.pos); });

  // ---- winding: stick follows the finger inside the bowl
  if (work) {
    let sweep = 0;
    if (state.stickIn && state.windOK) {
      if (ptr.down && ptr.target === WIND) {
        const p = pointerOnBowl();
        if (p) {
          const prev = work.tip.clone();
          work.tip.lerp(p, 1 - Math.exp(-dt * 18));
          sweep = prev.distanceTo(work.tip);
          if (sweep > 0.0005) work.vel = work.tip.clone().sub(prev).normalize();
        }
      }
      // keep the tip inside the bowl
      const c = machine.bowlCenter(V()); c.y = work.tip.y;
      const d = work.tip.clone().sub(c); if (d.length() > 0.21) work.tip.copy(c.add(d.setLength(0.21)));
    }
    // stick orientation: tip in the bowl, handle toward the holder's hand
    const holder = work.holder || (state.scene >= 0 ? girl : null);
    let handleDir;
    if (work.holder && work.holder !== girl && work.holder.root.visible) {
      handleDir = V(0, -1, 0);
    } else {
      const sh = girl.arms[1].shoulder.getWorldPosition(V());
      handleDir = sh.add(V(0, 0.05, 0)).sub(work.tip).normalize();
      if (state.scene !== 0 && !state.stickIn) handleDir = V(0.25, -1, 0.1).normalize(); // held upright when lifted
    }
    if (work.holder && work.holder !== girl) {
      // the holder's hand carries the stick upright
      const hp = work.holder.handPos(work.holder === papa ? work.holder.arms[1] : work.holder.arms[1]);
      if (work.holder === papa) papa.reach(papa.arms[1], papa.root.localToWorld(V(-0.2, 1.05, 0.35)), papa.root.localToWorld(V(-0.5, 0.9, -0.3)), 1);
      work.tip.copy(hp).add(V(0, 0.24, 0));
      handleDir = V(0, -1, 0);
    }
    const up = handleDir;
    tmpQ.setFromUnitVectors(V(0, 1, 0), up);
    work.o.position.copy(work.tip); work.o.quaternion.copy(tmpQ);
    // spin (rolling the stick) and deposit threads
    if (sweep > 0) {
      work.spin += sweep * 38;
      swishAcc += sweep;
      if (swishAcc > 0.12) { swishAcc = 0; sound.swish(0.8); }
    }
    work.candy.group.rotation.y = work.spin;
    if (state.stickIn && state.windOK) {
      const vol = machine.collect(sweep, ptr.down && ptr.target === WIND);
      if (vol > 0) {
        const c = machine.bowlCenter(V()); c.y = work.tip.y;
        const out = work.tip.clone().sub(c); out.y = 0; if (out.lengthSq() < 1e-6) out.set(1, 0, 0); out.normalize();
        const wd = (work.vel || out).clone().multiplyScalar(0.7).add(out).add(V(0, -0.25, 0)).normalize();
        work.candy.group.updateWorldMatrix(true, false);
        const inv = work.candy.group.getWorldQuaternion(new THREE.Quaternion()).invert();
        const local = wd.applyQuaternion(inv);
        work.candy.deposit(local, vol, machine.webCol, 0.95, machine.webKey);
        if (Math.random() < 0.2) fx.sparkle(work.tip.clone().add(V(0, 0.05, 0)), 1, new THREE.Color(1, 0.9, 0.7), 0.1);
      }
      // girl reactions while making
      const R = work.candy.radius;
      if (R > 0.07 && !work.saidWow) { work.saidWow = true; girl.setExpr('wow', 1.0); sound.sparkle(); }
      if (state.scene === 1 && R > state.goalR && !state.busy) finishFirstCandy();
    }
    work.candy.update();
  }
  // displays (rack) update once
  for (const d of displays) d && d.candy.update();

  // ---- girl's arms: right = stick, left = scoop
  const gR = girl.arms[1], gL = girl.arms[0];
  if (work && (!work.holder || work.holder === girl)) {
    const grip = work.o.localToWorld(V(0, 0.27, 0));
    girl.reach(gR, grip, girl.root.localToWorld(V(-0.45, 0.65, -0.35)), 1); gR.grip = 1;
  } else { gR.ikW = 0; gR.grip = 0; }
  if (state.scoopHand) { const hp = scoop.localToWorld(V(0.13, 0.05, 0)); girl.reach(gL, hp, girl.root.localToWorld(V(0.5, 0.6, -0.3)), 1); gL.grip = 1; }
  else { gL.ikW = 0; gL.grip = 0; }
  // lean toward what she is doing
  const lean = (work && state.stickIn) || state.scoopHand ? 0.12 : 0.02;
  girl.body.rotation.x = lerp(girl.body.rotation.x, lean, 1 - Math.exp(-dt * 4));
  if (work && state.stickIn && !girl.exHold) girl.lookAt(work.o.localToWorld(V(0, 0.04, 0)));
  else if (!girl.look && state.scene >= 1) girl.lookAt(camera.position);
  if (state.scene === 0 && !state.busy && Math.sin(t * 0.5) > 0.6) girl.lookAt(camera.position);
  // papa idles, watching
  if (!state.busy && state.scene >= 1) { papa.lookAt(work ? work.o.position : girl.head.getWorldPosition(V())); }

  girl.update(dt, t); papa.update(dt, t);
  for (const c of customers) if (c.h.root.visible) c.h.update(dt, t);

  // automatic camera: making close-up vs. serving / fireworks wide shots
  if (state.scene === 2 && !state.busy) {
    const want = (!state.custReady || (work && custReady()) || state.showCust > 0) ? 'serve' : 'make';
    if (cam.shot !== want && cam.shot !== 'blunder') setShot(want, 1.3);
    state.showCust = (state.showCust || 0) - dt;
  }
  if (state.scene === 3 && !state.busy) {
    const making = state.scooping || (work && state.stickIn) || state.makeHold > 0;
    state.makeHold = (state.makeHold || 0) - dt;
    if (making) state.makeHold = 2.5;
    const want = making ? 'make' : 'fire';
    if (cam.shot !== want) setShot(want, want === 'fire' ? 0.8 : 1.3);
  }
  // thought bubble above the current customer (or floating near the stall while making)
  if (bubble.visible && state.customer >= 0) {
    const h = customers[state.customer].h;
    const hp = h.head.getWorldPosition(V());
    const nearCust = hp.add(V(0.12, 0.3 + Math.sin(t * 2) * 0.01, 0.05));
    const nearStall = V(-0.36, 1.5 + Math.sin(t * 2) * 0.01, -0.28);
    state.bubbleK = lerp(state.bubbleK || 0, cam.shot === 'make' ? 1 : 0, 1 - Math.exp(-dt * 3));
    bubble.position.lerpVectors(nearCust, nearStall, state.bubbleK);
    bubble.scale.setScalar(lerp(1, 0.8, state.bubbleK));
    bubble.quaternion.copy(camera.quaternion);
    if (bubbleCandy) { bubbleCandy.o.rotation.y = 0; bubbleCandy.cd.group.rotation.y = t * 0.8; }
  }
  // scene 3: periodic fireworks and their light on the scene
  if (state.scene === 3) {
    state.autoFire -= dt;
    if (state.autoFire <= 0) { state.autoFire = 3.5 + Math.random() * 2.5; fireworks(1 + (Math.random() < 0.4 ? 1 : 0)); }
  }
  L.flash.intensity *= Math.exp(-dt * 3.2);
  // lantern flicker (candle-like variation)
  if (lanternsOn > 0) L.lan.forEach((l, i) => l.intensity = 3.2 * lanternsOn * (0.94 + 0.06 * Math.sin(t * 7.3 + i * 2) * Math.sin(t * 3.1 + i)));
  fx.update(dt);
  updateHints(dt, t);
  updateCamera(dt, t);
}

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  camera.aspect = w / h; camera.updateProjectionMatrix();
  fx.glow.mat.uniforms.scale.value = fx.star.mat.uniforms.scale.value = fx.smoke.mat.uniforms.scale.value = h * DPR * 0.9;
}
window.addEventListener('resize', resize);
resize();
setShot('dress'); { const f = frameShot(shots.dress); cam.pos.copy(f.pos).add(V(0.2, 0.15, 0.8)); cam.look.copy(f.look); }
girl.setExpr('smile'); girl.lookAt(camera.position);
papa.setExpr('smile');

// debug / screenshot hooks
window.__game = { state, setShot, anims, girl, papa, machine, scoopSugar, jars, targets, work: () => work, customers, startScene1, startScene2, startScene3, nextCustomer, serve, finishFirstCandy, fireworks, setLanterns, checkDressed, gHappi, gHachi, hookHappi, rolledHachi,
  dress() { hookHappi.visible = false; rolledHachi.visible = false; gHappi.grp.visible = true; gHappi.sleeves.forEach(s => s.visible = true); gHachi.visible = true; state.dressed.happi = state.dressed.hachi = true; setLanterns(1); },
  newStick() { work = newStick(); work.tip.copy(pointerOnBowlDefault()); state.stickIn = true; state.windOK = true; return work; },
  grow(vol, key, n = 30) { const s = SUGARS.find(q => q.key === key); for (let i = 0; i < n; i++) { const a = Math.random() * 6.28; work.candy.deposit(V(Math.cos(a), (Math.random() - 0.5) * 0.6, Math.sin(a)).normalize(), vol / n, s.fluff, 0.95, key); } },
  ff(sec, dt = 1 / 30) { for (let i = 0; i < sec / dt; i++) step(dt); },
  snap() { const f = frameShot(shots[cam.shot]); cam.pos.copy(f.pos); cam.look.copy(f.look); updateCamera(0, simT); },
  idle(v) { idle = v; },
  shotDebug(t, w, h, dir) { shots.debug = { t: V(...t), w, h, dir: V(...dir) }; setShot('debug'); const f = frameShot(shots.debug); cam.pos.copy(f.pos); cam.look.copy(f.look); updateCamera(0, simT); },
  screenPos(name) { const t = targets.find(q => q.name === name); if (!t) return null; const p = t.pos().project(camera); const r = canvas.getBoundingClientRect(); return [(p.x * 0.5 + 0.5) * r.width, (-p.y * 0.5 + 0.5) * r.height, t.enabled()]; },
  bowlScreen() { const p = machine.bowlCenter(V()).project(camera); const r = canvas.getBoundingClientRect(); return [(p.x * 0.5 + 0.5) * r.width, (-p.y * 0.5 + 0.5) * r.height]; },
  papaBlunder, camera, renderer, scene, L, S, setDPR(v) { DPR = v; renderer.setPixelRatio(v); resize(); } };

requestAnimationFrame(frame);
document.getElementById('veil').style.opacity = 0;
setTimeout(() => document.getElementById('veil').remove(), 1200);
startLoading();
