import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projects/frontend/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'projects/backend/:id',
    renderMode: RenderMode.Server
  },
];

/**
 * Server Routing Configuration (Angular 19):
 * - Project detail routes use server-side rendering (SSR) 
 * to handle dynamic parameters without the need for ‘getPrerenderParams’.
 * - The wildcard route (**) retains Prerender to optimize the performance of static pages.
 */