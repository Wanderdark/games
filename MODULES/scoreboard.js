// ============================================================
// SCOREBOARD MODULE
// F:\MODULES\scoreboard.js
//
// Özellikler:
//   • 🏆 SCORES butonu (sağ alt, oyun içi)
//   • Scores popup: sol panel (overall top 8) + sağ panel (takım detayı)
//   • Yıldız sistemi: kazanan takım, takım içi birinci, genel birinci
//   • TB Result overlay: oyun sonu 3-panel final ekranı
//   • Auto Leaderboard: her tur sonrası 3 sn otomatik çıkan top-5
//     → sıralama değişince "rank up" ses efekti
//   • Teacher Decision footer: "Mücadele bitsin mi?" kararı
//   • Gold pulsate animasyonu birinci için
//
// Bağımlılıklar (oyun tarafında tanımlı olmalı):
//   let groupStudents   = [[], []];       // öğrenci isimleri
//   let studentScoreMap = [[], []];       // studentScoreMap[team][si] = puan
//   let teamNames       = ['TEAM A', 'TEAM B'];
//   let hasPlayedThisRound = [[], []];    // boolean — bu turda oynadı mı
//   function getAudio(){ return audioContext; } // Web Audio API context
//   function teacherDecisionYes(){ ... } // "Evet bitsin" callback'i
//   function teacherDecisionNo(){ ... }  // "Hayır devam" callback'i
//
// ── HTML ──────────────────────────────────────────────────
// Şunu <body> içine yapıştır:
//
// <!-- Scores butonu -->
// <button id="scores-btn" onclick="openScoresPopup()">🏆 SCORES</button>
//
// <!-- Auto Leaderboard — her tur sonrası otomatik çıkar -->
// <div id="auto-lb">
//   <div class="alb-title">🏆 HIGH SCORES</div>
//   <div id="auto-lb-list"></div>
// </div>
//
// <!-- Scores Popup — manuel açılır -->
// <div id="scores-overlay" onclick="if(event.target===this)closeScoresPopup()">
//   <div class="scores-wrapper">
//     <div class="scores-top-bar">
//       <div class="scores-top-title">📊 SCORES</div>
//       <button class="scores-close" onclick="closeScoresPopup()">✕ Kapat</button>
//     </div>
//     <div class="scores-panels">
//       <div class="sp-left">
//         <div class="sp-left-title">🏆 High Scores</div>
//         <div id="scores-list"></div>
//       </div>
//       <div class="sp-right">
//         <div class="sp-right-title">Takım Detayları</div>
//         <div class="sg-grid" id="scores-group-grid"></div>
//       </div>
//     </div>
//     <!-- Teacher Decision — tüm öğrenciler oynadıktan sonra göster -->
//     <div id="teacher-decision-footer">
//       <div class="td-question">🏁 Tüm Oyuncular Oynadı — Mücadele Bitsin Mi?</div>
//       <div class="td-btns" id="td-btns">
//         <button class="td-yes-btn" onclick="teacherDecisionYes()">✓ EVET, BİTSİN</button>
//         <button class="td-no-btn" onclick="teacherDecisionNo()">↺ HAYIR, DEVAM</button>
//       </div>
//       <div class="td-countdown" id="td-countdown"></div>
//     </div>
//   </div>
// </div>
//
// <!-- TB Result Overlay — oyun sonu final ekranı -->
// <div id="tb-result-overlay">
//   <div class="tbr-wrapper">
//     <div class="tbr-ann">
//       <div class="tbr-crown" id="tbr-crown">👑</div>
//       <div class="tbr-winner-title" id="tbr-title">WINNER!</div>
//       <div class="tbr-team-name" id="tbr-team-name"></div>
//       <div class="tbr-coin-label">🪙 Coin</div>
//       <div class="tbr-coin-val" id="tbr-coin-val">—</div>
//       <div class="tbr-divider"></div>
//       <div class="tbr-scores-compare" id="tbr-scores-compare"></div>
//       <button class="tbr-again" onclick="exitFullscreenOnly()">⛶ EXIT FULL SCREEN</button>
//     </div>
//     <div class="tbr-scores-section">
//       <div class="sp-left">
//         <div class="sp-left-title">🏆 High Scores</div>
//         <div id="tbr-scores-list"></div>
//       </div>
//       <div class="sp-right">
//         <div class="sp-right-title">Takım Detayları</div>
//         <div class="sg-grid" id="tbr-group-grid"></div>
//       </div>
//     </div>
//   </div>
// </div>

