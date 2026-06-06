import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { thematicVerseFixtures } from "../src/features/quran/quran.fixtures";
import {
  getRangeAudioObjectKey,
  getSudaisAudioUrl,
} from "../src/features/quran/audio-urls";

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl: string;
};

const audioRoot = path.resolve(process.cwd(), ".audio");
const ayahCacheDir = path.join(audioRoot, "cache", "ayahs");
const rangeOutputDir = path.join(audioRoot, "ranges");
const concatListDir = path.join(audioRoot, "concat-lists");

function loadEnvFile(filePath: string) {
  return fs
    .readFile(filePath, "utf8")
    .then((content) => {
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#")) {
          continue;
        }

        const separatorIndex = trimmed.indexOf("=");

        if (separatorIndex < 0) {
          continue;
        }

        const key = trimmed.slice(0, separatorIndex).trim();
        const value = trimmed
          .slice(separatorIndex + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "");

        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    })
    .catch((error: unknown) => {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return;
      }

      throw error;
    });
}

function requiredEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment ${key} belum tersedia.`);
  }

  return value;
}

function getR2Config(): R2Config {
  return {
    accountId: requiredEnv("CLOUDFLARE_ACCOUNT_ID"),
    accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    bucketName: requiredEnv("R2_BUCKET_NAME"),
    publicBaseUrl: requiredEnv("R2_PUBLIC_BASE_URL").replace(/\/+$/, ""),
  };
}

function hmac(
  key: crypto.BinaryLike,
  value: string,
  encoding?: crypto.BinaryToTextEncoding,
) {
  const digest = crypto
    .createHmac("sha256", key)
    .update(value, "utf8")
    .digest();

  return encoding ? digest.toString(encoding) : digest;
}

function sha256(
  value: crypto.BinaryLike,
  encoding: crypto.BinaryToTextEncoding,
) {
  return crypto.createHash("sha256").update(value).digest(encoding);
}

function amzDate(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function dateStamp(date: Date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function encodeRfc3986(value: string) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function encodePath(value: string) {
  return value.split("/").map(encodeRfc3986).join("/");
}

function quoteConcatPath(filePath: string) {
  return filePath.replace(/\\/g, "/").replace(/'/g, "'\\''");
}

async function ensureDirectories() {
  await Promise.all([
    fs.mkdir(ayahCacheDir, { recursive: true }),
    fs.mkdir(rangeOutputDir, { recursive: true }),
    fs.mkdir(concatListDir, { recursive: true }),
  ]);
}

async function fileExists(filePath: string) {
  try {
    const stat = await fs.stat(filePath);

    return stat.size > 0;
  } catch {
    return false;
  }
}

async function downloadAyahAudio(surahId: number, ayahNumber: number) {
  const fileName = `${String(surahId).padStart(3, "0")}${String(
    ayahNumber,
  ).padStart(3, "0")}.mp3`;
  const filePath = path.join(ayahCacheDir, fileName);

  if (await fileExists(filePath)) {
    return filePath;
  }

  const audioUrl = getSudaisAudioUrl(surahId, ayahNumber);
  const response = await fetch(audioUrl);

  if (!response.ok) {
    throw new Error(
      `Gagal download audio ${surahId}:${ayahNumber} (${response.status}).`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return filePath;
}

async function runFfmpeg(inputListPath: string, outputPath: string) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      "ffmpeg",
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        inputListPath,
        "-c",
        "copy",
        outputPath,
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    const stderr: Buffer[] = [];

    child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `ffmpeg gagal (${code}): ${Buffer.concat(stderr).toString("utf8")}`,
        ),
      );
    });
  });
}

async function buildRangeAudio(verse: (typeof thematicVerseFixtures)[number]) {
  const ayahAudioPaths: string[] = [];

  for (
    let ayahNumber = verse.startAyah;
    ayahNumber <= verse.endAyah;
    ayahNumber += 1
  ) {
    ayahAudioPaths.push(await downloadAyahAudio(verse.surahId, ayahNumber));
  }

  const objectKey = getRangeAudioObjectKey(verse);
  const outputPath = path.join(rangeOutputDir, path.basename(objectKey));
  const inputListPath = path.join(
    concatListDir,
    `${path.basename(objectKey, ".mp3")}.txt`,
  );
  const inputList = ayahAudioPaths
    .map((filePath) => `file '${quoteConcatPath(filePath)}'`)
    .join("\n");

  await fs.writeFile(inputListPath, `${inputList}\n`);
  await runFfmpeg(inputListPath, outputPath);

  return { objectKey, outputPath };
}

async function uploadToR2({
  config,
  objectKey,
  filePath,
}: {
  config: R2Config;
  objectKey: string;
  filePath: string;
}) {
  const body = await fs.readFile(filePath);
  const now = new Date();
  const requestDate = amzDate(now);
  const scopeDate = dateStamp(now);
  const region = "auto";
  const service = "s3";
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const credentialScope = `${scopeDate}/${region}/${service}/aws4_request`;
  const payloadHash = sha256(body, "hex");
  const canonicalUri = `/${encodePath(config.bucketName)}/${encodePath(objectKey)}`;
  const canonicalHeaders = [
    "cache-control:public, max-age=31536000, immutable",
    "content-type:audio/mpeg",
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${requestDate}`,
    "",
  ].join("\n");
  const signedHeaders =
    "cache-control;content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    requestDate,
    credentialScope,
    sha256(canonicalRequest, "hex"),
  ].join("\n");
  const signingKey = hmac(
    hmac(
      hmac(hmac(`AWS4${config.secretAccessKey}`, scopeDate), region),
      service,
    ),
    "aws4_request",
  );
  const signature = hmac(signingKey, stringToSign, "hex");
  const response = await fetch(`https://${host}${canonicalUri}`, {
    method: "PUT",
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "audio/mpeg",
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": requestDate,
      Authorization: `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    body,
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      `Upload R2 gagal untuk ${objectKey} (${response.status}): ${message.slice(
        0,
        300,
      )}`,
    );
  }

  return `${config.publicBaseUrl}/${objectKey}`;
}

async function main() {
  await loadEnvFile(path.resolve(process.cwd(), ".env"));
  await loadEnvFile(path.resolve(process.cwd(), ".env.local"));
  await ensureDirectories();

  const config = getR2Config();

  console.log(
    `Membuat dan upload ${thematicVerseFixtures.length} audio gabungan ke bucket ${config.bucketName}.`,
  );

  for (const [index, verse] of thematicVerseFixtures.entries()) {
    const label = `${verse.surahName} ${verse.startAyah}-${verse.endAyah}`;
    console.log(`[${index + 1}/${thematicVerseFixtures.length}] ${label}`);
    const rangeAudio = await buildRangeAudio(verse);
    const publicUrl = await uploadToR2({
      config,
      objectKey: rangeAudio.objectKey,
      filePath: rangeAudio.outputPath,
    });
    console.log(`  ${publicUrl}`);
  }

  console.log("Selesai membuat dan upload audio gabungan R2.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
