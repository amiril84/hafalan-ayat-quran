"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/app-header";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { SearchToggle } from "@/components/search-toggle";
import { VerseCard } from "@/components/verse-card";
import { thematicVerseFixtures } from "@/features/quran/quran.fixtures";
import {
  fetchThematicVerses,
  quranQueryKeys,
} from "@/features/quran/quran.api";
import { searchThematicVerses } from "@/features/quran/search-thematic-verses";
import type { ThematicVerse } from "@/features/quran/quran.types";

function getSudaisAudioUrlsForVerse(verse: ThematicVerse) {
  return Array.from(
    { length: verse.endAyah - verse.startAyah + 1 },
    (_, index) => {
      const ayahNumber = verse.startAyah + index;

      return `https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/${String(
        verse.surahId,
      ).padStart(3, "0")}${String(ayahNumber).padStart(3, "0")}.mp3`;
    },
  );
}

export function ThematicVerseList({
  fallbackVerses = thematicVerseFixtures,
}: {
  fallbackVerses?: ThematicVerse[];
}) {
  const [query, setQuery] = useState("");
  const {
    data: verses = fallbackVerses,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: quranQueryKeys.thematicVerses,
    queryFn: fetchThematicVerses,
  });
  const filteredVerses = useMemo(
    () => searchThematicVerses(verses, query),
    [query, verses],
  );
  const totalVerses = verses.length;

  return (
    <>
      <AppHeader
        title="Hafalan ayat tematik Al Quran"
        description="Temukan ayat berdasarkan surat atau tema, baca penggalan awalnya, lalu dengarkan rangkaian ayat untuk latihan hafalan."
        action={
          <SearchToggle
            value={query}
            onChange={setQuery}
            placeholder="Cari: baqarah, puasa, iman"
          />
        }
      />
      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        {isLoading ? (
          <div className="mb-5">
            <LoadingState label="Mengambil ayat tematik dari backend." />
          </div>
        ) : null}

        {isError ? (
          <div className="mb-5">
            <EmptyState
              title="Backend belum bisa dimuat"
              description={
                error instanceof Error
                  ? error.message
                  : "Data fallback development tetap ditampilkan sementara."
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

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              {filteredVerses.length} dari {totalVerses} ayat tematik
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Diurutkan berdasarkan urutan surat dalam mushaf, lalu nomor ayat
              awal.
            </p>
          </div>
        </div>

        {filteredVerses.length > 0 ? (
          <section
            aria-label="Daftar ayat tematik"
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredVerses.map((verse) => (
              <VerseCard
                key={verse.id}
                verse={verse}
                audioUrls={getSudaisAudioUrlsForVerse(verse)}
              />
            ))}
          </section>
        ) : (
          <EmptyState
            title="Tidak ada ayat ditemukan"
            description="Coba gunakan nama surat atau tema lain, misalnya baqarah, puasa, iman, atau ali imran."
          />
        )}
      </main>
    </>
  );
}
