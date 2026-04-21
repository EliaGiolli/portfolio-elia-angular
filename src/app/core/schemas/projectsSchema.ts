// core/schemas/projects.schema.ts
import { z } from 'zod';
import { TechStack } from '../../shared/types/projects'; 

export const ProjectsSchema = z.object({
  id: z.number(),
  project_name: z.string().min(1),
  img_path: z.string().default(''), 
  description: z.string().min(1),
  technologies: z.array(z.string()),
  demo_link: z.string().url().or(z.literal('')).default(''),
  tech_stack: z.nativeEnum(TechStack) 
});

export type Project = z.infer<typeof ProjectsSchema>;