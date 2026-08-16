import { createHash, randomBytes } from "node:crypto";

export const PASSWORD_RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function createPasswordResetToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashPasswordResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function isPasswordResetToken(value: string): boolean {
  return TOKEN_PATTERN.test(value);
}

export function buildPasswordResetUrl(appOrigin: string, token: string): string {
  const url = new URL("/reset-password", appOrigin);
  url.searchParams.set("token", token);
  return url.toString();
}
