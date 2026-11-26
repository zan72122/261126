// The sled: a plastic toboggan built from parameters, and how it moves.
// While sliding it is a point on the height map: every step reads the slope under its footprint,
// so the ride is whatever the child has built (no fixed slide, no fixed animation).
import { FIELD, GRID, SLED } from './params.js';
import { clamp, damp, lerp, wrapAngle, turnTo } from './util.js';

const { N, V, CELL } = GRID;
const CELL2 = CELL * CELL;
const HALF = FIELD.half;
const G = SLED.G;
const VY_MAX = Math.sqrt(2 * SLED.G_AIR * SLED.HOP_MAX);
const READY_H = 0.3;                       // waiting: faces the camera, a little side-on
const TAN_TILT = Math.tan(SLED.TILT_MAX);

export function createSled(THREE, { geom, terrain, textures, shadows, emit, spray }) {
  const { H, B, edge } = terrain;
  const owned = [];
  const own = (x) => (owned.push(x), x);

  // ------------------------------------------------------------ model (+z forward, bottom on y = 0)
  const sledMat = own(new THREE.MeshStandardMaterial({ map: textures.sledPlastic || null, roughness: 0.42, metalness: 0, emissive: 0xff4a3a, emissiveIntensity: 0 }));
  const trimMat = own(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, metalness: 0 }));
  const pickMat = own(new THREE.MeshBasicMaterial({ visible: false }));
  const group = new THREE.Group(); group.name = 'hero.sled';
  const body = new THREE.Group(); group.add(body);
  const shell = new THREE.Mesh(own(geom.sledShell(SLED.LEN, SLED.WID, SLED.CURL_R, SLED.SIDE_H, SLED.THICK)), sledMat);
  const tipZ = SLED.LEN / 2 - SLED.CURL_R - 0.06 + SLED.CURL_R * Math.sin(1.92), tipY = SLED.CURL_R * (1 - Math.cos(1.92));
  const trim = new THREE.Mesh(own(geom.merge([
    geom.paint(geom.roundedBox(SLED.WID * 0.66, SLED.SEAT_Y - SLED.THICK, SLED.LEN * 0.7, 0.03, 2).translate(0, (SLED.SEAT_Y + SLED.THICK) / 2, -SLED.LEN * 0.1), 0xfff0d2),   // cushion
    geom.paint(new THREE.TorusGeometry(0.15, 0.02, 6, 14, Math.PI).rotateX(1.95).translate(0, tipY - 0.01, tipZ - 0.03), 0xffd23f),                                        // rope
  ])), trimMat);
  shell.name = 'hero.sled.shell'; trim.name = 'hero.sled.trim';
  body.add(shell, trim);
  shell.castShadow = trim.castShadow = !!shadows;
  const seatF = new THREE.Object3D(); seatF.name = 'hero.seat.front'; seatF.position.set(0, SLED.SEAT_Y, SLED.SEAT_FRONT_Z);
  const seatB = new THREE.Object3D(); seatB.name = 'hero.seat.back'; seatB.position.set(0, SLED.SEAT_Y, SLED.SEAT_BACK_Z);
  body.add(seatF, seatB);
  const pick = new THREE.Mesh(own(new THREE.BoxGeometry(1.35, 1.35, 1.9)), pickMat);
  pick.position.y = 0.5;
  group.add(pick);

  // ------------------------------------------------------------ state
  const sl = {
    x: 0, z: 0, y: 0, vx: 0, vz: 0, vy: 0, h: READY_H, ux: 0, uy: 1, uz: 0,
    state: 'ready', air: false, airCd: 0, bumpCd: 0, still: 0, dist: 0, maxSpeed: 0, t: 0,
    gy: 0, vG: 0, goX: 0, goZ: 1, bob: 0, bobV: 0, lean: 0, pitch: 0, hint: 0, walkPh: 0,
    holdVx: 0, holdVz: 0, yawRate: 0,
    fromX: 0, fromY: 0, fromZ: 0, fromH: 0, toX: 0, toZ: 0, toH: 0, hopDur: 0.6, hopH: 0.8, hopThen: 'slide',
    okX: 0, okZ: 0, okY: 0,
  };
  let time = 0;

  // ground under the footprint (heading-aligned): height, slopes, world gradient, fore-aft curvature
  const F = { y: 0, gx: 0, gz: 0, k: 0 };
  function foot(x, z, h) {
    const fx = Math.sin(h), fz = Math.cos(h), rx = fz, rz = -fx, a = SLED.FOOT_LEN, b = SLED.FOOT_WID;
    const hC = terrain.heightAt(x, z);
    const hF = terrain.heightAt(x + fx * a, z + fz * a), hB = terrain.heightAt(x - fx * a, z - fz * a);
    const hL = terrain.heightAt(x + rx * b, z + rz * b), hR = terrain.heightAt(x - rx * b, z - rz * b);
    const sF = (hF - hB) / (2 * a), sL = (hL - hR) / (2 * b);
    F.gx = sF * fx + sL * rx; F.gz = sF * fz + sL * rz;
    F.k = (hF + hB - 2 * hC) / (a * a);
    F.y = Math.max(hC, (hF + hB) / 2, (hL + hR) / 2);
    return F;
  }

  // where the sled waits: beside the summit, toward the camera
  const spot = { x: 0, z: 0 };
  function waitSpot() {
    const pk = terrain.peak, lim = HALF - 0.9;
    spot.x = clamp(pk.x + 0.3, -lim, lim); spot.z = clamp(pk.z + 0.55, -lim, lim);
    return spot;
  }

  function reset() {
    const w = waitSpot();
    sl.x = w.x; sl.z = w.z; sl.h = READY_H;
    sl.vx = sl.vz = sl.vy = 0; sl.state = 'ready'; sl.air = false; sl.t = 0;
    sl.bob = sl.bobV = sl.lean = sl.pitch = 0; sl.ux = 0; sl.uy = 1; sl.uz = 0;
    sl.y = foot(sl.x, sl.z, sl.h).y;
    sl.okX = sl.x; sl.okZ = sl.z; sl.okY = sl.y;
    pose(0);
  }

  // ------------------------------------------------------------ starting a slide
  function beginSlide(dx, dz, push, fromAir) {
    const l = Math.hypot(dx, dz) || 1;
    sl.goX = dx / l; sl.goZ = dz / l;
    sl.vx = sl.goX * push; sl.vz = sl.goZ * push; sl.vy = 0;
    const gy = foot(sl.x, sl.z, sl.h).y;
    sl.air = !!fromAir && sl.y - gy > 0.05;
    if (!sl.air) sl.y = gy;
    sl.gy = gy; sl.vG = 0;
    sl.state = 'slide'; sl.still = 0; sl.dist = 0; sl.maxSpeed = 0; sl.t = 0; sl.airCd = sl.air ? 0 : 0.2;
    emit('slideStart', { x: sl.x, y: sl.y, z: sl.z });
  }

  // From the summit: the side that drops most, a little preferring packed chutes and the camera side.
  const start = { x: 0, z: 0, h: 0 };
  function chooseStart() {
    const pk = terrain.findPeak(false), lim = HALF - 0.8;
    let best = -1e9;
    for (let a = 0; a < 16; a++) {
      const ang = (a / 16) * Math.PI * 2, dx = Math.sin(ang), dz = Math.cos(ang);
      const x1 = pk.x + dx * 1.5, z1 = pk.z + dz * 1.5, x2 = pk.x + dx * 2.6, z2 = pk.z + dz * 2.6;
      let score = (pk.y - terrain.heightAt(x1, z1)) + 0.5 * (pk.y - terrain.heightAt(x2, z2));
      score += 0.25 * (terrain.packedAt(pk.x + dx * 0.9, pk.z + dz * 0.9) + terrain.packedAt(pk.x + dx * 1.7, pk.z + dz * 1.7)) * 0.5;
      score += 0.06 * dz;
      if (Math.abs(x2) > lim || Math.abs(z2) > lim) score -= 0.6;
      if (score > best) { best = score; start.h = ang; }
    }
    start.x = clamp(pk.x + Math.sin(start.h) * 0.4, -lim, lim);
    start.z = clamp(pk.z + Math.cos(start.h) * 0.4, -lim, lim);
    return start;
  }

  // one jump in an arc to (x, z); then it slides off in direction h, or just waits there
  function hopTo(x, z, h, then) {
    sl.fromX = sl.x; sl.fromY = sl.y; sl.fromZ = sl.z; sl.fromH = sl.h;
    sl.toX = x; sl.toZ = z; sl.toH = h; sl.hopThen = then;
    const d = Math.hypot(x - sl.x, z - sl.z);
    sl.hopDur = clamp(0.45 + 0.07 * d, SLED.HOP_TIME[0], SLED.HOP_TIME[1]);
    sl.hopH = clamp(0.5 + 0.12 * d, 0.5, 1.3);
    sl.state = 'hop'; sl.t = 0; sl.vx = sl.vz = sl.vy = 0; sl.air = false;
  }
  function slideFromTop() {
    if (sl.state === 'slide' || sl.state === 'held' || sl.state === 'hop') return false;
    const s = chooseStart();
    hopTo(s.x, s.z, s.h, 'slide');
    return true;
  }

  const _g = { x: 0, z: 0 };
  function releaseSled(slide) {
    if (sl.state !== 'held') return;
    emit('sledDrop', { x: sl.x, y: sl.y, z: sl.z });
    if (slide) {
      terrain.gradAt(sl.x, sl.z, 0.3, _g);
      const gl = Math.hypot(_g.x, _g.z), hv = Math.hypot(sl.holdVx, sl.holdVz);
      if (gl > 0.06) beginSlide(-_g.x / gl, -_g.z / gl, SLED.PUSH, true);            // downhill
      else if (hv > 0.5) beginSlide(sl.holdVx / hv, sl.holdVz / hv, SLED.PUSH, true); // flat: the way it was carried
      else {                                                                          // flat: the way it faces, but not into the bank
        let dx = Math.sin(sl.h), dz = Math.cos(sl.h);
        const lim = HALF - 1.2;
        if (Math.abs(sl.x + dx * 2) > lim || Math.abs(sl.z + dz * 2) > lim) { dx = -sl.x; dz = -sl.z; }
        beginSlide(dx, dz, SLED.PUSH, true);
      }
    } else {
      sl.state = 'ready'; sl.t = 0; sl.vx = sl.vz = sl.vy = 0;
      emit('sledReady', { x: sl.x, y: sl.y, z: sl.z });
    }
  }

  function returnSled() {
    if (sl.state !== 'stopped') return;
    sl.state = 'return'; sl.t = 0; sl.walkPh = 0;
  }

  // ------------------------------------------------------------ sliding
  function slideStep(h) {
    foot(sl.x, sl.z, sl.h);
    let sp = Math.hypot(sl.vx, sl.vz);
    if (!sl.air) {
      const g2 = F.gx * F.gx + F.gz * F.gz;
      const mu = SLED.MU_FRESH + (SLED.MU_PACKED - SLED.MU_FRESH) * terrain.packedAt(sl.x, sl.z);
      const late = (sl.t > 12 ? 1 + (sl.t - 12) * 0.25 : 1)               // a very long slide gets grippier, so it always ends
        + (sl.dist >= SLED.MIN_DIST && sp < 0.8 ? 1.6 * (1 - sp / 0.8) : 0);  // and a crawl comes to rest instead of creeping on
      const ax = (-G * F.gx) / (1 + g2), az = (-G * F.gz) / (1 + g2);     // a = -g grad h / (1 + |grad h|^2)
      const fr = (mu * G * late) / Math.sqrt(1 + g2);
      if (sp < 0.06 && Math.hypot(ax, az) <= fr) { sl.vx = sl.vz = 0; sp = 0; }   // friction holds it (hollows, gentle slopes)
      else {
        sl.vx += ax * h; sl.vz += az * h;
        sp = Math.hypot(sl.vx, sl.vz);
        if (sp > 1e-5) { const dec = Math.min(sp, (fr + SLED.DRAG * sp) * h), s = (sp - dec) / sp; sl.vx *= s; sl.vz *= s; sp -= dec; }
      }
      if (sl.dist < SLED.MIN_DIST && sl.t < 3 && sp < SLED.MIN_SPEED) {   // even on flat snow it goes a little way
        let dx = sl.goX, dz = sl.goZ;
        if (sp > 0.3) { dx = sl.vx / sp; dz = sl.vz / sp; }
        const add = Math.min(SLED.MIN_SPEED - sp, 5 * h);
        sl.vx += dx * add; sl.vz += dz * add;
      }
    } else { const s = 1 - 0.15 * h; sl.vx *= s; sl.vz *= s; }
    sp = Math.hypot(sl.vx, sl.vz);
    if (sp > SLED.VMAX) { const s = SLED.VMAX / sp; sl.vx *= s; sl.vz *= s; sp = SLED.VMAX; }

    // soft snow bank near the edge: pushes back and soaks up the speed
    const lim = HALF - SLED.EDGE, hard = HALF - 0.12;
    if (sl.x > lim) sl.vx -= (SLED.BANK_K * (sl.x - lim) + SLED.BANK_C * Math.max(0, sl.vx)) * h;
    else if (sl.x < -lim) sl.vx += (SLED.BANK_K * (-lim - sl.x) + SLED.BANK_C * Math.max(0, -sl.vx)) * h;
    if (sl.z > lim) sl.vz -= (SLED.BANK_K * (sl.z - lim) + SLED.BANK_C * Math.max(0, sl.vz)) * h;
    else if (sl.z < -lim) sl.vz += (SLED.BANK_K * (-lim - sl.z) + SLED.BANK_C * Math.max(0, -sl.vz)) * h;
    sl.x += sl.vx * h; sl.z += sl.vz * h;
    if (sl.x > hard) { sl.x = hard; if (sl.vx > 0) sl.vx = 0; } else if (sl.x < -hard) { sl.x = -hard; if (sl.vx < 0) sl.vx = 0; }
    if (sl.z > hard) { sl.z = hard; if (sl.vz > 0) sl.vz = 0; } else if (sl.z < -hard) { sl.z = -hard; if (sl.vz < 0) sl.vz = 0; }

    // Height: the sled falls freely and the snow pushes it back up (one-sided contact). On even snow that
    // keeps it glued to the surface; where the snow drops away faster than it can fall (behind a bump,
    // over an edge) it flies for a moment.
    const gyOld = sl.gy;
    foot(sl.x, sl.z, sl.h);
    const gy = F.y;
    sl.gy = gy;
    sl.vG += ((gy - gyOld) / h - sl.vG) * Math.min(1, h / 0.025);   // how fast the snow under it rises or falls
    sl.airCd -= h; sl.bumpCd -= h;
    sl.vy -= SLED.G_AIR * h;
    let y = sl.y + sl.vy * h;
    if (y <= gy || sl.airCd > 0 || (!sl.air && sp < 0.8)) {
      if (sl.air) {
        const impact = clamp((sl.vG - sl.vy) / 3.5, 0, 1);
        sl.airCd = 0.12; sl.bobV -= 1.4 * impact;
        const keep = 1 - 0.1 * impact; sl.vx *= keep; sl.vz *= keep;
        if (impact > 0.08) { emit('sledLand', { strength: impact }); spray.burst(sl.x, gy + 0.1, sl.z, 2 + Math.round(impact * 5), 1.2 + impact, sl.vx * 0.3, sl.vz * 0.3); }
      }
      y = gy; sl.vy = sl.vG; sl.air = false;
    } else {
      if (!sl.air && y - gy > 0.02) {                                // a real hop (smaller gaps do not count)
        sl.air = true; sl.bobV += 0.5;
        if (sl.vy > -0.6) sl.vy += SLED.POP;
        if (sl.bumpCd <= 0) { emit('sledBump', { strength: clamp(0.2 + 0.3 * (sl.vy - sl.vG) + 0.3 * (sp / SLED.VMAX), 0.1, 1) }); sl.bumpCd = 0.25; }
      }
      if (sl.vy > VY_MAX) sl.vy = VY_MAX;
      if (y - gy > SLED.HOP_MAX) { y = gy + SLED.HOP_MAX; if (sl.vy > sl.vG) sl.vy = sl.vG; }
    }
    sl.y = y;
  }

  // the sled presses its track: packed and a few centimetres deep, the snow goes to both sides
  function track(dist) {
    if (dist < 1e-4) return;
    const frac = Math.min(1, dist / 0.5);
    const ci = terrain.toI(sl.x), cj = terrain.toI(sl.z), r = SLED.TRACK_R / CELL, r2 = r * r;
    const i0 = Math.max(1, Math.floor(ci - r)), i1 = Math.min(N - 1, Math.ceil(ci + r));
    const j0 = Math.max(1, Math.floor(cj - r)), j1 = Math.min(N - 1, Math.ceil(cj + r));
    if (i1 < i0 || j1 < j0) return;
    let removed = 0;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const di = i - ci, dj = j - cj, d2 = di * di + dj * dj;
      if (d2 > r2) continue;
      const k = j * V + i, w = 1 - d2 / r2;
      if (edge[k]) continue;
      const loose = H[k] - B[k];
      const dig = Math.min(SLED.TRACK_DEPTH * w * frac, loose * 0.5);   // only loose snow gives way
      if (dig > 0) { H[k] -= dig; removed += dig; }
      B[k] += (H[k] - B[k]) * Math.min(1, w * frac * 1.6);               // and what is left under the sled turns firm
    }
    terrain.markDirty(i0, j0, i1, j1);
    removed *= CELL2;
    if (removed > 1e-6) {
      const sp = Math.hypot(sl.vx, sl.vz) || 1, rx = sl.vz / sp, rz = -sl.vx / sp, off = SLED.TRACK_R + 0.12;
      terrain.deposit(sl.x + rx * off, sl.z + rz * off, removed * 0.5, 0.11, 0);
      terrain.deposit(sl.x - rx * off, sl.z - rz * off, removed * 0.5, 0.11, 0);
    }
  }

  function stop() {
    sl.vx = sl.vz = sl.vy = 0; sl.air = false; sl.state = 'stopped'; sl.t = 0;
    emit('slideEnd', { x: sl.x, y: sl.y, z: sl.z, distance: sl.dist, maxSpeed: sl.maxSpeed });
  }

  // ------------------------------------------------------------ per frame
  function update(dt, input) {
    time += dt;
    const hold = input && input.sledHold;
    const h0 = sl.h;
    if (hold && Number.isFinite(hold.x + hold.z)) {
      if (sl.state !== 'held') {
        sl.state = 'held'; sl.vx = sl.vz = sl.vy = 0; sl.air = false; sl.holdVx = sl.holdVz = 0; sl.bobV += 0.8;
        emit('sledPick', { x: sl.x, y: sl.y, z: sl.z });
      }
      const lim = HALF - SLED.EDGE, a = damp(dt, 0.06);
      const px = sl.x, pz = sl.z;
      sl.x += (clamp(hold.x, -lim, lim) - sl.x) * a; sl.z += (clamp(hold.z, -lim, lim) - sl.z) * a;
      const b = damp(dt, 0.12);
      sl.holdVx += ((sl.x - px) / dt - sl.holdVx) * b; sl.holdVz += ((sl.z - pz) / dt - sl.holdVz) * b;
      sl.y += (foot(sl.x, sl.z, sl.h).y + SLED.HOLD_Y - sl.y) * damp(dt, 0.07);
    } else {
      if (sl.state === 'held') releaseSled(true);   // the shell normally releases it first
      if (sl.state === 'hop') updateHop(dt);
      else if (sl.state === 'slide') updateSlide(dt);
      else if (sl.state === 'return') updateReturn(dt);
      else {
        // ready / stopped: sits on the snow wherever the snow is now
        sl.y += (foot(sl.x, sl.z, sl.h).y - sl.y) * damp(dt, 0.06);
        if (sl.state === 'ready') sl.h = turnTo(sl.h, READY_H, dt * 2.5);
      }
    }
    sl.t += dt;
    sl.h = wrapAngle(sl.h);
    sl.yawRate += (wrapAngle(sl.h - h0) / dt - sl.yawRate) * damp(dt, 0.1);
    guard();
  }

  function updateHop(dt) {
    const u = Math.min(1, (sl.t + dt) / sl.hopDur), e = u * u * (3 - 2 * u);
    const toY = foot(sl.toX, sl.toZ, sl.toH).y;
    sl.x = lerp(sl.fromX, sl.toX, e); sl.z = lerp(sl.fromZ, sl.toZ, e);
    sl.y = lerp(sl.fromY, toY, e) + sl.hopH * 4 * u * (1 - u);
    sl.h = wrapAngle(sl.fromH + wrapAngle(sl.toH - sl.fromH) * e);
    if (u >= 1) {
      sl.y = toY; sl.bobV -= 0.8;
      spray.burst(sl.x, sl.y + 0.1, sl.z, 3, 1.0, 0, 0);
      if (sl.hopThen === 'slide') beginSlide(Math.sin(sl.toH), Math.cos(sl.toH), SLED.PUSH, false);
      else { sl.state = 'ready'; sl.t = 0; emit('sledReady', { x: sl.x, y: sl.y, z: sl.z }); }
    }
  }

  function updateSlide(dt) {
    const x0 = sl.x, z0 = sl.z;
    const n = Math.max(1, Math.min(6, Math.ceil(dt / SLED.SUBSTEP))), h = dt / n;
    for (let i = 0; i < n; i++) slideStep(h);
    const sp = Math.hypot(sl.vx, sl.vz);
    if (sp > 0.3) sl.h = wrapAngle(sl.h + wrapAngle(Math.atan2(sl.vx, sl.vz) - sl.h) * damp(dt, SLED.HEAD_TC));
    const d = Math.hypot(sl.x - x0, sl.z - z0);
    sl.dist += d;
    if (sp > sl.maxSpeed) sl.maxSpeed = sp;
    if (!sl.air) {
      track(d);
      if (sp > 2.2 && Math.random() < dt * sp * 3) spray.burst(sl.x - (sl.vx / sp) * 0.5, sl.y + 0.08, sl.z - (sl.vz / sp) * 0.5, 1, 0.8, -sl.vx * 0.15, -sl.vz * 0.15);
    }
    sl.still = sp < SLED.STOP_SPEED && !sl.air ? sl.still + dt : 0;
    if (sl.still > SLED.STOP_TIME || sl.t > SLED.MAX_TIME) stop();
  }

  // hops back to its waiting place, following the snow
  function updateReturn(dt) {
    const w = waitSpot();
    const dx = w.x - sl.x, dz = w.z - sl.z, d = Math.hypot(dx, dz);
    // arrived; if the plow is parked on the waiting place, next to the plow is near enough
    let taken = false;
    for (const c of obstacles) if (Math.hypot(w.x - c.x, w.z - c.z) < c.r + 0.1 && Math.hypot(sl.x - c.x, sl.z - c.z) < c.r + 0.15) taken = true;
    if (d < 0.1 || (taken && d < 1.8)) {
      if (d < 0.1) { sl.x = w.x; sl.z = w.z; }
      sl.y = foot(sl.x, sl.z, sl.h).y;
      sl.state = 'ready'; sl.t = 0;
      emit('sledReady', { x: sl.x, y: sl.y, z: sl.z });
      return;
    }
    if (sl.t > 11) { hopTo(w.x, w.z, READY_H, 'ready'); return; }   // something is in the way for too long: one big jump home
    // walk toward the waiting place, sliding round the plow instead of pushing against it
    let ux = dx / d, uz = dz / d;
    for (const c of obstacles) {
      const ox = sl.x - c.x, oz = sl.z - c.z, od = Math.hypot(ox, oz);
      if (od > c.r + 0.05 || od < 1e-4) continue;
      const nx = ox / od, nz = oz / od, into = ux * nx + uz * nz;
      if (into >= 0) continue;
      ux -= into * nx; uz -= into * nz;
      const l = Math.hypot(ux, uz);
      if (l > 0.05) { ux /= l; uz /= l; } else { ux = -nz; uz = nx; }
    }
    const s = Math.min(d, SLED.RETURN_SPEED * dt);
    sl.x += ux * s; sl.z += uz * s;
    sl.h = turnTo(sl.h, Math.atan2(ux, uz), dt * 6);
    const before = sl.walkPh;
    sl.walkPh += dt / 0.34;
    if (Math.floor(sl.walkPh) > Math.floor(before)) { sl.bobV -= 0.5; spray.burst(sl.x, sl.y + 0.05, sl.z, 1, 0.5, 0, 0); }
    sl.y = foot(sl.x, sl.z, sl.h).y + Math.sin((sl.walkPh % 1) * Math.PI) * 0.13;
  }

  // The plow shoves the sled out of its way (never through it).
  let obstacles = [];
  function pushOut(circles) {
    obstacles = circles;
    if (sl.state === 'held' || sl.state === 'hop') return;
    const lim = HALF - SLED.EDGE;
    for (const c of circles) {
      const dx = sl.x - c.x, dz = sl.z - c.z, d = Math.hypot(dx, dz);
      if (d >= c.r) continue;
      const nx = d > 1e-4 ? dx / d : 1, nz = d > 1e-4 ? dz / d : 0;
      sl.x = clamp(sl.x + nx * (c.r - d), -lim, lim); sl.z = clamp(sl.z + nz * (c.r - d), -lim, lim);
      if (sl.state === 'slide') {
        const vn = sl.vx * nx + sl.vz * nz;
        if (vn < 1) { sl.vx += nx * (1 - vn); sl.vz += nz * (1 - vn); }
      }
    }
  }

  // never keep NaN / Infinity: go back to the last good place
  function guard() {
    if (Number.isFinite(sl.x + sl.z + sl.y + sl.vx + sl.vz + sl.vy + sl.h + sl.ux + sl.uy + sl.uz + sl.bob + sl.bobV)) {
      sl.okX = sl.x; sl.okZ = sl.z; sl.okY = sl.y;
      return;
    }
    sl.x = sl.okX; sl.z = sl.okZ; sl.y = sl.okY; sl.vx = sl.vz = sl.vy = 0;
    sl.ux = 0; sl.uy = 1; sl.uz = 0; sl.bob = sl.bobV = 0; sl.yawRate = 0;
    if (!Number.isFinite(sl.h)) sl.h = 0;
    if (sl.state === 'slide') stop();
  }

  // ------------------------------------------------------------ visuals
  const up = new THREE.Vector3(0, 1, 0), vUp = new THREE.Vector3(), qTilt = new THREE.Quaternion(), qYaw = new THREE.Quaternion();
  function pose(dt) {
    // lie on the snow: up follows the surface normal (limited, so it can never tip over)
    const st = sl.state;
    let tx = 0, tz = 0;
    if (st !== 'held' && st !== 'hop') {
      foot(sl.x, sl.z, sl.h);
      let gx = F.gx, gz = F.gz;
      const gl = Math.hypot(gx, gz);
      if (gl > TAN_TILT) { gx *= TAN_TILT / gl; gz *= TAN_TILT / gl; }
      const k = sl.air ? 0.5 : 1;
      tx = -gx * k; tz = -gz * k;
    }
    const il = 1 / Math.sqrt(tx * tx + 1 + tz * tz);
    const a = dt > 0 ? damp(dt, SLED.TILT_TC) : 1;
    sl.ux += (tx * il - sl.ux) * a; sl.uy += (il - sl.uy) * a; sl.uz += (tz * il - sl.uz) * a;
    const ul = Math.hypot(sl.ux, sl.uy, sl.uz) || 1;
    sl.ux /= ul; sl.uy /= ul; sl.uz /= ul;
    vUp.set(sl.ux, sl.uy, sl.uz);
    qTilt.setFromUnitVectors(up, vUp);
    qYaw.setFromAxisAngle(up, sl.h);
    group.quaternion.copy(qTilt).multiply(qYaw);
    group.position.set(sl.x, sl.y, sl.z);

    // little motions on top: spring bob, lean into turns, swing while carried, hop wiggle, hint hops
    if (dt > 0) {
      sl.bobV += (-180 * sl.bob - 16 * sl.bobV) * dt;
      sl.bob = clamp(sl.bob + sl.bobV * dt, -0.08, 0.12);
    }
    const sp = Math.hypot(sl.vx, sl.vz);
    let lean = 0, pitch = 0, lift = 0;
    if (st === 'slide') { lean = -clamp(sl.yawRate * sp * 0.035, -0.22, 0.22); if (sl.air) pitch = clamp(-sl.vy * 0.06, -0.15, 0.15); }
    else if (st === 'held') {
      const fx = Math.sin(sl.h), fz = Math.cos(sl.h);
      lean = clamp((sl.holdVx * fz - sl.holdVz * fx) * 0.07, -0.3, 0.3);
      pitch = clamp(-(sl.holdVx * fx + sl.holdVz * fz) * 0.07, -0.3, 0.3) + Math.sin(time * 5) * 0.04;
    } else if (st === 'hop') pitch = -Math.sin(Math.min(1, sl.t / sl.hopDur) * Math.PI * 2) * 0.28;
    else if (st === 'return') pitch = Math.cos((sl.walkPh % 1) * Math.PI) * 0.12;
    else if (st === 'ready') lean = Math.sin(time * 2.1) * 0.025;
    const b = dt > 0 ? damp(dt, 0.08) : 1;
    sl.lean += (lean - sl.lean) * b; sl.pitch += (pitch - sl.pitch) * b;
    const lvl = sl.hint, u = (time * 0.95 + 0.5) % 1;
    if (lvl > 0 && u < 0.28) lift = Math.sin((u / 0.28) * Math.PI) * 0.2 * lvl;
    body.position.y = sl.bob + lift;
    body.rotation.set(sl.pitch, 0, sl.lean);
    sledMat.emissiveIntensity = lvl * (0.3 + 0.25 * Math.sin(time * 6));
  }

  return {
    group, pick, seats: [seatF, seatB], state: sl,
    update, pose, reset, pushOut, slideFromTop, releaseSled, returnSled,
    setHint(v) { sl.hint = v; },
    setShadows(on) { shell.castShadow = trim.castShadow = on; },
    getPose() {
      return { x: sl.x, y: sl.y, z: sl.z, heading: sl.h, speed: Math.hypot(sl.vx, sl.vz), state: sl.state, airborne: sl.air };
    },
    dispose() { owned.forEach((o) => o.dispose()); },
  };
}
