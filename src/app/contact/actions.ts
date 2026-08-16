"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { isContactEmailConfigured, sendContactEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-context";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  subject: z.string().trim().min(2, "Enter a subject.").max(120),
  message: z.string().trim().min(10, "Add a little more detail.").max(5_000),
  companyWebsite: z.string().max(200).optional(),
});

export type ContactState =
  | { error: string; success?: never }
  | { error?: never; success: string }
  | undefined;

export async function contactAction(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    companyWebsite: formData.get("companyWebsite") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your message and try again." };
  }

  if (parsed.data.companyWebsite) {
    return { success: "Message sent. We’ll get back to you by email." };
  }

  if (!isContactEmailConfigured()) {
    return { error: "The contact form is temporarily unavailable. Email us directly instead." };
  }

  const ip = await getRequestIp();
  const limit = rateLimit(ip, {
    namespace: "contact",
    maxRequests: 5,
    windowMs: 15 * 60 * 1_000,
  });
  if (!limit.success) {
    return { error: "Too many messages. Try again in a few minutes." };
  }

  try {
    await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      subject: parsed.data.subject,
      message: parsed.data.message,
      idempotencyKey: randomUUID(),
    });
    return { success: "Message sent. We’ll get back to you by email." };
  } catch (error) {
    console.error(
      "[contact] Failed to deliver message:",
      error instanceof Error ? error.message : "Unknown email error",
    );
    return { error: "We couldn’t send your message. Email us directly instead." };
  }
}
