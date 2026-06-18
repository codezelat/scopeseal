import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  if (user.role !== "ADMIN") redirect("/app");
  return user;
}
