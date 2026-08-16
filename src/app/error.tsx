"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SealLogo } from "@/components/brand/seal-logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/brand/theme-toggle";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <SealLogo size={48} withWordmark={false} />
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
        <p className="max-w-md text-muted-foreground">Please try again or return home.</p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={reset}
        >
          Try again
        </Button>
        <Button variant="outline" asChild><Link href="/">Home</Link></Button>
      </div>
    </main>
  );
}
