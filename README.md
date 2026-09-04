# Elia Giolli — Full-Stack Developer Portfolio

> A production-grade personal portfolio built with **Angular 21**, **Server-Side Rendering**, **Angular Signals**, and **Zod runtime validation** — designed to showcase full-stack projects with a clean, accessible, and performant UI.

![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?style=flat-square&logo=zod&logoColor=white)
![SSR](https://img.shields.io/badge/SSR-Express%205-000000?style=flat-square&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📌 What this portfolio does

This portfolio solves a real developer problem: how do you present **11+ diverse projects** spanning React, Next.js, Angular, Node.js, NestJS, MongoDB, and PostgreSQL — in a way that is fast, filterable, accessible to screen readers, and impressive to both recruiters and senior engineers?

The answer is a fully SSR-enabled Angular 21 application where:

- Every project entry is **validated at runtime with Zod** so the app never fails silently on malformed data
- Visitors can **filter projects by framework or technology** with instant, reactive feedback — no page reload
- Pages **server-render on first visit** (fast first paint, SEO-friendly), then **hydrate on the client** with event replay so no click is lost
- A full **CV page**, a **contact form** with validation, and a **project detail view** are all presented in one cohesive, lazy-loaded app
- The entire UI is built on a **custom reusable component library** (`app-button`, `app-card`, `app-icon`) with accessibility baked in

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

> **No RxJS for state management.** Signals and `computed` cover every reactive need in this app — simpler, more predictable, and easier to follow.

---

## ✨ Key features

### 🔍 Filterable project explorer
Browse projects split by category — **Frontend** and **Backend** — with one-click technology filter chips (React, Angular, Node.js, NestJS, PostgreSQL, etc.). Filters combine: selecting "Angular" + "TypeScript" shows only projects that use both. The filter state lives in `ProjectService` as a Signal, so every dependent view updates synchronously without subscriptions or manual change detection.

### ⚡ Server-Side Rendering with client hydration
The app uses `@angular/ssr` with Express to server-render every route on first load, then hands off to Angular's client-side router. `provideClientHydration(withEventReplay())` ensures that any user interaction during the SSR-to-client transition is not lost — clicks and keystrokes are replayed after hydration.

### ✅ Runtime data validation (Zod)
Project data is a static TypeScript array — TypeScript validates it at compile time. But `ProjectService` also runs **every entry through a Zod schema at startup**, catching shape mismatches, missing fields, or invalid URLs before they can surface as cryptic runtime errors. This also future-proofs a migration to an external API with zero changes to the validation layer.

### 🧩 Reusable component library
Three foundational shared components underpin every page:

- **`app-button`** — renders a native `<button>` for actions or an `<a>` for external links, applying the correct semantic element automatically based on whether an `href` is provided.
- **`app-card`** — a composable layout container with named content projection slots (`card-header`, `card-body`, `card-footer`) and hover animations. Every project card, CV section, and navigation card is built with it.
- **`app-icon`** — loads local SVGs from `src/assets/icons/` by name. Supports a `decorative` flag (`alt=""` + `aria-hidden="true"`) for icons that are purely visual, and accepts custom `alt` text when context is needed.

### 🏷️ Dynamic tooltips via Angular directive
Technology icons across the project grid display a floating tooltip on hover. This is implemented via `TooltipDirective` — an Angular directive that **dynamically creates a `TechTooltip` component** into the DOM on `mouseenter` and destroys it on `mouseleave`, demonstrating programmatic component instantiation without `ngIf` or wrapper elements.

### 📬 Contact form with reactive validation
The contacts page uses **Angular Reactive Forms** with synchronous validators (min length, email format, required). Validation messages appear field-by-field on blur. On submit, the form runs a validation pass, shows inline errors if invalid, or triggers a simulated async submission with a loading state (`isSubmitting` signal) and a success confirmation screen (`isSubmitted` signal).

### ♿ Accessibility first
- Semantic HTML throughout: `<article>`, `<header>`, `<footer>`, `<nav>`, `<main>`
- Native `<button>` and `<a>` elements preserve keyboard focus and screen-reader role semantics automatically
- ARIA labels on icon-only controls (`aria-label="Back to list"`, `aria-label="Open live demo"`)
- Decorative icons are hidden from assistive technology via `aria-hidden="true"` and `alt=""`
- `app-card` accepts an optional `label` input applied as `aria-label` on the `<article>` container
- Mobile navigation toggle announces state with `aria-expanded` and `aria-controls`

---

## 🗺️ Application routes

```
/                         → Homepage (hero section, tech stack, CTA buttons)
/projects                 → Project category chooser (Frontend / Backend cards)
/projects/frontend        → Filterable grid of frontend projects
/projects/backend         → Filterable grid of backend projects
/projects/frontend/:id    → Full detail view for a specific frontend project
/projects/backend/:id     → Full detail view for a specific backend project
/cv                       → Curriculum Vitae (education, skills, certifications)
/contacts                 → Contact form
/**                       → 404 Not Found
```

- The **Homepage** is standalone — no navbar or footer, intentional hero-first experience
- All other routes are wrapped in `MainLayoutComponent` which provides the navbar and footer
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
  ProjectsGrid → renders app-card grid
  ProjectsComponent → renders single project detail
```

This is a **single-direction data flow**: static data → validated state → reactive computed views → presentational components. No shared mutable state, no event buses, no subscriptions to manage.

---

## 📁 Project structure

```
src/
├── app/
│   ├── app.ts                         # Root component
│   ├── app.html                       # Root template (<router-outlet />)
│   ├── app.routes.ts                  # All routes (lazy-loaded)
│   ├── app.config.ts                  # App providers (router, SSR hydration)
│   │
│   ├── core/
│   │   ├── models/
│   │   │   └── projects.model.ts      # Static project entries (source of truth)
│   │   ├── schemas/
│   │   │   ├── projectsSchema.ts      # Zod schema for project validation
│   │   │   └── formSchema.ts          # Zod schema for contact form
│   │   ├── services/
│   │   │   └── project-service.service.ts  # Signal store + filter logic
│   │   └── directives/
│   │       └── tooltip.directive.ts   # Dynamic tooltip on hover
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── button/                # app-button (action / link)
│   │   │   ├── card/                  # app-card (content container)
│   │   │   ├── icon/                  # app-icon (SVG loader)
│   │   │   ├── navbar/                # Responsive navigation header
│   │   │   ├── footer/                # Footer with social links
│   │   │   └── tooltip/               # Tech tooltip overlay
│   │   └── types/
│   │       ├── projects.ts            # TechStack enum + ProjectsTypes interface
│   │       └── customComponentsTypes.ts  # ButtonVariant type
│   │
│   └── features/
│       ├── homepage/                  # Hero landing page
│       ├── main-layout/               # Navbar + footer wrapper
│       ├── projects/
│       │   ├── projects-layout/       # Category chooser (Frontend / Backend)
│       │   ├── projects-grid/         # Filterable project cards
│       │   └── projects-component/    # Single project detail view
│       ├── cv/                        # CV / résumé page
│       ├── about/
│       │   └── contacts/              # Contact form
│       └── not-found/                 # 404 page
│
└── assets/
    ├── icons/                         # SVG icons for tech stack and UI
    └── images/                        # Profile photo (cv page)
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
**Inputs:** `icon` (icon name from `assets/icons/`), `iconSize` (default `56`), `label` (applied as `aria-label`)

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

Components never write to `_projects`. They read `filteredProjects()` in templates — the `computed` ensures efficient, synchronous updates with no manual subscriptions.

---

## 🖼️ Projects showcased

| # | Project | Category | Stack |
|---|---------|----------|-------|
| 1 | **NexCoin** | Frontend | Next.js 15, TypeScript, TailwindCSS, CoinGecko API |
| 2 | **Taskflow** | Frontend | React, JavaScript, TailwindCSS |
| 3 | **Dev Dashboard** | Backend | Node.js, Express, TypeScript |
| 4 | **ShelfSpot** (React) | Frontend | React, TypeScript, TailwindCSS, OpenLibrary API |
| 5 | **ClockWise** | Frontend | React, TypeScript, TailwindCSS |
| 6 | **Auth Task Management** | Backend | Node.js, Express, TypeScript, MongoDB, JWT |
| 7 | **Bookstore API** | Backend | NestJS, TypeScript, SQLite/PostgreSQL, JWT |
| 8 | **Orizon Travel Agency** | Frontend | React, TypeScript, TailwindCSS |
| 9 | **PennyWise** | Frontend | React, Redux Toolkit, JavaScript |
| 10 | **ShelfSpot** (Angular) | Frontend | Angular, TypeScript, TailwindCSS |
| 11 | **Zenith Dashboard** | Frontend | Angular, TypeScript, TailwindCSS |

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

Output goes to `dist/portfolio_elia/`. The build produces both a browser bundle and an SSR server bundle.

### Run the SSR server

```bash
npm run serve:ssr:portfolio_elia
```

This starts the Express server that serves server-rendered HTML and handles client hydration.

### Run tests

```bash
npm test
```

---

## 🧪 Design decisions worth noting

**Why Signals instead of RxJS?**
Every reactive need in this app — filter state, project list, form submission flags — is a synchronous value that changes in direct response to user actions. Signals handle this with zero boilerplate: read a signal in a template and Angular tracks the dependency automatically. RxJS would add observable chains and `async` pipes for no benefit here.

**Why Zod for a static array?**
TypeScript's type checking disappears at runtime. If a project entry is missing `tech_stack`, the Zod parse fails loudly at startup rather than silently rendering a broken card. More importantly, the `ProjectsSchema` is already in place if the data source ever changes to an external API — no new validation code needed.

**Why is the Homepage outside `MainLayoutComponent`?**
The homepage is designed as a full-screen hero with no navbar or footer interrupting the layout. Keeping it outside the layout wrapper avoids conditional rendering inside the layout and makes the intent explicit in the route definition.

**Why `withComponentInputBinding()`?**
`ProjectsGrid` is reused for both `/projects/frontend` and `/projects/backend`. Rather than injecting `ActivatedRoute` and subscribing to `route.data`, `withComponentInputBinding()` allows the route's `data.stack` value to be received as a typed component `input()` directly — cleaner, testable, and zero boilerplate.

---

## 📬 Contact

- **GitHub:** [github.com/EliaGiolli](https://github.com/EliaGiolli)
- **LinkedIn:** [linkedin.com/in/eliagiolli](https://linkedin.com/in/eliagiolli)
- **Email:** eliagiolli22@gmail.com

---

> Built with Angular 21 · TypeScript · Zod · SSR · Signals
