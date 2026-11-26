import * as THREE from 'three';
import { scene, camera, resize, render, updateShot, startTextureLoading, perfSample, input, view } from './core.js';
import { setupEnvironment, buildLandscape } from './env.js';
import { initFx, setFxScale } from './fx.js';
import { audioUnlock } from './audio.js';
import { Game } from './game.js';
import * as CORE from './core.js';

let game;
try {
  setupEnvironment();
  buildLandscape();
  initFx();
  game = new Game();
} catch (e) { window.__err = String(e && e.stack || e); throw e; }
input.handlers = {
  down: i => { audioUnlock(); game.handlers && game.handlers.down && game.handlers.down(i); },
  move: i => game.handlers && game.handlers.move && game.handlers.move(i),
  up: i => game.handlers && game.handlers.up && game.handlers.up(i),
};
window.addEventListener('resize', () => { resize(); game.reframe && game.reframe(); setFxScale(view.h * view.dpr / (2 * Math.tan(camera.fov * Math.PI / 360))); });
resize();
setFxScale(view.h * view.dpr / (2 * Math.tan(camera.fov * Math.PI / 360)));
startTextureLoading(p => { if (p >= 1) window.__texDone = true; });
const splash = document.getElementById('splash');
let last = performance.now(), frames = 0;
function loop(t) {
  const dt = Math.min(0.05, (t - last) / 1000); last = t;
  try {
    const sub = window.__timeScale || 1;
    for (let i = 0; i < sub; i++) { game.update(dt); updateShot(dt); }
    render(t / 1000);
  } catch (e) { window.__err = String(e && e.stack || e); console.error(e); }
  if (++frames === 2) { splash.style.opacity = 0; setTimeout(() => splash.remove(), 900); window.__ready = true; }
  perfSample(dt, t / 1000);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
window.__game = game; window.THREE = THREE; window.__core = CORE;
