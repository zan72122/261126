// The garden at the end of summer, late afternoon, windy: sky, sun, lawn, patio, fence,
// house wall, shrubs, trees, the work table, two galvanised tubs and the clothesline.
import * as THREE from '../vendor/three.module.min.js';

const loader = new THREE.TextureLoader();
const BASE = 'assets/tex/';
export const SUN_DIR = new THREE.Vector3(0.58, 0.62, 0.53).normalize();

export function tex(name, { repeat = 1, srgb = false, aniso = 8 } = {}) {
  const t = loader.load(BASE + name);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (Array.isArray(repeat)) t.repeat.set(repeat[0], repeat[1]); else t.repeat.set(repeat, repeat);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = aniso;
  return t;
}

function pbr(prefix, repeat, opts = {}) {
  const m = new THREE.MeshStandardMaterial({ color: opts.color || 0xffffff, roughness: 1, metalness: opts.metal ? 1 : 0, ...opts.extra });
  m.map = tex(prefix + '_a.jpg', { repeat, srgb: true });
  m.normalMap = tex(prefix + '_n.jpg', { repeat });
  m.normalScale = new THREE.Vector2(opts.ns || 1, opts.ns || 1);
  const orm = tex(prefix + '_orm.jpg', { repeat });
  m.roughnessMap = orm; m.aoMap = orm; m.aoMapIntensity = opts.ao ?? 1;
  if (opts.metal) m.metalnessMap = orm;
  return m;
}

// ---------------------------------------------------------------- sky
const SKY_FRAG = /* glsl */`
  varying vec3 vDir; uniform vec3 uSun; uniform float uTime;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
  float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
  void main(){
    vec3 d = normalize(vDir);
    float h = max(d.y, 0.0);
    vec3 zen = vec3(0.16, 0.34, 0.78), hor = vec3(0.62, 0.74, 0.88);
    vec3 col = mix(hor, zen, pow(h, 0.55));
    float sd = max(dot(d, uSun), 0.0);
    col += vec3(1.0, 0.78, 0.5) * (pow(sd, 6.0) * 0.35 + pow(sd, 64.0) * 0.9);
    col += vec3(1.0, 0.9, 0.75) * smoothstep(0.9995, 0.99975, sd) * 40.0;
    // drifting cumulus
    if (d.y > 0.0) {
      vec2 uv = d.xz / (d.y + 0.12) * 1.4 + vec2(uTime * 0.012, uTime * 0.004);
      float c = smoothstep(0.52, 0.78, fbm(uv));
      float shade = 0.75 + 0.25 * fbm(uv * 2.0 + 3.0);
      vec3 cc = mix(vec3(0.78, 0.8, 0.85), vec3(1.05, 0.98, 0.92), shade) * (1.0 + 0.6 * pow(sd, 4.0));
      col = mix(col, cc, c * smoothstep(0.0, 0.15, d.y) * 0.85);
    }
    // ground below horizon (for reflections/env)
    float g = smoothstep(0.0, -0.08, d.y);
    col = mix(col, vec3(0.16, 0.2, 0.09), g);
    gl_FragColor = vec4(col * 1.25, 1.0);
  }`;

export function makeSky() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { uSun: { value: SUN_DIR.clone() }, uTime: { value: 0 } },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position,1.0); gl_Position = p.xyww; }',
    fragmentShader: SKY_FRAG,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), mat);
  m.frustumCulled = false; m.renderOrder = -10;
  return m;
}

export function makeEnvMap(renderer) {
  const s = new THREE.Scene();
  s.add(makeSky());
  // ground, fence band, house: rough colour blocks so reflections & fill feel like a garden
  const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.13, 0.17, 0.07) }));
  ground.position.y = -0.01; s.add(ground);
  const patio = new THREE.Mesh(new THREE.PlaneGeometry(6, 5).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.38, 0.35, 0.31) }));
  s.add(patio);
  const fence = new THREE.Mesh(new THREE.BoxGeometry(14, 1.8, 0.1), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.22, 0.16, 0.11) }));
  fence.position.set(0, 0.9, -4.5); s.add(fence);
  const house = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.75, 0.73, 0.68) }));
  house.position.set(-3.8, 2.5, -1); s.add(house);
  const trees = new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 8, 32, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.09, 0.13, 0.05), side: THREE.BackSide }));
  trees.position.y = 3.2; s.add(trees);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(60, 48, 36) }));
  sun.position.copy(SUN_DIR).multiplyScalar(90); s.add(sun);
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(s, 0.02, 0.1, 400);
  pm.dispose();
  return rt.texture;
}

