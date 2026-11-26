// Lazy PBR texture sets. Every texture exists immediately as a 1x1 placeholder in its
// average colour (so shaders compile once and the first frame is fast); the real JPG
// replaces the source when it arrives (no shader recompile).
import * as THREE from './three.module.min.js';

const AVG = {"backdrop":[69,55,54],"canopy_c":[181,116,113],"canopy_n":[127,127,251],"canopy_orm":[244,232,1],"cloth2_c":[184,178,162],"cloth2_n":[127,127,249],"cloth2_orm":[235,221,3],"cloth3_c":[171,193,201],"cloth3_n":[127,127,247],"cloth3_orm":[237,222,2],"fibre_c":[242,242,242],"fibre_n":[127,127,226],"fibre_orm":[203,169,3],"gravel_c":[103,94,84],"gravel_n":[128,127,242],"gravel_orm":[214,213,1],"hair_c":[219,219,219],"hair_n":[127,127,243],"hair_orm":[226,124,2],"happi_c":[96,104,126],"happi_n":[127,127,250],"happi_orm":[240,229,2],"pants_c":[86,99,116],"pants_n":[127,127,248],"pants_orm":[238,222,3],"skin_c":[254,242,238],"skin_n":[127,127,250],"skin_orm":[238,142,3],"steel_c":[174,177,181],"steel_n":[127,127,253],"steel_orm":[248,81,249],"sugar_c":[219,219,219],"sugar_n":[127,127,229],"sugar_orm":[212,43,3],"tshirt_c":[215,185,166],"tshirt_n":[127,127,247],"tshirt_orm":[236,221,3],"washi_c":[219,212,197],"washi_n":[127,127,251],"washi_orm":[231,229,2],"wood_c":[113,75,45],"wood_n":[127,127,251],"wood_orm":[249,157,1],"wooddark_c":[68,42,24],"wooddark_n":[127,127,249],"wooddark_orm":[249,158,1]};

const queue = [];
const cache = new Map();
let maxAniso = 4;
export function setAniso(a) { maxAniso = Math.min(8, a); }

function placeholder(name) {
  const c = document.createElement('canvas'); c.width = c.height = 1;
  const g = c.getContext('2d');
  const a = AVG[name] || [128, 128, 128];
  g.fillStyle = `rgb(${a[0]},${a[1]},${a[2]})`; g.fillRect(0, 0, 1, 1);
  return c;
}

// one source per file, textures share it (repeat differs per use)
const sources = new Map();
function getSource(name) {
  let s = sources.get(name);
  if (!s) {
    s = { name, users: [], loaded: false, img: null };
    sources.set(name, s);
    queue.push(s);
  }
  return s;
}

export function tex(name, repeat = 1, srgb = false) {
  const key = name + '|' + repeat + '|' + srgb;
  if (cache.has(key)) return cache.get(key);
  const t = new THREE.Texture(placeholder(name));
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (Array.isArray(repeat)) t.repeat.set(repeat[0], repeat[1]); else t.repeat.set(repeat, repeat);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = maxAniso;
  t.needsUpdate = true;
  const s = getSource(name);
  s.users.push(t);
  if (s.loaded) { t.source = new THREE.Source(s.img); t.needsUpdate = true; }
  cache.set(key, t);
  return t;
}

// a full PBR set: {map, normalMap, roughnessMap, aoMap, metalnessMap}
export function pbr(base, repeat = 1, opts = {}) {
  const orm = tex(base + '_orm', repeat);
  const o = {
    map: tex(base + '_c', repeat, true),
    normalMap: tex(base + '_n', repeat),
    roughnessMap: orm,
    aoMap: orm,
  };
  if (opts.metal) o.metalnessMap = orm;
  return o;
}

// loads queued sources a few at a time, after the first frame
export function startLoading(onProgress) {
  let i = 0, active = 0, done = 0;
  return new Promise(res => {
    const next = () => {
      while (active < 3 && i < queue.length) {
        const s = queue[i++]; active++;
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          s.loaded = true; s.img = img;
          for (const t of s.users) { t.dispose(); t.source = new THREE.Source(img); t.needsUpdate = true; }
          active--; done++; onProgress && onProgress(done / queue.length); next();
        };
        img.onerror = () => { active--; done++; next(); };
        img.src = 'tex/' + s.name + '.jpg';
      }
      if (done >= queue.length && active === 0) res();
    };
    next();
  });
}

// Canvas helper for runtime-painted textures (iris, sign board, bokeh sprite...)
export function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = maxAniso;
  return t;
}
