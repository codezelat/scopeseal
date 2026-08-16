import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a secure ScopeSeal password reset link.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
