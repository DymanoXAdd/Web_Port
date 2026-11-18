import { createClient } from "next-sanity";

// Server-only Sanity client that can write. SANITY_WRITE_TOKEN (Editor) lives in Vercel and must
// never reach the browser: only API routes import this file.
export function sanityWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_WRITE_TOKEN is not set");
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-11-20",
    token,
    useCdn: false,
  });
}
