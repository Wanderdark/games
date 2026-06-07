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
  {src:'avatars/AV_Anime_Blaze.webp',  facesRight:false},
  {src:'avatars/AV_Anime_Frost.webp',  facesRight:false},
  {src:'avatars/AV_Anime_Grace.webp',  facesRight:false},
  {src:'avatars/AV_Anime_Louis.webp',  facesRight:false},
  {src:'avatars/AV_Anime_Mara.webp',   facesRight:false},
  {src:'avatars/AV_Anime_Nova.webp',   facesRight:true},
  {src:'avatars/AV_Anime_Orion.webp',  facesRight:false},
  {src:'avatars/AV_Anime_Pixie.webp',  facesRight:false},
  {src:'avatars/AV_Anime_Rex.webp',    facesRight:false},
  {src:'avatars/AV_Anime_Terra.webp',  facesRight:true},
  // buraya ekle ↓
];
