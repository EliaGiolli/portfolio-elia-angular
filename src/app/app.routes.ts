import { Routes } from '@angular/router';
import { MainLayoutComponent } from './features/main-layout/main-layout';

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
        path: 'projects',
        loadComponent: () => import('./features/projects/projects-layout/projects-layout').then(m => m.ProjectsLayout),
        children: [
          // Qui il path vuoto '' indica cosa mostrare di default (es. le due cards FE/BE)
          // Se invece le due cards devono sparire quando entri nella grid, 
          // gestisci la logica con uno @if nel template del layout o con rotte separate.
          {
            path: 'frontend', // URL: /projects/frontend
            loadComponent: () => import('./features/projects/projects-grid/projects-grid').then(m => m.ProjectsGrid)
          },
          {
            path: 'backend', // URL: /projects/backend
            loadComponent: () => import('./features/projects/projects-grid/projects-grid').then(m => m.ProjectsGrid)
          }
        ]
      },
      {
        path: 'contacts',
        loadComponent: () => import('./features/about/contacts/contacts').then(m => m.Contacts)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];