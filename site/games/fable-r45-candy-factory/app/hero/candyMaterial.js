// 飴の色の層：「元の位置 → 今の位置」の写像を、操作の履歴（op）として持ち、
// フラグメントシェーダーで新しい順（逆順）にたどって元の色を引く。
//
// 今の座標：t（体積で測った長さ方向 0〜1）、p = (px, py)（単位円の断面。px は面内の法線 N、py は手前 B）。
// 計算は極座標 (r, ang) で進める。op は3種類：
//   1 LUMP  … 新しい色のかたまりが外側（角 alpha の側）に、弦で区切られた「ふた」として乗る。
//             弦より内側は、元の円全体を高さ方向に詰め直した像（面積一様。帯は帯のまま、縁は縁へ）。
//   2 FOLD  … 二つ折り。断面は2つの扇形に分かれ、それぞれが元の円全体を角度方向に畳んだ像
//             （半径は保つ・面積は一様に 1/f 倍 ＝ 体積を保つ）。t は前半／後半へ。
//   3 TWIST … 断面を t に応じて回す。芯は外側より遅れる（κ）ので、断面には渦が残る。
// 縞の境目は、写像のヤコビアンを一緒に運んで（自動微分）画素の大きさでぼかす。
// 細くなりすぎた層は面積比で混ぜる（＝平均色へなめらかに溶ける）。ループの中で微分命令は使わない。

export const MAX_OPS = 32;
export const OP_LUMP = 1, OP_FOLD = 2, OP_TWIST = 3;

const VERT_HEAD = /* glsl */`
attribute vec3 aCandy;
varying vec3 vCandy;
`;

