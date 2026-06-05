import { validateEnv } from "./env";

describe("validateEnv", () => {
  it("applies safe defaults for optional runtime values", () => {
    const result = validateEnv({});

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.NEXT_PUBLIC_APP_NAME).toBe("Tahfidzh MJ");
      expect(result.data.QURAN_DATA_PROVIDER).toBe("equran");
    }
  });

  it("rejects unsupported Quran providers", () => {
    const result = validateEnv({
      QURAN_DATA_PROVIDER: "unknown",
    });

    expect(result.success).toBe(false);
  });

  it("can require DATABASE_URL for database setup", () => {
    const result = validateEnv({}, { requireDatabaseUrl: true });

    expect(result.success).toBe(false);
    expect(result.issues).toContainEqual({
      path: "DATABASE_URL",
      message: "DATABASE_URL wajib diisi untuk setup database.",
    });
  });
});
