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

Implemented (updates applied):
- `app-icon` now supports a `decorative` input and an optional `alt` input. When `decorative` is true the image uses `alt=""` and `aria-hidden="true"` so assistive technology ignores purely decorative icons.
- `app-button` now renders the correct semantic element based on how it's used: it renders an `<a>` for `href` external links (with `target="_blank" rel="noopener noreferrer"`), an `<a>` with the Angular `routerLink` directive for in-app navigation, or a native `<button>` for actions. Anchor and button variants include `aria-disabled`/`disabled` handling and maintain keyboard semantics.
- `app-card` accepts an optional `label` input which is applied as `aria-label` on the article container when provided, giving a reliable accessible name for complex projected content.
- Common actionable controls in `projects-component` now include explicit `aria-label` attributes to disambiguate icon-only controls.

Remaining recommendations (low-effort, high-value):
- Ensure `project.img_path` values include descriptive `alt` text when images are present.
- Add a small, consistent visible focus style in global CSS (outline or box-shadow) to improve keyboard discoverability.
- Consider adding an `aria-live="polite"` region that announces filter counts when `selectedStack` or `activeTags` changes.
- Use semantic lists (`<ul>/<li>`) for the grid of projects or add `role="list"`/`role="listitem"` if markup cannot be changed.

---

## 🗂 Project structure (concise map)
```bash
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
```
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

## 🧪 Testing

### Technology stack

| Tool | Role |
|---|---|
| **Vitest 4** | Test runner (replaces Karma/Jest; powered by Vite for fast HMR-style test re-runs) |
| **@angular/build:unit-test** | Angular CLI builder that wires Angular TestBed into Vitest's worker pool |
| **Angular TestBed** | Creates a miniature Angular module per test file, compiles components, and manages DI |
| **@angular/platform-browser** | Provides `By.directive()` and `ComponentFixture` for querying the rendered DOM |
| **jsdom** | Headless browser environment (no real Chromium needed) used by Vitest workers |
| **Vitest globals** | `describe`, `it`, `expect`, `vi`, `beforeEach`, etc. available without imports via `"types": ["vitest/globals"]` in `tsconfig.spec.json` |

Tests are co-located with their sources (e.g. `button.ts` → `button.spec.ts`) and run with:

```bash
npm test
```

---

### Design decisions

#### Why unit tests over end-to-end tests?
This portfolio has no backend, no authentication, and no forms that hit a real server.
The interesting risks are all in the *logic layer*:
- Does the filter produce the right subset of projects?
- Does the form block submission when invalid?
- Does the component navigate to /404 when an id is unknown?

Unit tests answer these questions in milliseconds. E2E tests would require a running dev server, a real browser, and network stability — all unnecessary overhead for deterministic, side-effect-free logic.

#### Why real components instead of shallow rendering?
Angular's TestBed compiles and mounts the real component, including its template and CSS bindings. This is intentional: shallow rendering (e.g. stubbing child components) would hide bugs in the host–child contract (e.g. a directive that creates a child component dynamically). The only exception is the Router — we provide `provideRouter([])` (an empty route table) rather than a real routing setup, because we test component logic, not URL transitions.

#### Why `vi.spyOn` instead of manual stubs?
`vi.spyOn` wraps the original implementation and records calls, which means:
- Assertions are on observed behaviour (`toHaveBeenCalledWith`), not implementation details.
- `vi.restoreAllMocks()` (called at the end of each test that needs it) guarantees the global scope is clean for subsequent tests.

#### Why mock `globalThis.setTimeout` instead of `fakeAsync`?
Angular's `fakeAsync` / `tick` helpers require `zone.js/testing` to be loaded before the test suite. The new `@angular/build:unit-test` builder (Angular 21 + Vitest) does not include that setup file by default — using `fakeAsync` causes Vitest workers to crash with an out-of-memory error. The workaround is to intercept `globalThis.setTimeout` with `vi.spyOn(...).mockImplementation`, capture the callback, and invoke it synchronously. This tests the exact same code path as `tick(1500)` but without requiring Zone.js.

