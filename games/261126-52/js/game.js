// game.js — scenes: title (dress up) -> s1 brush snow -> s2 hot-water de-ice (+dad freezes) -> s3 lights, marshal, take-off, snowmen
import * as THREE from 'three';
import { C, L, setShot, setTodLighting, updateEnv, aimKey, SUN_DIR, post, rand, clamp, lerp, smooth, damp, pbr, tex, setMap } from './core.js';
import { FX, puff, steam, breath, sparkle } from './fx.js';
import { sfx, setLoop, setEngine, unlockAudio } from './audio.js';
import { buildPlane, fusPoint, L as FL, capU } from './plane.js';
import { buildPerson, setOutfit, addFrost } from './people.js';
import { buildWorld, buildRack, GROUND } from './world.js';
import { Field } from './field.js';

const V3 = THREE.Vector3;
export const G = { state: 'boot', t: 0, stateT: 0, lastInput: 0, hint: null, hintKind: 'tap' };
let plane, girl, dad, W, rack;
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();

// ------------------------------------------------------------ setup
export function setupGame() {
  W = buildWorld();
  plane = buildPlane();
  C.scene.add(plane.root);
  girl = buildPerson('girl');
  dad = buildPerson('dad');
  C.scene.add(girl.root, dad.root);
  rack = buildRack(girl);
  dad.frostField = new Field(128, 128, 1, { wrapU: true });
  addFrost(dad, dad.frostField);
  // snow clumps land on the ground and pile up there
  FX.clump.floor = (x, z) => W.groundY(x, z);
  FX.clump.onLand = (i, x, y, z) => {
    const [u, v] = W.groundUV(x, z);
    if (u > 0 && v > 0 && u < 1 && v < 1) {
      const add = FX.clump.size[i] * 0.5;
      W.groundField.brush(u, v, 0.012 + FX.clump.size[i] * 0.1, 0.012 + FX.clump.size[i] * 0.1, (idx, k) => { W.groundField.c[0][idx] = Math.min(1, W.groundField.c[0][idx] + add * k); });
    }
    puff({ x, y: y + 0.02, z }, 1, 0.5);
    return true;
  };
  FX.drops.floor = (x, z) => W.groundY(x, z);
  FX.drops.onLand = () => true;
  G.plane = plane; G.girl = girl; G.dad = dad; G.W = W;
  enter('title');
  // debug: ?s=s1|s2|s3w|s3m|s3t|s3p jumps straight to a scene (for screenshots)
  const q = new URLSearchParams(location.search).get('s');
  if (q && S[q]) {
    rack.g.visible = false; setOutfit(girl, 'jacket'); girl.muffs.visible = true; girl.st.shiver = 0;
    if (q !== 's1') { plane.iceMesh.visible = true; for (const ic of plane.icicles) ic.visible = true; }
    if (q === 's3w' || q === 's3m' || q === 's3t' || q === 's3p') { G.dadState = 'thawed'; plane.iceField.c[0].fill(0); plane.iceField.c[2].fill(0.5); plane.iceField.dirty = true; for (const ic of plane.icicles) ic.visible = false; }
    if (q !== 's1') { for (const f of [plane.fusSnow, plane.wingSnowP, plane.wingSnowS]) { f.c[0].fill(0); f.dirty = true; } capU.capSnow.value = 0; }
    if (q === 's3m' || q === 's3t' || q === 's3p') { for (const w of plane.windows) { w.on = true; w.lit = 1; plane.setWindow(w.id, 1); } plane.setWindow(30, 1); }
    enter(q);
  }
  window.__S = S; window.__enter = enter;
}

// ------------------------------------------------------------ state machine
const S = {};
function enter(name) {
  G.state = name; G.stateT = 0; G.lastInput = G.t; G.done = false;
  if (S[name] && S[name].enter) S[name].enter();
}
let fadeT = 0, fadeDir = 0, fadeCb = null;
function fadeTo(cb, dur = 0.6) { fadeDir = 1; fadeCb = cb; fadeT = 0; G.fadeDur = dur; }
function updateFade(dt) {
  const u = post.final.uniforms.fade;
  if (fadeDir === 1) { u.value = Math.min(1, u.value + dt / G.fadeDur); if (u.value >= 1) { fadeDir = -1; const cb = fadeCb; fadeCb = null; cb && cb(); } }
  else if (fadeDir === -1) { u.value = Math.max(0, u.value - dt / 0.7); if (u.value <= 0) fadeDir = 0; }
}
const later = [];
function after(sec, fn) { later.push({ t: G.t + sec, fn }); }

function place(obj, x, z, ry = 0, lift = 0) { obj.position.set(x, W.groundY(x, z) + lift, z); obj.rotation.y = ry; }
function faceTo(p, x, z) { return Math.atan2(x - p.root.position.x, z - p.root.position.z); }

// ------------------------------------------------------------ TITLE: put on the jacket and earmuffs
S.title = {
  enter() {
    setTodLighting(0.08); updateEnv(true);
    // girl stands by the rack near the snow-covered nose
    place(girl.root, 9.55, -3.3, 0);
    girl.root.rotation.y = Math.PI - 0.45;
    place(rack.g, 10.75, -3.2, -0.25);
    place(W.step, 3.6, -2.15, 0.0);
    place(W.cart.g, -2.2, -3.0, 0.4);
    place(W.worklight.g, 10.6, -2.2, -2.2);
    place(W.sign, -2.6, -5.8, 0.5);
    place(dad.root, -2.8, -9.6, 0.4);
    dad.root.visible = false;
    girl.muffs.visible = false;
    setOutfit(girl, 'sweater');
    girl.st.shiver = 0.6;
    girl.setBase('cold');
    L.work.position.set(10.6, 1.75, -2.2); L.work.target.position.set(9.4, 1.0, -3.6);
    aimKey(new V3(6, 0, -3), new V3(-0.6, 0.8, -0.5), 12);
    setShot({ target: [10.15, 0.95, -3.4], targetP: [10.05, 0.95, -3.4], dir: [0.12, 0.08, -1], fit: [1.3, 0.75], fitP: [0.75, 1.05], mm: 45 }, 0);
    C.aperture = 0.14; C.exposure = 1.0;
    G.titleStep = 0;
  },
  update(dt) {
    girl.lookAt(G.titleStep === 0 ? rack.jacket.getWorldPosition(new V3()) : G.titleStep === 1 ? rack.muffs.getWorldPosition(new V3()) : C.camera.position);
    G.hint = G.titleStep === 0 ? rack.jacket.getWorldPosition(new V3()).add(new V3(0, 0.05, 0.1)) : G.titleStep === 1 ? rack.muffs.getWorldPosition(new V3()) : null;
    G.hintKind = 'tap';
    if (G.anim) G.anim(dt);
  },
  down(p) {
    const hits = pick(p, [rack.jacket, rack.muffs]);
    if (!hits) return;
    let obj = hits.object; while (obj && obj !== rack.jacket && obj !== rack.muffs) obj = obj.parent;
    if (obj === rack.jacket && G.titleStep === 0) wearJacket();
    else if (obj === rack.muffs && G.titleStep === 1) wearMuffs();
    else if (obj === rack.muffs && G.titleStep === 0) { girl.say('huh', 1.2, 'cold'); sfx.huh(); wobble(rack.muffs); }
  },
};
function wobble(o) { const r0 = o.rotation.z; let t = 0; const prev = G.anim; G.anim = (dt) => { prev && prev(dt); t += dt; o.rotation.z = r0 + Math.sin(t * 20) * 0.15 * Math.max(0, 1 - t * 2); }; }
function flyTo(obj, targetFn, dur, done) {
  const start = obj.getWorldPosition(new V3());
  C.scene.attach(obj);
  let t = 0;
  G.anim = (dt) => {
    t += dt / dur;
    const e = smooth(t);
    const tgt = targetFn();
    obj.position.lerpVectors(start, tgt, e); obj.position.y += Math.sin(e * Math.PI) * 0.35;
    obj.rotation.y += dt * 3 * (1 - e);
    const s = 1 - 0.15 * Math.sin(e * Math.PI); obj.scale.setScalar(s);
    if (t >= 1) { G.anim = null; done(); }
  };
}
function wearJacket() {
  G.titleStep = 0.5; sfx.wear();
  flyTo(rack.jacket, () => girl.joints.spine.getWorldPosition(new V3()), 0.7, () => {
    rack.jacket.visible = false;
    setOutfit(girl, 'jacket');
    puff(girl.joints.chest.getWorldPosition(new V3()), 10, 1.2);
    girl.st.shiver = 0.15; girl.say('wow', 1.0, 'smile'); girl.st.bounce = 1;
    sfx.pop();
    G.titleStep = 1;
  });
}
function wearMuffs() {
  G.titleStep = 1.5; sfx.wear();
  flyTo(rack.muffs, () => girl.joints.head.getWorldPosition(new V3()), 0.6, () => {
    rack.muffs.visible = false; girl.muffs.visible = true;
    girl.st.shiver = 0; girl.say('laugh', 1.6, 'smile'); girl.st.bounce = 1; girl.st.cheer = 1;
    sparkle(girl.joints.head.getWorldPosition(new V3()), 16, 0.6);
    sfx.fanfare();
    G.titleStep = 2;
    after(2.2, () => fadeTo(() => enter('s1'), 0.7));
  });
}

