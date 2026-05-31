// ============================================================
// NAMES.JS — Sınıf ve öğrenci listesi
//
// Her sınıf için:
//   id     : kod adı (boşluksuz, settings'te key olarak kullanılır)
//   label  : ekranda görünen isim  (örn. '7/A')
//   grade  : bu sınıfın kullandığı kelime seviyesi (words.js'teki grade ile eşleşir)
//   students: [{ name, level }]  →  level: 'S' | 'A' | 'B' | 'C' | 'D' | 'F'
//     S = Süper   A = İyi   B = Ortanın üstü
//     C = Orta    D = Ortanın altı   F = Zayıf
//   pairs: [ ['İSİM1','İSİM2'], ... ]
//     → Otomatik dağıtımda hep aynı grupta olması gereken çiftler.
//     → Her ikisi de devamsız değilse çift korunur.
//     → Boş bırakılabilir: pairs: []
//
// Yeni sınıf eklemek: CLASSES dizisine yeni bir obje ekle.
// Yeni öğrenci eklemek: ilgili sınıfın students dizisine ekle.
// Yeni çift eklemek: pairs dizisine ['İSİM1','İSİM2'] şeklinde ekle.
// ============================================================

const CLASSES = [
  {
    id: '7A',
    label: '7/A',
    grade: 7,
    // pairs: Aynı grupta kalması zorunlu çiftler (🔗 ile gösterilir)
    pairs: [
      ['E.C.', 'MİRAİ'],  // Bu satırdaki çiftler aynı gruba yazılır, deaktif etmek için başına // koy
    ],
    students: [
      { name: 'E.C.',      level: 'S' },
      { name: 'YAHYA',     level: 'S' },
      { name: 'ELF',       level: 'A' },
      { name: 'MİRAİ',     level: 'A' },
      { name: 'FISTIK',    level: 'B' },
      { name: 'EMİR',      level: 'D' },
      { name: 'ŞEYMA',     level: 'D' },
      { name: 'NYSA',      level: 'D' },
      { name: 'SUDE',      level: 'C' },
      { name: 'MEMİN',     level: 'F' },
      { name: 'KEREMICA',  level: 'B' },
      { name: 'GULŞEN',    level: 'D' },
      { name: 'DİLA',      level: 'C' },
      { name: 'KEMAN',     level: 'D' },
      { name: 'SERCANT',   level: 'D' },
      { name: 'OHAN',      level: 'C' },
      { name: 'ATAKAN',    level: 'F' },
    ],
  },
  {
    id: '6B',
    label: '6/B',
    grade: 6,
    pairs: [
      // ['ZEYNO', 'EWYN'],  // Bu satırdaki çiftler aynı gruba yazılır, aktif etmek için baştaki // kaldır
    ],
    students: [
      { name: 'ZEYNO',     level: 'S' },
      { name: 'EWYN',      level: 'S' },
      { name: 'EBAR',      level: 'A' },
      { name: 'AYŞE',      level: 'B' },
      { name: 'KUZEY',     level: 'C' },
      { name: 'YİĞİT',     level: 'C' },
      { name: 'CASNU',     level: 'C' },
      { name: 'ÇINAR',     level: 'C' },
      { name: 'AKIN',      level: 'D' },
      { name: 'AHMET',     level: 'D' },
      { name: 'HÜSEYİN',   level: 'D' },
      { name: 'TOPRAK',    level: 'D' },
      { name: 'CEMRESU',   level: 'F' },
      { name: 'DUA',       level: 'F' },
      { name: 'HASAN',     level: 'F' },
      { name: 'RAMAZAN',   level: 'F' },
      { name: 'MEGE',      level: 'F' },
    ],
  },
  {
    id: '8B',
    label: '8/B',
    grade: 8,
    pairs: [
      // ['DEFNE', 'İPEK'],  //  Bu satırdaki çiftler aynı gruba yazılır, aktif etmek için baştaki // kaldır
    ],
    students: [
      { name: 'DEFNE',     level: 'S' },
      { name: 'İPEK',      level: 'A' },
      { name: 'PERİ',      level: 'B' },
      { name: 'SENA',      level: 'B' },
      { name: 'BERAT',     level: 'D' },
      { name: 'YİĞİT',     level: 'C' },
      { name: 'EDA',  	   level: 'D' },
      { name: 'SEVGİ',     level: 'C' },
      { name: 'FATMA',     level: 'F' },
      { name: 'FURKAN',    level: 'B' },
      { name: 'İBO',   	   level: 'A' },
      { name: 'KÜBRA',     level: 'F' },
      { name: 'TALHA',     level: 'F' },
      { name: 'UĞURCANT',  level: 'F' },
      { name: 'YUNUS',     level: 'C' },
      { name: 'DORUK',     level: 'D' },
      { name: 'EFE Z',     level: 'F' },
      { name: 'EFE B',     level: 'F' },
    ],
  },
];

// Geriye dönük uyumluluk — eski STUDENTS / RANDOM_NAMES kullanan yerler için
const STUDENTS    = CLASSES.flatMap(c => c.students);
const RANDOM_NAMES = STUDENTS.map(s => s.name);
