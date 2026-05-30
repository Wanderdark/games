/**
 * Final Screen VFX Module
 * ───────────────────────
 * Self-contained, auto-injects CSS.
 * Extracted from WORD_GAME v6 (2026-05).
 *
 * Usage:
 *   FinalScreen.start();        // Konfeti + yıldız patlaması + ışık huzmesi başlar
 *   FinalScreen.stop();         // Tüm efektleri durdurur, DOM'u temizler
 *   FinalScreen.applyRays(el);  // Verilen element'e dönen ışık huzmesi ekler
 *
 * Requirements:
 *   - FinalScreen.start() çağrılmadan önce DOM'da .winner-ann sınıflı bir element
 *     bulunursa yıldız patlaması o elementin etrafında konumlanır.
 *     Yoksa ekranın ortasını kullanır.
 *   - Konfeti ve yıldız parçacıkları animasyon bitince DOM'dan otomatik kaldırılır.
 *
 * CSS Note:
 *   Tüm animasyonlar --cx, --cc, --sx, --sy gibi CSS custom property'leri kullanır.
 *   Keyframe isimleri winConfFall / starBurst / raysSpin / crownBounce şeklindedir.
 */

const FinalScreen = (() => {

  /* ── CSS ──────────────────────────────────────────────────────────── */
  const CSS = `
/* Konfeti parçacığı */
@keyframes winConfFall {
  0%   { transform: translateY(-20px) rotate(0deg) scaleX(1);   opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateY(105vh) rotate(var(--wr,360deg)) scaleX(var(--flip,1)); opacity: 0; }
}
.win-conf {
  position: fixed; pointer-events: none; z-index: 9500;
  width: var(--cw,8px); height: var(--ch,14px);
  background: var(--cc,#ffd700);
  border-radius: var(--cbr,2px);
  top: -20px; left: var(--cx,50%);
  animation: winConfFall var(--cd,3s) linear var(--cdelay,0s) forwards;
}

/* Yıldız patlaması */
@keyframes starBurst {
  0%   { opacity:1; transform:translate(-50%,-50%) scale(0.2) rotate(0deg); }
  60%  { opacity:1; }
  100% { opacity:0; transform:translate(calc(-50% + var(--sx,0px)), calc(-50% + var(--sy,-80px))) scale(1.2) rotate(var(--sr,180deg)); }
}
.win-star {
  position: fixed; pointer-events: none; z-index: 9500;
  font-size: var(--ss,22px);
  animation: starBurst var(--sd,1.2s) ease-out var(--sdelay,0s) forwards;
  left: var(--slx,50%); top: var(--sly,50%);
}

/* Dönen ışık huzmesi (relative konumlu parent içine eklenir) */
@keyframes raysSpin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
.winner-rays {
  position: absolute; inset: -60px; border-radius: 50%;
  background: conic-gradient(
    rgba(255,215,0,.18) 0deg,   transparent 20deg,
    rgba(255,215,0,.12) 40deg,  transparent 60deg,
    rgba(255,215,0,.18) 80deg,  transparent 100deg,
    rgba(255,215,0,.1)  120deg, transparent 140deg,
    rgba(255,215,0,.18) 160deg, transparent 180deg,
    rgba(255,215,0,.12) 200deg, transparent 220deg,
    rgba(255,215,0,.18) 240deg, transparent 260deg,
    rgba(255,215,0,.1)  280deg, transparent 300deg,
    rgba(255,215,0,.18) 320deg, transparent 340deg,
    rgba(255,215,0,.18) 360deg
  );
  animation: raysSpin 8s linear infinite;
  pointer-events: none; z-index: 0;
}

/* Crown / ana başlık için zıplama animasyonu */
@keyframes crownBounce {
  0%,100% { transform: scale(1)   translateY(0px);  filter: drop-shadow(0 0 8px rgba(255,215,0,.5)); }
  50%     { transform: scale(1.2) translateY(-8px); filter: drop-shadow(0 0 28px rgba(255,215,0,1)); }
}
.crown-bounce {
  animation: crownBounce 1.4s ease-in-out infinite;
}
`;

  /* ── Internal state ─────────────────────────────────────────────── */
  let _confTimer    = null;
  let _starTimer    = null;
  let _cssInjected  = false;

  const CONF_COLORS  = ['#ffd700','#ff6b35','#4ade80','#a78bfa','#f472b6','#38bdf8','#ffffff','#fbbf24','#fb7185'];
  const STAR_EMOJIS  = ['⭐','✨','🌟','💫','🎉','🎊','🏆'];

  function _injectCSS() {
    if (_cssInjected) return;
    const style = document.createElement('style');
    style.id = 'finalscreen-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
    _cssInjected = true;
  }

  /* ── Konfeti yağmuru ─────────────────────────────────────────────── */
  function _spawnConfBatch() {
    const count = 7 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'win-conf';
      const w = 6  + Math.random() * 8;
      const h = 10 + Math.random() * 12;
      el.style.cssText =
        `--cx:${(Math.random() * 105 - 2).toFixed(1)}%;` +
        `--cc:${CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)]};` +
        `--cw:${w.toFixed(1)}px;--ch:${h.toFixed(1)}px;` +
        `--cbr:${Math.random() > .5 ? '50%' : '2px'};` +
        `--cd:${(2.5 + Math.random() * 2.5).toFixed(2)}s;` +
        `--cdelay:${(Math.random() * 0.4).toFixed(2)}s;` +
        `--wr:${(Math.random() * 720 - 360).toFixed(0)}deg;` +
        `--flip:${Math.random() > .5 ? 1 : -1};`;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }

  function _startConf() {
    if (_confTimer) return;
    let waves = 0;
    _confTimer = setInterval(() => {
      _spawnConfBatch();
      waves++;
      // İlk 3 sn yoğun (~25 dalga), sonra seyrek devam
      if (waves > 25) {
        clearInterval(_confTimer);
        _confTimer = setInterval(_spawnConfBatch, 600);
      }
    }, 120);
  }

  /* ── Yıldız patlaması ────────────────────────────────────────────── */
  function _spawnStars() {
    const anchor = document.querySelector('.winner-ann');
    let cx = window.innerWidth  / 2;
    let cy = window.innerHeight / 2;
    if (anchor) {
      const r = anchor.getBoundingClientRect();
      cx = r.left + r.width  / 2;
      cy = r.top  + r.height / 2;
    }

    for (let i = 0; i < 18; i++) {
      const el = document.createElement('div');
      el.className = 'win-star';
      const angle = (i / 18) * Math.PI * 2;
      const dist  = 80 + Math.random() * 140;
      el.style.cssText =
        `--sx:${(Math.cos(angle) * dist).toFixed(0)}px;` +
        `--sy:${(Math.sin(angle) * dist - 20).toFixed(0)}px;` +
        `--sr:${(Math.random() * 360).toFixed(0)}deg;` +
        `--ss:${(16 + Math.random() * 18).toFixed(0)}px;` +
        `--sd:${(0.8 + Math.random() * 0.8).toFixed(2)}s;` +
        `--sdelay:${(i * 0.06).toFixed(2)}s;` +
        `--slx:${cx.toFixed(0)}px;--sly:${cy.toFixed(0)}px;`;
      el.textContent = STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)];
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }

    // Periyodik tekrar (stop() çağrılmadıkça)
    _starTimer = setTimeout(_spawnStars, 2800);
  }

  /* ── Public API ─────────────────────────────────────────────────── */

  /**
   * Tüm final ekranı efektlerini başlatır.
   * - Konfeti yağmuru (sürekli)
   * - Yıldız patlaması (her ~2.8s)
   */
  function start() {
    _injectCSS();
    stop(); // önceki çalışanı temizle
    _startConf();
    _spawnStars();
  }

  /**
   * Tüm efektleri durdurur.
   * DOM'daki mevcut parçacıklar animasyonları bitince kendi kendine silinir.
   */
  function stop() {
    if (_confTimer) { clearInterval(_confTimer); _confTimer = null; }
    if (_starTimer) { clearTimeout(_starTimer);  _starTimer = null; }
  }

  /**
   * Verilen element'e dönen altın ışık huzmesi ekler.
   * Element'in position'ı relative veya absolute olmalı, overflow:hidden önerilir.
   * @param {HTMLElement} el - hedef element
   */
  function applyRays(el) {
    _injectCSS();
    if (!el) return;
    // Varsa eskisini kaldır
    const existing = el.querySelector('.winner-rays');
    if (existing) existing.remove();
    const rays = document.createElement('div');
    rays.className = 'winner-rays';
    el.style.position = el.style.position || 'relative';
    el.insertBefore(rays, el.firstChild);
  }

  return { start, stop, applyRays };

})();