// ------------------------------------------------------------ S1: brush the snow off the buried plane
const S1REG = { u0: 10.0 / FL, u1: 14.9 / FL, v0: 0.005, v1: 0.42 }; // port side + top, nose->front cabin
const _sp = new V3();
function onScreen(p, m = 0.92) { _sp.copy(p).project(C.camera); return _sp.z < 1 && Math.abs(_sp.x) < m && Math.abs(_sp.y) < m; }
// texels of the fuselage snow that are visible in the current framing (aspect-dependent)
let s1Vis = null, s1VisT = -9;
function s1Visible() {
  if (s1Vis && G.t - s1VisT < 2) return s1Vis;
  s1VisT = G.t; s1Vis = [];
  const f = plane.fusSnow, w = f.w, h = f.h;
  for (let y = Math.floor(S1REG.v0 * h); y < Math.floor(S1REG.v1 * h); y += 3) {
    const v = (y + 0.5) / h, th = (1 - v) * Math.PI * 2;
    if (Math.cos(th) < -0.45) continue;
    for (let x = Math.floor(S1REG.u0 * w); x < Math.floor(S1REG.u1 * w); x += 3) {
      const p = plane.body.localToWorld(fusPoint((x + 0.5) / w, v));
      if (onScreen(p, 0.9)) s1Vis.push(y * w + x);
    }
  }
  return s1Vis;
}
function s1Coverage() {
  const f = plane.fusSnow, vis = s1Visible();
  if (!vis.length) return 0;
  let clear = 0;
  for (const i of vis) if (f.c[0][i] < 0.06) clear++;
  return clear / vis.length;
}
S.s1 = {
  enter() {
    rack.g.visible = false;
    // girl on the step in front of the nose, facing the plane in profile toward the camera side
    W.step.scale.y = 1;
    place(W.step, 8.8, 0.35, -2.1);
    W.step.position.y = W.groundY(8.8, 0.35) - 0.12;
    place(girl.root, 8.75, 0.35, 0);
    girl.root.position.y = W.step.position.y + 0.455;
    girl.root.rotation.y = -2.1;
    place(W.worklight.g, 5.6, -4.4, -0.6);
    L.work.position.set(5.6, 1.75, -4.4); L.work.target.position.set(6.6, 1.5, -1.4);
    W.brush.g.visible = true;
    girl.setBase('focus');
    aimKey(new V3(4, 0, -2), new V3(-0.5, 0.75, -0.6), 11);
    setShot({ target: [7.0, 2.0, -0.6], targetP: [7.55, 1.95, -0.4], dir: [0.8, 0.06, -1], fit: [2.3, 1.25], fitP: [1.25, 1.95], mm: 40 }, 0);
    C.aperture = 0.12; C.exposure = 1.0;
    G.brushPrev = null; G.brushing = false; G.s1cov = 0; G.revealed = new Set();
    G.brushHead = plane.body.localToWorld(fusPoint(13.6 / FL, 0.12)).add(new V3(0, 0.55, -0.35));
  },
  update(dt) {
    const tod = 0.08 + G.s1cov * 0.25;
    if (Math.abs(tod - C.tod) > 0.01) setTodLighting(tod);
    updateEnv(false);
    // girl holds the telescopic brush; hands on the grip, IK
    const head = G.brushHead;
    const hands = girl.joints.chest.localToWorld(new V3(0.02, 0.0, 0.16));
    const dir = head.clone().sub(hands).normalize();
    const b = W.brush.g;
    const len = head.distanceTo(hands) + 0.25;
    b.position.copy(hands).addScaledVector(dir, -0.25);
    b.quaternion.setFromUnitVectors(new V3(0, 1, 0), dir);
    W.brush.pole.scale.y = len; W.brush.pole.position.y = len / 2; W.brush.head.position.y = len;
    // brush head faces the surface
    girl.arms[1].target = hands.clone().addScaledVector(dir, 0.02); girl.arms[1].pole = hands.clone().add(new V3(0.3, -0.5, -0.2)); girl.arms[1].w = 1;
    girl.arms[0].target = hands.clone().addScaledVector(dir, 0.2); girl.arms[0].pole = hands.clone().add(new V3(-0.3, -0.5, -0.2)); girl.arms[0].w = 1;
    girl.root.rotation.y = damp(girl.root.rotation.y, clamp(Math.atan2(head.x - girl.root.position.x, head.z - girl.root.position.z), -2.6, -0.9), 3, dt);
    girl.st.lean = damp(girl.st.lean, G.brushing ? 0.12 : 0.03, 4, dt);
    if (!G.lookAtCam) girl.lookAt(head);
    // progress
    if ((G.t * 4 | 0) !== ((G.t - dt) * 4 | 0)) {
      G.s1cov = s1Coverage();
      // reveal moments: cockpit, door, windows
      for (const [key, u, v] of [['cockpit', 13.35 / FL, 0.04], ['w1', 10.96 / FL, 0.226], ['w2', 10.24 / FL, 0.226], ['door', 11.75 / FL, 0.25]]) {
        if (!G.revealed.has(key) && plane.fusSnow.get(0, u, v) < 0.05) {
          G.revealed.add(key); girl.say('wow', 1.2, 'focus'); sfx.ping(G.revealed.size + 2);
          G.lookAtCam = true; after(1.0, () => { G.lookAtCam = false; });
          girl.lookAt(C.camera.position);
        }
      }
      if (G.s1cov > 0.72 && !G.done) { G.done = true; avalanche(); }
    }
    if (G.lookAtCam) girl.lookAt(C.camera.position);
    setLoop('brush', G.brushing ? Math.min(0.35, G.brushSpeed * 0.18) : 0, 1800 + G.brushSpeed * 600);
    G.brushSpeed = damp(G.brushSpeed || 0, 0, 6, dt);
    // hint: thickest remaining snow in the region
    if ((G.t * 2 | 0) !== ((G.t - dt) * 2 | 0)) G.hint = G.done ? null : thickestSnow();
    G.hintKind = 'drag';
    if (G.slideAnim) G.slideAnim(dt);
  },
  down(p) { G.brushing = true; G.brushPrev = null; this.move(p); },
  move(p) {
    if (!G.brushing || G.done) return;
    const h = pick(p, [plane.fus]);
    if (!h) return;
    const wp = h.point.clone();
    // brush head sits on the snow surface above the hit
    const d = plane.fusSnow.get(0, h.uv.x, h.uv.y) * 0.75;
    const n = h.face.normal.clone().transformDirection(h.object.matrixWorld);
    const surf = wp.clone().addScaledVector(n, d + 0.03);
    const moved = G.brushPrev ? surf.distanceTo(G.brushPrev) : 0.05;
    G.brushPrev = surf.clone();
    G.brushHead.lerp(surf, 0.7);
    G.brushSpeed = Math.min(3, (G.brushSpeed || 0) + moved * 8);
    brushSnow(h.uv.x, h.uv.y, Math.min(0.12, moved) + 0.02, n, surf);
  },
  up() { G.brushing = false; },
};
function brushSnow(u, v, amount, n, surf) {
  const f = plane.fusSnow;
  const x = u * FL;
  const ru = 0.24 / FL, rv = 0.24 / (2 * Math.PI * Math.max(0.3, plane_r(x)));
  let removed = 0;
  f.brush(u, v, ru, rv, (i, k) => {
    const old = f.c[0][i];
    const nv = Math.max(0, old - amount * 2.2 * k - (old < 0.1 ? 0.03 * k : 0));
    removed += old - nv; f.c[0][i] = nv;
  });
  // the stroke throws powder and drops clumps that pile on the ground
  if (removed > 0.02) {
    const down = new V3(n.x * 0.6, -0.4, n.z * 0.6);
    const nC = Math.min(6, 1 + (removed * 0.8) | 0);
    for (let i = 0; i < nC; i++) {
      FX.clump.emit({ p: [surf.x + rand(-.12, .12), surf.y + rand(-.05, .05), surf.z + rand(-.12, .12)], v: [down.x * rand(0.5, 1.5) + rand(-.4, .4), down.y + rand(-.3, .6), down.z * rand(0.5, 1.5) + rand(-.4, .4)], size: rand(0.03, 0.11), life: 4, alpha: 1, drag: 0.15, grav: 9.8, tint: [0.97, 0.98, 1], spin: rand(-4, 4) });
    }
    puff(surf, 3 + Math.min(5, removed * 2) | 0, 0.8);
    if (Math.random() < 0.3) sfx.powder();
  }
}
function plane_r(x) { return x > 12.6 ? Math.max(0.2, Math.pow(Math.max(0, 1 - Math.pow((x - 12.6) / 2.4, 2.3)), 0.5)) : 1; }
function thickestSnow() {
  const f = plane.fusSnow, vis = s1Visible(); let best = 0, bi = -1;
  for (let k = 0; k < 160 && vis.length; k++) { const i = vis[(Math.random() * vis.length) | 0]; if (f.c[0][i] > best) { best = f.c[0][i]; bi = i; } }
  if (best < 0.06) return null;
  const x = bi % f.w, y = (bi / f.w) | 0;
  return plane.body.localToWorld(fusPoint((x + 0.5) / f.w, (y + 0.5) / f.h));
}
function avalanche() {
  // the remaining snow loosens and slides off every surface; reveals the iced wing
  sfx.slide(); C.shake = 1.2;
  girl.say('laugh', 2.5, 'smile'); girl.st.cheer = 1; girl.st.bounce = 1;
  G.lookAtCam = true;
  let t = 0;
  const fields = [plane.fusSnow, plane.wingSnowP, plane.wingSnowS];
  plane.iceMesh.visible = true; for (const ic of plane.icicles) ic.visible = true;
  G.slideAnim = (dt) => {
    t += dt;
    for (const f of fields) {
      const a = f.c[0];
      for (let i = 0; i < a.length; i++) if (a[i] > 0) a[i] = Math.max(0, a[i] - dt * (0.35 + 0.3 * ((i * 7919) % 13) / 13));
      f.dirty = true;
    }
    capU.capSnow.value = Math.max(0, 1 - t * 0.5);
    if (t < 2.2) {
      for (let k = 0; k < 6; k++) {
        const u = rand(0.15, 0.95), v = rand(0.55, 1.0);
        if (plane.fusSnow.get(0, u, v) < 0.05) continue;
        const p = plane.body.localToWorld(fusPoint(u, v));
        FX.clump.emit({ p: [p.x, p.y + 0.3, p.z], v: [rand(-1, 1), rand(-0.5, 0.5), p.z < 0 ? -rand(0.5, 2) : rand(0.5, 2)], size: rand(0.06, 0.18), life: 4, alpha: 1, drag: 0.1, grav: 9.8, tint: [0.97, 0.98, 1], spin: rand(-4, 4) });
        puff(p, 2, 1.4);
      }
    }
    if (t > 3.2 && !G.s1end) { G.s1end = true; sfx.fanfare(); sparkle(plane.body.localToWorld(new V3(13.2, 2.4, -0.6)), 30, 1.5); after(2.0, () => fadeTo(() => enter('s2'), 0.7)); }
  };
}

