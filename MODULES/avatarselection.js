// ============================================================
// AVATAR SELECTION MODULE
// F:\MODULES\avatarselection.js
//
// Özellikler:
//   • Team bazlı avatar seçim overlay'i (2 adımlı: A → B)
//   • Student modu: her öğrenci kendi turunda avatar seçer
//   • Kategori dropdown (avatars.js'deki isimlendirmeye göre otomatik)
//   • Preview: seçilen avatar ekranın sol/sağ kenarında büyük görünür
//   • Swipe/drag ile preview'da avatar gezme
//   • Ghost stack: student modunda önceki öğrenciler küçük siluet olarak sıralanır
//   • avatarFlip: Team A sağa, Team B sola otomatik yönlendirme
//
// Bağımlılıklar:
//   - avatars.js  → AVATARS dizisi  { src, facesRight }
//   - avataroutline.png, avataroutline2.png  (seçim yapılmamış placeholder)
//
// Oyun tarafında tanımlı olması gereken değişkenler:
//   let teamAvatars = [null, null];
//   let teamNames   = ['TEAM A', 'TEAM B'];
//   let AVATAR_MODE = 'team' | 'student';
//   let groupStudents = [[], []];
//   let studentIndex  = [0, 0];
//   let studentAvatars = [[], []];       // studentAvatars[team][si] = AVATARS index | null
//   let studentAvatarShown = [[], []];   // boolean flags
//   let avatarDmgTriggered = [false, false];
//   function dmgSrc(src){ return src.replace(/(\.[^.]+)$/, '_dmg$1'); }
//   function updateNameDisplays(){ ... }
//   function resetStudentState(){ ... }
//   function showStudentOverlay(){ ... }
//
// ── AVATAR SELECT OVERLAY HTML ────────────────────────────
// Şunu <body> içine yapıştır:
//
// <div id="avatar-select-overlay" class="hidden">
//   <div class="avs-modal">
//     <div class="avs-step-bar">
//       <span class="avs-step-pip" id="avs-pip-0"></span>
//       <span class="avs-step-pip" id="avs-pip-1"></span>
//     </div>
//     <div class="avs-title team-a" id="avs-title">🔵 TEAM A — AVATAR SEÇ</div>
//     <div class="avs-category-bar">
//       <label class="avs-cat-label">KATEGORİ</label>
//       <select class="avs-category-sel" id="avs-category-sel"
//               onchange="renderAvatarGrid(avsStep, this.value)"></select>
//     </div>
//     <div class="avs-grid" id="avs-grid-single"></div>
//     <div class="avs-warning" id="avs-warning"></div>
//     <div class="avs-btn-row">
//       <button class="avs-back-btn" id="avs-back-btn"
//               onclick="showAvatarSelectStep(0)" style="display:none">← GERİ</button>
//       <button class="avs-confirm-btn" id="avs-confirm-btn"
//               onclick="confirmAvatarSelect()">OK</button>
//     </div>
//   </div>
//   <!-- Onay dialog -->
//   <div class="avs-confirm-dialog hidden" id="avs-confirm-dialog">
//     <div class="avs-confirm-msg" id="avs-confirm-dialog-msg"></div>
//     <div class="avs-confirm-btns">
//       <button onclick="avsConfirmYes()">Evet, Devam Et</button>
//       <button onclick="avsConfirmNo()">Hayır, Seç</button>
//     </div>
//   </div>
// </div>
//
// <!-- Preview img'leri — body'e doğrudan ekle (position:fixed) -->
// <img id="av-preview-a" class="av-preview" src="">
// <img id="av-preview-b" class="av-preview" src="">
//
// <!-- In-game avatar containers -->
// <div id="game-avatar-a" class="game-avatar hidden">
//   <img id="game-avatar-img-a" src="">
// </div>
// <div id="game-avatar-b" class="game-avatar hidden">
//   <img id="game-avatar-img-b" src="">
// </div>

