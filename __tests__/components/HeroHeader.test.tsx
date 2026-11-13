/**
 * Hero and Header for the concept A redesign (2026-11-12): Sanity-driven hero copy with the
 * approved fallbacks, the copy-email button, the at-a-glance strip, and the header nav.
 */
import { fireEvent, render, screen, within } from "@testing-library/react";
import type { PageInfo, Social } from "@/types";
import Hero from "@/components/sections/Hero";
import Header from "@/components/sections/Header";

const EMAIL = "luisaruiz2734@gmail.com";

const mockPageInfo = {
  name: "Luis A Ruiz",
  role: "Computer Programmer",
  contactInfo: { email: EMAIL },
} as unknown as PageInfo;

describe("Hero", () => {
  it("shows the name with the approved fallback copy when Sanity has none", () => {
    render(<Hero pageInfo={mockPageInfo} />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Luis A Ruiz.");
    expect(h1).toHaveTextContent("Software engineer who makes data behave.");
    expect(screen.getByText("SELECT name, role FROM people WHERE handle = 'luis';")).toBeInTheDocument();
  });

  it("uses Sanity's hero copy when it is set", () => {
    render(
      <Hero
        pageInfo={{
          ...mockPageInfo,
          heroKicker: "SELECT 1;",
          headline: "Builder of things.",
          heroIntro: "Custom intro.",
          status: "Heads down",
        } as PageInfo}
      />
    );

    expect(screen.getByText("SELECT 1;")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Builder of things.");
    expect(screen.getByText("Custom intro.")).toBeInTheDocument();
    expect(screen.getByText("Heads down")).toBeInTheDocument();
  });

  it("links 'See my work' to the projects section", () => {
    render(<Hero pageInfo={mockPageInfo} />);
    expect(screen.getByRole("link", { name: "See my work" })).toHaveAttribute("href", "#projects");
  });

  it("copies the email to the clipboard on click", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

    render(<Hero pageInfo={mockPageInfo} />);
    fireEvent.click(screen.getByRole("button", { name: `Copy email ${EMAIL}` }));

    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });

  it("hides the email button when Sanity has no email (no hard-coded fallback)", () => {
    render(<Hero pageInfo={{ ...mockPageInfo, contactInfo: {} } as unknown as PageInfo} />);
    expect(screen.queryByRole("button", { name: /Copy email/ })).not.toBeInTheDocument();
  });

  it("shows the at-a-glance strip with the Sanity role and the status", () => {
    render(<Hero pageInfo={mockPageInfo} />);
    const strip = screen.getByLabelText("At a glance");
    expect(within(strip).getByText("current_role")).toBeInTheDocument();
    expect(within(strip).getByText("Computer Programmer")).toBeInTheDocument();
    expect(within(strip).getByText("Open to opportunities")).toBeInTheDocument();
  });

  it("no longer loads the remote background video", () => {
    const { container } = render(<Hero pageInfo={mockPageInfo} />);
    expect(container.querySelector("video")).toBeNull();
  });
});

describe("Header", () => {
  const mockSocials: Social[] = [
    { _id: "s1", _type: "social", title: "GitHub", url: "https://github.com/example" } as Social,
  ];

  it("renders the logo as a link back to the top", () => {
    render(<Header socials={mockSocials} />);
    expect(screen.getByRole("link", { name: "Luis A Ruiz, back to top" })).toHaveAttribute("href", "#hero");
  });

  it("renders the nav links with correct hrefs", () => {
    render(<Header socials={mockSocials} />);

    const expected: { label: RegExp; href: string }[] = [
      { label: /^About$/, href: "#about" },
      { label: /^Experience$/, href: "#experience" },
      { label: /^Projects$/, href: "#projects" },
      { label: /^Skills$/, href: "#skills" },
    ];

    expected.forEach(({ label, href }) => {
      const links = screen.getAllByRole("link", { name: label });
      expect(links.length).toBeGreaterThan(0); // desktop nav + mobile menu
      links.forEach((link) => expect(link).toHaveAttribute("href", href));
    });
  });

  it("renders the 'Get in touch' CTA pointing at #contact", () => {
    render(<Header socials={mockSocials} />);
    const ctas = screen.getAllByRole("link", { name: /Get in touch/ });
    expect(ctas.length).toBeGreaterThan(0);
    ctas.forEach((cta) => expect(cta).toHaveAttribute("href", "#contact"));
  });

  it("toggles the mobile menu open when the hamburger is clicked", () => {
    render(<Header socials={mockSocials} />);
    const hamburger = screen.getByRole("button", { name: /Open menu/ });
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(hamburger);
    expect(screen.getByRole("button", { name: /Close menu/ })).toHaveAttribute("aria-expanded", "true");
  });

  it("renders no theme toggle (removed 2026-06-29)", () => {
    render(<Header socials={mockSocials} />);
    expect(screen.queryAllByRole("button", { name: /theme|dark mode|light mode/i })).toHaveLength(0);
  });
});
