// core/services/seo.service.ts
import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_IMAGE, SITE_NAME, absoluteUrl } from '../seo.config';

interface SeoData {
  title: string;
  description: string;
  /** Root-relative route path, e.g. '/about'. Drives canonical + og:url. */
  path?: string;
  /** Root-relative or absolute image URL for social previews. */
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private titleService = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  update({ title, description, path, image }: SeoData) {
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    const imageUrl = absoluteUrl(image ?? SITE_IMAGE);
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });

    if (path !== undefined) {
      const url = absoluteUrl(path);
      this.meta.updateTag({ property: 'og:url', content: url });
      this.setCanonical(url);
    }
  }

  /**
   * Find-or-create, rather than append: navigating between routes must replace the
   * existing canonical rather than stack a second one in the head.
   */
  private setCanonical(url: string) {
    const head = this.document.head;
    if (!head) return;

    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
