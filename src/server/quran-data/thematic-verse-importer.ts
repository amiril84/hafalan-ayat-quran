import ExcelJS from "exceljs";
import { parseAyahRange } from "../../lib/parse-ayah-range";
import { sortThematicVerses } from "../../lib/sort-thematic-verses";
import { getRangeAudioUrl } from "../../features/quran/audio-urls";
import type { ThematicVerse } from "../../features/quran/quran.types";
import { normalizeSurahName } from "./normalize-surah-name";

export type ImportedThematicVerse = ThematicVerse;

const excelSurahIdByName = new Map<string, number>([
  ["anfal", 8],
  ["furqan", 25],
  ["fath", 48],
  ["muminun", 23],
  ["ali imran", 3],
  ["jumuah", 62],
  ["munafiqun", 63],
  ["thaha", 20],
  ["baqarah", 2],
  ["hashr", 59],
  ["shaff", 61],
  ["rum", 30],
  ["anam", 6],
  ["isra", 17],
  ["araf", 7],
  ["fussilat", 41],
  ["nisa", 4],
]);

const themeByOrder = new Map<number, string>([
  [1, "Iman dan ketaatan"],
  [2, "Sifat hamba Allah"],
  [3, "Kemenangan risalah"],
  [4, "Ciri mukmin sukses"],
  [5, "Tauhid dan wahyu"],
  [6, "Adab shalat Jumat"],
  [7, "Jangan lalai harta"],
  [8, "Akibat berpaling"],
  [9, "Puasa dan ketakwaan"],
  [10, "Iman dan doa"],
  [11, "Takwa dan asmaul husna"],
  [12, "Barisan dakwah"],
  [13, "Menjauhi riba"],
  [14, "Tafakur penciptaan"],
  [15, "Janji kemenangan"],
  [16, "Musyawarah dan tawakal"],
  [17, "Haji dan zikir"],
  [18, "Ikhlas beribadah"],
  [19, "Shalat dan Quran"],
  [20, "Takwa dan persatuan"],
  [21, "Adab mendengar Quran"],
  [22, "Istiqamah dan dakwah"],
  [23, "Amanah keluarga"],
  [24, "Makanan halal"],
]);

function getCellText(value: ExcelJS.CellValue) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    if ("text" in value && typeof value.text === "string") {
      return value.text.trim();
    }

    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText
        .map((part) => ("text" in part ? part.text : ""))
        .join("")
        .trim();
    }
  }

  return String(value).trim();
}

export function mapExcelSurahNameToId(surahName: string) {
  const normalized = normalizeSurahName(surahName);
  const surahId = excelSurahIdByName.get(normalized);

  if (!surahId) {
    throw new Error(
      `Nama surat "${surahName}" tidak ditemukan dalam mapping import.`,
    );
  }

  return surahId;
}

export async function importThematicVersesFromExcel(
  filePath: string,
): Promise<ImportedThematicVerse[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error("Workbook Excel tidak memiliki worksheet.");
  }

  const rows: ImportedThematicVerse[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    const order = Number(row.getCell(1).value);
    const surahName = getCellText(row.getCell(2).value);
    const rangeText = getCellText(row.getCell(3).value);

    if (!Number.isInteger(order) || !surahName || !rangeText) {
      throw new Error(`Baris ${rowNumber} Excel tidak lengkap.`);
    }

    const surahId = mapExcelSurahNameToId(surahName);
    const { startAyah, endAyah } = parseAyahRange(rangeText);

    const importedVerse = {
      id: `${surahId}-${startAyah}-${endAyah}`,
      order,
      surahId,
      surahName,
      surahNameNormalized: normalizeSurahName(surahName),
      startAyah,
      endAyah,
      theme: themeByOrder.get(order) ?? `Tema ayat ${order}`,
      firstAyahSnippetArabic: "",
    };

    rows.push({
      ...importedVerse,
      rangeAudioUrl: getRangeAudioUrl(importedVerse),
    });
  });

  if (rows.length !== 24) {
    throw new Error(
      `Import Excel harus menghasilkan 24 data, bukan ${rows.length}.`,
    );
  }

  return sortThematicVerses(rows);
}
