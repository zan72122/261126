// Trays pinned to the screen edges. The camera frames the cake closely, so the tools (4 color bowls, 5 dishes,
// the cake box and the piping bag's resting place) are "docks" placed every frame at a fixed spot on the screen,
// a fixed distance in front of the camera, with a scale that gives them a fixed size in pixels. They are ordinary
// scene objects, so the same raycaster picks them and the bag / fruit fly between them and the cake in world space.
//   landscape: bowls + bag in a column on the left, box + dishes on the right, cake in the middle
//   portrait : box + bag + (customer) on top, bowls below them, the cake low (within reach), dishes at the bottom
// Outside decorating (box, give, party) the trays slide off the edges so the camera can pull back on a clear stage.
import { THREE, clamp } from './util.js';
import { L } from './world.js';
import { FOV, Damped } from './camera.js';

const TAN = Math.tan((FOV * Math.PI) / 360);
const DOCK_D = 6; // distance of the trays in front of the camera (world units)

export class Tray {
  constructor(W, rig) {
    this.W = W; this.rig = rig;
    const dock = (obj, w, h, cy, key) => ({ obj, w, h, cy, key, px: 0, py: 0, ppu: 0, ox: 0, oy: 0, s: 1 });
    // w, h: on-screen footprint in item units; cy: height of the visual center above the dock origin
    this.bowls = W.bowls.map((b, i) => dock(b.group, 1.32, 1.0, 0.3, 'bowl' + i));
    this.dishes = W.dishes.map((d, i) => dock(d.group, 1.4, 0.95, 0.18, 'dish' + i));
    this.box = dock(W.box.dock, 1.35, 1.5, 0.55, 'box');
    this.bag = dock(W.bag.dock, 2.05, 0.9, 0.36, 'bag');
    this.all = [...this.bowls, ...this.dishes, this.box, this.bag];
    this.out = new Damped(0);
    this.insets = { l: 0, r: 0, t: 0, b: 0 };
    this.cakeRect = null;
    this.custPx = null;
    this._v = new THREE.Vector3(); this._ray = new THREE.Ray();
  }

  // ---------- layout (on resize / safe-area change) ----------
  layout(insets) {
    const rig = this.rig, w = rig.w, h = rig.h, S = Math.min(w, h);
    if (insets) this.insets = insets;
    const ins = this.insets;
    // where the cake sits in the resting decorate framing
    const pose = rig.poseFor('idle');
    const R = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    const q = { x: 0, y: 0, depth: 0 };
    for (let i = 0; i < rig._n; i++) {
      if (!rig.projectWith(pose, rig._pts[i], q)) continue;
      R.x0 = Math.min(R.x0, q.x); R.x1 = Math.max(R.x1, q.x); R.y0 = Math.min(R.y0, q.y); R.y1 = Math.max(R.y1, q.y);
    }
    this.cakeRect = R;
    const pad = S * 0.022, gap = S * 0.015;
    const safe = { l: ins.l + pad, r: w - ins.r - pad, t: ins.t + pad, b: h - ins.b - pad };
    const cap = S * 0.17; // largest pixels per item unit (a bowl is then ~22% of the short side)
    const D = this;
    if (!rig.portrait) {
      const left = { x0: safe.l, x1: Math.max(safe.l + S * 0.14, R.x0 - gap), y0: safe.t, y1: safe.b };
      const right = { x0: Math.min(safe.r - S * 0.14, R.x1 + gap), x1: safe.r, y0: safe.t, y1: safe.b };
      const [b0, b1, b2, b3] = D.bowls, [d0, d1, d2, d3, d4] = D.dishes;
      // one tall column, or two-wide rows when the screen is wide and short (phones held sideways)
      this._best(left, [[[b0], [b1], [b2], [b3], [D.bag]], [[b0, b1], [b2, b3], [D.bag]]], 'row', cap, -(left.x1 + S * 0.15), 0);
      this._best(right, [[[D.box], [d0], [d1], [d2], [d3], [d4]], [[D.box, d0], [d1, d2], [d3, d4]]], 'row', cap, w - right.x0 + S * 0.15, 0);
      // the customer peeks in from behind the cake, right of center, smaller in the distance
      this.custPx = { x: R.x0 + (R.x1 - R.x0) * 0.9, y: safe.t + S * 0.03 };
    } else {
      const top = { x0: safe.l, x1: safe.r, y0: safe.t, y1: Math.max(safe.t + S * 0.4, R.y0 - gap) };
      const bot = { x0: safe.l, x1: safe.r, y0: Math.min(safe.b - S * 0.24, R.y1 + gap), y1: safe.b };
      const [d0, d1, d2, d3, d4] = D.dishes;
      // row 1: box, bag, (room for the customer peeking in from behind); row 2: the four bowls
      this._best(top, [[[D.box, D.bag, null], D.bowls]], 'row', cap, 0, -(top.y1 + S * 0.15));
      this._best(bot, [[[d0, d1, d2, d3, d4]], [[d0, d1, d2], [d3, d4]]], 'row', cap, 0, h - bot.y0 + S * 0.15);
      this.custPx = { x: top.x0 + (top.x1 - top.x0) * 0.84, y: safe.t + S * 0.03 };
    }
    // customer's spot at the window: custPx is where the top of the head (ears, y ~ 2.45) should be on screen;
    // the feet go below that point on the counter, behind the cake
    const r = rig.rayWith(pose, this.custPx.x, this.custPx.y, this._ray);
    let t = (2.45 - r.origin.y) / r.direction.y;
    let p = this._v.copy(r.origin).addScaledVector(r.direction, t);
    const zc = clamp(p.z, -4.7, -2.4);
    if (zc !== p.z) { t = (zc - r.origin.z) / r.direction.z; p = this._v.copy(r.origin).addScaledVector(r.direction, t); }
    L.custWindow.set(clamp(p.x, -4, 4.5), 0, zc);
  }

