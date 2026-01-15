import { describe, it, expect } from 'vitest';
import { createFakeRandom } from './random';

describe('createFakeRandom', () => {
  it('returns values in sequence', () => {
    const random = createFakeRandom([0.1, 0.5, 0.9]);

    expect(random()).toBe(0.1);
    expect(random()).toBe(0.5);
    expect(random()).toBe(0.9);
  });

  it('cycles when values are exhausted', () => {
    const random = createFakeRandom([0.2, 0.8]);

    expect(random()).toBe(0.2);
    expect(random()).toBe(0.8);
    expect(random()).toBe(0.2);
    expect(random()).toBe(0.8);
  });

  it('works with single value', () => {
    const random = createFakeRandom([0.5]);

    expect(random()).toBe(0.5);
    expect(random()).toBe(0.5);
    expect(random()).toBe(0.5);
  });
});
