// 2D signed-distance shapes used both in GLSL (holes) and JS (cutters, plugs). Units: metres.
export const SHAPE = { CIRCLE: 0, STAR: 1, HEART: 2, SMILE: 3, BIG: 4 };

export const GLSL_SHAPES = /* glsl */`
float pk_dot2(vec2 v){ return dot(v,v); }
float pk_star5(vec2 p, float r, float rf){
  const vec2 k1 = vec2(0.809016994375, -0.587785252292);
  const vec2 k2 = vec2(-k1.x, k1.y);
  p.x = abs(p.x);
  p -= 2.0 * max(dot(k1, p), 0.0) * k1;
  p -= 2.0 * max(dot(k2, p), 0.0) * k2;
  p.x = abs(p.x);
  p.y -= r;
  vec2 ba = rf * vec2(-k1.y, k1.x) - vec2(0.0, 1.0);
  float h = clamp(dot(p, ba) / dot(ba, ba), 0.0, r);
  return length(p - ba * h) * sign(p.y * ba.x - p.x * ba.y);
}
float pk_heart(vec2 p){
  p.x = abs(p.x);
  if (p.y + p.x > 1.0) return sqrt(pk_dot2(p - vec2(0.25, 0.75))) - sqrt(2.0) / 4.0;
  return sqrt(min(pk_dot2(p - vec2(0.0, 1.0)), pk_dot2(p - 0.5 * max(p.x + p.y, 0.0)))) * sign(p.x - p.y);
}
float pk_shape(vec2 q, float t, float s){
  if (t < 0.5) return length(q) - s;
  if (t < 1.5) return pk_star5(q, s * 1.25, 0.42) - s * 0.06;
  if (t < 2.5) { float k = s * 1.9; return pk_heart(q / k + vec2(0.0, 0.52)) * k; }
  if (t < 3.5) { float a = length(q - vec2(0.0, s * 0.30)) - s; float b = length(q - vec2(0.0, s * 0.92)) - s * 1.12; return max(a, -b); }
  return length(q) - s;
}
`;

function star5(px, py, r, rf) {
  const k1x = 0.809016994375, k1y = -0.587785252292, k2x = -k1x, k2y = k1y;
  px = Math.abs(px);
  let d = Math.max(k1x * px + k1y * py, 0); px -= 2 * d * k1x; py -= 2 * d * k1y;
  d = Math.max(k2x * px + k2y * py, 0); px -= 2 * d * k2x; py -= 2 * d * k2y;
  px = Math.abs(px); py -= r;
  const bax = rf * (-k1y) - 0, bay = rf * k1x - 1;
  const h = Math.min(Math.max((px * bax + py * bay) / (bax * bax + bay * bay), 0), r);
  const dx = px - bax * h, dy = py - bay * h;
  return Math.hypot(dx, dy) * Math.sign(py * bax - px * bay);
}
function heart(px, py) {
  px = Math.abs(px);
  if (py + px > 1) return Math.hypot(px - 0.25, py - 0.75) - Math.SQRT2 / 4;
  const m = 0.5 * Math.max(px + py, 0);
  return Math.sqrt(Math.min(px * px + (py - 1) ** 2, (px - m) ** 2 + (py - m) ** 2)) * Math.sign(px - py);
}
export function shapeSD(x, y, t, s) {
  if (t === 0 || t === 4) return Math.hypot(x, y) - s;
  if (t === 1) return star5(x, y, s * 1.25, 0.42) - s * 0.06;
  if (t === 2) { const k = s * 1.9; return heart(x / k, y / k + 0.52) * k; }
  const a = Math.hypot(x, y - s * 0.30) - s, b = Math.hypot(x, y - s * 0.92) - s * 1.12;
  return Math.max(a, -b);
}

// Trace the zero contour as an ordered, counter-clockwise polygon.
export function outline(t, s, step) {
  step = step || s * 0.06;
  const f = (x, y) => shapeSD(x, y, t, s);
  const grad = (x, y) => { const e = s * 1e-3; return [(f(x + e, y) - f(x - e, y)) / (2 * e), (f(x, y + e) - f(x, y - e)) / (2 * e)]; };
  // start: walk down from a point inside
  let x = 0, y = t === 3 ? -s * 0.4 : 0;
  if (f(x, y) > 0) { x = 0; y = -s * 0.5; }
  // find boundary along -y
  let lo = y, hi = y - s * 3;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (f(x, m) < 0) lo = m; else hi = m; }
  y = (lo + hi) / 2;
  const pts = [[x, y]]; const sx = x, sy = y;
  for (let i = 0; i < 2000; i++) {
    let [gx, gy] = grad(x, y); const gl = Math.hypot(gx, gy) || 1; gx /= gl; gy /= gl;
    // tangent (CCW around the inside)
    x += -gy * step; y += gx * step;
    for (let k = 0; k < 4; k++) { const v = f(x, y); const [hx, hy] = grad(x, y); const hl = hx * hx + hy * hy || 1; x -= v * hx / hl; y -= v * hy / hl; }
    if (i > 8 && Math.hypot(x - sx, y - sy) < step * 0.9) break;
    pts.push([x, y]);
  }
  return pts;
}
