import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  return <div className="min-h-screen bg-background">{children}</div>;
}
