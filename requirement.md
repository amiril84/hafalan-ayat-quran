# Requirement Aplikasi Web Hafalan Ayat Tematik Al Quran

## 1. Ringkasan Produk

Aplikasi web responsif untuk membantu pengguna menghafalkan ayat-ayat tematik dari Al Quran. Aplikasi menampilkan daftar ayat berdasarkan file sumber `Ayat Tematik.xlsx`, menyediakan fitur pencarian surat/tema, detail ayat lengkap, audio murottal, terjemahan, dan tafsir.

Target utama aplikasi adalah pengguna umum yang ingin menghafal ayat tematik secara terarah, cepat menemukan ayat berdasarkan surat atau tema, lalu mendengarkan dan membaca ayat dengan tampilan yang nyaman.

## 2. Sumber Data Awal

File sumber: `Ayat Tematik.xlsx`

Sheet: `Ayat Tematik`

Kolom yang tersedia:

| Kolom | Deskripsi |
| --- | --- |
| No. | Nomor urut daftar ayat tematik |
| Nama Surat | Nama surat dalam transliterasi Indonesia |
| Ayat | Rentang ayat, misalnya `1 - 4` atau `183 - 188` |

Daftar ayat pada file:

| No. | Surat | Rentang Ayat |
| --- | --- | --- |
| 1 | Al Anfal | 1 - 4 |
| 2 | Al Furqon | 63 - 70 |
| 3 | Al Fath | 28 - 29 |
| 4 | Al Mukminun | 1 - 11 |
| 5 | Ali Imran | 1 - 27 |
| 6 | Al Jum'ah | 9 - 11 |
| 7 | Al Munafiqun | 9 - 11 |
| 8 | Thaha | 124 - 127 |
| 9 | Al Baqarah | 183 - 188 |
| 10 | Al Baqarah | 284 - 286 |
| 11 | Al Hasyr | 18 - 24 |
| 12 | As Shaff | 1 - 6 |
| 13 | Ali Imran | 130 - 136 |
| 14 | Ali Imran | 190 - 194 |
| 15 | Ar Ruum | 1 - 10 |
| 16 | Ali Imran | 159 - 163 |
| 17 | Al Baqarah | 196 - 203 |
| 18 | Al An'am | 160 - 163 |
| 19 | Al Isra' | 78 - 85 |
| 20 | Ali Imran | 102 - 104 |
| 21 | Al A'raf | 204 - 206 |
| 22 | Fussilat | 30 - 35 |
| 23 | An Nisa | 9 - 12 |
| 24 | Al Baqarah | 168 - 173 |

Catatan data:

- File Excel belum menyediakan tema singkat, teks Arab, terjemahan, tafsir, maupun audio.
- Aplikasi perlu melakukan data enrichment dari sumber data Al Quran internal atau API eksternal.
- Setiap baris Excel harus dipetakan ke nomor surat resmi agar data Arab, terjemahan, tafsir, dan audio dapat diambil secara konsisten.

## 3. Tujuan Aplikasi

1. Menampilkan daftar ayat tematik dalam bentuk card yang menarik dan mudah dipindai.
2. Membantu pengguna membaca penggalan awal ayat sebelum masuk ke detail.
3. Memudahkan pengguna mendengarkan audio ayat lengkap dari daftar maupun halaman detail.
4. Menampilkan detail ayat lengkap per ayat, termasuk teks Arab dan terjemahan.
5. Menyediakan halaman tafsir untuk memahami makna ayat.
6. Mendukung pencarian berdasarkan nama surat dan tema.
7. Memberikan pengalaman mobile dan desktop yang polish, profesional, dan nyaman untuk bacaan Arab.

## 4. Pengguna Sasaran

Pengguna utama:

- Pelajar atau santri yang sedang menghafalkan ayat tematik.
- Guru, pembina halaqah, atau mentor tahfizh yang membutuhkan daftar rujukan cepat.
- Pengguna umum yang ingin membaca, mendengar, dan memahami ayat tertentu.

Kebutuhan pengguna:

