export type Player = { uuid: string; name: string; skin: string | null };

export type ServerStatus = {
  online: boolean;
  players: { online: number; max: number; list: Player[] } | null;
};

// One player's lifetime stats, as scripts/orbis-stats.py writes them to Sanity (raw game units).
export type PlayerStats = {
  uuid: string;
  name: string;
  playTime: number; // ticks, 20 per second
  deaths: number;
  mobKills: number;
  blocksMined: number;
  distanceCm: number;
};

export type MinecraftStats = { updatedAt: string; players: PlayerStats[] };

const OFFLINE: ServerStatus = { online: false, players: null };

// The UUID goes into the skin-head image URL, so only accept the real format.
const UUID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

// Asks mcstatus.io (free public server-list ping) from the server, cached 30 s.
// Any failure (no address, service down, bad reply) shows the server as offline.
export async function getServerStatus(
  address = process.env.MC_SERVER_ADDRESS
): Promise<ServerStatus> {
  address = address?.trim(); // a pasted env value can end in "\r\n", which mcstatus.io rejects (400)
  if (!address) {
    console.warn("minecraft status: MC_SERVER_ADDRESS not set");
    return OFFLINE;
  }
  try {
    const res = await fetch(
      `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(address)}`,
      { next: { revalidate: 30 }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) {
      console.warn(`minecraft status: mcstatus.io answered ${res.status}`);
      return OFFLINE;
    }
    const data = await res.json();
    if (data?.online !== true) return OFFLINE;
    const { online, max, list } = data.players ?? {};
    if (typeof online !== "number" || typeof max !== "number") return { online: true, players: null };
    // shortcut: the ping only carries the server's player sample (vanilla: up to 12 names), fine for a 12-slot server.
    const sample: { uuid: string; name_clean: string }[] = Array.isArray(list)
      ? list.filter((p) => typeof p?.uuid === "string" && UUID.test(p.uuid) && typeof p?.name_clean === "string")
      : [];
    const players: Player[] = await Promise.all(
      sample.map(async (p) => ({ uuid: p.uuid, name: p.name_clean, skin: await getSkinUrl(p.uuid) }))
    );
    return { online: true, players: { online, max, list: players } };
  } catch (error) {
    console.warn("minecraft status: request failed", error);
    return OFFLINE;
  }
}

// The player's skin texture from Mojang (avatar sites either block Vercel or return the default head).
// Cached 1 h; null on any failure, and the page shows a blank square.
export async function getSkinUrl(uuid: string): Promise<string | null> {
  if (!UUID.test(uuid)) return null;
  try {
    const res = await fetch(
      `https://sessionserver.mojang.com/session/minecraft/profile/${uuid.replace(/-/g, "")}`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const profile = await res.json();
    const value = profile?.properties?.find((p: { name?: string }) => p?.name === "textures")?.value;
    if (typeof value !== "string") return null;
    const url = JSON.parse(Buffer.from(value, "base64").toString("utf8"))?.textures?.SKIN?.url;
    // Only Mojang's texture host, upgraded to https (the profile gives http).
    return typeof url === "string" && /^https?:\/\/textures\.minecraft\.net\/texture\/[0-9a-f]+$/.test(url)
      ? url.replace(/^http:/, "https:")
      : null;
  } catch {
    return null;
  }
}

// Mojang's record for a Java username: the exact spelling and the dashed UUID. null when no such
// account exists; throws when Mojang can't be reached, so the caller can say "try again later".
export async function lookupProfile(username: string): Promise<{ name: string; uuid: string } | null> {
  const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (res.status === 204 || res.status === 404) return null;
  if (!res.ok) throw new Error(`Mojang answered ${res.status}`);
  const data = await res.json();
  const id = typeof data?.id === "string" ? data.id : "";
  if (!/^[0-9a-f]{32}$/i.test(id) || typeof data?.name !== "string") throw new Error("Unexpected Mojang reply");
  return { name: data.name, uuid: id.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5").toLowerCase() };
}
