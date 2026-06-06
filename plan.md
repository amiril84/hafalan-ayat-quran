# Implementation Plan Aplikasi Hafalan Ayat Tematik

## 1. Prinsip Eksekusi

Plan ini dibuat untuk implementasi bertahap dari `requirement.md`.

Prioritas utama:

1. Bangun front-end lengkap terlebih dahulu menggunakan dummy data.
2. Setelah front-end bisa dicek user, lanjutkan backend.
3. Setelah backend selesai, lanjutkan integrasi front-end dan backend.
4. Setiap fase wajib ditutup dengan acceptance criteria dan test otomatis.
5. Jika test otomatis gagal, AI wajib memperbaiki dan menjalankan ulang test sampai lulus.
6. Setelah test fase lulus, AI wajib memberi laporan ke user.
7. AI hanya boleh lanjut ke fase berikutnya setelah user memberi konfirmasi OK.

Aturan gate antar fase:

- Status `FAILED`: ada acceptance criteria atau test otomatis yang belum lulus. AI harus memperbaiki, tidak boleh lanjut fase.
- Status `PASSED_WAITING_USER`: semua acceptance criteria dan test otomatis fase lulus. AI harus berhenti dan meminta konfirmasi user.
- Status `APPROVED`: user sudah memberi konfirmasi OK. AI boleh lanjut ke fase berikutnya.

Aturan tracking progress:

- AI wajib membuat dan menjaga file `progress.md` sebagai tracker implementasi seluruh fase pada dokumen ini.
- Setiap selesai satu fase dan semua test otomatis fase tersebut lulus, AI wajib memperbarui `progress.md` dengan status fase, ringkasan pekerjaan, hasil test, catatan penting, dan status gate terbaru.
- Setelah memperbarui `progress.md`, AI wajib menginformasikan hasil fase kepada user dan meminta approval untuk lanjut ke fase berikutnya.
- AI tidak boleh lanjut ke fase berikutnya sebelum user memberi konfirmasi `OK`.

## 2. Tech Stack Lengkap

### 2.1 Front-End

- Framework: Next.js App Router
- UI library: React
- Language: TypeScript
- Styling: Tailwind CSS
- Component foundation: shadcn/ui
- Icon: lucide-react
- Font latin: Inter atau Geist Sans
- Font Arab: Noto Naskh Arabic atau Amiri
- Routing: Next.js App Router
- Client state: React Context atau Zustand untuk audio player global
- Server/cache state: TanStack Query saat integrasi API
- Form dan validasi input: React controlled input + Zod untuk validasi data
- Mocking API saat front-end dummy: MSW atau static TypeScript fixtures

### 2.2 Back-End

- Runtime: Node.js LTS
- API layer: Next.js Route Handlers
- Language: TypeScript
- ORM: Prisma
- Database development: PostgreSQL via Docker Compose
- Database production: PostgreSQL managed service, misalnya Supabase, Neon, atau Railway
- Migration: Prisma Migrate
- Validation: Zod
- Excel parser: exceljs
- HTTP client provider eksternal: native `fetch`
- Logging: pino atau structured console logger sederhana untuk MVP

### 2.3 Data dan Konten Quran

- Source awal daftar tematik: `Ayat Tematik.xlsx`
- Data master surat: seed lokal berisi nomor surat resmi, nama Arab, nama latin, dan jumlah ayat
- Teks Arab: provider Quran API atau seed lokal yang lisensinya jelas
- Terjemahan Indonesia: provider Quran API atau dataset lokal yang lisensinya jelas
- Audio: bacaan Abdurrahman as-Sudais
- Tafsir: tafsir publik Indonesia dari provider API, dengan label sumber asli
- Strategy provider: buat adapter agar sumber data bisa diganti tanpa mengubah UI

### 2.4 Testing

- Unit test: Vitest
- Component test: React Testing Library
- API/integration test: Vitest + test database
- E2E test: Playwright
- Accessibility test: axe-core atau Playwright accessibility assertions
- Mock API test: MSW
- Type check: TypeScript `tsc --noEmit`
- Lint: ESLint
- Format: Prettier