- Dapat menemukan ayat dengan cepat.
- Dapat membaca teks Arab dengan jelas.
- Dapat mendengarkan audio ayat.
- Dapat memahami arti dan tafsir.
- Dapat digunakan nyaman di ponsel.

## 5. Struktur Halaman

Aplikasi minimal memiliki tiga halaman:

1. Halaman Daftar Ayat
2. Halaman Detail Ayat
3. Halaman Tafsir

Rekomendasi routing:

| Halaman | Route |
| --- | --- |
| Daftar Ayat | `/` |
| Detail Ayat | `/ayat/:surahId/:startAyah-:endAyah` |
| Tafsir | `/tafsir/:surahId/:ayahNumber` atau `/tafsir/:surahId/:startAyah-:endAyah` |

## 6. Requirement Halaman Daftar Ayat

### 6.1 Konten Utama

Halaman pertama harus menampilkan satu card untuk setiap row pada tabel `Ayat Tematik.xlsx`.

Urutan card harus mengikuti urutan surat di dalam mushaf Al Quran, bukan urutan asli pada file Excel. Jika terdapat beberapa card dari surat yang sama, urutkan berdasarkan nomor ayat awal.

Setiap card wajib memuat:

- Nama surat.
- Rentang ayat.
- Tema singkat.
- Tulisan Arab penggalan awal ayat.
- Tombol atau icon lihat detail ayat.
- Tombol atau icon dengarkan ayat.

Contoh isi card:

- Surat: `Al Baqarah`
- Ayat: `183 - 188`
- Tema: `Puasa dan ketakwaan`
- Penggalan Arab: teks Arab awal dari ayat pertama pada rentang tersebut
- Aksi: detail dan audio

### 6.2 Tema Singkat

Karena file Excel belum memiliki kolom tema, aplikasi harus mendukung salah satu pendekatan berikut:

1. Menambahkan field tema pada data hasil impor.
2. Menyediakan file konfigurasi terpisah yang memetakan `surat + rentang ayat` ke tema.
3. Mengisi tema secara manual melalui seed data aplikasi.

Field tema harus singkat, idealnya 2 sampai 6 kata, agar card tetap mudah dipindai.

### 6.3 Pencarian

Di ujung kanan atas halaman harus tersedia tombol atau icon pencarian.

Saat tombol pencarian diklik:

- Muncul input pencarian.
- Pengguna dapat mencari berdasarkan nama surat.
- Pengguna dapat mencari berdasarkan tema.
- Pencarian bersifat case-insensitive.
- Hasil daftar card terfilter secara langsung saat pengguna mengetik.
- Jika tidak ada hasil, tampilkan empty state yang sopan dan jelas.

Contoh query:

- `baqarah`
- `puasa`
- `iman`
- `ali imran`

### 6.4 Interaksi Card

Tombol lihat detail:

- Mengarahkan pengguna ke halaman detail ayat sesuai surat dan rentang ayat.
- URL harus dapat dibuka ulang langsung dari browser.

Tombol dengarkan:

- Memutar audio lengkap untuk seluruh ayat dalam rentang tersebut.
- Jika rentang berisi beberapa ayat, audio diputar berurutan.
- Saat audio berjalan, tampilkan status sedang diputar pada card terkait.
- Pengguna dapat menghentikan audio.
- Jika pengguna memutar audio card lain, audio sebelumnya harus berhenti atau berpindah secara jelas.

### 6.5 Urutan Daftar

Daftar ayat harus disusun berdasarkan nomor surat resmi dalam Al Quran.

Aturan sorting:

1. Urutkan berdasarkan `surahId` dari kecil ke besar.
2. Jika `surahId` sama, urutkan berdasarkan `startAyah` dari kecil ke besar.
3. Field `order` dari Excel tetap boleh disimpan untuk referensi, tetapi tidak menjadi urutan utama tampilan.

Contoh dampak sorting:

- `Al Baqarah` tampil sebelum `Ali Imran`.
- Semua entri `Al Baqarah` diurutkan berdasarkan ayat awalnya, misalnya `168 - 173`, `183 - 188`, `196 - 203`, lalu `284 - 286`.

