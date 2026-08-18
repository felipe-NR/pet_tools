import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const workflow: string = readFileSync('.github/workflows/ci-and-deploy.yml', 'utf8');

describe('Pages deployment workflow', () => {
  it('allows the Pages action more than its ten-minute polling window', () => {
    expect(workflow).toMatch(/deploy:\n(?:.*\n)*? {4}timeout-minutes: 15\n/);
  });
});
