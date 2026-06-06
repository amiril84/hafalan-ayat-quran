# Progress Implementasi Aplikasi Hafalan Ayat Tematik

Dokumen ini melacak status implementasi berdasarkan fase di `plan.md`.

Aturan update:

- Setiap fase hanya boleh ditandai selesai setelah semua acceptance criteria fase tersebut terpenuhi dan seluruh test otomatis fase tersebut lulus.
- Setelah satu fase lulus, status fase diubah menjadi `PASSED_WAITING_USER`.
- AI wajib menginformasikan hasil fase kepada user dan menunggu approval `OK` sebelum lanjut ke fase berikutnya.
- Setelah user memberi approval, status fase sebelumnya dapat dicatat sebagai `APPROVED`, lalu fase berikutnya dimulai.

## Ringkasan Status

| Fase    | Nama Fase                                             | Status     | Tanggal Update | Catatan                                                                                                                                                                                                                                  |
| ------- | ----------------------------------------------------- | ---------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 0 | Project Setup dan Quality Gate                        | `APPROVED` | 2026-06-04     | Scaffold Next.js, tooling, smoke page, dan quality gate lulus. Approved user.                                                                                                                                                            |
| Phase 1 | Front-End Foundation dengan Dummy Data                | `APPROVED` | 2026-06-04     | Fondasi front-end, dummy data 24 entri, helper, komponen, audio mock, dan test Phase 1 lulus. Approved user.                                                                                                                             |
| Phase 2 | Halaman Daftar Ayat Lengkap dengan Dummy Data         | `APPROVED` | 2026-06-04     | Halaman daftar lengkap, search, card actions, route detail dummy, dan test Phase 2 lulus. Approved user.                                                                                                                                 |
| Phase 3 | Halaman Detail dan Tafsir Lengkap dengan Dummy Data   | `APPROVED` | 2026-06-04     | Halaman detail, list ayat, audio detail, halaman tafsir, navigasi, dan test Phase 3 lulus. Approved user.                                                                                                                                |
| Phase 4 | Front-End Polish, Accessibility, dan User Review Gate | `APPROVED` | 2026-06-04     | Polish visual hierarchy, focus state, accessibility, keyboard navigation, responsive behavior, label audio berbeda, dan test Phase 4 lulus. Approved user.                                                                               |
| Phase 5 | Backend Foundation dan Database                       | `APPROVED` | 2026-06-04     | Backend foundation, Prisma schema, Docker Compose PostgreSQL config, API read-only, validasi, runtime API check, dan test Phase 5 lulus. Approved user.                                                                                  |
| Phase 6 | Import Excel dan Seed Data Quran                      | `APPROVED` | 2026-06-04     | Import Excel, provider API publik EQuran/IDNBOGOR, seed idempotent, metadata sumber data, dan test Phase 6 lulus. Approved user.                                                                                                         |
| Phase 7 | Integrasi Front-End dengan Backend                    | `APPROVED` | 2026-06-05     | Front-end terhubung ke API backend via TanStack Query, detail/tafsir memakai data Quran publik sungguhan, audio Sudais benar-benar diputar via HTMLAudioElement, loading/error/fallback tersedia, dan test Phase 7 lulus. Approved user. |
| Phase 8 | Production Hardening dan Deployment Preparation       | `APPROVED` | 2026-06-06     | Production hardening, env validation, README, db setup script, CI, API cache headers, metadata SEO, Vercel config, production preview smoke, dan quality gate lulus. User meminta lanjut Phase 9 setelah aplikasi go-live.               |
| Phase 9 | Audio Gabungan R2                                     | `APPROVED` | 2026-06-06     | Audio gabungan 24 range berhasil dibuat, diupload ke R2, UI memakai `rangeAudioUrl`, quality gate lulus, dan hasil test user sudah OK.                                                                                                   |

## Detail Fase

### Phase 0 - Project Setup dan Quality Gate

Status: `APPROVED`

Yang sudah dibuat:

- Project Next.js App Router di root workspace.
- TypeScript, Tailwind CSS, ESLint, Prettier, Vitest, React Testing Library, dan Playwright.
- Layout dasar aplikasi.
- Halaman smoke `/`.
- Unit test smoke untuk halaman utama.
- E2E smoke test untuk membuka halaman utama.

