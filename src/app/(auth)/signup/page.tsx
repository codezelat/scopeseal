"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SealLogo } from "@/components/brand/seal-logo";

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUpAction, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <SealLogo size={44} withWordmark={false} />
          <h1 className="font-display text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Save reports, build a templates library, and review faster.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" autoComplete="name" required />
          </div>
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
              autoComplete="new-password"
              required
              minLength={8}
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
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="text-seal-violet hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
