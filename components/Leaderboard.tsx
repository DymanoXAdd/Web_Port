"use client";

import { useState, useSyncExternalStore } from "react";
import { motion, MotionConfig, type Variants } from "framer-motion";
import PlayerHead from "@/components/PlayerHead";
import type { PlayerStats } from "@/lib/minecraft";

export type LeaderboardPlayer = PlayerStats & { skin: string | null };

type StatKey = Exclude<keyof PlayerStats, "uuid" | "name">;

const count = (v: number) => v.toLocaleString("en-US");
const TABS: { key: StatKey; label: string; format: (v: number) => string }[] = [
  { key: "playTime", label: "Playtime", format: (v) => `${(v / 72000).toFixed(1)} h` }, // 72000 ticks = 1 h
  { key: "deaths", label: "Deaths", format: count },
  { key: "mobKills", label: "Mob kills", format: count },
  { key: "blocksMined", label: "Blocks mined", format: count },
  { key: "distanceCm", label: "Distance", format: (v) => `${(v / 100000).toFixed(1)} km` },
];

const list: Variants = { visible: { transition: { staggerChildren: 0.06 } } };
const row: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// Current minute, ticking once a minute; null on the server so the hydrated HTML matches.
const subscribeMinute = (cb: () => void) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};
const minuteNow = () => Math.floor(Date.now() / 60_000);

export function updatedLabel(updatedAt: string, nowMinute: number): string {
  const mins = nowMinute - Math.floor(Date.parse(updatedAt) / 60_000);
  if (!Number.isFinite(mins)) return "";
  if (mins < 1) return "updated just now";
  if (mins < 60) return `updated ${mins} min ago`;
  if (mins < 1440) return `updated ${Math.floor(mins / 60)} h ago`;
  return `updated ${Math.floor(mins / 1440)} d ago`;
}

function Crown() {
  // Pixel crown, 7x5 grid: gold body, darker band, one red and two blue gems.
  return (
    <svg className="leaderboard-crown" aria-hidden="true" viewBox="0 0 7 5" width="28" height="20" shapeRendering="crispEdges">
      <path fill="#f5c518" d="M0 0h1v2H0zM3 0h1v2H3zM6 0h1v2H6zM1 1h1v1H1zM5 1h1v1H5zM0 2h7v2H0z" />
      <path fill="#c99a06" d="M0 4h7v1H0z" />
      <path fill="#e5484d" d="M3 2h1v1H3z" />
      <path fill="#4cc9f0" d="M1 3h1v1H1zM5 3h1v1H5z" />
    </svg>
  );
}

export default function Leaderboard({ players, updatedAt }: { players: LeaderboardPlayer[]; updatedAt: string }) {
  const [tab, setTab] = useState(TABS[0]);
  // The #1 row catches fire once its list has scrolled into view, not while still off-screen.
  const [burning, setBurning] = useState<StatKey | null>(null);
  const nowMinute = useSyncExternalStore(subscribeMinute, minuteNow, () => null);
  const top = [...players].sort((a, b) => b[tab.key] - a[tab.key]).slice(0, 10);

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="leaderboard-heading" className="flex w-full max-w-xl flex-col gap-4 font-mono">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="leaderboard-heading" className="text-2xl font-semibold">leaderboard</h2>
          {nowMinute !== null && <p className="text-sm text-muted">{updatedLabel(updatedAt, nowMinute)}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={t.key === tab.key}
              onClick={() => setTab(t)}
              className={`min-h-11 rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-text ${
                t.key === tab.key ? "border-brand bg-brand text-white" : "border-line-2 text-soft hover:border-brand-text hover:text-fg"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto rounded-md border border-line bg-panel">
          <table className="w-full text-sm">
            <caption className="sr-only">Top players by {tab.label.toLowerCase()}</caption>
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th scope="col" className="w-10 px-4 py-2 font-normal">#</th>
                <th scope="col" className="px-4 py-2 font-normal">player</th>
                <th scope="col" className="px-4 py-2 text-right font-normal">{tab.label.toLowerCase()}</th>
              </tr>
            </thead>
            <motion.tbody
              key={tab.key}
              variants={list}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onViewportEnter={() => setBurning(tab.key)}
            >
              {top.map((p, i) => (
                <motion.tr
                  key={p.uuid}
                  variants={row}
                  className={`border-b border-line last:border-b-0 ${i === 0 && burning === tab.key ? "leaderboard-fire" : ""}`}
                >
                  <td className={`px-4 ${i < 3 ? "font-semibold text-brand-text" : "text-muted"}`}>{i + 1}</td>
                  <td className="px-4 pb-2 pt-4">
                    <span className="flex items-center gap-3 text-fg">
                      <span className="relative">
                        <PlayerHead skin={p.skin} />
                        {i === 0 && <Crown />}
                      </span>
                      {p.name}
                    </span>
                  </td>
                  <td className="px-4 text-right text-soft">{tab.format(p[tab.key])}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </section>
    </MotionConfig>
  );
}
