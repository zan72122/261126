// さびたロボットをみがいて なおそう — main: renderer, camera shots, input, the three scenes.
import * as THREE from 'three';
import { setAniso, allLoaded, tex, canvas, canvasTex } from './tex.js';
import { Post } from './post.js';
import { buildWorld, ROOM, kelvin } from './world.js';
import { Robot } from './robot.js';
import { Human } from './human.js';
import { FX } from './fx.js';
import { makeBrush, makeRag, makeOilCan, makeBigCan, makeClothesPile } from './props.js';
import { unlock, sfx, voice as voiceRaw, rub, setRain } from './audio.js';

const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const clamp = THREE.MathUtils.clamp, lerp = THREE.MathUtils.lerp;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const params = new URLSearchParams(location.search);
const DBGCAM = params.get('cam') ? params.get('cam').split(',').map(Number) : null;

// ------------------------------------------------------------------ quality
const mobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent));
const Q = { dpr: Math.min(window.devicePixelRatio || 1, mobile ? 1.6 : 2), msaa: mobile ? 2 : 4, dof: true, shadow: mobile ? 1024 : 2048 };
if (params.get('q') === 'low') { Q.dpr = 1; Q.msaa = 0; Q.dof = false; Q.shadow = 512; }

const cvs = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas: cvs, antialias: false, powerPreference: 'high-performance', stencil: false });
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping; // ACES is applied in the composite pass
setAniso(renderer.capabilities.getMaxAnisotropy());
const post = new Post(renderer, Q);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0.02, 0.018, 0.016);
const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 30);
const W = buildWorld(scene, Q);
const fx = new FX(scene);

// ------------------------------------------------------------------ characters
const twill = (col) => new THREE.MeshPhysicalMaterial({ map: tex('twill_col', { srgb: true, repeat: [5, 5] }), normalMap: tex('twill_nrm', { repeat: [5, 5] }), normalScale: new THREE.Vector2(1.3, 1.3), color: col, roughness: 0.9, sheen: 0.7, sheenRoughness: 0.8, sheenColor: new THREE.Color(0.55, 0.6, 0.65) });
const girl = new Human({
  scale: 1, skin: 0xe8b9a0, hair: 0x3a2416, iris: 0x5a3820, lip: 'rgba(205,108,104,0.95)',
  shirtMat: new THREE.MeshPhysicalMaterial({ map: tex('knit_col', { srgb: true, repeat: [6, 6] }), normalMap: tex('knit_nrm', { repeat: [6, 6] }), color: 0xf2e6dc, roughness: 0.92, sheen: 1, sheenColor: new THREE.Color(1, 0.85, 0.85), sheenRoughness: 0.7 }),
  pantsMat: twill(0x8a96a8), coverMat: twill(0x8fb0d6), shoeCol: 0x7a5a4a, pose: 'kneel',
});
scene.add(girl.root);
const dad = new Human({
  scale: 1.52, adult: true, skin: 0xdcae92, hair: 0x2a1c14, iris: 0x4a3424, lip: 'rgba(170,100,92,0.9)', longSleeve: true,
  shirtMat: new THREE.MeshPhysicalMaterial({ map: tex('wool_col', { srgb: true, repeat: [9, 9] }), normalMap: tex('twill_nrm', { repeat: [8, 8] }), color: 0xb8c4bc, roughness: 0.9, sheen: 0.8, sheenColor: new THREE.Color(0.6, 0.6, 0.6) }),
  pantsMat: twill(0x5f6a74), shoeCol: 0x6a5a48, pose: 'kneel',
});
dad.root.visible = false; scene.add(dad.root);

// ------------------------------------------------------------------ robot + props
const robot = new Robot(scene);
const pile = makeClothesPile(); scene.add(pile);
const brush = makeBrush(), rag = makeRag(), can = makeOilCan(), bigCan = makeBigCan();
for (const p of [brush, rag, can, bigCan]) scene.add(p);
const toolHome = { brush: V3(0.04, 0, 0.25), rag: V3(0.23, 0.012, 0.19), can: V3(0.2, 0, 0.24) };
brush.position.copy(toolHome.brush).setY(0.012); brush.rotation.set(Math.PI, 0.5, 0); brush.position.y = 0.052;
rag.position.copy(toolHome.rag);
can.position.copy(toolHome.can); can.visible = false; bigCan.visible = false;
const toolAO = {};
// puddle of oil on the floor (paintable alpha mask)
const pudC = canvas(256, 256), pg = pudC.getContext('2d'); pg.fillStyle = '#000'; pg.fillRect(0, 0, 256, 256);
const pudT = canvasTex(pudC, false);
const puddle = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), new THREE.MeshPhysicalMaterial({ color: 0x2a1604, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02, alphaMap: pudT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, envMapIntensity: 0.7 }));
puddle.rotation.x = -Math.PI / 2; puddle.position.set(0.02, 0.003, -0.02); puddle.renderOrder = 2; scene.add(puddle);
// leak water puddle
const wpC = canvas(128, 128), wg = wpC.getContext('2d'); wg.fillStyle = '#000'; wg.fillRect(0, 0, 128, 128);
const wpT = canvasTex(wpC, false);
const waterPud = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), new THREE.MeshPhysicalMaterial({ color: 0x222a2e, roughness: 0.02, clearcoat: 1, alphaMap: wpT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }));
waterPud.rotation.x = -Math.PI / 2; waterPud.position.set(0.62, 0.003, -1.45); scene.add(waterPud);
const LEAK = V3(0.62, 2.05, -1.45);
// oil joint glows
const glowTex = (() => { const c = canvas(64, 64), g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,220,150,0.9)'); gr.addColorStop(0.4, 'rgba(255,190,110,0.35)'); gr.addColorStop(1, 'rgba(255,180,100,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return canvasTex(c); })();
const jointGlows = {};
for (const k of Object.keys(robot.joints)) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true })); s.scale.setScalar(0.07); s.visible = false; scene.add(s); jointGlows[k] = s; }

// ------------------------------------------------------------------ hint hand (white pointing glove, no text)
const hint = document.getElementById('hint');
let hintTarget = null, idleT = 0;
function showHint(p) { hintTarget = p; }

