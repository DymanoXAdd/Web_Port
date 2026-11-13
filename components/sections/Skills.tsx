"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Skill } from "@/types";
import SkillComponent from "@/components/Skill";

type Props = {
  skills: Skill[];
};

// Container variants drive the staggered cascade of the cards.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

function Skills({ skills }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Re-fires on EVERY entry: leaving the viewport flips inView -> false (resetting
  // the count-up + bar to 0), re-entering flips it true and replays the cascade.
  const inView = useInView(ref, { once: false, amount: 0.35 });
  // Bumping the key remounts the cards, which restarts the cascade and count-up from 0.
  const [replayKey, setReplayKey] = useState(0);

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="section-wrap flex flex-col gap-6 pt-24"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="section-label">-- stack</h2>
        <button
          type="button"
          onClick={() => setReplayKey((k) => k + 1)}
          className="rounded-md border border-line-2 px-3.5 py-2.5 font-mono text-[13px] text-soft transition-colors hover:border-brand-text hover:text-fg"
        >
          Replay
        </button>
      </div>
      <div key={replayKey} className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills?.map((skill) => (
          <SkillComponent key={skill._id} skill={skill} active={inView} />
        ))}
      </div>
    </motion.div>
  );
}

export default Skills;
