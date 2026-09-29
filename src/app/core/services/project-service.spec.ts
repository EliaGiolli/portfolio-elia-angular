import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project-service.service';
import { ProjectsTypes, TechStack } from '../../shared/types/projects';

/** A minimal valid project; tests override only what they are about. */
const make = (overrides: Partial<ProjectsTypes> & Pick<ProjectsTypes, 'id'>): ProjectsTypes => ({
  project_name: `Project ${overrides.id}`,
  description: 'A project.',
  img_path: '',
  technologies: ['typescript'],
  github_link: 'https://github.com/x/y',
  demo_link: '',
  tech_stack: TechStack.frontend,
  ...overrides,
});

const ids = (list: ProjectsTypes[]) => list.map((p) => p.id);

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // These run against the real projects.model data, so they state invariants
  // rather than exact lists and keep passing as projects are added.
  describe('with the real project data', () => {
    const stackOf = (p: ProjectsTypes) => p.tech_stack;

    it('puts every backend project before any frontend one by default', () => {
      const stacks = service.filterProjects().map(stackOf);
      const lastBackend = stacks.lastIndexOf(TechStack.backend);
      const firstFrontend = stacks.indexOf(TechStack.frontend);

      expect(lastBackend).toBeGreaterThanOrEqual(0);
      expect(lastBackend).toBeLessThan(firstFrontend);
    });

    it('returns every project with no criteria', () => {
      expect(service.filterProjects()).toHaveLength(service.projects().length);
    });

    it('filters by stack', () => {
      for (const stack of [TechStack.backend, TechStack.frontend]) {
        const list = service.filterProjects({ stack });

        expect(list.length).toBeGreaterThan(0);
        expect(list.every((p) => p.tech_stack === stack)).toBe(true);
      }
    });

    it('counts projects per stack, matching what each filter returns', () => {
      const counts = service.countsByStack();

      expect(counts.all).toBe(service.projects().length);
      expect(counts.backend).toBe(service.filterProjects({ stack: TechStack.backend }).length);
      expect(counts.frontend).toBe(service.filterProjects({ stack: TechStack.frontend }).length);
      expect(counts.backend + counts.frontend + counts['full-stack']).toBe(counts.all);
    });

    it('lists the featured projects backend first', () => {
      const featured = service.featuredProjects();

      expect(featured.map((p) => p.project_name)).toEqual([
        'Bookgraph - NestJS',
        'Performonitoring — API',
        'Zenith Dashboard',
      ]);
    });

    it('offers only technologies that some project uses, most used first', () => {
      const all = service.allTechnologies();
      const uses = (t: string) =>
        service.projects().filter((p) => p.technologies.includes(t)).length;

      expect(all).toContain('nestjs');
      expect(new Set(all).size).toBe(all.length);
      expect(all.every((t) => uses(t) > 0)).toBe(true);
      for (let i = 1; i < all.length; i++) {
        expect(uses(all[i - 1])).toBeGreaterThanOrEqual(uses(all[i]));
      }
    });
  });

  // Fixture data, so sort and match rules are pinned independently of content.
  describe('filterProjects rules', () => {
    beforeEach(() => {
      service['_projects'].set([
        make({ id: 1, tech_stack: TechStack.frontend, core_tech: 'react', year: 2026, project_name: 'Alpha', technologies: ['react', 'typescript'] }),
        make({ id: 2, tech_stack: TechStack.backend, core_tech: 'express', year: 2025, project_name: 'Bravo', technologies: ['express', 'mongodb'], description: 'JWT auth server.' }),
        make({ id: 3, tech_stack: TechStack.frontend, core_tech: 'angular', year: 2024, order: 1, project_name: 'Charlie', technologies: ['angular', 'typescript'] }),
        make({ id: 4, tech_stack: TechStack.backend, core_tech: 'nestjs', year: 2024, project_name: 'Delta', technologies: ['nestjs', 'postgresql'] }),
        make({ id: 5, tech_stack: TechStack.frontend, core_tech: 'nextdotjs', year: 2026, project_name: 'echo', technologies: ['nextdotjs'] }),
        make({ id: 6, tech_stack: TechStack.backend, core_tech: 'express', year: 2026, order: 1, project_name: 'Foxtrot', technologies: ['express', 'prisma'] }),
      ]);
    });

    describe('default sort', () => {
      it('orders by stack, then order, then core tech, then newest', () => {
        // Backend: Foxtrot has an order; then nestjs outranks express.
        // Frontend: Charlie has an order; then angular > react > nextdotjs.
        expect(ids(service.filterProjects())).toEqual([6, 4, 2, 3, 1, 5]);
      });

      it('breaks core-tech ties by year, newest first', () => {
        service['_projects'].update((list) => [
          ...list,
          make({ id: 7, tech_stack: TechStack.backend, core_tech: 'express', year: 2026, technologies: ['express'] }),
        ]);

        expect(ids(service.filterProjects({ stack: TechStack.backend }))).toEqual([6, 4, 7, 2]);
      });
    });

    it('sorts by newest, falling back to the default order within a year', () => {
      expect(ids(service.filterProjects({ sort: 'newest' }))).toEqual([6, 1, 5, 2, 4, 3]);
    });

    it('sorts by name, ignoring case', () => {
      expect(ids(service.filterProjects({ sort: 'name' }))).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('matches ANY of the selected technologies, case-insensitively', () => {
      expect(ids(service.filterProjects({ tech: ['typescript'] }))).toEqual([3, 1]);
      expect(ids(service.filterProjects({ tech: ['NestJS', 'prisma'] }))).toEqual([6, 4]);
    });

    it('searches name, description and tech display names', () => {
      expect(ids(service.filterProjects({ q: 'delta' }))).toEqual([4]);
      expect(ids(service.filterProjects({ q: 'jwt' }))).toEqual([2]);
      // techLabel('nextdotjs') is 'Next.js'.
      expect(ids(service.filterProjects({ q: 'Next.js' }))).toEqual([5]);
    });

    it('requires every search word to match', () => {
      expect(ids(service.filterProjects({ q: 'express mongodb' }))).toEqual([2]);
    });

    it('ignores a blank search', () => {
      expect(service.filterProjects({ q: '   ' })).toHaveLength(6);
    });

    it('combines stack, tech, search and sort', () => {
      const list = service.filterProjects({
        stack: TechStack.backend,
        tech: ['express', 'nestjs'],
        q: 'ex',
        sort: 'name',
      });

      // Delta (4) passes stack and tech but not the search.
      expect(ids(list)).toEqual([2, 6]);
    });

    it('returns an empty list when nothing matches', () => {
      expect(service.filterProjects({ stack: TechStack.backend, tech: ['react'] })).toEqual([]);
    });

    it('does not reorder the underlying data', () => {
      service.filterProjects({ sort: 'name' });

      expect(ids(service.projects())).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('recomputes the derived signals when the data changes', () => {
      expect(service.countsByStack()).toEqual({ all: 6, backend: 3, frontend: 3, 'full-stack': 0 });

      service['_projects'].update((list) => list.slice(0, 2));

      expect(service.countsByStack()).toEqual({ all: 2, backend: 1, frontend: 1, 'full-stack': 0 });
      expect(service.allTechnologies()).toEqual(['express', 'mongodb', 'react', 'typescript']);
    });
  });

  describe('demoStatus', () => {
    it('is live when there is a demo link, even if it also runs locally', () => {
      expect(service.demoStatus({ demo_link: 'https://x.dev', runs_locally: true })).toBe('live');
    });

    it('is local when the project only runs on your machine', () => {
      expect(service.demoStatus({ demo_link: '', runs_locally: true })).toBe('local');
    });

    it('is code otherwise', () => {
      expect(service.demoStatus({ demo_link: '' })).toBe('code');
    });

    it('gives both Performonitoring entries the local status', () => {
      const perf = service.projects().filter((p) => p.project_name.startsWith('Performonitoring'));

      expect(perf).toHaveLength(2);
      expect(perf.map((p) => service.demoStatus(p))).toEqual(['local', 'local']);
    });
  });
});
