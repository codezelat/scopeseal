import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/auth";
import { encrypt } from "@/lib/crypto";
import { isSafeProviderBaseUrl } from "@/lib/provider-url";
import { readJsonBody } from "@/lib/http";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const config = await db.aiConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!config) {
      return NextResponse.json({
        provider: "openai",
        baseUrl: "https://api.openai.com/v1",
        model: "gpt-4o-mini",
        enabled: false,
        hasKey: false,
        keyHint: "",
      });
    }

    const hasKey = !!config.apiKeyEncrypted;
    const keyHint = hasKey ? "stored securely" : "";

    return NextResponse.json({
      provider: config.provider,
      baseUrl: config.baseUrl,
      model: config.model,
      enabled: config.enabled,
      hasKey,
      keyHint,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

const putSchema = z.object({
  provider: z.enum(["openai", "openai-compatible"]).optional(),
  baseUrl: z.string().trim().url().refine(isSafeProviderBaseUrl, "Use a public HTTPS provider URL").optional(),
  apiKey: z.string().max(500).optional(),
  model: z.string().trim().min(1).max(100).optional(),
  enabled: z.boolean().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const raw = await readJsonBody(req);
    const parsed = putSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const existing = await db.aiConfig.findUnique({
      where: { id: "singleton" },
    });

    let apiKeyEncrypted: string | undefined;
    if (data.apiKey && data.apiKey.length > 0) {
      apiKeyEncrypted = encrypt(data.apiKey);
    }

    const upsertData = {
      provider: data.provider ?? existing?.provider ?? "openai",
      baseUrl: data.baseUrl ?? existing?.baseUrl ?? "https://api.openai.com/v1",
      model: data.model ?? existing?.model ?? "gpt-4o-mini",
      enabled: data.enabled ?? existing?.enabled ?? false,
      ...(apiKeyEncrypted ? { apiKeyEncrypted } : {}),
    };

    if (upsertData.enabled && !apiKeyEncrypted && !existing?.apiKeyEncrypted) {
      return NextResponse.json(
        { error: "Add an API key before enabling AI enhancement.", code: "AI_KEY_REQUIRED" },
        { status: 400 },
      );
    }

    await db.aiConfig.upsert({
      where: { id: "singleton" },
      update: upsertData,
      create: {
        id: "singleton",
        ...upsertData,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

const patchSchema = z.object({
  enabled: z.boolean(),
});

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const raw = await readJsonBody(req);
    const parsed = patchSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const existing = await db.aiConfig.findUnique({
      where: { id: "singleton" },
      select: { apiKeyEncrypted: true },
    });
    if (parsed.data.enabled && !existing?.apiKeyEncrypted) {
      return NextResponse.json(
        { error: "Add an API key before enabling AI enhancement.", code: "AI_KEY_REQUIRED" },
        { status: 400 },
      );
    }

    await db.aiConfig.upsert({
      where: { id: "singleton" },
      update: { enabled: parsed.data.enabled },
      create: {
        id: "singleton",
        enabled: parsed.data.enabled,
      },
    });

    return NextResponse.json({ success: true, enabled: parsed.data.enabled });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    await db.aiConfig.upsert({ where: { id: "singleton" }, update: { apiKeyEncrypted: null, enabled: false }, create: { id: "singleton", apiKeyEncrypted: null, enabled: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred.", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
