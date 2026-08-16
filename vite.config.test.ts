import { describe, expect, it } from 'vitest';
import viteConfiguration from './vite.config.js';

describe('Vite deployment configuration', () => {
  it('builds asset URLs under the GitHub Pages repository path', () => {
    expect(viteConfiguration).toMatchObject({ base: '/pet_tools/' });
  });
});
