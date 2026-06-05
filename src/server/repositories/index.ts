import { fixtureQuranRepository } from "./fixture-quran-repository";
import { providerQuranRepository } from "./provider-quran-repository";

export const quranRepository =
  process.env.NODE_ENV === "test"
    ? fixtureQuranRepository
    : providerQuranRepository;
