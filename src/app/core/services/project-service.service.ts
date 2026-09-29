// core/services/project.service.ts
import { computed, Injectable, signal } from '@angular/core';
import { ProjectsSchema } from '../schemas/projectsSchema';
import { projects } from '../models/projects.model';
import { ProjectsTypes, TechStack } from '../../shared/types/projects';
import { techLabel } from '../../shared/types/techMeta';
import { z } from 'zod'

/**
 * `default` is backend first (see compareDefault), `newest` is by year, `name` is A–Z.
 * These are also the values of the `sort` query param on /projects.
 */
export type ProjectSort = 'default' | 'newest' | 'name';

/** What /projects filters by. Every field is optional: an empty object means "all". */
export interface ProjectCriteria {
  /** `null` or absent means every stack. */
  stack?: TechStack | null;
  /** Tech slugs. A project matches if it uses ANY of them. */
  tech?: readonly string[];
  /** Free text, matched case-insensitively against name, description and tech names. */
  q?: string;
  sort?: ProjectSort;
}

/** `live`: has a demo link. `local`: runs only on your own machine. `code`: repo only. */
export type DemoStatus = 'live' | 'local' | 'code';

export type StackCounts = Record<'all' | TechStack, number>;

/** Backend first, which is the whole point of the default order. */
const STACK_RANK: Record<TechStack, number> = {
  [TechStack.backend]: 0,
  [TechStack['full-stack']]: 1,
  [TechStack.frontend]: 2,
};

/** Tie-break for projects without an `order`. Anything unlisted ranks after these. */
const CORE_TECH_RANK = ['nestjs', 'express', 'angular', 'react', 'nextdotjs', 'astro'];

const coreRank = (p: ProjectsTypes): number => {
  const i = CORE_TECH_RANK.indexOf(p.core_tech ?? '');
  return i === -1 ? CORE_TECH_RANK.length : i;
};

/** Stack, then `order` (unordered last), then core tech, then newest first. */
function compareDefault(a: ProjectsTypes, b: ProjectsTypes): number {
  return (
    STACK_RANK[a.tech_stack] - STACK_RANK[b.tech_stack] ||
    (a.order ?? Infinity) - (b.order ?? Infinity) ||
    coreRank(a) - coreRank(b) ||
    (b.year ?? 0) - (a.year ?? 0) ||
    a.id - b.id
  );
}

const COMPARATORS: Record<ProjectSort, (a: ProjectsTypes, b: ProjectsTypes) => number> = {
  default: compareDefault,
  newest: (a, b) => (b.year ?? 0) - (a.year ?? 0) || compareDefault(a, b),
  name: (a, b) => a.project_name.localeCompare(b.project_name, 'en', { sensitivity: 'base' }),
};

/** Lower-cased text a search query is matched against. */
const haystack = (p: ProjectsTypes): string =>
  [p.project_name, p.description, ...p.technologies.flatMap((t) => [t, techLabel(t)])]
    .join(' ')
    .toLowerCase();

@Injectable({ providedIn: 'root' })
export class ProjectService {

  private readonly _projects = signal<ProjectsTypes[]>(this.validateProjects(projects));

  projects = this._projects.asReadonly();

  // Filters. Superseded by filterProjects() + URL state; removed in Phase 5 along
  // with ProjectsGrid, which is their last reader.
  selectedStack = signal<TechStack | null>(null);
  activeTags = signal<string[]>([]);

  /** The homepage "Selected work" rows, in the default (backend-first) order. */
  readonly featuredProjects = computed(() =>
    this._projects().filter((p) => p.featured).sort(compareDefault),
  );

  /**
   * Every slug in `technologies`, most used first, then A–Z. These are the filter
   * chips, so it reads `technologies` (the set filterProjects matches), not
   * `technologies_detail`.
   */
  readonly allTechnologies = computed(() => {
    const counts = new Map<string, number>();
    for (const p of this._projects()) {
      for (const t of p.technologies) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort(([a, na], [b, nb]) => nb - na || a.localeCompare(b))
      .map(([t]) => t);
  });

  /** For the segmented control: how many projects each stack option would show. */
  readonly countsByStack = computed<StackCounts>(() => {
    const counts: StackCounts = {
      all: 0,
      [TechStack.backend]: 0,
      [TechStack.frontend]: 0,
      [TechStack['full-stack']]: 0,
    };
    for (const p of this._projects()) {
      counts.all++;
      counts[p.tech_stack]++;
    }
    return counts;
  });

  private validateProjects(data: any[]): ProjectsTypes[] {
    try {
      return z.array(ProjectsSchema).parse(data);
    } catch (error) {
      console.error('Errore validazione progetti:', error);
      return [];
    }
  }

  /**
   * The projects matching `criteria`, sorted. Pure: it holds no filter state, so
   * the caller owns it (on /projects, in the URL). Reads `_projects`, so calling it
   * inside a `computed` tracks the data as well as the criteria.
   */
  filterProjects({ stack, tech = [], q = '', sort = 'default' }: ProjectCriteria = {}): ProjectsTypes[] {
    const wanted = new Set(tech.map((t) => t.toLowerCase()));
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);

    return this._projects()
      .filter((p) => !stack || p.tech_stack === stack)
      .filter((p) => !wanted.size || p.technologies.some((t) => wanted.has(t.toLowerCase())))
      .filter((p) => {
        if (!terms.length) return true;
        const text = haystack(p);
        return terms.every((term) => text.includes(term));
      })
      .sort(COMPARATORS[sort]);
  }

  /** Derived, never stored: a demo link wins, then `runs_locally`, else code only. */
  demoStatus(p: Pick<ProjectsTypes, 'demo_link' | 'runs_locally'>): DemoStatus {
    if (p.demo_link) return 'live';
    return p.runs_locally ? 'local' : 'code';
  }

  // Filtering logic
  filteredProjects = computed(() => {
    const stack = this.selectedStack();
    const tags = this.activeTags().map(t => t.toLowerCase());

    let list = this._projects();

    if (stack) {
      list = list.filter(p => p.tech_stack === stack);
    }

    if (tags.length > 0) {
      list = list.filter(p =>
        p.technologies.some(tech => tags.includes(tech.toLowerCase()))
      );
    }

    return list;
  });

  toggleTag(tag: string) {
    this.activeTags.update(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }
}
