// core/seo.config.ts

/** Absolute origin of the deployed site, with no trailing slash. */
export const SITE_ORIGIN = 'https://portfolio-elia-angular.vercel.app';

export const SITE_NAME = 'Elia Giolli — Portfolio';
export const SITE_AUTHOR = 'Elia Giolli';

/** Social preview image, resolved against SITE_ORIGIN. */
export const SITE_IMAGE = '/logo.svg';

/** Builds an absolute URL from a root-relative route path. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
