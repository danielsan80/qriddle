import { describe, it, expect } from 'vitest';
import { encode, decode } from './urlState';

describe('encode / decode', () => {
  it('roundtrips a simple object', () => {
    const state = { seed: 'abc123', qrText: 'hello' };

    expect(decode(encode(state), null)).toEqual(state);
  });

  it('roundtrips nested structures', () => {
    const state = {
      seed: 'xyz',
      textboxes: {
        front: [{ text: 'Buon compleanno', x: 10, y: 20 }],
        center: [],
      },
    };

    expect(decode(encode(state), null)).toEqual(state);
  });

  it('returns fallback for empty string', () => {
    expect(decode('', { seed: 'default' })).toEqual({ seed: 'default' });
  });

  it('returns fallback for corrupted input', () => {
    expect(decode('!!!notvalid!!!', { seed: 'default' })).toEqual({
      seed: 'default',
    });
  });

  it('returns fallback for valid base string that is not JSON', () => {
    const notJson = encode('just a string' as unknown as object);

    expect(decode(notJson, { seed: 'default' })).toEqual('just a string');
  });

  it('produces a URL-safe string', () => {
    const encoded = encode({
      seed: 'abc',
      qrText: 'https://example.com?x=1&y=2',
    });

    expect(encoded).toMatch(/^[A-Za-z0-9\-_.~]*$/);
  });
});
