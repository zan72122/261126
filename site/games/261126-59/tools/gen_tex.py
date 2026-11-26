# Procedural photo-like PBR textures for 261126-59 (all tileable, spectral synthesis).
# Run: python3 tools/gen_tex.py  -> writes assets/*.jpg
import numpy as np, os
from PIL import Image, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), '..', 'assets')
rng = np.random.default_rng(59)

def spec(n, m=None, beta=2.0, aniso=(1.0, 1.0), lo=1.0):
    m = m or n
    w = rng.standard_normal((m, n))
    F = np.fft.fft2(w)
    fy = np.fft.fftfreq(m)[:, None] * m * aniso[1]
    fx = np.fft.fftfreq(n)[None, :] * n * aniso[0]
    f = np.sqrt(fx * fx + fy * fy)
    f[0, 0] = 1
    F *= 1.0 / np.maximum(f, lo) ** (beta / 2)
    F[0, 0] = 0
    r = np.real(np.fft.ifft2(F))
    r -= r.min(); r /= r.max() + 1e-9
    return r

def band(n, m=None, f0=8, f1=64, aniso=(1, 1)):
    m = m or n
    w = rng.standard_normal((m, n))
    F = np.fft.fft2(w)
    fy = np.fft.fftfreq(m)[:, None] * m * aniso[1]
    fx = np.fft.fftfreq(n)[None, :] * n * aniso[0]
    f = np.sqrt(fx * fx + fy * fy)
    F *= ((f >= f0) & (f <= f1))
    r = np.real(np.fft.ifft2(F)); r -= r.min(); r /= r.max() + 1e-9
    return r

def normal_from_h(h, s=4.0):
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5
    dr = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5
    nx = -dx * s * h.shape[1] / 256; ny = dr * s * h.shape[0] / 256; nz = np.ones_like(h)
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    return np.stack([nx / l, ny / l, nz / l], -1) * 0.5 + 0.5

def save(name, arr, q=88):
    a = np.clip(arr, 0, 1)
    if a.ndim == 2: a = np.stack([a] * 3, -1)
    Image.fromarray((a * 255 + 0.5).astype(np.uint8)).save(os.path.join(OUT, name), quality=q, optimize=True)
    print(name)

def srgb(c): return np.array(c, dtype=float) / 255.0

def lerp(a, b, t):
    t = t[..., None] if np.ndim(t) == 2 else t
    return a + (b - a) * t

def blur(a, r):
    if a.ndim == 2:
        im = Image.fromarray((np.clip(a, 0, 1) * 65535).astype(np.uint16).astype(np.int32), 'I')
        return np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))) / 255.0
    return np.asarray(Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))) / 255.0

def tblur(a, r):  # tileable blur via padding
    p = int(r * 3) + 2
    if a.ndim == 2:
        pad = np.pad(a, p, mode='wrap'); return blur(pad, r)[p:-p, p:-p]
    pad = np.pad(a, ((p, p), (p, p), (0, 0)), mode='wrap'); return blur(pad, r)[p:-p, p:-p]

