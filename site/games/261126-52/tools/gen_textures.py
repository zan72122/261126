#!/usr/bin/env python3
"""Procedural photo-like PBR textures for 261126-52 (snow airplane).
Run: python3 tools/gen_textures.py  (writes into ../tex)
No text, people or logos.  All tiling maps are FFT-periodic.
ORM packing follows three.js: R=AO, G=roughness, B=metalness.
"""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), '..', 'tex')
os.makedirs(OUT, exist_ok=True)
RNG = np.random.default_rng(52)

def save(name, arr, q=90):
    arr = np.clip(arr, 0, 1)
    if arr.ndim == 2:
        arr = np.stack([arr] * 3, -1)
    img = Image.fromarray((arr * 255 + 0.5).astype(np.uint8))
    p = os.path.join(OUT, name)
    if name.endswith('.png'):
        img.save(p, optimize=True)
    else:
        img.save(p, quality=min(q, 84) if 'nrm' in name else q, subsampling=2)
    print('wrote', name, img.size)

def fnoise(h, w, beta=2.0, sx=1.0, sy=1.0, seed=None, lo=0.0, hi=1e9):
    """periodic 1/f^beta noise, anisotropic scale sx, sy, normalised 0..1"""
    r = np.random.default_rng(seed) if seed is not None else RNG
    fy = np.fft.fftfreq(h)[:, None] * h / sy
    fx = np.fft.fftfreq(w)[None, :] * w / sx
    f = np.sqrt(fx * fx + fy * fy)
    f[0, 0] = 1
    amp = 1.0 / f ** (beta / 2)
    amp[(f < lo) | (f > hi)] = 0
    amp[0, 0] = 0
    ph = r.standard_normal((h, w)) + 1j * r.standard_normal((h, w))
    n = np.real(np.fft.ifft2(amp * ph))
    n -= n.min(); n /= (n.max() + 1e-9)
    return n

def blur(a, r, wrap=True):
    """periodic gaussian blur via fft"""
    h, w = a.shape[:2]
    fy = np.fft.fftfreq(h)[:, None]
    fx = np.fft.fftfreq(w)[None, :]
    g = np.exp(-2 * (math.pi ** 2) * (r ** 2) * (fx * fx + fy * fy))
    if a.ndim == 2:
        return np.real(np.fft.ifft2(np.fft.fft2(a) * g))
    return np.stack([np.real(np.fft.ifft2(np.fft.fft2(a[..., i]) * g)) for i in range(a.shape[2])], -1)

def normal_from_height(hgt, strength, wrapx=True, wrapy=True):
    if wrapx:
        dx = (np.roll(hgt, -1, 1) - np.roll(hgt, 1, 1)) * 0.5
    else:
        dx = np.gradient(hgt, axis=1)
    if wrapy:
        dy = (np.roll(hgt, -1, 0) - np.roll(hgt, 1, 0)) * 0.5
    else:
        dy = np.gradient(hgt, axis=0)
    nx = -dx * strength; ny = dy * strength  # image y is down; GL normal map y up
    nz = np.ones_like(hgt)
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    return np.stack([nx / l * 0.5 + 0.5, ny / l * 0.5 + 0.5, nz / l * 0.5 + 0.5], -1)

def cavity(hgt, r=3):
    c = hgt - blur(hgt, r)
    c = c / (np.abs(c).max() + 1e-9)
    return c

def orm(ao, rough, metal):
    return np.stack([ao, rough, metal if np.ndim(metal) else np.full_like(ao, metal)], -1)

def dots(h, w, n, rmin, rmax, seed, soft=True):
    r = np.random.default_rng(seed)
    img = np.zeros((h, w))
    yy, xx = np.mgrid[0:h, 0:w]
    for _ in range(n):
        cx, cy = r.uniform(0, w), r.uniform(0, h)
        rad = r.uniform(rmin, rmax)
        x0, x1 = int(cx - rad - 2), int(cx + rad + 3)
        y0, y1 = int(cy - rad - 2), int(cy + rad + 3)
        xs = np.arange(x0, x1) ; ys = np.arange(y0, y1)
        X, Y = np.meshgrid(xs, ys)
        d = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2) / rad
        v = np.clip(1 - d, 0, 1) if soft else (d < 1).astype(float)
        img[np.ix_(ys % h, xs % w)] = np.maximum(img[np.ix_(ys % h, xs % w)], v)
    return img

