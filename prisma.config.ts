import fs from "node:fs";
import { defineConfig } from "prisma/config";

// Prisma 7: the datasource `url` lives here (NOT in schema.prisma).
function loadDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const envFile = fs.readFileSync(".env", "utf8");
    const match = envFile.match(/DATABASE_URL="([^"]+)"/);
    if (match) return match[1];
  } catch {
    /* .env may not exist in some environments */
  }
  throw new Error(
    "DATABASE_URL is not set. Add it to .env (see .env.example).",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: loadDatabaseUrl() },
  migrations: { path: "prisma/migrations" },
});
