"use client";

import { useState } from "react";
import { CheckCircle2, Key, Loader2, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AiConfigData { provider: string; baseUrl: string; model: string; enabled: boolean; hasKey: boolean; keyHint: string }
const defaults: AiConfigData = { provider: "openai", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini", enabled: false, hasKey: false, keyHint: "" };

export function AiConfigClient({ initialConfig = defaults }: { initialConfig?: AiConfigData }) {
  const [config, setConfig] = useState<AiConfigData>(initialConfig);
  const [busy, setBusy] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [editingKey, setEditingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  async function load() {
    try {
      const response = await fetch("/api/admin/ai-config", { cache: "no-store" });
      const data = await response.json() as AiConfigData & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not load configuration");
      setConfig(data);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not load configuration"); }
  }

  async function save() {
    setBusy("save"); setTestResult(null);
    try {
      const response = await fetch("/api/admin/ai-config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider: config.provider, baseUrl: config.baseUrl, model: config.model, enabled: config.enabled, ...(apiKey ? { apiKey } : {}) }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not save configuration");
      setApiKey(""); setEditingKey(false); await load(); toast.success("Configuration saved");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save configuration"); }
    finally { setBusy(null); }
  }

  async function toggle(checked: boolean) {
    const previous = config.enabled; setConfig((value) => ({ ...value, enabled: checked })); setBusy("toggle");
    try {
      const response = await fetch("/api/admin/ai-config", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: checked }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not update AI enhancement");
      toast.success(checked ? "AI enhancement enabled" : "AI enhancement disabled");
    } catch (error) { setConfig((value) => ({ ...value, enabled: previous })); toast.error(error instanceof Error ? error.message : "Could not update AI enhancement"); }
    finally { setBusy(null); }
  }

  async function test() {
    setBusy("test"); setTestResult(null);
    try { const response = await fetch("/api/admin/ai-config/test", { method: "POST" }); const data = await response.json() as { success?: boolean; message?: string; error?: string }; setTestResult({ success: response.ok && data.success === true, message: data.message ?? data.error ?? "Connection failed" }); }
    catch { setTestResult({ success: false, message: "Connection failed" }); }
    finally { setBusy(null); }
  }

  async function removeKey() {
    setBusy("remove");
    try { const response = await fetch("/api/admin/ai-config", { method: "DELETE" }); const data = await response.json() as { error?: string }; if (!response.ok) throw new Error(data.error ?? "Could not remove key"); setConfig((value) => ({ ...value, enabled: false, hasKey: false, keyHint: "" })); toast.success("API key removed"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not remove key"); }
    finally { setBusy(null); }
  }

  return <div className="space-y-10">
    <header className="min-w-0"><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Administration</p><h1 className="mt-2 break-words font-display text-3xl font-semibold tracking-tight">AI Configuration</h1><p className="mt-2 max-w-xl break-words text-sm text-muted-foreground">Optional scope rewriting through a compatible provider.</p></header>
    <section className="border-t border-border" aria-label="AI settings">
      <div className="flex items-center justify-between gap-6 border-b border-border py-6"><div><h2 className="font-medium">AI enhancement</h2><p className="mt-1 text-sm text-muted-foreground">Keep off until a provider connection succeeds.</p></div><div className="flex items-center gap-3">{busy === "toggle" ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}<Switch checked={config.enabled} onCheckedChange={toggle} disabled={busy !== null} aria-label="AI enhancement" /></div></div>
      <div className="grid min-w-0 gap-6 border-b border-border py-7 sm:grid-cols-2">
        <div className="min-w-0 space-y-2"><Label htmlFor="provider">Provider</Label><Select value={config.provider} onValueChange={(provider) => setConfig((value) => ({ ...value, provider }))}><SelectTrigger id="provider" className="w-full min-w-0"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="openai">OpenAI</SelectItem><SelectItem value="openai-compatible">OpenAI-compatible</SelectItem></SelectContent></Select></div>
        <div className="min-w-0 space-y-2"><Label htmlFor="model">Model</Label><Input className="min-w-0" id="model" maxLength={100} value={config.model} onChange={(event) => setConfig((value) => ({ ...value, model: event.target.value }))} /></div>
        <div className="min-w-0 space-y-2 sm:col-span-2"><Label htmlFor="base-url">Base URL</Label><Input className="min-w-0" id="base-url" type="url" maxLength={500} value={config.baseUrl} onChange={(event) => setConfig((value) => ({ ...value, baseUrl: event.target.value }))} /></div>
        <div className="min-w-0 space-y-2 sm:col-span-2"><Label htmlFor="api-key">API key</Label>{config.hasKey && !editingKey ? <div className="flex min-w-0 flex-col gap-2 sm:flex-row"><div className="flex min-h-10 min-w-0 flex-1 items-center rounded-md border border-input px-3 text-sm text-muted-foreground"><Key className="mr-2 size-4 flex-none" /><span className="truncate">Configured {config.keyHint}</span></div><Button variant="outline" onClick={() => setEditingKey(true)}>Replace</Button><Dialog><DialogTrigger asChild><Button variant="outline" className="text-destructive hover:text-destructive"><Trash2 className="size-4" />Remove</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Remove API key?</DialogTitle><DialogDescription>AI enhancement will be disabled immediately.</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button variant="destructive" onClick={removeKey} disabled={busy !== null}>Remove key</Button></DialogFooter></DialogContent></Dialog></div> : <div className="flex min-w-0 flex-col gap-2 sm:flex-row"><Input className="min-w-0" id="api-key" type="password" autoComplete="new-password" maxLength={500} value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="Enter provider key" />{config.hasKey ? <Button variant="ghost" onClick={() => { setEditingKey(false); setApiKey(""); }}>Cancel</Button> : null}</div>}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2 py-6"><Button onClick={save} disabled={busy !== null}>{busy === "save" ? <Loader2 className="size-4 animate-spin" /> : null}Save</Button><Button variant="outline" onClick={test} disabled={busy !== null || !config.hasKey}>{busy === "test" ? <Loader2 className="size-4 animate-spin" /> : null}Test connection</Button>{testResult ? <p role="status" className={testResult.success ? "flex items-center gap-2 text-sm text-clear" : "flex items-center gap-2 text-sm text-missing"}>{testResult.success ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}{testResult.message}</p> : null}</div>
    </section>
  </div>;
}