// ── CSS ───────────────────────────────────────────────────
// Şunu <style> bloğuna kopyala:
//
// /* Scores butonu */
// #scores-btn{position:fixed;bottom:24px;right:24px;z-index:9750;
//   font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;
//   letter-spacing:.14em;text-transform:uppercase;
//   background:rgba(70,20,0,0.85);border:1.5px solid rgba(255,140,0,0.5);
//   color:#FF8C00;border-radius:12px;padding:10px 18px;cursor:pointer;
//   backdrop-filter:blur(8px);box-shadow:0 4px 20px rgba(0,0,0,0.4);
//   transition:background .15s,border-color .15s,transform .15s;display:none}
// #scores-btn.visible{display:block}
// #scores-btn:hover{background:rgba(255,140,0,0.12);border-color:#FF8C00;transform:translateY(-2px)}
//
// /* Scores Overlay */
// #scores-overlay{position:fixed;inset:0;z-index:9800;background:rgba(12,3,0,0.92);
//   display:none;align-items:center;justify-content:center;backdrop-filter:blur(10px)}
// #scores-overlay.open{display:flex}
// .scores-wrapper{background:linear-gradient(145deg,#2D0E00,#120500);
//   border:1.5px solid #FF8C00;border-radius:24px;padding:28px 30px 24px;
//   width:min(96vw,820px);max-height:88vh;display:flex;flex-direction:column;gap:18px;
//   box-shadow:0 0 80px rgba(255,140,0,0.18),0 24px 60px rgba(0,0,0,0.6);
//   animation:modalIn .35s cubic-bezier(.175,.885,.32,1.275)}
// .scores-top-bar{display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
// .scores-top-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(22px,3vw,34px);
//   color:#FF8C00;text-shadow:0 0 24px rgba(255,140,0,0.6);letter-spacing:.1em}
// .scores-close{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;
//   letter-spacing:.1em;text-transform:uppercase;background:transparent;
//   border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,.45);
//   border-radius:8px;padding:6px 14px;cursor:pointer;transition:border-color .15s,color .15s}
// .scores-close:hover{border-color:#FF8C00;color:#FF8C00}
// .scores-panels{display:flex;gap:18px;min-height:0;flex:1;overflow:hidden}
//
// /* Sol panel — overall ranking */
// .sp-left{width:220px;flex-shrink:0;background:rgba(255,255,255,0.03);
//   border:1px solid rgba(255,140,0,0.18);border-radius:16px;padding:16px 14px;
//   display:flex;flex-direction:column;gap:8px;overflow-y:auto}
// .sp-left-title{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;
//   letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);
//   text-align:center;flex-shrink:0}
// .sp-row{display:flex;align-items:center;gap:10px;border-radius:10px;padding:8px 10px;
//   background:rgba(255,255,255,0.04);border:1px solid rgba(255,140,0,0.1)}
// .sp-row.sp-gold  {border-color:rgba(255,140,0,0.55);background:rgba(255,140,0,0.08)}
// .sp-row.sp-silver{border-color:rgba(192,192,192,0.38)}
// .sp-row.sp-bronze{border-color:rgba(205,127,50,0.38)}
// .sp-rk{font-family:'Bebas Neue',sans-serif;font-size:18px;width:20px;text-align:center;flex-shrink:0}
// .sp-gold .sp-rk{color:#FF8C00}
// .sp-row.sp-silver .sp-rk{color:#C0C0C0}
// .sp-row.sp-bronze .sp-rk{color:#CD7F32}
// .sp-row:not(.sp-gold):not(.sp-silver):not(.sp-bronze) .sp-rk{color:rgba(255,255,255,.4)}
// .sp-info{flex:1;min-width:0}
// .sp-name{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;
//   white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff}
// .sp-gold .sp-name{color:#FF8C00;
//   text-shadow:0 0 10px rgba(255,140,0,.95),0 0 22px rgba(255,140,0,.5);
//   animation:goldPulsate 1.5s ease-in-out infinite;display:block}
// .sp-grp{font-size:10px;color:rgba(255,255,255,.4);letter-spacing:.08em}
// .sp-pts{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#FF8C00;flex-shrink:0}
// .sp-gold .sp-pts{text-shadow:0 0 10px rgba(255,140,0,0.9),0 0 24px rgba(255,140,0,0.4)}
// @keyframes goldPulsate{
//   0%,100%{text-shadow:0 0 10px rgba(255,140,0,.95),0 0 22px rgba(255,140,0,.5)}
//   50%{text-shadow:0 0 22px rgba(255,140,0,1),0 0 45px rgba(255,140,0,.85),0 0 70px rgba(255,140,0,.4)}}
//
// /* Sağ panel — takım detayı */
// .sp-right{flex:1;min-width:0;background:rgba(255,255,255,0.03);
//   border:1px solid rgba(255,140,0,0.18);border-radius:16px;padding:16px 18px;
//   display:flex;flex-direction:column;gap:10px;overflow-y:auto}
// .sp-right-title{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;
//   letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);
//   text-align:center;flex-shrink:0}
// .sg-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;flex:1}
// .sg-col{display:flex;flex-direction:column;gap:6px}
// .sg-hdr{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;
//   letter-spacing:.14em;text-transform:uppercase;color:#FF8C00;text-align:center;
//   padding-bottom:6px;border-bottom:1px solid rgba(255,140,0,0.2)}
// .sg-hdr.sg-hdr-a{color:#4A8AF4;border-color:rgba(74,138,244,0.3);text-shadow:0 0 12px rgba(74,138,244,0.6)}
// .sg-hdr.sg-hdr-b{color:#ff5577;border-color:rgba(232,33,58,0.3);text-shadow:0 0 12px rgba(232,33,58,0.6)}
// @keyframes sgWinnerPulse{
//   0%,100%{text-shadow:0 0 10px currentColor,0 0 22px currentColor;letter-spacing:.14em}
//   50%{text-shadow:0 0 22px currentColor,0 0 44px currentColor,0 0 70px currentColor;letter-spacing:.2em}}
// .sg-hdr.sg-hdr-winner{animation:sgWinnerPulse 1.6s ease-in-out infinite;font-size:16px}
// .sg-total{font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.1em;
//   color:rgba(255,140,0,.65);text-align:center;
//   padding:3px 0 7px;border-bottom:1px solid rgba(255,140,0,0.2);margin-bottom:2px}
// .sg-row{display:flex;align-items:center;gap:8px;border-radius:8px;padding:7px 10px;
//   background:rgba(255,255,255,0.03);border:1px solid rgba(255,140,0,0.08)}
// .sg-row.sg-top{border-color:rgba(255,140,0,0.45);background:rgba(255,140,0,0.07)}
// .sg-rank{font-family:'Bebas Neue',sans-serif;font-size:15px;width:18px;
//   text-align:center;flex-shrink:0;color:rgba(255,255,255,.4)}
// .sg-top .sg-rank{color:#FF8C00}
// .sg-sname{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;
//   flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff}
// .sg-top .sg-sname{color:#FF8C00;
//   text-shadow:0 0 10px rgba(255,140,0,.95),0 0 20px rgba(255,140,0,.5);
//   animation:goldPulsate 1.5s ease-in-out infinite;display:block}
// .sg-spts{font-family:'Bebas Neue',sans-serif;font-size:20px;color:#FF8C00;flex-shrink:0}
// .sg-top .sg-spts{text-shadow:0 0 10px rgba(255,140,0,.8),0 0 20px rgba(255,140,0,.35)}
//
// /* Yıldızlar */
// .student-stars{display:flex;gap:1px;flex-shrink:0;line-height:1;align-items:center}
// .star-filled{color:#facc15;font-size:12px;text-shadow:0 0 7px rgba(250,204,21,.85)}
// .star-empty{color:rgba(255,255,255,0.13);font-size:12px}
//
// /* Teacher Decision */
// #teacher-decision-footer{display:none;padding-top:18px;
//   border-top:1px solid rgba(255,140,0,.25);text-align:center;flex-shrink:0}
// .td-question{font-family:'Barlow Condensed',sans-serif;font-size:clamp(14px,1.8vw,19px);
//   font-weight:700;letter-spacing:.1em;color:#fff;margin-bottom:14px;text-transform:uppercase}
// .td-btns{display:flex;gap:14px;justify-content:center;opacity:0;
//   pointer-events:none;transition:opacity .5s ease}
// .td-btns.td-ready{opacity:1;pointer-events:auto}
// .td-yes-btn,.td-no-btn{padding:10px 30px;border:none;border-radius:11px;cursor:pointer;
//   font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;
//   letter-spacing:.12em;text-transform:uppercase;color:#fff;
//   transition:transform .12s,box-shadow .15s}
// .td-yes-btn{background:linear-gradient(135deg,#15803d,#22c55e)}
// .td-yes-btn:hover{transform:scale(1.06);box-shadow:0 0 22px rgba(34,197,94,.5)}
// .td-no-btn{background:linear-gradient(135deg,#b91c1c,#ef4444)}
// .td-no-btn:hover{transform:scale(1.06);box-shadow:0 0 22px rgba(239,68,68,.5)}
// .td-countdown{font-family:'Bebas Neue',sans-serif;font-size:28px;color:rgba(255,255,255,.4);
//   text-align:center;margin-top:8px;min-height:34px;transition:opacity .4s;letter-spacing:.1em}
// .scores-wrapper.teacher-mode .scores-close{display:none}
//
// /* Auto Leaderboard */
// #auto-lb{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9600;
//   width:min(92vw,420px);
//   background:linear-gradient(145deg,rgba(55,18,4,0.98),rgba(20,5,0,0.98));
//   border:1.5px solid #FF8C00;border-radius:22px;padding:22px 26px 28px;
//   box-shadow:0 0 80px rgba(255,140,0,.22),0 24px 64px rgba(0,0,0,.8);
//   backdrop-filter:blur(18px);opacity:0;pointer-events:none;transition:opacity .45s ease}
// #auto-lb.show{opacity:1}
// .alb-title{font-family:'Bebas Neue',sans-serif;font-size:28px;
//   color:#FF8C00;text-shadow:0 0 28px rgba(255,140,0,0.5);
//   letter-spacing:.14em;text-align:center;margin-bottom:16px}
// #auto-lb-list{position:relative;transition:height .55s ease}
// .alb-row{position:absolute;left:0;right:0;height:48px;
//   display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.04);
//   border:1px solid rgba(255,140,0,.12);border-radius:10px;padding:0 14px;
//   transition:top .55s cubic-bezier(.4,0,.2,1),opacity .4s}
// .alb-row.r1{border-color:rgba(255,140,0,.55);background:rgba(255,140,0,.09)}
// .alb-row.r2{border-color:rgba(192,192,192,.38)}
// .alb-row.r3{border-color:rgba(205,127,50,.38)}
// .alb-rk{font-family:'Bebas Neue',sans-serif;font-size:20px;width:24px;text-align:center;flex-shrink:0}
// .alb-row.r1 .alb-rk{color:#FF8C00}
// .alb-row.r2 .alb-rk{color:#C0C0C0}
// .alb-row.r3 .alb-rk{color:#CD7F32}
// .alb-row:not(.r1):not(.r2):not(.r3) .alb-rk{color:rgba(255,255,255,.4)}
// .alb-info{flex:1;min-width:0}
// .alb-name{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700;
//   color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
// .alb-row.r1 .alb-name{color:#FF8C00;
//   text-shadow:0 0 10px rgba(255,140,0,.95),0 0 22px rgba(255,140,0,.55),0 0 40px rgba(255,140,0,.25);
//   animation:albGoldPulse 1.5s ease-in-out infinite;display:inline-block}
// @keyframes albGoldPulse{
//   0%,100%{transform:scale(1);letter-spacing:.08em}
//   50%{transform:scale(1.10);letter-spacing:.13em}}
// .alb-row.r1 .alb-pts{text-shadow:0 0 12px rgba(255,140,0,.9),0 0 28px rgba(255,140,0,.45)}
// .alb-grp{font-size:10px;color:rgba(255,255,255,.4);letter-spacing:.08em}
// .alb-pts{font-family:'Bebas Neue',sans-serif;font-size:26px;color:#FF8C00;flex-shrink:0}
//
// /* TB Result Overlay */
// #tb-result-overlay{position:fixed;inset:0;z-index:9700;background:rgba(12,3,0,0.96);
//   display:none;align-items:center;justify-content:center;backdrop-filter:blur(12px)}
// #tb-result-overlay.open{display:flex}
// .tbr-wrapper{display:flex;gap:16px;align-items:stretch;width:min(98vw,1060px);
//   max-height:90vh;animation:modalIn .4s cubic-bezier(.175,.885,.32,1.275)}
// .tbr-ann{width:220px;flex-shrink:0;background:linear-gradient(145deg,#2D0E00,#120500);
//   border:1.5px solid #FF8C00;border-radius:20px;padding:28px 20px 24px;
//   display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;
//   box-shadow:0 0 60px rgba(255,140,0,0.15)}
// .tbr-crown{font-size:54px;animation:tbrFloat 2s ease-in-out infinite}
// @keyframes tbrFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
// .tbr-winner-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,3.5vw,42px);
//   color:#FF8C00;text-shadow:0 0 30px rgba(255,140,0,0.7);letter-spacing:.08em}
// .tbr-team-name{font-family:'Barlow Condensed',sans-serif;font-size:clamp(16px,2.5vw,24px);
//   font-weight:700;letter-spacing:.1em;text-transform:uppercase;
//   animation:tbrNamePulse 1.8s ease-in-out infinite}
// @keyframes tbrNamePulse{0%,100%{opacity:1}50%{opacity:.7}}
// .tbr-team-name.tbr-a{color:#4A8AF4;text-shadow:0 0 20px rgba(74,138,244,.8),0 0 40px rgba(74,138,244,.4)}
// .tbr-team-name.tbr-b{color:#ff5577;text-shadow:0 0 20px rgba(232,33,58,.8),0 0 40px rgba(232,33,58,.4)}
// .tbr-team-name.tbr-draw{color:#FF8C00;text-shadow:0 0 20px rgba(255,140,0,.8)}
// .tbr-coin-label{font-size:11px;color:rgba(255,255,255,.4);letter-spacing:.1em;text-transform:uppercase;margin-top:2px}
// .tbr-coin-val{font-family:'Bebas Neue',sans-serif;font-size:32px;color:#FF8C00;
//   text-shadow:0 0 16px rgba(255,140,0,.6)}
// .tbr-divider{width:80%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,140,0,.3),transparent);
//   margin:6px 0;flex-shrink:0}
// .tbr-scores-compare{width:100%;display:flex;flex-direction:column;gap:4px}
// .tbr-sc-row{display:flex;justify-content:space-between;align-items:center;
//   font-family:'Barlow Condensed',sans-serif;font-size:14px;padding:5px 8px;
//   border-radius:8px;background:rgba(255,255,255,.04);
//   border:1px solid rgba(255,140,0,.08);color:rgba(255,255,255,.4)}
// .tbr-sc-row.tbr-sc-winner{background:rgba(255,140,0,.09);border-color:rgba(255,140,0,.35);
//   color:#FF8C00;font-weight:700;font-size:15px}
// .tbr-sc-name{flex:1;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
// .tbr-sc-hp{font-family:'Bebas Neue',sans-serif;font-size:18px;flex-shrink:0}
// .tbr-again{width:100%;margin-top:auto;padding:13px;font-family:'Barlow Condensed',sans-serif;
//   font-size:17px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
//   background:linear-gradient(135deg,#CC5500,#FF8C00);border:none;border-radius:12px;
//   color:#fff;cursor:pointer;box-shadow:0 4px 20px rgba(204,85,0,0.4);transition:transform .15s}
// .tbr-again:hover{transform:translateY(-2px)}
// .tbr-scores-section{flex:1;min-width:0;display:flex;gap:14px;overflow:hidden}
// @keyframes modalIn{0%{opacity:0;transform:scale(.88)}100%{opacity:1;transform:scale(1)}}

