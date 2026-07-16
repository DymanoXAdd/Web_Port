/**
 * Component render tests for the redesigned Hero and Header (the new theme).
 * Renders both under jsdom + Testing Library and asserts the new solo-brand
 * theme actually rendered: the blurred intro, the four action pills with their
 * hrefs, the copy-email pill (clipboard write), and the header logo / nav / CTA.
 *
 * useTypewriter is mocked to a settled value so the typewriter timers don't make
 * the test time-dependent.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import type { PageInfo, Social } from "@/types";
import Hero from "@/components/sections/Hero";
import Header from "@/components/sections/Header";

// Mock the typewriter hook so the typed line is deterministic (no timers).
jest.mock("@/lib/useTypewriter", () => ({
  useTypewriter: () => ({
    displayed: "Now, what are we building?",
    done: true,
  }),
}));

// Minimal pageInfo — Hero only reads `name` and `role`. Cast to satisfy the type
// without supplying the full Sanity document shape.
const mockPageInfo = {
  name: "Luis A Ruiz",
  role: "Computer Programmer",
} as unknown as PageInfo;

const EMAIL = "luisaruiz2734@gmail.com";

describe("Hero (redesigned / new theme)", () => {
  it("renders the intro heading with the name and role", () => {
    render(<Hero pageInfo={mockPageInfo} />);

    expect(screen.getByText(/Luis A Ruiz/)).toBeInTheDocument();
    expect(screen.getByText(/Computer Programmer/)).toBeInTheDocument();
  });

  it("intro heading uses the deblur animation and is not statically blurred", () => {
    const { container } = render(<Hero pageInfo={mockPageInfo} />);

    // The heading carries the deblur-animation class (which resolves to blur(0)).
    const intro = container.querySelector(".hero-intro");
    expect(intro).toBeInTheDocument();

    // It must NOT pin a static blur via inline style — that was the bug that
    // left the text permanently unreadable.
    const inlineFilter = (intro as HTMLElement | null)?.style.filter ?? "";
    expect(inlineFilter).not.toMatch(/blur\(\s*[1-9]/);

    // The name/role text lives inside the animated heading.
    expect(intro).toHaveTextContent(/Luis A Ruiz/);
    expect(intro).toHaveTextContent(/Computer Programmer/);
  });

  it("renders the four solo-brand action pills with correct hrefs", () => {
    render(<Hero pageInfo={mockPageInfo} />);

    const expected: { label: RegExp; href: string }[] = [
      { label: /See my work/, href: "#projects" },
      { label: /About me/, href: "#about" },
      { label: /My experience/, href: "#experience" },
      { label: /Let's talk/, href: "#contact" },
    ];

    expected.forEach(({ label, href }) => {
      const link = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", href);
    });
  });

  it("renders the email pill and copies the email to the clipboard on click", async () => {
    // Install a clipboard mock. Use fireEvent (not userEvent) for the click so
    // userEvent's own clipboard handling doesn't shadow this stub.
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<Hero pageInfo={mockPageInfo} />);

    // The visible email text in the pill.
    expect(screen.getByText(EMAIL)).toBeInTheDocument();

    const copyButton = screen.getByRole("button", {
      name: `Copy email ${EMAIL}`,
    });
    fireEvent.click(copyButton);

    expect(writeText).toHaveBeenCalledWith(EMAIL);

    // After a successful copy (async) the button surfaces the confirmation.
    expect(await screen.findByText(/Copied!/)).toBeInTheDocument();
  });

  it("copy-email button uses a solid white background (bg-white, not bg-transparent)", () => {
    render(<Hero pageInfo={mockPageInfo} />);

    const copyButton = screen.getByRole("button", {
      name: `Copy email ${EMAIL}`,
    });
    expect(copyButton.className).toContain("bg-white");
    expect(copyButton.className).not.toContain("bg-transparent");
  });

  it("renders the full-height hero container", () => {
    const { container } = render(<Hero pageInfo={mockPageInfo} />);
    expect(container.querySelector(".h-screen")).toBeInTheDocument();
  });

  it("hover blur/swap resets cleanly on mouse-leave (heading not stuck blurred)", () => {
    const { container } = render(<Hero pageInfo={mockPageInfo} />);

    const swapWrapper = screen.getByTestId("hero-copy");
    const intro = container.querySelector(".hero-intro") as HTMLElement;
    expect(intro).toBeInTheDocument();

    // Hover the secondary-copy region: the swap engages.
    fireEvent.mouseEnter(swapWrapper);
    expect(container.querySelector(".hero-swap-active")).toBeInTheDocument();

    // Leave: the swap state must fully reset so nothing latches blurred/hidden.
    fireEvent.mouseLeave(swapWrapper);
    expect(container.querySelector(".hero-swap-active")).not.toBeInTheDocument();

    // The heading never pins a non-zero blur inline, and its text is still there.
    const inlineFilter = intro.style.filter ?? "";
    expect(inlineFilter).not.toMatch(/blur\(\s*[1-9]/);
    expect(intro).toHaveTextContent(/Luis A Ruiz/);
    expect(intro).toHaveTextContent(/Computer Programmer/);
  });

  it("mounts the background <video> with the Pixabay CDN src", () => {
    const { container } = render(<Hero pageInfo={mockPageInfo} />);
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute(
      "src",
      "https://cdn.pixabay.com/video/2023/11/17/189457-885804464_medium.mp4"
    );
  });

  it("contains the background layer to the hero (absolute, not fixed)", () => {
    // Regression guard: the background wrapper must be `absolute inset-0` so the
    // video stays inside the hero. A `fixed` wrapper let the video bleed across
    // the whole page — that was the bug.
    const { container } = render(<Hero pageInfo={mockPageInfo} />);

    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();

    // Walk up from the video to the background layer wrapper (the
    // `inset-0 z-0` div that holds the gradient fallback + the video).
    const wrapper = video?.closest("div.inset-0.z-0") as HTMLElement | null;
    expect(wrapper).not.toBeNull();

    expect(wrapper!.className).toContain("absolute");
    expect(wrapper!.className).not.toContain("fixed");
  });
});

describe("Header (redesigned / new theme)", () => {
  const mockSocials: Social[] = [
    {
      _id: "s1",
      _type: "social",
      title: "GitHub",
      url: "https://github.com/example",
    } as Social,
  ];

  it("renders the logo text", () => {
    render(<Header socials={mockSocials} />);
    expect(screen.getByText("Luis A Ruiz")).toBeInTheDocument();
  });

  it("renders the desktop nav links with correct hrefs", () => {
    render(<Header socials={mockSocials} />);

    const expected: { label: RegExp; href: string }[] = [
      { label: /^About$/, href: "#about" },
      { label: /^Experience$/, href: "#experience" },
      { label: /^Skills$/, href: "#skills" },
      { label: /^Projects$/, href: "#projects" },
    ];

    expected.forEach(({ label, href }) => {
      const links = screen.getAllByRole("link", { name: label });
      // The label appears in both the desktop nav and the mobile overlay.
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => expect(link).toHaveAttribute("href", href));
    });
  });

  it("renders the 'Get in touch' CTA pointing at #contact", () => {
    render(<Header socials={mockSocials} />);

    const ctas = screen.getAllByRole("link", { name: /Get in touch/ });
    expect(ctas.length).toBeGreaterThan(0);
    ctas.forEach((cta) => expect(cta).toHaveAttribute("href", "#contact"));
  });

  it("toggles the mobile overlay open when the hamburger is clicked", () => {
    render(<Header socials={mockSocials} />);

    const hamburger = screen.getByRole("button", { name: /Open menu/ });
    expect(hamburger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(hamburger);

    expect(
      screen.getByRole("button", { name: /Close menu/ })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("renders no theme/dark/light/toggle control (the theme toggle was removed)", () => {
    render(<Header socials={mockSocials} />);

    // No button surfaces a theme-toggle accessible name. This guards against the
    // removed light/dark mode control being reintroduced.
    const themeButtons = screen.queryAllByRole("button", {
      name: /theme|dark mode|light mode|toggle/i,
    });
    expect(themeButtons).toHaveLength(0);

    // The previously-used toggle test id is gone too.
    expect(screen.queryByTestId("theme-toggle")).not.toBeInTheDocument();

    // No element carries a theme-toggle aria-label by attribute either.
    const { container } = render(<Header socials={mockSocials} />);
    expect(
      container.querySelector(
        '[aria-label*="theme" i], [aria-label*="dark mode" i], [aria-label*="light mode" i]'
      )
    ).toBeNull();
  });
});
