// 指1本だけを追う入力。出来事（down/move/up/cancel）を列に積み、1フレームに1つずつ配る。
// タップ＝0.35秒以内・12px以内の移動。ピンチ・スクロール・長押しは止める。
// 2本目の指：今の指が「置いたまま」（STALE_S 以上ほとんど動いていない。画面の端に親指を載せている等）なら、
// 今の指を cancel して新しい指に切り替える。5歳児は iPad を持つ手の指が画面に触れていることが多く、
// 2本目を全部無視すると「触っても何も起きない」になるため。動かしている最中の指は取り上げない。
export const TAP_MAX_S = 0.35;
export const TAP_MAX_PX = 12;
const STALE_S = 0.6;

export function createInput(canvas) {
  const queue = [];
  let active = null; // { id, x0, y0, t0, x, y, moved }

  const now = () => performance.now() / 1000;
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
  };

  function push(ev) {
    // 連続する move はまとめる（最後の位置だけでよい）
    const last = queue[queue.length - 1];
    if (ev.phase === 'move' && last && last.phase === 'move') { queue[queue.length - 1] = ev; return; }
    queue.push(ev);
    if (queue.length > 64) queue.splice(0, queue.length - 64);
  }

  function onDown(e) {
    if (e.button !== undefined && e.button > 0) return;
    e.preventDefault();
    if (active) {
      if (now() - active.tMove < STALE_S) return; // 動いている指があるので、2本目は無視
      const old = active;
      onCancel();                                  // 置いたままの指はやめて、新しい指に切り替える
      try { canvas.releasePointerCapture(old.id); } catch (_) { /* 無視 */ }
    }
    const p = pos(e);
    active = { id: e.pointerId, x0: p.x, y0: p.y, t0: now(), tMove: now(), ax: p.x, ay: p.y, x: p.x, y: p.y, moved: false };
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* 無視 */ }
    push({ phase: 'down', x: p.x, y: p.y, w: p.w, h: p.h, tap: false });
  }
  function onMove(e) {
    if (!active || e.pointerId !== active.id) return;
    e.preventDefault();
    const p = pos(e);
    if (Math.hypot(p.x - active.ax, p.y - active.ay) > 6) { active.tMove = now(); active.ax = p.x; active.ay = p.y; }
    active.x = p.x; active.y = p.y;
    if (Math.hypot(p.x - active.x0, p.y - active.y0) > TAP_MAX_PX) active.moved = true;
    push({ phase: 'move', x: p.x, y: p.y, w: p.w, h: p.h, tap: false });
  }
  function onUp(e) {
    if (!active || e.pointerId !== active.id) return;
    e.preventDefault();
    const p = pos(e);
    const tap = !active.moved && (now() - active.t0) <= TAP_MAX_S
      && Math.hypot(p.x - active.x0, p.y - active.y0) <= TAP_MAX_PX;
    active = null;
    push({ phase: 'up', x: p.x, y: p.y, w: p.w, h: p.h, tap });
  }
  function onCancel(e) {
    if (!active || (e && e.pointerId !== active.id)) return;
    const a = active;
    active = null;
    push({ phase: 'cancel', x: a.x, y: a.y, w: canvas.clientWidth, h: canvas.clientHeight, tap: false });
  }

  canvas.addEventListener('pointerdown', onDown, { passive: false });
  canvas.addEventListener('pointermove', onMove, { passive: false });
  canvas.addEventListener('pointerup', onUp, { passive: false });
  canvas.addEventListener('pointercancel', onCancel);
  canvas.addEventListener('lostpointercapture', (e) => { if (active && e.pointerId === active.id) onCancel(e); });

  // ページのスクロール・ズーム・長押しメニューを止める
  const stop = (e) => e.preventDefault();
  document.addEventListener('touchmove', stop, { passive: false });
  document.addEventListener('gesturestart', stop, { passive: false });
  document.addEventListener('contextmenu', stop);
  document.addEventListener('dblclick', stop, { passive: false });

  return {
    next() { return queue.length ? queue.shift() : null; },
    get down() { return !!active; },
    cancelAll() { if (active) onCancel(); },
  };
}
