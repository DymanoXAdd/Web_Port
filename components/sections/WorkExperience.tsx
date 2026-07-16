"use client";

import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Experience } from "@/types";
import { containerVariants } from "@/lib/animations";
import { urlFor } from "@/lib/sanity";
import ExperienceCard from "@/components/ExperienceCard";

type Props = {
  experiences: Experience[];
};

function WorkExperience({ experiences }: Props) {
  const items = experiences ?? [];
  const count = items.length;
  const hasMultiple = count > 1;

  // Active card index. direction drives the slide animation (-1 = left, 1 = right).
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (next: number, dir: number) => {
      if (count === 0) return;
      // Clamp into range — do NOT wrap, so the edges feel like real carousel ends.
      const clamped = Math.max(0, Math.min(count - 1, next));
      setActive((prev) => {
        if (clamped === prev) return prev;
        setDirection(dir);
        return clamped;
      });
    },
    [count]
  );

  const goLeft = useCallback(() => goTo(active - 1, -1), [active, goTo]);
  const goRight = useCallback(() => goTo(active + 1, 1), [active, goTo]);

  // Slide animation variants — enter from the side we're moving toward, exit the other way.
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
  };

  const prevItem = active > 0 ? items[active - 1] : null;
  const nextItem = active < count - 1 ? items[active + 1] : null;

  // A dimmed, text-free "peek" of an adjacent card. Purely decorative — it shows the
  // company image only (no jobTitle/company text) so it never collides with the
  // active-card text the tests query, and is hidden from the a11y tree.
  const renderPeek = (item: Experience | null, side: "left" | "right") => {
    if (!item) return null;
    return (
      <div
        aria-hidden="true"
        data-testid={`carousel-peek-${side}`}
        className={`pointer-events-none absolute top-1/2 z-0 hidden -translate-y-1/2 md:block ${
          side === "left" ? "left-0" : "right-0"
        }`}
      >
        <div
          className={`flex h-72 w-44 scale-90 flex-col items-center justify-center rounded-lg border border-black/10 bg-neutral-50 p-6 opacity-30 blur-[1px] ${
            side === "left"
              ? "[mask-image:linear-gradient(to_right,transparent,black)]"
              : "[mask-image:linear-gradient(to_left,transparent,black)]"
          }`}
        >
          <img
            src={urlFor(item.companyImage).url()}
            alt=""
            className="h-20 w-20 rounded-full border-2 border-black object-cover"
          />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative flex h-screen w-full max-w-full flex-col items-center text-center md:text-left overflow-hidden pt-36 pb-12 md:pt-40"
    >
      {/* Title is absolutely positioned at the top, clearing the fixed header. */}
      <h3 className="section-title">Experience</h3>

      {count === 0 ? (
        <p className="flex flex-1 items-center justify-center text-neutral-500" data-testid="experience-empty">
          No experience to show yet.
        </p>
      ) : (
        <div
          className="experience-carousel relative flex w-full flex-1 items-center justify-center overflow-hidden"
          data-testid="experience-carousel"
        >
          {/* Faded peeks of the neighbouring cards (decorative, text-free). */}
          {renderPeek(prevItem, "left")}
          {renderPeek(nextItem, "right")}

          {/* Left control */}
          <button
            type="button"
            aria-label="Previous experience"
            onClick={goLeft}
            disabled={!hasMultiple || active === 0}
            data-testid="carousel-prev"
            className="absolute left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-black/20 bg-white/80 text-2xl text-black shadow-sm transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 md:left-10"
          >
            <span aria-hidden="true">&#8592;</span>
          </button>

          {/* Stage — only the active card is in the D  OM, sliding in on click. */}
          <div className="relative z-10 h-full w-full max-w-md overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={items[active]._id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 px-4 pt-32"
                data-testid="carousel-active-item"
              >
                <ExperienceCard experience={items[active]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right control */}
          <button
            type="button"
            aria-label="Next experience"
            onClick={goRight}
            disabled={!hasMultiple || active === count - 1}
            data-testid="carousel-next"
            className="absolute right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-black/20 bg-white/80 text-2xl text-black shadow-sm transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 md:right-10"
          >
            <span aria-hidden="true">&#8594;</span>
          </button>

          {/* Dot indicators */}
          {hasMultiple && (
            <div
              className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-2"
              data-testid="carousel-dots"
            >
              {items.map((item, i) => (
                <button
                  key={item._id}
                  type="button"
                  aria-label={`Go to experience ${i + 1}`}
                  aria-current={i === active}
                  onClick={() => goTo(i, i > active ? 1 : -1)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    i === active ? "w-6 bg-black" : "bg-black/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default WorkExperience;
