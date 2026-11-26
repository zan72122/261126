// Concrete mixer truck – rear half, real scale. Drum, hopper, chute (swings), control lever, wheels.
import * as THREE from 'three';
import { RoundedBox, sRGB } from './world.js';

export function paintedMetal(T, hex, { rough = 0.45, grime = 1, splat = 1, metal = 0.25, clear = 0.5 } = {}) {
  const m = new THREE.MeshPhysicalMaterial({ color: sRGB(hex), roughness: rough, metalness: metal, clearcoat: clear, clearcoatRoughness: 0.25, envMapIntensity: 1 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.tM = { value: T.metalD }; sh.uniforms.uG = { value: grime }; sh.uniforms.uS = { value: splat };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vOP; varying vec3 vON;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvOP = position; vON = normal;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vOP; varying vec3 vON; uniform sampler2D tM; uniform float uG, uS;
      vec4 tri(vec3 p, vec3 n, float s){ vec3 w = pow(abs(normalize(n)), vec3(4.)); w/=w.x+w.y+w.z; return texture2D(tM,p.zy*s)*w.x + texture2D(tM,p.xz*s)*w.y + texture2D(tM,p.xy*s)*w.z; }
      vec3 dB(vec3 sp, vec3 sn, vec2 dH, float fd){ vec3 sx=normalize(dFdx(sp)), sy=normalize(dFdy(sp)); vec3 R1=cross(sy,sn), R2=cross(sn,sx); float det=dot(sx,R1)*fd; return normalize(abs(det)*sn - sign(det)*(dH.x*R1+dH.y*R2)); }
      float gGr, gSp, gSc;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        { vec4 a = tri(vOP, vON, 1.6); vec4 b = tri(vOP*1.0+3.1, vON, 0.35);
          gGr = a.r*0.6 + b.g*0.6; gSc = a.b; gSp = smoothstep(0.35, 0.6, b.a*0.7 + a.a*0.5) * uS;
          vec3 grimeC = vec3(0.16,0.14,0.11);
          diffuseColor.rgb = mix(diffuseColor.rgb, grimeC, clamp(gGr-0.45,0.,1.)*0.7*uG);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42,0.41,0.39), gSp*0.9);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.45,0.45,0.46), gSc*0.25);
        }`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = clamp(roughness + gGr*0.35*uG + gSp*0.5 - gSc*0.1, 0.05, 1.);')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        { float hh = gSp*0.8 - gSc*0.5 + gGr*0.05; normal = dB(-vViewPosition, normal, vec2(dFdx(hh), dFdy(hh))*0.6, faceDirection); }`)
      .replace('#include <lights_physical_fragment>', '#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat *= (1.0 - gSp) * (1.0 - clamp(gGr-0.4,0.,1.));\n#endif');
  };
  m.customProgramCacheKey = () => 'pm' + hex + grime + splat;
  return m;
}

function tireGeometry(R, w) {
  // lathe profile + tread lugs displaced around the circumference
  const pts = [];
  const r0 = R * 0.58;
  pts.push(new THREE.Vector2(r0, -w / 2));
  for (let i = 0; i <= 10; i++) { const a = i / 10; pts.push(new THREE.Vector2(R - 0.03 * Math.pow(Math.abs(a * 2 - 1), 3), -w / 2 + a * w)); }
  pts.push(new THREE.Vector2(r0, w / 2));
  const g = new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p.x, p.y)), 96);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const r = Math.hypot(x, z);
    if (r > R - 0.02 && Math.abs(y) < w * 0.45) {
      const a = Math.atan2(z, x); const lug = Math.sin(a * 36 + Math.sign(y) * 0.9) > 0.1 ? 0 : -0.012;
      const s = (r + lug) / r; p.setX(i, x * s); p.setZ(i, z * s);
    }
  }
  g.rotateX(Math.PI / 2); // axle along Z
  g.computeVertexNormals();
  return g;
}

