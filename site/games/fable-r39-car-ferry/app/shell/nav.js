// Ship navigation: wheel → throttle & rudder, gentle assist toward ports, soft collisions, automatic approach.
import * as THREE from './three.js';
import { clamp, damp, wrapAngle, easeInOut, lerp } from './util.js';
import { QUAY, WORLD_R } from './world.js';

export const NAV = {
  vmax: 5.0, maxTurn: 0.42, throttleGain: 0.32, throttleTau: 7, rudderGain: 0.55, rudderTau: 2.0,
  approachR: 42, leaveClear: 55, hullR: 4.4, hullOff: 6,
};

export function createNav(world) {
  const s = {
    x: 0, z: 0, yaw: 0, speed: 0, accel: 0, turnRate: 0, throttle: 0, rudder: 0,
    mode: 'docked', // docked | waitUndock | leaving | sail | approach
    port: world.ports[0], lastPort: world.ports[0], leftFar: false, t: 0, bumpCool: 0,
    ap: null,
  };
  const p0 = new THREE.Vector3(), p1 = new THREE.Vector3(), p2 = new THREE.Vector3(), p3 = new THREE.Vector3(), tmp = new THREE.Vector3();
  let onBump = null, onArrive = null;

  function placeAtBerth(port) {
    s.x = port.origin.x; s.z = port.origin.z; s.yaw = port.yaw; s.speed = 0; s.throttle = 0; s.rudder = 0;
    s.mode = 'docked'; s.port = port; s.lastPort = port; s.leftFar = false;
  }
  placeAtBerth(world.ports[0]);

  /** wheel input: signed angle delta (rad, + = counter-clockwise = turn left) */
  function steer(d) {
    s.throttle = clamp(s.throttle + Math.abs(d) * NAV.throttleGain, 0, 1);
    s.rudder = clamp(s.rudder + d * NAV.rudderGain, -1, 1);
  }
  function push(amount) { s.throttle = clamp(s.throttle + amount, 0, 1); }

  function startLeaving() { s.mode = 'leaving'; s.t = 0; s.throttle = Math.max(s.throttle, 0.45); s.port = null; }

  function bump(nx, nz) {
    s.speed *= 0.35; s.throttle *= 0.6;
    if (s.bumpCool <= 0) { onBump && onBump(); s.bumpCool = 0.8; }
    // turn a little away from the obstacle
    const away = Math.atan2(nx, nz); s.yaw += clamp(wrapAngle(away - s.yaw), -1, 1) * 0.04;
  }
  function collide() {
    for (const k of [-1, 1]) {
      const cx = s.x + Math.sin(s.yaw) * NAV.hullOff * k, cz = s.z + Math.cos(s.yaw) * NAV.hullOff * k;
      for (const o of world.obstacles) {
        const dx = cx - o.x, dz = cz - o.z, d = Math.hypot(dx, dz), m = o.r + NAV.hullR;
        if (d < m && d > 1e-4) { const pen = m - d; s.x += (dx / d) * pen; s.z += (dz / d) * pen; bump(dx / d, dz / d); }
      }
      for (const p of world.ports) {
        // quay rectangle in port frame
        tmp.set(cx, 0, cz).sub(p.origin);
        const c = Math.cos(-p.yaw), sn = Math.sin(-p.yaw);
        const lx = tmp.x * c + tmp.z * sn, lz = -tmp.x * sn + tmp.z * c;
        if (Math.abs(lx) < QUAY.halfW + NAV.hullR && lz < QUAY.edgeZ + NAV.hullR && lz > QUAY.backZ) {
          const pen = QUAY.edgeZ + NAV.hullR - lz;
          s.x += p.fwd.x * pen; s.z += p.fwd.z * pen; bump(p.fwd.x, p.fwd.z);
        }
      }
      const r = Math.hypot(cx, cz);
      if (r > WORLD_R) { const pen = r - WORLD_R; s.x -= (cx / r) * pen; s.z -= (cz / r) * pen; bump(-cx / r, -cz / r); }
    }
  }

  function beginApproach(port) {
    s.mode = 'approach'; s.port = port; s.t = 0;
    const d = Math.hypot(port.origin.x - s.x, port.origin.z - s.z);
    p0.set(s.x, 0, s.z);
    p1.set(s.x + Math.sin(s.yaw) * d * 0.35, 0, s.z + Math.cos(s.yaw) * d * 0.35);
    p2.set(port.origin.x + port.fwd.x * 16, 0, port.origin.z + port.fwd.z * 16);
    p3.copy(port.origin);
    // turn so that the stern swings toward the quay (pick the shorter way)
    const dyaw = wrapAngle(port.yaw - s.yaw);
    s.ap = { T: clamp(d / 6, 4, 6.5), yaw0: s.yaw, dyaw, sp0: s.speed };
  }

  function update(dt) {
    s.t += dt; s.bumpCool -= dt;
    const prevSpeed = s.speed;
    if (s.mode === 'docked' || s.mode === 'waitUndock') {
      s.speed = 0; s.turnRate = 0; s.accel = 0;
      s.throttle = damp(s.throttle, 0, 1, dt); s.rudder = damp(s.rudder, 0, 1, dt);
      if (s.port) { s.x = s.port.origin.x; s.z = s.port.origin.z; s.yaw = s.port.yaw; }
      return;
    }
    if (s.mode === 'approach') {
      const k = clamp(s.t / s.ap.T, 0, 1), e = easeInOut(k);
      const u = 1 - e;
      const bx = u * u * u * p0.x + 3 * u * u * e * p1.x + 3 * u * e * e * p2.x + e * e * e * p3.x;
      const bz = u * u * u * p0.z + 3 * u * u * e * p1.z + 3 * u * e * e * p2.z + e * e * e * p3.z;
      const vx = (bx - s.x) / Math.max(dt, 1e-3), vz = (bz - s.z) / Math.max(dt, 1e-3);
      s.x = bx; s.z = bz;
      const newYaw = s.ap.yaw0 + s.ap.dyaw * easeInOut(clamp(k * 1.15, 0, 1));
      s.turnRate = dt > 0 ? wrapAngle(newYaw - s.yaw) / dt : 0; s.yaw = newYaw;
      s.speed = (vx * Math.sin(s.yaw) + vz * Math.cos(s.yaw)) * 0.5;
      s.accel = 0; s.throttle = 0; s.rudder = 0;
      if (k >= 1) { const port = s.port; placeAtBerth(port); onArrive && onArrive(port); }
      return;
    }
    if (s.mode === 'leaving') {
      s.throttle = Math.max(s.throttle, 0.4 * (1 - s.t / 3));
      if (s.t > 3) s.mode = 'sail';
    }
    // sail
    s.throttle *= Math.exp(-dt / NAV.throttleTau);
    s.rudder *= Math.exp(-dt / NAV.rudderTau);
    s.speed = damp(s.speed, s.throttle * NAV.vmax, 1.2, dt);
    let yawRate = s.rudder * NAV.maxTurn * clamp(s.speed / 1.5, 0, 1);
    // gentle assist toward a port ahead when not steering
    if (Math.abs(s.rudder) < 0.15 && s.speed > 0.5) {
      let best = null, be = 0.9;
      for (const p of world.ports) {
        if (p === s.lastPort && !s.leftFar) continue;
        const b = Math.atan2(p.origin.x - s.x, p.origin.z - s.z); const e = wrapAngle(b - s.yaw);
        if (Math.abs(e) < be) { be = Math.abs(e); best = e; }
      }
      if (best !== null) yawRate += clamp(best * 0.25, -0.1, 0.1);
    }
    s.turnRate = yawRate;
    s.yaw += yawRate * dt;
    s.x += Math.sin(s.yaw) * s.speed * dt; s.z += Math.cos(s.yaw) * s.speed * dt;
    s.accel = dt > 0 ? (s.speed - prevSpeed) / dt : 0;
    collide();
    // leaving the last port far enough makes it a destination again
    if (s.lastPort && Math.hypot(s.lastPort.origin.x - s.x, s.lastPort.origin.z - s.z) > NAV.leaveClear) s.leftFar = true;
    for (const p of world.ports) {
      if (p === s.lastPort && !s.leftFar) continue;
      if (Math.hypot(p.origin.x - s.x, p.origin.z - s.z) < NAV.approachR) { beginApproach(p); break; }
    }
  }
  return {
    state: s, steer, push, update, placeAtBerth, startLeaving,
    setHandlers(h) { onBump = h.onBump; onArrive = h.onArrive; },
    get speed() { return s.speed; },
    teleport(x, z, yaw) { s.x = x; s.z = z; s.yaw = yaw; s.mode = 'sail'; s.port = null; s.leftFar = true; },
  };
}
