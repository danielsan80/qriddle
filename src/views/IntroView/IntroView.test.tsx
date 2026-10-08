import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WizardProvider } from '../../context/WizardContext';
import { IntroView } from './IntroView';

function renderIntro() {
  render(
    <WizardProvider>
      <IntroView />
    </WizardProvider>,
  );
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
});
