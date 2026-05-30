/* ══════════════════════════════════════════════════════════════════════════
   🎡 WHEEL OF FORTUNE MODULE
   Kaynak: word_game_v13.html  |  Son güncelleme: 2026-05-29
   ══════════════════════════════════════════════════════════════════════════

   KULLANIM
   ─────────
   1. <head> içine fontları ekle:
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;700&display=swap" rel="stylesheet">

   2. <style> içine WF_CSS_SNIPPET'i yapıştır.

   3. <body> içine, en alta (diğer overlay'lerin önünde) WF_HTML_SNIPPET'i yapıştır.

   4. Bu .js dosyasını <script src="wheeloffortune.js"></script> ile yükle.

   5. Host oyunun sağlaması gereken global'ler ve callback'ler aşağıda listelendi.
      Bunlar olmadan wheel çalışmaz.

   ══════════════════════════════════════════════════════════════════════════
   HOST OYUNUN SAĞLAMASI GEREKENLER
   ══════════════════════════════════════════════════════════════════════════

   // ── Durum değişkenleri (host tarafında tanımlı olmalı) ──
   let currentGroup    // aktif grup indeksi (0, 1, 2)
   let groupStudents   // { gi: [isim, isim, ...] }
   let studentIndex    // { gi: aktifÖğrenciIdx }
   let jokerCount      // { gi: joker sayısı }
   let groupScores     // { gi: puan }
   let isLocked        // boolean — zorluk butonlarını kilitler
   let isMuted         // boolean — ses kapalı mı
   let roundNumber     // mevcut round (debug gösterimi için)
   let questionTimerSec  // soru süresi saniye (TIME WARP için)
   let revealedIndices   // Set — bu turdaki açık harf indeksleri
   let jokerFloodIndices // Set — flood ile açılan indeksler (HarfPenalty'den muaf)
   let answers         // { soru: CEVAP } map'i
   let QUESTIONS       // tüm soru havuzu dizisi
   let SYNONYM_PAIRS   // eşanlamlı çiftler dizisi
   let OPPOSITE_PAIRS  // zıt anlamlı çiftler dizisi
   let selectedGrades  // Set<number>
   let selectedUnits   // Set<number>

   // ── Host fonksiyonları (wheel tarafından çağrılır) ──
   function grpIdxs()                        // aktif grup indekslerini döndürür
   function updateUI()                        // genel UI yenilemesi
   function updateJokerDisplay()             // joker göstergelerini günceller
   function flyJokerToDisplay(gi)            // joker fly animasyonu
   function updateScoreBadge()               // puan rozeti güncelle
   function showToast(msg, dur, type)        // bildirim toast'ı
   function sfxCorrect()                     // correct.wav çal
   function sfxWrong()                       // wrong.wav çal
   function showAnswerStamp(correct)         // CORRECT/WRONG damgası göster
   function penalizeJoker(gi)               // challenge yanlışta joker ceza
   function openLetterOverlay(pts)           // zorluk seçimi ile soruyu aç
   function revealHexLetter(idx, answer)    // tek harfi hex üzerinde aç (joker flood)
   function getAC()                          // AudioContext singleton döndür
   function shuffle(arr)                     // dizi karıştırma (in-place)

   // ── Wheel'in host'a sağladığı (dışarıya açık) ──
   // State flags (host getCurrentScore, getAwardScore ve timer'da okur):
   //   _wheelDoublePoints, _wheelHalfPrice, _wheelChallengeOn,
   //   _wheelTimeWarp, _wheelJokerFlood, jokerFloodIndices
   //
   // Functions (host startGame, advanceTurn ve openLetterOverlay'de çağırır):
   //   pickLuckyStudents()    — round başında lucky student seç
   //   checkWheelTrigger()    — advanceTurn sonunda _wheelPending ayarla
   //   resetWheelTurnFlags()  — closeModalAndNext'te tur sonu sıfırlama
   //   showWheelOverlay()     — openLetterOverlay interceptinden çağrılır
   //   closeWheelOverlay()    — DEVAM ET → soruyu otomatik açar
   //   updateWheelDebug()     — debug gösterimi güncelle
   //   applyJokerFlood()      — buildHexRow sonrası, startTimer öncesi çağır
   //   _wheelPending          — openLetterOverlay'de kontrol edilir
   //   _wheelPendingPts       — openLetterOverlay'de set edilir

   ══════════════════════════════════════════════════════════════════════════
   HOST openLetterOverlay ENTEGRASYON ÖRNEĞİ
   ══════════════════════════════════════════════════════════════════════════

   function openLetterOverlay(pts) {
     if(isLocked) return;
     if(_wheelPending) { _wheelPendingPts = pts; showWheelOverlay(); return; }
     // ... normal soru açma akışı ...
   }

   ══════════════════════════════════════════════════════════════════════════
   HOST getAwardScore / getCurrentScore ENTEGRASYON ÖRNEĞİ
   ══════════════════════════════════════════════════════════════════════════

   function getAwardScore() {
     const s = getCurrentScore();
     return (_wheelDoublePoints || _wheelTimeWarp) ? s * 2 : s;
   }

   // getCurrentScore içinde harfPenalty:
   const harfAlCount = [...revealedIndices]
     .filter(i => !ilkSonIndices.has(i) && !jokerFloodIndices.has(i)).length;

   ══════════════════════════════════════════════════════════════════════════
   HOST SORU AÇILIŞI ENTEGRASYON ÖRNEĞİ (buildHexRow sonrası)
   ══════════════════════════════════════════════════════════════════════════

   buildHexRow(answers[currentQ] || '', true);
   applyJokerFlood();   // 🌊 flood varsa harfleri aç
   updateScoreBadge();
   startTimer(_wheelTimeWarp                         // ⏱️ time warp
     ? Math.max(8, Math.floor(questionTimerSec / 2))
     : questionTimerSec);

   ══════════════════════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════════════════
   CSS — <style> içine yapıştır
   ══════════════════════════════════════════════════════════════════ */
