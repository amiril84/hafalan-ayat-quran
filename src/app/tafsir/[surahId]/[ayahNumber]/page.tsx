import type { Metadata } from "next";
import { TafsirView } from "@/components/tafsir-view";

type TafsirPageProps = {
  params: Promise<{
    surahId: string;
    ayahNumber: string;
  }>;
};

export async function generateMetadata({
  params,
}: TafsirPageProps): Promise<Metadata> {
  const { surahId, ayahNumber } = await params;

  return {
    title: `Tafsir ayat ${surahId}:${ayahNumber}`,
    description: `Tafsir publik, teks Arab, dan terjemahan Indonesia untuk surat ${surahId} ayat ${ayahNumber}.`,
  };
}

export default async function TafsirPage({ params }: TafsirPageProps) {
  const { surahId, ayahNumber } = await params;
  return (
    <TafsirView surahId={Number(surahId)} ayahNumber={Number(ayahNumber)} />
  );
}
