"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, Key, Trash2 } from "lucide-react";

interface AiConfigData {
  provider: string;
  baseUrl: string;
  model: string;
  enabled: boolean;
  hasKey: boolean;
  keyHint: string;
}

export default function AdminAiConfigPage() {
  const [config, setConfig] = useState<AiConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [provider, setProvider] = useState("openai");
  const [baseUrl, setBaseUrl] = useState("https://api.openai.com/v1");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [enabled, setEnabled] = useState(false);
  const [updatingKey, setUpdatingKey] = useState(false);

  useEffect(() => {
    fetch("/api/admin/ai-config")
      .then((r) => r.json())
      .then((data: AiConfigData) => {
        setConfig(data);
        setProvider(data.provider);
        setBaseUrl(data.baseUrl);
        setModel(data.model);
        setEnabled(data.enabled);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        provider,
        baseUrl,
        model,
        enabled,
      };
      if (apiKey) {
        body.apiKey = apiKey;
      }

      const res = await fetch("/api/admin/ai-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to save");
      } else {
        toast.success("AI configuration saved");
        setApiKey("");
        const fresh = await fetch("/api/admin/ai-config").then((r) =>
          r.json(),
        );
        setConfig(fresh);
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    setEnabled(checked);
    try {
      await fetch("/api/admin/ai-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: checked }),
      });
      toast.success(`AI enhancement ${checked ? "enabled" : "disabled"}`);
    } catch {
      toast.error("Failed to toggle");
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/ai-config/test", {
        method: "POST",
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({ success: false, message: "Request failed." });
    } finally {
      setTesting(false);
    }
  };

  const handleRemoveKey = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/ai-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          baseUrl,
          model,
          enabled: false,
          apiKey: "",
        }),
      });
      if (!res.ok) {
        toast.error("Failed to remove key");
      } else {
        setEnabled(false);
        toast.success("API key removed");
        const fresh = await fetch("/api/admin/ai-config").then((r) =>
          r.json(),
        );
        setConfig(fresh);
      }
    } catch {
      toast.error("Failed to remove key");
    } finally {
      setSaving(false);
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
        <h1 className="font-display text-2xl font-bold">AI Configuration</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure an OpenAI-compatible API for AI-powered scope enhancement.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Enhancement</CardTitle>
              <CardDescription>
                Enable or disable AI-powered scope rewriting.
              </CardDescription>
            </div>
            <Switch checked={enabled} onCheckedChange={handleToggle} />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Provider Settings</CardTitle>
          <CardDescription>
            Works with OpenAI, Azure OpenAI, OpenRouter, Groq, Together AI, and
            any OpenAI-compatible API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-provider">Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger id="ai-provider" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="openai-compatible">OpenAI-compatible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-base-url">Base URL</Label>
            <Input
              id="ai-base-url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-api-key">API Key</Label>
            {config?.hasKey && !updatingKey ? (
              <div className="flex items-center gap-2">
                <div className="flex h-8 flex-1 items-center rounded-lg border border-input bg-muted px-2.5 text-sm text-muted-foreground">
                  <Key className="mr-2 size-3.5" />
                  Key configured ({config.keyHint})
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUpdatingKey(true)}
                >
                  Update key
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveKey}
                  disabled={saving}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  id="ai-api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                />
                {config?.hasKey && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUpdatingKey(false)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-model">Model</Label>
            <Input
              id="ai-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4o-mini"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Configuration
            </Button>
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testing || !config?.hasKey}
            >
              {testing && <Loader2 className="mr-2 size-4 animate-spin" />}
              Test Connection
            </Button>
          </div>

          {testResult && (
            <div
              className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                testResult.success
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-300"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="size-4 shrink-0" />
              ) : (
                <XCircle className="size-4 shrink-0" />
              )}
              {testResult.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
