import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, ListChecks, ScanSearch } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Features",
  description: "Find scope gaps, risky wording, and missing project details before work begins.",
  alternates: { canonical: "/features" },
};

const features = [
  { icon: ScanSearch, title: "Clarity score", text: "See how complete the brief is at a glance." },
  { icon: ListChecks, title: "Missing details", text: "Catch timelines, ownership, payments, and deliverables." },
  { icon: CircleAlert, title: "Scope risks", text: "Flag vague wording before it becomes unpaid work." },
  { icon: CheckCircle2, title: "Clear next steps", text: "Turn every finding into a practical question or fix." },
] as const;

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:gap-16 lg:py-20" aria-labelledby="features-heading">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Features</p>
            <h1 id="features-heading" className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Know what the brief missed.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">ScopeSeal finds gaps and risky language, then gives you a clear path forward.</p>
            <Button asChild size="lg" className="mt-8"><Link href="/analyze">Analyze a brief<ArrowRight className="size-4" /></Link></Button>
          </Reveal>
          <Reveal delay={0.08} className="min-w-0">
            <div className="overflow-hidden rounded-lg border border-border bg-card p-2 sm:p-3">
              <Image src="/images/home/inbox-result-light-hd.webp" alt="ScopeSeal analysis showing a clarity score and identified scope risks" width={1677} height={938} priority sizes="(max-width: 1024px) 100vw, 56vw" className="h-auto w-full rounded-md dark:hidden" />
              <Image src="/images/home/inbox-result-dark-hd.webp" alt="" aria-hidden="true" width={1677} height={938} priority sizes="(max-width: 1024px) 100vw, 56vw" className="hidden h-auto w-full rounded-md dark:block" />
            </div>
          </Reveal>
        </section>
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto grid max-w-6xl px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={index * 0.05} className="border-b border-border py-8 sm:border-r sm:px-6 lg:border-b-0 first:pl-0 last:border-r-0 last:pr-0">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <h2 className="mt-5 font-display text-lg font-semibold">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                </Reveal>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
