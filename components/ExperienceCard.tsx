"use client";

import React from "react";
import Image from "next/image";
import type { Experience } from "@/types";
import { imageUrl } from "@/lib/sanity";

type Props = {
  experience: Experience;
};

// "" for a missing/invalid date. UTC because Sanity dates ("2020-01-01") parse as UTC midnight,
// which shows as the previous month in US time zones.
function formatMonth(date?: string): string {
  const d = date ? new Date(date) : null;
  return d && !isNaN(d.getTime())
    ? d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
    : "";
}

export default function ExperienceCard({ experience }: Props) {
  const end = experience.isCurrentlyWorkingHere ? "Present" : formatMonth(experience.dateEnded);
  const dates = [formatMonth(experience.dateStarted), end].filter(Boolean).join(" - ");
  const logo = imageUrl(experience.companyImage);
  const tech = (experience.technologies ?? []).map((t) => t.title).filter(Boolean);

  return (
    <article className="flex flex-wrap gap-8 rounded-[10px] border border-line bg-panel p-8">
      <div className="flex flex-[1_1_260px] items-start gap-4">
        {logo ? (
          <Image
            src={logo}
            alt={experience.company}
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-md border border-line-2 object-cover"
          />
        ) : null}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-2xl font-semibold">{experience.jobTitle}</h3>
          {experience.company ? <p className="text-soft">{experience.company}</p> : null}
          <p className="font-mono text-sm text-muted">{dates}</p>
        </div>
      </div>

      <div className="flex flex-[2_1_420px] flex-col gap-4">
        <ul className="flex list-disc flex-col gap-2.5 pl-5 leading-relaxed text-soft">
          {experience.points?.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
        {tech.length ? <p className="font-mono text-[13px] text-muted">{tech.join(" · ").toLowerCase()}</p> : null}
      </div>
    </article>
  );
}
