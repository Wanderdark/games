// ============================================================
// STUDENT SELECTION MODULE
// F:\MODULES\studentselection.js
//
// Kullanım:
//   1. HTML'e ekle:  <script src="../../MODULES/studentselection.js"></script>
//   2. names.js'i projeye ekle (aşağıdaki formatta)
//   3. showStudentOverlay() ile overlay'i aç
//   4. applyStudentsAndContinue() callback'ini kendi oyununa bağla
//
// names.js formatı:
//   const STUDENTS = [
//     { name: 'ALİ',   level: 'A' },
//     { name: 'AYŞE',  level: 'B' },
//     ...
//   ];
//   Seviyeler: S (süper) > A > B > C > D > F (zayıf)
//
// Bağımlılıklar:
//   - names.js (STUDENTS array)
//   - Aşağıdaki CSS bloğunu projenin style bölümüne kopyala
//   - STD_SLOTS, studentInputs, teamNames değişkenleri oyun tarafında tanımlı olmalı
//
// ── balanceDistribute() OVERRIDE NOTU ────────────────────────
// Oyun tarafında balanceDistribute() override edilebilir (örn. selectedClasses filtresi için).
// Override'ın _silentDistributed bayrağını set etmesi GEREKMEZ — assignStdRandom() bunu
// balanceDistribute() çağrısından sonra zaten kendisi garantiyle set eder.
// Override'ın yapması gereken tek şey: studentInputs[0..1][0..STD_SLOTS-1] dizisini doldurmak.
// ============================================================

// ── OVERLAY HTML ──────────────────────────────────────────
// Aşağıdaki HTML bloğunu <body> içine yapıştır:
//
// <div id="student-overlay" class="hidden">
//   <div class="std-modal">
//     <div class="std-title">ÖĞRENCİ İSİMLERİ</div>
//     <div class="std-sub">Her takım için isimler girin — boş bırakılanlar dahil edilmez</div>
//     <div class="std-cols" id="std-cols"></div>
//     <div class="std-kb-wrap">
//       <div class="std-kb-row" id="std-kb-0"></div>
//       <div class="std-kb-row" id="std-kb-1"></div>
//       <div class="std-kb-row" id="std-kb-2"></div>
//       <div class="std-kb-row" id="std-kb-3"></div>
//     </div>
//     <div id="std-warning"></div>
//     <div class="std-actions">
//       <button class="std-balance" onclick="balanceDistribute()">⚖ Dengeli Dağıt</button>
//       <button class="std-start" onclick="applyStudentsAndContinue()">✓ Tamam, Devam Et</button>
//     </div>
//   </div>
// </div>

// ── CSS ───────────────────────────────────────────────────
// Şunları projenin <style> bloğuna kopyala:
//
// #student-overlay{position:fixed;inset:0;z-index:9820;background:rgba(2,8,30,0.97);
//   display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px)}
// #student-overlay.hidden{display:none}
// .std-modal{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);
//   border-radius:18px;padding:24px;width:min(96vw,560px);display:flex;flex-direction:column;gap:12px}
// .std-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(18px,3vw,26px);
//   font-weight:700;letter-spacing:.18em;text-transform:uppercase;text-align:center;color:#fff}
// .std-sub{font-size:11px;color:rgba(255,255,255,.45);text-align:center;letter-spacing:.06em}
// .std-cols{display:grid;grid-template-columns:1fr auto 1fr;column-gap:6px}
// .std-group-col{display:flex;flex-direction:column;gap:3px;flex:1}
// .std-group-hdr{font-family:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:.14em;
//   text-transform:uppercase;font-weight:700;margin-bottom:1px}
// .std-group-hdr.hdr-a{color:#4A8AF4}.std-group-hdr.hdr-b{color:#ff5577}
// .std-slot{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
//   border-radius:7px;padding:6px 8px;cursor:pointer;font-size:13px;
//   font-family:'Barlow Condensed',sans-serif;letter-spacing:.1em;color:#fff;min-height:30px;
//   display:flex;align-items:center;gap:4px;transition:background .15s,border-color .15s}
// .std-slot.active{border-color:#4A8AF4;background:rgba(74,138,244,.12)}
// .std-slot.is-empty .stdt{opacity:.3}
// .std-swap-col{display:flex;flex-direction:column;gap:3px;align-items:center}
// .std-swap-hdr{min-height:18px;margin-bottom:1px}
// .std-swap-btn{width:20px;height:24px;flex-shrink:0;background:rgba(255,255,255,.05);
//   border:1px solid rgba(255,255,255,.1);border-radius:5px;color:rgba(255,255,255,.35);
//   font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;
//   padding:0;transition:background .15s,color .15s,transform .12s}
// .std-swap-btn:hover{background:rgba(255,140,0,.18);border-color:rgba(255,140,0,.4);
//   color:var(--gold);transform:scale(1.15)}
// .std-actions{display:flex;gap:8px;width:100%}
// .std-balance{flex:0 0 auto;padding:11px 18px;font-family:'Barlow Condensed',sans-serif;
//   font-size:clamp(13px,1.8vw,17px);font-weight:700;letter-spacing:.12em;text-transform:uppercase;
//   background:linear-gradient(135deg,#1e3a5f,#2563eb);border:none;border-radius:11px;color:#fff;
//   cursor:pointer;white-space:nowrap}
// .std-start{flex:1;padding:11px;font-family:'Barlow Condensed',sans-serif;
//   font-size:clamp(15px,2vw,20px);font-weight:700;letter-spacing:.14em;text-transform:uppercase;
//   background:linear-gradient(135deg,#15803d,#22c55e);border:none;border-radius:11px;
//   color:#fff;cursor:pointer}

