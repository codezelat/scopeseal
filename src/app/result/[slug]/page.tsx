import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Toaster } from "@/components/ui/sonner";
import { ResultView } from "./result-view";
import type {
  AnalysisResult,
  CategoryResult,
  MissingItem,
  RiskHit,
} from "@/lib/engine";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getAiEnabled(): Promise<boolean> {
  try {
    const config = await db.aiConfig.findUnique({
      where: { id: "singleton" },
      select: { enabled: true, apiKeyEncrypted: true },
    });
    return Boolean(config?.enabled && config.apiKeyEncrypted);
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
    select: { score: true, band: true, projectType: true, isShared: true },
  });
  if (!review) return { title: "Result not found" };
  if (!review.isShared) {
    return {
      title: "Private result",
      robots: { index: false, follow: false, nocache: true },
    };
  }

  const bandLabel =
    review.band === "clear"
      ? "Clear Scope"
      : review.band === "review"
        ? "Needs Review"
        : "High Risk";

  return {
    title: `Score ${review.score}/100: ${bandLabel}`,
    description: `Scope analysis result for a ${review.projectType} project. Score: ${review.score}/100.`,
    openGraph: {
      title: `ScopeSeal Score: ${review.score}/100`,
      description: `${bandLabel}, analyzed by ScopeSeal`,
    },
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function ResultPage({ params }: PageProps) {
  const { slug } = await params;
  const [review, user, aiEnabled] = await Promise.all([
    db.review.findUnique({ where: { shareSlug: slug } }),
    getCurrentUser(),
    getAiEnabled(),
  ]);

  if (!review) notFound();
  const isOwner = Boolean(user && review.userId === user.id);
  if (!review.isShared && !isOwner) notFound();

  const result: AnalysisResult = {
    score: review.score,
    band: review.band as AnalysisResult["band"],
    categories: review.categories as unknown as CategoryResult[],
    missing: review.missing as unknown as MissingItem[],
    risks: review.risks as unknown as RiskHit[],
    suggestions: review.suggestions as unknown as string[],
    outputs: review.outputs as unknown as AnalysisResult["outputs"],
    wordCount: review.inputWordCount,
    sensitiveWarning: review.sensitiveWarning,
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
        <ResultView
          result={result}
          reviewId={review.id}
          shareSlug={review.shareSlug}
          projectType={review.projectType}
          isOwner={isOwner}
          initialIsShared={review.isShared}
          aiEnabled={aiEnabled}
          scopeText={review.inputText}
        />
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
