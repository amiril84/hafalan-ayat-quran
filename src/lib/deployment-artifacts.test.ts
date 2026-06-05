import { readFileSync } from "node:fs";

describe("deployment artifacts", () => {
  it("documents setup and deployment commands", () => {
    const readme = readFileSync("README.md", "utf8");

    expect(readme).toContain("corepack pnpm validate:env");
    expect(readme).toContain("corepack pnpm db:setup");
    expect(readme).toContain("corepack pnpm build");
  });

  it("defines Vercel commands", () => {
    const vercelConfig = JSON.parse(readFileSync("vercel.json", "utf8")) as {
      framework: string;
      installCommand: string;
      buildCommand: string;
    };

    expect(vercelConfig.framework).toBe("nextjs");
    expect(vercelConfig.installCommand).toContain("pnpm install");
    expect(vercelConfig.buildCommand).toBe("corepack pnpm build");
  });

  it("runs the full quality gate in GitHub Actions", () => {
    const workflow = readFileSync(".github/workflows/ci.yml", "utf8");

    expect(workflow).toContain("corepack pnpm validate:env");
    expect(workflow).toContain("corepack pnpm lint");
    expect(workflow).toContain("corepack pnpm typecheck");
    expect(workflow).toContain("corepack pnpm test -- --run");
    expect(workflow).toContain("corepack pnpm test:e2e");
    expect(workflow).toContain("corepack pnpm build");
  });

  it("exposes env validation and database setup package scripts", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts["validate:env"]).toBe(
      "tsx scripts/validate-env.ts",
    );
    expect(packageJson.scripts["validate:env:db"]).toContain(
      "--require-database-url",
    );
    expect(packageJson.scripts["db:setup"]).toContain("pnpm db:migrate");
  });
});
