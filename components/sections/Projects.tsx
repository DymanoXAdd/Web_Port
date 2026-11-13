"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/types";
import Image from "next/image";
import { imageUrl } from "@/lib/sanity";
import { containerVariants } from "@/lib/animations";

type Props = {
  projects: Project[];
};

// Resting fan rotation for a card given its position in the stack.
// Cards fan symmetrically around the centre of the stack.
function restRotation(index: number, count: number): number {
  if (count <= 1) return 0;
  const mid = (count - 1) / 2;
  const spread = Math.min(7, 18 / count); // degrees per step, capped so big stacks stay readable
  return (index - mid) * spread;
}

type CardProps = {
  project: Project;
  index: number;
  count: number;
  active: boolean;
  activeIndex: number | null;
  onActivate: () => void;
  onDeactivate: () => void;
};

function ProjectCard({
  project,
  index,
  count,
  active,
  activeIndex,
  onActivate,
  onDeactivate,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Cursor-driven tilt. -0.5..0.5 within the card; 0 when not hovered.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateXRaw = useTransform(py, (v) => -v * 16);
  const rotateYRaw = useTransform(px, (v) => v * 16);

  const rotateX = useSpring(rotateXRaw, { stiffness: 250, damping: 20 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 250, damping: 20 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function resetTilt() {
    px.set(0);
    py.set(0);
  }

  const rest = restRotation(index, count);
  const cover = imageUrl(project.image);

  // Neighbours slide aside to make room for the active card.
  let neighborShift = 0;
  if (activeIndex !== null && activeIndex !== index) {
    neighborShift = index < activeIndex ? -48 : 48;
  }

  // Overlap: pull cards together except the first one. Disabled when only one card.
  const overlapMargin = index === 0 || count <= 1 ? 0 : -56;

  return (
    <motion.div
      ref={cardRef}
      data-testid="project-card"
      data-active={active ? "true" : "false"}
      // Not a button itself: the "View Project" link inside is the one control (no nested interactives).
      // Focus on that link bubbles here, so keyboard users still get the lift/reveal.
      className={`project-card group relative flex-shrink-0 rounded-[14px] focus-within:ring-4 focus-within:ring-brand-text/60 ${
        active ? "is-active z-50" : "z-10"
      }`}
      style={{
        marginLeft: overlapMargin,
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX: active ? rotateX : 0,
        rotateY: active ? rotateY : 0,
      }}
      initial={false}
      animate={{
        rotateZ: active ? 0 : rest,
        y: active ? -26 : 0,
        x: neighborShift,
        scale: active ? 1.12 : 1,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      onPointerMove={handlePointerMove}
      onMouseEnter={onActivate}
      onMouseLeave={() => {
        resetTilt();
        onDeactivate();
      }}
      onFocus={onActivate}
      onBlur={() => {
        resetTilt();
        onDeactivate();
      }}
    >
      {/* Card face */}
      <div className="relative w-64 overflow-hidden rounded-[14px] border border-line bg-panel shadow-[0_24px_48px_rgba(0,0,0,0.45)]">
        {/* next/image throws without a src; a missing Sanity image keeps a same-size blank so the card doesn't collapse. */}
        {cover ? (
          <Image
            src={cover}
            alt={project.title}
            width={256}
            height={150}
            className="h-[150px] w-full object-cover"
          />
        ) : (
          <div className="h-[150px] w-full bg-panel-2" />
        )}

        <div className="flex flex-col gap-2.5 p-5">
          <h3 className="text-[19px] font-semibold text-fg">{project.title}</h3>

          {/* Detail panel — present in the DOM always; revealed (opacity) on active. */}
          <div
            data-testid="project-detail"
            className={`flex flex-col gap-2.5 transition-opacity duration-300 ${
              active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <p className="line-clamp-4 text-sm leading-relaxed text-muted">{project.summary}</p>

            {project.technologies?.length ? (
              <p className="font-mono text-xs text-soft">
                {project.technologies.map((t) => t.title).filter(Boolean).join(" · ").toLowerCase()}
              </p>
            ) : null}

            {project.linkToBuild && (
              <a
                href={project.linkToBuild}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View project: ${project.title}`}
                className="w-fit py-1.5 font-semibold text-brand-text focus-visible:outline-none"
              >
                View Project →
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Projects({ projects }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const count = projects.length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="section-wrap flex flex-col gap-2 pt-28"
    >
      <h2 className="section-label">-- projects</h2>

      {count === 0 ? (
        <p data-testid="projects-empty" className="text-muted">
          No projects to show yet.
        </p>
      ) : (
        <>
        <p className="text-[15px] text-muted">Hover a card, or Tab to its link, to lift it.</p>
        {/* Scrolls sideways on a narrow phone instead of squashing the fan. */}
        <div className="overflow-x-auto pb-10 pt-16">
        <div
          data-testid="project-stack"
          className="relative z-20 mx-auto flex w-max items-center px-8"
          style={{ perspective: 1400 }}
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={project._id}
              project={project}
              index={i}
              count={count}
              active={activeIndex === i}
              activeIndex={activeIndex}
              onActivate={() => setActiveIndex(i)}
              onDeactivate={() =>
                setActiveIndex((cur) => (cur === i ? null : cur))
              }
            />
          ))}
        </div>
        </div>
        </>
      )}
    </motion.div>
  );
}

export default Projects;
