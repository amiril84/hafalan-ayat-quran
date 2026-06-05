import { NextResponse, type NextRequest } from "next/server";

const allowedAudioHost = "cdn.equran.id";
const allowedAudioPathPrefix = "/audio-partial/Abdurrahman-as-Sudais/";

function parseAllowedAudioUrl(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    const isAllowed =
      url.protocol === "https:" &&
      url.hostname === allowedAudioHost &&
      url.pathname.startsWith(allowedAudioPathPrefix) &&
      url.pathname.endsWith(".mp3");

    return isAllowed ? url : null;
  } catch {
    return null;
  }
}

function copyHeader(headers: Headers, source: Headers, key: string) {
  const value = source.get(key);

  if (value) {
    headers.set(key, value);
  }
}

export async function GET(request: NextRequest) {
  const audioUrl = parseAllowedAudioUrl(request.nextUrl.searchParams.get("src"));

  if (!audioUrl) {
    return NextResponse.json(
      { message: "URL audio tidak valid." },
      { status: 400 },
    );
  }

  const requestHeaders: Record<string, string> = {};
  const range = request.headers.get("range");

  if (range) {
    requestHeaders.Range = range;
  }

  const upstreamResponse = await fetch(audioUrl, {
    headers: requestHeaders,
  });

  if (!upstreamResponse.ok && upstreamResponse.status !== 206) {
    return NextResponse.json(
      { message: "Audio belum berhasil dimuat." },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers({
    "Accept-Ranges": "bytes",
    "Cache-Control":
      "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
    "Content-Type": upstreamResponse.headers.get("content-type") ?? "audio/mpeg",
  });

  copyHeader(responseHeaders, upstreamResponse.headers, "content-length");
  copyHeader(responseHeaders, upstreamResponse.headers, "content-range");
  copyHeader(responseHeaders, upstreamResponse.headers, "etag");
  copyHeader(responseHeaders, upstreamResponse.headers, "last-modified");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}