// ── JAVASCRIPT ────────────────────────────────────────────


/* ── Scores butonu görünürlüğü ── */
function setScoresBtn(visible){
  const sb = document.getElementById('scores-btn');
  if(sb) sb.classList.toggle('visible', visible);
}

/* ── Popup aç / kapat ── */
function openScoresPopup(){
  _renderScoresPopup();
  document.getElementById('scores-overlay').classList.add('open');
}
function closeScoresPopup(){
  document.getElementById('scores-overlay').classList.remove('open');
}

/* ── Yıldız hesaplama ──
 * Kural:
 *   taban: kazanan takım = 2 yıldız, kaybeden = 1 yıldız
 *   +1 → takım içinde birinci
 *   +1 → oyunun genel birincisi
 *   max 4 yıldız
 */
function calcStarMap(){
  const teamTotals = [0,1].map(gi =>
    groupStudents[gi].reduce((s,_,si) => s + studentScoreMap[gi][si], 0)
  );
  const leadTeam   = teamTotals[0] >= teamTotals[1] ? 0 : 1;
  const teamTopPts = [0,1].map(gi =>
    groupStudents[gi].length ? Math.max(...groupStudents[gi].map((_,si) => studentScoreMap[gi][si])) : 0
  );
  const allPts    = [0,1].flatMap(gi => groupStudents[gi].map((_,si) => studentScoreMap[gi][si]));
  const overallTop = allPts.length ? Math.max(...allPts) : 0;

  const starMap = {};
  [0,1].forEach(gi => {
    groupStudents[gi].forEach((_,si) => {
      const pts = studentScoreMap[gi][si];
      const key = `${gi}-${si}`;
      if(pts === 0){ starMap[key] = 0; return; }
      let stars = gi === leadTeam ? 2 : 1;
      if(pts === teamTopPts[gi]) stars++;
      if(overallTop > 0 && pts === overallTop) stars++;
      starMap[key] = Math.min(4, stars);
    });
  });
  return starMap;
}

