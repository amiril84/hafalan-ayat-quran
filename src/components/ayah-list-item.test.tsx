import { screen } from "@testing-library/react";
import { ayahDetailFixtures } from "@/features/quran/quran.fixtures";
import { renderWithProviders } from "@/test/render-with-providers";
import { AyahListItem } from "./ayah-list-item";

describe("AyahListItem", () => {
  it("renders arabic text, translation, audio, and tafsir action", () => {
    const ayah = ayahDetailFixtures.find(
      (item) => item.surahId === 2 && item.ayahNumber === 183,
    );

    expect(ayah).toBeDefined();

    renderWithProviders(<AyahListItem ayah={ayah!} />);

    expect(screen.getByText("Al Baqarah:183")).toBeInTheDocument();
    expect(screen.getByText(ayah!.arabicText)).toBeInTheDocument();
    expect(screen.getByText(ayah!.translationId)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Dengarkan Al Baqarah ayat 183" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dengarkan ayat")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Buka tafsir Al Baqarah ayat 183",
      }),
    ).toHaveAttribute("href", "/tafsir/2/183");
  });
});
