"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PageInfo } from "@/types";
import { contactFormSchema, type ContactFormInput } from "@/lib/validation";

type Props = {
  pageInfo: PageInfo;
};

export default function ContactMe({ pageInfo }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormInput> = async (data) => {
    try {
      setError(null);
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // A firewall or platform error page is HTML, not JSON; show a plain message instead of a parse error.
      const result = await response.json().catch(() => null);

      if (!response.ok || !result) {
        throw new Error(result?.error || "Your message couldn't be sent. Please try again, or email me directly.");
      }

      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const email = pageInfo?.contactInfo?.email;
  const socials = pageInfo?.socials ?? [];

  return (
    <div className="section-wrap flex flex-wrap gap-12 py-28">
      <div className="flex flex-[1_1_320px] flex-col gap-4">
        <h2 className="section-label">-- contact</h2>
        <p className="text-[40px] font-bold leading-[1.1] tracking-[-0.02em]">Let&apos;s talk.</p>
        <p className="leading-relaxed text-muted">Send a note and it lands in my inbox.</p>
        {email ? (
          <a href={`mailto:${email}`} className="w-fit font-semibold text-brand-text underline-offset-2 hover:underline">
            {email}
          </a>
        ) : null}
        {socials.length ? (
          <div className="flex gap-5 pt-2">
            {socials.map((social) => (
              <a
                key={social._id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-text underline-offset-2 hover:underline"
              >
                {social.title}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-[1_1_420px] flex-col gap-4" noValidate>
        <div className="flex flex-wrap gap-4">
          <label className="flex flex-[1_1_180px] flex-col gap-1.5 text-sm text-soft">
            Name
            <input {...register("name")} className="field" type="text" autoComplete="name" disabled={isSubmitting} />
            {errors.name && <span className="text-sm text-red-400">{errors.name.message}</span>}
          </label>
          <label className="flex flex-[1_1_180px] flex-col gap-1.5 text-sm text-soft">
            Email
            <input {...register("email")} className="field" type="email" autoComplete="email" disabled={isSubmitting} />
            {errors.email && <span className="text-sm text-red-400">{errors.email.message}</span>}
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm text-soft">
          Subject
          <input {...register("subject")} className="field" type="text" disabled={isSubmitting} />
          {errors.subject && <span className="text-sm text-red-400">{errors.subject.message}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-soft">
          Message
          <textarea {...register("message")} className="field min-h-32" rows={5} disabled={isSubmitting} />
          {errors.message && <span className="text-sm text-red-400">{errors.message.message}</span>}
        </label>

        {error && (
          <p role="alert" className="rounded-md border border-red-500/60 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {submitted && (
          <p role="status" className="rounded-md border border-brand-text/60 bg-brand/10 p-3 text-sm text-brand-text">
            ✓ Message sent! I&apos;ll get back to you soon.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-brand p-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-hover disabled:bg-line-2"
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
        <p className="text-center text-[13px] text-muted">Your message is emailed to Luis and not stored.</p>
      </form>
    </div>
  );
}