### 2.5 Quality dan Tooling

- Package manager: pnpm
- Git hooks: Husky + lint-staged
- CI target: GitHub Actions
- Commands standar:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm test:e2e`
  - `pnpm build`

### 2.6 Deployment

- Recommended hosting: Vercel untuk Next.js
- Database: Supabase, Neon, Railway, atau PostgreSQL managed lain
- Environment config:
  - `DATABASE_URL`
  - `QURAN_DATA_PROVIDER`
  - `NEXT_PUBLIC_APP_NAME`

## 3. Arsitektur Aplikasi

### 3.1 Struktur Route

```txt
/
/ayat/[surahId]/[range]
/tafsir/[surahId]/[ayahNumber]
```

Contoh:

```txt
/
/ayat/2/183-188
/tafsir/2/183
```

### 3.2 Struktur Folder Rekomendasi

```txt
src/
  app/
    page.tsx
    ayat/[surahId]/[range]/page.tsx
    tafsir/[surahId]/[ayahNumber]/page.tsx
    api/
      thematic-verses/route.ts
      ayah-details/route.ts
      tafsir/route.ts
  components/
    app-header.tsx
    verse-card.tsx
    ayah-list-item.tsx
    audio-button.tsx
    search-toggle.tsx
    empty-state.tsx
    loading-state.tsx
  features/
    audio/
      audio-player-provider.tsx
      use-audio-player.ts
    quran/
      quran.types.ts
      quran.fixtures.ts
      quran.api.ts
  lib/
    normalize-surah.ts
    parse-ayah-range.ts
    sort-thematic-verses.ts
    validators.ts
  server/
    db.ts
    repositories/
    providers/
    importers/
  tests/
