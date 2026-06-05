export type QuranDataProviderName = "equran" | "idnbogor";

export type QuranDataSource = {
  provider: QuranDataProviderName;
  sourceName: string;
  sourceUrl: string;
};

export type QuranProviderAyah = {
  surahId: number;
  surahNameLatin: string;
  ayahNumber: number;
  arabicText: string;
  translationId: string;
  audioUrl: string;
};

export type QuranProviderTafsir = {
  surahId: number;
  surahNameLatin: string;
  ayahNumber: number;
  tafsirText: string;
};

export type QuranProviderSurah = {
  surahId: number;
  surahNameLatin: string;
  surahNameArabic: string;
  ayahCount: number;
  ayahs: QuranProviderAyah[];
};

export type QuranDataProvider = {
  readonly dataSource: QuranDataSource;
  getSurah: (surahId: number) => Promise<QuranProviderSurah>;
  getTafsir: (surahId: number) => Promise<QuranProviderTafsir[]>;
};
