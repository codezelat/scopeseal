import { getCurrentUser } from "@/auth";
import { SettingsClient } from "./settings-client";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  return <SettingsClient name={user.name ?? ""} email={user.email} role={user.role} />;
}
