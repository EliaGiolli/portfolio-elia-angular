import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static pages: prerendered to HTML at build time.
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'projects', renderMode: RenderMode.Prerender },
  { path: 'projects/frontend', renderMode: RenderMode.Prerender },
  { path: 'projects/backend', renderMode: RenderMode.Prerender },
  { path: 'cv', renderMode: RenderMode.Prerender },
  { path: 'contacts', renderMode: RenderMode.Prerender },

  // Dynamic + error routes: rendered per request.
  { path: 'projects/frontend/:id', renderMode: RenderMode.Server },
  { path: 'projects/backend/:id', renderMode: RenderMode.Server },
  { path: '404', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];

/**
 * Server Routing Configuration
 *
 * - Routes are matched in declaration order, so every specific rule must come
 *   BEFORE the '**' wildcard. Listing the wildcard first shadows the ':id'
 *   entries and denies them the Server render mode they ask for.
 *
 * - The wildcard is Server, not Prerender, and this is load-bearing. Under
 *   Prerender, an unknown URL has no prerendered file to serve, so the engine
 *   falls back to the client-side-render shell (index.csr.html) with HTTP 200 —
 *   NotFound then renders only in the browser. That is a soft 404: crawlers see
 *   a 200 and index the error page. Rendering the wildcard on the server lets
 *   NotFound flag the request (REQUEST_CONTEXT) so server.ts can answer 404.
 *
 * - Static pages are therefore listed one by one to keep them prerendered;
 *   relying on '**' to cover them would drop all 7 back to per-request SSR.
 *   Adding a static route to app.routes.ts means adding it here too.
 *
 * - Project detail routes use SSR to handle dynamic parameters without needing
 *   'getPrerenderParams'.
 */
