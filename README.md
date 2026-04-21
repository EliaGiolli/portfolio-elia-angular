# 🚀 Personal Portfolio - Angular | Elia Giolli

This repository contains my personal portfolio built with Angular (v21). The following README documents, in meticulous detail, how data flows through the app, the shape and validation of models, the service-layer behavior, routing decisions, the custom `app-button` and `app-card` components, the project's structure, and accessibility considerations. Use this both to present the project and as a study reference.

---

## 🔎 Quick facts

- **Framework:** Angular (v21) with standalone components and Signals
- **SSR:** Configured (`@angular/platform-server`) with client hydration
- **Runtime validation:** `zod` for runtime schema enforcement
- **Icons:** Local SVGs in `src/assets/icons/`
- **Key files:** `src/app/app.ts`, `src/app/app.routes.ts`, `src/app/core/models/projects.model.ts`, `src/app/core/schemas/projectsSchema.ts`, `src/app/core/services/project-service.service.ts`, `src/app/shared/components/button/button.ts`, `src/app/shared/components/card/card.ts`

---

## 🧭 High-level architecture & entry points

- App root: `src/app/app.ts` with template `src/app/app.html` which contains the primary `<router-outlet />`.
- App configuration: `src/app/app.config.ts` registers the router (`provideRouter`) and enables client hydration via `provideClientHydration(withEventReplay())` for SSR-friendly behavior.
- Routing: `src/app/app.routes.ts` defines lazy-loaded routes, nested routes under `MainLayoutComponent`, and uses route `data` to provide a `TechStack` context for reused components.

---

## 🔁 Data flow summary (core idea)

1. Static source-of-truth: `projects` array in `src/app/core/models/projects.model.ts` contains all project entries.
2. Runtime validation & canonicalization: `ProjectService` calls the `ProjectsSchema` (Zod) to validate and parse the `projects` array at initialization.
3. Reactive state: `ProjectService` stores the validated list in a Signal and exposes reactive filter state (`selectedStack`, `activeTags`) and a computed `filteredProjects`.
4. Consumers: route components (e.g., `ProjectsGrid`, `ProjectsComponent`) inject `ProjectService`, read `filteredProjects()` (or `projects()`), and render UI using `app-card`, `app-icon`, and `app-button`.
5. Navigation & context: routes supply `data` (e.g., `TechStack.frontend`), which components can receive through `withComponentInputBinding()` or `ActivatedRoute` and then set service filters accordingly.

This results in a clear, single-direction flow: static data -> validated canonical state -> reactive computed views -> presentational components.

---

## 📦 Models, schema, and types (what they are and why)

- `src/app/shared/types/projects.ts`
	- `TechStack` enum: `frontend | backend | full-stack`.
	- `ProjectsTypes` interface: TypeScript contract for each project (id, project_name, img_path, description, technologies[], demo_link, tech_stack).

- `src/app/core/models/projects.model.ts`
	- Static array `projects: ProjectsTypes[]` that lists portfolio entries. This is the raw data source used in-app and in development.

- `src/app/core/schemas/projectsSchema.ts`
	- Zod schema `ProjectsSchema` which enforces runtime constraints:
		- `id` must be a number
		- `project_name` and `description` must be non-empty strings
		- `img_path` defaults to an empty string
		- `demo_link` accepts a URL or empty string
		- `tech_stack` must be a native enum value from `TechStack`
	- `type Project = z.infer<typeof ProjectsSchema>` makes the runtime schema traceable to types used elsewhere.

Why this matters: TypeScript is static — using `zod` ensures the app won't fail at runtime if `projects` entries are malformed (especially important for SSR or when switching the data source to an external API later).

---

## ⚙️ Service: `ProjectService` (detailed mechanics)

File: `src/app/core/services/project-service.service.ts`

