import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a ScopeSeal account.",
  robots: { index: false, follow: false },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
