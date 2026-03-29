import { fireEvent, render, screen } from '@testing-library/react';
import { CardFaceNav, type Face } from './CardFaceNav';

const faces: Face[] = [
  'inner.map',
  'outer.front',
  'outer.back',
  'outer.center',
];

describe('CardFaceNav', () => {
  it.each(faces)('clicking "%s" calls onSelect with that face', (face) => {
    const onSelect = vi.fn();
    render(<CardFaceNav selected="inner.map" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: face }));
    expect(onSelect).toHaveBeenCalledWith(face);
  });

  it('marks only the selected face as aria-pressed', () => {
    render(<CardFaceNav selected="outer.front" onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'outer.front' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'inner.map' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
