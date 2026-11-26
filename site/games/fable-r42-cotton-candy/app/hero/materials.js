// わたあめと糸の材質（ShaderMaterial）。three は引数で受け取る。
//   CORE  ：中の芯（不透明、深度あり）
//   SHELL ：毛羽のシェル（半透明、深度書き込みなし、aShell はインスタンスごと 0..1）
//   COPY  ：棚に並べる静止コピー（芯とシェルを1つの形に焼いたもの。半透明＋深度あり、三角形は 芯 → 内のシェル → 外のシェル の順。aShell は頂点ごと、芯は −1）
// NaN 防止：normalize の入力に小さな値を足す、割り算の分母は max(…, 1e-5)。

const CANDY_VERT = /* glsl */`
attribute vec4 aC0;   // rgb：外の層の色（線形）、a：その層の厚み（m）
attribute vec4 aC1;   // rgb：その下の層の色、a：毛羽の長さ（m）
attribute vec3 aFx;   // x：絡んだばかり 0..1、y：かじられた面 0..1、z：くぼみ（谷 +1 〜 山 −1）
#ifndef CORE
attribute float aShell;
#endif
uniform float uTime;
uniform float uInset;      // 芯を表面からどれだけ沈めるか（毛羽の長さに対する比）
uniform float uPuff;       // 絡んだばかりの所の毛羽を伸ばす量
uniform float uSway;       // 毛先のゆらぎ
uniform float uLayerFull;  // 新しい色の層がこの厚みで下の色を覆いきる（m）
varying vec3 vNw;
varying vec3 vPw;
varying vec3 vNl;
varying vec3 vPl;
varying vec3 vC0;
varying vec3 vC1;
varying float vCover;
varying vec4 vK;           // (シェルの高さ h（芯は −1）, 絡んだばかり, かじられた面, 毛羽の長さ)
varying float vCav;

void main() {
#ifdef CORE
  float h = -1.0;
#else
  float h = aShell;
#endif
  float fl = aC1.a;
  float isCore = step(h, -0.5);
  float hs = max(h, 0.0);
  // 表面からの高さ s（m）：芯は内側、シェルは内側から毛先まで
  float s = fl * mix(mix(-uInset * 0.7, 1.0, hs), -uInset, isCore);
  s += fl * aFx.x * uPuff * hs;
  vec3 p = position + normal * s;
  float ph = dot(position, vec3(37.0, 23.0, 31.0));
  p += vec3(sin(uTime * 1.7 + ph), cos(uTime * 1.3 + ph * 1.3), sin(uTime * 1.1 + ph * 0.7)) * (fl * uSway * hs * hs);
  // 色の層：表面から深さ tO までが外の層の色。層が薄いほど、下の色が房ごとに透けて残る（fragment で）
  float tO = aC0.a;
  float wd = 0.0015 + 0.25 * tO;
  vCover = (1.0 - smoothstep(tO - wd, tO + wd, -s)) * clamp(tO / uLayerFull, 0.0, 1.0);
  vC0 = aC0.rgb;
  vC1 = aC1.rgb;
  vK = vec4(h, aFx.x, aFx.y, fl);
  vCav = aFx.z;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vPw = wp.xyz;
  vNw = mat3(modelMatrix) * normal;
  vNl = normal;
  vPl = position;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const CANDY_FRAG = /* glsl */`
uniform sampler2D uFiber;   // 綿の繊維の写真（白黒）
uniform sampler2D uFuzz;    // 毛羽の密度（手続き）：R 巻く向きの糸、G 房、B ばらけた糸
uniform vec3 uKeyDir;
uniform vec3 uKeyCol;
uniform vec3 uFillDir;
uniform vec3 uFillCol;
uniform vec3 uSkyCol;
uniform vec3 uGroundCol;
uniform vec3 uShadeTint;
uniform float uWrap;
uniform float uRim;
uniform float uAoCore;
uniform float uCavity;
uniform float uGlow;
uniform float uFiberScale;
uniform float uFuzzScale;
uniform float uTime;
varying vec3 vNw;
varying vec3 vPw;
varying vec3 vNl;
varying vec3 vPl;
varying vec3 vC0;
varying vec3 vC1;
varying float vCover;
varying vec4 vK;
varying float vCav;

