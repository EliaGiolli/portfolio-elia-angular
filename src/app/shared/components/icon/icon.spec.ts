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
      expect(techLabel('prisma')).toBe('prisma');
    });
  });
});