// ---------------------------------------------------------------- helpers
function blobTex() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const g = cv.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,0.75)'); gr.addColorStop(0.45, 'rgba(0,0,0,0.38)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(cv);
}
let _blob = null;
export function contactShadow(w, d, strength = 0.6) {
  _blob = _blob || blobTex();
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: _blob, transparent: true, opacity: strength, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
  m.renderOrder = 1;
  return m;
}

function windSway(mat, amp = 0.05, freq = 1.3, hRef = 1.0) {
  const u = { uTime: { value: 0 }, uWind: { value: 1 } };
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime; uniform float uWind;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec4 wp0 = vec4(position, 1.0);
        #ifdef USE_INSTANCING
          wp0 = instanceMatrix * wp0;
        #endif
        wp0 = modelMatrix * wp0;
        float hh = clamp(position.y / ${hRef.toFixed(2)} + 0.5, 0.0, 1.5);
        float ph = wp0.x * 0.7 + wp0.z * 0.4;
        float gust = uWind * (0.6 + 0.4 * sin(uTime * 0.7 + ph * 0.2));
        transformed.x += (sin(uTime * ${freq.toFixed(2)} + ph) * 0.6 + sin(uTime * ${(freq * 2.7).toFixed(2)} + ph * 3.1) * 0.25 + 0.6) * ${amp.toFixed(3)} * hh * gust;
        transformed.z += cos(uTime * ${(freq * 1.3).toFixed(2)} + ph * 1.7) * ${(amp * 0.5).toFixed(3)} * hh * gust;`);
  };
  mat.userData.wind = u;
  return u;
}

function leafCluster(count, rx, ry, rz, quad, rng) {
  const geo = new THREE.PlaneGeometry(quad, quad);
  const pos = [];
  for (let i = 0; i < count; i++) {
    let x, y, z; do { x = rng() * 2 - 1; y = rng() * 2 - 1; z = rng() * 2 - 1; } while (x * x + y * y + z * z > 1);
    pos.push([x * rx, y * ry, z * rz]);
  }
  return { geo, pos };
}

function mulberry(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---------------------------------------------------------------- world
export class World {
  constructor(scene, renderer) {
    this.scene = scene;
    this.winds = [];
    const rng = this.rng = mulberry(5);
    // lights
    const sun = this.sun = new THREE.DirectionalLight(new THREE.Color(1.0, 0.86, 0.7), 3.4);
    sun.position.copy(SUN_DIR).multiplyScalar(12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera; sc.left = -3.2; sc.right = 3.2; sc.top = 3.2; sc.bottom = -3.2; sc.near = 2; sc.far = 30;
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.012; sun.shadow.radius = 4;
    sun.target.position.set(0, 0.5, -0.6);
    scene.add(sun); scene.add(sun.target);
    // subtle warm bounce from the patio
    const bounce = new THREE.HemisphereLight(new THREE.Color(0.0, 0.0, 0.0), new THREE.Color(0.5, 0.42, 0.3), 0.25);
    scene.add(bounce);
    this.sky = makeSky(); scene.add(this.sky);

    // ground: lawn + patio
    const lawn = pbr('grass', 18, { ns: 1.2 });
    const lg = new THREE.PlaneGeometry(36, 36, 1, 1).rotateX(-Math.PI / 2);
    lg.setAttribute('uv1', lg.attributes.uv);
    const lawnM = new THREE.Mesh(lg, lawn); lawnM.receiveShadow = true; lawnM.position.y = -0.005; scene.add(lawnM);
    const pav = pbr('paver', [3.2, 2.4], { ns: 1.3 });
    const pg = new THREE.BoxGeometry(3.84, 0.03, 2.88); pg.setAttribute('uv1', pg.attributes.uv);
    const patio = new THREE.Mesh(pg, pav); patio.position.set(0.05, 0.0, -0.75); patio.receiveShadow = true; scene.add(patio);
    this.patioY = 0.015;

    this.mats = {};
    this.mats.wood = pbr('wood', 1, { ns: 1.4 });
    this.mats.fence = pbr('fence', 1, { ns: 1.2 });
    this.mats.galv = pbr('galv', [3, 1], { metal: true, ns: 0.6 }); this.mats.galv.metalness = 0.75; this.mats.galv.envMapIntensity = 0.8;
    this.mats.siding = pbr('siding', [4, 2.4], { ns: 1.0 });

    this.buildFence(rng);
    this.buildHouse();
    this.buildPlants(rng);
    this.buildTable();
    this.buildTubs();
    this.buildLine();
    this.buildGrassTufts(rng);
  }

  buildFence(rng) {
    const n = 90, w = 0.14;
    const g = new THREE.BoxGeometry(w - 0.008, 1.8, 0.02); g.setAttribute('uv1', g.attributes.uv);
    // rotate uv so grain runs vertical
    const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) { const u = uv.getX(i), v = uv.getY(i); uv.setXY(i, v * 0.9, u * 0.14); }
    const m = new THREE.InstancedMesh(g, this.mats.fence, n);
    const o = new THREE.Object3D(); const col = new THREE.Color();
    for (let i = 0; i < n; i++) {
      o.position.set(-6.3 + i * w, 0.9 + (rng() - 0.5) * 0.02, -4.5 + (rng() - 0.5) * 0.006);
      o.rotation.set(0, 0, (rng() - 0.5) * 0.01);
      o.updateMatrix(); m.setMatrixAt(i, o.matrix);
      const k = 0.85 + rng() * 0.3; m.setColorAt(i, col.setRGB(k, k * (0.96 + rng() * 0.06), k * (0.92 + rng() * 0.08)));
    }
    m.castShadow = true; m.receiveShadow = true; this.scene.add(m);
    for (const y of [0.35, 1.45]) {
      const rg = new THREE.BoxGeometry(12.6, 0.09, 0.04); rg.setAttribute('uv1', rg.attributes.uv);
      const r = new THREE.Mesh(rg, this.mats.fence); r.position.set(0, y, -4.53); r.receiveShadow = true; this.scene.add(r);
    }
  }

  buildHouse() {
    const wg = new THREE.BoxGeometry(0.25, 4.2, 9); wg.setAttribute('uv1', wg.attributes.uv);
    const uv = wg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2.4, uv.getY(i) * 1.7);
    const wall = new THREE.Mesh(wg, this.mats.siding); wall.position.set(-3.7, 2.1, -0.5); wall.receiveShadow = true; wall.castShadow = true; this.scene.add(wall);
    // window with frame and glass
    const frameM = new THREE.MeshStandardMaterial({ color: 0xf2efe8, roughness: 0.5 });
    const glassM = new THREE.MeshPhysicalMaterial({ color: 0x1b2228, roughness: 0.03, metalness: 0.0, clearcoat: 1, envMapIntensity: 1.6 });
    const win = new THREE.Group(); win.position.set(-3.56, 1.45, -1.4);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.1).rotateY(Math.PI / 2), glassM); win.add(glass);
    for (const [y, h, z, w] of [[0.58, 0.07, 0, 1.36], [-0.58, 0.09, 0, 1.4], [0, 1.2, 0.64, 0.07], [0, 1.2, -0.64, 0.07], [0, 1.1, 0, 0.04]]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, w), frameM); b.position.set(0.02, y, z); b.castShadow = true; win.add(b);
    }
    const sill = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.035, 1.5), frameM); sill.position.set(0.06, -0.64, 0); sill.castShadow = true; win.add(sill);
    this.scene.add(win);
    // back door (2m)
    const door = new THREE.Group(); door.position.set(-3.56, 1.0, 1.6);
    const dm = new THREE.MeshStandardMaterial({ color: 0x5d6f72, roughness: 0.55 });
    dm.normalMap = tex('wood_n.jpg', { repeat: [0.5, 1] });
    const dp = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.0, 0.9), dm); dp.castShadow = true; door.add(dp);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), new THREE.MeshStandardMaterial({ color: 0xb89a6a, metalness: 1, roughness: 0.3 }));
    knob.position.set(0.05, 0, -0.36); door.add(knob);
    for (const [y, h, z, w] of [[1.03, 0.07, 0, 1.06], [0, 2.1, 0.5, 0.07], [0, 2.1, -0.5, 0.07]]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.07, h, w), frameM); b.position.set(0.01, y, z); door.add(b);
    }
    this.scene.add(door);
    // downpipe
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.1, 16), new THREE.MeshStandardMaterial({ color: 0x8b8d8a, roughness: 0.4, metalness: 0.6 }));
    pipe.position.set(-3.52, 2.05, -3.9); pipe.castShadow = true; this.scene.add(pipe);
    const cs = contactShadow(0.7, 3.0, 0.5); cs.position.set(-3.45, 0.017, -0.5); cs.scale.set(1, 1, 3); this.scene.add(cs);
  }

  buildPlants(rng) {
    const leafTex = tex('leaves.png', { srgb: true }); leafTex.wrapS = leafTex.wrapT = THREE.ClampToEdgeWrapping;
    const leafTex2 = tex('leaves2.png', { srgb: true }); leafTex2.wrapS = leafTex2.wrapT = THREE.ClampToEdgeWrapping;
    const mk = (t, amp, f) => {
      const m = new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.75, color: 0xffffff });
      this.winds.push(windSway(m, amp, f, 0.6));
      return m;
    };
    const shrubMat = mk(leafTex2, 0.03, 1.8);
    const treeMat = mk(leafTex, 0.07, 1.1);
    const o = new THREE.Object3D();
    const addCluster = (mat, cx, cy, cz, rx, ry, rz, count, quad, darkCore, shadow = true) => {
      const { geo, pos } = leafCluster(count, rx, ry, rz, quad, rng);
      const im = new THREE.InstancedMesh(geo, mat, count);
      const col = new THREE.Color();
      pos.forEach((p, i) => {
        o.position.set(cx + p[0], cy + p[1], cz + p[2]);
        o.rotation.set(rng() * Math.PI, rng() * Math.PI * 2, rng() * Math.PI);
        const s = 0.7 + rng() * 0.6; o.scale.set(s, s, s);
        o.updateMatrix(); im.setMatrixAt(i, o.matrix);
        // darker inside, lighter on the sunny top/side
        const lit = 0.55 + 0.45 * Math.max(0, (p[1] / ry) * 0.6 + (p[0] / rx) * -0.3 + 0.4);
        im.setColorAt(i, col.setRGB(lit, lit * (0.98 + rng() * 0.08), lit * 0.9));
      });
      im.castShadow = shadow; im.receiveShadow = shadow;
      this.scene.add(im);
      if (darkCore) {
        const core = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshStandardMaterial({ color: 0x1c2a10, roughness: 1 }));
        core.scale.set(rx * 0.8, ry * 0.8, rz * 0.8); core.position.set(cx, cy, cz); this.scene.add(core);
      }
    };
    // shrubs along the fence
    for (let x = -3.2; x < 6; x += 1.1 + rng() * 0.5) addCluster(shrubMat, x, 0.55, -4.15, 0.6 + rng() * 0.2, 0.55 + rng() * 0.2, 0.35, 160, 0.42, true);
    // big trees behind the fence
    const trunkM = new THREE.MeshStandardMaterial({ color: 0x6b5a4a, roughness: 0.9 });
    trunkM.map = tex('fence_a.jpg', { repeat: [1, 3], srgb: true }); trunkM.normalMap = tex('fence_n.jpg', { repeat: [1, 3] });
    for (const [x, z, h, r] of [[-1.5, -7.5, 5.5, 2.4], [2.8, -8.5, 6.5, 2.8], [6.5, -6.5, 5, 2.2], [-5.5, -9, 6, 2.6], [0.8, -13, 7.5, 3.5]]) {
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, h, 12), trunkM); tr.position.set(x, h / 2, z); this.scene.add(tr);
      addCluster(treeMat, x, h + 0.3, z, r, r * 0.75, r, 260, 1.3, true);
    }
    // far treeline
    for (let i = 0; i < 14; i++) {
      const a = -1.2 + i * 0.18; const R = 22 + rng() * 6;
      addCluster(treeMat, Math.sin(a) * R, 3 + rng() * 2, -Math.cos(a) * R, 3.5, 3, 3, 120, 2.6, true, false);
    }
    // a potted plant near the house
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.34, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0xb0684a, roughness: 0.85, side: THREE.DoubleSide }));
    pot.material.normalMap = tex('paver_n.jpg', { repeat: [2, 1] });
    pot.position.set(-3.1, 0.17, -2.6); pot.castShadow = true; this.scene.add(pot);
    addCluster(shrubMat, -3.1, 0.55, -2.6, 0.32, 0.3, 0.32, 90, 0.3, true);
    const cs = contactShadow(0.7, 0.7, 0.7); cs.position.set(-3.1, 0.018, -2.6); this.scene.add(cs);
  }

  buildGrassTufts(rng) {
    // blades along the patio edge so the lawn has real depth
    const cv = document.createElement('canvas'); cv.width = 64; cv.height = 256; const g = cv.getContext('2d');
    for (let i = 0; i < 22; i++) {
      const x = 4 + Math.random() * 56, h = 120 + Math.random() * 130, lean = (Math.random() - 0.5) * 40;
      const gr = g.createLinearGradient(0, 256, 0, 256 - h);
      const dry = Math.random() < 0.25;
      gr.addColorStop(0, dry ? '#3f3a22' : '#1d290c'); gr.addColorStop(1, dry ? '#8c8150' : '#5a7229');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x - 2.5, 256); g.quadraticCurveTo(x + lean * 0.3, 256 - h * 0.6, x + lean, 256 - h); g.quadraticCurveTo(x + lean * 0.3 + 1, 256 - h * 0.6, x + 2.5, 256); g.fill();
    }
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.8 });
    this.winds.push(windSway(mat, 0.035, 2.2, 0.12));
    const geo = new THREE.PlaneGeometry(0.08, 0.085); geo.translate(0, 0.042, 0);
    const N = 7000; const im = new THREE.InstancedMesh(geo, mat, N); const o = new THREE.Object3D();
    let k = 0;
    while (k < N) {
      const x = (rng() - 0.5) * 9, z = -5 + rng() * 8;
      const inPatio = x > -1.9 && x < 2.0 && z > -2.2 && z < 0.7;
      if (inPatio || x < -3.55 || z < -4.4) continue;
      const near = Math.min(Math.abs(x + 1.9), Math.abs(x - 2.0), Math.abs(z + 2.2), Math.abs(z - 0.7));
      if (rng() > Math.exp(-near * 1.6) * 0.95 + 0.04) continue;
      o.position.set(x, 0, z); o.rotation.set(0, rng() * Math.PI, 0); const s = 0.7 + rng() * 0.7; o.scale.set(s, s * (0.8 + rng() * 0.5), s);
      o.updateMatrix(); im.setMatrixAt(k++, o.matrix);
    }
    im.receiveShadow = true; this.scene.add(im);
  }

  buildTable() {
    // child-height garden table (top at 0.52 m)
    const g = new THREE.Group(); g.position.set(-0.56, 0, 0.02); this.table = g;
    const topH = 0.52, W = 0.92, D = 0.56;
    const tg = new THREE.BoxGeometry(W, 0.035, D); tg.setAttribute('uv1', tg.attributes.uv);
    const uv = tg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.9, uv.getY(i) * 0.55);
    const top = new THREE.Mesh(tg, this.mats.wood); top.position.y = topH - 0.0175; top.castShadow = top.receiveShadow = true; g.add(top);
    const lg = new THREE.BoxGeometry(0.045, topH - 0.035, 0.045); lg.setAttribute('uv1', lg.attributes.uv);
    for (const [x, z] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const l = new THREE.Mesh(lg, this.mats.wood); l.position.set(x * (W / 2 - 0.05), (topH - 0.035) / 2, z * (D / 2 - 0.05)); l.castShadow = true; g.add(l);
      const cs = contactShadow(0.14, 0.14, 0.8); cs.position.set(x * (W / 2 - 0.05), 0.017, z * (D / 2 - 0.05)); g.add(cs);
    }
    const ap = new THREE.BoxGeometry(W - 0.12, 0.06, 0.02); ap.setAttribute('uv1', ap.attributes.uv);
    for (const z of [1, -1]) { const a = new THREE.Mesh(ap, this.mats.wood); a.position.set(0, topH - 0.065, z * (D / 2 - 0.05)); g.add(a); }
    const cs = contactShadow(W * 1.1, D * 1.2, 0.35); cs.position.y = 0.017; g.add(cs);
    this.scene.add(g);
    this.tableTop = topH;
    // a ball of cotton twine on the table
    const spool = new THREE.Group();
    const tw = tex('twine_a.jpg', { repeat: [3, 6], srgb: true });
    const twn = tex('twine_n.jpg', { repeat: [3, 6] });
    this.twineMat = new THREE.MeshStandardMaterial({ map: tw, normalMap: twn, roughness: 0.92, color: 0xffffff });
    const bg = new THREE.SphereGeometry(0.042, 32, 20); bg.scale(1, 0.82, 1);
    const ball = new THREE.Mesh(bg, this.twineMat); ball.castShadow = true; ball.rotation.set(0.6, 0.3, 0.9); spool.add(ball);
    for (let i = 0; i < 5; i++) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.041, 0.0028, 6, 40), this.twineMat);
      band.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3); band.scale.y = 0.82; spool.add(band);
    }
    const tail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.03, -0.02, 0.02), new THREE.Vector3(0.07, -0.033, 0.05), new THREE.Vector3(0.12, -0.034, 0.03), new THREE.Vector3(0.16, -0.034, 0.07)]), 24, 0.0018, 5), this.twineMat);
    spool.add(tail);
    spool.position.set(-0.17, topH + 0.034, -0.19);
    this.scene.add(spool); this.spool = spool;
  }

  buildTubs() {
    // low wooden bench carrying two galvanised tubs
    const bench = new THREE.Group(); bench.position.set(0.64, 0, 0.0);
    const bt = new THREE.BoxGeometry(1.22, 0.04, 0.5); bt.setAttribute('uv1', bt.attributes.uv);
    const top = new THREE.Mesh(bt, this.mats.wood); top.position.y = 0.22; top.castShadow = top.receiveShadow = true; bench.add(top);
    const lg = new THREE.BoxGeometry(0.05, 0.2, 0.44); lg.setAttribute('uv1', lg.attributes.uv);
    for (const x of [-0.54, 0.54]) { const l = new THREE.Mesh(lg, this.mats.wood); l.position.set(x, 0.1, 0); l.castShadow = true; bench.add(l); const c = contactShadow(0.2, 0.6, 0.75); c.position.set(x, 0.017, 0); bench.add(c); }
    const cs = contactShadow(1.4, 0.7, 0.35); cs.position.y = 0.017; bench.add(cs);
    this.scene.add(bench);
    // lathe profile of a tub (outer & inner wall, rolled rim, bottom ribs)
    const pts = [];
    const H = 0.25, R0 = 0.185, R1 = 0.225;
    pts.push(new THREE.Vector2(0.0, 0.0));
    pts.push(new THREE.Vector2(R0 - 0.02, 0.0)); pts.push(new THREE.Vector2(R0 - 0.004, 0.006)); pts.push(new THREE.Vector2(R0, 0.02));
    for (let i = 0; i <= 10; i++) { const t = i / 10; const r = R0 + (R1 - R0) * t; const y = 0.02 + (H - 0.03) * t; const rib = (t > 0.15 && t < 0.2) || (t > 0.85 && t < 0.9) ? 0.004 : 0; pts.push(new THREE.Vector2(r + rib, y)); }
    for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * Math.PI * 1.5; pts.push(new THREE.Vector2(R1 + 0.008 + Math.cos(a) * 0.009, H - 0.01 + 0.009 + Math.sin(a) * 0.009)); }
    pts.push(new THREE.Vector2(R1 - 0.004, H - 0.006));
    for (let i = 10; i >= 0; i--) { const t = i / 10; pts.push(new THREE.Vector2(R0 - 0.004 + (R1 - R0 - 0.0) * t - 0.002, 0.024 + (H - 0.04) * t)); }
    pts.push(new THREE.Vector2(0.0, 0.012));
    const lathe = new THREE.LatheGeometry(pts, 64); lathe.setAttribute('uv1', lathe.attributes.uv);
    this.tubs = [];
    const liquids = [
      { color: new THREE.Color(0.06, 0.11, 0.13), x: 0.29, kind: 'indigo' },
      { color: new THREE.Color(0.42, 0.04, 0.16), x: -0.29, kind: 'pink' },
    ];
    for (const L of liquids) {
      const tub = new THREE.Group(); tub.position.set(bench.position.x + L.x, 0.24, 0.0);
      const shell = new THREE.Mesh(lathe, this.mats.galv); shell.castShadow = true; shell.receiveShadow = true; tub.add(shell);
      // handles
      for (const s of [-1, 1]) {
        const h = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.0045, 8, 20, Math.PI), this.mats.galv);
        h.position.set(s * (R1 + 0.012), H - 0.05, 0); h.rotation.set(0, s > 0 ? -Math.PI / 2 : Math.PI / 2, Math.PI); h.rotation.x = 0; h.rotation.y = s > 0 ? Math.PI / 2 : -Math.PI / 2; h.rotation.z = 0; h.rotateX(Math.PI); h.castShadow = true; tub.add(h);
      }
      const cs = contactShadow(0.56, 0.56, 0.7); cs.position.y = 0.002; tub.add(cs);
      this.scene.add(tub);
      this.tubs.push({ group: tub, kind: L.kind, color: L.color, R0, R1, H, level: 0.17, x: tub.position.x, z: tub.position.z, baseY: tub.position.y });
    }
  }

  buildLine() {
    // two galvanised posts with cross arms and a cotton rope between
    const postM = this.mats.galv;
    const x0 = -1.75, x1 = 1.75, z = -1.85, h = 1.78;
    this.line = { x0, x1, z, y: 1.6 };
    for (const x of [x0, x1]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.026, h, 20), postM); p.position.set(x, h / 2, z); p.castShadow = true; this.scene.add(p);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.5, 14), postM); arm.rotation.x = Math.PI / 2; arm.position.set(x, 1.62, z); arm.castShadow = true; this.scene.add(arm);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 10), postM); cap.position.set(x, h, z); this.scene.add(cap);
      const cs = contactShadow(0.25, 0.25, 0.8); cs.position.set(x, 0.017, z); this.scene.add(cs);
    }
    const ropeMat = new THREE.MeshStandardMaterial({ map: tex('twine_a.jpg', { repeat: [220, 1], srgb: true }), normalMap: tex('twine_n.jpg', { repeat: [220, 1] }), roughness: 0.9, color: 0xf4efe6 });
    this.ropeMat = ropeMat;
    this.ropes = [];
    for (const dz of [-0.12, 0.12]) {
      const curve = new THREE.CatmullRomCurve3(Array.from({ length: 21 }, (_, i) => {
        const t = i / 20; const x = x0 + (x1 - x0) * t; const sag = 0.06 * (1 - Math.pow(2 * t - 1, 2));
        return new THREE.Vector3(x, 1.62 - sag, z + dz);
      }));
      const rope = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.0035, 6), ropeMat); rope.castShadow = true; this.scene.add(rope);
      this.ropes.push({ curve, dz });
    }
    // the front rope is the one we hang cloth on
    this.lineCurve = this.ropes[1].curve;
  }

  lineY(x) { const t = (x - this.line.x0) / (this.line.x1 - this.line.x0); return 1.62 - 0.06 * (1 - Math.pow(2 * t - 1, 2)); }

  update(t, wind) {
    this.sky.material.uniforms.uTime.value = t;
    for (const w of this.winds) { w.uTime.value = t; w.uWind.value = 0.6 + wind * 0.8; }
  }
}
