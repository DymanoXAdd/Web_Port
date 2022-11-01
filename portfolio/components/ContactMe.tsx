import React from 'react'
import { PhoneIcon, MapPinIcon, EnvelopeIcon } from "@heroicons/react/24/solid"

type Props = {}

function ContactMe({ }: Props) {
  return (
    <div className="h-screen flex relative flex-col text-center md:text-left md:flex-row 
    max-w-7xl px-10 justify-evenly mx-auto items-center ">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
        Contact
      </h3>

      <div className="flex flex-col translate-y-5">

        <h4 className="text-2xl font-semibold text-center pt-10">
          I got just what you need.{" "}
          <span className="underline decoration-black "> Lets Talk.</span>
        </h4>

        <div className="pt-5 pb-10 space-y-5">
          <div className="flex items-center space-x-5 justify-center ">
            <PhoneIcon className=" text-[#008000] h-7 w-7 animate-pulse" />
            <p className="text-2xl">+9565296848</p>
          </div>

          <div className="flex items-center space-x-5 justify-center ">
            <EnvelopeIcon className=" text-[#008000] h-7 w-7 animate-pulse" />
            <p className="text-2xl">Luisruiz1002@yahoo.com</p>
          </div>

          <div className="flex items-center space-x-5 justify-center ">
            <MapPinIcon className=" text-[#008000] h-7 w-7 animate-pulse" />
            <p className="text-2xl"> 220 West 10th Street</p>
          </div>
        </div>

        <form className="flex flex-col space-y-2 w-fit mx-auto ">
          <div className="flex space-x-2 ">
            <input className="contactInput" type="text" />
            <input className="contactInput" type="text" />
          </div>

          <input className="contactInput" type="text" />

          <textarea className="contactInput" />
          <button className="bg-[#008000] py-2 px-1 rounded-md text-black font-bold 
          text-lg ">
            Submit
          </button>
        </form>

      </div>
    </div>
  )
}

export default ContactMe