import { sortThematicVerses } from "@/lib/sort-thematic-verses";
import type { AyahDetail, TafsirDetail, ThematicVerse } from "./quran.types";

const audioReciter = "Abdurrahman as-Sudais" as const;
const tafsirSource = "Tafsir Kemenag RI" as const;

const windows1252SpecialBytes = new Map<number, number>([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

function repairArabicText(value: string) {
  if (/[\u0600-\u06ff]/.test(value) || !/[ØÙ]/.test(value)) {
    return value;
  }

  const bytes = Uint8Array.from(
    Array.from(value).map((character) => {
      const codePoint = character.codePointAt(0) ?? 0x3f;

      if (codePoint <= 0xff) {
        return codePoint;
      }

      return windows1252SpecialBytes.get(codePoint) ?? 0x3f;
    }),
  );

  return new TextDecoder().decode(bytes);
}

const rawThematicVerseFixtures: ThematicVerse[] = [
  {
    id: "8-1-4",
    order: 1,
    surahId: 8,
    surahName: "Al Anfal",
    surahNameNormalized: "al anfal",
    startAyah: 1,
    endAyah: 4,
    theme: "Iman dan ketaatan",
    firstAyahSnippetArabic: "يَسْأَلُونَكَ عَنِ الْأَنْفَالِ",
  },
  {
    id: "25-63-70",
    order: 2,
    surahId: 25,
    surahName: "Al Furqon",
    surahNameNormalized: "al furqon",
    startAyah: 63,
    endAyah: 70,
    theme: "Sifat hamba Allah",
    firstAyahSnippetArabic: "وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ",
  },
  {
    id: "48-28-29",
    order: 3,
    surahId: 48,
    surahName: "Al Fath",
    surahNameNormalized: "al fath",
    startAyah: 28,
    endAyah: 29,
    theme: "Kemenangan risalah",
    firstAyahSnippetArabic: "هُوَ الَّذِي أَرْسَلَ رَسُولَهُ",
  },
  {
    id: "23-1-11",
    order: 4,
    surahId: 23,
    surahName: "Al Mukminun",
    surahNameNormalized: "al mukminun",
    startAyah: 1,
    endAyah: 11,
    theme: "Ciri mukmin sukses",
    firstAyahSnippetArabic: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ",
  },
  {
    id: "3-1-27",
    order: 5,
    surahId: 3,
    surahName: "Ali Imran",
    surahNameNormalized: "ali imran",
    startAyah: 1,
    endAyah: 27,
    theme: "Tauhid dan wahyu",
    firstAyahSnippetArabic:
      "الۤمّۤ اَللّٰهُ لَآ اِلٰهَ اِلَّا هُوَ الْحَيُّ الْقَيُّوْمُۗ",
  },
  {
    id: "62-9-11",
    order: 6,
    surahId: 62,
    surahName: "Al Jum'ah",
    surahNameNormalized: "al jumah",
    startAyah: 9,
    endAyah: 11,
    theme: "Adab shalat Jumat",
    firstAyahSnippetArabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ",
  },
  {
    id: "63-9-11",
    order: 7,
    surahId: 63,
    surahName: "Al Munafiqun",
    surahNameNormalized: "al munafiqun",
    startAyah: 9,
    endAyah: 11,
    theme: "Jangan lalai harta",
    firstAyahSnippetArabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تُلْهِكُمْ",
  },
  {
    id: "20-124-127",
    order: 8,
    surahId: 20,
    surahName: "Thaha",
    surahNameNormalized: "thaha",
    startAyah: 124,
    endAyah: 127,
    theme: "Akibat berpaling",
    firstAyahSnippetArabic: "وَمَنْ أَعْرَضَ عَنْ ذِكْرِي",
  },
  {
    id: "2-183-188",
    order: 9,
    surahId: 2,
    surahName: "Al Baqarah",
    surahNameNormalized: "al baqarah",
    startAyah: 183,
    endAyah: 188,
    theme: "Puasa dan ketakwaan",
    firstAyahSnippetArabic:
      "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ",
  },
  {
    id: "2-284-286",
    order: 10,
    surahId: 2,
    surahName: "Al Baqarah",
    surahNameNormalized: "al baqarah",
    startAyah: 284,
    endAyah: 286,
    theme: "Iman dan doa",
    firstAyahSnippetArabic: "لِلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
  },
  {
    id: "59-18-24",
    order: 11,
    surahId: 59,
    surahName: "Al Hasyr",
    surahNameNormalized: "al hasyr",
    startAyah: 18,
    endAyah: 24,
    theme: "Takwa dan asmaul husna",
    firstAyahSnippetArabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ",
  },
  {
    id: "61-1-6",
    order: 12,
    surahId: 61,
    surahName: "As Shaff",
    surahNameNormalized: "as shaff",
    startAyah: 1,
    endAyah: 6,
    theme: "Barisan dakwah",
    firstAyahSnippetArabic: "سَبَّحَ لِلَّهِ مَا فِي السَّمَاوَاتِ",
  },
  {
    id: "3-130-136",
    order: 13,
    surahId: 3,
    surahName: "Ali Imran",
    surahNameNormalized: "ali imran",
    startAyah: 130,
    endAyah: 136,
    theme: "Menjauhi riba",
    firstAyahSnippetArabic:
      "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا الرِّبَا",
  },
  {
    id: "3-190-194",
    order: 14,
    surahId: 3,
    surahName: "Ali Imran",
    surahNameNormalized: "ali imran",
    startAyah: 190,
    endAyah: 194,
    theme: "Tafakur penciptaan",
    firstAyahSnippetArabic: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ",
  },
  {
    id: "30-1-10",
    order: 15,
    surahId: 30,
    surahName: "Ar Ruum",
    surahNameNormalized: "ar ruum",
    startAyah: 1,
    endAyah: 10,
    theme: "Janji kemenangan",
    firstAyahSnippetArabic: "الۤمّۤ ۚ غُلِبَتِ الرُّوْمُۙ",
  },
  {
    id: "3-159-163",
    order: 16,
    surahId: 3,
    surahName: "Ali Imran",
    surahNameNormalized: "ali imran",
    startAyah: 159,
    endAyah: 163,
    theme: "Musyawarah dan tawakal",
    firstAyahSnippetArabic: "فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ",
  },
  {
    id: "2-196-203",
    order: 17,
    surahId: 2,
    surahName: "Al Baqarah",
    surahNameNormalized: "al baqarah",
    startAyah: 196,
    endAyah: 203,
    theme: "Haji dan zikir",
    firstAyahSnippetArabic: "وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ",
  },
  {
    id: "6-160-163",
    order: 18,
    surahId: 6,
    surahName: "Al An'am",
    surahNameNormalized: "al anam",
    startAyah: 160,
    endAyah: 163,
    theme: "Ikhlas beribadah",
    firstAyahSnippetArabic: "مَن جَاءَ بِالْحَسَنَةِ فَلَهُ عَشْرُ",
  },
  {
    id: "17-78-85",
    order: 19,
    surahId: 17,
    surahName: "Al Isra'",
    surahNameNormalized: "al isra",
    startAyah: 78,
    endAyah: 85,
    theme: "Shalat dan Quran",
    firstAyahSnippetArabic: "أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ",
  },
  {
    id: "3-102-104",
    order: 20,
    surahId: 3,
    surahName: "Ali Imran",
    surahNameNormalized: "ali imran",
    startAyah: 102,
    endAyah: 104,
    theme: "Takwa dan persatuan",
    firstAyahSnippetArabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ",
  },
  {
    id: "7-204-206",
    order: 21,
    surahId: 7,
    surahName: "Al A'raf",
    surahNameNormalized: "al araf",
    startAyah: 204,
    endAyah: 206,
    theme: "Adab mendengar Quran",
    firstAyahSnippetArabic: "وَإِذَا قُرِئَ الْقُرْآنُ فَاسْتَمِعُوا",
  },
  {
    id: "41-30-35",
    order: 22,
    surahId: 41,
    surahName: "Fussilat",
    surahNameNormalized: "fussilat",
    startAyah: 30,
    endAyah: 35,
    theme: "Istiqamah dan dakwah",
    firstAyahSnippetArabic: "إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ",
  },
  {
    id: "4-9-12",
    order: 23,
    surahId: 4,
    surahName: "An Nisa",
    surahNameNormalized: "an nisa",
    startAyah: 9,
    endAyah: 12,
    theme: "Amanah keluarga",
    firstAyahSnippetArabic: "وَلْيَخْشَ الَّذِينَ لَوْ تَرَكُوا",
  },
  {
    id: "2-168-173",
    order: 24,
    surahId: 2,
    surahName: "Al Baqarah",
    surahNameNormalized: "al baqarah",
    startAyah: 168,
    endAyah: 173,
    theme: "Makanan halal",
    firstAyahSnippetArabic: "يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ",
  },
];

export const thematicVerseFixtures: ThematicVerse[] = sortThematicVerses(
  rawThematicVerseFixtures,
).map((verse) => ({
  ...verse,
  firstAyahSnippetArabic: repairArabicText(verse.firstAyahSnippetArabic),
}));

function createAudioUrl(surahId: number, ayahNumber: number) {
  return `https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/${String(
    surahId,
  ).padStart(3, "0")}${String(ayahNumber).padStart(3, "0")}.mp3`;
}

const rawAyahDetailFixtures: AyahDetail[] = thematicVerseFixtures.flatMap(
  (verse) =>
    Array.from(
      { length: verse.endAyah - verse.startAyah + 1 },
      (_, index): AyahDetail => {
        const ayahNumber = verse.startAyah + index;

        return {
          surahId: verse.surahId,
          surahName: verse.surahName,
          ayahNumber,
          arabicText:
            index === 0
              ? verse.firstAyahSnippetArabic
              : `آيَةٌ تَدْرِيبِيَّةٌ لِسُورَةِ ${verse.surahName} رَقْمُ ${ayahNumber}`,
          translationId: `Terjemahan dummy ${verse.surahName} ayat ${ayahNumber} untuk fondasi tampilan hafalan.`,
          audioUrl: createAudioUrl(verse.surahId, ayahNumber),
          audioReciter,
        };
      },
    ),
);

export const ayahDetailFixtures: AyahDetail[] = rawAyahDetailFixtures.map(
  (ayah) => ({
    ...ayah,
    arabicText: repairArabicText(ayah.arabicText),
  }),
);

export function getAudioUrlsForVerse(verse: ThematicVerse) {
  return getAyahDetailsForVerse(verse).map((ayah) => ayah.audioUrl);
}

export function getAyahDetailsForVerse(verse: ThematicVerse) {
  return ayahDetailFixtures
    .filter(
      (ayah) =>
        ayah.surahId === verse.surahId &&
        ayah.ayahNumber >= verse.startAyah &&
        ayah.ayahNumber <= verse.endAyah,
    )
    .sort((a, b) => a.ayahNumber - b.ayahNumber);
}

export function findThematicVerse(surahId: number, range: string) {
  const [startAyah, endAyah] = range.split("-").map(Number);

  return thematicVerseFixtures.find(
    (verse) =>
      verse.surahId === surahId &&
      verse.startAyah === startAyah &&
      verse.endAyah === endAyah,
  );
}

export function findAyahDetail(surahId: number, ayahNumber: number) {
  return ayahDetailFixtures.find(
    (ayah) => ayah.surahId === surahId && ayah.ayahNumber === ayahNumber,
  );
}

export const tafsirDetailFixtures: TafsirDetail[] = ayahDetailFixtures.map(
  (ayah) => ({
    surahId: ayah.surahId,
    surahName: ayah.surahName,
    ayahNumber: ayah.ayahNumber,
    arabicText: ayah.arabicText,
    translationId: ayah.translationId,
    tafsirText:
      "Tafsir dummy ringkas untuk memvalidasi struktur tampilan sebelum sumber tafsir asli diintegrasikan.",
    tafsirSource,
  }),
);

export function findTafsirDetail(surahId: number, ayahNumber: number) {
  return tafsirDetailFixtures.find(
    (tafsir) => tafsir.surahId === surahId && tafsir.ayahNumber === ayahNumber,
  );
}

export function findContainingThematicVerse(
  surahId: number,
  ayahNumber: number,
) {
  return thematicVerseFixtures.find(
    (verse) =>
      verse.surahId === surahId &&
      ayahNumber >= verse.startAyah &&
      ayahNumber <= verse.endAyah,
  );
}
