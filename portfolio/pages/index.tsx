import React from 'react'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import About from '../components/About'
import ContactMe from '../components/ContactMe'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import WorkExperience from '../components/WorkExperience'
import Link from 'next/link'
import { Social, PageInfo, Experience, skills, Project } from '../typing'
import { fetchPageInfo } from '../utils/fetchPageInfo'
import { fetchProjects } from '../utils/fetchProjects'
import { fetchSkills } from '../utils/fetchSkills'
import { fetchExperience } from '../utils/fetchExperience'
import { fetchSocial } from '../utils/fetchSocial'
import Image from 'next/image';
const ProfileImage = "/IMG_8783.PNG";

type Props = {
  pageInfo: PageInfo;
  experiences: Experience[];
  skills: skills[];
  projects: Project[];
  socials: Social[];
}

const Home: NextPage<Props> = ({ pageInfo, experiences, skills, projects, socials }) => {
  return (
    <div className="bg-gray-800 text-white h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden z-0 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#008000]">
      <Head>
        <title>Luis&apos;s Portfolio</title>
      </Head>

      <Header socials={socials} />

      {/* Hero */}
      <section id='hero' className="snap-start">
        <Hero pageInfo={pageInfo} />
      </section>
      {/* About */}
      <section id="about" className="snap-center">
        <About pageInfo={pageInfo}/>
      </section>
      {/* Experience */}
      <section id="experience" className="snap-center">
        <WorkExperience experiences={experiences} />
      </section>

      {/* Skills */}
      <section id="skills" className="snap-start">
        <Skills skills={skills}/>
      </section>

      {/* Projects */}
      <section id="projects" className="snap-start">
        <Projects projects={projects} />
      </section>

      {/* Contact Me */}
      <section id="contact" className="snap-start">
        <ContactMe />
      </section>

      
      <footer className="container m-auto rounded-full w-20 text-white p-4 sticky bottom-0 z-50">
        <Link href="#hero" className='sticky bottom-5 w-full cursor-pointer'>
          <div className="flex items-center justify-center text-center">
            <Image src={ProfileImage} alt="" className='h-10 w-10 rounded-full grayscale hover:grayscale-0' width={40} height={40} />
          </div>
        </Link>
      </footer>
    </div>
  )
}

export default Home

export const getStaticProps: GetStaticProps<Props> = async () => {
  const pageInfo: PageInfo = await fetchPageInfo();
  const experiences: Experience[] = await fetchExperience();
  const skills: skills[] = await fetchSkills();
  const projects: Project[] = await fetchProjects();
  const socials: Social[] = await fetchSocial();

  return {
    props: {
      pageInfo,
      experiences,
      skills,
      projects,
      socials,
    },
    revalidate: process.env.NODE_ENV === "production" ? 60 : 10,
  }
}