#### Why `await fixture.whenStable()` for effect assertions?
Angular `effect()` callbacks are not run synchronously by `detectChanges()` in the new scheduler. They are scheduled as microtasks. `whenStable()` resolves after the microtask queue drains, making it the correct way to wait for effects in an async test without fakeAsync.

---

### Test file inventory

#### `src/app/core/services/project-service.spec.ts` — ProjectService (unit)

**What is tested:**
The entire public API of the service: data loading, the three filtering modes (stack-only, tag-only, stack+tag), and the toggleTag mutation.

**Why each group matters:**

| Test group | Risk mitigated |
|---|---|
| *loads projects on init* | Catches Zod validation failures that silently return `[]` instead of throwing |
| *filteredProjects — no filter* | Ensures the computed is a passthrough when both filters are null/empty |
| *filteredProjects — by stack* | Ensures AND logic doesn't accidentally bleed projects from the wrong stack |
| *filteredProjects — by tag (case-insensitive)* | Technology strings in the model may be stored in mixed case; the lower-case comparison must hold |
| *filteredProjects — stack + tag* | Validates that both filters compose correctly with AND (not OR) semantics |
| *filteredProjects — impossible tag* | Edge case: no match must produce `[]`, not `undefined` or a crash |
| *toggleTag — add* | Adding a tag not yet in the array |
| *toggleTag — remove* | Removing one tag must not disturb other tags in the array |
| *toggleTag — double toggle* | Round-trip: final state equals initial state |
| *toggleTag — multiple tags* | Independent toggles must not interfere with each other |

**Key technique:** signals update synchronously, so every assertion runs without `async`/`await`.

---

#### `src/app/shared/components/button/button.spec.ts` — Button (unit)

**What is tested:**
Host class bindings (`btn-{variant}`), the `.disabled` class on the host element, the native `disabled` attribute on the inner `<button>`, and the `type` attribute default/override.

**Why each group matters:**

| Test group | Risk mitigated |
|---|---|
| *variant class* | A typo in the `variantClass` computed string (e.g. `btn_primary`) would make CSS rules miss and render unstyled buttons across the entire app |
| *disabled state — host class* | The `.disabled` class on `<app-button>` drives the CSS visual style; if it's missing the button looks enabled even when it isn't |
| *disabled state — inner button* | The native `disabled` attribute on `<button>` is what browsers and screen readers use; without it, keyboard users can activate a "disabled" button |
| *type attribute default* | Buttons inside `<form>` elements default to `type="submit"` in browsers if no explicit type is set; the component must override this to `"button"` to prevent accidental form submissions |

**Key technique:** `fixture.componentRef.setInput()` drives signal inputs (Angular 16+ API); `fixture.nativeElement.classList` and `querySelector('button')` assert on the real DOM.

---

#### `src/app/shared/components/navbar/navbar.spec.ts` — Navbar (unit)

**What is tested:**
The `isMenuOpen` signal initial state and its toggle behaviour through two full cycles.

**Why each group matters:**

| Test | Risk mitigated |
|---|---|
| *is false by default* | If the signal starts as `true`, the mobile menu is open on page load — a layout regression |
| *toggleMenu once* | Verifies the signal actually changes when the method is called |
| *toggleMenu twice* | Verifies the toggle is truly bidirectional; a broken implementation that always sets to `true` would pass the first test but fail this one |
| *icon constants* | The template selects SVG icons by name constant; a rename without updating the constant would silently break the icons |

**Key technique:** `provideRouter([])` is required to satisfy `RouterLink` / `RouterLinkActive` in the template even though we never navigate.

---

#### `src/app/shared/components/icon/icon.spec.ts` — IconComponent (unit)

**What is tested:**
The `src` construction from the `name` input, the `size` inline style, and all three accessibility attribute combinations (`informational`, `decorative`, `explicit alt`).

