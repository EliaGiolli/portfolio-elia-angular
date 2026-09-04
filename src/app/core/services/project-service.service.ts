// core/services/project.service.ts
import { computed, Injectable, signal } from '@angular/core';
import { ProjectsSchema, Project } from '../schemas/projectsSchema';
import { projects } from '../models/projects.model'; 
import { ProjectsTypes, TechStack } from '../../shared/types/projects';
import { z } from 'zod'

@Injectable({ providedIn: 'root' })
export class ProjectService {

  private readonly _projects = signal<ProjectsTypes[]>(this.validateProjects(projects));
  
  projects = this._projects.asReadonly();
  // Filters
  selectedStack = signal<TechStack | null>(null);
  activeTags = signal<string[]>([]);

  private validateProjects(data: any[]): ProjectsTypes[] {
    try {
      return z.array(ProjectsSchema).parse(data);
    } catch (error) {
      console.error('Errore validazione progetti:', error);
      return [];
    }
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