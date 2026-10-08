import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

const MAX_SIDE = 64;

function pngSize(path: string) {
  const png = readFileSync(path);
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

describe('favicon', () => {
  it('is small enough for the browser to decode again at every URL change', () => {
    const { width, height } = pngSize('public/favicon.png');

    expect(Math.max(width, height)).toBeLessThanOrEqual(MAX_SIDE);
  });
});
