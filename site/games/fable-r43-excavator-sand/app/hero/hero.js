// hero：ショベルのアームの連動と、掘れて残る砂地・バケットの中の砂・落とした砂の山。
// docs/HERO-SPEC.md の createHero(THREE, opts) をそのまま満たす。three は import しない（引数の THREE を使う）。
// 変更したら `npm run build:hero`。作りとパラメータの説明は docs/hero-notes.md。
//
// 1つの砂の量を、砂地の高さマップ → バケット → 飛んでいる粒 → 荷台／砂地の高さマップ と受け渡す（体積を保存）。
import { P, DEG } from './params.js';
import { createKin } from './kin.js';
import { createMachine } from './machine.js';
import { createSandMaterial, createGrid } from './sand.js';
import { createGrains } from './grains.js';

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const wrapPi = (a) => { a = (a + Math.PI) % (2 * Math.PI); if (a < 0) a += 2 * Math.PI; return a - Math.PI; };
const fin = (x, d) => (Number.isFinite(x) ? x : d);

export function createHero(THREE, opts) {
  const sb = opts.sandbox, tier = opts.tier, bed = opts.bed;
  const onEvent = opts.onEvent || (() => {});
  const shadows = !!tier.shadows;
  const root = new THREE.Group();
  root.name = 'hero';
  const kin = createKin(P);
  // UV は形に焼き込んであるので、渡されたテクスチャの繰り返しは 1 に戻す（shell は複製を使っている）
  for (const k of ['sandDry', 'sandWet', 'toyYellow']) { const t = opts.textures[k]; if (t && t.repeat) { t.repeat.set(1, 1); t.offset.set(0, 0); } }

  // =====================================================================
  // 砂地
  // =====================================================================
  const NX = Math.max(8, tier.terrainCells[0] | 0), NZ = Math.max(8, tier.terrainCells[1] | 0);
  const TW = sb.maxX - sb.minX, TD = sb.maxZ - sb.minZ, baseY = sb.baseY;
  const sandMat = createSandMaterial(THREE, opts.textures);
  const TN = (NX + 1) * (NZ + 1);
  const floorArr = new Float32Array(TN).fill(P.minH);
  const ter = createGrid(THREE, { nx: NX, nz: NZ, x0: sb.minX, z0: sb.minZ, dx: TW / NX, dz: TD / NZ, uvScale: 1 / 0.7, material: sandMat, floor: floorArr, repose: P.repose, normalGain: 1.7 });
  ter.mesh.position.y = baseY;
  ter.mesh.receiveShadow = shadows;
  ter.mesh.name = 'terrain';
  root.add(ter.mesh);
  const refH = new Float32Array(TN);    // 指を置いた時の砂地（1回のなぞりで掘る深さの基準）
  const seedH = new Float32Array(TN);   // ならした時の形
  const edgeD = new Uint8Array(TN);     // 縁からのマス数（0..3）
  const padD = new Float32Array(TN);    // 足回りからの距離

  const exPos = opts.excavator.position, yaw = opts.excavator.yaw || 0;
  const turretY = exPos.y + P.swingY;
  {
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const hx = P.gauge / 2 + P.trackW / 2 + 0.035, hz = P.trackL / 2 + 0.035;
    for (let iz = 0; iz <= NZ; iz++) for (let ix = 0; ix <= NX; ix++) {
      const i = iz * ter.VX + ix;
      const lx = sb.minX + ix * ter.dx - exPos.x, lz = sb.minZ + iz * ter.dz - exPos.z;
      const ax = Math.abs(lx * cy - lz * sy) - hx, az = Math.abs(lx * sy + lz * cy) - hz;
      const d = Math.hypot(Math.max(ax, 0), Math.max(az, 0));
      padD[i] = d;
      floorArr[i] = d <= 0 ? 0 : Math.max(P.minH, -P.repose * 0.9 * d); // 足回りの下は掘れない・そばは浅く
      edgeD[i] = Math.min(3, ix, iz, NX - ix, NZ - iz);
    }
  }
  function makeSeed(seed, out) {
    let s = (Math.abs(seed | 0) % 2147483646) + 1;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const ph = []; for (let k = 0; k < 8; k++) ph.push(rnd() * Math.PI * 2);
    const f1 = 1.7 + rnd() * 0.9, f2 = 1.4 + rnd() * 0.9;
    for (let iz = 0; iz <= NZ; iz++) for (let ix = 0; ix <= NX; ix++) {
      const i = iz * ter.VX + ix, x = sb.minX + ix * ter.dx, z = sb.minZ + iz * ter.dz;
      let h = 0.02 * Math.sin(x * f1 + ph[0]) * Math.cos(z * f2 + ph[1])
        + 0.011 * Math.sin(x * 3.9 + z * 2.7 + ph[2]) + 0.006 * Math.sin(x * 8.3 - z * 7.1 + ph[3])
        + 0.003 * Math.sin(x * 17 + ph[4]) * Math.sin(z * 15 + ph[5]);
      h *= Math.min(1, Math.min(ix, iz, NX - ix, NZ - iz) / 4) * smooth(padD[i] / 0.18);
      out[i] = h;
    }
  }
  const heightAt = (x, z) => (ter.inside(x, z) ? baseY + ter.sample(x, z) : baseY);
  function sampleArr(arr, x, z) {
    let fx = clamp((x - sb.minX) / ter.dx, 0, NX), fz = clamp((z - sb.minZ) / ter.dz, 0, NZ);
    const ix = Math.min(NX - 1, fx | 0), iz = Math.min(NZ - 1, fz | 0), u = fx - ix, v = fz - iz, i = iz * ter.VX + ix;
    return (arr[i] * (1 - u) + arr[i + 1] * u) * (1 - v) + (arr[i + ter.VX] * (1 - u) + arr[i + ter.VX + 1] * u) * v;
  }
  const snapshotRef = () => refH.set(ter.H);

  // =====================================================================
  // 荷台の砂
  // =====================================================================
  const BW = bed.inner.width, BL = bed.inner.length, BH = bed.inner.wallHeight;
  const BNX = P.bedCells[0], BNZ = P.bedCells[1];
  const bedG = createGrid(THREE, { nx: BNX, nz: BNZ, x0: -BW / 2, z0: -BL / 2, dx: BW / BNX, dz: BL / BNZ, uvScale: 1 / 0.7, uvOff: 0.37, material: sandMat, wet0: 0.62, hideEmpty: true, repose: P.repose, normalGain: 1.25 });
  bedG.mesh.userData.heroPart = true;
  bedG.mesh.receiveShadow = shadows;
  bedG.mesh.name = 'bedSand';
  bed.anchor.add(bedG.mesh);
  bedG.touchAll();
  const bedFullVol = P.bucketCap * P.bedFullBuckets;
  let bedAvailable = true;
  const KO = { x0: bed.keepOut.min[0], y0: bed.keepOut.min[1], z0: bed.keepOut.min[2], x1: bed.keepOut.max[0], y1: bed.keepOut.max[1], z1: bed.keepOut.max[2] };
  const koBox = new THREE.Box3(new THREE.Vector3(KO.x0, KO.y0, KO.z0), new THREE.Vector3(KO.x1, KO.y1, KO.z1));
  const bedM = new THREE.Matrix4(), bedInv = new THREE.Matrix4();
  const T = { x: 0, y: 0, z: 0, cos: 1, sin: 0, ux: 0, uy: 1, uz: 0, tilt: false, pux: 0, puy: 1, puz: 0 };
  function updateTruck() {
    bed.anchor.updateWorldMatrix(true, false);
    bedM.copy(bed.anchor.matrixWorld);
    bedInv.copy(bedM).invert();
    const e = bedM.elements;
    T.x = fin(e[12], 0); T.y = fin(e[13], 0); T.z = fin(e[14], 0);
    const hl = Math.hypot(e[8], e[10]);
    if (hl > 0.2) { T.sin = e[8] / hl; T.cos = e[10] / hl; }
    const ul = Math.hypot(e[1], e[5], e[9]) || 1;
    T.ux = e[1] / ul; T.uy = e[5] / ul; T.uz = e[9] / ul;
    T.tilt = T.uy < 0.985;
    if (Math.abs(T.ux - T.pux) + Math.abs(T.uz - T.puz) > 0.004) { T.pux = T.ux; T.puy = T.uy; T.puz = T.uz; bedG.activate(0, 0, BNX, BNZ); }
  }
  // 荷台の「水平だけ回した」座標（傾きは無視）
  const toBedX = (x, z) => (x - T.x) * T.cos - (z - T.z) * T.sin;
  const toBedZ = (x, z) => (x - T.x) * T.sin + (z - T.z) * T.cos;
  // バケットの底が越えなければならない高さ（トラックの箱）。離れると急に下がる「テント」
  function obstacleTop(x, z) {
    const lx = toBedX(x, z), lz = toBedZ(x, z);
    const dxo = Math.max(KO.x0 - lx, 0, lx - KO.x1);
    const zSplit = -BL / 2 - 0.03;
    let top = -1e9;
    // 荷台の部分
    let dzo = Math.max(zSplit - lz, 0, lz - KO.z1);
    let d = Math.hypot(dxo, dzo);
    let t = T.y + Math.max(BH, bedTop) + 0.045 - Math.max(0, d - 0.15) * 6;
    if (t > top) top = t;
    // 運転台の部分
    dzo = Math.max(KO.z0 - lz, 0, lz - zSplit);
    d = Math.hypot(dxo, dzo);
    t = T.y + KO.y1 + 0.04 - Math.max(0, d - 0.15) * 6;
    if (t > top) top = t;
    return top;
  }
  let bedTop = 0; // 荷台の砂のいちばん高い所
  const spillAcc = [0, 0, 0, 0];

  // =====================================================================
  // ショベルカー・粒
  // =====================================================================
  const machine = createMachine(THREE, P, kin, { tier, textures: opts.textures, excavator: opts.excavator, sandMaterial: sandMat });
  root.add(machine.base);
  root.add(machine.handle);
  if (machine.blobBucket) root.add(machine.blobBucket, machine.blobBody);
  const grains = createGrains(THREE, Math.max(16, tier.grainMax | 0), P);
  root.add(grains.mesh);
  const grainVol = P.bucketCap / Math.max(60, Math.min(260, tier.grainMax * 0.6));

  // =====================================================================
  // 状態
  // =====================================================================
  // 待機の位置：ショベルの右手前（カメラに近く、アームが横から見える。トラックの通り道の外）
  const HOME = { phi: -1.92, u: 0.68, v: 0.13, psi: P.psiRest, x: 0, z: 0, hover: 0.13 };
  {
    const c = Math.cos(yaw), sn = Math.sin(yaw), ox = P.home.x, oz = P.home.z;
    HOME.x = exPos.x + ox * c + oz * sn; HOME.z = exPos.z - ox * sn + oz * c; HOME.hover = P.home.hover;
  }
  const homeGoal = () => ({ kind: 'ground', x: HOME.x, z: HOME.z, hover: HOME.hover });
  const S = {
    phase: 'idle', pourTarget: null,
    phi: HOME.phi, u: HOME.u, v: HOME.v, psi: HOME.psi, dphi: 0, du: 0, dv: 0, dpsi: 0,
    tPhi: HOME.phi, tU: HOME.u, tV: HOME.v, tPsi: HOME.psi,
    vol: 0, full: false,
    goal: homeGoal(),
    queue: [], stepT: 0,
    pour: null,
    armed: 0, armX: 0, armY: 0, armZ: 0,
    overBed: false,
    hint: 0, hintT: 0, pop: 0, time: 0,
    armSpeed: 0, digRate: 0, pourRate: 0, digQuiet: 1, sprayAcc: 0, pourAcc: 0, pourAcc2: 0, carryT: 0, landT: 0,
    resetT: -1, healRow: 0,
    shipped: 0, refill: 0, vol0: 0,
  };
  const state = { phase: 'idle', pourTarget: null, bucketFill: 0, bedFill: 0, armSpeed: 0, digRate: 0, pourRate: 0 };
  const sol = machine.sol;
  const W = new THREE.Vector3(), TIP = new THREE.Vector3(), CEN = new THREE.Vector3(), prevTip = new THREE.Vector3(), tipVel = new THREE.Vector3();
  const prevW = new THREE.Vector3();
  let prevValid = false;
  const fp = { uMin: 0, uMax: 0, uMid: 0, low: 0 };
  const cyl = { phi: 0, u: 0 };
  const v3 = new THREE.Vector3(), v3b = new THREE.Vector3();
  const lray = new THREE.Ray();

  function toCyl(x, z, out) {
    const tx = x - exPos.x, tz = z - exPos.z;
    const r = Math.max(Math.hypot(tx, tz), Math.abs(P.armX) + 0.02);
    out.u = Math.sqrt(r * r - P.armX * P.armX);
    out.phi = Math.atan2(-tx, -tz) + Math.atan2(P.armX, out.u) - yaw;
    return out;
  }
  function toWorld(phi, u, v, out) {
    const a = phi + yaw, c = Math.cos(a), s = Math.sin(a);
    return out.set(exPos.x + P.armX * c - u * s, turretY + v, exPos.z - P.armX * s - u * c);
  }
  // 砂場の内側・届く範囲に丸める
  function clampAim(p, rMax) {
    p.x = clamp(p.x, sb.minX + 0.09, sb.maxX - 0.09);
    p.z = clamp(p.z, sb.minZ + 0.09, sb.maxZ - 0.09);
    let rx = p.x - exPos.x, rz = p.z - exPos.z;
    let r = Math.hypot(rx, rz);
    if (r < 1e-4) { rx = 0; rz = -1; r = 1; }
    const rc = clamp(r, P.reachMin, rMax);
    if (rc !== r) { p.x = exPos.x + (rx / r) * rc; p.z = exPos.z + (rz / r) * rc; }
    return p;
  }

  // =====================================================================
  // 指 → 目標
  // =====================================================================
  function rayToTruck(ray, out) {
    if (!bedAvailable || T.tilt) return false;
    lray.copy(ray).applyMatrix4(bedInv);
    if (!lray.intersectBox(koBox, v3)) return false;
    // 荷台の壁の上端の面で指の位置を拾い、内のりに丸める
    const dy = lray.direction.y;
    let lx = v3.x, lz = v3.z;
    if (dy < -1e-4) { const t = (BH - lray.origin.y) / dy; if (t > 0) { lx = lray.origin.x + lray.direction.x * t; lz = lray.origin.z + lray.direction.z * t; } }
    out.x = clamp(lx, -BW / 2 + 0.09, BW / 2 - 0.09);
    out.z = clamp(lz, -BL / 2 + 0.1, BL / 2 - 0.1);
    return true;
  }
  // 指のレイが砂地（arr の高さ）に当たる点
  function rayToGround(ray, arr, out) {
    const o = ray.origin, d = ray.direction;
    if (d.y > -0.02) { // 上向き：その方角のいちばん遠く
      out.set(o.x + d.x * 20, baseY, o.z + d.z * 20);
      return true;
    }
    const tA = (baseY + P.maxH - o.y) / d.y, tB = (baseY + P.minH - 0.02 - o.y) / d.y;
    let prev = Math.max(0, tA), hit = -1;
    for (let t = prev; t <= tB + 0.03; t += 0.03) {
      const x = o.x + d.x * t, z = o.z + d.z * t, y = o.y + d.y * t;
      const h = ter.inside(x, z) ? baseY + sampleArr(arr, x, z) : baseY;
      if (y <= h) { hit = t; break; }
      prev = t;
    }
    if (hit < 0) hit = (baseY - o.y) / d.y;
    else {
      let a = prev, b = hit;
      for (let k = 0; k < 6; k++) {
        const m = (a + b) / 2, x = o.x + d.x * m, z = o.z + d.z * m;
        const h = ter.inside(x, z) ? baseY + sampleArr(arr, x, z) : baseY;
        if (o.y + d.y * m <= h) b = m; else a = m;
      }
      hit = b;
    }
    out.set(o.x + d.x * hit, 0, o.z + d.z * hit);
    return true;
  }

  // =====================================================================
  // 目標（goal）→ 手首の目標 (tPhi, tU, tV, tPsi)
  // =====================================================================
  const distB = (u, v) => Math.hypot(u - kin.B.u, v - kin.B.v);
  let noDig = false; // この目標では砂に入らない（上をなでる／持ち上げている）
  function planGround(g) {
    v3.set(g.x, 0, g.z);
    const f = clamp(S.vol / P.bucketCap, 0, 1);
    const hover = g.hover || 0;
    const digging = hover <= 0 && !S.full;
    clampAim(v3, digging ? P.reachMax : P.reachMax - 0.12);
    toCyl(v3.x, v3.z, cyl);
    const hNow = heightAt(v3.x, v3.z);
    const hRef = baseY + sampleArr(refH, v3.x, v3.z);
    let psi, bottom;
    if (hover > 0) { psi = S.vol > 1e-6 ? P.psiCarry : P.psiRest; bottom = hNow + hover; noDig = true; }
    else if (S.full) {
      // 満杯：砂の面をすれすれに押して進む。入りきらない砂は両わきへこぼれて、浅いすじと小さな土手が残る
      psi = P.psiCarry; bottom = Math.max(hRef - P.fullSkim, baseY + P.minH); noDig = false;
    }
    else {
      psi = lerp(P.psiDig, P.psiCarry, f);
      const depth = P.digDepth * clamp((1 - f) / 0.4, 0.15, 1) * (g.depthK || 1);
      bottom = Math.max(hRef - depth, baseY + P.minH);
      noDig = false;
    }
    kin.footprint(psi, fp);
    let wu = cyl.u - fp.uMid, wv = bottom - turretY - fp.low;
    if (distB(wu, wv) > kin.RMAX - 0.004) {
      // 遠くて届かない：バケットを（こぼれない範囲で）開いて届かせる
      const pMax = Math.max(psi, Math.min(kin.psiHold(f), -58 * DEG));
      if (pMax > psi + 1e-3) {
        let a = psi, b = pMax;
        kin.footprint(b, fp);
        if (distB(cyl.u - fp.uMid, bottom - turretY - fp.low) <= kin.RMAX - 0.004) {
          for (let k = 0; k < 8; k++) {
            const m = (a + b) / 2;
            kin.footprint(m, fp);
            if (distB(cyl.u - fp.uMid, bottom - turretY - fp.low) <= kin.RMAX - 0.004) b = m; else a = m;
          }
        }
        psi = b;
        kin.footprint(psi, fp);
        wu = cyl.u - fp.uMid; wv = bottom - turretY - fp.low;
      }
    }
    S.tPhi = cyl.phi; S.tU = wu; S.tV = wv; S.tPsi = psi;
  }
  function planBed(g) {
    // 荷台の上：手首を荷台の幅のまん中あたりに置くと、傾けた時に砂の流れ全体が荷台の中に落ちる。
    // 荷台の長さ方向（lz）は指で選べる。口を上にして待つ
    const lx = -0.06;
    const x = T.x + lx * T.cos + g.lz * T.sin, z = T.z - lx * T.sin + g.lz * T.cos;
    toCyl(x, z, cyl);
    const heap = Math.max(BH, Math.min(bedTop, BH + 0.08));
    S.tPhi = cyl.phi;
    S.tU = cyl.u;
    S.tV = T.y + heap + 0.075 + 0.205 - turretY;
    S.tPsi = S.vol > 1e-6 ? P.psiCarry : P.psiRest;
    noDig = true;
  }
  function plan() {
    const g = S.goal;
    if (g.kind === 'ground') planGround(g);
    else if (g.kind === 'bed') { if (bedAvailable) planBed(g); else { S.goal = { kind: 'pose', phi: S.phi, u: S.u, v: S.v, psi: S.vol > 1e-6 ? P.psiCarry : P.psiRest }; noDig = true; } }
    else { S.tPhi = g.phi; S.tU = g.u; S.tV = g.v; S.tPsi = g.psi != null ? g.psi : (S.vol > 1e-6 ? P.psiCarry : P.psiRest); noDig = true; }
    if (!Number.isFinite(S.tPhi + S.tU + S.tV + S.tPsi)) { S.tPhi = S.phi; S.tU = S.u; S.tV = S.v; S.tPsi = S.psi; }
  }

  // =====================================================================
  // 自動動作（queue の手順を順に）
  // =====================================================================
  function holdGoal(hover) {
    // 今いる所で持ち上げて待つ
    return { kind: 'ground', x: CEN.x, z: CEN.z, hover };
  }
  function liftCarry() {
    S.queue.length = 0;
    S.goal = holdGoal(S.vol > 1e-6 ? 0.2 : 0.16);
    S.phase = 'idle';
  }
  function startQueue(steps) {
    S.queue = steps; S.stepT = 0; S.phase = 'auto';
    if (steps.length && steps[0].goal) S.goal = steps[0].goal;
  }
  function scoopAt(p) {
    if (S.phase === 'pour') return false;
    v3b.set(p.x, 0, p.z);
    clampAim(v3b, P.reachMax);
    if (S.full) { startQueue([{ goal: { kind: 'ground', x: v3b.x, z: v3b.z, hover: 0.18 }, arrive: true, timeout: 1.6 }]); return true; }
    let rx = v3b.x - exPos.x, rz = v3b.z - exPos.z;
    const r = Math.hypot(rx, rz) || 1; rx /= r; rz /= r;
    const rOut = clamp(r + 0.1, P.reachMin + 0.3, P.reachMax), rIn = rOut - 0.3;
    const x0 = exPos.x + rx * rOut, z0 = exPos.z + rz * rOut, x1 = exPos.x + rx * rIn, z1 = exPos.z + rz * rIn;
    snapshotRef();
    startQueue([
      { goal: { kind: 'ground', x: x0, z: z0, hover: 0.07 }, arrive: true, timeout: 1.3 },
      { stroke: { x0, z0, x1, z1, T: 0.55 }, goal: { kind: 'ground', x: x0, z: z0 } },
      { goal: { kind: 'ground', x: x1, z: z1, hover: 0.2 }, arrive: true, timeout: 1.0 },
    ]);
    return true;
  }
  function bestBedSpot() {
    // 荷台の中で低い所を選ぶ（平らに積める）
    let best = 0, bh = Infinity;
    for (const lz of [0.0, -0.11, 0.11]) { const h = bedG.sample(-0.02, lz) + Math.abs(lz) * 0.08; if (h < bh) { bh = h; best = lz; } }
    return best;
  }
  const homeStep = () => ({ goal: homeGoal(), arrive: true, timeout: 1.6 });
  function dumpToBed(lx, lz) {
    if (S.vol <= 1e-6 || !bedAvailable || S.phase === 'pour' || T.tilt) return false;
    const g = { kind: 'bed', lx: lx != null ? lx : -0.02, lz: lz != null ? lz : bestBedSpot() };
    startQueue([{ goal: g, arrive: true, timeout: 2.4 }, { pour: true, goal: g }, homeStep()]);
    return true;
  }
  function pourHere() {
    if (S.vol <= 1e-6 || S.phase === 'pour') return false;
    // その場で少し持ち上げてからあける
    const g = { kind: 'pose', phi: S.phi, u: clamp(S.u, 0.66, 0.98), v: Math.max(S.v, heightAt(CEN.x, CEN.z) + 0.4 - turretY), psi: P.psiCarry };
    startQueue([{ goal: g, arrive: true, timeout: 0.9 }, { pour: true, goal: g }, { goal: { kind: 'pose', phi: g.phi, u: g.u, v: g.v - 0.08, psi: P.psiRest }, arrive: true, timeout: 0.7 }]);
    return true;
  }
  function goHome() { startQueue([homeStep()]); return true; }

  function arrived() {
    const eV = S.goal.kind === 'ground' && !noDig ? 0.05 : 0.03;
    return Math.abs(wrapPi(S.tPhi - S.phi)) * Math.max(0.4, S.u) < 0.035 && Math.abs(S.tU - S.u) < 0.03 && Math.abs(S.tV - S.v) < eV
      && Math.abs(S.tPsi - S.psi) < 0.2 && Math.abs(S.dphi) < 0.6 && Math.abs(S.du) + Math.abs(S.dv) < 0.5;
  }
  function startPour() {
    S.phase = 'pour';
    // あけた砂が落ちる所（刃先が下を向いた時の先）が荷台の中か
    toWorld(S.phi, S.u + P.Lb * 0.5, 0, v3);
    const lx = toBedX(v3.x, v3.z), lz = toBedZ(v3.x, v3.z);
    const target = bedAvailable && !T.tilt && Math.abs(lx) < BW / 2 + 0.03 && Math.abs(lz) < BL / 2 + 0.03 ? 'bed' : 'ground';
    S.pourTarget = target;
    S.pour = { t: 0, vol0: S.vol, emptyT: -1, target };
    onEvent('pourStart', { target, volume: S.vol });
  }
  function endPour() {
    const pr = S.pour;
    S.pour = null; S.pourTarget = null; S.full = false;
    S.phase = 'auto';
    onEvent('pourEnd', { target: pr.target, volume: pr.vol0, bedFill: bedG.volume() / bedFullVol });
  }
  function stepQueue(dt) {
    if (S.phase !== 'auto' && S.phase !== 'pour') return;
    const st = S.queue[0];
    if (!st) { S.phase = 'idle'; return; }
    S.stepT += dt;
    if (st.goal && S.phase !== 'pour') S.goal = st.goal;
    let done = false;
    if (st.pour) {
      if (S.phase !== 'pour') { if (S.vol > 1e-6) startPour(); else done = true; }
      else {
        const pr = S.pour;
        pr.t += dt;
        if (S.vol <= 0 && pr.emptyT < 0) pr.emptyT = pr.t;
        if (pr.t > 1.9 && S.vol > 0) flushBucket();
        if ((pr.emptyT >= 0 && pr.t - pr.emptyT > 0.1 && grains.countKind(1) === 0) || pr.t > 3.2) { endPour(); done = true; }
      }
    } else if (st.stroke) {
      const k = st.stroke, s = smooth((S.stepT - 0.16) / k.T);
      st.goal.x = lerp(k.x0, k.x1, s); st.goal.z = lerp(k.z0, k.z1, s);
      if (S.stepT > k.T + 0.3 || (S.full && S.stepT > 0.2)) done = true;
    } else if (st.arrive) {
      if (S.stepT > 0.05 && (arrived() || S.stepT > (st.timeout || 1.5))) done = true;
    } else done = true;
    if (done) {
      S.queue.shift(); S.stepT = 0;
      if (!S.queue.length) {
        S.phase = 'idle';
        if (S.goal.kind === 'ground' && !S.goal.hover) S.goal = holdGoal(S.vol > 1e-6 ? 0.2 : 0.16);
      }
    }
  }

  // =====================================================================
  // 入力
  // =====================================================================
  const aim = { x: 0, z: 0 };
  function startFollow() {
    S.queue.length = 0;
    S.phase = 'follow';
    S.overBed = false;
    snapshotRef();
    S.pop = 1;
    onEvent('grab', {});
  }
  function followAim(ray) {
    if (rayToTruck(ray, aim)) {
      S.overBed = true;
      S.goal = { kind: 'bed', lx: aim.x, lz: aim.z };
      return;
    }
    S.overBed = false;
    if (rayToGround(ray, refH, v3)) S.goal = { kind: 'ground', x: v3.x, z: v3.z };
  }
  function handleInput(p) {
    if (!p || !p.ray) return;
    if ((p.pressed || p.down) && S.phase !== 'pour' && S.phase !== 'follow') {
      startFollow();
      // バケットを直接つかんだ時は、指が動く（か少し待つ）まではその場で待つ：トンであける時に砂へもぐらない
      if (p.onHandle && p.pressed) { S.armed = 0.14; S.armX = p.ray.direction.x; S.armY = p.ray.direction.y; S.armZ = p.ray.direction.z; S.goal = holdGoal(Math.max(0.02, CEN.y - 0.1 - heightAt(CEN.x, CEN.z))); }
      else S.armed = 0;
    }
    if (S.phase === 'follow' && (p.down || p.pressed)) {
      if (S.armed > 0) {
        const d = p.ray.direction;
        if (Math.abs(d.x - S.armX) + Math.abs(d.y - S.armY) + Math.abs(d.z - S.armZ) > 0.012) S.armed = 0;
      }
      if (S.armed <= 0) followAim(p.ray);
    }
    if (p.released) {
      onEvent('release', {});
      if (S.phase === 'pour') return;
      const wasFollow = S.phase === 'follow';
      S.armed = 0;
      if (p.tap) {
        const overTruck = rayToTruck(p.ray, aim);
        if (p.onHandle) {
          if (S.vol > 1e-6) { if (overTruck && S.overBed) dumpToBed(aim.x, aim.z); else pourHere(); }
          else if (!overTruck && rayToGround(p.ray, ter.H, v3)) scoopAt(v3);
          else liftCarry();
        } else if (overTruck) { if (!dumpToBed(aim.x, aim.z)) liftCarry(); }
        else if (rayToGround(p.ray, ter.H, v3)) scoopAt(v3);
        else liftCarry();
      } else if (wasFollow) {
        if (S.overBed && S.vol > 1e-6 && bedAvailable && S.goal.kind === 'bed') dumpToBed(S.goal.lx, S.goal.lz);
        else if (S.overBed) goHome();   // 空のまま荷台の上で離した：トラックをトンしやすいようにどく
        else liftCarry();
      }
    }
  }

  // =====================================================================
  // 動き：ばね追従（旋回・伸縮・上下・バケット角）
  // =====================================================================
  function springStep(x, vel, target, w, dt, vmax, out) {
    const e = Math.exp(-w * dt), d0 = x - target, c2 = vel + w * d0;
    let nx = target + (d0 + c2 * dt) * e, nv = (vel - w * c2 * dt) * e;
    if (nv > vmax || nv < -vmax || Math.abs(nx - x) > vmax * dt) { nv = clamp(nv, -vmax, vmax); nx = x + clamp(nx - x, -vmax * dt, vmax * dt); }
    out[0] = nx; out[1] = nv;
  }
  const sp = [0, 0];
  function move(dt) {
    // バケットの今の足あと
    kin.footprint(S.psi, fp);
    const low = fp.low, mid = fp.uMid;
    // トラックの箱と（なでる時は）砂の山を越える高さ
    toWorld(S.phi, S.u + mid, 0, v3);
    let need = obstacleTop(v3.x, v3.z);
    const la = 0.11;
    toWorld(S.phi + S.dphi * la, S.u + mid + S.du * la, 0, v3b);
    const needAhead = Math.max(need, obstacleTop(v3b.x, v3b.z));
    if (noDig) {
      const g = S.goal.kind === 'ground' ? 0.03 : 0.045;
      need = Math.max(need, heightAt(v3.x, v3.z) + g);
    }
    const bottom = turretY + S.v + low;
    let slow = 1;
    if (needAhead > bottom + 0.012) slow = clamp(1 - (needAhead - bottom) / 0.14, 0.1, 1);
    const tV = clamp(Math.max(S.tV, Math.max(need, needAhead) - low - turretY), -0.45, P.wristVMax);
    const pouring = S.phase === 'pour';
    // 旋回
    const dPhi = wrapPi(S.tPhi - S.phi);
    springStep(S.phi, S.dphi, S.phi + dPhi, P.omega, dt, P.maxSwingSpeed * slow, sp); S.phi = wrapPi(sp[0]); S.dphi = sp[1];
    springStep(S.u, S.du, clamp(S.tU, 0.2, 1.4), P.omega, dt, P.maxLinSpeed * slow, sp); S.u = sp[0]; S.du = sp[1];
    springStep(S.v, S.dv, tV, P.omega, dt, P.maxLinSpeed, sp); S.v = sp[0]; S.dv = sp[1];
    const tPsi = pouring ? P.psiDump : S.tPsi;
    springStep(S.psi, S.dpsi, tPsi, pouring ? 9 : P.omegaPsi, dt, pouring ? 4.2 : P.maxPsiSpeed, sp); S.psi = sp[0]; S.dpsi = sp[1];
    // めり込み防止（箱の中へは入らない）
    const hard = need - 0.02 - low - turretY;
    if (S.v < hard) { S.v = Math.min(hard, S.v + 3.5 * dt + 0.002); if (S.dv < 0) S.dv = 0; }
    if (!Number.isFinite(S.phi + S.u + S.v + S.psi + S.dphi + S.du + S.dv + S.dpsi)) {
      S.phi = HOME.phi; S.u = HOME.u; S.v = HOME.v; S.psi = HOME.psi; S.dphi = S.du = S.dv = S.dpsi = 0;
    }
  }

  // =====================================================================
  // 掘る：バケットの下側の形より上にある砂を削り、削った分をバケットへ
  // =====================================================================
  const ENV_K = 12;
  const env = new Float32Array(ENV_K), envR = { uMin: 0, uMax: 0 };
  const halfW = P.bucketW / 2;
  function carveAt(wx, wy, wz, eux, euz) {
    const uMin = envR.uMin, uMax = envR.uMax, span = Math.max(1e-4, uMax - uMin);
    // 足あとの外接箱
    const cx = wx + eux * (uMin + uMax) / 2, cz = wz + euz * (uMin + uMax) / 2;
    const ext = span / 2 + halfW + 0.01;
    const ix0 = Math.max(1, Math.floor((cx - ext - sb.minX) / ter.dx)), ix1 = Math.min(NX - 1, Math.ceil((cx + ext - sb.minX) / ter.dx));
    const iz0 = Math.max(1, Math.floor((cz - ext - sb.minZ) / ter.dz)), iz1 = Math.min(NZ - 1, Math.ceil((cz + ext - sb.minZ) / ter.dz));
    if (ix1 < ix0 || iz1 < iz0) return 0;
    const H = ter.H, wet = ter.wet;
    let removed = 0, bx0 = 1e9, bz0 = 1e9, bx1 = -1, bz1 = -1;
    for (let iz = iz0; iz <= iz1; iz++) {
      const rz = sb.minZ + iz * ter.dz - wz;
      for (let ix = ix0; ix <= ix1; ix++) {
        const rx = sb.minX + ix * ter.dx - wx;
        const u = rx * eux + rz * euz;
        if (u < uMin || u > uMax) continue;
        const w = -rx * euz + rz * eux;
        if (w > halfW || w < -halfW) continue;
        const t = ((u - uMin) / span) * (ENV_K - 1);
        const k = Math.min(ENV_K - 2, t | 0), fr = t - k;
        const yb = wy + env[k] * (1 - fr) + env[k + 1] * fr - baseY;
        const i = iz * ter.VX + ix;
        const fl = yb > floorArr[i] ? yb : floorArr[i];
        if (H[i] > fl) {
          removed += H[i] - fl; H[i] = fl; wet[i] = 1;
          // まわりも少し湿らせる（縁をなめらかに）
          if (wet[i - 1] < 0.5) wet[i - 1] = 0.5;
          if (wet[i + 1] < 0.5) wet[i + 1] = 0.5;
          if (wet[i - ter.VX] < 0.5) wet[i - ter.VX] = 0.5;
          if (wet[i + ter.VX] < 0.5) wet[i + ter.VX] = 0.5;
          if (ix < bx0) bx0 = ix; if (ix > bx1) bx1 = ix; if (iz < bz0) bz0 = iz; if (iz > bz1) bz1 = iz;
        }
      }
    }
    if (removed > 0) { ter.touch(bx0 - 1, bz0 - 1, bx1 + 1, bz1 + 1); ter.activate(bx0 - 2, bz0 - 2, bx1 + 2, bz1 + 2); ter.markVolume(); }
    return removed * ter.cellA;
  }
  function dig(dt) {
    let removed = 0;
    const a = S.phi + yaw, eux = -Math.sin(a), euz = -Math.cos(a);
    if (S.phase !== 'pour' && W.y + fp.low < baseY + P.maxH && S.resetT < 0) {
      kin.underside(sol.psi, env, envR);
      // 速い動きは途中も削る（すき間ができないように）
      const n = prevValid ? clamp(Math.ceil(Math.hypot(W.x - prevW.x, W.z - prevW.z) / (ter.dx * 0.7)), 1, 4) : 1;
      for (let k = 1; k <= n; k++) {
        const t = k / n;
        removed += carveAt(lerp(prevW.x, W.x, t), lerp(prevW.y, W.y, t), lerp(prevW.z, W.z, t), eux, euz);
      }
    }
    prevW.copy(W); prevValid = true;
    if (removed > 0) {
      const room = Math.max(0, P.bucketCap - S.vol);
      let take = Math.min(removed, room);
      const over = removed - take;
      // 少しだけ砂を飛ばす（ざくっ）
      S.sprayAcc += take * 0.05; take *= 0.95;
      S.vol += take;
      while (S.sprayAcc >= grainVol * 0.6) {
        S.sprayAcc -= grainVol * 0.6;
        const r = (grains.rnd() - 0.5) * P.bucketW;
        grains.emit(TIP.x + Math.cos(a) * r, Math.max(TIP.y, heightAt(TIP.x, TIP.z)) + 0.02, TIP.z - Math.sin(a) * r,
          tipVel.x * 0.4 + (grains.rnd() - 0.5) * 0.5, 0.7 + grains.rnd() * 0.6, tipVel.z * 0.4 + (grains.rnd() - 0.5) * 0.5, grainVol * 0.6, 2);
      }
      // 入りきらない分は横へこぼれる
      if (over > 0) spill(over, a);
      if (S.digQuiet > 0.25) onEvent('digStart', { x: TIP.x, z: TIP.z });
      S.digQuiet = 0;
      if (!S.full && S.vol >= P.bucketCap * 0.975) { S.full = true; onEvent('bucketFull', {}); }
    } else S.digQuiet += dt;
    if (S.full && S.vol < P.bucketCap * 0.8) S.full = false;
    S.digRate += (removed / dt - S.digRate) * Math.min(1, dt * 12);
  }
  function spill(vol, a) {
    S.pourAcc2 += vol;
    while (S.pourAcc2 >= grainVol) {
      S.pourAcc2 -= grainVol;
      const side = grains.rnd() < 0.5 ? -1 : 1, along = (grains.rnd() - 0.5) * 0.16;
      const ex = Math.cos(a), ez = -Math.sin(a), ux = -Math.sin(a), uz = -Math.cos(a);
      grains.emit(CEN.x + ex * side * (halfW + 0.01) + ux * along, CEN.y + 0.02, CEN.z + ez * side * (halfW + 0.01) + uz * along,
        ex * side * (0.35 + grains.rnd() * 0.3) + tipVel.x * 0.3, 0.5 + grains.rnd() * 0.5, ez * side * (0.35 + grains.rnd() * 0.3) + tipVel.z * 0.3, grainVol, 2);
    }
  }

  // =====================================================================
  // あける：傾きで持てる量が決まり、持てない分が縁から粒になって落ちる
  // =====================================================================
  const tipDirU = (() => { const c = P.bucketCurve; const x = c[3][0] - c[2][0], y = c[3][1] - c[2][1], l = Math.hypot(x, y); return [x / l, y / l]; })();
  function emitPour(vol, kind) {
    const a = S.phi + yaw, ex = Math.cos(a), ez = -Math.sin(a), ux = -Math.sin(a), uz = -Math.cos(a);
    // 底の向き（刃先へ滑る向き）
    const c = Math.cos(sol.psi), s = Math.sin(sol.psi);
    const fu = tipDirU[0] * c - tipDirU[1] * s, fv = tipDirU[0] * s + tipDirU[1] * c;
    const r = (grains.rnd() - 0.5) * 2 * (halfW - 0.02), back = grains.rnd() * 0.05;
    const sl = 0.12 + grains.rnd() * 0.22;
    grains.emit(TIP.x + ex * r - ux * fu * back, TIP.y - fv * back + 0.004, TIP.z + ez * r - uz * fu * back,
      tipVel.x * 0.3 + ux * fu * sl + (grains.rnd() - 0.5) * 0.12, tipVel.y * 0.3 + fv * sl, tipVel.z * 0.3 + uz * fu * sl + (grains.rnd() - 0.5) * 0.12, vol, kind);
  }
  function flushBucket() {
    if (S.vol > 0) { emitPour(S.vol + S.pourAcc, 1); S.vol = 0; S.pourAcc = 0; }
  }
  function pourAndSpill(dt) {
    let out = 0;
    const hold = P.bucketCap * kin.holdFrac(sol.psi);
    if (S.vol > hold + 1e-7) {
      out = Math.min(S.vol - hold, (P.bucketCap / P.pourTime) * dt);
      if (S.vol - out < grainVol * 0.5 && hold <= 0) out = S.vol;
      S.vol -= out;
      S.pourAcc += out;
      const kind = S.phase === 'pour' ? 1 : 2;
      while (S.pourAcc >= grainVol) { S.pourAcc -= grainVol; emitPour(grainVol, kind); }
      if (S.vol <= 0) { S.vol = 0; if (S.pourAcc > 0) { emitPour(S.pourAcc, kind); S.pourAcc = 0; } }
    }
    // 運んでいる途中：山盛りで速く動くと少しこぼれる
    if (S.phase !== 'pour' && S.vol > P.bucketCap * 0.9 && S.armSpeed > 1.3) {
      S.carryT += dt;
      if (S.carryT > 0.09) {
        S.carryT = 0;
        const v = Math.min(grainVol * 0.5, S.vol);
        S.vol -= v;
        grains.emit(CEN.x + (grains.rnd() - 0.5) * 0.12, CEN.y + 0.03, CEN.z + (grains.rnd() - 0.5) * 0.12, tipVel.x * 0.5, 0.25, tipVel.z * 0.5, v, 2);
      }
    }
    S.pourRate += (out / dt - S.pourRate) * Math.min(1, dt * 14);
  }

  // =====================================================================
  // 粒の着地（荷台 → トラックの箱 → 砂場の枠 → 砂地）
  // =====================================================================
  let truckNear = true, grainDt = 0.016;
  function landed(target, x, y, z, vol) {
    if (S.landT > 0.05) { S.landT = 0; onEvent('land', { target, x, y, z, volume: vol }); }
  }
  function collide(i) {
    const x = grains.px[i], y = grains.py[i], z = grains.pz[i], vol = grains.vol[i];
    if (truckNear) {
      const e = bedInv.elements;
      let lx = e[0] * x + e[4] * y + e[8] * z + e[12], ly = e[1] * x + e[5] * y + e[9] * z + e[13], lz = e[2] * x + e[6] * y + e[10] * z + e[14];
      const inBed = Math.abs(lx) < BW / 2 && Math.abs(lz) < BL / 2;
      if (inBed) {
        const surf = Math.max(0, bedG.sample(lx, lz)) + 0.004;
        if (ly > surf) return false;
        // 上から来て砂の面（か床）を通り過ぎた → 荷台に積もる（1コマで床を突き抜けた分も拾う）
        const lyPrev = ly - grains.vy[i] * grainDt * T.uy;
        if (lyPrev > -0.03 && bedAvailable) {
          bedG.deposit(lx, lz, vol, 0.62, 0);
          landed('bed', x, y, z, vol);
          return true;
        }
      }
      if (lx > KO.x0 && lx < KO.x1 && lz > KO.z0 && lz < KO.z1 && ly > -0.2) {
        const overBed = lz > -BL / 2 - 0.03;
        const top = overBed ? (lz < -BL / 2 ? BH + 0.06 : BH) + 0.004 : KO.y1;
        if (ly < top) {
          // 壁・運転台に当たった：近い側へ押し出す（荷台の縁のすぐ内側なら中へ）
          let ox = 0, oz = 0;
          if (overBed && bedAvailable && Math.abs(lx) < BW / 2 + 0.012 && lz < BL / 2 + 0.012 && lz > -BL / 2 - 0.012) {
            lx = clamp(lx, -BW / 2 + 0.006, BW / 2 - 0.006); lz = clamp(lz, -BL / 2 + 0.006, BL / 2 - 0.006);
          } else {
            const dxm = lx - KO.x0, dxp = KO.x1 - lx, dzp = KO.z1 - lz;
            if (overBed && dzp < dxm && dzp < dxp) { lz = KO.z1 + 0.012; oz = 1; }
            else if (dxm < dxp) { lx = KO.x0 - 0.012; ox = -1; }
            else { lx = KO.x1 + 0.012; ox = 1; }
          }
          const m = bedM.elements;
          grains.px[i] = m[0] * lx + m[4] * ly + m[8] * lz + m[12];
          grains.py[i] = m[1] * lx + m[5] * ly + m[9] * lz + m[13];
          grains.pz[i] = m[2] * lx + m[6] * ly + m[10] * lz + m[14];
          grains.vx[i] = (m[0] * ox + m[8] * oz) * 0.3; grains.vz[i] = (m[2] * ox + m[10] * oz) * 0.3;
          if (grains.vy[i] > 0) grains.vy[i] = 0;
          return grains.age[i] > 5 ? (ter.deposit(x, z, vol, 0.75, 2), true) : false;
        }
      }
    }
    if (x >= sb.minX && x <= sb.maxX && z >= sb.minZ && z <= sb.maxZ) {
      if (y <= baseY + ter.sample(x, z)) {
        ter.deposit(x, z, vol, 0.75, 2);
        landed('ground', x, y, z, vol);
        return true;
      }
      return false;
    }
    // 砂場の外：枠に当たったら中へ戻す
    if (y < baseY + 0.17) {
      grains.px[i] = clamp(x, sb.minX + 0.02, sb.maxX - 0.02); grains.pz[i] = clamp(z, sb.minZ + 0.02, sb.maxZ - 0.02);
      grains.vx[i] *= -0.2; grains.vz[i] *= -0.2;
      if (y <= baseY - 0.02 || grains.age[i] > 5) { ter.deposit(x, z, vol, 0.75, 2); return true; }
    }
    return false;
  }
  // 荷台の壁を越えた砂は外へこぼれる
  function bedOverflow() {
    if (!bedAvailable || T.tilt) return;
    const H = bedG.H, VX = bedG.VX;
    let any = false;
    for (let iz = 0; iz <= BNZ; iz++) {
      const edgeZ = iz === 0 || iz === BNZ;
      for (let ix = 0; ix <= BNX; ix += edgeZ ? 1 : BNX) {
        const i = iz * VX + ix;
        const side = iz === 0 ? 0 : iz === BNZ ? 1 : ix === 0 ? 2 : 3;
        const lim = (side === 0 ? BH + 0.06 : BH) + 0.014;
        if (H[i] > lim) {
          spillAcc[side] += (H[i] - lim) * bedG.cellA; H[i] = lim; any = true;
          bedG.touch(ix, iz, ix, iz);
          if (spillAcc[side] >= grainVol) {
            const v = spillAcc[side]; spillAcc[side] = 0;
            const ox = side === 2 ? -1 : side === 3 ? 1 : 0, oz = side === 0 ? -1 : side === 1 ? 1 : 0;
            v3.set(-BW / 2 + ix * bedG.dx + ox * 0.045, lim + 0.012, -BL / 2 + iz * bedG.dz + oz * 0.045).applyMatrix4(bedM);
            const m = bedM.elements;
            grains.emit(v3.x, v3.y, v3.z, (m[0] * ox + m[8] * oz) * 0.35, 0.1, (m[2] * ox + m[10] * oz) * 0.35, v, 2);
          }
        }
      }
    }
    if (any) bedG.markVolume();
  }

  // =====================================================================
  // 砂地の手入れ：縁からの補充・深い穴のゆっくりした戻り・湿りの乾き・ならし直し
  // =====================================================================
  function tendTerrain(dt) {
    const H = ter.H, wet = ter.wet, VX = ter.VX;
    if (S.resetT >= 0) {
      // ならし直し：0.7 秒かけて新しい起伏へ
      S.resetT += dt;
      const k = S.resetT >= 0.7 ? 1 : 1 - Math.exp(-dt * 9);
      for (let i = 0; i < TN; i++) { H[i] += (seedH[i] - H[i]) * k; wet[i] *= 1 - k; }
      ter.touchAll(); ter.markVolume();
      if (S.resetT >= 0.7) { S.resetT = -1; S.vol0 = ter.volume(); S.shipped = 0; S.refill = 0; }
      return;
    }
    // 1回に数行ずつ（全体を約 0.5 秒で一巡）
    const rows = Math.max(1, Math.round((NZ + 1) * Math.min(1, dt / 0.5)));
    const period = 0.5;
    const kHeal = 1 - Math.exp(-period / P.healTau), kWet = Math.exp(-period / P.wetTau);
    const kE = [1, 1 - Math.exp(-period / 6), 1 - Math.exp(-period / 20)];
    for (let r = 0; r < rows; r++) {
      const iz = S.healRow; S.healRow = (S.healRow + 1) % (NZ + 1);
      let ch = false, add = 0;
      for (let ix = 0; ix <= NX; ix++) {
        const i = iz * VX + ix, h = H[i];
        const e = edgeD[i];
        if (e < 3) { const d = (seedH[i] - h) * kE[e]; if (d > 1e-5 || d < -1e-5) { H[i] = h + d; add += d; ch = true; } }
        else if (h < P.healLevel) { const d = (P.healLevel - h) * kHeal; H[i] = h + d; add += d; ch = true; }
        // 湿り：掘った所・積もった所は、深さ（高さ）に応じた濃さまでしか乾かない → 跡が色でも残る
        const dev = H[i] - seedH[i];
        const tg = e < 2 ? 0 : dev < 0 ? Math.min(0.62, -dev * 9) : Math.min(0.42, dev * 6.5);
        const w = wet[i];
        if (w > tg + 0.004) { wet[i] = tg + (w - tg) * kWet; ch = true; }
        else if (w < tg - 0.02) { wet[i] = w + (tg - w) * 0.25; ch = true; }
      }
      if (ch) ter.touch(0, iz, NX, iz);
      if (add !== 0) { S.refill += add * ter.cellA; ter.markVolume(); }
    }
  }

  // =====================================================================
  // 毎フレーム
  // =====================================================================
  function pose(dt) {
    // 光る時のぴょこっ・待機の呼吸（見た目だけの上下）
    let bob = 0;
    if (S.hint > 0) { const ph = (S.hintT % 0.6) / 0.6; bob = (ph < 0.5 ? Math.sin(ph * 2 * Math.PI) : 0) * S.hint; }
    const idle = S.phase === 'idle';
    const breathe = idle ? Math.sin(S.time * 1.7) * 0.006 : 0;
    kin.solve(S.u, S.v + breathe + bob * 0.035, S.psi + (idle ? Math.sin(S.time * 1.3) * 0.02 : 0), sol);
    kin.linkage(sol);
    machine.applyPose(sol, S.phi);
    toWorld(S.phi, sol.Wu, sol.Wv, W);
    toWorld(S.phi, sol.Tu, sol.Tv, TIP);
    CEN.copy(W).add(TIP).multiplyScalar(0.5);
    kin.footprint(sol.psi, fp);
    if (dt > 0) {
      tipVel.copy(TIP).sub(prevTip).multiplyScalar(1 / dt);
      const sp2 = tipVel.length();
      if (sp2 > 4) tipVel.multiplyScalar(4 / sp2);
      S.armSpeed += (Math.min(sp2, 4) - S.armSpeed) * Math.min(1, dt * 12);
    }
    prevTip.copy(TIP);
    const sc = 1 + bob * 0.16 + S.pop * 0.07;
    machine.wrist.scale.setScalar(sc);
    const g = S.hint * (0.5 + 0.5 * Math.sin(S.hintT * 7.5)) + S.pop * 0.35;
    machine.bucketMat.emissive.setRGB(g * 0.62, g * 0.5, g * 0.12);
  }
  function visuals() {
    machine.updateSand(sol.psi, S.vol);
    machine.handle.position.copy(CEN);
    if (machine.blobBucket) {
      const gy = heightAt(CEN.x, CEN.z), h = Math.max(0, CEN.y - gy);
      machine.blobBucket.position.set(CEN.x, gy + 0.012, CEN.z);
      const s = 0.34 + h * 0.35;
      machine.blobBucket.scale.set(s, 1, s);
      machine.blobBucket.material.opacity = clamp(0.5 - h * 0.6, 0.12, 0.5);
    }
    ter.flush();
    bedG.flush();
  }

  function update(dt, input) {
    if (!(dt > 0)) return;
    dt = Math.min(dt, 0.05);
    S.time += dt; S.hintT += dt; S.landT += dt;
    S.pop = Math.max(0, S.pop - dt * 5);
    updateTruck();
    {
      const ddx = T.x - exPos.x, ddz = T.z - exPos.z;
      truckNear = ddx * ddx + ddz * ddz < 9;
    }
    if (S.armed > 0) S.armed -= dt;
    handleInput(input && input.pointer);
    stepQueue(dt);
    if (S.phase === 'follow' && !(input && input.pointer && input.pointer.down) && !S.queue.length) liftCarry();
    plan();
    move(dt);
    pose(dt);
    dig(dt);
    pourAndSpill(dt);
    {
      const n = dt > 0.022 ? 2 : 1;
      grainDt = dt / n;
      for (let k = 0; k < n; k++) grains.update(grainDt, collide);
    }
    // 砂の崩れ
    const sweeps = clamp(Math.round(dt * 200), 1, 6);
    if (ter.active) ter.relax(sweeps, 0, 1, 0, 1);
    tendTerrain(dt);
    if (bedG.active) {
      bedG.relax(sweeps, T.ux, T.uy, T.uz, 0);
      bedOverflow();
      let top = 0; const Hb = bedG.H;
      for (let i = 0; i < bedG.N; i++) if (Hb[i] > top) top = Hb[i];
      bedTop = top;
    }
    visuals();
    state.phase = S.phase; state.pourTarget = S.pourTarget;
    state.bucketFill = clamp(S.vol / P.bucketCap, 0, 1);
    state.bedFill = bedG.volume() / bedFullVol;
    state.armSpeed = fin(S.armSpeed, 0); state.digRate = fin(Math.max(0, S.digRate), 0); state.pourRate = fin(Math.max(0, S.pourRate), 0);
  }

  // =====================================================================
  // API
  // =====================================================================
  const commands = {
    dumpToBed: () => dumpToBed(),
    scoopAt: (p) => (p && Number.isFinite(p.x + p.z) ? scoopAt(p) : false),
    pourHere: () => pourHere(),
    home: () => (S.phase === 'pour' ? false : goHome()),
  };
  function drainBed(fraction) {
    const f = clamp(fin(fraction, 0), 0, 1);
    const before = bedG.volume();
    let need = before * f;
    if (need <= 0) return 0;
    const H = bedG.H, VX = bedG.VX;
    // 後ろあおり（+Z）の側の列から減らす。残りは傾きで後ろへ流れてくる
    for (let iz = BNZ; iz >= 0 && need > 1e-9; iz--) {
      let row = 0;
      for (let ix = 0; ix <= BNX; ix++) row += H[iz * VX + ix];
      row *= bedG.cellA;
      if (row <= 0) continue;
      const k = row <= need ? 0 : 1 - need / row;
      for (let ix = 0; ix <= BNX; ix++) H[iz * VX + ix] *= k;
      need -= row * (1 - k);
    }
    if (f >= 1) H.fill(0);
    bedG.touchAll(); bedG.markVolume(); bedG.activate(0, 0, BNX, BNZ);
    const removed = before - bedG.volume();
    S.shipped += removed;
    return removed;
  }
  function reset(o = {}) {
    makeSeed(o.seed != null ? o.seed : 1, seedH);
    S.resetT = 0;
    bedG.H.fill(0); bedG.touchAll(); bedG.markVolume(); bedTop = 0;
    grains.clear();
    S.vol = 0; S.full = false; S.pourAcc = 0; S.sprayAcc = 0; S.pourAcc2 = 0;
    if (S.pour) { S.pour = null; S.pourTarget = null; }
    S.phase = 'idle'; S.queue.length = 0; S.armed = 0;
    goHome();
  }

  // 初期化
  makeSeed(opts.seed != null ? opts.seed : 1, seedH);
  ter.H.set(seedH);
  ter.touchAll();
  snapshotRef();
  S.vol0 = ter.volume();
  updateTruck();
  plan();
  // 最初の姿勢＝待機の位置
  HOME.phi = S.phi = S.tPhi; HOME.u = S.u = S.tU; HOME.v = S.v = S.tV; HOME.psi = S.psi = S.tPsi;
  pose(0);
  prevValid = false;
  visuals();

  if (opts.debug) {
    root.userData.heroBed = () => Array.from(bedG.H);
    root.userData.heroDebug = () => ({
      terrain: ter.volume(), bed: bedG.volume(), bucket: S.vol, flying: grains.flying, shipped: S.shipped, refill: S.refill, start: S.vol0,
      // 保存の確認：terrain + bed + bucket + flying + shipped − refill − start ≈ 0
      balance: ter.volume() + bedG.volume() + S.vol + grains.flying + S.pourAcc + S.sprayAcc + S.pourAcc2 + spillAcc[0] + spillAcc[1] + spillAcc[2] + spillAcc[3] + S.shipped - S.refill - S.vol0,
      grains: grains.count, triangles: machine.triangles, cylinders: machine.cylinders,
      pose: { phi: S.phi, u: S.u, v: S.v, psi: S.psi, th1: sol.th1, a2: sol.a2, boom: sol.boomLen, arm: sol.armLen, bucket: sol.bucketLen },
      goal: S.goal, phase: S.phase, full: S.full,
    });
  }

  return {
    root,
    pickTargets: [machine.handle],
    update,
    command(name, arg) { return commands[name] ? !!commands[name](arg) : false; },
    setBedAvailable(on) {
      bedAvailable = !!on;
      if (!bedAvailable && S.phase !== 'pour' && (S.goal.kind === 'bed' || S.queue.some((q) => q.goal && q.goal.kind === 'bed'))) liftCarry();
    },
    getBedFill() { return bedG.volume() / bedFullVol; },
    getBedVolume() { return bedG.volume(); },
    drainBed,
    heightAt,
    getPoint(name, out = new THREE.Vector3()) {
      if (name === 'bucketTip') return out.copy(TIP);
      if (name === 'bucketCenter') return out.copy(CEN);
      if (name === 'cab') {
        const c = machine.cabPoint, a = S.phi + yaw, cs = Math.cos(a), sn = Math.sin(a);
        return out.set(exPos.x + c.x * cs + c.z * sn, turretY + c.y, exPos.z - c.x * sn + c.z * cs);
      }
      return out.set(0, 0, 0);
    },
    getState() { return state; },
    setHint(name, level) { if (name === 'bucket') S.hint = clamp(fin(level, 0), 0, 1); },
    reset,
    onContextRestored() { ter.fullUpload(); bedG.fullUpload(); machine.onContextRestored(); ter.touchAll(); bedG.touchAll(); },
    dispose() {
      bed.anchor.remove(bedG.mesh);
      ter.dispose(); bedG.dispose(); sandMat.dispose(); machine.dispose(); grains.dispose();
      root.removeFromParent();
    },
  };
}
