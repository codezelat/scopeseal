import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-context";
import { readJsonBody } from "@/lib/http";

const bodySchema = z.object({ password: z.string().min(1).max(128) });

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const limit = await rateLimit(await getRequestIp(), {
      namespace: "delete-account",
      maxRequests: 5,
      windowMs: 60 * 60 * 1_000,
    });
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later.", code: "RATE_LIMITED" },
        { status: 429 },
      );
    }

    const parsed = bodySchema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter your password", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Password is incorrect", code: "INVALID_PASSWORD" },
        { status: 400 },
      );
    }

    await db.$transaction([
      db.review.deleteMany({ where: { userId: session.user.id } }),
      db.user.delete({ where: { id: session.user.id } }),
    ]);

    return NextResponse.json(
      { success: true },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred", code: "INTERNAL_ERROR" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
