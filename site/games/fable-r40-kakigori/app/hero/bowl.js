// 器：断面の折れ線を回して作る（variant で色・柄・縁の形が変わる）。three は引数でもらう。
// 柄は 256² の Canvas 1枚に全 variant 分を横帯で描き、UV で選ぶ（棚の複製も同じテクスチャを共有する）。

export const BOWL_VARIANTS = [
  // base: 外側の地色、inner: 内側、band: 縁と足、motif: 柄、scallop: 縁の波（数・深さ）
  { base: '#8fd3ff', inner: 0xf6fbff, band: 0x3f8fe0, motif: 'wave', ink: '#ffffff', ink2: '#4a9be8', scallopN: 0, scallopA: 0, repeat: 6 },
  { base: '#ffb9d0', inner: 0xfff7fa, band: 0xf0608f, motif: 'heart', ink: '#ffffff', ink2: '#ff5c8a', scallopN: 10, scallopA: 0.035, repeat: 5 },
  { base: '#c9f2b6', inner: 0xf8fff3, band: 0x52b356, motif: 'stripe', ink: '#ffffff', ink2: '#7fd47a', scallopN: 20, scallopA: 0.014, repeat: 10 },
  { base: '#ffe394', inner: 0xfffbf0, band: 0xf2a01e, motif: 'flower', ink: '#ffffff', ink2: '#ff9a3c', scallopN: 8, scallopA: 0.03, repeat: 4 },
  { base: '#dcc8ff', inner: 0xfbf8ff, band: 0x9a6ee8, motif: 'star', ink: '#fff6b0', ink2: '#ffffff', scallopN: 6, scallopA: 0.04, repeat: 6 },
];

const ROW = 46, ROW_PAD = 5, PLAIN = 16; // 帯の高さ（px）、帯の上下の余白、下端の白い帯

// 柄の Canvas（256²）。帯 i は y = PLAIN + i·ROW から ROW の高さ。
export function makeBowlAtlas(THREE) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 256);
  BOWL_VARIANTS.forEach((v, i) => {
    const y0 = PLAIN + i * ROW, cy = y0 + ROW / 2;
    g.fillStyle = v.base; g.fillRect(0, y0, 256, ROW);
    g.save(); g.beginPath(); g.rect(0, y0 + ROW_PAD, 256, ROW - 2 * ROW_PAD); g.clip();
    if (v.motif === 'wave') {
      g.lineWidth = 3.2; g.lineCap = 'round';
      for (let r = 0; r < 3; r++) {
        g.strokeStyle = r === 1 ? v.ink2 : v.ink; g.beginPath();
        for (let x = -4; x <= 260; x += 2) { const y = y0 + 12 + r * 11 + Math.sin((x / 256) * Math.PI * 4 + r * 1.3) * 3.6; if (x < 0) g.moveTo(x, y); else g.lineTo(x, y); }
        g.stroke();
      }
    } else if (v.motif === 'heart') {
      const heart = (x, y, s, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x, y + s * 0.9); g.bezierCurveTo(x - s * 1.5, y - s * 0.1, x - s * 0.8, y - s * 1.2, x, y - s * 0.35); g.bezierCurveTo(x + s * 0.8, y - s * 1.2, x + s * 1.5, y - s * 0.1, x, y + s * 0.9); g.fill(); };
      for (const dx of [0, 256]) { heart(64 + dx - 256, cy - 1, 11, v.ink2); heart(64 + dx, cy - 1, 11, v.ink2); heart(192 + dx - 256, cy + 1, 8, v.ink); heart(192 + dx, cy + 1, 8, v.ink); }
      g.fillStyle = v.ink; for (const [x, y] of [[0, y0 + 12], [128, y0 + 13], [0, y0 + 35], [128, y0 + 34], [256, y0 + 12], [256, y0 + 35]]) { g.beginPath(); g.arc(x, y, 3.6, 0, 7); g.fill(); }
    } else if (v.motif === 'stripe') {
      g.fillStyle = v.ink; g.fillRect(0, y0, 64, ROW); g.fillRect(128, y0, 64, ROW);
      g.fillStyle = v.ink2; g.fillRect(64, y0, 6, ROW); g.fillRect(122, y0, 6, ROW); g.fillRect(192, y0, 6, ROW); g.fillRect(250, y0, 6, ROW);
    } else if (v.motif === 'flower') {
      const flower = (x, y, s, col) => { g.fillStyle = col; for (let p = 0; p < 5; p++) { const a = (p / 5) * Math.PI * 2 - Math.PI / 2; g.beginPath(); g.arc(x + Math.cos(a) * s, y + Math.sin(a) * s, s * 0.72, 0, 7); g.fill(); } g.fillStyle = '#ffd23c'; g.beginPath(); g.arc(x, y, s * 0.6, 0, 7); g.fill(); };
      for (const dx of [-256, 0, 256]) { flower(64 + dx, cy, 9.5, v.ink); flower(192 + dx, cy, 7.5, v.ink2); }
      g.fillStyle = v.ink; for (const x of [0, 128, 256]) { g.beginPath(); g.arc(x, y0 + 12, 3, 0, 7); g.fill(); g.beginPath(); g.arc(x, y0 + 34, 3, 0, 7); g.fill(); }
    } else {
      const star = (x, y, s, col) => { g.fillStyle = col; g.beginPath(); for (let p = 0; p < 10; p++) { const a = (p / 10) * Math.PI * 2 - Math.PI / 2, r = p % 2 ? s * 0.45 : s; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.closePath(); g.fill(); };
      for (const dx of [-256, 0, 256]) { star(64 + dx, cy - 2, 13, v.ink); star(192 + dx, cy + 3, 8, v.ink2); star(128 + dx, y0 + 12, 5, v.ink2); star(dx, y0 + 34, 5, v.ink); }
    }
    g.restore();
  });
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.ClampToEdgeWrapping; tex.anisotropy = 4; tex.name = 'hero.bowlAtlas';
  return tex;
}

