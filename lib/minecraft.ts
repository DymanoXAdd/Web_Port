export type ServerStatus = {
  online: boolean;
  players: { online: number; max: number } | null;
};

const OFFLINE: ServerStatus = { online: false, players: null };

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
    const { online, max } = data.players ?? {};
    return {
      online: true,
      players:
        typeof online === "number" && typeof max === "number" ? { online, max } : null,
    };
  } catch (error) {
    console.warn("minecraft status: request failed", error);
    return OFFLINE;
  }
}
