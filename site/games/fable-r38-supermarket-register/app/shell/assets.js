// テクスチャの読み込み。dist/game.js では画像が data URI で同梱される（window.__R38_ASSETS）。
// file:// の Chrome は普通の画像を WebGL に渡せないため、同梱の data URI を優先する。
export function createAssets(THREE, { anisotropy = 1, onError } = {}) {
  const cache = new Map();
  const owned = new Set();
  const pending = [];

  function urlOf(path) {
    const table = globalThis.__R38_ASSETS;
    return (table && table[path]) || path;
  }

  function applyOpts(tex, o) {
    const wrap = o.wrap === 'repeat' ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
    tex.wrapS = tex.wrapT = wrap;
    if (o.repeat) tex.repeat.set(o.repeat[0], o.repeat[1]);
    tex.colorSpace = o.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    tex.anisotropy = anisotropy;
  }

  // 画像テクスチャ（同期で返す。画像は後から届く）。同じ path と o なら同じ物を返す。
  function texture(path, o = {}) {
    const key = path + '|' + JSON.stringify(o);
    if (cache.has(key)) return cache.get(key);
    const tex = new THREE.Texture();
    tex.name = path;
    applyOpts(tex, o);
    const img = new Image();
    pending.push(new Promise((resolve) => {
      img.onload = () => { tex.image = img; tex.needsUpdate = true; resolve(); };
      img.onerror = () => { if (onError) onError('texture load failed: ' + path); resolve(); };
    }));
    img.decoding = 'async';
    img.src = urlOf(path);
    cache.set(key, tex);
    owned.add(tex);
    return tex;
  }

  // 手続きの Canvas テクスチャ（文字は描かない）
  function canvasTexture(name, w, h, draw, o = {}) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.name = name;
    applyOpts(tex, o);
    owned.add(tex);
    return tex;
  }

  function ready(timeoutMs = 3000) {
    return Promise.race([
      Promise.all(pending),
      new Promise((r) => setTimeout(r, timeoutMs)),
    ]);
  }

  // コンテキスト復帰後：念のため全部上げ直す
  function restoreGPU() { for (const t of owned) if (t.image) t.needsUpdate = true; }

  function dispose() { for (const t of owned) t.dispose(); owned.clear(); cache.clear(); }

  return { texture, canvasTexture, ready, restoreGPU, dispose, urlOf };
}