# ---------------------------------------------------------------- snow
def gen_snow():
    S = 1024
    big = fnoise(S, S, 3.2, seed=1)
    mid = fnoise(S, S, 2.2, seed=2)
    grain = blur(RNG.random((S, S)), 0.7)
    grain = (grain - grain.min()) / (grain.max() - grain.min())
    # wind ripples (sastrugi) - elongated
    rip = fnoise(S, S, 2.6, sx=6.0, sy=1.0, seed=3)
    hgt = big * 0.55 + mid * 0.2 + rip * 0.15 + grain * 0.10
    crystals = dots(S, S, 2600, 0.6, 1.6, 4)
    hgt += crystals * 0.05
    nrm = normal_from_height(hgt, 60)
    cav = cavity(hgt, 4)
    ao = np.clip(0.82 + cav * 0.25 + big * 0.1, 0.55, 1)
    base = 0.90 + grain * 0.06 + crystals * 0.04
    tint = np.stack([base * (0.955 + 0.02 * big), base * (0.975 + 0.01 * big), base * 1.0], -1)
    # very faint blue in hollows
    tint[..., 0] -= np.clip(-cav, 0, 1) * 0.06
    tint[..., 1] -= np.clip(-cav, 0, 1) * 0.03
    rough = np.clip(0.78 - crystals * 0.55 + (grain - 0.5) * 0.1, 0.12, 1)
    save('snow_c.jpg', tint, 88)
    save('snow_nrm.jpg', nrm, 92)
    save('snow_orm.jpg', orm(ao, rough, 0.0), 88)

# ---------------------------------------------------------------- ice
def gen_ice():
    S = 512
    W = Image.new('L', (S * 3, S * 3), 0)
    d = ImageDraw.Draw(W)
    r = np.random.default_rng(11)
    def branch(x, y, ang, ln, wdt, depth):
        if depth == 0 or ln < 3: return
        x2 = x + math.cos(ang) * ln; y2 = y + math.sin(ang) * ln
        d.line([(x, y), (x2, y2)], fill=int(120 + 100 * r.random()), width=max(1, int(wdt)))
        n = r.integers(2, 4)
        for i in range(n):
            t = r.uniform(0.3, 1.0)
            bx = x + (x2 - x) * t; by = y + (y2 - y) * t
            branch(bx, by, ang + r.choice([-1, 1]) * r.uniform(0.6, 1.1), ln * r.uniform(0.35, 0.6), wdt * 0.7, depth - 1)
    for _ in range(140):
        x, y = r.uniform(S, 2 * S), r.uniform(S, 2 * S)
        a0 = r.uniform(0, math.tau)
        for k in range(r.integers(3, 7)):
            branch(x, y, a0 + k * math.tau / 6 + r.uniform(-.2, .2), r.uniform(15, 55), 2.2, 4)
    big = np.asarray(W, dtype=float) / 255
    frost = np.zeros((S, S))
    for oy in range(3):
        for ox in range(3):
            frost = np.maximum(frost, big[oy * S:(oy + 1) * S, ox * S:(ox + 1) * S])
    frost = np.clip(blur(frost, 0.8) * 1.3 + fnoise(S, S, 1.2, seed=12) * 0.35, 0, 1)
    bub = dots(S, S, 900, 0.8, 3.5, 13)
    ring = np.clip(bub * (1 - bub) * 4, 0, 1)
    # cracks: voronoi edges
    pts = r.uniform(0, S, (60, 2))
    yy, xx = np.mgrid[0:S, 0:S]
    d1 = np.full((S, S), 1e9); d2 = np.full((S, S), 1e9)
    for px, py in pts:
        for ox in (-S, 0, S):
            for oy in (-S, 0, S):
                dd = np.sqrt((xx - px - ox) ** 2 + (yy - py - oy) ** 2)
                m = dd < d1
                d2 = np.where(m, d1, np.minimum(d2, dd)); d1 = np.where(m, dd, d1)
    crack = np.clip(1 - (d2 - d1) / 2.5, 0, 1) * (fnoise(S, S, 1.5, seed=14) > 0.45)
    save('ice_mask.jpg', np.stack([frost, np.clip(bub * .6 + ring, 0, 1), crack], -1), 90)
    hgt = fnoise(S, S, 2.8, seed=15) * 0.7 + fnoise(S, S, 2.0, seed=16) * 0.2 - crack * 0.15 + bub * 0.03 + frost * 0.08
    save('ice_nrm.jpg', normal_from_height(hgt, 30), 92)

