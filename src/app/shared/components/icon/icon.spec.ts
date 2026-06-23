/**
 * Unit tests for IconComponent.
 *
 * WHY this file matters: IconComponent is the most widely reused component in the app —
 * it appears in Navbar, Footer, Card, Homepage, CV, and project detail pages. Every usage
 * falls into one of two categories:
 *
 *  1. Informational icon — the image carries meaning (e.g. a GitHub logo next to a link).
 *     Screen readers must read the icon's purpose, so `alt` must be non-empty and
 *     `aria-hidden` must NOT be set.
 *
 *  2. Decorative icon — the image is visual only (e.g. a chevron beside labelled text).
 *     Screen readers should skip it entirely, so `alt` must be "" and
 *     `aria-hidden="true"` must be set.
 *
 * Getting this wrong has direct accessibility consequences. We therefore test the
 * accessibility attributes first-class, not as an afterthought.
 *
 * Strategy: mount the real component and inspect the rendered <img> element. The `name`
 * input is required (signal input), so setInput() is called in beforeEach before the
 * first detectChanges().
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconComponent } from './icon';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    // 'name' is a required signal input — it must be set before detectChanges()
    // or the component will throw a "required input not set" error.
    fixture.componentRef.setInput('name', 'angular');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── src ────────────────────────────────────────────────────────────────────────────
  // The src is constructed dynamically from the icon name. If the path convention
  // changes (e.g. assets/icons/ → icons/) all icons break. These tests lock in the
  // expected convention so any such change is caught immediately.
  describe('src', () => {

    it('renders an img whose src is built from the icon name', () => {
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('src')).toBe('assets/icons/angular.svg');
    });

    // Verifies reactivity: changing the `name` input AFTER initial render must update
    // the src attribute. This matters when the same icon slot renders different icons
    // depending on data (e.g. project technology list).
    it('updates src when the name input changes', () => {
      fixture.componentRef.setInput('name', 'react');
      fixture.detectChanges();
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('src')).toBe('assets/icons/react.svg');
    });
  });

  // ─── size ───────────────────────────────────────────────────────────────────────────
  // Size is applied as inline style in pixels. We check both width and height to ensure
  // the square constraint is always enforced (no stretched/squished icons).
  describe('size', () => {

    it('defaults to 24px', () => {
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.style.width).toBe('24px');
      expect(img.style.height).toBe('24px');
    });

    it('applies a custom size', () => {
      fixture.componentRef.setInput('size', 48);
      fixture.detectChanges();
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.style.width).toBe('48px');
      expect(img.style.height).toBe('48px');
    });
  });

  // ─── accessibility ──────────────────────────────────────────────────────────────────
  // These tests are the most important in this suite: they verify the two-mode
  // accessibility contract described in the file header.
  describe('accessibility', () => {

    // Informational path (default): alt is auto-generated as "{name} icon" when no
    // explicit alt and decorative is false. This gives screen readers a usable label.
    it('generates alt text from the icon name when not decorative', () => {
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('alt')).toBe('angular icon');
    });

    // When the caller knows a better description (e.g. "GitHub repository") the explicit
    // alt must take priority over the auto-generated one.
    it('uses the explicit alt text when provided', () => {
      fixture.componentRef.setInput('alt', 'Angular framework logo');
      fixture.detectChanges();
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('alt')).toBe('Angular framework logo');
    });

    // Decorative path: BOTH attributes must change together. An aria-hidden icon with a
    // non-empty alt would still be read by some screen readers. An icon with alt="" but
    // no aria-hidden might still appear in the accessibility tree depending on the AT.
    it('sets aria-hidden="true" and empty alt when decorative', () => {
      fixture.componentRef.setInput('decorative', true);
      fixture.detectChanges();
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('aria-hidden')).toBe('true');
      expect(img.getAttribute('alt')).toBe('');
    });

    // aria-hidden must be ABSENT (not "false") when the icon is not decorative.
    // aria-hidden="false" is still processed incorrectly by some screen readers;
    // the correct approach is to not set the attribute at all.
    it('does not set aria-hidden when not decorative', () => {
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('aria-hidden')).toBeNull();
    });
  });
});
