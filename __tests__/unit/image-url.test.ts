/**
 * A Sanity doc with no image must not crash the page: imageUrl returns undefined instead of throwing.
 */
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "abc";
process.env.NEXT_PUBLIC_SANITY_DATASET = "production";

// Both packages are ESM-only, which this jest config can't load. The stub copies the real
// builder's behavior (checked by hand 2026-11-12): .url() throws when the source has no asset.
jest.mock("next-sanity", () => ({ createClient: () => ({}) }));
jest.mock("@sanity/image-url", () => () => ({
  image: (source: any) => ({
    url: () => {
      if (!source?.asset) throw new Error(`Unable to resolve image URL from source (${JSON.stringify(source)})`);
      return `https://cdn.sanity.io/images/${source.asset._ref}`;
    },
  }),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { imageUrl } = require("@/lib/sanity");

test.each([undefined, null, { _type: "image" }])("missing image (%p) gives undefined, not a crash", (source) => {
  expect(imageUrl(source)).toBeUndefined();
});

test("a real image ref gives its url", () => {
  expect(imageUrl({ asset: { _ref: "image-abc" } })).toBe("https://cdn.sanity.io/images/image-abc");
});
