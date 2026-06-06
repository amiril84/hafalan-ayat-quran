import type { ThematicVerse } from "@/features/quran/quran.types";

export function sortThematicVerses<
  T extends Pick<ThematicVerse, "surahId" | "startAyah">,
>(verses: readonly T[]): T[] {
  return [...verses].sort((a, b) => {
    if (a.surahId !== b.surahId) {
      return a.surahId - b.surahId;
    }

    return a.startAyah - b.startAyah;
  });
}
