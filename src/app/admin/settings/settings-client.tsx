"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function AdminSettingsClient({ initialQuota, initialMaintenance }: { initialQuota: number; initialMaintenance: boolean }) {
  const [quota, setQuota] = useState(String(initialQuota));
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [saving, setSaving] = useState<string | null>(null);

  async function save(key: "guestReportQuota" | "maintenanceMode", value: number | boolean) {
    setSaving(key);
    try {
      const response = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not save setting");
      toast.success("Setting saved");
    } catch (error) {
      if (key === "maintenanceMode") setMaintenance(!value);
      toast.error(error instanceof Error ? error.message : "Could not save setting");
    } finally { setSaving(null); }
  }

  function saveQuota() {
    const next = Number(quota);
    if (!Number.isInteger(next) || next < 0 || next > 100) return toast.error("Use a whole number from 0 to 100");
    void save("guestReportQuota", next);
  }

  function toggleMaintenance(checked: boolean) {
    setMaintenance(checked);
    void save("maintenanceMode", checked);
  }

  return (
    <div className="space-y-10">
      <header><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Administration</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Settings</h1><p className="mt-2 text-sm text-muted-foreground">Global access controls.</p></header>
      <section className="border-t border-border" aria-label="Global settings">
        <div className="grid gap-5 border-b border-border py-6 sm:grid-cols-[1fr_220px] sm:items-end"><div><h2 className="font-medium">Guest analysis limit</h2><p className="mt-1 text-sm text-muted-foreground">Reports available per browser every 30 days.</p></div><div className="flex gap-2"><div className="flex-1"><Label htmlFor="guest-quota" className="sr-only">Guest analysis limit</Label><Input id="guest-quota" type="number" min={0} max={100} inputMode="numeric" value={quota} onChange={(event) => setQuota(event.target.value)} /></div><Button onClick={saveQuota} disabled={saving === "guestReportQuota"}>{saving === "guestReportQuota" ? <Loader2 className="size-4 animate-spin" /> : "Save"}</Button></div></div>
        <div className="flex items-center justify-between gap-6 border-b border-border py-6"><div><h2 className="font-medium">Maintenance mode</h2><p className="mt-1 text-sm text-muted-foreground">Pause new analyses while keeping saved reports available.</p></div><div className="flex items-center gap-3">{saving === "maintenanceMode" ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}<Switch checked={maintenance} onCheckedChange={toggleMaintenance} aria-label="Maintenance mode" /></div></div>
      </section>
    </div>
  );
}
