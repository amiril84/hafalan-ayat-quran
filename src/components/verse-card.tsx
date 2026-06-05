import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AudioButton } from "@/components/audio-button";
import type { ThematicVerse } from "@/features/quran/quran.types";

type VerseCardProps = {
  verse: ThematicVerse;
  audioUrls: string[];
  audioDisabled?: boolean;
};

export function VerseCard({
  verse,
  audioUrls,
  audioDisabled = false,
}: VerseCardProps) {
  const range = `${verse.startAyah}-${verse.endAyah}`;

  return (
    <article
      data-testid="verse-card"
      className="flex min-h-[19rem] flex-col justify-between rounded-lg border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-within:border-primary/40 focus-within:shadow-md"
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              {verse.surahName}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">
              Ayat {verse.startAyah} - {verse.endAyah}
            </h2>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            No. {verse.order}
          </span>
        </div>
        <p className="mb-5 inline-flex rounded-md bg-teal-50 px-3 py-1 text-sm font-medium text-teal-950">
          {verse.theme}
        </p>
        <p
          dir="rtl"
          lang="ar"
          className="font-arabic text-3xl leading-[2.4] text-foreground"
        >
          {verse.firstAyahSnippetArabic}
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AudioButton
          trackId={`range-${verse.id}`}
          label={`${verse.surahName} ayat ${verse.startAyah} sampai ${verse.endAyah}`}
          audioUrls={audioUrls}
          idleText="Dengarkan semua"
          loadingText="Menyiapkan semua"
          playingText="Memutar semua"
          disabled={audioDisabled}
          disabledText="Memuat audio"
          className="w-full sm:w-auto"
        />
        <Link
          href={`/ayat/${verse.surahId}/${range}`}
          aria-label={`Lihat detail ${verse.surahName} ayat ${verse.startAyah} sampai ${verse.endAyah}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted active:scale-[0.99]"
        >
          Detail
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
