/* ─────────────────────────────────────────────────────────────────
   WORDOPIA — KELIME BANKASI
   Format: { en, tr, unit, grade, img }
   unit  : 11=Irregular Verbs, 12=Animals, 13=Food&Drinks,
           14=Appearance&Personality, 15=Sports&Equipment, 16=Places in Town,
           17=Occupations
   grade : sınıf seviyesi — [6,7,8] veya alt küme
   img   : hard modda gösterilecek görsel yolu (boşsa Türkçe ipucu gösterilir)
───────────────────────────────────────────────────────────────── */
const WORD_BANK = {
  easy: [

    // ── KATEGORİ 11: IRREGULAR VERBS ────────────────────
    { en: 'DRANK',  tr: 'DRINK',  unit: 11, grade: [6,7,8] },
    { en: 'GOT',    tr: 'GET',    unit: 11, grade: [6,7,8] },
    { en: 'SWAM',   tr: 'SWIM',   unit: 11, grade: [6,7,8] },
    { en: 'READ',   tr: 'READ',   unit: 11, grade: [6,7,8] },
    { en: 'MADE',   tr: 'MAKE',   unit: 11, grade: [6,7,8] },
    { en: 'WENT',   tr: 'GO',     unit: 11, grade: [6,7,8] },

    // ── KATEGORİ 12: ANIMALS ────────────────────
    { en: 'BEE',      tr: 'ARI',          unit: 12, grade: [6,7,8], img: '../images/0/11/45.webp' },
    { en: 'ANT',      tr: 'KARINCA',      unit: 12, grade: [6,7,8], img: '../images/0/11/48.webp' },
    { en: 'COW',      tr: 'İNEK',         unit: 12, grade: [6,7,8], img: '../images/0/11/35.webp' },
    { en: 'PIG',      tr: 'DOMUZ',        unit: 12, grade: [6,7,8], img: '../images/0/11/37.webp' },
    { en: 'FISH',     tr: 'BALIK',        unit: 12, grade: [6,7,8], img: '../images/0/11/9.webp'  },
    { en: 'DUCK',     tr: 'ÖRDEK',        unit: 12, grade: [6,7,8], img: '../images/0/11/39.webp' },
    { en: 'FROG',     tr: 'KURBAĞA',      unit: 12, grade: [6,7,8], img: '../images/0/11/49.webp' },
    { en: 'RABBIT',   tr: 'TAVŞAN',       unit: 12, grade: [6,7,8], img: '../images/0/11/31.webp' },
    { en: 'MONKEY',   tr: 'MAYMUN',       unit: 12, grade: [6,7,8], img: '../images/0/11/28.webp' },
    { en: 'PARROT',   tr: 'PAPAĞAN',      unit: 12, grade: [6,7,8], img: '../images/0/11/6.webp'  },
    { en: 'TURTLE',   tr: 'KAPLUMBAĞA',   unit: 12, grade: [6,7,8], img: '../images/0/11/8.webp'  },
    { en: 'DOLPHIN',  tr: 'YUNUS',        unit: 12, grade: [6,7,8], img: '../images/0/11/11.webp' },
    { en: 'CHICKEN',  tr: 'TAVUK',        unit: 12, grade: [6,7,8], img: '../images/0/11/38.webp' },
    { en: 'HORSE',    tr: 'AT',           unit: 12, grade: [6,7,8], img: '../images/0/11/36.webp' },
    { en: 'DONKEY',   tr: 'EŞEK',         unit: 12, grade: [6,7,8], img: '../images/0/11/29.webp' },
    { en: 'KANGAROO', tr: 'KANGURU',      unit: 12, grade: [6,7,8], img: '../images/0/11/19.webp' },
    { en: 'ELEPHANT', tr: 'FİL',          unit: 12, grade: [6,7,8], img: '../images/0/11/2.webp'  },

    // ── KATEGORİ 13: FOOD & DRINKS ──────────────
    { en: 'EGG',    tr: 'YUMURTA',  unit: 13, grade: [6,7,8], img: '../images/0/12/5.webp'  },
    { en: 'TEA',    tr: 'ÇAY',      unit: 13, grade: [6,7,8], img: '../images/0/12/13.webp' },
    { en: 'JAM',    tr: 'REÇEL',    unit: 13, grade: [6,7,8], img: '../images/0/12/7.webp'  },
    { en: 'SALT',   tr: 'TUZ',      unit: 13, grade: [6,7,8], img: '../images/0/12/30.webp' },
    { en: 'MILK',   tr: 'SÜT',      unit: 13, grade: [6,7,8], img: '../images/0/12/15.webp' },
    { en: 'CAKE',   tr: 'KEK',      unit: 13, grade: [6,7,8], img: '../images/0/12/45.webp' },
    { en: 'BAGEL',  tr: 'SİMİT',    unit: 13, grade: [6,7,8], img: '../images/0/12/1.webp'  },
    { en: 'APPLE',  tr: 'ELMA',     unit: 13, grade: [6,7,8], img: '../images/0/12/36.webp' },
    { en: 'HONEY',  tr: 'BAL',      unit: 13, grade: [6,7,8], img: '../images/0/12/21.webp' },
    { en: 'TOMATO', tr: 'DOMATES',  unit: 13, grade: [6,7,8], img: '../images/0/12/16.webp' },
    { en: 'POTATO', tr: 'PATATES',  unit: 13, grade: [6,7,8], img: '../images/0/12/17.webp' },
    { en: 'BANANA', tr: 'MUZ',      unit: 13, grade: [6,7,8], img: '../images/0/12/37.webp' },
    { en: 'MUFFIN', tr: 'MAFFİN',   unit: 13, grade: [6,7,8], img: '../images/0/12/9.webp'  },

    // ── KATEGORİ 14: APPEARANCE & PERSONALITY ───
    { en: 'BALD',  tr: 'KEL',            unit: 14, grade: [7,8],   img: '../images/7/1/30.webp' },
    { en: 'SLIM',  tr: 'İNCE',           unit: 14, grade: [6,7,8], img: '../images/7/1/11.webp' },
    { en: 'TALL',  tr: 'UZUN BOYLU',     unit: 14, grade: [6,7,8], img: '../images/7/1/20.webp' },
    { en: 'UGLY',  tr: 'ÇİRKİN',        unit: 14, grade: [6,7,8], img: '../images/7/1/42.webp' },
    { en: 'COOL',  tr: 'HAVALI',         unit: 14, grade: [7,8],   img: '../images/8/1/3.webp'  },
    { en: 'MEAN',  tr: 'KABA / CİMRİ',  unit: 14, grade: [7,8],   img: '../images/8/1/38.webp' },

    // ── KATEGORİ 15: SPORTS & EQUIPMENT ─────────
    { en: 'HIKING',  tr: 'DOĞA YÜRÜYÜŞÜ', unit: 15, grade: [6,7,8], img: '../images/6/7/9.webp' },
    { en: 'CAMPING', tr: 'KAMP',           unit: 15, grade: [6,7,8], img: '../images/6/7/4.webp' },

    // ── KATEGORİ 16: PLACES IN TOWN ─────────────
    { en: 'ZOO',      tr: 'HAYVANAT BAHÇESİ', unit: 16, grade: [6,7,8], img: '../images/7/8/21.webp' },
    { en: 'POOL',     tr: 'YÜZME HAVUZU',     unit: 16, grade: [6,7,8], img: '../images/7/2/15.webp' },
    { en: 'HOSPITAL', tr: 'HASTANE',           unit: 16, grade: [6,7,8], img: '../images/7/8/15.webp' },
    { en: 'LIBRARY',  tr: 'KÜTÜPHANE',         unit: 16, grade: [6,7,8], img: '../images/7/8/18.webp' },
    { en: 'MUSEUM',   tr: 'MÜZE',              unit: 16, grade: [6,7,8], img: '../images/8/7/14.webp' },
    { en: 'DENTIST',  tr: 'DİŞÇİ',            unit: 16, grade: [6,7,8], img: '../images/7/8/26.webp' },

    // ── KATEGORİ 17: OCCUPATIONS ─────────────────
 
    { en: 'VET',          tr: 'VETERİNER',        unit: 17, grade: [6,7,8], img: '../images/6/6/25.webp' },
    { en: 'COOK',         tr: 'AŞÇİ',             unit: 17, grade: [6,7,8], img: '../images/6/6/4.webp'  },
    { en: 'CHEF',         tr: 'ŞEF',              unit: 17, grade: [6,7,8], img: '../images/6/6/4.webp'  },
    { en: 'BAKER',        tr: 'FIRINICI',          unit: 17, grade: [6,7,8], img: '../images/6/6/3.webp'  },
    { en: 'NURSE',        tr: 'HEMŞİRE',          unit: 17, grade: [6,7,8], img: '../images/6/6/24.webp' },
    { en: 'DRIVER',       tr: 'ŞOFÖR',            unit: 17, grade: [6,7,8], img: '../images/6/6/10.webp' },
    { en: 'FARMER',       tr: 'ÇİFTÇİ',           unit: 17, grade: [6,7,8], img: '../images/6/6/16.webp' },
    { en: 'DOCTOR',       tr: 'DOKTOR',            unit: 17, grade: [6,7,8], img: '../images/6/6/28.webp' },
    { en: 'TEACHER',      tr: 'ÖĞRETMEN',          unit: 17, grade: [6,7,8], img: '../images/6/6/27.webp' },
    { en: 'DENTIST',      tr: 'DİŞ HEKİMİ',       unit: 17, grade: [6,7,8], img: '../images/6/6/7.webp'  },


  ],
  medium: [

    // ── KATEGORİ 11: IRREGULAR VERBS ────────────────────
    { en: 'HAD',    tr: 'HAVE',  unit: 11, grade: [6,7,8] },
    { en: 'LOST',   tr: 'LOSE',  unit: 11, grade: [6,7,8] },
    { en: 'DID',    tr: 'DO',    unit: 11, grade: [6,7,8] },
    { en: 'TOOK',   tr: 'TAKE',  unit: 11, grade: [6,7,8] },
    { en: 'BOUGHT', tr: 'BUY',   unit: 11, grade: [6,7,8] },
    { en: 'SAW',    tr: 'SEE',   unit: 11, grade: [6,7,8] },
    { en: 'ATE',    tr: 'EAT',   unit: 11, grade: [6,7,8] },
    { en: 'WROTE',  tr: 'WRITE', unit: 11, grade: [6,7,8] },
    { en: 'RODE',   tr: 'RIDE',  unit: 11, grade: [6,7,8] },

    // ── KATEGORİ 12: ANIMALS ────────────────────
    { en: 'GOAT',    tr: 'KEÇİ',         unit: 12, grade: [6,7,8], img: '../images/0/11/33.webp' },
    { en: 'DEER',    tr: 'GEYİK',        unit: 12, grade: [6,7,8], img: '../images/0/11/30.webp' },
    { en: 'EAGLE',   tr: 'KARTAL',       unit: 12, grade: [7,8],   img: '../images/0/11/1.webp'  },
    { en: 'SNAKE',   tr: 'YILAN',        unit: 12, grade: [6,7,8], img: '../images/0/11/3.webp'  },
    { en: 'CAMEL',   tr: 'DEVE',         unit: 12, grade: [6,7,8], img: '../images/0/11/32.webp' },
    { en: 'TIGER',   tr: 'KAPLAN',       unit: 12, grade: [6,7,8], img: '../images/0/11/10.webp' },
    { en: 'WHALE',   tr: 'BALİNA',       unit: 12, grade: [6,7,8], img: '../images/0/11/13.webp' },
    { en: 'SHARK',   tr: 'KÖPEK BALIĞI', unit: 12, grade: [6,7,8], img: '../images/0/11/12.webp' },
    { en: 'LION',    tr: 'ASLAN',        unit: 12, grade: [6,7,8], img: '../images/0/11/7.webp'  },
    { en: 'FOX',     tr: 'TİLKİ',       unit: 12, grade: [6,7,8], img: '../images/0/11/27.webp' },
    { en: 'BEAR',    tr: 'AYI',          unit: 12, grade: [6,7,8], img: '../images/0/11/25.webp' },
    { en: 'WOLF',    tr: 'KURT',         unit: 12, grade: [6,7,8], img: '../images/0/11/26.webp' },
    { en: 'SPIDER',  tr: 'ÖRÜMCEK',      unit: 12, grade: [6,7,8], img: '../images/0/11/47.webp' },
    { en: 'CHEETAH', tr: 'ÇITA',         unit: 12, grade: [7,8],   img: '../images/0/11/17.webp' },
    { en: 'GIRAFFE', tr: 'ZÜRAFA',       unit: 12, grade: [6,7,8], img: '../images/0/11/5.webp'  },

    // ── KATEGORİ 13: FOOD & DRINKS ──────────────
    { en: 'BREAD',     tr: 'EKMEK',           unit: 13, grade: [6,7,8], img: '../images/0/12/22.webp' },
    { en: 'WATER',     tr: 'SU',              unit: 13, grade: [6,7,8], img: '../images/0/12/44.webp' },
    { en: 'PASTA',     tr: 'MAKARNA',         unit: 13, grade: [6,7,8], img: '../images/0/12/43.webp' },
    { en: 'BEANS',     tr: 'FASULYE',         unit: 13, grade: [6,7,8], img: '../images/0/12/24.webp' },
    { en: 'ONION',     tr: 'SOĞAN',           unit: 13, grade: [6,7,8], img: '../images/0/12/26.webp' },
    { en: 'SUGAR',     tr: 'ŞEKER',           unit: 13, grade: [6,7,8], img: '../images/0/12/29.webp' },
    { en: 'BUTTER',    tr: 'TEREYAĞI',        unit: 13, grade: [6,7,8], img: '../images/0/12/2.webp'  },
    { en: 'CEREAL',    tr: 'TAHIL GEVREĞİ',  unit: 13, grade: [6,7,8], img: '../images/0/12/3.webp'  },
    { en: 'COFFEE',    tr: 'KAHVE',           unit: 13, grade: [6,7,8], img: '../images/0/12/14.webp' },
    { en: 'CHEESE',    tr: 'PEYNİR',          unit: 13, grade: [6,7,8], img: '../images/0/12/18.webp' },
    { en: 'GARLIC',    tr: 'SARIMSAK',        unit: 13, grade: [6,7,8], img: '../images/0/12/23.webp' },
    { en: 'ORANGE',    tr: 'PORTAKAL',        unit: 13, grade: [6,7,8], img: '../images/0/12/38.webp' },
    { en: 'CARROT',    tr: 'HAVUÇ',           unit: 13, grade: [6,7,8], img: '../images/0/12/40.webp' },
    { en: 'COOKIE',    tr: 'KURABİYE',        unit: 13, grade: [6,7,8], img: '../images/0/12/46.webp' },
    { en: 'FRUITS',    tr: 'MEYVELER',        unit: 13, grade: [6,7,8], img: '../images/0/12/27.webp' },
    { en: 'OLIVE',     tr: 'ZEYTİN',          unit: 13, grade: [6,7,8], img: '../images/0/12/28.webp' },
    { en: 'SAUSAGE',   tr: 'SOSIS',           unit: 13, grade: [6,7,8], img: '../images/0/12/11.webp' },
    { en: 'OMELETTE',  tr: 'OMLET',           unit: 13, grade: [6,7,8], img: '../images/0/12/8.webp'  },
    { en: 'CHOCOLATE', tr: 'ÇİKOLATA',        unit: 13, grade: [6,7,8], img: '../images/0/12/47.webp' },

    // ── KATEGORİ 14: APPEARANCE & PERSONALITY ───
    { en: 'BLOND',    tr: 'SARIŞIN',          unit: 14, grade: [7,8],   img: '../images/7/1/25.webp' },
    { en: 'BEARD',    tr: 'SAKAL',            unit: 14, grade: [7,8],   img: '../images/7/1/37.webp' },
    { en: 'CURLY',    tr: 'KIVIRCIK',         unit: 14, grade: [7,8],   img: '../images/7/1/26.webp' },
    { en: 'STINGY',   tr: 'CİMRİ',           unit: 14, grade: [7,8],   img: '../images/7/1/32.webp' },
    { en: 'CLEVER',   tr: 'ZEKİ',             unit: 14, grade: [7,8],   img: '../images/7/1/17.webp' },
    { en: 'HONEST',   tr: 'DÜRÜST',           unit: 14, grade: [7,8],   img: '../images/7/1/6.webp'  },
    { en: 'SNEAKY',   tr: 'SİNSİ',            unit: 14, grade: [8],     img: '../images/8/1/44.webp' },
    { en: 'RELAXED',  tr: 'RAHAT',            unit: 14, grade: [8],     img: '../images/8/1/10.webp' },
    { en: 'SERIOUS',  tr: 'CİDDİ',            unit: 14, grade: [7,8],   img: '../images/8/2/9.webp'  },
    { en: 'STYLISH',  tr: 'ŞIK',              unit: 14, grade: [8],     img: '../images/8/2/19.webp' },
    { en: 'BEAUTIFUL',tr: 'GÜZEL',            unit: 14, grade: [6,7,8], img: '../images/7/1/38.webp' },
    { en: 'SELFISH',  tr: 'BENCİL',           unit: 14, grade: [7,8],   img: '../images/7/1/10.webp' },
    { en: 'CHEERFUL', tr: 'NEŞELİ',           unit: 14, grade: [7,8],   img: '../images/7/1/23.webp' },
    { en: 'FRIENDLY', tr: 'ARKADAŞ CANLISI',  unit: 14, grade: [7,8],   img: '../images/7/1/22.webp' },
    { en: 'GENEROUS', tr: 'CÖMERT',           unit: 14, grade: [7,8],   img: '../images/7/1/5.webp'  },
    { en: 'HANDSOME', tr: 'YAKIŞIKLI',         unit: 14, grade: [7,8],   img: '../images/7/1/40.webp' },
    { en: 'OUTGOING', tr: 'CANA YAKIN',        unit: 14, grade: [7,8],   img: '../images/7/1/7.webp'  },
    { en: 'SOCIABLE', tr: 'SOSYAL',            unit: 14, grade: [7,8],   img: '../images/7/1/34.webp' },
    { en: 'PUNCTUAL', tr: 'DAKİK',             unit: 14, grade: [7,8],   img: '../images/7/1/9.webp'  },
    { en: 'LAID BACK',tr: 'RAHAT / UYUMLU',    unit: 14, grade: [8],     img: '../images/8/1/10.webp' },
    { en: 'GLASSES',  tr: 'GÖZLÜK',            unit: 14, grade: [6,7,8], img: '../images/7/1/39.webp' },

    // ── KATEGORİ 15: SPORTS & EQUIPMENT ─────────
    { en: 'GLOVES',   tr: 'ELDİVEN',          unit: 15, grade: [7,8],   img: '../images/7/2/18.webp'  },
    { en: 'SKIING',   tr: 'KAYAK',             unit: 15, grade: [6,7,8], img: '../images/6/7/2.webp'   },
    { en: 'SADDLE',   tr: 'EYER',              unit: 15, grade: [7,8],   img: '../images/7/2/35.webp'  },
    { en: 'CAVING',   tr: 'MAĞARA SPORU',      unit: 15, grade: [8],     img: '../images/8/6/12.webp'  },
    { en: 'HELMET',   tr: 'KASK',              unit: 15, grade: [6,7,8], img: '../images/7/2/24.webp'  },
    { en: 'JOGGING',  tr: 'KOŞU',              unit: 15, grade: [7,8],   img: '../images/7/2/30.webp'  },
    { en: 'TREKKING', tr: 'DOĞA YÜRÜYÜŞÜ',    unit: 15, grade: [6,7,8], img: '../images/8/6/10.webp'  },
    { en: 'RAFTING',  tr: 'RAFTING',            unit: 15, grade: [6,7,8], img: '../images/6/7/5.webp'   },
    { en: 'SKATING',  tr: 'PATEN KAYMA',        unit: 15, grade: [6,7,8], img: '../images/7/2/31.webp'  },
    { en: 'REFEREE',  tr: 'HAKEM',              unit: 15, grade: [7,8],   img: '../images/7/2/29.webp'  },
    { en: 'GOGGLES',  tr: 'YÜZME GÖZLÜĞÜ',    unit: 15, grade: [7,8],   img: '../images/7/2/16.webp'  },
    { en: 'CANOEING', tr: 'KANO',              unit: 15, grade: [8],     img: '../images/8/6/4.webp'   },
    { en: 'KAYAKING', tr: 'KANO / KAYAK',       unit: 15, grade: [8],     img: '../images/8/6/17.webp'  },

    // ── KATEGORİ 16: PLACES IN TOWN ─────────────
    { en: 'TOWER',    tr: 'KULE',              unit: 16, grade: [8],     img: '../images/8/7/8.webp'  },
    { en: 'MOSQUE',   tr: 'CAMİ',              unit: 16, grade: [6,7,8], img: '../images/8/7/15.webp' },
    { en: 'CASTLE',   tr: 'KALE',              unit: 16, grade: [8],     img: '../images/8/7/16.webp' },
    { en: 'BRIDGE',   tr: 'KÖPRÜ',             unit: 16, grade: [6,7,8], img: '../images/8/7/19.webp' },
    { en: 'BAKERY',   tr: 'FIRINCI',            unit: 16, grade: [6,7,8], img: '../images/7/8/20.webp' },
    { en: 'GROCER',   tr: 'BAKKAL',             unit: 16, grade: [6,7,8], img: '../images/7/8/25.webp' },
    { en: 'FLORIST',  tr: 'ÇİÇEKÇİ',           unit: 16, grade: [6,7,8], img: '../images/7/8/24.webp' },
    { en: 'BUTCHER',  tr: 'KASAP',              unit: 16, grade: [6,7,8], img: '../images/7/8/27.webp' },
    { en: 'TOYSHOP',  tr: 'OYUNCAKÇI',          unit: 16, grade: [6,7,8], img: '../images/7/8/4.webp'  },
    { en: 'BOOKSHOP', tr: 'KİTAPÇI',            unit: 16, grade: [6,7,8], img: '../images/7/8/19.webp' },
    { en: 'PHARMACY', tr: 'ECZANE',             unit: 16, grade: [6,7,8], img: '../images/7/8/23.webp' },

  // ── KATEGORİ 17: OCCUPATIONS ─────────────────

    { en: 'WORKER',       tr: 'İŞÇİ',             unit: 17, grade: [6,7,8], img: '../images/6/6/17.webp' },
    { en: 'BUTCHER',      tr: 'KASAP',             unit: 17, grade: [6,7,8], img: '../images/6/6/18.webp' },
    { en: 'SINGER',       tr: 'ŞARKICI',           unit: 17, grade: [6,7,8], img: '../images/6/6/23.webp' },
    { en: 'MANAGER',      tr: 'YÖNETİCİ',          unit: 17, grade: [6,7,8], img: '../images/6/6/5.webp'  },
    { en: 'WAITRESS',     tr: 'GARSON',            unit: 17, grade: [6,7,8], img: '../images/6/6/14.webp' },
    { en: 'ACTRESS',      tr: 'AKTRİS',            unit: 17, grade: [6,7,8], img: '../images/6/6/20.webp' },
    { en: 'LAWYER',       tr: 'AVUKAT',            unit: 17, grade: [6,7,8], img: '../images/6/6/22.webp' },
    { en: 'ENGINEER',     tr: 'MÜHENDİS',          unit: 17, grade: [6,7,8], img: '../images/6/6/13.webp' },
    { en: 'HOUSEWIFE',    tr: 'EV HANIMI',          unit: 17, grade: [6,7,8], img: '../images/6/6/9.webp'  }


  ],
  hard: [

    // ── KATEGORİ 11: IRREGULAR VERBS ────────────────────
    { en: 'CAME',    tr: 'COME',  unit: 11, grade: [6,7,8] },
    { en: 'TOLD',    tr: 'TELL',  unit: 11, grade: [6,7,8] },
    { en: 'SOLD',    tr: 'SELL',  unit: 11, grade: [6,7,8] },
    { en: 'DREW',    tr: 'DRAW',  unit: 11, grade: [6,7,8] },
    { en: 'SAID',    tr: 'SAY',   unit: 11, grade: [6,7,8] },
    { en: 'SPOKE',   tr: 'SPEAK', unit: 11, grade: [6,7,8] },
    { en: 'WOKE',    tr: 'WAKE',  unit: 11, grade: [6,7,8] },
    { en: 'FELT',    tr: 'FEEL',  unit: 11, grade: [6,7,8] },
    { en: 'SAT',     tr: 'SIT',   unit: 11, grade: [6,7,8] },
    { en: 'BROUGHT', tr: 'BRING', unit: 11, grade: [6,7,8] },
    { en: 'WON',     tr: 'WIN',   unit: 11, grade: [6,7,8] },
    { en: 'FLEW',    tr: 'FLY',   unit: 11, grade: [6,7,8] },
    { en: 'GAVE',    tr: 'GIVE',  unit: 11, grade: [6,7,8] },
    { en: 'BROKE',   tr: 'BREAK', unit: 11, grade: [6,7,8] },
    { en: 'CAUGHT',  tr: 'CATCH', unit: 11, grade: [6,7,8] },
    { en: 'FED',     tr: 'FEED',  unit: 11, grade: [6,7,8] },
    { en: 'LEFT',    tr: 'LEAVE', unit: 11, grade: [6,7,8] },
    { en: 'DROVE',   tr: 'DRIVE', unit: 11, grade: [6,7,8] },
    { en: 'RAN',     tr: 'RUN',   unit: 11, grade: [6,7,8] },
    { en: 'FELL',    tr: 'FALL',  unit: 11, grade: [6,7,8] },
    { en: 'SLEPT',   tr: 'SLEEP', unit: 11, grade: [6,7,8] },

    // ── KATEGORİ 12: ANIMALS ────────────────────
    { en: 'OSTRICH',   tr: 'DEVEKUŞU',         unit: 12, grade: [7,8],   img: '../images/0/11/22.webp' },
    { en: 'CROCODILE', tr: 'TİMSAH',           unit: 12, grade: [6,7,8], img: '../images/0/11/18.webp' },
    { en: 'BUTTERFLY', tr: 'KELEBEK',           unit: 12, grade: [6,7,8], img: '../images/0/11/46.webp' },
    { en: 'ALLIGATOR', tr: 'TİMSAH',           unit: 12, grade: [7,8],   img: '../images/0/11/15.webp' },
    { en: 'HAWK',      tr: 'ŞAHIN',            unit: 12, grade: [7,8],   img: '../images/0/11/14.webp' },
    { en: 'SEAL',      tr: 'FOK',              unit: 12, grade: [7,8],   img: '../images/0/11/41.webp' },
    { en: 'CRAB',      tr: 'YENGEÇ',           unit: 12, grade: [7,8],   img: '../images/0/11/43.webp' },
    { en: 'SWAN',      tr: 'KUĞU',             unit: 12, grade: [7,8],   img: '../images/0/11/40.webp' },
    { en: 'HIPPO',     tr: 'SU AYGIRI',         unit: 12, grade: [6,7,8], img: '../images/0/11/21.webp' },
    { en: 'RHINO',     tr: 'GERGEDAN',          unit: 12, grade: [6,7,8], img: '../images/0/11/23.webp' },
    { en: 'LIZARD',    tr: 'KERTENKELE',        unit: 12, grade: [7,8],   img: '../images/0/11/20.webp' },
    { en: 'FALCON',    tr: 'DOĞAN',             unit: 12, grade: [7,8],   img: '../images/0/11/16.webp' },
    { en: 'OCTOPUS',   tr: 'AHTAPOT',           unit: 12, grade: [7,8],   img: '../images/0/11/42.webp' },

    // ── KATEGORİ 13: FOOD & DRINKS ──────────────
    { en: 'RICE',      tr: 'PİRİNÇ',  unit: 13, grade: [6,7,8], img: '../images/0/12/42.webp' },
    { en: 'CORN',      tr: 'MISIR',   unit: 13, grade: [6,7,8], img: '../images/0/12/41.webp' },
    { en: 'OAT',       tr: 'YULAF',   unit: 13, grade: [6,7,8], img: '../images/0/12/35.webp' },
    { en: 'CROISSANT', tr: 'KROİSAN', unit: 13, grade: [6,7,8], img: '../images/0/12/4.webp'  },

    // ── KATEGORİ 14: APPEARANCE & PERSONALITY ───
    { en: 'MOUSTACHE',  tr: 'BIYIK',       unit: 14, grade: [7,8],   img: '../images/7/1/33.webp' },
    { en: 'EASYGOING',  tr: 'UYUMLU',      unit: 14, grade: [7,8],   img: '../images/7/1/3.webp'  },
    { en: 'FORGETFUL',  tr: 'UNUTKAN',     unit: 14, grade: [7,8],   img: '../images/7/1/4.webp'  },
    { en: 'STUMPY',     tr: 'BODUR',       unit: 14, grade: [7,8],   img: '../images/7/1/31.webp' },
    { en: 'PLUMP',      tr: 'TOMBUL',      unit: 14, grade: [7,8],   img: '../images/7/1/18.webp' },
    { en: 'CARING',     tr: 'İLGİLİ',     unit: 14, grade: [7,8],   img: '../images/8/1/26.webp' },
    { en: 'JEALOUS',    tr: 'KISKANÇ',     unit: 14, grade: [7,8],   img: '../images/8/1/37.webp' },
    { en: 'TACTFUL',    tr: 'DÜŞÜNCELİ',  unit: 14, grade: [8],     img: '../images/8/1/53.webp' },
    { en: 'ARROGANT',   tr: 'KİBİRLİ',    unit: 14, grade: [8],     img: '../images/8/1/25.webp' },
    { en: 'RELIABLE',   tr: 'GÜVENİLİR',  unit: 14, grade: [7,8],   img: '../images/7/1/27.webp' },
    { en: 'STUBBORN',   tr: 'İNATÇI',     unit: 14, grade: [7,8],   img: '../images/7/1/12.webp' },
    { en: 'TALENTED',   tr: 'YETENEKLİ',  unit: 14, grade: [7,8],   img: '../images/7/1/36.webp' },

    // ── KATEGORİ 15: SPORTS & EQUIPMENT ─────────
    { en: 'HOOP',    tr: 'POTA / HALKA',    unit: 15, grade: [7,8],   img: '../images/7/2/20.webp' },
    { en: 'SAILING', tr: 'YELKEN SPORU',     unit: 15, grade: [6,7,8], img: '../images/6/7/1.webp'  },
    { en: 'ARCHERY', tr: 'OKÇULUK',         unit: 15, grade: [7,8],   img: '../images/7/2/17.webp' },

    // ── KATEGORİ 16: PLACES IN TOWN ─────────────
    { en: 'WALL',     tr: 'DUVAR / KALE DUVARI', unit: 16, grade: [8],     img: '../images/8/7/1.webp'  },
    { en: 'TOMB',     tr: 'TÜRBE / MEZAR',       unit: 16, grade: [8],     img: '../images/8/7/5.webp'  },
    { en: 'MONUMENT', tr: 'ANİT',                unit: 16, grade: [8],     img: '../images/8/7/4.webp'  },
    { en: 'AIRPORT',  tr: 'HAVALİMANI',          unit: 16, grade: [7,8],   img: '../images/7/8/10.webp' },
    { en: 'CHURCH',   tr: 'KİLİSE',             unit: 16, grade: [8],     img: '../images/8/7/20.webp' },
    { en: 'KIOSK',    tr: 'BÜFE',               unit: 16, grade: [6,7,8], img: '../images/6/3/5.webp'  },
    { en: 'DOWNTOWN', tr: 'ŞEHİR MERKEZİ',      unit: 16, grade: [6,7,8], img: '../images/6/3/2.webp'  },
    { en: 'FOUNTAIN', tr: 'ÇEŞME',              unit: 16, grade: [8],     img: '../images/8/7/11.webp' },
    { en: 'STATUE',   tr: 'HEYKEL',             unit: 16, grade: [8],     img: '../images/8/7/13.webp' },

 // ── KATEGORİ 17: OCCUPATIONS ─────────────────

    { en: 'DIRECTOR',     tr: 'MÜDÜR',             unit: 17, grade: [6,7,8], img: '../images/6/6/5.webp'  },
    { en: 'RETIRED',      tr: 'EMEKLİ',            unit: 17, grade: [6,7,8], img: '../images/6/6/12.webp' },
    { en: 'MECHANIC',     tr: 'TAMİRCİ',           unit: 17, grade: [6,7,8], img: '../images/6/6/8.webp'  },
    { en: 'ARCHITECT',    tr: 'MİMAR',              unit: 17, grade: [6,7,8], img: '../images/6/6/1.webp'  },
    { en: 'SCIENTIST',    tr: 'BİLİM İNSANI',      unit: 17, grade: [7,8],   img: '../images/6/6/6.webp'  },
    { en: 'BUSINESSMAN',  tr: 'İŞADAMI',           unit: 17, grade: [7,8],   img: '../images/6/6/29.webp' },



  ]
};