- Provided in root (`@Injectable({ providedIn: 'root' })`) — singleton across the app.
- Key state & signals:
	- `_projects = signal<ProjectsTypes[]>(this.validateProjects(projects))` — private, validated canonical list.
	- `projects = this._projects.asReadonly()` — readonly public view.
	- `selectedStack = signal<TechStack | null>(null)` — currently selected technical stack filter.
	- `activeTags = signal<string[]>([])` — list of active technology tags.

- Derived/computed state:
	- `filteredProjects = computed(() => { ... })` — reads `_projects()`, `selectedStack()` and `activeTags()` and returns a filtered array:
		- If `selectedStack` is set, it filters by `p.tech_stack === selectedStack`.
		- If `activeTags` has items, it filters projects that include any of the active tags (case-insensitive match against `p.technologies`).

- Methods:
	- `toggleTag(tag: string)` — atomically toggles a tag in `activeTags`.
	- `validateProjects(data: any[]): ProjectsTypes[]` — runs `z.array(ProjectsSchema).parse(data)` and returns parsed data or `[]` on failure while logging the error.

Design rationale:
- Signals + computed provide minimal, predictable reactivity without RxJS overhead. Components read signals directly (calling them as functions) in templates, achieving efficient change detection.

---

## 🧩 Routing & how context is passed to UI

File: `src/app/app.routes.ts`

- The app uses lazy-loaded components (`loadComponent`) for fast initial loads and smaller bundles.
- `MainLayoutComponent` is the top-level layout that wraps most routes; children include `projects`, `cv`, `contacts`, etc.
- Route-level `data` is used to indicate which `TechStack` a particular route should show, for example:
	- `path: 'projects/frontend'` has `data: { stack: TechStack.frontend }` and loads `ProjectsGrid`.
	- The same `ProjectsGrid` component is reused for `projects/backend` — the route `data` instructs it which stack to display.

How components get that `data`:
- `withComponentInputBinding()` is registered in `app.config.ts`, so `ProjectsGrid` can declare an input that matches the route data key and receive it automatically as a component input. Alternatively components can read `ActivatedRoute.data`.

Dynamic routing for project details:
- Routes `projects/frontend/:id` and `projects/backend/:id` both load `ProjectsComponent`, which reads `:id` and fetches the project from `ProjectService.projects()` (or `filteredProjects()`), then renders a detail view.

---

## 🧱 Custom components (implementation & accessibility)

- `app-button` — `src/app/shared/components/button/button.ts`
	- Standalone component rendering a native `<button>` element.
	- Inputs: `variant`, `type`, `disabled`, `href`.
	- Uses host class binding to apply `btn-{variant}` and `.disabled` classes.
	- Accessibility:
		- Using a native `<button>` preserves keyboard behavior and role semantics.
		- `disabled` is mapped to the native attribute so screen-readers announce it correctly.

- `app-card` — `src/app/shared/components/card/card.ts`
	- Standalone, structured with semantic elements: `<article>`, `<header>`, `<div class="card-body">`, `<footer>`.
	- Uses content projection slots (`<ng-content select="[card-header]">`, `[card-body]`, `[card-footer]`) so consuming templates provide correct semantic elements (e.g., headings) inside those slots.
	- Inputs: `icon`, `iconSize`.
	- Integrates `app-icon` (renders `<img src="assets/icons/{name}.svg">` with `alt`).
	- Accessibility:
		- Semantic container elements improve navigation for assistive tech.
		- `app-icon` sets `alt` text (currently `"{name} icon"`). Recommendation: add a `decorative` boolean to `app-icon` to allow `alt=""` when appropriate.

Notes on projection: because `app-card` expects the consuming template to place headings inside the `card-header` slot, the consumer should use `<h2>` or `<h3>` inside that slot so screen readers have proper document structure.

---

## 🧪 SSR & hydration

- `app.config.ts` includes `provideClientHydration(withEventReplay())`. This:
	- Replays events that occurred during the server-rendered period so the client can replay them during hydration.
	- Improves perceived interactivity and reduces lost user interactions during hydration.

