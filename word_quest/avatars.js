// ============================================================
// AVATARS.JS — Avatar listesi
//
// Yeni avatar eklemek için SADECE bu dosyayı düzenle.
// Ana HTML dosyasına dokunmana gerek yok.
//
// Dosya İsimlendirme Kuralı:
//   AV_<KATEGORİ>_<İSİM>.<uzantı>
//
//   Örnek: AV_Comic_Batman.png   → Kategori: COMIC   | İsim: BATMAN
//          AV_Anime_Pixie.png    → Kategori: ANIME   | İsim: PIXIE
//          AV_Batman.png         → Kategori: GENEL   | İsim: BATMAN
//                                  (alt çizgi 1 tane → kategori yok → GENEL)
//
// facesRight: true  → karakter doğal haliyle SAĞA bakıyor
// facesRight: false → karakter doğal haliyle SOLA bakıyor
// (Oyun Team A'yı sağa, Team B'yi sola otomatik çevirir)
//
// Adım: Dosyayı avatars\ klasörüne at → aşağıya bir satır ekle → bitti.
// ============================================================

const AVATARS = [
  {src:'avatars/AV_Anime_Blaze.webp', dmgSrc:'avatars/AV_Anime_Blaze_dmg.webp', facesRight:false},
  {src:'avatars/AV_Anime_Frost.webp', dmgSrc:'avatars/AV_Anime_Frost_dmg.webp', facesRight:false},
  {src:'avatars/AV_Anime_Grace.webp', dmgSrc:'avatars/AV_Anime_Grace_dmg.webp', facesRight:false},
  {src:'avatars/AV_Anime_Louis.webp', dmgSrc:'avatars/AV_Anime_Louis_dmg.webp', facesRight:false},
  {src:'avatars/AV_Anime_Mara.webp',  dmgSrc:'avatars/AV_Anime_Mara_dmg.webp',  facesRight:false},
  {src:'avatars/AV_Anime_Nova.webp',  dmgSrc:'avatars/AV_Anime_Nova_dmg.webp',  facesRight:true},
  {src:'avatars/AV_Anime_Orion.webp', dmgSrc:'avatars/AV_Anime_Orion_dmg.webp', facesRight:false},
  {src:'avatars/AV_Anime_Pixie.webp', dmgSrc:'avatars/AV_Anime_Pixie_dmg.webp', facesRight:false},
  {src:'avatars/AV_Anime_Rex.webp',   dmgSrc:'avatars/AV_Anime_Rex_dmg.webp',   facesRight:false},
  {src:'avatars/AV_Anime_Terra.webp', dmgSrc:'avatars/AV_Anime_Terra_dmg.webp', facesRight:true},
  // buraya ekle ↓
];
