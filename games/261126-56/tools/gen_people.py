#!/usr/bin/env python3
"""Generate realistic-proportioned skinned characters for the dyeing game.

Each body part is a signed distance field (smooth unions of lofted sections,
tapered capsules, ellipsoids).  We polygonise it with marching cubes, decimate,
project the vertices back on the surface, take normals from the SDF gradient,
bake ambient occlusion and colour into vertex colours, and compute skin weights
from distances to bone segments (gated by body region).

Output: assets/people/<name>.bin  (uint32 header length, JSON header, buffers)
"""
import json, struct, sys, os, time
import numpy as np
from skimage.measure import marching_cubes
import fast_simplification
from sdf import *

OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'people')
os.makedirs(OUT, exist_ok=True)

BONES = ['root', 'hips', 'spine', 'chest', 'neck', 'head',
         'clavL', 'uarmL', 'farmL', 'handL', 'clavR', 'uarmR', 'farmR', 'handR',
         'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR']
PARENT = [-1, 0, 1, 2, 3, 4, 3, 6, 7, 8, 3, 10, 11, 12, 1, 14, 15, 1, 17, 18]
B = {n: i for i, n in enumerate(BONES)}
ALLOWED = {
    'hips': ['hips', 'spine', 'thighL', 'thighR'],
    'spine': ['spine', 'hips', 'chest'],
    'chest': ['chest', 'spine', 'neck', 'clavL', 'clavR'],
    'neck': ['neck', 'chest', 'head'],
    'head': ['head', 'neck'],
}
for s in 'LR':
    ALLOWED['clav' + s] = ['clav' + s, 'chest', 'uarm' + s]
    ALLOWED['uarm' + s] = ['uarm' + s, 'clav' + s, 'farm' + s, 'chest']
    ALLOWED['farm' + s] = ['farm' + s, 'uarm' + s, 'hand' + s]
    ALLOWED['hand' + s] = ['hand' + s, 'farm' + s]
    ALLOWED['thigh' + s] = ['thigh' + s, 'hips', 'shin' + s]
    ALLOWED['shin' + s] = ['shin' + s, 'thigh' + s, 'foot' + s]
    ALLOWED['foot' + s] = ['foot' + s, 'shin' + s]

MIR = np.array([-1.0, 1.0, 1.0])

def mirrored(f):
    return lambda P: f(P * MIR)

def V(*a):
    return np.array(a, float)

# ---------------------------------------------------------------- rig
def make_rig(sp):
    H = sp['H']; J = {}
    J['root'] = V(0, 0, 0)
    J['pelvis'] = V(0, sp['pelvis'], 0)
    J['waist'] = V(0, sp['waist'], 0.0)
    J['chestJ'] = V(0, sp['chest'], 0.0)
    J['neckJ'] = V(0, sp['neckY'], -0.006 * H)
    J['headJ'] = V(0, sp['headJ'], -0.008 * H)
    J['headTop'] = V(0, H, 0)
    th = np.radians(sp.get('apose', 28))
    for s, sg in (('L', 1), ('R', -1)):
        sh = V(sg * sp['shX'], sp['shY'], -0.004 * H)
        J['stern' + s] = V(sg * 0.012 * H, sp['neckY'] - 0.012 * H, 0.004 * H)
        J['sh' + s] = sh
        d1 = V(sg * np.sin(th), -np.cos(th), 0.0)
        el = sh + d1 * sp['uarm']
        d2 = V(sg * np.sin(th * 0.92), -np.cos(th * 0.92), 0.035); d2 /= np.linalg.norm(d2)
        wr = el + d2 * sp['farm']
        J['el' + s] = el; J['wr' + s] = wr; J['tip' + s] = wr + d2 * sp['hand']
        J['dirF' + s] = d2
        hp = V(sg * sp['hipX'], sp['hipY'], 0.0)
        kn = V(sg * sp['kneeX'], sp['kneeY'], 0.004 * H)
        an = V(sg * sp['kneeX'], sp['ankY'], -0.006 * H)
        J['hip' + s] = hp; J['knee' + s] = kn; J['ank' + s] = an
        J['toe' + s] = V(an[0], 0.01, an[2] + sp['foot'] * 0.75)
    bones = {
        'root': J['root'], 'hips': J['pelvis'], 'spine': J['waist'], 'chest': J['chestJ'],
        'neck': J['neckJ'], 'head': J['headJ'],
    }
    segs = {
        'hips': (J['pelvis'] - V(0, 0.06 * H, 0), J['waist']),
        'spine': (J['waist'], J['chestJ']),
        'chest': (J['chestJ'], J['neckJ']),
        'neck': (J['neckJ'], J['headJ']),
        'head': (J['headJ'], J['headTop']),
    }
    for s in 'LR':
        bones['clav' + s] = J['stern' + s]; bones['uarm' + s] = J['sh' + s]
        bones['farm' + s] = J['el' + s]; bones['hand' + s] = J['wr' + s]
        bones['thigh' + s] = J['hip' + s]; bones['shin' + s] = J['knee' + s]; bones['foot' + s] = J['ank' + s]
        segs['clav' + s] = (J['stern' + s], J['sh' + s])
        segs['uarm' + s] = (J['sh' + s], J['el' + s])
        segs['farm' + s] = (J['el' + s], J['wr' + s])
        segs['hand' + s] = (J['wr' + s], J['tip' + s])
        segs['thigh' + s] = (J['hip' + s], J['knee' + s])
        segs['shin' + s] = (J['knee' + s], J['ank' + s])
        segs['foot' + s] = (J['ank' + s], J['toe' + s])
    return J, bones, segs

# ---------------------------------------------------------------- parts
def torso_fn(sp, J, offset=0.0, extra=None, extend=False):
    tb = np.array(sp['torso'], float).copy()
    if extend:
        first = tb[1].copy(); first[0] = tb[0, 0] - 0.12 * sp['H']
        tb = np.vstack([first, tb[1:]])
    tb[:, 1] += offset; tb[:, 2] += offset
    if extra is not None:
        tb[:, 1] += extra; tb[:, 2] += extra * 0.8
    return loft(tb, tb[0, 0], tb[-1, 0], kcap=0.035 * sp['H'])

def arm_parts(sp, J, s, off=0.0, upto=1.0):
    """left-side arm primitives (world), returns list of (fn, region)"""
    H = sp['H']; r = sp['armR']
    sh, el, wr = J['shL'], J['elL'], J['wrL']
    out = []
    out.append((ellipsoid(sh + V(0.002 * H, 0.002 * H, 0), V(r[0] * 1.1 + off, r[0] * 1.05 + off, r[0] * 0.98 + off)), 'clavL'))
    out.append((cone(sh, el, r[0] + off, r[1] + off), 'uarmL'))
    # biceps / triceps bulge
    mid = sh * 0.55 + el * 0.45
    out.append((ellipsoid(mid, V(r[0] * 0.95 + off, r[0] * 1.6, r[0] * 0.95 + off),
                          rot_axes(el - sh, V(1, 0, 0))), 'uarmL'))
    if upto > 1.0:
        out.append((cone(el, wr, r[2] + off, r[3] + off), 'farmL'))
        fm = el * 0.7 + wr * 0.3
        out.append((ellipsoid(fm, V(r[2] * 1.12 + off, r[2] * 1.9, r[2] * 1.0 + off), rot_axes(wr - el, V(1, 0, 0))), 'farmL'))
    return out

def leg_parts(sp, J, off=0.0):
    H = sp['H']; r = sp['legR']
    hp, kn, an = J['hipL'], J['kneeL'], J['ankL']
    out = []
    out.append((cone(hp + V(0.006 * H, 0.01 * H, 0), kn, r[0] + off, r[1] + off), 'thighL'))
    tm = hp * 0.6 + kn * 0.4
    out.append((ellipsoid(tm + V(0.003 * H, 0, 0.004 * H), V(r[0] * 1.02 + off, r[0] * 2.2, r[0] * 1.0 + off)), 'thighL'))
    out.append((sphere(kn + V(0, 0, 0.004 * H), r[1] * 1.03 + off), 'shinL'))
    out.append((cone(kn, an, r[2] + off, r[3] + off), 'shinL'))
    cm = kn * 0.7 + an * 0.3 + V(0, 0, -0.008 * H)
    out.append((ellipsoid(cm, V(r[2] * 1.05 + off, r[2] * 2.4, r[2] * 1.05 + off)), 'shinL'))
    return out

