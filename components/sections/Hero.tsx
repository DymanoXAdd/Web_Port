"use client";

import React, { useState } from "react";
import type { PageInfo } from "@/types";

type Props = {
  pageInfo: PageInfo;
};

// Fallbacks are the wording Luis approved with the concept A mockup (2026-11-12); Sanity overrides them.
const DEFAULT_KICKER = "SELECT name, role FROM people WHERE handle = 'luis';";
const DEFAULT_HEADLINE = "Software engineer who makes data behave.";
const DEFAULT_INTRO =
  "I build reliable, intuitive tools, keep school platforms like Skyward and Tableau running, and turn messy data into answers. Off the clock: games and dancing.";
const DEFAULT_STATUS = "Open to opportunities";

export default function Hero({ pageInfo }: Props) {
  const [copied, setCopied] = useState(false);

  const name = pageInfo?.name || "Luis A Ruiz";
  const role = pageInfo?.role || "Computer Programmer";
  const email = pageInfo?.contactInfo?.email; // Sanity is the one source; no button if it's empty

  const stats = [
    { key: "years_experience", value: "3+", big: true },
    { key: "languages", value: "5+", big: true },
    { key: "current_role", value: role, big: false },
    { key: "status", value: pageInfo?.status || DEFAULT_STATUS, big: false, accent: true },
  ];

  const handleCopyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard not available: the address is still visible on the button.
    }
  };

  return (
    <div className="section-wrap">
      <div className="flex flex-col gap-6 pb-24 pt-20 md:pb-24 md:pt-28">
        <p className="font-mono text-[15px] text-brand-text">{pageInfo?.heroKicker || DEFAULT_KICKER}</p>
        <h1 className="text-[clamp(44px,7vw,88px)] font-bold leading-[1.02] tracking-[-0.03em]">
          {name}.
          <br />
          {pageInfo?.headline || DEFAULT_HEADLINE}
        </h1>
        <p className="max-w-[640px] text-[19px] leading-relaxed text-muted">
          {pageInfo?.heroIntro || DEFAULT_INTRO}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="#projects"
            className="rounded-md bg-brand px-[22px] py-3.5 font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            See my work
          </a>
          {email && (
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label={`Copy email ${email}`}
              className="inline-flex items-center gap-3 rounded-md border border-line-2 px-[22px] py-3.5 font-semibold text-fg transition-colors hover:border-brand-text"
            >
              <span>{email}</span>
              <span aria-hidden="true" className="font-mono text-xs text-brand-text">
                {copied ? "Copied!" : "copy"}
              </span>
            </button>
          )}
        </div>
      </div>

      <dl
        aria-label="At a glance"
        className="grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <div key={stat.key} className="bg-panel p-6">
            <dt className="font-mono text-[13px] text-muted">{stat.key}</dt>
            <dd
              className={`mt-1.5 font-bold ${stat.big ? "text-4xl" : "text-xl font-semibold"} ${
                stat.accent ? "text-brand-text" : ""
              }`}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
