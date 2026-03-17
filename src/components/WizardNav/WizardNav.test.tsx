import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { WizardNav } from './WizardNav';
import { WIZARD_STEPS } from './steps';

const first = WIZARD_STEPS[0];
const last = WIZARD_STEPS[WIZARD_STEPS.length - 1];
const middle = WIZARD_STEPS[2];

describe('WizardNav', () => {
  it('renders all steps with bullets and inline next on current', () => {
    render(<WizardNav step={middle.step} onStep={vi.fn()} />);
    expect(screen.getAllByRole('listitem').map((el) => el.textContent)).toEqual(
      ['● Mappa', '● Fronte', '● Centro →', '○ Retro', '○ Download'],
    );
  });

  it('marks current step with aria-current', () => {
    render(<WizardNav step={middle.step} onStep={vi.fn()} />);
    const items = screen.getAllByRole('listitem');
    expect(items.map((el) => el.getAttribute('aria-current'))).toEqual([
      null,
      null,
      'step',
      null,
      null,
    ]);
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
    await userEvent.click(screen.getByRole('button', { name: '● Mappa' }));
    expect(onStep).toHaveBeenCalledWith(first.step);
  });
});
