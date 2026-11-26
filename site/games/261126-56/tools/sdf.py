# SDF toolkit (numpy, vectorized over points P:(N,3))
import numpy as np

def length(v):
    return np.sqrt((v * v).sum(-1))

def smin(a, b, k):
    if k <= 0:
        return np.minimum(a, b)
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
    return b * (1 - h) + a * h - k * h * (1 - h)

def smax(a, b, k):
    return -smin(-a, -b, k)

def rot_axes(fwd_y, side_hint):
    """Return 3x3 matrix whose columns are local x,y,z axes. local y = fwd_y."""
    y = np.asarray(fwd_y, float); y /= np.linalg.norm(y)
    x = np.asarray(side_hint, float); x = x - y * np.dot(x, y); x /= np.linalg.norm(x)
    z = np.cross(x, y)
    return np.stack([x, y, z], 1)

def sphere(c, r):
    c = np.asarray(c, float)
    return lambda P: length(P - c) - r

def ellipsoid(c, r, R=None):
    c = np.asarray(c, float); r = np.asarray(r, float)
    def f(P):
        q = P - c
        if R is not None:
            q = q @ R
        k0 = length(q / r)
        k1 = length(q / (r * r))
        return k0 * (k0 - 1.0) / np.maximum(k1, 1e-9)
    return f

def cone(a, b, ra, rb):
    """capsule with linearly varying radius"""
    a = np.asarray(a, float); b = np.asarray(b, float)
    ba = b - a; L2 = np.dot(ba, ba)
    def f(P):
        pa = P - a
        h = np.clip((pa @ ba) / L2, 0, 1)
        return length(pa - ba[None, :] * h[:, None]) - (ra + (rb - ra) * h)
    return f

def rbox(c, half, R=None, rr=0.0):
    c = np.asarray(c, float); half = np.asarray(half, float)
    def f(P):
        q = P - c
        if R is not None:
            q = q @ R
        d = np.abs(q) - (half - rr)
        return length(np.maximum(d, 0)) + np.minimum(np.max(d, -1), 0) - rr
    return f

def torus(c, R_, r, axes):
    """axes: 3x3, torus lies in local xz plane, around local y"""
    c = np.asarray(c, float)
    def f(P):
        q = (P - c) @ axes
        qx = np.sqrt(q[:, 0] ** 2 + q[:, 2] ** 2) - R_
        return np.sqrt(qx ** 2 + q[:, 1] ** 2) - r
    return f

def halfspace(n, p0):
    """negative on side opposite to n (solid where dot(P-p0,n) < 0)"""
    n = np.asarray(n, float); n = n / np.linalg.norm(n); p0 = np.asarray(p0, float)
    return lambda P: (P - p0) @ n

def catmull(table, n=8):
    """densify a table of rows (y, ...) with catmull-rom"""
    t = np.asarray(table, float)
    out = []
    for i in range(len(t) - 1):
        p0 = t[max(i - 1, 0)]; p1 = t[i]; p2 = t[i + 1]; p3 = t[min(i + 2, len(t) - 1)]
        for s in np.linspace(0, 1, n, endpoint=False):
            s2 = s * s; s3 = s2 * s
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * s + (2 * p0 - 5 * p1 + 4 * p2 - p3) * s2 + (-p0 + 3 * p1 - 3 * p2 + p3) * s3))
    out.append(t[-1])
    return np.array(out)

def loft(table, y0, y1, kcap=0.02):
    """table rows: y, a(halfwidth x), b(halfdepth z), zc, xc(optional 0)"""
    t = catmull(table, 10)
    ys = t[:, 0]
    def f(P):
        y = P[:, 1]
        a = np.interp(y, ys, t[:, 1]); b = np.interp(y, ys, t[:, 2]); zc = np.interp(y, ys, t[:, 3])
        x = P[:, 0]; z = P[:, 2] - zc
        q = np.sqrt((x / a) ** 2 + (z / b) ** 2)
        d = (q - 1.0) * np.minimum(a, b)
        cap = np.maximum(y0 - y, y - y1)
        return smax(d, cap, kcap)
    return f

# ---------------- noise ----------------
_rng = np.random.RandomState(7)
_perm = _rng.randint(0, 1 << 30, size=4096).astype(np.int64)
_vals = _rng.rand(4096).astype(np.float64) * 2 - 1

def _h(ix, iy, iz, seed):
    h = (ix * 73856093) ^ (iy * 19349663) ^ (iz * 83492791) ^ (seed * 2654435761)
    return _vals[(h ^ (h >> 13)) & 4095]

def vnoise(P, freq=1.0, seed=0):
    p = P * freq
    i = np.floor(p).astype(np.int64)
    f = p - i
    u = f * f * (3 - 2 * f)
    ix, iy, iz = i[:, 0], i[:, 1], i[:, 2]
    res = 0
    for dx in (0, 1):
        wx = u[:, 0] if dx else 1 - u[:, 0]
        for dy in (0, 1):
            wy = u[:, 1] if dy else 1 - u[:, 1]
            for dz in (0, 1):
                wz = u[:, 2] if dz else 1 - u[:, 2]
                res = res + wx * wy * wz * _h(ix + dx, iy + dy, iz + dz, seed)
    return res

def fbm(P, freq=1.0, octaves=3, seed=0):
    s = 0; a = 1; tot = 0
    for o in range(octaves):
        s = s + a * vnoise(P, freq * (2 ** o), seed + o * 17)
        tot += a; a *= 0.5
    return s / tot


class Shape:
    """Accumulates primitives with smooth union/subtraction and region labels."""
    def __init__(self):
        self.ops = []

    def add(self, f, k=0.0, region=None):
        self.ops.append(('add', f, k, region)); return self

    def sub(self, f, k=0.0):
        self.ops.append(('sub', f, k, None)); return self

    def inter(self, f, k=0.0):
        self.ops.append(('int', f, k, None)); return self

    def mod(self, fn):
        """fn(P, D) -> D"""
        self.ops.append(('mod', fn, 0, None)); return self

    def eval(self, P, labels=False):
        D = None; best = None; lab = None
        for op, f, k, reg in self.ops:
            if op == 'mod':
                D = f(P, D); continue
            d = f(P)
            if op == 'add':
                if D is None:
                    D = d
                    best = d.copy(); lab = np.full(len(P), -1 if reg is None else reg, np.int32)
                else:
                    D = smin(D, d, k)
                    if reg is not None:
                        m = d < best
                        best = np.where(m, d, best); lab = np.where(m, reg, lab)
            elif op == 'sub':
                D = smax(D, -d, k)
            elif op == 'int':
                D = smax(D, d, k)
        if labels:
            return D, lab
        return D

    def __call__(self, P):
        return self.eval(P)


def union_fn(*fs, k=0.0):
    def f(P):
        D = fs[0](P)
        for g in fs[1:]:
            D = smin(D, g(P), k)
        return D
    return f
