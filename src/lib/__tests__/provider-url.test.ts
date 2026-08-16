import { describe, expect, it } from "vitest";
import { isSafeProviderBaseUrl } from "../provider-url";

describe("provider URL validation", () => {
  it.each([
    "https://api.openai.com/v1",
    "https://models.example.org/openai/v1",
    "https://1.1.1.1/v1",
  ])("accepts a public HTTPS provider: %s", (url) => {
    expect(isSafeProviderBaseUrl(url)).toBe(true);
  });

  it.each([
    "http://api.openai.com/v1",
    "https://localhost:3000/v1",
    "https://service.local/v1",
    "https://127.0.0.1/v1",
    "https://10.0.0.1/v1",
    "https://169.254.169.254/latest/meta-data",
    "https://192.168.1.20/v1",
    "https://[::1]/v1",
    "https://user:password@example.com/v1",
  ])("rejects an unsafe provider URL: %s", (url) => {
    expect(isSafeProviderBaseUrl(url)).toBe(false);
  });
});