// ------------------------------------------------------------ S2: hot water on the wing ice; dad freezes himself
const ICE_U0 = 0.36, ICE_U1 = 0.93; // outboard of the engine
let iceVis = null, iceVisT = -9;
function iceVisible() {
  if (iceVis && G.t - iceVisT < 2) return iceVis;
  iceVisT = G.t; iceVis = [];
  const f = plane.iceField;
  for (let y = Math.floor(0.53 * f.h); y < Math.floor(0.97 * f.h); y += 2) for (let x = Math.floor(ICE_U0 * f.w); x < Math.floor(ICE_U1 * f.w); x += 2) {
    if (onScreen(plane.body.localToWorld(plane.wingP((x + 0.5) / f.w, (y + 0.5) / f.h)), 0.9)) iceVis.push(y * f.w + x);
  }
  return iceVis;
}
function iceCoverage() {
  const f = plane.iceField, vis = iceVisible();
  if (!vis.length) return 0;
  let gone = 0; for (const i of vis) if (f.c[0][i] < 0.05) gone++;
  return gone / vis.length;
}
S.s2 = {
  enter() {
    G.slideAnim = null; G.lookAtCam = false;
    for (const f of [plane.fusSnow, plane.wingSnowP, plane.wingSnowS]) { f.c[0].fill(0); f.dirty = true; }
    capU.capSnow.value = 0;
    W.brush.g.visible = false;
    for (const a of girl.arms) a.w = 0;
    setTodLighting(0.38); updateEnv(true);
    // the girl stands on the step beyond the leading edge and sprays toward us across the wing;
    // dad further outboard; the hot/cold rig beside her
    place(W.step, 2.45, -5.0, Math.PI / 2);
    W.step.scale.y = 1.55;
    W.step.position.y = W.groundY(2.45, -5.0) - 0.12;
    place(girl.root, 2.5, -5.0, 0);
    girl.root.position.y = W.step.position.y + 0.455 * 1.55;
    girl.root.rotation.y = -Math.PI / 2;
    place(dad.root, 2.15, -7.6, 0); dad.root.rotation.y = -Math.PI / 2 - 0.3;
    dad.root.visible = true; dad.say('smile', 1, 'smile');
    place(W.cart.g, 3.3, -3.55, Math.PI / 2 + 0.35);
    place(W.sign, 1.6, -9.3, -Math.PI / 2 + 0.35);
    place(W.worklight.g, -2.8, -3.6, 1.0);
    L.work.position.set(-2.8, 1.75, -3.6); L.work.target.position.set(1.8, 1.3, -6.0);
    aimKey(new V3(0, 0, -5), new V3(-0.55, 0.7, -0.45), 10);
    setShot({ target: [1.5, 1.45, -5.6], targetP: [1.75, 1.5, -5.25], dir: [-1, 0.3, -0.12], fit: [1.5, 0.75], fitP: [1.0, 1.55], mm: 40 }, 0);
    C.aperture = 0.035; C.exposure = 0.85; C.focusTarget = 3.0;
    G.tool = null; G.spraying = false; G.sprayTarget = null; G.dadState = 'ok'; G.wrongTries = 0;
    G.runnels = [];
    girl.setBase('smile');
    W.lance.g.visible = false; W.hose.visible = false;
    G.s2t0 = G.t;
  },
  update(dt) {
    setTodLighting(0.38 + iceCoverageCached() * 0.22);
    updateEnv(false);
    const cov = iceCoverageCached();
    // dad: idle near wing tip -> gag when the girl is halfway (or after a while)
    if (G.dadState === 'ok' && (cov > 0.28 || G.t - G.s2t0 > 25) && G.tool === 'hot') dadGag();
    if (G.dadAnim) G.dadAnim(dt);
    // girl holds the lance (if picked)
    updateLance(dt);
    // spray simulation
    if (G.spraying && G.sprayTarget) spray(dt);
    else { setLoop('spray', 0); }
    updateRunnels(dt);
    // icicles melt where hot water passes
    for (const ic of plane.icicles) {
      const d = ic.userData;
      if (d.melt > 0 && ic.visible) { ic.scale.y = Math.max(0.05, 1 - d.melt); if (Math.random() < d.melt * 0.05) dripAt(ic.getWorldPosition(new V3()).add(new V3(0, -d.h * ic.scale.y, 0))); if (d.melt >= 0.95) ic.visible = false; }
    }
    // lookAt
    if (G.spraying && G.sprayTarget) girl.lookAt(G.sprayTarget); else if (G.dadState === 'frozen') girl.lookAt(dad.joints.head.getWorldPosition(new V3())); else girl.lookAt(C.camera.position, 0.6);
    if (G.dadState === 'ok') dad.lookAt(G.spraying && G.sprayTarget ? G.sprayTarget : girl.joints.head.getWorldPosition(new V3()));
    // hints
    if ((G.t * 2 | 0) !== ((G.t - dt) * 2 | 0)) {
      if (G.tool !== 'hot') G.hint = W.cart.g.localToWorld(new V3(-0.24, 1.3, 0.2));
      else if (G.dadState === 'frozen') G.hint = dad.joints.chest.getWorldPosition(new V3());
      else G.hint = thickestIce();
      G.hintKind = G.tool !== 'hot' ? 'tap' : 'hold';
    }
    if (!G.done && cov > 0.8 && G.dadState === 'thawed') { G.done = true; s2Finish(); }
  },
  down(p) {
    const tankHit = pick(p, W.cart.tanks.map((t) => t.mesh));
    if (tankHit) {
      const t = W.cart.tanks.find((t) => t.mesh === tankHit.object);
      if (G.dadState === 'gag') return;
      G.tool = t.hot ? 'hot' : 'cold'; sfx.pick();
      W.lance.g.visible = true; W.hose.visible = true;
      G.lanceTank = t;
      girl.say(t.hot ? 'smile' : 'huh', 1.0, 'smile');
      return;
    }
    if (!G.tool) { // nudge toward the tanks
      girl.say('huh', 0.8, 'smile'); sfx.huh(); return;
    }
    G.spraying = true; this.move(p);
  },
  move(p) {
    if (!G.spraying) return;
    const targets = [plane.wP, plane.iceMesh];
    const dadMeshes = G.dadState === 'frozen' ? dad.meshes : [];
    const h = pick(p, [...targets, ...dadMeshes]);
    if (!h) { G.sprayTarget = null; return; }
    G.sprayHit = h;
    G.sprayTarget = h.point.clone();
    G.sprayOnDad = dadMeshes.includes(h.object);
  },
  up() { G.spraying = false; G.sprayTarget = null; },
};
let covCache = 0, covT = -1;
function iceCoverageCached() { if (G.t - covT > 0.3) { covT = G.t; covCache = iceCoverage(); } return covCache; }