// ── YOKLAMA OVERLAY
//    HTML (student-overlay'den ÖNCE ekle):
//    <div id="attendance-overlay" class="hidden">
//      <div class="att-modal">
//        <div class="att-title">📋 YOKLAMA</div>
//        <div class="att-sub">Bugün gelmeyen öğrencilere tıkla — üzeri çizili = devamsız</div>
//        <div id="att-body"></div>
//        <button class="att-done" onclick="closeAttendance()">✓ Tamam</button>
//      </div>
//    </div>
//    std-actions'a ekle (⚖ Dengeli Dağıt'tan ÖNCE):
//    <button class="std-attendance" id="att-btn" onclick="openAttendance()">📋 Yoklama</button>
//
//    CSS:
//    #attendance-overlay{position:fixed;inset:0;z-index:9830;background:rgba(2,8,30,0.97);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(14px)}
//    #attendance-overlay.hidden{display:none}
//    .att-modal{background:rgba(255,255,255,.05);border:1.5px solid rgba(255,215,0,.35);border-radius:26px;padding:22px 26px 20px;width:min(98vw,600px);max-height:92vh;overflow-y:auto;text-align:center}
//    .att-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(22px,3.5vw,34px);color:var(--gold);letter-spacing:.1em;margin-bottom:2px}
//    .att-sub{font-family:'Barlow Condensed',sans-serif;font-size:11px;color:rgba(255,255,255,.4);letter-spacing:.1em;margin-bottom:16px}
//    .att-class-section{margin-bottom:14px;text-align:left}
//    .att-class-label{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:7px}
//    .att-students{display:flex;flex-wrap:wrap;gap:7px}
//    .att-student{padding:8px 13px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:.08em;border-radius:9px;border:1.5px solid rgba(74,222,128,.45);background:rgba(74,222,128,.1);color:#4ade80;cursor:pointer;transition:all .15s;user-select:none}
//    .att-student:hover{transform:translateY(-1px)}
//    .att-student.absent{border-color:rgba(248,113,113,.4);background:rgba(248,113,113,.1);color:rgba(248,113,113,.55);text-decoration:line-through}
//    .att-done{width:100%;margin-top:16px;padding:12px;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;border-radius:11px;color:#fff;cursor:pointer}
//    .std-attendance{flex:0 0 auto;padding:11px 16px;font-family:'Barlow Condensed',sans-serif;font-size:clamp(12px,1.7vw,15px);font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;border-radius:11px;color:#fff;cursor:pointer;white-space:nowrap}
//
// ── ÖNEMLI: applyStudentsAndContinue() oyun tarafında tanımlanmalı.
//    Aşağıdaki activeFilter desenini kullan — gizli dağıtım aktifse
//    sadece reveal edilmiş slotlar oyuna dahil edilir:
//
//    function applyStudentsAndContinue(){
//      const activeFilter=(n,gi,si)=>
//        n.trim()!=='' && (!_silentDistributed || _slotRevealed[gi][si]===true);
//      const sizes=[0,1].map(gi=>studentInputs[gi].filter((n,si)=>activeFilter(n,gi,si)).length);
//      // ... eşitlik kontrolü ...
//      [0,1].forEach(gi=>{
//        groupStudents[gi]=studentInputs[gi].filter((n,si)=>activeFilter(n,gi,si));
//      });
//    }
//
// ── JAVASCRIPT ────────────────────────────────────────────

