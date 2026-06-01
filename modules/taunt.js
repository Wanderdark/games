// ============================================================
// TAUNT MODULE
// F:\MODULES\taunt.js
//
// Özellikler:
//   • Avatar üzerinde konuşma balonu (speech bubble)
//     → avatarın baş/boyun hizasına otomatik konumlanır
//     → 2sn görünür, fade-out ile kaybolur
//   • Taunt dialog: attackTeam saldırır, 2.5sn sonra rakip cevap verir
//   • pickTaunt: { attacks[], responses[] } nesnesinden bağımsız rastgele seçer
//   • tauntsUnlocked: student modda Team B ilk tura girene kadar sessiz
//
// Bağımlılıklar (oyun tarafında tanımlı olmalı):
//   let tauntsUnlocked = false;  // student mode için kilit
//   TAUNTS nesnesi → taunt_data.js dosyasından gelir
//   #game-avatar-a, #game-avatar-b → position:fixed avatar container'ları
//
// Kullanım:
//   // Oyun başında:
//   tauntsUnlocked = (AVATAR_MODE !== 'student');
//   // Team B ilk oyuncusu sahneye çıkınca:
//   tauntsUnlocked = true;
//
//   // Taunt tetikleyicileri (örnek):
//   const t = pickTaunt(TAUNTS.onScore);
//   if(t) showTauntDialog(currentTeam, t);          // oynayan saldırır
//
//   const t = pickTaunt(TAUNTS.onErrorStreak);
//   if(t) showTauntDialog(1 - currentTeam, t);      // rakip saldırır
//
// İçerik dosyası:
//   taunt_data.js → TAUNTS nesnesini tanımlar
//   Kategoriler: onScore, onCategoryBonus, onLowTime, onJoker, onErrorStreak
//   Her kategori: { attacks: [...], responses: [...] }
//
// Tetikleyici önerileri (ne zaman çağırılır):
//   onScore          → doğru kelime girildiğinde (%30 ihtimalle)
//   onCategoryBonus  → kategori bonusu kazanıldığında (%100)
//   onLowTime        → turda 10 saniye kaldığında (%70, turda 1 kere)
//   onJoker          → joker kullanıldığında (%100)
//   onErrorStreak    → ard arda 3+ yanlış girildiğinde (%100, 1 kere)

// ── HTML ──────────────────────────────────────────────────
// Ek HTML gerekmez — balonlar JS tarafından body'e dinamik eklenir.
// Sadece avatar container'larının sayfada mevcut olması yeterli:
//   <div id="game-avatar-a" class="game-avatar ...">...</div>
//   <div id="game-avatar-b" class="game-avatar ...">...</div>

// ── CSS ───────────────────────────────────────────────────
// Şunu <style> bloğuna kopyala:
//
// .avatar-speech-bubble{
//   position:fixed;z-index:6000;pointer-events:none;
//   background:rgba(10,4,0,0.72);
//   border:2px solid rgba(255,160,0,0.55);
//   border-radius:22px;padding:10px 18px;
//   font-family:'Barlow Condensed',sans-serif;font-weight:700;
//   font-size:clamp(17px,2.4vw,26px);letter-spacing:.06em;
//   color:#ffe4b5;white-space:nowrap;
//   opacity:1;transition:opacity .35s;
//   box-shadow:0 4px 18px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,200,80,.12);
//   backdrop-filter:blur(6px);
//   animation:bubblePop .3s cubic-bezier(.34,1.56,.64,1)
// }
// @keyframes bubblePop{
//   0%{transform:scale(0) rotate(-6deg);opacity:0}
//   100%{transform:scale(1) rotate(0deg);opacity:1}
// }
// /* Kuyruk — dış border */
// .avatar-speech-bubble::before{
//   content:'';position:absolute;bottom:-22px;border:11px solid transparent}
// /* Kuyruk — iç bg */
// .avatar-speech-bubble::after{
//   content:'';position:absolute;bottom:-14px;border:7px solid transparent}
// .avatar-speech-bubble.bubble-left::before {left:24px; border-top-color:rgba(255,160,0,0.55)}
// .avatar-speech-bubble.bubble-left::after  {left:28px; border-top-color:rgba(10,4,0,0.72)}
// .avatar-speech-bubble.bubble-right::before{right:24px;border-top-color:rgba(255,160,0,0.55)}
// .avatar-speech-bubble.bubble-right::after {right:28px;border-top-color:rgba(10,4,0,0.72)}

// ── JAVASCRIPT ────────────────────────────────────────────

/* Avatar üzerinde konuşma balonu göster
 * team  : 0 = Team A (sol), 1 = Team B (sağ)
 * text  : balon metni
 * Balon avatarın baş/boyun hizasına otomatik konumlanır,
 * 2 saniye sonra fade-out ile kaybolur.
 */
function showSpeechBubble(team, text){
  const avEl = document.getElementById('game-avatar-' + (team===0?'a':'b'));
  if(!avEl || avEl.classList.contains('hidden')) return;

  // Önceki balonları temizle
  document.querySelectorAll('.avatar-speech-bubble').forEach(el => el.remove());

  const er     = avEl.getBoundingClientRect();
  const isLeft = (team === 0);

  const bubble = document.createElement('div');
  bubble.className  = 'avatar-speech-bubble ' + (isLeft?'bubble-left':'bubble-right');
  bubble.textContent = text;
  document.body.appendChild(bubble);

  // Yatay konum
  if(isLeft){
    bubble.style.left  = Math.max(8, er.left + er.width * 0.18) + 'px';
  } else {
    bubble.style.right = Math.max(8, window.innerWidth - er.right + er.width * 0.18) + 'px';
  }

  // Dikey konum: avatarın üst %10'u = baş/boyun hizası
  const bh       = bubble.offsetHeight || 60;
  const shoulderY = er.top + er.height * 0.10;
  bubble.style.top = Math.max(8, shoulderY - bh - 8) + 'px';

  // 2sn görün, sonra fade-out
  setTimeout(()=>{
    bubble.style.opacity = '0';
    setTimeout(()=> bubble.remove(), 300);
  }, 2000);
}

/* { attacks:[...], responses:[...] } nesnesinden bağımsız rastgele seçer
 * Boş string ('') → o tarafın balonu çıkmaz (kasıtlı suskunluk)
 * Return: { attack, response } veya null
 */
function pickTaunt(obj){
  if(!obj || !obj.attacks || !obj.responses) return null;
  const attack   = obj.attacks  [Math.floor(Math.random() * obj.attacks.length)];
  const response = obj.responses[Math.floor(Math.random() * obj.responses.length)];
  return { attack, response };
}

/* Taunt dialogu başlat
 * attackTeam → bu takım attack söyler
 * 1-attackTeam → 2.5sn sonra response söyler
 * tauntsUnlocked=false ise sessiz kalır (student mode başlangıcı)
 */
function showTauntDialog(attackTeam, taunt){
  if(!taunt) return;
  if(typeof tauntsUnlocked !== 'undefined' && !tauntsUnlocked) return;
  if(taunt.attack)   showSpeechBubble(attackTeam,       taunt.attack);
  if(taunt.response) setTimeout(()=> showSpeechBubble(1 - attackTeam, taunt.response), 2500);
}
