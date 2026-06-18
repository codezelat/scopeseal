import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/auth";
import { encrypt } from "@/lib/crypto";

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
    let keyHint = "";
    if (hasKey && config.apiKeyEncrypted) {
      const last4 = config.apiKeyEncrypted.slice(-4);
      keyHint = `••••${last4}`;
    }

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
  provider: z.string().min(1).max(50).optional(),
  baseUrl: z.string().url().optional(),
  apiKey: z.string().optional(),
  model: z.string().min(1).max(100).optional(),
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

    const raw = await req.json();
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

    const raw = await req.json();
    const parsed = patchSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input", code: "VALIDATION_ERROR" },
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