// ── CSS ───────────────────────────────────────────────────
// Şunu projenin <style> bloğuna kopyala:
//
// /* ── GAME AVATARS ── */
// .game-avatar{position:fixed;bottom:0;z-index:50;pointer-events:none;opacity:1;
//   transition:opacity .4s;display:flex;flex-direction:column}
// .game-avatar.hidden{opacity:0;pointer-events:none}
// #game-avatar-a{left:0;align-items:flex-start}
// #game-avatar-b{right:0;align-items:flex-end}
// .game-avatar img{max-height:90vh;max-width:25vw;width:auto;display:block;
//   filter:drop-shadow(0 0 30px rgba(255,140,0,0.2));transition:filter .4s,opacity .4s}
//
// /* Oynayan avatar — yüzme animasyonu */
// .game-avatar.avatar-active{animation:avatarFloat 2.2s ease-in-out infinite}
// .game-avatar.avatar-active img{
//   filter:drop-shadow(0 0 28px rgba(255,140,0,0.55)) drop-shadow(0 0 55px rgba(255,140,0,0.25))}
// @keyframes avatarFloat{0%,100%{transform:translateY(0px)}50%{transform:translateY(-14px)}}
//
// /* Bekleyen avatar — tam opak ama dim (ghost sızması olmasın) */
// .game-avatar.avatar-idle img{
//   filter:brightness(0.45) saturate(0.6) drop-shadow(0 0 10px rgba(255,140,0,0.06));opacity:1}
//
// /* Ghost stack */
// .avatar-ghost{position:fixed;bottom:0;max-height:90vh;max-width:25vw;width:auto;display:block;
//   pointer-events:none;transform-origin:bottom center;
//   filter:brightness(0.65) saturate(0.5) drop-shadow(0 0 6px rgba(0,0,0,0.5));
//   animation:ghostAppear .45s ease-out}
// @keyframes ghostAppear{from{opacity:0}}
//
// /* Preview */
// .av-preview{position:absolute;bottom:0;max-height:75vh;width:auto;pointer-events:none;
//   opacity:0;filter:drop-shadow(0 0 28px rgba(255,140,0,0.22));
//   transition:opacity .35s ease,left .4s cubic-bezier(.22,1,.36,1),right .4s cubic-bezier(.22,1,.36,1)}
// .av-preview.avs-swipeable{pointer-events:auto;cursor:grab;user-select:none}
// .av-preview.avs-swipeable:active{cursor:grabbing}
// #av-preview-a{left:-60vw}
// #av-preview-b{right:-60vw}
//
// /* Avatar Select Overlay */
// #avatar-select-overlay{position:fixed;inset:0;z-index:9800;display:flex;align-items:center;
//   justify-content:center;background:rgba(2,8,30,0.92);backdrop-filter:blur(10px)}
// #avatar-select-overlay.hidden{display:none}
// .avs-modal{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);
//   border-radius:18px;padding:20px;width:min(96vw,480px);display:flex;flex-direction:column;gap:10px;
//   position:relative;z-index:1}
// .avs-step-bar{display:flex;gap:8px;justify-content:center}
// .avs-step-pip{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.15);
//   transition:background .3s}
// .avs-step-pip.pip-a{background:#4A8AF4}
// .avs-step-pip.pip-b{background:#ff5577}
// .avs-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(16px,2.5vw,22px);
//   font-weight:700;letter-spacing:.16em;text-transform:uppercase;text-align:center}
// .avs-title.team-a{color:#4A8AF4}.avs-title.team-b{color:#ff5577}
// .avs-category-bar{display:flex;align-items:center;gap:8px}
// .avs-cat-label{font-size:11px;letter-spacing:.1em;color:rgba(255,255,255,.4);text-transform:uppercase}
// .avs-category-sel{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);
//   border-radius:7px;color:#fff;padding:4px 8px;font-size:13px;cursor:pointer}
// .avs-grid{display:grid;gap:6px;max-height:36vh;overflow-y:auto}
// .avs-card{background:rgba(255,255,255,.06);border:2px solid transparent;border-radius:10px;
//   padding:6px 4px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;
//   transition:border-color .15s,background .15s}
// .avs-card:hover{background:rgba(255,255,255,.12)}
// .avs-card.avs-selected-a{border-color:#4A8AF4;background:rgba(74,138,244,.15)}
// .avs-card.avs-selected-b{border-color:#ff5577;background:rgba(255,85,119,.15)}
// .avs-card img{width:100%;max-height:80px;object-fit:contain}
// .avs-card-name{font-size:9px;letter-spacing:.08em;color:rgba(255,255,255,.5);
//   text-transform:uppercase;text-align:center}
// .avs-warning{font-size:12px;color:#ff5577;text-align:center;min-height:16px}
// .avs-btn-row{display:flex;gap:8px}
// .avs-back-btn,.avs-confirm-btn{flex:1;padding:10px;font-family:'Barlow Condensed',sans-serif;
//   font-size:clamp(14px,2vw,18px);font-weight:700;letter-spacing:.14em;text-transform:uppercase;
//   border:none;border-radius:10px;cursor:pointer}
// .avs-back-btn{background:rgba(255,255,255,.1);color:rgba(255,255,255,.7)}
// .avs-confirm-btn{background:linear-gradient(135deg,#1e3a5f,#2563eb);color:#fff}
// .avs-confirm-dialog{position:absolute;inset:0;background:rgba(2,8,30,0.96);border-radius:18px;
//   display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;z-index:2}
// .avs-confirm-dialog.hidden{display:none}
// .avs-confirm-msg{color:#fff;font-size:14px;text-align:center;white-space:pre-line;
//   padding:0 20px;letter-spacing:.04em}
// .avs-confirm-btns{display:flex;gap:10px}
// .avs-confirm-btns button{padding:8px 20px;border:none;border-radius:8px;cursor:pointer;
//   font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:.1em}
// .avs-confirm-btns button:first-child{background:#22c55e;color:#fff}
// .avs-confirm-btns button:last-child{background:rgba(255,255,255,.1);color:rgba(255,255,255,.7)}

