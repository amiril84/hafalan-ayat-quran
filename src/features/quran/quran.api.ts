import type { AyahDetail, TafsirDetail, ThematicVerse } from "./quran.types";

type ApiEnvelope<T> = {
  data: T;
  message?: string;
};

async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(path);
  const body = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok) {
    throw new Error(body.message ?? "Data belum berhasil dimuat.");
  }

  return body.data;
}

export function fetchThematicVerses() {
  return fetchApi<ThematicVerse[]>("/api/thematic-verses");
}

export function fetchAyahDetails({
  surahId,
  startAyah,
  endAyah,
}: {
  surahId: number;
  startAyah: number;
  endAyah: number;
}) {
  const params = new URLSearchParams({
    surahId: String(surahId),
    startAyah: String(startAyah),
    endAyah: String(endAyah),
  });

  return fetchApi<AyahDetail[]>(`/api/ayah-details?${params}`);
}

export function fetchTafsir({
  surahId,
  ayahNumber,
}: {
  surahId: number;
  ayahNumber: number;
}) {
  const params = new URLSearchParams({
    surahId: String(surahId),
    ayahNumber: String(ayahNumber),
  });

  return fetchApi<TafsirDetail>(`/api/tafsir?${params}`);
}

export const quranQueryKeys = {
  thematicVerses: ["quran", "thematic-verses"] as const,
  ayahDetails: (surahId: number, startAyah: number, endAyah: number) =>
    ["quran", "ayah-details", surahId, startAyah, endAyah] as const,
  tafsir: (surahId: number, ayahNumber: number) =>
    ["quran", "tafsir", surahId, ayahNumber] as const,
};
