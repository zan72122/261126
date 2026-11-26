// The big round ship's wheel (HUD, bottom-right). Rendered in its own small scene on top of the world.
import * as THREE from './three.js';
import { mergeColored, mat, clamp, wrapAngle, damp } from './util.js';
import { makeRingTexture } from './textures.js';

export function createWheel() {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -100, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9a8a7a, 2.2));
  const dl = new THREE.DirectionalLight(0xffffff, 1.6); dl.position.set(-0.4, 0.8, 1); scene.add(dl);

  const parts = [];
  const WOOD = 0xb8743c, WOOD2 = 0xd9995a, GOLD = 0xffcf4a;
  parts.push({ geo: new THREE.TorusGeometry(1, 0.11, 10, 40), color: WOOD });
  parts.push({ geo: new THREE.TorusGeometry(0.86, 0.045, 6, 40), color: WOOD2 });
  parts.push({ geo: new THREE.CylinderGeometry(0.24, 0.24, 0.22, 20), color: GOLD, matrix: mat(0, 0, 0, Math.PI / 2, 0, 0) });
  parts.push({ geo: new THREE.CylinderGeometry(0.12, 0.12, 0.3, 12), color: 0xfff0b0, matrix: mat(0, 0, 0.05, Math.PI / 2, 0, 0) });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    parts.push({ geo: new THREE.CylinderGeometry(0.05, 0.06, 0.85, 8), color: WOOD2, matrix: mat(Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0, 0, 0, a - Math.PI / 2) });
    parts.push({ geo: new THREE.CylinderGeometry(0.085, 0.07, 0.36, 10), color: WOOD, matrix: mat(Math.cos(a) * 1.25, Math.sin(a) * 1.25, 0, 0, 0, a - Math.PI / 2) });
    parts.push({ geo: new THREE.SphereGeometry(0.11, 10, 8), color: i === 0 ? 0xff6b6b : WOOD2, matrix: mat(Math.cos(a) * 1.44, Math.sin(a) * 1.44, 0) });
  }
  const geo = mergeColored(parts);
  const material = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0x000000 });
  const spin = new THREE.Group(); const tilt = new THREE.Group();
  tilt.rotation.x = -0.32; tilt.add(spin); scene.add(tilt);
  spin.add(new THREE.Mesh(geo, material));
  const ringTex = makeRingTexture();
  const glowMat = new THREE.MeshBasicMaterial({ map: ringTex, color: 0xffe27a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), glowMat); glow.position.z = -0.6; tilt.add(glow);

  const st = { cx: 0, cy: 0, r: 100, angle: 0, grabbed: false, lastA: 0, total: 0, hint: 0, wiggle: 0, vel: 0 };

  /** w, h: CSS px; insets: safe area (CSS px). Returns the wheel's circle for the camera (CSS px, y down). */
  function layout(w, h, insets) {
    const ins = insets || { top: 0, right: 0, bottom: 0, left: 0 };
    camera.left = 0; camera.right = w; camera.top = h; camera.bottom = 0; camera.updateProjectionMatrix();
    st.r = clamp(Math.min(w, h) * 0.16, 70, 190);
    // bottom-right corner, inside the safe area (the handles reach 1.03 r, the touch area 1.3 r)
    st.cx = w - ins.right - st.r * 1.42; st.cy = ins.bottom + st.r * 1.42;
    tilt.position.set(st.cx, st.cy, 0); tilt.scale.setScalar(st.r / 1.5);
    return { x: st.cx, y: h - st.cy, r: st.r * 1.05 };
  }
  /** screen coords (CSS px, y down) */
  function hit(x, y, h) { const dx = x - st.cx, dy = (h - y) - st.cy; return Math.hypot(dx, dy) < st.r * 1.3; }
  function grab(x, y, h) { st.grabbed = true; st.lastA = Math.atan2((h - y) - st.cy, x - st.cx); st.total = 0; st.dist = 0; }
  /** returns the signed angle delta (rad, + = counter-clockwise on screen) */
  function drag(x, y, h) {
    const dx = x - st.cx, dy = (h - y) - st.cy; const r = Math.hypot(dx, dy);
    const a = Math.atan2(dy, dx);
    let d = wrapAngle(a - st.lastA); st.lastA = a;
    if (r < st.r * 0.18) d = 0; // too close to the hub: angle is unstable
    st.angle += d; st.total += Math.abs(d); st.vel = d;
    return d;
  }
  function release() { st.grabbed = false; }
  function update(dt, t) {
    if (!st.grabbed) {
      // settle gently back to an upright handle (nearest full turn)
      const rest = Math.round(st.angle / (Math.PI * 2)) * Math.PI * 2;
      st.angle = damp(st.angle, rest, 1.4, dt);
    }
    st.wiggle = st.hint > 0.01 && !st.grabbed ? Math.sin(t * 5) * 0.12 * st.hint * Math.max(0, Math.sin(t * 1.6)) : 0;
    spin.rotation.z = st.angle + st.wiggle;
    const k = st.hint * (0.55 + 0.35 * Math.sin(t * Math.PI * 2 / 1.2));
    glowMat.opacity = clamp(k, 0, 1);
    material.emissive.setRGB(0.35 * k, 0.28 * k, 0.1 * k);
    const s = 1 + 0.04 * st.hint * Math.max(0, Math.sin(t * Math.PI * 2 / 1.2));
    tilt.scale.setScalar((st.r / 1.5) * s);
  }
  return {
    scene, camera, layout, hit, grab, drag, release, update, state: st,
    setHint(v) { st.hint = clamp(v, 0, 1); },
    dispose() { geo.dispose(); material.dispose(); glowMat.dispose(); ringTex.dispose(); glow.geometry.dispose(); },
  };
}
