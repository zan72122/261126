// hero：器の上で育つ氷の山と、その凸凹を流れるシロップ。API は docs/HERO-SPEC.md のとおり。
//   sim.js  … 1つの高さマップ（積もる・崩れる・流れる・たまる・染みる・一口）。three なし。
//   bowl.js … 器（断面を回した形、variant で色・柄・縁の形）。
//   hero.js … 見た目（山のメッシュ・降る粒・転がる粒・こぼれた氷・シロップの流れとしぶき）と API。
// three は import しない（引数の THREE を使う）。物理エンジンなし、すべて数式。
import { createSim } from './sim.js';
import { BOWL_VARIANTS, makeBowlAtlas, buildBowlGeometry } from './bowl.js';

// ---- 調整用の値（docs/hero-notes.md に説明） ----
const TUNE = {
  yIn: 0.018, footHeight: 0.012, floorPow: 2.2, wall: 0.004,
  fillSeconds: 22,        // rate=1 で volume 0→1 になる秒数
  flakeRate: 150,         // rate=1 の時の粒の数／秒（1粒が同じ量の氷を運ぶ）
  flakeSigma: 0.0075,     // 1粒が積もる広がり（m）
  flakeSpread: 0.034,     // 出口からの横の散らばり（m/s）
  shakeStart: 3.0,        // この加速度（m/s²）を超えると山が揺すられる
  shakeGain: 0.6,
  shakeMax: 0.9,
  tiltGain: 0.0042,       // 器の揺れ（rad ÷ m/s²）
  tiltMax: 0.07,
  syrupQ: 5.5e-6,         // シロップの量（m³/秒、rate=1）
  milkQ: 3.4e-6,
  pourSigma: 0.0045,
  streamSpeed: 1.7,       // 流れの先が落ちる速さ（m/s）
  aoGain: 30,             // 谷の暗さ（1/m）
  aoMax: 0.5,
};

