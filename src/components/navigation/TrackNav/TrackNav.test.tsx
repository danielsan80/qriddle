import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TrackNav } from './TrackNav';
import { STEPS } from '../../../context/steps';

const first = STEPS[0];
const last = STEPS[STEPS.length - 1];
const middle = STEPS[2];

describe('TrackNav', () => {
  it('renders all step labels', () => {
    render(<TrackNav step={middle} onStep={vi.fn()} />);
    const stepButtons = screen
      .getAllByRole('button')
      .filter((b) => !b.getAttribute('aria-label'));
    expect(stepButtons.map((b) => b.textContent)).toEqual([
      'Intro',
      'Map',
      'Front',
      'Center',
      'Back',
      'Download',
    ]);
  });

  it('marks past and future steps via data-state', () => {
    render(<TrackNav step={middle} onStep={vi.fn()} />);
    expect(
      screen
        .getAllByRole('listitem')
        .map((el) => (el as HTMLElement).dataset.state),
    ).toEqual(['past', 'past', 'past', 'future', 'future', 'future']);
  });

  it('marks current step with aria-current', () => {
    render(<TrackNav step={middle} onStep={vi.fn()} />);
    expect(
      screen
        .getAllByRole('listitem')
        .map((el) => el.getAttribute('aria-current')),
    ).toEqual([null, null, 'step', null, null, null]);
  });

  it('shows next button on non-last current step', () => {
    render(<TrackNav step={middle} onStep={vi.fn()} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDefined();
  });

  it('hides next button on last step', () => {
    render(<TrackNav step={last} onStep={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /next/i })).toBeNull();
  });

  it('calls onStep with next step on next click', async () => {
    const onStep = vi.fn();
    render(<TrackNav step={middle} onStep={onStep} />);
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onStep).toHaveBeenCalledWith(STEPS[3]);
  });

  it('calls onStep when clicking a step label', async () => {
    const onStep = vi.fn();
    render(<TrackNav step={middle} onStep={onStep} />);
    await userEvent.click(screen.getByRole('button', { name: 'Intro' }));
    expect(onStep).toHaveBeenCalledWith(first);
  });
});
