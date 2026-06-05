"use client";

import { LoaderCircle, Play, Square } from "lucide-react";
import { useId } from "react";
import { useAudioPlayer } from "@/features/audio/audio-player-provider";
import { cn } from "@/lib/utils";

type AudioButtonProps = {
  trackId: string;
  label: string;
  audioUrls: string[];
  idleText?: string;
  loadingText?: string;
  playingText?: string;
  errorText?: string;
  disabledText?: string;
  disabled?: boolean;
  className?: string;
};

export function AudioButton({
  trackId,
  label,
  audioUrls,
  idleText = "Dengarkan",
  loadingText = "Menyiapkan",
  playingText = "Sedang diputar",
  errorText = "Audio gagal",
  disabledText = "Audio belum siap",
  disabled = false,
  className,
}: AudioButtonProps) {
  const { getTrackStatus, play, stop, errorMessage, activeTrackId } =
    useAudioPlayer();
  const status = getTrackStatus(trackId);
  const isActive = status !== "idle";
  const isLoading = status === "loading";
  const isPlaying = status === "playing";
  const isError = status === "error";
  const errorId = useId();

  const handleClick = () => {
    if (disabled) {
      return;
    }

    if (isActive) {
      stop();
      return;
    }

    play({ trackId, label, audioUrls });
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        aria-label={isActive ? `Hentikan ${label}` : `Dengarkan ${label}`}
        aria-pressed={isPlaying}
        aria-describedby={isError ? errorId : undefined}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary/20 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
          isActive &&
            "border-emerald-700 bg-emerald-800 text-white hover:bg-emerald-900",
          isError && "border-red-700 bg-red-700 hover:bg-red-800",
          className,
        )}
      >
        {isLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : isActive ? (
          <Square className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Play className="h-4 w-4" aria-hidden="true" />
        )}
        <span>
          {isLoading
            ? loadingText
            : disabled
              ? disabledText
              : isPlaying
                ? playingText
                : isError
                  ? errorText
                  : idleText}
        </span>
      </button>
      {isError && activeTrackId === trackId ? (
        <p id={errorId} className="text-xs font-medium text-red-700">
          {errorMessage ?? "Audio ayat belum tersedia."}
        </p>
      ) : null}
    </div>
  );
}
