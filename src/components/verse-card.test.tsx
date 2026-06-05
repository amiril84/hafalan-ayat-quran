import { screen } from "@testing-library/react";
import { thematicVerseFixtures } from "@/features/quran/quran.fixtures";
import { renderWithProviders } from "@/test/render-with-providers";
import { VerseCard } from "./verse-card";

describe("VerseCard", () => {
  it("renders the verse fields and actions", () => {
    const verse = thematicVerseFixtures.find(
      (item) => item.id === "2-183-188",
    );

    expect(verse).toBeDefined();

    renderWithProviders(
      <VerseCard verse={verse!} audioUrls={["/mock-audio/002183.mp3"]} />,
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
});
