import { screen } from "@testing-library/react";
import Home from "./page";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Home", () => {
  it("renders the Phase 0 smoke page", () => {
    renderWithProviders(<Home />);

    expect(
      screen.getByRole("heading", { name: /hafalan ayat tematik al quran/i }),
    ).toBeInTheDocument();
  });

  it("renders 24 verse preview cards", () => {
    renderWithProviders(<Home />);

    expect(screen.getAllByTestId("verse-card")).toHaveLength(24);
  });
});