function updateLance(dt) {
  const l = W.lance.g;
  if (!G.tool) { for (const a of girl.arms) a.w = 0; return; }
  const hands = girl.joints.chest.localToWorld(new V3(0.06, -0.05, 0.17));
  const aim = G.sprayTarget ? G.sprayTarget.clone() : hands.clone().add(new V3(Math.sin(girl.root.rotation.y), -0.3, Math.cos(girl.root.rotation.y)));
  const dir = aim.clone().sub(hands).normalize();
  l.position.copy(hands).addScaledVector(dir, -0.08);
  l.quaternion.slerp(new THREE.Quaternion().setFromUnitVectors(new V3(0, 1, 0), dir), Math.min(1, dt * 10));
  girl.arms[1].target = hands.clone(); girl.arms[1].pole = hands.clone().add(new V3(0.3, -0.5, -0.1)); girl.arms[1].w = 1;
  girl.arms[0].target = l.localToWorld(new V3(0, 0.3, 0)); girl.arms[0].pole = hands.clone().add(new V3(-0.3, -0.5, 0)); girl.arms[0].w = 1;
  girl.root.rotation.y = damp(girl.root.rotation.y, Math.atan2(aim.x - girl.root.position.x, aim.z - girl.root.position.z), 3, dt);
  // hose: sag curve from tank to the lance grip
  const a = W.cart.g.localToWorld(new V3(G.lanceTank.x, 0.75, 0.2));
  const b = l.localToWorld(new V3(0, 0, 0));
  const mid = a.clone().lerp(b, 0.5); mid.y = Math.max(W.groundY(mid.x, mid.z) + 0.04, Math.min(a.y, b.y) - 0.5);
  const crv = new THREE.CatmullRomCurve3([a, a.clone().lerp(mid, 0.6).setY(mid.y + 0.05), mid, mid.clone().lerp(b, 0.5).setY(mid.y + 0.1), b]);
  W.hose.geometry.dispose();
  W.hose.geometry = new THREE.TubeGeometry(crv, 28, 0.014, 6, false);
  W.lance.tipW = l.localToWorld(new V3(0, 0.75, 0));
}
function spray(dt) {
  const tip = W.lance.tipW, tgt = G.sprayTarget;
  if (!tip) return;
  const hot = G.tool === 'hot';
  setLoop('spray', 0.28, hot ? 2400 : 3200);
  // stream particles: arc from nozzle to the target
  const d = tgt.clone().sub(tip);
  for (let i = 0; i < 10; i++) {
    const sp = rand(5.5, 7.0);
    const t = d.length() / sp;
    const v = d.clone().divideScalar(t); v.y += 0.5 * 9.8 * t * 0.35;
    FX.drops.emit({ p: tip, v: [v.x + rand(-.15, .15), v.y + rand(-.15, .15), v.z + rand(-.15, .15)], size: rand(0.012, 0.03), life: t * 1.05, alpha: rand(0.5, 0.9), drag: 0.05, grav: 9.8 * 0.35, tint: hot ? [0.85, 0.9, 1] : [0.8, 0.9, 1] });
  }
  if (hot) { if (Math.random() < 0.6) steam(tgt, 1, 1); } else if (Math.random() < 0.5) puff(tgt, 1, 0.3, [0.9, 0.95, 1]);
  if (hot && Math.random() < 0.08) steam(tip, 1, 1);
  if (G.sprayOnDad) { thawDad(dt); return; }
  const h = G.sprayHit; if (!h || !h.uv) return;
  const u = h.uv.x, v = h.uv.y;
  const f = plane.iceField;
  const chord = 2.15 - 1.1 * u, span = 7.65;
  const ru = 0.16 / span, rv = 0.16 / (chord * 2);
  let melted = 0;
  if (hot) {
    // heat spreads wider than the jet: a ring of clear, bubbly ice forms around the melted core
    f.brush(u, v, ru * 2.0, rv * 2.0, (i, k) => { f.c[1][i] = Math.min(1, f.c[1][i] + dt * 1.6 * k); });
    f.brush(u, v, ru, rv, (i, k) => {
      const cl = f.c[1][i];
      if (cl > 0.6) { const o = f.c[0][i]; f.c[0][i] = Math.max(0, o - dt * 0.8 * k * cl); melted += o - f.c[0][i]; }
      f.c[2][i] = Math.min(1, f.c[2][i] + dt * 3 * k);
    });
  } else {
    f.brush(u, v, ru * 1.5, rv * 1.5, (i, k) => {
      f.c[1][i] = Math.max(0, f.c[1][i] - dt * 2 * k);
      f.c[0][i] = Math.min(1, f.c[0][i] + dt * 0.25 * k);
    });
  }
  if (hot) {
    if (Math.random() < 0.25) sfx.sizzle();
    if (melted > 0.002 && G.runnels.length < 40 && Math.random() < 0.35) G.runnels.push({ u: u + rand(-ru, ru) * 0.5, v: v, speed: rand(0.06, 0.14), wob: rand(0, 6), life: 0 });
    for (const ic of plane.icicles) {
      if (!ic.visible) continue;
      const dd = Math.abs(ic.userData.s - u) * span;
      if (dd < 0.22 && Math.abs(ic.userData.v - v) < 0.35) ic.userData.melt = Math.min(1, ic.userData.melt + dt * 1.2);
    }
    if (Math.random() < 0.03) sfx.crack();
  } else {
    // wrong tank: ice gets frostier; dad notices
    G.wrongTries += dt;
    if (G.wrongTries > 0.8 && !G.wrongReacted) {
      G.wrongReacted = true;
      if (G.dadState === 'ok') { dad.say('huh', 1.4, 'smile'); sfx.huh(); after(1.4, () => { dad.say('laugh', 1.2, 'smile'); dad.st.cheer = 0.6; }); }
      girl.say('huh', 1.4, 'smile');
      after(4, () => { G.wrongReacted = false; G.wrongTries = 0; });
    }
  }
}
function updateRunnels(dt) {
  // melt-water runs aft across the wing toward the trailing edge, leaving wet, clear streaks
  const f = plane.iceField;
  for (let k = G.runnels.length - 1; k >= 0; k--) {
    const r = G.runnels[k];
    r.life += dt;
    r.v += r.speed * dt * 0.5;
    r.u += Math.sin(r.life * 3 + r.wob) * 0.0006;
    f.brush(r.u, r.v, 0.0035, 0.007, (i, kk) => {
      f.c[2][i] = Math.min(1, f.c[2][i] + 0.8 * kk);
      f.c[1][i] = Math.min(1, f.c[1][i] + 0.25 * kk);
      f.c[0][i] = Math.max(0, f.c[0][i] - 0.02 * kk);
    });
    if (r.v > 0.995) {
      G.runnels.splice(k, 1);
      const p = plane.body.localToWorld(plane.wingP(clamp(r.u, 0, 1), 1));
      dripAt(p);
    }
  }
}
function dripAt(p) {
  FX.drops.emit({ p: [p.x, p.y - 0.01, p.z], v: [rand(-.05, .05), -0.2, rand(-.05, .05)], size: rand(0.012, 0.022), life: 1.5, alpha: 0.8, drag: 0.1, grav: 9.8, tint: [0.85, 0.92, 1] });
  if (Math.random() < 0.3) sfx.drip();
}
function thickestIce() {
  const f = plane.iceField, vis = iceVisible(); let best = 0, bi = -1;
  for (let k = 0; k < 160 && vis.length; k++) { const i = vis[(Math.random() * vis.length) | 0]; const d = f.c[0][i] * (1.2 - f.c[1][i]); if (d > best) { best = d; bi = i; } }
  if (best < 0.05) return null;
  return plane.body.localToWorld(plane.wingP((bi % f.w + 0.5) / f.w, ((bi / f.w | 0) + 0.5) / f.h));
}
// dad picks the cold lance, nozzle backwards -> frosted
function dadGag() {
  G.dadState = 'gag';
  let t = 0;
  const lance2 = W.lance.g.clone(); lance2.visible = true; C.scene.add(lance2);
  const ff = dad.frostField;
  dad.say('proud', 2.0, 'smile');
  G.dadAnim = (dt) => {
    t += dt;
    const hands = dad.joints.chest.localToWorld(new V3(0.05, -0.1, 0.25));
    // 0-1.5s: proud pose holding the lance pointing back at himself (oops)
    const face = dad.joints.head.getWorldPosition(new V3());
    const dir = t < 1.6 ? new V3(0.6, 0.1, 0.4).normalize() : face.clone().sub(hands).normalize();
    lance2.position.copy(hands); lance2.quaternion.setFromUnitVectors(new V3(0, -1, 0), dir.clone().negate());
    dad.arms[1].target = hands; dad.arms[1].pole = hands.clone().add(new V3(0.4, -0.6, 0)); dad.arms[1].w = 1;
    dad.arms[0].target = hands.clone().addScaledVector(dir, -0.25); dad.arms[0].pole = hands.clone().add(new V3(-0.4, -0.6, 0)); dad.arms[0].w = 1;
    if (t > 1.6 && t < 3.2) {
      if (!G.gagSfx) { G.gagSfx = true; sfx.freeze(); dad.say('wow', 1.6, 'frozen'); girl.say('wow', 1.5, 'laugh'); }
      // cold fog onto him from top down
      for (let i = 0; i < 3; i++) FX.powder.emit({ p: [face.x + rand(-.3, .3), face.y + rand(-.2, .3), face.z + rand(-.3, .3)], v: [rand(-.4, .4), rand(-.3, .2), rand(-.4, .4)], size: rand(0.08, 0.2), grow: 0.3, life: 1.2, alpha: 0.5, drag: 2, grav: 0.1, tint: [0.9, 0.95, 1] });
      const k = (t - 1.6) / 1.6;
      ff.fill(0, (u, v) => clamp((k * 1.6 - (1 - v) * 0.8) * 1.4 + (Math.sin(u * 40) * 0.05), 0, 1));
      dad.frostField.upload();
    }
    if (t >= 3.2 && G.dadState === 'gag') {
      G.dadState = 'frozen'; C.scene.remove(lance2);
      for (const a of dad.arms) a.w = 0;
      dad.setBase('frozen'); dad.st.shiver = 1; dad.st.cheer = 0.7;
      sfx.brrr();
      girl.say('laugh', 1.6, 'smile');
    }
    if (G.dadState === 'frozen') {
      dad.st.cheer = 0.35;          // arms half raised, stiff
      if (Math.random() < dt * 0.6) sfx.brrr();
      if (Math.random() < dt * 0.3) breath(dad.mouthWorld(), new V3(0, 0.2, 1).applyQuaternion(dad.root.quaternion));
    }
  };
}
function thawDad(dt) {
  const h = G.sprayHit, ff = dad.frostField;
  const inv = new THREE.Matrix4().copy(dad.root.matrixWorld).invert();
  const lp = h.point.clone().applyMatrix4(inv);
  const u = Math.atan2(lp.x, lp.z) / (Math.PI * 2) + 0.5, v = lp.y / 1.9;
  ff.brush(u, v, 0.14, 0.12, (i, k) => { ff.c[0][i] = Math.max(0, ff.c[0][i] - dt * 2.5 * k); });
  steam(h.point, 2, 1);
  dad.say('oops', 0.6, 'frozen');
  let s = 0; for (let i = 0; i < ff.c[0].length; i++) s += ff.c[0][i];
  const m = s / ff.c[0].length;
  dad.st.shiver = clamp(m * 2.5, 0.2, 1);
  if (m < 0.06 && G.dadState === 'frozen') {
    G.dadState = 'thawed';
    ff.c[0].fill(0); ff.dirty = true;
    dad.setBase('smile'); dad.st.shiver = 0; dad.st.cheer = 0;
    dad.say('oops', 0.6, 'smile');
    after(0.5, () => { sfx.sneeze(); dad.st.bounce = 1; puff(dad.mouthWorld(), 8, 0.6); });
    after(1.2, () => { dad.say('laugh', 1.8, 'smile'); girl.say('laugh', 1.6, 'proud'); girl.st.bounce = 1; dad.st.cheer = 1; sparkle(dad.joints.head.getWorldPosition(new V3()), 14, 0.7); });
    G.spraying = false;
  }
}
function s2Finish() {
  sfx.fanfare(); girl.st.cheer = 1; girl.st.bounce = 1; girl.say('laugh', 2.4, 'proud'); dad.st.cheer = 1; dad.say('laugh', 2, 'smile');
  sparkle(plane.body.localToWorld(plane.wingP(0.65, 0.8)), 30, 2);
  G.spraying = false;
  after(2.8, () => fadeTo(() => enter('s3w'), 0.7));
}

