import type { NextPage } from 'next'
import Head from 'next/head'
import About from '../components/About'
import Header from '../components/Header'
import Hero from '../components/Hero'
import WorkExperience from '../components/WorkExperience'

const Home: NextPage = () => {
  return (
    <div className=" bg-gray-800 text-white h-screen snap-y snap-mandatory overflow-scroll z-0">
      <Head>
        <title>Luis's Portfolio</title>
      </Head>

      <Header/>
      
      {/* Hero */}
      <section id='hero' className="snap-center">
        <Hero/>
      </section>
      {/* About */}
      <section id="about" className="snap-center">
        <About/>
      </section>
      {/* Experience */}
      <section id="experience" className="snap-center">
        <WorkExperience/>
      </section>

      {/* Skills */}

      {/* Projects */}

      {/* Contact Me */}
    </div>
  )
}

export default Home
