import { GET } from "./route";

describe("GET /api/thematic-verses", () => {
  it("returns thematic verses in contract shape", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe(
      "public, s-maxage=86400, stale-while-revalidate=604800",
    );
    expect(body.data).toHaveLength(24);
    expect(body.data[0]).toMatchObject({
      id: expect.any(String),
      order: expect.any(Number),
      surahId: 2,
      surahName: "Al Baqarah",
      surahNameNormalized: expect.any(String),
      startAyah: 168,
      endAyah: 173,
      theme: expect.any(String),
      firstAyahSnippetArabic: expect.any(String),
    });
  });
});
