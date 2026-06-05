import type {
  AyahDetail,
  TafsirDetail,
  ThematicVerse,
} from "@/features/quran/quran.types";

export type QuranRepository = {
  listThematicVerses: () => Promise<ThematicVerse[]>;
  getAyahDetails: (query: {
    surahId: number;
    startAyah: number;
    endAyah: number;
  }) => Promise<AyahDetail[]>;
  getTafsir: (query: {
    surahId: number;
    ayahNumber: number;
  }) => Promise<TafsirDetail | null>;
};
