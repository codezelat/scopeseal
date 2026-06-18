import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ResultView } from "./result-view";
import type {
  AnalysisResult,
  CategoryResult,
  MissingItem,
  RiskHit,
} from "@/lib/engine";

async function getAiEnabled(): Promise<boolean> {
  try {
    const config = await db.aiConfig.findUnique({
      where: { id: "singleton" },
      select: { enabled: true },
    });
    return config?.enabled ?? false;
  } catch {
    return false;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const review = await db.review.findUnique({
    where: { shareSlug: slug },
    select: { score: true, band: true, projectType: true },
  });
  if (!review) return { title: "Result not found" };

  const bandLabel =
    review.band === "clear"
      ? "Clear Scope"
      : review.band === "review"
        ? "Needs Review"
        : "High Risk";

  return {
    title: `Score ${review.score}/100 — ${bandLabel}`,
    description: `Scope analysis result for a ${review.projectType} project. Score: ${review.score}/100.`,
    openGraph: {
      title: `ScopeSeal Score: ${review.score}/100`,
      description: `${bandLabel} — analyzed by ScopeSeal`,
    },
  };
}

export default async function ResultPage({ params }: PageProps) {
  const { slug } = await params;
  const review = await db.review.findUnique({
    where: { shareSlug: slug },
  });

  if (!review) notFound();

  const [result, aiEnabled] = await Promise.all([
    Promise.resolve({
      score: review.score,
      band: review.band as AnalysisResult["band"],
      categories: review.categories as unknown as CategoryResult[],
      missing: review.missing as unknown as MissingItem[],
      risks: review.risks as unknown as RiskHit[],
      suggestions: review.suggestions as unknown as string[],
      outputs: review.outputs as unknown as AnalysisResult["outputs"],
      wordCount: review.inputWordCount,
      sensitiveWarning: false,
    }),
    getAiEnabled(),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <ResultView
          result={result}
          reviewId={review.id}
          shareSlug={review.shareSlug}
          projectType={review.projectType}
          isOwner={false}
          aiEnabled={aiEnabled}
          scopeText={review.inputText}
        />
      </main>
      <Footer />
    </>
  );
}
