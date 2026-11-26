// こやを ぬろう — a grey, weathered garden shed becomes the colours a child chooses.
// Stages: dress (work clothes) -> walls -> trims/door/roof (+ papa's paint accident) -> dry -> free play.
import * as THREE from 'three';
import { makeRenderer, World } from './world.js';
import { Person, handGeo } from './people.js';
import { paintCan, roller, brush, rag, crate, foldedOveralls, sign, ladder, pot, bird, bubble, COLORS } from './props.js';
import { loadAll, V3, clamp, lerp, damp, rand, smooth, blobTex, contactShadow, canvas } from './util.js';
import * as A from './audio.js';

const TAU = Math.PI * 2;
const cv = document.getElementById('c');
const R = makeRenderer(cv);
const W = new World(R);
const scene = W.scene, PA = W.paint, S = W.surfs;
const cam = new THREE.PerspectiveCamera(34, 1, 0.05, 120);
const Q = new URLSearchParams(location.search);

// ---------------------------------------------------------------- people
const girl = new Person('girl'); girl.base = 'neutral';
const papa = new Person('papa'); papa.base = 'neutral';
scene.add(girl.root, papa.root);
const GIRL_HOME = V3(-1.6, 0, 2.15);
girl.root.position.copy(GIRL_HOME); girl.root.rotation.y = 0.45;
papa.root.position.set(1.85, 0, 1.85); papa.root.rotation.y = -0.7;
const gShadow = contactShadow(0.55, 0.45, 0.55); scene.add(gShadow);
const pShadow = contactShadow(0.8, 0.6, 0.55); scene.add(pShadow);

// ---------------------------------------------------------------- props
const clickables = [];
const addClick = (obj, type, data = {}) => { obj.traverse(o => { if (o.isMesh) o.userData.click = { type, obj, ...data }; }); clickables.push(obj); };
const cans = COLORS.map((c, i) => {
  const g = paintCan(c);
  g.position.set(-1.05 + i * 0.27 + rand(-0.02, 0.02), 0, 2.72 + rand(-0.05, 0.05) + (i % 2) * 0.06);
  g.rotation.y = rand(0, TAU); scene.add(g); addClick(g, 'can', { i }); g.userData.home = g.position.clone();
  return g;
});
const board = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.02, 0.24), new THREE.MeshStandardMaterial({ color: 0x9a8f80, map: W.plainWood.map, normalMap: W.plainWood.normalMap, roughnessMap: W.plainWood.roughnessMap }));
board.position.set(0.52, 0.012, 2.72); board.castShadow = board.receiveShadow = true; scene.add(board);
const tools = { roller: roller(), brush: brush() };
const papaTool = roller(); papaTool.visible = false; scene.add(papaTool);
const REST = {
  roller: { p: V3(0.38, 0.05, 2.72), r: new THREE.Euler(-Math.PI / 2, 0, 0.3) },
  brush: { p: V3(0.68, 0.035, 2.7), r: new THREE.Euler(-Math.PI / 2, 0, -0.2) },
};
for (const k in tools) { scene.add(tools[k]); tools[k].position.copy(REST[k].p); tools[k].rotation.copy(REST[k].r); addClick(tools[k], 'tool', { k }); }
// stamp sponges (appear in free play)
const stampKinds = ['hand', 'flower', 'leaf', 'dots'];
const stamps = {};
{
  const foam = new THREE.MeshPhysicalMaterial({ color: 0xe8d9a8, roughness: 0.95, sheen: 0.5 });
  const shapeOf = (k) => {
    const s = new THREE.Shape();
    if (k === 'flower') { for (let i = 0; i <= 60; i++) { const a = i / 60 * TAU, r = 0.045 + 0.018 * Math.cos(a * 5); i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); } }
    else if (k === 'leaf') { s.moveTo(0, -0.06); s.bezierCurveTo(0.05, -0.02, 0.04, 0.03, 0, 0.06); s.bezierCurveTo(-0.04, 0.03, -0.05, -0.02, 0, -0.06); }
    else { s.absarc(0, 0, 0.05, 0, TAU, false); }
    return s;
  };
  for (const k of stampKinds) {
    let g;
    if (k === 'hand') {
      g = new THREE.Group();
      for (const geo of handGeo(0.06)) { const m = new THREE.Mesh(geo, girl.mats.skin); g.add(m); }
      g.children.forEach(m => { m.castShadow = true; });
      g.rotation.x = -Math.PI / 2;
      const wrap = new THREE.Group(); wrap.add(g); g = wrap;
    } else {
      g = new THREE.Group();
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(shapeOf(k), { depth: 0.03, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 2 }), foam.clone());
      m.rotation.x = -Math.PI / 2; m.castShadow = true; g.add(m);
      const face = new THREE.Mesh(new THREE.ExtrudeGeometry(shapeOf(k), { depth: 0.004, bevelEnabled: false }), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.2, clearcoat: 1 }));
      face.rotation.x = -Math.PI / 2; face.position.y = -0.002; g.add(face); g.userData.face = face;
      if (k === 'dots') { m.scale.set(0.8, 0.8, 1); }
    }
    g.visible = false; scene.add(g); stamps[k] = g; addClick(g, 'tool', { k });
  }
}
const cr = crate(); cr.position.set(-2.3, 0, 2.0); cr.rotation.y = 0.3; scene.add(cr);
const crateTop = (x, z) => cr.localToWorld(V3(x, cr.userData.top, z));
const overMat = girl.mats.over.clone(); overMat.emissive = new THREE.Color(0);
const overs = foldedOveralls(overMat); overs.position.copy(crateTop(-0.07, 0.02)); overs.rotation.y = 0.3; scene.add(overs); addClick(overs, 'over');
const capItem = girl.capG.clone(true); capItem.visible = true;
const capMat2 = girl.mats.capMat.clone(); capMat2.emissive = new THREE.Color(0);
capItem.traverse(o => { if (o.isMesh) o.material = capMat2; });
capItem.scale.setScalar(girl.P.headR); capItem.position.copy(crateTop(0.15, 0.03)).add(V3(0, -0.1 * girl.P.headR, 0)); capItem.rotation.set(0, 1.2, 0);
scene.add(capItem); addClick(capItem, 'cap');
const sg = sign(); sg.position.set(-2.15, 0, 1.15); sg.rotation.y = 0.45; scene.add(sg);
const lad = ladder(); lad.position.set(1.95, 0, 1.25); lad.rotation.y = -Math.PI / 2 + 0.15; lad.visible = false; scene.add(lad);
const rg = rag(); rg.visible = false; scene.add(rg); addClick(rg, 'rag');
const bub = bubble(COLORS[0]); bub.visible = false; scene.add(bub);
const pots = [0xe2b84a, 0xc84f3a, 0xf1ece0, 0xe2b84a].map((c, i) => { const p = pot(c); p.visible = false; scene.add(p); addClick(p, 'pot', { i }); return p; });
const POT_POS = [V3(0.42, 0, 1.32), V3(0.78, 0, 1.36), V3(1.1, 0, 1.3), V3(-1.25, 0, 1.35)];
const sparrow = bird(); sparrow.visible = false; scene.add(sparrow); addClick(sparrow, 'bird');
const PERCH = [V3(0.35, W.dims.RIDGE + 0.06, 0.0), V3(0.62, W.WIN.y0 - 0.0, 1.08), V3(-2.15, 1.27, 1.15), V3(0.78, 0.17, 1.36), V3(1.2, W.dims.RIDGE + 0.06, 0)];
const puddle = new THREE.Mesh(new THREE.CircleGeometry(0.4, 40), new THREE.MeshPhysicalMaterial({ color: COLORS[0], roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.0, alphaMap: blobTex(), depthWrite: false }));
puddle.rotation.x = -Math.PI / 2; puddle.position.set(1.6, 0.006, 1.6); puddle.scale.set(1, 0.7, 1); scene.add(puddle);

