
export enum TechStack {
    "frontend" = "frontend",
    "backend" = "backend",
    "full-stack" = "full-stack",
    "angular" = "angular"
}

export interface ProjectsTypes {
    id: number,
    project_name: string,
    img_path: string,
    description: string,
    technologies: string[],
    github_link: string,
    demo_link: string,
    tech_stack: TechStack
}