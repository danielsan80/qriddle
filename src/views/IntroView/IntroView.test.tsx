import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WizardContext } from '../../context/WizardContext';
import { isMobileDevice } from '../../lib/browser/device';
import { IntroView } from './IntroView';
import { IntroPage } from './IntroView.page';

vi.mock('../../lib/browser/device', () => ({ isMobileDevice: vi.fn() }));

const SEND_YOURSELF_THE_LINK =
  'Puzzles are made on a computer. Send yourself the link:';

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
  return { introPage: new IntroPage(), setStep };
}

describe('IntroView', () => {
  beforeEach(() => {
    vi.mocked(isMobileDevice).mockReturnValue(false);
  });

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
    const { introPage } = renderIntro();

    await introPage.heroBanner.clickHowItWorks();

    expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({
      behavior: 'smooth',
    });
    expect(scrollIntoView.mock.contexts).toEqual([
      introPage.howItWorksSection.element,
    ]);
    expect(window.location.hash).toBe('');
  });

  it('starts the puzzle again at the end of how it works', async () => {
    const { introPage, setStep } = renderIntro();

    await introPage.howItWorksSection.clickCreateYourPuzzle();

    expect(setStep).toHaveBeenCalledExactlyOnceWith('inner.map');
  });

  it('on a computer, offers to create the puzzle in the hero and at the end of how it works', () => {
    const { introPage } = renderIntro();

    expect(introPage.heroBanner.createYourPuzzleButton).toBeInTheDocument();
    expect(
      introPage.howItWorksSection.createYourPuzzleButton,
    ).toBeInTheDocument();
  });

  it('on a phone, asks to send the link to a computer instead of creating the puzzle', () => {
    vi.mocked(isMobileDevice).mockReturnValue(true);
    const { introPage } = renderIntro();

    expect(introPage.heroBanner.createYourPuzzleButton).toBeNull();
    expect(introPage.heroBanner.element).toHaveTextContent(
      SEND_YOURSELF_THE_LINK,
    );
    expect(introPage.howItWorksSection.createYourPuzzleButton).toBeNull();
    expect(introPage.howItWorksSection.element).toHaveTextContent(
      SEND_YOURSELF_THE_LINK,
    );
  });
});
