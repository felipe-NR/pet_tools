// Registers the jest-dom matchers (toBeInTheDocument, toHaveAccessibleName, ...)
// and their type augmentation for Vitest.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