// Gizli dağıtım state
let _slotRevealed=[[],[]];    // _slotRevealed[gi][si] = bool — hangi slotlar görünür
let _silentDistributed=false; // gizli dağıtım yapıldı mı
let absentStudents=new Set(); // bugün devamsız öğrenciler (isim bazlı) — yoklama overlay'den güncellenir

/* ── Overlay oluşturma ──────────────────────────────────── */
function buildStdGroupCol(gi){
  const col=document.createElement('div');
  col.className='std-group-col';
  const hdr=document.createElement('div');
  hdr.className='std-group-hdr '+(gi===0?'hdr-a':'hdr-b');
  hdr.textContent=(gi===0?'🔵 ':'🔴 ')+(teamNames[gi]||(gi===0?'Team A':'Team B'));
  col.appendChild(hdr);
  for(let si=0;si<STD_SLOTS;si++){
    const slot=document.createElement('div');
    const revealed=_slotRevealed[gi]&&_slotRevealed[gi][si];
    const visibleVal=revealed?studentInputs[gi][si]:'';
    slot.className='std-slot'+(visibleVal.trim()===''?' is-empty':'');
    slot.id=`std-${gi}-${si}`;
    slot.onclick=()=>selectStdField(gi,si);
    slot.ondblclick=(e)=>{ e.stopPropagation(); clearStdSlot(gi,si); };
    const txt=document.createElement('span');
    txt.id=`stdt-${gi}-${si}`;
    txt.textContent=visibleVal;
    const cur=document.createElement('span');
    cur.className='std-cursor';
    const rnd=document.createElement('button');
    rnd.className='std-rand';
    rnd.title='Rastgele isim';
    rnd.textContent='🎲';
    rnd.onclick=(e)=>{ e.stopPropagation(); assignStdRandom(gi,si); };
    slot.appendChild(txt);
    slot.appendChild(cur);
    slot.appendChild(rnd);
    col.appendChild(slot);
  }
  return col;
}

function buildSwapCol(){
  const col=document.createElement('div');
  col.className='std-swap-col';
  const hdr=document.createElement('div');
  hdr.className='std-swap-hdr';
  col.appendChild(hdr);
  for(let si=0;si<STD_SLOTS;si++){
    const btn=document.createElement('button');
    btn.className='std-swap-btn';
    btn.title='Yer değiştir';
    btn.textContent='⇄';
    btn.onclick=()=>swapStudents(si);
    col.appendChild(btn);
  }
  return col;
}

function showStudentOverlay(){
  // Slotları kapalı başlat — gizli dağıtım ilk zar tuşuna basıldığında yapılır
  _slotRevealed=[[],[]];
  for(let gi=0;gi<2;gi++) for(let si=0;si<STD_SLOTS;si++) _slotRevealed[gi][si]=false;
  _silentDistributed=false;

  const cols=document.getElementById('std-cols');
  cols.innerHTML='';
  cols.appendChild(buildStdGroupCol(0));
  cols.appendChild(buildSwapCol());
  cols.appendChild(buildStdGroupCol(1));
  document.getElementById('student-overlay').classList.remove('hidden');
  if(typeof buildStdKeyboard==='function') buildStdKeyboard();
  if(typeof selectStdField==='function') selectStdField(0,0);
}

/* ── Yer değiştir ─────────────────────────────────────── */
function swapStudents(si){
  const tmp=studentInputs[0][si];
  studentInputs[0][si]=studentInputs[1][si];
  studentInputs[1][si]=tmp;
  const tmpR=_slotRevealed[0][si];
  _slotRevealed[0][si]=_slotRevealed[1][si];
  _slotRevealed[1][si]=tmpR;
  [0,1].forEach(gi=>{
    const revealed=_slotRevealed[gi][si];
    const val=revealed?studentInputs[gi][si]:'';
    const t=document.getElementById(`stdt-${gi}-${si}`);
    if(t) t.textContent=val;
    const s=document.getElementById(`std-${gi}-${si}`);
    if(s){
      if(val.trim()==='') s.classList.add('is-empty');
      else s.classList.remove('is-empty');
    }
  });
}

/* ── Rastgele / Gizli Aç ──────────────────────────────── */
function clearStdSlot(gi,si){
  studentInputs[gi][si]='';
  const t=document.getElementById(`stdt-${gi}-${si}`);
  if(t) t.textContent='';
  const s=document.getElementById(`std-${gi}-${si}`);
  if(s) s.classList.add('is-empty');
  if(typeof selectStdField==='function') selectStdField(gi,si);
}

