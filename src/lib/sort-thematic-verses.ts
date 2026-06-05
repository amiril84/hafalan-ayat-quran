import type { ThematicVerse } from "@/features/quran/quran.types";

export function sortThematicVerses(
  verses: readonly ThematicVerse[],
): ThematicVerse[] {
  return [...verses].sort((a, b) => {
    if (a.surahId !== b.surahId) {
      return a.surahId - b.surahId;
    }

    return a.startAyah - b.startAyah;
  });
}
