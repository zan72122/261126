// ?debug=1 overlay: tier, canvas size, fps (avg / p95), draw calls, triangles (hero / shell),
// textures and estimated GPU memory, errors. Also used by the smoke test via window.__game.measure().

import * as THREE from 'three';

export const errors = [];
export function captureErrors() {
  const push = (m) => { errors.push(String(m).slice(0, 200)); if (errors.length > 20) errors.shift(); };
  window.addEventListener('error', (e) => push(e.message || e.error));
  window.addEventListener('unhandledrejection', (e) => push('promise: ' + (e.reason && e.reason.message || e.reason)));
  const ce = console.error.bind(console);
  console.error = (...a) => { push(a.map(String).join(' ')); ce(...a); };
}

const MiB = 1024 * 1024;

// Visible triangles under root. skipAnimals: do not count the shell's animals sitting on the hero's seats
// (they belong to the shell budget; hero-notes §6.3).
function triCount(root, skipAnimals = false) {
  let n = 0;
  (function walk(o) {
    if (!o.visible) return;
    if (skipAnimals && o.name.startsWith('animal.')) return;
    if ((o.isMesh || o.isInstancedMesh) && o.geometry && !(o.material && o.material.visible === false)) {
      const g = o.geometry;
      let t = (g.index ? g.index.count : g.attributes.position.count) / 3;
      if (g.drawRange && g.drawRange.count !== Infinity) t = Math.min(t, g.drawRange.count / 3);
      n += t * (o.isInstancedMesh ? o.count : 1);
    }
    for (const c of o.children) walk(c);
  })(root);
  return Math.round(n);
}

function texBytes(t) {
  const img = t.image;
  const w = (img && (img.width || img.videoWidth)) || 0, h = (img && (img.height || img.videoHeight)) || 0;
  return { w, h, bytes: w * h * 4 * (t.generateMipmaps !== false && t.minFilter !== 1006 ? 4 / 3 : 1) };
}

export function measure({ renderer, scene, hero, tier }) {
  const textures = new Map(), geos = new Set();
  scene.traverse((o) => {
    if (o.geometry) geos.add(o.geometry);
    if (o.isInstancedMesh) geos.add({ attributes: { m: o.instanceMatrix, c: o.instanceColor } });
    const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of mats) for (const k of ['map', 'normalMap', 'roughnessMap', 'emissiveMap', 'alphaMap', 'aoMap', 'bumpMap']) if (m[k]) textures.set(m[k].uuid, m[k]);
    for (const m of mats) if (m.uniforms) for (const u of Object.values(m.uniforms)) if (u && u.value && u.value.isTexture) textures.set(u.value.uuid, u.value);
  });
  let texMem = 0;
  const texList = [];
  for (const t of textures.values()) { const b = texBytes(t); texMem += b.bytes; texList.push(`${t.name || ''}${b.w}x${b.h}`); }
  const own = (hero.getBudgetInfo && hero.getBudgetInfo().ownTextures) || [];
  for (const t of own) texMem += t.bytes || 0;
  let geoMem = 0;
  for (const g of geos) {
    for (const a of Object.values(g.attributes || {})) if (a && a.array) geoMem += a.array.byteLength;
    if (g.index) geoMem += g.index.array.byteLength;
  }
  const db = renderer.getDrawingBufferSize(new THREE.Vector2());
  const px = db.x * db.y;
  const fbMem = px * (4 + 4) + px * 4 + (tier.msaa ? px * 8 * 4 : 0);
  const shadowMem = renderer.shadowMap.enabled && tier.shadows ? tier.shadowSize * tier.shadowSize * 8 : 0;
  return {
    heroTris: triCount(hero.root, true),
    totalTris: triCount(scene),
    textures: textures.size + own.length, texList,
    texMiB: texMem / MiB, geoMiB: geoMem / MiB, fbMiB: fbMem / MiB, shadowMiB: shadowMem / MiB,
    gpuMiB: (texMem + geoMem + fbMem + shadowMem) / MiB,
    canvas: `${db.x}x${db.y}`,
  };
}

export function createOverlay() {
  const el = document.createElement('pre');
  el.id = 'debug';
  document.body.appendChild(el);
  return {
    show(s) {
      el.textContent =
        `tier ${s.tier}  canvas ${s.m.canvas} (css ${s.css.w}x${s.css.h})  dpr ${s.dpr.toFixed(2)}  q${s.q}\n` +
        `cam ${s.cam.shot}  subject ${(s.cam.share * 100).toFixed(0)}% of short side  view ${s.cam.shortM.toFixed(1)}m  d ${s.cam.d.toFixed(1)}m  fov ${s.cam.fov.toFixed(0)}${s.cam.portrait ? ' portrait' : ''}\n` +
        `fps ${s.fps.avg.toFixed(0)} avg / ${s.fps.p95.toFixed(0)} p95  boot ${s.bootMs.toFixed(0)}ms\n` +
        `draw ${s.calls} (shadow incl.)  tris ${s.tris} frame\n` +
        `scene tris ${s.m.totalTris} = hero ${s.m.heroTris} + shell ${s.m.totalTris - s.m.heroTris}\n` +
        `tex ${s.m.textures} (${s.m.texMiB.toFixed(1)}MiB) geo ${s.m.geoMiB.toFixed(1)}MiB fb ${s.m.fbMiB.toFixed(1)}MiB sh ${s.m.shadowMiB.toFixed(1)}MiB\n` +
        `GPU est ${s.m.gpuMiB.toFixed(1)} MiB / 128\n` +
        `scene ${s.scene}  ${s.ctx}\n` +
        `errors ${errors.length}${errors.length ? '\n' + errors.slice(-3).join('\n') : ''}`;
    },
  };
}
