import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { profile } from './profile.model';
import { ProfileSchema } from '../schemas/profileSchema';

/** Every string value in a nested object, with the path it was found at. */
function strings(value: unknown, path = 'profile'): [string, string][] {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  }
  return [];
}

describe('profile.model', () => {
  it('passes the Zod schema', () => {
    expect(() => ProfileSchema.parse(profile)).not.toThrow();
  });

  it('tags experience rows with registered tech icons', () => {
    const missing = profile.experience
      .flatMap((e) => e.tags ?? [])
      .filter((t) => !existsSync(join(process.cwd(), 'src/assets/icons/tech', `${t}.svg`)));

    expect(missing).toEqual([]);
  });

  // TODO(Elia): fill in [AVAILABILITY], [YEAR], [COMPANY] and [LANGUAGES] in
  // profile.model.ts, then remove `.skip`. This must pass before the homepage launches.
  it.skip('has no [PLACEHOLDER] values left', () => {
    const left = strings(profile)
      .filter(([, v]) => v.includes('['))
      .map(([path, v]) => `${path}: ${v}`);

    expect(left).toEqual([]);
  });
});
