// ─────────────────────────────────────────────────────
// WORDBUILDER SCRABBLE — Varsayılan oyun ayarları
//
// Bu dosyadaki DEFAULT_SETTINGS değerleri oyunun fabrika
// çıkış ayarlarıdır. localStorage'da kayıtlı bir ayar
// varsa o ayarlar öncelik kazanır.
//
// Ayarları sıfırlamak için tarayıcı konsoluna şunu yaz:
//   localStorage.removeItem('scrabble_settings')
// ─────────────────────────────────────────────────────

const SETTINGS_KEY = 'scrabble_settings';

// Slider indeksleri — HP_STEPS ve TIME_STEPS dizileriyle eşleşir
const DEFAULT_SETTINGS = {
  hpIdx:           3,       // HP_STEPS[3]   = 500 HP
  timeIdx:         2,       // TIME_STEPS[2] = 30s
  playStyle:       'RANDOM', // 'RANDOM' | 'TURN_BASED'
  avatarMode:      'team',  // 'team' | 'student'
  selectedClasses: ['7A'],  // Yarışmaya dahil edilecek sınıf id'leri
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
 * @param {{ hpIdx:number, timeIdx:number, playStyle:string, avatarMode:string }} obj
 */
function saveSettings(obj) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj));
  } catch(e) {
    console.warn('[settings.js] saveSettings error:', e);
  }
}

/**
 * Kayıtlı ayarları oyun değişkenlerine ve UI'a uygula.
 * Ana script yüklendikten sonra çağrılmalı.
 */
function applySettings() {
  const s = loadSettings();

  // Slider'ları güncelle
  const stHp   = document.getElementById('st-hp');
  const stTime = document.getElementById('st-time');
  if (stHp)   stHp.value   = s.hpIdx;
  if (stTime) stTime.value  = s.timeIdx;

  // Oyun değişkenlerini set et
  if (typeof HP_STEPS   !== 'undefined') INITIAL_HP  = HP_STEPS[s.hpIdx];
  if (typeof TIME_STEPS !== 'undefined') ROUND_SECS  = TIME_STEPS[s.timeIdx];

  // Play style + avatar mode (fonksiyonlar zaten UI'ı da günceller)
  if (typeof setPlayStyle   === 'function') setPlayStyle(s.playStyle);
  if (typeof setAvatarMode  === 'function') setAvatarMode(s.avatarMode);

  // Seçili sınıfları geri yükle (Array → Set)
  if (typeof selectedClasses !== 'undefined') {
    const classes = Array.isArray(s.selectedClasses) && s.selectedClasses.length > 0
      ? s.selectedClasses
      : ['7A'];
    selectedClasses = new Set(classes);
  }

  // Display etiketlerini güncelle
  if (typeof updateSettingsDisplay === 'function') updateSettingsDisplay();

  console.log('[settings.js] Ayarlar yüklendi →',
    `hp=${INITIAL_HP}`, `tur=${ROUND_SECS}s`,
    `style=${s.playStyle}`, `avatar=${s.avatarMode}`,
    `sınıflar=[${[...(typeof selectedClasses!=='undefined'?selectedClasses:[])].join(',')}]`);
}
