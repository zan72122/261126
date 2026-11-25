// The ferry: parametric hull (lofted sections), main deck, bulwarks, superstructure, funnels, fittings.
// Everything is merged into two geometries: `paint` (hull texture × vertex colors) and `deck` (deck texture).
import { P, COL } from './params.js';
import { clamp, smooth } from './geo.js';

// ---------- hull form (pure functions of the parameters) ----------
const HB = () => P.beam / 2;
/** bulwark top height along the ship */
export function sheer(z) { const s = smooth((z - 1) / 9); return P.sheerY + P.sheerRise * s * s; }
/** half breadth of the hull at station z and normalized height yn (0 keel … 1 sheer) */
export function halfBeam(z, yn) {
  yn = clamp(yn, 0, 1);
  if (z < -5) { const q = clamp((-5 - z) / 5, 0, 1); return HB() * (1 - (P.aftTaper + P.aftTuck * (1 - yn)) * q * q); }
  if (z <= P.foreStartZ) return HB();
  const tip = P.bowZ - P.bowRake * Math.pow(1 - yn, 1.6);
  const t = (z - P.foreStartZ) / Math.max(tip - P.foreStartZ, 1e-3);
  if (t >= 1) return 0;
  return HB() * Math.pow(1 - Math.pow(Math.max(t, 0), P.foreExp), 1 / P.foreExp);
}
/** height of the stem (the bow's leading edge) at station z */
export function stemY(z) {
  const z0 = P.bowZ - P.bowRake; if (z <= z0) return P.keelY;
  const q = clamp((P.bowZ - z) / P.bowRake, 0, 1);
  return P.keelY + (1 - Math.pow(q, 1 / 1.6)) * (sheer(z) - P.keelY);
}
/** outer skin x (≥0) at station z, height y (on the side, above the bilge) */
export function outerX(z, y) {
  const sh = sheer(z); if (y < stemY(z)) return 0;
  const xn = 0.965 + 0.035 * Math.pow(clamp((y + 0.3) / (sh + 0.3), 0, 1), 0.8);
  return xn * halfBeam(z, (y - P.keelY) / (sh - P.keelY));
}
/** inner face of the bulwark at the top / at deck level */
export function innerTopX(z) { return Math.max(0, outerX(z, sheer(z)) - P.bulwarkT); }
/** bottom edge of the bulwark's inner face: deck level, or the stem where the bow rises above the deck */
export function innerFootY(z) { return Math.min(sheer(z), Math.max(P.deckY - 0.03, stemY(z) + 0.05)); }
const skinMargin = (z) => 0.1 + 0.26 * smooth((z - 5) / 4) + 2.5 * smooth((z - 8.9) / 0.6); // the lofted skin is faceted: stay well inside it at the bow
export function innerDeckX(z) { return Math.max(0, Math.min(innerTopX(z), outerX(z, innerFootY(z)) - skinMargin(z))); }

function stations(tier) {
  const zs = []; const na = tier === 'low' ? 10 : 14, nf = tier === 'low' ? 15 : 22;
  for (let k = 0; k < na; k++) zs.push(P.sternZ + (P.foreStartZ - P.sternZ) * (k / na));
  for (let k = 0; k <= nf; k++) zs.push(P.foreStartZ + (P.bowZ - P.foreStartZ) * Math.sin((k / nf) * Math.PI / 2));
  return zs;
}

