// hero — the snow that changes shape under the plow blade, and the sled that rides on it.
// API: docs/HERO-SPEC.md. Parts: terrain.js (height map + snow rules + mesh), plow.js, sled.js,
// spray.js, geom.js (parametric shapes), params.js (all numbers). three.js comes in as an argument.
import { FIELD, SNOW } from './params.js';
import { clamp } from './util.js';
import { createGeom } from './geom.js';
import { createTerrain } from './terrain.js';
import { createPlow } from './plow.js';
import { createSled } from './sled.js';
import { createSpray } from './spray.js';

const NO_INPUT = Object.freeze({ t: 0, plowTarget: null, plowDragging: false, sledHold: null });
const stageOf = (h) => (h >= 1.8 ? 3 : h >= 1.2 ? 2 : h >= 0.6 ? 1 : 0);

export function createHero(THREE, opts = {}) {
  const textures = opts.textures || {};
  const shadows = !!opts.shadows;
  const stats = { hillStage: 0, slideCount: 0 };
  const emit = (type, data) => {
    if (type === 'slideEnd') stats.slideCount++;
    try { if (opts.onEvent) opts.onEvent(type, data || {}); } catch (e) { console.error(e); }
  };

  const root = new THREE.Group();
  root.name = 'hero';
  const geom = createGeom(THREE);
  const terrain = createTerrain(THREE, { textures, shadows });
  const spray = createSpray(THREE, { tier: opts.tier });
  const plow = createPlow(THREE, { geom, terrain, textures, shadows, emit, spray });
  const sled = createSled(THREE, { geom, terrain, textures, shadows, emit, spray });
  root.add(terrain.mesh, plow.group, plow.lump, sled.group, spray.mesh);

  // The hill has grown a stage only when it stays that high (a heap that is still slumping does not count).
  let peakT = 0, stageHold = 0;
  function checkPeak(force) {
    const pk = terrain.findPeak(force);
    const stage = stageOf(Math.max(0, pk.y));
    if (force) { stats.hillStage = stage; stageHold = 0; }
    else if (stage > stats.hillStage) {
      if (++stageHold >= 3) { stats.hillStage = stage; stageHold = 0; emit('hillGrow', { stage }); }
    } else stageHold = 0;
  }

  function resetAll(seed, round) {
    terrain.reset(seed | 0);
    stats.slideCount = 0;
    checkPeak(true);
    peakT = SNOW.PEAK_EVERY;
    plow.reset(round | 0);
    sled.reset();
    spray.clear();
  }

  const circles = [{ x: 0, z: 0, r: 1 }, { x: 0, z: 0, r: 1 }];
  function update(dt, input) {
    if (!(dt > 0)) return;
    dt = Math.min(dt, 0.05);
    input = input || NO_INPUT;
    plow.update(dt, input);
    sled.update(dt, input);
    sled.pushOut(plow.colliders(circles));
    terrain.step(dt);
    peakT -= dt;
    if (peakT <= 0) { checkPeak(false); peakT = SNOW.PEAK_EVERY; }
    terrain.flush();
    plow.pose();
    sled.pose(dt);
    spray.update(dt, terrain.heightAt);
  }

  resetAll(opts.seed, opts.round);

  const hero = {
    root,
    FIELD,
    seats: sled.seats,
    pickTargets: [{ id: 'plow', object: plow.pick }, { id: 'sled', object: sled.pick }],
    update,
    slideFromTop: () => sled.slideFromTop(),
    releaseSled: (slide) => sled.releaseSled(slide),
    returnSled: () => sled.returnSled(),
    setHint(id, level) {
      const v = clamp(+level || 0, 0, 1);
      if (id === 'plow') plow.setHint(v); else if (id === 'sled') sled.setHint(v);
    },
    setTier(tier) {
      spray.setTier(tier);
      if (tier === 'low') { plow.setShadows(false); sled.setShadows(false); terrain.mesh.receiveShadow = terrain.mesh.castShadow = false; }
    },
    getPeak() { const p = terrain.peak; return { x: p.x, y: terrain.heightAt(p.x, p.z), z: p.z }; },
    getPlowPose: () => plow.getPose(),
    getSledPose: () => sled.getPose(),
    heightAt: terrain.heightAt,
    normalAt: terrain.normalAt,
    raycastGround: terrain.raycast,
    getStats() {
      const p = terrain.peak;
      return { peakHeight: Math.max(0, terrain.heightAt(p.x, p.z)), hillStage: stats.hillStage, movedVolume: plow.movedVolume, slideCount: stats.slideCount };
    },
    getBudgetInfo() { return { ownTextures: [] }; },   // only the four photo textures from opts are used
    reset({ seed = 0, round = 0 } = {}) { resetAll(seed, round); },
    onContextRestored() { terrain.onContextRestored(); plow.onContextRestored(); spray.onContextRestored(); },
    dispose() {
      terrain.dispose(); plow.dispose(); sled.dispose(); spray.dispose();
      if (root.parent) root.parent.remove(root);
    },
  };
  if (opts.debug) hero.debug = { terrain, plow, sled, spray };
  return hero;
}
