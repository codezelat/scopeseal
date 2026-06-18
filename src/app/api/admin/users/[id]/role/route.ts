import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/auth";

const roleSchema = z.object({
  role: z.enum(["ADMIN", "USER"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const raw = await req.json();
    const parsed = roleSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    if (user.id === id && parsed.data.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You cannot demote yourself.", code: "SELF_DEMOTE" },
        { status: 400 },
      );
    }

    const target = await db.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json(
        { error: "User not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    await db.user.update({
      where: { id },
      data: { role: parsed.data.role },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
