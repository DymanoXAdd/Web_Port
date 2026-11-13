# (C) Skills Animation Concepts — Skills section

Three **concept mockups** for replacing the current Skills animation (`02 Build/components/sections/Skills.tsx` + `02 Build/components/Skill.tsx`).

**Today:** a static grid of round icons that slide in **once** (`viewport={{ once: true }}`); hovering an icon grayscales it and shows `progress%`.
**Your ask:** a more modern animation that **replays every time** someone lands on the Skills section — not just the first visit.

These are throwaway visual references — **plain HTML, no images, just lettered circles** standing in for the real skill icons. Open each `.html` in a browser, watch it load, and hit **↻ Replay** to see the every-time behavior. Pick the *feel* before any `.tsx`/framer-motion work begins.

## The three concepts

| # | File | Pattern | Replay behavior | Feel | Best for |
|---|------|---------|-----------------|------|----------|
| 1 | `(C) concept-1-radial-progress-rings.html` | **Radial Progress Rings** — each icon sits inside an SVG ring that animates filling to `progress%` | Re-fills on every entry (IntersectionObserver) | Data-forward, precise, professional | Showing real proficiency numbers |
| 2 | `(C) concept-2-infinite-marquee.html` | **Infinite Marquee** — two rows of skill pills auto-scroll in opposite directions, never stop; hover a row to pause | Always in motion (continuous) | Modern SaaS / "alive" landing page | Lots of skills, constant motion |
| 3 | `(C) concept-3-cascade-countup.html` | **Staggered Cascade + Count-Up** — cards rise/scale in one-by-one; number counts 0→% and a bar fills | Full cascade replays on every entry | Energetic, satisfying, "loads in" | A clean grid that feels dynamic |

## How they map to real Sanity data
- Lettered circle → `skill.image` (the round icon)
- Name label → `skill.title`
- Percent / ring fill / count-up / bar → `skill.progress` (0–100)
- No new fields needed — same schema as today.

## Notes for the eventual `.tsx` port
- **The "every time" mechanic:** drop `viewport={{ once: true }}` → use `viewport={{ once: false }}` (framer-motion re-fires `whileInView` on each entry), or an `IntersectionObserver` re-trigger like these mockups.
- **Concept 1** — SVG ring + animated `stroke-dashoffset`; easy with framer-motion `whileInView` on the circle. Keeps the "show the %" idea you already have, just more visual.
- **Concept 2** — pure CSS keyframe scroll (duplicate the list for a seamless loop); least JS. Note: it's *always* animating, so "replays every time" is automatic — but it's a different vibe (motion as ambiance, not a per-visit reveal).
- **Concept 3** — framer-motion stagger (`staggerChildren`) + a small `requestAnimationFrame` count-up hook. Most "wow on load."
- All need a **reduced-motion** guard (`prefers-reduced-motion`) and to stay readable on mobile before shipping.

## To make a pick
Open all three, watch them load + hit Replay, and tell me which feel you want (1, 2, or 3). Then I'll write the chosen one up as the real task in `(C) TASK.md`, set `status: ready`, and run it through the build loop.