Test otomatis:

| Command                       | Status |
| ----------------------------- | ------ |
| `corepack pnpm lint`          | `PASS` |
| `corepack pnpm typecheck`     | `PASS` |
| `corepack pnpm test -- --run` | `PASS` |
| `corepack pnpm test:e2e`      | `PASS` |
| `corepack pnpm build`         | `PASS` |

Catatan:

- `pnpm` global belum tersedia di PATH Windows karena Corepack tidak bisa membuat shim di `C:\Program Files\nodejs`, jadi command dijalankan dengan `corepack pnpm ...`.
- Browser check lokal berhasil membuka `http://127.0.0.1:3000/`, title `Tahfidzh MJ`, dan heading smoke ditemukan.
- User sudah memberi approval untuk lanjut ke Phase 1.

### Phase 1 - Front-End Foundation dengan Dummy Data

Status: `APPROVED`

Yang sudah dibuat:

- Dummy data 24 entri ayat tematik sesuai Excel, sudah diurutkan berdasarkan `surahId` lalu `startAyah`.
- Tema singkat, `surahId`, `firstAyahSnippetArabic`, dummy `AyahDetail`, dummy `TafsirDetail`, dan metadata audio `Abdurrahman as-Sudais`.
- Helper `parseAyahRange`.
- Helper `sortThematicVerses`.
- Komponen dasar `AppHeader`, `VerseCard`, `AudioButton`, `SearchToggle`, `EmptyState`, dan `LoadingState`.
- `AudioPlayerProvider` versi dummy dengan state `idle`, `loading`, `playing`, dan `error`.
- Halaman `/` menampilkan preview 24 card untuk memvalidasi fondasi UI.

Test otomatis:

| Command                       | Status |
| ----------------------------- | ------ |
| `corepack pnpm lint`          | `PASS` |
| `corepack pnpm typecheck`     | `PASS` |
| `corepack pnpm test -- --run` | `PASS` |
| `corepack pnpm test:e2e`      | `PASS` |
| `corepack pnpm build`         | `PASS` |

Test detail:

- Unit test `parseAyahRange` untuk `183 - 188`, `1-4`, dan input invalid.
- Unit test `sortThematicVerses` memastikan `Al Baqarah` tampil sebelum `Ali Imran`.
- Unit test memastikan 24 dummy thematic verses tersedia.
- Component test `AudioButton` untuk state idle, loading, playing, stop, dan error.
- E2E smoke test memastikan halaman `/` tidak blank dan menampilkan 24 card.

Browser check:

- `http://127.0.0.1:3000/` berhasil dibuka.
- Title `Tahfidzh MJ`.
- Heading utama ditemukan.
- 24 card ditemukan.
- Tombol pencarian ditemukan.

Catatan:

- Command tetap dijalankan dengan `corepack pnpm ...` karena shim `pnpm` global belum tersedia di PATH Windows.
- User sudah memberi approval untuk lanjut ke Phase 2.

### Phase 2 - Halaman Daftar Ayat Lengkap dengan Dummy Data

Status: `APPROVED`

Yang sudah dibuat:

- Halaman `/` menampilkan 24 card dalam grid responsif.
- Card menampilkan nama surat, rentang ayat, tema, penggalan Arab, tombol detail, dan tombol audio.
- Search toggle kanan atas memfilter berdasarkan surat dan tema secara live.
- Empty state muncul saat tidak ada hasil.
- Tombol detail membuka route detail dummy yang stabil.
- Tombol audio card menampilkan status mock playing.
- Route placeholder `/ayat/[surahId]/[range]` tersedia agar URL detail bisa dibuka ulang langsung.
- Normalisasi fixture Arab agar snippet tampil sebagai teks Arab yang benar, bukan mojibake.

Test otomatis:

| Command                       | Status |
| ----------------------------- | ------ |
| `corepack pnpm lint`          | `PASS` |
| `corepack pnpm typecheck`     | `PASS` |
| `corepack pnpm test -- --run` | `PASS` |
| `corepack pnpm test:e2e`      | `PASS` |
| `corepack pnpm build`         | `PASS` |

Test detail:

