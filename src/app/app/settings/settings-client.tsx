"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsClientProps {
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
}

export function SettingsClient({ name: initialName, email, role }: SettingsClientProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [savedName, setSavedName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  async function saveName() {
    const cleanName = name.trim();
    if (!cleanName) return toast.error("Enter your name");
    setSaving(true);
    try {
      const response = await fetch("/api/user/update-name", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
      });
      if (!response.ok) return toast.error(await readError(response, "Could not update name"));
      setName(cleanName);
      setSavedName(cleanName);
      router.refresh();
      toast.success("Name updated");
    } catch {
      toast.error("Could not update name");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) return toast.error("Complete all password fields");
    if (newPassword.length < 8) return toast.error("Use at least 8 characters");
    if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
    setChangingPassword(true);
    try {
      const response = await fetch("/api/user/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!response.ok) return toast.error(await readError(response, "Could not change password"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed. Sign in again.");
      await signOut({ callbackUrl: "/signin?reset=success" });
    } catch {
      toast.error("Could not change password");
    } finally {
      setChangingPassword(false);
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      if (!response.ok) return toast.error(await readError(response, "Could not delete account"));
      await signOut({ callbackUrl: "/" });
    } catch {
      toast.error("Could not delete account");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
      <h1 className="mb-10 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>

      <section className="grid gap-6 border-t border-border py-8 sm:grid-cols-[180px_1fr]" aria-labelledby="profile-heading">
        <div>
          <h2 id="profile-heading" className="font-display font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your account details.</p>
        </div>
        <div className="space-y-5">
          <div className="grid gap-1.5"><Label htmlFor="email">Email</Label><Input id="email" value={email} disabled /></div>
          <div className="grid gap-1.5"><Label htmlFor="role">Role</Label><Input id="role" value={role === "ADMIN" ? "Admin" : "Member"} disabled /></div>
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <div className="flex flex-col gap-2 sm:flex-row"><Input id="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={100} autoComplete="name" /><Button onClick={saveName} disabled={saving || name.trim() === savedName}>{saving ? "Saving..." : "Save"}</Button></div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 border-t border-border py-8 sm:grid-cols-[180px_1fr]" aria-labelledby="appearance-heading">
        <div><h2 id="appearance-heading" className="font-display font-semibold">Appearance</h2></div>
        <div className="flex min-h-11 items-center justify-between gap-4"><p className="text-sm text-muted-foreground">Light or dark theme</p><ThemeToggle /></div>
      </section>

      <section className="grid gap-6 border-t border-border py-8 sm:grid-cols-[180px_1fr]" aria-labelledby="password-heading">
        <div><h2 id="password-heading" className="font-display font-semibold">Password</h2></div>
        <div className="space-y-4">
          <div className="grid gap-1.5"><Label htmlFor="current-password">Current password</Label><Input id="current-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" maxLength={128} /></div>
          <div className="grid gap-1.5"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" maxLength={128} /></div>
          <div className="grid gap-1.5"><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" maxLength={128} /></div>
          <Button onClick={changePassword} disabled={changingPassword}>{changingPassword ? "Changing..." : "Change password"}</Button>
        </div>
      </section>

      <section className="grid gap-6 border-y border-border py-8 sm:grid-cols-[180px_1fr]" aria-labelledby="delete-heading">
        <div><h2 id="delete-heading" className="font-display font-semibold text-destructive">Delete account</h2></div>
        <div>
          <p className="mb-4 text-sm text-muted-foreground">Permanently removes your account.</p>
          <Dialog>
            <DialogTrigger asChild><Button variant="destructive">Delete account</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Delete account?</DialogTitle><DialogDescription>This permanently removes your account and saved reviews. Enter your password to confirm.</DialogDescription></DialogHeader>
              <div className="grid gap-2 py-2"><Label htmlFor="delete-password">Password</Label><Input id="delete-password" type="password" autoComplete="current-password" maxLength={128} value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} /></div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline" disabled={deleting}>Cancel</Button></DialogClose>
                <Button variant="destructive" onClick={deleteAccount} disabled={deleting || !deletePassword}>{deleting ? "Deleting..." : "Delete permanently"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  );
}
