#!/usr/bin/env python3
"""Procedural photo-like PBR textures for 261126-51 (weathered shed painting).
Run:  python3 -I games/261126-51/tools/gen_textures.py games/261126-51/tex
Outputs JPG (albedo / normal / orm) — all tileable. ORM: R=AO, G=roughness, B=height.
No text, people or logos."""
import sys, os
import numpy as np
from scipy import ndimage as nd
from PIL import Image, ImageFilter

OUT = sys.argv[1] if len(sys.argv) > 1 else 'tex'
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(261126)


def noise(h, w, sigma, sy=None):
    """tileable smooth noise in [-1,1] approx."""
    n = rng.standard_normal((h, w)).astype(np.float32)
    n = nd.gaussian_filter(n, (sy if sy is not None else sigma, sigma), mode='wrap')
    n /= (np.abs(n).max() + 1e-6)
    return n


def fbm(h, w, base, octaves=5, aniso=1.0, gain=0.5):
    out = np.zeros((h, w), np.float32)
    amp, s, tot = 1.0, base, 0.0
    for _ in range(octaves):
        out += amp * noise(h, w, max(s, 0.5), max(s * aniso, 0.5))
        tot += amp
        amp *= gain
        s /= 2
    return out / tot


def normal_from_height(hgt, strength):
    gy, gx = np.gradient(hgt)
    # wrap-aware gradient
    gx = (np.roll(hgt, -1, 1) - np.roll(hgt, 1, 1)) * 0.5
    gy = (np.roll(hgt, -1, 0) - np.roll(hgt, 1, 0)) * 0.5
    nx = -gx * strength
    ny = gy * strength  # OpenGL convention (green up) with image rows going down
    nz = np.ones_like(hgt)
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    n = np.stack([nx / l, ny / l, nz / l], -1)
    return ((n * 0.5 + 0.5) * 255).clip(0, 255).astype(np.uint8)


def ao_from_height(hgt, sigma, k):
    blur = nd.gaussian_filter(hgt, sigma, mode='wrap')
    ao = 1.0 - np.clip((blur - hgt) * k, 0, 1)
    return ao


def save(name, arr, q=90):
    if arr.dtype != np.uint8:
        arr = (np.clip(arr, 0, 1) * 255 + 0.5).astype(np.uint8)
    Image.fromarray(arr).save(os.path.join(OUT, name), quality=q, optimize=True)
    print('wrote', name, arr.shape)


def srgb(lin):
    lin = np.clip(lin, 0, 1)
    return np.where(lin <= 0.0031308, lin * 12.92, 1.055 * np.power(lin, 1 / 2.4) - 0.055)


def mix(a, b, t):
    t = t[..., None] if np.ndim(t) == 2 else t
    return a * (1 - t) + b * t


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