### 6.6 Layout dan Visual

Desktop:

- Card ditampilkan dalam grid 2 sampai 3 kolom sesuai lebar layar.
- Header tetap rapi dengan judul halaman dan tombol pencarian di kanan atas.
- Spasi antar card cukup lega, tetapi tetap efisien.

Mobile:

- Card ditampilkan satu kolom.
- Tombol aksi mudah disentuh.
- Search tetap mudah diakses di area atas.

Gaya visual:

- Profesional, bersih, hangat, dan fokus pada keterbacaan.
- Gunakan tipografi Arab yang nyaman dibaca.
- Pastikan teks Arab memiliki arah kanan-ke-kiri.
- Kontras teks memenuhi standar aksesibilitas dasar.

## 7. Requirement Halaman Detail Ayat

### 7.1 Konten Utama

Halaman detail ayat menampilkan seluruh ayat dari rentang yang dipilih.

Bagian paling atas halaman detail harus berupa header detail ayat yang menampilkan:

- Nama surat dan rentang ayat.
- Tema singkat.
- Tombol audio utama untuk mendengarkan seluruh ayat dalam rentang tersebut.

Setelah header, tampilkan list ayat pada rentang yang dipilih.

Untuk setiap ayat, tampilkan:

- Nomor ayat.
- Teks Arab lengkap.
- Terjemahan Indonesia.
- Tombol tafsir.
- Tombol dengarkan ayat tersebut.

Jika rentang berisi beberapa ayat, setiap ayat harus menjadi unit tampilan yang jelas.

Contoh untuk `Al Baqarah 183 - 188`:

- Al Baqarah:183, teks Arab lengkap, terjemahan, tombol audio, tombol tafsir.
- Al Baqarah:184, teks Arab lengkap, terjemahan, tombol audio, tombol tafsir.
- Berlanjut sampai ayat 188.

### 7.2 Header Audio Detail

Tombol audio utama pada header detail:

- Memutar seluruh ayat dalam rentang yang dipilih secara berurutan.
- Menggunakan audio bacaan Abdurrahman as-Sudais.
- Menampilkan status loading saat audio pertama sedang disiapkan.
- Menampilkan status playing saat rangkaian audio berjalan.
- Menyediakan kontrol pause/stop.
- Meng-highlight ayat yang sedang diputar bila memungkinkan.

### 7.3 Audio Per Ayat

Tombol dengarkan pada setiap ayat:

- Memutar audio hanya untuk ayat tersebut.
- Menggunakan audio bacaan Abdurrahman as-Sudais.
- Menampilkan status loading saat audio sedang disiapkan.
- Menampilkan status playing saat audio berjalan.
- Menyediakan kontrol pause/stop.
- Menangani error audio dengan pesan yang mudah dipahami.

### 7.4 Tombol Tafsir

Tombol tafsir pada setiap ayat:

- Membuka halaman detail tafsir untuk ayat tersebut.
- Membawa konteks surat dan nomor ayat.
- Jika implementasi tafsir berbasis rentang ayat, halaman tafsir boleh menampilkan seluruh ayat pada rentang yang dipilih, tetapi minimal harus dapat menampilkan tafsir per ayat.

### 7.5 Navigasi

Halaman detail harus memiliki:

- Tombol kembali ke daftar ayat.
- Header berisi judul surat, rentang ayat, tema, dan tombol audio seluruh ayat.
- Navigasi yang tidak membingungkan di mobile.

## 8. Requirement Halaman Tafsir

### 8.1 Konten Utama

Halaman tafsir menampilkan:

- Nama surat.
- Nomor ayat.
- Teks Arab ayat.
- Arti atau terjemahan Indonesia.
- Tafsir ayat.

Jika pengguna membuka tafsir dari satu ayat, halaman menampilkan tafsir ayat tersebut.

Jika pengguna membuka tafsir untuk rentang ayat, halaman dapat menampilkan beberapa blok tafsir per ayat.

### 8.2 Tampilan Tafsir

Tafsir harus mudah dibaca:

