// words.js — Image Reveal Game
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

const WORDS = (typeof QUESTIONS !== 'undefined')
  ? QUESTIONS
      .filter(q => q[3] === 0 && q[6] && q[6].trim())   // only category entries with images
      .map(q => [q[0], q[1], q[2], q[4], q[5], q[6], q[7] || []])
      // [eng_def(0), tr_def(1), answer(2), grade_level(3), categoryId(4), imagePath(5), alts(6)]
  : [];
