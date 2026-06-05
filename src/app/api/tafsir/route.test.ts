import { NextRequest } from "next/server";
import { GET } from "./route";

function createRequest(path: string) {
  return new NextRequest(`http://localhost${path}`);
}

describe("GET /api/tafsir", () => {
  it("returns tafsir for an existing ayah", async () => {
    const response = await GET(
      createRequest("/api/tafsir?surahId=2&ayahNumber=183"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe(
      "public, s-maxage=86400, stale-while-revalidate=604800",
    );
    expect(body.data).toMatchObject({
      surahId: 2,
      surahName: "Al Baqarah",
      ayahNumber: 183,
      arabicText: expect.any(String),
      translationId: expect.any(String),
      tafsirText: expect.any(String),
      tafsirSource: "Tafsir Kemenag RI",
    });
  });

  it("returns a 400 response for invalid query", async () => {
    const response = await GET(createRequest("/api/tafsir?surahId=2"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Query tafsir tidak valid.");
  });

  it("returns a 404 response when tafsir is missing", async () => {
    const response = await GET(
      createRequest("/api/tafsir?surahId=114&ayahNumber=1"),
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe("Tafsir untuk ayat ini belum tersedia.");
    expect(body.data).toBeNull();
  });
});
