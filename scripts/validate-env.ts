import { validateEnv } from "../src/lib/env";

const requireDatabaseUrl = process.argv.includes("--require-database-url");
const result = validateEnv(process.env, { requireDatabaseUrl });

if (!result.success) {
  console.error("Environment variable tidak valid:");

  for (const issue of result.issues) {
    console.error(`- ${issue.path}: ${issue.message}`);
  }

  process.exit(1);
}

console.log("Environment variable valid.");