- Component test `VerseCard` memastikan field dan action tampil.
- Unit test search filter berdasarkan surat dan tema.
- E2E membuka `/` dan menghitung 24 card.
- E2E memastikan urutan awal `Al Baqarah 168 - 173`.
- E2E mencari `baqarah`, mencari tema `puasa`, dan melihat empty state untuk query tidak cocok.
- E2E klik audio card dan memverifikasi status `Sedang diputar`.
- E2E klik detail dan memverifikasi URL `/ayat/2/168-173`.
- Viewport smoke test mobile `390x844`, tablet `768x1024`, dan desktop `1440x900`.

Browser check:

- `http://127.0.0.1:3000/` berhasil dibuka.
- 24 card ditemukan.
- Tombol pencarian ditemukan.
- Snippet Arab pertama terbaca normal: `يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ`.

Catatan:

- Browser plugin sempat timeout saat mencoba klik search melalui CDP, tetapi interaksi search sudah tervalidasi lewat Playwright e2e yang lulus.
- Command tetap dijalankan dengan `corepack pnpm ...` karena shim `pnpm` global belum tersedia di PATH Windows.
- User sudah memberi approval untuk lanjut ke Phase 3.

### Phase 3 - Halaman Detail dan Tafsir Lengkap dengan Dummy Data

Status: `APPROVED`

Yang sudah dibuat:

- Route `/ayat/[surahId]/[range]` menampilkan header detail, tema, audio seluruh rentang, dan list ayat lengkap.
- Setiap ayat menampilkan nomor ayat, teks Arab, terjemahan Indonesia, tombol audio ayat, dan tombol tafsir.
- Route `/tafsir/[surahId]/[ayahNumber]` menampilkan teks Arab, terjemahan, tafsir singkat dummy Ibnu Katsir, dan label sumber.
- Navigasi kembali dari detail ke daftar dan dari tafsir ke detail bekerja.
- Fallback state tersedia untuk data ayat atau tafsir yang tidak ditemukan.
- Komponen `DetailHeader` dan `AyahListItem`.
- Helper data `getAyahDetailsForVerse`, `findAyahDetail`, `findTafsirDetail`, dan `findContainingThematicVerse`.
- Perbaikan normalisasi teks Arab untuk semua dummy `AyahDetail`.

Test otomatis:

| Command                       | Status |
| ----------------------------- | ------ |
| `corepack pnpm lint`          | `PASS` |
| `corepack pnpm typecheck`     | `PASS` |
| `corepack pnpm test -- --run` | `PASS` |
| `corepack pnpm test:e2e`      | `PASS` |
| `corepack pnpm build`         | `PASS` |

Test detail:

- Component test `AyahListItem` memastikan Arab, terjemahan, audio, dan tafsir tampil.
- Component test `DetailHeader` memastikan nama surat, tema, tombol kembali, dan audio seluruh ayat tampil.
- E2E membuka detail dari daftar.
- E2E verifikasi header detail, 6 ayat untuk Al Baqarah 183-188, audio header, audio per ayat, halaman tafsir, label `Tafsir Singkat Ibnu Katsir`, dan tombol kembali.
- Viewport smoke dan screenshot buffer check untuk detail mobile `390x844` dan desktop `1440x900`.

Browser check:

- `http://127.0.0.1:3000/ayat/2/183-188` berhasil dibuka.
- Heading detail ditemukan.
- 6 ayat ditemukan.
- Teks Arab detail terbaca normal.
- `http://127.0.0.1:3000/tafsir/2/183` berhasil dibuka.
- Heading tafsir dan label sumber ditemukan.
- Teks Arab tafsir terbaca normal.

Catatan:

- Command tetap dijalankan dengan `corepack pnpm ...` karena shim `pnpm` global belum tersedia di PATH Windows.
- User sudah memberi approval untuk lanjut ke Phase 4.

### Phase 4 - Front-End Polish, Accessibility, dan User Review Gate

Status: `APPROVED`

Yang sudah dibuat:

