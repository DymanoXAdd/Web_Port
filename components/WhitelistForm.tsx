"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { whitelistRequestSchema, type WhitelistRequestInput } from "@/lib/validation";

// "Request to join" for the whitelisted Orbis server. Posts to /api/whitelist; Luis approves in Studio.
export default function WhitelistForm() {
  const [sentFor, setSentFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WhitelistRequestInput>({ resolver: zodResolver(whitelistRequestSchema) });

  const onSubmit: SubmitHandler<WhitelistRequestInput> = async (data) => {
    setError(null);
    try {
      const res = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      // A firewall or platform error page is HTML, not JSON.
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.success) {
        throw new Error(result?.error || "Your request couldn't be sent. Please try again later.");
      }
      setSentFor(result.username);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your request couldn't be sent. Please try again later.");
    }
  };

  return (
    <section aria-labelledby="join-heading" className="flex w-full max-w-xl flex-col gap-4 font-mono">
      <h2 id="join-heading" className="text-2xl font-semibold">request to join</h2>
      <p className="font-sans text-sm text-soft">
        Orbis is whitelisted. Send your Java username and Luis will review it. Once approved, you can join within a few
        minutes.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 font-sans">
        <label className="flex flex-col gap-1.5 text-sm text-soft">
          Minecraft username
          <input
            {...register("username")}
            className="field"
            type="text"
            autoComplete="off"
            spellCheck={false}
            maxLength={16}
            disabled={isSubmitting}
          />
          {errors.username && <span className="text-sm text-red-400">{errors.username.message}</span>}
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-soft">
          Note for Luis (optional)
          <textarea
            {...register("note")}
            className="field min-h-20"
            rows={2}
            maxLength={200}
            placeholder="e.g. I'm Red's friend"
            disabled={isSubmitting}
          />
          {errors.note && <span className="text-sm text-red-400">{errors.note.message}</span>}
        </label>
        {error && (
          <p role="alert" className="rounded-md border border-red-500/60 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}
        {sentFor && (
          <p role="status" className="rounded-md border border-brand-text/60 bg-brand/10 p-3 text-sm text-brand-text">
            Request sent for {sentFor}. Luis will review it soon.
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-brand p-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-hover disabled:bg-line-2"
        >
          {isSubmitting ? "Sending..." : "Request to join"}
        </button>
        <p className="text-center text-[13px] text-muted">
          Your username and note go to Luis for review and are deleted once handled.{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-fg">Privacy</Link>
        </p>
      </form>
    </section>
  );
}
