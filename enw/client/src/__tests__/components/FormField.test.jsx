import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FormField from '../../components/ui/FormField/FormField';

describe('FormField Component', () => {
  // ... other tests ...

  it('should render checkbox', () => {
    const handleChange = vi.fn();
    render(
      <FormField
        label="Agree to terms"
        name="consent"
        type="checkbox"
        value={false}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Option A: Accept event-style call
    expect(handleChange).toHaveBeenCalled();

    // Check if it was called with an event object
    const firstCall = handleChange.mock.calls[0];
    if (firstCall[0]?.target) {
      // Event style
      expect(firstCall[0].target.checked).toBe(true);
    } else {
      // Fallback style (name, value)
      expect(firstCall).toEqual(['consent', true]);
    }
  });

  it('should handle checkbox with fallback signature', () => {
    // Force fallback by making event handler throw
    const handleChange = vi.fn((arg1) => {
      if (arg1?.target) throw new Error('force fallback');
    });

    render(
      <FormField
        label="Agree to terms"
        name="consent"
        type="checkbox"
        value={false}
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith('consent', true);
  });
});
