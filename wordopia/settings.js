// ─────────────────────────────────────────────────────
// JEO SCRABBLE — Varsayılan oyun ayarları
//
// Bu dosyadaki DEFAULT_SETTINGS değerleri oyunun fabrika
// çıkış ayarlarıdır. localStorage'da kayıtlı bir ayar
// varsa o ayarlar öncelik kazanır.
//
// Ayarları sıfırlamak için tarayıcı konsoluna şunu yaz:
//   localStorage.removeItem('jeo_scrabble_settings')
// ─────────────────────────────────────────────────────

const SETTINGS_KEY = 'jeo_scrabble_settings';

// Slider indeksleri — TIME_STEPS ve COIN_STEPS dizileriyle eşleşir
const DEFAULT_SETTINGS = {
  timeIdx:         2,     // TIME_STEPS[2]  = 30s
  coinIdx:         2,     // COIN_STEPS[2]  = 200 🪙
  avmodeIdx:       0,     // 0=TEAM-BASED | 1=STUDENT-BASED
  selectedUnits:   [1],   // Irregular Verbs (unit 11) varsayılan kapalı
  selectedClasses: ['7A'], // Yarışmaya dahil edilecek sınıf id'leri
};

/**
 * localStorage'dan ayarları oku.
 * Kayıt yoksa ya da bozuksa DEFAULT_SETTINGS döner.
 */
function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch(e) {
    console.warn('[settings.js] loadSettings parse error:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

/**
 * Verilen ayar nesnesini localStorage'a yaz.
 * @param {{ timeIdx:number, coinIdx:number, avmodeIdx:number }} obj
 */
function saveSettings(obj) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj));
  } catch(e) {
    console.warn('[settings.js] saveSettings error:', e);
  }
}

/**
 * Kayıtlı ayarları oyun değişkenlerine ve slider'lara uygula.
 * Ana script yüklendikten sonra çağrılmalı (TIME_STEPS, COIN_STEPS hazır olsun).
 */
function applySettings() {
  const s = loadSettings();

  // Slider'ları güncelle
  const stTime   = document.getElementById('st-time');
  const stCoins  = document.getElementById('st-coins');
  const stAvmode = document.getElementById('st-avmode');
  if (stTime)   stTime.value   = s.timeIdx;
  if (stCoins)  stCoins.value  = s.coinIdx;
  if (stAvmode) stAvmode.value = s.avmodeIdx;

  // Oyun değişkenlerini set et
  if (typeof TIME_STEPS !== 'undefined')  ROUND_SECS   = TIME_STEPS[s.timeIdx];
  if (typeof COIN_STEPS !== 'undefined')  START_COINS  = COIN_STEPS[s.coinIdx];
  if (typeof AVATAR_MODE !== 'undefined' || true) {
    AVATAR_MODE = s.avmodeIdx === 0 ? 'team' : 'student';
  }

  // Seçili üniteleri geri yükle (Array → Set)
  if (typeof selectedUnits !== 'undefined') {
    const units = Array.isArray(s.selectedUnits) && s.selectedUnits.length > 0
      ? s.selectedUnits
      : [11];
    selectedUnits = new Set(units);
  }

  // Seçili sınıfları geri yükle (Array → Set)
  if (typeof selectedClasses !== 'undefined') {
    const classes = Array.isArray(s.selectedClasses) && s.selectedClasses.length > 0
      ? s.selectedClasses
      : ['7A'];
    selectedClasses = new Set(classes);
  }

  // Display etiketlerini güncelle (overlay kapalıyken de doğru görünsün)
  if (typeof updateSettingsDisplay === 'function') updateSettingsDisplay();

  console.log('[settings.js] Ayarlar yüklendi →',
    `tur=${ROUND_SECS}s`, `coin=${START_COINS}`, `avatar=${AVATAR_MODE}`,
    `üniteler=[${[...(typeof selectedUnits!=='undefined'?selectedUnits:[])].join(',')}]`,
    `sınıflar=[${[...(typeof selectedClasses!=='undefined'?selectedClasses:[])].join(',')}]`);
}