# ---------------------------------------------------------------- ground (apron concrete)
def gen_ground():
    S = 1024
    agg = dots(S, S, 9000, 0.6, 2.2, 21)
    n1 = fnoise(S, S, 2.4, seed=22); n2 = fnoise(S, S, 1.4, seed=23)
    hgt = agg * 0.4 + n2 * 0.3 + n1 * 0.3
    # expansion joint lines
    joint = np.zeros((S, S)); joint[:, 0:3] = 1; joint[0:3, :] = 1
    joint = blur(joint, 0.8)
    hgt -= joint * 0.8
    col = 0.30 + n1 * 0.10 + agg * 0.08 - joint * 0.15
    stains = fnoise(S, S, 3.0, seed=24)
    col *= 0.85 + stains * 0.25
    c = np.stack([col * 0.98, col * 0.99, col * 1.02], -1)
    save('ground_c.jpg', c, 86)
    save('ground_nrm.jpg', normal_from_height(hgt, 25), 90)
    ao = np.clip(0.85 + cavity(hgt, 3) * 0.3 - joint * 0.4, 0.3, 1)
    save('ground_orm.jpg', orm(ao, np.clip(0.75 + (n2 - .5) * 0.2, 0, 1), 0.0), 86)

# ---------------------------------------------------------------- fuselage layout (must match js/plane.js)
L = 15.0
def fus_r(x):
    R = 1.0
    if x > 12.6:
        t = min(1, (x - 12.6) / 2.4); return R * max(0.0, 1 - t ** 2.3) ** 0.5
    if x < 4.5:
        t = x / 4.5; s = t * t * (3 - 2 * t); return R * (0.16 + 0.84 * s ** 0.8)
    return R