const WF_CSS = `
  /* ── Wheel Overlay ── */
  #wheel-overlay {
    position: fixed; inset: 0; z-index: 9100;
    background: radial-gradient(ellipse at center, rgba(20,5,40,0.97) 0%, rgba(5,0,15,0.99) 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 14px; padding: 16px;
  }
  #wheel-spin-phase {
    display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%;
    position: relative;
  }
  .wheel-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(26px, 4.8vw, 52px);
    background: linear-gradient(135deg, #FFD700, #FFA500, #FFD700);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    text-shadow: none; filter: drop-shadow(0 0 18px rgba(255,180,0,0.55));
    letter-spacing: .08em; text-align: center; line-height: 1.1;
  }
  .wheel-student-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(14px, 2.4vw, 22px); color: rgba(255,255,255,0.82);
    letter-spacing: .14em; text-transform: uppercase; text-align: center;
  }
  .wheel-container {
    position: relative;
    width: clamp(240px, 40vw, 440px); height: clamp(240px, 40vw, 440px);
  }
  #wheel-canvas { width: 100%; height: 100%; display: block; }
  .wheel-pointer {
    position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 13px solid transparent; border-right: 13px solid transparent;
    border-top: 30px solid #FFD700;
    filter: drop-shadow(0 0 8px rgba(255,215,0,0.9)); z-index: 2;
  }
  #wheel-spin-btn {
    font-family: 'Bebas Neue', sans-serif; font-size: clamp(18px, 3vw, 30px);
    letter-spacing: .14em; padding: 13px 52px;
    background: linear-gradient(135deg, #c27c05, #FFD700, #c27c05);
    border: none; border-radius: 50px; cursor: pointer; color: #1a0000;
    box-shadow: 0 0 28px rgba(255,215,0,0.5), 0 4px 12px rgba(0,0,0,0.4);
    transition: transform .15s, box-shadow .15s; font-weight: 900;
  }
  #wheel-spin-btn:hover:not(:disabled) { transform: scale(1.06); box-shadow: 0 0 40px rgba(255,215,0,0.75); }
  #wheel-spin-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }
  .wheel-result-banner {
    font-family: 'Bebas Neue', sans-serif; font-size: clamp(18px, 3.2vw, 36px);
    letter-spacing: .08em; text-align: center; min-height: 44px;
    text-shadow: 0 0 16px currentColor; padding: 0 12px;
  }
  #wheel-continue-btn {
    font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase; padding: 11px 38px;
    background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.3);
    color: rgba(255,255,255,0.9); border-radius: 12px; cursor: pointer;
    transition: all .15s; display: none;
  }
  #wheel-continue-btn:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.55); }
  #wheel-btn-slot { display: flex; justify-content: center; align-items: center; }

  /* ── DEV Override butonu ── */
  #wheel-dev-btn {
    position: absolute; bottom: 14px; right: 16px;
    font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; padding: 4px 10px;
    background: rgba(251,191,36,0.10); border: 1px solid rgba(251,191,36,0.28);
    color: rgba(251,191,36,0.55); border-radius: 7px; cursor: pointer;
    transition: all .15s; z-index: 9210;
  }
  #wheel-dev-btn:hover { background: rgba(251,191,36,0.22); color: rgba(251,191,36,0.9); }

  /* ── Override seçim modalı ── */
  #wheel-override-modal {
    display: none; position: fixed; inset: 0; z-index: 9500;
    background: rgba(0,0,0,0.72); backdrop-filter: blur(4px);
    align-items: center; justify-content: center;
  }
  #wheel-override-modal.open { display: flex; }
  .wom-inner {
    background: rgba(15,5,35,0.97); border: 1.5px solid rgba(255,215,0,0.28);
    border-radius: 20px; padding: 24px 22px; max-width: 460px; width: 94%;
    display: flex; flex-direction: column; gap: 14px;
  }
  .wom-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: .1em;
    color: rgba(251,191,36,0.85); text-align: center;
  }
  .wom-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .wom-seg-btn {
    border: none; border-radius: 12px; padding: 10px 6px;
    cursor: pointer; font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; font-weight: 700; letter-spacing: .06em;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    transition: transform .12s, box-shadow .12s; line-height: 1.2;
  }
  .wom-seg-btn:hover { transform: scale(1.06); box-shadow: 0 0 18px rgba(255,255,255,0.2); }
  .wom-seg-icon { font-size: 22px; }
  .wom-cancel {
    font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; padding: 9px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.18);
    color: rgba(255,255,255,0.55); border-radius: 10px; cursor: pointer; transition: all .15s;
  }
  .wom-cancel:hover { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.85); }

  /* ── Challenge kutusu ── */
  .wheel-challenge-box {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    z-index: 9200;
    background: rgba(15,5,35,0.97); border: 1.5px solid rgba(74,222,128,0.4);
    border-radius: 20px; padding: 28px; max-width: 440px; width: 90%;
    text-align: center; display: none;
    box-shadow: 0 0 60px rgba(74,222,128,0.18);
  }
  .wheel-challenge-desc {
    font-family: 'Barlow Condensed', sans-serif; font-size: 15px;
    color: rgba(255,255,255,0.82); line-height: 1.6; margin-bottom: 16px;
  }
  .wheel-challenge-btns { display: flex; gap: 12px; justify-content: center; }
  .wc-accept-btn {
    font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; padding: 10px 28px;
    background: linear-gradient(135deg, #15803d, #16a34a); border: none;
    border-radius: 10px; color: #fff; cursor: pointer;
    box-shadow: 0 2px 12px rgba(22,163,74,0.45); transition: transform .12s;
  }
  .wc-accept-btn:hover { transform: scale(1.04); }
  .wc-refuse-btn {
    font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; padding: 10px 28px;
    background: rgba(239,68,68,0.14); border: 1.5px solid rgba(239,68,68,0.4);
    border-radius: 10px; color: rgba(252,165,165,0.9); cursor: pointer; transition: all .12s;
  }
  .wc-refuse-btn:hover { background: rgba(239,68,68,0.25); }

  /* ── Word Challenge (syn/opp) ── */
  #wheel-word-challenge {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    z-index: 9200;
    background: rgba(15,5,35,0.97); border-radius: 20px; padding: 28px 24px;
    box-shadow: 0 0 60px rgba(99,102,241,0.22);
    display: none; flex-direction: column; align-items: center;
    gap: 16px; max-width: 500px; width: 92%;
  }
  .wwc-type-label {
    font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,0.5);
  }
  .wwc-word {
    font-family: 'Bebas Neue', sans-serif; font-size: clamp(36px, 7vw, 72px);
    color: #FFD700; text-shadow: 0 0 28px rgba(255,215,0,0.5);
    letter-spacing: .06em; text-align: center; line-height: 1;
  }
  .wwc-pts-label {
    font-family: 'Barlow Condensed', sans-serif; font-size: 14px;
    color: rgba(255,255,255,0.55); letter-spacing: .1em;
  }
  .wwc-options { display: flex; flex-direction: column; gap: 9px; width: 100%; }
  .wwc-opt-btn {
    font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase; padding: 13px 20px;
    border-radius: 12px; cursor: pointer; text-align: center;
    background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.2);
    color: #fff; transition: all .12s;
  }
  .wwc-opt-btn:hover:not(:disabled) { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.45); }
  .wwc-opt-btn.correct { background: rgba(29,185,84,0.25) !important; border-color: #4ade80 !important; color: #4ade80 !important; }
  .wwc-opt-btn.wrong   { background: rgba(239,68,68,0.22) !important; border-color: #f87171 !important; color: #f87171 !important; }
  .wwc-opt-btn:disabled { cursor: default; }

  /* ── Scoreboard badge'leri (aktif wheel efektleri) ── */
  .wheel-badge {
    display: inline-block; font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: .08em;
    padding: 2px 6px; border-radius: 5px; margin-left: 4px; vertical-align: middle;
  }
  .wb-double   { background: rgba(217,119,6,0.3);  border: 1px solid #d97706; color: #fcd34d; }
  .wb-half     { background: rgba(14,116,144,0.3);  border: 1px solid #0e7490; color: #67e8f9; }
  .wb-challenge{ background: rgba(21,128,61,0.3);   border: 1px solid #16a34a; color: #4ade80; }
`;


