import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button } from './button';

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
});
