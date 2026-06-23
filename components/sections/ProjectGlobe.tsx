"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/types";
import { urlFor } from "@/lib/sanity";

type Props = {
  projects: Project[];
};

// Radius of the sphere in pixels.
const RADIUS = 220;
// Size of each icon in pixels.
const ICON_SIZE = 72;

type SpherePoint = {
  x: number;
  y: number;
  z: number;
};

/**
 * Distribute `count` points evenly on the surface of a sphere using the
 * Fibonacci sphere algorithm. This guarantees the icons are spaced out from
 * each other and never overlap, regardless of how many projects there are.
 */
function fibonacciSphere(count: number, radius: number): SpherePoint[] {
  if (count <= 0) return [];
  if (count === 1) return [{ x: 0, y: 0, z: radius }];

  const points: SpherePoint[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    // y goes from 1 to -1 evenly.
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points.push({ x: x * radius, y: y * radius, z: z * radius });
  }

  return points;
}

function ProjectGlobe({ projects }: Props) {
  const points = fibonacciSphere(projects.length, RADIUS);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gray-800 text-white">
      {/* Back button */}
      <div className="absolute left-6 top-6 z-50">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors border border-green-500/40"
          >
            ← Back
          </motion.button>
        </Link>
      </div>

      <h1 className="absolute left-1/2 top-10 z-40 -translate-x-1/2 text-2xl font-bold uppercase tracking-[10px] text-green-400 md:text-3xl">
        Projects
      </h1>

      {/* Centered viewport (both horizontally and vertically) */}
      <div className="flex min-h-screen w-full items-center justify-center">
        {projects.length === 0 ? (
          <p className="text-lg text-gray-400">No projects to display yet.</p>
        ) : (
          <div
            className="relative"
            style={{
              width: RADIUS * 2,
              height: RADIUS * 2,
              perspective: 1200,
            }}
          >
            {/* Rotating sphere container */}
            <motion.div
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: 360 }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {projects.map((project, i) => {
                const point = points[i];
                return (
                  <motion.a
                    key={project._id}
                    href={project.linkToBuild || "#"}
                    target={project.linkToBuild ? "_blank" : undefined}
                    rel={
                      project.linkToBuild ? "noopener noreferrer" : undefined
                    }
                    title={project.title}
                    className="group absolute left-1/2 top-1/2 block"
                    style={{
                      width: ICON_SIZE,
                      height: ICON_SIZE,
                      marginLeft: -ICON_SIZE / 2,
                      marginTop: -ICON_SIZE / 2,
                      transform: `translate3d(${point.x}px, ${point.y}px, ${point.z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Counter-rotate so icons face the viewer while floating */}
                    <motion.div
                      className="h-full w-full"
                      animate={{ rotateY: -360 }}
                      transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        className="h-full w-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 3 + (i % 4),
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {project.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={urlFor(project.image)
                              .width(ICON_SIZE * 2)
                              .height(ICON_SIZE * 2)
                              .url()}
                            alt={project.title}
                            className="h-full w-full rounded-full border-2 border-green-500/40 object-cover shadow-2xl transition-transform duration-300 group-hover:scale-125 group-hover:border-green-400"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-green-500/40 bg-gray-700 text-center text-xs font-semibold shadow-2xl transition-transform duration-300 group-hover:scale-125">
                            {project.title?.slice(0, 2) ?? "?"}
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ProjectGlobe;
