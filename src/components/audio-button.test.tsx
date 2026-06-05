import { fireEvent, screen, waitFor } from "@testing-library/react";
import { AudioButton } from "./audio-button";
import { renderWithProviders } from "@/test/render-with-providers";

describe("AudioButton", () => {
  const playMock = vi.fn<() => Promise<void>>();
  const pauseMock = vi.fn();
  const loadMock = vi.fn();

  beforeEach(() => {
    playMock.mockResolvedValue(undefined);
    pauseMock.mockClear();
    loadMock.mockClear();

    class MockAudio {
      preload = "";
      src = "";
      play = playMock;
      pause = pauseMock;
      load = loadMock;
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      removeAttribute = vi.fn((attribute: string) => {
        if (attribute === "src") {
          this.src = "";
        }
      });
    }

    vi.stubGlobal("Audio", MockAudio);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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
});
