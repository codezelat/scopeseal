import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, LayoutTemplate } from "lucide-react";

export const metadata = {
  title: "Templates",
};

export default async function TemplatesPage() {
  const templates = await db.template.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      projectType: true,
      title: true,
      body: true,
    },
  });

  const grouped = templates.reduce<Record<string, typeof templates>>(
    (acc, t) => {
      (acc[t.projectType] ??= []).push(t);
      return acc;
    },
    {},
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Template Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pre-built scope templates to help you get started. Use them as a
          starting point and customize for your project.
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card py-16 text-center">
          <LayoutTemplate className="size-10 text-muted-foreground" />
          <div>
            <h2 className="text-lg font-semibold">No templates yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Templates will appear here once they are added by administrators.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([type, items]) => (
            <section key={type}>
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold capitalize">
                {type}
                <Badge variant="secondary" className="font-mono text-xs">
                  {items.length}
                </Badge>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((tmpl) => (
                  <Card key={tmpl.id} className="flex flex-col p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <FileText className="size-4 text-seal-violet" />
                      <h3 className="font-medium">{tmpl.title}</h3>
                    </div>
                    <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-4">
                      {tmpl.body.slice(0, 200)}
                      {tmpl.body.length > 200 ? "…" : ""}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      asChild
                    >
                      <Link href={`/analyze?template=${tmpl.id}`}>
                        Use template
                      </Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