- Gunakan paragraf dengan line-height nyaman.
- Pisahkan teks Arab, terjemahan, dan tafsir secara visual.
- Teks tafsir tidak boleh terlalu rapat.
- Sediakan tombol kembali ke halaman detail.

### 8.3 Sumber Tafsir

Aplikasi harus menggunakan tafsir publik Indonesia dari provider API sebagai sumber tafsir utama.

Minimal metadata tafsir:

- Nama sumber tafsir sesuai provider, misalnya `Tafsir Kemenag RI`.
- Bahasa tafsir.
- Nomor surat.
- Nomor ayat.
- Isi tafsir.

Ketentuan tafsir:

- Tafsir yang ditampilkan adalah versi singkat/ringkas, bukan teks panjang yang terlalu berat untuk pengalaman hafalan.
- Jika sumber data menyediakan tafsir panjang, aplikasi dapat menampilkan versi yang tetap nyaman dibaca untuk pengalaman hafalan.
- Halaman tafsir harus menampilkan label sumber tafsir agar pengguna mengetahui rujukannya.

Jika data tafsir gagal dimuat, tampilkan fallback state:

- Teks Arab dan terjemahan tetap ditampilkan bila tersedia.
- Area tafsir menampilkan pesan bahwa tafsir belum tersedia.

## 9. Data Model

### 9.1 ThematicVerse

```ts
type ThematicVerse = {
  id: string;
  order: number;
  surahId: number;
  surahName: string;
  surahNameNormalized: string;
  startAyah: number;
  endAyah: number;
  theme: string;
  firstAyahSnippetArabic: string;
};
```

### 9.2 AyahDetail

```ts
type AyahDetail = {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translationId: string;
  audioUrl: string;
  audioReciter: "Abdurrahman as-Sudais";
};
```

### 9.3 TafsirDetail

```ts
type TafsirDetail = {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translationId: string;
  tafsirText: string;
  tafsirSource: string;
};
```

## 10. Data Processing

Aplikasi perlu melakukan proses berikut:

1. Membaca daftar surat dan rentang ayat dari `Ayat Tematik.xlsx`.
2. Menormalisasi nama surat agar sesuai dengan nomor surat resmi.
3. Memecah rentang ayat, misalnya `183 - 188`, menjadi `startAyah = 183` dan `endAyah = 188`.
4. Mengambil teks Arab untuk ayat pertama sebagai penggalan awal di card.
5. Mengambil teks Arab lengkap untuk semua ayat di halaman detail.
6. Mengambil terjemahan Indonesia untuk setiap ayat.
7. Mengambil tafsir publik Indonesia untuk setiap ayat.
8. Mengambil URL audio bacaan Abdurrahman as-Sudais untuk setiap ayat.
9. Menyediakan tema singkat untuk setiap row.
10. Mengurutkan daftar berdasarkan `surahId`, lalu `startAyah`.

Validasi data:

- Rentang ayat harus valid dan tidak melebihi jumlah ayat pada surat.
- Nama surat dari Excel harus dapat dipetakan ke surat resmi.
- Jika nama surat tidak ditemukan, data tersebut harus ditandai sebagai error saat build atau import.
- Data kosong tidak boleh membuat aplikasi crash.

## 11. Fitur Audio

Fitur audio wajib mendukung:

- Play audio satu ayat.
- Play audio beberapa ayat berurutan.
- Pause atau stop audio.
- Indikator loading.
- Indikator playing.
- Error handling bila audio tidak tersedia.
- Preferensi qari wajib menggunakan bacaan Abdurrahman as-Sudais.

Perilaku audio:

- Hanya satu audio aktif dalam satu waktu.
- Audio list card memutar seluruh rentang ayat.
- Audio utama pada header detail memutar seluruh rentang ayat.
- Audio detail pada list ayat memutar satu ayat.
- Saat pindah halaman, audio yang sedang berjalan harus berhenti atau tetap berjalan sesuai keputusan produk yang konsisten. Rekomendasi awal: audio berhenti saat berpindah halaman.

## 12. Requirement UI dan UX

### 12.1 Prinsip Desain

