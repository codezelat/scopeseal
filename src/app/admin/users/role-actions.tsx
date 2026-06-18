"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RoleActionsProps {
  userId: string;
  currentRole: string;
}

export function RoleActions({ userId, currentRole }: RoleActionsProps) {
  const [loading, setLoading] = useState(false);

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
        window.location.reload();
      }
    } catch {
      toast.error("Failed to change role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="xs"
      onClick={toggleRole}
      disabled={loading}
    >
      {loading
        ? "Saving..."
        : currentRole === "ADMIN"
          ? "Demote"
          : "Promote"}
    </Button>
  );
}
