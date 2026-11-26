// main.js — boot, frame loop, pointer input, idle hint hand, adaptive resolution
import * as THREE from 'three';
import { C, initRenderer, resize, render, initSky, updateSky, initLights, updateCamera, allTexturesLoaded, setShot } from './core.js';
import { initFx, updateFx, sparkle } from './fx.js';
import { setupGame, updateGame, gameDown, gameMove, gameUp, G } from './game.js';

const canvas = document.getElementById('c');
const hand = document.getElementById('hand');
initRenderer(canvas);
initLights();
initSky();
initFx();
setupGame();
window.addEventListener('resize', () => resize());
window.addEventListener('orientationchange', () => setTimeout(resize, 200));

// ---- input (single finger)
let activeId = null;
const pt = (e) => ({ x: e.clientX, y: e.clientY });
canvas.addEventListener('pointerdown', (e) => { if (activeId !== null) return; activeId = e.pointerId; canvas.setPointerCapture?.(e.pointerId); gameDown(pt(e)); e.preventDefault(); });
canvas.addEventListener('pointermove', (e) => { if (e.pointerId !== activeId) return; gameMove(pt(e)); e.preventDefault(); });
const end = (e) => { if (e.pointerId !== activeId) return; activeId = null; gameUp(pt(e)); };
canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
document.addEventListener('gesturestart', (e) => e.preventDefault());

// ---- hint hand (appears after a few idle seconds) + faint glimmer on the next thing to touch
const _p = new THREE.Vector3();
let glimT = 0;
function updateHint(dt) {
  glimT -= dt;
  if (G.hint && glimT < 0) { glimT = 1.3; sparkle(G.hint, 2, 0.25); }
  const idle = G.t - G.lastInput;
  if (!G.hint || idle < 4 || activeId !== null) { hand.style.opacity = 0; return; }
  _p.copy(G.hint).project(C.camera);
  if (_p.z > 1) { hand.style.opacity = 0; return; }
  const x = (_p.x * 0.5 + 0.5) * C.w, y = (-_p.y * 0.5 + 0.5) * C.h;
  const t = G.t;
  let ox = 0, oy = 0, sc = 1;
  if (G.hintKind === 'tap' || G.hintKind === 'hold') { sc = 1 - 0.12 * Math.max(0, Math.sin(t * 5)); oy = 6 * Math.max(0, Math.sin(t * 5)); }
  else if (G.hintKind === 'drag') { ox = Math.sin(t * 3) * 50; oy = Math.cos(t * 6) * 8; }
  else if (G.hintKind === 'swipe') { oy = Math.sin(t * 4) * 60; }
  hand.style.opacity = Math.min(1, (idle - 4) * 2) * 0.95;
  hand.style.transform = `translate(${x + ox - 18}px, ${y + oy - 4}px) scale(${sc})`;
}

// ---- loop with adaptive resolution (keeps >= 30 fps on phones)
const HQ = /hq=1/.test(location.search);
let last = performance.now(), acc = 0, frames = 0, slow = 0, fast = 0;
function frame(now) {
  requestAnimationFrame(frame);
  let dt = Math.min(0.05, (now - last) / 1000); last = now;
  C.time += dt; C.dt = dt;
  updateGame(dt);
  updateCamera(dt);
  updateSky();
  updateFx(dt);
  updateHint(dt);
  render();
  acc += dt; frames++;
  if (acc > 1.0 && !HQ) {
    const fps = frames / acc; acc = 0; frames = 0;
    if (fps < 32 && C.scale > 0.45) { slow++; if (slow >= 2) { C.scale *= 0.8; resize(); slow = 0; } } else slow = 0;
    if (fps > 55 && C.scale < 1) { fast++; if (fast >= 4) { C.scale = Math.min(1, C.scale * 1.15); resize(); fast = 0; } } else fast = 0;
    window.__fps = fps;
  }
  if (!window.__started) { window.__started = true; document.getElementById('splash').classList.add('off'); }
}
requestAnimationFrame(frame);
allTexturesLoaded().then(() => { window.__texReady = true; });
window.__G = G; window.__C = C; window.__setShot = setShot;
