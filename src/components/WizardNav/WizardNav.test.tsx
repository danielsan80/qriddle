import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { WizardNav } from './WizardNav';
import { WIZARD_STEPS } from './steps';

const first = WIZARD_STEPS[0];
const last = WIZARD_STEPS[WIZARD_STEPS.length - 1];
const middle = WIZARD_STEPS[2];

describe('WizardNav', () => {
  it('renders all step labels', () => {
    render(<WizardNav step={middle.step} onStep={vi.fn()} />);
    const stepButtons = screen
      .getAllByRole('button')
      .filter((b) => !b.getAttribute('aria-label'));
    expect(stepButtons.map((b) => b.textContent)).toEqual([
      'Map',
      'Front',
      'Center',
      'Back',
      'Download',
    ]);
  });

  it('marks past and future steps via data-state', () => {
    render(<WizardNav step={middle.step} onStep={vi.fn()} />);
    expect(
      screen
        .getAllByRole('listitem')
        .map((el) => (el as HTMLElement).dataset.state),
    ).toEqual(['past', 'past', 'past', 'future', 'future']);
  });

  it('marks current step with aria-current', () => {
    render(<WizardNav step={middle.step} onStep={vi.fn()} />);
    expect(
      screen
        .getAllByRole('listitem')
        .map((el) => el.getAttribute('aria-current')),
    ).toEqual([null, null, 'step', null, null]);
  });

  it('shows next button on non-last current step', () => {
    render(<WizardNav step={middle.step} onStep={vi.fn()} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDefined();
  });

  it('hides next button on last step', () => {
    render(<WizardNav step={last.step} onStep={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /next/i })).toBeNull();
  });

  it('calls onStep with next step on next click', async () => {
    const onStep = vi.fn();
    render(<WizardNav step={middle.step} onStep={onStep} />);
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onStep).toHaveBeenCalledWith(WIZARD_STEPS[3].step);
  });

  it('calls onStep when clicking a step label', async () => {
    const onStep = vi.fn();
    render(<WizardNav step={middle.step} onStep={onStep} />);
    await userEvent.click(screen.getByRole('button', { name: 'Map' }));
    expect(onStep).toHaveBeenCalledWith(first.step);
  });
});
