# Elia Giolli — Front-end Developer Portfolio

> Personal portfolio built with **Angular 21**, SSR, Signals and Zod runtime validation.

![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?style=flat-square&logo=zod&logoColor=white)
![SSR](https://img.shields.io/badge/SSR-Express%205-000000?style=flat-square&logo=express&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-42%20passing-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Live:** [portfolio-elia-angular.vercel.app](https://portfolio-elia-angular.vercel.app)

---

## What it is

A portfolio presenting 9 real projects across React, Next.js, Astro, Angular, Node.js, Express, NestJS, MongoDB and PostgreSQL — filterable by stack and technology, server-rendered, and accessible.

Built to be read by both recruiters and engineers, so the interesting parts are the engineering decisions rather than the layout.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Angular 21, standalone components |
| Reactivity | Signals + `computed` — **no RxJS for state** |
| Validation | Zod 4 (runtime) |
| SSR | `@angular/ssr` + Express 5 |
| Testing | Vitest via `@angular/build:unit-test` |
| Hosting | Vercel |

## Features

- **Filterable project explorer** — stack + technology chips combine; filter state lives in `ProjectService` as Signals, so views update without subscriptions.
- **Hybrid rendering** — 6 static routes prerendered at build time; `:id` detail routes and error routes server-rendered per request, then hydrated with event replay.
- **Real HTTP 404s** — `NotFound` flags the render via `REQUEST_CONTEXT` and Express re-wraps the response with a `404`. No soft 404s for crawlers to index.
- **Runtime validation** — every project entry is parsed by a Zod schema at startup. On failure the service logs and falls back to an empty list instead of crashing.
- **Per-page SEO** — `SeoService` sets title, description, OG/Twitter tags and a find-or-create canonical link on every route. Origin lives in one place (`core/seo.config.ts`).
- **Accessibility** — semantic elements, a single `<main>` landmark provided by the layout, a skip link, real `<ul>`/`<li>` grids, named `<section>` regions, and decorative icons kept out of the a11y tree.

## Routes

```
/                         Homepage
/about                    Bio, skills, methodology
/projects                 Category chooser
/projects/frontend        Filterable frontend grid
/projects/backend         Filterable backend grid
/projects/:stack/:id      Project detail
/contacts                 Contact form
/404, /**                 Not Found (real 404 status)
```

Every route nests under `MainLayoutComponent`, so navbar and footer are always present — error pages included. All page routes are lazy-loaded.

The CV is a **static PDF** (`public/Elia_Giolli_CV_Angular_Developer.pdf`) linked from the homepage, not a route. `/cv` intentionally 404s.

## Architecture

```
projects.model.ts  →  Zod (ProjectsSchema)  →  ProjectService
                                                 ├─ _projects      signal (validated, private)
                                                 ├─ selectedStack  signal (from route data)
                                                 ├─ activeTags     signal (filter chips)
                                                 └─ filteredProjects  computed
                                                        ↓
                                        ProjectsGrid · ProjectsComponent (read only)
```

Single direction: static data → validated state → computed views → presentational components. No shared mutable state, no subscriptions.

## Shared components

| Component | Notes |
|---|---|
| `app-button` | Renders `<button>`, or `<a>` when `href` is set. `download` turns it into a file download and drops `target="_blank"`. |
| `app-card` | Named projection slots: `card-header`, `card-body`, `card-footer`. Icons decorative by default. |
| `app-card-grid` | Renders a `<ul>` — callers project `<li>`. Tuned per call site via `minColumnWidth` / `gap`. |
| `app-about-section` | Labelled `<section>` with auto `aria-labelledby`; anchorable (`/about#skills`). |
| `app-icon` | Loads SVGs from `assets/icons/`. Set `decorative` for purely visual icons. |

## Project structure

```
public/            # served at site root: favicon, logo, CV pdf, robots.txt, sitemap.xml
src/
├── server.ts      # Express SSR entry (404 status handling)
└── app/
    ├── app.routes.ts / app.routes.server.ts   # routes + per-route render mode
    ├── core/      # models, Zod schemas, services (ProjectService, SeoService), directives
    ├── shared/    # button, card, card-grid, icon, navbar, footer, tooltip + types
    └── features/  # homepage, main-layout, projects/, about/, not-found
```

## Getting started

```bash
npm install
npm run start                      # dev server → http://localhost:4200
npm run build                      # → dist/portfolio_elia/
npm run serve:ssr:portfolio_elia   # built SSR server → http://localhost:4000
npm test                           # Vitest
```

Requires Node 20+.

> `angular.json` declares `security.allowedHosts` (production domain + `localhost`). A host not on that list is refused SSR and silently downgraded to client-side rendering — add new deploy domains there, or pass `NG_ALLOWED_HOSTS` at runtime for preview URLs.

## Design decisions

**Signals over RxJS.** Every reactive value here — filters, project list, form flags — changes synchronously in response to a user action. Signals cover that with no observable chains or `async` pipes.

**Zod on a static array.** TypeScript disappears at runtime. A malformed entry fails loudly at startup instead of rendering a broken card, and the schema is already in place if the data ever moves to an API.

**Route data as a component input.** `ProjectsGrid` serves both `/projects/frontend` and `/projects/backend`; `withComponentInputBinding()` delivers `data.stack` as a typed `input()` instead of injecting `ActivatedRoute`.

**Server route order is load-bearing.** `@angular/ssr` matches in declaration order, so specific entries must precede `**`. A wildcard listed first silently swallows the routes below it.

**One `<main>`, owned by the layout.** `MainLayoutComponent` provides it; routed pages must not declare their own, or the page ships nested `main` landmarks.

---

Built with Angular 21 · TypeScript · Zod · SSR · Signals