def gen_fuselage():
    W, H = 2048, 1024
    X = (np.arange(W) + 0.5) / W * L
    TH = (np.arange(H) + 0.5) / H * math.tau  # v down = theta (flipY handled in js: v = 1 - row/H)
    XX, TT = np.meshgrid(X, TH)
    Y = np.cos(TT)          # up component
    Z = np.sin(TT)          # +z = starboard
    hgt = np.zeros((H, W)); groove = np.zeros((H, W))
    pxm = W / L; pxr = H / math.tau
    # ring joints
    for jx in [0.9, 2.0, 3.1, 4.3, 5.75, 7.2, 8.65, 10.1, 11.3, 12.55, 13.7]:
        groove = np.maximum(groove, np.clip(1 - np.abs(XX - jx) * pxm / 1.1, 0, 1))
    for jt in [0.0, 0.55, -0.55, math.pi / 2 + 0.62, math.pi / 2 - 0.75, 3 * math.pi / 2 + 0.75, 3 * math.pi / 2 - 0.62, math.pi]:
        dtt = np.abs(((TT - jt + math.pi) % math.tau) - math.pi)
        groove = np.maximum(groove, np.clip(1 - dtt * pxr / 1.1, 0, 1) * ((XX > 0.6) & (XX < 13.8)))
    # rivets along joints
    riv = np.zeros((H, W))
    rr = np.random.default_rng(31)
    for jx in [0.9, 2.0, 3.1, 4.3, 5.75, 7.2, 8.65, 10.1, 11.3, 12.55, 13.7]:
        for side in (-1, 1):
            cx = (jx + side * 0.025) * pxm
            ys = np.arange(2, H, 5.0)
            for cy in ys:
                x0 = int(cx); y0 = int(cy)
                riv[y0 % H, x0 % W] = 1
    for jt in [0.55, -0.55, math.pi / 2 + 0.62, math.pi / 2 - 0.75, 3 * math.pi / 2 + 0.75, 3 * math.pi / 2 - 0.62]:
        cy = (jt % math.tau) * pxr + 3
        for cx in np.arange(0.7 * pxm, 13.7 * pxm, 5.5):
            riv[int(cy) % H, int(cx)] = 1
    riv = blur(riv, 0.7); riv /= riv.max()
    # windows
    winmask = np.zeros((H, W)); frame = np.zeros((H, W)); wid = np.zeros((H, W))
    def rrect(cx, ct, hw, hh, rad):
        dx = np.abs(XX - cx) - (hw - rad)
        dt = np.abs(((TT - ct + math.pi) % math.tau) - math.pi) * fus_r(cx) - (hh - rad)
        q = np.sqrt(np.maximum(dx, 0) ** 2 + np.maximum(dt, 0) ** 2) + np.minimum(np.maximum(dx, dt), 0) - rad
        return q
    idx = 1
    port_t = 3 * math.pi / 2 + 0.15; star_t = math.pi / 2 - 0.15
    wins = []
    for i in range(9):
        x = 5.2 + 0.72 * i
        wins.append((x, port_t)); wins.append((x, star_t))
    wins.append((11.75, star_t))
    for (x, t) in wins:
        q = rrect(x, t, 0.135, 0.18, 0.09)
        glass = np.clip(0.5 - q * pxm, 0, 1)
        fr = np.clip(0.5 - (q - 0.03) * pxm, 0, 1) - glass
        winmask = np.maximum(winmask, glass); frame = np.maximum(frame, fr)
        wid = np.where(glass > 0.5, idx, wid); idx += 1
    # cockpit windscreen panes (id 30)
    cockpit = np.zeros((H, W))
    for (t0, t1, x0, x1) in [(-0.95, -0.48, 13.12, 13.62), (-0.42, -0.03, 13.18, 13.72), (0.03, 0.42, 13.18, 13.72), (0.48, 0.95, 13.12, 13.62),
                             (-1.42, -1.02, 12.82, 13.28), (1.02, 1.42, 12.82, 13.28)]:
        tc = (t0 + t1) / 2; xc = (x0 + x1) / 2
        q = rrect(xc, tc, (x1 - x0) / 2, (t1 - t0) / 2 * 0.8, 0.05)
        glass = np.clip(0.5 - q * pxm, 0, 1)
        fr = np.clip(0.5 - (q - 0.025) * pxm, 0, 1) - glass
        cockpit = np.maximum(cockpit, glass); frame = np.maximum(frame, fr)
    wid = np.where(cockpit > 0.5, 30, wid)
    # door (port, front) outline groove + handle
    qd = rrect(11.75, 3 * math.pi / 2 - 0.02, 0.37, 0.78, 0.12)
    door = np.clip(1 - np.abs(qd) * pxm / 1.0, 0, 1)
    groove = np.maximum(groove, door)
    qh = rrect(11.98, 3 * math.pi / 2 - 0.05, 0.06, 0.025, 0.02)
    handle = np.clip(0.5 - qh * pxm, 0, 1)
    # cargo / service hatches
    for (x, t, hw, hh) in [(3.2, 3 * math.pi / 2 - 0.5, 0.35, 0.3), (13.0, math.pi - 0.2, 0.25, 0.2), (8.0, math.pi, 0.5, 0.25)]:
        q = rrect(x, t, hw, hh, 0.05)
        groove = np.maximum(groove, np.clip(1 - np.abs(q) * pxm / 1.0, 0, 1))
    # paint
    n_large = fnoise(H, W, 3.0, seed=32)
    streak = fnoise(H, W, 2.2, sx=1.0, sy=8.0, seed=33)  # elongated along x (columns = x)
    streak = fnoise(H, W, 2.4, sx=14.0, sy=1.0, seed=33)
    base = 0.87 + (n_large - 0.5) * 0.03
    col = np.stack([base, base * 1.003, base * 1.008], -1)
    # cheatline below windows (slate blue) and thin pin line
    yrel = Y * 1.05
    nose_fade = np.clip((13.3 - XX) / 0.6, 0, 1) * np.clip((XX - 1.2) / 0.8, 0, 1)
    band = ((yrel < -0.06) & (yrel > -0.20)).astype(float) * nose_fade
    pin = ((yrel < -0.235) & (yrel > -0.255)).astype(float) * nose_fade
    band = blur(band, 0.6, True); pin = blur(pin, 0.5, True)
    slate = np.array([0.16, 0.24, 0.34]); rust = np.array([0.55, 0.25, 0.18])
    col = col * (1 - band[..., None]) + slate * band[..., None]
    col = col * (1 - pin[..., None]) + rust * pin[..., None]
    belly = np.clip((-yrel - 0.72) / 0.08, 0, 1)
    col = col * (1 - belly[..., None] * 0.12)
    # grime: streaks aft of door / windows, belly
    grime = np.clip((streak - 0.55) * 2.2, 0, 1) * (0.3 + belly * 0.7)
    col *= (1 - grime[..., None] * np.array([0.10, 0.11, 0.12]))
    col = col * (1 - groove[..., None] * 0.35) * (1 - riv[..., None] * 0.04)
    glassc = np.array([0.035, 0.045, 0.06]); framec = np.array([0.10, 0.10, 0.11])
    g = np.maximum(winmask, cockpit)[..., None]
    col = col * (1 - g) + glassc * g
    col = col * (1 - frame[..., None]) + framec * frame[..., None]
    col = col * (1 - handle[..., None] * 0.6)
    # height
    hgt = -groove * 0.6 + riv * 0.35 + n_large * 0.15 + (fnoise(H, W, 1.0, seed=34)) * 0.03
    hgt += -frame * 0.6 - g[..., 0] * 1.0 - handle * 0.5
    nrm = normal_from_height(hgt, 5, wrapx=False, wrapy=True)
    ao = np.clip(1 - groove * 0.35 - frame * 0.5 - handle * 0.4, 0, 1) * (1 - belly * 0.08)
    rough = np.clip(0.30 + (n_large - 0.5) * 0.08 + grime * 0.25 + groove * 0.2, 0, 1)
    rough = rough * (1 - g[..., 0]) + 0.04 * g[..., 0]
    rough = rough * (1 - frame) + 0.6 * frame
    # flip rows so row 0 = v 1  (three flipY)  -> theta increases downward in image already means v = 1 - theta/2pi.
    save('fus_c.jpg', col, 88)
    save('fus_nrm.jpg', nrm, 90)
    save('fus_orm.jpg', orm(ao, rough, 0.0), 88)
    idimg = np.stack([wid / 40.0, np.maximum(winmask, cockpit), frame], -1)
    Image.fromarray((np.clip(idimg, 0, 1) * 255).astype(np.uint8)).resize((1024, 512), Image.NEAREST).save(os.path.join(OUT, 'fus_id.png'), optimize=True)
    print('wrote fus_id.png')

