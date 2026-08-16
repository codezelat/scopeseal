import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  createPasswordResetToken,
  hashPasswordResetToken,
  isPasswordResetToken,
  PASSWORD_RESET_TOKEN_TTL_MS,
} from "@/lib/password-reset-token";

const REQUEST_COOLDOWN_MS = 60_000;

export interface PasswordResetDelivery {
  email: string;
  idempotencyKey: string;
  name: string | null;
  token: string;
}

export async function issuePasswordResetToken(
  email: string,
): Promise<PasswordResetDelivery | null> {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, passwordResetToken: true },
  });
  if (!user) return null;

  const now = Date.now();
  if (
    user.passwordResetToken &&
    now - user.passwordResetToken.createdAt.getTime() < REQUEST_COOLDOWN_MS
  ) {
    return null;
  }

  const token = createPasswordResetToken();
  const tokenHash = hashPasswordResetToken(token);
  const expiresAt = new Date(now + PASSWORD_RESET_TOKEN_TTL_MS);
  const record = await db.passwordResetToken.upsert({
    where: { userId: user.id },
    create: { userId: user.id, tokenHash, expiresAt },
    update: { tokenHash, expiresAt, createdAt: new Date(now) },
    select: { id: true },
  });

  return {
    email: user.email,
    idempotencyKey: record.id,
    name: user.name,
    token,
  };
}

export type ResetPasswordResult =
  | { status: "invalid" }
  | { status: "reused" }
  | {
      status: "success";
      user: {
        authVersion: number;
        email: string;
        id: string;
        name: string | null;
      };
    };

export async function resetPasswordWithToken(
  token: string,
  newPassword: string,
): Promise<ResetPasswordResult> {
  if (!isPasswordResetToken(token)) return { status: "invalid" };

  const tokenHash = hashPasswordResetToken(token);
  const now = new Date();
  const record = await db.passwordResetToken.findUnique({
    where: { tokenHash },
    include: {
      user: { select: { id: true, email: true, name: true, passwordHash: true } },
    },
  });
  if (!record || record.expiresAt <= now) return { status: "invalid" };

  if (await bcrypt.compare(newPassword, record.user.passwordHash)) {
    return { status: "reused" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  const user = await db.$transaction(async (transaction) => {
    const claim = await transaction.passwordResetToken.deleteMany({
      where: { id: record.id, tokenHash, expiresAt: { gt: now } },
    });
    if (claim.count !== 1) return null;

    const updatedUser = await transaction.user.update({
      where: { id: record.user.id },
      data: { passwordHash, authVersion: { increment: 1 } },
      select: { id: true, email: true, name: true, authVersion: true },
    });
    await transaction.passwordResetToken.deleteMany({ where: { userId: record.user.id } });
    await transaction.session.deleteMany({ where: { userId: record.user.id } });
    return updatedUser;
  });

  return user ? { status: "success", user } : { status: "invalid" };
}
