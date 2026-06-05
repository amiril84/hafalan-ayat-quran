CREATE TABLE "surahs" (
    "id" INTEGER NOT NULL,
    "nameLatin" TEXT NOT NULL,
    "nameNormalized" TEXT NOT NULL,
    "nameArabic" TEXT,
    "ayahCount" INTEGER NOT NULL,
    CONSTRAINT "surahs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "thematic_verses" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "surahId" INTEGER NOT NULL,
    "surahName" TEXT NOT NULL,
    "surahNameNormalized" TEXT NOT NULL,
    "startAyah" INTEGER NOT NULL,
    "endAyah" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "firstAyahSnippetArabic" TEXT NOT NULL,
    CONSTRAINT "thematic_verses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ayahs" (
    "id" TEXT NOT NULL,
    "surahId" INTEGER NOT NULL,
    "surahName" TEXT NOT NULL,
    "ayahNumber" INTEGER NOT NULL,
    "arabicText" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    CONSTRAINT "ayahs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tafsirs" (
    "id" TEXT NOT NULL,
    "ayahId" TEXT NOT NULL,
    "surahId" INTEGER NOT NULL,
    "surahName" TEXT NOT NULL,
    "ayahNumber" INTEGER NOT NULL,
    "tafsirText" TEXT NOT NULL,
    "tafsirSource" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    CONSTRAINT "tafsirs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "audios" (
    "id" TEXT NOT NULL,
    "ayahId" TEXT NOT NULL,
    "surahId" INTEGER NOT NULL,
    "ayahNumber" INTEGER NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "audioReciter" TEXT NOT NULL,
    CONSTRAINT "audios_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "surahs_nameNormalized_key" ON "surahs"("nameNormalized");
CREATE INDEX "thematic_verses_surahId_startAyah_idx" ON "thematic_verses"("surahId", "startAyah");
CREATE UNIQUE INDEX "ayahs_surahId_ayahNumber_key" ON "ayahs"("surahId", "ayahNumber");
CREATE INDEX "ayahs_surahId_ayahNumber_idx" ON "ayahs"("surahId", "ayahNumber");
CREATE UNIQUE INDEX "tafsirs_ayahId_key" ON "tafsirs"("ayahId");
CREATE INDEX "tafsirs_surahId_ayahNumber_idx" ON "tafsirs"("surahId", "ayahNumber");
CREATE UNIQUE INDEX "audios_ayahId_key" ON "audios"("ayahId");
CREATE INDEX "audios_surahId_ayahNumber_idx" ON "audios"("surahId", "ayahNumber");

ALTER TABLE "thematic_verses" ADD CONSTRAINT "thematic_verses_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "surahs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ayahs" ADD CONSTRAINT "ayahs_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "surahs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tafsirs" ADD CONSTRAINT "tafsirs_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "audios" ADD CONSTRAINT "audios_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