// ------------------------------------------------------------ S3a: switch on the cabin lights (tap each window)
S.s3w = {
  enter() {
    W.lance.g.visible = false; W.hose.visible = false;
    for (const a of girl.arms) a.w = 0;
    for (const a of dad.arms) a.w = 0;
    G.dadAnim = null;
    // finish the ice so later shots are clean except where she left a few spots
    setTodLighting(0.62); updateEnv(true);
    place(girl.root, 3.7, -3.5, 0);
    girl.root.rotation.y = 2.75;
    place(dad.root, -1.4, -3.4, 0.4);
    place(W.cart.g, -4.0, -4.6, 0.5);
    place(W.sign, -9, -12, 0.5);
    place(W.worklight.g, 7.5, -5.5, -0.6);
    L.work.position.set(7.5, 1.75, -5.5); L.work.target.position.set(1.0, 1.4, -1.2);
    aimKey(new V3(1, 0, -2), new V3(-0.55, 0.7, -0.5), 11);
    setShot({ target: [1.6, 1.6, -1.6], targetP: [2.0, 1.5, -1.9], dir: [0.55, 0.02, -1], fit: [3.2, 1.3], fitP: [1.7, 2.3], mm: 40 }, 0);
    C.aperture = 0.1; C.exposure = 1.0;
    G.portWins = plane.windows.filter((w) => w.side < 0);
    G.litCount = 0;
    girl.setBase('smile');
  },
  update(dt) {
    for (const w of plane.windows) {
      if (w.target !== undefined) { w.lit = damp(w.lit, w.target, 6, dt); plane.setWindow(w.id, w.lit); }
    }
    const next = G.portWins.find((w) => !w.on);
    G.hint = next ? plane.body.localToWorld(w0(next)) : null; G.hintKind = 'tap';
    girl.lookAt(next ? plane.body.localToWorld(w0(next)) : C.camera.position, 0.8);
    dad.lookAt(girl.joints.head.getWorldPosition(new V3()));
    if (!next && !G.done) {
      G.done = true;
      // remaining windows (starboard + cockpit) and the beacon come on; engines start
      for (const w of plane.windows) { w.on = true; w.target = 1; }
      plane.setWindow(30, 1);
      sfx.fanfare(); girl.st.cheer = 1; girl.say('laugh', 2, 'proud');
      after(1.2, () => { G.engineStart = true; });
      after(4.2, () => fadeTo(() => enter('s3m'), 0.7));
    }
    if (G.engineStart) { plane.propSpeed = Math.min(40, plane.propSpeed + dt * 10); setEngine(plane.propSpeed / 40 * 0.6); }
  },
  down(p) {
    const h = pick(p, [plane.fus]);
    if (!h) return;
    let best = null, bd = 0.55;
    for (const w of G.portWins) { const d = plane.body.localToWorld(w0(w)).distanceTo(h.point); if (d < bd) { bd = d; best = w; } }
    if (best && !best.on) {
      best.on = true; best.target = 1; G.litCount++;
      sfx.ping(G.litCount);
      sparkle(plane.body.localToWorld(w0(best)), 6, 0.3);
      girl.say(G.litCount % 3 === 0 ? 'laugh' : 'wow', 0.9, 'smile');
      if (G.litCount === 4) { dad.say('wow', 1, 'smile'); }
    } else if (!best) { girl.say('huh', 0.7, 'smile'); }
  },
};
const w0 = (w) => w.local.clone();

