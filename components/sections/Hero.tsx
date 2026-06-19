"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import BackgroundCircles from "@/components/BackgroundCircles";
import type { PageInfo } from "@/types";
import { urlFor } from "@/lib/sanity";
import { fadeInUp, float, staggerContainer, staggerItem } from "@/lib/animations";

type Props = {
  pageInfo: PageInfo;
};

export default function Hero({ pageInfo }: Props) {
  const [text] = useTypewriter({
    words: [
      `console.log("${pageInfo.name}")`,
      "Developer.cpp",
      "Designer.tsx",
      "#include <Gamer.h>",
      "print(Welcome);",
    ],
    loop: true,
    delaySpeed: 2500,
  });

  return (
    <motion.div
      {...staggerContainer}
      className="h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden"
    >
      <BackgroundCircles />

      <motion.div {...staggerItem} className="z-20">
        <motion.img
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-full h-32 w-32 mx-auto object-cover border-4 border-green-500 shadow-lg"
          src={urlFor(pageInfo?.heroImage).url()}
          alt={pageInfo?.name}
          width={128}
          height={128}
        />
      </motion.div>

      <motion.div {...staggerItem} className="z-20">
        <h2 className="text-sm uppercase text-gray-400 pb-2 tracking-[10px]">
          {pageInfo?.role}
        </h2>
        <h1 className="text-5xl lg:text-6xl font-semibold px-10 min-h-32">
          <span className="mr-3 text-green-400">{text}</span>
          <Cursor cursorColor="#00ff00" />
        </h1>
      </motion.div>

      <motion.div
        {...staggerItem}
        className="pt-5 flex flex-wrap gap-4 justify-center"
      >
        {[
          { href: "#about", label: "About" },
          { href: "#experience", label: "Experience" },
          { href: "#skills", label: "Skills" },
          { href: "#projects", label: "Projects" },
        ].map((button, i) => (
          <motion.div
            key={button.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={button.href}>
              <button className="hero-button">
                {button.label}
              </button>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 z-20"
      >
        <div className="text-green-400 text-sm">Scroll to explore</div>
      </motion.div>
    </motion.div>
  );
}
