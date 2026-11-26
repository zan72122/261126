// 指の入力：タップと1本指ドラッグだけ。2本目以降は無視。当たり判定は大きめ。
import * as THREE from 'three';
import { TIMING } from './config.js';

export function createInput(canvas, camera, getTargets, handlers) {
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const tmp = new THREE.Vector3();
  const plane = new THREE.Plane();
  const st = {
    id: null, downAt: 0, downX: 0, downY: 0, x: 0, y: 0, moved: 0, target: null,
    pendingDown: false, pendingUp: false, tapPoint: new THREE.Vector3(), hitPoint: new THREE.Vector3(),
  };
  // hero に渡す入力（毎フレーム使い回す）
  const hero = {
    time: 0, pointerDown: false, ray: new THREE.Ray(new THREE.Vector3(0, 1, 2), new THREE.Vector3(0, -0.4, -1).normalize()),
    grab: null, justGrabbed: false, justReleased: false, tap: null,
  };
  const tapObj = { id: null, point: new THREE.Vector3() };
  let lastPointerTime = -1e9;

  function toNDC(cx, cy) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    return r;
  }
  function updateRay(cx, cy) {
    toNDC(cx, cy);
    raycaster.setFromCamera(ndc, camera);
    hero.ray.copy(raycaster.ray);
  }

  // 一番近い触れる物（光線が当たればそれ、外れても画面上で近ければそれ）
  function pick(cx, cy) {
    const rect = toNDC(cx, cy);
    raycaster.setFromCamera(ndc, camera);
    const targets = getTargets();
    let best = null, bestD = Infinity;
    for (const t of targets) {
      const hits = raycaster.intersectObject(t.object, true);
      if (hits.length && hits[0].distance < bestD) { bestD = hits[0].distance; best = t; st.hitPoint.copy(hits[0].point); }
    }
    if (best) return best;
    let bestPx = Infinity;
    for (const t of targets) {
      t.object.getWorldPosition(tmp);
      const depth = tmp.distanceTo(camera.position);
      tmp.project(camera);
      if (tmp.z > 1) continue;
      const sx = (tmp.x * 0.5 + 0.5) * rect.width, sy = (-tmp.y * 0.5 + 0.5) * rect.height;
      const px = Math.hypot(sx - (cx - rect.left), sy - (cy - rect.top));
      const focal = rect.height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const rpx = ((t.radius || 0.07) * focal) / Math.max(depth, 0.1);
      const d = px - rpx;
      if (d < Math.max(0, TIMING.pickRadiusPx - rpx) && d < bestPx) { bestPx = d; best = t; }
    }
    if (best) {
      // 当たり点：物の高さの水平面と光線の交点
      best.object.getWorldPosition(tmp);
      plane.set(new THREE.Vector3(0, 1, 0), -tmp.y);
      if (!raycaster.ray.intersectPlane(plane, st.hitPoint)) st.hitPoint.copy(tmp);
    }
    return best;
  }

  function onDown(e) {
    e.preventDefault();
    handlers.onAnyDown && handlers.onAnyDown();
    if (st.id !== null) return; // 2本目以降は無視
    st.id = e.pointerId;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* 古い Safari */ }
    st.downAt = performance.now() / 1000;
    st.downX = st.x = e.clientX; st.downY = st.y = e.clientY; st.moved = 0;
    updateRay(e.clientX, e.clientY);
    lastPointerTime = st.downAt;
    const t = pick(e.clientX, e.clientY);
    st.target = t;
    st.pendingDown = true;
    if (t && t.kind === 'hero') handlers.beforeHeroGrab && handlers.beforeHeroGrab(t.id);
    if (t && t.kind === 'shell' && t.onDown) t.onDown(st.hitPoint.clone(), raycaster.ray);
    if (!t) handlers.onEmpty && handlers.onEmpty(raycaster.ray);
  }
  function onMove(e) {
    if (e.pointerId !== st.id) return;
    e.preventDefault();
    st.x = e.clientX; st.y = e.clientY;
    st.moved = Math.max(st.moved, Math.hypot(st.x - st.downX, st.y - st.downY));
    updateRay(e.clientX, e.clientY);
    lastPointerTime = performance.now() / 1000;
    const t = st.target;
    if (t && t.kind === 'shell' && t.onDrag) t.onDrag(raycaster.ray);
  }
  function onUp(e) {
    if (e.pointerId !== st.id) return;
    e.preventDefault();
    updateRay(e.clientX, e.clientY);
    const dur = performance.now() / 1000 - st.downAt;
    const isTap = dur <= TIMING.tapMax && st.moved <= TIMING.tapMovePx;
    handlers.onAnyDown && handlers.onAnyDown(); // iOS は離したときにも音を解錠
    const t = st.target;
    st.pendingUp = true;
    st.upIsTap = isTap;
    st.id = null;
    lastPointerTime = performance.now() / 1000;
    if (t && t.kind === 'shell' && t.onUp) t.onUp(raycaster.ray, isTap);
    if (t && t.kind === 'hero' && isTap && handlers.onHeroTap) handlers.onHeroTap(t.id);
  }
  canvas.addEventListener('pointerdown', onDown, { passive: false });
  canvas.addEventListener('pointermove', onMove, { passive: false });
  canvas.addEventListener('pointerup', onUp, { passive: false });
  canvas.addEventListener('pointercancel', onUp, { passive: false });
  // iOS の拡大・メニュー・スクロールを止める
  const stop = (e) => e.preventDefault();
  for (const ev of ['touchstart', 'touchmove', 'touchend', 'gesturestart', 'gesturechange', 'contextmenu', 'dblclick']) {
    canvas.addEventListener(ev, stop, { passive: false });
  }
  document.addEventListener('gesturestart', stop, { passive: false });

  return {
    hero,
    get idleTime() { return performance.now() / 1000 - lastPointerTime; },
    get pointerDown() { return st.id !== null; },
    get target() { return st.target; },
    // フレームの始めに hero 入力を組み立てる
    beginFrame(time) {
      hero.time = time;
      // カメラは毎フレーム動きうるので、押している指の光線を今のカメラで引き直す（指の下の物が指についてくる）
      if (st.id !== null && !st.pendingDown) {
        updateRay(st.x, st.y);
        const t0 = st.target;
        if (t0 && t0.kind === 'shell' && t0.onDrag) t0.onDrag(raycaster.ray);
      }
      hero.justGrabbed = false; hero.justReleased = false; hero.tap = null;
      const t = st.target;
      if (st.pendingDown) {
        st.pendingDown = false;
        if (t && t.kind === 'hero') { hero.grab = t.id; hero.justGrabbed = true; }
        else hero.grab = null;
      }
      hero.pointerDown = st.id !== null;
      if (st.pendingUp) {
        st.pendingUp = false;
        hero.justReleased = true;
        hero.pointerDown = false;
        if (t && t.kind === 'hero' && st.upIsTap) { tapObj.id = t.id; tapObj.point.copy(st.hitPoint); hero.tap = tapObj; }
        st.target = null;
        st.releaseGrab = true;
      }
    },
    endFrame() {
      if (st.releaseGrab) { st.releaseGrab = false; hero.grab = null; }
    },
  };
}
