// Texture sets: albedo(_c), normal(_n), ORM(_r: R=AO, G=roughness).
// A tiny 128px set loads first; the 512–1024px set is swapped in afterwards.
import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const sets = {};
let maxAniso = 4;
let pendingLo = 0; const loWaiters = [];
function loDone() { pendingLo--; if (pendingLo <= 0) while (loWaiters.length) loWaiters.shift()(); }
export function loReady() { return new Promise((r) => { if (pendingLo <= 0) r(); else loWaiters.push(r); }); }

export function setAniso(a) { maxAniso = Math.min(8, a); }

function prep(t, srgb, rep) {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = maxAniso;
  if (rep) t.repeat.set(rep[0], rep[1]);
  return t;
}

// Returns {map, normalMap, ormMap} THREE.Texture objects that are later upgraded in place.
export function texSet(name) {
  if (sets[name]) return sets[name];
  const s = { all: { map: [], normalMap: [], ormMap: [] } };
  for (const [k, suf, srgb] of [['map', 'c', true], ['normalMap', 'n', false], ['ormMap', 'r', false]]) {
    const t = prep(new THREE.Texture(), srgb);
    s[k] = t; s.all[k].push(t);
    const img = new Image();
    pendingLo++; img.onerror = loDone;
    img.onload = () => { loDone(); if (t.image && t.image.width > 128) return; for (const x of s.all[k]) { if (!(x.image && x.image.width > 128)) { x.image = img; x.needsUpdate = true; } } };
    img.src = `tex/lo/${name}_${suf}.jpg`;
  }
  sets[name] = s;
  return s;
}

export function upgradeAll(onDone) {
  const names = Object.keys(sets);
  let n = 0, total = names.length * 3;
  if (!total) { onDone && onDone(); return; }
  // stagger so the GPU uploads do not hitch a single frame
  let i = 0;
  const queue = [];
  for (const name of names) for (const [k, suf] of [['map', 'c'], ['normalMap', 'n'], ['ormMap', 'r']]) queue.push([name, k, suf]);
  function next() {
    if (i >= queue.length) return;
    const [name, k, suf] = queue[i++];
    const img = new Image();
    img.onload = img.onerror = () => {
      if (img.naturalWidth) for (const t of sets[name].all[k]) { t.dispose(); t.image = img; t.needsUpdate = true; }
      n++; if (n === total && onDone) onDone();
      setTimeout(next, 30);
    };
    img.src = `tex/hi/${name}_${suf}.jpg`;
  }
  for (let j = 0; j < 3; j++) next();
}

// A PBR standard/physical material from a texture set. Texture objects are cloned per repeat.
export function pbr(name, opt = {}) {
  const s = texSet(name);
  const rep = opt.repeat || [1, 1];
  const clone = (t, k) => {
    if (rep[0] === 1 && rep[1] === 1 && !opt.offset) return t;
    const c = t.clone(); c.repeat.set(rep[0], rep[1]);
    if (opt.offset) c.offset.set(opt.offset[0], opt.offset[1]);
    s.all[k].push(c);
    return c;
  };
  const P = opt.physical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
  const m = new P({
    map: clone(s.map, 'map'), normalMap: clone(s.normalMap, 'normalMap'), roughnessMap: null, aoMap: null,
    color: opt.color !== undefined ? new THREE.Color(opt.color) : new THREE.Color(1, 1, 1),
    roughness: opt.roughness !== undefined ? opt.roughness : 1, metalness: opt.metalness || 0,
    normalScale: new THREE.Vector2(opt.normal || 1, opt.normal || 1),
  });
  const orm = clone(s.ormMap, 'ormMap');
  m.roughnessMap = orm; m.aoMap = orm; m.aoMapIntensity = opt.ao !== undefined ? opt.ao : 1;
  if (opt.side) m.side = opt.side;
  if (opt.physical) {
    for (const k of ['sheen', 'sheenRoughness', 'clearcoat', 'clearcoatRoughness', 'anisotropy', 'specularIntensity', 'ior'])
      if (opt[k] !== undefined) m[k] = opt[k];
    if (opt.sheenColor) m.sheenColor = new THREE.Color(opt.sheenColor);
  }
  if (opt.noMap) m.map = null;
  return m;
}

// Canvas helper
export function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = maxAniso;
  return t;
}
