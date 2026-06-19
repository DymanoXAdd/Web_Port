import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-11-20";

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity env vars: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are required."
  );
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false to fetch fresh data
});

// Image URL builder
const builder = imageUrlBuilder({ projectId, dataset });

export const urlFor = (source: any) => builder.image(source);

// Helper function to fetch data from Sanity
export async function sanityFetch<T>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, any>;
}): Promise<T> {
  const data = await client.fetch<T>(query, params, {
    next: { revalidate: 60 } // ISR: Revalidate every 60 seconds
  });
  return data;
}
