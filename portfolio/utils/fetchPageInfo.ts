import { PageInfo } from "../typing";
import { client } from '../sanity/lib/client';
import { groq } from 'next-sanity';

const query = groq`*[_type == "pageInfo"][0]`;

export const fetchPageInfo = async () => {
    const pageInfo: PageInfo = await client.fetch(query);
    //console.log("fetching", pageInfo);
    return pageInfo;
}
