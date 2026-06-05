import { z } from "zod";

const positiveIntegerString = z.coerce.number().int().positive();

export const ayahDetailsQuerySchema = z
  .object({
    surahId: positiveIntegerString,
    startAyah: positiveIntegerString,
    endAyah: positiveIntegerString,
  })
  .refine((query) => query.endAyah >= query.startAyah, {
    message: "endAyah must be greater than or equal to startAyah.",
    path: ["endAyah"],
  });

export const tafsirQuerySchema = z.object({
  surahId: positiveIntegerString,
  ayahNumber: positiveIntegerString,
});
