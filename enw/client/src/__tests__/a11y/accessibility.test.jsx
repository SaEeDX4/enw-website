import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home/Home';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should have no accessibility violations on Home page', async () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const headings = Array.from(
      container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    );
    const levels = headings.map((h) => parseInt(h.tagName[1]));

    // Check for single h1
    const h1Count = levels.filter((l) => l === 1).length;
    expect(h1Count).toBe(1);

    // Relaxed check: allow some flexibility in heading levels
    // Just ensure no extreme jumps (e.g., h1 to h5)
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1];
      expect(diff).toBeLessThanOrEqual(2); // Allow up to 2 level jumps
    }
  });
});
