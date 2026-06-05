import type { Prisma, PrismaClient } from "@prisma/client";
import type { ThematicVerse } from "../../features/quran/quran.types";
import type {
  QuranDataProvider,
  QuranProviderAyah,
  QuranProviderSurah,
  QuranProviderTafsir,
} from "./quran-data-provider";
import { importThematicVersesFromExcel } from "./thematic-verse-importer";

type QuranSeedRecords = {
  thematicVerses: ThematicVerse[];
  surahs: QuranProviderSurah[];
  ayahs: QuranProviderAyah[];
  tafsirs: QuranProviderTafsir[];
};

function getAyahKey(surahId: number, ayahNumber: number) {
  return `${surahId}:${ayahNumber}`;
}

function getAyahId(surahId: number, ayahNumber: number) {
  return `${surahId}-${ayahNumber}`;
}

function getTafsirId(surahId: number, ayahNumber: number) {
  return `tafsir-${surahId}-${ayahNumber}`;
}

function getAudioId(surahId: number, ayahNumber: number) {
  return `audio-${surahId}-${ayahNumber}`;
}

export async function buildQuranSeedRecords({
  excelPath,
  provider,
}: {
  excelPath: string;
  provider: QuranDataProvider;
}): Promise<QuranSeedRecords> {
  const importedThematicVerses = await importThematicVersesFromExcel(excelPath);
  const uniqueSurahIds = Array.from(
    new Set(importedThematicVerses.map((verse) => verse.surahId)),
  ).sort((a, b) => a - b);
  const surahs = await Promise.all(
    uniqueSurahIds.map((surahId) => provider.getSurah(surahId)),
  );
  const tafsirGroups = await Promise.all(
    uniqueSurahIds.map((surahId) => provider.getTafsir(surahId)),
  );
  const surahById = new Map(surahs.map((surah) => [surah.surahId, surah]));
  const tafsirByKey = new Map(
    tafsirGroups
      .flat()
      .map((tafsir) => [getAyahKey(tafsir.surahId, tafsir.ayahNumber), tafsir]),
  );
  const ayahByKey = new Map<string, QuranProviderAyah>();
  const tafsirByUsedKey = new Map<string, QuranProviderTafsir>();

  const thematicVerses = importedThematicVerses.map((verse) => {
    const surah = surahById.get(verse.surahId);

    if (!surah) {
      throw new Error(
        `Data surat ${verse.surahId} tidak tersedia dari provider.`,
      );
    }

    if (verse.endAyah > surah.ayahCount) {
      throw new Error(
        `Rentang ${verse.surahName} ${verse.startAyah}-${verse.endAyah} melebihi jumlah ayat ${surah.ayahCount}.`,
      );
    }

    for (
      let ayahNumber = verse.startAyah;
      ayahNumber <= verse.endAyah;
      ayahNumber += 1
    ) {
      const ayah = surah.ayahs.find((item) => item.ayahNumber === ayahNumber);
      const tafsir = tafsirByKey.get(getAyahKey(verse.surahId, ayahNumber));

      if (!ayah) {
        throw new Error(
          `${verse.surahName}:${ayahNumber} tidak ada di provider.`,
        );
      }

      if (!tafsir) {
        throw new Error(`Tafsir ${verse.surahName}:${ayahNumber} tidak ada.`);
      }

      ayahByKey.set(getAyahKey(verse.surahId, ayahNumber), ayah);
      tafsirByUsedKey.set(getAyahKey(verse.surahId, ayahNumber), tafsir);
    }

    const firstAyah = ayahByKey.get(getAyahKey(verse.surahId, verse.startAyah));

    return {
      ...verse,
      surahName: surah.surahNameLatin.replace(/-/g, " "),
      surahNameNormalized: verse.surahNameNormalized,
      firstAyahSnippetArabic: firstAyah?.arabicText ?? "",
    };
  });

  return {
    thematicVerses,
    surahs,
    ayahs: Array.from(ayahByKey.values()).sort((a, b) => {
      if (a.surahId !== b.surahId) {
        return a.surahId - b.surahId;
      }

      return a.ayahNumber - b.ayahNumber;
    }),
    tafsirs: Array.from(tafsirByUsedKey.values()).sort((a, b) => {
      if (a.surahId !== b.surahId) {
        return a.surahId - b.surahId;
      }

      return a.ayahNumber - b.ayahNumber;
    }),
  };
}

