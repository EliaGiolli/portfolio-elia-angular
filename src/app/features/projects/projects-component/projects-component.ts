import { Component, computed, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Card } from '../../../shared/components/card/card';
import { Button } from '../../../shared/components/button/button';
import { IconComponent } from '../../../shared/components/icon/icon';
import { ProjectService } from '../../../core/services/project-service.service';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-projects-component',
  standalone: true,
  imports: [Card, IconComponent, Button, RouterLink],
  templateUrl: './projects-component.html',
  styleUrl: './projects-component.css',
})
export class ProjectsComponent {
  private router = inject(Router);
  private seo = inject(SeoService);
  projectService = inject(ProjectService);

  // Route param :id is bound automatically via withComponentInputBinding()
  id = input<string>('');

  project = computed(() => {
    const numId = Number(this.id());
    if (!numId) return undefined;
    return this.projectService.projects().find(p => p.id === numId);
  });

  constructor() {
    effect(() => {
      if (this.id() && this.project() === undefined) {
        this.router.navigate(['/404'], { skipLocationChange: true });
      }
    });

    effect(() => {
      const p = this.project();
      if (!p) return;
      this.seo.update({
        title: `${p.project_name} | ${p.tech_stack} Project — Elia Giolli`,
        description: p.description.slice(0, 155),
        path: `/projects/${p.tech_stack.toLowerCase()}/${p.id}`
      });
    });
  }
}
