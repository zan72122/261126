// A few flying snow crumbs (one InstancedMesh): blade, wheels, sled, heaps.
import { SPRAY } from './params.js';

export function createSpray(THREE, { tier }) {
  const geo = new THREE.IcosahedronGeometry(SPRAY.R, 0);
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x7f8ea3 });
  const mesh = new THREE.InstancedMesh(geo, mat, SPRAY.MAX);
  mesh.name = 'hero.spray';
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  const parts = Array.from({ length: SPRAY.MAX }, () => ({ life: 0, max: 1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, s: 1 }));
  const m4 = new THREE.Matrix4();
  let max = tier === 'low' ? SPRAY.MAX_LOW : SPRAY.MAX, next = 0, live = 0;
  mesh.count = max;
  for (let i = 0; i < SPRAY.MAX; i++) mesh.setMatrixAt(i, m4.makeScale(0, 0, 0));

  // n crumbs from (x, y, z), thrown up and outward by `spread` m/s, plus a drift (vx, vz)
  function burst(x, y, z, n, spread, vx = 0, vz = 0) {
    if (!Number.isFinite(x + y + z + spread + vx + vz)) return;
    if (max < SPRAY.MAX) n = Math.ceil(n * 0.5);
    for (let i = 0; i < n; i++) {
      const p = parts[next];
      next = (next + 1) % max;
      p.max = p.life = 0.6 + Math.random() * 0.6;
      p.x = x + (Math.random() - 0.5) * 0.2; p.y = y; p.z = z + (Math.random() - 0.5) * 0.2;
      p.vx = vx + (Math.random() - 0.5) * spread; p.vy = 0.8 + Math.random() * spread; p.vz = vz + (Math.random() - 0.5) * spread;
      p.s = 0.6 + Math.random() * 0.9;
    }
    live = max;
  }

  function update(dt, heightAt) {
    if (live <= 0) return;
    live = 0;
    for (let i = 0; i < max; i++) {
      const p = parts[i];
      if (p.life > 0) {
        p.life -= dt; p.vy -= 6 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        if (p.vy < 0 && p.y < heightAt(p.x, p.z)) p.life = 0;   // lands in the snow
      }
      if (p.life > 0) {
        const s = p.s * Math.min(1, p.life * 2.5) * Math.min(1, (p.max - p.life) * 12 + 0.3);
        m4.makeScale(s, s, s).setPosition(p.x, p.y, p.z);
        live++;
      } else m4.makeScale(0, 0, 0);
      mesh.setMatrixAt(i, m4);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  return {
    mesh, burst, update,
    clear() { for (const p of parts) p.life = 0; live = 1; },
    setTier(t) {
      max = t === 'low' ? SPRAY.MAX_LOW : SPRAY.MAX;
      for (let i = max; i < SPRAY.MAX; i++) parts[i].life = 0;
      mesh.count = max; next = 0;
    },
    onContextRestored() { mesh.instanceMatrix.needsUpdate = true; },
    dispose() { geo.dispose(); mat.dispose(); mesh.dispose(); },
  };
}