// ------------------------------------------------------------ S3b: marshal the plane out with the glowing wands
S.s3m = {
  enter() {
    setTodLighting(0.8); updateEnv(true);
    place(girl.root, 13.2, 0.4, 0); girl.root.rotation.y = -Math.PI / 2;
    place(dad.root, 14.3, -1.4, 0); dad.root.rotation.y = -1.9;
    place(W.worklight.g, 15.5, -3.5, -1.0);
    L.work.position.set(15.5, 1.75, -3.5); L.work.target.position.set(12.5, 1.2, 0);
    for (const w of W.wands) w.visible = true;
    W.wandLight.intensity = 2.5;
    aimKey(new V3(8, 0, 0), new V3(-0.4, 0.6, -0.7), 12);
    setShot({ target: [9.9, 1.5, -0.2], targetP: [11.2, 1.45, 0.0], dir: [-0.3, 0.05, -1], fit: [3.6, 1.6], fitP: [1.8, 2.4], mm: 40 }, 0);
    C.aperture = 0.1; C.exposure = 1.0;
    G.wave = 0; G.waveV = 0; G.waves = 0; G.planeX = 0; G.dragY = null; G.armPhase = 0;
    plane.propSpeed = 40; setEngine(0.6);
    girl.setBase('focus');
  },
  update(dt) {
    // wand arms follow the finger: up/down swings move the plane forward
    const st = girl.st;
    const a = G.wave; // 0 = arms up, 1 = arms down-forward
    const chest = girl.joints.chest;
    for (const arm of girl.arms) {
      const sx = arm.sx;
      const up = chest.localToWorld(new V3(sx * 0.18, 0.42, 0.06));
      const fw = chest.localToWorld(new V3(sx * 0.2, 0.08, 0.3));
      arm.target = up.clone().lerp(fw, a); arm.pole = chest.localToWorld(new V3(sx * 0.5, -0.2, -0.2)); arm.w = 1;
      const wand = W.wands[sx < 0 ? 0 : 1];
      wand.position.copy(arm.target);
      const d = chest.localToWorld(new V3(sx * 0.05, 0.1 + (1 - a) * 0.6, 0.2 + a * 0.4)).sub(arm.target).normalize();
      wand.quaternion.setFromUnitVectors(new V3(0, 1, 0), d);
    }
    W.wandLight.position.copy(W.wands[1].position).add(new V3(-0.2, 0.2, 0));
    girl.lookAt(plane.body.localToWorld(new V3(14, 2.2, 0)), 0.7);
    dad.lookAt(plane.body.localToWorld(new V3(13, 2, 0)));
    // plane creeps forward with each wave, then turns away to the taxiway
    const goal = Math.min(G.waves * 0.55, 3.2);
    G.planeX = damp(G.planeX, goal, 1.5, dt);
    plane.root.position.x = G.planeX;
    for (const w of plane.wheels) w.rotation.z -= (goal - G.planeX) * dt * 3;
    if (Math.random() < 0.02) breath(girl.mouthWorld(), new V3(-1, 0.2, 0));
    G.hint = girl.joints.chest.localToWorld(new V3(0.15, 0.35, 0.2)); G.hintKind = 'swipe';
    // beacon
    const bk = (Math.sin(G.t * 6) > 0.6) ? 8 : 0; plane.beacon.material.emissiveIntensity = bk;
    plane.navR.material.emissiveIntensity = 4; plane.navG.material.emissiveIntensity = 4;
    if (G.waves >= 6 && !G.done) {
      G.done = true; girl.say('laugh', 2, 'proud'); girl.st.bounce = 1; dad.st.cheer = 1; sfx.fanfare();
      // turn & roll away
      let t = 0;
      G.taxi = (dt2) => {
        t += dt2;
        plane.root.rotation.y = Math.min(1.2, t * 0.25);
        plane.root.position.x += Math.cos(plane.root.rotation.y) * dt2 * (1 + t * 0.4);
        plane.root.position.z -= Math.sin(plane.root.rotation.y) * dt2 * (1 + t * 0.4);
        setEngine(0.7);
        girl.lookAt(plane.body.localToWorld(new V3(10, 2, 0)), 0.9);
        if (t > 4.5 && !G.taxiDone) { G.taxiDone = true; fadeTo(() => enter('s3t'), 0.8); }
      };
    }
    if (G.taxi) G.taxi(dt);
  },
  down(p) { G.dragY = p.y; },
  move(p) {
    if (G.dragY === null || G.done) return;
    const dy = (p.y - G.dragY) / (C.h * 0.25);
    G.dragY = p.y;
    const prev = G.wave;
    G.wave = clamp(G.wave + dy, 0, 1);
    if (prev < 0.85 && G.wave >= 0.85) { G.waves++; sfx.whoosh(); girl.say('effort', 0.4, 'focus'); if (G.waves === 3) dad.say('wow', 1, 'smile'); }
    if (prev > 0.15 && G.wave <= 0.15) sfx.whoosh();
  },
  up() { G.dragY = null; },
};

