# Tahfidzh MJ

Aplikasi hafalan ayat tematik Al Quran berbasis Next.js. Aplikasi menampilkan 24 tema ayat, detail ayat Arab, terjemahan Indonesia, tafsir publik, dan audio Abdurrahman as-Sudais.

## Tech Stack

- Next.js App Router
- React dan TypeScript
- Tailwind CSS
- TanStack Query
- Prisma dan PostgreSQL
- Vitest, React Testing Library, Playwright, dan axe-core

## Prasyarat

- Node.js 20.x
- Corepack aktif untuk `pnpm`
- Docker Desktop bila ingin menjalankan PostgreSQL lokal

Aktifkan pnpm:

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```

## Setup Lokal

Install dependency:

```bash
corepack pnpm install
```

Salin environment:

```bash
cp .env.example .env
```

Validasi environment:

```bash
corepack pnpm validate:env
```

Jalankan dev server:

```bash
corepack pnpm dev
```

Buka `http://127.0.0.1:3000`.

## Database Lokal

Jalankan PostgreSQL:

```bash
docker compose up -d
```

Generate Prisma client, migration, dan seed:

```bash
corepack pnpm db:setup
```

Validasi env database saja:

```bash
corepack pnpm validate:env:db
```

Catatan: aplikasi saat ini tetap bisa berjalan dengan provider Quran publik untuk detail ayat dan tafsir bila database lokal belum aktif.

## Data Quran

Data Quran tidak diambil dari internal knowledge dan tidak di-scrape dari halaman web. Provider default adalah EQuran.id API:

```env
QURAN_DATA_PROVIDER="equran"
```

Fallback konfigurasi:

```env
QURAN_DATA_PROVIDER="idnbogor"
```

Audio disimpan sebagai URL publik dan tidak diunduh ke repository.

## Quality Gate

Jalankan sebelum merge/deploy:

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test -- --run
corepack pnpm test:e2e
corepack pnpm build
```

## Deployment Vercel

Environment minimal:

```env
NEXT_PUBLIC_APP_NAME="Tahfidzh MJ"
QURAN_DATA_PROVIDER="equran"
```

Jika deployment memakai database live, tambahkan:

```env
DATABASE_URL="postgresql://..."
```

Build command:

```bash
corepack pnpm build
```

Install command:

```bash
corepack pnpm install --frozen-lockfile
```