export function buildTruck(scene, T) {
  const tr = { group: new THREE.Group() };
  const G = tr.group; scene.add(G);
  // truck along -X; rear end at x = 0 in local; placed in world so rear is near slab corner
  G.position.set(-1.05, 0, -2.0);
  const white = paintedMetal(T, '#d9d6cc', { rough: 0.4, grime: 1, splat: 1 });
  const drumPaint = paintedMetal(T, '#d4cfbf', { rough: 0.38, grime: 1.1, splat: 1.2 });
  const dark = paintedMetal(T, '#2c2d2f', { rough: 0.6, grime: 0.6, splat: 0.6, metal: 0.4, clear: 0.1 });
  const steel = paintedMetal(T, '#7d7f80', { rough: 0.35, grime: 0.8, splat: 1.0, metal: 0.85, clear: 0 });
  const rubber = new THREE.MeshStandardMaterial({ color: sRGB('#1d1c1c'), roughness: 0.85, normalMap: T.metalN, normalScale: new THREE.Vector2(0.4, 0.4), envMapIntensity: 0.5 });
  const red = new THREE.MeshPhysicalMaterial({ color: sRGB('#8e1d18'), roughness: 0.2, clearcoat: 1, transmission: 0, emissive: new THREE.Color(0.15, 0.0, 0.0) });
  const amber = new THREE.MeshPhysicalMaterial({ color: sRGB('#b86a18'), roughness: 0.25, clearcoat: 1 });
  const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, parent = G) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };

  // chassis rails + rear bumper
  add(new RoundedBox(6.5, 0.26, 0.09, 0.01), dark, -3.2, 0.95, 0.42);
  add(new RoundedBox(6.5, 0.26, 0.09, 0.01), dark, -3.2, 0.95, -0.42);
  add(new RoundedBox(0.14, 0.18, 2.35, 0.02), dark, 0.05, 0.62, 0);
  for (const s of [1, -1]) {
    add(new RoundedBox(0.06, 0.12, 0.28, 0.02), red, 0.13, 0.66, s * 0.95);
    add(new RoundedBox(0.06, 0.08, 0.12, 0.02), amber, 0.13, 0.66, s * 0.72);
    // mud flaps
    add(new RoundedBox(0.02, 0.55, 0.6, 0.008), rubber, -0.42, 0.58, s * 0.92);
  }
  // rear wheels (tandem, dual)
  const tg = tireGeometry(0.52, 0.28);
  const rimMat = paintedMetal(T, '#b9bbbc', { rough: 0.3, grime: 0.9, splat: 0.5, metal: 0.9, clear: 0 });
  const rimG = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 28); rimG.rotateX(Math.PI / 2);
  for (const ax of [-1.1, -2.45]) for (const s of [1, -1]) for (const d of [0, 1]) {
    const z = s * (0.82 + d * 0.3);
    const t = add(tg, rubber, ax, 0.52, z);
    if (d === 1) add(rimG, rimMat, ax, 0.52, z + s * 0.05);
  }
  // fenders
  const fenderG = new THREE.CylinderGeometry(0.62, 0.62, 0.72, 24, 1, true, Math.PI * 0.05, Math.PI * 0.9); fenderG.rotateX(Math.PI / 2); fenderG.rotateZ(Math.PI / 2);
  for (const s of [1, -1]) add(fenderG, dark, -1.78, 0.6, s * 0.97, 0, 0, 0).scale.set(1.8, 1, 1);
  // drum (lathe), tilted: rear raised
  const prof = [];
  const L = 4.6, Rm = 1.12;
  const shape = (t) => t < 0.28 ? 0.35 + (Rm - 0.35) * Math.sin(t / 0.28 * Math.PI / 2) : t < 0.62 ? Rm : Rm - (Rm - 0.42) * Math.pow((t - 0.62) / 0.38, 1.5);
  for (let i = 0; i <= 40; i++) { const t = i / 40; prof.push(new THREE.Vector2(shape(t), t * L)); }
  const dg = new THREE.LatheGeometry(prof, 72); dg.rotateZ(Math.PI / 2); // axis along -X
  const drumPivot = new THREE.Group(); drumPivot.position.set(-0.85, 2.55, 0); drumPivot.rotation.z = -0.2; G.add(drumPivot);
  const drum = new THREE.Mesh(dg, drumPaint); drum.castShadow = drum.receiveShadow = true; drumPivot.add(drum);
  drum.position.x = 0; // lathe along -x from pivot (rear end at pivot)
  // spiral painted bands on drum (helps read rotation)
  const bandMat = paintedMetal(T, '#7c2a22', { rough: 0.4, grime: 1.0, splat: 1.0 });
  for (let k = 0; k < 2; k++) {
    const pts = []; for (let i = 0; i <= 60; i++) { const t = 0.08 + i / 60 * 0.84; const a = t * Math.PI * 2.4 + k * Math.PI; const r = shape(t) + 0.004; pts.push(new THREE.Vector3(-t * L, Math.cos(a) * r, Math.sin(a) * r)); }
    const band = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.05, 6, false), bandMat); band.scale.set(1, 1, 1); band.castShadow = true; drum.add(band);
  }
  // drum roller ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.05, 10, 48), steel); ring.rotation.y = Math.PI / 2; ring.position.x = -0.3; drum.add(ring);
  // drum opening dark interior
  const mouth = new THREE.Mesh(new THREE.CircleGeometry(0.34, 32), new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 1 })); mouth.rotation.y = Math.PI / 2; mouth.position.x = 0.01; drum.add(mouth);
  tr.drum = drum;
  // rear pedestal (supports drum) + platform + ladder
  add(new RoundedBox(0.2, 1.4, 1.1, 0.03), white, -0.55, 1.65, 0);
  add(new RoundedBox(0.7, 0.05, 0.9, 0.01), steel, -0.2, 2.0, 0);
  for (const s of [1, -1]) add(new RoundedBox(0.04, 1.9, 0.04, 0.008), steel, 0.12, 1.05, s * 0.32);
  for (let i = 0; i < 6; i++) add(new RoundedBox(0.035, 0.03, 0.62, 0.008), steel, 0.12, 0.35 + i * 0.3, 0);
  // hopper (funnel)
  const hop = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.2, 0.6, 4, 1, true, Math.PI / 4), white); hop.material = white; hop.position.set(-0.02, 2.75, 0); hop.rotation.z = -0.15; hop.castShadow = true; G.add(hop);
  // collection chute under hopper
  add(new RoundedBox(0.28, 0.5, 0.32, 0.03), steel, 0.05, 1.68, 0, 0, 0, 0.2);
  // main chute: U trough, pivots at base
  const chutePivot = new THREE.Group(); chutePivot.position.set(0.15, 1.62, 0.55); G.add(chutePivot);
  const sh = new THREE.Shape();
  const cw = 0.2;
  sh.moveTo(-cw, 0.16); sh.absarc(0, 0.0, cw, Math.PI, 0, true); sh.lineTo(cw, 0.16); sh.lineTo(cw + 0.012, 0.16); sh.absarc(0, 0, cw + 0.012, 0, Math.PI, false); sh.lineTo(-cw - 0.012, 0.16);
  const cg = new THREE.ExtrudeGeometry(sh, { depth: 1.75, bevelEnabled: false, steps: 1, curveSegments: 16 });
  const chuteMat = paintedMetal(T, '#8a8c8d', { rough: 0.35, grime: 1.2, splat: 1.6, metal: 0.8, clear: 0 });
  const chute = new THREE.Mesh(cg, chuteMat); chute.castShadow = chute.receiveShadow = true;
  // concrete film inside the chute (shows wet when pouring)
  const filmSh = new THREE.Shape(); filmSh.absarc(0, 0, cw - 0.005, Math.PI * 1.15, Math.PI * 1.85, false);
  const filmG = new THREE.ExtrudeGeometry(filmSh, { depth: 1.74, bevelEnabled: false, curveSegments: 12 });
  const chuteArm = new THREE.Group(); chutePivot.add(chuteArm); chuteArm.add(chute);
  tr.chuteFilmMat = new THREE.MeshPhysicalMaterial({ color: sRGB('#5e5d58'), roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.15, transparent: true, opacity: 0 });
  const film = new THREE.Mesh(filmG, tr.chuteFilmMat); film.position.z = 0.005; film.visible = false; chuteArm.add(film);
  chuteArm.rotation.x = 0.36; // slope down
  tr.chutePivot = chutePivot; tr.chuteArm = chuteArm; tr.chuteLen = 1.75;
  // control box + lever at rear right corner
  const box = add(new RoundedBox(0.2, 0.26, 0.14, 0.02), dark, 0.4, 0.58, 1.25);
  add(new RoundedBox(0.05, 0.5, 0.05, 0.01), dark, 0.4, 0.3, 1.25);
  add(new RoundedBox(0.4, 0.05, 0.05, 0.01), dark, 0.22, 0.5, 1.2);
  const leverPivot = new THREE.Group(); leverPivot.position.set(0.51, 0.62, 1.25); G.add(leverPivot);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.42, 10), steel); rod.position.y = 0.21; rod.castShadow = true; leverPivot.add(rod);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.038, 20, 14), new THREE.MeshPhysicalMaterial({ color: sRGB('#a3241c'), roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 }));
  knob.position.y = 0.43; knob.castShadow = true; leverPivot.add(knob);
  leverPivot.rotation.z = 0.25;
  tr.lever = leverPivot; tr.knob = knob;
  // side body panel of rear section (tool box / water hose)
  add(new RoundedBox(1.6, 0.5, 0.06, 0.02), white, -1.6, 1.25, 1.2);
  const hose = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 32), rubber); hose.position.set(-1.0, 1.3, 1.25); hose.castShadow = true; G.add(hose);
  G.updateMatrixWorld(true);
  tr.chuteEnd = () => { const v = new THREE.Vector3(0, -0.0, 1.75); return chuteArm.localToWorld(v); };
  tr.chuteDir = () => { const a = chuteArm.localToWorld(new THREE.Vector3(0, 0, 1.2)); const b = chuteArm.localToWorld(new THREE.Vector3(0, 0, 1.75)); return b.sub(a).normalize(); };
  tr.leverTip = () => knob.getWorldPosition(new THREE.Vector3());
  return tr;
}
