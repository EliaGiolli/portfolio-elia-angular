import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Card } from '../../../shared/components/card/card';
import { Button } from '../../../shared/components/button/button';
import { IconComponent } from '../../../shared/components/icon/icon';
import { ProjectService } from '../../../core/services/project-service.service';
import { ProjectsTypes } from '../../../shared/types/projects';

@Component({
  selector: 'app-projects-component',
  standalone: true,
  imports: [
    Card, 
    IconComponent, 
    Button,
    RouterLink
  ],
  templateUrl: './projects-component.html',
  styleUrl: './projects-component.css',
})
export class ProjectsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public projectService = inject(ProjectService);

  public project = signal<ProjectsTypes | undefined>(undefined);

  ngOnInit(): void {
    // 1. The id is retrived form the URL (es: /projects/frontend/1)
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // 2. we search for the service in our mock data
      const foundProject = this.projectService.projects().find(p => p.id === +id);
      
      if (foundProject) {
        this.project.set(foundProject);
      } else {
        this.router.navigate(['/404']);
      }
    }
  }
}