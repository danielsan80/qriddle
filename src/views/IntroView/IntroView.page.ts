import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const CREATE_YOUR_PUZZLE = { name: 'Create your puzzle' };

class HeroBanner {
  get element() {
    return screen.getByTestId('hero-banner');
  }

  clickCreateYourPuzzle() {
    return userEvent.click(
      within(this.element).getByRole('button', CREATE_YOUR_PUZZLE),
    );
  }

  clickHowItWorks() {
    return userEvent.click(
      within(this.element).getByRole('button', { name: 'How it works' }),
    );
  }
}

class HowItWorksSection {
  get element() {
    return screen.getByRole('region', { name: 'How it works' });
  }

  clickCreateYourPuzzle() {
    return userEvent.click(
      within(this.element).getByRole('button', CREATE_YOUR_PUZZLE),
    );
  }
}

export class IntroPage {
  readonly heroBanner = new HeroBanner();
  readonly howItWorksSection = new HowItWorksSection();
}
