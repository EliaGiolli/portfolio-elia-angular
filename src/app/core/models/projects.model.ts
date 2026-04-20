import { ProjectsTypes, TechStack } from "../../shared/types/projects";

export const projects:ProjectsTypes[] = [
    {
        "id":1,
        "project_name": "NexCoin",
        "img_path": "",
        "description": "A modern, responsive cryptocurrency dashboard built with Next.js 15, TypeScript, TailwindCSS 4, and ShadCN UI components. This project fetches data from the public CoinGecko API",
        "technologies": ["nextjs", "typescript", "tailwindcss", "nodejs", "postgresql"],
        "demo_link": "",
        "tech_stack": TechStack.frontend
    },
    {
        "id":2,
        "project_name": "Taskflow",
        "img_path": "",
        "description": "Taskflow allows users to efficiently create, view, and manage tasks. Tasks can be either static (defined in tasks.js) or dynamic (created by the user through the form)",
        "technologies": ["react", "javascript", "tailwindcss"],
        "demo_link": "",
        "tech_stack": TechStack.frontend
    },
    {
        "id":3,
        "project_name": "Dev Dashboard",
        "img_path": "",
        "description": "A REST API designed to simulate a developer/admin dashboard. It allows to monitor system health, manage logs, and test cryptography",
        "technologies": ["nodejs", "expressjs", "typescript"],
        "demo_link": "",
        "tech_stack": TechStack.backend
    },
    {
        "id":4,
        "project_name": "Shelfspot",
        "img_path": "",
        "description": "ShelfSpot is a modern web application that allows users to explore and manage books through the OpenLibrary AP",
        "technologies": ["react", "typescript", "tailwindcss"],
        "demo_link": "",
        "tech_stack": TechStack.frontend
    },
    {
        "id":5,
        "project_name": "ClockWise",
        "img_path": "",
        "description": "is a front-end web application that simulates a professional dashboard. The purpose is to show a dyamic work table,a presence chart and a time summary",
        "technologies": ["react", "typescript", "tailwindcss"],
        "demo_link": "",
        "tech_stack": TechStack.frontend
    },
    {
        "id":6,
        "project_name": "Authentication Task Management",
        "img_path": "",
        "description": "A robust REST API built with Node.js, Express, TypeScript, and MongoDB that provides JWT-based authentication and comprehensive task management functionality.",
        "technologies": ["nodejs", "expressjs", "typescript", "mongodb"],
        "demo_link": "",
        "tech_stack": TechStack.backend
    },
];