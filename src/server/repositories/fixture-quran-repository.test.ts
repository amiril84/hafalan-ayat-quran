import { fixtureQuranRepository } from "./fixture-quran-repository";

describe("fixtureQuranRepository", () => {
  it("returns sorted thematic verses", async () => {
    const verses = await fixtureQuranRepository.listThematicVerses();

    expect(verses).toHaveLength(24);
    expect(verses[0]).toMatchObject({
      surahId: 2,
      startAyah: 168,
      surahName: "Al Baqarah",
    });
  });

  it("returns ayah details for a valid range", async () => {
    const ayahs = await fixtureQuranRepository.getAyahDetails({
      surahId: 2,
      startAyah: 183,
      endAyah: 188,
    });

    expect(ayahs).toHaveLength(6);
    expect(ayahs[0]).toMatchObject({
      surahId: 2,
      ayahNumber: 183,
      audioReciter: "Abdurrahman as-Sudais",
    });
  });

  it("returns tafsir for an existing ayah", async () => {
    const tafsir = await fixtureQuranRepository.getTafsir({
      surahId: 2,
      ayahNumber: 183,
    });

    expect(tafsir).toMatchObject({
      surahId: 2,
      ayahNumber: 183,
      tafsirSource: "Tafsir Kemenag RI",
    });
  });

  it("returns null when tafsir is missing", async () => {
    await expect(
      fixtureQuranRepository.getTafsir({
        surahId: 114,
        ayahNumber: 1,
      }),
    ).resolves.toBeNull();
  });
});
