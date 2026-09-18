import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AboutComponent } from './about-me';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const el = (): HTMLElement => fixture.nativeElement;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('landmarks', () => {
    it('declares no <main> of its own — MainLayoutComponent owns the only one', () => {
      expect(el().querySelector('main')).toBeNull();
    });

    it('declares no top-level <footer>, which would rival the site contentinfo', () => {
      // app-card renders its own <footer class="card-footer"> internally; those are
      // scoped to their <article> and are fine. A page-level one is not.
      const pageFooters = Array.from(el().querySelectorAll('footer')).filter(
        (f) => !f.classList.contains('card-footer'),
      );

      expect(pageFooters).toEqual([]);
    });

    it('gives every <section> an accessible name', () => {
      const unnamed = Array.from(el().querySelectorAll('section')).filter(
        (s) => !s.hasAttribute('aria-labelledby') && !s.hasAttribute('aria-label'),
      );

      expect(unnamed).toEqual([]);
    });

    it('points every aria-labelledby at an element that exists', () => {
      const dangling = Array.from(el().querySelectorAll('[aria-labelledby]'))
        .map((n) => n.getAttribute('aria-labelledby')!)
        .filter((id) => el().querySelector(`#${id}`) === null);

      expect(dangling).toEqual([]);
    });
  });

  describe('lead image', () => {
    const img = () => el().querySelector('img') as HTMLImageElement;

    it('is eager and high priority, since it is the likely LCP element', () => {
      expect(img().getAttribute('loading')).toBe('eager');
      expect(img().getAttribute('fetchpriority')).toBe('high');
    });

    it('declares the 4:5 ratio the CSS actually renders, so no layout shift', () => {
      const w = Number(img().getAttribute('width'));
      const h = Number(img().getAttribute('height'));

      expect(w / h).toBeCloseTo(4 / 5, 5);
    });
  });

  it('does not repeat a card heading as the card aria-label', () => {
    const duplicated = Array.from(el().querySelectorAll('[aria-label]')).filter((node) => {
      const heading = node.querySelector('h2, h3');
      return heading?.textContent?.trim() === node.getAttribute('aria-label')?.trim();
    });

    expect(duplicated).toEqual([]);
  });
});
