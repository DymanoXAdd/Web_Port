"use client";

import React from "react";
import { motion } from "framer-motion";
import type { PageInfo } from "@/types";
import { urlFor } from "@/lib/sanity";
import { fadeInLeft, fadeInRight, staggerContainer, staggerItem } from "@/lib/animations";

type Props = {
  pageInfo: PageInfo;
};

function About({ pageInfo }: Props) {
  return (
    <motion.div
      {...staggerContainer}
      className="flex flex-col relative h-screen text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="section-title">About</h3>

      <motion.img
        {...fadeInLeft}
        src={urlFor(pageInfo?.profilePic).url()}
        alt={pageInfo?.name}
        className="-mb-20 md:mb-0 flex-shrink-0 w-56 h-56 rounded-full object-cover md:rounded-lg md:w-65 md:h-95 xl:w-[500px] xl:h-[600px] shadow-lg"
      />

      <motion.div {...staggerItem} className="space-y-10 px-0 md:px-10">
        <motion.h4
          {...fadeInRight}
          className="text-4xl font-semibold text-green-400"
        >
          My Little Background
        </motion.h4>
        <motion.p
          {...fadeInRight}
          className="text-base text-gray-300 leading-relaxed"
        >
          {pageInfo?.backgroundInformation}
        </motion.p>

        {/* Quick stats */}
        <motion.div
          {...staggerItem}
          className="grid grid-cols-3 gap-4 pt-6"
        >
          {[
            { label: "Years", value: "1+" },
            { label: "Projects", value: "5+" },
            { label: "Languages", value: "5+" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-4 rounded-lg bg-gray-700/30"
            >
              <div className="text-2xl font-bold text-green-400">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default About;