const FRAG_HEAD = /* glsl */`
#define C_MAXOPS ${MAX_OPS}
uniform vec4 uOpA[C_MAXOPS];
uniform vec4 uOpB[C_MAXOPS];
uniform int uOpCount;
uniform vec3 uPal[6];
uniform vec3 uBase;
uniform float uGlow;
uniform float uFill;
varying vec3 vCandy;

float cWrap(float a) { return a - 6.28318531 * floor(a / 6.28318531 + 0.5); }

// c = (t, px, py)。gx, gy は c の画面微分（dFdx, dFdy）。
vec3 candyColor(vec3 c, vec3 gx, vec3 gy) {
  if (c.x < -0.5) return vec3(1.0, 0.965, 0.92); // 棒（白）
  float t = clamp(c.x, 0.0, 1.0);
  vec2 p = c.yz;
  float r2 = dot(p, p);
  float r = min(sqrt(max(r2, 0.0)), 1.0);
  float rs = max(r, 0.02);
  float ang = (abs(p.x) + abs(p.y) < 1e-6) ? 0.0 : atan(p.y, p.x);
  // (r, ang, t) の画面微分
  vec2 dr = vec2(dot(p, gx.yz), dot(p, gy.yz)) / rs;
  vec2 da = vec2(p.x * gx.z - p.y * gx.y, p.x * gy.z - p.y * gy.y) / (rs * rs);
  vec2 dt = vec2(gx.x, gy.x);

  vec3 acc = vec3(0.0);
  float wRem = 1.0;
  for (int i = 0; i < C_MAXOPS; i++) {
    int k = uOpCount - 1 - i;
    if (k < 0) break;
    if (wRem < 0.004) break;
    vec4 A = uOpA[k];
    vec4 B = uOpB[k];
    if (A.x < 1.5) {
      // ---- LUMP: A = (1, alpha, -, frac), B = (colorIndex, t0, progress, 0)
      // 新しいかたまりは alpha の側の「ふた」（面積比 frac）。その下は、元の円全体を
      // 高さ方向に面積が一様になるように詰め直した像（弦は弦へ、縁は縁へ。帯は帯のまま残る）。
      float sp = clamp((B.z * 1.4 - abs(t - B.y)) / 0.3, 0.0, 1.0);
      sp = sp * sp * (3.0 - 2.0 * sp);
      float phc = 1.0 - A.w * sp;                      // 弦より下の面積比
      float rel = ang - A.y;
      float cs = cos(rel), sn = sin(rel);
      float h = r * cs, x = r * sn;
      vec2 dh = cs * dr - x * da;
      vec2 dx = sn * dr + h * da;
      float om = max(1.0 - h * h, 1e-4);
      float sq = sqrt(om);
      float phh = 1.0 - (acos(clamp(h, -1.0, 1.0)) - h * sq) * 0.318309886; // 高さ h より下の面積比
      float dist = (phh - phc) * 1.5707963 / max(sq, 0.06);                    // 弦までの距離（h の単位）
      float e = clamp(0.75 * (abs(dh.x) + abs(dh.y)), 1e-4, 4.0);
      float cov = smoothstep(-e, e, dist);
      cov = mix(cov, A.w * sp, smoothstep(0.35, 1.3, e));
      int ci = int(clamp(B.x, 0.0, 5.0) + 0.5);
      acc += wRem * cov * uPal[ci];
      wRem *= 1.0 - cov;
      if (sp > 1e-3) {
        // H = Φ⁻¹(Φ(h) / Φ(c))。Φ⁻¹ は近似式（誤差 0.003 以下、両端は厳密）
        float yv = clamp(2.0 * min(phh, phc) / phc - 1.0, -1.0, 1.0);
        float av = 1.0 - abs(yv);
        float Hh = 1.0 - pow(max(av, 1e-6), 0.6666667) * (0.8853 + av * (0.1107 + 0.004 * av));
        Hh = yv < 0.0 ? -Hh : Hh;
        float oH = max(1.0 - Hh * Hh, 1e-4);
        float sc = sqrt(oH / om);
        float scs = max(sc, 0.05);
        float oms = max(om, 0.02);
        vec2 dH = (phh < phc) ? dh / (phc * scs) : vec2(0.0);
        vec2 ds = ((h * sc * sc - Hh / (phc * scs)) / (oms * scs)) * dh;
        float x2 = x * sc;
        vec2 dx2 = sc * dx + x * ds;
        float rr = sqrt(x2 * x2 + Hh * Hh);
        float rrs = max(rr, 0.02);
        dr = (x2 * dx2 + Hh * dH) / rrs;
        da = (Hh * dx2 - x2 * dH) / (rrs * rrs);
        r = min(rr, 1.0);
        ang = A.y + ((abs(x2) + abs(Hh) < 1e-6) ? 0.0 : atan(x2, Hh));
      }
    } else if (A.x < 2.5) {
      // ---- FOLD: A = (2, psi, phis, asym)
      // 帯1（前半）は角度の割合 f1、帯2（後半）は 1−f1 の扇形。どちらも元の円1周を畳んだ像。
      float f1 = clamp(0.5 + A.w * (1.0 - t), 0.15, 0.85);
      float m2 = 1.0 - f1;
      float d = cWrap(ang - A.y);
      float tq = t - 0.5 * t * t;
      if (abs(d) < m2 * 3.14159265) {
        float k2 = 1.0 / m2;
        float dk = -k2 * A.w / m2;
        ang = A.z + 3.14159265 - d * k2;
        da = -k2 * da - d * dk * dt;
        dt = -m2 * dt;
        t = 1.0 - (0.5 * t - A.w * tq);
      } else {
        float k1 = 1.0 / f1;
        float dk = k1 * A.w / f1;
        float d1 = cWrap(d - 3.14159265);
        ang = A.z + 3.14159265 + d1 * k1;
        da = k1 * da + d1 * dk * dt;
        dt = f1 * dt;
        t = 0.5 * t + A.w * tq;
      }
      t = clamp(t, 0.0, 1.0);
    } else {
      // ---- TWIST: A = (3, a, b, kappa), B = (c, 1/s, G0, Ginv)
      float u = (t - B.x) * B.y;
      float q = inversesqrt(1.0 + u * u);
      float G = (u * q - B.z) * B.w;
      float sw = 1.0 - A.w * (1.0 - r * r);
      float th = A.y + A.z * G;
      ang -= th * sw;
      da -= (A.z * B.w * B.y * q * q * q * sw) * dt + (th * A.w * 2.0 * r) * dr;
    }
  }
  acc += wRem * uBase;
  return acc;
}
`;

