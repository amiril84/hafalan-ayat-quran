import { screen } from "@testing-library/react";
import { thematicVerseFixtures } from "@/features/quran/quran.fixtures";
import { renderWithProviders } from "@/test/render-with-providers";
import { DetailHeader } from "./detail-header";

describe("DetailHeader", () => {
  it("renders surah, theme, back navigation, and range audio", () => {
    const verse = thematicVerseFixtures.find((item) => item.id === "2-183-188");

    expect(verse).toBeDefined();

    renderWithProviders(
      <DetailHeader verse={verse!} audioUrls={[verse!.rangeAudioUrl]} />,
    );

    expect(
      screen.getByRole("heading", { name: "Al Baqarah ayat 183 - 188" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Puasa dan ketakwaan")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Kembali ke daftar" }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("button", {
        name: "Dengarkan Al Baqarah ayat 183 sampai 188",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dengarkan semua")).toBeInTheDocument();
  });
});