- UI dummy data terasa polish, profesional, dan nyaman digunakan untuk membaca.
- Teks Arab jelas, dengan line-height dan ukuran yang stabil.
- Semua tombol penting punya accessible label dan focus state terlihat.
- Keyboard navigation untuk search, detail, audio, tafsir, dan kembali bekerja.
- Tidak ada overlap visual pada viewport mobile, tablet, dan desktop.
- Tidak ada console error fatal di browser.
- Front-end tetap memakai dummy data dan belum masuk backend sebelum approval user.
- Token warna, background, focus ring, dan font stack dirapikan agar lebih tenang dan tidak dominan krem.
- Search input hanya muncul saat terbuka dan otomatis fokus, sehingga tidak masuk keyboard flow saat tertutup.
- Card dan ayah item mendapat `focus-within` state.
- Audio error state mendapat `aria-describedby`.
- Feedback user diterapkan: label tombol audio rentang/card/header menjadi `Dengarkan semua`, sedangkan audio per ayat menjadi `Dengarkan ayat`; state playing juga dibedakan menjadi `Memutar semua` dan `Memutar ayat`.
- Next dev origin warning dari `127.0.0.1` dikurangi lewat `allowedDevOrigins`.
- E2E accessibility smoke menggunakan `@axe-core/playwright`.

Test otomatis:

| Command                       | Status |
| ----------------------------- | ------ |
| `corepack pnpm lint`          | `PASS` |
| `corepack pnpm typecheck`     | `PASS` |
| `corepack pnpm test -- --run` | `PASS` |
| `corepack pnpm test:e2e`      | `PASS` |
| `corepack pnpm build`         | `PASS` |

Test detail:

- Axe accessibility smoke untuk `/`, `/ayat/2/183-188`, dan `/tafsir/2/183`.
- Keyboard navigation untuk search, audio card, detail link, audio detail, tafsir link, dan back link.
- Responsive layout smoke pada mobile `390x844`, tablet `768x1024`, dan desktop `1440x900`.
- Console fatal error check pada halaman daftar, detail, dan tafsir.
- Existing e2e happy path tetap lulus.
- Test komponen dan e2e diperbarui untuk memastikan label audio rentang dan per ayat berbeda.

Browser check:

- `/`, `/ayat/2/183-188`, dan `/tafsir/2/183` berhasil dibuka.
- Heading utama tiap halaman ditemukan.
- Teks Arab valid pada halaman yang memuat ayat.
- Tidak ada console error pada core pages.

Catatan:

- Command tetap dijalankan dengan `corepack pnpm ...` karena shim `pnpm` global belum tersedia di PATH Windows.
- User sudah memberi approval untuk lanjut Phase 5.

### Phase 5 - Backend Foundation dan Database

Status: `APPROVED`

Yang sudah dibuat:

- PostgreSQL local via Docker Compose.
- Prisma schema untuk `Surah`, `ThematicVerse`, `Ayah`, `Tafsir`, dan `Audio`.
- Repository layer read-only.
- API health check.
- API read-only awal:
  - `GET /api/thematic-verses`
  - `GET /api/ayah-details?surahId=...&startAyah=...&endAyah=...`
  - `GET /api/tafsir?surahId=...&ayahNumber=...`
- Validasi query dengan Zod.
- Contract test response shape.
- Front-end dummy tetap berjalan tanpa regressions.
- `.env.example` dengan `DATABASE_URL`.
- Prisma migration SQL awal.
- Prisma client generation script `db:generate`.
- Script `db:migrate` dan `db:studio`.
- Repository fixture untuk API Phase 5 agar backend contract bisa diuji tanpa mengubah front-end dummy.
- Struktur `PrismaQuranRepository` untuk integrasi database pada fase berikutnya.

Test otomatis:

| Command                       | Status |
| ----------------------------- | ------ |
| `corepack pnpm lint`          | `PASS` |
| `corepack pnpm typecheck`     | `PASS` |
| `corepack pnpm test -- --run` | `PASS` |
| `corepack pnpm test:e2e`      | `PASS` |
| `corepack pnpm build`         | `PASS` |

Test detail:

- Unit test validator query API.
- Repository test untuk list ayat tematik, detail ayat, tafsir existing, dan tafsir missing.
- API test `GET /api/health`.
- API contract test `GET /api/thematic-verses`.
- API success dan invalid query test `GET /api/ayah-details`.
- API success, invalid query, dan not found test `GET /api/tafsir`.
- E2E regression front-end dummy tetap lulus.

Validasi backend:

- `corepack pnpm db:generate`: `PASS`.
- `corepack pnpm exec prisma validate` dengan `DATABASE_URL`: `PASS`.
- `corepack pnpm exec prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script`: `PASS`.
- `docker compose config`: `PASS`.
- Runtime API check lokal:
  - `/api/health`: `ok`.
  - `/api/thematic-verses`: 24 data.
  - `/api/ayah-details?surahId=2&startAyah=183&endAyah=188`: 6 data.
  - `/api/tafsir?surahId=2&ayahNumber=183`: sumber `Tafsir Singkat Ibnu Katsir`.
  - invalid ayah query: HTTP 400.

Catatan:

- Docker CLI tersedia, tetapi Docker Desktop engine tidak berjalan saat validasi (`dockerDesktopLinuxEngine` pipe tidak ditemukan), sehingga migration belum dieksekusi ke database live. Schema, migration SQL, dan Docker Compose config sudah tervalidasi.
- Prisma dipin ke versi `6.19.0` karena Prisma 7 membutuhkan Node 20.19+, sementara workspace ini menggunakan Node 20.15.0.
- Command tetap dijalankan dengan `corepack pnpm ...` karena shim `pnpm` global belum tersedia di PATH Windows.
- User sudah memberi approval untuk lanjut Phase 6.

### Phase 6 - Import Excel dan Seed Data Quran

Status: `APPROVED`

Yang sudah dibuat:

- Dependency `exceljs` untuk importer Excel.
- Dependency dev `tsx` untuk menjalankan script TypeScript.
- Importer `Ayat Tematik.xlsx` yang membaca kolom `No.`, `Nama Surat`, dan `Ayat`.
- Normalisasi nama surat dan mapping nama Excel ke `surahId`.
- Validasi rentang ayat dengan helper `parseAyahRange`.
- Provider adapter API publik Indonesia:
  - default `EQuran.id API`.
  - fallback konfigurasi `CDN IDNBOGOR QuranAPI` via `QURAN_DATA_PROVIDER=idnbogor`.
- Parser response provider untuk teks Arab, terjemahan Indonesia, audio per ayat Sudais, dan tafsir publik Indonesia.
- Seed builder yang menghasilkan 24 thematic verses, 17 surah unik, 153 ayat unik, dan 153 tafsir untuk semua range tematik.
- Upsert seed idempotent untuk `Surah`, `ThematicVerse`, `Ayah`, `Audio`, dan `Tafsir`.
- Metadata sumber data di schema:
  - `translationSource`, `translationSourceUrl`, dan `providerMetadata` pada `Ayah`.
  - `audioSource`, `audioSourceUrl`, dan `providerMetadata` pada `Audio`.
  - `tafsirSourceUrl` dan `providerMetadata` pada `Tafsir`.
- Script:
  - `corepack pnpm db:seed`
  - `corepack pnpm data:import`
- Label tafsir tidak lagi dipaksa menjadi `Tafsir Singkat Ibnu Katsir`; fixture/test sekarang memakai `Tafsir Kemenag RI`.
- `plan.md` diperbarui agar Phase 6 mencerminkan keputusan sumber API publik, bukan internal knowledge atau scraping.

Test otomatis:

| Command                       | Status |
| ----------------------------- | ------ |
| `corepack pnpm lint`          | `PASS` |
| `corepack pnpm typecheck`     | `PASS` |
| `corepack pnpm test -- --run` | `PASS` |
| `corepack pnpm test:e2e`      | `PASS` |
| `corepack pnpm build`         | `PASS` |

Test detail:

- Unit test `normalizeSurahName`.
- Unit test mapping nama surat Excel ke `surahId`.
- Integration test importer Excel dengan file `Ayat Tematik.xlsx`.
- Unit test parser provider EQuran untuk surah dan tafsir dengan mocked JSON fixture.
- Seed builder test dengan mocked provider untuk memastikan 24 tema, 17 surah, 153 ayat, 153 tafsir, teks Arab, audio `.mp3`, dan tafsir tersedia.
- API/e2e regression test diperbarui untuk label `Tafsir Kemenag RI`.

Validasi backend:

- `corepack pnpm db:generate`: `PASS`.
- `corepack pnpm exec prisma validate` dengan `DATABASE_URL`: `PASS`.
- `corepack pnpm exec prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script`: `PASS`.
- `docker compose config`: `PASS`.

Catatan:

- Data tidak berasal dari internal knowledge dan tidak melalui scraping halaman web.
- Provider default adalah `EQuran.id API`; fallback manual tersedia melalui `QURAN_DATA_PROVIDER=idnbogor`.
- Audio tidak diunduh ke repo, hanya URL audio publik yang disimpan.
- Docker Desktop engine belum berjalan saat validasi (`dockerDesktopLinuxEngine` pipe tidak ditemukan), sehingga `db:migrate` dan `data:import` belum bisa dieksekusi ke Postgres live dari mesin ini. Implementasi seed dan validasi data sudah diuji dengan mocked provider.
- `corepack pnpm format` masih gagal karena beberapa file lama/pre-existing belum Prettier-clean; file TypeScript baru yang disentuh sudah diformat secara targeted.
- Command tetap dijalankan dengan `corepack pnpm ...` karena shim `pnpm` global belum tersedia di PATH Windows.
- User sudah memberi approval untuk lanjut Phase 7.

### Phase 7 - Integrasi Front-End dengan Backend

Status: `APPROVED`

Yang sudah dibuat:

- Dependency `@tanstack/react-query` untuk data fetching front-end.
- `QuranQueryProvider` ditambahkan ke app providers bersama `AudioPlayerProvider`.
- API client front-end:
  - `fetchThematicVerses()` untuk `GET /api/thematic-verses`.
  - `fetchAyahDetails()` untuk `GET /api/ayah-details`.
  - `fetchTafsir()` untuk `GET /api/tafsir`.
  - query keys stabil untuk React Query.
- Halaman daftar `/` mengambil daftar ayat tematik dari backend API.
- Halaman detail `/ayat/[surahId]/[range]` mengambil thematic verse dan detail ayat dari backend API.
- Halaman tafsir `/tafsir/[surahId]/[ayahNumber]` mengambil tafsir dari backend API dan menampilkan label sumber dinamis.
- Repository backend non-test sekarang mengambil detail ayat dan tafsir dari provider Quran publik, sehingga halaman detail dan tafsir tidak lagi menampilkan teks Arab, terjemahan, atau tafsir dummy saat API berhasil.
- Fallback dummy hanya dipakai saat backend/provider gagal, bukan sebagai data utama.
- Loading state berbasis backend untuk daftar, detail, dan tafsir.
- Loading state detail dirapikan agar empty state tidak tampil sebelum request detail ayat selesai.
- Error state dengan tombol `Coba lagi` dan fallback development agar UI tetap bisa direview saat backend tidak tersedia.
- Card daftar memakai URL audio publik Sudais dari CDN EQuran berdasarkan nomor surat/ayat.
- Fallback fixture audio diubah dari `/mock-audio/...` menjadi URL publik EQuran Sudais.
- Audio player global tidak lagi mock state saja; sekarang membuat `HTMLAudioElement`, memutar URL audio publik, mendukung stop, dan memutar queue ayat berurutan untuk tombol `Dengarkan semua`.
- `AudioButton` mendukung disabled state untuk kebutuhan loading audio di masa depan.
- Provider Quran publik diberi timeout 10 detik agar loading tidak menggantung bila sumber eksternal lambat.
- Feedback user diterapkan: snippet card halaman awal untuk `Ali Imran 1 - 27` dan `Ar Ruum 1 - 10` menambahkan penggalan ayat kedua karena ayat pertama hanya huruf muqatha'ah pendek.
- E2E navigasi SPA distabilkan agar tidak menunggu event `load` pada client-side route transition.
- `plan.md` diperbarui: Phase 7 wajib memberi instruksi test manual dan membuka user gate review sebelum Phase 8.

Test otomatis:

| Command                       | Status |
| ----------------------------- | ------ |
| `corepack pnpm lint`          | `PASS` |
| `corepack pnpm typecheck`     | `PASS` |
| `corepack pnpm test -- --run` | `PASS` |
| `corepack pnpm test:e2e`      | `PASS` |
| `corepack pnpm build`         | `PASS` |

Test detail:

- Component/API-client integration test `ThematicVerseList` untuk loading/success/error/fallback.
- Unit test `AudioButton` memastikan klik memanggil `Audio.play()`, status berubah ke playing, stop memanggil pause, dan URL kosong menampilkan error.
- Test memastikan daftar tetap menampilkan 24 fallback card saat backend gagal.
- Test memastikan tombol retry memanggil ulang endpoint thematic verses.
- E2E membuka `/`, melihat 24 card, search, membuka detail, memainkan audio rentang dan per ayat, membuka tafsir, dan kembali ke detail.
- Smoke check browser memastikan `/ayat/2/168-173` menampilkan teks Arab dan terjemahan asli dari provider, bukan `Terjemahan dummy`.
- Smoke check browser memastikan `/tafsir/2/168` menampilkan tafsir provider berlabel `Tafsir Kemenag RI`, bukan `Tafsir dummy`.
- HTTP smoke check memastikan URL audio Sudais dari API detail tersedia sebagai `audio/mpeg` dengan HTTP 200.
- DOM smoke check halaman awal memastikan card `Ali Imran 1 - 27` dan `Ar Ruum 1 - 10` menampilkan snippet gabungan ayat 1 dan ayat 2.
- E2E accessibility tetap lulus untuk `/`, `/ayat/2/183-188`, dan `/tafsir/2/183`.
- E2E keyboard navigation tetap lulus untuk search, detail, audio, tafsir, dan back.
- Build production berhasil.

Catatan:

- Front-end sekarang melewati API backend. Pada environment non-test, API detail ayat dan tafsir membaca provider Quran publik; pada test, repository tetap memakai fixture agar test tidak tergantung network.
- Integrasi database live tetap menunggu Docker Desktop/Postgres aktif dan konfigurasi repository database pada fase hardening/lanjutan.
- Playwright e2e mem-mock API media browser agar test headless tidak bergantung pada output audio perangkat, sementara aplikasi manual tetap memakai audio asli dari URL publik Sudais.
- Full `corepack pnpm format` masih tidak dijadikan gate karena beberapa file lama/pre-existing belum Prettier-clean; file TypeScript/TSX yang disentuh sudah diformat targeted.
- User sudah menyatakan semua hasil Phase 7 OK dan memberi approval untuk lanjut Phase 8.

### Phase 8 - Production Hardening dan Deployment Preparation

Status: `APPROVED`

Yang sudah dibuat:

- Scope Phase 8 disesuaikan: review lisensi data terjemahan, tafsir, audio, dan acceptance criteria lisensi tidak dijalankan karena user menyatakan sumber open source.
- Environment validation berbasis Zod di `src/lib/env.ts`.
- Script `corepack pnpm validate:env` dan `corepack pnpm validate:env:db`.
- Script `corepack pnpm db:setup` untuk generate Prisma client, migrate, dan seed.
- README setup, database lokal, quality gate, data provider, dan deployment Vercel.
- GitHub Actions CI di `.github/workflows/ci.yml` untuk env validation, lint, typecheck, unit/component/API test, Playwright e2e, dan build.
- API cache headers untuk endpoint Quran:
  - `GET /api/thematic-verses`
  - `GET /api/ayah-details`
  - `GET /api/tafsir`
- Metadata SEO global, halaman daftar, detail ayat, dan tafsir.
- `vercel.json` untuk framework, install command, dan build command.
- Test deployment artifacts untuk menjaga README, Vercel config, package scripts, dan CI workflow.

Test otomatis:

| Command                                                      | Status |
| ------------------------------------------------------------ | ------ |
| `corepack pnpm validate:env`                                 | `PASS` |
| `corepack pnpm validate:env:db` dengan contoh `DATABASE_URL` | `PASS` |
| `corepack pnpm lint`                                         | `PASS` |
| `corepack pnpm typecheck`                                    | `PASS` |
| `corepack pnpm test -- --run`                                | `PASS` |
| `corepack pnpm test:e2e`                                     | `PASS` |
| `corepack pnpm build`                                        | `PASS` |

Test detail:

- Unit test env validation untuk default env, provider invalid, dan database URL required.
- API route test memastikan cache header Quran `public, s-maxage=86400, stale-while-revalidate=604800`.
- Deployment artifacts test memastikan README, `vercel.json`, package scripts, dan GitHub Actions CI memuat command wajib.
- Production preview smoke `http://127.0.0.1:3001`:
  - `/api/health`: HTTP 200.
  - `/`: HTTP 200.
  - `/api/thematic-verses`: cache header benar.
  - `/ayat/2/168-173`: title `Detail ayat 2:168-173 | Tahfidzh MJ`.
  - `/tafsir/2/168`: title `Tafsir ayat 2:168 | Tahfidzh MJ`.