function assignStdRandom(gi,si){
  // İlk zar tuşunda gizli dağıtımı yap (yoklama bu noktada kesinleşmiş olur)
  // _silentDistributed burada garantiyle set edilir — balanceDistribute override'larının
  // bu bayrağı set etmesi GEREKMİYOR (bakınız modül başındaki override notu).
  if(!_silentDistributed){
    balanceDistribute(true);
    _silentDistributed=true;  // override'dan bağımsız olarak her zaman set et
  }
  if(_silentDistributed){
    // Gizli dağıtım var — sadece bu slotu aç
    _slotRevealed[gi][si]=true;
    const val=studentInputs[gi][si];
    const t=document.getElementById(`stdt-${gi}-${si}`);
    if(t) t.textContent=val;
    const s=document.getElementById(`std-${gi}-${si}`);
    if(s){
      if(val.trim()==='') s.classList.add('is-empty');
      else s.classList.remove('is-empty');
    }
    if(typeof selectStdField==='function') selectStdField(gi,si);
  } else {
    // Gizli dağıtım yok — havuzdan rastgele isim ata
    const name=pickStdRandom();
    if(!name) return;
    studentInputs[gi][si]=name;
    _slotRevealed[gi][si]=true;
    const t=document.getElementById(`stdt-${gi}-${si}`);
    if(t) t.textContent=name;
    const s=document.getElementById(`std-${gi}-${si}`);
    if(s) s.classList.remove('is-empty');
    if(typeof selectStdField==='function') selectStdField(gi,si);
  }
}

function pickStdRandom(){
  const used=new Set();
  for(let g=0;g<2;g++) for(let s=0;s<STD_SLOTS;s++){
    if(studentInputs[g][s].trim()) used.add(studentInputs[g][s].trim().toUpperCase());
  }
  const pool=(typeof RANDOM_NAMES!=='undefined')?RANDOM_NAMES:[];
  const avail=pool.filter(n=>!used.has(n.toUpperCase()));
  return avail.length>0 ? avail[Math.floor(Math.random()*avail.length)] : null;
}

/* ── Dengeli Otomatik Dağıtım ─────────────────────────────
 * Algoritma: Greedy balancing
 *   - Seviye puanı: S=6 A=5 B=4 C=3 D=2 F=1
 *   - Tek sayıda öğrenci varsa en zayıf (F) çıkarılır → eşit takımlar
 *   - Her öğrenciyi o an düşük puana sahip takıma ver
 *   - Sonuç: toplam puanlar mümkün olduğunca eşit
 *   - Sıralama: S→A→B→C→D→F
 *   - silent=true → sadece studentInputs'u güncelle, UI dokunma
 *   - silent=false → hepsini görünür yap, uyarı göster
 */
function balanceDistribute(silent=false){
  const LEVEL_PTS={S:6,A:5,B:4,C:3,D:2,F:1};
  const LEVEL_ORDER=['S','A','B','C','D','F'];

  const rawPool=(typeof STUDENTS!=='undefined')?STUDENTS:
               (typeof RANDOM_NAMES!=='undefined')?RANDOM_NAMES.map(n=>({name:n,level:'C'})):[];
  const pool=rawPool.filter(s=>!absentStudents.has(s.name??s));
  if(!pool.length){ _silentDistributed=false; return; }

  // Seviyeye göre sırala (yüksek→düşük), aynı seviyedekiler karışsın
  const sorted=[...pool].sort((a,b)=>{
    const diff=(LEVEL_PTS[b.level]||3)-(LEVEL_PTS[a.level]||3);
    return diff!==0 ? diff : Math.random()-.5;
  });

  // Tek sayıda öğrenci varsa en düşük seviyeli (son sıradaki) çıkarılır
  const distPool=sorted.length%2!==0 ? sorted.slice(0,-1) : sorted;

  // Greedy: her öğrenciyi o an daha düşük toplam puana sahip takıma ver
  const teams=[[],[]];
  const scores=[0,0];
  distPool.forEach(s=>{
    const t=scores[0]<=scores[1]?0:1;
    teams[t].push(s.name||s);
    scores[t]+=(LEVEL_PTS[s.level]||3);
  });

  // Her takımı S→A→B→C→D→F sırasına göre sırala
  [0,1].forEach(gi=>{
    teams[gi].sort((a,b)=>{
      const ai=LEVEL_ORDER.indexOf(sorted.find(s=>(s.name||s)===a)?.level??'C');
      const bi=LEVEL_ORDER.indexOf(sorted.find(s=>(s.name||s)===b)?.level??'C');
      return (ai===-1?99:ai)-(bi===-1?99:bi);
    });
  });

  const maxLen=Math.max(teams[0].length,teams[1].length);
  [0,1].forEach(gi=>{ while(teams[gi].length<maxLen) teams[gi].push(''); });

  // studentInputs'u güncelle
  [0,1].forEach(gi=>{
    for(let si=0;si<STD_SLOTS;si++){
      studentInputs[gi][si]=si<teams[gi].length?teams[gi][si]:'';
    }
  });

  _silentDistributed=true;
  // Gizli puan göstergesi — sol üst now-playing overlay'e yaz (sadece öğretmen fark eder)
  const _np=document.getElementById('now-playing');
  if(_np){
    const _base=_np.textContent.replace(/\s*·\s*\d+-\d+$/,'');
    _np.textContent=_base+' · '+scores[0]+'-'+scores[1];
  }
  if(silent) return; // gizli mod: sadece data, UI güncelleme yok

  // Açık mod: tüm slotları görünür yap + DOM güncelle
  [0,1].forEach(gi=>{
    for(let si=0;si<STD_SLOTS;si++){
      _slotRevealed[gi][si]=true;
      const t=document.getElementById(`stdt-${gi}-${si}`);
      if(t) t.textContent=studentInputs[gi][si];
      const slot=document.getElementById(`std-${gi}-${si}`);
      if(slot){
        if(studentInputs[gi][si].trim()==='') slot.classList.add('is-empty');
        else slot.classList.remove('is-empty');
      }
    }
  });

  // Puan bilgisini göster
  const warn=document.getElementById('std-warning');
  if(warn){
    warn.style.color='#4ade80';
    warn.textContent=`⚖ Dağıtıldı — ${teamNames[0]||'Team A'}: ${scores[0]} puan · ${teamNames[1]||'Team B'}: ${scores[1]} puan`;
    warn.style.display='block';
    setTimeout(()=>{ if(warn.style.color==='rgb(74, 222, 128)') warn.style.display='none'; },3000);
  }
}

