export function normalizeSurahName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['`’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(al|as|ar|an)\b/g, "")
    .replace(/\bfatir\b/g, "fathir")
    .replace(/\bfurqon\b/g, "furqan")
    .replace(/\bruum\b/g, "rum")
    .replace(/\bjumah\b/g, "jumuah")
    .replace(/\bmukminun\b/g, "muminun")
    .replace(/\bhasyr\b/g, "hashr")
    .replace(/\banam\b/g, "anam")
    .trim()
    .replace(/\s+/g, " ");
}
