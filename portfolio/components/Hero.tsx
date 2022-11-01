import Link from 'next/link';
import React from 'react'
import { useTypewriter, Cursor } from 'react-simple-typewriter'
import BackgroundCircules from './BackgroundCircules';

type Props = {}

export default function Hero({ }: Props) {
    const [text] = useTypewriter({
        words: ["print(Luis A. Ruiz)", "Developer.cpp", "Desginer.tsx", "#include <Gamer.h>", "printf(Welcome?);"],
        loop: true,
        delaySpeed: 2500
    });
    return (
        <div className=" h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden">
            <BackgroundCircules />
            <img className="relative rounded-full h-32 w-32 mx-auto object-cover"
                src=""
                alt=""
            />
            <div className="z-20">
                <h2 className=" text-sm uppercase text-gray-400 pb-2 tracking-[10px]">
                    Software Engineer
                </h2>
                <h1 className=" text-5xl lg:text-5xl font-semibold px-10">
                    <span className="mr-3">{text}</span>
                    <Cursor cursorColor='#008000' />
                </h1>
                <div className="pt-5">
                    <Link href={'#about'}>
                        <button className="heroButton">About</button>
                    </Link>
                    <Link href={'#experience'}>
                        <button className="heroButton">Experience</button>
                    </Link>
                    <Link href={'#skills'}>
                        <button className="heroButton">Skills</button>
                    </Link>
                    <Link href={'#projects'}>
                        <button className="heroButton">Projects</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}