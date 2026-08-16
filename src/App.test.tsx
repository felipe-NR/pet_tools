import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';
import { APP_TITLE } from './copy/appShell';

describe('App', () => {
  it('renders the tool title from the copy layer', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(APP_TITLE);
  });
});
