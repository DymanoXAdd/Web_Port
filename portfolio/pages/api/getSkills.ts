// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../sanity/lib/client'
import {groq} from 'next-sanity'
import { skills} from '../../typing'

const query = groq`*[_type == "skill"]`;

type Data = {
  skills: skills[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const skills: skills[] = await client.fetch(query)

  res.status(200).json({ skills })
}