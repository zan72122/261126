// 入力：最初の1本の指だけ。押した物で役割を決める（瓶／お客さん／それ以外＝割り箸を持つ）。
import { PAN, PAN_ORIGIN } from './layout.js';

export function createInput(THREE, canvas, camera, handlers) {
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(PAN_ORIGIN[1] + PAN.moveY));
  const hitP = new THREE.Vector3(), jarC = new THREE.Vector3();
  const st = {
    id: null, role: null, downT: 0, downX: 0, downY: 0, moved: 0,
    holding: false, target: new THREE.Vector3(0, PAN.moveY, 0), far: false, overCustomer: false,
    lastActivity: 0, touch: false,
  };
  // 指で触る時は、わたあめが指に隠れないように、目標点を指より少し奥（画面では上）へずらす
  const TOUCH_AHEAD = 0.06;
  let targets = { jars: [], customer: null, hero: [] };

  function toNdc(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  }

  // 指の位置 → 釜の中の目標点（root 座標）と「お客さん側へ出た」判定
  function project() {
    st.overCustomer = !!(targets.customer && ray.intersectObject(targets.customer, false).length);
    const ok = ray.ray.intersectPlane(plane, hitP);
    let x, z;
    if (!ok) { x = 0; z = -9; } else { x = hitP.x - PAN_ORIGIN[0]; z = hitP.z - PAN_ORIGIN[2]; }
    st.far = z < -(PAN.innerRadius + 0.12) || st.overCustomer;
    if (st.touch) z -= TOUCH_AHEAD;
    const r = Math.hypot(x, z), m = PAN.moveRadius;
    if (r > m) { x *= m / r; z *= m / r; }
    st.target.set(x, PAN.moveY, z);
  }

  function onDown(e) {
    if (st.id !== null) return;          // 2本目以降は無視
    st.id = e.pointerId;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    e.preventDefault();
    handlers.onFirstTouch && handlers.onFirstTouch();
    st.downT = performance.now(); st.downX = e.clientX; st.downY = e.clientY; st.moved = 0;
    st.touch = e.pointerType === 'touch' || e.pointerType === 'pen';
    st.lastActivity = st.downT;
    toNdc(e);
    const jh = ray.intersectObjects(targets.jars, false);
    if (jh.length) {
      // 重なって見える瓶は、指にいちばん近い軸の瓶を選ぶ
      let best = null, bd = Infinity;
      for (const h of jh) {
        h.object.getWorldPosition(jarC); jarC.y += 0.09;
        const d = ray.ray.distanceSqToPoint(jarC);
        if (d < bd) { bd = d; best = h.object; }
      }
      st.role = 'jar'; handlers.onJar(best.userData.jarIndex); return;
    }
    if (targets.customer && ray.intersectObject(targets.customer, false).length) {
      st.role = 'customer'; handlers.onCustomer(); return;
    }
    st.role = 'stick'; st.holding = true;
    project();
    handlers.onGrab && handlers.onGrab();
  }

  function onMove(e) {
    if (e.pointerId !== st.id) return;
    e.preventDefault();
    st.moved = Math.max(st.moved, Math.hypot(e.clientX - st.downX, e.clientY - st.downY));
    st.lastActivity = performance.now();
    if (st.role !== 'stick' || !st.holding) return;
    toNdc(e); project();
    if (st.far) handlers.onGiveGesture && handlers.onGiveGesture();
  }

  function onUp(e) {
    // iOS Safari は指を離した時（pointerup / touchend）を「ユーザーの操作」とみなすので、ここでも音を起こす
    handlers.onRelease && handlers.onRelease();
    if (e.pointerId !== st.id) return;
    const dtms = performance.now() - st.downT;
    if (st.role === 'stick' && st.holding && dtms < 250 && st.moved < 12) {
      handlers.onTap && handlers.onTap(st.target.clone());
    }
    st.id = null; st.role = null; st.holding = false; st.far = false;
    st.lastActivity = performance.now();
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
  }

  canvas.addEventListener('pointerdown', onDown, { passive: false });
  canvas.addEventListener('pointermove', onMove, { passive: false });
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('lostpointercapture', onUp);
  // iOS の拡大・長押しメニューを止める
  const stop = e => e.preventDefault();
  document.addEventListener('gesturestart', stop, { passive: false });
  document.addEventListener('dblclick', stop, { passive: false });
  canvas.addEventListener('contextmenu', stop);
  canvas.addEventListener('touchstart', stop, { passive: false });

  return {
    state: st,
    setTargets(t) { targets = t; },
    // 渡した後など：指が下りていても割り箸は持っていない扱いにする
    dropStick() { st.holding = false; st.role = 'none'; },
  };
}
