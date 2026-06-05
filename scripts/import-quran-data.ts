import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { createQuranDataProvider } from "../src/server/quran-data/equran-provider";
import { seedQuranData } from "../src/server/quran-data/seed-quran-data";

const db = new PrismaClient();

async function main() {
  const excelPath = path.resolve(process.cwd(), "Ayat Tematik.xlsx");
  const provider = createQuranDataProvider();

  console.log(
    `Import Quran data dari ${provider.dataSource.sourceName} (${provider.dataSource.sourceUrl})`,
  );

  const result = await seedQuranData({
    db,
    excelPath,
    provider,
  });

  console.log(
    `Selesai import: ${result.thematicVerseCount} tema, ${result.ayahCount} ayat, ${result.tafsirCount} tafsir.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
