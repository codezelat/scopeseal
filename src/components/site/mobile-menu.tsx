"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { primaryNavigation } from "@/components/site/public-navigation";

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[min(88vw,22rem)] border-l border-border bg-background p-0">
        <SheetHeader className="border-b border-border px-5 py-5 text-left">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">ScopeSeal navigation</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col px-3 py-4" aria-label="Mobile navigation">
          {primaryNavigation.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="flex min-h-12 items-center rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto border-t border-border p-4">
          <SheetClose asChild>
            <Button asChild className="w-full">
              <Link href="/analyze">Analyze Brief</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link href="/signin">Sign in</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
