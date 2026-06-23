import { Component, computed, effect, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TechStack } from '../../../shared/types/projects';
import { Button } from '../../../shared/components/button/button';
import { Card } from '../../../shared/components/card/card';
import { IconComponent } from '../../../shared/components/icon/icon';
import { ProjectService } from '../../../core/services/project-service.service';
import { TooltipDirective } from '../../../core/directives/tooltip.directive';

interface FilterTag {
  label: string;
  value: string;
}

@Component({
  selector: 'app-projects-grid',
  imports: [Button, Card, IconComponent, TooltipDirective, RouterLink],
  templateUrl: './projects-grid.html',
  styleUrl: './projects-grid.css',
})
export class ProjectsGrid {
  readonly TechStack = TechStack;

  projectService = inject(ProjectService);
  private location = inject(Location);

  // Route data { stack } is bound automatically via withComponentInputBinding()
  stack = input<TechStack | null>(null);

  private readonly frontendTags: FilterTag[] = [
    { label: 'React', value: 'react' },
    { label: 'Next.js', value: 'nextdotjs' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TailwindCSS', value: 'tailwindcss' },
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
  }

  isTagActive(tag: FilterTag): boolean {
    return this.projectService.activeTags().includes(tag.value);
  }

  goBack(): void {
    this.location.back();
  }
}
