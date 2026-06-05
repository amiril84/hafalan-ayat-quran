import { NextResponse, type NextRequest } from "next/server";
import { ayahDetailsQuerySchema } from "@/lib/validators";
import { quranCacheHeaders } from "@/server/cache";
import { quranRepository } from "@/server/repositories";

export async function GET(request: NextRequest) {
  const parsedQuery = ayahDetailsQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        message: "Query ayat tidak valid.",
        issues: parsedQuery.error.issues,
      },
      { status: 400 },
    );
  }

  const data = await quranRepository.getAyahDetails(parsedQuery.data);

  return NextResponse.json({ data }, { headers: quranCacheHeaders });
}
