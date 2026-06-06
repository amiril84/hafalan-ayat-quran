export type AudioReciter = "Abdurrahman as-Sudais";

export type ThematicVerse = {
  id: string;
  order: number;
  surahId: number;
  surahName: string;
  surahNameNormalized: string;
  startAyah: number;
  endAyah: number;
  theme: string;
  firstAyahSnippetArabic: string;
  rangeAudioUrl: string;
};

export type AyahDetail = {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translationId: string;
  audioUrl: string;
  audioReciter: AudioReciter;
};

export type TafsirDetail = {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translationId: string;
  tafsirText: string;
  tafsirSource: string;
};
