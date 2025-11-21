import { Project } from "../typing";
import { client } from '../sanity/lib/client';
import { groq } from 'next-sanity';

const query = groq`*[_type == "project"] {
    ...,
    technologies[]->
}`;

export const fetchProjects = async () => {
    const projects: Project[] = await client.fetch(query);
    //console.log("fetching", projects);
    return projects;
}
