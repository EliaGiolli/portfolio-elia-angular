import { projects } from '../../core/models/projects.model';
import { DEFAULT_TECH_BRAND, TECH_BRAND, techBrand } from './techMeta';

/** WCAG 2.x contrast ratio between two #RRGGBB colours. */
function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const [r, g, bl] = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('techMeta: cover-band brand colours', () => {
  it('computes contrast correctly (sanity check on the helper)', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrast('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });

  // The band carries the tech label and the year as text, so AA for normal text applies.
  it.each(Object.entries({ ...TECH_BRAND, default: DEFAULT_TECH_BRAND }))(
    '%s reaches 4.5:1 between its text and background',
    (_slug, { bg, fg }) => {
      expect(contrast(bg, fg)).toBeGreaterThanOrEqual(4.5);
    },
  );

  // A project whose core tech has no entry would silently get the neutral band.
  it('has an entry for every core_tech used in the project data', () => {
    const missing = projects
      .map((p) => p.core_tech)
      .filter((slug): slug is string => !!slug && !(slug in TECH_BRAND));

    expect(missing).toEqual([]);
  });

  describe('techBrand()', () => {
    it('returns the brand pair for a known slug, ignoring case and whitespace', () => {
      expect(techBrand(' NestJS ')).toEqual(TECH_BRAND['nestjs']);
    });

    it('falls back to the neutral band for unknown or missing slugs', () => {
      expect(techBrand('cobol')).toEqual(DEFAULT_TECH_BRAND);
      expect(techBrand(undefined)).toEqual(DEFAULT_TECH_BRAND);
      expect(techBrand('')).toEqual(DEFAULT_TECH_BRAND);
    });
  });
});