**Why each group matters:**

| Test group | Risk mitigated |
|---|---|
| *src — correct path* | If the asset path convention changes (`assets/icons/` → `icons/`), all icons break silently |
| *src — reactivity* | The same icon slot may render different icons depending on data; the binding must update |
| *size — default 24px* | A missing default would make icons appear as 0×0 (invisible) |
| *size — custom* | Size is applied as inline `style`, not as a class; the test confirms the pixel value, not just a class name |
| *a11y — auto alt* | Screen readers need text for informational icons; `"{name} icon"` is the fallback |
| *a11y — explicit alt* | The explicit alt must take priority over the auto-generated one |
| *a11y — decorative* | Both `aria-hidden="true"` AND `alt=""` must be set together; setting only one is an incomplete fix |
| *a11y — no aria-hidden when informational* | `aria-hidden="false"` is handled inconsistently by some screen readers; the correct fix is to omit the attribute entirely |

---

#### `src/app/features/about/contacts/contacts.spec.ts` — Contacts (unit)

**What is tested:**
Individual field validators (required, minLength, email format), the invalid-submit guard behaviour, and the full valid-submit state machine.

**Why each group matters:**

| Test group | Risk mitigated |
|---|---|
| *form invalid when empty* | Catches a missing `Validators.required` that would allow empty submissions |
| *name / lastName minLength* | Boundary test at the minimum (4 chars); one character below the threshold must still fail |
| *email format* | `Validators.email` rejects strings without a valid format; ensures the validator is wired correctly |
| *all fields valid* | Integration check: only when every field is satisfied is the group valid |
| *invalid submit — markAllAsTouched* | Without this call, Angular only shows errors on fields the user has touched; the test ensures all errors appear at once on a submit attempt |
| *invalid submit — no isSubmitting* | Prevents showing a loading spinner with no real action behind it |
| *valid submit — isSubmitting immediately* | The spinner must appear before the 1500 ms delay, not after |
| *valid submit — full lifecycle* | Tests the callback side-effects (isSubmitting=false, isSubmitted=true, form reset) using a `setTimeout` mock instead of `fakeAsync` |

