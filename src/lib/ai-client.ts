import { db } from "@/lib/db";
import { decrypt } from "@/lib/crypto";

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
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") return null;

    const parsed = JSON.parse(content) as {
      rewrittenScope?: unknown;
      improvements?: unknown;
    };

    if (typeof parsed.rewrittenScope !== "string") return null;
    const improvements = Array.isArray(parsed.improvements)
      ? parsed.improvements.filter((i): i is string => typeof i === "string")
      : [];

    return {
      rewrittenScope: parsed.rewrittenScope,
      improvements,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
