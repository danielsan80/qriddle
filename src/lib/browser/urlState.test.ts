import { describe, it, expect, vi, afterEach } from 'vitest';
import { encode, decode, mergeState, type UrlState } from './urlState';

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
    const notJson = encode('just a string' as unknown as UrlState);

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

function lastWrittenState(spy: ReturnType<typeof vi.spyOn>): UrlState | null {
  const [, , url] = spy.mock.calls[0] as [unknown, unknown, string];
  return decode(url.slice(1), null);
}

describe('mergeState', () => {
  afterEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('merges partial state without clobbering other keys', () => {
    window.location.hash = '#' + encode({ qrText: 'hello', seed: 'abc' });
    const spy = vi.spyOn(window.history, 'replaceState');

    mergeState(
      { frontTextBoxes: [{ id: '1', x: 0, y: 0, text: 'hi', fontSize: 8 }] },
      'replace',
    );

    expect(lastWrittenState(spy)).toEqual({
      qrText: 'hello',
      seed: 'abc',
      frontTextBoxes: [{ id: '1', x: 0, y: 0, text: 'hi', fontSize: 8 }],
    });
  });

  it('overwrites existing keys with new values', () => {
    window.location.hash = '#' + encode({ qrText: 'old', seed: 'abc' });
    const spy = vi.spyOn(window.history, 'replaceState');

    mergeState({ qrText: 'new' }, 'replace');

    expect(lastWrittenState(spy)).toEqual({ qrText: 'new', seed: 'abc' });
  });

  it('uses pushState when mode is push', () => {
    window.location.hash = '#' + encode({ step: 'map' });
    const spy = vi.spyOn(window.history, 'pushState');

    mergeState({ step: 'front' }, 'push');

    expect(lastWrittenState(spy)).toEqual({ step: 'front' });
  });
});
