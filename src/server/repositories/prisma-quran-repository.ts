import type { PrismaClient } from "@prisma/client";
import type {
  AyahDetail,
  TafsirDetail,
  ThematicVerse,
} from "@/features/quran/quran.types";
import { getRangeAudioUrl } from "@/features/quran/audio-urls";
import type { QuranRepository } from "./quran-repository";

export class PrismaQuranRepository implements QuranRepository {
  constructor(private readonly db: PrismaClient) {}

  async listThematicVerses(): Promise<ThematicVerse[]> {
    const verses = await this.db.thematicVerse.findMany({
      orderBy: [{ surahId: "asc" }, { startAyah: "asc" }],
    });

    return verses.map((verse) => ({
      ...verse,
      rangeAudioUrl: getRangeAudioUrl(verse),
    }));
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
    const ayahs = await this.db.ayah.findMany({
      where: {
        surahId,
        ayahNumber: {
          gte: startAyah,
          lte: endAyah,
        },
      },
      include: {
        audio: true,
      },
      orderBy: {
        ayahNumber: "asc",
      },
    });

    return ayahs.map((ayah) => ({
      surahId: ayah.surahId,
      surahName: ayah.surahName,
      ayahNumber: ayah.ayahNumber,
      arabicText: ayah.arabicText,
      translationId: ayah.translationId,
      audioUrl: ayah.audio?.audioUrl ?? "",
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
    const tafsir = await this.db.tafsir.findFirst({
      where: {
        surahId,
        ayahNumber,
      },
      include: {
        ayah: true,
      },
    });

    if (!tafsir) {
      return null;
    }

    return {
      surahId: tafsir.surahId,
      surahName: tafsir.surahName,
      ayahNumber: tafsir.ayahNumber,
      arabicText: tafsir.ayah.arabicText,
      translationId: tafsir.ayah.translationId,
      tafsirText: tafsir.tafsirText,
      tafsirSource: tafsir.tafsirSource,
    };
  }
}
