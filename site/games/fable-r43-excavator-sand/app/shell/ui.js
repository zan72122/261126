// DOM の UI：もう1回ボタン（矢印の絵だけ）と、ヒントの「手」の絵。文字は使わない。
export function createUI(container, onReplay) {
  const style = document.createElement('style');
  style.textContent = `
  .r43-replay{position:absolute;right:max(24px,env(safe-area-inset-right));bottom:max(24px,env(safe-area-inset-bottom));
    width:120px;height:120px;border-radius:50%;border:0;padding:0;background:#3cc46a;box-shadow:0 8px 0 #23914a,0 12px 24px rgba(0,0,0,.25);
    display:none;align-items:center;justify-content:center;touch-action:none;-webkit-tap-highlight-color:transparent;cursor:pointer;z-index:5}
  .r43-replay.show{display:flex;animation:r43pop .5s cubic-bezier(.2,1.6,.4,1) both, r43pulse 1.2s ease-in-out .5s infinite}
  .r43-replay:active{transform:translateY(6px) scale(.97);box-shadow:0 2px 0 #23914a}
  .r43-replay svg{width:72px;height:72px}
  @keyframes r43pop{from{transform:scale(0)}to{transform:scale(1)}}
  @keyframes r43pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.09)}}
  .r43-hand{position:absolute;left:0;top:0;width:84px;height:84px;margin:-6px 0 0 -30px;pointer-events:none;opacity:0;
    transition:opacity .3s;z-index:4;filter:drop-shadow(0 4px 4px rgba(0,0,0,.25))}
  .r43-hand.show{opacity:.92}
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.className = 'r43-replay';
  btn.setAttribute('aria-label', 'replay');
  btn.innerHTML = `<svg viewBox="0 0 100 100"><path d="M50 18a32 32 0 1 1-30.5 22" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
    <path d="M6 38 L22 18 L36 42 Z" fill="#fff" stroke="#fff" stroke-width="6" stroke-linejoin="round"/></svg>`;
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); });
  btn.addEventListener('pointerup', (e) => { e.preventDefault(); e.stopPropagation(); if (btn.classList.contains('show')) onReplay(); });
  container.appendChild(btn);

  // 手（漫画的な白い手袋。指先が (30,6) 付近）
  const hand = document.createElement('div');
  hand.className = 'r43-hand';
  hand.innerHTML = `<svg viewBox="0 0 84 84"><g stroke="#5a4a3a" stroke-width="3" stroke-linejoin="round" fill="#fffdf8">
    <path d="M24 44 V12 a7 7 0 0 1 14 0 V36 a6 6 0 0 1 12 2 a6 6 0 0 1 12 2 a6 6 0 0 1 11 4 V58 c0 14-10 22-24 22 h-6 c-10 0-16-6-21-14 l-10-16 a6 6 0 0 1 10-7 z"/>
    </g><circle cx="31" cy="10" r="5" fill="#ffd84a" opacity=".0"/></svg>`;
  container.appendChild(hand);

  let handT = 0, handPath = null, handOn = false;
  return {
    showReplay(v) { btn.classList.toggle('show', !!v); },
    get replayVisible() { return btn.classList.contains('show'); },
    replayButton: btn,
    // path: 画面座標の点列（[x,y] の配列）。1周 2.4 秒でなぞる
    showHand(path) { handPath = path; if (!handOn) { handT = 0; handOn = true; hand.classList.add('show'); } },
    hideHand() { handOn = false; hand.classList.remove('show'); },
    update(dt) {
      if (!handOn || !handPath || handPath.length < 2) return;
      handT = (handT + dt / 2.4) % 1;
      // 0..0.15 押す、0.15..0.85 なぞる、0.85..1 離す
      const u = Math.min(1, Math.max(0, (handT - 0.15) / 0.7));
      const n = handPath.length - 1, f = u * n, i = Math.min(n - 1, Math.floor(f)), k = f - i;
      const x = handPath[i][0] + (handPath[i + 1][0] - handPath[i][0]) * k;
      const y = handPath[i][1] + (handPath[i + 1][1] - handPath[i][1]) * k;
      const press = handT < 0.15 ? handT / 0.15 : handT > 0.85 ? 1 - (handT - 0.85) / 0.15 : 1;
      hand.style.transform = `translate(${x}px, ${y}px) scale(${1.08 - press * 0.1})`;
      hand.style.opacity = handT > 0.92 ? '0.3' : '';
    },
  };
}
