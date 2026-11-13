/**
 * WorkExperience in the concept A redesign (2026-11-12): the carousel is replaced by a list
 * of full cards, newest first (order comes from the Sanity query).
 *
 * Mocks:
 *  - @/lib/sanity: the real module throws at import time when Sanity env vars are absent.
 */
import { render, screen, within } from "@testing-library/react";
import type { Experience } from "@/types";
import WorkExperience from "@/components/sections/WorkExperience";

jest.mock("@/lib/sanity", () => ({
  imageUrl: () => "https://example.com/img.png",
}));

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
  makeExperience("e1", "Senior Dev", "Initech"),
  makeExperience("e2", "Mid Dev", "Globex"),
  makeExperience("e3", "Junior Dev", "Acme"),
];

describe("WorkExperience list", () => {
  it("renders the section label and every job, in the order given", () => {
    render(<WorkExperience experiences={threeExperiences} />);

    expect(screen.getByRole("heading", { name: "-- experience" })).toBeInTheDocument();
    const titles = within(screen.getByTestId("experience-list"))
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual(["Senior Dev", "Mid Dev", "Junior Dev"]);
  });

  it("has no carousel controls any more", () => {
    render(<WorkExperience experiences={threeExperiences} />);
    expect(screen.queryByRole("button", { name: /next experience/i })).not.toBeInTheDocument();
  });

  it("degrades sanely with zero experiences (empty state, no crash)", () => {
    render(<WorkExperience experiences={[]} />);
    expect(screen.getByTestId("experience-empty")).toBeInTheDocument();
  });
});
