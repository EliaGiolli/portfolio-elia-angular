# Portfolio redesign: UX audit and 2026 inspiration

Sep 29, 2026 · @Elia

## Verdict

The engineering is ahead of the design: the code is accessible, SSR-rendered and documented, but the pages look like a component-library demo. That's why the site feels predictable. The fix isn't more decoration. The fix is a point of view.

**What reads as banal today**

- **The homepage is a centred card, not a landing page.** "I'm Elia Giolli / Angular developer", ten tech logos in 52px chips and two buttons. There's no claim, no proof and no next step beyond "Go to projects". A recruiter learns your stack but not why they should hire you.
- **Logo walls read as filler in 2026.** Ten logos at 32px plus chips are the biggest objects on the page, bigger than your name. They also render black (Simple Icons have no fill), so they look like a monochrome clip-art strip.
- **Everything is a card.** Skills, methodology, CTA, projects and the contact form all use the same white 20px box with a soft shadow. When everything is a card, nothing is the hero.
- **One blue, used everywhere at once.** #2D44FF marks headings, eyebrows, buttons, chips, links and the logo. It stops meaning "act here".
- **Safe type.** Poppins at 600, with every heading the same weight and tracking. There's no contrast between a display face and a reading face. Poppins also isn't loaded, so most visitors see the system font.
- **The About copy is strong but badly staged.** "Software that gets diagnosed, not just designed" is a real positioning line. Right now it's a grey subtitle under a generic H1.

**What to keep**

- The positioning: the IT-support-to-Angular story, diagnosis as a method, and "real apps, not tutorial clones". That's your differentiator. Build the design around it.
- The `>_` prompt logo and the electric blue. They're distinctive enough to carry a terminal/diagnostic visual language.
- The accessibility and SSR foundations: skip link, one `<main>`, real 404s, reduced-motion handling. Few portfolios have these, so show them off instead of hiding them.

## What 2026 portfolios do

The strongest developer portfolios in 2026 lead with one sentence of positioning, prove it with two or three deep case studies, and use motion and type as craft signals rather than decoration. Trend roundups also list a lot of noise (3D scenes, AI-generated art, glassmorphism). For an Angular developer who sells accessibility and diagnosis, most of that works against you.

**Trends, filtered for you**

