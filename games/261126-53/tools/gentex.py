# -*- coding: utf-8 -*-
"""Offline generator for the photo-like PBR textures of 261126-53.
All maps are seamless (spectral / periodic noise). Output: ../tex/*.jpg
  *_c.jpg  base color (sRGB)
  *_n.jpg  tangent-space normal (OpenGL, +Y up)
  *_orm.jpg R=AO G=roughness B=metalness
Run: python3 gentex.py
"""
import os, numpy as np
from PIL import Image
from scipy.spatial import cKDTree

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tex')
os.makedirs(OUT, exist_ok=True)
R = np.random.default_rng(53)


def fnoise(n, beta=2.0, fmin=1.0, fmax=None, seed=None, aniso=(1.0, 1.0)):
    rng = np.random.default_rng(seed) if seed is not None else R
    w = rng.standard_normal((n, n))
    F = np.fft.fft2(w)
    fy = np.fft.fftfreq(n) * n
    fx = np.fft.fftfreq(n) * n
    FX, FY = np.meshgrid(fx, fy)
    f = np.sqrt((FX * aniso[0]) ** 2 + (FY * aniso[1]) ** 2)
    f[0, 0] = 1
    amp = 1.0 / f ** (beta / 2)
    amp[f < fmin] = 0
    if fmax is not None:
        amp *= np.exp(-(f / fmax) ** 2)
    amp[0, 0] = 0
    out = np.real(np.fft.ifft2(F * amp))
    out -= out.mean()
    out /= (out.std() + 1e-9)
    return out  # zero mean, unit std


def norm01(a):
    a = a - a.min()
    return a / (a.max() + 1e-9)


def blur(a, sigma):
    n = a.shape[0]
    f = np.fft.fftfreq(n)
    FX, FY = np.meshgrid(f, f)
    g = np.exp(-2 * (np.pi * sigma) ** 2 * (FX ** 2 + FY ** 2))
    if a.ndim == 3:
        return np.stack([np.real(np.fft.ifft2(np.fft.fft2(a[..., i]) * g)) for i in range(a.shape[2])], -1)
    return np.real(np.fft.ifft2(np.fft.fft2(a) * g))


def voronoi(n, count, seed=1, jitter=1.0):
    rng = np.random.default_rng(seed)
    pts = rng.random((count, 2))
    tree = cKDTree(pts, boxsize=1.0)
    ys, xs = np.mgrid[0:n, 0:n]
    q = np.stack([(xs.ravel() + .5) / n, (ys.ravel() + .5) / n], -1)
    d, idx = tree.query(q, k=2)
    d1 = d[:, 0].reshape(n, n)
    d2 = d[:, 1].reshape(n, n)
    idx = idx[:, 0].reshape(n, n)
    return d1, d2, idx, rng.random(count)


def normal_from_h(h, strength):
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5 * strength
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5 * strength
    nx, ny, nz = -dx, dy, np.ones_like(h)  # image y down -> GL +Y up
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    return np.stack([nx / l, ny / l, nz / l], -1)


def ao_from_h(h, radius=6, k=1.0):
    loc = h - blur(h, radius)
    return np.clip(1 + loc * k, 0, 1)


def save(name, rgb, q=88):
    arr = np.clip(rgb * 255 + .5, 0, 255).astype(np.uint8)
    Image.fromarray(arr).save(os.path.join(OUT, name), quality=q, subsampling=2)
    print('wrote', name, arr.shape)


def save_set(prefix, col, h, strength, rough, ao=None, metal=None, q=86):
    save(prefix + '_c.jpg', np.clip(col, 0, 1), q)
    nm = normal_from_h(h, strength)
    save(prefix + '_n.jpg', nm * .5 + .5, 80)
    if ao is None:
        ao = np.ones_like(h)
    if metal is None:
        metal = np.zeros_like(h)
    save(prefix + '_orm.jpg', np.stack([ao, np.clip(rough, 0, 1), metal], -1), q)


def lerp3(a, b, t):
    a = np.array(a, float) / 255
    b = np.array(b, float) / 255
    return a + (b - a) * t[..., None]


def srgb(c):
    return np.array(c, float) / 255