# ---------------------------------------------------------------- weathered wood (vertical grain)
def wood():
    H, W = 2048, 512        # ~1.1m x 0.28m
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    warp = fbm(H, W, 90, 4, aniso=6) * 14 + fbm(H, W, 20, 3, aniso=4) * 2.5
    # knots: radial swirl of grain lines
    knot = np.zeros((H, W), np.float32)
    knot_dark = np.zeros((H, W), np.float32)
    for _ in range(5):
        cx, cy = rng.uniform(0, W), rng.uniform(0, H)
        rx = rng.uniform(9, 22)
        dx = (xx - cx + W / 2) % W - W / 2
        dy = (yy - cy + H / 2) % H - H / 2
        d = np.sqrt((dx / rx) ** 2 + (dy / (rx * 2.6)) ** 2)
        knot += np.sign(dx) * 26 * np.exp(-d * d * 0.35) * np.clip(1.4 - np.abs(dy) / (rx * 6), 0, 1)
        knot_dark += np.exp(-(d * 1.1) ** 2)
    cycles = 30
    phase = (xx + warp + knot) * cycles / W + fbm(H, W, 40, 3, aniso=10) * 2.2 + fbm(H, W, 12, 2, aniso=8) * 0.35
    f = phase - np.floor(phase)
    ring = np.floor(phase).astype(np.int64)
    rr = ((ring * 2654435761) % 1000) / 1000.0          # per-ring random
    rr2 = ((ring * 40503 + 977) % 1000) / 1000.0
    lw = 0.12 + 0.22 * rr                                 # latewood width varies per ring
    # latewood ridge: hard band; earlywood eroded by weather
    late = smooth(1 - lw - 0.08, 1 - lw, f) * (1 - smooth(0.95, 1.0, f)) * (0.45 + 0.55 * rr2)
    fibers = fbm(H, W, 1.2, 3, aniso=14)
    erosion = fbm(H, W, 6, 3, aniso=8)
    hgt = late * 0.75 + 0.25 * (0.5 + 0.5 * erosion) + fibers * 0.08
    # checks / cracks
    crack = np.zeros((H, W), np.float32)
    for _ in range(7):
        cx = rng.uniform(0, W)
        y0 = rng.uniform(0, H)
        ln = rng.uniform(150, 700)
        wob = fbm(H, 1, 30, 2)[:, 0] * 3
        dx = np.abs(((xx - cx - wob[:, None]) + W / 2) % W - W / 2)
        dy = ((yy - y0) + H / 2) % H - H / 2
        along = np.clip(1 - np.abs(dy) / (ln / 2), 0, 1) ** 0.6
        crack = np.maximum(crack, np.exp(-(dx / (0.9 + along * 1.3)) ** 2) * along)
    hgt = hgt - crack * 0.8 - knot_dark * 0.1
    hgt = hgt - hgt.min(); hgt /= hgt.max()
    # albedo (linear)
    base = np.array([0.30, 0.295, 0.28], np.float32)
    ridge = np.array([0.44, 0.43, 0.40], np.float32)
    groove = np.array([0.13, 0.115, 0.10], np.float32)
    brown = np.array([0.24, 0.19, 0.14], np.float32)
    col = mix(np.broadcast_to(groove, (H, W, 3)), np.broadcast_to(base, (H, W, 3)), smooth(0.15, 0.5, hgt))
    col = mix(col, np.broadcast_to(ridge, (H, W, 3)), smooth(0.55, 0.95, hgt) * 0.8)
    stain = smooth(0.2, 0.9, fbm(H, W, 60, 4, aniso=3) * 0.5 + 0.5)
    col = mix(col, col * (brown / base), stain * 0.35)
    col = mix(col, np.broadcast_to(np.array([0.06, 0.05, 0.04], np.float32), (H, W, 3)), crack * 0.85)
    col = mix(col, col * 0.7, knot_dark * 0.6)
    # dirt splash near bottom (rain), will be at row H (bottom of tile -> board bottom)
    col *= (1 + fbm(H, W, 3, 2) * 0.06 + fibers * 0.10 + fbm(H, W, 4, 3, aniso=25) * 0.10)[..., None]
    col *= (0.82 + 0.18 * smooth(-0.6, 0.6, fbm(H, W, 120, 3, aniso=4)))[..., None]
    save('wood_albedo.jpg', srgb(col))
    save('wood_normal.jpg', normal_from_height(hgt, 9.0))
    ao = ao_from_height(hgt, 4, 2.2) * (1 - crack * 0.6)
    rough = 0.80 + 0.12 * (1 - hgt) + fibers * 0.03
    orm = np.stack([ao, rough, hgt], -1)
    save('wood_orm.jpg', orm)


