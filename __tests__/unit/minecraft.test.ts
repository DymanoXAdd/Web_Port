/**
 * getServerStatus: online servers show players with their Mojang skin; any failure shows offline
 * (or no skin) instead of breaking the page.
 */
import { getServerStatus, getSkinUrl } from "@/lib/minecraft";

const reply = (body: unknown, ok = true) => Promise.resolve({ ok, json: () => Promise.resolve(body) });
const mockFetch = (impl: (url: string) => Promise<unknown>) => {
  global.fetch = jest.fn(impl) as unknown as typeof fetch;
};
const statusUrl = (address: string) => `https://api.mcstatus.io/v2/status/java/${address}`;

const UUID = "11475f91-4c66-4a44-bb63-34dbc5e67660";
const textures = (skinUrl: string) => ({
  properties: [
    {
      name: "textures",
      value: Buffer.from(JSON.stringify({ textures: { SKIN: { url: skinUrl } } })).toString("base64"),
    },
  ],
});

describe("getServerStatus", () => {
  it("returns online with player counts, names and https skin URLs", async () => {
    mockFetch((url) =>
      url.startsWith("https://sessionserver.mojang.com/")
        ? reply(textures("http://textures.minecraft.net/texture/abc123"))
        : reply({
            online: true,
            players: {
              online: 2,
              max: 12,
              list: [
                { uuid: UUID, name_clean: "professorsquidd" },
                { uuid: "../../evil", name_clean: "bad uuid is dropped" },
              ],
            },
          })
    );
    await expect(getServerStatus("1.2.3.4:25565")).resolves.toEqual({
      online: true,
      players: {
        online: 2,
        max: 12,
        list: [{ uuid: UUID, name: "professorsquidd", skin: "https://textures.minecraft.net/texture/abc123" }],
      },
    });
    expect(global.fetch).toHaveBeenCalledWith(statusUrl("1.2.3.4%3A25565"), expect.anything());
    expect(global.fetch).toHaveBeenCalledWith(
      "https://sessionserver.mojang.com/session/minecraft/profile/11475f914c664a44bb6334dbc5e67660",
      expect.anything()
    );
  });

  it("gives no skin when Mojang fails or names another host", async () => {
    const status = { online: true, players: { online: 1, max: 12, list: [{ uuid: UUID, name_clean: "p" }] } };
    for (const profile of [reply({}, false), reply(textures("https://evil.example/texture/abc"))]) {
      mockFetch((url) => (url.startsWith("https://sessionserver") ? profile : reply(status)));
      const result = await getServerStatus("1.2.3.4");
      expect(result.players?.list).toEqual([{ uuid: UUID, name: "p", skin: null }]);
    }
  });

  it("ignores a trailing line break in the address", async () => {
    mockFetch(() => reply({ online: true, players: { online: 0, max: 12 } }));
    await getServerStatus("1.2.3.4:25565\r\n");
    expect(global.fetch).toHaveBeenCalledWith(statusUrl("1.2.3.4%3A25565"), expect.anything());
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

describe("getSkinUrl", () => {
  it("never fetches for a malformed UUID (it would go into the Mojang URL)", async () => {
    mockFetch(() => reply(textures("http://textures.minecraft.net/texture/abc123")));
    await expect(getSkinUrl("../../evil")).resolves.toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
