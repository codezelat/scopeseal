import Link from "next/link";
import { SealLogo } from "@/components/brand/seal-logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/brand/theme-toggle";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <SealLogo size={48} withWordmark={false} />
      <div className="space-y-2">
        <p className="font-mono text-6xl font-bold text-primary">404</p>
        <h1 className="font-display text-2xl font-bold">Page not found</h1>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button asChild><Link href="/">Back to home</Link></Button>
    </main>
  );
}
