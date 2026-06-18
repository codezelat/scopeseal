"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SealLogo } from "@/components/brand/seal-logo";

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(signInAction, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <SealLogo size={44} withWordmark={false} />
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to save reviews and run deeper analysis.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {state?.error ? (
            <p className="text-sm text-missing" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-seal-gradient text-white hover:opacity-95"
          >
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link
            href="/signup"
            className="text-seal-violet hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
