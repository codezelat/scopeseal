"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import type { AuthFormState } from "../signin/actions";

const schema = z.object({
  name: z.string().min(1, "Enter your name."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
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

  const existing = await db.user.findUnique({ where: { email: normalized } });
  if (existing) return { error: "An account with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.create({
    data: { name, email: normalized, passwordHash, role: "USER" },
  });

  try {
    await signIn("credentials", { email: normalized, password, redirectTo: "/app" });
    return undefined;
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created — please sign in." };
    }
    throw err;
  }
}
