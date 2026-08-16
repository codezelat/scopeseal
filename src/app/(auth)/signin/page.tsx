import { SignInForm } from "./signin-form";
import { AuthFrame } from "@/components/auth/auth-frame";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const passwordReset = (await searchParams).reset === "success";

  return (
    <AuthFrame
      title="Welcome back"
      description="Sign in to save reviews and run deeper analysis."
    >
      <SignInForm passwordReset={passwordReset} />
    </AuthFrame>
  );
}
