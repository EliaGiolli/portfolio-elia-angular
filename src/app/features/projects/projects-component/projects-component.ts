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

  // Utilizziamo un signal per gestire il progetto trovato in modo reattivo
  public project = signal<ProjectsTypes | undefined>(undefined);

  ngOnInit(): void {
    // 1. Recuperiamo l'id dall'URL (es: /projects/frontend/1)
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // 2. Cerchiamo il progetto nel service o direttamente dal mock
      // Convertiamo 'id' in numero con il +
      const foundProject = this.projectService.projects().find(p => p.id === +id);
      
      if (foundProject) {
        this.project.set(foundProject);
      } else {
        // Se l'ID non esiste, mandiamo l'utente alla pagina 404
        this.router.navigate(['/404']);
      }
    }
  }
}