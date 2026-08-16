import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Turn a project brief into a clear ScopeSeal report in three steps.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  { number: "01", title: "Paste the brief", text: "Use a project brief, proposal, or client message.", lightImage: "/images/home/workflow-paste-light.webp", darkImage: "/images/home/workflow-paste-dark.webp", width: 466, height: 260 },
  { number: "02", title: "Run the check", text: "ScopeSeal reviews completeness, clarity, and risk.", lightImage: "/images/home/workflow-analyze-light.webp", darkImage: "/images/home/workflow-analyze-dark.webp", width: 466, height: 260 },
  { number: "03", title: "Act on the report", text: "Use the findings to clarify scope before work starts.", lightImage: "/images/home/workflow-report-light.webp", darkImage: "/images/home/workflow-report-dark.webp", width: 466, height: 260 },
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">How it works</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">From vague to clear in three steps.</h1>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">No setup. Paste the text, review the findings, and ask better questions.</p>
        </Reveal>
        <ol className="mt-14 grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.07}>
              <li className="min-w-0 border-t border-border pt-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-xl font-semibold">{step.title}</h2>
                  <span className="font-mono text-xs text-muted-foreground">{step.number}</span>
                </div>
                <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{step.text}</p>
                <div className="mt-6 overflow-hidden rounded-lg border border-border bg-muted/30 p-2 dark:bg-[#080d20]">
                  <Image src={step.lightImage} alt={`${step.title} in ScopeSeal`} width={step.width} height={step.height} sizes="(max-width: 1024px) 100vw, 33vw" className="h-auto w-full rounded-md dark:hidden" />
                  <Image src={step.darkImage} alt="" aria-hidden="true" width={step.width} height={step.height} sizes="(max-width: 1024px) 100vw, 33vw" className="hidden h-auto w-full rounded-md dark:block" />
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={0.12} className="mt-12 flex justify-center">
          <Button asChild size="lg"><Link href="/analyze">Analyze a brief<ArrowRight className="size-4" /></Link></Button>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