// ------------------------------------------------------------ S3c: take-off into the sunrise (cinematic)
S.s3t = {
  enter() {
    G.taxi = null;
    for (const w of W.wands) w.visible = false; W.wandLight.intensity = 0;
    girl.root.visible = false; dad.root.visible = false;
    setTodLighting(0.9); updateEnv(true);
    // runway far north; plane starts left, rolls right toward the sun
    plane.root.rotation.set(0, 0, 0);
    plane.root.position.set(-110, 0, 70);
    C.scene.fog.density = 0.0012;
    aimKey(new V3(0, 0, 70), SUN_DIR.clone().setY(0.15), 30);
    setShot({ target: [-10, 5, 70], dir: [-0.3, 0.02, -1], fit: [16, 7], fitP: [10, 16], mm: 45 }, 0);
    C.aperture = 0.03; C.exposure = 0.95; C.focusTarget = 50;
    G.toT = 0;
  },
  update(dt) {
    G.toT += dt;
    const t = G.toT;
    const tod = Math.min(1, 0.9 + t * 0.012); if (Math.abs(tod - C.tod) > 0.005) setTodLighting(tod); updateEnv(false);
    const speed = Math.min(55, 6 + t * 9);
    plane.root.position.x += speed * dt;
    const x = plane.root.position.x;
    if (x > -30) { const k = (x + 30); plane.root.position.y = Math.pow(Math.max(0, k), 1.35) * 0.06; plane.root.rotation.z = Math.min(0.16, k * 0.004); }
    plane.propSpeed = 60; setEngine(Math.min(1, 0.6 + t * 0.08));
    for (const w of plane.wheels) w.rotation.z -= speed * dt / 0.3;
    // camera pans to follow
    const tgt = plane.root.position.clone().add(new V3(12, 2, 0));
    setShot({ target: [tgt.x * 0.75, 3 + plane.root.position.y * 0.7, 70], dir: [-0.3, 0.02, -1], fit: [16, 7], fitP: [10, 16], mm: 45 }, 0);
    plane.beacon.material.emissiveIntensity = (Math.sin(G.t * 6) > 0.6) ? 10 : 0;
    G.hint = null;
    if (t > 9.5 && !G.done) { G.done = true; fadeTo(() => enter('s3p'), 1.0); }
  },
};