function renderStarsHtml(count, max=4){
  let html = '';
  for(let i=0; i<max; i++)
    html += `<span class="${i<count?'star-filled':'star-empty'}">★</span>`;
  return `<div class="student-stars">${html}</div>`;
}

/* ── Tüm öğrenci veri listesi ── */
function getAllStudentEntries(){
  const entries = [];
  [0,1].forEach(gi => {
    groupStudents[gi].forEach((name,si) => {
      entries.push({
        key: gi+'-'+si, gi, si, name,
        group: teamNames[gi] || (gi===0?'Team A':'Team B'),
        pts: studentScoreMap[gi][si]
      });
    });
  });
  return entries;
}

/* ── Popup + TB Result render (paylaşımlı) ──
 *   listId  → overall ranking için <div> id'si
 *   gridId  → takım detay grid için <div> id'si
 *   winTeam → null=oyun devam ediyor, 0/1=kazanan takım
 */
function _renderScoresPopup(listId='scores-list', gridId='scores-group-grid', winTeam=null){
  const starMap = calcStarMap();

  // Sol panel: overall top 8
  const list = document.getElementById(listId);
  if(!list) return;
  list.innerHTML = '';
  const allEntries = getAllStudentEntries().sort((a,b) => b.pts - a.pts).slice(0, 8);
  if(allEntries.length === 0){
    list.innerHTML = '<div style="color:rgba(255,255,255,.4);text-align:center;padding:20px;font-family:\'Barlow Condensed\',sans-serif;font-size:15px;">Henüz puan yok.</div>';
  } else {
    allEntries.forEach((e,idx) => {
      const mod = idx===0?' sp-gold':idx===1?' sp-silver':idx===2?' sp-bronze':'';
      const stars = starMap[e.key] ?? 0;
      const row = document.createElement('div');
      row.className = 'sp-row' + mod;
      row.innerHTML =
        `<div class="sp-rk">${idx+1}</div>`+
        `<div class="sp-info"><div class="sp-name">${e.name}</div><div class="sp-grp">${e.group}</div></div>`+
        renderStarsHtml(stars)+
        `<div class="sp-pts">${e.pts}</div>`;
      list.appendChild(row);
    });
  }

  // Sağ panel: takım detayı
  const grid = document.getElementById(gridId);
  if(!grid) return;
  grid.innerHTML = '';
  const teamTotals = [0,1].map(gi =>
    groupStudents[gi].reduce((s,_,si) => s + studentScoreMap[gi][si], 0)
  );

  [0,1].forEach(gi => {
    const col = document.createElement('div');
    col.className = 'sg-col';

    const hdr = document.createElement('div');
    const isWinner = winTeam !== null && gi === winTeam;
    const isLoser  = winTeam !== null && gi !== winTeam;
    hdr.className = 'sg-hdr ' + (gi===0?'sg-hdr-a':'sg-hdr-b') + (isWinner?' sg-hdr-winner':'');
    const medal = isWinner?'🥇 ':isLoser?'🥈 ':(gi===0?'🔵 ':'🔴 ');
    hdr.innerHTML = medal + (teamNames[gi].trim() || (gi===0?'Team A':'Team B'));
    col.appendChild(hdr);

    const total = document.createElement('div');
    total.className = 'sg-total';
    total.textContent = 'Toplam: ' + teamTotals[gi] + ' puan';
    col.appendChild(total);

    const students = groupStudents[gi]
      .map((name,si) => ({name, pts:studentScoreMap[gi][si], si}))
      .sort((a,b) => b.pts - a.pts);

    if(students.length === 0){
      const empty = document.createElement('div');
      empty.style.cssText = 'color:rgba(255,255,255,.4);font-size:13px;text-align:center;padding:10px;font-family:\'Barlow Condensed\',sans-serif';
      empty.textContent = '–';
      col.appendChild(empty);
    } else {
      students.forEach((s,idx) => {
        const stars = starMap[`${gi}-${s.si}`] ?? 0;
        const played = (typeof hasPlayedThisRound !== 'undefined') ? (hasPlayedThisRound[gi]?.[s.si] ?? false) : true;
        const row = document.createElement('div');
        row.className = 'sg-row' + (idx===0?' sg-top':'');
        row.innerHTML =
          `<div class="sg-rank">${idx+1}</div>`+
          `<div class="sg-sname ${played?'played':'not-played'}">${s.name}</div>`+
          renderStarsHtml(stars)+
          `<div class="sg-spts">${s.pts}</div>`;
        col.appendChild(row);
      });
    }
    grid.appendChild(col);
  });
}

