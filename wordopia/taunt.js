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

  // ── DOĞRU KELİME (%30 ihtimalle) ────────────────────────────────
  // Tetikleyici: geçerli kelime girildi (kategori bonusu değil)
  // Oynayan saldırır → rakip cevap verir
  onScore: {
    attacks: [
      'Al sana!',
      'Ya Hak!!',
      'Bu iş böyle yapılır!',
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
      'Sakin ol mubarek.',
      // buraya ekle ↓
    ],
  },

  // ── KATEGORİ BONUSU (%100 her zaman) ────────────────────────────
  // Tetikleyici: kategori bonuslu kelime girildi
  // Oynayan saldırır → rakip şaşkın cevap verir
  onCategoryBonus: {
    attacks: [
      '',
      '',
      '',
      // buraya ekle ↓
    ],
    responses: [
      'Yok artık...',
      'Tesadüf bu, tesadüf!',
      'Oldu mu bu şimdi?',
      // buraya ekle ↓
    ],
  },

  // ── SON 10 SANİYE (%70 ihtimalle) ───────────────────────────────
  // Tetikleyici: sürede 10 saniye kaldı (turda 1 kere)
  // Rakip takım baskı yapar → oynayan cevap verir
  onLowTime: {
    attacks: [
      'Saate bak biraz!',
      'Yetişemeyecek!',
      'Allah kurtarsın kardeşim.'
      // buraya ekle ↓
    ],
    responses: [
      'Sus sen...',
      'Bekle görürsün.',
      'Sıkıntı yok, düşünüyorum.',
      'Hııı,çok biliyon'
      // buraya ekle ↓
    ],
  },

  // ── JOKER KULLANIMI (%100, kullanıldığı an) ──────────────────────
  // Tetikleyici: öğrenci joker kullandı (başlangıç tile açıldı)
  // Rakip takım kışkırtır → oynayan savunmaya geçer
  onJoker: {
    attacks: [
      'Noldu, bilemedin mi bro?',
      'Yardım lazım mı evladım?',
      // buraya ekle ↓
    ],
    responses: [
      'Hepiniz öyle başladınız!',
      'Taktik bu, taktik!',
      'Sus sen...',
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
      'Uğraşıyoruz işte...',
      'Karışma işime!',
      // buraya ekle ↓
    ],
  },

};
