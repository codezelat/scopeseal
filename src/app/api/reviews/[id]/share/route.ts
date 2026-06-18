import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";

const bodySchema = z.object({
  isShared: z.boolean(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const review = await db.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json(
        { error: "Review not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }
    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const updated = await db.review.update({
      where: { id },
      data: { isShared: parsed.data.isShared },
    });

    const origin = req.nextUrl.origin;
    const shareUrl = updated.isShared
      ? `${origin}/result/${updated.shareSlug}`
      : null;

    return NextResponse.json(
      { isShared: updated.isShared, shareUrl },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred", code: "INTERNAL_ERROR" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
