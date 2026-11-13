/**
 * Component tests for the Skills "Staggered Cascade + Count-Up" section.
 *
 * Verifies the round-icon slide-in was replaced by a cascade of cards that
 * replay on EVERY viewport entry:
 *  - renders the Sanity-driven `skills` data (heading, all titles, icons)
 *  - the final progress percentage is present (count-up end state / reduced path)
 *  - the every-time replay mechanic is wired: useInView is called with once:false
 *  - prefers-reduced-motion renders the final state instantly (no crash)
 *
 * Mocks:
 *  - @/lib/sanity: the real module throws at import time when Sanity env vars are
 *    absent, and imageUrl must be deterministic for each card <img> src.
 *  - framer-motion: stub motion.* to plain DOM elements (memoised per tag so React
 *    keeps the same component type across re-renders) and provide working stubs for
 *    every hook the components import — useInView and useReducedMotion are jest
 *    mocks the tests control.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import type { Skill } from "@/types";

// Deterministic image URL builder — avoids the env-var throw in lib/sanity.
jest.mock("@/lib/sanity", () => ({
  imageUrl: () => "https://example.com/img.png",
}));

// Controllable hooks shared with the framer-motion mock.
const useInViewMock = jest.fn((_ref?: any, _opts?: any) => true);
const useReducedMotionMock = jest.fn(() => false);

jest.mock("framer-motion", () => {
  const React = require("react");
  const passthrough = (tag: string) =>
    React.forwardRef(({ children, ...props }: any, ref: any) => {
      const {
        variants,
        initial,
        animate,
        exit,
        whileInView,
        whileHover,
        whileTap,
        viewport,
        transition,
        custom,
        ...rest
      } = props;
      return React.createElement(tag, { ref, ...rest }, children);
    });

  // Memoise the stubbed component per tag so React keeps the same component type
  // across re-renders (updates in place rather than remounting a fresh node).
  const cache: Record<string, any> = {};
  const motion = new Proxy(
    {},
    {
      get: (_target, key: string) => {
        if (!cache[key]) cache[key] = passthrough(key);
        return cache[key];
      },
    }
  );

  return {
    __esModule: true,
    motion,
    AnimatePresence: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
    useInView: (ref: any, opts: any) => useInViewMock(ref, opts),
    useReducedMotion: () => useReducedMotionMock(),
  };
});

import Skills from "@/components/sections/Skills";

function makeSkill(id: string, title: string, progress: number): Skill {
  return {
    _id: id,
    _type: "skill",
    _createdAt: "2024-01-01",
    _rev: "1",
    _updatedAt: "2024-01-01",
    title,
    progress,
    image: { _type: "image", asset: { _ref: "ref", _type: "reference" } },
  } as Skill;
}

const threeSkills = [
  makeSkill("s1", "SQL", 95),
  makeSkill("s2", "TypeScript", 80),
  makeSkill("s3", "React", 70),
];

beforeEach(() => {
  useInViewMock.mockReset();
  useInViewMock.mockReturnValue(true);
  useReducedMotionMock.mockReset();
  useReducedMotionMock.mockReturnValue(false);
});

describe("Skills cascade + count-up", () => {
  it("renders the section title", () => {
    render(<Skills skills={threeSkills} />);
    expect(
      screen.getByRole("heading", { name: "-- stack" })
    ).toBeInTheDocument();
  });

  it("renders all skill titles", () => {
    render(<Skills skills={threeSkills} />);
    expect(screen.getByText("SQL")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("exposes each skill as a labelled progressbar with its real value", () => {
    render(<Skills skills={threeSkills} />);
    const bar = screen.getByRole("progressbar", { name: "SQL proficiency" });
    expect(bar).toHaveAttribute("aria-valuenow", "95");
  });

  it("Replay restarts the cards (remounts them) without losing any", () => {
    render(<Skills skills={threeSkills} />);
    const before = screen.getAllByTestId("skill-card")[0];
    fireEvent.click(screen.getByRole("button", { name: "Replay" }));
    const after = screen.getAllByTestId("skill-card");
    expect(after).toHaveLength(3);
    expect(after[0]).not.toBe(before);
  });

  it("renders a percentage readout per skill (count-up display present)", () => {
    // In jsdom the count-up's requestAnimationFrame doesn't advance, so the live
    // count starts at 0; we assert the percent readout exists for every card.
    // The exact final number is asserted deterministically in the reduced-motion
    // test below (which renders the end state synchronously).
    render(<Skills skills={threeSkills} />);
    const percents = screen.getAllByText(/%$/);
    expect(percents).toHaveLength(3);
  });

  it("renders each skill's round icon with its title as alt text", () => {
    render(<Skills skills={threeSkills} />);
    const icons = screen.getAllByRole("img");
    expect(icons).toHaveLength(3);
    icons.forEach((img) => {
      // next/image serves the Sanity URL through its optimizer: /_next/image?url=<encoded>&w=...
      expect(img.getAttribute("src")).toContain(encodeURIComponent("https://example.com/img.png"));
    });
    expect(screen.getByAltText("SQL")).toBeInTheDocument();
    expect(screen.getByAltText("TypeScript")).toBeInTheDocument();
    expect(screen.getByAltText("React")).toBeInTheDocument();
  });

  it("wires the replay-on-every-entry mechanic (useInView once:false, NOT once:true)", () => {
    render(<Skills skills={threeSkills} />);
    expect(useInViewMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ once: false })
    );
    // Defensively confirm it was never set up as a one-shot.
    useInViewMock.mock.calls.forEach((call) => {
      expect(call[1]).not.toEqual(expect.objectContaining({ once: true }));
    });
  });

  it("respects prefers-reduced-motion: final percentages render instantly, no crash", () => {
    useReducedMotionMock.mockReturnValue(true);
    // Even if it were 'out of view', reduced motion must show the final state.
    useInViewMock.mockReturnValue(false);

    render(<Skills skills={threeSkills} />);

    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  it("degrades sanely with zero skills (no crash)", () => {
    render(<Skills skills={[]} />);
    expect(
      screen.getByRole("heading", { name: "-- stack" })
    ).toBeInTheDocument();
    expect(screen.queryAllByTestId("skill-card")).toHaveLength(0);
  });
});
