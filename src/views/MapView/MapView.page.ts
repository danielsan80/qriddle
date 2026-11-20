import { fireEvent, screen } from '@testing-library/react';

export class MapViewPage {
  get prefillSlider(): HTMLInputElement {
    return screen.getByRole('slider', { name: 'Hints' });
  }

  get prefillValue(): HTMLElement {
    return screen.getByTestId('prefill-value');
  }

  movePrefillSlider(percentage: number): void {
    fireEvent.input(this.prefillSlider, {
      target: { value: String(percentage) },
    });
  }

  releasePrefillSlider(percentage: number): void {
    this.movePrefillSlider(percentage);
    fireEvent.change(this.prefillSlider, {
      target: { value: String(percentage) },
    });
  }
}
