import type { Metadata } from "next";
import { AiConfigClient } from "./ai-config-client";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "AI Configuration" };
export const dynamic = "force-dynamic";
export default async function AdminAiConfigPage() {
  const row = await db.aiConfig.findUnique({ where: { id: "singleton" } });
  const initialConfig = row ? { provider: row.provider, baseUrl: row.baseUrl, model: row.model, enabled: row.enabled, hasKey: Boolean(row.apiKeyEncrypted), keyHint: row.apiKeyEncrypted ? "stored securely" : "" } : { provider: "openai", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini", enabled: false, hasKey: false, keyHint: "" };
  return <AiConfigClient initialConfig={initialConfig} />;
}
