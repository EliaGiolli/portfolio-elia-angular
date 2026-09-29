import { z } from 'zod';

/**
 * Personal content for the homepage: availability, experience rows, the "How I
 * build" principles, languages and contact details.
 *
 * Unlike ProjectsSchema there is no hand-written twin interface: `Profile` is
 * inferred from the schema, so the two cannot drift.
 */
export const ExperienceSchema = z.object({
  /** Free text so it can read "2024 – present". */
  period: z.string().min(1),
  role: z.string().min(1),
  org: z.string().min(1),
  summary: z.string().min(1),
  /** Tech slugs, shown as tags. Each must name a file in src/assets/icons/tech/. */
  tags: z.array(z.string().min(1)).default([]),
});

export const PrincipleSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export const ProfileSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  /** The line next to the availability dot. */
  availability: z.string().min(1),
  email: z.email(),
  socials: z.object({
    github: z.url(),
    linkedin: z.url(),
  }),
  experience: z.array(ExperienceSchema).min(1),
  /** Rendered in order as `> 01`, `> 02`, … so the number is not stored. */
  method: z.array(PrincipleSchema).length(4),
  languages: z.array(z.string().min(1)).min(1),
});

export type Experience = z.infer<typeof ExperienceSchema>;
export type Principle = z.infer<typeof PrincipleSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
