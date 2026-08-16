import { db } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { z } from "zod";
import { isSafeProviderBaseUrl } from "@/lib/provider-url";

export interface AiEnhanceParams {
  scopeText: string;
  projectType: string;
  analysisSummary: string;
}

export interface AiEnhanceResult {
  rewrittenScope: string;
  improvements: string[];
}

const SYSTEM_PROMPT =
  "You are ScopeSeal AI, a project scope clarity expert. Rewrite the user's project scope to be clearer, more specific, and address identified gaps. Return JSON with 'rewrittenScope' (string) and 'improvements' (array of strings).";

export async function enhanceWithAi(
  params: AiEnhanceParams,
): Promise<AiEnhanceResult | null> {
  let config;
  try {
    config = await db.aiConfig.findUnique({ where: { id: "singleton" } });
  } catch {
    return null;
  }

  if (!config || !config.enabled || !config.apiKeyEncrypted) {
    return null;
  }
  if (!isSafeProviderBaseUrl(config.baseUrl)) return null;

  let apiKey: string;
  try {
    apiKey = decrypt(config.apiKeyEncrypted);
  } catch {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const url = `${config.baseUrl.replace(/\/+$/, "")}/chat/completions`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Project type: ${params.projectType}\n\nAnalysis summary: ${params.analysisSummary}\n\nOriginal scope:\n${params.scopeText}\n\nRewrite this scope to be clearer and more professional. Return as JSON.`,
          },
        ],
        temperature: 0.2,
        max_tokens: 4_000,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return null;
    }

    const responseText = await res.text();
    if (responseText.length > 2_000_000) return null;
    const data = JSON.parse(responseText);
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") return null;

    const parsed = z.object({
      rewrittenScope: z.string().min(1).max(100_000),
      improvements: z.array(z.string().min(1).max(500)).max(20).default([]),
    }).safeParse(JSON.parse(content));
    if (!parsed.success) return null;

    return {
      rewrittenScope: parsed.data.rewrittenScope,
      improvements: parsed.data.improvements,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
