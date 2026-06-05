import {
  ayahDetailFixtures,
  findTafsirDetail,
  thematicVerseFixtures,
} from "@/features/quran/quran.fixtures";
import type { QuranRepository } from "./quran-repository";

export const fixtureQuranRepository: QuranRepository = {
  async listThematicVerses() {
    return thematicVerseFixtures;
  },

  async getAyahDetails({ surahId, startAyah, endAyah }) {
    return ayahDetailFixtures
      .filter(
        (ayah) =>
          ayah.surahId === surahId &&
          ayah.ayahNumber >= startAyah &&
          ayah.ayahNumber <= endAyah,
      )
      .sort((a, b) => a.ayahNumber - b.ayahNumber);
  },

  async getTafsir({ surahId, ayahNumber }) {
    return findTafsirDetail(surahId, ayahNumber) ?? null;
  },
};
