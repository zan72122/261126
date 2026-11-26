// The little robot: every metal part carries a per-vertex state (rust removed, shine, oil) that
// the player's tools paint. The shader turns that state into crusty rust -> dull steel -> mirror steel.
import * as THREE from 'three';
import { tex, canvas, canvasTex, aoBlob } from './tex.js';
import { roundBox, pill, latheProfile } from './geo.js';

const METAL_VS_HEAD = `
attribute vec3 aState;
varying vec3 vState; varying vec3 vObjPos; varying vec3 vObjNrm;
uniform vec3 uSeed;
`;
const METAL_FS_HEAD = `
varying vec3 vState; varying vec3 vObjPos; varying vec3 vObjNrm;
uniform sampler2D tRust, tMsk; uniform float uScale;
vec3 triW;
vec4 tri(sampler2D t, vec3 p){
  return texture2D(t, p.yz)*triW.x + texture2D(t, p.xz)*triW.y + texture2D(t, p.xy)*triW.z;
}
vec3 perturbN(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection){
  vec3 vSigmaX = normalize(dFdx(surf_pos)); vec3 vSigmaY = normalize(dFdy(surf_pos)); vec3 vN = surf_norm;
  vec3 R1 = cross(vSigmaY, vN); vec3 R2 = cross(vN, vSigmaX);
  float fDet = dot(vSigmaX, R1) * faceDirection;
  vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);
  return normalize(abs(fDet) * surf_norm - vGrad);
}
float gRust; float gH; float gScr; float gSm; vec3 gRustCol;
`;