export function createHero(THREE, opts = {}) {
  const tier = opts.tier || 'high';
  const low = tier === 'low';
  const onEvent = typeof opts.onEvent === 'function' ? opts.onEvent : () => {};
  const tex = opts.textures || {};

  // ---- 固定寸法（HERO-SPEC §3） ----
  const dims = { rimRadius: 0.115, rimHeight: 0.07, footRadius: 0.054, maxHeight: 0.25, pickRadius: 0.14 };
  const R = dims.rimRadius, RIM_Y = dims.rimHeight;

  // ---- 高さマップ ----
  let spillBudget = 0, spillSpawned = 0;
  const sim = createSim({
    N: low ? 48 : 64, rimRadius: R, rimHeight: RIM_Y, yIn: TUNE.yIn, maxHeight: dims.maxHeight, floorPow: TUNE.floorPow, wall: TUNE.wall,
    seed: ((opts.variant | 0) + 1) * 7919,
    onSpill: (k, kn, vol) => onSpill(kn, vol),
    onDrip: (k, kn, vol, c0, c1, c2, m) => onDrip(kn, vol, c0, c1, c2, m),
  });
  const N = sim.N, NN = sim.NN, L = sim.L, CELL = sim.CELL, RIN = sim.RIN, SP = sim.P;
  const { t, s, flo, inside, cells, stW, stM, stC0, stC1, stC2, sM, sC0, sC1, sC2 } = sim;
  const nIn = cells.length;
  const bowlDims = { rimRadius: R, rimHeight: RIM_Y, footRadius: dims.footRadius, footHeight: TUNE.footHeight, floorPow: TUNE.floorPow, innerRadius: RIN };

  // ---- グループ ----
  const root = new THREE.Group(); root.name = 'hero.root';
  const body = new THREE.Group(); body.name = 'hero.body'; root.add(body); // 揺れ・傾きはここ
  const fx = new THREE.Group(); fx.name = 'hero.fx';
  const owned = [];
  const own = (o) => { owned.push(o); return o; };

  // ---- 器 ----
  const VN = BOWL_VARIANTS.length;
  const atlas = own(makeBowlAtlas(THREE));
  const bowlMat = own(new THREE.MeshStandardMaterial({ map: atlas, vertexColors: true, roughness: 0.3, metalness: 0, emissive: 0xfff2d8, emissiveIntensity: 0 }));
  let variant = 0;
  let bowlGeo = buildBowlGeometry(THREE, bowlDims, 0, low ? 48 : 72, low ? 7 : 10);
  const bowl = new THREE.Mesh(bowlGeo, bowlMat); bowl.name = 'hero.bowl'; body.add(bowl);
  const innerCol = new THREE.Color(BOWL_VARIANTS[0].inner);
  let inRGB = null; // 器の内側の色（セルごと。縁の近くに variant の色の輪と点）

  // ---- 山のメッシュ（格子の頂点を毎フレーム更新） ----
  // 頂点の種類：1=氷の乗るセル、2=縁のすぐ外（縁の円へ寄せ、隣の内側のセルの高さを写す）、3=その外（縁の下へ折り込む裾）
  const cls = new Uint8Array(NN), src = new Int32Array(NN);
  const pos = new Float32Array(NN * 3), nor = new Float32Array(NN * 3), col = new Float32Array(NN * 3), surf = new Float32Array(NN * 3), uv = new Float32Array(NN * 2);
  const Hm = new Float32Array(NN).fill(RIM_Y), blurA = new Float32Array(NN), blurB = new Float32Array(NN);
  const FLOOR_RIN = sim.floorAt(RIN);
  for (let k = 0; k < NN; k++) { if (inside[k]) { cls[k] = 1; src[k] = k; } }
  const ring1 = [], ring2 = [];
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i; if (cls[k]) continue;
    const x = -L + i * CELL, z = -L + j * CELL, r = Math.hypot(x, z) || 1, px = (x / r) * RIN, pz = (z / r) * RIN;
    let best = -1, bd = 1e9;
    for (let n = 0; n < 8; n++) {
      const kn = k + sim.OFF[n]; if (!inside[kn]) continue;
      const d = Math.hypot(-L + (kn % N) * CELL - px, -L + ((kn / N) | 0) * CELL - pz);
      if (d < bd) { bd = d; best = kn; }
    }
    if (best >= 0) { cls[k] = 2; src[k] = best; ring1.push(k); }
  }
  // 縁のすぐ外の頂点の高さは、隣り合う内側のセルの平均（縁の氷のふちがなめらかになる）
  const ringNb = new Int32Array(ring1.length * 8).fill(-1);
  ring1.forEach((k, c) => { let m = 0; for (let n = 0; n < 8; n++) { const kn = k + sim.OFF[n]; if (inside[kn]) ringNb[c * 8 + m++] = kn; } });
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i; if (cls[k]) continue;
    let best = -1;
    for (let dj = -1; dj <= 1 && best < 0; dj++) for (let di = -1; di <= 1; di++) {
      const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue;
      if (cls[jj * N + ii] === 2) { best = jj * N + ii; break; }
    }
    if (best >= 0) { cls[k] = 3; src[k] = src[best]; ring2.push(k); }
  }
  const UV_SCALE = 1 / 0.17;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i; let x = -L + i * CELL, z = -L + j * CELL;
    if (cls[k] >= 2) { const r = Math.hypot(x, z) || 1, rr = cls[k] === 2 ? RIN + 0.0004 : RIN + 0.0012; x *= rr / r; z *= rr / r; }
    pos[k * 3] = x; pos[k * 3 + 1] = cls[k] === 3 ? RIM_Y - 0.008 : flo[k]; pos[k * 3 + 2] = z;
    nor[k * 3 + 1] = 1;
    uv[k * 2] = x * UV_SCALE + 0.5; uv[k * 2 + 1] = z * UV_SCALE + 0.5;
  }
  const idx = [];
  for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) {
    const a = j * N + i, b = a + 1, c = a + N, d = c + 1;
    if (!cls[a] || !cls[b] || !cls[c] || !cls[d]) continue;
    if (cls[a] === 3 && cls[b] === 3 && cls[c] === 3 && cls[d] === 3) continue;
    if ((i + j) & 1) idx.push(a, c, b, b, c, d); else idx.push(a, c, d, a, d, b);
  }
  const moundGeo = own(new THREE.BufferGeometry());
  const aPos = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage);
  const aNor = new THREE.BufferAttribute(nor, 3).setUsage(THREE.DynamicDrawUsage);
  const aCol = new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage);
  const aSurf = new THREE.BufferAttribute(surf, 3).setUsage(THREE.DynamicDrawUsage);
  moundGeo.setAttribute('position', aPos); moundGeo.setAttribute('normal', aNor); moundGeo.setAttribute('color', aCol);
  moundGeo.setAttribute('aSurf', aSurf); moundGeo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  moundGeo.setIndex(idx);
  moundGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.12, 0), 0.2);

  // 氷の見た目：頂点色（染み・谷の影）×氷の写真。aSurf = (氷の量, 濡れ, 染みの濃さ)。
  //   氷：ざらざら、結晶の先は白く、染みた谷は色が深い。濡れた所（シロップの膜・たまり）と器の底：つるつる。
  const sparkle = { value: 0 };
  const moundMat = own(new THREE.MeshStandardMaterial({ map: tex.ice || null, vertexColors: true, roughness: 0.9, metalness: 0 }));
  moundMat.onBeforeCompile = (sh) => {
    sh.uniforms.uTwinkle = sparkle;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec3 aSurf;\nvarying vec3 vSurf;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSurf = aSurf;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vSurf;\nuniform float uTwinkle;')
      .replace('#include <map_fragment>', '')
      .replace('#include <color_fragment>', `
        float kIce = clamp( vSurf.x, 0.0, 1.0 ), kWet = clamp( vSurf.y, 0.0, 1.0 ), kStain = clamp( vSurf.z, 0.0, 1.0 );
        vec3 kTex = vec3( 0.86 );
        #ifdef USE_MAP
          kTex = texture2D( map, vMapUv ).rgb;
        #endif
        float kTip = smoothstep( 0.50, 0.95, dot( kTex, vec3( 0.3333 ) ) );
        vec3 kTint = vec3( 1.0 );
        #if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
          kTint = clamp( vColor.rgb, 0.0, 1.0 );
        #endif
        vec3 kWhite = kTint * mix( 0.83, 1.0, kTip );
        vec3 kDeep = kTint * ( 0.5 + 0.5 * kTint );
        vec3 kHigh = mix( kTint, vec3( 1.0 ), 0.36 );
        vec3 kIceCol = mix( kWhite, mix( kDeep, kHigh, kTip ), kStain );
        float kGrain = kIce * ( 1.0 - 0.8 * kWet );
        diffuseColor.rgb *= mix( kTint, kIceCol, kGrain );`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix( mix( 0.3, 0.95, kIce ), 0.13, kWet );')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        #ifdef USE_MAP
        {
          vec2 kc = floor( vMapUv * 230.0 );
          float kh = fract( sin( dot( kc, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
          vec3 kv = normalize( vViewPosition + vec3( 0.0, 0.0, 1e-4 ) );
          float kp = fract( kh * 31.0 + kv.x * 23.0 + kv.y * 17.0 + uTwinkle );
          totalEmissiveRadiance += vec3( 0.75, 0.85, 1.0 ) * ( step( 0.93, kh ) * smoothstep( 0.72, 1.0, kp ) * kIce * ( 1.0 - kWet ) * 0.55 );
        }
        #endif`);
  };
  moundMat.customProgramCacheKey = () => 'kakigori-ice-v1';
  const mound = new THREE.Mesh(moundGeo, moundMat); mound.name = 'hero.mound'; body.add(mound);

  // ---- 当たり判定（不可視の円柱、root の子） ----
  const pickGeo = own(new THREE.CylinderGeometry(dims.pickRadius, dims.pickRadius, 0.25, 16));
  const pickMat = own(new THREE.MeshBasicMaterial({ visible: false }));
  const pick = new THREE.Mesh(pickGeo, pickMat); pick.position.y = 0.125; pick.name = 'hero.pick'; root.add(pick);

  // ---- 氷の粒（降る粒・こぼれた氷＝世界座標の1つの InstancedMesh／山肌を転がる粒＝器の中の InstancedMesh） ----
  const P_MAX = low ? 150 : 300, D_MAX = low ? 100 : 200, G_MAX = low ? 60 : 120;
  const shardGeo = own(new THREE.OctahedronGeometry(1, 0)); shardGeo.scale(1, 0.42, 0.7);
  const shardMat = own(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, flatShading: true, emissive: 0x9fb8cc, emissiveIntensity: 0.35 }));
  const iceParts = new THREE.InstancedMesh(shardGeo, shardMat, P_MAX + D_MAX); iceParts.frustumCulled = false; iceParts.count = 0; iceParts.name = 'hero.flakes'; fx.add(iceParts);
  const grains = new THREE.InstancedMesh(shardGeo, shardMat, G_MAX); grains.frustumCulled = false; grains.count = 0; grains.name = 'hero.grains'; body.add(grains);
  iceParts.instanceMatrix.setUsage(THREE.DynamicDrawUsage); grains.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  // 回転の表（毎フレームの行列計算を軽くする）
  const ROTN = 32, rot = new Float32Array(ROTN * 9);
  { const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < ROTN; i++) { e.set(i * 2.399, i * 1.117 + 0.5, i * 0.713); q.setFromEuler(e); m.makeRotationFromQuaternion(q); const a = m.elements; rot.set([a[0], a[1], a[2], a[4], a[5], a[6], a[8], a[9], a[10]], i * 9); } }
  function putInst(arr, i, x, y, z, ri, sx, sy, sz) {
    const o = i * 16, r = (ri % ROTN) * 9;
    arr[o] = rot[r] * sx; arr[o + 1] = rot[r + 1] * sx; arr[o + 2] = rot[r + 2] * sx; arr[o + 3] = 0;
    arr[o + 4] = rot[r + 3] * sy; arr[o + 5] = rot[r + 4] * sy; arr[o + 6] = rot[r + 5] * sy; arr[o + 7] = 0;
    arr[o + 8] = rot[r + 6] * sz; arr[o + 9] = rot[r + 7] * sz; arr[o + 10] = rot[r + 8] * sz; arr[o + 11] = 0;
    arr[o + 12] = x; arr[o + 13] = y; arr[o + 14] = z; arr[o + 15] = 1;
  }
  // 降る粒
  const fX = new Float32Array(P_MAX), fY = new Float32Array(P_MAX), fZ = new Float32Array(P_MAX), fVX = new Float32Array(P_MAX), fVY = new Float32Array(P_MAX), fVZ = new Float32Array(P_MAX), fS = new Float32Array(P_MAX);
  let fN = 0, spawnAcc = 0;
  // こぼれた氷（台の上で止まり、数秒でしぼむ）
  const dX = new Float32Array(D_MAX), dY = new Float32Array(D_MAX), dZ = new Float32Array(D_MAX), dVX = new Float32Array(D_MAX), dVY = new Float32Array(D_MAX), dVZ = new Float32Array(D_MAX);
  const dAge = new Float32Array(D_MAX).fill(-1), dLife = new Float32Array(D_MAX), dSz = new Float32Array(D_MAX);
  let dNext = 0;
  // 山肌を転がる粒（器ローカル）
  const gX = new Float32Array(G_MAX), gZ = new Float32Array(G_MAX), gVX = new Float32Array(G_MAX), gVZ = new Float32Array(G_MAX), gH = new Float32Array(G_MAX), gVH = new Float32Array(G_MAX);
  const gAge = new Float32Array(G_MAX), gLife = new Float32Array(G_MAX), gSz = new Float32Array(G_MAX);
  let gN = 0;

  // ---- シロップ：ボトル口から面までの流れ（円柱 ×4）と、しぶき（小さな球） ----
  const ST_MAX = 4, DR_MAX = low ? 24 : 48;
  const streamGeo = own(new THREE.CylinderGeometry(1.15, 0.8, 1, 10, 1, true)); streamGeo.translate(0, -0.5, 0);
  const syrupMat = own(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.16, metalness: 0 }));
  const streams = new THREE.InstancedMesh(streamGeo, syrupMat, ST_MAX); streams.frustumCulled = false; streams.count = 0; streams.name = 'hero.streams'; fx.add(streams);
  const dropGeo = own(new THREE.IcosahedronGeometry(1, 1));
  const drops = new THREE.InstancedMesh(dropGeo, syrupMat, DR_MAX); drops.frustumCulled = false; drops.count = 0; drops.name = 'hero.drops'; fx.add(drops);
  const white = new THREE.Color(1, 1, 1);
  for (let i = 0; i < ST_MAX; i++) streams.setColorAt(i, white);
  for (let i = 0; i < DR_MAX; i++) drops.setColorAt(i, white);
  const slots = [];
  for (let i = 0; i < ST_MAX; i++) slots.push({ on: false, pour: false, id: '', now: false, x: 0, z: 0, yTop: 0, yBot: 0, rate: 0, milk: 0, hit: false, lr: 1, lg: 1, lb: 1, c0: 1, c1: 1, c2: 1, sr: 1, sg: 1, sb: 1, splashAcc: 0 });
  const pX = new Float32Array(DR_MAX), pY = new Float32Array(DR_MAX), pZ = new Float32Array(DR_MAX), pVX = new Float32Array(DR_MAX), pVY = new Float32Array(DR_MAX), pVZ = new Float32Array(DR_MAX);
  const pSz = new Float32Array(DR_MAX), pC = new Float32Array(DR_MAX * 7); // lr,lg,lb, c0,c1,c2, milk
  let pN = 0;

  const tmpCol = new THREE.Color();
  const CREAM = [1.0, 0.9, 0.66];
  const ICE = [0.955, 0.98, 1.0];

  // ---- 状態 ----
  const levels = { land: 0, slide: 0, spill: 0, flow: 0 };
  const stats = { volume: 0, peak: TUNE.yIn, coverage: 0, colors: 0, stage: 0, rawVolume: 0, wetCells: 0 };
  const colorIds = [];
  const evT = { slide: -9, spill: -9, pool: -9, syrupHit: -9 };
  let now = 0, stage = 0, landed = false, dirty = true, filmLive = 0, statsDirty = true;
  let landAcc = 0, slideAcc = 0, spillAcc = 0, flowAcc = 0, slideOn = false, spillGap = 0.5, pooledPrev = 0;
  let pvx = 0, pvz = 0, accX = 0, accZ = 0, tiltX = 0, tiltZ = 0, tiltVX = 0, tiltVZ = 0, cx = 1, sx = 0, cz = 1, sz = 0;
  let rx = 0, ry = 0, rz = 0; // root の世界位置
  let idleT = 0, grabFlash = 0, wasHeld = false, frame = 0;
  let bX = 0, bY = 0, bZ = 0; // 変換の作業用

  // ---- 座標：root ローカル ⇄ 器（body、傾きあり） ----
  function rootToBody(x, y, z) { // body の回転は Rx(tiltX)·Rz(tiltZ)
    const y1 = y * cx + z * sx, z1 = -y * sx + z * cx;
    bX = x * cz + y1 * sz; bY = -x * sz + y1 * cz; bZ = z1;
  }
  function bodyToRoot(x, y, z) {
    const x1 = x * cz - y * sz, y1 = x * sz + y * cz;
    bX = x1; bY = y1 * cx - z * sx; bZ = y1 * sx + z * cx;
  }
  // root ローカルの (lx,lz) の真上から見た面：器の座標 (sbX,sbZ) と root での高さ sbY
  let sbX = 0, sbZ = 0, sbY = 0;
  const RCLAMP = RIN * 0.97;
  function surfaceUnder(lx, lz) {
    let x = lx, z = lz, y = 0;
    for (let it = 0; it < 3; it++) {
      const r = Math.hypot(x, z); if (r > RCLAMP) { x *= RCLAMP / r; z *= RCLAMP / r; }
      y = sim.heightAt(x, z);
      if (it === 2 || (sx === 0 && sz === 0)) break;
      const X = x * cz - y * sz, Z = (x * sz + y * cz) * sx + z * cx;
      x += lx - X; z += lz - Z;
    }
    sbX = x; sbZ = z; sbY = (x * sz + y * cz) * cx - z * sx;
  }

  function sampleSurface(lx, lz, out) {
    out = out || {};
    lx = +lx || 0; lz = +lz || 0;
    out.inside = Math.hypot(lx, lz) < R;
    surfaceUnder(lx, lz);
    const e = CELL, x = sbX, z = sbZ;
    const gx = (sim.heightAt(x + e, z) - sim.heightAt(x - e, z)) / (2 * e), gz = (sim.heightAt(x, z + e) - sim.heightAt(x, z - e)) / (2 * e);
    const inv = 1 / Math.sqrt(gx * gx + 1 + gz * gz);
    const nx = -gx * inv, ny = inv, nz = -gz * inv;
    const y1 = nx * sz + ny * cz;
    out.y = sbY; out.nx = nx * cz - ny * sz; out.ny = y1 * cx - nz * sx; out.nz = y1 * sx + nz * cx;
    return out;
  }

  function emit(type, detail, minGap) {
    if (now - evT[type] < (minGap || 0.08)) return false;
    evT[type] = now; onEvent(type, detail); return true;
  }

  // ---- 粒を出す ----
  function spawnDebris(wx, wy, wz, vx, vy, vz, size) {
    let i = dNext; dNext = (dNext + 1) % D_MAX; // いっぱいなら一番古い物を使い回す
    dX[i] = wx; dY[i] = wy; dZ[i] = wz; dVX[i] = vx; dVY[i] = vy; dVZ[i] = vz; dAge[i] = 0; dLife[i] = 3.6 + Math.random() * 2.2; dSz[i] = size;
  }
  function spawnGrain(x, z, vx, vz, hop, size, life) {
    if (gN >= G_MAX) return;
    const i = gN++; gX[i] = x; gZ[i] = z; gVX[i] = vx; gVZ[i] = vz; gH[i] = 0.0015; gVH[i] = hop; gAge[i] = 0; gLife[i] = life; gSz[i] = size;
  }
  const GRAIN_VOL = sim.capacity / TUNE.fillSeconds / TUNE.flakeRate * 1.6;
  function onSpill(kn, vol) { // 縁を越えた氷 → 縁から台へ落ちる粒
    spillBudget += vol;
    if (spillBudget < GRAIN_VOL || spillSpawned >= 10) return;
    spillBudget -= GRAIN_VOL; if (spillBudget > GRAIN_VOL * 4) spillBudget = GRAIN_VOL * 4;
    spillSpawned++;
    const x = -L + (kn % N) * CELL, z = -L + ((kn / N) | 0) * CELL, r = Math.hypot(x, z) || 1, ux = x / r, uz = z / r;
    bodyToRoot(ux * (R + 0.006), RIM_Y + 0.006, uz * (R + 0.006));
    const sp = 0.05 + Math.random() * 0.1, sw = (Math.random() - 0.5) * 0.08;
    spawnDebris(rx + bX, ry + bY, rz + bZ, ux * sp - uz * sw, 0.04 + Math.random() * 0.12, uz * sp + ux * sw, 0.0026 + Math.random() * 0.002);
  }
  function spawnDrop(wx, wy, wz, vx, vy, vz, size, lr, lg, lb, c0, c1, c2, milk) {
    if (pN >= DR_MAX) return;
    const i = pN++, o = i * 7; pX[i] = wx; pY[i] = wy; pZ[i] = wz; pVX[i] = vx; pVY[i] = vy; pVZ[i] = vz; pSz[i] = size;
    pC[o] = lr; pC[o + 1] = lg; pC[o + 2] = lb; pC[o + 3] = c0; pC[o + 4] = c1; pC[o + 5] = c2; pC[o + 6] = milk;
  }
  let dripAcc = 0;
  function onDrip(kn, vol, c0, c1, c2, m) { // 縁を越えたシロップ → 器の外をぽたっと落ちる
    dripAcc += vol; if (dripAcc < 4e-8) return; dripAcc = 0;
    const x = -L + (kn % N) * CELL, z = -L + ((kn / N) | 0) * CELL, r = Math.hypot(x, z) || 1, ux = x / r, uz = z / r;
    bodyToRoot(ux * (R + 0.007), RIM_Y + 0.004, uz * (R + 0.007));
    const k0 = c0 + (CREAM[0] - c0) * m, k1 = c1 + (CREAM[1] - c1) * m, k2 = c2 + (CREAM[2] - c2) * m;
    spawnDrop(rx + bX, ry + bY, rz + bZ, ux * 0.05, 0.02, uz * 0.05, 0.0028, k0 * k0, k1 * k1, k2 * k2, c0, c1, c2, m);
  }

  // 器の内側の絵付け：縁の近くに色の帯、その内側に細い線と点（上から見て variant が分かる）
  function paintInner(v) {
    if (!inRGB) inRGB = new Float32Array(NN * 3);
    const V = BOWL_VARIANTS[v], band = tmpCol.set(V.band), br = band.r, bg = band.g, bb = band.b;
    const base = tmpCol.set(V.base), ar = base.r, ag = base.g, ab = base.b, n = V.dots || 12;
    for (let k = 0; k < NN; k++) {
      const x = -L + (k % N) * CELL, z = -L + ((k / N) | 0) * CELL, q = Math.hypot(x, z) / RIN, th = Math.atan2(z, x);
      let r = innerCol.r, g = innerCol.g, b = innerCol.b;
      const edge = Math.min(1, Math.max(0, (q - 0.86) / 0.06)) * 0.75; // 縁へ向かって地色に
      r += (ar - r) * edge; g += (ag - g) * edge; b += (ab - b) * edge;
      const line = Math.max(0, 1 - Math.abs(q - 0.8) / 0.022); // 細い線
      const dot = Math.max(0, 1 - Math.hypot((q - 0.68) * RIN, Math.sin((th * n) / 2) * 2 * q * RIN / n) / 0.006); // 点の輪
      const ink = Math.min(1, line * 0.9 + Math.min(1, dot * 1.6));
      r += (br - r) * ink; g += (bg - g) * ink; b += (bb - b) * ink;
      inRGB[k * 3] = r; inRGB[k * 3 + 1] = g; inRGB[k * 3 + 2] = b;
    }
  }

  // ---- 山のメッシュを今の高さマップに合わせる ----
  function rebuildMesh() {
    const S_FILM = SP.sFilm, M_FILM = SP.mRef;
    for (let c = 0; c < nIn; c++) { const k = cells[c]; Hm[k] = flo[k] + t[k] + s[k]; }
    for (let c = 0; c < ring1.length; c++) {
      let sum = 0, m = 0;
      for (let n = c * 8; n < c * 8 + 8; n++) { const q = ringNb[n]; if (q < 0) break; sum += t[q] + s[q]; m++; }
      Hm[ring1[c]] = FLOOR_RIN + (m ? sum / m : 0);
    }
    // 谷の影：周り（5×5 の平均）より低い所ほど暗く青く
    for (let j = 0; j < N; j++) { const o = j * N; for (let i = 2; i < N - 2; i++) { const k = o + i; blurA[k] = Hm[k - 2] + Hm[k - 1] + Hm[k] + Hm[k + 1] + Hm[k + 2]; } blurA[o] = blurA[o + 1] = blurA[o + 2]; blurA[o + N - 1] = blurA[o + N - 2] = blurA[o + N - 3]; }
    for (let j = 2; j < N - 2; j++) { const o = j * N; for (let i = 0; i < N; i++) { const k = o + i; blurB[k] = (blurA[k - 2 * N] + blurA[k - N] + blurA[k] + blurA[k + N] + blurA[k + 2 * N]) * 0.04; } }
    const inv2 = 1 / (2 * CELL);
    for (let c = 0; c < nIn; c++) {
      const k = cells[c], o = k * 3, h = Hm[k], tk = t[k], sk = s[k];
      pos[o + 1] = h;
      const gx = (Hm[k + 1] - Hm[k - 1]) * inv2, gz = (Hm[k + N] - Hm[k - N]) * inv2, inv = 1 / Math.sqrt(gx * gx + 1 + gz * gz);
      nor[o] = -gx * inv; nor[o + 1] = inv; nor[o + 2] = -gz * inv;
      const ic = tk >= 0.0015 ? 1 : tk / 0.0015;
      const inR = inRGB[o], inG = inRGB[o + 1], inB = inRGB[o + 2];
      let r = inR + (ICE[0] - inR) * ic, g = inG + (ICE[1] - inG) * ic, b = inB + (ICE[2] - inB) * ic;
      let cav = (blurB[k] - h) * TUNE.aoGain; if (cav < 0) cav = cav < -0.25 ? -0.25 : cav; else if (cav > TUNE.aoMax) cav = TUNE.aoMax;
      if (cav > 0) { r *= 1 - cav * 0.62; g *= 1 - cav * 0.46; b *= 1 - cav * 0.3; }
      else { const up = 1 - cav * 0.3; r *= up; g *= up; b *= up; }
      // 染み（氷に染みた分）＋膜（今そこにある分）。濃さ W のランベルト・ベール：色^W（たまりは濃い）
      const mk = sM[k], dyeFilm = (sk - mk) / S_FILM, w = stW[k], W = w + (dyeFilm > 0 ? dyeFilm : 0);
      let stain = 0;
      if (W > 0.004) {
        const q0 = (stC0[k] + sC0[k] / S_FILM) / W, q1 = (stC1[k] + sC1[k] / S_FILM) / W, q2 = (stC2[k] + sC2[k] / S_FILM) / W;
        const Wd = W > 1.7 ? 1.7 : W, e2 = 2 * Wd; // 色は √リニアで持っているので 2乗して W乗
        r *= Math.pow(q0 < 0.1 ? 0.1 : q0 > 1 ? 1 : q0, e2); g *= Math.pow(q1 < 0.1 ? 0.1 : q1 > 1 ? 1 : q1, e2); b *= Math.pow(q2 < 0.1 ? 0.1 : q2 > 1 ? 1 : q2, e2);
        stain = W * 1.15; if (stain > 1) stain = 1;
      }
      let m = stM[k] + mk / M_FILM;
      if (m > 0.004) { if (m > 1) m = 1; const a = m * 0.95; r += (CREAM[0] - r) * a; g += (CREAM[1] - g) * a; b += (CREAM[2] - b) * a; stain *= 1 - 0.8 * m; }
      else m = 0;
      col[o] = r; col[o + 1] = g; col[o + 2] = b;
      let wet = sk / 0.00035; if (wet > 1) wet = 1; if (m * 0.55 > wet) wet = m * 0.55;
      surf[o] = ic; surf[o + 1] = wet; surf[o + 2] = stain;
    }
    for (let c = 0; c < ring1.length; c++) {
      const k = ring1[c], o = k * 3, q = src[k] * 3;
      pos[o + 1] = Hm[k];
      nor[o] = nor[q]; nor[o + 1] = nor[q + 1]; nor[o + 2] = nor[q + 2];
      col[o] = col[q]; col[o + 1] = col[q + 1]; col[o + 2] = col[q + 2];
      surf[o] = surf[q]; surf[o + 1] = surf[q + 1]; surf[o + 2] = surf[q + 2];
    }
    for (let c = 0; c < ring2.length; c++) {
      const k = ring2[c], o = k * 3, q = src[k] * 3;
      col[o] = col[q] * 0.8; col[o + 1] = col[q + 1] * 0.85; col[o + 2] = col[q + 2] * 0.9;
      surf[o] = surf[q]; surf[o + 1] = surf[q + 1]; surf[o + 2] = surf[q + 2];
      const x = pos[o], z = pos[o + 2], l = Math.hypot(x, z) || 1; nor[o] = (x / l) * 0.8; nor[o + 1] = 0.6; nor[o + 2] = (z / l) * 0.8;
    }
    aPos.needsUpdate = true; aNor.needsUpdate = true; aCol.needsUpdate = true; aSurf.needsUpdate = true;
  }

  // ---- 毎フレーム ----
  function update(dt, input) {
    if (!(dt > 0) || !input) return;
    if (dt > 0.05) dt = 0.05;
    now += dt; frame++;
    const busy = !!input.busy, held = !!input.held;
    const me = root.matrixWorld.elements; rx = me[12]; ry = me[13]; rz = me[14];
    if (!(rx === rx && ry === ry && rz === rz)) { rx = ry = rz = 0; }

    // 器の加速度 → 揺れ（傾き）と、山を揺する見かけの力
    let vx = input.bowlVel ? +input.bowlVel.x : 0, vz = input.bowlVel ? +input.bowlVel.z : 0;
    if (!(vx === vx)) vx = 0; if (!(vz === vz)) vz = 0;
    let ax = (vx - pvx) / dt, az = (vz - pvz) / dt; pvx = vx; pvz = vz;
    if (ax > 60) ax = 60; else if (ax < -60) ax = -60; if (az > 60) az = 60; else if (az < -60) az = -60;
    const ka = 1 - Math.exp(-dt / 0.06); accX += (ax - accX) * ka; accZ += (az - accZ) * ka;
    const aMag = Math.hypot(accX, accZ);
    let shx = 0, shz = 0, agit = 0;
    if (!busy && aMag > TUNE.shakeStart && stats.rawVolume > 1e-6) {
      let eff = ((aMag - TUNE.shakeStart) / 9.8) * TUNE.shakeGain; if (eff > TUNE.shakeMax) eff = TUNE.shakeMax;
      shx = (-accX / aMag) * eff; shz = (-accZ / aMag) * eff; agit = Math.min(0.9, eff * 1.6);
    }
    // 傾きのばね（加速した向きと逆へ頭が残る）
    const tgZ = Math.max(-TUNE.tiltMax, Math.min(TUNE.tiltMax, accX * TUNE.tiltGain)), tgX = Math.max(-TUNE.tiltMax, Math.min(TUNE.tiltMax, -accZ * TUNE.tiltGain));
    tiltVZ += ((tgZ - tiltZ) * 900 - tiltVZ * 21) * dt; tiltVX += ((tgX - tiltX) * 900 - tiltVX * 21) * dt;
    tiltZ += tiltVZ * dt; tiltX += tiltVX * dt;
    if (tiltZ > 0.1) tiltZ = 0.1; else if (tiltZ < -0.1) tiltZ = -0.1; if (tiltX > 0.1) tiltX = 0.1; else if (tiltX < -0.1) tiltX = -0.1;
    if (Math.abs(tiltX) < 2e-4 && Math.abs(tiltZ) < 2e-4 && Math.abs(tiltVX) < 2e-3 && Math.abs(tiltVZ) < 2e-3) { tiltX = tiltZ = 0; }
    body.rotation.set(tiltX, 0, tiltZ);
    cx = Math.cos(tiltX); sx = Math.sin(tiltX); cz = Math.cos(tiltZ); sz = Math.sin(tiltZ);

    // --- 降る氷：出口から粒を出す。1粒が同じ量の氷を運び、着いた所に積もる ---
    const sn = !busy && input.snow && input.snow.rate > 0 && input.snow.x === input.snow.x ? input.snow : null;
    const flakeRate = low ? TUNE.flakeRate * 0.5 : TUNE.flakeRate;
    const FLAKE_VOL = sim.capacity / TUNE.fillSeconds / flakeRate;
    if (sn) {
      spawnAcc += dt * flakeRate * Math.min(3, sn.rate);
      while (spawnAcc >= 1 && fN < P_MAX) {
        spawnAcc -= 1; const i = fN++;
        const a = Math.random() * 6.2832, rr = Math.sqrt(Math.random()) * 0.012, va = Math.random() * 6.2832, vr = Math.random() * TUNE.flakeSpread;
        fX[i] = sn.x + Math.cos(a) * rr; fY[i] = sn.y - Math.random() * 0.012; fZ[i] = sn.z + Math.sin(a) * rr;
        fVX[i] = Math.cos(va) * vr; fVY[i] = -0.45 - Math.random() * 0.4; fVZ[i] = Math.sin(va) * vr; fS[i] = Math.random() * 1000;
      }
      if (spawnAcc > 2) spawnAcc = 2;
    }
    let landVol = 0;
    for (let i = 0; i < fN; i++) {
      let vy = fVY[i] - 4.2 * dt; if (vy < -1.5) vy = -1.5; fVY[i] = vy;
      fX[i] += fVX[i] * dt; fY[i] += vy * dt; fZ[i] += fVZ[i] * dt;
      rootToBody(fX[i] - rx, fY[i] - ry, fZ[i] - rz);
      const r = Math.hypot(bX, bZ);
      let gone = false;
      if (r < RIN) {
        if (bY <= sim.heightAt(bX, bZ) + 0.0012) {
          const v = sim.deposit(bX, bZ, FLAKE_VOL, TUNE.flakeSigma * (0.8 + (fS[i] % 1) * 0.5));
          landVol += v; gone = true; dirty = true;
          if (!landed && v > 0) { landed = true; onEvent('land', { amount: 1 }); }
          if (gN < G_MAX - 20 && (fS[i] % 3) < 1) { const a = fS[i], sp = 0.03 + (a % 0.07); spawnGrain(bX, bZ, Math.cos(a) * sp, Math.sin(a) * sp, 0.16 + (a % 0.12), 0.0016 + (a % 0.0012), 0.22 + (a % 0.12)); }
        }
      } else if (r < R + 0.008 && bY <= RIM_Y + 0.007 && bY > RIM_Y - 0.03) { // 縁に当たって外へ跳ねる
        const ux = bX / (r || 1), uz = bZ / (r || 1);
        spawnDebris(fX[i], fY[i], fZ[i], ux * (0.04 + Math.random() * 0.09), 0.05 + Math.random() * 0.12, uz * (0.04 + Math.random() * 0.09), 0.0026 + Math.random() * 0.0016);
        gone = true;
      } else if (fY[i] <= 0.004) {
        if (Math.abs(fX[i]) <= 0.9 && Math.abs(fZ[i]) <= 0.35) { // 台に落ちた：ころっと止まって、しぼむ
          spawnDebris(fX[i], 0.004, fZ[i], fVX[i] * 2 + (Math.random() - 0.5) * 0.1, 0.12 + Math.random() * 0.16, fVZ[i] * 2 + (Math.random() - 0.5) * 0.1, 0.0026 + Math.random() * 0.0018);
          gone = true;
        } else if (fY[i] < -0.5) gone = true;
      }
      if (gone) { const j = --fN; fX[i] = fX[j]; fY[i] = fY[j]; fZ[i] = fZ[j]; fVX[i] = fVX[j]; fVY[i] = fVY[j]; fVZ[i] = fVZ[j]; fS[i] = fS[j]; i--; }
    }

    // --- 崩れる ---
    sim.decayAct(dt, agit);
    spillSpawned = 0;
    const iters = low ? (dt > 0.03 ? 3 : 2) : (dt > 0.03 ? 4 : 3);
    const rxo = sim.relax(iters, shx, shz);
    sim.settle();
    if (rxo.moved > 0) dirty = true;
    const kf = 1 - Math.exp(-dt / 0.12);
    landAcc += (landVol / dt - landAcc) * kf; slideAcc += (rxo.moved / dt - slideAcc) * kf; spillAcc += (rxo.spilled / dt - spillAcc) * kf;
    const nominal = sim.capacity / TUNE.fillSeconds;
    levels.land = Math.min(1, landAcc / nominal);
    // いつもの「降って崩れる」分（山が大きいほど長く転がる）を引いた残りが、雪崩・揺すった時の大きな崩れ
    const landN = landAcc / nominal, base = landN * (3 + 13 * stats.volume);
    levels.slide = Math.min(1, Math.max(0, (slideAcc / nominal - base) / 10) + Math.min(0.22, 0.2 * landN * (0.3 + stats.volume)));
    levels.spill = Math.min(1, spillAcc / (nominal * 0.8));
    if (!slideOn && levels.slide > 0.45) { slideOn = true; emit('slide', { size: levels.slide }, 0.45); }
    else if (slideOn && levels.slide < 0.28) slideOn = false;
    if (rxo.spilled > 0) { if (emit('spill', { amount: Math.max(0.15, levels.spill) }, spillGap)) spillGap = Math.min(2.4, spillGap * 1.5); }
    else if (now - evT.spill > 3) spillGap = 0.5;
    // 崩れている所から、さらさら転がる粒
    const rn = sim.recentN;
    if (rn > 0) {
      const want = Math.min(rn, shx !== 0 || shz !== 0 ? 6 : 3);
      for (let q = 0; q < want; q++) {
        const ri = (Math.random() * rn) | 0, k = sim.recent[ri], n = sim.recentTo[ri], sp = 0.09 + Math.random() * 0.12;
        spawnGrain(-L + (k % N) * CELL, -L + ((k / N) | 0) * CELL, sim.DX[n] * sp, sim.DZ[n] * sp, 0.05 + Math.random() * 0.1, 0.0017 + Math.random() * 0.0015, 0.28 + Math.random() * 0.3);
      }
    }

    // --- シロップ：ボトル口から落ちる流れ → 当たった所へ注ぐ ---
    for (let i = 0; i < ST_MAX; i++) slots[i].now = false;
    const pours = busy ? null : input.pours;
    if (pours) for (let q = 0; q < pours.length; q++) {
      const p = pours[q]; if (!p || !(p.rate > 0) || !(p.x === p.x && p.y === p.y && p.z === p.z)) continue;
      let sl = null;
      for (let i = 0; i < ST_MAX; i++) if (slots[i].on && slots[i].id === p.id && slots[i].pour) { sl = slots[i]; break; }
      if (!sl) { for (let i = 0; i < ST_MAX; i++) if (!slots[i].on) { sl = slots[i]; break; } if (!sl) continue;
        sl.on = true; sl.pour = true; sl.id = p.id; sl.yTop = p.y; sl.yBot = p.y; sl.hit = false; sl.splashAcc = 0;
        const c = p.color || [1, 1, 1]; sl.sr = c[0]; sl.sg = c[1]; sl.sb = c[2];
        tmpCol.setRGB(Math.min(1, Math.max(0, +c[0] || 0)), Math.min(1, Math.max(0, +c[1] || 0)), Math.min(1, Math.max(0, +c[2] || 0)), THREE.SRGBColorSpace);
        sl.lr = tmpCol.r; sl.lg = tmpCol.g; sl.lb = tmpCol.b; sl.c0 = Math.sqrt(tmpCol.r); sl.c1 = Math.sqrt(tmpCol.g); sl.c2 = Math.sqrt(tmpCol.b);
        sl.milk = p.kind === 'milk' ? 1 : 0;
        if (colorIds.indexOf(p.id) < 0) colorIds.push(p.id);
      }
      sl.now = true; sl.x = p.x; sl.z = p.z; sl.yTop = p.y; sl.rate = Math.min(1, p.rate);
    }
    let stN = 0;
    const sArr = streams.instanceMatrix.array;
    for (let i = 0; i < ST_MAX; i++) {
      const sl = slots[i]; if (!sl.on) continue;
      const lx = sl.x - rx, lz = sl.z - rz, over = Math.hypot(lx, lz) < R;
      let surfY;
      if (over) { surfaceUnder(lx, lz); surfY = ry + sbY; } else surfY = Math.abs(sl.x) <= 0.9 && Math.abs(sl.z) <= 0.35 ? 0.001 : -0.6;
      if (!sl.now) { sl.pour = false; sl.yTop -= TUNE.streamSpeed * 1.15 * dt; }
      sl.yBot -= TUNE.streamSpeed * dt;
      if (sl.yBot <= surfY) {
        sl.yBot = surfY;
        if (!sl.hit) { sl.hit = true; emit('syrupHit', { color: [sl.sr, sl.sg, sl.sb] }, 0.08); }
        if (over) {
          sim.pour(sbX, sbZ, (sl.milk ? TUNE.milkQ : TUNE.syrupQ) * sl.rate * dt, sl.c0, sl.c1, sl.c2, sl.milk, TUNE.pourSigma);
          filmLive = 40; dirty = true;
          sl.splashAcc += dt * 22 * sl.rate;
          while (sl.splashAcc >= 1) { sl.splashAcc -= 1; const a = Math.random() * 6.2832, sp = 0.05 + Math.random() * 0.13;
            spawnDrop(sl.x, surfY + 0.003, sl.z, Math.cos(a) * sp, 0.22 + Math.random() * 0.3, Math.sin(a) * sp, 0.0016 + Math.random() * 0.0014,
              sl.milk ? CREAM[0] : sl.lr, sl.milk ? CREAM[1] : sl.lg, sl.milk ? CREAM[2] : sl.lb, sl.c0, sl.c1, sl.c2, sl.milk); }
        }
      } else sl.hit = sl.hit && sl.now;
      if (sl.yTop <= sl.yBot + 1e-4) { sl.on = false; continue; }
      const w = (sl.milk ? 0.0046 : 0.0034) * (0.55 + 0.45 * sl.rate) * (1 + 0.12 * Math.sin(now * 31 + i * 2));
      const o = stN * 16; sArr.fill(0, o, o + 16);
      sArr[o] = w; sArr[o + 5] = sl.yTop - sl.yBot; sArr[o + 10] = w; sArr[o + 12] = sl.x; sArr[o + 13] = sl.yTop; sArr[o + 14] = sl.z; sArr[o + 15] = 1;
      tmpCol.setRGB(sl.milk ? CREAM[0] : sl.lr, sl.milk ? CREAM[1] : sl.lg, sl.milk ? CREAM[2] : sl.lb); streams.setColorAt(stN, tmpCol);
      stN++;
    }
    if (streams.count !== stN || stN > 0) { streams.count = stN; streams.instanceMatrix.needsUpdate = true; if (streams.instanceColor) streams.instanceColor.needsUpdate = true; }

    // しぶき：放物線で飛び、落ちた所を小さく染める
    const pArr = drops.instanceMatrix.array;
    for (let i = 0; i < pN; i++) {
      pVY[i] -= 4.5 * dt; pX[i] += pVX[i] * dt; pY[i] += pVY[i] * dt; pZ[i] += pVZ[i] * dt;
      let gone = false;
      if (pVY[i] < 0) {
        rootToBody(pX[i] - rx, pY[i] - ry, pZ[i] - rz);
        if (Math.hypot(bX, bZ) < RIN) {
          if (bY <= sim.heightAt(bX, bZ)) { const o = i * 7; sim.pour(bX, bZ, 2.5e-8, pC[o + 3], pC[o + 4], pC[o + 5], pC[o + 6], 0.003); filmLive = Math.max(filmLive, 20); dirty = true; gone = true; }
        } else if (pY[i] <= 0.002) gone = true;
      }
      if (gone) { const j = --pN; pX[i] = pX[j]; pY[i] = pY[j]; pZ[i] = pZ[j]; pVX[i] = pVX[j]; pVY[i] = pVY[j]; pVZ[i] = pVZ[j]; pSz[i] = pSz[j]; for (let c = 0; c < 7; c++) pC[i * 7 + c] = pC[j * 7 + c]; i--; continue; }
      const o = i * 16, sz2 = pSz[i]; pArr.fill(0, o, o + 16); pArr[o] = sz2; pArr[o + 5] = sz2 * 1.25; pArr[o + 10] = sz2; pArr[o + 12] = pX[i]; pArr[o + 13] = pY[i]; pArr[o + 14] = pZ[i]; pArr[o + 15] = 1;
      tmpCol.setRGB(pC[i * 7], pC[i * 7 + 1], pC[i * 7 + 2]); drops.setColorAt(i, tmpCol);
    }
    if (drops.count !== pN || pN > 0) { drops.count = pN; drops.instanceMatrix.needsUpdate = true; if (drops.instanceColor) drops.instanceColor.needsUpdate = true; }

    // --- 流れる・染みる・たまる ---
    let fluxRate = 0;
    if (filmLive > 0) {
      const sub = dt > 0.025 ? 3 : 2;
      let fo = null, flux = 0;
      for (let q = 0; q < sub; q++) { fo = sim.flow(dt / sub); flux += fo.flux; }
      fluxRate = flux / dt;
      if (fo.active > 0) { dirty = true; if (flux > 1e-10) filmLive = 40; else filmLive--; } else filmLive--;
      if (fo.pooled >= 3 && fo.pooled > pooledPrev + (pooledPrev > 0 ? 8 : 2) && fo.poolK >= 0) { // たまり始めと、大きく広がった時だけ
        const k = fo.poolK, sk = s[k] || 1, m = Math.min(1, sM[k] / sk), dye = Math.max(1e-6, sk - sM[k]);
        const c0 = sC0[k] / dye, c1 = sC1[k] / dye, c2 = sC2[k] / dye;
        if (emit('pool', { color: [c0 + (1 - c0) * m, c1 + (1 - c1) * m, c2 + (1 - c2) * m] }, 1.2)) pooledPrev = fo.pooled;
      } else if (fo.pooled === 0) pooledPrev = 0;
    }
    flowAcc += (fluxRate - flowAcc) * kf;
    levels.flow = Math.min(1, flowAcc / (TUNE.syrupQ * 6));

    // --- 山肌を転がる粒 ---
    const gArr = grains.instanceMatrix.array;
    for (let i = 0; i < gN; i++) {
      gAge[i] += dt;
      const x = gX[i] + gVX[i] * dt, z = gZ[i] + gVZ[i] * dt, r = Math.hypot(x, z);
      let gone = gAge[i] >= gLife[i];
      if (!gone && r >= RIN - 0.002) { // 縁まで来た：氷が縁より高ければ外へこぼれる
        gone = true;
        if (sim.heightAt(gX[i], gZ[i]) > RIM_Y) { bodyToRoot((x / r) * (R + 0.005), RIM_Y + 0.006, (z / r) * (R + 0.005)); spawnDebris(rx + bX, ry + bY, rz + bZ, gVX[i] * 0.9, 0.1 + Math.random() * 0.15, gVZ[i] * 0.9, gSz[i]); }
      }
      if (gone) { const j = --gN; gX[i] = gX[j]; gZ[i] = gZ[j]; gVX[i] = gVX[j]; gVZ[i] = gVZ[j]; gH[i] = gH[j]; gVH[i] = gVH[j]; gAge[i] = gAge[j]; gLife[i] = gLife[j]; gSz[i] = gSz[j]; i--; continue; }
      gX[i] = x; gZ[i] = z;
      gVH[i] -= 3.5 * dt; gH[i] += gVH[i] * dt; if (gH[i] < 0.0012) { gH[i] = 0.0012; gVH[i] = Math.abs(gVH[i]) * 0.35; }
      const u = gAge[i] / gLife[i], sc = gSz[i] * (u > 0.7 ? (1 - u) / 0.3 : 1);
      putInst(gArr, i, x, sim.heightAt(x, z) + gH[i], z, ((gAge[i] * 14) | 0) + i, sc, sc, sc);
    }
    if (grains.count !== gN || gN > 0) { grains.count = gN; grains.instanceMatrix.needsUpdate = true; }

    // --- 降る粒・こぼれた氷を1つの InstancedMesh へ ---
    const iArr = iceParts.instanceMatrix.array;
    let n = 0;
    for (let i = 0; i < fN; i++) { const sc = 0.0028 + (fS[i] % 1) * 0.0024; putInst(iArr, n++, fX[i], fY[i], fZ[i], ((now * 11 + fS[i]) | 0), sc, sc, sc); }
    for (let i = 0; i < D_MAX; i++) {
      if (dAge[i] < 0) continue;
      const age = dAge[i] + dt, life = dLife[i];
      if (age >= life || dY[i] < -0.6) { dAge[i] = -1; continue; }
      dAge[i] = age;
      const onTable = Math.abs(dX[i]) <= 0.9 && Math.abs(dZ[i]) <= 0.35;
      if (dY[i] > 0.0026 || dVY[i] > 0 || !onTable) {
        dVY[i] -= 5.5 * dt; dX[i] += dVX[i] * dt; dY[i] += dVY[i] * dt; dZ[i] += dVZ[i] * dt;
        if (onTable && dY[i] <= 0.0026 && dVY[i] < 0) { dY[i] = 0.0026; if (dVY[i] < -0.3) { dVY[i] *= -0.28; dVX[i] *= 0.55; dVZ[i] *= 0.55; } else dVY[i] = 0; }
      } else { const f = Math.exp(-9 * dt); dVX[i] *= f; dVZ[i] *= f; dX[i] += dVX[i] * dt; dZ[i] += dVZ[i] * dt; }
      const left = life - age, m = left < 1.3 ? left / 1.3 : 1, grow = age < 0.08 ? 0.5 + age * 6.25 : 1, sc = dSz[i] * grow;
      const rest = dVY[i] === 0 && dY[i] <= 0.0027;
      putInst(iArr, n++, dX[i], dY[i] - (1 - m) * 0.0012, dZ[i], rest ? i : ((age * 9) | 0) + i, sc * (0.6 + 0.4 * m), sc * m, sc * (0.6 + 0.4 * m)); // 溶けて平たく小さく
    }
    if (iceParts.count !== n || n > 0) { iceParts.count = n; iceParts.instanceMatrix.needsUpdate = true; }

    // --- メッシュ・数え直し・段階 ---
    if (dirty) { rebuildMesh(); dirty = false; statsDirty = true; }
    refreshStats();
    if (stats.stage !== stage) { stage = stats.stage; onEvent('stage', { stage }); }

    // --- 触れる物として目立たせる：持った瞬間にふわっと光り、放っておくとゆっくり息をするように光る ---
    if (held && !wasHeld) grabFlash = 1;
    wasHeld = held;
    grabFlash *= Math.exp(-dt / 0.18);
    idleT = held || busy ? 0 : idleT + dt;
    const breathe = idleT > 2.5 ? 0.5 - 0.5 * Math.cos((idleT - 2.5) * 2.2) : 0;
    bowlMat.emissiveIntensity = grabFlash * 0.32 + breathe * 0.16;
    sparkle.value = (now * 0.35) % 1;
  }

  function refreshStats() {
    if (!statsDirty) return;
    statsDirty = false;
    sim.stats(stats);
    stats.colors = colorIds.length;
    // 段階（境目で行ったり来たりしないよう、下がる方は少し余裕を持たせる）
    const v = stats.volume, c = stats.coverage;
    let st = stats.stage;
    const up = c >= 0.10 ? 3 : v >= 0.35 ? 2 : v >= 0.08 ? 1 : 0;
    const down = c >= 0.07 ? 3 : v >= 0.31 ? 2 : v >= 0.06 ? 1 : 0;
    if (up > st) st = up; else if (down < st) st = down;
    stats.stage = st;
  }
  function getStats() { refreshStats(); return stats; }

  // ---- お客さんの一口 ----
  function bite(lx, lz, radius) {
    lx = +lx || 0; lz = +lz || 0;
    surfaceUnder(lx, lz);
    const x = sbX, z = sbZ, rad = Math.max(0.012, Math.min(0.06, +radius || 0.03));
    const removed = sim.bite(x, z, rad);
    sim.relax(2, 0, 0);
    for (let q = 0; q < 10; q++) { const a = Math.random() * 6.2832, sp = 0.05 + Math.random() * 0.1; spawnGrain(x + Math.cos(a) * rad * 0.7, z + Math.sin(a) * rad * 0.7, Math.cos(a) * sp, Math.sin(a) * sp, 0.15 + Math.random() * 0.15, 0.002 + Math.random() * 0.0015, 0.3 + Math.random() * 0.25); }
    filmLive = Math.max(filmLive, 20);
    rebuildMesh(); dirty = false; statsDirty = true;
    return removed;
  }

  // ---- 棚用の静止した複製（独立したジオメトリ、新しいテクスチャなし） ----
  let snapIceMat = null, snapBowlMat = null;
  function snapshot() {
    if (dirty) { rebuildMesh(); dirty = false; }
    if (!snapIceMat) {
      snapIceMat = own(new THREE.MeshStandardMaterial({ map: tex.ice || null, vertexColors: true, roughness: 0.8 }));
      snapBowlMat = own(new THREE.MeshStandardMaterial({ map: atlas, vertexColors: true, roughness: 0.3 }));
    }
    const g = new THREE.Group(); g.name = 'hero.snapshot';
    const bg = buildBowlGeometry(THREE, bowlDims, variant, 24, 4);
    g.add(new THREE.Mesh(bg, snapBowlMat));
    const S = 30, sp = new Float32Array(S * S * 3), sc = new Float32Array(S * S * 3), su = new Float32Array(S * S * 2), ok = new Uint8Array(S * S), si = [];
    const step = (2 * RIN) / (S - 1), rEdge = RIN + 0.0004;
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
      let x = -RIN + i * step, z = -RIN + j * step; const r = Math.hypot(x, z), k = j * S + i;
      ok[k] = r <= RIN + step * 0.75 ? 1 : 0;
      let qx = x, qz = z, edge = false;
      if (r > RIN - step * 0.3) { edge = true; const f = rEdge / (r || 1); x *= f; z *= f; const fq = (RIN - CELL) / (r || 1); qx *= fq; qz *= fq; }
      const kc = sim.cellAt(qx, qz), h = sim.heightAt(qx, qz);
      sp[k * 3] = x; sp[k * 3 + 1] = edge ? Math.min(h, RIM_Y + 0.006) : h; sp[k * 3 + 2] = z;
      sc[k * 3] = col[kc * 3]; sc[k * 3 + 1] = col[kc * 3 + 1]; sc[k * 3 + 2] = col[kc * 3 + 2];
      su[k * 2] = x * UV_SCALE + 0.5; su[k * 2 + 1] = z * UV_SCALE + 0.5;
    }
    for (let j = 0; j < S - 1; j++) for (let i = 0; i < S - 1; i++) {
      const a = j * S + i, b = a + 1, c = a + S, d = c + 1;
      if (!(ok[a] && ok[b] && ok[c] && ok[d])) continue;
      si.push(a, c, b, b, c, d);
    }
    const mg = new THREE.BufferGeometry();
    mg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); mg.setAttribute('color', new THREE.BufferAttribute(sc, 3)); mg.setAttribute('uv', new THREE.BufferAttribute(su, 2));
    mg.setIndex(si); mg.computeVertexNormals(); mg.computeBoundingSphere();
    g.add(new THREE.Mesh(mg, snapIceMat));
    g.userData.dispose = () => { bg.dispose(); mg.dispose(); };
    return g;
  }

  // ---- 新しい器にする ----
  function reset(o = {}) {
    const v = ((((o && o.variant) | 0) % VN) + VN) % VN;
    sim.reset();
    fN = 0; gN = 0; pN = 0; spawnAcc = 0; spillBudget = 0; dripAcc = 0;
    for (let i = 0; i < ST_MAX; i++) slots[i].on = false;
    iceParts.count = 0; grains.count = 0; drops.count = 0; streams.count = 0;
    dAge.fill(-1); // 台の上の粒も片づける（次の器は気持ちよく空から）
    landed = false; colorIds.length = 0; stage = 0; stats.stage = 0; filmLive = 0; pooledPrev = 0; slideOn = false; spillGap = 0.5;
    landAcc = slideAcc = spillAcc = flowAcc = 0; levels.land = levels.slide = levels.spill = levels.flow = 0;
    tiltX = tiltZ = tiltVX = tiltVZ = 0; accX = accZ = 0; cx = cz = 1; sx = sz = 0; body.rotation.set(0, 0, 0);
    if (v !== variant || !bowlGeo) {
      variant = v;
      const old = bowlGeo; bowlGeo = buildBowlGeometry(THREE, bowlDims, v, low ? 48 : 72, low ? 7 : 10); bowl.geometry = bowlGeo; if (old) old.dispose();
    }
    innerCol.set(BOWL_VARIANTS[v].inner); paintInner(v);
    idleT = 0; grabFlash = 0;
    rebuildMesh(); dirty = false; statsDirty = true; refreshStats();
  }

  function onContextRestored() {
    for (const k in moundGeo.attributes) moundGeo.attributes[k].needsUpdate = true;
    for (const k in bowlGeo.attributes) bowlGeo.attributes[k].needsUpdate = true;
    for (const m of [iceParts, grains, streams, drops]) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; }
    atlas.needsUpdate = true;
    bowlMat.needsUpdate = true; moundMat.needsUpdate = true; shardMat.needsUpdate = true; syrupMat.needsUpdate = true;
    dirty = true;
  }

  function dispose() {
    for (const o of owned) o.dispose();
    if (bowlGeo) { bowlGeo.dispose(); bowlGeo = null; }
    for (const m of [iceParts, grains, streams, drops]) { m.dispose(); m.removeFromParent(); }
    bowl.removeFromParent(); mound.removeFromParent(); pick.removeFromParent(); body.removeFromParent();
    root.removeFromParent(); fx.removeFromParent();
  }

  reset({ variant: opts.variant | 0 });

  return { root, fx, dims, pickables: [pick], levels, update, sampleSurface, getStats, bite, snapshot, reset, onContextRestored, dispose };
}