  // Try a few arrangements of a band and keep the one with the biggest items.
  // lines: rows (kind 'row') or columns (kind 'col'); null = an empty cell (keeps room).
  _best(rect, options, kind, cap, ox, oy) {
    let best = null;
    for (const lines of options) {
      const ppu = this._fit(rect, lines, kind, cap);
      if (!best || ppu > best.ppu + 1e-6) best = { lines, ppu };
    }
    this._place(rect, best.lines, kind, best.ppu, ox, oy);
  }

  _fit(rect, lines, kind, cap) {
    const W = rect.x1 - rect.x0, H = rect.y1 - rect.y0;
    const along = kind === 'row' ? W : H, across = kind === 'row' ? H : W;
    let ppu = cap, sumAcross = 0;
    for (const line of lines) {
      let sumAlong = 0, maxAcross = 0;
      for (const d of line) {
        const a = d ? (kind === 'row' ? d.w : d.h) : 1.4, c = d ? (kind === 'row' ? d.h : d.w) : 0;
        sumAlong += a; maxAcross = Math.max(maxAcross, c);
      }
      ppu = Math.min(ppu, (along * 0.94) / (sumAlong * 1.08));
      sumAcross += maxAcross * 1.12;
    }
    return Math.max(1, Math.min(ppu, (across * 0.96) / sumAcross));
  }

  _place(rect, lines, kind, ppu, ox, oy) {
    const W = rect.x1 - rect.x0, H = rect.y1 - rect.y0;
    const across = kind === 'row' ? H : W;
    const sizes = lines.map((line) => Math.max(...line.map((d) => (d ? (kind === 'row' ? d.h : d.w) : 0))) * 1.12 * ppu);
    const total = sizes.reduce((a, b) => a + b, 0);
    let c = (across - total) / 2;
    lines.forEach((line, li) => {
      const mid = c + sizes[li] / 2; c += sizes[li];
      const weights = line.map((d) => (d ? (kind === 'row' ? d.w : d.h) : 1.4));
      const sum = weights.reduce((a, b) => a + b, 0);
      const along = kind === 'row' ? W : H;
      let a = 0;
      line.forEach((d, k) => {
        const cell = (weights[k] / sum) * along;
        const centerAlong = a + cell / 2; a += cell;
        if (!d) return;
        d.ppu = ppu;
        if (kind === 'row') { d.px = rect.x0 + centerAlong; d.py = rect.y0 + mid; } else { d.px = rect.x0 + mid; d.py = rect.y0 + centerAlong; }
        d.ox = ox; d.oy = oy;
      });
    });
  }

  // ---------- per frame (after the camera moved) ----------
  update(dt, camera, traysIn, snap = false) {
    const rig = this.rig, w = rig.w, h = rig.h;
    const goal = traysIn ? 0 : 1;
    if (snap) this.out.snap(goal); else this.out.to(goal, goal ? 0.4 : 0.4, dt);
    const k = clamp(this.out.v, 0, 1.05);
    const wpp = (2 * DOCK_D * TAN) / h; // world units per pixel at the tray distance
    const m = camera.matrixWorld;
    for (const d of this.all) {
      if (!d.ppu) continue;
      const px = d.px + d.ox * k, py = d.py + d.oy * k;
      const s = d.ppu * wpp;
      d.s = s;
      const o = d.obj;
      o.position.set((px - w / 2) * wpp, (h / 2 - py) * wpp, -DOCK_D).applyMatrix4(m);
      o.position.y -= d.cy * s;
      o.scale.setScalar(s);
      o.visible = k < 0.995;
      o.updateMatrixWorld(true);
    }
    // the bag's resting place (the bag itself is moved by the game, toward L.bagHome)
    L.bagHome.copy(this.W.bag.tipLocal);
    this.W.bag.dock.localToWorld(L.bagHome);
    this.W.bag.homeScale = L.bagScale * this.bag.s;
  }
}
