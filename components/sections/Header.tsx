"use client";

import React, { useState } from "react";
import type { Social } from "@/types";

type Props = {
  // Kept in the signature: page.tsx passes socials. Surfaced subtly in the
  // mobile overlay so the page.tsx call is never broken.
  socials: Social[];
};

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
];

export default function Header({ socials }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center z-20">
        {/* Logo (left) */}
        <a href="#hero" className="flex flex-row items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Luis A Ruiz
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none"
            style={{ letterSpacing: "-0.02em" }}
            aria-hidden="true"
          >
            ✳︎
          </span>
        </a>

        {/* Desktop nav links (center) — spaced pill/bubble buttons */}
        <nav className="hidden md:flex flex-row items-center gap-2 lg:gap-3 text-[18px] lg:text-[20px] text-black">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full px-4 lg:px-5 py-[0.3em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA (right) */}
        <div className="hidden md:flex flex-row items-center gap-3">
          <a
            href="#contact"
            className="text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex md:hidden flex-col gap-[5px] items-center justify-center"
        >
          <span
            className={`w-6 h-[2px] bg-black transition-transform duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-transform duration-300 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay menu */}
      <div
        className="fixed inset-0 z-[19] bg-white/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-8 md:hidden transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
          >
            {link.label}
          </a>
        ))}
        <div className="flex flex-row items-center gap-4">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="text-[32px] font-medium text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Get in touch
          </a>
        </div>

        {/* Socials surfaced subtly so the prop stays meaningful. */}
        {socials?.length ? (
          <div className="flex flex-row gap-5 pt-2">
            {socials.map((social) => (
              <a
                key={social._id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="text-base text-black/70 underline underline-offset-2 hover:opacity-60 transition-opacity"
              >
                {social.title}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
