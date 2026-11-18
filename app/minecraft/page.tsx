import type { Metadata } from "next";
import PlayerHead from "@/components/PlayerHead";
import { sanityFetch } from "@/lib/sanity";
import { minecraftStatsQuery, socialsQuery } from "@/lib/sanity-queries";
import { getServerStatus, getSkinUrl, type MinecraftStats } from "@/lib/minecraft";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import type { Social } from "@/types";
import Header from "@/components/sections/Header";
import GrassBlock from "@/components/GrassBlock";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Orbis Minecraft server | Luis A Ruiz",
  description: "Live status of the Orbis Minecraft server.",
};

export default async function MinecraftPage() {
  const [socials, status, stats] = await Promise.all([
    sanityFetch<Social[]>({ query: socialsQuery }).catch(() => [] as Social[]),
    getServerStatus(),
    // No stats yet, or Sanity down: the page just leaves the leaderboard out.
    sanityFetch<MinecraftStats | null>({ query: minecraftStatsQuery }).catch((error) => {
      console.warn("minecraft stats: Sanity fetch failed", error);
      return null;
    }),
  ]);
  const leaders = await Promise.all(
    (stats?.players ?? []).map(async (p) => ({ ...p, skin: await getSkinUrl(p.uuid) }))
  );

  return (
    <>
      <Header socials={socials} />
      <main id="main" className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-8 bg-ink px-6 py-16 text-fg">
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
        {status.online && status.players && status.players.list.length > 0 && (
          <table className="w-full max-w-sm overflow-hidden rounded-md border border-line bg-panel font-mono text-sm">
            <caption className="sr-only">Players online now</caption>
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th scope="col" className="w-14 px-4 py-2 font-normal">
                  <span className="sr-only">Skin</span>
                </th>
                <th scope="col" className="px-4 py-2 font-normal lowercase">
                  Player
                </th>
              </tr>
            </thead>
            <tbody>
              {status.players.list.map((player) => (
                <tr key={player.uuid} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-2">
                    <PlayerHead skin={player.skin} />
                  </td>
                  <td className="px-4 py-2 text-fg">{player.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {stats && leaders.length > 0 && <Leaderboard players={leaders} updatedAt={stats.updatedAt} />}
      </main>
      {/* Wording from Mojang's usage guidelines for anything Minecraft-related. */}
      <Footer note="NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT." />
    </>
  );
}