- Tampilan responsif, polish, dan profesional.
- Fokus utama adalah keterbacaan ayat.
- Gunakan whitespace yang cukup.
- Hindari tampilan terlalu ramai.
- Gunakan icon yang mudah dikenali untuk detail, audio, pencarian, kembali, dan tafsir.
- Gunakan state visual untuk hover, active, loading, dan disabled.

### 12.2 Tipografi

- Teks Arab harus lebih besar dari teks latin.
- Teks Arab menggunakan font yang mendukung harakat dengan baik.
- Terjemahan menggunakan font latin yang nyaman dibaca.
- Line-height teks Arab harus cukup besar agar harakat tidak bertabrakan.

### 12.3 Warna

- Gunakan palet yang tenang dan religius tanpa terlihat kuno.
- Warna utama dapat digunakan untuk aksi penting seperti detail dan audio.
- Pastikan kontras tombol dan teks cukup terbaca.

### 12.4 Responsivitas

Breakpoint minimal:

- Mobile: kurang dari 640px.
- Tablet: 640px sampai 1023px.
- Desktop: 1024px ke atas.

Perilaku:

- Mobile menggunakan satu kolom card.
- Tablet dapat menggunakan dua kolom card.
- Desktop dapat menggunakan dua atau tiga kolom card.
- Header tidak boleh pecah atau menumpuk secara buruk.
- Tombol harus memiliki ukuran sentuh minimal yang nyaman.

## 13. State dan Error Handling

State yang harus tersedia:

- Loading data daftar ayat.
- Loading detail ayat.
- Loading tafsir.
- Loading audio.
- Empty result saat pencarian tidak menemukan data.
- Error saat data gagal dimuat.
- Error saat audio gagal diputar.
- Data tafsir belum tersedia.

Pesan error harus singkat, sopan, dan tidak teknis.

Contoh:

- `Data ayat belum berhasil dimuat. Coba muat ulang halaman.`
- `Audio ayat belum tersedia.`
- `Tafsir untuk ayat ini belum tersedia.`

## 14. Non-Functional Requirement

### 14.1 Performance

- Halaman daftar ayat harus dapat tampil cepat karena data awal hanya 24 card.
- Detail ayat dan tafsir boleh lazy-load saat halaman dibuka.
- Audio tidak perlu diunduh sebelum pengguna menekan tombol play.
- Gunakan caching untuk data Quran, terjemahan, tafsir, dan audio metadata bila memungkinkan.

### 14.2 Accessibility

- Semua tombol icon harus memiliki accessible label.
- Semua interaksi penting harus bisa diakses dengan keyboard.
- Fokus keyboard harus terlihat.
- Teks Arab dan terjemahan harus memiliki kontras memadai.
- Status audio harus dapat dipahami tanpa hanya bergantung pada warna.

### 14.3 Browser Support

Minimal mendukung:

- Chrome versi modern.
- Edge versi modern.
- Firefox versi modern.
- Safari mobile versi modern.

### 14.4 SEO dan Sharing

Setiap halaman detail ayat dan tafsir sebaiknya memiliki metadata:

- Title berisi nama surat dan rentang ayat.
- Description berisi tema dan ringkasan konten.
- URL stabil untuk dibagikan.

## 15. Acceptance Criteria

### 15.1 Halaman Daftar Ayat

- Terdapat 24 card sesuai data pada `Ayat Tematik.xlsx`.
- Card diurutkan berdasarkan urutan surat dalam Al Quran, lalu nomor ayat awal.
- Setiap card menampilkan surat, rentang ayat, tema singkat, penggalan awal Arab, tombol detail, dan tombol audio.
- Tombol detail membuka halaman detail sesuai card.
- Tombol audio memutar semua ayat dalam rentang tersebut secara lengkap.
- Tombol pencarian berada di kanan atas.
- Pencarian dapat memfilter berdasarkan surat dan tema.
- Empty state muncul jika pencarian tidak menemukan hasil.
- Tampilan tetap rapi di mobile dan desktop.

### 15.2 Halaman Detail Ayat

