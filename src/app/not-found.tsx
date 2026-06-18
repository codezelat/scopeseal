import Link from "next/link";
import { SealLogo } from "@/components/brand/seal-logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <SealLogo size={48} withWordmark={false} />
      <div className="space-y-2">
        <p className="font-mono text-6xl font-bold text-seal-gradient">404</p>
        <h1 className="font-display text-2xl font-bold">Page not found</h1>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link href="/">
        <Button className="bg-seal-gradient text-white hover:opacity-95">
          Back to home
        </Button>
      </Link>
    </main>
  );
}
