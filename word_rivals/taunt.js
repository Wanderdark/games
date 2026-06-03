// ============================================================
// TAUNT.JS — Word Builder Konuşma Balonları
//
// Her bölümün attacks ve responses listeleri birbirinden
// BAĞIMSIZ rastgele seçilir. Yani herhangi bir attack,
// herhangi bir response ile eşleşebilir.
//
// Hangi takım "attacker" olduğu oyun kodundan belirlenir:
//   - onScore / onCategoryBonus → oynayan takım saldırır
//   - onLowTime / onErrorStreak → rakip takım saldırır
//
// Eklemek için ilgili listeye yeni string ekle.
// ============================================================

const TAUNTS = {

  // ── DOĞRU KELİME (%25 ihtimalle) ────────────────────────────────
  // Tetikleyici: geçerli kelime girildi (kategori bonusu değil)
  // Oynayan saldırır → rakip cevap verir
  onScore: {
    attacks: [
      'Al sana!',
      'Ya Hak!!',
      'Üzülme, büyüyünce geçer'
      // buraya ekle ↓
    ],
    responses: [
      'Hayırlısı be gülüm...',
      'İcat çıkarma!',
      'Yeni moda mı bu?',
      'Gençlik bitmiş resmen...',
      'Ayıp ya ayıp!',
      'Az ötede oyna evladım',
      'Bıktım.. Vallahi bıktım..',
      // buraya ekle ↓
    ],
  },

  // ── STREAK (%100 her zaman) ────────────────────────────
  // Tetikleyici: kategori bonuslu kelime girildi
  // Oynayan saldırır → rakip şaşkın cevap verir
  onCategoryBonus: {
    attacks: [
      'Noldu küçüğüm?',
      'Sıkıntı mı var?',
      'Bu iş böyle yapılır!',
      // buraya ekle ↓
    ],
    responses: [
      'Yok artık...',
      'Tesadüf bu, tesadüf!',
      'Oldu mu bu şimdi?',
      // buraya ekle ↓
    ],
  },

  // ── RAKİP 30 can kala (%70 ihtimalle) ───────────────────────────────
  // Tetikleyici: RAKİP 30 can kala
  // Rakip takım baskı yapar → oynayan cevap verir
  onLowTime: {
    attacks: [
      'İşin bitti!',
      'Pes et bence',
      'Allah kurtarsın kardeşim.'
      // buraya ekle ↓
    ],
    responses: [
      'Sus sen...',
      'Bekle görürsün.',
      'Come back yapıcam.',
      'Hııı,çok biliyon'
      // buraya ekle ↓
    ],
  },

  // ── ÜST ÜSTE HATA (%100, eşik aşılınca 1 kere) ─────────────────
  // Tetikleyici: ard arda 3+ yanlış (WRONG_THRESHOLD aşıldı)
  // Rakip alaya alır → oynayan savunmaya geçer
  onErrorStreak: {
    attacks: [
      'Böyle mi oynanır?',
      'Saçmalama',
      'Nabıyon abi sen?',
      'Bu neyin kafası ya?',
      // buraya ekle ↓
    ],
    responses: [
      'Denedik, olmuyor!',
      'Çalışıyoruz...',
      'Karışma işime!',
      // buraya ekle ↓
    ],
  },

};