```

### 3.3 Model Data Utama

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

type AyahDetail = {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translationId: string;
  audioUrl: string;
  audioReciter: "Abdurrahman as-Sudais";
};

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

## 4. Fase Implementasi

## Phase 0 - Project Setup dan Quality Gate

Tujuan fase:

- Membuat project Next.js baru.
- Menyiapkan TypeScript, Tailwind CSS, ESLint, Prettier, Vitest, Playwright, dan struktur folder awal.
- Menyiapkan command test standar yang akan dipakai di semua fase.

Scope implementasi:

- Inisialisasi Next.js App Router.
- Konfigurasi Tailwind CSS.
- Konfigurasi path alias.
- Konfigurasi Vitest dan React Testing Library.
- Konfigurasi Playwright.
- Tambahkan layout dasar aplikasi.
- Tambahkan halaman kosong `/` dengan smoke text sementara.

Acceptance criteria:

- Project dapat dijalankan lokal dengan `pnpm dev`.
- Build Next.js berhasil.
- Lint, typecheck, unit test, dan e2e smoke test tersedia.
- Tidak ada error TypeScript.
- Halaman `/` bisa dibuka oleh Playwright.

Test otomatis wajib:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

AI gate:

- Jika salah satu command gagal, AI harus memperbaiki dan menjalankan ulang semua test fase ini.
- Jika semua lulus, AI memberi ringkasan ke user dan berhenti.
- AI menunggu konfirmasi OK dari user sebelum lanjut Phase 1.

## Phase 1 - Front-End Foundation dengan Dummy Data

Tujuan fase:

- Menyiapkan fondasi UI yang polish, profesional, dan responsif.
- Menyiapkan dummy data lengkap untuk 24 card sesuai Excel, sudah diurutkan berdasarkan urutan surat Al Quran.
- Menyiapkan audio player mock agar interaksi bisa dites tanpa backend.

Scope implementasi:

- Buat design tokens warna, spacing, radius, dan typography.
- Pasang font latin dan font Arab.
- Buat dummy data `ThematicVerse`, `AyahDetail`, dan `TafsirDetail`.
- Dummy data harus mencakup 24 entri dari `Ayat Tematik.xlsx`.
- Tambahkan tema singkat untuk setiap entri.
- Buat helper `parseAyahRange`.
- Buat helper `sortThematicVerses` berdasarkan `surahId` lalu `startAyah`.
- Buat komponen reusable:
  - `AppHeader`
  - `VerseCard`
  - `AudioButton`
  - `SearchToggle`
  - `EmptyState`
  - `LoadingState`
- Buat audio player provider versi dummy dengan state `idle`, `loading`, `playing`, dan `error`.

Acceptance criteria:

- Dummy data berisi 24 entri.
- Dummy data sudah punya `surahId`, `theme`, `firstAyahSnippetArabic`, dan metadata audio Sudais.
- Sorting menghasilkan urutan sesuai mushaf Al Quran.
- Komponen dasar tampil rapi di desktop dan mobile.
- Audio button mock bisa berubah status saat diklik.

Test otomatis wajib:

```bash
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm test:e2e
pnpm build
```

Test detail untuk AI:

- Unit test `parseAyahRange` untuk input `183 - 188`, `1-4`, dan input invalid.
- Unit test `sortThematicVerses` memastikan `Al Baqarah` tampil sebelum `Ali Imran`.
- Unit test memastikan 24 dummy thematic verses tersedia.
- Component test `AudioButton` untuk state idle, loading, playing, stop.
- E2E smoke test memastikan halaman `/` tidak blank.

AI gate:

- Jika test gagal, AI harus memperbaiki sampai semua lulus.
- Jika lulus, AI memberi ringkasan hasil Phase 1 ke user dan berhenti.
- AI menunggu konfirmasi OK dari user sebelum lanjut Phase 2.

## Phase 2 - Halaman Daftar Ayat Lengkap dengan Dummy Data

Tujuan fase:

- Membuat halaman pertama secara lengkap sesuai requirement menggunakan dummy data.
- User sudah bisa mengecek tampilan daftar ayat, card, pencarian, dan audio mock.

Scope implementasi:

- Implementasi halaman `/`.
- Tampilkan 24 card dalam grid responsif.
- Card menampilkan:
  - nama surat
  - rentang ayat
  - tema singkat
  - penggalan awal Arab
  - tombol detail
  - tombol dengarkan ayat
- Tambahkan tombol/icon pencarian di kanan atas.
- Search dapat filter berdasarkan surat dan tema.
- Empty state saat hasil pencarian kosong.
- Tombol detail mengarah ke route detail dummy.
- Tombol audio card memutar mock audio seluruh rentang.
- Pastikan daftar tetap sorted berdasarkan nomor surat dan ayat awal.

Acceptance criteria:

- Halaman `/` menampilkan 24 card.
- Card tersusun berdasarkan urutan surat Al Quran dan ayat awal.
- Pencarian `baqarah` menampilkan entri Al Baqarah.
- Pencarian tema yang valid menampilkan hasil sesuai.
- Pencarian yang tidak ada hasil menampilkan empty state.
- Klik detail membuka halaman detail sesuai card.
- Klik audio pada card menampilkan status playing pada card terkait.
- Mobile layout satu kolom.
- Desktop layout dua atau tiga kolom.

Test otomatis wajib:

```bash
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm test:e2e
pnpm build
```

Test detail untuk AI:

- Component test `VerseCard` memastikan semua field card tampil.
- Unit test search filter berdasarkan surat dan tema.
- E2E test:
  - membuka `/`
  - menghitung 24 card
  - mencari `baqarah`
  - mencari query tidak valid dan melihat empty state
  - klik tombol audio dan memverifikasi state playing
  - klik tombol detail dan memverifikasi URL berubah
- Playwright viewport test:
  - mobile 390x844
  - tablet 768x1024
  - desktop 1440x900

AI gate:

- Jika test gagal, AI harus memperbaiki sampai semua lulus.
- Jika lulus, AI memberi screenshot atau deskripsi hasil ke user dan berhenti.
- AI menunggu konfirmasi OK dari user sebelum lanjut Phase 3.

## Phase 3 - Halaman Detail dan Tafsir Lengkap dengan Dummy Data

Tujuan fase:

- Menyelesaikan seluruh front-end pengalaman baca, dengar, dan tafsir dengan dummy data.
- User dapat mengecek halaman detail dan tafsir sebelum backend dibuat.

Scope implementasi:

- Implementasi halaman `/ayat/[surahId]/[range]`.
- Header detail menampilkan:
  - nama surat
  - rentang ayat
  - tema singkat
  - tombol audio untuk seluruh ayat
- Di bawah header, tampilkan list ayat.
- Setiap ayat menampilkan:
  - nomor ayat
  - teks Arab lengkap
  - terjemahan Indonesia
  - tombol tafsir
  - tombol audio ayat tersebut
- Implementasi halaman `/tafsir/[surahId]/[ayahNumber]`.
- Halaman tafsir menampilkan:
  - nama surat
  - nomor ayat
  - teks Arab
  - terjemahan
  - tafsir singkat dummy berlabel sumber
  - label sumber tafsir
- Tambahkan state fallback untuk ayat atau tafsir tidak ditemukan.
- Tambahkan navigasi kembali.

Acceptance criteria:

- Halaman detail menampilkan header sesuai requirement.
- Tombol audio utama di header memutar mock audio seluruh rentang.
- List ayat tampil lengkap untuk range dummy.
- Setiap ayat punya tombol tafsir dan tombol audio.
- Klik tombol tafsir membuka halaman tafsir ayat yang sesuai.
- Halaman tafsir menampilkan label sumber tafsir.
- Navigasi kembali bekerja.
- Tampilan mobile dan desktop tidak overlap.

Test otomatis wajib:

```bash
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm test:e2e
pnpm build
```

Test detail untuk AI:

- Component test `AyahListItem` memastikan Arab, terjemahan, audio, dan tafsir tampil.
- Component test header detail memastikan nama surat, tema, dan tombol audio seluruh ayat tampil.
- E2E test:
  - dari `/`, klik detail salah satu card
  - verifikasi halaman detail terbuka
  - klik audio header dan verifikasi state playing
  - klik audio per ayat dan verifikasi hanya ayat tersebut playing
  - klik tafsir dan verifikasi halaman tafsir terbuka
  - verifikasi label sumber tafsir
  - klik kembali
- Playwright screenshot comparison dasar untuk mobile dan desktop.

AI gate:

- Jika test gagal, AI harus memperbaiki sampai semua lulus.
- Jika lulus, AI memberi ringkasan dan meminta user mengecek front-end dummy.
- AI menunggu konfirmasi OK dari user sebelum lanjut Phase 4.

## Phase 4 - Front-End Polish, Accessibility, dan User Review Gate

Tujuan fase:

- Memastikan front-end dummy data terasa selesai, nyaman, profesional, dan siap ditinjau user.

Scope implementasi:

- Perbaiki visual hierarchy.
- Perbaiki spacing, ukuran font Arab, dan layout card.
- Tambahkan hover, active, loading, disabled, focus state.
- Pastikan semua icon button punya accessible label.
- Pastikan keyboard navigation bekerja.
- Pastikan audio state bisa dipahami tanpa hanya mengandalkan warna.
- Uji responsive layout pada mobile, tablet, dan desktop.
- Pastikan tidak ada teks yang overlap atau keluar container.

Acceptance criteria:

- UI terlihat polish dan profesional.
- Teks Arab jelas dan nyaman dibaca.
- Semua tombol dapat difokuskan dengan keyboard.
- Semua icon button punya accessible label.
- Tidak ada overlap visual pada viewport target.
- User dapat menilai keseluruhan front-end tanpa backend.

Test otomatis wajib:

```bash
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm test:e2e
pnpm build
```

Test detail untuk AI:

- E2E accessibility smoke test untuk halaman `/`, detail, dan tafsir.
- Playwright screenshot mobile, tablet, dan desktop.
- Test keyboard navigation untuk search, detail, audio, tafsir, dan kembali.
- Test tidak ada console error fatal di browser.

AI gate:

- Jika test gagal, AI harus memperbaiki sampai semua lulus.
- Jika lulus, AI memberi URL lokal atau instruksi preview ke user.
- AI wajib berhenti untuk menunggu review visual dan konfirmasi OK dari user.
- AI tidak boleh membuat backend sebelum user memberi OK.

## Phase 5 - Backend Foundation dan Database

Tujuan fase:

- Membuat backend dan database tanpa mengubah pengalaman front-end dummy yang sudah disetujui.

Scope implementasi:

- Setup PostgreSQL local via Docker Compose.
- Setup Prisma schema.
- Model database:
  - `Surah`
  - `ThematicVerse`
  - `Ayah`
  - `Tafsir`
  - `Audio`
- Buat migration awal.
- Buat repository layer.
- Buat health check API.
- Buat API read-only awal:
  - `GET /api/thematic-verses`
  - `GET /api/ayah-details?surahId=...&startAyah=...&endAyah=...`
  - `GET /api/tafsir?surahId=...&ayahNumber=...`
- Validasi query dengan Zod.
- Tambahkan test database dengan seed kecil.

Acceptance criteria:

- Database dapat dibuat dari migration.
- API health check berjalan.
- API list thematic verses mengembalikan format sesuai contract.
- API detail ayat mengembalikan list ayat.
- API tafsir mengembalikan tafsir per ayat.
- API mengembalikan error valid untuk query invalid.
- Front-end dummy tetap berjalan tanpa regressions.

Test otomatis wajib:

```bash
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm test:e2e
pnpm build
```

Test detail untuk AI:

- Unit test Prisma repository dengan test database.
- API test untuk semua endpoint success case.
- API test untuk invalid query.
- Contract test response shape untuk `ThematicVerse`, `AyahDetail`, dan `TafsirDetail`.
- Regression E2E front-end dummy tetap lulus.

AI gate:

- Jika test gagal, AI harus memperbaiki sampai semua lulus.
- Jika lulus, AI melaporkan backend foundation selesai.
- AI menunggu konfirmasi OK dari user sebelum lanjut Phase 6.

## Phase 6 - Import Excel dan Seed Data Quran

Tujuan fase:

- Mengubah `Ayat Tematik.xlsx` menjadi data backend yang valid.
- Menyiapkan data Quran, terjemahan, audio Sudais, dan tafsir publik Indonesia berlabel sumber asli.

Scope implementasi:

- Buat importer Excel menggunakan `exceljs`.
- Parse kolom:
  - `No.`
  - `Nama Surat`
  - `Ayat`
- Buat mapping nama surat Excel ke nomor surat resmi.
- Parse rentang ayat.
- Validasi jumlah ayat terhadap master surat.
- Buat seed tema singkat untuk 24 entri.
- Buat provider adapter API publik Indonesia untuk:
  - teks Arab
  - terjemahan Indonesia
  - audio Abdurrahman as-Sudais
  - tafsir publik Indonesia
- Gunakan EQuran.id API sebagai provider default dan CDN IDNBOGOR sebagai fallback konfigurasi.
- Tidak menggunakan internal knowledge dan tidak melakukan scraping halaman web untuk isi Quran.
- Simpan hasil enrichment ke database dengan metadata sumber data.
- Tambahkan command seed:
  - `pnpm db:migrate`
  - `pnpm db:seed`
  - `pnpm data:import`

Acceptance criteria:

- Import Excel menghasilkan 24 thematic verses.
- Semua nama surat dari Excel berhasil dipetakan ke `surahId`.
- Semua rentang ayat valid.
- Semua data list diurutkan berdasarkan `surahId`, lalu `startAyah`.
- Setiap ayat memiliki teks Arab, terjemahan, audio Sudais, dan tafsir publik Indonesia.
- Sumber terjemahan, audio, dan tafsir dicatat di database serta label tafsir tidak dipaksa menjadi Ibnu Katsir.
- Error import mudah dibaca bila data Excel tidak valid.

Test otomatis wajib:

```bash
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm test:e2e
pnpm build
```

Test detail untuk AI:

- Unit test `parseAyahRange`.
- Unit test `normalizeSurahName`.
- Unit test mapping semua nama surat pada Excel.
- Integration test importer Excel dengan file `Ayat Tematik.xlsx`.
- Integration test seed menghasilkan 24 data.
- Test sorting hasil import.
- Test provider adapter dengan mocked network response.

AI gate:

- Jika test gagal, AI harus memperbaiki sampai semua lulus.
- Jika lulus, AI melaporkan hasil import dan data availability ke user.
- AI menunggu konfirmasi OK dari user sebelum lanjut Phase 7.

## Phase 7 - Integrasi Front-End dengan Backend

Tujuan fase:

- Mengganti dummy data dengan API backend secara bertahap.
- Menjaga UI yang sudah disetujui tetap sama atau lebih baik.

Scope implementasi:

- Tambahkan API client.
- Tambahkan TanStack Query untuk fetch data.
- Hubungkan halaman daftar ke `GET /api/thematic-verses`.
- Hubungkan halaman detail ke `GET /api/ayah-details`.
- Hubungkan halaman tafsir ke `GET /api/tafsir`.
- Ganti audio mock dengan audio URL asli Sudais.
- Tambahkan loading, error, dan empty state berbasis API.
- Pertahankan dummy fixtures hanya untuk test dan fallback development.

Acceptance criteria:

- Halaman daftar mengambil data dari backend.
- Halaman detail mengambil ayat dari backend.
- Halaman tafsir mengambil tafsir dari backend.
- Audio asli Sudais dapat diputar dari card, header detail, dan ayat individual.
- Loading dan error state muncul dengan benar.
- Tidak ada perubahan negatif pada layout front-end yang sudah disetujui.

Test otomatis wajib:

```bash
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm test:e2e
pnpm build
```

Test detail untuk AI:

- MSW test untuk loading, success, empty, dan error state.
- E2E test happy path real API local:
  - buka `/`
  - lihat 24 card
  - cari surat
  - buka detail
  - klik audio header
  - buka tafsir
- E2E test API error fallback.
- Test tidak ada hydration mismatch.
- Test tidak ada console error fatal.

AI gate:

- Jika test gagal, AI harus memperbaiki sampai semua lulus.
- Jika lulus, AI memberi URL preview dan ringkasan integrasi ke user.
- Jika lulus, AI wajib memberikan instruksi cara test manual front-end kepada user.
- AI wajib membuka user gate review setelah Phase 7 dan tidak boleh lanjut Phase 8 sebelum user mengonfirmasi hasil review front-end sudah OK.

## Phase 8 - Production Hardening dan Deployment Preparation

Tujuan fase:

- Menyiapkan aplikasi agar siap deploy dan maintainable.

Scope implementasi:

- Tambahkan environment validation.
- Tambahkan README setup.
- Tambahkan script database setup.
- Tambahkan GitHub Actions CI.
- Tambahkan caching strategy untuk data Quran yang jarang berubah.
- Tambahkan metadata SEO untuk halaman daftar, detail, dan tafsir.
- Optimasi bundle dan image/font loading.
- Siapkan deployment config untuk Vercel.

Acceptance criteria:

- Project bisa disetup dari README.
- CI menjalankan lint, typecheck, test, e2e, dan build.
- Metadata halaman tersedia.
- Environment variable tervalidasi.
- Build production berhasil.

Test otomatis wajib:

```bash
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm test:e2e
pnpm build
```

Test detail untuk AI:

- CI workflow dry-run atau validasi YAML.
- Test environment validation untuk env missing dan env valid.
- Playwright basic performance smoke jika tersedia.
- E2E production build preview.

AI gate:

- Jika test gagal, AI harus memperbaiki sampai semua lulus.
- Jika lulus, AI melaporkan aplikasi siap deploy.
- AI menunggu konfirmasi user untuk deploy atau perubahan tambahan.

## Phase 9 - Audio Gabungan R2

Tujuan fase:

- Mengurangi jeda pada fitur `Dengarkan semua` dengan memakai satu file MP3 gabungan per range ayat tematik.
- Memindahkan streaming audio range ke Cloudflare R2 custom domain agar tidak memakai bandwidth Vercel.

Scope implementasi:

- Gunakan bucket R2 `tahfidzh-mj-audio`.
- Gunakan public base URL `https://audio.mushollamj.com`.
- Credential upload dibaca dari `.env`.
- Tidak memakai `r2.dev` untuk production.
- Tambahkan script lokal untuk:
  - membaca 24 range dari data tematik.
  - mengunduh MP3 Sudais per ayat dari EQuran ke cache lokal.
  - menggabungkan tiap range memakai `ffmpeg`.
  - menghasilkan object key stabil seperti `ranges/baqarah-284-286.mp3`.
  - upload hasil gabungan ke R2 via S3-compatible API secara idempotent.