/* ══════════════════════════════════════════════════════════════════
   HTML SNIPPET — <body> içine, mümkün en alta ekle
   ══════════════════════════════════════════════════════════════════ */
const WF_HTML = `
<!-- ═══ WHEEL OF FORTUNE OVERLAY ═══ -->
<div id="wheel-overlay" style="display:none">

  <!-- Phase 1: Spin -->
  <div id="wheel-spin-phase" style="display:flex;flex-direction:column;align-items:center;gap:14px;width:100%">
    <div class="wheel-title">🎡 WHEEL OF FORTUNE</div>
    <div class="wheel-student-name" id="wheel-student-name"></div>
    <div class="wheel-container">
      <div class="wheel-pointer"></div>
      <canvas id="wheel-canvas" width="520" height="520"></canvas>
    </div>
    <div id="wheel-btn-slot">
      <button id="wheel-spin-btn"     onclick="spinWheel()">ÇEVİR 🎡</button>
      <button id="wheel-continue-btn" onclick="wheelContinue()">DEVAM ET →</button>
    </div>
    <div class="wheel-result-banner" id="wheel-result-banner"></div>
    <button id="wheel-dev-btn" onclick="openWheelOverride()">🔧 DEV</button>

    <!-- Challenge accept/refuse -->
    <div class="wheel-challenge-box" id="wheel-challenge-box">
      <div class="wheel-challenge-desc" id="wheel-challenge-desc"></div>
      <div class="wheel-challenge-btns">
        <button class="wc-accept-btn" onclick="acceptChallenge()">⚡ KABUL ET</button>
        <button class="wc-refuse-btn" onclick="refuseChallenge()">✗ REDDET</button>
      </div>
    </div>
  </div>

  <!-- Phase 2: Word challenge (syn / opp) -->
  <div id="wheel-word-challenge">
    <div class="wwc-type-label" id="wwc-type-label"></div>
    <div class="wwc-word"       id="wwc-word"></div>
    <div class="wwc-pts-label">Doğru cevap → +500 puan 🎉</div>
    <div class="wwc-options"    id="wwc-options"></div>
  </div>

</div>

<!-- ═══ DEV: Wheel Override Modal ═══ -->
<div id="wheel-override-modal">
  <div class="wom-inner">
    <div class="wom-title">🔧 DEV — Segment Seç</div>
    <div class="wom-grid" id="wom-grid"></div>
    <button class="wom-cancel" onclick="closeWheelOverride()">✕ İPTAL</button>
  </div>
</div>
`;


