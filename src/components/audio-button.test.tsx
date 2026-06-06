import { fireEvent, screen, waitFor } from "@testing-library/react";
import { AudioButton } from "./audio-button";
import { renderWithProviders } from "@/test/render-with-providers";

describe("AudioButton", () => {
  const playMock = vi.fn<() => Promise<void>>();
  const pauseMock = vi.fn();
  const loadMock = vi.fn();

  beforeEach(() => {
    playMock.mockReset();
    playMock.mockResolvedValue(undefined);
    pauseMock.mockReset();
    loadMock.mockReset();

    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(playMock);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pauseMock);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(loadMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("moves from idle to loading, playing, and stop", async () => {
    renderWithProviders(
      <AudioButton
        trackId="range-2-183-188"
        label="Al Baqarah ayat 183 sampai 188"
        audioUrls={["/mock-audio/002183.mp3"]}
      />,
    );

    const button = screen.getByRole("button", {
      name: "Dengarkan Al Baqarah ayat 183 sampai 188",
    });

    expect(button).toHaveTextContent("Dengarkan");

    fireEvent.click(button);

    expect(button).toHaveTextContent("Menyiapkan");

    await waitFor(() => {
      expect(playMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(button).toHaveTextContent("Sedang diputar");
    });
    expect(button).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(button);

    expect(pauseMock).toHaveBeenCalled();
    expect(button).toHaveTextContent("Dengarkan");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("shows an error when audio urls are empty", async () => {
    renderWithProviders(
      <AudioButton
        trackId="missing-audio"
        label="Audio kosong"
        audioUrls={[]}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Dengarkan Audio kosong" }),
    );

    expect(screen.getByText("Audio gagal")).toBeInTheDocument();
    expect(screen.getByText("Audio ayat belum tersedia.")).toBeInTheDocument();
  });

  it("routes external audio through the same-origin audio proxy", async () => {
    renderWithProviders(
      <AudioButton
        trackId="range-2-168-173"
        label="Al Baqarah ayat 168 sampai 173"
        audioUrls={[
          "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/002168.mp3",
        ]}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Dengarkan Al Baqarah ayat 168 sampai 173",
      }),
    );

    await waitFor(() => {
      expect(playMock).toHaveBeenCalledTimes(1);
    });
    const audio = document.querySelector("audio");
    const playableUrl = new URL(
      audio?.getAttribute("src") ?? "",
      location.href,
    );

    expect(`${playableUrl.pathname}${playableUrl.search}`).toBe(
      "/api/audio?src=https%3A%2F%2Fcdn.equran.id%2Faudio-partial%2FAbdurrahman-as-Sudais%2F002168.mp3",
    );
  });

  it("plays R2 range audio directly without the same-origin audio proxy", async () => {
    renderWithProviders(
      <AudioButton
        trackId="range-2-284-286"
        label="Al Baqarah ayat 284 sampai 286"
        audioUrls={["https://audio.mushollamj.com/ranges/baqarah-284-286.mp3"]}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Dengarkan Al Baqarah ayat 284 sampai 286",
      }),
    );

    await waitFor(() => {
      expect(playMock).toHaveBeenCalledTimes(1);
    });
    const audio = document.querySelector("audio");

    expect(audio?.getAttribute("src")).toBe(
      "https://audio.mushollamj.com/ranges/baqarah-284-286.mp3",
    );
  });
});