// 断面（r, y）。kind: 0=足, 1=外の壁（柄が乗る）, 2=縁, 3=縁の内側（氷のメッシュの端を隠す）
function profile(d, wallSteps) {
  const R = d.rimRadius, RY = d.rimHeight, Ro = R + 0.005, y0 = d.footHeight, p = d.floorPow, fr = d.footRadius;
  const pts = [[fr + 0.001, 0, 0], [fr + 0.002, 0.004, 0], [fr - 0.003, y0 - 0.002, 0]];
  const rStart = fr - 0.005;
  for (let i = 0; i <= wallSteps; i++) {
    const u = i / wallSteps, r = rStart + (Ro - rStart) * Math.pow(u, 0.85);
    pts.push([r, y0 + (RY - 0.001 - y0) * Math.pow(r / Ro, p), 1, u]);
  }
  pts.push([Ro + 0.0022, RY + 0.0022, 2], [Ro + 0.0008, RY + 0.0052, 2], [R - 0.0015, RY + 0.0056, 2], [d.innerRadius - 0.0008, RY + 0.0034, 3], [d.innerRadius - 0.0024, RY - 0.006, 3]);
  return pts;
}

// 器のジオメトリ。seg：周方向の分割、wallSteps：壁の段数。
export function buildBowlGeometry(THREE, d, variantIndex, seg, wallSteps) {
  const v = BOWL_VARIANTS[variantIndex];
  const pts = profile(d, wallSteps), nP = pts.length, nV = nP * (seg + 1);
  const pos = new Float32Array(nV * 3), col = new Float32Array(nV * 3), uv = new Float32Array(nV * 2);
  const band = new THREE.Color(v.band), inner = new THREE.Color(v.inner), white = new THREE.Color(1, 1, 1);
  const foot = band.clone().lerp(new THREE.Color(v.base), 0.35);
  const vTop = 1 - (PLAIN + variantIndex * ROW + ROW_PAD + 1) / 256, vBot = 1 - (PLAIN + (variantIndex + 1) * ROW - ROW_PAD - 1) / 256, vPlain = 1 - 6 / 256;
  for (let a = 0; a <= seg; a++) {
    const th = (a / seg) * Math.PI * 2, cs = Math.cos(th), sn = Math.sin(th);
    const lobe = v.scallopN ? Math.cos(th * v.scallopN) : 0;
    for (let i = 0; i < nP; i++) {
      const [r0, y, kind, u] = pts[i], k = a * nP + i;
      // 縁の波：壁の上ほど強く、内側の縁は円のまま
      const w = kind === 1 ? u * u : kind === 2 ? (i === nP - 3 ? 0.45 : 1) : 0;
      const r = r0 * (1 + v.scallopA * w * lobe), yy = y + (kind === 2 ? v.scallopA * 0.05 * lobe : 0);
      pos[k * 3] = cs * r; pos[k * 3 + 1] = yy; pos[k * 3 + 2] = sn * r;
      const c = kind === 0 ? foot : kind === 1 ? white : kind === 2 ? band : inner;
      col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
      uv[k * 2] = (a / seg) * v.repeat;
      uv[k * 2 + 1] = kind === 1 ? vBot + (vTop - vBot) * u : vPlain;
    }
  }
  const idx = [];
  for (let a = 0; a < seg; a++) for (let i = 0; i < nP - 1; i++) {
    const p0 = a * nP + i, p1 = p0 + nP;
    idx.push(p0, p0 + 1, p1, p1, p0 + 1, p1 + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  // 継ぎ目（角度 0 と 2π）の法線をそろえる
  const nor = geo.attributes.normal.array;
  for (let i = 0; i < nP; i++) {
    const p0 = i * 3, p1 = (seg * nP + i) * 3;
    let nx = nor[p0] + nor[p1], ny = nor[p0 + 1] + nor[p1 + 1], nz = nor[p0 + 2] + nor[p1 + 2];
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    nor[p0] = nor[p1] = nx; nor[p0 + 1] = nor[p1 + 1] = ny; nor[p0 + 2] = nor[p1 + 2] = nz;
  }
  geo.computeBoundingSphere();
  return geo;
}
