#!/usr/bin/env python3
"""Procedural photo-style PBR textures (tileable). No text, no people, no logos.
Writes JPG/PNG into assets/tex/.  Each material: albedo (sRGB), normal (OpenGL), and
an 'orm' map (R = AO, G = roughness, B = metalness) like glTF.
"""
import os, numpy as np
from PIL import Image, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'tex')
os.makedirs(OUT, exist_ok=True)
rng = np.random.RandomState(1234)

def vnoise(n, f, seed=0, interp='cubic'):
    """periodic value noise n x n with f cells"""
    r = np.random.RandomState(seed).rand(f, f)
    x = np.arange(n) * f / n
    i = np.floor(x).astype(int); t = x - i
    if interp == 'cubic':
        t = t * t * (3 - 2 * t)
    i0 = i % f; i1 = (i + 1) % f
    a = r[np.ix_(i0, i0)]; b = r[np.ix_(i0, i1)]; c = r[np.ix_(i1, i0)]; d = r[np.ix_(i1, i1)]
    ty = t[:, None]; tx = t[None, :]
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty

def fbm(n, f, oct=5, seed=0, g=0.5):
    s = 0; a = 1; tot = 0
    for o in range(oct):
        s = s + a * vnoise(n, f * 2 ** o, seed + o * 31); tot += a; a *= g
    return s / tot

def worley(n, cells, seed=0):
    r = np.random.RandomState(seed)
    pts = (np.stack(np.meshgrid(np.arange(cells), np.arange(cells), indexing='ij'), -1) + r.rand(cells, cells, 2)) / cells
    pts = pts.reshape(-1, 2)
    yy, xx = np.meshgrid(np.arange(n) / n, np.arange(n) / n, indexing='ij')
    P = np.stack([yy, xx], -1).reshape(-1, 2)
    d1 = np.full(len(P), 9.0); d2 = np.full(len(P), 9.0); idc = np.zeros(len(P), int)
    for k, q in enumerate(pts):
        dd = np.abs(P - q); dd = np.minimum(dd, 1 - dd)
        d = np.sqrt((dd ** 2).sum(1))
        m = d < d1
        d2 = np.where(m, d1, np.minimum(d2, d)); idc = np.where(m, k, idc); d1 = np.where(m, d, d1)
    return d1.reshape(n, n) * cells, d2.reshape(n, n) * cells, idc.reshape(n, n)

def normal_from_height(h, strength):
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5
    nx = -dx * strength; ny = dy * strength; nz = np.ones_like(h)
    l = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
    return np.stack([nx / l, ny / l, nz / l], -1) * 0.5 + 0.5