export function buildShip(THREE, kit, tier) {
  const { Builder, mat, roundRect, outlineInfo, offsetOutline, walls, cap, slab, panes, railing } = kit;
  const B = new Builder(); // paint
  const D = new Builder(); // deck
  const low = tier === 'low';
  const zs = stations(tier), nz = zs.length;
  const keel = P.keelY, dy = P.deckY;

  // ----- outer skin: rows from the keel up to the sheer (rows repeat at color seams) -----
  const rows = [];
  rows.push({ xn: 0, y: () => keel, c: COL.hullBottom }, { xn: 0.38, y: () => keel + 0.015, c: COL.hullBottom }, { xn: 0.72, y: () => keel + 0.04, c: COL.hullBottom });
  for (const a of low ? [45] : [22.5, 45, 67.5]) { const r = (a * Math.PI) / 180; rows.push({ xn: 0.72 + 0.245 * Math.sin(r), y: () => -0.3 - 0.66 * Math.cos(r), c: COL.hullBottom }); }
  rows.push({ y: () => -0.3, c: COL.hullBottom }, { y: () => P.bootY, c: COL.hullBottom }, { y: () => P.bootY, c: COL.hullWhite });
  rows.push({ y: (sh) => (P.bootY + sh - P.bandLo) / 2, c: COL.hullWhite }, { y: (sh) => sh - P.bandLo, c: COL.hullWhite }, { y: (sh) => sh - P.bandLo, c: COL.band });
  rows.push({ y: (sh) => sh - P.bandHi, c: COL.band }, { y: (sh) => sh - P.bandHi, c: COL.hullWhite }, { y: (sh) => sh, c: COL.hullWhite });
  const jDeck = rows.length - 2; // the row at deck level (sheer - bandHi ≈ deckY at the stern)
  const skin = (i, j, o) => {
    const z = zs[i], sh = sheer(z), r = rows[j]; let y = r.y(sh), x;
    if (r.xn !== undefined) x = r.xn * halfBeam(z, (y - keel) / (sh - keel)); else x = outerX(z, y);
    const sy = stemY(z); if (y <= sy || x <= 1e-4) { x = 0; y = Math.max(y, sy); }
    o.x = x; o.y = y; o.z = z; o.color = r.c; o.u = z / P.hullUv; o.v = y / P.hullUv;
  };
  const m0 = B.mark();
  B.grid(nz, rows.length, skin, { flip: true });
  // bulwark: flat top and inner face
  B.grid(nz, 2, (i, j, o) => { const z = zs[i]; o.x = j === 0 ? outerX(z, sheer(z)) : innerTopX(z); o.y = sheer(z); o.z = z; o.color = COL.band; }, { flip: true });
  B.grid(nz, 2, (i, j, o) => { const z = zs[i]; o.x = j === 0 ? innerTopX(z) : innerDeckX(z); o.y = j === 0 ? sheer(z) : innerFootY(z); o.z = z; o.color = COL.cabinShade; }, { flip: true });
  // transom (stern end): fan up to deck level, bulwark ends above
  {
    const o = { x: 0, y: 0, z: 0, color: 0 }, a = [0, 0, 0], b = [0, 0, 0], c = [0, 0.7, P.sternZ];
    for (let j = 0; j < jDeck; j++) {
      skin(0, j, o); a[0] = o.x; a[1] = o.y; a[2] = o.z; const col = rows[j + 1].c === rows[j].c ? rows[j].c : rows[j + 1].c;
      skin(0, j + 1, o); b[0] = o.x; b[1] = o.y; b[2] = o.z;
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 1e-4) B.tri(c, b.slice(), a.slice(), col);
    }
    const xo = outerX(P.sternZ, dy - 0.02), xt = outerX(P.sternZ, sheer(P.sternZ));
    B.quad([innerDeckX(P.sternZ), dy - 0.03, P.sternZ], [xo, dy - 0.03, P.sternZ], [xt, P.sheerY, P.sternZ], [innerTopX(P.sternZ), P.sheerY, P.sternZ], COL.hullWhite);
  }
  B.mirrorX(m0);
  { // close the transom between the two halves at deck level
    const o = { x: 0, y: 0, z: 0, color: 0 }; skin(0, jDeck, o);
    B.tri([0, 0.7, P.sternZ], [-o.x, o.y, P.sternZ], [o.x, o.y, P.sternZ], COL.band);
  }

  // ----- main deck (deck texture) -----
  D.grid(nz, 2, (i, j, o) => { const z = zs[i], x = Math.max(0, Math.min(innerDeckX(z) + 0.02, outerX(z, dy) - skinMargin(z))); o.x = j === 0 ? x : -x; o.y = dy; o.z = z; o.u = o.x / P.deckUv; o.v = z / P.deckUv; o.color = COL.deckTint; }, { flip: true });

  // ----- stern: bulwark stubs beside the ramp opening, gate towers, bitts, rope coils -----
  const sternIn = innerDeckX(P.sternZ + 0.1);
  const gateX = P.rampW / 2 + 0.16;
  for (const sx of [1, -1]) {
    const w = sternIn - gateX + 0.06;
    B.box(w, P.sheerY - dy + 0.03, 0.2, COL.hullWhite, sx * (gateX + w / 2), (P.sheerY + dy - 0.03) / 2, P.sternZ + 0.1);
    B.box(w + 0.06, 0.06, 0.26, COL.band, sx * (gateX + w / 2), P.sheerY + 0.01, P.sternZ + 0.1);
    // tower that carries the ramp cable
    const tx = sx * P.towerX, tz = P.sternZ + 0.14;
    B.box(0.26, P.towerH, 0.26, COL.cabin, tx, dy + P.towerH / 2, tz);
    B.box(0.34, 0.14, 0.34, COL.yellow, tx, dy + P.towerH + 0.05, tz);
    B.box(0.3, 0.3, 0.3, COL.yellow, tx, dy + 0.15, tz);
    B.add(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 8), COL.dark, mat(tx - sx * 0.06, dy + P.towerH - 0.16, tz - 0.1, 0, 0, Math.PI / 2));
    B.rod(tx, dy + 1.2, tz + 0.1, tx, dy, tz + 1.1, 0.05, COL.cabin, 5); // brace
    // bitts (the mooring line starts here)
    const [cx, cy, cz] = P.cleats[sx > 0 ? 0 : 1];
    for (const k of [-0.13, 0.13]) B.add(new THREE.CylinderGeometry(0.075, 0.085, cy - P.sheerY, 7), COL.dark, mat(cx + k, (cy + P.sheerY) / 2, cz));
    B.rod(cx - 0.24, cy - 0.07, cz, cx + 0.24, cy - 0.07, cz, 0.04, COL.dark, 5);
    // a coil of spare rope on the deck
    for (let k = 0; k < 3; k++) B.add(new THREE.TorusGeometry(0.3 - k * 0.03, 0.05, 4, 10), COL.rope, mat(sx * 2.95, dy + 0.05 + k * 0.08, P.sternZ + 1.0, Math.PI / 2, 0, k));
  }

  // ----- deck markings (thin plates just above the deck) -----
  const my = dy + 0.014;
  const flatRect = (x0, x1, z0, z1, color) => B.quad([x0, my, z0], [x0, my, z1], [x1, my, z1], [x1, my, z0], color);
  for (const [sx, sz] of P.slots) { // a box for each parking place
    const hw = 1.0, hl = 1.42, t = 0.07;
    flatRect(sx - hw, sx + hw, sz - hl, sz - hl + t, COL.lineWhite); flatRect(sx - hw, sx + hw, sz + hl - t, sz + hl, COL.lineWhite);
    flatRect(sx - hw, sx - hw + t, sz - hl, sz + hl, COL.lineWhite); flatRect(sx + hw - t, sx + hw, sz - hl, sz + hl, COL.lineWhite);
  }
  for (const az of [-8.6, -5.3, -2.3]) { // arrows up the aisle (chevrons, no text)
    B.quad([0, my, az + 0.4], [0, my, az + 0.75], [0.55, my, az + 0.1], [0.55, my, az - 0.25], COL.yellow);
    B.quad([0, my, az + 0.75], [0, my, az + 0.4], [-0.55, my, az - 0.25], [-0.55, my, az + 0.1], COL.yellow);
  }
  for (let k = 0; k < 10; k++) { // hazard stripes at the stern threshold
    const x0 = -P.rampW / 2 + (k * P.rampW) / 10; flatRect(x0, x0 + P.rampW / 10, P.sternZ + 0.04, P.sternZ + 0.42, k % 2 ? COL.hazard : COL.yellow);
  }
  flatRect(-P.deckHalfW + 0.25, -P.deckHalfW + 0.33, P.sternZ + 0.6, P.deckFrontZ - 0.2, COL.yellow);
  flatRect(P.deckHalfW - 0.33, P.deckHalfW - 0.25, P.sternZ + 0.6, P.deckFrontZ - 0.2, COL.yellow);

  // ----- lower cabin -----
  const cz0 = P.cabinZ0, cr = 0.55, top = P.cabinTop;
  const sideW = (z) => Math.min(P.cabinHalfW, innerDeckX(z) - 0.45);
  const lower = []; const cseg = low ? 3 : 5;
  const wA = sideW(cz0 + cr);
  for (let k = 0; k <= cseg; k++) { const a = -Math.PI / 2 + (k / cseg) * Math.PI / 2; lower.push([wA - cr + Math.cos(a) * cr, cz0 + cr + Math.sin(a) * cr]); }
  const iSide0 = lower.length - 1; const nSide = low ? 5 : 7;
  for (let k = 1; k <= nSide; k++) { const z = cz0 + cr + (P.cabinNoseZ - cz0 - cr) * (k / nSide); lower.push([sideW(z), z]); }
  const iSide1 = lower.length - 1; const xf = sideW(P.cabinNoseZ), nNose = low ? 8 : 12;
  for (let k = 1; k < nNose; k++) { const a = (k / nNose) * Math.PI; lower.push([xf * Math.cos(a), P.cabinNoseZ + (P.cabinZ1 - P.cabinNoseZ) * Math.sin(a)]); }
  const jSide0 = lower.length;
  for (let k = nSide; k >= 0; k--) { const z = cz0 + cr + (P.cabinNoseZ - cz0 - cr) * (k / nSide); lower.push([-sideW(z), z]); }
  const jSide1 = lower.length - 1;
  for (let k = 1; k <= cseg; k++) { const a = Math.PI + (k / cseg) * Math.PI / 2; lower.push([-(wA - cr) + Math.cos(a) * cr, cz0 + cr + Math.sin(a) * cr]); }
  walls(B, lower, dy - 0.02, top, COL.cabin);
  walls(B, offsetOutline(lower, 0.015), dy - 0.02, dy + 0.5, COL.band); // a colored skirt
  const roofL = offsetOutline(lower, 0.14);
  slab(B, roofL, top, top + 0.12, COL.cabin, COL.roof);
  const li = outlineInfo(lower);
  // side windows
  panes(B, lower, dy + 1.15, dy + 1.95, COL.glass, { pane: 0.8, gap: 0.28, s0: li.seg[iSide0].s0 + 0.2, s1: li.seg[iSide1].s0 - 0.1 });
  panes(B, lower, dy + 1.15, dy + 1.95, COL.glass, { pane: 0.8, gap: 0.28, s0: li.seg[jSide0].s0 + 0.1, s1: li.seg[jSide1].s0 - 0.2 });
  panes(B, lower, dy + 1.25, dy + 1.85, COL.glass, { pane: 0.55, gap: 0.3, s0: li.seg[iSide1].s0 + 0.35, s1: li.seg[jSide0].s0 - 0.35 });
  // aft wall (faces the car deck): door, windows, lamp, lifebuoys
  const az = cz0 - 0.03;
  const aftQuad = (x0, x1, y0, y1, color, z = az) => B.quad([x1, y0, z], [x0, y0, z], [x0, y1, z], [x1, y1, z], color);
  aftQuad(-0.55, 0.55, dy, dy + 1.85, COL.door); aftQuad(-0.62, 0.62, dy + 1.85, dy + 1.95, COL.band);
  B.add(new THREE.CircleGeometry(0.24, 12), COL.glassLight, mat(0, dy + 1.3, az - 0.02, 0, Math.PI, 0));
  B.add(new THREE.SphereGeometry(0.06, 6, 4), COL.yellow, mat(0.4, dy + 0.95, az - 0.05));
  for (const sx of [1, -1]) {
    for (const [x0, x1] of [[0.95, 1.7], [1.82, 2.5]]) aftQuad(Math.min(sx * x0, sx * x1), Math.max(sx * x0, sx * x1), dy + 1.15, dy + 1.95, COL.glass);
    B.add(new THREE.SphereGeometry(0.12, 8, 5), 0xfff3b0, mat(sx * 0.95, dy + 2.25, az - 0.08));
    // lifebuoy: four arcs, red and white
    for (let k = 0; k < 4; k++) B.add(new THREE.TorusGeometry(0.3, 0.085, 5, 5, Math.PI / 2), k % 2 ? COL.cabin : COL.red, mat(sx * 2.05, top + 0.62, cz0 - 0.2, 0, 0, k * Math.PI / 2 + Math.PI / 4));
  }
  // promenade railing on the cabin roof
  railing(B, offsetOutline(lower, 0.04), top + 0.12, { h: 0.8, post: low ? 1.5 : 1.05, color: COL.rail });

  // ----- wheelhouse -----
  const house = roundRect(-P.houseHalfW, P.houseHalfW, P.houseZ0, P.houseZ1, 0.7, low ? 3 : 5);
  walls(B, house, top + 0.12, P.houseTop, COL.cabin);
  panes(B, house, top + 0.62, top + 1.3, COL.glass, { pane: 0.72, gap: 0.13 });
  slab(B, offsetOutline(house, 0.24), P.houseTop, P.roofY, COL.cabin, COL.funnelBand);
  // mast, horns, lamp (kept in front of the place where the gulls sit)
  const mz = P.houseZ1 - 0.22;
  B.rod(0, P.roofY, mz, 0, P.roofY + 1.5, mz, 0.05, COL.cabin, 6, 0, 0.035);
  B.rod(-0.55, P.roofY + 1.05, mz, 0.55, P.roofY + 1.05, mz, 0.03, COL.cabin, 4);
  B.add(new THREE.SphereGeometry(0.1, 8, 6), COL.yellow, mat(0, P.roofY + 1.56, mz));
  B.tri([0, P.roofY + 1.45, mz - 0.04], [0, P.roofY + 1.15, mz - 0.04], [0, P.roofY + 1.3, mz - 0.6], COL.funnelBand);
  B.tri([0, P.roofY + 1.45, mz - 0.04], [0, P.roofY + 1.3, mz - 0.6], [0, P.roofY + 1.15, mz - 0.04], COL.funnelBand);
  for (const sx of [1, -1]) B.add(new THREE.ConeGeometry(0.13, 0.4, 8, 1, true), COL.yellow, mat(sx * 0.8, P.roofY + 0.2, P.houseZ1 - 0.1, -Math.PI / 2 + 0.25, 0, 0));
  B.box(0.9, 0.09, 0.14, COL.dark, 0, P.roofY + 0.75, mz);

  // ----- twin funnels (beside the wheelhouse, so the roof stays free for the gulls) -----
  const fseg = low ? 10 : 14, fh = P.funnelTop - (top + 0.12);
  for (const sx of [1, -1]) {
    const m = B.mark();
    B.add(new THREE.CylinderGeometry(P.funnelR * 0.9, P.funnelR, fh, fseg, 1, true), COL.funnel, mat(0, fh / 2, 0));
    B.add(new THREE.CylinderGeometry(P.funnelR * 0.925 + 0.02, P.funnelR * 0.945 + 0.02, fh * 0.16, fseg, 1, true), COL.funnelBand, mat(0, fh * 0.7, 0));
    B.add(new THREE.CylinderGeometry(P.funnelR * 0.9 + 0.04, P.funnelR * 0.9 + 0.04, fh * 0.1, fseg, 1, false), COL.funnelCap, mat(0, fh * 0.955, 0));
    B.add(new THREE.CylinderGeometry(P.funnelR + 0.1, P.funnelR + 0.14, 0.14, fseg, 1, false), COL.cabin, mat(0, 0.07, 0));
    B.transform(mat(sx * P.funnelX, top + 0.12, P.funnelZ, -0.1, 0, 0), m);
  }

  // ----- fenders (old tires) along the sides -----
  for (const z of low ? [-6.5, 1.5] : [-7.2, -2.4, 2.4]) for (const sx of [1, -1]) {
    const x = outerX(z, 1.05) + 0.12;
    B.add(new THREE.TorusGeometry(0.36, 0.13, 5, low ? 8 : 10), COL.rubber, mat(sx * x, 1.05, z, 0, Math.PI / 2, 0));
    B.rod(sx * x, 1.4, z, sx * (outerX(z, P.sheerY) - 0.05), P.sheerY, z, 0.025, COL.rope, 4);
  }

  return {
    paint: B.build({ uvScale: P.hullUv }), deck: D.build({ uvScale: P.deckUv }),
    tris: B.tris + D.tris,
  };
}
