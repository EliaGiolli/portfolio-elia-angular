# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Before doing anything, always refer to the skills inside the `.agents/skills/` path — currently `angular-developer` (Angular's official skill: a `SKILL.md` router plus 40 on-demand reference files).

## What this is

Elia Giolli's personal portfolio: an Angular 21 (standalone components, zoneless-friendly Signals) app with SSR via `@angular/ssr` + Express, and Zod runtime validation of static content data.

## Commands

```bash
npm run start                          # ng serve, dev server at http://localhost:4200
npm run build                          # production build -> dist/portfolio_elia/ (browser + server bundles)
npm run watch                          # build --watch, development configuration
npm run serve:ssr:portfolio_elia       # run the built Express SSR server (node dist/portfolio_elia/server/server.mjs)
npm test                               # vitest via `ng test` (jsdom, watch off outside TTY)
```

Test runner is Vitest through the Angular CLI unit-test builder (`@angular/build:unit-test`), not Karma. Useful flags for `ng test`:

```bash
npx ng test --include src/app/shared/components/card/card.spec.ts   # single file
npx ng test --filter "CardComponent"                                 # match by suite/test name
npx ng test --watch                                                   # force watch mode
```

Vitest options live in `vitest.config.ts`, wired in via the builder's `runnerConfig` option. It forces the specs to run **serially in a single worker** (`fileParallelism: false`, `pool: 'threads'`): one jsdom environment per spec file in parallel exhausts Windows commit charge and the run dies with `ENOMEM` / "JavaScript heap out of memory" before reporting anything. Don't re-enable parallelism, and don't reintroduce a `--max-old-space-size` override in the `test` script — raising the ceiling makes V8 defer GC and made the failure *more* likely, not less. Note these are top-level options: `test.poolOptions` was removed in Vitest 4.

There is no separate lint script configured in `package.json`. Formatting is via Prettier (`.prettierrc`: single quotes, 100 print width, Angular parser for `*.html`).

## Architecture

### Data flow (unidirectional, signal-based)

```
src/app/core/models/projects.model.ts   (static project data)
        ↓ validated by
src/app/core/schemas/projectsSchema.ts  (Zod schema, z.array(...).parse)
        ↓ becomes
ProjectService (src/app/core/services/project-service.service.ts)
  - _projects: signal, private, canonical validated source of truth
  - selectedStack: signal, set by ProjectsGrid from route data
  - activeTags: signal, toggled by filter chips
  - filteredProjects: computed(), recomputes from the three signals above
        ↓ read (never written) by
Route components: ProjectsGrid (grid), ProjectsComponent (detail)
```

There is no RxJS-based state management anywhere — Signals + `computed` cover all reactive state (filters, form submission flags, etc.). Don't introduce Observables/subscriptions for state that a signal can express; this is a deliberate project convention, not an oversight.

If `ProjectsSchema.parse` fails validation fails at `ProjectService` construction time, it's caught and logged, and `_projects` falls back to `[]` — it does not throw and crash the app.

### Routing (`src/app/app.routes.ts`)

Every route is nested under `MainLayoutComponent` (navbar + footer), including the homepage and the `**` wildcard — there is no standalone/layout-free route. Two components are imported eagerly — `MainLayoutComponent` (the shell every route nests under) and `NotFound` (referenced twice by class, by the `404` route and the `**` wildcard). Every actual page route uses `loadComponent()` lazy imports. Both `404` (the explicit target `ProjectsComponent` redirects to for an unknown `:id`) and the `**` wildcard render `NotFound`.

There is no `/cv` route. The CV is a static PDF at `public/Elia_Giolli_CV_Angular_Developer.pdf`, linked from the homepage with `app-button`'s `download` input; `/cv` intentionally 404s.

`app.routes.server.ts` matches **in declaration order**, so every specific entry must precede the `**` wildcard — putting the wildcard first silently denies the `:id` routes their `RenderMode.Server`.

`ProjectsGrid` is one component reused for both `/projects/frontend` and `/projects/backend`; the route's `data: { stack: TechStack.frontend | .backend }` is delivered as a typed component `input()` via `withComponentInputBinding()` (configured in `app.config.ts`) rather than injecting `ActivatedRoute`.

