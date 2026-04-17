
export enum TechStack {
    "frontend" = "frontend",
    "backend" = "backend",
    "full-stack" = "full-stack"
}

export interface ProjectsTypes {
    id: number,
    project_name:string,
    img_path:string,
    description:string,
    technologies: string[],
    demo_link:string,
    tech_stack: TechStack
}