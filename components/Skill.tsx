"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Skill } from "@/types";
import { urlFor } from "@/lib/sanity";

type Props = {
  skill: Skill;
  index: number;
};

export default function SkillComponent({ skill, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.1, y: -5 }}
      className="group flex flex-col items-center justify-center space-y-2 cursor-pointer"
    >
      <div className="relative">
        <motion.img
          src={urlFor(skill.image).url()}
          alt={skill.title}
          className="h-20 w-20 rounded-lg object-contain border border-green-500/30 group-hover:border-green-500 transition-colors p-2"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        />

        {/* Progress ring */}
        <svg
          className="absolute -inset-1 w-24 h-24 transform -rotate-90"
          style={{ filter: "drop-shadow(0 0 10px rgba(0, 255, 0, 0.3))" }}
        >
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="rgb(55, 65, 81)"
            strokeWidth="2"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="rgb(0, 255, 0)"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - skill.progress / 100)}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
            whileInView={{
              strokeDashoffset: 2 * Math.PI * 44 * (1 - skill.progress / 100),
            }}
            transition={{ duration: 1, delay: index * 0.05 }}
            viewport={{ once: true }}
          />
        </svg>

        {/* Progress percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-green-400 text-center">
            {skill.progress}%
          </span>
        </div>
      </div>

      <h4 className="text-center text-sm font-semibold text-gray-300 group-hover:text-green-400 transition-colors">
        {skill.title}
      </h4>
    </motion.div>
  );
}