### SSR / hydration

`app.config.ts` wires `provideClientHydration(withEventReplay())` so interactions during the SSR→client handoff aren't lost. `src/server.ts` is the SSR entry (Express), `src/main.server.ts` bootstraps the server app, `src/app/app.config.server.ts` / `app.routes.server.ts` hold server-only config/route rendering mode.

### SEO

`SeoService` (`src/app/core/services/seo.service.ts`) wraps Angular's `Title`/`Meta` services and also manages `og:*`, `twitter:*` and the `<link rel="canonical">`. Every routed page calls `seo.update({ title, description, path })` in its constructor — follow this pattern for any new top-level route component rather than setting `Title`/`Meta` directly. Passing `path` (root-relative, e.g. `/about`) is what emits `og:url` + canonical; omit it only for pages that should not be canonicalised, like `NotFound`.

`ProjectsGrid` and `ProjectsComponent` serve more than one URL from one class, so they call `seo.update` inside an `effect()` reading their route input rather than once in the constructor.

The absolute origin lives in one place, `src/app/core/seo.config.ts` (`SITE_ORIGIN`). The static `Person` JSON-LD in `src/index.html` and `public/sitemap.xml` hardcode the same origin — change all three together.

### Directory layout

- `core/` — app-wide singletons with no UI: models (static data), Zod schemas, services, directives (`TooltipDirective`, which dynamically creates a `TechTooltip` component on `mouseenter`/destroys on `mouseleave` rather than using `*ngIf`).
- `shared/` — presentational, reusable pieces with no feature-specific knowledge: `button`, `card`, `card-grid`, `icon`, `tooltip`, `navbar`, `footer`, plus `types/` for cross-cutting TS types (`TechStack` enum, `ProjectsTypes`, `ButtonVariant`).
- `features/` — routed pages: `homepage`, `main-layout`, `projects/` (`projects-layout`, `projects-grid`, `projects-component`), `about/` (`about-me` is the routed `/about` page; `about-section` and `card-grid` are the layout primitives it composes; `contacts` is the `/contacts` form), `not-found`.

### Shared component conventions

- **`app-button`**: renders `<button>` normally, or `<a>` when `href` is passed, or uses `routerLink` for internal navigation — pick the input based on destination, don't wrap `app-button` in your own anchor/button.
- **`app-card`**: composed via named content-projection slots — `card-header`, `card-body`, `card-footer` attributes on projected elements, not component inputs. `icon` is decorative by default (`iconDecorative` defaults `true`); pass `iconDecorative="false"` only when the icon is the sole label for the card.
- **`app-card-grid`**: renders a `<ul>`, so callers must project `<li>` elements — projecting bare `app-card`s produces invalid list markup. Layout is tuned per call site with the `minColumnWidth` and `gap` inputs, which are forwarded to CSS custom properties on the host; don't re-declare grid rules in the consuming component's stylesheet. Used by both `/about` and `/projects/{frontend,backend}`.
- **`app-icon`**: resolves `name` to `assets/icons/{name}.svg`. Always set `decorative` explicitly for purely visual icons (emits `aria-hidden="true"` + `alt=""`); otherwise it falls back to `"{name} icon"` alt text if none is given.
- Accessibility is a first-class concern throughout: prefer native semantic elements (`<article>`, `<nav>`, `<header>`, `<footer>`), explicit `aria-label`/`aria-expanded`/`aria-controls` on non-obvious interactive elements, and keep decorative icons out of the accessibility tree.

### Validation

Two Zod schemas live in `core/schemas/`: `projectsSchema.ts` (validates the static `projects.model.ts` array at `ProjectService` construction) and `formSchema.ts` (contacts form). `projectsSchema.ts` exports both the schema and a `z.infer`-derived `Project` type, but `ProjectService` and components actually type against `ProjectsTypes` in `shared/types/projects.ts` — a hand-written interface kept separate from `Project`. When adding/changing a project field, update the Zod schema *and* `ProjectsTypes` together; they aren't unified and can silently drift if only one is edited.

For the same reason, adding or removing an entry in `projects.model.ts` also means editing `public/sitemap.xml` by hand — the sitemap is static and lists every project detail URL.
