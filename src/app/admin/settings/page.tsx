"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SettingRow {
  id: string;
  key: string;
  value: unknown;
}

const KNOWN_SETTINGS = [
  { key: "guestReportQuota", label: "Guest Report Quota", type: "number" as const },
  { key: "siteName", label: "Site Name", type: "string" as const },
  { key: "maintenanceMode", label: "Maintenance Mode", type: "boolean" as const },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getSettingValue = (key: string): unknown => {
    const found = settings.find((s) => s.key === key);
    return found?.value;
  };

  const saveSetting = async (key: string, value: unknown) => {
    setSaving(key);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to save");
      } else {
        toast.success(`${key} saved`);
        setSettings((prev) => {
          const idx = prev.findIndex((s) => s.key === key);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], value };
            return next;
          }
          return [...prev, { id: key, key, value }];
        });
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage global platform settings.
        </p>
      </div>

      <div className="grid gap-4">
        {KNOWN_SETTINGS.map((setting) => {
          const value = getSettingValue(setting.key);

          if (setting.type === "boolean") {
            return (
              <Card key={setting.key}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {setting.key}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {saving === setting.key && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    <Switch
                      checked={!!value}
                      onCheckedChange={(checked) =>
                        saveSetting(setting.key, checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            );
          }

          return (
            <SettingInputCard
              key={setting.key}
              label={setting.label}
              settingKey={setting.key}
              value={value}
              type={setting.type}
              saving={saving === setting.key}
              onSave={saveSetting}
            />
          );
        })}
      </div>
    </div>
  );
}

function SettingInputCard({
  label,
  settingKey,
  value,
  type,
  saving,
  onSave,
}: {
  label: string;
  settingKey: string;
  value: unknown;
  type: "string" | "number";
  saving: boolean;
  onSave: (key: string, value: unknown) => void;
}) {
  const [inputValue, setInputValue] = useState(
    value !== undefined && value !== null ? String(value) : "",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{label}</CardTitle>
        <CardDescription>{settingKey}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor={`setting-${settingKey}`} className="sr-only">
              {label}
            </Label>
            <Input
              id={`setting-${settingKey}`}
              type={type}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            onClick={() =>
              onSave(
                settingKey,
                type === "number" ? Number(inputValue) : inputValue,
              )
            }
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
