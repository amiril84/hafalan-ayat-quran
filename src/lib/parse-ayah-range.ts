export type ParsedAyahRange = {
  startAyah: number;
  endAyah: number;
};

export function parseAyahRange(range: string): ParsedAyahRange {
  const match = range.trim().match(/^(\d+)\s*-\s*(\d+)$/);

  if (!match) {
    throw new Error("Format rentang ayat tidak valid.");
  }

  const startAyah = Number(match[1]);
  const endAyah = Number(match[2]);

  if (
    !Number.isInteger(startAyah) ||
    !Number.isInteger(endAyah) ||
    startAyah < 1 ||
    endAyah < startAyah
  ) {
    throw new Error("Rentang ayat tidak valid.");
  }

  return { startAyah, endAyah };
}
