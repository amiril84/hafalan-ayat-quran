import { thematicVerseFixtures } from "@/features/quran/quran.fixtures";
import type {
  AyahDetail,
  TafsirDetail,
  ThematicVerse,
} from "@/features/quran/quran.types";
import { sortThematicVerses } from "@/lib/sort-thematic-verses";
import { createQuranDataProvider } from "@/server/quran-data/equran-provider";
import type {
  QuranDataProvider,
  QuranProviderSurah,
  QuranProviderTafsir,
} from "@/server/quran-data/quran-data-provider";
import type { QuranRepository } from "./quran-repository";

function normalizeProviderSurahName(value: string) {
  return value.replace(/-/g, " ");
}

export class ProviderQuranRepository implements QuranRepository {
  private readonly surahCache = new Map<number, Promise<QuranProviderSurah>>();
  private readonly tafsirCache = new Map<
    number,
    Promise<QuranProviderTafsir[]>
  >();

  constructor(private readonly provider: QuranDataProvider) {}

  async listThematicVerses(): Promise<ThematicVerse[]> {
    return sortThematicVerses(thematicVerseFixtures);
  }

  async getAyahDetails({
    surahId,
    startAyah,
    endAyah,
  }: {
    surahId: number;
    startAyah: number;
    endAyah: number;
  }): Promise<AyahDetail[]> {
    const surah = await this.getSurah(surahId);

    return surah.ayahs
      .filter(
        (ayah) =>
          ayah.ayahNumber >= startAyah && ayah.ayahNumber <= endAyah,
      )
      .map((ayah) => ({
        surahId: ayah.surahId,
        surahName: normalizeProviderSurahName(ayah.surahNameLatin),
        ayahNumber: ayah.ayahNumber,
        arabicText: ayah.arabicText,
        translationId: ayah.translationId,
        audioUrl: ayah.audioUrl,
        audioReciter: "Abdurrahman as-Sudais",
      }));
  }

  async getTafsir({
    surahId,
    ayahNumber,
  }: {
    surahId: number;
    ayahNumber: number;
  }): Promise<TafsirDetail | null> {
    const [surah, tafsirs] = await Promise.all([
      this.getSurah(surahId),
      this.getTafsirs(surahId),
    ]);
    const ayah = surah.ayahs.find((item) => item.ayahNumber === ayahNumber);
    const tafsir = tafsirs.find((item) => item.ayahNumber === ayahNumber);

    if (!ayah || !tafsir) {
      return null;
    }

    return {
      surahId: ayah.surahId,
      surahName: normalizeProviderSurahName(ayah.surahNameLatin),
      ayahNumber: ayah.ayahNumber,
      arabicText: ayah.arabicText,
      translationId: ayah.translationId,
      tafsirText: tafsir.tafsirText,
      tafsirSource: "Tafsir Kemenag RI",
    };
  }

  private getSurah(surahId: number) {
    const cached = this.surahCache.get(surahId);

    if (cached) {
      return cached;
    }

    const request = this.provider.getSurah(surahId);
    this.surahCache.set(surahId, request);

    return request;
  }

  private getTafsirs(surahId: number) {
    const cached = this.tafsirCache.get(surahId);

    if (cached) {
      return cached;
    }

    const request = this.provider.getTafsir(surahId);
    this.tafsirCache.set(surahId, request);

    return request;
  }
}

export const providerQuranRepository = new ProviderQuranRepository(
  createQuranDataProvider(),
);
