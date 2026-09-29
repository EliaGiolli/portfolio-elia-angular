import { z } from 'zod';

import { ProfileSchema } from '../schemas/profileSchema';

/**
 * DRAFT copy for the backend positioning (see portfolio-refactor/portfolio-redesign.md
 * → Backend positioning). Built only from facts already on the site; Elia reviews it
 * before launch.
 *
 * Values in [SQUARE BRACKETS] are placeholders still to be filled in.
 * profile.model.spec.ts has a skipped test that fails while any are left: un-skip it
 * once they are gone.
 *
 * Typed as the schema's *input* so fields with a default (`tags`) can be left out.
 */
export const profile: z.input<typeof ProfileSchema> = {
  name: 'Elia Giolli',
  location: 'Pisa, Italy',
  availability: '[AVAILABILITY]',
  email: 'eliagiolli22@gmail.com',
  socials: {
    github: 'https://github.com/EliaGiolli',
    linkedin: 'https://linkedin.com/in/eliagiolli',
  },
  experience: [
    {
      period: '[YEAR] – present',
      role: 'Backend developer',
      org: 'Independent projects',
      summary:
        'NestJS and Express APIs over PostgreSQL, SQLite and MongoDB, with validated contracts and generated OpenAPI docs, plus the Angular and React front ends that consume them.',
      tags: ['nestjs', 'express', 'postgresql'],
    },
    {
      period: '[YEAR] – [YEAR]',
      role: 'IT support',
      org: '[COMPANY]',
      summary:
        'Diagnosed network and software incidents on logistics systems under real time pressure; configured workstations and managed networks (TCP/IP, DNS, DHCP, VPN).',
    },
  ],
  method: [
    {
      title: 'Validated at the edges',
      body: 'Every request is checked before a handler sees it: DTOs with class-validator in NestJS, Zod schemas in Express. Handlers get to trust their input.',
    },
    {
      title: 'Clear module boundaries',
      body: 'One module per domain, reaching the others only through what they export, so a feature can change without the rest of the app noticing.',
    },
    {
      title: 'Documented contracts',
      body: 'The OpenAPI spec is generated from the same code that validates requests, so the docs cannot drift from the API.',
    },
    {
      title: 'Failure is designed',
      body: 'Errors go through one layer with a consistent shape, destructive actions need an explicit confirmation, and a failing dependency gets a planned response instead of a stack trace.',
    },
  ],
  languages: ['[LANGUAGES]'],
};
