"use client";

import React, { useRef } from "react";
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

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative h-screen w-full overflow-y-auto overflow-x-hidden z-0"
    >
      <h3 className="section-title">Skills</h3>
      <h3 className="section-subtitle">My current proficiency at a glance</h3>

      <div className="mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center px-5 pt-44 pb-12 md:pt-48">
        <div className="grid w-full grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {skills?.map((skill) => (
            <SkillComponent key={skill._id} skill={skill} active={inView} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Skills;