/* ── TB Result Overlay — oyun sonu ──
 *   winTeam: 0 | 1 | null (beraberlik)
 *   winnerCoins: kazananın coin değeri
 *   teamCoins: [coinsA, coinsB]
 */
function showTbResultOverlay(winTeam, winnerCoins, teamCoins){
  _renderScoresPopup('tbr-scores-list', 'tbr-group-grid', winTeam);

  const isDraw = winTeam === null;
  const crown   = document.getElementById('tbr-crown');
  const title   = document.getElementById('tbr-title');
  const nameEl  = document.getElementById('tbr-team-name');
  const coinVal = document.getElementById('tbr-coin-val');
  const compare = document.getElementById('tbr-scores-compare');

  if(crown)   crown.textContent  = isDraw ? '🤝' : '👑';
  if(title)   title.textContent  = isDraw ? 'BERABERE!' : 'WINNER!';
  if(nameEl){
    nameEl.textContent = isDraw ? 'İKİ TAKIM DA' : (teamNames[winTeam] || (winTeam===0?'TEAM A':'TEAM B'));
    nameEl.className   = 'tbr-team-name ' + (isDraw?'tbr-draw':winTeam===0?'tbr-a':'tbr-b');
  }
  if(coinVal) coinVal.textContent = isDraw ? (teamCoins?teamCoins[0]:'—') : (winnerCoins ?? '—');

  // Skor karşılaştırma satırları
  if(compare && teamCoins){
    compare.innerHTML = '';
    [0,1].forEach(gi => {
      const row = document.createElement('div');
      const isW = !isDraw && gi === winTeam;
      row.className = 'tbr-sc-row' + (isW?' tbr-sc-winner':'');
      row.innerHTML =
        `<span class="tbr-sc-name">${teamNames[gi]||('Team '+(gi===0?'A':'B'))}</span>`+
        `<span class="tbr-sc-hp">${teamCoins[gi]} pts</span>`;
      compare.appendChild(row);
    });
  }

  document.getElementById('tb-result-overlay').classList.add('open');
}

