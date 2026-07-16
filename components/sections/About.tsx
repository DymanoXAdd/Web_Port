"use client";

import React from "react";
import { motion } from "framer-motion";
import type { PageInfo } from "@/types";
import { urlFor } from "@/lib/sanity";
import { containerVariants, itemVariants, itemVariantsLeft, itemVariantsRight } from "@/lib/animations";

type Props = {
  pageInfo: PageInfo;
};

function About({ pageInfo }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative h-screen w-full overflow-y-auto overflow-x-hidden"
    >
      <h3 className="section-title">About</h3>

      <div className="mx-auto flex min-h-full max-w-7xl flex-col items-center justify-center gap-8 px-5 sm:px-8 md:px-10 pt-36 pb-12 text-center md:flex-row md:gap-12 md:text-left md:pt-32">
      <motion.img
        variants={itemVariantsLeft}
        src={urlFor(pageInfo?.profilePic).url()}
        alt={pageInfo?.name}
        className="flex-shrink-0 w-44 h-44 sm:w-52 sm:h-52 rounded-full object-cover md:rounded-lg md:w-[240px] md:h-[340px] xl:w-[400px] xl:h-[480px] shadow-lg"
      />

      <motion.div variants={itemVariants} className="space-y-6 px-0 md:px-10">
        <motion.h4
          variants={itemVariantsRight}
          className="text-4xl font-semibold text-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          My Little Background
        </motion.h4>
        <motion.p
          variants={itemVariantsRight}
          className="text-base text-neutral-600 leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {pageInfo?.backgroundInformation}
        </motion.p>

        {/* Quick stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 pt-2"
        >
          {[
            { label: "Years", value: "3+" },
            { label: "Projects", value: "3+" },
            { label: "Languages", value: "5+" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="text-center p-4 rounded-lg border border-black/10 bg-neutral-50"
            >
              <div
                className="text-2xl font-bold text-black"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-neutral-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      </div>
    </motion.div>
  );
}

export default About;
