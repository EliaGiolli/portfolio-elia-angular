import { Routes } from '@angular/router';
import { MainLayoutComponent } from './features/main-layout/main-layout';
import { Cv } from './features/cv/cv';
import { NotFound } from './features/not-found/not-found';
import { TechStack } from './shared/types/projects';
import { RenderMode } from '@angular/ssr';

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
      // Projects Grid
      {
        path: 'projects/frontend',
        loadComponent: () => import('./features/projects/projects-grid/projects-grid').then(m => m.ProjectsGrid),
        data: { stack: TechStack.frontend }
      },
      {
        path: 'projects/backend',
        loadComponent: () => import('./features/projects/projects-grid/projects-grid').then(m => m.ProjectsGrid),
        data: { stack: TechStack.backend }
      },
      //Routes with dynamic segment for the projects' details
      {
        path: 'projects/frontend/:id',
        loadComponent: () => import('./features/projects/projects-component/projects-component').then(m => m.ProjectsComponent),
      },
      {
        path: 'projects/backend/:id',
        loadComponent: () => import('./features/projects/projects-component/projects-component').then(m => m.ProjectsComponent),
      },
      {
        path: 'cv',
        component: Cv
      },
      // Contacts page
      {
        path: 'contacts',
        loadComponent: () => import('./features/about/contacts/contacts').then(m => m.Contacts)
      }
    ]
  },
  { path: '**', component: NotFound }
];