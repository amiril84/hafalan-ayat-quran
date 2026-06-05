"use client";

import { AudioPlayerProvider } from "@/features/audio/audio-player-provider";
import { QuranQueryProvider } from "@/features/quran/query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QuranQueryProvider>
      <AudioPlayerProvider>{children}</AudioPlayerProvider>
    </QuranQueryProvider>
  );
}