// ------------------------------------------------------------------ camera shots
const shots = {
  dress: { tgt: V3(-0.6, 0.45, 0.15), dir: V3(0.3, 0.28, 1), pts: [V3(-0.37, 0.9, 0.1), V3(-1.02, 0.1, 0.32), V3(-0.2, 0.55, 0.15), V3(-0.22, 0.05, 0.25), V3(-0.75, 0.3, 0.32)] },
  trunk: { tgt: V3(-0.1, 0.4, -0.3), dir: V3(0.25, 0.4, 1), pts: [V3(-0.42, 0.86, 0.08), V3(0.42, 0.4, -0.62), V3(-0.42, 0.2, 0.2), V3(0.3, 0.05, -0.35)] },
  polish: { tgt: V3(-0.1, 0.4, 0.0), dir: V3(0.2, 0.3, 1), pts: [V3(-0.4, 0.92, 0.08), V3(0.18, 0.6, -0.05), V3(0.15, 0.02, 0.0), V3(-0.4, 0.3, 0.15), V3(0.3, 0.0, 0.22), V3(0.0, 0.0, 0.3)] },
  oil: { tgt: V3(-0.08, 0.4, 0.0), dir: V3(0.2, 0.3, 1), pts: [V3(-0.4, 0.92, 0.08), V3(0.18, 0.62, -0.05), V3(0.15, 0.02, 0.05), V3(-0.4, 0.3, 0.15)] },
  dad: { tgt: V3(0.05, 0.6, 0.0), dir: V3(0.05, 0.28, 1), pts: [V3(-0.42, 0.9, 0.08), V3(0.55, 1.42, 0.05), V3(0.0, 0.05, 0.1), V3(0.62, 0.6, 0.05)] },
  window: { tgt: V3(0.05, 0.95, -1.9), dir: V3(0.42, 0.16, 1), pts: [V3(-0.45, 1.66, -2.08), V3(0.45, 1.66, -2.08), V3(-0.5, 0.05, -1.75), V3(0.75, 0.05, -1.6)], ptsL: [V3(-0.45, 1.66, -2.08), V3(0.45, 1.66, -2.08), V3(-0.55, 0.3, -1.75), V3(0.8, 0.3, -1.6), V3(0.35, 0.12, -1.5)] },
};
const cam = { pos: V3(0, 1, 2), tgt: V3(0, 0.4, 0), fromPos: V3(), fromTgt: V3(), toPos: V3(), toTgt: V3(), t: 1, dur: 1.6, shot: null };
// ~35mm-equivalent across the short side in portrait, ~45mm in landscape
function fovFor(aspect) { return aspect < 1 ? THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(41 / 2)) / aspect)) : 31; }
function solveShot(s) {
  // fit all key points in frame: re-centre the aim on them, then find the closest distance that keeps them inside
  const dir = s.dir.clone().normalize();
  const tmp = new THREE.PerspectiveCamera(camera.fov, camera.aspect, 0.05, 30);
  const tgt = s.tgt.clone();
  const P = camera.aspect > 1 && s.ptsL ? s.ptsL : s.pts;
  let dist = 2;
  for (let pass = 0; pass < 3; pass++) {
    let lo = 0.3, hi = 7;
    for (let i = 0; i < 24; i++) {
      const d = (lo + hi) / 2;
      tmp.position.copy(tgt).addScaledVector(dir, d); tmp.lookAt(tgt); tmp.updateMatrixWorld(); tmp.updateProjectionMatrix();
      let ok = true;
      for (const p of P) { const q = p.clone().project(tmp); if (Math.abs(q.x) > 0.92 || Math.abs(q.y) > 0.9 || q.z > 1) { ok = false; break; } }
      if (ok) hi = d; else lo = d;
    }
    dist = hi;
    tmp.position.copy(tgt).addScaledVector(dir, dist); tmp.lookAt(tgt); tmp.updateMatrixWorld();
    let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
    for (const p of P) { const q = p.clone().project(tmp); x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); y0 = Math.min(y0, q.y); y1 = Math.max(y1, q.y); }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const right = V3(1, 0, 0).applyQuaternion(tmp.quaternion), upv = V3(0, 1, 0).applyQuaternion(tmp.quaternion);
    const h = Math.tan(THREE.MathUtils.degToRad(tmp.fov / 2)) * dist;
    tgt.addScaledVector(right, cx * h * tmp.aspect).addScaledVector(upv, cy * h);
  }
  return { pos: tgt.clone().addScaledVector(dir, dist), tgt, dist };
}
function goShot(name, dur = 1.8) {
  cam.shot = name; const r = solveShot(shots[name]);
  cam.fromPos.copy(cam.pos); cam.fromTgt.copy(cam.tgt); cam.toPos.copy(r.pos); cam.toTgt.copy(r.tgt); cam.t = dur > 0 ? 0 : 1; cam.dur = Math.max(0.01, dur); cam.dist = r.dist;
  if (dur <= 0) { cam.pos.copy(r.pos); cam.tgt.copy(r.tgt); }
}
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setPixelRatio(Q.dpr); renderer.setSize(w, h, false);
  post.setSize(w, h, Q.dpr);
  camera.aspect = w / h; camera.fov = fovFor(camera.aspect); camera.updateProjectionMatrix();
  fx.dustMat.uniforms.uPx.value = h * Q.dpr * 0.004;
  if (cam.shot) { const r = solveShot(shots[cam.shot]); cam.toPos.copy(r.pos); cam.toTgt.copy(r.tgt); cam.dist = r.dist; if (cam.t >= 1) { cam.pos.copy(r.pos); cam.tgt.copy(r.tgt); } }
}
window.addEventListener('resize', resize);

function voice(who, kind) { voiceRaw(who, kind); const h = who === 'girl' ? girl : dad; h.talk = 1; clearTimeout(h._tk); h._tk = setTimeout(() => (h.talk = 0), 650); }
// ------------------------------------------------------------------ state
const S = { name: 'boot', t: 0, tool: null, dressed: { coverall: false, gloves: false }, lid: 0, lift: 0, done: {}, rain: 1, rainbow: 0, sun: 0, fogCov: 0, bucketPlaced: false, puddle: 0, spin: 0, spinA: 0 };
function setState(n) { S.name = n; S.t = 0; idleT = 0; hintTarget = null; }
// robot base transforms
const ROBOT_FLOOR = V3(0.03, 0, -0.04);
// lying on its back in the trunk: up -> +x, face -> +y
const Q_LIE = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V3(0, 0, 1), V3(1, 0, 0), V3(0, 1, 0))).multiply(new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), 0.0));
const P_LIE = V3(-0.29, 0.29, -0.62);
function robotInTrunk() { robot.root.position.copy(P_LIE); robot.root.quaternion.copy(Q_LIE); }
robotInTrunk();
girl.root.position.set(-0.37, 0, 0.1); girl.root.rotation.y = 1.3;
dad.root.position.set(0.5, 0, 0.05); dad.root.rotation.y = -1.15;
pile.position.set(-0.86, 0, 0.32); pile.rotation.y = 0.4;

// helper: girl holds a prop in her right hand
let held = null;
function hold(p) {
  if (held && held !== p) { const h = held; h.userData.returning = true; }
  held = p; if (p) { p.visible = true; p.userData.returning = false; }
  S.tool = p === brush ? 'brush' : p === rag ? 'rag' : p === can ? 'can' : null;
}
const handMat = new THREE.Matrix4();
function placeHeld(dt) {
  for (const p of [brush, rag, can]) {
    if (p.userData.returning) {
      const home = p === brush ? toolHome.brush.clone().setY(0.052) : p === rag ? toolHome.rag : toolHome.can;
      p.position.lerp(home, 1 - Math.exp(-dt * 6));
      const qh = new THREE.Quaternion().setFromEuler(p === brush ? new THREE.Euler(Math.PI, 0.5, 0) : new THREE.Euler(0, 0.3, 0));
      p.quaternion.slerp(qh, 1 - Math.exp(-dt * 6));
      if (p.position.distanceTo(home) < 0.003) p.userData.returning = false;
    }
  }
  if (!held) return;
  const hand = girl.arms[0].hand.g; hand.updateMatrixWorld(true);
  const hp = V3().setFromMatrixPosition(hand.matrixWorld);
  const hq = new THREE.Quaternion().setFromRotationMatrix(hand.matrixWorld);
  if (touch.active && touch.hit && (S.tool === 'brush' || S.tool === 'rag')) {
    // tool sits on the surface under the finger
    const n = touch.hit.n, p = touch.hit.p;
    const up = V3(0, 1, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(up, n);
    const target = p.clone().addScaledVector(n, S.tool === 'brush' ? 0.052 : 0.004);
    held.position.lerp(target, 1 - Math.exp(-dt * 30));
    const qq = q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(up, touch.wiggle || 0));
    if (S.tool === 'brush') qq.multiply(new THREE.Quaternion().setFromAxisAngle(V3(1, 0, 0), Math.PI));
    held.quaternion.slerp(qq, 1 - Math.exp(-dt * 20));
  } else if (S.tool === 'can') {
    const off = V3(0, -0.06, 0.02).applyQuaternion(hq);
    held.position.lerp(hp.clone().add(off), 1 - Math.exp(-dt * 20));
    const tilt = touch.active ? 1.1 : 0.2;
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(tilt, girl.root.rotation.y, 0));
    held.quaternion.slerp(q, 1 - Math.exp(-dt * 10));
  } else {
    const off = V3(0, -0.07, 0.02).applyQuaternion(hq);
    held.position.lerp(hp.clone().add(off), 1 - Math.exp(-dt * 20));
    held.quaternion.slerp(hq, 1 - Math.exp(-dt * 12));
  }
}

