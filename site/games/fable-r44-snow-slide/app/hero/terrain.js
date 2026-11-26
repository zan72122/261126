// Snow terrain: two maps of 97 x 97 values and one grid mesh that is updated only where something changed.
//   H = height of the snow surface
//   B = height of the firm (pressed) snow under it, B <= H. H - B is the loose snow lying on top.
// "Packed" (0..1) is derived from the loose depth: 1 where the firm snow is (nearly) bare (blade lane, sled
// track), 0 under a full cover of loose snow. Loose snow is what the blade pushes, wheels sink through and
// avalanches at 35 degrees; firm snow holds 45 degrees and the blade only shaves it.
// Operations: add, repose-angle slumping, firm smoothing, pressing, snowfall refill.
import { FIELD, GRID, SNOW } from './params.js';
import { clamp, mulberry32, smoothstep } from './util.js';

const { N, V, CELL } = GRID;
const HALF = FIELD.half;
const CELL2 = CELL * CELL;
const SQRT2 = Math.SQRT2;

// Fragment chunk: mix fresh and packed snow photos by the packed value, shade hollows a little blue.
const MAP_CHUNK = /* glsl */ `
  float snowPk = clamp(vSnow.x, 0.0, 1.0);
  #ifdef USE_MAP
    vec3 snowF = texture2D(map, vMapUv).rgb;
    vec3 snowP = texture2D(uPackedMap, vMapUv * 0.8).rgb;
    float snowL = dot(snowF, vec3(0.3333));
    // a wide ramp, broken up by the snow grain: the packed value is interpolated over 12.5 cm cells and a
    // steep threshold showed their staircase once the camera came close
    snowPk = smoothstep(0.02, 0.98, snowPk + (snowL - 0.7) * 7.0 * snowPk * (1.0 - snowPk));
    vec3 snowC = mix(snowF * 1.16, snowP * vec3(0.74, 0.87, 1.06), snowPk);
  #else
    vec3 snowC = mix(vec3(0.95), vec3(0.72, 0.84, 1.0), snowPk);
  #endif
  float snowCav = vSnow.y;
  snowC *= mix(vec3(1.0), vec3(0.74, 0.84, 1.0), clamp(snowCav, 0.0, 1.0));
  snowC *= 1.0 + 0.06 * clamp(-snowCav, 0.0, 1.0);
  diffuseColor.rgb *= snowC;
`;

