import { fireEvent, screen, waitFor } from "@testing-library/react";
import { thematicVerseFixtures } from "@/features/quran/quran.fixtures";
import { renderWithProviders } from "@/test/render-with-providers";
import { VerseCard } from "./verse-card";

describe("VerseCard", () => {
  const playMock = vi.fn<() => Promise<void>>();

  beforeEach(() => {
    playMock.mockReset();
    playMock.mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(playMock);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(vi.fn());
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the verse fields and actions", () => {
    const verse = thematicVerseFixtures.find((item) => item.id === "2-183-188");

    expect(verse).toBeDefined();

    renderWithProviders(
      <VerseCard verse={verse!} audioUrls={[verse!.rangeAudioUrl]} />,
    );

    expect(screen.getByText("Al Baqarah")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ayat 183 - 188" }));
    expect(screen.getByText("Puasa dan ketakwaan")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Dengarkan Al Baqarah ayat 183 sampai 188",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dengarkan semua")).toBeInTheDocument();

    const detailLink = screen.getByRole("link", {
      name: "Lihat detail Al Baqarah ayat 183 sampai 188",
    });

    expect(detailLink).toHaveAttribute("href", "/ayat/2/183-188");
  });

  it("uses a single R2 range audio URL for listen all", async () => {
    const verse = thematicVerseFixtures.find((item) => item.id === "2-183-188");

    expect(verse).toBeDefined();

    renderWithProviders(
      <VerseCard verse={verse!} audioUrls={[verse!.rangeAudioUrl]} />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Dengarkan Al Baqarah ayat 183 sampai 188",
      }),
    );

    await waitFor(() => {
      expect(playMock).toHaveBeenCalledTimes(1);
    });
    expect(document.querySelector("audio")?.getAttribute("src")).toBe(
      "https://audio.mushollamj.com/ranges/baqarah-183-188.mp3",
    );
  });
});
