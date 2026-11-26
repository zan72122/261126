import * as THREE from 'three';
import { E, initEngine, initInput, startLoop, applyShot } from './engine.js';
import { loReady, upgradeAll } from './tex.js';
import { makeEnvMaps } from './env.js';
import { buildGame } from './game.js';

const canvas = document.getElementById('c');
initEngine(canvas);
initInput(canvas);
E.env = makeEnvMaps(E.renderer);
const game = buildGame();
window.__game = game; window.__E = E;

loReady().then(() => {
  // compile everything once before showing
  try { E.renderer.compile(E.scene, E.camera); } catch (_) { /* ignore */ }
  startLoop((dt, t) => game.update(dt, t));
  setTimeout(() => document.getElementById('veil').classList.add('off'), 350);
  setTimeout(() => upgradeAll(), 1200);
});
