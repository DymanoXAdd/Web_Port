"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Skill } from "@/types";
import SkillComponent from "@/components/Skill";
import { staggerContainer, staggerItem } from "@/lib/animations";

type Props = {
  skills: Skill[];
};

function Skills({ skills }: Props) {
  return (
    <motion.div
      {...staggerContainer}
      className="flex relative flex-col text-center md:text-left max-w-full justify-center mx-auto py-10 z-0 min-h-screen"
    >
      <h3 className="section-title">Skills</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10 max-w-7xl mx-auto mt-20">
        {skills.map((skill, i) => (
          <motion.div
            key={skill._id}
            {...staggerItem}
            transition={{ delay: i * 0.05 }}
          >
            <SkillComponent skill={skill} index={i} />
          </motion.div>
        ))}
      </div>

      <div className="w-full absolute top-[30%] bg-green-600/10 left-0 h-[500px] -skew-y-12" />
    </motion.div>
  );
}

export default Skills;
