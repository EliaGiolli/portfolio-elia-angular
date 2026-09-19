import { Component, computed, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Card } from '../../../shared/components/card/card';
import { Button } from '../../../shared/components/button/button';
import { IconComponent } from '../../../shared/components/icon/icon';
import { ProjectService } from '../../../core/services/project-service.service';
import { SeoService } from '../../../core/services/seo.service';
import { techLabel } from '../../../shared/types/techMeta';

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

  /**
   * The detail page shows the full stack; `technologies` is only the headline set
   * the grid card renders. Falls back to it for a project with no detailed list.
   */
  detailTechnologies = computed(() => {
    const p = this.project();
    if (!p) return [];
    return (p.technologies_detail ?? p.technologies).map(t => t.toLowerCase().trim());
  });

  /** Simple Icons slugs read badly raw — 'nextdotjs', 'openapiinitiative'. */
  protected label = techLabel;

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