# ---------------------------------------------------------------- old floor planks
def planks(N=1024, tone=(118, 84, 56), name='floor'):
    H = np.zeros((N, N)); C = np.zeros((N, N, 3)); R = np.zeros((N, N))
    rows = 6; ph = N // rows
    grain_hi = spec(N, beta=2.0, aniso=(20.0, 1.0))
    grain_fine = band(N, f0=40, f1=300, aniso=(25.0, 1.0))
    knots = spec(N, beta=3.0)
    dirt = spec(N, beta=2.6)
    base = srgb(tone)
    for r in range(rows):
        y0 = r * ph; y1 = y0 + ph
        off = rng.integers(0, N)
        # plank seams along x at random positions (2 per row)
        seams = sorted(rng.integers(0, N, 2))
        for k in range(2):
            a = seams[k]; b = seams[(k + 1) % 2]
            shade = rng.uniform(0.75, 1.15)
            hue = rng.uniform(-0.06, 0.06)
            idx = np.arange(N); seg = ((idx - a) % N) < ((b - a) % N)
            cols = np.where(seg)[0]
            g = np.roll(grain_hi, off + k * 97, 0)[y0:y1][:, cols]
            gf = np.roll(grain_fine, off * 3 + k * 31, 0)[y0:y1][:, cols]
            rings = (0.5 + 0.5 * np.sin((np.arange(ph)[:, None] / ph * rng.uniform(4, 9) + g * 4 + np.arange(len(cols))[None, :] / N * rng.uniform(-1, 1)) * np.pi * 2)) ** 3
            v = 0.5 * (1 - rings) + 0.5 * gf
            col = base * shade * (0.55 + 0.6 * v[..., None])
            col = col * np.array([1 + hue, 1, 1 - hue])
            C[y0:y1][:, cols] = col
            H[y0:y1][:, cols] = 0.6 + 0.25 * gf - 0.15 * rings
            R[y0:y1][:, cols] = 0.62 + 0.25 * gf
        # board edges: bevel + gap
        e = np.arange(ph)
        edge = np.minimum(e, ph - 1 - e) / 6.0
        bev = np.clip(edge, 0, 1)[:, None]
        H[y0:y1] *= bev * 0.7 + 0.3
        C[y0:y1] *= (0.35 + 0.65 * bev)[..., None]
        for s in seams:
            for d in range(-2, 3):
                x = (s + d) % N
                f = 0.3 + 0.7 * abs(d) / 3
                C[y0:y1, x] *= f; H[y0:y1, x] *= f
        # nails
        for s in seams:
            for yy in (y0 + ph // 4, y0 + 3 * ph // 4):
                xx = (s + 10) % N
                Y, X = np.ogrid[-6:7, -6:7]; m = (X * X + Y * Y) <= 20
                ys = (yy + Y) % N; xs = (xx + X) % N
                C[ys, xs] = np.where(m[..., None], srgb((48, 44, 42)), C[ys, xs])
                H[ys, xs] = np.where(m, 0.3, H[ys, xs])
                R[ys, xs] = np.where(m, 0.45, R[ys, xs])
    d = dirt[..., None]
    C *= 0.8 + 0.35 * d
    H = tblur(H, 0.8)
    AO = np.clip(0.55 + 0.6 * H, 0, 1)
    save(f'{name}_col.jpg', C)
    save(f'{name}_nrm.jpg', normal_from_h(H, 3.0))
    save(f'{name}_arm.jpg', np.stack([AO, np.clip(R, 0, 1), np.zeros_like(R)], -1))

# ---------------------------------------------------------------- rough timber (beams / roof boards)
def timber(N=512, tone=(112, 80, 52), name='timber'):
    g = spec(N, beta=2.2, aniso=(20.0, 1.0))
    gf = band(N, f0=30, f1=240, aniso=(30.0, 1.0))
    cr = band(N, f0=60, f1=250, aniso=(60.0, 1.0))
    rings = (0.5 + 0.5 * np.sin((np.arange(N)[:, None] / N * 10 + g * 5) * np.pi * 2)) ** 3
    cracks = np.clip((cr - 0.82) * 8, 0, 1)
    v = 0.5 * (1 - rings) + 0.5 * gf
    C = srgb(tone) * (0.55 + 0.6 * v[..., None]) * (1 - 0.6 * cracks[..., None])
    C *= (0.85 + 0.3 * spec(N, beta=3)[..., None])
    H = 0.6 + 0.3 * gf - 0.2 * rings - 0.5 * cracks
    R = 0.7 + 0.2 * gf
    save(f'{name}_col.jpg', C)
    save(f'{name}_nrm.jpg', normal_from_h(tblur(H, 0.7), 2.5))
    save(f'{name}_arm.jpg', np.stack([np.clip(0.6 + 0.5 * H, 0, 1), R, 0 * R], -1))

# ---------------------------------------------------------------- rust + metal masks (for robot)
def rust(N=1024):
    big = spec(N, beta=2.6)
    mid = spec(N, beta=1.6)
    fine = band(N, f0=60, f1=500)
    flakes = 0.6 * band(N, f0=5, f1=30) + 0.4 * band(N, f0=30, f1=140)
    pits = np.clip((band(N, f0=80, f1=300) - 0.72) * 6, 0, 1)
    h = 0.45 * big + 0.3 * mid + 0.15 * fine + 0.25 * np.clip((flakes - 0.5) * 3, 0, 1) - 0.2 * pits
    h = (h - h.min()) / (h.max() - h.min())
    scale = np.clip((flakes + 0.45 * big - 0.78) * 6, 0, 1)          # raised crusty scale plates
    blot = spec(N, beta=3.0)
    t = np.clip(mid * 1.3 - 0.15, 0, 1)
    orange = lerp(srgb((112, 52, 22)), srgb((178, 92, 40)), t)
    orange = lerp(orange, srgb((172, 126, 70)), np.clip((fine - 0.6) * 2.5, 0, 1) * 0.7)  # powdery ochre bloom
    crust = lerp(srgb((58, 28, 16)), srgb((96, 46, 22)), fine)
    C = lerp(orange, crust, scale * 0.85)
    C = lerp(C, srgb((52, 30, 22)), np.clip((blot - 0.6) * 2.5, 0, 1) * 0.6)
    C *= (0.7 + 0.5 * fine[..., None])
    C = lerp(C, srgb((30, 16, 10)), pits * 0.9)
    h = np.clip(h + 0.25 * scale, 0, None); h = (h - h.min()) / (h.max() - h.min())
    save('rust_col.jpg', C)
    # scratches for polished metal
    S = np.zeros((N, N))
    for _ in range(900):
        x0, y0 = rng.uniform(0, N, 2); ang = rng.normal(0.25, 0.5) if rng.random() < .7 else rng.uniform(0, np.pi)
        L = rng.uniform(20, 260); a = rng.uniform(0.15, 0.9)
        t = np.linspace(0, 1, int(L * 1.5))
        xs = (x0 + np.cos(ang) * L * t + np.sin(t * 3) * rng.uniform(-4, 4)).astype(int) % N
        ys = (y0 + np.sin(ang) * L * t).astype(int) % N
        S[ys, xs] = np.maximum(S[ys, xs], a * np.sin(t * np.pi) ** .5)
    S = np.clip(tblur(S, 0.6) * 2.2, 0, 1)
    smudge = spec(N, beta=2.8)
    # pack: R = rust height, G = scratches, B = smudge/grime
    save('rust_msk.jpg', np.stack([h, S, smudge], -1), q=92)

# ---------------------------------------------------------------- twill work fabric (coveralls)
def twill(N=512, tone=(86, 104, 120), name='twill', period=8):
    y, x = np.mgrid[0:N, 0:N]
    d = ((x + y) % period) / period
    w = 0.5 + 0.5 * np.cos(d * np.pi * 2)
    th = band(N, f0=N / period * 0.5, f1=N / period * 1.2, aniso=(1, 0.2))
    slub = spec(N, beta=2.0, aniso=(6, 1))
    H = 0.6 * w + 0.25 * th + 0.15 * slub
    fade = spec(N, beta=2.8)
    C = srgb(tone) * (0.72 + 0.4 * H[..., None]) * (0.9 + 0.2 * fade[..., None])
    C = lerp(C, srgb((200, 200, 196)), np.clip((slub - 0.75) * 0.8, 0, 0.25))
    save(f'{name}_col.jpg', C)
    save(f'{name}_nrm.jpg', normal_from_h(tblur(H, 0.6), 2.0))

def knit(N=256, tone=(220, 120, 130), name='knit'):
    y, x = np.mgrid[0:N, 0:N]
    p = 8
    vx = (x % p) / p; vy = (y % (p // 2)) / (p // 2)
    loop = np.exp(-((np.abs(vx - 0.5) - 0.25 + (vy - 0.5) * 0.2) ** 2) / 0.02)
    H = loop * (0.8 + 0.2 * band(N, f0=4, f1=60))
    C = srgb(tone) * (0.75 + 0.35 * H[..., None])
    save(f'{name}_col.jpg', C)
    save(f'{name}_nrm.jpg', normal_from_h(tblur(H, 0.5), 1.6))

# ---------------------------------------------------------------- leather (trunk) + rivet metal
def leather(N=512, tone=(92, 58, 36), name='leather'):
    # voronoi-ish cells via min distance to random points (tileable)
    pts = rng.uniform(0, N, (700, 2))
    y, x = np.mgrid[0:N, 0:N].astype(float)
    d1 = np.full((N, N), 1e9); d2 = np.full((N, N), 1e9)
    for px, py in pts:
        dx = np.abs(x - px); dx = np.minimum(dx, N - dx)
        dy = np.abs(y - py); dy = np.minimum(dy, N - dy)
        d = dx * dx + dy * dy
        m = d < d1; d2 = np.where(m, d1, np.minimum(d2, d)); d1 = np.where(m, d, d1)
    edge = np.sqrt(d2) - np.sqrt(d1)
    crease = np.clip(1 - edge / 3.0, 0, 1)
    wear = spec(N, beta=2.6)
    H = 1 - crease * 0.8 + 0.1 * band(N, f0=40, f1=200)
    C = srgb(tone) * (0.65 + 0.4 * H[..., None]) * (0.75 + 0.5 * wear[..., None])
    C = lerp(C, srgb((140, 104, 70)), np.clip((wear - 0.7) * 2, 0, 0.6))
    R = 0.55 + 0.3 * crease - 0.2 * np.clip(wear - 0.5, 0, 1)
    save(f'{name}_col.jpg', C)
    save(f'{name}_nrm.jpg', normal_from_h(tblur(H, 0.8), 2.0))
    save(f'{name}_arm.jpg', np.stack([np.clip(0.7 + 0.3 * H, 0, 1), R, 0 * R], -1))

# ---------------------------------------------------------------- wool blanket
def wool(N=512, tone=(150, 60, 52), name='wool'):
    y, x = np.mgrid[0:N, 0:N]
    weave = 0.5 + 0.25 * np.cos(x / N * np.pi * 2 * 96) + 0.25 * np.cos(y / N * np.pi * 2 * 96)
    fuzz = band(N, f0=30, f1=400)
    H = 0.5 * weave + 0.5 * fuzz
    plaid = ((np.sin(x / N * np.pi * 2 * 6) > 0.6) | (np.sin(y / N * np.pi * 2 * 6) > 0.6)).astype(float)
    C = lerp(srgb(tone), srgb((206, 176, 120)), plaid * 0.7)
    C = C * (0.7 + 0.4 * H[..., None])
    save(f'{name}_col.jpg', C)
    save(f'{name}_nrm.jpg', normal_from_h(tblur(H, 0.7), 1.8))

# ---------------------------------------------------------------- skin pores / hair strands
def skin(N=256):
    pores = np.clip((band(N, f0=40, f1=120) - 0.7) * 3, 0, 1)
    H = 0.6 + 0.2 * band(N, f0=8, f1=40) - 0.35 * pores
    save('skin_nrm.jpg', normal_from_h(tblur(H, 0.6), 0.9))

def hair(N=512):
    s = band(N, f0=40, f1=400, aniso=(1.0, 60.0))
    c = spec(N, beta=2.0, aniso=(1.0, 30.0))
    H = 0.6 * s + 0.4 * c
    save('hair_nrm.jpg', normal_from_h(tblur(H, 0.5), 2.6))
    save('hair_msk.jpg', np.stack([H, c, s], -1))

# ---------------------------------------------------------------- outdoor view through rainy window
def outdoor(W=1024, Hh=512):
    y = np.linspace(0, 1, Hh)[:, None] * np.ones((1, W))
    sky = lerp(srgb((206, 212, 218)), srgb((150, 160, 168)), y)
    cloud = spec(W, Hh, beta=2.8)
    sky = sky * (0.9 + 0.18 * cloud[..., None])
    # far hills / trees
    xs = np.linspace(0, 1, W)
    ridge1 = 0.55 + 0.08 * np.sin(xs * 9) + 0.06 * spec(W, 1, beta=2.0)[0] - 0.03
    ridge2 = 0.68 + 0.1 * spec(W, 1, beta=1.6)[0]
    C = sky.copy()
    m1 = (y > ridge1[None, :]).astype(float)
    C = lerp(C, srgb((122, 136, 138)), m1 * 0.85)
    tre = spec(W, Hh, beta=1.4)
    m2 = (y > ridge2[None, :] - 0.08 * tre).astype(float)
    C = lerp(C, srgb((70, 88, 76)) * (0.8 + 0.4 * tre[..., None]), m2)
    # roofs of neighbor
    C[int(Hh * 0.82):, :] = lerp(C[int(Hh * 0.82):, :], srgb((92, 88, 90)), 0.8)
    C = tblur(C, 3.5)
    save('outdoor.jpg', C, q=85)

# ---------------------------------------------------------------- rain droplets on glass (normal + mask)
def raindrops(N=512):
    H = np.zeros((N, N))
    y, x = np.mgrid[0:N, 0:N].astype(float)
    for _ in range(420):
        cx, cy = rng.uniform(0, N, 2)
        r = rng.choice([rng.uniform(1.2, 3), rng.uniform(3, 7), rng.uniform(7, 12)], p=[0.6, 0.32, 0.08])
        sx = r * rng.uniform(0.85, 1.1); sy = r * rng.uniform(0.95, 1.35)
        x0 = int(cx - sx - 2); x1 = int(cx + sx + 3); y0 = int(cy - sy - 2); y1 = int(cy + sy + 3)
        yy, xx = np.mgrid[y0:y1, x0:x1]
        d = ((xx - cx) / sx) ** 2 + ((yy - cy) / sy) ** 2
        v = np.sqrt(np.clip(1 - d, 0, 1))
        H[yy % N, xx % N] = np.maximum(H[yy % N, xx % N], v)
    # streaks
    for _ in range(26):
        cx = rng.uniform(0, N); w = rng.uniform(1.0, 2.2); L = rng.uniform(60, 300); y0 = rng.uniform(0, N)
        for t in np.linspace(0, L, int(L)):
            xx = cx + np.sin(t * 0.05) * 3
            yy, xs = int((y0 + t) % N), np.arange(int(xx - w - 1), int(xx + w + 2))
            v = np.sqrt(np.clip(1 - ((xs - xx) / w) ** 2, 0, 1)) * 0.6
            H[yy, xs % N] = np.maximum(H[yy, xs % N], v)
    n = normal_from_h(tblur(H, 0.7), 6.0)
    save('drops_nrm.jpg', n, q=90)
    save('drops_msk.jpg', np.clip(H * 1.5, 0, 1), q=90)

# ---------------------------------------------------------------- cardboard (background boxes)
def cardboard(N=512, name='card'):
    y, x = np.mgrid[0:N, 0:N]
    flute = 0.5 + 0.5 * np.cos(x / N * np.pi * 2 * 64)
    fib = band(N, f0=30, f1=300)
    stain = spec(N, beta=2.6)
    H = 0.2 * flute + 0.6 * fib
    C = srgb((168, 128, 86)) * (0.8 + 0.25 * fib[..., None]) * (0.8 + 0.3 * stain[..., None])
    save(f'{name}_col.jpg', C)
    save(f'{name}_nrm.jpg', normal_from_h(tblur(H, 0.6), 1.2))

def plaster(N=512, name='plaster'):
    h = 0.6 * spec(N, beta=2.2) + 0.4 * band(N, f0=40, f1=300)
    stain = spec(N, beta=3.0)
    C = srgb((196, 186, 168)) * (0.82 + 0.2 * h[..., None]) * (0.85 + 0.2 * stain[..., None])
    save(f'{name}_col.jpg', C)
    save(f'{name}_nrm.jpg', normal_from_h(tblur(h, 0.8), 1.5))

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    planks(); timber(); timber(512, (138, 104, 72), 'board'); rust(); twill(); twill(512, (196, 168, 120), 'canvas', 6)
    knit(); leather(); wool(); skin(); hair(); outdoor(); raindrops(); cardboard(); plaster()
