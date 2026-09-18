import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

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