def hand_local(sp, off=0.0):
    s = sp['handS']; o = off
    parts = []
    parts.append(rbox(V(0, 0.032 * s, 0), V(0.0245 * s + o, 0.031 * s + o, 0.0088 * s + o), rr=0.0075 * s + o * 0.5))
    parts.append(ellipsoid(V(0.013 * s, 0.02 * s, -0.004 * s), V(0.012 * s + o, 0.019 * s + o, 0.0095 * s + o)))
    parts.append(cone(V(0, -0.03 * s, 0.0), V(0, 0.01 * s, 0), 0.0165 * s + o, 0.019 * s + o))
    fx = [0.0165, 0.0055, -0.0055, -0.0165]
    fl = [0.046, 0.051, 0.048, 0.038]
    fr = [0.0063, 0.0066, 0.0061, 0.0054]
    curls = [(0.16, 0.22, 0.18), (0.2, 0.26, 0.2), (0.24, 0.3, 0.22), (0.3, 0.34, 0.24)]
    for i in range(4):
        p = V(fx[i] * s, 0.061 * s - abs(fx[i]) * 0.25 * s, 0.001 * s)
        d = V(fx[i] * 0.9, 1.0, 0.0); d /= np.linalg.norm(d)
        segl = [0.46, 0.30, 0.24]
        rr = fr[i] * s
        ang = 0.0
        for j in range(3):
            ang += curls[i][j]
            dd = d * np.cos(ang) + V(0, 0, -1) * np.sin(ang)
            q = p + dd * fl[i] * s * segl[j]
            parts.append(cone(p, q, rr + o, rr * 0.9 + o))
            p = q; rr *= 0.9
        parts.append(sphere(p, rr + o))
    # thumb
    p = V(0.019 * s, 0.012 * s, -0.006 * s)
    d = V(0.62, 0.72, -0.32); d /= np.linalg.norm(d)
    rr = 0.0078 * s
    for j, L in enumerate([0.024, 0.019, 0.016]):
        d = d + V(-0.12, 0.05, -0.12) * j; d /= np.linalg.norm(d)
        q = p + d * L * s
        parts.append(cone(p, q, rr + o, rr * 0.9 + o)); p = q; rr *= 0.9
    parts.append(sphere(p, rr + o))
    def f(P):
        D = parts[0](P)
        D = smin(D, parts[1](P), 0.01 * s)
        D = smin(D, parts[2](P), 0.012 * s)
        for g in parts[3:]:
            D = smin(D, g(P), 0.0045 * s)
        return D
    return f

def hand_world(sp, J, off=0.0):
    wr = J['wrL']; d = J['dirFL']
    X = V(0, 0, 1.0); X = X - d * np.dot(X, d); X /= np.linalg.norm(X)
    Y = d; Z = np.cross(X, Y)
    R = np.stack([X, Y, Z], 1)
    fl = hand_local(sp, off)
    return lambda P: fl((P - wr) @ R)

def shoe_fn(sp, J, off=0.0):
    s = sp['footS']; an = J['ankL']
    base = V(an[0], 0.0, an[2])
    parts = [
        rbox(base + V(0, 0.009 * s, 0.038 * s), V(0.04 * s, 0.009 * s, 0.09 * s), rr=0.008 * s),
        ellipsoid(base + V(0.002 * s, 0.032 * s, 0.07 * s), V(0.037 * s, 0.03 * s, 0.062 * s)),
        ellipsoid(base + V(0, 0.045 * s, -0.012 * s), V(0.034 * s, 0.045 * s, 0.045 * s)),
    ]
    def f(P):
        D = parts[0](P)
        D = smin(D, parts[1](P), 0.012 * s)
        D = smin(D, parts[2](P), 0.015 * s)
        # collar opening slope
        q = P - base
        cut = q[:, 1] - (0.082 * s - 0.25 * np.clip(q[:, 2], -0.1, 0.3))
        D = smax(D, cut, 0.006 * s)
        # toe cap seam groove and sole edge
        D = D + 0.0007 * s * np.exp(-((q[:, 1] - 0.019 * s) / (0.0018 * s)) ** 2)
        return D
    return f

# ---------------------------------------------------------------- head
def head_fn(sp, J, kind):
    C = V(0, sp['headC'], 0.0)
    hp = sp['headP']; ex, ey, ez, er = hp['eye']
    prims = []
    A = prims.append
    A(('add', ellipsoid(C + V(*hp['crOff']), V(*hp['crR'])), 0))
    A(('add', ellipsoid(C + V(*hp['faceOff']), V(*hp['faceR'])), hp['kFace']))
    for sg in (1, -1):
        cx, cy, cz, cr = hp['cheek']
        A(('add', sphere(C + V(sg * cx, cy, cz), cr), hp['kCheek']))
        if 'jaw' in hp:
            jx, jy, jz, jr = hp['jaw']
            A(('add', ellipsoid(C + V(sg * jx, jy, jz), V(jr * 0.7, jr * 0.8, jr)), 0.02))
        bx, by, bz = hp['brow']
        A(('add', ellipsoid(C + V(sg * bx, by, bz), V(0.019, 0.0085, 0.011) * hp['browS']), 0.012))
    chx, chy, chz, chr_ = hp['chin']
    A(('add', sphere(C + V(0, chy, chz), chr_), 0.02))
    mx, my, mz = hp['muzzle']
    A(('add', ellipsoid(C + V(0, my, mz), V(mx, 0.019, 0.02)), 0.016))
    # nose
    ns = hp['noseS']
    A(('add', cone(C + V(0, ey + 0.004, ez + 0.006 * ns), C + V(0, hp['noseY'] + 0.004, hp['noseZ'] - 0.002), 0.0058 * ns, 0.0078 * ns), 0.008))
    A(('add', sphere(C + V(0, hp['noseY'], hp['noseZ']), 0.0098 * ns), 0.007))
    for sg in (1, -1):
        A(('add', sphere(C + V(sg * 0.0098 * ns, hp['noseY'] - 0.003, hp['noseZ'] - 0.0075 * ns), 0.0068 * ns), 0.005))
    # neck (head mesh carries upper neck)
    A(('add', cone(C + V(0, -0.045, -0.022 * sp['H'] / 1.1), J['neckJ'] - V(0, 0.012 * sp['H'] / 1.1, 0), sp['neckR'] * 0.98 + 0.0016, sp['neckR'] + 0.0018), 0.03))
    # ears
    for sg in (1, -1):
        exx, eyy, ezz = hp['ear']
        R = rot_axes(V(0, 1, -0.12), V(1, 0, 0.25 * sg))
        A(('add', ellipsoid(C + V(sg * exx, eyy, ezz), V(0.0095, 0.025, 0.016) * hp['earS'], R), 0.007))
        A(('sub', ellipsoid(C + V(sg * (exx + 0.006), eyy + 0.002, ezz + 0.002), V(0.005, 0.017, 0.010) * hp['earS'], R), 0.004))
    # subtractions: eye sockets, nostrils, mouth line
    for sg in (1, -1):
        A(('sub', sphere(C + V(sg * ex, ey, ez), er + 0.0016), 0.0065))
        A(('sub', sphere(C + V(sg * 0.0055 * ns, hp['noseY'] - 0.0075 * ns, hp['noseZ'] - 0.002), 0.0026 * ns), 0.0025))
    def f(P):
        D = None
        for op, g, k in prims:
            d = g(P)
            if D is None:
                D = d
            elif op == 'add':
                D = smin(D, d, k)
            else:
                D = smax(D, -d, k)
        # philtrum groove + subtle mouth crease
        q = P - C
        D = D + 0.0012 * np.exp(-((q[:, 0]) / 0.004) ** 2) * np.exp(-((q[:, 1] - (hp['mouthY'] + 0.011)) / 0.006) ** 2) * (q[:, 2] > 0)
        return D
    return f, C

