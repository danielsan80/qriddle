import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { WizardContext } from '../../context/WizardContext';
import { IntroView } from './IntroView';

function renderIntro() {
  const setStep = vi.fn();
  render(
    <WizardContext
      value={{
        step: 'intro',
        setStep,
        puzzle: null,
        setPuzzle: vi.fn(),
        work: { qrText: '', seed: '', textBoxes: [] },
        updateWork: vi.fn(),
      }}
    >
      <IntroView />
    </WizardContext>,
  );
  return { setStep };
}

function howItWorksSection() {
  return screen.getByRole('region', { name: 'How it works' });
}

describe('IntroView', () => {
  it('presents the app with its name, payoff and what it does', () => {
    renderIntro();

    expect(
      screen.getByRole('heading', { level: 1, name: 'QRiddle' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Put a treasure into your greeting card'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Write a secret message. Print it as a puzzle. They solve it to read it.',
      ),
    ).toBeInTheDocument();
  });

  it('shows the puzzle being solved next to the presentation', () => {
    renderIntro();

    expect(
      screen.getByRole('img', {
        name: 'A treasure map puzzle being solved with a marker, a QR code emerging',
      }),
    ).toBeInTheDocument();
  });

  it('explains how it works in its own section', () => {
    renderIntro();

    expect(
      screen.getByRole('heading', { level: 2, name: 'How it works' }),
    ).toBeInTheDocument();
  });

  it('scrolls down to how it works, without touching the hash that holds the work', async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    renderIntro();

    await userEvent.click(screen.getByRole('button', { name: 'How it works' }));

    expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({
      behavior: 'smooth',
    });
    expect(scrollIntoView.mock.contexts).toEqual([howItWorksSection()]);
    expect(window.location.hash).toBe('');
  });

  it('starts the puzzle again at the end of how it works', async () => {
    const { setStep } = renderIntro();

    await userEvent.click(
      within(howItWorksSection()).getByRole('button', {
        name: 'Create your puzzle',
      }),
    );

    expect(setStep).toHaveBeenCalledExactlyOnceWith('inner.map');
  });
});
