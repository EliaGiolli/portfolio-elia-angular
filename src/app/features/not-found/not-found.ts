import { Component, REQUEST_CONTEXT, inject } from '@angular/core';
import { Button } from "../../shared/components/button/button";
import { IconComponent } from "../../shared/components/icon/icon";
import { RouterLink } from "@angular/router";
import { SeoService } from '../../core/services/seo.service';

/** Shape of the per-request object server.ts hands to the Angular app engine. */
interface SsrRequestContext {
  notFound?: boolean;
}

@Component({
  selector: 'app-not-found',
  imports: [Button, IconComponent, RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private seo = inject(SeoService);
  // Null in the browser; during SSR it is the context passed to angularApp.handle().
  private requestContext = inject<SsrRequestContext | null>(REQUEST_CONTEXT, { optional: true });

  constructor() {
    this.seo.update({
      title: 'Page not found | Elia Giolli',
      description: 'The page you are looking for does not exist or has been moved.'
    });

    // Tells the Express layer to send HTTP 404 instead of 200 for this render,
    // so crawlers see a real not-found rather than a soft 404.
    if (this.requestContext) {
      this.requestContext.notFound = true;
    }
  }
}
