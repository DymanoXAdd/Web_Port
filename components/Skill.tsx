"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Skill } from "@/types";
import { urlFor } from "@/lib/sanity";

type Props = {
  skill: Skill;
  /** When true, the count-up and meter fill run (gated on viewport entry). */
  active: boolean;
};

// Card child variants for the staggered cascade.
const cardVariants = {
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
  const [value, setValue] = useState(reduced ? target : 0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }

    if (!active) {
      setValue(0);
      return;
    }

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

  return value;
}

export default function SkillComponent({ skill, active }: Props) {
  const reduced = useReducedMotion() ?? false;
  const target = skill.progress ?? 0;
  const count = useCountUp(target, active, reduced);

  // Bar fill: final width when reduced or active, otherwise empty.
  const filled = reduced || active;
  const barWidth = `${filled ? target : 0}%`;

  return (
    <motion.div
      variants={cardVariants}
      data-testid="skill-card"
      className="flex flex-col items-center gap-3 rounded-2xl border border-gray-700/60 bg-white/5 p-4 backdrop-blur-sm md:p-5"
    >
      <img
        src={urlFor(skill.image).url()}
        alt={skill.title}
        className="h-20 w-20 rounded-full border border-gray-500 object-cover md:h-24 md:w-24"
      />
      <p className="text-center text-sm font-semibold text-black md:text-base">
        {skill.title}
      </p>
      <p className="text-2xl font-bold text-[#F7AB0A]">
        {reduced ? target : count}%
      </p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700/60">
        <motion.div
          className="h-full rounded-full bg-[#F7AB0A]"
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
