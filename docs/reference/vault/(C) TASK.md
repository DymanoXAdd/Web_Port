---
type: task-input
status: idle
created: 2026-06-23
---

# TASK — Build Input

This is the **main input file** for the build loop. You write what you want built here, set `status: ready`, and the Orchestrator takes it from here: Builder → Checker → (loop up to 5×) → verification pass → logged.

> Don't run the Orchestrator until you've filled in at least one task below and set `status: ready`.

---

## How to write a task
- One concrete, checkable thing per item. "Add a working contact form that emails me via Resend" — not "make the site better."
- Order matters: tasks run top-to-bottom. Note dependencies if any.
- Keep the acceptance line honest — it's what "done" is judged against.

### Template
```
### [ ] <short task name>
- **What:** <what to build/fix, concretely>
- **Acceptance:** <what must be true to call it done — behavior + a passing test>
- **Depends on:** <other task name, or "none">
- **Notes:** <links, files, constraints>
```

---

## Tasks

<!-- Add tasks below. Example left in for shape — replace it. -->

### [x] Second Page  — ✅ completed 2026-06-23 (see 11 Run Logs/Completed)
- **What:** I wan a button which can be clicked which will open a page which will have all my project icons in a globe floating but spaced out from each other
- **Acceptance:** The page must work and the globe has to be in the center of the page.
- **Depends on:** none
- **Notes:** Project.tsx 

### [x] Harden the Checker (baseline pre-existing failures)  — ✅ done 2026-06-23 (infra, not a loop run)
- **What:** Make the Checker baseline-aware so it only blocks on NEW failures, not failures that already existed before a task.
- **Acceptance:** Checker reads a baseline of known failures and reports NEW vs KNOWN; type-check/lint/build never baselined.
- **Depends on:** none
- **Notes:** Done directly — `.claude/agents/checker.md` updated; baseline at `02 Build/(C) checker-baseline.md` (B1 Resend env, B2 Zod trim bug, B3 integration needs server). Orchestrator updated to match.

### [x] Add component-test stack (@testing-library/react + jsdom)  — ✅ done 2026-06-23 (infra, not a loop run)
- **What:** Install + configure a component-testing stack so future UI/page tests can actually be written and run.
- **Acceptance:** A component renders in jsdom under Testing Library and a test passes via a dedicated script.
- **Depends on:** none
- **Notes:** Done directly. Added `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jest-environment-jsdom`, `identity-obj-proxy`. New: `jest.components.config.js`, `jest.setup.ts`, `__mocks__/fileMock.js`, `__tests__/components/smoke.test.tsx`. Script `npm run test:components` (now part of `test:all`). Smoke test green; type-check clean.

### [x] Fix Zod trim/min ordering bug in lib/validation.ts  — ✅ completed 2026-06-23 (1 cycle, via orchestrator)
- **What:** `contactFormSchema` rejects valid input because `.min()` is evaluated before `.trim()`. Reorder so trimming happens first, then length/format validation.
- **Acceptance:** `__tests__/unit/validation.test.ts › trims whitespace from all fields` passes, no other unit test regresses, and baseline entry **B2** is removed from `02 Build/(C) checker-baseline.md`.
- **Depends on:** none
- **Notes:** This is baseline entry B2. Pure logic fix — keep the schema's other rules intact.

### [x] (suggested) Add a component test for the /projects-globe page  — ✅ completed 2026-06-23 (1 cycle, see 11 Run Logs/Completed)
- **What:** Now that the component-test stack exists, add a real render test for the globe page (icons render / centered wrapper present) so "Second Page" is covered by an automated test, not just a manual smoke check.
- **Acceptance:** A `__tests__/components/*.test.tsx` renders the globe with mock projects and asserts icons + centering; passes via `npm run test:components`.
- **Depends on:** Add component-test stack (done)
- **Notes:** Will need to mock `next/link`, `framer-motion`, and the Sanity image builder. Optional but recommended.

