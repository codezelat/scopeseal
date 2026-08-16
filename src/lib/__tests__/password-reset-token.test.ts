import { describe, expect, it } from "vitest";
import {
  buildPasswordResetUrl,
  createPasswordResetToken,
  hashPasswordResetToken,
  isPasswordResetToken,
} from "../password-reset-token";

describe("password reset tokens", () => {
  it("creates unpredictable 256-bit base64url tokens", () => {
    const first = createPasswordResetToken();
    const second = createPasswordResetToken();

    expect(first).toHaveLength(43);
    expect(second).toHaveLength(43);
    expect(first).not.toBe(second);
    expect(isPasswordResetToken(first)).toBe(true);
  });

  it("stores a deterministic hash rather than the raw token", () => {
    const token = createPasswordResetToken();
    const hash = hashPasswordResetToken(token);

    expect(hash).toHaveLength(64);
    expect(hash).not.toContain(token);
    expect(hashPasswordResetToken(token)).toBe(hash);
  });

  it("rejects malformed tokens", () => {
    expect(isPasswordResetToken("short")).toBe(false);
    expect(isPasswordResetToken("a".repeat(42))).toBe(false);
    expect(isPasswordResetToken(`${"a".repeat(42)}!`)).toBe(false);
  });

  it("builds the reset URL on the trusted application origin", () => {
    const token = createPasswordResetToken();
    const url = new URL(buildPasswordResetUrl("https://scopeseal.codezela.com", token));

    expect(url.origin).toBe("https://scopeseal.codezela.com");
    expect(url.pathname).toBe("/reset-password");
    expect(url.searchParams.get("token")).toBe(token);
  });
});
