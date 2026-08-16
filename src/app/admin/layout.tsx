import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminNavigation } from "@/components/product/admin-navigation";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | ScopeSeal Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen overflow-x-clip bg-background md:pl-60">
      <AdminNavigation name={user.name ?? "Admin"} email={user.email} />
      <main className="mx-auto min-h-[calc(100vh-4rem)] w-full min-w-0 max-w-6xl overflow-x-hidden px-4 pb-24 pt-8 sm:px-6 md:min-h-screen md:pb-10 md:pt-10">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
