// Props: helmet, boots, tools, tray, picture sign, pour stream & splashes, sun.
import * as THREE from 'three';
import { RoundedBox, sRGB } from './world.js';
import { paintedMetal } from './truck.js';
import { SLAB } from './concrete.js';

export function buildHelmet(T, hex = '#c99a2e', scale = 1) {
  const g = new THREE.Group();
  const shellMat = paintedMetal(T, hex, { rough: 0.32, grime: 0.35, splat: 0.25, metal: 0, clear: 0.9 });
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.105, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.52), shellMat);
  shell.scale.set(0.93, 0.95, 1.07); shell.castShadow = true; g.add(shell);
  // brim (visor) at front + rim all around
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.007, 8, 48), shellMat); rim.rotation.x = Math.PI / 2; rim.scale.set(0.93, 1.07, 1); rim.position.y = -0.006; g.add(rim);
  const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.118, 0.006, 40, 1, false, -Math.PI * 0.32, Math.PI * 0.64), shellMat);
  visor.scale.set(0.95, 1, 1.12); visor.position.set(0, -0.008, 0.01); visor.rotation.x = 0.12; visor.castShadow = true; g.add(visor);
  // top ridge
  const ridge = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.009, 8, 40, Math.PI), shellMat); ridge.rotation.y = Math.PI / 2; ridge.scale.set(1.07, 0.95, 1); g.add(ridge);
  // inner harness (dark)
  const inner = new THREE.Mesh(new THREE.TorusGeometry(0.088, 0.008, 6, 40), new THREE.MeshStandardMaterial({ color: 0x2a2724, roughness: 0.8 })); inner.rotation.x = Math.PI / 2; inner.position.y = 0.012; g.add(inner);
  // chin strap
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.004, 4, 32, Math.PI), new THREE.MeshStandardMaterial({ color: 0x3a3632, roughness: 0.85 }));
  strap.rotation.set(0, Math.PI / 2, Math.PI); strap.position.set(0, 0.0, 0.0); strap.scale.set(1, 1.15, 1); g.add(strap); g.userData.strap = strap;
  g.scale.setScalar(scale);
  return g;
}

export function buildKidBoot(T) {
  const g = new THREE.Group();
  const rub = new THREE.MeshPhysicalMaterial({ color: sRGB('#9a3a2c'), roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.3, normalMap: T.metalN, normalScale: new THREE.Vector2(0.15, 0.15) });
  const sole = new THREE.MeshStandardMaterial({ color: sRGB('#2a2624'), roughness: 0.85 });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.043, 0.13, 24), rub); shaft.position.set(0, 0.1, -0.02); g.add(shaft);
  const foot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 24, 16), rub); foot.scale.set(0.82, 0.62, 1.7); foot.position.set(0, 0.035, 0.02); g.add(foot);
  const so = new THREE.Mesh(new RoundedBox(0.07, 0.014, 0.17, 0.006), sole); so.position.set(0, 0.006, 0.02); g.add(so);
  const top = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.006, 8, 24), rub); top.rotation.x = Math.PI / 2; top.position.set(0, 0.165, -0.02); g.add(top);
  g.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  return g;
}

export function buildTrowel(T) {
  const g = new THREE.Group();
  const blade = new THREE.Mesh(new RoundedBox(0.24, 0.004, 0.1, 0.0018), new THREE.MeshPhysicalMaterial({ color: sRGB('#9ea2a6'), metalness: 1, roughness: 0.22, normalMap: T.metalN, normalScale: new THREE.Vector2(0.25, 0.25) }));
  blade.castShadow = true; g.add(blade);
  const film = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.08).rotateX(-Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: sRGB('#6a6964'), roughness: 0.4, clearcoat: 1, transparent: true, opacity: 0.0 }));
  film.position.y = -0.0025; film.rotation.x = Math.PI; g.add(film); g.userData.film = film;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.008, 0.05, 8), new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 1, roughness: 0.4 })); post.position.set(0, 0.025, 0); g.add(post);
  const hm = new THREE.MeshStandardMaterial({ map: T.woodC, normalMap: T.woodN, roughness: 0.6, color: sRGB('#d8b58c') });
  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.1, 6, 12), hm); handle.rotation.z = Math.PI / 2; handle.position.set(0, 0.055, 0); handle.castShadow = true; g.add(handle);
  return g;
}

