import * as THREE from '../vendor/three.module.min.js';
import { Renderer } from './render.js';
import { World, makeEnvMap, tex } from './world.js';
import { loadPersonData, makePeopleMaterials, makeTopMaterial, Person } from './people.js';
import { Game } from './game.js';

const Q = new URLSearchParams(location.search);
const canvas = document.getElementById('c');
const R = new Renderer(canvas);
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(35, 1, 0.05, 400);

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  R.resize(w, h);
  cam.aspect = w / h; cam.updateProjectionMatrix();
  if (game) game.onResize(w, h);
}

let game = null;
async function boot() {
  scene.environment = makeEnvMap(R.r);
  scene.environmentIntensity = 1.0;
  const world = new World(scene, R.r);
  const T = {
    _x: 0, detSkin: tex('det_skin.png'), detWeave: tex('det_weave.png'), detTwill: tex('det_twill.png'),
    detHair: tex('det_hair.png'), detRubber: tex('det_rubber.png'), detCanvas: tex('det_canvas.png'),
    clothN: tex('cloth_n.png'), clothH: tex('cloth_h.png'),
  };
  const mats = makePeopleMaterials(T);
  const girlData = await loadPersonData('assets/people/girl.bin');
  const mk = (data, opts) => new Person(data, mats, { T, ...opts });
  const girl = mk(girlData, {
    topMat: makeTopMaterial(T, [0.96, 0.9, 0.62], 'g'), scarfMat: makeTopMaterial(T, [1, 1, 1], 'gs'),
    skin: [0.94, 0.73, 0.61], lip: [0.84, 0.44, 0.45], iris: ['#5e371c', '#3d2210', '#1f1208'], browColor: 0x2b1b12,
  });
  scene.add(girl.group);
  game = new Game({ THREE, scene, cam, R, world, T, girl, Q });
  resize();
  window.addEventListener('resize', resize);
  // load the parents in the background (first screen comes faster)
  Promise.all([loadPersonData('assets/people/papa.bin'), loadPersonData('assets/people/mama.bin')]).then(([pd, md]) => {
    const papa = mk(pd, { topMat: makeTopMaterial(T, [1, 1, 1], 'p'), scarfMat: makeTopMaterial(T, [1, 1, 1], 'ps'), skin: [0.86, 0.66, 0.53], lip: [0.78, 0.5, 0.46], iris: ['#4a3020', '#33200f', '#1d120a'], browColor: 0x161110 });
    const mama = mk(md, { topMat: makeTopMaterial(T, [0.72, 0.78, 0.68], 'm'), scarfMat: makeTopMaterial(T, [1, 1, 1], 'ms'), skin: [0.93, 0.75, 0.64], lip: [0.82, 0.45, 0.47], iris: ['#5a3a22', '#3e2616', '#24160d'], browColor: 0x231711 });
    game.addParents(papa, mama);
  });
  let last = performance.now() / 1000, t0 = last, simT = 0;
  const loop = () => {
    const now = performance.now() / 1000; let dt = Math.min(now - last, 1 / 20); last = now;
    if (Q.has('fixdt')) dt = 1 / 30;
    const steps = +(Q.get('steps') || 1);
    for (let i = 0; i < steps; i++) { simT += dt; game.update(dt, simT); }
    R.render(scene, cam, simT, dt);
    requestAnimationFrame(loop);
  };
  loop();
  // reveal once the photo textures are in (or after a few seconds at most)
  let revealed = false; const reveal = () => { if (revealed) return; revealed = true; setTimeout(() => document.getElementById('boot').classList.add('off'), 200); };
  THREE.DefaultLoadingManager.onLoad = reveal; setTimeout(reveal, 6000);
  window.__game = game;
}
boot().catch((e) => { console.error(e); document.body.insertAdjacentHTML('beforeend', `<pre style="position:fixed;bottom:0;left:0;color:#900;z-index:9;font-size:11px">${e.stack}</pre>`); });