### [x] Use the template I gave to build a new Theme for Website  — ✅ completed 2026-06-23 (3 cycles, see 11 Run Logs/Completed)
- **What:** Adapt the design in `New_Theme.md` into the EXISTING Next.js site (do NOT rebuild as Vite). It's a FULL landing redesign: new fixed navbar + full-screen mouse-scrub video hero (typewriter + pill buttons), AND restyle the sections below (About/Skills/Experience/Projects/Contact) to match the new look (fonts, palette, type scale).
- **Acceptance:** Site builds (`npm run build`) and loads with all assets; new navbar + hero + restyled sections render; existing tests still pass (`npm run test:all`); no new Checker baseline failures.
- **Depends on:** none (component test runs first, but no hard dependency)
- **Notes:** Read `New_Theme.md`. DECISIONS (2026-06-23, from Luis): (1) Stack = Next.js, NOT Vite — translate `index.html`/`index.css` instructions into `app/layout.tsx` + `globals.css` equivalents. (2) Scope = full landing redesign. (3) Reuse what exists where sensible (e.g. existing `react-simple-typewriter` is fine instead of a hand-rolled hook) and combine with the current design rather than blindly copying the template. Keep Sanity-driven content wiring intact.

### [x] Wire up the hero background video  — ✅ completed 2026-06-26 (2 cycles; CSP media-src fix)
- **What:** Plug Luis's real video link into the hero so the mouse-scrub background video works (currently `VIDEO_SRC = ""` with a gradient fallback).
- **Acceptance:** `VIDEO_SRC` in `02 Build/components/sections/Hero.tsx` points to the real source; the `<video>` mounts and the mouse-scrub seek effect works; build stays green (`npm run build`) and existing tests pass.
- **Depends on:** New Theme (done)
- **Notes:** ⚠️ NEEDS THE URL FROM LUIS — must be a **direct video file** (e.g. `.mp4`/`.webm`), NOT a webpage link. Replace the `// TODO: replace with a direct .mp4 URL` marker in `Hero.tsx`. <<(https://cdn.pixabay.com/video/2023/11/17/189457-885804464_medium.mp4)>>

### [x] Restore light/dark mode toggle in the navbar  — ✅ completed 2026-06-26 (2 cycles)
- **What:** Bring back the `ThemeToggle` that was dropped in the redesign and place it in the navbar right next to the "Get in touch" link.
- **Acceptance:** The toggle renders next to "Get in touch" on desktop, switches light/dark correctly, and is reachable on mobile too; build + tests stay green.
- **Depends on:** New Theme (done)
- **Notes:** Component still exists at `02 Build/components/theme/ThemeToggle.tsx` (+ `context/ThemeContext.tsx` / `next-themes`). Header is `02 Build/components/sections/Header.tsx`. Make sure the toggle styling fits the new light/black look.

### [x] Remove the Project Globe feature entirely  — ✅ completed 2026-06-26 (1 cycle)
- **What:** Remove the "View Project Globe" button and the `/projects-globe` page completely — Luis no longer wants this feature.
- **Acceptance:** The button is gone from `Projects.tsx`, the `app/projects-globe/` route is deleted, the `ProjectGlobe` component and its test are removed, no dangling imports/links remain, and build + `npm run test:all` are green.
- **Depends on:** none
- **Notes:** Files to remove/clean: `02 Build/app/projects-globe/page.tsx`, `02 Build/components/sections/ProjectGlobe.tsx`, `02 Build/__tests__/components/ProjectGlobe.test.tsx`, and the "View Project Globe" button + link in `02 Build/components/sections/Projects.tsx`. (Note: this undoes the earlier "Second Page" + globe-test tasks — intentional.)

### [x] Fix the "Hey There, I'm Luis"  — ✅ completed 2026-06-26 (1 cycle, see 11 Run Logs/Completed)
- **What:** The Text does not come out of blur , fix animation.
- **Acceptance:** The Text has to move and become readable.
- **Depends on:** None
- **Notes:** Root cause was a hardcoded inline `blur(4px)` with no deblur keyframe. Added `@keyframes hero-deblur` + `.hero-intro` (ends at `blur(0)`, `both` fill-mode) in globals.css; removed the static blur in Hero.tsx. Covered by HeroHeader.test.tsx.

### [x] Fix the Experience and change it into a carousel system  — ✅ completed 2026-06-26 (1 cycle, see 11 Run Logs/Completed)
- **What:** The Experience is a scroll bar and feels weird I want a carousel and have it move when a mouse is either on the left and right
- **Acceptance:** The experience moves and left to right 
- **Depends on:** None
- **Notes:** Section is `components/sections/WorkExperience.tsx`. Replaced the `overflow-x-auto` scrollbar with a carousel: mouse-side advance (left/right half) + left/right arrows + dots; Sanity wiring intact. Covered by WorkExperience.test.tsx (8 tests).

### [x] Update Carousel  — ✅ completed 2026-06-27 (1 cycle, see 11 Run Logs/Completed)
- **What:** I think the auto scroll was a bad idea, remove the auto scroll and space the experience page so the cards don't get covered when it does its animation by the div or experience title. Also make it so the other experience cards to the left and right of the one your on shows a little with is fading out. 
- **Acceptance:** The carousel should only move when the buttons are pressed, and I should be able to see a little of the other cards to the right and left. 
- **Depends on:** None
- **Notes:** None

### [x] Update NAV_LINKS  — ✅ completed 2026-06-27 (1 cycle, see 11 Run Logs/Completed)
- **What:** The spacing and of the words need to be changed. I want them to be spaced from each other and be converted to be bubble style buttons 
- **Acceptance:** The buttons would need to work and be spaced from each other.
- **Depends on:** None
- **Notes:** None

### [x] Fix each page can make sure everything is spaced out and centered  — ✅ completed 2026-06-27 (2 cycles, see 11 Run Logs/Completed)
- **What:** Everything should fit in the page with everything showing. 
- **Acceptance:** The pages should still load with all the attached schemas and other assets.
- **Depends on:** None
- **Notes:** None

### [x] Fix the text on Hero Page  — ✅ completed 2026-06-27 (1 cycle, see 11 Run Logs/Completed)
- **What:** The text "Hey there, I'm Luis A Ruiz, Software Engineer" should be showing, but when the mouse is hover over where it says "Glad you stopped in. Good taste tends to find us. Now, what are we building? [See my work](http://localhost:3000/#projects)[About me](http://localhost:3000/#about)[My experience](http://localhost:3000/#experience)[Let's talk](http://localhost:3000/#contact)Reach me: luisaruiz2734@gmail.com" it will blur the other and show the this one. 
- **Acceptance:** The page should be able to load and the animation should work
- **Depends on:** None
- **Notes:** None

### [x] Replace Projects scrollbar with a 3D Tilt + Peek Stack hover gallery  — ✅ completed 2026-06-29 (1 cycle, see 11 Run Logs/Completed)
- **What:** Replace the current Projects section (`components/sections/Projects.tsx` — a one-project-per-screen horizontal `overflow-x-scroll` scrollbar) with the **"3D Tilt + Peek Stack" hover gallery** (Concept 3). Projects render as fanned, slightly-overlapping cards. Hovering a card lifts it out of the stack, tilts it in 3D toward the cursor, and reveals its detail (title, summary, tech, "View Project"). Neighbors slide aside to make room. Keep all existing Sanity data wiring intact (`project.image`, `title`, `summary`, `technologies`, `linkToBuild`).
- **Acceptance:** The Projects section shows the fanned card stack; hovering a card lifts/tilts it toward the cursor and reveals its detail; clicking opens `linkToBuild`; the old `overflow-x-scroll` scrollbar is gone; build (`npm run build`) and `npm run test:all` stay green; a new component test covers render + hover-reveal behavior. Must include a **touch/keyboard fallback** (hover-only is not acceptable on mobile) — e.g. tap-to-focus a card.
- **Depends on:** none
- **Notes:** Concept reference: `(C) Hover Gallery Concepts/(C) concept-3-tilt-peek-stack.html` (resting fan via `rotateZ`, cursor-follow tilt via `onMouseMove`). Port the tilt math to framer-motion (`useMotionValue`/`useTransform`) since the section already uses framer-motion. Best for a small curated set (3–5 projects) — confirm graceful behavior at 1–2 and 6+ items. See `(C) README.md` in that folder for the data mapping + porting notes.

### [x] Replace Skills animation with the Staggered Cascade + Count-Up (Concept 3), replaying on every entry  — ✅ completed 2026-06-29 (1 cycle, see 11 Run Logs/Completed)
- **What:** Replace the current Skills section animation (`components/sections/Skills.tsx` + `components/Skill.tsx` — a static grid that slides in **once**, hover shows `progress%`) with the **"Staggered Cascade + Count-Up" (Concept 3)**: each skill is a card that rises/scales in one-by-one with a stagger; its number counts up `0 → progress%` and a meter bar fills to `progress%`. The whole animation must **replay every time** the Skills section enters the viewport — not just the first visit. Keep all existing Sanity data wiring intact (`skill.title`, `skill.progress`, `skill.image`).
- **Acceptance:** The Skills section renders the cascade of cards (icon + title + count-up number + fill bar); the cascade, count-up, and bar fill **re-trigger every time** the section scrolls into view (verifiable: scroll away and back, or remount); the old "slide-in once" behavior is gone; `prefers-reduced-motion` is respected (no motion / instant final state when set); build (`npm run build`) and `npm run test:all` stay green; a new component test covers render + that the animation is re-triggerable (not `once`).
- **Depends on:** none
- **Notes:** ✅ Concept chosen by Luis (2026-06-29) from `(C) Skills Animation Concepts/`. Reference: `(C) Skills Animation Concepts/(C) concept-3-cascade-countup.html` (cascade via per-card transition-delay; count-up via `requestAnimationFrame`; bar via animated `width`). Port to framer-motion: `staggerChildren` on the container + `whileInView` with **`viewport={{ once: false }}`** (this is the "every time" mechanic — current code uses `once: true`); count-up as a small rAF hook. See `(C) README.md` in that folder for data mapping + porting notes. Real skill icons are round `image`s — keep them; layer the card/meter around them.

### [x] Remove light/dark mode  — ✅ completed 2026-06-29 (2 cycles, see 11 Run Logs/Completed)
- **What:** The light and dark mode feature does not work and just needs to be removed. Also remove the green theme layer, because everything I highlight is green
- **Acceptance:** The button on top right removed and the feature to change the page removed
- **Depends on:** none
- **Notes:** Deleted `components/theme/ThemeToggle.tsx` + `context/ThemeContext.tsx`; removed ThemeProvider from `app/layout.tsx`; cleaned `Header.tsx`; removed the green `[data-theme="dark"]` accent block + neutralized `::selection` in `globals.css`; flattened green accents in `tailwind.config.js`/`lib/constants.ts`/`lib/email.ts`/`BackgroundCircles.tsx`/`manifest.json`; dropped `next-themes` from package.json. Covered by a new negative test in HeroHeader.test.tsx (no theme-toggle control renders).

### [x] Make sure the Video only shows on the "#hero" page  — ✅ completed 2026-06-29 (2 cycles, see 11 Run Logs/Completed)
- **What:** The video should only show on that page and fix the error of the video showing on the scrollbar when on the other pages.
- **Acceptance:** The video can not be seen on the other pages and only on the hero/main page
- **Depends on:** none
- **Notes:** Root cause: the hero background layer in `components/sections/Hero.tsx` was `fixed inset-0`, pinning the video to the viewport so it bled across every section + showed behind the scrollbar. Changed to `absolute inset-0` so the `relative h-screen overflow-hidden` hero clips it to the hero box. Covered by a regression test in HeroHeader.test.tsx (background wrapper is `absolute`, not `fixed`).

### [x] Make all the title display more to the user  — ✅ completed 2026-06-29 (2 cycles, see 11 Run Logs/Completed)
- **What:** Update the titles of each page to be more on display showing the user was the page contains, black text with bold could look nice.
- **Acceptance:** The titles have a updated format
- **Depends on:** none
- **Notes:** All section titles share `.section-title` in `app/globals.css`. Restyled it to true black `#000`, `font-extrabold`, larger (`text-3xl sm:text-4xl md:text-5xl`), tighter tracking; nudged title/subtitle `top` offsets so nothing overlaps. Applies consistently to About/Skills/Experience/Projects/Contact. Title-renders coverage added for About (SectionLayout.test.tsx); Skills/Projects/Experience/Contact already covered.

### [x] Update color background   — ✅ completed 2026-07-15 (2 cycles, see 11 Run Logs/Completed)
- **What:** Update the background with "Reach Me: luisaruiz2734@gmail.com" to be white instead of transparent. 
- **Acceptance:** The background has to be white
- **Depends on:** none
- **Notes:** none

### [x] Update the Language Text in Skills Page   — ✅ completed 2026-07-15 (2 cycles, see 11 Run Logs/Completed)

- **What:** The language Text under the image needs to be more readable and needs to be the color black to be seen better.  
- **Acceptance:** The text has to be black
- **Depends on:** none
- **Notes:** none
## The loop (reference)
1. **Builder** writes/fixes code in `02 Build/`.
2. **Checker** runs type-check, lint, tests, build → `VERDICT: PASS` or `FAIL`.
3. **FAIL** → back to Builder with the errors. Max **5 cycles** per task.
4. **5th FAIL** → stop, log to `11 Run Logs/Stalled (5-Cycle Stops)/`, move on.
5. **PASS** → verification pass (confirm feature is real + covered by a passing test).
6. **Done** → logged to `11 Run Logs/Completed/`.

All managed by the **Orchestrator** agent.
