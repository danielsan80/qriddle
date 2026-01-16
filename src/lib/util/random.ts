export type RandomFn = () => number;

const SEED_LENGTH = 10;
const SEED_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function generateSeed(): string {
  let seed = '';
  for (let i = 0; i < SEED_LENGTH; i++) {
    seed += SEED_CHARS[Math.floor(Math.random() * SEED_CHARS.length)];
  }
  return seed;
}

export function createRandom(seed: string): RandomFn {
  return mulberry32(hashString(seed));
}

export function createFakeRandom(values: number[]): RandomFn {
  let index = 0;
  return () => {
    const value = values[index % values.length];
    index++;
    return value;
  };
}

export function mulberry32(seed: number): RandomFn {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return hash;
}
