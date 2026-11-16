export type Player = { uuid: string; name: string };

export type ServerStatus = {
  online: boolean;
  players: { online: number; max: number; list: Player[] } | null;
};

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
    const players: Player[] = Array.isArray(list)
      ? list
          .filter((p) => typeof p?.uuid === "string" && UUID.test(p.uuid) && typeof p?.name_clean === "string")
          .map((p) => ({ uuid: p.uuid, name: p.name_clean }))
      : [];
    return { online: true, players: { online, max, list: players } };
  } catch (error) {
    console.warn("minecraft status: request failed", error);
    return OFFLINE;
  }
}
