"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Project } from "@/types";
import { urlFor } from "@/lib/sanity";
import { staggerContainer, fadeInUp } from "@/lib/animations";

type Props = {
  projects: Project[];
};

function Projects({ projects }: Props) {
  return (
    <motion.div
      {...staggerContainer}
      className="h-screen relative flex overflow-hidden flex-col text-left md:flex-row max-w-full justify-evenly mx-auto items-center z-0"
    >
      <h3 className="section-title">Projects</h3>

      <div className="relative w-full h-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-green-500 scrollbar-thin">
        {projects.map((project, i) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="w-screen flex-shrink-0 snap-center flex flex-col space-y-5 items-center justify-center p-20 md:p-44 h-screen"
          >
            {/* Project Image with Flip Animation */}
            <motion.div
              whileHover={{ rotateY: 5, rotateX: 5 }}
              transition={{ duration: 0.4 }}
              style={{ perspective: 1000 }}
            >
              <motion.img
                initial={{ y: -300, opacity: 0, scale: 0.8 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                viewport={{ once: true }}
                className="h-80 w-96 rounded-lg lg:h-96 lg:w-128 object-cover shadow-2xl"
                src={urlFor(project.image).url()}
                alt={project.title}
              />
            </motion.div>

            <div className="space-y-10 px-0 md:px-10 max-w-6xl">
              <motion.h4
                {...fadeInUp}
                className="text-4xl font-semibold text-center text-green-400"
              >
                <a
                  href={project.linkToBuild}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-300 transition-colors"
                >
                  Project {i + 1} of {projects.length}:
                </a>{" "}
                {project?.title}
              </motion.h4>

              <motion.div
                {...fadeInUp}
                className="flex items-center space-x-2 justify-center flex-wrap gap-4"
              >
                {project?.technologies.map((technology, techIndex) => (
                  <motion.div
                    key={technology._id}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={urlFor(technology.image).url()}
                      alt={technology.title}
                      title={technology.title}
                      className="h-12 w-12 rounded-lg object-contain border border-green-500/30 p-1"
                    />
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                {...fadeInUp}
                className="text-lg text-center md:text-left text-gray-300 leading-relaxed"
              >
                {project?.summary}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center md:justify-start"
              >
                <a
                  href={project.linkToBuild}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                  >
                    View Project
                  </motion.button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Projects;