/* ── YOKLAMA ─────────────────────────────────────────────────
 * Bağımlılık: CLASSES (selectedClasses ile filtreli) veya STUDENTS array
 * absentStudents Set'i bu modülde tanımlı — overlay'ler arası kalıcıdır
 */
function openAttendance(){
  const body=document.getElementById('att-body');
  if(!body) return;
  body.innerHTML='';

  // Seçili sınıfları getir (selectedClasses Set'i oyun tarafında tanımlı olmalı)
  const classes=(typeof CLASSES!=='undefined' && typeof selectedClasses!=='undefined')
    ? CLASSES.filter(c=>selectedClasses.has(c.id))
    : [];

  if(!classes.length){
    // CLASSES/selectedClasses yoksa düz STUDENTS listesi
    const pool=(typeof STUDENTS!=='undefined')?STUDENTS:[];
    if(pool.length){
      const grid=document.createElement('div');
      grid.className='att-students';
      pool.forEach(s=>{
        const name=s.name??s;
        const btn=document.createElement('button');
        btn.className='att-student'+(absentStudents.has(name)?' absent':'');
        btn.textContent=name;
        btn.onclick=()=>{
          if(absentStudents.has(name)) absentStudents.delete(name);
          else absentStudents.add(name);
          btn.classList.toggle('absent');
          _updateAttBtn();
        };
        grid.appendChild(btn);
      });
      body.appendChild(grid);
    }
  } else {
    classes.forEach(cls=>{
      const validStudents=cls.students.filter(s=>s.name&&s.name.trim()!=='');
      if(!validStudents.length) return;
      const section=document.createElement('div');
      section.className='att-class-section';
      if(classes.length>1){
        const lbl=document.createElement('div');
        lbl.className='att-class-label';
        lbl.textContent=cls.label;
        section.appendChild(lbl);
      }
      const grid=document.createElement('div');
      grid.className='att-students';
      validStudents.forEach(s=>{
        const btn=document.createElement('button');
        btn.className='att-student'+(absentStudents.has(s.name)?' absent':'');
        btn.textContent=s.name;
        btn.onclick=()=>{
          if(absentStudents.has(s.name)) absentStudents.delete(s.name);
          else absentStudents.add(s.name);
          btn.classList.toggle('absent');
          _updateAttBtn();
        };
        grid.appendChild(btn);
      });
      section.appendChild(grid);
      body.appendChild(section);
    });
  }
  document.getElementById('attendance-overlay').classList.remove('hidden');
}

function closeAttendance(){
  document.getElementById('attendance-overlay').classList.add('hidden');
  _updateAttBtn();
}

function _updateAttBtn(){
  const btn=document.getElementById('att-btn');
  if(!btn) return;
  const n=absentStudents.size;
  btn.textContent=n>0?'📋 Yoklama ('+n+' devamsız)':'📋 Yoklama';
}
