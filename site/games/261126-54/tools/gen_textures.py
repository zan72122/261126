# -*- coding: utf-8 -*-
"""Procedural photo-like PBR textures for 261126-54 (cake shop).
Spectral (FFT) noise is periodic, so every map tiles seamlessly.
Outputs: tex/<name>_c.jpg (albedo, sRGB), tex/<name>_n.jpg (normal, OpenGL +Y),
         tex/<name>_r.jpg (R=AO, G=roughness, B=metalness)
run:  python3 tools/gen_textures.py
"""
import os, sys
import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tex')
os.makedirs(OUT, exist_ok=True)
RNG = np.random.default_rng(54)


def fnoise(n, beta=2.0, lo=1.0, hi=None, aniso=(1.0, 1.0), seed=None):
    """periodic fractal noise via FFT, normalized 0..1"""
    r = RNG if seed is None else np.random.default_rng(seed)
    w = r.standard_normal((n, n))
    F = np.fft.fft2(w)
    fy = np.fft.fftfreq(n)[:, None] * n * aniso[1]
    fx = np.fft.fftfreq(n)[None, :] * n * aniso[0]
    f = np.sqrt(fx * fx + fy * fy)
    f[0, 0] = 1
    amp = 1.0 / np.power(f, beta / 2.0)
    amp[f < lo] = 0
    if hi is not None:
        amp *= np.exp(-(f / hi) ** 2)
    amp[0, 0] = 0
    out = np.real(np.fft.ifft2(F * amp))
    out -= out.min()
    out /= out.max() + 1e-9
    return out


def normal_from_height(h, strength):
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5
    nx = -dx * strength
    ny = dy * strength  # image y goes down; OpenGL normal +Y up
    nz = np.ones_like(h)
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    return np.stack([nx / l, ny / l, nz / l], -1)


def ao_from_height(h, radius=6, k=2.5):
    # cavity: compare with blurred
    b = blur(h, radius)
    c = np.clip(1.0 - (b - h) * k, 0.0, 1.0)
    return c


def blur(a, r):
    n = a.shape[0]
    fy = np.fft.fftfreq(n)[:, None]
    fx = np.fft.fftfreq(a.shape[1])[None, :]
    g = np.exp(-(fx * fx + fy * fy) * (np.pi * r) ** 2 * 2)
    if a.ndim == 2:
        return np.real(np.fft.ifft2(np.fft.fft2(a) * g))
    return np.stack([np.real(np.fft.ifft2(np.fft.fft2(a[..., i]) * g)) for i in range(a.shape[2])], -1)


def lin2srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def save(name, col=None, nrm=None, ao=None, rough=None, metal=None, q=86, size=None):
    def fin(img):
        im = Image.fromarray(np.clip(img * 255 + 0.5, 0, 255).astype(np.uint8))
        if size:
            im = im.resize((size, size), Image.LANCZOS)
        return im
    if col is not None:
        fin(lin2srgb(col)).save(os.path.join(OUT, name + '_c.jpg'), quality=q)
    if nrm is not None:
        fin(nrm * 0.5 + 0.5).save(os.path.join(OUT, name + '_n.jpg'), quality=92)
    if rough is not None:
        n = rough.shape[0]
        a = ao if ao is not None else np.ones_like(rough)
        m = metal if metal is not None else np.zeros_like(rough)
        fin(np.stack([a, rough, m], -1)).save(os.path.join(OUT, name + '_r.jpg'), quality=90)
    print('wrote', name)


def mix(a, b, t):
    t = t[..., None] if np.ndim(t) == 2 and np.ndim(a) == 3 else t
    return a * (1 - t) + b * t


