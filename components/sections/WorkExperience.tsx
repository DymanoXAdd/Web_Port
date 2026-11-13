"use client";

import React from "react";
import type { Experience } from "@/types";
import ExperienceCard from "@/components/ExperienceCard";

type Props = {
  experiences: Experience[];
};

// Concept A: every job is a full-width card, newest first (the query orders by dateStarted desc).
function WorkExperience({ experiences }: Props) {
  const items = experiences ?? [];

  return (
    <div className="section-wrap flex flex-col gap-6 pt-28">
      <h2 className="section-label">-- experience</h2>
      {items.length === 0 ? (
        <p className="text-muted" data-testid="experience-empty">
          No experience to show yet.
        </p>
      ) : (
        <ol className="flex flex-col gap-4" data-testid="experience-list">
          {items.map((item) => (
            <li key={item._id}>
              <ExperienceCard experience={item} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default WorkExperience;