# ---------------------------------------------------------------- wing (u span, v around chord: 0 TE bottom -> .5 LE -> 1 TE top)
def gen_wing():
    W, H = 1024, 512
    U = (np.arange(W) + .5) / W; V = (np.arange(H) + .5) / H
    UU, VV = np.meshgrid(U, V)
    VVi = 1 - VV  # image row 0 = v 1 (top TE)
    groove = np.zeros((H, W))
    for su in [0.08, 0.3, 0.55, 0.78, 0.97]:
        groove = np.maximum(groove, np.clip(1 - np.abs(UU - su) * W / 1.1, 0, 1))
    for sv in [0.62, 0.72, 0.85, 0.38, 0.25, 0.12]:
        groove = np.maximum(groove, np.clip(1 - np.abs(VVi - sv) * H / 1.1, 0, 1))
    # flap & aileron lines (top)
    flap = (np.abs(VVi - 0.9) * H < 1.2) & (UU > 0.04) & (UU < 0.6)
    ail = (np.abs(VVi - 0.92) * H < 1.2) & (UU > 0.62) & (UU < 0.95)
    groove = np.maximum(groove, (flap | ail).astype(float))
    groove = np.maximum(groove, ((np.abs(UU - 0.61) * W < 1.2) & (VVi > 0.9)).astype(float))
    riv = np.zeros((H, W))
    for su in [0.08, 0.3, 0.55, 0.78]:
        for cy in range(1, H, 5):
            riv[cy, int((su + 0.006) * W) % W] = 1
    for sv in [0.62, 0.72, 0.85]:
        for cx in range(1, W, 5):
            riv[int((1 - sv) * H + 2) % H, cx] = 1
    riv = blur(riv, 0.7); riv /= riv.max()
    boot = np.clip(1 - (np.abs(VVi - 0.5) - 0.05) * H / 2, 0, 1)
    bootr = boot * (0.5 + 0.5 * np.sin(VVi * H * 0.9))
    walk = ((UU < 0.07) & (VVi > 0.58) & (VVi < 0.86)).astype(float)
    n_large = fnoise(H, W, 3.0, seed=41)
    grit = RNG.random((H, W))
    base = 0.86 + (n_large - .5) * 0.04
    col = np.stack([base, base * 1.003, base * 1.01], -1)
    col *= (1 - groove[..., None] * 0.35)
    bc = np.array([0.05, 0.05, 0.055]); wc = np.array([0.18, 0.18, 0.19]) * (0.8 + grit[..., None] * 0.4)
    col = col * (1 - boot[..., None]) + bc * boot[..., None]
    col = col * (1 - walk[..., None]) + wc * walk[..., None]
    streak = fnoise(H, W, 2.4, sx=1.0, sy=12.0, seed=42)
    grime = np.clip((streak - .55) * 2, 0, 1) * (VVi < 0.5)
    col *= 1 - grime[..., None] * 0.1
    hgt = -groove * 0.6 + riv * 0.3 + bootr * 0.3 * boot + walk * grit * 0.4 + n_large * 0.1
    save('wing_c.jpg', col, 88)
    save('wing_nrm.jpg', normal_from_height(hgt, 5, wrapx=False), 90)
    rough = np.clip(0.32 + groove * .2 + boot * 0.4 + walk * 0.5 + grime * 0.2, 0, 1)
    save('wing_orm.jpg', orm(np.clip(1 - groove * .35, 0, 1), rough, 0.0), 88)

