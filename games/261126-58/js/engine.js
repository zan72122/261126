// Renderer, environment lighting, camera framing, input and the frame loop.
import * as THREE from 'three';
import { Pipeline } from './post.js';
import { setAniso } from './tex.js';

export const E = {
  t: 0, dt: 0, w: 1, h: 1, portrait: false,
  renderer: null, scene: null, camera: null, pipe: null,
  shot: null, camPos: new THREE.Vector3(1, 1.2, 2), camLook: new THREE.Vector3(0, 1, 0),
  post: { focus: 1.3, aperture: 3.5, exposure: 1, bloom: 0.25, threshold: 1.6, grade: [1, 1, 1] },
  dpr: 1, dprMax: 2, frameTimes: [], updaters: [],
};

export function initEngine(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false });
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFShadowMap;
  r.outputColorSpace = THREE.LinearSRGBColorSpace; // the final pass does ACES + sRGB itself
  r.toneMapping = THREE.NoToneMapping;
  setAniso(r.capabilities.getMaxAnisotropy());
  E.renderer = r;
  E.scene = new THREE.Scene();
  E.scene.background = new THREE.Color(0x050403);
  E.camera = new THREE.PerspectiveCamera(40, 1, 0.05, 60);
  E.pipe = new Pipeline(r);
  const ua = navigator.userAgent;
  E.mobile = /iPhone|iPad|Android|Mobile/.test(ua) || (navigator.maxTouchPoints > 1 && /Mac/.test(ua));
  E.dprMax = Math.min(window.devicePixelRatio || 1, E.mobile ? 1.6 : 1.5);
  E.dpr = E.mobile ? Math.min(1.25, E.dprMax) : E.dprMax;
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 200));
  return E;
}

export function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  E.w = w; E.h = h; E.portrait = h > w;
  E.renderer.setPixelRatio(1);
  E.renderer.setSize(Math.floor(w * E.dpr), Math.floor(h * E.dpr), false);
  E.renderer.domElement.style.width = w + 'px'; E.renderer.domElement.style.height = h + 'px';
  E.pipe.setSize(w, h, E.dpr);
  E.camera.aspect = w / h;
  // ~38mm full-frame equivalent across the diagonal (57° diagonal FOV)
  const diag = Math.hypot(w, h);
  const tanD = Math.tan(THREE.MathUtils.degToRad(57 / 2));
  E.camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(tanD * h / diag));
  E.camera.updateProjectionMatrix();
  if (E.shot) applyShot(E.shot, true);
}

// A shot: look target, direction from target to camera, and a region (w,h) that must fit.
export function frameShot(s) {
  const cam = E.camera;
  const vf = THREE.MathUtils.degToRad(cam.fov) / 2;
  const hf = Math.atan(Math.tan(vf) * cam.aspect);
  const w = (E.portrait && s.pw) || s.w, h = (E.portrait && s.ph) || s.h;
  const dist = Math.max(w / 2 / Math.tan(hf), h / 2 / Math.tan(vf)) + (s.depth || 0);
  const dir = ((E.portrait && s.pdir) || s.dir).clone().normalize();
  const look = ((E.portrait && s.plook) || s.look).clone();
  return { pos: look.clone().addScaledVector(dir, Math.min(dist, s.maxDist || 99)), look };
}
export function applyShot(s, snap) {
  E.shot = s;
  const f = frameShot(s);
  E.shotTarget = f;
  if (snap) { E.camPos.copy(f.pos); E.camLook.copy(f.look); }
}

// --------------------------------------------------------------- input
const handlers = [];
export function onPointer(h) { handlers.push(h); }
export const ptr = { down: false, x: 0, y: 0, ndc: new THREE.Vector2(), id: -1, downT: 0, lastAct: 0 };
export function initInput(canvas) {
  const upd = (e) => {
    ptr.x = e.clientX; ptr.y = e.clientY;
    ptr.ndc.set((e.clientX / E.w) * 2 - 1, -(e.clientY / E.h) * 2 + 1);
  };
  canvas.addEventListener('pointerdown', (e) => {
    if (ptr.down && e.pointerId !== ptr.id) return;
    ptr.down = true; ptr.id = e.pointerId; ptr.downT = E.t; ptr.lastAct = E.t; upd(e);
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    for (const h of handlers) h('down', ptr);
    e.preventDefault();
  });
  canvas.addEventListener('pointermove', (e) => { if (e.pointerId !== ptr.id && ptr.down) return; upd(e); if (ptr.down) { ptr.lastAct = E.t; for (const h of handlers) h('move', ptr); } });
  const up = (e) => { if (!ptr.down || e.pointerId !== ptr.id) return; upd(e); ptr.down = false; ptr.lastAct = E.t; for (const h of handlers) h('up', ptr); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('contextmenu', (e) => e.preventDefault());
}
const ray = new THREE.Raycaster();
export function pick(objs, ndc = ptr.ndc) {
  ray.setFromCamera(ndc, E.camera);
  return ray.intersectObjects(objs, true);
}
export function rayFrom(ndc = ptr.ndc) { ray.setFromCamera(ndc, E.camera); return ray.ray; }
export function toScreen(v) {
  const p = v.clone().project(E.camera);
  return { x: (p.x + 1) / 2 * E.w, y: (1 - p.y) / 2 * E.h, z: p.z };
}

// --------------------------------------------------------------- loop
export function startLoop(update) {
  let last = performance.now();
  let slow = 0, fast = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    let dt = (now - last) / 1000; last = now;
    if (dt > 0.1) dt = 0.1;
    E.dt = dt; E.t += dt;
    // adaptive resolution to hold >= 30fps
    if (dt > 1 / 32) { slow++; fast = 0; } else if (dt < 1 / 55) { fast++; slow = Math.max(0, slow - 1); }
    if (slow > 20 && E.dpr > 0.75) { E.dpr = Math.max(0.75, E.dpr - 0.15); slow = 0; resize(); }
    if (fast > 120 && E.dpr < E.dprMax) { E.dpr = Math.min(E.dprMax, E.dpr + 0.1); fast = 0; resize(); }
    update(dt, E.t);
    // camera smoothing
    if (E.shotTarget) {
      const k = 1 - Math.exp(-dt * (E.camSpeed || 1.6));
      E.camPos.lerp(E.shotTarget.pos, k); E.camLook.lerp(E.shotTarget.look, k);
    }
    const sway = E.handheld === undefined ? 1 : E.handheld;
    E.camera.position.copy(E.camPos);
    E.camera.position.x += Math.sin(E.t * 0.31) * 0.004 * sway; E.camera.position.y += Math.sin(E.t * 0.23 + 1) * 0.003 * sway;
    E.camera.lookAt(E.camLook);
    E.post.focus = E.camera.position.distanceTo(E.focusPoint || E.camLook);
    for (const u of E.updaters) u(dt, E.t);
    E.pipe.render(E.scene, E.camera, E.post);
  }
  requestAnimationFrame(frame);
}
