/**
 * RGB Gamer Keyboard Module
 * ─────────────────────────
 * Self-contained, auto-injects CSS.
 * Extracted from CLASH_OF_WORDS v1 (2026-05).
 *
 * Usage:
 *   RGBKeyboard.build('container-id', (key) => { ... });
 *
 * The container element must exist in the DOM before calling build().
 * The callback receives key values as strings:
 *   - Letter/digit keys → 'A', 'B', ... 'Z', '0'-'9'
 *   - Space bar         → ' '
 *   - Backspace/Delete  → '⌫'
 *   - Submit            → 'SUBMIT'
 *
 * SURE? logic (for empty submit confirmation):
 *   Call RGBKeyboard.setSure(true)  → button turns yellow "SURE?"
 *   Call RGBKeyboard.setSure(false) → button resets to green "SUBMIT"
 *
 * The module does NOT manage internal typed-word state; the host game
 * owns that logic and calls setSure() / resetSubmit() as needed.
 *
 * CSS Note:
 *   The rainbow wave animation period is 3s (rgbWave keyframe).
 *   The JS wave delay calculation uses wavePeriod=3 to match.
 *   If you change one, change the other.
 */

const RGBKeyboard = (() => {

  /* ── CSS ──────────────────────────────────────────────────────────── */
  const CSS = `
.rgb-keyboard{display:flex;flex-direction:column;gap:6px;align-items:center;width:100%;max-width:730px;flex-shrink:0;padding:16px 22px 22px;align-self:center;background:rgba(3,1,10,.9);border-radius:22px;border:1px solid rgba(255,255,255,.055);box-shadow:0 10px 40px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.04)}
.rgb-kb-row{display:flex;gap:5px;justify-content:center}

/* Rainbow wave — period MUST match wavePeriod constant in JS (3s) */
@keyframes rgbKbWave{
  0%  {border-color:hsl(0,88%,54%)}
  12% {border-color:hsl(44,90%,54%)}
  25% {border-color:hsl(100,82%,48%)}
  38% {border-color:hsl(162,82%,46%)}
  50% {border-color:hsl(200,88%,54%)}
  62% {border-color:hsl(248,90%,64%)}
  75% {border-color:hsl(285,88%,62%)}
  88% {border-color:hsl(330,88%,58%)}
  100%{border-color:hsl(360,88%,54%)}
}
@keyframes rgbKbDelPulse{
  0%,100%{border-color:rgba(232,33,58,.55)}
  50%    {border-color:rgba(255,60,80,1)}
}
@keyframes rgbKbSubmitPulse{
  0%,100%{border-color:rgba(34,197,94,.5)}
  50%    {border-color:rgba(74,222,128,1)}
}
@keyframes rgbKbSurePulse{
  0%,100%{border-color:rgba(234,179,8,.55)}
  50%    {border-color:rgba(253,224,71,1)}
}
@keyframes rgbKbFlash{0%{background:rgba(255,255,255,.35)}100%{background:rgba(8,3,18,.92)}}

.rgb-kb-key{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(16px,2.8vw,24px);
  width:clamp(36px,6.5vw,56px);
  height:clamp(40px,7vw,58px);
  background:rgba(8,3,18,.92);
  border:2px solid rgba(255,255,255,.1);
  border-radius:9px;
  color:rgba(255,255,255,.88);
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  user-select:none;
  letter-spacing:.04em;
  position:relative;
  animation:rgbKbWave 3s linear infinite;
  animation-delay:var(--kd,0s);
  transition:transform .06s,filter .07s
}
.rgb-kb-key:hover{filter:brightness(1.85);transform:translateY(-2px)}
.rgb-kb-key:active{transform:translateY(3px)!important;filter:brightness(3)!important;box-shadow:0 1px 0 rgba(0,0,0,.75),0 0 22px rgba(255,255,255,.5),inset 0 0 16px rgba(255,255,255,.2)!important}
.rgb-kb-key.kb-lit{animation:rgbKbFlash .18s ease-out forwards,rgbKbWave 3s linear infinite;filter:brightness(2.5);transform:translateY(2px)}
.rgb-kb-key.kb-wide{width:clamp(54px,9vw,82px)}
.rgb-kb-key.kb-space{width:clamp(120px,22vw,220px);font-size:clamp(11px,1.6vw,13px);letter-spacing:.22em;color:rgba(255,255,255,.5)}
.rgb-kb-key.kb-del{font-size:clamp(14px,2.2vw,20px);background:rgba(20,3,6,.95);color:#ff6b7a;animation:rgbKbDelPulse 1.5s ease-in-out infinite}
.rgb-kb-key.kb-submit{width:clamp(100px,18vw,190px);font-size:clamp(13px,2vw,18px);background:rgba(4,16,8,.95);color:#4ade80;letter-spacing:.16em;animation:rgbKbSubmitPulse 1.4s ease-in-out infinite}
.rgb-kb-key.kb-submit:hover{filter:brightness(1.7);transform:translateY(-2px)}
.rgb-kb-key.kb-submit.kb-sure{animation:rgbKbSurePulse .65s ease-in-out infinite!important;background:rgba(20,14,1,.95)!important;color:#facc15!important;letter-spacing:.22em}
`;

  /* ── Internal state ─────────────────────────────────────────────── */
  let _submitBtn = null;
  let _cssInjected = false;

  function _injectCSS() {
    if (_cssInjected) return;
    const style = document.createElement('style');
    style.id = 'rgb-keyboard-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
    _cssInjected = true;
  }

  /* ── Public API ─────────────────────────────────────────────────── */

  /**
   * Build the keyboard inside a container element.
   * @param {string|HTMLElement} container - element id or DOM node
   * @param {function(string):void} onKey - callback called with key value on press
   */
  function build(container, onKey) {
    _injectCSS();

    const el = typeof container === 'string'
      ? document.getElementById(container)
      : container;
    if (!el) { console.warn('RGBKeyboard: container not found:', container); return; }

    el.classList.add('rgb-keyboard');
    el.innerHTML = '';

    const rows = [
      ['Q','W','E','R','T','Y','U','I','O','P','⌫'],
      ['A','S','D','F','G','H','J','K','L','SUBMIT'],
      ['Z','X','C','V','B','N','M',' '],
    ];

    // Visual left-edge col offset per row (simulates staggered physical keyboard)
    const rowColOffset = [0, 0.5, 1.0];

    // Wave period MUST match @keyframes rgbKbWave duration (3s)
    const wavePeriod = 3;
    const waveSpan   = 10; // total columns used for wave spread

    _submitBtn = null;

    rows.forEach((row, ri) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'rgb-kb-row';

      row.forEach((k, ci) => {
        const btn = document.createElement('button');
        btn.className = 'rgb-kb-key';
        btn.textContent = k;

        if (k === '⌫')     { btn.classList.add('kb-wide', 'kb-del'); }
        if (k === ' ')     { btn.classList.add('kb-space'); btn.textContent = 'SPACE'; }
        if (k === 'SUBMIT'){ btn.classList.add('kb-submit'); _submitBtn = btn; }

        // Rainbow wave delay — letter/space keys only (DEL & SUBMIT have own animations)
        if (k !== '⌫' && k !== 'SUBMIT') {
          const colPos = k === ' ' ? 4.5 : (rowColOffset[ri] + ci);
          btn.style.setProperty('--kd', (-(colPos / waveSpan) * wavePeriod).toFixed(2) + 's');
        }

        // Lit flash on press
        btn.addEventListener('pointerdown', () => {
          btn.classList.add('kb-lit');
          setTimeout(() => btn.classList.remove('kb-lit'), 200);
        });

        btn.addEventListener('click', () => onKey(k));
        rowEl.appendChild(btn);
      });

      el.appendChild(rowEl);
    });
  }

  /**
   * Toggle SURE? confirmation state on the SUBMIT button.
   * @param {boolean} active - true = show "SURE?" in yellow, false = reset to "SUBMIT"
   */
  function setSure(active) {
    if (!_submitBtn) return;
    if (active) {
      _submitBtn.textContent = 'SURE?';
      _submitBtn.classList.add('kb-sure');
    } else {
      _submitBtn.textContent = 'SUBMIT';
      _submitBtn.classList.remove('kb-sure');
    }
  }

  /**
   * Reset the submit button to its default state (alias for setSure(false)).
   */
  function resetSubmit() {
    setSure(false);
  }

  return { build, setSure, resetSubmit };

})();
