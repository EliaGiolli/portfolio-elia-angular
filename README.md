# Elia Giolli — Front-end Developer Portfolio

> A production-grade personal portfolio built with **Angular 21**, **Server-Side Rendering**, **Angular Signals**, and **Zod runtime validation** — designed to showcase full-stack projects with a clean, accessible, and performant UI.

![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?style=flat-square&logo=zod&logoColor=white)
![SSR](https://img.shields.io/badge/SSR-Express%205-000000?style=flat-square&logo=express&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-20%20passing-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Claude Code](https://img.shields.io/badge/AI--assisted-Claude%20Code-D97757?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Live:** [portfolio-elia-angular.vercel.app](https://portfolio-elia-angular.vercel.app)

---

## 📌 What this portfolio does

This portfolio solves a real developer problem: how do you present **9 real-world projects** spanning React, Next.js, Astro, Angular, Node.js, Express, NestJS, MongoDB, and PostgreSQL — in a way that is fast, filterable, accessible to screen readers, and impressive to both recruiters and senior engineers?

The answer is a fully SSR-enabled Angular 21 application where:

- Every project entry is **validated at runtime with Zod** so the app never fails silently on malformed data
- Visitors can **filter projects by framework or technology** with instant, reactive feedback — no page reload
- Static pages are **prerendered at build time**; dynamic and error routes are **server-rendered per request**, then hydrated on the client with event replay so no click is lost
- Every routed page sets its own **title, meta description, Open Graph / Twitter tags and canonical URL** through a shared `SeoService`
- Unknown URLs return a **real HTTP 404** — not a soft 404 (a 200 response showing an error page)
- A full **About page**, a **CV page**, a **contact form** with validation, and a **project detail view** are all presented in one cohesive, lazy-loaded app
- The entire UI is built on a **custom reusable component library** (`app-button`, `app-card`, `app-card-grid`, `app-icon`, `app-about-section`) with accessibility baked in

---

## 🛠️ Tech stack at a glance

| Layer | Technology | Version |
|---|---|---|
| Framework | Angular (standalone components) | 21.2.0 |
| Language | TypeScript (strict mode) | 5.9.2 |
| Reactivity | Angular Signals + `computed` | built-in |
| Runtime validation | Zod | 4.x |
| SSR | `@angular/ssr` + Express | 21.2.7 / 5.x |
| Styling | CSS custom properties, Poppins | — |
| Routing | Angular Router with lazy loading | built-in |
| Forms | Angular Reactive Forms | built-in |
| Testing | Vitest (via `@angular/build:unit-test`) | 4.x |
| Hosting | Vercel | — |
| AI tooling | Claude Code + `CLAUDE.md` + `angular-developer` skill | — |

> **No RxJS for state management.** Signals and `computed` cover every reactive need in this app — simpler, more predictable, and easier to follow.

---

## ✨ Key features

### 🔍 Filterable project explorer
Browse projects split by category — **Frontend** and **Backend** — with one-click technology filter chips (React, Angular, Next.js, Astro, Node.js, Express, NestJS, PostgreSQL, MongoDB, etc.). Filters combine: selecting a stack and a technology tag shows only matching projects. The filter state lives in `ProjectService` as a set of Signals, so every dependent view updates synchronously without subscriptions or manual change detection.

### ⚡ Hybrid rendering: prerender + per-request SSR
Render mode is declared **per route** in `app.routes.server.ts`:

| Route | Mode | Why |
|---|---|---|
| `/`, `/about`, `/projects`, `/projects/frontend`, `/projects/backend`, `/cv`, `/contacts` | `Prerender` | Static content — emitted as HTML at build time for the fastest possible first paint |
| `/projects/:stack/:id` | `Server` | Dynamic parameter; avoids having to enumerate IDs with `getPrerenderParams` |
| `/404`, `**` | `Server` | Must render live so the Express layer can attach a real 404 status |

`provideClientHydration(withEventReplay())` ensures that any user interaction during the SSR-to-client transition is not lost — clicks and keystrokes are replayed after hydration.

> **Ordering matters:** `@angular/ssr` matches these entries **in declaration order**, so every specific rule must precede the `**` wildcard. A wildcard listed first silently swallows the routes below it.

### 🚦 Real HTTP 404s, not soft 404s
A "soft 404" — returning `200 OK` with an error page — tells crawlers the page exists and gets the error page indexed. This app returns a genuine `404`.

The `NotFound` component flags the current render, and the Express layer re-wraps the response:

```ts
// not-found.ts
private requestContext = inject<SsrRequestContext | null>(REQUEST_CONTEXT, { optional: true });
constructor() {
  if (this.requestContext) this.requestContext.notFound = true;
}
```

```ts
// server.ts
const context: { notFound?: boolean } = {};
const response = await angularApp.handle(req, context);

return writeResponseToNodeResponse(
  context.notFound && response.status === 200
    ? new Response(response.body, { status: 404, statusText: 'Not Found', headers: response.headers })
    : response,
  res,
);
```

`REQUEST_CONTEXT` is a first-party Angular token from `@angular/core`, and `AngularNodeAppEngine.handle()` accepts the context object as its second argument — no framework internals are touched.

Verified against a production build and the real Express server:

```
/                        200        /no-such-page            404
/about                   200        /404                     404
/projects/frontend/1     200        /projects/frontend/999   404
```

### ✅ Runtime data validation (Zod)
Project data is a static TypeScript array — TypeScript validates it at compile time. But `ProjectService` also runs **every entry through a Zod schema at startup**, catching shape mismatches, missing fields, or invalid URLs before they can surface as cryptic runtime errors, and falling back to an empty list rather than crashing if validation fails. The contact form is backed by its own Zod schema (`FormSchema`) mirroring the Reactive Forms validators. This also future-proofs a migration to an external API with zero changes to the validation layer.

### 🏷️ Per-page SEO via a shared service
`SeoService` centralises everything a page needs in order to be shared and indexed correctly:

- `<title>` and `<meta name="description">`
- `og:title`, `og:description`, `og:type`, `og:site_name`, `og:url`, `og:image`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- `<link rel="canonical">` — managed **find-or-create**, so navigating between routes replaces the tag instead of stacking duplicates

```ts
this.seo.update({
  title: 'About | Elia Giolli — Angular Front-End Developer',
  description: 'Angular developer with an IT support background…',
  path: '/about'          // drives canonical + og:url
});
```

Every routed page calls it. Two components (`ProjectsGrid`, `ProjectsComponent`) serve more than one URL from a single class, so they call `seo.update` inside an `effect()` reading their route input — the metadata follows the route instead of being set once at construction.

The absolute origin lives in exactly one place, `core/seo.config.ts`. A static **`Person` JSON-LD** block in `index.html` gives search engines structured identity data, and `public/sitemap.xml` + `public/robots.txt` complete the crawl story.

### 🧩 Reusable component library
Foundational shared components underpin every page:

- **`app-button`** — renders a native `<button>` for actions, an `<a>` for external links, or wires up `routerLink` for internal navigation — applying the correct semantic element automatically based on the inputs provided.
- **`app-card`** — a composable layout container with named content projection slots (`card-header`, `card-body`, `card-footer`) and hover animations. Every project card, skill card, and CV section is built with it.
- **`app-card-grid`** — a responsive `<ul>` grid. Layout is tuned per call site through `minColumnWidth` and `gap` inputs forwarded to CSS custom properties on the host, so a single component serves both the About skills grid (260px tracks) and the projects grid (300px tracks) without either page re-declaring grid rules.
- **`app-about-section`** — a labelled `<section>` primitive (heading + optional eyebrow, auto-generated `aria-labelledby`) used to structure the About page into anchorable sections (e.g. `/about#skills`).
- **`app-icon`** — loads local SVGs from `src/assets/icons/` by name. Supports a `decorative` flag (`alt=""` + `aria-hidden="true"`) for icons that are purely visual, and accepts custom `alt` text when context is needed.

### 🏷️ Dynamic tooltips via Angular directive
Technology icons across the homepage and project grid display a floating tooltip on hover. This is implemented via `TooltipDirective` — an Angular directive that **dynamically creates a `TechTooltip` component** into the DOM on `mouseenter` and destroys it on `mouseleave`, demonstrating programmatic component instantiation without `ngIf` or wrapper elements.

### 📬 Contact form with reactive validation
The contacts page uses **Angular Reactive Forms** with synchronous validators (min length, email format, required). Validation messages appear field-by-field on blur. On submit, the form runs a validation pass, shows inline errors if invalid, or triggers a simulated async submission with a loading state (`isSubmitting` signal) and a success confirmation screen (`isSubmitted` signal).

### ♿ Accessibility first
- Semantic HTML throughout: `<article>`, `<header>`, `<footer>`, `<nav>`, `<main>`
- Both card grids are true `<ul>` / `<li>` lists, so screen readers announce item counts
- Native `<button>` and `<a>` elements preserve keyboard focus and screen-reader role semantics automatically
- ARIA labels on icon-only controls and non-obvious interactive elements (`aria-label`, `aria-expanded`, `aria-controls`)
- Decorative icons are hidden from assistive technology via `aria-hidden="true"` and `alt=""`
- `app-card` accepts an optional `label` input applied as `aria-label` on the `<article>` container
- Mobile navigation toggle announces state with `aria-expanded` and `aria-controls`
- **Colour contrast is measured, not eyeballed** — see the engineering notes below

---

## 🗺️ Application routes

```
/                         → Homepage (hero section, tech stack, CTA buttons)
/about                    → About page (bio, skills grid, methodology, GitHub CTA)
/projects                 → Project category chooser (Frontend / Backend cards)
/projects/frontend        → Filterable grid of frontend projects
/projects/backend         → Filterable grid of backend projects
/projects/frontend/:id    → Full detail view for a specific frontend project
/projects/backend/:id     → Full detail view for a specific backend project
/cv                       → Curriculum Vitae (education, skills, certifications)
/contacts                 → Contact form
/404                      → Explicit 404 target (used when a project :id doesn't exist)
/**                       → 404 Not Found
```

- **Every** route is nested under `MainLayoutComponent` — including the homepage *and* the `**` wildcard — so the navbar and footer are always present, error pages included
- Routes for `ProjectsGrid` are reused — the same component handles both frontend and backend lists; **route `data.stack`** is injected as a component input via `withComponentInputBinding()`, telling it which category to display
- Every route except `/cv` is **lazy-loaded** (`loadComponent`) to keep the initial bundle minimal

---

## 🏗️ Architecture & data flow

```
Static data (projects.model.ts)
        │
        ▼
  Zod validation (ProjectsSchema)        ← catches shape errors at startup
        │
        ▼
  ProjectService (Signal-based)
  ┌─────────────────────────────┐
  │  _projects   (signal)       │  ← validated canonical source of truth
  │  selectedStack (signal)     │  ← set by ProjectsGrid from route data
  │  activeTags  (signal)       │  ← toggled by filter chips
  │  filteredProjects (computed)│  ← recomputes on any signal change
  └─────────────────────────────┘
        │
        ▼
  Route components consume filteredProjects()
  ProjectsGrid → renders app-card-grid of app-card
  ProjectsComponent → renders single project detail
```

This is a **single-direction data flow**: static data → validated state → reactive computed views → presentational components. No shared mutable state, no event buses, no subscriptions to manage.

---

## 📁 Project structure

```
portfolio/
├── CLAUDE.md                          # Working agreement for AI assistants (see below)
├── .agents/skills/angular-developer/  # Angular's official skill (SKILL.md + 40 references)
├── vitest.config.ts                   # Test runner tuning (serial execution)
├── public/                            # Served at the site root
│   ├── favicon.ico
│   ├── logo.svg
│   ├── robots.txt                     # Crawl rules + sitemap pointer
│   └── sitemap.xml                    # All 16 public URLs
│
└── src/
    ├── index.html                     # Base meta tags + Person JSON-LD
    ├── server.ts                      # Express SSR entry (404 status handling)
    │
    └── app/
        ├── app.routes.ts              # All routes (lazy-loaded)
        ├── app.routes.server.ts       # Render mode per route
        ├── app.config.ts              # App providers (router, SSR hydration)
        ├── app.config.server.ts       # Server-only providers
        │
        ├── core/
        │   ├── seo.config.ts          # SITE_ORIGIN + absoluteUrl() helper
        │   ├── models/
        │   │   └── projects.model.ts  # Static project entries (source of truth)
        │   ├── schemas/
        │   │   ├── projectsSchema.ts  # Zod schema for project validation
        │   │   └── formSchema.ts      # Zod schema for contact form
        │   ├── services/
        │   │   ├── project-service.service.ts  # Signal store + filter logic
        │   │   └── seo.service.ts     # Title/meta/OG/canonical per routed page
        │   └── directives/
        │       └── tooltip.directive.ts  # Dynamic tooltip on hover
        │
        ├── shared/
        │   ├── components/
        │   │   ├── button/            # app-button (action / link / router)
        │   │   ├── card/              # app-card (content container)
        │   │   ├── card-grid/         # app-card-grid (configurable responsive grid)
        │   │   ├── icon/              # app-icon (SVG loader)
        │   │   ├── navbar/            # Responsive navigation header
        │   │   ├── footer/            # Footer with social links
        │   │   └── tooltip/           # Tech tooltip overlay
        │   └── types/
        │       ├── projects.ts        # TechStack enum + ProjectsTypes interface
        │       └── customComponentsTypes.ts  # ButtonVariant type
        │
        └── features/
            ├── homepage/              # Hero landing page
            ├── main-layout/           # Navbar + footer wrapper (wraps every route)
            ├── projects/
            │   ├── projects-layout/   # Category chooser (Frontend / Backend)
            │   ├── projects-grid/     # Filterable project cards
            │   └── projects-component/  # Single project detail view
            ├── cv/                    # CV / résumé page
            ├── about/
            │   ├── about-me/          # /about page (bio, skills, methodology, CTA)
            │   ├── about-section/     # app-about-section (labelled section primitive)
            │   └── contacts/          # Contact form
            └── not-found/             # 404 page (+ SSR status flag)
```

---

## 🧩 Shared components reference

### `app-button`
```html
<!-- Renders a native <button> -->
<app-button variant="primary" (click)="doSomething()">Click me</app-button>

<!-- Renders an <a> tag opening in a new tab -->
<app-button variant="secondary" href="https://github.com/...">View on GitHub</app-button>

<!-- Router navigation -->
<app-button variant="ghost" routerLink="/projects">Browse projects</app-button>
```
**Inputs:** `variant` (`primary` | `secondary` | `ghost`), `type`, `disabled`, `href`

---

### `app-card`
```html
<app-card icon="monitor" label="NexCoin project">
  <h2 card-header>NexCoin</h2>
  <div card-body>
    <p>A cryptocurrency dashboard...</p>
  </div>
  <div card-footer>
    <app-button variant="primary">View Details</app-button>
  </div>
</app-card>
```
**Inputs:** `icon` (icon name from `assets/icons/`), `iconSize` (default `56`), `label` (applied as `aria-label`), `iconDecorative` (default `true`)

---

### `app-card-grid`
```html
<!-- Default: 260px minimum track, --space-4 gap -->
<app-card-grid>
  <li><app-card icon="angular" label="Angular skills">…</app-card></li>
  <li><app-card icon="database" label="Database skills">…</app-card></li>
</app-card-grid>

<!-- Tuned per call site -->
<app-card-grid minColumnWidth="300px" gap="var(--space-5)">
  @for (project of projectService.filteredProjects(); track project.id) {
    <li><app-card …>…</app-card></li>
  }
</app-card-grid>
```
**Inputs:** `minColumnWidth` (default `260px`), `gap` (default `var(--space-4)`)

Renders a `<ul class="card-grid">` and expects **`<li>` children** — the caller owns the list items, which keeps the markup valid and the component free of assumptions about its contents. Both inputs are forwarded to CSS custom properties on the host, so no consuming stylesheet needs to redeclare grid rules.

---

### `app-about-section`
```html
<app-about-section id="skills" title="Technical Skills" eyebrow="What I bring">
  <app-card-grid>…</app-card-grid>
</app-about-section>
```
**Inputs:** `id` (required, also usable as an anchor, e.g. `/about#skills`), `title` (required), `eyebrow` (optional). Renders a `<section>` with an auto-generated `aria-labelledby` heading.

---

### `app-icon`
```html
<!-- Standard icon with auto-generated alt text -->
<app-icon name="angular" [size]="48" />

<!-- Decorative icon — hidden from assistive technology -->
<app-icon name="arrow-left" [size]="24" [decorative]="true" />

<!-- Custom alt text -->
<app-icon name="github" [size]="32" alt="View source on GitHub" />
```
**Inputs:** `name` (required), `size` (default `24`), `decorative` (default `false`), `alt`

---

## ⚙️ `ProjectService` internals

```typescript
@Injectable({ providedIn: 'root' })
export class ProjectService {
  // Private validated signal — the single source of truth
  private readonly _projects = signal<ProjectsTypes[]>(this.validateProjects(projects));
  projects = this._projects.asReadonly();

  // Filter state
  selectedStack = signal<TechStack | null>(null);
  activeTags    = signal<string[]>([]);

  private validateProjects(data: any[]): ProjectsTypes[] {
    try {
      return z.array(ProjectsSchema).parse(data);
    } catch (error) {
      console.error('Errore validazione progetti:', error);
      return [];
    }
  }

  // Derived view — recomputes whenever any upstream signal changes
  filteredProjects = computed(() => {
    let list = this._projects();
    const stack = this.selectedStack();
    const tags  = this.activeTags().map(t => t.toLowerCase());

    if (stack)        list = list.filter(p => p.tech_stack === stack);
    if (tags.length)  list = list.filter(p =>
      p.technologies.some(tech => tags.includes(tech.toLowerCase()))
    );
    return list;
  });

  toggleTag(tag: string) {
    this.activeTags.update(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }
}
```

Components never write to `_projects`. They read `filteredProjects()` in templates — the `computed` ensures efficient, synchronous updates with no manual subscriptions. If Zod validation fails at startup, the service logs the error and falls back to an empty project list instead of crashing the app.

---

## 🖼️ Projects showcased

| # | Project | Category | Stack |
|---|---------|----------|-------|
| 1 | **NexCoin** | Frontend | Next.js 15, TypeScript, TailwindCSS, Node.js, PostgreSQL, CoinGecko API |
| 2 | **Imperi e Rivoluzioni** (blog) | Frontend | Astro, TypeScript, TailwindCSS |
| 3 | **Dev Dashboard** | Backend | Node.js, Express, TypeScript |
| 4 | **ShelfSpot** (Angular) | Frontend | Angular, TypeScript, TailwindCSS, OpenLibrary API |
| 5 | **ClockWise** | Frontend | React, TypeScript, TailwindCSS |
| 6 | **Authentication Task Management** | Backend | Node.js, Express, TypeScript, MongoDB, JWT |
| 7 | **Bookgraph** (NestJS) | Backend | NestJS, TypeScript, PostgreSQL, JWT |
| 8 | **Zenith Dashboard** | Frontend | Angular, TypeScript, TailwindCSS |
| 9 | **VeggieVibes** | Frontend | React, TypeScript, TailwindCSS, Spoonacular API |

---

## 🚀 Getting started

### Prerequisites
- Node.js 20+
- npm 11+

### Run locally (development)

```bash
git clone https://github.com/EliaGiolli/portfolio-elia-angular
cd portfolio-elia-angular
npm install
npm run start
```

Open `http://localhost:4200` in your browser.

### Build for production

```bash
npm run build
```

Output goes to `dist/portfolio_elia/`. The build produces a browser bundle, an SSR server bundle, and prerendered HTML for the 7 static routes.

### Run the SSR server

```bash
npm run serve:ssr:portfolio_elia
```

Starts the Express server on `http://localhost:4000`, serving server-rendered HTML and handling client hydration.

> **Hostname allow-list:** `angular.json` declares `security.allowedHosts` (the production domain plus `localhost`). Any host not on that list is refused SSR and silently downgraded to client-side rendering — so a new deploy domain must be added there, or supplied at runtime via the `NG_ALLOWED_HOSTS` environment variable (useful for Vercel preview URLs, which get a fresh hostname per deployment).

### Run tests

```bash
npm test                                              # full suite
npx ng test --include src/app/shared/components/card/card.spec.ts   # single file
npx ng test --filter "CardComponent"                  # match by suite/test name
npx ng test --watch                                   # force watch mode
```

Runs the Angular CLI unit-test builder on top of **Vitest** (jsdom environment).

---

## 🧪 Design decisions worth noting

**Why Signals instead of RxJS?**
Every reactive need in this app — filter state, project list, form submission flags — is a synchronous value that changes in direct response to user actions. Signals handle this with zero boilerplate: read a signal in a template and Angular tracks the dependency automatically. RxJS would add observable chains and `async` pipes for no benefit here.

**Why Zod for a static array?**
TypeScript's type checking disappears at runtime. If a project entry is missing `tech_stack`, the Zod parse fails loudly at startup rather than silently rendering a broken card. More importantly, the `ProjectsSchema` is already in place if the data source ever changes to an external API — no new validation code needed.

**Why does the homepage share the main layout?**
Every route — including `/` and the 404 — renders inside `MainLayoutComponent`, so the navbar and footer are always present. A consistent navigation bar on the very first screen a visitor sees makes it a one-click path into About, Projects, CV, or Contacts. Keeping the 404 inside the layout matters just as much: a visitor who hits a dead link still has a way out.

**Why `withComponentInputBinding()`?**
`ProjectsGrid` is reused for both `/projects/frontend` and `/projects/backend`. Rather than injecting `ActivatedRoute` and subscribing to `route.data`, `withComponentInputBinding()` allows the route's `data.stack` value to be received as a typed component `input()` directly — cleaner, testable, and zero boilerplate.

**Why a dedicated `SeoService`?**
Every routed page needs a distinct `<title>`, description, canonical URL and social card for SEO and sharing. Centralising `Title` / `Meta` / `<link rel="canonical">` behind one `update()` call keeps that logic out of every feature component — and meant that adding Open Graph, Twitter tags and canonical URLs later was a change to **one file**, not fourteen.

**Why configure `app-card-grid` with CSS custom properties instead of classes?**
The grid needed different track widths on two pages. Passing `minColumnWidth` / `gap` as inputs that land on host custom properties keeps all layout knowledge inside the component — consumers state intent (`300px`), not implementation (`grid-template-columns: repeat(auto-fit, …)`). The alternative, letting each page write its own grid CSS, is what produced the duplication this replaced.

---

## 🔧 Engineering notes: correctness pass

A focused hardening pass covering SSR correctness, SEO, accessibility and the test suite. These are the kinds of defects that never show up in a screenshot — worth reading if you care about how the app behaves in production rather than how it looks.

### SSR was silently degraded to client-side rendering

`angular.json` shipped with `security.allowedHosts: []`. That empty array does **not** mean "allow everything" — it means no hostname passes the SSRF check, so `@angular/ssr` refused every request and fell back to CSR:

```
ERROR: Bad Request ("http://localhost:4000/about").
URL with hostname "localhost" is not allowed.
Falling back to client side rendering.
```

Every route served a bare `index.csr.html` shell with the generic base title. The app advertised SSR and delivered none of it. Fixed by declaring the real hosts; confirmed by `ng-server-context="ssr"` in the response and per-route `<title>` tags rendered server-side.

### Server route ordering shadowed the dynamic routes

`app.routes.server.ts` listed `{ path: '**', renderMode: Prerender }` **first**. Because entries match in declaration order, the wildcard swallowed both `projects/:stack/:id` rules below it, denying them the `Server` mode they asked for.

### The soft-404 fix required changing the wildcard's render mode

With `**` set to `Prerender`, an unknown URL has no prerendered file to serve, so the engine falls back to the CSR shell at `200 OK` — `NotFound` rendered only in the browser, and crawlers saw a success. Making the wildcard `Server` means `NotFound` renders server-side, sets its flag, and the Express layer answers `404`. The seven static routes are now listed individually so they stay prerendered.

### Assets were never shipped

`assets` was `["src/favicon.ico", "src/assets"]` — a path that doesn't exist, plus an entry that overrode Angular's default `public/` glob. The favicon and logo 404'd in production, and `robots.txt` / `sitemap.xml` would have too. Now verified present in `dist/portfolio_elia/browser/`.

### Colour contrast measured against real backgrounds

`--text-muted` was `#8E97A6`, used in 8 places at 0.75–0.9rem. Measured against the background each usage actually sits on, every instance landed between **2.39:1 and 2.95:1** — well short of the WCAG AA 4.5:1 floor for small text, including a footer link and a form placeholder further dimmed with `opacity: 0.6`.

The tightest constraint is the projects filter bar (`#E2E8F0`), not the page background — an obvious-looking candidate like `#666E7D` still fails there at 4.17:1. The token is now `#5F6776`: **4.62:1** on `#E2E8F0`, 5.1–5.7:1 on the lighter surfaces.

### Design tokens escaped their component

The `--space-1` … `--space-7` scale was declared on the `:host` of the About page, yet consumed by `app-card-grid` and `app-about-section` in `shared/`. Those only resolved correctly because they happened to render inside About; reused anywhere else they would silently fall back to hardcoded defaults. The scale now lives in `:root`, which is what made the `app-card-grid` reuse on the projects page safe.

### The test suite did not compile

Six spec files imported symbols and paths that do not exist (`AboutMe` vs `AboutComponent`, `Tooltip` vs `TechTooltip`, `./project`, a `homepage.spec.ts` sitting in the `main-layout/` folder). `npm test` failed at build, so **zero** tests were running.

After repairing those, a further eight specs failed on missing `provideRouter`, and the CLI's default `app.spec.ts` still asserted `<h1>Hello, portfolio_elia</h1>` against a template that contains only `<router-outlet />`.

The suite also OOM'd: one jsdom environment per spec file in parallel exhausted the machine's memory. Counter-intuitively the `--max-old-space-size=4096` flag in the `test` script made this **worse** — a high ceiling lets V8 defer garbage collection until the OS refuses the allocation. Removing the flag and running specs serially (`vitest.config.ts`) fixed it.

**Result: 19 spec files, 20 tests, green in ~2.3s.**

### Also cleaned up
- Dead CSS: `.skills-grid` rules left behind after `app-card-grid` was extracted, plus a `.card-body` block in `projects-grid.css` that duplicated `card.css` and raced it on specificity
- A duplicated `<link rel="icon">` in `index.html` where the `.ico` fallback had been overwritten with a second copy of the SVG

---

## 🤖 AI-assisted development with Claude Code

This repository is set up to be worked on with **[Claude Code](https://claude.com/claude-code)**, Anthropic's agentic coding CLI. The setup is deliberately lightweight — one committed context file and one local permission entry — but it is worth understanding if you are browsing or contributing.

### `CLAUDE.md` — the working agreement

`CLAUDE.md` sits at the repo root and is loaded automatically at the start of every session. It is the highest-leverage file here: it encodes the decisions a newcomer (human or model) would otherwise have to rediscover by reading the whole codebase, and the ones they would otherwise silently violate.

It documents:

- **Commands** — dev server, build, SSR server, and the exact `ng test` flags
- **Data flow** — the unidirectional `static data → Zod → ProjectService signals → components` pipeline
- **Deliberate constraints** — *"There is no RxJS-based state management anywhere… Don't introduce Observables/subscriptions for state that a signal can express; this is a deliberate project convention, not an oversight."*
- **Non-obvious invariants** — that `app.routes.server.ts` matches in declaration order; that `app-card-grid` renders a `<ul>` and therefore requires `<li>` children; that the Zod schema and `ProjectsTypes` interface are separate and drift if only one is edited; that adding a project also means editing `sitemap.xml`
- **Traps rediscovered the hard way** — why the test runner must stay serial, and why raising the Node heap ceiling makes the OOM more likely rather than less

The value is the *"why not"* as much as the *"what"*. A model that knows RxJS is banned by convention will not helpfully refactor a signal into an observable; a model that knows the wildcard must come last will not reorder the server routes.

### Subagents

Claude Code can dispatch **subagents** — separate contexts with their own tool access — to parallelise work that would otherwise flood the main conversation. The correctness pass above used three read-only `Explore` agents concurrently: one mapping SSR/routing/SEO, one auditing CSS tokens and contrast, one reading the card components. Each returned a summary rather than raw file dumps, which is what made a whole-codebase audit fit in a single session.

Subagents are most useful when a question spans many files and you only need the conclusion. They start with no prior context, so they are a poor fit for follow-up work that depends on what the main session already knows.

### Skills

**Skills** are reusable instruction packets — a folder containing a `SKILL.md` with a name, a description of when it applies, and the procedure to follow. The agent lists the available skills and loads one only when the task matches, so they cost nothing in context until they are relevant.

This repo vendors one, in `.agents/skills/`:

```
.agents/skills/angular-developer/
├── SKILL.md              # Entry point: when to trigger, core rules, routing table
└── references/           # 40 topic files, loaded on demand
    ├── signals-overview.md    linked-signal.md    resource.md    effects.md
    ├── components.md          inputs.md           outputs.md     host-elements.md
    ├── define-routes.md       route-guards.md     router-lifecycle.md
    ├── reactive-forms.md      signal-forms.md     template-driven-forms.md
    ├── rendering-strategies.md   di-fundamentals.md   http-client.md
    ├── angular-aria.md        component-styling.md   tailwind-css.md
    └── testing-fundamentals.md   component-harnesses.md   e2e-testing.md   …
```

It is Angular's **official** skill (MIT, © Google), and its design is worth noting independently of this project: `SKILL.md` is a 144-line router, not a manual. It states a few non-negotiables — *"Always analyze the project's Angular version before providing guidance"*, *"Once you finish generating code, run `ng build` … Do not skip this step"* — then dispatches to the one reference file that matches the task. The 40 topic files never enter context unless something asks for them.

That two-tier shape is the interesting part: a flat 10,000-line instruction file would be loaded in full on every request and mostly wasted. Progressive disclosure keeps the always-on cost to roughly a page.

The natural complement would be **project-specific** skills encoding this repo's own multi-step procedures — *"add a project entry"* (model + Zod schema + `ProjectsTypes` + `sitemap.xml`, all four or none) or *"add a routed page"* (component + route + `SeoService` wiring + render mode + sitemap). Those are exactly the sequences where missing one step produces the silent drift `CLAUDE.md` warns about. None are defined yet; for now those procedures live as prose in `CLAUDE.md`.

> **Path note:** the skill lives in `.agents/skills/` — the emerging cross-tool convention, readable by more than one agent CLI — rather than the Claude-specific `.claude/skills/`. If your tooling only discovers the latter, symlink or copy it across.

### Permissions

`.claude/settings.local.json` is local (git-ignored in spirit, not checked in for others) and currently pre-approves a single command pattern:

```json
{ "permissions": { "allow": ["Bash(npx ng *)"] } }
```

Everything else prompts before running. Keeping the allow-list narrow is the point: build and test commands are safe to repeat, while anything that writes outside the working tree should stay behind a confirmation.

### How this pass was actually run

Plan first, then execute: the audit ran in Claude Code's **plan mode** (read-only — the agent explores and drafts, but cannot edit), the plan was reviewed and adjusted before any code changed, and only then was it executed phase by phase with `npm test` and a real production build as the gates. Two findings came out of that review rather than the original task list — the broken test suite and the unshipped assets — and both turned out to block items that *were* on the list.

Worth stating plainly: AI assistance here is a force multiplier on **verification**, not a substitute for it. Every claim in the engineering notes above was confirmed against a production build and a running Express server — the `allowedHosts` defect in particular was invisible to type checking, invisible to the test suite, and only surfaced by reading the SSR server's own log output.

---

## 📬 Contact

- **GitHub:** [github.com/EliaGiolli](https://github.com/EliaGiolli)
- **LinkedIn:** [linkedin.com/in/eliagiolli](https://linkedin.com/in/eliagiolli)
- **Email:** eliagiolli22@gmail.com

---

> Built with Angular 21 · TypeScript · Zod · SSR · Signals
