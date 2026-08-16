import { describe, expect, it } from "vitest";
import { normalizeDatabaseUrl } from "../database-url";

describe("normalizeDatabaseUrl", () => {
  it("preserves certificate verification and removes channel binding", () => {
    const normalized = normalizeDatabaseUrl(
      "postgresql://user:pass@example.neon.tech/db?sslmode=require&channel_binding=require",
    );

    expect(normalized).toContain("sslmode=verify-full");
    expect(normalized).not.toContain("channel_binding");
  });

  it("keeps an explicit SSL mode", () => {
    expect(
      normalizeDatabaseUrl(
        "postgresql://user:pass@example.neon.tech/db?sslmode=verify-ca",
      ),
    ).toContain("sslmode=verify-ca");
  });

  it("rejects non-PostgreSQL URLs", () => {
    expect(() => normalizeDatabaseUrl("https://example.com/db")).toThrow(
      "PostgreSQL protocol",
    );
  });
});