def hair_fn(sp, J, kind):
    C = V(0, sp['headC'], 0.0)
    hp = sp['headP']
    crc = C + V(*hp['crOff']); crR = V(*hp['crR'])
    def cap(off):
        return ellipsoid(crc, crR + off)
    if kind == 'girl':
        outer = cap(0.0085)
        def f(P):
            q = P - C
            D = outer(P)
            # hairline: front
            n = np.array([0, -0.75, 0.66]); n /= np.linalg.norm(n)
            front = (q - V(0, 0.042, 0.05)) @ n
            D = smax(D, front, 0.006)
            # sides above ears / nape
            side = -(q[:, 1] + 0.012 + 0.55 * np.clip(-q[:, 2] - 0.02, 0, 1))
            ear = 0.05 - np.sqrt((np.abs(q[:, 0]) - 0.07) ** 2 * 0.0 + (q[:, 1] + 0.005) ** 2 + (q[:, 2] - 0.002) ** 2)
            D = smax(D, side, 0.008)
            D = smax(D, np.where(np.abs(q[:, 0]) > 0.04, ear, -1.0), 0.008)
            # bangs: thick fringe in front
            bang = ellipsoid(crc + V(0, -0.002, 0.004), crR + V(0.007, 0.006, 0.01))(P)
            bang = smax(bang, -(q[:, 2] - 0.03), 0.01)
            bang = smax(bang, 0.03 + 0.0035 * np.cos(q[:, 0] * 120) + 0.002 * fbm(P, 90, 2, 7) - q[:, 1], 0.005)
            bang = smax(bang, np.abs(q[:, 0]) - 0.058, 0.01)
            D = smin(D, bang, 0.008)
            # strands: grooves radiating from centre part
            phi = np.arctan2(q[:, 0], q[:, 1] + 0.02)
            g = np.sin(phi * 48 + 2.5 * fbm(P, 20, 2, 3))
            D = D + 0.0006 * (0.5 + 0.5 * g) * (q[:, 1] > 0.0) + 0.0006 * np.sin(q[:, 0] * 420 + 3 * fbm(P, 30, 2, 5)) * (q[:, 2] > 0.04)
            # centre part
            return D
        return f
    if kind == 'papa':
        outer = cap(0.011)
        def f(P):
            q = P - C
            bump = 0.004 * fbm(P, 55, 3, 11)
            D = outer(P) + bump - 0.003 * np.clip(q[:, 1] / 0.08, 0, 1)
            n = np.array([0, -0.68, 0.73]); n /= np.linalg.norm(n)
            D = smax(D, (q - V(0, 0.06, 0.062)) @ n, 0.008)
            side = -(q[:, 1] + 0.028 + 0.5 * np.clip(-q[:, 2] - 0.02, 0, 1))
            D = smax(D, side, 0.01)
            ear = 0.034 - np.sqrt((q[:, 1] + 0.005) ** 2 + (q[:, 2] - 0.002) ** 2)
            D = smax(D, np.where(np.abs(q[:, 0]) > 0.04, ear, -1.0), 0.008)
            # side taper (short sides)
            D = D + 0.005 * np.clip((0.04 - q[:, 1]) / 0.06, 0, 1) * (np.abs(q[:, 0]) > 0.05)
            phi = np.arctan2(q[:, 0] - 0.02, q[:, 2] + 0.05)
            D = D + 0.0007 * np.sin(phi * 40 + 3 * fbm(P, 25, 2, 13))
            return D
        return f
    if kind == 'mama':
        outer = cap(0.0105)
        bunc = C + V(0, -0.035, -0.112)
        def f(P):
            q = P - C
            D = outer(P)
            n = np.array([0.0, -0.7, 0.7]); n /= np.linalg.norm(n)
            D = smax(D, (q - V(0, 0.058, 0.062)) @ n, 0.01)
            side = -(q[:, 1] + 0.045 + 0.5 * np.clip(-q[:, 2] - 0.02, 0, 1))
            D = smax(D, side, 0.012)
            # side-swept fringe from a left part
            sweep = ellipsoid(crc + V(-0.004, -0.004, 0.006), crR + V(0.012, 0.008, 0.01))(P)
            sweep = smax(sweep, -(q[:, 2] - 0.035), 0.012)
            sweep = smax(sweep, (0.045 + 0.35 * q[:, 0]) - q[:, 1], 0.01)
            D = smin(D, sweep, 0.01)
            # bun
            bq = P - bunc
            bun = length(bq * V(1.0, 1.15, 1.3)) - 0.042
            ang = np.arctan2(bq[:, 1], bq[:, 0])
            bun = bun + 0.0016 * np.sin(ang * 3 + length(bq) * 260)
            D = smin(D, bun, 0.015)
            phi = np.arctan2(q[:, 0] + 0.025, q[:, 1] + 0.01)
            D = D + 0.0006 * (0.5 + 0.5 * np.sin(phi * 45 + 2.5 * fbm(P, 20, 2, 17))) * (bq[:, 2] > -0.0)
            return D
        return f

def pigtail_fn(sp, sg):
    C = V(0, sp['headC'], 0.0)
    base = C + V(sg * 0.068, 0.035, -0.035)
    pts = [base, base + V(sg * 0.03, -0.005, -0.012), base + V(sg * 0.045, -0.045, -0.02),
           base + V(sg * 0.042, -0.095, -0.012), base + V(sg * 0.03, -0.135, -0.002)]
    rs = [0.017, 0.022, 0.02, 0.014, 0.004]
    segs = [cone(pts[i], pts[i + 1], rs[i], rs[i + 1]) for i in range(4)]
    tie = torus(base + V(sg * 0.012, -0.002, -0.004), 0.0145, 0.0058, rot_axes(V(sg * 1.0, -0.1, -0.35), V(0, 1, 0)))
    def hair(P):
        D = segs[0](P)
        for s in segs[1:]:
            D = smin(D, s(P), 0.012)
        q = P - base
        tw = np.arctan2(q[:, 2], q[:, 0] * sg) * 7 + q[:, 1] * 140
        D = D + 0.0009 * (0.5 + 0.5 * np.sin(tw + 2 * fbm(P, 40, 2, 21))) + 0.0012 * fbm(P, 50, 2, 23)
        return D
    return hair, tie, base

# ---------------------------------------------------------------- clothes
def tee_fn(sp, J, kind):
    H = sp['H']; c = sp['cloth']
    tor0 = torso_fn(sp, J, c['off'], extend=True)
    extras = [ellipsoid(V(*pr[0]), V(*pr[1]) + c['off']) for pr in sp.get('extraTorso', []) if pr[3] == 'chest']
    def tor(P):
        D = tor0(P)
        for e in extras:
            D = smin(D, e(P), 0.03 * H)
        return D
    arms = arm_parts(sp, J, 'L', c['off'] * 0.55)
    sh, el = J['shL'], J['elL']
    sleeve_end = sh + (el - sh) * c['sleeve']
    nrm = (el - sh) / np.linalg.norm(el - sh)
    nb = J['neckJ']
    def side(P):
        A = None
        for f, _ in arms:
            d = f(P); A = d if A is None else smin(A, d, 0.006 * H)
        A = smax(A, (P - sleeve_end) @ nrm, 0.004 * H)
        return smin(tor(P), A, 0.012 * H)
    sideR = mirrored(side)
    hem = c['hem']
    def f(P):
        D = smin(side(P), sideR(P), 0.01 * H)
        # loose bottom (A-line)
        y = P[:, 1]
        D = D - c['flare'] * np.clip((c['flareY'] - y) / (c['flareY'] - hem), 0, 1)
        # hem
        D = smax(D, hem + 0.0015 * H * fbm(P, 12, 2, 31) - y, 0.003 * H)
        D = D - 0.0018 * H * np.exp(-((y - hem - 0.008 * H) / (0.006 * H)) ** 2)
        # neckline
        q = P - (nb + V(0, c['neckDy'], c['neckDz']))
        neck = length(q / V(*c['neckR'])) - 1.0
        D = smax(D, -neck * 0.03 * H, 0.006 * H)
        # wrinkles
        fold = fbm(P * V(1.0, 0.45, 1.0), 26 / H, 3, 33)
        D = D - 0.0022 * H * fold
        # horizontal sags under chest, diagonal folds from armpits
        D = D + 0.0012 * H * np.sin(y * 90 / H) * np.clip((J['chestJ'][1] - y) / (0.2 * H), 0, 1)
        return D
    return f

def shirt_collar_fn(sp, J):
    H = sp['H']; nb = J['neckJ']
    ax = rot_axes(V(0, 1, 0.18), V(1, 0, 0))
    ring = torus(nb + V(0, 0.012 * H, 0.002 * H), sp['neckR'] * 1.25, 0.006 * H, ax)
    def f(P):
        d = ring(P)
        q = P - nb
        d = smax(d, -(q[:, 2] - 0.0) - 0.5 * np.abs(q[:, 0]) + 0.0, 0.0) if False else d
        return d
    return f

