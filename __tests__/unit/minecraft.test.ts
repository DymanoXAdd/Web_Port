/**
 * getServerStatus: online servers show players; any failure shows offline instead of breaking the page.
 */
import { getServerStatus } from "@/lib/minecraft";

const mockFetch = (impl: () => Promise<unknown>) => {
  global.fetch = jest.fn(impl) as unknown as typeof fetch;
};
const reply = (body: unknown, ok = true) => Promise.resolve({ ok, json: () => Promise.resolve(body) });

describe("getServerStatus", () => {
  it("returns online with player counts", async () => {
    mockFetch(() => reply({ online: true, players: { online: 2, max: 12, list: [] } }));
    await expect(getServerStatus("1.2.3.4:25565")).resolves.toEqual({
      online: true,
      players: { online: 2, max: 12 },
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.mcstatus.io/v2/status/java/1.2.3.4%3A25565",
      expect.anything()
    );
  });

  it("ignores a trailing line break in the address", async () => {
    mockFetch(() => reply({ online: true, players: { online: 0, max: 12 } }));
    await getServerStatus("1.2.3.4:25565\r\n");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.mcstatus.io/v2/status/java/1.2.3.4%3A25565",
      expect.anything()
    );
  });

  it("returns offline when the server is down", async () => {
    mockFetch(() => reply({ online: false }));
    await expect(getServerStatus("1.2.3.4")).resolves.toEqual({ online: false, players: null });
  });

  it("returns offline when the status service fails or errors", async () => {
    mockFetch(() => reply({}, false));
    await expect(getServerStatus("1.2.3.4")).resolves.toEqual({ online: false, players: null });
    mockFetch(() => Promise.reject(new Error("network")));
    await expect(getServerStatus("1.2.3.4")).resolves.toEqual({ online: false, players: null });
  });

  it("returns offline without calling out when no address is set", async () => {
    mockFetch(() => reply({ online: true }));
    await expect(getServerStatus("")).resolves.toEqual({ online: false, players: null });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
