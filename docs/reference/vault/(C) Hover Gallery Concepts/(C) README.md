# (C) Hover Gallery Concepts — Projects section

Three **concept mockups** for replacing the current Projects scrollbar (`02 Build/components/sections/Projects.tsx`, currently a one-project-per-screen horizontal `overflow-x-scroll`) with a **Hover Gallery Carousel**.

These are throwaway visual references — **plain HTML, no images, just numbered squares**. Open each `.html` in a browser and hover. The goal is to pick the *feel* before any `.tsx`/framer-motion work begins.

## The three concepts

| # | File | Pattern | Orientation | Best for | Feel |
|---|------|---------|-------------|----------|------|
| 1 | `(C) concept-1-expanding-panels.html` | **Expanding Panels (accordion)** — hover grows one panel, others shrink; active panel reveals its content | Horizontal | 4–6 projects | Clean, classic, content-forward |
| 2 | `(C) concept-2-spotlight-coverflow.html` | **Spotlight / Coverflow** — all stay visible; hovered one pops forward, rest blur/dim/shrink | Horizontal | Keeping the whole set in view | Punchy, focus-driven |
| 3 | `(C) concept-3-tilt-peek-stack.html` | **3D Tilt + Peek Stack** — fanned overlapping cards; hover lifts one out and tilts it toward the cursor (3D) | Horizontal | 3–5 standout projects | Premium, most interactive |
| 4 | `(C) concept-4-vertical-expanding-panels.html` | **Vertical Expanding Panels** — stacked rows; hover grows a row's height, others shrink; reads as a list | **Vertical** | 4–6 projects | Clean, list-like, tall-section friendly |
| 5 | `(C) concept-5-bento-grid-spotlight.html` | **Bento Grid Spotlight** — grid of tiles; hover lights up + reveals one, the rest dim; no scrolling | Grid | Whole portfolio on one screen | Modern, "everything visible" |
| 6 | `(C) concept-6-dock-magnify-filmstrip.html` | **Dock Magnify Filmstrip** — cursor-following macOS-dock magnification along a strip | Horizontal | Many projects (scrollable strip) | Playful, true "hover carousel" |

## How they map to real project data
- Numbered square → `project.image`
- Revealed/caption text → `project.title`, `project.summary`, `project.technologies`
- A click → `project.linkToBuild` ("View Project")

## Notes for the eventual `.tsx` port
- Concepts 1, 2, 4 & 5 are **pure CSS hover** — trivial to do with Tailwind + a `group`/`peer` or framer-motion `whileHover`.
- Concepts 3 & 6 use **JS** (a few lines in the `<script>` block) for cursor-follow tilt / dock magnification → port to `onMouseMove` + framer-motion `useMotionValue`/`useTransform`.
- All three want **keyboard/touch fallbacks** before shipping (hover-only = no mobile). On touch, fall back to tap-to-focus or the existing snap-scroll.

## To make a pick
Open all three, hover around, and tell me which feel you want. Then I'll write it up as a proper task in `(C) TASK.md` and run it through the build loop.
