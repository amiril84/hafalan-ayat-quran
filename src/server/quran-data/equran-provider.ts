import type {
  QuranDataProvider,
  QuranDataProviderName,
  QuranDataSource,
  QuranProviderSurah,
  QuranProviderTafsir,
} from "./quran-data-provider";
import { getQuranDataProviderName } from "@/lib/env";

type JsonObject = Record<string, unknown>;

const providerConfig: Record<
  QuranDataProviderName,
  {
    baseUrl: string;
    sourceName: string;
    sourceUrl: string;
  }
> = {
  equran: {
    baseUrl: "https://equran.id/api/v2",
    sourceName: "EQuran.id API",
    sourceUrl: "https://equran.id/apidev",
  },
  idnbogor: {
    baseUrl: "https://cdn.idnbogor.id/api/v1",
    sourceName: "CDN IDNBOGOR QuranAPI",
    sourceUrl: "https://cdn.idnbogor.id/",
  },
};

const sudaisAudioKey = "03";
const fetchTimeoutMs = 10_000;

function asObject(value: unknown, label: string): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Response ${label} tidak valid.`);
  }

  return value as JsonObject;
}

function asString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Field ${label} tidak valid.`);
  }

  return value;
}

function asNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`Field ${label} tidak valid.`);
  }

  return value;
}

function asArray(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Field ${label} tidak valid.`);
  }

  return value;
}

function getDataPayload(response: unknown) {
  return asObject(asObject(response, "root").data, "data");
}

export function parseEquranSurahResponse(
  response: unknown,
): QuranProviderSurah {
  const data = getDataPayload(response);
  const surahId = asNumber(data.nomor, "data.nomor");
  const surahNameLatin = asString(data.namaLatin, "data.namaLatin");
  const ayahCount = asNumber(data.jumlahAyat, "data.jumlahAyat");
  const ayahs = asArray(data.ayat, "data.ayat").map((rawAyah) => {
    const ayah = asObject(rawAyah, "ayat[]");
    const audio = asObject(ayah.audio, "ayat[].audio");

    return {
      surahId,
      surahNameLatin,
      ayahNumber: asNumber(ayah.nomorAyat, "ayat[].nomorAyat"),
      arabicText: asString(ayah.teksArab, "ayat[].teksArab"),
      translationId: asString(ayah.teksIndonesia, "ayat[].teksIndonesia"),
      audioUrl: asString(audio[sudaisAudioKey], "ayat[].audio.03"),
    };
  });

  if (ayahs.length !== ayahCount) {
    throw new Error(
      `Jumlah ayat ${surahNameLatin} tidak cocok: expected ${ayahCount}, received ${ayahs.length}.`,
    );
  }

  return {
    surahId,
    surahNameLatin,
    surahNameArabic: asString(data.nama, "data.nama"),
    ayahCount,
    ayahs,
  };
}

export function parseEquranTafsirResponse(
  response: unknown,
): QuranProviderTafsir[] {
  const data = getDataPayload(response);
  const surahId = asNumber(data.nomor, "data.nomor");
  const surahNameLatin = asString(data.namaLatin, "data.namaLatin");

  return asArray(data.tafsir, "data.tafsir").map((rawTafsir) => {
    const tafsir = asObject(rawTafsir, "tafsir[]");

    return {
      surahId,
      surahNameLatin,
      ayahNumber: asNumber(tafsir.ayat, "tafsir[].ayat"),
      tafsirText: asString(tafsir.teks, "tafsir[].teks"),
    };
  });
}

async function fetchJson(url: string) {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), fetchTimeoutMs);

  let response: Response;

  try {
    response = await fetch(url, { signal: abortController.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Gagal mengambil ${url}: timeout setelah ${fetchTimeoutMs / 1000} detik.`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Gagal mengambil ${url}: HTTP ${response.status}.`);
  }

  return response.json();
}

export function createEquranProvider(
  providerName: QuranDataProviderName = "equran",
): QuranDataProvider {
  const config = providerConfig[providerName];
  const dataSource: QuranDataSource = {
    provider: providerName,
    sourceName: config.sourceName,
    sourceUrl: config.sourceUrl,
  };

  return {
    dataSource,
    async getSurah(surahId) {
      return parseEquranSurahResponse(
        await fetchJson(`${config.baseUrl}/surat/${surahId}`),
      );
    },
    async getTafsir(surahId) {
      return parseEquranTafsirResponse(
        await fetchJson(`${config.baseUrl}/tafsir/${surahId}`),
      );
    },
  };
}

export function createQuranDataProvider() {
  const providerName = getQuranDataProviderName();

  if (providerName === "idnbogor") {
    return createEquranProvider("idnbogor");
  }

  return createEquranProvider("equran");
}
