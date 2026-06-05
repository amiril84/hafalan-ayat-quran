import { NextRequest } from "next/server";
import { GET } from "./route";

const validAudioUrl =
  "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/002168.mp3";

function createRequest(path: string, headers?: HeadersInit) {
  const headerMap = new Map<string, string>();

  if (headers && !(headers instanceof Headers) && !Array.isArray(headers)) {
    for (const [key, value] of Object.entries(headers)) {
      headerMap.set(key.toLowerCase(), value);
    }
  }

  return {
    headers: {
      get: (key: string) => headerMap.get(key.toLowerCase()) ?? null,
    },
    nextUrl: new URL(`http://localhost${path}`),
  } as NextRequest;
}

describe("GET /api/audio", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("proxies allowed Sudais audio with range headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("audio", {
        status: 206,
        headers: {
          "accept-ranges": "bytes",
          "content-length": "5",
          "content-range": "bytes 0-4/5",
          "content-type": "audio/mpeg",
          etag: "test-etag",
        },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      createRequest(`/api/audio?src=${encodeURIComponent(validAudioUrl)}`, {
        Range: "bytes=0-4",
      }),
    );

    expect(fetchMock).toHaveBeenCalledWith(new URL(validAudioUrl), {
      headers: { Range: "bytes=0-4" },
    });
    expect(response.status).toBe(206);
    expect(response.headers.get("content-type")).toBe("audio/mpeg");
    expect(response.headers.get("content-range")).toBe("bytes 0-4/5");
    expect(response.headers.get("accept-ranges")).toBe("bytes");
  });

  it("rejects non-whitelisted audio URLs", async () => {
    const response = await GET(
      createRequest(
        `/api/audio?src=${encodeURIComponent("https://example.com/file.mp3")}`,
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("URL audio tidak valid.");
  });
});
