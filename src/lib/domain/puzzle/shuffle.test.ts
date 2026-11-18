import { describe, it, expect } from 'vitest';
import { createFakeRandom } from '../../util';
import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('keeps the order when every item is swapped with itself', () => {
    expect(shuffle(['a', 'b', 'c'], createFakeRandom([0.99]))).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('swaps each item with the first when the random always picks it', () => {
    expect(shuffle(['a', 'b', 'c'], createFakeRandom([0]))).toEqual([
      'b',
      'c',
      'a',
    ]);
  });

  it('does not mutate the given items', () => {
    const items = ['a', 'b', 'c'];

    shuffle(items, createFakeRandom([0]));

    expect(items).toEqual(['a', 'b', 'c']);
  });
});
