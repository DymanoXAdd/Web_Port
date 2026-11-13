import { sanityFetch } from "@/lib/sanity";
import {
  pageInfoQuery,
  experienceQuery,
  skillsQuery,
  projectsQuery,
  socialsQuery,
} from "@/lib/sanity-queries";
import type {
  PageInfo,
  Experience,
  Skill,
  Project,
  Social,
} from "@/types";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import WorkExperience from "@/components/sections/WorkExperience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import ContactMe from "@/components/sections/ContactMe";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export const revalidate = 60; // ISR - revalidate every 60 seconds

async function getPortfolioData() {
  try {
    const [pageInfo, experiences, skills, projects, socials] =
      await Promise.all([
        sanityFetch<PageInfo>({ query: pageInfoQuery }),
        sanityFetch<Experience[]>({ query: experienceQuery }),
        sanityFetch<Skill[]>({ query: skillsQuery }),
        sanityFetch<Project[]>({ query: projectsQuery }),
        sanityFetch<Social[]>({ query: socialsQuery }),
      ]);

    return {
      pageInfo,
      experiences,
      skills,
      projects,
      socials,
    };
  } catch (error) {
    console.error("Failed to fetch portfolio data:", error);
    throw error;
  }
}

export default async function Home() {
  const { pageInfo, experiences, skills, projects, socials } =
    await getPortfolioData();

  return (
    <ErrorBoundary>
      <Header socials={socials} />
      <main className="min-h-screen bg-ink text-fg">
        <section id="hero">
          <Hero pageInfo={pageInfo} />
        </section>
        <section id="about">
          <About pageInfo={pageInfo} />
        </section>
        <section id="experience">
          <WorkExperience experiences={experiences} />
        </section>
        <section id="projects">
          <Projects projects={projects} />
        </section>
        <section id="skills">
          <Skills skills={skills} />
        </section>
        <section id="contact">
          <ContactMe pageInfo={pageInfo} />
        </section>
      </main>
    </ErrorBoundary>
  );
}