export function createTerrain(THREE, { textures = {}, shadows = false } = {}) {
  const H = new Float32Array(V * V);     // snow surface height
  const B = new Float32Array(V * V);     // firm base height (<= H)
  const edge = new Uint8Array(V * V);    // outer ring: pinned at y = 0 (meets the shell's ground and bank)
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) if (i === 0 || j === 0 || i === N || j === N) edge[j * V + i] = 1;
  const toI = (x) => (x + HALF) / CELL;
  const toX = (i) => -HALF + i * CELL;
  const clampI = (i) => (i < 0 ? 0 : i > N ? N : i);

  // ---------------------------------------------------------------- queries
  function heightAt(x, z) {
    if (!(x >= -HALF && x <= HALF && z >= -HALF && z <= HALF)) return 0;
    const fx = (x + HALF) / CELL, fz = (z + HALF) / CELL;
    let i0 = fx | 0, j0 = fz | 0;
    if (i0 >= N) i0 = N - 1;
    if (j0 >= N) j0 = N - 1;
    const tx = fx - i0, tz = fz - j0, k = j0 * V + i0;
    const a = H[k], b = H[k + 1], c = H[k + V], d = H[k + V + 1];
    return (a + (b - a) * tx) * (1 - tz) + (c + (d - c) * tx) * tz;
  }
  // packed 0..1 of cell k: 1 = firm snow under at most LOOSE_LOOK[0] of loose snow, 0 = LOOSE_LOOK[1] or more
  const LOOK0 = SNOW.LOOSE_LOOK[0], LOOK_INV = 1 / (SNOW.LOOSE_LOOK[1] - SNOW.LOOSE_LOOK[0]);
  function packedOf(k) {
    const t = (H[k] - B[k] - LOOK0) * LOOK_INV;
    return t <= 0 ? 1 : t >= 1 ? 0 : 1 - t * t * (3 - 2 * t);
  }
  function packedAt(x, z) {
    return packedOf(clampI(Math.round(toI(z))) * V + clampI(Math.round(toI(x))));
  }
  // height of the firm snow (what carries wheels and stops the blade)
  function firmAt(x, z) {
    if (!(x >= -HALF && x <= HALF && z >= -HALF && z <= HALF)) return -SNOW.COVER;
    const fx = (x + HALF) / CELL, fz = (z + HALF) / CELL;
    let i0 = fx | 0, j0 = fz | 0;
    if (i0 >= N) i0 = N - 1;
    if (j0 >= N) j0 = N - 1;
    const tx = fx - i0, tz = fz - j0, k = j0 * V + i0;
    const a = B[k], b = B[k + 1], c = B[k + V], d = B[k + V + 1];
    return (a + (b - a) * tx) * (1 - tz) + (c + (d - c) * tx) * tz;
  }
  // slope of the surface measured over +-e metres (out.x = dh/dx, out.z = dh/dz)
  function gradAt(x, z, e, out) {
    out.x = (heightAt(x + e, z) - heightAt(x - e, z)) / (2 * e);
    out.z = (heightAt(x, z + e) - heightAt(x, z - e)) / (2 * e);
    return out;
  }
  const _g = { x: 0, z: 0 };
  function normalAt(x, z, out) {
    out = out || new THREE.Vector3();
    gradAt(x, z, CELL, _g);
    const l = Math.sqrt(_g.x * _g.x + 1 + _g.z * _g.z);
    return out.set(-_g.x / l, 1 / l, -_g.z / l);
  }

  // ---------------------------------------------------------------- mesh
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(V * V * 3), nor = new Float32Array(V * V * 3), uv = new Float32Array(V * V * 2), snow = new Float32Array(V * V * 2);
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
    const k = j * V + i;
    pos[k * 3] = toX(i); pos[k * 3 + 2] = toX(j);
    nor[k * 3 + 1] = 1;
    uv[k * 2] = (i * CELL) / GRID.UV_PERIOD; uv[k * 2 + 1] = (j * CELL) / GRID.UV_PERIOD;
  }
  const index = new Uint16Array(N * N * 6);
  for (let j = 0, q = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const a = j * V + i, b = a + 1, c = a + V, d = c + 1;
    if ((i + j) & 1) { index[q++] = a; index[q++] = c; index[q++] = b; index[q++] = b; index[q++] = c; index[q++] = d; }
    else { index[q++] = a; index[q++] = c; index[q++] = d; index[q++] = a; index[q++] = d; index[q++] = b; }
  }
  geo.setIndex(new THREE.BufferAttribute(index, 1));
  const aPos = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage);
  const aNor = new THREE.BufferAttribute(nor, 3).setUsage(THREE.DynamicDrawUsage);
  const aSnow = new THREE.BufferAttribute(snow, 2).setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', aPos);
  geo.setAttribute('normal', aNor);
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setAttribute('aSnow', aSnow);
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 1, 0), 9.5);
  geo.boundingBox = new THREE.Box3(new THREE.Vector3(-HALF, FIELD.groundY, -HALF), new THREE.Vector3(HALF, FIELD.maxY, HALF));

  const mat = new THREE.MeshStandardMaterial({ map: textures.snowFresh || null, roughness: 0.93, metalness: 0 });
  const uniforms = { uPackedMap: { value: textures.snowPacked || textures.snowFresh || null } };
  // Only read by the shell's debug overlay (it lists textures found in material.uniforms); three ignores it here.
  mat.uniforms = uniforms;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uPackedMap = uniforms.uPackedMap;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec2 aSnow;\nvarying vec2 vSnow;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSnow = aSnow;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D uPackedMap;\nvarying vec2 vSnow;')
      .replace('#include <map_fragment>', MAP_CHUNK)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.4, snowPk);');
  };
  mat.customProgramCacheKey = () => 'hero-snow-terrain-1';
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'hero.terrain';
  mesh.receiveShadow = !!shadows;
  mesh.castShadow = !!shadows;      // hills and heaps shade the snow behind them (one more draw in the shadow pass)

  // dirty spans per row; flush() recomputes position / normal / shading only inside them
  const rowMin = new Int16Array(V).fill(V), rowMax = new Int16Array(V).fill(-1);
  let anyDirty = false;
  function markDirty(i0, j0, i1, j1) {
    i0 = clampI(i0 - 1); j0 = clampI(j0 - 1); i1 = clampI(i1 + 1); j1 = clampI(j1 + 1);
    for (let j = j0; j <= j1; j++) { if (i0 < rowMin[j]) rowMin[j] = i0; if (i1 > rowMax[j]) rowMax[j] = i1; }
    anyDirty = true;
  }
  const CAV = 0.06 / CELL2;
  function flush() {
    if (!anyDirty) return;
    anyDirty = false;
    let jA = -1, jB = -1;
    for (let j = 0; j <= N; j++) {
      const iB = rowMax[j];
      if (iB < 0) continue;
      const iA = rowMin[j];
      rowMin[j] = V; rowMax[j] = -1;
      if (jA < 0) jA = j;
      jB = j;
      const up = j > 0 ? V : 0, dn = j < N ? V : 0;
      for (let i = iA; i <= iB; i++) {
        const k = j * V + i;
        let h = H[k];
        if (!(h >= FIELD.groundY)) h = H[k] = h < FIELD.groundY ? FIELD.groundY : 0;   // also catches NaN
        else if (h > FIELD.maxY) h = H[k] = FIELD.maxY;
        const hl = H[i > 0 ? k - 1 : k], hr = H[i < N ? k + 1 : k], hu = H[k - up], hd = H[k + dn];
        const nx = hl - hr, nz = hu - hd, ny = 2 * CELL;
        const inv = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);
        pos[k * 3 + 1] = h;
        nor[k * 3] = nx * inv; nor[k * 3 + 1] = ny * inv; nor[k * 3 + 2] = nz * inv;
        let b = B[k];
        if (!(b <= h)) b = B[k] = h;                                         // also catches NaN
        else if (b < FIELD.groundY) b = B[k] = FIELD.groundY;
        const t = (h - b - LOOK0) * LOOK_INV;
        snow[k * 2] = t <= 0 ? 1 : t >= 1 ? 0 : 1 - t * t * (3 - 2 * t);
        snow[k * 2 + 1] = clamp((hl + hr + hu + hd - 4 * h) * CAV, -1, 1);
      }
    }
    if (jA < 0) return;
    const rows = jB - jA + 1;
    aPos.clearUpdateRanges(); aPos.addUpdateRange(jA * V * 3, rows * V * 3); aPos.needsUpdate = true;
    aNor.clearUpdateRanges(); aNor.addUpdateRange(jA * V * 3, rows * V * 3); aNor.needsUpdate = true;
    aSnow.clearUpdateRanges(); aSnow.addUpdateRange(jA * V * 2, rows * V * 2); aSnow.needsUpdate = true;
  }

  // ---------------------------------------------------------------- slumping (angle of repose)
  // Regions where snow was just added or cut. Each frame a few passes move the excess over the
  // repose slope to the lower neighbour (volume is kept), so heaps visibly slump and never keep cliffs.
  const active = [];
  function disturb(i0, j0, i1, j1) {
    i0 = Math.max(0, i0 - 2); j0 = Math.max(0, j0 - 2); i1 = Math.min(N, i1 + 2); j1 = Math.min(N, j1 + 2);
    for (const a of active) {
      if (i0 <= a.i1 && i1 >= a.i0 && j0 <= a.j1 && j1 >= a.j0) {
        a.i0 = Math.min(a.i0, i0); a.j0 = Math.min(a.j0, j0); a.i1 = Math.max(a.i1, i1); a.j1 = Math.max(a.j1, j1); a.quiet = 0;
        return;
      }
    }
    if (active.length >= 4) {
      const a = active[0];
      a.i0 = Math.min(a.i0, i0); a.j0 = Math.min(a.j0, j0); a.i1 = Math.max(a.i1, i1); a.j1 = Math.max(a.j1, j1); a.quiet = 0;
    } else active.push({ i0, j0, i1, j1, quiet: 0 });
  }
  const moved = { i0: 0, j0: 0, i1: 0, j1: 0, any: false };
  function flow(a, b, dist, i, j) {
    const d = H[a] - H[b];
    // loose snow on the higher cell slides at the fresh angle, bare firm snow holds the packed angle
    const hi = d > 0 ? a : b, loose = (H[hi] - B[hi]) / 0.03;
    const lim = (SNOW.TAN_PACKED - (SNOW.TAN_PACKED - SNOW.TAN_FRESH) * (loose > 1 ? 1 : loose)) * CELL * dist;
    let m;
    if (d > lim + 1e-4) m = (d - lim) * SNOW.RELAX_RATE;
    else if (d < -lim - 1e-4) m = (d + lim) * SNOW.RELAX_RATE;
    else return;
    // snow goes from the higher to the lower cell and arrives loose; the pinned edge ring neither rises nor sinks
    if (!edge[a]) { H[a] -= m; if (B[a] > H[a]) B[a] = H[a]; }
    if (!edge[b]) { H[b] += m; if (B[b] > H[b]) B[b] = H[b]; }
    if (!moved.any) { moved.i0 = moved.i1 = i; moved.j0 = moved.j1 = j; moved.any = true; }
    else { if (i < moved.i0) moved.i0 = i; else if (i > moved.i1) moved.i1 = i; if (j < moved.j0) moved.j0 = j; else if (j > moved.j1) moved.j1 = j; }
  }
  function relaxCell(i, j) {
    const k = j * V + i;
    if (i < N) flow(k, k + 1, 1, i, j);
    if (j < N) {
      flow(k, k + V, 1, i, j);
      if (i < N) flow(k, k + V + 1, SQRT2, i, j);
      if (i > 0) flow(k, k + V - 1, SQRT2, i, j);
    }
  }
  let sweep = 0;
  function relaxRegions() {
    for (let n = active.length - 1; n >= 0; n--) {
      const a = active[n];
      moved.any = false;
      for (let pass = 0; pass < SNOW.RELAX_PASSES; pass++) {
        if ((sweep++ & 1) === 0) { for (let j = a.j0; j <= a.j1; j++) for (let i = a.i0; i <= a.i1; i++) relaxCell(i, j); }
        else { for (let j = a.j1; j >= a.j0; j--) for (let i = a.i1; i >= a.i0; i--) relaxCell(i, j); }
      }
      if (moved.any) {
        // follow the moving snow: next frame only look where something moved (plus a margin)
        a.i0 = Math.max(0, moved.i0 - 3); a.j0 = Math.max(0, moved.j0 - 3); a.i1 = Math.min(N, moved.i1 + 4); a.j1 = Math.min(N, moved.j1 + 4);
        a.quiet = 0;
        markDirty(a.i0, a.j0, a.i1, a.j1);
      } else if (++a.quiet > 1) active.splice(n, 1);
    }
  }

  // ---------------------------------------------------------------- adding snow
  const buf = new Float32Array(4096);
  // pack = share of the new snow that arrives firm (0 = loose powder, 1 = pressed)
  function addTo(k, dh, pack) {
    const h = H[k] + dh;
    H[k] = h > FIELD.maxY ? FIELD.maxY : h;
    if (pack > 0) B[k] += dh * pack;
    if (B[k] > H[k]) B[k] = H[k];
  }
  // Adds exactly `vol` m3 shaped by weightAt(x, z) >= 0 over the cell rectangle. Returns the volume added.
  function addShape(i0, j0, i1, j1, weightAt, vol, pack = 0) {
    i0 = Math.max(1, i0); j0 = Math.max(1, j0); i1 = Math.min(N - 1, i1); j1 = Math.min(N - 1, j1);
    if (!(vol > 1e-7) || i1 < i0 || j1 < j0 || (i1 - i0 + 1) * (j1 - j0 + 1) > buf.length) return 0;
    let sum = 0, n = 0;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const w = weightAt(toX(i), toX(j));
      sum += buf[n++] = w > 0 ? w : 0;
    }
    if (!(sum > 1e-9)) return 0;
    const amp = vol / (sum * CELL2);
    n = 0;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const w = buf[n++];
      if (w > 0) addTo(j * V + i, amp * w, pack);
    }
    markDirty(i0, j0, i1, j1);
    disturb(i0, j0, i1, j1);
    return vol;
  }
  // A round heap (Gaussian) of exactly `vol` m3 around (x, z).
  function deposit(x, z, vol, sigma, pack = 0) {
    if (!(vol > 1e-7) || !Number.isFinite(x + z)) return 0;
    const r = Math.min(15, Math.max(1, Math.ceil((sigma * 2.6) / CELL)));
    const ci = Math.round(toI(clamp(x, -HALF + 0.2, HALF - 0.2))), cj = Math.round(toI(clamp(z, -HALF + 0.2, HALF - 0.2)));
    const i0 = Math.max(1, ci - r), j0 = Math.max(1, cj - r), i1 = Math.min(N - 1, ci + r), j1 = Math.min(N - 1, cj + r);
    const inv = 1 / (2 * sigma * sigma);
    let sum = 0, n = 0;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const dx = toX(i) - x, dz = toX(j) - z;
      sum += buf[n++] = Math.exp(-(dx * dx + dz * dz) * inv);
    }
    if (!(sum > 1e-9)) return 0;
    const amp = vol / (sum * CELL2);
    n = 0;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) addTo(j * V + i, amp * buf[n++], pack);
    markDirty(i0, j0, i1, j1);
    disturb(i0, j0, i1, j1);
    return vol;
  }
  // The same heap, but swelling over `dur` seconds (a visible "poff").
  const pours = [];
  function pour(x, z, vol, sigma, pack, dur) {
    if (vol > 1e-6) pours.push({ x, z, sigma, pack, left: vol, rate: vol / Math.max(dur, 0.02) });
  }

  // Bare firm snow evens itself out: volume-keeping smoothing weighted by the packed value.
  function smoothDisc(x, z, radius, strength) {
    const ci = toI(x), cj = toI(z), r = radius / CELL, r2 = r * r;
    const i0 = Math.max(1, Math.floor(ci - r)), i1 = Math.min(N - 1, Math.ceil(ci + r));
    const j0 = Math.max(1, Math.floor(cj - r)), j1 = Math.min(N - 1, Math.ceil(cj + r));
    if (i1 < i0 || j1 < j0) return;
    const s = Math.min(1, strength) * 0.24;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const di = i - ci, dj = j - cj, d2 = di * di + dj * dj;
      if (d2 > r2) continue;
      const k = j * V + i, w = s * (1 - d2 / r2), pk = packedOf(k);
      if (pk <= 0) continue;
      if (i < i1) { const f = w * Math.min(pk, packedOf(k + 1)) * (H[k] - H[k + 1]); H[k] -= f; H[k + 1] += f; B[k] -= f; B[k + 1] += f; }
      if (j < j1) { const f = w * Math.min(pk, packedOf(k + V)) * (H[k] - H[k + V]); H[k] -= f; H[k + V] += f; B[k] -= f; B[k + V] += f; }
    }
    markDirty(i0, j0, i1, j1);
  }

  // Pressing snow (wheels, pushed heaps): the loose snow inside a disc turns firm.
  function packDisc(x, z, radius, amount) {
    const ci = toI(x), cj = toI(z), r = radius / CELL, r2 = r * r;
    const i0 = Math.max(1, Math.floor(ci - r)), i1 = Math.min(N - 1, Math.ceil(ci + r));
    const j0 = Math.max(1, Math.floor(cj - r)), j1 = Math.min(N - 1, Math.ceil(cj + r));
    if (i1 < i0 || j1 < j0) return;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const di = i - ci, dj = j - cj, d2 = di * di + dj * dj;
      if (d2 > r2) continue;
      const k = j * V + i;
      B[k] += (H[k] - B[k]) * Math.min(1, amount * (1 - d2 / r2));
    }
    markDirty(i0, j0, i1, j1);
  }

  // Every quarter second, over the whole field:
  //  - snowfall: places below y = 0 slowly fill up again with loose snow (the only source of new snow);
  //  - setting: a heap that is left alone turns firm inside within a few seconds and keeps a loose shell,
  //    so the next load can be pushed up onto it and it grows, instead of being shoved away.
  let refillT = 0;
  function refill(dt) {
    refillT += dt;
    if (refillT < SNOW.REFILL_EVERY) return;
    const add = SNOW.REFILL_RATE * refillT, set = 1 - Math.exp(-refillT / SNOW.SET_TIME);
    refillT = 0;
    for (let j = 1; j < N; j++) {
      let a = -1, b = -1;
      for (let i = 1, k = j * V + 1; i < N; i++, k++) {
        const h = H[k];
        if (h < 0) {
          H[k] = Math.min(0, h + add);    // new loose snow; the firm base stays
          if (a < 0) a = i;
          b = i;
        } else if (h > SNOW.SET_ABOVE) {
          const extra = h - B[k] - SNOW.COVER;
          if (extra > 0) B[k] += extra * set;   // no visible change: the shell stays deeper than LOOSE_LOOK[1]
        }
      }
      if (a >= 0) markDirty(a, j, b, j);
    }
  }

  function step(dt) {
    for (let n = pours.length - 1; n >= 0; n--) {
      const p = pours[n];
      const v = Math.min(p.left, p.rate * dt);
      deposit(p.x, p.z, v, p.sigma, p.pack);
      p.left -= v;
      if (p.left <= 1e-6) pours.splice(n, 1);
    }
    relaxRegions();
    refill(dt);
  }

  // ---------------------------------------------------------------- summit
  const peak = { x: 0, y: 0, z: 0, i: 48, j: 24 };
  function smoothAt(i, j) {
    const k = j * V + i, a = 2, b = 4, r = V * 2, s = V * 4;
    return (H[k] * 2 + H[k - a] + H[k + a] + H[k - r] + H[k + r] + H[k - b] + H[k + b] + H[k - s] + H[k + s]
      + H[k - a - r] + H[k + a - r] + H[k - a + r] + H[k + a + r]) / 14;
  }
  // The highest place of the surface smoothed over about 1 m. It only moves to a clearly higher place.
  function findPeak(force) {
    let best = -1e9, bi = peak.i, bj = peak.j;
    for (let j = 8; j <= N - 8; j += 2) for (let i = 8; i <= N - 8; i += 2) {
      const h = smoothAt(i, j);
      if (h > best) { best = h; bi = i; bj = j; }
    }
    if (force || best > smoothAt(peak.i, peak.j) + SNOW.PEAK_HYST) { peak.i = bi; peak.j = bj; peak.x = toX(bi); peak.z = toX(bj); }
    peak.y = heightAt(peak.x, peak.z);
    return peak;
  }

  // ---------------------------------------------------------------- first hill of a round
  function reset(seed) {
    const rng = mulberry32(seed | 0);
    const mx = -3 + rng() * 4, mz = -3.4 + rng() * 1.8, mh = 0.8 + rng() * 0.25;
    const sa = 1.0 + rng() * 0.25, sb = sa * (0.8 + rng() * 0.35), rot = rng() * Math.PI;
    const cr = Math.cos(rot), sr = Math.sin(rot);
    const shA = rng() * Math.PI * 2, shD = 1.1 + rng() * 0.5;
    const shx = clamp(mx + Math.cos(shA) * shD, -4.4, 4.4), shz = clamp(mz + Math.sin(shA) * shD, -4.6, -0.4);
    const shH = 0.3 + rng() * 0.25, shS = 0.6 + rng() * 0.25;
    const drifts = [];
    for (let n = 0; n < 7; n++) drifts.push([-4.8 + rng() * 9.6, -4.8 + rng() * 9.6, 0.03 + rng() * 0.06, 0.5 + rng() * 0.6]);
    let top = 1e-6;
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
      const x = toX(i), z = toX(j), dx = x - mx, dz = z - mz;
      const a = dx * cr + dz * sr, b = -dx * sr + dz * cr;
      const hill = Math.exp(-0.5 * ((a * a) / (sa * sa) + (b * b) / (sb * sb)))
        + shH * Math.exp(-((x - shx) ** 2 + (z - shz) ** 2) / (2 * shS * shS));
      H[j * V + i] = hill;
      if (hill > top) top = hill;
    }
    const scale = mh / top;
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
      const k = j * V + i, x = toX(i), z = toX(j);
      const hill = H[k] * scale;
      let h = hill;
      for (const d of drifts) h += d[2] * Math.exp(-((x - d[0]) ** 2 + (z - d[1]) ** 2) / (2 * d[3] * d[3]));
      const rim = Math.min(HALF - Math.abs(x), HALF - Math.abs(z));
      H[k] = edge[k] ? 0 : h * smoothstep(0, 1.0, rim);
      B[k] = Math.max(FIELD.groundY, H[k] - SNOW.COVER);   // loose powder on everything, the hill is firm inside
    }
    pours.length = 0; active.length = 0; refillT = 0;
    findPeak(true);
    markDirty(0, 0, N, N);
    flush();
    aPos.clearUpdateRanges(); aNor.clearUpdateRanges(); aSnow.clearUpdateRanges();   // first upload is the whole buffer
  }

  // total snow volume above the ground (m3), for checking that pushing keeps the volume
  function volume() {
    let s = 0;
    for (let k = 0; k < V * V; k++) s += H[k] - FIELD.groundY;
    return s * CELL2;
  }

  // ---------------------------------------------------------------- finger ray
  const _p = new THREE.Vector3();
  function raycast(raycaster) {
    const o = raycaster.ray.origin, d = raycaster.ray.direction;
    if (!(d.y < -1e-4) || !Number.isFinite(o.x + o.y + o.z + d.x + d.z)) return null;
    let t = Math.max(0, (FIELD.maxY + 0.2 - o.y) / d.y);
    const tEnd = (FIELD.groundY - 0.1 - o.y) / d.y;
    const stepT = CELL * 0.5;
    let prev = t;
    for (; t <= tEnd; t += stepT) {
      _p.copy(d).multiplyScalar(t).add(o);
      if (_p.y - heightAt(_p.x, _p.z) <= 0) {
        let a = prev, b = t;
        for (let it = 0; it < 8; it++) {
          const m = (a + b) / 2;
          _p.copy(d).multiplyScalar(m).add(o);
          if (_p.y - heightAt(_p.x, _p.z) > 0) a = m; else b = m;
        }
        return new THREE.Vector3().copy(d).multiplyScalar((a + b) / 2).add(o);
      }
      prev = t;
    }
    const tp = -o.y / d.y;
    return tp > 0 ? new THREE.Vector3().copy(d).multiplyScalar(tp).add(o) : null;
  }

  return {
    H, B, edge, mesh, peak,
    toI, toX, heightAt, firmAt, packedAt, packedOf, gradAt, normalAt, raycast,
    markDirty, disturb, addShape, deposit, pour, smoothDisc, packDisc,
    step, flush, findPeak, reset, volume,
    get unsettled() { return active.length + pours.length; },
    onContextRestored() {
      for (const a of [aPos, aNor, aSnow]) { a.clearUpdateRanges(); a.needsUpdate = true; }
    },
    dispose() { geo.dispose(); mat.dispose(); },
  };
}