def bottoms_fn(sp, J, kind):
    H = sp['H']; c = sp['bottom']
    tb = np.array(sp['torso'], float)
    tb = tb[tb[:, 0] <= c['top'] + 0.03 * H]
    tb[:, 1] += c['off']; tb[:, 2] += c['off']
    tor00 = loft(tb, tb[0, 0], c['top'], kcap=0.006 * H)
    hipx = [ellipsoid(V(*pr[0]), V(*pr[1]) + c['off']) for pr in sp.get('extraTorso', []) if pr[3] == 'hips']
    def tor(P):
        D = tor00(P)
        for e in hipx:
            D = smin(D, smax(e(P), P[:, 1] - c['top'], 0.004 * H), 0.03 * H)
        return D
    legs = leg_parts(sp, J, c['off'])
    hp, kn, an = J['hipL'], J['kneeL'], J['ankL']
    if kind == 'skirt':
        def f(P):
            y = P[:, 1]
            top = c['top']; bot = c['len']
            t = np.clip((top - y) / (top - bot), 0, 1)
            a = np.interp(y, tb[:, 0], tb[:, 1]); b = np.interp(y, tb[:, 0], tb[:, 2])
            a2 = np.where(y < tb[-1, 0], np.maximum(a, sp['hipW'] + c['off']), a) + t * c['flare']
            b2 = np.where(y < tb[-1, 0], np.maximum(b, sp['hipD'] + c['off']), b) + t * c['flare'] * 0.7
            A_ = np.where(y < tb[0, 0], sp['hipW'] + c['off'] + t * c['flare'], a2)
            B_ = np.where(y < tb[0, 0], sp['hipD'] + c['off'] + t * c['flare'] * 0.7, b2)
            ang = np.arctan2(P[:, 0], P[:, 2])
            wave = 1 + 0.06 * t * np.sin(ang * 9 + 2 * fbm(P, 8, 2, 41))
            qd = np.sqrt((P[:, 0] / A_) ** 2 + ((P[:, 2] + 0.004 * H) / B_) ** 2) - wave
            D = qd * np.minimum(A_, B_)
            D = smax(D, np.maximum(y - top, bot - y + 0.004 * H * fbm(P, 9, 2, 43)), 0.004 * H)
            D = D - 0.0016 * H * fbm(P * V(1, 0.3, 1), 30 / H, 2, 45)
            return D
        return f
    cut = c['len']  # fraction along thigh->shin chain (0..2)
    def legcut(P):
        D = None
        for g, _ in legs:
            d = g(P); D = d if D is None else smin(D, d, 0.01 * H)
        if cut <= 1.0:
            e = hp + (kn - hp) * cut; n = (kn - hp) / np.linalg.norm(kn - hp)
        else:
            e = kn + (an - kn) * (cut - 1); n = (an - kn) / np.linalg.norm(an - kn)
        D = D - c['legFlare'] * np.clip(((P - hp) @ ((kn - hp) / np.linalg.norm(kn - hp))) / (0.35 * H), 0, 1)
        D = smax(D, (P - e) @ n, 0.003 * H)
        return D
    legR = mirrored(legcut)
    def f(P):
        D = smin(tor(P), legcut(P), 0.04 * H)
        D = smin(D, legR(P), 0.04 * H)
        y = P[:, 1]
        D = D - 0.002 * H * fbm(P * V(1, 0.5, 1), 24 / H, 3, 47)
        # crotch folds
        q = P - V(0, J['hipL'][1] - 0.02 * H, 0.03 * H)
        D = D + 0.0005 * H * np.sin(np.arctan2(q[:, 1], q[:, 0]) * 10) * np.exp(-length(q) / (0.06 * H))
        # waistband ridge
        D = D - 0.0016 * H * np.exp(-((y - (c['top'] - 0.012 * H)) / (0.008 * H)) ** 2)
        return D
    return f

def apron_fn(sp, J):
    H = sp['H']
    zf = sp['apronZ']; Rc = 0.2
    cz = zf - Rc
    ytop, ybib, ybot = sp['apronY']
    def f(P):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        r = np.sqrt(x ** 2 + (z - cz) ** 2)
        ang = np.arctan2(x, z - cz)
        hw = np.where(y > ybib, 0.068 * H / 1.1, 0.13 * H / 1.1 + 0.02 * np.clip((ybib - y) / 0.2, 0, 1))
        bulge = 0.012 * np.exp(-((y - (ybib - 0.06)) / 0.05) ** 2)
        d = np.abs(r - (Rc + bulge)) - 0.0024
        w = np.abs(ang * Rc) - hw
        d = np.maximum(d, w)
        d = np.maximum(d, np.maximum(y - ytop, ybot - y))
        d = d - 0.0015 * fbm(P * V(1, 0.4, 1), 30, 2, 51)
        # pocket
        pk = np.maximum(np.abs(x) - 0.06, np.abs(y - (ybib - 0.11)) - 0.035)
        d = smin(d, np.maximum(pk, np.abs(r - Rc - 0.004) - 0.0022), 0.001)
        return d
    # straps
    s1 = cone(V(0.055 * H / 1.1, ytop - 0.005, zf - 0.008), J['neckJ'] + V(0.045 * H / 1.1, 0.012 * H, 0.012), 0.004, 0.004)
    s2 = cone(J['neckJ'] + V(0.045 * H / 1.1, 0.012 * H, 0.012), J['neckJ'] + V(0.0, 0.018 * H, -0.04 * H / 1.1), 0.004, 0.004)
    tb = np.array(sp['torso'], float)
    wy = sp['apronTieY']
    def tie(P):
        a = np.interp(P[:, 1], tb[:, 0], tb[:, 1]) + 0.004
        b = np.interp(P[:, 1], tb[:, 0], tb[:, 2]) + 0.004
        zc = np.interp(P[:, 1], tb[:, 0], tb[:, 3])
        q = np.sqrt((P[:, 0] / a) ** 2 + ((P[:, 2] - zc) / b) ** 2) - 1
        d = np.abs(q * np.minimum(a, b)) - 0.0022
        return np.maximum(d, np.abs(P[:, 1] - wy) - 0.009)
    bowc = V(0, wy, -sp['torsoBackZ'] - 0.008)
    bow1 = ellipsoid(bowc + V(0.025, 0.006, -0.004), V(0.022, 0.012, 0.006), rot_axes(V(-0.4, 1, 0), V(1, 0.4, 0)))
    bow2 = ellipsoid(bowc + V(-0.025, 0.006, -0.004), V(0.022, 0.012, 0.006), rot_axes(V(0.4, 1, 0), V(1, -0.4, 0)))
    tail1 = cone(bowc, bowc + V(0.02, -0.08, -0.01), 0.006, 0.004)
    tail2 = cone(bowc, bowc + V(-0.015, -0.085, -0.008), 0.006, 0.004)
    def g(P):
        D = f(P)
        D = smin(D, s1(P), 0.004); D = smin(D, mirrored(s1)(P), 0.004)
        D = smin(D, s2(P), 0.004); D = smin(D, mirrored(s2)(P), 0.004)
        D = smin(D, tie(P), 0.006)
        for b_ in (bow1, bow2, tail1, tail2):
            D = smin(D, b_(P), 0.004)
        return D
    return g

def scarf_fn(sp, J):
    H = sp['H']; nb = J['neckJ']
    ax = rot_axes(V(0, 1, 0.25), V(1, 0, 0))
    ring = torus(nb + V(0, 0.004 * H, 0.004 * H), sp['neckR'] * 1.32, 0.0085 * H, ax)
    tri_c = nb + V(0, -0.045 * H, sp['scarfZ'])
    def f(P):
        D = ring(P) - 0.002 * H * fbm(P, 40 / H, 2, 61)
        q = P - tri_c
        # inverted triangle hanging in front
        tri = np.maximum(np.abs(q[:, 0]) * 1.4 + (q[:, 1]) * 0.9 - 0.045 * H, -(q[:, 1]) - 0.0 * H - 0.04 * H)
        tri = np.maximum(tri, q[:, 1] - 0.03 * H)
        slab = np.abs(q[:, 2] + 0.25 * q[:, 1]) - 0.004 * H
        T = np.maximum(tri, slab) - 0.0015 * H * fbm(P, 50 / H, 2, 63)
        D = smin(D, T, 0.012 * H)
        return D
    return f

def glove_fn(sp, J):
    H = sp['H']
    hf = hand_world(sp, J, 0.0021 * sp['handS'])
    wr = J['wrL']; d = J['dirFL']
    cuff = cone(wr - d * 0.075 * sp['handS'], wr + d * 0.012, 0.0285 * sp['handS'], 0.0215 * sp['handS'])
    ax = rot_axes(d, V(1, 0, 0))
    rim = torus(wr - d * 0.074 * sp['handS'], 0.0285 * sp['handS'], 0.0022 * sp['handS'], ax)
    def f(P):
        D = smin(hf(P), cuff(P), 0.012 * sp['handS'])
        D = smax(D, -((P - (wr - d * 0.076 * sp['handS'])) @ d), 0.002)
        D = D - 0.0005 * fbm(P, 260, 2, 71)
        D = smin(D, rim(P), 0.003)
        return D
    return f

