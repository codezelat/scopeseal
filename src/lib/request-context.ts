import { headers } from "next/headers";

const LOCAL_HOST_PATTERN = /^(localhost|127\.0\.0\.1)(:\d+)?$/i;

export async function getRequestIp(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (forwarded || requestHeaders.get("x-real-ip") || "unknown").slice(0, 128);
}

export async function getTrustedAppOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) {
    const url = new URL(configured);
    const isLocal = LOCAL_HOST_PATTERN.test(url.host);
    if (url.protocol !== "https:" && !isLocal) {
      throw new Error("NEXT_PUBLIC_APP_URL must use HTTPS in production.");
    }
    return url.origin;
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("host")?.trim() ?? "";
  if (!LOCAL_HOST_PATTERN.test(host)) {
    throw new Error("NEXT_PUBLIC_APP_URL is required outside localhost.");
  }
  return `http://${host}`;
}
