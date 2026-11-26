// Final scene: the garden path at night. Light the family lanterns; play freely.
import * as THREE from 'three';
import { pbr, canvasTex } from './tex.js';
import { Pumpkin } from './pumpkin.js';
import { Candle } from './candle.js';
import { applyShot, pick, toScreen } from './engine.js';
import { leafGeometry, leafMaterial } from './room.js';
import { SHAPE } from './shapes.js';
import { RoundedBoxGeometry } from './rbox.js';

const V3 = THREE.Vector3;
const O = new V3(30, 0, 0);

function sky() {
  const m = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: {},
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `varying vec3 vD;
      float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164))) * 43758.5453); }
      void main(){
        float y = vD.y;
        vec3 top = vec3(0.012, 0.022, 0.06), hor = vec3(0.07, 0.09, 0.16), glow = vec3(0.16, 0.1, 0.07);
        vec3 c = mix(hor, top, smoothstep(0.0, 0.6, y));
        c += glow * exp(-max(y, 0.0) * 9.0) * 0.6;
        vec3 md = normalize(vec3(-0.45, 0.42, -0.78));
        float m = dot(vD, md);
        c += vec3(0.9, 0.92, 1.0) * smoothstep(0.99955, 0.9997, m) * 3.0;
        c += vec3(0.25, 0.3, 0.45) * pow(max(m, 0.0), 200.0) * 0.8 + vec3(0.1,0.12,0.2) * pow(max(m,0.0), 12.0) * 0.25;
        vec3 g = floor(vD * 300.0);
        float s = step(0.9965, h(g)) * smoothstep(0.05, 0.3, y);
        c += vec3(s) * (0.5 + h(g + 1.0));
        // tree line silhouette
        float th = 0.06 + 0.035 * sin(atan(vD.z, vD.x) * 13.0) + 0.02 * sin(atan(vD.z, vD.x) * 37.0) + 0.012 * sin(atan(vD.z, vD.x) * 91.0);
        c = mix(c, vec3(0.006, 0.008, 0.012), smoothstep(th + 0.004, th - 0.004, y));
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const s = new THREE.Mesh(new THREE.SphereGeometry(40, 48, 24), m);
  s.renderOrder = -1; s.frustumCulled = false;
  return s;
}

function windowTex() {
  return canvasTex(256, 256, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h * 0.55, 10, w / 2, h / 2, w * 0.7);
    gr.addColorStop(0, '#ffd9a0'); gr.addColorStop(0.6, '#e8a050'); gr.addColorStop(1, '#8a4a20');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    // curtains
    g.fillStyle = 'rgba(150,60,30,0.75)';
    for (const s of [0, 1]) { g.beginPath(); const x0 = s ? w : 0, x1 = s ? w * 0.72 : w * 0.28; g.moveTo(x0, 0); g.lineTo(x1, 0); g.quadraticCurveTo(x1 + (s ? 30 : -30), h * 0.5, s ? w * 0.84 : w * 0.16, h); g.lineTo(x0, h); g.fill(); }
    g.fillStyle = '#2a2018'; g.fillRect(w / 2 - 5, 0, 10, h); g.fillRect(0, h * 0.45, w, 10);
  });
}

export function buildGarden(ctx) {
  const { E, pk, candle, girl, papa, mama, sfx, voice, hints, after, tween, burst } = ctx;
  const grp = new THREE.Group(); grp.position.copy(O); E.scene.add(grp);
  grp.add(sky());
  // ground
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), pbr('grass', { repeat: [22, 22], roughness: 1, normal: 1.2, color: 0xb8c0a0 }));
  grass.rotation.x = -Math.PI / 2; grass.receiveShadow = true; grp.add(grass);
  // stepping-stone path: individual flagstones, slightly uneven
  const pv = pbr('pavers', { repeat: [0.5, 0.5], roughness: 1, normal: 1.0 });
  for (let i = 0; i < 16; i++) {
    const z = 3.4 - i * 0.46 + (Math.random() - 0.5) * 0.06;
    for (const sx of [-1, 1]) {
      const w = 0.42 + Math.random() * 0.12, d = 0.36 + Math.random() * 0.08;
      const st = new THREE.Mesh(new RoundedBoxGeometry(w, 0.04, d, 2, 0.015), pv.clone());
      st.material.map = pv.map.clone(); st.material.map.offset.set(Math.random(), Math.random()); st.material.map.repeat.set(0.4, 0.4);
      st.position.set(sx * 0.24 + (Math.random() - 0.5) * 0.06, 0.012, z); st.rotation.y = (Math.random() - 0.5) * 0.2;
      st.receiveShadow = true; st.castShadow = true; grp.add(st);
    }
  }
  // house facade
  const H = new THREE.Group(); H.position.set(0, 0, -4.4); grp.add(H);
  const sid = pbr('siding', { repeat: [5, 1.6], roughness: 1, normal: 1.0 });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.2), sid); wall.position.y = 1.6; wall.receiveShadow = true; H.add(wall);
  const fnd = new THREE.Mesh(new RoundedBoxGeometry(10, 0.35, 0.12, 2, 0.01), pbr('plaster', { repeat: [6, 0.3], color: 0x8a8580, roughness: 1 })); fnd.position.set(0, 0.17, 0.04); fnd.receiveShadow = true; H.add(fnd);
  const trim = pbr('oak', { repeat: [1, 1], color: 0xf0ebe0, roughness: 1, normal: 0.3 }); trim.map = null; trim.color.set(0xe8e2d6);
  const doorM = pbr('oak', { repeat: [1, 2], color: 0x7a3a28, roughness: 1, normal: 0.8, physical: true, clearcoat: 0.4 });
  const door = new THREE.Mesh(new RoundedBoxGeometry(0.95, 2.05, 0.06, 2, 0.01), doorM); door.position.set(0, 1.025 + 0.3, 0.03); door.castShadow = door.receiveShadow = true; H.add(door);
  const dwin = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.35), new THREE.MeshBasicMaterial({ map: windowTex(), toneMapped: false })); dwin.material.color.setScalar(1.6); dwin.position.set(0, 2.0, 0.065); H.add(dwin);
  for (const [w, h, x, y] of [[0.1, 2.15, -0.52, 1.37], [0.1, 2.15, 0.52, 1.37], [1.14, 0.1, 0, 2.42]]) { const b = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.08, 2, 0.008), trim); b.position.set(x, y, 0.04); b.castShadow = b.receiveShadow = true; H.add(b); }
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 12), new THREE.MeshStandardMaterial({ color: 0xb8924a, metalness: 1, roughness: 0.3 })); knob.position.set(0.36, 1.3, 0.08); H.add(knob);
  for (let i = 0; i < 2; i++) { const s = new THREE.Mesh(new RoundedBoxGeometry(1.5 - i * 0.2, 0.15, 0.5 - i * 0.18, 2, 0.02), pbr('pavers', { repeat: [0.6, 0.3], roughness: 1 })); s.position.set(0, 0.075 + i * 0.15, 0.28 - i * 0.09); s.castShadow = s.receiveShadow = true; H.add(s); }
  const wt = windowTex();
  for (const x of [-2.4, 2.4]) {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.2), new THREE.MeshBasicMaterial({ map: wt, toneMapped: false })); win.material.color.setScalar(1.4); win.position.set(x, 1.7, 0.02); H.add(win);
    for (const [w, h, xx, y] of [[1.24, 0.08, 0, 0.64], [1.3, 0.07, 0, -0.66], [0.08, 1.3, -0.6, 0], [0.08, 1.3, 0.6, 0]]) { const b = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.1, 2, 0.008), trim); b.position.set(x + xx, 1.7 + y, 0.05); b.castShadow = b.receiveShadow = true; H.add(b); }
    const wl = new THREE.PointLight(0xffb070, 2.2, 6, 2); wl.position.set(x, 1.6, 0.6); H.add(wl);
  }
  // porch lamp
  const lampM = new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 2.1, 1.1), toneMapped: false });
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.12), lampM); lamp.position.set(0.8, 2.15, 0.12); H.add(lamp);
  const lampCap = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.08, 4), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.4 })); lampCap.position.set(0.8, 2.29, 0.12); lampCap.rotation.y = Math.PI / 4; H.add(lampCap);
  const porch = new THREE.SpotLight(0xffb878, 14, 9, 1.0, 0.7, 2); porch.position.set(0.8, 2.1, 0.3); porch.target.position.set(0.3, 0, 2.5);
  porch.castShadow = true; porch.shadow.mapSize.set(1024, 1024); porch.shadow.radius = 5; porch.shadow.bias = -0.0005;
  H.add(porch, porch.target);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.25, 0.6), new THREE.MeshStandardMaterial({ color: 0x1d1a1a, roughness: 0.8 })); roof.position.set(0, 3.25, 0.2); roof.castShadow = true; H.add(roof);
  // picket fences on both sides
  const picketM = pbr('oak', { repeat: [0.2, 1], color: 0xd6d0c4, roughness: 1, normal: 0.7 });
  const pg = new RoundedBoxGeometry(0.08, 0.85, 0.022, 2, 0.006);
  for (const sx of [-1, 1]) {
    const n = 34; const inst = new THREE.InstancedMesh(pg, picketM, n); inst.castShadow = inst.receiveShadow = true;
    const M = new THREE.Matrix4();
    for (let i = 0; i < n; i++) { M.makeRotationY(Math.PI / 2 + (Math.random() - 0.5) * 0.04); M.setPosition(sx * 2.6, 0.42 + (Math.random() - 0.5) * 0.02, 4 - i * 0.24); inst.setMatrixAt(i, M); }
    grp.add(inst);
    for (const y of [0.25, 0.65]) { const rail = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 8.2), picketM); rail.position.set(sx * 2.62, y, -0.1); rail.castShadow = true; grp.add(rail); }
  }
  // shrubs (lumpy leaf masses)
  const shrubM = pbr('grass', { repeat: [3, 3], color: 0x51653a, roughness: 1, normal: 2.0 });
  for (const [x, z, s] of [[-1.6, -3.6, 0.6], [1.7, -3.7, 0.55], [-2.1, -1.0, 0.45], [2.1, 0.8, 0.5]]) {
    const g = new THREE.IcosahedronGeometry(1, 4); const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const a = p.getX(i), b = p.getY(i), c = p.getZ(i); const n = 1 + 0.12 * Math.sin(a * 7 + c * 5) * Math.cos(b * 6) + 0.06 * Math.sin(a * 17 + b * 13); p.setXYZ(i, a * n, Math.max(-0.3, b) * n * 0.8, c * n); }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, shrubM); m.scale.setScalar(s); m.position.set(x, s * 0.5, z); m.castShadow = m.receiveShadow = true; grp.add(m);
  }
  // fallen leaves on the lawn
  const lg = leafGeometry(), lm = leafMaterial();
  const cols = [0xb8401a, 0xd6791f, 0x9a2f17, 0xc79a2a, 0x8a3a12, 0x6e4a1c];
  const NL = 420;
  const ground = new THREE.InstancedMesh(lg, lm, NL); ground.receiveShadow = true; ground.castShadow = false;
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), s3 = new V3();
  for (let i = 0; i < NL; i++) {
    let x, z; do { x = (Math.random() - 0.5) * 5; z = 4 - Math.random() * 8; } while (Math.abs(x) < 0.5 && Math.random() < 0.85);
    q.setFromEuler(new THREE.Euler(-Math.PI / 2 + (Math.random() - 0.5) * 0.4, 0, Math.random() * 6.28));
    const sc = 0.06 + Math.random() * 0.04; s3.set(sc, sc, sc);
    M.compose(new V3(x, 0.006 + Math.random() * 0.01 + (Math.abs(x) < 0.5 ? 0.04 : 0), z), q, s3); ground.setMatrixAt(i, M);
    ground.setColorAt(i, new THREE.Color(cols[i % cols.length]).multiplyScalar(0.7 + Math.random() * 0.4));
  }
  grp.add(ground);
  // falling leaves
  const NF = 26;
  const fall = new THREE.InstancedMesh(lg, lm, NF); fall.castShadow = true;
  const fl = [];
  for (let i = 0; i < NF; i++) { fl.push({ p: new V3((Math.random() - 0.5) * 5, Math.random() * 4, 3 - Math.random() * 7), v: 0.25 + Math.random() * 0.25, ph: Math.random() * 6, sc: 0.06 + Math.random() * 0.04, spin: Math.random() * 3 }); fall.setColorAt(i, new THREE.Color(cols[i % cols.length])); }
  grp.add(fall);
  // moonlight + fill
  const moon = new THREE.DirectionalLight(0xa8bcff, 0.55);
  moon.position.set(-4, 7, -5); moon.target.position.set(0, 0, 1);
  moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024);
  const mc = moon.shadow.camera; mc.left = -5; mc.right = 5; mc.top = 5; mc.bottom = -5; mc.near = 1; mc.far = 20; moon.shadow.radius = 4; moon.shadow.bias = -0.0008;
  grp.add(moon, moon.target);
  const hemi = new THREE.HemisphereLight(0x5a6c9a, 0x1a140c, 0.22); grp.add(hemi);
  E.scene.environment = E.env.garden; E.scene.environmentIntensity = 1.0;
  E.post.exposureT = 2.2; E.post.exposure = 2.2;
  // the hero lantern sits at the front of the path
  pk.group.position.copy(O).add(new V3(-0.62, 0.0, 2.0));
  pk.body.rotation.y = 0.35;
  candle.baseI = 4.0;
  // family lanterns
  const lanterns = [];
  const faces = [
    [[0.21, 0.42, SHAPE.CIRCLE, 0.016], [0.29, 0.42, SHAPE.CIRCLE, 0.016], [0.25, 0.6, SHAPE.SMILE, 0.036]],
    [[0.2, 0.43, SHAPE.HEART, 0.02], [0.3, 0.43, SHAPE.HEART, 0.02], [0.25, 0.6, SHAPE.SMILE, 0.034], [0.25, 0.3, SHAPE.STAR, 0.016]],
    [[0.21, 0.42, SHAPE.STAR, 0.02], [0.29, 0.42, SHAPE.STAR, 0.02], [0.25, 0.62, SHAPE.SMILE, 0.032], [0.12, 0.55, SHAPE.CIRCLE, 0.01], [0.38, 0.55, SHAPE.CIRCLE, 0.01]],
    [[0.21, 0.44, SHAPE.CIRCLE, 0.014], [0.29, 0.44, SHAPE.CIRCLE, 0.014], [0.25, 0.58, SHAPE.SMILE, 0.03], [0.4, 0.4, SHAPE.HEART, 0.014], [0.1, 0.4, SHAPE.STAR, 0.014]],
  ];
  const spots = [[0.78, 1.0, -0.4], [-0.8, -0.2, 0.4], [0.82, -1.4, -0.3], [-0.78, -2.6, 0.3]];
  const colors = [[0xe8741c, 0xb5470c], [0xd9661a, 0x9a3d0b], [0xe2a43a, 0xa86a1c], [0xdf7a26, 0xa04812]];
  spots.forEach(([x, z, ry], i) => {
    const p = new Pumpkin({ seed: 50 + i * 13 + Math.floor(Math.random() * 100), R: 0.11 + Math.random() * 0.05, colA: colors[i][0], colB: colors[i][1] });
    for (const [u, v, t, s] of faces[i]) { const f = p.frameAt(u, v); const st = p.addStamp(f.p, f.n, f.up, t, s * (p.shape.R / 0.15), (Math.random() - 0.5) * 0.2); st.depth = 1; }
    p.syncStamps();
    p.scrape(0.5, 0.6, 2, 1);
    p.group.position.copy(O).add(new V3(x, 0, z));
    p.body.rotation.y = Math.PI / 2 * 0 + ry + (x > 0 ? -Math.PI / 2 : Math.PI / 2) * 0.55;
    const c = new Candle({ shadow: false, intensity: 2.2, halo: 0.8 });
    c.group.position.set(0, p.shape.bottomY() * p.inner + 0.01, 0);
    p.body.add(c.group);
    E.scene.add(p.group);
    lanterns.push({ p, c, lit: false, flare: 0 });
  });
  // people
  girl.root.position.copy(O).add(new V3(-1.0, 0, 2.35)); girl.root.rotation.y = 0.75;
  papa.root.position.copy(O).add(new V3(0.62, 0.3, -3.75)); papa.root.rotation.y = -0.15;
  mama.root.position.copy(O).add(new V3(-0.35, 0.3, -3.85)); mama.root.rotation.y = 0.2;
  for (const p of [girl, papa, mama]) { p.reach('R', null); p.reach('L', null); p.leanT = 0; p.setExpr('smile'); }
  girl.lookAt(pk.group.position);
  // camera
  const shotA = { look: O.clone().add(new V3(-0.2, 0.55, 0.4)), dir: new V3(0.35, 0.28, 1), w: 3.2, h: 1.8, pw: 1.7, ph: 3.0 };
  const shotB = { look: O.clone().add(new V3(0.0, 0.9, -1.0)), dir: new V3(0.2, 0.22, 1), w: 4.6, h: 2.6, pw: 2.6, ph: 4.6 };
  E.camSpeed = 3; applyShot(shotA, true);
  E.focusPoint = pk.group.position.clone();
  E.post.aperture = 1.6;
  const unlitHints = () => hints(lanterns.filter((l) => !l.lit).map((l) => ({ obj: l.p, pos: () => l.p.group.position.clone().add(new V3(0, 0.15, 0)) })));
  after(1.2, unlitHints);
  let allLit = false;
  const sparks = [];
  const sparkGeo = new THREE.SphereGeometry(0.004, 6, 4);
  const sparkMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 2.2, 0.8), toneMapped: false });
  const emit = (pos, n) => { for (let i = 0; i < n; i++) { const m = new THREE.Mesh(sparkGeo, sparkMat); m.position.copy(pos); E.scene.add(m); sparks.push({ m, v: new V3((Math.random() - 0.5) * 0.6, 0.6 + Math.random() * 0.9, (Math.random() - 0.5) * 0.6), life: 0.8 + Math.random() * 0.8 }); } };

  function light(l) {
    l.lit = true; l.c.setLit(true); l.flare = 1;
    sfx.strike(); sfx.flame(); after(0.2, () => sfx.sparkle());
    emit(l.p.group.position.clone().add(new V3(0, 0.25, 0)), 12);
    girl.lookAt(l.p.group.position); girl.setExpr('wow', 0.9); girl.talk = voice('girl', Math.random() < 0.5 ? 'wow' : 'yay');
    after(0.9, () => girl.setExpr('grin', 1));
    unlitHints();
    if (!allLit && lanterns.every((x) => x.lit)) {
      allLit = true;
      after(1.0, () => {
        sfx.chime(); papa.setExpr('grin', 3); mama.setExpr('grin', 3); papa.talk = voice('papa', 'laugh'); mama.talk = voice('mama', 'yay');
        girl.setExpr('proud', 3); girl.talk = voice('girl', 'yay');
        E.camSpeed = 0.6; applyShot(shotB); E.focusPoint = O.clone().add(new V3(0, 0.3, -0.6));
        papa.reach('R', papa.root.position.clone().add(new V3(0.25, 1.75, 0.25)));
        after(2.2, () => papa.reach('R', null));
      });
    }
  }
  function pointer(type, ptr) {
    if (type !== 'down') return;
    // tap a lantern
    const all = [{ p: pk, hero: true }, ...lanterns];
    let best = null, bd = 1e9;
    for (const l of all) {
      const s = toScreen(l.p.group.position.clone().add(new V3(0, 0.12, 0)));
      const d = Math.hypot(s.x - ptr.x, s.y - ptr.y);
      if (d < bd) { bd = d; best = l; }
    }
    const lim = 80 * Math.max(1, Math.min(E.w, E.h) / 500);
    if (best && bd < lim) {
      if (best.hero) { sfx.whoosh(); best.spin = 1; heroSpin += 2.2; girl.setExpr('grin', 1); girl.talk = voice('girl', 'giggle'); emit(pk.group.position.clone().add(new V3(0, 0.3, 0)), 6); return; }
      if (!best.lit) light(best);
      else { best.flare = 1; sfx.sparkle(); emit(best.p.group.position.clone().add(new V3(0, 0.25, 0)), 10); girl.setExpr('grin', 0.8); if (Math.random() < 0.5) girl.talk = voice('girl', 'giggle'); }
      return;
    }
    // tap the lawn: kick up leaves
    const hits = pick([grass, ground]);
    if (hits.length) {
      const p = hits[0].point;
      sfx.whoosh();
      for (let i = 0; i < 6; i++) { const f = fl[Math.floor(Math.random() * NF)]; f.p.copy(p).sub(O).add(new V3((Math.random() - 0.5) * 0.3, 0.05, (Math.random() - 0.5) * 0.3)); f.kick = 1.4 + Math.random(); }
      girl.lookAt(p); girl.setExpr('smile');
    }
  }
  let heroSpin = 0;
  function update(dt, t) {
    for (const l of lanterns) {
      l.c.update(t, dt, E.camera);
      l.flare = Math.max(0, l.flare - dt * 1.5);
      l.c.light.intensity *= 1 + l.flare * 1.5;
      l.p.common.uGlow.value = l.c.lit * (1 + l.flare);
    }
    if (heroSpin > 0) { const d = Math.min(heroSpin, dt * 3); pk.body.rotation.y += d; heroSpin -= d; }
    // falling leaves
    const m = new THREE.Matrix4(), qq = new THREE.Quaternion(), ss = new V3();
    for (let i = 0; i < NF; i++) {
      const f = fl[i];
      if (f.kick > 0) { f.p.y += f.kick * dt; f.kick -= dt * 3; } else f.p.y -= f.v * dt;
      f.p.x += Math.sin(t * 1.3 + f.ph) * dt * 0.25; f.p.z += Math.cos(t * 0.9 + f.ph) * dt * 0.1;
      if (f.p.y < 0.01) { f.rest = (f.rest || 0) + dt; f.p.y = 0.01; if (f.rest > 3) { f.p.set((Math.random() - 0.5) * 5, 3.5 + Math.random(), 3 - Math.random() * 7); f.rest = 0; } }
      qq.setFromEuler(new THREE.Euler(f.p.y > 0.02 ? Math.sin(t * 2 + f.ph) * 1.2 : -Math.PI / 2, t * f.spin * (f.p.y > 0.02 ? 1 : 0), f.ph));
      ss.setScalar(f.sc); m.compose(f.p, qq, ss); fall.setMatrixAt(i, m);
    }
    fall.instanceMatrix.needsUpdate = true;
    for (let i = sparks.length - 1; i >= 0; i--) { const s = sparks[i]; s.life -= dt; s.v.y -= 1.5 * dt; s.m.position.addScaledVector(s.v, dt); s.m.scale.setScalar(Math.max(0.01, s.life)); if (s.life <= 0) { E.scene.remove(s.m); sparks.splice(i, 1); } }
    // family idle looks
    papa.lookAt(Math.sin(t * 0.3) > 0 ? girl.head.getWorldPosition(new V3()) : pk.group.position);
    mama.lookAt(Math.sin(t * 0.25 + 1) > -0.2 ? girl.head.getWorldPosition(new V3()) : lanterns[0].p.group.position);
    if (Math.sin(t * 0.35) > 0.85) girl.lookAt(E.camera.position);
  }
  return { update, pointer, lanterns };
}
