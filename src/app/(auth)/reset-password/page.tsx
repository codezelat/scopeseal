import Link from "next/link";
import { AuthFrame } from "@/components/auth/auth-frame";
import { ResetPasswordForm } from "./reset-password-form";
import { Button } from "@/components/ui/button";
import { isPasswordResetToken } from "@/lib/password-reset-token";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token ?? "";
  const active = isPasswordResetToken(token);

  return (
    <AuthFrame
      title="Choose a new password"
      description="Your secure reset link can be used once and expires after 30 minutes."
    >
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">
            {active ? "Reset password" : "Link unavailable"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {active
              ? "Enter and confirm your new password."
              : "This reset link is invalid, expired, or already used."}
          </p>
        </div>

        {active ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/forgot-password">Request a new link</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="w-full">
              <Link href="/signin">Back to sign in</Link>
            </Button>
          </div>
        )}
      </div>
    </AuthFrame>
  );
}
