"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-context";
import type { AuthFormState } from "../signin/actions";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100),
  email: z.string().email("Enter a valid email.").max(254),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
});

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { name, email, password } = parsed.data;
  const normalized = email.toLowerCase().trim();

  const signupLimit = await rateLimit(await getRequestIp(), {
    namespace: "sign-up",
    maxRequests: 5,
    windowMs: 60 * 60 * 1_000,
  });
  if (!signupLimit.success) {
    return { error: "Too many account requests. Try again later." };
  }

  try {
    const existing = await db.user.findUnique({ where: { email: normalized } });
    if (existing) return { error: "An account with that email already exists." };

    const passwordHash = await bcrypt.hash(password, 12);
    await db.user.create({
      data: { name, email: normalized, passwordHash, role: "USER" },
    });
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return { error: "An account with that email already exists." };
    }
    return { error: "We could not create your account. Try again." };
  }

  try {
    await signIn("credentials", { email: normalized, password, redirectTo: "/app" });
    return undefined;
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created. Please sign in." };
    }
    throw err;
  }
}
