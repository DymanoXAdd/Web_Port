import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity";
import { projectsQuery } from "@/lib/sanity-queries";
import type { Project } from "@/types";
import ProjectGlobe from "@/components/sections/ProjectGlobe";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export const metadata: Metadata = {
  title: "Projects Globe | Luis Ruiz",
  description:
    "An interactive floating globe of all of Luis Ruiz's projects.",
};

export const revalidate = 60; // ISR - revalidate every 60 seconds

async function getProjects(): Promise<Project[]> {
  try {
    const projects = await sanityFetch<Project[]>({ query: projectsQuery });
    return projects ?? [];
  } catch (error) {
    console.error("Failed to fetch projects for globe:", error);
    return [];
  }
}

export default async function ProjectsGlobePage() {
  const projects = await getProjects();

  return (
    <ErrorBoundary>
      <ProjectGlobe projects={projects} />
    </ErrorBoundary>
  );
}
