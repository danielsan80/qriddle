import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function queryButtonIn(element: HTMLElement, name: string) {
  return within(element).queryByRole('button', { name });
}

function clickButtonIn(element: HTMLElement, name: string) {
  return userEvent.click(within(element).getByRole('button', { name }));
}

class HeroBanner {
  get element() {
    return screen.getByTestId('hero-banner');
  }

  get createYourPuzzleButton() {
    return queryButtonIn(this.element, 'Create your puzzle');
  }

  clickCreateYourPuzzle() {
    return clickButtonIn(this.element, 'Create your puzzle');
  }

  clickHowItWorks() {
    return clickButtonIn(this.element, 'How it works');
  }
}

class HowItWorksSection {
  get element() {
    return screen.getByRole('region', { name: 'How it works' });
  }

  get createYourPuzzleButton() {
    return queryButtonIn(this.element, 'Create your puzzle');
  }

  clickCreateYourPuzzle() {
    return clickButtonIn(this.element, 'Create your puzzle');
  }
}

export class IntroPage {
  readonly heroBanner = new HeroBanner();
  readonly howItWorksSection = new HowItWorksSection();
}
