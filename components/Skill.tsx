"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Skill } from "@/types";
import Image from "next/image";
import { imageUrl } from "@/lib/sanity";

type Props = {
  skill: Skill;
  /** When true, the count-up and meter fill run (gated on viewport entry). */
  active: boolean;
};

// Card child variants for the staggered cascade.
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// requestAnimationFrame count-up with cubic ease-out (~1100ms).
// `active` gates the run: false -> resets to 0, true -> animates 0 -> target.
function useCountUp(target: number, active: boolean, reduced: boolean): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Reset during render (not in an effect) so a replay starts from 0 with no stale frame.
  if (!active && value !== 0) setValue(0);

  useEffect(() => {
    if (reduced || !active) return;

    const duration = 1100;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, active, reduced]);

  return reduced ? target : value;
}

const noopSubscribe = () => () => {};

export default function SkillComponent({ skill, active }: Props) {
  // false on the server and during hydration, true after: the server can't know the
  // visitor's motion setting, so the first client render must match its HTML (React #418).
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const prefersReduced = useReducedMotion() ?? false;
  const reduced = hydrated && prefersReduced;
  const target = skill.progress ?? 0;
  const count = useCountUp(target, active, reduced);

  // Bar fill: final width when reduced or active, otherwise empty.
  const filled = reduced || active;
  const barWidth = `${filled ? target : 0}%`;
  const src = imageUrl(skill.image);
  const iconClass = "h-6 w-6 shrink-0 rounded-sm object-contain";

  return (
    <motion.div
      variants={cardVariants}
      data-testid="skill-card"
      className="flex flex-col gap-3.5 rounded-[10px] border border-line bg-panel p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* next/image throws without a src, so a missing Sanity image keeps an empty same-size square. */}
          {src ? (
            <Image src={src} alt={skill.title} width={24} height={24} className={iconClass} />
          ) : (
            <div aria-hidden="true" className={iconClass} />
          )}
          <p className="truncate font-mono text-[15px] text-fg">{skill.title}</p>
        </div>
        <p className="text-[28px] font-bold tabular-nums text-brand-text">
          {reduced ? target : count}%
        </p>
      </div>
      <div
        role="progressbar"
        aria-label={`${skill.title} proficiency`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={target}
        className="h-1.5 w-full overflow-hidden rounded-full bg-line"
      >
        <motion.div
          className="h-full rounded-full bg-brand"
          initial={false}
          animate={{ width: barWidth }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 1.1, ease: "easeOut" }
          }
          style={reduced ? { width: barWidth } : undefined}
        />
      </div>
    </motion.div>
  );
}