# ---------------------------------------------------------------- sand
def sand():
    n = 1024
    low = fnoise(n, 3.2, seed=11)
    mid = fnoise(n, 2.2, fmin=6, seed=12)
    grain = fnoise(n, 0.3, fmin=150, seed=13)          # sub-mm grains
    grain2 = fnoise(n, 0.8, fmin=60, fmax=300, seed=14)
    # pebbles
    d1, d2, idx, rv = voronoi(n, 260, seed=15)
    peb_r = (0.004 + rv[idx] ** 3 * 0.010)
    keep = rv[idx] > 0.35
    peb = np.clip(1 - d1 / peb_r, 0, 1) * keep
    peb = np.sqrt(peb)
    # wind ripples (gentle, slightly wavy)
    ys, xs = np.mgrid[0:n, 0:n] / n
    warp = fnoise(n, 3.0, seed=16) * 0.035
    rip = np.sin((ys * 9 + xs * 2 + warp) * 2 * np.pi)
    rip = np.sign(rip) * np.abs(rip) ** 0.7
    h = low * 0.6 + mid * 0.35 + grain * 0.10 + grain2 * 0.12 + rip * 0.18 + peb * 1.6
    base = lerp3((214, 176, 122), (186, 140, 88), norm01(low * 0.8 + mid * 0.5))
    # mineral speckle: quartz light, iron red, dark lithics
    sp = R.random((n, n))
    col = base * (1 + grain * 0.07 + grain2 * 0.05)[..., None]
    col = np.where((sp > 0.985)[..., None], col * 0.55 + srgb((60, 45, 35)) * 0.45, col)
    col = np.where((sp < 0.006)[..., None], col * 0.8 + srgb((242, 232, 210)) * 0.2, col)
    col = np.where(((sp > 0.5) & (sp < 0.53))[..., None], col * 0.7 + srgb((170, 88, 52)) * 0.3, col)
    col = blur(col, 0.6)
    pc = lerp3((150, 120, 92), (205, 186, 160), rv[idx])
    pm = (peb > 0)[..., None] * np.clip(peb * 3, 0, 1)[..., None]
    col = col * (1 - pm) + (pc * (0.8 + 0.2 * peb[..., None])) * pm
    ao = ao_from_h(h, 8, 0.25) * (1 - 0.25 * np.clip((1 - peb) * (d1 < peb_r * 1.35) * keep, 0, 1))
    rough = 0.93 - pm[..., 0] * 0.25 + grain * 0.02
    save_set('sand', col, h, 2.2, rough, ao)


# ------------------------------------------------- packed pit floor (hardpan)
def hardpan():
    n = 1024
    low = fnoise(n, 3.0, seed=21)
    grain = fnoise(n, 0.5, fmin=100, seed=22)
    d1, d2, idx, rv = voronoi(n, 70, seed=23)
    crack = np.clip(1 - (d2 - d1) / 0.006, 0, 1) ** 2
    wob = fnoise(n, 2.5, seed=24)
    crack *= (wob > -0.6)
    h = low * 0.5 + grain * 0.15 - crack * 1.2 + (rv[idx] - .5) * 0.25
    col = lerp3((176, 128, 84), (150, 102, 66), norm01(low + rv[idx] * 0.6))
    col *= (1 + grain * 0.05)[..., None]
    col *= (1 - crack * 0.45)[..., None]
    rough = 0.9 + grain * 0.03
    ao = np.clip(1 - crack * 0.6, 0, 1) * ao_from_h(h, 6, 0.2)
    save_set('hardpan', col, h, 3.0, rough, ao)


# ---------------------------------------------------------------- sandstone rock
def rock():
    n = 1024
    ys, xs = np.mgrid[0:n, 0:n] / n
    warp = fnoise(n, 3.0, seed=31) * 0.05
    strata = np.sin((ys * 14 + warp * 6) * 2 * np.pi) * 0.5 + fnoise(n, 1.5, fmin=8, aniso=(0.15, 1), seed=32) * 0.6
    low = fnoise(n, 2.8, seed=33)
    pits = fnoise(n, 0.6, fmin=80, seed=34)
    pits = np.clip(pits - 1.6, 0, 9)
    grain = fnoise(n, 0.4, fmin=150, seed=35)
    h = low * 0.9 + strata * 0.3 + grain * 0.12 - pits * 0.8
    t = norm01(strata * 0.6 + low * 0.5)
    col = lerp3((200, 172, 138), (150, 118, 88), t)
    col = col * (1 + grain * 0.06)[..., None] * (1 - np.clip(pits, 0, 1) * 0.35)[..., None]
    lich = np.clip(fnoise(n, 2.4, seed=36) - 1.7, 0, 1)
    col = col * (1 - lich[..., None] * 0.5) + srgb((110, 104, 92)) * lich[..., None] * 0.5
    iron = np.clip(fnoise(n, 2.2, seed=37) - 0.8, 0, 1)
    col = col * (1 - iron[..., None] * 0.35) + srgb((168, 96, 58)) * iron[..., None] * 0.35
    rough = 0.88 + grain * 0.03
    ao = ao_from_h(h, 10, 0.3)
    save_set('rock', col, h, 3.5, rough, ao)


