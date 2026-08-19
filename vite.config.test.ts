import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import viteConfiguration from './vite.config.js';

describe('Vite deployment configuration', () => {
  it('builds asset URLs under the GitHub Pages repository path', () => {
    expect(viteConfiguration).toMatchObject({ base: '/pet_tools/' });
  });

  it('does not expose the public directory in runtime asset URLs', async () => {
    const stylesheetPaths = [
      'src/index.css',
      'src/components/CalculatorForm.module.css',
      'src/components/CalculationResult.module.css',
    ];
    const stylesheets = await Promise.all(stylesheetPaths.map(readStylesheet));

    expect(stylesheets.join('\n')).not.toContain('/public/');
  });
});

function readStylesheet(path: string): Promise<string> {
  return readFile(path, 'utf8');
}
