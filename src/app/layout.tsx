import type { Metadata } from "next";
import { Sora, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scopeseal.codezela.com"),
  title: {
    default: "ScopeSeal — Seal the gaps before they become unpaid work",
    template: "%s · ScopeSeal",
  },
  description:
    "Check project briefs, client messages, and proposal scopes for missing details, vague wording, and scope-creep risks. By Codezela.",
  applicationName: "ScopeSeal",
  authors: [{ name: "Codezela Technologies" }],
  keywords: [
    "scope creep",
    "project brief",
    "proposal review",
    "freelancer tools",
    "agency tools",
    "scope clarity",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
