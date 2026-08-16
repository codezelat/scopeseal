import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { isPasswordResetEmailConfigured, sendPasswordChangedEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-context";

const bodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const limit = await rateLimit(await getRequestIp(), {
      namespace: "change-password",
      maxRequests: 5,
      windowMs: 15 * 60 * 1_000,
    });
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many password attempts. Try again later.", code: "RATE_LIMITED" },
        { status: 429 },
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

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, passwordHash: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "User not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const ok = await bcrypt.compare(
      parsed.data.currentPassword,
      user.passwordHash,
    );
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect", code: "INVALID_PASSWORD" },
        { status: 400 },
      );
    }

    if (await bcrypt.compare(parsed.data.newPassword, user.passwordHash)) {
      return NextResponse.json(
        { error: "Choose a password different from your current password", code: "PASSWORD_REUSED" },
        { status: 400 },
      );
    }

    const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
    const updated = await db.$transaction(async (transaction) => {
      const nextUser = await transaction.user.update({
        where: { id: session.user.id },
        data: { passwordHash: newHash, authVersion: { increment: 1 } },
        select: { id: true, email: true, name: true, authVersion: true },
      });
      await transaction.session.deleteMany({ where: { userId: session.user.id } });
      return nextUser;
    });

    if (isPasswordResetEmailConfigured()) {
      after(async () => {
        try {
          await sendPasswordChangedEmail(updated);
        } catch {
          // Password changes must succeed even if the confirmation email is unavailable.
        }
      });
    }

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