# ---------------------------------------------------------------- body skin
def body_fn(sp, J):
    H = sp['H']
    tor = torso_fn(sp, J, 0.0)
    arms = arm_parts(sp, J, 'L', 0.0, upto=2.0)
    legs = leg_parts(sp, J, 0.0)
    shp = Shape()
    shp.add(tor, 0, B['spine'])
    # chest/back definition, clavicles, buttocks, belly
    for pr in sp.get('extraTorso', []):
        shp.add(ellipsoid(V(*pr[0]), V(*pr[1])), pr[2], B[pr[3]])
    shp.add(cone(J['neckJ'] - V(0, 0.03 * H, 0), V(0, sp['headC'] - 0.02 * H, -0.018 * H), sp['neckR'] * 1.0, sp['neckR'] * 0.965), 0.02 * H, B['neck'])
    for f, reg in arms:
        shp.add(f, 0.012 * H if reg == 'clavL' else 0.006 * H, B[reg])
        shp.add(mirrored(f), 0.012 * H if reg == 'clavL' else 0.006 * H, B[reg.replace('L', 'R')])
    for f, reg in legs:
        shp.add(f, 0.035 * H if reg == 'thighL' else 0.012 * H, B[reg])
        shp.add(mirrored(f), 0.035 * H if reg == 'thighL' else 0.012 * H, B[reg.replace('L', 'R')])
    # remove feet below ankle (shoes)
    return shp

# ---------------------------------------------------------------- meshing
def polygonize(f, lo, hi, vox, target_tris, name='?'):
    t0 = time.time()
    lo = np.asarray(lo, float); hi = np.asarray(hi, float)
    n = np.ceil((hi - lo) / vox).astype(int) + 1
    xs = lo[0] + np.arange(n[0]) * vox; ys = lo[1] + np.arange(n[1]) * vox; zs = lo[2] + np.arange(n[2]) * vox
    vol = np.empty((n[0], n[1], n[2]), np.float32)
    YY, ZZ = np.meshgrid(ys, zs, indexing='ij')
    for i in range(n[0]):
        P = np.stack([np.full(YY.size, xs[i]), YY.ravel(), ZZ.ravel()], 1)
        vol[i] = f(P).reshape(n[1], n[2])
    vol[0] = vol[-1] = 1; vol[:, 0] = vol[:, -1] = 1; vol[:, :, 0] = vol[:, :, -1] = 1
    verts, faces, _, _ = marching_cubes(vol, 0.0, spacing=(vox, vox, vox))
    verts = verts + lo
    if len(faces) > target_tris:
        verts, faces = fast_simplification.simplify(verts.astype(np.float32), faces.astype(np.int64), 1 - target_tris / len(faces))
    verts = verts.astype(np.float64)
    # project back to the surface & smooth normals from gradient
    e = vox * 0.5
    for it in range(2):
        d = f(verts)
        g = grad(f, verts, e)
        verts = verts - g * d[:, None]
    nrm = grad(f, verts, e)
    # orientation: make face normals agree with gradient
    fn = np.cross(verts[faces[:, 1]] - verts[faces[:, 0]], verts[faces[:, 2]] - verts[faces[:, 0]])
    if (fn * nrm[faces[:, 0]]).sum() < 0:
        faces = faces[:, ::-1]
    print(f'  {name}: grid {tuple(n)} -> {len(verts)} v {len(faces)} t  {time.time() - t0:.1f}s', flush=True)
    return verts, faces.astype(np.int64), nrm

def grad(f, P, e):
    g = np.zeros_like(P)
    for i in range(3):
        d = np.zeros(3); d[i] = e
        g[:, i] = f(P + d) - f(P - d)
    l = np.linalg.norm(g, axis=1, keepdims=True)
    return g / np.maximum(l, 1e-12)

def bake_ao(f, P, N, scale):
    ao = np.zeros(len(P))
    w = 1.0
    for i in range(1, 6):
        h = scale * i * 0.012
        d = f(P + N * h)
        ao += w * np.clip(h - d, 0, None) / h
        w *= 0.6
    occl = np.clip(1 - 0.85 * ao, 0.25, 1)
    # also a wide-radius sample for armpits/between legs
    d2 = f(P + N * scale * 0.06)
    occl *= np.clip(0.55 + 0.45 * d2 / (scale * 0.06), 0.5, 1)
    return occl

def seg_dist(P, a, b):
    ba = b - a; pa = P - a
    h = np.clip((pa @ ba) / max(np.dot(ba, ba), 1e-12), 0, 1)
    return length(pa - ba[None] * h[:, None])

def skin_weights(P, regions, segs, sp, fixed=None):
    nb = len(BONES)
    W = np.zeros((len(P), nb))
    if fixed is not None:
        for b_, w in fixed.items():
            W[:, B[b_]] = w
    else:
        sig = 0.018 * sp['H'] / 1.1
        D = np.full((len(P), nb), 1e9)
        for name, (a, b) in segs.items():
            D[:, B[name]] = seg_dist(P, a, b)
        for i in range(len(P)):
            pass
        regname = [BONES[r] for r in regions]
        mask = np.zeros((len(P), nb), bool)
        for i, rn in enumerate(regname):
            for bn in ALLOWED.get(rn, [rn]):
                mask[i, B[bn]] = True
        Dm = np.where(mask, D, 1e9)
        dmin = Dm.min(1, keepdims=True)
        W = np.exp(-((Dm - dmin) / sig) ** 2) * mask
    # keep top 4
    idx = np.argsort(-W, 1)[:, :4]
    w4 = np.take_along_axis(W, idx, 1)
    w4 = w4 / np.maximum(w4.sum(1, keepdims=True), 1e-9)
    return idx.astype(np.uint8), w4

def region_labels(shape, P):
    _, lab = shape.eval(P, labels=True)
    return lab

def oct_encode(n):
    n = n / np.abs(n).sum(1, keepdims=True)
    o = n[:, :2].copy()
    neg = n[:, 2] < 0
    o[neg] = (1 - np.abs(o[neg][:, ::-1])) * np.sign(o[neg])
    return np.clip(np.round(o * 127), -127, 127).astype(np.int8)

