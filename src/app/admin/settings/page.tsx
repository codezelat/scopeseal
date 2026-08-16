import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AdminSettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const rows = await db.setting.findMany({ where: { key: { in: ["guestReportQuota", "maintenanceMode"] } } });
  const values = new Map(rows.map((row) => [row.key, row.value]));
  const quotaValue = values.get("guestReportQuota");
  const maintenanceValue = values.get("maintenanceMode");
  const quota = typeof quotaValue === "number" && Number.isInteger(quotaValue) ? quotaValue : Number(process.env.GUEST_REPORT_QUOTA ?? 3);
  return <AdminSettingsClient initialQuota={quota} initialMaintenance={maintenanceValue === true} />;
}