// ------------------------------------------------------------------ input
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const touch = { active: false, x: 0, y: 0, hit: null, last: null, wiggle: 0, downT: 0, moved: 0 };
function pick(objs, x, y) {
  ndc.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  return ray.intersectObjects(objs, true)[0] || null;
}
function hitInfo(h) {
  if (!h) return null;
  const n = h.face ? h.face.normal.clone().transformDirection(h.object.matrixWorld) : V3(0, 1, 0);
  if (n.dot(ray.ray.direction) > 0) n.negate();
  return { p: h.point.clone(), n, obj: h.object, uv: h.uv ? h.uv.clone() : null };
}
cvs.addEventListener('pointerdown', (e) => {
  unlock(); cvs.setPointerCapture && cvs.setPointerCapture(e.pointerId);
  touch.active = true; touch.x = e.clientX; touch.y = e.clientY; touch.last = null; touch.downT = performance.now(); touch.moved = 0; idleT = 0; hintTarget = null;
  onDown(e.clientX, e.clientY);
});
cvs.addEventListener('pointermove', (e) => {
  if (!touch.active) return;
  touch.moved += Math.hypot(e.clientX - touch.x, e.clientY - touch.y);
  touch.x = e.clientX; touch.y = e.clientY; idleT = 0;
});
const up = () => { touch.active = false; touch.hit = null; touch.last = null; touch.lastUv = null; touch.prevP = null; touch.prevPolish = null; rub(0, ''); girl.reach[0] = null; girl.palmN = null; };
cvs.addEventListener('pointerup', up); cvs.addEventListener('pointercancel', up);
document.addEventListener('gesturestart', (e) => e.preventDefault());

function onDown(x, y) {
  const st = S.name;
  if (st === 'dress') {
    const h = pick([pile.userData.cover, pile.userData.gloves], x, y);
    if (!h) return;
    let o = h.object; while (o && o !== pile.userData.cover && o !== pile.userData.gloves) o = o.parent;
    const part = o === pile.userData.cover ? 'coverall' : 'gloves';
    if (S.dressed[part]) return;
    S.dressed[part] = true; sfx.swish(); sfx.zip();
    o.userData.fly = 0.0001; girl.setExpr('wow'); voice('girl', 'wow');
    setTimeout(() => { girl.dress(part); girl.setExpr('happy'); sfx.sparkle(); fx.glint(girl.root.position.clone().add(V3(0.05, 0.55, 0.05)), 0.12); }, 420);
    return;
  }
  if (st === 'trunk') {
    const h = pick([W.trunk], x, y);
    if (h && S.lid === 0) { S.lid = 0.0001; sfx.creak(); girl.setExpr('surprised'); voice('girl', 'wow'); }
    else if (S.lid >= 1 && S.lift === 0) {
      const hr = pick(robot.parts, x, y) || h;
      if (hr) { S.lift = 0.0001; voice('girl', 'here'); girl.setExpr('determined'); }
    }
    return;
  }
  if (st === 'polish') {
    const ht = pick([brush, rag], x, y);
    if (ht) { let o = ht.object; while (o.parent && o.parent !== scene) o = o.parent; hold(o); sfx.tap(); girl.setExpr('happy'); return; }
    if (!held) hold(brush);
    return;
  }
  if (st === 'oil') { const ht = pick([can], x, y); if (ht && !held) { hold(can); sfx.tap(); } if (!held) hold(can); return; }
  if (st === 'spin') { if (!held || held !== rag) hold(rag); return; }
  if (st === 'window' || st === 'free') {
    const hb = pick([W.bucket], x, y);
    if (hb) { bucketTap(); return; }
    const hr = pick(robot.parts, x, y);
    if (hr && st === 'free') { robotDance(); return; }
  }
}

