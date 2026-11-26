import * as THREE from 'three';

// One finger only. Tap (<10 px, <0.35 s) or drag. Hit priority comes from the pickers list order.
// Calls handlers.down(hit), handlers.move(groundPoint, isDrag), handlers.up({tap, hit, ground}).

const TAP_PX = 10, TAP_MS = 350;

export function createInput(canvas, camera, getPickers, raycastGround, handlers) {
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let active = null; // { id, x0, y0, t0, hit, drag }

  function setRay(x, y) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  }
  function ground(x, y) { setRay(x, y); return raycastGround(ray); }
  function pick(x, y) {
    setRay(x, y);
    for (const p of getPickers()) {
      if (!p.object || (p.enabled && !p.enabled())) continue;
      p.object.updateWorldMatrix(true, false);
      if (ray.intersectObject(p.object, false).length) return { id: p.id, ref: p.ref };
    }
    return { id: 'ground' };
  }

  function onDown(e) {
    e.preventDefault();
    if (active) return; // ignore extra fingers
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    const hit = pick(e.clientX, e.clientY);
    active = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), hit, drag: false };
    handlers.down(hit, ground(e.clientX, e.clientY));
  }
  function onMove(e) {
    if (!active || e.pointerId !== active.id) return;
    e.preventDefault();
    if (!active.drag && Math.hypot(e.clientX - active.x0, e.clientY - active.y0) >= TAP_PX) active.drag = true;
    handlers.move(ground(e.clientX, e.clientY), active.drag, active.hit);
  }
  function onUp(e) {
    if (!active || e.pointerId !== active.id) return;
    e.preventDefault();
    const tap = !active.drag && performance.now() - active.t0 < TAP_MS;
    const hit = active.hit;
    active = null;
    handlers.up({ tap, hit, ground: ground(e.clientX, e.clientY), cancelled: e.type === 'pointercancel' });
  }

  canvas.addEventListener('pointerdown', onDown, { passive: false });
  canvas.addEventListener('pointermove', onMove, { passive: false });
  canvas.addEventListener('pointerup', onUp, { passive: false });
  canvas.addEventListener('pointercancel', onUp, { passive: false });
  // stop the page from scrolling, zooming or showing menus on iPad
  const stop = (e) => e.preventDefault();
  for (const ev of ['touchstart', 'touchmove', 'touchend', 'gesturestart', 'gesturechange', 'gestureend', 'dblclick', 'contextmenu', 'selectstart'])
    document.addEventListener(ev, stop, { passive: false });

  return {
    get busy() { return !!active; },
    project(v, out) { const p = v.clone().project(camera); const r = canvas.getBoundingClientRect(); out.x = r.left + (p.x + 1) / 2 * r.width; out.y = r.top + (1 - p.y) / 2 * r.height; return out; },
  };
}
