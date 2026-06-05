import { parseAyahRange } from "./parse-ayah-range";

describe("parseAyahRange", () => {
  it("parses a spaced ayah range", () => {
    expect(parseAyahRange("183 - 188")).toEqual({
      startAyah: 183,
      endAyah: 188,
    });
  });

  it("parses a compact ayah range", () => {
    expect(parseAyahRange("1-4")).toEqual({
      startAyah: 1,
      endAyah: 4,
    });
  });

  it("rejects invalid input", () => {
    expect(() => parseAyahRange("188 - 183")).toThrow(
      "Rentang ayat tidak valid.",
    );
    expect(() => parseAyahRange("ayat 1 sampai 4")).toThrow(
      "Format rentang ayat tidak valid.",
    );
  });
});