Catatan:

- Production preview lokal masih berjalan di `http://127.0.0.1:3001`.
- `corepack pnpm test:e2e` sempat gagal sekali karena `.next/trace` terkunci oleh preview server lama di port 3001; server dihentikan, `.next` dibersihkan dengan guard path, lalu e2e lulus.
- `validate:env:db` sengaja membutuhkan `DATABASE_URL`; untuk validasi umum tanpa database gunakan `validate:env`.
- User meminta lanjut Phase 9 setelah aplikasi go-live.

### Phase 9 - Audio Gabungan R2

Status: `APPROVED`

Target implementasi:

- Membuat file MP3 gabungan untuk 24 range ayat tematik agar fitur `Dengarkan semua` tidak lagi memutar MP3 per ayat secara berurutan.
- Upload file gabungan ke Cloudflare R2 bucket `tahfidzh-mj-audio`.
- Streaming file gabungan langsung dari `https://audio.mushollamj.com`, bukan lewat bandwidth Vercel.

Konfigurasi:

- Bucket R2: `tahfidzh-mj-audio`.
- Public base URL: `https://audio.mushollamj.com`.
- Credential upload dibaca dari `.env`.
- `r2.dev` tidak dipakai untuk production.

Acceptance criteria:

- Semua 24 thematic verse memiliki `rangeAudioUrl`.
- Semua `rangeAudioUrl` memakai domain `https://audio.mushollamj.com`.
- Tombol `Dengarkan semua` di card dan header detail memakai satu file gabungan.
- Tombol `Dengarkan ayat` tetap memakai audio per ayat.
- URL R2 tidak diproxy melalui `/api/audio`.
- File gabungan berhasil diupload ke R2 dan dapat dibuka langsung.

Test otomatis:

Yang sudah dibuat:

- Script `corepack pnpm audio:build-upload` untuk download audio Sudais per ayat, merge range via `ffmpeg`, dan upload ke R2.
- Helper URL audio gabungan dengan object key stabil seperti `ranges/baqarah-284-286.mp3`.
- Metadata `rangeAudioUrl` untuk 24 thematic verses.
- Tombol `Dengarkan semua` pada card dan detail header memakai satu file gabungan R2.
- Tombol `Dengarkan ayat` tetap memakai audio per ayat.
- Audio player memutar `audio.mushollamj.com` langsung tanpa proxy `/api/audio`.
- `.audio/` masuk `.gitignore`, dan `.env.example` memuat contoh konfigurasi R2.
- Semua 24 file range berhasil diupload ke R2 bucket `tahfidzh-mj-audio`.

Test otomatis:

| Command                       | Status |
| ----------------------------- | ------ |
| `corepack pnpm lint`          | `PASS` |
| `corepack pnpm typecheck`     | `PASS` |
| `corepack pnpm test -- --run` | `PASS` |
| `corepack pnpm test:e2e`      | `PASS` |
| `corepack pnpm build`         | `PASS` |

Test detail:

- Unit test helper object key dan URL R2 audio gabungan.
- Unit test memastikan semua 24 fixture thematic verse punya `rangeAudioUrl` domain `audio.mushollamj.com`.
- Component test memastikan `Dengarkan semua` memakai satu URL R2.
- Unit test audio player memastikan URL R2 diputar langsung dan CDN eksternal lain tetap lewat proxy.
- E2E regression lulus 19 test.
- Build production Next.js berhasil.
- Smoke check URL R2:
  - `https://audio.mushollamj.com/ranges/baqarah-284-286.mp3`: HTTP 200, `audio/mpeg`, `Accept-Ranges: bytes`.
  - `https://audio.mushollamj.com/ranges/ali-imran-1-27.mp3`: HTTP 200, `audio/mpeg`, `Accept-Ranges: bytes`.

Catatan:

- File audio lokal hasil generate berada di `.audio/` dan tidak masuk git.
- `r2.dev` tidak dipakai untuk production.
- User sudah test dan menyatakan hasil Phase 9 OK.