// ------------------------------------------------------------ S3d: free play — roll snowballs, build snowmen; plane circles overhead
S.s3p = {
  enter() {
    setTodLighting(1.0); updateEnv(true);
    setEngine(0.15);
    girl.root.visible = true; dad.root.visible = true;
    place(girl.root, 6.6, -6.4, 0); girl.root.rotation.y = -2.3;
    place(dad.root, 8.6, -5.6, 0); dad.root.rotation.y = -2.5;
    place(W.worklight.g, 30, 30, 0); L.work.intensity = 0;
    C.scene.fog.density = 0.002;
    place(W.cart.g, -4.5, -6.5, 0.5);
    for (const c of W.cones) c.visible = true;
    aimKey(new V3(6, 0, -6), SUN_DIR.clone().setY(0.22), 10);
    setShot({ target: [6.6, 0.8, -5.4], targetP: [6.7, 0.85, -5.6], dir: [-0.5, 0.17, -0.85], fit: [2.6, 1.15], fitP: [1.5, 2.1], mm: 40 }, 0);
    C.aperture = 0.1; C.exposure = 1.0;
    G.balls = []; G.grab = null; G.flyT = 0;
    plane.root.position.set(0, 120, 0); plane.root.rotation.set(0, 0, 0);
    girl.setBase('smile'); dad.setBase('smile');
    for (const a of girl.arms) a.w = 0; for (const a of dad.arms) a.w = 0;
    FX.snowRate = 0.25;
  },
  update(dt) {
    // plane circles high in the morning sky, windows glowing
    G.flyT += dt;
    const a = G.flyT * 0.12;
    const R = 150;
    plane.root.position.set(6 + Math.cos(a) * R, 70 + Math.sin(a * 2) * 8, 60 + Math.sin(a) * R * 0.6);
    plane.root.rotation.set(0, -a - Math.PI / 2 + 0.0, G.wag > 0 ? Math.sin(G.t * 9) * 0.35 * G.wag : 0.25);
    G.wag = Math.max(0, (G.wag || 0) - dt * 0.4);
    plane.propSpeed = 60;
    plane.beacon.material.emissiveIntensity = (Math.sin(G.t * 6) > 0.6) ? 10 : 0;
    // grabbed ball follows the finger and rolls, picking up snow
    if (G.grab && G.grabPt) rollBall(G.grab, G.grabPt, dt);
    for (const b of G.balls) {
      b.wob = Math.max(0, (b.wob || 0) - dt);
      b.mesh.rotation.z += Math.sin(G.t * 25) * b.wob * 0.02;
    }
    const lookB = G.grab ? G.grab.mesh.position : (G.balls.length ? G.balls[G.balls.length - 1].mesh.position : C.camera.position);
    girl.lookAt(lookB, 0.8); dad.lookAt(lookB, 0.6);
    G.hint = G.balls.length === 0 ? new V3(5.6, 0.2, -5.0) : (!G.balls.some((b) => b.on) && G.balls.length > 1 ? G.balls[0].mesh.position.clone().add(new V3(0, 0.2, 0)) : null);
    G.hintKind = 'drag';
    if (Math.random() < dt * 0.25) breath(girl.mouthWorld(), new V3(0.3, 0.2, 1).applyQuaternion(girl.root.quaternion));
  },
  down(p) {
    // tap the plane in the sky: it wags its wings
    const ph = pick(p, [plane.fus]);
    if (ph) { G.wag = 1; sfx.ping(5); girl.st.cheer = 1; girl.say('laugh', 1.5, 'smile'); return; }
    const pt = groundPoint(p);
    if (!pt) return;
    // grab an existing ball near the touch, else start a new one
    let best = null, bd = 1e9;
    for (const b of G.balls) { if (b.on) continue; const d = Math.hypot(b.mesh.position.x - pt.x, b.mesh.position.z - pt.z); if (d < b.r + 0.25 && d < bd) { bd = d; best = b; } }
    if (!best) {
      for (const b of G.balls) { const d = b.mesh.position.distanceTo(pt); if (d < b.r + 0.3) { b.wob = 0.6; sfx.pop(); girl.say('laugh', 1, 'smile'); return; } }
      best = makeBall(pt);
    }
    G.grab = best; G.grabPt = pt;
  },
  move(p) { if (G.grab) { const pt = groundPoint(p); if (pt) G.grabPt = pt; } },
  up() {
    if (G.grab) tryStack(G.grab);
    G.grab = null; G.grabPt = null;
  },
};
let ballGeo = null, ballMat = null;
function makeBall(pt) {
  if (!ballGeo) {
    ballGeo = new THREE.IcosahedronGeometry(1, 5);
    const pa = ballGeo.attributes.position;
    for (let i = 0; i < pa.count; i++) { const v = new V3(pa.getX(i), pa.getY(i), pa.getZ(i)); const n = 1 + (Math.sin(v.x * 7) * Math.sin(v.y * 6 + 1) * Math.sin(v.z * 8 + 2)) * 0.04 + (Math.random() - .5) * 0.025; v.multiplyScalar(n); pa.setXYZ(i, v.x, v.y, v.z); }
    ballGeo.computeVertexNormals();
    // spherical uv for tiling snow
    const uv = ballGeo.attributes.uv;
    for (let i = 0; i < pa.count; i++) { const v = new V3(pa.getX(i), pa.getY(i), pa.getZ(i)).normalize(); uv.setXY(i, Math.atan2(v.z, v.x) / Math.PI * 2, v.y * 1.3); }
    ballMat = pbr('snow', { repeat: [2, 2], roughness: 1 });
    ballMat.color.setRGB(0.97, 0.98, 1.0);
  }
  const m = new THREE.Mesh(ballGeo, ballMat); m.castShadow = true; m.receiveShadow = true;
  const b = { mesh: m, r: 0.09, vol: 4 / 3 * Math.PI * 0.09 ** 3, on: null, top: null };
  m.scale.setScalar(b.r); m.position.set(pt.x, W.groundY(pt.x, pt.z) + b.r * 0.85, pt.z);
  C.scene.add(m); G.balls.push(b);
  sfx.pop();
  girl.say('wow', 0.8, 'smile');
  return b;
}
function rollBall(b, pt, dt) {
  if (b.top) return;
  const p = b.mesh.position;
  const dx = pt.x - p.x, dz = pt.z - p.z, d = Math.hypot(dx, dz);
  if (d < 0.01) return;
  const step = Math.min(d, dt * 2.2);
  const nx = dx / d, nz = dz / d;
  p.x += nx * step; p.z += nz * step;
  // roll rotation
  const axis = new V3(nz, 0, -nx);
  b.mesh.rotateOnWorldAxis(axis, step / b.r);
  // pick up snow from the ground field under the ball -> reveal dark pavement trail
  const [u, v] = W.groundUV(p.x, p.z);
  if (u > 0 && v > 0 && u < 1 && v < 1) {
    const f = W.groundField; let took = 0;
    const rr = (b.r * 0.75) / GROUND.size;
    f.brush(u, v, rr, rr, (i, k) => { const o = f.c[0][i]; const nv = Math.max(0, o - 0.35 * k * step * 6); took += o - nv; f.c[0][i] = nv; });
    const cell = (GROUND.size / f.w) ** 2;
    b.vol += took * GROUND.maxDepth * cell * 0.9;
    b.r = Math.min(0.42, Math.cbrt(b.vol * 3 / (4 * Math.PI)));
    b.mesh.scale.setScalar(b.r);
    if (Math.random() < 0.3) puff(new V3(p.x, p.y - b.r * 0.7, p.z), 1, 0.4);
    if (Math.random() < 0.08) sfx.powder();
  }
  p.y = W.groundY(p.x, p.z) * 0.6 + b.r * 0.92;
}
function tryStack(b) {
  // dropped onto a bigger ball -> stack; two or more -> becomes a snowman with a face
  for (const o of G.balls) {
    if (o === b || o.top) continue;
    const d = Math.hypot(o.mesh.position.x - b.mesh.position.x, o.mesh.position.z - b.mesh.position.z);
    if (d < o.r + b.r * 0.6 && b.r <= o.r * 1.05) {
      o.top = b; b.on = o;
      b.mesh.position.set(o.mesh.position.x, o.mesh.position.y + o.r * 0.82 + b.r * 0.82, o.mesh.position.z);
      b.mesh.rotation.set(0, 0, 0);
      sfx.thud(); puff(b.mesh.position.clone().add(new V3(0, -b.r, 0)), 8, 0.8);
      dressSnowman(b);
      girl.say('laugh', 1.8, 'smile'); girl.st.cheer = 1; girl.st.bounce = 1; dad.say('laugh', 1.5, 'smile'); dad.st.cheer = 0.8;
      sfx.fanfare();
      return;
    }
  }
  if (b.r > 0.12) { girl.say('smile', 0.6, 'smile'); }
}
let coalMat, carrotMat, twigMat;
function dressSnowman(head) {
  if (!coalMat) {
    coalMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.85 });
    carrotMat = new THREE.MeshPhysicalMaterial({ color: 0xc8611f, roughness: 0.6, sheen: 0.3 });
    twigMat = new THREE.MeshStandardMaterial({ color: 0x3b2a1e, roughness: 0.9 });
  }
  const r = head.r, m = head.mesh;
  const g = new THREE.Group(); g.position.copy(m.position);
  // face toward the camera
  const cam = C.camera.position;
  g.rotation.y = Math.atan2(cam.x - m.position.x, cam.z - m.position.z) + rand(-0.3, 0.3);
  for (const sx of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.1, 1), coalMat); e.position.set(sx * r * 0.32, r * 0.25, r * 0.92); g.add(e);
  }
  for (let i = 0; i < 5; i++) {
    const a = (i / 4 - 0.5) * 1.2;
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.06, 1), coalMat); s.position.set(Math.sin(a) * r * 0.45, -r * 0.25 - Math.cos(a) * r * 0.12 + r * 0.05, r * 0.88); g.add(s);
  }
  const carrot = new THREE.Mesh(new THREE.ConeGeometry(r * 0.1, r * 0.55, 10), carrotMat);
  carrot.rotation.x = Math.PI / 2; carrot.position.set(0, r * 0.05, r * 1.15); g.add(carrot);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  C.scene.add(g);
  // twig arms on the ball below
  const body = head.on;
  for (const sx of [-1, 1]) {
    const tw = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.014, body.r * 1.6, 5), twigMat);
    tw.position.set(body.mesh.position.x, body.mesh.position.y + body.r * 0.2, body.mesh.position.z);
    tw.rotation.y = g.rotation.y; tw.rotateZ(sx * (Math.PI / 2 - 0.5)); tw.translateY(body.r * 1.05);
    tw.castShadow = true; C.scene.add(tw);
  }
  sparkle(m.position, 14, 0.6);
}
function groundPoint(p) {
  ray.setFromCamera(ndcOf(p), C.camera);
  const pl = new THREE.Plane(new V3(0, 1, 0), -0.1);
  const out = new V3();
  if (!ray.ray.intersectPlane(pl, out)) return null;
  if (out.distanceTo(C.camera.position) > 25) return null;
  out.x = clamp(out.x, GROUND.x0 + 0.5, GROUND.x0 + GROUND.size - 0.5); out.z = clamp(out.z, GROUND.z0 + 0.5, GROUND.z0 + GROUND.size - 0.5);
  return out;
}

// ------------------------------------------------------------ shared
function ndcOf(p) { ndc.set(p.x / C.w * 2 - 1, -(p.y / C.h) * 2 + 1); return ndc; }
function pick(p, objs) {
  ray.setFromCamera(ndcOf(p), C.camera);
  const hits = ray.intersectObjects(objs, true);
  return hits.length ? hits[0] : null;
}

export function gameDown(p) { unlockAudio(); G.lastInput = G.t; const s = S[G.state]; if (s && s.down && fadeDir === 0) s.down(p); }
export function gameMove(p) { G.lastInput = G.t; const s = S[G.state]; if (s && s.move) s.move(p); }
export function gameUp(p) { G.lastInput = G.t; const s = S[G.state]; if (s && s.up) s.up(p); }

let breathT = 0;
export function updateGame(dt) {
  G.t += dt; G.stateT += dt;
  for (let i = later.length - 1; i >= 0; i--) if (G.t >= later[i].t) { const f = later[i].fn; later.splice(i, 1); f(); }
  const s = S[G.state];
  if (s && s.update) s.update(dt);
  updateFade(dt);
  plane.update(dt);
  W.groundField.upload();
  if (dad.frostField) dad.frostField.upload();
  // keep the frost projection anchored to dad
  if (dad.frostU) dad.frostU.frostInv.value.copy(dad.root.matrixWorld).invert();
  girl.update(dt, G.t);
  if (dad.root.visible) dad.update(dt, G.t);
  // cold breath clouds
  breathT -= dt;
  if (breathT < 0 && girl.root.visible && G.state !== 's3t') {
    breathT = rand(2.6, 4.2);
    const fw = new V3(0, -0.1, 1).applyQuaternion(girl.joints.head.getWorldQuaternion(new THREE.Quaternion()));
    breath(girl.mouthWorld(), fw);
    if (dad.root.visible && G.dadState !== 'frozen') breath(dad.mouthWorld(), new V3(0, -0.1, 1).applyQuaternion(dad.joints.head.getWorldQuaternion(new THREE.Quaternion())));
  }
  // fill light follows the camera (snow bounce on faces)
  L.fill.position.copy(C.camera.position).add(new V3(0, -0.3, 0));
  // pulse the work lamp face
  W.worklight.head.material.color.setRGB(1, 0.85, 0.65).multiplyScalar(14);
}
