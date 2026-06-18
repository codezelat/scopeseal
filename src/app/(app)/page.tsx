import Link from "next/link";
import { getCurrentUser } from "@/auth";
import { SealLogo } from "@/components/brand/seal-logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Badge } from "@/components/ui/badge";

export default async function AppHome() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <SealLogo size={28} withWordmark />
        </Link>
        <SignOutButton />
      </header>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-3xl font-bold">
            Hi, {user?.name ?? "there"}
          </h1>
          {user?.role === "ADMIN" ? (
            <Badge className="bg-seal-gradient text-white">Admin</Badge>
          ) : null}
        </div>
        <p className="text-muted-foreground">
          You&apos;re signed in as {user?.email}. The full review workspace lands
          here next.
        </p>
      </div>
    </main>
  );
}