// ---------------------------------------------------------------- particles: paint drops, sparkles, sunlit pollen
const DROPS = 260;
const dropMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshPhysicalMaterial({ roughness: 0.1, clearcoat: 1 }), DROPS);
dropMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); dropMesh.frustumCulled = false; scene.add(dropMesh);
const drops = []; for (let i = 0; i < DROPS; i++) { drops.push({ life: 0, p: V3(), v: V3(), s: 0, c: new THREE.Color() }); dropMesh.setColorAt(i, new THREE.Color(1, 1, 1)); }
let dropIdx = 0;
function spawnDrop(p, v, col, s) { const d = drops[dropIdx]; dropIdx = (dropIdx + 1) % DROPS; d.life = 2; d.p.copy(p); d.v.copy(v); d.s = s; d.c.set(col); }
const SPK = 160;
const spkGeo = new THREE.BufferGeometry();
const spkPos = new Float32Array(SPK * 3), spkA = new Float32Array(SPK), spkS = new Float32Array(SPK);
spkGeo.setAttribute('position', new THREE.BufferAttribute(spkPos, 3)); spkGeo.setAttribute('a', new THREE.BufferAttribute(spkA, 1)); spkGeo.setAttribute('s', new THREE.BufferAttribute(spkS, 1));
const spkMat = new THREE.ShaderMaterial({
  uniforms: { map: { value: blobTex() }, k: { value: 1 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `attribute float a; attribute float s; varying float vA; uniform float k; void main(){ vA=a; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize = s * k / -mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `uniform sampler2D map; varying float vA; void main(){ vec2 c = gl_PointCoord - 0.5; float st = max(0.0, 1.0 - abs(c.x)*9.0) * max(0.0, 1.0-abs(c.y)*2.2) + max(0.0, 1.0 - abs(c.y)*9.0) * max(0.0, 1.0-abs(c.x)*2.2); float g = texture2D(map, gl_PointCoord).a; gl_FragColor = vec4(vec3(1.0,0.95,0.8) * (g*0.6 + st), vA); }`,
});
const spk = new THREE.Points(spkGeo, spkMat); spk.frustumCulled = false; scene.add(spk);
const sparks = []; for (let i = 0; i < SPK; i++) sparks.push({ life: 0, p: V3(), v: V3(), s: 0 });
let spkIdx = 0;
function sparkle(p, n = 20, r = 0.5) { for (let i = 0; i < n; i++) { const s = sparks[spkIdx]; spkIdx = (spkIdx + 1) % SPK; s.life = rand(0.6, 1.4); s.max = s.life; s.p.copy(p).add(V3(rand(-r, r), rand(-r, r) * 0.7, rand(-r, r) * 0.3)); s.v.set(rand(-0.2, 0.2), rand(0.1, 0.5), rand(-0.1, 0.1)); s.s = rand(0.03, 0.08); } }
// sunlit pollen / dust motes
const MOTES = 90;
const moteGeo = new THREE.BufferGeometry(); const mp = new Float32Array(MOTES * 3), ma = new Float32Array(MOTES), ms = new Float32Array(MOTES);
for (let i = 0; i < MOTES; i++) { mp.set([rand(-3, 3), rand(0.3, 2.8), rand(0.8, 4.5)], i * 3); ma[i] = rand(0.15, 0.5); ms[i] = rand(0.006, 0.016); }
moteGeo.setAttribute('position', new THREE.BufferAttribute(mp, 3)); moteGeo.setAttribute('a', new THREE.BufferAttribute(ma, 1)); moteGeo.setAttribute('s', new THREE.BufferAttribute(ms, 1));
const moteMat = spkMat.clone(); moteMat.fragmentShader = `uniform sampler2D map; varying float vA; void main(){ float g = texture2D(map, gl_PointCoord).a; gl_FragColor = vec4(vec3(1.0,0.93,0.78)*g, vA*g); }`;
moteMat.uniforms = { map: { value: blobTex() }, k: spkMat.uniforms.k };
const motes = new THREE.Points(moteGeo, moteMat); motes.frustumCulled = false; scene.add(motes);
// pour stream (papa's accident)
const streamMat = new THREE.MeshPhysicalMaterial({ color: COLORS[0], roughness: 0.08, clearcoat: 1 });
let stream = null;

// ---------------------------------------------------------------- camera shots (fit a box at a 35-50mm-ish lens)
const SHOTS = {
  dress: { c: V3(-1.95, 0.72, 2.1), d: V3(0.6, 0.22, 1), w: 1.45, h: 1.3 },
  walls: { c: V3(0.0, 1.2, 1.25), d: V3(0.34, 0.05, 1), w: 4.1, h: 3.0 },
  trim: { c: V3(0.15, 1.48, 1.2), d: V3(0.36, 0.04, 1), w: 4.3, h: 3.35 },
  play: { c: V3(0.0, 1.3, 1.3), d: V3(0.28, 0.07, 1), w: 4.7, h: 3.4 },
  papa: { c: V3(1.3, 0.75, 2.2), d: V3(-0.45, 0.15, 1), w: 0.62, h: 0.62 },
};
const camS = { pos: V3(-1.2, 1.0, 4.0), look: V3(-1.9, 0.7, 2.1), tPos: V3(), tLook: V3(), k: 1.5, shot: 'dress' };
function shotPose(name) {
  const s = SHOTS[name], asp = cam.aspect, t = Math.tan(cam.fov * Math.PI / 360);
  const dist = Math.max(s.h / 2 / t, s.w / 2 / (t * asp)) * 1.04;
  const d = s.d.clone().normalize();
  return [s.c.clone().addScaledVector(d, dist), s.c.clone()];
}
function setShot(name, k = 1.2) { camS.shot = name; camS.k = k; }
function resize() {
  const w = innerWidth, h = innerHeight;
  R.setPixelRatio(Math.min(devicePixelRatio, quality));
  R.setSize(w, h, false);
  cam.aspect = w / h; cam.fov = w >= h ? 34 : 48; cam.updateProjectionMatrix();
  spkMat.uniforms.k.value = h * R.getPixelRatio() / (2 * Math.tan(cam.fov * Math.PI / 360));
}
let quality = Math.min(devicePixelRatio, 2);
addEventListener('resize', resize); resize();
{ const [p, l] = shotPose('dress'); camS.pos.copy(p); camS.look.copy(l); }

// ---------------------------------------------------------------- game state
const G = {
  stage: 'dress', t: 0, idle: 0, color: COLORS[0], tool: 'roller', dressed: { over: false, cap: false },
  stroke: null, load: 1, painted: 0, milestone: 0, wiping: false, papaClean: true, handed: false, spilled: false,
  tasks: [], papaJob: null, busy: false,
};
const after = (s, fn) => G.tasks.push({ t: G.t + s, fn });
const GOALS = {
  walls: [['front', 0.62], ['side', 0.6]],
  trim: [['door', 0.6], ['trim', 0.5], ['roof', 0.55], ['fascia', 0.45]],
};
function progress(stage) { const g = GOALS[stage]; if (!g) return 1; let t = 0; for (const [k, th] of g) t += Math.min(1, PA.coverage(S[k]) / th); return t / g.length; }
function done(stage) { return GOALS[stage].every(([k, th]) => PA.coverage(S[k]) >= th); }

// tint helpers for tools
function tintTool(col) {
  const c = new THREE.Color(col);
  tools.roller.userData.tip.material.color.copy(new THREE.Color(0xf0ebe0).lerp(c, 0.85));
  tools.brush.userData.tip.material.color.copy(c);
  for (const k of ['flower', 'leaf', 'dots']) stamps[k].userData.face.material.color.copy(c);
}
tintTool(G.color);

// ---------------------------------------------------------------- stage control
function enterStage(name) {
  G.stage = name; G.stageT = 0; G.milestone = 0;
  if (name === 'walls') {
    setShot('walls', 0.9);
    girlGo(V3(-0.9, 0, 1.75));
    papaIntroGag();
    for (const k of ['front', 'side']) S[k].hint.value = 0.0;
  } else if (name === 'trim') {
    setShot('trim', 0.9);
    G.tool = 'brush'; G.papaClean = false;
    lad.visible = true; A.sfx('clunk');
    papa.express('happy', 1.5);
    papaWalk(V3(1.75, 0, 1.35), () => {
      papa.root.rotation.y = -1.9; papa.pose.climb = 1;
      G.papaOnLadder = 0.001;
      after(1.2, () => { bub.userData.draw(COLORS[0]); bub.visible = true; A.voice('papa', 'hmm'); papa.pose.armL = 'wave'; after(1, () => papa.pose.armL = 'rest'); });
    });
  } else if (name === 'dry') {
    setShot('play', 0.6);
    celebrate(V3(0.1, 1.6, 1.2));
    G.dryT = 0;
    papaWalk(V3(1.9, 0, 2.3)); girlGo(V3(-0.6, 0, 2.5));
  } else if (name === 'play') {
    for (const k of stampKinds) stamps[k].visible = true;
    placeStamps();
  }
}

// papa's gag in the walls stage: proud demo stroke, then paints his own nose
function papaIntroGag() {
  papaTool.visible = true; G.papaHolding = 'tool';
  papa.express('proud');
  papaWalk(V3(1.85, 0, 0.6), () => {
    papa.root.rotation.y = -Math.PI / 2;
    G.papaJob = { kind: 'demo', t: 0 };
  });
}

function celebrate(p) {
  A.sfx('big'); A.sfx('sparkle'); sparkle(p, 70, 1.3);
  girl.express('laugh', 2.5); A.voice('girl', 'yay');
  girl.pose.armR = girl.pose.armL = 'cheer'; girl.jumpT = 1.6;
  after(2.2, () => { girl.pose.armR = girl.pose.armL = 'rest'; });
  if (!G.spilledActive) { papa.pose.armR = papa.pose.armL = 'clap'; papa.express('laugh', 2); after(2, () => { papa.pose.armR = papa.pose.armL = 'rest'; }); }
}

// ---------------------------------------------------------------- character motion helpers
function walkTo(p, target, speed, dt, onArrive) {
  const d = target.clone().sub(p.root.position); d.y = 0;
  const L = d.length();
  if (L < 0.03) { p.pose.walk = damp(p.pose.walk || 0, 0, 8, dt); if (onArrive) onArrive(); return true; }
  const step = Math.min(L, speed * dt);
  p.root.position.addScaledVector(d.normalize(), step);
  const yaw = Math.atan2(d.x, d.z);
  let dy = yaw - p.root.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
  p.root.rotation.y += dy * Math.min(1, dt * 8);
  p.pose.walk = damp(p.pose.walk || 0, 1, 8, dt);
  p.pose.walkPh = (p.pose.walkPh || 0) + step / (p === girl ? 0.16 : 0.3) * Math.PI;
  return false;
}
function girlGo(p, cb) { G.girlTarget = p.clone(); G.girlCb = cb || null; }
function papaWalk(p, cb) { G.papaTarget = p.clone(); G.papaCb = cb || null; }
function faceTowards(p, pt, dt, k = 5) {
  const d = pt.clone().sub(p.root.position);
  const yaw = Math.atan2(d.x, d.z);
  let dy = yaw - p.root.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
  p.root.rotation.y += dy * Math.min(1, dt * k);
}
// where the girl stands to reach a point on a surface
function standFor(s, p) {
  const n = s.normal;
  let st = p.clone().addScaledVector(n, 0.42);
  // keep slightly to the side so the brush point stays visible
  const side = n.clone().cross(V3(0, 1, 0)).normalize();
  if (Math.abs(n.y) > 0.5) { st = V3(p.x, 0, W.dims.D / 2 + 0.75); }
  else st.addScaledVector(side, 0.28);
  st.y = 0;
  st.x = clamp(st.x, -2.0, 2.2); st.z = clamp(st.z, -1.6, 3.0);
  if (s.name === 'side' || s.name === 'barge') st.x = Math.max(st.x, 1.72);
  else if (st.x < 1.6) st.z = Math.max(st.z, 1.42);
  return st;
}

// ---------------------------------------------------------------- tool pose (follows the finger on the wall, else in the girl's hand)
const toolState = { onWall: false, p: V3(), n: V3(0, 0, 1), dir: V3(1, 0, 0), roll: 0, hold: 0 };
const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 1, 10), new THREE.MeshStandardMaterial({ color: 0xc6c9cc, metalness: 0.9, roughness: 0.35 }));
pole.castShadow = true; pole.visible = false; scene.add(pole);
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion();
function surfacePose(obj, kind, p, n, dir) {
  const up = V3(0, 1, 0);
  let X = up.clone().cross(n); if (X.lengthSq() < 1e-4) X.set(1, 0, 0); X.normalize();
  if (kind === 'roller') {
    // roller axis perpendicular to the stroke direction
    const along = dir.clone().sub(n.clone().multiplyScalar(dir.dot(n)));
    if (along.lengthSq() > 1e-4) { X = along.normalize().cross(n).normalize(); if (X.y < 0 || (Math.abs(X.y) < 0.2 && X.x < 0)) X.negate(); }
    const Y0 = n.clone().cross(X).normalize();  // in-plane, perpendicular to axis
    const Y = Y0.clone().multiplyScalar(Math.cos(0.7)).addScaledVector(n, -Math.sin(0.7)).normalize().negate();
    const Z = X.clone().cross(Y).normalize();
    _m.makeBasis(X, Y.clone().negate().negate(), Z);
    _m.makeBasis(X, Y, Z);
    const pos = p.clone().addScaledVector(n, 0.026);
    return [pos, _q.setFromRotationMatrix(_m).clone()];
  }
  if (kind === 'brush') {
    const Y = n.clone().multiplyScalar(-0.72).add(V3(0, 0.69, 0).sub(n.clone().multiplyScalar(n.y * 0.69))).normalize();
    const Z = X.clone().cross(Y).normalize();
    _m.makeBasis(X, Y, Z);
    const pos = p.clone().addScaledVector(Y, -0.034).addScaledVector(n, 0.004);
    return [pos, _q.setFromRotationMatrix(_m).clone()];
  }
  // stamps/hand: face pressed against the surface (their -y local is the printing face after the group's rotation)
  const Y = n.clone(), Z = X.clone().cross(Y).normalize().negate();
  _m.makeBasis(X, Y, Z.negate());
  return [p.clone().addScaledVector(n, kind === 'hand' ? 0.012 : 0.004), _q.setFromRotationMatrix(_m).clone()];
}
function heldPose(kind) {
  const a = girl.arms[0];
  a.wr.updateWorldMatrix(true, false);
  const p = a.wr.localToWorld(V3(0, -girl.P.palm * 0.45, 0.012));
  const q = a.wr.getWorldQuaternion(new THREE.Quaternion());
  const off = new THREE.Quaternion().setFromEuler(kind === 'roller' ? new THREE.Euler(0, 0, Math.PI) : kind === 'brush' ? new THREE.Euler(0, 0, Math.PI) : new THREE.Euler(0, 0, 0));
  q.multiply(off);
  if (kind === 'roller') p.addScaledVector(V3(0, 1, 0).applyQuaternion(q), -0.2);
  if (kind === 'brush') p.addScaledVector(V3(0, 1, 0).applyQuaternion(q), -0.17);
  return [p, q];
}
function currentToolObj() { return tools[G.tool] || stamps[G.tool]; }

// ---------------------------------------------------------------- input
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function pick(e, list) {
  ndc.set(e.clientX / innerWidth * 2 - 1, -e.clientY / innerHeight * 2 + 1);
  ray.setFromCamera(ndc, cam);
  return ray.intersectObjects(list, true)[0] || null;
}
const paintables = () => W.paintMeshes;
let ptr = null;
cv.addEventListener('pointerdown', (e) => {
  A.unlock(); G.idle = 0; hideHand();
  cv.setPointerCapture(e.pointerId);
  ptr = { id: e.pointerId, x: e.clientX, y: e.clientY };
  if (G.stage === 'intro') return;
  if (G.wiping) { wipe(e, true); return; }
  const vis = clickables.filter(o => o.visible);
  const h = pick(e, [...vis, ...paintables()]);
  if (!h) return;
  const ck = h.object.userData.click;
  if (ck) { onTap(ck, h); return; }
  if (h.object.userData.surf && canPaint()) beginStroke(h, e);
});
cv.addEventListener('pointermove', (e) => {
  if (!ptr || ptr.id !== e.pointerId) return;
  G.idle = 0;
  if (G.wiping) { wipe(e, false); return; }
  if (G.stroke) moveStroke(e);
});
const endPtr = (e) => { if (ptr && ptr.id === e.pointerId) { ptr = null; endStroke(); } };
cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);

function canPaint() { return ['walls', 'trim', 'play'].includes(G.stage) && !G.busy; }

function onTap(ck, h) {
  if (ck.type === 'over' && G.stage === 'dress' && !G.dressed.over) {
    G.dressed.over = true; flyTo(overs, () => girl.torsoJ.localToWorld(V3(0, 0.1, 0.05)), 0.7, () => { overs.visible = false; girl.setOveralls(true); girl.overParts.forEach(m => m.scale.setScalar(0.6)); G.growOver = 0; dressedReact(); });
    A.sfx('whoosh');
  } else if (ck.type === 'cap' && G.stage === 'dress' && !G.dressed.cap) {
    G.dressed.cap = true; flyTo(capItem, () => girl.head.localToWorld(V3(0, 0.9, 0.1)), 0.7, () => { capItem.visible = false; girl.setCap(true); dressedReact(); });
    A.sfx('whoosh');
  } else if (ck.type === 'can') {
    const col = COLORS[ck.i];
    if (G.stage === 'trim' && bub.visible && !G.handed) { handCan(ck.i); return; }
    G.color = col; tintTool(col); A.sfx('clunk'); A.sfx('pick');
    const c = cans[ck.i]; c.userData.hop = 1;
    // dip: a few drops jump from the can
    for (let i = 0; i < 6; i++) spawnDrop(c.position.clone().add(V3(0, 0.19, 0)), V3(rand(-0.3, 0.3), rand(0.8, 1.4), rand(-0.3, 0.3)), col, rand(0.004, 0.008));
    girl.express('happy', 0.9); girl.look = c.position.clone();
    if (G.papaJob && G.papaJob.kind === 'side') papa.express('happy', 0.8);
  } else if (ck.type === 'tool') {
    if (G.stage === 'dress' || G.stage === 'intro') return;
    G.tool = ck.k; A.sfx('pick'); A.sfx('pop');
    sparkle(h.point, 8, 0.1); girl.express('happy', 0.8);
  } else if (ck.type === 'rag' && G.spilled && !G.papaClean) {
    startWipe();
  } else if (ck.type === 'pot') {
    const p = pots[ck.i]; p.userData.wiggle = 1; A.sfx('chime'); sparkle(p.position.clone().add(V3(0, 0.35, 0)), 10, 0.15);
    girl.express('happy', 1); girl.look = p.position.clone();
  } else if (ck.type === 'bird') {
    birdFly(); girl.express('surprised', 0.8); after(0.8, () => girl.express('laugh', 1.2)); A.voice('girl', 'giggle');
  }
}
function dressedReact() {
  A.sfx('sparkle'); sparkle(girl.root.position.clone().add(V3(0, 0.7, 0)), 30, 0.35);
  girl.express('laugh', 1.6); A.voice('girl', 'yay'); girl.jumpT = 1;
  if (G.dressed.over && G.dressed.cap) after(1.6, () => {
    girl.express('proud', 1.5); girl.pose.armR = 'cheer'; A.sfx('chime');
    after(1.4, () => { girl.pose.armR = 'rest'; enterStage('walls'); });
  });
}
const fliers = [];
function flyTo(obj, targetFn, dur, cb) { fliers.push({ obj, from: obj.position.clone(), fs: obj.scale.clone(), targetFn, t: 0, dur, cb }); }

// ---- painting strokes
function beginStroke(h, e) {
  const s = h.object.userData.surf;
  G.load = 1;
  G.stroke = { s, last: h.point.clone(), dir: V3(1, 0, 0), dist: 0, lastT: performance.now() };
  toolState.onWall = true; toolState.p.copy(h.point); toolState.n.copy(s.normal);
  if (stamps[G.tool] && G.tool) { printAt(s, h.point); }
  else { PA.stroke(s, h.point, h.point.clone().addScaledVector(V3(0, 1, 0), 0.004), G.tool, G.color, 1.4); A.sfx('dab'); }
  girl.express('focus'); girl.base = 'focus';
  girlGo(standFor(s, h.point));
}
function printAt(s, p) {
  PA.print(s, p, G.tool, G.color); A.sfx('stamp'); G.stroke.lastPrint = p.clone();
  for (let i = 0; i < 4; i++) spawnDrop(p.clone().addScaledVector(s.normal, 0.02), s.normal.clone().multiplyScalar(rand(0.3, 0.8)).add(V3(rand(-0.3, 0.3), rand(0, 0.5), rand(-0.3, 0.3))), G.color, rand(0.003, 0.006));
}
function moveStroke(e) {
  const h = pick(e, paintables());
  const st = G.stroke;
  if (!h) return;
  const s = h.object.userData.surf;
  if (s !== st.s) { st.s = s; st.last.copy(h.point); toolState.n.copy(s.normal); girlGo(standFor(s, h.point)); return; }
  const seg = h.point.clone().sub(st.last);
  const L = seg.length();
  if (L < 0.004) return;
  if (stamps[G.tool]) {
    if (h.point.distanceTo(st.lastPrint) > 0.17) printAt(s, h.point);
  } else {
    PA.stroke(s, st.last, h.point, G.tool, G.color, G.load);
    G.load = Math.max(0.35, G.load - L * 0.25);
    const now = performance.now(), spd = L / Math.max(0.008, (now - st.lastT) / 1000); st.lastT = now;
    A.swish(spd / 2.5, G.tool);
    st.speed = spd;
    // fast strokes flick a few droplets
    if (spd > 1.6 && Math.random() < 0.35) spawnDrop(h.point.clone().addScaledVector(s.normal, 0.03), s.normal.clone().multiplyScalar(rand(0.2, 0.6)).add(seg.clone().normalize().multiplyScalar(rand(0.3, 1.0))).add(V3(0, rand(0, 0.4), 0)), G.color, rand(0.002, 0.005));
  }
  st.dir.lerp(seg.normalize(), 0.35).normalize();
  st.last.copy(h.point); st.dist += L;
  toolState.p.copy(h.point); toolState.dir.copy(st.dir);
  G.painted += L;
  if (st.dist > 0.6 && (!G.girlTarget || G.girlTarget.distanceTo(standFor(s, h.point)) > 0.35)) girlGo(standFor(s, h.point));
}
function endStroke() {
  if (!G.stroke) return;
  G.stroke = null; toolState.onWall = false; A.swish(0, G.tool);
  girl.base = 'neutral';
  if (Math.random() < 0.6) { girl.express('happy', 1.0); if (Math.random() < 0.3) A.voice('girl', 'giggle'); } else girl.express('neutral');
}

// ---------------------------------------------------------------- papa's ladder accident & wiping
function handCan(i) {
  G.handed = true; bub.visible = false;
  const c = cans[i], col = COLORS[i];
  G.spillCol = col;
  A.sfx('whoosh');
  flyTo(c, () => papa.handWorld(false).add(V3(0, -0.1, 0)), 0.8, () => {
    c.userData.held = true; A.sfx('clunk');
    if (i !== 0) { papa.express('puzzled', 1.3); A.voice('papa', 'huh'); after(1.4, () => { papa.express('happy', 1.2); A.voice('papa', 'laugh'); }); }
    else { papa.express('happy', 1.2); A.voice('papa', 'yay'); }
    after(i !== 0 ? 2.9 : 1.8, () => spill(c, col));
  });
}
function spill(c, col) {
  G.spilledActive = true; G.busy = true;
  papa.pose.armL = 'cheer'; A.sfx('wobble'); papa.express('surprised'); A.voice('papa', 'oops');
  G.tipping = { c, t: 0, col };
  girl.express('surprised'); girl.pose.armR = girl.pose.armL = 'cheek'; girl.look = papa.head.getWorldPosition(V3());
}
function finishSpill() {
  papa.express('oops'); G.spilled = true;
  after(0.8, () => {
    papa.pose.climb = 0; G.papaOnLadder = 0;
    papaWalk(V3(1.25, 0, 2.25), () => {
      papa.pose.sit = 1; papa.root.rotation.y = -0.55; papa.express('oops'); papa.pose.armL = 'head';
      rg.visible = true; rg.position.copy(crateTop(0.0, 0.0)).add(V3(0, 0.02, 0)); rg.rotation.set(-Math.PI / 2, 0, 0.4);
      girl.pose.armR = girl.pose.armL = 'rest'; girl.express('laugh', 1.5); A.voice('girl', 'giggle');
      G.busy = false;
    });
  });
}
function startWipe() {
  G.wiping = true; G.tool = 'rag';
  rg.visible = false;
  const hp = papa.head.getWorldPosition(V3());
  SHOTS.papa.c.copy(hp).add(V3(0, -0.02, 0));
  const toGirl = girl.root.position.clone().sub(papa.root.position).normalize();
  SHOTS.papa.d.set(toGirl.x * 0.4 + Math.sin(papa.root.rotation.y), 0.1, toGirl.z * 0.4 + Math.cos(papa.root.rotation.y));
  setShot('papa', 1.3);
  girlGo(papa.root.position.clone().add(V3(-0.55, 0, 0.35)));
  papa.pose.armL = 'rest'; papa.express('happy');
  A.sfx('pick');
}
const ragCursor = rag(); ragCursor.scale.setScalar(0.5); ragCursor.visible = false; scene.add(ragCursor);
function wipe(e, first) {
  const h = pick(e, [papa.headMesh]);
  if (!h || !h.uv) return;
  papa.wipeAt(h.uv, 40);
  ragCursor.visible = true; ragCursor.position.copy(h.point).addScaledVector(h.face.normal.clone().transformDirection(papa.headMesh.matrixWorld), 0.02);
  ragCursor.lookAt(cam.position);
  if (first || Math.random() < 0.15) A.sfx('wipe');
  G.wipeTick = (G.wipeTick || 0) + 1;
  if (G.wipeTick % 25 === 0) { papa.express('laugh', 0.9); A.voice('papa', 'laugh'); }
  if (G.wipeTick % 8 === 0) {
    const left = papa.paintLeft();
    papa.paintAmt = Math.min(papa.paintAmt, 0.25 + left * 0.9);
    if (left < 0.06) wipeDone();
  }
}
function wipeDone() {
  G.wiping = false; G.papaClean = true; ragCursor.visible = false;
  papa.paintG.clearRect(0, 0, 9999, 9999); papa.faceDirty = true;
  G.fadePaint = 1;
  A.sfx('chime'); A.sfx('sparkle'); sparkle(papa.head.getWorldPosition(V3()), 30, 0.25);
  papa.express('laugh', 2.2); A.voice('papa', 'laugh'); papa.pose.armR = 'wave';
  girl.express('proud', 2); A.voice('girl', 'yay');
  G.tool = 'brush';
  after(1.6, () => {
    setShot('trim', 0.9); papa.pose.sit = 0; papa.pose.armR = papa.pose.armL = 'rest'; G.spilledActive = false;
    papaWalk(V3(2.05, 0, 2.2), () => { papa.root.rotation.y = -0.6; papa.express('happy'); });
    girlGo(V3(-0.6, 0, 1.8));
  });
}

// ---------------------------------------------------------------- free play helpers
function placeStamps() {
  const spots = [[-0.18, -0.12], [0.0, -0.12], [0.18, -0.12], [0.06, 0.1]];
  stampKinds.forEach((k, i) => { const p = crateTop(spots[i][0], spots[i][1]); stamps[k].position.copy(p).add(V3(0, k === 'hand' ? 0.012 : 0.004, 0)); stamps[k].quaternion.identity(); stamps[k].rotation.y = 0.3; stamps[k].userData.rest = { p: stamps[k].position.clone(), q: stamps[k].quaternion.clone() }; });
}
let birdS = null;
function birdArrive() { sparrow.visible = true; birdS = { from: V3(-6, 4, 3), to: PERCH[0].clone(), t: 0, dur: 2.6, perch: 0, hopT: 2 }; sparrow.position.copy(birdS.from); A.sfx('flap'); }
function birdFly() {
  if (!birdS || birdS.t < birdS.dur) return;
  let n; do { n = (Math.random() * PERCH.length) | 0; } while (n === birdS.perch);
  birdS = { from: sparrow.position.clone(), to: PERCH[n].clone(), t: 0, dur: 1.4, perch: n, hopT: 2 };
  A.sfx('flap'); A.sfx('bird');
}

// ---------------------------------------------------------------- hint hand (DOM) + glow
const handEl = document.getElementById('hand');
let handVis = false;
function hideHand() { if (handVis) { handEl.style.opacity = 0; handVis = false; } }
function showHandAt(world, drag) {
  const v = world.clone().project(cam);
  if (v.z > 1) return;
  const x = (v.x * 0.5 + 0.5) * innerWidth, y = (-v.y * 0.5 + 0.5) * innerHeight;
  const t = G.t;
  const dx = drag ? Math.sin(t * 2.2) * 40 : 0, dy = drag ? Math.cos(t * 4.4) * 6 : Math.abs(Math.sin(t * 4)) * -14;
  handEl.style.transform = `translate(${x - 30 + dx}px, ${y - 8 + dy}px) rotate(-12deg)`;
  if (!handVis) { handEl.style.opacity = 0.95; handVis = true; }
}
function hintTarget() {
  switch (G.stage) {
    case 'dress': return [!G.dressed.over ? overs.position.clone().add(V3(0, 0.04, 0)) : capItem.position.clone().add(V3(0, 0.05, 0)), false];
    case 'walls': {
      const s = PA.coverage(S.front) / 0.62 < PA.coverage(S.side) / 0.6 ? S.front : S.side;
      const p = PA.emptiest(s); return p ? [p, true] : null;
    }
    case 'trim': {
      if (bub.visible && !G.handed) return [cans[0].position.clone().add(V3(0, 0.2, 0)), false];
      if (G.spilled && !G.papaClean && !G.wiping && rg.visible) return [rg.position.clone(), false];
      if (G.wiping) return [papa.head.getWorldPosition(V3()).add(V3(0, -0.02, 0)), true];
      if (G.busy) return null;
      let best = null, bv = 9;
      for (const [k, th] of GOALS.trim) { const v = PA.coverage(S[k]) / th; if (v < bv) { bv = v; best = k; } }
      if (best && bv < 1) { const p = PA.emptiest(S[best]); return p ? [p, true] : null; }
      return null;
    }
    case 'play': {
      const opts = [sparrow.position.clone(), pots[1].position.clone().add(V3(0, 0.3, 0)), stamps.flower.position.clone(), S.front.origin.clone().add(V3(0.6 + Math.random(), 0.9, 0))];
      if (!G.playHint || G.t - G.playHintT > 4) { G.playHint = opts[(Math.random() * opts.length) | 0]; G.playHintT = G.t; }
      return [G.playHint, false];
    }
  }
  return null;
}
const glowMats = () => {
  const L = [];
  if (G.stage === 'dress') { if (!G.dressed.over) L.push(overMat); if (!G.dressed.cap) L.push(capMat2); }
  if (G.stage === 'trim' && bub.visible && !G.handed) for (const c of cans) L.push(c.userData.surf.material);
  if (rg.visible) L.push(rg.material);
  return L;
};
const allGlow = [overMat, capMat2, rg.material, ...cans.map(c => c.userData.surf.material)];

// ---------------------------------------------------------------- main loop
let last = performance.now(), fpsAcc = 0, fpsN = 0, lowT = 0;
const _v = V3();
function frame() {
  requestAnimationFrame(frame);
  const now = performance.now();
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  G.t += dt; G.stageT = (G.stageT || 0) + dt; G.idle += dt;
  // adaptive resolution to hold 30fps+ on phones
  fpsAcc += dt; fpsN++;
  if (fpsAcc > 1.5) {
    const fps = fpsN / fpsAcc; window.__fps = fps; fpsAcc = 0; fpsN = 0;
    if (fps < 40 && quality > 1) { quality = Math.max(1, quality - 0.25); resize(); }
    else if (fps > 57 && quality < Math.min(devicePixelRatio, 2)) { lowT++; if (lowT > 3) { quality = Math.min(Math.min(devicePixelRatio, 2), quality + 0.25); resize(); lowT = 0; } }
  }
  // scheduled tasks
  for (let i = G.tasks.length - 1; i >= 0; i--) if (G.t >= G.tasks[i].t) { const f = G.tasks[i].fn; G.tasks.splice(i, 1); f(); }
  W.update(dt);
  updateStage(dt);
  // walking
  if (G.girlTarget) { if (walkTo(girl, G.girlTarget, 1.1, dt)) { const cb = G.girlCb; G.girlTarget = null; G.girlCb = null; cb && cb(); } }
  else girl.pose.walk = damp(girl.pose.walk || 0, 0, 8, dt);
  if (G.papaTarget) { if (walkTo(papa, G.papaTarget, 1.0, dt)) { const cb = G.papaCb; G.papaTarget = null; G.papaCb = null; cb && cb(); } }
  else papa.pose.walk = damp(papa.pose.walk || 0, 0, 8, dt);
  // girl body language
  const tObj = currentToolObj();
  if (G.stroke) {
    faceTowards(girl, toolState.p, dt, 4);
    girl.look = toolState.p.clone();
    const high = toolState.p.y > 1.3;
    girl.pose.armR = 'ik'; girl.pose.tR = high ? girl.root.localToWorld(V3(0.02, 0.95, 0.25)) : toolState.p.clone().addScaledVector(toolState.n, 0.18).add(V3(0, -0.06, 0));
    if (high) { girl.pose.armL = 'ik'; girl.pose.tL = girl.root.localToWorld(V3(0.03, 0.8, 0.22)); }
    girl.pose.crouch = damp(girl.pose.crouch, toolState.p.y < 0.45 ? 0.5 : 0, 4, dt);
  } else if (!['cheer', 'cheek'].includes(girl.pose.armR)) {
    girl.pose.armR = G.stage === 'dress' ? 'rest' : 'hold'; girl.pose.armL = girl.pose.armL === 'ik' ? 'rest' : girl.pose.armL;
    girl.pose.crouch = damp(girl.pose.crouch, 0, 4, dt);
    if (!G.girlTarget && G.stage !== 'dress' && !G.wiping) faceTowards(girl, camS.pos, dt, 1.5);
    if (G.idle > 2.5 && !G.wiping) girl.look = camS.pos.clone();
  }
  if (G.wiping) { faceTowards(girl, papa.root.position, dt, 4); girl.look = papa.head.getWorldPosition(V3()); girl.pose.armR = 'ik'; girl.pose.tR = ragCursor.visible ? ragCursor.position.clone() : papa.head.getWorldPosition(V3()); }
  if (girl.jumpT > 0) { girl.jumpT -= dt; girl.pose.jump = (1 - (girl.jumpT % 0.5) / 0.5); } else girl.pose.jump = 0;
  // tool placement
  if (tObj && G.stage !== 'dress' && G.tool !== 'rag') {
    for (const k in tools) if (tools[k] !== tObj && !tools[k].userData.resting) restTool(tools[k], REST[k]);
    for (const k of stampKinds) if (stamps[k] !== tObj && stamps[k].userData.rest && stamps[k].visible) { stamps[k].position.lerp(stamps[k].userData.rest.p, 1 - Math.exp(-10 * dt)); stamps[k].quaternion.slerp(stamps[k].userData.rest.q, 1 - Math.exp(-10 * dt)); }
    tObj.userData.resting = false;
    let tp, tq;
    if (toolState.onWall) [tp, tq] = surfacePose(tObj, G.tool, toolState.p, toolState.n, toolState.dir);
    else [tp, tq] = heldPose(G.tool);
    const k = 1 - Math.exp(-(toolState.onWall ? 30 : 12) * dt);
    tObj.position.lerp(tp, k); tObj.quaternion.slerp(tq, k);
    if (G.tool === 'roller' && G.stroke && G.stroke.speed) tObj.userData.tip.rotation.x += G.stroke.speed * dt * 20;
    // extension pole for high places
    const showPole = toolState.onWall && toolState.p.y > 1.3 && (G.tool === 'roller' || G.tool === 'brush');
    pole.visible = showPole;
    if (showPole) {
      const a = tObj.localToWorld(V3(0, G.tool === 'roller' ? -0.27 : -0.2, 0)), b = girl.handWorld(true);
      pole.position.copy(a).add(b).multiplyScalar(0.5); pole.scale.set(1, a.distanceTo(b), 1);
      pole.quaternion.setFromUnitVectors(V3(0, 1, 0), b.clone().sub(a).normalize());
    }
  } else pole.visible = false;
  if (G.stage === 'dress' && G.dressed.over) { /* tools rest */ }
  // papa
  updatePapa(dt);
  // people
  girl.update(dt); papa.update(dt);
  gShadow.position.set(girl.root.position.x, 0.005, girl.root.position.z);
  pShadow.position.set(papa.root.position.x, 0.005 + papa.root.position.y * 0, papa.root.position.z); pShadow.visible = papa.root.position.y < 0.1;
  if (G.growOver !== undefined && G.growOver < 1) { G.growOver = Math.min(1, G.growOver + dt * 3); const s = 0.6 + 0.4 * smooth(0, 1, G.growOver); girl.overParts.forEach(m => m.scale.setScalar(s)); }
  // fliers
  for (let i = fliers.length - 1; i >= 0; i--) {
    const f = fliers[i]; f.t += dt; const u = Math.min(1, f.t / f.dur), e = smooth(0, 1, u);
    const to = f.targetFn();
    f.obj.position.lerpVectors(f.from, to, e); f.obj.position.y += Math.sin(u * Math.PI) * 0.4;
    f.obj.rotation.y += dt * 6;
    if (u >= 1) { fliers.splice(i, 1); f.cb && f.cb(); }
  }
  // cans hop + held can follows papa's hand
  for (const c of cans) {
    if (c.userData.hop > 0) { c.userData.hop = Math.max(0, c.userData.hop - dt * 3); c.position.y = Math.sin(c.userData.hop * Math.PI) * 0.06; }
    if (c.userData.held && !G.tipping) { c.position.copy(papa.handWorld(false)).add(V3(0, -0.2, 0)); c.rotation.set(0, 0, 0); }
  }
  // spill animation
  if (G.tipping) updateTip(dt);
  if (G.fadePaint > 0) { G.fadePaint = Math.max(0, G.fadePaint - dt * 0.7); papa.paintAmt = Math.min(papa.paintAmt, G.fadePaint); }
  tintPapa();
  // particles
  updateParticles(dt);
  // bird
  updateBird(dt);
  // pots wiggle
  for (const p of pots) if (p.visible) {
    const w = p.userData.wiggle || 0; p.userData.wiggle = Math.max(0, w - dt * 1.2);
    p.userData.flowers.forEach((f, i) => { f.rotation.z = Math.sin(G.t * 1.3 + i) * 0.03 + Math.sin(G.t * 14 + i) * 0.2 * w; f.rotation.x = Math.cos(G.t * 1.1 + i * 2) * 0.03; });
    if (p.userData.drop !== undefined && p.userData.drop < 1) { p.userData.drop = Math.min(1, p.userData.drop + dt * 2.5); p.position.y = (1 - smooth(0, 1, p.userData.drop)) * 0.5; }
  }
  // glow pulses for things to touch
  const gl = glowMats(), pulse = 0.5 + 0.5 * Math.sin(G.t * 4);
  for (const m of allGlow) m.emissive.setRGB(0, 0, 0);
  for (const m of gl) m.emissive.setRGB(0.35 * pulse, 0.3 * pulse, 0.18 * pulse);
  for (const k in S) S[k].hint.value = damp(S[k].hint.value, 0, 3, dt);
  if (G.stage === 'walls' && G.idle > 2) for (const [k] of GOALS.walls) S[k].hint.value = 1;
  if (G.stage === 'trim' && G.idle > 2 && G.papaClean) for (const [k, th] of GOALS.trim) if (PA.coverage(S[k]) < th) S[k].hint.value = 1;
  // hint hand
  if (G.idle > 4 && !G.busy && !G.stroke && G.stage !== 'intro' && G.stage !== 'dry') { const h = hintTarget(); if (h) showHandAt(h[0], h[1]); else hideHand(); } else hideHand();
  bub.visible && bub.position.copy(papa.head.getWorldPosition(V3())).add(V3(-0.15, 0.38, 0));
  // camera
  if (Q.get('view')) { const who = Q.get('view') === 'papa' ? papa : girl; const hp = who.root.position; SHOTS.dbg = { c: V3(hp.x, who.P.H * (Q.get('face') ? 0.9 : 0.5), hp.z), d: V3(Math.sin(who.root.rotation.y), 0.05, Math.cos(who.root.rotation.y)), w: who.P.H * (Q.get('face') ? 0.25 : 0.8), h: who.P.H * (Q.get('face') ? 0.25 : 1.05) }; camS.shot = 'dbg'; camS.k = 50; }
  const [tp, tl] = G.wiping ? shotPose('papa') : shotPose(camS.shot);
  const breathe = V3(Math.sin(G.t * 0.31) * 0.02, Math.sin(G.t * 0.23) * 0.012, 0);
  camS.pos.lerp(tp.add(breathe), 1 - Math.exp(-camS.k * dt));
  camS.look.lerp(tl, 1 - Math.exp(-camS.k * dt));
  cam.position.copy(camS.pos); cam.lookAt(camS.look);
  R.render(scene, cam);
}
function restTool(t, r) { t.position.lerp(r.p, 0.15); t.quaternion.slerp(new THREE.Quaternion().setFromEuler(r.r), 0.15); if (t.position.distanceTo(r.p) < 0.002) t.userData.resting = true; }

function updateStage(dt) {
  if (G.stage === 'dress') {
    girl.look = (Math.sin(G.t * 0.7) > 0 ? overs.position : capItem.position).clone();
    if (G.idle > 3 && Math.sin(G.t * 0.7) > 0.95) girl.look = camS.pos.clone();
  } else if (G.stage === 'walls') {
    const pr = progress('walls');
    if (pr > (G.milestone + 1) * 0.25 && G.milestone < 3) { G.milestone++; girl.express('laugh', 1.4); A.voice('girl', 'wow'); A.sfx('sparkle'); papa.express('laugh', 1.2); }
    if (done('walls') && !G.stroke && !G.walDone) { G.walDone = true; celebrate(V3(0.2, 1.3, 1.1)); G.papaJob = null; papaTool.visible = false; after(3.2, () => enterStage('trim')); }
  } else if (G.stage === 'trim') {
    if (G.papaClean && done('trim') && !G.stroke && !G.trimDone) { G.trimDone = true; after(0.5, () => enterStage('dry')); }
    const pr = progress('trim');
    if (G.papaClean && pr > (G.milestone + 1) * 0.3 && G.milestone < 2) { G.milestone++; girl.express('laugh', 1.2); A.voice('girl', 'wow'); papa.pose.armR = 'clap'; after(1.2, () => papa.pose.armR = 'rest'); }
  } else if (G.stage === 'dry') {
    G.dryT += dt;
    const u = smooth(0, 4, G.dryT);
    PA.dryRate = 0.45;
    W.setSun(lerp(0.52, 0.8, u), 1 - u);
    girl.look = V3(0, 1.4, 1); papa.look = V3(0, 1.6, 1);
    if (G.dryT > 1 && !G.potsIn) { G.potsIn = true; pots.forEach((p, i) => after(0.6 + i * 0.45, () => { p.visible = true; p.position.copy(POT_POS[i]); p.userData.drop = 0; A.sfx('soil'); sparkle(POT_POS[i].clone().add(V3(0, 0.3, 0)), 6, 0.15); })); }
    if (G.dryT > 3.2 && !G.birdIn) { G.birdIn = true; birdArrive(); after(2.6, () => { A.sfx('bird'); girl.express('surprised', 0.7); after(0.7, () => { girl.express('laugh', 1.5); A.voice('girl', 'wow'); }); }); }
    if (G.dryT > 6.5) { PA.dryRate = 0.05; enterStage('play'); G.tool = 'flower'; girlGo(V3(-1.2, 0, 2.0)); papa.express('happy'); }
  } else if (G.stage === 'play') {
    PA.dryRate = 0.06;
    if (birdS && birdS.t >= birdS.dur && Math.random() < dt * 0.06) birdFly();
    if (Math.random() < dt * 0.08 && birdS) A.sfx('bird');
  }
}

function updatePapa(dt) {
  const job = G.papaJob;
  if (G.papaOnLadder) {
    papa.root.position.y = damp(papa.root.position.y, 0.62, 3, dt);
    papa.root.position.x = damp(papa.root.position.x, 1.95, 3, dt); papa.root.position.z = damp(papa.root.position.z, 1.38, 3, dt);
    papa.look = G.handed ? V3(1.2, 2.2, 1.2) : girl.head.getWorldPosition(V3());
  } else papa.root.position.y = damp(papa.root.position.y, 0, 6, dt);
  if (!job) { if (!G.papaOnLadder && !G.wiping && G.stage !== 'dry') papa.look = girl.head.getWorldPosition(V3()); papaTool.visible = false; return; }
  job.t += dt;
  papaTool.visible = true;
  // papa paints the side wall alongside the girl (columns bottom->top), using her colour
  let target;
  if (job.kind === 'demo') {
    const p0 = V3(1.32, 1.2, 0.85), p1 = V3(1.32, 0.45, 0.85);
    if (job.t < 2.2) { const u = smooth(0.3, 2.0, job.t); target = p0.clone().lerp(p1, u); if (job.t > 0.3) paintBy(papa, S.side, target, COLORS[2]); papa.look = target; }
    else if (job.t < 3.6) { // turns proudly to the girl, scratches nose with the wet roller
      target = null; papa.look = girl.head.getWorldPosition(V3()); faceTowards(papa, girl.root.position, dt, 4);
      if (job.t > 2.8 && !job.nose) { job.nose = true; papa.initPaintLayer(COLORS[2]); papa.paintG.fillStyle = COLORS[2]; papa.paintG.beginPath(); papa.paintG.ellipse(512, 512 * (0.5 + 0.27 / Math.PI), 22, 16, 0, 0, TAU); papa.paintG.fill(); papa.faceDirty = true; papa.express('oops', 1.6); A.voice('papa', 'oops'); A.sfx('dab'); papa.pose.armR = 'head'; after(0.6, () => { girl.express('laugh', 2); A.voice('girl', 'giggle'); papa.pose.armR = 'rest'; }); }
    } else { G.papaJob = { kind: 'side', t: 0, col: 0, y: 0.3 }; papaWalk(V3(1.85, 0, 0.6), () => { papa.root.rotation.y = -Math.PI / 2; }); papa.express('happy', 1); }
  } else if (job.kind === 'side') {
    if (G.papaTarget) { target = null; }
    else {
      // vertical zig-zag columns on the side wall, slowly (girl does most of the work)
      const cols = [0.75, 0.45, 0.15, -0.15, -0.45, -0.75];
      const z = cols[job.col % cols.length];
      job.y += dt * 0.55 * (job.dirUp === false ? -1 : 1);
      const top = Math.min(2.05, W.dims.EAVE + (1 - Math.abs(z)) * 0.78 - 0.2);
      if (job.y > top) { job.dirUp = false; } if (job.y < 0.3) { job.dirUp = true; job.col++; papaWalk(V3(1.85, 0, cols[job.col % cols.length] - 0.25)); }
      target = V3(1.32, clamp(job.y, 0.25, top), z + Math.sin(job.t * 7) * 0.05);
      paintBy(papa, S.side, target, G.color);
      papa.look = target; faceTowards(papa, target, dt, 3);
    }
  }
  if (target) {
    const [tp, tq] = surfacePose(papaTool, 'roller', target, S.side.normal, V3(0, 1, 0));
    papaTool.position.lerp(tp, 0.3); papaTool.quaternion.slerp(tq, 0.3);
    papa.pose.armR = 'ik'; papa.pose.tR = papaTool.localToWorld(V3(0, -0.24, 0));
  } else { const [hp, hq] = (() => { const a = papa.arms[0]; const p = a.wr.localToWorld(V3(0, -0.06, 0.02)); return [p, a.wr.getWorldQuaternion(new THREE.Quaternion()).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI)))]; })(); papaTool.position.lerp(hp.addScaledVector(V3(0, 1, 0), -0.2), 0.3); papaTool.quaternion.slerp(hq, 0.3); }
}
const lastBy = new Map();
function paintBy(who, s, p, col) {
  const l = lastBy.get(who);
  if (l && l.distanceTo(p) < 0.4) PA.stroke(s, l, p, 'roller', col, 0.9);
  lastBy.set(who, p.clone());
}

function updateTip(dt) {
  const T = G.tipping; T.t += dt;
  const c = T.c;
  const hand = papa.handWorld(false);
  const head = papa.head.getWorldPosition(V3());
  // the can rises over his head, then tips
  const above = head.clone().add(V3(0.05, 0.32, 0.03));
  c.position.lerp(T.t < 0.6 ? hand.add(V3(0, 0.05, 0)) : above, 0.15);
  const tilt = smooth(0.7, 1.2, T.t) * 2.3;
  c.rotation.set(0, 0, -tilt);
  papa.look = above;
  if (T.t > 1.0 && T.t < 2.6) {
    // pour stream
    const lip = c.localToWorld(V3(-0.083, 0.19, 0));
    const pts = []; for (let i = 0; i < 8; i++) { const u = i / 7; pts.push(lip.clone().lerp(head.clone().add(V3(0, 0.1, 0)), u).add(V3(Math.sin(u * 3 + G.t * 20) * 0.006, -u * u * 0.03, 0))); }
    if (stream) { stream.geometry.dispose(); scene.remove(stream); }
    const tg = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.012 * (1 - smooth(2.2, 2.6, T.t)) + 0.002, 8);
    streamMat.color.set(T.col);
    stream = new THREE.Mesh(tg, streamMat); scene.add(stream);
    if (!T.started) { T.started = true; A.sfx('splash'); papa.initPaintLayer(T.col); papa.paintCol = T.col; papa.express('shocked'); puddle.material.color.set(T.col); papa.paintAmt = 0; }
    papa.pourPaint(smooth(1.0, 2.4, T.t));
    papa.paintAmt = smooth(1.0, 2.0, T.t);
    for (let i = 0; i < 3; i++) spawnDrop(head.clone().add(V3(rand(-0.12, 0.12), rand(-0.1, 0.05), rand(-0.1, 0.1))), V3(rand(-0.8, 0.8), rand(0.2, 1.2), rand(-0.6, 0.8)), T.col, rand(0.004, 0.012));
    puddle.material.opacity = Math.min(0.95, puddle.material.opacity + dt * 0.8);
    puddle.position.set(papa.root.position.x - 0.1, 0.006, papa.root.position.z + 0.15);
  } else if (T.t >= 2.6) {
    if (stream) { stream.geometry.dispose(); scene.remove(stream); stream = null; }
    // the empty can falls to the grass
    c.userData.held = false;
    c.position.y = Math.max(0.083, c.position.y - dt * 3);
    if (!T.landed && c.position.y <= 0.09) { T.landed = true; A.sfx('clunk'); c.rotation.set(0, 0.4, Math.PI / 2); c.position.y = 0.083; finishSpill(); }
    if (T.landed) { G.tipping = null; papa.pose.armL = 'rest'; }
  }
}
const papaBase = { hair: papa.mats.hair.color.clone(), cap: papa.mats.capMat.color.clone(), over: papa.mats.over.color.clone(), shirt: papa.mats.shirt.color.clone() };
function tintPapa() {
  const a = papa.paintAmt || 0, col = new THREE.Color(papa.paintCol || COLORS[0]);
  papa.mats.hair.color.copy(papaBase.hair).lerp(col, a * 0.85);
  papa.mats.capMat.color.copy(papaBase.cap).lerp(col, a * 0.9);
  papa.mats.shirt.color.copy(papaBase.shirt).lerp(col, a * 0.6);
  papa.mats.capMat.roughness = lerp(0.88, 0.15, a); papa.mats.hair.roughness = lerp(0.38, 0.12, a);
}

function updateParticles(dt) {
  const m = new THREE.Matrix4(), q = new THREE.Quaternion();
  for (let i = 0; i < DROPS; i++) {
    const d = drops[i];
    if (d.life > 0) {
      d.life -= dt; d.v.y -= 9.8 * dt; d.p.addScaledVector(d.v, dt);
      if (d.p.y < 0.01) { d.p.y = 0.01; d.v.set(0, 0, 0); d.life = Math.min(d.life, 0.4); }
      const s = d.s * (d.p.y <= 0.011 ? 1.6 : 1) * Math.min(1, d.life * 3);
      const st = Math.min(2.5, 1 + d.v.length() * 0.15);
      q.setFromUnitVectors(V3(0, 1, 0), d.v.lengthSq() > 0.01 ? d.v.clone().normalize() : V3(0, 1, 0));
      m.compose(d.p, q, V3(s, s * (d.p.y <= 0.011 ? 0.2 : st), s));
      dropMesh.setColorAt(i, d.c);
    } else m.makeScale(0, 0, 0);
    dropMesh.setMatrixAt(i, m);
  }
  dropMesh.instanceMatrix.needsUpdate = true; if (dropMesh.instanceColor) dropMesh.instanceColor.needsUpdate = true;
  for (let i = 0; i < SPK; i++) {
    const s = sparks[i];
    if (s.life > 0) { s.life -= dt; s.p.addScaledVector(s.v, dt); spkPos.set([s.p.x, s.p.y, s.p.z], i * 3); spkA[i] = Math.sin(Math.min(1, s.life / s.max) * Math.PI) * 0.9; spkS[i] = s.s; }
    else spkA[i] = 0;
  }
  spkGeo.attributes.position.needsUpdate = spkGeo.attributes.a.needsUpdate = spkGeo.attributes.s.needsUpdate = true;
  for (let i = 0; i < MOTES; i++) {
    mp[i * 3] += Math.sin(G.t * 0.3 + i) * dt * 0.03; mp[i * 3 + 1] += Math.sin(G.t * 0.21 + i * 1.7) * dt * 0.02; mp[i * 3 + 2] += Math.cos(G.t * 0.17 + i) * dt * 0.02;
    ma[i] = (0.25 + 0.25 * Math.sin(G.t * 0.8 + i * 3.1)) * 0.6;
  }
  moteGeo.attributes.position.needsUpdate = moteGeo.attributes.a.needsUpdate = true;
}

function updateBird(dt) {
  if (!birdS) return;
  const b = birdS, body = sparrow.userData.body;
  if (b.t < b.dur) {
    b.t += dt; const u = smooth(0, 1, b.t / b.dur);
    sparrow.position.lerpVectors(b.from, b.to, u); sparrow.position.y += Math.sin(u * Math.PI) * 0.5;
    const d = b.to.clone().sub(b.from); sparrow.rotation.y = Math.atan2(d.x, d.z);
    const f = Math.sin(G.t * 40) * 1.0;
    body.userData['wing1'].rotation.z = -0.3 - f * 0.8; body.userData['wing-1'].rotation.z = 0.3 + f * 0.8;
    if (b.t >= b.dur) { A.sfx('bird'); sparkle(b.to, 4, 0.05); }
  } else {
    body.userData['wing1'].rotation.z = damp(body.userData['wing1'].rotation.z, 0, 10, dt); body.userData['wing-1'].rotation.z = damp(body.userData['wing-1'].rotation.z, 0, 10, dt);
    b.hopT -= dt;
    if (b.hopT < 0) { b.hopT = rand(0.8, 2.5); b.hop = 1; sparrow.rotation.y += rand(-1.2, 1.2); }
    if (b.hop > 0) { b.hop = Math.max(0, b.hop - dt * 5); }
    body.position.y = 0.035 + Math.sin((b.hop || 0) * Math.PI) * 0.025;
    body.rotation.x = Math.sin(G.t * 3) * 0.08 + (Math.sin(G.t * 0.7) > 0.8 ? -0.35 : 0);
  }
}

// ---------------------------------------------------------------- boot
if (Q.get('stage')) { // debug jumps for screenshots
  const st = Q.get('stage');
  G.dressed = { over: true, cap: true }; overs.visible = capItem.visible = false; girl.setOveralls(true); girl.setCap(true);
  if (st !== 'walls') {
    const fill = (k, c) => { const s = S[k]; for (let i = 0; i < 40; i++) { const y = rand(0, s.h); PA.stroke(s, s.origin.clone().addScaledVector(s.v, y).addScaledVector(s.u, -0.1), s.origin.clone().addScaledVector(s.v, y + rand(-0.05, 0.05)).addScaledVector(s.u, s.w + 0.1), 'roller', c, 1); } for (let i = 0; i < 260; i++) { const y = rand(0, s.h), x = rand(0, s.w); PA.stroke(s, s.origin.clone().addScaledVector(s.v, y).addScaledVector(s.u, x), s.origin.clone().addScaledVector(s.v, y + rand(-0.4, 0.4)).addScaledVector(s.u, x + rand(-0.3, 0.3)), 'roller', c, 1); } };
    fill('front', COLORS[0]); fill('side', COLORS[0]);
    if (st === 'dry' || st === 'play') { fill('door', COLORS[1]); fill('trim', COLORS[4]); fill('roof', COLORS[3]); fill('fascia', COLORS[4]); fill('barge', COLORS[4]); }
  }
  G.walDone = st !== 'walls';
  G.stage = 'x';
  setTimeout(() => {
    enterStage(st === 'play' ? 'dry' : st);
    if (st === 'walls') { G.papaJob = null; papa.root.position.set(1.85, 0, 0.6); }
    const [p, l] = shotPose(camS.shot); camS.pos.copy(p); camS.look.copy(l);
  }, 50);
} else enterStage('dress');
G.stage = G.stage || 'dress';
loadAll().then(() => {
  document.getElementById('veil').style.opacity = 0; window.__ready = true;
  for (const p of [girl, papa]) (p._splats || []).forEach(f => f());
});
requestAnimationFrame(frame);
window.__G = G; window.__W = W; window.__girl = girl; window.__papa = papa; window.__cam = cam;
window.__tap = (type, i) => onTap({ type, i, k: i }, { point: V3() });
