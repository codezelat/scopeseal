import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { PROJECT_TYPE_OPTIONS } from "@/lib/engine";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Templates" };

export default async function TemplatesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const type = PROJECT_TYPE_OPTIONS.some((option) => option.value === params.type) ? params.type! : "";
  const templates = await db.template.findMany({
    where: type ? { projectType: type } : undefined,
    orderBy: [{ projectType: "asc" }, { sortOrder: "asc" }],
    select: { id: true, projectType: true, title: true, body: true },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Templates</h1>
        <p className="mt-2 text-sm text-muted-foreground">Start with a clear structure.</p>
      </header>

      <form action="/app/templates" className="mb-7 flex items-center gap-2">
        <label>
          <span className="sr-only">Filter templates by project type</span>
          <select name="type" defaultValue={type} className="min-h-11 w-48 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">All types</option>
            {PROJECT_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <Button type="submit" variant="outline">Filter</Button>
      </form>

      {templates.length > 0 ? (
        <div className="grid border-t border-border sm:grid-cols-2">
          {templates.map((template, index) => (
            <article
              key={template.id}
              className={`flex min-h-48 flex-col border-b border-border py-6 sm:px-6 ${index % 2 === 0 ? "sm:border-r sm:pl-0" : "sm:pr-0"}`}
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {template.projectType.replaceAll("-", " ")}
              </p>
              <h2 className="font-display text-lg font-semibold">{template.title}</h2>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">{template.body}</p>
              <Link
                href={`/analyze?template=${template.id}`}
                className="group mt-5 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Use template
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="border-y border-border py-14 text-center">
          <p className="text-sm font-medium">No templates found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try another project type.</p>
        </div>
      )}
    </main>
  );
}
