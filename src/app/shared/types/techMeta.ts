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
  css: 'CSS',
  html5: 'HTML5',
  javascript: 'JavaScript',
  jsonwebtokens: 'JWT',
  nextdotjs: 'Next.js',
  nodedotjs: 'Node.js',
  openapiinitiative: 'OpenAPI',
  radixui: 'Radix UI',
  reacthookform: 'React Hook Form',
  reactquery: 'TanStack Query',
  reactrouter: 'React Router',
  reactivex: 'RxJS',
  shadcnui: 'shadcn/ui',
  sqlite: 'SQLite',
  tailwindcss: 'Tailwind CSS',
  typeorm: 'TypeORM',
  typescript: 'TypeScript',
  vuedotjs: 'Vue.js',
};

/** Human-readable name for a tech slug, falling back to the slug itself. */
export function techLabel(slug: string): string {
  const key = slug.toLowerCase().trim();
  return TECH_LABELS[key] ?? key;
}

/** Folder an icon lives in, relative to `assets/icons/`. */
export function iconFolder(name: string): 'tech' | 'miscellaneous' {
  return TECH_ICONS.has(name.toLowerCase().trim()) ? 'tech' : 'miscellaneous';
}
