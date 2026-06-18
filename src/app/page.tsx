export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="bg-seal-gradient glow-seal flex h-20 w-20 items-center justify-center rounded-2xl font-display text-3xl font-bold text-white shadow-lg">
        S
      </div>
      <h1 className="font-display text-5xl font-bold tracking-tight">
        <span className="text-seal-gradient">ScopeSeal</span>
      </h1>
      <p className="font-sans max-w-md text-lg text-muted-foreground">
        Seal the gaps before they become unpaid work.
      </p>
      <div className="flex gap-3 text-sm font-medium">
        <span className="rounded-full bg-clear/15 px-3 py-1 text-clear">Clear</span>
        <span className="rounded-full bg-risk/15 px-3 py-1 text-risk">Review</span>
        <span className="rounded-full bg-missing/15 px-3 py-1 text-missing">Risky</span>
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        ink-950 · seal-violet · Sora / Geist / Geist Mono
      </p>
    </main>
  );
}
