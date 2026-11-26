// DOM bits without any text: the round "again" button (curly arrow drawing) and the soft snow curtain.

const AGAIN_SVG = `
<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
  <circle cx="50" cy="50" r="46" fill="#ffffff"/>
  <path d="M71 40 A24 24 0 1 0 74 56" fill="none" stroke="#3d8bff" stroke-width="10" stroke-linecap="round"/>
  <path d="M60 30 L80 36 L72 52 Z" fill="#3d8bff" stroke="#3d8bff" stroke-width="4" stroke-linejoin="round"/>
  <g fill="#9fd0ff"><circle cx="50" cy="51" r="6"/></g>
</svg>`;

export function createUI(onAgain) {
  const btn = document.createElement('button');
  btn.id = 'again';
  btn.setAttribute('aria-label', 'again');
  btn.innerHTML = AGAIN_SVG;
  btn.className = 'hidden';
  document.body.appendChild(btn);

  const curtain = document.createElement('div');
  curtain.id = 'curtain';
  document.body.appendChild(curtain);

  let enabled = false;
  const fire = (e) => { e.preventDefault(); e.stopPropagation(); if (enabled) onAgain(); };
  btn.addEventListener('pointerdown', fire);

  return {
    button: btn,
    showAgain(v) { enabled = v; btn.className = v ? 'show' : 'hidden'; },
    get againVisible() { return enabled; },
    nudgeAgain() { if (!enabled) return; btn.classList.remove('nudge'); void btn.offsetWidth; btn.classList.add('nudge'); },
    curtain(on) { curtain.className = on ? 'on' : ''; },
  };
}