# ---------------------------------------------------------------- weathered shingles (roof)
def shingles():
    H = W = 1024             # 1m x 1m, rows of 0.2m exposure
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    rows = 5
    rh = H / rows
    hgt = np.zeros((H, W), np.float32)
    col = np.zeros((H, W, 3), np.float32)
    shade_id = np.zeros((H, W), np.float32)
    fib = fbm(H, W, 1.0, 3, aniso=12)
    grain = fbm(H, W, 3, 3, aniso=10)
    for r in range(rows):
        y0 = r * rh
        # random shingle widths
        x = rng.uniform(0, 60)
        edges = []
        while x < W + 200:
            edges.append(x)
            x += rng.uniform(70, 190)
        inrow = (yy >= y0) & (yy < y0 + rh)
        t = (yy - y0) / rh  # 0 top -> 1 bottom (bottom edge thick)
        for i in range(len(edges) - 1):
            a, b = edges[i] % W, edges[i + 1] % W
            if b < a:
                m = inrow & ((xx >= a) | (xx < b))
            else:
                m = inrow & (xx >= a) & (xx < b)
            tone = rng.uniform(0.75, 1.15)
            tilt = rng.uniform(-0.06, 0.06)
            hgt[m] = (0.35 + 0.55 * t[m] + tilt * ((xx[m] - a) % W) / 150.0)
            shade_id[m] = tone
        # gaps between shingles
        for e in edges:
            d = np.abs(((xx - e) + W / 2) % W - W / 2)
            gap = inrow & (d < 2.6)
            hgt[gap] = 0.02
        # shadow line under the row above (the butt edge)
    hgt += grain * 0.05 + fib * 0.04
    hgt = np.clip(hgt, 0, 1)
    edge = np.zeros((H, W), np.float32)
    for r in range(rows):
        y0 = r * rh
        d = (yy - y0)
        edge = np.maximum(edge, np.exp(-np.clip(d, 0, None) / 10.0) * (d >= 0))
    base = np.array([0.24, 0.235, 0.225], np.float32)
    col[:] = base
    col *= shade_id[..., None] * (0.9 + 0.1 * grain[..., None])
    moss = smooth(0.55, 0.85, fbm(H, W, 30, 4) * 0.5 + 0.5) * smooth(0.6, 1.0, (yy % rh) / rh)
    col = mix(col, np.broadcast_to(np.array([0.11, 0.13, 0.06], np.float32), (H, W, 3)), moss * 0.35)
    col *= (1 - edge * 0.55)[..., None]
    col *= (0.25 + 0.75 * smooth(0.0, 0.08, hgt))[..., None]
    save('roof_albedo.jpg', srgb(col))
    save('roof_normal.jpg', normal_from_height(hgt, 12.0))
    ao = ao_from_height(hgt, 8, 1.6) * (1 - edge * 0.5)
    orm = np.stack([ao, 0.86 + fib * 0.05, hgt], -1)
    save('roof_orm.jpg', orm)


# ---------------------------------------------------------------- lawn / soil
def ground():
    H = W = 1024              # 2m x 2m
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    hgt = np.zeros((H, W), np.float32)
    col = np.zeros((H, W, 3), np.float32)
    soil = 0.6 * smooth(0.35, 0.75, fbm(H, W, 70, 5) * 0.5 + 0.5)
    col[:] = np.array([0.10, 0.075, 0.05])
    pebble = fbm(H, W, 1.5, 3)
    col *= (0.8 + 0.4 * pebble)[..., None]
    hgt += pebble * 0.2
    # grass blades: many short strokes
    img_h = np.zeros((H, W), np.float32)
    img_c = np.zeros((H, W, 3), np.float32)
    cover = np.zeros((H, W), np.float32)
    n = 60000
    px = rng.uniform(0, W, n); py = rng.uniform(0, H, n)
    ang = rng.normal(-1.57, 0.6, n)
    ln = rng.uniform(6, 22, n)
    greens = np.array([[0.05, 0.12, 0.02], [0.09, 0.17, 0.03], [0.14, 0.20, 0.05], [0.04, 0.08, 0.02], [0.18, 0.21, 0.08]], np.float32)
    for i in range(n):
        if soil[int(py[i]) % H, int(px[i]) % W] > rng.uniform(0.3, 1.0):
            continue
        c = greens[rng.integers(0, len(greens))] * rng.uniform(0.7, 1.3)
        steps = int(ln[i])
        for s in range(steps):
            t = s / max(steps - 1, 1)
            x = int(px[i] + np.cos(ang[i]) * s * 0.7) % W
            y = int(py[i] + np.sin(ang[i]) * s * 0.7) % H
            hv = 0.3 + 0.7 * t
            if hv > img_h[y, x]:
                img_h[y, x] = hv
                img_c[y, x] = c * (0.6 + 0.6 * t)
                cover[y, x] = 1
    cover = nd.grey_dilation(cover, size=(2, 2), mode='wrap')
    img_c = nd.grey_dilation(img_c, size=(2, 2, 1), mode='wrap')
    img_h = nd.grey_dilation(img_h, size=(2, 2), mode='wrap')
    col = mix(col, img_c, cover)
    hgt = np.maximum(hgt, img_h)
    hgt = nd.gaussian_filter(hgt, 0.6, mode='wrap')
    big = fbm(H, W, 120, 3)
    col *= (0.85 + 0.25 * big)[..., None]
    save('ground_albedo.jpg', srgb(col))
    save('ground_normal.jpg', normal_from_height(hgt, 5.0))
    ao = ao_from_height(hgt, 3, 2.0)
    orm = np.stack([ao, 0.92 - cover * 0.12, hgt], -1)
    save('ground_orm.jpg', orm)


