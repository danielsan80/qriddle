import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useWizard } from './useWizard';

describe('useWizard', () => {
  it('throws when used outside WizardProvider', () => {
    expect(() => renderHook(() => useWizard())).toThrow(
      'useWizard must be used within WizardProvider',
    );
  });
});
