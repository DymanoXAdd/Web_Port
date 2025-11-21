import React from 'react'
import { motion } from "framer-motion";
import { Experience } from '../typing';
import { urlFor } from '../sanity/lib/image';

type Props = {
  experience: Experience
}

function ExperienceCard({ experience }: Props) {
  return (
    <article className="flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-[500px] md:w-[600px] xl:w-[900px] snap-center bg-gray-600 p-4 hover:opacity-100 opacity-40
    cursor-pointer transition-opacity duration-200 overflow-hidden ">
      <motion.img
        initial={{
          y: -100,
          opacity: 0
        }}
        transition={{ duration: 1.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-32 h-32 rounded-full xl:w-[200px] xl:h-[200px] object-cover object-center"
        src={experience?.companyImage ? urlFor(experience.companyImage).url() : ''}
        alt=""
      />
      <div className="px-0 md:px-10 ">
        <h4 className="text-2xl font-light"> {experience.jobTitle}</h4>
        <p className="font-bold text-xl mt-1 ">{experience.companyName}</p>
        <div className="flex space-x-2 my-2 ">
          {experience.technologies?.map((technology) => (
            <img
              key={technology._id}  
              src={technology.image ? urlFor(technology.image).url() : ''}
              alt={technology.title}
              className="h-10 w-10 rounded-full"
            />
          ))}
        </div>
        <p className="uppercase py-2 text-gray-300">
          {new Date(experience.dateStarted).toDateString()} - {experience.isCurrentlyWorkingHere ? "Present" : new Date(experience.dateEnded).toDateString()}
        </p>
        <ul className="list-disc space-y-4 ml-5 text-lg h-52 overflow-y-scroll pr-5 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#008000] scrollbar-thin">
          {experience.points?.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default ExperienceCard