- Tambahkan metadata `rangeAudioUrl` untuk setiap `ThematicVerse`.
- Ubah tombol `Dengarkan semua` pada card daftar dan header detail agar memakai satu URL gabungan R2.
- Pertahankan tombol `Dengarkan ayat` per ayat memakai audio individual.
- Ubah audio player agar URL `audio.mushollamj.com` diputar langsung, bukan lewat `/api/audio`.
- Tambahkan output/cache audio lokal ke `.gitignore`.

Acceptance criteria:

- Semua 24 ayat tematik memiliki `rangeAudioUrl`.
- Semua `rangeAudioUrl` memakai domain `https://audio.mushollamj.com`.
- Tombol `Dengarkan semua` memakai satu URL audio gabungan, bukan queue URL per ayat.
- Tombol `Dengarkan ayat` tetap memutar audio per ayat.
- URL R2 tidak diproxy lewat `/api/audio`.
- File gabungan berhasil diupload ke R2 dan bisa dibuka langsung dari browser.
- Tidak ada regression pada halaman daftar, detail, tafsir, audio per ayat, dan build production.

Test otomatis wajib:

```bash
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm test:e2e
pnpm build
```

Test detail untuk AI:

- Unit test helper URL audio gabungan dan object key R2.
- Unit test memastikan 24 fixture tematik memiliki `rangeAudioUrl`.
- Component test memastikan `Dengarkan semua` menerima satu URL gabungan R2.
- Unit test audio player memastikan domain R2 diputar langsung dan domain eksternal lain tetap lewat proxy.
- E2E happy path tetap lulus untuk daftar, detail, audio, dan tafsir.
- Manual smoke test membuka minimal satu URL file R2 langsung dan mencoba `Dengarkan semua` untuk range pendek serta panjang.