# ---------------------------------------------------------------- generic paint / metal / rubber
def gen_paint():
    S = 512
    peel = fnoise(S, S, 1.8, seed=51, lo=20)
    scr = Image.new('L', (S, S), 0); d = ImageDraw.Draw(scr)
    r = np.random.default_rng(52)
    for _ in range(90):
        x, y = r.uniform(0, S, 2); a = r.uniform(0, math.tau); l = r.uniform(8, 60)
        d.line([(x, y), (x + math.cos(a) * l, y + math.sin(a) * l)], fill=int(r.uniform(60, 200)), width=1)
    scr = np.asarray(scr, float) / 255
    hgt = peel * 0.4 - scr * 0.3 + fnoise(S, S, 3.0, seed=53) * 0.3
    save('paint_nrm.jpg', normal_from_height(hgt, 4), 90)
    n = fnoise(S, S, 2.5, seed=54)
    save('paint_orm.jpg', orm(np.clip(0.95 - scr * 0.2, 0, 1), np.clip(0.32 + scr * 0.3 + (n - .5) * 0.12, 0, 1), 0.0), 88)
    save('paint_c.jpg', np.stack([0.9 + n * 0.1 - scr * 0.15] * 3, -1), 86)
    # brushed metal
    br = fnoise(S, S, 1.5, sx=40, sy=1, seed=55)
    mh = br * 0.4 - scr * 0.4
    save('metal_nrm.jpg', normal_from_height(mh, 3), 90)
    save('metal_orm.jpg', orm(np.ones((S, S)), np.clip(0.28 + br * 0.15 + scr * 0.25, 0, 1), np.ones((S, S))), 88)
    save('metal_c.jpg', np.stack([0.75 + br * 0.15 - scr * 0.1] * 3, -1), 86)
    # rubber tread (u around tire repeats, v across width)
    yy, xx = np.mgrid[0:S, 0:S] / S
    zig = np.abs(((xx * 16 + np.abs(yy - 0.5) * 3) % 1) - 0.5)
    grooves = ((zig < 0.08) & (np.abs(yy - 0.5) < 0.42)).astype(float) + (np.abs(np.abs(yy - 0.5) - 0.2) < 0.02)
    grooves = np.clip(blur(grooves.astype(float), 1.0), 0, 1)
    th = -grooves + fnoise(S, S, 1.0, seed=56) * 0.15
    save('rubber_nrm.jpg', normal_from_height(th, 8), 90)
    save('rubber_orm.jpg', orm(np.clip(1 - grooves * .6, 0, 1), np.full((S, S), 0.85), 0.0), 86)

