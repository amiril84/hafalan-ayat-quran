import { NextRequest } from "next/server";
import { GET } from "./route";

function createRequest(path: string) {
  return new NextRequest(`http://localhost${path}`);
}

describe("GET /api/ayah-details", () => {
  it("returns ayah details for a valid range", async () => {
    const response = await GET(
      createRequest("/api/ayah-details?surahId=2&startAyah=183&endAyah=188"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe(
      "public, s-maxage=86400, stale-while-revalidate=604800",
    );
    expect(body.data).toHaveLength(6);
    expect(body.data[0]).toMatchObject({
      surahId: 2,
      surahName: "Al Baqarah",
      ayahNumber: 183,
      arabicText: expect.any(String),
      translationId: expect.any(String),
      audioUrl: expect.any(String),
      audioReciter: "Abdurrahman as-Sudais",
    });
  });

  it("returns a 400 response for invalid query", async () => {
    const response = await GET(
      createRequest("/api/ayah-details?surahId=2&startAyah=188&endAyah=183"),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Query ayat tidak valid.");
  });
});
