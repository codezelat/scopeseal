import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SealLogo } from "@/components/brand/seal-logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";

interface AuthFrameProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthFrame({ title, description, children }: AuthFrameProps) {
  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex min-h-20 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="ScopeSeal home" className="text-foreground">
            <SealLogo withWordmark size={25} />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100svh-81px)] max-w-[1200px] lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
        <section className="hidden min-h-[680px] flex-col justify-center border-r border-border px-12 lg:flex">
          <h1 className="max-w-md font-display text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-sm text-base leading-7 text-muted-foreground">
            {description}
          </p>
          <Image
            src="/images/home/mascot-hero.png"
            alt="ScopeSeal shield mascot holding a checklist and scope lens"
            width={270}
            height={306}
            priority
            sizes="270px"
            className="mt-10 h-auto w-[240px] xl:w-[270px]"
          />
        </section>

        <section className="flex items-center px-4 py-12 sm:px-8 lg:px-14">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
