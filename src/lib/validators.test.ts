import { ayahDetailsQuerySchema, tafsirQuerySchema } from "./validators";

describe("API query validators", () => {
  it("parses valid ayah detail query strings", () => {
    expect(
      ayahDetailsQuerySchema.parse({
        surahId: "2",
        startAyah: "183",
        endAyah: "188",
      }),
    ).toEqual({
      surahId: 2,
      startAyah: 183,
      endAyah: 188,
    });
  });

  it("rejects invalid ayah ranges", () => {
    expect(() =>
      ayahDetailsQuerySchema.parse({
        surahId: "2",
        startAyah: "188",
        endAyah: "183",
      }),
    ).toThrow();
  });

  it("parses valid tafsir query strings", () => {
    expect(
      tafsirQuerySchema.parse({
        surahId: "2",
        ayahNumber: "183",
      }),
    ).toEqual({
      surahId: 2,
      ayahNumber: 183,
    });
  });
});
