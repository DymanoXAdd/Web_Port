"use client";

import React from "react";
import Image from "next/image";
import type { PageInfo } from "@/types";
import { imageUrl } from "@/lib/sanity";

type Props = {
  pageInfo: PageInfo;
};

function About({ pageInfo }: Props) {
  const photo = imageUrl(pageInfo?.profilePic);

  return (
    <div className="section-wrap flex flex-col gap-6 pt-28">
      <h2 className="section-label">-- about</h2>
      <div className="flex flex-col gap-10 rounded-[10px] border border-line bg-panel p-8 md:flex-row md:items-center">
        {photo ? (
          <Image
            src={photo}
            alt={pageInfo?.name || "Profile photo"}
            width={320}
            height={400}
            className="h-56 w-56 flex-shrink-0 rounded-[10px] object-cover md:h-[300px] md:w-[240px]"
          />
        ) : null}
        <p className="text-lg leading-relaxed text-soft md:text-xl">{pageInfo?.backgroundInformation}</p>
      </div>
    </div>
  );
}

export default About;
