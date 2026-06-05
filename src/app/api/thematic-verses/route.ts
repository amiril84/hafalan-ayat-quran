import { NextResponse } from "next/server";
import { quranCacheHeaders } from "@/server/cache";
import { quranRepository } from "@/server/repositories";

export async function GET() {
  const data = await quranRepository.listThematicVerses();

  return NextResponse.json({ data }, { headers: quranCacheHeaders });
}
