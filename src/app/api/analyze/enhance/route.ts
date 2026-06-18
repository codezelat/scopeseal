import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { analyze, PROJECT_TYPE_OPTIONS, type ProjectType } from "@/lib/engine";
import { enhanceWithAi } from "@/lib/ai-client";

const projectTypes = PROJECT_TYPE_OPTIONS.map((o) => o.value) as [
  ProjectType,
  ...ProjectType[],
];

const bodySchema = z.object({
  scopeText: z
    .string()
    .min(10, "Scope text must be at least 10 characters")
    .max(50_000, "Scope text must be at most 50,000 characters"),
  projectType: z.enum(projectTypes),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required.", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const { scopeText, projectType } = parsed.data;

    const analysis = analyze(scopeText, projectType);
    const analysisSummary = [
      `Score: ${analysis.score}/100 (${analysis.band})`,
      `Missing items: ${analysis.missing.length}`,
      `Risks detected: ${analysis.risks.length}`,
      analysis.missing
        .slice(0, 3)
        .map((m) => `- ${m.label}: ${m.guidance}`)
        .join("\n"),
    ]
      .filter(Boolean)
      .join("\n");

    const result = await enhanceWithAi({
      scopeText,
      projectType,
      analysisSummary,
    });

    if (!result) {
      return NextResponse.json(
        { error: "AI enhancement is not configured or failed.", code: "AI_UNAVAILABLE" },
        { status: 503 },
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