/* ══════════════════════════════════════════════════════════════════
   JAVASCRIPT — Segment tanımları
   ══════════════════════════════════════════════════════════════════ */

// 9 dilim (duplicate yok — her biri benzersiz)
const WF_SEGMENTS = [
  { id:'EXTRA_JOKER',  label:'EXTRA\nJOKER',   icon:'🃏', bg:'#7c3aed', fg:'#ede9fe' },
  { id:'BONUS_250',    label:'+250\nPUAN',      icon:'🎁', bg:'#be185d', fg:'#fce7f3' },
  { id:'MATCH_SYN',    label:'EŞ\nANLAMLI',    icon:'🔤', bg:'#1d4ed8', fg:'#dbeafe' },
  { id:'TIME_WARP',    label:'TIME\nWARP',      icon:'⏱️', bg:'#0f766e', fg:'#ccfbf1' },
  { id:'CHALLENGE',    label:'CHALLENGE\nMODE', icon:'⚡', bg:'#15803d', fg:'#dcfce7' },
  { id:'JOKER_FLOOD',  label:'JOKER\nFLOOD',   icon:'🌊', bg:'#1e3a8a', fg:'#bfdbfe' },
  { id:'DOUBLE_PTS',   label:'DOUBLE\nPOINTS', icon:'💥', bg:'#b45309', fg:'#fef3c7' },
  { id:'HALF_PRICE',   label:'YARI\nFİYAT',    icon:'🏷️', bg:'#0e7490', fg:'#cffafe' },
  { id:'MATCH_OPP',    label:'ZIT\nANLAMLI',   icon:'🔁', bg:'#c2410c', fg:'#ffedd5' },
];


/* ══════════════════════════════════════════════════════════════════
   STATE — Wheel turn flags (host closeModalAndNext / getAwardScore'da okur)
   ══════════════════════════════════════════════════════════════════ */
let luckyStudents      = {};     // { gi: studentIdx } — round başına seçilir
let wheelHistory       = {};     // { gi: Set<studentIdx> } — fairness döngüsü
let _wheelPending      = false;  // bu tur wheel gösterilecek mi
let _wheelPendingPts   = 0;      // intercept edilen zorluk puanı
let _wheelDoublePoints = false;  // getAwardScore × 2
let _wheelHalfPrice    = false;  // harf −50, TR −150
let _wheelChallengeOn  = false;  // challenge mode (3× puan, joker yok)
let _wheelTimeWarp     = false;  // süre ÷ 2, puan × 2
let _wheelJokerFlood   = false;  // soru açılınca harf yarısı bedava
let _wheelSpinning     = false;
let _wfAngle           = 0;


/* ══════════════════════════════════════════════════════════════════
   LUCKY STUDENT — Fairness cycle (her öğrenci sırayla alır)
   ══════════════════════════════════════════════════════════════════ */
function pickLuckyStudents() {
  luckyStudents = {};
  grpIdxs().forEach(gi => {
    const n = (groupStudents[gi] && groupStudents[gi].length) || 0;
    if(n <= 0) return;
    if(n === 1) { luckyStudents[gi] = 0; return; }

    if(!wheelHistory[gi]) wheelHistory[gi] = new Set();
    let eligible = [];
    for(let i = 0; i < n; i++) {
      if(!wheelHistory[gi].has(i)) eligible.push(i);
    }
    if(eligible.length === 0) {
      wheelHistory[gi] = new Set();
      for(let i = 0; i < n; i++) eligible.push(i);
    }
    const chosen = eligible[Math.floor(Math.random() * eligible.length)];
    luckyStudents[gi] = chosen;
    wheelHistory[gi].add(chosen);
  });
}

// Round başında debug gösterimi
function updateWheelDebug() {
  const el = document.getElementById('wheel-debug');
  if(!el) return;
  const parts = grpIdxs().map(gi => {
    const idx  = luckyStudents[gi];
    const name = (idx !== undefined && groupStudents[gi] && groupStudents[gi][idx])
                 ? groupStudents[gi][idx] : ('G' + (gi+1) + ':?');
    return '🎡 ' + name;
  });
  el.textContent = 'R' + roundNumber + ' → ' + parts.join('  |  ');
  el.style.display = parts.length ? '' : 'none';
}

// advanceTurn sonunda çağrılır — bu öğrenci lucky mı?
function checkWheelTrigger() {
  const gi = currentGroup, si = studentIndex[gi];
  _wheelPending = (luckyStudents[gi] !== undefined && luckyStudents[gi] === si);
}

// closeModalAndNext içinde çağrılır
function resetWheelTurnFlags() {
  _wheelDoublePoints = false;
  _wheelHalfPrice    = false;
  _wheelChallengeOn  = false;
  _wheelTimeWarp     = false;
  _wheelJokerFlood   = false;
  jokerFloodIndices  = new Set();
  _wheelPending      = false;
  _wheelPendingPts   = 0;
}


