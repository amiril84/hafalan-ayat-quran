import path from "node:path";
import { importThematicVersesFromExcel } from "./thematic-verse-importer";

describe("importThematicVersesFromExcel", () => {
  it("imports 24 sorted thematic verses from the source workbook", async () => {
    const verses = await importThematicVersesFromExcel(
      path.resolve(process.cwd(), "Ayat Tematik.xlsx"),
    );

    expect(verses).toHaveLength(24);
    expect(verses[0]).toMatchObject({
      id: "2-168-173",
      surahId: 2,
      startAyah: 168,
      endAyah: 173,
      theme: "Makanan halal",
    });
    expect(verses.at(-1)).toMatchObject({
      surahId: 63,
      startAyah: 9,
      endAyah: 11,
    });
    expect(verses.every((verse) => verse.firstAyahSnippetArabic === "")).toBe(
      true,
    );
  });
});
