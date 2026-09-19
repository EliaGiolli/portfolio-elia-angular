import { Component, computed, effect, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TechStack } from '../../../shared/types/projects';
import { Button } from '../../../shared/components/button/button';
import { Card } from '../../../shared/components/card/card';
import { CardGrid } from '../../../shared/components/card-grid/card-grid';
import { IconComponent } from '../../../shared/components/icon/icon';
import { ProjectService } from '../../../core/services/project-service.service';
import { SeoService } from '../../../core/services/seo.service';
import { TooltipDirective } from '../../../core/directives/tooltip.directive';
import { techLabel } from '../../../shared/types/techMeta';

interface FilterTag {
  label: string;
  value: string;
}

@Component({
  selector: 'app-projects-grid',
  imports: [Button, Card, CardGrid, IconComponent, TooltipDirective, RouterLink],
  templateUrl: './projects-grid.html',
  styleUrl: './projects-grid.css',
})
export class ProjectsGrid {
  readonly TechStack = TechStack;

  /** Simple Icons slugs read badly raw — 'nextdotjs', 'tailwindcss'. */
  protected label = techLabel;

  projectService = inject(ProjectService);
  private location = inject(Location);
  private seo = inject(SeoService);

  // Route data { stack } is bound automatically via withComponentInputBinding()
  stack = input<TechStack | null>(null);

  private readonly frontendTags: FilterTag[] = [
    { label: 'React', value: 'react' },
    { label: 'Next.js', value: 'nextdotjs' },
    { label: 'Angular', value: 'angular' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TailwindCSS', value: 'tailwindcss' },
    { label: 'Astro', value: 'astro' },
  ];

  private readonly backendTags: FilterTag[] = [
    { label: 'Node.js', value: 'nodedotjs' },
    { label: 'Express', value: 'express' },
    { label: 'NestJS', value: 'nestjs' },
    { label: 'MongoDB', value: 'mongodb' },
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'TypeScript', value: 'typescript' },
  ];

  currentTags = computed<FilterTag[]>(() =>
    this.stack() === TechStack.frontend ? this.frontendTags : this.backendTags
  );

  constructor() {
    // Sync service state whenever the stack route data changes
    effect(() => {
      this.projectService.selectedStack.set(this.stack());
      this.projectService.activeTags.set([]);
    });

    // One component serves both /projects/frontend and /projects/backend, so the
    // page metadata has to follow the route data rather than be set once.
    effect(() => {
      const isFrontend = this.stack() === TechStack.frontend;
      this.seo.update({
        title: isFrontend
          ? 'Front-End Projects | Elia Giolli'
          : 'Back-End Projects | Elia Giolli',
        description: isFrontend
          ? 'Front-end projects by Elia Giolli, built with Angular, React, Next.js, Astro and TypeScript. Filter them by technology.'
          : 'Back-end projects by Elia Giolli, built with Node.js, Express, NestJS, MongoDB and PostgreSQL. Filter them by technology.',
        path: isFrontend ? '/projects/frontend' : '/projects/backend'
      });
    });
  }

  isTagActive(tag: FilterTag): boolean {
    return this.projectService.activeTags().includes(tag.value);
  }

  goBack(): void {
    this.location.back();
  }
}