# ---------------------------------------------------------------- blurred spring-garden backdrop (out of focus)
def backdrop():
    H, W = 768, 2048
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    v = yy / H
    sky_top = np.array([0.32, 0.50, 0.80]); sky_bot = np.array([0.80, 0.84, 0.86])
    col = mix(np.broadcast_to(sky_top, (H, W, 3)), np.broadcast_to(sky_bot, (H, W, 3)), smooth(0.0, 0.6, v))
    # warm haze toward left (sun side)
    col += (np.exp(-((xx / W - 0.1) ** 2) / 0.08) * np.exp(-((v - 0.5) ** 2) / 0.1))[..., None] * np.array([0.25, 0.18, 0.08])
    # distant tree line with lit tops
    def treeline(base, amp, scale, c_lit, c_dark, seed_sig):
        prof = fbm(1, W, scale, 4)[0] * amp + fbm(1, W, scale / 6, 3)[0] * amp * 0.3
        top = base - np.maximum(prof, -amp * 0.5) * H
        mask = smooth(-6, 6, yy - top[None, :])
        leaf = fbm(H, W, seed_sig, 4) * 0.5 + 0.5
        litc = mix(np.broadcast_to(c_dark, (H, W, 3)), np.broadcast_to(c_lit, (H, W, 3)), smooth(0.3, 0.8, leaf) * (1 - smooth(0, 0.5, (yy - top[None, :]) / H * 3)))
        return mask, litc
    m, c = treeline(0.30 * H, 0.18, 160, np.array([0.30, 0.42, 0.15]), np.array([0.06, 0.12, 0.05]), 6)
    col = mix(col, mix(c, np.broadcast_to(np.array([0.55, 0.65, 0.70]), (H, W, 3)), 0.35), m)  # aerial perspective
    m, c = treeline(0.46 * H, 0.10, 90, np.array([0.38, 0.52, 0.12]), np.array([0.05, 0.11, 0.03]), 4)
    col = mix(col, c, m)
    # blossoming shrubs (white + yellow) dots
    for cc, cnt, yr in ((np.array([0.95, 0.93, 0.88]), 900, (0.45, 0.70)), (np.array([0.95, 0.75, 0.10]), 700, (0.55, 0.78)),
                        (np.array([0.80, 0.50, 0.70]), 120, (0.62, 0.80))):
        layer = np.zeros((H, W), np.float32)
        px = rng.uniform(0, W, cnt).astype(int); py = (rng.uniform(*yr, cnt) * H).astype(int)
        layer[py.clip(0, H - 1), px] = 1
        layer = nd.grey_dilation(layer, size=(5, 5), mode='wrap')
        layer = nd.gaussian_filter(layer, 2.0, mode='wrap') * 1.3
        col = mix(col, np.broadcast_to(cc, (H, W, 3)), np.clip(layer, 0, 1) * (1 - smooth(0.8, 0.86, v)) * 0.8)
    # mid-distance garden trees (rounded crowns, lit from the left)
    for k in range(9):
        cx = rng.uniform(0, W); cy = rng.uniform(0.38, 0.55) * H; rx = rng.uniform(90, 200); ry = rx * rng.uniform(0.7, 1.0)
        dx = ((xx - cx + W / 2) % W - W / 2) / rx; dy = (yy - cy) / ry
        crown = fbm(H, W, 5, 3) * 0.35
        m = smooth(1.05, 0.85, np.sqrt(dx * dx + dy * dy) + crown)
        lit = smooth(-0.6, 0.8, -dx * 0.7 - dy * 0.5 + fbm(H, W, 3, 3) * 0.8)
        tc = mix(np.broadcast_to(np.array([0.05, 0.10, 0.03]), (H, W, 3)), np.broadcast_to(np.array([0.30, 0.44, 0.10]) * rng.uniform(0.8, 1.15), (H, W, 3)), lit)
        tc = mix(tc, np.broadcast_to(np.array([0.5, 0.6, 0.65]), (H, W, 3)), 0.18)
        col = mix(col, tc, m)
        trunk = smooth(6, 3, np.abs(((xx - cx + W / 2) % W - W / 2))) * (yy > cy + ry * 0.5) * (yy < 0.8 * H)
        col = mix(col, np.broadcast_to(np.array([0.10, 0.08, 0.06]), (H, W, 3)), trunk * 0.8)
    hedge = 0.68 * H - fbm(1, W, 40, 3)[0] * 0.07 * H
    hm = smooth(-4, 4, yy - hedge[None, :])
    leaf = fbm(H, W, 3, 4) * 0.5 + 0.5
    hc = mix(np.broadcast_to(np.array([0.03, 0.08, 0.02]), (H, W, 3)), np.broadcast_to(np.array([0.22, 0.36, 0.06]), (H, W, 3)), smooth(0.35, 0.85, leaf))
    col = mix(col, hc, hm)
    # lawn at bottom
    lm = smooth(0.86 * H - 3, 0.86 * H + 3, yy)
    lc = np.broadcast_to(np.array([0.16, 0.24, 0.06]), (H, W, 3)) * (0.8 + 0.3 * fbm(H, W, 8, 3)[..., None])
    col = mix(col, lc, lm)
    # out of focus: strong blur + bokeh highlights
    img = (srgb(np.clip(col, 0, 1)) * 255).astype(np.uint8)
    im = Image.fromarray(img).filter(ImageFilter.GaussianBlur(7))
    a = np.asarray(im).astype(np.float32) / 255
    bok = np.zeros((H, W), np.float32)
    px = rng.uniform(0, W, 45).astype(int); py = (rng.uniform(0.25, 0.6, 45) * H).astype(int)
    bok[py, px] = 1
    disk = np.zeros((25, 25), np.float32); yy2, xx2 = np.mgrid[-12:13, -12:13]; disk[(xx2 ** 2 + yy2 ** 2) <= 110] = 1
    bok = nd.convolve(bok, disk, mode='wrap')
    bok = nd.gaussian_filter(bok, 2.0) * 0.10
    a = 1 - (1 - a) * (1 - bok[..., None] * np.array([1.0, 0.95, 0.8]))
    save('backdrop.jpg', a, q=86)


