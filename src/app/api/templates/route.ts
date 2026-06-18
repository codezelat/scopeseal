import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const templates = await db.template.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        projectType: true,
        title: true,
        body: true,
        sortOrder: true,
      },
    });

    return NextResponse.json(templates, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred", code: "INTERNAL_ERROR" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
