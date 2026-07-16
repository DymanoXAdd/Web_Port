/**
 * Component tests for the Experience carousel (WorkExperience).
 *
 * Verifies the scroll-bar UX was replaced by a left/right carousel:
 *  - renders the Sanity-driven `experiences` data (one active card at a time)
 *  - left/right controls advance the active item
 *  - controls disable at the edges
 *  - degrades sanely with 0 and 1 items (no crash, no broken controls)
 *
 * Mocks:
 *  - @/lib/sanity: the real module throws at import time when Sanity env vars are
 *    absent, and urlFor must be deterministic for ExperienceCard's <img> src.
 *  - framer-motion: AnimatePresence's exit-animation + `mode="wait"` can leave the
 *    old node mounted in jsdom (no real animation frames). We stub it (and motion)
 *    to plain elements so exactly one active card is in the DOM after a transition.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import type { Experience } from "@/types";
import WorkExperience from "@/components/sections/WorkExperience";

// Deterministic image URL builder — avoids the env-var throw in lib/sanity.
jest.mock("@/lib/sanity", () => ({
  urlFor: () => ({ url: () => "https://example.com/img.png" }),
}));

// Reduce framer-motion to plain DOM elements so AnimatePresence doesn't keep the
// exiting card mounted under jsdom. Props that aren't valid DOM attrs are dropped.
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

  const motion = new Proxy(
    {},
    {
      get: (_target, key: string) => passthrough(key),
    }
  );

  return {
    __esModule: true,
    motion,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
  };
});

function makeExperience(id: string, jobTitle: string, company: string): Experience {
  return {
    _id: id,
    _type: "experience",
    _createdAt: "2024-01-01",
    _rev: "1",
    _updatedAt: "2024-01-01",
    jobTitle,
    company,
    companyImage: { _type: "image", asset: { _ref: "ref", _type: "reference" } },
    dateStarted: "2022-01-01",
    dateEnded: "2023-01-01",
    isCurrentlyWorkingHere: false,
    points: ["Did a thing"],
    technologies: [],
  } as Experience;
}

const threeExperiences = [
  makeExperience("e1", "Junior Dev", "Acme"),
  makeExperience("e2", "Mid Dev", "Globex"),
  makeExperience("e3", "Senior Dev", "Initech"),
];

describe("WorkExperience carousel", () => {
  it("renders the section title and the first Sanity-driven experience", () => {
    render(<WorkExperience experiences={threeExperiences} />);

    expect(
      screen.getByRole("heading", { name: /experience/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Junior Dev")).toBeInTheDocument();
    // Only the active card is shown — later cards are not in the DOM.
    expect(screen.queryByText("Mid Dev")).not.toBeInTheDocument();
  });

  it("renders left/right carousel controls (not a native scrollbar)", () => {
    render(<WorkExperience experiences={threeExperiences} />);

    expect(
      screen.getByRole("button", { name: /previous experience/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next experience/i })
    ).toBeInTheDocument();
    // No native horizontal-scroll container.
    expect(
      document.querySelector(".overflow-x-auto")
    ).not.toBeInTheDocument();
  });

  it("advances to the next item when the right control is clicked", () => {
    render(<WorkExperience experiences={threeExperiences} />);

    expect(screen.getByText("Junior Dev")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /next experience/i }));

    expect(screen.getByText("Mid Dev")).toBeInTheDocument();
    expect(screen.queryByText("Junior Dev")).not.toBeInTheDocument();
  });

  it("moves back to the previous item when the left control is clicked", () => {
    render(<WorkExperience experiences={threeExperiences} />);

    fireEvent.click(screen.getByRole("button", { name: /next experience/i }));
    expect(screen.getByText("Mid Dev")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /previous experience/i }));
    expect(screen.getByText("Junior Dev")).toBeInTheDocument();
  });

  it("disables the controls at the edges of the carousel", () => {
    render(<WorkExperience experiences={threeExperiences} />);

    // At the start: prev disabled, next enabled.
    expect(
      screen.getByRole("button", { name: /previous experience/i })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /next experience/i })
    ).toBeEnabled();

    // Advance to the last item: next disabled, prev enabled.
    fireEvent.click(screen.getByRole("button", { name: /next experience/i }));
    fireEvent.click(screen.getByRole("button", { name: /next experience/i }));

    expect(screen.getByText("Senior Dev")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next experience/i })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /previous experience/i })
    ).toBeEnabled();
  });

  it("navigates ONLY via the buttons/dots — mouse movement over the carousel does not advance", () => {
    render(<WorkExperience experiences={threeExperiences} />);

    const carousel = screen.getByTestId("experience-carousel");

    // Hovering/moving the mouse over the right half must NOT change the active card.
    fireEvent.mouseMove(carousel, { clientX: 1000, clientY: 50 });
    fireEvent.mouseMove(carousel, { clientX: 1000, clientY: 50 });
    expect(screen.getByText("Junior Dev")).toBeInTheDocument();
    expect(screen.queryByText("Mid Dev")).not.toBeInTheDocument();

    // Hovering the left half must NOT change it either.
    fireEvent.mouseMove(carousel, { clientX: 0, clientY: 50 });
    fireEvent.mouseLeave(carousel);
    expect(screen.getByText("Junior Dev")).toBeInTheDocument();

    // Only an explicit click moves the carousel.
    fireEvent.click(screen.getByRole("button", { name: /next experience/i }));
    expect(screen.getByText("Mid Dev")).toBeInTheDocument();
  });

  it("jumps to an item via its dot indicator", () => {
    render(<WorkExperience experiences={threeExperiences} />);

    fireEvent.click(
      screen.getByRole("button", { name: /go to experience 3/i })
    );

    expect(screen.getByText("Senior Dev")).toBeInTheDocument();
  });

  it("degrades sanely with a single experience (controls disabled, no dots)", () => {
    render(
      <WorkExperience experiences={[makeExperience("solo", "Only Dev", "Solo")]} />
    );

    expect(screen.getByText("Only Dev")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous experience/i })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /next experience/i })
    ).toBeDisabled();
    expect(screen.queryByTestId("carousel-dots")).not.toBeInTheDocument();
  });

  it("degrades sanely with zero experiences (empty state, no crash)", () => {
    render(<WorkExperience experiences={[]} />);

    expect(screen.getByTestId("experience-empty")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /next experience/i })
    ).not.toBeInTheDocument();
  });
});
