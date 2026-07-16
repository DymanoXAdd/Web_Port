"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/types";
import { urlFor } from "@/lib/sanity";
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

  function openLink() {
    if (typeof window !== "undefined") {
      window.open(project.linkToBuild, "_blank", "noopener,noreferrer");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      openLink();
    }
  }

  const rest = restRotation(index, count);

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
      role="button"
      tabIndex={0}
      aria-expanded={active}
      aria-label={`${project.title} — view project`}
      data-active={active ? "true" : "false"}
      className={`project-card group relative flex-shrink-0 cursor-pointer rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-black/40 ${
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
      onClick={openLink}
      onKeyDown={handleKeyDown}
    >
      {/* Card face */}
      <div className="relative w-56 sm:w-64 lg:w-72 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
        <img
          src={urlFor(project.image).url()}
          alt={project.title}
          className="h-44 w-full object-cover sm:h-52 lg:h-60"
        />

        {/* Detail panel — present in the DOM always; revealed (opacity) on active. */}
        <div
          data-testid="project-detail"
          className={`flex flex-col space-y-3 p-4 transition-opacity duration-300 ${
            active ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <h4
            className="text-lg font-semibold text-black"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {project.title}
          </h4>

          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-4">
            {project.summary}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {project.technologies?.map((technology) => (
              <img
                key={technology._id}
                src={urlFor(technology.image).url()}
                alt={technology.title}
                title={technology.title}
                className="h-8 w-8 rounded-md border border-black/10 object-contain p-1"
              />
            ))}
          </div>

          <a
            href={project.linkToBuild}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-block w-fit rounded-lg bg-black px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            View Project
          </a>
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
      className="h-screen relative flex overflow-hidden flex-col text-left md:flex-row max-w-full justify-evenly mx-auto items-center z-0"
    >
      <h3 className="section-title">Projects</h3>

      {count === 0 ? (
        <div
          data-testid="projects-empty"
          className="text-neutral-500 text-lg"
        >
          No projects to show yet.
        </div>
      ) : (
        <div
          data-testid="project-stack"
          className="relative z-20 flex w-full items-center justify-center px-6 pt-32 pb-12 md:pt-40"
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
      )}
    </motion.div>
  );
}

export default Projects;