**Key technique — setTimeout mock:**
```typescript
vi.spyOn(globalThis, 'setTimeout').mockImplementation((fn: any) => {
  capturedCallback = fn;        // capture without scheduling
  return 0 as unknown as ReturnType<typeof setTimeout>;
});
// ...then later:
capturedCallback!();            // run synchronously, no timer needed
```
This avoids `fakeAsync` (which crashes this project's Vitest setup) while testing the exact same callback code.

---

#### `src/app/features/projects/projects-grid/projects-grid.spec.ts` — ProjectsGrid (unit/integration)

**What is tested:**
The `currentTags` computed, the `isTagActive` method, the constructor `effect()` that keeps the service in sync, and the `goBack()` delegation to `Location`.

**Why each group matters:**

| Test group | Risk mitigated |
|---|---|
| *currentTags — frontend* | The tag list must contain the right technologies; wrong tags show a useless filter UI |
| *currentTags — backend* | Verifies the conditional logic in the computed correctly branches on `TechStack.backend` |
| *currentTags — default (null)* | Before the route resolves, stack is null; the component must not crash and must show some tags |
| *isTagActive — false* | Freshly mounted component must show all chips as inactive |
| *isTagActive — true* | Writing to the service's signal directly must immediately reflect in the method's return value |
| *effect — selectedStack sync* | If the effect does not run, the service filter stays stale and the project list does not update |
| *effect — activeTags reset* | Switching stacks without resetting tags would show frontend tags as "active" on the backend grid |
| *goBack* | Confirms delegation to `Location.back()` — the only navigation from this component |

---

#### `src/app/features/projects/projects-component/projects-component.spec.ts` — ProjectsComponent (unit/integration)

**What is tested:**
The `project` computed signal (id → project object lookup) and the 404-navigation effect with all three conditional branches.

**Why each group matters:**

| Test group | Risk mitigated |
|---|---|
| *project — empty id* | The component is mounted before the router binds the param; undefined here prevents a crash |
| *project — valid id* | The `Number(id)` conversion and `array.find()` call return the right object |
| *project — unknown id* | Undefined result is the trigger for the 404 redirect; must not silently return a wrong project |
| *effect — navigate to /404* | Users who bookmarks or type an invalid URL must land on the 404 page, not a blank detail view |
| *effect — no navigate (empty id)* | The guard `if (this.id() && ...)` must short-circuit; otherwise the component redirects on every mount |
| *effect — no navigate (valid id)* | A found project must not redirect; this tests the third branch explicitly |

**Key technique:** `vi.spyOn(router, 'navigate').mockResolvedValue(true)` is called before `detectChanges()` so even the initial effect run is intercepted. `await fixture.whenStable()` lets the microtask-scheduled effect complete before the assertion.

---

#### `src/app/core/directives/tooltip.directive.spec.ts` — TooltipDirective (unit/integration)

**What is tested:**
Directive attachment, dynamic component creation on `mouseenter`, destruction on `mouseleave`, the duplicate-creation guard, and the forwarded `techName` value.

**Why each group matters:**

| Test | Risk mitigated |
|---|---|
| *attaches without error* | Confirms the DI token (ViewContainerRef) resolves and the directive initialises |
| *creates tooltip on mouseenter* | The core UX: hovering must insert the tooltip component into the DOM |
| *removes tooltip on mouseleave* | A missing `destroy()` call leaks component instances; each hover would add a new invisible ghost |
| *no duplicates on repeated mouseenter* | Without the `if (this.componentRef) return` guard, rapid mouse movements add multiple tooltips |
| *passes techName correctly* | `setInput('techName', value)` must forward the bound value; a bug here renders a blank tooltip |

**Key technique:** a minimal `HostComponent` is declared inside the spec file (not in the src tree) purely for test purposes. Real `MouseEvent` objects are dispatched to give Angular's `@HostListener` handlers the same input they receive in a real browser. The tooltip is found with `querySelector('app-tech-tooltip')` because `ViewContainerRef.createComponent()` inserts the element adjacent to the host — it is not a child of Angular's debug tree in the usual sense.

---

#### `src/app/shared/components/tooltip/tooltip.spec.ts` — TechTooltip (unit)

**What is tested:**
The component's rendering when created directly (without the directive), and its reactivity when `techName` changes after creation.

**Why this is a separate test from the directive spec:**
The directive test verifies the *interaction contract* (create/destroy on mouse events). This spec verifies the *display contract* (text content, reactivity). Keeping them separate means a bug in one does not mask a bug in the other.

| Test | Risk mitigated |
|---|---|
| *renders techName* | The `.tooltip-box` selector and the `{{ techName() }}` interpolation must be correct |
| *updates on techName change* | The directive may call `setInput` after creation; the component must re-render without being recreated |

---

### Running tests

```bash
# Run once (CI mode)
npm test

# Re-run on file changes (watch mode, not yet configured — add "--watch" to the ng test command)
npm test -- --watch
```

**About the OOM warning in the output:**
You may see `FATAL ERROR: AlignedAlloc Allocation failed - process out of memory` in some Vitest worker processes. This is a Node.js heap limit issue caused by Vitest spawning many parallel workers, each of which loads Angular's compiler. All 73 tests pass before the crash occurs. To suppress the warning, add a worker limit to `angular.json`:

```json
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "poolOptions": {
      "forks": { "maxForks": 2 }
    }
  }
}
```

---

## ✅ Next steps I can do for you

- Commit this documentation into the repo (done now).
- Add a Mermaid diagram visualizing the data flow and include it in README.
- Add a small a11y patch: decorative icon support and `alt` improvements for images.
