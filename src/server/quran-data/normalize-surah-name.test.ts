import { normalizeSurahName } from "./normalize-surah-name";
import { mapExcelSurahNameToId } from "./thematic-verse-importer";

describe("normalizeSurahName", () => {
  it("normalizes punctuation, articles, and known spelling variants", () => {
    expect(normalizeSurahName("Al-Baqarah")).toBe("baqarah");
    expect(normalizeSurahName("Al Furqon")).toBe("furqan");
    expect(normalizeSurahName("Al Jum'ah")).toBe("jumuah");
    expect(normalizeSurahName("Ar Ruum")).toBe("rum");
  });

  it("maps Excel surah names to official surah ids", () => {
    expect(mapExcelSurahNameToId("Al Baqarah")).toBe(2);
    expect(mapExcelSurahNameToId("Ali Imran")).toBe(3);
    expect(mapExcelSurahNameToId("Al Anfal")).toBe(8);
    expect(mapExcelSurahNameToId("Al Furqon")).toBe(25);
  });
});
