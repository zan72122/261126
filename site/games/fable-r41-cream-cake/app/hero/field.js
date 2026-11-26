// Low-resolution height field of everything on the cake top (cream + fruit), plus a snapshot of how it
// looked before the current stroke. Cream rests on it, fruit lands on it, rays are tested against it.
import { P } from './params.js';

const DIRS = 6;

export function createField(R, HMAX) {
  const G = P.grid, EXT = R + 0.12, cell = (2 * EXT) / (G - 1), inv = 1 / cell;
  const hm = new Float32Array(G * G);    // top of everything
  const hm0 = new Float32Array(G * G);   // the same, frozen when the current stroke began
  const cov = new Uint8Array(G * G);     // 1 where cream lies
  const own = new Uint16Array(G * G);    // stroke that last laid cream at (about) the top of each cell
  const disc = new Uint8Array(G * G);
  const HCEIL = HMAX + 0.05, RH2 = (R + 0.05) * (R + 0.05);
  let discN = 0;
  for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
    const x = -EXT + i * cell, z = -EXT + j * cell;
    if (x * x + z * z <= R * R) { disc[j * G + i] = 1; discN++; }
  }
  const dc = new Float32Array(DIRS), ds = new Float32Array(DIRS);
  for (let k = 0; k < DIRS; k++) { dc[k] = Math.cos((k / DIRS) * Math.PI * 2 + 0.3); ds[k] = Math.sin((k / DIRS) * Math.PI * 2 + 0.3); }

  const f = { hm, hm0, cov, own, G, cell, EXT, max: 0, max0: 0, covN: 0, discN };

  // bilinear sample; out-of-range and NaN coordinates clamp to the border (which is always 0)
  function sample(a, x, z) {
    let fx = (x + EXT) * inv, fz = (z + EXT) * inv;
    if (!(fx > 0)) fx = 0; else if (fx > G - 1.001) fx = G - 1.001;
    if (!(fz > 0)) fz = 0; else if (fz > G - 1.001) fz = G - 1.001;
    const i = fx | 0, j = fz | 0, u = fx - i, v = fz - j, k = j * G + i;
    return (a[k] * (1 - u) + a[k + 1] * u) * (1 - v) + (a[k + G] * (1 - u) + a[k + G + 1] * u) * v;
  }
  f.sample = sample;

  f.heightAt = (x, z) => {
    if (!(x * x + z * z <= RH2)) return 0;
    const h = sample(hm, x, z);
    return h > 0 && h < 1e3 ? h : 0;
  };

  // Height of the centre line of a tube (half-width rx, half-height ry) resting on field `a` at (x, z):
  // a rounded body rolls over bumps instead of dropping into narrow gaps.
  f.rest = (a, x, z, rx, ry) => {
    let m = sample(a, x, z) + ry;
    const d = 0.55 * rx, up = 0.835 * ry;
    for (let k = 0; k < DIRS; k++) {
      const h = sample(a, x + d * dc[k], z + d * ds[k]) + up;
      if (h > m) m = h;
    }
    return m;
  };

  // The same, but resting only on cream laid since the snapshot (cells where hm rose above hm0); −1e9 if none.
  f.restOwn = (x, z, rx, ry) => {
    let m = -1e9;
    const d = 0.55 * rx, up = 0.835 * ry;
    if (sample(hm, x, z) > sample(hm0, x, z) + 0.01) m = sample(hm, x, z) + ry;
    for (let k = 0; k < DIRS; k++) {
      const px = x + d * dc[k], pz = z + d * ds[k], h = sample(hm, px, pz);
      if (h > sample(hm0, px, pz) + 0.01 && h + up > m) m = h + up;
    }
    return m;
  };

  // lowest point of field `a` on a circle of radius d around (x, z)
  f.lowAround = (a, x, z, d) => {
    let m = 1e9;
    for (let k = 0; k < DIRS; k++) {
      const h = sample(a, x + d * dc[k], z + d * ds[k]);
      if (h < m) m = h;
    }
    return m;
  };

  // highest point of field `a` within radius d of (x, z) (centre + ring of samples)
  f.around = (a, x, z, d) => {
    let m = sample(a, x, z);
    for (let k = 0; k < DIRS; k++) {
      const h = sample(a, x + d * dc[k], z + d * ds[k]);
      if (h > m) m = h;
    }
    return m;
  };

  // A rounded bump: top(d) = cy + ry·sqrt(1 − d²/rx²). Only ever raises the field.
  f.stamp = (x, z, cy, rx, ry, cream, sid) => {
    if (!(rx > 0.004) || !(x + z + cy + ry < 1e6) || !(x + z + cy + ry > -1e6)) return;
    const i0 = Math.max(0, Math.ceil((x - rx + EXT) * inv)), i1 = Math.min(G - 1, Math.floor((x + rx + EXT) * inv));
    const j0 = Math.max(0, Math.ceil((z - rx + EXT) * inv)), j1 = Math.min(G - 1, Math.floor((z + rx + EXT) * inv));
    const ir2 = 1 / (rx * rx);
    for (let j = j0; j <= j1; j++) {
      const dz = -EXT + j * cell - z;
      for (let i = i0; i <= i1; i++) {
        const dx = -EXT + i * cell - x, d2 = (dx * dx + dz * dz) * ir2;
        if (d2 >= 1) continue;
        let top = cy + ry * Math.sqrt(1 - d2);
        if (top > HCEIL) top = HCEIL;
        const k = j * G + i;
        if (top > hm[k] - 0.03) own[k] = sid;
        if (top > hm[k]) { hm[k] = top; if (top > f.max) f.max = top; }
        if (cream && !cov[k] && top > 0.02) { cov[k] = 1; if (disc[k]) f.covN++; }
      }
    }
  };

  // Flat-topped disc (fruit).
  f.stampFlat = (x, z, r, top) => {
    if (!(r > 0) || !(x + z + r + top < 1e6) || !(x + z + r + top > -1e6)) return;
    if (top > HMAX + 0.3) top = HMAX + 0.3;
    const i0 = Math.max(0, Math.ceil((x - r + EXT) * inv)), i1 = Math.min(G - 1, Math.floor((x + r + EXT) * inv));
    const j0 = Math.max(0, Math.ceil((z - r + EXT) * inv)), j1 = Math.min(G - 1, Math.floor((z + r + EXT) * inv));
    for (let j = j0; j <= j1; j++) {
      const dz = -EXT + j * cell - z;
      for (let i = i0; i <= i1; i++) {
        const dx = -EXT + i * cell - x, d2 = (dx * dx + dz * dz) / (r * r);
        if (d2 >= 1) continue;
        const t = top * (d2 < 0.5 ? 1 : 1 - 0.5 * (d2 - 0.5)), k = j * G + i;
        if (t > hm[k]) { hm[k] = t; if (t > f.max) f.max = t; }
      }
    }
  };

  f.snapshot = () => { hm0.set(hm); f.max0 = f.max; };

  f.clear = () => { hm.fill(0); hm0.fill(0); cov.fill(0); own.fill(0); f.max = 0; f.max0 = 0; f.covN = 0; };

  f.coverage = () => f.covN / discN;

  f.owner = (x, z) => {
    const i = Math.round((x + EXT) * inv), j = Math.round((z + EXT) * inv);
    if (i < 0 || j < 0 || i >= G || j >= G) return 0;
    return own[j * G + i];
  };

  // Can a point be seen from the camera side? It is hidden if, in every direction around it, something
  // rises above a ray that climbs with `slope` (steeper than any view of the cake).
  const SEE = [0.05, 0.1, 0.17, 0.26, 0.38];
  f.hidden = (x, y, z, slope) => {
    for (let a = 0; a < 8; a++) {
      const cx = Math.cos(a * 0.7853981), sz = Math.sin(a * 0.7853981);
      let blocked = false;
      for (let k = 0; k < SEE.length; k++) {
        const s = SEE[k];
        if (sample(hm, x + cx * s, z + sz * s) > y + slope * s + 0.015) { blocked = true; break; }
      }
      if (!blocked) return false;
    }
    return true;
  };

  f.covered = (x, z) => {
    const i = Math.round((x + EXT) * inv), j = Math.round((z + EXT) * inv);
    if (i < 0 || j < 0 || i >= G || j >= G) return 0;
    return cov[j * G + i];
  };

  // Ray (local, unit direction, pointing down) against field `a` over the disc r ≤ R+0.05.
  // Marches from the highest cream down to the cake top, then bisects. Returns t or −1.
  f.raycast = (a, top, ox, oy, oz, dx, dy, dz) => {
    if (!(dy < -1e-4)) return -1;
    let t1 = -oy / dy;
    if (!(t1 > 0)) return -1;
    let t0 = (top + 0.01 - oy) / dy;
    if (!(t0 > 0)) t0 = 0;
    const A = dx * dx + dz * dz, C = ox * ox + oz * oz - RH2;
    if (A > 1e-9) {
      const B = ox * dx + oz * dz, D = B * B - A * C;
      if (!(D > 0)) return -1;
      const sq = Math.sqrt(D), ta = (-B - sq) / A, tb = (-B + sq) / A;
      if (ta > t0) t0 = ta;
      if (tb < t1) t1 = tb;
    } else if (C > 0) return -1;
    if (!(t1 >= t0)) return -1;
    if (oy + dy * t0 <= sample(a, ox + dx * t0, oz + dz * t0) + 1e-5) return t0;
    let n = Math.ceil((t1 - t0) / (cell * 0.8));
    if (n < 2) n = 2; else if (n > 120) n = 120;
    let prev = t0;
    for (let s = 1; s <= n; s++) {
      const t = t0 + ((t1 - t0) * s) / n;
      if (oy + dy * t <= sample(a, ox + dx * t, oz + dz * t) + 1e-5) {
        let lo = prev, hi = t;
        for (let k = 0; k < 8; k++) {
          const m = (lo + hi) * 0.5;
          if (oy + dy * m <= sample(a, ox + dx * m, oz + dz * m)) hi = m; else lo = m;
        }
        return hi;
      }
      prev = t;
    }
    return -1;
  };

  return f;
}
