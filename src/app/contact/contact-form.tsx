"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { contactAction } from "./actions";
import { SealLoader } from "@/components/brand/seal-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(contactAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5" aria-describedby="contact-status">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" autoComplete="name" maxLength={100} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input id="contact-subject" name="subject" maxLength={120} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" name="message" rows={7} minLength={10} maxLength={5_000} required className="min-h-40 resize-y" />
      </div>
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <Label htmlFor="company-website">Company website</Label>
        <Input id="company-website" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </div>
      <div id="contact-status" className="min-h-6" aria-live="polite">
        {state?.success ? (
          <p className="flex items-center gap-2 text-sm text-clear" role="status"><CheckCircle2 className="size-4" aria-hidden="true" />{state.success}</p>
        ) : state?.error ? (
          <p className="text-sm text-missing" role="alert">{state.error}</p>
        ) : null}
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? <><SealLoader size={18} />Sending...</> : <><Send className="size-4" />Send message</>}
      </Button>
    </form>
  );
}
