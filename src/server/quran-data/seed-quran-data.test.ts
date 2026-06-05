import path from "node:path";
import type {
  QuranDataProvider,
  QuranProviderSurah,
  QuranProviderTafsir,
} from "./quran-data-provider";
import { buildQuranSeedRecords } from "./seed-quran-data";

const ayahCountsBySurahId = new Map<number, number>([
  [2, 286],
  [3, 200],
  [4, 176],
  [6, 165],
  [7, 206],
  [8, 75],
  [17, 111],
  [20, 135],
  [23, 118],
  [25, 77],
  [30, 60],
  [41, 54],
  [48, 29],
  [59, 24],
  [61, 14],
  [62, 11],
  [63, 11],
]);

function createMockSurah(surahId: number): QuranProviderSurah {
  const ayahCount = ayahCountsBySurahId.get(surahId);

  if (!ayahCount) {
    throw new Error(`Unexpected surah ${surahId}`);
  }

  return {
    surahId,
    surahNameLatin: `Surah-${surahId}`,
    surahNameArabic: "سورة",
    ayahCount,
    ayahs: Array.from({ length: ayahCount }, (_, index) => {
      const ayahNumber = index + 1;

      return {
        surahId,
        surahNameLatin: `Surah-${surahId}`,
        ayahNumber,
        arabicText: `نص ${surahId}:${ayahNumber}`,
        translationId: `Terjemahan ${surahId}:${ayahNumber}`,
        audioUrl: `https://cdn.example.test/audio/${surahId}-${ayahNumber}.mp3`,
      };
    }),
  };
}

function createMockTafsir(surah: QuranProviderSurah): QuranProviderTafsir[] {
  return surah.ayahs.map((ayah) => ({
    surahId: ayah.surahId,
    surahNameLatin: ayah.surahNameLatin,
    ayahNumber: ayah.ayahNumber,
    tafsirText: `Tafsir ${ayah.surahId}:${ayah.ayahNumber}`,
  }));
}

describe("buildQuranSeedRecords", () => {
  it("builds complete seed records for all thematic ranges", async () => {
    const provider: QuranDataProvider = {
      dataSource: {
        provider: "equran",
        sourceName: "EQuran.id API",
        sourceUrl: "https://equran.id/apidev",
      },
      async getSurah(surahId) {
        return createMockSurah(surahId);
      },
      async getTafsir(surahId) {
        return createMockTafsir(createMockSurah(surahId));
      },
    };

    const records = await buildQuranSeedRecords({
      excelPath: path.resolve(process.cwd(), "Ayat Tematik.xlsx"),
      provider,
    });

    expect(records.thematicVerses).toHaveLength(24);
    expect(records.surahs).toHaveLength(17);
    expect(records.ayahs).toHaveLength(153);
    expect(records.tafsirs).toHaveLength(153);
    expect(
      records.ayahs.every((ayah) => /[\u0600-\u06ff]/.test(ayah.arabicText)),
    ).toBe(true);
    expect(records.ayahs.every((ayah) => ayah.audioUrl.endsWith(".mp3"))).toBe(
      true,
    );
    expect(
      records.tafsirs.every((tafsir) => tafsir.tafsirText.length > 0),
    ).toBe(true);
  });
});