// continuous touch handling per frame
const _prevP = V3();
function handleTouch(dt) {
  if (!touch.active) { rub(0, ''); return; }
  const st = S.name;
  if (st === 'polish') {
    const h = hitInfo(pick(robot.parts, touch.x, touch.y));
    touch.hit = h;
    if (!h) { girl.reach[0] = null; rub(0, ''); touch.last = null; return; }
    girl.reach[0] = h.p.clone().addScaledVector(h.n, S.tool === 'brush' ? 0.11 : 0.035);
    girl.palmN = [h.n, null];
    girl.setLook(h.p);
    const moved = touch.last ? h.p.distanceTo(touch.last) : 0;
    touch.last = h.p.clone();
    touch.wiggle += moved * 40;
    const amt = clamp(moved / 0.01, 0, 2.5) + dt * 0.6; // even holding still scrubs a little
    let dr = 0, ds = 0, glass = false;
    const tool = S.tool;
    // fast strokes: stamp along the path so nothing is skipped
    const segN = touch.prevPolish && moved < 0.2 ? Math.min(4, 1 + Math.floor(moved / 0.025)) : 1;
    const stampAmt = amt / segN;
    for (let si = 1; si <= segN; si++) robot.paint(segN > 1 ? touch.prevPolish.clone().lerp(h.p, si / segN) : h.p, tool === 'brush' ? 0.045 : 0.05, (a, i, f) => {
      const amt = stampAmt;
      const r0 = a[i], s0 = a[i + 1];
      if (tool === 'brush') {
        a[i] = Math.min(1, r0 + 0.07 * amt * f * (1.05 - r0 * 0.4));
        a[i + 1] = Math.min(Math.max(s0, 0.22 * a[i]), s0 + 0.02 * amt * f);
        if (s0 > 0.4) a[i + 1] = Math.max(0.4, s0 - 0.01 * amt * f); // the brush scuffs a mirror back to satin
      } else {
        a[i] = Math.min(1, r0 + 0.012 * amt * f);
        a[i + 1] = Math.min(1, s0 + 0.055 * amt * f * (0.12 + 0.88 * a[i] * a[i]));
      }
      dr += a[i] - r0; ds += a[i + 1] - s0;
    });
    touch.prevPolish = h.p.clone();
    // cloth wipes the dusty glass of the eyes / mouth
    if (tool === 'rag') {
      const head = robot.head; head.updateMatrixWorld();
      const lp = head.worldToLocal(h.p.clone());
      if (lp.z > 0.05) { const i = lp.y < 0.06 ? 2 : lp.x < 0 ? 0 : 1; robot.dust[i] = Math.max(0, robot.dust[i] - amt * 0.03); }
    }
    if (dr > 0.02) { fx.rustBurst(h.p, Math.min(10, Math.ceil(dr * 0.25)), h.n); if (Math.random() < 0.3) sfx.powder(); }
    if (ds > 0.5 && Math.random() < 0.08 && tool === 'rag') { fx.glint(h.p.clone().addScaledVector(h.n, 0.01), 0.05); }
    rub(clamp(moved / 0.012, 0, 1) * (h ? 1 : 0), tool);
    return;
  }
  if (st === 'oil') {
    const h = hitInfo(pick(robot.parts, touch.x, touch.y)) || (() => { const p = pick([W.floor], touch.x, touch.y); return p ? hitInfo(p) : null; })();
    touch.hit = h;
    if (!h) return;
    const above = h.p.clone().add(V3(0, 0.12, 0));
    girl.reach[0] = above.clone().add(V3(-0.02, 0.04, 0.02)); girl.setLook(h.p);
    touch.oilT = (touch.oilT || 0) - dt;
    if (touch.oilT <= 0 && held === can) {
      touch.oilT = 0.32;
      can.updateMatrixWorld(true);
      const tip = can.userData.tip.clone().applyMatrix4(can.matrixWorld);
      const from = h.p.clone().add(V3((Math.random() - 0.5) * 0.004, 0.09, (Math.random() - 0.5) * 0.004));
      if (tip.distanceTo(from) < 0.06) from.copy(tip);
      const d = fx.oilDrop(from, V3(0, -0.2, 0), 0.0045);
      d.target = h.p.clone(); d.targetN = h.n.clone();
      sfx.drip();
    }
    return;
  }
  if (st === 'spin') {
    // grab the robot or wipe the puddle
    const hr = pick(robot.parts, touch.x, touch.y);
    if (hr) { S.grab = 0.25; girl.reach[0] = hr.point.clone(); girl.setLook(hr.point); touch.hit = null; return; }
    const h = hitInfo(pick([puddle, W.floor], touch.x, touch.y));
    touch.hit = h; if (!h) return;
    girl.reach[0] = h.p.clone().add(V3(0, 0.03, 0)); girl.palmN = [V3(0, 1, 0), null]; girl.setLook(h.p);
    const moved = touch.last ? h.p.distanceTo(touch.last) : 0; touch.last = h.p.clone(); touch.wiggle += moved * 30;
    const prev = touch.prevP || h.p, n = Math.min(10, 1 + Math.floor(moved / 0.015));
    for (let i = 1; i <= n; i++) {
      const q = prev.clone().lerp(h.p, i / n);
      const u = (q.x - puddle.position.x) / 1.2 + 0.5, v = (q.z - puddle.position.z) / 1.2 + 0.5;
      const gr = pg.createRadialGradient(u * 256, v * 256, 0, u * 256, v * 256, 26);
      gr.addColorStop(0, 'rgba(0,0,0,0.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      pg.fillStyle = gr; pg.fillRect(u * 256 - 28, v * 256 - 28, 56, 56);
    }
    touch.prevP = h.p.clone(); pudT.needsUpdate = true;
    rub(clamp(moved / 0.012, 0, 1), 'rag');
    return;
  }
  if (st === 'window' || st === 'free') {
    const h = hitInfo(pick([W.glass], touch.x, touch.y));
    touch.hit = null;
    if (!h || !h.uv) { girl.reach[0] = null; rub(0, ''); return; }
    girl.reach[0] = h.p.clone().add(V3(0, 0, 0.035)); girl.palmN = [V3(0, 0, 1), null]; girl.setLook(h.p);
    const moved = touch.last ? h.p.distanceTo(touch.last) : 0;
    const lu = touch.lastUv || h.uv, n = Math.min(12, 1 + Math.floor(moved / 0.015));
    for (let i = 1; i <= n; i++) wipeFog(lerp(lu.x, h.uv.x, i / n), lerp(lu.y, h.uv.y, i / n), 30, 1.2);
    touch.last = h.p.clone(); touch.lastUv = h.uv.clone();
    rub(clamp(moved / 0.012, 0, 1), 'rag');
  }
}
function wipeFog(u, v, r, a) {
  const g = W.fog.ctx, x = u * 256, y = (1 - v) * 256;
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,255,255,${0.35 * a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); W.fog.tex.needsUpdate = true;
}

// oil drops landing
fx.onOilLand = (p, d) => {
  if (S.name === 'oil' && d.target) {
    const n = d.targetN || V3(0, 1, 0);
    robot.paint(d.target, 0.03, (a, i, f) => { a[i + 2] = Math.min(1, a[i + 2] + 0.5 * f); });
    sfx.plink();
    // which joint did it reach?
    let bestK = null, bestD = 0.12;
    for (const [k, j] of Object.entries(robot.joints)) { if (j.oil >= 1) continue; const jp = V3(); j.obj.getWorldPosition(jp); const dd = jp.distanceTo(d.target); if (dd < bestD) { bestD = dd; bestK = k; } }
    for (const [k, j] of Object.entries(robot.joints)) {
      const jp = V3(); j.obj.getWorldPosition(jp);
      if (k === bestK) {
        j.oil = Math.min(1, j.oil + 0.34); j.wig = 0.9;
        sfx.squeak(1 - j.oil); robot.setExpr('flicker');
        if (j.oil >= 1) { sfx.servo(); voice('girl', 'yay'); girl.setExpr('happy'); fx.glint(jp, 0.06); }
      }
    }
  }
  if (S.name === 'dadpour') { addPuddle(p.x, p.z, 0.05 + Math.random() * 0.05); }
};
function addPuddle(x, z, r) {
  const u = (x - puddle.position.x) / 1.2 + 0.5, v = (z - puddle.position.z) / 1.2 + 0.5;
  const R = r * 256 / 1.2;
  const gr = pg.createRadialGradient(u * 256, v * 256, 0, u * 256, v * 256, R); gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  pg.fillStyle = gr; pg.beginPath(); pg.arc(u * 256, v * 256, R, 0, 7); pg.fill(); pudT.needsUpdate = true;
}
function coverage(ctx, w, h, ch = 0) { const d = ctx.getImageData(0, 0, w, h).data; let s = 0, n = 0; for (let i = ch; i < d.length; i += 16) { s += d[i]; n++; } return s / (n * 255); }

// water from the leak
let dripT = 1;
fx.onWaterLand = (p, d) => {
  if (d && d.splash) return;
  const bp = W.bucket.position;
  if (Math.hypot(p.x - bp.x, p.z - bp.z) < 0.13 && S.bucketPlaced) { sfx.plink(); W.bucket.userData.level = Math.min(1, W.bucket.userData.level + 0.03); return; }
  sfx.splash();
  for (let i = 0; i < 4; i++) fx.waterDrop(V3(p.x, 0.01, p.z), V3((Math.random() - 0.5) * 0.6, 0.6 + Math.random() * 0.5, (Math.random() - 0.5) * 0.6), 0.0018).splash = true;
  const u = (p.x - waterPud.position.x) / 0.6 + 0.5, v = (p.z - waterPud.position.z) / 0.6 + 0.5;
  const gr = wg.createRadialGradient(u * 128, v * 128, 0, u * 128, v * 128, 10); gr.addColorStop(0, 'rgba(255,255,255,0.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); wg.fillStyle = gr; wg.fillRect(u * 128 - 12, v * 128 - 12, 24, 24); wpT.needsUpdate = true;
};

// ------------------------------------------------------------------ robot behaviours (scene 3)
const R = { mode: 'idle', path: [], walkPh: 0, carry: false, danceT: 0, wipeT: 0 };
function walkTo(p, then) { R.mode = 'walk'; R.path = [p.clone()]; R.then = then; }
function bucketTap() {
  if (R.mode === 'walk' || R.mode === 'climb') return;
  sfx.beep('q');
  if (!S.bucketPlaced) {
    robot.setExpr('happy');
    walkTo(W.bucket.position.clone().add(V3(-0.2, 0, 0.12)), () => { R.carry = true; sfx.beep('happy'); walkTo(V3(LEAK.x - 0.21, 0, LEAK.z + 0.1), () => { R.carry = false; W.bucket.position.set(LEAK.x, 0, LEAK.z); S.bucketPlaced = true; sfx.thump(); voice('girl', 'yay'); girl.setExpr('happy'); robot.setExpr('happy'); setTimeout(() => goWipe(), 900); }); });
  } else if (W.bucket.userData.level > 0.35) {
    // carry the full bucket away to empty it, bring it back
    walkTo(W.bucket.position.clone().add(V3(-0.21, 0, 0.1)), () => { R.carry = true; const keep = W.bucket.position.clone(); walkTo(V3(1.7, 0, -0.6), () => { W.bucket.userData.level = 0; sfx.splash(); sfx.beep('happy'); walkTo(keep.clone().add(V3(-0.21, 0, 0.1)), () => { R.carry = false; W.bucket.position.copy(keep); sfx.thump(); setTimeout(() => goWipe(), 600); }); }); });
  }
}
const SILL_SPOT = V3(0.24, 0, -1.85);
function goWipe() { walkTo(SILL_SPOT, () => { R.mode = 'climb'; R.climbT = 0; }); }
function robotDance() { if (R.mode === 'idle' || R.mode === 'wipe' || R.mode === 'onsill') { R.danceT = 2.2; sfx.beep('happy'); robot.setExpr('happy'); fx.glint(robot.head.getWorldPosition(V3()).add(V3(0, 0.1, 0.06)), 0.08); } }

function updateRobotS3(dt, t) {
  const P = robot.pose, root = robot.root;
  if (R.mode === 'walk') {
    const tgt = R.path[0]; const d = V3(tgt.x - root.position.x, 0, tgt.z - root.position.z); const L = d.length();
    const yaw = Math.atan2(d.x, d.z);
    let dy = yaw - root.rotation.y; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
    root.rotation.y += dy * Math.min(1, dt * 6);
    if (L < 0.015) { R.mode = 'idle'; const f = R.then; R.then = null; if (f) f(); }
    else { const sp = 0.28; root.position.addScaledVector(d.normalize(), Math.min(L, sp * dt)); R.walkPh += dt * 11; }
    P.lL = Math.sin(R.walkPh) * 0.45; P.lR = -Math.sin(R.walkPh) * 0.45; P.bob = Math.abs(Math.cos(R.walkPh)) * 0.012;
    P.aLs = R.carry ? 0.9 : -Math.sin(R.walkPh) * 0.5; P.aRs = R.carry ? 0.9 : Math.sin(R.walkPh) * 0.5; P.aLr = R.carry ? 0.15 : 0.1; P.aRr = P.aLr;
    if (Math.sin(R.walkPh) * Math.sin(R.walkPh - dt * 11) < 0) sfx.servo();
  } else if (R.mode === 'climb') {
    R.climbT += dt / 1.2; const k = Math.min(1, R.climbT);
    root.position.y = Math.sin(k * Math.PI) * 0.25 + k * (ROOM.winY - 0.0);
    root.position.z = lerp(SILL_SPOT.z, -2.0, k);
    root.rotation.y = lerp(root.rotation.y, -2.3, 0.2);
    P.lL = P.lR = Math.sin(k * Math.PI) * 0.6;
    if (k >= 1) { R.mode = 'onsill'; sfx.thump(); R.wipeT = 0; }
  } else if (R.mode === 'onsill' || R.mode === 'idle') {
    R.walkPh = 0; P.lL = lerp(P.lL, 0, dt * 5); P.lR = lerp(P.lR, 0, dt * 5); P.bob = lerp(P.bob, 0, dt * 5);
    if (R.mode === 'onsill' && S.rain > 0.5) {
      // robot wipes the glass with big circles
      R.wipeT += dt;
      P.aRr = 1.6 + Math.sin(R.wipeT * 4) * 0.4; P.aRs = 0.6 + Math.cos(R.wipeT * 4) * 0.5; P.aLr = 0.1; P.aLs = 0;
      const head = robot.root.position;
      const u = (head.x + 0.12 + Math.sin(R.wipeT * 4) * 0.07 - W.glass.position.x) / (ROOM.winW) + 0.5;
      const v = (head.y + 0.55 + Math.cos(R.wipeT * 4) * 0.07 - (W.glass.position.y - ROOM.winH / 2)) / ROOM.winH;
      wipeFog(u, v, 16, 0.35);
      if (Math.random() < dt * 3) sfx.wipe();
    } else { P.aRr = lerp(P.aRr, 0.1, dt * 4); P.aRs = lerp(P.aRs, 0, dt * 4); }
  }
  if (R.danceT > 0) {
    R.danceT -= dt; const ph = t * 9;
    P.aLr = 1.2 + Math.sin(ph) * 0.6; P.aRr = 1.2 - Math.sin(ph) * 0.6; P.bob = Math.abs(Math.sin(ph)) * 0.02; P.neckYaw = Math.sin(ph * 0.5) * 0.4;
    if (R.mode !== 'onsill') root.rotation.y += dt * 3;
  }
  // carried bucket
  if (R.carry) { const hp = V3(0, 0.12, 0.12).applyMatrix4(robot.root.matrixWorld); W.bucket.position.set(hp.x, 0.04 + Math.abs(Math.sin(R.walkPh)) * 0.01, hp.z); }
}

// ------------------------------------------------------------------ main flow
let started = false;
function startGame() {
  setState('dress'); goShot('dress', 0);
  girl.setExpr('happy'); girl.setLook(V3(-0.86, 0.3, 0.32));
}

function update(dt, t) {
  S.t += dt; idleT += dt;
  const st = S.name;
  handleTouch(dt);
  // ---- scene 0: put on coveralls & gloves
  if (st === 'dress') {
    for (const k of ['cover', 'gloves']) {
      const o = pile.userData[k];
      if (o.userData.fly) { o.userData.fly += dt * 2.2; const f = Math.min(1, o.userData.fly); const gp = girl.root.position.clone().add(V3(0, 0.45, 0)); const home = k === 'cover' ? V3(-0.03, 0.2, 0) : V3(0.09, 0.2, 0.06); const w = pile.worldToLocal(gp.clone()); o.position.lerpVectors(home, w, ease(f)); o.position.y += Math.sin(f * Math.PI) * 0.2; o.scale.setScalar(1 - f * 0.9); if (f >= 1) o.visible = false; }
    }
    girl.setLook(touch.active ? V3(-0.86, 0.3, 0.32) : (S.t % 6 < 3 ? V3(-0.86, 0.3, 0.32) : cam.pos));
    const want = !S.dressed.coverall ? pile.userData.cover : !S.dressed.gloves ? pile.userData.gloves : null;
    glow(pile.userData.coverMat, !S.dressed.coverall, t); glow(pile.userData.gloveM, !S.dressed.gloves, t);
    if (want && idleT > 3.5) showHint(want.getWorldPosition(V3()).add(V3(0, 0.06, 0)));
    if (S.dressed.coverall && S.dressed.gloves && S.t > 0.1 && !S.done.dress) {
      S.done.dress = true; setTimeout(() => { sfx.chime(); girl.setExpr('proud'); voice('girl', 'yay'); }, 600);
      setTimeout(() => { setState('trunk'); goShot('trunk', 2.2); girl.setLook(W.trunk.position.clone().add(V3(0, 0.3, 0))); }, 1900);
    }
  }
  // ---- scene 1a: open the trunk, lift the robot out
  if (st === 'trunk') {
    const lid = W.trunk.userData.lid;
    if (S.lid > 0 && S.lid < 1) { S.lid = Math.min(1, S.lid + dt * 0.7); lid.rotation.x = -ease(S.lid) * 1.95; if (S.lid > 0.25 && !S.dustOut) { S.dustOut = 1; fx.rustBurst(V3(0, 0.4, -0.6), 30, V3(0, 1, 0)); } if (S.lid >= 1) { girl.setExpr('surprised'); setTimeout(() => girl.setExpr('happy'), 900); robot.setExpr('off'); } }
    glow(W.trunk.userData.latch.material, S.lid === 0, t);
    if (S.lid === 0 && idleT > 3.5) showHint(W.trunk.userData.latch.getWorldPosition(V3()));
    if (S.lid >= 1 && S.lift === 0 && idleT > 3) showHint(robot.head.getWorldPosition(V3()));
    if (S.lift > 0 && S.lift < 1) {
      S.lift = Math.min(1, S.lift + dt * 0.55); const k = ease(S.lift);
      robot.root.position.lerpVectors(P_LIE, ROBOT_FLOOR, k); robot.root.position.y += Math.sin(k * Math.PI) * 0.3;
      robot.root.quaternion.slerpQuaternions(Q_LIE, new THREE.Quaternion(), k);
      const c = robot.root.position.clone().add(V3(0, 0.25, 0));
      girl.reach[0] = c.clone().add(V3(-0.1, 0, 0.04)); girl.reach[1] = c.clone().add(V3(0.0, 0.05, 0.12));
      girl.setLook(c);
      if (S.lift >= 1) { girl.reach[0] = girl.reach[1] = null; sfx.thump(); fx.rustBurst(V3(0.03, 0.02, 0.02), 25, V3(0, 1, 0)); setTimeout(() => { setState('polish'); goShot('polish', 1.6); robot.markFront(solveShot(shots.polish).pos); }, 500); }
    }
  }
  // ---- scene 1b: polish
  if (st === 'polish') {
    const pr = S.prog = (S.t % 0.5 < dt) || !S.prog ? robot.progress() : S.prog;
    glow(brush.userData.glowMats[0], held !== brush && (pr.r < 0.75 || !held), t);
    glow(rag.userData.glowMats[0], held !== rag && pr.r > 0.45, t);
    if (!touch.active) girl.setLook(S.t % 8 > 5.5 ? camera.position : robot.head.getWorldPosition(V3()));
    if (idleT > 4) {
      if (held !== rag && pr.r > 0.75) showHint(rag.getWorldPosition(V3()).add(V3(0, 0.03, 0)));
      else if (!held) showHint(brush.getWorldPosition(V3()));
      else { if (!S.dull || S.t - S.dullT > 1.5) { S.dull = robot.dullestPoint(); S.dullT = S.t; } showHint(S.dull); }
    }
    // the girl reacts as it gets shinier
    if (pr.s > 0.35 && !S.done.s35) { S.done.s35 = 1; voice('girl', 'wow'); girl.setExpr('wow'); setTimeout(() => girl.setExpr('focus'), 1500); }
    if (pr.r > 0.82 && pr.s > 0.62 && !S.done.polish) {
      S.done.polish = true; rub(0, ''); up();
      girl.setExpr('laugh'); voice('girl', 'yay'); sfx.sparkle(); sfx.chime();
      for (let i = 0; i < 6; i++) setTimeout(() => fx.glint(robot.parts[Math.floor(Math.random() * 6)].getWorldPosition(V3()).add(V3((Math.random() - 0.5) * 0.15, (Math.random() - 0.3) * 0.2, 0.08)), 0.09), i * 180);
      setTimeout(() => { robot.setExpr('flicker'); robot.alive = 0.35; sfx.bootup(); }, 900);
      setTimeout(() => { sfx.squeak(1); robot.joints.neck.wig = 1; robot.setExpr('sad'); girl.setExpr('puzzled'); voice('girl', 'huh'); }, 2600);
      setTimeout(() => { hold(null); setState('oil'); goShot('oil', 1.4); can.visible = true; hold(can); }, 4200);
    }
  }
  // ---- scene 2a: oil the joints
  if (st === 'oil') {
    let allDone = true, nextJ = null;
    for (const [k, j] of Object.entries(robot.joints)) {
      const s = jointGlows[k]; j.obj.getWorldPosition(s.position);
      s.visible = j.oil < 1; s.material.opacity = 0.5 + 0.5 * Math.sin(t * 4 + k.length);
      s.scale.setScalar(0.06 + 0.015 * Math.sin(t * 4));
      if (j.oil < 1) { allDone = false; if (!nextJ) nextJ = s.position.clone(); }
    }
    if (idleT > 4 && nextJ) showHint(nextJ);
    if (!touch.active) girl.setLook(robot.head.getWorldPosition(V3()));
    // oiled joints come alive one by one
    const J = robot.joints, P = robot.pose;
    P.neckYaw = Math.sin(t * 1.3) * 0.5 * J.neck.oil; P.neckPitch = lerp(0.25, -0.05, J.neck.oil);
    P.aLr = 0.1 + Math.max(0, Math.sin(t * 2.0)) * 1.4 * J.armL.oil; P.aRr = 0.1 + Math.max(0, Math.sin(t * 2.0 + 2)) * 1.4 * J.armR.oil;
    P.lL = Math.sin(t * 2.4) * 0.3 * J.legL.oil; P.lR = -Math.sin(t * 2.4) * 0.3 * J.legR.oil;
    for (const j of Object.values(J)) if (j.wig > 0) j.wig -= dt;
    if (J.neck.wig > 0) P.neckYaw += Math.sin(t * 40) * 0.06 * J.neck.wig;
    robot.alive = lerp(robot.alive, 0.35 + 0.65 * (Object.values(J).reduce((a, j) => a + Math.min(1, j.oil), 0) / 5), dt * 2);
    if (allDone && !S.done.oil) {
      S.done.oil = true; robot.setExpr('happy'); sfx.bootup(); setTimeout(() => sfx.beep('happy'), 700); girl.setExpr('laugh'); voice('girl', 'yay');
      for (const s of Object.values(jointGlows)) s.visible = false;
      setTimeout(() => { robot.setExpr('idle'); }, 1800);
      setTimeout(() => { // dad arrives with the big can
        hold(null); dad.root.visible = true; dad.setExpr('proud'); voice('dad', 'here'); setState('dad'); goShot('dad', 1.6);
        bigCan.visible = true;
      }, 3000);
    }
  }
  // ---- scene 2b: dad's oil flood -> the robot spins
  if (st === 'dad' || st === 'dadpour') {
    const P = robot.pose; P.aLr = 0.3 + Math.sin(t * 3) * 0.2; P.aRr = 0.3 - Math.sin(t * 3) * 0.2; P.neckYaw = Math.sin(t) * 0.3;
    dad.setLook(robot.head.getWorldPosition(V3())); girl.setLook(dad.head.getWorldPosition(V3()));
    const pourAt = robot.head.getWorldPosition(V3()).add(V3(0.0, 0.32, 0.02));
    dad.reach[1] = pourAt.clone().add(V3(0.12, 0.05, 0)); dad.reach[0] = pourAt.clone().add(V3(0.14, -0.06, 0.06));
    dad.arms[1].hand.g.updateMatrixWorld(true);
    const hp = V3().setFromMatrixPosition(dad.arms[1].hand.g.matrixWorld);
    bigCan.position.lerp(hp.add(V3(-0.02, -0.12, 0)), 1 - Math.exp(-dt * 10));
    const tilt = st === 'dadpour' ? 1.5 : 0.3;
    bigCan.rotation.set(0, -Math.PI / 2, 0); bigCan.rotateX(tilt);
    if (st === 'dad' && S.t > 1.6) { setState('dadpour'); sfx.glug(); dad.setExpr('happy'); }
    if (st === 'dadpour') {
      S.pourT = (S.pourT || 0) - dt;
      if (S.pourT < 0 && S.t < 2.6) { S.pourT = 0.04; bigCan.updateMatrixWorld(true); const tip = bigCan.userData.tip.clone().applyMatrix4(bigCan.matrixWorld); fx.oilDrop(tip, V3((Math.random() - 0.5) * 0.1, -0.3, (Math.random() - 0.5) * 0.1), 0.007); }
      if (S.t > 0.6 && S.t < 2.8) { robot.paint(robot.head.getWorldPosition(V3()).add(V3(0, 0.1, 0)), 0.15, (a, i, f) => { a[i + 2] = Math.min(1, a[i + 2] + dt * 1.5 * f); }); addPuddle(robot.root.position.x + (Math.random() - 0.5) * 0.25, robot.root.position.z + (Math.random() - 0.5) * 0.25, 0.08 + Math.random() * 0.12); }
      if (S.t > 1.5 && !S.done.slip) { S.done.slip = 1; robot.setExpr('surprise'); girl.setExpr('surprised'); voice('girl', 'wow'); sfx.whee(); }
      if (S.t > 1.5) S.spin = Math.min(1, S.spin + dt * 0.8);
      if (S.t > 3.0) { dad.setExpr('oops'); voice('dad', 'oops'); dad.tilt = 0.15; dad.reach[0] = dad.head.getWorldPosition(V3()).add(V3(0.03, 0.1, 0.02)); }
      if (S.t > 4.0) { setState('spin'); hold(rag); girl.setExpr('determined'); voice('girl', 'hmm'); S.puddle = 1; }
    }
  }
  if (st === 'spin' || st === 'dadpour') {
    // slide-and-spin on the slick oil
    S.spinA += dt * S.spin * 7;
    robot.root.rotation.y += dt * S.spin * 7;
    const r = 0.12 * S.spin;
    robot.root.position.set(ROBOT_FLOOR.x + Math.cos(S.spinA * 0.35) * r, 0, ROBOT_FLOOR.z + Math.sin(S.spinA * 0.35) * r * 0.7);
    robot.pose.aLr = 1.3 * S.spin + 0.1; robot.pose.aRr = 1.3 * S.spin + 0.1; robot.pose.lL = Math.sin(t * 10) * 0.3 * S.spin; robot.pose.lR = -robot.pose.lL;
    if (S.spin > 0.3 && Math.random() < dt * 1.2) sfx.whee();
    if (S.spin > 0.2) robot.setExpr('dizzy');
  }
  if (st === 'spin') {
    if (S.t % 0.35 < dt) S.puddle = coverage(pg, 256, 256, 1);
    const target = clamp((S.puddle - 0.04) / 0.12, 0, 1);
    S.spin = lerp(S.spin, target * (S.grab > 0 ? 0.25 : 1), dt * 1.5); if (S.grab > 0) S.grab -= dt;
    dad.setLook(robot.head.getWorldPosition(V3()));
    if (!touch.active) girl.setLook(robot.head.getWorldPosition(V3()));
    bigCan.position.lerp(V3(0.85, 0, 0.35), dt * 3); bigCan.rotation.set(0, 0.3, 0);
    dad.reach[1] = null; if (S.t > 1.5) dad.reach[0] = null;
    if (idleT > 3.5) { const p = robot.root.position.clone().add(V3(0.15, 0.0, 0.12)); showHint(p); }
    if (S.spin < 0.04 && S.t > 2 && !S.done.spin) {
      S.done.spin = 1; S.spin = 0; robot.setExpr('dizzy'); sfx.beep('sad'); dad.tilt = 0;
      setTimeout(() => { robot.setExpr('happy'); sfx.beep('happy'); girl.setExpr('laugh'); voice('girl', 'giggle'); dad.setExpr('laugh'); voice('dad', 'yay'); }, 1400);
      setTimeout(() => { sfx.chime(); }, 2200);
      setTimeout(() => toWindow(), 4200);
    }
  }
  // ---- scene 3: help in the rain; wipe the window, catch the drips -> rainbow
  if (st === 'window' || st === 'free') {
    updateRobotS3(dt, t);
    dripT -= dt;
    if (dripT < 0 && S.rain > 0.3) { dripT = 0.9 + Math.random() * 0.6; fx.waterDrop(LEAK.clone().add(V3((Math.random() - 0.5) * 0.01, 0, 0)), V3(0, -0.1, 0), 0.004); sfx.drip(); }
    const wl = W.bucket.userData.water; wl.visible = W.bucket.userData.level > 0.02; wl.position.y = 0.02 + W.bucket.userData.level * 0.2; wl.scale.setScalar(0.85 + W.bucket.userData.level * 0.17);
    if (S.t % 0.5 < dt) S.fogCov = coverage(W.fog.ctx, 256, 256, 0);
    if (!touch.active) girl.setLook(R.mode === 'walk' ? robot.head.getWorldPosition(V3()) : (S.t % 7 < 3.5 ? cam.pos : W.glass.position));
    glow(W.bucket.children[0].material, !S.bucketPlaced && R.mode !== 'walk', t);
    if (idleT > 4) showHint(!S.bucketPlaced ? W.bucket.position.clone().add(V3(0, 0.28, 0)) : S.fogCov < 0.6 ? W.glass.position.clone().add(V3(-0.15, -0.2, 0)) : null);
    if (st === 'window' && S.bucketPlaced && S.fogCov > 0.5 && !S.done.rain) {
      S.done.rain = 1; S.rainStop = 0.0001; setRain(0); sfx.fanfare(); setTimeout(() => sfx.birds(), 1800); setTimeout(() => sfx.birds(), 4200);
      girl.setExpr('laugh'); voice('girl', 'wow'); robot.setExpr('happy'); R.danceT = 3;
      setTimeout(() => { setState('free'); }, 2000);
    }
    if (S.rainStop > 0) {
      S.rainStop = Math.min(1, S.rainStop + dt * 0.25); const k = ease(S.rainStop);
      S.rain = 1 - k; const gu = W.glassMat.uniforms;
      gu.uRain.value = 1 - k * 0.7; gu.uSun.value = k; gu.uRainbow.value = k; gu.uBright.value = 1.25 + k * 0.35; gu.uFogAmt.value = 1 - k;
      W.sun.color.copy(kelvin(7200)).lerp(kelvin(4800), k); W.sun.intensity = 2.2 + k * 5;
      W.winFill.intensity = 6 + k * 4; W.hemi.intensity = 0.55 + k * 0.3; fx.dustMat.uniforms.uBright.value = 1 + k * 1.5;
      post.compMat.uniforms.uWarm.value = k * 0.5;
      if (k > 0.5 && !S.envSun) { S.envSun = 1; scene.environment = W.buildEnv(renderer, 1, 1); }
    }
    if (st === 'free' && S.t % 9 < dt && R.mode === 'onsill') { robot.setExpr(Math.random() < 0.5 ? 'happy' : 'idle'); }
  }
}
function toWindow() {
  fade(() => {
    setState('window'); goShot('window', 0);
    dad.root.visible = false; bigCan.visible = false; hold(null);
    girl.poseMode = 'stand'; girl.root.position.set(-0.3, 0, -1.82); girl.root.rotation.y = Math.PI - 0.55; girl.setExpr('happy');
    robot.root.position.set(0.32, 0, -1.5); robot.root.rotation.set(0, -0.6, 0); S.spin = 0; robot.setExpr('idle');
    W.bucket.position.set(0.78, 0, -1.62);
    W.glassMat.uniforms.uFogAmt.value = 1;
    puddle.visible = false; robot.ao.visible = true;
    W.trunk.userData.lid.rotation.x = 0; W.trunk.position.set(-1.3, 0, -0.35); W.trunk.rotation.y = 0.5;
  });
}
function fade(mid) {
  const u = post.compMat.uniforms.uFade; let f = 0, dir = 1;
  const step = () => { f += dir * 0.06; u.value = clamp(f, 0, 1); if (f >= 1 && dir > 0) { mid(); dir = -1; } if (f > 0 || dir > 0) requestAnimationFrame(step); else u.value = 0; };
  step();
}
function glow(mat, on, t) {
  if (!mat || !mat.emissive) return;
  const k = on ? 0.06 + 0.06 * (0.5 + 0.5 * Math.sin(t * 4)) : 0;
  mat.emissive.setRGB(k * 1.0, k * 0.8, k * 0.55);
}

// ------------------------------------------------------------------ loop
const clock = new THREE.Timer(); clock.connect && clock.connect(document);
let fpsAcc = 0, fpsN = 0, fpsCheck = 0, tAll = 0;
function frame() {
  requestAnimationFrame(frame);
  clock.update(); const dt = Math.min(0.05, clock.getDelta()); tAll += dt;
  if (started) update(dt, tAll);
  // camera
  if (cam.t < 1) { cam.t = Math.min(1, cam.t + dt / cam.dur); const k = ease(cam.t); cam.pos.lerpVectors(cam.fromPos, cam.toPos, k); cam.tgt.lerpVectors(cam.fromTgt, cam.toTgt, k); }
  if (DBGCAM) { cam.pos.set(DBGCAM[0], DBGCAM[1], DBGCAM[2]); cam.tgt.set(DBGCAM[3], DBGCAM[4], DBGCAM[5]); cam.dist = cam.pos.distanceTo(cam.tgt); }
  camera.position.copy(cam.pos).add(V3(Math.sin(tAll * 0.5) * 0.004, Math.sin(tAll * 0.37) * 0.003, 0));
  camera.lookAt(cam.tgt);
  post.compMat.uniforms.uFocus.value = camera.position.distanceTo(cam.tgt);
  post.compMat.uniforms.uRange.value = 0.55 + 0.3 * (cam.dist || 1.5);
  if (params.get('look') === 'cam') { girl.setLook(camera.position); girl.reach[0] = null; }
  if (params.get('ex')) girl.setExpr(params.get('ex'));
  if (params.get('rob')) { robot.alive = 1; robot.setExpr(params.get('rob')); for (const g of Object.values(jointGlows)) g.visible = false; can.visible = false; }
  robot.update(dt, tAll); girl.update(dt, tAll); if (dad.root.visible) dad.update(dt, tAll);
  placeHeld(dt);
  fx.update(dt, tAll, S.name === 'oil' ? [(p) => false] : null);
  // drops aimed at a robot point land when they reach it
  for (const d of fx.oil.p) if (d.alive && d.target && d.pos.y <= d.target.y + 0.004) { d.pos.y = -1; }
  W.glassMat.uniforms.uTime.value = tAll;
  // flicker of the work lamp filament
  W.spot.intensity = 13 * (0.985 + 0.015 * Math.sin(tAll * 23) * Math.sin(tAll * 7));
  // hint hand
  if (hintTarget) {
    const q = hintTarget.clone().project(camera);
    hint.style.opacity = '1';
    const x = (q.x * 0.5 + 0.5) * window.innerWidth, y = (-q.y * 0.5 + 0.5) * window.innerHeight;
    hint.style.transform = `translate(${x - 8}px, ${y - 4 + Math.abs(Math.sin(tAll * 4)) * -14}px)`;
  } else hint.style.opacity = '0';
  post.render(scene, camera, tAll);
  // adaptive quality: keep >= 30fps on phones
  fpsAcc += dt; fpsN++;
  if (fpsAcc > 2 && started) {
    const fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; fpsCheck++;
    if (fps < 34 && Q.dpr > 1) { Q.dpr = Math.max(1, Q.dpr - 0.25); resize(); }
    else if (fps < 30 && post.compMat.uniforms.uDof.value) { post.compMat.uniforms.uDof.value = 0; }
  }
}

// ------------------------------------------------------------------ boot
resize();
goShot('dress', 0);
scene.environmentIntensity = 1.25;
allLoaded().then(() => {
  scene.environment = W.buildEnv(renderer);
  // warm up shaders then reveal
  renderer.compile(scene, camera);
  started = true; startGame();
  for (const k of Object.keys(params)) void k;
  if (params.get('s') && params.get('s') !== 'dress') debugJump(params.get('s'));
  requestAnimationFrame(() => document.body.classList.add('ready'));
});
frame();

// ------------------------------------------------------------------ debug: ?s=polish|oil|spin|window|free  (&p=0.5 polish amount)
function debugJump(s) {
  girl.dress('coverall'); girl.dress('gloves'); S.dressed.coverall = S.dressed.gloves = true; S.done.dress = true;
  pile.userData.cover.visible = pile.userData.gloves.visible = false;
  W.trunk.userData.lid.rotation.x = -1.95; S.lid = 1; S.lift = 1;
  robot.root.position.copy(ROBOT_FLOOR); robot.root.rotation.set(0, 0, 0);
  const pp = parseFloat(params.get('p') || '0');
  const fill = (r, s, o) => { for (const p of robot.parts) { const a = p.geometry.attributes.aState.array; for (let i = 0; i < a.length; i += 3) { a[i] = r; a[i + 1] = s; a[i + 2] = o; } p.geometry.attributes.aState.needsUpdate = true; } };
  if (s === 'trunk') { setState('trunk'); goShot('trunk', 0); W.trunk.userData.lid.rotation.x = 0; S.lid = 0; S.lift = 0; robotInTrunk(); return; }
  if (s === 'polish') { setState('polish'); goShot('polish', 0); robot.markFront(cam.pos); if (pp) { fill(pp, pp > 0.5 ? (pp - 0.5) * 2 : 0, 0); } return; }
  fill(1, 1, 0); robot.dust = [0, 0, 0];
  if (s === 'half') { setState('polish'); goShot('polish', 0); robot.markFront(cam.pos); for (const p of robot.parts) { const a = p.geometry.attributes.aState.array, pos = p.geometry.attributes.position; const wp = V3(); for (let i = 0; i < pos.count; i++) { wp.fromBufferAttribute(pos, i).applyMatrix4(p.matrixWorld); const k = clamp((wp.x + 0.02) * 12, 0, 1); a[i * 3] = k; a[i * 3 + 1] = clamp((wp.x - 0.04) * 10, 0, 1); } p.geometry.attributes.aState.needsUpdate = true; } return; }
  robot.alive = 1; robot.setExpr('happy');
  if (s === 'oil') { robot.alive = 0.35; robot.setExpr('sad'); setState('oil'); goShot('oil', 0); can.visible = true; hold(can); return; }
  for (const j of Object.values(robot.joints)) j.oil = 1;
  if (s === 'dad') { S.done.oil = true; dad.root.visible = true; bigCan.visible = true; setState('dad'); goShot('dad', 0); return; }
  if (s === 'spin') { S.done.oil = true; dad.root.visible = true; bigCan.visible = true; for (let i = 0; i < 20; i++) addPuddle(ROBOT_FLOOR.x + (Math.random() - 0.5) * 0.3, ROBOT_FLOOR.z + (Math.random() - 0.5) * 0.3, 0.12); S.spin = 1; setState('spin'); hold(rag); goShot('dad', 0); dad.setExpr('oops'); girl.setExpr('determined'); return; }
  if (s === 'window' || s === 'free') { setState('window'); toWindowNow(); if (s === 'free') { S.bucketPlaced = true; W.bucket.position.set(LEAK.x, 0, LEAK.z); for (let i = 0; i < 60; i++) wipeFog(Math.random(), Math.random(), 40, 2); S.done.rain = 1; S.rainStop = 0.95; S.name = 'free'; } }
}
function toWindowNow() {
  setState('window'); goShot('window', 0); girl.poseMode = 'stand'; girl.root.position.set(-0.3, 0, -1.82); girl.root.rotation.y = Math.PI - 0.55;
  robot.root.position.set(0.32, 0, -1.5); robot.root.quaternion.identity(); robot.root.rotation.set(0, -0.6, 0); robot.setExpr('idle'); W.bucket.position.set(0.78, 0, -1.62); W.glassMat.uniforms.uFogAmt.value = 1; puddle.visible = false;
  W.trunk.userData.lid.rotation.x = 0; W.trunk.position.set(-1.3, 0, -0.35); W.trunk.rotation.y = 0.5;
}
window.__dbg = { S, robot, girl, dad, W, cam, goShot, fx, pile, brush, rag, can, camera, THREE, LEAK, R };
