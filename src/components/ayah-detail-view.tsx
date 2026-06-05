"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AyahListItem } from "@/components/ayah-list-item";
import { DetailHeader } from "@/components/detail-header";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import {
  fetchAyahDetails,
  fetchThematicVerses,
  quranQueryKeys,
} from "@/features/quran/quran.api";
import {
  findThematicVerse,
  getAyahDetailsForVerse,
  thematicVerseFixtures,
} from "@/features/quran/quran.fixtures";
import { parseAyahRange } from "@/lib/parse-ayah-range";

type AyahDetailViewProps = {
  surahId: number;
  range: string;
};

export function AyahDetailView({ surahId, range }: AyahDetailViewProps) {
  const parsedRange = useMemo(() => {
    try {
      return parseAyahRange(range);
    } catch {
      return null;
    }
  }, [range]);
  const fallbackVerse = parsedRange
    ? findThematicVerse(surahId, range)
    : undefined;
  const {
    data: verses = thematicVerseFixtures,
    isLoading: isVerseLoading,
    isError: isVerseError,
  } = useQuery({
    queryKey: quranQueryKeys.thematicVerses,
    queryFn: fetchThematicVerses,
  });
  const verse = useMemo(
    () =>
      parsedRange
        ? (verses.find(
            (item) =>
              item.surahId === surahId &&
              item.startAyah === parsedRange.startAyah &&
              item.endAyah === parsedRange.endAyah,
          ) ?? fallbackVerse)
        : undefined,
    [fallbackVerse, parsedRange, surahId, verses],
  );
  const {
    data: backendAyahs,
    isLoading: isAyahLoading,
    isError: isAyahError,
    error,
    refetch,
  } = useQuery({
    queryKey: parsedRange
      ? quranQueryKeys.ayahDetails(
          surahId,
          parsedRange.startAyah,
          parsedRange.endAyah,
        )
      : quranQueryKeys.ayahDetails(surahId, 0, 0),
    queryFn: () =>
      fetchAyahDetails({
        surahId,
        startAyah: parsedRange?.startAyah ?? 0,
        endAyah: parsedRange?.endAyah ?? 0,
      }),
    enabled: Boolean(parsedRange),
  });
  const ayahs =
    backendAyahs ?? (isAyahError && verse ? getAyahDetailsForVerse(verse) : []);

  if (!parsedRange || !verse) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-5 py-10 sm:px-8">
        <EmptyState
          title="Ayat belum ditemukan"
          description="Data detail ayat belum berhasil dimuat. Coba kembali ke daftar ayat dan pilih kartu lain."
        />
      </main>
    );
  }

  return (
    <>
      <DetailHeader
        verse={verse}
        audioUrls={ayahs.map((ayah) => ayah.audioUrl)}
      />
      <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8">
        {isVerseLoading || isAyahLoading ? (
          <div className="mb-5">
            <LoadingState label="Mengambil detail ayat dari backend." />
          </div>
        ) : null}

        {isVerseError || isAyahError ? (
          <div className="mb-5">
            <EmptyState
              title="Detail backend belum bisa dimuat"
              description={
                error instanceof Error
                  ? `${error.message} Data fallback development ditampilkan sementara.`
                  : "Data fallback development ditampilkan sementara."
              }
            />
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted"
            >
              Coba lagi
            </button>
          </div>
        ) : null}

        <section aria-label="Daftar ayat detail" className="space-y-5">
          {ayahs.length > 0 ? (
            ayahs.map((ayah) => (
              <AyahListItem key={ayah.ayahNumber} ayah={ayah} />
            ))
          ) : isAyahLoading ? null : (
            <EmptyState
              title="Detail ayat belum tersedia"
              description="Backend belum mengembalikan ayat untuk rentang ini."
            />
          )}
        </section>
      </main>
    </>
  );
}
