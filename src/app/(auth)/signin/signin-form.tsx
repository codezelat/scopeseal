"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { signInAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SealLoader } from "@/components/brand/seal-loader";

export function SignInForm({ passwordReset }: { passwordReset: boolean }) {
  const [state, formAction, pending] = useActionState(signInAction, undefined);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>

      {passwordReset ? (
        <div
          className="flex items-start gap-3 border-l-2 border-clear pl-4 text-sm"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-clear" aria-hidden="true" />
          <p className="leading-6 text-muted-foreground">
            Password updated. Sign in with your new password.
          </p>
        </div>
      ) : null}

      <form action={formAction} className="space-y-5" aria-describedby="auth-error">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            maxLength={254}
            required
            className="mt-2"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            maxLength={128}
            required
            className="mt-2"
          />
        </div>
        <div id="auth-error" className="min-h-5" aria-live="polite">
          {state?.error ? (
            <p className="text-sm text-missing" role="alert">
              {state.error}
            </p>
          ) : null}
        </div>
        <Button type="submit" disabled={pending} size="lg" className="w-full">
          {pending ? (
            <>
              <SealLoader size={18} /> Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}