def srgb(hexs):
    c = np.array([int(hexs[i:i + 2], 16) / 255 for i in (0, 2, 4)])
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def ss(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


N = 1024
Y, X = np.mgrid[0:N, 0:N] / N


# ---------------------------------------------------------------- walnut wood (counter / shelves)
def wood(name, c_dark, c_light, rings=14, planks=0, seed=1, rough0=0.42, n=N):
    Y, X = np.mgrid[0:n, 0:n] / n
    # low-frequency gentle waviness of the grain (periodic)
    warp = fnoise(n, 3.2, lo=1, hi=6, aniso=(1, 0.5), seed=seed) - 0.5
    ph = X * rings + warp * 0.55 + (np.floor(X * planks) * 0.37 if planks else 0)
    ring = 0.5 + 0.5 * np.sin(ph * 2 * np.pi)
    late = ss(0.55, 0.95, ring)  # latewood bands (darker, harder)
    # fine parallel streaks along y: high freq across x, very low along y
    st1 = fnoise(n, 1.0, lo=40, hi=300, aniso=(1, 0.015), seed=seed + 2)
    st2 = fnoise(n, 1.4, lo=8, hi=80, aniso=(1, 0.03), seed=seed + 3)
    # elongated pores (short dark dashes)
    pn = fnoise(n, 0.5, lo=150, hi=500, aniso=(1, 0.12), seed=seed + 5)
    pores = ss(0.78, 0.9, pn)
    tone = fnoise(n, 3.0, lo=1, hi=5, seed=seed + 4)
    t = np.clip(late * 0.28 + (st2 - 0.5) * 0.9 + (st1 - 0.5) * 0.9 + 0.35, 0, 1)
    cl = c_light[None, None, :] * np.ones((n, n, 3))
    cd = c_dark[None, None, :] * np.ones((n, n, 3))
    base = mix(cl, cd, t)
    base *= (0.86 + 0.28 * tone)[..., None]
    base *= (1 - 0.35 * pores)[..., None]
    h = late * 0.25 + st1 * 0.25 + st2 * 0.2 - pores * 0.5
    if planks:
        rr = np.random.default_rng(seed)
        offs = rr.random(planks)
        lens = 0.45 + 0.55 * rr.random(planks)
        pid = np.floor(X * planks)
        gx = (X * planks) % 1.0
        seam = np.minimum(gx, 1 - gx) * (n / planks)
        m = ss(0.0, 2.5, seam)
        jm = np.ones_like(X)
        for i in range(planks):
            sel = (pid == i)
            yy = ((Y + offs[i]) % lens[i]) / lens[i]
            d = np.minimum(yy, 1 - yy) * n * lens[i]
            jm = np.where(sel, ss(0, 2.0, d), jm)
            # shift grain per plank so neighbours differ
        m = m * jm
        pt = np.sin(pid * 78.233 + np.floor((Y + offs[pid.astype(int)]) / lens[pid.astype(int)]) * 3.1) * 0.5 + 0.5
        base *= (0.84 + 0.3 * pt)[..., None]
        base *= (0.3 + 0.7 * m)[..., None]
        h = h * m - (1 - m) * 0.8
    nrm = normal_from_height(h, 2.0)
    ao = 0.7 + 0.3 * ao_from_height(h, 4, 3.0)
    rough = np.clip(rough0 + 0.25 * pores + 0.08 * late + 0.06 * tone, 0, 1)
    save(name, base, nrm, ao, rough)


wood('walnut', srgb('3a2416'), srgb('6e4a30'), rings=23, seed=10, rough0=0.38)
wood('oakfloor', srgb('7a5634'), srgb('b48c60'), rings=25, planks=5, seed=20, rough0=0.48)


# ---------------------------------------------------------------- white plaster wall
def plaster():
    big = fnoise(N, 3.2, lo=1, seed=30)
    mid = fnoise(N, 2.2, lo=6, seed=31)
    fine = fnoise(N, 1.0, lo=60, seed=32)
    # trowel strokes: stretched noise
    tr = fnoise(N, 2.4, lo=3, aniso=(1.0, 3.5), seed=33)
    h = 0.35 * mid + 0.25 * fine + 0.4 * ss(0.45, 0.62, tr)
    c = srgb('ece6dc')[None, None, :] * np.ones((N, N, 3))
    c *= (0.93 + 0.08 * big + 0.03 * fine)[..., None]
    nrm = normal_from_height(h, 3.0)
    ao = 0.8 + 0.2 * ao_from_height(h, 3, 3)
    rough = 0.82 + 0.1 * fine
    save('plaster', c, nrm, ao, rough, size=512)


plaster()


# ---------------------------------------------------------------- white subway tiles (backsplash)
def tiles():
    cols, rows = 4, 8
    gx = (X * cols + (np.floor(Y * rows) % 2) * 0.5) % 1.0
    gy = (Y * rows) % 1.0
    dx = np.minimum(gx, 1 - gx) * (N / cols)
    dy = np.minimum(gy, 1 - gy) * (N / rows)
    d = np.minimum(dx, dy)
    grout = 1 - ss(2.0, 5.0, d)
    bevel = ss(2.0, 14.0, d)
    wav = fnoise(N, 2.5, lo=2, seed=40)
    h = bevel * 0.8 + wav * 0.12
    tid = np.floor(X * cols + (np.floor(Y * rows) % 2) * 0.5) + np.floor(Y * rows) * 7
    tint = 0.96 + 0.04 * (np.sin(tid * 12.9898) * 0.5 + 0.5)
    c = srgb('f2efe8')[None, None, :] * tint[..., None]
    c = mix(c, srgb('b8b0a2')[None, None, :] * np.ones_like(c), grout)
    nrm = normal_from_height(h, 6.0)
    ao = 1 - grout * 0.5 - (1 - bevel) * 0.15
    rough = 0.12 + grout * 0.75 + fnoise(N, 1.0, lo=80, seed=41) * 0.06
    save('tile', c, nrm, ao, rough)


tiles()


# ---------------------------------------------------------------- linen weave (apron / cloth), grey value (tinted in material)
def weave(name, n=512, threads=96, seed=50, slub=0.5, base='f4f0e8'):
    Y, X = np.mgrid[0:n, 0:n] / n
    tx = X * threads
    ty = Y * threads
    # thread irregularity
    jx = (fnoise(n, 2.0, lo=1, aniso=(0.1, 6), seed=seed) - 0.5) * 0.6
    jy = (fnoise(n, 2.0, lo=1, aniso=(6, 0.1), seed=seed + 1) - 0.5) * 0.6
    fx = (tx + jy) % 1.0
    fy = (ty + jx) % 1.0
    cx = np.floor(tx + jy)
    cy = np.floor(ty + jx)
    over = ((cx + cy) % 2) == 0
    warp_h = np.sin(fx * np.pi) * (0.6 + 0.4 * np.sin(fy * np.pi))
    weft_h = np.sin(fy * np.pi) * (0.6 + 0.4 * np.sin(fx * np.pi))
    h = np.where(over, warp_h + 0.2, weft_h + 0.2)
    sl = fnoise(n, 1.5, lo=2, aniso=(0.2, 3), seed=seed + 2)
    sl2 = fnoise(n, 1.5, lo=2, aniso=(3, 0.2), seed=seed + 3)
    h = h * (0.75 + slub * 0.5 * np.where(over, sl, sl2))
    fuzz = fnoise(n, 0.8, lo=100, seed=seed + 4)
    h = h + fuzz * 0.15
    c = srgb(base)[None, None, :] * (0.82 + 0.18 * h)[..., None]
    c *= (0.95 + 0.05 * np.where(over, sl, sl2))[..., None]
    nrm = normal_from_height(h, 2.4)
    ao = 0.7 + 0.3 * np.clip(h, 0, 1)
    rough = 0.85 + 0.1 * fuzz
    save(name, c, nrm, ao, rough)


weave('linen', threads=80, seed=50, slub=0.7)
weave('cotton', threads=140, seed=60, slub=0.25)


# ---------------------------------------------------------------- knit (sweaters)
def knit(n=512, cols=40, rows=56):
    Y, X = np.mgrid[0:n, 0:n] / n
    u = (X * cols) % 1.0
    v = (Y * rows) % 1.0
    # V-shaped loops
    a = np.abs(u - 0.5) * 2
    vv = (v + a * 0.45) % 1.0
    loop = np.sin(vv * np.pi) * (1 - np.power(a, 4)) * 0.9 + 0.1
    fuzz = fnoise(n, 0.9, lo=90, seed=70)
    h = loop + 0.25 * fuzz
    c = np.ones((n, n, 3)) * (0.8 + 0.2 * h)[..., None]
    nrm = normal_from_height(h, 2.0)
    ao = 0.6 + 0.4 * np.clip(loop, 0, 1)
    rough = 0.9 + 0.08 * fuzz
    save('knit', c, nrm, ao, rough)


knit()


# ---------------------------------------------------------------- brushed stainless
def steel(n=512):
    Y, X = np.mgrid[0:n, 0:n] / n
    br = fnoise(n, 1.0, lo=4, aniso=(0.05, 8), seed=80)
    sc = fnoise(n, 0.5, lo=200, aniso=(0.3, 2), seed=81)
    smudge = fnoise(n, 3, lo=1, seed=82)
    scratches = np.zeros((n, n))
    r = np.random.default_rng(83)
    for i in range(70):
        x0, y0 = r.random() * n, r.random() * n
        ang = r.random() * np.pi
        L = 20 + r.random() * 120
        t = np.linspace(0, 1, int(L * 2))
        xs = ((x0 + np.cos(ang) * L * t) % n).astype(int)
        ys = ((y0 + np.sin(ang) * L * t) % n).astype(int)
        scratches[ys, xs] = 0.5 + 0.5 * r.random()
    scratches = blur(scratches, 0.6)
    scratches = scratches / (scratches.max() + 1e-9)
    h = br * 0.6 + sc * 0.2 - scratches * 0.4
    c = srgb('c9ccd0')[None, None, :] * (0.92 + 0.08 * br)[..., None] * np.ones((n, n, 3))
    nrm = normal_from_height(h, 1.6)
    rough = np.clip(0.28 + 0.1 * br + 0.18 * smudge + scratches * 0.2, 0, 1)
    save('steel', c, nrm, np.ones((n, n)), rough, np.ones((n, n)))


steel()


# ---------------------------------------------------------------- baked sponge crust (top) & side
def sponge(name, tone='8a5428', light='c68a4c', seed=90, n=N, side=False):
    Y, X = np.mgrid[0:n, 0:n] / n
    big = fnoise(n, 3.0, lo=1, seed=seed)
    mid = fnoise(n, 2.0, lo=8, seed=seed + 1)
    # pores: thresholded fine noise
    pn = fnoise(n, 1.0, lo=60, hi=260, seed=seed + 2)
    pores = ss(0.30, 0.18, pn)
    pn2 = fnoise(n, 1.2, lo=25, hi=120, seed=seed + 3)
    pores2 = ss(0.22, 0.10, pn2)
    cracks = np.abs(fnoise(n, 2.2, lo=3, seed=seed + 4) - 0.5)
    crack = ss(0.025, 0.0, cracks) * (0.6 if not side else 0.2)
    h = 0.4 * big + 0.3 * mid - pores * 0.35 - pores2 * 0.45 - crack * 0.5
    if side:
        # vertical baking texture
        h += 0.2 * fnoise(n, 2.0, lo=4, aniso=(4, 0.4), seed=seed + 5)
    browning = np.clip(0.35 + 0.65 * big + 0.3 * (mid - 0.5), 0, 1)
    c = mix(srgb(light)[None, None, :] * np.ones((n, n, 3)), srgb(tone)[None, None, :] * np.ones((n, n, 3)), browning)
    # inside of crack/pore is lighter crumb
    crumb = srgb('e2bf82')[None, None, :] * np.ones((n, n, 3))
    c = mix(c, crumb * 0.8, np.clip(crack * 0.8, 0, 1))
    c *= (1 - 0.35 * pores2 - 0.08 * pores)[..., None]
    c *= (0.85 + 0.15 * mid)[..., None]
    nrm = normal_from_height(h, 7.0)
    ao = 0.55 + 0.45 * ao_from_height(h, 3, 3.5)
    rough = np.clip(0.62 + 0.2 * pores2 - 0.12 * big, 0, 1)
    save(name, c, nrm, ao, rough)


sponge('spongetop', seed=90)
sponge('spongeside', tone='7c4a22', light='b67c42', seed=95, side=True)


# ---------------------------------------------------------------- cream micro (lumps & bubbles): grey height in R, used as tiling noise
def cream_noise(n=512):
    lumps = fnoise(n, 2.6, lo=2, seed=100)
    mid = fnoise(n, 1.8, lo=10, seed=101)
    bub = fnoise(n, 1.0, lo=80, hi=200, seed=102)
    bubbles = ss(0.25, 0.12, bub)
    streak = fnoise(n, 1.4, lo=6, aniso=(0.05, 10), seed=103)  # lines along x (u)
    img = np.stack([lumps * 0.7 + mid * 0.3, streak, 1 - bubbles], -1)
    Image.fromarray((img * 255).astype(np.uint8)).save(os.path.join(OUT, 'creamnoise.png'))
    print('wrote creamnoise')


cream_noise()


# ---------------------------------------------------------------- skin micro normal
def skin(n=256):
    p = fnoise(n, 1.0, lo=40, seed=110)
    pores = ss(0.25, 0.1, p)
    fine = fnoise(n, 1.5, lo=10, seed=111)
    h = fine * 0.3 - pores * 0.5
    save('skin', None, normal_from_height(h, 1.2), np.ones((n, n)), 0.45 + 0.15 * pores + 0.1 * fine)


skin()


# ---------------------------------------------------------------- hair strands normal (strands along v)
def hair(n=512):
    s = fnoise(n, 1.1, lo=20, aniso=(1, 0.02), seed=120)
    s2 = fnoise(n, 1.6, lo=3, aniso=(1, 0.05), seed=121)
    h = 0.6 * s + 0.4 * s2
    c = np.ones((n, n, 3)) * (0.7 + 0.3 * h)[..., None]
    save('hair', c, normal_from_height(h, 2.5), 0.6 + 0.4 * h, 0.4 + 0.2 * s)


hair()


# ---------------------------------------------------------------- strawberry skin (u around, v up) with achenes
def strawberry(n=512):
    Y, X = np.mgrid[0:n, 0:n] / n
    base = fnoise(n, 2.5, lo=1, seed=130)
    seedsH = np.zeros((n, n))
    seedsC = np.zeros((n, n))
    cols, rows = 16, 14
    for j in range(rows):
        for i in range(cols):
            cx = (i + 0.5 + (j % 2) * 0.5) / cols
            cy = (j + 0.5) / rows
            cx += (RNG.random() - 0.5) * 0.02
            cy += (RNG.random() - 0.5) * 0.02
            dx = (X - cx + 0.5) % 1 - 0.5
            dy = (Y - cy + 0.5) % 1 - 0.5
            d2 = (dx * cols) ** 2 * 1.0 + (dy * rows) ** 2 * 1.6
            dimple = np.exp(-d2 / 0.09)
            seed_ = np.exp(-d2 / 0.012)
            seedsH -= dimple * 0.6
            seedsH += seed_ * 0.9
            seedsC = np.maximum(seedsC, ss(0.35, 0.8, seed_))
    h = seedsH + base * 0.2
    red = mix(srgb('a3101a')[None, None, :] * np.ones((n, n, 3)), srgb('d92a2a')[None, None, :] * np.ones((n, n, 3)), base)
    # top shoulder lighter (v high = near top)
    red = mix(red, srgb('e86a4a')[None, None, :] * np.ones((n, n, 3)), ss(0.8, 1.0, 1 - Y) * 0.5)
    seedc = srgb('d9b04a')[None, None, :] * np.ones((n, n, 3))
    c = mix(red, seedc, seedsC * 0.9)
    nrm = normal_from_height(h, 3.0)
    ao = 0.6 + 0.4 * ss(-0.6, 0.0, seedsH)
    rough = np.clip(0.28 + seedsC * 0.3 - base * 0.05, 0, 1)
    save('berry', c, nrm, ao, rough)


strawberry()


# ---------------------------------------------------------------- white marble (showcase top)
def marble():
    w = fnoise(N, 2.4, lo=1, seed=140)
    w2 = fnoise(N, 2.0, lo=2, seed=141)
    v = np.abs(np.sin((X * 3 + Y * 1.0 + w * 2.5 + w2 * 0.6) * np.pi * 2))
    vein = ss(0.06, 0.0, v)
    v2 = np.abs(np.sin((X * 7 - Y * 3 + w2 * 3) * np.pi * 2))
    vein2 = ss(0.03, 0.0, v2) * 0.5
    cloud = fnoise(N, 2.8, lo=2, seed=142)
    c = srgb('f1ede6')[None, None, :] * (0.94 + 0.06 * cloud)[..., None] * np.ones((N, N, 3))
    c = mix(c, srgb('9a948c')[None, None, :] * np.ones_like(c), np.clip(vein * 0.55 + vein2 * 0.4, 0, 1))
    h = fnoise(N, 1.2, lo=80, seed=143) * 0.2
    nrm = normal_from_height(h, 1.0)
    rough = 0.12 + 0.06 * cloud + 0.05 * h
    save('marble', c, nrm, np.ones((N, N)), rough, size=512)


marble()


# ---------------------------------------------------------------- terrazzo / stone floor (front of shop)
def floor_tiles():
    cols = 4
    gx = (X * cols) % 1.0
    gy = (Y * cols) % 1.0
    d = np.minimum(np.minimum(gx, 1 - gx), np.minimum(gy, 1 - gy)) * (N / cols)
    grout = 1 - ss(1.5, 4.0, d)
    cloud = fnoise(N, 2.6, lo=1, seed=150)
    chip = fnoise(N, 1.0, lo=50, hi=160, seed=151)
    chips = ss(0.72, 0.8, chip)
    tid = np.floor(X * cols) + np.floor(Y * cols) * 5
    tint = 0.94 + 0.06 * (np.sin(tid * 91.3) * 0.5 + 0.5)
    c = srgb('d8cfc2')[None, None, :] * (tint * (0.9 + 0.1 * cloud))[..., None]
    c = mix(c, srgb('8a7a68')[None, None, :] * np.ones_like(c), chips * 0.6)
    c = mix(c, srgb('7d7468')[None, None, :] * np.ones_like(c), grout)
    h = (1 - grout) * 0.6 + fnoise(N, 1.0, lo=60, seed=152) * 0.1
    nrm = normal_from_height(h, 4.0)
    ao = 1 - grout * 0.4
    rough = 0.35 + grout * 0.5 + 0.15 * cloud
    save('floortile', c, nrm, ao, rough, size=512)


floor_tiles()
print('done')