const DIFF_SCORES = { easy: 10, medium: 20, hard: 30 };
const DIFF_LABELS = { easy: 'EASY', medium: 'MEDIUM', hard: 'HARD' };

/* ─────────────────────────────────────────────────────────────────
   KATEGORİ META — yeni kategori ekleyince buraya bir satır ekle,
   index.html'e dokunmana gerek yok.
───────────────────────────────────────────────────────────────── */
const UNIT_META = {
  11: { label: 'IRREGULAR VERBS',       icon: '⚡' },
  12: { label: 'ANIMALS',               icon: '🐾' },
  13: { label: 'FOOD & DRINKS',         icon: '🍎' },
  14: { label: 'APPEARANCE & PERSONALITY', icon: '😊' },
  15: { label: 'SPORTS & EQUIPMENT',    icon: '⚽' },
  16: { label: 'PLACES IN TOWN',        icon: '🏙' },
  17: { label: 'OCCUPATIONS',           icon: '💼' },
};

/* ─────────────────────────────────────────────────────────────────
   TUTORIAL KELİMELERİ — unit: 0
   Oyun mekaniğini öğretmek için kullanılır.
   Çok basit, kısa, yaygın İngilizce kelimeler.
   Puan/zorluk/süre sistemi YOKTUR.
─────────────────────────────────────────────────────────────────── */
const TUTORIAL_WORDS = [
  { en: 'CAT',    tr: 'KEDI'        },
  { en: 'DOG',    tr: 'KÖPEK'       },
  { en: 'SUN',    tr: 'GÜNEŞ'       },
  { en: 'BIG',    tr: 'BÜYÜK'       },
  { en: 'RED',    tr: 'KIRMIZI'     },
  { en: 'GOOD',   tr: 'İYİ'         },
  { en: 'FISH',   tr: 'BALIK'       },
  { en: 'BIRD',   tr: 'KUŞ'         },
  { en: 'BOOK',   tr: 'KİTAP'       },
  { en: 'BLUE',   tr: 'MAVİ'        },
  { en: 'FAST',   tr: 'HIZLI'       },
  { en: 'PLAY',   tr: 'OYNAMAK'     },
  { en: 'HAPPY',  tr: 'MUTLU'       },
  { en: 'LONG',   tr: 'UZUN'        },
  { en: 'APPLE',  tr: 'ELMA'        },
  { en: 'GREEN',  tr: 'YEŞİL'       },
  { en: 'WATER',  tr: 'SU'          },
  { en: 'LEARN',  tr: 'ÖĞRENMEK'    },
  { en: 'HOUSE',  tr: 'EV'          },
  { en: 'DANCE',  tr: 'DANS ETMEK'  },
];
