import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AnalyzeClient } from "./analyze-client";

export const metadata: Metadata = {
  title: "Analyze your scope",
  description:
    "Paste your project brief or scope of work and get a Scope Clarity Score with detailed feedback on missing items, risky wording, and suggestions.",
};

export default function AnalyzePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Test your scope
          </h1>
          <p className="mt-3 text-muted-foreground">
            Paste your project brief, scope of work, or proposal and get an
            instant clarity score.
          </p>
        </div>
        <AnalyzeClient />
      </main>
      <Footer />
    </>
  );
}
