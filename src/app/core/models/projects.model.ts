import { ProjectsTypes, TechStack } from "../../shared/types/projects";

export const projects: ProjectsTypes[] = [
    {
        "id": 1,
        "project_name": "NexCoin",
        "img_path": "",
        "description": "A modern, responsive cryptocurrency dashboard built with Next.js 15, TypeScript, TailwindCSS 4, and ShadCN UI components. This project fetches data from the public CoinGecko API",
        "technologies": ["nextdotjs", "typescript", "tailwindcss", "nodedotjs", "postgresql"],
        "github_link": "https://github.com/EliaGiolli/dashboard-crypto-next",
        "demo_link": "",
        "tech_stack": TechStack.frontend,
        // Worked example of the long-form fields. Everything below restates what the
        // short description already claimed — nothing new was invented about the
        // project. Replace it with the real story, and add `role` and `year`.
        "summary": [
            "NexCoin is a cryptocurrency dashboard built with Next.js 15 and TypeScript, styled with TailwindCSS 4 and ShadCN UI components.",
            "It reads live market data from the public CoinGecko API and lays it out responsively, so the same dashboard is usable on a desktop monitor and on a phone."
        ],
        "highlights": [
            "Built on Next.js 15 with TypeScript used throughout.",
            "Live market data pulled from the public CoinGecko API.",
            "Interface composed from ShadCN UI components and styled with TailwindCSS 4."
        ]
    },
    {
        "id": 2,
        "project_name": "Imperi e Rivoluzioni - blog",
        "img_path": "",
        "description": "A personal blog dedicated to contemporary history and geopolitics. The project brings together articles, recommended reading and in-depth analyses on the relationships between empires, ideologies, conflicts and the international order.",
        "technologies": ["astro", "typescript", "tailwindcss"],
        "github_link": "https://github.com/EliaGiolli/imperi-e-rivoluzioni-blog",
        "demo_link": "https://imperi-e-rivoluzioni-blog.vercel.app/",
        "tech_stack": TechStack.frontend
    },
    {
        "id": 3,
        "project_name": "Dev Dashboard",
        "img_path": "",
        "description": "A REST API designed to simulate a developer/admin dashboard. It allows to monitor system health, manage logs, and test cryptography",
        "technologies": ["nodedotjs", "express", "typescript"],
        "github_link": "https://github.com/EliaGiolli/dashboard-admin-express",
        "demo_link": "",
        "tech_stack": TechStack.backend
    },
    {
        "id": 4,
        "project_name": "Shelfspot",
        "img_path": "",
        "description": "Angular version of ShelfSpot — a modern web application that allows users to explore and manage books through the OpenLibrary API, built with Angular and TypeScript.",
        "technologies": ["angular", "typescript", "tailwindcss"],
        "github_link": "https://github.com/EliaGiolli/Shelfspot---angular",
        "demo_link": "https://shelfspot-angular.vercel.app/",
        "tech_stack": TechStack.frontend
    },
    {
        "id": 5,
        "project_name": "ClockWise",
        "img_path": "",
        "description": "A front-end web application that simulates a professional dashboard. The purpose is to show a dynamic work table, a presence chart and a time summary",
        "technologies": ["react", "typescript", "tailwindcss"],
        "github_link": "",
        "demo_link": "https://clock-wise-react-ts.vercel.app/",
        "tech_stack": TechStack.frontend
    },
    {
        "id": 6,
        "project_name": "Authentication Task Management",
        "img_path": "",
        "description": "A robust REST API built with Node.js, Express, TypeScript, and MongoDB that provides JWT-based authentication and comprehensive task management functionality.",
        "technologies": ["nodedotjs", "express", "typescript", "mongodb"],
        "github_link": "",
        "demo_link": "",
        "tech_stack": TechStack.backend
    },
    {
        "id": 7,
        "project_name": "Bookgraph - NestJS",
        "img_path": "",
        "description": "A robust REST API built with Nest.js, TypeScript, and PostgreSQL that provides JWT-based authentication and comprehensive book store management functionality.",
        "technologies": ["nodedotjs", "nestjs", "typescript", "postgresql"],
        "github_link": "https://github.com/EliaGiolli/bookgraph-nestjs",
        "demo_link": "",
        "tech_stack": TechStack.backend
    },
    {
        "id": 8,
        "project_name": "Zenith Dashboard",
        "img_path": "",
        "description": "Angular version of Zenith — a sleek developer/admin dashboard featuring data visualization, system monitoring, and a clean modern UI built with Angular and TypeScript.",
        "technologies": ["angular", "typescript", "tailwindcss"],
        "github_link": "https://github.com/EliaGiolli/zenith-dashboard-angular",
        "demo_link": "https://zenith-dashboard-angular.vercel.app/",
        "tech_stack": TechStack.frontend
    },
    {
        "id": 9,
        "project_name": "VeggieVibes",
        "img_path": "",
        "description": "VeggieVibes is a modern application that fetches the data from the Spoonacular API and navigates through various internal pages with react-router v6",
        "technologies": ["react", "typescript", "tailwindcss"],
        "github_link": "https://github.com/EliaGiolli/veggievibes-react",
        "demo_link": "https://veggievibes-react.vercel.app/",
        "tech_stack": TechStack.frontend
    },
];

/**
 * The tech names correspond to the SVG icon filenames in assets/icons/.
 * Fill in github_link values with the actual GitHub repo URLs before deploying.
 *
 * `summary`, `highlights`, `role` and `year` are optional long-form fields rendered
 * by the detail page. Only NexCoin (id 1) has them so far, as a worked example — the
 * other eight are waiting on real write-ups. A project without them renders exactly
 * as it did before.
 *
 * Adding or removing an entry here also means editing public/sitemap.xml by hand, and
 * any field change must be mirrored in BOTH shared/types/projects.ts and
 * core/schemas/projectsSchema.ts.
 */
