import { ProjectsTypes, TechStack } from "../../shared/types/projects";

export const projects: ProjectsTypes[] = [
    {
        "id": 1,
        "project_name": "NexCoin",
        "img_path": "",
        "description": "A cryptocurrency dashboard built with Next.js 15 and TypeScript, reading live market data from the CoinGecko API and backed by Prisma with credential auth.",
        "technologies": ["nextdotjs", "typescript", "tailwindcss"],
        "technologies_detail": ["nextdotjs", "react", "typescript", "tailwindcss", "shadcnui", "radixui", "reactquery", "zod", "prisma", "sqlite", "lucide"],
        "core_tech": "nextdotjs",
        "github_link": "https://github.com/EliaGiolli/dashboard-crypto-next",
        "demo_link": "",
        "tech_stack": TechStack.frontend,
        "role": "Solo developer",
        "year": 2026,
        "summary": [
            "NexCoin tracks the crypto market: live prices from the CoinGecko API, rendered as sortable tables and interactive charts, with a dark/light toggle and skeleton loaders while data is in flight.",
            "It is a dashboard with a real back end rather than a static front end. Next.js server components handle data access and auth, while the interactive pieces — the sortable table, the auth form, the mobile menu — mount as client islands, keeping the heavy work off the browser."
        ],
        "highlights": [
            "Credential auth as Next.js server actions: bcrypt-hashed passwords, a Zod-validated payload, and an HTTP-only session cookie that server components read directly to decide what to render.",
            "Prisma over SQLite for persistence, with the client generated into the project and instantiated as a singleton.",
            "TanStack Query for fetching, caching and background refresh, so the market data updates without a manual refetch layer.",
            "Interface assembled from shadcn/ui and Radix primitives, which keeps the menus and dialogs keyboard-accessible for free."
        ]
    },
    {
        "id": 2,
        "project_name": "Imperi e Rivoluzioni - blog",
        "img_path": "",
        "description": "A personal blog on contemporary history and geopolitics, built with Astro content collections that validate every article and reading at build time.",
        "technologies": ["astro", "typescript", "tailwindcss"],
        "technologies_detail": ["astro", "typescript", "tailwindcss", "alpinedotjs", "vercel"],
        "core_tech": "astro",
        "github_link": "https://github.com/EliaGiolli/imperi-e-rivoluzioni-blog",
        "demo_link": "https://imperi-e-rivoluzioni-blog.vercel.app/",
        "tech_stack": TechStack.frontend,
        "role": "Solo developer",
        "year": 2026,
        "summary": [
            "A publishing project rather than a demo: articles on empires, ideologies and the international order, plus a catalogue of recommended reading organised by author, topic and tag.",
            "Content is Markdown, but it is typed Markdown. Two Astro collections describe the shape of an article and of a reading, so a missing title or a malformed tag fails the build instead of shipping a broken page."
        ],
        "highlights": [
            "Astro content collections with schema-validated frontmatter drive both the archive pages and the generated detail routes.",
            "Alpine.js handles the small interactions — mobile menu, tag filtering — without pulling a framework runtime into a static site.",
            "Three levels of automated tests: unit, integration and end-to-end, runnable separately or in sequence.",
            "Accessibility treated as a requirement: semantic landmarks, labelled fields with live regions for form state, visible focus, and `prefers-reduced-motion` support on animated elements."
        ]
    },
    {
        "id": 3,
        "project_name": "Dev Dashboard",
        "img_path": "",
        "description": "A REST API simulating a developer/admin dashboard: persistent system metrics, log management with filtering and archiving, and a bcrypt hashing suite.",
        "technologies": ["nodedotjs", "express", "typescript"],
        "technologies_detail": ["nodedotjs", "express", "typescript", "prisma", "sqlite"],
        "core_tech": "express",
        "github_link": "https://github.com/EliaGiolli/dashboard-admin-express",
        "demo_link": "",
        "tech_stack": TechStack.backend,
        "role": "Solo developer",
        "year": 2026,
        "summary": [
            "An admin API that snapshots CPU, RAM and uptime into a database so system health can be read as a trend rather than a single instant, alongside persistent logs that can be filtered by level and archived rather than deleted.",
            "It started as a plain Express server and grew into a database-backed application, which is where most of the interesting decisions came from."
        ],
        "highlights": [
            "Errors handled by a central layer instead of `res.status().json()` scattered through controllers: a custom `AppError` carries a status code and a global middleware catches it, so controllers only describe the happy path. Modelled deliberately on NestJS exception filters.",
            "Prisma over SQLite for persistence, with service-layer business logic kept separate from lean route handlers.",
            "Environment variables exposed through an explicit whitelist, so a new secret in `.env` is private by default rather than by remembering.",
            "Sensitive routes sit behind an API-key guard; bcrypt backs both the hashing endpoints and the stored credentials."
        ]
    },
    {
        "id": 4,
        "project_name": "Shelfspot",
        "img_path": "",
        "description": "An Angular library manager built on Signals and Zod, searching the OpenLibrary API and presenting results in a bento-grid UI. Under active development.",
        "technologies": ["angular", "typescript", "tailwindcss"],
        "technologies_detail": ["angular", "typescript", "tailwindcss", "reactivex", "zod", "lucide", "vercel"],
        "core_tech": "angular",
        "github_link": "https://github.com/EliaGiolli/Shelfspot---angular",
        "demo_link": "https://shelfspot-angular.vercel.app/",
        "tech_stack": TechStack.frontend,
        "role": "Solo developer",
        "year": 2026,
        "summary": [
            "ShelfSpot searches OpenLibrary and presents books in a bento-grid layout, with details opening in a modal that is deep-linkable through URL parameters.",
            "It is a deliberate study in zoneless-ready Angular: Signals for fine-grained reactivity, RxJS only where async streams genuinely need it. Still under active development — loans, favourites and a signal-driven contact form are in progress."
        ],
        "highlights": [
            "Signals and RxJS interoperate rather than compete: `switchMap` handles the search stream, `toSignal` hands the result to the templates.",
            "Zod schemas validate and narrow OpenLibrary responses at the boundary, so a third-party API change surfaces as a validation error rather than an undefined deep in a template.",
            "Book details use the native `<dialog>` element with focus trapping — a real modal, without a modal library.",
            "Injection tokens carry API configuration, keeping services decoupled from environment specifics and straightforward to test."
        ]
    },
    {
        "id": 5,
        "project_name": "ClockWise",
        "img_path": "",
        "description": "A React 19 work-hours tracker: log remote or on-site sessions, then read them back as weekly and monthly charts on an interactive dashboard.",
        "technologies": ["react", "typescript", "tailwindcss"],
        "technologies_detail": ["react", "typescript", "tailwindcss", "vite", "reactrouter", "reacthookform", "framer", "vercel"],
        "core_tech": "react",
        "github_link": "https://github.com/EliaGiolli/ClockWise---React-ts",
        "demo_link": "https://clock-wise-react-ts.vercel.app/",
        "tech_stack": TechStack.frontend,
        "role": "Solo developer",
        "year": 2025,
        "summary": [
            "ClockWise records work sessions — remote or on-site, with timestamps, tasks and descriptions — and turns them into something readable: bar, pie and line charts, totals and averages split by category.",
            "The product page doubles as the dashboard, so the same view that demonstrates the app is the one that actually does the work."
        ],
        "highlights": [
            "Zustand holds the global store — work logs, theme, form state — chosen over Redux for the amount of state actually involved.",
            "Recharts renders the visualisations; React Hook Form handles validation on the log and contact forms.",
            "Light and dark themes persisted in state, applied consistently across dashboard, tables and modals.",
            "Framer Motion carries the transitions and form feedback; strict TypeScript and type-aware linting throughout."
        ]
    },
    {
        "id": 6,
        "project_name": "Authentication Task Management",
        "img_path": "",
        "description": "A REST API pairing JWT authentication with task CRUD: Express and TypeScript over MongoDB, with Zod-validated requests and bcrypt-hashed credentials.",
        "technologies": ["nodedotjs", "express", "typescript", "mongodb"],
        "technologies_detail": ["nodedotjs", "express", "typescript", "mongodb", "mongoose", "jsonwebtokens", "zod"],
        "core_tech": "express",
        "github_link": "https://github.com/EliaGiolli/express-ts-authserver",
        "demo_link": "",
        "tech_stack": TechStack.backend,
        "role": "Solo developer",
        "year": 2025,
        "summary": [
            "An auth server with something to protect: users register and log in for a JWT, then manage their own tasks — name, description, tag, due date, completion — behind it.",
            "The focus is on getting the unglamorous parts right: never storing a password, rejecting malformed input before it reaches a handler, and returning errors in a consistent shape."
        ],
        "highlights": [
            "JWT issued on registration and login, with protected routes verifying the bearer token before any task operation.",
            "bcrypt hashing throughout — the user model stores a `passwordHash` and nothing else.",
            "Zod schemas validate request bodies at the edge, so handlers can trust their input.",
            "Mongoose models over MongoDB with automatic timestamps; Helmet sets security headers on every response."
        ]
    },
    {
        "id": 7,
        "project_name": "Bookgraph - NestJS",
        "img_path": "",
        "description": "A NestJS API that models a personal library as a graph: books, authors and tags, plus directional connections aggregated into nodes and edges.",
        "technologies": ["nodedotjs", "nestjs", "typescript", "postgresql"],
        "technologies_detail": ["nestjs", "nodedotjs", "typescript", "postgresql", "typeorm", "passport", "jsonwebtokens", "swagger", "openapiinitiative", "jest"],
        "core_tech": "nestjs",
        "github_link": "https://github.com/EliaGiolli/bookgraph-nestjs",
        "demo_link": "",
        "tech_stack": TechStack.backend,
        "role": "Solo developer",
        "year": 2026,
        "summary": [
            "BookGraph is a library manager built around relationships rather than a flat list. Books carry authors, tags and reading statuses, and can be linked to one another directionally — this book inspired that one.",
            "Those links are the point. A dedicated `/graph` endpoint aggregates a user's books and connections into a `{ nodes, edges }` structure that a visualisation library such as vis-network can render directly, turning a reading history into a map."
        ],
        "highlights": [
            "Modular NestJS architecture with each domain — auth, users, books, authors, tags, connections, graph — isolated in its own module.",
            "TypeORM over PostgreSQL; Passport-JWT and bcrypt for authentication, with ownership checks so a user can only reach their own records.",
            "DTO validation via class-validator, plus relationship constraints that reject invalid or self-referential connections.",
            "The full surface is documented as an OpenAPI 3.0 spec generated from the code and browsable through Swagger UI."
        ]
    },
    {
        "id": 8,
        "project_name": "Zenith Dashboard",
        "img_path": "",
        "description": "An Angular server-monitoring dashboard: live status cards, search and analytics, with HTTP interceptors standing in for a real backend.",
        "technologies": ["angular", "typescript", "css"],
        "technologies_detail": ["angular", "typescript", "css", "zod", "express", "jasmine"],
        "core_tech": "angular",
        "github_link": "https://github.com/EliaGiolli/zenith-dashboard-angular",
        "demo_link": "https://zenith-dashboard-angular.vercel.app/",
        "tech_stack": TechStack.frontend,
        "role": "Solo developer",
        "year": 2026,
        "summary": [
            "Zenith monitors a server fleet: cards showing CPU and memory per node with online, offline and maintenance states, searchable by name, plus an analytics view and a validated form for registering new nodes.",
            "There is no backend, and that is deliberate — an HTTP interceptor supplies mock responses, so the app is built against the HttpClient it would really use rather than around a fake service."
        ],
        "highlights": [
            "Two interceptors carry the infrastructure: one mocks the API, the other centralises error handling, leaving components free of both concerns.",
            "Custom directives for the parts that are easy to get wrong — a modal a11y directive for native `<dialog>` elements, and a status-badge directive for server state.",
            "Zod validates server payloads at runtime, so mock and real data are held to the same contract.",
            "Light and dark themes built on CSS custom properties with contrast checked in both, and form errors announced through `role=\"alert\"` and `aria-live`."
        ]
    },
    {
        "id": 9,
        "project_name": "VeggieVibes",
        "img_path": "",
        "description": "A React 19 recipe finder over the Spoonacular API, with debounced and cancellable search, a CVA-based component system and accessible async states.",
        "technologies": ["react", "typescript", "tailwindcss"],
        "technologies_detail": ["react", "typescript", "tailwindcss", "vite", "reactrouter", "axios", "vercel"],
        "core_tech": "react",
        "github_link": "https://github.com/EliaGiolli/VeggieVibes-react",
        "demo_link": "https://veggie-vibes-react.vercel.app/",
        "tech_stack": TechStack.frontend,
        "role": "Solo developer",
        "year": 2026,
        "summary": [
            "VeggieVibes searches thousands of vegetarian and vegan recipes from the Spoonacular API and shows them as image-first cards, each opening to a full ingredient list and cooking time.",
            "Most of the work went into the search box. Typing fires network requests, and doing that naively means wasted calls and results arriving out of order."
        ],
        "highlights": [
            "Search is debounced by 400 ms, and an `AbortController` cancels any in-flight request when a new one starts — which is what stops a slow earlier response from overwriting a newer one.",
            "Shared components follow a shadcn-style pattern: class-variance-authority for variants, a `cn()` helper for overrides, and native attributes spread through rather than swallowed.",
            "Typed API contracts end to end, so a response shape change surfaces at compile time instead of in the UI.",
            "Loading and error regions use `aria-live` with `role=\"status\"` and `role=\"alert\"`, and the layout ships a skip link and ARIA landmarks."
        ]
    },
];

/**
 * `technologies` is the headline set: it renders as icons on the grid card AND is
 * what the filter chips match against, so keep it short and framework-level.
 * `technologies_detail` is the full stack and appears only on the detail page.
 *
 * Every entry in both — and every `core_tech` — must name a file in
 * src/assets/icons/tech/. projects.model.spec.ts enforces that, because a missing
 * icon fails as a broken <img> rather than an error.
 *
 * Adding or removing a project also means editing public/sitemap.xml by hand, and
 * any field change must be mirrored in BOTH shared/types/projects.ts and
 * core/schemas/projectsSchema.ts.
 */
