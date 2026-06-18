import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/auth";
import { decrypt } from "@/lib/crypto";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const config = await db.aiConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!config || !config.apiKeyEncrypted) {
      return NextResponse.json({
        success: false,
        message: "No API key configured.",
      });
    }

    let apiKey: string;
    try {
      apiKey = decrypt(config.apiKeyEncrypted);
    } catch {
      return NextResponse.json({
        success: false,
        message: "Failed to decrypt API key. Check AI_ENCRYPTION_KEY.",
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const url = `${config.baseUrl.replace(/\/+$/, "")}/models`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return NextResponse.json({
          success: false,
          message: `API returned ${res.status}: ${text.slice(0, 200)}`,
        });
      }

      const data = await res.json();
      const modelExists = Array.isArray(data?.data)
        ? data.data.some(
            (m: { id?: string }) => m.id === config.model,
          )
        : true;

      return NextResponse.json({
        success: true,
        message: modelExists
          ? `Connection successful. Model "${config.model}" is available.`
          : `Connection successful, but model "${config.model}" was not found in the model list.`,
        model: config.model,
      });
    } catch (err) {
      clearTimeout(timeout);
      const msg =
        err instanceof Error && err.name === "AbortError"
          ? "Connection timed out after 15 seconds."
          : "Failed to connect to the API.";
      return NextResponse.json({
        success: false,
        message: msg,
      });
    }
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
