import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { thematicVerseFixtures } from "@/features/quran/quran.fixtures";
import { renderWithProviders } from "@/test/render-with-providers";
import { ThematicVerseList } from "./thematic-verse-list";

function createJsonResponse(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

describe("ThematicVerseList", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders backend data and keeps R2 range audio ready on cards", async () => {
    const playMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(playMock);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(vi.fn());
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(vi.fn());
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.startsWith("/api/thematic-verses")) {
        return createJsonResponse({ data: thematicVerseFixtures });
      }

      return createJsonResponse(
        { message: "Not found", data: null },
        { status: 404 },
      );
    });

    vi.stubGlobal("fetch", fetchMock);
    renderWithProviders(<ThematicVerseList fallbackVerses={[]} />);

    expect(
      screen.getByText("Mengambil ayat tematik dari backend."),
    ).toBeInTheDocument();
    await screen.findByText("Puasa dan ketakwaan");

    expect(fetchMock).toHaveBeenCalledWith("/api/thematic-verses");
    expect(
      screen.getByRole("button", {
        name: "Dengarkan Al Baqarah ayat 183 sampai 188",
      }),
    ).toBeEnabled();
    await userEvent.click(
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
    expect(fetchMock).not.toHaveBeenCalledWith(
      expect.stringContaining("/api/ayah-details?"),
    );
  });

  it("shows backend error state while keeping development fallback visible", async () => {
    const user = userEvent.setup();
    let thematicRequestCount = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).startsWith("/api/thematic-verses")) {
        thematicRequestCount += 1;
      }

      return createJsonResponse(
        { message: "Backend sedang offline.", data: null },
        { status: 503 },
      );
    });

    vi.stubGlobal("fetch", fetchMock);
    renderWithProviders(<ThematicVerseList />);

    await screen.findByText("Backend belum bisa dimuat");
    expect(screen.getAllByTestId("verse-card")).toHaveLength(24);

    await user.click(screen.getByRole("button", { name: "Coba lagi" }));
    await waitFor(() => expect(thematicRequestCount).toBe(2));
  });
});