Practical note: ensure server-rendered markup and client-side initial state match (Zod validation helps here) to avoid hydration mismatches.

---

## ♿ Accessibility — implemented and recommended improvements

Implemented:
- Semantic markup for cards (`article`, `header`, `footer`).
- Native `<button>` for `app-button` with proper `disabled` handling.
- Icon images include `alt` attributes.
- Routing + SSR handled so screen readers receive meaningful server-rendered content.

Recommended improvements (high-priority):
- Allow `app-icon` to accept `decorative` input to set `alt=""` when the icon is not informative.
- Ensure images referenced by `project.img_path` include descriptive `alt` text (not filenames).
- Add visible focus styles for keyboard navigation (global CSS) and ensure interactive elements have clear focus outlines.
- For filtering actions, consider an `aria-live="polite"` region to announce counts after filters are applied (helps users of AT know how many items remain).
- Use semantic lists (`<ul>/<li>`) or `role="list"` + `role="listitem"` for project collections to convey grouping to assistive tech.

---

## 🗂 Project structure (concise map)

- `src/app/`
	- `app.ts`, `app.html`, `app.config.ts`, `app.routes.ts` — app bootstrap and routing config
	- `core/`
		- `models/` — `projects.model.ts` (static data)
		- `schemas/` — `projectsSchema.ts` (zod runtime validation)
		- `services/` — `project-service.service.ts` (signals + business logic)
		- `directives/` — small UI behaviors (e.g., `tooltip.directive.ts`)
	- `shared/`
		- `components/` — `button/`, `card/`, `icon/`, `navbar/`, etc.
		- `types/` — shared TypeScript types
	- `features/` — route-scoped UI: `homepage`, `projects`, `about`, `cv`, `not-found`
- `src/assets/` — `icons/`, `images/` used by `app-icon` and project entries

---

## 🗣 How to explain this to HR (talking points)

- Single source of truth: project data lives in `projects.model.ts` and is validated at runtime by `zod` before it enters app state.
- Modern reactive approach: signals + computed offer fast, explicit reactivity without the complexity of a heavy state library.
- Reusable UI: `app-card` and `app-button` are standalone and composable; they follow semantic HTML for accessibility.
- Performance & UX: pages are lazy-loaded, SSR-enabled, and client-hydrated for a fast first paint and interactive experience.

Example soundbite: "The portfolio uses a single validated data source wired into an Angular Signal-based service that exposes a computed `filteredProjects` array — components bind to that computed value to render lists and details, ensuring predictable, testable UI updates."

---

## ✅ Example sequence: Viewing frontend projects (step-by-step)

1. User navigates to `/projects/frontend`.
2. Router lazy-loads `ProjectsGrid` and route `data.stack` is `TechStack.frontend`.
3. `ProjectsGrid` sets `projectService.selectedStack` (or receives the input) to `frontend`.
4. `projectService.filteredProjects()` recomputes and returns only frontend projects.
5. `ProjectsGrid` renders each result as `app-card` + `app-icon` + `app-button`.
6. Clicking a project's button navigates to `/projects/frontend/:id`, where `ProjectsComponent` reads `:id` and pulls the project from `projectService.projects()` for the details page.

---

## 🛠 Development & run instructions

Clone, install, run (local dev server):

```bash
git clone <your-repo-url>
cd portfolio_elia
npm install
npm run start
```

Build for production (SSR bundle available):

```bash
npm run build
# then run SSR bundle if needed
npm run serve:ssr:portfolio_elia
```

---

## ✅ Next steps I can do for you

- Commit this documentation into the repo (done now).
- Add a Mermaid diagram visualizing the data flow and include it in README.
- Add a small a11y patch: decorative icon support and `alt` improvements for images.

If you'd like, I can also generate the Mermaid diagram and append it to this README. Which of the next steps would you like me to perform now?
