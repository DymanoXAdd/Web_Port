"use client";

import React from "react";
import { motion } from "framer-motion";
import { SocialIcon } from "react-social-icons";
import Link from "next/link";
import type { Social } from "@/types";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { slideInLeft, slideInRight } from "@/lib/animations";

type Props = {
  socials: Social[];
};

export default function Header({ socials }: Props) {
  return (
    <header className="sticky top-0 p-5 flex items-center justify-between max-w-7xl mx-auto z-20 xl:items-center bg-gray-800/80 backdrop-blur-sm">
      <motion.div
        {...slideInLeft}
        className="flex flex-row items-center gap-4"
      >
        {/* Social Icons */}
        {socials.map((social) => (
          <motion.div
            key={social._id}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <SocialIcon
              url={social.url}
              fgColor="grey"
              bgColor="transparent"
              style={{ height: 40, width: 40 }}
            />
          </motion.div>
        ))}

        {/* Theme Toggle */}
        <ThemeToggle />
      </motion.div>

      <Link href="#contact">
        <motion.div
          {...slideInRight}
          className="flex flex-row items-center text-gray-300 cursor-pointer hover:text-green-400 transition-colors"
        >
          <SocialIcon
            className="cursor-pointer"
            network="email"
            fgColor="grey"
            bgColor="transparent"
            style={{ height: 40, width: 40 }}
            url={"#contact"}
          />
          <p className="uppercase hidden md:inline-flex text-sm text-gray-400 hover:text-green-400 transition-colors">
            Get in Touch
          </p>
        </motion.div>
      </Link>
    </header>
  );
}
