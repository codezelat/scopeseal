import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import {
  analyze,
  PROJECT_TYPE_OPTIONS,
  type ProjectType,
} from "@/lib/engine";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { checkGuestQuota, incrementGuestCount } from "@/lib/guest-quota";
import { rateLimit } from "@/lib/rate-limit";
import type { Prisma, ReviewBand } from "@/generated/prisma/client";
import { getPlatformSetting } from "@/lib/platform-settings";

const projectTypes = PROJECT_TYPE_OPTIONS.map((o) => o.value) as [
  ProjectType,
  ...ProjectType[],
];

const bodySchema = z.object({
  text: z
    .string()
    .min(50, "Scope text must be at least 50 characters")
    .max(50_000, "Scope text must be at most 50,000 characters"),
  projectType: z.enum(projectTypes),
});

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function bandToPrisma(band: string): ReviewBand {
  if (band === "clear") return "clear" as ReviewBand;
  if (band === "review") return "review" as ReviewBand;
  return "risky" as ReviewBand;
}

export async function POST(req: NextRequest) {
  try {
    const maintenanceMode = await getPlatformSetting("maintenanceMode", false);
    if (maintenanceMode === true) {
      return NextResponse.json(
        { error: "Analysis is temporarily paused. Please try again soon.", code: "MAINTENANCE" },
        { status: 503, headers: { "Retry-After": "300", "Cache-Control": "no-store" } },
      );
    }

    const ip = getIp(req);
    const rl = await rateLimit(ip);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later.", code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
      );
    }

    const session = await auth();
    const isGuest = !session?.user;

    if (isGuest) {
      const quota = await checkGuestQuota();
      if (!quota.allowed) {
        return NextResponse.json(
          {
            error: "Guest quota exceeded. Sign in for unlimited analyses.",
            code: "QUOTA_EXCEEDED",
            guestQuota: { used: quota.used, quota: quota.quota },
          },
          { status: 403 },
        );
      }
    }

    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const { text, projectType } = parsed.data;
    const result = analyze(text, projectType);
    const shareSlug = randomBytes(18).toString("base64url");

    const review = await db.review.create({
      data: {
        userId: session?.user?.id ?? null,
        projectType,
        inputText: text.slice(0, 5000),
        inputWordCount: result.wordCount,
        score: result.score,
        band: bandToPrisma(result.band),
        sensitiveWarning: result.sensitiveWarning,
        categories: result.categories as unknown as Prisma.InputJsonValue,
        missing: result.missing as unknown as Prisma.InputJsonValue,
        risks: result.risks as unknown as Prisma.InputJsonValue,
        suggestions: result.suggestions as unknown as Prisma.InputJsonValue,
        outputs: result.outputs as unknown as Prisma.InputJsonValue,
        shareSlug,
        isShared: isGuest,
      },
    });

    if (isGuest) {
      await incrementGuestCount();
    }

    const quotaAfterAnalysis = isGuest ? await checkGuestQuota() : undefined;
    const guestQuota = quotaAfterAnalysis
      ? { used: quotaAfterAnalysis.used, quota: quotaAfterAnalysis.quota }
      : undefined;

    return NextResponse.json(
      {
        result,
        reviewId: review.id,
        shareSlug: review.shareSlug,
        guestQuota,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again.", code: "INTERNAL_ERROR" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
