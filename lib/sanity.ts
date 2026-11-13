import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

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
const builder = createImageUrlBuilder({ projectId, dataset });

// A Sanity doc with no image makes .url() throw, which would take down the whole page.
export function imageUrl(source: any): string | undefined {
  try {
    return builder.image(source).url();
  } catch {
    return undefined;
  }
}

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
