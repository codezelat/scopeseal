"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type AuthFormState = { error?: string } | undefined;

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  try {
    await signIn("credentials", { email, password, redirectTo: "/app" });
    return undefined;
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    // A redirect is thrown as an error — rethrow so Next handles it.
    throw err;
  }
}