// op の一覧（JS 側）を uniform 配列へ詰める
export function packOps(ops, uniforms) {
  const A = uniforms.uOpA.value, B = uniforms.uOpB.value;
  const n = Math.min(ops.length, MAX_OPS);
  for (let i = 0; i < n; i++) {
    const o = ops[i], j = i * 4;
    if (o.type === OP_LUMP) {
      A[j] = 1; A[j + 1] = o.alpha; A[j + 2] = 0; A[j + 3] = o.frac;
      B[j] = o.color; B[j + 1] = o.t0; B[j + 2] = o.prog; B[j + 3] = 0;
    } else if (o.type === OP_FOLD) {
      A[j] = 2; A[j + 1] = o.psi; A[j + 2] = o.phis; A[j + 3] = o.asym;
      B[j] = 0; B[j + 1] = 0; B[j + 2] = 0; B[j + 3] = 0;
    } else {
      const s = Math.max(o.s, 0.05), c = o.c;
      const gf = (u) => u / Math.sqrt(1 + u * u);
      const G0 = gf(-c / s), G1 = gf((1 - c) / s);
      A[j] = 3; A[j + 1] = o.a; A[j + 2] = o.b; A[j + 3] = o.kappa;
      B[j] = c; B[j + 1] = 1 / s; B[j + 2] = G0; B[j + 3] = 1 / Math.max(G1 - G0, 1e-3);
    }
  }
  uniforms.uOpCount.value = n;
}

export function createCandyUniforms(THREE, palLinear) {
  return {
    uOpA: { value: new Float32Array(MAX_OPS * 4) },
    uOpB: { value: new Float32Array(MAX_OPS * 4) },
    uOpCount: { value: 0 },
    uPal: { value: palLinear },
    uBase: { value: new THREE.Vector3(1, 1, 1) },
    uGlow: { value: 0 },
    uFill: { value: 0.1 },
  };
}

// 今の状態の写し（切ったピース用。hero の今の状態とは共有しない）
export function snapshotUniforms(THREE, src) {
  const u = createCandyUniforms(THREE, src.uPal.value);
  u.uOpA.value.set(src.uOpA.value);
  u.uOpB.value.set(src.uOpB.value);
  u.uOpCount.value = src.uOpCount.value;
  u.uBase.value.copy(src.uBase.value);
  u.uFill.value = src.uFill.value;
  return u;
}

function onCompile(shader) {
  // this = material
  const u = this.userData.candyUniforms;
  for (const k in u) shader.uniforms[k] = u[k];
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\n' + VERT_HEAD)
    .replace('#include <begin_vertex>', '#include <begin_vertex>\n  vCandy = aCandy;');
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\n' + FRAG_HEAD)
    .replace('#include <map_fragment>', /* glsl */`
  vec3 candyCol = candyColor(vCandy, dFdx(vCandy), dFdy(vCandy));
  #ifdef USE_MAP
    float candySheen = texture2D(map, vMapUv).g;
    diffuseColor.rgb *= candyCol * (0.80 + 0.26 * candySheen);
  #else
    diffuseColor.rgb *= candyCol;
  #endif
`)
    .replace('#include <emissivemap_fragment>', /* glsl */`#include <emissivemap_fragment>
  {
    vec3 cvd = normalize(vViewPosition + vec3(0.0, 0.0, 1e-5));
    float cfr = pow(max(1.0 - abs(dot(normal, cvd)), 1e-4), 2.5);
    totalEmissiveRadiance += candyCol * (uFill + uGlow) + mix(candyCol, vec3(1.0), 0.6) * (cfr * 0.16);
  }
`);
}

export function createCandyMaterial(THREE, sheenTex, uniforms) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, map: sheenTex || null, roughness: 0.36, metalness: 0.0,
    clearcoat: 0.85, clearcoatRoughness: 0.2,
    bumpMap: sheenTex || null, bumpScale: 0.8,
  });
  mat.userData.candyUniforms = uniforms;
  mat.onBeforeCompile = onCompile;
  mat.customProgramCacheKey = () => 'candy-layers-v1';
  return mat;
}
