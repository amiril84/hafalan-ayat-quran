import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AudioButton } from "@/components/audio-button";
import type { ThematicVerse } from "@/features/quran/quran.types";

type DetailHeaderProps = {
  verse: ThematicVerse;
  audioUrls: string[];
};

export function DetailHeader({ verse, audioUrls }: DetailHeaderProps) {
  return (
    <header className="border-b border-border bg-background/90">
      <div className="mx-auto w-full max-w-5xl px-5 py-7 sm:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted active:scale-[0.99]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke daftar
        </Link>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Detail ayat</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {verse.surahName} ayat {verse.startAyah} - {verse.endAyah}
            </h1>
            <p className="mt-3 inline-flex w-fit rounded-md bg-teal-50 px-3 py-1 text-sm font-medium text-teal-950">
              {verse.theme}
            </p>
          </div>
          <AudioButton
            trackId={`detail-range-${verse.id}`}
            label={`${verse.surahName} ayat ${verse.startAyah} sampai ${verse.endAyah}`}
            audioUrls={audioUrls}
            idleText="Dengarkan semua"
            loadingText="Menyiapkan semua"
            playingText="Memutar semua"
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </header>
  );
}
