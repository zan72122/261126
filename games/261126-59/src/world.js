// The rainy-day attic: floor, gable wall with a rain-streaked window, sloped roof with rafters,
// a clamp work lamp, clutter, the old trunk, the picture sign and the environment map.
import * as THREE from 'three';
import { tex, pbr, canvas, canvasTex, aoBlob } from './tex.js';
import { roundBox, pill, latheProfile } from './geo.js';

export const ROOM = { W: 5.4, D: 5.0, knee: 0.62, ridge: 2.65, back: -2.1, front: 2.9, winW: 0.9, winH: 1.0, winY: 0.64 };

function kelvin(k) { // approx blackbody colour (linear)
  const t = k / 100; let r, g, b;
  r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  const c = new THREE.Color(Math.min(255, r) / 255, Math.min(255, g) / 255, Math.min(255, b) / 255);
  return c.convertSRGBToLinear();
}
export { kelvin };

export function buildWorld(scene, Q) {
  const W = {};
  const { W: RW, knee, ridge, back, front } = ROOM;
  const hx = RW / 2;

  // ---------- floor
  const floorMat = pbr('floor', { arm: true, repeat: [RW / 0.95, (front - back) / 0.95], ns: 1.2 });
  floorMat.color.set(0xd8cfc4);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(RW, front - back), floorMat);
  floor.geometry.setAttribute('uv1', floor.geometry.attributes.uv);
  floor.rotation.x = -Math.PI / 2; floor.position.z = (front + back) / 2;
  floor.receiveShadow = true; scene.add(floor); W.floor = floor;

  // ---------- gable wall with window hole
  const boardMatV = pbr('board', { arm: true, repeat: [1 / 0.7, 1 / 0.7], ns: 1.2 });
  boardMatV.map.rotation = 0;
  const sh = new THREE.Shape();
  sh.moveTo(-hx, 0); sh.lineTo(hx, 0); sh.lineTo(hx, knee); sh.lineTo(0, ridge); sh.lineTo(-hx, knee); sh.lineTo(-hx, 0);
  const { winW, winH, winY } = ROOM;
  const hole = new THREE.Path();
  hole.moveTo(-winW / 2, winY); hole.lineTo(-winW / 2, winY + winH); hole.lineTo(winW / 2, winY + winH); hole.lineTo(winW / 2, winY); hole.lineTo(-winW / 2, winY);
  sh.holes.push(hole);
  const wallG = new THREE.ShapeGeometry(sh, 4);
  // UVs from xy (metres), boards run vertically: swap
  const uv = wallG.attributes.uv; for (let i = 0; i < uv.count; i++) { const x = uv.getX(i), y = uv.getY(i); uv.setXY(i, y, x); }
  wallG.setAttribute('uv1', uv);
  const wallMat = pbr('board', { arm: true, repeat: [1 / 0.75, 1 / 0.75], ns: 1.3 }); wallMat.color.set(0xcfc2b4);
  const wall = new THREE.Mesh(wallG, wallMat); wall.position.z = back; wall.receiveShadow = true; wall.castShadow = true; scene.add(wall);
  // thickness of the window reveal
  const revealMat = pbr('timber', { arm: true, repeat: [1, 0.4] }); revealMat.color.set(0xc9b49c);
  const rd = 0.16;
  const mkRev = (w, h, x, y, rx) => { const m = new THREE.Mesh(roundBox(w, h, rd, 0.004, 30), revealMat); m.position.set(x, y, back - rd / 2 + 0.005); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m; };
  mkRev(winW + 0.16, 0.08, 0, winY - 0.04); mkRev(winW + 0.16, 0.08, 0, winY + winH + 0.04);
  mkRev(0.08, winH, -winW / 2 - 0.04, winY + winH / 2); mkRev(0.08, winH, winW / 2 + 0.04, winY + winH / 2);
  // sill
  const sill = new THREE.Mesh(roundBox(winW + 0.3, 0.035, 0.2, 0.008, 40), revealMat); sill.position.set(0, winY - 0.02, back + 0.06); sill.castShadow = sill.receiveShadow = true; scene.add(sill);
  W.sill = sill;
  // window frame + muntins (painted, worn)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xd9d2c4, roughness: 0.55, normalMap: tex('plaster_nrm', { repeat: [2, 2] }), normalScale: new THREE.Vector2(0.6, 0.6) });
  const fr = (w, h, x, y) => { const m = new THREE.Mesh(roundBox(w, h, 0.045, 0.008, 60), frameMat); m.position.set(x, y, back - 0.06); m.castShadow = true; m.receiveShadow = true; scene.add(m); };
  fr(winW, 0.05, 0, winY + 0.025); fr(winW, 0.05, 0, winY + winH - 0.025); fr(0.05, winH, -winW / 2 + 0.025, winY + winH / 2); fr(0.05, winH, winW / 2 - 0.025, winY + winH / 2);
  fr(0.03, winH - 0.1, 0, winY + winH / 2); fr(winW - 0.1, 0.03, 0, winY + winH / 2);

  // glass: outdoor view refracted through drops; fog layer is paintable (wiping)
  const fogC = canvas(256, 256); const fg = fogC.getContext('2d'); fg.fillStyle = '#000'; fg.fillRect(0, 0, 256, 256);
  const fogT = canvasTex(fogC, false);
  W.fog = { canvas: fogC, ctx: fg, tex: fogT };
  const glassMat = new THREE.ShaderMaterial({
    uniforms: {
      tOut: { value: tex('outdoor', { srgb: true }) }, tDrop: { value: tex('drops_nrm', { repeat: [1, 1] }) }, tDropM: { value: tex('drops_msk') },
      tFog: { value: fogT }, uTime: { value: 0 }, uRain: { value: 1 }, uBright: { value: 2.4 }, uSun: { value: 0 }, uRainbow: { value: 0 }, uFogAmt: { value: 0 },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform sampler2D tOut, tDrop, tDropM, tFog; uniform float uTime, uRain, uBright, uSun, uRainbow, uFogAmt; varying vec2 vUv;
      vec3 rainbow(float t){ return clamp(vec3(abs(t*6.0-3.0)-1.0, 2.0-abs(t*6.0-2.0), 2.0-abs(t*6.0-4.0)),0.0,1.0); }
      void main(){
        vec2 uv = vUv;
        vec2 d1 = (texture2D(tDrop, uv*vec2(1.6,1.6)).xy-0.5);
        vec2 d2 = (texture2D(tDrop, uv*vec2(1.1,0.9)+vec2(0.37, uTime*0.045)).xy-0.5);
        float m1 = texture2D(tDropM, uv*vec2(1.6,1.6)).r, m2 = texture2D(tDropM, uv*vec2(1.1,0.9)+vec2(0.37, uTime*0.045)).r;
        vec2 off = (d1*m1 + d2*m2*0.8)*0.09*uRain;
        vec2 ouv = vec2(0.5 + (uv.x-0.5)*0.42, 0.3 + uv.y*0.62);
        vec3 o = texture2D(tOut, ouv + off*0.6).rgb;
        // sun breaking through + rainbow arc after the rain
        o = mix(o, o*vec3(1.25,1.18,1.0)+vec3(0.08,0.07,0.03), uSun);
        vec2 rc = vec2(ouv.x-0.62, ouv.y-0.25)*vec2(1.0,1.6); float rr = length(rc);
        float band = smoothstep(0.0,0.05,rr-0.36)*smoothstep(0.0,0.05,0.48-rr);
        o += rainbow(clamp((rr-0.36)/0.12,0.0,1.0))*band*0.45*uRainbow*smoothstep(0.0,0.1,rc.y+0.05);
        // drops catch light: brighter rims, darker cores
        float dm = clamp(m1 + m2*0.8, 0.0, 1.0)*uRain;
        o *= 1.0 - dm*0.18; o += dm*length(off)*3.0;
        float fog = texture2D(tFog, uv).r; fog = (1.0 - fog)*uFogAmt;
        vec3 fogC = vec3(0.62,0.64,0.66) + o*0.25;
        o = mix(o, fogC, fog*0.92);
        gl_FragColor = vec4(o*uBright, 1.0);
      }`,
  });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(winW - 0.02, winH - 0.02), glassMat);
  glass.position.set(0, winY + winH / 2, back - 0.07); scene.add(glass);
  W.glass = glass; W.glassMat = glassMat;

  // ---------- knee walls
  const kneeMat = pbr('board', { arm: true, repeat: [(front - back) / 0.75, knee / 0.75] }); kneeMat.color.set(0xbfae9a);
  for (const s of [-1, 1]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(front - back, knee), kneeMat);
    m.geometry.setAttribute('uv1', m.geometry.attributes.uv);
    m.position.set(s * hx, knee / 2, (front + back) / 2); m.rotation.y = -s * Math.PI / 2; m.receiveShadow = true; scene.add(m);
  }
  // ---------- roof slopes (boards) + rafters
  const slopeLen = Math.hypot(hx, ridge - knee), slopeAng = Math.atan2(ridge - knee, hx);
  const roofMat = pbr('board', { arm: true, repeat: [slopeLen / 0.75, slopeLen / 0.75], ns: 1.2 }); roofMat.color.set(0xb6a38e);
  const rafterMat = pbr('timber', { arm: true, repeat: [3, 0.35], ns: 1.4 }); rafterMat.color.set(0xd2bea6);
  const depth = front - back, zc = (front + back) / 2;
  for (const s of [-1, 1]) {
    const X = new THREE.Vector3(-s * hx, ridge - knee, 0).normalize(), Y = new THREE.Vector3(0, 0, -s), Z = new THREE.Vector3().crossVectors(X, Y);
    const g = new THREE.Group(); g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z));
    g.position.set(s * hx / 2, (knee + ridge) / 2, zc); scene.add(g);
    const pg = new THREE.PlaneGeometry(slopeLen, depth);
    const u = pg.attributes.uv; for (let i = 0; i < u.count; i++) { const x = u.getX(i), y = u.getY(i); u.setXY(i, y * depth / slopeLen, x); }
    pg.setAttribute('uv1', u);
    const m = new THREE.Mesh(pg, roofMat); m.receiveShadow = true; m.castShadow = true; g.add(m);
    for (let z = back + 0.3; z < front; z += 0.6) {
      const rf = new THREE.Mesh(roundBox(slopeLen, 0.07, 0.14, 0.008, 18), rafterMat);
      rf.position.set(0, -s * (z - zc), 0.07); rf.castShadow = true; rf.receiveShadow = true; g.add(rf);
    }
  }
  // collar beams + ridge beam
  const beamMat = rafterMat;
  for (let z = back + 0.9; z < front; z += 1.8) {
    const cb = new THREE.Mesh(roundBox(2.2, 0.13, 0.06, 0.008, 18), beamMat); cb.position.set(0, 2.02, z); cb.castShadow = cb.receiveShadow = true; scene.add(cb);
  }
  const rb = new THREE.Mesh(roundBox(0.12, 0.16, front - back, 0.01, 12), beamMat); rb.position.set(0, ridge - 0.1, (front + back) / 2); rb.receiveShadow = true; scene.add(rb);
  // vertical post
  const post = new THREE.Mesh(roundBox(0.1, 2.0, 0.1, 0.01, 18), beamMat); post.position.set(1.35, 1.0, -1.2); post.castShadow = post.receiveShadow = true; scene.add(post);
  { const a = aoBlob(0.4, 0.4, 0.6); a.position.set(1.35, 0.002, -1.2); scene.add(a); }

  // ---------- clamp work lamp hung from the collar beam
  const lamp = new THREE.Group(); lamp.position.set(0.32, 1.5, 0.18); scene.add(lamp);
  const shadeMat = new THREE.MeshPhysicalMaterial({ color: 0x5b6248, metalness: 0.6, roughness: 0.38, clearcoat: 0.3, side: THREE.DoubleSide, normalMap: tex('rust_msk'), normalScale: new THREE.Vector2(0.05, 0.05) });
  const shade = new THREE.Mesh(latheProfile(0.16, (t) => 0.035 + 0.09 * t * t, 24, 40), shadeMat);
  shade.rotation.x = Math.PI; shade.position.y = 0.12; shade.castShadow = true; lamp.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.03, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.78, 0.5).multiplyScalar(14) }));
  bulb.position.y = -0.01; lamp.add(bulb);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 }));
  cord.position.y = 0.37; lamp.add(cord);
  // lamp lights
  const spot = new THREE.SpotLight(kelvin(2900), 16, 0, 0.62, 0.75, 2);
  spot.position.set(0.32, 1.48, 0.18); spot.target.position.set(-0.05, 0.1, 0.05);
  spot.castShadow = true; spot.shadow.mapSize.set(Q.shadow, Q.shadow); spot.shadow.radius = 6; spot.shadow.bias = -0.0004; spot.shadow.normalBias = 0.02;
  spot.shadow.camera.near = 0.2; spot.shadow.camera.far = 6;
  scene.add(spot, spot.target); W.spot = spot;
  const fill = new THREE.PointLight(kelvin(3000), 0.9, 0, 2); fill.position.set(0.32, 1.62, 0.18); scene.add(fill); // light spilling up from the shade
  W.lamp = lamp;
  // window daylight (cool, overcast)
  const sun = new THREE.DirectionalLight(kelvin(7200), 2.2);
  sun.position.set(0.35, 2.4, -4.2); sun.target.position.set(0, 0, 0.4);
  sun.castShadow = true; sun.shadow.mapSize.set(Q.shadow, Q.shadow); sun.shadow.radius = 10; sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.03;
  Object.assign(sun.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 0.5, far: 9 });
  scene.add(sun, sun.target); W.sun = sun;
  const hemi = new THREE.HemisphereLight(kelvin(7500), new THREE.Color(0.32, 0.22, 0.15), 0.55); scene.add(hemi); W.hemi = hemi;
  // a soft window "area" fill pointing into the room
  const winFill = new THREE.SpotLight(kelvin(7000), 6.0, 0, 1.2, 1.0, 2);
  winFill.position.set(0, winY + winH / 2, back + 0.05); winFill.target.position.set(0, 0.3, 0.8); scene.add(winFill, winFill.target); W.winFill = winFill;

  // ---------- clutter
  const card = pbr('card', { repeat: [1, 1] });
  const box = (w, h, d, x, z, ry = 0, y = 0) => { const m = new THREE.Mesh(roundBox(w, h, d, 0.012, 22), card); m.position.set(x, y + h / 2, z); m.rotation.y = ry; m.castShadow = m.receiveShadow = true; scene.add(m); const a = aoBlob(w * 1.5, d * 1.5, 0.55); a.position.set(x, 0.002 + y, z); a.rotation.z = ry; scene.add(a); return m; };
  box(0.5, 0.38, 0.42, -1.55, -1.4, 0.2); box(0.44, 0.3, 0.36, -1.5, -1.38, -0.1, 0.38); box(0.36, 0.28, 0.3, -1.95, -0.7, 0.5);
  box(0.4, 0.3, 0.34, 1.9, -0.3, -0.4);
  // rolled rug
  const rug = new THREE.Mesh(pill(1.1, 0.09, 0.09, 30, 28), pbr('wool', { repeat: [2, 3] })); rug.rotation.z = Math.PI / 2; rug.position.set(1.2, 0.09, -1.75); rug.rotation.y = 0.15; rug.castShadow = rug.receiveShadow = true; scene.add(rug);
  rug.position.x = 1.75;

  // ---------- picture sign (the one rule card): chalk drawings on a small board leaning on the wall
  W.sign = buildSign(); W.sign.position.set(-0.95, 0, back + 0.12); W.sign.rotation.set(-0.12, 0.18, 0); scene.add(W.sign);

  // ---------- trunk
  W.trunk = buildTrunk(); W.trunk.position.set(0.0, 0, -0.62); W.trunk.rotation.y = 0.0; scene.add(W.trunk);

  // ---------- rain leak drip spot + bucket
  W.leak = new THREE.Vector3(0.95, 2.18, -0.95);
  W.bucket = buildBucket(); W.bucket.position.set(1.55, 0, -0.55); scene.add(W.bucket);

  // ---------- fog (attic air)
  scene.fog = new THREE.FogExp2(new THREE.Color(0.11, 0.1, 0.095), 0.055);

  // ---------- environment map (simplified attic with a bright rainy window and the warm lamp)
  W.buildEnv = (renderer, sunAmt = 0, rainbow = 0) => {
    const es = new THREE.Scene();
    const roomM = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 0.14, 0.095), side: THREE.BackSide });
    const room = new THREE.Mesh(new THREE.BoxGeometry(5.4, 2.8, 5), roomM); room.position.y = 1.4; es.add(room);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 5), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 0.12, 0.07) })); fl.rotation.x = -Math.PI / 2; fl.position.y = 0.01; es.add(fl);
    const wm = new THREE.MeshBasicMaterial({ map: glassMat.uniforms.tOut.value, color: new THREE.Color(1, 1, 1).multiplyScalar(6 + sunAmt * 4) });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.4), wm); win.position.set(0, 1.15, -2.45); es.add(win);
    const bar1 = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 1.2), new THREE.MeshBasicMaterial({ color: 0x241a12 })); bar1.position.set(0, 1.15, -2.44); es.add(bar1);
    const bar2 = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.05), new THREE.MeshBasicMaterial({ color: 0x241a12 })); bar2.position.set(0, 1.15, -2.44); es.add(bar2);
    const lb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.72, 0.42).multiplyScalar(18) })); lb.position.set(0.32, 1.55, 0.18); es.add(lb);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.6), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.7, 0.45).multiplyScalar(1.2), side: THREE.DoubleSide })); glow.position.set(0, 2.6, 0); glow.rotation.x = Math.PI / 2; es.add(glow);
    for (const [x, z, ry] of [[-2.6, 0.3, Math.PI / 2], [2.6, -0.3, -Math.PI / 2], [0, 2.4, Math.PI]]) {
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 0.62, 0.4).multiplyScalar(0.9) }));
      pl.position.set(x, 0.9, z); pl.rotation.y = ry; es.add(pl);
    }
    es.position.y = -0.45; // capture from about robot height
    const pm = new THREE.PMREMGenerator(renderer);
    const rt = pm.fromScene(es, 0.015, 0.1, 20);
    pm.dispose();
    return rt.texture;
  };
  return W;
}

// ------------------------------------------------------------------ trunk
function buildTrunk() {
  const g = new THREE.Group();
  const w = 0.78, h = 0.36, d = 0.46;
  const leather = pbr('leather', { arm: true, repeat: [2.4, 1.4], ns: 0.7 });
  const wood = pbr('timber', { arm: true, repeat: [1.5, 0.5] }); wood.color.set(0x9a7656);
  const brass = new THREE.MeshPhysicalMaterial({ color: 0x9c7a44, metalness: 1, roughness: 0.42, normalMap: tex('rust_msk'), normalScale: new THREE.Vector2(0.15, 0.15) });
  // body (open top): 5 panels as thin rounded boxes
  const panel = (W, H, D, x, y, z, mat = leather) => { const m = new THREE.Mesh(roundBox(W, H, D, 0.006, 30), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
  panel(w, 0.02, d, 0, 0.02, 0);
  panel(w, h, 0.025, 0, h / 2, d / 2 - 0.0125); panel(w, h, 0.025, 0, h / 2, -d / 2 + 0.0125);
  panel(0.025, h, d, w / 2 - 0.0125, h / 2, 0); panel(0.025, h, d, -w / 2 + 0.0125, h / 2, 0);
  // wooden slats + brass corners
  for (const y of [0.06, h - 0.05]) { panel(w + 0.012, 0.045, 0.012, 0, y, d / 2 + 0.006, wood); panel(w + 0.012, 0.045, 0.012, 0, y, -d / 2 - 0.006, wood); panel(0.012, 0.045, d + 0.012, w / 2 + 0.006, y, 0, wood); panel(0.012, 0.045, d + 0.012, -w / 2 - 0.006, y, 0, wood); }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (const y of [0.03, h - 0.03]) { const c = new THREE.Mesh(new THREE.SphereGeometry(0.03, 20, 14), brass); c.scale.set(1, 0.9, 1); c.position.set(sx * (w / 2 - 0.004), y, sz * (d / 2 - 0.004)); c.castShadow = true; g.add(c); }
  // blanket inside
  const blanketMat = pbr('wool', { repeat: [1.5, 1] });
  const bl = new THREE.Mesh(roundBox(w - 0.06, 0.1, d - 0.06, 0.04, 40), blanketMat);
  { const p = bl.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); if (p.getY(i) > 0) p.setY(i, p.getY(i) + 0.03 * Math.sin(x * 14) * Math.cos(z * 11) + 0.02 * Math.sin(x * 31 + z * 7)); } bl.geometry.computeVertexNormals(); }
  bl.position.set(0, 0.2, 0); bl.receiveShadow = true; g.add(bl);
  // lid: curved top hinged at the back
  const lid = new THREE.Group(); lid.position.set(0, h, -d / 2); g.add(lid);
  const lidShell = new THREE.Mesh(new THREE.CylinderGeometry(d / 2, d / 2, w, 48, 1, false, -Math.PI / 2, Math.PI), leather);
  lidShell.material = leather.clone(); lidShell.material.side = THREE.DoubleSide;
  lidShell.rotation.z = Math.PI / 2; lidShell.scale.set(0.45, 1, 1); lidShell.position.set(0, 0.0, d / 2);
  lidShell.castShadow = lidShell.receiveShadow = true; lid.add(lidShell);
  const capM = leather;
  for (const sx of [-1, 1]) { const cap = new THREE.Mesh(new THREE.CircleGeometry(d / 2, 40, 0, Math.PI), capM); cap.scale.set(1, 0.45, 1); cap.rotation.y = sx * Math.PI / 2; cap.position.set(sx * w / 2, 0, d / 2); cap.material = leather.clone(); cap.material.side = THREE.DoubleSide; lid.add(cap); }
  for (const x of [-0.24, 0.24]) { const strap = new THREE.Mesh(new THREE.CylinderGeometry(d / 2 + 0.004, d / 2 + 0.004, 0.05, 40, 1, true, -Math.PI / 2, Math.PI), wood); strap.material = wood.clone(); strap.material.side = THREE.DoubleSide; strap.rotation.z = Math.PI / 2; strap.scale.set(0.47, 1, 1.01); strap.position.set(x, 0, d / 2); strap.castShadow = true; lid.add(strap); }
  // latch on the front
  const latch = new THREE.Mesh(roundBox(0.06, 0.07, 0.015, 0.006, 120), brass); latch.position.set(0, h - 0.035, d / 2 + 0.012); g.add(latch);
  g.userData = { lid, latch, w, h, d };
  const ao = aoBlob(w * 1.35, d * 1.5, 0.8); g.add(ao);
  return g;
}

function buildBucket() {
  const g = new THREE.Group();
  const zinc = new THREE.MeshPhysicalMaterial({ color: 0x9aa0a4, metalness: 1, roughness: 0.38, normalMap: tex('rust_msk'), normalScale: new THREE.Vector2(0.12, 0.12) });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.26, 48, 8, true), zinc); body.material = zinc.clone(); body.material.side = THREE.DoubleSide;
  body.position.y = 0.13; body.castShadow = body.receiveShadow = true; g.add(body);
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.12, 40), zinc); bottom.rotation.x = -Math.PI / 2; bottom.position.y = 0.01; g.add(bottom);
  for (const y of [0.04, 0.24]) { const rim = new THREE.Mesh(new THREE.TorusGeometry(0.12 + (y / 0.26) * 0.03 + 0.003, 0.006, 8, 64), zinc); rim.rotation.x = Math.PI / 2; rim.position.y = y; g.add(rim); }
  const top = new THREE.Mesh(new THREE.TorusGeometry(0.152, 0.008, 10, 64), zinc); top.rotation.x = Math.PI / 2; top.position.y = 0.26; g.add(top);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.004, 8, 48, Math.PI), new THREE.MeshStandardMaterial({ color: 0x55585a, metalness: 1, roughness: 0.5 }));
  handle.position.y = 0.26; handle.rotation.z = 0; handle.rotation.y = 0.3; g.add(handle);
  const water = new THREE.Mesh(new THREE.CircleGeometry(0.125, 40), new THREE.MeshPhysicalMaterial({ color: 0x2a3438, roughness: 0.05, metalness: 0, transmission: 0, clearcoat: 1, transparent: true, opacity: 0.85 }));
  water.rotation.x = -Math.PI / 2; water.position.y = 0.02; water.visible = false; g.add(water);
  g.userData = { water, level: 0 };
  g.add(aoBlob(0.42, 0.42, 0.7));
  return g;
}

// The picture sign: brown robot -> brush & cloth -> shiny robot, oil can -> waving robot, sun & rainbow.
function buildSign() {
  const c = canvas(512, 384), g = c.getContext('2d');
  // slate board
  g.fillStyle = '#2b312e'; g.fillRect(0, 0, 512, 384);
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.035})`; g.fillRect(Math.random() * 512, Math.random() * 384, 2 + Math.random() * 10, 1 + Math.random() * 2); }
  const chalk = (col, w = 5) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.shadowColor = col; g.shadowBlur = 2; };
  const robot = (x, y, s, col, happy, wave) => {
    chalk(col, 5);
    g.strokeRect(x - 22 * s, y - 70 * s, 44 * s, 34 * s); // head
    g.beginPath(); g.arc(x - 9 * s, y - 55 * s, 6 * s, 0, 7); g.stroke(); g.beginPath(); g.arc(x + 9 * s, y - 55 * s, 6 * s, 0, 7); g.stroke();
    g.beginPath(); g.arc(x, y - 46 * s, 7 * s, 0.2, Math.PI - 0.2); g.stroke();
    g.beginPath(); g.moveTo(x, y - 70 * s); g.lineTo(x, y - 82 * s); g.stroke(); g.beginPath(); g.arc(x, y - 85 * s, 3 * s, 0, 7); g.stroke();
    g.strokeRect(x - 26 * s, y - 32 * s, 52 * s, 40 * s);
    g.beginPath(); g.moveTo(x - 26 * s, y - 25 * s); g.lineTo(x - 42 * s, wave ? y - 50 * s : y - 2 * s); g.stroke();
    g.beginPath(); g.moveTo(x + 26 * s, y - 25 * s); g.lineTo(x + 42 * s, y - 2 * s); g.stroke();
    g.beginPath(); g.moveTo(x - 12 * s, y + 8 * s); g.lineTo(x - 12 * s, y + 30 * s); g.moveTo(x + 12 * s, y + 8 * s); g.lineTo(x + 12 * s, y + 30 * s); g.stroke();
    if (happy) { chalk('#fff6c8', 4); for (const [dx, dy] of [[-46, -70], [44, -78], [40, -20]]) { g.beginPath(); g.moveTo(x + dx * s - 8, y + dy * s); g.lineTo(x + dx * s + 8, y + dy * s); g.moveTo(x + dx * s, y + dy * s - 8); g.lineTo(x + dx * s, y + dy * s + 8); g.stroke(); } }
  };
  const arrow = (x, y) => { chalk('#eeeeea', 5); g.beginPath(); g.moveTo(x - 18, y); g.lineTo(x + 18, y); g.moveTo(x + 8, y - 10); g.lineTo(x + 18, y); g.lineTo(x + 8, y + 10); g.stroke(); };
  // row 1: rusty robot -> brush/cloth -> shiny robot
  robot(70, 150, 1, '#c97a40'); for (let i = 0; i < 26; i++) { g.fillStyle = 'rgba(190,100,50,0.7)'; g.fillRect(40 + Math.random() * 60, 85 + Math.random() * 90, 4, 4); }
  arrow(140, 120);
  chalk('#e8e2d6', 5); g.beginPath(); g.ellipse(200, 110, 26, 16, -0.4, 0, 7); g.stroke(); // cloth
  g.beginPath(); g.moveTo(188, 128); g.quadraticCurveTo(200, 140, 214, 126); g.stroke();
  arrow(258, 120);
  robot(330, 150, 1, '#e6eef2', true);
  // row 2: oil can + drop -> waving robot -> rainbow
  chalk('#d8c070', 5); g.beginPath(); g.moveTo(60, 330); g.lineTo(100, 330); g.lineTo(96, 290); g.lineTo(64, 290); g.closePath(); g.stroke();
  g.beginPath(); g.moveTo(96, 300); g.lineTo(130, 268); g.stroke();
  g.fillStyle = '#e0b850'; g.beginPath(); g.moveTo(136, 274); g.quadraticCurveTo(146, 296, 136, 298); g.quadraticCurveTo(126, 296, 136, 274); g.fill();
  arrow(180, 300);
  robot(250, 350, 0.82, '#e6eef2', true, true);
  arrow(318, 300);
  const cols = ['#e88080', '#e8b070', '#e8e080', '#90d090', '#80a8e0', '#b090d8'];
  cols.forEach((cc, i) => { chalk(cc, 6); g.beginPath(); g.arc(430, 340, 70 - i * 7, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); });
  chalk('#f5e6a0', 5); g.beginPath(); g.arc(470, 262, 16, 0, 7); g.stroke();
  // board in a wooden frame on two legs
  const grp = new THREE.Group();
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.42), new THREE.MeshStandardMaterial({ map: canvasTex(c), roughness: 0.9, normalMap: tex('plaster_nrm'), normalScale: new THREE.Vector2(0.5, 0.5) }));
  face.position.set(0, 0.55, 0.012); face.castShadow = false; face.receiveShadow = true; grp.add(face);
  const fm = pbr('timber', { arm: true, repeat: [1, 0.2] }); fm.color.set(0xa88866);
  const bar = (w, h, x, y) => { const m = new THREE.Mesh(roundBox(w, h, 0.03, 0.006, 40), fm); m.position.set(x, y, 0); m.castShadow = m.receiveShadow = true; grp.add(m); };
  bar(0.62, 0.04, 0, 0.78); bar(0.62, 0.04, 0, 0.32); bar(0.04, 0.82, -0.3, 0.41); bar(0.04, 0.82, 0.3, 0.41);
  const ao = aoBlob(0.8, 0.3, 0.6); ao.position.z = 0.05; grp.add(ao);
  return grp;
}
