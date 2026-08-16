import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/auth";
import { AppNavigation } from "@/components/product/app-navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation
        name={user.name ?? "User"}
        email={user.email}
        isAdmin={user.role === "ADMIN"}
      />
      <div className="min-w-0 pb-20 md:ml-60 md:pb-0">{children}</div>
    </div>
  );
}
