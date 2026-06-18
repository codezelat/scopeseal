"use client";

import { SealLoader } from "@/components/brand/seal-loader";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <SealLoader size={48} />
      <p className="font-mono text-sm text-muted-foreground">Loading…</p>
    </main>
  );
}
