import { existsSync } from 'node:fs';
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

  describe('links', () => {
    it('gives every project a GitHub link', () => {
      expect(projects.filter((p) => !p.github_link).map((p) => p.project_name)).toEqual([]);
    });

    it('uses absolute https URLs', () => {
      const bad = projects
        .flatMap((p) => [p.github_link, p.demo_link])
        .filter((url) => url && !url.startsWith('https://'));

      expect(bad).toEqual([]);
    });
  });
});