export async function upsertQuranSeedRecords({
  db,
  provider,
  records,
}: {
  db: PrismaClient;
  provider: QuranDataProvider;
  records: QuranSeedRecords;
}) {
  const metadata: Prisma.InputJsonObject = {
    provider: provider.dataSource.provider,
    sourceName: provider.dataSource.sourceName,
    sourceUrl: provider.dataSource.sourceUrl,
    importedAt: new Date().toISOString(),
  };

  for (const surah of records.surahs) {
    await db.surah.upsert({
      where: { id: surah.surahId },
      update: {
        nameLatin: surah.surahNameLatin.replace(/-/g, " "),
        nameArabic: surah.surahNameArabic,
        ayahCount: surah.ayahCount,
      },
      create: {
        id: surah.surahId,
        nameLatin: surah.surahNameLatin.replace(/-/g, " "),
        nameNormalized: surah.surahNameLatin.replace(/-/g, " ").toLowerCase(),
        nameArabic: surah.surahNameArabic,
        ayahCount: surah.ayahCount,
      },
    });
  }

  for (const verse of records.thematicVerses) {
    await db.thematicVerse.upsert({
      where: { id: verse.id },
      update: verse,
      create: verse,
    });
  }

  for (const ayah of records.ayahs) {
    await db.ayah.upsert({
      where: {
        surahId_ayahNumber: {
          surahId: ayah.surahId,
          ayahNumber: ayah.ayahNumber,
        },
      },
      update: {
        surahName: ayah.surahNameLatin.replace(/-/g, " "),
        arabicText: ayah.arabicText,
        translationId: ayah.translationId,
        translationSource: "Terjemahan Indonesia EQuran/Kemenag",
        translationSourceUrl: provider.dataSource.sourceUrl,
        providerMetadata: metadata,
      },
      create: {
        id: getAyahId(ayah.surahId, ayah.ayahNumber),
        surahId: ayah.surahId,
        surahName: ayah.surahNameLatin.replace(/-/g, " "),
        ayahNumber: ayah.ayahNumber,
        arabicText: ayah.arabicText,
        translationId: ayah.translationId,
        translationSource: "Terjemahan Indonesia EQuran/Kemenag",
        translationSourceUrl: provider.dataSource.sourceUrl,
        providerMetadata: metadata,
      },
    });

    await db.audio.upsert({
      where: { ayahId: getAyahId(ayah.surahId, ayah.ayahNumber) },
      update: {
        audioUrl: ayah.audioUrl,
        audioReciter: "Abdurrahman as-Sudais",
        audioSource: provider.dataSource.sourceName,
        audioSourceUrl: provider.dataSource.sourceUrl,
        providerMetadata: metadata,
      },
      create: {
        id: getAudioId(ayah.surahId, ayah.ayahNumber),
        ayahId: getAyahId(ayah.surahId, ayah.ayahNumber),
        surahId: ayah.surahId,
        ayahNumber: ayah.ayahNumber,
        audioUrl: ayah.audioUrl,
        audioReciter: "Abdurrahman as-Sudais",
        audioSource: provider.dataSource.sourceName,
        audioSourceUrl: provider.dataSource.sourceUrl,
        providerMetadata: metadata,
      },
    });
  }

  for (const tafsir of records.tafsirs) {
    await db.tafsir.upsert({
      where: { ayahId: getAyahId(tafsir.surahId, tafsir.ayahNumber) },
      update: {
        surahName: tafsir.surahNameLatin.replace(/-/g, " "),
        tafsirText: tafsir.tafsirText,
        tafsirSource: "Tafsir Kemenag RI",
        tafsirSourceUrl: provider.dataSource.sourceUrl,
        language: "id",
        providerMetadata: metadata,
      },
      create: {
        id: getTafsirId(tafsir.surahId, tafsir.ayahNumber),
        ayahId: getAyahId(tafsir.surahId, tafsir.ayahNumber),
        surahId: tafsir.surahId,
        surahName: tafsir.surahNameLatin.replace(/-/g, " "),
        ayahNumber: tafsir.ayahNumber,
        tafsirText: tafsir.tafsirText,
        tafsirSource: "Tafsir Kemenag RI",
        tafsirSourceUrl: provider.dataSource.sourceUrl,
        language: "id",
        providerMetadata: metadata,
      },
    });
  }

  return {
    thematicVerseCount: records.thematicVerses.length,
    ayahCount: records.ayahs.length,
    tafsirCount: records.tafsirs.length,
  };
}

export async function seedQuranData({
  db,
  excelPath,
  provider,
}: {
  db: PrismaClient;
  excelPath: string;
  provider: QuranDataProvider;
}) {
  const records = await buildQuranSeedRecords({ excelPath, provider });

  return upsertQuranSeedRecords({ db, provider, records });
}