def save(name, arr, q=88):
    arr = np.clip(arr, 0, 1)
    img = Image.fromarray((arr * 255 + 0.5).astype(np.uint8))
    p = os.path.join(OUT, name)
    if name.endswith('.jpg'):
        img.save(p, quality=q, optimize=True, progressive=True)
    else:
        img.save(p, optimize=True)
    print(name, os.path.getsize(p) // 1024, 'KB')

def lerp(a, b, t):
    return a + (b - a) * t

def srgbmix(cols, t):
    cols = np.asarray(cols, float)
    return cols[0] * (1 - t[..., None]) + cols[1] * t[..., None]

# ------------------------------------------------------------- detail heights
def det_skin(n=256):
    w1, _, _ = worley(n, 40, 3)
    pores = np.clip(1 - w1 * 1.6, 0, 1) ** 3
    h = 0.6 + 0.25 * fbm(n, 16, 4, 4) - 0.5 * pores
    save('det_skin.png', h)

def det_weave(n=256, threads=16, name='det_weave.png', slub=True):
    y, x = np.meshgrid(np.arange(n), np.arange(n), indexing='ij')
    p = n / threads
    u = (x % p) / p; v = (y % p) / p
    cx = (x // p).astype(int); cy = (y // p).astype(int)
    over = ((cx + cy) % 2 == 0)
    warp = np.sin(np.pi * u) ** 0.7  # thread across x (vertical threads)
    weft = np.sin(np.pi * v) ** 0.7
    # along-thread bulge
    wa = 0.5 + 0.5 * np.cos(np.pi * (2 * v - 1)) ; we = 0.5 + 0.5 * np.cos(np.pi * (2 * u - 1))
    hv = warp * (0.55 + 0.45 * np.where(over, 1 - np.abs(2 * v - 1) * 0.6, np.abs(2 * v - 1) * 0.6))
    hw = weft * (0.55 + 0.45 * np.where(~over, 1 - np.abs(2 * u - 1) * 0.6, np.abs(2 * u - 1) * 0.6))
    h = np.maximum(hv, hw)
    if slub:
        h = h * (0.85 + 0.3 * fbm(n, 8, 3, 9)) + 0.08 * fbm(n, 64, 2, 10)
    save(name, h / h.max())
    return h

def det_twill(n=256, threads=24):
    y, x = np.meshgrid(np.arange(n), np.arange(n), indexing='ij')
    p = n / threads
    d = ((x + y) % (p * 3)) / (p * 3)
    h = 0.5 + 0.5 * np.sin(d * np.pi * 2)
    h = h * (0.8 + 0.2 * np.sin(np.pi * ((x % p) / p))) + 0.15 * fbm(n, 32, 3, 12)
    save('det_twill.png', h / h.max())

def det_hair(n=256):
    x = np.arange(n)
    cols = np.zeros((n, n))
    r = np.random.RandomState(5)
    for k in range(260):
        cx = r.rand() * n; w = 0.7 + r.rand() * 1.8; a = 0.3 + 0.7 * r.rand()
        d = np.abs(((x - cx + n / 2) % n) - n / 2)
        cols += a * np.exp(-(d / w) ** 2)[None, :]
    h = cols / cols.max()
    h = h * (0.8 + 0.2 * fbm(n, 4, 2, 6)[:, :])
    save('det_hair.png', h)

def det_rubber(n=256):
    h = 0.5 + 0.5 * fbm(n, 24, 4, 14)
    save('det_rubber.png', h)

# ------------------------------------------------------------- cotton cloth (UV mapped, 1 tile ~ 1cm)
def cloth_cotton(n=512):
    h = det_weave(n, 24, 'cloth_h.png')
    nm = normal_from_height(h, 3.0)
    save('cloth_n.png', nm)

# ------------------------------------------------------------- grass lawn
def grass(n=1024):
    r = np.random.RandomState(21)
    base = fbm(n, 6, 5, 22)
    dry = np.clip((fbm(n, 4, 4, 23) - 0.52) * 4, 0, 1)
    col = np.zeros((n, n, 3)); hgt = np.zeros((n, n)) + 0.2
    g1 = np.array([0.20, 0.30, 0.09]); g2 = np.array([0.33, 0.42, 0.14]); dr = np.array([0.55, 0.5, 0.28])
    soil = np.array([0.24, 0.19, 0.13])
    col[:] = soil * (0.8 + 0.4 * fbm(n, 32, 3, 24))[..., None]
    # thousands of blades drawn as short strokes
    img_h = np.zeros((n, n)); img_c = np.zeros((n, n, 3)); cnt = 90000
    xs = r.rand(cnt) * n; ys = r.rand(cnt) * n
    ang = r.rand(cnt) * np.pi; ln = 5 + r.rand(cnt) * 14
    shade = r.rand(cnt)
    for k in range(cnt):
        L = int(ln[k]); x0, y0 = xs[k], ys[k]
        dx, dy = np.cos(ang[k]), np.sin(ang[k])
        t = np.arange(L)
        px = (x0 + dx * t).astype(int) % n; py = (y0 + dy * t).astype(int) % n
        hv = shade[k] * 0.6 + 0.4 * (t / L)
        dd = dry[int(y0) % n, int(x0) % n]
        c = lerp(lerp(g1, g2, shade[k]), dr, dd * (0.5 + 0.5 * r.rand()))
        upd = hv > img_h[py, px]
        img_h[py[upd], px[upd]] = hv[upd]
        img_c[py[upd], px[upd]] = c * (0.7 + 0.5 * (t[upd] / L))[:, None]
    m = img_h > 0
    col[m] = img_c[m]
    hgt = np.where(m, 0.3 + img_h * 0.7, 0.1)
    col *= (0.85 + 0.3 * base)[..., None]
    ao = np.clip(0.55 + 0.6 * hgt, 0, 1)
    col *= ao[..., None]
    save('grass_a.jpg', col)
    hb = np.asarray(Image.fromarray((hgt * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))) / 255.0
    save('grass_n.jpg', normal_from_height(hb, 4.0))
    orm = np.stack([ao, np.clip(0.75 + 0.2 * (1 - hgt), 0, 1), np.zeros_like(ao)], -1)
    save('grass_orm.jpg', orm)

# ------------------------------------------------------------- patio pavers (sandy concrete)
def pavers(n=1024, tiles=2):
    y, x = np.meshgrid(np.arange(n), np.arange(n), indexing='ij')
    p = n / tiles
    u = (x % p) / p; v = (y % p) / p
    tid = (x // p).astype(int) * 7 + (y // p).astype(int) * 13
    edge = np.minimum(np.minimum(u, 1 - u), np.minimum(v, 1 - v)) * p
    joint = np.clip(1 - edge / 9.0, 0, 1)
    bevel = np.clip(edge / 14.0, 0, 1)
    grain = fbm(n, 128, 3, 31)
    sand = (np.random.RandomState(32).rand(n, n) ** 6)
    mott = fbm(n, 8, 5, 33)
    h = bevel * 0.8 + 0.12 * grain + 0.1 * sand - 0.06 * (fbm(n, 24, 3, 34) > 0.62)
    base = np.array([0.6, 0.57, 0.52])
    tint = np.array([[0.62, 0.58, 0.53], [0.56, 0.54, 0.5], [0.64, 0.6, 0.55], [0.58, 0.55, 0.49]])[tid % 4]
    col = tint * (0.82 + 0.3 * mott[..., None]) * (0.9 + 0.12 * grain[..., None])
    col = col * (1 - 0.2 * sand[..., None]) + np.array([0.3, 0.28, 0.24]) * 0.2 * sand[..., None] * 0
    col = col * (1 - joint[..., None] * 0.55) + np.array([0.33, 0.3, 0.25]) * joint[..., None] * 0.55
    lichen = np.clip((fbm(n, 16, 4, 35) - 0.66) * 6, 0, 1) * (1 - joint)
    col = col * (1 - 0.3 * lichen[..., None]) + np.array([0.45, 0.47, 0.38]) * 0.3 * lichen[..., None]
    ao = np.clip(0.45 + 0.55 * bevel, 0, 1) * (0.9 + 0.1 * grain)
    save('paver_a.jpg', col * (0.75 + 0.25 * ao[..., None]))
    save('paver_n.jpg', normal_from_height(h, 6.0))
    save('paver_orm.jpg', np.stack([ao, np.clip(0.82 + 0.15 * grain - 0.1 * bevel * 0, 0, 1), np.zeros_like(ao)], -1))

# ------------------------------------------------------------- weathered wood (planks along x)
def wood(n=1024, planks=4, name='wood', tone=(0.52, 0.38, 0.25), grey=0.35):
    y, x = np.meshgrid(np.arange(n), np.arange(n), indexing='ij')
    p = n / planks
    pid = (y // p).astype(int)
    v = (y % p) / p
    off = np.random.RandomState(41).rand(planks + 1)[pid] * n
    xx = (x + off) % n
    warp = fbm(n, 4, 4, 42) * 40
    rings = np.sin((v * p * 0.5 + warp + 6 * np.sin(xx / n * 2 * np.pi * 2 + pid)) * 0.55)
    fine = vnoise(n, 256, 43) * 0
    streak = fbm(n, 64, 3, 44)
    # stretched grain: noise squashed in x
    g = np.zeros((n, n))
    for o, f in enumerate([8, 16, 48, 128]):
        r = np.random.RandomState(50 + o).rand(f * 4, f)  # rows high-res, cols low-res
        rows = (np.arange(n) * f * 4 / n).astype(int)
        cols = np.arange(n) * f / n
        c0 = np.floor(cols).astype(int); t = cols - c0
        a = r[rows][:, c0 % f]; b = r[rows][:, (c0 + 1) % f]
        g += (a * (1 - t) + b * t) / (o + 1.5)
    g = (g - g.min()) / (g.max() - g.min())
    gap = np.clip(1 - np.minimum(v, 1 - v) * p / 4.0, 0, 1)
    knots = np.zeros((n, n))
    r = np.random.RandomState(45)
    for k in range(6):
        kx, ky = r.rand() * n, r.rand() * n
        d = np.sqrt(np.minimum(np.abs(x - kx), n - np.abs(x - kx)) ** 2 * 0.25 + np.minimum(np.abs(y - ky), n - np.abs(y - ky)) ** 2)
        knots += np.exp(-(d / (8 + 8 * r.rand())) ** 2)
    tone = np.array(tone); greyc = np.array([0.55, 0.53, 0.5])
    col = tone * (0.75 + 0.35 * g[..., None]) * (0.9 + 0.1 * rings[..., None])
    weather = np.clip(grey + 0.4 * (fbm(n, 6, 4, 46) - 0.5), 0, 1)
    col = col * (1 - weather[..., None]) + greyc * (0.7 + 0.4 * g[..., None]) * weather[..., None]
    col = col * (1 - 0.5 * knots[..., None]) + np.array([0.25, 0.16, 0.1]) * 0.5 * knots[..., None]
    col = col * (1 - 0.7 * gap[..., None])
    h = 0.6 + 0.3 * g - 0.25 * (g < 0.3) * weather + 0.1 * rings * 0.3 - 0.8 * gap - 0.2 * knots
    ao = np.clip(1 - 0.8 * gap, 0, 1)
    save(name + '_a.jpg', col)
    save(name + '_n.jpg', normal_from_height(h, 5.0))
    save(name + '_orm.jpg', np.stack([ao, np.clip(0.7 + 0.2 * weather - 0.15 * g, 0, 1), np.zeros_like(ao)], -1))

# ------------------------------------------------------------- galvanized steel (spangle + scratches + dents)
def galvanized(n=1024):
    d1, d2, idc = worley(n, 18, 61)
    spang = np.random.RandomState(62).rand(idc.max() + 1)[idc]
    edges = np.clip(1 - (d2 - d1) * 8, 0, 1)
    base = 0.64 + 0.06 * spang - 0.03 * edges
    mott = fbm(n, 6, 4, 63)
    col = np.stack([base, base * 1.0, base * 1.02], -1) * (0.85 + 0.25 * mott[..., None])
    # white rust / oxide spots
    ox = np.clip((fbm(n, 12, 4, 64) - 0.6) * 4, 0, 1)
    col = col * (1 - 0.35 * ox[..., None]) + np.array([0.8, 0.8, 0.76]) * 0.35 * ox[..., None]
    rough = 0.32 + 0.25 * spang * 0.5 + 0.35 * ox + 0.1 * mott
    h = 0.5 + 0.05 * spang + 0.3 * fbm(n, 3, 3, 65)
    # scratches
    r = np.random.RandomState(66)
    sc = np.zeros((n, n))
    for k in range(240):
        x0, y0 = r.rand() * n, r.rand() * n; a = (r.rand() - 0.5) * 0.6 + (np.pi / 2 if r.rand() < 0.3 else 0)
        L = 30 + r.rand() * 220; t = np.linspace(0, L, int(L))
        px = ((x0 + np.cos(a) * t) % n).astype(int); py = ((y0 + np.sin(a) * t) % n).astype(int)
        sc[py, px] = np.maximum(sc[py, px], 0.4 + 0.6 * r.rand())
    sc = np.asarray(Image.fromarray((sc * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.5))) / 255.0
    col = col + 0.18 * sc[..., None]
    rough = rough - 0.15 * sc
    h = h - 0.2 * sc
    save('galv_a.jpg', col)
    save('galv_n.jpg', normal_from_height(h, 3.0))
    save('galv_orm.jpg', np.stack([np.ones_like(h), np.clip(rough, 0.15, 1), np.full_like(h, 0.9)], -1))

# ------------------------------------------------------------- painted clapboard siding (house)
def siding(n=1024, boards=6):
    y, x = np.meshgrid(np.arange(n), np.arange(n), indexing='ij')
    p = n / boards
    v = (y % p) / p
    lap = v  # board slopes outward downward
    shadow = np.clip((v - 0.9) / 0.1, 0, 1)
    paint = np.array([0.86, 0.84, 0.78])
    g = fbm(n, 64, 3, 71)
    grain = np.asarray(Image.fromarray((np.random.RandomState(72).rand(n // 8, n) * 255).astype(np.uint8)).resize((n, n), Image.BILINEAR)) / 255.0
    col = paint * (0.92 + 0.06 * grain[..., None] + 0.05 * g[..., None])
    dirt = np.clip(fbm(n, 4, 4, 73) - 0.45, 0, 1)
    col = col * (1 - 0.2 * dirt[..., None])
    col = col * (1 - 0.55 * shadow[..., None])
    h = lap * 0.8 + 0.05 * grain
    save('siding_a.jpg', col)
    save('siding_n.jpg', normal_from_height(h, 2.5))
    save('siding_orm.jpg', np.stack([1 - 0.6 * shadow, np.full_like(h, 0.6) + 0.1 * g, np.zeros_like(h)], -1))

# ------------------------------------------------------------- twine / rope
def twine(n=256):
    y, x = np.meshgrid(np.arange(n), np.arange(n), indexing='ij')
    ply = ((x / n * 3 + y / n * 6) % 1.0)
    h = np.sin(ply * np.pi) ** 0.8
    fib = np.asarray(Image.fromarray((np.random.RandomState(81).rand(n, n // 8) * 255).astype(np.uint8)).resize((n, n), Image.BILINEAR).rotate(30)) / 255.0
    h = h * (0.8 + 0.2 * fib)
    col = np.array([0.78, 0.68, 0.5]) * (0.65 + 0.4 * h[..., None])
    save('twine_a.jpg', col)
    save('twine_n.jpg', normal_from_height(h, 4.0))

# ------------------------------------------------------------- leaves (RGBA cluster for hedges/trees)
def leaves(n=512, name='leaves', hue=(0.24, 0.34, 0.12), count=420, size=(14, 34), seed=91):
    r = np.random.RandomState(seed)
    rgba = np.zeros((n, n, 4))
    y, x = np.meshgrid(np.arange(n), np.arange(n), indexing='ij')
    for k in range(count):
        cx, cy = r.rand() * n, r.rand() * n
        rad = np.hypot(cx - n / 2, cy - n / 2) / (n / 2)
        if rad > 0.98 and r.rand() < 0.8:
            continue
        L = r.uniform(*size); W = L * r.uniform(0.35, 0.5); a = r.rand() * np.pi * 2
        x0, x1 = int(max(cx - L, 0)), int(min(cx + L, n)); y0, y1 = int(max(cy - L, 0)), int(min(cy + L, n))
        if x1 <= x0 or y1 <= y0:
            continue
        xx = x[y0:y1, x0:x1] - cx; yy = y[y0:y1, x0:x1] - cy
        u = xx * np.cos(a) + yy * np.sin(a); v = -xx * np.sin(a) + yy * np.cos(a)
        t = (u / L + 1) / 2
        inside = (np.abs(v) < W * np.sin(np.clip(t, 0, 1) * np.pi) ** 0.8) & (np.abs(u) < L)
        shade = 0.55 + 0.45 * r.rand()
        light = 0.75 + 0.25 * (v / W) + 0.15 * np.cos(u / L * 3)
        vein = np.exp(-(v / 1.2) ** 2) * 0.15
        c = np.array(hue) * shade * (1 + 0.4 * (r.rand() - 0.5))
        if r.rand() < 0.1:
            c = c * 0.6 + np.array([0.45, 0.4, 0.15]) * 0.4
        cc = c[None, None, :] * (light + vein)[..., None]
        sub = rgba[y0:y1, x0:x1]
        sub[inside, :3] = cc[inside]
        sub[inside, 3] = 1
    # depth darkening toward centre
    rr = np.hypot(x - n / 2, y - n / 2) / (n / 2)
    rgba[..., :3] *= (0.55 + 0.45 * np.clip(rr, 0, 1))[..., None]
    img = Image.fromarray((np.clip(rgba, 0, 1) * 255).astype(np.uint8), 'RGBA')
    p = os.path.join(OUT, name + '.png'); img.save(p, optimize=True)
    print(name, os.path.getsize(p) // 1024, 'KB')

# ------------------------------------------------------------- string clothespin wood / plastic tub? (galv used)

if __name__ == '__main__':
    import sys
    which = sys.argv[1:] or ['det', 'cloth', 'grass', 'pavers', 'wood', 'galv', 'siding', 'twine', 'leaves']
    if 'det' in which:
        det_skin(); det_weave(); det_twill(); det_hair(); det_rubber(); det_weave(256, 10, 'det_canvas.png')
    if 'cloth' in which: cloth_cotton()
    if 'grass' in which: grass()
    if 'pavers' in which: pavers()
    if 'wood' in which:
        wood(); wood(1024, 6, 'fence', tone=(0.5, 0.36, 0.24), grey=0.55)
    if 'galv' in which: galvanized()
    if 'siding' in which: siding()
    if 'twine' in which: twine()
    if 'leaves' in which:
        leaves(); leaves(512, 'leaves2', hue=(0.2, 0.3, 0.1), count=520, size=(10, 22), seed=92)
