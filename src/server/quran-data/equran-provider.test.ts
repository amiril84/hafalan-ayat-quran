import surahFixture from "../../../tests/fixtures/equran-surah-2-small.json";
import tafsirFixture from "../../../tests/fixtures/equran-tafsir-2-small.json";
import {
  parseEquranSurahResponse,
  parseEquranTafsirResponse,
} from "./equran-provider";

describe("equran provider parser", () => {
  it("parses Arabic text, Indonesian translation, and Sudais audio", () => {
    const surah = parseEquranSurahResponse(surahFixture);

    expect(surah).toMatchObject({
      surahId: 2,
      surahNameLatin: "Al-Baqarah",
      surahNameArabic: "البقرة",
      ayahCount: 2,
    });
    expect(surah.ayahs[0]).toMatchObject({
      ayahNumber: 1,
      arabicText: expect.stringMatching(/[\u0600-\u06ff]/),
      translationId: "Alif Lam Mim.",
      audioUrl:
        "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/002001.mp3",
    });
  });

  it("parses public tafsir by ayah number", () => {
    const tafsirs = parseEquranTafsirResponse(tafsirFixture);

    expect(tafsirs).toEqual([
      {
        surahId: 2,
        surahNameLatin: "Al-Baqarah",
        ayahNumber: 1,
        tafsirText: "Alif Lam Mim adalah pembuka surat Al-Baqarah.",
      },
      {
        surahId: 2,
        surahNameLatin: "Al-Baqarah",
        ayahNumber: 2,
        tafsirText: "Ayat ini menerangkan bahwa Al-Qur'an tidak diragukan.",
      },
    ]);
  });
});
