"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import {
  fetchTafsir,
  fetchThematicVerses,
  quranQueryKeys,
} from "@/features/quran/quran.api";
import {
  findContainingThematicVerse,
  findTafsirDetail,
  thematicVerseFixtures,
} from "@/features/quran/quran.fixtures";

type TafsirViewProps = {
  surahId: number;
  ayahNumber: number;
};

export function TafsirView({ surahId, ayahNumber }: TafsirViewProps) {
  const fallbackTafsir = findTafsirDetail(surahId, ayahNumber);
  const { data: verses = thematicVerseFixtures, isLoading: isVerseLoading } =
    useQuery({
      queryKey: quranQueryKeys.thematicVerses,
      queryFn: fetchThematicVerses,
    });
  const {
    data: backendTafsir,
    isLoading: isTafsirLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: quranQueryKeys.tafsir(surahId, ayahNumber),
    queryFn: () => fetchTafsir({ surahId, ayahNumber }),
  });
  const tafsir = backendTafsir ?? (isError ? fallbackTafsir : undefined);
  const containingVerse =
    verses.find(
      (verse) =>
        verse.surahId === surahId &&
        ayahNumber >= verse.startAyah &&
        ayahNumber <= verse.endAyah,
    ) ?? findContainingThematicVerse(surahId, ayahNumber);
  const detailHref = containingVerse
    ? `/ayat/${containingVerse.surahId}/${containingVerse.startAyah}-${containingVerse.endAyah}`
    : "/";

  if (!tafsir && !isTafsirLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-5 py-10 sm:px-8">
        <Link
          href={detailHref}
          className="mb-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali
        </Link>
        <EmptyState
          title="Tafsir belum tersedia"
          description="Tafsir untuk ayat ini belum tersedia. Teks Arab dan terjemahan akan tetap ditampilkan bila data sudah ada."
        />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8">
      <Link
        href={detailHref}
        className="mb-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke detail
      </Link>

      {isVerseLoading || isTafsirLoading ? (
        <div className="mb-5">
          <LoadingState label="Mengambil tafsir dari backend." />
        </div>
      ) : null}

      {isError ? (
        <div className="mb-5">
          <EmptyState
            title="Tafsir backend belum bisa dimuat"
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

      {tafsir ? (
        <article className="rounded-lg border border-border bg-white p-5 shadow-sm sm:p-7">
          <p className="text-sm font-semibold text-primary">Tafsir ayat</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {tafsir.surahName}:{tafsir.ayahNumber}
          </h1>
          <p className="mt-4 inline-flex w-fit rounded-md bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
            Sumber: {tafsir.tafsirSource}
          </p>

          <section className="mt-8 border-t border-border pt-6">
            <h2 className="sr-only">Teks Arab</h2>
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic text-3xl leading-[2.5] text-foreground sm:text-4xl"
            >
              {tafsir.arabicText}
            </p>
          </section>

          <section className="mt-6 rounded-lg bg-muted px-5 py-4">
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              Terjemahan Indonesia
            </h2>
            <p className="text-base leading-8 text-muted-foreground">
              {tafsir.translationId}
            </p>
          </section>

          <section className="mt-6">
            <h2 className="text-xl font-semibold text-foreground">
              Tafsir singkat
            </h2>
            <p className="mt-3 text-base leading-8 text-muted-foreground">
              {tafsir.tafsirText || "Tafsir untuk ayat ini belum tersedia."}
            </p>
          </section>
        </article>
      ) : null}
    </main>
  );
}
