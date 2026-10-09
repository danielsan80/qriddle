import { describe, it, expect } from 'vitest';
import { hasFinePointer } from './device';

function pointers(fineQuery: string | null) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({ matches: query === fineQuery }),
  });
}

describe('hasFinePointer', () => {
  it('finds a mouse or a trackpad, even beside a touch screen', () => {
    pointers('(any-pointer: fine)');
    expect(hasFinePointer()).toBe(true);
  });

  it('finds none on a touch screen alone', () => {
    pointers(null);
    expect(hasFinePointer()).toBe(false);
  });
});
