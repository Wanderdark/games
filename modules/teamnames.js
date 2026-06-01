// ============================================================
// TEAM NAMES MODULE
// F:\MODULES\teamnames.js
//
// Özellikler:
//   • 2 takım için isim giriş overlay'i
//   • Ekran üstü klavye (Türkçe/İngilizce karakter desteği)
//   • Fiziksel klavye desteği (Enter, Tab, Backspace, Space)
//   • Boş bırakılırsa default isim (TEAM A / TEAM B)
//   • "→" tuşuyla A→B geçişi, cursor blink animasyonu
//
// Kullanım:
//   1. HTML bloğunu <body>'e ekle
//   2. CSS bloğunu <style>'a ekle
//   3. showNameOverlay(onDone) ile aç
//      onDone(teamNames) → ['TAKIM A', 'TAKIM B'] şeklinde array döner
//
// Oyun tarafında tanımlı olması gereken değişkenler:
//   let teamNames = ['TEAM A', 'TEAM B'];
//
// ── HTML ──────────────────────────────────────────────────
// Şunu <body> içine yapıştır:
//
// <div id="name-overlay" class="hidden">
//   <div class="name-modal">
//     <div class="name-title">TEAM NAMES</div>
//     <div class="name-sub">Kutuya tıkla · isim yaz · <strong>→</strong> ile geç</div>
//     <div class="name-inputs">
//       <div class="name-field">
//         <div class="name-label-sm">🔵 Team A</div>
//         <div class="name-display nm-active" id="nd-0" onclick="selectNameField(0)">
//           <span id="nt-0">TEAM A</span><span class="nd-cursor"></span>
//         </div>
//       </div>
//       <div class="name-field">
//         <div class="name-label-sm">🔴 Team B</div>
//         <div class="name-display" id="nd-1" onclick="selectNameField(1)">
//           <span id="nt-1">TEAM B</span><span class="nd-cursor"></span>
//         </div>
//       </div>
//     </div>
//     <div class="nm-kb-wrap">
//       <div class="nm-kb-row" id="nm-kb-row-0"></div>
//       <div class="nm-kb-row" id="nm-kb-row-1"></div>
//       <div class="nm-kb-row" id="nm-kb-row-2"></div>
//       <div class="nm-kb-row" id="nm-kb-row-3"></div>
//     </div>
//     <button class="nm-kb-start" onclick="applyNamesAndStart()">⚡ LET'S PLAY!</button>
//   </div>
// </div>

// ── CSS ───────────────────────────────────────────────────
// Şunu <style> bloğuna kopyala:
//
// #name-overlay{position:fixed;inset:0;z-index:9800;display:flex;align-items:center;
//   justify-content:center;background:rgba(2,8,30,0.96);backdrop-filter:blur(12px)}
// #name-overlay.hidden{display:none}
// /* İsteğe bağlı arka plan görseli: background:url('mainmenu.png') center/cover no-repeat */
// /* Arka plan karartma (görsel varsa):
// #name-overlay::before{content:'';position:absolute;inset:0;
//   background:radial-gradient(ellipse 44% 90% at 50% 50%, rgba(2,8,30,0.72) 0%, rgba(2,8,30,0.18) 100%);
//   pointer-events:none} */
// .name-modal{position:relative;z-index:1;background:rgba(10,4,2,0.62);
//   border:1.5px solid rgba(255,140,0,0.45);border-radius:28px;padding:32px 36px 28px;
//   width:min(96vw,580px);text-align:center;
//   box-shadow:0 0 80px rgba(255,140,0,0.12),0 8px 48px rgba(0,0,0,0.7);
//   backdrop-filter:blur(18px)}
// .name-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,5vw,48px);
//   color:#FF8C00;text-shadow:0 0 30px rgba(255,140,0,0.6);letter-spacing:.08em;margin-bottom:4px}
// .name-sub{font-size:13px;color:rgba(255,255,255,.45);letter-spacing:.08em;margin-bottom:24px}
// .name-inputs{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;
//   margin-bottom:24px;max-width:420px;margin-left:auto;margin-right:auto}
// .name-field{display:flex;flex-direction:column;align-items:center;gap:8px}
// .name-label-sm{font-family:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:.14em;
//   text-transform:uppercase;color:rgba(255,255,255,.45)}
// .name-display{width:100%;min-height:56px;background:rgba(255,140,0,0.07);
//   border:1.5px solid rgba(255,140,0,0.25);border-radius:12px;
//   font-family:'Bebas Neue',sans-serif;font-size:clamp(20px,3vw,30px);
//   color:#FF8C00;letter-spacing:.08em;display:flex;align-items:center;
//   justify-content:center;cursor:pointer;transition:border-color .2s,background .2s;
//   padding:0 10px;word-break:break-all}
// .name-display.nm-active{border-color:#FF8C00;background:rgba(255,140,0,0.13);
//   box-shadow:0 0 20px rgba(255,140,0,0.2)}
// .nd-cursor{display:none;width:2px;height:1.1em;background:#FF8C00;
//   margin-left:2px;animation:ndBlink .8s step-end infinite}
// .name-display.nm-active .nd-cursor{display:inline-block}
// @keyframes ndBlink{0%,100%{opacity:1}50%{opacity:0}}
// .nm-kb-wrap{display:flex;flex-direction:column;gap:6px;margin-bottom:18px}
// .nm-kb-row{display:flex;justify-content:center;gap:5px}
// .nm-kb-key{min-width:36px;height:40px;padding:0 6px;
//   font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;
//   letter-spacing:.06em;background:rgba(255,255,255,0.07);
//   border:1px solid rgba(255,140,0,0.2);border-radius:8px;color:#fff;
//   cursor:pointer;transition:background .12s,transform .1s,border-color .15s;
//   display:flex;align-items:center;justify-content:center}
// .nm-kb-key:hover{background:rgba(255,140,0,0.18);border-color:rgba(255,140,0,0.6)}
// .nm-kb-key:active{transform:scale(0.92)}
// .nm-kb-wide{min-width:68px;font-size:13px}
// .nm-kb-space{min-width:170px}
// .nm-kb-start{width:100%;padding:15px;font-family:'Barlow Condensed',sans-serif;
//   font-size:clamp(17px,2.5vw,22px);font-weight:700;letter-spacing:.14em;
//   text-transform:uppercase;background:linear-gradient(135deg,#15803d,#22c55e);
//   border:none;border-radius:14px;color:#fff;cursor:pointer;
//   box-shadow:0 4px 20px rgba(34,197,94,0.35);transition:transform .15s,box-shadow .15s}
// .nm-kb-start:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(34,197,94,0.5)}

