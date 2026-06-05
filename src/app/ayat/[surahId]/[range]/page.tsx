import type { Metadata } from "next";
import { AyahDetailView } from "@/components/ayah-detail-view";

type DetailPageProps = {
  params: Promise<{
    surahId: string;
    range: string;
  }>;
};

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { surahId, range } = await params;
  const [startAyah, endAyah] = range.split("-");

  return {
    title: `Detail ayat ${surahId}:${startAyah}-${endAyah}`,
    description: `Detail ayat Al Quran surat ${surahId} ayat ${startAyah} sampai ${endAyah}, lengkap dengan teks Arab, terjemahan Indonesia, dan audio.`,
  };
}

export default async function AyatDetailPage({ params }: DetailPageProps) {
  const { surahId, range } = await params;
  return <AyahDetailView surahId={Number(surahId)} range={range} />;
}