vec4 tri(sampler2D t, vec3 q, vec3 w) {
  // 横の投影は u を「棒のまわり」に、v を棒に沿わせる（糸が棒に巻いて見える）
  return texture2D(t, q.zy) * w.x + texture2D(t, q.xz) * w.y + texture2D(t, q.xy) * w.z;
}

void main() {
  float h = vK.x;
  float fresh = vK.y;
  float cut = vK.z;
  float hs = max(h, 0.0);
  vec3 nl = normalize(vNl + vec3(0.0, 1e-5, 0.0));
  vec3 w = abs(nl); w *= w; w *= w;
  w /= max(w.x + w.y + w.z, 1e-5);
  // 糸は根元から毛先へ少し流れ、ゆっくり揺れる
  vec3 q = vPl * uFuzzScale + vec3(0.11, 0.07, -0.09) * hs + vec3(0.013, 0.0, 0.009) * sin(uTime * 0.9 + hs * 3.0);
  vec3 fz = tri(uFuzz, q, w).rgb;
  float alpha = 1.0;
#ifndef CORE
  if (h >= 0.0) {
    float dens = fz.r * 0.62 + fz.g * 0.5 + fz.b * 0.3;
    float thr = mix(0.08, 0.80, hs) - fresh * 0.16;
    alpha = smoothstep(thr - 0.10, thr + 0.22, dens) * mix(0.94, 0.42, hs * hs);
    alpha *= smoothstep(0.0, 0.0012, vK.w);
  }
#endif
  // 色の層：新しい色は、厚みに応じて房ごとに現れる（薄い所は下の色が残る）
  float tuftN = fz.g * 0.9 + fz.b * 0.2;
  float m = smoothstep(tuftN * 0.8 - 0.24, tuftN * 0.8 + 0.24, vCover * 1.3) * clamp(vCover * 8.0, 0.0, 1.0);
  vec3 base = mix(vC1, vC0, m);

  vec3 N = normalize(vNw + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(cameraPosition - vPw + vec3(0.0, 1e-5, 0.0));
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float kd = clamp((dot(N, uKeyDir) + uWrap) / (1.0 + uWrap), 0.0, 1.0);
  kd = kd * kd * (3.0 - 2.0 * kd);
  float fd = clamp(dot(N, uFillDir) * 0.5 + 0.5, 0.0, 1.0);
  float sky = N.y * 0.5 + 0.5;

  // 光が中で散る：明るい側は白っぽく、影の側は色が濃く深くなる
  vec3 deep = mix(base * base, base, 0.35) * uShadeTint;
  vec3 lit = mix(base, vec3(1.0), 0.16);
  // 奥（芯・内側のシェル）は外の毛羽に隠れて暗い。房と房の谷は暗く濃く、山は明るく（形が読める）
  float ao = h < 0.0 ? uAoCore : mix(uAoCore + 0.06, 1.0, hs);
  ao *= 1.0 - uCavity * clamp(vCav, -0.35, 1.0);
  ao = clamp(ao, 0.0, 1.2);
  vec3 alb = mix(deep, lit, clamp((kd * 0.85 + sky * 0.2) * ao, 0.0, 1.0));
  vec3 light = mix(uGroundCol, uSkyCol, sky) + uKeyCol * kd + uFillCol * fd;
  vec3 col = alb * light * mix(0.62, 1.0, ao);
  // 繊維のすじ
#ifdef CORE
  float fib = tri(uFiber, vPl * uFiberScale, w).r;
  col *= mix(0.78, 1.08, smoothstep(0.45, 0.95, fib));
#else
  col *= 0.94 + 0.12 * fz.r;
#endif
  // 縁は薄くて光が抜ける
  float rim = pow(max(1.0 - ndv, 1e-4), 2.2);
  col += mix(base, vec3(1.0), 0.6) * rim * uRim * (0.45 + 0.55 * kd);
  // かじられた面：つぶれて色が濃い
  col = mix(col, deep * light * 1.04, cut * 0.55);
  // 絡んだばかり：白く光る
  col = mix(col, vec3(1.06), fresh * 0.32);
  col += uGlow * vec3(0.30, 0.24, 0.10);
#ifdef COPY
  if (alpha < 0.03) discard;     // コピーは深度を書くので、見えない所は捨てる
#endif
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const RIBBON_VERT = /* glsl */`
attribute vec3 aTan;    // 糸の向き
attribute vec2 aSide;   // (±1, 幅の半分 m)
attribute vec4 aCol;    // 線形 rgb と不透明度
varying vec4 vCol;
varying float vS;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 t = mat3(modelViewMatrix) * aTan;
  vec2 n = vec2(-t.y, t.x);
  n /= max(length(n), 1e-5);
  mv.xy += n * (aSide.x * aSide.y);
  vCol = aCol;
  vS = aSide.x;
  gl_Position = projectionMatrix * mv;
}`;

const RIBBON_FRAG = /* glsl */`
varying vec4 vCol;
varying float vS;
void main() {
  float e = max(1.0 - vS * vS, 0.0);
  gl_FragColor = vec4(vCol.rgb, vCol.a * e);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// hero 全体で共有する uniform（時間・光・テクスチャ）。値の入れ物を共有するので、どの材質にも同じ値が届く
export function makeSharedUniforms(THREE, P, fiberTex, fuzzTex) {
  const v3 = a => new THREE.Vector3(a[0], a[1], a[2]);
  return {
    uTime: { value: 0 },
    uFiber: { value: fiberTex },
    uFuzz: { value: fuzzTex },
    uKeyDir: { value: v3(P.keyDir).normalize() },
    uKeyCol: { value: v3(P.keyCol) },
    uFillDir: { value: v3(P.fillDir).normalize() },
    uFillCol: { value: v3(P.fillCol) },
    uSkyCol: { value: v3(P.skyCol) },
    uGroundCol: { value: v3(P.groundCol) },
    uShadeTint: { value: v3(P.shadeTint) },
    uWrap: { value: P.lightWrap },
    uRim: { value: P.rim },
    uAoCore: { value: P.aoCore },
    uCavity: { value: P.cavity },
    uFiberScale: { value: P.fiberScale },
    uFuzzScale: { value: P.fuzzScale },
    uInset: { value: P.coreInset },
    uPuff: { value: P.freshPuff },
    uSway: { value: P.furSway },
    uLayerFull: { value: P.layerFull },
  };
}

// kind: 'CORE' | 'SHELL' | 'COPY'。uGlow は材質ごと（今の割り箸だけ光らせる）
export function makeCandyMaterial(THREE, shared, kind) {
  const m = new THREE.ShaderMaterial({
    name: 'candy-' + kind.toLowerCase(),
    defines: { [kind]: 1 },
    uniforms: { ...shared, uGlow: { value: 0 } },
    vertexShader: CANDY_VERT, fragmentShader: CANDY_FRAG,
  });
  if (kind === 'SHELL') { m.transparent = true; m.depthWrite = false; }
  if (kind === 'COPY') { m.transparent = true; m.depthWrite = true; }   // 1 draw call の中で 芯 → シェル の順に重ねる
  return m;
}

export function makeRibbonMaterial(THREE) {
  return new THREE.ShaderMaterial({
    name: 'candy-thread',
    vertexShader: RIBBON_VERT, fragmentShader: RIBBON_FRAG,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  });
}