export function makeMetalMaterial(seed) {
  const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.5, clearcoat: 0.01, clearcoatRoughness: 0.08, envMapIntensity: 1.5 });
  const tRust = tex('rust_col', { srgb: true }), tMsk = tex('rust_msk');
  m.onBeforeCompile = (sh) => {
    sh.uniforms.tRust = { value: tRust }; sh.uniforms.tMsk = { value: tMsk };
    sh.uniforms.uScale = { value: 3.2 }; sh.uniforms.uSeed = { value: seed };
    sh.vertexShader = METAL_VS_HEAD + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      vState = aState; vObjPos = position*3.2 + uSeed; vObjNrm = normal;`);
    sh.fragmentShader = METAL_FS_HEAD + sh.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>
        triW = pow(abs(normalize(vObjNrm)), vec3(4.0)); triW /= (triW.x+triW.y+triW.z);
        vec4 msk = tri(tMsk, vObjPos);
        gH = msk.r; gScr = msk.g; gSm = msk.b;
        gRustCol = pow(tri(tRust, vObjPos).rgb, vec3(1.12)) * vec3(0.95, 0.86, 0.8);
        float rr = vState.x, ss = vState.y, oil = vState.z;
        // rust survives where its crust is thicker than what has been scrubbed away -> flaky, powdery edges
        float thr = rr*1.18 - 0.06;
        gRust = smoothstep(thr-0.035, thr+0.035, gH);
        // freshly exposed steel: dull grey with grime & tea-coloured stain, polishing -> bright silver
        vec3 dull = mix(vec3(0.30,0.29,0.28), vec3(0.42,0.40,0.38), gSm);
        dull = mix(dull, gRustCol*0.55, (1.0-rr)*0.35 + 0.15*(1.0-ss));
        vec3 bright = vec3(0.90,0.91,0.93) - gScr*0.06;
        vec3 steel = mix(dull, bright, smoothstep(0.0, 1.0, ss));
        vec3 rc = gRustCol * mix(1.0, 0.55, oil);
        diffuseColor.rgb = mix(steel, rc, gRust);
      `)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        float rSteel = mix(0.62 + gSm*0.15, 0.07 + gScr*0.16, smoothstep(0.0,1.0,vState.y));
        roughnessFactor = mix(rSteel, 0.93 - gH*0.1, gRust);
        roughnessFactor = mix(roughnessFactor, 0.12, vState.z*0.7);
      `)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
        metalnessFactor = mix(1.0, 0.04, gRust);
      `)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        float hb = gRust * (gH*1.0) + (1.0-gRust)*(-gScr*0.08*vState.y + gSm*0.05*(1.0-vState.y)) + (1.0-gRust)*smoothstep(0.0,0.06,gH-(vState.x*1.18-0.06))*0.0;
        // edge of the remaining rust: a little raised lip
        hb += (gRust*(1.0-gRust))*0.6;
        vec2 dH = vec2(dFdx(hb), dFdy(hb)) * 1.6;
        normal = perturbN(-vViewPosition, normal, dH, faceDirection);
      `)
      .replace('#include <lights_physical_fragment>', `#include <lights_physical_fragment>
        material.clearcoat = vState.z*0.9; material.clearcoatRoughness = 0.04;
      `);
  };
  m.customProgramCacheKey = () => 'robotMetal';
  return m;
}

// glowing face screen (eyes / mouth) drawn on a canvas
class FaceScreen {
  constructor(w, h) { this.c = canvas(w, h); this.g = this.c.getContext('2d'); this.t = canvasTex(this.c); this.key = ''; }
}

export class Robot {
  constructor(scene) {
    this.root = new THREE.Group();
    scene.add(this.root);
    this.seed = new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10);
    this.mat = makeMetalMaterial(this.seed);
    this.parts = []; // paintable meshes
    this.joints = {};
    this.build();
    this.alive = 0; this.expr = 'off'; this.blinkT = 2;
    this.pose = { neckYaw: 0, neckPitch: 0.25, aLr: 0.1, aLs: 0, aRr: 0.1, aRs: 0, lL: 0, lR: 0, bob: 0, lean: 0 };
    this.drawFace(true);
  }
  addPart(geo, parent, pos, name, opt = {}) {
    const n = geo.attributes.position.count;
    const st = new Float32Array(n * 3);
    geo.setAttribute('aState', new THREE.BufferAttribute(st, 3));
    const m = new THREE.Mesh(geo, this.mat);
    m.position.copy(pos); m.castShadow = true; m.receiveShadow = true; m.name = name;
    parent.add(m);
    geo.computeBoundingSphere();
    m.userData.front = new Uint8Array(n);
    this.parts.push(m);
    return m;
  }
  build() {
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const hips = this.hips = new THREE.Group(); hips.position.y = 0.152; this.root.add(hips);
    const body = this.body = new THREE.Group(); hips.add(body);
    this.addPart(roundBox(0.2, 0.19, 0.15, 0.045, 110), body, V(0, 0.1, 0), 'body');
    // chest door + rivets
    this.addPart(roundBox(0.12, 0.1, 0.02, 0.009, 160), body, V(0, 0.11, 0.072), 'door');
    const riv = pill(0.008, 0.0065, 0.0065, 8, 12);
    for (const [x, y] of [[-0.075, 0.03], [0.075, 0.03], [-0.075, 0.175], [0.075, 0.175], [-0.05, 0.17], [0.05, 0.17], [-0.05, 0.035], [0.05, 0.035]]) {
      const r = this.addPart(riv.clone(), body, V(x, y, 0.072), 'rivet'); r.rotation.x = Math.PI / 2;
    }
    // chest gauge (glass dial, no numbers)
    const gauge = new THREE.Group(); gauge.position.set(0.0, 0.115, 0.083); body.add(gauge);
    this.addPart(new THREE.TorusGeometry(0.026, 0.006, 16, 64), gauge, V(0, 0, 0), 'bezel');
    const dialC = canvas(128, 128), dg = dialC.getContext('2d');
    dg.fillStyle = '#e9e1cf'; dg.beginPath(); dg.arc(64, 64, 62, 0, 7); dg.fill();
    dg.strokeStyle = '#3a3a3a'; dg.lineWidth = 4; for (let i = 0; i < 9; i++) { const a = Math.PI * (0.8 + i * 0.175); dg.beginPath(); dg.moveTo(64 + Math.cos(a) * 44, 64 + Math.sin(a) * 44); dg.lineTo(64 + Math.cos(a) * 56, 64 + Math.sin(a) * 56); dg.stroke(); }
    dg.fillStyle = '#c0392b'; dg.beginPath(); dg.arc(64 + 45, 64 + 26, 10, 0, 7); dg.fill(); dg.fillStyle = '#5c9a4a'; dg.beginPath(); dg.arc(64 - 45, 64 + 26, 10, 0, 7); dg.fill();
    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.025, 40), new THREE.MeshStandardMaterial({ map: canvasTex(dialC), roughness: 0.6 }));
    dial.position.z = -0.002; gauge.add(dial);
    const needle = this.needle = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.02, 0.002), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    needle.geometry.translate(0, 0.009, 0); needle.position.z = 0.001; needle.rotation.z = 2.2; gauge.add(needle);
    this.glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0, transmission: 0, transparent: true, opacity: 0.6, clearcoat: 1, clearcoatRoughness: 0.5 });
    const gg = new THREE.Mesh(new THREE.SphereGeometry(0.026, 32, 12, 0, Math.PI * 2, 0, 0.6), this.glassMat); gg.rotation.x = Math.PI / 2; gg.scale.z = 0.4; gg.position.z = -0.018; gauge.add(gg);
    // neck
    const neck = this.neck = new THREE.Group(); neck.position.set(0, 0.195, 0); hips.add(neck);
    this.neckMesh = this.addPart(pill(0.04, 0.03, 0.026, 18, 32), neck, V(0, -0.005, 0), 'neck');
    const head = this.head = new THREE.Group(); head.position.y = 0.03; neck.add(head);
    this.addPart(roundBox(0.21, 0.155, 0.165, 0.055, 110), head, V(0, 0.08, 0), 'head');
    // ear knobs
    for (const s of [-1, 1]) { const e = this.addPart(pill(0.03, 0.026, 0.02, 14, 28), head, V(s * 0.1, 0.075, 0), 'ear'); e.rotation.z = -s * Math.PI / 2; }
    // antenna
    const ant = this.antenna = new THREE.Group(); ant.position.set(0.0, 0.155, 0); head.add(ant);
    this.addPart(pill(0.06, 0.006, 0.005, 16, 12), ant, V(0, 0, 0), 'antenna');
    this.antBall = this.addPart(new THREE.SphereGeometry(0.014, 24, 16), ant, V(0, 0.066, 0), 'antball');
    // face: eye domes + mouth screen. Screens are emissive canvases behind dusty glass.
    this.eyeScr = new FaceScreen(256, 128); this.mouthScr = new FaceScreen(256, 96);
    const scrMat = (s) => new THREE.MeshBasicMaterial({ map: s.t, toneMapped: true });
    this.eyeMatGlow = scrMat(this.eyeScr); this.mouthMatGlow = scrMat(this.mouthScr);
    const faceZ = 0.0825;
    this.dust = [1, 1, 1];
    this.eyeGlass = [];
    for (const s of [-1, 1]) {
      const ring = this.addPart(new THREE.TorusGeometry(0.031, 0.0075, 16, 64), head, V(s * 0.05, 0.095, faceZ), 'eyering');
      const scr = new THREE.Mesh(new THREE.CircleGeometry(0.03, 40), this.eyeMatGlow);
      // each eye shows its half of the eye canvas
      const uv = scr.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * 0.5 + (s > 0 ? 0.5 : 0));
      scr.position.set(s * 0.05, 0.095, faceZ + 0.0015); head.add(scr);
      const gm = this.glassMat.clone(); gm.opacity = 0.75; gm.roughness = 0.7;
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.031, 32, 12, 0, Math.PI * 2, 0, 0.75), gm);
      dome.rotation.x = Math.PI / 2; dome.scale.set(1, 0.5, 1); dome.position.set(s * 0.05, 0.095, faceZ - 0.006); head.add(dome);
      this.eyeGlass.push(gm);
    }
    const mFrame = this.addPart(roundBox(0.09, 0.04, 0.012, 0.0055, 200), head, V(0, 0.035, faceZ - 0.003), 'mouthframe');
    const mScr = new THREE.Mesh(new THREE.PlaneGeometry(0.074, 0.026), this.mouthMatGlow); mScr.position.set(0, 0.035, faceZ + 0.0068); head.add(mScr);
    const mg = this.glassMat.clone(); mg.opacity = 0.7; mg.roughness = 0.7; this.mouthGlass = mg;
    const mGl = new THREE.Mesh(new THREE.PlaneGeometry(0.074, 0.026), mg); mGl.position.set(0, 0.035, faceZ + 0.0075); head.add(mGl);
    // arms
    this.arms = [];
    for (const s of [-1, 1]) {
      const sh = new THREE.Group(); sh.position.set(s * 0.112, 0.15, 0); hips.add(sh);
      const ball = this.addPart(new THREE.SphereGeometry(0.03, 40, 28), sh, V(0, 0, 0), 'shoulder');
      const up = this.addPart(pill(0.085, 0.022, 0.02, 26, 32), sh, V(s * 0.012, -0.095, 0), 'upperarm');
      const el = new THREE.Group(); el.position.set(s * 0.012, -0.1, 0); sh.add(el);
      this.addPart(new THREE.SphereGeometry(0.022, 32, 20), el, V(0, 0, 0), 'elbow');
      this.addPart(pill(0.075, 0.021, 0.024, 24, 32), el, V(0, -0.08, 0), 'forearm');
      const hand = new THREE.Group(); hand.position.set(0, -0.09, 0); el.add(hand);
      for (const f of [-1, 1]) {
        const fg = this.addPart(pill(0.04, 0.012, 0.008, 16, 20), hand, V(0, -0.038, f * 0.012), 'finger');
        fg.rotation.x = f * 0.35;
      }
      this.addPart(roundBox(0.04, 0.025, 0.045, 0.011, 160), hand, V(0, -0.005, 0), 'palm');
      this.arms.push({ s, sh, el, hand, ball });
    }
    // legs
    this.legs = [];
    for (const s of [-1, 1]) {
      const hp = new THREE.Group(); hp.position.set(s * 0.055, 0.0, 0); hips.add(hp);
      const ball = this.addPart(new THREE.SphereGeometry(0.028, 36, 24), hp, V(0, 0, 0), 'hip');
      this.addPart(pill(0.105, 0.027, 0.029, 30, 32), hp, V(0, -0.118, 0), 'leg');
      const foot = this.addPart(roundBox(0.068, 0.036, 0.1, 0.016, 130), hp, V(0, -0.132, 0.012), 'foot');
      this.legs.push({ s, hp, ball, foot });
    }
    // visible spots for each joint (where the glow sits and the oil should land)
    const anchor = (parent, x, y, z) => { const o = new THREE.Object3D(); o.position.set(x, y, z); parent.add(o); return o; };
    this.joints = {
      neck: { obj: anchor(this.neck, 0, 0.012, 0.075), oil: 0, sq: 0 },
      armL: { obj: anchor(this.arms[0].sh, -0.012, 0.006, 0.026), oil: 0, sq: 0 }, armR: { obj: anchor(this.arms[1].sh, 0.012, 0.006, 0.026), oil: 0, sq: 0 },
      legL: { obj: anchor(this.legs[0].hp, -0.01, -0.02, 0.03), oil: 0, sq: 0 }, legR: { obj: anchor(this.legs[1].hp, 0.01, -0.02, 0.03), oil: 0, sq: 0 },
    };
    this.ao = aoBlob(0.42, 0.36, 0.85); this.root.add(this.ao);
    // initial rust: random patchiness so every robot is a bit different
    for (const p of this.parts) {
      const st = p.geometry.attributes.aState.array, pos = p.geometry.attributes.position.array;
      for (let i = 0; i < st.length; i += 3) { st[i] = 0.0; st[i + 1] = 0; st[i + 2] = 0; }
    }
  }
  // which vertices face the camera (they count toward the polish goal)
  markFront(camPos) {
    const v = new THREE.Vector3(), n = new THREE.Vector3(), nm = new THREE.Matrix3();
    this.root.updateMatrixWorld(true);
    this.frontCount = 0;
    for (const p of this.parts) {
      const pos = p.geometry.attributes.position, nr = p.geometry.attributes.normal, fr = p.userData.front;
      nm.getNormalMatrix(p.matrixWorld);
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(p.matrixWorld); n.fromBufferAttribute(nr, i).applyMatrix3(nm).normalize();
        const to = camPos.clone().sub(v).normalize();
        fr[i] = n.dot(to) > 0.25 ? 1 : 0; this.frontCount += fr[i];
      }
    }
  }
  // paint the state of every vertex within `radius` of the world point. fn(stateArray, index, falloff)
  paint(wp, radius, fn) {
    const lp = new THREE.Vector3(), inv = new THREE.Matrix4();
    let touched = 0;
    for (const p of this.parts) {
      inv.copy(p.matrixWorld).invert(); lp.copy(wp).applyMatrix4(inv);
      const bs = p.geometry.boundingSphere;
      if (lp.distanceTo(bs.center) > bs.radius + radius) continue;
      const pos = p.geometry.attributes.position.array, st = p.geometry.attributes.aState;
      const a = st.array, r2 = radius * radius;
      let hit = false;
      for (let i = 0, j = 0; i < pos.length; i += 3, j++) {
        const dx = pos[i] - lp.x, dy = pos[i + 1] - lp.y, dz = pos[i + 2] - lp.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < r2) { const f = 1 - Math.sqrt(d2) / radius; fn(a, j * 3, f * f * (3 - 2 * f), p, j); hit = true; touched++; }
      }
      if (hit) st.needsUpdate = true;
    }
    return touched;
  }
  // averages over camera-facing vertices: rust removed, shine
  progress() {
    let r = 0, s = 0, n = 0;
    for (const p of this.parts) {
      const a = p.geometry.attributes.aState.array, fr = p.userData.front;
      for (let j = 0; j < fr.length; j++) if (fr[j]) { r += a[j * 3]; s += a[j * 3 + 1]; n++; }
    }
    return { r: n ? r / n : 0, s: n ? s / n : 0 };
  }
  // the least-polished front-facing spot (for the hint hand)
  dullestPoint() {
    let best = null, bv = 9; const v = new THREE.Vector3();
    for (const p of this.parts) {
      if (p.name === 'rivet' || p.name === 'bezel') continue;
      const a = p.geometry.attributes.aState.array, fr = p.userData.front, pos = p.geometry.attributes.position;
      for (let j = 0; j < fr.length; j += 7) if (fr[j]) { const val = a[j * 3] + a[j * 3 + 1] + Math.random() * 0.2; if (val < bv) { bv = val; best = v.fromBufferAttribute(pos, j).applyMatrix4(p.matrixWorld).clone(); } }
    }
    return best;
  }
  // ---------------------------------------------------------- faces
  setExpr(e) { if (this.expr !== e) { this.expr = e; this.drawFace(); } }
  drawFace(force) {
    const e = this.blinking ? 'blink' : this.expr;
    const key = e + (this.alive > 0.5 ? 1 : 0);
    if (!force && key === this.eyeScr.key) return;
    this.eyeScr.key = key;
    const g = this.eyeScr.g, W = 256, H = 128;
    g.fillStyle = '#05080a'; g.fillRect(0, 0, W, H);
    const on = e !== 'off';
    const glow = (x, y, r, col) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
    if (on) {
      for (const cx of [64, 192]) {
        glow(cx, 64, 64, 'rgba(90,170,200,0.35)');
        g.fillStyle = '#bfefff'; g.strokeStyle = '#bfefff'; g.lineCap = 'round';
        if (e === 'happy') { g.lineWidth = 16; g.beginPath(); g.arc(cx, 82, 30, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
        else if (e === 'blink') { g.lineWidth = 12; g.beginPath(); g.moveTo(cx - 28, 66); g.lineTo(cx + 28, 66); g.stroke(); }
        else if (e === 'dizzy') { g.lineWidth = 7; g.beginPath(); for (let a = 0; a < 14; a += 0.2) { const r = a * 2.6; g.lineTo(cx + Math.cos(a + this.spinPh) * r, 64 + Math.sin(a + this.spinPh) * r); } g.stroke(); }
        else if (e === 'surprise') { g.beginPath(); g.arc(cx, 62, 36, 0, 7); g.fill(); g.fillStyle = '#05080a'; g.beginPath(); g.arc(cx, 62, 22, 0, 7); g.fill(); }
        else if (e === 'flicker') { g.globalAlpha = 0.35 + Math.random() * 0.4; g.beginPath(); g.arc(cx, 64, 24, 0, 7); g.fill(); g.globalAlpha = 1; }
        else if (e === 'sad') { g.beginPath(); g.arc(cx, 70, 26, 0, 7); g.fill(); g.fillStyle = '#05080a'; g.fillRect(cx - 40, 30, 80, 26); }
        else { g.beginPath(); g.ellipse(cx + this.look * 8, 64, 26, 30, 0, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(cx + this.look * 8 - 9, 52, 7, 0, 7); g.fill(); }
      }
    }
    this.eyeScr.t.needsUpdate = true;
    const m = this.mouthScr.g, MW = 256, MH = 96;
    m.fillStyle = '#05080a'; m.fillRect(0, 0, MW, MH);
    if (on) {
      m.strokeStyle = '#bfefff'; m.fillStyle = '#bfefff'; m.lineWidth = 12; m.lineCap = 'round';
      const g2 = m.createRadialGradient(128, 48, 0, 128, 48, 130); g2.addColorStop(0, 'rgba(90,170,200,0.3)'); g2.addColorStop(1, 'rgba(0,0,0,0)'); m.fillStyle = g2; m.fillRect(0, 0, MW, MH); m.fillStyle = '#bfefff';
      if (e === 'surprise' || e === 'dizzy') { m.beginPath(); m.ellipse(128, 48, 20, 24, 0, 0, 7); m.stroke(); }
      else if (e === 'sad' || e === 'flicker') { m.beginPath(); for (let x = 70; x <= 186; x += 4) m.lineTo(x, 50 + Math.sin(x * 0.12) * 7); m.stroke(); }
      else if (e === 'happy') { m.beginPath(); m.moveTo(70, 34); m.quadraticCurveTo(128, 100, 186, 34); m.closePath(); m.fill(); }
      else { m.beginPath(); m.moveTo(72, 36); m.quadraticCurveTo(128, 84, 184, 36); m.stroke(); }
    }
    this.mouthScr.t.needsUpdate = true;
  }
  // ---------------------------------------------------------- animation
  update(dt, t) {
    const P = this.pose, J = this.joints;
    this.look = Math.sin(t * 0.7) * 0.5;
    // blinking when alive
    if (this.alive > 0.5 && this.expr === 'idle') {
      this.blinkT -= dt;
      if (this.blinkT < 0) { this.blinking = true; if (this.blinkT < -0.12) { this.blinking = false; this.blinkT = 2 + Math.random() * 3; } }
    } else this.blinking = false;
    if (this.expr === 'dizzy') { this.spinPh = t * 8; this.eyeScr.key = ''; }
    if (this.expr === 'flicker' && Math.random() < 0.2) this.eyeScr.key = '';
    this.drawFace();
    // joints: freedom limited by oil
    const f = (k) => Math.min(1, J[k].oil);
    this.neck.rotation.set(P.neckPitch, P.neckYaw * (0.1 + 0.9 * f('neck')), 0);
    for (const a of this.arms) {
      const k = a.s < 0 ? 'armL' : 'armR', fr = 0.08 + 0.92 * f(k);
      const raise = (a.s < 0 ? P.aLr : P.aRr) * fr, swing = (a.s < 0 ? P.aLs : P.aRs) * fr;
      a.sh.rotation.set(-swing, 0, a.s * raise);
      a.el.rotation.x = -Math.max(0, swing) * 0.6 - 0.15 * fr;
    }
    for (const l of this.legs) {
      const k = l.s < 0 ? 'legL' : 'legR', fr = 0.1 + 0.9 * f(k);
      l.hp.rotation.x = (l.s < 0 ? P.lL : P.lR) * fr;
    }
    this.hips.position.y = 0.152 + P.bob;
    this.hips.rotation.x = P.lean;
    this.needle.rotation.z = 2.2 - this.alive * 3.2 + Math.sin(t * 3) * 0.08 * this.alive;
    // glass dust (cleared by the cloth)
    const dc = (g, d) => { g.roughness = 0.04 + d * 0.6; g.opacity = 0.12 + d * 0.55; g.color.setRGB(1 - d * 0.45, 1 - d * 0.52, 1 - d * 0.6); };
    this.eyeGlass.forEach((g, i) => dc(g, this.dust[i])); dc(this.mouthGlass, this.dust[2]);
    this.eyeMatGlow.color.setScalar(0.3 + this.alive * 2.2); this.mouthMatGlow.color.setScalar(0.3 + this.alive * 2.2);
  }
}
