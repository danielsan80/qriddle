import { screen } from '@testing-library/react';

export class MobileBlockPage {
  get isShown() {
    return screen.queryByRole('dialog', { name: 'Desktop only' }) !== null;
  }
}
