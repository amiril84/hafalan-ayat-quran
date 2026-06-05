import { ayahDetailFixtures, thematicVerseFixtures } from "./quran.fixtures";

describe("quran fixtures", () => {
  it("contains 24 thematic verses", () => {
    expect(thematicVerseFixtures).toHaveLength(24);
  });

  it("adds theme, snippet, surah id, and Sudais audio metadata", () => {
    for (const verse of thematicVerseFixtures) {
      expect(verse.surahId).toBeGreaterThan(0);
      expect(verse.theme.length).toBeGreaterThan(0);
      expect(verse.firstAyahSnippetArabic.length).toBeGreaterThan(0);
      expect(verse.firstAyahSnippetArabic).toMatch(/[\u0600-\u06ff]/);
    }

    expect(ayahDetailFixtures.length).toBeGreaterThan(24);
    expect(
      ayahDetailFixtures.every(
        (ayah) => ayah.audioReciter === "Abdurrahman as-Sudais",
      ),
    ).toBe(true);
    expect(
      ayahDetailFixtures.every((ayah) => /[\u0600-\u06ff]/.test(ayah.arabicText)),
    ).toBe(true);
  });
});
