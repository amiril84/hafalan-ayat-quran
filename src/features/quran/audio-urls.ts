import type { ThematicVerse } from "./quran.types";

export const defaultRangeAudioBaseUrl = "https://audio.mushollamj.com";

const articlePrefixes = ["al ", "an ", "as ", "ar "];

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getRangeAudioBaseUrl() {
  return trimTrailingSlash(
    process.env.NEXT_PUBLIC_R2_AUDIO_BASE_URL ?? defaultRangeAudioBaseUrl,
  );
}

export function getSudaisAudioUrl(surahId: number, ayahNumber: number) {
  return `https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/${String(
    surahId,
  ).padStart(3, "0")}${String(ayahNumber).padStart(3, "0")}.mp3`;
}

export function createRangeAudioSlug(
  verse: Pick<ThematicVerse, "surahNameNormalized">,
) {
  const withoutArticle = articlePrefixes.find((prefix) =>
    verse.surahNameNormalized.startsWith(prefix),
  )
    ? verse.surahNameNormalized.replace(/^(al|an|as|ar)\s+/, "")
    : verse.surahNameNormalized;

  return withoutArticle
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getRangeAudioObjectKey(
  verse: Pick<ThematicVerse, "surahNameNormalized" | "startAyah" | "endAyah">,
) {
  return `ranges/${createRangeAudioSlug(verse)}-${verse.startAyah}-${verse.endAyah}.mp3`;
}

export function getRangeAudioUrl(
  verse: Pick<ThematicVerse, "surahNameNormalized" | "startAyah" | "endAyah">,
  baseUrl = getRangeAudioBaseUrl(),
) {
  return `${trimTrailingSlash(baseUrl)}/${getRangeAudioObjectKey(verse)}`;
}
