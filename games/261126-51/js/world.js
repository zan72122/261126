// Spring-morning garden, the weathered shed (all paintable surfaces) and lighting.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '../vendor/RoundedBoxGeometry.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';
import { tex, V3, rand, canvas, canvasTex, contactShadow, blobTex, lerp } from './util.js';
import { PaintAtlas, PPM } from './paint.js';

export const SUN_DIR = V3(-0.84, 0.48, 0.42).normalize();

export function makeRenderer(cv) {
  const r = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.0;
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFSoftShadowMap;
  return r;
}

// ---------------------------------------------------------------- sky + environment
const skyVS = `varying vec3 vD; void main(){ vD = normalize((modelMatrix*vec4(position,1.0)).xyz - cameraPosition*0.0); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const skyFS = `varying vec3 vD; uniform vec3 sunDir; uniform float sunK;
void main(){
  vec3 d = normalize(vD);
  float h = clamp(d.y, -1.0, 1.0);
  vec3 zen = vec3(0.16, 0.34, 0.78), hor = vec3(0.78, 0.84, 0.88), grd = vec3(0.16, 0.17, 0.1);
  vec3 c = mix(hor, zen, pow(max(h, 0.0), 0.55));
  c = mix(c, grd, smoothstep(0.0, -0.08, h));
  float s = max(dot(d, sunDir), 0.0);
  c += vec3(1.0, 0.85, 0.62) * (pow(s, 8.0) * 0.45 + pow(s, 64.0) * 0.8) ;
  c += vec3(1.0, 0.92, 0.8) * pow(s, 2000.0) * sunK;
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export class World {
  constructor(renderer) {
    this.r = renderer;
    const scene = this.scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xb8c6c4, 14, 40);
    this.paint = new PaintAtlas();
    this.clickables = [];
    this.timeU = { value: 0 };
    this.buildSky();
    this.buildLights();
    this.buildGround();
    this.buildShed();
    this.buildEnv(1);
  }

  buildSky() {
    this.skyU = { sunDir: { value: SUN_DIR.clone() }, sunK: { value: 0 } };
    const sky = new THREE.Mesh(new THREE.SphereGeometry(60, 32, 16), new THREE.ShaderMaterial({ vertexShader: skyVS, fragmentShader: skyFS, uniforms: this.skyU, side: THREE.BackSide, depthWrite: false, fog: false }));
    sky.renderOrder = -10;
    this.scene.add(sky); this.sky = sky;
    // out-of-focus garden backdrop (cylinder arc behind the shed)
    const bt = tex('backdrop.jpg', { srgb: true });
    bt.wrapS = THREE.ClampToEdgeWrapping; bt.wrapT = THREE.ClampToEdgeWrapping; bt.repeat.set(1, 1);
    const cg = new THREE.CylinderGeometry(18, 18, 9.5, 64, 1, true, Math.PI * 0.5 + 0.2, Math.PI * 2 - 0.4);
    const bd = new THREE.Mesh(cg, new THREE.MeshBasicMaterial({ map: bt, side: THREE.BackSide, fog: false, color: new THREE.Color(1.25, 1.25, 1.2), depthWrite: false }));
    bd.position.y = 3.25; bd.rotation.y = Math.PI; bd.renderOrder = -9;
    this.scene.add(bd); this.backdrop = bd;
  }

  buildEnv(k) {
    // HDR-ish environment from the same sky + backdrop + a bright sun, prefiltered (PMREM)
    const pm = new THREE.PMREMGenerator(this.r);
    const es = new THREE.Scene();
    const U = { sunDir: { value: this.skyU.sunDir.value.clone() }, sunK: { value: 0 } };
    es.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.ShaderMaterial({ vertexShader: skyVS, fragmentShader: skyFS.replace('#include <tonemapping_fragment>', '').replace('#include <colorspace_fragment>', ''), uniforms: U, side: THREE.BackSide })));
    const b = this.backdrop.clone(); b.material = this.backdrop.material.clone(); b.material.color.setScalar(0.85); es.add(b);
    const sun = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.88, 0.72).multiplyScalar(60 * k) }));
    sun.position.copy(this.skyU.sunDir.value).multiplyScalar(40); es.add(sun);
    const gnd = new THREE.Mesh(new THREE.CircleGeometry(40, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.12, 0.15, 0.07) }));
    gnd.rotation.x = -Math.PI / 2; gnd.position.y = -0.05; es.add(gnd);
    if (this.env) this.env.dispose();
    this.env = pm.fromScene(es, 0.0, 0.1, 100).texture;
    this.scene.environment = this.env;
    this.scene.environmentIntensity = 0.9;
    pm.dispose();
  }

  buildLights() {
    const sun = this.sun = new THREE.DirectionalLight(new THREE.Color(1.0, 0.89, 0.78), 2.7);
    sun.position.copy(SUN_DIR).multiplyScalar(12).add(V3(0, 0, 0.5));
    sun.target.position.set(0, 0.8, 0.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera; sc.left = -4.2; sc.right = 4.2; sc.top = 4.2; sc.bottom = -3.2; sc.near = 2; sc.far = 25;
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 4;
    this.scene.add(sun, sun.target);
  }

  setSun(elev, warm) { // time of day for the drying time-lapse
    const az = Math.atan2(SUN_DIR.x, SUN_DIR.z);
    const d = V3(Math.sin(az) * Math.cos(elev), Math.sin(elev), Math.cos(az) * Math.cos(elev)).normalize();
    this.skyU.sunDir.value.copy(d);
    this.sun.position.copy(d).multiplyScalar(12).add(V3(0, 0, 0.5));
    this.sun.color.setRGB(1.0, lerp(0.92, 0.84, warm), lerp(0.84, 0.7, warm));
  }

  // ---------------------------------------------------------------- ground, path, grass, flowers
  buildGround() {
    const R = 16;
    const gm = new THREE.MeshStandardMaterial({
      map: tex('ground_albedo.jpg', { srgb: true, repeat: [R, R] }), normalMap: tex('ground_normal.jpg', { repeat: [R, R] }),
      roughnessMap: tex('ground_orm.jpg', { repeat: [R, R] }), aoMap: tex('ground_orm.jpg', { repeat: [R, R] }), normalScale: new THREE.Vector2(1.2, 1.2),
    });
    const g = new THREE.Mesh(new THREE.PlaneGeometry(2 * R, 2 * R, 1, 1), gm);
    g.rotation.x = -Math.PI / 2; g.receiveShadow = true; this.scene.add(g); this.ground = g;
    // stepping stones toward the door
    const sm = new THREE.MeshStandardMaterial({ color: 0x9c968c, map: tex('concrete_detail.jpg', { srgb: true }), normalMap: tex('concrete_normal.jpg'), roughness: 0.92 });
    const stones = [[-0.55, 1.55], [-0.75, 2.2], [-0.45, 2.85], [-0.7, 3.5]];
    for (const [x, z] of stones) {
      const sg = new RoundedBoxGeometry(rand(0.42, 0.5), 0.06, rand(0.34, 0.4), 3, 0.03);
      const s = new THREE.Mesh(sg, sm); s.position.set(x, 0.012, z); s.rotation.y = rand(-0.3, 0.3); s.receiveShadow = s.castShadow = true;
      this.scene.add(s);
      const cs = contactShadow(0.62, 0.52, 0.35); cs.position.set(x, 0.003, z); this.scene.add(cs);
    }
    this.stones = stones;
    this.buildGrass();
  }

  buildGrass() {
    const blade = new THREE.PlaneGeometry(0.012, 1, 1, 4); blade.translate(0, 0.5, 0);
    const pa = blade.attributes.position;
    for (let i = 0; i < pa.count; i++) { const y = pa.getY(i); pa.setX(i, pa.getX(i) * (1 - y * 0.85)); pa.setZ(i, y * y * 0.18); }
    const nr = blade.attributes.normal; for (let i = 0; i < nr.count; i++) nr.setXYZ(i, 0, 1, 0.25);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, roughness: 0.7 });
    const U = this.timeU;
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.gTime = U;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float gTime;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
        { vec4 ip = instanceMatrix * vec4(0.0,0.0,0.0,1.0);
          float w = sin(gTime*1.7 + ip.x*1.3 + ip.z*0.9) * 0.5 + sin(gTime*3.1 + ip.x*4.0) * 0.2;
          transformed.x += w * position.y * position.y * 0.12; }`);
    };
    const N = 11000;
    const im = new THREE.InstancedMesh(blade, mat, N);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), c = new THREE.Color();
    let n = 0;
    while (n < N) {
      const x = rand(-6, 6), z = rand(-2.5, 7.5);
      if (Math.abs(x) < 1.36 && Math.abs(z) < 1.08) continue;
      if (this.stones.some(([sx, sz]) => Math.hypot(x - sx, (z - sz) * 1.2) < 0.25)) continue;
      // denser near the shed base and near the camera
      if (Math.random() > 0.35 + 0.65 * Math.exp(-Math.max(0, Math.hypot(x, z - 1.5) - 1.5) * 0.35)) continue;
      const h = rand(0.05, 0.14) * (Math.abs(x) < 1.6 && Math.abs(z) < 1.3 ? 1.5 : 1);
      q.setFromEuler(new THREE.Euler(rand(-0.25, 0.25), rand(0, Math.PI * 2), rand(-0.25, 0.25)));
      m.compose(V3(x, 0, z), q, V3(rand(0.8, 1.6), h, 1));
      im.setMatrixAt(n, m);
      c.setHSL(rand(0.2, 0.27), rand(0.45, 0.7), rand(0.12, 0.3));
      im.setColorAt(n, c);
      n++;
    }
    im.receiveShadow = true; im.castShadow = false;
    this.scene.add(im);
    // a scatter of small white spring flowers + dandelions
    const fg = new THREE.CircleGeometry(0.011, 8); fg.rotateX(-Math.PI / 2);
    const fm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, side: THREE.DoubleSide });
    const fi = new THREE.InstancedMesh(fg, fm, 160);
    for (let i = 0; i < 160; i++) {
      let x, z; do { x = rand(-5, 5); z = rand(-2, 6); } while (Math.abs(x) < 1.4 && Math.abs(z) < 1.1);
      m.compose(V3(x, rand(0.05, 0.09), z), q.setFromEuler(new THREE.Euler(rand(-0.3, 0.3), 0, rand(-0.3, 0.3))), V3(1, 1, 1));
      fi.setMatrixAt(i, m); fi.setColorAt(i, c.set(i % 3 ? 0xf4f1e8 : 0xe9c23a));
    }
    this.scene.add(fi);
  }

  // ---------------------------------------------------------------- the shed
  buildShed() {
    const P = this.paint, S = this.shed = new THREE.Group(); this.scene.add(S);
    const W = 2.6, D = 2.0, Y0 = 0.14, EAVE = 2.15, PITCH = Math.tan(38 * Math.PI / 180), RIDGE = EAVE + D / 2 * PITCH, OVH = 0.25;
    this.dims = { W, D, Y0, EAVE, RIDGE };
    const roofY = (z) => EAVE + (D / 2 - Math.abs(z)) * PITCH;
    const woodRep = (o = {}) => ({
      map: tex('wood_albedo.jpg', { srgb: true }), normalMap: tex('wood_normal.jpg'), orm: tex('wood_orm.jpg'), ns: 1.6, ...o,
    });
    // ---- shelf-pack the paint atlas
    let sx = 0, sy = 0, shelfH = 0;
    const place = (w, h) => {
      const pw = Math.ceil(w * PPM) + 6, ph = Math.ceil(h * PPM) + 6;
      if (sx + pw > 1024) { sx = 0; sy += shelfH; shelfH = 0; }
      const r = [sx + 3, sy + 3]; sx += pw; shelfH = Math.max(shelfH, ph); return r;
    };
    const surf = (name, origin, u, v, w, h, valid) => { const [px, py] = place(w, h); return P.addSurface(name, { origin, u, v, w, h, px, py, valid }); };
    const DOOR = { x0: -1.0, x1: -0.2, y0: Y0, y1: 2.02 }, WIN = { x0: 0.3, x1: 1.0, y0: 0.95, y1: 1.65 };
    this.DOOR = DOOR; this.WIN = WIN;
    const sFront = surf('front', V3(-1.31, 0.12, 1.0), V3(1, 0, 0), V3(0, 1, 0), 2.62, 2.05,
      (u, v) => { const x = u - 1.31, y = v + 0.12; return !((x > DOOR.x0 - 0.08 && x < DOOR.x1 + 0.08 && y < DOOR.y1 + 0.08) || (x > WIN.x0 - 0.08 && x < WIN.x1 + 0.08 && y > WIN.y0 - 0.1 && y < WIN.y1 + 0.08)); });
    const sSide = surf('side', V3(1.3, 0.12, 1.01), V3(0, 0, -1), V3(0, 1, 0), 2.02, RIDGE - 0.12 + 0.02,
      (u, v) => { const z = 1.01 - u, y = v + 0.12; return y < roofY(z) - 0.12; });
    const sRoof = surf('roof', V3(-1.5, EAVE - OVH * PITCH, D / 2 + OVH), V3(1, 0, 0), V3(0, PITCH, -1).normalize(), 3.0, Math.hypot(1, PITCH) * (D / 2 + OVH) + 0.02);
    const sDoor = surf('door', V3(DOOR.x0 - 0.02, DOOR.y0, 1.06), V3(1, 0, 0), V3(0, 1, 0), DOOR.x1 - DOOR.x0 + 0.04, DOOR.y1 - DOOR.y0 + 0.02);
    const sTrim = surf('trim', V3(-1.42, 0.1, 1.06), V3(1, 0, 0), V3(0, 1, 0), 2.84, 2.1,
      (u, v) => { const x = u - 1.42, y = v + 0.1;
        const nearDoor = x > DOOR.x0 - 0.1 && x < DOOR.x1 + 0.1 && y < DOOR.y1 + 0.1 && !(x > DOOR.x0 + 0.01 && x < DOOR.x1 - 0.01 && y < DOOR.y1 - 0.01);
        const nearWin = x > WIN.x0 - 0.1 && x < WIN.x1 + 0.1 && y > WIN.y0 - 0.14 && y < WIN.y1 + 0.1 && !(x > WIN.x0 + 0.01 && x < WIN.x1 - 0.01 && y > WIN.y0 + 0.01 && y < WIN.y1 - 0.01);
        return nearDoor || nearWin; });
    const sFascia = surf('fascia', V3(-1.52, 1.75, 1.3), V3(1, 0, 0), V3(0, 1, 0), 3.04, 0.32);
    const sBarge = surf('barge', V3(1.52, 1.75, 1.3), V3(0, 0, -1), V3(0, 1, 0), 2.6, 1.3, (u, v) => { const z = 1.3 - u, y = v + 1.75; return Math.abs(y - (roofY(z) + 0.02)) < 0.12 && Math.abs(z) < 1.25; });
    this.surfs = { front: sFront, side: sSide, roof: sRoof, door: sDoor, trim: sTrim, fascia: sFascia, barge: sBarge };
    this.paintMeshes = [];
    const addPaintMesh = (geos, s, opts) => {
      const g = mergeGeometries(geos, false);
      const m = new THREE.Mesh(g, P.material(s, woodRep(opts)));
      m.castShadow = m.receiveShadow = true; m.userData.surf = s; S.add(m); this.paintMeshes.push(m);
      return m;
    };
    // wood UV: planar along a board, scaled to the 0.28 x 1.1 m texture, random offset per board
    const board = (w, h, t, cx, cy, cz, axis = 'z', grainV = true, yTop = null) => {
      const g = new RoundedBoxGeometry(w, h, t, 2, Math.min(0.006, t * 0.3));
      const pa = g.attributes.position, uv = g.attributes.uv;
      const ou = rand(0, 1), ov = rand(0, 1), flip = Math.random() < 0.5;
      for (let i = 0; i < pa.count; i++) {
        const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
        let u = grainV ? x / 0.28 : y / 0.28, v = grainV ? y / 1.1 : x / 1.1;
        if (Math.abs(z) < t * 0.45) { u += z / 0.28; }
        uv.setXY(i, (flip ? -u : u) + ou, v + ov);
      }
      if (yTop) { // slant top to follow the roof (gable boards)
        for (let i = 0; i < pa.count; i++) { if (pa.getY(i) > 0) { const lz = pa.getX(i); pa.setY(i, pa.getY(i) + yTop(lz)); } }
        g.computeVertexNormals();
      }
      if (axis === 'x') g.rotateY(Math.PI / 2);
      g.translate(cx, cy, cz);
      return g;
    };
    // ---- frame / inner sheathing (dark gap backing so gaps between boards read as depth)
    const darkM = new THREE.MeshStandardMaterial({ color: 0x1c1915, roughness: 1 });
    const core = new THREE.Mesh(new THREE.BoxGeometry(W - 0.04, EAVE - Y0, D - 0.7), darkM); core.position.set(0, (EAVE + Y0) / 2, -0.33); S.add(core);
    core.castShadow = true;
    { // dark backing behind the front boards, with the window opening cut out
      const sh = new THREE.Shape(); sh.moveTo(-W / 2 + 0.02, Y0); sh.lineTo(W / 2 - 0.02, Y0); sh.lineTo(W / 2 - 0.02, EAVE); sh.lineTo(-W / 2 + 0.02, EAVE); sh.closePath();
      const hole = new THREE.Path(); hole.moveTo(WIN.x0, WIN.y0); hole.lineTo(WIN.x0, WIN.y1); hole.lineTo(WIN.x1, WIN.y1); hole.lineTo(WIN.x1, WIN.y0); hole.closePath(); sh.holes.push(hole);
      const bk = new THREE.Mesh(new THREE.ShapeGeometry(sh), darkM); bk.position.z = 0.972; bk.castShadow = true; S.add(bk);
      for (const sx of [-1, 1]) { const sd = new THREE.Mesh(new THREE.PlaneGeometry(D - 0.04, EAVE - Y0), darkM); sd.rotation.y = sx * Math.PI / 2; sd.position.set(sx * (W / 2 - 0.025), (EAVE + Y0) / 2, 0); S.add(sd); }
    }
    const gable = new THREE.Shape(); gable.moveTo(-D / 2 + 0.02, 0); gable.lineTo(D / 2 - 0.02, 0); gable.lineTo(0, RIDGE - EAVE - 0.03); gable.closePath();
    const gg = new THREE.ExtrudeGeometry(gable, { depth: W - 0.04, bevelEnabled: false }); gg.rotateY(Math.PI / 2); gg.translate(-(W - 0.04) / 2, EAVE, 0);
    S.add(new THREE.Mesh(gg, darkM));
    // ---- front wall boards + battens (window opening split)
    const fg = [];
    const bw = 0.2, nb = Math.round(W / bw);
    for (let i = 0; i < nb; i++) {
      const x0 = -W / 2 + i * bw, x1 = x0 + bw - 0.006, cx = (x0 + x1) / 2;
      const segs = [];
      if (x1 > WIN.x0 && x0 < WIN.x1) { segs.push([Y0, WIN.y0]); segs.push([WIN.y1, EAVE]); } else segs.push([Y0, EAVE]);
      for (const [a, b] of segs) fg.push(board(x1 - x0, b - a, 0.022, cx, (a + b) / 2, 1.0 - 0.011));
      if (i > 0) { // batten over the joint
        const bx = x0 - 0.003;
        const bs = (bx > WIN.x0 - 0.04 && bx < WIN.x1 + 0.04) ? [[Y0, WIN.y0 - 0.06], [WIN.y1 + 0.06, EAVE]] : [[Y0, EAVE]];
        for (const [a, b] of bs) if (!(bx > DOOR.x0 - 0.05 && bx < DOOR.x1 + 0.05)) fg.push(board(0.05, b - a, 0.018, bx, (a + b) / 2, 1.0 + 0.009));
      }
    }
    // corner boards
    fg.push(board(0.09, EAVE - Y0 + 0.02, 0.025, W / 2 - 0.045 + 0.02, (EAVE + Y0) / 2, 1.0 + 0.014));
    fg.push(board(0.09, EAVE - Y0 + 0.02, 0.025, -W / 2 + 0.045 - 0.02, (EAVE + Y0) / 2, 1.0 + 0.014));
    addPaintMesh(fg, sFront);
    // ---- right gable wall boards (facing +x)
    const sg = [];
    const nbs = Math.round(D / bw);
    for (let i = 0; i < nbs; i++) {
      const z0 = D / 2 - i * bw, z1 = z0 - bw + 0.006, cz = (z0 + z1) / 2;
      const top0 = Math.min(roofY(z0), roofY(z1)) - 0.02;
      const g = board(bw - 0.006, top0 - Y0, 0.022, 0, 0, 0, 'z', true, (lx) => 0);
      // slant: rebuild with top following the roof line
      const pa = g.attributes.position;
      for (let k = 0; k < pa.count; k++) { const y = pa.getY(k); if (y > 0) { const z = cz - pa.getX(k); pa.setY(k, y + (roofY(z) - 0.02 - top0)); } }
      g.computeVertexNormals();
      g.rotateY(Math.PI / 2); g.translate(W / 2 - 0.011, (top0 + Y0) / 2 + 0, cz);
      sg.push(g);
      if (i > 0) {
        const bt = roofY(z0) - 0.05;
        sg.push(board(0.05, bt - Y0, 0.018, 0, 0, 0, 'z'));
        sg[sg.length - 1].rotateY(Math.PI / 2); sg[sg.length - 1].translate(W / 2 + 0.009, (bt + Y0) / 2, z0 + 0.003);
      }
    }
    const cb = board(0.09, EAVE - Y0 + 0.02, 0.025, 0, 0, 0); cb.rotateY(Math.PI / 2); cb.translate(W / 2 + 0.014, (EAVE + Y0) / 2, D / 2 - 0.045 + 0.02); sg.push(cb);
    addPaintMesh(sg, sSide);
    // left wall + back (plain, not in view much)
    const lg = [];
    for (let i = 0; i < nbs; i++) { const z = D / 2 - (i + 0.5) * bw; const g = board(bw - 0.006, EAVE - Y0, 0.022, 0, 0, 0); g.rotateY(Math.PI / 2); g.translate(-W / 2 + 0.011, (EAVE + Y0) / 2, z); lg.push(g); }
    const wm = new THREE.MeshStandardMaterial({ map: tex('wood_albedo.jpg', { srgb: true }), normalMap: tex('wood_normal.jpg'), roughnessMap: tex('wood_orm.jpg'), aoMap: tex('wood_orm.jpg'), normalScale: new THREE.Vector2(1.6, 1.6) });
    const lw = new THREE.Mesh(mergeGeometries(lg), wm); lw.castShadow = lw.receiveShadow = true; S.add(lw);
    this.plainWood = wm;
    // ---- door (ledge & brace) with hinges and latch
    const dg = [];
    const dw = DOOR.x1 - DOOR.x0, dh = DOOR.y1 - DOOR.y0, dz = 1.022;
    for (let i = 0; i < 5; i++) { const w = dw / 5; dg.push(board(w - 0.005, dh, 0.022, DOOR.x0 + w * (i + 0.5), DOOR.y0 + dh / 2, dz + 0.011)); }
    const rail = (y) => board(dw - 0.04, 0.12, 0.022, 0, 0, 0, 'z', false);
    for (const y of [0.25, dh - 0.22]) { const g = rail(); g.translate((DOOR.x0 + DOOR.x1) / 2, DOOR.y0 + y, dz + 0.033); dg.push(g); }
    { const L = Math.hypot(dw - 0.14, dh - 0.6); const g = board(L, 0.11, 0.022, 0, 0, 0, 'z', false); g.rotateZ(Math.atan2(dh - 0.6, dw - 0.14)); g.translate((DOOR.x0 + DOOR.x1) / 2, DOOR.y0 + dh / 2, dz + 0.032); dg.push(g); }
    this.doorMesh = addPaintMesh(dg, sDoor);
    const iron = new THREE.MeshStandardMaterial({ color: 0x2a2724, metalness: 0.85, roughness: 0.55, map: tex('metal_detail.jpg', { srgb: true }), roughnessMap: tex('metal_detail.jpg'), normalMap: tex('metal_normal.jpg') });
    for (const y of [0.25, dh - 0.22]) {
      const h = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.04, 0.008, 2, 0.003), iron); h.position.set(DOOR.x0 + 0.17, DOOR.y0 + y, dz + 0.05); h.castShadow = true; S.add(h);
      for (let k = 0; k < 3; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), iron); b.position.set(DOOR.x0 + 0.05 + k * 0.14, DOOR.y0 + y, dz + 0.055); S.add(b); }
    }
    const latch = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.006, 8, 20), iron); latch.position.set(DOOR.x1 - 0.1, DOOR.y0 + 1.0, dz + 0.05); S.add(latch);
    // ---- trims: door casing, window casing + sill
    const tg = [];
    const tw = 0.075, tz = 1.0 + 0.032;
    tg.push(board(tw, dh + 0.06, 0.022, DOOR.x0 - tw / 2 - 0.01, DOOR.y0 + dh / 2 + 0.02, tz));
    tg.push(board(tw, dh + 0.06, 0.022, DOOR.x1 + tw / 2 + 0.01, DOOR.y0 + dh / 2 + 0.02, tz));
    tg.push(board(dw + 2 * tw + 0.06, tw, 0.022, (DOOR.x0 + DOOR.x1) / 2, DOOR.y1 + tw / 2 + 0.01, tz, 'z', false));
    const ww = WIN.x1 - WIN.x0, wh = WIN.y1 - WIN.y0;
    tg.push(board(tw, wh + 2 * tw, 0.022, WIN.x0 - tw / 2, (WIN.y0 + WIN.y1) / 2, tz));
    tg.push(board(tw, wh + 2 * tw, 0.022, WIN.x1 + tw / 2, (WIN.y0 + WIN.y1) / 2, tz));
    tg.push(board(ww + 2 * tw, tw, 0.022, (WIN.x0 + WIN.x1) / 2, WIN.y1 + tw / 2, tz, 'z', false));
    const sill = board(ww + 2 * tw + 0.08, 0.035, 0.075, (WIN.x0 + WIN.x1) / 2, WIN.y0 - 0.02, 1.0 + 0.04, 'z', false); tg.push(sill);
    // muntins
    tg.push(board(0.035, wh, 0.03, (WIN.x0 + WIN.x1) / 2, (WIN.y0 + WIN.y1) / 2, 0.985));
    tg.push(board(ww, 0.035, 0.03, (WIN.x0 + WIN.x1) / 2, (WIN.y0 + WIN.y1) / 2, 0.985, 'z', false));
    this.trimMesh = addPaintMesh(tg, sTrim);
    this.sillTop = V3((WIN.x0 + WIN.x1) / 2, WIN.y0 + 0.0, 1.06);
    // window glass + dim interior
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), new THREE.MeshPhysicalMaterial({ color: 0x9aa6ae, roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.5, envMapIntensity: 2.2, clearcoat: 1, clearcoatRoughness: 0.05 }));
    glass.position.set((WIN.x0 + WIN.x1) / 2, (WIN.y0 + WIN.y1) / 2, 0.975); S.add(glass);
    const inner = new THREE.Mesh(new THREE.BoxGeometry(ww + 0.02, wh + 0.02, 0.6), new THREE.MeshStandardMaterial({ color: 0x8a7a66, roughness: 1, side: THREE.BackSide, map: tex('wood_albedo.jpg', { srgb: true }), emissive: 0x2a241c }));
    inner.position.set((WIN.x0 + WIN.x1) / 2, (WIN.y0 + WIN.y1) / 2, 0.68); S.add(inner);
    const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 16), new THREE.MeshStandardMaterial({ color: 0x6b5a3a, roughness: 0.6 }));
    jar.position.set(WIN.x0 + 0.18, WIN.y0 + 0.07, 0.7); S.add(jar);
    // ---- roof: stepped shingle courses on both slopes, ridge cap, fascia & barge boards
    const rm = { map: tex('roof_albedo.jpg', { srgb: true }), normalMap: tex('roof_normal.jpg'), orm: tex('roof_orm.jpg'), ns: 1.3 };
    const slopeL = Math.hypot(1, PITCH) * (D / 2 + OVH);
    const ang = Math.atan(PITCH);
    const course = (back) => {
      const gs = [];
      const n = 8, exp = slopeL / n;
      for (let i = 0; i < n; i++) {
        const g = new RoundedBoxGeometry(3.0, exp + 0.06, 0.016, 1, 0.004);
        const pa = g.attributes.position, uv = g.attributes.uv;
        const off = rand(0, 1);
        for (let k = 0; k < pa.count; k++) uv.setXY(k, pa.getX(k) / 1.0 + off, (pa.getY(k) + i * exp) / 1.0);
        g.rotateX(0.025); // butt edge lifts slightly
        g.translate(0, i * exp + exp / 2, 0.012 + 0.0);
        gs.push(g);
      }
      const g = mergeGeometries(gs);
      g.rotateX(-(Math.PI / 2 - ang));
      if (back) g.rotateY(Math.PI);
      g.translate(0, EAVE - OVH * PITCH, back ? -(D / 2 + OVH) : D / 2 + OVH);
      return g;
    };
    const roofF = new THREE.Mesh(course(false), P.material(sRoof, rm)); roofF.castShadow = roofF.receiveShadow = true; roofF.userData.surf = sRoof; S.add(roofF); this.paintMeshes.push(roofF);
    const roofB = new THREE.Mesh(course(true), new THREE.MeshStandardMaterial({ map: rm.map, normalMap: rm.normalMap, roughnessMap: rm.orm, aoMap: rm.orm })); roofB.castShadow = true; S.add(roofB);
    // roof deck underside (visible from eye level under the eaves)
    const deck = new THREE.Mesh(new THREE.PlaneGeometry(3.0, slopeL), wm); deck.rotation.x = Math.PI / 2 + ang; deck.position.set(0, (EAVE - OVH * PITCH + RIDGE) / 2 - 0.01, (D / 2 + OVH) / 2); deck.material = wm.clone(); deck.material.side = THREE.DoubleSide; deck.material.color.setScalar(0.6); S.add(deck);
    const ridgeCap = new THREE.Mesh(new RoundedBoxGeometry(3.06, 0.05, 0.16, 2, 0.01), wm); ridgeCap.position.set(0, RIDGE + 0.04, 0); ridgeCap.castShadow = true; S.add(ridgeCap);
    // fascia (front eave)
    const fz = D / 2 + OVH + 0.01;
    const fa = board(3.04, 0.16, 0.024, 0, EAVE - OVH * PITCH - 0.06, fz, 'z', false);
    this.fasciaMesh = addPaintMesh([fa], sFascia);
    // barge boards (right gable)
    const bg = [];
    for (const s of [1, -1]) {
      const L = Math.hypot(D / 2 + OVH, (D / 2 + OVH) * PITCH);
      const g = board(L, 0.16, 0.024, 0, 0, 0, 'z', false);
      g.rotateZ(s * ang); g.rotateY(Math.PI / 2);
      g.translate(1.51, (EAVE - OVH * PITCH + RIDGE) / 2 - 0.05, s * (D / 2 + OVH) / 2);
      bg.push(g);
    }
    this.bargeMesh = addPaintMesh(bg, sBarge);
    // ---- foundation blocks + base shadow (contact AO)
    const cm = new THREE.MeshStandardMaterial({ color: 0x8b877f, map: tex('concrete_detail.jpg', { srgb: true }), normalMap: tex('concrete_normal.jpg'), roughness: 0.95 });
    for (const [x, z] of [[-1.2, 0.9], [1.2, 0.9], [-1.2, -0.9], [1.2, -0.9], [0, 0.9], [0, -0.9]]) {
      const b = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.16, 0.2, 2, 0.01), cm); b.position.set(x, 0.06, z); b.castShadow = b.receiveShadow = true; S.add(b);
    }
    const base = new THREE.Mesh(new THREE.BoxGeometry(W - 0.02, 0.06, D - 0.02), new THREE.MeshStandardMaterial({ color: 0x15130f, roughness: 1 }));
    base.position.y = 0.1; S.add(base);
    const ao = contactShadow(W + 0.9, D + 0.9, 0.75); ao.position.set(0, 0.006, 0); S.add(ao);
    S.traverse(o => { if (o.isMesh && o.castShadow === false && o !== ao && o !== glass) o.receiveShadow = true; });
  }

  update(dt) { this.timeU.value += dt; this.paint.update(dt); }
}
