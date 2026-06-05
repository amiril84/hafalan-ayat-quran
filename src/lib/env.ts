import { z } from "zod";

const quranDataProviderSchema = z
  .enum(["equran", "idnbogor"])
  .default("equran");

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL harus berupa URL PostgreSQL yang valid.")
    .optional()
    .or(z.literal("")),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Tahfidzh MJ"),
  QURAN_DATA_PROVIDER: quranDataProviderSchema,
});

export type ValidatedEnv = z.infer<typeof envSchema>;

export function validateEnv(
  input: Record<string, string | undefined>,
  options: { requireDatabaseUrl?: boolean } = {},
) {
  const parsed = envSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  if (options.requireDatabaseUrl && !parsed.data.DATABASE_URL) {
    return {
      success: false as const,
      issues: [
        {
          path: "DATABASE_URL",
          message: "DATABASE_URL wajib diisi untuk setup database.",
        },
      ],
    };
  }

  return {
    success: true as const,
    data: {
      ...parsed.data,
      DATABASE_URL: parsed.data.DATABASE_URL || undefined,
    },
  };
}

export function getQuranDataProviderName() {
  const parsed = quranDataProviderSchema.safeParse(
    process.env.QURAN_DATA_PROVIDER,
  );

  return parsed.success ? parsed.data : "equran";
}

export function getPublicAppName() {
  return process.env.NEXT_PUBLIC_APP_NAME?.trim() || "Tahfidzh MJ";
}
