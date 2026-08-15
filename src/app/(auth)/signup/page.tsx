"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SealLoader } from "@/components/brand/seal-loader";
import { AuthFrame } from "@/components/auth/auth-frame";

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUpAction, undefined);

  return (
    <AuthFrame
      title="Create your account"
      description="Save reports, use scope templates, and review faster."
    >
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <form action={formAction} className="space-y-5" aria-describedby="auth-error">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" autoComplete="name" placeholder="Your name" required maxLength={100} className="mt-2" />
          </div>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              placeholder="At least 8 characters"
              className="mt-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">At least 8 characters.</p>
          </div>
          <div id="auth-error" className="min-h-5" aria-live="polite">
            {state?.error ? (
              <p className="text-sm text-missing" role="alert">{state.error}</p>
            ) : null}
          </div>
          <Button
            type="submit"
            disabled={pending}
            size="lg"
            className="w-full"
          >
            {pending ? <><SealLoader size={18} />Creating account...</> : "Create account"}
          </Button>
        </form>
      </div>
    </AuthFrame>
  );
}
