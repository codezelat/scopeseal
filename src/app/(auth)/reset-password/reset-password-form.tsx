"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "./actions";
import { SealLoader } from "@/components/brand/seal-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, undefined);

  return (
    <form action={formAction} className="space-y-5" aria-describedby="reset-error">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          autoFocus
          placeholder="At least 8 characters"
          className="mt-2"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          placeholder="Enter it again"
          className="mt-2"
        />
      </div>
      <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>
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
            <SealLoader size={18} /> Updating password...
          </>
        ) : (
          "Update password"
        )}
      </Button>
    </form>
  );
}
