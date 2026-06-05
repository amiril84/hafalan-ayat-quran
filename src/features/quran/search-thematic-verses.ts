import type { ThematicVerse } from "./quran.types";

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

export function searchThematicVerses(
  verses: readonly ThematicVerse[],
  query: string,
) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return [...verses];
  }

  return verses.filter((verse) => {
    const searchableValues = [
      verse.surahName,
      verse.surahNameNormalized,
      verse.theme,
    ].map(normalizeSearchValue);

    return searchableValues.some((value) => value.includes(normalizedQuery));
  });
}
