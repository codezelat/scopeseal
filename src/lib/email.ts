const RESEND_API_URL = "https://api.resend.com/emails";
const EMAIL_TIMEOUT_MS = 10_000;

interface EmailMessage {
  html: string;
  idempotencyKey: string;
  replyTo?: string;
  subject: string;
  text: string;
  to: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function isPasswordResetEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.RESEND_EMAIL_FROM?.trim(),
  );
}

export function isContactEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.RESEND_EMAIL_FROM?.trim() &&
      process.env.CONTACT_EMAIL_TO?.trim(),
  );
}

async function sendEmail(message: EmailMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_EMAIL_FROM?.trim();
  if (!apiKey || !from) {
    throw new Error("Transactional email is not configured.");
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": message.idempotencyKey,
      "User-Agent": "ScopeSeal/1.0 (+https://scopeseal.codezela.com)",
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Email provider returned status ${response.status}.`);
  }
}

export async function sendContactEmail(input: {
  email: string;
  idempotencyKey: string;
  message: string;
  name: string;
  subject: string;
}): Promise<void> {
  const recipient = process.env.CONTACT_EMAIL_TO?.trim();
  if (!recipient) throw new Error("Contact email is not configured.");

  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeSubject = escapeHtml(input.subject);
  const safeMessage = escapeHtml(input.message).replaceAll("\n", "<br>");

  await sendEmail({
    to: recipient,
    replyTo: input.email,
    subject: `[ScopeSeal] ${input.subject}`,
    idempotencyKey: `contact/${input.idempotencyKey}`,
    text: `Name: ${input.name}\nEmail: ${input.email}\nSubject: ${input.subject}\n\n${input.message}`,
    html: `<!doctype html><html><body style="margin:0;background:#f4f5f7;color:#111827;font-family:Arial,sans-serif"><div style="max-width:640px;margin:0 auto;padding:40px 20px"><div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:32px"><div style="font-size:20px;font-weight:700;color:#0a0f2c">ScopeSeal</div><h1 style="margin:28px 0 20px;font-size:24px;line-height:1.25">New contact message</h1><p style="margin:0 0 8px;color:#4b5563"><strong style="color:#111827">From:</strong> ${safeName} &lt;${safeEmail}&gt;</p><p style="margin:0 0 24px;color:#4b5563"><strong style="color:#111827">Subject:</strong> ${safeSubject}</p><div style="border-top:1px solid #e5e7eb;padding-top:24px;line-height:1.65;color:#374151">${safeMessage}</div></div></div></body></html>`,
  });
}

export async function sendPasswordResetEmail(input: {
  email: string;
  idempotencyKey: string;
  name: string | null;
  resetUrl: string;
}): Promise<void> {
  const greeting = input.name?.trim() ? `Hi ${input.name.trim()},` : "Hello,";
  const safeGreeting = escapeHtml(greeting);
  const safeResetUrl = escapeHtml(input.resetUrl);

  await sendEmail({
    to: input.email,
    subject: "Reset your ScopeSeal password",
    idempotencyKey: `password-reset/${input.idempotencyKey}`,
    text: `${greeting}\n\nUse this secure link to reset your ScopeSeal password:\n${input.resetUrl}\n\nThis link expires in 30 minutes and can only be used once. If you did not request this, you can ignore this email.`,
    html: `<!doctype html><html><body style="margin:0;background:#f4f5f7;color:#111827;font-family:Arial,sans-serif"><div style="max-width:560px;margin:0 auto;padding:40px 20px"><div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:32px"><div style="font-size:20px;font-weight:700;color:#0a0f2c">ScopeSeal</div><h1 style="margin:28px 0 12px;font-size:24px;line-height:1.25">Reset your password</h1><p style="margin:0 0 16px;line-height:1.65;color:#4b5563">${safeGreeting}</p><p style="margin:0 0 24px;line-height:1.65;color:#4b5563">We received a request to reset your ScopeSeal password.</p><a href="${safeResetUrl}" style="display:inline-block;border-radius:8px;background:#1267ed;color:#ffffff;padding:13px 20px;font-weight:700;text-decoration:none">Reset password</a><p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6b7280">This link expires in 30 minutes and can only be used once. If you did not request this, you can ignore this email.</p></div></div></body></html>`,
  });
}

export async function sendPasswordChangedEmail(input: {
  authVersion: number;
  email: string;
  id: string;
  name: string | null;
}): Promise<void> {
  const greeting = input.name?.trim() ? `Hi ${input.name.trim()},` : "Hello,";
  const safeGreeting = escapeHtml(greeting);

  await sendEmail({
    to: input.email,
    subject: "Your ScopeSeal password was changed",
    idempotencyKey: `password-changed/${input.id}/${input.authVersion}`,
    text: `${greeting}\n\nYour ScopeSeal password was changed successfully. All existing sessions have been signed out. If you did not make this change, contact info@codezela.com immediately.`,
    html: `<!doctype html><html><body style="margin:0;background:#f4f5f7;color:#111827;font-family:Arial,sans-serif"><div style="max-width:560px;margin:0 auto;padding:40px 20px"><div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:32px"><div style="font-size:20px;font-weight:700;color:#0a0f2c">ScopeSeal</div><h1 style="margin:28px 0 12px;font-size:24px;line-height:1.25">Password changed</h1><p style="margin:0 0 16px;line-height:1.65;color:#4b5563">${safeGreeting}</p><p style="margin:0;line-height:1.65;color:#4b5563">Your password was changed successfully and all existing sessions were signed out. If you did not make this change, contact <a href="mailto:info@codezela.com" style="color:#1267ed">info@codezela.com</a> immediately.</p></div></div></body></html>`,
  });
}
