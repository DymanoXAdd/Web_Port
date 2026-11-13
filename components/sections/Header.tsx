"use client";

import React, { useState } from "react";
import type { Social } from "@/types";

type Props = {
  socials: Social[];
};

// Labels stay capitalised for screen readers; CSS shows them lowercase in the mono "query" style.
const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
];

export default function Header({ socials }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur">
      <nav className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-4">
        <a
          href="#hero"
          aria-label="Luis A Ruiz, back to top"
          className="font-mono text-base font-semibold text-fg no-underline"
        >
          luis@ruiz:~$
        </a>

        <div className="hidden items-center gap-6 text-[15px] md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono lowercase text-muted transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-md bg-brand px-4 py-2.5 font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Get in touch
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span className={`h-[2px] w-6 bg-fg transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-[2px] w-6 bg-fg transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`h-[2px] w-6 bg-fg transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 top-[65px] z-30 flex flex-col items-start gap-7 bg-ink px-6 pt-10 transition-opacity duration-300 md:hidden"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="font-mono text-2xl lowercase text-fg"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="rounded-md bg-brand px-5 py-3 text-lg font-semibold text-white"
        >
          Get in touch
        </a>
        {socials?.length ? (
          <div className="flex gap-6 pt-2">
            {socials.map((social) => (
              <a
                key={social._id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="text-brand-text underline underline-offset-2"
              >
                {social.title}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
