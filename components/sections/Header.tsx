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
    <header className="sticky top-0 p-5 flex items-center justify-between max-w-7xl mx-auto z-20 xl:items-center">
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-10 w-10 text-gray-500"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
          <p className="uppercase hidden md:inline-flex text-sm text-gray-400 hover:text-green-400 transition-colors">
            Get in Touch
          </p>
        </motion.div>
      </Link>
    </header>
  );
}