// ── JAVASCRIPT ────────────────────────────────────────────

// Team A (sol) sağa, Team B (sağ) sola bakmalı
function avatarFlip(avatarIdx, team){
  if(avatarIdx===null) return 'scaleX(1)';
  const facesRight=AVATARS[avatarIdx].facesRight;
  const shouldFaceRight=(team===0);
  return (facesRight!==shouldFaceRight)?'scaleX(-1)':'scaleX(1)';
}

function applyGameAvatars(){
  [0,1].forEach(team=>{
    const suffix=team===0?'a':'b';
    const container=document.getElementById('game-avatar-'+suffix);
    const img=document.getElementById('game-avatar-img-'+suffix);
    if(!container||!img) return;
    if(teamAvatars[team]!==null){
      const _av=AVATARS[teamAvatars[team]];
      img.src=avatarDmgTriggered[team]?dmgSrc(_av.src):_av.src;
      img.onerror=()=>{ img.onerror=null; img.src=_av.src; };
      img.style.transform=avatarFlip(teamAvatars[team],team);
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
  });
  if(teamAvatars[0]!==null && teamAvatars[1]!==null){
    document.body.classList.add('avatars-active');
  } else {
    document.body.classList.remove('avatars-active');
  }
}

function initAvatarPreviews(){
  [0,1].forEach(team=>{
    const id=team===0?'av-preview-a':'av-preview-b';
    const el=document.getElementById(id);
    if(!el) return;
    if(teamAvatars[team]!==null){
      el.src=AVATARS[teamAvatars[team]].src;
      el.style.transform=avatarFlip(teamAvatars[team],team);
      el.style.opacity='0.82';
      if(team===0) el.style.left='0'; else el.style.right='0';
    } else {
      el.style.opacity='0';
      if(team===0) el.style.left='-60vw'; else el.style.right='-60vw';
    }
  });
}

/* ── Avatar isim/kategori parser ──
 * AV_COMIC_Batman.png → {category:'COMIC', name:'BATMAN'}
 * AV_Batman.png       → {category:'GENEL', name:'BATMAN'}
 */
function parseAvName(src){
  const base=src.replace(/\.[^.]+$/,'');
  const parts=base.split('_');
  if(parts.length>=3){
    return {category:parts[1].toUpperCase(), name:parts.slice(2).join(' ').toUpperCase()};
  }
  return {category:'GENEL', name:(parts[1]||base).toUpperCase()};
}

function getAvsCategories(){
  const cats=new Set();
  AVATARS.forEach(av=>{
    if(/_dmg\.[^.]+$/i.test(av.src)) return;
    cats.add(parseAvName(av.src).category);
  });
  return [...cats].sort();
}

let currentAvsCategory='';

function buildCategoryDropdown(){
  const sel=document.getElementById('avs-category-sel');
  if(!sel) return;
  const bar=sel.closest('.avs-category-bar');
  const cats=getAvsCategories();
  if(bar) bar.style.display=(cats.length<=1)?'none':'flex';
  sel.innerHTML='';
  cats.forEach(cat=>{
    const opt=document.createElement('option');
    opt.value=cat; opt.textContent=cat;
    sel.appendChild(opt);
  });
  if(!currentAvsCategory||!cats.includes(currentAvsCategory)) currentAvsCategory=cats[0];
  sel.value=currentAvsCategory;
}

let avsStep=0; // 0=Team A, 1=Team B

function renderAvatarGrid(team, catFilter){
  if(catFilter!==undefined) currentAvsCategory=catFilter;
  const grid=document.getElementById('avs-grid-single');
  if(!grid) return;
  grid.innerHTML='';
  const selClass=team===0?'avs-selected-a':'avs-selected-b';

  const list=[];
  AVATARS.forEach((av,idx)=>{
    if(/_dmg\.[^.]+$/i.test(av.src)) return;
    const parsed=parseAvName(av.src);
    if(parsed.category!==currentAvsCategory) return;
    list.push({av,idx,parsed});
  });

  if(list.length===0){
    grid.style.gridTemplateColumns='1fr';
    grid.innerHTML=`<div class="avs-no-avatar">Bu kategoride avatar yok</div>`;
    return;
  }
  grid.style.gridTemplateColumns=`repeat(5,1fr)`;
  list.forEach(({av,idx,parsed})=>{
    const card=document.createElement('div');
    card.className='avs-card'+(teamAvatars[team]===idx?' '+selClass:'');
    card.dataset.idx=String(idx);
    card.onclick=()=>selectAvatarNew(team,idx);
    const flip=(av.facesRight!==(team===0))?'scaleX(-1)':'scaleX(1)';
    card.innerHTML=`<img src="${av.src}" style="transform:${flip}" draggable="false">`+
                   `<div class="avs-card-name">${parsed.name}</div>`;
    grid.appendChild(card);
  });
}

function showAvatarSelectStep(step){
  avsStep=step;
  const isA=(step===0);
  const team=step;

  const title=document.getElementById('avs-title');
  if(title){
    title.textContent=(isA?'🔵 '+(teamNames[0]||'TEAM A'):'🔴 '+(teamNames[1]||'TEAM B'))+' — AVATAR SEÇ';
    title.className='avs-title '+(isA?'team-a':'team-b');
  }

  const p0=document.getElementById('avs-pip-0');
  const p1=document.getElementById('avs-pip-1');
  if(p0) p0.className='avs-step-pip'+(isA?' pip-a':'');
  if(p1) p1.className='avs-step-pip'+(!isA?' pip-b':'');

  const backBtn=document.getElementById('avs-back-btn');
  if(backBtn) backBtn.style.display=isA?'none':'';
  const confBtn=document.getElementById('avs-confirm-btn');
  if(confBtn) confBtn.textContent=isA?'OK':'START';

  [0,1].forEach(t=>{
    const prevEl=document.getElementById(t===0?'av-preview-a':'av-preview-b');
    if(!prevEl) return;
    if(teamAvatars[t]!==null && AVATARS[teamAvatars[t]]){
      prevEl.src=AVATARS[teamAvatars[t]].src;
      prevEl.style.transform=avatarFlip(teamAvatars[t],t);
      prevEl.style.opacity=t===team?'0.82':'0.38';
      if(t===0) prevEl.style.left='0'; else prevEl.style.right='0';
    } else {
      prevEl.src=t===0?'avataroutline.png':'avataroutline2.png';
      prevEl.style.transform='scaleX(1)';
      prevEl.style.opacity=t===team?'0.35':'0.22';
      if(t===0) prevEl.style.left='0'; else prevEl.style.right='0';
    }
  });

  const preA=document.getElementById('av-preview-a');
  const preB=document.getElementById('av-preview-b');
  if(preA) preA.classList.toggle('avs-swipeable',isA);
  if(preB) preB.classList.toggle('avs-swipeable',!isA);

  const warn=document.getElementById('avs-warning');
  if(warn) warn.textContent='';

  renderAvatarGrid(team);
  document.getElementById('avatar-select-overlay').classList.remove('hidden');
}

function showAvatarSelect(){
  buildCategoryDropdown();
  showAvatarSelectStep(0);
}

/* ── Student-mode: her öğrenci kendi turunda tek adımda seçer ── */
let avsStudentMode=false;
let avsStudentCb=null;

function showStudentAvatarScreen(team, studentName, cb){
  avsStudentMode=true;
  avsStudentCb=cb;
  avsStep=team;
  buildCategoryDropdown();

  const title=document.getElementById('avs-title');
  if(title){
    title.textContent=(team===0?'🔵 ':'🔴 ')+(studentName||'ÖĞRENCİ')+' — AVATAR SEÇ';
    title.className='avs-title '+(team===0?'team-a':'team-b');
  }

  const stepBar=document.querySelector('#avatar-select-overlay .avs-step-bar');
  if(stepBar) stepBar.style.visibility='hidden';

  const backBtn=document.getElementById('avs-back-btn');
  if(backBtn) backBtn.style.display='none';
  const confBtn=document.getElementById('avs-confirm-btn');
  if(confBtn) confBtn.textContent='✓ TAMAM';

  [0,1].forEach(t=>{
    const prevEl=document.getElementById(t===0?'av-preview-a':'av-preview-b');
    if(!prevEl) return;
    if(t!==team){
      prevEl.style.opacity='0';
      prevEl.classList.remove('avs-swipeable');
      return;
    }
    const si=studentIndex[team];
    const saved=(studentAvatars[team][si]!==undefined)?studentAvatars[team][si]:null;
    if(saved!==null && AVATARS[saved]){
      prevEl.src=AVATARS[saved].src;
      prevEl.style.transform=avatarFlip(saved,team);
      prevEl.style.opacity='0.82';
      teamAvatars[team]=saved;
    } else {
      prevEl.src=team===0?'avataroutline.png':'avataroutline2.png';
      prevEl.style.transform='scaleX(1)';
      prevEl.style.opacity='0.35';
      teamAvatars[team]=null;
    }
    if(team===0) prevEl.style.left='0'; else prevEl.style.right='0';
    prevEl.classList.add('avs-swipeable');
  });

  const warn=document.getElementById('avs-warning');
  if(warn) warn.textContent='';
  renderAvatarGrid(team);
  document.getElementById('avatar-select-overlay').classList.remove('hidden');
}

function selectAvatarNew(team, idx){
  const isLeft=(team===0);
  const prevEl=document.getElementById(isLeft?'av-preview-a':'av-preview-b');

  if(teamAvatars[team]===idx){
    teamAvatars[team]=null;
    if(prevEl){
      prevEl.src=team===0?'avataroutline.png':'avataroutline2.png';
      prevEl.style.transform='scaleX(1)';
      prevEl.style.opacity='0.35';
    }
  } else {
    teamAvatars[team]=idx;
    if(prevEl){
      const av=AVATARS[idx];
      prevEl.src=av.src;
      prevEl.style.transform=avatarFlip(idx,team);
      requestAnimationFrame(()=>{
        prevEl.style.opacity='0.82';
        if(isLeft) prevEl.style.left='0'; else prevEl.style.right='0';
      });
    }
  }

  const selClass=team===0?'avs-selected-a':'avs-selected-b';
  const grid=document.getElementById('avs-grid-single');
  if(grid) grid.querySelectorAll('.avs-card').forEach(c=>{
    c.classList.toggle(selClass, parseInt(c.dataset.idx)===teamAvatars[team]);
  });
}

let _avsConfirmCb=null;
function _showAvsConfirmDialog(msg, onYes){
  const dlg=document.getElementById('avs-confirm-dialog');
  const msgEl=document.getElementById('avs-confirm-dialog-msg');
  if(msgEl) msgEl.textContent=msg;
  _avsConfirmCb=onYes;
  if(dlg) dlg.classList.remove('hidden');
}
function avsConfirmYes(){
  document.getElementById('avs-confirm-dialog').classList.add('hidden');
  if(_avsConfirmCb){ _avsConfirmCb(); _avsConfirmCb=null; }
}
function avsConfirmNo(){
  document.getElementById('avs-confirm-dialog').classList.add('hidden');
  _avsConfirmCb=null;
}

function _closeAvatarOverlay(){
  const preA=document.getElementById('av-preview-a');
  const preB=document.getElementById('av-preview-b');
  if(preA) preA.classList.remove('avs-swipeable');
  if(preB) preB.classList.remove('avs-swipeable');
  const stepBar=document.querySelector('#avatar-select-overlay .avs-step-bar');
  if(stepBar) stepBar.style.visibility='';
  document.getElementById('avatar-select-overlay').classList.add('hidden');
}

function confirmAvatarSelect(){
  const warn=document.getElementById('avs-warning');
  if(warn) warn.textContent='';
  const team=avsStep;
  if(teamAvatars[team]===null){
    let displayName;
    if(avsStudentMode){
      const si=studentIndex[team];
      displayName=groupStudents[team][si]||(team===0?'TEAM A':'TEAM B');
    } else {
      displayName=teamNames[team]||(team===0?'TEAM A':'TEAM B');
    }
    _showAvsConfirmDialog(`${displayName} avatar seçmedi.\nDevam etmek istiyor musunuz?`, _doConfirmAvatarSelect);
    return;
  }
  _doConfirmAvatarSelect();
}

function _doConfirmAvatarSelect(){
  if(avsStudentMode){
    avsStudentMode=false;
    const selectedIdx=teamAvatars[avsStep];
    _closeAvatarOverlay();
    const cb=avsStudentCb; avsStudentCb=null;
    if(cb) cb(selectedIdx);
    return;
  }
  if(avsStep===0){
    showAvatarSelectStep(1);
  } else {
    _closeAvatarOverlay();
    applyGameAvatars();
    resetStudentState();
    showStudentOverlay();
  }
}

/* ── Ghost Stack ─────────────────────────────────────────
 * Student modunda önceki öğrencilerin avatarları
 * ekranın kenarında küçük silüet olarak sıralanır.
 * GHOST_DEFS: 5 derinlik seviyesi — en son oynayan en yakın
 */
const GHOST_DEFS=[
  {offsetVw:7,  scale:0.76, opacity:1},
  {offsetVw:12, scale:0.60, opacity:1},
  {offsetVw:16, scale:0.46, opacity:1},
  {offsetVw:19, scale:0.34, opacity:1},  // ufak tefek sırıkıyor
  {offsetVw:21, scale:0.24, opacity:1},  // "nereye kaybolduk?" seviyesi
];

function _clearTeamGhosts(team){
  const cls='avatar-ghost-team-'+(team===0?'a':'b');
  document.querySelectorAll('.'+cls).forEach(g=>g.remove());
}

function updateAvatarTeamStack(team){
  _clearTeamGhosts(team);
  if(AVATAR_MODE!=='student') return;

  const si=studentIndex[team];
  const st=groupStudents[team];
  if(!st||!st.length) return;

  // Daha önce oynamış öğrencileri topla (en son oynayan önce)
  const played=[];
  for(let i=st.length-1;i>=0;i--){
    if(i===si) continue;
    if(studentAvatarShown[team][i] && studentAvatars[team][i]!=null) played.push(i);
  }

  const teamCls='avatar-ghost-team-'+(team===0?'a':'b');
  played.slice(0,GHOST_DEFS.length).forEach((studentIdx,gi)=>{
    const avatarIdx=studentAvatars[team][studentIdx];
    const av=AVATARS[avatarIdx];
    if(!av) return;
    const ghost=document.createElement('img');
    ghost.className='avatar-ghost '+teamCls;
    ghost.src=av.src;
    const def=GHOST_DEFS[gi];
    const flip=avatarFlip(avatarIdx,team);
    // z-index: 10/9/8... — main avatar container 50'de, kesin ayrım
    ghost.style.zIndex=String(10-gi);
    if(team===0) ghost.style.left=def.offsetVw+'vw';
    else         ghost.style.right=def.offsetVw+'vw';
    ghost.style.opacity=def.opacity;
    ghost.style.transform=`scale(${def.scale}) ${flip}`;
    document.body.appendChild(ghost);
  });
}

/* ── Preview Swipe ───────────────────────────────────────
 * Avatar seçim ekranında preview görseline swipe/drag
 * yaparak avatarlar arasında gezme.
 */
const AVS_OUTLINE_DEFAULT=['AV_anime_Nora.png','AV_anime_Orion.png']; // [teamA, teamB]

function swipeAvatarPreview(team, dir){
  const list=[];
  AVATARS.forEach((av,idx)=>{
    if(/_dmg\.[^.]+$/i.test(av.src)) return;
    if(parseAvName(av.src).category!==currentAvsCategory) return;
    list.push(idx);
  });
  if(!list.length) return;
  const cur=teamAvatars[team];
  if(cur===null && AVS_OUTLINE_DEFAULT[team]){
    const defSrc=AVS_OUTLINE_DEFAULT[team];
    const defIdx=AVATARS.findIndex(av=>av.src===defSrc||av.src.endsWith('/'+defSrc)||av.src.endsWith(defSrc));
    teamAvatars[team]=defIdx!==-1?defIdx:list[0];
  } else {
    const pos=cur===null?-1:list.indexOf(cur);
    const newPos=pos===-1?(dir>0?0:list.length-1):(pos+dir+list.length)%list.length;
    teamAvatars[team]=list[newPos];
  }
  const selClass=team===0?'avs-selected-a':'avs-selected-b';
  const grid=document.getElementById('avs-grid-single');
  if(grid) grid.querySelectorAll('.avs-card').forEach(c=>{
    c.classList.toggle(selClass,parseInt(c.dataset.idx)===teamAvatars[team]);
  });
}

function initPreviewSwipe(){
  [0,1].forEach(team=>{
    const el=document.getElementById(team===0?'av-preview-a':'av-preview-b');
    if(!el) return;
    let startX=0, dragX=0, active=false;
    const THRESHOLD=50;

    function localTx(flip,vx){ return flip==='scaleX(-1)'?-vx:vx; }
    function curFlip(){ return teamAvatars[team]!==null?avatarFlip(teamAvatars[team],team):'scaleX(1)'; }

    function onStart(x){
      const ov=document.getElementById('avatar-select-overlay');
      if(!ov||ov.classList.contains('hidden')) return;
      if(avsStep!==team) return;
      startX=x; dragX=0; active=true;
      el.style.transition='none';
    }
    function onMove(x){
      if(!active) return;
      dragX=x-startX;
      const f=curFlip();
      el.style.transform=`${f} translateX(${localTx(f,dragX)}px)`;
    }
    function onEnd(){
      if(!active) return;
      active=false;
      if(Math.abs(dragX)<THRESHOLD){
        el.style.transition='transform 0.22s cubic-bezier(.22,1,.36,1)';
        el.style.transform=curFlip();
        el.style.opacity=teamAvatars[team]===null?'0.35':'0.82';
        return;
      }
      const goNext=dragX<0;
      const dir=goNext?1:-1;
      const wasOutline=teamAvatars[team]===null;
      if(wasOutline){
        el.style.transition='none';
        el.style.transform='scaleX(1)';
        swipeAvatarPreview(team,dir);
        if(teamAvatars[team]===null) return;
        const nf=avatarFlip(teamAvatars[team],team);
        el.src=AVATARS[teamAvatars[team]].src;
        el.style.transform=nf;
        el.style.opacity='0.82';
      } else {
        const exitVX=goNext?-420:420;
        const enterVX=goNext?420:-420;
        const f=curFlip();
        el.style.transition='transform 0.17s ease,opacity 0.14s ease';
        el.style.transform=`${f} translateX(${localTx(f,exitVX)}px)`;
        el.style.opacity='0';
        setTimeout(()=>{
          swipeAvatarPreview(team,dir);
          if(teamAvatars[team]===null) return;
          const nf=avatarFlip(teamAvatars[team],team);
          el.src=AVATARS[teamAvatars[team]].src;
          el.style.transition='none';
          el.style.transform=`${nf} translateX(${localTx(nf,enterVX)}px)`;
          el.style.opacity='0';
          requestAnimationFrame(()=>requestAnimationFrame(()=>{
            el.style.transition='transform 0.26s cubic-bezier(.22,1,.36,1),opacity 0.2s ease';
            el.style.transform=nf;
            el.style.opacity='0.82';
          }));
        },160);
      }
    }

    el.addEventListener('mousedown',e=>{e.preventDefault();onStart(e.clientX);},{passive:false});
    window.addEventListener('mousemove',e=>{if(active)onMove(e.clientX);});
    window.addEventListener('mouseup',()=>{if(active)onEnd();});
    el.addEventListener('touchstart',e=>{onStart(e.touches[0].clientX);},{passive:true});
    el.addEventListener('touchmove',e=>{if(active){e.preventDefault();onMove(e.touches[0].clientX);}},{passive:false});
    el.addEventListener('touchend',()=>{if(active)onEnd();},{passive:true});
  });
}
initPreviewSwipe();
