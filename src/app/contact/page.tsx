import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { ContactForm } from "./contact-form";
import { Reveal } from "@/components/animations/reveal";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the ScopeSeal team.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <Reveal>
          <section className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20" aria-labelledby="contact-heading">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Contact</p>
              <h1 id="contact-heading" className="mt-3 max-w-md font-display text-4xl font-semibold tracking-tight sm:text-5xl">Let’s talk scope.</h1>
              <p className="mt-5 max-w-sm leading-7 text-muted-foreground">Questions, feedback, or licensing. Send us a note and we’ll reply by email.</p>
              <a href="mailto:info@codezela.com" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                <Mail className="size-4 text-primary" aria-hidden="true" />
                info@codezela.com
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <ContactForm />
            </div>
          </section>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
