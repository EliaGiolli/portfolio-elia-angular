/**
 * Icon assets live in two folders — `assets/icons/tech/` and
 * `assets/icons/miscellaneous/` — and `app-icon` picks between them by looking a
 * name up in TECH_ICONS.
 *
 * The alternative was a `folder` input on `app-icon`, but `app-card` forwards a
 * mixed bag (`angular` is tech; `brain`, `database`, `github`, `monitor` are not),
 * so that would have meant threading the folder through every call site.
 *
 * icon.spec.ts reads both directories and asserts they match this set exactly. Keep
 * it that way: a name missing here resolves to the wrong folder and fails as a
 * broken <img>, which no unit test would otherwise notice.
 */
export const TECH_ICONS: ReadonlySet<string> = new Set([
  // Languages & markup
  'css',
  'html5',
  'javascript',
  'typescript',
  // Frameworks & runtimes
  'alpinedotjs',
  'angular',
  'astro',
  'express',
  'nestjs',
  'nextdotjs',
  'nodedotjs',
  'react',
  'vuedotjs',
  // Styling & UI kits
  'lucide',
  'radixui',
  'shadcnui',
  'tailwindcss',
  // State, data & forms
  'axios',
  'reacthookform',
  'reactquery',
  'reactrouter',
  'reactivex',
  'zod',
  // Persistence
  'mongodb',
  'mongoose',
  'postgresql',
  'prisma',
  'sqlite',
  'typeorm',
  // Realtime
  'socketdotio',
  // Auth
  'jsonwebtokens',
  'passport',
  // Docs & tooling
  'framer',
  'jasmine',
  'jest',
  'openapiinitiative',
  'swagger',
  'vercel',
  'vite',
]);

/**
 * Display names for slugs that read badly raw. Simple Icons slugs are lowercase and
 * punctuation-free, so `nextdotjs` and `openapiinitiative` would otherwise appear
 * verbatim in tooltips and under the icons on a project page.
 *
 * Only awkward slugs need an entry — `techLabel()` falls back to the slug itself.
 */
const TECH_LABELS: Readonly<Record<string, string>> = {
  alpinedotjs: 'Alpine.js',
  angular: 'Angular',
  astro: 'Astro',
  axios: 'Axios',
  css: 'CSS',
  express: 'Express',
  framer: 'Framer Motion',
  html5: 'HTML5',
  jasmine: 'Jasmine',
  javascript: 'JavaScript',
  jest: 'Jest',
  jsonwebtokens: 'JWT',
  lucide: 'Lucide',
  mongodb: 'MongoDB',
  mongoose: 'Mongoose',
  nestjs: 'NestJS',
  nextdotjs: 'Next.js',
  nodedotjs: 'Node.js',
  openapiinitiative: 'OpenAPI',
  passport: 'Passport',
  postgresql: 'PostgreSQL',
  prisma: 'Prisma',
  radixui: 'Radix UI',
  react: 'React',
  reacthookform: 'React Hook Form',
  reactivex: 'RxJS',
  reactquery: 'TanStack Query',
  reactrouter: 'React Router',
  shadcnui: 'shadcn/ui',
  socketdotio: 'Socket.IO',
  sqlite: 'SQLite',
  swagger: 'Swagger',
  tailwindcss: 'Tailwind CSS',
  typeorm: 'TypeORM',
  typescript: 'TypeScript',
  vercel: 'Vercel',
  vite: 'Vite',
  vuedotjs: 'Vue.js',
  zod: 'Zod',
};

/** Background + text colour of a project's cover band. */
export interface TechBrand {
  bg: string;
  fg: string;
}

/**
 * Cover-band colours for the technologies projects are built around (`core_tech`).
 * The band carries text (a mono tech label and the year), so every pair must reach
 * 4.5:1. techMeta.spec.ts checks the ratio, and checks that every `core_tech` in
 * the project data has an entry here.
 *
 * Brand colours are the official ones. React is the exception: its cyan fails
 * against white, so it uses React's own dark lockup, with the cyan as the text.
 */
export const TECH_BRAND: Readonly<Record<string, TechBrand>> = {
  angular: { bg: '#DD0031', fg: '#FFFFFF' },   // 5.1:1
  astro: { bg: '#17191E', fg: '#FFFFFF' },
  express: { bg: '#303030', fg: '#FFFFFF' },
  nestjs: { bg: '#E0234E', fg: '#FFFFFF' },    // 4.65:1, the tightest pair
  nextdotjs: { bg: '#000000', fg: '#FFFFFF' },
  react: { bg: '#20232A', fg: '#61DAFB' },     // 9.7:1
};

/** Used for any technology without its own entry: the neutral-800 token. */
export const DEFAULT_TECH_BRAND: TechBrand = { bg: '#22262E', fg: '#FFFFFF' };

/** Cover-band colours for a tech slug, falling back to a neutral dark band. */
export function techBrand(slug: string | undefined): TechBrand {
  return (slug && TECH_BRAND[slug.toLowerCase().trim()]) || DEFAULT_TECH_BRAND;
}

/** Human-readable name for a tech slug, falling back to the slug itself. */
export function techLabel(slug: string): string {
  const key = slug.toLowerCase().trim();
  return TECH_LABELS[key] ?? key;
}

/** Folder an icon lives in, relative to `assets/icons/`. */
export function iconFolder(name: string): 'tech' | 'miscellaneous' {
  return TECH_ICONS.has(name.toLowerCase().trim()) ? 'tech' : 'miscellaneous';
}