// ── JAVASCRIPT ────────────────────────────────────────────

let activeNameField = 0;
let _nameOnDoneCb   = null; // showNameOverlay(cb) callback'i

const NM_KB_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M','⌫'],
  ['SPACE','CLEAR','→']
];

/* Overlay'i aç. onDone(teamNames) callback'i Tamam'dan sonra çağrılır. */
function showNameOverlay(onDone){
  _nameOnDoneCb = onDone || null;
  teamNames[0] = teamNames[0] || 'TEAM A';
  teamNames[1] = teamNames[1] || 'TEAM B';
  updateNameDisplays();
  selectNameField(0);
  buildNameKeyboard();
  document.getElementById('name-overlay').classList.remove('hidden');
}

function buildNameKeyboard(){
  NM_KB_ROWS.forEach((row, ri)=>{
    const rowEl = document.getElementById('nm-kb-row-' + ri);
    if(!rowEl) return;
    rowEl.innerHTML = '';
    row.forEach(key=>{
      const btn = document.createElement('button');
      btn.className = 'nm-kb-key';
      btn.textContent = key;
      if(key === 'SPACE') btn.classList.add('nm-kb-wide', 'nm-kb-space');
      if(key === 'CLEAR' || key === '→') btn.classList.add('nm-kb-wide');
      btn.onclick = ()=> handleNameKey(key);
      rowEl.appendChild(btn);
    });
  });
}

function handleNameKey(key){
  if(key === '⌫'){
    teamNames[activeNameField] = teamNames[activeNameField].slice(0, -1);
  } else if(key === 'SPACE'){
    if(teamNames[activeNameField].length < 16) teamNames[activeNameField] += ' ';
  } else if(key === 'CLEAR'){
    teamNames[activeNameField] = '';
  } else if(key === '→'){
    selectNameField((activeNameField + 1) % 2); return;
  } else {
    if(teamNames[activeNameField].length < 16) teamNames[activeNameField] += key;
  }
  updateNameDisplays();
}

function selectNameField(idx){
  activeNameField = idx;
  [0, 1].forEach(i=>{
    const el = document.getElementById('nd-' + i);
    if(el) el.classList.toggle('nm-active', i === idx);
  });
  updateNameDisplays();
}

function updateNameDisplays(){
  [0, 1].forEach(i=>{
    const el = document.getElementById('nt-' + i);
    if(el) el.textContent = teamNames[i] || ' ';
  });
}

/* "LET'S PLAY!" butonu ve Enter tuşu buraya bağlı */
function applyNamesAndStart(){
  teamNames[0] = (teamNames[0] || '').trim() || 'TEAM A';
  teamNames[1] = (teamNames[1] || '').trim() || 'TEAM B';
  updateNameDisplays();
  document.getElementById('name-overlay').classList.add('hidden');
  if(_nameOnDoneCb){ const cb = _nameOnDoneCb; _nameOnDoneCb = null; cb([...teamNames]); }
}

/* Fiziksel klavye desteği — overlay açıkken aktif */
document.addEventListener('keydown', function(e){
  const ov = document.getElementById('name-overlay');
  if(!ov || ov.classList.contains('hidden')) return;
  if(e.key === 'Enter')    { applyNamesAndStart(); return; }
  if(e.key === 'Tab')      { e.preventDefault(); handleNameKey('→'); return; }
  if(e.key === 'Backspace'){ e.preventDefault(); handleNameKey('⌫'); return; }
  if(e.key === ' ')        { e.preventDefault(); handleNameKey('SPACE'); return; }
  if(e.key.length === 1 && /[a-zA-Z0-9\-']/.test(e.key)){
    e.preventDefault(); handleNameKey(e.key.toUpperCase());
  }
});