class Pack:
    def __init__(self):
        self.meshes = []; self.blobs = []; self.off = 0

    def buf(self, arr):
        b = arr.tobytes()
        pad = (-len(b)) % 4
        o = self.off
        self.blobs.append(b + b'\0' * pad); self.off += len(b) + pad
        return {'o': o, 'n': int(arr.size)}

    def add(self, name, mat, P, N, F, col, sidx, swt, uv=None, extra=None):
        lo = P.min(0); hi = P.max(0); sc = (hi - lo) / 65535.0
        q = np.round((P - lo) / np.maximum(sc, 1e-12)).astype(np.uint16)
        m = {'name': name, 'mat': mat, 'lo': lo.tolist(), 'sc': sc.tolist(), 'nv': len(P),
             'pos': self.buf(q), 'nrm': self.buf(oct_encode(N)),
             'col': self.buf(np.clip(np.round(col * 255), 0, 255).astype(np.uint8)),
             'si': self.buf(sidx.astype(np.uint8)),
             'sw': self.buf(np.clip(np.round(swt * 255), 0, 255).astype(np.uint8)),
             'idx': self.buf(F.astype(np.uint16 if len(P) < 65536 else np.uint32).ravel()),
             'i32': len(P) >= 65536}
        if uv is not None:
            m['uv'] = self.buf(np.clip(np.round(uv * 65535), 0, 65535).astype(np.uint16))
        if extra:
            m.update(extra)
        self.meshes.append(m)

    def write(self, path, header):
        header['meshes'] = self.meshes
        js = json.dumps(header).encode()
        js += b' ' * ((-len(js)) % 4)
        with open(path, 'wb') as fo:
            fo.write(struct.pack('<I', len(js))); fo.write(js)
            for b in self.blobs:
                fo.write(b)
        print('wrote', path, os.path.getsize(path) // 1024, 'KB')

def srgb(*c):
    return np.array(c, float)

def find_surface(f, origin, direction, tmax=0.2):
    o = np.asarray(origin, float); d = np.asarray(direction, float); d /= np.linalg.norm(d)
    t = tmax
    # march inward from outside
    p = o + d * t
    for i in range(200):
        dist = f(p[None])[0]
        if abs(dist) < 1e-5:
            break
        p = p - d * dist * 0.9
    n = grad(f, p[None], 0.0008)[0]
    return p, n

# ---------------------------------------------------------------- characters
def spec_girl():
    H = 1.10
    sp = dict(H=H, pelvis=0.60, waist=0.70, chest=0.80, neckY=0.885, headJ=0.935, headC=1.002,
              shX=0.122, shY=0.848, uarm=0.17, farm=0.148, hand=0.112, hipX=0.054, hipY=0.575,
              kneeX=0.057, kneeY=0.315, ankY=0.058, foot=0.17, apose=24,
              armR=[0.029, 0.0235, 0.0225, 0.0185], legR=[0.056, 0.037, 0.036, 0.024],
              neckR=0.029, handS=0.92, footS=0.95, hipW=0.1, hipD=0.08,
              torso=[[0.54, 0.075, 0.06, -0.004], [0.565, 0.094, 0.074, -0.006], [0.61, 0.099, 0.078, -0.004],
                     [0.66, 0.091, 0.077, 0.006], [0.71, 0.087, 0.076, 0.010], [0.76, 0.092, 0.073, 0.007],
                     [0.81, 0.1, 0.069, 0.002], [0.845, 0.104, 0.062, -0.004], [0.87, 0.08, 0.05, -0.008], [0.888, 0.04, 0.035, -0.008]],
              extraTorso=[[(0, 0.585, -0.06), (0.085, 0.05, 0.03), 0.03, 'hips']],
              cloth=dict(off=0.0095, sleeve=0.48, hem=0.575, flare=0.02, flareY=0.74, neckDy=0.014, neckDz=0.012, neckR=(0.05, 0.03, 0.046)),
              bottom=dict(off=0.008, top=0.665, len=0.36, legFlare=0.01),
              apronZ=0.1, apronY=(0.835, 0.75, 0.43), apronTieY=0.715, torsoBackZ=0.07, scarfZ=0.05,
              skin=srgb(0.94, 0.73, 0.61), hair=srgb(0.16, 0.1, 0.065),
              headP=dict(crOff=(0, 0.014, -0.012), crR=(0.0715, 0.084, 0.087), faceOff=(0, -0.026, 0.016), faceR=(0.057, 0.057, 0.063),
                         kFace=0.03, cheek=(0.033, -0.03, 0.048, 0.027), kCheek=0.02, chin=(0, -0.066, 0.049, 0.016),
                         muzzle=(0.026, -0.047, 0.06), brow=(0.026, 0.021, 0.064), browS=0.7, noseS=0.72, noseY=-0.021, noseZ=0.079,
                         eye=(0.0275, 0.003, 0.0635, 0.0128), ear=(0.066, -0.006, -0.004), earS=0.78, mouthY=-0.046))
    return sp

def spec_papa():
    H = 1.76
    sp = dict(H=H, pelvis=0.99, waist=1.10, chest=1.27, neckY=1.46, headJ=1.535, headC=1.633,
              shX=0.19, shY=1.43, uarm=0.295, farm=0.255, hand=0.19, hipX=0.09, hipY=0.93,
              kneeX=0.095, kneeY=0.51, ankY=0.085, foot=0.27, apose=22,
              armR=[0.048, 0.039, 0.038, 0.028], legR=[0.085, 0.056, 0.055, 0.036],
              neckR=0.058, handS=1.65, footS=1.55, hipW=0.17, hipD=0.115,
              torso=[[0.88, 0.13, 0.1, -0.005], [0.93, 0.165, 0.112, -0.01], [1.0, 0.168, 0.115, -0.006],
                     [1.08, 0.158, 0.118, 0.008], [1.16, 0.162, 0.118, 0.01], [1.26, 0.175, 0.118, 0.006],
                     [1.36, 0.185, 0.11, 0.0], [1.42, 0.18, 0.098, -0.008], [1.455, 0.12, 0.075, -0.012], [1.475, 0.07, 0.06, -0.012]],
              extraTorso=[[(0, 0.96, -0.095), (0.14, 0.08, 0.05), 0.04, 'hips'],
                          [(0.07, 1.31, 0.085), (0.075, 0.06, 0.035), 0.04, 'chest'], [(-0.07, 1.31, 0.085), (0.075, 0.06, 0.035), 0.04, 'chest']],
              cloth=dict(off=0.011, sleeve=0.82, hem=0.9, flare=0.014, flareY=1.15, neckDy=0.02, neckDz=0.022, neckR=(0.075, 0.05, 0.075)),
              bottom=dict(off=0.012, top=1.09, len=1.94, legFlare=0.014),
              apronZ=0.16, apronY=(1.4, 1.25, 0.6), apronTieY=1.1, torsoBackZ=0.11, scarfZ=0.07,
              skin=srgb(0.86, 0.66, 0.53), hair=srgb(0.07, 0.06, 0.055),
              headP=dict(crOff=(0, 0.016, -0.014), crR=(0.077, 0.099, 0.1), faceOff=(0, -0.045, 0.02), faceR=(0.064, 0.075, 0.072),
                         kFace=0.03, cheek=(0.044, -0.02, 0.058, 0.022), kCheek=0.02, jaw=(0.045, -0.072, 0.025, 0.038),
                         chin=(0, -0.104, 0.064, 0.022), muzzle=(0.03, -0.068, 0.072), brow=(0.031, 0.024, 0.077), browS=1.15,
                         noseS=1.2, noseY=-0.034, noseZ=0.1, eye=(0.032, 0.006, 0.07, 0.0122), ear=(0.077, -0.01, -0.006), earS=1.2, mouthY=-0.068))
    return sp

def spec_mama():
    H = 1.62
    sp = dict(H=H, pelvis=0.92, waist=1.02, chest=1.17, neckY=1.35, headJ=1.415, headC=1.51,
              shX=0.165, shY=1.322, uarm=0.275, farm=0.235, hand=0.17, hipX=0.088, hipY=0.86,
              kneeX=0.085, kneeY=0.47, ankY=0.075, foot=0.24, apose=22,
              armR=[0.04, 0.033, 0.032, 0.024], legR=[0.082, 0.05, 0.05, 0.031],
              neckR=0.048, handS=1.45, footS=1.38, hipW=0.175, hipD=0.145,
              torso=[[0.8, 0.13, 0.1, -0.01], [0.86, 0.168, 0.114, -0.016], [0.92, 0.172, 0.115, -0.012],
                     [1.0, 0.135, 0.095, 0.0], [1.06, 0.13, 0.092, 0.004], [1.15, 0.145, 0.1, 0.012],
                     [1.24, 0.158, 0.096, 0.0], [1.305, 0.158, 0.085, -0.008], [1.34, 0.1, 0.065, -0.01], [1.36, 0.06, 0.05, -0.01]],
              extraTorso=[[(0.052, 1.175, 0.07), (0.058, 0.055, 0.045), 0.03, 'chest'], [(-0.052, 1.175, 0.07), (0.058, 0.055, 0.045), 0.03, 'chest'],
                          [(0, 0.89, -0.09), (0.14, 0.085, 0.055), 0.04, 'hips']],
              cloth=dict(off=0.012, sleeve=0.62, hem=0.86, flare=0.02, flareY=1.08, neckDy=0.016, neckDz=0.012, neckR=(0.062, 0.034, 0.06)),
              bottom=dict(off=0.012, top=1.02, len=0.26, flare=0.11),
              apronZ=0.15, apronY=(1.3, 1.16, 0.55), apronTieY=1.02, torsoBackZ=0.1, scarfZ=0.07,
              skin=srgb(0.93, 0.75, 0.64), hair=srgb(0.1, 0.07, 0.055),
              headP=dict(crOff=(0, 0.016, -0.013), crR=(0.073, 0.093, 0.095), faceOff=(0, -0.04, 0.02), faceR=(0.06, 0.07, 0.068),
                         kFace=0.03, cheek=(0.04, -0.024, 0.055, 0.023), kCheek=0.02, jaw=(0.038, -0.065, 0.025, 0.032),
                         chin=(0, -0.094, 0.06, 0.019), muzzle=(0.027, -0.061, 0.068), brow=(0.029, 0.022, 0.072), browS=0.9,
                         noseS=1.02, noseY=-0.029, noseZ=0.094, eye=(0.0305, 0.005, 0.067, 0.0122), ear=(0.073, -0.01, -0.006), earS=1.05, mouthY=-0.061))
    return sp

def planar_uv(P, x0, x1, y0, y1):
    u = (P[:, 0] - x0) / (x1 - x0)
    v = (y1 - P[:, 1]) / (y1 - y0)
    return np.stack([np.clip(u, 0, 1), np.clip(1 - v, 0, 1)], 1)

def build(kind, quality=1.0):
    print('==', kind)
    sp = {'girl': spec_girl, 'papa': spec_papa, 'mama': spec_mama}[kind]()
    H = sp['H']; s = H / 1.1
    J, bones, segs = make_rig(sp)
    pk = Pack()
    vb = 0.0034 * s if kind == 'girl' else 0.0042 * s
    Q = quality

    # ---- body
    body = body_fn(sp, J)
    bf = body.eval
    xr = J['tipL'][0] + 0.03 * s
    P, F, N = polygonize(bf, (-xr, J['ankL'][1] - 0.03 * s, -0.16 * s), (xr, sp['headC'] + 0.01 * s, 0.16 * s), vb, int(26000 * Q), 'body')
    # cut feet below shoe top (hidden) to save tris: keep all, simple
    lab = region_labels(body, P)
    si, sw = skin_weights(P, lab, segs, sp)
    ao = bake_ao(bf, P, N, s)
    col = np.tile(sp['skin'], (len(P), 1))
    # knees/elbows slightly redder, socks
    for nm in ('kneeL', 'kneeR', 'elL', 'elR'):
        w = np.exp(-(length(P - J[nm]) / (0.03 * s)) ** 2)
        col = col * (1 - 0.06 * w[:, None]) + srgb(0.95, 0.55, 0.5) * 0.06 * w[:, None]
    if kind == 'girl':
        sock = np.clip((0.115 - P[:, 1]) / 0.01, 0, 1)
        col = col * (1 - sock[:, None]) + srgb(0.93, 0.93, 0.9) * sock[:, None]
    if kind == 'papa':
        sock = np.clip((0.15 - P[:, 1]) / 0.01, 0, 1)
        col = col * (1 - sock[:, None]) + srgb(0.25, 0.25, 0.27) * sock[:, None]
    col = col * (ao[:, None] ** 0.8)
    # drop skin that is always hidden under clothes / shoes (saves a lot of triangles)
    tf_c = tee_fn(sp, J, kind); sf_c = shoe_fn(sp, J)
    cov = (tf_c(P) < -0.004 * s) | (sf_c(P) < -0.002) | (mirrored(sf_c)(P) < -0.002)
    if kind != 'mama':
        bf_c = bottoms_fn(sp, J, 'pants')
        cov |= bf_c(P) < -0.004 * s
    keep = ~(cov[F[:, 0]] & cov[F[:, 1]] & cov[F[:, 2]])
    F = F[keep]
    used = np.unique(F.ravel()); remap = np.full(len(P), -1); remap[used] = np.arange(len(used))
    P, N, col, si, sw, F = P[used], N[used], col[used], si[used], sw[used], remap[F]
    print('  body after cull:', len(P), 'v', len(F), 't')
    pk.add('body', 'skin', P, N, F, col, si, sw)

    # ---- hands (hi-res), left & mirrored right
    hw = hand_world(sp, J, 0.0)
    wr = J['wrL']; tip = J['tipL']
    lo = np.minimum(wr, tip) - 0.035 * s; hi = np.maximum(wr, tip) + 0.035 * s
    lo[1] = min(lo[1], wr[1] - 0.04 * s)
    Ph, Fh, Nh = polygonize(hw, lo, hi, 0.0011 * s, int(5000 * Q), 'hand')
    aoh = bake_ao(hw, Ph, Nh, s * 0.5)
    colh = np.tile(sp['skin'], (len(Ph), 1))
    # palm lighter, knuckles pinker
    colh = colh * (aoh[:, None] ** 0.8)
    for side in 'LR':
        PP = Ph if side == 'L' else Ph * MIR
        NN = Nh if side == 'L' else Nh * MIR
        FF = Fh if side == 'L' else Fh[:, ::-1]
        lab = np.full(len(PP), B['hand' + side])
        lab = np.where(((PP - J['wr' + side]) @ (J['dirF' + ('L' if side == 'L' else 'L')] * (MIR if side == 'R' else 1))) < 0, B['farm' + side], lab)
        si, sw = skin_weights(PP, lab, segs, sp)
        pk.add('hand' + side, 'skin', PP, NN, FF, colh, si, sw)

    # ---- gloves (girl only, rubber)
    if kind == 'girl':
        gf = glove_fn(sp, J)
        lo2 = lo - 0.05 * s; hi2 = hi + 0.02 * s
        Pg, Fg, Ng = polygonize(gf, lo2, hi2, 0.0013 * s, int(5000 * Q), 'glove')
        aog = bake_ao(gf, Pg, Ng, s * 0.5)
        colg = np.tile(srgb(0.93, 0.48, 0.58), (len(Pg), 1)) * (aog[:, None] ** 0.7)
        for side in 'LR':
            PP = Pg if side == 'L' else Pg * MIR
            NN = Ng if side == 'L' else Ng * MIR
            FF = Fg if side == 'L' else Fg[:, ::-1]
            dd = J['dirFL'] * (MIR if side == 'R' else 1)
            lab = np.where(((PP - J['wr' + side]) @ dd) < 0, B['farm' + side], B['hand' + side])
            si, sw = skin_weights(PP, lab, segs, sp)
            pk.add('glove' + side, 'rubber', PP, NN, FF, colg, si, sw)

    # ---- head
    hf, C = head_fn(sp, J, kind)
    hp = sp['headP']
    Ph, Fh, Nh = polygonize(hf, C - V(0.1, 0.175, 0.12) * (s ** 0.6), C + V(0.1, 0.11, 0.13) * (s ** 0.6), 0.0013 * s ** 0.5, int(16000 * Q), 'head')
    ao = np.clip(bake_ao(hf, Ph, Nh, 0.6), 0.6, 1) ** 0.6
    q = Ph - C
    col = np.tile(sp['skin'], (len(Ph), 1))
    cx, cy, cz, cr = hp['cheek']
    for sg in (1, -1):
        w = np.exp(-(length(q - V(sg * (cx + 0.004), cy - 0.002, cz + 0.02)) / (0.022 * (1.4 if kind == 'girl' else 1.0))) ** 2)
        blush = srgb(0.98, 0.55, 0.55)
        amt = 0.42 if kind == 'girl' else 0.2
        col = col * (1 - amt * w[:, None]) + blush * amt * w[:, None]
        we = np.exp(-(length(q - V(sg * hp['ear'][0], hp['ear'][1], hp['ear'][2])) / 0.02) ** 2)
        col = col * (1 - 0.15 * we[:, None]) + srgb(0.95, 0.55, 0.5) * 0.15 * we[:, None]
    wn = np.exp(-(length(q - V(0, hp['noseY'], hp['noseZ'])) / 0.012) ** 2)
    col = col * (1 - 0.12 * wn[:, None]) + srgb(0.97, 0.6, 0.55) * 0.12 * wn[:, None]
    if kind == 'papa':  # faint beard shadow
        wb = np.clip((hp['mouthY'] + 0.0 - q[:, 1]) / 0.02, 0, 1) * (q[:, 2] > 0.0) * np.clip((q[:, 1] + 0.14) / 0.04, 0, 1)
        col = col * (1 - 0.1 * wb[:, None]) + srgb(0.55, 0.47, 0.45) * 0.1 * wb[:, None]
    # eyelid crease / eyeshadow darkening
    ex, ey, ez, er = hp['eye']
    for sg in (1, -1):
        w = np.exp(-(length((q - V(sg * ex, ey + 0.006, ez)) / V(1.0, 0.7, 1.0)) / 0.016) ** 2)
        col = col * (1 - 0.1 * w[:, None]) + srgb(0.75, 0.52, 0.48) * 0.1 * w[:, None]
    col = col * (ao[:, None] ** 0.9)
    lab = np.where(Ph[:, 1] < J['headJ'][1] - 0.01 * s, B['neck'], B['head'])
    si, sw = skin_weights(Ph, lab, segs, sp)
    pk.add('head', 'skin', Ph, Nh, Fh, col, si, sw)

    # facial landmarks for JS rigs (eyes, mouth, brows)
    eyes = [(C + V(sg * ex, ey, ez)).tolist() for sg in (1, -1)]
    mp, mn = find_surface(hf, C + V(0, hp['mouthY'], 0), V(0, 0, 1))
    mpl, _ = find_surface(hf, C + V(0.022 * s ** 0.5, hp['mouthY'], 0), V(0, 0, 1))
    # curvature radius from sagitta
    dz = mp[2] - mpl[2]; hx = 0.022 * s ** 0.5
    Rm = (hx * hx + dz * dz) / (2 * max(dz, 1e-4))
    brows = []
    for sg in (1, -1):
        pts = []
        for t in np.linspace(-1, 1, 7):
            x = sg * (ex + t * 0.017 * (s ** 0.4))
            y = ey + 0.0185 * s ** 0.3 + 0.004 * (1 - t * t) - 0.002 * t * 0
            p, n = find_surface(hf, C + V(x, y, 0), V(0, 0, 1))
            pts.append([p.tolist(), n.tolist()])
        brows.append(pts)
    face = dict(eyes=eyes, eyeR=er, mouth=[mp.tolist(), mn.tolist(), float(Rm)], brows=brows, headC=C.tolist(),
                mouthW=0.017 * s ** 0.45)

    # ---- hair
    hrf = hair_fn(sp, J, kind)
    Pr, Fr, Nr = polygonize(hrf, C - V(0.11, 0.12, 0.14) * s ** 0.5, C + V(0.11, 0.12, 0.12) * s ** 0.5, 0.0012 * s ** 0.5, int(14000 * Q), 'hair')
    ao = bake_ao(hrf, Pr, Nr, 0.5)
    var = 0.85 + 0.3 * fbm(Pr * V(1, 0.3, 1), 60, 2, 81)
    colr = np.tile(sp['hair'], (len(Pr), 1)) * var[:, None] * (ao[:, None] ** 0.8)
    si, sw = skin_weights(Pr, None, segs, sp, fixed={'head': 1.0})
    pk.add('hair', 'hair', Pr, Nr, Fr, colr, si, sw)
    pig = []
    if kind == 'girl':
        for sg in (1, -1):
            pf, tf, base = pigtail_fn(sp, sg)
            lo3 = base + V(min(0, sg * 0.07) - 0.03, -0.16, -0.06); hi3 = base + V(max(0, sg * 0.07) + 0.03, 0.035, 0.04)
            Pp, Fp, Np = polygonize(pf, lo3, hi3, 0.0012, int(5000 * Q), 'pigtail')
            ao = bake_ao(pf, Pp, Np, 0.5)
            var = 0.85 + 0.3 * fbm(Pp, 70, 2, 83)
            colp = np.tile(sp['hair'], (len(Pp), 1)) * var[:, None] * (ao[:, None] ** 0.8)
            si, sw = skin_weights(Pp, None, segs, sp, fixed={'head': 1.0})
            nm = 'pigL' if sg > 0 else 'pigR'
            pk.add(nm, 'hair', Pp, Np, Fp, colp, si, sw, extra={'pivot': base.tolist()})
            Pt, Ft, Nt = polygonize(tf, base - 0.04, base + 0.04, 0.001, 1500, 'tie')
            colt = np.tile(srgb(0.85, 0.36, 0.42), (len(Pt), 1)) * (bake_ao(tf, Pt, Nt, 0.4)[:, None] ** 0.7)
            si, sw = skin_weights(Pt, None, segs, sp, fixed={'head': 1.0})
            pk.add('tie' + nm[-1], 'scrunchie', Pt, Nt, Ft, colt, si, sw, extra={'pivot': base.tolist()})

    # ---- clothes: top
    tf = tee_fn(sp, J, kind)
    lo = V(-xr * 0.75, sp['cloth']['hem'] - 0.03 * s, -0.15 * s); hi = V(xr * 0.75, J['neckJ'][1] + 0.05 * s, 0.15 * s)
    Pt, Ft, Nt = polygonize(tf, lo, hi, vb * 0.85, int(16000 * Q), 'top')
    lab = region_labels(body, Pt)
    si, sw = skin_weights(Pt, lab, segs, sp)
    ao = bake_ao(tf, Pt, Nt, s)
    colt = np.tile(srgb(1, 1, 1), (len(Pt), 1)) * (ao[:, None] ** 0.8)
    uvt = planar_uv(Pt, -sp['shX'] * 1.9, sp['shX'] * 1.9, sp['cloth']['hem'], J['neckJ'][1] + 0.03 * s)
    # sleeves: map along arm outward so the dye texture's sleeves land on them
    pk.add('top', 'top', Pt, Nt, Ft, colt, si, sw, uv=uvt, extra={'ao': True})

    # ---- bottoms
    kindb = 'skirt' if kind == 'mama' else 'pants'
    bf2 = bottoms_fn(sp, J, kindb)
    lo = V(-0.26 * s, J['ankL'][1] - 0.02 if kind == 'papa' else sp['bottom']['len'] - 0.08 * s, -0.17 * s)
    if kind == 'girl':
        lo[1] = J['kneeL'][1] + 0.02
    hi = V(0.26 * s, sp['bottom']['top'] + 0.03 * s, 0.17 * s)
    Pb, Fb, Nb = polygonize(bf2, lo, hi, vb, int(13000 * Q), 'bottom')
    lab = region_labels(body, Pb)
    if kind == 'mama':
        lab = np.full(len(Pb), B['hips'])
    si, sw = skin_weights(Pb, lab, segs, sp)
    ao = bake_ao(bf2, Pb, Nb, s)
    bcol = {'girl': srgb(0.36, 0.47, 0.62), 'papa': srgb(0.62, 0.56, 0.44), 'mama': srgb(0.83, 0.77, 0.66)}[kind]
    colb = np.tile(bcol, (len(Pb), 1)) * (ao[:, None] ** 0.45)
    pk.add('bottom', 'denim' if kind == 'girl' else ('chino' if kind == 'papa' else 'linen'), Pb, Nb, Fb, colb, si, sw)

    # ---- shoes
    sf = shoe_fn(sp, J)
    an = J['ankL']
    Ps, Fs, Ns = polygonize(sf, V(an[0] - 0.06 * s, -0.01, an[2] - 0.08 * s), V(an[0] + 0.06 * s, 0.11 * s, an[2] + 0.18 * s), 0.0024 * s, int(3000 * Q), 'shoe')
    ao = bake_ao(sf, Ps, Ns, s * 0.6)
    scol = {'girl': srgb(0.92, 0.9, 0.86), 'papa': srgb(0.32, 0.26, 0.22), 'mama': srgb(0.62, 0.45, 0.36)}[kind]
    sole = np.clip((0.017 * sp['footS'] - Ps[:, 1]) / 0.004, 0, 1)
    colS = np.tile(scol, (len(Ps), 1)) * (1 - sole[:, None]) + srgb(0.85, 0.82, 0.78) * sole[:, None]
    if kind == 'girl':
        stripe = np.exp(-((Ps[:, 1] - 0.03) / 0.004) ** 2)
        colS = colS * (1 - 0.6 * stripe[:, None]) + srgb(0.85, 0.42, 0.5) * 0.6 * stripe[:, None]
    colS = colS * (ao[:, None] ** 0.8)
    for side in 'LR':
        PP = Ps if side == 'L' else Ps * MIR
        NN = Ns if side == 'L' else Ns * MIR
        FF = Fs if side == 'L' else Fs[:, ::-1]
        si, sw = skin_weights(PP, None, segs, sp, fixed={'foot' + side: 1.0})
        pk.add('shoe' + side, 'shoe', PP, NN, FF, colS, si, sw)

    # ---- apron (girl)
    if False:
        af = apron_fn(sp, J)
        Pa, Fa, Na = polygonize(af, V(-0.17, 0.4, -0.13), V(0.17, 0.95, 0.15), 0.0022, int(9000 * Q), 'apron')
        lab = np.where(Pa[:, 1] > sp['waist'] + 0.03, B['chest'], B['hips'])
        lab = np.where(Pa[:, 1] > J['neckJ'][1] - 0.01, B['neck'], lab)
        si, sw = skin_weights(Pa, lab, segs, sp)
        ao = bake_ao(af, Pa, Na, 0.8)
        cola = np.tile(srgb(0.8, 0.72, 0.58), (len(Pa), 1)) * (ao[:, None] ** 0.7)
        pk.add('apron', 'canvas', Pa, Na, Fa, cola, si, sw)

    # ---- neck scarf slot (all)
    scf = scarf_fn(sp, J)
    nb = J['neckJ']
    Pc, Fc, Nc = polygonize(scf, nb - V(0.1, 0.12, 0.1) * s, nb + V(0.1, 0.06, 0.12) * s, 0.0022 * s, int(4000 * Q), 'scarf')
    ao = bake_ao(scf, Pc, Nc, 0.6 * s)
    colc = np.tile(srgb(1, 1, 1), (len(Pc), 1)) * (ao[:, None] ** 0.7)
    uvc = planar_uv(Pc, nb[0] - 0.07 * s, nb[0] + 0.07 * s, nb[1] - 0.1 * s, nb[1] + 0.04 * s)
    lab = np.where(Pc[:, 1] > nb[1] - 0.005, B['neck'], B['chest'])
    si, sw = skin_weights(Pc, lab, segs, sp)
    pk.add('scarf', 'top', Pc, Nc, Fc, colc, si, sw, uv=uvc)

    header = dict(kind=kind, H=H, bones=[dict(name=n, parent=PARENT[i], pos=np.asarray(bones[n]).tolist()) for i, n in enumerate(BONES)],
                  joints={k: np.asarray(v).tolist() for k, v in J.items()}, face=face,
                  body=dict(torso=sp['torso'], apronZ=sp['apronZ'], apronY=sp['apronY'], apronTieY=sp['apronTieY'], waist=sp['waist'], neckR=sp['neckR']))
    pk.write(os.path.join(OUT, kind + '.bin'), header)

if __name__ == '__main__':
    kinds = sys.argv[1:] or ['girl', 'papa', 'mama']
    for k in kinds:
        build(k, 1.0 if k == 'girl' else 0.72)