AI gate:

- Jika test atau upload gagal, AI harus memperbaiki sampai lulus atau melaporkan blocker spesifik.
- Jika semua lulus, AI memberi ringkasan, URL lokal/preview, dan instruksi test manual ke user.

## 5. Checklist Kontrol Kualitas Tiap Fase

Sebelum memberi laporan ke user pada akhir fase, AI wajib memastikan:

- Semua acceptance criteria fase dicentang.
- Semua command test otomatis lulus.
- Tidak ada TypeScript error.
- Tidak ada lint error.
- Tidak ada Playwright failure.
- Tidak ada console error fatal pada halaman yang diuji.
- Tidak ada perubahan scope besar yang tidak diminta.
- Jika ada perubahan visual, AI sudah mengecek desktop dan mobile.

Template laporan akhir fase:

```txt
Phase X selesai.

Yang sudah dibuat:
- ...

Test otomatis:
- pnpm lint: pass
- pnpm typecheck: pass
- pnpm test: pass
- pnpm test:e2e: pass
- pnpm build: pass

Catatan:
- ...

Mohon cek hasilnya. Saya akan lanjut ke Phase X+1 setelah Anda memberi konfirmasi OK.
```

## 6. Urutan Review User

User review paling penting ada pada:

1. Akhir Phase 2: review halaman daftar ayat.
2. Akhir Phase 3: review halaman detail dan tafsir dengan dummy data.
3. Akhir Phase 4: review front-end lengkap sebelum backend.
4. Akhir Phase 7: review aplikasi setelah integrasi backend.
5. Akhir Phase 8: review akhir sebelum deploy.
6. Akhir Phase 9: review audio gabungan R2 setelah upload dan integrasi.

AI tidak boleh melewati review Phase 4 untuk langsung membuat backend, karena requirement meminta front-end lengkap dengan dummy data diperiksa user terlebih dahulu.
