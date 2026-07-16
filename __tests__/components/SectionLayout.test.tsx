/**
 * Verification-pass coverage for the spacing/centering restyle.
 *
 * Renders About, Skills, Projects, and ContactMe under jsdom + Testing Library
 * with minimal mock Sanity data and asserts, for each section, that:
 *  - it renders without crashing,
 *  - its content is wrapped in a centered, constrained container
 *    (a `.mx-auto` element AND an element whose className contains `max-w-`),
 *  - the mocked Sanity-driven content actually renders (proving the wiring
 *    that reads from the props is intact, not dropped during the restyle).
 *
 * Mocks:
 *  - @/lib/sanity: the real module throws at import time when env vars are
 *    absent; urlFor must also be deterministic for the <img> srcs.
 *  - framer-motion: reduced to plain DOM elements so animation-only props don't
 *    leak onto real nodes / interfere under jsdom.
 */
import { render, screen } from "@testing-library/react";
import type { PageInfo, Project, Skill, Technology } from "@/types";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import ContactMe from "@/components/sections/ContactMe";

// Deterministic image URL builder — avoids the env-var throw in lib/sanity.
jest.mock("@/lib/sanity", () => ({
  urlFor: () => ({ url: () => "https://example.com/img.png" }),
}));

// Reduce framer-motion to plain DOM elements. Animation-only props that aren't
// valid DOM attrs are stripped so jsdom doesn't warn / break.
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
    // Skills' cascade uses these; default to "in view, full motion" so the
    // section renders its end state under jsdom.
    useInView: () => true,
    useReducedMotion: () => false,
  };
});

/** Asserts a section is centered + width-constrained. */
function expectCenteredConstrainedContainer(container: HTMLElement) {
  expect(container.querySelector(".mx-auto")).toBeInTheDocument();
  expect(container.querySelector('[class*="max-w-"]')).toBeInTheDocument();
}

const mockImage = {
  _type: "image" as const,
  asset: { _ref: "ref", _type: "reference" as const },
};

describe("About section layout", () => {
  const mockPageInfo = {
    name: "Luis A Ruiz",
    role: "Computer Programmer",
    backgroundInformation:
      "I am a computer programmer who loves building things.",
    profilePic: mockImage,
  } as unknown as PageInfo;

  it("renders, is centered/constrained, and surfaces the Sanity bio text", () => {
    const { container } = render(<About pageInfo={mockPageInfo} />);

    expectCenteredConstrainedContainer(container);

    // The Sanity-driven background information must actually render.
    expect(
      screen.getByText(/I am a computer programmer who loves building things\./)
    ).toBeInTheDocument();
  });

  it("renders the prominent 'About' section title heading", () => {
    render(<About pageInfo={mockPageInfo} />);

    // Mirrors the Skills/Projects/Experience title assertions: the shared
    // .section-title heading must render so the consistent-titles restyle is
    // covered for About too.
    expect(
      screen.getByRole("heading", { name: /about/i })
    ).toBeInTheDocument();
  });
});

describe("Skills section layout", () => {
  const mockSkills: Skill[] = [
    {
      _id: "sk1",
      _type: "skill",
      _createdAt: "2024-01-01",
      _rev: "1",
      _updatedAt: "2024-01-01",
      title: "TypeScript",
      progress: 85,
      image: mockImage,
    } as Skill,
    {
      _id: "sk2",
      _type: "skill",
      _createdAt: "2024-01-01",
      _rev: "1",
      _updatedAt: "2024-01-01",
      title: "SQL",
      progress: 90,
      image: mockImage,
    } as Skill,
  ];

  it("renders, is centered/constrained, and surfaces a Sanity skill", () => {
    const { container } = render(<Skills skills={mockSkills} />);

    expectCenteredConstrainedContainer(container);

    // The skill image carries the Sanity-driven title as alt text.
    expect(screen.getByAltText("TypeScript")).toBeInTheDocument();
    expect(screen.getByAltText("SQL")).toBeInTheDocument();
  });
});

describe("Projects section layout", () => {
  const mockTech: Technology = {
    _id: "t1",
    _type: "skill",
    _createdAt: "2024-01-01",
    _rev: "1",
    _updatedAt: "2024-01-01",
    title: "Next.js",
    progress: 80,
    image: mockImage,
  } as Technology;

  const mockProjects: Project[] = [
    {
      _id: "p1",
      _type: "project",
      _createdAt: "2024-01-01",
      _rev: "1",
      _updatedAt: "2024-01-01",
      title: "Golbris Platformer",
      image: mockImage,
      summary: "A 2.5D platformer about a golem awakening.",
      technologies: [mockTech],
      linkToBuild: "https://example.com/golbris",
    } as Project,
  ];

  it("renders, is centered/constrained, and surfaces a Sanity project", () => {
    const { container } = render(<Projects projects={mockProjects} />);

    expectCenteredConstrainedContainer(container);

    // The Sanity-driven project title and summary must render.
    expect(screen.getByText(/Golbris Platformer/)).toBeInTheDocument();
    expect(
      screen.getByText(/A 2.5D platformer about a golem awakening\./)
    ).toBeInTheDocument();
  });
});

describe("ContactMe section layout", () => {
  const mockPageInfo = {
    name: "Luis A Ruiz",
    contactInfo: {
      email: "luisaruiz2734@gmail.com",
      phoneNumber: "555-0100",
      address: "Somewhere, USA",
    },
  } as unknown as PageInfo;

  it("renders, is centered/constrained, and surfaces the contact heading + form", () => {
    const { container } = render(<ContactMe pageInfo={mockPageInfo} />);

    expectCenteredConstrainedContainer(container);

    // The contact heading renders.
    expect(screen.getByText(/Let'?s Talk\.?/)).toBeInTheDocument();

    // The contact form fields render (Sanity-independent form is intact).
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit/i })
    ).toBeInTheDocument();

    // The Sanity-driven contact info renders too.
    expect(screen.getByText("luisaruiz2734@gmail.com")).toBeInTheDocument();
  });
});
