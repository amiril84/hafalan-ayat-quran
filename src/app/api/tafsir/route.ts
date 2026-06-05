import { NextResponse, type NextRequest } from "next/server";
import { tafsirQuerySchema } from "@/lib/validators";
import { quranCacheHeaders } from "@/server/cache";
import { quranRepository } from "@/server/repositories";

export async function GET(request: NextRequest) {
  const parsedQuery = tafsirQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        message: "Query tafsir tidak valid.",
        issues: parsedQuery.error.issues,
      },
      { status: 400 },
    );
  }

  const data = await quranRepository.getTafsir(parsedQuery.data);

  if (!data) {
    return NextResponse.json(
      { message: "Tafsir untuk ayat ini belum tersedia.", data: null },
      { status: 404 },
    );
  }

  return NextResponse.json({ data }, { headers: quranCacheHeaders });
}
