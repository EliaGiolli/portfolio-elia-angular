# Portfolio redesign — implementation plan

Source of truth for the redesign. `GUIDELINES.md` (same folder) is the background audit, and `Design.pdf` is the visual target. Where they conflict with this file, this file wins.

**Status:** Phase 0 in review. Tick tasks here as they land: the tick goes in the same commit as the task.

---

## How this plan is run

- Each **phase is one pull request**, on its own branch, against `main`.
- Each **task is one commit**, and is small enough to finish and verify without asking questions. Every task names its files and has a *Done when* check.
- **Every PR leaves the site working**: no dead links, no half-migrated page. That's why some removals wait for a later phase (for example, the navbar goes only when the homepage has its own section nav).

### Git workflow, per phase

1. Start the branch:
   ```bash
   git switch main && git pull --ff-only
   git switch -c <phase-branch>
   ```
2. Work through the tasks in order. Each commit uses a conventional subject (`feat(projects): …`), ticks its checkbox in this file, and ends with:
   ```
   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   ```
3. **Phase gate:** `npm test` and `npm run build` pass, plus the phase's own *Done when* checks. Fix failures in the branch; never skip them.
4. Open the PR:
   ```bash
   git push -u origin <phase-branch>
   gh pr create --base main
   ```
   Title = the phase name. The body lists the tasks, how each was verified and any follow-ups, and ends with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
5. **Stop.** Report the PR URL and wait for Elia to merge.
6. After Elia confirms the merge:
   ```bash
   gh pr view <n> --json state,mergedAt     # must be MERGED
   git switch main && git pull --ff-only
   git branch -d <phase-branch>             # -D only if squash-merged AND the check above says MERGED
   git push origin --delete <phase-branch>  # if GitHub didn't auto-delete it
   ```
   Then start the next phase.

---

## Decisions

