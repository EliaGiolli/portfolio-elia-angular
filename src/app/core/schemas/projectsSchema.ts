// core/schemas/projects.schema.ts
import { z } from 'zod';
import { TechStack } from '../../shared/types/projects'; 

export const ProjectsSchema = z.object({
  id: z.number(),
  project_name: z.string().min(1),
  img_path: z.string().default(''),
  description: z.string().min(1),
  technologies: z.array(z.string()),
  github_link: z.string().url().or(z.literal('')).default(''),
  demo_link: z.string().url().or(z.literal('')).default(''),
  tech_stack: z.nativeEnum(TechStack),

  // Long-form case-study fields. Optional so the existing entries stay valid and
  // content can be filled in one project at a time. Mirror any change here in
  // ProjectsTypes (shared/types/projects.ts) — they are not unified.
  summary: z.array(z.string().min(1)).optional(),
  highlights: z.array(z.string().min(1)).optional(),
  role: z.string().min(1).optional(),
  year: z.number().int().optional(),
});

export type Project = z.infer<typeof ProjectsSchema>;
