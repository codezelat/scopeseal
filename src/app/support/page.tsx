import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Support", description: "Get help with ScopeSeal." };

const questions = [
  { title: "What does ScopeSeal check?", answer: "It checks project text for missing details, vague wording, and delivery risk." },
  { title: "Is this legal advice?", answer: "No. ScopeSeal is a clarity tool for agencies, freelancers, and delivery teams." },
  { title: "How does the extension use page text?", answer: "Only after you choose to capture text. Nothing is scanned in the background." },
] as const;

export default function SupportPage() {
  return <><Header /><main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
    <section className="grid gap-10 border-b border-border pb-12 md:grid-cols-[1fr_auto] md:items-end">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Support</p><h1 className="mt-2 max-w-xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">How can we help?</h1><p className="mt-4 max-w-lg text-muted-foreground">Questions, feedback, or licensing. We’ll point you in the right direction.</p></div>
      <Button asChild size="lg"><a href="mailto:info@codezela.com"><Mail className="size-4" />Email support<ArrowUpRight className="size-4" /></a></Button>
    </section>
    <section className="min-w-0 py-10" aria-labelledby="common-questions"><h2 id="common-questions" className="font-display text-xl font-semibold">Common questions</h2><div className="mt-5 min-w-0 border-t border-border">{questions.map((item) => <details key={item.title} className="group min-w-0 border-b border-border py-5"><summary className="w-full cursor-pointer list-none break-words pr-8 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring">{item.title}</summary><p className="max-w-2xl break-words pt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p></details>)}</div></section>
    <p className="border-t border-border pt-6 text-sm text-muted-foreground">ScopeSeal is published by Codezela Technologies.</p>
  </main><Footer /></>;
}
