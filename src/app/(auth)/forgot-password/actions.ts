"use server";

import { after } from "next/server";
import { z } from "zod";
import { isPasswordResetEmailConfigured, sendPasswordResetEmail } from "@/lib/email";
import { issuePasswordResetToken } from "@/lib/password-reset";
import { buildPasswordResetUrl } from "@/lib/password-reset-token";
import { rateLimit } from "@/lib/rate-limit";
import { getRequestIp, getTrustedAppOrigin } from "@/lib/request-context";

const requestSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254),
});

const GENERIC_SUCCESS =
  "If an account exists for that email, we sent a password reset link.";
const MINIMUM_RESPONSE_MS = 500;

export type ForgotPasswordState =
  | { error: string; success?: never }
  | { error?: never; success: string }
  | undefined;

async function waitForMinimumResponse(startedAt: number): Promise<void> {
  const remaining = MINIMUM_RESPONSE_MS - (Date.now() - startedAt);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
}

export async function forgotPasswordAction(
  _previous: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const startedAt = Date.now();
  const parsed = requestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    await waitForMinimumResponse(startedAt);
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  }

  if (!isPasswordResetEmailConfigured()) {
    await waitForMinimumResponse(startedAt);
    return {
      error: "Password recovery is temporarily unavailable. Contact support.",
    };
  }

  const ip = await getRequestIp();
  const limit = rateLimit(ip, {
    namespace: "forgot-password",
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.success) {
    await waitForMinimumResponse(startedAt);
    return { error: "Too many reset requests. Try again in a few minutes." };
  }

  try {
    const [appOrigin, delivery] = await Promise.all([
      getTrustedAppOrigin(),
      issuePasswordResetToken(parsed.data.email.toLowerCase()),
    ]);
    if (delivery) {
      const resetUrl = buildPasswordResetUrl(appOrigin, delivery.token);
      after(async () => {
        try {
          await sendPasswordResetEmail({ ...delivery, resetUrl });
        } catch (error) {
          console.error(
            "[password-reset] Failed to deliver reset email:",
            error instanceof Error ? error.message : "Unknown email error",
          );
        }
      });
    }
  } catch (error) {
    console.error(
      "[password-reset] Failed to create reset request:",
      error instanceof Error ? error.message : "Unknown reset error",
    );
    await waitForMinimumResponse(startedAt);
    return { error: "Password recovery is temporarily unavailable. Try again later." };
  }

  await waitForMinimumResponse(startedAt);
  return { success: GENERIC_SUCCESS };
}
