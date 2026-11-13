/**
 * ExperienceCard date line: no "Invalid Date" when Sanity has no end date, and months
 * don't slip back one in US time zones (dates are formatted in UTC).
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import type { Experience } from "@/types";
import ExperienceCard from "@/components/ExperienceCard";

jest.mock("@/lib/sanity", () => ({ imageUrl: () => "https://example.com/img.png" }));

// Plain DOM elements; drop animation-only props so they don't land on real nodes.
jest.mock("framer-motion", () => {
  const strip = ({ initial, whileInView, whileHover, whileTap, transition, viewport, ...rest }: any) => rest;
  return {
    motion: {
      div: (p: any) => <div {...strip(p)} />,
      img: (p: any) => <img alt="" {...strip(p)} />,
    },
  };
});

function exp(overrides: Partial<Experience>): Experience {
  return {
    _id: "e1",
    jobTitle: "Dev",
    company: "Acme",
    dateStarted: "2020-01-01",
    isCurrentlyWorkingHere: false,
    points: [],
    technologies: [],
    ...overrides,
  } as unknown as Experience;
}

it("past job with no end date shows only the start month, never 'Invalid Date'", () => {
  render(<ExperienceCard experience={exp({ dateEnded: undefined as unknown as string })} />);
  expect(screen.getByText("Jan 2020")).toBeInTheDocument();
  expect(screen.queryByText(/Invalid Date/)).not.toBeInTheDocument();
});

it("shows start - end, in UTC so Jan 1 stays January", () => {
  render(<ExperienceCard experience={exp({ dateEnded: "2022-06-01" })} />);
  expect(screen.getByText("Jan 2020 - Jun 2022")).toBeInTheDocument();
});

it("current job shows Present", () => {
  render(<ExperienceCard experience={exp({ isCurrentlyWorkingHere: true })} />);
  expect(screen.getByText("Jan 2020 - Present")).toBeInTheDocument();
});
