import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const settings = await db.setting.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

const patchSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.unknown(),
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

    const { key, value } = parsed.data;

    await db.setting.upsert({
      where: { key },
      update: { value: value as boolean },
      create: { key, value: value as boolean },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
