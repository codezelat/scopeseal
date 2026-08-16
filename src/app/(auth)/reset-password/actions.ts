"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isPasswordResetEmailConfigured, sendPasswordChangedEmail } from "@/lib/email";
import { resetPasswordWithToken } from "@/lib/password-reset";
import { rateLimit } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-context";

const resetSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters.").max(128),
    confirmPassword: z.string().min(1, "Confirm your new password.").max(128),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordState = { error?: string } | undefined;

export async function resetPasswordAction(
  _previous: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const ip = await getRequestIp();
  const limit = rateLimit(ip, {
    namespace: "reset-password",
    maxRequests: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.success) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  let result;
  try {
    result = await resetPasswordWithToken(parsed.data.token, parsed.data.password);
  } catch (error) {
    console.error(
      "[password-reset] Failed to reset password:",
      error instanceof Error ? error.message : "Unknown reset error",
    );
    return { error: "We could not reset your password. Try again later." };
  }

  if (result.status === "invalid") {
    return { error: "This reset link is invalid or has expired." };
  }
  if (result.status === "reused") {
    return { error: "Choose a password different from your current password." };
  }

  if (isPasswordResetEmailConfigured()) {
    after(async () => {
      try {
        await sendPasswordChangedEmail(result.user);
      } catch (error) {
        console.error(
          "[password-reset] Failed to deliver confirmation email:",
          error instanceof Error ? error.message : "Unknown email error",
        );
      }
    });
  }

  redirect("/signin?reset=success");
}
