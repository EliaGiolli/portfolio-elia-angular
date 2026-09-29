import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { z } from 'zod';

import { projects } from './projects.model';
import { ProjectsSchema } from '../schemas/projectsSchema';
import { TECH_ICONS } from '../../shared/types/techMeta';

const iconExists = (slug: string): boolean =>
  existsSync(join(process.cwd(), 'src/assets/icons/tech', `${slug}.svg`));

describe('projects.model', () => {
  // ProjectService swallows a parse failure and falls back to an empty list, so a
  // malformed entry would empty the whole projects section instead of throwing.
  it('passes the Zod schema every project is validated against at startup', () => {
    expect(() => z.array(ProjectsSchema).parse(projects)).not.toThrow();
  });

  it('has unique ids', () => {
    const ids = projects.map((p) => p.id);

    expect(ids).toEqual([...new Set(ids)]);
  });

  // A slug with no matching file renders as a broken image and throws nothing.
  describe('every tech slug resolves to an icon', () => {
    it('in technologies', () => {
      const missing = projects.flatMap((p) =>
        p.technologies.filter((t) => !iconExists(t)).map((t) => `${p.project_name}: ${t}`),
      );

      expect(missing).toEqual([]);
    });

    it('in technologies_detail', () => {
      const missing = projects.flatMap((p) =>
        (p.technologies_detail ?? [])
          .filter((t) => !iconExists(t))
          .map((t) => `${p.project_name}: ${t}`),
      );

      expect(missing).toEqual([]);
    });

    it('in core_tech', () => {
      const missing = projects
        .filter((p) => p.core_tech && !iconExists(p.core_tech))
        .map((p) => `${p.project_name}: ${p.core_tech}`);

      expect(missing).toEqual([]);
    });

    it('and every one of them is registered as a tech icon', () => {
      const unregistered = projects.flatMap((p) =>
        [...p.technologies, ...(p.technologies_detail ?? []), p.core_tech ?? '']
          .filter((t) => t && !TECH_ICONS.has(t))
          .map((t) => `${p.project_name}: ${t}`),
      );

      expect(unregistered).toEqual([]);
    });
  });

  describe('case-study content', () => {
    it('is filled in for every project', () => {
      const bare = projects
        .filter((p) => !p.summary?.length || !p.highlights?.length)
        .map((p) => p.project_name);

      expect(bare).toEqual([]);
    });

    it('gives every project a cover technology', () => {
      expect(projects.filter((p) => !p.core_tech)).toEqual([]);
    });

    // ProjectsComponent feeds description straight into SeoService as
    // `p.description.slice(0, 155)`, which cuts mid-word. Keeping them within the
    // limit means the meta description is a whole sentence rather than "…visualisa".
    it('keeps descriptions within the 155 chars the SEO service slices to', () => {
      const tooLong = projects
        .filter((p) => p.description.length > 155)
        .map((p) => `${p.project_name} (${p.description.length})`);

      expect(tooLong).toEqual([]);
    });
  });

  // The homepage "Selected work" section is laid out for exactly three rows, and
  // `order` is what places them, so two featured projects must not share one.
  it('features three projects, each with a distinct order within its stack', () => {
    const featured = projects.filter((p) => p.featured);
    const slots = featured.map((p) => `${p.tech_stack}:${p.order}`);

    expect(featured).toHaveLength(3);
    expect(featured.every((p) => p.order !== undefined)).toBe(true);
    expect(slots).toEqual([...new Set(slots)]);
  });

  // public/sitemap.xml is maintained by hand, so this is what catches a project
  // added without its URL, or a removed one whose URL is left behind as a 404.
  it('lists exactly the project detail URLs in the sitemap', () => {
    const sitemap = readFileSync(join(process.cwd(), 'public/sitemap.xml'), 'utf8');
    const listed = [...sitemap.matchAll(/\/projects\/(\w+)\/(\d+)<\/loc>/g)]
      .map(([, stack, id]) => `${stack}/${id}`)
      .sort();
    const expected = projects.map((p) => `${p.tech_stack}/${p.id}`).sort();

    expect(listed).toEqual(expected);
  });

  describe('links', () => {
    it('gives every project a GitHub link', () => {
      expect(projects.filter((p) => !p.github_link).map((p) => p.project_name)).toEqual([]);
    });

    // The detail page builds the cross-link URL from the target's stack and id, so a
    // dangling id would link straight to the 404 page.
    it('points every related link at another existing project', () => {
      const byId = new Map(projects.map((p) => [p.id, p]));
      const dangling = projects
        .filter((p) => p.related && (!byId.has(p.related.id) || p.related.id === p.id))
        .map((p) => `${p.project_name} -> ${p.related!.id}`);

      expect(dangling).toEqual([]);
    });

    // demoStatus() lets a demo link win over runs_locally, so both set at once would
    // hide the "no demo" callout while the no_demo_reason sits unused.
    it('gives local-only projects a reason and no demo link', () => {
      const bad = projects
        .filter((p) => p.runs_locally && (p.demo_link || !p.no_demo_reason))
        .map((p) => p.project_name);

      expect(bad).toEqual([]);
    });

    it('uses absolute https URLs', () => {
      const bad = projects
        .flatMap((p) => [p.github_link, p.demo_link])
        .filter((url) => url && !url.startsWith('https://'));

      expect(bad).toEqual([]);
    });
  });
});