function closeTbResultOverlay(){
  document.getElementById('tb-result-overlay').classList.remove('open');
}

/* ── Auto Leaderboard — tur sonrası top-5 ──
 *   cb: overlay kapandıktan sonra çağrılır
 */
const ALB_SLOT = 54;
let autoLbTimer    = null;
let autoLbRowEls   = {};
let autoLbPrevOrder = [];

function sfxRankUp(){
  if(typeof getAudio !== 'function') return;
  const ac = getAudio();
  const t  = ac.currentTime;
  [523,659,784,1047].forEach((freq,i)=>{
    const g = ac.createGain();
    g.gain.setValueAtTime(0, t+i*.09);
    g.gain.linearRampToValueAtTime(.28, t+i*.09+.025);
    g.gain.exponentialRampToValueAtTime(.001, t+i*.09+.28);
    g.connect(ac.destination);
    const o = ac.createOscillator();
    o.type = 'sine'; o.frequency.setValueAtTime(freq, t+i*.09);
    o.connect(g); o.start(t+i*.09); o.stop(t+i*.09+.32);
  });
  const ng = ac.createGain();
  ng.gain.setValueAtTime(.12,t); ng.gain.exponentialRampToValueAtTime(.001,t+.5);
  ng.connect(ac.destination);
  const no = ac.createOscillator();
  no.type = 'triangle'; no.frequency.setValueAtTime(2093,t);
  no.connect(ng); no.start(t); no.stop(t+.55);
}

