/**
 * Component tests for the Projects "3D Tilt + Peek Stack" hover gallery.
 *
 * Verifies the horizontal scrollbar was replaced by a fanned/tilt card stack:
 *  - renders the Sanity-driven `projects` data (all titles present in the DOM)
 *  - the old .overflow-x-scroll scrollbar container is gone
 *  - the "View Project" link is each card's only control (card is not a button; no link, no button)
 *  - hover, or focusing the link, reveals the card detail (data-active)
 *  - degrades sanely with 0, 1 and many items (no crash)
 *
 * Mocks:
 *  - @/lib/sanity: the real module throws at import time when Sanity env vars are
 *    absent, and imageUrl must be deterministic for the card <img> src.
 *  - framer-motion: stub motion.* to plain DOM elements and provide working
 *    useMotionValue/useTransform/useSpring stubs (the component imports them, so
 *    they must resolve to callables or the import is undefined and crashes).
 */
import { act, fireEvent, render, screen } from "@testing-library/react";
import type { Project } from "@/types";
import Projects from "@/components/sections/Projects";

// Deterministic image URL builder — avoids the env-var throw in lib/sanity.
jest.mock("@/lib/sanity", () => ({
  imageUrl: () => "https://example.com/img.png",
}));

// Reduce framer-motion to plain DOM elements. Non-DOM props (variants, whileHover,
// motion-value styles, etc.) are dropped so jsdom doesn't choke on them.
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
        style,
        ...rest
      } = props;
      // Drop motion-value entries from style; keep plain values.
      const cleanStyle: Record<string, any> = {};
      if (style && typeof style === "object") {
        for (const k of Object.keys(style)) {
          const val = (style as any)[k];
          if (val && typeof val === "object" && typeof val.get === "function") {
            continue; // motion value — skip
          }
          cleanStyle[k] = val;
        }
      }
      return React.createElement(
        tag,
        { ref, style: cleanStyle, ...rest },
        children
      );
    });

  // Memoise the stubbed component per tag so React keeps the same component
  // type across re-renders and updates the node in place (rather than
  // remounting a fresh node and detaching the one a test already captured).
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

  const motionValue = (v: any) => ({
    get: () => v,
    set: () => {},
    on: () => () => {},
  });

  return {
    __esModule: true,
    motion,
    AnimatePresence: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
    useMotionValue: (v: any) => motionValue(v),
    useTransform: () => motionValue(0),
    useSpring: (v: any) => v,
  };
});

function makeTechnology(id: string, title: string) {
  return {
    _id: id,
    _type: "skill",
    _createdAt: "2024-01-01",
    _rev: "1",
    _updatedAt: "2024-01-01",
    title,
    progress: 80,
    image: { _type: "image", asset: { _ref: "ref", _type: "reference" } },
  };
}

function makeProject(id: string, title: string): Project {
  return {
    _id: id,
    _type: "project",
    _createdAt: "2024-01-01",
    _rev: "1",
    _updatedAt: "2024-01-01",
    title,
    image: { _type: "image", asset: { _ref: "ref", _type: "reference" } },
    summary: `${title} summary text`,
    technologies: [makeTechnology(`${id}-t1`, "TypeScript")],
    linkToBuild: `https://example.com/${id}`,
  } as Project;
}

const threeProjects = [
  makeProject("p1", "Golbris"),
  makeProject("p2", "Portfolio Site"),
  makeProject("p3", "SharePoint Hub"),
];

describe("Projects tilt/peek stack", () => {
  it("renders the section title", () => {
    render(<Projects projects={threeProjects} />);
    expect(
      screen.getByRole("heading", { name: /projects/i })
    ).toBeInTheDocument();
  });

  it("renders all project titles in the DOM (detail present even if hidden)", () => {
    render(<Projects projects={threeProjects} />);
    expect(screen.getByText("Golbris")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Site")).toBeInTheDocument();
    expect(screen.getByText("SharePoint Hub")).toBeInTheDocument();
  });

  it("does NOT render the old horizontal-scroll scrollbar container", () => {
    render(<Projects projects={threeProjects} />);
    expect(document.querySelector(".overflow-x-scroll")).toBeNull();
  });

  it("has one View Project link per project and no nested interactive card wrapper", () => {
    render(<Projects projects={threeProjects} />);

    const cards = screen.getAllByTestId("project-card");
    expect(cards).toHaveLength(3);
    cards.forEach((card) => {
      expect(card).not.toHaveAttribute("role", "button");
      expect(card).not.toHaveAttribute("tabindex");
    });

    const links = screen.getAllByRole("link", { name: /view project/i });
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "https://example.com/p1");
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("focusing a card's View Project link lifts and reveals that card", () => {
    render(<Projects projects={threeProjects} />);
    const cards = screen.getAllByTestId("project-card");
    const links = screen.getAllByRole("link", { name: /view project/i });

    expect(cards[0]).toHaveAttribute("data-active", "false");
    act(() => links[0].focus());
    expect(cards[0]).toHaveAttribute("data-active", "true");
    act(() => links[0].blur());
    expect(cards[0]).toHaveAttribute("data-active", "false");
  });

  it("reveals a card's detail on mouse enter", () => {
    render(<Projects projects={threeProjects} />);
    const cards = screen.getAllByTestId("project-card");

    fireEvent.mouseEnter(cards[1]);
    expect(cards[1]).toHaveAttribute("data-active", "true");
    fireEvent.mouseLeave(cards[1]);
    expect(cards[1]).toHaveAttribute("data-active", "false");
  });

  it("clicking the card body opens nothing (only the button does)", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    render(<Projects projects={threeProjects} />);

    fireEvent.click(screen.getAllByTestId("project-card")[0]);
    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it("a project with no link shows no View Project button (no blank tab)", () => {
    render(<Projects projects={[{ ...threeProjects[0], linkToBuild: undefined } as unknown as Project]} />);
    // queryByText, not queryByRole: an <a> without href has no "link" role and would hide the bug.
    expect(screen.queryByText("View Project")).not.toBeInTheDocument();
  });

  it("degrades sanely with a single project", () => {
    render(<Projects projects={[makeProject("solo", "Only One")]} />);
    expect(screen.getByText("Only One")).toBeInTheDocument();
    expect(screen.getAllByTestId("project-card")).toHaveLength(1);
  });

  it("degrades sanely with many projects (6) without crashing", () => {
    const many = Array.from({ length: 6 }, (_, i) =>
      makeProject(`m${i}`, `Project ${i}`)
    );
    render(<Projects projects={many} />);
    expect(screen.getAllByTestId("project-card")).toHaveLength(6);
  });

  it("degrades sanely with zero projects (empty state, no crash)", () => {
    render(<Projects projects={[]} />);
    expect(screen.getByTestId("projects-empty")).toBeInTheDocument();
    expect(screen.queryAllByTestId("project-card")).toHaveLength(0);
  });
});
