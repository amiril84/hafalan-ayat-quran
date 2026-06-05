import { thematicVerseFixtures } from "@/features/quran/quran.fixtures";
import { sortThematicVerses } from "./sort-thematic-verses";

describe("sortThematicVerses", () => {
  it("sorts by surah order before ayah order", () => {
    const aliImran = thematicVerseFixtures.find((verse) => verse.surahId === 3);
    const baqarah = thematicVerseFixtures.find((verse) => verse.surahId === 2);

    expect(baqarah).toBeDefined();
    expect(aliImran).toBeDefined();

    const sorted = sortThematicVerses([aliImran!, baqarah!]);

    expect(sorted[0].surahName).toBe("Al Baqarah");
    expect(sorted[1].surahName).toBe("Ali Imran");
  });

  it("sorts entries from the same surah by start ayah", () => {
    const baqarahEntries = thematicVerseFixtures.filter(
      (verse) => verse.surahName === "Al Baqarah",
    );

    expect(baqarahEntries.map((verse) => verse.startAyah)).toEqual([
      168, 183, 196, 284,
    ]);
  });
});
