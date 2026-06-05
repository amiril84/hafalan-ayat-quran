# Troubleshooting

## Audio gagal di iPhone atau iPad

Jika tombol **Dengarkan semua** atau **Dengarkan ayat** menampilkan pesan
"Audio gagal", coba urutan berikut:

1. Pastikan halaman sudah memakai versi terbaru dengan membuka ulang:
   `https://tahfidzh-mj.vercel.app/?v=audio-refresh`
2. Tutup Safari atau Chrome dari app switcher, lalu buka ulang situs.
3. Matikan sementara VPN, DNS filter, content blocker, atau Ad Guard.
4. Coba ganti jaringan, misalnya dari Wi-Fi ke mobile data.
5. Buka direct audio test berikut di Safari:
   `https://tahfidzh-mj.vercel.app/api/audio?src=https%3A%2F%2Fcdn.equran.id%2Faudio-partial%2FAbdurrahman-as-Sudais%2F002168.mp3`

Jika direct audio bisa diputar tetapi tombol di halaman masih gagal, kemungkinan
Safari menyimpan cache atau website data lama. Bersihkan website data khusus
situs ini:

1. Buka **Settings** di iPhone.
2. Masuk ke **Safari**.
3. Masuk ke **Advanced**.
4. Pilih **Website Data**.
5. Cari `tahfidzh-mj.vercel.app`.
6. Hapus data situs tersebut.
7. Restart iPhone.
8. Buka ulang `https://tahfidzh-mj.vercel.app`.

Catatan: Safari dan Chrome di iPhone sama-sama memakai WebKit milik iOS, jadi
masalah cache atau media playback di level iOS bisa muncul di kedua browser.
