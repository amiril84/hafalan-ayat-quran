import type { QuranDataProvider } from "@/server/quran-data/quran-data-provider";
import { ProviderQuranRepository } from "./provider-quran-repository";

const mockProvider: QuranDataProvider = {
  dataSource: {
    provider: "equran",
    sourceName: "EQuran.id API",
    sourceUrl: "https://equran.id/apidev",
  },
  async getSurah(surahId) {
    return {
      surahId,
      surahNameLatin: "Al-Baqarah",
      surahNameArabic: "البقرة",
      ayahCount: 286,
      ayahs: [
        {
          surahId,
          surahNameLatin: "Al-Baqarah",
          ayahNumber: 168,
          arabicText:
            "يٰٓاَيُّهَا النَّاسُ كُلُوْا مِمَّا فِى الْاَرْضِ حَلٰلًا طَيِّبًا",
          translationId:
            "Wahai manusia, makanlah sebagian makanan di bumi yang halal lagi baik.",
          audioUrl:
            "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/002168.mp3",
        },
      ],
    };
  },
  async getTafsir(surahId) {
    return [
      {
        surahId,
        surahNameLatin: "Al-Baqarah",
        ayahNumber: 168,
        tafsirText:
          "Ayat ini memerintahkan manusia memakan yang halal dan baik.",
      },
    ];
  },
};

describe("ProviderQuranRepository", () => {
  it("returns real provider ayah text, translation, and audio", async () => {
    const repository = new ProviderQuranRepository(mockProvider);

    const ayahs = await repository.getAyahDetails({
      surahId: 2,
      startAyah: 168,
      endAyah: 168,
    });

    expect(ayahs).toEqual([
      {
        surahId: 2,
        surahName: "Al Baqarah",
        ayahNumber: 168,
        arabicText:
          "يٰٓاَيُّهَا النَّاسُ كُلُوْا مِمَّا فِى الْاَرْضِ حَلٰلًا طَيِّبًا",
        translationId:
          "Wahai manusia, makanlah sebagian makanan di bumi yang halal lagi baik.",
        audioUrl:
          "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/002168.mp3",
        audioReciter: "Abdurrahman as-Sudais",
      },
    ]);
  });

  it("returns real provider tafsir instead of dummy tafsir", async () => {
    const repository = new ProviderQuranRepository(mockProvider);

    await expect(
      repository.getTafsir({ surahId: 2, ayahNumber: 168 }),
    ).resolves.toMatchObject({
      surahId: 2,
      surahName: "Al Baqarah",
      ayahNumber: 168,
      translationId:
        "Wahai manusia, makanlah sebagian makanan di bumi yang halal lagi baik.",
      tafsirText:
        "Ayat ini memerintahkan manusia memakan yang halal dan baik.",
      tafsirSource: "Tafsir Kemenag RI",
    });
  });
});