export function buildLeaf() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const c = cv.getContext('2d');
  const grd = c.createRadialGradient(64, 70, 5, 64, 64, 60); grd.addColorStop(0, '#c8742a'); grd.addColorStop(0.6, '#b2441f'); grd.addColorStop(1, '#7e2a16');
  c.fillStyle = grd; c.beginPath();
  for (let i = 0; i <= 60; i++) { const a = -Math.PI / 2 + i / 60 * Math.PI * 2; const lobe = Math.abs(Math.cos((a + Math.PI / 2) * 2.5)); const r = 24 + 33 * Math.pow(lobe, 3) + 3 * Math.cos(a * 18); const rr = a > Math.PI * 0.35 && a < Math.PI * 0.65 ? r * 0.35 : r; c.lineTo(64 + Math.cos(a) * rr, 66 + Math.sin(a) * rr); }
  c.fill();
  c.strokeStyle = 'rgba(240,190,120,0.55)'; c.lineWidth = 2; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.62; c.beginPath(); c.moveTo(64, 72); c.lineTo(64 + Math.cos(a) * 54, 66 + Math.sin(a) * 54); c.stroke(); }
  c.lineWidth = 3; c.strokeStyle = '#6a3a1a'; c.beginPath(); c.moveTo(64, 72); c.lineTo(64, 124); c.stroke();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const g = new THREE.PlaneGeometry(0.12, 0.12, 6, 6); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, (x * x + z * z) * -0.6 + Math.sin(x * 40) * 0.002); }
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ map: t, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.55, sheen: 0.5, sheenColor: new THREE.Color(0.5, 0.3, 0.2) }));
  m.castShadow = true;
  const grp = new THREE.Group(); grp.add(m); return grp;
}

export function buildDinoStamp(T) {
  // cast resin dinosaur foot (three toes with claws) on a short wooden handle block
  const g = new THREE.Group();
  const resin = new THREE.MeshPhysicalMaterial({ color: sRGB('#6f705e'), roughness: 0.55, clearcoat: 0.2, normalMap: T.metalN, normalScale: new THREE.Vector2(0.6, 0.6) });
  const claw = new THREE.MeshPhysicalMaterial({ color: sRGB('#d8cdb6'), roughness: 0.35, clearcoat: 0.6 });
  const pad = new THREE.Mesh(new THREE.SphereGeometry(0.035, 20, 14), resin); pad.scale.set(1.0, 0.55, 1.0); pad.position.set(0, 0.02, 0.04); g.add(pad);
  const toes = [[-0.05, -0.05, 0.45], [0, -0.085, 0], [0.05, -0.05, -0.45]];
  for (const [x, z, a] of toes) {
    const t = new THREE.Mesh(new THREE.CapsuleGeometry(0.013, 0.06, 6, 12), resin); t.rotation.set(Math.PI / 2, 0, a); t.position.set(x * 0.8, 0.018, z * 0.75 + 0.01); g.add(t);
    const cl = new THREE.Mesh(new THREE.ConeGeometry(0.009, 0.03, 10), claw); cl.rotation.set(-Math.PI / 2, 0, a); cl.position.set(x * 1.25, 0.012, z * 1.15 - 0.005); g.add(cl);
  }
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.09, 16), resin); leg.position.set(0, 0.07, 0.03); g.add(leg);
  g.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  return g;
}

// tray (plank) with tool slots
export function buildTray(T) {
  const g = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ map: T.woodC, normalMap: T.woodN, roughnessMap: T.woodORM, roughness: 1, normalScale: new THREE.Vector2(1.2, 1.2) });
  const b = new THREE.Mesh(new RoundedBox(1.3, 0.03, 0.24, 0.005), wood); b.position.y = 0.015; b.castShadow = b.receiveShadow = true; g.add(b);
  for (const z of [-0.06, 0.06]) { const s = new THREE.Mesh(new RoundedBox(1.32, 0.02, 0.03, 0.004), wood); s.position.set(0, 0.04, z * 2); s.castShadow = true; g.add(s); }
  return g;
}

