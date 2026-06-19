"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Skill } from "@/types";
import SkillComponent from "@/components/Skill";
import { containerVariants } from "@/lib/animations";

type Props = {
  skills: Skill[];
};

function Skills({ skills }: Props) {
  const half = Math.ceil((skills?.length ?? 0) / 2);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex relative flex-col text-center md:text-left justify-center mx-auto items-center py-10 z-0 min-h-screen"
    >
      <h3 className="section-title">Skills</h3>
      <h3 className="section-subtitle">
        Hover over a skill for current proficiency
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
        {skills?.slice(0, half).map((skill, i) => (
          <SkillComponent key={skill._id} skill={skill} index={i} />
        ))}
        {skills?.slice(half).map((skill, i) => (
          <SkillComponent
            key={skill._id}
            skill={skill}
            index={i}
            directionLeft
          />
        ))}
      </div>
    </motion.div>
  );
}

export default Skills;
