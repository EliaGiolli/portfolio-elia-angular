import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TechStack } from '../../../shared/types/projects';
import { Button } from '../../../shared/components/button/button';
import { Card } from '../../../shared/components/card/card';
import { IconComponent } from '../../../shared/components/icon/icon';
import { ProjectService } from '../../../core/services/project-service.service';
import { TooltipDirective } from '../../../core/directives/tooltip.directive';

@Component({
  selector: 'app-projects-grid',
  imports: [Button, Card, IconComponent, TooltipDirective],
  templateUrl: './projects-grid.html',
  styleUrl: './projects-grid.css',
})
export class ProjectsGrid implements OnInit {
  readonly TechStack = TechStack;
  readonly frontendFilters = ['Angular', 'React', 'TypeScript', 'Next.js'];
  readonly backendFilters = ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'];

  constructor(
    private route: ActivatedRoute, 
    public projectService: ProjectService, // Public per usarlo nel template
    private location: Location
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.projectService.selectedStack.set(data['stack'] ?? null);
      this.projectService.activeTags.set([]);
    });
  }

  goBack() { this.location.back(); }
}