// one picture sign: wet concrete pictogram (hand print ok, boot print crossed)
export function buildSign(T) {
  const g = new THREE.Group();
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 320; const c = cv.getContext('2d');
  c.fillStyle = '#e9e5da'; c.fillRect(0, 0, 256, 320);
  c.strokeStyle = '#b0452a'; c.lineWidth = 12; c.strokeRect(8, 8, 240, 304);
  // wet slab
  c.fillStyle = '#7b7a74'; c.beginPath(); c.moveTo(30, 200); c.lineTo(226, 200); c.lineTo(200, 120); c.lineTo(56, 120); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(80 + i * 25, 150 + (i % 2) * 18, 12, 4, 0, 0, 7); c.fill(); }
  // boot walking on it with red cross
  c.fillStyle = '#2b2a28'; c.beginPath(); c.ellipse(128, 160, 26, 14, 0, 0, 7); c.fill(); c.fillRect(110, 92, 30, 66);
  c.strokeStyle = '#b0452a'; c.lineWidth = 14; c.lineCap = 'round'; c.beginPath(); c.moveTo(70, 80); c.lineTo(186, 216); c.moveTo(186, 80); c.lineTo(70, 216); c.stroke();
  // small hand OK below
  c.fillStyle = '#5b7a4a'; c.beginPath(); c.arc(128, 266, 28, 0, 7); c.fill();
  c.fillStyle = '#e9e5da'; c.beginPath(); c.ellipse(128, 272, 10, 9, 0, 0, 7); c.fill();
  for (let i = 0; i < 5; i++) { const a = -2.6 + i * 0.5; c.beginPath(); c.ellipse(128 + Math.cos(a) * 15, 270 + Math.sin(a) * 15, 3.5, 6, a + Math.PI / 2, 0, 7); c.fill(); }
  const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8;
  const face = new THREE.MeshPhysicalMaterial({ map: tx, roughness: 0.5, clearcoat: 0.4, normalMap: T.metalN, normalScale: new THREE.Vector2(0.2, 0.2) });
  const frame = paintedMetal(T, '#4a4b4c', { rough: 0.5, metal: 0.6, clear: 0 });
  // A-frame
  for (const s of [1, -1]) {
    const p = new THREE.Group(); p.rotation.x = s * 0.2; g.add(p);
    const panel = new THREE.Mesh(new RoundedBox(0.42, 0.52, 0.012, 0.004), frame); panel.position.y = 0.42; panel.castShadow = true; p.add(panel);
    if (s > 0) { const f = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.475), face); f.position.set(0, 0.42, 0.0065); p.add(f); }
    for (const x of [-0.2, 0.2]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.72, 6), frame); leg.position.set(x, 0.36, s * -0.004); leg.castShadow = true; p.add(leg); }
  }
  g.traverse(m => { if (m.isMesh) m.receiveShadow = true; });
  return g;
}