# ---------------------------------------------------------------- fossil bone
def bone():
    n = 1024
    low = fnoise(n, 3.0, seed=41)
    mid = fnoise(n, 2.0, fmin=5, seed=42)
    # long fibrous grain along U (bone axis)
    fib = fnoise(n, 1.6, fmin=4, aniso=(0.08, 1.0), seed=43)
    pores = np.clip(fnoise(n, 0.4, fmin=200, seed=44) - 2.2, 0, 2)
    d1, d2, idx, rv = voronoi(n, 40, seed=45)
    crack = np.clip(1 - (d2 - d1) / 0.0035, 0, 1) ** 3 * (fnoise(n, 2.5, seed=46) > 0.3)
    stain = norm01(low * 0.8 + mid * 0.45 + fib * 0.15)
    ivory = srgb((236, 222, 196))
    tea = srgb((176, 128, 82))
    dark = srgb((112, 78, 50))
    st = np.clip((stain - 0.35) * 1.8, 0, 1)
    col = ivory * (1 - st[..., None]) + tea * st[..., None]
    deep = np.clip((stain - 0.8) * 4, 0, 1)
    col = col * (1 - deep[..., None] * 0.5) + dark * deep[..., None] * 0.5
    col *= (1 + fib * 0.035)[..., None]
    col = col * (1 - crack[..., None] * 0.55) + dark * crack[..., None] * 0.55 * 0.6
    col *= (1 - pores * 0.25)[..., None]
    h = fib * 0.25 + mid * 0.3 - crack * 1.0 - pores * 0.5
    rough = 0.55 + st * 0.25 + crack * 0.2 + pores * 0.1
    ao = np.clip(1 - crack * 0.5 - pores * 0.2, 0, 1)
    save_set('bone', col, h, 2.2, rough, ao)


# ---------------------------------------------------------------- wood planks
def wood():
    n = 1024
    ys, xs = np.mgrid[0:n, 0:n] / n
    warp = fnoise(n, 2.6, aniso=(1, 0.2), seed=51) * 0.03
    rings = np.sin((ys * 46 + warp * 30 + fnoise(n, 3, seed=52) * 0.4) * 2 * np.pi)
    fibers = fnoise(n, 1.0, fmin=30, aniso=(0.03, 1.0), seed=53)
    # 4 planks across Y
    plank = np.floor(ys * 4)
    seam = np.abs(((ys * 4) % 1) - 0.0)
    seam = np.minimum(seam, 1 - ((ys * 4) % 1))
    gap = np.clip(1 - seam / 0.006, 0, 1)
    tone = np.array([0.0, 0.12, -0.08, 0.05])[plank.astype(int) % 4]
    t = norm01(rings * 0.5 + fibers * 0.4) * 0.8 + tone[..., ...] if False else norm01(rings * 0.5 + fibers * 0.4)
    col = lerp3((182, 140, 98), (128, 88, 56), t * 0.8)
    col *= (1 + tone)[..., None]
    knots_d, _, kidx, krv = voronoi(n, 9, seed=54)
    knot = np.clip(1 - knots_d / 0.012, 0, 1) * (krv[kidx] > 0.4)
    col = col * (1 - knot[..., None] * 0.3)
    weather = norm01(fnoise(n, 2.5, seed=55))
    col = col * (1 - weather[..., None] * 0.18) + srgb((170, 160, 145)) * weather[..., None] * 0.18
    col *= (1 - gap * 0.7)[..., None]
    h = rings * 0.15 + fibers * 0.35 - gap * 2.0 + knot * 0.3
    rough = 0.72 + fibers * 0.04 + weather * 0.1
    ao = np.clip(1 - gap * 0.8, 0, 1)
    save_set('wood', col, h, 2.5, rough, ao)


# ---------------------------------------------------------------- woven cloth
def weave(name, c0, c1, threads=96, rough_base=0.86, n=512, dirt=0.25, seed=60):
    ys, xs = np.mgrid[0:n, 0:n] / n
    u = xs * threads
    v = ys * threads
    fu = u % 1
    fv = v % 1
    iu = np.floor(u).astype(int)
    iv = np.floor(v).astype(int)
    over = ((iu + iv) % 2 == 0)
    # warp threads (along v) and weft (along u)
    warp_h = np.sin(fu * np.pi) * (0.6 + 0.4 * np.sin(fv * np.pi * 2 + iu))
    weft_h = np.sin(fv * np.pi) * (0.6 + 0.4 * np.sin(fu * np.pi * 2 + iv))
    h = np.where(over, warp_h + 0.25, weft_h + 0.25)
    slub = fnoise(n, 1.0, fmin=threads * 0.6, aniso=(1, 0.05), seed=seed)
    h += slub * 0.08
    low = fnoise(n, 3.0, seed=seed + 1)
    wr = fnoise(n, 2.2, fmin=2, aniso=(0.35, 1), seed=seed + 2)  # soft wrinkles
    col = lerp3(c0, c1, norm01(low))
    col *= (0.82 + 0.18 * h)[..., None]
    col *= (1 + slub * 0.04)[..., None]
    dd = np.clip(fnoise(n, 2.6, seed=seed + 3) * dirt, -0.2, 0.3)
    col = col * (1 - np.clip(dd, 0, 1)[..., None]) + srgb((140, 110, 80)) * np.clip(dd, 0, 1)[..., None]
    hh = h * 0.6 + wr * 1.2
    rough = rough_base + (1 - h) * 0.06
    ao = 0.78 + 0.22 * np.clip(h, 0, 1)
    save_set(name, col, hh, 1.6, rough, ao)