| Trend | What it is | For you |
| --- | --- | --- |
| Positioning-first hero | One headline that says what you do and for whom, e.g. [Brittany Chiang](https://brittanychiang.com): "I build accessible, pixel-perfect experiences for the web." | **Adopt.** Your line exists already: "Software that gets diagnosed, not just designed." |
| Kinetic and variable typography | Type that shifts weight or width on scroll or hover ([Envato](https://elements.envato.com/learn/web-design-trends)) | **Adapt.** One variable display face, one subtle weight shift on the hero. No per-letter effects. |
| Bento grids | Modular tiles of mixed sizes that summarise skills, stats and links in one screen ([B12](https://www.b12.io/resource-center/website-design/web-design-guide-bento-grids-and-kinetic-typography/)) | **Adopt** for the homepage "proof" band. It replaces the logo wall. |
| Purposeful micro-interactions | Small feedback moments that do something useful ([Envato](https://elements.envato.com/learn/web-design-trends)) | **Adopt.** A live terminal line, a copy-email button, focus states that feel designed. |
| Colour branding | One distinctive accent plus neutrals, used consistently ([Envato portfolio trends](https://elements.envato.com/learn/portfolio-trends)) | **Keep and discipline.** Blue becomes the action colour only. |
| Dark mode | Deep coloured darks rather than pure black ([Envato portfolio trends](https://elements.envato.com/learn/portfolio-trends)) | **Adopt.** A deep navy theme fits the terminal motif. Respect `prefers-color-scheme`. |
| Texture and grain | Paper, noise, print-like surfaces | **Adapt lightly.** A faint dot grid ("diagnostic graph paper") on hero and cover bands. |
| Repos as portfolio | Let open-source work speak, e.g. [Anthony Fu](https://antfu.me) ([Colorlib](https://colorlib.com/wp/developer-portfolios/)) | **Adopt partially.** Link README-quality docs and ADRs from each case study. |
| Timelines and career stories | Experience as a scannable timeline ([Colorlib](https://colorlib.com/wp/developer-portfolios/): Leland Jansen, Tania Rascia) | **Adopt** on About: IT support to Angular is a story worth drawing. |
| 3D, WebGL, immersive scroll | Interactive 3D scenes ([Envato](https://elements.envato.com/learn/web-design-trends)) | **Skip.** Heavy, hard to make accessible, off-message. |
| Glassmorphism / liquid glass | Frosted translucent panels | **Skip.** Only the sticky navbar blur you already have. |
| Gamified navigation | Playful, game-like exploration ([Envato portfolio trends](https://elements.envato.com/learn/portfolio-trends)) | **Skip.** Recruiters scan; don't make them play. |

**Portfolios worth studying**

- [Brittany Chiang](https://brittanychiang.com): sticky left column with name, one-line pitch and section links; experience as a dated list with tech tags; a colophon in the footer. The model for a recruiter-friendly layout.
- [Josh W. Comeau](https://www.joshwcomeau.com/): personality through small details (sound toggle, mascot, playful hovers) on top of calm type. Proof that delight can be accessible.
- [Anthony Fu](https://antfu.me): the work *is* the portfolio. Minimal chrome, dense lists of real projects.
- [Leland Jansen](https://www.lelandjansen.com): blueprint-grid hero and case-study approach, close to the diagnostic look proposed here.

## Accessibility bar

Target WCAG 2.2 AA. It's where the European standard is heading, and "fully accessible" is your selling point, so the portfolio has to exceed what you claim. The European Accessibility Act has been enforced since 28 June 2025 and references EN 301 549 (WCAG 2.1 AA). A version built on WCAG 2.2 was published on 2 September 2026 ([Level Access](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/)). A personal portfolio is probably out of scope, so treat this as a quality bar, not a legal duty.

**Checklist for the new pages**

- [ ] **Contrast:** 4.5:1 for all text, 3:1 for icons, borders and focus rings, checked in both themes. Fix the three status colours flagged in the design system (`danger`, `reset`, `success`).
- [ ] **Focus visible on everything (2.4.7, 2.4.11):** your `app-button` `all: unset` likely removes the outline. Restore it and make sure the sticky navbar never covers a focused element (`scroll-padding-top`).
- [ ] **Target size (2.5.8):** at least 24×24px for chips, social links and the menu toggle; 44px is better.
- [ ] **Motion:** every scroll or hover animation has a `prefers-reduced-motion` fallback; nothing auto-plays for more than 5 seconds without a pause control.
- [ ] **Hover-only content:** the tech tooltip must also open on focus and close on Escape (1.4.13), or be replaced by visible labels.
- [ ] **State not by colour:** filter chips get `aria-pressed`; form errors get `aria-invalid` + `aria-describedby`.
- [ ] **Headings:** one `h1` per page, with no level skipped (the homepage currently puts an `h3` above the `h1`).
- [ ] **Tests in CI:** `@axe-core/playwright` on every route (Performonitoring already uses it), plus a manual pass with NVDA or VoiceOver.
- [ ] **Show it:** an "Accessibility" line in the footer linking to a short statement with what you tested and how. It's proof, not decoration.

## Homepage as a landing page

Rebuild `/` as a full-width, six-section landing page that answers three recruiter questions in order: who are you, can you prove it, how do I reach you. The centred card goes away, and so do the ten-logo rows and the tech chips at 32px.

1. **Hero, in the first viewport.** Eyebrow `ANGULAR DEVELOPER · PISA, IT`. H1 in a big display face (clamp 2.5–4.5rem): *"Software that gets diagnosed, not just designed."* One sentence under it: real apps, Signals, SSR, accessible by default. Two actions: **See my work** (primary) and **Download CV** (secondary). On the right or behind, a small live "terminal" card that types `> ng build — 0 a11y violations — SSR ok` once, frozen under reduced motion. Available-for-work status as a quiet dot + text.
2. **Proof strip.** Three or four facts as text, not logos: "9 shipped projects", "SSR + hydration", "WCAG 2.2 AA tested", "5 languages". Only facts you can defend.
3. **Selected work.** Two or three case studies as large alternating rows: a screenshot or cover band, the problem, what you built, one hard decision, and links. Performonitoring should be one of them (it has screenshots and a real architecture). Then "All projects →".
4. **How I work.** Your diagnostic method as four numbered steps: Isolate → Trace → Fix → Document. This turns the IT-support past into a method instead of an apology. Use a horizontal stepper on desktop and a vertical list on mobile.
5. **Stack, compact.** One bento tile or a single line of small text labels grouped by Frontend, Backend and Testing. Icons at 20px at most, with a visible name next to each. No tooltips needed.
6. **Contact CTA.** A big closing line ("Have a system that needs diagnosing?"), a copy-to-clipboard email with an `aria-live` "Copied" confirmation, and GitHub/LinkedIn links.

**Refactor notes (Angular)**

- Split the page into standalone section components (`hero`, `proof-strip`, `featured-work`, `method`, `stack`, `contact-cta`) so About and Projects can reuse them.
- Featured projects come from `ProjectService` via a `featured: true` flag (add it to both `ProjectsSchema` and `ProjectsTypes`).
- Use `@defer (on viewport)` for the work section's images and `NgOptimizedImage` with `priority` only on the hero.
- Route transitions with `withViewTransitions()` in the router config. Same-document view transitions are Baseline in all three engines since October 2025 ([web.dev](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available)).
- Scroll-reveal effects via CSS `animation-timeline` only as progressive enhancement inside `@supports` and `prefers-reduced-motion: no-preference`. Browser support is still uneven ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)).

## About page: three directions

I recommend **B, "The incident report"**. It turns your unusual path into the page's structure, and no generic template can copy it. A and C are safer fallbacks.

|  | A. Editorial profile | B. The incident report | C. Two-column index |
| --- | --- | --- | --- |
| Idea | A magazine-style long read: huge pull quote, portrait with the offset shadow, text in a narrow measure | Your career told as a diagnostic log: *Symptom → Root cause → Fix → Postmortem*, each a section | Brittany Chiang-style: sticky left column (name, pitch, section links), scrolling right column |
| Layout | Single column, 42rem measure, full-bleed quote bands | Monospace section labels (`01 SYMPTOM`), a vertical timeline from IT support to Angular, dot-grid background | Split 40/60 on desktop, stacked on mobile; active section highlighted in the nav |
| Signature detail | Drop cap and a real quote from your copy | A "status: resolved" badge per chapter; the skills grid becomes a "toolkit" with what each tool solved | Experience as dated rows with tech tags |
| Strength | Calm and personal; great with your writing | Memorable and on-brand with the `>_` logo and "diagnosed, not designed" | Fast for recruiters to scan |
| Risk | Can feel like a blog post | Needs restraint to stay professional, not cosplay | Widely copied; less personality |

**What changes on the page regardless of direction**

- The portrait gets a real role: larger, next to the headline, captioned. Right now it's squeezed into a three-column grid.
- The four skill cards become a short **toolkit** list with a line on *what problem each skill solved*, not four identical boxes.
- "How I Work" moves to the homepage method section, and About links to it.
- Add a **timeline** (IT support → self-study → Angular projects) and a **languages** line (you mention five but don't list them).
- End with the same contact CTA as the homepage, not a GitHub card.

## Design system changes

Evolve Giolli Design from "blue SaaS template" to "precise diagnostic tool". Keep the blue and the `>_` logo; change type, add a dark theme, and cut the accent's jobs down to one.

| Area | Today | Proposed |
| --- | --- | --- |
| Display type | Poppins 600–800, not actually loaded | A variable grotesk with character for headings (e.g. Space Grotesk, Bricolage Grotesque or Instrument Sans), self-hosted as woff2 |
| Body type | Poppins | Keep one readable sans for body (Inter-alternatives: Instrument Sans, Geist) at 1rem/1.6 |
| Mono | System stack, used only for inline code | A real mono (JetBrains Mono or Geist Mono) for eyebrows, labels, the terminal card and data |
| Type scale | Seven near-identical headings | Fewer, further apart: display 4.5rem, h1 3rem, h2 2rem, h3 1.25rem, body 1rem, label 0.8rem mono |
| Accent use | Headings, eyebrows, links, chips, buttons, logo | Actions, focus and active state only. Headings go to `text-primary` |
| Neutrals | Blue-tinted greys | Keep, add a proper scale (`neutral-50` … `neutral-900`) so borders and surfaces stop borrowing from `bg-accent-secondary` |
| Themes | Light only | Light + dark (deep navy around #0B1020, accent lightened to about #7C8BFF with dark text on it); both checked for 4.5:1 |
| Status colours | Fail AA (3.3–3.8:1) | Darker `danger` (e.g. #C62828) and `success` (#1B7F3B), always paired with a word or icon |
| Surfaces | Everything is a white 20px card | Three levels: flat section (no border), outlined panel (1px, 12px radius), raised card (hover lift) used only for clickable work |
| Radius | 4 → 20px + pill | Tighter, more technical: 6 / 10 / 16 px + pill |
| Texture | None | A 24px dot grid at 6–8% opacity for hero and cover bands |
| Motion | Hover lifts everywhere | Lifts only on clickable cards; one hero typing moment; route view transitions; all gated by reduced motion |
| Icons | 32px chips, black Simple Icons | 16–20px mono-tone, always with visible text; chips only for the contact links |

The font suggestions are options to test, not a decision. I can mock up two type pairings in the design system before you pick.

## Projects: Performonitoring

Add [Performonitoring](https://github.com/EliaGiolli/Performonitoring) as two entries, one per stack, linking to the same monorepo folder by folder. Leave `demo_link` empty: the detail page already hides the Live Demo button when it's blank. Its README says: *"There is no hosted demo: the app reads and fixes the PC it runs on, so it only makes sense on your own machine."*

| Field | Frontend entry | Backend entry |
| --- | --- | --- |
| `project_name` | Performonitoring — Dashboard | Performonitoring — API |
| `tech_stack` | `frontend` | `backend` |
| `description` (≤155 chars) | Real-time Windows performance dashboard in React and TypeScript: live CPU, RAM, disk and network charts. No live demo: it monitors the PC it runs on. | Express 5 and TypeScript API that samples PC metrics every 2s, stores them with Prisma and SQLite, streams them via Socket.IO. No demo: it runs locally. |
| `technologies` | react, typescript, vite, tailwindcss | express, typescript, prisma |
| `technologies_detail` | react, typescript, vite, tailwindcss, reactquery, radixui, shadcnui, zod | nodedotjs, express, typescript, prisma, sqlite, zod, swagger |
| `core_tech` | react | express |
| `github_link` | `…/Performonitoring/tree/main/frontend` | `…/Performonitoring/tree/main/backend` |
| Highlights | Live Recharts graphs over `socket.io-client`; TanStack Query + Zustand state; keyboard, screen-reader and touch-target support tested with `@axe-core/playwright`; dark and light themes | Snapshots every 2s with `systeminformation`; PowerShell fix actions with confirmation for destructive ones; OpenAPI docs generated from Zod schemas; bound to `127.0.0.1` with strict CORS and Helmet |
| Cover image | `docs/screenshots/dashboard-dark.png` | Swagger UI screenshot, or the same dashboard |

**Checklist**

- [ ] Add both entries to `projects.model.ts` and new ids to `public/sitemap.xml` (the sitemap is hand-maintained).
- [ ] Add a `socketdotio` icon to `assets/icons/tech/`, `TECH_ICONS` and `TECH_LABELS` if you want Socket.IO shown; the model spec fails if an icon file is missing. Recharts and Zustand have no Simple Icons mark, so mention them in the text.
- [ ] Put "Runs locally on Windows · no hosted demo" in the `summary` too, so the detail page says it where the button would be.
- [ ] Cross-link the two entries ("See the API" / "See the dashboard").
- [ ] Decide what happens to the existing **Dev Dashboard** entry (`dashboard-admin-express`): it covers similar ground (system metrics in SQLite via Prisma).

## Next steps

1. Pick the About direction (A, B or C) and a type pairing.
2. Update the design system first: new fonts, neutral scale, dark theme, fixed status colours, tighter radii.
3. Mock up the new homepage and About page as designs from those tokens, then review them before any Angular code.
4. Add the two Performonitoring entries; they're independent of the redesign and can ship now.
5. Build the homepage sections as standalone components, with axe tests per route.
6. Fix the accessibility items in the checklist above as part of the same pass.

## Sources

- [Brittany Chiang portfolio](https://brittanychiang.com)
- [Josh W. Comeau](https://www.joshwcomeau.com/)
- [Colorlib: 21 best developer portfolio websites (2026)](https://colorlib.com/wp/developer-portfolios/)
- [Envato: portfolio design trends for 2026](https://elements.envato.com/learn/portfolio-trends)
- [Envato: web design trends for 2026](https://elements.envato.com/learn/web-design-trends)
- [B12: bento grids and kinetic typography](https://www.b12.io/resource-center/website-design/web-design-guide-bento-grids-and-kinetic-typography/)
- [Level Access: European Accessibility Act](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/)
- [web.dev: same-document view transitions are Baseline](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available)
- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [Performonitoring README](https://github.com/EliaGiolli/Performonitoring)
- [portfolio-elia-angular](https://github.com/EliaGiolli/portfolio-elia-angular) at commit bb3c465
