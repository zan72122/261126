// Camera rig: a fixed view per port, a slow follow view at sea. The camera orbits its target with rate limits
// (yaw ≤ 20°/s, smooth), so switching between port and sea is a slow turn — no shake, no zoom, no jumps.
import * as THREE from './three.js';
import { clamp, damp, wrapAngle } from './util.js';

// port views in the port (berth) frame: from the sea side, right of the ship, looking at ramp / quay / family
export const PORT_VIEW = {
  landscape: { pos: [17.5, 15, 4.5], tgt: [2.5, 0, -16] },
  portrait: { pos: [11, 22, 3], tgt: [0.5, 0, -18] },
};
const SEA = { landscape: { back: 24, up: 21 }, portrait: { back: 31, up: 28 } };
const MAX_YAW_RATE = (20 * Math.PI) / 180;

export function createCameraRig(camera) {
  const cur = { t: new THREE.Vector3(), yaw: 0, pitch: 0.7, dist: 30 };
  const des = { t: new THREE.Vector3(), yaw: 0, pitch: 0.7, dist: 30 };
  const st = { port: null, view: null };
  const a = new THREE.Vector3(), b = new THREE.Vector3();
  let first = true;

  function fromPosTarget(pos, tgt, out) {
    const dx = tgt.x - pos.x, dy = tgt.y - pos.y, dz = tgt.z - pos.z;
    const h = Math.hypot(dx, dz);
    out.t.copy(tgt); out.yaw = Math.atan2(dx, dz); out.pitch = Math.atan2(-dy, Math.max(h, 1e-3)); out.dist = Math.hypot(h, dy);
  }
  function setFov(aspect) {
    const hfov = (56 * Math.PI) / 180;
    const v = 2 * Math.atan(Math.tan(hfov / 2) / aspect) * (180 / Math.PI);
    camera.fov = clamp(v, 42, 72); camera.aspect = aspect; camera.updateProjectionMatrix();
  }

  function update(dt, nav, aspect) {
    const s = nav.state;
    const atPort = (s.mode === 'docked' || s.mode === 'waitUndock' || s.mode === 'approach') && s.port;
    const portrait = aspect < 1;
    if (atPort) {
      st.port = s.port;
      const v = st.view || (portrait ? PORT_VIEW.portrait : PORT_VIEW.landscape);
      s.port.local(v.pos[0], v.pos[1], v.pos[2], a); s.port.local(v.tgt[0], v.tgt[1], v.tgt[2], b);
      fromPosTarget(a, b, des);
    } else {
      const sv = portrait ? SEA.portrait : SEA.landscape;
      // a little ahead of the ship and to its right, so the ship sits left of the wheel (bottom-right)
      des.t.set(s.x + Math.sin(s.yaw) * 6 - Math.cos(s.yaw) * 4, 1, s.z + Math.cos(s.yaw) * 6 + Math.sin(s.yaw) * 4);
      des.yaw = s.yaw; des.pitch = Math.atan2(sv.up, sv.back); des.dist = Math.hypot(sv.up, sv.back);
    }
    if (first) { cur.t.copy(des.t); cur.yaw = des.yaw; cur.pitch = des.pitch; cur.dist = des.dist; first = false; }
    cur.t.x = damp(cur.t.x, des.t.x, 0.7, dt); cur.t.y = damp(cur.t.y, des.t.y, 0.7, dt); cur.t.z = damp(cur.t.z, des.t.z, 0.7, dt);
    const dy = wrapAngle(des.yaw - cur.yaw);
    cur.yaw += clamp(dy * (1 - Math.exp(-dt / 1.4)), -MAX_YAW_RATE * dt, MAX_YAW_RATE * dt);
    cur.pitch = damp(cur.pitch, des.pitch, 1.4, dt); cur.dist = damp(cur.dist, des.dist, 1.4, dt);
    const ch = Math.cos(cur.pitch) * cur.dist;
    camera.position.set(cur.t.x - Math.sin(cur.yaw) * ch, cur.t.y + Math.sin(cur.pitch) * cur.dist, cur.t.z - Math.cos(cur.yaw) * ch);
    camera.lookAt(cur.t);
    setFov(aspect);
    return cur.t;
  }
  return { update, state: st, target: cur.t };
}
