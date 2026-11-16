import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity";
import { socialsQuery } from "@/lib/sanity-queries";
import { getServerStatus } from "@/lib/minecraft";
import type { Social } from "@/types";
import Header from "@/components/sections/Header";
import GrassBlock from "@/components/GrassBlock";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Orbis Minecraft server | Luis A Ruiz",
  description: "Live status of the Orbis Minecraft server.",
};

export default async function MinecraftPage() {
  const [socials, status] = await Promise.all([
    sanityFetch<Social[]>({ query: socialsQuery }).catch(() => [] as Social[]),
    getServerStatus(),
  ]);

  return (
    <>
      <Header socials={socials} />
      <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-8 bg-ink px-6 py-16 text-fg">
        <GrassBlock className="h-48 w-48 animate-float drop-shadow-[0_24px_24px_rgba(0,0,0,0.5)] sm:h-64 sm:w-64" />
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-mono text-4xl font-semibold sm:text-5xl">Orbis</h1>
          <p
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-sm ${
              status.online ? "border-brand text-brand-text" : "border-line-2 text-muted"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${status.online ? "bg-brand-text" : "bg-muted"}`}
            />
            {status.online ? "Online" : "Offline"}
          </p>
          {status.online && status.players && (
            <p className="font-mono text-lg text-soft">
              {status.players.online} / {status.players.max} players
            </p>
          )}
        </div>
      </main>
    </>
  );
}