// falling concrete stream from the chute lip + splash blobs
export class PourFX {
  constructor(scene, T) {
    this.mat = new THREE.MeshPhysicalMaterial({ color: sRGB('#5f5e59'), roughness: 0.38, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.2 });
    this.mat.onBeforeCompile = (sh) => {
      sh.uniforms.uT = this.uT = { value: 0 }; sh.uniforms.tD = { value: T.concreteD };
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uT; uniform sampler2D tD; varying vec2 vU;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          vU = uv;
          float n = texture2D(tD, vec2(uv.x*0.3, uv.y*0.6 - uT*0.9)).b - 0.5;
          float n2 = texture2D(tD, vec2(uv.x*0.7+0.3, uv.y*1.4 - uT*1.6)).b - 0.5;
          transformed += normal * (n*0.05 + n2*0.04) * smoothstep(0.0, 0.1, uv.x) * (0.6 + uv.x);`);
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uT; uniform sampler2D tD; varying vec2 vU;')
        .replace('#include <color_fragment>', `#include <color_fragment>
          vec4 dd = texture2D(tD, vec2(vU.x*1.5, vU.y*3.0 - uT*2.0));
          diffuseColor.rgb *= 0.8 + 0.4*dd.g; diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.2,0.18,0.15), smoothstep(0.4,0.7,dd.r)*0.5);`);
    };
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), this.mat); this.mesh.castShadow = true; this.mesh.frustumCulled = false; scene.add(this.mesh);
    this.mesh.visible = false;
    // splash blobs
    const n = 90; this.n = n;
    const bg = new THREE.IcosahedronGeometry(1, 1);
    this.blobs = new THREE.InstancedMesh(bg, this.mat, n); this.blobs.frustumCulled = false; this.blobs.castShadow = true; scene.add(this.blobs);
    this.P = Array.from({ length: n }, () => ({ life: 0, p: new THREE.Vector3(), v: new THREE.Vector3(), s: 0, rot: new THREE.Euler() }));
    this.M = new THREE.Matrix4(); this.flowAmt = 0; this.k = 0;
    for (let i = 0; i < n; i++) { this.M.makeScale(0, 0, 0); this.blobs.setMatrixAt(i, this.M); }
  }
  update(dt, t, lip, dir, groundY, flow) {
    this.flowAmt = flow; this.uT && (this.uT.value = t);
    if (flow < 0.02) { this.mesh.visible = false; }
    else {
      // stream curve: leaves lip with chute direction, falls under gravity
      const v0 = dir.clone().multiplyScalar(1.3); const pts = [];
      let p = lip.clone(), v = v0.clone();
      for (let i = 0; i < 14; i++) { pts.push(p.clone()); const st = 0.03; v.y -= 9.8 * st; p.addScaledVector(v, st); if (p.y < groundY) { p.y = groundY; pts.push(p.clone()); break; } }
      const curve = new THREE.CatmullRomCurve3(pts);
      const g = new THREE.TubeGeometry(curve, 28, 0.05 * Math.sqrt(flow) + 0.01, 14, false);
      // taper: thinner as it accelerates
      const pa = g.attributes.position, uv = g.attributes.uv;
      for (let i = 0; i < pa.count; i++) {
        const u = uv.getX(i); const c = curve.getPointAt(Math.min(1, u));
        const s = (1 - u * 0.4) * (u < 0.08 ? 1.0 + (0.08 - u) * 4 : 1); pa.setXYZ(i, c.x + (pa.getX(i) - c.x) * s * 1.3, c.y + (pa.getY(i) - c.y) * s * 0.8, c.z + (pa.getZ(i) - c.z) * s);
      }
      g.computeVertexNormals();
      this.mesh.geometry.dispose(); this.mesh.geometry = g; this.mesh.visible = true;
      this.impact = pts[pts.length - 1];
      // spawn splashes
      this.k += dt * 45 * flow;
      while (this.k > 1) {
        this.k -= 1; const b = this.P.find(q => q.life <= 0); if (!b) break;
        b.life = 0.4 + Math.random() * 0.5; b.p.copy(this.impact).add(new THREE.Vector3((Math.random() - 0.5) * 0.08, 0.01, (Math.random() - 0.5) * 0.08));
        const a = Math.random() * Math.PI * 2, sp = 0.3 + Math.random() * 0.9;
        b.v.set(Math.cos(a) * sp, 0.6 + Math.random() * 1.0, Math.sin(a) * sp);
        b.s = 0.006 + Math.pow(Math.random(), 2.2) * 0.022; b.rot.set(Math.random() * 6, Math.random() * 6, 0); b.gy = groundY;
      }
    }
    for (let i = 0; i < this.n; i++) {
      const b = this.P[i];
      if (b.life > 0) {
        b.life -= dt; b.v.y -= 9.8 * dt; b.p.addScaledVector(b.v, dt);
        if (b.p.y < b.gy) { b.p.y = b.gy; b.v.set(0, 0, 0); b.life = Math.min(b.life, 0.12); }
        const sc = b.s * (b.life < 0.12 ? b.life / 0.12 : 1);
        this.M.compose(b.p, new THREE.Quaternion().setFromEuler(b.rot), new THREE.Vector3(sc, sc * 0.8, sc * 1.1));
      } else this.M.makeScale(0, 0, 0);
      this.blobs.setMatrixAt(i, this.M);
    }
    this.blobs.instanceMatrix.needsUpdate = true;
  }
}

// sun disc that appears in the fog when the work is done (tap to pass time)
export function buildSun() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const c = cv.getContext('2d');
  const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,246,225,1)'); g.addColorStop(0.18, 'rgba(255,226,170,1)'); g.addColorStop(0.3, 'rgba(255,190,120,0.55)'); g.addColorStop(1, 'rgba(255,170,100,0)');
  c.fillStyle = g; c.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, color: new THREE.Color(3, 2.6, 2.2), transparent: true, depthWrite: false, fog: false }));
  return m;
}
