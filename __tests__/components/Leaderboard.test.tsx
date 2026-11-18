/**
 * /minecraft leaderboard: sorts by the chosen tab, formats game units, puts the crown on #1,
 * and labels how old the stats are.
 */
import { fireEvent, render, screen, within } from "@testing-library/react";

// next/image needs Next's runtime; a plain img is enough here.
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => require("react").createElement("img", { ...props, alt: props.alt }),
}));

jest.mock("framer-motion", () => {
  const React = require("react");
  const strip = ({ variants, initial, animate, whileInView, viewport, transition, onViewportEnter, ...rest }: any) => rest;
  const cache: Record<string, any> = {};
  const motion = new Proxy({}, {
    get: (_t, tag: string) =>
      (cache[tag] ??= React.forwardRef(({ children, ...p }: any, ref: any) =>
        React.createElement(tag, { ref, ...strip(p) }, children))),
  });
  return { __esModule: true, motion, MotionConfig: ({ children }: any) => children };
});

import Leaderboard, { updatedLabel, type LeaderboardPlayer } from "@/components/Leaderboard";

const p = (name: string, hours: number, deaths: number, km: number): LeaderboardPlayer => ({
  uuid: `${name}-uuid`,
  name,
  playTime: hours * 72000,
  deaths,
  mobKills: 0,
  blocksMined: 1234,
  distanceCm: km * 100000,
  skin: null,
});

const players = [p("Red_1901", 87.5, 17, 790.5), p("professorsquidd", 99.6, 29, 686.1), p("Sprtan361", 2.7, 0, 14.5)];

const names = () =>
  within(screen.getByRole("table")).getAllByRole("row").slice(1).map((r) => within(r).getAllByRole("cell")[1].textContent);
const crownRow = () => document.querySelector(".leaderboard-crown")!.closest("tr")!;

describe("Leaderboard", () => {
  it("ranks by playtime first, in hours, with the crown on #1", () => {
    render(<Leaderboard players={players} updatedAt="2026-11-17T20:00:00Z" />);
    expect(names()).toEqual(["professorsquidd", "Red_1901", "Sprtan361"]);
    expect(screen.getByText("99.6 h")).toBeInTheDocument();
    expect(document.querySelectorAll(".leaderboard-crown")).toHaveLength(1);
    expect(crownRow()).toHaveTextContent("professorsquidd");
    expect(screen.getByRole("button", { name: "Playtime" })).toHaveAttribute("aria-pressed", "true");
  });

  it("re-sorts and moves the crown when another tab is picked", () => {
    render(<Leaderboard players={players} updatedAt="2026-11-17T20:00:00Z" />);
    fireEvent.click(screen.getByRole("button", { name: "Distance" }));
    expect(names()).toEqual(["Red_1901", "professorsquidd", "Sprtan361"]);
    expect(screen.getByText("790.5 km")).toBeInTheDocument();
    expect(crownRow()).toHaveTextContent("Red_1901");
    expect(screen.getByRole("button", { name: "Distance" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Blocks mined" }));
    expect(screen.getAllByText("1,234")).toHaveLength(3);
  });

  it("shows only the top 10", () => {
    const many = Array.from({ length: 12 }, (_, i) => p(`player${i}`, i + 1, 0, 0));
    render(<Leaderboard players={many} updatedAt="2026-11-17T20:00:00Z" />);
    expect(names()).toHaveLength(10);
    expect(names()[0]).toBe("player11");
  });
});

describe("updatedLabel", () => {
  const at = "2026-11-17T20:00:00Z";
  const minute = Math.floor(Date.parse(at) / 60_000);
  it.each([
    [0, "updated just now"],
    [4, "updated 4 min ago"],
    [125, "updated 2 h ago"],
    [3 * 1440, "updated 3 d ago"],
  ])("%i minutes later reads %s", (later, label) => {
    expect(updatedLabel(at, minute + later)).toBe(label);
  });
  it("is empty for a bad date", () => {
    expect(updatedLabel("not a date", minute)).toBe("");
  });
});
