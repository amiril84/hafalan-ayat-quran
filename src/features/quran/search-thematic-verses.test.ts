import { thematicVerseFixtures } from "./quran.fixtures";
import { searchThematicVerses } from "./search-thematic-verses";

describe("searchThematicVerses", () => {
  it("returns all verses when query is empty", () => {
    expect(searchThematicVerses(thematicVerseFixtures, "")).toHaveLength(24);
  });

  it("filters by surah name case-insensitively", () => {
    const results = searchThematicVerses(thematicVerseFixtures, "BAQARAH");

    expect(results).toHaveLength(4);
    expect(results.every((verse) => verse.surahName === "Al Baqarah")).toBe(
      true,
    );
  });

  it("filters by theme case-insensitively", () => {
    const results = searchThematicVerses(thematicVerseFixtures, "puasa");

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      surahName: "Al Baqarah",
      theme: "Puasa dan ketakwaan",
    });
  });

  it("returns an empty list when no verse matches", () => {
    expect(searchThematicVerses(thematicVerseFixtures, "tidak ada")).toEqual(
      [],
    );
  });
});
