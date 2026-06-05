import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { AudioButton } from "@/components/audio-button";
import type { AyahDetail } from "@/features/quran/quran.types";

type AyahListItemProps = {
  ayah: AyahDetail;
};

export function AyahListItem({ ayah }: AyahListItemProps) {
  return (
    <article
      data-testid="ayah-list-item"
      className="rounded-lg border border-border bg-white p-5 shadow-sm transition focus-within:border-primary/40 focus-within:shadow-md sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-primary">
          {ayah.surahName}:{ayah.ayahNumber}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <AudioButton
            trackId={`ayah-${ayah.surahId}-${ayah.ayahNumber}`}
            label={`${ayah.surahName} ayat ${ayah.ayahNumber}`}
            audioUrls={[ayah.audioUrl]}
            idleText="Dengarkan ayat"
            loadingText="Menyiapkan ayat"
            playingText="Memutar ayat"
            className="w-full sm:w-auto"
          />
          <Link
            href={`/tafsir/${ayah.surahId}/${ayah.ayahNumber}`}
            aria-label={`Buka tafsir ${ayah.surahName} ayat ${ayah.ayahNumber}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted active:scale-[0.99]"
          >
            <BookOpenText className="h-4 w-4" aria-hidden="true" />
            Tafsir
          </Link>
        </div>
      </div>
      <p
        dir="rtl"
        lang="ar"
        className="font-arabic text-3xl leading-[2.5] text-foreground sm:text-4xl"
      >
        {ayah.arabicText}
      </p>
      <p className="mt-5 border-t border-border pt-4 text-base leading-8 text-muted-foreground">
        {ayah.translationId}
      </p>
    </article>
  );
}