# ---------------------------------------------------------------- fabrics
def gen_fabrics():
    S = 512
    yy, xx = np.mgrid[0:S, 0:S].astype(float)
    # ripstop nylon: plain weave p=4px + ripstop grid every 32px
    p = 4.0
    wx = np.sin(xx / p * math.pi) ; wy = np.sin(yy / p * math.pi)
    weave = (wx * np.sign(wy) * 0.5 + 0.5) * 0.5 + 0.25
    grid = (np.minimum(xx % 32, 32 - xx % 32) < 1.2) | (np.minimum(yy % 32, 32 - yy % 32) < 1.2)
    wr = fnoise(S, S, 2.6, seed=61)
    hgt = weave * 0.35 + grid * 0.5 + wr * 1.6
    save('nylon_nrm.jpg', normal_from_height(hgt, 4), 92)
    save('nylon_orm.jpg', orm(np.clip(0.9 + cavity(hgt, 2) * 0.2, 0, 1), np.clip(0.42 + weave * 0.1 + (wr - .5) * .1, 0, 1), 0.0), 88)
    save('nylon_c.jpg', np.stack([0.92 + weave * 0.05 + (wr - 0.5) * 0.08 - grid * 0.03] * 3, -1), 86)
    # knit stockinette: columns 16px, rows 12px of V loops
    cw, rh = 16.0, 12.0
    lx = (xx % cw) / cw - 0.5; ly = (yy % rh) / rh - 0.5
    lob = np.zeros((S, S))
    for s in (-1, 1):
        ex = (lx - s * 0.22) ; ey = ly
        rx = ex * math.cos(s * 0.6) - ey * math.sin(s * 0.6)
        ry = ex * math.sin(s * 0.6) + ey * math.cos(s * 0.6)
        lob = np.maximum(lob, np.clip(1 - (rx / 0.24) ** 2 - (ry / 0.62) ** 2, 0, 1))
    fib = fnoise(S, S, 1.2, seed=62)
    kh = np.sqrt(lob) + fib * 0.15
    save('knit_nrm.jpg', normal_from_height(kh, 6), 92)
    save('knit_orm.jpg', orm(np.clip(0.55 + lob * 0.5, 0, 1), np.full((S, S), 0.92), 0.0), 88)
    save('knit_c.jpg', np.stack([0.75 + lob * 0.25 + (fib - .5) * 0.1] * 3, -1), 86)
    # twill canvas
    tw = np.sin((xx + yy) / 3.0 * math.pi) * 0.5 + 0.5
    th = tw * 0.4 + fnoise(S, S, 1.0, seed=63) * 0.2 + fnoise(S, S, 2.5, seed=64) * 1.2
    save('twill_nrm.jpg', normal_from_height(th, 4), 92)
    save('twill_orm.jpg', orm(np.clip(0.85 + tw * 0.15, 0, 1), np.full((S, S), 0.88), 0.0), 88)
    save('twill_c.jpg', np.stack([0.85 + tw * 0.1 + (fnoise(S, S, 2.0, seed=65) - .5) * 0.12] * 3, -1), 86)
    # fur / fleece
    fu = fnoise(S, S, 0.8, seed=66) * 0.6 + fnoise(S, S, 2.2, seed=67) * 0.4
    save('fur_nrm.jpg', normal_from_height(fu, 14), 92)
    save('fur_c.jpg', np.stack([0.82 + fu * 0.18] * 3, -1), 86)

