"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { forgotPasswordAction } from "./actions";
import { AuthFrame } from "@/components/auth/auth-frame";
import { SealLoader } from "@/components/brand/seal-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, undefined);

  return (
    <AuthFrame
      title="Recover your account"
      description="Get a secure, single-use link to choose a new password."
    >
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Forgot password?</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Enter the email connected to your account.
          </p>
        </div>

        {state?.success ? (
          <div className="space-y-6" aria-live="polite">
            <div className="border-l-2 border-clear pl-4">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <CheckCircle2 className="size-4 text-clear" aria-hidden="true" />
                Check your email
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {state.success} The link expires in 30 minutes.
              </p>
            </div>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/signin">Back to sign in</Link>
            </Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-5" aria-describedby="reset-error">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                maxLength={254}
                required
                autoFocus
                className="mt-2"
              />
            </div>
            <div id="reset-error" className="min-h-5" aria-live="polite">
              {state?.error ? (
                <p className="text-sm text-missing" role="alert">
                  {state.error}
                </p>
              ) : null}
            </div>
            <Button type="submit" disabled={pending} size="lg" className="w-full">
              {pending ? (
                <>
                  <SealLoader size={18} /> Sending link...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Remembered it?{" "}
              <Link href="/signin" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </AuthFrame>
  );
}
