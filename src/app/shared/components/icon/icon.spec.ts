import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from './icon';
import { TECH_ICONS, iconFolder, techLabel } from '../../types/techMeta';

const ICONS_DIR = join(process.cwd(), 'src/assets/icons');

const namesIn = (folder: string): string[] =>
  readdirSync(join(ICONS_DIR, folder))
    .filter((f) => f.endsWith('.svg'))
    .map((f) => f.replace(/\.svg$/, ''))
    .sort();

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'github');
    await fixture.whenStable();
  });

  const img = () => fixture.nativeElement.querySelector('img') as HTMLImageElement;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('folder resolution', () => {
    it('loads a tech icon from tech/', async () => {
      fixture.componentRef.setInput('name', 'angular');
      await fixture.whenStable();

      expect(img().getAttribute('src')).toBe('assets/icons/tech/angular.svg');
    });

    it('loads everything else from miscellaneous/', async () => {
      fixture.componentRef.setInput('name', 'arrow-left');
      await fixture.whenStable();

      expect(img().getAttribute('src')).toBe('assets/icons/miscellaneous/arrow-left.svg');
    });

    it('normalises case and stray whitespace', async () => {
      fixture.componentRef.setInput('name', '  Angular ');
      await fixture.whenStable();

      expect(img().getAttribute('src')).toBe('assets/icons/tech/angular.svg');
    });
  });

  describe('sizing and chrome', () => {
    it('applies `size` to the glyph itself, not to a padded box around it', async () => {
      fixture.componentRef.setInput('size', 20);
      await fixture.whenStable();

      expect(img().style.width).toBe('20px');
      expect(img().style.height).toBe('20px');
    });

    it('draws no chip unless asked', () => {
      expect(fixture.nativeElement.classList.contains('is-badge')).toBe(false);
    });

    it('draws the chip on the host, so it grows around the glyph', async () => {
      fixture.componentRef.setInput('badge', '');
      await fixture.whenStable();

      expect(fixture.nativeElement.classList.contains('is-badge')).toBe(true);
    });
  });

  describe('tone', () => {
    const glyph = () => fixture.nativeElement.querySelector('.glyph--mask') as HTMLElement;

    it('renders brand marks as an <img> so they keep their own colours', () => {
      expect(img()).toBeTruthy();
      expect(glyph()).toBeNull();
    });

    it('masks UI glyphs so they inherit the surrounding text colour', async () => {
      fixture.componentRef.setInput('name', 'arrow-left');
      fixture.componentRef.setInput('tone', 'current');
      await fixture.whenStable();

      expect(img()).toBeNull();
      // Root-relative: a mask url() in a style attribute ignores <base href>, so a
      // bare `assets/...` would 404 on a nested route like /projects/frontend/2.
      expect(glyph().style.maskImage).toBe('url("/assets/icons/miscellaneous/arrow-left.svg")');
    });
  });

  // A name in the wrong folder resolves to a URL that 404s. The browser shows a
  // broken image and nothing throws, so only comparing against the real directories
  // catches it.
  describe('TECH_ICONS matches what is on disk', () => {
    it('lists every file in tech/ and nothing more', () => {
      expect([...TECH_ICONS].sort()).toEqual(namesIn('tech'));
    });

    it('claims no file that actually lives in miscellaneous/', () => {
      const misplaced = namesIn('miscellaneous').filter((n) => TECH_ICONS.has(n));

      expect(misplaced).toEqual([]);
    });

    it('resolves every icon on disk to the folder it is really in', () => {
      const wrong = [
        ...namesIn('tech').map((n) => ({ n, want: 'tech' })),
        ...namesIn('miscellaneous').map((n) => ({ n, want: 'miscellaneous' })),
      ].filter(({ n, want }) => iconFolder(n) !== want);

      expect(wrong).toEqual([]);
    });
  });

  describe('techLabel', () => {
    it('maps awkward slugs to readable names', () => {
      expect(techLabel('nextdotjs')).toBe('Next.js');
      expect(techLabel('openapiinitiative')).toBe('OpenAPI');
      expect(techLabel('reactivex')).toBe('RxJS');
    });

    it('falls back to the slug when there is no mapping', () => {
      expect(techLabel('some-unmapped-slug')).toBe('some-unmapped-slug');
    });
  });
});