# ---------------------------------------------------------------- skin, hair, iris
def gen_people():
    S = 512
    pores = dots(S, S, 5000, 0.5, 1.3, 71)
    fine = fnoise(S, S, 1.0, seed=72)
    wr = fnoise(S, S, 2.0, sx=4, sy=1, seed=73)
    hgt = -pores * 0.5 + fine * 0.2 + wr * 0.25
    save('skin_nrm.jpg', normal_from_height(hgt, 3), 92)
    blot = fnoise(S, S, 3.0, seed=74)
    c = np.stack([0.97 + blot * 0.03, 0.93 + blot * 0.05 - pores * 0.04, 0.92 + blot * 0.06 - pores * 0.05], -1)
    save('skin_c.jpg', c, 90)
    # hair strands along image y (texture v)
    st = fnoise(S, S, 1.6, sx=1.0, sy=60.0, seed=75)
    st2 = fnoise(S, S, 2.4, sx=1.0, sy=10.0, seed=76)
    hh = st * 0.7 + st2 * 0.3
    save('hair_nrm.jpg', normal_from_height(hh, 10), 92)
    save('hair_c.jpg', np.stack([0.7 + hh * 0.45] * 3, -1), 88)
    # iris 256
    N = 256
    yy, xx = (np.mgrid[0:N, 0:N] - N / 2 + .5) / (N / 2)
    rr = np.sqrt(xx * xx + yy * yy); aa = np.arctan2(yy, xx)
    fib = (np.sin(aa * 90 + np.sin(aa * 13) * 3) * 0.5 + 0.5) * 0.5 + np.random.default_rng(77).random((N, N)) * 0.2
    base = np.array([0.20, 0.11, 0.06]); inner = np.array([0.42, 0.26, 0.12])
    t = np.clip((rr - 0.3) / 0.6, 0, 1)[..., None]
    col = inner * (1 - t) + base * t
    col = col * (0.75 + fib[..., None] * 0.5)
    limbal = np.clip((rr - 0.82) / 0.12, 0, 1)[..., None]
    col *= 1 - limbal * 0.75
    pupil = np.clip((0.36 - rr) / 0.02, 0, 1)[..., None]
    col = col * (1 - pupil) + 0.01 * pupil
    sclera = np.clip((rr - 0.97) / 0.03, 0, 1)[..., None]
    col = col * (1 - sclera) + np.array([0.93, 0.91, 0.89]) * sclera
    # faint veins in sclera
    save('iris_c.jpg', col, 92)

# ---------------------------------------------------------------- tree line (RGBA)
def gen_trees():
    """distant snowy spruce forest: each tree = trunk + many drooping branch strokes, snow on top faces"""
    W, H = 2048, 384
    img = Image.new('RGBA', (W * 3, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = np.random.default_rng(81)
    trees = []
    for layer in range(3):
        for _ in range(260 + layer * 80):
            trees.append((layer, r.uniform(0, W)))
    trees.sort(key=lambda t: t[0])
    for layer, x in trees:
        hgt = r.uniform(130, 320) * (0.7 + 0.15 * layer)
        base = H - 2 - layer * 5
        wid = hgt * r.uniform(0.2, 0.28)
        dark = int(14 + layer * 4 + r.uniform(-4, 4))
        lean = r.uniform(-0.03, 0.03)
        for ox in (0, W, 2 * W):
            cx = x + ox
            n = int(hgt / 2.2)
            for k in range(n):
                t = k / n
                y = base - hgt * t
                bw = wid * (1 - t) ** 1.1 * r.uniform(0.6, 1.15) + 1.5
                bx = cx + lean * hgt * t
                for side in (-1, 1):
                    ex = bx + side * bw
                    ey = y + bw * r.uniform(0.15, 0.45)  # drooping
                    d.line([(bx, y), ((bx + ex) / 2, y + (ey - y) * 0.3), (ex, ey)], fill=(dark, dark + 9, dark + 8, 255), width=2)
                    if r.random() < 0.55 - 0.1 * layer:
                        sc = int(150 + 30 * layer + r.uniform(-20, 20))
                        d.line([(bx + side * bw * 0.2, y - 1), (bx + side * bw * r.uniform(0.5, 0.9), y + bw * 0.1 - 1)], fill=(sc, sc + 10, sc + 22, 255), width=1)
            d.line([(cx, base), (cx + lean * hgt, base - hgt)], fill=(dark, dark + 6, dark + 6, 255), width=2)
    arr = np.asarray(img).astype(float) / 255
    a = arr[:, W:2 * W]
    a[-4:, :, :3] = np.array([0.75, 0.8, 0.88]); a[-4:, :, 3] = 1
    im = Image.fromarray((a * 255).astype(np.uint8), 'RGBA').filter(ImageFilter.GaussianBlur(0.6)).resize((1024, 192), Image.LANCZOS)
    im.save(os.path.join(OUT, 'trees.png'), optimize=True)
    print('wrote trees.png')

if __name__ == '__main__':
    import sys
    which = sys.argv[1:] or ['snow', 'ice', 'ground', 'fus', 'wing', 'paint', 'fab', 'people', 'trees']
    for w in which:
        {'snow': gen_snow, 'ice': gen_ice, 'ground': gen_ground, 'fus': gen_fuselage, 'wing': gen_wing,
         'paint': gen_paint, 'fab': gen_fabrics, 'people': gen_people, 'trees': gen_trees}[w]()
