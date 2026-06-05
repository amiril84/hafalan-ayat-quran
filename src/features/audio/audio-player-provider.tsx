"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type AudioStatus = "idle" | "loading" | "playing" | "error";

type PlayRequest = {
  trackId: string;
  label: string;
  audioUrls: string[];
};

type AudioPlayerContextValue = {
  activeTrackId: string | null;
  activeLabel: string | null;
  status: AudioStatus;
  errorMessage: string | null;
  play: (request: PlayRequest) => void;
  stop: () => void;
  getTrackStatus: (trackId: string) => AudioStatus;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

function toPlayableAudioUrl(audioUrl: string) {
  if (audioUrl.startsWith("/")) {
    return audioUrl;
  }

  try {
    const url = new URL(audioUrl);

    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.search}`;
    }

    return `/api/audio?src=${encodeURIComponent(url.toString())}`;
  } catch {
    return audioUrl;
  }
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [status, setStatus] = useState<AudioStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlsRef = useRef<string[]>([]);
  const audioIndexRef = useRef(0);

  const playCurrentAudio = useCallback(() => {
    const audio = audioElementRef.current;
    const audioUrl = audioUrlsRef.current[audioIndexRef.current];

    if (!audio || !audioUrl) {
      setStatus("error");
      setErrorMessage("Audio ayat belum tersedia.");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    audio.src = toPlayableAudioUrl(audioUrl);
    audio.load();

    void audio
      .play()
      .then(() => {
        setStatus("playing");
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage(
          "Audio tidak bisa diputar. Cek koneksi internet lalu coba lagi.",
        );
      });
  }, []);

  const stop = useCallback(() => {
    const audio = audioElementRef.current;

    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    audioUrlsRef.current = [];
    audioIndexRef.current = 0;
    setActiveTrackId(null);
    setActiveLabel(null);
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  const play = useCallback(
    ({ trackId, label, audioUrls }: PlayRequest) => {
      if (audioUrls.length === 0) {
        setActiveTrackId(trackId);
        setActiveLabel(label);
        setStatus("error");
        setErrorMessage("Audio ayat belum tersedia.");
        return;
      }

      const audio = audioElementRef.current;

      if (audio) {
        audio.pause();
      }

      audioUrlsRef.current = audioUrls;
      audioIndexRef.current = 0;
      setActiveTrackId(trackId);
      setActiveLabel(label);
      playCurrentAudio();
    },
    [playCurrentAudio],
  );

  const getTrackStatus = useCallback(
    (trackId: string) => {
      if (activeTrackId !== trackId) {
        return "idle";
      }

      return status;
    },
    [activeTrackId, status],
  );

  useEffect(() => {
    const audio = audioElementRef.current;

    if (!audio) {
      return;
    }

    const handleEnded = () => {
      const nextIndex = audioIndexRef.current + 1;

      if (nextIndex < audioUrlsRef.current.length) {
        audioIndexRef.current = nextIndex;
        playCurrentAudio();
        return;
      }

      stop();
    };

    const handleError = () => {
      setStatus("error");
      setErrorMessage(
        "Audio tidak bisa diputar. Cek koneksi internet lalu coba lagi.",
      );
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, [playCurrentAudio, stop]);

  const value = useMemo<AudioPlayerContextValue>(
    () => ({
      activeTrackId,
      activeLabel,
      status,
      errorMessage,
      play,
      stop,
      getTrackStatus,
    }),
    [
      activeLabel,
      activeTrackId,
      errorMessage,
      getTrackStatus,
      play,
      status,
      stop,
    ],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      <audio
        ref={audioElementRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-px w-px opacity-0"
        playsInline
        preload="none"
        tabIndex={-1}
      />
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);

  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider.");
  }

  return context;
}
