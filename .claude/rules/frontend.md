---
paths:
  - "**/*.tsx"
  - "**/*.css"
  - "app/**"
  - "components/**"
---

# Frontend and design rules

- Use the design system, tokens, and component library named in `docs/BRIEF.md` section 4. Reuse a component before creating one.
- Load the design skills listed in `docs/BRIEF.md` before building or restyling a screen.
- Accessibility: semantic HTML, labels on every input, visible focus, keyboard reachable, color contrast at the WCAG level set in the brief.
- Every screen works at the breakpoints in the brief and handles loading, empty, and error states.
- Meet the performance budget in the brief. Lazy-load below-the-fold images and heavy components.
- No inline styles or hard-coded colors and spacing where a token exists.
