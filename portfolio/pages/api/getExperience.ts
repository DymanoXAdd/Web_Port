// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../sanity/lib/client'
import {groq} from 'next-sanity'
import { Experience, Project} from '../../typing'

const query = groq`*[_type == "experience"] {
..., 
technologies[]->
}`;

type Data = {
  experiences: Experience[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const experiences: Experience[] = await client.fetch(query)

  res.status(200).json({ experiences })
}