import { describe, it, expect } from 'vitest';
import { createFakeRandom, generateSeed } from './random';

describe('generateSeed', () => {
  it('returns a 10 character string', () => {
    const seed = generateSeed();

    expect(seed).toHaveLength(10);
  });

  it('contains only alphanumeric characters', () => {
    const seed = generateSeed();

    expect(seed).toMatch(/^[a-z0-9]+$/);
  });

  it('generates different seeds on each call', () => {
    const seed1 = generateSeed();
    const seed2 = generateSeed();

    expect(seed1).not.toBe(seed2);
  });
});

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
