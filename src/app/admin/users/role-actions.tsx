"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface RoleActionsProps {
  userId: string;
  currentRole: string;
}

export function RoleActions({ userId, currentRole }: RoleActionsProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggleRole = async () => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to change role");
      } else {
        toast.success(`Role changed to ${newRole}`);
        setOpen(false);
        router.refresh();
      }
    } catch {
      toast.error("Failed to change role");
    } finally {
      setLoading(false);
    }
  };

  const action = currentRole === "ADMIN" ? "Remove admin" : "Make admin";
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="outline" size="xs">{action}</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{action}?</DialogTitle><DialogDescription>This changes access to all administration tools.</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button variant="outline" disabled={loading}>Cancel</Button></DialogClose><Button onClick={toggleRole} disabled={loading}>{loading ? "Saving..." : "Confirm"}</Button></DialogFooter></DialogContent></Dialog>;
}
