import { Social } from "../typing";
import { client } from '../sanity/lib/client';
import { groq } from 'next-sanity';

const query = groq`*[_type == "social"]`;

export const fetchSocial = async () => {
    const socials: Social[] = await client.fetch(query);
    //console.log("fetching", socials);
    return socials;
}
