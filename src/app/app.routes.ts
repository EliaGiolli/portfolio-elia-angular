import { Routes } from '@angular/router';
import { MainLayoutComponent } from './features/main-layout/main-layout';
import { TechStack } from './shared/types/projects';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/homepage/homepage').then(m => m.Homepage)
  },
  {
    path: '',
    component: MainLayoutComponent, 
    children: [
      {
        // Landing page for projects (shows the two choice cards)
        path: 'projects',
        loadComponent: () => import('./features/projects/projects-layout/projects-layout').then(m => m.ProjectsLayout),
      },
      {
        // Separate routes for the filtered grids. These are siblings
        // of the landing route so the cards aren't rendered together
        // with the grid (no visual nesting).
        path: 'projects/frontend',
        loadComponent: () => import('./features/projects/projects-grid/projects-grid').then(m => m.ProjectsGrid),
        data: { stack: TechStack.frontend }
      },
      {
        path: 'projects/backend',
        loadComponent: () => import('./features/projects/projects-grid/projects-grid').then(m => m.ProjectsGrid),
        data: { stack: TechStack.backend }
      },
      {
        path: 'contacts',
        loadComponent: () => import('./features/about/contacts/contacts').then(m => m.Contacts)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];