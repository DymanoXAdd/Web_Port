import { skills } from "../typing";
import { client } from '../sanity/lib/client';
import { groq } from 'next-sanity';

const query = groq`*[_type == "skill"]`;

export const fetchSkills = async () => {
    const skills: skills[] = await client.fetch(query);
    //console.log("fetching", skills);
    return skills;
}