function showTurnLeaderboard(cb){
  const total = groupStudents[0].length + groupStudents[1].length;
  if(total === 0){ cb(); return; }
  const hasAnyPts = getAllStudentEntries().some(e => e.pts > 0);
  if(!hasAnyPts){ cb(); return; }
  _renderAutoLeaderboard(cb);
}

function _renderAutoLeaderboard(cb){
  const overlay   = document.getElementById('auto-lb');
  const container = document.getElementById('auto-lb-list');
  if(!overlay || !container){ cb(); return; }

  const top5 = getAllStudentEntries()
    .filter(e => e.pts > 0)
    .sort((a,b) => b.pts - a.pts || a.key.localeCompare(b.key))
    .slice(0, 5);

  // Sıralama değişimi → ses efekti
  const newOrder = top5.map(e => e.key);
  let rankChanged = false;
  newOrder.forEach((key,newIdx) => {
    const oldIdx = autoLbPrevOrder.indexOf(key);
    if(oldIdx === -1 && autoLbPrevOrder.length > 0) rankChanged = true;
    else if(oldIdx !== -1 && newIdx < oldIdx) rankChanged = true;
  });
  if(rankChanged && autoLbPrevOrder.length > 0) sfxRankUp();
  autoLbPrevOrder = newOrder;

  const newKeySet = new Set(top5.map(e => e.key));
  Object.entries(autoLbRowEls).forEach(([k,el]) => {
    if(!newKeySet.has(k)){ el.remove(); delete autoLbRowEls[k]; }
  });

  top5.forEach((entry,idx) => {
    const top    = idx * ALB_SLOT;
    const rClass = idx===0?'r1':idx===1?'r2':idx===2?'r3':'';
    let row = autoLbRowEls[entry.key];
    if(row){
      row.className = 'alb-row' + (rClass?' '+rClass:'');
      row.style.top = top + 'px';
      row.querySelector('.alb-rk').textContent  = idx+1;
      row.querySelector('.alb-pts').textContent = entry.pts;
    } else {
      row = document.createElement('div');
      row.className  = 'alb-row' + (rClass?' '+rClass:'');
      row.dataset.key = entry.key;
      row.style.top  = top + 'px';
      row.innerHTML  =
        `<div class="alb-rk">${idx+1}</div>`+
        `<div class="alb-info"><div class="alb-name">${entry.name}</div><div class="alb-grp">${entry.group}</div></div>`+
        `<div class="alb-pts">${entry.pts}</div>`;
      container.appendChild(row);
      autoLbRowEls[entry.key] = row;
    }
  });

  container.style.height = (top5.length * ALB_SLOT) + 'px';
  overlay.classList.add('show');
  clearTimeout(autoLbTimer);
  autoLbTimer = setTimeout(()=>{
    overlay.classList.remove('show');
    setTimeout(cb, 460); // opacity transition süresi
  }, 3000);
}

/* ── Auto LB'yi temizle (yeni oyun başında) ── */
function resetScoreboardState(){
  autoLbRowEls   = {};
  autoLbPrevOrder = [];
  clearTimeout(autoLbTimer);
  const container = document.getElementById('auto-lb-list');
  if(container) container.innerHTML = '';
}
