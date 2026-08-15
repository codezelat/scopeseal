import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { db } from "@/lib/db";
import { PROJECT_TYPE_OPTIONS, type ProjectType } from "@/lib/engine";
import { AnalyzeClient } from "./analyze-client";

export const metadata: Metadata = {
  title: "Analyze your scope",
  description:
    "Paste your project brief or scope of work and get a Scope Clarity Score with detailed feedback on missing items, risky wording, and suggestions.",
};

export default async function AnalyzePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template: templateId } = await searchParams;
  const template = templateId
    ? await db.template.findUnique({
        where: { id: templateId },
        select: { body: true, projectType: true },
      })
    : null;
  const initialProjectType = PROJECT_TYPE_OPTIONS.some(
    (option) => option.value === template?.projectType,
  )
    ? (template?.projectType as ProjectType)
    : "website";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px]">
            Test your scope
          </h1>
          <p className="mt-3 text-muted-foreground">
            Paste your project brief, scope of work, or proposal and get an
            instant clarity score.
          </p>
        </div>
        <AnalyzeClient
          initialText={template?.body ?? ""}
          initialProjectType={initialProjectType}
        />
      </main>
      <Footer />
    </>
  );
}
