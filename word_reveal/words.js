// words.js — Image Reveal Game — ADAPTOR DOSYASI
// ════════════════════════════════════════════════════════════════════════════
//
// Yeni kategori eklemek için 3 adım:
//   1. CATEGORY_NAMES → catId: 'emoji Ad'
//   2. CATEGORY_THUMBS → catId: 'dosyaadi.webp'   (thumbnail yoksa null yaz)
//   3. questions.js'e kelimeleri q[5]=catId olarak ekle
//
// ════════════════════════════════════════════════════════════════════════════
// Format: [eng_def, tr_def, answer, grade_level, categoryId, imagePath, alts]
// Filters ONLY category entries from questions.js (q[3] === 0)
//
// grade_level (index 3):
//   1 = Grade 6-level words  → included when selectedGrade >= 6
//   2 = Grade 7-level words  → included when selectedGrade >= 7
//   3 = Grade 8-level words  → included when selectedGrade >= 8
//
// categoryId (index 4): 11=Animals, 12=Food&Drinks, 13=Appearance&Personality,
//                        14=Sports&Activities, 15=Places in Town, ... (extensible)
//
// alts (index 6): array of alternative acceptable answers from q[7] in questions.js
//                 e.g. ["ORANGE JUICE","APPLE JUICE"] — all treated as correct in isAcceptable()

// ── ADIM 1 — Kategori adları ─────────────────────────────────────────────
const CATEGORY_NAMES = {
  11: '🐾 Animals',
  12: '🍔 Food & Drinks',
  13: '👤 Appearance & Personality',
  14: '⚽ Sports & Equipment',
  15: '🏙️ Places in Town',
  16: '💼 Occupations',
};

// ── ADIM 2 — Kategori thumbnail görselleri ───────────────────────────────
// Görseller: word_reveal/thumbnails/ klasöründe
// Mevcut dosyalar: actions · adjectives · animals · beverages · bodyparts
//   clothing · colours · countries · dailyroutine · fruit · furniture
//   games · illnesses · jobs · lessons · movietypes · nationalities
//   parties · places · school · time · vehicles   (hepsi .webp)
const CATEGORY_THUMBS = {
  11: 'animals.webp',       // Animals
  12: 'foodanddrinks.webp', // Food & Drinks
  13: 'appandpers.webp',    // Appearance & Personality — eşleşen thumbnail yok
  14: 'sportsequip.webp',   // Sports & Equipment
  15: 'places.webp',        // Places in Town
  16: 'jobs.webp',          // Occupations
};

const WORDS = (typeof QUESTIONS !== 'undefined')
  ? QUESTIONS
      .filter(q => q[3] === 0 && q[6] && q[6].trim())   // only category entries with images
      .map(q => [q[0], q[1], q[2], q[4], q[5], q[6], q[7] || []])
      // [eng_def(0), tr_def(1), answer(2), grade_level(3), categoryId(4), imagePath(5), alts(6)]
  : [];
