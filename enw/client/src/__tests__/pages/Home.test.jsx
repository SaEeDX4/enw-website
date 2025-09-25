import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home/Home';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Page', () => {
  beforeEach(() => {
    renderWithRouter(<Home />);
  });

  it('should render hero section with title', () => {
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent(
      'Connecting Neighbors, Caring for Our Elderly'
    );
  });

  it('should render CTA buttons with correct URLs', () => {
    // Check for actual button/link text and href
    const supportButton = screen.getByRole('link', { name: /get support/i });
    const volunteerButton = screen.getByRole('link', {
      name: /become a volunteer/i,
    });

    // Fixed: Use actual URLs from your app
    expect(supportButton).toHaveAttribute('href', '/seniors');
    expect(volunteerButton).toHaveAttribute('href', '/volunteers');
  });

  it('should have single h1 element', () => {
    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements).toHaveLength(1);
  });
});
