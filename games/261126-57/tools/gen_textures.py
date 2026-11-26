# -*- coding: utf-8 -*-
"""Procedural photo-style PBR texture generator for games/261126-57.
Run: python3 tools/gen_textures.py  (writes into ../tex)
Every set = albedo (_c.jpg), tangent-space normal (_n.jpg, OpenGL green-up),
packed ORM (_orm.jpg: R=AO, G=roughness, B=metalness).
No text, no people, no logos. Deterministic (seeded)."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tex')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(57)


# ---------------------------------------------------------------- noise
def perlin(shape, res, seed=0):
    """Tileable 2D gradient noise. shape divisible by res."""
    r = np.random.default_rng(seed)
    d = (shape[0] // res[0], shape[1] // res[1])
    ang = 2 * np.pi * r.random((res[0] + 1, res[1] + 1))
    g = np.dstack((np.cos(ang), np.sin(ang)))
    g[-1, :] = g[0, :]
    g[:, -1] = g[:, 0]
    delta = (res[0] / shape[0], res[1] / shape[1])
    grid = np.mgrid[0:res[0]:delta[0], 0:res[1]:delta[1]].transpose(1, 2, 0) % 1
    g = g.repeat(d[0], 0).repeat(d[1], 1)
    g00 = g[:-d[0], :-d[1]]; g10 = g[d[0]:, :-d[1]]
    g01 = g[:-d[0], d[1]:]; g11 = g[d[0]:, d[1]:]
    n00 = np.sum(np.dstack((grid[:, :, 0], grid[:, :, 1])) * g00, 2)
    n10 = np.sum(np.dstack((grid[:, :, 0] - 1, grid[:, :, 1])) * g10, 2)
    n01 = np.sum(np.dstack((grid[:, :, 0], grid[:, :, 1] - 1)) * g01, 2)
    n11 = np.sum(np.dstack((grid[:, :, 0] - 1, grid[:, :, 1] - 1)) * g11, 2)
    t = 6 * grid ** 5 - 15 * grid ** 4 + 10 * grid ** 3
    n0 = n00 * (1 - t[:, :, 0]) + t[:, :, 0] * n10
    n1 = n01 * (1 - t[:, :, 0]) + t[:, :, 0] * n11
    return np.sqrt(2) * ((1 - t[:, :, 1]) * n0 + t[:, :, 1] * n1)


def fbm(shape, res, octaves=5, seed=0, persistence=0.5):
    n = np.zeros(shape); a = 1.0; tot = 0
    for o in range(octaves):
        rr = (res[0] * 2 ** o, res[1] * 2 ** o)
        rr = tuple(int(2 ** round(math.log2(max(v, 1)))) for v in rr)
        if shape[0] % rr[0] or shape[1] % rr[1] or rr[0] > shape[0] // 2:
            break
        n += a * perlin(shape, rr, seed + o * 31)
        tot += a; a *= persistence
    return n / tot


def norm01(a):
    a = a - a.min(); m = a.max()
    return a / m if m > 0 else a


def normal_from_height(h, strength=4.0):
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5
    nx = -dx * strength; ny = dy * strength; nz = np.ones_like(h)
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    n = np.dstack((nx / l, ny / l, nz / l))
    return ((n * 0.5 + 0.5) * 255).clip(0, 255).astype(np.uint8)


def ao_from_height(h, radius=6):
    img = Image.fromarray((norm01(h) * 255).astype(np.uint8))
    bl = np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32) / 255
    ao = 1 - np.clip((bl - norm01(h)) * 2.2, 0, 1)
    return ao


def save_rgb(a, name, q=88):
    if a.dtype != np.uint8:
        a = (np.clip(a, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(a).save(os.path.join(OUT, name), quality=q, optimize=True, progressive=True)


def save_set(name, albedo, height, rough, metal=None, ao=None, nstr=4.0, q=86):
    save_rgb(albedo, name + '_c.jpg', q)
    save_rgb(normal_from_height(height, nstr), name + '_n.jpg', 90)
    if ao is None:
        ao = ao_from_height(height)
    if metal is None:
        metal = np.zeros_like(rough)
    save_rgb(np.dstack((ao, rough, metal)), name + '_orm.jpg', 88)
    print('wrote', name)


def srgb(hexstr):
    hexstr = hexstr.lstrip('#')
    return np.array([int(hexstr[i:i + 2], 16) / 255 for i in (0, 2, 4)])


def lerp3(c0, c1, t):
    return c0[None, None, :] * (1 - t[..., None]) + c1[None, None, :] * t[..., None]


# ---------------------------------------------------------------- wood (counter planks)
def wood(name, S=1024, planks=4, dark=False, seed=1):
    h = np.zeros((S, S)); alb = np.zeros((S, S, 3)); rough = np.zeros((S, S))
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float64)
    ph = S // planks
    warp = fbm((S, S), (4, 2), 5, seed) * 30
    fib = fbm((S, S), (64, 2), 3, seed + 5)  # long fibres along x
    fine = fbm((S, S), (128, 8), 2, seed + 9)
    for p in range(planks):
        y0 = p * ph
        m = (yy >= y0) & (yy < y0 + ph)
        r2 = np.random.default_rng(seed * 10 + p)
        off = r2.random() * 500
        freq = 0.10 + r2.random() * 0.06
        ly = yy - y0 - ph / 2
        ring = np.sin((ly + warp + 0.004 * (xx + off) ** 1.0 * r2.uniform(-1, 1) * 8) * freq + off)
        ring = (ring * 0.5 + 0.5) ** 3
        base = (srgb('#5a3a22') if dark else srgb('#9a6a42')) * r2.uniform(0.82, 1.08)
        late = (srgb('#2e1a0e') if dark else srgb('#5e3a20'))
        t = np.clip(ring * 0.7 + fib * 0.35 + 0.15, 0, 1)
        col = lerp3(base, late, t)
        alb[m] = col[m]
        hh = -ring * 0.6 + fib * 0.5 + fine * 0.15
        h[m] = hh[m]
        rr = 0.62 + ring * 0.18 + fine * 0.08
        rough[m] = rr[m]
        # knots
        for k in range(r2.integers(0, 3)):
            cx, cy = r2.random() * S, y0 + ph * r2.uniform(0.25, 0.75)
            d = np.sqrt(((xx - cx + S / 2) % S - S / 2) ** 2 * 0.5 + (yy - cy) ** 2)
            kn = np.exp(-(d / r2.uniform(8, 16)) ** 2)
            kr = np.sin(d * 0.6) * 0.5 + 0.5
            ka = (kn * (0.6 + 0.4 * kr))[..., None]
            alb = np.where(m[..., None], alb * (1 - ka * 0.65), alb)
            h = np.where(m, h - kn * 0.8, h)
    # seams
    for p in range(planks + 1):
        y0 = (p * ph) % S
        d = np.abs(((yy - y0 + S / 2) % S) - S / 2)
        g = np.exp(-(d / 2.2) ** 2)
        h -= g * 2.5
        alb *= (1 - g * 0.75)[..., None]
        rough = np.maximum(rough, g * 0.9)
    # wear / grime, scuffs
    grime = norm01(fbm((S, S), (4, 4), 5, seed + 21))
    alb *= (0.85 + 0.25 * grime)[..., None]
    sc = Image.new('L', (S, S), 0); dr = ImageDraw.Draw(sc)
    r3 = np.random.default_rng(seed + 77)
    for i in range(140):
        x, y = r3.random() * S, r3.random() * S
        a = r3.normal(0, 0.25); L = r3.uniform(10, 70)
        dr.line([(x, y), (x + math.cos(a) * L, y + math.sin(a) * L)], fill=int(r3.uniform(60, 160)), width=1)
    scr = np.asarray(sc, dtype=np.float64) / 255
    h -= scr * 0.4
    alb = alb * (1 + scr[..., None] * 0.25)
    rough = np.clip(rough - grime * 0.12, 0.3, 1)
    save_set(name, np.clip(alb, 0, 1), h, rough, nstr=3.0)


# ---------------------------------------------------------------- woven fabric
def weave_height(S, threads, seed, twill=True):
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float64)
    u = xx / S * threads * 2 * np.pi; v = yy / S * threads * 2 * np.pi
    slubx = fbm((S, S), (2, 32), 3, seed) * 0.6
    sluby = fbm((S, S), (32, 2), 3, seed + 3) * 0.6
    wx = np.abs(np.sin(v / 2 + slubx))  # weft thread profile
    wy = np.abs(np.sin(u / 2 + sluby))
    cell = (np.floor(xx / S * threads) + (np.floor(yy / S * threads) if twill else 0)) % 2 if not twill else \
        (np.floor(xx / S * threads) + np.floor(yy / S * threads)) % 3
    over = (cell < 1.5) if not twill else (cell < 1)
    h = np.where(over, wx * 0.9 + wy * 0.3, wy * 0.9 + wx * 0.3)
    fuzz = fbm((S, S), (128, 128), 2, seed + 7) * 0.25
    return h + fuzz


def wrinkles(S, seed, amount=1.0, scale=3):
    a = fbm((S, S), (scale, scale * 3), 4, seed)
    b = fbm((S, S), (scale * 2, scale), 3, seed + 4)
    w = np.abs(a) * -1 + np.abs(b) * -0.5
    return w * amount


def happi(name='happi', S=1024, seed=11):
    h = weave_height(S, 160, seed) * 0.35 + wrinkles(S, seed, 2.0, 2) * 1.0
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float64)
    var = fbm((S, S), (8, 8), 5, seed + 1)
    indigo = srgb('#1d2f5e'); indigo2 = srgb('#14224a')
    alb = lerp3(indigo, indigo2, norm01(var))
    # seigaiha (overlapping wave arcs) in off-white
    pat = np.zeros((S, S))
    R = S / 8.0
    for row in range(-1, 18):
        cy = row * R * 0.5
        for col in range(-1, 10):
            cx = col * R * 2 + (R if row % 2 else 0)
            d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
            m = d < R
            if not m.any():
                continue
            rings = np.zeros_like(d)
            for rr in (R * 0.93, R * 0.70, R * 0.47, R * 0.24):
                rings = np.maximum(rings, np.exp(-((d - rr) / (R * 0.05)) ** 2))
            pat = np.where(m, rings, pat)
    pat = np.clip(pat, 0, 1)
    # dye bleed
    patimg = Image.fromarray((pat * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    pat = np.asarray(patimg, dtype=np.float64) / 255
    pat *= (0.8 + 0.2 * norm01(fbm((S, S), (16, 16), 3, seed + 9)))
    off = srgb('#e9e4d6')
    alb = alb * (1 - pat[..., None]) + off[None, None, :] * pat[..., None]
    alb *= (0.9 + 0.1 * norm01(h))[..., None]
    rough = 0.86 + 0.08 * norm01(fbm((S, S), (32, 32), 2, seed))
    save_set(name, alb, h, rough, nstr=2.4)


def plain_fabric(name, S=512, threads=110, seed=13, color='#d8b8a0', knit=False, wr=1.0, q=86):
    if knit:
        yy, xx = np.mgrid[0:S, 0:S].astype(np.float64)
        u = xx / S * threads * 2 * np.pi; v = yy / S * threads * 2 * np.pi
        h = np.abs(np.sin(u / 2 + np.sin(v) * 0.6)) * (0.6 + 0.4 * np.abs(np.sin(v / 2)))
        h += fbm((S, S), (64, 64), 2, seed) * 0.2
    else:
        h = weave_height(S, threads, seed)
    h = h * 0.4 + wrinkles(S, seed, 1.6, 2) * wr
    var = norm01(fbm((S, S), (8, 8), 4, seed + 2))
    c = srgb(color)
    alb = c[None, None, :] * (0.86 + 0.18 * var[..., None]) * (0.9 + 0.12 * norm01(h)[..., None])
    rough = 0.82 + 0.1 * var
    save_set(name, alb, h, rough, nstr=2.2, q=q)


def canopy(name='canopy', S=1024, seed=17):
    """red / white striped festival awning tarp (heavy cotton canvas)."""
    h = weave_height(S, 120, seed) * 0.3 + wrinkles(S, seed, 1.2, 2)
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float64)
    stripe = (np.floor(xx / S * 4) % 2)  # 4 stripes per tile
    edge = np.abs(((xx / S * 4) % 1) - 0.5)
    soft = np.clip((0.5 - edge) * 80, 0, 1)
    red = srgb('#a8232a'); wh = srgb('#e8e0d0')
    stain = norm01(fbm((S, S), (4, 4), 5, seed + 4))
    alb = np.where(stripe[..., None] > 0.5, red[None, None, :], wh[None, None, :])
    alb = alb * (0.8 + 0.25 * stain[..., None]) * (0.9 + 0.12 * norm01(h)[..., None])
    # seam stitch between stripes
    seam = np.exp(-(((xx / S * 4 + 0.5) % 1 - 0.5) * S / 4 / 1.5) ** 2)
    h -= seam * 1.2
    rough = 0.88 + 0.06 * stain
    save_set(name, alb, h, rough, nstr=2.4)


# ---------------------------------------------------------------- metal
def metal(name='steel', S=1024, seed=19):
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float64)
    brush = fbm((S, S), (256, 2), 2, seed) * 0.5 + fbm((S, S), (128, 4), 2, seed + 1) * 0.5
    sc = Image.new('L', (S, S), 0); dr = ImageDraw.Draw(sc)
    r = np.random.default_rng(seed)
    for i in range(420):
        x, y = r.random() * S, r.random() * S
        a = r.uniform(0, math.pi); L = r.uniform(8, 120)
        pts = [(x, y)]
        for k in range(4):
            a += r.normal(0, 0.15)
            x += math.cos(a) * L / 4; y += math.sin(a) * L / 4
            pts.append((x, y))
        dr.line(pts, fill=int(r.uniform(40, 200)), width=1)
    scr = np.asarray(sc.filter(ImageFilter.GaussianBlur(0.6)), dtype=np.float64) / 255
    dents = fbm((S, S), (4, 4), 3, seed + 3)
    smudge = norm01(fbm((S, S), (6, 6), 5, seed + 8))
    h = brush * 0.25 - scr * 0.9 + dents * 0.6
    base = srgb('#c9ccd0')
    alb = base[None, None, :] * (0.9 + 0.08 * brush[..., None] - 0.12 * smudge[..., None] ** 2)
    rough = 0.22 + 0.16 * smudge + scr * 0.25 + 0.05 * norm01(brush)
    metal_ = np.ones((S, S)) * 0.98
    ao = np.ones((S, S)) * (0.95 + 0.05 * smudge)
    save_set(name, alb, h, rough, metal_, ao, nstr=1.6)


# ---------------------------------------------------------------- gravel / shrine grounds
def gravel(name='gravel', S=1024, seed=23):
    h = np.zeros((S, S)) - 0.2
    alb = np.zeros((S, S, 3))
    dirt = norm01(fbm((S, S), (8, 8), 5, seed))
    alb[:] = (lerp3(srgb('#4a3c30'), srgb('#6b5a48'), dirt))
    rough = np.ones((S, S)) * 0.95
    r = np.random.default_rng(seed)
    N = 2600
    yy, xx = np.mgrid[0:64, 0:64].astype(np.float64)
    for i in range(N):
        rad = r.uniform(5, 18) * (0.6 if r.random() < 0.5 else 1)
        e = r.uniform(0.6, 1.0); ang = r.uniform(0, math.pi)
        cx, cy = r.random() * S, r.random() * S
        size = int(rad * 2 + 4)
        ly, lx = np.mgrid[0:size, 0:size].astype(np.float64) - size / 2
        ca, sa = math.cos(ang), math.sin(ang)
        u = (lx * ca + ly * sa) / rad; v = (-lx * sa + ly * ca) / (rad * e)
        d2 = u * u + v * v
        dome = np.sqrt(np.clip(1 - d2, 0, 1)) * rad / 12 + r.uniform(0, 0.2)
        tone = r.uniform(0.35, 0.85)
        tint = np.array([1.0, r.uniform(0.95, 1.0), r.uniform(0.88, 0.98)]) * tone
        x0, y0 = int(cx - size / 2), int(cy - size / 2)
        ys = (np.arange(size) + y0) % S; xs = (np.arange(size) + x0) % S
        sub = h[np.ix_(ys, xs)]
        mask = (d2 < 1) & (dome > sub)
        sub2 = np.where(mask, dome, sub)
        h[np.ix_(ys, xs)] = sub2
        a = alb[np.ix_(ys, xs)]
        speck = r.random((size, size)) * 0.12
        shade = (0.75 + 0.25 * np.clip(1 - d2, 0, 1))[..., None]
        newc = tint[None, None, :] * shade * (0.92 + speck[..., None])
        alb[np.ix_(ys, xs)] = np.where(mask[..., None], newc, a)
        rr = rough[np.ix_(ys, xs)]
        rough[np.ix_(ys, xs)] = np.where(mask, 0.7 + r.uniform(-0.1, 0.1), rr)
    ao = ao_from_height(h, 5) ** 1.5
    alb *= (0.55 + 0.45 * ao)[..., None]
    save_set(name, alb, h, rough, ao=ao, nstr=5.0)


# ---------------------------------------------------------------- washi paper (lantern)
def washi(name='washi', S=512, seed=29):
    base = np.ones((S, S)) * 0.9
    img = Image.new('L', (S, S), 0); dr = ImageDraw.Draw(img)
    r = np.random.default_rng(seed)
    for i in range(2600):
        x, y = r.random() * S, r.random() * S
        a = r.uniform(0, 2 * math.pi); L = r.uniform(10, 60)
        pts = [(x, y)]
        for k in range(5):
            a += r.normal(0, 0.5); x += math.cos(a) * L / 5; y += math.sin(a) * L / 5
            pts.append((x, y))
        dr.line(pts, fill=int(r.uniform(30, 120)), width=1)
    f = np.asarray(img.filter(ImageFilter.GaussianBlur(0.5)), dtype=np.float64) / 255
    cl = norm01(fbm((S, S), (8, 8), 5, seed))
    thick = 0.65 + 0.35 * cl + f * 0.4  # paper thickness -> light transmission
    alb = np.dstack((thick, thick * 0.97, thick * 0.9))
    h = f + cl * 0.5
    rough = 0.9 * np.ones((S, S))
    save_set(name, np.clip(alb, 0, 1), h, rough, nstr=1.5)


# ---------------------------------------------------------------- skin micro detail (tileable)
def skin(name='skin', S=512, seed=31):
    pores = np.zeros((S, S))
    r = np.random.default_rng(seed)
    n = 5200
    xs = r.integers(0, S, n); ys = r.integers(0, S, n)
    pores[ys, xs] = 1
    pimg = Image.fromarray((pores * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
    p = np.asarray(pimg, dtype=np.float64) / 255
    cells = fbm((S, S), (32, 32), 3, seed)
    h = -p * 3 + cells * 0.35
    mott = norm01(fbm((S, S), (4, 4), 5, seed + 4))
    alb = np.dstack((0.98 + 0.04 * mott, 0.97 - 0.04 * mott, 0.96 - 0.05 * mott))  # multiplier around white
    rough = 0.5 + 0.12 * mott + p * 0.1
    save_set(name, np.clip(alb, 0, 1), h, rough, nstr=2.0)


# ---------------------------------------------------------------- hair strands (V along strand)
def hair(name='hair', S=512, seed=37):
    s1 = fbm((S, S), (1, 128), 1, seed) * 0.6 + fbm((S, S), (2, 64), 2, seed + 1) * 0.4
    s2 = fbm((S, S), (4, 256), 1, seed + 3)
    h = s1 + s2 * 0.5
    cl = norm01(fbm((S, S), (2, 8), 3, seed + 5))
    v = norm01(h)
    alb = np.dstack((0.75 + 0.35 * v, 0.75 + 0.35 * v, 0.75 + 0.35 * v)) * (0.85 + 0.2 * cl)[..., None]
    rough = 0.38 + 0.2 * (1 - v)
    save_set(name, np.clip(alb, 0, 1), h, rough, nstr=3.0)


# ---------------------------------------------------------------- cotton candy fibres
def fibre(name='fibre', S=512, seed=41):
    img = Image.new('L', (S * 3, S * 3), 0); dr = ImageDraw.Draw(img)
    r = np.random.default_rng(seed)
    for i in range(1700):
        x, y = S + r.random() * S, S + r.random() * S
        a = r.uniform(0, 2 * math.pi); L = r.uniform(40, 220)
        pts = []
        for k in range(16):
            a += r.normal(0, 0.22); x += math.cos(a) * L / 16; y += math.sin(a) * L / 16
            pts.append((x, y))
        v = int(r.uniform(90, 255))
        for ox in (-S, 0, S):
            for oy in (-S, 0, S):
                dr.line([(px + ox, py + oy) for px, py in pts], fill=v, width=1)
    big = np.asarray(img, dtype=np.float64)[S:2 * S, S:2 * S] / 255
    f = np.clip(big, 0, 1)
    soft = np.asarray(Image.fromarray((f * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.5)), dtype=np.float64) / 255
    dens = np.clip(f * 0.8 + soft * 1.6, 0, 1)
    alb = np.dstack((0.82 + 0.18 * dens,) * 3)
    h = f * 0.7 + soft
    rough = 0.75 - 0.25 * f
    save_set(name, alb, h, rough, nstr=3.5)


# ---------------------------------------------------------------- background: festival night, shallow DOF bokeh
def backdrop(name='backdrop', W=2048, H=1024, seed=43):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float64)
    t = yy / H
    sky_top = srgb('#0a1430'); sky_mid = srgb('#1c2550'); hor = srgb('#4a3346')
    sky = lerp3(sky_top, sky_mid, np.clip(t / 0.45, 0, 1))
    sky = np.where((t > 0.45)[..., None], lerp3(sky_mid, hor, np.clip((t - 0.45) / 0.25, 0, 1)), sky)
    img = sky.copy()
    # treeline (shrine forest) silhouette, soft
    tn = fbm((1, W) if False else (64, W), (1, 16), 5, seed)[0]
    tl = (0.36 + 0.07 * tn + 0.04 * np.sin(xx[0] / W * 2 * np.pi * 3)) * H
    tree = (yy > tl[None, :]).astype(np.float64)
    leafy = norm01(fbm((H, W), (16, 32), 4, seed + 2))
    treec = lerp3(srgb('#0b1110'), srgb('#1a2220'), leafy)
    img = img * (1 - tree[..., None]) + treec * tree[..., None]
    # torii-free: distant stall roofs band
    band = (yy > 0.6 * H).astype(np.float64)
    stallc = lerp3(srgb('#2a1a16'), srgb('#4a2e22'), norm01(fbm((H, W), (8, 64), 3, seed + 3)))
    img = img * (1 - band[..., None]) + stallc * band[..., None]
    # warm glow from stalls
    glow = np.exp(-((yy - 0.66 * H) / (0.12 * H)) ** 2) * (0.6 + 0.4 * norm01(fbm((H, W), (1, 8), 3, seed + 5)))
    img += glow[..., None] * srgb('#ff9a4a')[None, None, :] * 0.55
    # ground
    gnd = (yy > 0.8 * H).astype(np.float64)
    img = img * (1 - gnd[..., None] * 0.5)
    pil = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))
    base = np.asarray(pil, dtype=np.float64) / 255
    # bokeh discs (lantern rows at different depths)
    bok = np.zeros((H, W, 3))
    r = np.random.default_rng(seed)
    cols = [srgb('#ffb259'), srgb('#ff7a3a'), srgb('#ffd08a'), srgb('#ff5a40'), srgb('#fff0c8')]
    rows = [(0.50, 26, 18), (0.55, 34, 22), (0.62, 46, 16), (0.70, 60, 12)]
    for yrow, rad, count in rows:
        for i in range(count * 3):
            cx = r.random() * W
            cy = (yrow + 0.03 * math.sin(cx / W * 2 * math.pi * 2 + yrow * 10) + r.normal(0, 0.012)) * H
            rr = rad * r.uniform(0.75, 1.25)
            c = cols[r.integers(0, len(cols))] * r.uniform(0.5, 1.0)
            x0, x1 = int(max(cx - rr - 3, 0)), int(min(cx + rr + 3, W))
            y0, y1 = int(max(cy - rr - 3, 0)), int(min(cy + rr + 3, H))
            if x1 <= x0 or y1 <= y0:
                continue
            ly, lx = np.mgrid[y0:y1, x0:x1].astype(np.float64)
            d = np.sqrt((lx - cx) ** 2 + (ly - cy) ** 2) / rr
            disc = np.clip((1 - d) * rr * 0.6, 0, 1)
            rim = np.exp(-((d - 0.92) / 0.06) ** 2) * 0.35
            inner = 0.55 + 0.1 * np.sin(lx * 0.3 + ly * 0.2)
            a = (disc * inner + rim * (d < 1.05)) * 0.55
            bok[y0:y1, x0:x1] += a[..., None] * c[None, None, :]
    # tiny string light bulbs (sharper, far)
    for i in range(160):
        cx = r.random() * W; cy = (0.44 + 0.04 * math.sin(cx / W * 12) + r.normal(0, 0.004)) * H
        rr = r.uniform(4, 8)
        x0, x1 = int(max(cx - rr - 2, 0)), int(min(cx + rr + 2, W)); y0, y1 = int(max(cy - rr - 2, 0)), int(min(cy + rr + 2, H))
        ly, lx = np.mgrid[y0:y1, x0:x1].astype(np.float64)
        d = np.sqrt((lx - cx) ** 2 + (ly - cy) ** 2) / rr
        a = np.clip(1 - d, 0, 1) ** 0.7 * 0.6
        bok[y0:y1, x0:x1] += a[..., None] * srgb('#ffe2a8')[None, None, :]
    bokimg = Image.fromarray((np.clip(bok, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    bok = np.asarray(bokimg, dtype=np.float64) / 255
    out = 1 - (1 - base) * (1 - bok)  # screen
    out += (r.random((H, W, 1)) - 0.5) * 0.018  # film grain
    save_rgb(np.clip(out, 0, 1), name + '.jpg', 84)
    print('wrote', name)


# ---------------------------------------------------------------- glass/sugar crystal sparkle normal (small)
def sugar(name='sugar', S=256, seed=47):
    # Voronoi-like facets for sugar heap surface
    r = np.random.default_rng(seed)
    pts = r.random((380, 2)) * S
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float64)
    best = np.full((S, S), 1e9); second = np.full((S, S), 1e9); idx = np.zeros((S, S), int)
    for i, (px, py) in enumerate(pts):
        dx = np.abs(xx - px); dx = np.minimum(dx, S - dx)
        dy = np.abs(yy - py); dy = np.minimum(dy, S - dy)
        d = np.sqrt(dx * dx + dy * dy)
        m = d < best
        second = np.where(m, best, np.minimum(second, d))
        idx = np.where(m, i, idx)
        best = np.where(m, d, best)
    facet = r.random(len(pts))[idx]
    edge = np.clip((second - best) / 3, 0, 1)
    h = facet * 0.6 + edge * 0.6
    alb = np.dstack((0.85 + 0.15 * facet,) * 3) * (0.75 + 0.25 * edge)[..., None]
    rough = 0.08 + 0.3 * (1 - edge)
    save_set(name, alb, h, rough, nstr=6.0)


if __name__ == '__main__':
    import sys
    which = sys.argv[1:] or ['wood', 'wooddark', 'happi', 'tshirt', 'pants', 'canopy', 'steel', 'gravel',
                             'washi', 'skin', 'hair', 'fibre', 'backdrop', 'sugar', 'cloth2', 'cloth3']
    for w in which:
        if w == 'wood': wood('wood', seed=1)
        if w == 'wooddark': wood('wooddark', S=512, planks=2, dark=True, seed=3)
        if w == 'happi': happi()
        if w == 'tshirt': plain_fabric('tshirt', color='#e9c9b4', knit=True, threads=90, seed=13)
        if w == 'pants': plain_fabric('pants', color='#5c6a7c', threads=120, seed=14)
        if w == 'cloth2': plain_fabric('cloth2', color='#c9c2b2', threads=100, seed=15)
        if w == 'cloth3': plain_fabric('cloth3', color='#b9d0d8', threads=90, seed=16, knit=True)
        if w == 'canopy': canopy()
        if w == 'steel': metal()
        if w == 'gravel': gravel()
        if w == 'washi': washi()
        if w == 'skin': skin()
        if w == 'hair': hair()
        if w == 'fibre': fibre()
        if w == 'backdrop': backdrop()
        if w == 'sugar': sugar()
