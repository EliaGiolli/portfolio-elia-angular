import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Button } from './button';

@Component({
  standalone: true,
  imports: [Button],
  template: `
    <app-button [href]="href" [download]="download">
      <span class="projected">Download my CV</span>
    </app-button>
  `,
})
class HostComponent {
  href: string | undefined = undefined;
  download: string | undefined = undefined;
}

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const anchor = () => fixture.nativeElement.querySelector('a') as HTMLAnchorElement | null;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a <button> when no href is given', async () => {
    await fixture.whenStable();

    expect(anchor()).toBeNull();
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });

  describe('with an href', () => {
    it('opens external links in a new tab with noopener', async () => {
      fixture.componentRef.setInput('href', 'https://github.com/EliaGiolli');
      await fixture.whenStable();

      const a = anchor()!;
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
      // No download attribute at all, rather than an empty one.
      expect(a.hasAttribute('download')).toBe(false);
    });

    it('drops target/rel when download is set, so the tab does not flash open and shut', async () => {
      fixture.componentRef.setInput('href', '/Elia_Giolli_CV_Angular_Developer.pdf');
      fixture.componentRef.setInput('download', '');
      await fixture.whenStable();

      const a = anchor()!;
      expect(a.hasAttribute('download')).toBe(true);
      expect(a.getAttribute('download')).toBe('');
      expect(a.getAttribute('target')).toBeNull();
      expect(a.getAttribute('rel')).toBeNull();
    });

    it('passes a non-empty download through as the saved filename', async () => {
      fixture.componentRef.setInput('href', '/some-file.pdf');
      fixture.componentRef.setInput('download', 'Renamed.pdf');
      await fixture.whenStable();

      expect(anchor()!.getAttribute('download')).toBe('Renamed.pdf');
    });
  });

  describe('with a link (internal navigation)', () => {
    it('renders a real <a> with the router href, not a <button>', async () => {
      fixture.componentRef.setInput('link', '/projects');
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('button')).toBeNull();
      const a = anchor()!;
      expect(a.getAttribute('href')).toBe('/projects');
      // Internal links stay in the same tab.
      expect(a.getAttribute('target')).toBeNull();
    });

    it('adds the fragment and query params to the href', async () => {
      fixture.componentRef.setInput('link', '/');
      fixture.componentRef.setInput('fragment', 'contact');
      await fixture.whenStable();
      expect(anchor()!.getAttribute('href')).toBe('/#contact');

      fixture.componentRef.setInput('link', ['/projects', 'backend']);
      fixture.componentRef.setInput('fragment', undefined);
      fixture.componentRef.setInput('queryParams', { tech: 'nestjs' });
      await fixture.whenStable();
      expect(anchor()!.getAttribute('href')).toBe('/projects/backend?tech=nestjs');
    });

    it('wins over href when both are given', async () => {
      fixture.componentRef.setInput('link', '/about');
      fixture.componentRef.setInput('href', 'https://example.com');
      await fixture.whenStable();

      expect(anchor()!.getAttribute('href')).toBe('/about');
    });
  });

  // The host is a generic element, so a name on it would be ignored: it must land
  // on whichever control actually renders.
  describe('ariaLabel', () => {
    it('names the inner <button>, not the host', async () => {
      fixture.componentRef.setInput('ariaLabel', 'Open menu');
      await fixture.whenStable();

      const host = fixture.nativeElement as HTMLElement;
      expect(host.querySelector('button')!.getAttribute('aria-label')).toBe('Open menu');
      expect(host.hasAttribute('aria-label')).toBe(false);
    });

    it('names the inner <a> for href and link buttons', async () => {
      fixture.componentRef.setInput('ariaLabel', 'GitHub');
      fixture.componentRef.setInput('href', 'https://github.com/EliaGiolli');
      await fixture.whenStable();
      expect(anchor()!.getAttribute('aria-label')).toBe('GitHub');

      fixture.componentRef.setInput('href', undefined);
      fixture.componentRef.setInput('link', '/');
      await fixture.whenStable();
      expect(anchor()!.getAttribute('aria-label')).toBe('GitHub');
    });

    it('is absent when not given, so visible text stays the name', async () => {
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('button').hasAttribute('aria-label')).toBe(false);
    });
  });

  describe('variant and size', () => {
    it('reflects both on host classes for the stylesheet', async () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList).toContain('btn-primary');
      expect(host.classList).not.toContain('btn-sm');

      fixture.componentRef.setInput('variant', 'icon');
      fixture.componentRef.setInput('size', 'sm');
      await fixture.whenStable();

      expect(host.classList).toContain('btn-icon');
      expect(host.classList).not.toContain('btn-primary');
      expect(host.classList).toContain('btn-sm');
    });
  });

  // Regression: the template used to carry one <ng-content> per @if branch. Angular
  // resolves projection statically, so the anchor branch rendered empty — every
  // href-based button was a bare <a></a> with no label and no icon.
  describe('content projection across both branches', () => {
    let host: ComponentFixture<HostComponent>;

    beforeEach(async () => {
      host = TestBed.createComponent(HostComponent);
    });

    it('projects into the <button> branch', async () => {
      await host.whenStable();

      const btn = host.nativeElement.querySelector('button') as HTMLElement;
      expect(btn.querySelector('.projected')).toBeTruthy();
      expect(btn.textContent).toContain('Download my CV');
    });

    it('projects into the <a> branch too', async () => {
      host.componentInstance.href = '/Elia_Giolli_CV_Angular_Developer.pdf';
      host.componentInstance.download = '';
      await host.whenStable();

      const a = host.nativeElement.querySelector('a') as HTMLAnchorElement;
      expect(a).toBeTruthy();
      expect(a.querySelector('.projected')).toBeTruthy();
      expect(a.textContent).toContain('Download my CV');
    });
  });
});
