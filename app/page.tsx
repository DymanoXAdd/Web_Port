import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Luis Ruiz | Full Stack Developer & Game Developer",
  description:
    "Computer Programmer with expertise in SQL and data. Building games and leveling up. Let's connect.",
  keywords: [
    "developer",
    "programmer",
    "SQL",
    "full stack",
    "game developer",
    "portfolio",
    "Luis Ruiz",
  ],
};

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
    <main className="snap-container bg-gray-800 text-white">
      <ErrorBoundary>
        <Header socials={socials} />

        <section id="hero" className="snap-start h-screen">
          <Hero pageInfo={pageInfo} />
        </section>

        <section id="about" className="snap-start h-screen">
          <About pageInfo={pageInfo} />
        </section>

        <section id="experience" className="snap-start h-screen">
          <WorkExperience experiences={experiences} />
        </section>

        <section id="skills" className="snap-start h-screen">
          <Skills skills={skills} />
        </section>

        <section id="projects" className="snap-start h-screen">
          <Projects projects={projects} />
        </section>

        <section id="contact" className="snap-start h-screen">
          <ContactMe pageInfo={pageInfo} />
        </section>

        <footer className="container m-auto rounded-full w-20 text-white p-4 sticky bottom-0 z-50">
          <a href="#hero" className="sticky bottom-5 w-full cursor-pointer block">
            <div className="flex items-center justify-center text-center">
              {/* Profile image will be added in component */}
            </div>
          </a>
        </footer>
      </ErrorBoundary>
    </main>
  );
}
