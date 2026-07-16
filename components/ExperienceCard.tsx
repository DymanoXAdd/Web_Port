"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Experience } from "@/types";
import { urlFor } from "@/lib/sanity";
import { hoverScale, tapScale } from "@/lib/animations";

type Props = {
  experience: Experience;
};

export default function ExperienceCard({ experience }: Props) {
  return (
    <motion.div
      {...hoverScale}
      {...tapScale}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col items-center p-6 rounded-lg bg-neutral-50 border border-black/10 hover:border-black/30 transition-all"
    >
      <motion.img
        src={urlFor(experience.companyImage).url()}
        alt={experience.company}
        className="h-20 w-20 rounded-full object-cover border-2 border-black mb-4"
      />

      <h3
        className="text-xl font-semibold text-black mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {experience.jobTitle}
      </h3>

      <p className="text-neutral-600 text-sm mb-2">{experience.company}</p>

      <div className="text-xs text-neutral-500 mb-4">
        {new Date(experience.dateStarted).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })}
        {" - "}
        {experience.isCurrentlyWorkingHere
          ? "Present"
          : new Date(experience.dateEnded).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
      </div>

      <ul className="text-sm text-neutral-700 space-y-1 text-left">
        {experience.points?.slice(0, 3).map((point, i) => (
          <li key={i} className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 mt-4 flex-wrap justify-center">
        {experience.technologies?.slice(0, 3).map((tech) => (
          <motion.img
            key={tech._id}
            src={urlFor(tech.image).url()}
            alt={tech.title}
            title={tech.title}
            className="h-8 w-8 rounded-full"
            whileHover={{ scale: 1.2 }}
          />
        ))}
        {experience.technologies?.length > 3 && (
          <div className="h-8 w-8 rounded-full bg-black/10 flex items-center justify-center text-xs text-black">
            +{experience.technologies?.length - 3}
          </div>
        )}
      </div>
    </motion.div>
  );
}
