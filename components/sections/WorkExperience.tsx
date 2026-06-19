"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Experience } from "@/types";
import { urlFor } from "@/lib/sanity";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import ExperienceCard from "@/components/ExperienceCard";

type Props = {
  experiences: Experience[];
};

function WorkExperience({ experiences }: Props) {
  return (
    <motion.div
      {...staggerContainer}
      className="h-screen flex flex-col relative overflow-hidden text-center md:text-left max-w-full justify-center mx-auto items-center z-0"
    >
      <h3 className="section-title">Experience</h3>

      <div className="w-full h-full flex justify-center items-center">
        <motion.div
          className="relative w-full h-96 overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-4 md:px-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex gap-8 pb-4"
            initial={{ x: 0 }}
            whileInView={{ x: 0 }}
          >
            {experiences.map((experience, i) => (
              <motion.div
                key={experience._id}
                {...staggerItem}
                className="flex-shrink-0 w-full md:w-screen max-w-md"
              >
                <ExperienceCard experience={experience} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="w-full absolute top-[30%] bg-green-600/10 left-0 h-[500px] -skew-y-12" />
    </motion.div>
  );
}

export default WorkExperience;