# ---------------------------------------------------------------- fabrics / skin / metal / misc details (grayscale detail + normal)
def weave(name, H, kind):
    yy, xx = np.mgrid[0:H, 0:H].astype(np.float32)
    if kind == 'twill':      # denim / work canvas
        p = 2 * np.pi * 64 / H
        d = np.sin((xx + yy) * p) * 0.5 + 0.5
        thread = np.sin(yy * p * 2) * 0.15
        hgt = d * 0.8 + thread + fbm(H, H, 1.0, 2) * 0.2
        slub = fbm(H, H, 8, 2, aniso=0.2) * 0.12
        alb = 0.82 + 0.18 * d - 0.10 * smooth(0.1, 0.6, fbm(H, H, 30, 3) * 0.5 + 0.5) + slub
    elif kind == 'knit':     # jersey t-shirt
        p = 2 * np.pi * 96 / H
        v = np.abs(np.sin(xx * p * 0.5))
        loops = np.sin(yy * p) * 0.5 + 0.5
        hgt = v * 0.6 + loops * 0.4 * v + fbm(H, H, 0.8, 2) * 0.15
        alb = 0.9 + 0.1 * hgt
    elif kind == 'canvas':   # plain weave cotton (work shirt / rag)
        p = 2 * np.pi * 80 / H
        a = np.sin(xx * p) * np.sin(yy * p)
        hgt = 0.5 + 0.5 * a + fbm(H, H, 0.7, 2) * 0.25
        alb = 0.88 + 0.12 * hgt + fbm(H, H, 12, 3) * 0.05
    elif kind == 'skin':
        pores = np.zeros((H, H), np.float32)
        px = rng.uniform(0, H, 900).astype(int); py = rng.uniform(0, H, 900).astype(int)
        pores[py, px] = 1
        pores = nd.gaussian_filter(pores, 1.0, mode='wrap') * 6
        hgt = fbm(H, H, 6, 3) * 0.3 - pores + fbm(H, H, 1, 2) * 0.1
        alb = 0.94 + 0.06 * fbm(H, H, 10, 3)
    elif kind == 'metal':    # tin can: brushed + scratches
        hgt = fbm(H, H, 0.6, 2, aniso=40) * 0.3
        scr = np.zeros((H, H), np.float32)
        for _ in range(140):
            x0, y0 = rng.uniform(0, H, 2); ang = rng.uniform(0, np.pi); ln = rng.uniform(10, 90)
            for s in np.linspace(0, ln, int(ln * 2)):
                scr[int(y0 + np.sin(ang) * s) % H, int(x0 + np.cos(ang) * s) % H] = 1
        scr = nd.gaussian_filter(scr, 0.5, mode='wrap')
        hgt -= scr * 0.6
        alb = 0.9 + 0.1 * fbm(H, H, 20, 3) - scr * 0.1
        rough = 0.28 + 0.25 * np.clip(scr * 3, 0, 1) + 0.12 * smooth(0.3, 0.9, fbm(H, H, 25, 4) * 0.5 + 0.5)
        save(name + '_detail.jpg', np.stack([alb, rough, np.clip(hgt * 0.5 + 0.5, 0, 1)], -1))
        save(name + '_normal.jpg', normal_from_height(hgt, 4.0))
        return
    elif kind == 'concrete':
        hgt = fbm(H, H, 20, 5) * 0.4 + fbm(H, H, 1.2, 2) * 0.3
        holes = smooth(0.82, 0.9, fbm(H, H, 1.5, 2) * 0.5 + 0.5)
        hgt -= holes
        alb = 0.75 + 0.15 * fbm(H, H, 40, 4) - holes * 0.3 + 0.08 * fbm(H, H, 2, 2)
    elif kind == 'clay':     # terracotta
        hgt = fbm(H, H, 10, 4) * 0.3 + fbm(H, H, 0.8, 2) * 0.2
        alb = 0.85 + 0.15 * fbm(H, H, 30, 4) + 0.05 * fbm(H, H, 2, 2)
    elif kind == 'hair':     # strands along v
        hgt = fbm(H, H, 0.7, 3, aniso=60) * 0.8 + fbm(H, H, 3, 2, aniso=30) * 0.4
        alb = 0.75 + 0.35 * (hgt * 0.5 + 0.5)
    hgt = hgt.astype(np.float32)
    save(name + '_detail.jpg', np.clip(alb, 0, 1))
    save(name + '_normal.jpg', normal_from_height(hgt, {'twill': 3.0, 'knit': 3.0, 'canvas': 2.5, 'skin': 1.6, 'concrete': 5.0, 'clay': 3.0, 'hair': 4.0}[kind]))


if __name__ == '__main__':
    which = sys.argv[2:] or ['wood', 'shingles', 'ground', 'backdrop', 'detail']
    if 'wood' in which: wood()
    if 'shingles' in which: shingles()
    if 'ground' in which: ground()
    if 'backdrop' in which: backdrop()
    if 'detail' in which:
        weave('twill', 512, 'twill'); weave('knit', 512, 'knit'); weave('canvas', 512, 'canvas')
        weave('skin', 256, 'skin'); weave('metal', 512, 'metal'); weave('concrete', 512, 'concrete')
        weave('clay', 512, 'clay'); weave('hair', 256, 'hair')