/* ══════════════════════════════════════════════════════════════════
   CANVAS RENDER
   ══════════════════════════════════════════════════════════════════ */
function wfLightenHex(hex, amt) {
  const n = parseInt(hex.replace('#', ''), 16);
  const clamp = v => Math.max(0, Math.min(255, v));
  return `rgb(${clamp((n >> 16) + amt)},${clamp(((n >> 8) & 0xff) + amt)},${clamp((n & 0xff) + amt)})`;
}
function wfDarkenHex(hex, amt) { return wfLightenHex(hex, -amt); }

function drawWheel(rotDeg) {
  const canvas = document.getElementById('wheel-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;   // 520 × 520
  const cx = W / 2, cy = H / 2;
  const R        = 245;
  const N        = WF_SEGMENTS.length;
  const sliceRad = (2 * Math.PI) / N;
  const baseRot  = (rotDeg - 90) * Math.PI / 180;

  ctx.clearRect(0, 0, W, H);

  // 1. Dış altın hale
  const halo = ctx.createRadialGradient(cx, cy, R - 5, cx, cy, R + 65);
  halo.addColorStop(0,   'rgba(255,210,0,0.35)');
  halo.addColorStop(0.4, 'rgba(255,170,0,0.10)');
  halo.addColorStop(1,   'rgba(255,170,0,0)');
  ctx.beginPath(); ctx.arc(cx, cy, R + 65, 0, 2 * Math.PI);
  ctx.fillStyle = halo; ctx.fill();

  // 2. Renkli dilimler (merkez açık → kenar koyu)
  for(let i = 0; i < N; i++) {
    const seg = WF_SEGMENTS[i];
    const a0  = baseRot + i * sliceRad;
    const a1  = a0 + sliceRad;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, a0, a1);
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    grad.addColorStop(0,    wfLightenHex(seg.bg, 75));
    grad.addColorStop(0.45, seg.bg);
    grad.addColorStop(1,    wfDarkenHex(seg.bg, 38));
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1; ctx.stroke();
  }

  // 3. Altın ayırıcı parmaklar
  for(let i = 0; i < N; i++) {
    const a = baseRot + i * sliceRad;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    ctx.strokeStyle = 'rgba(255,215,0,0.55)'; ctx.lineWidth = 2; ctx.stroke();
  }

  // 4. Emoji (segment ortası, %50 yarıçap)
  for(let i = 0; i < N; i++) {
    const seg = WF_SEGMENTS[i];
    const am  = baseRot + i * sliceRad + sliceRad / 2;
    const eR  = R * 0.50;
    ctx.save();
    ctx.translate(cx + Math.cos(am) * eR, cy + Math.sin(am) * eR);
    ctx.font = `${Math.round(R * 0.225)}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(seg.icon, 0, 0);
    ctx.restore();
  }

  // 5. Dış altın çember + iç gölge
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI);
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 5; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, R - 6, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(0,0,0,0.30)'; ctx.lineWidth = 2; ctx.stroke();

  // 6. Merkez kapak (metalik altın)
  const capR  = 26;
  const capGr = ctx.createRadialGradient(cx - 7, cy - 7, 2, cx, cy, capR);
  capGr.addColorStop(0,    '#fffde4');
  capGr.addColorStop(0.45, '#FFD700');
  capGr.addColorStop(1,    '#5c3d00');
  ctx.beginPath(); ctx.arc(cx, cy, capR, 0, 2 * Math.PI);
  ctx.fillStyle = capGr; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, capR, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.50)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff8dc'; ctx.fill();
}


/* ══════════════════════════════════════════════════════════════════
   OVERLAY AÇ / KAPAT
   ══════════════════════════════════════════════════════════════════ */
function showWheelOverlay() {
  const ov = document.getElementById('wheel-overlay');
  if(!ov) return;
  _wheelSpinning = false;
  _wfAngle = Math.random() * 360;

  // Öğrenci adı
  const gi = currentGroup, si = studentIndex[gi];
  const name = (groupStudents[gi] && groupStudents[gi][si]) || ('Grup ' + (gi + 1));
  const nameEl = document.getElementById('wheel-student-name');
  if(nameEl) nameEl.textContent = '🎉 ' + name.toUpperCase() + ' — ŞANSIN GÜZEL!';

  // UI sıfırla
  const resultBanner  = document.getElementById('wheel-result-banner');
  const continueBtn   = document.getElementById('wheel-continue-btn');
  const spinBtn       = document.getElementById('wheel-spin-btn');
  const challengeBox  = document.getElementById('wheel-challenge-box');
  const wordChallenge = document.getElementById('wheel-word-challenge');
  const spinPhase     = document.getElementById('wheel-spin-phase');
  const devBtn        = document.getElementById('wheel-dev-btn');

  if(resultBanner)  resultBanner.textContent = '';
  if(continueBtn)   continueBtn.style.display = 'none';
  if(spinBtn)       { spinBtn.disabled = false; spinBtn.style.display = ''; }
  if(devBtn)        devBtn.style.display = '';
  if(challengeBox)  challengeBox.style.display = 'none';
  if(wordChallenge) wordChallenge.style.display = 'none';
  if(spinPhase)     spinPhase.style.display = 'flex';

  isLocked = true; updateUI();
  drawWheel(_wfAngle);
  ov.style.display = 'flex';
}

function closeWheelOverlay() {
  const ov = document.getElementById('wheel-overlay');
  if(ov) ov.style.display = 'none';
  const autoOpenPts = _wheelPendingPts;
  _wheelPending    = false;
  _wheelPendingPts = 0;
  isLocked = false;
  updateUI();
  // Kaydedilmiş zorluk varsa öğretmen tekrar tıklamak zorunda kalmaz
  if(autoOpenPts > 0) setTimeout(() => openLetterOverlay(autoOpenPts), 80);
}


/* ══════════════════════════════════════════════════════════════════
   SPIN ANİMASYONU
   ══════════════════════════════════════════════════════════════════ */
function spinWheel() {
  if(_wheelSpinning) return;
  _wheelSpinning = true;
  const spinBtn = document.getElementById('wheel-spin-btn');
  if(spinBtn) spinBtn.disabled = true;

  playWheelSpinSound();

  const winIdx    = Math.floor(Math.random() * WF_SEGMENTS.length);
  const sliceDeg  = 360 / WF_SEGMENTS.length;
  const randomOff = (Math.random() - 0.5) * sliceDeg * 0.55;
  const target    = 6 * 360 - winIdx * sliceDeg - sliceDeg / 2 + randomOff;
  const start     = _wfAngle % 360;
  const delta     = ((target - start) % 360 + 360) % 360;
  const finalAngle = _wfAngle + delta + 6 * 360;

  const duration  = 4800;
  const t0        = performance.now();
  const fromAngle = _wfAngle;
  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

  (function tick(now) {
    const p = Math.min((now - t0) / duration, 1);
    _wfAngle = fromAngle + (finalAngle - fromAngle) * easeOut(p);
    drawWheel(_wfAngle);
    if(p < 1) { requestAnimationFrame(tick); }
    else { _wfAngle = finalAngle % 360; _wheelSpinning = false; onWheelStopped(winIdx); }
  })(t0);
}

function onWheelStopped(segIdx) {
  const seg = WF_SEGMENTS[segIdx];
  playWheelResultSound();
  const banner = document.getElementById('wheel-result-banner');
  if(banner) { banner.textContent = seg.icon + '  ' + seg.label.replace('\n', ' '); banner.style.color = seg.fg; }
  setTimeout(() => dispatchWheelSegment(seg.id), 1100);
}

function dispatchWheelSegment(id) {
  switch(id) {
    case 'EXTRA_JOKER': handleWfExtraJoker();        break;
    case 'BONUS_250':   handleWfBonus250();           break;
    case 'MATCH_SYN':   handleWfWordChallenge('syn'); break;
    case 'MATCH_OPP':   handleWfWordChallenge('opp'); break;
    case 'DOUBLE_PTS':  handleWfDoublePoints();       break;
    case 'CHALLENGE':   handleWfChallenge();          break;
    case 'HALF_PRICE':  handleWfHalfPrice();          break;
    case 'TIME_WARP':   handleWfTimeWarp();           break;
    case 'JOKER_FLOOD': handleWfJokerFlood();         break;
  }
}


/* ══════════════════════════════════════════════════════════════════
   SEGMENT HANDLER'LARI
   ══════════════════════════════════════════════════════════════════ */
function handleWfExtraJoker() {
  jokerCount[currentGroup] = Math.min((jokerCount[currentGroup] || 0) + 1, 9);
  updateJokerDisplay();
  flyJokerToDisplay(currentGroup);
  showWfContinue('🃏 EXTRA JOKER KAZANDIN — haydi oyna!');
}

function handleWfBonus250() {
  groupScores[currentGroup] += 250;
  updateUI();
  spawnWheelFloat('+250 🎁', '#FFD700');
  showWfContinue('🎁 +250 PUAN EKLENDİ — haydi oyna!');
}

function handleWfDoublePoints() {
  _wheelDoublePoints = true;
  showWfContinue('💥 BU TUR PUANIN 2X — haydi oyna!');
}

function handleWfHalfPrice() {
  _wheelHalfPrice = true;
  updateUI();
  showWfContinue('🏷️ BU TUR HARFLER −50 · TÜRKÇE −150 — haydi oyna!');
}

function handleWfTimeWarp() {
  _wheelTimeWarp = true;
  const halfSec = Math.max(8, Math.floor(questionTimerSec / 2));
  showWfContinue('⏱️ TIME WARP — ' + halfSec + ' SANİYE, PUAN 2X! haydi oyna!');
}

function handleWfJokerFlood() {
  _wheelJokerFlood = true;
  showWfContinue('🌊 JOKER FLOOD — harflerin yarısı açık gelecek! haydi oyna!');
}

// buildHexRow'dan hemen sonra, startTimer'dan önce çağır
function applyJokerFlood() {
  if(!_wheelJokerFlood || !currentQ) return;
  _wheelJokerFlood = false; // tek seferlik — skip/değiştir de yeniden uygular
  const answer = answers[currentQ] || '';
  const hidden = [];
  for(let i = 0; i < answer.length; i++) {
    if(answer[i] !== ' ') hidden.push(i);
  }
  // En az 1 harf gizli kalsın; 1 harfli kelimede flood yok
  const count = Math.min(Math.floor(hidden.length / 2), hidden.length - 1);
  if(count <= 0) return;
  // Fisher-Yates karıştır
  for(let i = hidden.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hidden[i], hidden[j]] = [hidden[j], hidden[i]];
  }
  hidden.slice(0, count).forEach(idx => {
    if(!revealedIndices.has(idx)) {
      revealedIndices.add(idx);
      jokerFloodIndices.add(idx);
      revealHexLetter(idx, answer);
    }
  });
  updateScoreBadge();
  showToast('🌊 JOKER FLOOD: ' + count + ' harf bedava açıldı!', 2200);
}

function handleWfChallenge() {
  const spinBtn = document.getElementById('wheel-spin-btn');
  if(spinBtn) spinBtn.style.display = 'none';
  const desc = document.getElementById('wheel-challenge-desc');
  if(desc) desc.innerHTML =
    `<strong style="color:#4ade80;font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:.1em">⚡ CHALLENGE MODE</strong><br><br>
     Joker · Harf İpucu · Türkçe çeviri — hepsi <strong>kapalı</strong>.<br>
     Doğru cevap → <strong style="color:#FFD700">3 KAT PUAN!</strong><br>
     Yanlış cevap → <strong style="color:#f87171">0 puan</strong> + <strong style="color:#f87171">1 🃏 Joker hakkı gider</strong> (varsa).`;
  const box = document.getElementById('wheel-challenge-box');
  if(box) box.style.display = 'block';
}

function acceptChallenge() {
  _wheelChallengeOn = true;
  document.getElementById('wheel-challenge-box').style.display = 'none';
  updateUI();
  showWfContinue('⚡ CHALLENGE KABUL! 3X PUAN ŞANSINA — haydi oyna!');
}

function refuseChallenge() {
  _wheelChallengeOn = false;
  document.getElementById('wheel-challenge-box').style.display = 'none';
  showWfContinue('Challenge reddedildi — normal oyuna devam!');
}

function showWfContinue(msg) {
  const banner  = document.getElementById('wheel-result-banner');
  const btn     = document.getElementById('wheel-continue-btn');
  const spinBtn = document.getElementById('wheel-spin-btn');
  if(msg && banner) banner.textContent = msg;
  if(btn)     btn.style.display     = 'block';
  if(spinBtn) spinBtn.style.display = 'none';
}

function wheelContinue() { closeWheelOverlay(); }


/* ══════════════════════════════════════════════════════════════════
   WORD CHALLENGE — Eşanlamlı / Zıt anlamlı
   ══════════════════════════════════════════════════════════════════ */
function handleWfWordChallenge(type) {
  const src = type === 'syn'
    ? (typeof SYNONYM_PAIRS  !== 'undefined' ? SYNONYM_PAIRS  : [])
    : (typeof OPPOSITE_PAIRS !== 'undefined' ? OPPOSITE_PAIRS : []);

  const eligible = src.filter(p =>
    (selectedGrades.size === 0 || selectedGrades.has(p[0])) &&
    (selectedUnits.size  === 0 || selectedUnits.has(p[1]))
  );

  if(eligible.length === 0) {
    showToast((type === 'syn' ? 'Eşanlamlı' : 'Zıt anlamlı') + ' veri yok — DOUBLE POINTS!');
    handleWfDoublePoints();
    return;
  }

  const pair      = eligible[Math.floor(Math.random() * eligible.length)];
  const wordGroup = pair.slice(2);

  let qWord, aWord;
  if(type === 'opp' && wordGroup.length > 2) {
    // Opposites 3+: ilk kelime her zaman soru, diğerleri zıttı
    qWord     = wordGroup[0];
    aWord     = wordGroup.slice(1)[Math.floor(Math.random() * (wordGroup.length - 1))];
  } else if(wordGroup.length > 2) {
    // Synonyms 3+: rastgele biri soru, diğerinden biri cevap
    const qi  = Math.floor(Math.random() * wordGroup.length);
    qWord     = wordGroup[qi];
    const rem = wordGroup.filter((_, i) => i !== qi);
    aWord     = rem[Math.floor(Math.random() * rem.length)];
  } else {
    [qWord, aWord] = Math.random() < 0.5
      ? [wordGroup[0], wordGroup[1]]
      : [wordGroup[1], wordGroup[0]];
  }

  // Yanlış seçenekler: tüm wordGroup'u dışla (doğru cevap yanlış seçenek olmasın)
  const excludeSet = new Set(wordGroup);
  const pool = typeof QUESTIONS !== 'undefined'
    ? [...new Set(QUESTIONS
        .filter(q => q[3] !== 0
          && (selectedGrades.size === 0 || selectedGrades.has(q[3]))
          && (selectedUnits.size  === 0 || selectedUnits.has(q[5]))
          && !excludeSet.has(q[2]))
        .map(q => q[2]))]
    : [];
  shuffle(pool);
  const opts = [aWord, pool[0] || '???', pool[1] || '???'];
  shuffle(opts);

  // UI
  document.getElementById('wheel-spin-phase').style.display = 'none';
  const wc = document.getElementById('wheel-word-challenge');
  wc.style.display = 'flex';
  document.getElementById('wwc-type-label').textContent =
    type === 'syn' ? '🔤 EŞ ANLAMLISINI BUL' : '🔁 ZIT ANLAMLISINI BUL';
  document.getElementById('wwc-word').textContent = qWord;

  const optEl = document.getElementById('wwc-options');
  optEl.innerHTML = '';
  opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'wwc-opt-btn';
    btn.textContent = opt;
    btn.onclick     = () => answerWfChallenge(opt, aWord, optEl);
    optEl.appendChild(btn);
  });
}

function answerWfChallenge(chosen, correct, optEl) {
  optEl.querySelectorAll('.wwc-opt-btn').forEach(b => {
    b.disabled = true;
    if(b.textContent === correct)                      b.classList.add('correct');
    else if(b.textContent === chosen && chosen !== correct) b.classList.add('wrong');
  });
  if(chosen === correct) {
    sfxCorrect();
    showAnswerStamp(true);
    groupScores[currentGroup] += 500;
    updateUI();
    spawnWheelFloat('+500 🎉', '#4ade80');
    playWheelResultSound();
  } else {
    sfxWrong();
    showAnswerStamp(false);
    if(_wheelChallengeOn) penalizeJoker(currentGroup);
    playWheelWrongSound();
  }
  setTimeout(() => closeWheelOverlay(), 1800);
}


/* ══════════════════════════════════════════════════════════════════
   FLOAT ANİMASYONU — Çark üstünde yay çizerek dışarı uçan metin
   ══════════════════════════════════════════════════════════════════ */
function spawnWheelFloat(text, color) {
  const el = document.createElement('div');
  el.textContent = text;
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  const angleDeg = -90 + (Math.random() - 0.5) * 100;
  const angleRad = angleDeg * Math.PI / 180;
  const dist     = 260 + Math.random() * 80;
  const endX     = cx + Math.cos(angleRad) * dist;
  const endY     = cy + Math.sin(angleRad) * dist;
  el.style.cssText = `
    position:fixed; left:${cx}px; top:${cy}px;
    transform:translate(-50%,-50%) scale(1.3);
    font-family:'Bebas Neue',sans-serif; font-size:clamp(48px,8vw,88px);
    color:${color}; text-shadow:0 0 30px ${color}, 0 0 55px ${color};
    pointer-events:none; z-index:9300; white-space:nowrap;
  `;
  document.body.appendChild(el);
  const duration = 1550, t0 = performance.now();
  (function tick(now) {
    const t    = Math.min((now - t0) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 2.5);
    const x    = cx + (endX - cx) * ease;
    const y    = cy + (endY - cy) * ease - Math.sin(t * Math.PI) * 75;
    const op   = t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35;
    el.style.left      = x + 'px';
    el.style.top       = y + 'px';
    el.style.transform = `translate(-50%,-50%) scale(${1.3 - t * 0.5})`;
    el.style.opacity   = op;
    if(t < 1) requestAnimationFrame(tick); else el.remove();
  })(t0);
}


/* ══════════════════════════════════════════════════════════════════
   DEV OVERRIDE
   ══════════════════════════════════════════════════════════════════ */
function openWheelOverride() {
  const grid = document.getElementById('wom-grid');
  if(!grid) return;
  grid.innerHTML = '';
  const seen = new Set();
  WF_SEGMENTS.forEach(seg => {
    if(seen.has(seg.id)) return;
    seen.add(seg.id);
    const btn = document.createElement('button');
    btn.className   = 'wom-seg-btn';
    btn.style.background = seg.bg;
    btn.style.color      = seg.fg;
    btn.innerHTML = `<span class="wom-seg-icon">${seg.icon}</span>${seg.label.replace('\n', ' ')}`;
    btn.onclick = () => applyWheelOverride(seg.id, seg);
    grid.appendChild(btn);
  });
  document.getElementById('wheel-override-modal').classList.add('open');
}

function closeWheelOverride() {
  document.getElementById('wheel-override-modal').classList.remove('open');
}

function applyWheelOverride(id, seg) {
  closeWheelOverride();
  const banner = document.getElementById('wheel-result-banner');
  if(banner) { banner.textContent = seg.icon + '  ' + seg.label.replace('\n', ' '); banner.style.color = seg.fg; }
  const spinBtn = document.getElementById('wheel-spin-btn');
  if(spinBtn) spinBtn.style.display = 'none';
  const devBtn = document.getElementById('wheel-dev-btn');
  if(devBtn)  devBtn.style.display  = 'none';
  dispatchWheelSegment(id);
}


/* ══════════════════════════════════════════════════════════════════
   SES EFEKTLERİ (Web Audio API — getAC() host tarafından sağlanır)
   ══════════════════════════════════════════════════════════════════ */
function playWheelSpinSound() {
  try {
    const ctx = getAC(); let t = ctx.currentTime;
    for(let i = 0; i < 10; i++) {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'triangle'; o.frequency.value = 180 + i * 45;
      g.gain.setValueAtTime(isMuted ? 0 : 0.07, t + i * 0.07);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.06);
      o.start(t + i * 0.07); o.stop(t + i * 0.07 + 0.06);
    }
  } catch(e) {}
}

function playWheelResultSound() {
  try {
    const ctx = getAC(); const t = ctx.currentTime;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(isMuted ? 0 : 0.18, t + i * 0.11);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.11 + 0.28);
      o.start(t + i * 0.11); o.stop(t + i * 0.11 + 0.28);
    });
  } catch(e) {}
}

function playWheelWrongSound() {
  try {
    const ctx = getAC(); const t = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sawtooth'; o.frequency.value = 120;
    g.gain.setValueAtTime(isMuted ? 0 : 0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    o.start(t); o.stop(t + 0.45);
  } catch(e) {}
}