| Topic | Decision |
|---|---|
| Positioning | **Backend developer (Node.js / NestJS)**, not front-end. The PDF layout stays; copy, ordering and emphasis change (see [Backend positioning](#backend-positioning)). |
| Why the site is Angular | Deliberate: NestJS borrows Angular's architecture (modules, DI, decorators, guards/pipes/interceptors), so the same patterns work on both sides of the API. The site says so in one sentence (About ¶3 + footer). Phrase it as "the same architecture on both sides", **never** "I build e2e Angular + NestJS apps", because no single project proves that yet. |
| Homepage layout | Two-column index (GUIDELINES direction C): sticky left column + scrolling sections About / Experience / Work / Method / Contact. |
| `/about`, `/contacts` | Redirect to `/#about` and `/#contact`. |
| Theme | **Light only.** Colours are tokens, but there are no dark values and no toggle. |
| `/projects` | One index. `/projects/backend` and `/projects/frontend` stay as canonical, prerendered URLs with the stack preselected. `tech`, `q` and `sort` are query params, so a filtered view can be shared. |
| Default project order | **Backend first**, so recruiters see the back ends before anything else. |
| Project count | 10 (3 backend / 7 frontend): the current 9, plus Performonitoring API + Dashboard, minus Dev Dashboard. |
| Forms | Stay on Reactive Forms. Signal Forms are only stable from Angular 22; the project is on 21.2. |
| State | Signals + `computed` only. The single RxJS use is a `toSignal` over router events in the shell. |

---

## Backend positioning

The layout is the PDF's. The copy below replaces the PDF's frontend copy. It is a **draft built only from facts already in `projects.model.ts` and GUIDELINES**; Elia reviews all of it before it ships.

| Place | PDF (frontend) | New (backend) |
|---|---|---|
| Hero eyebrow | `FRONT-END DEVELOPER · ANGULAR · PISA, ITALY` | `BACKEND DEVELOPER · NESTJS · PISA, ITALY` |
| Hero H1 | Interfaces that are fast, accessible and built to last. | *APIs and systems that are reliable, validated and built to last.* |
| Hero lede | Angular, Signals, SSR; also React/Next/Astro | Back-end systems with NestJS and Node.js: modular APIs, typed contracts, relational data. Also ships the front ends that consume them (Angular, React). |
| About ¶1 | Angular + `computed()` highlight | NestJS system design: modules with clear boundaries, dependency injection, DTOs validated at the edge, PostgreSQL through an ORM. The inline mono highlight becomes `@Module()`. |
| About ¶2 | a dashboard, a library manager, this portfolio | "Real, working applications": **Bookgraph** (NestJS + PostgreSQL, a library modelled as a graph) and **Performonitoring's API** (Express, Prisma/SQLite, Socket.IO, OpenAPI from Zod) first, front ends second. |
| About ¶3 | how the front end talks to its API | How an API is shaped for its clients, where validation lives, what happens when a dependency fails. Plus the **why-Angular sentence**. Keep "five languages". |
| Experience row 1 | Front-end developer · independent projects | Backend developer · independent projects |
| Selected work | Zenith, Shelfspot, Performonitoring | **Bookgraph → Performonitoring (API row, links to the dashboard) → Zenith** |
| How I build | Accessible by default / State you can follow / Validated at the edges / Written down | **Validated at the edges / Clear module boundaries / Documented contracts / Failure is designed** |
| Contact line | Building something with Angular? Let's talk. | Building an API or a back-end system? Let's talk. |
| Projects intro | Angular first … then the Node.js back ends | Back ends first (NestJS, Express), then the front ends that consume them. |
| Segmented control | All / Frontend / Backend | **All / Backend / Frontend** |
| Default sort | Angular first | **Backend first**: stack (backend → frontend), then `order`, then `year` desc. Fallback when there's no `order`: `core_tech` priority nestjs > express > angular > react > nextdotjs > astro. |

Open items for Elia (placeholders that must be filled before launch):
- `[YEAR]`, `[COMPANY]` and the availability line in `profile.model.ts`.
- The CV file is `Elia_Giolli_CV_Angular_Developer.pdf`. Replace or rename it if a backend CV exists; the link lives in `home-intro`.

---

## Design spec (from Design.pdf)

**Homepage `/`**
- **Left column (sticky on desktop, dot-grid background):**
  - `>_` logo + name, then the mono eyebrow, display H1 and lede;
  - numbered section nav `01 ABOUT … 05 CONTACT` (the active item gets a long accent line and bold text);
  - availability dot + text;
  - **Download CV** (primary) + GitHub / LinkedIn / mail as 44px square outlined icon buttons.
- **Right column:** each section has a mono number + `h2`:
  - **About:** 3 paragraphs + portrait with an offset tinted shadow and a "Pisa, Italy" caption.
  - **Experience:** dated rows inside one outlined panel.
  - **Selected work:** 3 rows; Performonitoring shows a screenshot; then "Explore all 10 projects →".
  - **How I build:** 4 tiles `> 01 …`, 2×2.
  - **Contact:** H3 line, copy-email button, Name / Email / Message form, **Send message**.
- **Footer:** "Built with Angular 21 · SSR · Accessibility statement".
- **Mobile:** stacked; the section nav becomes a sticky, horizontally scrolling pill strip (active pill filled dark).

**Projects `/projects`**
- Slim header: logo + "← Back to home".
- Eyebrow `PROJECTS`, H1 "Real applications, not tutorial clones.", intro, "Showing N of M".
- Filter panel: search, segmented stack control with counts, sort select, a `TECHNOLOGY` row of pill toggles.
- Card grid (3 columns):
  - cover band coloured by core tech (mono label + year);
  - title + `BACKEND`/`FRONTEND` mono label, description, tag pills;
  - status line with dot + word (green *Live demo* / grey *Runs locally · no demo* / grey *Code only*) and "Case study →".

**Project detail `/projects/:stack/:id`**
- Header: "← All projects".
- Eyebrow `BACKEND · 2026 · SOLO DEVELOPER`, H1, lede, and a framed screenshot.
- **No live demo** callout (icon + reason + inline code).
- Summary + **Highlights** on the left. A sticky aside with `STACK` as text, a primary "View code on GitHub ↗" and a secondary cross-link ("See the API →" / "See the dashboard →").

**Visual language**
- Accent (#2D44FF) only for actions, active state and focus. Headings near-black, cool neutrals.
- Surfaces: 1px outlined panels with ~10–12px radii. Raised cards only for clickable projects.
- Type: grotesk display face, mono labels. Tags are small accent-tinted pills.

---

## Architecture

### Design tokens — `src/styles.css`
- Neutral scale `--neutral-0…900`.
- Surfaces: `--surface-page`, `--surface-panel`, `--border-subtle`.
- Text: `--text-primary / -secondary / -muted`.
- Accent: `--accent`, `--accent-hover`, `--accent-tint`, `--on-accent`.
- Status: `--success #1B7F3B`, `--danger #C62828`.
- Radii 6 / 10 / 16 / pill. Keep `--space-*`.
- Fonts: `--font-display` (Space Grotesk, variable), `--font-body`, `--font-mono` (JetBrains Mono). Self-hosted woff2 in `public/fonts/`, preloaded in `index.html`.
- Type scale: display `clamp(2.5rem, 5vw, 4.5rem)`, h1 3rem, h2 2rem, h3 1.25rem, body 1rem / 1.6, label 0.8rem mono uppercase.
- Utilities: `.eyebrow`, `.dot-grid` (24px radial grid, ~7% opacity), `.sr-only`, `.skip-link`, `html { scroll-padding-top }`.
- Cover-band colours: `TECH_BRAND` / `techBrand()` in `shared/types/techMeta.ts`. Every bg/fg pair must reach ≥4.5:1.

### Data
- **`ProjectsSchema` + `ProjectsTypes`, always edited together.** New fields:
  - `featured?: boolean`
  - `order?: number`
  - `runs_locally?: boolean`
  - `no_demo_reason?: string`
  - `related?: { id: number; label: string }`
- **Demo status is derived, not stored:** `live` if `demo_link` is set, `local` if `runs_locally`, `code` otherwise.
- **`core/models/profile.model.ts` + `core/schemas/profileSchema.ts`:** availability, experience[], method[], languages, email, socials.
- **`ProjectService` keeps `_projects` and drops UI state.** It exposes:
  - pure `filterProjects({ stack, tech[], q, sort })`;
  - `demoStatus(p)`;
  - `featuredProjects`, `allTechnologies` (ordered by frequency) and `countsByStack`, all `computed`.
  - Filter state lives in the URL.

### Routing and SSR
- `provideRouter` gets `withComponentInputBinding()`, `withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })` and `withViewTransitions()` (the transition is skipped under reduced motion).
- `provideClientHydration(withEventReplay(), withIncrementalHydration())`.
- **Routes:**
  - `''` → `Home`.
  - `about` / `contacts` → `redirectTo` functions returning `createUrlTree(['/'], { fragment })`.
  - `projects`, `projects/backend`, `projects/frontend` → `ProjectsIndex`.
  - `projects/{backend,frontend}/:id` → `ProjectDetail`.
  - `accessibility` → `AccessibilityStatement`.
  - `404` and `**` → `NotFound`.
- **Server routes:** new static pages are Prerender. `about` / `contacts` are Server, so they answer with a real HTTP redirect. The wildcard stays last.
- **Route data** `header: 'back'`, `backLink`, `backLabel` tells the shell which header to render.

### Shell
- `MainLayoutComponent` keeps the skip link, the one `<main id="content">` and the footer. It renders `app-site-header` (logo + back link) on routes whose data says `'back'`.
- The homepage has no top bar; its identity lives in the sticky left column.

### Shared components (`shared/components/`)
- **`section-heading`:** mono number + projected heading.
- **`tag`:** accent-tint pill, text only.
- **`status-dot`:** dot + word, never colour alone.
- **`callout`:** outlined panel with icon slot, title and body.
- **`copy-button`:** clipboard, browser only; announces "Copied" through `aria-live="polite"`.
- **`filter-chip`:** `aria-pressed`, ≥24px target.
- **`segmented-control`:** `aria-pressed` segments with counts.
- **`project-card`:** `<article>` with cover band, meta, tags, status and a "Case study →" link. Hover lift only without reduced motion.
- **`app-button`:** restore the focus outline; add `variant="icon"`, `size`, `routerLink` + `fragment`.
- **`app-icon`:** unchanged, used at 16–20px with `tone="current"`.

### Pages
- **`features/home/`:**
  - `home` (two-column grid from ~1024px) and `home-intro` (the page's single `h1`);
  - `section-nav` with a `SectionSpy` service + `appSpySection` directive: one `IntersectionObserver` created in `afterNextRender`, so it never runs during SSR, with `aria-current="location"` on the active link;
  - the sections `about`, `experience`, `work`, `method` and `contact`;
  - `contact-form`, extracted from `Contacts`: name / email / message, `aria-invalid` + `aria-describedby`, live status.
  - Below-the-fold media and the form use `@defer (… ; hydrate on …)`.
- **`features/projects/projects-index/`:**
  - inputs `stack` (route data) plus the query params `tech`, `q` and `sort`, feeding `criteria` → `results` computeds;
  - UI writes back with `router.navigate([], { queryParams, queryParamsHandling: 'merge', replaceUrl: true })`;
  - live "Showing X of Y", and an empty state with "Clear filters".
- **`features/projects/project-detail/`:** renamed from `projects-component`. Keeps the `id` input, the 404 redirect and the SEO `effect()`; the layout is new.
- **`features/accessibility/`:** WCAG 2.2 AA target, what was tested, known limitations.

### SEO
- Homepage and `/projects` `seo.update` copy rewritten for backend.
- `index.html`: `Person` JSON-LD `jobTitle` / `knowsAbout` and default meta rewritten for backend.
- Keep `SITE_ORIGIN`, JSON-LD and `public/sitemap.xml` in sync.

---

## Phases

### Phase 0 — `chore/redesign-setup`: sync and planning docs
- [x] **0.1** Sync the local working copy with `origin/main` (CLAUDE.md line, stray screenshot); untrack and ignore `.playwright-mcp/`.
- [x] **0.2** Add this file.
- [x] **0.3** Reference it from `CLAUDE.md` and `GUIDELINES.md` → Next steps.
- *Done when:* `npm test` + `npm run build` pass.

### Phase 1 — `feat/design-tokens`: design-system foundation
- [x] **1.1** Self-host Space Grotesk (variable) + JetBrains Mono woff2 in `public/fonts/`; `@font-face` in `styles.css`; preload in `src/index.html`.
- [x] **1.2** New `:root` tokens (see Architecture). Alias every old variable (`--bg-accent-primary`, `--text-accent-primary`, `--bg-background-*`, …) to a new one, so current pages keep rendering.
- [x] **1.3** Base typography + `.eyebrow`, `.dot-grid`, `scroll-padding-top`. Remove the global `p, span, li` colour rule and Poppins.
- [x] **1.4** `app-button`: restore the focus outline; add `variant="icon"`, `size`, `routerLink` + `fragment`. Update `button.spec.ts`.
- [x] **1.5** `TECH_BRAND` + `techBrand()` in `techMeta.ts`, with a spec asserting ≥4.5:1 for every pair.
- *Done when:* existing pages render with the new fonts and no broken colours (screenshot); tests and build are green.

### Phase 2 — `feat/project-data`: content model, backend-first data
- [x] **2.1** Add `featured`, `order`, `runs_locally`, `no_demo_reason`, `related` to `projectsSchema.ts` **and** `shared/types/projects.ts`.
- [x] **2.2** Add Performonitoring — API and — Dashboard (field table in GUIDELINES) with cross-`related` links. Add a `socketdotio` icon + `TECH_ICONS` / `TECH_LABELS` entry if it's shown.
- [x] **2.3** Remove Dev Dashboard. Set `featured` / `order` on Bookgraph, Performonitoring API and Zenith. Expand Bookgraph's `summary` / `highlights`.
- [x] **2.4** Update `public/sitemap.xml` for 2.2–2.3.
- [x] **2.5** `profile.model.ts` + `profileSchema.ts` with the backend copy drafts. Add a placeholder spec (no `[` left), skipped with a TODO until Elia fills the values.
- [ ] **2.6** `ProjectService`:
  - add `filterProjects`, `demoStatus`, `featuredProjects`, `allTechnologies`, `countsByStack`, with backend-first as the default sort;
  - keep `selectedStack` / `activeTags` until Phase 5;
  - specs cover stack × tech × q × sort, counts, and "every backend before any frontend".
- *Done when:* the model spec (icons, unique ids) and the service specs pass.

### Phase 3 — `feat/shell`: header, footer, router features, accessibility page
- [ ] **3.1** `shared/components/site-header` (logo + back link) + `data.header` / `backLink` / `backLabel` on the project routes.
- [ ] **3.2** `MainLayoutComponent`: `site-header` on `'back'` routes; the old navbar stays everywhere else for now.
- [ ] **3.3** Footer colophon: "Built with Angular 21 · SSR · Accessibility statement", plus the why-Angular clause.
- [ ] **3.4** `/accessibility` page + SEO + Prerender server route + sitemap entry.
- [ ] **3.5** `app.config.ts`: `withInMemoryScrolling`, `withViewTransitions` (skipped under reduced motion), `withIncrementalHydration()`.
- *Done when:* the build prerenders `/accessibility`, and a router-harness spec shows the right back link on `/projects/*`.

### Phase 4 — `feat/shared-ui`: presentational components, one spec each
- [ ] **4.1** `section-heading`
- [ ] **4.2** `tag`
- [ ] **4.3** `status-dot`
- [ ] **4.4** `callout`
- [ ] **4.5** `copy-button` (browser-only clipboard, `aria-live`)
- [ ] **4.6** `filter-chip` (`aria-pressed`, ≥24px)
- [ ] **4.7** `segmented-control`
- [ ] **4.8** `project-card` (cover band, status, "Case study →", reduced-motion lift)
- *Done when:* each spec covers the component's a11y attributes; tests and build are green.

### Phase 5 — `feat/projects-index`
- [ ] **5.1** `ProjectsIndex`: route-data + query-param inputs, `criteria` / `results` computeds, URL write-back.
- [ ] **5.2** Filter panel: search, segmented control (All / Backend / Frontend), technology chips, sort select, "Showing X of Y" live region, empty state.
- [ ] **5.3** Point `projects`, `projects/backend` and `projects/frontend` at `ProjectsIndex`. SEO `effect()`; the canonical ignores query params.
- [ ] **5.4** Delete `projects-layout`, `projects-grid` and the service's `selectedStack` / `activeTags`.
- *Done when:*
  - `/projects` lists the 3 backend projects first;
  - `?tech=nestjs` filters and survives a reload;
  - the prerendered HTML contains the cards;
  - there's a router-harness spec for the query params.

### Phase 6 — `feat/project-detail`
- [ ] **6.1** Rename `projects-component` → `project-detail` (routes, spec).
- [ ] **6.2** New layout: header block, framed screenshot, no-demo callout, summary / highlights, sticky aside (STACK, GitHub, demo, related link).
- *Done when:* Performonitoring API shows the callout and "See the dashboard →"; an unknown id still 404s; SSR `<title>` and canonical are correct.

### Phase 7 — `feat/homepage`: backend positioning
- [ ] **7.1** `Home` two-column shell + `home-intro`: eyebrow, H1, lede, availability, CV + icon links, dot grid.
- [ ] **7.2** `SectionSpy` + `appSpySection` + `section-nav` (desktop list, mobile pill strip, `aria-current`).
- [ ] **7.3** About section: NestJS copy, `@Module()` highlight, why-Angular sentence; `NgOptimizedImage` portrait with `priority`, `<figure>` / `<figcaption>`.
- [ ] **7.4** Experience section from `profile.model`.
- [ ] **7.5** Work section: featured rows backend-first; `@defer (on viewport; hydrate on viewport)` screenshot; "Explore all 10 projects →".
- [ ] **7.6** Method section: the four backend principles.
- [ ] **7.7** Extract `contact-form` (name / email / message, `formSchema.ts`, `aria-invalid` / `aria-describedby`, live status). Contact section with `copy-button` + form under `@defer (hydrate on interaction)`.
- [ ] **7.8** Redirect `/about` and `/contacts`; switch their server routes to Server; remove them from the sitemap.
- [ ] **7.9** Delete `navbar`, `features/about/` and `contacts`; `MainLayout` drops the navbar branch.
- [ ] **7.10** SEO: homepage `seo.update`, JSON-LD and default meta for backend.
- *Done when:*
  - `curl -I /about` gives a 30x to `/#about`;
  - scroll-spy works;
  - form errors are announced;
  - there's one `h1`;
  - the 1440px and 375px screenshots match the PDF layout.

### Phase 8 — `chore/redesign-cleanup`
- [ ] **8.1** Delete the dead code: `tooltip` + `TooltipDirective`, and `card` / `card-grid` if unused (grep first). Remove the token alias layer from 1.2.
- [ ] **8.2** Contrast + keyboard audit (cover bands, tags, muted text, focus rings); fix the findings.
- [ ] **8.3** Playwright MCP pass at 1440 / 375 plus reduced-motion emulation; attach screenshots to the PR.
- [ ] **8.4** Rewrite CLAUDE.md's architecture sections; mark this plan complete.
- *Optional follow-up:* `@axe-core/playwright` e2e over every route.

---

## Accessibility bar (applies to every phase)

- One `h1` per page, no skipped heading levels.
- 4.5:1 for text, 3:1 for icons, borders and focus rings.
- Visible focus on everything; the header never covers a focused element.
- Targets ≥24px, ideally 44px.
- `aria-pressed` on toggles; `aria-invalid` + `aria-describedby` on form errors; status never shown by colour alone.
- Every animation has a `prefers-reduced-motion` fallback; no hover-only content.

## Verification (end of each phase, fully at Phase 8)

- `npm test`, `npm run build`.
- Prerendered HTML in `dist/portfolio_elia/browser/` contains real content.
- `npm run serve:ssr:portfolio_elia`, then check:
  - redirects (`/about`, `/contacts`) → 30x;
  - an unknown URL → 404;
  - project detail → 200 with the right `<title>` / canonical.
- Playwright MCP:
  - screenshots at 1440 / 375 against `Design.pdf`;
  - keyboard walk;
  - scroll-spy;
  - "Copied" announcement;
  - reduced motion;
  - no hydration warnings.
