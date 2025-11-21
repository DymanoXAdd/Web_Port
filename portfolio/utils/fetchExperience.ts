import { Experience } from "../typing";
import { client } from '../sanity/lib/client';
import { groq } from 'next-sanity';

const query = groq`*[_type == "experience"] {
    ...,
    technologies[]->
}`;

export const fetchExperience = async () => {
    const experience: Experience[] = await client.fetch(query);
    //console.log("fetching", experience);
    return experience;
}