# ---------------------------------------------------------------- skin detail
def skin():
    n = 512
    pores = fnoise(n, 0.5, fmin=60, seed=71)
    fine = fnoise(n, 1.5, fmin=10, seed=72)
    h = -np.clip(pores - 1.2, 0, 3) * 0.5 + fine * 0.15
    col = np.ones((n, n, 3)) * (1 + fine[..., None] * 0.02)
    col[..., 0] *= 1 + np.clip(fnoise(n, 2.5, seed=73), -1, 1) * 0.02
    rough = 0.55 + fine * 0.03 + np.clip(pores - 1.2, 0, 1) * 0.1
    save_set('skin', col * 0.98, h, 1.2, rough, np.ones_like(h))


# ---------------------------------------------------------------- hair strands
def hair():
    n = 512
    ys, xs = np.mgrid[0:n, 0:n] / n
    s = fnoise(n, 1.0, fmin=20, aniso=(1.0, 0.02), seed=81)  # strands along V
    s2 = fnoise(n, 1.4, fmin=6, aniso=(1.0, 0.04), seed=82)
    h = s * 0.5 + s2 * 0.6
    t = norm01(s2 * 0.7 + s * 0.4)
    col = lerp3((52, 34, 22), (104, 70, 44), t)
    rough = 0.45 + norm01(s) * 0.15
    save_set('hair', col, h, 2.0, rough, 0.7 + 0.3 * norm01(h))


# ---------------------------------------------------------------- dinosaur skin
def dino():
    n = 1024
    d1, d2, idx, rv = voronoi(n, 2600, seed=91)
    edge = np.clip((d2 - d1) / 0.006, 0, 1)
    dome = np.sqrt(np.clip(edge, 0, 1))
    big_d1, big_d2, bidx, brv = voronoi(n, 160, seed=92)
    big = np.sqrt(np.clip((big_d2 - big_d1) / 0.02, 0, 1))
    low = fnoise(n, 3.0, seed=93)
    h = dome * 0.6 + big * 0.5 + low * 0.2
    t = norm01(low + rv[idx] * 0.4)
    # pattern intensity stored as greyscale variation; actual hue set in shader tint
    col = np.stack([0.75 + 0.25 * t] * 3, -1) * (0.75 + 0.25 * dome[..., None])
    col *= (0.85 + 0.15 * big[..., None])
    rough = 0.62 - dome * 0.12 + (1 - edge) * 0.15
    ao = 0.55 + 0.45 * dome
    save_set('dino', col, h, 4.0, rough, ao)


# ---------------------------------------------------------------- brushed metal
def metal():
    n = 512
    br = fnoise(n, 0.8, fmin=20, aniso=(1.0, 0.01), seed=101)
    scr = np.zeros((n, n))
    rng = np.random.default_rng(102)
    for _ in range(140):
        x0, y0 = rng.random(2) * n
        ang = rng.random() * np.pi
        L = rng.random() * 90 + 10
        for t in np.linspace(0, 1, int(L)):
            x = int(x0 + np.cos(ang) * L * t) % n
            y = int(y0 + np.sin(ang) * L * t) % n
            scr[y, x] = 1
    scr = blur(scr, 0.7)
    scr = np.clip(scr * 3, 0, 1)
    low = fnoise(n, 3, seed=103)
    col = np.stack([0.55 + br * 0.03 + low * 0.04] * 3, -1)
    col = col * (1 - scr[..., None] * 0.15)
    rough = 0.32 + br * 0.04 + scr * 0.25 + np.clip(low, 0, 1) * 0.12
    save_set('metal', col, br * 0.2 - scr * 0.6, 1.0, rough, np.ones_like(br), np.ones_like(br) * 0.95)


if __name__ == '__main__':
    sand(); hardpan(); rock(); bone(); wood()
    weave('canvas', (176, 152, 110), (150, 126, 88), threads=55, seed=61)     # hat & vest khaki
    weave('cotton', (238, 236, 230), (214, 210, 200), threads=110, rough_base=0.9, dirt=0.06, seed=62)  # T-shirt / girl
    weave('denim', (70, 92, 124), (54, 72, 102), threads=90, seed=63)
    weave('tarp', (64, 96, 118), (52, 82, 102), threads=30, rough_base=0.7, dirt=0.4, seed=64)
    skin(); hair(); dino(); metal()