- Halaman menampilkan semua ayat dari rentang yang dipilih.
- Bagian atas halaman menampilkan header berisi nama surat, tema singkat, dan tombol audio untuk mendengarkan seluruh ayat.
- Setiap ayat memiliki teks Arab lengkap.
- Setiap ayat memiliki terjemahan Indonesia.
- Setiap ayat memiliki tombol audio.
- Setiap ayat memiliki tombol tafsir.
- Tombol tafsir membuka halaman tafsir yang sesuai.
- Tombol kembali mengarah ke halaman daftar.

### 15.3 Halaman Tafsir

- Halaman menampilkan teks Arab ayat.
- Halaman menampilkan terjemahan Indonesia.
- Halaman menampilkan tafsir publik Indonesia.
- Halaman menampilkan sumber tafsir.
- Tombol kembali mengarah ke halaman detail.
- Jika tafsir belum tersedia, aplikasi menampilkan fallback message tanpa crash.

### 15.4 Audio

- Audio satu ayat dapat diputar dari halaman detail.
- Audio rentang ayat dapat diputar dari card daftar.
- Audio rentang ayat dapat diputar dari header halaman detail.
- Audio menggunakan bacaan Abdurrahman as-Sudais.
- Audio yang sedang berjalan memiliki indikator visual.
- Audio dapat dihentikan atau diganti dengan audio lain.
- Error audio ditangani dengan pesan yang jelas.

## 16. Prioritas Implementasi

### MVP

1. Import dan normalisasi data dari Excel.
2. Halaman daftar ayat dengan card.
3. Tema singkat dari seed data.
4. Pencarian surat dan tema.
5. Halaman detail ayat.
6. Teks Arab lengkap dan terjemahan Indonesia.
7. Audio per ayat dan audio rentang menggunakan bacaan Abdurrahman as-Sudais.
8. Halaman tafsir per ayat menggunakan tafsir publik Indonesia.
9. Responsive layout mobile dan desktop.

### Nice to Have

1. Bookmark ayat favorit.
2. Progress hafalan.
3. Mode latihan hafalan dengan menyembunyikan sebagian ayat.
4. Pilihan qari tambahan selain Abdurrahman as-Sudais.
5. Dark mode.
6. Riwayat ayat terakhir dibuka.
7. Share link ayat atau tafsir.

## 17. Risiko dan Ketergantungan

Risiko utama:

- Perbedaan penulisan nama surat pada Excel dengan data Quran resmi.
- Ketersediaan audio untuk semua ayat.
- Ketersediaan tafsir bahasa Indonesia.
- Hak penggunaan data terjemahan, tafsir, dan audio.
- Kualitas font Arab pada berbagai browser.

Mitigasi:

- Buat mapping manual nama surat ke nomor surat.
- Gunakan sumber data Quran yang jelas dan konsisten.
- Simpan fallback untuk data yang belum tersedia.
- Pastikan lisensi data terjemahan, tafsir, dan audio boleh digunakan.
- Uji tampilan Arab di mobile dan desktop.

## 18. Definition of Done

Aplikasi dianggap selesai untuk versi awal jika:

- Semua data dari `Ayat Tematik.xlsx` tampil di halaman daftar.
- Daftar ayat sudah diurutkan berdasarkan urutan surat dalam Al Quran dan nomor ayat awal.
- Semua card dapat membuka detail ayat.
- Semua detail ayat memiliki header berisi nama surat, tema singkat, dan tombol audio seluruh ayat.
- Semua detail ayat menampilkan teks Arab dan terjemahan.
- Audio bacaan Abdurrahman as-Sudais dapat diputar dari daftar dan detail.
- Halaman tafsir dapat dibuka dari setiap ayat.
- Halaman tafsir menggunakan tafsir publik Indonesia dan menampilkan sumbernya.
- Pencarian surat dan tema bekerja.
- UI responsif di mobile, tablet, dan desktop.
- Tidak ada error fatal pada data kosong, audio gagal, atau tafsir tidak tersedia.
- Tampilan sudah polish, profesional, dan nyaman digunakan untuk membaca serta menghafal.
