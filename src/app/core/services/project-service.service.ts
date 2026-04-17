// core/services/project.service.ts
import { Injectable, signal } from '@angular/core';
import { ProjectsSchema, Project } from '../schemas/projectsSchema';
import { projects } from '../models/projects.model'; // Rinominiamo per chiarezza
import {z} from 'zod'

@Injectable({ providedIn: 'root' })
export class ProjectService {
  // Inizializziamo il segnale validando i dati mock
  private readonly _projects = signal<Project[]>(this.validateProjects(projects));
  
  // Esponiamo il segnale in sola lettura (best practice)
  projects = this._projects.asReadonly();

  private validateProjects(data: any[]): Project[] {
    try {
      // .parse() valida l'intero array e lancia errore se qualcosa non va
      return z.array(ProjectsSchema).parse(data);
    } catch (error) {
      console.error('Errore validazione progetti:', error);
      return [];
    }
  }
}